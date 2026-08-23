// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { EDITOR_PREFERENCES_STORAGE_KEY, getDefaultEditorPreferences, loadEditorPreferences, saveEditorPreferences } from '@/lib/coat-of-arms/editor-preferences';
import { useEditorPreferencesStore } from '@/lib/coat-of-arms/editor-preferences-session';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ExportMenu } from './ExportMenu';
import { SettingsPanel } from './SettingsPanel';

describe('SettingsPanel', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    useEditorPreferencesStore.setState({ preferences: getDefaultEditorPreferences() });
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    useEditorPreferencesStore.setState({ preferences: getDefaultEditorPreferences() });
  });

  it('applies the 3:5 canvas preset and persists that browser-local preference', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: '1:1 (Switzerland, Vatican City)' }));
    fireEvent.click(screen.getByRole('button', { name: '3:5 (Germany, Nicaragua, Lithuania)' }));

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1800, height: 1080 });
    expect(JSON.parse(window.localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY) ?? '')).toMatchObject({
      canvasPreset: '3-5',
    });
  });

  it('applies the 1:1 canvas preset when clicked', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: '1:1 (Switzerland, Vatican City)' }));

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1080, height: 1080 });
  });

  it('keeps invalid manual dimensions out of the project and exposes their value as an error', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Width'), { target: { value: '4097' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1800, height: 1080 });
    expect(screen.getByRole('alert').textContent).toContain('4097');
  });

  it('does not overwrite an interleaved JPEG quality change while saving a canvas preset', async () => {
    const project = createDefaultProject('en');
    useCoatProjectStore.getState().replaceProject(project);
    saveEditorPreferences({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    });
    render(<><SettingsPanel locale="en" /><ExportMenu locale="en" project={project} /></>);
    await act(async () => { await Promise.resolve(); });
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.change(screen.getByLabelText('Quality'), { target: { value: '3' } });

    fireEvent.click(screen.getByRole('button', { name: '3:5 (Germany, Nicaragua, Lithuania)' }));

    expect(loadEditorPreferences()).toMatchObject({ canvasPreset: '3-5', jpegQuality: 'ultra' });
  });

  it('resets the unsaved editor project and local canvas preference', () => {
    const initialProject = useCoatProjectStore.getState().project;
    useCoatProjectStore.getState().dispatch({ type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
    saveEditorPreferences({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    });
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset editor' }));

    const resetProject = useCoatProjectStore.getState().project;
    expect(resetProject.id).not.toBe(initialProject.id);
    expect(resetProject.canvas).toEqual({ width: 1800, height: 1080 });
    expect(resetProject.layers.some((layer) => layer.type === 'charge' && layer.assetId === 'material-animal-wolf-rampant')).toBe(false);
    expect(loadEditorPreferences().canvasPreset).toBe('3-5');
  });

  it('does not render a Light appearance button and keeps Dark as dark', () => {
    render(<SettingsPanel locale="en" />);

    expect(screen.queryByRole('button', { name: 'Light' })).toBeNull();
    const darkButton = screen.getByRole('button', { name: 'Dark' });

    fireEvent.click(darkButton);

    expect(loadEditorPreferences().appearance).toBe('dark');
    expect(useEditorPreferencesStore.getState().preferences.appearance).toBe('dark');
  });

  it('persists advanced color picker mode through the browser document and the session store', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Advanced' }));

    expect(loadEditorPreferences().colorPickerMode).toBe('advanced');
    expect(useEditorPreferencesStore.getState().preferences.colorPickerMode).toBe('advanced');
  });

  it('applies the 2:3 canvas preset', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: '2:3 (Japan, France, Kenya)' }));

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1620, height: 1080 });
  });

  it('marks the 3:5 canvas preset as pressed after it is applied', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: '1:1 (Switzerland, Vatican City)' }));
    fireEvent.click(screen.getByRole('button', { name: '3:5 (Germany, Nicaragua, Lithuania)' }));

    expect(screen.getByRole('button', { name: '3:5 (Germany, Nicaragua, Lithuania)' }).getAttribute('aria-pressed')).toBe('true');
  });
});
