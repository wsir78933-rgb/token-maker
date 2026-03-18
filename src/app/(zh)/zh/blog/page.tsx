import type { Metadata } from 'next';
import { BlogHubPageView } from '@/components/site/views/BlogHubPageView';
import { createBlogIndexMetadata } from '@/lib/blog-seo';

const locale = 'zh';

export function generateMetadata(): Metadata {
  return createBlogIndexMetadata(locale, 1);
}

export default function ChineseBlogIndexPage() {
  return <BlogHubPageView locale={locale} currentPage={1} />;
}
