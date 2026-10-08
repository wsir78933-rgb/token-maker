// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import EnglishConstellationMapCreatorPage, {
  metadata as englishMetadata,
} from './(en)/constellation-map-creator/page';
import ChineseConstellationMapCreatorPage, {
  metadata as chineseMetadata,
} from './(zh)/zh/constellation-map-creator/page';
import { getConstellationMapCopy } from '@/lib/constellation-map-creator/copy';
import { getConstellationShowcaseCopy } from '@/lib/constellation-map-creator/showcase-copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';

vi.mock('@/components/constellation-map-creator/ConstellationMapCreatorWorkbench', () => ({
  ConstellationMapCreatorWorkbench: ({ locale }: { locale: 'en' | 'zh' }) => (
    <div data-testid="mock-constellation-map-workbench" data-locale={locale} />
  ),
}));

const localizedRoutes = [
  {
    locale: 'en' as const,
    PageComponent: EnglishConstellationMapCreatorPage,
    metadata: englishMetadata,
    path: '/constellation-map-creator',
    openGraphLocale: 'en_US',
    switchedPath: '/zh/constellation-map-creator',
  },
  {
    locale: 'zh' as const,
    PageComponent: ChineseConstellationMapCreatorPage,
    metadata: chineseMetadata,
    path: '/zh/constellation-map-creator',
    openGraphLocale: 'zh_CN',
    switchedPath: '/constellation-map-creator',
  },
];

afterEach(() => {
  cleanup();
});

