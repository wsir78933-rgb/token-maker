// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BlogDetailPageView } from './BlogDetailPageView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const localeCases = [
  {
    locale: 'en' as const,
    actionCardLabel: 'What to do next',
    bottomCtaHeading: 'Start building your adventure',
    relatedHeading: 'Related articles',
    coatMakerLabel: 'Coat of Arms Maker',
    diceLabel: 'Dice Roller',
    expectedHref: '/coat-of-arms-maker',
    expectedDiceHref: '/dice-roller-dnd',
  },
  {
    locale: 'zh' as const,
    actionCardLabel: '现在可以做什么',
    bottomCtaHeading: '开启你的下一次冒险',
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

describe('BlogDetailPageView CTA links', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(localeCases)('renders localized coat-maker links in both $locale CTA areas', (testCase) => {
    render(<BlogDetailPageView locale={testCase.locale} slug="dnd-meaning" />);

    const actionCard = screen.getByText(testCase.actionCardLabel).closest('aside');
    const bottomCta = screen
      .getByRole('heading', { name: testCase.bottomCtaHeading, level: 2 })
      .closest('section');

    if (!actionCard || !bottomCta) {
      throw new Error(`Expected CTA regions for locale ${testCase.locale}.`);
    }

    const actionCardCoatMakerLink = within(actionCard).getByRole('link', {
      name: testCase.coatMakerLabel,
    });
    const bottomCtaCoatMakerLink = within(bottomCta).getByRole('link', {
      name: testCase.coatMakerLabel,
    });
    const actionCardDiceLink = within(actionCard).getByRole('link', { name: testCase.diceLabel });
    const bottomCtaDiceLink = within(bottomCta).getByRole('link', { name: testCase.diceLabel });

    expect(actionCardCoatMakerLink.getAttribute('href')).toBe(testCase.expectedHref);
    expect(bottomCtaCoatMakerLink.getAttribute('href')).toBe(testCase.expectedHref);
    expect(actionCardDiceLink.getAttribute('href')).toBe(testCase.expectedDiceHref);
    expect(bottomCtaDiceLink.getAttribute('href')).toBe(testCase.expectedDiceHref);
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
