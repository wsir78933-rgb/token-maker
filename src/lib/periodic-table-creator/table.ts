import {
  DEFAULT_PERIODIC_TABLE_STYLE,
  MAX_PERIODIC_TABLE_DIMENSION,
  PERIODIC_TABLE_FIELDS,
  type PeriodicTableCell,
  type PeriodicTableDocument,
  type PeriodicTableField,
  type PeriodicTableScope,
  type PeriodicTableStyle,
} from './types';

const PERIODIC_TABLE_STYLE_FIELDS = [
  'backgroundColor',
  'textColor',
  'borderColor',
  'borderVisible',
  'backgroundImageUrl',
] as const;

type PeriodicTableStyleField = (typeof PERIODIC_TABLE_STYLE_FIELDS)[number];

const HEX_COLOR_PATTERN = /^#[0-9a-f]{3,4}$|^#[0-9a-f]{6}$|^#[0-9a-f]{8}$/i;
const RGB_COLOR_PATTERN = /^rgba?\(\s*([^)]*)\s*\)$/i;
const RASTER_DATA_URL_PATTERN =
  /^data:image\/(?:apng|avif|bmp|gif|jpeg|jpg|png|webp);(?:base64,[a-z0-9+/]+={0,2}|[^,]+,.*)$/i;

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  if (typeof receivedValue === 'number' || typeof receivedValue === 'boolean' || typeof receivedValue === 'bigint') {
    return String(receivedValue);
  }

  return Object.prototype.toString.call(receivedValue);
}

