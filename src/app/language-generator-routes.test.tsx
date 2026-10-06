// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import EnglishLanguageGeneratorPage, {
  metadata as englishMetadata,
} from './(en)/language-generator/page';
import ChineseLanguageGeneratorPage, {
  metadata as chineseMetadata,
} from './(zh)/zh/language-generator/page';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { getLanguageGeneratorPageCopy } from '@/lib/language-generator/page-copy';
import { generatePreset } from '@/lib/language-generator/presets';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import type { VocabularyItem } from '@/lib/language-generator/types';

const localizedLanguageGeneratorRoutes = [
  {
    locale: 'en' as const,
    PageComponent: EnglishLanguageGeneratorPage,
    metadata: englishMetadata,
    path: '/language-generator',
    switchedPath: '/zh/language-generator',
    openGraphLocale: 'en_US',
    navigationMenuLabel: 'Free tools',
    navigationTitle: 'Language Generator',
    switchLabel: '中文',
  },
  {
    locale: 'zh' as const,
    PageComponent: ChineseLanguageGeneratorPage,
    metadata: chineseMetadata,
    path: '/zh/language-generator',
    switchedPath: '/language-generator',
    openGraphLocale: 'zh_CN',
    navigationMenuLabel: '免费工具',
    navigationTitle: '语言生成器',
    switchLabel: 'English',
  },
];

const originalScrollIntoView = Element.prototype.scrollIntoView;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: originalScrollIntoView,
  });
});

