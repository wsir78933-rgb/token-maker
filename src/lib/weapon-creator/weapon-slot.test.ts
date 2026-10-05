import { describe, expect, it } from 'vitest';

import {
  activeWeaponSlotForAutosave,
  selectionForWeaponSlot,
} from '@/lib/weapon-creator/weapon-slot';
import { listWeaponPieceIds } from '@/lib/weapon-creator/catalog';
import {
  createInitialWeaponSelection,
  toggleWeaponPiece,
} from '@/lib/weapon-creator/selection';

function firstPiece(category: Parameters<typeof listWeaponPieceIds>[0]): string {
  const pieceId = listWeaponPieceIds(category)[0];
  if (pieceId === undefined) {
    throw new Error(`Expected ${category} to contain at least one weapon piece.`);
  }

  return pieceId;
}

describe('weapon slots', () => {
  it('creates an empty selection for an empty slot', () => {
    expect(selectionForWeaponSlot(1, null)).toEqual({
      activeWeaponSlot: 1,
      selection: createInitialWeaponSelection(),
    });
  });

  it('copies a stored snapshot without sharing its equipment state', () => {
    const firstHilt = firstPiece('hilts');
    const storedSnapshot = toggleWeaponPiece(createInitialWeaponSelection(), firstHilt);
    const loaded = selectionForWeaponSlot(3, storedSnapshot);

    expect(loaded).toEqual({ activeWeaponSlot: 3, selection: storedSnapshot });
    expect(loaded.selection).not.toBe(storedSnapshot);
    expect(loaded.selection.equippedPieceIds).not.toBe(storedSnapshot.equippedPieceIds);
    loaded.selection.equippedPieceIds.hilts = 'changed-piece-id';
    expect(storedSnapshot.equippedPieceIds.hilts).toBe(firstHilt);
  });

  it('validates slots and keeps autosave disabled until a slot is active', () => {
    expect(() => selectionForWeaponSlot(0, null)).toThrowError('Received 0');
    expect(activeWeaponSlotForAutosave(null)).toBeNull();
    expect(activeWeaponSlotForAutosave(4)).toBe(4);
    expect(() => activeWeaponSlotForAutosave(1.5)).toThrowError('1.5');
  });
});
