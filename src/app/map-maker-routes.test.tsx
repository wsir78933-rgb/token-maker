// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import EnglishMapMakerPage, { metadata as englishMetadata } from './(en)/map-maker/page';
import ChineseMapMakerPage, { metadata as chineseMetadata } from './(zh)/zh/map-maker/page';
import { getMapMakerCopy } from '@/lib/map-maker/copy';
import { getMapMakerPageCopy } from '@/lib/map-maker/page-copy';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';
import type { MapMakerShowcaseCopy } from '@/lib/map-maker/showcase-copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';

vi.mock('@/components/map-maker/MapMakerWorkbench', () => ({
  MapMakerWorkbench: ({ copy }: { copy: MapMakerWorkspaceCopy }) => (
    <section data-testid="map-maker-workbench">{copy.title}</section>
  ),
}));

vi.mock('@/components/map-maker/MapMakerShowcase', () => ({
  MapMakerShowcase: ({ copy }: { copy: MapMakerShowcaseCopy }) => (
    <section aria-labelledby="map-maker-showcase-title" data-testid="map-maker-showcase">
      <h2 id="map-maker-showcase-title">{copy.title}</h2>
    </section>
  ),
}));

const localizedMapMakerRoutes = [
  {
    locale: 'en' as const,
    PageComponent: EnglishMapMakerPage,
    metadata: englishMetadata,
    path: '/map-maker',
    switchedPath: '/zh/map-maker',
    openGraphLocale: 'en_US',
    navigationMenuLabel: 'Free tools',
    switchLabel: '中文',
  },
  {
    locale: 'zh' as const,
    PageComponent: ChineseMapMakerPage,
    metadata: chineseMetadata,
    path: '/zh/map-maker',
    switchedPath: '/map-maker',
    openGraphLocale: 'zh_CN',
    navigationMenuLabel: '免费工具',
    switchLabel: 'English',
  },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function requireMapMakerSectionHeading(
  pageContent: HTMLElement,
  sectionTestId: string,
  expectedTitle: string,
): HTMLElement {
  const section = within(pageContent).getByTestId(sectionTestId);
  const heading = within(section).getByRole('heading', { level: 2 });
  if (
    section.tagName !== 'SECTION' ||
    heading.textContent !== expectedTitle ||
    section.getAttribute('aria-labelledby') !== heading.id
  ) {
    throw new Error(
      `Map maker section ${JSON.stringify(sectionTestId)} must be a labelled section. Received tag=${JSON.stringify(section.tagName)}, title=${JSON.stringify(heading.textContent)}, expected=${JSON.stringify(expectedTitle)}, aria-labelledby=${JSON.stringify(section.getAttribute('aria-labelledby'))}, headingId=${JSON.stringify(heading.id)}.`,
    );
  }
  return heading;
}

function expectMapMakerHeadingsInOrder(headings: readonly HTMLElement[]): void {
  for (let headingIndex = 0; headingIndex < headings.length - 1; headingIndex += 1) {
    const currentHeading = headings[headingIndex];
    const nextHeading = headings[headingIndex + 1];
    if (currentHeading === undefined || nextHeading === undefined) {
      throw new Error(`Map maker content heading is missing at index ${headingIndex}.`);
    }
    expect(currentHeading.compareDocumentPosition(nextHeading) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
  }
}

describe('map maker localized routes', () => {
  it.each(localizedMapMakerRoutes)('exports localized metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getMapMakerCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(
      `${getSiteUrl()}/`,
    );
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/map-maker',
        'en-US': '/map-maker',
        'zh-CN': '/zh/map-maker',
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

  it.each(localizedMapMakerRoutes)('renders the $locale page with shared site chrome and copy', ({
    PageComponent,
    locale,
    navigationMenuLabel,
    path,
    switchedPath,
    switchLabel,
  }) => {
    const copy = getMapMakerCopy(locale);
    const pageCopy = getMapMakerPageCopy(locale);
    render(<PageComponent />);
    const primaryNavigation = screen.getByRole('navigation', {
      name: locale === 'zh' ? '主导航' : 'Primary',
    });
    const footer = screen.getByRole('contentinfo');
    const workspace = screen.getByTestId('map-maker-workspace');
    const firstFaq = pageCopy.faq.items[0];
    expect(footer.tagName).toBe('FOOTER');

    if (firstFaq === undefined) {
      throw new Error(
        `Map maker FAQ fixture is empty for locale ${JSON.stringify(locale)}.`,
      );
    }

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(copy.heading);
    expect(screen.getByText(copy.pageDescription)).toBeTruthy();
    expect(screen.getByRole('link', { name: copy.heroAction }).getAttribute('href')).toBe(
      '#map-maker-workspace',
    );
    expect(workspace.contains(screen.getByTestId('map-maker-workbench'))).toBe(true);
    const pageContent = screen.getByTestId('map-maker-page-content');
    const pageContentSections = Array.from(pageContent.children).filter(
      (child) => child.tagName === 'SECTION',
    );
    expect(pageContentSections).toHaveLength(7);
    const introductionHeading = requireMapMakerSectionHeading(
      pageContent,
      'map-maker-introduction',
      pageCopy.whatIs.title,
    );
    const showcaseHeading = requireMapMakerSectionHeading(
      pageContent,
      'map-maker-showcase',
      pageCopy.showcase.title,
    );
    const featuresHeading = requireMapMakerSectionHeading(
      pageContent,
      'map-maker-features',
      pageCopy.features.title,
    );
    const comparisonHeading = requireMapMakerSectionHeading(
      pageContent,
      'map-maker-comparison',
      pageCopy.comparison.title,
    );
    const howItWorksHeading = requireMapMakerSectionHeading(
      pageContent,
      'map-maker-how-it-works',
      pageCopy.howItWorks.title,
    );
    const callToActionHeading = requireMapMakerSectionHeading(
      pageContent,
      'map-maker-call-to-action',
      pageCopy.callToAction.title,
    );
    const faqHeading = within(pageContent).getByRole('heading', { name: pageCopy.faq.title, level: 2 });
    const faqSection = faqHeading.closest('section');
    if (faqSection === null || faqSection.getAttribute('aria-labelledby') !== faqHeading.id) {
      throw new Error(`Map maker FAQ section is missing its labelled heading for locale ${JSON.stringify(locale)}.`);
    }
    const faqQuestionButtons = within(faqSection).getAllByRole('button');
    expect(faqQuestionButtons).toHaveLength(5);
    pageCopy.faq.items.forEach((item, itemIndex) => {
      const renderedQuestion = faqQuestionButtons[itemIndex]?.textContent ?? '';
      expect(renderedQuestion).toContain(item.question);
    });
    const contentHeadings = [
      introductionHeading,
      showcaseHeading,
      featuresHeading,
      comparisonHeading,
      howItWorksHeading,
      callToActionHeading,
      faqHeading,
    ];
    expect(contentHeadings.every((heading) => heading.id.length > 0)).toBe(true);
    expect(new Set(contentHeadings.map((heading) => heading.id)).size).toBe(contentHeadings.length);
    expectMapMakerHeadingsInOrder(contentHeadings);

    const comparisonSection = screen.getByTestId('map-maker-comparison');
    const comparisonRegion = within(comparisonSection).getByRole('region', {
      name: pageCopy.comparison.tableLabel,
    });
    expect(comparisonRegion.tabIndex).toBe(0);
    comparisonRegion.focus();
    expect(document.activeElement).toBe(comparisonRegion);
    const comparisonTable = within(comparisonRegion).getByRole('table', {
      name: pageCopy.comparison.tableLabel,
    });
    expect(within(comparisonTable).getByText(pageCopy.comparison.tableLabel).tagName).toBe('CAPTION');
    expect(within(comparisonTable).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(comparisonTable).getAllByRole('row')).toHaveLength(6);
    const comparisonColumnHeaders = within(comparisonTable).getAllByRole('columnheader');
    const comparisonRowHeaders = within(comparisonTable).getAllByRole('rowheader');
    expect(comparisonColumnHeaders.every((header) => header.getAttribute('scope') === 'col')).toBe(true);
    expect(comparisonRowHeaders).toHaveLength(5);
    expect(comparisonRowHeaders.every((header) => header.getAttribute('scope') === 'row')).toBe(true);

    const callToActionSection = screen.getByTestId('map-maker-call-to-action');
    const callToActionLink = within(callToActionSection).getByRole('link', {
      name: pageCopy.callToAction.label,
    });
    if (!(callToActionLink instanceof HTMLAnchorElement)) {
      throw new Error(`Map maker CTA must expose a native link. Received ${String(callToActionLink)}.`);
    }
    expect(callToActionLink.getAttribute('href')).toBe('#map-maker-workspace');

    const firstFaqButton = within(faqSection).getByRole('button', { name: firstFaq.question });
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');
    const answerId = firstFaqButton.getAttribute('aria-controls');
    if (answerId === null) {
      throw new Error(`Map maker FAQ question ${JSON.stringify(firstFaq.question)} has no controlled answer id.`);
    }
    const firstFaqAnswer = document.getElementById(answerId);
    if (!(firstFaqAnswer instanceof HTMLElement)) {
      throw new Error(`Map maker FAQ answer ${JSON.stringify(answerId)} is missing from the document.`);
    }
    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('true');
    expect(firstFaqAnswer.hidden).toBe(false);
    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');
    expect(firstFaqAnswer.hidden).toBe(true);

    const freeToolsNavigation = within(primaryNavigation).getByRole('link', { name: navigationMenuLabel });
    expect(freeToolsNavigation.getAttribute('href')).toBe(locale === 'zh' ? '/zh' : '/');
    const freeToolsMenu = within(primaryNavigation).getByRole('menu', { name: navigationMenuLabel });
    expect(within(freeToolsMenu).getByRole('menuitem', { name: copy.navigationTitle }).getAttribute('href')).toBe(
      path,
    );
    expect(within(primaryNavigation).getByRole('link', { name: switchLabel }).getAttribute('href')).toBe(
      switchedPath,
    );

    const applicationScript = document.getElementById(`map-maker-${locale}-jsonld`);
    const breadcrumbScript = document.getElementById(`map-maker-${locale}-breadcrumb-jsonld`);
    if (!(applicationScript instanceof HTMLScriptElement) || !(breadcrumbScript instanceof HTMLScriptElement)) {
      throw new Error(`Map maker structured data is missing for locale ${JSON.stringify(locale)}.`);
    }

    const applicationData = JSON.parse(applicationScript.textContent ?? '{}') as {
      '@graph'?: Array<Record<string, unknown>>;
    };
    expect(applicationData['@graph']?.map((entry) => entry['@type'])).toEqual([
      'WebApplication',
      'FAQPage',
    ]);
    const faqSchema = applicationData['@graph']?.find((entry) => entry['@type'] === 'FAQPage');
    if (faqSchema === undefined) {
      throw new Error(`Map maker FAQ structured data is missing for locale ${JSON.stringify(locale)}.`);
    }
    expect(faqSchema.mainEntity).toEqual(
      pageCopy.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    );
    const breadcrumbData = JSON.parse(breadcrumbScript.textContent ?? '{}') as Record<string, unknown>;
    expect(breadcrumbData['@type']).toBe('BreadcrumbList');
  });
});
