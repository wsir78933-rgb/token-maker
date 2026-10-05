import type { WeaponSaveSlotNumber } from '@/lib/weapon-creator/saves';

const WEAPON_SLOT_NUMBERS = [1, 2, 3, 4] as const;

export type WeaponPreviewWeaponSlotsProps = {
  labels: readonly [string, string, string, string];
  activeWeaponSlot: WeaponSaveSlotNumber | null;
  onSelect: (slotNumber: WeaponSaveSlotNumber) => void;
};

function requireWeaponSlotLabels(
  labels: readonly string[],
): asserts labels is readonly [string, string, string, string] {
  if (labels.length !== WEAPON_SLOT_NUMBERS.length) {
    throw new Error(
      `Weapon preview slot labels must have length ${WEAPON_SLOT_NUMBERS.length}. Received ${labels.length}.`,
    );
  }
}

function requireActiveWeaponSlot(
  activeWeaponSlot: WeaponSaveSlotNumber | null,
): void {
  if (
    activeWeaponSlot !== null &&
    activeWeaponSlot !== 1 &&
    activeWeaponSlot !== 2 &&
    activeWeaponSlot !== 3 &&
    activeWeaponSlot !== 4
  ) {
    throw new Error(
      `Weapon preview slot must be 1, 2, 3, 4, or null. Received ${JSON.stringify(activeWeaponSlot)}.`,
    );
  }
}

export function WeaponPreviewWeaponSlots({
  labels,
  activeWeaponSlot,
  onSelect,
}: WeaponPreviewWeaponSlotsProps) {
  requireWeaponSlotLabels(labels);
  requireActiveWeaponSlot(activeWeaponSlot);

  return (
    <div className="grid grid-cols-4 gap-2">
      {WEAPON_SLOT_NUMBERS.map((slotNumber) => {
        const selected = activeWeaponSlot === slotNumber;

        return (
          <button
            key={slotNumber}
            type="button"
            aria-pressed={selected}
            className={`w-full cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors enabled:hover:border-[var(--site-accent-strong)] enabled:hover:bg-[var(--site-accent-bg)] enabled:hover:text-[var(--site-accent-strong)] enabled:hover:shadow-sm ${
              selected
                ? 'border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)]'
                : 'border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]'
            }`}
            onClick={() => onSelect(slotNumber)}
          >
            {labels[slotNumber - 1]}
          </button>
        );
      })}
    </div>
  );
}
