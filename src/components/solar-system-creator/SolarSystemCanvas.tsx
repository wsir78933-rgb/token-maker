'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import { getSolarAsset } from '@/lib/solar-system-creator/catalog';
import {
  SOLAR_CANVAS_HEIGHT,
  SOLAR_CANVAS_WIDTH,
  SOLAR_STAR_HEIGHT,
  SOLAR_STAR_WIDTH,
  type ManualSolarPlanet,
  type RandomSolarPlanet,
  type SolarAsset,
  type SolarPlanetTransform,
} from '@/lib/solar-system-creator/types';

export interface SolarSystemCanvasProps {
  starAssetId: string | null;
  planets: readonly (RandomSolarPlanet | ManualSolarPlanet)[];
  selectedPlanetId: string | null;
  interactive?: boolean;
  draggingEnabled: boolean;
  resizingEnabled: boolean;
  label: string;
  planetLabel: (index: number) => string;
  resizeLabel: (index: number) => string;
  onSelectPlanet: (id: string) => void;
  onPlanetTransform?: (id: string, transform: SolarPlanetTransform) => void;
}

type SolarPlanet = RandomSolarPlanet | ManualSolarPlanet;
type PointerGestureMode = 'select' | 'drag' | 'resize';

interface CanvasPoint {
  x: number;
  y: number;
}

interface RenderPlanet {
  planet: SolarPlanet;
  asset: SolarAsset;
}

interface PointerGesture {
  pointerId: number;
  planetId: string;
  mode: PointerGestureMode;
  start: CanvasPoint;
  initialTransform: SolarPlanetTransform;
  moved: boolean;
}

interface ResizeHitArea {
  x: number;
  y: number;
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
}

interface ResizeAxisHitArea {
  start: number;
  extent: number;
  anchor: number;
}

const MIN_PLANET_SIZE = 8;
const POINTER_MOVE_THRESHOLD = 2;
const RESIZE_HIT_SIZE = 120;
const RESIZE_MARKER_SIZE = 14;

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  if (typeof receivedValue === 'number' || typeof receivedValue === 'boolean' || typeof receivedValue === 'bigint') {
    return String(receivedValue);
  }

  const serializedValue = JSON.stringify(receivedValue);
  return serializedValue === undefined ? Object.prototype.toString.call(receivedValue) : serializedValue;
}

function requireNonEmptyString(receivedValue: unknown, fieldName: string): string {
  if (typeof receivedValue !== 'string' || receivedValue.length === 0) {
    throw new Error(`${fieldName} must be a non-empty string. Received ${describeReceivedValue(receivedValue)}.`);
  }

  return receivedValue;
}

function requireFiniteNumber(receivedValue: unknown, fieldName: string): number {
  if (typeof receivedValue !== 'number' || !Number.isFinite(receivedValue)) {
    throw new Error(`${fieldName} must be a finite number. Received ${describeReceivedValue(receivedValue)}.`);
  }

  return receivedValue;
}

function requireBoolean(receivedValue: unknown, fieldName: string): boolean {
  if (typeof receivedValue !== 'boolean') {
    throw new Error(`${fieldName} must be a boolean. Received ${describeReceivedValue(receivedValue)}.`);
  }

  return receivedValue;
}

