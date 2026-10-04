export const OUTFIT_GENDERS = ['male', 'female'] as const;
export type OutfitGender = (typeof OUTFIT_GENDERS)[number];

export const OUTFIT_CATEGORIES = [
  'jackets',
  'shirts',
  'shirts2',
  'pants',
  'skirts',
  'shoes',
  'scarves',
  'belts',
  'gloves',
] as const;
export type OutfitCategory = (typeof OUTFIT_CATEGORIES)[number];

export const OUTFIT_SLOTS = [
  'jacket',
  'shirt',
  'pants',
  'skirt',
  'shoes',
  'scarf',
  'belt',
  'gloves',
] as const;
export type OutfitSlot = (typeof OUTFIT_SLOTS)[number];

export const OUTFIT_PREVIEW_WIDTH = 600;
export const OUTFIT_PREVIEW_HEIGHT = 500;

const OUTFIT_PIECE_COUNT = 30;
const SHIRT_TWO_START = 31;
const SHIRT_TWO_END = 60;

type ParsedOutfitPieceId = {
  pieceId: string;
  slot: OutfitSlot;
  category: OutfitCategory;
  index: number;
};

function stringifyFailureReason(error: unknown): string {
  if (error instanceof Error) {
    return error.message.length > 0 ? error.message : `${error.name} with empty message`;
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

  try {
    const serialized = JSON.stringify(value);
    if (typeof serialized === 'string') {
      return serialized;
    }

    const returned = serialized === undefined ? 'undefined' : String(serialized);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: returned ${returned}).`;
  } catch (error: unknown) {
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${stringifyFailureReason(error)}).`;
  }
}

function isOutfitGender(value: unknown): value is OutfitGender {
  return typeof value === 'string' && OUTFIT_GENDERS.some((gender) => gender === value);
}

function isOutfitCategory(value: unknown): value is OutfitCategory {
  return typeof value === 'string' && OUTFIT_CATEGORIES.some((category) => category === value);
}

function isOutfitSlot(value: unknown): value is OutfitSlot {
  return typeof value === 'string' && OUTFIT_SLOTS.some((slot) => slot === value);
}

export function requireOutfitGender(value: unknown): OutfitGender {
  if (isOutfitGender(value)) {
    return value;
  }

  throw new Error(`Invalid outfit gender. Received ${describeReceivedValue(value)}.`);
}

export function requireOutfitCategory(value: unknown): OutfitCategory {
  if (isOutfitCategory(value)) {
    return value;
  }

  throw new Error(`Invalid outfit category. Received ${describeReceivedValue(value)}.`);
}

export function requireOutfitSlot(value: unknown): OutfitSlot {
  if (isOutfitSlot(value)) {
    return value;
  }

  throw new Error(`Invalid outfit slot. Received ${describeReceivedValue(value)}.`);
}

export function categoryOutfitSlot(category: OutfitCategory): OutfitSlot {
  const validCategory = requireOutfitCategory(category);

  if (validCategory === 'jackets') {
    return 'jacket';
  }

  if (validCategory === 'shirts' || validCategory === 'shirts2') {
    return 'shirt';
  }

  if (validCategory === 'pants') {
    return 'pants';
  }

  if (validCategory === 'skirts') {
    return 'skirt';
  }

  if (validCategory === 'shoes') {
    return 'shoes';
  }

  if (validCategory === 'scarves') {
    return 'scarf';
  }

  if (validCategory === 'belts') {
    return 'belt';
  }

  if (validCategory === 'gloves') {
    return 'gloves';
  }

  const unexpectedCategory: never = validCategory;
  throw new Error(`Outfit category ${JSON.stringify(unexpectedCategory)} has no slot.`);
}

function listPieceIndexes(start: number, end: number): number[] {
  const indexes: number[] = [];

  for (let index = start; index <= end; index += 1) {
    indexes.push(index);
  }

  return indexes;
}

function categoryFileStem(category: OutfitCategory): string {
  if (category === 'jackets') {
    return 'jacket';
  }

  if (category === 'shirts' || category === 'shirts2') {
    return 'shirt';
  }

  if (category === 'pants') {
    return 'pants';
  }

  if (category === 'skirts') {
    return 'skirt';
  }

  if (category === 'shoes') {
    return 'shoes';
  }

  if (category === 'scarves') {
    return 'scarf';
  }

  if (category === 'belts') {
    return 'belt';
  }

  if (category === 'gloves') {
    return 'gloves';
  }

  const unexpectedCategory: never = category;
  throw new Error(`Outfit category ${JSON.stringify(unexpectedCategory)} has no file stem.`);
}

function buildOutfitPieceId(category: OutfitCategory, index: number): string {
  return `${categoryFileStem(category)}${index}`;
}

export function listOutfitPieceIds(category: OutfitCategory): string[] {
  const validCategory = requireOutfitCategory(category);
  const firstIndex = validCategory === 'shirts2' ? SHIRT_TWO_START : 1;
  const lastIndex = validCategory === 'shirts' ? OUTFIT_PIECE_COUNT : validCategory === 'shirts2'
    ? SHIRT_TWO_END
    : OUTFIT_PIECE_COUNT;

  return listPieceIndexes(firstIndex, lastIndex).map((index) => buildOutfitPieceId(validCategory, index));
}

function parseOutfitPieceId(pieceId: unknown): ParsedOutfitPieceId {
  if (typeof pieceId !== 'string') {
    throw new Error(`Invalid outfit piece id. Received ${describeReceivedValue(pieceId)}.`);
  }

  const matchingCategory = OUTFIT_CATEGORIES.find((category) => {
    return listOutfitPieceIds(category).includes(pieceId);
  });

  if (matchingCategory === undefined) {
    throw new Error(`Invalid outfit piece id. Received ${JSON.stringify(pieceId)}.`);
  }

  const stem = categoryFileStem(matchingCategory);
  const indexText = pieceId.slice(stem.length);
  const index = Number(indexText);
  if (!/^\d+$/.test(indexText) || !Number.isSafeInteger(index)) {
    throw new Error(`Invalid outfit piece id. Received ${JSON.stringify(pieceId)}.`);
  }

  return {
    pieceId,
    slot: categoryOutfitSlot(matchingCategory),
    category: matchingCategory,
    index,
  };
}

export function requireOutfitPieceId(pieceId: unknown): string {
  return parseOutfitPieceId(pieceId).pieceId;
}

export function pieceCategory(pieceId: string): OutfitCategory {
  return parseOutfitPieceId(pieceId).category;
}

export function pieceSlot(pieceId: string): OutfitSlot {
  return parseOutfitPieceId(pieceId).slot;
}

export function pieceIndex(pieceId: string): number {
  return parseOutfitPieceId(pieceId).index;
}

export function isOutfitPieceForCategory(pieceId: string, category: OutfitCategory): boolean {
  const validPieceId = requireOutfitPieceId(pieceId);
  const validCategory = requireOutfitCategory(category);
  return pieceCategory(validPieceId) === validCategory;
}
