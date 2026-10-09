import { getMapMakerAsset } from './catalog';
import {
  MAP_MAKER_HEX_SIZE_MAX_PERCENT,
  MAP_MAKER_HEX_SIZE_MIN_PERCENT,
  MAP_MAKER_HEX_SIZE_STEP_PERCENT,
  MAP_MAKER_MAX_COLUMNS,
  MAP_MAKER_MAX_ROWS,
  MAP_MAKER_MIN_COLUMNS,
  MAP_MAKER_MIN_ROWS,
  MAP_MAKER_TILE_SIZE,
} from './types';
import type {
  MapMakerAssetCategory,
  MapMakerBaseTile,
  MapMakerConnections,
  MapMakerElement,
  MapMakerElementLayer,
  MapMakerGridCell,
  MapMakerImageSource,
  MapMakerLabel,
  MapMakerProject,
  MapMakerProjectSettings,
  MapMakerRotation,
} from './types';

const PROJECT_FIELDS = ['baseTiles', 'columns', 'elements', 'labels', 'rows', 'settings'] as const;
const SETTINGS_FIELDS = [
  'elementResizingEnabled',
  'elementsVisible',
  'hexGridVisible',
  'hexSizePercent',
  'labelBordersEnabled',
  'labelResizingEnabled',
  'labelsVisible',
  'snapToGrid',
  'squareGridVisible',
] as const;
const BASE_TILE_FIELDS = ['column', 'flipHorizontal', 'flipVertical', 'rotation', 'row', 'source'] as const;
const ELEMENT_FIELDS = [
  'flipHorizontal',
  'flipVertical',
  'height',
  'id',
  'layer',
  'rotation',
  'source',
  'width',
  'x',
  'y',
] as const;
const LABEL_FIELDS = ['fontSize', 'height', 'id', 'text', 'width', 'x', 'y'] as const;
const IMAGE_ASSET_SOURCE_FIELDS = ['assetId', 'kind'] as const;
const IMAGE_URL_SOURCE_FIELDS = ['kind', 'url'] as const;

export function describeMapMakerValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  if (
    typeof receivedValue === 'number' ||
    typeof receivedValue === 'boolean' ||
    typeof receivedValue === 'bigint'
  ) {
    return String(receivedValue);
  }

  try {
    const serializedValue = JSON.stringify(receivedValue);
    return serializedValue === undefined
      ? Object.prototype.toString.call(receivedValue)
      : serializedValue;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      return `${Object.prototype.toString.call(receivedValue)} (JSON serialization failed: ${error.message})`;
    }
    throw error;
  }
}

export function isMapMakerRecord(receivedValue: unknown): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

function requireRecord(receivedValue: unknown, valueName: string): Record<string, unknown> {
  if (!isMapMakerRecord(receivedValue)) {
    throw new Error(`${valueName} must be an object. Received ${describeMapMakerValue(receivedValue)}.`);
  }
  return receivedValue;
}

function requireExactFields(
  receivedRecord: Record<string, unknown>,
  expectedFields: readonly string[],
  valueName: string,
): void {
  const receivedFields = Object.keys(receivedRecord).sort();
  const sortedExpectedFields = [...expectedFields].sort();
  if (
    receivedFields.length !== sortedExpectedFields.length ||
    receivedFields.some((fieldName, index) => fieldName !== sortedExpectedFields[index])
  ) {
    throw new Error(
      `${valueName} must contain exactly ${sortedExpectedFields.join(', ')}. Received ${describeMapMakerValue(receivedRecord)}.`,
    );
  }
}

function requireAllowedFields(
  receivedRecord: Record<string, unknown>,
  allowedFields: readonly string[],
  valueName: string,
): void {
  const unknownFields = Object.keys(receivedRecord).filter((fieldName) => !allowedFields.includes(fieldName));
  if (unknownFields.length > 0) {
    throw new Error(
      `${valueName} contains unknown fields ${describeMapMakerValue(unknownFields)}. Received ${describeMapMakerValue(receivedRecord)}.`,
    );
  }
}

