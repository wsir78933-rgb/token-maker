'use client';

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from 'react';
import { renderCoatSceneSvg } from '@/lib/coat-of-arms/scene-svg';
import { appendFreehandPoint, createFreehandPath, type FreehandPoint } from '@/lib/coat-of-arms/drawing';
import {
  getTransformedLayerBounds,
  getTransformedSelectionBounds,
  sceneBoundsEqual,
  sceneBoundsFromClientRects,
  type SceneBounds,
} from '@/lib/coat-of-arms/selection-bounds';
import {
  snapCanvasDrag,
  type CanvasSnapGuide,
  type CanvasSnapLayerTarget,
} from '@/lib/coat-of-arms/canvas-snapping';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CanvasTransform, CoatLayer, CoatLocale } from '@/lib/coat-of-arms/types';
import { getTransformSelectionCenter, scaleCanvasTransform, transformCanvasSelection, type TransformSelectionCenter } from '@/lib/coat-of-arms/transform';
import { CanvasSelectionHandles } from './CanvasSelectionHandles';
import { useCoatKeyboardShortcuts } from './useCoatKeyboardShortcuts';
import { getCoatWorkbenchCopy } from './workbench-copy';

const SCENE_WIDTH = 100;
const SCENE_HEIGHT = 110;

type InteractionMode = 'drag' | 'resize' | 'rotate';

interface CanvasInteraction {
  mode: InteractionMode;
  pointerId: number;
  layerId: string;
  layerIds: string[];
  startPoint: ScenePoint;
  startTransform: CanvasTransform;
  startTransforms: Record<string, CanvasTransform>;
  selectionCenter: TransformSelectionCenter;
  startAngle: number;
  startSelectionBounds: SceneBounds;
  snapLayerTargets: CanvasSnapLayerTarget[];
}

interface ScenePoint {
  x: number;
  y: number;
}

interface TransformPreview {
  transforms: Record<string, CanvasTransform>;
}

interface DrawingInteraction {
  pointerId: number;
  points: FreehandPoint[];
}

export interface CoatOfArmsCanvasProps {
  disabled?: boolean;
  locale: CoatLocale;
  multiSelectEnabled?: boolean;
  snappingEnabled?: boolean;
}

/**
 * Renders the shared scene SVG and translates only active canvas gestures into
 * validated update-layer commands. Selection is transient UI state.
 */
