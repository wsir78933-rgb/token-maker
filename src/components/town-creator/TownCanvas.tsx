'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import type { SiteLocale } from '@/lib/site-locale';
import { getTownAsset } from '@/lib/town-creator/catalog';
import {
  resizeTownObject,
  snapTownPoint,
  type TownResizeHandle,
} from '@/lib/town-creator/geometry';
import {
  buildTownSvg,
} from '@/lib/town-creator/render';
import type {
  TownDocument,
  TownLayerId,
  TownObject,
  TownObjectPatch,
  TownResizeMode,
} from '@/lib/town-creator/types';

import styles from './TownCanvas.module.css';

const MIN_OBJECT_SIZE = 8;
const SNAP_SIZE = 5;
const HANDLE_POSITIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
type HandlePosition = TownResizeHandle;
const HANDLE_POSITIONS_BY_MODE: Readonly<Record<TownResizeMode, readonly HandlePosition[]>> = {
  regular: ['nw', 'ne', 'se', 'sw'],
  connector: ['nw', 'ne', 'se', 'sw'],
  line: ['e', 'w'],
  tile: HANDLE_POSITIONS,
};

export type TownCanvasProps = {
  readonly document: TownDocument;
  readonly selectedObjectId: string | null;
  readonly snapEnabled: boolean;
  readonly resizeEnabled: boolean;
  readonly locale: SiteLocale;
  readonly onSelectObject: (id: string | null) => void;
  readonly onSelectObjectInLayer: (objectId: string, layerId: TownLayerId) => void;
  readonly onUpdateObject: (id: string, patch: TownObjectPatch) => void;
};

type DragInteraction = {
  kind: 'drag';
  pointerId: number;
  object: TownObject;
  layerId: TownLayerId;
  startPoint: Point;
};

type ResizeInteraction = {
  kind: 'resize';
  pointerId: number;
  object: TownObject;
  handle: HandlePosition;
  mode: TownResizeMode;
  startLocalPoint: Point;
};

type Interaction = DragInteraction | ResizeInteraction;

type Point = { x: number; y: number };

const COPY = {
  en: {
    canvas: 'Town map canvas',
    selection: 'Selected town object',
    resize: 'Resize selected object',
    handle: 'Resize handle; use arrow keys to adjust',
  },
  zh: {
    canvas: '城镇地图画布',
    selection: '已选择城镇对象',
    resize: '调整已选对象尺寸',
    handle: '调整尺寸控制点；可使用方向键',
  },
} as const;

function findLayer(document: TownDocument, layerId: TownLayerId) {
  return document.layers.find((layer) => layer.id === layerId) ?? null;
}

function findObjectElement(stage: HTMLDivElement, objectId: string): SVGGElement | null {
  const elements = stage.querySelectorAll<SVGGElement>('[data-town-object-id]');
  for (const element of elements) {
    if (element.getAttribute('data-town-object-id') === objectId) {
      return element;
    }
  }

  return null;
}

function bringObjectToFront(stage: HTMLDivElement, objectId: string): void {
  const element = findObjectElement(stage, objectId);
  const layer = element?.parentElement;
  if (element && layer?.getAttribute('data-town-layer-id')) {
    layer.appendChild(element);
  }
}

function rotatePoint(point: Point, center: Point, degrees: number): Point {
  const radians = degrees * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const x = point.x - center.x;
  const y = point.y - center.y;
  return {
    x: center.x + x * cos - y * sin,
    y: center.y + x * sin + y * cos,
  };
}

function getObjectLocalPoint(point: Point, object: TownObject): Point {
  return rotatePoint(point, getObjectCenter(object), -object.rotationDegrees);
}

function getObjectCenter(object: TownObject): Point {
  return {
    x: object.x + object.width / 2,
    y: object.y + object.height / 2,
  };
}

function getOppositeAnchorLocal(object: TownObject, handle: HandlePosition): Point {
  return {
    x: handle.includes('w')
      ? object.x + object.width
      : handle.includes('e')
        ? object.x
        : object.x + object.width / 2,
    y: handle.includes('n')
      ? object.y + object.height
      : handle.includes('s')
        ? object.y
        : object.y + object.height / 2,
  };
}