function requirePlanetTransform(
  receivedTransform: SolarPlanetTransform,
  planetId: string,
): SolarPlanetTransform {
  const x = requireFiniteNumber(receivedTransform.x, `Solar planet ${JSON.stringify(planetId)} x`);
  const y = requireFiniteNumber(receivedTransform.y, `Solar planet ${JSON.stringify(planetId)} y`);
  const width = requireFiniteNumber(receivedTransform.width, `Solar planet ${JSON.stringify(planetId)} width`);
  const height = requireFiniteNumber(receivedTransform.height, `Solar planet ${JSON.stringify(planetId)} height`);

  if (width <= 0 || height <= 0) {
    throw new Error(
      `Solar planet ${JSON.stringify(planetId)} dimensions must be greater than zero. Received width=${width}, height=${height}.`,
    );
  }

  if (Math.abs(width - height) > Number.EPSILON) {
    throw new Error(
      `Solar planet ${JSON.stringify(planetId)} must keep a square aspect ratio. Received width=${width}, height=${height}.`,
    );
  }

  if (x < 0 || y < 0 || x + width > SOLAR_CANVAS_WIDTH || y + height > SOLAR_CANVAS_HEIGHT) {
    throw new Error(
      `Solar planet ${JSON.stringify(planetId)} must stay inside the ${SOLAR_CANVAS_WIDTH}×${SOLAR_CANVAS_HEIGHT} canvas. Received x=${x}, y=${y}, width=${width}, height=${height}.`,
    );
  }

  return { x, y, width, height };
}

function requireRenderPlanets(planets: readonly SolarPlanet[]): RenderPlanet[] {
  if (!Array.isArray(planets)) {
    throw new Error(`Solar planets must be an array. Received ${describeReceivedValue(planets)}.`);
  }

  const planetIds = new Set<string>();
  return planets.map((planet, index) => {
    const planetId = requireNonEmptyString(planet.id, `Solar planet ${index + 1} id`);
    const assetId = requireNonEmptyString(planet.assetId, `Solar planet ${JSON.stringify(planetId)} asset id`);
    if (planetIds.has(planetId)) {
      throw new Error(`Solar planet ids must be unique. Received duplicate ${JSON.stringify(planetId)}.`);
    }
    planetIds.add(planetId);

    const transform = requirePlanetTransform(planet, planetId);
    const asset = getSolarAsset(assetId);
    if (asset.category === 'star') {
      throw new Error(`Solar planet ${JSON.stringify(planetId)} cannot use star asset ${JSON.stringify(assetId)}.`);
    }

    return { planet: { ...planet, ...transform }, asset };
  });
}

function requireStarAsset(assetId: string | null): SolarAsset | null {
  if (assetId === null) return null;
  const validAssetId = requireNonEmptyString(assetId, 'Solar star asset id');
  const asset = getSolarAsset(validAssetId);
  if (asset.category !== 'star') {
    throw new Error(`Solar star asset must use the star category. Received ${JSON.stringify(validAssetId)}.`);
  }

  return asset;
}

function clampValue(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(minimum) || !Number.isFinite(maximum)) {
    throw new Error(`Solar canvas clamp requires finite values. Received value=${value}, minimum=${minimum}, maximum=${maximum}.`);
  }

  return Math.min(maximum, Math.max(minimum, value));
}

function getCanvasPoint(svg: SVGSVGElement, clientX: number, clientY: number): CanvasPoint {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    throw new Error(`Solar canvas pointer coordinates must be finite. Received x=${clientX}, y=${clientY}.`);
  }

  const screenMatrix = svg.getScreenCTM?.();
  if (screenMatrix && typeof screenMatrix.inverse === 'function') {
    const inverseMatrix = screenMatrix.inverse();
    const point = {
      x: inverseMatrix.a * clientX + inverseMatrix.c * clientY + inverseMatrix.e,
      y: inverseMatrix.b * clientX + inverseMatrix.d * clientY + inverseMatrix.f,
    };
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      throw new Error(`Solar canvas transformed pointer coordinates are invalid. Received x=${point.x}, y=${point.y}.`);
    }
    return point;
  }

  const rectangle = svg.getBoundingClientRect();
  if (rectangle.width <= 0 || rectangle.height <= 0) {
    throw new Error(`Solar canvas rectangle must have positive dimensions. Received width=${rectangle.width}, height=${rectangle.height}.`);
  }

  const point = {
    x: (clientX - rectangle.left) * SOLAR_CANVAS_WIDTH / rectangle.width,
    y: (clientY - rectangle.top) * SOLAR_CANVAS_HEIGHT / rectangle.height,
  };
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error(`Solar canvas pointer coordinates are invalid after scaling. Received x=${point.x}, y=${point.y}.`);
  }
  return point;
}

