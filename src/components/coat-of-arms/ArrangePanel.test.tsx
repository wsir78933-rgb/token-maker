// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ArrangePanel } from './ArrangePanel';

function createProjectWithCharges() {
  return ['material-animal-lion-rampant', 'material-symbol-eight-point-star'].reduce(
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

  it('uses the store-selected ids for alignment and grouping commands', () => {
    render(<ArrangePanel locale="en" />);
    const selectedLayerIds = useCoatProjectStore.getState().selectedLayerIds;

    fireEvent.click(screen.getByRole('button', { name: 'Center' }));
    fireEvent.click(screen.getByRole('button', { name: 'Group selected layers' }));

    const project = useCoatProjectStore.getState().project;
    expect(project.layers.filter((layer) => selectedLayerIds.includes(layer.id)).map((layer) => {
      if (layer.type === 'background') throw new Error(`Expected movable layer: ${layer.id}`);
      return layer.transform.x;
    })).toEqual([50, 50]);
    expect(new Set(project.layers.filter((layer) => selectedLayerIds.includes(layer.id)).map((layer) => layer.groupId))).toEqual(new Set([project.groups[0]?.id]));
  });

  it('retains the former precise position, crop, and flip controls for one selected movable layer', () => {
    const selectedLayerId = useCoatProjectStore.getState().selectedLayerIds[0];
    if (!selectedLayerId) throw new Error('Expected selected charge');
    useCoatProjectStore.getState().setSelectedLayerIds([selectedLayerId]);
    render(<ArrangePanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Position X'), { target: { value: '12' } });
    fireEvent.click(screen.getByRole('button', { name: 'Flip horizontal' }));
    fireEvent.change(screen.getByLabelText('Crop width'), { target: { value: '80' } });

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === selectedLayerId)).toMatchObject({
      transform: { x: 12, flipHorizontal: true, crop: { x: 0, y: 0, width: 80, height: 110 } },
    });
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
});
