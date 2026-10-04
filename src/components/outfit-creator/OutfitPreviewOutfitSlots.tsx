import type { OutfitSaveSlotNumber } from '@/lib/outfit-creator/saves';

const OUTFIT_SLOT_NUMBERS = [1, 2, 3, 4] as const;

export type OutfitPreviewOutfitSlotsProps = {
  labels: readonly [string, string, string, string];
  activeOutfitSlot: OutfitSaveSlotNumber | null;
  onSelect: (slotNumber: OutfitSaveSlotNumber) => void;
};

export function OutfitPreviewOutfitSlots({
  labels,
  activeOutfitSlot,
  onSelect,
}: OutfitPreviewOutfitSlotsProps) {
  if (labels.length !== OUTFIT_SLOT_NUMBERS.length) {
    throw new Error(
      `Outfit preview slot labels must have length ${OUTFIT_SLOT_NUMBERS.length}. Received ${labels.length}.`,
    );
  }

  if (
    activeOutfitSlot !== null &&
    activeOutfitSlot !== 1 &&
    activeOutfitSlot !== 2 &&
    activeOutfitSlot !== 3 &&
    activeOutfitSlot !== 4
  ) {
    throw new Error(
      `Outfit preview slot must be 1, 2, 3, 4, or null. Received ${JSON.stringify(activeOutfitSlot)}.`,
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {OUTFIT_SLOT_NUMBERS.map((slotNumber) => {
        const selected = activeOutfitSlot === slotNumber;

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