describe('language generator routes', () => {
  it.each(localizedLanguageGeneratorRoutes)('exports localized metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getLanguageGeneratorCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/language-generator',
        'en-US': '/language-generator',
        'zh-CN': '/zh/language-generator',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
      url: path,
      type: 'website',
      locale: openGraphLocale,
      images: [{
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: copy.pageTitle,
      }],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: copy.pageTitle,
      description: copy.pageDescription,
      images: [getSeoImageUrl(locale, 'home')],
    });
  });

  it.each(localizedLanguageGeneratorRoutes)('renders the $locale page inside shared site chrome', ({
    PageComponent,
    locale,
    navigationMenuLabel,
    navigationTitle,
    path,
    switchedPath,
    switchLabel,
  }) => {
    const copy = getLanguageGeneratorCopy(locale);
    const pageCopy = getLanguageGeneratorPageCopy(locale);
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: () => undefined,
    });
    const scrollIntoViewSpy = vi.spyOn(Element.prototype, 'scrollIntoView');
    const { container } = render(<PageComponent />);
    const pageHeading = screen.getByRole('heading', { level: 1, name: copy.title });
    const pageDescription = screen.getByText(copy.description);
    const workspace = screen.getByTestId('language-generator-workspace');
    const topbar = container.querySelector('.site-topbar');
    const footer = container.querySelector('main.site-shell > div > footer');
    const whatIsSection = document.getElementById('language-generator-what-is');
    const whatIsHeading = document.getElementById('language-generator-what-is-heading');
    const caseStudiesSection = document.getElementById('language-generator-case-studies');
    const caseStudiesHeading = document.getElementById('language-generator-case-studies-heading');
    const featureGridHeading = document.getElementById('language-generator-feature-grid-heading');
    const howItWorksHeading = document.getElementById('language-generator-how-it-works-heading');
    const toolComparisonSection = document.getElementById('language-generator-tool-comparison');
    const toolComparisonHeading = document.getElementById('language-generator-tool-comparison-title');
    const callToActionSection = document.getElementById('language-generator-call-to-action');
    const callToActionHeading = document.getElementById('language-generator-call-to-action-title');
    const faqSection = document.getElementById('language-generator-faq');

    if (
      !(topbar instanceof HTMLElement) ||
      !(footer instanceof HTMLElement) ||
      !(whatIsSection instanceof HTMLElement) ||
      !(whatIsHeading instanceof HTMLElement) ||
      !(caseStudiesSection instanceof HTMLElement) ||
      !(caseStudiesHeading instanceof HTMLElement) ||
      !(featureGridHeading instanceof HTMLElement) ||
      !(howItWorksHeading instanceof HTMLElement) ||
      !(toolComparisonSection instanceof HTMLElement) ||
      !(toolComparisonHeading instanceof HTMLElement) ||
      !(callToActionSection instanceof HTMLElement) ||
      !(callToActionHeading instanceof HTMLElement) ||
      !(faqSection instanceof HTMLElement)
    ) {
      throw new Error(`Missing language generator site chrome for locale ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByTestId('language-generator-page-heading').contains(pageHeading)).toBe(true);
    expect(topbar.compareDocumentPosition(pageHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.compareDocumentPosition(workspace) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageDescription).toBeTruthy();
    const heroActionButton = screen.getByRole('button', { name: copy.heroAction });
    expect(heroActionButton).toBeTruthy();
    fireEvent.click(heroActionButton);
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(scrollIntoViewSpy.mock.contexts[0]).toBe(workspace);
    expect(whatIsHeading.textContent).toBe(pageCopy.whatIs.title);
    expect(within(whatIsSection).getByText(pageCopy.whatIs.description)).toBeTruthy();
    expect(whatIsSection.querySelector('a')).toBeNull();
    expect(caseStudiesHeading.textContent).toBe(pageCopy.caseStudies.title);
    expect(within(caseStudiesSection).getByText(pageCopy.caseStudies.description)).toBeTruthy();
    expect(within(caseStudiesSection).getByText(pageCopy.caseStudies.notice)).toBeTruthy();
    expect(pageCopy.caseStudies.cases).toHaveLength(3);
    expect(caseStudiesSection.querySelectorAll('article')).toHaveLength(3);
    expect(caseStudiesSection.querySelector('img')).toBeNull();
    expect(caseStudiesSection.querySelector('svg')).toBeNull();
    expect(caseStudiesSection.querySelector('button')).toBeNull();
    expect(caseStudiesSection.querySelector('a')).toBeNull();

    for (const caseStudy of pageCopy.caseStudies.cases) {
      const caseStudyHeading = within(caseStudiesSection).getByRole('heading', {
        level: 3,
        name: caseStudy.title,
      });
      const caseStudyArticle = caseStudyHeading.closest('article');
      if (!(caseStudyArticle instanceof HTMLElement)) {
        throw new Error(`Language generator case study article is missing for id ${JSON.stringify(caseStudy.id)}.`);
      }

      expect(caseStudyArticle.textContent).toContain(String(caseStudy.presetId));
      expect(caseStudyArticle.textContent).toContain(caseStudy.usage);
      for (const example of caseStudy.examples) {
        expect(caseStudyArticle.textContent).toContain(example.source);
        expect(caseStudyArticle.textContent).toContain(example.result);
      }

      const vocabularyItems: VocabularyItem[] = caseStudy.examples.map((example, exampleIndex) => ({
        id: `${caseStudy.id}-${exampleIndex}`,
        category: caseStudy.id,
        source: example.source,
      }));
      const generatedPreset = generatePreset(caseStudy.presetId, vocabularyItems);
      expect(generatedPreset.results).toEqual(caseStudy.examples.map((example) => example.result));
    }

    expect(featureGridHeading.textContent).toBe(pageCopy.featureOverview.title);
    expect(howItWorksHeading.textContent).toBe(pageCopy.howItWorks.title);
    expect(toolComparisonHeading.textContent).toBe(pageCopy.toolComparison.title);
    expect(within(toolComparisonSection).getByText(pageCopy.toolComparison.description)).toBeTruthy();
    expect(callToActionHeading.textContent).toBe(pageCopy.callToAction.title);
    expect(within(callToActionSection).getByText(pageCopy.callToAction.description)).toBeTruthy();
    expect(within(faqSection).getByRole('heading', { level: 2, name: pageCopy.faq.title })).toBeTruthy();
    expect(workspace.compareDocumentPosition(whatIsSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(whatIsSection.compareDocumentPosition(featureGridHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(whatIsSection.compareDocumentPosition(caseStudiesSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(caseStudiesSection.compareDocumentPosition(featureGridHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(workspace.compareDocumentPosition(featureGridHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(featureGridHeading.compareDocumentPosition(howItWorksHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(howItWorksHeading.compareDocumentPosition(toolComparisonSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(toolComparisonSection.compareDocumentPosition(callToActionSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(howItWorksHeading.compareDocumentPosition(callToActionSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(callToActionSection.compareDocumentPosition(faqSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(howItWorksHeading.compareDocumentPosition(faqSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(faqSection.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const callToActionLink = callToActionSection.querySelector('a[href="#language-generator-workspace"]');
    if (!(callToActionLink instanceof HTMLAnchorElement)) {
      throw new Error(`Missing language generator CTA anchor for locale ${JSON.stringify(locale)}.`);
    }

    expect(callToActionLink.textContent).toContain(pageCopy.callToAction.action);
    expect(callToActionLink.getAttribute('href')).toBe('#language-generator-workspace');

    expect(pageCopy.toolComparison.rows).toHaveLength(6);
    const toolComparisonRegion = within(toolComparisonSection).getByRole('region', {
      name: pageCopy.toolComparison.tableLabel,
    });
    expect(toolComparisonRegion.getAttribute('tabindex')).toBe('0');
    const toolComparisonTable = within(toolComparisonRegion).getByRole('table', {
      name: pageCopy.toolComparison.title,
    });
    const toolComparisonCaption = toolComparisonTable.querySelector('caption');
    if (!(toolComparisonCaption instanceof HTMLElement)) {
      throw new Error(`Language generator comparison table caption is missing for locale ${JSON.stringify(locale)}.`);
    }

    expect(toolComparisonCaption.textContent).toBe(pageCopy.toolComparison.title);
    expect(toolComparisonSection.querySelector('a')).toBeNull();

    const toolComparisonHeaders = within(toolComparisonTable).getAllByRole('columnheader');
    expect(toolComparisonHeaders.map((header) => header.textContent)).toEqual([
      pageCopy.toolComparison.dimensionHeading,
      pageCopy.toolComparison.languageGeneratorHeading,
      pageCopy.toolComparison.manualConlangingHeading,
      pageCopy.toolComparison.vulgarlangHeading,
    ]);
    for (const header of toolComparisonHeaders) {
      expect(header.getAttribute('scope')).toBe('col');
    }

    const toolComparisonRows = within(toolComparisonTable).getAllByRole('row').slice(1);
    expect(toolComparisonRows).toHaveLength(6);
    for (const [rowIndex, expectedRow] of pageCopy.toolComparison.rows.entries()) {
      const toolComparisonRow = toolComparisonRows[rowIndex];
      if (!toolComparisonRow) {
        throw new Error(`Language generator comparison row is missing at index ${rowIndex}.`);
      }

      const rowHeader = within(toolComparisonRow).getByRole('rowheader');
      expect(rowHeader.getAttribute('scope')).toBe('row');
      expect(rowHeader.textContent).toBe(expectedRow.dimension);
      expect(toolComparisonRow.textContent).toContain(expectedRow.languageGenerator);
      expect(toolComparisonRow.textContent).toContain(expectedRow.manualConlanging);
      expect(toolComparisonRow.textContent).toContain(expectedRow.vulgarlang);
    }

    if (pageCopy.faq.items.length < 2) {
      throw new Error(`Language generator FAQ needs at least two items, received ${pageCopy.faq.items.length}.`);
    }

    const firstFaqItem = pageCopy.faq.items[0];
    const secondFaqItem = pageCopy.faq.items[1];
    if (!firstFaqItem || !secondFaqItem) {
      throw new Error(`Language generator FAQ items are missing for locale ${JSON.stringify(locale)}.`);
    }

    const firstFaqButton = within(faqSection).getByRole('button', { name: firstFaqItem.question });
    const secondFaqButton = within(faqSection).getByRole('button', { name: secondFaqItem.question });
    const firstAnswerId = firstFaqButton.getAttribute('aria-controls');
    const secondAnswerId = secondFaqButton.getAttribute('aria-controls');

    if (!firstAnswerId || !secondAnswerId) {
      throw new Error(`Language generator FAQ buttons are missing aria-controls for locale ${JSON.stringify(locale)}.`);
    }

    const firstAnswerRegion = document.getElementById(firstAnswerId);
    const secondAnswerRegion = document.getElementById(secondAnswerId);
    if (!(firstAnswerRegion instanceof HTMLElement) || !(secondAnswerRegion instanceof HTMLElement)) {
      throw new Error(`Language generator FAQ regions are missing for locale ${JSON.stringify(locale)}.`);
    }

    expect(firstAnswerRegion.getAttribute('role')).toBe('region');
    expect(firstAnswerRegion.getAttribute('aria-labelledby')).toBe(firstFaqButton.id);
    expect(secondAnswerRegion.getAttribute('role')).toBe('region');
    expect(secondAnswerRegion.getAttribute('aria-labelledby')).toBe(secondFaqButton.id);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('true');
    expect(firstAnswerRegion.hidden).toBe(false);

    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');
    expect(firstAnswerRegion.hidden).toBe(true);

    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('true');
    expect(firstAnswerRegion.hidden).toBe(false);

    fireEvent.click(secondFaqButton);
    expect(secondFaqButton.getAttribute('aria-expanded')).toBe('true');
    expect(secondAnswerRegion.hidden).toBe(false);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');
    expect(firstAnswerRegion.hidden).toBe(true);

    const freeToolsLink = within(topbar).getByRole('link', { name: navigationMenuLabel });
    expect(freeToolsLink.getAttribute('href')).toBe(locale === 'zh' ? '/zh' : '/');
    expect(within(topbar).getByRole('link', { name: switchLabel }).getAttribute('href')).toBe(switchedPath);

    const freeToolsMenuItem = freeToolsLink.closest('.site-nav-item');
    if (!(freeToolsMenuItem instanceof HTMLElement)) {
      throw new Error(`Missing Free tools menu for locale ${JSON.stringify(locale)}.`);
    }

    fireEvent.mouseEnter(freeToolsMenuItem);
    const freeToolsMenu = within(freeToolsMenuItem).getByRole('menu', { name: navigationMenuLabel });
    expect(within(freeToolsMenu).getByRole('menuitem', { name: navigationTitle }).getAttribute('href')).toBe(path);
  });
});
