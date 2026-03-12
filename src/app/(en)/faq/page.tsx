import { FaqDocPageView } from '@/components/site/views/FaqDocPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'en';

export const metadata = createCollectionMetadata(locale, 'faq');

export default function FaqPage() {
  return <FaqDocPageView locale={locale} />;
}
