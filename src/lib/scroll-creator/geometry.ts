import {
  SCROLL_MAX_IMAGE_POSITION,
  SCROLL_MAX_IMAGE_SIZE,
  SCROLL_MAX_HEIGHT,
  SCROLL_MAX_WIDTH,
  SCROLL_MIN_IMAGE_SIZE,
  SCROLL_MIN_HEIGHT,
  SCROLL_MIN_WIDTH,
  type ScrollImageGeometry,
} from './types';

export type ScrollPaperBounds = {
  width: number;
  height: number;
};

export type ScrollImageResizeDelta = {
  width: number;
  height: number;
};

export type ScrollImageResizeCorner =
  | 'north-west'
  | 'north-east'
  | 'south-west'
  | 'south-east';

export function requireScrollImageGeometry(value: unknown, path = 'image geometry'): ScrollImageGeometry {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(path + ' must be an object; received ' + describeGeometryValue(value));
  }
  const record = value as Record<string, unknown>;
  const receivedKeys = Object.keys(record).sort();
  if (receivedKeys.join(',') !== 'height,width,x,y') {
    throw new TypeError(
      path + ' must contain exactly keys height, width, x, y; received ' + receivedKeys.join(', '),
    );
  }
  requireGeometryNumber(record.x, path + '.x', -SCROLL_MAX_IMAGE_POSITION, SCROLL_MAX_IMAGE_POSITION);
  requireGeometryNumber(record.y, path + '.y', -SCROLL_MAX_IMAGE_POSITION, SCROLL_MAX_IMAGE_POSITION);
  requireGeometryNumber(record.width, path + '.width', SCROLL_MIN_IMAGE_SIZE, SCROLL_MAX_IMAGE_SIZE);
  requireGeometryNumber(record.height, path + '.height', SCROLL_MIN_IMAGE_SIZE, SCROLL_MAX_IMAGE_SIZE);
  return { x: record.x, y: record.y, width: record.width, height: record.height };
}

export function requireScrollPaperBounds(value: unknown, path = 'paper bounds'): ScrollPaperBounds {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(path + ' must be an object; received ' + describeGeometryValue(value));
  }
  const record = value as Record<string, unknown>;
  const receivedKeys = Object.keys(record).sort();
  if (receivedKeys.join(',') !== 'height,width') {
    throw new TypeError(
      path + ' must contain exactly keys height, width; received ' + receivedKeys.join(', '),
    );
  }
  requireGeometryNumber(record.width, path + '.width', 1, Number.MAX_SAFE_INTEGER);
  requireGeometryNumber(record.height, path + '.height', 1, Number.MAX_SAFE_INTEGER);
  return { width: record.width, height: record.height };
}

export function clampScrollPaperSize(width: number, height: number): ScrollPaperBounds {
  const roundedWidth = requireFinitePaperSize(width, 'paper width');
  const roundedHeight = requireFinitePaperSize(height, 'paper height');
  return {
    width: clampCoordinate(roundedWidth, SCROLL_MIN_WIDTH, SCROLL_MAX_WIDTH),
    height: clampCoordinate(roundedHeight, SCROLL_MIN_HEIGHT, SCROLL_MAX_HEIGHT),
  };
}

export function clampScrollImageDrag(
  geometry: ScrollImageGeometry,
  paperBounds: ScrollPaperBounds,
): ScrollImageGeometry {
  const validatedGeometry = requireScrollImageGeometry(geometry);
  const validatedBounds = requireScrollPaperBounds(paperBounds);
  return {
    ...validatedGeometry,
    x: clampCoordinate(validatedGeometry.x, 0, Math.max(0, validatedBounds.width - validatedGeometry.width)),
    y: clampCoordinate(validatedGeometry.y, 0, Math.max(0, validatedBounds.height - validatedGeometry.height)),
  };
}

