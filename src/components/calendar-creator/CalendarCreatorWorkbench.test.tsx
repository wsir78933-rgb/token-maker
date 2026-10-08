// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CalendarCreatorWorkbench } from './CalendarCreatorWorkbench';
import { createCalendar, createDefaultCalendarSettings } from '@/lib/calendar-creator/calendar';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { loadCalendarSaveSlot, saveCalendarSaveSlot } from '@/lib/calendar-creator/storage';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

function createCalendarFromQuickStart(locale: 'en' | 'zh' = 'en') {
  const copy = getCalendarCreatorCopy(locale);
  render(<CalendarCreatorWorkbench locale={locale} />);
  fireEvent.click(screen.getByRole('button', { name: copy.create }));
  return copy;
}

function toolbarStatus(): string {
  const status = document.querySelector('.calendar-creator-toolbar__status')?.textContent;
  if (status === undefined || status === null) {
    throw new Error('Expected the calendar toolbar status.');
  }

  return status;
}

function expectVisibleMonth(monthIndex: number): void {
  const months = document.querySelectorAll('[data-calendar-grid] [data-calendar-month]');
  expect(months).toHaveLength(1);
  expect(months[0]?.getAttribute('data-calendar-month')).toBe(String(monthIndex));
}

function requireGridDay(dayOfYear: number): HTMLElement {
  const day = document.querySelector(
    `[data-calendar-grid] [data-calendar-day="${String(dayOfYear)}"]`,
  );
  if (!(day instanceof HTMLElement)) {
    throw new Error(`Expected visible calendar day ${String(dayOfYear)}.`);
  }

  return day;
}

function selectVisibleMonth(
  copy: ReturnType<typeof getCalendarCreatorCopy>,
  monthIndex: number,
): void {
  fireEvent.change(screen.getByRole('combobox', { name: copy.monthJump }), {
    target: { value: String(monthIndex) },
  });
}

function applyFirstUnpressedIcon(): void {
  const inspector = screen.getByTestId('calendar-creator-day-inspector');
  const iconButton = within(inspector)
    .getAllByRole('button')
    .find((button) => button.getAttribute('aria-pressed') === 'false');
  if (!(iconButton instanceof HTMLButtonElement)) {
    throw new Error('Expected an unpressed manual icon button.');
  }

  fireEvent.click(iconButton);
}

