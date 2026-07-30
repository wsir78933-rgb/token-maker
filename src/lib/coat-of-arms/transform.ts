import type { CanvasTransform } from './types';

export interface TransformSelectionCenter {
  x: number;
  y: number;
}

export interface TransformSelectionAdjustment {
  scaleFactor?: number;
  rotationDegrees?: number;
}

/** Scales both rendered axes by one uniform delta without distorting saved proportions. */
export function scaleCanvasTransform(transform: CanvasTransform, delta: number): CanvasTransform {
  const nextScale = Math.max(0.1, transform.scale + delta);
  if (nextScale === transform.scale) return transform;
  return scaleCanvasTransformByFactor(transform, nextScale / transform.scale);
}

/** Returns the common transform pivot in editor-relative coordinates. */
export function getTransformSelectionCenter(transforms: readonly CanvasTransform[]): TransformSelectionCenter {
  if (transforms.length === 0) throw new Error('Cannot find a transform selection centre without layers');
  const totals = transforms.reduce((current, transform) => ({
    x: current.x + transform.x,
    y: current.y + transform.y,
  }), { x: 0, y: 0 });
  return { x: totals.x / transforms.length, y: totals.y / transforms.length };
}

/** Applies one uniform resize and rotation around the shared selection pivot. */
export function transformCanvasSelection(
  transforms: readonly CanvasTransform[],
  adjustment: TransformSelectionAdjustment,
  selectionCenter: TransformSelectionCenter = getTransformSelectionCenter(transforms),
): CanvasTransform[] {
  const scaleFactor = adjustment.scaleFactor ?? 1;
  const rotationDegrees = adjustment.rotationDegrees ?? 0;
  if (!Number.isFinite(scaleFactor) || scaleFactor <= 0) {
    throw new Error(`Invalid transform selection scale factor: ${String(scaleFactor)}`);
  }
  if (!Number.isFinite(rotationDegrees)) {
    throw new Error(`Invalid transform selection rotation: ${String(rotationDegrees)}`);
  }
  const radians = rotationDegrees * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return transforms.map((transform) => {
    const scaledTransform = scaleFactor === 1 ? transform : scaleCanvasTransformByFactor(transform, scaleFactor);
    const relativeX = (transform.x - selectionCenter.x) * scaleFactor;
    const relativeY = (transform.y - selectionCenter.y) * scaleFactor;
    return {
      ...scaledTransform,
      x: selectionCenter.x + relativeX * cosine - relativeY * sine,
      y: selectionCenter.y + relativeX * sine + relativeY * cosine,
      rotation: transform.rotation + rotationDegrees,
    };
  });
}

function scaleCanvasTransformByFactor(transform: CanvasTransform, scaleFactor: number): CanvasTransform {
  const nextScale = Math.max(0.1, transform.scale * scaleFactor);
  const appliedScaleFactor = nextScale / transform.scale;
  if (transform.scaleX === undefined && transform.scaleY === undefined) {
    return { ...transform, scale: nextScale };
  }
  return {
    ...transform,
    scale: nextScale,
    scaleX: (transform.scaleX ?? transform.scale) * appliedScaleFactor,
    scaleY: (transform.scaleY ?? transform.scale) * appliedScaleFactor,
  };
}
