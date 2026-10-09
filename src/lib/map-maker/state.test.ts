import { describe, expect, it } from 'vitest';

import {
  addMapMakerElement,
  addMapMakerLabel,
  clearMapMakerElementLayer,
  createDefaultMapMakerProject,
  getMapMakerAssets,
  resetMapMakerBase,
  resetMapMakerBaseTiles,
  resetMapMakerProject,
  replaceMapMakerBaseTiles,
  resizeMapMakerProject,
  transformMapMakerBaseTiles,
  updateMapMakerSettings,
} from './index';
import type { MapMakerElement, MapMakerLabel } from './types';

function createElement(id: string, layer: 1 | 2): MapMakerElement {
  const asset = getMapMakerAssets().find((candidate) => candidate.category === 'geography');
  if (asset === undefined) throw new Error('Map Maker test requires a geography asset.');
  return {
    id,
    source: { kind: 'asset', assetId: asset.id },
    layer,
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  };
}

function createLabel(id: string, x: number, y: number): MapMakerLabel {
  return { id, text: 'Westmere', x, y, width: 140, height: 30, fontSize: 18 };
}

describe('Map Maker project state', () => {
  it('creates a 12 by 6 sea map and resizes to the supported 6 by 2 boundary', () => {
    const defaultProject = createDefaultMapMakerProject();
    expect(defaultProject.columns).toBe(12);
    expect(defaultProject.rows).toBe(6);
    expect(defaultProject.baseTiles).toHaveLength(72);

    const smallestProject = resizeMapMakerProject(defaultProject, 6, 2);
    expect(smallestProject.columns).toBe(6);
    expect(smallestProject.rows).toBe(2);
    expect(smallestProject.baseTiles).toHaveLength(12);
    expect(smallestProject.baseTiles.every((tile) => tile.source.kind === 'asset' && tile.source.assetId === 's0')).toBe(true);
    expect(() => resizeMapMakerProject(defaultProject, 5, 2)).toThrow('Received 5');
  });

  it('preserves prior project state when adding an element and clearing only its selected layer', () => {
    const originalProject = createDefaultMapMakerProject();
    const withElements = addMapMakerElement(
      addMapMakerElement(originalProject, createElement('tree-a', 1)),
      createElement('hill-b', 2),
    );

    const layerOneCleared = clearMapMakerElementLayer(withElements, 1);
    expect(originalProject.elements).toEqual([]);
    expect(withElements.elements.map((element) => element.id)).toEqual(['tree-a', 'hill-b']);
    expect(layerOneCleared.elements.map((element) => element.id)).toEqual(['hill-b']);
    expect(layerOneCleared.baseTiles).not.toBe(withElements.baseTiles);
    expect(() => clearMapMakerElementLayer(withElements, 3 as 1 | 2)).toThrow('Received 3');
  });

  it('replaces, rotates, mirrors, and resets only selected base cells', () => {
    const originalProject = createDefaultMapMakerProject();
    const selectedCells = [{ column: 0, row: 0 }, { column: 1, row: 0 }] as const;
    const replacedProject = replaceMapMakerBaseTiles(originalProject, selectedCells, { kind: 'asset', assetId: 'l0' });
    const transformedProject = transformMapMakerBaseTiles(replacedProject, selectedCells, {
      rotation: 90,
      flipHorizontal: true,
    });
    const resetProject = resetMapMakerBaseTiles(transformedProject, [selectedCells[0]]);

    expect(originalProject.baseTiles[0]?.source).toEqual({ kind: 'asset', assetId: 's0' });
    expect(transformedProject.baseTiles[0]).toMatchObject({ rotation: 90, flipHorizontal: true });
    expect(resetProject.baseTiles[0]).toMatchObject({
      source: { kind: 'asset', assetId: 's0' },
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
    });
    expect(resetProject.baseTiles[1]).toMatchObject({ source: { kind: 'asset', assetId: 'l0' }, rotation: 90 });
  });

  it('keeps elements and labels when resetting only the base and clears them on full reset', () => {
    const populatedProject = addMapMakerLabel(
      addMapMakerElement(createDefaultMapMakerProject(), createElement('tree-a', 1)),
      createLabel('label-a', 30, 40),
    );
    const baseReset = resetMapMakerBase(populatedProject);
    expect(baseReset.elements).toHaveLength(1);
    expect(baseReset.labels).toHaveLength(1);
    expect(baseReset.baseTiles.every((tile) => tile.source.kind === 'asset' && tile.source.assetId === 's0')).toBe(true);

    const fullReset = resetMapMakerProject(populatedProject);
    expect(fullReset.elements).toEqual([]);
    expect(fullReset.labels).toEqual([]);
    expect(fullReset.baseTiles).toHaveLength(72);
  });

  it('rebuilds the base, clears both layers, and keeps labels within resized bounds', () => {
    const populatedProject = addMapMakerLabel(
      addMapMakerElement(
        addMapMakerElement(createDefaultMapMakerProject(), createElement('tree-a', 1)),
        createElement('hill-b', 2),
      ),
      createLabel('label-a', 700, 390),
    );
    const resizedProject = resizeMapMakerProject(populatedProject, 6, 2);

    expect(resizedProject.baseTiles).toHaveLength(12);
    expect(resizedProject.elements).toEqual([]);
    expect(resizedProject.labels[0]).toMatchObject({ x: 280, y: 110, width: 140, height: 30 });
    expect(populatedProject.elements).toHaveLength(2);
    expect(populatedProject.labels[0]?.x).toBe(700);
  });

  it('accepts decimal hex sizes and rejects out-of-range or non-step values', () => {
    const project = createDefaultMapMakerProject();
    for (let tenths = 10; tenths <= 150; tenths += 1) {
      const hexSizePercent = tenths / 10;
      expect(updateMapMakerSettings(project, { hexSizePercent }).settings.hexSizePercent).toBe(hexSizePercent);
    }
    expect(updateMapMakerSettings(project, { hexSizePercent: 1.2 }).settings.hexSizePercent).toBe(1.2);
    expect(updateMapMakerSettings(project, { hexSizePercent: 15.0 }).settings.hexSizePercent).toBe(15);
    expect(() => updateMapMakerSettings(project, { hexSizePercent: 0.3 })).toThrow('Received 0.3');
    expect(() => updateMapMakerSettings(project, { hexSizePercent: 1.25 })).toThrow('Received 1.25');
  });
});