function getObjectWorldPoint(point: Point, object: TownObject): Point {
  return rotatePoint(point, getObjectCenter(object), object.rotationDegrees);
}

function snapResizeDimension(value: number): number {
  return Math.max(MIN_OBJECT_SIZE, Math.round(value / SNAP_SIZE) * SNAP_SIZE);
}

function resizeTownObjectForDelta(
  object: TownObject,
  handle: HandlePosition,
  mode: TownResizeMode,
  delta: Point,
  snapEnabled: boolean,
): TownObjectPatch {
  const townAsset = getTownAsset(object.assetId);
  const resizedObject = resizeTownObject(
    object,
    mode,
    { width: townAsset.width, height: townAsset.height },
    { dx: delta.x, dy: delta.y },
    handle,
  );

  let nextObject = resizedObject;
  if (snapEnabled) {
    const oppositeAnchor = getOppositeAnchorLocal(object, handle);
    if (mode === 'line') {
      const width = snapResizeDimension(resizedObject.width);
      nextObject = {
        ...resizedObject,
        x: handle.includes('w') ? oppositeAnchor.x - width : oppositeAnchor.x,
        width,
        height: townAsset.height,
      };
    } else if (mode === 'regular' || mode === 'connector') {
      const width = snapResizeDimension(resizedObject.width);
      const height = Math.max(MIN_OBJECT_SIZE, width * townAsset.height / townAsset.width);
      nextObject = {
        ...resizedObject,
        x: handle.includes('w')
          ? oppositeAnchor.x - width
          : handle.includes('e')
            ? oppositeAnchor.x
            : oppositeAnchor.x - width / 2,
        y: handle.includes('n')
          ? oppositeAnchor.y - height
          : handle.includes('s')
            ? oppositeAnchor.y
            : oppositeAnchor.y - height / 2,
        width,
        height,
      };
    } else {
      const width = handle.includes('w') || handle.includes('e')
        ? snapResizeDimension(resizedObject.width)
        : resizedObject.width;
      const height = handle.includes('n') || handle.includes('s')
        ? snapResizeDimension(resizedObject.height)
        : resizedObject.height;
      nextObject = {
        ...resizedObject,
        x: handle.includes('w') ? oppositeAnchor.x - width : handle.includes('e') ? oppositeAnchor.x : resizedObject.x,
        y: handle.includes('n') ? oppositeAnchor.y - height : handle.includes('s') ? oppositeAnchor.y : resizedObject.y,
        width,
        height,
      };
    }
  }

  const originalAnchorWorld = getObjectWorldPoint(getOppositeAnchorLocal(object, handle), object);
  const nextAnchorWorld = getObjectWorldPoint(getOppositeAnchorLocal(nextObject, handle), nextObject);
  return {
    x: nextObject.x + originalAnchorWorld.x - nextAnchorWorld.x,
    y: nextObject.y + originalAnchorWorld.y - nextAnchorWorld.y,
    width: nextObject.width,
    height: nextObject.height,
  };
}

function getResizePatch(
  object: TownObject,
  handle: HandlePosition,
  point: Point,
  startLocalPoint: Point,
  mode: TownResizeMode,
  snapEnabled: boolean,
): TownObjectPatch {
  const localPoint = getObjectLocalPoint(point, object);
  return resizeTownObjectForDelta(
    object,
    handle,
    mode,
    { x: localPoint.x - startLocalPoint.x, y: localPoint.y - startLocalPoint.y },
    snapEnabled,
  );
}

function getPointerPoint(event: ReactPointerEvent<HTMLDivElement>, stage: HTMLDivElement, document: TownDocument): Point {
  const bounds = stage.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) {
    throw new Error(`Town canvas has invalid display bounds: ${bounds.width}x${bounds.height}.`);
  }

  return {
    x: (event.clientX - bounds.left) * document.width / bounds.width,
    y: (event.clientY - bounds.top) * document.height / bounds.height,
  };
}

