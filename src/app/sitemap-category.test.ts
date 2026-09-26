import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  BLOG_CATEGORY_SLUGS,
  createBlogCategoryMetadata,
  getBlogCategoryPageCount,
  getBlogCategoryPagePath,
  getBlogCategoryPath,
} from '@/lib/blog-content';
import type { BlogCategorySlug } from '@/lib/blog-content';

const SITE_URL = 'https://www.tokenmaker.one';
const CATEGORY_PRIORITY = 0.65;
const EXPECTED_CATEGORY_LAST_MODIFIED: Record<BlogCategorySlug, string> = {
  characters: '2026-09-20',
  monsters: '2026-09-16',
  spells: '2026-09-26',
  'rules-and-prep': '2026-09-24',
};

function getSitemapEntry(url: string) {
  const matchingEntries = sitemap().filter((entry) => entry.url === url);

  expect(matchingEntries).toHaveLength(1);
  return matchingEntries[0];
}

function getExpectedLanguageAlternates(categorySlug: BlogCategorySlug, page = 1) {
  const englishPath = getBlogCategoryPagePath('en', categorySlug, page);
  const chinesePath = getBlogCategoryPagePath('zh', categorySlug, page);

  return {
    'x-default': `${SITE_URL}${englishPath}`,
    'en-US': `${SITE_URL}${englishPath}`,
    'zh-CN': `${SITE_URL}${chinesePath}`,
  };
}

describe('blog category sitemap entries', () => {
  test('publishes bilingual category pages with stable sitemap fields', () => {
    const entries = sitemap();
    const categoryEntries = entries.filter((entry) => entry.url.includes('/blog/category/'));
    const expectedCategoryEntryCount = BLOG_CATEGORY_SLUGS.reduce(
      (total, categorySlug) => total + getBlogCategoryPageCount('en', categorySlug) + getBlogCategoryPageCount('zh', categorySlug),
      0,
    );

    expect(categoryEntries).toHaveLength(expectedCategoryEntryCount);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    expect(entries.some((entry) => entry.url.includes('/blog/category/token-vtt'))).toBe(false);

    for (const categorySlug of BLOG_CATEGORY_SLUGS) {
      for (const locale of ['en', 'zh'] as const) {
        const totalPages = getBlogCategoryPageCount(locale, categorySlug);

        for (let page = 1; page <= totalPages; page += 1) {
          const localizedPath = getBlogCategoryPagePath(locale, categorySlug, page);
          const entry = getSitemapEntry(`${SITE_URL}${localizedPath}`);

          expect(entry).toMatchObject({
            lastModified: new Date(EXPECTED_CATEGORY_LAST_MODIFIED[categorySlug]),
            changeFrequency: 'weekly',
            priority: page === 1 ? CATEGORY_PRIORITY : 0.55,
            alternates: { languages: getExpectedLanguageAlternates(categorySlug, page) },
          });
        }
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
