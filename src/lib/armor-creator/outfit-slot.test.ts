import { describe, expect, it } from 'vitest';

import {
  activeOutfitSlotForAutosave,
  selectionForOutfitSlot,
} from '@/lib/armor-creator/outfit-slot';
import {
  createInitialArmorSelection,
  type ArmorSelection,
} from '@/lib/armor-creator/selection';

const storedFemaleLeatherSnapshot: ArmorSelection = {
  gender: 'female',
  material: 'leather',
  shoulderSymmetry: true,
  chestCurve: false,
  equippedPieceIds: { chest: 'female:leather:chest:2' },
};

describe('selectionForOutfitSlot', () => {
  it('空快照得到初始男板甲且没有装备', () => {
    expect(selectionForOutfitSlot(1, null)).toEqual({
      activeOutfitSlot: 1,
      selection: createInitialArmorSelection(),
    });
    expect(selectionForOutfitSlot(4, null).selection).toEqual({
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {},
    });
  });

  it('合法快照被原样拷贝，修改返回值不影响入参', () => {
    const loadedOutfit = selectionForOutfitSlot(3, storedFemaleLeatherSnapshot);

    expect(loadedOutfit).toEqual({
      activeOutfitSlot: 3,
      selection: storedFemaleLeatherSnapshot,
    });
    expect(loadedOutfit.selection).not.toBe(storedFemaleLeatherSnapshot);
    expect(loadedOutfit.selection.equippedPieceIds).not.toBe(
      storedFemaleLeatherSnapshot.equippedPieceIds,
    );

    loadedOutfit.selection.gender = 'male';
    loadedOutfit.selection.material = 'plate';
    loadedOutfit.selection.shoulderSymmetry = false;
    loadedOutfit.selection.chestCurve = true;
    loadedOutfit.selection.equippedPieceIds.chest = 'changed';
    loadedOutfit.selection.equippedPieceIds.helm = 'male:plate:helm:1';

    expect(storedFemaleLeatherSnapshot).toEqual({
      gender: 'female',
      material: 'leather',
      shoulderSymmetry: true,
      chestCurve: false,
      equippedPieceIds: { chest: 'female:leather:chest:2' },
    });
  });

  it('装备槽或零件 id 不合法时抛错，并带上套装槽号和原值', () => {
    const invalidSnapshot = {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: { helm: 12, notASlot: true },
    } as unknown as ArmorSelection;

    expect(() => selectionForOutfitSlot(2, invalidSnapshot)).toThrowError(
      'Armor outfit slot 2 equipped piece is invalid: Invalid armor piece id. Received 12.',
    );
    expect(invalidSnapshot.equippedPieceIds).toEqual({ helm: 12, notASlot: true });

    expect(() => selectionForOutfitSlot(2, {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: { notASlot: true },
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 2 equipped piece is invalid: Invalid armor slot. Received "notASlot".',
    );
    expect(() => selectionForOutfitSlot(4, {
      gender: 'female',
      material: 'leather',
      shoulderSymmetry: false,
      chestCurve: false,
      equippedPieceIds: { helm: 'female:leather:chest:2' },
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 4 equipped piece "female:leather:chest:2" belongs to slot "chest", not "helm". Received "female:leather:chest:2".',
    );
  });

  it('槽号 0、5 和字符串 1 抛错，并带上收到的值', () => {
    expect(() => selectionForOutfitSlot(0, null)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received 0.',
    );
    expect(() => selectionForOutfitSlot(5, storedFemaleLeatherSnapshot)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received 5.',
    );
    expect(() => selectionForOutfitSlot('1' as unknown as number, null)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received "1".',
    );
  });

  it('快照缺字段或类型不对时抛错，并带上槽号和收到的值', () => {
    expect(() => selectionForOutfitSlot(1, ['male'] as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 1 snapshot must be a non-array object. Received ["male"].',
    );
    expect(() => selectionForOutfitSlot(4, 0 as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 4 snapshot must be a non-array object. Received 0.',
    );
    expect(() => selectionForOutfitSlot(2, {
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {},
    } as ArmorSelection)).toThrowError(
      'Armor outfit slot 2 gender must be male or female. Received undefined.',
    );
    expect(() => selectionForOutfitSlot(3, {
      gender: 'robot',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {},
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 3 gender must be male or female. Received "robot".',
    );
    expect(() => selectionForOutfitSlot(4, {
      gender: 'male',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {},
    } as ArmorSelection)).toThrowError(
      'Armor outfit slot 4 material must be plate, leather, or cloth. Received undefined.',
    );
    expect(() => selectionForOutfitSlot(1, {
      gender: 'female',
      material: 'silk',
      shoulderSymmetry: true,
      chestCurve: false,
      equippedPieceIds: {},
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 1 material must be plate, leather, or cloth. Received "silk".',
    );
    expect(() => selectionForOutfitSlot(2, {
      gender: 'male',
      material: 'cloth',
      chestCurve: true,
      equippedPieceIds: {},
    } as ArmorSelection)).toThrowError(
      'Armor outfit slot 2 shoulderSymmetry must be a boolean. Received undefined.',
    );
    expect(() => selectionForOutfitSlot(3, {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: 'yes',
      chestCurve: false,
      equippedPieceIds: {},
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 3 shoulderSymmetry must be a boolean. Received "yes".',
    );
    expect(() => selectionForOutfitSlot(4, {
      gender: 'female',
      material: 'leather',
      shoulderSymmetry: false,
      equippedPieceIds: {},
    } as ArmorSelection)).toThrowError(
      'Armor outfit slot 4 chestCurve must be a boolean. Received undefined.',
    );
    expect(() => selectionForOutfitSlot(1, {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: 1,
      equippedPieceIds: {},
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 1 chestCurve must be a boolean. Received 1.',
    );
    expect(() => selectionForOutfitSlot(2, {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: null,
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 2 equippedPieceIds must be a non-array object. Received null.',
    );
    expect(() => selectionForOutfitSlot(3, {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: ['helm'],
    } as unknown as ArmorSelection)).toThrowError(
      'Armor outfit slot 3 equippedPieceIds must be a non-array object. Received ["helm"].',
    );
  });
});

describe('activeOutfitSlotForAutosave', () => {
  it('没有选中套装时返回 null', () => {
    expect(activeOutfitSlotForAutosave(null)).toBeNull();
  });

  it('1 到 4 原样返回', () => {
    expect(activeOutfitSlotForAutosave(1)).toBe(1);
    expect(activeOutfitSlotForAutosave(2)).toBe(2);
    expect(activeOutfitSlotForAutosave(3)).toBe(3);
    expect(activeOutfitSlotForAutosave(4)).toBe(4);
  });

  it('1.5 抛错，并带上收到的值', () => {
    expect(() => activeOutfitSlotForAutosave(1.5)).toThrowError(
      'Armor save slot must be an integer from 1 to 4. Received 1.5.',
    );
  });
});
