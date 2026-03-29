import { BlogHubPageView } from '@/components/site/views/BlogHubPageView';
import { createBlogHubMetadata } from '@/lib/blog-content';

const locale = 'en';

export const metadata = createBlogHubMetadata(locale);

export default function BlogIndexPage() {
  return <BlogHubPageView locale={locale} />;
}
