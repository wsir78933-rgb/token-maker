// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { TextPathPlacement } from '@/lib/coat-of-arms/types';
import { TextSelectionToolbar } from './TextSelectionToolbar';
import { getCoatWorkbenchCopy } from './workbench-copy';

const DEFAULT_RING_PATH = {
  mode: 'ring', radius: 40, facing: 'out', layout: 'full', spacing: 'natural', startAngle: 0,
} as const satisfies TextPathPlacement;

const UPPER_CURVE_PATH = {
  mode: 'curve', startX: 10, startY: 72, controlX: 50, controlY: 30, endX: 90, endY: 72,
} as const satisfies TextPathPlacement;

function createSelectedTextProject(path: TextPathPlacement = { mode: 'none' }) {
  const project = applyProjectCommand(createDefaultProject('en'), {
    type: 'add-text-layer', text: 'EDIT ME', color: '#B11F24', fontSize: 40,
    alignment: 'center', path,
  });
  const textLayer = project.layers.at(-1);
  if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
  useCoatProjectStore.getState().replaceProject(project);
  useCoatProjectStore.getState().setSelectedLayerIds([textLayer.id]);
  return textLayer.id;
}

function getTextLayer(textLayerId: string) {
  const layer = useCoatProjectStore.getState().project.layers.find((candidate) => candidate.id === textLayerId);
  if (!layer || layer.type !== 'text') throw new Error(`Expected text layer: ${textLayerId}`);
  return layer;
}

