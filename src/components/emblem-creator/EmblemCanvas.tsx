'use client';

import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import {
  EMBLEM_CANVAS,
  EMBLEM_LAYER_ORDER,
  type EmblemElement,
  type EmblemElementTransform,
  type EmblemLocale,
  type EmblemProject,
} from '@/lib/emblem-creator/types';

export interface EmblemCanvasProps {
  locale: EmblemLocale;
  project: EmblemProject;
  copy: EmblemCreatorCopy;
  selectedElementId: string | null;
  showEditBounds: boolean;
  onSelectElement(elementId: string | null): void;
  onElementTransform(elementId: string, transform: EmblemElementTransform): void;
}

interface CanvasPoint {
  x: number;
  y: number;
}

const ROTATION_HANDLE_HIT_SIZE = 144;
const ROTATION_HANDLE_GAP = 24;
const ROTATION_HANDLE_ARROW_MARGIN = 32;
const ROTATION_KEYBOARD_STEP_DEGREES = 5;

interface PointerGesture {
  pointerId: number;
  element: EmblemElement;
  start: CanvasPoint;
  mode: 'move' | 'scale' | 'rotate';
  lastPointerAngleDegrees: number | null;
  nextRotationDegrees: number;
}

function getCanvasPoint(svg: SVGSVGElement, clientX: number, clientY: number): CanvasPoint {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    throw new Error(`Invalid pointer coordinates: x=${clientX}, y=${clientY}.`);
  }

  const screenMatrix = svg.getScreenCTM?.();
  let point: CanvasPoint;
  if (screenMatrix) {
    const inverse = screenMatrix.inverse();
    point = {
      x: inverse.a * clientX + inverse.c * clientY + inverse.e,
      y: inverse.b * clientX + inverse.d * clientY + inverse.f,
    };
  } else {
    // Match the SVG's xMidYMid meet alignment, including any letterboxing.
    const rectangle = svg.getBoundingClientRect();
    if (rectangle.width <= 0 || rectangle.height <= 0) {
      throw new Error(`Invalid canvas rectangle: width=${rectangle.width}, height=${rectangle.height}.`);
    }
    const screenScale = Math.min(rectangle.width / EMBLEM_CANVAS.width, rectangle.height / EMBLEM_CANVAS.height);
    point = {
      x: (clientX - rectangle.left - (rectangle.width - EMBLEM_CANVAS.width * screenScale) / 2) / screenScale,
      y: (clientY - rectangle.top - (rectangle.height - EMBLEM_CANVAS.height * screenScale) / 2) / screenScale,
    };
  }

  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error(`Invalid canvas coordinates: x=${point.x}, y=${point.y}.`);
  }
  return point;
}

function getPointerAngleDegrees(element: EmblemElement, point: CanvasPoint): number {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error(`Invalid rotation pointer coordinates for element ${element.id}: x=${point.x}, y=${point.y}.`);
  }

  const centerX = element.transform.x;
  const centerY = element.transform.y;
  if (!Number.isFinite(centerX) || !Number.isFinite(centerY)) {
    throw new Error(`Invalid rotation center for element ${element.id}: x=${centerX}, y=${centerY}.`);
  }

  const offsetX = point.x - centerX;
  const offsetY = point.y - centerY;
  if (!Number.isFinite(offsetX) || !Number.isFinite(offsetY)) {
    throw new Error(`Invalid rotation pointer offset for element ${element.id}: x=${offsetX}, y=${offsetY}.`);
  }
  if (offsetX === 0 && offsetY === 0) {
    throw new Error(
      `Cannot rotate element ${element.id}: pointer is at its center (${centerX}, ${centerY}) from point (${point.x}, ${point.y}).`,
    );
  }

  const angleDegrees = Math.atan2(offsetY, offsetX) * (180 / Math.PI);
  if (!Number.isFinite(angleDegrees)) {
    throw new Error(`Invalid rotation pointer angle for element ${element.id}: angle=${angleDegrees}.`);
  }
  return angleDegrees;
}

