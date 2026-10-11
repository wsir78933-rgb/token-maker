import { getCastleAsset } from './catalog';
import {
  CASTLE_CREATOR_DEFAULT_BACKGROUND_COLOR,
  CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT,
  CASTLE_CREATOR_DEFAULT_CANVAS_WIDTH,
  CASTLE_CREATOR_DEFAULT_LAYER,
  CASTLE_CREATOR_DEFAULT_RESIZE_ENABLED,
  CASTLE_CREATOR_DEFAULT_SNAP_ENABLED,
} from './constants';
import {
  CASTLE_BUILDING_COLORS,
  CASTLE_CATEGORIES,
  CASTLE_LAYER_IDS,
  CASTLE_ROOF_COLORS,
  type CastleAsset,
  type CastleBuildingColor,
  type CastleCanvasSettings,
  type CastleCategory,
  type CastleLayerId,
  type CastlePalette,
  type CastlePiece,
  type CastlePoint,
  type CastleProject,
  type CastleRoofColor,
} from './types';

export const CASTLE_PROJECT_LIMITS = {
  maxCanvasDimension: 8192,
  maxPieceCount: 1000,
  maxPieceDimension: 8192,
} as const;

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const HTTP_URL_PROTOCOLS = new Set(['http:', 'https:']);

export function createCastleProject(): CastleProject {
  return {
    version: 1,
    pieces: [],
    activeLayer: CASTLE_CREATOR_DEFAULT_LAYER,
    visibleLayers: {
      lower: true,
      middle: true,
      upper: true,
    },
    canvas: {
      width: CASTLE_CREATOR_DEFAULT_CANVAS_WIDTH,
      height: CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT,
      backgroundColor: CASTLE_CREATOR_DEFAULT_BACKGROUND_COLOR,
      backgroundImageUrl: null,
    },
    palette: {
      building: 1,
      roof: 1,
    },
    snapEnabled: CASTLE_CREATOR_DEFAULT_SNAP_ENABLED,
    resizeEnabled: CASTLE_CREATOR_DEFAULT_RESIZE_ENABLED,
  };
}

export function validateCastleProject(value: unknown): CastleProject {
  if (!isRecord(value)) {
    throw new Error(`Invalid Castle project: ${describeReceivedValue(value)}.`);
  }

  requireExactKeys(
    value,
    ['version', 'pieces', 'activeLayer', 'visibleLayers', 'canvas', 'palette', 'snapEnabled', 'resizeEnabled'],
    'Castle project',
  );
  if (value.version !== 1) {
    throw new Error(`Invalid Castle project version: ${describeReceivedValue(value.version)}. Expected 1.`);
  }
  if (!Array.isArray(value.pieces)) {
    throw new Error(`Invalid Castle project pieces: ${describeReceivedValue(value.pieces)}.`);
  }
  if (value.pieces.length > CASTLE_PROJECT_LIMITS.maxPieceCount) {
    throw new Error(
      `Invalid Castle project piece count: ${value.pieces.length}; limit is ${CASTLE_PROJECT_LIMITS.maxPieceCount}.`,
    );
  }

  const activeLayer = requireCastleLayerId(value.activeLayer, 'Castle active layer');
  const visibleLayers = readVisibleLayers(value.visibleLayers);
  const canvas = readCastleCanvasSettings(value.canvas, false);
  const palette = readCastlePalette(value.palette);
  const snapEnabled = requireBoolean(value.snapEnabled, 'Castle snap enabled');
  const resizeEnabled = requireBoolean(value.resizeEnabled, 'Castle resize enabled');
  const pieceIds = new Set<string>();
  const pieces = value.pieces.map((pieceValue, pieceIndex) => {
    const piece = readCastlePiece(pieceValue, pieceIndex);
    if (pieceIds.has(piece.id)) {
      throw new Error(`Duplicate Castle piece id: ${JSON.stringify(piece.id)}.`);
    }
    pieceIds.add(piece.id);
    return piece;
  });

  return {
    version: 1,
    pieces,
    activeLayer,
    visibleLayers,
    canvas,
    palette,
    snapEnabled,
    resizeEnabled,
  };
}

