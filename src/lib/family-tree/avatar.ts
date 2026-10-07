import {
  FAMILY_TREE_COLOR_PALETTES,
  familyTreeColorIndexCount,
  getFamilyTreeAvatarChoice,
  getFamilyTreeCategoryChoices,
  requireFamilyTreeAvatarColorKey,
  type FamilyTreeAvatarCategory,
  type FamilyTreeAvatarChoice,
  type FamilyTreeAvatarChoiceGroup,
  type FamilyTreeAvatarColorKey,
} from '@/lib/family-tree/catalog';

export type FamilyTreeAvatarExtras = {
  faceWrinkle: string | null;
  eyeWrinkle: string | null;
  scars: readonly string[];
};

export type FamilyTreeAvatar = {
  faces: string;
  hair: string;
  ears: string;
  eyes: string;
  eyebrows: string;
  noses: string;
  mouths: string;
  extras: FamilyTreeAvatarExtras;
  skinColor: number;
  hairColor: number;
  eyeColor: number;
  eyebrowColor: number;
  moustacheColor: number;
};

const AVATAR_FIELDS = [
  'faces',
  'hair',
  'ears',
  'eyes',
  'eyebrows',
  'noses',
  'mouths',
  'extras',
  'skinColor',
  'hairColor',
  'eyeColor',
  'eyebrowColor',
  'moustacheColor',
] as const;

const EXTRA_FIELDS = ['faceWrinkle', 'eyeWrinkle', 'scars'] as const;

const CATEGORY_FIELD_BY_CATEGORY: Readonly<Record<
  Exclude<FamilyTreeAvatarCategory, 'extras'>,
  keyof Pick<FamilyTreeAvatar, 'faces' | 'hair' | 'ears' | 'eyes' | 'eyebrows' | 'noses' | 'mouths'>
>> = {
  faces: 'faces',
  hair: 'hair',
  ears: 'ears',
  eyes: 'eyes',
  eyebrows: 'eyebrows',
  noses: 'noses',
  mouths: 'mouths',
};

type PlainRecord = Record<string, unknown>;

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol' ||
    typeof value === 'function'
  ) {
    return String(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${error.message}).`;
    }

    throw error;
  }
}

function isPlainRecord(value: unknown): value is PlainRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requirePlainRecord(value: unknown, label: string): PlainRecord {
  if (!isPlainRecord(value)) {
    throw new Error(`${label} must be an object. Received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function requireExactFields(record: PlainRecord, expectedFields: readonly string[], label: string): void {
  const actualFields = Object.keys(record).sort();
  const sortedExpectedFields = [...expectedFields].sort();
  const fieldsMatch =
    actualFields.length === sortedExpectedFields.length &&
    actualFields.every((field, fieldIndex) => field === sortedExpectedFields[fieldIndex]);

  if (!fieldsMatch) {
    throw new Error(
      `${label} must contain exactly ${sortedExpectedFields.join(', ')}. Received ${describeReceivedValue(record)}.`,
    );
  }
}

function requireNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string. Received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function requireInteger(value: unknown, label: string, minimum: number, maximum: number): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(
      `${label} must be an integer from ${String(minimum)} to ${String(maximum)}. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireChoiceIdForCategory(
  value: unknown,
  category: Exclude<FamilyTreeAvatarCategory, 'extras'>,
  label: string,
): string {
  const choiceId = requireNonEmptyString(value, label);
  const choice = getFamilyTreeCategoryChoices(category).find((candidate) => candidate.id === choiceId);
  if (choice === undefined) {
    throw new Error(
      `${label} must identify a ${JSON.stringify(category)} choice. Received ${JSON.stringify(choiceId)}.`,
    );
  }

  return choice.id;
}

function requireExtraChoiceId(
  value: unknown,
  group: Exclude<FamilyTreeAvatarChoiceGroup, 'reset' | 'faces' | 'beards' | 'hair' | 'ears' | 'eyes' | 'eyebrows' | 'noses' | 'moustaches' | 'mouths'>,
  label: string,
): string {
  const choiceId = requireNonEmptyString(value, label);
  const choice = getFamilyTreeCategoryChoices('extras').find(
    (candidate) => candidate.id === choiceId && candidate.group === group,
  );
  if (choice === undefined) {
    throw new Error(
      `${label} must identify an ${JSON.stringify(group)} choice. Received ${JSON.stringify(choiceId)}.`,
    );
  }

  return choice.id;
}

function requireOptionalExtraChoiceId(
  value: unknown,
  group: 'faceWrinkles' | 'eyeWrinkles',
  label: string,
): string | null {
  if (value === null) {
    return null;
  }

  return requireExtraChoiceId(value, group, label);
}

function requireScarChoiceIds(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Family tree avatar scars must be an array. Received ${describeReceivedValue(value)}.`);
  }

  const scarIds: string[] = [];
  const seenScarIds = new Set<string>();
  for (const scarValue of value) {
    const scarId = requireExtraChoiceId(scarValue, 'scars', 'Family tree avatar scar');
    if (seenScarIds.has(scarId)) {
      throw new Error(`Family tree avatar scars must not repeat ${JSON.stringify(scarId)}.`);
    }
    seenScarIds.add(scarId);
    scarIds.push(scarId);
  }

  return scarIds;
}

