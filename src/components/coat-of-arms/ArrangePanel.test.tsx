// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ArrangePanel, formatArrangeNumberForDisplay, readArrangeNumberInput } from './ArrangePanel';

function createProjectWithCharges() {
  return ['material-animal-wolf-rampant', 'material-symbol-shooting-star'].reduce(
    (project, assetId) => applyProjectCommand(project, { type: 'add-layer', assetId }),
    createDefaultProject('en'),
  );
}

describe('ArrangePanel', () => {
  beforeEach(() => {
    const project = createProjectWithCharges();
    const layerIds = project.layers.slice(-2).map((layer) => layer.id);
    useCoatProjectStore.getState().replaceProject(project);
    useCoatProjectStore.getState().setSelectedLayerIds(layerIds);
  });

  afterEach(() => {
    cleanup();
  });

  it('uses the store-selected ids for alignment commands', () => {
    render(<ArrangePanel locale="en" />);
    const selectedLayerIds = useCoatProjectStore.getState().selectedLayerIds;

    fireEvent.click(screen.getByRole('button', { name: 'Center' }));

    const project = useCoatProjectStore.getState().project;
    expect(project.layers.filter((layer) => selectedLayerIds.includes(layer.id)).map((layer) => {
      if (layer.type === 'background') throw new Error(`Expected movable layer: ${layer.id}`);
      return layer.transform.x;
    })).toEqual([50, 50]);
  });

  it('retains precise position controls for one selected movable layer', () => {
    const selectedLayerId = useCoatProjectStore.getState().selectedLayerIds[0];
    if (!selectedLayerId) throw new Error('Expected selected charge');
    useCoatProjectStore.getState().setSelectedLayerIds([selectedLayerId]);
    render(<ArrangePanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Position X'), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText('Position rotation'), { target: { value: '15' } });

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === selectedLayerId)).toMatchObject({
      transform: { x: 12, rotation: 15 },
    });
  });

  it('does not expose crop editor controls for a selected layer', () => {
    const selectedLayerId = useCoatProjectStore.getState().selectedLayerIds[0];
    if (!selectedLayerId) throw new Error('Expected selected charge');
    useCoatProjectStore.getState().setSelectedLayerIds([selectedLayerId]);
    render(<ArrangePanel locale="en" />);

    expect(screen.getByRole('group', { name: 'Position' })).toBeDefined();
    expect(screen.queryByRole('group', { name: 'Flip selected layer' })).toBeNull();
    expect(screen.queryByRole('group', { name: 'Flip & crop' })).toBeNull();
    expect(screen.queryByLabelText('Crop left')).toBeNull();
    expect(screen.queryByLabelText('Crop top')).toBeNull();
    expect(screen.queryByLabelText('Crop width')).toBeNull();
    expect(screen.queryByLabelText('Crop height')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Reset crop' })).toBeNull();
  });

  it('applies the aspect-locked selected size through one typed project command', () => {
    const selectedLayerId = useCoatProjectStore.getState().selectedLayerIds[0];
    if (!selectedLayerId) throw new Error('Expected selected charge');
    useCoatProjectStore.getState().setSelectedLayerIds([selectedLayerId]);
    render(<ArrangePanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Width (%)'), { target: { value: '160' } });

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === selectedLayerId)).toMatchObject({
      transform: { scaleX: 1.6, scaleY: 1.6 },
    });
  });

  it('shows only the CoaMaker placeholder when no layer is selected', () => {
    useCoatProjectStore.getState().setSelectedLayerIds([]);
    render(<ArrangePanel locale="en" />);

    expect(screen.getByText('Select an element to see position options.')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Center' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Group selected layers' })).toBeNull();
    expect(screen.queryByLabelText('Position X')).toBeNull();
  });

  it('rounds position numbers for display without changing store precision', () => {
    const selectedLayerId = useCoatProjectStore.getState().selectedLayerIds[0];
    if (!selectedLayerId) throw new Error('Expected selected charge');
    const selectedLayer = useCoatProjectStore.getState().project.layers.find((layer) => layer.id === selectedLayerId);
    if (!selectedLayer || selectedLayer.type === 'background' || !('transform' in selectedLayer)) {
      throw new Error(`Expected transform layer: ${String(selectedLayerId)}`);
    }
    const preciseX = 3.556485355648533;
    useCoatProjectStore.getState().setSelectedLayerIds([selectedLayerId]);
    useCoatProjectStore.getState().dispatch({
      type: 'update-layer',
      layerId: selectedLayerId,
      patch: { transform: { ...selectedLayer.transform, x: preciseX } },
    });
    render(<ArrangePanel locale="en" />);

    const xInput = screen.getByLabelText('Position X') as HTMLInputElement;
    expect(xInput.value).toBe('4');
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === selectedLayerId)).toMatchObject({
      transform: { x: preciseX },
    });
  });

  it('rejects non-numeric arrange input with the raw string', () => {
    expect(formatArrangeNumberForDisplay(3.556485355648533)).toBe('4');
    expect(readArrangeNumberInput('12')).toBe(12);
    expect(() => readArrangeNumberInput('not-a-number')).toThrow('Invalid arrange number input: not-a-number');
    expect(() => readArrangeNumberInput('')).toThrow('Invalid arrange number input: ');
    expect(() => readArrangeNumberInput('   ')).toThrow('Invalid arrange number input:    ');
    expect(() => readArrangeNumberInput('Infinity')).toThrow('Invalid arrange number input: Infinity');
    expect(() => readArrangeNumberInput('-Infinity')).toThrow('Invalid arrange number input: -Infinity');
    expect(() => formatArrangeNumberForDisplay(Number.NaN)).toThrow('Invalid arrange display number: NaN');
    expect(() => formatArrangeNumberForDisplay(Number.POSITIVE_INFINITY)).toThrow('Invalid arrange display number: Infinity');
    expect(() => formatArrangeNumberForDisplay(Number.NEGATIVE_INFINITY)).toThrow('Invalid arrange display number: -Infinity');
  });

  it('exposes free CoaMaker order and alignment actions when a layer is selected', () => {
    render(<ArrangePanel locale="en" />);

    expect(screen.getByRole('button', { name: 'Left' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Center' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Right' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Top' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Middle' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Bottom' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Forward' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Backward' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'To front' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'To back' })).toBeDefined();
  });
});
