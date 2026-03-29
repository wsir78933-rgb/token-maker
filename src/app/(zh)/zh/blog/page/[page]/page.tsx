import { notFound } from 'next/navigation';

import { BlogHubPageView } from '@/components/site/views/BlogHubPageView';
import { createBlogHubMetadata, getBlogPageCount } from '@/lib/blog-content';

const locale = 'zh';

interface ChineseBlogPaginationPageProps {
  params: Promise<{ page: string }>;
}

export function generateStaticParams() {
  const totalPages = getBlogPageCount(locale);

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: ChineseBlogPaginationPageProps) {
  const { page } = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber <= 1 || pageNumber > getBlogPageCount(locale)) {
    return createBlogHubMetadata(locale);
  }

  return createBlogHubMetadata(locale, pageNumber);
}

export default async function ChineseBlogPaginationPage({ params }: ChineseBlogPaginationPageProps) {
  const { page } = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber <= 1 || pageNumber > getBlogPageCount(locale)) {
    notFound();
  }

  return <BlogHubPageView locale={locale} page={pageNumber} />;
}