export function CoatOfArmsCanvas({
  disabled = false,
  locale,
  multiSelectEnabled = false,
  snappingEnabled = true,
}: CoatOfArmsCanvasProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const project = useCoatProjectStore((state) => state.project);
  const dispatch = useCoatProjectStore((state) => state.dispatch);
  const drawingSettings = useCoatProjectStore((state) => state.drawingSettings);
  const canvasRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<CanvasInteraction | null>(null);
  const drawingInteractionRef = useRef<DrawingInteraction | null>(null);
  const [transformPreview, setTransformPreview] = useState<TransformPreview | null>(null);
  const [snapGuides, setSnapGuides] = useState<CanvasSnapGuide[]>([]);
  const [drawingPreview, setDrawingPreview] = useState<FreehandPoint[] | null>(null);
  const toScenePoint = useCanvasScenePoint(canvasRef);
  const {
    selection,
    setSelection,
    selectRelativeLayer,
    adjustSelectedTransform,
  } = useCoatKeyboardShortcuts({ disabled });
  const sceneProject = useMemo(
    () => transformPreview ? withPreviewTransforms(project, transformPreview.transforms) : project,
    [project, transformPreview],
  );
  const sceneSvg = useMemo(
    () => renderCoatSceneSvg(sceneProject, { width: project.canvas.width, height: project.canvas.height }),
    [project.canvas.height, project.canvas.width, sceneProject],
  );
  const selectedTransformLayers = getSelectedTransformLayers(project.layers, selection);
  const selectedHandleLayer = selectedTransformLayers[0];
  const selectedHandleTransforms = selectedTransformLayers.map((layer) => (
    transformPreview?.transforms[layer.id] ?? layer.transform
  ));
  const selectedHandleCenter = selectedHandleTransforms.length > 0
    ? getTransformSelectionCenter(selectedHandleTransforms)
    : null;
  const overlayLayers = getSelectedOverlayLayers(sceneProject.layers, selection);
  const overlayLayerKey = overlayLayers.map((layer) => layer.id).join(',');
  const fallbackSelectionBounds = overlayLayers.length > 0
    ? getTransformedSelectionBounds(overlayLayers.map((layer) => layer.transform))
    : null;
  const [measuredSelectionBounds, setMeasuredSelectionBounds] = useState<SceneBounds | null>(null);
  const selectionBounds = measuredSelectionBounds ?? fallbackSelectionBounds;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const overlayLayerIds = overlayLayerKey === '' ? [] : overlayLayerKey.split(',');
    if (!canvas || overlayLayerIds.length === 0) {
      setMeasuredSelectionBounds((current) => current === null ? current : null);
      return;
    }
    const layerRects = overlayLayerIds.map((layerId) => readLayerClientRect(canvas, layerId));
    const nextBounds = sceneBoundsFromClientRects(canvas.getBoundingClientRect(), layerRects);
    setMeasuredSelectionBounds((current) => sceneBoundsEqual(current, nextBounds) ? current : nextBounds);
  }, [overlayLayerKey, sceneSvg]);

  const beginInteraction = useCallback((
    event: PointerEvent<HTMLElement>,
    mode: InteractionMode,
    layer: Exclude<CoatLayer, { type: 'background' }>,
    interactionLayers: Exclude<CoatLayer, { type: 'background' }>[] = [layer],
  ) => {
    const startPoint = toScenePoint(event);
    const interactionLayerIds = interactionLayers.map((interactionLayer) => interactionLayer.id);
    const selectionCenter = getTransformSelectionCenter(interactionLayers.map((interactionLayer) => interactionLayer.transform));
    interactionRef.current = {
      mode,
      pointerId: getPointerId(event),
      layerId: layer.id,
      layerIds: interactionLayerIds,
      startPoint,
      startTransform: cloneTransform(layer.transform),
      startTransforms: Object.fromEntries(interactionLayers.map((interactionLayer) => [
        interactionLayer.id,
        cloneTransform(interactionLayer.transform),
      ])),
      selectionCenter,
      startAngle: getAngleFromScenePoint(startPoint, toSceneSelectionPoint(selectionCenter)),
      startSelectionBounds: getPaintedSelectionBounds(canvasRef.current, interactionLayers),
      snapLayerTargets: getSnapLayerTargets(canvasRef.current, project.layers, interactionLayerIds),
    };
    setSnapGuides([]);
    capturePointer(canvasRef.current, getPointerId(event));
    canvasRef.current?.focus();
  }, [project.layers, toScenePoint]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (drawingSettings.isActive) {
      const pointerId = getPointerId(event);
      const firstPoint = toScenePoint(event);
      drawingInteractionRef.current = { pointerId, points: [firstPoint] };
      setDrawingPreview([firstPoint]);
      capturePointer(canvasRef.current, pointerId);
      canvasRef.current?.focus();
      event.preventDefault();
      return;
    }
    const layerId = getLayerIdFromTarget(event.target);
    if (!layerId) {
      setSelection([]);
      return;
    }
    const layer = project.layers.find((candidate) => candidate.id === layerId);
    if (!layer || layer.type === 'background') {
      setSelection([]);
      return;
    }
    if (layer.locked) return;

    const relatedLayerIds = getRelatedLayerIds(project.layers, layer);
    const isExplicitSelectionToggle = event.metaKey || event.ctrlKey || event.shiftKey;
    const nextSelection = isExplicitSelectionToggle
      ? toggleSelectionGroup(selection, relatedLayerIds)
      : multiSelectEnabled
        ? hasCompleteSelection(selection, relatedLayerIds) ? selection : addSelectionGroup(selection, relatedLayerIds)
        : relatedLayerIds;
    setSelection(nextSelection);
    if (isExplicitSelectionToggle) return;
    if (hasTransform(layer)) {
      const relatedLayers = relatedLayerIds
        .map((relatedLayerId) => project.layers.find((candidate) => candidate.id === relatedLayerId))
        .filter((candidate): candidate is CoatLayer => candidate !== undefined);
      if (relatedLayers.some((candidate) => candidate.locked)) return;
      const selectedDragLayers = nextSelection
        .map((selectedLayerId) => project.layers.find((candidate) => candidate.id === selectedLayerId))
        .filter((candidate): candidate is Exclude<CoatLayer, { type: 'background' }> => candidate !== undefined && hasTransform(candidate) && !candidate.locked);
      beginInteraction(event, 'drag', layer, selectedDragLayers.length > 1 ? selectedDragLayers : [layer]);
    }
  }, [beginInteraction, disabled, drawingSettings.isActive, multiSelectEnabled, project.layers, selection, setSelection, toScenePoint]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drawingInteraction = drawingInteractionRef.current;
    if (drawingInteraction?.pointerId === getPointerId(event)) {
      const nextPoints = appendFreehandPoint(drawingInteraction.points, toScenePoint(event));
      drawingInteractionRef.current = { ...drawingInteraction, points: nextPoints };
      setDrawingPreview(nextPoints);
      return;
    }
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== getPointerId(event)) return;
    const preview = getNextInteractionPreview(
      interaction,
      toScenePoint(event),
      snappingEnabled,
      event.altKey,
      getCanvasClientSize(canvasRef.current),
    );
    setTransformPreview({ transforms: preview.transforms });
    setSnapGuides(preview.guides);
  }, [snappingEnabled, toScenePoint]);

  const completeInteraction = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drawingInteraction = drawingInteractionRef.current;
    if (drawingInteraction?.pointerId === getPointerId(event)) {
      const nextPoints = appendFreehandPoint(drawingInteraction.points, toScenePoint(event));
      drawingInteractionRef.current = null;
      releasePointer(canvasRef.current, drawingInteraction.pointerId);
      setDrawingPreview(null);
      if (nextPoints.length >= 2) {
        dispatch({
          type: 'add-drawing-layer', path: createFreehandPath(nextPoints),
          color: drawingSettings.color, strokeWidth: drawingSettings.strokeWidth,
        });
        const newestLayer = useCoatProjectStore.getState().project.layers.at(-1);
        if (newestLayer?.type === 'draw') setSelection([newestLayer.id]);
      }
      return;
    }
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== getPointerId(event)) return;
    const nextTransforms = getNextInteractionPreview(
      interaction,
      toScenePoint(event),
      snappingEnabled,
      event.altKey,
      getCanvasClientSize(canvasRef.current),
    ).transforms;
    interactionRef.current = null;
    releasePointer(canvasRef.current, interaction.pointerId);
    setTransformPreview(null);
    setSnapGuides([]);
    const updates = interaction.layerIds.flatMap((layerId) => {
      const startTransform = interaction.startTransforms[layerId];
      const nextTransform = nextTransforms[layerId];
      if (!startTransform || !nextTransform || transformsMatch(startTransform, nextTransform)) return [];
      return [{ layerId, patch: { transform: nextTransform } }];
    });
    if (updates.length === 1) {
      dispatch({ type: 'update-layer', ...updates[0] });
    } else if (updates.length > 1) {
      dispatch({ type: 'update-layers', updates });
    }
  }, [dispatch, drawingSettings.color, drawingSettings.strokeWidth, setSelection, snappingEnabled, toScenePoint]);

  const cancelInteraction = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drawingInteraction = drawingInteractionRef.current;
    if (drawingInteraction?.pointerId === getPointerId(event)) {
      drawingInteractionRef.current = null;
      releasePointer(canvasRef.current, drawingInteraction.pointerId);
      setDrawingPreview(null);
      setSnapGuides([]);
      return;
    }
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== getPointerId(event)) return;
    interactionRef.current = null;
    releasePointer(canvasRef.current, interaction.pointerId);
    setTransformPreview(null);
    setSnapGuides([]);
  }, []);

  const beginHandleInteraction = useCallback((mode: 'resize' | 'rotate') => (
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (selectedHandleLayer) beginInteraction(event, mode, selectedHandleLayer, selectedTransformLayers);
  }, [beginInteraction, selectedHandleLayer, selectedTransformLayers]);

  const cancelTransformInteraction = useCallback(() => {
    const interaction = interactionRef.current;
    if (!interaction) return false;
    interactionRef.current = null;
    releasePointer(canvasRef.current, interaction.pointerId);
    setTransformPreview(null);
    setSnapGuides([]);
    return true;
  }, []);

  const handleCanvasKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || event.defaultPrevented || isEditableCanvasTarget(event.target)) return;
    if (event.key === 'Escape' && cancelTransformInteraction()) {
      event.preventDefault();
      return;
    }
    if (event.altKey && !event.ctrlKey && !event.metaKey) {
      const selectionDirection = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : null;
      if (selectionDirection !== null && selectRelativeLayer(selectionDirection)) event.preventDefault();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    const adjustment = event.key === ']'
      ? { scale: 0.1 }
      : event.key === '['
        ? { scale: -0.1 }
        : event.key === '.'
          ? { rotation: 15 }
          : event.key === ','
            ? { rotation: -15 }
            : null;
    if (adjustment && adjustSelectedTransform(adjustment)) event.preventDefault();
  }, [adjustSelectedTransform, cancelTransformInteraction, disabled, selectRelativeLayer]);

  const handleHandleKeyDown = useCallback((adjustment: { scale?: number; rotation?: number }) => (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    event.stopPropagation();
    adjustSelectedTransform(adjustment);
  }, [adjustSelectedTransform, disabled]);

  return (
    <div
      ref={canvasRef}
      aria-describedby="coat-canvas-help"
      aria-disabled={disabled || undefined}
      aria-label={copy.canvas.label}
      className="coat-canvas relative w-full touch-none overflow-visible rounded-md border border-[color:var(--site-border-strong)] bg-[color:var(--site-panel-strong)] shadow-[var(--site-card-shadow)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-strong)]"
      onKeyDown={handleCanvasKeyDown}
      onPointerCancel={cancelInteraction}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={completeInteraction}
      role="application"
      style={{ '--coat-canvas-aspect-ratio': `${project.canvas.width} / ${project.canvas.height}` } as React.CSSProperties}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]" dangerouslySetInnerHTML={{ __html: sceneSvg }} />
      {drawingPreview && drawingPreview.length >= 2 ? <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 110">
        <path d={createFreehandPath(drawingPreview)} fill="none" stroke={drawingSettings.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={drawingSettings.strokeWidth} />
      </svg> : null}
      {snapGuides.length > 0 ? <CanvasSnapGuides guides={snapGuides} /> : null}
      {selectionBounds ? (
        <CanvasSelectionHandles
          locale={locale}
          selectionBounds={selectionBounds}
          showTransformHandles={selectedHandleLayer !== undefined && selectedHandleCenter !== null}
          onResizeKeyDown={handleHandleKeyDown({ scale: 0.1 })}
          onResizePointerDown={beginHandleInteraction('resize')}
          onRotateKeyDown={handleHandleKeyDown({ rotation: 15 })}
          onRotatePointerDown={beginHandleInteraction('rotate')}
        />
      ) : null}
      <p className="sr-only" id="coat-canvas-help">
        {copy.canvas.help}
      </p>
    </div>
  );
}

