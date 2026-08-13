import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/env';
import {
  getJsonContentTypeError,
  getSameOriginError,
  readRequestBodyWithinLimit,
} from '@/lib/request-validation';
import { getClientIp } from '@/lib/share/client-ip';
import {
  RateLimiterUnavailableError,
  createRateLimitKey,
  createUpstashRateLimiter,
} from '@/lib/share/rate-limit';

export const runtime = 'nodejs';

const RESEND_EMAILS_ENDPOINT = 'https://api.resend.com/emails';
const MAX_MESSAGE_LENGTH = 4000;
const MAX_REQUEST_BODY_BYTES = 32 * 1024;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;
const CONTACT_RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  locale?: unknown;
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function jsonResponse(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

function parseContactPayload(body: Uint8Array): ContactPayload | null {
  try {
    return JSON.parse(new TextDecoder().decode(body)) as ContactPayload;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }
}

function isMissingServerEnvironmentError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.message.startsWith('Missing required environment variable: ')
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildEmailHtml({
  name,
  email,
  message,
  locale,
}: {
  name: string;
  email: string;
  message: string;
  locale: string;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');
  const safeLocale = escapeHtml(locale);

  return `
    <div style="font-family: Arial, sans-serif; color: #18181b; line-height: 1.6;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">New Token Maker contact message</h1>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
      <p style="margin: 0 0 18px;"><strong>Locale:</strong> ${safeLocale}</p>
      <div style="border-top: 1px solid #e4e4e7; padding-top: 16px;">
        ${safeMessage}
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  const contentTypeError = getJsonContentTypeError(request.headers);
  if (contentTypeError) {
    return jsonResponse({ error: contentTypeError }, 415);
  }

  const originError = getSameOriginError(request);
  if (originError) {
    return jsonResponse({ error: originError }, 403);
  }

  let rateLimiter: ReturnType<typeof createUpstashRateLimiter>;
  try {
    rateLimiter = createUpstashRateLimiter();
    const ipLimitResult = await rateLimiter.check({
      key: createRateLimitKey('contact:ip', getClientIp(request.headers)),
      maxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
      windowSeconds: CONTACT_RATE_LIMIT_WINDOW_SECONDS,
    });

    if (ipLimitResult.limited) {
      return jsonResponse(
        { error: 'rate_limited' },
        429,
        { 'Retry-After': String(ipLimitResult.retryAfterSeconds) }
      );
    }
  } catch (error) {
    if (error instanceof RateLimiterUnavailableError) {
      return jsonResponse({ error: 'rate_limiter_unavailable' }, 503);
    }

    throw error;
  }

  const bodyResult = await readRequestBodyWithinLimit(request, MAX_REQUEST_BODY_BYTES);
  if (!bodyResult.ok) {
    return jsonResponse({ error: 'request_too_large' }, 413);
  }

  const payload = parseContactPayload(bodyResult.value);
  if (!payload) {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const honeypot = normalizeText(payload.website);
  if (honeypot) {
    return jsonResponse({ ok: true }, 200);
  }

  const name = normalizeText(payload.name);
  const email = normalizeText(payload.email).toLowerCase();
  const message = normalizeText(payload.message);
  const locale = normalizeText(payload.locale) === 'zh' ? 'zh' : 'en';

  if (name.length < 2 || name.length > 80) {
    return jsonResponse({ error: 'invalid_name' }, 400);
  }

  if (!emailPattern.test(email) || email.length > 254) {
    return jsonResponse({ error: 'invalid_email' }, 400);
  }

  if (message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: 'invalid_message' }, 400);
  }

  try {
    const emailLimitResult = await rateLimiter.check({
      key: createRateLimitKey('contact:email', email),
      maxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
      windowSeconds: CONTACT_RATE_LIMIT_WINDOW_SECONDS,
    });

    if (emailLimitResult.limited) {
      return jsonResponse(
        { error: 'rate_limited' },
        429,
        { 'Retry-After': String(emailLimitResult.retryAfterSeconds) }
      );
    }
  } catch (error) {
    if (error instanceof RateLimiterUnavailableError) {
      return jsonResponse({ error: 'rate_limiter_unavailable' }, 503);
    }

    throw error;
  }

  let env: ReturnType<typeof getServerEnv>;
  try {
    env = getServerEnv();
  } catch (error) {
    if (isMissingServerEnvironmentError(error)) {
      return jsonResponse({ error: 'email_not_configured' }, 503);
    }

    throw error;
  }

  const {
    RESEND_API_KEY: apiKey,
    RESEND_FROM_EMAIL: from,
    CONTACT_TO_EMAIL: to,
    CONTACT_SUBJECT_PREFIX: subjectPrefix,
  } = env;
  const subjectName = name.length > 48 ? `${name.slice(0, 48)}...` : name;
  const subject = `${subjectPrefix}: ${subjectName}`;
  const text = [
    'New Token Maker contact message',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Locale: ${locale}`,
    '',
    message,
  ].join('\n');

  const response = await fetch(RESEND_EMAILS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'token-maker-app/0.1',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      reply_to: email,
      text,
      html: buildEmailHtml({ name, email, message, locale }),
      tags: [{ name: 'category', value: 'contact_form' }],
    }),
  });

  let result: unknown = null;
  try {
    result = await response.json();
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
  }

  if (!response.ok) {
    console.error('Resend contact email failed', {
      status: response.status,
      result,
    });

    return jsonResponse({ error: 'email_send_failed' }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}
