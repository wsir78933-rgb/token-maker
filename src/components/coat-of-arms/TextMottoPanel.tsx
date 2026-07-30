'use client';

import { useState } from 'react';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { textFontFamilies, type CoatLocale, type TextAlignment, type TextFontFamily, type TextFontStyle, type TextFontWeight, type TextLayer, type TextPathPlacement } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

type TextPathMode = 'none' | 'motto-upper' | 'motto-lower' | 'curve-upper' | 'curve-lower' | 'ring-clockwise' | 'ring-counterclockwise';

export interface TextMottoDraft {
  alignment: TextAlignment;
  color: string;
  fontFamily: TextFontFamily;
  fontSize: number;
  fontStyle: TextFontStyle;
  fontWeight: TextFontWeight;
  pathMode: TextPathMode;
  rotation: number;
  scale: number;
  selectedLayerId: string | null;
  text: string;
  x: number;
  y: number;
}

interface TextMottoPanelProps {
  draft?: TextMottoDraft | null;
  locale: CoatLocale;
  onDraftChange?: (draft: TextMottoDraft) => void;
}

function toTextPathPlacement(mode: TextPathMode): TextPathPlacement {
  switch (mode) {
    case 'none': return { mode: 'none' };
    case 'motto-upper': return { mode: 'motto', curve: 'upper' };
    case 'motto-lower': return { mode: 'motto', curve: 'lower' };
    case 'curve-upper': return { mode: 'curve', curve: 'upper' };
    case 'curve-lower': return { mode: 'curve', curve: 'lower' };
    case 'ring-clockwise': return { mode: 'ring', curve: 'clockwise' };
    case 'ring-counterclockwise': return { mode: 'ring', curve: 'counterclockwise' };
  }
}

/** Creates text and motto layers from local draft controls through one add command. */
export function TextMottoPanel({ draft, locale, onDraftChange }: TextMottoPanelProps) {
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const selectedTextLayer = selectedLayerIds.length === 1
    ? project.layers.find((layer): layer is TextLayer => layer.id === selectedLayerIds[0] && layer.type === 'text' && !layer.locked) ?? null
    : null;

  return <TextMottoEditor draft={draft} key={selectedTextLayer?.id ?? 'new-text'} locale={locale} onDraftChange={onDraftChange} selectedTextLayer={selectedTextLayer} />;
}

