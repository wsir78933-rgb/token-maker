'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from 'react';
import { COAT_PROJECT_LIMITS } from '@/lib/coat-of-arms/commands';
import { prefixCoatSceneSvgIds, renderCoatSceneSvg, withVisibleSceneSvgOverflow } from '@/lib/coat-of-arms/scene-svg';
import { appendFreehandPoint, createFreehandPath, type FreehandPoint } from '@/lib/coat-of-arms/drawing';
import {
  getTransformedLayerBounds,
  getTransformedSelectionBounds,
  sceneBoundsEqual,
  sceneBoundsFromClientRects,
  SELECTION_SCENE_HEIGHT,
  SELECTION_SCENE_WIDTH,
  type SceneBounds,
} from '@/lib/coat-of-arms/selection-bounds';
import {
  snapCanvasDrag,
  type CanvasSnapGuide,
  type CanvasSnapLayerTarget,
} from '@/lib/coat-of-arms/canvas-snapping';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type {
  CanvasTransform,
  CoatLayer,
  CoatLocale,
  TextLayer,
  TextPathFacing,
  TextPathLayout,
  TextPathPlacement,
  TextPathSpacing,
} from '@/lib/coat-of-arms/types';
import { getTransformSelectionCenter, scaleCanvasTransform, transformCanvasSelection, type TransformSelectionCenter } from '@/lib/coat-of-arms/transform';
import {
  CanvasSelectionHandles,
  CanvasTextPathOverlay,
  type CanvasTextBoxWidthHandleSide,
  type CanvasTextPathGuide,
  type CanvasTextPathHandleKind,
} from './CanvasSelectionHandles';
import { CanvasSelectionToolbar } from './CanvasSelectionToolbar';
import {
  createTextCreationCommand,
  defaultStraightTextBoxWidth,
  isTextCreationCardKind,
  STRAIGHT_TEXT_SVG_BASELINE_Y,
  TEXT_CREATION_DRAG_MIME,
  type TextCreationCardKind,
} from './text-creation-drag';
import { useCoatKeyboardShortcuts } from './useCoatKeyboardShortcuts';
import { getCoatWorkbenchCopy } from './workbench-copy';

const SCENE_WIDTH = 100;
const SCENE_HEIGHT = 110;
/** Off-artboard copy only. Matches coamaker beige veil alpha 0.5 over #f0ece2. */
const OFF_CANVAS_OVERFLOW_OPACITY = 0.5;
const OVERFLOW_SCENE_ID_PREFIX = 'coat-overflow-';

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

interface TextPathInteraction {
  pointerId: number;
  layerId: string;
  kind: CanvasTextPathHandleKind;
  startPath: TextPathPlacement;
  startTransform: CanvasTransform;
}

interface TextPathPreview {
  layerId: string;
  path: TextPathPlacement;
}

interface TextBoxWidthInteraction {
  pointerId: number;
  layerId: string;
  side: CanvasTextBoxWidthHandleSide;
  startBoxWidth: number;
  startPoint: ScenePoint;
}

interface TextBoxWidthPreview {
  layerId: string;
  boxWidth: number;
}