function requireColorIndex(value: unknown, colorKey: FamilyTreeAvatarColorKey): number {
  const maximum = familyTreeColorIndexCount(colorKey);
  return requireInteger(value, `Family tree avatar ${colorKey}`, 1, maximum);
}

function readValidatedAvatar(value: unknown): FamilyTreeAvatar {
  const record = requirePlainRecord(value, 'Family tree avatar');
  requireExactFields(record, AVATAR_FIELDS, 'Family tree avatar');
  const extrasRecord = requirePlainRecord(record.extras, 'Family tree avatar extras');
  requireExactFields(extrasRecord, EXTRA_FIELDS, 'Family tree avatar extras');

  const avatar: FamilyTreeAvatar = {
    faces: requireChoiceIdForCategory(record.faces, 'faces', 'Family tree avatar faces'),
    hair: requireChoiceIdForCategory(record.hair, 'hair', 'Family tree avatar hair'),
    ears: requireChoiceIdForCategory(record.ears, 'ears', 'Family tree avatar ears'),
    eyes: requireChoiceIdForCategory(record.eyes, 'eyes', 'Family tree avatar eyes'),
    eyebrows: requireChoiceIdForCategory(record.eyebrows, 'eyebrows', 'Family tree avatar eyebrows'),
    noses: requireChoiceIdForCategory(record.noses, 'noses', 'Family tree avatar noses'),
    mouths: requireChoiceIdForCategory(record.mouths, 'mouths', 'Family tree avatar mouths'),
    extras: {
      faceWrinkle: requireOptionalExtraChoiceId(
        extrasRecord.faceWrinkle,
        'faceWrinkles',
        'Family tree avatar face wrinkle',
      ),
      eyeWrinkle: requireOptionalExtraChoiceId(
        extrasRecord.eyeWrinkle,
        'eyeWrinkles',
        'Family tree avatar eye wrinkle',
      ),
      scars: requireScarChoiceIds(extrasRecord.scars),
    },
    skinColor: requireColorIndex(record.skinColor, 'skinColor'),
    hairColor: requireColorIndex(record.hairColor, 'hairColor'),
    eyeColor: requireColorIndex(record.eyeColor, 'eyeColor'),
    eyebrowColor: requireColorIndex(record.eyebrowColor, 'eyebrowColor'),
    moustacheColor: requireColorIndex(record.moustacheColor, 'moustacheColor'),
  };

  return avatar;
}

export function requireFamilyTreeAvatar(value: unknown): FamilyTreeAvatar {
  return readValidatedAvatar(value);
}

export function createInitialFamilyTreeAvatar(): FamilyTreeAvatar {
  return {
    faces: 'face1',
    hair: 'hair1',
    ears: 'ears1',
    eyes: 'eyes1',
    eyebrows: 'eb1',
    noses: 'nose1',
    mouths: 'mouth1',
    extras: {
      faceWrinkle: null,
      eyeWrinkle: null,
      scars: [],
    },
    skinColor: 1,
    hairColor: 1,
    eyeColor: 1,
    eyebrowColor: 1,
    moustacheColor: 1,
  };
}

function choiceForId(choiceId: string): FamilyTreeAvatarChoice {
  return getFamilyTreeAvatarChoice(choiceId);
}

function setChoiceField(
  avatar: FamilyTreeAvatar,
  category: Exclude<FamilyTreeAvatarCategory, 'extras'>,
  choiceId: string,
): FamilyTreeAvatar {
  const fieldName = CATEGORY_FIELD_BY_CATEGORY[category];
  return {
    ...avatar,
    [fieldName]: choiceId,
    extras: { ...avatar.extras, scars: [...avatar.extras.scars] },
  } as FamilyTreeAvatar;
}

