import { describe, expect, it } from 'vitest';

import {
  addTownObject,
  clearTownLayer,
  clearTownObjects,
  copyTownObject,
  createTownDocument,
  deleteTownObject,
  getTownObject,
  resizeTownCanvas,
  selectTownObject,
  setTownActiveLayer,
  setTownBackground,
  setTownLayerVisibility,
  updateTownObject,
  validateTownDocument,
} from './document';
import type { TownDocument } from './types';

const HOUSE_ONE = 'buildings-house-01-cottage';
const HOUSE_TWO = 'buildings-house-02-hip-cottage';
const NEUTRAL_ASSET = 'props-sack';

function savedTownMap1200By635(): TownDocument {
  return {
    version: 1,
    width: 1200,
    height: 635,
    backgroundColor: '#e5ddc4',
    backgroundImageUrl: '',
    activeLayer: 'lower',
    layers: [
      { id: 'lower', visible: true, objects: [] },
      { id: 'middle', visible: true, objects: [] },
      { id: 'upper', visible: true, objects: [] },
    ],
  };
}

function objectsIn(document: TownDocument, layerId: 'lower' | 'middle' | 'upper') {
  const layer = document.layers.find((candidate) => candidate.id === layerId);
  if (layer === undefined) {
    throw new Error(`Missing test layer ${layerId}.`);
  }
  return layer.objects;
}

describe('town document commands', () => {
  it('creates the requested canvas, background, and three visible layers', () => {
    const document = createTownDocument();

    expect(document).toEqual({
      version: 1,
      width: 1200,
      height: 800,
      backgroundColor: '#e5ddc4',
      backgroundImageUrl: '',
      activeLayer: 'lower',
      layers: [
        { id: 'lower', visible: true, objects: [] },
        { id: 'middle', visible: true, objects: [] },
        { id: 'upper', visible: true, objects: [] },
      ],
    });
    expect(validateTownDocument(document)).toEqual(document);
  });

  it('adds at the active layer, defaults to canvas center, and keeps inputs unchanged', () => {
    const original = createTownDocument();
    const withHouse = addTownObject(original, HOUSE_ONE, 'wood', 'house-1');

    expect(original).toEqual(createTownDocument());
    expect(objectsIn(withHouse, 'lower')).toEqual([{
      id: 'house-1',
      assetId: HOUSE_ONE,
      material: 'wood',
      x: 536,
      y: 336,
      width: 128,
      height: 128,
      rotationDegrees: 0,
    }]);

    const withPoint = addTownObject(withHouse, HOUSE_TWO, 'stone', 'house-2', { x: 42, y: 84 });
    expect(objectsIn(withPoint, 'lower')[1]).toMatchObject({ id: 'house-2', x: 42, y: 84 });
  });

  it('selects within one layer by moving the object to the front without changing active layer', () => {
    const base = setTownActiveLayer(createTownDocument(), 'middle');
    const withObjects = addTownObject(
      addTownObject(addTownObject(base, HOUSE_ONE, 'wood', 'first'), HOUSE_TWO, 'stone', 'second'),
      NEUTRAL_ASSET,
      'neutral',
      'third',
    );
    const selected = selectTownObject(withObjects, 'first');

    expect(selected.activeLayer).toBe('middle');
    expect(objectsIn(selected, 'middle').map((object) => object.id)).toEqual(['second', 'third', 'first']);
    expect(objectsIn(withObjects, 'middle').map((object) => object.id)).toEqual(['first', 'second', 'third']);
  });

  it('copies across layers while preserving transform and active layer', () => {
    const base = setTownActiveLayer(createTownDocument(), 'lower');
    const source = updateTownObject(
      addTownObject(base, HOUSE_ONE, 'clay', 'source', { x: 90, y: 110 }),
      'source',
      { width: 210, height: 180, rotationDegrees: 37 },
    );
    const copied = copyTownObject(source, 'source', 'upper', 'copy');
    const sourceObject = getTownObject(copied, 'source');
    const copyObject = getTownObject(copied, 'copy');

    expect(copied.activeLayer).toBe('lower');
    expect(copyObject).toMatchObject({
      ...sourceObject,
      id: 'copy',
    });
    expect(objectsIn(copied, 'lower').map((object) => object.id)).toEqual(['source']);
    expect(objectsIn(copied, 'upper').map((object) => object.id)).toEqual(['copy']);
  });

  it('updates, deletes, toggles, clears, resizes, and changes the background purely', () => {
    const base = addTownObject(createTownDocument(), HOUSE_ONE, 'sandstone', 'house');
    const updated = updateTownObject(base, 'house', {
      x: 20,
      y: 30,
      width: 160,
      height: 140,
      rotationDegrees: -12,
    });
    const resized = resizeTownCanvas(updated, 800, 600);
    const background = setTownBackground(resized, {
      color: '#ABC123',
      imageUrl: 'https://cdn.example.test/town.png',
    });
    const hidden = setTownLayerVisibility(background, 'lower', false);
    const clearedLayer = clearTownLayer(hidden, 'lower');

    expect(base.width).toBe(1200);
    expect(updated.width).toBe(1200);
    expect(resized.width).toBe(800);
    expect(objectsIn(resized, 'lower')[0]).toMatchObject({ x: 20, y: 30, width: 160, height: 140 });
    expect(clearedLayer.backgroundColor).toBe('#ABC123');
    expect(clearedLayer.backgroundImageUrl).toBe('https://cdn.example.test/town.png');
    expect(clearedLayer.layers[0]?.visible).toBe(false);
    expect(objectsIn(clearedLayer, 'lower')).toEqual([]);
    expect(objectsIn(deleteTownObject(background, 'house'), 'lower')).toEqual([]);
    expect(objectsIn(clearTownObjects(background), 'lower')).toEqual([]);
  });
});

