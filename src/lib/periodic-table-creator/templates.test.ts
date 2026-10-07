import { describe, expect, it } from 'vitest';

import { PERIODIC_ELEMENTS } from '@/lib/periodic-table-creator/elements';
import {
  createRandomPeriodicTable,
  createRealPeriodicTable,
  randomizeCurrentTable,
} from '@/lib/periodic-table-creator/templates';
import { createBlankTable, validateTableDocument } from '@/lib/periodic-table-creator/table';
import type { PeriodicTableDocument } from '@/lib/periodic-table-creator/types';

const PERIODIC_TABLE_COLUMNS = 18;

function cellAt(
  documentValue: PeriodicTableDocument,
  rowNumber: number,
  columnNumber: number,
) {
  return documentValue.cells[(rowNumber - 1) * PERIODIC_TABLE_COLUMNS + columnNumber - 1];
}

describe('periodic table templates', () => {
  it('builds a current 118-element table with two f-block markers and correct positions', () => {
    const realTable = createRealPeriodicTable('en');
    const elementSymbols: Set<string> = new Set(
      PERIODIC_ELEMENTS.map((element) => element.symbol),
    );
    const elementCells = realTable.cells.filter((cellValue) =>
      elementSymbols.has(cellValue.text.symbol),
    );
    const markerCells = realTable.cells.filter((cellValue) =>
      cellValue.text.name === 'Lanthanides' || cellValue.text.name === 'Actinides',
    );

    expect(realTable).toMatchObject({ rows: 9, columns: 18 });
    expect(realTable.cells).toHaveLength(162);
    expect(elementCells).toHaveLength(118);
    expect(markerCells).toHaveLength(2);
    expect(cellAt(realTable, 6, 3)?.text).toMatchObject({
      topLeft: '57–71',
      symbol: 'Ln',
      name: 'Lanthanides',
    });
    expect(cellAt(realTable, 7, 3)?.text).toMatchObject({
      topLeft: '89–103',
      symbol: 'An',
      name: 'Actinides',
    });
    expect(cellAt(realTable, 8, 4)?.text.symbol).toBe('La');
    expect(cellAt(realTable, 8, 18)?.text.symbol).toBe('Lu');
    expect(cellAt(realTable, 9, 4)?.text.symbol).toBe('Ac');
    expect(cellAt(realTable, 9, 18)?.text.symbol).toBe('Lr');
    expect(cellAt(realTable, 1, 1)?.text).toMatchObject({
      topLeft: '1',
      topRight: '1.008',
      symbol: 'H',
      name: 'Hydrogen',
    });
    expect(realTable.cells.find((cellValue) => cellValue.text.symbol === 'Ar')?.text.topRight).toBe('39.95');
    expect(realTable.cells.find((cellValue) => cellValue.text.symbol === 'Tc')?.text.topRight).toBe('[97]');
    expect(realTable.cells.find((cellValue) => cellValue.text.symbol === 'Mt')?.text.topRight).toBe('[277]');
    expect(realTable.cells.find((cellValue) => cellValue.text.symbol === 'Fl')?.text.topRight).toBe('[290]');
  });

  it('uses localized element names without translating user-facing text at runtime', () => {
    const chineseTable = createRealPeriodicTable('zh');
    const englishTable = createRealPeriodicTable('en');

    expect(cellAt(chineseTable, 1, 1)?.text.name).toBe('氢');
    expect(cellAt(chineseTable, 2, 13)?.text.name).toBe('硼');
    expect(cellAt(chineseTable, 7, 18)?.text.name).toBe('鿫');
    expect(cellAt(englishTable, 7, 18)?.text.name).toBe('Oganesson');
  });

  it('creates 118 unique fantasy cells and 44 transparent borderless gaps', () => {
    const randomTable = createRandomPeriodicTable(() => 0);
    const filledCells = randomTable.cells.filter((cellValue) => cellValue.text.symbol !== '');
    const blankCells = randomTable.cells.filter((cellValue) => cellValue.text.symbol === '');
    const serialNumbers = filledCells.map((cellValue) => Number(cellValue.text.topLeft)).sort((left, right) => left - right);
    const massesBySerialNumber = [...filledCells]
      .sort((left, right) => Number(left.text.topLeft) - Number(right.text.topLeft))
      .map((cellValue) => Number(cellValue.text.topRight));

    expect(randomTable).toMatchObject({ rows: 9, columns: 18 });
    expect(filledCells).toHaveLength(118);
    expect(blankCells).toHaveLength(44);
    expect(new Set(filledCells.map((cellValue) => cellValue.text.symbol)).size).toBe(118);
    expect(new Set(filledCells.map((cellValue) => cellValue.text.name)).size).toBe(118);
    expect(serialNumbers).toEqual(Array.from({ length: 118 }, (_, index) => index + 1));
    expect(blankCells.every((cellValue) => cellValue.style.borderVisible === false)).toBe(true);
    expect(blankCells.every((cellValue) => cellValue.style.backgroundColor === 'transparent')).toBe(true);
    expect(massesBySerialNumber.every((mass, index) => index === 0 || mass > massesBySerialNumber[index - 1])).toBe(
      true,
    );
    expect(filledCells.every((cellValue) => /^\d+\.\d{2}$/.test(cellValue.text.topRight))).toBe(true);
    expect(filledCells.some((cellValue) => cellValue.text.symbol === 'H')).toBe(false);
  });

  it('randomizes every border-visible cell while preserving layout, styles, selection, and bottom fields', () => {
    const sourceTable = createBlankTable(2, 2);
    const preparedTable = validateTableDocument({
      ...sourceTable,
      cells: sourceTable.cells.map((cellValue, cellIndex) => ({
        ...cellValue,
        selected: cellIndex === 1,
        text: {
          ...cellValue.text,
          bottomLeft: 'keep-left-' + cellIndex,
          bottomRight: 'keep-right-' + cellIndex,
          name: 'source-name-' + cellIndex,
        },
        style: {
          ...cellValue.style,
          borderVisible: cellIndex < 2,
          backgroundColor: cellIndex === 3 ? '#abc' : '#def',
          backgroundImageUrl: cellIndex === 3 ? 'https://example.com/source.png' : '',
        },
      })),
    });
    const sourceSnapshot = structuredClone(preparedTable);
    const randomizedTable = randomizeCurrentTable(preparedTable, () => 0);

    expect(preparedTable).toEqual(sourceSnapshot);
    expect(randomizedTable.rows).toBe(preparedTable.rows);
    expect(randomizedTable.columns).toBe(preparedTable.columns);
    expect(randomizedTable.cells).toHaveLength(preparedTable.cells.length);

    randomizedTable.cells.forEach((cellValue, cellIndex) => {
      const sourceCell = preparedTable.cells[cellIndex];
      expect(cellValue.id).toBe(sourceCell.id);
      expect(cellValue.selected).toBe(sourceCell.selected);
      expect(cellValue.style).toEqual(sourceCell.style);
      expect(cellValue.text.bottomLeft).toBe(sourceCell.text.bottomLeft);
      expect(cellValue.text.bottomRight).toBe(sourceCell.text.bottomRight);
      if (sourceCell.style.borderVisible) {
        expect(cellValue.text.topLeft).not.toBe(sourceCell.text.topLeft);
        expect(cellValue.text.topRight).not.toBe(sourceCell.text.topRight);
        expect(cellValue.text.symbol).not.toBe(sourceCell.text.symbol);
        expect(cellValue.text.name).not.toBe(sourceCell.text.name);
      } else {
        expect(cellValue.text).toEqual(sourceCell.text);
      }
    });
    expect(preparedTable.cells[0].text.name).toBe('source-name-0');
  });

  it('fails fast for invalid random values and tables with no eligible cells', () => {
    expect(() => createRandomPeriodicTable(() => 1)).toThrowError('Received 1');
    expect(() => randomizeCurrentTable(createBlankTable(1, 1), () => 1)).toThrowError('Received 1');

    const borderlessTable = validateTableDocument({
      ...createBlankTable(1, 1),
      cells: createBlankTable(1, 1).cells.map((cellValue) => ({
        ...cellValue,
        style: { ...cellValue.style, borderVisible: false },
      })),
    });
    expect(() => randomizeCurrentTable(borderlessTable, () => 0)).toThrowError('Received 0 eligible cells');
  });
});
