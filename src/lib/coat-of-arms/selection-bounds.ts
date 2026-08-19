import type { CanvasTransform } from './types';
import type { TransformSelectionCenter } from './transform';

export const SELECTION_SCENE_WIDTH = 100;
export const SELECTION_SCENE_HEIGHT = 110;
const SCENE_PIVOT_X = SELECTION_SCENE_WIDTH / 2;
const SCENE_PIVOT_Y = SELECTION_SCENE_HEIGHT / 2;
const FULL_SCENE_CROP = {
  x: 0,
  y: 0,
  width: SELECTION_SCENE_WIDTH,
  height: SELECTION_SCENE_HEIGHT,
};

export interface SceneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SceneClientRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Axis-aligned bounds of one layer after the same transform the scene SVG applies. */
export function getTransformedLayerBounds(transform: CanvasTransform): SceneBounds {
  const crop = transform.crop ?? FULL_SCENE_CROP;
  if (!isPositiveFinite(crop.width) || !isPositiveFinite(crop.height)) {
    throw new Error(`Invalid layer crop size for selection bounds: ${crop.width}x${crop.height}`);
  }
  return boundsFromScenePoints([
    applyCanvasTransformToScenePoint({ x: crop.x, y: crop.y }, transform),
    applyCanvasTransformToScenePoint({ x: crop.x + crop.width, y: crop.y }, transform),
    applyCanvasTransformToScenePoint({ x: crop.x + crop.width, y: crop.y + crop.height }, transform),
    applyCanvasTransformToScenePoint({ x: crop.x, y: crop.y + crop.height }, transform),
  ]);
}

/** Union of selected layer bounds in editor scene coordinates. */
export function getTransformedSelectionBounds(transforms: readonly CanvasTransform[]): SceneBounds {
  if (transforms.length === 0) {
    throw new Error('Cannot compute selection bounds without transforms');
  }
  return unionSceneBounds(transforms.map((transform) => getTransformedLayerBounds(transform)));
}

/** Editor-relative centre used by the existing selection overlay attributes. */
export function getSelectionOverlayCenter(bounds: SceneBounds): TransformSelectionCenter {
  assertSceneBounds(bounds);
  return {
    x: bounds.x + bounds.width / 2 - SCENE_PIVOT_X,
    y: bounds.y + bounds.height / 2 - SCENE_PIVOT_Y,
  };
}

/** Converts painted layer client rectangles back into scene coordinates. */
export function sceneBoundsFromClientRects(
  canvasRect: SceneClientRect,
  layerRects: readonly SceneClientRect[],
): SceneBounds | null {
  if (!isPositiveFinite(canvasRect.width) || !isPositiveFinite(canvasRect.height)) {
    return null;
  }
  const visibleRects = layerRects.filter((rect) => isPositiveFinite(rect.width) && isPositiveFinite(rect.height));
  if (visibleRects.length === 0) return null;
  const scenePoints = visibleRects.flatMap((rect) => [
    clientPointToScenePoint(canvasRect, rect.left, rect.top),
    clientPointToScenePoint(canvasRect, rect.left + rect.width, rect.top),
    clientPointToScenePoint(canvasRect, rect.left + rect.width, rect.top + rect.height),
    clientPointToScenePoint(canvasRect, rect.left, rect.top + rect.height),
  ]);
  return boundsFromScenePoints(scenePoints);
}

export function sceneBoundsEqual(left: SceneBounds | null, right: SceneBounds | null): boolean {
  if (left === right) return true;
  if (left === null || right === null) return false;
  return left.x === right.x
    && left.y === right.y
    && left.width === right.width
    && left.height === right.height;
}

function applyCanvasTransformToScenePoint(
  point: { x: number; y: number },
  transform: CanvasTransform,
): { x: number; y: number } {
  const horizontalScale = (transform.scaleX ?? transform.scale) * (transform.flipHorizontal ? -1 : 1);
  const verticalScale = (transform.scaleY ?? transform.scale) * (transform.flipVertical ? -1 : 1);
  if (!Number.isFinite(horizontalScale) || !Number.isFinite(verticalScale)) {
    throw new Error(`Invalid layer scale for selection bounds: ${horizontalScale}x${verticalScale}`);
  }
  const scaledX = SCENE_PIVOT_X + (point.x - SCENE_PIVOT_X) * horizontalScale;
  const scaledY = SCENE_PIVOT_Y + (point.y - SCENE_PIVOT_Y) * verticalScale;
  const radians = transform.rotation * Math.PI / 180;
  if (!Number.isFinite(radians)) {
    throw new Error(`Invalid layer rotation for selection bounds: ${transform.rotation}`);
  }
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const rotatedX = SCENE_PIVOT_X + (scaledX - SCENE_PIVOT_X) * cosine - (scaledY - SCENE_PIVOT_Y) * sine;
  const rotatedY = SCENE_PIVOT_Y + (scaledX - SCENE_PIVOT_X) * sine + (scaledY - SCENE_PIVOT_Y) * cosine;
  return {
    x: rotatedX + transform.x,
    y: rotatedY + transform.y,
  };
}

function boundsFromScenePoints(points: ReadonlyArray<{ x: number; y: number }>): SceneBounds {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  assertSceneBounds(bounds);
  return bounds;
}

function unionSceneBounds(boundsList: readonly SceneBounds[]): SceneBounds {
  return boundsFromScenePoints(boundsList.flatMap((bounds) => [
    { x: bounds.x, y: bounds.y },
    { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
  ]));
}

function clientPointToScenePoint(
  canvasRect: SceneClientRect,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  return {
    x: ((clientX - canvasRect.left) / canvasRect.width) * SELECTION_SCENE_WIDTH,
    y: ((clientY - canvasRect.top) / canvasRect.height) * SELECTION_SCENE_HEIGHT,
  };
}

function assertSceneBounds(bounds: SceneBounds): void {
  if (!Number.isFinite(bounds.x) || !Number.isFinite(bounds.y)) {
    throw new Error(`Invalid selection bounds origin: ${bounds.x},${bounds.y}`);
  }
  if (!isPositiveFinite(bounds.width) || !isPositiveFinite(bounds.height)) {
    throw new Error(`Invalid selection bounds size: ${bounds.width}x${bounds.height}`);
  }
}

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}
