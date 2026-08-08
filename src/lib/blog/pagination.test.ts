import { describe, expect, it } from 'vitest';

import { getBlogPageCount, getBlogPostsForPage } from './index';

describe('blog pagination capacity', () => {
  it.each(['en', 'zh'] as const)('keeps four %s pages filled as 10, 10, 10, and 9 posts', (locale) => {
    expect(getBlogPageCount(locale)).toBe(4);
    expect([1, 2, 3, 4].map((page) => getBlogPostsForPage(locale, page).length)).toEqual([10, 10, 10, 9]);
  });
});
