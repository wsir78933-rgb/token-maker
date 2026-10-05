import { describe, expect, it } from 'vitest';

import { listWeaponPieceIds } from '@/lib/weapon-creator/catalog';
import {
  clearWeaponSelection,
  createInitialWeaponSelection,
  isWeaponPieceEquipped,
  toggleWeaponPiece,
} from '@/lib/weapon-creator/selection';

function firstPiece(category: Parameters<typeof listWeaponPieceIds>[0]): string {
  const pieceIds = listWeaponPieceIds(category);
  const pieceId = pieceIds[0];
  if (pieceId === undefined) {
    throw new Error(`Expected ${category} to contain at least one weapon piece.`);
  }

  return pieceId;
}

function secondPiece(category: Parameters<typeof listWeaponPieceIds>[0]): string {
  const pieceIds = listWeaponPieceIds(category);
  const pieceId = pieceIds[1];
  if (pieceId === undefined) {
    throw new Error(`Expected ${category} to contain at least two weapon pieces.`);
  }

  return pieceId;
}

describe('weapon selection', () => {
  it('starts empty', () => {
    expect(createInitialWeaponSelection()).toEqual({ equippedPieceIds: {} });
  });

  it('combines categories, replaces within a category, and toggles a selected piece off', () => {
    const firstHilt = firstPiece('hilts');
    const secondHilt = secondPiece('hilts');
    const firstBlade = firstPiece('blade');
    const firstSelection = toggleWeaponPiece(createInitialWeaponSelection(), firstHilt);
    const combinedSelection = toggleWeaponPiece(firstSelection, firstBlade);
    const replacedSelection = toggleWeaponPiece(combinedSelection, secondHilt);

    expect(replacedSelection.equippedPieceIds).toEqual({
      hilts: secondHilt,
      blade: firstBlade,
    });
    expect(isWeaponPieceEquipped(replacedSelection, secondHilt)).toBe(true);
    expect(isWeaponPieceEquipped(replacedSelection, firstHilt)).toBe(false);
    expect(toggleWeaponPiece(replacedSelection, secondHilt)).toEqual({
      equippedPieceIds: { blade: firstBlade },
    });
  });

  it('clears the selected pieces without sharing the source object', () => {
    const firstHilt = firstPiece('hilts');
    const selection = toggleWeaponPiece(createInitialWeaponSelection(), firstHilt);
    const clearedSelection = clearWeaponSelection(selection);

    expect(clearedSelection).toEqual({ equippedPieceIds: {} });
    expect(clearedSelection.equippedPieceIds).not.toBe(selection.equippedPieceIds);
  });

  it('rejects malformed selection data and unknown piece ids', () => {
    const firstHilt = firstPiece('hilts');
    const firstBlade = firstPiece('blade');

    expect(() => toggleWeaponPiece({ equippedPieceIds: { hilts: firstBlade } }, firstHilt)).toThrowError(
      firstBlade,
    );
    expect(() => toggleWeaponPiece(createInitialWeaponSelection(), 'missing-weapon-piece')).toThrowError(
      'missing-weapon-piece',
    );
    expect(() => clearWeaponSelection({} as never)).toThrowError('undefined');
  });
});