export function requireMapMakerFiniteNumber(receivedNumber: unknown, valueName: string): number {
  if (typeof receivedNumber !== 'number' || !Number.isFinite(receivedNumber)) {
    throw new Error(`${valueName} must be a finite number. Received ${describeMapMakerValue(receivedNumber)}.`);
  }
  return receivedNumber;
}

function requireMapMakerPositiveNumber(receivedNumber: unknown, valueName: string): number {
  const number = requireMapMakerFiniteNumber(receivedNumber, valueName);
  if (number <= 0) {
    throw new Error(`${valueName} must be greater than 0. Received ${describeMapMakerValue(receivedNumber)}.`);
  }
  return number;
}

function requireMapMakerNonNegativeNumber(receivedNumber: unknown, valueName: string): number {
  const number = requireMapMakerFiniteNumber(receivedNumber, valueName);
  if (number < 0) {
    throw new Error(`${valueName} must be non-negative. Received ${describeMapMakerValue(receivedNumber)}.`);
  }
  return number;
}

function requireMapMakerBoolean(receivedBoolean: unknown, valueName: string): boolean {
  if (typeof receivedBoolean !== 'boolean') {
    throw new Error(`${valueName} must be a boolean. Received ${describeMapMakerValue(receivedBoolean)}.`);
  }
  return receivedBoolean;
}

export function requireMapMakerColumns(receivedColumns: unknown): number {
  if (
    typeof receivedColumns !== 'number' ||
    !Number.isInteger(receivedColumns) ||
    receivedColumns < MAP_MAKER_MIN_COLUMNS ||
    receivedColumns > MAP_MAKER_MAX_COLUMNS
  ) {
    throw new Error(
      `Map Maker columns must be an integer from ${MAP_MAKER_MIN_COLUMNS} to ${MAP_MAKER_MAX_COLUMNS}. Received ${describeMapMakerValue(receivedColumns)}.`,
    );
  }
  return receivedColumns;
}

export function requireMapMakerRows(receivedRows: unknown): number {
  if (
    typeof receivedRows !== 'number' ||
    !Number.isInteger(receivedRows) ||
    receivedRows < MAP_MAKER_MIN_ROWS ||
    receivedRows > MAP_MAKER_MAX_ROWS
  ) {
    throw new Error(
      `Map Maker rows must be an integer from ${MAP_MAKER_MIN_ROWS} to ${MAP_MAKER_MAX_ROWS}. Received ${describeMapMakerValue(receivedRows)}.`,
    );
  }
  return receivedRows;
}

export function requireMapMakerRotation(receivedRotation: unknown): MapMakerRotation {
  if (receivedRotation !== 0 && receivedRotation !== 90 && receivedRotation !== 180 && receivedRotation !== 270) {
    throw new Error(
      `Map Maker rotation must be 0, 90, 180, or 270 degrees. Received ${describeMapMakerValue(receivedRotation)}.`,
    );
  }
  return receivedRotation;
}

export function requireMapMakerLayer(receivedLayer: unknown): MapMakerElementLayer {
  if (receivedLayer !== 1 && receivedLayer !== 2) {
    throw new Error(`Map Maker element layer must be 1 or 2. Received ${describeMapMakerValue(receivedLayer)}.`);
  }
  return receivedLayer;
}

export function requireMapMakerId(receivedId: unknown, valueName: string): string {
  if (typeof receivedId !== 'string' || receivedId.length === 0 || receivedId.trim() !== receivedId) {
    throw new Error(`${valueName} must be a non-empty trimmed string. Received ${describeMapMakerValue(receivedId)}.`);
  }
  return receivedId;
}

