// @vitest-environment jsdom

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import EnglishBlogPostPage, {
  generateStaticParams as generateEnglishStaticParams,
} from '@/app/(en)/blog/[slug]/page';
import ChineseBlogPostPage, {
  generateStaticParams as generateChineseStaticParams,
} from '@/app/(zh)/zh/blog/[slug]/page';
import sitemap from '@/app/sitemap';
import { getBlogPost, getBlogPosts, getRelatedBlogPosts } from './index';

const REMOVED_SLUG = 'greenhouse-stardew';
const localeCases = [
  { locale: 'en', page: EnglishBlogPostPage, generateStaticParams: generateEnglishStaticParams },
  { locale: 'zh', page: ChineseBlogPostPage, generateStaticParams: generateChineseStaticParams },
] as const;

describe('removed greenhouse stardew blog post', () => {
  test.each(localeCases)('removes the article from $locale listings and static routes', ({ locale, generateStaticParams }) => {
    expect(getBlogPost(locale, REMOVED_SLUG)).toBeUndefined();
    expect(getBlogPosts(locale).some((post) => post.slug === REMOVED_SLUG)).toBe(false);
    expect(generateStaticParams()).not.toContainEqual({ slug: REMOVED_SLUG });
    expect(getRelatedBlogPosts(locale, REMOVED_SLUG, 4)).toEqual([]);
    expect(getRelatedBlogPosts(locale, 'dnd-meaning', 4).some((post) => post.slug === REMOVED_SLUG)).toBe(false);
  });

  test.each(localeCases)('returns not found for the former $locale article route', async ({ page }) => {
    await expect(page({ params: Promise.resolve({ slug: REMOVED_SLUG }) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    );
  });

  test('removes the bilingual sitemap and llms entries', () => {
    expect(sitemap().some((entry) => entry.url.includes(REMOVED_SLUG))).toBe(false);
    expect(readFileSync('public/llms.txt', 'utf8')).not.toContain(REMOVED_SLUG);
  });

  test('removes the article source and its exclusive illustrations', () => {
    expect(existsSync('src/lib/blog-posts/greenhouse-stardew.ts')).toBe(false);
    expect(existsSync('public/blog/inline/greenhouse-stardew')).toBe(false);
  });
});
