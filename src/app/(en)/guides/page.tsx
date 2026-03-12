import { GuidesHubPageView } from '@/components/site/views/GuidesHubPageView';
import { createCollectionMetadata } from '@/lib/site-page-models';

const locale = 'en';

export const metadata = createCollectionMetadata(locale, 'guides');

export default function GuidesIndexPage() {
  return <GuidesHubPageView locale={locale} />;
}
