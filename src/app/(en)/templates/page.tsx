import { TemplatesHubPageView } from '@/components/site/views/TemplatesHubPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'en';

export const metadata = createCollectionMetadata(locale, 'templates');

export default function TemplatesIndexPage() {
  return <TemplatesHubPageView locale={locale} />;
}
