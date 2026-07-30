'use client';

import { useEffect, useState } from 'react';
import {
  editorCanvasPresets,
  getDefaultEditorPreferences,
  loadEditorPreferences,
  updateEditorPreferences,
  type EditorCanvasPresetId,
  type EditorPreferences,
} from '@/lib/coat-of-arms/editor-preferences';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Keeps canvas dimensions in the project so local saves and exports use the same composition bounds. */
export function SettingsPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const replaceProject = useCoatProjectStore((state) => state.replaceProject);
  const { error, reportError, run } = usePanelCommandError(locale);
  const [preferences, setPreferences] = useState<EditorPreferences>(getDefaultEditorPreferences);

  useEffect(() => {
    let isCurrent = true;
    void Promise.resolve().then(() => {
      try {
        const storedPreferences = loadEditorPreferences();
        if (isCurrent) setPreferences(storedPreferences);
      } catch (caught) {
        if (isCurrent) reportError(caught);
      }
    });
    return () => { isCurrent = false; };
  }, [reportError]);

  const updatePreferences = (update: (currentPreferences: EditorPreferences) => EditorPreferences): boolean => {
    try {
      setPreferences(updateEditorPreferences(update));
      return true;
    } catch (caught) {
      reportError(caught);
      return false;
    }
  };
  const applyPreset = (presetId: EditorCanvasPresetId) => {
    const preset = editorCanvasPresets.find((candidate) => candidate.id === presetId);
    if (!preset) throw new Error(`Unknown canvas preset: ${String(presetId)}`);
    if (run({ type: 'set-canvas-size', width: preset.width, height: preset.height })) {
      updatePreferences((currentPreferences) => ({ ...currentPreferences, canvasPreset: preset.id }));
    }
  };
  const applyCanvasSize = (width: number, height: number): boolean => {
    if (!run({ type: 'set-canvas-size', width, height })) return false;
    return updatePreferences((currentPreferences) => ({ ...currentPreferences, canvasPreset: 'custom' }));
  };
  const resetEditor = () => {
    replaceProject(createDefaultProject(locale));
    updatePreferences(() => getDefaultEditorPreferences());
  };

  return (
    <section aria-label={copy.settings} className="space-y-2">
      <h2>{copy.settings}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <CanvasSizeControls
        key={`${project.id}:${project.canvas.width}:${project.canvas.height}`}
        copy={copy}
        height={project.canvas.height}
        onApply={applyCanvasSize}
        width={project.canvas.width}
      />
      <fieldset>
        <legend>{copy.canvasPresets}</legend>
        {editorCanvasPresets.map((preset) => <button
          aria-pressed={preferences.canvasPreset === preset.id}
          key={preset.id}
          type="button"
          onClick={() => applyPreset(preset.id)}
        >{copy.canvasPresetNames[preset.id]}</button>)}
      </fieldset>
      <button type="button" onClick={resetEditor}>{copy.resetEditor}</button>
    </section>
  );
}

function CanvasSizeControls({
  copy,
  height: initialHeight,
  onApply,
  width: initialWidth,
}: {
  copy: ReturnType<typeof getCoatWorkbenchCopy>['panels'];
  height: number;
  onApply: (width: number, height: number) => boolean;
  width: number;
}) {
  const [width, setWidth] = useState(String(initialWidth));
  const [height, setHeight] = useState(String(initialHeight));
  return <fieldset>
    <legend>{copy.canvasSize}</legend>
    <label>
      {copy.canvasWidth}
      <input aria-label={copy.canvasWidth} min="1" max="4096" step="1" type="number" value={width} onChange={(event) => setWidth(event.target.value)} />
    </label>
    <label>
      {copy.canvasHeight}
      <input aria-label={copy.canvasHeight} min="1" max="4096" step="1" type="number" value={height} onChange={(event) => setHeight(event.target.value)} />
    </label>
    <button type="button" onClick={() => onApply(Number(width), Number(height))}>{copy.applyCanvasSize}</button>
  </fieldset>;
}
