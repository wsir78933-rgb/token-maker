'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, Moon, SlidersHorizontal } from 'lucide-react';
import {
  editorCanvasPresets,
  getDefaultEditorPreferences,
  getMatchingEditorCanvasPresetId,
  requireEditorAppearance,
  requireEditorColorPickerMode,
  type EditorAppearance,
  type EditorCanvasPresetId,
  type EditorColorPickerMode,
  type EditorPreferences,
} from '@/lib/coat-of-arms/editor-preferences';
import { useEditorPreferencesStore } from '@/lib/coat-of-arms/editor-preferences-session';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

type SettingsPanelCopy = ReturnType<typeof getCoatWorkbenchCopy>['panels'];

/** Keeps canvas dimensions in the project so local saves and exports use the same composition bounds. */
export function SettingsPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const replaceProject = useCoatProjectStore((state) => state.replaceProject);
  const preferences = useEditorPreferencesStore((state) => state.preferences);
  const { error, reportError, run } = usePanelCommandError(locale);

  useEffect(() => {
    let isCurrent = true;
    void Promise.resolve().then(() => {
      try {
        if (!isCurrent) return;
        useEditorPreferencesStore.getState().loadFromBrowser();
      } catch (caught) {
        if (isCurrent) reportError(caught);
      }
    });
    return () => { isCurrent = false; };
  }, [reportError]);

  const persistPreferenceUpdate = (update: (currentPreferences: EditorPreferences) => EditorPreferences): boolean => {
    try {
      useEditorPreferencesStore.getState().patchPreferences(update);
      return true;
    } catch (caught) {
      reportError(caught);
      return false;
    }
  };
  const persistAppearance = (value: unknown) => {
    const appearance = requireEditorAppearance(value);
    persistPreferenceUpdate((currentPreferences) => ({ ...currentPreferences, appearance }));
  };
  const persistColorPickerMode = (value: unknown) => {
    const colorPickerMode = requireEditorColorPickerMode(value);
    persistPreferenceUpdate((currentPreferences) => ({ ...currentPreferences, colorPickerMode }));
  };
  const applyPreset = (presetId: EditorCanvasPresetId) => {
    const preset = editorCanvasPresets.find((candidate) => candidate.id === presetId);
    if (!preset) throw new Error(`Unknown canvas preset: ${String(presetId)}`);
    if (run({ type: 'set-canvas-size', width: preset.width, height: preset.height })) {
      persistPreferenceUpdate((currentPreferences) => ({ ...currentPreferences, canvasPreset: preset.id }));
    }
  };
  const applyCanvasSize = (width: number, height: number): boolean => {
    if (!run({ type: 'set-canvas-size', width, height })) return false;
    return persistPreferenceUpdate((currentPreferences) => ({ ...currentPreferences, canvasPreset: 'custom' }));
  };
  const resetEditor = () => {
    replaceProject(createDefaultProject(locale));
    persistPreferenceUpdate(() => getDefaultEditorPreferences());
  };

  return (
    <section aria-label={copy.settings} className="space-y-4">
      <h2>{copy.settings}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <AppearanceControls
        appearance={preferences.appearance}
        copy={copy}
        onAppearanceChange={persistAppearance}
      />
      <ColorPickerControls
        colorPickerMode={preferences.colorPickerMode}
        copy={copy}
        onColorPickerModeChange={persistColorPickerMode}
      />
      <CanvasSizeControls
        key={`${project.id}:${project.canvas.width}:${project.canvas.height}`}
        copy={copy}
        height={project.canvas.height}
        onApply={applyCanvasSize}
        width={project.canvas.width}
      />
      <CanvasPresetList
        copy={copy}
        matchingCanvasPresetId={getMatchingEditorCanvasPresetId(project.canvas.width, project.canvas.height)}
        onApplyPreset={applyPreset}
      />
      <button
        className="w-full rounded-md border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] px-3 py-2 text-sm text-[color:var(--coat-text)]"
        type="button"
        onClick={resetEditor}
      >{copy.resetEditor}</button>
    </section>
  );
}

function AppearanceControls({
  appearance,
  copy,
  onAppearanceChange,
}: {
  appearance: EditorAppearance;
  copy: SettingsPanelCopy;
  onAppearanceChange: (value: unknown) => void;
}) {
  return (
    <section aria-label={copy.appearance} className="space-y-2">
      <h3 className="text-sm font-semibold text-[color:var(--coat-text)]">{copy.appearance}</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          aria-pressed={appearance === 'dark'}
          className={segmentedOptionClassName(appearance === 'dark')}
          type="button"
          onClick={() => onAppearanceChange('dark')}
        >
          <Moon aria-hidden="true" className="h-4 w-4" />
          {copy.appearanceDark}
        </button>
      </div>
    </section>
  );
}