export function selectFamilyTreeAvatarChoice(
  avatar: FamilyTreeAvatar,
  choiceId: string,
): FamilyTreeAvatar {
  const currentAvatar = requireFamilyTreeAvatar(avatar);
  const choice = choiceForId(choiceId);

  if (choice.category !== 'extras') {
    return setChoiceField(currentAvatar, choice.category, choice.id);
  }

  if (choice.group === 'reset') {
    return {
      ...currentAvatar,
      extras: {
        faceWrinkle: null,
        eyeWrinkle: null,
        scars: [...currentAvatar.extras.scars],
      },
    };
  }

  if (choice.group === 'faceWrinkles') {
    return {
      ...currentAvatar,
      extras: {
        faceWrinkle: choice.id,
        eyeWrinkle: currentAvatar.extras.eyeWrinkle,
        scars: [...currentAvatar.extras.scars],
      },
    };
  }

  if (choice.group === 'eyeWrinkles') {
    return {
      ...currentAvatar,
      extras: {
        faceWrinkle: currentAvatar.extras.faceWrinkle,
        eyeWrinkle: choice.id,
        scars: [...currentAvatar.extras.scars],
      },
    };
  }

  if (choice.group === 'scars') {
    const scarIsPresent = currentAvatar.extras.scars.includes(choice.id);
    const nextScars = scarIsPresent
      ? currentAvatar.extras.scars.filter((scarId) => scarId !== choice.id)
      : [...currentAvatar.extras.scars, choice.id];

    return {
      ...currentAvatar,
      extras: {
        faceWrinkle: currentAvatar.extras.faceWrinkle,
        eyeWrinkle: currentAvatar.extras.eyeWrinkle,
        scars: nextScars,
      },
    };
  }

  throw new Error(`Family tree extras choice group is unsupported. Received ${JSON.stringify(choice.group)}.`);
}

export function setFamilyTreeAvatarColor(
  avatar: FamilyTreeAvatar,
  colorKey: FamilyTreeAvatarColorKey,
  colorIndex: number,
): FamilyTreeAvatar {
  const currentAvatar = requireFamilyTreeAvatar(avatar);
  const validColorKey = requireFamilyTreeAvatarColorKey(colorKey);
  const validColorIndex = requireColorIndex(colorIndex, validColorKey);

  return {
    ...currentAvatar,
    [validColorKey]: validColorIndex,
    extras: { ...currentAvatar.extras, scars: [...currentAvatar.extras.scars] },
  } as FamilyTreeAvatar;
}

export function familyTreeAvatarChoiceSelected(
  avatar: FamilyTreeAvatar,
  choiceId: string,
): boolean {
  const currentAvatar = requireFamilyTreeAvatar(avatar);
  const choice = choiceForId(choiceId);

  if (choice.category !== 'extras') {
    return currentAvatar[CATEGORY_FIELD_BY_CATEGORY[choice.category]] === choice.id;
  }

  if (choice.group === 'reset') {
    return currentAvatar.extras.faceWrinkle === null && currentAvatar.extras.eyeWrinkle === null;
  }

  if (choice.group === 'faceWrinkles') {
    return currentAvatar.extras.faceWrinkle === choice.id;
  }

  if (choice.group === 'eyeWrinkles') {
    return currentAvatar.extras.eyeWrinkle === choice.id;
  }

  if (choice.group === 'scars') {
    return currentAvatar.extras.scars.includes(choice.id);
  }

  throw new Error(`Family tree extras choice group is unsupported. Received ${JSON.stringify(choice.group)}.`);
}

function randomInteger(minimum: number, maximum: number): number {
  if (!Number.isSafeInteger(minimum) || !Number.isSafeInteger(maximum) || minimum > maximum) {
    throw new Error(`Random integer range is invalid. Received ${String(minimum)}-${String(maximum)}.`);
  }

  const randomValue = Math.random();
  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new Error(`Random value must be in the interval [0, 1). Received ${String(randomValue)}.`);
  }

  return minimum + Math.floor(randomValue * (maximum - minimum + 1));
}

function randomChoiceId(prefix: string, minimum: number, maximum: number): string {
  return `${prefix}${randomInteger(minimum, maximum)}`;
}

