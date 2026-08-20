'use client';

/* Layer thumbnails reuse the same local asset/upload sources as the canvas. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, type DragEvent, type KeyboardEvent } from 'react';
import { Eye, EyeOff, GripVertical, Lock, LockOpen, Search, X } from 'lucide-react';
import { getCoatAsset } from '@/lib/coat-of-arms/assets';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLayer, CoatLocale, LocalUpload } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

function layerName(layer: CoatLayer, locale: CoatLocale, localImage: string, localDrawing: string) {
  if (layer.displayName) return layer.displayName;
  if ('assetId' in layer) {
    return getCoatAsset(layer.assetId).name[locale];
  }
  if (layer.type === 'text') return layer.text;
  if (layer.type === 'draw') return localDrawing;
  return localImage;
}

function createPanelId() {
  return createLocalCoatId();
}

/** Layer operations share selection with canvas positioning and surface rejected command constraints as an alert. */
export function LayerPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const selectedIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);
  const { error, reportError, run } = usePanelCommandError(locale);
  const [layerSearch, setLayerSearch] = useState('');
  const toggleSelected = (layerId: string, checked: boolean) => setSelectedLayerIds(
    checked ? [...selectedIds, layerId] : selectedIds.filter((id) => id !== layerId),
  );
  const selectLayerRow = (layerId: string, modifiers: { metaKey: boolean; ctrlKey: boolean }) => {
    if (modifiers.metaKey || modifiers.ctrlKey) {
      toggleSelected(layerId, !selectedIds.includes(layerId));
      return;
    }
    setSelectedLayerIds([layerId]);
  };
  const duplicateSelected = () => {
    try {
      run({ type: 'duplicate-layers', sourceLayerIds: selectedIds, newLayerIds: selectedIds.map(() => createPanelId()) });
    } catch (caught) { reportError(caught); }
  };
  const groupSelected = () => {
    try { run({ type: 'group-layers', groupId: createPanelId(), layerIds: selectedIds }); } catch (caught) { reportError(caught); }
  };
  const selectedGroupIds = [...new Set(project.layers
    .filter((layer) => selectedIds.includes(layer.id))
    .map((layer) => layer.groupId)
    .filter((groupId): groupId is string => groupId !== null))];
  const selectedGroupId = selectedGroupIds.length === 1 ? selectedGroupIds[0] : undefined;
  const selectedGroup = selectedGroupId
    ? project.groups.find((group) => group.id === selectedGroupId)
    : undefined;
  const visibleLayers = project.layers.filter((layer) => {
    const name = layerName(layer, locale, copy.localImage, copy.localDrawing);
    return matchesLayerSearch(name, layer.type, layerSearch);
  });

  const dropLayerOn = (targetLayer: CoatLayer, event: DragEvent<HTMLLIElement>) => {
    event.preventDefault();
    const sourceLayerId = event.dataTransfer.getData('text/coat-layer-id');
    if (!sourceLayerId || sourceLayerId === targetLayer.id) return;
    const sourceLayer = project.layers.find((layer) => layer.id === sourceLayerId);
    if (!sourceLayer) throw new Error(`Unknown coat layer id: ${sourceLayerId}`);
    const sourceOrderIds = getLayerOrderIds(project.layers, sourceLayer);
    const sourceIndex = project.layers.findIndex((layer) => layer.id === sourceOrderIds[0]);
    const targetIndex = project.layers.findIndex((layer) => layer.id === targetLayer.id);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
    if (sourceOrderIds.length === 1) {
      run({ type: 'move-layer', layerId: sourceLayer.id, toIndex: targetIndex });
      return;
    }
    run({
      type: 'move-layer-ids',
      direction: targetIndex > sourceIndex ? 'forward' : 'backward',
      layerIds: sourceOrderIds,
    });
  };

  return (
    <section aria-label={copy.layers} className="coat-target-layer-panel">
      <h2 className="sr-only">{copy.layers}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <label className="coat-target-layer-search">
        <Search aria-hidden="true" />
        <input
          aria-label={copy.searchLayers}
          placeholder={copy.searchLayers}
          type="search"
          value={layerSearch}
          onChange={(event) => setLayerSearch(event.currentTarget.value)}
        />
      </label>
      <ul aria-label={copy.coatLayers}>
        {visibleLayers.map((layer) => {
          const name = layerName(layer, locale, copy.localImage, copy.localDrawing);
          const layerOrderIds = getLayerOrderIds(project.layers, layer);
          const firstLayerIndex = project.layers.findIndex((candidate) => candidate.id === layerOrderIds[0]);
          const lastLayerIndex = project.layers.findIndex((candidate) => candidate.id === layerOrderIds.at(-1));
          const canDrag = layer.type !== 'background' && !layer.locked;
          return <li
            aria-label={name}
            data-selected={selectedIds.includes(layer.id) || undefined}
            key={layer.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => dropLayerOn(layer, event)}
          >
          <label className="sr-only">
            <input aria-label={copy.selectLayer(layer.id, name)} type="checkbox" checked={selectedIds.includes(layer.id)} onChange={(event) => toggleSelected(layer.id, event.target.checked)} />
          </label>
          <button
            className="sr-only"
            disabled={lastLayerIndex === project.layers.length - 1}
            type="button"
            aria-label={copy.moveLayerUp(name)}
            onClick={() => run({ type: 'move-layer-ids', direction: 'forward', layerIds: layerOrderIds })}
          />
          <button
            className="sr-only"
            disabled={firstLayerIndex <= 1}
            type="button"
            aria-label={copy.moveLayerDown(name)}
            onClick={() => run({ type: 'move-layer-ids', direction: 'backward', layerIds: layerOrderIds })}
          />
          <button
            aria-label={copy.reorderLayer(name)}
            disabled={!canDrag}
            draggable={canDrag}
            type="button"
            onDragStart={(event) => {
              event.dataTransfer.setData('text/coat-layer-id', layer.id);
              event.dataTransfer.effectAllowed = 'move';
            }}
            onKeyDown={(event) => onReorderKeyDown(event, {
              canMoveDown: firstLayerIndex > 1,
              canMoveUp: lastLayerIndex < project.layers.length - 1,
              onMoveDown: () => run({ type: 'move-layer-ids', direction: 'backward', layerIds: layerOrderIds }),
              onMoveUp: () => run({ type: 'move-layer-ids', direction: 'forward', layerIds: layerOrderIds }),
            })}
          >
            <GripVertical aria-hidden="true" />
          </button>
          <button className="coat-target-layer-preview" type="button" onClick={(event) => selectLayerRow(layer.id, event)}>
            <LayerThumbnail layer={layer} name={name} uploads={project.uploads} />
          </button>
          <LayerDisplayNameField
            displayName={name}
            layerId={layer.id}
            renameLabel={copy.renameLayer(name)}
            onCommit={(layerId, displayName) => run({ type: 'set-layer-display-name', layerId, displayName })}
            onSelect={(modifiers) => selectLayerRow(layer.id, modifiers)}
          />
          <div className="coat-target-layer-actions">
            <button type="button" aria-label={layer.visible ? copy.hideLayer(name) : copy.showLayer(name)} onClick={() => run({ type: 'set-layer-visibility', layerId: layer.id, visible: !layer.visible })}>
              {layer.visible ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
            </button>
            <button type="button" aria-label={layer.locked ? copy.unlockLayer(name) : copy.lockLayer(name)} onClick={() => run({ type: 'set-layer-lock', layerId: layer.id, locked: !layer.locked })}>
              {layer.locked ? <Lock aria-hidden="true" /> : <LockOpen aria-hidden="true" />}
            </button>
            <button type="button" aria-label={copy.deleteLayer(name)} onClick={() => run({ type: 'remove-layer', layerId: layer.id })}>
              <X aria-hidden="true" />
            </button>
          </div>
        </li>;
        })}
      </ul>
      {visibleLayers.length === 0 ? <p>{copy.noMatchingLayers}</p> : null}
      <div className="coat-target-layer-bulk">
        <button type="button" onClick={duplicateSelected} disabled={selectedIds.length === 0}>{copy.duplicateSelectedLayers}</button>
        <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2}>{copy.groupSelectedLayers}</button>
        <button type="button" onClick={() => selectedGroupId && run({ type: 'ungroup-layers', groupId: selectedGroupId })} disabled={!selectedGroupId}>{copy.ungroupSelectedLayers}</button>
      </div>
      {selectedGroup ? <label>
        {copy.groupOpacity}
        <input
          aria-label={copy.groupOpacity}
          type="number"
          min="0"
          max="100"
          step="1"
          value={selectedGroup.opacity * 100}
          onChange={(event) => run({
            type: 'set-group-opacity', groupId: selectedGroup.id, opacity: Number(event.currentTarget.value) / 100,
          })}
        />
      </label> : null}
    </section>
  );
}

