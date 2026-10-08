// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CalendarCreatorSaveSlotsDialog } from './CalendarCreatorSaveSlotsDialog';
import { createCalendar, createDefaultCalendarSettings } from '@/lib/calendar-creator/calendar';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import type { CalendarSaveRecord } from '@/lib/calendar-creator/types';

function createSavedRecord(year: number): CalendarSaveRecord {
  const settings = createDefaultCalendarSettings();
  settings.year = year;
  return {
    version: 1,
    savedAt: '2026-10-06T00:00:00.000Z',
    document: createCalendar(settings, () => 0),
  };
}

function createSlots(filledSlotNumbers: readonly number[] = []): Array<CalendarSaveRecord | null> {
  return Array.from({ length: 4 }, (_, index) =>
    filledSlotNumbers.includes(index + 1) ? createSavedRecord(2000 + index) : null,
  );
}

afterEach(() => {
  cleanup();
});

describe('CalendarCreatorSaveSlotsDialog', () => {
  it('renders four slots, disables the source target, and keeps empty opens disabled', () => {
    const copy = getCalendarCreatorCopy('en');

    render(
      <CalendarCreatorSaveSlotsDialog
        copy={copy}
        open
        mode="manage"
        slots={createSlots([1])}
        sourceSlot={1}
        errorKind={null}
        errorMessage={null}
        statusMessage={null}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        onLoad={vi.fn()}
      />,
    );

    expect(document.querySelectorAll('[data-calendar-save-slot]')).toHaveLength(4);
    const firstSlot = document.querySelector('[data-calendar-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) {
      throw new Error('Expected source slot 1.');
    }

    expect(within(firstSlot).getByRole('button', { name: copy.updateCurrent })).toBeTruthy();
    const secondSlot = document.querySelector('[data-calendar-save-slot="2"]');
    if (!(secondSlot instanceof HTMLElement)) {
      throw new Error('Expected empty slot 2.');
    }
    expect((within(secondSlot).getByRole('button', { name: copy.open }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('saves empty slots immediately and confirms occupied replacement', () => {
    const copy = getCalendarCreatorCopy('en');
    const onSave = vi.fn();

    render(
      <CalendarCreatorSaveSlotsDialog
        copy={copy}
        open
        mode="save"
        slots={createSlots([1])}
        sourceSlot={null}
        errorKind={null}
        errorMessage={null}
        statusMessage={null}
        onOpenChange={vi.fn()}
        onSave={onSave}
        onLoad={vi.fn()}
      />,
    );

    const emptySlot = document.querySelector('[data-calendar-save-slot="2"]');
    if (!(emptySlot instanceof HTMLElement)) {
      throw new Error('Expected empty slot 2.');
    }

    fireEvent.click(within(emptySlot).getByRole('button', { name: copy.saveHere }));
    expect(onSave).toHaveBeenCalledWith(2);

    const occupiedSlot = document.querySelector('[data-calendar-save-slot="1"]');
    if (!(occupiedSlot instanceof HTMLElement)) {
      throw new Error('Expected occupied slot 1.');
    }

    fireEvent.click(within(occupiedSlot).getByRole('button', { name: copy.saveAsHere }));
    expect(screen.getByRole('alertdialog', { name: copy.overwriteTitle })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.confirmOverwrite }));
    expect(onSave).toHaveBeenLastCalledWith(1);
  });

  it('shows storage failures and status messages without hiding the slot list', () => {
    const copy = getCalendarCreatorCopy('zh');

    render(
      <CalendarCreatorSaveSlotsDialog
        copy={copy}
        open
        mode="manage"
        slots={createSlots()}
        sourceSlot={null}
        errorKind="load"
        errorMessage="storage blocked"
        statusMessage="saved"
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        onLoad={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert').textContent).toContain('storage blocked');
    expect(screen.getByRole('alert').textContent).toContain(copy.loadFailed);
    expect(screen.getByRole('status').textContent).toContain('saved');
    expect(document.querySelectorAll('[data-calendar-save-slot]')).toHaveLength(4);
  });
});
