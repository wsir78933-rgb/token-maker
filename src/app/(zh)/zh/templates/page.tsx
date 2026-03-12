import { TemplatesHubPageView } from '@/components/site/views/TemplatesHubPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'zh';

export const metadata = createCollectionMetadata(locale, 'templates');

export default function ChineseTemplatesIndexPage() {
  return <TemplatesHubPageView locale={locale} />;
}