export function addCastlePiece(
  project: CastleProject,
  asset: CastleAsset,
  pieceId: string,
  position: CastlePoint,
): CastleProject {
  const validatedProject = validateCastleProject(project);
  const validatedAsset = readCastleAssetArgument(asset);
  const catalogAsset = requireCatalogCastleAsset(validatedAsset.id);
  assertCastleAssetsMatch(validatedAsset, catalogAsset);
  requireNewCastlePieceId(validatedProject, pieceId);
  const validatedPosition = readCastlePoint(position, 'Castle piece position');

  if (validatedProject.pieces.length >= CASTLE_PROJECT_LIMITS.maxPieceCount) {
    throw new Error(
      `Cannot add Castle piece ${JSON.stringify(pieceId)}; piece count limit is ${CASTLE_PROJECT_LIMITS.maxPieceCount}.`,
    );
  }

  const piece: CastlePiece = {
    id: pieceId,
    assetId: validatedAsset.id,
    layerId: validatedProject.activeLayer,
    x: validatedPosition.x,
    y: validatedPosition.y,
    width: validatedAsset.width,
    height: validatedAsset.height,
    buildingColor: validatedProject.palette.building,
    roofColor: validatedProject.palette.roof,
  };

  return {
    ...validatedProject,
    pieces: [...validatedProject.pieces, piece],
  };
}

export function moveCastlePiece(
  project: CastleProject,
  pieceId: string,
  position: CastlePoint,
): CastleProject {
  const validatedProject = validateCastleProject(project);
  const pieceIndex = requireCastlePieceIndex(validatedProject, pieceId);
  const validatedPosition = readCastlePoint(position, 'Castle piece position');
  const nextPosition = validatedProject.snapEnabled
    ? snapCastlePointToGrid(validatedPosition)
    : validatedPosition;

  const pieces = validatedProject.pieces.map((piece, index) => (
    index === pieceIndex
      ? { ...piece, x: nextPosition.x, y: nextPosition.y }
      : piece
  ));
  return { ...validatedProject, pieces };
}

export function moveCastlePieceToLayer(
  project: CastleProject,
  pieceId: string,
  layerId: CastleLayerId,
): CastleProject {
  const validatedProject = validateCastleProject(project);
  const pieceIndex = requireCastlePieceIndex(validatedProject, pieceId);
  const validatedLayerId = requireCastleLayerId(layerId, 'Castle layer id');
  const pieces = validatedProject.pieces.map((piece, index) => (
    index === pieceIndex
      ? { ...piece, layerId: validatedLayerId }
      : piece
  ));

  return { ...validatedProject, pieces };
}

export function resizeCastlePiece(
  project: CastleProject,
  pieceId: string,
  width: number,
): CastleProject {
  const validatedProject = validateCastleProject(project);
  if (!validatedProject.resizeEnabled) {
    throw new Error(`Cannot resize Castle piece ${JSON.stringify(pieceId)} while resize is disabled.`);
  }
  const pieceIndex = requireCastlePieceIndex(validatedProject, pieceId);
  requirePieceDimension(width, `Castle piece ${JSON.stringify(pieceId)} width`);
  const currentPiece = validatedProject.pieces[pieceIndex];
  const height = width * currentPiece.height / currentPiece.width;
  requirePieceDimension(height, `Castle piece ${JSON.stringify(pieceId)} calculated height`);

  const pieces = validatedProject.pieces.map((piece, index) => (
    index === pieceIndex
      ? { ...piece, width, height }
      : piece
  ));
  return { ...validatedProject, pieces };
}

export function copyCastlePiece(
  project: CastleProject,
  pieceId: string,
  newId: string,
): CastleProject {
  const validatedProject = validateCastleProject(project);
  const sourcePiece = validatedProject.pieces[requireCastlePieceIndex(validatedProject, pieceId)];
  requireNewCastlePieceId(validatedProject, newId);

  const copiedPiece: CastlePiece = {
    ...sourcePiece,
    id: newId,
    layerId: validatedProject.activeLayer,
  };
  return {
    ...validatedProject,
    pieces: [...validatedProject.pieces, copiedPiece],
  };
}

export function deleteCastlePiece(project: CastleProject, pieceId: string): CastleProject {
  const validatedProject = validateCastleProject(project);
  const pieceIndex = requireCastlePieceIndex(validatedProject, pieceId);
  return {
    ...validatedProject,
    pieces: validatedProject.pieces.filter((_, index) => index !== pieceIndex),
  };
}

