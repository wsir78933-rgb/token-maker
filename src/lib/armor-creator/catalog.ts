export const ARMOR_GENDERS = ['male', 'female'] as const;
export type ArmorGender = (typeof ARMOR_GENDERS)[number];

export const ARMOR_MATERIALS = ['plate', 'leather', 'cloth'] as const;
export type ArmorMaterial = (typeof ARMOR_MATERIALS)[number];

export const ARMOR_SLOTS = [
  'helm',
  'chest',
  'feet',
  'shoulderLeft',
  'legs',
  'gloves',
  'shoulderRight',
  'cloakFront',
  'cloakBack',
  'crown',
  'wing',
] as const;
export type ArmorSlot = (typeof ARMOR_SLOTS)[number];

export const ARMOR_PREVIEW_WIDTH = 600;
export const ARMOR_PREVIEW_HEIGHT = 500;

const CLOAK_PIECE_COUNT = 15;
const STANDARD_PIECE_COUNT = 30;
const SHARED_PIECE_OWNER = 'shared';
const SHARED_ARMOR_SLOTS = ['crown', 'wing'] as const;

type SharedArmorSlot = (typeof SHARED_ARMOR_SLOTS)[number];
type GenderedArmorSlot = Exclude<ArmorSlot, SharedArmorSlot>;

type ParsedArmorPieceId = {
  pieceId: string;
  slot: ArmorSlot;
  gender: ArmorGender | null;
  material: ArmorMaterial | null;
  index: number;
};

function stringifyFailureReason(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.length > 0) {
      return error.message;
    }

    return `${error.name} with empty message`;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error === undefined) {
    return 'undefined';
  }

  if (error === null) {
    return 'null';
  }

  if (typeof error === 'number' || typeof error === 'boolean' || typeof error === 'bigint') {
    return String(error);
  }

  return Object.prototype.toString.call(error);
}

function describeJsonReceivedValue(value: unknown): string {
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    const returned = json === undefined ? 'undefined' : String(json);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: returned ${returned}).`;
  } catch (error: unknown) {
    const reason = stringifyFailureReason(error);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason}).`;
  }
}

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

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return describeJsonReceivedValue(value);
}

function isArmorGender(value: unknown): value is ArmorGender {
  return typeof value === 'string' && ARMOR_GENDERS.some((gender) => gender === value);
}

function isArmorMaterial(value: unknown): value is ArmorMaterial {
  return typeof value === 'string' && ARMOR_MATERIALS.some((material) => material === value);
}

function isArmorSlot(value: unknown): value is ArmorSlot {
  return typeof value === 'string' && ARMOR_SLOTS.some((slot) => slot === value);
}

