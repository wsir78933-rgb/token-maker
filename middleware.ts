import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function getBlogPaginationRedirect(request: NextRequest, basePath: '/blog' | '/zh/blog') {
  const page = request.nextUrl.searchParams.get('page');

  if (!page || !/^\d+$/.test(page)) {
    return null;
  }

  const pageNumber = Number.parseInt(page, 10);

  if (!Number.isSafeInteger(pageNumber) || pageNumber < 1) {
    return null;
  }

  const destination = request.nextUrl.clone();
  destination.searchParams.delete('page');
  destination.pathname = pageNumber === 1 ? basePath : `${basePath}/page/${pageNumber}`;

  return destination;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirectTarget =
    pathname === '/blog'
      ? getBlogPaginationRedirect(request, '/blog')
      : pathname === '/zh/blog'
        ? getBlogPaginationRedirect(request, '/zh/blog')
        : null;

  if (!redirectTarget) {
    return NextResponse.next();
  }

  return NextResponse.redirect(redirectTarget, 308);
}

export const config = {
  matcher: ['/blog', '/zh/blog'],
};