export function bringCastlePieceToFront(project: CastleProject, pieceId: string): CastleProject {
  const validatedProject = validateCastleProject(project);
  const pieceIndex = requireCastlePieceIndex(validatedProject, pieceId);
  const selectedPiece = validatedProject.pieces[pieceIndex];
  const sameLayerPieces = validatedProject.pieces.filter((piece) => piece.layerId === selectedPiece.layerId);
  const currentLayerIndex = sameLayerPieces.findIndex((piece) => piece.id === selectedPiece.id);
  if (currentLayerIndex === sameLayerPieces.length - 1) return validatedProject;

  const reorderedLayerPieces = [
    ...sameLayerPieces.slice(0, currentLayerIndex),
    ...sameLayerPieces.slice(currentLayerIndex + 1),
    selectedPiece,
  ];
  let reorderedLayerIndex = 0;
  const pieces = validatedProject.pieces.map((piece) => {
    if (piece.layerId !== selectedPiece.layerId) return piece;
    const reorderedPiece = reorderedLayerPieces[reorderedLayerIndex];
    reorderedLayerIndex += 1;
    return reorderedPiece;
  });

  return { ...validatedProject, pieces };
}

export function setCastleActiveLayer(project: CastleProject, layerId: CastleLayerId): CastleProject {
  const validatedProject = validateCastleProject(project);
  const validatedLayerId = requireCastleLayerId(layerId, 'Castle active layer');
  return { ...validatedProject, activeLayer: validatedLayerId };
}

export function setCastleLayerVisibility(
  project: CastleProject,
  layerId: CastleLayerId,
  visible: boolean,
): CastleProject {
  const validatedProject = validateCastleProject(project);
  const validatedLayerId = requireCastleLayerId(layerId, 'Castle layer id');
  const validatedVisible = requireBoolean(visible, `Castle layer ${JSON.stringify(layerId)} visibility`);
  return {
    ...validatedProject,
    visibleLayers: {
      ...validatedProject.visibleLayers,
      [validatedLayerId]: validatedVisible,
    },
  };
}

export function clearCastleLayer(project: CastleProject, layerId: CastleLayerId): CastleProject {
  const validatedProject = validateCastleProject(project);
  const validatedLayerId = requireCastleLayerId(layerId, 'Castle layer id');
  return {
    ...validatedProject,
    pieces: validatedProject.pieces.filter((piece) => piece.layerId !== validatedLayerId),
  };
}

export function clearCastlePieces(project: CastleProject): CastleProject {
  const validatedProject = validateCastleProject(project);
  return { ...validatedProject, pieces: [] };
}

export function setCastleCanvasSettings(
  project: CastleProject,
  settings: CastleCanvasSettings,
): CastleProject {
  const validatedProject = validateCastleProject(project);
  const validatedSettings = readCastleCanvasSettings(settings, true);
  return { ...validatedProject, canvas: validatedSettings };
}

function readCastlePiece(value: unknown, pieceIndex: number): CastlePiece {
  if (!isRecord(value)) {
    throw new Error(`Invalid Castle piece at index ${pieceIndex}: ${describeReceivedValue(value)}.`);
  }
  requireExactKeys(
    value,
    ['id', 'assetId', 'layerId', 'x', 'y', 'width', 'height', 'buildingColor', 'roofColor'],
    `Castle piece at index ${pieceIndex}`,
  );
  const id = requireNonEmptyString(value.id, `Castle piece ${pieceIndex} id`);
  const assetId = requireNonEmptyString(value.assetId, `Castle piece ${JSON.stringify(id)} asset id`);
  requireCatalogCastleAsset(assetId);
  const layerId = requireCastleLayerId(value.layerId, `Castle piece ${JSON.stringify(id)} layer id`);
  const position = readCastlePoint(value, `Castle piece ${JSON.stringify(id)} position`);
  const width = requirePieceDimension(value.width, `Castle piece ${JSON.stringify(id)} width`);
  const height = requirePieceDimension(value.height, `Castle piece ${JSON.stringify(id)} height`);
  const buildingColor = requireBuildingColor(value.buildingColor, `Castle piece ${JSON.stringify(id)} building color`);
  const roofColor = requireRoofColor(value.roofColor, `Castle piece ${JSON.stringify(id)} roof color`);

  return {
    id,
    assetId,
    layerId,
    x: position.x,
    y: position.y,
    width,
    height,
    buildingColor,
    roofColor,
  };
}

function readCastleAssetArgument(value: unknown): CastleAsset {
  if (!isRecord(value)) {
    throw new Error(`Invalid Castle asset argument: ${describeReceivedValue(value)}.`);
  }
  const id = requireNonEmptyString(value.id, 'Castle asset id');
  const category = requireCastleCategory(value.category, `Castle asset ${JSON.stringify(id)} category`);
  const assetNumber = requirePositiveInteger(value.number, `Castle asset ${JSON.stringify(id)} number`);
  const width = requirePieceDimension(value.width, `Castle asset ${JSON.stringify(id)} width`);
  const height = requirePieceDimension(value.height, `Castle asset ${JSON.stringify(id)} height`);
  return { id, category, number: assetNumber, width, height };
}

