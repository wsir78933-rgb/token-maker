import { AsyncLocalStorage } from 'node:async_hooks';
import { NextRequest } from 'next/server';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

let doesProxyMatch: typeof import('next/experimental/testing/server').unstable_doesMiddlewareMatch;

beforeAll(async () => {
  const runtimeGlobal = globalThis as typeof globalThis & {
    AsyncLocalStorage?: typeof AsyncLocalStorage;
  };
  runtimeGlobal.AsyncLocalStorage ??= AsyncLocalStorage;
  ({ unstable_doesMiddlewareMatch: doesProxyMatch } = await import('next/experimental/testing/server'));
});

async function loadProxy(nodeEnvironment = 'production') {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', nodeEnvironment);
  return import('./proxy');
}

describe('proxy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('adds one fresh nonce to the forwarded request and matching response CSP', async () => {
    const { proxy } = await loadProxy();

    const firstResponse = proxy(new NextRequest('https://www.tokenmaker.one/about'));
    const secondResponse = proxy(new NextRequest('https://www.tokenmaker.one/about'));
    const firstNonce = firstResponse.headers.get('x-middleware-request-x-nonce');
    const firstContentSecurityPolicy = firstResponse.headers.get('Content-Security-Policy');

    expect(firstNonce).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    expect(secondResponse.headers.get('x-middleware-request-x-nonce')).not.toBe(firstNonce);
    expect(firstResponse.headers.get('x-middleware-request-content-security-policy')).toBe(
      firstContentSecurityPolicy
    );
    expect(firstContentSecurityPolicy).toContain(`'nonce-${firstNonce}'`);
    expect(firstContentSecurityPolicy).toContain("'strict-dynamic'");
    expect(firstContentSecurityPolicy).toContain("'self'");
    expect(firstContentSecurityPolicy).toContain('https:');
    expect(firstContentSecurityPolicy).toContain('http:');
    expect(firstContentSecurityPolicy).toContain("'unsafe-inline'");
    expect(firstContentSecurityPolicy).toContain("'unsafe-eval'");
    expect(firstContentSecurityPolicy).toContain('img-src \'self\' data: blob: https:');
    expect(firstContentSecurityPolicy).toContain("connect-src 'self' https:");
    expect(firstContentSecurityPolicy).toContain('frame-src https:');
    expect(firstContentSecurityPolicy).toContain("object-src 'none'");
    expect(firstContentSecurityPolicy).toContain("base-uri 'self'");
    expect(firstContentSecurityPolicy).toContain("form-action 'self'");
    expect(firstContentSecurityPolicy).toContain("frame-ancestors 'none'");
  });

  it('keeps the Google strict CSP unsafe-eval fallback in production and development', async () => {
    const { proxy: productionProxy } = await loadProxy('production');
    const productionResponse = productionProxy(new NextRequest('https://www.tokenmaker.one/about'));

    const { proxy } = await loadProxy('development');
    const response = proxy(new NextRequest('https://www.tokenmaker.one/about'));

    expect(productionResponse.headers.get('Content-Security-Policy')).toContain("'unsafe-eval'");
    expect(response.headers.get('Content-Security-Policy')).toContain("'unsafe-eval'");
  });

  it('keeps the narrower resource CSP on public share pages', async () => {
    const { proxy } = await loadProxy();

    const englishShareResponse = proxy(
      new NextRequest('https://www.tokenmaker.one/share/token-id')
    );
    const chineseShareResponse = proxy(
      new NextRequest('https://www.tokenmaker.one/zh/share/token-id')
    );

    for (const response of [englishShareResponse, chineseShareResponse]) {
      const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

      expect(contentSecurityPolicy).not.toContain("'unsafe-eval'");
      expect(contentSecurityPolicy).toContain(
        'img-src \'self\' data: blob: https://r2.tokenmaker.one https://i.ytimg.com'
      );
      expect(contentSecurityPolicy).toContain(
        "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com"
      );
      expect(contentSecurityPolicy).toContain(
        'frame-src https://www.youtube.com https://www.youtube-nocookie.com'
      );
      expect(contentSecurityPolicy).not.toContain('frame-src https:;');
    }
  });

  it('matches normal and public-share documents but skips only non-document requests', async () => {
    const { config } = await loadProxy();
    const shouldMatch = (url: string, headers?: Record<string, string>) =>
      doesProxyMatch({ config, url, headers });

    expect(shouldMatch('https://www.tokenmaker.one/about')).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/zh/about')).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/share/token-id')).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/zh/share/token-id')).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/api/share')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/_next/static/chunk.js')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/_next/image?url=%2Ftoken.png')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/borders/wood.webp')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/favicon.ico')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/robots.txt')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/sitemap.xml')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/manifest.webmanifest')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/icon.svg')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/opengraph-image')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/zh/opengraph-image')).toBe(false);
    expect(
      shouldMatch('https://www.tokenmaker.one/about', { 'next-router-prefetch': '1' })
    ).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/about', { purpose: 'prefetch' })).toBe(true);
  });
});