function randomScarIds(): readonly string[] {
  const scarRoll = randomInteger(0, 19);
  if (scarRoll >= 5) {
    return [];
  }

  const scarCount = scarRoll === 2
    ? randomInteger(1, 5)
    : scarRoll === 3
      ? randomInteger(10, 19)
      : randomInteger(1, 2);
  const availableScarNumbers = Array.from({ length: 30 }, (_, index) => index + 1);
  const selectedScarIds: string[] = [];
  for (let selectedCount = 0; selectedCount < scarCount; selectedCount += 1) {
    const availableIndex = randomInteger(0, availableScarNumbers.length - 1);
    const [selectedScarNumber] = availableScarNumbers.splice(availableIndex, 1);
    if (selectedScarNumber === undefined) {
      throw new Error(`Random scar selection returned no scar at index ${String(availableIndex)}.`);
    }
    selectedScarIds.push(`scar${selectedScarNumber}`);
  }

  return selectedScarIds;
}

function randomizeGenderSpecificHair(isMale: boolean): string {
  return isMale ? randomChoiceId('hair', 1, 20) : randomChoiceId('hair', 21, 40);
}

function randomizeGenderSpecificEyebrows(isMale: boolean): string {
  const baseHairStyle = isMale ? randomInteger(1, 20) : randomInteger(21, 40);
  const offset = isMale ? randomInteger(0, 1) : baseHairStyle === 21 ? 0 : 1;
  return `eb${baseHairStyle * 2 - offset}`;
}

export function randomizeFamilyTreeAvatar(current?: FamilyTreeAvatar): FamilyTreeAvatar {
  if (current !== undefined) {
    requireFamilyTreeAvatar(current);
  }

  const isMale = randomInteger(0, 1) === 0;
  const skinColor = randomInteger(1, FAMILY_TREE_COLOR_PALETTES.skinColor.length);
  const hairColor = randomInteger(1, FAMILY_TREE_COLOR_PALETTES.hairColor.length);
  const eyeColor = randomInteger(1, FAMILY_TREE_COLOR_PALETTES.eyeColor.length);
  const eyebrowColor = hairColor;
  const moustacheColor = hairColor;
  const eyesAreOrc = randomInteger(0, 4) === 1;
  const eyeStyle = randomInteger(1, 20) + (eyesAreOrc ? 20 : 0);
  const mouthStyle = randomInteger(1, 40);
  const selectedScars = randomScarIds();
  const hasWrinkles = randomInteger(1, 10) < 4;

  let faceChoiceId: string;
  let noseChoiceId: string;
  let faceWrinkleChoiceId: string | null = null;
  let eyeWrinkleChoiceId: string | null = null;

  if (isMale) {
    const maleHasBeard = randomInteger(0, 4) > 2;
    faceChoiceId = maleHasBeard
      ? randomChoiceId('beards', 1, 17)
      : randomChoiceId('mface', 1, 18);
    const maleNoseRoll = randomInteger(1, 45);
    noseChoiceId = maleNoseRoll > 30
      ? randomChoiceId('mstch', 1, 28)
      : `nose${maleNoseRoll}`;
  } else {
    faceChoiceId = randomChoiceId('face', 1, 22);
    noseChoiceId = randomChoiceId('nose', 1, 30);
  }

  if (hasWrinkles) {
    eyeWrinkleChoiceId = randomChoiceId('eyesp', 1, 10);
    const faceWrinkleMaximum = mouthStyle > 20 ? 5 : 11;
    faceWrinkleChoiceId = randomChoiceId('old', 1, faceWrinkleMaximum);
  }

  if (noseChoiceId.startsWith('mstch')) {
    faceWrinkleChoiceId = null;
    eyeWrinkleChoiceId = null;
  }

  return {
    faces: faceChoiceId,
    hair: randomizeGenderSpecificHair(isMale),
    ears: randomChoiceId('ears', 1, 5),
    eyes: `eyes${eyeStyle}`,
    eyebrows: randomizeGenderSpecificEyebrows(isMale),
    noses: noseChoiceId,
    mouths: `mouth${mouthStyle}`,
    extras: {
      faceWrinkle: faceWrinkleChoiceId,
      eyeWrinkle: eyeWrinkleChoiceId,
      scars: selectedScars,
    },
    skinColor,
    hairColor,
    eyeColor,
    eyebrowColor,
    moustacheColor,
  };
}
