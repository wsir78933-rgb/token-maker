// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';

vi.mock('@/components/notice-board-creator/NoticeBoardCreatorWorkbench', () => ({
  NoticeBoardCreatorWorkbench: ({ locale }: { locale: SiteLocale }) => (
    <div role="region" aria-label={`Notice board editor ${locale}`} />
  ),
}));

import EnglishNoticeBoardCreatorPage, {
  metadata as englishMetadata,
} from '@/app/(en)/notice-board-creator/page';
import ChineseNoticeBoardCreatorPage, {
  metadata as chineseMetadata,
} from '@/app/(zh)/zh/notice-board-creator/page';
import { NoticeBoardCreatorPageView } from '@/components/notice-board-creator/NoticeBoardCreatorPageView';
import { NOTICE_BOARD_CREATOR_EDITOR_ID } from '@/lib/notice-board-creator/constants';
import { getNoticeBoardCreatorCaseStudiesCopy } from '@/lib/notice-board-creator/case-studies';
import { getNoticeBoardCreatorLandingCopy } from '@/lib/notice-board-creator/landing-copy';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getSiteUrl } from '@/lib/site-content';

afterEach(() => {
  cleanup();
});

const localizedRoutes = [
  {
    locale: 'en' as const,
    Page: EnglishNoticeBoardCreatorPage,
    metadata: englishMetadata,
    path: '/notice-board-creator',
    switchedPath: '/zh/notice-board-creator',
    openGraphLocale: 'en_US',
  },
  {
    locale: 'zh' as const,
    Page: ChineseNoticeBoardCreatorPage,
    metadata: chineseMetadata,
    path: '/zh/notice-board-creator',
    switchedPath: '/notice-board-creator',
    openGraphLocale: 'zh_CN',
  },
];

