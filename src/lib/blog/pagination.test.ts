import { describe, expect, it } from 'vitest';

import { getBlogPageCount, getBlogPostsForPage } from './index';

describe('blog pagination capacity', () => {
  it.each(['en', 'zh'] as const)('keeps the new non-featured Fighter guide first on page one', (locale) => {
    expect(getBlogPageCount(locale)).toBe(5);
    expect([1, 2, 3, 4, 5].map((page) => getBlogPostsForPage(locale, page).length)).toEqual(
      [10, 10, 10, 10, 8],
    );
    expect(getBlogPostsForPage(locale, 1)[0]?.slug).toBe('dnd-fighter');
  });
});
