import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';
import type { CoatExportUploadParseResult } from '@/lib/coat-of-arms/cloud-export/server-validation';
import { createRateLimitKey } from '@/lib/share/rate-limit';

const validPayload = {
  file: 'c2FuaXRpemVkLWZpbGU=',
  fileType: 'png',
  width: 1024,
  height: 1024,
  locale: 'en',
};

interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

interface LoadRouteOptions {
  rateLimiterBinding?: unknown;
  bucketBinding?: unknown;
  connectingIp?: string;
  rateLimitResult?: RateLimitResult;
  rateLimiterUnavailableMessage?: string;
}

function createFakeRateLimiterBinding() {
  return {
    limit: vi.fn(async () => ({ success: true })),
  };
}

function createFakeR2Bucket() {
  return {
    put: vi.fn(async () => null),
  };
}

function createRawCoatExportRequest(body: string, headers: Record<string, string> = {}) {
  const request = new Request('http://localhost/api/coat-export', {
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

function createCoatExportRequest(
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
) {
  return createRawCoatExportRequest(JSON.stringify(body), headers);
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
  const r2StorageModule = await vi.importActual<
    typeof import('@/lib/coat-of-arms/cloud-export/r2-storage')
  >('@/lib/coat-of-arms/cloud-export/r2-storage');
  const checkWorkersRateLimit = vi.fn(async () => {
    if (options.rateLimiterUnavailableMessage) {
      throw new rateLimitModule.WorkersRateLimiterUnavailableError(
        options.rateLimiterUnavailableMessage,
      );
    }

    return rateLimitResult;
  });
  const getCloudflareConnectingIp = vi.fn((headers: Headers) => {
    void headers;
    return connectingIp;
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
  const uploadCoatExportObject = vi.fn(r2StorageModule.uploadCoatExportObject);

  vi.doMock('cloudflare:workers', () => ({
    env: {
      SHARE_RATE_LIMITER: rateLimiterBinding,
      SHARE_BUCKET: bucketBinding,
    },
  }));
  vi.doMock('@/lib/share/workers-rate-limit', () => ({
    ...rateLimitModule,
    checkWorkersRateLimit,
    checkWorkersShareRateLimit: checkWorkersRateLimit,
  }));
  vi.doMock('@/lib/share/workers-client-ip', () => ({
    getCloudflareConnectingIp,
  }));
  vi.doMock('@/lib/coat-of-arms/cloud-export/server-validation', () => ({
    parseCoatExportUploadPayload,
  }));
  vi.doMock('@/lib/coat-of-arms/cloud-export/r2-storage', () => ({
    ...r2StorageModule,
    uploadCoatExportObject,
  }));

  const route = await import('./route');
  return {
    ...route,
    bucketBinding,
    checkWorkersRateLimit,
    getCloudflareConnectingIp,
    parseCoatExportUploadPayload,
    sanitizedFileBuffer,
    uploadCoatExportObject,
  };
}

describe('coat export API', () => {
  afterEach(() => {
    vi.doUnmock('cloudflare:workers');
    vi.doUnmock('@/lib/share/workers-rate-limit');
    vi.doUnmock('@/lib/share/workers-client-ip');
    vi.doUnmock('@/lib/coat-of-arms/cloud-export/server-validation');
    vi.doUnmock('@/lib/coat-of-arms/cloud-export/r2-storage');
    vi.restoreAllMocks();
  });

  it('rejects a non-JSON content type before reading Workers bindings', async () => {
    const { POST, checkWorkersRateLimit, getCloudflareConnectingIp } = await loadRoute();

    const response = await POST(
      createCoatExportRequest(validPayload, { 'content-type': 'text/plain' }),
    );

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({ error: 'invalid_content_type' });
    expect(getCloudflareConnectingIp).not.toHaveBeenCalled();
    expect(checkWorkersRateLimit).not.toHaveBeenCalled();
  });

  it('rejects a cross-origin request before reading Workers bindings', async () => {
    const { POST, checkWorkersRateLimit, getCloudflareConnectingIp } = await loadRoute();

    const response = await POST(
      createCoatExportRequest(validPayload, { origin: 'https://attacker.example' }),
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'invalid_origin' });
    expect(getCloudflareConnectingIp).not.toHaveBeenCalled();
    expect(checkWorkersRateLimit).not.toHaveBeenCalled();
  });

  it('returns retry metadata from the coat export IP limiter', async () => {
    const { POST, parseCoatExportUploadPayload, checkWorkersRateLimit } = await loadRoute({
      rateLimitResult: { limited: true, retryAfterSeconds: 37 },
    });

    const response = await POST(createRawCoatExportRequest('{not json'));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('37');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(parseCoatExportUploadPayload).not.toHaveBeenCalled();
    expect(checkWorkersRateLimit).toHaveBeenCalledWith(
      { limit: expect.any(Function) },
      createRateLimitKey('coat-export:ip', '203.0.113.10'),
    );
  });

  it('returns 503 when the SHARE_RATE_LIMITER binding is missing', async () => {
    const { POST, checkWorkersRateLimit, parseCoatExportUploadPayload } = await loadRoute({
      rateLimiterBinding: undefined,
      rateLimiterUnavailableMessage: 'Rate limiter binding is missing; received undefined',
    });

    const response = await POST(createCoatExportRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
    expect(checkWorkersRateLimit).toHaveBeenCalledWith(
      undefined,
      createRateLimitKey('coat-export:ip', '203.0.113.10'),
    );
    expect(parseCoatExportUploadPayload).not.toHaveBeenCalled();
  });

  it('rejects request bodies above the upload limit after limiter approval', async () => {
    const { POST, parseCoatExportUploadPayload } = await loadRoute();

    const response = await POST(
      createRawCoatExportRequest('{}', { 'content-length': String(9 * 1024 * 1024) }),
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

  it('reports when SHARE_BUCKET is not configured', async () => {
    const { POST, uploadCoatExportObject } = await loadRoute({
      bucketBinding: undefined,
    });

    const response = await POST(createCoatExportRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'storage_not_configured' });
    expect(uploadCoatExportObject).not.toHaveBeenCalled();
  });

  it('uploads an allowed request and returns only the success acknowledgement', async () => {
    const {
      POST,
      parseCoatExportUploadPayload,
      sanitizedFileBuffer,
      uploadCoatExportObject,
      bucketBinding,
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
      bucket: bucketBinding,
      id: expect.stringMatching(/^[A-Za-z0-9_-]{10}$/),
      fileType: 'png',
      fileBuffer: sanitizedFileBuffer,
    });
  });
});