function isPlainRecord(receivedValue: unknown): receivedValue is Record<string, unknown> {
  if (receivedValue === null || typeof receivedValue !== 'object' || Array.isArray(receivedValue)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(receivedValue);
  return prototype === Object.prototype || prototype === null;
}

function requirePlainRecord(receivedValue: unknown, fieldPath: string): Record<string, unknown> {
  if (!isPlainRecord(receivedValue)) {
    throw new Error(
      `${fieldPath} must be a plain object. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireExactKeys(
  recordValue: Record<string, unknown>,
  expectedKeys: readonly string[],
  fieldPath: string,
): void {
  const expectedKeySet = new Set(expectedKeys);
  const receivedKeys = Object.keys(recordValue);

  for (const receivedKey of receivedKeys) {
    if (!expectedKeySet.has(receivedKey)) {
      throw new Error(
        `${fieldPath} contains unknown field ${JSON.stringify(receivedKey)}. Received ${describeReceivedValue(recordValue)}.`,
      );
    }
  }

  for (const expectedKey of expectedKeys) {
    if (!Object.prototype.hasOwnProperty.call(recordValue, expectedKey)) {
      throw new Error(
        `${fieldPath} is missing field ${JSON.stringify(expectedKey)}. Received ${describeReceivedValue(recordValue)}.`,
      );
    }
  }
}

function requireIntegerDimension(receivedValue: unknown, fieldPath: string): number {
  if (
    typeof receivedValue !== 'number' ||
    !Number.isInteger(receivedValue) ||
    receivedValue < 1 ||
    receivedValue > MAX_PERIODIC_TABLE_DIMENSION
  ) {
    throw new Error(
      `${fieldPath} must be an integer from 1 to ${MAX_PERIODIC_TABLE_DIMENSION}. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function isValidRgbChannel(channelValue: string): boolean {
  if (/^\d+(?:\.\d+)?%$/.test(channelValue)) {
    const percentage = Number(channelValue.slice(0, -1));
    return percentage >= 0 && percentage <= 100;
  }

  if (!/^\d+(?:\.\d+)?$/.test(channelValue)) return false;
  const channel = Number(channelValue);
  return channel >= 0 && channel <= 255;
}

function isValidAlphaChannel(channelValue: string): boolean {
  if (/^\d+(?:\.\d+)?%$/.test(channelValue)) {
    const percentage = Number(channelValue.slice(0, -1));
    return percentage >= 0 && percentage <= 100;
  }

  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(channelValue)) return false;
  const alpha = Number(channelValue);
  return alpha >= 0 && alpha <= 1;
}

function isValidColor(colorValue: string): boolean {
  if (colorValue === 'transparent' || HEX_COLOR_PATTERN.test(colorValue)) return true;

  const rgbMatch = colorValue.match(RGB_COLOR_PATTERN);
  if (!rgbMatch) return false;

  const channelTokens = rgbMatch[1].includes(',')
    ? rgbMatch[1].split(',').map((channelToken) => channelToken.trim())
    : rgbMatch[1].split(/\s+\/\s+|\s+/).map((channelToken) => channelToken.trim());

  const expectedChannelCount = colorValue.toLowerCase().startsWith('rgba') ? 4 : 3;
  if (channelTokens.length !== expectedChannelCount) return false;

  const rgbChannelsAreValid = channelTokens.slice(0, 3).every(isValidRgbChannel);
  if (!rgbChannelsAreValid) return false;

  return expectedChannelCount === 3 || isValidAlphaChannel(channelTokens[3]);
}

function requireColor(colorValue: unknown, fieldPath: string): string {
  if (typeof colorValue !== 'string' || !isValidColor(colorValue)) {
    throw new Error(
      `${fieldPath} must be a hex, rgb(), rgba(), or transparent color. Received ${describeReceivedValue(colorValue)}.`,
    );
  }

  return colorValue;
}

function isValidRasterDataUrl(imageUrl: string): boolean {
  if (!RASTER_DATA_URL_PATTERN.test(imageUrl)) return false;
  return !imageUrl.toLowerCase().startsWith('data:image/svg');
}

function isValidImageUrl(imageUrl: string): boolean {
  if (imageUrl === '') return true;
  if (isValidRasterDataUrl(imageUrl)) return true;

  try {
    const parsedUrl = new URL(imageUrl);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function requireImageUrl(imageUrl: unknown, fieldPath: string): string {
  if (typeof imageUrl !== 'string' || !isValidImageUrl(imageUrl)) {
    throw new Error(
      `${fieldPath} must be empty, an http(s) URL, or a safe raster data URL. Received ${describeReceivedValue(imageUrl)}.`,
    );
  }

  return imageUrl;
}

function clonePeriodicTableStyle(styleValue: PeriodicTableStyle): PeriodicTableStyle {
  return {
    backgroundColor: styleValue.backgroundColor,
    textColor: styleValue.textColor,
    borderColor: styleValue.borderColor,
    borderVisible: styleValue.borderVisible,
    backgroundImageUrl: styleValue.backgroundImageUrl,
  };
}

function requireStyleRecord(
  receivedValue: unknown,
  fieldPath: string,
): Record<string, unknown> {
  const styleRecord = requirePlainRecord(receivedValue, fieldPath);
  requireExactKeys(styleRecord, PERIODIC_TABLE_STYLE_FIELDS, fieldPath);
  return styleRecord;
}

function requirePeriodicTableStyle(
  receivedValue: unknown,
  fieldPath: string,
): PeriodicTableStyle {
  const styleRecord = requireStyleRecord(receivedValue, fieldPath);
  const borderVisible = styleRecord.borderVisible;

  if (typeof borderVisible !== 'boolean') {
    throw new Error(
      `${fieldPath}.borderVisible must be a boolean. Received ${describeReceivedValue(borderVisible)}.`,
    );
  }

  return {
    backgroundColor: requireColor(styleRecord.backgroundColor, `${fieldPath}.backgroundColor`),
    textColor: requireColor(styleRecord.textColor, `${fieldPath}.textColor`),
    borderColor: requireColor(styleRecord.borderColor, `${fieldPath}.borderColor`),
    borderVisible,
    backgroundImageUrl: requireImageUrl(
      styleRecord.backgroundImageUrl,
      `${fieldPath}.backgroundImageUrl`,
    ),
  };
}

function requirePeriodicTableText(
  receivedValue: unknown,
  fieldPath: string,
): PeriodicTableCell['text'] {
  const textRecord = requirePlainRecord(receivedValue, fieldPath);
  requireExactKeys(textRecord, PERIODIC_TABLE_FIELDS, fieldPath);

  const textValue = {} as PeriodicTableCell['text'];
  for (const field of PERIODIC_TABLE_FIELDS) {
    const fieldValue = textRecord[field];
    if (typeof fieldValue !== 'string') {
      throw new Error(
        `${fieldPath}.${field} must be a string. Received ${describeReceivedValue(fieldValue)}.`,
      );
    }
    textValue[field] = fieldValue;
  }

  return textValue;
}

function requirePeriodicTableCell(
  receivedValue: unknown,
  cellIndex: number,
): PeriodicTableCell {
  const fieldPath = `cells[${cellIndex}]`;
  const cellRecord = requirePlainRecord(receivedValue, fieldPath);
  requireExactKeys(cellRecord, ['id', 'text', 'style', 'selected'], fieldPath);

  if (typeof cellRecord.id !== 'string' || cellRecord.id.length === 0) {
    throw new Error(
      `${fieldPath}.id must be a non-empty string. Received ${describeReceivedValue(cellRecord.id)}.`,
    );
  }

  if (typeof cellRecord.selected !== 'boolean') {
    throw new Error(
      `${fieldPath}.selected must be a boolean. Received ${describeReceivedValue(cellRecord.selected)}.`,
    );
  }

  return {
    id: cellRecord.id,
    text: requirePeriodicTableText(cellRecord.text, `${fieldPath}.text`),
    style: requirePeriodicTableStyle(cellRecord.style, `${fieldPath}.style`),
    selected: cellRecord.selected,
  };
}

function requireScope(scope: unknown): PeriodicTableScope {
  if (scope !== 'selected' && scope !== 'all') {
    throw new Error(
      `Periodic table scope must be "selected" or "all". Received ${describeReceivedValue(scope)}.`,
    );
  }

  return scope;
}

function requireCellId(cellId: unknown): string {
  if (typeof cellId !== 'string' || cellId.length === 0) {
    throw new Error(
      `Periodic table cellId must be a non-empty string. Received ${describeReceivedValue(cellId)}.`,
    );
  }

  return cellId;
}

function requireCellField(field: unknown): PeriodicTableField {
  if (!PERIODIC_TABLE_FIELDS.includes(field as PeriodicTableField)) {
    throw new Error(
      `Periodic table field must be one of ${PERIODIC_TABLE_FIELDS.join(', ')}. Received ${describeReceivedValue(field)}.`,
    );
  }

  return field as PeriodicTableField;
}

function requireSelectedCell(
  documentValue: PeriodicTableDocument,
  cellId: string,
): PeriodicTableCell {
  const matchedCell = documentValue.cells.find((cellValue) => cellValue.id === cellId);
  if (!matchedCell) {
    throw new Error(
      `Periodic table cellId ${JSON.stringify(cellId)} does not exist. Received ${describeReceivedValue(cellId)}.`,
    );
  }

  return matchedCell;
}

function requireSelectedCells(documentValue: PeriodicTableDocument): void {
  if (!documentValue.cells.some((cellValue) => cellValue.selected)) {
    throw new Error('Periodic table selected operation requires at least one selected cell. Received 0 selected cells.');
  }
}

function requireStylePatch(receivedValue: unknown): Partial<PeriodicTableStyle> {
  const patchRecord = requirePlainRecord(receivedValue, 'style patch');

  for (const patchKey of Object.keys(patchRecord)) {
    if (!PERIODIC_TABLE_STYLE_FIELDS.includes(patchKey as PeriodicTableStyleField)) {
      throw new Error(
        `style patch contains unknown field ${JSON.stringify(patchKey)}. Received ${describeReceivedValue(patchRecord)}.`,
      );
    }
  }

  const stylePatch: Partial<PeriodicTableStyle> = {};
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'backgroundColor')) {
    stylePatch.backgroundColor = requireColor(patchRecord.backgroundColor, 'style patch.backgroundColor');
  }
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'textColor')) {
    stylePatch.textColor = requireColor(patchRecord.textColor, 'style patch.textColor');
  }
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'borderColor')) {
    stylePatch.borderColor = requireColor(patchRecord.borderColor, 'style patch.borderColor');
  }
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'borderVisible')) {
    const borderVisible = patchRecord.borderVisible;
    if (typeof borderVisible !== 'boolean') {
      throw new Error(
        `style patch.borderVisible must be a boolean. Received ${describeReceivedValue(borderVisible)}.`,
      );
    }
    stylePatch.borderVisible = borderVisible;
  }
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'backgroundImageUrl')) {
    stylePatch.backgroundImageUrl = requireImageUrl(
      patchRecord.backgroundImageUrl,
      'style patch.backgroundImageUrl',
    );
  }

  return stylePatch;
}

