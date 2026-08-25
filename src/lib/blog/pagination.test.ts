import { describe, expect, it } from 'vitest';

import {
  buildBlogHubStructuredData,
  createBlogHubMetadata,
  createBlogPostMetadata,
  getBlogHubDescription,
  getBlogPageCount,
  getBlogPagePath,
  getBlogPostsForPage,
} from './index';

describe('blog pagination capacity', () => {
  it.each(['en', 'zh'] as const)(
    'keeps the new non-featured class comparison guide first on page one',
    (locale) => {
      expect(getBlogPageCount(locale)).toBe(5);
      expect([1, 2, 3, 4, 5].map((page) => getBlogPostsForPage(locale, page).length)).toEqual(
        [10, 10, 10, 10, 10],
      );
      expect(getBlogPostsForPage(locale, 1)[0]?.slug).toBe('dnd-classes-comparison');
    },
  );

  it.each(['en', 'zh'] as const)(
    'gives every $locale archive page a distinct description that matches its metadata surfaces',
    (locale) => {
      const totalPages = getBlogPageCount(locale);
      const pageDescriptions = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const description = createBlogHubMetadata(locale, page).description;

        if (typeof description !== 'string') {
          throw new Error(`Expected a description for locale=${locale}, page=${page}.`);
        }

        return description;
      });

      expect(pageDescriptions[0]).toBe(getBlogHubDescription(locale));
      expect(new Set(pageDescriptions).size).toBe(totalPages);

      if (locale === 'en') {
        expect(pageDescriptions[0]).toHaveLength(139);
        for (const description of pageDescriptions) {
          expect(description.length).toBeGreaterThanOrEqual(120);
          expect(description.length).toBeLessThanOrEqual(160);
        }
      }

      for (const page of [2, totalPages]) {
        const leadPost = getBlogPostsForPage(locale, page - 1)[0];
        if (!leadPost) {
          throw new Error(`Expected a lead post for locale=${locale}, page=${page}.`);
        }

        const metadata = createBlogHubMetadata(locale, page);
        const description = metadata.description;
        const articleDescription = createBlogPostMetadata(locale, leadPost.slug).description;
        const structuredData = buildBlogHubStructuredData(locale, page);

        expect(description).not.toBe(articleDescription);
        expect(metadata.openGraph?.description).toBe(description);
        expect(metadata.twitter?.description).toBe(description);
        expect(structuredData.description).toBe(description);
        expect(metadata.alternates?.canonical).toBe(getBlogPagePath(locale, page));
      }
    },
  );

  it.each(['en', 'zh'] as const)(
    'fails fast with the locale and page when $locale pagination has no article content',
    (locale) => {
      const missingPage = getBlogPageCount(locale) + 1;

      expect(() => createBlogHubMetadata(locale, missingPage)).toThrow(
        new RegExp(`locale=${locale}.*page=${missingPage}`),
      );
    },
  );
});
