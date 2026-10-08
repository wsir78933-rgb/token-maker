// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CalendarCreatorPageHeading } from '@/components/calendar-creator/CalendarCreatorPageHeading';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { getCalendarCreatorHeroCopy } from '@/lib/calendar-creator/hero-copy';

afterEach(() => {
  cleanup();
});

function visibleHeadingText(heading: HTMLElement): string {
  return heading.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

describe('CalendarCreatorPageHeading', () => {
  it('shows the English hero copy and a create link to the editor', () => {
    const heroCopy = getCalendarCreatorHeroCopy('en');
    const actionLabel = getCalendarCreatorCopy('en').create;

    render(<CalendarCreatorPageHeading locale="en" />);

    const heading = screen.getByRole('heading', { level: 1 });
    const action = screen.getByRole('link', { name: actionLabel });

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(visibleHeadingText(heading)).toBe(heroCopy.heading);
    expect(screen.getByText(heroCopy.description)).toBeTruthy();
    expect(action.getAttribute('href')).toBe('#calendar-creator-workspace');
    expect(heading.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows the Chinese hero copy and a create link to the editor', () => {
    const heroCopy = getCalendarCreatorHeroCopy('zh');
    const actionLabel = getCalendarCreatorCopy('zh').create;

    render(<CalendarCreatorPageHeading locale="zh" />);

    const heading = screen.getByRole('heading', { level: 1 });
    const action = screen.getByRole('link', { name: actionLabel });

    expect(visibleHeadingText(heading)).toBe(heroCopy.heading);
    expect(screen.getByText(heroCopy.description)).toBeTruthy();
    expect(action.getAttribute('href')).toBe('#calendar-creator-workspace');
    expect(heading.textContent).toContain(heroCopy.emphasis);
  });
});
