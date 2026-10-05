// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';

vi.mock('@/components/weapon-creator/WeaponCreatorWorkbench', () => ({
  WeaponCreatorWorkbench: ({ locale }: { locale: SiteLocale }) => (
    <div role="region" aria-label={`Weapon editor ${locale}`} />
  ),
}));

import { metadata as englishMetadata } from '@/app/(en)/weapon-creator/page';
import { metadata as chineseMetadata } from '@/app/(zh)/zh/weapon-creator/page';
import { WeaponCreatorPageView } from '@/components/weapon-creator/WeaponCreatorPageView';
import { getWeaponCreatorCopy } from '@/lib/weapon-creator/copy';

afterEach(() => {
  cleanup();
});

describe('Weapon Creator routes', () => {
  it('exposes English metadata with the canonical route and language alternates', () => {
    expect(englishMetadata.alternates).toEqual({
      canonical: '/weapon-creator',
      languages: {
        'x-default': '/weapon-creator',
        'en-US': '/weapon-creator',
        'zh-CN': '/zh/weapon-creator',
      },
    });
    expect(englishMetadata.title).toEqual({
      absolute: expect.stringContaining('Weapon Creator'),
    });
  });

  it('exposes Chinese metadata with the localized canonical route', () => {
    expect(chineseMetadata.alternates).toEqual({
      canonical: '/zh/weapon-creator',
      languages: {
        'x-default': '/weapon-creator',
        'en-US': '/weapon-creator',
        'zh-CN': '/zh/weapon-creator',
      },
    });
    expect(chineseMetadata.title).toEqual({
      absolute: expect.stringContaining('奇幻武器拼装工具'),
    });
  });

  it('exports one page view for both supported locales', () => {
    expect(WeaponCreatorPageView).toBeTypeOf('function');
  });

  it.each(['en', 'zh'] as const)('places localized case studies after What Is for %s', (locale) => {
    const copy = getWeaponCreatorCopy(locale);
    render(<WeaponCreatorPageView locale={locale} />);

    const whatIsHeading = screen.getByRole('heading', { level: 2, name: copy.whatIsTitle });
    const caseStudiesHeading = screen.getByRole('heading', {
      level: 2,
      name: copy.caseStudies.title,
    });
    const featureOverviewHeading = screen.getByRole('heading', {
      level: 2,
      name: copy.featureOverview.title,
    });
    const caseStudiesSection = document.getElementById('weapon-creator-case-studies');

    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error(`Missing weapon creator case studies section for locale ${JSON.stringify(locale)}.`);
    }

    expect(whatIsHeading.closest('section')?.nextElementSibling).toBe(caseStudiesSection);
    expect(
      caseStudiesHeading.compareDocumentPosition(featureOverviewHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(caseStudiesSection.querySelectorAll('[data-weapon-case-group]')).toHaveLength(3);
  });
});
