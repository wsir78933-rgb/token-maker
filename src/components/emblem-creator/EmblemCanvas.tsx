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

interface PointerGesture {
  pointerId: number;
  element: EmblemElement;
  start: CanvasPoint;
  mode: 'move' | 'scale';
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

function getGestureTransform(gesture: PointerGesture, point: CanvasPoint): EmblemElementTransform {
  const { transform, source } = gesture.element;
  if (gesture.mode === 'move') {
    return {
      ...transform,
      x: Math.min(EMBLEM_CANVAS.width, Math.max(0, transform.x + point.x - gesture.start.x)),
      y: Math.min(EMBLEM_CANVAS.height, Math.max(0, transform.y + point.y - gesture.start.y)),
    };
  }

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
      svg.focus({ preventScroll: true });
      svg.setPointerCapture(event.pointerId);
      gestureRef.current = { pointerId: event.pointerId, element, start, mode };
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

  return (
    <div lang={locale} className="min-w-0 space-y-3">
      <div
        className="overflow-hidden rounded-lg border border-border"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: 'conic-gradient(#e2e8f0 25%, transparent 0 50%, #e2e8f0 0 75%, transparent 0)',
          backgroundSize: '24px 24px',
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
