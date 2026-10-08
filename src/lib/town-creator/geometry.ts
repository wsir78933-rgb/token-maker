import { getTownAsset, getTownAssetVariant } from './catalog';
import type { TownObject, TownResizeMode } from './types';

export type TownPoint = { x: number; y: number };

export type TownAssetSize = { width: number; height: number };

export type TownResizeDelta = { dx: number; dy: number };

export type TownResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const TOWN_SNAP_STEP = 5;
const MIN_TOWN_OBJECT_SIZE = 8;
const TOWN_RESIZE_HANDLES: readonly TownResizeHandle[] = [
  'nw',
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
];
const TOWN_RESIZE_MODES: readonly TownResizeMode[] = ['regular', 'line', 'tile', 'connector'];

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? String(value) : serialized;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `${Object.prototype.toString.call(value)} (${error.message})`;
    }

    throw error;
  }
}

function readPlainObject(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object, received ${describeReceivedValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function readFiniteNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number, received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function readPositiveNumber(value: unknown, label: string): number {
  const numberValue = readFiniteNumber(value, label);
  if (numberValue <= 0) {
    throw new Error(`${label} must be greater than 0, received ${describeReceivedValue(value)}.`);
  }

  return numberValue;
}

function readTownPoint(value: unknown, label: string): TownPoint {
  const point = readPlainObject(value, label);
  return {
    x: readFiniteNumber(point.x, `${label}.x`),
    y: readFiniteNumber(point.y, `${label}.y`),
  };
}

function readTownAssetSize(value: unknown): TownAssetSize {
  const assetSize = readPlainObject(value, 'Town asset size');
  return {
    width: readPositiveNumber(assetSize.width, 'Town asset size width'),
    height: readPositiveNumber(assetSize.height, 'Town asset size height'),
  };
}

function readTownResizeDelta(value: unknown): TownResizeDelta {
  const delta = readPlainObject(value, 'Town resize delta');
  return {
    dx: readFiniteNumber(delta.dx, 'Town resize delta dx'),
    dy: readFiniteNumber(delta.dy, 'Town resize delta dy'),
  };
}

function readTownResizeMode(value: unknown): TownResizeMode {
  if (TOWN_RESIZE_MODES.some((mode) => mode === value)) {
    return value as TownResizeMode;
  }

  throw new Error(`Town resize mode is invalid, received ${describeReceivedValue(value)}.`);
}

function readTownResizeHandle(value: unknown): TownResizeHandle {
  if (TOWN_RESIZE_HANDLES.some((handle) => handle === value)) {
    return value as TownResizeHandle;
  }

  throw new Error(`Town resize handle is invalid, received ${describeReceivedValue(value)}.`);
}

function readTownObject(value: unknown): TownObject {
  const object = readPlainObject(value, 'Town object');
  if (typeof object.id !== 'string' || object.id.length === 0) {
    throw new Error(`Town object id must be a non-empty string, received ${describeReceivedValue(object.id)}.`);
  }
  if (typeof object.assetId !== 'string' || object.assetId.length === 0) {
    throw new Error(
      `Town object assetId must be a non-empty string, received ${describeReceivedValue(object.assetId)}.`,
    );
  }
  if (
    object.material !== 'wood' &&
    object.material !== 'stone' &&
    object.material !== 'clay' &&
    object.material !== 'sandstone' &&
    object.material !== 'neutral'
  ) {
    throw new Error(
      `Town object material must be a supported town material, received ${describeReceivedValue(object.material)}.`,
    );
  }

  return {
    id: object.id,
    assetId: object.assetId,
    material: object.material as TownObject['material'],
    x: readFiniteNumber(object.x, `Town object ${JSON.stringify(object.id)} x`),
    y: readFiniteNumber(object.y, `Town object ${JSON.stringify(object.id)} y`),
    width: readPositiveNumber(object.width, `Town object ${JSON.stringify(object.id)} width`),
    height: readPositiveNumber(object.height, `Town object ${JSON.stringify(object.id)} height`),
    rotationDegrees: readFiniteNumber(
      object.rotationDegrees,
      `Town object ${JSON.stringify(object.id)} rotationDegrees`,
    ),
  };
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${label} must be a boolean, received ${describeReceivedValue(value)}.`);
  }

  return value;
}

export function snapTownPoint(point: TownPoint, enabled: boolean): TownPoint {
  const validatedPoint = readTownPoint(point, 'Town snap point');
  requireBoolean(enabled, 'Town snap enabled');

  if (!enabled) {
    return validatedPoint;
  }

  return {
    x: Math.round(validatedPoint.x / TOWN_SNAP_STEP) * TOWN_SNAP_STEP,
    y: Math.round(validatedPoint.y / TOWN_SNAP_STEP) * TOWN_SNAP_STEP,
  };
}

function getHorizontalBounds(
  object: TownObject,
  deltaX: number,
  handle: TownResizeHandle,
): { left: number; right: number } {
  const originalRight = object.x + object.width;
  if (handle.includes('w')) {
    return {
      left: Math.min(object.x + deltaX, originalRight - MIN_TOWN_OBJECT_SIZE),
      right: originalRight,
    };
  }

  if (handle.includes('e')) {
    return {
      left: object.x,
      right: Math.max(object.x + MIN_TOWN_OBJECT_SIZE, originalRight + deltaX),
    };
  }

  return { left: object.x, right: originalRight };
}

function getVerticalBounds(
  object: TownObject,
  deltaY: number,
  handle: TownResizeHandle,
): { top: number; bottom: number } {
  const originalBottom = object.y + object.height;
  if (handle.includes('n')) {
    return {
      top: Math.min(object.y + deltaY, originalBottom - MIN_TOWN_OBJECT_SIZE),
      bottom: originalBottom,
    };
  }

  if (handle.includes('s')) {
    return {
      top: object.y,
      bottom: Math.max(object.y + MIN_TOWN_OBJECT_SIZE, originalBottom + deltaY),
    };
  }

  return { top: object.y, bottom: originalBottom };
}

function resizeFreeformTownObject(
  object: TownObject,
  delta: TownResizeDelta,
  handle: TownResizeHandle,
): TownObject {
  const horizontal = getHorizontalBounds(object, delta.dx, handle);
  const vertical = getVerticalBounds(object, delta.dy, handle);
  return {
    ...object,
    x: horizontal.left,
    y: vertical.top,
    width: horizontal.right - horizontal.left,
    height: vertical.bottom - vertical.top,
  };
}

function resizeLineTownObject(
  object: TownObject,
  assetSize: TownAssetSize,
  delta: TownResizeDelta,
  handle: TownResizeHandle,
): TownObject {
  const horizontal = getHorizontalBounds(object, delta.dx, handle);
  const width = horizontal.right - horizontal.left;
  return {
    ...object,
    x: horizontal.left,
    width,
    height: assetSize.height,
  };
}

function resizeProportionalTownObject(
  object: TownObject,
  assetSize: TownAssetSize,
  delta: TownResizeDelta,
  handle: TownResizeHandle,
): TownObject {
  const ratio = assetSize.width / assetSize.height;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    throw new Error(`Town asset aspect ratio must be finite and greater than 0, received ${String(ratio)}.`);
  }

  const horizontal = getHorizontalBounds(object, delta.dx, handle);
  const vertical = getVerticalBounds(object, delta.dy, handle);
  const requestedWidth = horizontal.right - horizontal.left;
  const requestedHeight = vertical.bottom - vertical.top;
  const minimumWidth = Math.max(MIN_TOWN_OBJECT_SIZE, MIN_TOWN_OBJECT_SIZE * ratio);
  const minimumHeight = Math.max(MIN_TOWN_OBJECT_SIZE, MIN_TOWN_OBJECT_SIZE / ratio);
  let width: number;
  let height: number;

  if (handle === 'e' || handle === 'w') {
    width = Math.max(minimumWidth, requestedWidth);
    height = width / ratio;
  } else if (handle === 'n' || handle === 's') {
    height = Math.max(minimumHeight, requestedHeight);
    width = height * ratio;
  } else {
    const widthFromHeight = requestedHeight * ratio;
    if (widthFromHeight >= requestedWidth) {
      width = Math.max(minimumWidth, widthFromHeight);
      height = width / ratio;
    } else {
      width = Math.max(minimumWidth, requestedWidth);
      height = width / ratio;
    }
  }

  const left = handle.includes('w')
    ? horizontal.right - width
    : handle.includes('e')
      ? horizontal.left
      : object.x + (object.width - width) / 2;
  const top = handle.includes('n')
    ? vertical.bottom - height
    : handle.includes('s')
      ? vertical.top
      : object.y + (object.height - height) / 2;

  return {
    ...object,
    x: left,
    y: top,
    width,
    height,
  };
}

export function resizeTownObject(
  object: TownObject,
  mode: TownResizeMode,
  assetSize: TownAssetSize,
  delta: TownResizeDelta,
  handle: TownResizeHandle,
): TownObject {
  const validatedObject = readTownObject(object);
  const validatedMode = readTownResizeMode(mode);
  const validatedAssetSize = readTownAssetSize(assetSize);
  const validatedDelta = readTownResizeDelta(delta);
  const validatedHandle = readTownResizeHandle(handle);
  getTownAsset(validatedObject.assetId);
  getTownAssetVariant(validatedObject.assetId, validatedObject.material);
  let resizedObject: TownObject;

  if (validatedMode === 'line') {
    resizedObject = resizeLineTownObject(
      validatedObject,
      validatedAssetSize,
      validatedDelta,
      validatedHandle,
    );
  } else if (validatedMode === 'tile') {
    resizedObject = resizeFreeformTownObject(validatedObject, validatedDelta, validatedHandle);
  } else {
    resizedObject = resizeProportionalTownObject(
      validatedObject,
      validatedAssetSize,
      validatedDelta,
      validatedHandle,
    );
  }

  return readTownObject(resizedObject);
}
