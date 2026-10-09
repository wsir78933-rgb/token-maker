// @vitest-environment jsdom

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import { CASTLE_CREATOR_EDITOR_ID } from '@/lib/castle-creator/constants';
import { getCastleCreatorExamples } from '@/lib/castle-creator/examples';

import EnglishCastleCreatorPage, {
  metadata as englishCastleCreatorMetadata,
} from './(en)/castle-creator/page';
import ChineseCastleCreatorPage, {
  metadata as chineseCastleCreatorMetadata,
} from './(zh)/zh/castle-creator/page';

function parseServerMarkup(markup: string): Document {
  return new DOMParser().parseFromString(markup, 'text/html');
}

describe('castle creator localized routes', () => {
  it.each([
    {
      locale: 'en' as const,
      PageComponent: EnglishCastleCreatorPage,
      metadata: englishCastleCreatorMetadata,
      canonical: '/castle-creator',
      localizedUrl: 'https://www.tokenmaker.one/castle-creator',
      structuredDataId: 'castle-creator-en-jsonld',
      breadcrumbId: 'castle-creator-en-breadcrumb-jsonld',
    },
    {
      locale: 'zh' as const,
      PageComponent: ChineseCastleCreatorPage,
      metadata: chineseCastleCreatorMetadata,
      canonical: '/zh/castle-creator',
      localizedUrl: 'https://www.tokenmaker.one/zh/castle-creator',
      structuredDataId: 'castle-creator-zh-jsonld',
      breadcrumbId: 'castle-creator-zh-breadcrumb-jsonld',
    },
  ])('renders the $locale castle creator route with localized metadata', ({
    locale,
    PageComponent,
    metadata,
    canonical,
    localizedUrl,
    structuredDataId,
    breadcrumbId,
  }) => {
    const copy = getCastleCreatorCopy(locale);
    const examplesCopy = getCastleCreatorExamples(locale);
    const serverDocument = parseServerMarkup(renderToStaticMarkup(<PageComponent />));
    const pageHeading = serverDocument.querySelector('#castle-creator-heading');
    const workspace = serverDocument.querySelector('[data-testid="castle-creator-workspace"]');
    const heroButton = serverDocument.querySelector('[data-testid="castle-creator-page-heading"] button');
    const whatIs = serverDocument.querySelector('[data-testid="castle-creator-what-is"]');
    const examples = serverDocument.querySelector('[data-testid="castle-creator-examples"]');
    const featureGrid = serverDocument.querySelector('[data-testid="castle-creator-feature-grid"]');
    const howItWorks = serverDocument.querySelector('[data-testid="castle-creator-how-it-works"]');
    const toolComparison = serverDocument.querySelector('[data-testid="castle-creator-tool-comparison"]');
    const faq = serverDocument.querySelector('[data-testid="castle-creator-faq"]');
    const faqHeading = serverDocument.querySelector('#castle-creator-faq-heading');
    const callToAction = serverDocument.querySelector('[data-testid="castle-creator-call-to-action"]');
    const structuredDataScript = serverDocument.getElementById(structuredDataId);
    const breadcrumbScript = serverDocument.getElementById(breadcrumbId);

    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/castle-creator',
      'en-US': '/castle-creator',
      'zh-CN': '/zh/castle-creator',
    });
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.openGraph).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
      url: canonical,
    });
    expect(pageHeading?.tagName).toBe('H1');
    expect(pageHeading?.textContent).toBe(copy.heading);
    expect(pageHeading?.textContent).not.toMatch(/[|｜]/);
    expect(pageHeading?.nextElementSibling?.textContent).toBe(copy.description);
    expect(heroButton?.textContent).toBe(copy.heroAction);
    expect(heroButton?.getAttribute('type')).toBe('button');
    expect(workspace).not.toBeNull();
    expect(workspace?.id).toBe(CASTLE_CREATOR_EDITOR_ID);
    expect(whatIs).not.toBeNull();
    expect(examples).not.toBeNull();
    expect(featureGrid).not.toBeNull();
    expect(howItWorks).not.toBeNull();
    expect(toolComparison).not.toBeNull();
    expect(faq).not.toBeNull();
    expect(faqHeading).not.toBeNull();
    expect(callToAction).not.toBeNull();
    expect(serverDocument.body.textContent).not.toContain(
      locale === 'en' ? 'How to build a castle' : '如何拼搭城堡',
    );

    const orderedSections = [
      pageHeading,
      workspace,
      whatIs,
      examples,
      featureGrid,
      howItWorks,
      toolComparison,
      callToAction,
      faq,
    ];
    for (let sectionIndex = 0; sectionIndex < orderedSections.length - 1; sectionIndex += 1) {
      const currentSection = orderedSections[sectionIndex];
      const nextSection = orderedSections[sectionIndex + 1];
      expect(currentSection).not.toBeNull();
      expect(nextSection).not.toBeNull();
      expect(
        Boolean(currentSection && nextSection &&
          (currentSection.compareDocumentPosition(nextSection) & Node.DOCUMENT_POSITION_FOLLOWING)),
      ).toBe(true);
    }

    const exampleGroups = Array.from(examples?.querySelectorAll('[data-example-group]') ?? []);
    expect(exampleGroups).toHaveLength(3);
    expect(exampleGroups).toHaveLength(examplesCopy.groups.length);
    expect(exampleGroups.map((exampleGroup) => exampleGroup.getAttribute('data-example-group'))).toEqual(
      examplesCopy.groups.map((exampleGroup) => exampleGroup.id),
    );
    expect(exampleGroups.map((exampleGroup) => exampleGroup.getAttribute('data-image-position'))).toEqual([
      'left',
      'right',
      'left',
    ]);
    expect(
      exampleGroups.map(
        (exampleGroup) => exampleGroup.querySelector('[data-part="layout"]')?.getAttribute('class') ?? '',
      ),
    ).toEqual([
      expect.stringContaining('md:flex-row'),
      expect.stringContaining('md:flex-row-reverse'),
      expect.stringContaining('md:flex-row'),
    ]);
    const exampleImages = exampleGroups.flatMap((exampleGroup) => Array.from(exampleGroup.querySelectorAll('img')));
    expect(exampleImages).toHaveLength(12);
    expect(exampleImages).toHaveLength(
      examplesCopy.groups.reduce((itemCount, exampleGroup) => itemCount + exampleGroup.items.length, 0),
    );
    expect(
      exampleGroups.every((exampleGroup, groupIndex) =>
        examplesCopy.groups[groupIndex]?.items.every((exampleItem) =>
          Array.from(exampleGroup.querySelectorAll('img')).some((image) => image.getAttribute('src')?.includes(exampleItem.src)),
        ),
      ),
    ).toBe(true);
    const exampleCarouselButtons = Array.from(examples?.querySelectorAll('button') ?? []);
    expect(exampleCarouselButtons).toHaveLength(examplesCopy.groups.length * 2);
    expect(exampleCarouselButtons.map((button) => button.getAttribute('aria-label'))).toEqual(
      expect.arrayContaining([examplesCopy.previousLabel, examplesCopy.nextLabel]),
    );

    const faqDomItems = Array.from(faq?.querySelectorAll('details') ?? []).map((faqItem) => ({
      question: faqItem.querySelector('summary span')?.textContent?.trim(),
      answer: faqItem.querySelector('p')?.textContent?.trim(),
    }));
    expect(faqDomItems).toHaveLength(copy.faq.items.length);
    expect(faqDomItems).toEqual(
      copy.faq.items.map((item) => ({ question: item.question, answer: item.answer })),
    );

    const callToActionButton = callToAction?.querySelector('button');
    expect(callToActionButton?.textContent).toContain(copy.callToAction.action);
    expect(callToActionButton?.getAttribute('type')).toBe('button');
    expect(structuredDataScript).not.toBeNull();
    expect(breadcrumbScript).not.toBeNull();

    const structuredData = JSON.parse(structuredDataScript?.textContent ?? '{}') as {
      '@graph': Array<Record<string, unknown>>;
    };
    expect(structuredData['@graph'][0]).toMatchObject({
      '@type': 'WebApplication',
      name: copy.heading,
      applicationCategory: 'DesignApplication',
      url: localizedUrl,
      description: copy.pageDescription,
    });
    const faqStructuredData = structuredData['@graph'][1] as {
      '@type'?: unknown;
      mainEntity?: Array<{
        name?: unknown;
        acceptedAnswer?: { '@type'?: unknown; text?: unknown };
      }>;
    };
    expect(faqStructuredData['@type']).toBe('FAQPage');
    expect(faqStructuredData.mainEntity).toHaveLength(copy.faq.items.length);
    expect(faqStructuredData.mainEntity).toEqual(
      copy.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    );
  });
});