function LayerDisplayNameField({
  displayName,
  layerId,
  onCommit,
  onSelect,
  renameLabel,
}: {
  displayName: string;
  layerId: string;
  onCommit: (layerId: string, displayName: string) => void;
  onSelect: (modifiers: { metaKey: boolean; ctrlKey: boolean }) => void;
  renameLabel: string;
}) {
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);
  useEffect(() => {
    setDraftDisplayName(displayName);
  }, [displayName]);
  const commitDraft = () => {
    if (draftDisplayName === displayName) return;
    onCommit(layerId, draftDisplayName);
  };
  const onRenameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.currentTarget.blur();
  };

  return (
    <input
      aria-label={renameLabel}
      className="coat-target-layer-name"
      value={draftDisplayName}
      onBlur={commitDraft}
      onChange={(event) => setDraftDisplayName(event.currentTarget.value)}
      onFocus={() => onSelect({ metaKey: false, ctrlKey: false })}
      onKeyDown={onRenameKeyDown}
    />
  );
}

function LayerThumbnail({
  layer,
  name,
  uploads,
}: {
  layer: CoatLayer;
  name: string;
  uploads: readonly LocalUpload[];
}) {
  if (layer.type === 'image') {
    const upload = uploads.find((candidate) => candidate.id === layer.uploadId);
    if (!upload) throw new Error(`Unknown local upload id: ${layer.uploadId}`);
    return <img alt="" src={`data:${upload.mimeType};base64,${upload.data}`} />;
  }
  if (layer.type === 'text') {
    return <span aria-hidden="true">{layer.text.slice(0, 1) || name.slice(0, 1)}</span>;
  }
  if (layer.type === 'draw') {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 16 C8 8 12 20 20 8" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (layer.type === 'background') {
    const asset = getCoatAsset(layer.assetId);
    if (asset.kind !== 'background') throw new Error(`Background layer asset must be a background: ${layer.assetId}`);
    return <span aria-hidden="true" className="coat-target-layer-swatch" style={{ background: layer.fill ?? asset.fill }} />;
  }
  const asset = getCoatAsset(layer.assetId);
  const rasterSrc = getAssetRasterSrc(asset, layer);
  if (rasterSrc) return <img alt="" src={rasterSrc} />;
  if ('svgPath' in asset && asset.svgPath) {
    const fill = 'color' in layer ? layer.color : '#d4d4d8';
    return <svg aria-hidden="true" viewBox="0 0 100 110"><path d={asset.svgPath} fill={fill} /></svg>;
  }
  return <span aria-hidden="true">{name.slice(0, 1)}</span>;
}

