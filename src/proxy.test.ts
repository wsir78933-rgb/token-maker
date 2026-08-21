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

function getContentSecurityPolicyDirective(
  contentSecurityPolicy: string | null,
  directiveName: string
) {
  const directive = contentSecurityPolicy
    ?.split('; ')
    .find((value) => value.startsWith(`${directiveName} `));

  if (!directive) {
    throw new Error(`Missing ${directiveName} directive in CSP: ${contentSecurityPolicy}`);
  }

  return directive.split(' ').slice(1);
}

describe('proxy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('adds one fresh nonce to protected document requests and a matching strict CSP', async () => {
    const { proxy } = await loadProxy();

    const firstResponse = proxy(new NextRequest('https://www.tokenmaker.one/coat-of-arms-maker'));
    const secondResponse = proxy(new NextRequest('https://www.tokenmaker.one/coat-of-arms-maker'));
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
    expect(firstContentSecurityPolicy).not.toContain('https:');
    expect(firstContentSecurityPolicy).not.toContain('http:');
    expect(getContentSecurityPolicyDirective(firstContentSecurityPolicy, 'script-src')).not.toContain(
      "'unsafe-inline'"
    );
    expect(firstContentSecurityPolicy).not.toContain("'unsafe-eval'");
    expect(getContentSecurityPolicyDirective(firstContentSecurityPolicy, 'style-src')).toEqual([
      "'self'",
      "'unsafe-inline'",
    ]);
    expect(firstContentSecurityPolicy).toContain("img-src 'self' data: blob:");
    expect(firstContentSecurityPolicy).toContain("connect-src 'self'");
    expect(firstContentSecurityPolicy).toContain("frame-src 'none'");
    expect(firstContentSecurityPolicy).toContain("object-src 'none'");
    expect(firstContentSecurityPolicy).toContain("base-uri 'self'");
    expect(firstContentSecurityPolicy).toContain("form-action 'self'");
    expect(firstContentSecurityPolicy).toContain("frame-ancestors 'none'");
  });

  it('allows unsafe-eval only for development protected documents', async () => {
    const productionProxy = (await loadProxy('production')).proxy;
    const productionResponses = [
      productionProxy(new NextRequest('https://www.tokenmaker.one/share/token-id')),
      productionProxy(new NextRequest('https://www.tokenmaker.one/coat-of-arms-maker')),
    ];
    const developmentProxy = (await loadProxy('development')).proxy;
    const developmentResponses = [
      developmentProxy(new NextRequest('https://www.tokenmaker.one/share/token-id')),
      developmentProxy(new NextRequest('https://www.tokenmaker.one/coat-of-arms-maker')),
    ];

    for (const response of productionResponses) {
      const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

      expect(getContentSecurityPolicyDirective(contentSecurityPolicy, 'script-src')).toEqual([
        "'self'",
        expect.stringMatching(/^'nonce-[A-Za-z0-9+/]+={0,2}'$/),
        "'strict-dynamic'",
      ]);
      expect(contentSecurityPolicy).not.toContain("'unsafe-eval'");
    }

    for (const response of developmentResponses) {
      const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

      expect(getContentSecurityPolicyDirective(contentSecurityPolicy, 'script-src')).toEqual([
        "'self'",
        expect.stringMatching(/^'nonce-[A-Za-z0-9+/]+={0,2}'$/),
        "'strict-dynamic'",
        "'unsafe-eval'",
      ]);
    }
  });

  it('allows only self-hosted share resources in production and development', async () => {
    const productionProxy = (await loadProxy('production')).proxy;
    const developmentProxy = (await loadProxy('development')).proxy;
    const shareResponses = [
      productionProxy(new NextRequest('https://www.tokenmaker.one/share/token-id')),
      productionProxy(new NextRequest('https://www.tokenmaker.one/zh/share/token-id')),
      developmentProxy(new NextRequest('https://www.tokenmaker.one/share/token-id')),
      developmentProxy(new NextRequest('https://www.tokenmaker.one/zh/share/token-id')),
    ];

    for (const response of shareResponses) {
      const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

      expect(getContentSecurityPolicyDirective(contentSecurityPolicy, 'img-src')).toEqual([
        "'self'",
        'data:',
        'blob:',
        'https://r2.tokenmaker.one',
      ]);
      expect(getContentSecurityPolicyDirective(contentSecurityPolicy, 'connect-src')).toEqual(["'self'"]);
      expect(getContentSecurityPolicyDirective(contentSecurityPolicy, 'frame-src')).toEqual(["'none'"]);
      expect(contentSecurityPolicy).not.toMatch(
        /google-analytics|googletagmanager|clarity|cloudflareinsights|youtube|ytimg/i
      );
    }
  });

  it('matches only nonce-protected documents and skips cacheable content routes', async () => {
    const { config } = await loadProxy();
    const shouldMatch = (url: string, headers?: Record<string, string>) =>
      doesProxyMatch({ config, url, headers });

    expect(shouldMatch('https://www.tokenmaker.one/')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/zh')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/about')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/zh/about')).toBe(false);
    expect(shouldMatch('https://www.tokenmaker.one/share/token-id')).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/zh/share/token-id')).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/coat-of-arms-maker')).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/zh/coat-of-arms-maker')).toBe(true);
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
      shouldMatch('https://www.tokenmaker.one/coat-of-arms-maker', { 'next-router-prefetch': '1' })
    ).toBe(true);
    expect(shouldMatch('https://www.tokenmaker.one/coat-of-arms-maker', { purpose: 'prefetch' })).toBe(true);
  });
});
