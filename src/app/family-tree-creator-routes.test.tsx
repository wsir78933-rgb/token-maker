// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Image from 'next/image';

import type { SiteLocale } from '@/lib/site-locale';

vi.mock('@/components/armor-creator/circular-testimonials', () => ({
  CircularTestimonials: ({
    testimonials,
    ariaLabel,
    previousLabel,
    nextLabel,
  }: {
    testimonials: readonly {
      name: string;
      src: string;
      alt?: string;
    }[];
    ariaLabel?: string;
    previousLabel: string;
    nextLabel: string;
  }) => (
    <div data-circular-testimonials="true" aria-label={ariaLabel}>
      <div data-part="mock-testimonial-images">
        {testimonials.map((testimonial) => (
          <Image
            key={testimonial.src}
            src={testimonial.src}
            alt={testimonial.alt ?? testimonial.name}
            width={1024}
            height={676}
            unoptimized
          />
        ))}
      </div>
      <button type="button" aria-label={previousLabel} />
      <button type="button" aria-label={nextLabel} />
    </div>
  ),
}));

vi.mock('@/components/family-tree/FamilyTreeWorkbench', () => ({
  FamilyTreeWorkbench: ({ locale }: { locale: SiteLocale }) => (
    <section id="family-tree-workspace" role="region" aria-label={`Family tree editor ${locale}`} />
  ),
}));

import { metadata as englishMetadata } from '@/app/(en)/family-tree-creator/page';
import { metadata as chineseMetadata } from '@/app/(zh)/zh/family-tree-creator/page';
import { FamilyTreeCreatorPageHeading } from '@/components/family-tree/FamilyTreeCreatorPageHeading';
import { FamilyTreeCreatorPageView } from '@/components/family-tree/FamilyTreeCreatorPageView';
import { getFamilyTreeCaseStudiesCopy } from '@/lib/family-tree/case-studies';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';
import { getFamilyTreePageContent } from '@/lib/family-tree/page-content';

afterEach(cleanup);

