// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getBlogPosts } from '@/lib/blog-content';
import { getBlogToolRecommendations } from '@/lib/blog/tool-recommendations';
import { getToolDirectoryItems } from '@/lib/tool-directory';

import { BlogDetailPageView } from './BlogDetailPageView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const localeCases = [
  {
    locale: 'en' as const,
    actionCardLabel: 'What to do next',
    relatedHeading: 'Related articles',
    coatMakerLabel: 'Coat of Arms Maker',
    diceLabel: 'Dice Roller',
    expectedHref: '/coat-of-arms-maker',
    expectedDiceHref: '/dice-roller-dnd',
  },
  {
    locale: 'zh' as const,
    actionCardLabel: '现在可以做什么',
    relatedHeading: '相关文章',
    coatMakerLabel: '纹章制作器',
    diceLabel: '骰子工具',
    expectedHref: '/zh/coat-of-arms-maker',
    expectedDiceHref: '/zh/dice-roller-dnd',
  },
];

const editorialMetadataCases = [
  {
    locale: 'en' as const,
    slug: 'dnd-meaning',
    byline: 'Published and maintained by Token Maker',
    authorByline: 'By Leo',
    aboutHref: '/about',
    publishedLabel: 'Published',
    updatedLabel: 'Updated',
    expectedDateTimes: ['2026-08-12', '2026-08-12'],
  },
  {
    locale: 'zh' as const,
    slug: 'dnd-meaning',
    byline: '由 Token Maker 发布与维护',
    authorByline: '作者：Leo',
    aboutHref: '/zh/about',
    publishedLabel: '发布于',
    updatedLabel: '更新于',
    expectedDateTimes: ['2026-08-12', '2026-08-12'],
  },
  {
    locale: 'en' as const,
    slug: 'dnd-classes-explained',
    byline: 'Published and maintained by Token Maker',
    authorByline: 'By Leo',
    aboutHref: '/about',
    publishedLabel: 'Published',
    updatedLabel: 'Updated',
    expectedDateTimes: ['2026-03-29'],
  },
  {
    locale: 'zh' as const,
    slug: 'dnd-classes-explained',
    byline: '由 Token Maker 发布与维护',
    authorByline: '作者：Leo',
    aboutHref: '/zh/about',
    publishedLabel: '发布于',
    updatedLabel: '更新于',
    expectedDateTimes: ['2026-03-29'],
  },
];

describe('BlogDetailPageView article actions', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(localeCases)('preserves localized tools in the $locale top action card', (testCase) => {
    render(<BlogDetailPageView locale={testCase.locale} slug="dnd-meaning" />);

    const actionCard = screen.getByText(testCase.actionCardLabel).closest('aside');

    if (!actionCard) {
      throw new Error(`Expected the top action card for locale ${testCase.locale}.`);
    }

    const actionCardCoatMakerLink = within(actionCard).getByRole('link', {
      name: testCase.coatMakerLabel,
    });
    const actionCardDiceLink = within(actionCard).getByRole('link', { name: testCase.diceLabel });

    expect(actionCardCoatMakerLink.getAttribute('href')).toBe(testCase.expectedHref);
    expect(actionCardDiceLink.getAttribute('href')).toBe(testCase.expectedDiceHref);
  });
});

