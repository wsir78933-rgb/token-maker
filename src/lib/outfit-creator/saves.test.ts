import { describe, expect, it } from 'vitest';

import {
  OUTFIT_SAVE_STORAGE_KEY,
  outfitSaveSlotIsFilled,
  readOutfitSaveSlot,
  requireOutfitSaveSlotNumber,
  writeOutfitSaveSlot,
  type OutfitSaveStorage,
} from '@/lib/outfit-creator/saves';
import {
  createInitialOutfitSelection,
  toggleOutfitPiece,
} from '@/lib/outfit-creator/selection';

function createMemoryStorage(): OutfitSaveStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

function createRecord() {
  return {
    snapshot: toggleOutfitPiece(createInitialOutfitSelection(), 'jacket8'),
    thumbnailDataUrl: 'data:image/png;base64,AAAA',
  };
}

describe('outfit saves', () => {
  it('uses four slots and round trips records', () => {
    const storage = createMemoryStorage();
    const firstRecord = createRecord();
    const secondRecord = {
      ...firstRecord,
      snapshot: { ...firstRecord.snapshot, gender: 'female' as const },
    };

    expect(OUTFIT_SAVE_STORAGE_KEY).toBe('tokenmaker.outfit-creator.saves');
    expect(readOutfitSaveSlot(storage, 1)).toBeNull();
    writeOutfitSaveSlot(storage, 1, firstRecord);
    writeOutfitSaveSlot(storage, 4, secondRecord);
    expect(readOutfitSaveSlot(storage, 1)).toEqual(firstRecord);
    expect(readOutfitSaveSlot(storage, 4)).toEqual(secondRecord);
    expect(outfitSaveSlotIsFilled(storage, 2)).toBe(false);
    expect(JSON.parse(storage.getItem(OUTFIT_SAVE_STORAGE_KEY) ?? 'null')).toHaveLength(4);
  });

  it('rejects invalid slot numbers and stored JSON', () => {
    const storage = createMemoryStorage();
    expect(() => requireOutfitSaveSlotNumber(0)).toThrowError('Received 0');
    expect(() => readOutfitSaveSlot(storage, 5)).toThrowError('Received 5');
    storage.setItem(OUTFIT_SAVE_STORAGE_KEY, '{broken');
    expect(() => readOutfitSaveSlot(storage, 1)).toThrowError(
      'Outfit save slot 1 has invalid JSON syntax. Received "{broken".',
    );
  });

  it('distinguishes valid JSON with an invalid save array or record', () => {
    const storage = createMemoryStorage();
    storage.setItem(OUTFIT_SAVE_STORAGE_KEY, '[]');
    expect(() => readOutfitSaveSlot(storage, 1)).toThrowError(
      'Outfit save slot 1 has an invalid save array. Received [].',
    );

    storage.setItem(OUTFIT_SAVE_STORAGE_KEY, '[null,null,null,{}]');
    expect(() => readOutfitSaveSlot(storage, 1)).toThrowError(
      'Outfit save slot 4 has an invalid save record. Received {}.',
    );
  });

  it('validates snapshots and thumbnails before writing', () => {
    const storage = createMemoryStorage();
    expect(() => writeOutfitSaveSlot(storage, 1, {
      snapshot: { gender: 'male', equippedPieceIds: { pants: 'jacket1' } },
      thumbnailDataUrl: 'data:image/png;base64,AAAA',
    } as never)).toThrowError('jacket1');
    expect(() => writeOutfitSaveSlot(storage, 1, {
      snapshot: createInitialOutfitSelection(),
      thumbnailDataUrl: 'not-a-data-url',
    })).toThrowError('not-a-data-url');
    expect(storage.getItem(OUTFIT_SAVE_STORAGE_KEY)).toBeNull();
  });
});