const TEXT_BOX_WIDTH_MIN = 8;
const TEXT_BOX_WIDTH_MAX = 100;
const TEXT_PATH_RADIUS_MIN = 10;
const TEXT_PATH_RADIUS_MAX = 50;

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
  const textPathInteractionRef = useRef<TextPathInteraction | null>(null);
  const textBoxWidthInteractionRef = useRef<TextBoxWidthInteraction | null>(null);
  const [transformPreview, setTransformPreview] = useState<TransformPreview | null>(null);
  const [textPathPreview, setTextPathPreview] = useState<TextPathPreview | null>(null);
  const [textBoxWidthPreview, setTextBoxWidthPreview] = useState<TextBoxWidthPreview | null>(null);
  const [snapGuides, setSnapGuides] = useState<CanvasSnapGuide[]>([]);
  const [drawingPreview, setDrawingPreview] = useState<FreehandPoint[] | null>(null);
  const [inlineTextEdit, setInlineTextEdit] = useState<{ layerId: string; text: string } | null>(null);
  const [inlineTextError, setInlineTextError] = useState<string | null>(null);
  const toScenePoint = useCanvasScenePoint(canvasRef);
  const {
    selection,
    setSelection,
    selectRelativeLayer,
    adjustSelectedTransform,
  } = useCoatKeyboardShortcuts({ disabled });
  const sceneProject = useMemo(
    () => {
      const transformedProject = transformPreview
        ? withPreviewTransforms(project, transformPreview.transforms)
        : project;
      const pathPreviewedProject = textPathPreview
        ? withPreviewTextPath(transformedProject, textPathPreview)
        : transformedProject;
      return textBoxWidthPreview
        ? withPreviewTextBoxWidth(pathPreviewedProject, textBoxWidthPreview)
        : pathPreviewedProject;
    },
    [project, textBoxWidthPreview, textPathPreview, transformPreview],
  );
  const sceneSvg = useMemo(
    () => renderCoatSceneSvg(sceneProject, { width: project.canvas.width, height: project.canvas.height }),
    [project.canvas.height, project.canvas.width, sceneProject],
  );
  const overflowSceneSvg = useMemo(
    () => createOverflowSceneMarkup(sceneSvg),
    [sceneSvg],
  );
  const selectedTransformLayers = getSelectedTransformLayers(project.layers, selection);
  const selectedHandleLayer = selectedTransformLayers[0];
  const selectedHandleTransforms = selectedTransformLayers.map((layer) => (
    transformPreview?.transforms[layer.id] ?? layer.transform
  ));
  const selectedHandleCenter = selectedHandleTransforms.length > 0
    ? getTransformSelectionCenter(selectedHandleTransforms)
    : null;
  const selectedTextPathLayer = selectedTransformLayers.length === 1 && selectedHandleLayer?.type === 'text'
    ? sceneProject.layers.find((layer): layer is TextLayer => layer.id === selectedHandleLayer.id && layer.type === 'text')
    : undefined;
  const selectedTextPathOverlay = selectedTextPathLayer && selectedHandleTransforms[0]
    ? getTextPathOverlay(selectedTextPathLayer, selectedHandleTransforms[0])
    : null;
  const isStraightTextSelection = selectedTransformLayers.length === 1
    && selectedHandleLayer?.type === 'text'
    && selectedTextPathLayer?.path.mode === 'none';
  const isCurveOrRingTextSelection =
    selectedTextPathLayer?.path.mode === 'curve' || selectedTextPathLayer?.path.mode === 'ring';
  const overlayLayers = getSelectedOverlayLayers(sceneProject.layers, selection);
  const inlineTextLayer = inlineTextEdit
    ? project.layers.find((layer): layer is TextLayer => layer.id === inlineTextEdit.layerId && layer.type === 'text')
    : undefined;
  const overlayLayerKey = overlayLayers.map((layer) => layer.id).join(',');
  const fallbackSelectionBounds = overlayLayers.length > 0
    ? getTransformedSelectionBounds(overlayLayers.map((layer) => layer.transform))
    : null;
  const [measuredSelectionBounds, setMeasuredSelectionBounds] = useState<SceneBounds | null>(null);
  const selectionBounds = measuredSelectionBounds ?? fallbackSelectionBounds;
  const handleSelectionBounds = selectionBounds && textBoxWidthPreview
    ? selectionBoundsWithBoxWidth(selectionBounds, textBoxWidthPreview.boxWidth)
    : selectionBounds;

  useEffect(() => {
    if (!inlineTextEdit || inlineTextLayer) return;
    const resetTimer = window.setTimeout(() => {
      setInlineTextEdit(null);
      setInlineTextError(null);
    }, 0);
    return () => window.clearTimeout(resetTimer);
  }, [inlineTextEdit, inlineTextLayer]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const overlayLayerIds = overlayLayerKey === '' ? [] : overlayLayerKey.split(',');
    if (!canvas || overlayLayerIds.length === 0) {
      if (measuredSelectionBounds !== null) {
        const resetTimer = window.setTimeout(() => setMeasuredSelectionBounds(null), 0);
        return () => window.clearTimeout(resetTimer);
      }
      return;
    }
    const layerRects = overlayLayerIds.map((layerId) => readLayerClientRect(canvas, layerId));
    const nextBounds = sceneBoundsFromClientRects(canvas.getBoundingClientRect(), layerRects);
    setMeasuredSelectionBounds((current) => sceneBoundsEqual(current, nextBounds) ? current : nextBounds);
  }, [measuredSelectionBounds, overlayLayerKey, sceneSvg]);

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

  const beginTextPathInteraction = useCallback((
    event: PointerEvent<HTMLButtonElement>,
    kind: CanvasTextPathHandleKind,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || selectedTransformLayers.length !== 1 || !selectedHandleLayer || selectedHandleLayer.type !== 'text' || selectedHandleLayer.locked) return;
    assertTextPathHandleKindMatchesPath(kind, selectedHandleLayer.path);
    toTextPathMeetBoxScenePoint(canvasRef.current, event);
    textPathInteractionRef.current = {
      pointerId: getPointerId(event),
      layerId: selectedHandleLayer.id,
      kind,
      startPath: cloneTextPath(selectedHandleLayer.path),
      startTransform: cloneTransform(selectedHandleLayer.transform),
    };
    setTextPathPreview({ layerId: selectedHandleLayer.id, path: cloneTextPath(selectedHandleLayer.path) });
    capturePointer(canvasRef.current, getPointerId(event));
    canvasRef.current?.focus();
  }, [disabled, selectedHandleLayer, selectedTransformLayers.length]);

  const beginTextBoxWidthInteraction = useCallback((
    event: PointerEvent<HTMLButtonElement>,
    side: CanvasTextBoxWidthHandleSide,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || selectedTransformLayers.length !== 1 || !selectedHandleLayer || selectedHandleLayer.type !== 'text' || selectedHandleLayer.locked) return;
    if (selectedHandleLayer.path.mode !== 'none') {
      throw new Error(`Text box width handle does not match path mode: ${selectedHandleLayer.path.mode}`);
    }
    const startBoxWidth = gestureStartTextBoxWidth(selectedHandleLayer);
    textBoxWidthInteractionRef.current = {
      pointerId: getPointerId(event),
      layerId: selectedHandleLayer.id,
      side,
      startBoxWidth,
      startPoint: toScenePoint(event),
    };
    setTextBoxWidthPreview({ layerId: selectedHandleLayer.id, boxWidth: startBoxWidth });
    capturePointer(canvasRef.current, getPointerId(event));
    canvasRef.current?.focus();
  }, [disabled, selectedHandleLayer, selectedTransformLayers.length, toScenePoint]);

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

  const handleDoubleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const layerId = getLayerIdFromTarget(event.target);
    if (!layerId) return;
    const layer = project.layers.find((candidate): candidate is TextLayer => candidate.id === layerId && candidate.type === 'text');
    if (!layer || layer.locked || layer.path.mode !== 'none') return;
    setSelection([layer.id]);
    setInlineTextError(null);
    setInlineTextEdit({ layerId: layer.id, text: layer.text });
    event.preventDefault();
    event.stopPropagation();
  }, [disabled, project.layers, setSelection]);

  const addTextCardAtScenePoint = useCallback((kind: TextCreationCardKind, scenePoint: ScenePoint) => {
    const result = dispatch(createTextCreationCommand(kind, copy.panels.textFeature.cards[kind].defaultText, {
      x: scenePoint.x - SCENE_WIDTH / 2,
      y: kind === 'text'
        ? scenePoint.y - STRAIGHT_TEXT_SVG_BASELINE_Y
        : scenePoint.y - SCENE_HEIGHT / 2,
      scale: 1,
      rotation: 0,
    }));
    if (!result.createdLayerId) throw new Error(`Unable to select dropped ${kind} text layer`);
    setSelection([result.createdLayerId]);
  }, [copy.panels.textFeature.cards, dispatch, setSelection]);

  const handleCanvasDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer || !Array.from(event.dataTransfer.types).includes(TEXT_CREATION_DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleCanvasDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer) return;
    const kind = event.dataTransfer.getData(TEXT_CREATION_DRAG_MIME);
    if (!isTextCreationCardKind(kind)) return;
    event.preventDefault();
    if (disabled) return;
    addTextCardAtScenePoint(kind, toScenePoint(event));
  }, [addTextCardAtScenePoint, disabled, toScenePoint]);

  const commitInlineTextEdit = useCallback((text: string) => {
    if (!inlineTextEdit) return;
    const targetLayer = project.layers.find((layer): layer is TextLayer => layer.id === inlineTextEdit.layerId && layer.type === 'text');
    if (!targetLayer || targetLayer.locked) {
      setInlineTextEdit(null);
      setInlineTextError(copy.panels.commandFailed(`Text layer is unavailable: ${inlineTextEdit.layerId}`));
      return;
    }
    try {
      assertInlineTextValue(text);
      dispatch({ type: 'update-layer', layerId: inlineTextEdit.layerId, patch: { text } });
      setInlineTextEdit(null);
      setInlineTextError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setInlineTextError(copy.panels.commandFailed(message));
    }
  }, [copy.panels, dispatch, inlineTextEdit, project.layers]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drawingInteraction = drawingInteractionRef.current;
    if (drawingInteraction?.pointerId === getPointerId(event)) {
      const nextPoints = appendFreehandPoint(drawingInteraction.points, toScenePoint(event));
      drawingInteractionRef.current = { ...drawingInteraction, points: nextPoints };
      setDrawingPreview(nextPoints);
      return;
    }
    const textPathInteraction = textPathInteractionRef.current;
    if (textPathInteraction?.pointerId === getPointerId(event)) {
      const nextPath = getNextTextPathInteractionPath(
        textPathInteraction,
        toTextPathMeetBoxScenePoint(canvasRef.current, event),
      );
      setTextPathPreview({ layerId: textPathInteraction.layerId, path: nextPath });
      return;
    }
    const textBoxWidthInteraction = textBoxWidthInteractionRef.current;
    if (textBoxWidthInteraction?.pointerId === getPointerId(event)) {
      const nextBoxWidth = getNextTextBoxWidth(textBoxWidthInteraction, toScenePoint(event));
      setTextBoxWidthPreview({ layerId: textBoxWidthInteraction.layerId, boxWidth: nextBoxWidth });
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
    const pointerId = getPointerId(event);
    const drawingInteraction = drawingInteractionRef.current;
    if (drawingInteraction?.pointerId === pointerId) {
      let nextPoints: FreehandPoint[] | undefined;
      try {
        nextPoints = appendFreehandPoint(drawingInteraction.points, toScenePoint(event));
      } finally {
        drawingInteractionRef.current = null;
        releasePointer(canvasRef.current, drawingInteraction.pointerId);
        setDrawingPreview(null);
      }
      if (nextPoints && nextPoints.length >= 2) {
        const result = dispatch({
          type: 'add-drawing-layer', path: createFreehandPath(nextPoints),
          color: drawingSettings.color, strokeWidth: drawingSettings.strokeWidth, opacity: drawingSettings.opacity,
        });
        if (result.createdLayerId) setSelection([result.createdLayerId]);
      }
      return;
    }
    const textPathInteraction = textPathInteractionRef.current;
    if (textPathInteraction?.pointerId === pointerId) {
      let nextPath: TextPathPlacement | undefined;
      try {
        nextPath = getNextTextPathInteractionPath(
          textPathInteraction,
          toTextPathMeetBoxScenePoint(canvasRef.current, event),
        );
      } finally {
        textPathInteractionRef.current = null;
        releasePointer(canvasRef.current, textPathInteraction.pointerId);
        setTextPathPreview(null);
      }
      if (nextPath && !textPathsMatch(textPathInteraction.startPath, nextPath)) {
        dispatch({ type: 'update-layer', layerId: textPathInteraction.layerId, patch: { path: nextPath } });
      }
      return;
    }
    const textBoxWidthInteraction = textBoxWidthInteractionRef.current;
    if (textBoxWidthInteraction?.pointerId === pointerId) {
      let nextBoxWidth: number | undefined;
      try {
        nextBoxWidth = getNextTextBoxWidth(textBoxWidthInteraction, toScenePoint(event));
      } finally {
        textBoxWidthInteractionRef.current = null;
        releasePointer(canvasRef.current, textBoxWidthInteraction.pointerId);
        setTextBoxWidthPreview(null);
      }
      if (nextBoxWidth !== undefined && nextBoxWidth !== textBoxWidthInteraction.startBoxWidth) {
        dispatch({ type: 'update-layer', layerId: textBoxWidthInteraction.layerId, patch: { boxWidth: nextBoxWidth } });
      }
      return;
    }
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== pointerId) return;
    let nextTransforms: Record<string, CanvasTransform> | undefined;
    try {
      nextTransforms = getNextInteractionPreview(
        interaction,
        toScenePoint(event),
        snappingEnabled,
        event.altKey,
        getCanvasClientSize(canvasRef.current),
      ).transforms;
    } finally {
      interactionRef.current = null;
      releasePointer(canvasRef.current, interaction.pointerId);
      setTransformPreview(null);
      setSnapGuides([]);
    }
    if (!nextTransforms) return;
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
  }, [dispatch, drawingSettings.color, drawingSettings.opacity, drawingSettings.strokeWidth, setSelection, snappingEnabled, toScenePoint]);

  const cancelInteraction = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drawingInteraction = drawingInteractionRef.current;
    if (drawingInteraction?.pointerId === getPointerId(event)) {
      drawingInteractionRef.current = null;
      releasePointer(canvasRef.current, drawingInteraction.pointerId);
      setDrawingPreview(null);
      setSnapGuides([]);
      return;
    }
    const textPathInteraction = textPathInteractionRef.current;
    if (textPathInteraction?.pointerId === getPointerId(event)) {
      textPathInteractionRef.current = null;
      releasePointer(canvasRef.current, textPathInteraction.pointerId);
      setTextPathPreview(null);
      return;
    }
    const textBoxWidthInteraction = textBoxWidthInteractionRef.current;
    if (textBoxWidthInteraction?.pointerId === getPointerId(event)) {
      textBoxWidthInteractionRef.current = null;
      releasePointer(canvasRef.current, textBoxWidthInteraction.pointerId);
      setTextBoxWidthPreview(null);
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
    const textPathInteraction = textPathInteractionRef.current;
    if (textPathInteraction) {
      textPathInteractionRef.current = null;
      releasePointer(canvasRef.current, textPathInteraction.pointerId);
      setTextPathPreview(null);
      return true;
    }
    const textBoxWidthInteraction = textBoxWidthInteractionRef.current;
    if (textBoxWidthInteraction) {
      textBoxWidthInteractionRef.current = null;
      releasePointer(canvasRef.current, textBoxWidthInteraction.pointerId);
      setTextBoxWidthPreview(null);
      return true;
    }
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
      onDragOver={handleCanvasDragOver}
      onDrop={handleCanvasDrop}
      onKeyDown={handleCanvasKeyDown}
      onDoubleClick={handleDoubleClick}
      onPointerCancel={cancelInteraction}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={completeInteraction}
      role="application"
      style={{ '--coat-canvas-aspect-ratio': `${project.canvas.width} / ${project.canvas.height}` } as React.CSSProperties}
      tabIndex={disabled ? -1 : 0}
    >
      <div
        aria-hidden="true"
        className="coat-canvas-overflow-fade pointer-events-none absolute inset-0 overflow-visible"
        data-coat-scene-pass="overflow"
        dangerouslySetInnerHTML={{ __html: overflowSceneSvg }}
        style={{ opacity: OFF_CANVAS_OVERFLOW_OPACITY }}
      />
      <div
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        data-coat-scene-pass="artboard"
        dangerouslySetInnerHTML={{ __html: sceneSvg }}
      />
      {drawingPreview && drawingPreview.length >= 2 ? <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 110">
        <path d={createFreehandPath(drawingPreview)} fill="none" opacity={drawingSettings.opacity} stroke={drawingSettings.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={drawingSettings.strokeWidth} />
      </svg> : null}
      {snapGuides.length > 0 ? <CanvasSnapGuides guides={snapGuides} /> : null}
      {handleSelectionBounds ? (
        <CanvasSelectionHandles
          locale={locale}
          selectionBounds={handleSelectionBounds}
          showResizeHandles={selectedHandleLayer !== undefined && selectedHandleCenter !== null && !isStraightTextSelection && !isCurveOrRingTextSelection}
          showRotateHandle={selectedHandleLayer !== undefined && selectedHandleCenter !== null && !isCurveOrRingTextSelection}
          showTextBoxWidthHandles={isStraightTextSelection}
          showBoundingRect={!isCurveOrRingTextSelection}
          showSelectionToolbar={!isCurveOrRingTextSelection}
          onTextBoxWidthPointerDown={beginTextBoxWidthInteraction}
          onResizeKeyDown={handleHandleKeyDown({ scale: 0.1 })}
          onResizePointerDown={beginHandleInteraction('resize')}
          onRotateKeyDown={handleHandleKeyDown({ rotation: 15 })}
          onRotatePointerDown={beginHandleInteraction('rotate')}
        />
      ) : null}
      {isCurveOrRingTextSelection ? (
        <CanvasSelectionToolbar locale={locale} placement="artboard-bottom" />
      ) : null}
      {selectedTextPathOverlay ? (
        <CanvasTextPathOverlay
          locale={locale}
          overlay={selectedTextPathOverlay}
          onPointerDown={beginTextPathInteraction}
        />
      ) : null}
      {inlineTextEdit && inlineTextLayer ? <InlineTextEditor
        locale={locale}
        textLayer={inlineTextLayer}
        text={inlineTextEdit.text}
        error={inlineTextError}
        onCancel={() => { setInlineTextEdit(null); setInlineTextError(null); }}
        onCommit={commitInlineTextEdit}
      /> : null}
      <p className="sr-only" id="coat-canvas-help">
        {copy.canvas.help}
      </p>
    </div>
  );
}

