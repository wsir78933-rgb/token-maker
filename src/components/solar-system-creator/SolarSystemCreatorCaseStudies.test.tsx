// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { SolarSystemCreatorCaseStudies } from '@/components/solar-system-creator/SolarSystemCreatorCaseStudies';
import { getSolarSystemCaseStudiesCopy } from '@/lib/solar-system-creator/case-studies';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((media: string) => ({
      matches: media === REDUCED_MOTION_QUERY,
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('SolarSystemCreatorCaseStudies', () => {
  it.each(['en', 'zh'] as const)('renders three four-image groups and all twelve source images for %s', (locale) => {
    const copy = getSolarSystemCaseStudiesCopy(locale);
    render(<SolarSystemCreatorCaseStudies copy={copy} />);

    const section = document.getElementById('solar-system-creator-case-studies');
    if (!(section instanceof HTMLElement)) {
      throw new Error(`SolarSystemCreatorCaseStudies test expected a section for ${JSON.stringify(locale)}.`);
    }

    expect(section.getAttribute('aria-labelledby')).toBe('solar-system-creator-case-studies-title');
    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();

    const groups = Array.from(section.querySelectorAll<HTMLElement>('[data-solar-case-group]'));
    expect(groups).toHaveLength(3);
    expect(groups.map((group) => group.dataset.imagePosition)).toEqual(['left', 'right', 'left']);
    expect(section.querySelectorAll('img')).toHaveLength(12);

    copy.groups.forEach((group, groupIndex) => {
      const groupElement = groups[groupIndex];
      if (!groupElement) throw new Error(`Missing solar system case study group at index ${groupIndex}.`);

      expect(groupElement.dataset.solarCaseGroup).toBe(group.id);
      expect(groupElement.getAttribute('aria-label')).toBe(group.carouselLabel);
      const carousel = within(groupElement).getByRole('region', { name: group.carouselLabel });
      expect(carousel.querySelectorAll('[data-index]')).toHaveLength(4);
      expect(within(carousel).getByRole('button', { name: group.previousLabel })).toBeTruthy();
      expect(within(carousel).getByRole('button', { name: group.nextLabel })).toBeTruthy();
      expect(carousel.querySelector('[data-part="layout"]')?.className).toContain(
        group.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',
      );
    });
  });

  it('fails fast when the required three-group or four-example shape is invalid', () => {
    const copy = getSolarSystemCaseStudiesCopy('en');

    expect(() =>
      render(<SolarSystemCreatorCaseStudies copy={{ ...copy, groups: copy.groups.slice(0, 2) }} />),
    ).toThrow('Solar system case studies must contain 3 groups. Received 2.');

    cleanup();
    const firstGroup = copy.groups[0];
    if (!firstGroup) throw new Error('SolarSystemCreatorCaseStudies test expected a first group.');
    const invalidExampleCount = {
      ...copy,
      groups: [{ ...firstGroup, examples: firstGroup.examples.slice(0, 3) }, ...copy.groups.slice(1)],
    };

    expect(() => render(<SolarSystemCreatorCaseStudies copy={invalidExampleCount} />)).toThrow(
      'Solar system case study group "fiction" must contain 4 examples. Received 3.',
    );
  });

  it('fails fast at the public copy boundary for null copies, non-array groups, and non-object groups', () => {
    const copy = getSolarSystemCaseStudiesCopy('en');

    expect(() =>
      render(<SolarSystemCreatorCaseStudies copy={null as never} />),
    ).toThrow('Solar system case studies copy must be a plain object. Received null.');

    cleanup();
    expect(() =>
      render(
        <SolarSystemCreatorCaseStudies
          copy={{ ...copy, groups: new Map() as never }}
        />,
      ),
    ).toThrow('Solar system case studies copy.groups must be an array. Received [object Map].');

    cleanup();
    expect(() =>
      render(
        <SolarSystemCreatorCaseStudies
          copy={{ ...copy, groups: [null, ...copy.groups.slice(1)] as never }}
        />,
      ),
    ).toThrow('Solar system case studies copy.groups[0] must be a plain object. Received null.');
  });
});
