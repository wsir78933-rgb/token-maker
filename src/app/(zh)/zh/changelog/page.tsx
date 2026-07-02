import { ChangelogPageView } from '@/components/site/views/ChangelogPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'zh';

export const metadata = createCollectionMetadata(locale, 'changelog');

export default function ChineseChangelogPage() {
  return <ChangelogPageView locale={locale} />;
}
