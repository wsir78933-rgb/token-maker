import { FaqDocPageView } from '@/components/site/views/FaqDocPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'zh';

export const metadata = createCollectionMetadata(locale, 'faq');

export default function ChineseFaqPage() {
  return <FaqDocPageView locale={locale} />;
}
