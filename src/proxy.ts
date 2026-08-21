import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server';

function createNonce() {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  return btoa(String.fromCharCode(...nonceBytes));
}

function isShareDocument(pathname: string) {
  return /^\/(?:zh\/)?share(?:\/|$)/.test(pathname);
}

function createProtectedContentSecurityPolicy(nonce: string, pathname: string) {
  const imageSources = isShareDocument(pathname)
    ? "'self' data: blob: https://r2.tokenmaker.one"
    : "'self' data: blob:";
  const scriptSources =
    process.env.NODE_ENV === 'development'
      ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    "default-src 'self'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources}`,
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const contentSecurityPolicy = createProtectedContentSecurityPolicy(nonce, request.nextUrl.pathname);
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
    '/share/:path*',
    '/zh/share/:path*',
    '/coat-of-arms-maker',
    '/zh/coat-of-arms-maker',
  ],
} satisfies ProxyConfig;