function getShortestRotationDeltaDegrees(previousAngleDegrees: number, nextAngleDegrees: number): number {
  if (!Number.isFinite(previousAngleDegrees) || !Number.isFinite(nextAngleDegrees)) {
    throw new Error(
      `Invalid rotation angle change: previous=${previousAngleDegrees}, next=${nextAngleDegrees}.`,
    );
  }

  const deltaDegrees = ((nextAngleDegrees - previousAngleDegrees + 540) % 360) - 180;
  if (!Number.isFinite(deltaDegrees)) {
    throw new Error(
      `Invalid normalized rotation angle change: previous=${previousAngleDegrees}, next=${nextAngleDegrees}, delta=${deltaDegrees}.`,
    );
  }
  return deltaDegrees;
}

function getRotationHandlePosition(element: EmblemElement): CanvasPoint {
  const { x, y, scale, rotation } = element.transform;
  const width = element.source.naturalWidth * scale;
  const height = element.source.naturalHeight * scale;
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(scale) || !Number.isFinite(rotation)) {
    throw new Error(
      `Invalid rotation handle transform for element ${element.id}: x=${x}, y=${y}, scale=${scale}, rotation=${rotation}.`,
    );
  }
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error(
      `Invalid rotation handle dimensions for element ${element.id}: width=${width}, height=${height}.`,
    );
  }

  // Anchor above the unrotated top edge so rotation does not change the handle position.
  const halfHeight = height / 2;
  const minimumCenterDistance = ROTATION_HANDLE_GAP + ROTATION_HANDLE_HIT_SIZE / 2;
  const arrowCenterDistance = Math.max(minimumCenterDistance, ROTATION_HANDLE_ARROW_MARGIN * scale + ROTATION_HANDLE_GAP);
  const handleMargin = Math.min(
    Math.min(EMBLEM_CANVAS.width, EMBLEM_CANVAS.height) / 2 - minimumCenterDistance,
    Math.max(ROTATION_HANDLE_HIT_SIZE / 2, ROTATION_HANDLE_ARROW_MARGIN * scale),
  );
  const separation = ROTATION_HANDLE_ARROW_MARGIN * scale + ROTATION_HANDLE_GAP;
  let boundedX = Math.min(EMBLEM_CANVAS.width - handleMargin, Math.max(handleMargin, x));
  const boundedY = Math.min(EMBLEM_CANVAS.height - handleMargin, Math.max(handleMargin, y - halfHeight - separation));
  if (Math.hypot(boundedX - x, boundedY - y) < arrowCenterDistance) {
    const shiftedX = x <= EMBLEM_CANVAS.width / 2 ? x + arrowCenterDistance : x - arrowCenterDistance;
    boundedX = Math.min(EMBLEM_CANVAS.width - ROTATION_HANDLE_HIT_SIZE / 2, Math.max(ROTATION_HANDLE_HIT_SIZE / 2, shiftedX));
  }
  if (!Number.isFinite(boundedX) || !Number.isFinite(boundedY)) {
    throw new Error(
      `Invalid rotation handle position for element ${element.id}: x=${boundedX}, y=${boundedY}.`,
    );
  }
  return { x: boundedX, y: boundedY };
}

