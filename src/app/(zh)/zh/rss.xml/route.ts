import { createBlogRssXml } from '@/lib/blog-rss';

export function GET() {
  return new Response(createBlogRssXml('zh'), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
