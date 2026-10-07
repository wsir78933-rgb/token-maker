// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createBlankTable } from '@/lib/periodic-table-creator/table';
import type { PeriodicTableCopy } from '@/lib/periodic-table-creator/copy-types';
import { getPeriodicTableCopy } from '@/lib/periodic-table-creator/copy';
import { PeriodicTableDialogs, type PeriodicTableDialogsProps } from './PeriodicTableDialogs';

const copy: PeriodicTableCopy = {
  navigationTitle: 'Periodic Table Creator',
  pageTitle: 'Periodic Table Creator',
  pageDescription: 'Build a fictional periodic table.',
  eyebrow: 'Table maker',
  title: 'Periodic Table Creator',
  description: 'Create and edit a table.',
  heroAction: 'Start creating',
  fields: {
    topLeft: 'Top left',
    topRight: 'Top right',
    symbol: 'Symbol',
    name: 'Name',
    bottomLeft: 'Bottom left',
    bottomRight: 'Bottom right',
  },
  workspaceLabel: 'Workspace',
  newTable: 'New table',
  random: 'Random',
  slots: 'Save slots',
  importFile: 'Import file',
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
  mobileScrollHint: 'Scroll to see the full table.',
  emptyCell: 'Empty cell',
  scope: 'Apply to',
  selectedScope: 'Selected',
  allScope: 'All',
  noSelection: 'No cells selected.',
  backgroundColor: 'Background color',
  transparentBackground: 'Transparent background',
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
  editorEmpty: 'Choose a cell.',
  editorMultiple: 'Multiple cells selected.',
  resetSelected: 'Reset selected',
  rows: 'Rows',
  columns: 'Columns',
  createBlank: 'Create blank',
  realTemplate: 'Real template',
  randomDefault: 'Random default',
  randomCurrent: 'Random current',
  randomHint: 'Randomize the full table or visible cells.',
  dimensionHint: 'Use 1 to 50 rows and columns.',
  newDescription: 'Start a new table.',
  save: 'Save',
  load: 'Load',
  emptySlot: 'Empty slot',
  slot: 'Slot {slot}',
  savedAt: 'Saved {date}',
  storageHint: 'Keep up to five local versions.',
  fileHint: 'TXT and HTML files up to 5 MiB.',
  fileInputLabel: 'Choose a TXT or HTML file',
  importButton: 'Import',
  confirmReplaceTitle: 'Replace table?',
  confirmReplaceDescription: 'Save your current work first if needed.',
  replace: 'Replace',
  saveFirst: 'Save first',
  confirmResetTitle: 'Reset selected cells?',
  confirmResetDescription: 'Text styles will be reset.',
  confirmOverwriteTitle: 'Overwrite slot?',
  confirmOverwriteDescription: 'The existing slot will be replaced.',
  cancel: 'Cancel',
  close: 'Close',
  done: 'Done',
  statusSaved: 'Saved.',
  statusLoaded: 'Loaded.',
  statusImported: 'Imported.',
  statusDownloaded: 'Downloaded.',
  errorPrefix: 'Error:',
  helpIntro: 'Each cell has six editable fields.',
  helpSections: [{ title: 'Selection', body: 'Select one or more cells.' }],
};

function createProps(overrides: Partial<PeriodicTableDialogsProps> = {}): PeriodicTableDialogsProps {
  return {
    panel: null,
    copy,
    rowsInput: '7',
    columnsInput: '18',
    onRowsInput: vi.fn(),
    onColumnsInput: vi.fn(),
    onCreateBlank: vi.fn(),
    onLoadReal: vi.fn(),
    onRandomDefault: vi.fn(),
    onRandomCurrent: vi.fn(),
    slots: [null, null, null, null, null],
    onSaveSlot: vi.fn(),
    onLoadSlot: vi.fn(),
    onImportFile: vi.fn(),
    onDownload: vi.fn(),
    onPanelChange: vi.fn(),
    confirmation: null,
    onCancelConfirmation: vi.fn(),
    error: null,
    status: null,
    ...overrides,
  };
}