export function resizeScrollImageGeometry(
  geometry: ScrollImageGeometry,
  delta: ScrollImageResizeDelta,
  paperBounds: ScrollPaperBounds,
  corner: ScrollImageResizeCorner = 'south-east',
): ScrollImageGeometry {
  const validatedGeometry = requireScrollImageGeometry(geometry);
  const validatedBounds = requireScrollPaperBounds(paperBounds);
  requireScrollImageResizeCorner(corner);
  if (delta === null || typeof delta !== 'object' || Array.isArray(delta)) {
    throw new TypeError('image resize delta must be an object; received ' + describeGeometryValue(delta));
  }
  const deltaRecord = delta as Record<string, unknown>;
  const deltaKeys = Object.keys(deltaRecord).sort();
  if (deltaKeys.join(',') !== 'height,width') {
    throw new TypeError(
      'image resize delta must contain exactly keys height, width; received ' + deltaKeys.join(', '),
    );
  }
  requireGeometryNumber(deltaRecord.width, 'image resize delta.width', -SCROLL_MAX_IMAGE_SIZE, SCROLL_MAX_IMAGE_SIZE);
  requireGeometryNumber(deltaRecord.height, 'image resize delta.height', -SCROLL_MAX_IMAGE_SIZE, SCROLL_MAX_IMAGE_SIZE);

  const maximumWidth = getMaximumResizeWidth(validatedGeometry, validatedBounds, corner);
  const maximumHeight = getMaximumResizeHeight(validatedGeometry, validatedBounds, corner);
  const width = clampCoordinate(
    validatedGeometry.width + deltaRecord.width,
    SCROLL_MIN_IMAGE_SIZE,
    maximumWidth,
  );
  const height = clampCoordinate(
    validatedGeometry.height + deltaRecord.height,
    SCROLL_MIN_IMAGE_SIZE,
    maximumHeight,
  );
  const widthDelta = width - validatedGeometry.width;
  const heightDelta = height - validatedGeometry.height;
  const nextX = isWestResizeCorner(corner)
    ? validatedGeometry.x - widthDelta
    : validatedGeometry.x;
  const nextY = isNorthResizeCorner(corner)
    ? validatedGeometry.y - heightDelta
    : validatedGeometry.y;

  return {
    x: clampCoordinate(nextX, 0, Math.max(0, validatedBounds.width - width)),
    y: clampCoordinate(nextY, 0, Math.max(0, validatedBounds.height - height)),
    width,
    height,
  };
}

function getMaximumResizeWidth(
  geometry: ScrollImageGeometry,
  paperBounds: ScrollPaperBounds,
  corner: ScrollImageResizeCorner,
): number {
  const availableWidth = isWestResizeCorner(corner)
    ? geometry.x + geometry.width
    : paperBounds.width - geometry.x;
  return Math.min(SCROLL_MAX_IMAGE_SIZE, Math.max(SCROLL_MIN_IMAGE_SIZE, availableWidth));
}

function getMaximumResizeHeight(
  geometry: ScrollImageGeometry,
  paperBounds: ScrollPaperBounds,
  corner: ScrollImageResizeCorner,
): number {
  const availableHeight = isNorthResizeCorner(corner)
    ? geometry.y + geometry.height
    : paperBounds.height - geometry.y;
  return Math.min(SCROLL_MAX_IMAGE_SIZE, Math.max(SCROLL_MIN_IMAGE_SIZE, availableHeight));
}

function isWestResizeCorner(corner: ScrollImageResizeCorner): boolean {
  return corner === 'north-west' || corner === 'south-west';
}

function isNorthResizeCorner(corner: ScrollImageResizeCorner): boolean {
  return corner === 'north-west' || corner === 'north-east';
}

function requireScrollImageResizeCorner(value: unknown): asserts value is ScrollImageResizeCorner {
  if (
    value !== 'north-west' &&
    value !== 'north-east' &&
    value !== 'south-west' &&
    value !== 'south-east'
  ) {
    throw new TypeError(
      'image resize corner must be north-west, north-east, south-west, or south-east; received ' +
        describeGeometryValue(value),
    );
  }
}

function requireGeometryNumber(value: unknown, path: string, minimum: number, maximum: number): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(path + ' must be a finite number; received ' + describeGeometryValue(value));
  }
  if (value < minimum || value > maximum) {
    throw new RangeError(path + ' must be between ' + minimum + ' and ' + maximum + '; received ' + value);
  }
}

function requireFinitePaperSize(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(path + ' must be a finite number; received ' + describeGeometryValue(value));
  }
  return Math.round(value);
}

function clampCoordinate(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function describeGeometryValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array(length=' + value.length + ')';
  return Object.prototype.toString.call(value);
}
