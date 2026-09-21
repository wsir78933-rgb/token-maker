import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  BLOG_CATEGORY_SLUGS,
  createBlogCategoryMetadata,
  getBlogCategoryPath,
  getBlogPostsByCategory,
} from '@/lib/blog-content';
import type { BlogCategorySlug } from '@/lib/blog-content';

const SITE_URL = 'https://www.tokenmaker.one';
const CATEGORY_PRIORITY = 0.65;
const EMPTY_CATEGORY_LAST_MODIFIED = '2026-03-12';
const EXPECTED_CATEGORY_LAST_MODIFIED: Record<BlogCategorySlug, string> = {
  'token-vtt': EMPTY_CATEGORY_LAST_MODIFIED,
  characters: '2026-09-20',
  monsters: '2026-09-16',
  spells: '2026-09-16',
  'rules-and-prep': '2026-09-13',
};

function getSitemapEntry(url: string) {
  const matchingEntries = sitemap().filter((entry) => entry.url === url);

  expect(matchingEntries).toHaveLength(1);
  return matchingEntries[0];
}

function getExpectedLanguageAlternates(categorySlug: BlogCategorySlug) {
  return {
    'x-default': `${SITE_URL}/blog/category/${categorySlug}`,
    'en-US': `${SITE_URL}/blog/category/${categorySlug}`,
    'zh-CN': `${SITE_URL}/zh/blog/category/${categorySlug}`,
  };
}

describe('blog category sitemap entries', () => {
  test('publishes exactly five bilingual category hubs with stable sitemap fields', () => {
    const entries = sitemap();
    const categoryEntries = entries.filter((entry) => entry.url.includes('/blog/category/'));

    expect(categoryEntries).toHaveLength(BLOG_CATEGORY_SLUGS.length * 2);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    expect(getBlogPostsByCategory('en', 'token-vtt')).toEqual([]);

    for (const categorySlug of BLOG_CATEGORY_SLUGS) {
      const expectedAlternates = getExpectedLanguageAlternates(categorySlug);

      for (const locale of ['en', 'zh'] as const) {
        const localizedPath = getBlogCategoryPath(locale, categorySlug);
        const entry = getSitemapEntry(`${SITE_URL}${localizedPath}`);

        expect(entry).toMatchObject({
          lastModified: new Date(EXPECTED_CATEGORY_LAST_MODIFIED[categorySlug]),
          changeFrequency: 'weekly',
          priority: CATEGORY_PRIORITY,
          alternates: { languages: expectedAlternates },
        });
      }
    }
  });

  test('keeps every category metadata canonical and bilingual', () => {
    for (const categorySlug of BLOG_CATEGORY_SLUGS) {
      const expectedLanguages = {
        'x-default': `/blog/category/${categorySlug}`,
        'en-US': `/blog/category/${categorySlug}`,
        'zh-CN': `/zh/blog/category/${categorySlug}`,
      };

      for (const locale of ['en', 'zh'] as const) {
        const metadata = createBlogCategoryMetadata(locale, categorySlug);

        expect(metadata.alternates?.canonical).toBe(getBlogCategoryPath(locale, categorySlug));
        expect(metadata.alternates?.languages).toEqual(expectedLanguages);
      }
    }
  });
});
