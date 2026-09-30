'use client';

import {
  ARMOR_GENDERS,
  ARMOR_MATERIALS,
  requireArmorGender,
  requireArmorMaterial,
  type ArmorGender,
  type ArmorMaterial,
} from '@/lib/armor-creator/catalog';
import type { ArmorCreatorCopy } from '@/lib/armor-creator/copy';

const ARMOR_PICKER_HEADER_CLASS = 'space-y-2';
const ARMOR_PICKER_HALF_ROW_CLASS = 'grid grid-cols-2 gap-2';
const ARMOR_PICKER_THIRD_ROW_CLASS = 'grid grid-cols-3 gap-2';
const ARMOR_PICKER_ACTION_ROW_CLASS = 'grid grid-cols-4 gap-2';
const ARMOR_PICKER_BUTTON_CLASS = 'w-full rounded-md border px-3 py-2 text-center text-sm';
const ARMOR_PICKER_SELECTED_CLASS =
  'border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)]';
const ARMOR_PICKER_IDLE_CLASS =
  'border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]';
const ARMOR_PICKER_DISABLED_CLASS = 'disabled:cursor-not-allowed disabled:opacity-40';

type ArmorPickerChoiceLabelField =
  | 'genderMale'
  | 'genderFemale'
  | 'materialPlate'
  | 'materialLeather'
  | 'materialCloth';

type ArmorPickerActionLabelField = 'shoulderSymmetry' | 'chestCurve' | 'clearEquipment' | 'downloadImage';

type ArmorPickerLabelField = ArmorPickerChoiceLabelField | ArmorPickerActionLabelField;

type ArmorPickerHeaderLabels = Record<ArmorPickerChoiceLabelField, string>;

type ArmorPickerActionLabels = Record<ArmorPickerActionLabelField, string>;

type ArmorPickerHeaderProps = {
  copy: ArmorCreatorCopy;
  gender: ArmorGender;
  material: ArmorMaterial;
  onGender: (gender: ArmorGender) => void;
  onMaterial: (material: ArmorMaterial) => void;
};

type ArmorPickerActionsProps = {
  copy: ArmorCreatorCopy;
  shoulderSymmetry: boolean;
  chestCurve: boolean;
  chestCurveEnabled: boolean;
  onShoulderSymmetry: () => void;
  onChestCurve: () => void;
  onClear: () => void;
  onDownload: () => void;
};

type ArmorPickerHeaderState = {
  labels: ArmorPickerHeaderLabels;
  gender: ArmorGender;
  material: ArmorMaterial;
  onGender: (gender: ArmorGender) => void;
  onMaterial: (material: ArmorMaterial) => void;
};

type ArmorPickerActionsState = {
  labels: ArmorPickerActionLabels;
  shoulderSymmetry: boolean;
  chestCurve: boolean;
  chestCurveEnabled: boolean;
  onShoulderSymmetry: () => void;
  onChestCurve: () => void;
  onClear: () => void;
  onDownload: () => void;
};

function describeArmorPickerValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'function') {
    const functionName = value.name.length > 0 ? value.name : 'anonymous';
    return `function ${functionName}`;
  }

  return describeArmorPickerObject(value);
}

function describeArmorPickerObject(value: unknown): string {
  const valueTag = Object.prototype.toString.call(value);

  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    const returned = json === undefined ? 'undefined' : String(json);
    return `${valueTag} (JSON.stringify failed: returned ${returned}).`;
  } catch (error: unknown) {
    const reason = error instanceof Error && error.message.length > 0 ? error.message : String(error);
    return `${valueTag} (JSON.stringify failed: ${reason}).`;
  }
}

function isArmorPickerCopyRecord(copy: unknown): copy is Record<string, unknown> {
  return copy !== null && typeof copy === 'object' && !Array.isArray(copy);
}

function requireArmorPickerLabel(copyRecord: Record<string, unknown>, fieldName: ArmorPickerLabelField): string {
  const label = copyRecord[fieldName];
  if (typeof label === 'string' && label.length > 0) {
    return label;
  }

  throw new Error(
    `Armor picker copy ${fieldName} must be a non-empty string. Received ${describeArmorPickerValue(label)}.`,
  );
}