describe('CalendarCreatorWorkbench', () => {
  it.each(['en', 'zh'] as const)('starts with quick start and creates a calendar in %s', (locale) => {
    const copy = getCalendarCreatorCopy(locale);
    render(<CalendarCreatorWorkbench locale={locale} />);

    expect(screen.getByRole('heading', { name: copy.createTitle })).toBeTruthy();
    expect(screen.queryByTestId('calendar-creator-grid')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: copy.create }));
    expect(screen.getByTestId('calendar-creator-workbench')).toBeTruthy();
    expectVisibleMonth(0);
    expect(document.querySelectorAll('[data-calendar-grid] [data-calendar-day]')).toHaveLength(30);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect(toolbarStatus()).toContain(`120 ${copy.daysUnit}`);
  });

  it('opens a day inspector from the date body while checkboxes only select', () => {
    const copy = createCalendarFromQuickStart();
    const firstDay = document.querySelector('[data-calendar-day="1"]');
    if (!(firstDay instanceof HTMLElement)) {
      throw new Error('Expected calendar day 1.');
    }

    const checkbox = within(firstDay).getByRole('checkbox');
    fireEvent.click(checkbox);
    expect((checkbox as HTMLInputElement).checked).toBe(true);

    fireEvent.click(within(firstDay).getByRole('button'));
    expect(screen.getByRole('button', { name: copy.clearManual })).toBeTruthy();
    expect(screen.getByPlaceholderText(copy.notePlaceholder)).toBeTruthy();
  });

  it('keeps one manual undo marker through clear and restores the cleared icon', () => {
    const copy = createCalendarFromQuickStart();
    const firstDay = document.querySelector('[data-calendar-day="1"]');
    if (!(firstDay instanceof HTMLElement)) {
      throw new Error('Expected calendar day 1.');
    }

    fireEvent.click(within(firstDay).getByRole('button'));
    const inspector = screen.getByTestId('calendar-creator-day-inspector');
    const iconButton = within(inspector)
      .getAllByRole('button')
      .find((button) => button.hasAttribute('aria-pressed'));
    if (!(iconButton instanceof HTMLButtonElement)) {
      throw new Error('Expected an ordinary icon button in the day inspector.');
    }

    fireEvent.click(iconButton);
    expect(iconButton.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(within(inspector).getByRole('button', { name: copy.clearManual }));
    expect(iconButton.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(within(inspector).getByRole('button', { name: copy.undoMarker }));
    expect(iconButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('keeps the phone inspector closed while selecting and opens it on finish', () => {
    const copy = createCalendarFromQuickStart();
    fireEvent.click(screen.getByRole('button', { name: copy.multiSelect }));

    const firstDay = document.querySelector('[data-calendar-day="1"]');
    const secondDay = document.querySelector('[data-calendar-day="2"]');
    if (!(firstDay instanceof HTMLElement) || !(secondDay instanceof HTMLElement)) {
      throw new Error('Expected calendar days 1 and 2.');
    }

    fireEvent.click(within(firstDay).getByRole('checkbox'));
    fireEvent.click(within(secondDay).getByRole('checkbox'));
    expect(screen.queryByTestId('calendar-creator-day-inspector')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: copy.finishSelection }));
    const inspector = screen.getByTestId('calendar-creator-day-inspector');
    expect(inspector).toBeTruthy();
    expect(within(inspector).getByText(`${copy.selectedDates}: 2`)).toBeTruthy();
  });

  it.each(['en', 'zh'] as const)('keeps help focused on local calendar guidance in %s', (locale) => {
    const copy = createCalendarFromQuickStart(locale);

    fireEvent.click(screen.getByRole('button', { name: copy.help }));
    const helpPanel = screen.getByRole('complementary', { name: copy.help });
    expect(within(helpPanel).getByText(copy.localNotice)).toBeTruthy();
    expect(within(helpPanel).queryByRole('link')).toBeNull();
    expect(within(helpPanel).queryByText(/Timeline tool|时间线工具/)).toBeNull();

    fireEvent.click(within(helpPanel).getByRole('button', { name: copy.close }));
    expect(screen.queryByRole('complementary', { name: copy.help })).toBeNull();
  });

  it('saves the first calendar to a selected local slot and then updates the bound slot directly', () => {
    const copy = createCalendarFromQuickStart();
    fireEvent.click(screen.getByRole('button', { name: copy.save }));

    const dialog = screen.getByRole('dialog');
    const slotOne = within(dialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(slotOne instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }

    fireEvent.click(within(slotOne).getByRole('button', { name: copy.saveHere }));
    expect(window.localStorage.getItem('tokenmaker.calendar-creator.saves')).toContain('2000');
    expect(loadCalendarSaveSlot(window.localStorage, 1).days).toHaveLength(120);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: new RegExp(copy.updateCurrent) })).toBeTruthy();
  });

  it('opens an existing local save directly from the initial quick start', () => {
    const settings = createDefaultCalendarSettings();
    saveCalendarSaveSlot(window.localStorage, 1, createCalendar(settings, () => 0));
    const copy = getCalendarCreatorCopy('en');

    render(<CalendarCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: copy.archives }));

    const dialog = screen.getByRole('dialog');
    const slotOne = within(dialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(slotOne instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }

    fireEvent.click(within(slotOne).getByRole('button', { name: copy.open }));
    expectVisibleMonth(0);
    expect(document.querySelectorAll('[data-calendar-grid] [data-calendar-day]')).toHaveLength(30);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect(loadCalendarSaveSlot(window.localStorage, 1).days).toHaveLength(120);
    expect(toolbarStatus()).toContain(`120 ${copy.daysUnit}`);
    expect(screen.getByRole('button', { name: new RegExp(copy.updateCurrent) })).toBeTruthy();
  });

  it.each(['en', 'zh'] as const)('shows one month and moves with the month controls in %s', (locale) => {
    const copy = createCalendarFromQuickStart(locale);
    const monthSelect = screen.getByRole('combobox', { name: copy.monthJump });
    const previousMonth = screen.getByRole('button', { name: copy.previousMonth });
    const nextMonth = screen.getByRole('button', { name: copy.nextMonth });
    const returnButton = screen.getByRole('button', { name: copy.returnToSettings });

    expectVisibleMonth(0);
    expect(document.querySelectorAll('[data-calendar-print-month]')).toHaveLength(4);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect((monthSelect as HTMLSelectElement).value).toBe('0');
    expect((monthSelect as HTMLSelectElement).options).toHaveLength(4);
    expect((previousMonth as HTMLButtonElement).disabled).toBe(true);
    expect((nextMonth as HTMLButtonElement).disabled).toBe(false);
    expect(returnButton.textContent).toBe('');

    selectVisibleMonth(copy, 2);
    expect((monthSelect as HTMLSelectElement).value).toBe('2');
    expectVisibleMonth(2);
    expect(requireGridDay(61).textContent).toBeTruthy();
    expect(document.querySelector('[data-calendar-grid] [data-calendar-day="1"]')).toBeNull();

    fireEvent.click(nextMonth);
    expect((monthSelect as HTMLSelectElement).value).toBe('3');
    expectVisibleMonth(3);
    expect((screen.getByRole('button', { name: copy.nextMonth }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('textbox', { name: copy.year }) as HTMLInputElement).value).toBe('2000');

    fireEvent.click(screen.getByRole('button', { name: copy.previousMonth }));
    expect((monthSelect as HTMLSelectElement).value).toBe('2');
    expectVisibleMonth(2);
    expect(toolbarStatus()).toContain(`120 ${copy.daysUnit}`);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
  });

  it('keeps notes, icons, and selected dates when the visible month changes', () => {
    const copy = createCalendarFromQuickStart();
    const firstDay = requireGridDay(1);
    fireEvent.click(within(firstDay).getByRole('checkbox'));
    fireEvent.click(within(firstDay).getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText(copy.notePlaceholder), {
      target: { value: 'Kept on month one' },
    });
    applyFirstUnpressedIcon();

    expect((within(requireGridDay(1)).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    expect(requireGridDay(1).textContent).toContain('Kept on month one');
    expect(within(requireGridDay(1)).getAllByRole('img')).toHaveLength(1);
    expect(toolbarStatus()).toContain(copy.unsaved);

    selectVisibleMonth(copy, 2);
    expect(document.querySelector('[data-calendar-grid] [data-calendar-day="1"]')).toBeNull();
    const laterDay = requireGridDay(61);
    fireEvent.click(within(laterDay).getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText(copy.notePlaceholder), {
      target: { value: 'Kept on month three' },
    });
    fireEvent.click(within(requireGridDay(61)).getByRole('checkbox'));

    expect(document.querySelector('.calendar-creator-mobile-actions')?.textContent).toContain(
      `${copy.selectedDates}: 2`,
    );
    selectVisibleMonth(copy, 0);
    expect((within(requireGridDay(1)).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    expect(requireGridDay(1).textContent).toContain('Kept on month one');
    expect(within(requireGridDay(1)).getAllByRole('img')).toHaveLength(1);

    selectVisibleMonth(copy, 2);
    expect((within(requireGridDay(61)).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    expect(requireGridDay(61).textContent).toContain('Kept on month three');
    expect(toolbarStatus()).toContain(copy.unsaved);
    expect(toolbarStatus()).toContain(`120 ${copy.daysUnit}`);
    expect((screen.getByRole('textbox', { name: copy.year }) as HTMLInputElement).value).toBe('2000');
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
  });

  it('applies and undoes a manual icon across months without dropping the year', () => {
    const copy = createCalendarFromQuickStart();
    fireEvent.click(within(requireGridDay(1)).getByRole('checkbox'));
    selectVisibleMonth(copy, 1);
    const secondMonthDay = requireGridDay(31);
    fireEvent.click(within(secondMonthDay).getByRole('checkbox'));
    fireEvent.click(within(secondMonthDay).getByRole('button'));
    applyFirstUnpressedIcon();

    expect(within(requireGridDay(31)).getAllByRole('img')).toHaveLength(1);
    selectVisibleMonth(copy, 0);
    expect(within(requireGridDay(1)).getAllByRole('img')).toHaveLength(1);
    expect((within(requireGridDay(1)).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: copy.undoMarker }));
    expect(within(requireGridDay(1)).queryAllByRole('img')).toHaveLength(0);
    expect((within(requireGridDay(1)).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    selectVisibleMonth(copy, 1);
    expect(within(requireGridDay(31)).queryAllByRole('img')).toHaveLength(0);
    expect((within(requireGridDay(31)).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    expect(document.querySelector('.calendar-creator-mobile-actions')?.textContent).toContain(
      `${copy.selectedDates}: 2`,
    );
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect(toolbarStatus()).toContain(`120 ${copy.daysUnit}`);
  });

  it('saves every day after the visible month changes', () => {
    const copy = createCalendarFromQuickStart();
    selectVisibleMonth(copy, 3);
    fireEvent.click(screen.getByRole('button', { name: copy.save }));

    const dialog = screen.getByRole('dialog');
    const slotOne = within(dialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(slotOne instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }

    fireEvent.click(within(slotOne).getByRole('button', { name: copy.saveHere }));
    expect(loadCalendarSaveSlot(window.localStorage, 1).days).toHaveLength(120);
    expectVisibleMonth(3);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect(toolbarStatus()).toContain(copy.saved);
    expect(toolbarStatus()).toContain(`120 ${copy.daysUnit}`);

    fireEvent.click(screen.getByRole('button', { name: copy.archives }));
    const archivesDialog = screen.getByRole('dialog');
    const savedSlot = within(archivesDialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(savedSlot instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }
    fireEvent.click(within(savedSlot).getByRole('button', { name: copy.open }));
    expectVisibleMonth(0);
    expect(document.querySelectorAll('[data-calendar-grid] [data-calendar-day]')).toHaveLength(30);
    expect(loadCalendarSaveSlot(window.localStorage, 1).days).toHaveLength(120);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
  });
});