describe('constellation map creator routes', () => {
  it.each(localizedRoutes)('exports localized metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getConstellationMapCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/constellation-map-creator',
        'en-US': '/constellation-map-creator',
        'zh-CN': '/zh/constellation-map-creator',
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

  it.each(localizedRoutes)('renders the $locale page shell and localized workbench contract', ({
    locale,
    PageComponent,
    switchedPath,
  }) => {
    const copy = getConstellationMapCopy(locale);
    const showcaseCopy = getConstellationShowcaseCopy(locale);
    const { container } = render(<PageComponent />);
    const pageHeading = screen.getByRole('heading', { level: 1, name: copy.heading });
    const workspace = screen.getByTestId('constellation-map-creator-workspace');
    const content = container.querySelector('[data-constellation-page-content="true"]');
    const showcase = screen.getByTestId('constellation-map-creator-showcase');
    const topbar = container.querySelector('.site-topbar');
    const footer = container.querySelector('footer');

    if (!(content instanceof HTMLElement) || !(topbar instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
      throw new Error(`Constellation map creator shell is incomplete for locale ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByText(copy.pageDescription)).toBeTruthy();
    expect(workspace.getAttribute('aria-labelledby')).toBe('constellation-map-creator-workspace-title');
    expect(workspace.querySelector('#constellation-map-creator-workspace-title')?.textContent).toBe(
      copy.workspace.workspaceTitle,
    );
    expect(screen.getByTestId('mock-constellation-map-workbench').getAttribute('data-locale')).toBe(locale);
    expect(pageHeading.compareDocumentPosition(workspace) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(workspace.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(topbar).getByRole('menuitem', { name: copy.navigationTitle }).getAttribute('href')).toBe(
      locale === 'en' ? '/constellation-map-creator' : '/zh/constellation-map-creator',
    );
    expect(within(topbar).getByRole('link', { name: locale === 'en' ? '中文' : 'English' }).getAttribute('href')).toBe(
      switchedPath,
    );

    expect(content.querySelector('#constellation-map-creator-what-is-heading')).not.toBeNull();
    expect(content.querySelector('#constellation-map-creator-feature-grid-heading')).not.toBeNull();
    const whatIs = content.querySelector('#constellation-map-creator-what-is-heading');
    const featureGrid = content.querySelector('#constellation-map-creator-feature-grid-heading');
    const featureGridSection = featureGrid?.closest('section');
    if (
      !(whatIs instanceof HTMLElement)
      || !(featureGrid instanceof HTMLElement)
      || !(featureGridSection instanceof HTMLElement)
    ) {
      throw new Error(`Constellation map creator content anchors are missing for locale ${JSON.stringify(locale)}.`);
    }

    expect(showcase.getAttribute('aria-labelledby')).toBe('constellation-map-creator-showcase-title');
    expect(within(showcase).getByRole('heading', { level: 2, name: showcaseCopy.title })).toBeTruthy();
    expect(within(showcase).getByText(showcaseCopy.description)).toBeTruthy();
    expect(whatIs.compareDocumentPosition(showcase) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(showcase.compareDocumentPosition(featureGrid) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const showcaseGroups = Array.from(
      showcase.querySelectorAll<HTMLElement>('[data-constellation-showcase-group]'),
    );
    expect(showcaseGroups).toHaveLength(showcaseCopy.groups.length);
    expect(showcaseGroups.map((group) => group.dataset.imagePosition)).toEqual(['left', 'right', 'left']);
    showcaseCopy.groups.forEach((caseGroup, groupIndex) => {
      const groupElement = showcaseGroups[groupIndex];
      if (!groupElement) {
        throw new Error(`Constellation showcase group ${groupIndex} is missing for locale ${JSON.stringify(locale)}.`);
      }

      expect(groupElement.getAttribute('aria-label')).toBe(caseGroup.title);
      expect(groupElement.querySelectorAll('[data-index]')).toHaveLength(caseGroup.cases.length);
      expect(within(groupElement).getByRole('button', { name: showcaseCopy.previousLabel })).toBeTruthy();
      expect(within(groupElement).getByRole('button', { name: showcaseCopy.nextLabel })).toBeTruthy();
    });
    const howItWorks = content.querySelector('#constellation-map-creator-how-it-works-heading');
    const callToAction = content.querySelector('#constellation-map-creator-call-to-action-title');
    const toolComparison = copy.pageContent.toolComparison;
    const toolComparisonHeading = within(content).getByRole('heading', {
      level: 2,
      name: toolComparison.title,
    });
    const faqHeading = within(content).getByRole('heading', { level: 2, name: copy.pageContent.faq.title });
    const howItWorksSection = howItWorks?.closest('section') ?? null;
    const toolComparisonSection = toolComparisonHeading.closest('section');
    const callToActionSection = callToAction?.closest('section') ?? null;
    const faqSection = faqHeading.closest('section');
    if (
      !(howItWorks instanceof HTMLElement)
      || !(howItWorksSection instanceof HTMLElement)
      || !(toolComparisonSection instanceof HTMLElement)
      || !(callToAction instanceof HTMLElement)
      || !(callToActionSection instanceof HTMLElement)
      || !(faqSection instanceof HTMLElement)
    ) {
      throw new Error(`Constellation map creator section anchors are missing for locale ${JSON.stringify(locale)}.`);
    }

    expect(featureGrid.compareDocumentPosition(howItWorks) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(howItWorksSection.compareDocumentPosition(toolComparisonSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(toolComparisonSection.compareDocumentPosition(callToActionSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(callToActionSection.compareDocumentPosition(faqSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(toolComparison.rows).toHaveLength(2);
    expect(within(toolComparisonSection).getByText(toolComparison.description)).toBeTruthy();
    const comparisonRegion = within(toolComparisonSection).getByRole('region', {
      name: toolComparison.tableLabel,
    });
    expect(comparisonRegion.getAttribute('tabindex')).toBe('0');
    const comparisonTable = within(comparisonRegion).getByRole('table', {
      name: toolComparison.title,
    });
    const comparisonCaption = comparisonTable.querySelector('caption');
    if (!(comparisonCaption instanceof HTMLTableCaptionElement)) {
      throw new Error(`Constellation tool comparison caption is missing for locale ${JSON.stringify(locale)}.`);
    }

    expect(comparisonCaption.textContent).toBe(toolComparison.title);
    const comparisonColumnHeaders = within(comparisonTable).getAllByRole('columnheader');
    expect(comparisonColumnHeaders).toHaveLength(4);
    expect(comparisonColumnHeaders.map((header) => header.getAttribute('scope'))).toEqual([
      'col',
      'col',
      'col',
      'col',
    ]);
    expect(comparisonColumnHeaders.map((header) => header.textContent?.trim())).toEqual([
      toolComparison.dimensionHeading,
      toolComparison.constellationMapCreatorHeading,
      toolComparison.photoshopHeading,
      toolComparison.illustratorHeading,
    ]);
    const comparisonRows = within(comparisonTable).getAllByRole('row').slice(1);
    expect(comparisonRows).toHaveLength(2);
    for (const [rowIndex, comparisonRowCopy] of toolComparison.rows.entries()) {
      const comparisonRow = comparisonRows[rowIndex];
      if (!(comparisonRow instanceof HTMLElement)) {
        throw new Error(
          `Constellation tool comparison row is missing for locale ${JSON.stringify(locale)} at row ${rowIndex}.`,
        );
      }

      const rowHeader = within(comparisonRow).getByRole('rowheader');
      expect(rowHeader.getAttribute('scope')).toBe('row');
      expect(rowHeader.textContent?.trim()).toBe(comparisonRowCopy.dimension);
      const comparisonCells = within(comparisonRow).getAllByRole('cell');
      expect(comparisonCells.map((cell) => cell.textContent?.trim())).toEqual([
        comparisonRowCopy.constellationMapCreator,
        comparisonRowCopy.photoshop,
        comparisonRowCopy.illustrator,
      ]);
    }
    expect(within(faqSection).getByText(copy.pageContent.faq.eyebrow)).toBeTruthy();
    expect(within(faqSection).getByText(copy.pageContent.faq.description)).toBeTruthy();
    expect(faqSection.querySelectorAll('details')).toHaveLength(0);
    expect(within(faqSection).getAllByRole('button')).toHaveLength(copy.pageContent.faq.items.length);
    copy.pageContent.faq.items.forEach((faqItem, faqIndex) => {
      const faqTrigger = within(faqSection).getByRole('button', { name: faqItem.question });
      const answerId = faqTrigger.getAttribute('aria-controls');
      const answerRegion = answerId === null ? null : document.getElementById(answerId);
      if (!(answerRegion instanceof HTMLElement) || !faqSection.contains(answerRegion)) {
        throw new Error(
          `Constellation FAQ answer region is missing for locale ${JSON.stringify(locale)} item ${faqIndex}. Received answer id ${JSON.stringify(answerId)}.`,
        );
      }

      expect(faqTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(answerRegion.hidden).toBe(true);
      expect(answerRegion.getAttribute('role')).toBe('region');
      expect(answerRegion.getAttribute('aria-labelledby')).toBe(faqTrigger.id);
      expect(answerRegion.textContent).toBe(faqItem.answer);
    });
    expect(featureGridSection.querySelectorAll('article')).toHaveLength(copy.pageContent.features.items.length);
    expect(content.querySelectorAll('ol > li')).toHaveLength(copy.pageContent.howItWorks.steps.length);
    expect(content.querySelectorAll('details')).toHaveLength(0);
    expect(within(content).getByRole('link', { name: copy.pageContent.cta.action }).getAttribute('href')).toBe(
      '#constellation-map-creator-workspace',
    );

    const webApplicationScript = document.getElementById(`constellation-map-creator-${locale}-jsonld`);
    const breadcrumbScript = document.getElementById(
      `constellation-map-creator-${locale}-breadcrumb-jsonld`,
    );
    if (!(webApplicationScript instanceof HTMLScriptElement) || !(breadcrumbScript instanceof HTMLScriptElement)) {
      throw new Error(`Constellation map creator structured data is missing for locale ${JSON.stringify(locale)}.`);
    }

    expect(JSON.parse(webApplicationScript.textContent ?? '{}')).toMatchObject({
      '@type': 'WebApplication',
      name: copy.pageTitle,
      url: `${getSiteUrl()}${locale === 'en' ? '/constellation-map-creator' : '/zh/constellation-map-creator'}`,
      description: copy.pageDescription,
    });
    expect(JSON.parse(breadcrumbScript.textContent ?? '{}')).toMatchObject({
      '@type': 'BreadcrumbList',
    });
  });
});
