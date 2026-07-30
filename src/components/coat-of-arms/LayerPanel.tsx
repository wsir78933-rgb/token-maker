'use client';
import { getCoatAsset } from '@/lib/coat-of-arms/assets';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLayer, CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

function layerName(layer: CoatLayer, locale: CoatLocale, localImage: string, localDrawing: string) {
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
  const toggleSelected = (layerId: string, checked: boolean) => setSelectedLayerIds(
    checked ? [...selectedIds, layerId] : selectedIds.filter((id) => id !== layerId),
  );
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

  return (
    <section aria-label={copy.layers} className="space-y-2">
      <h2>{copy.layers}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <ul aria-label={copy.coatLayers}>
        {project.layers.map((layer) => {
          const name = layerName(layer, locale, copy.localImage, copy.localDrawing);
          const layerOrderIds = getLayerOrderIds(project.layers, layer);
          const firstLayerIndex = project.layers.findIndex((candidate) => candidate.id === layerOrderIds[0]);
          const lastLayerIndex = project.layers.findIndex((candidate) => candidate.id === layerOrderIds.at(-1));
          return <li key={layer.id} aria-label={name}>
          <label><input aria-label={copy.selectLayer(layer.id, name)} type="checkbox" checked={selectedIds.includes(layer.id)} onChange={(event) => toggleSelected(layer.id, event.target.checked)} /> {copy.select}</label>
          <span>{name} / {copy.layerType(layer.type)}</span>
          <button type="button" aria-label={copy.moveLayerUp(name)} onClick={() => run({ type: 'move-layer-ids', direction: 'forward', layerIds: layerOrderIds })} disabled={lastLayerIndex === project.layers.length - 1}>{copy.moveUp}</button>
          <button type="button" aria-label={copy.moveLayerDown(name)} onClick={() => run({ type: 'move-layer-ids', direction: 'backward', layerIds: layerOrderIds })} disabled={firstLayerIndex <= 1}>{copy.moveDown}</button>
          <button type="button" aria-label={layer.visible ? copy.hideLayer(name) : copy.showLayer(name)} onClick={() => run({ type: 'set-layer-visibility', layerId: layer.id, visible: !layer.visible })}>{layer.visible ? copy.hide : copy.show}</button>
          <button type="button" aria-label={layer.locked ? copy.unlockLayer(name) : copy.lockLayer(name)} onClick={() => run({ type: 'set-layer-lock', layerId: layer.id, locked: !layer.locked })}>{layer.locked ? copy.unlock : copy.lock}</button>
          <button type="button" aria-label={copy.deleteLayer(name)} onClick={() => run({ type: 'remove-layer', layerId: layer.id })}>{copy.delete}</button>
        </li>;
        })}
      </ul>
      <button type="button" onClick={duplicateSelected} disabled={selectedIds.length === 0}>{copy.duplicateSelectedLayers}</button>
      <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2}>{copy.groupSelectedLayers}</button>
      <button type="button" onClick={() => selectedGroupId && run({ type: 'ungroup-layers', groupId: selectedGroupId })} disabled={!selectedGroupId}>{copy.ungroupSelectedLayers}</button>
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

function getLayerOrderIds(layers: CoatLayer[], layer: CoatLayer): string[] {
  return layer.groupId === null
    ? [layer.id]
    : layers.filter((candidate) => candidate.groupId === layer.groupId).map((candidate) => candidate.id);
}