describe('PeriodicTableDialogs', () => {
  afterEach(() => cleanup());

  it('renders five slots, disables empty loads, and sends slot actions to the owner', () => {
    const onSaveSlot = vi.fn();
    const onLoadSlot = vi.fn();
    const occupiedDocument = createBlankTable(1, 1);
    const props = createProps({
      panel: 'slots',
      slots: [null, { document: occupiedDocument, savedAt: '2026-10-06' }, null, null, null],
      onSaveSlot,
      onLoadSlot,
    });

    render(<PeriodicTableDialogs {...props} />);

    expect(document.querySelectorAll('[data-periodic-table-slot]')).toHaveLength(5);
    const occupiedSlotText = document.querySelector('[data-periodic-table-slot="2"]')?.textContent ?? '';
    expect(occupiedSlotText).toContain('Saved');
    expect(occupiedSlotText).not.toContain('{date}');
    expect(occupiedSlotText).not.toContain('{slot}');
    const loadButtons = screen.getAllByRole('button', { name: /Load Slot/ });
    expect((loadButtons[0] as HTMLButtonElement).disabled).toBe(true);
    expect((loadButtons[1] as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Save Slot 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Load Slot 2' }));

    expect(onSaveSlot).toHaveBeenCalledWith(1);
    expect(onLoadSlot).toHaveBeenCalledWith(2);
  });

  it('keeps the panel closed while showing a replace alertdialog and exposes save first', () => {
    const onSaveFirst = vi.fn();
    const onConfirm = vi.fn();
    const onCancelConfirmation = vi.fn();

    render(
      <PeriodicTableDialogs
        {...createProps({
          panel: 'new',
          confirmation: { kind: 'replace', onConfirm, onSaveFirst },
          onCancelConfirmation,
        })}
      />,
    );

    expect(screen.getByRole('alertdialog')).toBeTruthy();
    expect(screen.getByText('Replace table?')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Save first' }));
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onSaveFirst).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancelConfirmation).toHaveBeenCalledTimes(1);
  });

  it('offers direct two-tap download and clears the file input for repeated imports', () => {
    const onDownload = vi.fn();
    const onImportFile = vi.fn();
    const onPanelChange = vi.fn();
    const props = createProps({ panel: 'more', onDownload, onImportFile, onPanelChange });

    render(<PeriodicTableDialogs {...props} />);

    const fileInput = screen.getByLabelText(copy.fileInputLabel) as HTMLInputElement;
    const importedFile = new File(['<table></table>'], 'periodic-table.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [importedFile] } });
    fireEvent.change(fileInput, { target: { files: [importedFile] } });
    fireEvent.click(screen.getByRole('button', { name: copy.download }));

    expect(onImportFile).toHaveBeenNthCalledWith(1, importedFile);
    expect(onImportFile).toHaveBeenNthCalledWith(2, importedFile);
    expect(fileInput.value).toBe('');
    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(onPanelChange).toHaveBeenCalledWith(null);
  });

  it('keeps errors and status messages discoverable inside the open modal', () => {
    render(<PeriodicTableDialogs {...createProps({ panel: 'random', error: 'Bad input', status: 'Ready' })} />);

    expect(screen.getByRole('alert').textContent).toContain('Error: Bad input');
    expect(screen.getByRole('status').textContent).toContain('Ready');
  });

  it('formats the real English and Chinese slot placeholders', () => {
    const occupiedDocument = createBlankTable(1, 1);
    const { rerender } = render(
      <PeriodicTableDialogs
        {...createProps({
          panel: 'slots',
          copy: getPeriodicTableCopy('en'),
          slots: [{ document: occupiedDocument, savedAt: '2026-10-06T12:00:00.000Z' }, null, null, null, null],
        })}
      />,
    );

    const englishSlotText = document.querySelector('[data-periodic-table-slot="1"]')?.textContent ?? '';
    expect(englishSlotText).not.toContain('{date}');
    expect(englishSlotText).not.toContain('{slot}');

    rerender(
      <PeriodicTableDialogs
        {...createProps({
          panel: 'slots',
          copy: getPeriodicTableCopy('zh'),
          slots: [{ document: occupiedDocument, savedAt: '2026-10-06T12:00:00.000Z' }, null, null, null, null],
        })}
      />,
    );

    const chineseSlotText = document.querySelector('[data-periodic-table-slot="1"]')?.textContent ?? '';
    expect(chineseSlotText).not.toContain('{date}');
    expect(chineseSlotText).not.toContain('{slot}');
  });
});
