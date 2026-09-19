import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';
import type { ShareUploadParseResult } from '@/lib/share/server-validation';

const validPayload = {
  image: 'c2FuaXRpemVkLWltYWdl',
  width: 1024,
  locale: 'en',
};

const sanitizedImageBytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);

interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

interface LoadRouteOptions {
  rateLimiterBinding?: unknown;
  bucketBinding?: unknown;
  connectingIp?: string;
  rateLimitResult?: RateLimitResult;
  rateLimiterError?: Error;
  rateLimiterUnavailableMessage?: string;
  parseResult?: ShareUploadParseResult;
  useActualParser?: boolean;
}

function createFakeRateLimiterBinding() {
  return {
    limit: vi.fn(async () => ({ success: true })),
  };
}

function createFakeR2Bucket() {
  return {
    put: vi.fn(async (
      _key: string,
      _imageBytes: Uint8Array,
      _options: {
        httpMetadata?: {
          contentType?: string;
          cacheControl?: string;
        };
      },
    ) => {
      void _key;
      void _imageBytes;
      void _options;
    }),
  };
}

function createRawShareRequest(body: string, headers: Record<string, string> = {}) {
  const request = new Request('http://localhost/api/share', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost',
      'CF-Connecting-IP': '203.0.113.10',
      ...headers,
    },
    body,
  });

  Object.defineProperty(request, 'nextUrl', { value: new URL(request.url) });
  return request as NextRequest;
}

function createShareRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return createRawShareRequest(JSON.stringify(body), headers);
}

async function loadRoute(options: LoadRouteOptions = {}) {
  const rateLimiterBinding = 'rateLimiterBinding' in options
    ? options.rateLimiterBinding
    : createFakeRateLimiterBinding();
  const bucketBinding = 'bucketBinding' in options
    ? options.bucketBinding
    : createFakeR2Bucket();
  const connectingIp = options.connectingIp ?? '203.0.113.10';
  const rateLimitResult = options.rateLimitResult ?? { limited: false, retryAfterSeconds: 0 };

  vi.resetModules();

  const rateLimitModule = await vi.importActual<typeof import('@/lib/share/workers-rate-limit')>(
    '@/lib/share/workers-rate-limit',
  );
  const serverValidationModule = await vi.importActual<typeof import('@/lib/share/server-validation')>(
    '@/lib/share/server-validation',
  );
  const r2StorageModule = await vi.importActual<typeof import('@/lib/share/workers-r2-storage')>(
    '@/lib/share/workers-r2-storage',
  );
  const checkWorkersRateLimit = vi.fn(async () => {
    if (options.rateLimiterError) {
      throw options.rateLimiterError;
    }

    if (options.rateLimiterUnavailableMessage) {
      throw new rateLimitModule.WorkersRateLimiterUnavailableError(
        options.rateLimiterUnavailableMessage,
      );
    }

    return rateLimitResult;
  });
  const checkWorkersShareRateLimit = checkWorkersRateLimit;
  const getCloudflareConnectingIp = vi.fn((headers: Headers) => {
    void headers;
    return connectingIp;
  });
  const parseShareUploadPayload = vi.fn(async (
    payload: unknown,
  ): Promise<ShareUploadParseResult> => {
    if (options.parseResult !== undefined) {
      return options.parseResult;
    }

    if (options.useActualParser) {
      return serverValidationModule.parseShareUploadPayload(payload);
    }

    return {
      ok: true,
      value: {
        imageBuffer: Buffer.from(sanitizedImageBytes),
        width: 1024,
        locale: 'en',
      },
    };
  });
  const uploadShareImageToBucket = vi.fn(r2StorageModule.uploadShareImageToBucket);

  vi.doMock('cloudflare:workers', () => ({
    env: {
      SHARE_RATE_LIMITER: rateLimiterBinding,
      SHARE_BUCKET: bucketBinding,
    },
  }));
  vi.doMock('@/lib/share/workers-rate-limit', () => ({
    ...rateLimitModule,
    checkWorkersRateLimit,
    checkWorkersShareRateLimit,
  }));
  vi.doMock('@/lib/share/workers-client-ip', () => ({
    getCloudflareConnectingIp,
  }));
  vi.doMock('@/lib/share/server-validation', () => ({
    ...serverValidationModule,
    parseShareUploadPayload,
  }));
  vi.doMock('@/lib/share/workers-r2-storage', async () => {
    return {
      ...r2StorageModule,
      uploadShareImageToBucket,
    };
  });

  const route = await import('./route');
  return {
    ...route,
    bucketBinding,
    checkWorkersShareRateLimit,
    getCloudflareConnectingIp,
    parseShareUploadPayload,
    rateLimiterBinding,
    uploadShareImageToBucket,
  };
}

