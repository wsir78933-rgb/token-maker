'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getAssetColorSources, getCoatAsset, listAssetsByKind } from '@/lib/coat-of-arms/assets';
import {
  getDefaultEditorPreferences,
  loadEditorPreferences,
  updateEditorPreferences,
  type EditorPreferences,
} from '@/lib/coat-of-arms/editor-preferences';
import { fieldPatterns } from '@/lib/coat-of-arms/field-pattern';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLayer, CoatLocale, FieldPattern } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

const backgroundPatterns: readonly FieldPattern[] = fieldPatterns;

export type ColorPanelSection = 'used-colours' | 'background';

interface ColorBackgroundPanelProps {
  locale: CoatLocale;
  sectionToFocus?: ColorPanelSection;
}

function colorsUsedByProject(layers: CoatLayer[], palette: string[]) {
  const colors = new Set(palette);
  for (const layer of layers) {
    if (layer.type === 'shield') {
      layer.field.colors.forEach((color) => colors.add(color));
      Object.values(layer.field.regions ?? {}).forEach((region) => region?.colors.forEach((color) => colors.add(color)));
      layer.field.ornaments?.forEach((ornament) => {
        colors.add(ornament.color);
        ornament.colors?.forEach((color) => colors.add(color));
      });
      if (layer.field.outline) colors.add(layer.field.outline.color);
    }
    if (layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top' || layer.type === 'draw' || layer.type === 'text') colors.add(layer.color);
    if ((layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top') && layer.colorReplacements) Object.values(layer.colorReplacements).forEach((color) => colors.add(color));
  }
  return [...colors];
}

/** Edits colour and background values only by sending validated commands to the project store. */
export function ColorBackgroundPanel({ locale, sectionToFocus }: ColorBackgroundPanelProps) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const { error, reportError, run } = usePanelCommandError(locale);
  const [customColor, setCustomColor] = useState('#004E89');
  const [fromColor, setFromColor] = useState('#B11F24');
  const [toColor, setToColor] = useState('#004E89');
  const [preferences, setPreferences] = useState<EditorPreferences>(getDefaultEditorPreferences);
  const [gradientAngle, setGradientAngle] = useState('0');
  const [gradientStartColor, setGradientStartColor] = useState('#004E89');
  const [gradientEndColor, setGradientEndColor] = useState('#B11F24');
  const usedColoursSectionRef = useRef<HTMLElement>(null);
  const backgroundSectionRef = useRef<HTMLElement>(null);
  const usedColors = useMemo(() => colorsUsedByProject(project.layers, project.palette), [project.layers, project.palette]);
  const background = project.layers.find((layer) => layer.type === 'background');

  useEffect(() => {
    let isCurrent = true;
    void Promise.resolve().then(() => {
      try {
        const storedPreferences = loadEditorPreferences();
        if (!isCurrent) return;
        setPreferences(storedPreferences);
        if (storedPreferences.backgroundGradient) {
          setGradientAngle(String(storedPreferences.backgroundGradient.angle));
          setGradientStartColor(storedPreferences.backgroundGradient.startColor);
          setGradientEndColor(storedPreferences.backgroundGradient.endColor);
        }
      } catch (caught) {
        if (isCurrent) reportError(caught);
      }
    });
    return () => { isCurrent = false; };
  }, [reportError]);

  useEffect(() => {
    if (sectionToFocus === 'used-colours') usedColoursSectionRef.current?.focus();
    if (sectionToFocus === 'background') backgroundSectionRef.current?.focus();
  }, [sectionToFocus]);

  const updatePreferences = (update: (currentPreferences: EditorPreferences) => EditorPreferences): boolean => {
    try {
      setPreferences(updateEditorPreferences(update));
      return true;
    } catch (caught) {
      reportError(caught);
      return false;
    }
  };
  const saveCustomColor = () => {
    if (updatePreferences((currentPreferences) => {
      if (currentPreferences.customPalette.some((color) => color.toUpperCase() === customColor.toUpperCase())) {
        throw new Error(`Duplicate editor custom palette color: ${customColor}`);
      }
      return { ...currentPreferences, customPalette: [...currentPreferences.customPalette, customColor] };
    })) {
      ensureProjectPaletteColor(project.palette, customColor, run);
    }
  };
  const applyRestoredCustomColor = (color: string) => {
    setCustomColor(color);
    ensureProjectPaletteColor(project.palette, color, run);
  };
  const applyBackgroundGradient = () => {
    if (!background || background.type !== 'background') return;
    const backgroundGradient = {
      angle: Number(gradientAngle),
      startColor: gradientStartColor,
      endColor: gradientEndColor,
    };
    if (run({
      type: 'set-background',
      assetId: background.assetId,
      motif: background.motif,
      opacity: background.opacity,
      fill: background.fill,
      gradient: backgroundGradient,
    })) {
      updatePreferences((currentPreferences) => ({ ...currentPreferences, backgroundGradient }));
    }
  };

  return (
    <section aria-label={copy.coloursAndBackground} className="space-y-2">
      <h2>{copy.coloursAndBackground}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <section aria-label={copy.usedColours} ref={usedColoursSectionRef} tabIndex={-1}>
        <p>{copy.usedColours}</p>
        <ul aria-label={copy.usedColours}>{usedColors.map((color) => <li key={color}>{color}</li>)}</ul>
        <label>
          {copy.customPaletteColour}
          <input aria-label={copy.customPaletteColour} value={customColor} onChange={(event) => setCustomColor(event.target.value)} />
        </label>
        <button type="button" onClick={saveCustomColor}>{copy.saveCustomColour}</button>
        {preferences.customPalette.length > 0 ? <ul aria-label={copy.customPaletteColour}>
          {preferences.customPalette.map((color) => <li key={color}><button type="button" aria-label={`${copy.customPaletteColour}: ${color}`} onClick={() => applyRestoredCustomColor(color)}>{color}</button></li>)}
        </ul> : null}
        <label>
          {copy.replaceColourFrom}
          <select aria-label={copy.replaceColourFrom} value={fromColor} onChange={(event) => setFromColor(event.target.value)}>
            {usedColors.map((color) => <option key={color} value={color}>{color}</option>)}
          </select>
        </label>
        <label>
          {copy.replaceColourWith}
          <input aria-label={copy.replaceColourWith} value={toColor} onChange={(event) => setToColor(event.target.value)} />
        </label>
        <button type="button" onClick={() => run({ type: 'replace-all-colour', fromColor, toColor })}>{copy.replaceAllColours}</button>
      </section>
      {background?.type === 'background' ? <section aria-label={copy.backgroundColour} ref={backgroundSectionRef} tabIndex={-1}>
        <label>
          {copy.backgroundColour}
          <select aria-label={copy.backgroundColour} value={background.assetId} onChange={(event) => run({ type: 'set-background', assetId: event.target.value, motif: background.motif, opacity: background.opacity, fill: background.fill })}>
            {listAssetsByKind('background').map((asset) => <option key={asset.id} value={asset.id}>{asset.name[locale]}</option>)}
          </select>
        </label>
        <label>
          {copy.backgroundMotif}
          <select aria-label={copy.backgroundMotif} value={background.motif} onChange={(event) => run({ type: 'set-background', assetId: background.assetId, motif: event.target.value as FieldPattern, opacity: background.opacity, fill: background.fill })}>
            {backgroundPatterns.map((pattern) => <option key={pattern} value={pattern}>{copy.fieldPatterns[pattern]}</option>)}
          </select>
        </label>
        <label>
          {copy.backgroundOpacity}
          <input aria-label={copy.backgroundOpacity} type="range" min="0" max="1" step="0.05" value={background.opacity} onChange={(event) => run({ type: 'set-background', assetId: background.assetId, motif: background.motif, opacity: Number(event.target.value), fill: background.fill })} />
        </label>
        <label>
          {copy.customBackgroundColour}
          <input aria-label={copy.customBackgroundColour} type="color" value={background.fill ?? getBackgroundAssetFill(background.assetId)} onChange={(event) => run({ type: 'set-background', assetId: background.assetId, motif: background.motif, opacity: background.opacity, fill: event.target.value })} />
        </label>
        <fieldset><legend>{copy.backgroundGradient}</legend>
          <label>{copy.backgroundGradientAngle}<input aria-label={copy.backgroundGradientAngle} type="number" min="0" max="360" value={gradientAngle} onChange={(event) => setGradientAngle(event.target.value)} /></label>
          <label>{copy.backgroundGradientStartColour}<input aria-label={copy.backgroundGradientStartColour} type="color" value={gradientStartColor} onChange={(event) => setGradientStartColor(event.target.value)} /></label>
          <label>{copy.backgroundGradientEndColour}<input aria-label={copy.backgroundGradientEndColour} type="color" value={gradientEndColor} onChange={(event) => setGradientEndColor(event.target.value)} /></label>
          <button type="button" onClick={applyBackgroundGradient}>{copy.applyBackgroundGradient}</button>
        </fieldset>
        <label>
          <input aria-label={copy.transparentExportBackground} type="checkbox" checked={background.opacity === 0} onChange={(event) => run({ type: 'set-background', assetId: background.assetId, motif: background.motif, opacity: event.target.checked ? 0 : 1, fill: background.fill })} />
          {copy.transparentExportBackground}
        </label>
        <label>
          <input aria-label={copy.backgroundVisible} type="checkbox" checked={background.visible} onChange={(event) => run({ type: 'set-layer-visibility', layerId: background.id, visible: event.target.checked })} />
          {copy.backgroundVisible}
        </label>
      </section> : null}
      <div aria-label={copy.perLayerColours}>
        {project.layers.filter((layer) => layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top' || layer.type === 'draw' || layer.type === 'text').map((layer) => (
          <div key={layer.id}>
            <label>
              {copy.colourForLayer(layer.id)}
              <input aria-label={copy.colourForLayer(layer.id)} type="color" value={layer.color} onChange={(event) => run({ type: 'update-layer', layerId: layer.id, patch: { color: event.target.value } })} />
            </label>
            {(layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top') ? getAssetColorSources(layer.assetId).map((sourceColor) => <label key={sourceColor}>
              {copy.colourForAssetPart(layer.id, sourceColor)}
              <input aria-label={copy.colourForAssetPart(layer.id, sourceColor)} type="color" value={layer.colorReplacements?.[sourceColor] ?? sourceColor} onChange={(event) => run({ type: 'update-layer', layerId: layer.id, patch: { colorReplacements: { ...layer.colorReplacements, [sourceColor]: event.target.value } } })} />
            </label>) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function getBackgroundAssetFill(assetId: string): string {
  const backgroundAsset = getCoatAsset(assetId);
  if (backgroundAsset.kind !== 'background') throw new Error(`Invalid background asset: ${assetId}`);
  return backgroundAsset.fill;
}

function ensureProjectPaletteColor(
  projectPalette: string[],
  color: string,
  run: ReturnType<typeof usePanelCommandError>['run'],
): boolean {
  if (projectPalette.some((candidate) => candidate.toUpperCase() === color.toUpperCase())) return true;
  return run({ type: 'add-custom-palette-color', color });
}
