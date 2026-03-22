import {
  getLatestBlogUpdate,
  getPublishedBlogPosts,
  type BlogPost,
} from '@/lib/blog-content';
import { getBlogIndexCopy } from '@/lib/blog-seo';
import { getSiteUrl } from '@/lib/site-content';
import type { SiteLocale } from '@/lib/site-locale';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildItem(post: BlogPost) {
  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.url)}</link>
      <guid>${escapeXml(post.url)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <author>${escapeXml(post.author)}</author>
      <category>${escapeXml(post.category)}</category>
    </item>`;
}

export function createBlogRssXml(locale: SiteLocale) {
  const siteUrl = getSiteUrl();
  const copy = getBlogIndexCopy(locale);
  const feedPath = locale === 'zh' ? '/zh/rss.xml' : '/rss.xml';
  const blogPath = locale === 'zh' ? '/zh/blog' : '/blog';
  const posts = getPublishedBlogPosts(locale);
  const latestUpdate = getLatestBlogUpdate(locale) ?? posts[0]?.publishedAt ?? new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(copy.title)}</title>
    <link>${escapeXml(`${siteUrl}${blogPath}`)}</link>
    <description>${escapeXml(copy.description)}</description>
    <language>${locale === 'zh' ? 'zh-CN' : 'en-US'}</language>
    <lastBuildDate>${new Date(latestUpdate).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}${feedPath}`)}" rel="self" type="application/rss+xml" />
    ${posts.map(buildItem).join('')}
  </channel>
</rss>`;
}
