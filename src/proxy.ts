import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server';

function createNonce() {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  return btoa(String.fromCharCode(...nonceBytes));
}

function isPublicSharePage(pathname: string) {
  return /^\/(?:zh\/)?share\/[^/]+\/?$/.test(pathname);
}

function createContentSecurityPolicy(nonce: string, pathname: string) {
  const hasPublicSharePagePolicy = isPublicSharePage(pathname);
  const scriptSources = hasPublicSharePagePolicy
    ? ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"]
    : [
        "'self'",
        `'nonce-${nonce}'`,
        "'unsafe-inline'",
        "'unsafe-eval'",
        "'strict-dynamic'",
        'https:',
        'http:',
      ];
  const imageSources = hasPublicSharePagePolicy
    ? "'self' data: blob: https://r2.tokenmaker.one"
    : "'self' data: blob: https:";
  const connectionSources = hasPublicSharePagePolicy
    ? "'self'"
    : "'self' https:";
  const frameSources = hasPublicSharePagePolicy ? "'none'" : 'https:';

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources}`,
    "font-src 'self'",
    `connect-src ${connectionSources}`,
    `frame-src ${frameSources}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const contentSecurityPolicy = createContentSecurityPolicy(nonce, request.nextUrl.pathname);
  const forwardedHeaders = new Headers(request.headers);

  forwardedHeaders.set('x-nonce', nonce);
  forwardedHeaders.set('Content-Security-Policy', contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: forwardedHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api(?:/|$)|_next/(?:static|image)(?:/|$)|(?:.*\\/)?opengraph-image(?:/|$)|.*\\.(?:avif|bmp|css|gif|ico|jpe?g|js|map|png|svg|txt|webmanifest|webp|woff2?|xml)$).*)',
    },
  ],
} satisfies ProxyConfig;
