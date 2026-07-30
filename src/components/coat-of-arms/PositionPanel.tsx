'use client';

import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { getFieldRegionIds } from '@/lib/coat-of-arms/field-regions';
import type { CanvasCrop, CanvasTransform, CoatLayer, CoatLocale, FieldRegionId } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

type Alignment = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

/** Provides exact position fields plus order and alignment for one shared selected layer. */
export function PositionPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const { error, run } = usePanelCommandError(locale);
  const selectedLayer = getSelectedTransformLayer(project.layers, selectedLayerIds);
  const shieldLayer = project.layers.find((layer) => layer.type === 'shield');
  const fieldRegions: readonly FieldRegionId[] = shieldLayer?.type === 'shield'
    ? getFieldRegionIds(shieldLayer.field.division)
    : ['overall'];

  const updateTransform = (patch: Partial<CanvasTransform>) => {
    if (!selectedLayer) return;
    const nextTransform = { ...selectedLayer.transform, ...patch };
    if (Object.prototype.hasOwnProperty.call(patch, 'crop') && patch.crop === undefined) {
      delete nextTransform.crop;
    }
    run({ type: 'update-layer', layerId: selectedLayer.id, patch: { transform: nextTransform } });
  };

  const updateUniformScale = (scale: number) => updateTransform({ scale, scaleX: scale, scaleY: scale });

  const updateCrop = (patch: Partial<CanvasCrop>) => {
    if (!selectedLayer) return;
    const currentCrop = selectedLayer.transform.crop ?? { x: 0, y: 0, width: 100, height: 110 };
    const nextCrop = { ...currentCrop, ...patch };
    updateTransform({
      crop: {
        x: nextCrop.x,
        y: nextCrop.y,
        width: Math.min(nextCrop.width, 100 - nextCrop.x),
        height: Math.min(nextCrop.height, 110 - nextCrop.y),
      },
    });
  };

  const moveLayer = (direction: 'forward' | 'backward' | 'front' | 'back') => {
    if (!selectedLayer) return;
    const currentIndex = project.layers.findIndex((layer) => layer.id === selectedLayer.id);
    const targetIndex = direction === 'forward' ? Math.min(project.layers.length - 1, currentIndex + 1)
      : direction === 'backward' ? Math.max(0, currentIndex - 1)
        : direction === 'front' ? project.layers.length - 1 : 0;
    run({ type: 'move-layer', layerId: selectedLayer.id, toIndex: targetIndex });
  };

  return (
    <section aria-label={copy.position} className="space-y-2">
      <h2>{copy.position}</h2>
      {error ? <p role="alert">{error}</p> : null}
      {!selectedLayer ? <p>{copy.noPositionSelection}</p> : <>
        <fieldset><legend>{copy.positionValues}</legend>
          <label>{copy.positionX}<input aria-label={copy.positionX} type="number" value={selectedLayer.transform.x} onChange={(event) => updateTransform({ x: Number(event.target.value) })} /></label>
          <label>{copy.positionY}<input aria-label={copy.positionY} type="number" value={selectedLayer.transform.y} onChange={(event) => updateTransform({ y: Number(event.target.value) })} /></label>
          <label>{copy.positionScale}<input aria-label={copy.positionScale} type="number" min="0.1" step="0.1" value={selectedLayer.transform.scale} onChange={(event) => updateUniformScale(Number(event.target.value))} /></label>
          <label>{copy.positionWidth}<input aria-label={copy.positionWidth} type="number" min="10" step="1" value={(selectedLayer.transform.scaleX ?? selectedLayer.transform.scale) * 100} onChange={(event) => updateTransform({ scaleX: Number(event.target.value) / 100 })} /></label>
          <label>{copy.positionHeight}<input aria-label={copy.positionHeight} type="number" min="10" step="1" value={(selectedLayer.transform.scaleY ?? selectedLayer.transform.scale) * 100} onChange={(event) => updateTransform({ scaleY: Number(event.target.value) / 100 })} /></label>
          <label>{copy.positionRotation}<input aria-label={copy.positionRotation} type="number" value={selectedLayer.transform.rotation} onChange={(event) => updateTransform({ rotation: Number(event.target.value) })} /></label>
          <label>{copy.positionOpacity}<input aria-label={copy.positionOpacity} type="range" min="0" max="1" step="0.05" value={selectedLayer.transform.opacity ?? 1} onChange={(event) => updateTransform({ opacity: Number(event.target.value) })} /></label>
        </fieldset>
        <fieldset><legend>{copy.order}</legend>
          <button type="button" onClick={() => moveLayer('forward')}>{copy.forward}</button>
          <button type="button" onClick={() => moveLayer('backward')}>{copy.backward}</button>
          <button type="button" onClick={() => moveLayer('front')}>{copy.toFront}</button>
          <button type="button" onClick={() => moveLayer('back')}>{copy.toBack}</button>
        </fieldset>
        <fieldset><legend>{copy.align}</legend>
          {(['left', 'center', 'right', 'top', 'middle', 'bottom'] as const).map((alignment) => <button key={alignment} type="button" onClick={() => updateTransform(getAlignmentTransform(alignment, selectedLayer.transform))}>{copy.alignments[alignment]}</button>)}
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

function getAlignmentTransform(alignment: Alignment, transform: CanvasTransform): Partial<CanvasTransform> {
  const horizontalOffset = 45 * transform.scale;
  const verticalOffset = 48 * transform.scale;
  switch (alignment) {
    case 'left': return { x: -horizontalOffset };
    case 'center': return { x: 0 };
    case 'right': return { x: horizontalOffset };
    case 'top': return { y: -verticalOffset };
    case 'middle': return { y: 0 };
    case 'bottom': return { y: verticalOffset };
  }
}
