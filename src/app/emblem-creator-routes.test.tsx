// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { EMBLEM_CREATOR_EDITOR_ID } from '@/components/emblem-creator/EmblemCreatorPageHeading';
import EnglishEmblemCreatorPage, { metadata as englishMetadata } from './(en)/emblem-creator/page';
import ChineseEmblemCreatorPage, { metadata as chineseMetadata } from './(zh)/zh/emblem-creator/page';

const localizedRoutes = [
  {
    locale: 'en' as const,
    Page: EnglishEmblemCreatorPage,
    metadata: englishMetadata,
    path: '/emblem-creator',
    switchedPath: '/zh/emblem-creator',
    heading: 'Free Online Emblem Maker for D&D and RPG Fantasy Worlds',
    navigationHeading: 'Emblem Creator',
    menuLabel: 'Free tools',
    switchLabel: '中文',
    openGraphLocale: 'en_US',
  },
  {
    locale: 'zh' as const,
    Page: ChineseEmblemCreatorPage,
    metadata: chineseMetadata,
    path: '/zh/emblem-creator',
    switchedPath: '/emblem-creator',
    heading: '免费在线奇幻世界徽章制作器 D&D 与 RPG 徽记',
    navigationHeading: '徽标制作工具',
    menuLabel: '免费工具',
    switchLabel: 'English',
    openGraphLocale: 'zh_CN',
  },
];