describe('notice board creator routes', () => {
  it.each(localizedRoutes)('publishes canonical, language, and social metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getNoticeBoardCreatorLandingCopy(locale);
    const metadataBase = metadata.metadataBase;
    const normalizedMetadataBase = typeof metadataBase === 'string' ? metadataBase : metadataBase?.href;

    expect(normalizedMetadataBase).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/notice-board-creator',
        'en-US': '/notice-board-creator',
        'zh-CN': '/zh/notice-board-creator',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
      url: path,
      type: 'website',
      locale: openGraphLocale,
      images: [
        {
          url: getSeoImageUrl(locale, 'home'),
          width: 1200,
          height: 630,
          alt: copy.pageTitle,
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: copy.pageTitle,
      description: copy.pageDescription,
      images: [getSeoImageUrl(locale, 'home')],
    });
  });

  it('exports one shared page view for both supported locales', () => {
    expect(NoticeBoardCreatorPageView).toBeTypeOf('function');
  });

  it.each(localizedRoutes)('keeps the requested page sections in order for $locale', ({ locale, Page }) => {
    const copy = getNoticeBoardCreatorLandingCopy(locale);
    const caseStudiesCopy = getNoticeBoardCreatorCaseStudiesCopy(locale);
    const { container } = render(<Page />);
    const heroHeading = screen.getByRole('heading', { level: 1 });
    const heroSection = heroHeading.closest('section');
    const editor = document.getElementById(NOTICE_BOARD_CREATOR_EDITOR_ID);
    const whatIsSection = document.getElementById('notice-board-creator-what-is');
    const caseStudiesSection = document.getElementById('notice-board-creator-case-studies');
    const featureSection = document.getElementById('notice-board-creator-features');
    const howToUseSection = document.getElementById('notice-board-creator-how-to-use');
    const comparisonSection = document.getElementById('notice-board-creator-comparison');
    const callToActionSection = document.getElementById('notice-board-creator-call-to-action');
    const faqSection = document.getElementById('notice-board-creator-faq');
    const footer = container.querySelector('footer');

    if (
      !(heroSection instanceof HTMLElement) ||
      !(editor instanceof HTMLElement) ||
      !(whatIsSection instanceof HTMLElement) ||
      !(caseStudiesSection instanceof HTMLElement) ||
      !(featureSection instanceof HTMLElement) ||
      !(howToUseSection instanceof HTMLElement) ||
      !(comparisonSection instanceof HTMLElement) ||
      !(callToActionSection instanceof HTMLElement) ||
      !(faqSection instanceof HTMLElement) ||
      !(footer instanceof HTMLElement)
    ) {
      throw new Error(`Missing notice board creator page section for locale ${JSON.stringify(locale)}.`);
    }

    const orderedSections = [
      heroSection,
      editor,
      whatIsSection,
      caseStudiesSection,
      featureSection,
      howToUseSection,
      comparisonSection,
      callToActionSection,
      faqSection,
    ];
    for (const [sectionIndex, section] of orderedSections.entries()) {
      const nextSection = orderedSections[sectionIndex + 1];
      if (nextSection === undefined) continue;
      expect(section.compareDocumentPosition(nextSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(faqSection.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(whatIsSection).getByRole('heading', { level: 2, name: copy.whatIsTitle })).toBeTruthy();
    expect(within(caseStudiesSection).getByRole('heading', { level: 2, name: caseStudiesCopy.title })).toBeTruthy();
    const removedCaseSourceSentence =
      locale === 'en'
        ? 'Case images created with RollForFantasy (English originals)'
        : '案例图片由 RollForFantasy 制作（英文原图）';
    expect(caseStudiesSection.textContent).not.toContain(removedCaseSourceSentence);
    expect(caseStudiesSection.querySelectorAll('[data-circular-testimonials="true"]')).toHaveLength(3);
    expect(within(featureSection).getByRole('heading', { level: 2, name: copy.featuresTitle })).toBeTruthy();
    expect(within(featureSection).getAllByRole('article')).toHaveLength(6);
    expect(within(howToUseSection).getAllByRole('listitem')).toHaveLength(3);
    const comparisonRegion = within(comparisonSection).getByRole('region', {
      name: copy.comparisonTableLabel,
    });
    expect(comparisonRegion.getAttribute('tabindex')).toBe('0');

    const comparisonHeaders = within(comparisonSection).getAllByRole('columnheader');
    expect(comparisonHeaders.map((header) => header.textContent?.trim())).toEqual([
      copy.comparisonDimensionHeading,
      copy.noticeBoardCreatorHeading,
      'RollForFantasy',
      'Help Wanted!',
    ]);
    expect(copy.comparisonRows).toHaveLength(4);
    const comparisonRows = within(comparisonSection).getAllByRole('row');
    expect(comparisonRows).toHaveLength(5);
    for (const [rowIndex, comparisonBodyRow] of comparisonRows.slice(1).entries()) {
      const rowCopy = copy.comparisonRows[rowIndex];
      if (rowCopy === undefined) {
        throw new Error(`Missing comparison copy row ${rowIndex} for locale ${JSON.stringify(locale)}.`);
      }

      expect(rowCopy.noticeBoardCreator.status).toBe('supported');
      const renderedCells = within(comparisonBodyRow).getAllByRole('cell');
      expect(renderedCells).toHaveLength(3);
      const creatorCell = renderedCells[0];
      if (creatorCell === undefined) {
        throw new Error(`Missing creator comparison cell in row ${rowIndex} for locale ${JSON.stringify(locale)}.`);
      }

      expect(creatorCell.className).toContain('bg-[var(--site-accent-bg)]');
      expect(creatorCell.className).toContain('border-x');
      expect(creatorCell.className).toContain('border-[var(--site-border-soft)]');
      for (const competitorCell of renderedCells.slice(1)) {
        expect(competitorCell.className).not.toContain('bg-[var(--site-accent-bg)]');
      }

      const expectedCellCopies = [rowCopy.noticeBoardCreator, rowCopy.rollForFantasy, rowCopy.helpWanted];

      for (const [cellIndex, expectedCellCopy] of expectedCellCopies.entries()) {
        const renderedCell = renderedCells[cellIndex];
        if (renderedCell === undefined) {
          throw new Error(`Missing comparison cell ${cellIndex} in row ${rowIndex} for locale ${JSON.stringify(locale)}.`);
        }

        expect(renderedCell.getAttribute('data-comparison-status')).toBe(expectedCellCopy.status);
        if (expectedCellCopy.status === 'limited') {
          expect(renderedCell.querySelector('svg')).toBeNull();
          expect(renderedCell.textContent?.trim()).toBe(expectedCellCopy.label);
          continue;
        }

        expect(renderedCell.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
        expect(renderedCell.querySelector('.sr-only')?.textContent).toBe(expectedCellCopy.label);
      }
    }

    const callToActionLink = within(callToActionSection).getByRole('link', {
      name: copy.callToActionLabel,
    });
    expect(callToActionLink.getAttribute('href')).toBe(`#${NOTICE_BOARD_CREATOR_EDITOR_ID}`);
  });

  it.each(localizedRoutes)('exposes an accessible, working FAQ for $locale', ({ locale, Page }) => {
    const copy = getNoticeBoardCreatorLandingCopy(locale);
    render(<Page />);
    const faqSection = document.getElementById('notice-board-creator-faq');

    if (!(faqSection instanceof HTMLElement)) {
      throw new Error(`Missing notice board creator FAQ for locale ${JSON.stringify(locale)}.`);
    }

    const faqTitle = within(faqSection).getByRole('heading', { level: 2, name: copy.faqTitle });
    const faqButtons = within(faqSection).getAllByRole('button');
    expect(faqSection.getAttribute('aria-labelledby')).toBe(faqTitle.id);
    expect(faqButtons.map((button) => button.textContent?.trim())).toEqual(
      copy.faqItems.map((item) => item.question),
    );

    for (const [itemIndex, faqButton] of faqButtons.entries()) {
      const answerId = faqButton.getAttribute('aria-controls');
      if (answerId === null) {
        throw new Error(`FAQ button ${itemIndex} has no answer target for locale ${JSON.stringify(locale)}.`);
      }

      const answer = document.getElementById(answerId);
      if (!(answer instanceof HTMLElement) || !faqSection.contains(answer)) {
        throw new Error(`FAQ answer ${JSON.stringify(answerId)} is missing for locale ${JSON.stringify(locale)}.`);
      }

      expect(faqButton.getAttribute('aria-expanded')).toBe('false');
      expect(answer.getAttribute('aria-labelledby')).toBe(faqButton.id);
      expect(answer.hidden).toBe(true);
      expect(answer.textContent).toContain(copy.faqItems[itemIndex]?.answer ?? '');
    }

    const firstFaqButton = faqButtons[0];
    if (firstFaqButton === undefined) {
      throw new Error(`FAQ has no questions for locale ${JSON.stringify(locale)}.`);
    }
    const firstAnswerId = firstFaqButton.getAttribute('aria-controls');
    if (firstAnswerId === null) {
      throw new Error(`First FAQ button has no answer target for locale ${JSON.stringify(locale)}.`);
    }
    const firstAnswer = document.getElementById(firstAnswerId);
    if (!(firstAnswer instanceof HTMLElement)) {
      throw new Error(`First FAQ answer ${JSON.stringify(firstAnswerId)} is missing.`);
    }

    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('true');
    expect(firstAnswer.hidden).toBe(false);
    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');
    expect(firstAnswer.hidden).toBe(true);
  });
});
