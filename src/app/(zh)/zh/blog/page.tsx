import type { Metadata } from 'next';
import { BlogHubPageView } from '@/components/site/views/BlogHubPageView';
import { createBlogIndexMetadata } from '@/lib/blog-seo';

const locale = 'zh';

interface BlogIndexPageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(value?: string) {
  const page = Number.parseInt(value ?? '1', 10);

  if (Number.isNaN(page) || page < 1) {
    return 1;
  }

  return page;
}

export async function generateMetadata({
  searchParams,
}: BlogIndexPageProps): Promise<Metadata> {
  const { page } = await searchParams;
  return createBlogIndexMetadata(locale, parsePage(page));
}

export default async function ChineseBlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const { page } = await searchParams;

  return <BlogHubPageView locale={locale} currentPage={parsePage(page)} />;
}
