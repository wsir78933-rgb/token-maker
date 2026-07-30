export interface FreehandPoint {
  x: number;
  y: number;
}

const MINIMUM_POINT_DISTANCE = 0.5;
const MAXIMUM_FREEHAND_POINTS = 180;

/** Converts only locally sampled numeric points into the narrow path grammar accepted by project validation. */
export function createFreehandPath(points: readonly FreehandPoint[]): string {
  if (!Array.isArray(points) || points.length < 2) {
    throw new Error(`Invalid freehand points: ${String(points)}`);
  }
  if (points.length > MAXIMUM_FREEHAND_POINTS) {
    throw new Error(`Invalid freehand point count: ${points.length}; limit is ${MAXIMUM_FREEHAND_POINTS}`);
  }
  points.forEach(assertFreehandPoint);
  const [firstPoint, ...remainingPoints] = points;
  if (!firstPoint) throw new Error('Invalid freehand points: missing first point');
  return `M ${formatCoordinate(firstPoint.x)} ${formatCoordinate(firstPoint.y)}${remainingPoints.map((point) => ` L ${formatCoordinate(point.x)} ${formatCoordinate(point.y)}`).join('')}`;
}

/** Keeps a bounded sampled stroke and avoids nearly identical pointer coordinates. */
export function appendFreehandPoint(
  points: readonly FreehandPoint[],
  nextPoint: FreehandPoint,
): FreehandPoint[] {
  if (!Array.isArray(points) || points.length > MAXIMUM_FREEHAND_POINTS) {
    throw new Error(`Invalid freehand points: ${String(points)}`);
  }
  points.forEach(assertFreehandPoint);
  assertFreehandPoint(nextPoint);
  if (points.length === MAXIMUM_FREEHAND_POINTS) return [...points];
  const previousPoint = points.at(-1);
  if (previousPoint && Math.hypot(nextPoint.x - previousPoint.x, nextPoint.y - previousPoint.y) < MINIMUM_POINT_DISTANCE) {
    return [...points];
  }
  return [...points, { x: nextPoint.x, y: nextPoint.y }];
}

function assertFreehandPoint(point: unknown): asserts point is FreehandPoint {
  if (!point || typeof point !== 'object' || Array.isArray(point)) {
    throw new Error(`Invalid freehand point: ${String(point)}`);
  }
  const { x, y } = point as FreehandPoint;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error(`Invalid freehand point: ${String(x)},${String(y)}`);
  }
}

function formatCoordinate(coordinate: number): string {
  const roundedCoordinate = Math.round(coordinate * 100) / 100;
  return String(Object.is(roundedCoordinate, -0) ? 0 : roundedCoordinate);
}
