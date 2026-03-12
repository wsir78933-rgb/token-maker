import { getTemplatePages } from '@/lib/site-content';
import { TemplateDetailPageView } from '@/components/site/views/TemplateDetailPageView';
import { createTemplateDetailMetadata } from '@/lib/site-page-models';

const locale = 'zh';

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getTemplatePages(locale).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: TemplatePageProps) {
  const { slug } = await params;
  return createTemplateDetailMetadata(locale, slug);
}

export default async function ChineseTemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  return <TemplateDetailPageView locale={locale} slug={slug} />;
}