function getAssetRasterSrc(asset: ReturnType<typeof getCoatAsset>, layer: CoatLayer): string | undefined {
  if (layer.type === 'charge' || layer.type === 'top') {
    const variant = asset.kind === layer.type
      ? asset.rasterVariants?.find((candidate) => candidate.id === layer.rasterVariantId)
      : undefined;
    if (variant) return variant.src;
  }
  if ('rasterSrc' in asset) return asset.rasterSrc;
  if ('staticImageSrc' in asset) return asset.staticImageSrc;
  return undefined;
}

function matchesLayerSearch(name: string, layerType: CoatLayer['type'], rawQuery: string): boolean {
  const normalizedQuery = rawQuery.trim().toLocaleLowerCase();
  if (normalizedQuery.length === 0) return true;
  return [name, layerType].join(' ').toLocaleLowerCase().includes(normalizedQuery);
}

function onReorderKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  actions: { canMoveDown: boolean; canMoveUp: boolean; onMoveDown: () => void; onMoveUp: () => void },
) {
  if (event.key === 'ArrowUp' && actions.canMoveUp) {
    event.preventDefault();
    actions.onMoveUp();
    return;
  }
  if (event.key === 'ArrowDown' && actions.canMoveDown) {
    event.preventDefault();
    actions.onMoveDown();
  }
}

function getLayerOrderIds(layers: CoatLayer[], layer: CoatLayer): string[] {
  return layer.groupId === null
    ? [layer.id]
    : layers.filter((candidate) => candidate.groupId === layer.groupId).map((candidate) => candidate.id);
}
