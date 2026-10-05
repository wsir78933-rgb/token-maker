import { describe, expect, it } from 'vitest';

import {
  WEAPON_CATEGORIES,
  WEAPON_LAYER_ORDER,
  WEAPON_PREVIEW_HEIGHT,
  WEAPON_PREVIEW_WIDTH,
  getWeaponLayerBox,
  listWeaponPieceIds,
  pieceCategory,
  requireWeaponCategory,
  requireWeaponPieceId,
} from '@/lib/weapon-creator/catalog';

describe('weapon catalog', () => {
  it('lists the source categories and all 540 source piece ids', () => {
    expect(WEAPON_CATEGORIES).toEqual([
      'hilts',
      'pommels',
      'crossguards',
      'blade',
      'handle',
      'axe',
      'mace',
      'hammer',
      'bow',
      'bowhandle',
      'bowtip',
      'stafftop',
      'staffbtm',
      'staff',
      'scythe',
      'polearm',
      'spear',
    ]);

    expect(WEAPON_CATEGORIES.reduce((count, category) => {
      return count + listWeaponPieceIds(category).length;
    }, 0)).toBe(540);
    expect(listWeaponPieceIds('hilts')).toEqual([
      'grip1',
      ...Array.from({ length: 29 }, (_, index) => `grip${index + 2}`),
    ]);
    expect(listWeaponPieceIds('pommels')).toHaveLength(60);
    expect(listWeaponPieceIds('pommels').at(-1)).toBe('pommel60');
    expect(listWeaponPieceIds('handle')[0]).toBe('stick1');
    expect(listWeaponPieceIds('spear').at(-1)).toBe('spear30');
  });

  it('validates ids and reports received values', () => {
    expect(requireWeaponCategory('blade')).toBe('blade');
    expect(requireWeaponPieceId('stick30')).toBe('stick30');
    expect(pieceCategory('stick30')).toBe('handle');
    expect(() => requireWeaponCategory('unknown')).toThrowError('"unknown"');
    expect(() => requireWeaponPieceId('handle1')).toThrowError('"handle1"');
    expect(() => requireWeaponPieceId(null)).toThrowError('null');
  });

  it('exposes the source canvas and layer coordinates', () => {
    expect(WEAPON_PREVIEW_WIDTH).toBe(800);
    expect(WEAPON_PREVIEW_HEIGHT).toBe(635);
    expect(WEAPON_LAYER_ORDER).toEqual([
      'blade',
      'axe',
      'handle',
      'hilts',
      'mace',
      'hammer',
      'pommels',
      'crossguards',
      'bow',
      'bowhandle',
      'bowtip',
      'staff',
      'stafftop',
      'staffbtm',
      'spear',
      'scythe',
      'polearm',
    ]);
    expect(getWeaponLayerBox('staff')).toEqual({
      x: 180,
      y: 40,
      width: 400,
      height: 620,
      zIndex: 23,
    });
    expect(getWeaponLayerBox('polearm')).toEqual({
      x: 332,
      y: 0,
      width: 105,
      height: 166,
      zIndex: 28,
    });
  });
});