function ColorPickerControls({
  colorPickerMode,
  copy,
  onColorPickerModeChange,
}: {
  colorPickerMode: EditorColorPickerMode;
  copy: SettingsPanelCopy;
  onColorPickerModeChange: (value: unknown) => void;
}) {
  return (
    <section aria-label={copy.colorPicker} className="space-y-2 border-b border-[color:var(--coat-line)] pb-4">
      <h3 className="text-sm font-semibold text-[color:var(--coat-text)]">{copy.colorPicker}</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          aria-pressed={colorPickerMode === 'simple'}
          className={segmentedOptionClassName(colorPickerMode === 'simple')}
          type="button"
          onClick={() => onColorPickerModeChange('simple')}
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          {copy.colorPickerSimple}
        </button>
        <button
          aria-pressed={colorPickerMode === 'advanced'}
          className={segmentedOptionClassName(colorPickerMode === 'advanced')}
          type="button"
          onClick={() => onColorPickerModeChange('advanced')}
        >
          <LayoutGrid aria-hidden="true" className="h-4 w-4" />
          {copy.colorPickerAdvanced}
        </button>
      </div>
      <p className="text-xs leading-5 text-[color:var(--coat-muted)]">{copy.colorPickerHelp}</p>
    </section>
  );
}

function CanvasSizeControls({
  copy,
  height: initialHeight,
  onApply,
  width: initialWidth,
}: {
  copy: SettingsPanelCopy;
  height: number;
  onApply: (width: number, height: number) => boolean;
  width: number;
}) {
  const [width, setWidth] = useState(String(initialWidth));
  const [height, setHeight] = useState(String(initialHeight));
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-[color:var(--coat-text)]">{copy.canvasSize}</legend>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-[color:var(--coat-text)]">
          {copy.canvasWidth}
          <input
            aria-label={copy.canvasWidth}
            className="w-full rounded-md border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] px-2 py-1.5 text-[color:var(--coat-text)]"
            max="4096"
            min="1"
            step="1"
            type="number"
            value={width}
            onChange={(event) => setWidth(event.target.value)}
          />
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-[color:var(--coat-text)]">
          {copy.canvasHeight}
          <input
            aria-label={copy.canvasHeight}
            className="w-full rounded-md border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] px-2 py-1.5 text-[color:var(--coat-text)]"
            max="4096"
            min="1"
            step="1"
            type="number"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
        </label>
        <button
          className="rounded-md bg-[#7a2d32] px-3 py-1.5 text-sm text-white"
          type="button"
          onClick={() => onApply(Number(width), Number(height))}
        >{copy.applyCanvasSize}</button>
      </div>
    </fieldset>
  );
}

function CanvasPresetList({
  copy,
  matchingCanvasPresetId,
  onApplyPreset,
}: {
  copy: SettingsPanelCopy;
  matchingCanvasPresetId: EditorCanvasPresetId;
  onApplyPreset: (presetId: EditorCanvasPresetId) => void;
}) {
  return (
    <ul aria-label={copy.canvasPresets} className="space-y-1">
      {editorCanvasPresets.map((preset) => {
        const isMatchingPreset = matchingCanvasPresetId === preset.id;
        return <li key={preset.id}>
          <button
            aria-pressed={isMatchingPreset}
            className={canvasPresetRowClassName(isMatchingPreset)}
            type="button"
            onClick={() => onApplyPreset(preset.id)}
          >
            <span>{requireCanvasPresetName(copy, preset.id)}</span>
            <span aria-hidden="true">{copy.canvasPresetSize(preset.width, preset.height)}</span>
          </button>
        </li>;
      })}
    </ul>
  );
}

function requireCanvasPresetName(copy: SettingsPanelCopy, presetId: string): string {
  const presetName = copy.canvasPresetNames[presetId];
  if (typeof presetName !== 'string' || presetName.length === 0) {
    throw new Error(`Missing canvas preset name: ${presetId}`);
  }
  return presetName;
}

function segmentedOptionClassName(isPressed: boolean): string {
  return [
    'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm',
    isPressed
      ? 'bg-[color:var(--coat-active)] text-[color:var(--coat-accent)]'
      : 'bg-[color:var(--coat-panel-raised)] text-[color:var(--coat-text)]',
  ].join(' ');
}

function canvasPresetRowClassName(isMatchingPreset: boolean): string {
  return [
    'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm',
    isMatchingPreset
      ? 'bg-[#7a2d32] text-white'
      : 'bg-[color:var(--coat-panel-raised)] text-[color:var(--coat-text)]',
  ].join(' ');
}