function CanvasSnapGuides({ guides }: { guides: readonly CanvasSnapGuide[] }) {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 110">
      {guides.map((guide) => (
        <line
          data-snap-guide-axis={guide.axis}
          key={guide.axis}
          stroke="#5b9bd5"
          strokeDasharray="5 4"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          x1={guide.axis === 'x' ? guide.position : guide.start}
          x2={guide.axis === 'x' ? guide.position : guide.end}
          y1={guide.axis === 'y' ? guide.position : guide.start}
          y2={guide.axis === 'y' ? guide.position : guide.end}
        />
      ))}
    </svg>
  );
}

/** The only client-to-scene coordinate conversion used by the canvas. */
function useCanvasScenePoint(canvasRef: RefObject<HTMLDivElement | null>) {
  return useCallback((event: Pick<PointerEvent<HTMLElement>, 'clientX' | 'clientY'>): ScenePoint => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas element is unavailable for pointer conversion');
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) {
      throw new Error(`Invalid canvas bounds: ${bounds.width}x${bounds.height}`);
    }
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * SCENE_WIDTH,
      y: ((event.clientY - bounds.top) / bounds.height) * SCENE_HEIGHT,
    };
  }, [canvasRef]);
}

function getSelectedTransformLayers(layers: CoatLayer[], selection: string[]): Exclude<CoatLayer, { type: 'background' }>[] {
  if (selection.length === 0) return [];
  const layerById = new Map(layers.map((layer) => [layer.id, layer]));
  const selectedLayers = selection.map((layerId) => layerById.get(layerId));
  if (selectedLayers.some((layer) => layer === undefined || layer.locked || !hasTransform(layer))) return [];
  return selectedLayers as Exclude<CoatLayer, { type: 'background' }>[];
}

