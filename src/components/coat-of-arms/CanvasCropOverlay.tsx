'use client';

import type { PointerEvent } from 'react';
import type { CanvasCrop, CanvasTransform, CoatLocale } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

export type CropHandle = 'move' | 'left' | 'right' | 'top' | 'bottom';

export interface CanvasCropOverlayProps {
  crop: CanvasCrop;
  transform: CanvasTransform;
  locale: CoatLocale;
  onPointerDown: (handle: CropHandle, event: PointerEvent<HTMLButtonElement>) => void;
}

/** Editor-only crop affordance; the canvas owns all gesture state and commits. */
export function CanvasCropOverlay({ crop, transform, locale, onPointerDown }: CanvasCropOverlayProps) {
  const copy = getCoatWorkbenchCopy(locale).canvas;
  const controls: Array<{ handle: CropHandle; label: string; className: string }> = [
    { handle: 'move', label: copy.moveCropFrame, className: 'left-1/2 top-0 -translate-x-1/2 cursor-move' },
    { handle: 'left', label: copy.resizeCropLeftEdge, className: 'left-0 top-1/2 -translate-y-1/2 cursor-ew-resize' },
    { handle: 'right', label: copy.resizeCropRightEdge, className: 'right-0 top-1/2 -translate-y-1/2 cursor-ew-resize' },
    { handle: 'top', label: copy.resizeCropTopEdge, className: 'left-1/4 top-0 -translate-x-1/2 cursor-ns-resize' },
    { handle: 'bottom', label: copy.resizeCropBottomEdge, className: 'bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize' },
  ];
  const cropFrameStyle = {
    left: `${crop.x}%`,
    top: `${(crop.y / 110) * 100}%`,
    width: `${crop.width}%`,
    height: `${(crop.height / 110) * 100}%`,
  };
  const horizontalScale = (transform.scaleX ?? transform.scale) * (transform.flipHorizontal ? -1 : 1);
  const verticalScale = (transform.scaleY ?? transform.scale) * (transform.flipVertical ? -1 : 1);
  const layerTransformStyle = {
    transform: `translate(${transform.x}%, ${(transform.y / 110) * 100}%) rotate(${transform.rotation}deg) scale(${horizontalScale}, ${verticalScale})`,
  };

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={layerTransformStyle}
    >
      <div
        aria-label={copy.cropSelectedLayer}
        className="pointer-events-none absolute border-2 border-dashed border-[color:var(--site-accent-strong)] bg-[color:var(--site-accent-strong)]/10"
        data-crop-height={crop.height}
        data-crop-width={crop.width}
        data-crop-x={crop.x}
        data-crop-y={crop.y}
        role="group"
        style={cropFrameStyle}
      >
        {controls.map(({ handle, label, className }) => (
          <button
            aria-label={label}
            className={`pointer-events-auto absolute h-6 w-6 rounded-full border-2 border-[color:var(--site-accent-strong)] bg-[color:var(--site-panel-strong)] ${className}`}
            key={handle}
            onPointerDown={(event) => onPointerDown(handle, event)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
