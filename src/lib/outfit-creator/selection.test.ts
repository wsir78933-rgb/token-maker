import { describe, expect, it } from 'vitest';

import {
  clearOutfitSelection,
  createInitialOutfitSelection,
  isOutfitPieceEquipped,
  setOutfitGender,
  toggleOutfitPiece,
} from '@/lib/outfit-creator/selection';

describe('outfit selection', () => {
  it('starts as a male selection with no equipment', () => {
    expect(createInitialOutfitSelection()).toEqual({
      gender: 'male',
      equippedPieceIds: {},
    });
  });

  it('toggles one piece per slot and lets shirts and shirts2 replace each other', () => {
    const initialSelection = createInitialOutfitSelection();
    const jacketSelection = toggleOutfitPiece(initialSelection, 'jacket4');
    const shirtSelection = toggleOutfitPiece(jacketSelection, 'shirt12');
    const secondShirtSelection = toggleOutfitPiece(shirtSelection, 'shirt44');

    expect(secondShirtSelection.equippedPieceIds).toEqual({
      jacket: 'jacket4',
      shirt: 'shirt44',
    });
    expect(isOutfitPieceEquipped(secondShirtSelection, 'shirt44')).toBe(true);
    expect(isOutfitPieceEquipped(secondShirtSelection, 'shirt12')).toBe(false);
    expect(toggleOutfitPiece(secondShirtSelection, 'shirt44')).toEqual({
      gender: 'male',
      equippedPieceIds: { jacket: 'jacket4' },
    });
  });

  it('preserves equipped ids when switching gender', () => {
    const selection = toggleOutfitPiece(
      toggleOutfitPiece(createInitialOutfitSelection(), 'jacket7'),
      'shoes23',
    );
    const femaleSelection = setOutfitGender(selection, 'female');

    expect(femaleSelection).toEqual({
      gender: 'female',
      equippedPieceIds: { jacket: 'jacket7', shoes: 'shoes23' },
    });
    expect(femaleSelection.equippedPieceIds).not.toBe(selection.equippedPieceIds);
  });

  it('clears equipment while retaining gender', () => {
    const femaleSelection = setOutfitGender(
      toggleOutfitPiece(createInitialOutfitSelection(), 'gloves8'),
      'female',
    );

    expect(clearOutfitSelection(femaleSelection)).toEqual({
      gender: 'female',
      equippedPieceIds: {},
    });
  });

  it('rejects malformed selections and piece ids with the received value', () => {
    expect(() => setOutfitGender({} as never, 'female')).toThrowError('undefined');
    expect(() => toggleOutfitPiece(createInitialOutfitSelection(), 'shirt61')).toThrowError(
      'shirt61',
    );
    expect(() => setOutfitGender(createInitialOutfitSelection(), 'robot' as never)).toThrowError(
      'robot',
    );
  });
});