describe('town document validation boundaries', () => {
  it.each([
    ['too narrow', { width: 63 }],
    ['too wide', { width: 4097 }],
    ['too short', { height: 63 }],
    ['too tall', { height: 4097 }],
    ['non-finite height', { height: Number.NaN }],
    ['bad color', { backgroundColor: 'beige' }],
    ['bad image URL', { backgroundImageUrl: 'javascript:alert(1)' }],
    ['unknown asset', {
      layers: [
        { id: 'lower', visible: true, objects: [{ id: 'bad', assetId: 'missing', material: 'neutral', x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 }] },
        { id: 'middle', visible: true, objects: [] },
        { id: 'upper', visible: true, objects: [] },
      ],
    }],
  ])('rejects %s with the received value', (_label, change) => {
    const invalid = { ...createTownDocument(), ...change } as unknown;
    expect(() => validateTownDocument(invalid)).toThrow();
  });

  it('rejects duplicate IDs, unsupported materials, duplicate layers, and extra keys', () => {
    const document = addTownObject(createTownDocument(), HOUSE_ONE, 'wood', 'same');
    const duplicate = {
      ...document,
      layers: document.layers.map((layer, index) =>
        index === 1 ? { ...layer, objects: [{ ...objectsIn(document, 'lower')[0] }] } : layer,
      ),
    };
    expect(() => validateTownDocument(duplicate)).toThrow('duplicate object id');

    const unsupported = {
      ...document,
      layers: document.layers.map((layer, index) =>
        index === 0 ? { ...layer, objects: [{ ...objectsIn(document, 'lower')[0], material: 'neutral' }] } : layer,
      ),
    };
    expect(() => validateTownDocument(unsupported)).toThrow('does not support material');

    const duplicateLayer = {
      ...document,
      layers: [
        { ...document.layers[0], objects: [] },
        { ...document.layers[0], objects: [] },
        { ...document.layers[2] },
      ],
    };
    expect(() => validateTownDocument(duplicateLayer)).toThrow('exactly once');

    expect(() => validateTownDocument({ ...document, unexpected: true })).toThrow('unexpected');
  });

  it('rejects duplicate IDs and invalid command inputs before producing a new document', () => {
    const document = addTownObject(createTownDocument(), HOUSE_ONE, 'wood', 'house');
    expect(() => addTownObject(document, HOUSE_TWO, 'wood', 'house')).toThrow('duplicate object id');
    expect(() => addTownObject(document, HOUSE_TWO, 'glass' as never, 'new-house')).toThrow('invalid');
    expect(() => addTownObject(document, HOUSE_TWO, 'wood', 'new-house', { x: Number.POSITIVE_INFINITY, y: 0 })).toThrow('finite');
    expect(() => updateTownObject(document, 'house', { width: 0 })).toThrow('greater than 0');
    expect(() => getTownObject(document, 'missing')).toThrow('missing');
    expect(() => resizeTownCanvas(document, 63, 635)).toThrow('63');
    expect(() => setTownBackground(document, { color: '#ffffff', imageUrl: 'data:text/html,unsafe' })).toThrow('data:image');
  });

  it('keeps a saved 1200 by 635 map at that size and does not move objects when resized', () => {
    const saved = savedTownMap1200By635();
    const loaded = validateTownDocument(JSON.parse(JSON.stringify(saved)));
    const withHouse = addTownObject(loaded, HOUSE_ONE, 'wood', 'legacy-house');
    const resized = resizeTownCanvas(withHouse, 1600, 900);

    expect(saved).toEqual(savedTownMap1200By635());
    expect(loaded).toMatchObject({ version: 1, width: 1200, height: 635 });
    expect(objectsIn(withHouse, 'lower')).toEqual([{
      id: 'legacy-house',
      assetId: HOUSE_ONE,
      material: 'wood',
      x: 536,
      y: 253.5,
      width: 128,
      height: 128,
      rotationDegrees: 0,
    }]);
    expect(withHouse).toMatchObject({ version: 1, width: 1200, height: 635 });
    expect(resized).toMatchObject({ version: 1, width: 1600, height: 900 });
    expect(objectsIn(resized, 'lower')[0]).toMatchObject({
      x: 536,
      y: 253.5,
      width: 128,
      height: 128,
    });
    expect(loaded.height).toBe(635);
  });

  it('accepts saved maps at canvas edges 64 and 4096', () => {
    const saved = savedTownMap1200By635();
    const smallest = validateTownDocument({ ...saved, width: 64, height: 64 });
    const largest = validateTownDocument({ ...saved, width: 4096, height: 4096 });

    expect(smallest).toMatchObject({ version: 1, width: 64, height: 64 });
    expect(largest).toMatchObject({ version: 1, width: 4096, height: 4096 });
    expect(saved).toEqual(savedTownMap1200By635());
  });
});
