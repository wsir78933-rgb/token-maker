// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCalendar } from '@/lib/calendar-creator/calendar';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import type { CalendarDocument, CalendarSettings } from '@/lib/calendar-creator/types';

import { CalendarCreatorGrid } from './CalendarCreatorGrid';

function createGridDocument(): CalendarDocument {
  const settings: CalendarSettings = {
    year: -12,
    months: [
      { name: 'First', dayCount: 2 },
      { name: 'Empty', dayCount: 0 },
      { name: 'Third', dayCount: 8 },
    ],
    weekdayNames: ['Dawn', 'Dusk', 'Night', 'Void'],
    startWeekdayIndex: 1,
    moonCycles: { white: 4, blue: 4, red: 4 },
    disasterProbability: 100,
  };
  const document = createCalendar(settings, () => 0);
  const firstDay = document.days[0];
  if (!firstDay) {
    throw new Error('Calendar grid test fixture must contain day 1.');
  }
  firstDay.manualIconId = 1;
  firstDay.note = 'A note that stays visible in the day preview.';
  return document;
}

function renderGrid(
  calendarDocument = createGridDocument(),
  mobileMultiSelect = false,
  visibleMonthIndex = 0,
) {
  const handlers = {
    onEditDay: vi.fn(),
    onToggleDay: vi.fn(),
  };
  const view = render(
    <CalendarCreatorGrid
      activeDayId={1}
      document={calendarDocument}
      locale="en"
      mobileMultiSelect={mobileMultiSelect}
      onEditDay={handlers.onEditDay}
      onToggleDay={handlers.onToggleDay}
      selectedDayIds={[1, 3]}
      visibleMonthIndex={visibleMonthIndex}
    />,
  );
  return { calendarDocument, ...handlers, ...view };
}

function getDayCell(dayOfYear: number): HTMLElement {
  const cell = screen.getAllByRole('gridcell').find(
    (candidate) => candidate.getAttribute('data-calendar-day') === String(dayOfYear),
  );
  if (!cell) {
    throw new Error(`Calendar grid test could not find day ${String(dayOfYear)}.`);
  }

  return cell;
}

function queryDayCell(dayOfYear: number): HTMLElement | null {
  return screen.queryAllByRole('gridcell').find(
    (candidate) => candidate.getAttribute('data-calendar-day') === String(dayOfYear),
  ) ?? null;
}

function getDayButton(dayOfYear: number): HTMLButtonElement {
  return within(getDayCell(dayOfYear)).getByRole('button') as HTMLButtonElement;
}

function expectOneRovingButton(dayOfYear: number): HTMLButtonElement {
  const rovingButtons = screen.getAllByRole('button').filter(
    (button) => button.getAttribute('tabindex') === '0',
  );
  expect(rovingButtons).toHaveLength(1);
  const rovingButton = rovingButtons[0];
  if (!(rovingButton instanceof HTMLButtonElement)) {
    throw new Error(`Calendar grid roving target for day ${String(dayOfYear)} is not a button.`);
  }

  expect(rovingButton.closest('[data-calendar-day]')?.getAttribute('data-calendar-day')).toBe(String(dayOfYear));
  return rovingButton;
}

afterEach(() => {
  cleanup();
});

