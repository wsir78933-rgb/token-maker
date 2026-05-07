import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const validPayload = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a valid test message.',
  locale: 'en',
};

function createContactRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  }) as NextRequest;
}

async function loadRoute() {
  vi.resetModules();
  return import('./route');
}

describe('contact API rate limiting', () => {
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
    vi.unstubAllGlobals();
  });

  it('limits repeated sends by email even when the client IP changes', async () => {
    const { POST } = await loadRoute();

    for (let index = 0; index < 5; index += 1) {
      const response = await POST(
        createContactRequest(validPayload, { 'x-real-ip': `203.0.113.${index + 1}` })
      );
      expect(response.status).toBe(200);
    }

    const limited = await POST(
      createContactRequest(validPayload, { 'x-real-ip': '203.0.113.99' })
    );

    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: 'rate_limited' });
    expect(fetch).toHaveBeenCalledTimes(5);
  });
});