export function requireMapMakerImageUrl(receivedUrl: unknown): string {
  if (
    typeof receivedUrl !== 'string' ||
    receivedUrl.length === 0 ||
    receivedUrl.trim() !== receivedUrl ||
    /[\\\s]/.test(receivedUrl)
  ) {
    throw new Error(
      `Map Maker image URL must be a non-empty URL without whitespace. Received ${describeMapMakerValue(receivedUrl)}.`,
    );
  }

  const sameOriginPath = receivedUrl.startsWith('/') && !receivedUrl.startsWith('//');
  const absoluteHttpsUrl = /^https:\/\/[^/\\?#]/i.test(receivedUrl);
  if (!sameOriginPath && !absoluteHttpsUrl) {
    throw new Error(
      `Map Maker image URL must be a same-origin root path or an absolute HTTPS URL. Received ${JSON.stringify(receivedUrl)}.`,
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = sameOriginPath ? new URL(receivedUrl, 'https://map-maker.invalid') : new URL(receivedUrl);
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      throw new Error(
        `Map Maker image URL is invalid. Received ${JSON.stringify(receivedUrl)}. Reason: ${error.message}.`,
        { cause: error },
      );
    }
    throw error;
  }

  if (parsedUrl.protocol !== 'https:' || parsedUrl.username.length > 0 || parsedUrl.password.length > 0) {
    throw new Error(
      `Map Maker image URL must use HTTPS or a same-origin root path and must not contain credentials. Received ${JSON.stringify(receivedUrl)}.`,
    );
  }
  return receivedUrl;
}

export function requireMapMakerImageSource(receivedSource: unknown): MapMakerImageSource {
  const source = requireRecord(receivedSource, 'Map Maker image source');
  if (source.kind === 'asset') {
    requireExactFields(source, IMAGE_ASSET_SOURCE_FIELDS, 'Map Maker asset image source');
    const assetId = requireMapMakerId(source.assetId, 'Map Maker asset id');
    getMapMakerAsset(assetId);
    return { kind: 'asset', assetId };
  }
  if (source.kind === 'url') {
    requireExactFields(source, IMAGE_URL_SOURCE_FIELDS, 'Map Maker URL image source');
    return { kind: 'url', url: requireMapMakerImageUrl(source.url) };
  }
  throw new Error(
    `Map Maker image source kind must be asset or url. Received ${describeMapMakerValue(source.kind)}.`,
  );
}

function requireMapMakerGridCell(receivedCell: unknown, columns: number, rows: number): MapMakerGridCell {
  const cell = requireRecord(receivedCell, 'Map Maker base tile coordinate');
  requireExactFields(cell, ['column', 'row'], 'Map Maker base tile coordinate');
  const column = cell.column;
  const row = cell.row;
  if (typeof column !== 'number' || !Number.isInteger(column) || column < 0 || column >= columns) {
    throw new Error(
      `Map Maker base tile column must be an integer from 0 to ${columns - 1}. Received ${describeMapMakerValue(column)}.`,
    );
  }
  if (typeof row !== 'number' || !Number.isInteger(row) || row < 0 || row >= rows) {
    throw new Error(
      `Map Maker base tile row must be an integer from 0 to ${rows - 1}. Received ${describeMapMakerValue(row)}.`,
    );
  }
  return { column, row };
}

function requireMapMakerBaseTile(
  receivedTile: unknown,
  columns: number,
  rows: number,
): MapMakerBaseTile {
  const tile = requireRecord(receivedTile, 'Map Maker base tile');
  requireExactFields(tile, BASE_TILE_FIELDS, 'Map Maker base tile');
  const { column, row } = requireMapMakerGridCell({ column: tile.column, row: tile.row }, columns, rows);
  return {
    column,
    row,
    source: requireMapMakerImageSource(tile.source),
    rotation: requireMapMakerRotation(tile.rotation),
    flipHorizontal: requireMapMakerBoolean(tile.flipHorizontal, 'Map Maker base tile flipHorizontal'),
    flipVertical: requireMapMakerBoolean(tile.flipVertical, 'Map Maker base tile flipVertical'),
  };
}

function requireMapMakerElement(
  receivedElement: unknown,
  mapWidth: number,
  mapHeight: number,
): MapMakerElement {
  const element = requireRecord(receivedElement, 'Map Maker element');
  requireExactFields(element, ELEMENT_FIELDS, 'Map Maker element');
  const id = requireMapMakerId(element.id, 'Map Maker element id');
  const layer = requireMapMakerLayer(element.layer);
  const x = requireMapMakerNonNegativeNumber(element.x, `Map Maker element ${JSON.stringify(id)} x`);
  const y = requireMapMakerNonNegativeNumber(element.y, `Map Maker element ${JSON.stringify(id)} y`);
  const width = requireMapMakerPositiveNumber(element.width, `Map Maker element ${JSON.stringify(id)} width`);
  const height = requireMapMakerPositiveNumber(element.height, `Map Maker element ${JSON.stringify(id)} height`);
  if (x + width > mapWidth || y + height > mapHeight) {
    throw new Error(
      `Map Maker element ${JSON.stringify(id)} must fit inside ${mapWidth} × ${mapHeight}. Received x=${x}, y=${y}, width=${width}, height=${height}.`,
    );
  }
  return {
    id,
    source: requireMapMakerImageSource(element.source),
    layer,
    x,
    y,
    width,
    height,
    rotation: requireMapMakerRotation(element.rotation),
    flipHorizontal: requireMapMakerBoolean(element.flipHorizontal, `Map Maker element ${JSON.stringify(id)} flipHorizontal`),
    flipVertical: requireMapMakerBoolean(element.flipVertical, `Map Maker element ${JSON.stringify(id)} flipVertical`),
  };
}

function requireMapMakerLabel(receivedLabel: unknown, mapWidth: number, mapHeight: number): MapMakerLabel {
  const label = requireRecord(receivedLabel, 'Map Maker text label');
  requireExactFields(label, LABEL_FIELDS, 'Map Maker text label');
  const id = requireMapMakerId(label.id, 'Map Maker text label id');
  if (typeof label.text !== 'string') {
    throw new Error(
      `Map Maker text label ${JSON.stringify(id)} text must be a string. Received ${describeMapMakerValue(label.text)}.`,
    );
  }
  const x = requireMapMakerNonNegativeNumber(label.x, `Map Maker text label ${JSON.stringify(id)} x`);
  const y = requireMapMakerNonNegativeNumber(label.y, `Map Maker text label ${JSON.stringify(id)} y`);
  const width = requireMapMakerPositiveNumber(label.width, `Map Maker text label ${JSON.stringify(id)} width`);
  const height = requireMapMakerPositiveNumber(label.height, `Map Maker text label ${JSON.stringify(id)} height`);
  const fontSize = requireMapMakerPositiveNumber(label.fontSize, `Map Maker text label ${JSON.stringify(id)} fontSize`);
  if (x + width > mapWidth || y + height > mapHeight) {
    throw new Error(
      `Map Maker text label ${JSON.stringify(id)} must fit inside ${mapWidth} × ${mapHeight}. Received x=${x}, y=${y}, width=${width}, height=${height}.`,
    );
  }
  return { id, text: label.text, x, y, width, height, fontSize };
}

function requireMapMakerHexSize(receivedSize: unknown): number {
  const size = requireMapMakerFiniteNumber(receivedSize, 'Map Maker hex size percent');
  const tenths = size * 10;
  const isOneDecimalStep = Math.abs(tenths - Math.round(tenths)) < 1e-8;
  if (
    size < MAP_MAKER_HEX_SIZE_MIN_PERCENT ||
    size > MAP_MAKER_HEX_SIZE_MAX_PERCENT ||
    !isOneDecimalStep
  ) {
    throw new Error(
      `Map Maker hex size percent must be from ${MAP_MAKER_HEX_SIZE_MIN_PERCENT} to ${MAP_MAKER_HEX_SIZE_MAX_PERCENT} in ${MAP_MAKER_HEX_SIZE_STEP_PERCENT} steps. Received ${describeMapMakerValue(receivedSize)}.`,
    );
  }
  return size;
}

function requireMapMakerSettings(receivedSettings: unknown): MapMakerProjectSettings {
  const settings = requireRecord(receivedSettings, 'Map Maker project settings');
  requireExactFields(settings, SETTINGS_FIELDS, 'Map Maker project settings');
  return {
    elementsVisible: requireMapMakerBoolean(settings.elementsVisible, 'Map Maker elementsVisible'),
    labelsVisible: requireMapMakerBoolean(settings.labelsVisible, 'Map Maker labelsVisible'),
    squareGridVisible: requireMapMakerBoolean(settings.squareGridVisible, 'Map Maker squareGridVisible'),
    hexGridVisible: requireMapMakerBoolean(settings.hexGridVisible, 'Map Maker hexGridVisible'),
    hexSizePercent: requireMapMakerHexSize(settings.hexSizePercent),
    snapToGrid: requireMapMakerBoolean(settings.snapToGrid, 'Map Maker snapToGrid'),
    elementResizingEnabled: requireMapMakerBoolean(settings.elementResizingEnabled, 'Map Maker elementResizingEnabled'),
    labelResizingEnabled: requireMapMakerBoolean(settings.labelResizingEnabled, 'Map Maker labelResizingEnabled'),
    labelBordersEnabled: requireMapMakerBoolean(settings.labelBordersEnabled, 'Map Maker labelBordersEnabled'),
  };
}

function requireUniqueIds<T extends { id: string }>(items: readonly T[], valueName: string): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`${valueName} ids must be unique. Received duplicate ${JSON.stringify(item.id)}.`);
    }
    ids.add(item.id);
  }
}

