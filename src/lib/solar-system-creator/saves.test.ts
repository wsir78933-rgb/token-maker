import { describe, expect, it } from 'vitest';

import {
  loadSolarSaveSlot,
  readSolarSaveSlots,
  requireSolarSaveSlot,
  saveSolarSaveSlot,
  SOLAR_SYSTEM_SAVE_STORAGE_KEY,
  type StorageLike,
} from './saves';
import type { SolarSaveSnapshot } from './types';

function createMemoryStorage(): StorageLike {
  const storedValues = new Map<string, string>();
  return {
    getItem: (key) => storedValues.get(key) ?? null,
    setItem: (key, value) => {
      storedValues.set(key, value);
    },
  };
}

function createSnapshot(seed: number): SolarSaveSnapshot {
  return {
    starAssetId: 'star-1',
    planets: [
      {
        id: `planet-${seed}`,
        assetId: 'type-1-1',
        x: seed,
        y: 20,
        width: 40,
        height: 40,
        description: `Description ${seed}`,
      },
    ],
  };
}

describe('solar system saves', () => {
  it('starts with five empty slots and round-trips every slot', () => {
    const storage = createMemoryStorage();

    expect(readSolarSaveSlots(storage)).toEqual([null, null, null, null, null]);
    expect(loadSolarSaveSlot(storage, 1)).toBeNull();

    for (const slot of [1, 2, 3, 4, 5] as const) {
      saveSolarSaveSlot(storage, slot, createSnapshot(slot));
    }

    expect(readSolarSaveSlots(storage)).toEqual([
      createSnapshot(1),
      createSnapshot(2),
      createSnapshot(3),
      createSnapshot(4),
      createSnapshot(5),
    ]);
    expect(loadSolarSaveSlot(storage, 4)).toEqual(createSnapshot(4));
  });

  it('overwrites only the requested slot and preserves the other four snapshots', () => {
    const storage = createMemoryStorage();
    const initialSnapshots = [1, 2, 3, 4, 5].map(createSnapshot);

    for (const [index, snapshot] of initialSnapshots.entries()) {
      saveSolarSaveSlot(storage, index + 1, snapshot);
    }

    const replacementSnapshot = createSnapshot(99);
    saveSolarSaveSlot(storage, 3, replacementSnapshot);

    expect(readSolarSaveSlots(storage)).toEqual([
      initialSnapshots[0],
      initialSnapshots[1],
      replacementSnapshot,
      initialSnapshots[3],
      initialSnapshots[4],
    ]);
  });

  it.each([0, 6, 1.5, '1', null, undefined])(
    'rejects an invalid save slot and includes the received value: %s',
    (receivedSlot) => {
      expect(() => requireSolarSaveSlot(receivedSlot)).toThrow(String(receivedSlot));
    },
  );

  it('rejects malformed stored JSON and arrays with the wrong number of slots', () => {
    const storage = createMemoryStorage();

    storage.setItem(SOLAR_SYSTEM_SAVE_STORAGE_KEY, '{broken');
    expect(() => readSolarSaveSlots(storage)).toThrow('invalid JSON');

    storage.setItem(SOLAR_SYSTEM_SAVE_STORAGE_KEY, '[null]');
    expect(() => readSolarSaveSlots(storage)).toThrow('exactly 5 slots');
  });

  it('rejects snapshots with extra fields instead of silently persisting them', () => {
    const storage = createMemoryStorage();
    const snapshotWithUnexpectedField = {
      ...createSnapshot(1),
      randomPlanetFields: [],
    };

    expect(() => saveSolarSaveSlot(storage, 1, snapshotWithUnexpectedField)).toThrow(
      'exactly planets, starAssetId',
    );
    expect(storage.getItem(SOLAR_SYSTEM_SAVE_STORAGE_KEY)).toBeNull();
  });

  it('surfaces getItem failures with the original cause', () => {
    const storageFailure = new Error('storage read denied');
    const storage: StorageLike = {
      getItem: () => {
        throw storageFailure;
      },
      setItem: () => undefined,
    };

    expect(() => readSolarSaveSlots(storage)).toThrow('getItem failed');
  });

  it('surfaces setItem failures with the original cause', () => {
    const storageFailure = new Error('storage write denied');
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw storageFailure;
      },
    };

    expect(() => saveSolarSaveSlot(storage, 1, createSnapshot(1))).toThrow('setItem failed');
  });
});
