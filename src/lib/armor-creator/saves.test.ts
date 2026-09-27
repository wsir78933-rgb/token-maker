import { describe, expect, it } from 'vitest';

import { type ArmorSelection } from '@/lib/armor-creator/selection';
import {
  ARMOR_SAVE_STORAGE_KEY,
  armorSaveSlotIsFilled,
  readArmorSaveSlot,
  requireArmorSaveSlotNumber,
  writeArmorSaveSlot,
  type ArmorSaveRecord,
  type ArmorSaveStorage,
} from '@/lib/armor-creator/saves';

const PNG_THUMBNAIL_PREFIX = 'data:image/png;base64,';

const malePlateSnapshot: ArmorSelection = {
  gender: 'male',
  material: 'plate',
  shoulderSymmetry: false,
  chestCurve: true,
  equippedPieceIds: { helm: 'male:plate:helm:1' },
};

const femaleLeatherSnapshot: ArmorSelection = {
  gender: 'female',
  material: 'leather',
  shoulderSymmetry: true,
  chestCurve: false,
  equippedPieceIds: { chest: 'female:leather:chest:2' },
};

function pngThumbnail(body: string): string {
  return `${PNG_THUMBNAIL_PREFIX}${body}`;
}

function createMemoryArmorSaveStorage(initialRaw: string | null = null): ArmorSaveStorage & {
  readRaw: () => string | null;
} {
  let storedRaw = initialRaw;

  return {
    getItem(key: string) {
      if (key !== ARMOR_SAVE_STORAGE_KEY) {
        throw new Error(`Unexpected storage key ${JSON.stringify(key)}.`);
      }

      return storedRaw;
    },
    setItem(key: string, value: string) {
      if (key !== ARMOR_SAVE_STORAGE_KEY) {
        throw new Error(`Unexpected storage key ${JSON.stringify(key)}.`);
      }

      storedRaw = value;
    },
    readRaw() {
      return storedRaw;
    },
  };
}

function armorSaveRecord(snapshot: ArmorSelection, thumbnailBody: string): ArmorSaveRecord {
  return {
    snapshot,
    thumbnailDataUrl: pngThumbnail(thumbnailBody),
  };
}