function requireArmorPickerCopyRecord(copy: unknown): Record<string, unknown> {
  if (!isArmorPickerCopyRecord(copy)) {
    throw new Error(`Armor picker copy must be an object. Received ${describeArmorPickerValue(copy)}.`);
  }

  return copy;
}

function readArmorPickerHeaderLabels(copy: unknown): ArmorPickerHeaderLabels {
  const copyRecord = requireArmorPickerCopyRecord(copy);

  return {
    genderMale: requireArmorPickerLabel(copyRecord, 'genderMale'),
    genderFemale: requireArmorPickerLabel(copyRecord, 'genderFemale'),
    materialPlate: requireArmorPickerLabel(copyRecord, 'materialPlate'),
    materialLeather: requireArmorPickerLabel(copyRecord, 'materialLeather'),
    materialCloth: requireArmorPickerLabel(copyRecord, 'materialCloth'),
  };
}

function readArmorPickerActionLabels(copy: unknown): ArmorPickerActionLabels {
  const copyRecord = requireArmorPickerCopyRecord(copy);

  return {
    shoulderSymmetry: requireArmorPickerLabel(copyRecord, 'shoulderSymmetry'),
    chestCurve: requireArmorPickerLabel(copyRecord, 'chestCurve'),
    clearEquipment: requireArmorPickerLabel(copyRecord, 'clearEquipment'),
    downloadImage: requireArmorPickerLabel(copyRecord, 'downloadImage'),
  };
}

function requireArmorPickerBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  throw new Error(
    `Armor picker ${fieldName} must be a boolean. Received ${describeArmorPickerValue(value)}.`,
  );
}

function requireArmorPickerGenderHandler(
  value: unknown,
  fieldName: string,
): (gender: ArmorGender) => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Armor picker ${fieldName} must be a function. Received ${describeArmorPickerValue(value)}.`,
    );
  }

  return value as (gender: ArmorGender) => void;
}

function requireArmorPickerMaterialHandler(
  value: unknown,
  fieldName: string,
): (material: ArmorMaterial) => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Armor picker ${fieldName} must be a function. Received ${describeArmorPickerValue(value)}.`,
    );
  }

  return value as (material: ArmorMaterial) => void;
}

