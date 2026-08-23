'use client';

import type { KeyboardEvent, PointerEvent } from 'react';
import {
  getSelectionOverlayCenter,
  SELECTION_SCENE_HEIGHT,
  SELECTION_SCENE_WIDTH,
  type SceneBounds,
} from '@/lib/coat-of-arms/selection-bounds';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { CanvasSelectionToolbar } from './CanvasSelectionToolbar';
import { getCoatWorkbenchCopy, type SelectionResizeHandle } from './workbench-copy';

const HANDLE_COLOR = '#7eb6ff';

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

export type CanvasTextPathHandleKind = 'curve-start' | 'curve-control' | 'curve-end' | 'ring-radius';
export type CanvasTextBoxWidthHandleSide = 'left' | 'right';

export interface CanvasScenePoint {
  x: number;
  y: number;
}

export interface CanvasTextPathHandle {
  kind: CanvasTextPathHandleKind;
  point: CanvasScenePoint;
}

export type CanvasTextPathGuide =
  | {
      mode: 'curve';
      handles: readonly CanvasTextPathHandle[];
      curve: {
        start: CanvasScenePoint;
        control: CanvasScenePoint;
        end: CanvasScenePoint;
      };
    }
  | {
      mode: 'ring';
      handles: readonly CanvasTextPathHandle[];
      ring: {
        center: CanvasScenePoint;
        radius: number;
      };
    };

export interface CanvasSelectionHandlesProps {
  locale: CoatLocale;
  selectionBounds: SceneBounds;
  showResizeHandles: boolean;
  showRotateHandle: boolean;
  showTextBoxWidthHandles: boolean;
  showBoundingRect?: boolean;
  showSelectionToolbar?: boolean;
  onResizePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onRotatePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizeKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onRotateKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onTextBoxWidthPointerDown?: (event: PointerEvent<HTMLButtonElement>, side: CanvasTextBoxWidthHandleSide) => void;
}

export interface CanvasTextPathOverlayProps {
  locale: CoatLocale;
  overlay: CanvasTextPathGuide;
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>, kind: CanvasTextPathHandleKind) => void;
}

/** Visual controls only. The canvas owns pointer conversion and command dispatch. */
export function CanvasSelectionHandles({
  locale,
  selectionBounds,
  showResizeHandles,
  showRotateHandle,
  showTextBoxWidthHandles,
  showBoundingRect = true,
  showSelectionToolbar = true,
  onResizePointerDown,
  onRotatePointerDown,
  onResizeKeyDown,
  onRotateKeyDown,
  onTextBoxWidthPointerDown,
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
        top: `${(selectionBounds.y / SELECTION_SCENE_HEIGHT) * 100}%`,
        width: `${selectionBounds.width}%`,
        height: `${(selectionBounds.height / SELECTION_SCENE_HEIGHT) * 100}%`,
      }}
    >
      {showBoundingRect ? <div className="absolute inset-0 border-2 border-[#7eb6ff]" /> : null}
      {showResizeHandles ? (
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
        </>
      ) : null}
      {showRotateHandle ? (
        <>
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
      {showTextBoxWidthHandles ? (
        <TextBoxWidthHandles
          locale={locale}
          onPointerDown={requireTextBoxWidthPointerDown(onTextBoxWidthPointerDown)}
        />
      ) : null}
      {showSelectionToolbar ? <CanvasSelectionToolbar locale={locale} /> : null}
    </div>
  );
}

