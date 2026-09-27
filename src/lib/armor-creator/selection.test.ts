import { describe, expect, it } from 'vitest';

import {
  listArmorPieceIds,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';
import {
  chestCurveControlEnabled,
  clearArmorEquipment,
  createInitialArmorSelection,
  isArmorPieceEquipped,
  selectArmorGender,
  selectArmorMaterial,
  setChestCurve,
  setShoulderSymmetry,
  toggleArmorPiece,
  type ArmorSelection,
} from '@/lib/armor-creator/selection';

function genderedPieceId(
  gender: ArmorGender,
  material: ArmorMaterial,
  slot: Exclude<ArmorSlot, 'crown' | 'wing'>,
  index: number,
): string {
  const pieceIds = listArmorPieceIds({ slot, gender, material });
  const pieceId = pieceIds[index - 1];

  if (pieceId === undefined) {
    throw new Error(`Missing test piece ${gender}:${material}:${slot}:${index}.`);
  }

  return pieceId;
}

function sharedPieceId(slot: 'crown' | 'wing', index: number): string {
  const pieceIds = listArmorPieceIds({ slot });
  const pieceId = pieceIds[index - 1];

  if (pieceId === undefined) {
    throw new Error(`Missing shared test piece ${slot}:${index}.`);
  }

  return pieceId;
}

function equipArmorPieces(selection: ArmorSelection, pieceIds: readonly string[]): ArmorSelection {
  let nextSelection = selection;

  for (const pieceId of pieceIds) {
    nextSelection = toggleArmorPiece(nextSelection, pieceId);
  }

  return nextSelection;
}

describe('createInitialArmorSelection', () => {
  it('默认是男性板甲，肩不对称，胸甲曲线开着，身上没有装备', () => {
    expect(createInitialArmorSelection()).toEqual({
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {},
    });
    expect(chestCurveControlEnabled(createInitialArmorSelection())).toBe(false);
  });
});

describe('selectArmorMaterial', () => {
  it('混穿时换材质只改材质，不脱装备', () => {
    const plateHelm = genderedPieceId('male', 'plate', 'helm', 1);
    const leatherChest = genderedPieceId('male', 'leather', 'chest', 2);
    const mixed = equipArmorPieces(createInitialArmorSelection(), [plateHelm, leatherChest]);
    const nextSelection = selectArmorMaterial(mixed, 'cloth');

    expect(plateHelm).toBe('male:plate:helm:1');
    expect(leatherChest).toBe('male:leather:chest:2');
    expect(nextSelection.material).toBe('cloth');
    expect(nextSelection.gender).toBe('male');
    expect(nextSelection.shoulderSymmetry).toBe(false);
    expect(nextSelection.chestCurve).toBe(true);
    expect(nextSelection.equippedPieceIds).toEqual({
      helm: plateHelm,
      chest: leatherChest,
    });
    expect(isArmorPieceEquipped(nextSelection, plateHelm)).toBe(true);
    expect(isArmorPieceEquipped(nextSelection, leatherChest)).toBe(true);
    expect(mixed.material).toBe('plate');
    expect(mixed.equippedPieceIds).toEqual({
      helm: plateHelm,
      chest: leatherChest,
    });
  });
});

describe('selectArmorGender', () => {
  it('换性别时改写带性别编号，王冠和翅膀保持原编号', () => {
    const plateHelm = genderedPieceId('male', 'plate', 'helm', 4);
    const leatherChest = genderedPieceId('male', 'leather', 'chest', 2);
    const cloakFront = genderedPieceId('male', 'cloth', 'cloakFront', 15);
    const crown = sharedPieceId('crown', 8);
    const wing = sharedPieceId('wing', 2);
    const maleSelection = equipArmorPieces(createInitialArmorSelection(), [
      plateHelm,
      leatherChest,
      cloakFront,
      wing,
    ]);
    const femaleSelection = selectArmorGender(maleSelection, 'female');
    const crownedSelection = equipArmorPieces(createInitialArmorSelection(), [crown, wing]);
    const crownedFemaleSelection = selectArmorGender(crownedSelection, 'female');

    expect(femaleSelection.gender).toBe('female');
    expect(femaleSelection.material).toBe('plate');
    expect(femaleSelection.equippedPieceIds).toEqual({
      helm: 'female:plate:helm:4',
      chest: 'female:leather:chest:2',
      cloakFront: 'female:cloth:cloakFront:15',
      wing: 'shared:wing:2',
    });
    expect(maleSelection.gender).toBe('male');
    expect(maleSelection.equippedPieceIds.helm).toBe('male:plate:helm:4');
    expect(crownedFemaleSelection.gender).toBe('female');
    expect(crownedFemaleSelection.equippedPieceIds).toEqual({
      crown: 'shared:crown:8',
      wing: 'shared:wing:2',
    });
    expect(isArmorPieceEquipped(femaleSelection, 'female:plate:helm:4')).toBe(true);
    expect(isArmorPieceEquipped(crownedFemaleSelection, crown)).toBe(true);
    expect(isArmorPieceEquipped(crownedFemaleSelection, wing)).toBe(true);
  });
});

describe('setShoulderSymmetry', () => {
  it('打开对称时，序号不同则左肩改成右肩序号，只有一边时复制到另一边', () => {
    const leftPlate = genderedPieceId('male', 'plate', 'shoulderLeft', 1);
    const rightLeather = genderedPieceId('male', 'leather', 'shoulderRight', 5);
    const bothShoulders = equipArmorPieces(createInitialArmorSelection(), [leftPlate, rightLeather]);
    const synced = setShoulderSymmetry(bothShoulders, true);

    expect(synced.shoulderSymmetry).toBe(true);
    expect(synced.equippedPieceIds.shoulderLeft).toBe('male:plate:shoulderLeft:5');
    expect(synced.equippedPieceIds.shoulderRight).toBe('male:leather:shoulderRight:5');
    expect(bothShoulders.shoulderSymmetry).toBe(false);
    expect(bothShoulders.equippedPieceIds.shoulderLeft).toBe(leftPlate);

    const sameIndex = equipArmorPieces(createInitialArmorSelection(), [
      genderedPieceId('male', 'plate', 'shoulderLeft', 3),
      genderedPieceId('male', 'leather', 'shoulderRight', 3),
    ]);
    const alreadyMatched = setShoulderSymmetry(sameIndex, true);

    expect(alreadyMatched.equippedPieceIds).toEqual(sameIndex.equippedPieceIds);

    const onlyLeft = equipArmorPieces(createInitialArmorSelection(), [
      genderedPieceId('female', 'cloth', 'shoulderLeft', 2),
    ]);
    const copiedToRight = setShoulderSymmetry(selectArmorGender(onlyLeft, 'female'), true);

    expect(copiedToRight.equippedPieceIds.shoulderLeft).toBe('female:cloth:shoulderLeft:2');
    expect(copiedToRight.equippedPieceIds.shoulderRight).toBe('female:cloth:shoulderRight:2');

    const onlyRight = equipArmorPieces(createInitialArmorSelection(), [
      genderedPieceId('male', 'leather', 'shoulderRight', 7),
    ]);
    const copiedToLeft = setShoulderSymmetry(onlyRight, true);

    expect(copiedToLeft.equippedPieceIds.shoulderLeft).toBe('male:leather:shoulderLeft:7');
    expect(copiedToLeft.equippedPieceIds.shoulderRight).toBe('male:leather:shoulderRight:7');

    const neither = setShoulderSymmetry(createInitialArmorSelection(), true);

    expect(neither.shoulderSymmetry).toBe(true);
    expect(neither.equippedPieceIds).toEqual({});
  });

  it('关闭对称只关开关，两肩保持原样', () => {
    const leftPieceId = genderedPieceId('male', 'plate', 'shoulderLeft', 1);
    const rightPieceId = genderedPieceId('male', 'leather', 'shoulderRight', 5);
    const asymmetric = equipArmorPieces(createInitialArmorSelection(), [leftPieceId, rightPieceId]);
    const disabled = setShoulderSymmetry(asymmetric, false);

    expect(disabled.shoulderSymmetry).toBe(false);
    expect(disabled.equippedPieceIds).toEqual({
      shoulderLeft: leftPieceId,
      shoulderRight: rightPieceId,
    });
  });

  it('对称打开时，穿或脱任意一肩，另一肩使用同样序号', () => {
    const leftPieceId = genderedPieceId('male', 'plate', 'shoulderLeft', 6);
    const rightPieceId = genderedPieceId('male', 'leather', 'shoulderRight', 2);
    const symmetric = setShoulderSymmetry(createInitialArmorSelection(), true);
    const equippedLeft = toggleArmorPiece(symmetric, leftPieceId);

    expect(equippedLeft.equippedPieceIds).toEqual({
      shoulderLeft: 'male:plate:shoulderLeft:6',
      shoulderRight: 'male:plate:shoulderRight:6',
    });

    const equippedRight = toggleArmorPiece(equippedLeft, rightPieceId);

    expect(equippedRight.equippedPieceIds).toEqual({
      shoulderLeft: 'male:leather:shoulderLeft:2',
      shoulderRight: 'male:leather:shoulderRight:2',
    });

    const clearedShoulders = toggleArmorPiece(equippedRight, 'male:leather:shoulderRight:2');

    expect(clearedShoulders.equippedPieceIds).toEqual({});
    expect(clearedShoulders.shoulderSymmetry).toBe(true);

    const withoutSymmetry = toggleArmorPiece(createInitialArmorSelection(), leftPieceId);

    expect(withoutSymmetry.equippedPieceIds).toEqual({
      shoulderLeft: leftPieceId,
    });
  });
});

describe('toggleArmorPiece', () => {
  it('头盔和王冠互斥，斗篷正反面互不影响', () => {
    const helm = genderedPieceId('male', 'plate', 'helm', 1);
    const otherHelm = genderedPieceId('male', 'plate', 'helm', 2);
    const crown = sharedPieceId('crown', 3);
    const cloakFront = genderedPieceId('male', 'plate', 'cloakFront', 1);
    const cloakBack = genderedPieceId('male', 'plate', 'cloakBack', 4);
    const initial = createInitialArmorSelection();
    const withHelm = toggleArmorPiece(initial, helm);

    expect(initial.equippedPieceIds).toEqual({});
    expect(isArmorPieceEquipped(withHelm, helm)).toBe(true);
    expect(isArmorPieceEquipped(withHelm, otherHelm)).toBe(false);

    const withCrown = toggleArmorPiece(withHelm, crown);

    expect(withCrown.equippedPieceIds).toEqual({ crown });
    expect(isArmorPieceEquipped(withCrown, helm)).toBe(false);

    const helmReplacesCrown = toggleArmorPiece(withCrown, otherHelm);

    expect(helmReplacesCrown.equippedPieceIds).toEqual({ helm: otherHelm });
    expect(isArmorPieceEquipped(helmReplacesCrown, crown)).toBe(false);

    const helmRemoved = toggleArmorPiece(helmReplacesCrown, otherHelm);

    expect(helmRemoved.equippedPieceIds).toEqual({});

    const withCloaks = equipArmorPieces(createInitialArmorSelection(), [cloakFront, cloakBack]);

    expect(withCloaks.equippedPieceIds).toEqual({
      cloakFront,
      cloakBack,
    });
  });

  it('非法零件编号原样抛出', () => {
    const selection = createInitialArmorSelection();

    expect(() => toggleArmorPiece(selection, 'nope')).toThrowError(
      'Invalid armor piece id. Received "nope".',
    );
    expect(() => isArmorPieceEquipped(selection, 'male:plate:helm:31')).toThrowError(
      'Armor piece id "male:plate:helm:31" is outside 1..30 for slot "helm".',
    );
    expect(() => toggleArmorPiece(selection, 'shared:helm:1')).toThrowError(
      'Armor piece id "shared:helm:1" does not match slot "helm".',
    );
    expect(selection.equippedPieceIds).toEqual({});
  });
});

describe('clearArmorEquipment', () => {
  it('清空后装备没了，性别、材质和两个开关还在', () => {
    const helm = genderedPieceId('female', 'cloth', 'helm', 9);
    const wearing = equipArmorPieces(
      setChestCurve(setShoulderSymmetry(selectArmorGender(createInitialArmorSelection(), 'female'), true), false),
      [helm],
    );
    const cleared = clearArmorEquipment(selectArmorMaterial(wearing, 'cloth'));

    expect(cleared.equippedPieceIds).toEqual({});
    expect(isArmorPieceEquipped(cleared, 'female:cloth:helm:9')).toBe(false);
    expect(cleared.gender).toBe('female');
    expect(cleared.material).toBe('cloth');
    expect(cleared.shoulderSymmetry).toBe(true);
    expect(cleared.chestCurve).toBe(false);
    expect(wearing.equippedPieceIds.helm).toBe(helm);
  });
});

describe('chestCurveControlEnabled', () => {
  it('只有女性板甲为 true，男性为 false', () => {
    const malePlate = createInitialArmorSelection();
    const femalePlate = selectArmorGender(malePlate, 'female');
    const femaleLeather = selectArmorMaterial(femalePlate, 'leather');
    const maleLeather = selectArmorGender(femaleLeather, 'male');

    expect(chestCurveControlEnabled(malePlate)).toBe(false);
    expect(malePlate.chestCurve).toBe(true);
    expect(chestCurveControlEnabled(femalePlate)).toBe(true);
    expect(chestCurveControlEnabled(femaleLeather)).toBe(false);
    expect(chestCurveControlEnabled(maleLeather)).toBe(false);
    expect(setChestCurve(femalePlate, false).chestCurve).toBe(false);
    expect(setChestCurve(femalePlate, false).equippedPieceIds).toEqual({});
  });
});
