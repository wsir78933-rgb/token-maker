import { describe, expect, it } from 'vitest';
import { unstable_getResponseFromNextConfig } from 'next/experimental/testing/server';
import nextConfig from '../../next.config';

describe('security headers', () => {
  it('provides a static CSP for cacheable public routes without a request nonce', async () => {
    if (typeof nextConfig.headers !== 'function') {
      throw new Error('nextConfig.headers must be a function to define security headers');
    }

    const routeHeaders = await nextConfig.headers();
    const configuredHeaders = Object.fromEntries(
      routeHeaders.flatMap((routeHeader) => routeHeader.headers.map((header) => [header.key, header.value]))
    );
    const contentSecurityPolicy = configuredHeaders['Content-Security-Policy'];

    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:");
    expect(contentSecurityPolicy).toContain("style-src 'self' 'unsafe-inline'");
    expect(contentSecurityPolicy).toContain("img-src 'self' data: blob: https:");
    expect(contentSecurityPolicy).toContain("connect-src 'self' https:");
    expect(contentSecurityPolicy).toContain('frame-src https:');
    expect(contentSecurityPolicy).not.toContain("'nonce-");
    expect(contentSecurityPolicy).not.toContain("'strict-dynamic'");
  });

  it('leaves nonce-protected routes exclusively under proxy CSP ownership', async () => {
    const cacheableUrls = [
      'https://www.tokenmaker.one/',
      'https://www.tokenmaker.one/zh',
      'https://www.tokenmaker.one/about',
      'https://www.tokenmaker.one/zh/about',
    ];
    const nonceProtectedUrls = [
      'https://www.tokenmaker.one/share/token-id',
      'https://www.tokenmaker.one/zh/share/token-id',
      'https://www.tokenmaker.one/coat-of-arms-maker',
      'https://www.tokenmaker.one/zh/coat-of-arms-maker',
    ];

    for (const url of cacheableUrls) {
      const response = await unstable_getResponseFromNextConfig({ url, nextConfig });
      expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
    }

    for (const url of nonceProtectedUrls) {
      const response = await unstable_getResponseFromNextConfig({ url, nextConfig });
      expect(response.headers.get('Content-Security-Policy')).toBeNull();
    }
  });

  it('does not add a document CSP to API or static asset responses', async () => {
    const nonDocumentUrls = [
      'https://www.tokenmaker.one/api/share',
      'https://www.tokenmaker.one/_next/static/chunk.js',
      'https://www.tokenmaker.one/robots.txt',
      'https://www.tokenmaker.one/manifest.webmanifest',
      'https://www.tokenmaker.one/icon.svg',
    ];

    for (const url of nonDocumentUrls) {
      const response = await unstable_getResponseFromNextConfig({ url, nextConfig });
      expect(response.headers.get('Content-Security-Policy')).toBeNull();
    }
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