function requireUniqueBaseCells(baseTiles: readonly MapMakerBaseTile[], columns: number, rows: number): void {
  const cellKeys = new Set<string>();
  for (const tile of baseTiles) {
    const cellKey = `${tile.column}:${tile.row}`;
    if (cellKeys.has(cellKey)) {
      throw new Error(`Map Maker base tiles must contain each cell once. Received duplicate ${JSON.stringify(cellKey)}.`);
    }
    cellKeys.add(cellKey);
  }
  if (cellKeys.size !== columns * rows) {
    throw new Error(
      `Map Maker base tiles must contain exactly ${columns * rows} cells. Received ${cellKeys.size}.`,
    );
  }
}

export function cloneMapMakerProject(project: MapMakerProject): MapMakerProject {
  return {
    columns: project.columns,
    rows: project.rows,
    baseTiles: project.baseTiles.map((tile) => ({ ...tile, source: { ...tile.source } })),
    elements: project.elements.map((element) => ({ ...element, source: { ...element.source } })),
    labels: project.labels.map((label) => ({ ...label })),
    settings: { ...project.settings },
  };
}

export function requireMapMakerProject(receivedProject: unknown): MapMakerProject {
  const project = requireRecord(receivedProject, 'Map Maker project');
  requireExactFields(project, PROJECT_FIELDS, 'Map Maker project');
  const columns = requireMapMakerColumns(project.columns);
  const rows = requireMapMakerRows(project.rows);
  const mapWidth = columns * MAP_MAKER_TILE_SIZE;
  const mapHeight = rows * MAP_MAKER_TILE_SIZE;
  if (!Array.isArray(project.baseTiles)) {
    throw new Error(`Map Maker project baseTiles must be an array. Received ${describeMapMakerValue(project.baseTiles)}.`);
  }
  if (!Array.isArray(project.elements)) {
    throw new Error(`Map Maker project elements must be an array. Received ${describeMapMakerValue(project.elements)}.`);
  }
  if (!Array.isArray(project.labels)) {
    throw new Error(`Map Maker project labels must be an array. Received ${describeMapMakerValue(project.labels)}.`);
  }

  const baseTiles = project.baseTiles.map((tile) => requireMapMakerBaseTile(tile, columns, rows));
  requireUniqueBaseCells(baseTiles, columns, rows);
  const elements = project.elements.map((element) => requireMapMakerElement(element, mapWidth, mapHeight));
  const labels = project.labels.map((label) => requireMapMakerLabel(label, mapWidth, mapHeight));
  requireUniqueIds(elements, 'Map Maker element');
  requireUniqueIds(labels, 'Map Maker text label');

  return {
    columns,
    rows,
    baseTiles,
    elements,
    labels,
    settings: requireMapMakerSettings(project.settings),
  };
}

