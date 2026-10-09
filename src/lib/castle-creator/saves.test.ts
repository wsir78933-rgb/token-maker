import { describe, expect, it } from 'vitest';

import {
  castleSaveStorageKey,
  readCastleSaveSlot,
  writeCastleSaveSlot,
  type CastleSaveStorage,
} from '@/lib/castle-creator/saves';
import type { CastleProject } from '@/lib/castle-creator/types';

function createProject(): CastleProject {
  return {
    version: 1,
    pieces: [],
    activeLayer: 'lower',
    visibleLayers: { lower: true, middle: true, upper: true },
    canvas: {
      width: 0,
      height: 635,
      backgroundColor: '#ffffff',
      backgroundImageUrl: null,
    },
    palette: { building: 1, roof: 1 },
    snapEnabled: false,
    resizeEnabled: true,
  };
}

function createMemoryStorage(): CastleSaveStorage & { values: Map<string, string> } {
  const values = new Map<string, string>();
  return {
    values,
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

describe('castle saves', () => {
  it('keeps five slots on independent storage keys and reads back the written record', () => {
    const storage = createMemoryStorage();
    const firstProject = createProject();
    const fifthProject = { ...firstProject, snapEnabled: true };
    storage.setItem('tokenmaker.unrelated', 'preserve');

    const firstRecord = writeCastleSaveSlot(storage, 1, firstProject);
    const fifthRecord = writeCastleSaveSlot(storage, 5, fifthProject);

    expect(castleSaveStorageKey(1)).not.toBe(castleSaveStorageKey(5));
    expect(readCastleSaveSlot(storage, 1)).toEqual(firstRecord);
    expect(readCastleSaveSlot(storage, 5)).toEqual(fifthRecord);
    expect(readCastleSaveSlot(storage, 2)).toBeNull();
    expect(storage.getItem('tokenmaker.unrelated')).toBe('preserve');
  });

  it('rejects invalid slot numbers and corrupted JSON instead of treating them as empty', () => {
    const storage = createMemoryStorage();

    expect(() => castleSaveStorageKey(0 as never)).toThrowError('Received 0');
    storage.setItem(castleSaveStorageKey(2), '{broken');
    expect(() => readCastleSaveSlot(storage, 2)).toThrowError('Castle save slot 2 has invalid JSON syntax');
  });

  it('rejects a readback that did not persist after setItem', () => {
    const storage: CastleSaveStorage = {
      getItem: () => null,
      setItem: () => undefined,
    };

    expect(() => writeCastleSaveSlot(storage, 3, createProject())).toThrowError(
      'write readback returned null',
    );
  });

  it('rejects an invalid stored record and invalid project field', () => {
    const storage = createMemoryStorage();
    storage.setItem(
      castleSaveStorageKey(4),
      JSON.stringify({ version: 1, slotNumber: 4, project: { version: 1 }, updatedAt: 'now' }),
    );

    expect(() => readCastleSaveSlot(storage, 4)).toThrowError('Castle save slot 4 project is invalid');
  });
});
