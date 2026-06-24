import { AboutPageView } from '@/components/site/views/AboutPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'zh';

export const metadata = createCollectionMetadata(locale, 'about');

export default function ChineseAboutPage() {
  return <AboutPageView locale={locale} />;
}
