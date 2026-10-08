// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CalendarCreatorGuardDialog } from './CalendarCreatorGuardDialog';
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

function createSlots(): Array<CalendarSaveRecord | null> {
  return [createSavedRecord(2000), null, null, null];
}

afterEach(() => {
  cleanup();
});

describe('CalendarCreatorGuardDialog', () => {
  it('excludes the protected source slot from save-and-continue', () => {
    const copy = getCalendarCreatorCopy('en');

    render(
      <CalendarCreatorGuardDialog
        copy={copy}
        open
        slots={createSlots()}
        sourceSlot={1}
        title={copy.unsavedTitle}
        description={copy.unsavedDescription}
        actionError={null}
        actionErrorKind={null}
        onOpenChange={vi.fn()}
        onCancel={vi.fn()}
        onDiscard={vi.fn()}
        onSaveContinue={vi.fn()}
      />,
    );

    const saveButtons = screen.getAllByRole('button', { name: copy.saveContinue });
    expect((saveButtons[0] as HTMLButtonElement).disabled).toBe(true);
    expect((saveButtons[1] as HTMLButtonElement).disabled).toBe(false);
  });

  it('requests empty save-and-continue and confirms occupied replacement', () => {
    const copy = getCalendarCreatorCopy('zh');
    const onSaveContinue = vi.fn();

    render(
      <CalendarCreatorGuardDialog
        copy={copy}
        open
        slots={createSlots()}
        sourceSlot={null}
        title={copy.unsavedTitle}
        description={copy.unsavedDescription}
        actionError={null}
        actionErrorKind={null}
        onOpenChange={vi.fn()}
        onCancel={vi.fn()}
        onDiscard={vi.fn()}
        onSaveContinue={onSaveContinue}
      />,
    );

    const saveButtons = screen.getAllByRole('button', { name: copy.saveContinue });
    fireEvent.click(saveButtons[1]);
    expect(onSaveContinue).toHaveBeenCalledWith(2);

    fireEvent.click(saveButtons[0]);
    expect(screen.getByRole('alertdialog', { name: copy.overwriteTitle })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.confirmOverwrite }));
    expect(onSaveContinue).toHaveBeenLastCalledWith(1);
  });

  it('keeps a visible action error inside the guard', () => {
    const copy = getCalendarCreatorCopy('en');

    render(
      <CalendarCreatorGuardDialog
        copy={copy}
        open
        slots={createSlots()}
        sourceSlot={null}
        title={copy.unsavedTitle}
        description={copy.unsavedDescription}
        actionError="storage blocked"
        actionErrorKind="save"
        onOpenChange={vi.fn()}
        onCancel={vi.fn()}
        onDiscard={vi.fn()}
        onSaveContinue={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert').textContent).toContain('storage blocked');
  });
});
