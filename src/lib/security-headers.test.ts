import { AsyncLocalStorage } from 'node:async_hooks';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  escapeHeaderSource,
  isSafeRegex,
  matchHeaders,
  requestContextFromRequest,
} from 'vinext/config/config-matchers';
import nextConfig from '../../next.config';

let getNextConfigResponse: typeof import('next/experimental/testing/server').unstable_getResponseFromNextConfig;

beforeAll(async () => {
  const runtimeGlobal = globalThis as typeof globalThis & {
    AsyncLocalStorage?: typeof AsyncLocalStorage;
  };
  runtimeGlobal.AsyncLocalStorage ??= AsyncLocalStorage;
  ({ unstable_getResponseFromNextConfig: getNextConfigResponse } = await import(
    'next/experimental/testing/server'
  ));
});

describe('security headers', () => {
  it('provides a static CSP for cacheable public routes without a request nonce', async () => {
    const response = await getNextConfigResponse({
      url: 'https://www.tokenmaker.one/about',
      nextConfig,
    });
    const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

    expect(contentSecurityPolicy).toBeTruthy();

    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:");
    expect(contentSecurityPolicy).toContain("style-src 'self' 'unsafe-inline'");
    expect(contentSecurityPolicy).toContain("img-src 'self' data: blob: https:");
    expect(contentSecurityPolicy).toContain("connect-src 'self' https:");
    expect(contentSecurityPolicy).toContain('frame-src https:');
    expect(contentSecurityPolicy).not.toContain("'nonce-");
    expect(contentSecurityPolicy).not.toContain("'strict-dynamic'");
  });

  it('matches the public CSP with both framework matchers while preserving route exclusions', async () => {
    if (typeof nextConfig.headers !== 'function') {
      throw new Error('nextConfig.headers must be a function to define security headers');
    }

    const routeHeaders = await nextConfig.headers();
    const vinextHeaderRules = routeHeaders.map((routeHeader) => ({
      source: routeHeader.source,
      headers: routeHeader.headers.map((header) => ({ key: header.key, value: header.value })),
    }));
    const aboutResponse = await getNextConfigResponse({
      url: 'https://www.tokenmaker.one/about',
      nextConfig,
    });
    const staticContentSecurityPolicy = aboutResponse.headers.get('Content-Security-Policy');

    if (staticContentSecurityPolicy === null) {
      throw new Error('Expected /about to receive the configured static Content-Security-Policy');
    }

    const generalStaticCspRule = routeHeaders.find((routeHeader) =>
      routeHeader.headers.some(
        (header) =>
          header.key === 'Content-Security-Policy' && header.value === staticContentSecurityPolicy
      )
    );

    if (!generalStaticCspRule) {
      throw new Error('Could not find the general static CSP rule matching /about');
    }

    const vinextMatcherPattern = `^${escapeHeaderSource(generalStaticCspRule.source)}$`;
    expect(isSafeRegex(vinextMatcherPattern, 'i')).toBe(true);

    const requestContext = requestContextFromRequest(new Request('https://www.tokenmaker.one/'));
    const publicPaths = [
      '/',
      '/zh',
      '/about',
      '/zh/about',
      '/coat-of-arms-maker',
      '/zh/coat-of-arms-maker',
      '/apiary',
      '/sharex',
      '/zh/sharex',
      '/not-opengraph-image',
      '/assets/image.avif/preview',
    ];
    const staticAssetExtensions = [
      'avif',
      'bmp',
      'css',
      'gif',
      'ico',
      'jpg',
      'jpeg',
      'js',
      'map',
      'mjs',
      'otf',
      'png',
      'svg',
      'ttf',
      'txt',
      'webmanifest',
      'webp',
      'woff',
      'woff2',
      'xml',
    ];
    const pathsWithoutGeneralStaticCsp = [
      '/api',
      '/api/share',
      '/_next',
      '/_next/static/chunk.js',
      '/share',
      '/share/token-id',
      '/zh/share',
      '/zh/share/token-id',
      '/scroll-creator',
      '/zh/scroll-creator',
      '/notice-board-creator',
      '/zh/notice-board-creator',
      '/opengraph-image',
      '/nested/opengraph-image',
      '/nested/opengraph-image/variant',
      ...staticAssetExtensions.map((extension) => `/assets/icon.${extension}`),
      ...staticAssetExtensions.map((extension) => `/assets/icon.${extension.toUpperCase()}`),
      '/nested/assets/icon.PNG',
    ];

    for (const pathname of publicPaths) {
      const nextResponse = await getNextConfigResponse({
        url: `https://www.tokenmaker.one${pathname}`,
        nextConfig,
      });
      const nextContentSecurityPolicy = nextResponse.headers.get('Content-Security-Policy');
      const vinextContentSecurityPolicy = matchHeaders(pathname, vinextHeaderRules, requestContext).find(
        (header) => header.key === 'Content-Security-Policy'
      )?.value;

      expect(nextContentSecurityPolicy).toBe(staticContentSecurityPolicy);
      expect(vinextContentSecurityPolicy).toBe(staticContentSecurityPolicy);
    }

    for (const pathname of pathsWithoutGeneralStaticCsp) {
      const nextResponse = await getNextConfigResponse({
        url: `https://www.tokenmaker.one${pathname}`,
        nextConfig,
      });
      const nextContentSecurityPolicy = nextResponse.headers.get('Content-Security-Policy');
      const vinextContentSecurityPolicy =
        matchHeaders(pathname, vinextHeaderRules, requestContext).find(
          (header) => header.key === 'Content-Security-Policy'
        )?.value ?? null;

      expect(vinextContentSecurityPolicy).toBe(nextContentSecurityPolicy);
      expect(nextContentSecurityPolicy).not.toBe(staticContentSecurityPolicy);
    }
  });

  it('allows Google Fonts only on both scroll creator locales', async () => {
    const scrollCreatorUrls = [
      'https://www.tokenmaker.one/scroll-creator',
      'https://www.tokenmaker.one/zh/scroll-creator',
    ];

    for (const url of scrollCreatorUrls) {
      const response = await getNextConfigResponse({ url, nextConfig });
      const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

      expect(contentSecurityPolicy).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
      expect(contentSecurityPolicy).toContain("font-src 'self' https://fonts.gstatic.com");
      expect(contentSecurityPolicy).toContain("connect-src 'self' https:");
      expect(contentSecurityPolicy).not.toContain("'nonce-");
    }
  });

  it('allows Google Fonts only on both notice board locales', async () => {
    const noticeBoardUrls = [
      'https://www.tokenmaker.one/notice-board-creator',
      'https://www.tokenmaker.one/zh/notice-board-creator',
    ];

    for (const url of noticeBoardUrls) {
      const response = await getNextConfigResponse({ url, nextConfig });
      const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

      expect(contentSecurityPolicy).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
      expect(contentSecurityPolicy).toContain("font-src 'self' https://fonts.gstatic.com");
      expect(contentSecurityPolicy).not.toContain("'nonce-");
    }
  });

  it('excludes scroll creator routes from the general static CSP matcher', async () => {
    if (typeof nextConfig.headers !== 'function') {
      throw new Error('nextConfig.headers must be a function to define security headers');
    }

    const routeHeaders = await nextConfig.headers();
    const contentSecurityPolicySources = routeHeaders
      .filter((routeHeader) => routeHeader.headers.some((header) => header.key === 'Content-Security-Policy'))
      .map((routeHeader) => routeHeader.source);
    const generalStaticCspSource = contentSecurityPolicySources.find((source) => source.includes('(?!api'));

    expect(generalStaticCspSource).toBeDefined();
    expect(generalStaticCspSource).toContain('scroll-creator$|scroll-creator/');
    expect(contentSecurityPolicySources).toContain('/scroll-creator');
    expect(contentSecurityPolicySources).toContain('/zh/scroll-creator');
  });

  it('keeps notice board font access isolated from general public routes', async () => {
    if (typeof nextConfig.headers !== 'function') {
      throw new Error('nextConfig.headers must be a function to define security headers');
    }

    const routeHeaders = await nextConfig.headers();
    const contentSecurityPolicySources = routeHeaders
      .filter((routeHeader) => routeHeader.headers.some((header) => header.key === 'Content-Security-Policy'))
      .map((routeHeader) => routeHeader.source);
    const generalStaticCspSource = contentSecurityPolicySources.find((source) => source.includes('(?!api'));

    expect(generalStaticCspSource).toBeDefined();
    expect(generalStaticCspSource).toContain('notice-board-creator$|notice-board-creator/');
    expect(contentSecurityPolicySources).toContain('/notice-board-creator');
    expect(contentSecurityPolicySources).toContain('/zh/notice-board-creator');

    const generalPageResponse = await getNextConfigResponse({
      url: 'https://www.tokenmaker.one/about',
      nextConfig,
    });
    const generalPageContentSecurityPolicy = generalPageResponse.headers.get('Content-Security-Policy');

    expect(generalPageContentSecurityPolicy).toContain("style-src 'self' 'unsafe-inline'");
    expect(generalPageContentSecurityPolicy).not.toContain('https://fonts.googleapis.com');
    expect(generalPageContentSecurityPolicy).not.toContain('https://fonts.gstatic.com');
  });

  it('leaves nonce-protected routes exclusively under proxy CSP ownership', async () => {
    const cacheableUrls = [
      'https://www.tokenmaker.one/',
      'https://www.tokenmaker.one/zh',
      'https://www.tokenmaker.one/about',
      'https://www.tokenmaker.one/zh/about',
      'https://www.tokenmaker.one/coat-of-arms-maker',
      'https://www.tokenmaker.one/zh/coat-of-arms-maker',
    ];
    const nonceProtectedUrls = [
      'https://www.tokenmaker.one/share/token-id',
      'https://www.tokenmaker.one/zh/share/token-id',
    ];

    const generalPageResponse = await getNextConfigResponse({
      url: 'https://www.tokenmaker.one/about',
      nextConfig,
    });
    const fixedContentSecurityPolicy = generalPageResponse.headers.get('Content-Security-Policy');

    for (const url of cacheableUrls) {
      const response = await getNextConfigResponse({ url, nextConfig });
      const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

      expect(contentSecurityPolicy).toContain("default-src 'self'");
      expect(contentSecurityPolicy).toBe(fixedContentSecurityPolicy);
      expect(contentSecurityPolicy).not.toContain("'nonce-");
      expect(contentSecurityPolicy).not.toContain("'strict-dynamic'");
      expect(response.headers.get('x-nonce')).toBeNull();
    }

    for (const url of nonceProtectedUrls) {
      const response = await getNextConfigResponse({ url, nextConfig });
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
      const response = await getNextConfigResponse({ url, nextConfig });
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
