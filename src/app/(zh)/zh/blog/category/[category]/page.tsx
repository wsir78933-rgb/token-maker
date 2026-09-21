import { notFound } from 'next/navigation';

import { BlogCategoryPageView } from '@/components/site/views/BlogCategoryPageView';
import {
  BLOG_CATEGORY_SLUGS,
  createBlogCategoryMetadata,
  isBlogCategorySlug,
} from '@/lib/blog-content';

const locale = 'zh';

interface ChineseBlogCategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return BLOG_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: ChineseBlogCategoryPageProps) {
  const { category } = await params;

  if (!isBlogCategorySlug(category)) {
    notFound();
  }

  return createBlogCategoryMetadata(locale, category);
}

export default async function ChineseBlogCategoryPage({ params }: ChineseBlogCategoryPageProps) {
  const { category } = await params;

  if (!isBlogCategorySlug(category)) {
    notFound();
  }

  return <BlogCategoryPageView locale={locale} category={category} />;
}
