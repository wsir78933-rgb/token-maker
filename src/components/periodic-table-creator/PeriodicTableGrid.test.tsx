// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { PeriodicTableCopy } from '@/lib/periodic-table-creator/copy-types';
import type { PeriodicTableDocument } from '@/lib/periodic-table-creator/types';

import { PeriodicTableGrid } from './PeriodicTableGrid';

const copy: PeriodicTableCopy = {
  navigationTitle: 'Periodic Table Creator',
  pageTitle: 'Periodic Table Creator',
  pageDescription: 'Create a custom periodic table.',
  eyebrow: 'Tool',
  title: 'Periodic Table Creator',
  description: 'Edit cells.',
  heroAction: 'Start creating',
  fields: {
    topLeft: 'Top left',
    topRight: 'Top right',
    symbol: 'Symbol',
    name: 'Name',
    bottomLeft: 'Bottom left',
    bottomRight: 'Bottom right',
  },
  workspaceLabel: 'Periodic table workspace',
  newTable: 'New table',
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
  mobileScrollHint: 'Scroll the table horizontally.',
  emptyCell: 'Empty cell',
  scope: 'Apply to',
  selectedScope: 'Selected',
  allScope: 'All',
  noSelection: 'No selection',
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
  imageUrl: 'Image URL',
  applyImage: 'Apply image',
  removeImage: 'Remove image',
  editorEmpty: 'Select a cell.',
  editorMultiple: 'Multiple cells selected.',
  resetSelected: 'Reset selected',
  rows: 'Rows',
  columns: 'Columns',
  createBlank: 'Create blank',
  realTemplate: 'Real template',
  randomDefault: 'Random default',
  randomCurrent: 'Random current',
  randomHint: 'Randomize cells.',
  dimensionHint: 'Enter dimensions.',
  newDescription: 'Create a table.',
  save: 'Save',
  load: 'Load',
  emptySlot: 'Empty slot',
  slot: 'Slot',
  savedAt: 'Saved',
  storageHint: 'Stored in this browser.',
  fileHint: 'Import and export.',
  fileInputLabel: 'Choose file',
  importButton: 'Import table',
  confirmReplaceTitle: 'Replace table?',
  confirmReplaceDescription: 'Current changes will be replaced.',
  replace: 'Replace',
  saveFirst: 'Save first',
  confirmResetTitle: 'Reset selected?',
  confirmResetDescription: 'Selected text will be cleared.',
  confirmOverwriteTitle: 'Overwrite slot?',
  confirmOverwriteDescription: 'The existing slot will be replaced.',
  cancel: 'Cancel',
  close: 'Close',
  done: 'Done',
  statusSaved: 'Saved.',
  statusLoaded: 'Loaded.',
  statusImported: 'Imported.',
  statusDownloaded: 'Downloaded.',
  errorPrefix: 'Error',
  helpIntro: 'Help',
  helpSections: [],
};

function createDocument(): PeriodicTableDocument {
  const emptyStyle = {
    backgroundColor: 'transparent',
    textColor: '#202020',
    borderColor: '#747474',
    borderVisible: true,
    backgroundImageUrl: '',
  } as const;

  return {
    version: 1,
    rows: 1,
    columns: 2,
    cells: [
      {
        id: 'cell-1',
        text: {
          topLeft: '1',
          topRight: '1.00',
          symbol: 'H',
          name: 'Hydrogen',
          bottomLeft: 'custom',
          bottomRight: 'row',
        },
        style: emptyStyle,
        selected: true,
      },
      {
        id: 'cell-2',
        text: {
          topLeft: '',
          topRight: '',
          symbol: '',
          name: '',
          bottomLeft: '',
          bottomRight: '',
        },
        style: {
          ...emptyStyle,
          borderVisible: false,
          backgroundImageUrl: 'https://example.com/cell.png',
        },
        selected: false,
      },
    ],
  };
}

