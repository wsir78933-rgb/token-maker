import {
  requireWeaponSaveSlotNumber,
  type WeaponSaveSlotNumber,
} from '@/lib/weapon-creator/saves';
import {
  createInitialWeaponSelection,
  requireWeaponSelection,
  type WeaponSelection,
} from '@/lib/weapon-creator/selection';

export function selectionForWeaponSlot(
  slotNumber: number,
  storedSnapshot: WeaponSelection | null,
): { activeWeaponSlot: WeaponSaveSlotNumber; selection: WeaponSelection } {
  const activeWeaponSlot = requireWeaponSaveSlotNumber(slotNumber);

  return {
    activeWeaponSlot,
    selection: storedSnapshot === null
      ? createInitialWeaponSelection()
      : requireWeaponSelection(storedSnapshot),
  };
}

export function activeWeaponSlotForAutosave(
  activeWeaponSlot: number | null,
): WeaponSaveSlotNumber | null {
  if (activeWeaponSlot === null) {
    return null;
  }

  return requireWeaponSaveSlotNumber(activeWeaponSlot);
}
