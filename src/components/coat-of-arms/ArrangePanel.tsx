'use client';

import { useState, type ReactNode } from 'react';
import {
  AlignCenter,
  AlignCenterVertical,
  AlignEndVertical,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  ArrowDown,
  ArrowUp,
  ChevronsDown,
  ChevronsUp,
  Lock,
  LockOpen,
} from 'lucide-react';
import { getFieldRegionIds } from '@/lib/coat-of-arms/field-regions';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CanvasTransform, CoatLayer, CoatLocale, FieldRegionId } from '@/lib/coat-of-arms/types';
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

  const updateTransform = (patch: Partial<CanvasTransform>) => {
    if (!selectedLayer) return;
    run({ type: 'update-layer', layerId: selectedLayer.id, patch: { transform: { ...selectedLayer.transform, ...patch } } });
  };
  const resizeSelectedLayer = (width: number, height: number) => {
    if (!selectedLayer) return;
    run({
      type: 'resize-layer-ids', layerIds: [selectedLayer.id], width, height, keepAspectRatio,
    });
  };

  return (
    <section aria-label={copy.arrange} className="coat-target-arrange-panel">
      <h2 className="sr-only">{copy.arrange}</h2>
      {error ? <p role="alert">{error}</p> : null}
      {selectedLayerIds.length === 0 ? <p className="coat-target-arrange-empty">{copy.noPositionSelection}</p> : <>
      <fieldset className="coat-target-arrange-section">
        <legend>{copy.order}</legend>
        <div className="coat-target-arrange-order-grid">
          <ArrangeActionButton icon={<ArrowUp />} label={copy.forward} onClick={() => run({ type: 'move-layer-ids', direction: 'forward', layerIds: selectedLayerIds })} />
          <ArrangeActionButton icon={<ArrowDown />} label={copy.backward} onClick={() => run({ type: 'move-layer-ids', direction: 'backward', layerIds: selectedLayerIds })} />
          <ArrangeActionButton icon={<ChevronsUp />} label={copy.toFront} onClick={() => run({ type: 'move-layer-ids', direction: 'front', layerIds: selectedLayerIds })} />
          <ArrangeActionButton icon={<ChevronsDown />} label={copy.toBack} onClick={() => run({ type: 'move-layer-ids', direction: 'back', layerIds: selectedLayerIds })} />
        </div>
      </fieldset>
      <fieldset className="coat-target-arrange-section">
        <legend>{copy.align}</legend>
        <div className="coat-target-arrange-align-grid">
          {([
            ['left', 'left', <AlignLeft key="left" />],
            ['center', 'horizontal-centre', <AlignCenter key="center" />],
            ['right', 'right', <AlignRight key="right" />],
            ['top', 'top', <AlignStartVertical key="top" />],
            ['middle', 'vertical-centre', <AlignCenterVertical key="middle" />],
            ['bottom', 'bottom', <AlignEndVertical key="bottom" />],
          ] as const).map(([copyKey, axis, icon]) => (
            <ArrangeActionButton key={axis} icon={icon} label={copy.alignments[copyKey]} onClick={() => run({ type: 'align-layer-ids', axis, layerIds: selectedLayerIds })} />
          ))}
        </div>
      </fieldset>
      {!selectedLayer ? null : <>
        <fieldset className="coat-target-arrange-section">
          <legend>{copy.position}</legend>
          <div className="coat-target-arrange-pair">
            <label>
              <span>X</span>
              <input aria-label={copy.positionX} type="number" value={formatArrangeNumberForDisplay(selectedLayer.transform.x)} onChange={(event) => updateTransform({ x: readArrangeNumberInput(event.target.value) })} />
            </label>
            <label>
              <span>Y</span>
              <input aria-label={copy.positionY} type="number" value={formatArrangeNumberForDisplay(selectedLayer.transform.y)} onChange={(event) => updateTransform({ y: readArrangeNumberInput(event.target.value) })} />
            </label>
          </div>
        </fieldset>
        <fieldset className="coat-target-arrange-section">
          <legend>
            {copy.layerSize}
            <button
              aria-label={copy.keepAspectRatio}
              aria-pressed={keepAspectRatio}
              type="button"
              onClick={() => setKeepAspectRatio((current) => !current)}
            >
              {keepAspectRatio ? <Lock /> : <LockOpen />}
            </button>
          </legend>
          <div className="coat-target-arrange-pair">
            <label>
              <span>{copy.sizeWidth}</span>
              <input aria-label={copy.positionWidth} type="number" min="1" step="1" value={formatArrangeNumberForDisplay(scaleToPercent(selectedLayer.transform.scaleX ?? selectedLayer.transform.scale))} onChange={(event) => resizeSelectedLayer(readArrangeNumberInput(event.target.value), scaleToPercent(selectedLayer.transform.scaleY ?? selectedLayer.transform.scale))} />
            </label>
            <label>
              <span>{copy.sizeHeight}</span>
              <input aria-label={copy.positionHeight} type="number" min="1" step="1" value={formatArrangeNumberForDisplay(scaleToPercent(selectedLayer.transform.scaleY ?? selectedLayer.transform.scale))} onChange={(event) => resizeSelectedLayer(scaleToPercent(selectedLayer.transform.scaleX ?? selectedLayer.transform.scale), readArrangeNumberInput(event.target.value))} />
            </label>
          </div>
        </fieldset>
        <fieldset className="coat-target-arrange-section">
          <legend>{copy.rotation}</legend>
          <label>
            <input aria-label={copy.positionRotation} type="number" value={formatArrangeNumberForDisplay(selectedLayer.transform.rotation)} onChange={(event) => updateTransform({ rotation: readArrangeNumberInput(event.target.value) })} />
          </label>
        </fieldset>
        <fieldset className="coat-target-arrange-section">
          <legend>{copy.opacity}</legend>
          <label>
            <input
              aria-label={copy.positionOpacity}
              className="coat-target-arrange-opacity-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedLayer.transform.opacity ?? 1}
              onChange={(event) => run({ type: 'set-layer-ids-opacity', layerIds: [selectedLayer.id], opacity: readArrangeNumberInput(event.target.value) })}
            />
          </label>
        </fieldset>
        {selectedLayer.type === 'charge' ? <fieldset className="coat-target-arrange-section">
          <legend>{copy.fieldPlacement}</legend>
          <label>{copy.fieldPlacement}<select aria-label={copy.fieldPlacement} value={selectedLayer.transform.fieldRegionId ?? fieldRegions[0]!} onChange={(event) => updateTransform({ fieldRegionId: event.target.value as FieldRegionId })}>
            {fieldRegions.map((regionId) => <option key={regionId} value={regionId}>{copy.fieldRegionNames[regionId]}</option>)}
          </select></label>
          <label><input aria-label={copy.clipChargeToField} type="checkbox" checked={selectedLayer.transform.clipToField ?? false} onChange={(event) => updateTransform({ clipToField: event.target.checked })} />{copy.clipChargeToField}</label>
        </fieldset> : null}
      </>}
      </>}
    </section>
  );
}

function ArrangeActionButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function getSelectedTransformLayer(layers: CoatLayer[], selectedLayerIds: string[]) {
  if (selectedLayerIds.length !== 1) return null;
  const layer = layers.find((candidate) => candidate.id === selectedLayerIds[0]);
  return layer && layer.type !== 'background' && !layer.locked ? layer : null;
}

function scaleToPercent(scale: number): number {
  return scale * 100;
}

/** Rounds only the visible input; store values stay full precision. */
export function formatArrangeNumberForDisplay(value: number): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid arrange display number: ${String(value)}`);
  }
  return String(Math.round(value));
}

/** Parses a number input and fails immediately when the raw string is empty or not finite. */
export function readArrangeNumberInput(rawValue: string): number {
  if (rawValue.trim() === '') {
    throw new Error(`Invalid arrange number input: ${rawValue}`);
  }
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid arrange number input: ${rawValue}`);
  }
  return parsed;
}