function getGestureTransform(gesture: PointerGesture, point: CanvasPoint): EmblemElementTransform {
  const { transform, source } = gesture.element;
  if (gesture.mode === 'move') {
    return {
      ...transform,
      x: Math.min(EMBLEM_CANVAS.width, Math.max(0, transform.x + point.x - gesture.start.x)),
      y: Math.min(EMBLEM_CANVAS.height, Math.max(0, transform.y + point.y - gesture.start.y)),
    };
  }

  if (gesture.mode === 'scale') {
    const startDistance = Math.hypot(gesture.start.x - transform.x, gesture.start.y - transform.y);
    if (startDistance === 0) {
      throw new Error(`Cannot scale element ${gesture.element.id}: pointer starts at its center (${transform.x}, ${transform.y}).`);
    }
    const distance = Math.hypot(point.x - transform.x, point.y - transform.y);
    return {
      ...transform,
      scale: Math.max(1 / Math.max(source.naturalWidth, source.naturalHeight), transform.scale * distance / startDistance),
    };
  }

  if (gesture.lastPointerAngleDegrees === null) {
    throw new Error(`Rotation gesture for element ${gesture.element.id} has no starting pointer angle.`);
  }
  const pointerAngleDegrees = getPointerAngleDegrees(gesture.element, point);
  const deltaDegrees = getShortestRotationDeltaDegrees(gesture.lastPointerAngleDegrees, pointerAngleDegrees);
  gesture.lastPointerAngleDegrees = pointerAngleDegrees;
  gesture.nextRotationDegrees += deltaDegrees;
  if (!Number.isFinite(gesture.nextRotationDegrees)) {
    throw new Error(
      `Rotation for element ${gesture.element.id} is not finite: base=${transform.rotation}, delta=${deltaDegrees}.`,
    );
  }
  return { ...transform, rotation: gesture.nextRotationDegrees };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function EmblemCanvas({
  locale,
  project,
  copy,
  selectedElementId,
  showEditBounds,
  onSelectElement,
  onElementTransform,
}: EmblemCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gestureRef = useRef<PointerGesture | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [failedImageUrls, setFailedImageUrls] = useState<ReadonlySet<string>>(new Set());
  const drawingOrder = [...EMBLEM_LAYER_ORDER].reverse();
  const selectedLayerId = EMBLEM_LAYER_ORDER.find((layerId) =>
    project.layers[layerId].elements.some((element) => element.id === selectedElementId));
  const selectedElementIndex = selectedLayerId
    ? project.layers[selectedLayerId].elements.findIndex((element) => element.id === selectedElementId)
    : -1;
  const visibleElements = drawingOrder.flatMap((layerId) => project.layers[layerId].visible ? project.layers[layerId].elements : []);
  const visibleSelectedElement = visibleElements.find((element) => element.id === selectedElementId);
  const imageErrors = [...new Set(visibleElements.map((element) => element.source.url))]
    .filter((url) => failedImageUrls.has(url));

  const endGesture = useCallback(() => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    gestureRef.current = null;
    try {
      const svg = svgRef.current;
      if (svg?.hasPointerCapture?.(gesture.pointerId)) {
        svg.releasePointerCapture(gesture.pointerId);
      }
    } catch (error) {
      setInteractionError(getErrorMessage(error));
    }
  }, []);

  useLayoutEffect(() => {
    // Only a changed parent selection cancels; pointerdown may still await its selection callback.
    const gesture = gestureRef.current;
    if (gesture && selectedElementId !== gesture.element.id) endGesture();
  }, [selectedElementId, endGesture]);

  function startGesture(event: PointerEvent<SVGElement>, element: EmblemElement, mode: PointerGesture['mode']) {
    if (event.button !== 0 || event.isPrimary === false || gestureRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      const svg = svgRef.current;
      if (!svg) throw new Error(`Canvas is unavailable for element ${element.id}.`);
      const start = getCanvasPoint(svg, event.clientX, event.clientY);
      if (typeof svg.setPointerCapture !== 'function') {
        throw new Error(`Pointer capture is unavailable for pointer ${event.pointerId}.`);
      }
      const nextRotationDegrees = element.transform.rotation;
      if (!Number.isFinite(nextRotationDegrees)) {
        throw new Error(`Invalid starting rotation for element ${element.id}: ${nextRotationDegrees}.`);
      }
      const lastPointerAngleDegrees = mode === 'rotate'
        ? getPointerAngleDegrees(element, start)
        : null;
      svg.focus({ preventScroll: true });
      svg.setPointerCapture(event.pointerId);
      gestureRef.current = {
        pointerId: event.pointerId,
        element,
        start,
        mode,
        lastPointerAngleDegrees,
        nextRotationDegrees,
      };
      onSelectElement(element.id);
      setInteractionError(null);
    } catch (error) {
      gestureRef.current = null;
      setInteractionError(getErrorMessage(error));
    }
  }

  function moveGesture(event: PointerEvent<SVGSVGElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.preventDefault();
    try {
      const elementIsVisible = visibleElements.some((element) => element.id === gesture.element.id);
      if (!elementIsVisible) {
        finishGesture(event);
        return;
      }
      const point = getCanvasPoint(event.currentTarget, event.clientX, event.clientY);
      onElementTransform(gesture.element.id, getGestureTransform(gesture, point));
    } catch (error) {
      finishGesture(event);
      setInteractionError(getErrorMessage(error));
    }
  }

  function finishGesture(event: PointerEvent<SVGSVGElement>) {
    if (gestureRef.current?.pointerId !== event.pointerId) return;
    endGesture();
  }

  function selectWithKeyboard(event: KeyboardEvent<SVGGElement>, element: EmblemElement) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectElement(element.id);
      return;
    }
    if (element.id !== selectedElementId) return;
    const distance = event.shiftKey ? 10 : 1;
    const offsets: Record<string, CanvasPoint> = {
      ArrowLeft: { x: -distance, y: 0 }, ArrowRight: { x: distance, y: 0 },
      ArrowUp: { x: 0, y: -distance }, ArrowDown: { x: 0, y: distance },
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    onElementTransform(element.id, {
      ...element.transform,
      x: Math.min(EMBLEM_CANVAS.width, Math.max(0, element.transform.x + offset.x)),
      y: Math.min(EMBLEM_CANVAS.height, Math.max(0, element.transform.y + offset.y)),
    });
  }

  function scaleWithKeyboard(event: KeyboardEvent<SVGGElement>, element: EmblemElement) {
    let factor: number;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === '+') factor = 1.05;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === '-') factor = 1 / 1.05;
    else return;
    event.preventDefault();
    event.stopPropagation();
    onElementTransform(element.id, {
      ...element.transform,
      scale: Math.max(1 / Math.max(element.source.naturalWidth, element.source.naturalHeight), element.transform.scale * factor),
    });
  }

  function rotateWithKeyboard(event: KeyboardEvent<SVGGElement>, element: EmblemElement) {
    let deltaDegrees: number;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') deltaDegrees = ROTATION_KEYBOARD_STEP_DEGREES;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') deltaDegrees = -ROTATION_KEYBOARD_STEP_DEGREES;
    else return;
    event.preventDefault();
    event.stopPropagation();
    const nextRotationDegrees = element.transform.rotation + deltaDegrees;
    if (!Number.isFinite(nextRotationDegrees)) {
      throw new Error(
        `Rotation for element ${element.id} is not finite: current=${element.transform.rotation}, delta=${deltaDegrees}.`,
      );
    }
    onElementTransform(element.id, { ...element.transform, rotation: nextRotationDegrees });
  }

  const rotationHandlePosition = visibleSelectedElement
    ? getRotationHandlePosition(visibleSelectedElement)
    : null;

  return (
    <div lang={locale} className="min-w-0 space-y-3">
      <div
        className="overflow-hidden rounded-lg border border-border"
        style={{
          backgroundColor: '#fff',
        }}
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${EMBLEM_CANVAS.width} ${EMBLEM_CANVAS.height}`}
          width={EMBLEM_CANVAS.width}
          height={EMBLEM_CANVAS.height}
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label={copy.canvasLabel}
          tabIndex={0}
          className="block h-auto w-full touch-none select-none"
          onPointerDown={(event) => {
            if (event.button === 0 && event.isPrimary !== false && !gestureRef.current) onSelectElement(null);
          }}
          onPointerMove={moveGesture}
          onPointerUp={finishGesture}
          onPointerCancel={finishGesture}
          onLostPointerCapture={finishGesture}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              endGesture();
              onSelectElement(null);
            }
          }}
        >
          {drawingOrder.map((layerId) => project.layers[layerId].visible && (
            <g key={layerId} data-layer-id={layerId}>
              {project.layers[layerId].elements.map((element) => (
                <g
                  key={element.id}
                  data-element-id={element.id}
                  transform={`translate(${element.transform.x} ${element.transform.y}) rotate(${element.transform.rotation}) scale(${element.transform.mirrorX ? -element.transform.scale : element.transform.scale} ${element.transform.scale})`}
                  role="button"
                  aria-label={`${copy.assets.chooseAsset}: ${copy.layers.names[layerId]} — ${element.id}`}
                  aria-pressed={element.id === selectedElementId}
                  tabIndex={0}
                  className="cursor-move outline-none focus-visible:opacity-70"
                  onPointerDown={(event) => startGesture(event, element, 'move')}
                  onKeyDown={(event) => selectWithKeyboard(event, element)}
                >
                  <image
                    href={element.source.url}
                    x={-element.source.naturalWidth / 2}
                    y={-element.source.naturalHeight / 2}
                    width={element.source.naturalWidth}
                    height={element.source.naturalHeight}
                    preserveAspectRatio="xMidYMid meet"
                    onError={() => setFailedImageUrls((previous) => new Set(previous).add(element.source.url))}
                    onLoad={() => setFailedImageUrls((previous) => {
                      if (!previous.has(element.source.url)) return previous;
                      const remaining = new Set(previous);
                      remaining.delete(element.source.url);
                      return remaining;
                    })}
                  />
                </g>
              ))}
            </g>
          ))}
          {showEditBounds && visibleSelectedElement && (
            <g
              data-edit-bounds={visibleSelectedElement.id}
              transform={`translate(${visibleSelectedElement.transform.x} ${visibleSelectedElement.transform.y}) rotate(${visibleSelectedElement.transform.rotation})`}
            >
              <rect
                x={-visibleSelectedElement.source.naturalWidth * visibleSelectedElement.transform.scale / 2}
                y={-visibleSelectedElement.source.naturalHeight * visibleSelectedElement.transform.scale / 2}
                width={visibleSelectedElement.source.naturalWidth * visibleSelectedElement.transform.scale}
                height={visibleSelectedElement.source.naturalHeight * visibleSelectedElement.transform.scale}
                fill="none"
                stroke="#2563eb"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
              <g
                role="button"
                aria-label={`${copy.properties.width} / ${copy.properties.height}: ${visibleSelectedElement.id}`}
                tabIndex={0}
                data-scale-handle={visibleSelectedElement.id}
                transform={`translate(${visibleSelectedElement.source.naturalWidth * visibleSelectedElement.transform.scale / 2} ${visibleSelectedElement.source.naturalHeight * visibleSelectedElement.transform.scale / 2})`}
                className="cursor-nwse-resize outline-none focus-visible:opacity-70"
                onPointerDown={(event) => startGesture(event, visibleSelectedElement, 'scale')}
                onKeyDown={(event) => scaleWithKeyboard(event, visibleSelectedElement)}
              >
                <rect x={-48} y={-48} width={96} height={96} fill="transparent" />
                <rect x={-14} y={-14} width={28} height={28} rx={4} fill="white" stroke="#2563eb" strokeWidth={2} vectorEffect="non-scaling-stroke" pointerEvents="none" />
              </g>
            </g>
          )}
          {rotationHandlePosition && visibleSelectedElement && (
            <g
              data-rotation-handle={visibleSelectedElement.id}
              role="button"
              aria-label={`${copy.properties.rotation}: ${visibleSelectedElement.id}`}
              aria-pressed="true"
              tabIndex={0}
              className="cursor-pointer touch-none select-none outline-none focus-visible:opacity-70 active:cursor-grabbing"
              onPointerDown={(event) => startGesture(event, visibleSelectedElement, 'rotate')}
              onKeyDown={(event) => rotateWithKeyboard(event, visibleSelectedElement)}
            >
              <rect
                x={rotationHandlePosition.x - ROTATION_HANDLE_HIT_SIZE / 2}
                y={rotationHandlePosition.y - ROTATION_HANDLE_HIT_SIZE / 2}
                width={ROTATION_HANDLE_HIT_SIZE}
                height={ROTATION_HANDLE_HIT_SIZE}
                rx={ROTATION_HANDLE_HIT_SIZE / 2}
                fill="transparent"
                pointerEvents="all"
              />
              <g transform={`translate(${rotationHandlePosition.x} ${rotationHandlePosition.y}) scale(${visibleSelectedElement.transform.scale})`}>
                <path
                  d="M 14 -14 A 20 20 0 1 1 -14 -14"
                  fill="none"
                  stroke="#000"
                  strokeWidth={2 * visibleSelectedElement.transform.scale}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="stroke"
                />
                <path
                  d="M -14 -4 v -10 h -10"
                  fill="none"
                  stroke="#000"
                  strokeWidth={2 * visibleSelectedElement.transform.scale}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="stroke"
                />
              </g>
            </g>
          )}
        </svg>
      </div>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {selectedLayerId ? `${copy.selectedLabel}: ${copy.layers.names[selectedLayerId]} · ${selectedElementIndex + 1}` : copy.noSelection}
      </p>
      {(interactionError || imageErrors.length > 0) && (
        <div role="alert" className="space-y-1 break-all rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">{copy.errorTitle}</p>
          {interactionError && <p>{copy.errors.operationFailed}: {interactionError}</p>}
          {imageErrors.map((url) => <p key={url}>{copy.errors.loadImageFailed}: {url}</p>)}
        </div>
      )}
    </div>
  );
}
