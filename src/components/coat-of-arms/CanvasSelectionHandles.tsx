'use client';

import type { KeyboardEvent, PointerEvent } from 'react';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import type { TransformSelectionCenter } from '@/lib/coat-of-arms/transform';
import { getCoatWorkbenchCopy } from './workbench-copy';

export interface CanvasSelectionHandlesProps {
  locale: CoatLocale;
  selectionCenter: TransformSelectionCenter;
  onResizePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onRotatePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizeKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onRotateKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/** Visual controls only. The canvas owns pointer conversion and command dispatch. */
export function CanvasSelectionHandles({
  locale,
  selectionCenter,
  onResizePointerDown,
  onRotatePointerDown,
  onResizeKeyDown,
  onRotateKeyDown,
}: CanvasSelectionHandlesProps) {
  const copy = getCoatWorkbenchCopy(locale).canvas;
  const selectionCenterStyle = {
    left: `${50 + selectionCenter.x}%`,
    top: `${((55 + selectionCenter.y) / 110) * 100}%`,
  };
  return (
    <div
      aria-label={copy.selectedLayerControls}
      className="pointer-events-none absolute h-0 w-0"
      data-selection-x={selectionCenter.x}
      data-selection-y={selectionCenter.y}
      style={selectionCenterStyle}
    >
      <button
        aria-label={copy.resizeSelectedLayer}
        className="pointer-events-auto absolute left-2 top-2 h-6 w-6 rounded-sm border-2 border-[color:var(--site-accent-strong)] bg-[color:var(--site-panel-strong)]"
        type="button"
        onKeyDown={onResizeKeyDown}
        onPointerDown={onResizePointerDown}
      />
      <button
        aria-label={copy.rotateSelectedLayer}
        className="pointer-events-auto absolute -left-2 -top-8 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-[color:var(--site-accent-strong)] bg-[color:var(--site-panel-strong)]"
        type="button"
        onKeyDown={onRotateKeyDown}
        onPointerDown={onRotatePointerDown}
      />
    </div>
  );
}
