import {
  pieceSlot,
  requireOutfitGender,
  requireOutfitPieceId,
  requireOutfitSlot,
  type OutfitGender,
  type OutfitSlot,
} from '@/lib/outfit-creator/catalog';

export type OutfitSelection = {
  gender: OutfitGender;
  equippedPieceIds: Partial<Record<OutfitSlot, string>>;
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

function cloneEquippedPieceIds(
  equippedPieceIds: Partial<Record<OutfitSlot, string>>,
): Partial<Record<OutfitSlot, string>> {
  return { ...equippedPieceIds };
}

function requireEquippedPieceIds(value: unknown): Partial<Record<OutfitSlot, string>> {
  if (!isPlainObject(value)) {
    throw new Error(
      `Outfit equipped pieces must be an object. Received ${describeReceivedValue(value)}.`,
    );
  }

  const equippedPieceIds: Partial<Record<OutfitSlot, string>> = {};

  for (const slotKey of Object.keys(value)) {
    const slot = requireOutfitSlot(slotKey);
    const receivedPieceId = value[slotKey];
    if (receivedPieceId === undefined) {
      throw new Error(
        `Outfit equipped piece for slot ${JSON.stringify(slot)} is undefined. Received ${describeReceivedValue(receivedPieceId)}.`,
      );
    }

    const pieceId = requireOutfitPieceId(receivedPieceId);
    const ownerSlot = pieceSlot(pieceId);
    if (ownerSlot !== slot) {
      throw new Error(
        `Outfit piece ${JSON.stringify(pieceId)} is equipped on ${JSON.stringify(slot)} but belongs to ${JSON.stringify(ownerSlot)}.`,
      );
    }

    equippedPieceIds[slot] = pieceId;
  }

  return equippedPieceIds;
}

function requireOutfitSelection(selection: unknown): OutfitSelection {
  if (!isPlainObject(selection)) {
    throw new Error(`Outfit selection must be an object. Received ${describeReceivedValue(selection)}.`);
  }

  return {
    gender: requireOutfitGender(selection.gender),
    equippedPieceIds: requireEquippedPieceIds(selection.equippedPieceIds),
  };
}

export function createInitialOutfitSelection(): OutfitSelection {
  return {
    gender: 'male',
    equippedPieceIds: {},
  };
}

export function setOutfitGender(
  selection: OutfitSelection,
  gender: OutfitGender,
): OutfitSelection {
  const currentSelection = requireOutfitSelection(selection);
  const nextGender = requireOutfitGender(gender);

  return {
    gender: nextGender,
    equippedPieceIds: cloneEquippedPieceIds(currentSelection.equippedPieceIds),
  };
}

function equipOutfitPiece(
  equippedPieceIds: Partial<Record<OutfitSlot, string>>,
  slot: OutfitSlot,
  pieceId: string,
): Partial<Record<OutfitSlot, string>> {
  return {
    ...equippedPieceIds,
    [slot]: pieceId,
  };
}

function unequipOutfitPiece(
  equippedPieceIds: Partial<Record<OutfitSlot, string>>,
  slot: OutfitSlot,
): Partial<Record<OutfitSlot, string>> {
  const nextEquippedPieceIds = { ...equippedPieceIds };
  delete nextEquippedPieceIds[slot];
  return nextEquippedPieceIds;
}

export function toggleOutfitPiece(selection: OutfitSelection, pieceId: string): OutfitSelection {
  const currentSelection = requireOutfitSelection(selection);
  const validPieceId = requireOutfitPieceId(pieceId);
  const slot = pieceSlot(validPieceId);
  const currentPieceId = currentSelection.equippedPieceIds[slot];
  const equippedPieceIds = currentPieceId === validPieceId
    ? unequipOutfitPiece(currentSelection.equippedPieceIds, slot)
    : equipOutfitPiece(currentSelection.equippedPieceIds, slot, validPieceId);

  return {
    gender: currentSelection.gender,
    equippedPieceIds,
  };
}

export function clearOutfitSelection(selection: OutfitSelection): OutfitSelection {
  const currentSelection = requireOutfitSelection(selection);

  return {
    gender: currentSelection.gender,
    equippedPieceIds: {},
  };
}

export function isOutfitPieceEquipped(selection: OutfitSelection, pieceId: string): boolean {
  const currentSelection = requireOutfitSelection(selection);
  const validPieceId = requireOutfitPieceId(pieceId);
  return currentSelection.equippedPieceIds[pieceSlot(validPieceId)] === validPieceId;
}
