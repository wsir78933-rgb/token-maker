'use client';

import Image from 'next/image';
import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

import { getMapMakerAsset, getMapMakerAssetSrc, MAP_MAKER_TILE_SIZE } from '@/lib/map-maker';
import type { MapMakerElement, MapMakerGridCell, MapMakerLabel, MapMakerProject } from '@/lib/map-maker';
import { getMapMakerAssetDisplayName, type MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import type { MapMakerEditTarget } from './MapMakerLayerPanel';
import styles from './MapMakerWorkbench.module.css';

type CanvasEntityKind = 'element' | 'label';
type CanvasGestureMode = 'move' | 'resize';

type MapMakerPoint = { x: number; y: number };
type MapMakerSelectionBounds = { left: number; top: number; right: number; bottom: number };
type MapMakerGesture = {
  pointerId: number;
  kind: CanvasEntityKind;
  mode: CanvasGestureMode;
  ids: readonly string[];
  selectionBounds: MapMakerSelectionBounds;
  start: MapMakerPoint;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  currentX: number;
  currentY: number;
  currentWidth: number;
  currentHeight: number;
  hasMoved: boolean;
};

export interface MapMakerCanvasProps {
  copy: MapMakerWorkspaceCopy;
  project: MapMakerProject;
  editTarget: MapMakerEditTarget;
  selectedCells: readonly MapMakerGridCell[];
  selectedElementIds: readonly string[];
  selectedLabelIds: readonly string[];
  multiSelectEnabled: boolean;
  editingLabelId: string | null;
  onSelectCells(cells: readonly MapMakerGridCell[], additive: boolean): void;
  onSelectElements(ids: readonly string[], additive: boolean): void;
  onSelectLabels(ids: readonly string[], additive: boolean): void;
  onMoveElements(ids: readonly string[], deltaX: number, deltaY: number): void;
  onMoveLabels(ids: readonly string[], deltaX: number, deltaY: number): void;
  onResizeElement(id: string, width: number, height: number): void;
  onResizeLabel(id: string, width: number, height: number): void;
  onEditLabel(id: string): void;
  onUpdateLabelText(id: string, text: string): void;
  onFinishLabelEdit(id: string): void;
  onCancelLabelEdit(id: string): void;
  onImageLoadError(url: string): void;
}

function getMapPixelSize(columns: number, rows: number): MapMakerPoint {
  return { x: columns * MAP_MAKER_TILE_SIZE, y: rows * MAP_MAKER_TILE_SIZE };
}

function pointerPoint(event: PointerEvent<HTMLElement>, mapElement: HTMLDivElement, project: MapMakerProject): MapMakerPoint {
  const rectangle = mapElement.getBoundingClientRect();
  const mapSize = getMapPixelSize(project.columns, project.rows);
  if (rectangle.width <= 0 || rectangle.height <= 0) {
    throw new Error(`Map Maker canvas must have positive dimensions. Received width=${rectangle.width}, height=${rectangle.height}.`);
  }
  return {
    x: ((event.clientX - rectangle.left) / rectangle.width) * mapSize.x,
    y: ((event.clientY - rectangle.top) / rectangle.height) * mapSize.y,
  };
}

function sourceUrl(source: MapMakerProject['baseTiles'][number]['source'], usage: 'tile' | 'element'): string {
  if (source.kind === 'url') return source.url;
  return getMapMakerAssetSrc(source.assetId, usage);
}

function sourceAccessibleName(source: MapMakerProject['baseTiles'][number]['source'], copy: MapMakerWorkspaceCopy): string {
  if (source.kind === 'asset') return getMapMakerAssetDisplayName(copy, getMapMakerAsset(source.assetId));
  return source.url;
}

function moveMapEntities(
  kind: CanvasEntityKind,
  ids: readonly string[],
  deltaX: number,
  deltaY: number,
  callbacks: Pick<MapMakerCanvasProps, 'onMoveElements' | 'onMoveLabels'>,
): void {
  if (kind === 'element') callbacks.onMoveElements(ids, deltaX, deltaY);
  else callbacks.onMoveLabels(ids, deltaX, deltaY);
}

function resizeMapEntity(
  kind: CanvasEntityKind,
  id: string,
  width: number,
  height: number,
  callbacks: Pick<MapMakerCanvasProps, 'onResizeElement' | 'onResizeLabel'>,
): void {
  if (kind === 'element') callbacks.onResizeElement(id, width, height);
  else callbacks.onResizeLabel(id, width, height);
}

function entityIdsAtPointer(
  id: string,
  selectedIds: readonly string[],
  additive: boolean,
): string[] {
  if (additive) {
    return selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id];
  }
  return selectedIds.includes(id) ? [...selectedIds] : [id];
}