function getEventElement(event: ReactPointerEvent<HTMLDivElement>): Element | null {
  return event.target instanceof Element ? event.target : null;
}

function getHandlePosition(element: Element | null): HandlePosition | null {
  const value = element?.closest('[data-town-handle]')?.getAttribute('data-town-handle');
  return HANDLE_POSITIONS.includes(value as HandlePosition) ? value as HandlePosition : null;
}

function getObjectId(element: Element | null): string | null {
  return element?.closest('[data-town-object-id]')?.getAttribute('data-town-object-id') ?? null;
}

function getObjectLayerId(element: Element | null): TownLayerId | null {
  const value = element?.closest('[data-town-object-id]')?.getAttribute('data-town-layer-id');
  return value === 'lower' || value === 'middle' || value === 'upper' ? value : null;
}

function readTownObjectLayerId(element: Element, objectId: string): TownLayerId {
  const rawLayerId = element.closest('[data-town-object-id]')?.getAttribute('data-town-layer-id') ?? null;
  if (rawLayerId === 'lower' || rawLayerId === 'middle' || rawLayerId === 'upper') {
    return rawLayerId;
  }

  throw new Error(`Town object ${JSON.stringify(objectId)} has unknown layer ${JSON.stringify(rawLayerId)}.`);
}

function findVisibleLayerObject(
  document: TownDocument,
  objectId: string,
  layerId: TownLayerId,
): TownObject | null {
  const layer = findLayer(document, layerId);
  if (!layer) {
    throw new Error(`Town object ${JSON.stringify(objectId)} points at missing layer ${JSON.stringify(layerId)}.`);
  }
  if (!layer.visible) {
    return null;
  }

  const object = layer.objects.find((candidate) => candidate.id === objectId);
  if (!object) {
    throw new Error(
      `Town object ${JSON.stringify(objectId)} was rendered but is missing from visible layer ${JSON.stringify(layerId)}.`,
    );
  }

  return object;
}

function focusTownCanvasStage(stage: HTMLDivElement): void {
  stage.focus();
}

function getHandlePositions(mode: TownResizeMode): readonly HandlePosition[] {
  return HANDLE_POSITIONS_BY_MODE[mode];
}

const TOWN_HANDLE_HIT_SCREEN_PX = 44;
const TOWN_HANDLE_DOT_SCREEN_PX = 8;
const TOWN_SELECTION_BORDER_PX = 2;
const TOWN_TILE_HANDLE_MIN_RADIUS_SCREEN_PX = 10;
const TOWN_CORNER_HANDLE_MIN_RADIUS_SCREEN_PX = 5;

function readTownHandleDisplayScale(displayScale: number): number {
  if (!Number.isFinite(displayScale) || displayScale <= 0) {
    throw new Error(`Town handle layout has invalid display scale ${displayScale}.`);
  }

  return displayScale;
}

function readTownHandleObjectSize(
  objectWidth: number,
  objectHeight: number,
): { width: number; height: number } {
  if (!Number.isFinite(objectWidth) || objectWidth <= 0 || !Number.isFinite(objectHeight) || objectHeight <= 0) {
    throw new Error(`Town handle layout has invalid object size ${objectWidth}x${objectHeight}.`);
  }

  return { width: objectWidth, height: objectHeight };
}

function minimumTownHandleRadiusScreenPx(mode: TownResizeMode): number {
  switch (mode) {
    case 'tile':
      return TOWN_TILE_HANDLE_MIN_RADIUS_SCREEN_PX;
    case 'regular':
    case 'connector':
    case 'line':
      return TOWN_CORNER_HANDLE_MIN_RADIUS_SCREEN_PX;
    default: {
      const unknownMode: never = mode;
      throw new Error(`Town handle layout has unknown resize mode ${JSON.stringify(unknownMode)}.`);
    }
  }
}

function townHandleAxisSigns(handle: HandlePosition): { x: -1 | 0 | 1; y: -1 | 0 | 1 } {
  return {
    x: handle.includes('e') ? 1 : handle.includes('w') ? -1 : 0,
    y: handle.includes('s') ? 1 : handle.includes('n') ? -1 : 0,
  };
}

