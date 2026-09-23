import { describe, expect, test } from 'vitest';

import {
  BLOG_CATEGORY_SLUGS,
  UNCATEGORIZED_BLOG_POST_SLUG,
  assignBlogPostCategory,
  buildBlogCategoryBreadcrumbStructuredData,
  buildBlogCategoryCollectionStructuredData,
  createBlogCategoryMetadata,
  getBlogCategoryPageCount,
  getBlogCategoryPagePath,
  getBlogCategories,
  getBlogCategory,
  getBlogCategoryPath,
  getBlogPageCount,
  getBlogPost,
  getBlogPostPath,
  getBlogPosts,
  getBlogPostsByCategory,
  getBlogPostsForCategoryPage,
  getBlogPostsForPage,
  isBlogCategorySlug,
  requireBlogCategorySlug,
} from './index';
import { postsByLocale } from './registry';
import type { BlogPost } from './types';
import type { SiteLocale } from '@/lib/site-locale';

const EXPECTED_CATEGORY_SLUGS = [
  'characters',
  'monsters',
  'spells',
  'rules-and-prep',
] as const;

function minimalBlogPost(slug: string, category?: BlogPost['category']): BlogPost {
  return {
    slug,
    title: slug,
    excerpt: slug,
    updatedAt: '2026-01-01',
    readTime: '1 min read',
    coverLabel: 'Test',
    category,
  };
}

describe('blog category configuration', () => {
  test('exposes four stable bilingual category hubs', () => {
    expect(BLOG_CATEGORY_SLUGS).toEqual([...EXPECTED_CATEGORY_SLUGS]);

    const englishCategories = getBlogCategories('en');
    const chineseCategories = getBlogCategories('zh');

    expect(englishCategories.map((category) => category.slug)).toEqual([...EXPECTED_CATEGORY_SLUGS]);
    expect(chineseCategories.map((category) => category.slug)).toEqual([...EXPECTED_CATEGORY_SLUGS]);

    expect(getBlogCategory('en', 'characters').label).toBe('Characters');
    expect(getBlogCategory('zh', 'characters').label).toBe('角色');
    expect(getBlogCategory('en', 'monsters').label).toBe('Monsters');
    expect(getBlogCategory('zh', 'monsters').label).toBe('怪物');
    expect(getBlogCategory('en', 'spells').label).toBe('Spells');
    expect(getBlogCategory('zh', 'spells').label).toBe('法术');
    expect(getBlogCategory('en', 'rules-and-prep').label).toBe('Rules & Game Prep');
    expect(getBlogCategory('zh', 'rules-and-prep').label).toBe('规则与游戏准备');

    for (const categorySlug of EXPECTED_CATEGORY_SLUGS) {
      const englishCopy = getBlogCategory('en', categorySlug);
      const chineseCopy = getBlogCategory('zh', categorySlug);
      expect(englishCopy.description.length).toBeGreaterThan(0);
      expect(chineseCopy.description.length).toBeGreaterThan(0);
      expect(getBlogCategoryPath('en', categorySlug)).toBe(`/blog/category/${categorySlug}`);
      expect(getBlogCategoryPath('zh', categorySlug)).toBe(`/zh/blog/category/${categorySlug}`);
      expect(isBlogCategorySlug(categorySlug)).toBe(true);
    }
  });

  test('builds category metadata, CollectionPage, and breadcrumb data', () => {
    expect(createBlogCategoryMetadata('en', 'spells')).toMatchObject({
      title: 'Spells',
      description: getBlogCategory('en', 'spells').description,
      alternates: {
        canonical: '/blog/category/spells',
        languages: {
          'x-default': '/blog/category/spells',
          'en-US': '/blog/category/spells',
          'zh-CN': '/zh/blog/category/spells',
        },
      },
    });
    expect(createBlogCategoryMetadata('zh', 'spells')).toMatchObject({
      title: '法术',
      alternates: { canonical: '/zh/blog/category/spells' },
    });
    expect(buildBlogCategoryCollectionStructuredData('en', 'monsters')).toMatchObject({
      '@type': 'CollectionPage',
      name: 'Monsters',
      url: 'https://www.tokenmaker.one/blog/category/monsters',
      inLanguage: 'en-US',
    });
    expect(buildBlogCategoryBreadcrumbStructuredData('zh', 'characters')).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: 'https://www.tokenmaker.one/zh',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '博客',
          item: 'https://www.tokenmaker.one/zh/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '角色',
          item: 'https://www.tokenmaker.one/zh/blog/category/characters',
        },
      ],
    });
  });
});