function getSelectedOverlayLayers(layers: CoatLayer[], selection: string[]): Exclude<CoatLayer, { type: 'background' }>[] {
  return selection.flatMap((layerId) => {
    const layer = layers.find((candidate) => candidate.id === layerId);
    if (!layer || !hasTransform(layer)) return [];
    return [layer];
  });
}

function readLayerClientRect(canvas: HTMLElement, layerId: string): { left: number; top: number; width: number; height: number } {
  if (layerId.includes('"') || layerId.includes(']')) {
    throw new Error(`Unsupported layer id for selection bounds query: ${layerId}`);
  }
  const layerElement = canvas.querySelector(`[data-layer-id="${layerId}"]`);
  if (!(layerElement instanceof Element)) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }
  return layerElement.getBoundingClientRect();
}

function hasTransform(layer: CoatLayer): layer is Exclude<CoatLayer, { type: 'background' }> {
  return layer.type !== 'background';
}

function getLayerIdFromTarget(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  return target.closest('[data-layer-id]')?.getAttribute('data-layer-id') ?? null;
}

function isEditableCanvasTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return true;
  }
  return (target instanceof HTMLElement && target.isContentEditable)
    || target.closest('[contenteditable]:not([contenteditable="false"])') !== null;
}

function getRelatedLayerIds(layers: CoatLayer[], layer: CoatLayer): string[] {
  if (layer.groupId === null) return [layer.id];
  return layers.filter((candidate) => candidate.groupId === layer.groupId).map((candidate) => candidate.id);
}

