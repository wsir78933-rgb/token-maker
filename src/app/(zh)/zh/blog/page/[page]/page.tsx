import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogHubPageView } from '@/components/site/views/BlogHubPageView';
import {
  getStaticBlogPageNumbers,
  isStaticBlogPage,
  parseStaticBlogPageParam,
} from '@/lib/blog-pagination';
import { createBlogIndexMetadata } from '@/lib/blog-seo';

const locale = 'zh';

interface ChineseBlogPaginatedPageProps {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticBlogPageNumbers(locale).map((page) => ({
    page: String(page),
  }));
}

export async function generateMetadata({
  params,
}: ChineseBlogPaginatedPageProps): Promise<Metadata> {
  const { page } = await params;
  const currentPage = parseStaticBlogPageParam(page);

  if (currentPage === null || !isStaticBlogPage(locale, currentPage)) {
    notFound();
  }

  return createBlogIndexMetadata(locale, currentPage);
}

export default async function ChineseBlogPaginatedPage({
  params,
}: ChineseBlogPaginatedPageProps) {
  const { page } = await params;
  const currentPage = parseStaticBlogPageParam(page);

  if (currentPage === null || !isStaticBlogPage(locale, currentPage)) {
    notFound();
  }

  return <BlogHubPageView locale={locale} currentPage={currentPage} />;
}