function getTownHandleOutsetLocalPx(
  objectWidth: number,
  objectHeight: number,
  displayScale: number,
  mode: TownResizeMode,
): { x: number; y: number } {
  const scale = readTownHandleDisplayScale(displayScale);
  const objectSize = readTownHandleObjectSize(objectWidth, objectHeight);
  const minimumRadius = minimumTownHandleRadiusScreenPx(mode);
  const horizontalShortfall = Math.max(0, minimumRadius - objectSize.width * scale / 2);
  const verticalShortfall = mode === 'line'
    ? 0
    : Math.max(0, minimumRadius - objectSize.height * scale / 2);

  return {
    x: horizontalShortfall / scale,
    y: verticalShortfall / scale,
  };
}

function getTownHandleAnchorLocalPx(
  objectWidth: number,
  objectHeight: number,
  displayScale: number,
  mode: TownResizeMode,
  handle: HandlePosition,
): Point {
  const objectSize = readTownHandleObjectSize(objectWidth, objectHeight);
  const outset = getTownHandleOutsetLocalPx(objectSize.width, objectSize.height, displayScale, mode);
  const signs = townHandleAxisSigns(handle);
  return {
    x: objectSize.width / 2 + signs.x * (objectSize.width / 2 + outset.x),
    y: objectSize.height / 2 + signs.y * (objectSize.height / 2 + outset.y),
  };
}

function getTownHandleDocumentPoint(object: TownObject, anchor: Point): Point {
  return getObjectWorldPoint(
    {
      x: object.x + TOWN_SELECTION_BORDER_PX + anchor.x,
      y: object.y + TOWN_SELECTION_BORDER_PX + anchor.y,
    },
    object,
  );
}

type TownHandleHit = {
  readonly handle: HandlePosition;
  readonly documentPoint: Point;
};

type TownSelectionPointerAction =
  | { readonly kind: 'resize'; readonly handle: HandlePosition }
  | { readonly kind: 'drag-body' }
  | { readonly kind: 'passthrough' };

function listTownHandleHits(
  object: TownObject,
  mode: TownResizeMode,
  displayScale: number,
): TownHandleHit[] {
  return getHandlePositions(mode).map((handle) => ({
    handle,
    documentPoint: getTownHandleDocumentPoint(
      object,
      getTownHandleAnchorLocalPx(object.width, object.height, displayScale, mode, handle),
    ),
  }));
}

function readTownScreenDistance(from: Point, to: Point, displayScale: number): number {
  const distance = Math.hypot(from.x - to.x, from.y - to.y) * displayScale;
  if (!Number.isFinite(distance)) {
    throw new Error(
      `Town pointer distance is not finite (${distance}) from ${from.x},${from.y} to ${to.x},${to.y} at scale ${displayScale}.`,
    );
  }

  return distance;
}

function readTownHandleDotScreenOffset(
  pointer: Point,
  handleDocument: Point,
  object: TownObject,
  displayScale: number,
): { x: number; y: number } {
  const pointerLocal = getObjectLocalPoint(pointer, object);
  const handleLocal = getObjectLocalPoint(handleDocument, object);
  const x = (pointerLocal.x - handleLocal.x) * displayScale;
  const y = (pointerLocal.y - handleLocal.y) * displayScale;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error(
      `Town handle dot offset is not finite (${x},${y}) for pointer ${pointer.x},${pointer.y}.`,
    );
  }

  return { x, y };
}

function isPointerOnTownHandleDot(
  pointer: Point,
  handleDocument: Point,
  object: TownObject,
  displayScale: number,
): boolean {
  const offset = readTownHandleDotScreenOffset(pointer, handleDocument, object, displayScale);
  return Math.max(Math.abs(offset.x), Math.abs(offset.y)) <= TOWN_HANDLE_DOT_SCREEN_PX / 2;
}

