import { notFound } from 'next/navigation';

import { TemplatePageView } from '@/components/site/views/TemplatePageView';
import { getTemplatePage } from '@/lib/site-content';
import { createTemplatePageMetadata } from '@/lib/site-page-models';

const locale = 'zh';
const slug = 'square-token-maker';

export const metadata = createTemplatePageMetadata(locale, slug);

export default function ChineseSquareTokenMakerPage() {
  if (!getTemplatePage(locale, slug)) {
    notFound();
  }

  return <TemplatePageView locale={locale} slug={slug} />;
}