function requirePeriodicTableDocument(value: unknown): PeriodicTableDocument {
  return validateTableDocument(value);
}

function applyStylePatch(
  cellValue: PeriodicTableCell,
  stylePatch: Partial<PeriodicTableStyle>,
): PeriodicTableCell {
  return {
    ...cellValue,
    style: {
      ...cellValue.style,
      ...stylePatch,
    },
  };
}

function cellIsInScope(cellValue: PeriodicTableCell, scope: PeriodicTableScope): boolean {
  return scope === 'all' || cellValue.selected;
}

function createBlankCell(rowIndex: number, columnIndex: number): PeriodicTableCell {
  return {
    id: `cell-${rowIndex + 1}-${columnIndex + 1}`,
    text: {
      topLeft: '',
      topRight: '',
      symbol: '',
      name: '',
      bottomLeft: '',
      bottomRight: '',
    },
    style: clonePeriodicTableStyle(DEFAULT_PERIODIC_TABLE_STYLE),
    selected: false,
  };
}

export function createBlankTable(rows = 7, columns = 18): PeriodicTableDocument {
  const validatedRows = requireIntegerDimension(rows, 'rows');
  const validatedColumns = requireIntegerDimension(columns, 'columns');
  const cells: PeriodicTableCell[] = [];

  for (let rowIndex = 0; rowIndex < validatedRows; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < validatedColumns; columnIndex += 1) {
      cells.push(createBlankCell(rowIndex, columnIndex));
    }
  }

  return {
    version: 1,
    rows: validatedRows,
    columns: validatedColumns,
    cells,
  };
}