function isPointInsideTownObject(point: Point, object: TownObject): boolean {
  const local = getObjectLocalPoint(point, object);
  return local.x >= object.x
    && local.x <= object.x + object.width
    && local.y >= object.y
    && local.y <= object.y + object.height;
}

function nearestTownHandleHit(
  pointer: Point,
  hits: readonly TownHandleHit[],
  displayScale: number,
): TownHandleHit {
  const first = hits[0];
  if (first === undefined) {
    throw new Error('Town handle routing was asked to choose from an empty handle list.');
  }

  let nearest = first;
  let nearestDistance = readTownScreenDistance(pointer, first.documentPoint, displayScale);
  for (const hit of hits.slice(1)) {
    const distance = readTownScreenDistance(pointer, hit.documentPoint, displayScale);
    if (distance < nearestDistance) {
      nearest = hit;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function isClearTownCenterDrag(
  pointer: Point,
  object: TownObject,
  hits: readonly TownHandleHit[],
  displayScale: number,
): boolean {
  if (!isPointInsideTownObject(pointer, object)) {
    return false;
  }

  const centerDistance = readTownScreenDistance(pointer, getObjectCenter(object), displayScale);
  return hits.every((hit) => centerDistance < readTownScreenDistance(pointer, hit.documentPoint, displayScale));
}

// Overlapping 44px circles use the nearest handle center. The 8px dot wins over the
// center. A point closer to the object center than to every handle stays a body drag,
// including when those circles cover a small object. Elsewhere a 44px circle still resizes.
function resolveTownSelectionPointer(
  pointer: Point,
  object: TownObject,
  mode: TownResizeMode,
  displayScale: number,
): TownSelectionPointerAction {
  const scale = readTownHandleDisplayScale(displayScale);
  const hits = listTownHandleHits(object, mode, scale);
  if (hits.length === 0) {
    throw new Error(`Town resize mode ${JSON.stringify(mode)} has no handles.`);
  }

  const dotHits = hits.filter((hit) => isPointerOnTownHandleDot(pointer, hit.documentPoint, object, scale));
  if (dotHits.length > 0) {
    return { kind: 'resize', handle: nearestTownHandleHit(pointer, dotHits, scale).handle };
  }

  if (isClearTownCenterDrag(pointer, object, hits, scale)) {
    return { kind: 'drag-body' };
  }

  const circleHits = hits.filter((hit) => (
    readTownScreenDistance(pointer, hit.documentPoint, scale) <= TOWN_HANDLE_HIT_SCREEN_PX / 2
  ));
  if (circleHits.length > 0) {
    return { kind: 'resize', handle: nearestTownHandleHit(pointer, circleHits, scale).handle };
  }

  return { kind: 'passthrough' };
}

function readTownResizeModeAttribute(element: Element | null): TownResizeMode {
  const modeValue = element?.getAttribute('data-town-resize-mode');
  if (modeValue === 'line' || modeValue === 'tile' || modeValue === 'connector' || modeValue === 'regular') {
    return modeValue;
  }

  return 'regular';
}

function findTopmostVisibleObjectAtPoint(
  stage: HTMLDivElement,
  townDocument: TownDocument,
  point: Point,
): { object: TownObject; layerId: TownLayerId } | null {
  const elements = stage.querySelectorAll<Element>('[data-town-object-id]');
  for (let index = elements.length - 1; index >= 0; index -= 1) {
    const element = elements[index];
    if (!(element instanceof Element)) {
      throw new Error(`Town hit element at index ${index} is missing.`);
    }
    if (element.getAttribute('data-town-selection') === 'true') {
      continue;
    }

    const objectId = element.getAttribute('data-town-object-id');
    if (objectId === null || objectId.length === 0) {
      throw new Error(`Town hit element at index ${index} has an empty object id.`);
    }

    const layerId = readTownObjectLayerId(element, objectId);
    const object = findVisibleLayerObject(townDocument, objectId, layerId);
    if (!object || !isPointInsideTownObject(point, object)) {
      continue;
    }

    return { object, layerId };
  }

  return null;
}

function beginTownObjectDrag(
  stage: HTMLDivElement,
  event: ReactPointerEvent<HTMLDivElement>,
  interactionRef: { current: Interaction | null },
  object: TownObject,
  layerId: TownLayerId,
  startPoint: Point,
  onSelectObjectInLayer: TownCanvasProps['onSelectObjectInLayer'],
): void {
  interactionRef.current = {
    kind: 'drag',
    pointerId: event.pointerId,
    object,
    layerId,
    startPoint,
  };
  onSelectObjectInLayer(object.id, layerId);
  focusTownCanvasStage(stage);
  bringObjectToFront(stage, object.id);
  stage.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function beginTownObjectResize(
  stage: HTMLDivElement,
  event: ReactPointerEvent<HTMLDivElement>,
  interactionRef: { current: Interaction | null },
  object: TownObject,
  handle: HandlePosition,
  mode: TownResizeMode,
  startPoint: Point,
): void {
  interactionRef.current = {
    kind: 'resize',
    pointerId: event.pointerId,
    object,
    handle,
    mode,
    startLocalPoint: getObjectLocalPoint(startPoint, object),
  };
  stage.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function formatTownHandlePx(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(`Town handle anchor must be a finite pixel value, received ${value}.`);
  }

  return `${value}px`;
}

function SelectionOverlay({
  object,
  layerId,
  resizeMode,
  resizeEnabled,
  displayScale,
  locale,
  onKeyboardResize,
}: {
  readonly object: TownObject;
  readonly layerId: TownLayerId;
  readonly resizeMode: TownResizeMode;
  readonly resizeEnabled: boolean;
  readonly displayScale: number;
  readonly locale: SiteLocale;
  readonly onKeyboardResize: (
    handle: HandlePosition,
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => void;
}) {
  const copy = COPY[locale];
  return (
    <div
      className={`${styles.selection} ${resizeEnabled ? styles.selectionEnabled : styles.selectionDisabled}`}
      style={{
        left: object.x,
        top: object.y,
        width: object.width,
        height: object.height,
        transform: `rotate(${object.rotationDegrees}deg)`,
      }}
      data-town-selection="true"
      data-town-object-id={object.id}
      data-town-layer-id={layerId}
      aria-label={copy.selection}
    >
      {resizeEnabled
        ? getHandlePositions(resizeMode).map((position) => {
          const anchor = getTownHandleAnchorLocalPx(
            object.width,
            object.height,
            displayScale,
            resizeMode,
            position,
          );
          return (
            <button
              className={`${styles.handle} ${styles[`handle-${position}`]}`}
              key={position}
              type="button"
              style={{ left: formatTownHandlePx(anchor.x), top: formatTownHandlePx(anchor.y) }}
              data-town-handle={position}
              aria-label={`${copy.handle}: ${position}`}
              aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown"
              tabIndex={0}
              onKeyDown={(event) => onKeyboardResize(position, event)}
            />
          );
        })
        : null}
    </div>
  );
}

export function TownCanvas({
  document,
  selectedObjectId,
  snapEnabled,
  resizeEnabled,
  locale,
  onSelectObject,
  onSelectObjectInLayer,
  onUpdateObject,
}: TownCanvasProps) {
  const canvasRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<Interaction | null>(null);
  const [displayScale, setDisplayScale] = useState(1);
  const sceneMarkup = useMemo(() => buildTownSvg(document), [document]);
  const selectedObject = useMemo(
    () => {
      const layer = findLayer(document, document.activeLayer);
      if (!layer?.visible) {
        return null;
      }
      return layer.objects.find((object) => object.id === selectedObjectId) ?? null;
    },
    [document, selectedObjectId],
  );
  const selectedResizeMode = selectedObject === null
    ? null
    : getTownAsset(selectedObject.assetId).resizeMode;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    const slot = canvas.parentElement;
    if (!slot) {
      throw new Error('Town map canvas is missing its layout slot.');
    }

    const updateScale = () => {
      if (!Number.isFinite(document.width) || document.width <= 0 || !Number.isFinite(document.height) || document.height <= 0) {
        throw new Error(`Town map canvas document size must be positive, received ${document.width}×${document.height}.`);
      }
      if (!Number.isFinite(slot.clientWidth) || !Number.isFinite(slot.clientHeight)) {
        throw new Error(`Town map canvas slot size is not finite (${slot.clientWidth}×${slot.clientHeight}).`);
      }
      const contentWidth = slot.clientWidth - 32;
      const contentHeight = slot.clientHeight - 32;
      if (contentWidth <= 0 || contentHeight <= 0) {
        return;
      }
      const nextScale = Math.min(1, contentWidth / document.width, contentHeight / document.height);
      if (!Number.isFinite(nextScale) || nextScale <= 0) {
        throw new Error(
          `Town map canvas display scale ${nextScale} is invalid for document ${document.width}×${document.height} in slot ${slot.clientWidth}×${slot.clientHeight}.`,
        );
      }
      setDisplayScale(nextScale);
    };

    updateScale();
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(slot);
    return () => observer.disconnect();
  }, [document.width, document.height]);

  useEffect(() => {
    const interaction = interactionRef.current;
    if (!interaction || !selectedObjectId || interaction.object.id !== selectedObjectId) {
      return;
    }

    const layer = findLayer(
      document,
      interaction.kind === 'drag' ? interaction.layerId : document.activeLayer,
    );
    if (!layer?.visible || !layer.objects.some((object) => object.id === selectedObjectId)) {
      interactionRef.current = null;
    }
  }, [document, selectedObjectId]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType !== 'touch') {
      return;
    }
    const stage = stageRef.current;
    if (!stage) {
      throw new Error('Town canvas stage is unavailable during pointer down.');
    }

    const element = getEventElement(event);
    const pointerDocument = getPointerPoint(event, stage, document);
    if (resizeEnabled && selectedObject && selectedResizeMode) {
      const activeLayer = findLayer(document, document.activeLayer);
      const selectedIsVisible = Boolean(
        activeLayer?.visible && activeLayer.objects.some((object) => object.id === selectedObject.id),
      );
      if (selectedIsVisible) {
        const action = resolveTownSelectionPointer(
          pointerDocument,
          selectedObject,
          selectedResizeMode,
          displayScale,
        );
        if (action.kind === 'resize') {
          beginTownObjectResize(
            stage,
            event,
            interactionRef,
            selectedObject,
            action.handle,
            selectedResizeMode,
            pointerDocument,
          );
          return;
        }
        if (action.kind === 'drag-body') {
          const hit = findTopmostVisibleObjectAtPoint(stage, document, pointerDocument);
          if (!hit) {
            throw new Error(
              `Town object ${JSON.stringify(selectedObject.id)} center drag at ${pointerDocument.x},${pointerDocument.y} did not hit a visible object.`,
            );
          }
          beginTownObjectDrag(
            stage,
            event,
            interactionRef,
            hit.object,
            hit.layerId,
            pointerDocument,
            onSelectObjectInLayer,
          );
          return;
        }
      }
    }

    const handle = getHandlePosition(element);
    const objectId = getObjectId(element);
    const layerId = getObjectLayerId(element);
    if (handle && resizeEnabled && selectedObject && objectId === selectedObject.id && layerId === document.activeLayer) {
      const selectedElement = findObjectElement(stage, selectedObject.id);
      beginTownObjectResize(
        stage,
        event,
        interactionRef,
        selectedObject,
        handle,
        readTownResizeModeAttribute(selectedElement),
        pointerDocument,
      );
      return;
    }

    if (!objectId) {
      if (!handle) {
        onSelectObject(null);
        focusTownCanvasStage(stage);
      }
      return;
    }

    if (!element) {
      throw new Error(`Town object ${JSON.stringify(objectId)} has no pointer target element.`);
    }

    const hitLayerId = readTownObjectLayerId(element, objectId);
    const object = findVisibleLayerObject(document, objectId, hitLayerId);
    if (!object) {
      return;
    }

    beginTownObjectDrag(
      stage,
      event,
      interactionRef,
      object,
      hitLayerId,
      pointerDocument,
      onSelectObjectInLayer,
    );
  }, [displayScale, document, onSelectObject, onSelectObjectInLayer, resizeEnabled, selectedObject, selectedResizeMode]);

  const handleKeyboardResize = useCallback((
    handle: HandlePosition,
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!resizeEnabled || selectedObject === null || selectedResizeMode === null) {
      return;
    }

    const step = snapEnabled ? SNAP_SIZE : 1;
    const delta = {
      x: event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0,
      y: event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0,
    };
    if (delta.x === 0 && delta.y === 0) {
      return;
    }
    if ((delta.x !== 0 && !handle.includes('w') && !handle.includes('e'))
      || (delta.y !== 0 && !handle.includes('n') && !handle.includes('s'))) {
      return;
    }

    event.preventDefault();
    onUpdateObject(
      selectedObject.id,
      resizeTownObjectForDelta(selectedObject, handle, selectedResizeMode, delta, snapEnabled),
    );
  }, [onUpdateObject, resizeEnabled, selectedObject, selectedResizeMode, snapEnabled]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    const stage = stageRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId || !stage) {
      return;
    }

    const point = getPointerPoint(event, stage, document);
    if (interaction.kind === 'drag') {
      const nextPoint = snapTownPoint(
        {
          x: interaction.object.x + point.x - interaction.startPoint.x,
          y: interaction.object.y + point.y - interaction.startPoint.y,
        },
        snapEnabled,
      );
      const nextX = nextPoint.x;
      const nextY = nextPoint.y;
      if (nextX !== interaction.object.x || nextY !== interaction.object.y) {
        onUpdateObject(interaction.object.id, { x: nextX, y: nextY });
      }
      return;
    }

    onUpdateObject(
      interaction.object.id,
      getResizePatch(
        interaction.object,
        interaction.handle,
        point,
        interaction.startLocalPoint,
        interaction.mode,
        snapEnabled,
      ),
    );
  }, [document, onUpdateObject, snapEnabled]);

  const finishPointerInteraction = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (interactionRef.current?.pointerId === event.pointerId) {
      stageRef.current?.releasePointerCapture?.(event.pointerId);
      interactionRef.current = null;
    }
  }, []);

  if (!Number.isFinite(document.width) || document.width <= 0 || !Number.isFinite(document.height) || document.height <= 0) {
    throw new Error(`Town map canvas document size must be positive, received ${document.width}×${document.height}.`);
  }
  if (!Number.isFinite(displayScale) || displayScale <= 0 || displayScale > 1) {
    throw new Error(`Town map canvas display scale must be within (0, 1], received ${displayScale}.`);
  }

  const canvasCopy = COPY[locale];
  const frameWidth = document.width * displayScale + 32;
  const frameHeight = document.height * displayScale + 32;
  return (
    <section
      className={styles.canvas}
      ref={canvasRef}
      style={{ width: frameWidth, height: frameHeight }}
      aria-label={canvasCopy.canvas}
    >
      <div className={styles.viewport}>
        <div className={styles.stageFrame}>
          <div
            className={styles.stage}
            ref={stageRef}
            style={{
              width: document.width,
              height: document.height,
              transform: `scale(${displayScale})`,
              '--town-display-scale': displayScale,
              '--town-display-inverse-scale': displayScale > 0 ? 1 / displayScale : 1,
            } as CSSProperties}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerInteraction}
            onPointerCancel={finishPointerInteraction}
            onLostPointerCapture={finishPointerInteraction}
            role="application"
            tabIndex={0}
          >
            <div
              className={styles.scene}
              dangerouslySetInnerHTML={{ __html: sceneMarkup }}
              aria-hidden="true"
            />
            {selectedObject ? (
              <SelectionOverlay
                object={selectedObject}
                layerId={document.activeLayer}
                resizeMode={selectedResizeMode ?? 'regular'}
                resizeEnabled={resizeEnabled}
                displayScale={displayScale}
                locale={locale}
                onKeyboardResize={handleKeyboardResize}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