describe('emblem creator routes', () => {
  afterEach(cleanup);

  it.each(localizedRoutes)('provides canonical, hreflang and social metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getEmblemCreatorCopy(locale);
    const metadataBase = metadata.metadataBase;
    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/emblem-creator',
        'en-US': '/emblem-creator',
        'zh-CN': '/zh/emblem-creator',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
      url: path,
      type: 'website',
      locale: openGraphLocale,
      images: [{ url: getSeoImageUrl(locale, 'home'), width: 1200, height: 630, alt: copy.pageTitle }],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: copy.pageTitle,
      description: copy.pageDescription,
      images: [getSeoImageUrl(locale, 'home')],
    });
  });

  it.each(localizedRoutes)('keeps site chrome and the $locale H1 outside the real workbench', ({
    locale,
    Page,
    heading,
    navigationHeading,
    path,
    switchedPath,
    menuLabel,
    switchLabel,
  }) => {
    const copy = getEmblemCreatorCopy(locale);
    const { container } = render(<Page />);
    const pageHeading = screen.getByRole('heading', { level: 1, name: heading });
    const editor = screen.getByRole('region', { name: copy.editorTitle });
    const topbar = container.querySelector('.site-topbar');
    const footer = container.querySelector('footer');
    if (!(topbar instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
      throw new Error(`Missing emblem site chrome for locale ${JSON.stringify(locale)}.`);
    }

    for (const outsideElement of [topbar, pageHeading, footer]) {
      expect(editor.contains(outsideElement)).toBe(false);
    }
    expect(topbar.compareDocumentPosition(editor) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.compareDocumentPosition(editor) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(editor.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.parentElement?.children).toHaveLength(3);
    expect(screen.queryByText(copy.description)).toBeNull();
    expect(screen.getByText(copy.pageDescription)).toBeTruthy();
    expect(within(editor).queryByRole('heading', { level: 1 })).toBeNull();

    const freeToolsLink = within(topbar).getByRole('link', { name: menuLabel });
    expect(freeToolsLink.closest('[data-active]')?.getAttribute('data-active')).toBe('true');
    const menuItem = freeToolsLink.closest('.site-nav-item');
    if (!(menuItem instanceof HTMLElement)) {
      throw new Error(`Missing FreeTools menu for locale ${JSON.stringify(locale)}.`);
    }
    fireEvent.mouseEnter(menuItem);
    const menu = within(menuItem).getByRole('menu', { name: menuLabel });
    expect(within(menu).getByRole('menuitem', { name: navigationHeading }).getAttribute('href')).toBe(path);
    expect(within(topbar).getByRole('link', { name: switchLabel }).getAttribute('href')).toBe(switchedPath);
  });

  it.each(localizedRoutes)('renders the localized What Is section after the editor for $locale', ({
    locale,
    Page,
  }) => {
    const copy = getEmblemCreatorCopy(locale);
    const { container } = render(<Page />);
    const editor = screen.getByRole('region', { name: copy.editorTitle });
    const whatIsHeading = screen.getByRole('heading', { level: 2, name: copy.whatIs.title });
    const whatIsSection = whatIsHeading.closest('section');
    const footer = container.querySelector('footer');

    if (!(whatIsSection instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
      throw new Error(`Missing What Is section or footer for locale ${JSON.stringify(locale)}.`);
    }

    for (const paragraph of copy.whatIs.paragraphs) {
      expect(within(whatIsSection).getByText(paragraph)).toBeTruthy();
    }
    expect(editor.compareDocumentPosition(whatIsSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(whatIsSection.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each(localizedRoutes)('renders and controls the localized FAQ for $locale', ({
    locale,
    Page,
  }) => {
    const copy = getEmblemCreatorCopy(locale);
    const { container } = render(<Page />);
    const faqHeading = screen.getByRole('heading', { level: 2, name: copy.faq.title });
    const faqSection = faqHeading.closest('section');

    if (!(faqSection instanceof HTMLElement)) {
      throw new Error(`Missing FAQ section for locale ${JSON.stringify(locale)}.`);
    }

    const faqButtons = within(faqSection).getAllByRole('button');
    const whatIsHeading = screen.getByRole('heading', { level: 2, name: copy.whatIs.title });
    const whatIsSection = whatIsHeading.closest('section');
    const footer = container.querySelector('footer');
    if (!(whatIsSection instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
      throw new Error(`Missing What Is section or footer for locale ${JSON.stringify(locale)}.`);
    }

    expect(whatIsSection.compareDocumentPosition(faqSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(faqSection.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(copy.faq.items).toHaveLength(5);
    expect(faqButtons).toHaveLength(copy.faq.items.length);
    expect(faqButtons.map((button) => button.textContent?.trim())).toEqual(
      copy.faq.items.map((item) => item.question),
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(faqSection.getAttribute('aria-labelledby')).toBe(faqHeading.id);

    const faqDescription = within(faqSection).getByText(copy.faq.description);
    expect(faqSection.getAttribute('aria-describedby')).toBe(faqDescription.id);

    const faqAnswers = faqButtons.map((button, itemIndex) => {
      const answerId = button.getAttribute('aria-controls');
      if (answerId === null) {
        throw new Error(`FAQ button is missing aria-controls for locale ${JSON.stringify(locale)}.`);
      }

      const answer = document.getElementById(answerId);
      if (!(answer instanceof HTMLElement) || !faqSection.contains(answer)) {
        throw new Error(`FAQ answer ${JSON.stringify(answerId)} is missing for locale ${JSON.stringify(locale)}.`);
      }

      expect(answer.getAttribute('role')).toBe('region');
      expect(answer.getAttribute('aria-labelledby')).toBe(button.id);
      expect(answer.textContent).toContain(copy.faq.items[itemIndex]?.answer ?? '');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(answer.getAttribute('aria-hidden')).toBe('true');
      return answer;
    });

    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('true');
    expect(faqAnswers[0].getAttribute('aria-hidden')).toBe('false');
    expect(faqAnswers[0].textContent).toContain(copy.faq.items[0].answer);

    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('false');
    expect(faqAnswers[0].getAttribute('aria-hidden')).toBe('true');

    fireEvent.click(faqButtons[0]);
    fireEvent.click(faqButtons[1]);
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('false');
    expect(faqAnswers[0].getAttribute('aria-hidden')).toBe('true');
    expect(faqButtons[1].getAttribute('aria-expanded')).toBe('true');
    expect(faqAnswers[1].getAttribute('aria-hidden')).toBe('false');
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });

  it.each(localizedRoutes)('renders localized feature, process, and CTA sections for $locale', ({
    locale,
    Page,
  }) => {
    const copy = getEmblemCreatorCopy(locale);
    const { container } = render(<Page />);
    const whatIsSection = screen.getByRole('heading', { level: 2, name: copy.whatIs.title }).closest('section');
    const featuresSection = screen.getByRole('heading', { level: 2, name: copy.features.title }).closest('section');
    const howItWorksSection = screen
      .getByRole('heading', { level: 2, name: copy.howItWorks.title })
      .closest('section');
    const toolComparisonSection = screen
      .getByRole('heading', { level: 2, name: copy.toolComparison.title })
      .closest('section');
    const callToActionSection = screen
      .getByRole('heading', { level: 2, name: copy.callToAction.title })
      .closest('section');
    const faqSection = screen.getByRole('heading', { level: 2, name: copy.faq.title }).closest('section');
    const footer = container.querySelector('footer');

    if (
      !(whatIsSection instanceof HTMLElement) ||
      !(featuresSection instanceof HTMLElement) ||
      !(howItWorksSection instanceof HTMLElement) ||
      !(toolComparisonSection instanceof HTMLElement) ||
      !(callToActionSection instanceof HTMLElement) ||
      !(faqSection instanceof HTMLElement) ||
      !(footer instanceof HTMLElement)
    ) {
      throw new Error(`Missing emblem content section for locale ${JSON.stringify(locale)}.`);
    }

    const orderedSections = [
      whatIsSection,
      featuresSection,
      howItWorksSection,
      toolComparisonSection,
      callToActionSection,
      faqSection,
    ];
    for (const [sectionIndex, section] of orderedSections.entries()) {
      const nextSection = orderedSections[sectionIndex + 1];
      if (nextSection === undefined) continue;
      expect(section.compareDocumentPosition(nextSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(faqSection.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(copy.features.items).toHaveLength(6);
    expect(within(featuresSection).getByText(copy.features.description)).toBeTruthy();
    expect(within(featuresSection).getAllByRole('article')).toHaveLength(copy.features.items.length);
    for (const feature of copy.features.items) {
      expect(within(featuresSection).getByRole('heading', { level: 3, name: feature.title })).toBeTruthy();
      expect(within(featuresSection).getByText(feature.description)).toBeTruthy();
    }

    expect(copy.howItWorks.steps).toHaveLength(4);
    expect(within(howItWorksSection).getByText(copy.howItWorks.eyebrow)).toBeTruthy();
    const steps = within(howItWorksSection).getByRole('list', { name: copy.howItWorks.label });
    expect(within(steps).getAllByRole('listitem')).toHaveLength(copy.howItWorks.steps.length);
    for (const step of copy.howItWorks.steps) {
      expect(within(steps).getByRole('heading', { level: 3, name: step.title })).toBeTruthy();
      expect(within(steps).getByText(step.description)).toBeTruthy();
    }

    expect(copy.toolComparison.rows).toHaveLength(5);
    expect(within(toolComparisonSection).getByText(copy.toolComparison.description)).toBeTruthy();
    const comparisonRegion = within(toolComparisonSection).getByRole('region', {
      name: copy.toolComparison.tableLabel,
    });
    expect(comparisonRegion.getAttribute('tabindex')).toBe('0');
    const comparisonTable = within(comparisonRegion).getByRole('table');
    expect(comparisonRegion.contains(comparisonTable)).toBe(true);
    const comparisonCaption = within(comparisonTable).getByText(copy.toolComparison.title);
    expect(comparisonCaption.tagName).toBe('CAPTION');

    const comparisonColumnHeaders = within(comparisonTable).getAllByRole('columnheader');
    expect(comparisonColumnHeaders).toHaveLength(4);
    expect(comparisonColumnHeaders.map((header) => header.getAttribute('scope'))).toEqual([
      'col',
      'col',
      'col',
      'col',
    ]);
    expect(comparisonColumnHeaders.map((header) => header.textContent?.trim())).toEqual([
      copy.toolComparison.dimensionHeading,
      copy.toolComparison.emblemCreatorHeading,
      copy.toolComparison.photoshopHeading,
      copy.toolComparison.illustratorHeading,
    ]);

    const comparisonRowHeaders = within(comparisonTable).getAllByRole('rowheader');
    expect(comparisonRowHeaders).toHaveLength(copy.toolComparison.rows.length);
    expect(comparisonRowHeaders.every((header) => header.getAttribute('scope') === 'row')).toBe(true);
    for (const [rowIndex, comparisonRowCopy] of copy.toolComparison.rows.entries()) {
      const comparisonRowHeader = comparisonRowHeaders[rowIndex];
      if (!(comparisonRowHeader instanceof HTMLElement)) {
        throw new Error(
          `Missing comparison row header for locale ${JSON.stringify(locale)}, rowIndex=${rowIndex}.`,
        );
      }

      const comparisonDomRow = comparisonRowHeader.closest('tr');
      if (!(comparisonDomRow instanceof HTMLTableRowElement)) {
        throw new Error(
          `Missing comparison table row for locale ${JSON.stringify(locale)}, rowIndex=${rowIndex}.`,
        );
      }

      expect(comparisonRowHeader.textContent?.trim()).toBe(comparisonRowCopy.dimension);
      const comparisonCells = within(comparisonDomRow).getAllByRole('cell');
      if (comparisonCells.length !== 3) {
        throw new Error(
          `Expected 3 comparison cells for locale ${JSON.stringify(locale)}, rowIndex=${rowIndex}; received ${comparisonCells.length}.`,
        );
      }
      expect(comparisonCells.map((cell) => cell.textContent?.trim())).toEqual([
        comparisonRowCopy.emblemCreator,
        comparisonRowCopy.photoshop,
        comparisonRowCopy.illustrator,
      ]);
    }

    expect(within(callToActionSection).getByText(copy.callToAction.description)).toBeTruthy();
    const callToActionLink = within(callToActionSection).getByRole('link', {
      name: copy.callToAction.label,
    });
    expect(callToActionLink.getAttribute('href')).toBe(`#${EMBLEM_CREATOR_EDITOR_ID}`);
    expect(container.querySelector(`#${EMBLEM_CREATOR_EDITOR_ID}`)).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
