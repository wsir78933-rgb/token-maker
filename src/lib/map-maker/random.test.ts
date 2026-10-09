import { describe, expect, it } from 'vitest';

import {
  addMapMakerElement,
  addMapMakerLabel,
  createDefaultMapMakerProject,
  getMapMakerAsset,
  getMapMakerAssets,
  randomizeMapMakerBase,
  resizeMapMakerProject,
} from './index';
import type { MapMakerProject } from './types';

function createDeterministicMapMakerRandom(seed: number): () => number {
  let currentSeed = seed;
  return () => {
    currentSeed = (currentSeed * 48271) % 2_147_483_647;
    return currentSeed / 2_147_483_647;
  };
}

function assertMapMakerRandomSeams(project: MapMakerProject): void {
  const tilesByCoordinate = new Map(project.baseTiles.map((tile) => [`${tile.column}:${tile.row}`, tile]));
  for (const tile of project.baseTiles) {
    if (tile.source.kind !== 'asset') throw new Error(`Random tile ${tile.column}:${tile.row} is not catalog-backed.`);
    const asset = getMapMakerAsset(tile.source.assetId);
    if (asset.connections === undefined) {
      throw new Error(`Random tile asset ${JSON.stringify(asset.id)} has no edge metadata.`);
    }
    const [north, east, south, west] = asset.connections;
    if (tile.row === 0) expect(north).toBe('0');
    if (tile.column === project.columns - 1) expect(east).toBe('0');
    if (tile.row === project.rows - 1) expect(south).toBe('0');
    if (tile.column === 0) expect(west).toBe('0');

    const eastNeighbor = tilesByCoordinate.get(`${tile.column + 1}:${tile.row}`);
    if (eastNeighbor !== undefined) {
      if (eastNeighbor.source.kind !== 'asset') throw new Error('Random east neighbor is not catalog-backed.');
      expect(east).toBe(getMapMakerAsset(eastNeighbor.source.assetId).connections?.[3]);
    }

    const southNeighbor = tilesByCoordinate.get(`${tile.column}:${tile.row + 1}`);
    if (southNeighbor !== undefined) {
      if (southNeighbor.source.kind !== 'asset') throw new Error('Random south neighbor is not catalog-backed.');
      expect(south).toBe(getMapMakerAsset(southNeighbor.source.assetId).connections?.[0]);
    }
  }
}

function createMapMakerElementForRandomTest() {
  const geographyAsset = getMapMakerAssets().find((asset) => asset.category === 'geography');
  if (geographyAsset === undefined) throw new Error('Map Maker random test requires a geography asset.');
  return {
    id: 'random-test-element',
    source: { kind: 'asset' as const, assetId: geographyAsset.id },
    layer: 1 as const,
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    rotation: 0 as const,
    flipHorizontal: false,
    flipVertical: false,
  };
}

describe('Map Maker edge-matched random maps', () => {
  it('supplies four exact edge signatures for every coastline tile in the random pool', () => {
    const coastlineAssets = getMapMakerAssets().filter((asset) => asset.category === 'coastline');
    const assetIds = new Set<string>();
    expect(coastlineAssets).toHaveLength(1_082);

    for (const asset of coastlineAssets) {
      expect(assetIds.has(asset.id)).toBe(false);
      assetIds.add(asset.id);
      if (asset.connections === undefined) {
        throw new Error(`Coastline asset ${JSON.stringify(asset.id)} has no random edge metadata.`);
      }
      expect(asset.connections).toHaveLength(4);
      for (const signature of asset.connections) {
        expect(['0', '1', '2', '3', '-1', '-2', '-3', '4']).toContain(signature);
      }
    }
  });

  it('creates a legal 6 by 2 map and preserves the non-base layers', () => {
    const smallestProject = addMapMakerLabel(
      addMapMakerElement(
        resizeMapMakerProject(createDefaultMapMakerProject(), 6, 2),
        createMapMakerElementForRandomTest(),
      ),
      { id: 'random-label', text: 'North Bay', x: 0, y: 0, width: 100, height: 30, fontSize: 16 },
    );

    const randomizedProject = randomizeMapMakerBase(smallestProject, createDeterministicMapMakerRandom(17));

    expect(randomizedProject.baseTiles).toHaveLength(12);
    expect(randomizedProject.elements).toEqual(smallestProject.elements);
    expect(randomizedProject.labels).toEqual(smallestProject.labels);
    expect(randomizedProject.baseTiles).not.toBe(smallestProject.baseTiles);
    assertMapMakerRandomSeams(randomizedProject);
  });

  it('creates a legal 35 by 35 map at the maximum supported dimensions', () => {
    const maximumProject = resizeMapMakerProject(createDefaultMapMakerProject(), 35, 35);
    const randomizedProject = randomizeMapMakerBase(maximumProject, createDeterministicMapMakerRandom(29));

    expect(randomizedProject.baseTiles).toHaveLength(1_225);
    assertMapMakerRandomSeams(randomizedProject);
  });

  it('rejects random sources outside the [0, 1) range with the received value', () => {
    expect(() => randomizeMapMakerBase(createDefaultMapMakerProject(), () => 1)).toThrow('Received 1');
  });
});
