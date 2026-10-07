import { PERIODIC_ELEMENTS, type PeriodicElement, type PeriodicElementCategory } from './elements';
import { createBlankTable, validateTableDocument } from './table';
import {
  DEFAULT_PERIODIC_TABLE_STYLE,
  type PeriodicTableCell,
  type PeriodicTableDocument,
  type PeriodicTableStyle,
} from './types';

export type PeriodicTableLocale = 'en' | 'zh';
export type PeriodicTableRandomSource = () => number;
export type PeriodicTableGroupMarker = 'lanthanides' | 'actinides';
type PeriodicTableLayoutEntry = number | PeriodicTableGroupMarker | null;

export const PERIODIC_ELEMENT_CATEGORY_COLORS: Readonly<Record<PeriodicElementCategory, string>> = {
  'alkali-metal': '#f6d5d5',
  'alkaline-earth-metal': '#f7e0c4',
  'transition-metal': '#f7efc1',
  'post-transition-metal': '#dcefd7',
  metalloid: '#d5e9e9',
  'reactive-nonmetal': '#d9e6f7',
  halogen: '#d9d4ef',
  'noble-gas': '#ead9ef',
  lanthanide: '#f0d9ea',
  actinide: '#f1d7d0',
};

export const PERIODIC_TABLE_GROUP_MARKERS: Readonly<
  Record<
    PeriodicTableGroupMarker,
    {
      range: string;
      symbol: string;
      name: { en: string; zh: string };
      category: 'lanthanide' | 'actinide';
    }
  >
> = {
  lanthanides: {
    range: '57–71',
    symbol: 'Ln',
    name: { en: 'Lanthanides', zh: '镧系' },
    category: 'lanthanide',
  },
  actinides: {
    range: '89–103',
    symbol: 'An',
    name: { en: 'Actinides', zh: '锕系' },
    category: 'actinide',
  },
};

const PERIODIC_TABLE_COLUMN_COUNT = 18;
const PERIODIC_TABLE_ROW_COUNT = 9;
const PERIODIC_ELEMENT_COUNT = PERIODIC_ELEMENTS.length;

function createLayoutRow(
  entries: ReadonlyArray<readonly [number, PeriodicTableLayoutEntry]>,
): readonly PeriodicTableLayoutEntry[] {
  const rowEntries: PeriodicTableLayoutEntry[] = Array.from(
    { length: PERIODIC_TABLE_COLUMN_COUNT },
    () => null,
  );

  for (const [columnNumber, layoutEntry] of entries) {
    if (
      !Number.isInteger(columnNumber) ||
      columnNumber < 1 ||
      columnNumber > PERIODIC_TABLE_COLUMN_COUNT
    ) {
      throw new Error(
        'Periodic table layout column must be an integer from 1 to ' +
          PERIODIC_TABLE_COLUMN_COUNT +
          '. Received ' +
          columnNumber +
          '.',
      );
    }
    rowEntries[columnNumber - 1] = layoutEntry;
  }

  return rowEntries;
}

const REAL_PERIODIC_TABLE_LAYOUT: readonly (readonly PeriodicTableLayoutEntry[])[] = [
  createLayoutRow([
    [1, 1],
    [18, 2],
  ]),
  createLayoutRow([
    [1, 3],
    [2, 4],
    [13, 5],
    [14, 6],
    [15, 7],
    [16, 8],
    [17, 9],
    [18, 10],
  ]),
  createLayoutRow([
    [1, 11],
    [2, 12],
    [13, 13],
    [14, 14],
    [15, 15],
    [16, 16],
    [17, 17],
    [18, 18],
  ]),
  createLayoutRow([
    [1, 19],
    [2, 20],
    [3, 21],
    [4, 22],
    [5, 23],
    [6, 24],
    [7, 25],
    [8, 26],
    [9, 27],
    [10, 28],
    [11, 29],
    [12, 30],
    [13, 31],
    [14, 32],
    [15, 33],
    [16, 34],
    [17, 35],
    [18, 36],
  ]),
  createLayoutRow([
    [1, 37],
    [2, 38],
    [3, 39],
    [4, 40],
    [5, 41],
    [6, 42],
    [7, 43],
    [8, 44],
    [9, 45],
    [10, 46],
    [11, 47],
    [12, 48],
    [13, 49],
    [14, 50],
    [15, 51],
    [16, 52],
    [17, 53],
    [18, 54],
  ]),
  createLayoutRow([
    [1, 55],
    [2, 56],
    [3, 'lanthanides'],
    [4, 72],
    [5, 73],
    [6, 74],
    [7, 75],
    [8, 76],
    [9, 77],
    [10, 78],
    [11, 79],
    [12, 80],
    [13, 81],
    [14, 82],
    [15, 83],
    [16, 84],
    [17, 85],
    [18, 86],
  ]),
  createLayoutRow([
    [1, 87],
    [2, 88],
    [3, 'actinides'],
    [4, 104],
    [5, 105],
    [6, 106],
    [7, 107],
    [8, 108],
    [9, 109],
    [10, 110],
    [11, 111],
    [12, 112],
    [13, 113],
    [14, 114],
    [15, 115],
    [16, 116],
    [17, 117],
    [18, 118],
  ]),
  createLayoutRow([
    [4, 57],
    [5, 58],
    [6, 59],
    [7, 60],
    [8, 61],
    [9, 62],
    [10, 63],
    [11, 64],
    [12, 65],
    [13, 66],
    [14, 67],
    [15, 68],
    [16, 69],
    [17, 70],
    [18, 71],
  ]),
  createLayoutRow([
    [4, 89],
    [5, 90],
    [6, 91],
    [7, 92],
    [8, 93],
    [9, 94],
    [10, 95],
    [11, 96],
    [12, 97],
    [13, 98],
    [14, 99],
    [15, 100],
    [16, 101],
    [17, 102],
    [18, 103],
  ]),
];

