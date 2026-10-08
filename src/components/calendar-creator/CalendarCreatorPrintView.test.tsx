// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { createCalendar } from '@/lib/calendar-creator/calendar';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import type { CalendarDocument, CalendarSettings } from '@/lib/calendar-creator/types';

import { CalendarCreatorPrintView } from './CalendarCreatorPrintView';

function createPrintDocument(): CalendarDocument {
  const settings: CalendarSettings = {
    year: 2001,
    months: [
      { name: 'Long Month', dayCount: 2 },
      { name: 'No Days', dayCount: 0 },
      { name: 'Final Month', dayCount: 1 },
    ],
    weekdayNames: ['One', 'Two', 'Three'],
    startWeekdayIndex: 0,
    moonCycles: { white: 2, blue: 2, red: 2 },
    disasterProbability: 100,
  };
  const document = createCalendar(settings, () => 0);
  const firstDay = document.days[0];
  if (!firstDay) {
    throw new Error('Calendar print test fixture must contain day 1.');
  }
  firstDay.manualIconId = 1;
  firstDay.note = `${'A long note that must remain printable. '.repeat(80)}\nContinuation context remains attached to day 1.`;
  return document;
}

afterEach(() => {
  cleanup();
});

describe('CalendarCreatorPrintView', () => {
  it('prints every month and weekday header, including zero-day months', () => {
    render(<CalendarCreatorPrintView document={createPrintDocument()} locale="en" />);

    expect(screen.getByRole('heading', { name: 'Long Month' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'No Days' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Final Month' })).toBeTruthy();
    const weekdayHeaders = Array.from(globalThis.document.querySelectorAll('[role="columnheader"]'))
      .filter((element) => element.tagName === 'SPAN');
    expect(weekdayHeaders).toHaveLength(9);
    expect(screen.getByText(getCalendarCreatorCopy('en').noDates)).toBeTruthy();
  });

  it('keeps all icon layers and the complete note as printable text', () => {
    const calendarDocument = createPrintDocument();
    render(<CalendarCreatorPrintView document={calendarDocument} locale="en" />);

    const dayOne = globalThis.document.querySelector('[data-calendar-print-day="1"]');
    expect(dayOne).not.toBeNull();
    expect(within(dayOne as HTMLElement).getAllByRole('img')).toHaveLength(5);
    expect(dayOne?.querySelector('thead')).not.toBeNull();
    expect(dayOne?.querySelector('[data-calendar-print-continuation]')?.textContent).toBe('continued · #1');
    const printableNote = dayOne?.querySelector('[data-calendar-print-note]');
    expect(printableNote?.tagName).toBe('P');
    expect(printableNote?.textContent).toBe(calendarDocument.days[0].note);
  });

  it('marks the print surface so screen-only controls can be hidden by print CSS', () => {
    render(<CalendarCreatorPrintView document={createPrintDocument()} locale="zh" />);
    const printSurface = document.querySelector('[data-calendar-print-view]');
    expect(printSurface).not.toBeNull();
    expect(printSurface?.className).toContain('printView');
    expect(printSurface?.getAttribute('style')).toContain('--calendar-week-length: 3');
  });

  it('renders the localized continuation marker in Chinese', () => {
    render(<CalendarCreatorPrintView document={createPrintDocument()} locale="zh" />);

    const dayOne = document.querySelector('[data-calendar-print-day="1"]');
    expect(dayOne?.querySelector('[data-calendar-print-continuation]')?.textContent).toBe('续 · #1');
  });
});
