import { PrivacyDocPageView } from '@/components/site/views/PrivacyDocPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'zh';

export const metadata = createCollectionMetadata(locale, 'privacy');

export default function ChinesePrivacyPage() {
  return <PrivacyDocPageView locale={locale} />;
}
