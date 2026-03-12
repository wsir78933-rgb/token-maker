import { BlogDetailPageView } from '@/components/site/views/BlogDetailPageView';
import { getPublishedBlogPosts } from '@/lib/blog-content';
import { createBlogDetailMetadata } from '@/lib/blog-seo';

const locale = 'en';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPublishedBlogPosts(locale).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  return createBlogDetailMetadata(locale, slug);
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  return <BlogDetailPageView locale={locale} slug={slug} />;
}
