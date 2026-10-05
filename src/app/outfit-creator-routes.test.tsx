// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';

vi.mock('@/components/outfit-creator/OutfitCreatorWorkbench', () => ({
  OutfitCreatorWorkbench: ({ locale }: { locale: SiteLocale }) => (
    <div role="region" aria-label={`Outfit editor ${locale}`} />
  ),
}));

import { metadata as englishMetadata } from '@/app/(en)/outfit-creator/page';
import { metadata as chineseMetadata } from '@/app/(zh)/zh/outfit-creator/page';
import { OutfitCreatorPageView } from '@/components/outfit-creator/OutfitCreatorPageView';
import { getOutfitCreatorCopy } from '@/lib/outfit-creator/copy';

afterEach(() => {
  cleanup();
});

describe('Outfit Creator routes', () => {
  it('exposes English metadata with the canonical route and language alternates', () => {
    expect(englishMetadata.alternates).toEqual({
      canonical: '/outfit-creator',
      languages: {
        'x-default': '/outfit-creator',
        'en-US': '/outfit-creator',
        'zh-CN': '/zh/outfit-creator',
      },
    });
    expect(englishMetadata.title).toEqual({
      absolute: expect.stringContaining('Outfit Creator'),
    });
  });

  it('exposes Chinese metadata with the localized canonical route', () => {
    expect(chineseMetadata.alternates).toEqual({
      canonical: '/zh/outfit-creator',
      languages: {
        'x-default': '/outfit-creator',
        'en-US': '/outfit-creator',
        'zh-CN': '/zh/outfit-creator',
      },
    });
    expect(chineseMetadata.title).toEqual({
      absolute: expect.stringContaining('服装搭配工具'),
    });
  });

  it('exports one page view for both supported locales', () => {
    expect(OutfitCreatorPageView).toBeTypeOf('function');
  });

  it.each(['en', 'zh'] as const)('places localized case studies after What Is for %s', (locale) => {
    const copy = getOutfitCreatorCopy(locale);
    render(<OutfitCreatorPageView locale={locale} />);

    const whatIsHeading = screen.getByRole('heading', { level: 2, name: copy.whatIsTitle });
    const caseStudiesHeading = screen.getByRole('heading', {
      level: 2,
      name: copy.caseStudies.title,
    });
    const featureOverviewHeading = screen.getByRole('heading', {
      level: 2,
      name: copy.featureOverview.title,
    });
    const caseStudiesSection = document.getElementById('outfit-creator-case-studies');

    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error(`Missing outfit creator case studies section for locale ${JSON.stringify(locale)}.`);
    }

    expect(whatIsHeading.closest('section')?.nextElementSibling).toBe(caseStudiesSection);
    expect(caseStudiesHeading.compareDocumentPosition(featureOverviewHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(caseStudiesSection.querySelectorAll('[data-outfit-case-group]')).toHaveLength(3);
  });
});