function getEntitySelectionBounds(
  project: MapMakerProject,
  kind: CanvasEntityKind,
  ids: readonly string[],
): MapMakerSelectionBounds {
  const entities: readonly (MapMakerElement | MapMakerLabel)[] = kind === 'element' ? project.elements : project.labels;
  const selectedEntities = entities.filter((entity) => ids.includes(entity.id));
  if (selectedEntities.length !== ids.length || selectedEntities.length === 0) {
    throw new Error(`Map Maker ${kind} selection is incomplete. Requested ${JSON.stringify(ids)}, found ${selectedEntities.length} entities.`);
  }
  return selectedEntities.reduce<MapMakerSelectionBounds>((bounds, entity) => ({
    left: Math.min(bounds.left, entity.x),
    top: Math.min(bounds.top, entity.y),
    right: Math.max(bounds.right, entity.x + entity.width),
    bottom: Math.max(bounds.bottom, entity.y + entity.height),
  }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
}

function clamp(value: number, minimum: number, maximum: number): number {
  if (![value, minimum, maximum].every(Number.isFinite) || minimum > maximum) {
    throw new Error(`Map Maker pointer clamp has invalid bounds. Received value=${String(value)}, minimum=${String(minimum)}, maximum=${String(maximum)}.`);
  }
  return Math.min(maximum, Math.max(minimum, value));
}

function formatMapMakerPixelDimension(value: number): string {
  return `${Number(value.toFixed(3))}px`;
}

function handleEntityKeyboardMove(
  event: KeyboardEvent<HTMLElement>,
  entity: MapMakerElement | MapMakerLabel,
  kind: CanvasEntityKind,
  selectedIds: readonly string[],
  project: MapMakerProject,
  callbacks: Pick<MapMakerCanvasProps, 'onMoveElements' | 'onMoveLabels' | 'onSelectElements' | 'onSelectLabels'>,
): void {
  const step = event.shiftKey ? 10 : 1;
  let deltaX = 0;
  let deltaY = 0;
  if (event.key === 'ArrowLeft') deltaX = -step;
  else if (event.key === 'ArrowRight') deltaX = step;
  else if (event.key === 'ArrowUp') deltaY = -step;
  else if (event.key === 'ArrowDown') deltaY = step;
  else if (event.key === 'Escape') {
    if (kind === 'element') callbacks.onSelectElements([], false);
    else callbacks.onSelectLabels([], false);
    event.preventDefault();
    return;
  } else return;

  event.preventDefault();
  const ids = selectedIds.includes(entity.id) ? selectedIds : [entity.id];
  if (kind === 'element') callbacks.onSelectElements(ids, false);
  else callbacks.onSelectLabels(ids, false);
  const bounds = getEntitySelectionBounds(project, kind, ids);
  const mapSize = getMapPixelSize(project.columns, project.rows);
  const clampedDeltaX = clamp(deltaX, -bounds.left, mapSize.x - bounds.right);
  const clampedDeltaY = clamp(deltaY, -bounds.top, mapSize.y - bounds.bottom);
  if (clampedDeltaX !== 0 || clampedDeltaY !== 0) {
    moveMapEntities(kind, ids, clampedDeltaX, clampedDeltaY, callbacks);
  }
}

function baseTileTransform(tile: MapMakerProject['baseTiles'][number]): string {
  return `rotate(${tile.rotation}deg) scaleX(${tile.flipHorizontal ? -1 : 1}) scaleY(${tile.flipVertical ? -1 : 1})`;
}

function freeElementTransform(element: MapMakerElement): string {
  return `rotate(${element.rotation}deg) scaleX(${element.flipHorizontal ? -1 : 1}) scaleY(${element.flipVertical ? -1 : 1})`;
}

function getHexGridStyle(project: MapMakerProject): CSSProperties {
  const mapWidth = project.columns * MAP_MAKER_TILE_SIZE;
  const hexWidth = (mapWidth * project.settings.hexSizePercent) / 100;
  const hexHeight = (hexWidth * Math.sqrt(3)) / 2;
  const svgPath = (centerX: number, centerY: number) => {
    const points = [
      [centerX - hexWidth / 2, centerY],
      [centerX - hexWidth / 4, centerY - hexHeight / 2],
      [centerX + hexWidth / 4, centerY - hexHeight / 2],
      [centerX + hexWidth / 2, centerY],
      [centerX + hexWidth / 4, centerY + hexHeight / 2],
      [centerX - hexWidth / 4, centerY + hexHeight / 2],
    ];
    return `M${points.map(([x, y]) => `${x},${y}`).join('L')}Z`;
  };
  const patternWidth = hexWidth * 1.5;
  const pattern = `<svg xmlns="http://www.w3.org/2000/svg" width="${patternWidth}" height="${hexHeight}" viewBox="0 0 ${patternWidth} ${hexHeight}"><path d="${svgPath(0, 0)} ${svgPath(patternWidth, 0)} ${svgPath(hexWidth * 0.75, hexHeight / 2)} ${svgPath(-hexWidth * 0.75, hexHeight / 2)}" fill="none" stroke="#283746" stroke-opacity=".55" stroke-width="1"/></svg>`;
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(pattern)}")`,
    backgroundSize: `${formatMapMakerPixelDimension(patternWidth)} ${formatMapMakerPixelDimension(hexHeight)}`,
  };
}

