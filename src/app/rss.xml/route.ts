import { createBlogRssXml } from '@/lib/blog-rss';

export function GET() {
  return new Response(createBlogRssXml('en'), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
