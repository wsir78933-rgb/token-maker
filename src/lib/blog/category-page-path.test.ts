import { describe, expect, test } from 'vitest';

import { getBlogCategoryPageCount, getBlogCategoryPagePath } from '@/lib/blog-content';

const CHARACTERS_CATEGORY_SLUG = 'characters';

describe('blog category page paths', () => {
  test('keeps page 1 on the category hub and later pages under /page/n', () => {
    expect(getBlogCategoryPagePath('en', CHARACTERS_CATEGORY_SLUG, 1)).toBe('/blog/category/characters');
    expect(getBlogCategoryPagePath('zh', CHARACTERS_CATEGORY_SLUG, 1)).toBe(
      '/zh/blog/category/characters',
    );
    expect(getBlogCategoryPagePath('en', CHARACTERS_CATEGORY_SLUG, 2)).toBe(
      '/blog/category/characters/page/2',
    );
    expect(getBlogCategoryPagePath('zh', CHARACTERS_CATEGORY_SLUG, 2)).toBe(
      '/zh/blog/category/characters/page/2',
    );
  });

  test('fails fast when the page is 0 or past the last characters page', () => {
    const charactersPageCount = getBlogCategoryPageCount('en', CHARACTERS_CATEGORY_SLUG);
    const pageZero = 0;
    const pagePastCharactersEnd = charactersPageCount + 1;

    expect(() => getBlogCategoryPagePath('en', CHARACTERS_CATEGORY_SLUG, pageZero)).toThrow(
      new RegExp(`(?<!\\d)${pageZero}(?!\\d)`),
    );
    expect(() => getBlogCategoryPagePath('en', CHARACTERS_CATEGORY_SLUG, pagePastCharactersEnd)).toThrow(
      new RegExp(`(?<!\\d)${pagePastCharactersEnd}(?!\\d)`),
    );
  });
});
