import {
  pieceCategory,
  requireWeaponCategory,
  requireWeaponPieceId,
  type WeaponCategory,
} from '@/lib/weapon-creator/catalog';

export type WeaponSelection = {
  equippedPieceIds: Partial<Record<WeaponCategory, string>>;
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireEquippedPieceIds(value: unknown): Partial<Record<WeaponCategory, string>> {
  if (!isPlainObject(value)) {
    throw new Error(
      `Weapon equipped pieces must be an object. Received ${describeReceivedValue(value)}.`,
    );
  }

  const equippedPieceIds: Partial<Record<WeaponCategory, string>> = {};

  for (const categoryKey of Object.keys(value)) {
    const category = requireWeaponCategory(categoryKey);
    const receivedPieceId = value[categoryKey];
    if (receivedPieceId === undefined) {
      throw new Error(
        `Weapon equipped piece for category ${JSON.stringify(category)} is undefined. Received ${describeReceivedValue(receivedPieceId)}.`,
      );
    }

    const pieceId = requireWeaponPieceId(receivedPieceId);
    const ownerCategory = pieceCategory(pieceId);
    if (ownerCategory !== category) {
      throw new Error(
        `Weapon piece ${JSON.stringify(pieceId)} is equipped on ${JSON.stringify(category)} but belongs to ${JSON.stringify(ownerCategory)}.`,
      );
    }

    equippedPieceIds[category] = pieceId;
  }

  return equippedPieceIds;
}

export function requireWeaponSelection(value: unknown): WeaponSelection {
  if (!isPlainObject(value)) {
    throw new Error(`Weapon selection must be an object. Received ${describeReceivedValue(value)}.`);
  }

  return {
    equippedPieceIds: requireEquippedPieceIds(value.equippedPieceIds),
  };
}

export function createInitialWeaponSelection(): WeaponSelection {
  return {
    equippedPieceIds: {},
  };
}

function equipWeaponPiece(
  equippedPieceIds: Partial<Record<WeaponCategory, string>>,
  category: WeaponCategory,
  pieceId: string,
): Partial<Record<WeaponCategory, string>> {
  return {
    ...equippedPieceIds,
    [category]: pieceId,
  };
}

function unequipWeaponPiece(
  equippedPieceIds: Partial<Record<WeaponCategory, string>>,
  category: WeaponCategory,
): Partial<Record<WeaponCategory, string>> {
  const nextEquippedPieceIds = { ...equippedPieceIds };
  delete nextEquippedPieceIds[category];
  return nextEquippedPieceIds;
}

export function toggleWeaponPiece(selection: WeaponSelection, pieceId: string): WeaponSelection {
  const currentSelection = requireWeaponSelection(selection);
  const validPieceId = requireWeaponPieceId(pieceId);
  const category = pieceCategory(validPieceId);
  const currentPieceId = currentSelection.equippedPieceIds[category];
  const equippedPieceIds = currentPieceId === validPieceId
    ? unequipWeaponPiece(currentSelection.equippedPieceIds, category)
    : equipWeaponPiece(currentSelection.equippedPieceIds, category, validPieceId);

  return { equippedPieceIds };
}

export function clearWeaponSelection(selection: WeaponSelection): WeaponSelection {
  requireWeaponSelection(selection);

  return {
    equippedPieceIds: {},
  };
}

export function isWeaponPieceEquipped(selection: WeaponSelection, pieceId: string): boolean {
  const currentSelection = requireWeaponSelection(selection);
  const validPieceId = requireWeaponPieceId(pieceId);
  return currentSelection.equippedPieceIds[pieceCategory(validPieceId)] === validPieceId;
}
