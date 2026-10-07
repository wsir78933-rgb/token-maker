// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getTarotCaseStudies } from '@/lib/tarot-cards/case-studies';
import { getTarotPageContent } from '@/lib/tarot-cards/page-content';

import { TarotContentSections } from './TarotContentSections';

afterEach(() => {
  cleanup();
});

describe('TarotContentSections', () => {
  it.each(['en', 'zh'] as const)('renders the six content sections in order for %s', (locale) => {
    const copy = getTarotPageContent(locale);
    render(<TarotContentSections locale={locale} />);

    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    expect(headings).toEqual([
      copy.whatIs.title,
      getTarotCaseStudies(locale).title,
      copy.features.title,
      copy.howItWorks.title,
      copy.comparison.title,
      copy.callToAction.title,
      copy.faq.title,
    ]);

    const callToAction = screen.getByRole('button', { name: copy.callToAction.action });
    expect(callToAction.tagName).toBe('A');
    expect(callToAction.getAttribute('href')).toBe('#tarot-cards-workspace');

    const featureSection = screen.getByRole('heading', { name: copy.features.title }).closest('section');
    if (featureSection === null) {
      throw new Error(`Missing Tarot feature section for ${JSON.stringify(locale)}.`);
    }
    expect(within(featureSection).getAllByRole('heading', { level: 3 })).toHaveLength(6);

    const stepsSection = screen.getByRole('heading', { name: copy.howItWorks.title }).closest('section');
    if (stepsSection === null) {
      throw new Error(`Missing Tarot how-it-works section for ${JSON.stringify(locale)}.`);
    }
    expect(within(stepsSection).getAllByRole('listitem')).toHaveLength(copy.howItWorks.steps.length);

    const comparisonRegion = screen.getByRole('region', { name: copy.comparison.tableLabel });
    const comparisonTable = within(comparisonRegion).getByRole('table');
    expect(comparisonRegion.tabIndex).toBe(0);
    expect(comparisonTable.querySelectorAll('thead th[scope="col"]')).toHaveLength(4);
    expect(comparisonTable.querySelectorAll('tbody tr')).toHaveLength(copy.comparison.rows.length);
  });
});
