// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { loadEditorPreferences, saveEditorPreferences } from '@/lib/coat-of-arms/editor-preferences';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ColorBackgroundPanel } from './ColorBackgroundPanel';

describe('ColorBackgroundPanel', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
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
});