describe('Family Tree Creator routes', () => {
  it('exposes English metadata with the canonical route and language alternates', () => {
    const copy = getFamilyTreeCopy('en');

    expect(englishMetadata.alternates).toEqual({
      canonical: '/family-tree-creator',
      languages: {
        'x-default': '/family-tree-creator',
        'en-US': '/family-tree-creator',
        'zh-CN': '/zh/family-tree-creator',
      },
    });
    expect(englishMetadata.title).toEqual({ absolute: copy.pageTitle });
    expect(englishMetadata.description).toBe(copy.pageDescription);
  });

  it('exposes Chinese metadata with the localized canonical route', () => {
    const copy = getFamilyTreeCopy('zh');

    expect(chineseMetadata.alternates).toEqual({
      canonical: '/zh/family-tree-creator',
      languages: {
        'x-default': '/family-tree-creator',
        'en-US': '/family-tree-creator',
        'zh-CN': '/zh/family-tree-creator',
      },
    });
    expect(chineseMetadata.title).toEqual({ absolute: copy.pageTitle });
    expect(chineseMetadata.description).toBe(copy.pageDescription);
  });

  it.each(['en', 'zh'] as const)('mounts the localized workbench for %s', (locale) => {
    const copy = getFamilyTreeCopy(locale);

    render(<FamilyTreeCreatorPageView locale={locale} />);

    expect(screen.getByRole('heading', { level: 1, name: copy.heading })).toBeTruthy();
    expect(screen.getByText(copy.pageDescription)).toBeTruthy();
    expect(screen.getByTestId('family-tree-workspace')).toBeTruthy();
    expect(screen.getByRole('region', { name: `Family tree editor ${locale}` })).toBeTruthy();
    expect(document.querySelectorAll('#family-tree-creator-editor')).toHaveLength(1);
    expect(document.querySelectorAll('#family-tree-workspace')).toHaveLength(1);
  });

  it.each(['en', 'zh'] as const)('scrolls the localized hero action to the workbench for %s', (locale) => {
    const copy = getFamilyTreeCopy(locale);
    render(<FamilyTreeCreatorPageView locale={locale} />);

    const workspace = document.getElementById('family-tree-creator-editor');
    if (workspace === null) {
      throw new Error('Family tree creator editor target is missing. id="family-tree-creator-editor".');
    }
    const scrollIntoView = vi.fn();
    Object.defineProperty(workspace, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });

    fireEvent.click(screen.getByRole('button', { name: copy.heroAction }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it.each(['en', 'zh'] as const)('renders localized information below the editor with a working CTA target for %s', (locale) => {
    const content = getFamilyTreePageContent(locale);
    const caseStudies = getFamilyTreeCaseStudiesCopy(locale);
    render(<FamilyTreeCreatorPageView locale={locale} />);

    const informationalSections = [
      content.whatIs.title,
      caseStudies.title,
      content.features.title,
      content.toolComparison.title,
      content.howItWorks.title,
      content.callToAction.title,
      content.faq.title,
    ].map((title) => screen.getByRole('region', { name: title }));

    let precedingElement: Element = screen.getByTestId('family-tree-workspace');
    for (const section of informationalSections) {
      expect(precedingElement.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
      precedingElement = section;
    }

    const caseStudyGroups = Array.from(
      informationalSections[1].querySelectorAll<HTMLElement>('[data-family-tree-case-group]'),
    );
    expect(caseStudyGroups).toHaveLength(3);
    expect(caseStudyGroups).toHaveLength(caseStudies.groups.length);
    caseStudyGroups.forEach((caseStudyGroup, groupIndex) => {
      const expectedGroup = caseStudies.groups[groupIndex];
      if (expectedGroup === undefined) {
        throw new Error(`Missing case study copy for group index ${groupIndex}.`);
      }

      expect(caseStudyGroup.getAttribute('data-family-tree-case-group')).toBe(expectedGroup.id);
      const images = within(caseStudyGroup).getAllByRole('img');
      expect(images).toHaveLength(4);
      expect(images).toHaveLength(expectedGroup.examples.length);
      expect(images.map((image) => image.getAttribute('src'))).toEqual(
        expectedGroup.examples.map((example) => example.src),
      );
    });

    expect(within(informationalSections[2]).getAllByRole('listitem')).toHaveLength(6);
    expect(within(informationalSections[4]).getAllByRole('listitem')).toHaveLength(4);

    const toolComparison = content.toolComparison;
    const comparisonScrollRegion = within(informationalSections[3]).getByRole('region', {
      name: toolComparison.tableLabel,
    });
    expect(comparisonScrollRegion.getAttribute('tabindex')).toBe('0');
    comparisonScrollRegion.focus();
    expect(document.activeElement).toBe(comparisonScrollRegion);

    const comparisonTable = within(comparisonScrollRegion).getByRole('table', {
      name: toolComparison.title,
    });
    expect(within(comparisonTable).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(comparisonTable).getAllByRole('rowheader')).toHaveLength(5);
    expect(within(comparisonTable).getAllByRole('row')).toHaveLength(6);
    expect(
      within(comparisonTable)
        .getAllByRole('columnheader')
        .every((header) => header.getAttribute('scope') === 'col'),
    ).toBe(true);
    expect(
      within(comparisonTable)
        .getAllByRole('rowheader')
        .every((header) => header.getAttribute('scope') === 'row'),
    ).toBe(true);

    expect(within(informationalSections[6]).getAllByRole('button')).toHaveLength(8);

    const callToAction = within(informationalSections[5]).getByRole('link', { name: content.callToAction.action });
    expect(callToAction.getAttribute('href')).toBe('#family-tree-creator-editor');
    expect(document.querySelectorAll('#family-tree-creator-editor')).toHaveLength(1);
  });

  it('fails fast with the missing workspace id when the hero target does not exist', () => {
    const missingWorkspaceId = 'missing-family-tree-workspace';
    render(<FamilyTreeCreatorPageHeading locale="en" workspaceId={missingWorkspaceId} />);

    const windowErrors: Error[] = [];
    const captureWindowError = (event: ErrorEvent): void => {
      event.preventDefault();
      if (event.error instanceof Error) windowErrors.push(event.error);
    };
    window.addEventListener('error', captureWindowError);
    try {
      fireEvent.click(screen.getByRole('button', { name: 'Create a Family Tree for Free' }));
    } finally {
      window.removeEventListener('error', captureWindowError);
    }

    expect(windowErrors).toHaveLength(1);
    expect(windowErrors[0]?.message).toMatch(new RegExp(`workspace is missing.*${missingWorkspaceId}`));
  });
});