export function assertMapMakerProject(receivedProject: unknown): asserts receivedProject is MapMakerProject {
  requireMapMakerProject(receivedProject);
}

export function requireMapMakerCategory(receivedCategory: unknown): MapMakerAssetCategory {
  if (
    receivedCategory !== 'coastline' &&
    receivedCategory !== 'geography' &&
    receivedCategory !== 'structures' &&
    receivedCategory !== 'water'
  ) {
    throw new Error(
      `Map Maker asset category must be coastline, geography, structures, or water. Received ${describeMapMakerValue(receivedCategory)}.`,
    );
  }
  return receivedCategory;
}

export function requireMapMakerConnections(receivedConnections: unknown): MapMakerConnections {
  if (!Array.isArray(receivedConnections) || receivedConnections.length !== 4) {
    throw new Error(
      `Map Maker asset connections must contain north, east, south, and west edge signatures. Received ${describeMapMakerValue(receivedConnections)}.`,
    );
  }
  const connections = receivedConnections.map((edgeSignature, edgeIndex) => {
    if (
      edgeSignature !== '0' &&
      edgeSignature !== '1' &&
      edgeSignature !== '2' &&
      edgeSignature !== '3' &&
      edgeSignature !== '-1' &&
      edgeSignature !== '-2' &&
      edgeSignature !== '-3' &&
      edgeSignature !== '4'
    ) {
      throw new Error(
        `Map Maker asset edge ${edgeIndex} must be a recognized string signature. Received ${describeMapMakerValue(edgeSignature)}.`,
      );
    }
    return edgeSignature;
  });
  return connections as unknown as MapMakerConnections;
}

