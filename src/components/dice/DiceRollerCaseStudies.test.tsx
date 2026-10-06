// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { DiceRollerCaseStudies } from '@/components/dice/DiceRollerCaseStudies';
import { getDiceRollerPageCopy } from '@/lib/site-content';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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

describe('DiceRollerCaseStudies', () => {
  it.each(['en', 'zh'] as const)('renders three four-example carousels for %s', (locale) => {
    const copy = getDiceRollerPageCopy(locale).caseStudies;
    render(<DiceRollerCaseStudies copy={copy} />);

    const caseStudiesSection = document.getElementById('dice-roller-case-studies');
    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error(`Missing dice roller case studies section for ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();

    const caseGroupElements = Array.from(
      caseStudiesSection.querySelectorAll<HTMLElement>('[data-dice-case-group]'),
    );
    expect(caseGroupElements).toHaveLength(3);

    copy.groups.forEach((caseGroup, groupIndex) => {
      const caseGroupElement = caseGroupElements[groupIndex];
      if (!caseGroupElement) {
        throw new Error(`Missing rendered dice roller case group at index ${groupIndex}.`);
      }

      expect(caseGroupElement.dataset.diceCaseGroup).toBe(caseGroup.id);
      expect(caseGroupElement.dataset.imagePosition).toBe(caseGroup.imagePosition);
      expect(within(caseGroupElement).getByRole('heading', { level: 3, name: caseGroup.title })).toBeTruthy();

      const carousel = within(caseGroupElement).getByRole('region', {
        name: caseGroup.carouselLabel,
      });
      expect(carousel.querySelectorAll('[data-index]')).toHaveLength(4);
      expect(within(carousel).getByRole('button', { name: caseGroup.previousLabel })).toBeTruthy();
      expect(within(carousel).getByRole('button', { name: caseGroup.nextLabel })).toBeTruthy();
      expect(
        within(carousel).getByText(
          `${copy.caseLabel} 1/4 · ${caseGroup.examples[0]?.expression} · ${copy.exampleTotalLabel}: ${caseGroup.examples[0]?.exampleTotal}`,
        ),
      ).toBeTruthy();
      expect(carousel.querySelector('[data-part="layout"]')?.className).toContain(
        caseGroup.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',
      );
    });
  });

  it('fails fast when the case study shape or image order is invalid', () => {
    const copy = getDiceRollerPageCopy('en').caseStudies;
    const invalidGroupCount = { ...copy, groups: copy.groups.slice(0, 2) };

    expect(() => render(<DiceRollerCaseStudies copy={invalidGroupCount} />)).toThrow(
      'Dice roller case studies must contain exactly 3 groups. Received length 2.',
    );

    cleanup();
    const firstGroup = copy.groups[0];
    if (!firstGroup) {
      throw new Error('Dice roller case studies test expected a first group.');
    }

    const invalidExampleCount = {
      ...copy,
      groups: [
        { ...firstGroup, examples: firstGroup.examples.slice(0, 3) },
        ...copy.groups.slice(1),
      ],
    };
    expect(() => render(<DiceRollerCaseStudies copy={invalidExampleCount} />)).toThrow(
      'Dice roller case group "basic-checks" must contain exactly 4 examples. Received length 3.',
    );

    cleanup();
    const invalidImageOrder = {
      ...copy,
      groups: copy.groups.map((caseGroup, index) =>
        index === 0 ? { ...caseGroup, imagePosition: 'left' as const } : caseGroup,
      ),
    };
    expect(() => render(<DiceRollerCaseStudies copy={invalidImageOrder} />)).toThrow(
      'Dice roller case group "basic-checks" at index 0 must use imagePosition "right". Received "left".',
    );
  });
});