describe('share API', () => {
  afterEach(() => {
    vi.doUnmock('cloudflare:workers');
    vi.doUnmock('@/lib/share/workers-rate-limit');
    vi.doUnmock('@/lib/share/workers-client-ip');
    vi.doUnmock('@/lib/share/server-validation');
    vi.doUnmock('@/lib/share/workers-r2-storage');
    vi.restoreAllMocks();
  });

  it('rejects a non-JSON content type before reading Workers bindings', async () => {
    const { POST, checkWorkersShareRateLimit, getCloudflareConnectingIp } = await loadRoute();

    const response = await POST(createShareRequest(validPayload, { 'content-type': 'text/plain' }));

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({ error: 'invalid_content_type' });
    expect(getCloudflareConnectingIp).not.toHaveBeenCalled();
    expect(checkWorkersShareRateLimit).not.toHaveBeenCalled();
  });

  it('rejects a cross-origin request before reading Workers bindings', async () => {
    const { POST, checkWorkersShareRateLimit, getCloudflareConnectingIp } = await loadRoute();

    const response = await POST(createShareRequest(validPayload, { origin: 'https://attacker.example' }));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'invalid_origin' });
    expect(getCloudflareConnectingIp).not.toHaveBeenCalled();
    expect(checkWorkersShareRateLimit).not.toHaveBeenCalled();
  });

  it('returns retry metadata from the IP limiter before parsing invalid JSON', async () => {
    const { POST, checkWorkersShareRateLimit, getCloudflareConnectingIp, parseShareUploadPayload } = await loadRoute({
      rateLimitResult: { limited: true, retryAfterSeconds: 37 },
    });

    const response = await POST(createRawShareRequest('{not json'));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('37');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(getCloudflareConnectingIp).toHaveBeenCalledTimes(1);
    expect(checkWorkersShareRateLimit).toHaveBeenCalledWith(
      { limit: expect.any(Function) },
      'share:ip:203.0.113.10',
    );
    expect(parseShareUploadPayload).not.toHaveBeenCalled();
  });

  it('uses the Cloudflare connecting IP as the rate-limit key', async () => {
    const request = createShareRequest(validPayload, { 'CF-Connecting-IP': '2001:db8::1' });
    const { POST, checkWorkersShareRateLimit, getCloudflareConnectingIp } = await loadRoute({
      connectingIp: '2001:db8::1',
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(getCloudflareConnectingIp).toHaveBeenCalledWith(request.headers);
    expect(checkWorkersShareRateLimit).toHaveBeenCalledWith(
      expect.anything(),
      'share:ip:2001:db8::1',
    );
  });

  it('returns 503 when the SHARE_RATE_LIMITER binding is missing', async () => {
    const { POST, checkWorkersShareRateLimit, parseShareUploadPayload } = await loadRoute({
      rateLimiterBinding: undefined,
      rateLimiterUnavailableMessage: 'SHARE_RATE_LIMITER binding is missing; received undefined',
    });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
    expect(checkWorkersShareRateLimit).toHaveBeenCalledWith(undefined, 'share:ip:203.0.113.10');
    expect(parseShareUploadPayload).not.toHaveBeenCalled();
  });

  it('returns 503 when the Workers rate limiter is unavailable during check', async () => {
    const { POST } = await loadRoute({
      rateLimiterUnavailableMessage:
        'SHARE_RATE_LIMITER.limit() returned an invalid result; received "ok"',
    });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
  });

  it('propagates unknown rate-limiter exceptions without mapping them', async () => {
    const unexpected = new Error('workerd exploded');
    const { POST } = await loadRoute({ rateLimiterError: unexpected });

    await expect(POST(createShareRequest(validPayload))).rejects.toBe(unexpected);
  });

  it('rejects invalid JSON after the request is allowed', async () => {
    const { POST, parseShareUploadPayload } = await loadRoute();

    const response = await POST(createRawShareRequest('{not json'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_json' });
    expect(parseShareUploadPayload).not.toHaveBeenCalled();
  });

  it('rejects request bodies above the upload limit after limiter approval', async () => {
    const { POST, parseShareUploadPayload } = await loadRoute();

    const response = await POST(
      createRawShareRequest('{}', { 'content-length': String(9 * 1024 * 1024) }),
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'image_too_large' });
    expect(parseShareUploadPayload).not.toHaveBeenCalled();
  });

  it('maps the upload parser invalid_image before touching storage', async () => {
    const { POST, parseShareUploadPayload, uploadShareImageToBucket } = await loadRoute({
      parseResult: { ok: false, error: 'invalid_image', status: 400 },
    });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_image' });
    expect(parseShareUploadPayload).toHaveBeenCalledWith(validPayload);
    expect(uploadShareImageToBucket).not.toHaveBeenCalled();
  });

  it('maps the upload parser image_too_large before touching storage', async () => {
    const { POST, uploadShareImageToBucket } = await loadRoute({
      parseResult: { ok: false, error: 'image_too_large', status: 413 },
    });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'image_too_large' });
    expect(uploadShareImageToBucket).not.toHaveBeenCalled();
  });

  it('reports when the SHARE_BUCKET binding is missing after parsing', async () => {
    const { POST, parseShareUploadPayload, uploadShareImageToBucket } = await loadRoute({
      bucketBinding: undefined,
    });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'storage_not_configured' });
    expect(parseShareUploadPayload).toHaveBeenCalledWith(validPayload);
    expect(uploadShareImageToBucket).not.toHaveBeenCalled();
  });

  it('uses strict parser rejection for invalid base64 without touching storage', async () => {
    const invalidPayload = { ...validPayload, image: 'not-valid-base64!' };
    const { POST, bucketBinding, parseShareUploadPayload, uploadShareImageToBucket } = await loadRoute({
      useActualParser: true,
    });

    const response = await POST(createShareRequest(invalidPayload));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_image' });
    expect(parseShareUploadPayload).toHaveBeenCalledWith(invalidPayload);
    expect(uploadShareImageToBucket).not.toHaveBeenCalled();
    expect(bucketBinding).toMatchObject({ put: expect.any(Function) });
    expect((bucketBinding as { put: ReturnType<typeof vi.fn> }).put).not.toHaveBeenCalled();
  });

  it('maps an invalid SHARE_BUCKET binding error to storage_not_configured', async () => {
    const invalidBucket = { put: 'not-a-function' };
    const { POST, parseShareUploadPayload, uploadShareImageToBucket } = await loadRoute({
      bucketBinding: invalidBucket,
    });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'storage_not_configured' });
    expect(parseShareUploadPayload).toHaveBeenCalledWith(validPayload);
    expect(uploadShareImageToBucket).toHaveBeenCalledTimes(1);
  });

  it('propagates an unknown R2 put exception unchanged', async () => {
    const unexpected = new Error('R2 put failed');
    const shareBucket = createFakeR2Bucket();
    shareBucket.put.mockRejectedValueOnce(unexpected);
    const { POST, uploadShareImageToBucket } = await loadRoute({
      bucketBinding: shareBucket,
    });

    await expect(POST(createShareRequest(validPayload))).rejects.toBe(unexpected);
    expect(uploadShareImageToBucket).toHaveBeenCalledTimes(1);
  });

  it('parses before uploading and returns the existing successful share response shape', async () => {
    const shareBucket = createFakeR2Bucket();
    const { POST, checkWorkersShareRateLimit, parseShareUploadPayload, uploadShareImageToBucket } = await loadRoute({
      bucketBinding: shareBucket,
    });

    const response = await POST(createShareRequest(validPayload));
    const body = (await response.json()) as {
      id: string;
      shareUrl: string;
      imageUrl: string;
    };
    const parsedImageBuffer = Buffer.from(sanitizedImageBytes);

    expect(response.status).toBe(200);
    expect(body.id).toMatch(/^[A-Za-z0-9_-]{10}$/);
    expect(body.shareUrl).toBe(`https://www.tokenmaker.one/share/${body.id}`);
    expect(body.imageUrl).toBe(`https://r2.tokenmaker.one/shares/${body.id}.png`);
    expect(checkWorkersShareRateLimit).toHaveBeenCalledTimes(1);
    expect(parseShareUploadPayload).toHaveBeenCalledWith(validPayload);
    expect(uploadShareImageToBucket).toHaveBeenCalledTimes(1);
    expect(uploadShareImageToBucket).toHaveBeenCalledWith({
      bucket: shareBucket,
      id: body.id,
      imageBytes: parsedImageBuffer,
    });
    expect(uploadShareImageToBucket.mock.invocationCallOrder[0])
      .toBeGreaterThan(parseShareUploadPayload.mock.invocationCallOrder[0]);
    expect(shareBucket.put).toHaveBeenCalledWith(
      `shares/${body.id}.png`,
      parsedImageBuffer,
      {
        httpMetadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=2592000, immutable',
        },
      },
    );
  });
});
