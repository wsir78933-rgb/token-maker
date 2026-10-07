// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { PeriodicTableCopy } from '@/lib/periodic-table-creator/copy-types';
import type { PeriodicTableDocument } from '@/lib/periodic-table-creator/types';

import { PeriodicTableInspector } from './PeriodicTableInspector';

const copy: PeriodicTableCopy = {
  navigationTitle: 'Periodic Table Creator',
  pageTitle: 'Periodic Table Creator',
  pageDescription: 'Build a custom periodic table.',
  eyebrow: 'Table maker',
  title: 'Periodic Table Creator',
  description: 'Edit each cell.',
  heroAction: 'Start creating',
  fields: {
    topLeft: 'Top left',
    topRight: 'Top right',
    symbol: 'Symbol',
    name: 'Name',
    bottomLeft: 'Bottom left',
    bottomRight: 'Bottom right',
  },
  workspaceLabel: 'Table editor',
  newTable: 'New',
  random: 'Random',
  slots: 'Slots',
  importFile: 'Import',
  download: 'Download',
  help: 'Help',
  more: 'More',
  content: 'Content',
  appearance: 'Appearance',
  multiSelect: 'Multi-select',
  selectAll: 'Select all',
  clearSelection: 'Clear selection',
  selectedCount: 'Selected',
  tableSize: 'Table size',
  selectionHint: 'Select a cell.',
  mobileScrollHint: 'Scroll table horizontally.',
  emptyCell: 'Empty cell',
  scope: 'Apply to',
  selectedScope: 'Selected cells',
  allScope: 'All cells',
  noSelection: 'Select at least one cell first.',
  backgroundColor: 'Background color',
  transparentBackground: 'Transparent',
  textColor: 'Text color',
  borderColor: 'Border color',
  borderState: 'Border state',
  borderShown: 'Shown',
  borderHidden: 'Hidden',
  borderMixed: 'Mixed',
  invertBorders: 'Invert borders',
  showBorders: 'Show borders',
  hideBorders: 'Hide borders',
  imageUrl: 'Background image URL',
  applyImage: 'Apply image',
  removeImage: 'Remove image',
  editorEmpty: 'Choose a cell to edit.',
  editorMultiple: 'Select one cell to edit its text.',
  resetSelected: 'Reset selected',
  rows: 'Rows',
  columns: 'Columns',
  createBlank: 'Create blank',
  realTemplate: 'Real template',
  randomDefault: 'Random default',
  randomCurrent: 'Random current',
  randomHint: 'Randomize the table.',
  dimensionHint: 'Up to 50 by 50.',
  newDescription: 'Create a new table.',
  save: 'Save',
  load: 'Load',
  emptySlot: 'Empty slot',
  slot: 'Slot',
  savedAt: 'Saved at',
  storageHint: 'Stored locally.',
  fileHint: 'Use a compatible table file.',
  fileInputLabel: 'Table file',
  importButton: 'Import',
  confirmReplaceTitle: 'Replace?',
  confirmReplaceDescription: 'Replace current table?',
  replace: 'Replace',
  saveFirst: 'Save first',
  confirmResetTitle: 'Reset?',
  confirmResetDescription: 'Reset selected cells?',
  confirmOverwriteTitle: 'Overwrite?',
  confirmOverwriteDescription: 'Overwrite this slot?',
  cancel: 'Cancel',
  close: 'Close',
  done: 'Done',
  statusSaved: 'Saved',
  statusLoaded: 'Loaded',
  statusImported: 'Imported',
  statusDownloaded: 'Downloaded',
  errorPrefix: 'Error',
  helpIntro: 'Help',
  helpSections: [],
};

function createCell(id: string, selected: boolean, overrides: Partial<PeriodicTableDocument['cells'][number]> = {}) {
  return {
    id,
    selected,
    text: {
      topLeft: 'TL',
      topRight: 'TR',
      symbol: 'S',
      name: 'Name',
      bottomLeft: 'BL',
      bottomRight: 'BR',
    },
    style: {
      backgroundColor: 'transparent',
      textColor: '#202020',
      borderColor: '#747474',
      borderVisible: true,
      backgroundImageUrl: '',
    },
    ...overrides,
  };
}

