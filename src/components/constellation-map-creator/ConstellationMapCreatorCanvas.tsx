'use client';

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import { getConstellationObjectSrc } from '@/lib/constellation-map-creator';
import {
  CONSTELLATION_MAX_DIMENSION,
  type ConstellationObject,
  type ConstellationProject,
  type ConstellationTransform,
} from '@/lib/constellation-map-creator/types';

export interface ConstellationMapCreatorCanvasProps {
  project: ConstellationProject;
  selectedObjectId: string | null;
  draggingEnabled: boolean;
  resizingEnabled: boolean;
  label: string;
  objectLabel: string;
  resizeLabel: string;
  rotateLabel: string;
  interactive?: boolean;
  onSelectObject(objectId: string | null): void;
  onObjectTransform(objectId: string, transform: ConstellationTransform): void;
  onInteractionError(message: string): void;
}

type GestureMode = 'select' | 'drag' | 'resize' | 'rotate';
type RotationHandleSide = 'top' | 'bottom' | 'left' | 'right';

interface CanvasPoint {
  x: number;
  y: number;
}

interface CanvasClientSize {
  width: number;
  height: number;
}

interface PointerGesture {
  pointerId: number;
  objectId: string;
  mode: GestureMode;
  start: CanvasPoint;
  initialTransform: ConstellationTransform;
  initiallySelected: boolean;
  moved: boolean;
  rotationDegrees: number;
  previousPointerAngleDegrees: number | null;
  accumulatedRotationDegrees: number;
}

interface AxisAlignedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RotationHandlePlacement {
  side: RotationHandleSide;
  inward: boolean;
  centerX: number;
  centerY: number;
  radius: number;
  edgeX: number;
  edgeY: number;
  stemX: number;
  stemY: number;
  hit: AxisAlignedRect;
}

interface RotationPlacementScore {
  clearanceError: number;
  inward: boolean;
  overlap: number;
  sideRank: number;
}

interface WidthInterval {
  low: number;
  high: number;
}

const POINTER_MOVE_THRESHOLD = 2;
const MIN_OBJECT_SIZE = 8;
const RESIZE_COORDINATE_DUST = 1e-8;
const RESIZE_HIT_SIZE = 72;
const RESIZE_MARKER_SIZE = 14;
const MIN_TOUCH_CSS_SIZE = 44;
const FALLBACK_TOUCH_LOGICAL_SIZE = 112;
const ROTATION_GAP_CSS_PX = 8;
const ROTATION_VISUAL_RADIUS_CSS_PX = 8;
const ROTATION_HIT_CSS_PX = 44;
const ROTATION_HANDLE_SIDES: readonly RotationHandleSide[] = ['top', 'bottom', 'left', 'right'];

function describeFailure(reason: unknown): string {
  if (reason instanceof Error) return reason.message || `${reason.name} with an empty message.`;
  if (typeof reason === 'string') return reason;
  if (reason === undefined) return 'undefined';
  if (reason === null) return 'null';
  return String(reason);
}

