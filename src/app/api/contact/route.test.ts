import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';
import { createRateLimitKey } from '@/lib/share/rate-limit';

const validPayload = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a valid test message.',
  locale: 'en',
};

interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

interface LoadRouteOptions {
  rateLimiterBinding?: unknown;
  connectingIp?: string;
  rateLimitResults?: RateLimitResult[];
  rateLimiterUnavailableMessage?: string;
  emailSettings?: Record<string, string>;
}

function createFakeRateLimiterBinding() {
  return {
    limit: vi.fn(async () => ({ success: true })),
  };
}

function createRawContactRequest(body: string, headers: Record<string, string> = {}) {
  const request = new Request('http://localhost/api/contact', {
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

function createContactRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return createRawContactRequest(JSON.stringify(body), headers);
}

async function loadRoute(options: LoadRouteOptions = {}) {
  const rateLimiterBinding = 'rateLimiterBinding' in options
    ? options.rateLimiterBinding
    : createFakeRateLimiterBinding();
  const connectingIp = options.connectingIp ?? '203.0.113.10';
  const queuedRateLimitResults = [...(options.rateLimitResults ?? [
    { limited: false, retryAfterSeconds: 0 },
    { limited: false, retryAfterSeconds: 0 },
  ])];
  const emailSettings = options.emailSettings ?? {
    RESEND_API_KEY: 'test-key',
    RESEND_FROM_EMAIL: 'Token Maker <from@example.com>',
    CONTACT_TO_EMAIL: 'to@example.com',
  };

  vi.resetModules();

  const rateLimitModule = await vi.importActual<typeof import('@/lib/share/workers-rate-limit')>(
    '@/lib/share/workers-rate-limit',
  );
  const checkWorkersRateLimit = vi.fn(async () => {
    if (options.rateLimiterUnavailableMessage) {
      throw new rateLimitModule.WorkersRateLimiterUnavailableError(
        options.rateLimiterUnavailableMessage,
      );
    }

    return queuedRateLimitResults.shift() ?? { limited: false, retryAfterSeconds: 0 };
  });
  const getCloudflareConnectingIp = vi.fn((headers: Headers) => {
    void headers;
    return connectingIp;
  });

  vi.doMock('cloudflare:workers', () => ({
    env: {
      CONTACT_RATE_LIMITER: rateLimiterBinding,
      ...emailSettings,
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

  const route = await import('./route');
  return {
    ...route,
    checkWorkersRateLimit,
    getCloudflareConnectingIp,
    rateLimiterBinding,
  };
}

describe('contact API', () => {
  afterEach(() => {
    vi.doUnmock('cloudflare:workers');
    vi.doUnmock('@/lib/share/workers-rate-limit');
    vi.doUnmock('@/lib/share/workers-client-ip');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects a non-JSON content type before reading Workers bindings', async () => {
    const { POST, checkWorkersRateLimit, getCloudflareConnectingIp } = await loadRoute();

    const response = await POST(createContactRequest(validPayload, { 'content-type': 'text/plain' }));

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({ error: 'invalid_content_type' });
    expect(getCloudflareConnectingIp).not.toHaveBeenCalled();
    expect(checkWorkersRateLimit).not.toHaveBeenCalled();
  });

  it('rejects a cross-origin request before reading Workers bindings', async () => {
    const { POST, checkWorkersRateLimit, getCloudflareConnectingIp } = await loadRoute();

    const response = await POST(createContactRequest(validPayload, { origin: 'https://attacker.example' }));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'invalid_origin' });
    expect(getCloudflareConnectingIp).not.toHaveBeenCalled();
    expect(checkWorkersRateLimit).not.toHaveBeenCalled();
  });

  it('returns retry metadata from the IP limiter before parsing invalid JSON', async () => {
    const { POST, checkWorkersRateLimit, getCloudflareConnectingIp } = await loadRoute({
      rateLimitResults: [{ limited: true, retryAfterSeconds: 41 }],
    });

    const response = await POST(createRawContactRequest('{not json'));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('41');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(getCloudflareConnectingIp).toHaveBeenCalledTimes(1);
    expect(checkWorkersRateLimit).toHaveBeenCalledWith(
      { limit: expect.any(Function) },
      createRateLimitKey('contact:ip', '203.0.113.10'),
    );
  });

  it('returns 503 when the CONTACT_RATE_LIMITER binding is missing', async () => {
    const { POST, checkWorkersRateLimit } = await loadRoute({
      rateLimiterBinding: undefined,
      rateLimiterUnavailableMessage: 'Rate limiter binding is missing; received undefined',
    });

    const response = await POST(createContactRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
    expect(checkWorkersRateLimit).toHaveBeenCalledWith(
      undefined,
      createRateLimitKey('contact:ip', '203.0.113.10'),
    );
  });

  it('rejects invalid JSON after the request is allowed', async () => {
    const { POST } = await loadRoute();

    const response = await POST(createRawContactRequest('{not json'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_json' });
  });

  it('limits a hashed email key after an allowed IP check', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ id: 'email_123' }), { status: 200 })),
    );

    const { POST, checkWorkersRateLimit } = await loadRoute({
      rateLimitResults: [
        { limited: false, retryAfterSeconds: 0 },
        { limited: true, retryAfterSeconds: 53 },
      ],
    });

    const response = await POST(createContactRequest(validPayload));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('53');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(checkWorkersRateLimit).toHaveBeenNthCalledWith(
      2,
      { limit: expect.any(Function) },
      createRateLimitKey('contact:email', 'test@example.com'),
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends an allowed request with the existing Resend fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ id: 'email_123' }), { status: 200 })),
    );

    const { POST, checkWorkersRateLimit } = await loadRoute();

    const response = await POST(createContactRequest(validPayload));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(checkWorkersRateLimit).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