function createOverflowSceneMarkup(sceneSvg: string): string {
  return hideOverflowSceneSvgFromAssistiveTech(
    withVisibleSceneSvgOverflow(prefixCoatSceneSvgIds(sceneSvg, OVERFLOW_SCENE_ID_PREFIX)),
  );
}

function hideOverflowSceneSvgFromAssistiveTech(svgMarkup: string): string {
  const withoutRole = svgMarkup.replace(' role="img"', '');
  const withoutLabel = withoutRole.replace(/ aria-label="[^"]*"/, '');
  if (withoutLabel.includes(' role="img"') || withoutLabel.includes(' aria-label="')) {
    throw new Error(`Overflow scene SVG still exposes accessibility attributes: ${withoutLabel.slice(0, 120)}`);
  }
  if (!withoutLabel.startsWith('<svg overflow="visible"')) {
    throw new Error(`Overflow scene SVG is missing visible overflow: ${withoutLabel.slice(0, 80)}`);
  }
  return withoutLabel.replace(/^<svg overflow="visible"/, '<svg overflow="visible" aria-hidden="true"');
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

function InlineTextEditor({ locale, text, textLayer, error, onCancel, onCommit }: { locale: CoatLocale; text: string; textLayer?: TextLayer; error: string | null; onCancel: () => void; onCommit: (text: string) => void }) {
  const copy = getCoatWorkbenchCopy(locale).panels.textFeature.inline;
  const [draftText, setDraftText] = useState(text);
  const left = 50 + (textLayer?.transform.x ?? 0);
  const top = ((102 + (textLayer?.transform.y ?? 0)) / SCENE_HEIGHT) * 100;
  return <div className="absolute z-40" style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -100%)' }}>
    <input
      aria-label={copy.editor}
      aria-invalid={error ? true : undefined}
      autoFocus
      className="min-w-[12rem] rounded border-2 border-[color:var(--coat-accent)] bg-white px-2 py-1 text-center text-base text-black shadow-lg outline-none"
      maxLength={COAT_PROJECT_LIMITS.maxTextLength}
      value={draftText}
      onBlur={() => onCommit(draftText)}
      onChange={(event) => setDraftText(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onCommit(draftText);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          onCancel();
        }
      }}
    />
    {error ? <p role="alert" aria-live="polite" className="mt-1 max-w-[18rem] rounded bg-white px-2 py-1 text-xs text-red-700 shadow">{error}</p> : null}
  </div>;
}