function requireLocale(locale: unknown): PeriodicTableLocale {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error('Periodic table locale must be "en" or "zh". Received ' + String(locale) + '.');
  }
  return locale;
}

function requireRandomSource(randomSource: unknown): PeriodicTableRandomSource {
  if (typeof randomSource !== 'function') {
    throw new Error(
      'Periodic table random source must be a function. Received ' + String(randomSource) + '.',
    );
  }
  return randomSource as PeriodicTableRandomSource;
}

function readRandomUnit(randomSource: PeriodicTableRandomSource, purpose: string): number {
  const randomUnit = randomSource();
  if (
    typeof randomUnit !== 'number' ||
    !Number.isFinite(randomUnit) ||
    randomUnit < 0 ||
    randomUnit >= 1
  ) {
    throw new Error(
      'Periodic table random source returned an invalid value for ' +
        purpose +
        '. Expected a number from 0 inclusive to 1 exclusive. Received ' +
        String(randomUnit) +
        '.',
    );
  }
  return randomUnit;
}

function getElementByAtomicNumber(atomicNumber: number): PeriodicElement {
  const element = PERIODIC_ELEMENTS[atomicNumber - 1];
  if (!element || element.atomicNumber !== atomicNumber) {
    throw new Error(
      'Periodic element dataset is missing atomic number ' + atomicNumber + '. Received ' + atomicNumber + '.',
    );
  }
  return element;
}

function createElementCell(
  blankCell: PeriodicTableCell,
  element: PeriodicElement,
  locale: PeriodicTableLocale,
): PeriodicTableCell {
  return {
    ...blankCell,
    text: {
      topLeft: String(element.atomicNumber),
      topRight: element.atomicMass,
      symbol: element.symbol,
      name: locale === 'zh' ? element.nameZh : element.name,
      bottomLeft: '',
      bottomRight: '',
    },
    style: {
      ...blankCell.style,
      backgroundColor: PERIODIC_ELEMENT_CATEGORY_COLORS[element.category],
    },
  };
}

function createGroupMarkerCell(
  blankCell: PeriodicTableCell,
  markerKey: PeriodicTableGroupMarker,
  locale: PeriodicTableLocale,
): PeriodicTableCell {
  const marker = PERIODIC_TABLE_GROUP_MARKERS[markerKey];
  return {
    ...blankCell,
    text: {
      topLeft: marker.range,
      topRight: '',
      symbol: marker.symbol,
      name: marker.name[locale],
      bottomLeft: '',
      bottomRight: '',
    },
    style: {
      ...blankCell.style,
      backgroundColor: PERIODIC_ELEMENT_CATEGORY_COLORS[marker.category],
    },
  };
}

function getLayoutEntry(rowIndex: number, columnIndex: number): PeriodicTableLayoutEntry {
  const rowLayout = REAL_PERIODIC_TABLE_LAYOUT[rowIndex];
  if (!rowLayout) {
    throw new Error('Periodic table layout is missing row ' + (rowIndex + 1) + '.');
  }
  const layoutEntry = rowLayout[columnIndex];
  if (layoutEntry === undefined) {
    throw new Error(
      'Periodic table layout is missing column ' +
        (columnIndex + 1) +
        ' in row ' +
        (rowIndex + 1) +
        '.',
    );
  }
  return layoutEntry;
}