describe('armor save slots', () => {
  it('使用约定的存储键，空槽返回 null', () => {
    const storage = createMemoryArmorSaveStorage();

    expect(ARMOR_SAVE_STORAGE_KEY).toBe('tokenmaker.armor-creator.saves');
    expect(requireArmorSaveSlotNumber(1)).toBe(1);
    expect(requireArmorSaveSlotNumber(4)).toBe(4);
    expect(readArmorSaveSlot(storage, 1)).toBeNull();
    expect(readArmorSaveSlot(storage, 4)).toBeNull();
    expect(armorSaveSlotIsFilled(storage, 2)).toBe(false);
    expect(storage.readRaw()).toBeNull();
  });

  it('槽位号不是 1 到 4 时抛错，并带上收到的值', () => {
    expect(() => requireArmorSaveSlotNumber(0)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received 0.',
    );
    expect(() => requireArmorSaveSlotNumber(5)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received 5.',
    );
    expect(() => requireArmorSaveSlotNumber(1.5)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received 1.5.',
    );
    expect(() => requireArmorSaveSlotNumber('2')).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received "2".',
    );
    expect(() => readArmorSaveSlot(createMemoryArmorSaveStorage(), 0)).toThrowError('Received 0.');
  });

  it('写入后可以读回，再次写入会覆盖该槽，其他槽保持不变', () => {
    const storage = createMemoryArmorSaveStorage();
    const firstRecord = armorSaveRecord(malePlateSnapshot, 'AAAA');
    const secondRecord = armorSaveRecord(femaleLeatherSnapshot, 'BBBB');
    const replacementRecord = armorSaveRecord(
      { ...malePlateSnapshot, material: 'cloth', equippedPieceIds: {} },
      'CCCC',
    );

    writeArmorSaveSlot(storage, 1, firstRecord);
    writeArmorSaveSlot(storage, 4, secondRecord);

    expect(readArmorSaveSlot(storage, 1)).toEqual(firstRecord);
    expect(readArmorSaveSlot(storage, 4)).toEqual(secondRecord);
    expect(readArmorSaveSlot(storage, 2)).toBeNull();
    expect(readArmorSaveSlot(storage, 3)).toBeNull();
    expect(armorSaveSlotIsFilled(storage, 1)).toBe(true);
    expect(armorSaveSlotIsFilled(storage, 3)).toBe(false);

    writeArmorSaveSlot(storage, 1, replacementRecord);

    expect(readArmorSaveSlot(storage, 1)).toEqual(replacementRecord);
    expect(readArmorSaveSlot(storage, 4)).toEqual(secondRecord);
    expect(JSON.parse(storage.readRaw() ?? '')).toEqual([
      replacementRecord,
      null,
      null,
      secondRecord,
    ]);
  });

  it('坏 JSON 抛错，消息带上槽位号和原始字符串的前 80 个字符', () => {
    const raw = `INVALID-JSON-${'0123456789'.repeat(12)}`;
    const preview = raw.slice(0, 80);
    const storage = createMemoryArmorSaveStorage(raw);

    expect(raw.length).toBeGreaterThan(80);
    expect(preview).not.toBe(raw);
    expect(() => readArmorSaveSlot(storage, 3)).toThrowError(
      `Armor save slot 3 has invalid JSON. Received ${JSON.stringify(preview)}.`,
    );
    expect(() => armorSaveSlotIsFilled(storage, 3)).toThrowError(
      `Armor save slot 3 has invalid JSON. Received ${JSON.stringify(preview)}.`,
    );
  });

  it('缩略图不是 png data URL，或快照缺性别、材质时抛错，并带上槽位号', () => {
    const storage = createMemoryArmorSaveStorage();
    const existingRecord = armorSaveRecord(malePlateSnapshot, 'AAAA');
    const badThumbnail = 'data:image/jpeg;base64,aaaa';
    const receivedStart = badThumbnail.slice(0, PNG_THUMBNAIL_PREFIX.length);
    const snapshotWithoutGender = {
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {},
    };
    const snapshotWithoutMaterial = {
      gender: 'male',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {},
    };

    writeArmorSaveSlot(storage, 1, existingRecord);

    expect(() => writeArmorSaveSlot(storage, 1, {
      snapshot: malePlateSnapshot,
      thumbnailDataUrl: badThumbnail,
    })).toThrowError(
      `Armor save slot 1 thumbnail must start with ${JSON.stringify(PNG_THUMBNAIL_PREFIX)}. Received ${JSON.stringify(receivedStart)}.`,
    );
    expect(() => writeArmorSaveSlot(storage, 2, {
      snapshot: snapshotWithoutGender as ArmorSelection,
      thumbnailDataUrl: pngThumbnail('DDDD'),
    })).toThrowError('Armor save slot 2 snapshot is missing gender. Received undefined.');
    expect(() => writeArmorSaveSlot(storage, 4, {
      snapshot: snapshotWithoutMaterial as ArmorSelection,
      thumbnailDataUrl: pngThumbnail('EEEE'),
    })).toThrowError('Armor save slot 4 snapshot is missing material. Received undefined.');
    expect(readArmorSaveSlot(storage, 1)).toEqual(existingRecord);
    expect(readArmorSaveSlot(storage, 2)).toBeNull();
    expect(readArmorSaveSlot(storage, 4)).toBeNull();
  });

  it('对象和数组会把内容写进错误信息，stringify 失败时带上原因', () => {
    expect(() => requireArmorSaveSlotNumber({ slot: 9 })).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received {"slot":9}.',
    );
    expect(() => requireArmorSaveSlotNumber(['2'])).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received ["2"].',
    );
    expect(() => requireArmorSaveSlotNumber(null)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received null.',
    );
    expect(() => requireArmorSaveSlotNumber(undefined)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received undefined.',
    );

    const circularValue: { self?: unknown } = {};
    circularValue.self = circularValue;
    expect(() => requireArmorSaveSlotNumber(circularValue)).toThrowError(
      /Armor save slot must be an integer from 1 to 4\. Received \[object Object\] \(JSON.stringify failed: [\s\S]*circular[\s\S]*\)\./,
    );
  });
});