describe('BlogDetailPageView blog tool recommendations', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(['en', 'zh'] as const)('has four distinct recommendations for every published $locale post', (locale) => {
    const publishedPosts = getBlogPosts(locale);

    expect(publishedPosts.length).toBeGreaterThan(0);
    for (const post of publishedPosts) {
      const recommendation = getBlogToolRecommendations(locale, post.slug);

      expect(recommendation.description.trim()).not.toBe('');
      expect(recommendation.toolIds).toHaveLength(4);
      expect(new Set(recommendation.toolIds).size).toBe(4);
    }
  });

  it.each(localeCases)('keeps the approved four-card class-guide CTA in $locale', (testCase) => {
    render(<BlogDetailPageView locale={testCase.locale} slug="dnd-classes-explained" />);
    const heading = testCase.locale === 'zh' ? '你可能会用到的工具' : 'Tools you might find useful';
    const section = screen.getByRole('region', { name: heading });
    const links = within(within(section).getByRole('list')).getAllByRole('link');
    const pathPrefix = testCase.locale === 'zh' ? '/zh' : '';

    const moreToolsLink = within(section).getByRole('link', {
      name: testCase.locale === 'zh' ? '更多工具' : 'More tools',
    });
    expect(moreToolsLink.getAttribute('href')).toBe(`${pathPrefix}/tools`);

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      `${pathPrefix || '/'}#editor-workspace`,
      `${pathPrefix}/coat-of-arms-maker`,
      `${pathPrefix}/dice-roller-dnd`,
      `${pathPrefix}/weapon-creator`,
    ]);
    expect(links.map((link) => link.querySelector('img')?.getAttribute('src'))).toEqual([
      '/showcase/frost-ranger-ice.webp',
      '/coat-assets/showcase/azure-wings.webp',
      '/images/dice-cases/greatsword.webp',
      '/weapon-creator/cases/01-warden-greatblade.png',
    ]);
    for (const link of links) {
      expect(link.textContent).toBe('');
      expect(link.getAttribute('aria-labelledby')).toBeTruthy();
      expect(within(link).getByRole('img').getAttribute('alt')).toBeTruthy();
    }
    const cards = within(section).getAllByRole('listitem');
    expect(cards).toHaveLength(4);
    for (const card of cards) {
      expect(within(card).getByRole('heading', { level: 3 }).textContent).toBeTruthy();
      expect(card.querySelector('p')?.textContent).toBeTruthy();
    }
    expect(within(section).queryByRole('button')).toBeNull();
    expect(within(section).getByText(
      testCase.locale === 'zh'
        ? '选好职业后，制作角色 Token、设计纹章和武器，再为下一场游戏准备好骰子。'
        : 'Bring your character to the table with a token, a coat of arms, dice, and a custom weapon.',
    )).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Start building your adventure', level: 2 })).toBeNull();
    expect(screen.queryByRole('heading', { name: '开启你的下一次冒险', level: 2 })).toBeNull();
  });

  it.each(localeCases)('renders the selected tools for a non-featured $locale article', (testCase) => {
    const slug = 'dnd-halfling';
    const recommendation = getBlogToolRecommendations(testCase.locale, slug);
    const toolItems = getToolDirectoryItems(testCase.locale);
    render(<BlogDetailPageView locale={testCase.locale} slug={slug} />);

    const heading = testCase.locale === 'zh' ? '你可能会用到的工具' : 'Tools you might find useful';
    const section = screen.getByRole('region', { name: heading });
    const imageLinks = within(within(section).getByRole('list')).getAllByRole('link');
    const expectedTools = recommendation.toolIds.map((toolId) => {
      const tool = toolItems.find((toolItem) => toolItem.id === toolId);

      if (!tool) {
        throw new Error(`No tool directory item exists for toolId=${JSON.stringify(toolId)}.`);
      }

      return tool;
    });

    expect(imageLinks.map((link) => link.getAttribute('href'))).toEqual(expectedTools.map((tool) => tool.href));
    expect(within(section).getAllByRole('listitem')).toHaveLength(4);
    for (const [index, card] of within(section).getAllByRole('listitem').entries()) {
      expect(within(card).getByRole('heading', { level: 3 }).textContent).toBe(expectedTools[index]?.name);
      expect(card.querySelector('p')?.textContent).toBe(expectedTools[index]?.description);
    }
  });

  it.each(['en', 'zh'] as const)('uses a localized real screenshot for text-preview tools in $locale', (locale) => {
    const toolItems = getToolDirectoryItems(locale);
    const textTools = ['language-generator', 'population-generator'] as const;

    for (const toolId of textTools) {
      const matchingPost = getBlogPosts(locale).find((post) =>
        getBlogToolRecommendations(locale, post.slug).toolIds.includes(toolId),
      );

      if (!matchingPost) {
        throw new Error(`No published ${locale} blog post recommends toolId=${JSON.stringify(toolId)}.`);
      }

      const { unmount } = render(<BlogDetailPageView locale={locale} slug={matchingPost.slug} />);
      const heading = locale === 'zh' ? '你可能会用到的工具' : 'Tools you might find useful';
      const section = screen.getByRole('region', { name: heading });
      const tool = toolItems.find((toolItem) => toolItem.id === toolId);

      if (!tool) {
        throw new Error(`No tool directory item exists for toolId=${JSON.stringify(toolId)}.`);
      }

      const toolCard = within(section).getAllByRole('listitem').find((card) =>
        within(card).getByRole('heading', { level: 3 }).textContent === tool.name,
      );

      if (!toolCard) {
        throw new Error(`Tool card was not rendered for toolId=${JSON.stringify(toolId)}.`);
      }

      const image = within(toolCard).getByRole('img');
      expect(image.getAttribute('src')).toBe(`/blog/tool-previews/${toolId}-${locale}.png`);
      if (toolId === 'language-generator') {
        expect(image.getAttribute('alt')).toBe(
          locale === 'zh'
            ? '奇幻语言生成器案例截图，展示英文原句与虚构语言拼写结果'
            : 'Fantasy language generator example showing an English source phrase and fictional spelling',
        );
      } else {
        expect(image.getAttribute('alt')).toBeTruthy();
      }
      unmount();
    }
  });
});