/** Path guides and handles in scene coordinates. Parent is the canvas artboard. */
export function CanvasTextPathOverlay({
  locale,
  overlay,
  onPointerDown,
}: CanvasTextPathOverlayProps) {
  const copy = getCoatWorkbenchCopy(locale).canvas;
  const handlePointerDown = requireTextPathPointerDown(onPointerDown);
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      style={{ containerType: 'size' }}
    >
      <div
        className="relative h-full w-auto max-h-full max-w-full"
        data-text-path-meet-box=""
        style={textPathMeetBoxStyle()}
      >
        <TextPathGuideSvg overlay={overlay} />
        {overlay.handles.map((handle) => (
          <button
            aria-label={textPathHandleAriaLabel(copy, handle.kind)}
            className="pointer-events-auto absolute z-40 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#7eb6ff] bg-white shadow-sm"
            data-text-path-handle={handle.kind}
            key={handle.kind}
            style={scenePointToOverlayStyle(handle.point)}
            type="button"
            onPointerDown={(event) => handlePointerDown(event, handle.kind)}
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#7eb6ff]" />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Same letterbox as SVG `xMidYMid meet` on a 100×110 viewBox. */
function textPathMeetBoxStyle(): { aspectRatio: string; width: string; height: string } {
  return {
    aspectRatio: `${SELECTION_SCENE_WIDTH} / ${SELECTION_SCENE_HEIGHT}`,
    width: `min(100cqw, calc(100cqh * ${SELECTION_SCENE_WIDTH} / ${SELECTION_SCENE_HEIGHT}))`,
    height: `min(100cqh, calc(100cqw * ${SELECTION_SCENE_HEIGHT} / ${SELECTION_SCENE_WIDTH}))`,
  };
}

function TextPathGuideSvg({ overlay }: { overlay: CanvasTextPathGuide }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${SELECTION_SCENE_WIDTH} ${SELECTION_SCENE_HEIGHT}`}
    >
      {overlay.mode === 'curve' ? (
        <path
          d={`M${overlay.curve.start.x} ${overlay.curve.start.y} Q${overlay.curve.control.x} ${overlay.curve.control.y} ${overlay.curve.end.x} ${overlay.curve.end.y}`}
          data-text-path-guide="curve"
          fill="none"
          stroke={HANDLE_COLOR}
          strokeDasharray="3 3"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <circle
          cx={overlay.ring.center.x}
          cy={overlay.ring.center.y}
          data-text-path-guide="ring"
          fill="none"
          r={overlay.ring.radius}
          stroke={HANDLE_COLOR}
          strokeDasharray="3 3"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

function TextBoxWidthHandles({
  locale,
  onPointerDown,
}: {
  locale: CoatLocale;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, side: CanvasTextBoxWidthHandleSide) => void;
}) {
  const copy = getCoatWorkbenchCopy(locale).canvas;
  return (
    <>
      <TextBoxWidthHandleButton
        ariaLabel={copy.adjustStraightTextWidthHandle('left')}
        side="left"
        className="left-0 -translate-x-1/2"
        onPointerDown={onPointerDown}
      />
      <TextBoxWidthHandleButton
        ariaLabel={copy.adjustStraightTextWidthHandle('right')}
        side="right"
        className="right-0 translate-x-1/2"
        onPointerDown={onPointerDown}
      />
    </>
  );
}

function TextBoxWidthHandleButton({
  ariaLabel,
  side,
  className,
  onPointerDown,
}: {
  ariaLabel: string;
  side: CanvasTextBoxWidthHandleSide;
  className: string;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, side: CanvasTextBoxWidthHandleSide) => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`pointer-events-auto absolute top-1/2 z-30 flex h-10 w-6 -translate-y-1/2 cursor-ew-resize items-center justify-center ${className}`}
      data-text-box-width-handle={side}
      type="button"
      onPointerDown={(event) => onPointerDown(event, side)}
    >
      <span aria-hidden="true" className="pointer-events-none h-8 w-1.5 rounded-sm bg-[#7eb6ff]" />
    </button>
  );
}

function textPathHandleAriaLabel(
  copy: ReturnType<typeof getCoatWorkbenchCopy>['canvas'],
  kind: CanvasTextPathHandleKind,
): string {
  switch (kind) {
    case 'curve-start':
      return copy.adjustCurvedTextStartHandle;
    case 'curve-control':
      return copy.adjustCurvedTextHandle;
    case 'curve-end':
      return copy.adjustCurvedTextEndHandle;
    case 'ring-radius':
      return copy.adjustRingTextHandle;
  }
}

function requireTextPathPointerDown(
  onPointerDown: CanvasTextPathOverlayProps['onPointerDown'],
): (event: PointerEvent<HTMLButtonElement>, kind: CanvasTextPathHandleKind) => void {
  if (!onPointerDown) {
    throw new Error('Missing text path pointer handler');
  }
  return onPointerDown;
}

function requireTextBoxWidthPointerDown(
  onTextBoxWidthPointerDown: CanvasSelectionHandlesProps['onTextBoxWidthPointerDown'],
): (event: PointerEvent<HTMLButtonElement>, side: CanvasTextBoxWidthHandleSide) => void {
  if (!onTextBoxWidthPointerDown) {
    throw new Error('Missing text box width pointer handler');
  }
  return onTextBoxWidthPointerDown;
}

function scenePointToOverlayStyle(point: CanvasScenePoint): { left: string; top: string } {
  return {
    left: `${(point.x / SELECTION_SCENE_WIDTH) * 100}%`,
    top: `${(point.y / SELECTION_SCENE_HEIGHT) * 100}%`,
  };
}