function assertInlineTextValue(text: string): void {
  if (text.trim().length === 0) throw new Error(`Invalid text layer text: ${JSON.stringify(text)}`);
  if (text.length > COAT_PROJECT_LIMITS.maxTextLength) {
    throw new Error(`Invalid text layer length: ${text.length}; limit is ${COAT_PROJECT_LIMITS.maxTextLength}`);
  }
}

/** Whole-canvas linear mapping for layer drag, resize, rotate, drawing, and text drop. */
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

/** Curve/ring handle pointers map through the 100×110 meet box, not the stretched artboard. */
export function toTextPathMeetBoxScenePoint(
  canvas: HTMLElement | null,
  event: Pick<PointerEvent<HTMLElement>, 'clientX' | 'clientY'>,
): ScenePoint {
  if (!canvas) {
    throw new Error('Canvas element is unavailable for text path pointer conversion');
  }
  const meetBox = canvas.querySelector('[data-text-path-meet-box]');
  if (!(meetBox instanceof HTMLElement)) {
    throw new Error(`Text path meet box is missing: ${String(meetBox)}`);
  }
  const bounds = meetBox.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) {
    throw new Error(`Invalid text path meet box bounds: ${bounds.width}x${bounds.height}`);
  }
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * SELECTION_SCENE_WIDTH,
    y: ((event.clientY - bounds.top) / bounds.height) * SELECTION_SCENE_HEIGHT,
  };
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

