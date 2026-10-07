import { describe, expect, it } from 'vitest';

import {
  PERIODIC_TABLE_STORAGE_KEY,
  readPeriodicTableSlots,
  savePeriodicTableSlot,
  type PeriodicTableStorage,
} from './storage';
import type { PeriodicTableDocument } from './types';

function createDocument(): PeriodicTableDocument {
  return {
    version: 1,
    rows: 1,
    columns: 1,
    cells: [{
      id: 'cell-1',
      text: {
        topLeft: '1',
        topRight: '1.01',
        symbol: 'H',
        name: 'Hydrogen',
        bottomLeft: 'group 1',
        bottomRight: 'period 1',
      },
      style: {
        backgroundColor: '#ffcc00',
        textColor: '#112233',
        borderColor: '#445566',
        borderVisible: true,
        backgroundImageUrl: '',
      },
      selected: true,
    }],
  };
}

function createMemoryStorage(initialValue: string | null = null): PeriodicTableStorage & { readRaw: () => string | null } {
  let rawValue = initialValue;
  return {
    getItem(key: string) {
      if (key !== PERIODIC_TABLE_STORAGE_KEY) {
        throw new Error(`Unexpected periodic table storage key ${JSON.stringify(key)}.`);
      }
      return rawValue;
    },
    setItem(key: string, value: string) {
      if (key !== PERIODIC_TABLE_STORAGE_KEY) {
        throw new Error(`Unexpected periodic table storage key ${JSON.stringify(key)}.`);
      }
      rawValue = value;
    },
    readRaw() {
      return rawValue;
    },
  };
}

describe('periodic table browser slots', () => {
  it('reads five empty slots when storage is absent', () => {
    const storage = createMemoryStorage();

    expect(readPeriodicTableSlots(storage)).toEqual([null, null, null, null, null]);
    expect(storage.readRaw()).toBeNull();
  });

  it('round trips slots one and five with a timestamp and clones returned documents', () => {
    const storage = createMemoryStorage();
    const document = createDocument();

    const firstWrite = savePeriodicTableSlot(storage, 1, document);
    const fifthWrite = savePeriodicTableSlot(storage, 5, document);
    const slots = readPeriodicTableSlots(storage);

    expect(firstWrite).toHaveLength(5);
    expect(fifthWrite).toHaveLength(5);
    expect(slots[0]?.document).toEqual(document);
    expect(slots[4]?.document).toEqual(document);
    expect(slots[0]?.savedAt).toMatch(/T/);
    if (slots[0] === null) throw new Error('Expected slot 1 to be filled.');
    slots[0].document.cells[0].text.name = 'mutated after read';
    expect(readPeriodicTableSlots(storage)[0]?.document.cells[0]?.text.name).toBe('Hydrogen');
  });

  it.each([0, 6, 1.5, Number.NaN, Number.POSITIVE_INFINITY, '1', null])(
    'rejects invalid slot number %s before writing',
    (slotNumber) => {
      const storage = createMemoryStorage();

      expect(() => savePeriodicTableSlot(storage, slotNumber as number, createDocument())).toThrow(String(slotNumber));
      expect(storage.readRaw()).toBeNull();
    },
  );

  it('rejects malformed JSON and preserves the raw bad storage', () => {
    const storage = createMemoryStorage('{broken');

    expect(() => readPeriodicTableSlots(storage)).toThrow('invalid JSON');
    expect(storage.readRaw()).toBe('{broken');
    expect(() => savePeriodicTableSlot(storage, 1, createDocument())).toThrow('invalid JSON');
    expect(storage.readRaw()).toBe('{broken');
  });

  it('rejects malformed slot records and invalid documents', () => {
    const malformedSlots = JSON.stringify([
      { document: createDocument(), savedAt: 'not-a-date' },
      null,
      null,
      null,
      null,
    ]);
    const storage = createMemoryStorage(malformedSlots);

    expect(() => readPeriodicTableSlots(storage)).toThrow('valid date');
    expect(storage.readRaw()).toBe(malformedSlots);
  });

  it('reports storage read and write failures with the key and received cause', () => {
    const readFailure = new Error('storage unavailable');
    const readFailingStorage: PeriodicTableStorage = {
      getItem: () => { throw readFailure; },
      setItem: () => undefined,
    };
    expect(() => readPeriodicTableSlots(readFailingStorage)).toThrow('storage unavailable');

    const writeFailure = new Error('quota exceeded');
    const writeFailingStorage: PeriodicTableStorage = {
      getItem: () => null,
      setItem: () => { throw writeFailure; },
    };
    expect(() => savePeriodicTableSlot(writeFailingStorage, 2, createDocument())).toThrow('quota exceeded');
    expect(() => savePeriodicTableSlot(writeFailingStorage, 2, createDocument())).toThrow(PERIODIC_TABLE_STORAGE_KEY);
  });

  it('rejects unavailable storage at the boundary', () => {
    expect(() => readPeriodicTableSlots(null as unknown as PeriodicTableStorage)).toThrow('Received null');
    expect(() => readPeriodicTableSlots({ getItem: 'nope' } as unknown as PeriodicTableStorage)).toThrow('getItem must be a function');
  });
});
