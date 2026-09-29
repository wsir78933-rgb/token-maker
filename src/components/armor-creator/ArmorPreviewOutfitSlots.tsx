const ARMOR_PREVIEW_OUTFIT_SLOT_NUMBERS = [1, 2, 3, 4] as const;
const ARMOR_PREVIEW_OUTFIT_LABEL_COUNT = ARMOR_PREVIEW_OUTFIT_SLOT_NUMBERS.length;

const ARMOR_PREVIEW_OUTFIT_SLOT_ROW_CLASS = 'grid grid-cols-4 gap-2';
const ARMOR_PREVIEW_OUTFIT_SLOT_BUTTON_SHAPE_CLASS = 'rounded-md border px-3 py-2 text-sm';
const ARMOR_PREVIEW_OUTFIT_SLOT_SELECTED_CLASS =
  'border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)]';
const ARMOR_PREVIEW_OUTFIT_SLOT_IDLE_CLASS =
  'border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]';

type ArmorPreviewOutfitSlotNumber = (typeof ARMOR_PREVIEW_OUTFIT_SLOT_NUMBERS)[number];

type ArmorPreviewOutfitLabels = readonly [string, string, string, string];

type ArmorPreviewOutfitSlotsProps = {
  labels: readonly string[];
  activeOutfitSlot: ArmorPreviewOutfitSlotNumber | null;
  onSelect: (slotNumber: ArmorPreviewOutfitSlotNumber) => void;
};

type ArmorPreviewOutfitSlotButtonProps = {
  label: string;
  slotNumber: ArmorPreviewOutfitSlotNumber;
  selected: boolean;
  onSelect: (slotNumber: ArmorPreviewOutfitSlotNumber) => void;
};

type ArmorPreviewOutfitSlotRowProps = {
  labels: ArmorPreviewOutfitLabels;
  activeOutfitSlot: ArmorPreviewOutfitSlotNumber | null;
  onSelect: (slotNumber: ArmorPreviewOutfitSlotNumber) => void;
};

function describeArmorPreviewOutfitValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }

  return describeJsonArmorPreviewOutfitValue(value);
}

function describeJsonArmorPreviewOutfitValue(value: unknown): string {
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    return Object.prototype.toString.call(value);
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${error.message}).`;
    }

    throw error;
  }
}

function requireArmorPreviewOutfitLabels(labels: readonly string[]): ArmorPreviewOutfitLabels {
  if (!Array.isArray(labels)) {
    throw new Error(
      `Armor preview outfit labels must be an array of length ${ARMOR_PREVIEW_OUTFIT_LABEL_COUNT}. Received ${describeArmorPreviewOutfitValue(labels)}.`,
    );
  }

  if (labels.length !== ARMOR_PREVIEW_OUTFIT_LABEL_COUNT) {
    throw new Error(
      `Armor preview outfit labels must have length ${ARMOR_PREVIEW_OUTFIT_LABEL_COUNT}. Received length ${labels.length}.`,
    );
  }

  return [
    requireArmorPreviewOutfitLabel(labels[0], 0),
    requireArmorPreviewOutfitLabel(labels[1], 1),
    requireArmorPreviewOutfitLabel(labels[2], 2),
    requireArmorPreviewOutfitLabel(labels[3], 3),
  ];
}

function requireArmorPreviewOutfitLabel(label: unknown, index: number): string {
  if (typeof label === 'string' && label.length > 0) {
    return label;
  }

  throw new Error(
    `Armor preview outfit label at index ${index} must be a non-empty string. Received ${describeArmorPreviewOutfitValue(label)}.`,
  );
}

function requireArmorPreviewActiveOutfitSlot(
  activeOutfitSlot: unknown,
): ArmorPreviewOutfitSlotNumber | null {
  if (activeOutfitSlot === null) {
    return null;
  }

  if (
    activeOutfitSlot === 1 ||
    activeOutfitSlot === 2 ||
    activeOutfitSlot === 3 ||
    activeOutfitSlot === 4
  ) {
    return activeOutfitSlot;
  }

  throw new Error(
    `Armor preview outfit slot must be 1, 2, 3, 4, or null. Received ${describeArmorPreviewOutfitValue(activeOutfitSlot)}.`,
  );
}

function armorPreviewOutfitSlotIsSelected(
  activeOutfitSlot: ArmorPreviewOutfitSlotNumber | null,
  slotNumber: ArmorPreviewOutfitSlotNumber,
): boolean {
  return activeOutfitSlot === slotNumber;
}

function armorPreviewOutfitSlotButtonClassName(selected: boolean): string {
  if (selected) {
    return `${ARMOR_PREVIEW_OUTFIT_SLOT_BUTTON_SHAPE_CLASS} ${ARMOR_PREVIEW_OUTFIT_SLOT_SELECTED_CLASS}`;
  }

  return `${ARMOR_PREVIEW_OUTFIT_SLOT_BUTTON_SHAPE_CLASS} ${ARMOR_PREVIEW_OUTFIT_SLOT_IDLE_CLASS}`;
}

function ArmorPreviewOutfitSlotButton({
  label,
  slotNumber,
  selected,
  onSelect,
}: ArmorPreviewOutfitSlotButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={armorPreviewOutfitSlotButtonClassName(selected)}
      onClick={() => {
        onSelect(slotNumber);
      }}
    >
      {label}
    </button>
  );
}

function ArmorPreviewOutfitSlotRow({
  labels,
  activeOutfitSlot,
  onSelect,
}: ArmorPreviewOutfitSlotRowProps) {
  return (
    <div className={ARMOR_PREVIEW_OUTFIT_SLOT_ROW_CLASS}>
      {ARMOR_PREVIEW_OUTFIT_SLOT_NUMBERS.map((slotNumber) => (
        <ArmorPreviewOutfitSlotButton
          key={slotNumber}
          label={labels[slotNumber - 1]}
          slotNumber={slotNumber}
          selected={armorPreviewOutfitSlotIsSelected(activeOutfitSlot, slotNumber)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function ArmorPreviewOutfitSlots({
  labels,
  activeOutfitSlot,
  onSelect,
}: ArmorPreviewOutfitSlotsProps) {
  const outfitLabels = requireArmorPreviewOutfitLabels(labels);
  const selectedOutfitSlot = requireArmorPreviewActiveOutfitSlot(activeOutfitSlot);

  return (
    <ArmorPreviewOutfitSlotRow
      labels={outfitLabels}
      activeOutfitSlot={selectedOutfitSlot}
      onSelect={onSelect}
    />
  );
}