function withPreviewTextPath(
  project: ReturnType<typeof useCoatProjectStore.getState>['project'],
  preview: TextPathPreview,
) {
  return {
    ...project,
    layers: project.layers.map((layer) => (
      layer.id === preview.layerId && layer.type === 'text'
        ? { ...layer, path: cloneTextPath(preview.path) }
        : layer
    )),
  };
}

function withPreviewTextBoxWidth(
  project: ReturnType<typeof useCoatProjectStore.getState>['project'],
  preview: TextBoxWidthPreview,
) {
  return {
    ...project,
    layers: project.layers.map((layer) => (
      layer.id === preview.layerId && layer.type === 'text'
        ? { ...layer, boxWidth: preview.boxWidth }
        : layer
    )),
  };
}

function selectionBoundsWithBoxWidth(bounds: SceneBounds, boxWidth: number): SceneBounds {
  assertTextBoxWidthValue(boxWidth);
  const centerX = bounds.x + bounds.width / 2;
  return {
    ...bounds,
    x: centerX - boxWidth / 2,
    width: boxWidth,
  };
}

function getTextPathOverlay(layer: TextLayer, transform: CanvasTransform): CanvasTextPathGuide | null {
  if (layer.path.mode === 'curve') {
    const path = requireEditableCurvePath(layer.path, 'curve-control');
    const start = applyTextPathTransform({ x: path.startX, y: path.startY }, transform);
    const control = applyTextPathTransform({ x: path.controlX, y: path.controlY }, transform);
    const end = applyTextPathTransform({ x: path.endX, y: path.endY }, transform);
    return {
      mode: 'curve',
      handles: [
        { kind: 'curve-start', point: start },
        { kind: 'curve-control', point: control },
        { kind: 'curve-end', point: end },
      ],
      curve: { start, control, end },
    };
  }
  if (layer.path.mode === 'ring') {
    const path = requireEditableRingPath(layer.path, 'ring-radius');
    const center = applyTextPathTransform({ x: 50, y: 50 }, transform);
    const radiusPoint = applyTextPathTransform({ x: 50, y: 50 - path.radius }, transform);
    return {
      mode: 'ring',
      handles: [{ kind: 'ring-radius', point: radiusPoint }],
      ring: {
        center,
        radius: Math.hypot(radiusPoint.x - center.x, radiusPoint.y - center.y),
      },
    };
  }
  return null;
}

