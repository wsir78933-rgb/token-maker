import { describe, expect, it } from 'vitest';

import {
  OUTFIT_CATEGORIES,
  OUTFIT_PREVIEW_HEIGHT,
  OUTFIT_PREVIEW_WIDTH,
  categoryOutfitSlot,
  listOutfitPieceIds,
  pieceCategory,
  pieceIndex,
  pieceSlot,
  requireOutfitPieceId,
} from '@/lib/outfit-creator/catalog';

describe('outfit catalog', () => {
  it('lists all nine categories with the source numbering', () => {
    expect(OUTFIT_CATEGORIES).toEqual([
      'jackets',
      'shirts',
      'shirts2',
      'pants',
      'skirts',
      'shoes',
      'scarves',
      'belts',
      'gloves',
    ]);

    expect(listOutfitPieceIds('jackets')).toHaveLength(30);
    expect(listOutfitPieceIds('shirts')).toEqual([
      'shirt1',
      ...Array.from({ length: 29 }, (_, index) => `shirt${index + 2}`),
    ]);
    expect(listOutfitPieceIds('shirts2')).toEqual([
      'shirt31',
      ...Array.from({ length: 29 }, (_, index) => `shirt${index + 32}`),
    ]);
    expect(listOutfitPieceIds('gloves').at(-1)).toBe('gloves30');
  });

  it('maps shirts and shirts2 to the shared shirt slot', () => {
    expect(categoryOutfitSlot('shirts')).toBe('shirt');
    expect(categoryOutfitSlot('shirts2')).toBe('shirt');
    expect(categoryOutfitSlot('jackets')).toBe('jacket');
    expect(categoryOutfitSlot('scarves')).toBe('scarf');
    expect(categoryOutfitSlot('belts')).toBe('belt');
  });

  it('exposes the fixed export size and validates piece ids', () => {
    expect(OUTFIT_PREVIEW_WIDTH).toBe(600);
    expect(OUTFIT_PREVIEW_HEIGHT).toBe(500);
    expect(requireOutfitPieceId('shirt31')).toBe('shirt31');
    expect(pieceCategory('shirt31')).toBe('shirts2');
    expect(pieceSlot('shirt31')).toBe('shirt');
    expect(pieceIndex('shirt31')).toBe(31);
    expect(() => requireOutfitPieceId('shirt61')).toThrowError('shirt61');
    expect(() => listOutfitPieceIds('unknown' as never)).toThrowError('unknown');
  });
});
