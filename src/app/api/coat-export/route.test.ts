import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';
import type { CoatExportUploadParseResult } from '@/lib/coat-of-arms/cloud-export/server-validation';

const validPayload = {
  file: 'c2FuaXRpemVkLWZpbGU=',
  fileType: 'png',
  width: 1024,
  height: 1024,
  locale: 'en',
};

const configuredStorageEnvironment = {
  accountId: 'test-account',
  accessKeyId: 'test-access-key',
  secretAccessKey: 'test-secret',
  bucketName: 'tokenmaker-shares',
  publicBaseUrl: 'https://r2.tokenmaker.one',
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

function createRawCoatExportRequest(body: string, headers: Record<string, string> = {}) {
  const request = new Request('http://localhost/api/coat-export', {
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

function createCoatExportRequest(
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) {
  return createRawCoatExportRequest(JSON.stringify(body), headers);
}

async function loadRoute({
  limiterErrorStage,
  rateLimitResults = [{ limited: false, retryAfterSeconds: 0 }],
  storageConfigured = true,
}: LoadRouteOptions = {}) {
  vi.resetModules();

  const rateLimitModule = await import('@/lib/share/rate-limit');
  const queuedRateLimitResults = [...rateLimitResults];
  const rateLimiterCheck = vi.fn(async () => {
    if (limiterErrorStage === 'check') {
      throw new rateLimitModule.RateLimiterUnavailableError('Upstash is unavailable.');
    }

    return queuedRateLimitResults.shift() ?? { limited: false, retryAfterSeconds: 0 };
  });
  const createRateLimiter = vi.fn(() => {
    if (limiterErrorStage === 'creation') {
      throw new rateLimitModule.RateLimiterUnavailableError(
        'UPSTASH_REDIS_REST_URL is not configured.'
      );
    }

    return { check: rateLimiterCheck };
  });
  const sanitizedFileBuffer = Buffer.from('sanitized-file');
  const parseCoatExportUploadPayload = vi.fn<
    () => Promise<CoatExportUploadParseResult>
  >(async () => ({
    ok: true as const,
    value: {
      fileBuffer: sanitizedFileBuffer,
      fileType: 'png' as const,
      width: 1024 as const,
      height: 1024 as const,
      locale: 'en' as const,
    },
  }));
  const getShareStorageEnv = vi.fn(() =>
    storageConfigured ? configuredStorageEnvironment : null
  );
  const uploadCoatExportObject = vi.fn(async ({ id }: { id: string }) => ({
    key: `coats/${id}.png`,
  }));

  vi.doMock('@/lib/share/rate-limit', () => ({
    ...rateLimitModule,
    createUpstashRateLimiter: createRateLimiter,
  }));
  vi.doMock('@/lib/share/r2-storage', () => ({ getShareStorageEnv }));
  vi.doMock('@/lib/coat-of-arms/cloud-export/server-validation', () => ({
    parseCoatExportUploadPayload,
  }));
  vi.doMock('@/lib/coat-of-arms/cloud-export/r2-storage', () => ({
    uploadCoatExportObject,
  }));

  const route = await import('./route');
  return {
    ...route,
    createRateLimiter,
    getShareStorageEnv,
    parseCoatExportUploadPayload,
    rateLimiterCheck,
    sanitizedFileBuffer,
    uploadCoatExportObject,
  };
}

describe('coat export API', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/share/r2-storage');
    vi.doUnmock('@/lib/share/rate-limit');
    vi.doUnmock('@/lib/coat-of-arms/cloud-export/server-validation');
    vi.doUnmock('@/lib/coat-of-arms/cloud-export/r2-storage');
    vi.restoreAllMocks();
  });

  it('rejects a non-JSON content type before creating a rate limiter', async () => {
    const { POST, createRateLimiter } = await loadRoute();

    const response = await POST(
      createCoatExportRequest(validPayload, { 'content-type': 'text/plain' })
    );

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({ error: 'invalid_content_type' });
    expect(createRateLimiter).not.toHaveBeenCalled();
  });

  it('rejects a cross-origin request before creating a rate limiter', async () => {
    const { POST, createRateLimiter } = await loadRoute();

    const response = await POST(
      createCoatExportRequest(validPayload, { origin: 'https://attacker.example' })
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'invalid_origin' });
    expect(createRateLimiter).not.toHaveBeenCalled();
  });

  it('returns retry metadata from the coat export IP limiter', async () => {
    const { POST, parseCoatExportUploadPayload, rateLimiterCheck } = await loadRoute({
      rateLimitResults: [{ limited: true, retryAfterSeconds: 37 }],
    });

    const response = await POST(createRawCoatExportRequest('{not json'));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('37');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(parseCoatExportUploadPayload).not.toHaveBeenCalled();
    expect(rateLimiterCheck).toHaveBeenCalledWith({
      key: expect.stringMatching(/^coat-export:ip:[a-f0-9]{24}$/),
      maxRequests: 20,
      windowSeconds: 60,
    });
  });

  it('returns 503 when Upstash configuration is absent', async () => {
    const { POST } = await loadRoute({ limiterErrorStage: 'creation' });

    const response = await POST(createCoatExportRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
  });

  it('returns 503 when the Upstash limiter service is unavailable', async () => {
    const { POST } = await loadRoute({ limiterErrorStage: 'check' });

    const response = await POST(createCoatExportRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
  });

  it('rejects request bodies above the upload limit after limiter approval', async () => {
    const { POST, parseCoatExportUploadPayload } = await loadRoute();

    const response = await POST(
      createRawCoatExportRequest('{}', { 'content-length': String(9 * 1024 * 1024) })
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'file_too_large' });
    expect(parseCoatExportUploadPayload).not.toHaveBeenCalled();
  });

  it('rejects invalid JSON after the request is allowed', async () => {
    const { POST, parseCoatExportUploadPayload } = await loadRoute();

    const response = await POST(createRawCoatExportRequest('{not json'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_json' });
    expect(parseCoatExportUploadPayload).not.toHaveBeenCalled();
  });

  it('returns the payload validator error without attempting storage', async () => {
    const { POST, parseCoatExportUploadPayload, uploadCoatExportObject } = await loadRoute();
    parseCoatExportUploadPayload.mockResolvedValueOnce({
      ok: false as const,
      error: 'invalid_file',
      status: 400,
    });

    const response = await POST(createCoatExportRequest(validPayload));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_file' });
    expect(uploadCoatExportObject).not.toHaveBeenCalled();
  });

  it('reports when R2 storage is not configured', async () => {
    const { POST, getShareStorageEnv, uploadCoatExportObject } = await loadRoute({
      storageConfigured: false,
    });

    const response = await POST(createCoatExportRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'storage_not_configured' });
    expect(getShareStorageEnv).toHaveBeenCalledTimes(1);
    expect(uploadCoatExportObject).not.toHaveBeenCalled();
  });

  it('uploads an allowed request and returns only the success acknowledgement', async () => {
    const {
      POST,
      parseCoatExportUploadPayload,
      sanitizedFileBuffer,
      uploadCoatExportObject,
    } = await loadRoute();

    const response = await POST(createCoatExportRequest(validPayload));
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ ok: true });
    expect(responseBody).not.toHaveProperty('imageUrl');
    expect(responseBody).not.toHaveProperty('shareUrl');
    expect(responseBody).not.toHaveProperty('key');
    expect(parseCoatExportUploadPayload).toHaveBeenCalledWith(validPayload);
    expect(uploadCoatExportObject).toHaveBeenCalledWith({
      env: configuredStorageEnvironment,
      id: expect.stringMatching(/^[A-Za-z0-9_-]{10}$/),
      fileType: 'png',
      fileBuffer: sanitizedFileBuffer,
    });
  });
});