function hasCompleteSelection(selection: string[], layerIds: string[]): boolean {
  return layerIds.every((layerId) => selection.includes(layerId));
}

function addSelectionGroup(selection: string[], layerIds: string[]): string[] {
  return [...selection, ...layerIds.filter((layerId) => !selection.includes(layerId))];
}

function toggleSelectionGroup(selection: string[], layerIds: string[]): string[] {
  return hasCompleteSelection(selection, layerIds)
    ? selection.filter((selectedLayerId) => !layerIds.includes(selectedLayerId))
    : addSelectionGroup(selection, layerIds);
}

function getPointerId(event: Pick<PointerEvent<HTMLElement>, 'pointerId'>): number {
  return event.pointerId ?? 0;
}

function getNextTransform(interaction: CanvasInteraction, currentPoint: ScenePoint): CanvasTransform {
  switch (interaction.mode) {
    case 'drag':
      return {
        ...interaction.startTransform,
        x: interaction.startTransform.x + currentPoint.x - interaction.startPoint.x,
        y: interaction.startTransform.y + currentPoint.y - interaction.startPoint.y,
      };
    case 'resize':
      return scaleCanvasTransform(interaction.startTransform, (currentPoint.x - interaction.startPoint.x) / SCENE_WIDTH);
    case 'rotate':
      return {
        ...interaction.startTransform,
        rotation: interaction.startTransform.rotation + getAngleFromScenePoint(currentPoint, toSceneSelectionPoint(interaction.selectionCenter)) - interaction.startAngle,
      };
  }
}