function isSharedArmorSlot(slot: ArmorSlot): slot is SharedArmorSlot {
  return SHARED_ARMOR_SLOTS.some((sharedSlot) => sharedSlot === slot);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function requireArmorGender(value: unknown): ArmorGender {
  if (isArmorGender(value)) {
    return value;
  }

  throw new Error(`Invalid armor gender. Received ${describeReceivedValue(value)}.`);
}

export function requireArmorMaterial(value: unknown): ArmorMaterial {
  if (isArmorMaterial(value)) {
    return value;
  }

  throw new Error(`Invalid armor material. Received ${describeReceivedValue(value)}.`);
}

export function requireArmorSlot(value: unknown): ArmorSlot {
  if (isArmorSlot(value)) {
    return value;
  }

  throw new Error(`Invalid armor slot. Received ${describeReceivedValue(value)}.`);
}

export function armorPieceCount(slot: ArmorSlot): number {
  const armorSlot = requireArmorSlot(slot);

  if (armorSlot === 'cloakFront' || armorSlot === 'cloakBack') {
    return CLOAK_PIECE_COUNT;
  }

  return STANDARD_PIECE_COUNT;
}

function listPieceIndexes(pieceCount: number): number[] {
  const indexes: number[] = [];

  for (let index = 1; index <= pieceCount; index += 1) {
    indexes.push(index);
  }

  return indexes;
}

function buildSharedPieceId(slot: SharedArmorSlot, index: number): string {
  return `${SHARED_PIECE_OWNER}:${slot}:${index}`;
}

function buildGenderedPieceId(
  gender: ArmorGender,
  material: ArmorMaterial,
  slot: GenderedArmorSlot,
  index: number,
): string {
  return `${gender}:${material}:${slot}:${index}`;
}

function listSharedArmorPieceIds(slot: SharedArmorSlot): string[] {
  return listPieceIndexes(armorPieceCount(slot)).map((index) => buildSharedPieceId(slot, index));
}

function requirePieceListMaterial(slot: ArmorSlot, material: unknown): ArmorMaterial {
  if (material === undefined || material === null) {
    throw new Error(
      `Armor piece list for slot ${JSON.stringify(slot)} requires a material. Received ${describeReceivedValue(material)}.`,
    );
  }

  return requireArmorMaterial(material);
}

function requirePieceListGender(slot: ArmorSlot, gender: unknown): ArmorGender {
  if (gender === undefined || gender === null) {
    throw new Error(
      `Armor piece list for slot ${JSON.stringify(slot)} requires a gender. Received ${describeReceivedValue(gender)}.`,
    );
  }

  return requireArmorGender(gender);
}

function listGenderedArmorPieceIds(
  slot: GenderedArmorSlot,
  material: unknown,
  gender: unknown,
): string[] {
  const armorMaterial = requirePieceListMaterial(slot, material);
  const armorGender = requirePieceListGender(slot, gender);

  return listPieceIndexes(armorPieceCount(slot)).map((index) =>
    buildGenderedPieceId(armorGender, armorMaterial, slot, index),
  );
}

function readArmorPieceListQuery(query: unknown): {
  slot: unknown;
  material: unknown;
  gender: unknown;
} {
  if (!isPlainObject(query)) {
    throw new Error(
      `Armor piece list requires a query. Received ${describeReceivedValue(query)}.`,
    );
  }

  return {
    slot: query.slot,
    material: query.material,
    gender: query.gender,
  };
}

export function listArmorPieceIds(query: {
  slot: ArmorSlot;
  material?: ArmorMaterial;
  gender?: ArmorGender;
}): string[] {
  const pieceQuery = readArmorPieceListQuery(query);
  const slot = requireArmorSlot(pieceQuery.slot);

  if (isSharedArmorSlot(slot)) {
    return listSharedArmorPieceIds(slot);
  }

  return listGenderedArmorPieceIds(slot, pieceQuery.material, pieceQuery.gender);
}

function invalidArmorPieceIdMessage(pieceId: unknown): string {
  return `Invalid armor piece id. Received ${describeReceivedValue(pieceId)}.`;
}

function pieceIndexOutOfRangeMessage(pieceId: string, slot: ArmorSlot, pieceCount: number): string {
  const receivedPieceId = JSON.stringify(pieceId);
  const receivedSlot = JSON.stringify(slot);
  return `Armor piece id ${receivedPieceId} is outside 1..${pieceCount} for slot ${receivedSlot}.`;
}

function pieceSlotMismatchMessage(pieceId: string, slotText: string): string {
  const receivedPieceId = JSON.stringify(pieceId);
  const receivedSlot = JSON.stringify(slotText);
  return `Armor piece id ${receivedPieceId} does not match slot ${receivedSlot}.`;
}

function requirePieceIndex(indexText: string, pieceId: string, slot: ArmorSlot): number {
  if (!/^\d+$/.test(indexText)) {
    throw new Error(invalidArmorPieceIdMessage(pieceId));
  }

  const index = Number(indexText);

  if (!Number.isSafeInteger(index) || String(index) !== indexText) {
    throw new Error(invalidArmorPieceIdMessage(pieceId));
  }

  const pieceCount = armorPieceCount(slot);

  if (index < 1 || index > pieceCount) {
    throw new Error(pieceIndexOutOfRangeMessage(pieceId, slot, pieceCount));
  }

  return index;
}

function requireSharedPieceSlot(pieceId: string, slotText: string): SharedArmorSlot {
  if (!isArmorSlot(slotText)) {
    throw new Error(pieceSlotMismatchMessage(pieceId, slotText));
  }

  if (!isSharedArmorSlot(slotText)) {
    throw new Error(pieceSlotMismatchMessage(pieceId, slotText));
  }

  return slotText;
}

function requireGenderedPieceSlot(pieceId: string, slotText: string): GenderedArmorSlot {
  if (!isArmorSlot(slotText)) {
    throw new Error(pieceSlotMismatchMessage(pieceId, slotText));
  }

  if (isSharedArmorSlot(slotText)) {
    throw new Error(pieceSlotMismatchMessage(pieceId, slotText));
  }

  return slotText;
}

function rejectUncanonicalPieceId(pieceId: string, canonicalPieceId: string): void {
  if (canonicalPieceId !== pieceId) {
    throw new Error(invalidArmorPieceIdMessage(pieceId));
  }
}

function parseSharedPieceId(pieceId: string, parts: readonly string[]): ParsedArmorPieceId {
  if (parts.length !== 3 || parts[0] !== SHARED_PIECE_OWNER) {
    throw new Error(invalidArmorPieceIdMessage(pieceId));
  }

  const slot = requireSharedPieceSlot(pieceId, parts[1] ?? '');
  const index = requirePieceIndex(parts[2] ?? '', pieceId, slot);
  rejectUncanonicalPieceId(pieceId, buildSharedPieceId(slot, index));

  return {
    pieceId,
    slot,
    gender: null,
    material: null,
    index,
  };
}

function parseGenderedPieceId(pieceId: string, parts: readonly string[]): ParsedArmorPieceId {
  if (parts.length !== 4) {
    throw new Error(invalidArmorPieceIdMessage(pieceId));
  }

  const genderText = parts[0] ?? '';
  const materialText = parts[1] ?? '';
  const slot = requireGenderedPieceSlot(pieceId, parts[2] ?? '');

  if (!isArmorGender(genderText) || !isArmorMaterial(materialText)) {
    throw new Error(invalidArmorPieceIdMessage(pieceId));
  }

  const index = requirePieceIndex(parts[3] ?? '', pieceId, slot);
  rejectUncanonicalPieceId(
    pieceId,
    buildGenderedPieceId(genderText, materialText, slot, index),
  );

  return {
    pieceId,
    slot,
    gender: genderText,
    material: materialText,
    index,
  };
}

function parseArmorPieceId(pieceId: unknown): ParsedArmorPieceId {
  if (typeof pieceId !== 'string') {
    throw new Error(invalidArmorPieceIdMessage(pieceId));
  }

  const parts = pieceId.split(':');

  if (parts.length === 3 && parts[0] === SHARED_PIECE_OWNER) {
    return parseSharedPieceId(pieceId, parts);
  }

  if (parts.length === 4) {
    return parseGenderedPieceId(pieceId, parts);
  }

  throw new Error(invalidArmorPieceIdMessage(pieceId));
}

export function requireArmorPieceId(pieceId: unknown): string {
  return parseArmorPieceId(pieceId).pieceId;
}

export function pieceSlot(pieceId: string): ArmorSlot {
  return parseArmorPieceId(pieceId).slot;
}

export function pieceGender(pieceId: string): ArmorGender | null {
  return parseArmorPieceId(pieceId).gender;
}

export function pieceMaterial(pieceId: string): ArmorMaterial | null {
  return parseArmorPieceId(pieceId).material;
}

export function pieceIndex(pieceId: string): number {
  return parseArmorPieceId(pieceId).index;
}
