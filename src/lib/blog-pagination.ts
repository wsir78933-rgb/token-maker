import { getPaginatedBlogPosts } from '@/lib/blog-content';
import type { SiteLocale } from '@/lib/site-locale';

export function parseStaticBlogPageParam(value: string) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const page = Number.parseInt(value, 10);

  if (!Number.isSafeInteger(page)) {
    return null;
  }

  return page;
}

export function getStaticBlogPageNumbers(locale: SiteLocale) {
  const { totalPages } = getPaginatedBlogPosts(locale);

  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => index + 2);
}

export function isStaticBlogPage(locale: SiteLocale, page: number) {
  const { totalPages } = getPaginatedBlogPosts(locale);

  return page > 1 && page <= totalPages;
}
