import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config';

describe('security headers', () => {
  it('leaves Content-Security-Policy ownership to the per-request proxy', async () => {
    if (typeof nextConfig.headers !== 'function') {
      throw new Error('nextConfig.headers must be a function to define security headers');
    }

    const routeHeaders = await nextConfig.headers();
    const headerKeys = routeHeaders.flatMap((routeHeader) => routeHeader.headers.map((header) => header.key));

    expect(headerKeys).not.toContain('Content-Security-Policy');
  });

  it('preserves the non-CSP security headers in Next configuration', async () => {
    if (typeof nextConfig.headers !== 'function') {
      throw new Error('nextConfig.headers must be a function to define security headers');
    }

    const routeHeaders = await nextConfig.headers();
    const configuredHeaders = Object.fromEntries(
      routeHeaders.flatMap((routeHeader) => routeHeader.headers.map((header) => [header.key, header.value]))
    );

    expect(configuredHeaders).toMatchObject({
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'X-DNS-Prefetch-Control': 'on',
    });
  });
});