function requireCatalogCastleAsset(assetId: unknown): CastleAsset {
  const validAssetId = requireNonEmptyString(assetId, 'Castle asset id');
  let catalogAsset: unknown;
  try {
    catalogAsset = getCastleAsset(validAssetId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Invalid Castle asset id ${JSON.stringify(validAssetId)}: ${error.message}.`);
    }
    throw error;
  }
  if (!isRecord(catalogAsset)) {
    throw new Error(
      `Castle catalog asset ${JSON.stringify(validAssetId)} returned an invalid value: ${describeReceivedValue(catalogAsset)}.`,
    );
  }
  const catalogAssetId = requireNonEmptyString(catalogAsset.id, `Castle catalog asset ${JSON.stringify(validAssetId)} id`);
  if (catalogAssetId !== validAssetId) {
    throw new Error(
      `Castle catalog asset id mismatch: requested ${JSON.stringify(validAssetId)}, received ${JSON.stringify(catalogAssetId)}.`,
    );
  }
  const category = requireCastleCategory(catalogAsset.category, `Castle catalog asset ${JSON.stringify(validAssetId)} category`);
  const assetNumber = requirePositiveInteger(catalogAsset.number, `Castle catalog asset ${JSON.stringify(validAssetId)} number`);
  const width = requirePieceDimension(catalogAsset.width, `Castle catalog asset ${JSON.stringify(validAssetId)} width`);
  const height = requirePieceDimension(catalogAsset.height, `Castle catalog asset ${JSON.stringify(validAssetId)} height`);
  return { id: catalogAssetId, category, number: assetNumber, width, height };
}

function assertCastleAssetsMatch(asset: CastleAsset, catalogAsset: CastleAsset): void {
  if (
    asset.id !== catalogAsset.id
    || asset.category !== catalogAsset.category
    || asset.number !== catalogAsset.number
    || asset.width !== catalogAsset.width
    || asset.height !== catalogAsset.height
  ) {
    throw new Error(
      `Castle asset ${JSON.stringify(asset.id)} does not match the catalog: received ${describeReceivedValue(asset)}, expected ${describeReceivedValue(catalogAsset)}.`,
    );
  }
}

function readVisibleLayers(value: unknown): Record<CastleLayerId, boolean> {
  if (!isRecord(value)) {
    throw new Error(`Invalid Castle visible layers: ${describeReceivedValue(value)}.`);
  }
  requireExactKeys(value, CASTLE_LAYER_IDS, 'Castle visible layers');
  return {
    lower: requireBoolean(value.lower, 'Castle lower layer visibility'),
    middle: requireBoolean(value.middle, 'Castle middle layer visibility'),
    upper: requireBoolean(value.upper, 'Castle upper layer visibility'),
  };
}

function readCastleCanvasSettings(value: unknown, normalizeHeightZero: boolean): CastleCanvasSettings {
  if (!isRecord(value)) {
    throw new Error(`Invalid Castle canvas settings: ${describeReceivedValue(value)}.`);
  }
  requireExactKeys(value, ['width', 'height', 'backgroundColor', 'backgroundImageUrl'], 'Castle canvas settings');
  const width = requireCanvasWidth(value.width);
  const height = normalizeHeightZero && value.height === 0
    ? CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT
    : requireCanvasHeight(value.height);
  const backgroundColor = requireHexColor(value.backgroundColor, 'Castle background color');
  const backgroundImageUrl = requireBackgroundImageUrl(value.backgroundImageUrl);
  return { width, height, backgroundColor, backgroundImageUrl };
}

function readCastlePalette(value: unknown): CastlePalette {
  if (!isRecord(value)) {
    throw new Error(`Invalid Castle palette: ${describeReceivedValue(value)}.`);
  }
  requireExactKeys(value, ['building', 'roof'], 'Castle palette');
  return {
    building: requireBuildingColor(value.building, 'Castle building palette color'),
    roof: requireRoofColor(value.roof, 'Castle roof palette color'),
  };
}

function readCastlePoint(value: unknown, label: string): CastlePoint {
  if (!isRecord(value)) {
    throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}.`);
  }
  const x = requireFiniteNumber(value.x, `${label} x`);
  const y = requireFiniteNumber(value.y, `${label} y`);
  return { x, y };
}

function requireCastlePieceIndex(project: CastleProject, pieceId: unknown): number {
  const validPieceId = requireNonEmptyString(pieceId, 'Castle piece id');
  const pieceIndex = project.pieces.findIndex((piece) => piece.id === validPieceId);
  if (pieceIndex === -1) {
    throw new Error(`Castle piece ${JSON.stringify(validPieceId)} was not found.`);
  }
  return pieceIndex;
}

