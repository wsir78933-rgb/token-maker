import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const validPayload = {
  image: 'c2FuaXRpemVkLWltYWdl',
  width: 1024,
  locale: 'en',
};

interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

interface LoadRouteOptions {
  limiterErrorStage?: 'creation' | 'check';
  rateLimitResults?: RateLimitResult[];
  storageConfigured?: boolean;
}

function createRawShareRequest(body: string, headers: Record<string, string> = {}) {
  const request = new Request('http://localhost/api/share', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost',
      'x-vercel-forwarded-for': '203.0.113.10',
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

async function loadRoute({
  limiterErrorStage,
  rateLimitResults = [{ limited: false, retryAfterSeconds: 0 }],
  storageConfigured = true,
}: LoadRouteOptions = {}) {
  vi.resetModules();

  const rateLimitModule = await import('@/lib/share/rate-limit');
  const resultQueue = [...rateLimitResults];
  const rateLimiterCheck = vi.fn(async () => {
    if (limiterErrorStage === 'check') {
      throw new rateLimitModule.RateLimiterUnavailableError('Upstash is unavailable.');
    }

    return resultQueue.shift() ?? { limited: false, retryAfterSeconds: 0 };
  });
  const createRateLimiter = vi.fn(() => {
    if (limiterErrorStage === 'creation') {
      throw new rateLimitModule.RateLimiterUnavailableError('UPSTASH_REDIS_REST_URL is not configured.');
    }

    return { check: rateLimiterCheck };
  });
  const parseShareUploadPayload = vi.fn(async () => ({
    ok: true as const,
    value: {
      imageBuffer: Buffer.from('sanitized-image'),
      width: 1024 as const,
      locale: 'en' as const,
    },
  }));

  vi.doMock('@/lib/share/rate-limit', () => ({
    ...rateLimitModule,
    createUpstashRateLimiter: createRateLimiter,
  }));
  vi.doMock('@/lib/share/server-validation', () => ({ parseShareUploadPayload }));
  vi.doMock('@/lib/share/r2-storage', () => ({
    getShareStorageEnv: vi.fn(() =>
      storageConfigured
        ? {
            accountId: 'test-account',
            accessKeyId: 'test-access-key',
            secretAccessKey: 'test-secret',
            bucketName: 'tokenmaker-shares',
            publicBaseUrl: 'https://r2.tokenmaker.one',
          }
        : null
    ),
    uploadShareImage: vi.fn(async ({ id }: { id: string }) => ({
      key: `shares/${id}.png`,
      imageUrl: `https://r2.tokenmaker.one/shares/${id}.png`,
    })),
  }));

  const route = await import('./route');
  return { ...route, createRateLimiter, parseShareUploadPayload, rateLimiterCheck };
}

describe('share API', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/share/r2-storage');
    vi.doUnmock('@/lib/share/rate-limit');
    vi.doUnmock('@/lib/share/server-validation');
    vi.restoreAllMocks();
  });

  it('rejects a non-JSON content type before creating a rate limiter', async () => {
    const { POST, createRateLimiter } = await loadRoute();

    const response = await POST(createShareRequest(validPayload, { 'content-type': 'text/plain' }));

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({ error: 'invalid_content_type' });
    expect(createRateLimiter).not.toHaveBeenCalled();
  });

  it('rejects a cross-origin request before creating a rate limiter', async () => {
    const { POST, createRateLimiter } = await loadRoute();

    const response = await POST(createShareRequest(validPayload, { origin: 'https://attacker.example' }));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'invalid_origin' });
    expect(createRateLimiter).not.toHaveBeenCalled();
  });

  it('returns retry metadata from the IP limiter before parsing invalid JSON', async () => {
    const { POST, parseShareUploadPayload, rateLimiterCheck } = await loadRoute({
      rateLimitResults: [{ limited: true, retryAfterSeconds: 37 }],
    });

    const response = await POST(createRawShareRequest('{not json'));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('37');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(parseShareUploadPayload).not.toHaveBeenCalled();
    expect(rateLimiterCheck).toHaveBeenCalledWith({
      key: expect.stringMatching(/^share:ip:[a-f0-9]{24}$/),
      maxRequests: 20,
      windowSeconds: 60,
    });
  });

  it('returns 503 when Upstash configuration is absent', async () => {
    const { POST } = await loadRoute({ limiterErrorStage: 'creation' });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
  });

  it('returns 503 when the Upstash limiter service is unavailable', async () => {
    const { POST } = await loadRoute({ limiterErrorStage: 'check' });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
  });

  it('rejects invalid JSON after the request is allowed', async () => {
    const { POST } = await loadRoute();

    const response = await POST(createRawShareRequest('{not json'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_json' });
  });

  it('rejects request bodies above the upload limit after limiter approval', async () => {
    const { POST } = await loadRoute();

    const response = await POST(
      createRawShareRequest('{}', { 'content-length': String(9 * 1024 * 1024) })
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'image_too_large' });
  });

  it('reports when R2 storage is not configured', async () => {
    const { POST } = await loadRoute({
      rateLimitResults: [
        { limited: false, retryAfterSeconds: 0 },
      ],
      storageConfigured: false,
    });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'storage_not_configured' });
  });

  it('uploads an allowed request and returns the existing share response shape', async () => {
    const { POST, parseShareUploadPayload, rateLimiterCheck } = await loadRoute();

    const response = await POST(createShareRequest(validPayload));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toMatch(/^[A-Za-z0-9_-]{10}$/);
    expect(body.shareUrl).toBe(`https://www.tokenmaker.one/share/${body.id}`);
    expect(body.imageUrl).toBe(`https://r2.tokenmaker.one/shares/${body.id}.png`);
    expect(parseShareUploadPayload).toHaveBeenCalledWith(validPayload);
    expect(rateLimiterCheck).toHaveBeenCalledTimes(1);
  });
});