function requireArmorPickerAction(value: unknown, fieldName: string): () => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Armor picker ${fieldName} must be a function. Received ${describeArmorPickerValue(value)}.`,
    );
  }

  return value as () => void;
}

function armorPickerGenderLabel(labels: ArmorPickerHeaderLabels, gender: ArmorGender): string {
  if (gender === 'male') {
    return labels.genderMale;
  }

  if (gender === 'female') {
    return labels.genderFemale;
  }

  throw new Error(`Unknown armor gender ${JSON.stringify(gender)}.`);
}

function armorPickerMaterialLabel(labels: ArmorPickerHeaderLabels, material: ArmorMaterial): string {
  if (material === 'plate') {
    return labels.materialPlate;
  }

  if (material === 'leather') {
    return labels.materialLeather;
  }

  if (material === 'cloth') {
    return labels.materialCloth;
  }

  throw new Error(`Unknown armor material ${JSON.stringify(material)}.`);
}

function armorPickerButtonClass(selected: boolean, disabled: boolean): string {
  const appearanceClass = selected ? ARMOR_PICKER_SELECTED_CLASS : ARMOR_PICKER_IDLE_CLASS;
  if (disabled) {
    return `${ARMOR_PICKER_BUTTON_CLASS} ${appearanceClass} ${ARMOR_PICKER_DISABLED_CLASS}`;
  }

  return `${ARMOR_PICKER_BUTTON_CLASS} ${appearanceClass}`;
}

function readArmorPickerHeader(props: ArmorPickerHeaderProps): ArmorPickerHeaderState {
  return {
    labels: readArmorPickerHeaderLabels(props.copy),
    gender: requireArmorGender(props.gender),
    material: requireArmorMaterial(props.material),
    onGender: requireArmorPickerGenderHandler(props.onGender, 'onGender'),
    onMaterial: requireArmorPickerMaterialHandler(props.onMaterial, 'onMaterial'),
  };
}

function readArmorPickerActions(props: ArmorPickerActionsProps): ArmorPickerActionsState {
  return {
    labels: readArmorPickerActionLabels(props.copy),
    shoulderSymmetry: requireArmorPickerBoolean(props.shoulderSymmetry, 'shoulderSymmetry'),
    chestCurve: requireArmorPickerBoolean(props.chestCurve, 'chestCurve'),
    chestCurveEnabled: requireArmorPickerBoolean(props.chestCurveEnabled, 'chestCurveEnabled'),
    onShoulderSymmetry: requireArmorPickerAction(props.onShoulderSymmetry, 'onShoulderSymmetry'),
    onChestCurve: requireArmorPickerAction(props.onChestCurve, 'onChestCurve'),
    onClear: requireArmorPickerAction(props.onClear, 'onClear'),
    onDownload: requireArmorPickerAction(props.onDownload, 'onDownload'),
  };
}

function renderArmorPickerToggleButton(
  label: string,
  pressed: boolean,
  disabled: boolean,
  onClick: () => void,
) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      className={armorPickerButtonClass(pressed, disabled)}
      onClick={() => onClick()}
    >
      {label}
    </button>
  );
}

function renderArmorPickerActionButton(label: string, onClick: () => void) {
  return (
    <button type="button" className={armorPickerButtonClass(false, false)} onClick={() => onClick()}>
      {label}
    </button>
  );
}

function renderArmorPickerGenderButton(header: ArmorPickerHeaderState, gender: ArmorGender) {
  const pressed = header.gender === gender;

  return (
    <button
      key={gender}
      type="button"
      aria-pressed={pressed}
      className={armorPickerButtonClass(pressed, false)}
      onClick={() => header.onGender(gender)}
    >
      {armorPickerGenderLabel(header.labels, gender)}
    </button>
  );
}

function renderArmorPickerMaterialButton(header: ArmorPickerHeaderState, material: ArmorMaterial) {
  const pressed = header.material === material;

  return (
    <button
      key={material}
      type="button"
      aria-pressed={pressed}
      className={armorPickerButtonClass(pressed, false)}
      onClick={() => header.onMaterial(material)}
    >
      {armorPickerMaterialLabel(header.labels, material)}
    </button>
  );
}

export function ArmorPickerHeader(props: ArmorPickerHeaderProps) {
  const header = readArmorPickerHeader(props);

  return (
    <div className={ARMOR_PICKER_HEADER_CLASS}>
      <div className={ARMOR_PICKER_HALF_ROW_CLASS}>
        {ARMOR_GENDERS.map((gender) => renderArmorPickerGenderButton(header, gender))}
      </div>
      <div className={ARMOR_PICKER_THIRD_ROW_CLASS}>
        {ARMOR_MATERIALS.map((material) => renderArmorPickerMaterialButton(header, material))}
      </div>
    </div>
  );
}

export function ArmorPickerActions(props: ArmorPickerActionsProps) {
  const actions = readArmorPickerActions(props);

  return (
    <div className={ARMOR_PICKER_ACTION_ROW_CLASS}>
      {renderArmorPickerToggleButton(
        actions.labels.shoulderSymmetry,
        actions.shoulderSymmetry,
        false,
        actions.onShoulderSymmetry,
      )}
      {renderArmorPickerToggleButton(
        actions.labels.chestCurve,
        actions.chestCurve,
        !actions.chestCurveEnabled,
        actions.onChestCurve,
      )}
      {renderArmorPickerActionButton(actions.labels.clearEquipment, actions.onClear)}
      {renderArmorPickerActionButton(actions.labels.downloadImage, actions.onDownload)}
    </div>
  );
}