export function validateTableDocument(value: unknown): PeriodicTableDocument {
  const documentRecord = requirePlainRecord(value, 'Periodic table document');
  requireExactKeys(documentRecord, ['version', 'rows', 'columns', 'cells'], 'Periodic table document');

  if (documentRecord.version !== 1) {
    throw new Error(
      `Periodic table document.version must be 1. Received ${describeReceivedValue(documentRecord.version)}.`,
    );
  }

  const rows = requireIntegerDimension(documentRecord.rows, 'Periodic table document.rows');
  const columns = requireIntegerDimension(documentRecord.columns, 'Periodic table document.columns');
  if (!Array.isArray(documentRecord.cells)) {
    throw new Error(
      `Periodic table document.cells must be an array. Received ${describeReceivedValue(documentRecord.cells)}.`,
    );
  }

  const expectedCellCount = rows * columns;
  if (documentRecord.cells.length !== expectedCellCount) {
    throw new Error(
      `Periodic table document.cells must contain ${expectedCellCount} cells for ${rows} rows and ${columns} columns. Received ${documentRecord.cells.length}.`,
    );
  }

  const cells = documentRecord.cells.map((cellValue, cellIndex) =>
    requirePeriodicTableCell(cellValue, cellIndex),
  );
  const cellIds = new Set<string>();
  for (const cellValue of cells) {
    if (cellIds.has(cellValue.id)) {
      throw new Error(
        `Periodic table cell ids must be unique. Received duplicate id ${JSON.stringify(cellValue.id)}.`,
      );
    }
    cellIds.add(cellValue.id);
  }

  return {
    version: 1,
    rows,
    columns,
    cells,
  };
}

export function updateCellText(
  documentValue: PeriodicTableDocument,
  cellId: string,
  field: PeriodicTableField,
  value: string,
): PeriodicTableDocument {
  const currentDocument = requirePeriodicTableDocument(documentValue);
  const validCellId = requireCellId(cellId);
  const validField = requireCellField(field);
  if (typeof value !== 'string') {
    throw new Error(
      `Periodic table text value must be a string. Received ${describeReceivedValue(value)}.`,
    );
  }
  requireSelectedCell(currentDocument, validCellId);

  return {
    ...currentDocument,
    cells: currentDocument.cells.map((cellValue) =>
      cellValue.id === validCellId
        ? {
            ...cellValue,
            text: {
              ...cellValue.text,
              [validField]: value,
            },
          }
        : cellValue,
    ),
  };
}

