import { describe, expect, it } from 'vitest';

import { listArmorPieceIds, type ArmorSlot } from '@/lib/armor-creator/catalog';
import { armorPieceSvg } from '@/lib/armor-creator/icons';

const GENDERED_SLOTS = [
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

function pieceIdsForSlot(slot: ArmorSlot): string[] {
  if (slot === 'crown' || slot === 'wing') {
    return listArmorPieceIds({ slot });
  }

  return listArmorPieceIds({ slot, material: 'plate', gender: 'male' });
}

function expectArmorSvg(pieceId: string, options?: { flatChest?: boolean }): string {
  const svg = armorPieceSvg(pieceId, options);
  expect(svg.startsWith('<svg')).toBe(true);
  expect(svg).toContain('viewBox="0 0 64 64"');
  expect(svg.endsWith('</svg>')).toBe(true);
  expect(svg).not.toContain('<image');
  expect(svg).not.toContain('href=');
  return svg;
}

describe('armorPieceSvg', () => {
  it('合法编号返回的字符串以 <svg 开头', () => {
    expect(armorPieceSvg('male:plate:helm:1').startsWith('<svg')).toBe(true);
    expect(armorPieceSvg('female:leather:feet:30').startsWith('<svg')).toBe(true);
    expect(armorPieceSvg('female:cloth:cloakFront:15').startsWith('<svg')).toBe(true);
    expect(armorPieceSvg('shared:crown:1').startsWith('<svg')).toBe(true);
    expect(armorPieceSvg('shared:wing:30').startsWith('<svg')).toBe(true);
  });

  it('非法编号抛错，消息包含该字符串', () => {
    expect(() => armorPieceSvg('nope')).toThrowError('nope');
    expect(() => armorPieceSvg('male:plate:helm:31')).toThrowError('male:plate:helm:31');
    expect(() => armorPieceSvg('male:plate:helm:0')).toThrowError('male:plate:helm:0');
    expect(() => armorPieceSvg('nope', { flatChest: true })).toThrowError(
      'Invalid armor piece id. Received "nope".',
    );
  });

  it('female:plate:chest:1 可以平胸', () => {
    const flatChest = expectArmorSvg('female:plate:chest:1', { flatChest: true });
    const curvedChest = expectArmorSvg('female:plate:chest:1');
    expect(flatChest).not.toBe(curvedChest);
  });

  it('male:plate:helm:1 不能平胸，消息带上该编号', () => {
    expect(() => armorPieceSvg('male:plate:helm:1', { flatChest: true })).toThrowError(
      'male:plate:helm:1',
    );
  });

  it('不是女板胸的零件都不能平胸', () => {
    const rejectedPieceIds = [
      'female:leather:chest:1',
      'female:cloth:chest:2',
      'female:plate:helm:1',
      'male:plate:chest:1',
      'shared:crown:1',
    ];

    for (const pieceId of rejectedPieceIds) {
      expect(() => armorPieceSvg(pieceId, { flatChest: true })).toThrowError(pieceId);
    }
  });

  it('flatChest 不是布尔值时抛错，并带上收到的值', () => {
    expect(() =>
      armorPieceSvg('female:plate:chest:1', {
        flatChest: 'yes' as unknown as boolean,
      }),
    ).toThrowError('yes');
    expect(() => armorPieceSvg('female:plate:chest:1', null as unknown as undefined)).toThrowError(
      'null',
    );
  });

  it('同一部位的每个序号形状不同', () => {
    for (const slot of GENDERED_SLOTS) {
      const seen = new Set<string>();
      for (const pieceId of pieceIdsForSlot(slot)) {
        const svg = expectArmorSvg(pieceId);
        expect(seen.has(svg)).toBe(false);
        seen.add(svg);
      }
    }

    for (const slot of ['crown', 'wing'] as const) {
      const seen = new Set<string>();
      for (const pieceId of pieceIdsForSlot(slot)) {
        const svg = expectArmorSvg(pieceId);
        expect(seen.has(svg)).toBe(false);
        seen.add(svg);
      }
    }
  });

  it('女板胸的每个序号平胸形状不同，并且和平胸前不一样', () => {
    const seen = new Set<string>();
    const chestIds = listArmorPieceIds({
      slot: 'chest',
      material: 'plate',
      gender: 'female',
    });

    for (const pieceId of chestIds) {
      const flatChest = expectArmorSvg(pieceId, { flatChest: true });
      expect(flatChest).not.toBe(armorPieceSvg(pieceId));
      expect(seen.has(flatChest)).toBe(false);
      seen.add(flatChest);
    }
  });

  it('左右肩同一序号是同一形状', () => {
    expect(armorPieceSvg('female:cloth:shoulderLeft:8')).toBe(
      armorPieceSvg('female:cloth:shoulderRight:8'),
    );
    expect(armorPieceSvg('male:plate:shoulderLeft:20')).toBe(
      armorPieceSvg('male:plate:shoulderRight:20'),
    );
  });
});
