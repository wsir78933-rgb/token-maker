import { describe, expect, it } from 'vitest';

import {
  backOutfitPieceImagePath,
  outfitBodyImagePath,
  outfitPieceImagePath,
} from '@/lib/outfit-creator/icons';

describe('outfit image paths', () => {
  it('uses the local clothing directories and existing body files', () => {
    expect(outfitBodyImagePath('male')).toBe('/armor-creator/male/body.png');
    expect(outfitBodyImagePath('female')).toBe('/armor-creator/female/body.png');
    expect(outfitPieceImagePath('male', 'jacket1')).toBe(
      '/outfit-creator/nmale/jacket1.png',
    );
    expect(outfitPieceImagePath('female', 'shirt60')).toBe(
      '/outfit-creator/nfemale/shirt60.png',
    );
  });

  it('maps only the four source back layers', () => {
    expect(backOutfitPieceImagePath('male', 'jacket', 'jacket2')).toBe(
      '/outfit-creator/nmale/bjacket2.png',
    );
    expect(backOutfitPieceImagePath('female', 'shirt', 'shirt31')).toBe(
      '/outfit-creator/nfemale/bshirt31.png',
    );
    expect(backOutfitPieceImagePath('male', 'skirt', 'skirt30')).toBe(
      '/outfit-creator/nmale/bskirt30.png',
    );
    expect(backOutfitPieceImagePath('female', 'shoes', 'shoes1')).toBe(
      '/outfit-creator/nfemale/bshoes1.png',
    );
    expect(backOutfitPieceImagePath('female', 'pants', 'pants1')).toBeNull();
    expect(backOutfitPieceImagePath('female', 'belt', 'belt1')).toBeNull();
    expect(backOutfitPieceImagePath('female', 'gloves', 'gloves1')).toBeNull();
    expect(backOutfitPieceImagePath('female', 'scarf', 'scarf1')).toBeNull();
  });

  it('fails for invalid genders and mismatched slots', () => {
    expect(() => outfitBodyImagePath('robot' as never)).toThrowError('robot');
    expect(() => outfitPieceImagePath('male', 'jacket31')).toThrowError('jacket31');
    expect(() => backOutfitPieceImagePath('male', 'shirt', 'jacket1')).toThrowError(
      'jacket1',
    );
  });
});
