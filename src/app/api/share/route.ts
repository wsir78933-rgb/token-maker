import { randomBytes } from 'node:crypto';
import { env } from 'cloudflare:workers';
import { NextRequest, NextResponse } from 'next/server';
import {
  SHARE_ID_LENGTH,
  SHARE_MAX_REQUEST_BODY_BYTES,
  getSharePageUrl,
} from '@/lib/share/constants';
import { getCloudflareConnectingIp } from '@/lib/share/workers-client-ip';
import {
  WorkersRateLimiterUnavailableError,
  checkWorkersShareRateLimit,
} from '@/lib/share/workers-rate-limit';
import {
  uploadShareImageToBucket,
  WorkersR2StorageError,
} from '@/lib/share/workers-r2-storage';
import { parseShareUploadPayload } from '@/lib/share/server-validation';
import {
  getJsonContentTypeError,
  getSameOriginError,
  readRequestBodyWithinLimit,
} from '@/lib/request-validation';
import { getSiteUrl } from '@/lib/site-content';

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

function createShareRateLimitKey(headers: Headers) {
  return `share:ip:${getCloudflareConnectingIp(headers)}`;
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

  try {
    const ipLimitResult = await checkWorkersShareRateLimit(
      env.SHARE_RATE_LIMITER,
      createShareRateLimitKey(request.headers),
    );

    if (ipLimitResult.limited) {
      return jsonResponse(
        { error: 'rate_limited' },
        429,
        { 'Retry-After': String(ipLimitResult.retryAfterSeconds) },
      );
    }
  } catch (error) {
    if (error instanceof WorkersRateLimiterUnavailableError) {
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

  const shareBucket = env.SHARE_BUCKET;
  if (shareBucket == null) {
    return jsonResponse({ error: 'storage_not_configured' }, 503);
  }

  const id = createShareId();
  let imageUrl: string;
  try {
    const uploadResult = await uploadShareImageToBucket({
      bucket: shareBucket,
      id,
      imageBytes: parsedPayload.value.imageBuffer,
    });
    imageUrl = uploadResult.imageUrl;
  } catch (error) {
    if (error instanceof WorkersR2StorageError) {
      return jsonResponse({ error: 'storage_not_configured' }, 503);
    }

    throw error;
  }

  return jsonResponse(
    {
      id,
      shareUrl: getSharePageUrl(id, parsedPayload.value.locale, getSiteUrl()),
      imageUrl,
    },
    200,
  );
}
