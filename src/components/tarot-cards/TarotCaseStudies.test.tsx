// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { getTarotCaseStudies } from '@/lib/tarot-cards/case-studies';

import { TarotCaseStudies } from './TarotCaseStudies';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('TarotCaseStudies', () => {
  it.each(['en', 'zh'] as const)('renders three bilingual case groups with their directions for %s', (locale) => {
    const copy = getTarotCaseStudies(locale);
    render(<TarotCaseStudies copy={copy} />);

    const caseStudiesSection = document.getElementById('tarot-cards-case-studies');
    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error(`Missing Tarot case studies section for ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();

    const caseGroupElements = Array.from(
      caseStudiesSection.querySelectorAll<HTMLElement>('[data-tarot-case-group]'),
    );
    expect(caseGroupElements).toHaveLength(3);

    copy.groups.forEach((caseGroup, groupIndex) => {
      const caseGroupElement = caseGroupElements[groupIndex];
      if (!caseGroupElement) {
        throw new Error(`Missing Tarot case group at index ${groupIndex}.`);
      }

      expect(caseGroupElement.dataset.tarotCaseGroup).toBe(caseGroup.id);
      expect(caseGroupElement.dataset.imagePosition).toBe(caseGroup.imagePosition);

      const carousel = within(caseGroupElement).getByRole('region', {
        name: caseGroup.carouselLabel,
      });
      expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
      expect(carousel.querySelectorAll('[data-index]')).toHaveLength(4);
      expect(carousel.querySelectorAll('button')).toHaveLength(2);
      expect(within(carousel).getByRole('button', { name: caseGroup.previousLabel })).toBeTruthy();
      expect(within(carousel).getByRole('button', { name: caseGroup.nextLabel })).toBeTruthy();
      expect(carousel.querySelector('[data-part="testimonial-image-frame"] img')?.getAttribute('alt')).toBe(
        caseGroup.examples[0]?.alt,
      );
    });
  });

  it('keeps manual navigation independent and does not autoplay', () => {
    const copy = getTarotCaseStudies('en');
    render(<TarotCaseStudies copy={copy} />);

    const caseGroupElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-tarot-case-group]'),
    );
    const firstGroup = caseGroupElements[0];
    const secondGroup = caseGroupElements[1];
    if (firstGroup === undefined || secondGroup === undefined) {
      throw new Error('Tarot case studies test expected two independent groups.');
    }

    const firstCopy = copy.groups[0];
    const secondCopy = copy.groups[1];
    if (firstCopy === undefined || secondCopy === undefined) {
      throw new Error('Tarot case studies test expected copy for two independent groups.');
    }

    const firstCarousel = within(firstGroup).getByRole('region', {
      name: firstCopy.carouselLabel,
    });
    const secondCarousel = within(secondGroup).getByRole('region', {
      name: secondCopy.carouselLabel,
    });

    fireEvent.click(
      within(firstCarousel).getByRole('button', { name: firstCopy.nextLabel }),
    );
    expect(firstCarousel.querySelector('[data-index="1"][data-position="center"]')).toBeTruthy();
    expect(secondCarousel.querySelector('[data-index="0"][data-position="center"]')).toBeTruthy();

    vi.advanceTimersByTime(6000);
    expect(secondCarousel.querySelector('[data-index="0"][data-position="center"]')).toBeTruthy();
  });

  it('fails fast on invalid group, example, or direction counts', () => {
    const copy = getTarotCaseStudies('en');

    expect(() =>
      render(
        <TarotCaseStudies
          copy={{ ...copy, groups: copy.groups.slice(0, 2) }}
        />,
      ),
    ).toThrow('must contain exactly 3 groups. Received length 2.');

    cleanup();
    const firstGroup = copy.groups[0];
    if (firstGroup === undefined) {
      throw new Error('Tarot case studies test expected a first group.');
    }

    expect(() =>
      render(
        <TarotCaseStudies
          copy={{
            ...copy,
            groups: [
              { ...firstGroup, examples: firstGroup.examples.slice(0, 1) },
              ...copy.groups.slice(1),
            ],
          }}
        />,
      ),
    ).toThrow('must contain exactly 4 examples. Received length 1.');

    cleanup();
    expect(() =>
      render(
        <TarotCaseStudies
          copy={{
            ...copy,
            groups: [
              { ...firstGroup, imagePosition: 'right' },
              ...copy.groups.slice(1),
            ],
          }}
        />,
      ),
    ).toThrow('must use imagePosition "left". Received "right".');
  });
});
