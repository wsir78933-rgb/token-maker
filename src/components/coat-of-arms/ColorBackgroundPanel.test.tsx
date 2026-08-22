// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
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

    fireEvent.change(screen.getByLabelText('Custom background colour'), { target: { value: '#FFFFFF' } });
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({
      type: 'background',
      assetId: 'ivory-background',
      fill: '#ffffff',
      opacity: 1,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Transparent' }));
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({ type: 'background', opacity: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Transparent' }));
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({ type: 'background', opacity: 1 });
  });

  it('applies a canvas size preset from the Background panel', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);

    fireEvent.change(screen.getByLabelText('Canvas Size'), { target: { value: 'square' } });
    fireEvent.change(screen.getByLabelText('Canvas Size'), { target: { value: '3-5' } });

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1800, height: 1080 });
    expect(loadEditorPreferences().canvasPreset).toBe('3-5');
  });

  it('adds a charge behind the shield from Add Charge', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Charge' }));

    const layers = useCoatProjectStore.getState().project.layers;
    expect(layers[0]).toMatchObject({ type: 'background' });
    expect(layers[1]).toMatchObject({ type: 'charge', assetId: 'material-animal-wolf-rampant' });
    expect(layers[2]).toMatchObject({ type: 'shield' });
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([layers[1]?.id]);
  });

  it('paints the background from a default palette swatch without heraldic group headings', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);

    expect(screen.queryByRole('heading', { name: 'Metals' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Colours' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Background colour: #F7C702' }));

    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({
      type: 'background',
      fill: '#F7C702',
    });
  });

  it('lists used canvas colours together with the default palette on Background', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="background" />);
    const swatches = screen.getAllByRole('button', { name: /Background colour:/ });

    expect(swatches.length).toBeGreaterThan(12);
    expect(screen.getByRole('button', { name: 'Background colour: #1855A5' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Background colour: #F7C702' })).toBeDefined();
  });

  it('recolors matching default tinctures when a palette Add button is used', () => {
    const withText = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer', text: 'Motto', color: '#BB212C', fontSize: 12, alignment: 'center', path: { mode: 'none' },
    });
    const textLayer = withText.layers.at(-1);
    if (!textLayer) throw new Error('Expected added text layer');
    useCoatProjectStore.getState().replaceProject(withText);
    render(<ColorBackgroundPanel locale="en" sectionToFocus="palettes" />);

    fireEvent.click(within(screen.getByRole('article', { name: 'Vampire Castle' })).getByRole('button', { name: 'Add' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === textLayer.id)).toMatchObject({ color: '#880808' });
  });

  it('applies a palette in one history entry and restores all colours with one Undo', () => {
    const withText = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer', text: 'Motto', color: '#BB212C', fontSize: 12, alignment: 'center', path: { mode: 'none' },
    });
    useCoatProjectStore.getState().replaceProject(withText);
    const before = JSON.parse(JSON.stringify(withText));
    render(<ColorBackgroundPanel locale="en" sectionToFocus="palettes" />);

    const historyBefore = useCoatProjectStore.getState().history.past.length;
    fireEvent.click(within(screen.getByRole('article', { name: 'Vampire Castle' })).getByRole('button', { name: 'Add' }));

    expect(useCoatProjectStore.getState().history.past).toHaveLength(historyBefore + 1);
    useCoatProjectStore.getState().undo();
    expect(useCoatProjectStore.getState().project).toEqual(before);
  });

  it('stores the chosen default palette in editor preferences', () => {
    render(<ColorBackgroundPanel locale="en" sectionToFocus="palettes" />);

    fireEvent.click(within(screen.getByRole('article', { name: 'Vampire Castle' })).getByRole('button', { name: 'Set as default' }));

    expect(loadEditorPreferences().defaultPaletteId).toBe('vampire-castle');
    expect(within(screen.getByRole('article', { name: 'Vampire Castle' })).getByText('Default')).toBeDefined();
    expect(within(screen.getByRole('article', { name: 'Vampire Castle' })).queryByRole('button', { name: 'Set as default' })).toBeNull();
  });

  it('paints the selected layer from a palette swatch', () => {
    const withText = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer', text: 'Motto', color: '#B11F24', fontSize: 12, alignment: 'center', path: { mode: 'none' },
    });
    const textLayer = withText.layers.at(-1);
    if (!textLayer) throw new Error('Expected added text layer');
    useCoatProjectStore.getState().replaceProject(withText);
    useCoatProjectStore.getState().setSelectedLayerIds([textLayer.id]);
    render(<ColorBackgroundPanel locale="en" sectionToFocus="palettes" />);

    fireEvent.click(screen.getByRole('button', { name: 'Vampire Castle Gules (#880808)' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === textLayer.id)).toMatchObject({ color: '#880808' });
  });
});
