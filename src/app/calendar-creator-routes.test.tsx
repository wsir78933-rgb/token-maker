// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import EnglishCalendarCreatorPage, {
  metadata as englishMetadata,
} from './(en)/calendar-creator/page';
import ChineseCalendarCreatorPage, {
  metadata as chineseMetadata,
} from './(zh)/zh/calendar-creator/page';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { getCalendarCreatorHeroCopy } from '@/lib/calendar-creator/hero-copy';
import { getCalendarCreatorPageCopy } from '@/lib/calendar-creator/page-copy';
import { getCalendarCreatorShowcaseCopy } from '@/lib/calendar-creator/showcase-copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';

vi.mock('@/components/calendar-creator/CalendarCreatorWorkbench', () => ({
  CalendarCreatorWorkbench: ({ locale }: { locale: 'en' | 'zh' }) => (
    <section data-testid="calendar-creator-workbench">{locale} workbench</section>
  ),
}));

const localizedCalendarCreatorRoutes = [
  {
    locale: 'en' as const,
    PageComponent: EnglishCalendarCreatorPage,
    metadata: englishMetadata,
    path: '/calendar-creator',
    switchedPath: '/zh/calendar-creator',
    openGraphLocale: 'en_US',
    navigationMenuLabel: 'Free tools',
    switchLabel: '中文',
  },
  {
    locale: 'zh' as const,
    PageComponent: ChineseCalendarCreatorPage,
    metadata: chineseMetadata,
    path: '/zh/calendar-creator',
    switchedPath: '/calendar-creator',
    openGraphLocale: 'zh_CN',
    navigationMenuLabel: '免费工具',
    switchLabel: 'English',
  },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('calendar creator localized routes', () => {
  it.each(localizedCalendarCreatorRoutes)('exports localized metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getCalendarCreatorCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(
      `${getSiteUrl()}/`,
    );
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/calendar-creator',
        'en-US': '/calendar-creator',
        'zh-CN': '/zh/calendar-creator',
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

  it.each(localizedCalendarCreatorRoutes)('renders the $locale page inside shared site chrome', ({
    PageComponent,
    locale,
    navigationMenuLabel,
    path,
    switchedPath,
    switchLabel,
  }) => {
    const copy = getCalendarCreatorCopy(locale);
    const heroCopy = getCalendarCreatorHeroCopy(locale);
    const pageCopy = getCalendarCreatorPageCopy(locale);
    const showcaseCopy = getCalendarCreatorShowcaseCopy(locale);
    const { container } = render(<PageComponent />);
    const pageHeading = screen.getByRole('heading', { level: 1 });
    const pageDescription = screen.getByText(heroCopy.description);
    const workspace = screen.getByTestId('calendar-creator-workspace');
    const workbench = screen.getByTestId('calendar-creator-workbench');
    const topbar = container.querySelector('.site-topbar');
    const footer = container.querySelector('main.site-shell > div > footer');
    const faqSection = document.getElementById('calendar-creator-faq');
    const contentSectionIds = [
      'calendar-creator-what-is',
      'calendar-creator-showcase',
      'calendar-creator-features',
      'calendar-creator-comparison',
      'calendar-creator-how-it-works',
      'calendar-creator-cta',
      'calendar-creator-faq',
    ];
    const contentSections = contentSectionIds.map((sectionId) => document.getElementById(sectionId));

    if (
      !(topbar instanceof HTMLElement) ||
      !(footer instanceof HTMLElement) ||
      !(faqSection instanceof HTMLElement) ||
      contentSections.some((section) => !(section instanceof HTMLElement))
    ) {
      throw new Error(`Missing calendar creator site chrome for locale ${JSON.stringify(locale)}.`);
    }

    expect(pageHeading.textContent?.replace(/\s+/g, ' ').trim()).toBe(heroCopy.heading);
    expect(pageHeading.closest('[data-calendar-screen-only]')).not.toBeNull();
    expect(topbar.compareDocumentPosition(pageHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.compareDocumentPosition(workspace) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(workspace.contains(workbench)).toBe(true);
    expect(pageDescription).toBeTruthy();
    expect(screen.getByRole('link', { name: copy.create }).getAttribute('href')).toBe(
      `#${workspace.id}`,
    );
    expect(contentSections.map((section) => section?.id)).toEqual(contentSectionIds);
    expect(contentSections.every((section) => section?.hasAttribute('data-calendar-screen-only'))).toBe(true);
    for (const [sectionIndex, section] of contentSections.entries()) {
      if (sectionIndex === contentSections.length - 1) continue;

      const nextSection = contentSections[sectionIndex + 1];
      if (!(section instanceof HTMLElement)) {
        throw new Error(`Missing calendar content section at index ${sectionIndex} for locale ${JSON.stringify(locale)}.`);
      }
      if (!(nextSection instanceof HTMLElement)) {
        throw new Error(
          `Missing calendar content section at index ${sectionIndex + 1} for locale ${JSON.stringify(locale)}.`,
        );
      }

      expect(section.compareDocumentPosition(nextSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(document.getElementById('calendar-creator-help')).toBeNull();
    expect(container.querySelector('a[href="https://rollforfantasy.com/tools/timeline-creator.php"]')).toBeNull();
    const showcaseSection = document.getElementById('calendar-creator-showcase');
    if (!(showcaseSection instanceof HTMLElement)) {
      throw new Error(`Missing calendar creator showcase for locale ${JSON.stringify(locale)}.`);
    }

    expect(within(showcaseSection).getByRole('heading', { level: 2, name: showcaseCopy.title })).toBeTruthy();
    const showcaseGroups = Array.from(
      showcaseSection.querySelectorAll<HTMLElement>('[data-calendar-showcase-group]'),
    );
    expect(showcaseGroups).toHaveLength(showcaseCopy.groups.length);
    const renderedShowcaseSources = showcaseGroups.flatMap((showcaseGroup) => (
      Array.from(showcaseGroup.querySelectorAll('img')).map((imageElement) => {
        const source = imageElement.getAttribute('src');
        if (source === null) {
          throw new Error(`Calendar creator showcase image is missing src for locale ${JSON.stringify(locale)}.`);
        }

        return decodeURIComponent(source);
      })
    ));
    const expectedShowcaseSources = showcaseCopy.groups.flatMap((showcaseGroup) => (
      showcaseGroup.examples.map((showcaseExample) => showcaseExample.src)
    ));
    expect(renderedShowcaseSources).toHaveLength(expectedShowcaseSources.length);
    for (const expectedSource of expectedShowcaseSources) {
      expect(renderedShowcaseSources.some((renderedSource) => renderedSource.includes(expectedSource))).toBe(true);
    }

    for (const [groupIndex, showcaseGroupCopy] of showcaseCopy.groups.entries()) {
      const showcaseGroup = showcaseGroups[groupIndex];
      if (!(showcaseGroup instanceof HTMLElement)) {
        throw new Error(`Missing calendar creator showcase group ${groupIndex} for locale ${JSON.stringify(locale)}.`);
      }

      expect(showcaseGroup.dataset.calendarShowcaseGroup).toBe(showcaseGroupCopy.id);
      expect(showcaseGroup.dataset.imagePosition).toBe(showcaseGroupCopy.imagePosition);
      const carousel = within(showcaseGroup).getByRole('region', {
        name: `${showcaseCopy.title}: ${showcaseGroupCopy.title}`,
      });
      expect(carousel.querySelectorAll('[data-index]')).toHaveLength(showcaseGroupCopy.examples.length);
      expect(
        within(carousel).getByRole('button', {
          name: `${showcaseCopy.previousLabel}: ${showcaseGroupCopy.title}`,
        }),
      ).toBeTruthy();
      expect(
        within(carousel).getByRole('button', {
          name: `${showcaseCopy.nextLabel}: ${showcaseGroupCopy.title}`,
        }),
      ).toBeTruthy();
    }

    const featuresSection = document.getElementById('calendar-creator-features');
    const howItWorksSection = document.getElementById('calendar-creator-how-it-works');
    if (!(featuresSection instanceof HTMLElement) || !(howItWorksSection instanceof HTMLElement)) {
      throw new Error(`Missing calendar creator feature or workflow section for locale ${JSON.stringify(locale)}.`);
    }

    expect(within(featuresSection).getByRole('heading', { level: 2, name: pageCopy.features.title })).toBeTruthy();
    expect(within(featuresSection).getByText(pageCopy.features.description)).toBeTruthy();
    const featureCards = within(featuresSection).getAllByRole('article');
    expect(featureCards).toHaveLength(pageCopy.features.items.length);
    for (const feature of pageCopy.features.items) {
      const featureHeading = within(featuresSection).getByRole('heading', { level: 3, name: feature.title });
      const featureCard = featureHeading.closest('article');
      if (!(featureCard instanceof HTMLElement)) {
        throw new Error(`Missing feature card for ${JSON.stringify(feature.title)} in ${JSON.stringify(locale)}.`);
      }

      expect(within(featureCard).getByText(feature.description)).toBeTruthy();
    }

    expect(within(howItWorksSection).getByRole('heading', { level: 2, name: pageCopy.howItWorks.title })).toBeTruthy();
    const stepList = within(howItWorksSection).getByRole('list');
    const stepItems = within(stepList).getAllByRole('listitem');
    expect(stepItems).toHaveLength(pageCopy.howItWorks.steps.length);
    for (const [stepIndex, step] of pageCopy.howItWorks.steps.entries()) {
      const stepItem = stepItems[stepIndex];
      if (!(stepItem instanceof HTMLElement)) {
        throw new Error(`Missing workflow step ${stepIndex} for locale ${JSON.stringify(locale)}.`);
      }

      expect(within(stepItem).getByRole('heading', { level: 3, name: step.title })).toBeTruthy();
      expect(within(stepItem).getByText(step.description)).toBeTruthy();
    }

    const faqHeading = within(faqSection).getByRole('heading', { level: 2, name: pageCopy.faq.title });
    const faqButtons = within(faqSection).getAllByRole('button');
    expect(faqButtons).toHaveLength(pageCopy.faq.items.length);
    expect(faqButtons.map((button) => button.textContent?.trim())).toEqual(
      pageCopy.faq.items.map((item) => item.question),
    );
    expect(faqSection.getAttribute('aria-labelledby')).toBe(faqHeading.id);

    const faqAnswers = faqButtons.map((button, faqIndex) => {
      const answerId = button.getAttribute('aria-controls');
      if (answerId === null) {
        throw new Error(`FAQ button ${faqIndex} is missing aria-controls for locale ${JSON.stringify(locale)}.`);
      }

      const answer = document.getElementById(answerId);
      if (!(answer instanceof HTMLElement) || !faqSection.contains(answer)) {
        throw new Error(`Missing FAQ answer ${JSON.stringify(answerId)} for locale ${JSON.stringify(locale)}.`);
      }

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(answer.getAttribute('role')).toBe('region');
      expect(answer.getAttribute('aria-labelledby')).toBe(button.id);
      expect(answer.hidden).toBe(true);
      expect(answer.textContent?.trim()).toBe(pageCopy.faq.items[faqIndex]?.answer);
      return answer;
    });

    fireEvent.click(faqButtons[0]);
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('true');
    expect(faqAnswers[0].hidden).toBe(false);

    fireEvent.click(faqButtons[1]);
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('false');
    expect(faqAnswers[0].hidden).toBe(true);
    expect(faqButtons[1].getAttribute('aria-expanded')).toBe('true');
    expect(faqAnswers[1].hidden).toBe(false);

    fireEvent.click(faqButtons[1]);
    expect(faqButtons[1].getAttribute('aria-expanded')).toBe('false');
    expect(faqAnswers[1].hidden).toBe(true);

    const ctaSection = document.getElementById('calendar-creator-cta');
    if (!(ctaSection instanceof HTMLElement)) {
      throw new Error(`Missing CTA section for locale ${JSON.stringify(locale)}.`);
    }

    expect(within(ctaSection).getByRole('link', { name: pageCopy.cta.buttonLabel }).getAttribute('href')).toBe(
      '#calendar-creator-workspace',
    );

    const freeToolsLink = within(topbar).getByRole('link', { name: navigationMenuLabel });
    expect(freeToolsLink.getAttribute('href')).toBe(locale === 'zh' ? '/zh' : '/');
    const freeToolsMenu = within(topbar).getByRole('menu', { name: navigationMenuLabel });
    expect(
      within(freeToolsMenu).getByRole('menuitem', { name: copy.navigationTitle }).getAttribute('href'),
    ).toBe(path);

    const localeSwitch = within(topbar).getByRole('link', { name: switchLabel });
    expect(localeSwitch.getAttribute('href')).toBe(switchedPath);

    const structuredDataScript = document.getElementById(`calendar-creator-${locale}-jsonld`);
    if (!(structuredDataScript instanceof HTMLScriptElement)) {
      throw new Error(`Missing calendar creator structured data for locale ${JSON.stringify(locale)}.`);
    }

    const structuredData = JSON.parse(structuredDataScript.textContent ?? '{}') as {
      '@graph'?: Array<Record<string, unknown>>;
    };
    expect(structuredData['@graph']?.map((entry) => entry['@type'])).toEqual([
      'WebApplication',
      'FAQPage',
    ]);

    const webApplicationEntry = structuredData['@graph']?.find((entry) => entry['@type'] === 'WebApplication');
    const faqPageEntry = structuredData['@graph']?.find((entry) => entry['@type'] === 'FAQPage');
    expect(webApplicationEntry).toMatchObject({
      name: copy.title,
      description: copy.pageDescription,
    });
    expect(faqPageEntry?.mainEntity).toEqual(
      pageCopy.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    );
  });

  it.each(localizedCalendarCreatorRoutes)('server-renders the $locale page', ({ PageComponent, locale }) => {
    const markup = renderToStaticMarkup(<PageComponent />);

    const copy = getCalendarCreatorCopy(locale);
    const heroCopy = getCalendarCreatorHeroCopy(locale);
    const emphasisStart = heroCopy.heading.indexOf(heroCopy.emphasis);

    if (emphasisStart < 0) {
      throw new Error(
        `Calendar creator hero heading for locale ${JSON.stringify(locale)} is missing emphasis ${JSON.stringify(heroCopy.emphasis)}. Received ${JSON.stringify(heroCopy.heading)}.`,
      );
    }

    expect(markup).toContain(heroCopy.heading.slice(0, emphasisStart));
    expect(markup).toContain(heroCopy.emphasis);
    expect(markup).toContain(heroCopy.heading.slice(emphasisStart + heroCopy.emphasis.length));
    expect(markup).toContain(heroCopy.description);
    expect(markup).toContain(copy.title);
    expect(markup).toContain(copy.pageDescription);
    expect(markup).toContain('calendar-creator-workspace');
    expect(markup).toContain(`calendar-creator-${locale}-jsonld`);
  });
});
