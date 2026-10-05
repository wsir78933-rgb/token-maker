// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { OutfitCreatorCaseStudies } from '@/components/outfit-creator/OutfitCreatorCaseStudies';
import { getOutfitCreatorCopy } from '@/lib/outfit-creator/copy';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('OutfitCreatorCaseStudies', () => {
  it.each(['en', 'zh'] as const)('renders three four-image carousels for %s', (locale) => {
    const copy = getOutfitCreatorCopy(locale).caseStudies;
    render(<OutfitCreatorCaseStudies copy={copy} />);

    const caseStudiesSection = document.getElementById('outfit-creator-case-studies');
    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error(`Missing outfit creator case studies section for ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();

    const caseGroupElements = Array.from(
      caseStudiesSection.querySelectorAll<HTMLElement>('[data-outfit-case-group]'),
    );
    expect(caseGroupElements).toHaveLength(3);

    copy.groups.forEach((caseGroup, groupIndex) => {
      const caseGroupElement = caseGroupElements[groupIndex];
      if (!caseGroupElement) {
        throw new Error(`Missing rendered outfit case group at index ${groupIndex}.`);
      }

      expect(caseGroupElement.dataset.outfitCaseGroup).toBe(caseGroup.id);
      expect(caseGroupElement.dataset.imagePosition).toBe(caseGroup.imagePosition);
      expect(caseGroupElement.getAttribute('aria-label')).toBe(caseGroup.carouselLabel);
      expect(caseGroupElement.getAttribute('aria-labelledby')).toBeNull();
      expect(
        within(caseGroupElement).queryByRole('heading', {
          level: 3,
          name: caseGroup.title,
        }),
      ).toBeNull();
      expect(within(caseGroupElement).queryByText(caseGroup.description)).toBeNull();

      const carousel = within(caseGroupElement).getByRole('region', {
        name: caseGroup.carouselLabel,
      });
      const layout = carousel.querySelector('[data-part="layout"]');

      expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
      expect(carousel.querySelectorAll('[data-index]')).toHaveLength(4);
      expect(carousel.querySelectorAll('button')).toHaveLength(2);
      expect(within(carousel).getByRole('button', { name: caseGroup.previousLabel })).toBeTruthy();
      expect(within(carousel).getByRole('button', { name: caseGroup.nextLabel })).toBeTruthy();
      expect(layout?.className).toContain(
        caseGroup.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',
      );
      expect(carousel.querySelector('[data-part="testimonial-image-frame"] img')?.getAttribute('alt')).toBe(
        caseGroup.examples[0].alt,
      );
    });
  });

  it('fails fast when the copy does not contain exactly three groups', () => {
    const caseStudies = getOutfitCreatorCopy('en').caseStudies;
    const invalidCaseStudies = {
      ...caseStudies,
      groups: caseStudies.groups.slice(0, 2),
    } as unknown as typeof caseStudies;

    expect(() => render(<OutfitCreatorCaseStudies copy={invalidCaseStudies} />)).toThrow(
      'Outfit creator case studies must contain exactly 3 groups. Received length 2.',
    );
  });

  it('fails fast when a group does not contain exactly four examples', () => {
    const caseStudies = getOutfitCreatorCopy('en').caseStudies;
    const firstGroup = caseStudies.groups[0];
    const invalidCaseStudies = {
      ...caseStudies,
      groups: [
        {
          ...firstGroup,
          examples: firstGroup.examples.slice(0, 3),
        },
        ...caseStudies.groups.slice(1),
      ],
    } as unknown as typeof caseStudies;

    expect(() => render(<OutfitCreatorCaseStudies copy={invalidCaseStudies} />)).toThrow(
      'Outfit creator case group "rpg" must contain exactly 4 examples. Received length 3.',
    );
  });

});
