import { notFound } from 'next/navigation';

import { BlogDetailPageView } from '@/components/site/views/BlogDetailPageView';
import { createBlogPostMetadata, getBlogPost, getBlogPosts } from '@/lib/blog-content';

const locale = 'en';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPosts(locale).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return createBlogPostMetadata(locale, slug);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  if (!getBlogPost(locale, slug)) {
    notFound();
  }

  return <BlogDetailPageView locale={locale} slug={slug} />;
}