export function requireMapMakerBaseTilePatch(receivedPatch: unknown): Partial<Pick<MapMakerBaseTile, 'source' | 'rotation' | 'flipHorizontal' | 'flipVertical'>> {
  const patch = requireRecord(receivedPatch, 'Map Maker base tile patch');
  requireAllowedFields(patch, ['source', 'rotation', 'flipHorizontal', 'flipVertical'], 'Map Maker base tile patch');
  const nextPatch: Partial<Pick<MapMakerBaseTile, 'source' | 'rotation' | 'flipHorizontal' | 'flipVertical'>> = {};
  if ('source' in patch) nextPatch.source = requireMapMakerImageSource(patch.source);
  if ('rotation' in patch) nextPatch.rotation = requireMapMakerRotation(patch.rotation);
  if ('flipHorizontal' in patch) nextPatch.flipHorizontal = requireMapMakerBoolean(patch.flipHorizontal, 'Map Maker base tile flipHorizontal');
  if ('flipVertical' in patch) nextPatch.flipVertical = requireMapMakerBoolean(patch.flipVertical, 'Map Maker base tile flipVertical');
  if (Object.keys(nextPatch).length === 0) {
    throw new Error(`Map Maker base tile patch must change at least one supported field. Received ${describeMapMakerValue(receivedPatch)}.`);
  }
  return nextPatch;
}

export function requireMapMakerElementPatch(receivedPatch: unknown): Partial<Omit<MapMakerElement, 'id'>> {
  const patch = requireRecord(receivedPatch, 'Map Maker element patch');
  const allowedFields = ['source', 'layer', 'x', 'y', 'width', 'height', 'rotation', 'flipHorizontal', 'flipVertical'] as const;
  requireAllowedFields(patch, allowedFields, 'Map Maker element patch');
  const nextPatch: Partial<Omit<MapMakerElement, 'id'>> = {};
  if ('source' in patch) nextPatch.source = requireMapMakerImageSource(patch.source);
  if ('layer' in patch) nextPatch.layer = requireMapMakerLayer(patch.layer);
  if ('x' in patch) nextPatch.x = requireMapMakerNonNegativeNumber(patch.x, 'Map Maker element patch x');
  if ('y' in patch) nextPatch.y = requireMapMakerNonNegativeNumber(patch.y, 'Map Maker element patch y');
  if ('width' in patch) nextPatch.width = requireMapMakerPositiveNumber(patch.width, 'Map Maker element patch width');
  if ('height' in patch) nextPatch.height = requireMapMakerPositiveNumber(patch.height, 'Map Maker element patch height');
  if ('rotation' in patch) nextPatch.rotation = requireMapMakerRotation(patch.rotation);
  if ('flipHorizontal' in patch) nextPatch.flipHorizontal = requireMapMakerBoolean(patch.flipHorizontal, 'Map Maker element patch flipHorizontal');
  if ('flipVertical' in patch) nextPatch.flipVertical = requireMapMakerBoolean(patch.flipVertical, 'Map Maker element patch flipVertical');
  if (Object.keys(nextPatch).length === 0) {
    throw new Error(`Map Maker element patch must change at least one supported field. Received ${describeMapMakerValue(receivedPatch)}.`);
  }
  return nextPatch;
}

