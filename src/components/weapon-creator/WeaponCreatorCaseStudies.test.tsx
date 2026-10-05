// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { WeaponCreatorCaseStudies } from '@/components/weapon-creator/WeaponCreatorCaseStudies';
import { getWeaponCreatorCopy } from '@/lib/weapon-creator/copy';

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

describe('WeaponCreatorCaseStudies', () => {
  it.each(['en', 'zh'] as const)('renders three four-image carousels for %s', (locale) => {
    const copy = getWeaponCreatorCopy(locale).caseStudies;
    render(<WeaponCreatorCaseStudies copy={copy} />);

    const caseStudiesSection = document.getElementById('weapon-creator-case-studies');
    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error(`Missing weapon creator case studies section for ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();

    const caseGroupElements = Array.from(
      caseStudiesSection.querySelectorAll<HTMLElement>('[data-weapon-case-group]'),
    );
    expect(caseGroupElements).toHaveLength(3);

    copy.groups.forEach((caseGroup, groupIndex) => {
      const caseGroupElement = caseGroupElements[groupIndex];
      if (!caseGroupElement) {
        throw new Error(`Missing rendered weapon case group at index ${groupIndex}.`);
      }

      expect(caseGroupElement.dataset.weaponCaseGroup).toBe(caseGroup.id);
      expect(caseGroupElement.dataset.imagePosition).toBe(caseGroup.imagePosition);
      expect(caseGroupElement.getAttribute('aria-label')).toBe(caseGroup.carouselLabel);

      const carousel = within(caseGroupElement).getByRole('region', {
        name: caseGroup.carouselLabel,
      });
      expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
      expect(carousel.querySelectorAll('[data-index]')).toHaveLength(4);
      expect(carousel.querySelectorAll('button')).toHaveLength(2);
      expect(within(carousel).getByRole('button', { name: caseGroup.previousLabel })).toBeTruthy();
      expect(within(carousel).getByRole('button', { name: caseGroup.nextLabel })).toBeTruthy();
      expect(carousel.querySelector('[data-part="testimonial-image-frame"] img')?.getAttribute('alt')).toBe(
        caseGroup.examples[0].alt,
      );
    });
  });

  it('fails fast when the copy does not contain exactly three groups', () => {
    const caseStudies = getWeaponCreatorCopy('en').caseStudies;
    const invalidCaseStudies = {
      ...caseStudies,
      groups: caseStudies.groups.slice(0, 2),
    } as unknown as typeof caseStudies;

    expect(() => render(<WeaponCreatorCaseStudies copy={invalidCaseStudies} />)).toThrow(
      'Weapon creator case studies must contain exactly 3 groups. Received length 2.',
    );
  });

  it('fails fast when a group does not contain exactly four examples', () => {
    const caseStudies = getWeaponCreatorCopy('en').caseStudies;
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

    expect(() => render(<WeaponCreatorCaseStudies copy={invalidCaseStudies} />)).toThrow(
      'Weapon creator case group "rpg" must contain exactly 4 examples. Received length 3.',
    );
  });
});
