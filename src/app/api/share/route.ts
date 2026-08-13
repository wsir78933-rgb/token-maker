import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  SHARE_ID_LENGTH,
  SHARE_MAX_REQUEST_BODY_BYTES,
  getSharePageUrl,
} from '@/lib/share/constants';
import { getClientIp } from '@/lib/share/client-ip';
import { getShareStorageEnv, uploadShareImage } from '@/lib/share/r2-storage';
import {
  RateLimiterUnavailableError,
  createRateLimitKey,
  createUpstashRateLimiter,
} from '@/lib/share/rate-limit';
import { parseShareUploadPayload } from '@/lib/share/server-validation';
import {
  getJsonContentTypeError,
  getSameOriginError,
  readRequestBodyWithinLimit,
} from '@/lib/request-validation';
import { getSiteUrl } from '@/lib/site-content';

export const runtime = 'nodejs';

const SHARE_RATE_LIMIT_MAX_REQUESTS = 20;
const SHARE_RATE_LIMIT_WINDOW_SECONDS = 60;

function jsonResponse(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

function createShareId() {
  return randomBytes(8).toString('base64url').slice(0, SHARE_ID_LENGTH);
}

function parseJsonPayload(body: Uint8Array): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(body));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }
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
      key: createRateLimitKey('share:ip', getClientIp(request.headers)),
      maxRequests: SHARE_RATE_LIMIT_MAX_REQUESTS,
      windowSeconds: SHARE_RATE_LIMIT_WINDOW_SECONDS,
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

  const bodyResult = await readRequestBodyWithinLimit(request, SHARE_MAX_REQUEST_BODY_BYTES);
  if (!bodyResult.ok) {
    return jsonResponse({ error: 'image_too_large' }, 413);
  }

  const payload = parseJsonPayload(bodyResult.value);
  if (payload === null) {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const parsedPayload = await parseShareUploadPayload(payload);
  if (!parsedPayload.ok) {
    return jsonResponse({ error: parsedPayload.error }, parsedPayload.status);
  }

  const env = getShareStorageEnv();
  if (!env) {
    return jsonResponse({ error: 'storage_not_configured' }, 503);
  }

  const id = createShareId();
  const { imageUrl } = await uploadShareImage({
    env,
    id,
    imageBuffer: parsedPayload.value.imageBuffer,
  });

  return jsonResponse(
    {
      id,
      shareUrl: getSharePageUrl(id, parsedPayload.value.locale, getSiteUrl()),
      imageUrl,
    },
    200
  );
}
