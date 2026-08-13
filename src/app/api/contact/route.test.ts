import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

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
  limiterErrorStage?: 'creation' | 'check';
  rateLimitResults?: RateLimitResult[];
}

function createRawContactRequest(body: string, headers: Record<string, string> = {}) {
  const request = new Request('http://localhost/api/contact', {
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

function createContactRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return createRawContactRequest(JSON.stringify(body), headers);
}

async function loadRoute({
  limiterErrorStage,
  rateLimitResults = [
    { limited: false, retryAfterSeconds: 0 },
    { limited: false, retryAfterSeconds: 0 },
  ],
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

  vi.doMock('@/lib/share/rate-limit', () => ({
    ...rateLimitModule,
    createUpstashRateLimiter: createRateLimiter,
  }));

  const route = await import('./route');
  return { ...route, createRateLimiter, rateLimiterCheck };
}

describe('contact API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'test-key',
      RESEND_FROM_EMAIL: 'Token Maker <from@example.com>',
      CONTACT_TO_EMAIL: 'to@example.com',
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }))
    );
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.doUnmock('@/lib/share/rate-limit');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects a non-JSON content type before creating a rate limiter', async () => {
    const { POST, createRateLimiter } = await loadRoute();

    const response = await POST(createContactRequest(validPayload, { 'content-type': 'text/plain' }));

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({ error: 'invalid_content_type' });
    expect(createRateLimiter).not.toHaveBeenCalled();
  });

  it('rejects a cross-origin request before creating a rate limiter', async () => {
    const { POST, createRateLimiter } = await loadRoute();

    const response = await POST(createContactRequest(validPayload, { origin: 'https://attacker.example' }));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'invalid_origin' });
    expect(createRateLimiter).not.toHaveBeenCalled();
  });

  it('returns retry metadata from the IP limiter before parsing invalid JSON', async () => {
    const { POST, rateLimiterCheck } = await loadRoute({
      rateLimitResults: [{ limited: true, retryAfterSeconds: 41 }],
    });

    const response = await POST(createRawContactRequest('{not json'));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('41');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(rateLimiterCheck).toHaveBeenCalledWith({
      key: expect.stringMatching(/^contact:ip:[a-f0-9]{24}$/),
      maxRequests: 5,
      windowSeconds: 600,
    });
  });

  it('returns 503 when Upstash configuration is absent', async () => {
    const { POST } = await loadRoute({ limiterErrorStage: 'creation' });

    const response = await POST(createContactRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
  });

  it('returns 503 when the Upstash limiter service is unavailable', async () => {
    const { POST } = await loadRoute({ limiterErrorStage: 'check' });

    const response = await POST(createContactRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'rate_limiter_unavailable' });
  });

  it('rejects invalid JSON after the request is allowed', async () => {
    const { POST } = await loadRoute();

    const response = await POST(createRawContactRequest('{not json'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_json' });
  });

  it('limits a hashed email key after an allowed IP check', async () => {
    const { POST, rateLimiterCheck } = await loadRoute({
      rateLimitResults: [
        { limited: false, retryAfterSeconds: 0 },
        { limited: true, retryAfterSeconds: 53 },
      ],
    });

    const response = await POST(createContactRequest(validPayload));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('53');
    expect(await response.json()).toEqual({ error: 'rate_limited' });
    expect(rateLimiterCheck).toHaveBeenNthCalledWith(2, {
      key: expect.stringMatching(/^contact:email:[a-f0-9]{24}$/),
      maxRequests: 5,
      windowSeconds: 600,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends an allowed request with the existing Resend fields', async () => {
    const { POST, rateLimiterCheck } = await loadRoute();

    const response = await POST(createContactRequest(validPayload));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(rateLimiterCheck).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
