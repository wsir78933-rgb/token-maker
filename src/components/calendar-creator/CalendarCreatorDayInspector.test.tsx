// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCalendar } from '@/lib/calendar-creator/calendar';
import type { CalendarDocument } from '@/lib/calendar-creator/types';
import { CalendarCreatorDayInspector } from './CalendarCreatorDayInspector';

function createInspectorDocument(): CalendarDocument {
  return createCalendar(
    {
      year: 2000,
      months: [{ name: 'First', dayCount: 8 }],
      weekdayNames: ['One', 'Two', 'Three'],
      startWeekdayIndex: 0,
      moonCycles: { white: 4, blue: null, red: null },
      disasterProbability: 100,
    },
    () => 0,
  );
}

function renderInspector(overrides: Partial<ComponentProps<typeof CalendarCreatorDayInspector>> = {}) {
  const document = createInspectorDocument();
  const props: ComponentProps<typeof CalendarCreatorDayInspector> = {
    locale: 'en',
    document,
    activeDayId: 1,
    selectedDayIds: [1],
    onChangeNote: vi.fn(),
    onApplyIcon: vi.fn(),
    onClearSelection: vi.fn(),
    onUndo: vi.fn(),
    canUndo: false,
    onClose: vi.fn(),
    ...overrides,
  };

  render(<CalendarCreatorDayInspector {...props} />);
  return { document, props };
}

describe('CalendarCreatorDayInspector', () => {
  afterEach(cleanup);

  it('keeps the day note editable and reports automatic layers separately', () => {
    const onChangeNote = vi.fn();
    const { document: calendarDocument } = renderInspector({ onChangeNote });

    const noteInput = screen.getByRole('textbox', { name: 'Day notes' });
    fireEvent.change(noteInput, { target: { value: 'Market day' } });

    expect(onChangeNote).toHaveBeenCalledWith(1, 'Market day');
    expect(screen.getByRole('heading', { name: 'Automatic layers' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Manual icon' })).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(78);
    expect(calendarDocument.days[0]?.moonIcons.white).not.toBeNull();
    expect(globalThis.document.querySelectorAll('img').length).toBeGreaterThanOrEqual(2);
  });

  it('switches to batch mode, applies icons directly, and preserves selected dates', () => {
    const onApplyIcon = vi.fn();
    const onClearSelection = vi.fn();
    const onClose = vi.fn();
    renderInspector({
      selectedDayIds: [1, 3],
      onApplyIcon,
      onClearSelection,
      onClose,
    });

    const batchTab = screen.getByRole('tab', { name: /Manual icon/ });
    expect(batchTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Selected dates: 2')).toBeTruthy();
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(batchTab.id);

    fireEvent.click(screen.getByRole('button', { name: 'Calendar icon 32' }));
    expect(onApplyIcon).toHaveBeenCalledWith(32);
    expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onClearSelection).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus across tabs with arrows and Home/End while preserving tab semantics', () => {
    renderInspector({ selectedDayIds: [1, 3] });

    const noteTab = screen.getByRole('tab', { name: 'Day notes' });
    const batchTab = screen.getByRole('tab', { name: /Manual icon/ });

    noteTab.focus();
    fireEvent.keyDown(noteTab, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(batchTab);
    expect(batchTab.getAttribute('aria-selected')).toBe('true');
    expect(batchTab.tabIndex).toBe(0);
    expect(noteTab.tabIndex).toBe(-1);

    fireEvent.keyDown(batchTab, { key: 'Home' });
    expect(document.activeElement).toBe(noteTab);
    expect(noteTab.getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(noteTab, { key: 'End' });
    expect(document.activeElement).toBe(batchTab);

    fireEvent.keyDown(batchTab, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(noteTab);
  });

  it('clears the manual layer and only enables undo when the parent reports it', () => {
    const onApplyIcon = vi.fn();
    const onUndo = vi.fn();
    const { props } = renderInspector({ onApplyIcon, onUndo, canUndo: true });

    fireEvent.click(screen.getByRole('button', { name: 'Clear manual icon' }));
    expect(onApplyIcon).toHaveBeenCalledWith(null);
    fireEvent.click(screen.getByRole('button', { name: 'Undo marker' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(props.document.days[0]?.moonIcons.white).not.toBeNull();
  });

  it('uses the public dialog wrapper on a mobile viewport and closes through its control', () => {
    const originalMatchMedia = window.matchMedia;
    const onClose = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    try {
      renderInspector({ onClose });
      expect(screen.getByRole('dialog')).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });
});
