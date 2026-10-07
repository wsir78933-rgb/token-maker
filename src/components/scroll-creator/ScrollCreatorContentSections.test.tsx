// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ScrollCreatorContentSections } from '@/components/scroll-creator/ScrollCreatorContentSections';
import { SCROLL_CREATOR_EDITOR_ID } from '@/lib/scroll-creator/constants';
import { getScrollCreatorPageContent } from '@/lib/scroll-creator/page-content';

afterEach(cleanup);

describe('ScrollCreatorContentSections', () => {
  it.each(['en', 'zh'] as const)('renders all localized sections in order for %s', (locale) => {
    const pageContent = getScrollCreatorPageContent(locale);
    const firstFaqItem = pageContent.faq.items[0];

    if (!firstFaqItem) {
      throw new Error(`Missing first scroll creator FAQ item for locale ${JSON.stringify(locale)}.`);
    }

    render(<ScrollCreatorContentSections locale={locale} />);

    const sectionHeadings = [
      screen.getByRole('heading', { level: 2, name: pageContent.whatIs.title }),
      screen.getByRole('heading', { level: 2, name: pageContent.features.title }),
      screen.getByRole('heading', { level: 2, name: pageContent.comparison.title }),
      screen.getByRole('heading', { level: 2, name: pageContent.howItWorks.title }),
      screen.getByRole('heading', { level: 2, name: pageContent.cta.title }),
      screen.getByRole('heading', { level: 2, name: pageContent.faq.title }),
    ];

    for (let headingIndex = 0; headingIndex < sectionHeadings.length - 1; headingIndex += 1) {
      const currentHeading = sectionHeadings[headingIndex];
      const nextHeading = sectionHeadings[headingIndex + 1];

      if (!currentHeading || !nextHeading) {
        throw new Error(`Missing section heading at index ${headingIndex} for locale ${JSON.stringify(locale)}.`);
      }

      expect(currentHeading.compareDocumentPosition(nextHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }

    expect(screen.getByRole('link', { name: pageContent.cta.action }).getAttribute('href')).toBe(
      `#${SCROLL_CREATOR_EDITOR_ID}`,
    );
    expect(screen.getByText(firstFaqItem.question)).toBeTruthy();
  });

  it('exposes an accessible horizontally scrollable comparison table', () => {
    const pageContent = getScrollCreatorPageContent('en');

    render(<ScrollCreatorContentSections locale="en" />);

    const tableRegion = screen.getByRole('region', { name: pageContent.comparison.tableLabel });
    const comparisonTable = within(tableRegion).getByRole('table');
    const tableHeaders = comparisonTable.querySelectorAll('th');

    expect(tableRegion.getAttribute('tabindex')).toBe('0');
    expect(within(comparisonTable).getAllByRole('columnheader')).toHaveLength(4);
    expect(tableHeaders.length).toBeGreaterThan(4);
    expect(Array.from(tableHeaders).every((header) => header.hasAttribute('scope'))).toBe(true);
    expect(within(comparisonTable).getByRole('columnheader', { name: pageContent.comparison.scrollCreatorHeading })).toBeTruthy();
  });
});
