// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/town-creator/TownCreatorWorkbench', () => ({
  TownCreatorWorkbench: ({ locale }: { locale: 'en' | 'zh' }) => (
    <div role="region" aria-label={`Town editor ${locale}`} />
  ),
}));

vi.mock('@/components/town-creator/TownCreatorEditorSection', () => ({
  TownCreatorEditorSection: ({ children }: { children: ReactNode }) => (
    <div id="town-creator-editor">{children}</div>
  ),
}));

import { metadata as englishMetadata } from '@/app/(en)/town-creator/page';
import { metadata as chineseMetadata } from '@/app/(zh)/zh/town-creator/page';
import { TownCreatorPageView } from '@/components/town-creator/TownCreatorPageView';
import { getTownCreatorCopy, TOWN_CREATOR_EDITOR_ID } from '@/lib/town-creator/copy';

afterEach(() => {
  cleanup();
});

describe('Town Creator routes', () => {
  it('exposes English canonical, language alternates, and page metadata', () => {
    const copy = getTownCreatorCopy('en');

    expect(englishMetadata.alternates).toEqual({
      canonical: '/town-creator',
      languages: {
        'x-default': '/town-creator',
        'en-US': '/town-creator',
        'zh-CN': '/zh/town-creator',
      },
    });
    expect(englishMetadata.title).toEqual({ absolute: copy.pageTitle });
    expect(englishMetadata.description).toBe(copy.pageDescription);
    expect(englishMetadata.openGraph).toMatchObject({
      url: '/town-creator',
      locale: 'en_US',
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
    expect(englishMetadata.twitter).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
  });

  it('exposes Chinese canonical, language alternates, and page metadata', () => {
    const copy = getTownCreatorCopy('zh');

    expect(chineseMetadata.alternates).toEqual({
      canonical: '/zh/town-creator',
      languages: {
        'x-default': '/town-creator',
        'en-US': '/town-creator',
        'zh-CN': '/zh/town-creator',
      },
    });
    expect(chineseMetadata.title).toEqual({ absolute: copy.pageTitle });
    expect(chineseMetadata.description).toBe(copy.pageDescription);
    expect(chineseMetadata.openGraph).toMatchObject({
      url: '/zh/town-creator',
      locale: 'zh_CN',
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
    expect(chineseMetadata.twitter).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
  });

  it.each(['en', 'zh'] as const)('renders the localized heading and workbench for %s', (locale) => {
    const copy = getTownCreatorCopy(locale);
    render(<TownCreatorPageView locale={locale} />);

    expect(screen.getByRole('heading', { level: 1, name: copy.heading })).toBeDefined();
    expect(screen.getByText(copy.description)).toBeDefined();
    expect(document.getElementById(TOWN_CREATOR_EDITOR_ID)).toBeDefined();
    expect(screen.getByRole('region', { name: `Town editor ${locale}` })).toBeDefined();

    const sectionIds = [
      'town-creator-what-is',
      'town-creator-case-studies',
      'town-creator-features',
      'town-creator-how-it-works',
      'town-creator-comparison',
      'town-creator-cta',
      'town-creator-faq',
    ];
    const sections = sectionIds.map((sectionId) => {
      const section = document.getElementById(sectionId);
      expect(section, `Missing section ${sectionId} for ${locale}`).not.toBeNull();
      return section!;
    });
    const editor = document.getElementById(TOWN_CREATOR_EDITOR_ID)!;
    const pageSections = [editor, ...sections];
    for (let index = 1; index < pageSections.length; index += 1) {
      expect(
        pageSections[index - 1].compareDocumentPosition(pageSections[index]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).not.toBe(0);
    }

    const caseStudiesSection = document.getElementById('town-creator-case-studies');
    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error(`Missing town creator case studies section for ${locale}.`);
    }

    const expectedCaseGroups = [
      { id: 'everyday-settlements', imagePosition: 'left' },
      { id: 'trade-and-frontiers', imagePosition: 'right' },
      { id: 'exploration-and-ruins', imagePosition: 'left' },
    ] as const;
    const caseGroups = Array.from(
      caseStudiesSection.querySelectorAll<HTMLElement>('[data-town-case-group]'),
    );
    expect(caseGroups).toHaveLength(expectedCaseGroups.length);
    expect(caseGroups.map((group) => group.dataset.townCaseGroup)).toEqual(
      expectedCaseGroups.map((group) => group.id),
    );
    expect(caseGroups.map((group) => group.dataset.imagePosition)).toEqual(
      expectedCaseGroups.map((group) => group.imagePosition),
    );

    const caseImageSources = caseGroups.flatMap((group) =>
      Array.from(group.querySelectorAll<HTMLImageElement>('img'), (image) => image.getAttribute('src')),
    );
    expect(caseImageSources).toHaveLength(12);
    expect(new Set(caseImageSources).size).toBe(12);

    caseGroups.forEach((group, groupIndex) => {
      const caseGroupCopy = copy.caseStudies.groups[groupIndex];
      if (!caseGroupCopy) {
        throw new Error(`Missing town creator case study copy at index ${groupIndex} for ${locale}.`);
      }

      expect(group.querySelectorAll('img')).toHaveLength(4);
      expect(group.getAttribute('aria-label')).toBe(caseGroupCopy.carouselLabel);
      expect(Array.from(group.querySelectorAll<HTMLImageElement>('img'), (image) => image.getAttribute('src'))).toEqual(
        caseGroupCopy.examples.map((example) => example.src),
      );

      const carousel = within(group).getByRole('region', { name: caseGroupCopy.carouselLabel });
      expect(within(carousel).getByRole('button', { name: caseGroupCopy.previousLabel })).toBeDefined();
      expect(within(carousel).getByRole('button', { name: caseGroupCopy.nextLabel })).toBeDefined();
    });

    expect(screen.getByRole('button', { name: copy.heroAction })).toBeDefined();
    expect(screen.getByRole('link', { name: copy.cta.action }).getAttribute('href')).toBe(
      `#${TOWN_CREATOR_EDITOR_ID}`,
    );
    expect(screen.getAllByRole('columnheader').map((column) => column.textContent)).toEqual(
      Object.values(copy.toolComparison.columns),
    );
    const comparisonSection = document.getElementById('town-creator-comparison')!;
    expect(
      within(comparisonSection).getByRole('region', { name: copy.toolComparison.title }).getAttribute('tabindex'),
    ).toBe('0');
    for (const item of copy.faq.items) {
      expect(screen.getByRole('button', { name: item.question }).getAttribute('aria-expanded')).toBe('false');
    }
  });
});
