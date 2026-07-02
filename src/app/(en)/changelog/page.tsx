import { ChangelogPageView } from '@/components/site/views/ChangelogPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'en';

export const metadata = createCollectionMetadata(locale, 'changelog');

export default function ChangelogPage() {
  return <ChangelogPageView locale={locale} />;
}