function getDraggedTransform(
  initialTransform: SolarPlanetTransform,
  start: CanvasPoint,
  point: CanvasPoint,
): SolarPlanetTransform {
  return {
    x: clampValue(initialTransform.x + point.x - start.x, 0, SOLAR_CANVAS_WIDTH - initialTransform.width),
    y: clampValue(initialTransform.y + point.y - start.y, 0, SOLAR_CANVAS_HEIGHT - initialTransform.height),
    width: initialTransform.width,
    height: initialTransform.height,
  };
}

function getResizedTransform(
  initialTransform: SolarPlanetTransform,
  start: CanvasPoint,
  point: CanvasPoint,
): SolarPlanetTransform {
  const horizontalDelta = point.x - start.x;
  const verticalDelta = point.y - start.y;
  const sizeDelta = Math.abs(horizontalDelta) >= Math.abs(verticalDelta) ? horizontalDelta : verticalDelta;
  const maximumSize = Math.min(
    SOLAR_CANVAS_WIDTH - initialTransform.x,
    SOLAR_CANVAS_HEIGHT - initialTransform.y,
  );
  const minimumSize = Math.min(MIN_PLANET_SIZE, maximumSize);
  const size = clampValue(initialTransform.width + sizeDelta, minimumSize, maximumSize);

  return { x: initialTransform.x, y: initialTransform.y, width: size, height: size };
}

function getPlanetTransform(planet: SolarPlanet): SolarPlanetTransform {
  return {
    x: planet.x,
    y: planet.y,
    width: planet.width,
    height: planet.height,
  };
}

function getResizeAxisHitArea(start: number, extent: number, canvasExtent: number): ResizeAxisHitArea {
  const availableEnd = canvasExtent - (start + extent);
  const availableStart = start;
  if (availableEnd >= availableStart && availableEnd > 0) {
    const anchor = start + extent;
    return { start: anchor, extent: Math.min(RESIZE_HIT_SIZE, availableEnd), anchor };
  }
  if (availableStart > 0) {
    const anchor = start;
    return { start: anchor - Math.min(RESIZE_HIT_SIZE, availableStart), extent: Math.min(RESIZE_HIT_SIZE, availableStart), anchor };
  }

  const innerExtent = Math.min(RESIZE_MARKER_SIZE, extent);
  const innerStart = start + extent - innerExtent;
  return { start: innerStart, extent: innerExtent, anchor: innerStart + innerExtent / 2 };
}

function getResizeHitArea(transform: SolarPlanetTransform): ResizeHitArea {
  const horizontalHitArea = getResizeAxisHitArea(transform.x, transform.width, SOLAR_CANVAS_WIDTH);
  const verticalHitArea = getResizeAxisHitArea(transform.y, transform.height, SOLAR_CANVAS_HEIGHT);
  return {
    x: horizontalHitArea.start,
    y: verticalHitArea.start,
    width: horizontalHitArea.extent,
    height: verticalHitArea.extent,
    anchorX: horizontalHitArea.anchor,
    anchorY: verticalHitArea.anchor,
  };
}

function getArrowDelta(event: KeyboardEvent<SVGGElement>): CanvasPoint | null {
  const step = event.shiftKey ? 10 : 1;
  if (event.key === 'ArrowLeft') return { x: -step, y: 0 };
  if (event.key === 'ArrowRight') return { x: step, y: 0 };
  if (event.key === 'ArrowUp') return { x: 0, y: -step };
  if (event.key === 'ArrowDown') return { x: 0, y: step };
  return null;
}

function getResizeDelta(event: KeyboardEvent<SVGGElement>): number | null {
  const step = event.shiftKey ? 10 : 1;
  if (event.key === 'ArrowUp' || event.key === 'ArrowRight') return step;
  if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') return -step;
  return null;
}

