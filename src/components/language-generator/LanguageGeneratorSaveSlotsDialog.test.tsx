// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  LanguageGeneratorSaveSlotsDialog,
} from '@/components/language-generator/LanguageGeneratorSaveSlotsDialog';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import type { LanguageRules } from '@/lib/language-generator/types';

function createLanguageRules(): LanguageRules {
  return {
    characters: Array.from({ length: 26 }, (_, index) => ({
      source: String.fromCharCode(65 + index),
      target: '',
    })),
    combinations: Array.from({ length: 26 }, (_, index) => ({
      source: `C${String(index + 1).padStart(2, '0')}`,
      target: '',
    })),
  };
}

function createSaveSlots(filledSlotNumbers: readonly number[] = []): Array<LanguageRules | null> {
  const slots: Array<LanguageRules | null> = Array.from({ length: 8 }, () => null);
  for (const slotNumber of filledSlotNumbers) {
    slots[slotNumber - 1] = createLanguageRules();
  }
  return slots;
}

function renderSaveSlotsDialog(
  locale: 'en' | 'zh' = 'en',
  filledSlotNumbers: readonly number[] = [],
) {
  const copy = getLanguageGeneratorCopy(locale);
  const handlers = {
    onOpenChange: vi.fn(),
    onSave: vi.fn(),
    onLoad: vi.fn(),
  };

  render(
    <LanguageGeneratorSaveSlotsDialog
      copy={copy}
      open
      slots={createSaveSlots(filledSlotNumbers)}
      errorMessage={null}
      statusMessage={null}
      {...handlers}
    />,
  );

  return { copy, handlers };
}

afterEach(() => {
  cleanup();
});

describe('LanguageGeneratorSaveSlotsDialog', () => {
  it.each(['en', 'zh'] as const)('renders eight slots and disables loading empty slots in %s', (locale) => {
    const { copy } = renderSaveSlotsDialog(locale);
    const slotCards = document.querySelectorAll('[data-language-save-slot]');
    const loadButtons = screen.getAllByRole('button', { name: copy.loadButton });

    expect(slotCards).toHaveLength(8);
    expect(screen.getAllByRole('button', { name: copy.saveButton })).toHaveLength(8);
    expect(loadButtons).toHaveLength(8);
    expect(loadButtons.every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getByText(copy.loadHint)).toBeTruthy();
  });

  it('loads a stored slot and keeps an empty slot disabled', () => {
    const { copy, handlers } = renderSaveSlotsDialog('en', [1]);
    const loadButtons = screen.getAllByRole('button', { name: copy.loadButton });

    expect((loadButtons[0] as HTMLButtonElement).disabled).toBe(false);
    expect((loadButtons[1] as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(loadButtons[0]);
    fireEvent.click(loadButtons[1]);

    expect(handlers.onLoad).toHaveBeenCalledTimes(1);
    expect(handlers.onLoad).toHaveBeenCalledWith(1);
  });

  it('saves an empty slot immediately and confirms before replacing a stored slot', () => {
    const { copy, handlers } = renderSaveSlotsDialog('en', [1]);
    const saveButtons = screen.getAllByRole('button', { name: copy.saveButton });

    fireEvent.click(saveButtons[1]);
    expect(handlers.onSave).toHaveBeenCalledTimes(1);
    expect(handlers.onSave).toHaveBeenCalledWith(2);

    fireEvent.click(saveButtons[0]);
    expect(handlers.onSave).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alertdialog', { name: copy.replaceSlotTitle })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: copy.cancelButton }));
    expect(handlers.onSave).toHaveBeenCalledTimes(1);

    fireEvent.click(saveButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: copy.replaceSlotButton }));
    expect(handlers.onSave).toHaveBeenCalledTimes(2);
    expect(handlers.onSave).toHaveBeenLastCalledWith(1);
  });

  it('renders localized error and status messages', () => {
    const copy = getLanguageGeneratorCopy('en');
    render(
      <LanguageGeneratorSaveSlotsDialog
        copy={copy}
        open
        slots={createSaveSlots()}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        onLoad={vi.fn()}
        errorMessage="Storage is unavailable."
        statusMessage="Rules loaded."
      />,
    );

    expect(screen.getByRole('alert').textContent).toContain('Storage is unavailable.');
    expect(screen.getByRole('status').textContent).toContain('Rules loaded.');
  });

  it('keeps the localized close action and exposes a 44px touch target', () => {
    const { copy, handlers } = renderSaveSlotsDialog();
    const closeButton = screen.getByRole('button', { name: copy.closeButton });

    expect(closeButton.className).toContain('size-11');
    expect(closeButton.className).toContain('min-h-11');
    expect(closeButton.className).toContain('min-w-11');

    fireEvent.click(closeButton);

    expect(handlers.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('fails fast when the slot array does not contain eight entries', () => {
    const copy = getLanguageGeneratorCopy('en');

    expect(() =>
      render(
        <LanguageGeneratorSaveSlotsDialog
          copy={copy}
          open
          slots={createSaveSlots().slice(0, 7)}
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
          onLoad={vi.fn()}
          errorMessage={null}
          statusMessage={null}
        />,
      ),
    ).toThrow('Language save slots must contain 8 entries. Received 7.');
  });

  it('fails fast when a non-null slot is not a rules object', () => {
    const copy = getLanguageGeneratorCopy('en');
    const invalidSlots = createSaveSlots();
    invalidSlots[2] = 'invalid' as never;

    expect(() =>
      render(
        <LanguageGeneratorSaveSlotsDialog
          copy={copy}
          open
          slots={invalidSlots}
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
          onLoad={vi.fn()}
          errorMessage={null}
          statusMessage={null}
        />,
      ),
    ).toThrow('Language save slot 3 must be null or a rules object. Received "invalid".');
  });

  it('fails fast on a sparse slot array with the missing index and value', () => {
    const copy = getLanguageGeneratorCopy('en');
    const sparseSlots = createSaveSlots([1]);
    delete sparseSlots[4];

    expect(() =>
      render(
        <LanguageGeneratorSaveSlotsDialog
          copy={copy}
          open
          slots={sparseSlots}
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
          onLoad={vi.fn()}
          errorMessage={null}
          statusMessage={null}
        />,
      ),
    ).toThrow('Language save slot 5 must be null or a rules object. Received undefined.');
  });
});