function requireNewCastlePieceId(project: CastleProject, pieceId: unknown): asserts pieceId is string {
  const validPieceId = requireNonEmptyString(pieceId, 'Castle piece id');
  if (project.pieces.some((piece) => piece.id === validPieceId)) {
    throw new Error(`Duplicate Castle piece id: ${JSON.stringify(validPieceId)}.`);
  }
}

function snapCastlePointToGrid(point: CastlePoint): CastlePoint {
  return {
    x: Math.round(point.x / 5) * 5,
    y: Math.round(point.y / 5) * 5,
  };
}

function requireCastleCategory(value: unknown, label: string): CastleCategory {
  if (typeof value === 'string' && CASTLE_CATEGORIES.some((category) => category === value)) {
    return value as CastleCategory;
  }
  throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}.`);
}

function requireCastleLayerId(value: unknown, label: string): CastleLayerId {
  if (typeof value === 'string' && CASTLE_LAYER_IDS.some((layerId) => layerId === value)) {
    return value as CastleLayerId;
  }
  throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}.`);
}

function requireBuildingColor(value: unknown, label: string): CastleBuildingColor {
  if (CASTLE_BUILDING_COLORS.some((color) => color === value)) {
    return value as CastleBuildingColor;
  }
  throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}.`);
}

function requireRoofColor(value: unknown, label: string): CastleRoofColor {
  if (CASTLE_ROOF_COLORS.some((color) => color === value)) {
    return value as CastleRoofColor;
  }
  throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}.`);
}

function requireCanvasWidth(value: unknown): number {
  if (
    typeof value !== 'number'
    || !Number.isFinite(value)
    || !Number.isInteger(value)
    || value < 0
    || value > CASTLE_PROJECT_LIMITS.maxCanvasDimension
  ) {
    throw new Error(
      `Invalid Castle canvas width: ${describeReceivedValue(value)}; expected 0 or an integer from 1 to ${CASTLE_PROJECT_LIMITS.maxCanvasDimension}.`,
    );
  }
  return value;
}

function requireCanvasHeight(value: unknown): number {
  if (
    typeof value !== 'number'
    || !Number.isFinite(value)
    || !Number.isInteger(value)
    || value <= 0
    || value > CASTLE_PROJECT_LIMITS.maxCanvasDimension
  ) {
    throw new Error(
      `Invalid Castle canvas height: ${describeReceivedValue(value)}; expected an integer from 1 to ${CASTLE_PROJECT_LIMITS.maxCanvasDimension}.`,
    );
  }
  return value;
}

function requirePieceDimension(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > CASTLE_PROJECT_LIMITS.maxPieceDimension) {
    throw new Error(
      `Invalid ${label}: ${describeReceivedValue(value)}; expected 0-${CASTLE_PROJECT_LIMITS.maxPieceDimension} exclusive of 0.`,
    );
  }
  return value;
}

function requirePositiveInteger(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}; expected a positive integer.`);
  }
  return value;
}

function requireFiniteNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}; expected a finite number.`);
  }
  return value;
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}; expected a boolean.`);
  }
  return value;
}

function requireHexColor(value: unknown, label: string): string {
  if (typeof value !== 'string' || !HEX_COLOR_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}; expected a six-digit hex color.`);
  }
  return value;
}

function requireBackgroundImageUrl(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`Invalid Castle background image URL: ${describeReceivedValue(value)}; expected http(s) URL or null.`);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      throw new Error(`Invalid Castle background image URL: ${describeReceivedValue(value)}; ${error.message}.`);
    }
    throw error;
  }
  if (!HTTP_URL_PROTOCOLS.has(parsedUrl.protocol)) {
    throw new Error(`Invalid Castle background image URL: ${describeReceivedValue(value)}; only http and https are allowed.`);
  }
  return value;
}

function requireNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid ${label}: ${describeReceivedValue(value)}; expected a non-empty string.`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireExactKeys(
  record: Record<string, unknown>,
  expectedKeys: readonly string[],
  label: string,
): void {
  const actualKeys = Object.keys(record).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  if (
    actualKeys.length !== sortedExpectedKeys.length
    || actualKeys.some((key, index) => key !== sortedExpectedKeys[index])
  ) {
    throw new Error(
      `Invalid ${label} keys: received ${describeReceivedValue(actualKeys)}, expected ${describeReceivedValue(sortedExpectedKeys)}.`,
    );
  }
}

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  try {
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${error.message})`;
    }
    throw error;
  }
}