function assertTextPathHandleKindMatchesPath(kind: CanvasTextPathHandleKind, path: TextPathPlacement): void {
  const isCurveHandle = kind === 'curve-start' || kind === 'curve-control' || kind === 'curve-end';
  if (isCurveHandle && path.mode !== 'curve') {
    throw new Error(`Text path handle ${kind} does not match path mode: ${path.mode}`);
  }
  if (kind === 'ring-radius' && path.mode !== 'ring') {
    throw new Error(`Text path handle ${kind} does not match path mode: ${path.mode}`);
  }
}

export function getNextTextPathInteractionPath(
  interaction: TextPathInteraction,
  scenePoint: ScenePoint,
): TextPathPlacement {
  switch (interaction.kind) {
    case 'curve-start':
      return getNextCurveStartPath(interaction, scenePoint);
    case 'curve-control':
      return getNextCurveControlPath(interaction, scenePoint);
    case 'curve-end':
      return getNextCurveEndPath(interaction, scenePoint);
    case 'ring-radius':
      return getNextRingRadiusPath(interaction, scenePoint);
    default: {
      const unexpectedKind: never = interaction.kind;
      throw new Error(`Unsupported text path handle: ${String(unexpectedKind)}`);
    }
  }
}

function getNextCurveStartPath(interaction: TextPathInteraction, scenePoint: ScenePoint): TextPathPlacement {
  const startPath = requireEditableCurvePath(interaction.startPath, interaction.kind);
  const localPoint = invertTextPathTransform(scenePoint, interaction.startTransform);
  return {
    ...startPath,
    startX: saturateTextPathCoordinate(localPoint.x, 'start x', 0, SCENE_WIDTH),
    startY: saturateTextPathCoordinate(localPoint.y, 'start y', 0, SCENE_HEIGHT),
  };
}

