// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FamilyTreeCreatorCaseStudies } from '@/components/family-tree/FamilyTreeCreatorCaseStudies';
import type { FamilyTreeCaseStudiesCopy } from '@/lib/family-tree/case-studies';

type MockCircularTestimonialsProps = {
  testimonials: readonly { alt?: string; name: string; quote: string; designation: string; src: string }[];
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  imagePosition: 'left' | 'right';
  imageShape: 'portrait' | 'landscape';
  clipImageStack: boolean;
};

vi.mock('@/components/armor-creator/circular-testimonials', () => ({
  CircularTestimonials: ({
    testimonials,
    ariaLabel,
    previousLabel,
    nextLabel,
    imagePosition,
    imageShape,
    clipImageStack,
  }: MockCircularTestimonialsProps) => (
    <div
      aria-label={ariaLabel}
      data-clip-image-stack={String(clipImageStack)}
      data-image-position={imagePosition}
      data-image-shape={imageShape}
      data-mock-circular-testimonials="true"
      data-testimonial-count={String(testimonials.length)}
      role="region"
    >
      <button type="button">{previousLabel}</button>
      <button type="button">{nextLabel}</button>
      <span>{testimonials[0]?.name}</span>
    </div>
  ),
}));

afterEach(() => {
  cleanup();
});

function createCaseStudiesCopy(): FamilyTreeCaseStudiesCopy {
  const groupIds = ['novel-families', 'worldbuilding-lineages', 'trpg-backgrounds'] as const;
  const imagePositions = ['right', 'left', 'right'] as const;

  return {
    title: 'Family tree examples',
    description: 'Twelve fictional family tree studies.',
    groups: groupIds.map((groupId, groupIndex) => ({
      id: groupId,
      carouselLabel: `${groupId} carousel`,
      previousLabel: `Previous ${groupId}`,
      nextLabel: `Next ${groupId}`,
      imagePosition: imagePositions[groupIndex],
      examples: Array.from({ length: 4 }, (_, exampleIndex) => ({
        name: `${groupId} example ${exampleIndex + 1}`,
        designation: 'Fictional family tree study',
        quote: 'A fictional example description.',
        src: `/family-tree/examples/${groupId}-${exampleIndex + 1}.png`,
        alt: `${groupId} example ${exampleIndex + 1}`,
      })),
    })),
  };
}

describe('FamilyTreeCreatorCaseStudies', () => {
  it('renders three independent four-example carousels with the approved mapping', () => {
    const copy = createCaseStudiesCopy();
    render(<FamilyTreeCreatorCaseStudies copy={copy} />);

    const caseStudiesSection = document.getElementById('family-tree-creator-case-studies');
    if (!(caseStudiesSection instanceof HTMLElement)) {
      throw new Error('Missing family tree creator case studies section.');
    }

    expect(caseStudiesSection.getAttribute('aria-labelledby')).toBe(
      'family-tree-creator-case-studies-title',
    );
    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();

    const caseGroupElements = Array.from(
      caseStudiesSection.querySelectorAll<HTMLElement>('[data-family-tree-case-group]'),
    );
    expect(caseGroupElements).toHaveLength(3);

    copy.groups.forEach((caseGroup, groupIndex) => {
      const caseGroupElement = caseGroupElements[groupIndex];
      if (!caseGroupElement) {
        throw new Error(`Missing family tree case group at index ${groupIndex}.`);
      }

      expect(caseGroupElement.dataset.familyTreeCaseGroup).toBe(caseGroup.id);
      expect(caseGroupElement.dataset.imagePosition).toBe(caseGroup.imagePosition);
      expect(caseGroupElement.getAttribute('aria-label')).toBe(caseGroup.carouselLabel);
      expect(caseGroupElement.hasAttribute('tabindex')).toBe(false);
      expect(caseGroupElement.tabIndex).toBe(-1);

      const carousel = within(caseGroupElement).getByRole('region', {
        name: caseGroup.carouselLabel,
      });
      expect(carousel.getAttribute('data-image-position')).toBe(caseGroup.imagePosition);
      expect(carousel.getAttribute('data-image-shape')).toBe('landscape');
      expect(carousel.getAttribute('data-clip-image-stack')).toBe('false');
      expect(carousel.getAttribute('data-testimonial-count')).toBe('4');
      expect(within(carousel).getByRole('button', { name: caseGroup.previousLabel })).toBeTruthy();
      expect(within(carousel).getByRole('button', { name: caseGroup.nextLabel })).toBeTruthy();
      expect(carousel.querySelectorAll('button')).toHaveLength(2);
    });

    expect(caseStudiesSection.querySelectorAll('button')).toHaveLength(6);
  });

  it('fails fast when the copy does not contain exactly three groups', () => {
    const copy = createCaseStudiesCopy();
    const invalidCopy = {
      ...copy,
      groups: copy.groups.slice(0, 2),
    } as unknown as FamilyTreeCaseStudiesCopy;

    expect(() => render(<FamilyTreeCreatorCaseStudies copy={invalidCopy} />)).toThrow(
      'Family tree case studies must contain exactly 3 groups. Received length 2.',
    );
  });

  it('fails fast with the group id when a group does not contain exactly four examples', () => {
    const copy = createCaseStudiesCopy();
    const firstGroup = copy.groups[0];
    if (!firstGroup) {
      throw new Error('Family tree case studies fixture is missing its first group.');
    }

    const invalidCopy = {
      ...copy,
      groups: [
        {
          ...firstGroup,
          examples: firstGroup.examples.slice(0, 3),
        },
        ...copy.groups.slice(1),
      ],
    } as unknown as FamilyTreeCaseStudiesCopy;

    expect(() => render(<FamilyTreeCreatorCaseStudies copy={invalidCopy} />)).toThrow(
      'Family tree case group "novel-families" must contain exactly 4 examples. Received length 3.',
    );
  });

  it('fails fast with the group index and received value when a group is null', () => {
    const copy = createCaseStudiesCopy();
    const invalidCopy = {
      ...copy,
      groups: [null, ...copy.groups.slice(1)],
    } as unknown as FamilyTreeCaseStudiesCopy;

    expect(() => render(<FamilyTreeCreatorCaseStudies copy={invalidCopy} />)).toThrow(
      'Family tree case group at index 0 must be an object. Received null.',
    );
  });
});
