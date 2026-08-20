export interface CanvasSnapBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasSnapLayerTarget {
  id: string;
  bounds: CanvasSnapBounds;
}

export interface CanvasSnapGuide {
  axis: 'x' | 'y';
  position: number;
  start: number;
  end: number;
}

export interface CanvasSnapRequest {
  selectionBounds: CanvasSnapBounds;
  proposedDelta: { x: number; y: number };
  pageBounds: CanvasSnapBounds;
  layerTargets: readonly CanvasSnapLayerTarget[];
  canvasClientSize: { width: number; height: number };
  snappingEnabled: boolean;
  altKey: boolean;
}

export interface CanvasSnapResult {
  delta: { x: number; y: number };
  guides: CanvasSnapGuide[];
}

interface AxisSnapMatch {
  adjustment: number;
  position: number;
  targetBounds: CanvasSnapBounds;
  isPage: boolean;
}

const SNAP_THRESHOLD_CSS_PIXELS = 7;
const SNAP_DISTANCE_EPSILON = 1e-9;

/** Resolves one drag delta against page and peer-layer alignment anchors. */
export function snapCanvasDrag(request: CanvasSnapRequest): CanvasSnapResult {
  assertBounds(request.selectionBounds, 'selection bounds');
  assertFiniteNumber(request.proposedDelta.x, 'proposed delta x');
  assertFiniteNumber(request.proposedDelta.y, 'proposed delta y');
  assertBounds(request.pageBounds, 'page bounds');
  request.layerTargets.forEach((target) => assertBounds(target.bounds, `layer target ${target.id} bounds`));
  assertPositiveFiniteNumber(request.canvasClientSize.width, 'canvas client width');
  assertPositiveFiniteNumber(request.canvasClientSize.height, 'canvas client height');

  if (request.snappingEnabled === request.altKey) {
    return { delta: { ...request.proposedDelta }, guides: [] };
  }

  const proposedBounds = translateBounds(request.selectionBounds, request.proposedDelta);
  const thresholds = {
    x: SNAP_THRESHOLD_CSS_PIXELS * request.pageBounds.width / request.canvasClientSize.width,
    y: SNAP_THRESHOLD_CSS_PIXELS * request.pageBounds.height / request.canvasClientSize.height,
  };
  const targets = [
    { bounds: request.pageBounds, isPage: true },
    ...request.layerTargets.map((target) => ({ bounds: target.bounds, isPage: false })),
  ];
  const xMatch = findAxisSnap(proposedBounds, targets, 'x', thresholds.x);
  const yMatch = findAxisSnap(proposedBounds, targets, 'y', thresholds.y);
  const delta = {
    x: request.proposedDelta.x + (xMatch?.adjustment ?? 0),
    y: request.proposedDelta.y + (yMatch?.adjustment ?? 0),
  };
  const snappedBounds = translateBounds(request.selectionBounds, delta);
  const guides = [
    ...(xMatch ? [createGuide('x', xMatch, snappedBounds, request.pageBounds)] : []),
    ...(yMatch ? [createGuide('y', yMatch, snappedBounds, request.pageBounds)] : []),
  ];
  return { delta, guides };
}

function findAxisSnap(
  movingBounds: CanvasSnapBounds,
  targets: ReadonlyArray<{ bounds: CanvasSnapBounds; isPage: boolean }>,
  axis: 'x' | 'y',
  threshold: number,
): AxisSnapMatch | null {
  const movingAnchors = getAxisAnchors(movingBounds, axis);
  let closestMatch: AxisSnapMatch | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  for (const target of targets) {
    for (const targetAnchor of getAxisAnchors(target.bounds, axis)) {
      for (const movingAnchor of movingAnchors) {
        const adjustment = targetAnchor - movingAnchor;
        const distance = Math.abs(adjustment);
        if (distance <= threshold + SNAP_DISTANCE_EPSILON && distance < closestDistance) {
          closestDistance = distance;
          closestMatch = {
            adjustment,
            position: targetAnchor,
            targetBounds: target.bounds,
            isPage: target.isPage,
          };
        }
      }
    }
  }
  return closestMatch;
}

function getAxisAnchors(bounds: CanvasSnapBounds, axis: 'x' | 'y'): [number, number, number] {
  const start = bounds[axis];
  const size = axis === 'x' ? bounds.width : bounds.height;
  return [start, start + size / 2, start + size];
}

function createGuide(
  axis: 'x' | 'y',
  match: AxisSnapMatch,
  movingBounds: CanvasSnapBounds,
  pageBounds: CanvasSnapBounds,
): CanvasSnapGuide {
  if (axis === 'x') {
    const bounds = match.isPage ? pageBounds : unionBounds(movingBounds, match.targetBounds);
    return { axis, position: match.position, start: bounds.y, end: bounds.y + bounds.height };
  }
  const bounds = match.isPage ? pageBounds : unionBounds(movingBounds, match.targetBounds);
  return { axis, position: match.position, start: bounds.x, end: bounds.x + bounds.width };
}

function translateBounds(bounds: CanvasSnapBounds, delta: { x: number; y: number }): CanvasSnapBounds {
  return { ...bounds, x: bounds.x + delta.x, y: bounds.y + delta.y };
}

function unionBounds(left: CanvasSnapBounds, right: CanvasSnapBounds): CanvasSnapBounds {
  const x = Math.min(left.x, right.x);
  const y = Math.min(left.y, right.y);
  const rightEdge = Math.max(left.x + left.width, right.x + right.width);
  const bottomEdge = Math.max(left.y + left.height, right.y + right.height);
  return { x, y, width: rightEdge - x, height: bottomEdge - y };
}

function assertBounds(bounds: CanvasSnapBounds, label: string): void {
  assertFiniteNumber(bounds.x, `${label} x`);
  assertFiniteNumber(bounds.y, `${label} y`);
  assertPositiveFiniteNumber(bounds.width, `${label} width`);
  assertPositiveFiniteNumber(bounds.height, `${label} height`);
}

function assertPositiveFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
}
