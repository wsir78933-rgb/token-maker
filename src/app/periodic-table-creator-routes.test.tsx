// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import EnglishPeriodicTableCreatorPage, {
  metadata as englishMetadata,
} from './(en)/periodic-table-creator/page';
import ChinesePeriodicTableCreatorPage, {
  metadata as chineseMetadata,
} from './(zh)/zh/periodic-table-creator/page';
import { getPeriodicTableCopy } from '@/lib/periodic-table-creator/copy';
import { getPeriodicTablePageContentCopy } from '@/lib/periodic-table-creator/page-content-copy';
import { getPeriodicTableCaseStudiesCopy } from '@/lib/periodic-table-creator/case-studies-copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';

const localizedPeriodicTableRoutes = [
  {
    locale: 'en' as const,
    PageComponent: EnglishPeriodicTableCreatorPage,
    metadata: englishMetadata,
    path: '/periodic-table-creator',
    openGraphLocale: 'en_US',
  },
  {
    locale: 'zh' as const,
    PageComponent: ChinesePeriodicTableCreatorPage,
    metadata: chineseMetadata,
    path: '/zh/periodic-table-creator',
    openGraphLocale: 'zh_CN',
  },
];

const originalScrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');

function requirePeriodicTableContentSection(headingId: string, locale: 'en' | 'zh'): HTMLElement {
  const heading = document.getElementById(headingId);
  if (!(heading instanceof HTMLElement)) {
    throw new Error(
      `Periodic table content heading ${JSON.stringify(headingId)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  const section = heading.closest('section');
  if (!(section instanceof HTMLElement)) {
    throw new Error(
      `Periodic table content section for heading ${JSON.stringify(headingId)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return section;
}

function requirePeriodicTableFaqAnswer(
  faqSection: HTMLElement,
  questionButton: HTMLElement,
  locale: 'en' | 'zh',
): HTMLElement {
  const answerId = questionButton.getAttribute('aria-controls');
  if (answerId === null || answerId.trim() === '') {
    throw new Error(
      `Periodic table FAQ question ${JSON.stringify(questionButton.textContent)} has no aria-controls for locale ${JSON.stringify(locale)}.`,
    );
  }

  const answer = document.getElementById(answerId);
  if (!(answer instanceof HTMLElement) || !faqSection.contains(answer)) {
    throw new Error(
      `Periodic table FAQ answer ${JSON.stringify(answerId)} is missing from its section for locale ${JSON.stringify(locale)}.`,
    );
  }

  return answer;
}

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((media: string) => ({
      matches: media === '(prefers-reduced-motion: reduce)',
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalScrollIntoViewDescriptor === undefined) {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  } else {
    Object.defineProperty(Element.prototype, 'scrollIntoView', originalScrollIntoViewDescriptor);
  }
});

describe('periodic table creator routes', () => {
  it.each(localizedPeriodicTableRoutes)('exports localized metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getPeriodicTableCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/periodic-table-creator',
        'en-US': '/periodic-table-creator',
        'zh-CN': '/zh/periodic-table-creator',
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

  it.each(localizedPeriodicTableRoutes)('renders the $locale page in shared site chrome', ({
    PageComponent,
    locale,
  }) => {
    const copy = getPeriodicTableCopy(locale);
    const pageContentCopy = getPeriodicTablePageContentCopy(locale);
    render(<PageComponent />);

    const pageHeading = screen.getByRole('heading', { level: 1, name: copy.title });
    const heroSection = pageHeading.closest('section');
    if (!(heroSection instanceof HTMLElement)) {
      throw new Error(`Periodic table hero section is missing for locale ${JSON.stringify(locale)}.`);
    }
    const workspace = document.getElementById('periodic-table-creator-workspace');
    if (!(workspace instanceof HTMLElement)) {
      throw new Error(`Periodic table workspace is missing for locale ${JSON.stringify(locale)}.`);
    }

    expect(heroSection.contains(pageHeading)).toBe(true);
    expect(screen.getByText(copy.description)).toBeTruthy();
    const heroActionButton = within(heroSection).getByRole('button', { name: copy.heroAction });
    const scrollIntoViewSpy = vi.spyOn(Element.prototype, 'scrollIntoView');
    fireEvent.click(heroActionButton);
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
    expect(document.querySelector('.site-topbar')).toBeTruthy();
    expect(document.querySelector('main.site-shell > div > footer')).toBeTruthy();

    const whatIsSection = requirePeriodicTableContentSection(
      'periodic-table-creator-what-is-heading',
      locale,
    );
    const featuresSection = requirePeriodicTableContentSection(
      'periodic-table-creator-feature-grid-heading',
      locale,
    );
    const casesSection = requirePeriodicTableContentSection(
      'periodic-table-creator-case-studies-title',
      locale,
    );
    const comparisonSection = requirePeriodicTableContentSection(
      'periodic-table-creator-comparison-title',
      locale,
    );
    const howItWorksSection = requirePeriodicTableContentSection(
      'periodic-table-creator-how-it-works-heading',
      locale,
    );
    const callToActionSection = document.getElementById('periodic-table-creator-call-to-action');
    if (!(callToActionSection instanceof HTMLElement)) {
      throw new Error(`Periodic table call-to-action section is missing for locale ${JSON.stringify(locale)}.`);
    }
    const faqHeading = screen.getByRole('heading', { level: 2, name: pageContentCopy.faq.title });
    const faqSection = faqHeading.closest('section');
    if (!(faqSection instanceof HTMLElement)) {
      throw new Error(`Periodic table FAQ section is missing for locale ${JSON.stringify(locale)}.`);
    }

    const contentSections = [
      whatIsSection,
      casesSection,
      featuresSection,
      howItWorksSection,
      comparisonSection,
      callToActionSection,
      faqSection,
    ];
    expect(workspace.compareDocumentPosition(whatIsSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    for (const [sectionIndex, section] of contentSections.entries()) {
      const nextSection = contentSections[sectionIndex + 1];
      if (nextSection === undefined) continue;
      expect(section.compareDocumentPosition(nextSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }

    expect(within(whatIsSection).getByText(pageContentCopy.whatIs.description)).toBeTruthy();
    const caseStudiesCopy = getPeriodicTableCaseStudiesCopy(locale);
    expect(within(casesSection).getByRole('heading', { level: 2, name: caseStudiesCopy.title })).toBeTruthy();
    expect(casesSection.querySelectorAll('[data-periodic-table-case-group]')).toHaveLength(3);
    expect(caseStudiesCopy.groups.map((group) => group.examples.length)).toEqual([4, 5, 3]);
    expect(pageContentCopy.features.items).toHaveLength(6);
    expect(featuresSection.querySelectorAll('article')).toHaveLength(6);
    for (const feature of pageContentCopy.features.items) {
      expect(within(featuresSection).getByRole('heading', { level: 3, name: feature.title })).toBeTruthy();
    }

    expect(pageContentCopy.howItWorks.steps).toHaveLength(3);
    expect(howItWorksSection.querySelectorAll('ol > li')).toHaveLength(3);
    for (const step of pageContentCopy.howItWorks.steps) {
      expect(within(howItWorksSection).getByRole('heading', { level: 3, name: step.title })).toBeTruthy();
    }

    expect(pageContentCopy.comparison.rows).toHaveLength(5);
    expect(comparisonSection.querySelectorAll('tbody tr')).toHaveLength(5);
    for (const row of pageContentCopy.comparison.rows) {
      expect(within(comparisonSection).getByRole('rowheader', { name: row.dimension })).toBeTruthy();
    }

    const callToActionLink = within(callToActionSection).getByRole('button', {
      name: pageContentCopy.cta.action,
    });
    expect(callToActionLink.getAttribute('href')).toBe('#periodic-table-creator-workspace');

    expect(pageContentCopy.faq.items).toHaveLength(8);
    const faqButtons = within(faqSection).getAllByRole('button');
    expect(faqButtons).toHaveLength(8);
    expect(faqButtons.map((button) => button.textContent?.trim())).toEqual(
      pageContentCopy.faq.items.map((item) => item.question),
    );

    const faqAnswers = faqButtons.map((faqButton) => {
      const answer = requirePeriodicTableFaqAnswer(faqSection, faqButton, locale);
      expect(faqButton.getAttribute('id')).not.toBeNull();
      expect(answer.getAttribute('aria-labelledby')).toBe(faqButton.getAttribute('id'));
      expect(answer.getAttribute('role')).toBe('region');
      expect(faqButton.getAttribute('aria-expanded')).toBe('false');
      expect(answer.hidden).toBe(true);
      return answer;
    });

    const firstFaqButton = faqButtons[0];
    const secondFaqButton = faqButtons[1];
    const firstFaqAnswer = faqAnswers[0];
    const secondFaqAnswer = faqAnswers[1];
    if (!firstFaqButton || !secondFaqButton || !firstFaqAnswer || !secondFaqAnswer) {
      throw new Error(`Periodic table FAQ interaction fixtures are missing for locale ${JSON.stringify(locale)}.`);
    }

    fireEvent.click(firstFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('true');
    expect(firstFaqAnswer.hidden).toBe(false);
    expect(secondFaqButton.getAttribute('aria-expanded')).toBe('false');
    expect(secondFaqAnswer.hidden).toBe(true);

    fireEvent.click(secondFaqButton);
    expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');
    expect(firstFaqAnswer.hidden).toBe(true);
    expect(secondFaqButton.getAttribute('aria-expanded')).toBe('true');
    expect(secondFaqAnswer.hidden).toBe(false);

    fireEvent.click(secondFaqButton);
    expect(secondFaqButton.getAttribute('aria-expanded')).toBe('false');
    expect(secondFaqAnswer.hidden).toBe(true);
  });
});
