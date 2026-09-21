// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import EnglishBlogCategoryPage, {
  generateMetadata as generateEnglishBlogCategoryMetadata,
  generateStaticParams as generateEnglishBlogCategoryStaticParams,
} from '../../../app/(en)/blog/category/[category]/page';
import ChineseBlogCategoryPage, {
  generateMetadata as generateChineseBlogCategoryMetadata,
  generateStaticParams as generateChineseBlogCategoryStaticParams,
} from '../../../app/(zh)/zh/blog/category/[category]/page';
import {
  BLOG_CATEGORY_SLUGS,
  getBlogCategories,
  getBlogCategory,
  getBlogCategoryPath,
  getBlogPostPath,
  getBlogPostsByCategory,
} from '@/lib/blog-content';
import { getLocalizedPath } from '@/lib/site-locale';

import { BlogCategoryPageView } from './BlogCategoryPageView';
import { BlogHubPageView } from './BlogHubPageView';

const { notFoundMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
  useRouter: () => ({ push: vi.fn() }),
}));

const localeCases = [
  { locale: 'en' as const, categoryNavigationLabel: 'Browse by category' },
  { locale: 'zh' as const, categoryNavigationLabel: '按分类浏览' },
];

function getArticleCardPaths(container: HTMLElement) {
  return Array.from(container.querySelectorAll('a.site-surface-card')).map((link) =>
    link.getAttribute('href'),
  );
}

function readJsonLd(scriptId: string) {
  const script = document.getElementById(scriptId);

  if (!script?.textContent) {
    throw new Error(`Expected JSON-LD script ${scriptId}.`);
  }

  return JSON.parse(script.textContent) as Record<string, unknown>;
}

describe('blog category routes', () => {
  afterEach(() => {
    cleanup();
    notFoundMock.mockClear();
  });

  it('emits all five static category params in both locales', () => {
    const expectedParams = BLOG_CATEGORY_SLUGS.map((category) => ({ category }));

    expect(generateEnglishBlogCategoryStaticParams()).toEqual(expectedParams);
    expect(generateChineseBlogCategoryStaticParams()).toEqual(expectedParams);
  });

  it('builds localized category metadata through the public API', async () => {
    const englishMetadata = await generateEnglishBlogCategoryMetadata({
      params: Promise.resolve({ category: 'spells' }),
    });
    const chineseMetadata = await generateChineseBlogCategoryMetadata({
      params: Promise.resolve({ category: 'spells' }),
    });

    expect(englishMetadata.alternates).toMatchObject({
      canonical: '/blog/category/spells',
      languages: {
        'x-default': '/blog/category/spells',
        'en-US': '/blog/category/spells',
        'zh-CN': '/zh/blog/category/spells',
      },
    });
    expect(chineseMetadata.alternates?.canonical).toBe('/zh/blog/category/spells');
    expect(chineseMetadata.title).toBe('法术');
  });

  it.each([
    { page: EnglishBlogCategoryPage, locale: 'en' as const },
    { page: ChineseBlogCategoryPage, locale: 'zh' as const },
  ])('calls notFound for an unknown $locale category', async ({ page }) => {
    await expect(page({ params: Promise.resolve({ category: 'not-a-category' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it.each(localeCases)('renders every $locale category with localized paths and JSON-LD', ({ locale }) => {
    for (const category of BLOG_CATEGORY_SLUGS) {
      const categoryCopy = getBlogCategory(locale, category);
      const categoryPosts = getBlogPostsByCategory(locale, category);
      const { container } = render(<BlogCategoryPageView locale={locale} category={category} />);
      const articleCount =
        locale === 'zh'
          ? `${categoryPosts.length} 篇文章`
          : `${categoryPosts.length} ${categoryPosts.length === 1 ? 'article' : 'articles'}`;

      expect(screen.getByRole('heading', { level: 1, name: categoryCopy.label })).not.toBeNull();
      expect(screen.getByText(categoryCopy.description)).not.toBeNull();
      expect(screen.getAllByText(articleCount)).toHaveLength(2);
      expect(getArticleCardPaths(container)).toEqual(
        categoryPosts.map((post) => getBlogPostPath(locale, post.slug)),
      );

      const collectionStructuredData = readJsonLd(`blog-category-${locale}-${category}`);
      expect(collectionStructuredData).toMatchObject({
        '@type': 'CollectionPage',
        url: `https://www.tokenmaker.one${getBlogCategoryPath(locale, category)}`,
        inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
      });

      cleanup();
    }
  });

  it.each(localeCases)('keeps category article links and old article URLs stable for $locale', ({ locale }) => {
    const category = 'monsters';
    const categoryPosts = getBlogPostsByCategory(locale, category);
    const { container } = render(<BlogCategoryPageView locale={locale} category={category} />);

    expect(getArticleCardPaths(container)).toEqual(categoryPosts.map((post) => getBlogPostPath(locale, post.slug)));
    expect(getBlogPostPath('en', 'dnd-halfling')).toBe('/blog/dnd-halfling');
    expect(getBlogPostPath('zh', 'dnd-halfling')).toBe('/zh/blog/dnd-halfling');
  });

  it.each(localeCases)('adds all five localized category links to the $locale blog hub', ({ locale, categoryNavigationLabel }) => {
    const categoryLinks = getBlogCategories(locale);
    const { container } = render(<BlogHubPageView locale={locale} />);
    const categoryNavigation = container.querySelector(`nav[aria-label="${categoryNavigationLabel}"]`);

    if (!categoryNavigation) {
      throw new Error(`Expected category navigation for locale=${locale}.`);
    }

    expect(
      Array.from(categoryNavigation.querySelectorAll('a')).map((link) => ({
        href: link.getAttribute('href'),
        label: link.textContent,
      })),
    ).toEqual(
      categoryLinks.map((category) => ({
        href: getBlogCategoryPath(locale, category.slug),
        label: category.label,
      })),
    );
  });

  it('renders category collection and breadcrumb JSON-LD through the view', () => {
    render(<BlogCategoryPageView locale="zh" category="characters" />);

    const collectionStructuredData = readJsonLd('blog-category-zh-characters');
    const breadcrumbStructuredData = readJsonLd('blog-category-breadcrumb-zh-characters');

    expect(collectionStructuredData).toMatchObject({
      '@type': 'CollectionPage',
      url: 'https://www.tokenmaker.one/zh/blog/category/characters',
      inLanguage: 'zh-CN',
    });
    expect(breadcrumbStructuredData).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { item: 'https://www.tokenmaker.one/zh' },
        { item: 'https://www.tokenmaker.one/zh/blog' },
        { item: 'https://www.tokenmaker.one/zh/blog/category/characters' },
      ],
    });
    expect(
      (breadcrumbStructuredData.itemListElement as Array<{ item: string }>).map((item) =>
        new URL(item.item).pathname,
      ),
    ).toEqual([
      getLocalizedPath('zh', '/'),
      getLocalizedPath('zh', '/blog'),
      getBlogCategoryPath('zh', 'characters'),
    ]);
    expect(screen.getByRole('heading', { level: 1, name: '角色' })).not.toBeNull();
  });
});
