import { describe, expect, it } from 'vitest';

import {
  WEAPON_SAVE_STORAGE_KEY,
  readWeaponSaveSlot,
  requireWeaponSaveSlotNumber,
  writeWeaponSaveSlot,
  type WeaponSaveStorage,
} from '@/lib/weapon-creator/saves';
import { listWeaponPieceIds } from '@/lib/weapon-creator/catalog';
import {
  createInitialWeaponSelection,
  toggleWeaponPiece,
} from '@/lib/weapon-creator/selection';

function createMemoryStorage(): WeaponSaveStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

function createUndefinedReadStorage(writeCount: { value: number }): WeaponSaveStorage {
  return {
    getItem: () => undefined as unknown as string | null,
    setItem: () => {
      writeCount.value += 1;
    },
  };
}

function firstPiece(category: Parameters<typeof listWeaponPieceIds>[0]): string {
  const pieceId = listWeaponPieceIds(category)[0];
  if (pieceId === undefined) {
    throw new Error(`Expected ${category} to contain at least one weapon piece.`);
  }

  return pieceId;
}

function createRecord() {
  return {
    snapshot: toggleWeaponPiece(createInitialWeaponSelection(), firstPiece('hilts')),
    thumbnailDataUrl: 'data:image/png;base64,AAAA',
  };
}

describe('weapon saves', () => {
  it('uses four isolated slots and round trips records', () => {
    const storage = createMemoryStorage();
    const firstRecord = createRecord();
    const secondRecord = {
      ...firstRecord,
      snapshot: toggleWeaponPiece(createInitialWeaponSelection(), firstPiece('blade')),
    };

    expect(WEAPON_SAVE_STORAGE_KEY).toBe('tokenmaker.weapon-creator.saves');
    expect(readWeaponSaveSlot(storage, 1)).toBeNull();
    writeWeaponSaveSlot(storage, 1, firstRecord);
    writeWeaponSaveSlot(storage, 4, secondRecord);
    expect(readWeaponSaveSlot(storage, 1)).toEqual(firstRecord);
    expect(readWeaponSaveSlot(storage, 4)).toEqual(secondRecord);
    expect(readWeaponSaveSlot(storage, 2)).toBeNull();
    expect(JSON.parse(storage.getItem(WEAPON_SAVE_STORAGE_KEY) ?? 'null')).toHaveLength(4);
  });

  it('rejects invalid slot numbers and stored JSON', () => {
    const storage = createMemoryStorage();

    expect(() => requireWeaponSaveSlotNumber(0)).toThrowError('Received 0');
    expect(() => readWeaponSaveSlot(storage, 5)).toThrowError('Received 5');
    storage.setItem(WEAPON_SAVE_STORAGE_KEY, '{broken');
    expect(() => readWeaponSaveSlot(storage, 1)).toThrowError(
      'Weapon save slot 1 has invalid JSON syntax. Received "{broken".',
    );
  });

  it('rejects undefined storage reads without writing and keeps null as empty storage', () => {
    const writeCount = { value: 0 };
    const undefinedReadStorage = createUndefinedReadStorage(writeCount);

    expect(() => readWeaponSaveSlot(undefinedReadStorage, 1)).toThrowError('Received undefined');
    expect(() => writeWeaponSaveSlot(undefinedReadStorage, 1, createRecord())).toThrowError(
      'Received undefined',
    );
    expect(writeCount.value).toBe(0);
    expect(readWeaponSaveSlot(createMemoryStorage(), 1)).toBeNull();
  });

  it('rejects invalid arrays and records without overwriting storage', () => {
    const storage = createMemoryStorage();
    storage.setItem(WEAPON_SAVE_STORAGE_KEY, '[]');
    expect(() => readWeaponSaveSlot(storage, 1)).toThrowError(
      'Weapon save slot 1 has an invalid save array. Received [].',
    );

    storage.setItem(WEAPON_SAVE_STORAGE_KEY, '[null,null,null,{}]');
    expect(() => readWeaponSaveSlot(storage, 1)).toThrowError(
      'Weapon save slot 4 has an invalid save record. Received {}.',
    );

    const previousStorageValue = storage.getItem(WEAPON_SAVE_STORAGE_KEY);
    expect(() => writeWeaponSaveSlot(storage, 1, {
      snapshot: createInitialWeaponSelection(),
      thumbnailDataUrl: 'not-a-data-url',
    })).toThrowError('not-a-data-url');
    expect(storage.getItem(WEAPON_SAVE_STORAGE_KEY)).toBe(previousStorageValue);
  });

  it('validates a snapshot before writing', () => {
    const storage = createMemoryStorage();
    const firstBlade = firstPiece('blade');

    expect(() => writeWeaponSaveSlot(storage, 1, {
      snapshot: { equippedPieceIds: { hilts: firstBlade } },
      thumbnailDataUrl: 'data:image/png;base64,AAAA',
    } as never)).toThrowError(firstBlade);
    expect(storage.getItem(WEAPON_SAVE_STORAGE_KEY)).toBeNull();
  });
});
