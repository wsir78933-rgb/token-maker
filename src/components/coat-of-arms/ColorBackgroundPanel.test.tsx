// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { getDefaultEditorPreferences, loadEditorPreferences, saveEditorPreferences } from '@/lib/coat-of-arms/editor-preferences';
import { useEditorPreferencesStore } from '@/lib/coat-of-arms/editor-preferences-session';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ColorBackgroundPanel } from './ColorBackgroundPanel';

describe('ColorBackgroundPanel', () => {
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

  it('keeps custom palette colours and a validated background gradient browser-local', () => {
    render(<ColorBackgroundPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Custom palette colour'), { target: { value: '#123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save custom colour' }));
    fireEvent.change(screen.getByLabelText('Background gradient angle'), { target: { value: '45' } });
    fireEvent.change(screen.getByLabelText('Background gradient start colour'), { target: { value: '#004E89' } });
    fireEvent.change(screen.getByLabelText('Background gradient end colour'), { target: { value: '#B11F24' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply background gradient' }));

    expect(loadEditorPreferences()).toMatchObject({
      customPalette: ['#123456'],
      backgroundGradient: { angle: 45, startColor: '#004e89', endColor: '#b11f24' },
    });
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({
      gradient: { angle: 45, startColor: '#004e89', endColor: '#b11f24' },
    });
  });

  it('adds a restored custom swatch to a fresh project once without a duplicate error', async () => {
    saveEditorPreferences({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: ['#123456'],
      backgroundGradient: null,
    });
    render(<ColorBackgroundPanel locale="en" />);
    await act(async () => { await Promise.resolve(); });

    const restoredSwatch = screen.getByRole('button', { name: 'Custom palette colour: #123456' });
    fireEvent.click(restoredSwatch);
    fireEvent.click(restoredSwatch);

    expect(useCoatProjectStore.getState().project.palette.filter((color) => color.toUpperCase() === '#123456')).toHaveLength(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('applies a background colour swatch and the Transparent button without changing the library asset', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);

    fireEvent.click(screen.getByRole('button', { name: 'Background colour: #FFFFFF' }));
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({
      type: 'background',
      assetId: 'ivory-background',
      fill: '#FFFFFF',
      opacity: 1,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Transparent' }));
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({ type: 'background', opacity: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Transparent' }));
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({ type: 'background', opacity: 1 });
  });

  it('applies a canvas size preset from the Background panel', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);

    fireEvent.change(screen.getByLabelText('Canvas Size'), { target: { value: 'instagram-story' } });

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1080, height: 1920 });
    expect(loadEditorPreferences().canvasPreset).toBe('instagram-story');
  });

  it('adds a charge behind the shield from Add Charge', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Charge' }));

    const layers = useCoatProjectStore.getState().project.layers;
    expect(layers[0]).toMatchObject({ type: 'background' });
    expect(layers[1]).toMatchObject({ type: 'charge', assetId: 'material-animal-lion-rampant' });
    expect(layers[2]).toMatchObject({ type: 'shield' });
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([layers[1]?.id]);
  });

  it('shows grouped heraldic headings in advanced color picker mode when focusing background', async () => {
    saveEditorPreferences({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'advanced',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    });
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);
    await act(async () => { await Promise.resolve(); });

    expect(screen.getByRole('heading', { name: 'Metals' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Colours' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Stains' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Other' })).toBeTruthy();
  });

  it('keeps a continuous swatch grid in simple color picker mode without group headings', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);

    expect(screen.queryByRole('heading', { name: 'Metals' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Colours' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Stains' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Other' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Background colour: #FFFFFF' }));
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({
      type: 'background',
      fill: '#FFFFFF',
    });
  });
});