describe('CalendarCreatorGrid', () => {
  it('renders only the visible month, including its icon layers and note', () => {
    const { calendarDocument } = renderGrid();

    expect(calendarDocument.days).toHaveLength(10);
    expect(screen.getByRole('heading', { name: 'First' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Empty' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Third' })).toBeNull();
    expect(screen.queryByText(getCalendarCreatorCopy('en').noDates)).toBeNull();
    expect(screen.getAllByRole('gridcell')).toHaveLength(2);
    expect(screen.getByText('A note that stays visible in the day preview.')).toBeTruthy();
    expect(within(getDayCell(1)).getAllByRole('img')).toHaveLength(5);
    expect(queryDayCell(3)).toBeNull();
  });

  it('keeps full-year day numbers while rendering one later month', () => {
    const { calendarDocument } = renderGrid(createGridDocument(), false, 2);
    const dayThree = getDayCell(3);

    expect(calendarDocument.days.map((day) => day.dayOfYear)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(screen.getByRole('heading', { name: 'Third' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'First' })).toBeNull();
    expect(screen.getAllByRole('gridcell')).toHaveLength(8);
    expect(dayThree.getAttribute('aria-label')).toBe('Third · Day 1 · #3');
    expect(within(dayThree).getByText('1')).toBeTruthy();
    expect(getDayCell(10).getAttribute('aria-label')).toBe('Third · Day 8 · #10');
    expect(queryDayCell(1)).toBeNull();
    expect(queryDayCell(2)).toBeNull();
  });

  it('keeps the checkbox interaction separate from opening the day inspector', () => {
    const handlers = renderGrid();
    const dayOne = screen.getAllByRole('gridcell').find((cell) => cell.getAttribute('data-calendar-day') === '1');
    expect(dayOne).toBeTruthy();
    const checkbox = within(dayOne as HTMLElement).getByRole('checkbox');
    const dayButton = within(dayOne as HTMLElement).getByRole('button');

    fireEvent.click(checkbox);
    expect(handlers.onToggleDay).toHaveBeenCalledWith(1);
    expect(handlers.onEditDay).not.toHaveBeenCalled();

    fireEvent.click(dayButton);
    expect(handlers.onEditDay).toHaveBeenCalledWith(1);
  });

  it('shows mobile checkboxes only while mobile multi-select is active', () => {
    const firstHandlers = renderGrid(createGridDocument(), false);
    const hiddenCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    expect(hiddenCheckbox.className).not.toContain('mobileCheckboxVisible');
    expect(firstHandlers.onToggleDay).not.toHaveBeenCalled();

    cleanup();
    renderGrid(createGridDocument(), true);
    const visibleCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    expect(visibleCheckbox.className).toContain('mobileCheckboxVisible');
  });

  it('marks active and selected days in the DOM for keyboard and visual focus', () => {
    renderGrid();
    const gridCells = screen.getAllByRole('gridcell');
    const dayLabels = gridCells.map((cell) => cell.getAttribute('aria-label'));
    expect(new Set(dayLabels).size).toBe(gridCells.length);
    const dayOne = gridCells.find((cell) => cell.getAttribute('data-calendar-day') === '1');
    expect(dayOne).toBeTruthy();
    expect(dayOne?.getAttribute('data-active')).toBe('true');
    expect(dayOne?.getAttribute('data-selected')).toBe('true');
    expect(dayOne?.getAttribute('aria-current')).toBe('date');
    const dayButtons = screen.getAllByRole('button');
    expect(dayButtons.filter((button) => button.getAttribute('tabindex') === '0')).toHaveLength(1);
    expect(screen.getAllByRole('checkbox').every((checkbox) => checkbox.getAttribute('tabindex') === '-1')).toBe(true);
  });

  it('moves roving focus only inside the visible month, then handles Enter and Space', () => {
    const handlers = renderGrid(createGridDocument(), false, 2);
    const dayThreeButton = getDayButton(3);

    expect(dayThreeButton.tabIndex).toBe(0);
    fireEvent.keyDown(dayThreeButton, { key: 'ArrowLeft' });
    expect(queryDayCell(2)).toBeNull();
    expect(dayThreeButton.tabIndex).toBe(0);

    fireEvent.keyDown(dayThreeButton, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getDayButton(4));
    expect(getDayButton(4).tabIndex).toBe(0);

    fireEvent.keyDown(getDayButton(4), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(getDayButton(8));
    fireEvent.keyDown(getDayButton(8), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getDayButton(4));

    const daySixButton = getDayButton(6);
    daySixButton.focus();
    fireEvent.focus(daySixButton);
    fireEvent.keyDown(daySixButton, { key: 'ArrowUp' });
    expect(queryDayCell(2)).toBeNull();
    expect(daySixButton.tabIndex).toBe(0);

    fireEvent.keyDown(daySixButton, { key: 'Home' });
    expect(document.activeElement).toBe(getDayButton(3));
    fireEvent.keyDown(getDayButton(3), { key: 'End' });
    expect(document.activeElement).toBe(getDayButton(10));
    fireEvent.keyDown(getDayButton(10), { key: 'ArrowRight' });
    expect(queryDayCell(1)).toBeNull();
    expect(getDayButton(10).tabIndex).toBe(0);

    fireEvent.keyDown(getDayButton(10), { key: ' ' });
    expect(handlers.onToggleDay).toHaveBeenCalledWith(10);
    fireEvent.keyDown(getDayButton(10), { key: 'Enter' });
    expect(handlers.onEditDay).toHaveBeenCalledWith(10);
  });

  it.each([
    [-1, '-1'],
    [3, '3'],
    [1.5, '1.5'],
    [Number.NaN, 'NaN'],
    [Number.POSITIVE_INFINITY, 'Infinity'],
  ] as const)('rejects visible month index %s', (visibleMonthIndex, received) => {
    expect(() => renderGrid(createGridDocument(), false, visibleMonthIndex)).toThrow(
      `Calendar grid visibleMonthIndex must be a safe integer from 0 to 2. Received ${received}.`,
    );
  });

  it('preserves the empty-month message when the visible month has no dates', () => {
    renderGrid(createGridDocument(), false, 1);

    expect(screen.getByRole('heading', { name: 'Empty' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'First' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Third' })).toBeNull();
    expect(screen.getByText(getCalendarCreatorCopy('en').noDates)).toBeTruthy();
    expect(screen.getByText('Dawn')).toBeTruthy();
    expect(screen.queryAllByRole('gridcell')).toHaveLength(0);
    expect(screen.queryByRole('grid')).toBeNull();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('restores one roving tab stop after switching months', () => {
    const calendarDocument = createGridDocument();
    const selectedDayIds = [1, 3];
    const handlers = {
      onEditDay: vi.fn(),
      onToggleDay: vi.fn(),
    };
    const renderMonth = (visibleMonthIndex: number) => (
      <CalendarCreatorGrid
        activeDayId={1}
        document={calendarDocument}
        locale="en"
        mobileMultiSelect={false}
        onEditDay={handlers.onEditDay}
        onToggleDay={handlers.onToggleDay}
        selectedDayIds={selectedDayIds}
        visibleMonthIndex={visibleMonthIndex}
      />
    );
    const view = render(renderMonth(0));

    fireEvent.keyDown(getDayButton(1), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getDayButton(2));
    fireEvent.keyDown(getDayButton(2), { key: 'End' });
    expect(document.activeElement).toBe(getDayButton(2));
    fireEvent.keyDown(getDayButton(2), { key: 'ArrowDown' });
    expect(getDayButton(2).tabIndex).toBe(0);
    expect(queryDayCell(6)).toBeNull();

    view.rerender(renderMonth(1));
    expect(screen.getByRole('heading', { name: 'Empty' })).toBeTruthy();
    expect(screen.getByText(getCalendarCreatorCopy('en').noDates)).toBeTruthy();
    expect(screen.queryAllByRole('gridcell')).toHaveLength(0);
    expect(screen.queryByRole('grid')).toBeNull();

    view.rerender(renderMonth(2));
    const thirdMonthButton = expectOneRovingButton(3);
    thirdMonthButton.focus();
    fireEvent.focus(thirdMonthButton);
    fireEvent.keyDown(thirdMonthButton, { key: 'End' });
    expect(document.activeElement).toBe(getDayButton(10));
    fireEvent.keyDown(getDayButton(10), { key: 'Home' });
    expect(document.activeElement).toBe(getDayButton(3));
    expect(queryDayCell(1)).toBeNull();
    expect(screen.getAllByRole('gridcell')).toHaveLength(8);
    expect(screen.getAllByRole('button').filter((button) => button.getAttribute('tabindex') === '0')).toHaveLength(1);

    view.rerender(renderMonth(0));
    const firstMonthButton = expectOneRovingButton(1);
    fireEvent.keyDown(firstMonthButton, { key: 'End' });
    expect(document.activeElement).toBe(getDayButton(2));
    expect(queryDayCell(10)).toBeNull();
    expect(screen.getAllByRole('button').filter((button) => button.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('shows the same controlled selection again when its month is visible', () => {
    const calendarDocument = createGridDocument();
    const selectedDayIds = [1, 3];
    const renderMonth = (visibleMonthIndex: number) => (
      <CalendarCreatorGrid
        activeDayId={1}
        document={calendarDocument}
        locale="en"
        mobileMultiSelect={false}
        onEditDay={vi.fn()}
        onToggleDay={vi.fn()}
        selectedDayIds={selectedDayIds}
        visibleMonthIndex={visibleMonthIndex}
      />
    );
    const view = render(renderMonth(0));

    expect(getDayCell(1).getAttribute('data-selected')).toBe('true');
    expect(getDayCell(1).getAttribute('data-active')).toBe('true');
    expect(getDayCell(2).getAttribute('data-selected')).toBe('false');
    expect(queryDayCell(3)).toBeNull();

    view.rerender(renderMonth(2));
    expect(getDayCell(3).getAttribute('data-selected')).toBe('true');
    expect(getDayCell(3).getAttribute('data-active')).toBe('false');
    expect(queryDayCell(1)).toBeNull();
    expect(screen.getAllByRole('gridcell').every((cell) => cell.getAttribute('data-active') === 'false')).toBe(true);
    expectOneRovingButton(3);

    view.rerender(renderMonth(0));
    expect(getDayCell(1).getAttribute('data-selected')).toBe('true');
    expect(getDayCell(1).getAttribute('data-active')).toBe('true');
    expect(queryDayCell(3)).toBeNull();
    expect(selectedDayIds).toEqual([1, 3]);
    expect(calendarDocument.days.map((day) => day.dayOfYear)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expectOneRovingButton(1);
  });
});
