export type ArmyFormationBackgroundTransform = Readonly<{
  scale: number;
  offsetXPx: number;
  offsetYPx: number;
}>;

export const MIN_ARMY_FORMATION_BACKGROUND_SCALE = 0.25;
export const MAX_ARMY_FORMATION_BACKGROUND_SCALE = 8;

export const DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM: ArmyFormationBackgroundTransform =
  Object.freeze({
    scale: 1,
    offsetXPx: 0,
    offsetYPx: 0,
  });

export function translateArmyFormationBackgroundTransform(
  transform: ArmyFormationBackgroundTransform,
  deltaXPx: number,
  deltaYPx: number,
): ArmyFormationBackgroundTransform {
  assertTransform(transform);
  assertFiniteNumber(deltaXPx, 'deltaXPx');
  assertFiniteNumber(deltaYPx, 'deltaYPx');

  const offsetXPx = transform.offsetXPx + deltaXPx;
  const offsetYPx = transform.offsetYPx + deltaYPx;
  assertFiniteNumber(offsetXPx, 'translated offsetXPx');
  assertFiniteNumber(offsetYPx, 'translated offsetYPx');

  return { scale: transform.scale, offsetXPx, offsetYPx };
}

export function zoomArmyFormationBackgroundTransformAtPoint(
  transform: ArmyFormationBackgroundTransform,
  point: { xPx: number; yPx: number },
  scaleFactor: number,
): ArmyFormationBackgroundTransform {
  assertTransform(transform);
  assertPoint(point);
  assertFiniteNumber(scaleFactor, 'scaleFactor');
  if (scaleFactor <= 0) {
    throw new RangeError(`scaleFactor must be greater than 0; received ${String(scaleFactor)}.`);
  }

  const scale = clampScaledBackgroundScale(transform.scale, scaleFactor);
  const actualScaleFactor = scale / transform.scale;
  const pointDeltaXPx = point.xPx - transform.offsetXPx;
  const pointDeltaYPx = point.yPx - transform.offsetYPx;
  assertFiniteNumber(pointDeltaXPx, 'anchor delta xPx');
  assertFiniteNumber(pointDeltaYPx, 'anchor delta yPx');

  const scaledDeltaXPx = pointDeltaXPx * actualScaleFactor;
  const scaledDeltaYPx = pointDeltaYPx * actualScaleFactor;
  assertFiniteNumber(scaledDeltaXPx, 'scaled anchor delta xPx');
  assertFiniteNumber(scaledDeltaYPx, 'scaled anchor delta yPx');

  const offsetXPx = point.xPx - scaledDeltaXPx;
  const offsetYPx = point.yPx - scaledDeltaYPx;
  assertFiniteNumber(offsetXPx, 'zoomed offsetXPx');
  assertFiniteNumber(offsetYPx, 'zoomed offsetYPx');

  return { scale, offsetXPx, offsetYPx };
}

export function toArmyFormationMapPoint(
  transform: ArmyFormationBackgroundTransform,
  viewXPx: number,
  viewYPx: number,
): Readonly<{ x: number; y: number }> {
  assertTransform(transform);
  assertFiniteNumber(viewXPx, 'viewXPx');
  assertFiniteNumber(viewYPx, 'viewYPx');

  const viewDeltaXPx = viewXPx - transform.offsetXPx;
  const viewDeltaYPx = viewYPx - transform.offsetYPx;
  assertFiniteNumber(viewDeltaXPx, 'view delta xPx');
  assertFiniteNumber(viewDeltaYPx, 'view delta yPx');

  const x = viewDeltaXPx / transform.scale;
  const y = viewDeltaYPx / transform.scale;
  assertFiniteNumber(x, 'mapPoint.x');
  assertFiniteNumber(y, 'mapPoint.y');

  return { x, y };
}

function clampScaledBackgroundScale(scale: number, scaleFactor: number): number {
  if (scaleFactor > MAX_ARMY_FORMATION_BACKGROUND_SCALE / scale) {
    return MAX_ARMY_FORMATION_BACKGROUND_SCALE;
  }
  if (scaleFactor < MIN_ARMY_FORMATION_BACKGROUND_SCALE / scale) {
    return MIN_ARMY_FORMATION_BACKGROUND_SCALE;
  }

  return Math.min(
    MAX_ARMY_FORMATION_BACKGROUND_SCALE,
    Math.max(MIN_ARMY_FORMATION_BACKGROUND_SCALE, scale * scaleFactor),
  );
}

function assertTransform(transform: ArmyFormationBackgroundTransform): void {
  if (typeof transform !== 'object' || transform === null) {
    throw new TypeError(
      `transform must be an object; received ${String(transform)} (type ${typeof transform}).`,
    );
  }

  assertFiniteNumber(transform.scale, 'transform.scale');
  if (
    transform.scale < MIN_ARMY_FORMATION_BACKGROUND_SCALE ||
    transform.scale > MAX_ARMY_FORMATION_BACKGROUND_SCALE
  ) {
    throw new RangeError(
      `transform.scale must be between ${MIN_ARMY_FORMATION_BACKGROUND_SCALE} and ${MAX_ARMY_FORMATION_BACKGROUND_SCALE}; received ${String(transform.scale)}.`,
    );
  }
  assertFiniteNumber(transform.offsetXPx, 'transform.offsetXPx');
  assertFiniteNumber(transform.offsetYPx, 'transform.offsetYPx');
}

function assertPoint(point: { xPx: number; yPx: number }): void {
  if (typeof point !== 'object' || point === null) {
    throw new TypeError(`point must be an object; received ${String(point)} (type ${typeof point}).`);
  }

  assertFiniteNumber(point.xPx, 'point.xPx');
  assertFiniteNumber(point.yPx, 'point.yPx');
}

function assertFiniteNumber(value: number, name: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number; received ${String(value)}.`);
  }
}