function toSceneSelectionPoint(selectionCenter: TransformSelectionCenter): ScenePoint {
  return { x: SCENE_WIDTH / 2 + selectionCenter.x, y: SCENE_HEIGHT / 2 + selectionCenter.y };
}

function getAngleFromScenePoint(point: ScenePoint, center: ScenePoint): number {
  return Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI;
}

function getNextTransforms(interaction: CanvasInteraction, currentPoint: ScenePoint): Record<string, CanvasTransform> {
  const nextTransform = getNextTransform(interaction, currentPoint);
  if (interaction.layerIds.length === 1) {
    return { [interaction.layerId]: nextTransform };
  }
  if (interaction.mode === 'resize') {
    const scaleFactor = nextTransform.scale / interaction.startTransform.scale;
    return createSelectionTransformMap(interaction, { scaleFactor });
  }
  if (interaction.mode === 'rotate') {
    const rotationDelta = nextTransform.rotation - interaction.startTransform.rotation;
    return createSelectionTransformMap(interaction, { rotationDegrees: rotationDelta });
  }
  const deltaX = nextTransform.x - interaction.startTransform.x;
  const deltaY = nextTransform.y - interaction.startTransform.y;
  return Object.fromEntries(interaction.layerIds.map((layerId) => {
    const startTransform = interaction.startTransforms[layerId];
    if (!startTransform) throw new Error(`Missing start transform for selected layer: ${layerId}`);
    return [layerId, { ...startTransform, x: startTransform.x + deltaX, y: startTransform.y + deltaY }];
  }));
}

function getNextInteractionPreview(
  interaction: CanvasInteraction,
  currentPoint: ScenePoint,
  snappingEnabled: boolean,
  altKey: boolean,
  canvasClientSize: { width: number; height: number },
): { transforms: Record<string, CanvasTransform>; guides: CanvasSnapGuide[] } {
  if (interaction.mode !== 'drag') {
    return { transforms: getNextTransforms(interaction, currentPoint), guides: [] };
  }
  const proposedTransform = getNextTransform(interaction, currentPoint);
  const snapResult = snapCanvasDrag({
    selectionBounds: interaction.startSelectionBounds,
    proposedDelta: {
      x: proposedTransform.x - interaction.startTransform.x,
      y: proposedTransform.y - interaction.startTransform.y,
    },
    pageBounds: { x: 0, y: 0, width: SCENE_WIDTH, height: SCENE_HEIGHT },
    layerTargets: interaction.snapLayerTargets,
    canvasClientSize,
    snappingEnabled,
    altKey,
  });
  return {
    transforms: createDragTransformMap(interaction, snapResult.delta),
    guides: snapResult.guides,
  };
}

function createDragTransformMap(
  interaction: CanvasInteraction,
  delta: { x: number; y: number },
): Record<string, CanvasTransform> {
  return Object.fromEntries(interaction.layerIds.map((layerId) => {
    const startTransform = interaction.startTransforms[layerId];
    if (!startTransform) throw new Error(`Missing start transform for selected layer: ${layerId}`);
    return [layerId, { ...startTransform, x: startTransform.x + delta.x, y: startTransform.y + delta.y }];
  }));
}

