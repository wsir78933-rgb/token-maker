import { describe, expect, it } from 'vitest';

import {
  TOWN_SAVE_SLOT_COUNT,
  TOWN_SAVE_STORAGE_KEY,
  loadTownSlot,
  parseTownDocument,
  readTownSaveSlots,
  saveTownSlot,
  serializeTownDocument,
  type TownStorage,
} from './storage';
import { validateTownDocument } from './document';
import type { TownDocument } from './types';

function createDocument(): TownDocument {
  return {
    version: 1,
    width: 1200,
    height: 800,
    backgroundColor: '#d9c9a8',
    backgroundImageUrl: '',
    activeLayer: 'middle',
    layers: [
      { id: 'lower', visible: true, objects: [] },
      {
        id: 'middle',
        visible: true,
        objects: [{
          id: 'house-1',
          assetId: 'buildings-house-01-cottage',
          material: 'wood',
          x: 80,
          y: 120,
          width: 128,
          height: 128,
          rotationDegrees: 15,
        }],
      },
      { id: 'upper', visible: false, objects: [] },
    ],
  };
}

function createMemoryStorage(initialValue: string | null = null): TownStorage & { readRaw: () => string | null } {
  let rawValue = initialValue;
  return {
    getItem(key: string) {
      if (key !== TOWN_SAVE_STORAGE_KEY) {
        throw new Error(`Unexpected town storage key ${JSON.stringify(key)}.`);
      }
      return rawValue;
    },
    setItem(key: string, value: string) {
      if (key !== TOWN_SAVE_STORAGE_KEY) {
        throw new Error(`Unexpected town storage key ${JSON.stringify(key)}.`);
      }
      rawValue = value;
    },
    readRaw() {
      return rawValue;
    },
  };
}

describe('town document validation and project files', () => {
  it('round trips UTF-8 project JSON while preserving canvas, background, layers, materials, and transforms', () => {
    const document = createDocument();
    document.layers[1]!.objects[0]!.id = '北门-一';

    const serialized = serializeTownDocument(document);
    const utf8Bytes = new TextEncoder().encode(serialized);
    const parsed = parseTownDocument(new TextDecoder().decode(utf8Bytes));

    expect(serialized).toContain('"backgroundColor": "#d9c9a8"');
    expect(serialized).toContain('北门-一');
    expect(utf8Bytes.byteLength).toBeGreaterThan(serialized.length);
    expect(parsed).toEqual(document);
  });

  it.each([
    ['unknown asset', { ...createDocument(), layers: [{ ...createDocument().layers[0] }, { ...createDocument().layers[1], objects: [{ ...createDocument().layers[1].objects[0], assetId: 'missing-town-asset' }] }, { ...createDocument().layers[2] }] }],
    ['unknown version', { ...createDocument(), version: 2 }],
    ['non-finite width', { ...createDocument(), width: Number.NaN }],
    ['duplicate object ID', { ...createDocument(), layers: [{ ...createDocument().layers[0] }, { ...createDocument().layers[1], objects: [createDocument().layers[1].objects[0], { ...createDocument().layers[1].objects[0], assetId: 'buildings-house-02-hip-cottage' }] }, { ...createDocument().layers[2] }] }],
  ])('rejects %s before accepting the project', ([, invalidDocument]) => {
    expect(() => validateTownDocument(invalidDocument)).toThrow();
  });

  it('rejects a material that the asset does not provide', () => {
    const invalidDocument = {
      ...createDocument(),
      layers: [
        createDocument().layers[0],
        {
          ...createDocument().layers[1],
          objects: [{ ...createDocument().layers[1].objects[0], material: 'neutral' }],
        },
        createDocument().layers[2],
      ],
    };

    expect(() => validateTownDocument(invalidDocument)).toThrow('does not support material');
  });

  it('rejects malformed JSON without accepting a legacy shape', () => {
    expect(() => parseTownDocument('{broken')).toThrow('invalid JSON');
    expect(() => parseTownDocument(JSON.stringify({ canvas: { width: 1200 } }))).toThrow('exactly');
  });

});

describe('town browser save slots', () => {
  it('reads five empty slots when storage is absent and disables no data implicitly', () => {
    const storage = createMemoryStorage();

    expect(readTownSaveSlots(storage)).toEqual([null, null, null, null, null]);
    expect(readTownSaveSlots(storage)).toHaveLength(TOWN_SAVE_SLOT_COUNT);
    expect(storage.readRaw()).toBeNull();
    expect(loadTownSlot(storage, 1)).toBeNull();
  });

  it('round trips slots one and five and clones returned documents', () => {
    const storage = createMemoryStorage();
    const document = createDocument();

    const firstWrite = saveTownSlot(storage, 1, document);
    const fifthWrite = saveTownSlot(storage, 5, document);
    const slots = readTownSaveSlots(storage);

    expect(firstWrite).toHaveLength(5);
    expect(fifthWrite).toHaveLength(5);
    expect(slots[0]?.document).toEqual(document);
    expect(slots[4]?.document).toEqual(document);
    expect(slots[0]?.savedAt).toMatch(/T/);

    if (slots[0] === null) throw new Error('Expected town slot 1 to be filled.');
    slots[0].document.layers[1].objects[0].x = 999;
    expect(loadTownSlot(storage, 1)?.layers[1]?.objects[0]?.x).toBe(80);
  });

  it.each([0, 6, 1.5, Number.NaN, Number.POSITIVE_INFINITY, '1', null])(
    'rejects invalid slot number %s before writing',
    (slotNumber) => {
      const storage = createMemoryStorage();

      expect(() => saveTownSlot(storage, slotNumber as number, createDocument())).toThrow(String(slotNumber));
      expect(storage.readRaw()).toBeNull();
    },
  );

  it('rejects malformed JSON and preserves the raw bad storage', () => {
    const storage = createMemoryStorage('{broken');

    expect(() => readTownSaveSlots(storage)).toThrow('invalid JSON');
    expect(storage.readRaw()).toBe('{broken');
    expect(() => saveTownSlot(storage, 1, createDocument())).toThrow('invalid JSON');
    expect(storage.readRaw()).toBe('{broken');
  });

  it('rejects stored documents with an invalid version without changing storage', () => {
    const malformedSlots = JSON.stringify([
      { document: { ...createDocument(), version: 3 }, savedAt: new Date().toISOString() },
      null,
      null,
      null,
      null,
    ]);
    const storage = createMemoryStorage(malformedSlots);

    expect(() => readTownSaveSlots(storage)).toThrow('version');
    expect(storage.readRaw()).toBe(malformedSlots);
  });

  it('reports storage read and quota or permission write failures with the real reason', () => {
    const readFailure = new Error('permission denied');
    const readFailingStorage: TownStorage = {
      getItem: () => { throw readFailure; },
      setItem: () => undefined,
    };
    expect(() => readTownSaveSlots(readFailingStorage)).toThrow('permission denied');

    const writeFailure = new Error('quota exceeded');
    const writeFailingStorage: TownStorage = {
      getItem: () => null,
      setItem: () => { throw writeFailure; },
    };
    expect(() => saveTownSlot(writeFailingStorage, 2, createDocument())).toThrow('quota exceeded');
    expect(() => saveTownSlot(writeFailingStorage, 2, createDocument())).toThrow(TOWN_SAVE_STORAGE_KEY);
  });

  it('rejects unavailable storage at the boundary', () => {
    expect(() => readTownSaveSlots(null as unknown as TownStorage)).toThrow('Received null');
    expect(() => readTownSaveSlots({ getItem: 'nope' } as unknown as TownStorage)).toThrow('getItem must be a function');
  });
});