function getNextCurveControlPath(interaction: TextPathInteraction, scenePoint: ScenePoint): TextPathPlacement {
  const startPath = requireEditableCurvePath(interaction.startPath, interaction.kind);
  const localPoint = invertTextPathTransform(scenePoint, interaction.startTransform);
  return {
    ...startPath,
    controlX: saturateTextPathCoordinate(localPoint.x, 'control x', 0, SCENE_WIDTH),
    controlY: saturateTextPathCoordinate(localPoint.y, 'control y', 0, SCENE_HEIGHT),
  };
}

function getNextCurveEndPath(interaction: TextPathInteraction, scenePoint: ScenePoint): TextPathPlacement {
  const startPath = requireEditableCurvePath(interaction.startPath, interaction.kind);
  const localPoint = invertTextPathTransform(scenePoint, interaction.startTransform);
  return {
    ...startPath,
    endX: saturateTextPathCoordinate(localPoint.x, 'end x', 0, SCENE_WIDTH),
    endY: saturateTextPathCoordinate(localPoint.y, 'end y', 0, SCENE_HEIGHT),
  };
}

function getNextRingRadiusPath(interaction: TextPathInteraction, scenePoint: ScenePoint): TextPathPlacement {
  const startPath = requireEditableRingPath(interaction.startPath, interaction.kind);
  const localPoint = invertTextPathTransform(scenePoint, interaction.startTransform);
  const radius = Math.hypot(localPoint.x - 50, localPoint.y - 50);
  return { ...startPath, radius: saturateTextPathRadius(radius) };
}

export function getNextTextBoxWidth(interaction: TextBoxWidthInteraction, scenePoint: ScenePoint): number {
  const deltaX = scenePoint.x - interaction.startPoint.x;
  const signedDelta = interaction.side === 'right' ? deltaX : -deltaX;
  return saturateTextBoxWidthValue(interaction.startBoxWidth + signedDelta);
}

interface EditableCurvePath {
  mode: 'curve';
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
}

interface EditableRingPath {
  mode: 'ring';
  radius: number;
  facing: TextPathFacing;
  layout: TextPathLayout;
  spacing: TextPathSpacing;
}

function requireEditableCurvePath(path: TextPathPlacement, handleKind: string): EditableCurvePath {
  if (path.mode !== 'curve') {
    throw new Error(`Text path handle ${handleKind} does not match path mode: ${path.mode}`);
  }
  if (!hasEditableCurveCoordinates(path)) {
    throw new Error(`Text path is missing curve coordinates for handle ${handleKind}: ${JSON.stringify(path)}`);
  }
  return path;
}

function hasEditableCurveCoordinates(path: TextPathPlacement): path is EditableCurvePath {
  return path.mode === 'curve'
    && 'startX' in path && typeof path.startX === 'number'
    && 'startY' in path && typeof path.startY === 'number'
    && 'controlX' in path && typeof path.controlX === 'number'
    && 'controlY' in path && typeof path.controlY === 'number'
    && 'endX' in path && typeof path.endX === 'number'
    && 'endY' in path && typeof path.endY === 'number';
}

function isEditableRingPath(path: TextPathPlacement): path is EditableRingPath {
  return path.mode === 'ring'
    && typeof path.radius === 'number'
    && Number.isFinite(path.radius)
    && 'facing' in path
    && (path.facing === 'in' || path.facing === 'out')
    && 'layout' in path
    && (path.layout === 'full' || path.layout === 'arc')
    && 'spacing' in path
    && (path.spacing === 'natural' || path.spacing === 'even');
}

function requireEditableRingPath(path: TextPathPlacement, handleKind: string): EditableRingPath {
  if (path.mode !== 'ring') {
    throw new Error(`Text path handle ${handleKind} does not match path mode: ${path.mode}`);
  }
  if (!isEditableRingPath(path)) {
    throw new Error(`Text path is missing ring placement for handle ${handleKind}: ${JSON.stringify(path)}`);
  }
  return path;
}

