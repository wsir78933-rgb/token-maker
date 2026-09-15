import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server';

function createNonce() {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  return btoa(String.fromCharCode(...nonceBytes));
}

function isShareDocument(pathname: string) {
  return /^\/(?:zh\/)?share(?:\/|$)/.test(pathname);
}

function isCoatMakerDocument(pathname: string) {
  return pathname === '/coat-of-arms-maker' || pathname === '/zh/coat-of-arms-maker';
}

function createNonceProtectedScriptSources(nonce: string) {
  return process.env.NODE_ENV === 'development'
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;
}

function createShareDocumentContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src ${createNonceProtectedScriptSources(nonce)}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://r2.tokenmaker.one",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

function createCoatMakerDocumentContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src ${createNonceProtectedScriptSources(nonce)}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
    "font-src 'self'",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

function createProtectedContentSecurityPolicy(nonce: string, pathname: string) {
  if (isShareDocument(pathname)) {
    return createShareDocumentContentSecurityPolicy(nonce);
  }

  if (isCoatMakerDocument(pathname)) {
    return createCoatMakerDocumentContentSecurityPolicy(nonce);
  }

  throw new Error(`Unexpected protected document pathname: ${pathname}`);
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
