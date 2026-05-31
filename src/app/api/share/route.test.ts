import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const pngBase64 = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
  0x89,
]).toString('base64');

const validPayload = {
  image: pngBase64,
  width: 1024,
  locale: 'en',
};

function createShareRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return createRawShareRequest(JSON.stringify(body), headers);
}

function createRawShareRequest(body: string, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/share', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-real-ip': '203.0.113.10',
      ...headers,
    },
    body,
  }) as NextRequest;
}

async function loadRoute({ storageConfigured = true } = {}) {
  vi.resetModules();

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

  return import('./route');
}

describe('share API', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/share/r2-storage');
    vi.restoreAllMocks();
  });

  it('rejects invalid JSON', async () => {
    const { POST } = await loadRoute();

    const response = await POST(createRawShareRequest('{not json'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_json' });
  });

  it('rejects request bodies above the upload limit', async () => {
    const { POST } = await loadRoute();

    const response = await POST(
      createRawShareRequest('{}', { 'content-length': String(9 * 1024 * 1024) })
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'image_too_large' });
  });

  it('rejects non-PNG image payloads', async () => {
    const { POST } = await loadRoute();

    const response = await POST(
      createShareRequest({
        ...validPayload,
        image: Buffer.from('not a png').toString('base64'),
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_image' });
  });

  it('reports when R2 storage is not configured', async () => {
    const { POST } = await loadRoute({ storageConfigured: false });

    const response = await POST(createShareRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'storage_not_configured' });
  });

  it('uploads a valid PNG and returns share URLs', async () => {
    const { POST } = await loadRoute();

    const response = await POST(createShareRequest(validPayload));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toMatch(/^[A-Za-z0-9_-]{10}$/);
    expect(body.shareUrl).toBe(`https://www.tokenmaker.one/share/${body.id}`);
    expect(body.imageUrl).toBe(`https://r2.tokenmaker.one/shares/${body.id}.png`);
  });

  it('allows 20 uploads per IP per minute before rate limiting', async () => {
    const { POST } = await loadRoute();

    for (let index = 0; index < 20; index += 1) {
      const response = await POST(createShareRequest(validPayload));
      expect(response.status).toBe(200);
    }

    const limited = await POST(createShareRequest(validPayload));

    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: 'rate_limited' });
  });
});
