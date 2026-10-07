// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FamilyDocumentPanel, type FamilyTreeSaveSlotsState } from './FamilyDocumentPanel';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';

const copy = getFamilyTreeCopy('en');
const emptySlots: FamilyTreeSaveSlotsState = [false, false, false, false, false];

function renderPanel(overrides: Partial<React.ComponentProps<typeof FamilyDocumentPanel>> = {}) {
  const props: React.ComponentProps<typeof FamilyDocumentPanel> = {
    copy,
    slots: emptySlots,
    selectedFile: null,
    busy: false,
    onSaveSlot: vi.fn(),
    onLoadSlot: vi.fn(),
    onSaveFile: vi.fn(),
    onChooseFile: vi.fn(),
    onLoadFile: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };

  return { ...render(<FamilyDocumentPanel {...props} />), props };
}

describe('FamilyDocumentPanel', () => {
  afterEach(cleanup);

  it('renders exactly five manual save slots with empty load actions disabled', () => {
    renderPanel();

    expect(document.querySelectorAll('[data-family-tree-save-slot]')).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: copy.save })).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: copy.load })).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: copy.load }).every((button) => (button as HTMLButtonElement).disabled)).toBe(
      true,
    );
  });

  it('reports the selected slot and keeps save/load as separate actions', () => {
    const onSaveSlot = vi.fn();
    const onLoadSlot = vi.fn();
    const slots: FamilyTreeSaveSlotsState = [true, false, false, false, false];
    renderPanel({ slots, onSaveSlot, onLoadSlot });

    expect(screen.getByText(copy.savedSlot)).toBeTruthy();
    const saveButtons = screen.getAllByRole('button', { name: copy.save });
    const loadButtons = screen.getAllByRole('button', { name: copy.load });
    fireEvent.click(saveButtons[0]);
    fireEvent.click(loadButtons[0]);

    expect(onSaveSlot).toHaveBeenCalledWith(1);
    expect(onLoadSlot).toHaveBeenCalledWith(1);
    expect(onLoadSlot).toHaveBeenCalledTimes(1);
  });

  it('keeps file selection and file loading as separate steps', () => {
    const onChooseFile = vi.fn();
    const onLoadFile = vi.fn();
    renderPanel({ onChooseFile, onLoadFile });

    const fileInput = screen.getByLabelText(copy.chooseFile) as HTMLInputElement;
    const selectedFile = new File(['{}'], 'family-tree.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [selectedFile] } });

    expect(onChooseFile).toHaveBeenCalledWith(selectedFile);
    expect((screen.getByRole('button', { name: copy.loadFile }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('rejects a slot array that does not contain five booleans', () => {
    expect(() =>
      renderPanel({ slots: [false, false] as unknown as FamilyTreeSaveSlotsState }),
    ).toThrowError(/must contain 5 entries/);
  });
});