function getPaintedSelectionBounds(
  canvas: HTMLDivElement | null,
  layers: readonly Exclude<CoatLayer, { type: 'background' }>[],
): SceneBounds {
  if (!canvas) throw new Error('Canvas element is unavailable for selection snapping bounds');
  const paintedBounds = sceneBoundsFromClientRects(
    canvas.getBoundingClientRect(),
    layers.map((layer) => readLayerClientRect(canvas, layer.id)),
  );
  return paintedBounds ?? getTransformedSelectionBounds(layers.map((layer) => layer.transform));
}

function getSnapLayerTargets(
  canvas: HTMLDivElement | null,
  layers: readonly CoatLayer[],
  selectedLayerIds: readonly string[],
): CanvasSnapLayerTarget[] {
  if (!canvas) throw new Error('Canvas element is unavailable for layer snapping bounds');
  const canvasRect = canvas.getBoundingClientRect();
  return layers.flatMap((layer) => {
    if (!layer.visible || layer.locked || selectedLayerIds.includes(layer.id) || !hasTransform(layer)) return [];
    const paintedBounds = sceneBoundsFromClientRects(canvasRect, [readLayerClientRect(canvas, layer.id)]);
    return [{ id: layer.id, bounds: paintedBounds ?? getTransformedLayerBounds(layer.transform) }];
  });
}

function getCanvasClientSize(canvas: HTMLDivElement | null): { width: number; height: number } {
  if (!canvas) throw new Error('Canvas element is unavailable for snapping threshold');
  const bounds = canvas.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}

function createSelectionTransformMap(
  interaction: CanvasInteraction,
  adjustment: Parameters<typeof transformCanvasSelection>[1],
): Record<string, CanvasTransform> {
  const startTransforms = interaction.layerIds.map((layerId) => {
    const startTransform = interaction.startTransforms[layerId];
    if (!startTransform) throw new Error(`Missing start transform for selected layer: ${layerId}`);
    return startTransform;
  });
  const nextTransforms = transformCanvasSelection(startTransforms, adjustment, interaction.selectionCenter);
  return Object.fromEntries(interaction.layerIds.map((layerId, index) => [layerId, nextTransforms[index]! ]));
}

function withPreviewTransforms(project: ReturnType<typeof useCoatProjectStore.getState>['project'], previewTransforms: Record<string, CanvasTransform>) {
  return {
    ...project,
    layers: project.layers.map((layer) => (
      previewTransforms[layer.id] && hasTransform(layer)
        ? { ...layer, transform: previewTransforms[layer.id] }
        : layer
    )),
  };
}

function transformsMatch(left: CanvasTransform, right: CanvasTransform): boolean {
  return left.x === right.x
    && left.y === right.y
    && left.scale === right.scale
    && left.scaleX === right.scaleX
    && left.scaleY === right.scaleY
    && left.rotation === right.rotation
    && left.opacity === right.opacity
    && cropsMatch(left.crop, right.crop);
}

function cropsMatch(left: CanvasTransform['crop'], right: CanvasTransform['crop']): boolean {
  return left?.x === right?.x
    && left?.y === right?.y
    && left?.width === right?.width
    && left?.height === right?.height;
}

function cloneTransform(transform: CanvasTransform): CanvasTransform {
  return { ...transform, ...(transform.crop ? { crop: { ...transform.crop } } : {}) };
}

function capturePointer(canvas: HTMLDivElement | null, pointerId: number): void {
  if (canvas && typeof canvas.setPointerCapture === 'function') canvas.setPointerCapture(pointerId);
}

function releasePointer(canvas: HTMLDivElement | null, pointerId: number): void {
  if (canvas && typeof canvas.releasePointerCapture === 'function') canvas.releasePointerCapture(pointerId);
}