export function MapMakerCanvas(props: MapMakerCanvasProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<MapMakerGesture | null>(null);
  const selectedCellKeys = new Set(props.selectedCells.map((cell) => `${cell.column}:${cell.row}`));
  const selectedElementSet = new Set(props.selectedElementIds);
  const selectedLabelSet = new Set(props.selectedLabelIds);
  const mapSize = getMapPixelSize(props.project.columns, props.project.rows);
  const hexWidthPixels = (mapSize.x * props.project.settings.hexSizePercent) / 100;
  const gridStyle = {
    '--map-columns': String(props.project.columns),
    '--map-rows': String(props.project.rows),
    width: `${mapSize.x}px`,
    height: `${mapSize.y}px`,
  } as CSSProperties;
  const hexStyle = getHexGridStyle(props.project);
  const baseTileByCell = new Map(props.project.baseTiles.map((tile) => [`${tile.column}:${tile.row}`, tile]));

  function onEntityPointerDown(
    event: PointerEvent<HTMLElement>,
    entity: MapMakerElement | MapMakerLabel,
    kind: CanvasEntityKind,
    selectedIds: readonly string[],
    canEditEntity: boolean,
  ): void {
    if (!canEditEntity || event.button !== 0 || event.isPrimary === false || mapElementRef.current === null) return;
    event.stopPropagation();
    const additive = props.multiSelectEnabled || event.shiftKey || event.metaKey || event.ctrlKey;
    const nextIds = entityIdsAtPointer(entity.id, selectedIds, additive);
    if (kind === 'element') props.onSelectElements(nextIds, false);
    else props.onSelectLabels(nextIds, false);
    if (additive && selectedIds.includes(entity.id)) {
      gestureRef.current = null;
      return;
    }
    const gestureIds = selectedIds.includes(entity.id) && !additive ? selectedIds : [entity.id];
    const selectionBounds = getEntitySelectionBounds(props.project, kind, gestureIds);
    const start = pointerPoint(event, mapElementRef.current, props.project);
    gestureRef.current = {
      pointerId: event.pointerId,
      kind,
      mode: 'move',
      ids: gestureIds,
      selectionBounds,
      start,
      initialX: entity.x,
      initialY: entity.y,
      initialWidth: entity.width,
      initialHeight: entity.height,
      currentX: 0,
      currentY: 0,
      currentWidth: entity.width,
      currentHeight: entity.height,
      hasMoved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onResizePointerDown(
    event: PointerEvent<HTMLButtonElement>,
    entity: MapMakerElement | MapMakerLabel,
    kind: CanvasEntityKind,
    canEditEntity: boolean,
  ): void {
    if (!canEditEntity || event.button !== 0 || event.isPrimary === false || mapElementRef.current === null) return;
    event.preventDefault();
    event.stopPropagation();
    const start = pointerPoint(event, mapElementRef.current, props.project);
    gestureRef.current = {
      pointerId: event.pointerId,
      kind,
      mode: 'resize',
      ids: [entity.id],
      selectionBounds: { left: entity.x, top: entity.y, right: entity.x + entity.width, bottom: entity.y + entity.height },
      start,
      initialX: entity.x,
      initialY: entity.y,
      initialWidth: entity.width,
      initialHeight: entity.height,
      currentX: 0,
      currentY: 0,
      currentWidth: entity.width,
      currentHeight: entity.height,
      hasMoved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onEntityPointerMove(event: PointerEvent<HTMLElement>): void {
    const gesture = gestureRef.current;
    if (gesture === null || gesture.pointerId !== event.pointerId || mapElementRef.current === null) return;
    const point = pointerPoint(event, mapElementRef.current, props.project);
    const deltaX = point.x - gesture.start.x;
    const deltaY = point.y - gesture.start.y;
    if (!gesture.hasMoved && Math.hypot(deltaX, deltaY) < 2) return;
    gesture.hasMoved = true;
    if (gesture.mode === 'move') {
      const nextX = clamp(deltaX, -gesture.selectionBounds.left, mapSize.x - gesture.selectionBounds.right);
      const nextY = clamp(deltaY, -gesture.selectionBounds.top, mapSize.y - gesture.selectionBounds.bottom);
      const movementX = nextX - gesture.currentX;
      const movementY = nextY - gesture.currentY;
      if (movementX !== 0 || movementY !== 0) {
        moveMapEntities(gesture.kind, gesture.ids, movementX, movementY, props);
        gesture.currentX = nextX;
        gesture.currentY = nextY;
      }
      return;
    }

    const largestDelta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY;
    const aspectRatio = gesture.initialHeight / gesture.initialWidth;
    const maximumWidth = Math.min(mapSize.x - gesture.initialX, (mapSize.y - gesture.initialY) / aspectRatio);
    const minimumWidth = Math.min(12, maximumWidth);
    const nextWidth = Math.min(maximumWidth, Math.max(minimumWidth, gesture.initialWidth + largestDelta));
    const nextHeight = nextWidth * aspectRatio;
    if (nextWidth !== gesture.currentWidth || nextHeight !== gesture.currentHeight) {
      resizeMapEntity(gesture.kind, gesture.ids[0]!, nextWidth, nextHeight, props);
      gesture.currentWidth = nextWidth;
      gesture.currentHeight = nextHeight;
    }
  }

  function onEntityPointerUp(event: PointerEvent<HTMLElement>): void {
    const gesture = gestureRef.current;
    if (gesture === null || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

function renderBaseTiles(): ReactNode {
    return Array.from({ length: props.project.rows }, (_, row) =>
      Array.from({ length: props.project.columns }, (_, column) => {
        const cell = { row, column };
        const key = `${column}:${row}`;
        const tile = baseTileByCell.get(key);
        if (tile === undefined) {
          throw new Error(`Map Maker project is missing base tile at column=${column}, row=${row}.`);
        }
        const selected = selectedCellKeys.has(key);
        const acceptsPointer = props.editTarget === 'base';
        return (
          <button
            key={key}
            type="button"
            className={`${styles.tile} ${props.project.settings.squareGridVisible ? styles.tileGridVisible : ''}`}
            style={{ pointerEvents: acceptsPointer ? 'auto' : 'none' }}
            disabled={!acceptsPointer}
            aria-label={`${props.copy.canvas.selectedBaseTiles}: ${column + 1}, ${row + 1}`}
            aria-pressed={selected}
            onClick={(event) => props.onSelectCells([cell], props.multiSelectEnabled || event.shiftKey || event.metaKey || event.ctrlKey)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') props.onSelectCells([], false);
            }}
          >
            <Image
              src={sourceUrl(tile.source, 'tile')}
              alt=""
              width={MAP_MAKER_TILE_SIZE}
              height={MAP_MAKER_TILE_SIZE}
              unoptimized
              draggable={false}
              className={styles.tileImage}
              style={{ transform: baseTileTransform(tile) }}
              onError={() => props.onImageLoadError(sourceUrl(tile.source, 'tile'))}
            />
          </button>
        );
      }),
    );
  }

function renderElements(layer: 1 | 2): ReactNode {
    if (!props.project.settings.elementsVisible) return null;
    const canEditLayer = props.editTarget === (layer === 1 ? 'layer-1' : 'layer-2');
      return props.project.elements.filter((element) => element.layer === layer).map((element) => {
      const selected = selectedElementSet.has(element.id);
      const assetName = sourceAccessibleName(element.source, props.copy);
      const wrapperStyle = {
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.layer,
        pointerEvents: canEditLayer ? 'auto' : 'none',
      } as CSSProperties;
      return (
        <div
          key={element.id}
          className={styles.canvasObjectWrapper}
          style={wrapperStyle}
        >
          <button
            type="button"
            aria-label={assetName}
            data-testid={`map-maker-element-${element.id}`}
            aria-pressed={selected}
            aria-disabled={!canEditLayer}
            tabIndex={canEditLayer ? 0 : -1}
            className={styles.canvasObject}
            style={{ transform: freeElementTransform(element), pointerEvents: canEditLayer ? 'auto' : 'none' }}
            onClick={(event) => {
              if (canEditLayer && event.detail === 0) props.onSelectElements(entityIdsAtPointer(element.id, props.selectedElementIds, props.multiSelectEnabled || event.shiftKey || event.metaKey || event.ctrlKey), false);
            }}
            onPointerDown={(event) => onEntityPointerDown(event, element, 'element', props.selectedElementIds, canEditLayer)}
            onPointerMove={onEntityPointerMove}
            onPointerUp={onEntityPointerUp}
            onPointerCancel={onEntityPointerUp}
            onKeyDown={(event) => {
              if (canEditLayer) handleEntityKeyboardMove(event, element, 'element', props.selectedElementIds, props.project, props);
            }}
          >
            <Image
              src={sourceUrl(element.source, 'element')}
              alt=""
              width={element.width}
              height={element.height}
              unoptimized
              draggable={false}
              className={styles.canvasObjectImage}
              onError={() => props.onImageLoadError(sourceUrl(element.source, 'element'))}
            />
          </button>
          {selected && props.project.settings.elementResizingEnabled && props.selectedElementIds.length === 1 ? (
            <button
              type="button"
              aria-label={props.copy.properties.allowResize}
              className={styles.selectionBox}
              onPointerDown={(event) => onResizePointerDown(event, element, 'element', canEditLayer)}
              onPointerMove={onEntityPointerMove}
              onPointerUp={onEntityPointerUp}
              onPointerCancel={onEntityPointerUp}
              onKeyDown={(event) => {
                const step = event.shiftKey ? 10 : 1;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  const mapSize = getMapPixelSize(props.project.columns, props.project.rows);
                  const aspectRatio = element.height / element.width;
                  const nextWidth = Math.min(mapSize.x - element.x, (mapSize.y - element.y) / aspectRatio, element.width + step);
                  if (nextWidth !== element.width) props.onResizeElement(element.id, nextWidth, nextWidth * aspectRatio);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  const aspectRatio = element.height / element.width;
                  const nextWidth = Math.max(12, element.width - step);
                  if (nextWidth !== element.width) props.onResizeElement(element.id, nextWidth, nextWidth * aspectRatio);
                }
              }}
            />
          ) : null}
        </div>
      );
    });
  }

function renderLabels(): ReactNode {
    if (!props.project.settings.labelsVisible) return null;
    const canEditLabels = props.editTarget === 'labels';
    return props.project.labels.map((label) => {
      const selected = selectedLabelSet.has(label.id);
      const wrapperStyle = {
        left: `${label.x}px`,
        top: `${label.y}px`,
        width: `${label.width}px`,
        height: `${label.height}px`,
        zIndex: 3,
        pointerEvents: canEditLabels ? 'auto' : 'none',
      } as CSSProperties;
      return (
        <div
          key={label.id}
          className={styles.canvasObjectWrapper}
          style={wrapperStyle}
        >
          {props.editingLabelId === label.id ? (
            <textarea
              data-testid={`map-maker-label-editor-${label.id}`}
              autoFocus
              rows={2}
              aria-label={props.copy.properties.labelText}
              className={styles.labelEditor}
              style={{ fontSize: `${label.fontSize}px`, pointerEvents: canEditLabels ? 'auto' : 'none' }}
              value={label.text}
              onChange={(event) => props.onUpdateLabelText(label.id, event.currentTarget.value)}
              onBlur={(event) => {
                const focusDestination = event.relatedTarget;
                if (focusDestination instanceof HTMLElement && focusDestination.hasAttribute('data-map-maker-label-edit-toggle')) return;
                props.onFinishLabelEdit(label.id);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  props.onFinishLabelEdit(label.id);
                } else if (event.key === 'Escape') {
                  event.preventDefault();
                  props.onCancelLabelEdit(label.id);
                }
              }}
            />
          ) : (
            <button
              type="button"
              data-testid={`map-maker-label-${label.id}`}
              aria-pressed={selected}
              aria-disabled={!canEditLabels}
              tabIndex={canEditLabels ? 0 : -1}
              className={styles.labelObject}
              style={{
                height: `${label.height}px`,
                fontSize: `${label.fontSize}px`,
                border: props.project.settings.labelBordersEnabled ? undefined : '1px solid transparent',
                pointerEvents: canEditLabels ? 'auto' : 'none',
              }}
              onClick={(event) => {
                if (canEditLabels && event.detail === 0) props.onSelectLabels(entityIdsAtPointer(label.id, props.selectedLabelIds, props.multiSelectEnabled || event.shiftKey || event.metaKey || event.ctrlKey), false);
              }}
              onDoubleClick={(event) => {
                if (!canEditLabels) return;
                event.preventDefault();
                event.stopPropagation();
                props.onEditLabel(label.id);
              }}
              onPointerDown={(event) => onEntityPointerDown(event, label, 'label', props.selectedLabelIds, canEditLabels)}
              onPointerMove={onEntityPointerMove}
              onPointerUp={onEntityPointerUp}
              onPointerCancel={onEntityPointerUp}
              onKeyDown={(event) => {
                if (canEditLabels) handleEntityKeyboardMove(event, label, 'label', props.selectedLabelIds, props.project, props);
              }}
            >
              {label.text}
            </button>
          )}
          {selected && props.project.settings.labelResizingEnabled && props.selectedLabelIds.length === 1 ? (
            <button
              type="button"
              aria-label={props.copy.properties.allowResize}
              className={styles.selectionBox}
              onPointerDown={(event) => onResizePointerDown(event, label, 'label', canEditLabels)}
              onPointerMove={onEntityPointerMove}
              onPointerUp={onEntityPointerUp}
              onPointerCancel={onEntityPointerUp}
              onKeyDown={(event) => {
                const step = event.shiftKey ? 10 : 1;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  const mapSize = getMapPixelSize(props.project.columns, props.project.rows);
                  const nextWidth = Math.min(mapSize.x - label.x, label.width + step);
                  const nextHeight = Math.min(mapSize.y - label.y, label.height + step);
                  if (nextWidth !== label.width || nextHeight !== label.height) props.onResizeLabel(label.id, nextWidth, nextHeight);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  const nextWidth = Math.max(12, label.width - step);
                  const nextHeight = Math.max(12, label.height - step);
                  if (nextWidth !== label.width || nextHeight !== label.height) props.onResizeLabel(label.id, nextWidth, nextHeight);
                }
              }}
            />
          ) : null}
        </div>
      );
    });
  }

  return (
    <div
      ref={mapElementRef}
      data-testid="map-maker-canvas"
      role="group"
      aria-label={props.copy.canvas.mapPreviewAlt}
      className={styles.tileGrid}
      style={gridStyle}
    >
      {renderBaseTiles()}
      <div className={styles.canvasOverlay}>
        {renderElements(1)}
        {renderElements(2)}
        {renderLabels()}
      </div>
      {props.project.settings.hexGridVisible ? <div aria-hidden="true" data-hex-width-px={hexWidthPixels} className={styles.hexGridOverlay} style={hexStyle} /> : null}
    </div>
  );
}