function buildRealPeriodicTableCells(
  blankDocument: PeriodicTableDocument,
  locale: PeriodicTableLocale,
): PeriodicTableCell[] {
  return blankDocument.cells.map((blankCell, cellIndex) => {
    const rowIndex = Math.floor(cellIndex / PERIODIC_TABLE_COLUMN_COUNT);
    const columnIndex = cellIndex % PERIODIC_TABLE_COLUMN_COUNT;
    const layoutEntry = getLayoutEntry(rowIndex, columnIndex);
    if (typeof layoutEntry === 'number') {
      return createElementCell(blankCell, getElementByAtomicNumber(layoutEntry), locale);
    }
    if (layoutEntry === null) return blankCell;
    return createGroupMarkerCell(blankCell, layoutEntry, locale);
  });
}

const FANTASY_NAME_PREFIXES = [
  'Aether',
  'Brim',
  'Cinder',
  'Dawn',
  'Elder',
  'Fallow',
  'Glimmer',
  'Hollow',
  'Ivory',
  'Jade',
  'Kestrel',
  'Lumen',
  'Morrow',
  'Nimbus',
  'Obsidian',
  'Prism',
  'Quill',
  'Rune',
  'Sable',
  'Thorn',
  'Umber',
  'Vesper',
  'Warden',
  'Zephyr',
] as const;

const FANTASY_NAME_SUFFIXES = [
  'alis',
  'ara',
  'ene',
  'ess',
  'ium',
  'ora',
  'une',
  'yne',
] as const;

const FANTASY_CELL_COLORS = [
  '#f3e6d8',
  '#e1edf6',
  '#e5f1df',
  '#f2e1ed',
  '#eee7d2',
] as const;

function createFantasyName(
  serialNumber: number,
  randomSource: PeriodicTableRandomSource,
  usedNames: Set<string>,
): string {
  const prefixIndex = Math.floor(
    readRandomUnit(randomSource, 'fantasy name prefix') * FANTASY_NAME_PREFIXES.length,
  );
  const suffixIndex = Math.floor(
    readRandomUnit(randomSource, 'fantasy name suffix') * FANTASY_NAME_SUFFIXES.length,
  );
  const baseName = FANTASY_NAME_PREFIXES[prefixIndex] + FANTASY_NAME_SUFFIXES[suffixIndex];
  let uniqueName = baseName;
  let duplicateSuffix = 2;
  while (usedNames.has(uniqueName)) {
    uniqueName = baseName + '-' + serialNumber + '-' + duplicateSuffix;
    duplicateSuffix += 1;
  }
  usedNames.add(uniqueName);
  return uniqueName;
}

function createFantasySymbol(
  serialNumber: number,
  randomSource: PeriodicTableRandomSource,
  usedSymbols: Set<string>,
): string {
  const symbolAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphabetSize = symbolAlphabet.length;
  const symbolSpaceSize = alphabetSize * alphabetSize;
  const randomOffset = Math.floor(
    readRandomUnit(randomSource, 'fantasy symbol') * symbolSpaceSize,
  );
  const symbolIndex = (randomOffset + serialNumber - 1) % symbolSpaceSize;
  const firstLetter = symbolAlphabet[Math.floor(symbolIndex / alphabetSize)];
  const secondLetter = symbolAlphabet[symbolIndex % alphabetSize].toLowerCase();
  const baseSymbol = firstLetter + secondLetter;

  let uniqueSymbol = baseSymbol;
  let duplicateSuffix = 2;
  while (usedSymbols.has(uniqueSymbol)) {
    uniqueSymbol = baseSymbol + '-' + serialNumber + '-' + duplicateSuffix;
    duplicateSuffix += 1;
  }
  usedSymbols.add(uniqueSymbol);
  return uniqueSymbol;
}

function createFantasyText(
  serialNumber: number,
  randomSource: PeriodicTableRandomSource,
  usedNames: Set<string>,
  usedSymbols: Set<string>,
  previousMass: number,
): { text: PeriodicTableCell['text']; nextMass: number } {
  const nextMass = previousMass + 1 + readRandomUnit(randomSource, 'fantasy mass') * 8;
  return {
    text: {
      topLeft: String(serialNumber),
      topRight: nextMass.toFixed(2),
      symbol: createFantasySymbol(serialNumber, randomSource, usedSymbols),
      name: createFantasyName(serialNumber, randomSource, usedNames),
      bottomLeft: '',
      bottomRight: '',
    },
    nextMass,
  };
}

function createRandomCellStyle(
  blankCell: PeriodicTableCell,
  randomSource: PeriodicTableRandomSource,
): PeriodicTableStyle {
  const colorIndex = Math.floor(
    readRandomUnit(randomSource, 'fantasy cell color') * FANTASY_CELL_COLORS.length,
  );
  return {
    ...blankCell.style,
    backgroundColor: FANTASY_CELL_COLORS[colorIndex],
    borderVisible: true,
  };
}