describe('TextSelectionToolbar', () => {
  beforeEach(() => {
    let nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `toolbar-generated-id-${nextId++}` });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders competitor-order controls for one selected text layer', () => {
    createSelectedTextProject();
    render(<TextSelectionToolbar locale="en" />);

    expect(screen.getByRole('combobox', { name: 'Font' })).toBeDefined();
    expect(screen.getByRole('combobox', { name: 'Font' }).tagName).toBe('SELECT');
    expect(screen.getByRole('spinbutton', { name: 'Font size' })).toHaveProperty('value', '40');
    expect(screen.getByLabelText('Text colour picker')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Underline' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Left' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Center' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Right' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Styles' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Lock' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Hide' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Duplicate' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDefined();
  });

  it('uses a native font select and keeps the colour input outside interactive buttons', () => {
    const textLayerId = createSelectedTextProject();
    render(<TextSelectionToolbar locale="en" />);

    const fontSelect = screen.getByRole('combobox', { name: 'Font' }) as HTMLSelectElement;
    fireEvent.change(fontSelect, { target: { value: 'blackletter' } });
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === textLayerId)).toMatchObject({ fontFamily: 'blackletter' });
    const colourInput = screen.getByLabelText('Text colour picker');
    expect(colourInput.closest('button')).toBeNull();
  });

  it('applies typography, alignment, and stroke edits live through public commands', () => {
    const textLayerId = createSelectedTextProject();
    render(<TextSelectionToolbar locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    fireEvent.click(screen.getByRole('button', { name: 'Underline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Left' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Font size' }), { target: { value: '56' } });
    fireEvent.click(screen.getByRole('button', { name: 'Styles' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Stroke width' }), { target: { value: '1.5' } });

    const editedText = useCoatProjectStore.getState().project.layers.find((layer) => layer.id === textLayerId);
    expect(editedText).toMatchObject({
      type: 'text', fontWeight: 'bold', fontStyle: 'italic', underline: true, alignment: 'left', fontSize: 56, strokeWidth: 1.5,
    });
  });

  it('exposes ring-toolbar in/out/arc/even labels with full aria text', () => {
    const englishToolbar = getCoatWorkbenchCopy('en').panels.textFeature.toolbar;
    const chineseToolbar = getCoatWorkbenchCopy('zh').panels.textFeature.toolbar;
    expect(englishToolbar.in).toEqual({ label: 'IN', ariaLabel: 'Face text inward' });
    expect(englishToolbar.out).toEqual({ label: 'OUT', ariaLabel: 'Face text outward' });
    expect(englishToolbar.arc).toEqual({ label: 'ARC', ariaLabel: 'Arc text' });
    expect(englishToolbar.even).toEqual({ label: 'EVEN', ariaLabel: 'Space letters evenly' });
    expect(chineseToolbar.in).toEqual({ label: '朝内', ariaLabel: '文字朝内排列' });
    expect(chineseToolbar.out).toEqual({ label: '朝外', ariaLabel: '文字朝外排列' });
    expect(chineseToolbar.arc).toEqual({ label: '弧', ariaLabel: '弧形排列' });
    expect(chineseToolbar.even).toEqual({ label: '均匀', ariaLabel: '均匀分布文字' });
    for (const control of [englishToolbar.in, englishToolbar.out, englishToolbar.arc, englishToolbar.even, chineseToolbar.in, chineseToolbar.out, chineseToolbar.arc, chineseToolbar.even]) {
      expect(control.ariaLabel.length).toBeGreaterThan(control.label.length);
      expect(control.ariaLabel).not.toBe(control.label);
    }
  });

  it('replaces emphasis and alignment with IN/OUT/ARC/EVEN when path.mode is ring', () => {
    createSelectedTextProject(DEFAULT_RING_PATH);
    render(<TextSelectionToolbar locale="en" />);

    const inward = screen.getByRole('button', { name: 'Face text inward' });
    const outward = screen.getByRole('button', { name: 'Face text outward' });
    const arc = screen.getByRole('button', { name: 'Arc text' });
    const even = screen.getByRole('button', { name: 'Space letters evenly' });
    expect(inward).toHaveProperty('textContent', 'IN');
    expect(outward).toHaveProperty('textContent', 'OUT');
    expect(arc).toHaveProperty('textContent', 'ARC');
    expect(even).toHaveProperty('textContent', 'EVEN');
    expect(inward.getAttribute('aria-pressed')).toBe('false');
    expect(outward.getAttribute('aria-pressed')).toBe('true');
    expect(arc.getAttribute('aria-pressed')).toBe('false');
    expect(even.getAttribute('aria-pressed')).toBe('false');
    expect(screen.queryByRole('button', { name: 'Bold' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Italic' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Underline' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Left' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Center' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Right' })).toBeNull();
    expect(screen.getByRole('combobox', { name: 'Font' })).toBeDefined();
    expect(screen.getByRole('spinbutton', { name: 'Font size' })).toBeDefined();
    expect(screen.getByLabelText('Text colour picker')).toBeDefined();
  });

  it('keeps emphasis and alignment for none and curve text', () => {
    createSelectedTextProject({ mode: 'none' });
    const { unmount } = render(<TextSelectionToolbar locale="en" />);
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Center' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Face text inward' })).toBeNull();
    unmount();

    createSelectedTextProject(UPPER_CURVE_PATH);
    render(<TextSelectionToolbar locale="en" />);
    expect(screen.getByRole('button', { name: 'Italic' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Right' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Arc text' })).toBeNull();
  });

  it('applies ring facing through update-layer', () => {
    const textLayerId = createSelectedTextProject(DEFAULT_RING_PATH);
    render(<TextSelectionToolbar locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Face text inward' }));
    expect(getTextLayer(textLayerId).path).toEqual({ ...DEFAULT_RING_PATH, facing: 'in' });
    fireEvent.click(screen.getByRole('button', { name: 'Face text outward' }));
    expect(getTextLayer(textLayerId).path).toEqual(DEFAULT_RING_PATH);
  });

  it('toggles arc layout back to full on a second press', () => {
    const textLayerId = createSelectedTextProject(DEFAULT_RING_PATH);
    render(<TextSelectionToolbar locale="en" />);
    const arc = screen.getByRole('button', { name: 'Arc text' });

    fireEvent.click(arc);
    expect(getTextLayer(textLayerId).path).toEqual({ ...DEFAULT_RING_PATH, layout: 'arc' });
    expect(arc.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(arc);
    expect(getTextLayer(textLayerId).path).toEqual(DEFAULT_RING_PATH);
    expect(arc.getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles even spacing back to natural on a second press', () => {
    const textLayerId = createSelectedTextProject(DEFAULT_RING_PATH);
    render(<TextSelectionToolbar locale="en" />);
    const even = screen.getByRole('button', { name: 'Space letters evenly' });

    fireEvent.click(even);
    expect(getTextLayer(textLayerId).path).toEqual({ ...DEFAULT_RING_PATH, spacing: 'even' });
    expect(even.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(even);
    expect(getTextLayer(textLayerId).path).toEqual(DEFAULT_RING_PATH);
    expect(even.getAttribute('aria-pressed')).toBe('false');
  });

  it('disables ring facing controls while the layer is locked', () => {
    const textLayerId = createSelectedTextProject(DEFAULT_RING_PATH);
    useCoatProjectStore.getState().dispatch({ type: 'set-layer-lock', layerId: textLayerId, locked: true });
    render(<TextSelectionToolbar locale="en" />);

    const inward = screen.getByRole('button', { name: 'Face text inward' });
    const outward = screen.getByRole('button', { name: 'Face text outward' });
    const arc = screen.getByRole('button', { name: 'Arc text' });
    const even = screen.getByRole('button', { name: 'Space letters evenly' });
    expect(inward).toHaveProperty('disabled', true);
    expect(outward).toHaveProperty('disabled', true);
    expect(arc).toHaveProperty('disabled', true);
    expect(even).toHaveProperty('disabled', true);
    expect(getTextLayer(textLayerId).path).toEqual(DEFAULT_RING_PATH);
  });

  it('keeps ring startAngle when toggling IN, OUT, ARC, and EVEN', () => {
    const rotatedRingPath = { ...DEFAULT_RING_PATH, startAngle: 90 };
    const textLayerId = createSelectedTextProject(rotatedRingPath);
    render(<TextSelectionToolbar locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Face text inward' }));
    expect(getTextLayer(textLayerId).path).toEqual({ ...rotatedRingPath, facing: 'in' });
    fireEvent.click(screen.getByRole('button', { name: 'Arc text' }));
    expect(getTextLayer(textLayerId).path).toEqual({ ...rotatedRingPath, facing: 'in', layout: 'arc' });
    fireEvent.click(screen.getByRole('button', { name: 'Space letters evenly' }));
    expect(getTextLayer(textLayerId).path).toEqual({
      ...rotatedRingPath, facing: 'in', layout: 'arc', spacing: 'even',
    });
  });
});
