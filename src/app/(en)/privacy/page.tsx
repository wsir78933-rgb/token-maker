import { PrivacyDocPageView } from '@/components/site/views/PrivacyDocPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'en';

export const metadata = createCollectionMetadata(locale, 'privacy');

export default function PrivacyPage() {
  return <PrivacyDocPageView locale={locale} />;
}
