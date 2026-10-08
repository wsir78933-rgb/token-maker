// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { ScrollCreatorCaseStudies } from '@/components/scroll-creator/ScrollCreatorCaseStudies';
import { getScrollCreatorCaseStudies } from '@/lib/scroll-creator/case-studies';

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

describe('ScrollCreatorCaseStudies', () => {
  it.each(['en', 'zh'] as const)('renders three independent four-image carousels for %s', (locale) => {
    const copy = getScrollCreatorCaseStudies(locale);
    render(<ScrollCreatorCaseStudies locale={locale} />);

    const section = document.getElementById('scroll-creator-case-studies');
    if (!(section instanceof HTMLElement)) {
      throw new Error(`Missing scroll creator case studies section for ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();
    const groups = Array.from(section.querySelectorAll<HTMLElement>('[data-scroll-case-group]'));
    expect(groups).toHaveLength(3);

    copy.groups.forEach((caseGroup, groupIndex) => {
      const group = groups[groupIndex];
      if (!group) throw new Error(`Missing scroll creator case group at index ${groupIndex}.`);

      expect(group.dataset.scrollCaseGroup).toBe(caseGroup.id);
      expect(group.dataset.imagePosition).toBe(caseGroup.imagePosition);
      const carousel = within(group).getByRole('region', { name: caseGroup.carouselLabel });
      expect(carousel.querySelectorAll('[data-index]')).toHaveLength(4);
      expect(carousel.querySelectorAll('button')).toHaveLength(3);
      expect(
        within(carousel).getByRole('button', {
          name: `${copy.viewImageLabel}: ${caseGroup.examples[0].name}`,
        }),
      ).toBeTruthy();
      expect(
        carousel.querySelector('[data-part="testimonial-image-frame"]')?.getAttribute('style'),
      ).toContain('background-color: rgb(255, 255, 255)');
    });
  });

  it('opens the complete original image, closes with the button, and restores focus', async () => {
    const copy = getScrollCreatorCaseStudies('en');
    render(<ScrollCreatorCaseStudies locale="en" />);

    const trigger = screen.getByRole('button', {
      name: `${copy.viewImageLabel}: ${copy.groups[0].examples[0].name}`,
    });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: copy.groups[0].examples[0].name })).toBeTruthy();
    const fullImage = within(dialog).getByRole('img', {
      name: copy.groups[0].examples[0].alt,
    });
    expect(fullImage.getAttribute('width')).toBe('900');
    expect(fullImage.getAttribute('height')).toBe('1300');
    expect(fullImage.className).toContain('object-contain');

    fireEvent.click(within(dialog).getByRole('button', { name: copy.closeImageLabel }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('closes with Escape and backdrop dismissal in both modal paths', async () => {
    const copy = getScrollCreatorCaseStudies('zh');
    render(<ScrollCreatorCaseStudies locale="zh" />);

    const trigger = screen.getByRole('button', {
      name: `${copy.viewImageLabel}: ${copy.groups[0].examples[0].name}`,
    });
    fireEvent.click(trigger);
    await screen.findByRole('dialog');
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    fireEvent.click(trigger);
    await screen.findByRole('dialog');
    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]');
    if (!(backdrop instanceof HTMLElement)) throw new Error('Missing scroll case study dialog backdrop.');
    fireEvent.click(backdrop);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
});
