'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getAssetColorSources, getCoatAsset, listAssetsByKind } from '@/lib/coat-of-arms/assets';
import {
  editorCanvasPresets,
  getMatchingEditorCanvasPresetId,
  type EditorPreferences,
} from '@/lib/coat-of-arms/editor-preferences';
import { useEditorPreferencesStore } from '@/lib/coat-of-arms/editor-preferences-session';
import { fieldPatterns } from '@/lib/coat-of-arms/field-pattern';
import {
  DEFAULT_HERALDIC_PALETTE_ID,
  listHeraldicPalettes,
  listHeraldicPaletteSwatches,
  requireHeraldicPalette,
  resolveDefaultHeraldicPaletteId,
  type HeraldicPalette,
  type HeraldicPaletteId,
} from '@/lib/coat-of-arms/heraldic-palettes';
import { getEditableLayerColours } from '@/lib/coat-of-arms/layer-colours';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { BackgroundLayer, CoatLayer, CoatLocale, FieldPattern } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

const backgroundPatterns: readonly FieldPattern[] = fieldPatterns;
const BACKGROUND_CHARGE_ASSET_ID = 'material-animal-wolf-rampant';

export type ColorPanelSection = 'used-colours' | 'palettes' | 'custom' | 'background';

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
    if (layer.type === 'background') colors.add(getBackgroundFillColour(layer));
    if (layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top' || layer.type === 'draw' || layer.type === 'text') colors.add(layer.color);
    if ((layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top') && layer.colorReplacements) Object.values(layer.colorReplacements).forEach((color) => colors.add(color));
  }
  return [...colors];
}

function getBackgroundFillLayer(layers: CoatLayer[]): BackgroundLayer {
  const backgroundLayer = layers.find((layer) => layer.type === 'background');
  if (!backgroundLayer || backgroundLayer.type !== 'background') throw new Error('Missing background layer');
  return backgroundLayer;
}

function getBackgroundDecorationLayers(layers: CoatLayer[]): CoatLayer[] {
  const shieldIndex = layers.findIndex((layer) => layer.type === 'shield');
  if (shieldIndex === -1) return [];
  return layers.slice(1, shieldIndex).filter((layer) => layer.type !== 'background');
}

function getBackgroundFillColour(backgroundLayer: BackgroundLayer): string {
  return backgroundLayer.fill ?? getBackgroundAssetFill(backgroundLayer.assetId);
}

function listBackgroundPanelSwatches(usedColors: string[], paletteId: string): string[] {
  const paletteColors = listHeraldicPaletteSwatches(requireHeraldicPalette(paletteId)).map((swatch) => swatch.hex);
  const mergedColors: string[] = [];
  const seenColors = new Set<string>();
  for (const color of [...usedColors, ...paletteColors]) {
    const normalizedColor = color.toUpperCase();
    if (seenColors.has(normalizedColor)) continue;
    seenColors.add(normalizedColor);
    mergedColors.push(color);
  }
  return mergedColors;
}

/** Edits colour and background values only by sending validated commands to the project store. */
export function ColorBackgroundPanel({ locale, sectionToFocus }: ColorBackgroundPanelProps) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);
  const preferences = useEditorPreferencesStore((state) => state.preferences);
  const loadFromBrowser = useEditorPreferencesStore((state) => state.loadFromBrowser);
  const patchPreferences = useEditorPreferencesStore((state) => state.patchPreferences);
  const { error, reportError, run, runWithResult } = usePanelCommandError(locale);
  const [customColor, setCustomColor] = useState('#004E89');
  const [fromColor, setFromColor] = useState('#B11F24');
  const [toColor, setToColor] = useState('#004E89');
  const [gradientAngle, setGradientAngle] = useState('0');
  const [gradientStartColor, setGradientStartColor] = useState('#004E89');
  const [gradientEndColor, setGradientEndColor] = useState('#B11F24');
  const usedColoursSectionRef = useRef<HTMLElement>(null);
  const palettesSectionRef = useRef<HTMLElement>(null);
  const customSectionRef = useRef<HTMLElement>(null);
  const backgroundSectionRef = useRef<HTMLElement>(null);
  const usedColors = useMemo(() => colorsUsedByProject(project.layers, project.palette), [project.layers, project.palette]);
  const background = project.layers.find((layer) => layer.type === 'background');
  const isStackedView = sectionToFocus === undefined;
  const showUsedColours = isStackedView || sectionToFocus === 'used-colours';
  const showPalettes = isStackedView || sectionToFocus === 'palettes';
  const showCustom = isStackedView || sectionToFocus === 'custom';
  const showBackground = isStackedView || sectionToFocus === 'background';
  const decorationLayers = showBackground ? getBackgroundDecorationLayers(project.layers) : [];
  const defaultPaletteId = resolveDefaultHeraldicPaletteId(preferences.defaultPaletteId);
  const canvasPresetId = getMatchingEditorCanvasPresetId(project.canvas.width, project.canvas.height);

  useEffect(() => {
    let isCurrent = true;
    void Promise.resolve().then(() => {
      try {
        const storedPreferences = loadFromBrowser();
        if (!isCurrent) return;
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
  }, [loadFromBrowser, reportError]);

  useEffect(() => {
    if (sectionToFocus === 'used-colours') usedColoursSectionRef.current?.focus();
    if (sectionToFocus === 'palettes') palettesSectionRef.current?.focus();
    if (sectionToFocus === 'custom') customSectionRef.current?.focus();
    if (sectionToFocus === 'background') backgroundSectionRef.current?.focus();
  }, [sectionToFocus]);

  const updatePreferences = (update: (currentPreferences: EditorPreferences) => EditorPreferences): boolean => {
    try {
      patchPreferences(update);
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
  const applyFill = (fill: string) => {
    const backgroundLayer = getBackgroundFillLayer(project.layers);
    run({
      type: 'set-background',
      assetId: backgroundLayer.assetId,
      motif: backgroundLayer.motif,
      opacity: 1,
      fill,
      gradient: backgroundLayer.gradient ?? null,
    });
  };
  const applyTransparentBackground = () => {
    const backgroundLayer = getBackgroundFillLayer(project.layers);
    run({
      type: 'set-background',
      assetId: backgroundLayer.assetId,
      motif: backgroundLayer.motif,
      opacity: backgroundLayer.opacity === 0 ? 1 : 0,
      fill: backgroundLayer.fill,
      gradient: backgroundLayer.gradient ?? null,
    });
  };
  const applyCanvasPreset = (presetId: string) => {
    if (presetId === 'custom') return;
    const preset = editorCanvasPresets.find((candidate) => candidate.id === presetId);
    if (!preset) throw new Error(`Unknown canvas preset: ${presetId}`);
    if (run({ type: 'set-canvas-size', width: preset.width, height: preset.height })) {
      updatePreferences((currentPreferences) => ({ ...currentPreferences, canvasPreset: preset.id }));
    }
  };
  const applyColourToSelectedLayer = (toColor: string) => {
    if (selectedLayerIds.length !== 1) {
      reportError(new Error(copy.selectElementToApplyColour));
      return;
    }
    const selectedLayerId = selectedLayerIds[0];
    if (!selectedLayerId) throw new Error('Selected layer id is missing');
    const selectedLayer = project.layers.find((layer) => layer.id === selectedLayerId);
    if (!selectedLayer) throw new Error(`Unknown selected layer: ${selectedLayerId}`);
    const editableColours = getEditableLayerColours(selectedLayer);
    if (editableColours.length === 0) {
      reportError(new Error(`Layer does not support editable colour replacement: ${selectedLayer.id}`));
      return;
    }
    const fromColor = editableColours[0];
    if (!fromColor) throw new Error(`Missing editable colour on layer: ${selectedLayer.id}`);
    run({ type: 'replace-layer-colour', layerId: selectedLayer.id, fromColor, toColor });
  };
  const applyNamedPalette = (paletteId: HeraldicPaletteId) => {
    const sourceByTincture = new Map(
      listHeraldicPaletteSwatches(requireHeraldicPalette(DEFAULT_HERALDIC_PALETTE_ID)).map((swatch) => [swatch.tincture, swatch.hex]),
    );
    const replacements = listHeraldicPaletteSwatches(requireHeraldicPalette(paletteId)).flatMap((swatch) => {
      const fromColor = sourceByTincture.get(swatch.tincture);
      return !fromColor || fromColor.toUpperCase() === swatch.hex.toUpperCase()
        ? []
        : [{ fromColor, toColor: swatch.hex }];
    });
    if (replacements.length > 0) run({ type: 'replace-palette-colours', replacements });
  };
  const setDefaultPalette = (paletteId: HeraldicPaletteId) => {
    updatePreferences((currentPreferences) => ({ ...currentPreferences, defaultPaletteId: paletteId }));
  };
  const addChargeBehindShield = () => {
    try {
      const result = runWithResult({ type: 'add-layer', assetId: BACKGROUND_CHARGE_ASSET_ID });
      if (!result) return;
      if (!result.createdLayerId) {
        throw new Error(`Unable to add background charge: ${BACKGROUND_CHARGE_ASSET_ID}`);
      }
      if (!run({ type: 'move-layer-ids', direction: 'back', layerIds: [result.createdLayerId] })) return;
      setSelectedLayerIds([result.createdLayerId]);
    } catch (caught) {
      reportError(caught);
    }
  };

  return (
    <section aria-label={copy.coloursAndBackground} className="coat-target-color-panel">
      {isStackedView ? <h2>{copy.coloursAndBackground}</h2> : null}
      {error ? <p role="alert">{error}</p> : null}
      {showUsedColours ? <section aria-label={copy.usedColours} className="coat-target-used-colours" ref={usedColoursSectionRef} tabIndex={-1}>
        <p>{copy.usedColoursHint}</p>
        <ul aria-label={copy.usedColours} className="coat-target-colour-swatch-grid">
          {usedColors.map((color) => <li key={color}>
            {isStackedView ? <span>{color}</span> : null}
            <label className="coat-target-colour-swatch" style={{ backgroundColor: color }}>
              <input
                aria-label={copy.usedColourSwatch(color)}
                type="color"
                value={toColorInputValue(color)}
                onChange={(event) => {
                  const nextColor = event.target.value;
                  if (color.toUpperCase() === nextColor.toUpperCase()) return;
                  run({ type: 'replace-all-colour', fromColor: color, toColor: nextColor });
                }}
              />
            </label>
          </li>)}
        </ul>
        {isStackedView ? <>
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
        </> : null}
      </section> : null}
      {showPalettes ? <section aria-label={copy.colorPalettes} className="coat-target-palettes" ref={palettesSectionRef} tabIndex={-1}>
        {listHeraldicPalettes().map((palette) => (
          <PaletteCard
            key={palette.id}
            copy={copy}
            defaultPaletteId={defaultPaletteId}
            palette={palette}
            onAdd={() => applyNamedPalette(palette.id)}
            onPickSwatch={applyColourToSelectedLayer}
            onSetDefault={() => setDefaultPalette(palette.id)}
          />
        ))}
      </section> : null}
      {showCustom ? <section aria-label={copy.customColorPalettes} className="coat-target-custom-palettes" ref={customSectionRef} tabIndex={-1}>
        <div className="coat-target-custom-palettes-card">
          <h3>{copy.customColorPalettes}</h3>
          <p>{copy.customColorPalettesHelp}</p>
          {isStackedView ? <label>
            {copy.customPaletteColour}
            <input aria-label={copy.customPaletteColour} value={customColor} onChange={(event) => setCustomColor(event.target.value)} />
          </label> : <label className="coat-target-colour-swatch" style={{ backgroundColor: customColor }}>
            <input aria-label={copy.customPaletteColour} type="color" value={toColorInputValue(customColor)} onChange={(event) => setCustomColor(event.target.value)} />
          </label>}
          <button type="button" onClick={saveCustomColor}>{copy.saveCustomColour}</button>
          {preferences.customPalette.length > 0 ? <ul aria-label={copy.customPaletteColour} className="coat-target-colour-swatch-grid">
            {preferences.customPalette.map((color) => <li key={color}>
              <button
                type="button"
                aria-label={`${copy.customPaletteColour}: ${color}`}
                className="coat-target-colour-swatch"
                style={{ backgroundColor: color }}
                onClick={() => {
                  applyRestoredCustomColor(color);
                  if (selectedLayerIds.length === 1) applyColourToSelectedLayer(color);
                }}
              />
            </li>)}
          </ul> : null}
        </div>
      </section> : null}
      {showBackground && background?.type === 'background' ? <section aria-label={copy.backgroundColour} className="coat-target-background-colours" ref={backgroundSectionRef} tabIndex={-1}>
        <div className="coat-target-color-section-header">
          <span>{copy.backgroundColour}</span>
          <button aria-pressed={background.opacity === 0} type="button" onClick={applyTransparentBackground}>{copy.transparentBackground}</button>
        </div>
        <div className="coat-target-background-swatch-row">
          <div className="coat-target-background-swatch-tools">
            <button
              type="button"
              aria-label={copy.backgroundColourSwatch(getBackgroundFillColour(background))}
              className="coat-target-background-current-swatch"
              style={{ backgroundColor: getBackgroundFillColour(background) }}
              onClick={() => applyFill(getBackgroundFillColour(background))}
            />
            <label className="coat-target-background-custom-wheel" title={copy.customBackgroundColour}>
              <CustomColourWheelGlyph />
              <input aria-label={copy.customBackgroundColour} type="color" value={toColorInputValue(getBackgroundFillColour(background))} onChange={(event) => applyFill(event.target.value)} />
            </label>
          </div>
          <ul className="coat-target-background-palette-swatches">
            {listBackgroundPanelSwatches(usedColors, defaultPaletteId).map((color) => (
              <li key={color.toUpperCase()}>
                <button
                  type="button"
                  aria-label={copy.backgroundColourSwatch(color)}
                  aria-pressed={getBackgroundFillColour(background).toUpperCase() === color.toUpperCase()}
                  className="coat-target-background-palette-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => applyFill(color)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="coat-target-color-section-header">{copy.canvasSize}</div>
        <select aria-label={copy.canvasSize} className="coat-target-canvas-size-select" value={canvasPresetId} onChange={(event) => applyCanvasPreset(event.target.value)}>
          {canvasPresetId === 'custom' ? <option value="custom">{`${project.canvas.width}×${project.canvas.height}`}</option> : null}
          {editorCanvasPresets.map((preset) => <option key={preset.id} value={preset.id}>{copy.canvasPresetNames[preset.id]}</option>)}
        </select>
        <div className="coat-target-color-section-header">{copy.backgroundLayers}</div>
        <section aria-label={copy.backgroundLayers}>
          {decorationLayers.length === 0 ? null : <ul aria-label={copy.backgroundLayers}>
            {decorationLayers.map((layer) => <li key={layer.id}>{copy.layerType(layer.type)}</li>)}
          </ul>}
          <button className="coat-target-add-charge" type="button" onClick={addChargeBehindShield}>
            <AddChargePlusGlyph />
            {copy.addBackgroundCharge}
          </button>
        </section>
        {isStackedView ? <>
          <label>
            {copy.backgroundColour}
            <select aria-label={`${copy.backgroundColour} asset`} value={background.assetId} onChange={(event) => run({ type: 'set-background', assetId: event.target.value, motif: background.motif, opacity: background.opacity, fill: background.fill })}>
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
        </> : null}
      </section> : null}
      {isStackedView && showUsedColours ? <div aria-label={copy.perLayerColours}>
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
      </div> : null}
    </section>
  );
}

function PaletteCard({
  copy,
  defaultPaletteId,
  onAdd,
  onPickSwatch,
  onSetDefault,
  palette,
}: {
  copy: ReturnType<typeof getCoatWorkbenchCopy>['panels'];
  defaultPaletteId: HeraldicPaletteId;
  onAdd: () => void;
  onPickSwatch: (hex: string) => void;
  onSetDefault: () => void;
  palette: HeraldicPalette;
}) {
  const isDefault = palette.id === defaultPaletteId;
  return (
    <article className="coat-target-palette-card" aria-label={palette.name}>
      <header className="coat-target-palette-header">
        <h3>{palette.name}</h3>
        {isDefault ? <span>{copy.defaultPaletteBadge}</span> : <button type="button" onClick={onSetDefault}>{copy.setPaletteAsDefault}</button>}
        {palette.canAdd ? <button type="button" onClick={onAdd}>{copy.addPalette}</button> : null}
      </header>
      {palette.groups.map((group) => (
        <div key={group.id} className="coat-target-palette-group" aria-label={copy.paletteGroupHeadings[group.id]}>
          <p className="coat-target-palette-group-label">{copy.paletteGroupHeadings[group.id]}</p>
          <ul className="coat-target-colour-swatch-grid">
            {group.swatches.map((swatch) => (
              <li key={`${palette.id}-${swatch.tincture}`}>
                <button
                  type="button"
                  aria-label={copy.paletteSwatch(palette.name, swatch.name, swatch.hex)}
                  className="coat-target-colour-swatch"
                  style={{ backgroundColor: swatch.hex }}
                  onClick={() => onPickSwatch(swatch.hex)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </article>
  );
}

function CustomColourWheelGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="20" height="20">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M8 1 A7 7 0 0 1 15 8 L8 8 Z" fill="#e74c3c" />
      <path d="M15 8 A7 7 0 0 1 8 15 L8 8 Z" fill="#2ecc71" />
      <path d="M8 15 A7 7 0 0 1 1 8 L8 8 Z" fill="#3498db" />
      <path d="M1 8 A7 7 0 0 1 8 1 L8 8 Z" fill="#f1c40f" />
      <circle cx="8" cy="8" r="2.5" fill="white" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

function AddChargePlusGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function toColorInputValue(color: string): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) throw new Error(`Invalid colour for picker: ${color}`);
  return color.toLowerCase();
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
