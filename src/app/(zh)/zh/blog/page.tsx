import { BlogHubPageView } from '@/components/site/views/BlogHubPageView';
import { createBlogHubMetadata } from '@/lib/blog-content';

const locale = 'zh';

export const metadata = createBlogHubMetadata(locale);

export default function ChineseBlogIndexPage() {
  return <BlogHubPageView locale={locale} />;
}
