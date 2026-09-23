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
import EnglishBlogCategoryPaginationPage, {
  generateMetadata as generateEnglishBlogCategoryPaginationMetadata,
  generateStaticParams as generateEnglishBlogCategoryPaginationStaticParams,
} from '../../../app/(en)/blog/category/[category]/page/[page]/page';
import ChineseBlogCategoryPaginationPage, {
  generateMetadata as generateChineseBlogCategoryPaginationMetadata,
  generateStaticParams as generateChineseBlogCategoryPaginationStaticParams,
} from '../../../app/(zh)/zh/blog/category/[category]/page/[page]/page';
import {
  BLOG_CATEGORY_SLUGS,
  getBlogCategories,
  getBlogCategory,
  getBlogCategoryPageCount,
  getBlogCategoryPagePath,
  getBlogCategoryPath,
  getBlogPlaceholderCopy,
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
  return Array.from(container.querySelectorAll('a.site-surface-card')).map((link) => link.getAttribute('href'));
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

  it('emits all four static category params in both locales', () => {
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
  ])('calls notFound for an invalid $locale category', async ({ page }) => {
    for (const category of ['not-a-category', 'token-vtt']) {
      notFoundMock.mockClear();
      await expect(page({ params: Promise.resolve({ category }) })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(notFoundMock).toHaveBeenCalledTimes(1);
    }
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
        categoryPosts.slice(0, 10).map((post) => getBlogPostPath(locale, post.slug)),
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

    expect(getArticleCardPaths(container)).toEqual(
      categoryPosts.slice(0, 10).map((post) => getBlogPostPath(locale, post.slug)),
    );
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

  it.each(localeCases)('keeps the category shell for the $locale category page', ({ locale, categoryNavigationLabel }) => {
    const category = 'monsters';
    const { container } = render(<BlogCategoryPageView locale={locale} category={category} />);
    const categoryNavigation = container.querySelector(`nav[aria-label="${categoryNavigationLabel}"]`);

    if (!categoryNavigation) {
      throw new Error(`Expected category navigation for locale=${locale}.`);
    }

    const categoryLinks = Array.from(categoryNavigation.querySelectorAll('a'));
    expect(categoryLinks).toHaveLength(4);

    const currentLink = categoryLinks.find(
      (link) => link.getAttribute('href') === getBlogCategoryPath(locale, category),
    );
    expect(currentLink?.getAttribute('aria-current')).toBe('page');
    for (const link of categoryLinks) {
      if (link !== currentLink) {
        expect(link.getAttribute('aria-current')).toBeNull();
      }
    }

    const placeholderCopy = getBlogPlaceholderCopy(locale);
    expect(screen.getByRole('heading', { level: 2, name: placeholderCopy.ctaTitle })).not.toBeNull();
    expect(screen.queryByText(locale === 'zh' ? '分页' : 'Pages')).toBeNull();
  });

  it.each([
    { locale: 'en' as const },
    { locale: 'zh' as const },
  ])('renders only the first page of more-than-ten $locale category articles with a pager', ({ locale }) => {
    const category = 'characters';
    const categoryPosts = getBlogPostsByCategory(locale, category);
    const { container } = render(<BlogCategoryPageView locale={locale} category={category} />);

    expect(categoryPosts.length).toBeGreaterThan(10);
    expect(getArticleCardPaths(container)).toEqual(
      categoryPosts.slice(0, 10).map((post) => getBlogPostPath(locale, post.slug)),
    );
    expect(container.querySelector('[data-blog-featured-article]')).toBeNull();

    const paginationLabel = locale === 'zh' ? '分页' : 'Pages';
    expect(screen.getByRole('heading', { level: 2, name: paginationLabel })).not.toBeNull();
    expect(screen.getByRole('link', { name: /^2$/ }).getAttribute('href')).toBe(
      getBlogCategoryPagePath(locale, category, 2),
    );
  });

  it.each(localeCases)('renders the next $locale category slice without repeating page one', ({ locale }) => {
    const category = 'characters';
    const categoryPosts = getBlogPostsByCategory(locale, category);
    const firstPageSlugs = new Set(categoryPosts.slice(0, 10).map((post) => post.slug));
    const { container } = render(<BlogCategoryPageView locale={locale} category={category} page={2} />);

    expect(getArticleCardPaths(container)).toEqual(
      categoryPosts.slice(10, 20).map((post) => getBlogPostPath(locale, post.slug)),
    );
    expect(container.querySelector('[data-blog-featured-article]')).toBeNull();
    expect(getArticleCardPaths(container).some((path) => {
      const slug = path?.split('/').pop();
      return slug !== undefined && firstPageSlugs.has(slug);
    })).toBe(false);
  });

  it.each([
    {
      locale: 'en' as const,
      Page: EnglishBlogCategoryPaginationPage,
      generateMetadata: generateEnglishBlogCategoryPaginationMetadata,
      generateStaticParams: generateEnglishBlogCategoryPaginationStaticParams,
    },
    {
      locale: 'zh' as const,
      Page: ChineseBlogCategoryPaginationPage,
      generateMetadata: generateChineseBlogCategoryPaginationMetadata,
      generateStaticParams: generateChineseBlogCategoryPaginationStaticParams,
    },
  ])('rejects illegal $locale category page URLs before rendering', async ({ locale, Page, generateMetadata, generateStaticParams }) => {
    const category = 'characters';
    const pageCount = getBlogCategoryPageCount(locale, category);
    const expectedStaticParams = BLOG_CATEGORY_SLUGS.flatMap((categorySlug) => {
      const categoryPageCount = getBlogCategoryPageCount(locale, categorySlug);
      return Array.from({ length: Math.max(0, categoryPageCount - 1) }, (_, index) => ({
        category: categorySlug,
        page: String(index + 2),
      }));
    });

    expect(generateStaticParams()).toEqual(expectedStaticParams);
    expect((await generateMetadata({ params: Promise.resolve({ category, page: '2' }) })).alternates?.canonical).toBe(
      getBlogCategoryPagePath(locale, category, 2),
    );

    for (const page of ['1', '0', 'nope', String(pageCount + 1)]) {
      notFoundMock.mockClear();
      await expect(Page({ params: Promise.resolve({ category, page }) })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(notFoundMock).toHaveBeenCalledTimes(1);
    }

    notFoundMock.mockClear();
    await expect(Page({ params: Promise.resolve({ category: 'token-vtt', page: '2' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
    expect(notFoundMock).toHaveBeenCalledTimes(1);
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