export function requireMapMakerLabelPatch(receivedPatch: unknown): Partial<Omit<MapMakerLabel, 'id'>> {
  const patch = requireRecord(receivedPatch, 'Map Maker text label patch');
  const allowedFields = ['text', 'x', 'y', 'width', 'height', 'fontSize'] as const;
  requireAllowedFields(patch, allowedFields, 'Map Maker text label patch');
  const nextPatch: Partial<Omit<MapMakerLabel, 'id'>> = {};
  if ('text' in patch) {
    if (typeof patch.text !== 'string') {
      throw new Error(`Map Maker text label patch text must be a string. Received ${describeMapMakerValue(patch.text)}.`);
    }
    nextPatch.text = patch.text;
  }
  if ('x' in patch) nextPatch.x = requireMapMakerNonNegativeNumber(patch.x, 'Map Maker text label patch x');
  if ('y' in patch) nextPatch.y = requireMapMakerNonNegativeNumber(patch.y, 'Map Maker text label patch y');
  if ('width' in patch) nextPatch.width = requireMapMakerPositiveNumber(patch.width, 'Map Maker text label patch width');
  if ('height' in patch) nextPatch.height = requireMapMakerPositiveNumber(patch.height, 'Map Maker text label patch height');
  if ('fontSize' in patch) nextPatch.fontSize = requireMapMakerPositiveNumber(patch.fontSize, 'Map Maker text label patch fontSize');
  if (Object.keys(nextPatch).length === 0) {
    throw new Error(`Map Maker text label patch must change at least one supported field. Received ${describeMapMakerValue(receivedPatch)}.`);
  }
  return nextPatch;
}

export function requireMapMakerSettingsPatch(receivedPatch: unknown): Partial<MapMakerProjectSettings> {
  const patch = requireRecord(receivedPatch, 'Map Maker settings patch');
  requireAllowedFields(patch, SETTINGS_FIELDS, 'Map Maker settings patch');
  const nextPatch: Partial<MapMakerProjectSettings> = {};
  for (const fieldName of SETTINGS_FIELDS) {
    if (!(fieldName in patch)) continue;
    if (fieldName === 'hexSizePercent') {
      nextPatch.hexSizePercent = requireMapMakerHexSize(patch.hexSizePercent);
    } else {
      nextPatch[fieldName] = requireMapMakerBoolean(patch[fieldName], `Map Maker ${fieldName}`);
    }
  }
  if (Object.keys(nextPatch).length === 0) {
    throw new Error(`Map Maker settings patch must change at least one supported setting. Received ${describeMapMakerValue(receivedPatch)}.`);
  }
  return nextPatch;
}

export function requireMapMakerGridCells(
  receivedCells: unknown,
  columns: number,
  rows: number,
): MapMakerGridCell[] {
  if (!Array.isArray(receivedCells)) {
    throw new Error(`Map Maker grid cells must be an array. Received ${describeMapMakerValue(receivedCells)}.`);
  }
  const cells = receivedCells.map((cell) => requireMapMakerGridCell(cell, columns, rows));
  const keys = new Set<string>();
  for (const cell of cells) {
    const key = `${cell.column}:${cell.row}`;
    if (keys.has(key)) {
      throw new Error(`Map Maker grid cells must be unique. Received duplicate ${JSON.stringify(key)}.`);
    }
    keys.add(key);
  }
  return cells;
}

export function requireMapMakerEntityIds(receivedIds: unknown, valueName: string): string[] {
  if (!Array.isArray(receivedIds)) {
    throw new Error(`${valueName} ids must be an array. Received ${describeMapMakerValue(receivedIds)}.`);
  }
  const ids = receivedIds.map((id) => requireMapMakerId(id, `${valueName} id`));
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${valueName} ids must be unique. Received ${describeMapMakerValue(ids)}.`);
  }
  return ids;
}
