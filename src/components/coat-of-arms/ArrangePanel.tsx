'use client';

import { useState } from 'react';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { getFieldRegionIds } from '@/lib/coat-of-arms/field-regions';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CanvasCrop, CanvasTransform, CoatLayer, CoatLocale, FieldRegionId } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';


/** Keeps arrangement actions explicit while retaining the exact one-layer transform controls. */
export function ArrangePanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const { error, run } = usePanelCommandError(locale);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const selectedLayer = getSelectedTransformLayer(project.layers, selectedLayerIds);
  const shieldLayer = project.layers.find((layer) => layer.type === 'shield');
  const fieldRegions: readonly FieldRegionId[] = shieldLayer?.type === 'shield'
    ? getFieldRegionIds(shieldLayer.field.division)
    : ['overall'];
  const selectedLayers = project.layers.filter((layer) => selectedLayerIds.includes(layer.id));
  const selectedGroupIds = [...new Set(selectedLayers.flatMap((layer) => layer.groupId === null ? [] : [layer.groupId]))];
  const selectedGroup = selectedGroupIds.length === 1
    ? project.groups.find((group) => group.id === selectedGroupIds[0])
    : undefined;

  const updateTransform = (patch: Partial<CanvasTransform>) => {
    if (!selectedLayer) return;
    const transform = { ...selectedLayer.transform, ...patch };
    if (Object.hasOwn(patch, 'crop') && patch.crop === undefined) delete transform.crop;
    run({ type: 'update-layer', layerId: selectedLayer.id, patch: { transform } });
  };
  const updateCrop = (patch: Partial<CanvasCrop>) => {
    if (!selectedLayer) return;
    const currentCrop = selectedLayer.transform.crop ?? { x: 0, y: 0, width: 100, height: 110 };
    const crop = { ...currentCrop, ...patch };
    updateTransform({
      crop: {
        x: crop.x,
        y: crop.y,
        width: Math.min(crop.width, 100 - crop.x),
        height: Math.min(crop.height, 110 - crop.y),
      },
    });
  };
  const setSelectedLock = () => {
    const unlockedLayerIds = selectedLayers.filter((layer) => !layer.locked).map((layer) => layer.id);
    const lockedLayerIds = selectedLayers.filter((layer) => layer.locked).map((layer) => layer.id);
    if (unlockedLayerIds.length > 0) {
      run({ type: 'set-layer-ids-lock', layerIds: unlockedLayerIds, locked: true });
      return;
    }
    run({ type: 'set-layer-ids-lock', layerIds: lockedLayerIds, locked: false });
  };
  const setSelectedVisibility = () => {
    const visible = !selectedLayers.some((layer) => layer.visible);
    run({ type: 'set-layer-ids-visibility', layerIds: selectedLayerIds, visible });
  };
  const resizeSelectedLayer = (width: number, height: number) => {
    if (!selectedLayer) return;
    run({
      type: 'resize-layer-ids', layerIds: [selectedLayer.id], width, height, keepAspectRatio,
    });
  };

  return (
    <section aria-label={copy.position} className="space-y-2">
      <h2>{copy.position}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <fieldset><legend>{copy.order}</legend>
        <button type="button" onClick={() => run({ type: 'move-layer-ids', direction: 'forward', layerIds: selectedLayerIds })}>{copy.forward}</button>
        <button type="button" onClick={() => run({ type: 'move-layer-ids', direction: 'backward', layerIds: selectedLayerIds })}>{copy.backward}</button>
        <button type="button" onClick={() => run({ type: 'move-layer-ids', direction: 'front', layerIds: selectedLayerIds })}>{copy.toFront}</button>
        <button type="button" onClick={() => run({ type: 'move-layer-ids', direction: 'back', layerIds: selectedLayerIds })}>{copy.toBack}</button>
      </fieldset>
      <fieldset><legend>{copy.align}</legend>
        {([
          ['left', 'left'], ['center', 'horizontal-centre'], ['right', 'right'],
          ['top', 'top'], ['middle', 'vertical-centre'], ['bottom', 'bottom'],
        ] as const).map(([copyKey, axis]) => <button key={axis} type="button" onClick={() => run({ type: 'align-layer-ids', axis, layerIds: selectedLayerIds })}>{copy.alignments[copyKey]}</button>)}
        <button type="button" onClick={() => run({ type: 'distribute-layer-ids', axis: 'horizontal', layerIds: selectedLayerIds })}>{copy.fieldStripeDirections.horizontal}</button>
        <button type="button" onClick={() => run({ type: 'distribute-layer-ids', axis: 'vertical', layerIds: selectedLayerIds })}>{copy.fieldStripeDirections.vertical}</button>
      </fieldset>
      <fieldset><legend>{copy.layers}</legend>
        <button type="button" onClick={setSelectedVisibility}>{selectedLayers.some((layer) => layer.visible) ? copy.hide : copy.show}</button>
        <button type="button" onClick={setSelectedLock}>{selectedLayers.some((layer) => !layer.locked) ? copy.lock : copy.unlock}</button>
        <button type="button" onClick={() => run({ type: 'group-layer-ids', groupId: createLocalCoatId(), layerIds: selectedLayerIds })}>{copy.groupSelectedLayers}</button>
        <button type="button" onClick={() => run({ type: 'ungroup-layer-ids', layerIds: selectedLayerIds })}>{copy.ungroupSelectedLayers}</button>
        {selectedGroup ? <label>
          {copy.groupOpacity}
          <input aria-label={copy.groupOpacity} type="number" min="0" max="100" step="1" value={selectedGroup.opacity * 100} onChange={(event) => run({ type: 'set-group-opacity', groupId: selectedGroup.id, opacity: Number(event.currentTarget.value) / 100 })} />
        </label> : null}
      </fieldset>
      {!selectedLayer ? <p>{copy.noPositionSelection}</p> : <>
        <fieldset><legend>{copy.positionValues}</legend>
          <label>{copy.positionX}<input aria-label={copy.positionX} type="number" value={selectedLayer.transform.x} onChange={(event) => updateTransform({ x: Number(event.target.value) })} /></label>
          <label>{copy.positionY}<input aria-label={copy.positionY} type="number" value={selectedLayer.transform.y} onChange={(event) => updateTransform({ y: Number(event.target.value) })} /></label>
          <label>{copy.positionScale}<input aria-label={copy.positionScale} type="number" min="0.1" step="0.1" value={selectedLayer.transform.scale} onChange={(event) => updateTransform({ scale: Number(event.target.value), scaleX: Number(event.target.value), scaleY: Number(event.target.value) })} /></label>
          <label>{copy.positionWidth}<input aria-label={copy.positionWidth} type="number" min="1" step="1" value={(selectedLayer.transform.scaleX ?? selectedLayer.transform.scale) * 100} onChange={(event) => resizeSelectedLayer(Number(event.target.value), (selectedLayer.transform.scaleY ?? selectedLayer.transform.scale) * 100)} /></label>
          <label>{copy.positionHeight}<input aria-label={copy.positionHeight} type="number" min="1" step="1" value={(selectedLayer.transform.scaleY ?? selectedLayer.transform.scale) * 100} onChange={(event) => resizeSelectedLayer((selectedLayer.transform.scaleX ?? selectedLayer.transform.scale) * 100, Number(event.target.value))} /></label>
          <label><input aria-label={copy.keepAspectRatio} type="checkbox" checked={keepAspectRatio} onChange={(event) => setKeepAspectRatio(event.target.checked)} />{copy.keepAspectRatio}</label>
          <label>{copy.positionRotation}<input aria-label={copy.positionRotation} type="number" value={selectedLayer.transform.rotation} onChange={(event) => updateTransform({ rotation: Number(event.target.value) })} /></label>
          <label>{copy.positionOpacity}<input aria-label={copy.positionOpacity} type="range" min="0" max="1" step="0.05" value={selectedLayer.transform.opacity ?? 1} onChange={(event) => run({ type: 'set-layer-ids-opacity', layerIds: [selectedLayer.id], opacity: Number(event.target.value) })} /></label>
        </fieldset>
        <fieldset><legend>{copy.flipAndCrop}</legend>
          <button type="button" onClick={() => updateTransform({ flipHorizontal: !selectedLayer.transform.flipHorizontal })}>{copy.flipHorizontal}</button>
          <button type="button" onClick={() => updateTransform({ flipVertical: !selectedLayer.transform.flipVertical })}>{copy.flipVertical}</button>
          <label>{copy.cropLeft}<input aria-label={copy.cropLeft} type="number" min="0" max="99" value={selectedLayer.transform.crop?.x ?? 0} onChange={(event) => updateCrop({ x: Number(event.target.value) })} /></label>
          <label>{copy.cropTop}<input aria-label={copy.cropTop} type="number" min="0" max="109" value={selectedLayer.transform.crop?.y ?? 0} onChange={(event) => updateCrop({ y: Number(event.target.value) })} /></label>
          <label>{copy.cropWidth}<input aria-label={copy.cropWidth} type="number" min="1" max={100 - (selectedLayer.transform.crop?.x ?? 0)} value={selectedLayer.transform.crop?.width ?? 100} onChange={(event) => updateCrop({ width: Number(event.target.value) })} /></label>
          <label>{copy.cropHeight}<input aria-label={copy.cropHeight} type="number" min="1" max={110 - (selectedLayer.transform.crop?.y ?? 0)} value={selectedLayer.transform.crop?.height ?? 110} onChange={(event) => updateCrop({ height: Number(event.target.value) })} /></label>
          <button type="button" onClick={() => updateTransform({ crop: undefined })}>{copy.resetCrop}</button>
        </fieldset>
        {selectedLayer.type === 'charge' ? <fieldset><legend>{copy.fieldPlacement}</legend>
          <label>{copy.fieldPlacement}<select aria-label={copy.fieldPlacement} value={selectedLayer.transform.fieldRegionId ?? fieldRegions[0]!} onChange={(event) => updateTransform({ fieldRegionId: event.target.value as FieldRegionId })}>
            {fieldRegions.map((regionId) => <option key={regionId} value={regionId}>{copy.fieldRegionNames[regionId]}</option>)}
          </select></label>
          <label><input aria-label={copy.clipChargeToField} type="checkbox" checked={selectedLayer.transform.clipToField ?? false} onChange={(event) => updateTransform({ clipToField: event.target.checked })} />{copy.clipChargeToField}</label>
        </fieldset> : null}
      </>}
    </section>
  );
}

function getSelectedTransformLayer(layers: CoatLayer[], selectedLayerIds: string[]) {
  if (selectedLayerIds.length !== 1) return null;
  const layer = layers.find((candidate) => candidate.id === selectedLayerIds[0]);
  return layer && layer.type !== 'background' && !layer.locked ? layer : null;
}