describe('blog post category assignment', () => {
  test('covers all 68 unique slugs, keeps en/zh aligned, and leaves greenhouse-stardew uncategorized', () => {
    const englishSlugs = postsByLocale.en.map((post) => post.slug);
    const chineseSlugs = postsByLocale.zh.map((post) => post.slug);

    expect(englishSlugs).toHaveLength(68);
    expect(new Set(englishSlugs).size).toBe(68);
    expect(chineseSlugs).toEqual(englishSlugs);
    expect(englishSlugs).toContain('dnd-schools-of-magic');
    expect(englishSlugs).toContain('best-dnd-classes-for-small-parties');
    expect(englishSlugs).toContain(UNCATEGORIZED_BLOG_POST_SLUG);

    for (let index = 0; index < englishSlugs.length; index += 1) {
      const englishPost = postsByLocale.en[index];
      const chinesePost = postsByLocale.zh[index];
      expect(chinesePost?.slug).toBe(englishPost?.slug);
      expect(chinesePost?.category).toBe(englishPost?.category);

      if (englishPost?.slug === UNCATEGORIZED_BLOG_POST_SLUG) {
        expect(englishPost.category).toBeUndefined();
        continue;
      }

      expect(englishPost?.category).toBeDefined();
      expect(EXPECTED_CATEGORY_SLUGS).toContain(englishPost?.category);
    }

    const categorizedCount = postsByLocale.en.filter((post) => post.category !== undefined).length;
    expect(categorizedCount).toBe(67);

    expect(getBlogPost('en', 'dnd-schools-of-magic')?.category).toBe('spells');
    expect(getBlogPost('zh', 'dnd-schools-of-magic')?.category).toBe('spells');
    expect(getBlogPost('en', UNCATEGORIZED_BLOG_POST_SLUG)?.category).toBeUndefined();
    expect(getBlogPost('zh', UNCATEGORIZED_BLOG_POST_SLUG)?.category).toBeUndefined();
  });

  test('returns published posts for a category in registry order and omits placeholders', () => {
    const publishedMonsters = getBlogPostsByCategory('en', 'monsters');
    expect(publishedMonsters.every((post) => post.category === 'monsters')).toBe(true);
    expect(publishedMonsters.map((post) => post.slug)).toEqual(
      getBlogPosts('en')
        .filter((post) => post.category === 'monsters')
        .map((post) => post.slug),
    );
    expect(publishedMonsters.some((post) => post.placeholder)).toBe(false);
    expect(publishedMonsters.some((post) => post.slug === UNCATEGORIZED_BLOG_POST_SLUG)).toBe(false);

    const englishCharacters = getBlogPostsByCategory('en', 'characters');
    const chineseCharacters = getBlogPostsByCategory('zh', 'characters');
    expect(englishCharacters.map((post) => post.slug)).toEqual(chineseCharacters.map((post) => post.slug));
    expect(englishCharacters.some((post) => post.slug === 'best-dnd-classes-for-small-parties')).toBe(
      false,
    );
  });

  test('paginates category posts in registry order and rejects illegal pages', () => {
    const categoryPosts = getBlogPostsByCategory('en', 'characters');
    const totalPages = getBlogCategoryPageCount('en', 'characters');
    const firstPagePosts = getBlogPostsForCategoryPage('en', 'characters', 1);
    const secondPagePosts = getBlogPostsForCategoryPage('en', 'characters', 2);

    expect(totalPages).toBeGreaterThan(1);
    expect(firstPagePosts).toEqual(categoryPosts.slice(0, 10));
    expect(secondPagePosts).toEqual(categoryPosts.slice(10, 20));
    expect(getBlogCategoryPagePath('en', 'characters', 1)).toBe('/blog/category/characters');
    expect(getBlogCategoryPagePath('zh', 'characters', 2)).toBe('/zh/blog/category/characters/page/2');

    expect(() => getBlogPostsForCategoryPage('en', 'characters', 0)).toThrow(
      new RegExp(`characters.*page=0.*pageCount=${totalPages}`),
    );

    const pastEndPage = totalPages + 1;
    expect(() => getBlogPostsForCategoryPage('en', 'characters', pastEndPage)).toThrow(
      new RegExp(`characters.*page=${pastEndPage}.*pageCount=${totalPages}`),
    );
  });

  test('fails fast on unknown category slugs and illegal assignment boundaries', () => {
    expect(() => requireBlogCategorySlug('not-a-hub')).toThrow('Unknown blog category slug: "not-a-hub".');
    expect(() => requireBlogCategorySlug('')).toThrow('Unknown blog category slug: "".');
    expect(() => requireBlogCategorySlug('Characters')).toThrow(
      'Unknown blog category slug: "Characters".',
    );
    expect(() => requireBlogCategorySlug('token-vtt')).toThrow(
      'Unknown blog category slug: "token-vtt".',
    );
    expect(() => getBlogCategory('en', 'wizard')).toThrow('Unknown blog category slug: "wizard".');
    expect(() => getBlogPostsByCategory('zh', 'token_vtt')).toThrow(
      'Unknown blog category slug: "token_vtt".',
    );
    expect(() => getBlogCategory('fr' as SiteLocale, 'spells')).toThrow('Unknown blog locale: "fr".');
    expect(isBlogCategorySlug('greenhouse-stardew')).toBe(false);
    expect(isBlogCategorySlug('token-vtt')).toBe(false);

    expect(() => assignBlogPostCategory(minimalBlogPost('missing-slug-for-category'))).toThrow(
      'Blog post slug="missing-slug-for-category" is missing a required category.',
    );
    expect(() => assignBlogPostCategory(minimalBlogPost(UNCATEGORIZED_BLOG_POST_SLUG, 'spells'))).toThrow(
      `Blog post slug="${UNCATEGORIZED_BLOG_POST_SLUG}" must remain uncategorized, received category="spells".`,
    );
    expect(() => assignBlogPostCategory(minimalBlogPost('dnd-fighter', 'spells'))).toThrow(
      'Blog post slug="dnd-fighter" has conflicting category="spells", mapped="characters".',
    );
  });
});

