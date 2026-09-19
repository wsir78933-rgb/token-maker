import { randomBytes } from 'node:crypto';
import { env } from 'cloudflare:workers';
import { NextRequest, NextResponse } from 'next/server';
import {
  COAT_EXPORT_ID_LENGTH,
  COAT_EXPORT_MAX_REQUEST_BODY_BYTES,
} from '@/lib/coat-of-arms/cloud-export/constants';
import { uploadCoatExportObject } from '@/lib/coat-of-arms/cloud-export/r2-storage';
import { parseCoatExportUploadPayload } from '@/lib/coat-of-arms/cloud-export/server-validation';
import {
  getJsonContentTypeError,
  getSameOriginError,
  readRequestBodyWithinLimit,
} from '@/lib/request-validation';
import { createRateLimitKey } from '@/lib/share/rate-limit';
import { getCloudflareConnectingIp } from '@/lib/share/workers-client-ip';
import {
  WorkersRateLimiterUnavailableError,
  checkWorkersRateLimit,
} from '@/lib/share/workers-rate-limit';
import { WorkersR2StorageError } from '@/lib/share/workers-r2-storage';

function jsonResponse(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

function createCoatExportId() {
  return randomBytes(8).toString('base64url').slice(0, COAT_EXPORT_ID_LENGTH);
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

function createCoatExportRateLimitKey(headers: Headers) {
  return createRateLimitKey('coat-export:ip', getCloudflareConnectingIp(headers));
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
    const ipLimitResult = await checkWorkersRateLimit(
      env.SHARE_RATE_LIMITER,
      createCoatExportRateLimitKey(request.headers),
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

  const bodyResult = await readRequestBodyWithinLimit(
    request,
    COAT_EXPORT_MAX_REQUEST_BODY_BYTES,
  );
  if (!bodyResult.ok) {
    return jsonResponse({ error: 'file_too_large' }, 413);
  }

  const payload = parseJsonPayload(bodyResult.value);
  if (payload === null) {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const parsedPayload = await parseCoatExportUploadPayload(payload);
  if (!parsedPayload.ok) {
    return jsonResponse({ error: parsedPayload.error }, parsedPayload.status);
  }

  const shareBucket = env.SHARE_BUCKET;
  if (shareBucket == null) {
    return jsonResponse({ error: 'storage_not_configured' }, 503);
  }

  try {
    await uploadCoatExportObject({
      bucket: shareBucket,
      id: createCoatExportId(),
      fileType: parsedPayload.value.fileType,
      fileBuffer: parsedPayload.value.fileBuffer,
    });
  } catch (error) {
    if (error instanceof WorkersR2StorageError) {
      return jsonResponse({ error: 'storage_not_configured' }, 503);
    }

    throw error;
  }

  return jsonResponse({ ok: true }, 200);
}
