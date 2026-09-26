import { notFound } from 'next/navigation';

import { BlogCategoryPageView } from '@/components/site/views/BlogCategoryPageView';
import {
  BLOG_CATEGORY_SLUGS,
  createBlogCategoryMetadata,
  getBlogCategoryPageCount,
  isBlogCategorySlug,
  type BlogCategorySlug,
} from '@/lib/blog-content';

const locale = 'en';

interface BlogCategoryPaginationPageProps {
  params: Promise<{ category: string; page: string }>;
}

function resolveBlogCategoryPage(category: string, page: string): {
  category: BlogCategorySlug;
  page: number;
} {
  if (!isBlogCategorySlug(category)) {
    notFound();
  }

  if (!/^[1-9]\d*$/.test(page)) {
    notFound();
  }

  const pageNumber = Number(page);
  if (pageNumber <= 1 || pageNumber > getBlogCategoryPageCount(locale, category)) {
    notFound();
  }

  return { category, page: pageNumber };
}

export function generateStaticParams() {
  return BLOG_CATEGORY_SLUGS.flatMap((category) => {
    const totalPages = getBlogCategoryPageCount(locale, category);

    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      category,
      page: String(index + 2),
    }));
  });
}

export async function generateMetadata({ params }: BlogCategoryPaginationPageProps) {
  const { category, page } = await params;
  const resolvedPage = resolveBlogCategoryPage(category, page);
  return createBlogCategoryMetadata(locale, resolvedPage.category, resolvedPage.page);
}

export default async function BlogCategoryPaginationPage({
  params,
}: BlogCategoryPaginationPageProps) {
  const { category, page } = await params;
  const resolvedPage = resolveBlogCategoryPage(category, page);

  return <BlogCategoryPageView locale={locale} category={resolvedPage.category} page={resolvedPage.page} />;
}
