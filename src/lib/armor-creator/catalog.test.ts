import { describe, expect, it } from 'vitest';

import {
  ARMOR_GENDERS,
  ARMOR_MATERIALS,
  ARMOR_PREVIEW_HEIGHT,
  ARMOR_PREVIEW_WIDTH,
  ARMOR_SLOTS,
  armorPieceCount,
  listArmorPieceIds,
  pieceGender,
  pieceIndex,
  pieceMaterial,
  pieceSlot,
  requireArmorGender,
  requireArmorMaterial,
  requireArmorPieceId,
  requireArmorSlot,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';

const GENDERED_ARMOR_SLOTS = [
  'helm',
  'chest',
  'feet',
  'shoulderLeft',
  'legs',
  'gloves',
  'shoulderRight',
  'cloakFront',
  'cloakBack',
] as const satisfies readonly ArmorSlot[];

describe('armor catalog constants', () => {
  it('公开的性别、材质、部位和预览尺寸与规格一致', () => {
    expect(ARMOR_GENDERS).toEqual(['male', 'female']);
    expect(ARMOR_MATERIALS).toEqual(['plate', 'leather', 'cloth']);
    expect(ARMOR_SLOTS).toEqual([
      'helm',
      'chest',
      'feet',
      'shoulderLeft',
      'legs',
      'gloves',
      'shoulderRight',
      'cloakFront',
      'cloakBack',
      'crown',
      'wing',
    ]);
    expect(ARMOR_PREVIEW_WIDTH).toBe(600);
    expect(ARMOR_PREVIEW_HEIGHT).toBe(500);
  });
});

describe('armorPieceCount', () => {
  it('斗篷正反面各 15 个，其余部位 30 个', () => {
    expect(armorPieceCount('cloakFront')).toBe(15);
    expect(armorPieceCount('cloakBack')).toBe(15);

    for (const slot of ARMOR_SLOTS) {
      if (slot === 'cloakFront' || slot === 'cloakBack') {
        continue;
      }

      expect(armorPieceCount(slot)).toBe(30);
    }
  });

  it('部位不是目录里的值时抛错，并带上收到的值', () => {
    expect(() => armorPieceCount('hat' as ArmorSlot)).toThrowError(
      'Invalid armor slot. Received "hat".',
    );
  });
});

describe('listArmorPieceIds', () => {
  it('带性别的部位按 gender:material:slot:index 从 1 列到件数', () => {
    for (const gender of ARMOR_GENDERS) {
      for (const material of ARMOR_MATERIALS) {
        for (const slot of GENDERED_ARMOR_SLOTS) {
          const pieceIds = listArmorPieceIds({ slot, material, gender });

          expect(pieceIds).toHaveLength(armorPieceCount(slot));
          pieceIds.forEach((pieceId, offset) => {
            const index = offset + 1;
            expect(pieceId).toBe(`${gender}:${material}:${slot}:${index}`);
            expect(requireArmorPieceId(pieceId)).toBe(pieceId);
            expect(pieceSlot(pieceId)).toBe(slot);
            expect(pieceGender(pieceId)).toBe(gender);
            expect(pieceMaterial(pieceId)).toBe(material);
            expect(pieceIndex(pieceId)).toBe(index);
          });
        }
      }
    }
  });

  it('斗篷只有 15 个编号，第 16 个越界', () => {
    const cloakFrontIds = listArmorPieceIds({
      slot: 'cloakFront',
      gender: 'female',
      material: 'cloth',
    });
    const cloakBackIds = listArmorPieceIds({
      slot: 'cloakBack',
      gender: 'male',
      material: 'leather',
    });

    expect(cloakFrontIds).toHaveLength(15);
    expect(cloakFrontIds[0]).toBe('female:cloth:cloakFront:1');
    expect(cloakFrontIds[14]).toBe('female:cloth:cloakFront:15');
    expect(cloakBackIds).toHaveLength(15);
    expect(cloakBackIds[0]).toBe('male:leather:cloakBack:1');
    expect(cloakBackIds[14]).toBe('male:leather:cloakBack:15');
    expect(requireArmorPieceId('female:cloth:cloakFront:15')).toBe('female:cloth:cloakFront:15');
    expect(() => requireArmorPieceId('female:cloth:cloakFront:16')).toThrowError(
      'Armor piece id "female:cloth:cloakFront:16" is outside 1..15 for slot "cloakFront".',
    );
    expect(() => requireArmorPieceId('male:leather:cloakBack:16')).toThrowError(
      'Armor piece id "male:leather:cloakBack:16" is outside 1..15 for slot "cloakBack".',
    );
  });

  it('王冠和翅膀使用 shared 编号，不读取性别和材质', () => {
    const crownIds = listArmorPieceIds({ slot: 'crown' });
    const wingIds = listArmorPieceIds({ slot: 'wing' });
    const crownWithIgnoredFields = listArmorPieceIds({
      slot: 'crown',
      gender: 'male',
      material: 'plate',
    });
    const wingWithIgnoredFields = listArmorPieceIds({
      slot: 'wing',
      material: 'silk' as ArmorMaterial,
      gender: 'robot' as ArmorGender,
    });

    expect(crownIds).toHaveLength(30);
    expect(crownIds[0]).toBe('shared:crown:1');
    expect(crownIds[1]).toBe('shared:crown:2');
    expect(crownIds[29]).toBe('shared:crown:30');
    expect(wingIds[0]).toBe('shared:wing:1');
    expect(wingIds[29]).toBe('shared:wing:30');
    expect(crownWithIgnoredFields).toEqual(crownIds);
    expect(wingWithIgnoredFields).toEqual(wingIds);

    for (const pieceId of crownIds) {
      expect(pieceGender(pieceId)).toBeNull();
      expect(pieceMaterial(pieceId)).toBeNull();
      expect(pieceSlot(pieceId)).toBe('crown');
    }

    expect(pieceGender('shared:wing:7')).toBeNull();
    expect(pieceMaterial('shared:wing:7')).toBeNull();
    expect(pieceSlot('shared:wing:7')).toBe('wing');
    expect(pieceIndex('shared:wing:7')).toBe(7);
  });

  it('其他部位缺少材质或性别时抛错，并带上收到的部位', () => {
    expect(() => listArmorPieceIds({ slot: 'chest' })).toThrowError(
      'Armor piece list for slot "chest" requires a material. Received undefined.',
    );
    expect(() => listArmorPieceIds({ slot: 'gloves', gender: 'female' })).toThrowError(
      'Armor piece list for slot "gloves" requires a material. Received undefined.',
    );
    expect(() => listArmorPieceIds({ slot: 'feet', material: 'plate' })).toThrowError(
      'Armor piece list for slot "feet" requires a gender. Received undefined.',
    );
  });
});

describe('require armor values', () => {
  it('非法性别、材质、部位和编号会抛错，并带上收到的原始值', () => {
    expect(() => requireArmorGender('robot')).toThrowError(
      'Invalid armor gender. Received "robot".',
    );
    expect(() => requireArmorGender(null)).toThrowError('Invalid armor gender. Received null.');
    expect(() => requireArmorMaterial('silk')).toThrowError(
      'Invalid armor material. Received "silk".',
    );
    expect(() => requireArmorMaterial(undefined)).toThrowError(
      'Invalid armor material. Received undefined.',
    );
    expect(() => requireArmorSlot('hat')).toThrowError('Invalid armor slot. Received "hat".');
    expect(() => requireArmorSlot('')).toThrowError('Invalid armor slot. Received "".');
    expect(() => requireArmorPieceId(31)).toThrowError('Invalid armor piece id. Received 31.');
    expect(() => requireArmorPieceId('nope')).toThrowError(
      'Invalid armor piece id. Received "nope".',
    );
    expect(requireArmorGender('female')).toBe('female');
    expect(requireArmorMaterial('leather')).toBe('leather');
    expect(requireArmorSlot('shoulderLeft')).toBe('shoulderLeft');
  });

  it('对象和数组会把内容写进错误信息，stringify 失败时带上原因', () => {
    expect(() => requireArmorGender({ gender: 'robot' })).toThrowError(
      'Invalid armor gender. Received {"gender":"robot"}.',
    );
    expect(() => listArmorPieceIds(['chest'] as unknown as { slot: ArmorSlot })).toThrowError(
      'Armor piece list requires a query. Received ["chest"].',
    );

    const circularValue: { self?: unknown } = {};
    circularValue.self = circularValue;
    expect(() => requireArmorMaterial(circularValue)).toThrowError(
      /Invalid armor material\. Received \[object Object\] \(JSON.stringify failed: [\s\S]*circular[\s\S]*\)\./,
    );
  });

  it('编号越界或部位和编号对不上时抛错，并带上原始字符串', () => {
    expect(() => requireArmorPieceId('male:plate:helm:31')).toThrowError(
      'Armor piece id "male:plate:helm:31" is outside 1..30 for slot "helm".',
    );
    expect(() => requireArmorPieceId('male:plate:helm:0')).toThrowError(
      'Armor piece id "male:plate:helm:0" is outside 1..30 for slot "helm".',
    );
    expect(() => requireArmorPieceId('shared:crown:31')).toThrowError(
      'Armor piece id "shared:crown:31" is outside 1..30 for slot "crown".',
    );
    expect(() => requireArmorPieceId('shared:wing:0')).toThrowError(
      'Armor piece id "shared:wing:0" is outside 1..30 for slot "wing".',
    );
    expect(() => requireArmorPieceId('male:plate:crown:1')).toThrowError(
      'Armor piece id "male:plate:crown:1" does not match slot "crown".',
    );
    expect(() => requireArmorPieceId('shared:helm:1')).toThrowError(
      'Armor piece id "shared:helm:1" does not match slot "helm".',
    );
    expect(() => requireArmorPieceId('female:cloth:wing:2')).toThrowError(
      'Armor piece id "female:cloth:wing:2" does not match slot "wing".',
    );
    expect(() => pieceIndex('male:plate:helm:31')).toThrowError('male:plate:helm:31');
    expect(() => pieceSlot('shared:helm:1')).toThrowError('shared:helm:1');
    expect(() => pieceGender('male:plate:crown:1')).toThrowError('male:plate:crown:1');
    expect(() => pieceMaterial('not-an-id')).toThrowError('not-an-id');
    expect(() => requireArmorPieceId('male:plate:helm:01')).toThrowError(
      'Invalid armor piece id. Received "male:plate:helm:01".',
    );
  });

  it('合法编号可以还原部位、性别、材质和序号', () => {
    expect(requireArmorPieceId('male:plate:shoulderRight:30')).toBe('male:plate:shoulderRight:30');
    expect(pieceSlot('male:plate:shoulderRight:30')).toBe('shoulderRight');
    expect(pieceGender('male:plate:shoulderRight:30')).toBe('male');
    expect(pieceMaterial('male:plate:shoulderRight:30')).toBe('plate');
    expect(pieceIndex('male:plate:shoulderRight:30')).toBe(30);
    expect(requireArmorPieceId('shared:crown:1')).toBe('shared:crown:1');
    expect(pieceGender('shared:crown:1')).toBeNull();
    expect(pieceMaterial('shared:crown:1')).toBeNull();
  });
});
