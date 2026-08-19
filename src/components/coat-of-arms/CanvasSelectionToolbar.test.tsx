// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject } from '@/lib/coat-of-arms/types';
import { CanvasSelectionToolbar } from './CanvasSelectionToolbar';

let nextId = 0;

function createToolbarProject(): CoatProject {
  const project = createDefaultProject('en');
  const withStableIds: CoatProject = {
    ...project,
    layers: project.layers.map((layer, index) => ({
      ...layer,
      id: index === 0 ? 'background-1' : 'shield-1',
    })),
  };
  const withCharge = applyProjectCommand(withStableIds, {
    type: 'add-layer',
    assetId: 'material-animal-lion-rampant',
  });
  return {
    ...withCharge,
    layers: withCharge.layers.map((layer) => (
      layer.type === 'charge' ? { ...layer, id: 'charge-1' } : layer
    )),
  };
}

function renderToolbar(project: CoatProject, selectedLayerIds: string[], locale: 'en' | 'zh' = 'en') {
  useCoatProjectStore.getState().replaceProject(project);
  useCoatProjectStore.getState().setSelectedLayerIds(selectedLayerIds);
  return render(<CanvasSelectionToolbar locale={locale} />);
}

function getLayer(layerId: string) {
  const layer = useCoatProjectStore.getState().project.layers.find((candidate) => candidate.id === layerId);
  if (!layer) throw new Error(`Expected layer: ${layerId}`);
  return layer;
}

describe('CanvasSelectionToolbar', () => {
  beforeEach(() => {
    nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `generated-${nextId++}` });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('duplicates the selected unlocked layer and moves selection to the copy', () => {
    const project = createToolbarProject();
    const layerIdsBefore = new Set(project.layers.map((layer) => layer.id));
    renderToolbar(project, ['charge-1']);

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate selected element' }));

    const addedLayers = useCoatProjectStore.getState().project.layers.filter((layer) => !layerIdsBefore.has(layer.id));
    expect(addedLayers).toHaveLength(1);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([addedLayers[0]!.id]);
  });

  it('flips the selected layer horizontally', () => {
    renderToolbar(createToolbarProject(), ['charge-1']);

    fireEvent.click(screen.getByRole('button', { name: 'Flip selected element horizontally' }));

    expect(getLayer('charge-1')).toMatchObject({ transform: { flipHorizontal: true } });
  });

  it('moves the selected layer from the layer-order menu', () => {
    const project = createToolbarProject();
    const chargeIndexBefore = project.layers.findIndex((layer) => layer.id === 'charge-1');
    renderToolbar(project, ['charge-1']);

    fireEvent.click(screen.getByRole('button', { name: 'Selected element layer order' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'To back' }));

    expect(useCoatProjectStore.getState().project.layers.findIndex((layer) => layer.id === 'charge-1'))
      .toBeLessThan(chargeIndexBefore);
  });

  it('deletes the selected unlocked layer and clears the selection', () => {
    renderToolbar(createToolbarProject(), ['charge-1']);

    fireEvent.click(screen.getByRole('button', { name: 'Delete selected element' }));

    expect(useCoatProjectStore.getState().project.layers.some((layer) => layer.id === 'charge-1')).toBe(false);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([]);
  });

  it('locks and unlocks the selected layer', () => {
    renderToolbar(createToolbarProject(), ['charge-1']);

    fireEvent.click(screen.getByRole('button', { name: 'Lock selected element' }));
    expect(getLayer('charge-1')).toMatchObject({ locked: true });

    fireEvent.click(screen.getByRole('button', { name: 'Unlock selected element' }));
    expect(getLayer('charge-1')).toMatchObject({ locked: false });
  });

  it('hides and shows the selected layer', () => {
    renderToolbar(createToolbarProject(), ['charge-1']);

    fireEvent.click(screen.getByRole('button', { name: 'Hide selected element' }));
    expect(getLayer('charge-1')).toMatchObject({ visible: false });

    fireEvent.click(screen.getByRole('button', { name: 'Show selected element' }));
    expect(getLayer('charge-1')).toMatchObject({ visible: true });
  });

  it('disables edit actions while the selected layer is locked', () => {
    const locked = applyProjectCommand(createToolbarProject(), {
      type: 'set-layer-lock', layerId: 'charge-1', locked: true,
    });
    renderToolbar(locked, ['charge-1']);

    expect(screen.getByRole('button', { name: 'Duplicate selected element' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Unlock selected element' })).toHaveProperty('disabled', false);
  });

  it('uses Chinese action labels on the Chinese workbench', () => {
    renderToolbar(createToolbarProject(), ['charge-1'], 'zh');

    expect(screen.getByRole('button', { name: '复制选中元素' })).toBeDefined();
    expect(screen.getByRole('button', { name: '水平翻转选中元素' })).toBeDefined();
    expect(screen.getByRole('button', { name: '删除选中元素' })).toBeDefined();
  });
});