function createDocument(cells = [createCell('a1', true), createCell('a2', false)]): PeriodicTableDocument {
  return { version: 1, rows: 1, columns: cells.length, cells };
}

function renderInspector(overrides: Partial<Parameters<typeof PeriodicTableInspector>[0]> = {}) {
  const callbacks = {
    onTabChange: vi.fn(),
    onScopeChange: vi.fn(),
    onEditField: vi.fn(),
    onStyleChange: vi.fn(),
    onInvertBorders: vi.fn(),
    onResetSelected: vi.fn(),
    onClose: vi.fn(),
  };
  const props: Parameters<typeof PeriodicTableInspector>[0] = {
    document: createDocument(),
    activeCellId: 'a1',
    copy,
    activeTab: 'content',
    scope: 'selected',
    focusField: null,
    mobile: false,
    ...callbacks,
    ...overrides,
  };
  return { ...callbacks, ...render(<PeriodicTableInspector {...props} />) };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('PeriodicTableInspector', () => {
  it('renders six multiline fields and sends the active cell field value', () => {
    const { onEditField } = renderInspector();
    const textareas = screen.getAllByRole('textbox');

    expect(textareas).toHaveLength(6);
    fireEvent.change(textareas[2], { target: { value: 'S\nnew line' } });

    expect(onEditField).toHaveBeenCalledWith('a1', 'symbol', 'S\nnew line');
  });

  it('disables selected scope controls and text editing when no cell is selected', () => {
    renderInspector({
      document: createDocument([createCell('a1', false)]),
      activeCellId: null,
      activeTab: 'appearance',
      scope: 'selected',
    });

    expect((screen.getByRole('button', { name: /selected cells/i }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(copy.noSelection)).toBeTruthy();
    expect((screen.getByLabelText(copy.backgroundColor) as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: copy.resetSelected }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('keeps reset available in the content tab while ignoring the all scope', () => {
    const { onResetSelected } = renderInspector({
      document: createDocument([createCell('a1', false)]),
      activeCellId: null,
      activeTab: 'content',
      scope: 'all',
    });

    const resetButton = screen.getByRole('button', { name: copy.resetSelected }) as HTMLButtonElement;
    expect(resetButton.disabled).toBe(true);
    fireEvent.click(resetButton);
    expect(onResetSelected).not.toHaveBeenCalled();
  });

  it('shows mixed border state and routes invert to its callback', () => {
    const { onInvertBorders } = renderInspector({
      document: createDocument([
        createCell('a1', true, { style: { ...createCell('a1', true).style, borderVisible: true } }),
        createCell('a2', true, { style: { ...createCell('a2', true).style, borderVisible: false } }),
      ]),
      activeTab: 'appearance',
      scope: 'selected',
    });

    expect(screen.getByText(copy.borderMixed)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.invertBorders }));
    expect(onInvertBorders).toHaveBeenCalledTimes(1);
  });

  it('changes style scope through the scope buttons', () => {
    const { onScopeChange } = renderInspector({ activeTab: 'appearance' });

    fireEvent.click(screen.getByRole('button', { name: copy.allScope }));
    expect(onScopeChange).toHaveBeenCalledWith('all');
  });

  it('focuses the requested mobile field and asks the browser to scroll it into view', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });

    renderInspector({ mobile: true, focusField: 'bottomRight' });
    const bottomRight = screen.getByRole('textbox', { name: copy.fields.bottomRight });

    expect(document.activeElement).toBe(bottomRight);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
  });

  it('moves between tabs with arrow keys', () => {
    const { onTabChange } = renderInspector();
    fireEvent.keyDown(screen.getByRole('tab', { name: copy.content }), { key: 'ArrowRight' });

    expect(onTabChange).toHaveBeenCalledWith('appearance');
  });
});