function requireFiniteDimension(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Constellation ${name} must be greater than zero. Received ${String(value)}.`);
  }
  return value;
}

function requireBoolean(value: boolean, name: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`Constellation ${name} must be a boolean. Received ${String(value)}.`);
  }
  return value;
}

function getCanvasPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): CanvasPoint {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    throw new Error(`Constellation pointer coordinates must be finite. Received x=${String(clientX)}, y=${String(clientY)}.`);
  }

  const screenMatrix = svg.getScreenCTM?.();
  let point: CanvasPoint;
  if (screenMatrix && typeof screenMatrix.inverse === 'function') {
    const inverse = screenMatrix.inverse();
    point = {
      x: inverse.a * clientX + inverse.c * clientY + inverse.e,
      y: inverse.b * clientX + inverse.d * clientY + inverse.f,
    };
  } else {
    const rectangle = svg.getBoundingClientRect();
    if (rectangle.width <= 0 || rectangle.height <= 0) {
      throw new Error(`Constellation canvas rectangle must have positive dimensions. Received width=${rectangle.width}, height=${rectangle.height}.`);
    }
    const scale = Math.min(rectangle.width / width, rectangle.height / height);
    if (!Number.isFinite(scale) || scale <= 0) {
      throw new Error(`Constellation canvas scale must be positive. Received ${String(scale)}.`);
    }
    point = {
      x: (clientX - rectangle.left - (rectangle.width - width * scale) / 2) / scale,
      y: (clientY - rectangle.top - (rectangle.height - height * scale) / 2) / scale,
    };
  }

  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error(`Constellation canvas coordinates are invalid. Received x=${String(point.x)}, y=${String(point.y)}.`);
  }
  return point;
}

function getObjectTransform(object: ConstellationObject): ConstellationTransform {
  return { x: object.x, y: object.y, width: object.width, height: object.height };
}

function clamp(value: number, minimum: number, maximum: number): number {
  if (![value, minimum, maximum].every(Number.isFinite)) {
    throw new Error(`Constellation clamp values must be finite. Received value=${String(value)}, minimum=${String(minimum)}, maximum=${String(maximum)}.`);
  }
  return Math.min(maximum, Math.max(minimum, value));
}

function getDraggedTransform(
  transform: ConstellationTransform,
  start: CanvasPoint,
  point: CanvasPoint,
  canvasWidth: number,
  canvasHeight: number,
): ConstellationTransform {
  return {
    x: clamp(transform.x + point.x - start.x, 0, Math.max(0, canvasWidth - transform.width)),
    y: clamp(transform.y + point.y - start.y, 0, Math.max(0, canvasHeight - transform.height)),
    width: transform.width,
    height: transform.height,
  };
}

function getResizedTransform(
  transform: ConstellationTransform,
  start: CanvasPoint,
  point: CanvasPoint,
  canvasWidth: number,
  canvasHeight: number,
): ConstellationTransform {
  if (transform.width <= 0 || transform.height <= 0) {
    throw new Error(`Constellation object dimensions must be positive before resizing. Received width=${String(transform.width)}, height=${String(transform.height)}.`);
  }

  const horizontalDelta = point.x - start.x;
  const verticalDelta = point.y - start.y;
  const sizeDelta = Math.abs(horizontalDelta) >= Math.abs(verticalDelta) ? horizontalDelta : verticalDelta;
  const aspectRatio = transform.height / transform.width;
  const availableWidth = canvasWidth - transform.x;
  const availableHeight = canvasHeight - transform.y;
  if (availableWidth <= 0 || availableHeight <= 0) {
    throw new Error(`Constellation object ${JSON.stringify(transform)} has no available canvas area for resizing. Received canvas=${String(canvasWidth)}×${String(canvasHeight)}.`);
  }
  const maximumWidth = Math.min(availableWidth, availableHeight / aspectRatio);
  const minimumWidth = Math.min(MIN_OBJECT_SIZE, maximumWidth);
  const width = clamp(transform.width + sizeDelta, minimumWidth, Math.max(minimumWidth, maximumWidth));
  return { x: transform.x, y: transform.y, width, height: width * aspectRatio };
}

function getTouchHitArea(
  object: ConstellationObject,
  canvasWidth: number,
  canvasHeight: number,
  minimumLogicalSize: number,
) {
  const hitWidth = Math.min(canvasWidth, Math.max(object.width, minimumLogicalSize));
  const hitHeight = Math.min(canvasHeight, Math.max(object.height, minimumLogicalSize));
  const objectCenterX = object.x + object.width / 2;
  const objectCenterY = object.y + object.height / 2;
  return {
    x: clamp(objectCenterX - hitWidth / 2, 0, Math.max(0, canvasWidth - hitWidth)),
    y: clamp(objectCenterY - hitHeight / 2, 0, Math.max(0, canvasHeight - hitHeight)),
    width: hitWidth,
    height: hitHeight,
  };
}

function getResizeHitArea(
  cornerX: number,
  cornerY: number,
  canvasWidth: number,
  canvasHeight: number,
  minimumLogicalSize: number,
) {
  const requestedHitSize = Math.max(RESIZE_HIT_SIZE, minimumLogicalSize);
  const hitWidth = Math.min(canvasWidth, requestedHitSize);
  const hitHeight = Math.min(canvasHeight, requestedHitSize);
  const unclampedX = cornerX + hitWidth <= canvasWidth ? cornerX : Math.max(0, canvasWidth - hitWidth);
  const unclampedY = cornerY + hitHeight <= canvasHeight ? cornerY : Math.max(0, canvasHeight - hitHeight);
  return {
    x: clamp(unclampedX, 0, Math.max(0, canvasWidth - hitWidth)),
    y: clamp(unclampedY, 0, Math.max(0, canvasHeight - hitHeight)),
    width: hitWidth,
    height: hitHeight,
    markerX: clamp(cornerX, RESIZE_MARKER_SIZE / 2, Math.max(RESIZE_MARKER_SIZE / 2, canvasWidth - RESIZE_MARKER_SIZE / 2)),
    markerY: clamp(cornerY, RESIZE_MARKER_SIZE / 2, Math.max(RESIZE_MARKER_SIZE / 2, canvasHeight - RESIZE_MARKER_SIZE / 2)),
  };
}

function getArrowOffset(event: KeyboardEvent<SVGGElement>): CanvasPoint | null {
  const step = event.shiftKey ? 10 : 1;
  if (event.key === 'ArrowLeft') return { x: -step, y: 0 };
  if (event.key === 'ArrowRight') return { x: step, y: 0 };
  if (event.key === 'ArrowUp') return { x: 0, y: -step };
  if (event.key === 'ArrowDown') return { x: 0, y: step };
  return null;
}

function getResizeDelta(event: KeyboardEvent<SVGGElement>): number | null {
  const step = event.shiftKey ? 10 : 1;
  if (event.key === 'ArrowUp' || event.key === 'ArrowRight') return step;
  if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') return -step;
  return null;
}

function isPrimaryPointer(event: PointerEvent<SVGElement>): boolean {
  return event.button === 0 && event.isPrimary !== false;
}

// Positive degrees are clockwise, the same direction as SVG rotate().
function readRotationDegrees(rotation: number | undefined, label: string): number {
  if (rotation === undefined) return 0;
  if (typeof rotation !== 'number' || !Number.isFinite(rotation)) {
    throw new Error(`Constellation ${label} must be a finite number of degrees or omitted. Received ${String(rotation)}.`);
  }
  return rotation;
}

function isUprightRotation(rotationDegrees: number): boolean {
  const normalized = ((rotationDegrees % 360) + 360) % 360;
  if (!Number.isFinite(normalized)) {
    throw new Error(`Constellation rotation must be a finite number of degrees. Received ${String(rotationDegrees)}.`);
  }
  return normalized === 0;
}

function readRotatedOffset(localX: number, localY: number, rotationDegrees: number): CanvasPoint {
  const radians = (rotationDegrees * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return {
    x: localX * cosine - localY * sine,
    y: localX * sine + localY * cosine,
  };
}

function readLocalPointerDelta(canvasDeltaX: number, canvasDeltaY: number, rotationDegrees: number): CanvasPoint {
  const radians = (rotationDegrees * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return {
    x: canvasDeltaX * cosine + canvasDeltaY * sine,
    y: -canvasDeltaX * sine + canvasDeltaY * cosine,
  };
}

function readObjectCenter(object: ConstellationObject): CanvasPoint {
  if (!Number.isFinite(object.x) || !Number.isFinite(object.y) || !Number.isFinite(object.width) || !Number.isFinite(object.height) || object.width <= 0 || object.height <= 0) {
    throw new Error(`Constellation object ${JSON.stringify(object.id)} needs a finite position and positive size before rotation. Received x=${String(object.x)}, y=${String(object.y)}, width=${String(object.width)}, height=${String(object.height)}.`);
  }
  return { x: object.x + object.width / 2, y: object.y + object.height / 2 };
}

function readPointerAngleDegrees(center: CanvasPoint, point: CanvasPoint): number | null {
  const offsetX = point.x - center.x;
  const offsetY = point.y - center.y;
  if (offsetX === 0 && offsetY === 0) return null;
  const angleDegrees = Math.atan2(offsetY, offsetX) * (180 / Math.PI);
  if (!Number.isFinite(angleDegrees)) {
    throw new Error(`Constellation rotation pointer angle must be finite. Received ${String(angleDegrees)} for point x=${String(point.x)}, y=${String(point.y)}.`);
  }
  return angleDegrees;
}

function readShortestRotationDeltaDegrees(previousAngleDegrees: number, nextAngleDegrees: number): number {
  const rawDeltaDegrees = nextAngleDegrees - previousAngleDegrees;
  if (!Number.isFinite(rawDeltaDegrees)) {
    throw new Error(`Constellation rotation angle change must be finite. Received previous=${String(previousAngleDegrees)}, next=${String(nextAngleDegrees)}.`);
  }
  return ((rawDeltaDegrees + 540) % 360) - 180;
}

function readLocalCornerCanvas(
  transform: ConstellationTransform,
  localX: number,
  localY: number,
  rotationDegrees: number,
): CanvasPoint {
  const offset = readRotatedOffset(localX, localY, rotationDegrees);
  return {
    x: transform.x + transform.width / 2 + offset.x,
    y: transform.y + transform.height / 2 + offset.y,
  };
}

function readAnchoredOrigin(
  anchor: CanvasPoint,
  width: number,
  height: number,
  rotationDegrees: number,
): CanvasPoint {
  const halfOffset = readRotatedOffset(width / 2, height / 2, rotationDegrees);
  return {
    x: anchor.x + halfOffset.x - width / 2,
    y: anchor.y + halfOffset.y - height / 2,
  };
}

function tightenWidthLowerBound(interval: WidthInterval, coefficient: number, bias: number, minimum: number): void {
  if (![coefficient, bias, minimum].every(Number.isFinite)) {
    throw new Error(`Constellation width lower bound must be finite. Received coefficient=${String(coefficient)}, bias=${String(bias)}, minimum=${String(minimum)}.`);
  }
  if (Math.abs(coefficient) <= RESIZE_COORDINATE_DUST) {
    if (bias < minimum - RESIZE_COORDINATE_DUST) {
      interval.low = Number.POSITIVE_INFINITY;
      interval.high = Number.NEGATIVE_INFINITY;
    }
    return;
  }
  const bound = (minimum - bias) / coefficient;
  if (!Number.isFinite(bound)) {
    throw new Error(`Constellation width lower bound is not finite. Received coefficient=${String(coefficient)}, bias=${String(bias)}, minimum=${String(minimum)}.`);
  }
  if (coefficient > 0) interval.low = Math.max(interval.low, bound);
  else interval.high = Math.min(interval.high, bound);
}

function tightenWidthUpperBound(interval: WidthInterval, coefficient: number, bias: number, maximum: number): void {
  if (![coefficient, bias, maximum].every(Number.isFinite)) {
    throw new Error(`Constellation width upper bound must be finite. Received coefficient=${String(coefficient)}, bias=${String(bias)}, maximum=${String(maximum)}.`);
  }
  if (Math.abs(coefficient) <= RESIZE_COORDINATE_DUST) {
    if (bias > maximum + RESIZE_COORDINATE_DUST) {
      interval.low = Number.POSITIVE_INFINITY;
      interval.high = Number.NEGATIVE_INFINITY;
    }
    return;
  }
  const bound = (maximum - bias) / coefficient;
  if (!Number.isFinite(bound)) {
    throw new Error(`Constellation width upper bound is not finite. Received coefficient=${String(coefficient)}, bias=${String(bias)}, maximum=${String(maximum)}.`);
  }
  if (coefficient > 0) interval.high = Math.min(interval.high, bound);
  else interval.low = Math.max(interval.low, bound);
}

function readAnchoredWidthInterval(
  anchor: CanvasPoint,
  aspectRatio: number,
  rotationDegrees: number,
  canvasWidth: number,
  canvasHeight: number,
): WidthInterval {
  if (!(aspectRatio > 0) || !Number.isFinite(aspectRatio)) {
    throw new Error(`Constellation resize aspect ratio must be positive. Received ${String(aspectRatio)}.`);
  }
  const radians = (rotationDegrees * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const originXCoefficient = 0.5 * (cosine - aspectRatio * sine - 1);
  const originYCoefficient = 0.5 * (sine + aspectRatio * cosine - aspectRatio);
  const interval = {
    low: RESIZE_COORDINATE_DUST,
    high: Math.min(CONSTELLATION_MAX_DIMENSION, CONSTELLATION_MAX_DIMENSION / aspectRatio),
  };
  tightenWidthLowerBound(interval, originXCoefficient, anchor.x, 0);
  tightenWidthLowerBound(interval, originYCoefficient, anchor.y, 0);
  tightenWidthUpperBound(interval, originXCoefficient + 1, anchor.x, canvasWidth);
  tightenWidthUpperBound(interval, originYCoefficient + aspectRatio, anchor.y, canvasHeight);
  return interval;
}

function storedBoxFitsCanvas(
  transform: ConstellationTransform,
  canvasWidth: number,
  canvasHeight: number,
): boolean {
  return transform.x >= -RESIZE_COORDINATE_DUST
    && transform.y >= -RESIZE_COORDINATE_DUST
    && transform.x + transform.width <= canvasWidth + RESIZE_COORDINATE_DUST
    && transform.y + transform.height <= canvasHeight + RESIZE_COORDINATE_DUST;
}

function extendIntervalToStoredWidth(interval: WidthInterval, width: number): void {
  if (width < interval.low && width >= interval.low - RESIZE_COORDINATE_DUST) interval.low = width;
  if (width > interval.high && width <= interval.high + RESIZE_COORDINATE_DUST) interval.high = width;
}

function snapResizedOrigin(value: number, axis: 'x' | 'y'): number {
  if (value >= 0) return value;
  if (value >= -RESIZE_COORDINATE_DUST) return 0;
  throw new Error(`Constellation resized origin ${axis} must be non-negative. Received ${String(value)}.`);
}

function getAnchoredResizedTransform(
  transform: ConstellationTransform,
  sizeDelta: number,
  canvasWidth: number,
  canvasHeight: number,
  rotationDegrees: number,
): ConstellationTransform {
  if (transform.width <= 0 || transform.height <= 0) {
    throw new Error(`Constellation object dimensions must be positive before resizing. Received width=${String(transform.width)}, height=${String(transform.height)}.`);
  }
  if (!Number.isFinite(sizeDelta)) {
    throw new Error(`Constellation resize delta must be finite. Received ${String(sizeDelta)}.`);
  }
  if (!Number.isFinite(canvasWidth) || canvasWidth <= 0 || !Number.isFinite(canvasHeight) || canvasHeight <= 0) {
    throw new Error(`Constellation canvas dimensions must be positive before resizing. Received canvas=${String(canvasWidth)}×${String(canvasHeight)}.`);
  }
  const aspectRatio = transform.height / transform.width;
  const anchor = readLocalCornerCanvas(transform, -transform.width / 2, -transform.height / 2, rotationDegrees);
  const interval = readAnchoredWidthInterval(anchor, aspectRatio, rotationDegrees, canvasWidth, canvasHeight);
  if (storedBoxFitsCanvas(transform, canvasWidth, canvasHeight)) extendIntervalToStoredWidth(interval, transform.width);
  if (!(interval.low <= interval.high + RESIZE_COORDINATE_DUST)) {
    throw new Error(`Constellation object ${JSON.stringify(transform)} has no available canvas area for resizing. Received canvas=${String(canvasWidth)}×${String(canvasHeight)}, rotation=${String(rotationDegrees)}, width interval low=${String(interval.low)}, high=${String(interval.high)}.`);
  }
  const legalLow = Math.max(interval.low, Math.min(MIN_OBJECT_SIZE, interval.high));
  const legalHigh = Math.max(legalLow, interval.high);
  const width = clamp(transform.width + sizeDelta, legalLow, legalHigh);
  if (Math.abs(width - transform.width) <= RESIZE_COORDINATE_DUST) {
    return { x: transform.x, y: transform.y, width: transform.width, height: transform.height };
  }
  const height = width * aspectRatio;
  if (!(height > 0) || !Number.isFinite(height)) {
    throw new Error(`Constellation resized height must be positive. Received height=${String(height)} from width=${String(width)}.`);
  }
  const origin = readAnchoredOrigin(anchor, width, height, rotationDegrees);
  const x = snapResizedOrigin(origin.x, 'x');
  const y = snapResizedOrigin(origin.y, 'y');
  if (x + width > canvasWidth + RESIZE_COORDINATE_DUST || y + height > canvasHeight + RESIZE_COORDINATE_DUST) {
    throw new Error(`Constellation resized box leaves the canvas. Received x=${String(x)}, y=${String(y)}, width=${String(width)}, height=${String(height)}, canvas=${String(canvasWidth)}×${String(canvasHeight)}.`);
  }
  return { x, y, width, height };
}

function rectangleCoversPoint(rect: AxisAlignedRect, point: CanvasPoint): boolean {
  return point.x >= rect.x
    && point.x <= rect.x + rect.width
    && point.y >= rect.y
    && point.y <= rect.y + rect.height;
}

function rectangleInsideCanvas(rect: AxisAlignedRect, canvasWidth: number, canvasHeight: number): boolean {
  return rect.x >= 0
    && rect.y >= 0
    && rect.x + rect.width <= canvasWidth
    && rect.y + rect.height <= canvasHeight;
}

function rectangleIntersectionArea(first: AxisAlignedRect, second: AxisAlignedRect): number {
  const width = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
  const height = Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);
  if (width <= 0 || height <= 0) return 0;
  return width * height;
}

function circleCoversPoint(centerX: number, centerY: number, radius: number, point: CanvasPoint): boolean {
  return Math.hypot(centerX - point.x, centerY - point.y) <= radius;
}

function circleInsideRect(
  centerX: number,
  centerY: number,
  radius: number,
  rect: AxisAlignedRect,
): boolean {
  return centerX - radius >= rect.x
    && centerY - radius >= rect.y
    && centerX + radius <= rect.x + rect.width
    && centerY + radius <= rect.y + rect.height;
}

function circleInsideCanvas(
  centerX: number,
  centerY: number,
  radius: number,
  canvasWidth: number,
  canvasHeight: number,
): boolean {
  return centerX - radius >= 0
    && centerY - radius >= 0
    && centerX + radius <= canvasWidth
    && centerY + radius <= canvasHeight;
}

function shiftRectOffPoint(
  rect: AxisAlignedRect,
  point: CanvasPoint,
  canvasWidth: number,
  canvasHeight: number,
): AxisAlignedRect {
  if (!rectangleCoversPoint(rect, point)) return rect;
  const candidates = [
    { x: point.x - rect.width - 0.01, y: rect.y },
    { x: point.x + 0.01, y: rect.y },
    { x: rect.x, y: point.y - rect.height - 0.01 },
    { x: rect.x, y: point.y + 0.01 },
  ];
  for (const candidate of candidates) {
    const shifted = {
      x: clamp(candidate.x, 0, Math.max(0, canvasWidth - rect.width)),
      y: clamp(candidate.y, 0, Math.max(0, canvasHeight - rect.height)),
      width: rect.width,
      height: rect.height,
    };
    if (!rectangleCoversPoint(shifted, point) && rectangleInsideCanvas(shifted, canvasWidth, canvasHeight)) return shifted;
  }
  return rect;
}

function readVisibleResizeHit(
  corner: CanvasPoint,
  objectCenter: CanvasPoint,
  objectId: string,
  canvasWidth: number,
  canvasHeight: number,
  minimumLogicalSize: number,
) {
  const hit = getResizeHitArea(corner.x, corner.y, canvasWidth, canvasHeight, minimumLogicalSize);
  const shifted = shiftRectOffPoint(
    { x: hit.x, y: hit.y, width: hit.width, height: hit.height },
    objectCenter,
    canvasWidth,
    canvasHeight,
  );
  if (rectangleCoversPoint(shifted, objectCenter)) {
    throw new Error(`Constellation resize hit covers the center of object ${JSON.stringify(objectId)}. Received hit x=${String(shifted.x)}, y=${String(shifted.y)}, width=${String(shifted.width)}, height=${String(shifted.height)}; center x=${String(objectCenter.x)}, y=${String(objectCenter.y)}.`);
  }
  return { ...hit, x: shifted.x, y: shifted.y };
}

function readSelectionEdgeOffset(side: RotationHandleSide, width: number, height: number): CanvasPoint {
  if (side === 'top') return { x: 0, y: -height / 2 };
  if (side === 'bottom') return { x: 0, y: height / 2 };
  if (side === 'left') return { x: -width / 2, y: 0 };
  if (side === 'right') return { x: width / 2, y: 0 };
  throw new Error(`Constellation rotation handle side must be top, bottom, left, or right. Received ${String(side)}.`);
}

function readOutwardOffset(side: RotationHandleSide): CanvasPoint {
  if (side === 'top') return { x: 0, y: -1 };
  if (side === 'bottom') return { x: 0, y: 1 };
  if (side === 'left') return { x: -1, y: 0 };
  if (side === 'right') return { x: 1, y: 0 };
  throw new Error(`Constellation rotation handle side must be top, bottom, left, or right. Received ${String(side)}.`);
}

function readEdgeAxis(side: RotationHandleSide): CanvasPoint {
  if (side === 'top' || side === 'bottom') return { x: 1, y: 0 };
  if (side === 'left' || side === 'right') return { x: 0, y: 1 };
  throw new Error(`Constellation rotation handle side must be top, bottom, left, or right. Received ${String(side)}.`);
}

function readSideSegmentPoint(
  side: RotationHandleSide,
  width: number,
  height: number,
  localX: number,
  localY: number,
): CanvasPoint {
  if (side === 'top' || side === 'bottom') {
    const edgeY = side === 'top' ? -height / 2 : height / 2;
    return { x: clamp(localX, -width / 2, width / 2), y: edgeY };
  }
  if (side === 'left' || side === 'right') {
    const edgeX = side === 'left' ? -width / 2 : width / 2;
    return { x: edgeX, y: clamp(localY, -height / 2, height / 2) };
  }
  throw new Error(`Constellation rotation handle side must be top, bottom, left, or right. Received ${String(side)}.`);
}

function readCanvasSlide(
  baseX: number,
  baseY: number,
  alongX: number,
  alongY: number,
  radius: number,
  canvasWidth: number,
  canvasHeight: number,
): number | null {
  if (canvasWidth < radius * 2 || canvasHeight < radius * 2) return null;
  let low = Number.NEGATIVE_INFINITY;
  let high = Number.POSITIVE_INFINITY;
  const axes = [
    { base: baseX, along: alongX, minimum: radius, maximum: canvasWidth - radius },
    { base: baseY, along: alongY, minimum: radius, maximum: canvasHeight - radius },
  ];
  for (const axis of axes) {
    if (Math.abs(axis.along) < 1e-9) {
      if (axis.base < axis.minimum || axis.base > axis.maximum) return null;
      continue;
    }
    const towardMinimum = (axis.minimum - axis.base) / axis.along;
    const towardMaximum = (axis.maximum - axis.base) / axis.along;
    low = Math.max(low, Math.min(towardMinimum, towardMaximum));
    high = Math.min(high, Math.max(towardMinimum, towardMaximum));
  }
  if (!(low <= high)) return null;
  return clamp(0, low, high);
}

function readRotationHitRect(
  centerX: number,
  centerY: number,
  radius: number,
  objectCenter: CanvasPoint,
  hitSize: number,
  canvasWidth: number,
  canvasHeight: number,
): AxisAlignedRect | null {
  if (!(hitSize > 0) || hitSize > canvasWidth || hitSize > canvasHeight) return null;
  const circleLeft = centerX - radius;
  const circleTop = centerY - radius;
  const circleRight = centerX + radius;
  const circleBottom = centerY + radius;
  const minLeft = Math.max(0, circleRight - hitSize);
  const maxLeft = Math.min(circleLeft, canvasWidth - hitSize);
  const minTop = Math.max(0, circleBottom - hitSize);
  const maxTop = Math.min(circleTop, canvasHeight - hitSize);
  if (minLeft > maxLeft || minTop > maxTop) return null;
  const awayX = centerX - objectCenter.x;
  const awayY = centerY - objectCenter.y;
  const candidates = [
    { x: awayX >= 0 ? maxLeft : minLeft, y: awayY >= 0 ? maxTop : minTop },
    { x: minLeft, y: minTop },
    { x: maxLeft, y: maxTop },
    { x: minLeft, y: maxTop },
    { x: maxLeft, y: minTop },
  ];
  for (const candidate of candidates) {
    const rect = { x: candidate.x, y: candidate.y, width: hitSize, height: hitSize };
    if (!rectangleInsideCanvas(rect, canvasWidth, canvasHeight)) continue;
    if (!circleInsideRect(centerX, centerY, radius, rect)) continue;
    if (rectangleCoversPoint(rect, objectCenter)) continue;
    return rect;
  }
  return null;
}

function readStemEnd(centerX: number, centerY: number, radius: number, edgeX: number, edgeY: number): CanvasPoint {
  const towardX = edgeX - centerX;
  const towardY = edgeY - centerY;
  const distance = Math.hypot(towardX, towardY);
  if (!Number.isFinite(distance) || distance <= radius) return { x: centerX, y: centerY };
  return {
    x: centerX + (towardX / distance) * radius,
    y: centerY + (towardY / distance) * radius,
  };
}

function readRotatedCorner(object: ConstellationObject, rotationDegrees: number): CanvasPoint {
  const center = readObjectCenter(object);
  const offset = readRotatedOffset(object.width / 2, object.height / 2, rotationDegrees);
  return { x: center.x + offset.x, y: center.y + offset.y };
}

function readPointToSegmentDistance(point: CanvasPoint, start: CanvasPoint, end: CanvasPoint): number {
  const offsetX = end.x - start.x;
  const offsetY = end.y - start.y;
  const lengthSquared = offsetX * offsetX + offsetY * offsetY;
  if (!Number.isFinite(lengthSquared)) {
    throw new Error(`Constellation segment length must be finite. Received start x=${String(start.x)}, y=${String(start.y)}; end x=${String(end.x)}, y=${String(end.y)}.`);
  }
  if (lengthSquared === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  const unclampedT = ((point.x - start.x) * offsetX + (point.y - start.y) * offsetY) / lengthSquared;
  const t = clamp(unclampedT, 0, 1);
  return Math.hypot(point.x - (start.x + offsetX * t), point.y - (start.y + offsetY * t));
}

function readSelectionClearance(
  centerX: number,
  centerY: number,
  radius: number,
  object: ConstellationObject,
  rotationDegrees: number,
): number {
  const transform = { x: object.x, y: object.y, width: object.width, height: object.height };
  const corners = [
    readLocalCornerCanvas(transform, -object.width / 2, -object.height / 2, rotationDegrees),
    readLocalCornerCanvas(transform, object.width / 2, -object.height / 2, rotationDegrees),
    readLocalCornerCanvas(transform, object.width / 2, object.height / 2, rotationDegrees),
    readLocalCornerCanvas(transform, -object.width / 2, object.height / 2, rotationDegrees),
  ];
  const point = { x: centerX, y: centerY };
  let nearest = Number.POSITIVE_INFINITY;
  for (let index = 0; index < corners.length; index += 1) {
    const start = corners[index];
    const end = corners[(index + 1) % corners.length];
    if (start === undefined || end === undefined) {
      throw new Error(`Constellation selection corner ${String(index)} is missing.`);
    }
    nearest = Math.min(nearest, readPointToSegmentDistance(point, start, end));
  }
  if (!Number.isFinite(nearest)) {
    throw new Error(`Constellation handle clearance must be finite. Received ${String(nearest)} for object ${JSON.stringify(object.id)}.`);
  }
  return nearest - radius;
}

function rotationPlacementIsCloser(candidate: RotationPlacementScore, current: RotationPlacementScore): boolean {
  const tolerance = 1e-4;
  if (candidate.clearanceError < current.clearanceError - tolerance) return true;
  if (candidate.clearanceError > current.clearanceError + tolerance) return false;
  if (candidate.inward !== current.inward) return !candidate.inward;
  if (candidate.overlap < current.overlap - tolerance) return true;
  if (candidate.overlap > current.overlap + tolerance) return false;
  return candidate.sideRank < current.sideRank;
}

function chooseRotationHandlePlacement(
  object: ConstellationObject,
  rotationDegrees: number,
  gap: number,
  radius: number,
  hitSize: number,
  canvasWidth: number,
  canvasHeight: number,
  resizeHit: AxisAlignedRect | null,
  resizeMarkerCenter: CanvasPoint | null,
): RotationHandlePlacement {
  const objectCenter = readObjectCenter(object);
  let bestPlacement: RotationHandlePlacement | null = null;
  let bestScore: RotationPlacementScore | null = null;
  for (const inward of [false, true]) {
    for (const side of ROTATION_HANDLE_SIDES) {
      const edge = readSelectionEdgeOffset(side, object.width, object.height);
      const outward = readOutwardOffset(side);
      const direction = inward ? -1 : 1;
      const handleLocal = {
        x: edge.x + outward.x * (gap + radius) * direction,
        y: edge.y + outward.y * (gap + radius) * direction,
      };
      const rotatedHandle = readRotatedOffset(handleLocal.x, handleLocal.y, rotationDegrees);
      const edgeAxis = readEdgeAxis(side);
      const along = readRotatedOffset(edgeAxis.x, edgeAxis.y, rotationDegrees);
      const baseX = objectCenter.x + rotatedHandle.x;
      const baseY = objectCenter.y + rotatedHandle.y;
      const slide = readCanvasSlide(baseX, baseY, along.x, along.y, radius, canvasWidth, canvasHeight);
      if (slide === null) continue;
      const centerX = baseX + along.x * slide;
      const centerY = baseY + along.y * slide;
      if (!circleInsideCanvas(centerX, centerY, radius, canvasWidth, canvasHeight)) continue;
      if (circleCoversPoint(centerX, centerY, radius, objectCenter)) continue;
      if (resizeMarkerCenter !== null && circleCoversPoint(centerX, centerY, radius, resizeMarkerCenter)) continue;
      const hit = readRotationHitRect(centerX, centerY, radius, objectCenter, hitSize, canvasWidth, canvasHeight);
      if (hit === null) continue;
      if (resizeMarkerCenter !== null && rectangleCoversPoint(hit, resizeMarkerCenter)) continue;
      const clearance = readSelectionClearance(centerX, centerY, radius, object, rotationDegrees);
      const overlap = resizeHit === null ? 0 : rectangleIntersectionArea(hit, resizeHit);
      const candidateScore = {
        clearanceError: Math.abs(clearance - gap),
        inward,
        overlap,
        sideRank: ROTATION_HANDLE_SIDES.indexOf(side),
      };
      if (bestScore !== null && !rotationPlacementIsCloser(candidateScore, bestScore)) continue;
      const localCenter = readLocalPointerDelta(centerX - objectCenter.x, centerY - objectCenter.y, rotationDegrees);
      const localEdge = readSideSegmentPoint(side, object.width, object.height, localCenter.x, localCenter.y);
      const rotatedEdge = readRotatedOffset(localEdge.x, localEdge.y, rotationDegrees);
      const edgeX = objectCenter.x + rotatedEdge.x;
      const edgeY = objectCenter.y + rotatedEdge.y;
      const stemEnd = readStemEnd(centerX, centerY, radius, edgeX, edgeY);
      bestScore = candidateScore;
      bestPlacement = {
        side,
        inward,
        centerX,
        centerY,
        radius,
        edgeX,
        edgeY,
        stemX: stemEnd.x,
        stemY: stemEnd.y,
        hit,
      };
    }
  }
  if (bestPlacement === null) {
    throw new Error(`Constellation rotation handle does not fit for object ${JSON.stringify(object.id)} on canvas ${String(canvasWidth)}×${String(canvasHeight)}. Received x=${String(object.x)}, y=${String(object.y)}, width=${String(object.width)}, height=${String(object.height)}, rotation=${String(rotationDegrees)}.`);
  }
  return bestPlacement;
}

function buildRotationIconPath(radius: number): string {
  const arc = radius * 0.45;
  const startX = -arc * 0.2;
  const startY = -arc;
  const endX = arc * 0.75;
  const endY = -arc * 0.35;
  const head = radius * 0.28;
  return `M ${String(startX)} ${String(startY)} A ${String(arc)} ${String(arc)} 0 1 1 ${String(endX)} ${String(endY)} M ${String(endX - head)} ${String(endY - head * 0.2)} L ${String(endX)} ${String(endY)} L ${String(endX - head * 0.15)} ${String(endY + head)}`;
}

function readRotationKeyDelta(event: KeyboardEvent<SVGGElement>): number | null {
  const step = event.shiftKey ? 10 : 1;
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') return step;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') return -step;
  return null;
}

function readGestureTransform(
  gesture: PointerGesture,
  point: CanvasPoint,
  canvasWidth: number,
  canvasHeight: number,
): ConstellationTransform {
  if (gesture.mode === 'drag') {
    return getDraggedTransform(gesture.initialTransform, gesture.start, point, canvasWidth, canvasHeight);
  }
  if (gesture.mode === 'resize') {
    if (isUprightRotation(gesture.rotationDegrees)) {
      return getResizedTransform(gesture.initialTransform, gesture.start, point, canvasWidth, canvasHeight);
    }
    const localDelta = readLocalPointerDelta(
      point.x - gesture.start.x,
      point.y - gesture.start.y,
      gesture.rotationDegrees,
    );
    const sizeDelta = Math.abs(localDelta.x) >= Math.abs(localDelta.y) ? localDelta.x : localDelta.y;
    return getAnchoredResizedTransform(
      gesture.initialTransform,
      sizeDelta,
      canvasWidth,
      canvasHeight,
      gesture.rotationDegrees,
    );
  }
  if (gesture.mode !== 'rotate') {
    throw new Error(`Constellation gesture mode cannot change an object. Received ${gesture.mode}.`);
  }
  const center = {
    x: gesture.initialTransform.x + gesture.initialTransform.width / 2,
    y: gesture.initialTransform.y + gesture.initialTransform.height / 2,
  };
  const pointerAngle = readPointerAngleDegrees(center, point);
  if (pointerAngle !== null && gesture.previousPointerAngleDegrees !== null) {
    gesture.accumulatedRotationDegrees += readShortestRotationDeltaDegrees(
      gesture.previousPointerAngleDegrees,
      pointerAngle,
    );
    gesture.previousPointerAngleDegrees = pointerAngle;
  } else if (pointerAngle !== null) {
    gesture.previousPointerAngleDegrees = pointerAngle;
  }
  return {
    x: gesture.initialTransform.x,
    y: gesture.initialTransform.y,
    width: gesture.initialTransform.width,
    height: gesture.initialTransform.height,
    rotation: gesture.rotationDegrees + gesture.accumulatedRotationDegrees,
  };
}

export function ConstellationMapCreatorCanvas({
  project,
  selectedObjectId,
  draggingEnabled,
  resizingEnabled,
  label,
  objectLabel,
  resizeLabel,
  rotateLabel,
  interactive = true,
  onSelectObject,
  onObjectTransform,
  onInteractionError,
}: ConstellationMapCreatorCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gestureRef = useRef<PointerGesture | null>(null);
  const [focusedObjectId, setFocusedObjectId] = useState<string | null>(null);
  const [focusedResizeObjectId, setFocusedResizeObjectId] = useState<string | null>(null);
  const [focusedRotationObjectId, setFocusedRotationObjectId] = useState<string | null>(null);
  const [canvasClientSize, setCanvasClientSize] = useState<CanvasClientSize>({ width: 0, height: 0 });
  const width = requireFiniteDimension(project.width, 'canvas width');
  const height = requireFiniteDimension(project.height, 'canvas height');
  requireBoolean(draggingEnabled, 'draggingEnabled');
  requireBoolean(resizingEnabled, 'resizingEnabled');

  useLayoutEffect(() => {
    const canvasElement = svgRef.current;
    if (!canvasElement) return undefined;
    const measuredCanvas = canvasElement;

    function updateCanvasClientSize(): void {
      const rectangle = measuredCanvas.getBoundingClientRect();
      if (rectangle.width <= 0 || rectangle.height <= 0) return;
      setCanvasClientSize((previousSize) => (
        previousSize.width === rectangle.width && previousSize.height === rectangle.height
          ? previousSize
          : { width: rectangle.width, height: rectangle.height }
      ));
    }

    updateCanvasClientSize();
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(updateCanvasClientSize);
      observer.observe(measuredCanvas);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', updateCanvasClientSize);
    return () => window.removeEventListener('resize', updateCanvasClientSize);
  }, [height, width]);

  const logicalPixelsPerCssPixel = canvasClientSize.width > 0 && canvasClientSize.height > 0
    ? Math.max(width / canvasClientSize.width, height / canvasClientSize.height)
    : FALLBACK_TOUCH_LOGICAL_SIZE / MIN_TOUCH_CSS_SIZE;
  if (!Number.isFinite(logicalPixelsPerCssPixel) || logicalPixelsPerCssPixel <= 0) {
    throw new Error(`Constellation logical pixels per CSS pixel must be positive. Received ${String(logicalPixelsPerCssPixel)}.`);
  }
  const minimumTouchLogicalSize = MIN_TOUCH_CSS_SIZE * logicalPixelsPerCssPixel;
  const rotationGap = ROTATION_GAP_CSS_PX * logicalPixelsPerCssPixel;
  const rotationRadius = ROTATION_VISUAL_RADIUS_CSS_PX * logicalPixelsPerCssPixel;
  const rotationHitSize = Math.min(width, height, ROTATION_HIT_CSS_PX * logicalPixelsPerCssPixel);

  function reportInteractionError(reason: unknown): void {
    onInteractionError(describeFailure(reason));
  }

  function findObject(objectId: string): ConstellationObject {
    const object = project.objects.find((candidate) => candidate.id === objectId);
    if (!object) throw new Error(`Constellation object was not found. Received ${JSON.stringify(objectId)}.`);
    return object;
  }

  function releasePointerCapture(pointerId: number): void {
    const svg = svgRef.current;
    if (!svg || typeof svg.releasePointerCapture !== 'function') return;
    if (typeof svg.hasPointerCapture === 'function' && !svg.hasPointerCapture(pointerId)) return;
    svg.releasePointerCapture(pointerId);
  }

  function finishGesture(pointerId: number, cancelled: boolean): void {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== pointerId) return;
    gestureRef.current = null;
    releasePointerCapture(pointerId);
    if (cancelled || gesture.mode === 'resize' || gesture.mode === 'rotate' || gesture.moved) return;
    if (gesture.initiallySelected) onSelectObject(null);
  }

  function startGesture(
    event: PointerEvent<SVGElement>,
    object: ConstellationObject,
    requestedMode: Exclude<GestureMode, 'select'>,
  ): void {
    if (!interactive || !isPrimaryPointer(event) || gestureRef.current) return;
    if (requestedMode === 'resize' && !resizingEnabled) return;
    event.preventDefault();
    event.stopPropagation();

    try {
      const svg = svgRef.current;
      if (!svg) throw new Error(`Constellation canvas is unavailable for object ${JSON.stringify(object.id)}.`);
      const start = getCanvasPoint(svg, event.clientX, event.clientY, width, height);
      if (typeof svg.setPointerCapture !== 'function') {
        throw new Error(`Constellation pointer capture is unavailable for pointer ${String(event.pointerId)}.`);
      }
      const mode: GestureMode = requestedMode === 'drag' && !draggingEnabled ? 'select' : requestedMode;
      const initialTransform = getObjectTransform(object);
      const rotationDegrees = readRotationDegrees(object.rotation, `object ${JSON.stringify(object.id)} rotation`);
      const previousPointerAngleDegrees = mode === 'rotate'
        ? readPointerAngleDegrees(
          { x: initialTransform.x + initialTransform.width / 2, y: initialTransform.y + initialTransform.height / 2 },
          start,
        )
        : null;
      svg.setPointerCapture(event.pointerId);
      gestureRef.current = {
        pointerId: event.pointerId,
        objectId: object.id,
        mode,
        start,
        initialTransform,
        initiallySelected: object.id === selectedObjectId,
        moved: false,
        rotationDegrees,
        previousPointerAngleDegrees,
        accumulatedRotationDegrees: 0,
      };
      if (mode !== 'rotate' && object.id !== selectedObjectId) onSelectObject(object.id);
    } catch (reason) {
      gestureRef.current = null;
      reportInteractionError(reason);
    }
  }

  function moveGesture(event: PointerEvent<SVGSVGElement>): void {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || gesture.mode === 'select') return;
    event.preventDefault();
    try {
      const object = findObject(gesture.objectId);
      const point = getCanvasPoint(event.currentTarget, event.clientX, event.clientY, width, height);
      const transform = readGestureTransform(gesture, point, width, height);
      if (Math.hypot(point.x - gesture.start.x, point.y - gesture.start.y) > POINTER_MOVE_THRESHOLD) gesture.moved = true;
      onObjectTransform(object.id, transform);
    } catch (reason) {
      gestureRef.current = null;
      releasePointerCapture(event.pointerId);
      reportInteractionError(reason);
    }
  }

  function handleObjectKeyDown(event: KeyboardEvent<SVGGElement>, object: ConstellationObject): void {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectObject(object.id);
      return;
    }
    if (object.id !== selectedObjectId || !draggingEnabled) return;
    const offset = getArrowOffset(event);
    if (!offset) return;
    event.preventDefault();
    onObjectTransform(object.id, {
      ...getObjectTransform(object),
      x: clamp(object.x + offset.x, 0, Math.max(0, width - object.width)),
      y: clamp(object.y + offset.y, 0, Math.max(0, height - object.height)),
    });
  }

  function applyObjectLabel(template: string, index: number): string {
    return template.includes('{number}')
      ? template.replace('{number}', String(index + 1))
      : `${template} ${String(index + 1)}`;
  }

  function handleResizeKeyDown(event: KeyboardEvent<SVGGElement>, object: ConstellationObject): void {
    if (!interactive || !resizingEnabled) return;
    const delta = getResizeDelta(event);
    if (delta === null) return;
    event.preventDefault();
    event.stopPropagation();
    const rotationDegrees = readRotationDegrees(object.rotation, `object ${JSON.stringify(object.id)} rotation`);
    const initialTransform = getObjectTransform(object);
    onObjectTransform(object.id, isUprightRotation(rotationDegrees)
      ? getResizedTransform(
        initialTransform,
        { x: object.x, y: object.y },
        { x: object.x + delta, y: object.y + delta },
        width,
        height,
      )
      : getAnchoredResizedTransform(initialTransform, delta, width, height, rotationDegrees));
  }

  function handleRotationKeyDown(event: KeyboardEvent<SVGGElement>, object: ConstellationObject): void {
    if (!interactive) return;
    const delta = readRotationKeyDelta(event);
    if (delta === null) return;
    event.preventDefault();
    event.stopPropagation();
    const rotationDegrees = readRotationDegrees(object.rotation, `object ${JSON.stringify(object.id)} rotation`);
    onObjectTransform(object.id, {
      x: object.x,
      y: object.y,
      width: object.width,
      height: object.height,
      rotation: rotationDegrees + delta,
    });
  }

  return (
    <div className="min-w-0 space-y-2">
      <svg
        ref={svgRef}
        data-constellation-canvas="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label={label}
        tabIndex={interactive ? 0 : -1}
        className="block h-full w-full touch-none select-none bg-[var(--site-panel-deep)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
        onPointerDown={(event) => {
          if (interactive && isPrimaryPointer(event) && !gestureRef.current) onSelectObject(null);
        }}
        onPointerMove={moveGesture}
        onPointerUp={(event) => finishGesture(event.pointerId, false)}
        onPointerCancel={(event) => finishGesture(event.pointerId, true)}
        onLostPointerCapture={(event) => finishGesture(event.pointerId, true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onSelectObject(null);
        }}
      >
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={project.background.transparent ? 'transparent' : project.background.color}
          aria-hidden="true"
        />
        {project.background.imageUrl !== null ? (
          <image
            data-constellation-background="true"
            href={project.background.imageUrl}
            x="0"
            y="0"
            width={project.background.imageWidth ?? width}
            height={project.background.imageHeight ?? height}
            preserveAspectRatio="none"
            aria-hidden="true"
          />
        ) : null}
        {project.objects.map((object, index) => {
          const selected = interactive && object.id === selectedObjectId;
          const rotationDegrees = readRotationDegrees(object.rotation, `object ${JSON.stringify(object.id)} rotation`);
          const objectCenter = readObjectCenter(object);
          const objectHitArea = getTouchHitArea(object, width, height, minimumTouchLogicalSize);
          const resizeHitArea = selected && resizingEnabled
            ? readVisibleResizeHit(
              readRotatedCorner(object, rotationDegrees),
              objectCenter,
              object.id,
              width,
              height,
              minimumTouchLogicalSize,
            )
            : null;
          const rotationHandle = selected
            ? chooseRotationHandlePlacement(
              object,
              rotationDegrees,
              rotationGap,
              rotationRadius,
              rotationHitSize,
              width,
              height,
              resizeHitArea,
              resizeHitArea === null ? null : { x: resizeHitArea.markerX, y: resizeHitArea.markerY },
            )
            : null;
          return (
            <g key={object.id}>
              <g
                data-constellation-object-id={object.id}
                data-constellation-object-frame={object.id}
                data-constellation-rotation={String(rotationDegrees)}
                data-asset-id={object.assetId}
                transform={`rotate(${String(rotationDegrees)} ${String(objectCenter.x)} ${String(objectCenter.y)})`}
                role={interactive ? 'button' : undefined}
                aria-label={interactive ? applyObjectLabel(objectLabel, index) : undefined}
                aria-pressed={interactive ? selected : undefined}
                tabIndex={interactive ? 0 : -1}
                className={interactive ? 'cursor-move outline-none' : 'outline-none'}
                onPointerDown={(event) => startGesture(event, object, 'drag')}
                onKeyDown={(event) => handleObjectKeyDown(event, object)}
                onFocus={() => setFocusedObjectId(object.id)}
                onBlur={() => setFocusedObjectId(null)}
              >
                <rect
                  data-constellation-object-hit="true"
                  x={objectHitArea.x}
                  y={objectHitArea.y}
                  width={objectHitArea.width}
                  height={objectHitArea.height}
                  fill="transparent"
                  pointerEvents={interactive ? 'all' : 'none'}
                  aria-hidden="true"
                />
                <image
                  href={getConstellationObjectSrc(object)}
                  x={object.x}
                  y={object.y}
                  width={object.width}
                  height={object.height}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                />
                {selected ? (
                  <rect
                    data-constellation-selection="true"
                    x={object.x}
                    y={object.y}
                    width={object.width}
                    height={object.height}
                    fill="none"
                    stroke="var(--site-accent-strong)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                ) : null}
                {focusedObjectId === object.id ? (
                  <rect
                    data-constellation-focus-ring="object"
                    x={object.x}
                    y={object.y}
                    width={object.width}
                    height={object.height}
                    fill="none"
                    stroke="var(--site-accent-strong)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                    aria-hidden="true"
                  />
                ) : null}
              </g>
              {resizeHitArea !== null && resizeHitArea.width > 0 && resizeHitArea.height > 0 ? (
                <g
                  data-constellation-resize-handle={object.id}
                  role="button"
                  aria-label={applyObjectLabel(resizeLabel, index)}
                  tabIndex={0}
                  className="cursor-nwse-resize outline-none focus-visible:opacity-70"
                  onPointerDown={(event) => startGesture(event, object, 'resize')}
                  onKeyDown={(event) => handleResizeKeyDown(event, object)}
                  onFocus={() => setFocusedResizeObjectId(object.id)}
                  onBlur={() => setFocusedResizeObjectId(null)}
                >
                  <rect
                    data-constellation-resize-hit="true"
                    x={resizeHitArea.x}
                    y={resizeHitArea.y}
                    width={resizeHitArea.width}
                    height={resizeHitArea.height}
                    fill="transparent"
                  />
                  <rect
                    data-constellation-resize-marker="true"
                    x={resizeHitArea.markerX - RESIZE_MARKER_SIZE / 2}
                    y={resizeHitArea.markerY - RESIZE_MARKER_SIZE / 2}
                    width={RESIZE_MARKER_SIZE}
                    height={RESIZE_MARKER_SIZE}
                    rx="2"
                    fill="white"
                    stroke={focusedResizeObjectId === object.id ? 'var(--site-accent-strong)' : 'var(--site-border-strong)'}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                </g>
              ) : null}
              {rotationHandle !== null ? (
                <g
                  data-constellation-rotation-handle={object.id}
                  data-constellation-rotation-side={rotationHandle.side}
                  data-constellation-rotation-inward={rotationHandle.inward ? 'true' : 'false'}
                  role="button"
                  aria-label={applyObjectLabel(rotateLabel, index)}
                  tabIndex={0}
                  className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)] active:cursor-grabbing"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    startGesture(event, object, 'rotate');
                  }}
                  onKeyDown={(event) => handleRotationKeyDown(event, object)}
                  onFocus={() => setFocusedRotationObjectId(object.id)}
                  onBlur={() => setFocusedRotationObjectId(null)}
                >
                  <rect
                    data-constellation-rotation-hit="true"
                    x={rotationHandle.hit.x}
                    y={rotationHandle.hit.y}
                    width={rotationHandle.hit.width}
                    height={rotationHandle.hit.height}
                    fill="transparent"
                  />
                  <line
                    data-constellation-rotation-stem="true"
                    x1={rotationHandle.edgeX}
                    y1={rotationHandle.edgeY}
                    x2={rotationHandle.stemX}
                    y2={rotationHandle.stemY}
                    stroke="var(--site-accent-strong)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                  <circle
                    data-constellation-rotation-marker="true"
                    cx={rotationHandle.centerX}
                    cy={rotationHandle.centerY}
                    r={rotationHandle.radius}
                    fill="white"
                    stroke={focusedRotationObjectId === object.id ? 'var(--site-accent-strong)' : 'var(--site-border-strong)'}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                  <path
                    data-constellation-rotation-icon="true"
                    d={buildRotationIconPath(rotationHandle.radius)}
                    transform={`translate(${String(rotationHandle.centerX)} ${String(rotationHandle.centerY)})`}
                    fill="none"
                    stroke="var(--site-text)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
