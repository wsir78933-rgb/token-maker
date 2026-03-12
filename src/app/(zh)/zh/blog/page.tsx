import { GuidesHubPageView } from '@/components/site/views/GuidesHubPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'zh';

export const metadata = createCollectionMetadata(locale, 'guides');

export default function ChineseBlogIndexPage() {
  return <GuidesHubPageView locale={locale} />;
}
