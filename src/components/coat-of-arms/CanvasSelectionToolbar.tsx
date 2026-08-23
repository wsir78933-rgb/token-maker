'use client';

import { useState, type PointerEvent, type ReactNode } from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  FlipHorizontal,
  Layers,
  Lock,
  LockOpen,
  Trash2,
} from 'lucide-react';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { LayerOrderDirection } from '@/lib/coat-of-arms/commands';
import type { CoatLayer, CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

export type SelectionToolbarPlacement = 'above-selection' | 'artboard-top' | 'artboard-bottom';

/** Floating selected-element actions. The canvas owns overlay placement. */
export function CanvasSelectionToolbar({
  locale,
  placement = 'above-selection',
}: {
  locale: CoatLocale;
  placement?: SelectionToolbarPlacement;
}) {
  const copy = getCoatWorkbenchCopy(locale);
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);
  const { error, run } = usePanelCommandError(locale);
  const [layerOrderOpen, setLayerOrderOpen] = useState(false);
  const selectedLayers = selectedLayerIds.map((layerId) => {
    const layer = project.layers.find((candidate) => candidate.id === layerId);
    if (!layer) throw new Error(`Selected layer is missing from the project: ${layerId}`);
    return layer;
  });
  const hasLockedLayer = selectedLayers.some((layer) => layer.locked);
  const canEditUnlockedLayers = selectedLayers.length > 0 && !hasLockedLayer;
  const isHidden = selectedLayers.every((layer) => !layer.visible);

  const duplicateSelected = () => {
    const newLayerIds = selectedLayerIds.map(() => createLocalCoatId());
    if (run({ type: 'duplicate-layers', sourceLayerIds: selectedLayerIds, newLayerIds })) {
      setSelectedLayerIds(newLayerIds);
    }
  };
  const flipSelectedHorizontally = () => {
    const updates = selectedLayers.flatMap((layer) => {
      if (!hasTransform(layer)) return [];
      return [{
        layerId: layer.id,
        patch: {
          transform: {
            ...layer.transform,
            flipHorizontal: !layer.transform.flipHorizontal,
          },
        },
      }];
    });
    if (updates.length === 0) {
      throw new Error(`Cannot flip selected layers without a transform: ${selectedLayerIds.join(',')}`);
    }
    run(updates.length === 1
      ? { type: 'update-layer', ...updates[0]! }
      : { type: 'update-layers', updates });
  };
  const moveSelectedLayers = (direction: LayerOrderDirection) => {
    setLayerOrderOpen(false);
    run({ type: 'move-layer-ids', direction, layerIds: selectedLayerIds });
  };
  const deleteSelected = () => {
    if (run({ type: 'remove-layers', layerIds: selectedLayerIds })) {
      setSelectedLayerIds([]);
    }
  };
  const toggleSelectedLock = () => {
    const unlockedLayerIds = selectedLayers.filter((layer) => !layer.locked).map((layer) => layer.id);
    if (unlockedLayerIds.length > 0) {
      run({ type: 'set-layer-ids-lock', layerIds: unlockedLayerIds, locked: true });
      return;
    }
    run({ type: 'set-layer-ids-lock', layerIds: selectedLayerIds, locked: false });
  };
  const toggleSelectedVisibility = () => {
    run({ type: 'set-layer-ids-visibility', layerIds: selectedLayerIds, visible: isHidden });
  };

  return (
    <div
      aria-label={copy.canvas.selectedLayerToolbar}
      className={selectionToolbarPlacementClass(placement)}
      data-coat-editor-overlay="selection-toolbar"
      role="toolbar"
      onPointerDown={stopOverlayPointer}
    >
      <div className="flex items-center gap-0.5 rounded-full bg-[#2b2b2b] px-1.5 py-1 text-white shadow-[0_8px_20px_-12px_rgba(0,0,0,0.65)]">
        <ToolbarIconButton
          disabled={!canEditUnlockedLayers}
          label={copy.canvas.duplicateSelectedElement}
          onClick={duplicateSelected}
        >
          <Copy strokeWidth={1.75} />
        </ToolbarIconButton>
        <ToolbarIconButton
          disabled={!canEditUnlockedLayers}
          label={copy.canvas.flipSelectedElementHorizontally}
          onClick={flipSelectedHorizontally}
        >
          <FlipHorizontal strokeWidth={1.75} />
        </ToolbarIconButton>
        <div className="relative">
          <ToolbarIconButton
            disabled={!canEditUnlockedLayers}
            expanded={layerOrderOpen}
            label={copy.canvas.selectedElementLayerOrder}
            onClick={() => setLayerOrderOpen((open) => !open)}
          >
            <Layers strokeWidth={1.75} />
          </ToolbarIconButton>
          {layerOrderOpen ? (
            <div className="absolute left-1/2 top-full z-40 mt-1 min-w-max -translate-x-1/2 rounded-md bg-[#2b2b2b] py-1 text-white shadow-lg" role="menu">
              {([
                ['forward', copy.panels.forward],
                ['backward', copy.panels.backward],
                ['front', copy.panels.toFront],
                ['back', copy.panels.toBack],
              ] as const).map(([direction, label]) => (
                <button
                  className="block w-full px-3 py-1.5 text-left text-xs hover:bg-white/10"
                  key={direction}
                  role="menuitem"
                  type="button"
                  onClick={() => moveSelectedLayers(direction)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <ToolbarIconButton
          disabled={!canEditUnlockedLayers}
          label={copy.canvas.deleteSelectedElement}
          onClick={deleteSelected}
        >
          <Trash2 strokeWidth={1.75} />
        </ToolbarIconButton>
        <ToolbarIconButton
          disabled={selectedLayers.length === 0}
          label={hasLockedLayer ? copy.canvas.unlockSelectedElement : copy.canvas.lockSelectedElement}
          pressed={hasLockedLayer}
          onClick={toggleSelectedLock}
        >
          {hasLockedLayer ? <Lock strokeWidth={1.75} /> : <LockOpen strokeWidth={1.75} />}
        </ToolbarIconButton>
        <ToolbarIconButton
          disabled={!canEditUnlockedLayers}
          label={isHidden ? copy.canvas.showSelectedElement : copy.canvas.hideSelectedElement}
          pressed={isHidden}
          onClick={toggleSelectedVisibility}
        >
          {isHidden ? <Eye strokeWidth={1.75} /> : <EyeOff strokeWidth={1.75} />}
        </ToolbarIconButton>
      </div>
      {error ? <p className="max-w-[14rem] rounded bg-[#2b2b2b] px-2 py-1 text-[0.7rem] text-white" role="alert">{error}</p> : null}
    </div>
  );
}

function ToolbarIconButton({
  children,
  disabled,
  expanded,
  label,
  pressed,
  onClick,
}: {
  children: ReactNode;
  disabled: boolean;
  expanded?: boolean;
  label: string;
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-expanded={expanded}
      aria-label={label}
      aria-pressed={pressed}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">{children}</span>
    </button>
  );
}

function selectionToolbarPlacementClass(placement: SelectionToolbarPlacement): string {
  if (placement === 'above-selection') {
    return 'pointer-events-auto absolute bottom-full left-1/2 z-30 mb-14 flex -translate-x-1/2 flex-col items-center gap-1';
  }
  if (placement === 'artboard-top') {
    return 'pointer-events-auto absolute left-1/2 top-2 z-20 flex -translate-x-1/2 flex-col items-center gap-1';
  }
  if (placement === 'artboard-bottom') {
    return 'pointer-events-auto absolute bottom-2 left-1/2 top-auto z-20 flex -translate-x-1/2 flex-col items-center gap-1';
  }
  throw new Error(`Unsupported selection toolbar placement: ${String(placement)}`);
}

function hasTransform(layer: CoatLayer): layer is Exclude<CoatLayer, { type: 'background' }> {
  return layer.type !== 'background';
}

function stopOverlayPointer(event: PointerEvent<HTMLDivElement>): void {
  event.stopPropagation();
}
