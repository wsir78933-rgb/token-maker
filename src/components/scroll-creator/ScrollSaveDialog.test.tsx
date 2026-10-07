// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { createDefaultScrollProject } from '@/lib/scroll-creator/project';
import type { ScrollSaveSlot } from '@/lib/scroll-creator/storage';

import { ScrollSaveDialog } from './ScrollSaveDialog';

afterEach(cleanup);

function createSlots(filledSlotNumbers: readonly number[] = []): ScrollSaveSlot[] {
  return Array.from({ length: 4 }, (_, index) => {
    const slot = index + 1;
    return {
      slot: slot as 1 | 2 | 3 | 4,
      savedAt: filledSlotNumbers.includes(slot) ? '2026-10-06T00:00:00.000Z' : null,
      project: filledSlotNumbers.includes(slot) ? createDefaultScrollProject() : null,
    };
  });
}

describe('ScrollSaveDialog', () => {
  it('renders four slots and disables loading empty slots', () => {
    const copy = getScrollCreatorCopy('en');
    render(
      <ScrollSaveDialog
        copy={copy}
        mode="load"
        open
        slots={createSlots([1])}
        busy={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onLoad={vi.fn()}
      />,
    );

    expect(document.querySelectorAll('[data-scroll-save-slot]')).toHaveLength(4);
    const loadButtons = screen.getAllByRole('button', { name: copy.loadHere });
    expect(loadButtons).toHaveLength(4);
    expect((loadButtons[0] as HTMLButtonElement).disabled).toBe(false);
    expect((loadButtons[1] as HTMLButtonElement).disabled).toBe(true);
  });

  it('calls save for a chosen slot and load only for a filled slot', () => {
    const copy = getScrollCreatorCopy('zh');
    const handlers = { onClose: vi.fn(), onSave: vi.fn(), onLoad: vi.fn() };
    render(
      <ScrollSaveDialog copy={copy} mode="save" open slots={createSlots([2])} busy={false} {...handlers} />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: copy.saveHere })[0]);
    expect(handlers.onSave).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getAllByRole('button', { name: copy.loadHere })[1]);
    expect(handlers.onLoad).toHaveBeenCalledWith(2);
  });

  it('closes from the accessible close button and keeps actions disabled while busy', () => {
    const copy = getScrollCreatorCopy('en');
    const handlers = { onClose: vi.fn(), onSave: vi.fn(), onLoad: vi.fn() };
    render(
      <ScrollSaveDialog copy={copy} mode="load" open slots={createSlots([1])} busy {...handlers} />,
    );

    expect((screen.getAllByRole('button', { name: copy.saveHere })[0] as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getAllByRole('button', { name: copy.loadHere })[0] as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: copy.closeDialog }));
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('fails fast when the caller supplies a slot array with the wrong length', () => {
    const copy = getScrollCreatorCopy('en');
    expect(() =>
      render(
        <ScrollSaveDialog
          copy={copy}
          mode="save"
          open
          slots={createSlots().slice(0, 3)}
          busy={false}
          onClose={vi.fn()}
          onSave={vi.fn()}
          onLoad={vi.fn()}
        />,
      ),
    ).toThrow('Scroll save slots must contain 4 entries. Received 3.');
  });
});
