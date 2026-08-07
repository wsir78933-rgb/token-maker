// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { EDITOR_PREFERENCES_STORAGE_KEY, loadEditorPreferences, saveEditorPreferences } from '@/lib/coat-of-arms/editor-preferences';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ExportMenu } from './ExportMenu';
import { SettingsPanel } from './SettingsPanel';

describe('SettingsPanel', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('applies the Instagram Story canvas preset and persists that browser-local preference', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Instagram Story' }));

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1080, height: 1920 });
    expect(JSON.parse(window.localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY) ?? '')).toMatchObject({
      canvasPreset: 'instagram-story',
    });
  });

  it('keeps invalid manual dimensions out of the project and exposes their value as an error', () => {
    render(<SettingsPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Canvas width'), { target: { value: '4097' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply canvas size' }));

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1200, height: 1200 });
    expect(screen.getByRole('alert').textContent).toContain('4097');
  });

  it('does not overwrite an interleaved JPEG quality change while saving a canvas preset', async () => {
    const project = createDefaultProject('en');
    useCoatProjectStore.getState().replaceProject(project);
    saveEditorPreferences({
      version: 1,
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    });
    render(<><SettingsPanel locale="en" /><ExportMenu locale="en" project={project} /></>);
    await act(async () => { await Promise.resolve(); });
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.change(screen.getByLabelText('JPG quality'), { target: { value: 'ultra' } });

    fireEvent.click(screen.getByRole('button', { name: 'Instagram Story' }));

    expect(loadEditorPreferences()).toMatchObject({ canvasPreset: 'instagram-story', jpegQuality: 'ultra' });
  });

  it('resets the unsaved editor project and local canvas preference without deleting saved projects', () => {
    const initialProject = useCoatProjectStore.getState().project;
    useCoatProjectStore.getState().dispatch({ type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    saveEditorPreferences({
      version: 1,
      canvasPreset: 'instagram-story',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    });
    render(<SettingsPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset editor' }));

    const resetProject = useCoatProjectStore.getState().project;
    expect(resetProject.id).not.toBe(initialProject.id);
    expect(resetProject.canvas).toEqual({ width: 1200, height: 1200 });
    expect(resetProject.layers.some((layer) => layer.type === 'charge' && layer.assetId === 'material-animal-lion-rampant')).toBe(false);
    expect(loadEditorPreferences().canvasPreset).toBe('square');
  });
});
