import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const RESEND_EMAILS_ENDPOINT = 'https://api.resend.com/emails';
const MAX_MESSAGE_LENGTH = 4000;
const MAX_REQUEST_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

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

function jsonResponse(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status });
}

function getContentLength(request: NextRequest) {
  const value = request.headers.get('content-length');
  if (!value) return null;

  const length = Number(value);
  return Number.isFinite(length) && length >= 0 ? length : null;
}

async function readLimitedRequestBody(request: NextRequest, maxBytes: number) {
  const contentLength = getContentLength(request);
  if (contentLength !== null && contentLength > maxBytes) {
    return null;
  }

  if (!request.body) {
    return '';
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  return forwardedFor?.split(',')[0]?.trim() || realIp || 'anonymous';
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  return false;
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
  let payload: ContactPayload;

  try {
    const body = await readLimitedRequestBody(request, MAX_REQUEST_BODY_BYTES);
    if (body === null) {
      return jsonResponse({ error: 'request_too_large' }, 413);
    }

    payload = JSON.parse(body) as ContactPayload;
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const honeypot = normalizeText(payload.website);

  if (honeypot) {
    return jsonResponse({ ok: true }, 200);
  }

  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'rate_limited' }, 429);
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

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return jsonResponse({ error: 'email_not_configured' }, 503);
  }

  const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX || 'Token Maker contact';
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

  const result = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    console.error('Resend contact email failed', {
      status: response.status,
      result,
    });

    return jsonResponse({ error: 'email_send_failed' }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}