function TextMottoEditor({ draft, locale, onDraftChange, selectedTextLayer }: { draft?: TextMottoDraft | null; locale: CoatLocale; onDraftChange?: (draft: TextMottoDraft) => void; selectedTextLayer: TextLayer | null }) {
  const workbenchCopy = getCoatWorkbenchCopy(locale);
  const copy = workbenchCopy.panels;
  const { error, run } = usePanelCommandError(locale);
  const selectedLayerId = selectedTextLayer?.id ?? null;
  const [localDraft, setLocalDraft] = useState(() => createTextMottoDraft(selectedTextLayer, workbenchCopy.defaultMotto));
  const currentDraft = draft?.selectedLayerId === selectedLayerId ? draft : localDraft;
  const updateDraft = (patch: Partial<Omit<TextMottoDraft, 'selectedLayerId'>>) => {
    const nextDraft = { ...currentDraft, ...patch, selectedLayerId };
    if (onDraftChange) {
      onDraftChange(nextDraft);
      return;
    }
    setLocalDraft(nextDraft);
  };

  const addText = () => run({
    type: 'add-text-layer', text: currentDraft.text, color: currentDraft.color, fontSize: currentDraft.fontSize, fontFamily: currentDraft.fontFamily, fontStyle: currentDraft.fontStyle, fontWeight: currentDraft.fontWeight, alignment: currentDraft.alignment, path: toTextPathPlacement(currentDraft.pathMode),
    transform: { x: currentDraft.x, y: currentDraft.y, scale: currentDraft.scale, rotation: currentDraft.rotation },
  });
  const updateSelectedText = () => {
    if (!selectedTextLayer) return;
    run({
      type: 'update-layer', layerId: selectedTextLayer.id,
      patch: {
        text: currentDraft.text, color: currentDraft.color, fontSize: currentDraft.fontSize, fontFamily: currentDraft.fontFamily, fontStyle: currentDraft.fontStyle, fontWeight: currentDraft.fontWeight, alignment: currentDraft.alignment, path: toTextPathPlacement(currentDraft.pathMode),
        transform: { ...selectedTextLayer.transform, x: currentDraft.x, y: currentDraft.y, scale: currentDraft.scale, rotation: currentDraft.rotation },
      },
    });
  };

  return (
    <section aria-label={copy.textAndMotto} className="space-y-2">
      <h2>{copy.textAndMotto}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <label>{copy.mottoText}<input aria-label={copy.mottoText} value={currentDraft.text} onChange={(event) => updateDraft({ text: event.target.value })} /></label>
      <label>{copy.textColour}<input aria-label={copy.textColour} type="color" value={currentDraft.color} onChange={(event) => updateDraft({ color: event.target.value })} /></label>
      <label>{copy.typographySize}<input aria-label={copy.typographySize} type="number" min="1" value={currentDraft.fontSize} onChange={(event) => updateDraft({ fontSize: Number(event.target.value) })} /></label>
      <label>
        {copy.fontFamily}
        <select aria-label={copy.fontFamily} value={currentDraft.fontFamily} onChange={(event) => updateDraft({ fontFamily: event.target.value as TextFontFamily })}>
          {textFontFamilies.map((family) => <option key={family} value={family}>{copy.textFonts[family]}</option>)}
        </select>
      </label>
      <label>
        {copy.fontStyle}
        <select aria-label={copy.fontStyle} value={currentDraft.fontStyle} onChange={(event) => updateDraft({ fontStyle: event.target.value as TextFontStyle })}>
          <option value="normal">{copy.textFontStyles.normal}</option><option value="italic">{copy.textFontStyles.italic}</option>
        </select>
      </label>
      <label>
        {copy.fontWeight}
        <select aria-label={copy.fontWeight} value={currentDraft.fontWeight} onChange={(event) => updateDraft({ fontWeight: event.target.value as TextFontWeight })}>
          <option value="normal">{copy.textFontWeights.normal}</option><option value="bold">{copy.textFontWeights.bold}</option>
        </select>
      </label>
      <label>
        {copy.textAlignment}
        <select aria-label={copy.textAlignment} value={currentDraft.alignment} onChange={(event) => updateDraft({ alignment: event.target.value as TextAlignment })}>
          <option value="left">{copy.textAlignments.left}</option><option value="center">{copy.textAlignments.center}</option><option value="right">{copy.textAlignments.right}</option>
        </select>
      </label>
      <label>
        {copy.textPath}
        <select aria-label={copy.textPath} value={currentDraft.pathMode} onChange={(event) => updateDraft({ pathMode: event.target.value as TextPathMode })}>
          <option value="none">{copy.textPaths.none}</option><option value="motto-upper">{copy.textPaths['motto-upper']}</option><option value="motto-lower">{copy.textPaths['motto-lower']}</option>
          <option value="curve-upper">{copy.textPaths['curve-upper']}</option><option value="curve-lower">{copy.textPaths['curve-lower']}</option><option value="ring-clockwise">{copy.textPaths['ring-clockwise']}</option><option value="ring-counterclockwise">{copy.textPaths['ring-counterclockwise']}</option>
        </select>
      </label>
      <fieldset><legend>{copy.textTransform}</legend>
        <label>{copy.x}<input aria-label={`${copy.textTransform} ${copy.x}`} type="number" value={currentDraft.x} onChange={(event) => updateDraft({ x: Number(event.target.value) })} /></label>
        <label>{copy.y}<input aria-label={`${copy.textTransform} ${copy.y}`} type="number" value={currentDraft.y} onChange={(event) => updateDraft({ y: Number(event.target.value) })} /></label>
        <label>{copy.scale}<input aria-label={`${copy.textTransform} ${copy.scale}`} type="number" min="0.1" step="0.1" value={currentDraft.scale} onChange={(event) => updateDraft({ scale: Number(event.target.value) })} /></label>
        <label>{copy.rotation}<input aria-label={`${copy.textTransform} ${copy.rotation}`} type="number" value={currentDraft.rotation} onChange={(event) => updateDraft({ rotation: Number(event.target.value) })} /></label>
      </fieldset>
      <button type="button" onClick={addText}>{copy.addMotto}</button>
      {selectedTextLayer ? <button type="button" onClick={updateSelectedText}>{copy.updateSelectedText}</button> : null}
    </section>
  );
}

function createTextMottoDraft(selectedTextLayer: TextLayer | null, defaultMotto: string): TextMottoDraft {
  return {
    alignment: selectedTextLayer?.alignment ?? 'center',
    color: selectedTextLayer?.color ?? '#F5E6A1',
    fontFamily: selectedTextLayer?.fontFamily ?? 'serif',
    fontSize: selectedTextLayer?.fontSize ?? 24,
    fontStyle: selectedTextLayer?.fontStyle ?? 'normal',
    fontWeight: selectedTextLayer?.fontWeight ?? 'normal',
    pathMode: selectedTextLayer ? toTextPathMode(selectedTextLayer.path) : 'motto-upper',
    rotation: selectedTextLayer?.transform.rotation ?? 0,
    scale: selectedTextLayer?.transform.scale ?? 1,
    selectedLayerId: selectedTextLayer?.id ?? null,
    text: selectedTextLayer?.text ?? defaultMotto,
    x: selectedTextLayer?.transform.x ?? 0,
    y: selectedTextLayer?.transform.y ?? 0,
  };
}

function toTextPathMode(path: TextPathPlacement): TextPathMode {
  if (path.mode === 'none') return 'none';
  if (path.mode === 'motto') return `motto-${path.curve}`;
  if (path.mode === 'curve') return `curve-${path.curve}`;
  return `ring-${path.curve}`;
}