function saturateTextPathCoordinate(value: number, label: string, minimum: number, maximum: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid text path ${label}: ${String(value)}; expected ${minimum}-${maximum}`);
  }
  return Math.min(maximum, Math.max(minimum, value));
}

function saturateTextPathRadius(radius: number): number {
  if (typeof radius !== 'number' || !Number.isFinite(radius)) {
    throw new Error(`Invalid text path radius: ${String(radius)}; expected ${TEXT_PATH_RADIUS_MIN}-${TEXT_PATH_RADIUS_MAX}`);
  }
  return Math.min(TEXT_PATH_RADIUS_MAX, Math.max(TEXT_PATH_RADIUS_MIN, radius));
}

function saturateTextBoxWidthValue(boxWidth: number): number {
  if (typeof boxWidth !== 'number' || !Number.isFinite(boxWidth)) {
    throw new Error(`Invalid text box width: ${String(boxWidth)}; expected ${TEXT_BOX_WIDTH_MIN}-${TEXT_BOX_WIDTH_MAX} scene units`);
  }
  return Math.min(TEXT_BOX_WIDTH_MAX, Math.max(TEXT_BOX_WIDTH_MIN, boxWidth));
}

function assertTextBoxWidthValue(boxWidth: number): number {
  if (typeof boxWidth !== 'number' || !Number.isFinite(boxWidth) || boxWidth < TEXT_BOX_WIDTH_MIN || boxWidth > TEXT_BOX_WIDTH_MAX) {
    throw new Error(`Invalid text box width: ${String(boxWidth)}; expected ${TEXT_BOX_WIDTH_MIN}-${TEXT_BOX_WIDTH_MAX} scene units`);
  }
  return boxWidth;
}

function gestureStartTextBoxWidth(layer: TextLayer): number {
  if (layer.boxWidth !== undefined) {
    return saturateTextBoxWidthValue(layer.boxWidth);
  }
  try {
    return defaultStraightTextBoxWidth(layer.text, layer.fontSize);
  } catch (caught) {
    if (!(caught instanceof Error)) throw caught;
    const match = /^Default straight text box width is (-?\d+(?:\.\d+)?) for text /.exec(caught.message);
    if (!match) throw caught;
    return saturateTextBoxWidthValue(Number(match[1]));
  }
}

function applyTextPathTransform(point: ScenePoint, transform: CanvasTransform): ScenePoint {
  const horizontalScale = (transform.scaleX ?? transform.scale) * (transform.flipHorizontal ? -1 : 1);
  const verticalScale = (transform.scaleY ?? transform.scale) * (transform.flipVertical ? -1 : 1);
  const scaledX = SCENE_WIDTH / 2 + (point.x - SCENE_WIDTH / 2) * horizontalScale;
  const scaledY = SCENE_HEIGHT / 2 + (point.y - SCENE_HEIGHT / 2) * verticalScale;
  const radians = transform.rotation * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return {
    x: SCENE_WIDTH / 2 + (scaledX - SCENE_WIDTH / 2) * cosine - (scaledY - SCENE_HEIGHT / 2) * sine + transform.x,
    y: SCENE_HEIGHT / 2 + (scaledX - SCENE_WIDTH / 2) * sine + (scaledY - SCENE_HEIGHT / 2) * cosine + transform.y,
  };
}

function invertTextPathTransform(point: ScenePoint, transform: CanvasTransform): ScenePoint {
  const horizontalScale = (transform.scaleX ?? transform.scale) * (transform.flipHorizontal ? -1 : 1);
  const verticalScale = (transform.scaleY ?? transform.scale) * (transform.flipVertical ? -1 : 1);
  const translatedX = point.x - transform.x - SCENE_WIDTH / 2;
  const translatedY = point.y - transform.y - SCENE_HEIGHT / 2;
  const radians = transform.rotation * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const unrotatedX = translatedX * cosine + translatedY * sine;
  const unrotatedY = -translatedX * sine + translatedY * cosine;
  return {
    x: SCENE_WIDTH / 2 + unrotatedX / horizontalScale,
    y: SCENE_HEIGHT / 2 + unrotatedY / verticalScale,
  };
}

function cloneTextPath(path: TextPathPlacement): TextPathPlacement {
  return { ...path };
}

function textPathsMatch(left: TextPathPlacement, right: TextPathPlacement): boolean {
  if (left.mode !== right.mode) return false;
  if (left.mode === 'none' || right.mode === 'none') return true;
  if (left.mode === 'motto' && right.mode === 'motto') return left.curve === right.curve;
  if (left.mode === 'curve' && right.mode === 'curve') {
    if (!hasEditableCurveCoordinates(left) || !hasEditableCurveCoordinates(right)) {
      throw new Error(`Cannot compare incomplete curve paths: ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
    }
    return left.startX === right.startX
      && left.startY === right.startY
      && left.controlX === right.controlX
      && left.controlY === right.controlY
      && left.endX === right.endX
      && left.endY === right.endY;
  }
  if (left.mode === 'ring' && right.mode === 'ring') {
    if (!isEditableRingPath(left) || !isEditableRingPath(right)) {
      throw new Error(`Cannot compare incomplete ring paths: ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
    }
    return left.radius === right.radius
      && left.facing === right.facing
      && left.layout === right.layout
      && left.spacing === right.spacing;
  }
  return false;
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
