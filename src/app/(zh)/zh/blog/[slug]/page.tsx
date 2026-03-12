import { GuideDetailPageView } from '@/components/site/views/GuideDetailPageView';
import { getGuidePages } from '@/lib/site-content';
import { createGuideDetailMetadata } from '@/lib/site-page-models';

const locale = 'zh';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuidePages(locale).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  return createGuideDetailMetadata(locale, slug);
}

export default async function ChineseBlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  return <GuideDetailPageView locale={locale} slug={slug} />;
}
