import { AboutPageView } from '@/components/site/views/AboutPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'en';

export const metadata = createCollectionMetadata(locale, 'about');

export default function AboutPage() {
  return <AboutPageView locale={locale} />;
}
