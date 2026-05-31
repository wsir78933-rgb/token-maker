import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  SHARE_ID_LENGTH,
  SHARE_MAX_REQUEST_BODY_BYTES,
  SHARE_RATE_LIMIT_CLEANUP_INTERVAL_MS,
  SHARE_RATE_LIMIT_MAX_BUCKETS,
  SHARE_RATE_LIMIT_MAX_REQUESTS,
  SHARE_RATE_LIMIT_WINDOW_MS,
  getSharePageUrl,
} from '@/lib/share/constants';
import { getClientIp } from '@/lib/share/client-ip';
import { getShareStorageEnv, uploadShareImage } from '@/lib/share/r2-storage';
import { MemoryRateLimiter, createRateLimitKey } from '@/lib/share/rate-limit';
import { parseShareUploadPayload } from '@/lib/share/server-validation';
import { getSiteUrl } from '@/lib/site-content';

export const runtime = 'nodejs';

const shareRateLimiter = new MemoryRateLimiter({
  cleanupIntervalMs: SHARE_RATE_LIMIT_CLEANUP_INTERVAL_MS,
  maxBuckets: SHARE_RATE_LIMIT_MAX_BUCKETS,
  maxRequests: SHARE_RATE_LIMIT_MAX_REQUESTS,
  windowMs: SHARE_RATE_LIMIT_WINDOW_MS,
});

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

function createShareId() {
  return randomBytes(8).toString('base64url').slice(0, SHARE_ID_LENGTH);
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    const body = await readLimitedRequestBody(request, SHARE_MAX_REQUEST_BODY_BYTES);
    if (body === null) {
      return jsonResponse({ error: 'image_too_large' }, 413);
    }

    payload = JSON.parse(body);
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const ip = getClientIp(request.headers);
  if (shareRateLimiter.isLimited(createRateLimitKey('ip', ip))) {
    return jsonResponse({ error: 'rate_limited' }, 429);
  }

  const parsedPayload = parseShareUploadPayload(payload);
  if (!parsedPayload.ok) {
    return jsonResponse({ error: parsedPayload.error }, parsedPayload.status);
  }

  const env = getShareStorageEnv();
  if (!env) {
    return jsonResponse({ error: 'storage_not_configured' }, 503);
  }

  const id = createShareId();

  try {
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
  } catch (error) {
    console.error('Share image upload failed', error);
    return jsonResponse({ error: 'upload_failed' }, 502);
  }
}
