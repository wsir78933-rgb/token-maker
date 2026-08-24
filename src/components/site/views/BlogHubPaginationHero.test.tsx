// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getBlogPageCount, getBlogPostPath, getBlogPostsForPage, getFeaturedBlogPost } from '@/lib/blog-content';

import { BlogHubPageView } from './BlogHubPageView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const paginationHeroCases = [
  { locale: 'en' as const, featuredEyebrow: "Editor's Pick", pageLabelPrefix: 'Page' },
  { locale: 'zh' as const, featuredEyebrow: '编辑精选', pageLabelPrefix: '第' },
];

describe('blog pagination heroes', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(paginationHeroCases)(
    'renders the featured article card on every $locale pagination page',
    ({ locale, featuredEyebrow }) => {
      for (const page of [2, 3, 4]) {
        render(<BlogHubPageView locale={locale} page={page} />);

        expect(screen.getByText(featuredEyebrow)).not.toBeNull();

        cleanup();
      }
    },
  );

  it.each(paginationHeroCases)(
    'keeps page labels out of the $locale hero header on every pagination page',
    ({ locale, pageLabelPrefix }) => {
      for (const page of [2, 3, 4]) {
        render(<BlogHubPageView locale={locale} page={page} />);

        const heroHeader = screen.getByRole('heading', { level: 1 }).closest('header');

        if (!heroHeader) {
          throw new Error('Expected the blog hub heading to be inside a hero header.');
        }

        expect(heroHeader.textContent).not.toMatch(new RegExp(`${pageLabelPrefix}\\s*${page}`));

        cleanup();
      }
    },
  );

  it.each(paginationHeroCases)(
    'keeps the global featured card and the full regular grid on $locale page one',
    ({ locale }) => {
      const featuredPost = getFeaturedBlogPost(locale);
      if (!featuredPost) {
        throw new Error(`Expected a global featured post for locale=${locale}.`);
      }

      const pageOnePosts = getBlogPostsForPage(locale, 1);
      const { container } = render(<BlogHubPageView locale={locale} page={1} />);
      const heroTitle = screen.getByRole('heading', { level: 2, name: featuredPost.title });
      const gridPaths = Array.from(container.querySelectorAll('a.site-surface-card')).map((link) =>
        link.getAttribute('href'),
      );

      expect(heroTitle.closest('a')?.getAttribute('href')).toBe(getBlogPostPath(locale, featuredPost.slug));
      expect(gridPaths).toEqual(pageOnePosts.map((post) => getBlogPostPath(locale, post.slug)));
    },
  );

  it.each(paginationHeroCases)(
    'uses the previous page lead as the $locale page 2+ hero while keeping every current-page grid article',
    ({ locale }) => {
      const finalPage = getBlogPageCount(locale);
      const pageOneFeaturedPost = getFeaturedBlogPost(locale);
      if (!pageOneFeaturedPost) {
        throw new Error(`Expected a global featured post for locale=${locale}.`);
      }

      const heroSlugs = new Set([pageOneFeaturedPost.slug]);

      for (let page = 2; page <= finalPage; page += 1) {
        const originalPagePosts = getBlogPostsForPage(locale, page);
        const expectedHeroPost = getBlogPostsForPage(locale, page - 1)[0];
        if (!expectedHeroPost) {
          throw new Error(`Expected a hero post for locale=${locale}, page=${page}.`);
        }

        const { container } = render(<BlogHubPageView locale={locale} page={page} />);
        const heroTitle = screen.getByRole('heading', {
          level: 2,
          name: expectedHeroPost.title,
        });
        const gridPaths = Array.from(container.querySelectorAll('a.site-surface-card')).map((link) =>
          link.getAttribute('href'),
        );

        expect(heroTitle.closest('a')?.getAttribute('href')).toBe(
          getBlogPostPath(locale, expectedHeroPost.slug),
        );
        expect(gridPaths).toEqual(originalPagePosts.map((post) => getBlogPostPath(locale, post.slug)));
        expect(gridPaths).not.toContain(getBlogPostPath(locale, expectedHeroPost.slug));
        heroSlugs.add(expectedHeroPost.slug);

        cleanup();
      }

      expect(heroSlugs).toHaveLength(finalPage);
    },
  );
});
