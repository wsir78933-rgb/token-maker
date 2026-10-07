import { describe, expect, it } from 'vitest';

import {
  applyCellStyle,
  createBlankTable,
  hasTableEdits,
  invertCellBorders,
  resetSelectedCells,
  selectAllCells,
  selectCell,
  updateCellText,
  validateTableDocument,
} from '@/lib/periodic-table-creator/table';
import {
  DEFAULT_PERIODIC_TABLE_STYLE,
  PERIODIC_TABLE_FIELDS,
  type PeriodicTableDocument,
} from '@/lib/periodic-table-creator/types';

function selectedTableCell(documentValue: PeriodicTableDocument, cellId: string) {
  return documentValue.cells.find((cellValue) => cellValue.id === cellId);
}

describe('periodic table document', () => {
  it('creates the approved 7 by 18 blank table with stable unique cells', () => {
    const blankTable = createBlankTable();

    expect(blankTable.rows).toBe(7);
    expect(blankTable.columns).toBe(18);
    expect(blankTable.cells).toHaveLength(126);
    expect(new Set(blankTable.cells.map((cellValue) => cellValue.id)).size).toBe(126);
    expect(blankTable.cells[0]).toEqual({
      id: 'cell-1-1',
      text: Object.fromEntries(PERIODIC_TABLE_FIELDS.map((field) => [field, ''])),
      style: DEFAULT_PERIODIC_TABLE_STYLE,
      selected: false,
    });
  });

  it('validates dimensions and rectangular cell count without truncating input', () => {
    expect(() => createBlankTable(0, 18)).toThrowError('Received 0');
    expect(() => createBlankTable(51, 18)).toThrowError('Received 51');
    expect(() => validateTableDocument({
      version: 1,
      rows: 2,
      columns: 2,
      cells: [],
    })).toThrowError('Received 0');
  });

  it('rejects duplicate ids, malformed text, invalid colors and unsafe image URLs', () => {
    const blankTable = createBlankTable(1, 2);
    const duplicateIdTable = {
      ...blankTable,
      cells: blankTable.cells.map((cellValue) => ({ ...cellValue, id: 'duplicate' })),
    };
    const malformedTextTable = {
      ...blankTable,
      cells: blankTable.cells.map((cellValue) => ({
        ...cellValue,
        text: { ...cellValue.text, name: 42 },
      })),
    };
    const invalidColorTable = {
      ...blankTable,
      cells: blankTable.cells.map((cellValue) => ({
        ...cellValue,
        style: { ...cellValue.style, textColor: 'red' },
      })),
    };
    const unsafeImageTable = {
      ...blankTable,
      cells: blankTable.cells.map((cellValue) => ({
        ...cellValue,
        style: { ...cellValue.style, backgroundImageUrl: 'javascript:alert(1)' },
      })),
    };

    expect(() => validateTableDocument(duplicateIdTable)).toThrowError('duplicate');
    expect(() => validateTableDocument(malformedTextTable)).toThrowError('Received 42');
    expect(() => validateTableDocument(invalidColorTable)).toThrowError('Received "red"');
    expect(() => validateTableDocument(unsafeImageTable)).toThrowError('javascript:alert(1)');
  });

  it('accepts CSS colors and raster data URLs while rejecting SVG data URLs', () => {
    const blankTable = createBlankTable(1, 1);
    const styledTable = applyCellStyle(blankTable, 'all', {
      backgroundColor: 'rgb(1, 2, 3)',
      textColor: 'rgba(1, 2, 3, 0.5)',
      borderColor: '#abcd',
      backgroundImageUrl: 'data:image/png;base64,YQ==',
    });

    expect(styledTable.cells[0].style).toMatchObject({
      backgroundColor: 'rgb(1, 2, 3)',
      textColor: 'rgba(1, 2, 3, 0.5)',
      borderColor: '#abcd',
      backgroundImageUrl: 'data:image/png;base64,YQ==',
    });
    expect(() => applyCellStyle(blankTable, 'all', {
      backgroundImageUrl: 'data:image/svg+xml,<svg></svg>',
    })).toThrowError('data:image/svg+xml,<svg></svg>');
  });

  it('keeps every input document unchanged while updating text and selection', () => {
    const initialTable = createBlankTable(1, 2);
    const textTable = updateCellText(initialTable, 'cell-1-1', 'name', 'Hydrogen');
    const selectedTable = selectCell(textTable, 'cell-1-1', false);

    expect(initialTable.cells[0].text.name).toBe('');
    expect(initialTable.cells[0].selected).toBe(false);
    expect(textTable.cells[0].selected).toBe(false);
    expect(selectedTable).not.toBe(textTable);
    expect(selectedTable.cells[0]).not.toBe(textTable.cells[0]);
  });

  it('supports single selection and multi-selection toggles', () => {
    const blankTable = createBlankTable(1, 3);
    const firstSelected = selectCell(blankTable, 'cell-1-1', false);
    const twoSelected = selectCell(firstSelected, 'cell-1-2', true);
    const firstDeselected = selectCell(twoSelected, 'cell-1-1', true);

    expect(firstSelected.cells.map((cellValue) => cellValue.selected)).toEqual([true, false, false]);
    expect(twoSelected.cells.map((cellValue) => cellValue.selected)).toEqual([true, true, false]);
    expect(firstDeselected.cells.map((cellValue) => cellValue.selected)).toEqual([false, true, false]);
    expect(selectAllCells(firstDeselected, true).cells.every((cellValue) => cellValue.selected)).toBe(true);
    expect(selectAllCells(firstDeselected, false).cells.some((cellValue) => cellValue.selected)).toBe(false);
  });

  it('applies selected and all style scopes and rejects selected operations without a selection', () => {
    const selectedTable = selectCell(createBlankTable(1, 2), 'cell-1-1', false);
    const styledSelected = applyCellStyle(selectedTable, 'selected', {
      backgroundColor: '#fff',
      borderVisible: false,
    });
    const styledAll = applyCellStyle(styledSelected, 'all', { textColor: '#111111' });

    expect(styledSelected.cells[0].style.backgroundColor).toBe('#fff');
    expect(styledSelected.cells[1].style.backgroundColor).toBe('transparent');
    expect(styledAll.cells.every((cellValue) => cellValue.style.textColor === '#111111')).toBe(true);
    expect(() => applyCellStyle(createBlankTable(), 'selected', { textColor: '#111111' })).toThrowError(
      'Received 0 selected cells',
    );
  });

  it('inverts each border independently in mixed selections and preserves other styles', () => {
    const selectedTable = selectAllCells(createBlankTable(1, 3), true);
    const mixedTable = applyCellStyle(selectedTable, 'selected', { borderVisible: false });
    const visibleFirstTable = applyCellStyle(mixedTable, 'selected', { borderVisible: true });
    const invertedTable = invertCellBorders(visibleFirstTable, 'selected');

    expect(invertedTable.cells.map((cellValue) => cellValue.style.borderVisible)).toEqual([
      false,
      false,
      false,
    ]);

    const mixedInput = {
      ...visibleFirstTable,
      cells: visibleFirstTable.cells.map((cellValue, cellIndex) => ({
        ...cellValue,
        style: { ...cellValue.style, borderVisible: cellIndex === 0 },
      })),
    };
    const mixedInverted = invertCellBorders(mixedInput, 'selected');
    expect(mixedInverted.cells.map((cellValue) => cellValue.style.borderVisible)).toEqual([
      false,
      true,
      true,
    ]);
    expect(mixedInverted.cells[0].style.backgroundColor).toBe('transparent');
    expect(() => invertCellBorders(createBlankTable(), 'selected')).toThrowError('Received 0 selected cells');
  });

  it('resets only selected cells and preserves selection, non-text styles, and empty slots', () => {
    const styledTable = applyCellStyle(
      selectCell(createBlankTable(1, 2), 'cell-1-1', false),
      'selected',
      {
        backgroundColor: '#abcdef',
        borderColor: 'rgb(1, 2, 3)',
        borderVisible: false,
        backgroundImageUrl: 'https://example.com/image.png',
        textColor: '#ffffff',
      },
    );
    const editedTable = updateCellText(styledTable, 'cell-1-1', 'name', 'Before reset');
    const resetTable = resetSelectedCells(editedTable);
    const selectedCell = selectedTableCell(resetTable, 'cell-1-1');
    const emptyCell = selectedTableCell(resetTable, 'cell-1-2');

    expect(selectedCell).toMatchObject({
      selected: true,
      text: Object.fromEntries(PERIODIC_TABLE_FIELDS.map((field) => [field, ''])),
      style: {
        backgroundColor: '#abcdef',
        borderColor: 'rgb(1, 2, 3)',
        borderVisible: false,
        backgroundImageUrl: 'https://example.com/image.png',
        textColor: DEFAULT_PERIODIC_TABLE_STYLE.textColor,
      },
    });
    expect(emptyCell).toEqual(createBlankTable(1, 2).cells[1]);
    expect(() => resetSelectedCells(createBlankTable())).toThrowError('Received 0 selected cells');
  });

  it('does not count selection as an edit but counts layout, text, and style edits', () => {
    const blankTable = createBlankTable();
    expect(hasTableEdits(blankTable)).toBe(false);
    expect(hasTableEdits(selectAllCells(blankTable, true))).toBe(false);
    expect(hasTableEdits(updateCellText(blankTable, 'cell-1-1', 'name', 'Changed'))).toBe(true);
    expect(hasTableEdits(createBlankTable(6, 18))).toBe(true);
    expect(hasTableEdits(applyCellStyle(blankTable, 'all', { borderVisible: false }))).toBe(true);
  });
});