function renderGrid(overrides: Partial<Parameters<typeof PeriodicTableGrid>[0]> = {}) {
  const props = {
    document: createDocument(),
    copy,
    multiSelect: false,
    mobile: false,
    onSelectCell: vi.fn(),
    onFocusField: vi.fn(),
    onEditField: vi.fn(),
    ...overrides,
  };

  render(<PeriodicTableGrid {...props} />);
  return props;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('PeriodicTableGrid', () => {
  it('renders all six fields, preserves hidden borders and background image, and edits plain multiline text', () => {
    const props = renderGrid();
    const firstCell = screen.getByRole('gridcell', { name: /Hydrogen/ });
    const firstCellFields = firstCell.querySelectorAll('[data-field]');
    expect(firstCellFields).toHaveLength(6);
    expect(screen.getByText('custom')).toBeTruthy();
    expect(firstCell.getAttribute('aria-selected')).toBe('true');

    const secondCell = screen.getByRole('gridcell', { name: /Empty cell/ });
    expect((secondCell as HTMLElement).style.borderColor).toBe('transparent');
    expect((secondCell as HTMLElement).style.backgroundImage).toContain('cell.png');

    const symbolField = firstCell.querySelector<HTMLElement>('[data-field="symbol"]');
    if (symbolField === null) throw new Error('Symbol field is missing.');
    fireEvent.focus(symbolField);
    symbolField.textContent = 'H\n2';
    fireEvent.input(symbolField);

    expect(props.onFocusField).toHaveBeenCalledWith('cell-1', 'symbol');
    expect(props.onEditField).toHaveBeenCalledWith('cell-1', 'symbol', 'H\n2');
  });

  it('selects the cell without focusing or editing a field in multi-select mode', () => {
    const props = renderGrid({ multiSelect: true });
    const symbolField = screen.getByRole('gridcell', { name: /Hydrogen/ }).querySelector<HTMLElement>('[data-field="symbol"]');
    if (symbolField === null) throw new Error('Symbol field is missing.');

    fireEvent.click(symbolField);
    fireEvent.input(symbolField);

    expect(props.onSelectCell).toHaveBeenCalledWith('cell-1');
    expect(props.onFocusField).not.toHaveBeenCalled();
    expect(props.onEditField).not.toHaveBeenCalled();
  });

  it('focuses the external mobile editor when a mobile field is clicked', () => {
    const props = renderGrid({ mobile: true });
    const nameField = screen.getByRole('gridcell', { name: /Hydrogen/ }).querySelector<HTMLElement>('[data-field="name"]');
    if (nameField === null) throw new Error('Name field is missing.');

    expect(nameField.getAttribute('contenteditable')).toBe('false');
    fireEvent.click(nameField);

    expect(props.onFocusField).toHaveBeenCalledWith('cell-1', 'name');
    expect(props.onEditField).not.toHaveBeenCalled();
  });

  it('pastes text/plain without inserting HTML markup', () => {
    const props = renderGrid();
    const nameField = screen.getByRole('gridcell', { name: /Hydrogen/ }).querySelector<HTMLElement>('[data-field="name"]');
    if (nameField === null) throw new Error('Name field is missing.');

    fireEvent.paste(nameField, {
      clipboardData: {
        getData: (format: string) => (format === 'text/plain' ? '<b>New</b>\nName' : ''),
      },
    });

    expect(nameField.querySelector('b')).toBeNull();
    expect(props.onEditField).toHaveBeenCalledWith('cell-1', 'name', expect.stringContaining('<b>New</b>'));
  });

  it('preserves a user-entered trailing newline', () => {
    const props = renderGrid();
    const nameField = screen.getByRole('gridcell', { name: /Hydrogen/ }).querySelector<HTMLElement>('[data-field="name"]');
    if (nameField === null) throw new Error('Name field is missing.');

    nameField.textContent = 'Hydrogen\n';
    fireEvent.input(nameField);

    expect(props.onEditField).toHaveBeenCalledWith('cell-1', 'name', 'Hydrogen\n');
  });

  it('normalizes the native Enter block DOM without losing the line boundary', () => {
    const props = renderGrid();
    const symbolField = screen.getByRole('gridcell', { name: /Hydrogen/ }).querySelector<HTMLElement>('[data-field="symbol"]');
    if (symbolField === null) throw new Error('Symbol field is missing.');

    symbolField.innerHTML = 'Az<div>Moon</div><div><br></div>';
    fireEvent.input(symbolField);

    expect(props.onEditField).toHaveBeenCalledWith('cell-1', 'symbol', 'Az\nMoon\n');
  });
});