export function selectCell(
  documentValue: PeriodicTableDocument,
  cellId: string,
  multiSelect: boolean,
): PeriodicTableDocument {
  const currentDocument = requirePeriodicTableDocument(documentValue);
  const validCellId = requireCellId(cellId);
  if (typeof multiSelect !== 'boolean') {
    throw new Error(
      `Periodic table multiSelect must be a boolean. Received ${describeReceivedValue(multiSelect)}.`,
    );
  }
  const selectedCell = requireSelectedCell(currentDocument, validCellId);

  return {
    ...currentDocument,
    cells: currentDocument.cells.map((cellValue) => {
      if (multiSelect) {
        return cellValue.id === selectedCell.id
          ? { ...cellValue, selected: !cellValue.selected }
          : cellValue;
      }

      return { ...cellValue, selected: cellValue.id === selectedCell.id };
    }),
  };
}

export function selectAllCells(
  documentValue: PeriodicTableDocument,
  selected: boolean,
): PeriodicTableDocument {
  const currentDocument = requirePeriodicTableDocument(documentValue);
  if (typeof selected !== 'boolean') {
    throw new Error(
      `Periodic table selected must be a boolean. Received ${describeReceivedValue(selected)}.`,
    );
  }

  return {
    ...currentDocument,
    cells: currentDocument.cells.map((cellValue) => ({ ...cellValue, selected })),
  };
}

export function applyCellStyle(
  documentValue: PeriodicTableDocument,
  scope: PeriodicTableScope,
  patch: Partial<PeriodicTableStyle>,
): PeriodicTableDocument {
  const currentDocument = requirePeriodicTableDocument(documentValue);
  const validScope = requireScope(scope);
  const stylePatch = requireStylePatch(patch);
  if (validScope === 'selected') requireSelectedCells(currentDocument);

  return {
    ...currentDocument,
    cells: currentDocument.cells.map((cellValue) =>
      cellIsInScope(cellValue, validScope) ? applyStylePatch(cellValue, stylePatch) : cellValue,
    ),
  };
}

export function invertCellBorders(
  documentValue: PeriodicTableDocument,
  scope: PeriodicTableScope,
): PeriodicTableDocument {
  const currentDocument = requirePeriodicTableDocument(documentValue);
  const validScope = requireScope(scope);
  if (validScope === 'selected') requireSelectedCells(currentDocument);

  return {
    ...currentDocument,
    cells: currentDocument.cells.map((cellValue) =>
      cellIsInScope(cellValue, validScope)
        ? {
            ...cellValue,
            style: {
              ...cellValue.style,
              borderVisible: !cellValue.style.borderVisible,
            },
          }
        : cellValue,
    ),
  };
}

export function resetSelectedCells(
  documentValue: PeriodicTableDocument,
): PeriodicTableDocument {
  const currentDocument = requirePeriodicTableDocument(documentValue);
  requireSelectedCells(currentDocument);

  return {
    ...currentDocument,
    cells: currentDocument.cells.map((cellValue) =>
      cellValue.selected
        ? {
            ...cellValue,
            text: {
              topLeft: '',
              topRight: '',
              symbol: '',
              name: '',
              bottomLeft: '',
              bottomRight: '',
            },
            style: {
              ...cellValue.style,
              textColor: DEFAULT_PERIODIC_TABLE_STYLE.textColor,
            },
          }
        : cellValue,
    ),
  };
}

export function hasTableEdits(documentValue: PeriodicTableDocument): boolean {
  const currentDocument = requirePeriodicTableDocument(documentValue);
  if (currentDocument.rows !== 7 || currentDocument.columns !== 18) return true;

  return currentDocument.cells.some((cellValue) => {
    const hasTextEdit = PERIODIC_TABLE_FIELDS.some((field) => cellValue.text[field] !== '');
    const hasStyleEdit = PERIODIC_TABLE_STYLE_FIELDS.some(
      (field) => cellValue.style[field] !== DEFAULT_PERIODIC_TABLE_STYLE[field],
    );
    return hasTextEdit || hasStyleEdit;
  });
}