describe('BlogDetailPageView editorial metadata', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(editorialMetadataCases)(
    'renders localized publisher and author bylines with date semantics for $locale $slug',
    (testCase) => {
      const { container } = render(<BlogDetailPageView locale={testCase.locale} slug={testCase.slug} />);

      const publisherBylineLink = screen.getByRole('link', { name: testCase.byline });
      expect(publisherBylineLink.getAttribute('href')).toBe(testCase.aboutHref);
      const authorByline = screen.getByText(testCase.authorByline);
      expect(authorByline.closest('a')).toBeNull();

      const renderedTimes = Array.from(container.querySelectorAll('time'));
      expect(renderedTimes.map((timeElement) => timeElement.getAttribute('datetime'))).toEqual(
        testCase.expectedDateTimes,
      );
      expect(renderedTimes.at(-1)?.parentElement?.textContent).toContain(testCase.updatedLabel);

      if (testCase.expectedDateTimes.length === 2) {
        expect(renderedTimes[0]?.parentElement?.textContent).toContain(testCase.publishedLabel);
      } else {
        expect(renderedTimes[0]?.parentElement?.textContent).not.toContain(testCase.publishedLabel);
      }
    },
  );
});

describe('BlogDetailPageView cover delivery', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(localeCases)('uses a responsive static WebP cover for $locale', (testCase) => {
    const { container } = render(<BlogDetailPageView locale={testCase.locale} slug="dnd-meaning" />);
    const cover = container.querySelector<HTMLImageElement>(
      'img[srcset*="dnd-meaning-guide"]',
    );

    if (!cover) {
      throw new Error(`Expected a cover image for locale=${testCase.locale}.`);
    }

    expect(cover.getAttribute('src')).toBe('/blog/covers/responsive/en/dnd-meaning-guide-1280w.webp');
    expect(cover.getAttribute('srcset')).toContain(
      '/blog/covers/responsive/en/dnd-meaning-guide-1920w.webp 1920w',
    );
    expect(cover.getAttribute('srcset')).toContain('/blog/covers/en/dnd-meaning-guide.webp 2770w');
    expect(cover.getAttribute('src')).not.toContain('/_next/image');
    expect(cover.getAttribute('sizes')).toBe('(min-width: 1024px) 50vw, 100vw');
    expect(cover.getAttribute('loading')).toBe('eager');
    expect(cover.getAttribute('width')).toBe('2770');
    expect(cover.getAttribute('height')).toBe('1504');

    const preloadLink = document.head.querySelector<HTMLLinkElement>('link[rel="preload"][as="image"]');
    expect(preloadLink?.getAttribute('imagesrcset')).toBe(cover.getAttribute('srcset'));
    expect(preloadLink?.getAttribute('imagesizes')).toBe(cover.getAttribute('sizes'));
  });
});
