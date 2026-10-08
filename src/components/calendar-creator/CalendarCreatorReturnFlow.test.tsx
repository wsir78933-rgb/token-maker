// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CalendarCreatorWorkbench } from './CalendarCreatorWorkbench';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { loadCalendarSaveSlot } from '@/lib/calendar-creator/storage';

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

function openReturnSettings(copy: ReturnType<typeof getCalendarCreatorCopy>): void {
  fireEvent.click(screen.getByRole('button', { name: copy.returnToSettings }));
  expect(screen.getByRole('heading', { name: copy.editSettingsTitle })).toBeTruthy();
}

function findManualIconButton(container: HTMLElement, pressed: boolean): HTMLButtonElement {
  const matchingButton = within(container)
    .getAllByRole('button')
    .find((button) => button.hasAttribute('aria-pressed') && button.getAttribute('aria-pressed') === String(pressed));
  if (!(matchingButton instanceof HTMLButtonElement)) {
    throw new Error(`Expected a manual icon button with pressed=${String(pressed)}.`);
  }

  return matchingButton;
}

describe('CalendarCreatorWorkbench return settings flow', () => {
  it.each(['en', 'zh'] as const)('opens and closes return settings in %s', (locale) => {
    const copy = createCalendarFromQuickStart(locale);

    openReturnSettings(copy);
    expect(screen.getByDisplayValue('2000')).toBeTruthy();
    expect(screen.queryByRole('button', { name: copy.archives })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: copy.resumeCalendar }));
    expect(document.querySelector('[data-calendar-grid]')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: copy.editSettingsTitle })).toBeNull();
    expect(screen.getByRole('button', { name: copy.archives })).toBeTruthy();
  });

  it.each(['en', 'zh'] as const)('keeps the archives entry on the initial quick start in %s', (locale) => {
    const copy = getCalendarCreatorCopy(locale);
    render(<CalendarCreatorWorkbench locale={locale} />);

    expect(screen.getByRole('button', { name: copy.archives })).toBeTruthy();
  });

  it('round-trips a negative year, zero-day month rules, and a seven-day week', () => {
    const copy = createCalendarFromQuickStart();
    openReturnSettings(copy);

    fireEvent.change(screen.getByLabelText(copy.year), { target: { value: '-17' } });
    fireEvent.change(screen.getByLabelText(copy.uniformDays), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: copy.fillAllMonths }));
    fireEvent.change(screen.getByRole('spinbutton', { name: copy.weekdayCount }), {
      target: { value: '7' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateCalendar }));

    expect(screen.getByRole('heading', { name: copy.regenerateTitle })).toBeTruthy();
    expect(screen.getByRole('button', { name: copy.regenerateConfirm })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: copy.saveContinue })).toHaveLength(4);

    fireEvent.click(screen.getByRole('button', { name: copy.regenerateConfirm }));
    expect(screen.getByDisplayValue('-17')).toBeTruthy();
    expect(document.querySelector('.calendar-creator-toolbar__status')?.textContent).toContain(
      `0 ${copy.daysUnit}`,
    );

    openReturnSettings(copy);
    expect(screen.getByDisplayValue('-17')).toBeTruthy();
    expect(screen.getByDisplayValue('0')).toBeTruthy();
    expect(screen.getByDisplayValue('7')).toBeTruthy();
  });

  it('keeps the return draft and calendar editing state when regeneration is cancelled', () => {
    const copy = createCalendarFromQuickStart();
    const firstDay = document.querySelector('[data-calendar-day="1"]');
    if (!(firstDay instanceof HTMLElement)) {
      throw new Error('Expected calendar day 1.');
    }

    fireEvent.click(within(firstDay).getByRole('button'));
    let inspector = screen.getByTestId('calendar-creator-day-inspector');
    fireEvent.change(screen.getByPlaceholderText(copy.notePlaceholder), {
      target: { value: 'Keep this note' },
    });
    fireEvent.click(findManualIconButton(inspector, false));

    fireEvent.click(screen.getByRole('button', { name: copy.save }));
    const saveDialog = screen.getByRole('dialog');
    const slotOne = within(saveDialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(slotOne instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }
    fireEvent.click(within(slotOne).getByRole('button', { name: copy.saveHere }));

    inspector = screen.getByTestId('calendar-creator-day-inspector');
    fireEvent.click(findManualIconButton(inspector, false));
    fireEvent.click(within(firstDay).getByRole('checkbox'));
    const secondDay = document.querySelector('[data-calendar-day="2"]');
    if (!(secondDay instanceof HTMLElement)) {
      throw new Error('Expected calendar day 2.');
    }
    fireEvent.click(within(secondDay).getByRole('checkbox'));
    openReturnSettings(copy);
    fireEvent.change(screen.getByLabelText(copy.year), { target: { value: '-17' } });
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateCalendar }));
    fireEvent.click(screen.getByRole('button', { name: copy.cancel }));

    expect(screen.getByRole('heading', { name: copy.editSettingsTitle })).toBeTruthy();
    expect(screen.getByDisplayValue('-17')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.resumeCalendar }));

    expect(screen.getByRole('button', { name: new RegExp(copy.updateCurrent) })).toBeTruthy();
    expect(screen.getAllByRole('status').some((statusElement) =>
      statusElement.textContent?.includes(copy.unsaved),
    )).toBe(true);
    inspector = screen.getByTestId('calendar-creator-day-inspector');
    fireEvent.click(within(inspector).getByRole('tab', { name: copy.dayNotes }));
    const preservedNoteInput = within(inspector).getByPlaceholderText(copy.notePlaceholder);
    expect((preservedNoteInput as HTMLTextAreaElement).value).toBe('Keep this note');
    expect(inspector.textContent).toContain(copy.selectedDates);
    expect(inspector.textContent).toContain('2');
    expect(screen.getByRole('button', { name: copy.undoMarker })).toBeTruthy();
    fireEvent.click(within(inspector).getByRole('tab', { name: new RegExp(copy.manualIcon) }));
    expect(findManualIconButton(inspector, true)).toBeTruthy();
  });

  it('requires regeneration confirmation even when the current calendar is clean', () => {
    const copy = createCalendarFromQuickStart();
    fireEvent.click(screen.getByRole('button', { name: copy.save }));
    const saveDialog = screen.getByRole('dialog');
    const slotOne = within(saveDialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(slotOne instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }
    fireEvent.click(within(slotOne).getByRole('button', { name: copy.saveHere }));

    openReturnSettings(copy);
    fireEvent.change(screen.getByLabelText(copy.year), { target: { value: '-17' } });
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateCalendar }));

    expect(screen.getByRole('heading', { name: copy.regenerateTitle })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.cancel }));
    expect(screen.getByRole('heading', { name: copy.editSettingsTitle })).toBeTruthy();
  });

  it('saves the old document before regeneration and keeps the archive intact', () => {
    const copy = createCalendarFromQuickStart();
    fireEvent.click(screen.getByRole('button', { name: copy.save }));
    const saveDialog = screen.getByRole('dialog');
    const slotOne = within(saveDialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(slotOne instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }
    fireEvent.click(within(slotOne).getByRole('button', { name: copy.saveHere }));

    openReturnSettings(copy);
    fireEvent.change(screen.getByLabelText(copy.uniformDays), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: copy.fillAllMonths }));
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateCalendar }));
    const saveContinueButtons = screen.getAllByRole('button', { name: copy.saveContinue });
    fireEvent.click(saveContinueButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: copy.confirmOverwrite }));

    const savedDocument = loadCalendarSaveSlot(window.localStorage, 1);
    expect(savedDocument.days).toHaveLength(120);
    expect(savedDocument.settings.year).toBe(2000);
    expect(document.querySelector('.calendar-creator-toolbar__status')?.textContent).toContain(
      `0 ${copy.daysUnit}`,
    );
    expect(screen.getByRole('button', { name: copy.save })).toBeTruthy();
  });

  it('keeps the return page and old document visible after a save failure', () => {
    const copy = createCalendarFromQuickStart();
    fireEvent.click(screen.getByRole('button', { name: copy.save }));
    const saveDialog = screen.getByRole('dialog');
    const slotOne = within(saveDialog).getByText(`${copy.slot} 1`).closest('[data-calendar-save-slot]');
    if (!(slotOne instanceof HTMLElement)) {
      throw new Error('Expected save slot 1.');
    }
    fireEvent.click(within(slotOne).getByRole('button', { name: copy.saveHere }));

    openReturnSettings(copy);
    fireEvent.change(screen.getByLabelText(copy.year), { target: { value: '-17' } });
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateCalendar }));

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    fireEvent.click(screen.getAllByRole('button', { name: copy.saveContinue })[1]);

    expect(screen.getByTestId('calendar-creator-quick-start')).toBeTruthy();
    const returnYearInput = document.querySelector('#calendar-quick-start-year');
    if (!(returnYearInput instanceof HTMLInputElement)) {
      throw new Error('Expected the return settings year input.');
    }
    expect(returnYearInput.value).toBe('-17');
    expect(screen.getByRole('alert').textContent).toContain('quota exceeded');
    expect(document.querySelector('[data-calendar-grid]')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: copy.cancel }));
    fireEvent.click(screen.getByRole('button', { name: copy.resumeCalendar }));
    const resumedYearInput = screen.getByRole('textbox', { name: copy.year });
    expect((resumedYearInput as HTMLInputElement).value).toBe('2000');
    expect(document.querySelectorAll('[data-calendar-grid] [data-calendar-month]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect(loadCalendarSaveSlot(window.localStorage, 1).days).toHaveLength(120);
    expect(screen.getByRole('button', { name: new RegExp(copy.updateCurrent) })).toBeTruthy();
    expect(document.querySelector('.calendar-creator-toolbar__status')?.textContent).toContain(
      `120 ${copy.daysUnit}`,
    );
    expect(document.querySelector('.calendar-creator-toolbar__status')?.textContent).toContain(copy.slot);
  });

  it.each(['en', 'zh'] as const)('keeps the current month when returning from settings in %s', (locale) => {
    const copy = createCalendarFromQuickStart(locale);
    fireEvent.change(screen.getByRole('combobox', { name: copy.monthJump }), {
      target: { value: '2' },
    });
    const visibleDay = document.querySelector('[data-calendar-grid] [data-calendar-day="61"]');
    if (!(visibleDay instanceof HTMLElement)) {
      throw new Error('Expected calendar day 61 in month 3.');
    }

    fireEvent.click(within(visibleDay).getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText(copy.notePlaceholder), {
      target: { value: 'Stay on this month' },
    });
    openReturnSettings(copy);
    expect(document.querySelector('[data-calendar-grid]')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: copy.resumeCalendar }));
    const visibleMonth = document.querySelector('[data-calendar-grid] [data-calendar-month]');
    expect(visibleMonth?.getAttribute('data-calendar-month')).toBe('2');
    expect(document.querySelectorAll('[data-calendar-grid] [data-calendar-month]')).toHaveLength(1);
    expect(document.querySelector('[data-calendar-grid]')?.textContent).toContain('Stay on this month');
    expect((screen.getByRole('combobox', { name: copy.monthJump }) as HTMLSelectElement).value).toBe('2');
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(120);
    expect(document.querySelector('.calendar-creator-toolbar__status')?.textContent).toContain(
      `120 ${copy.daysUnit}`,
    );
  });

  it('clamps the visible month when regeneration removes later months', () => {
    const copy = createCalendarFromQuickStart();
    fireEvent.change(screen.getByRole('combobox', { name: copy.monthJump }), {
      target: { value: '3' },
    });
    openReturnSettings(copy);
    fireEvent.change(screen.getByRole('spinbutton', { name: copy.monthCount }), {
      target: { value: '2' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateCalendar }));
    fireEvent.click(screen.getByRole('button', { name: copy.regenerateConfirm }));

    const visibleMonths = document.querySelectorAll('[data-calendar-grid] [data-calendar-month]');
    expect(visibleMonths).toHaveLength(1);
    expect(visibleMonths[0]?.getAttribute('data-calendar-month')).toBe('1');
    expect(document.querySelector('[data-calendar-grid] [data-calendar-day="31"]')).toBeTruthy();
    expect(document.querySelector('[data-calendar-grid] [data-calendar-day="1"]')).toBeNull();
    expect((screen.getByRole('button', { name: copy.nextMonth }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: copy.previousMonth }) as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole('textbox', { name: copy.year }) as HTMLInputElement).value).toBe('2000');
    expect(document.querySelector('.calendar-creator-toolbar__status')?.textContent).toContain(
      `60 ${copy.daysUnit}`,
    );
    expect(document.querySelectorAll('[data-calendar-print-month]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-calendar-print-day]')).toHaveLength(60);
  });
});
