import { notFound } from 'next/navigation';

import { BlogCategoryPageView } from '@/components/site/views/BlogCategoryPageView';
import {
  BLOG_CATEGORY_SLUGS,
  createBlogCategoryMetadata,
  isBlogCategorySlug,
} from '@/lib/blog-content';

const locale = 'en';

interface BlogCategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return BLOG_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps) {
  const { category } = await params;

  if (!isBlogCategorySlug(category)) {
    notFound();
  }

  return createBlogCategoryMetadata(locale, category);
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category } = await params;

  if (!isBlogCategorySlug(category)) {
    notFound();
  }

  return <BlogCategoryPageView locale={locale} category={category} />;
}