function shufflePositions(
  positionCount: number,
  randomSource: PeriodicTableRandomSource,
): number[] {
  const positions = Array.from({ length: positionCount }, (_, positionIndex) => positionIndex);
  for (let positionIndex = positions.length - 1; positionIndex > 0; positionIndex -= 1) {
    const swapIndex = Math.floor(
      readRandomUnit(randomSource, 'random position ' + positionIndex) * (positionIndex + 1),
    );
    [positions[positionIndex], positions[swapIndex]] = [
      positions[swapIndex],
      positions[positionIndex],
    ];
  }
  return positions;
}

function populateRandomCells(
  blankDocument: PeriodicTableDocument,
  filledPositions: Set<number>,
  randomSource: PeriodicTableRandomSource,
): PeriodicTableCell[] {
  const usedNames = new Set<string>();
  const usedSymbols = new Set<string>();
  let previousMass = 0;
  const filledPositionOrdinals = new Map(
    Array.from(filledPositions).map((cellIndex, ordinalIndex) => [cellIndex, ordinalIndex + 1]),
  );

  return blankDocument.cells.map((blankCell, cellIndex) => {
    const filledCellOrdinal = filledPositionOrdinals.get(cellIndex);
    if (filledCellOrdinal === undefined) {
      return {
        ...blankCell,
        style: {
          ...blankCell.style,
          backgroundColor: DEFAULT_PERIODIC_TABLE_STYLE.backgroundColor,
          borderVisible: false,
        },
      };
    }

    const fantasyText = createFantasyText(
      filledCellOrdinal,
      randomSource,
      usedNames,
      usedSymbols,
      previousMass,
    );
    previousMass = fantasyText.nextMass;
    return {
      ...blankCell,
      text: fantasyText.text,
      style: createRandomCellStyle(blankCell, randomSource),
    };
  });
}

export function createRealPeriodicTable(
  locale: PeriodicTableLocale = 'en',
): PeriodicTableDocument {
  const validatedLocale = requireLocale(locale);
  const blankDocument = createBlankTable(PERIODIC_TABLE_ROW_COUNT, PERIODIC_TABLE_COLUMN_COUNT);
  return validateTableDocument({
    ...blankDocument,
    cells: buildRealPeriodicTableCells(blankDocument, validatedLocale),
  });
}

export function createRandomPeriodicTable(
  random: PeriodicTableRandomSource = Math.random,
): PeriodicTableDocument {
  const randomSource = requireRandomSource(random);
  const blankDocument = createBlankTable(PERIODIC_TABLE_ROW_COUNT, PERIODIC_TABLE_COLUMN_COUNT);
  const shuffledPositions = shufflePositions(blankDocument.cells.length, randomSource);
  const filledPositions = new Set(shuffledPositions.slice(0, PERIODIC_ELEMENT_COUNT));

  return validateTableDocument({
    ...blankDocument,
    cells: populateRandomCells(blankDocument, filledPositions, randomSource),
  });
}

export function randomizeCurrentTable(
  documentValue: PeriodicTableDocument,
  random: PeriodicTableRandomSource = Math.random,
): PeriodicTableDocument {
  const currentDocument = validateTableDocument(documentValue);
  const randomSource = requireRandomSource(random);
  const eligibleCells = currentDocument.cells.filter(
    (cellValue) => cellValue.style.borderVisible,
  );
  if (eligibleCells.length === 0) {
    throw new Error(
      'Periodic table random current requires at least one cell with a visible border. Received 0 eligible cells.',
    );
  }

  const eligibleCellIds = new Set(eligibleCells.map((cellValue) => cellValue.id));
  const usedNames = new Set<string>();
  const usedSymbols = new Set<string>();
  let previousMass = 0;
  let serialNumber = 0;
  const randomizedCells = currentDocument.cells.map((cellValue) => {
    if (!eligibleCellIds.has(cellValue.id)) return cellValue;

    serialNumber += 1;
    const fantasyText = createFantasyText(
      serialNumber,
      randomSource,
      usedNames,
      usedSymbols,
      previousMass,
    );
    previousMass = fantasyText.nextMass;
    return {
      ...cellValue,
      text: {
        ...cellValue.text,
        topLeft: fantasyText.text.topLeft,
        topRight: fantasyText.text.topRight,
        symbol: fantasyText.text.symbol,
        name: fantasyText.text.name,
      },
    };
  });

  return validateTableDocument({
    ...currentDocument,
    cells: randomizedCells,
  });
}
