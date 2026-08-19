'use client';

import type { KeyboardEvent, PointerEvent } from 'react';
import type { SceneBounds } from '@/lib/coat-of-arms/selection-bounds';
import { getSelectionOverlayCenter } from '@/lib/coat-of-arms/selection-bounds';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { CanvasSelectionToolbar } from './CanvasSelectionToolbar';
import { getCoatWorkbenchCopy, type SelectionResizeHandle } from './workbench-copy';

const RESIZE_HANDLES: ReadonlyArray<{
  handle: SelectionResizeHandle;
  className: string;
}> = [
  { handle: 'northwest', className: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
  { handle: 'north', className: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
  { handle: 'northeast', className: 'right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
  { handle: 'east', className: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
  { handle: 'southeast', className: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
  { handle: 'south', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
  { handle: 'southwest', className: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
  { handle: 'west', className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
];

export interface CanvasSelectionHandlesProps {
  locale: CoatLocale;
  selectionBounds: SceneBounds;
  showTransformHandles: boolean;
  onResizePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onRotatePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizeKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onRotateKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/** Visual controls only. The canvas owns pointer conversion and command dispatch. */
export function CanvasSelectionHandles({
  locale,
  selectionBounds,
  showTransformHandles,
  onResizePointerDown,
  onRotatePointerDown,
  onResizeKeyDown,
  onRotateKeyDown,
}: CanvasSelectionHandlesProps) {
  const copy = getCoatWorkbenchCopy(locale).canvas;
  const selectionCenter = getSelectionOverlayCenter(selectionBounds);
  return (
    <div
      aria-label={copy.selectedLayerControls}
      className="pointer-events-none absolute z-20"
      data-selection-height={selectionBounds.height}
      data-selection-width={selectionBounds.width}
      data-selection-x={selectionCenter.x}
      data-selection-y={selectionCenter.y}
      style={{
        left: `${selectionBounds.x}%`,
        top: `${(selectionBounds.y / 110) * 100}%`,
        width: `${selectionBounds.width}%`,
        height: `${(selectionBounds.height / 110) * 100}%`,
      }}
    >
      <div className="absolute inset-0 border-2 border-[#7eb6ff]" />
      {showTransformHandles ? (
        <>
          {RESIZE_HANDLES.map(({ handle, className }) => (
            <button
              aria-label={handle === 'southeast' ? copy.resizeSelectedLayer : copy.resizeSelectedLayerHandle(handle)}
              className={`pointer-events-auto absolute flex h-6 w-6 items-center justify-center ${className}`}
              data-resize-handle={handle}
              key={handle}
              type="button"
              onKeyDown={onResizeKeyDown}
              onPointerDown={onResizePointerDown}
            >
              <span className="pointer-events-none h-[13px] w-[13px] rounded-[1px] border-2 border-[#7eb6ff] bg-white" />
            </button>
          ))}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-3 w-0.5 -translate-x-1/2 -translate-y-3 bg-[#7eb6ff]"
          />
          <button
            aria-label={copy.rotateSelectedLayer}
            className="pointer-events-auto absolute left-1/2 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-8 items-center justify-center"
            type="button"
            onKeyDown={onRotateKeyDown}
            onPointerDown={onRotatePointerDown}
          >
            <span className="pointer-events-none h-[13px] w-[13px] rounded-full border-2 border-[#7eb6ff] bg-white" />
          </button>
        </>
      ) : null}
      <CanvasSelectionToolbar locale={locale} />
    </div>
  );
}
