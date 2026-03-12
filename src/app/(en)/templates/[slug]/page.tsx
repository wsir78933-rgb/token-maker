import { getTemplatePages } from '@/lib/site-content';
import { createTemplateDetailMetadata } from '@/lib/site-page-models';
import { TemplateDetailPageView } from '@/components/site/views/TemplateDetailPageView';

const locale = 'en';

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

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  return <TemplateDetailPageView locale={locale} slug={slug} />;
}
