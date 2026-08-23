'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import type { CoatLayer } from '@/lib/coat-of-arms/types';
import { scaleCanvasTransform, transformCanvasSelection } from '@/lib/coat-of-arms/transform';

const SMALL_NUDGE = 1;
const LARGE_NUDGE = 10;

export interface UseCoatKeyboardShortcutsOptions {
  disabled?: boolean;
  initialSelection?: string[];
}

export interface CoatKeyboardShortcuts {
  selection: string[];
  setSelection: (layerIds: string[]) => void;
  selectRelativeLayer: (direction: 1 | -1) => boolean;
  adjustSelectedTransform: (adjustment: TransformAdjustment) => boolean;
}

export interface TransformAdjustment {
  scale?: number;
  rotation?: number;
}

/**
 * Shares ephemeral editor selection and converts editor keystrokes into one
 * validated store command. Selection stays outside CoatProject, so it cannot
 * leak into saved documents or scene exports.
 */
export function useCoatKeyboardShortcuts(
  { disabled = false, initialSelection = [] }: UseCoatKeyboardShortcutsOptions = {},
): CoatKeyboardShortcuts {
  const selection = useCoatProjectStore((state) => state.selectedLayerIds);
  const copiedLayerIdsRef = useRef<string[]>([]);
  const initialSelectionAppliedRef = useRef(false);

  const setSelection = useCallback((layerIds: string[]) => {
    useCoatProjectStore.getState().setSelectedLayerIds(layerIds);
  }, []);

  useEffect(() => {
    if (initialSelectionAppliedRef.current || initialSelection.length === 0) return;
    initialSelectionAppliedRef.current = true;
    setSelection(initialSelection);
  }, [initialSelection, setSelection]);

  const selectRelativeLayer = useCallback((direction: 1 | -1): boolean => {
    const store = useCoatProjectStore.getState();
    const selectableLayers = store.project.layers
      .filter((layer) => !layer.locked && hasTransform(layer));
    if (selectableLayers.length === 0) return false;
    const selectedLayerId = store.selectedLayerIds.length === 1 ? store.selectedLayerIds[0] : null;
    const selectedIndex = selectableLayers.findIndex((layer) => layer.id === selectedLayerId);
    const nextIndex = selectedIndex === -1
      ? direction === 1 ? 0 : selectableLayers.length - 1
      : (selectedIndex + direction + selectableLayers.length) % selectableLayers.length;
    setSelection([selectableLayers[nextIndex]!.id]);
    return true;
  }, [setSelection]);

  const adjustSelectedTransform = useCallback((adjustment: TransformAdjustment): boolean => {
    const store = useCoatProjectStore.getState();
    const selectedLayers = getUnlockedSelectedLayers(store.project.layers, store.selectedLayerIds);
    const transformableLayers = selectedLayers.filter(hasTransform);
    if (transformableLayers.length === 0 || transformableLayers.length !== selectedLayers.length) return false;
    const referenceTransform = transformableLayers[0]!.transform;
    const scaleFactor = adjustment.scale === undefined
      ? undefined
      : scaleCanvasTransform(referenceTransform, adjustment.scale).scale / referenceTransform.scale;
    const nextTransforms = transformCanvasSelection(
      transformableLayers.map((layer) => layer.transform),
      { scaleFactor, rotationDegrees: adjustment.rotation },
    );
    const updates = transformableLayers.flatMap((selectedLayer, index) => {
      const nextTransform = nextTransforms[index]!;
      return transformsMatch(selectedLayer.transform, nextTransform)
        ? []
        : [{ layerId: selectedLayer.id, patch: { transform: nextTransform } }];
    });
    if (updates.length === 0) return false;
    if (updates.length === 1) store.dispatch({ type: 'update-layer', ...updates[0]! });
    else store.dispatch({ type: 'update-layers', updates });
    return true;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled || event.defaultPrevented || isEditableTarget(event.target) || isDialogTarget(event.target) || isEditorOverlayTarget(event.target)) return;

      const store = useCoatProjectStore.getState();
      if (matchesShortcut(event, 'z')) {
        event.preventDefault();
        if (event.shiftKey) store.redo();
        else store.undo();
        return;
      }

      const selectedLayers = getUnlockedSelectedLayers(store.project.layers, store.selectedLayerIds);
      if (selectedLayers.length === 0) return;

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        if (!canRemoveSelectedLayers(store.project.layers, selectedLayers)) return;
        store.dispatch({ type: 'remove-layers', layerIds: selectedLayers.map((layer) => layer.id) });
        setSelection([]);
        return;
      }

      const nudge = getNudge(event);
      if (nudge) {
        const transformableLayers = selectedLayers.filter(hasTransform);
        if (transformableLayers.length === 0) return;
        event.preventDefault();
        store.dispatch({
          type: 'update-layers',
          updates: transformableLayers.map((layer) => ({
            layerId: layer.id,
            patch: {
              transform: {
                ...layer.transform,
                x: layer.transform.x + nudge.x,
                y: layer.transform.y + nudge.y,
              },
            },
          })),
        });
        return;
      }

      if (matchesShortcut(event, 'c')) {
        event.preventDefault();
        copiedLayerIdsRef.current = selectedLayers.map((layer) => layer.id);
        return;
      }

      if (matchesShortcut(event, 'v')) {
        const copiedLayerIds = copiedLayerIdsRef.current;
        if (copiedLayerIds.length === 0) return;
        const copiedLayers = getUnlockedSelectedLayers(store.project.layers, copiedLayerIds);
        if (copiedLayers.length !== copiedLayerIds.length) return;
        event.preventDefault();
        const newLayerIds = copiedLayers.map(() => createEditorId());
        store.dispatch({
          type: 'duplicate-layers',
          sourceLayerIds: copiedLayers.map((layer) => layer.id),
          newLayerIds,
        });
        setSelection(newLayerIds);
        return;
      }

      if (matchesShortcut(event, 'g')) {
        event.preventDefault();
        if (event.shiftKey) {
          const groupId = selectedLayers[0]?.groupId;
          if (!groupId || !selectedLayers.every((layer) => layer.groupId === groupId)) return;
          store.dispatch({ type: 'ungroup-layers', groupId });
          return;
        }
        if (selectedLayers.length < 2) return;
        store.dispatch({
          type: 'group-layers',
          groupId: createEditorId(),
          layerIds: selectedLayers.map((layer) => layer.id),
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, setSelection]);

  return { selection, setSelection, selectRelativeLayer, adjustSelectedTransform };
}

function getUnlockedSelectedLayers(layers: CoatLayer[], selection: string[]): CoatLayer[] {
  if (selection.length === 0) return [];
  const selectedById = new Map(layers.map((layer) => [layer.id, layer]));
  const selectedLayers = selection.map((layerId) => selectedById.get(layerId)).filter(isLayer);
  if (selectedLayers.length !== selection.length || selectedLayers.some((layer) => layer.locked)) return [];
  return selectedLayers;
}

function canRemoveSelectedLayers(projectLayers: CoatLayer[], selectedLayers: CoatLayer[]): boolean {
  const selectedLayerIds = new Set(selectedLayers.map((layer) => layer.id));
  return projectLayers.some((layer) => layer.type === 'background' && !selectedLayerIds.has(layer.id));
}

function isLayer(layer: CoatLayer | undefined): layer is CoatLayer {
  return layer !== undefined;
}

function hasTransform(layer: CoatLayer): layer is Exclude<CoatLayer, { type: 'background' }> {
  return layer.type !== 'background';
}

function transformsMatch(left: Exclude<CoatLayer, { type: 'background' }>['transform'], right: Exclude<CoatLayer, { type: 'background' }>['transform']): boolean {
  return left.scale === right.scale
    && left.scaleX === right.scaleX
    && left.scaleY === right.scaleY
    && left.rotation === right.rotation;
}

function getNudge(event: KeyboardEvent): { x: number; y: number } | null {
  const step = event.shiftKey ? LARGE_NUDGE : SMALL_NUDGE;
  switch (event.key) {
    case 'ArrowLeft': return { x: -step, y: 0 };
    case 'ArrowRight': return { x: step, y: 0 };
    case 'ArrowUp': return { x: 0, y: -step };
    case 'ArrowDown': return { x: 0, y: step };
    default: return null;
  }
}

function matchesShortcut(event: KeyboardEvent, key: string): boolean {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return true;
  }
  return (target instanceof HTMLElement && target.isContentEditable)
    || target.closest('[contenteditable]:not([contenteditable="false"])') !== null;
}

function isDialogTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[role="dialog"]') !== null;
}

function isEditorOverlayTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-coat-editor-overlay]') !== null;
}

function createEditorId(): string {
  return createLocalCoatId();
}