describe('existing blog queries after category assignment', () => {
  test('keeps article slugs, URLs, and pagination semantics unchanged', () => {
    expect(getBlogPostPath('en', 'dnd-halfling')).toBe('/blog/dnd-halfling');
    expect(getBlogPostPath('zh', 'dnd-halfling')).toBe('/zh/blog/dnd-halfling');
    expect(getBlogPostPath('en', 'dnd-schools-of-magic')).toBe('/blog/dnd-schools-of-magic');
    expect(getBlogPostPath('zh', 'greenhouse-stardew')).toBe('/zh/blog/greenhouse-stardew');

    expect(getBlogPost('en', 'dnd-halfling')?.slug).toBe('dnd-halfling');
    expect(getBlogPost('zh', 'dnd-kobold')?.slug).toBe('dnd-kobold');
    expect(getBlogPost('en', 'dnd-classes-explained')?.featured).toBe(true);
    expect(getBlogPost('en', 'dnd-schools-of-magic')?.featured).toBe(true);

    expect(getBlogPageCount('en')).toBe(7);
    expect(getBlogPageCount('zh')).toBe(7);
    expect(getBlogPostsForPage('en', 1)[0]?.slug).toBe('dnd-halfling');
    expect(getBlogPostsForPage('zh', 1)[0]?.slug).toBe('dnd-halfling');
    expect(getBlogPosts('en').map((post) => post.slug)).toEqual(getBlogPosts('zh').map((post) => post.slug));
  });
});
