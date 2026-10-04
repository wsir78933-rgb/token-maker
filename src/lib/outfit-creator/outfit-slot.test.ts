import { describe, expect, it } from 'vitest';

import {
  activeOutfitSlotForAutosave,
  selectionForOutfitSlot,
} from '@/lib/outfit-creator/outfit-slot';
import { createInitialOutfitSelection } from '@/lib/outfit-creator/selection';

describe('selectionForOutfitSlot', () => {
  it('creates an empty initial selection for an empty slot', () => {
    expect(selectionForOutfitSlot(1, null)).toEqual({
      activeOutfitSlot: 1,
      selection: createInitialOutfitSelection(),
    });
  });

  it('copies a valid snapshot without sharing equipment state', () => {
    const storedSnapshot = {
      gender: 'female' as const,
      equippedPieceIds: { shirt: 'shirt31' },
    };
    const loaded = selectionForOutfitSlot(3, storedSnapshot);

    expect(loaded).toEqual({ activeOutfitSlot: 3, selection: storedSnapshot });
    expect(loaded.selection).not.toBe(storedSnapshot);
    expect(loaded.selection.equippedPieceIds).not.toBe(storedSnapshot.equippedPieceIds);
    loaded.selection.equippedPieceIds.shirt = 'shirt32';
    expect(storedSnapshot.equippedPieceIds.shirt).toBe('shirt31');
  });

  it('validates slot snapshots and autosave slots', () => {
    expect(() => selectionForOutfitSlot(0, null)).toThrowError('Received 0');
    expect(() => selectionForOutfitSlot(1, {
      gender: 'male',
      equippedPieceIds: { pants: 'shirt1' },
    } as never)).toThrowError('shirt1');
    expect(activeOutfitSlotForAutosave(null)).toBeNull();
    expect(activeOutfitSlotForAutosave(4)).toBe(4);
    expect(() => activeOutfitSlotForAutosave(1.5)).toThrowError('1.5');
  });
});