function isPrimaryPointer(event: PointerEvent<SVGElement>): boolean {
  return event.button === 0 && event.isPrimary !== false;
}

function getErrorMessage(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.message || 'Solar canvas interaction failed: Error with empty message.';
  }
  throw reason;
}

export function SolarSystemCanvas({
  starAssetId,
  planets,
  selectedPlanetId,
  interactive = true,
  draggingEnabled,
  resizingEnabled,
  label,
  planetLabel,
  resizeLabel,
  onSelectPlanet,
  onPlanetTransform,
}: SolarSystemCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gestureRef = useRef<PointerGesture | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [focusedPlanetId, setFocusedPlanetId] = useState<string | null>(null);
  const [focusedResizePlanetId, setFocusedResizePlanetId] = useState<string | null>(null);
  const starAsset = requireStarAsset(starAssetId);
  const renderPlanets = requireRenderPlanets(planets);

  requireNonEmptyString(label, 'Solar canvas label');
  if (typeof planetLabel !== 'function') {
    throw new Error(`Solar planet label must be a function. Received ${describeReceivedValue(planetLabel)}.`);
  }
  if (typeof resizeLabel !== 'function') {
    throw new Error(`Solar resize label must be a function. Received ${describeReceivedValue(resizeLabel)}.`);
  }
  if (typeof onSelectPlanet !== 'function') {
    throw new Error(`Solar planet selection callback must be a function. Received ${describeReceivedValue(onSelectPlanet)}.`);
  }
  requireBoolean(interactive, 'Solar canvas interactive');
  requireBoolean(draggingEnabled, 'Solar canvas dragging enabled');
  requireBoolean(resizingEnabled, 'Solar canvas resizing enabled');
  if (interactive && (draggingEnabled || resizingEnabled) && typeof onPlanetTransform !== 'function') {
    throw new Error(
      `Solar planet transform callback is required when dragging or resizing is enabled. Received ${describeReceivedValue(onPlanetTransform)}.`,
    );
  }

  function findRenderPlanet(planetId: string): RenderPlanet {
    const renderPlanet = renderPlanets.find((candidate) => candidate.planet.id === planetId);
    if (!renderPlanet) {
      throw new Error(`Solar planet was not found during pointer interaction. Received ${JSON.stringify(planetId)}.`);
    }
    return renderPlanet;
  }

  function releasePointerCapture(pointerId: number): void {
    const svg = svgRef.current;
    if (!svg || typeof svg.releasePointerCapture !== 'function') return;
    if (typeof svg.hasPointerCapture === 'function' && !svg.hasPointerCapture(pointerId)) return;
    svg.releasePointerCapture(pointerId);
  }

  function finishGesture(pointerId: number, cancelled: boolean): void {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== pointerId) return;
    gestureRef.current = null;
    releasePointerCapture(pointerId);

    if (cancelled || gesture.mode === 'resize') return;
    if (!gesture.moved || selectedPlanetId !== gesture.planetId) onSelectPlanet(gesture.planetId);
  }

  function startGesture(
    event: PointerEvent<SVGElement>,
    planetId: string,
    requestedMode: Exclude<PointerGestureMode, 'select'>,
  ): void {
    if (!interactive || !isPrimaryPointer(event) || gestureRef.current) return;
    if (requestedMode === 'resize' && !resizingEnabled) return;

    event.preventDefault();
    event.stopPropagation();
    try {
      const svg = svgRef.current;
      if (!svg) throw new Error(`Solar canvas is unavailable for planet ${JSON.stringify(planetId)}.`);
      const renderPlanet = findRenderPlanet(planetId);
      const start = getCanvasPoint(svg, event.clientX, event.clientY);
      const mode: PointerGestureMode = requestedMode === 'drag' && !draggingEnabled ? 'select' : requestedMode;
      svg.setPointerCapture?.(event.pointerId);
      gestureRef.current = {
        pointerId: event.pointerId,
        planetId,
        mode,
        start,
        initialTransform: getPlanetTransform(renderPlanet.planet),
        moved: false,
      };
      setInteractionError(null);
    } catch (reason) {
      gestureRef.current = null;
      setInteractionError(getErrorMessage(reason));
    }
  }

  function moveGesture(event: PointerEvent<SVGSVGElement>): void {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || gesture.mode === 'select') return;
    event.preventDefault();
    try {
      const point = getCanvasPoint(event.currentTarget, event.clientX, event.clientY);
      const transform = gesture.mode === 'drag'
        ? getDraggedTransform(gesture.initialTransform, gesture.start, point)
        : getResizedTransform(gesture.initialTransform, gesture.start, point);
      if (Math.hypot(point.x - gesture.start.x, point.y - gesture.start.y) > POINTER_MOVE_THRESHOLD) {
        gesture.moved = true;
      }
      onPlanetTransform?.(gesture.planetId, transform);
      setInteractionError(null);
    } catch (reason) {
      gestureRef.current = null;
      releasePointerCapture(event.pointerId);
      setInteractionError(getErrorMessage(reason));
    }
  }

  function handlePlanetKeyDown(event: KeyboardEvent<SVGGElement>, planet: SolarPlanet): void {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectPlanet(planet.id);
      return;
    }
    if (planet.id !== selectedPlanetId || !draggingEnabled || !onPlanetTransform) return;
    const delta = getArrowDelta(event);
    if (!delta) return;
    event.preventDefault();
    const currentTransform = getPlanetTransform(planet);
    onPlanetTransform(planet.id, getDraggedTransform(
      currentTransform,
      { x: currentTransform.x, y: currentTransform.y },
      { x: currentTransform.x + delta.x, y: currentTransform.y + delta.y },
    ));
  }

  function handleResizeKeyDown(event: KeyboardEvent<SVGGElement>, planet: SolarPlanet): void {
    if (!interactive || !resizingEnabled || !onPlanetTransform) return;
    const delta = getResizeDelta(event);
    if (delta === null) return;
    event.preventDefault();
    event.stopPropagation();
    const currentTransform = getPlanetTransform(planet);
    onPlanetTransform(planet.id, getResizedTransform(
      currentTransform,
      { x: currentTransform.x, y: currentTransform.y },
      { x: currentTransform.x + delta, y: currentTransform.y + delta },
    ));
  }

  return (
    <div className="min-w-0 space-y-2">
      <svg
        ref={svgRef}
        data-solar-canvas="true"
        data-solar-star-asset-id={starAsset?.id}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${SOLAR_CANVAS_WIDTH} ${SOLAR_CANVAS_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label={label}
        className="block h-auto w-full touch-none select-none bg-[#05070d] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
        onPointerMove={moveGesture}
        onPointerUp={(event) => finishGesture(event.pointerId, false)}
        onPointerCancel={(event) => finishGesture(event.pointerId, true)}
        onLostPointerCapture={(event) => finishGesture(event.pointerId, true)}
      >
        <rect x="0" y="0" width={SOLAR_CANVAS_WIDTH} height={SOLAR_CANVAS_HEIGHT} fill="#05070d" aria-hidden="true" />
        {starAsset ? (
          <image
            data-solar-star="true"
            data-asset-id={starAsset.id}
            href={starAsset.src}
            x="0"
            y="0"
            width={SOLAR_STAR_WIDTH}
            height={SOLAR_STAR_HEIGHT}
            preserveAspectRatio="none"
            aria-hidden="true"
          />
        ) : null}
        {renderPlanets.map(({ planet, asset }, index) => {
          const selected = interactive && planet.id === selectedPlanetId;
          const resizeHitArea = getResizeHitArea(planet);
          const accessiblePlanetLabel = planetLabel(index);
          if (typeof accessiblePlanetLabel !== 'string' || accessiblePlanetLabel.length === 0) {
            throw new Error(`Solar planet label ${index + 1} must be a non-empty string. Received ${describeReceivedValue(accessiblePlanetLabel)}.`);
          }
          const accessibleResizeLabel = resizeLabel(index);
          if (typeof accessibleResizeLabel !== 'string' || accessibleResizeLabel.length === 0) {
            throw new Error(`Solar resize label ${index + 1} must be a non-empty string. Received ${describeReceivedValue(accessibleResizeLabel)}.`);
          }

          return (
            <g key={planet.id}>
              <g
                data-solar-planet-id={planet.id}
                data-asset-id={asset.id}
                role={interactive ? 'button' : undefined}
                aria-label={interactive ? accessiblePlanetLabel : undefined}
                aria-pressed={interactive ? selected : undefined}
                tabIndex={interactive ? 0 : -1}
                className={interactive ? 'cursor-move outline-none' : 'outline-none'}
                onPointerDown={(event) => startGesture(event, planet.id, 'drag')}
                onKeyDown={(event) => handlePlanetKeyDown(event, planet)}
                onFocus={() => setFocusedPlanetId(planet.id)}
                onBlur={() => setFocusedPlanetId(null)}
              >
                <image
                  data-asset-id={asset.id}
                  href={asset.src}
                  x={planet.x}
                  y={planet.y}
                  width={planet.width}
                  height={planet.height}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                />
                {selected ? (
                  <rect
                    x={planet.x}
                    y={planet.y}
                    width={planet.width}
                    height={planet.height}
                    fill="none"
                    stroke="var(--site-accent-strong)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                ) : null}
                {focusedPlanetId === planet.id ? (
                  <rect
                    data-solar-focus-ring="planet"
                    x={planet.x}
                    y={planet.y}
                    width={planet.width}
                    height={planet.height}
                    fill="none"
                    stroke="var(--site-accent-strong)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                    aria-hidden="true"
                  />
                ) : null}
              </g>
              {selected && resizingEnabled && resizeHitArea.width > 0 && resizeHitArea.height > 0 ? (
                <g
                  data-solar-resize-handle={planet.id}
                  role={interactive ? 'button' : undefined}
                  aria-label={accessibleResizeLabel}
                  tabIndex={interactive ? 0 : -1}
                  className="cursor-nwse-resize touch-none select-none outline-none"
                  onPointerDown={(event) => startGesture(event, planet.id, 'resize')}
                  onKeyDown={(event) => handleResizeKeyDown(event, planet)}
                  onFocus={() => setFocusedResizePlanetId(planet.id)}
                  onBlur={() => setFocusedResizePlanetId(null)}
                >
                  <rect
                    data-solar-resize-hit="true"
                    x={resizeHitArea.x}
                    y={resizeHitArea.y}
                    width={resizeHitArea.width}
                    height={resizeHitArea.height}
                    fill="transparent"
                    pointerEvents="all"
                  />
                  <rect
                    x={resizeHitArea.anchorX - RESIZE_MARKER_SIZE / 2}
                    y={resizeHitArea.anchorY - RESIZE_MARKER_SIZE / 2}
                    width={RESIZE_MARKER_SIZE}
                    height={RESIZE_MARKER_SIZE}
                    rx="2"
                    fill="var(--site-accent-strong)"
                    stroke="#05070d"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                  {focusedResizePlanetId === planet.id ? (
                    <rect
                      data-solar-focus-ring="resize"
                      x={resizeHitArea.anchorX - RESIZE_MARKER_SIZE / 2 - 2}
                      y={resizeHitArea.anchorY - RESIZE_MARKER_SIZE / 2 - 2}
                      width={RESIZE_MARKER_SIZE + 4}
                      height={RESIZE_MARKER_SIZE + 4}
                      fill="none"
                      stroke="var(--site-accent-strong)"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      pointerEvents="none"
                      aria-hidden="true"
                    />
                  ) : null}
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      {interactionError ? (
        <p role="alert" className="break-words rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
          {interactionError}
        </p>
      ) : null}
    </div>
  );
}
