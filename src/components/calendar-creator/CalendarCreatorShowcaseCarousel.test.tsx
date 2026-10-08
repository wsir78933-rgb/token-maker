// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { CalendarCreatorShowcaseCarousel } from './CalendarCreatorShowcaseCarousel';
import { getCalendarCreatorShowcaseCopy } from '@/lib/calendar-creator/showcase-copy';

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

describe('CalendarCreatorShowcaseCarousel', () => {
  it.each(['en', 'zh'] as const)('opens and closes the selected image for %s', async (locale) => {
    const copy = getCalendarCreatorShowcaseCopy(locale);
    const group = copy.groups[0];
    const firstExample = group?.examples[0];
    if (group === undefined || firstExample === undefined) {
      throw new Error(`Calendar creator showcase test expected a first group for ${JSON.stringify(locale)}.`);
    }

    render(
      <CalendarCreatorShowcaseCarousel
        group={group}
        ariaLabel={`${copy.title}: ${group.title}`}
        previousLabel={`${copy.previousLabel}: ${group.title}`}
        nextLabel={`${copy.nextLabel}: ${group.title}`}
        openImageLabel={copy.openImageLabel}
        closeImageLabel={copy.closeImageLabel}
      />,
    );

    const imageTrigger = screen.getByRole('button', {
      name: `${copy.openImageLabel}: ${firstExample.name}`,
    });
    fireEvent.click(imageTrigger);

    const dialog = await screen.findByRole('dialog', { name: firstExample.name });
    expect(within(dialog).getByRole('heading', { name: firstExample.name })).toBeTruthy();
    expect(within(dialog).getByRole('img', { name: firstExample.alt }).getAttribute('src')).toContain(
      firstExample.src,
    );

    fireEvent.click(within(dialog).getByRole('button', { name: copy.closeImageLabel }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: firstExample.name })).toBeNull();
      expect(document.activeElement).toBe(imageTrigger);
    });
  });
});
