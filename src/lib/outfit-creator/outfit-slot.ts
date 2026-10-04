import {
  pieceSlot,
  requireOutfitGender,
  requireOutfitPieceId,
  requireOutfitSlot,
  type OutfitGender,
  type OutfitSlot,
} from '@/lib/outfit-creator/catalog';
import {
  requireOutfitSaveSlotNumber,
  type OutfitSaveSlotNumber,
} from '@/lib/outfit-creator/saves';
import {
  createInitialOutfitSelection,
  type OutfitSelection,
} from '@/lib/outfit-creator/selection';

type OutfitSnapshotRecord = Record<string, unknown>;

export function selectionForOutfitSlot(
  slotNumber: number,
  storedSnapshot: OutfitSelection | null,
): { activeOutfitSlot: OutfitSaveSlotNumber; selection: OutfitSelection } {
  const activeOutfitSlot = requireOutfitSaveSlotNumber(slotNumber);

  return {
    activeOutfitSlot,
    selection: storedSnapshot === null
      ? createInitialOutfitSelection()
      : copyValidatedOutfitSnapshot(activeOutfitSlot, storedSnapshot),
  };
}

export function activeOutfitSlotForAutosave(
  activeOutfitSlot: number | null,
): OutfitSaveSlotNumber | null {
  if (activeOutfitSlot === null) {
    return null;
  }

  return requireOutfitSaveSlotNumber(activeOutfitSlot);
}

function isNonArrayObject(value: unknown): value is OutfitSnapshotRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
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
    return typeof serialized === 'string' ? serialized : Object.prototype.toString.call(value);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const reason = error.message.length > 0 ? error.message : `${error.name} with empty message`;
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason}).`;
    }

    throw error;
  }
}

function throwOutfitSlotError(
  activeOutfitSlot: OutfitSaveSlotNumber,
  requirement: string,
  receivedValue: unknown,
): never {
  throw new Error(
    `Outfit slot ${activeOutfitSlot} ${requirement}. Received ${describeReceivedValue(receivedValue)}.`,
  );
}

function requireSnapshotRecord(
  activeOutfitSlot: OutfitSaveSlotNumber,
  storedSnapshot: unknown,
): OutfitSnapshotRecord {
  if (isNonArrayObject(storedSnapshot)) {
    return storedSnapshot;
  }

  return throwOutfitSlotError(
    activeOutfitSlot,
    'snapshot must be a non-array object',
    storedSnapshot,
  );
}

function requireSnapshotGender(
  activeOutfitSlot: OutfitSaveSlotNumber,
  receivedGender: unknown,
): OutfitGender {
  try {
    return requireOutfitGender(receivedGender);
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : describeReceivedValue(error);
    return throwOutfitSlotError(activeOutfitSlot, `gender is invalid: ${detail}`, receivedGender);
  }
}

function requireSnapshotEquippedPieces(
  activeOutfitSlot: OutfitSaveSlotNumber,
  receivedEquippedPieceIds: unknown,
): Partial<Record<OutfitSlot, string>> {
  if (!isNonArrayObject(receivedEquippedPieceIds)) {
    return throwOutfitSlotError(
      activeOutfitSlot,
      'equippedPieceIds must be a non-array object',
      receivedEquippedPieceIds,
    );
  }

  const equippedPieceIds: Partial<Record<OutfitSlot, string>> = {};
  for (const slotKey of Object.keys(receivedEquippedPieceIds)) {
    let slot: OutfitSlot;
    try {
      slot = requireOutfitSlot(slotKey);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      return throwOutfitSlotError(activeOutfitSlot, `equipped piece slot is invalid: ${detail}`, slotKey);
    }

    const receivedPieceId = receivedEquippedPieceIds[slotKey];
    let pieceId: string;
    try {
      pieceId = requireOutfitPieceId(receivedPieceId);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      return throwOutfitSlotError(activeOutfitSlot, `equipped piece is invalid: ${detail}`, receivedPieceId);
    }

    const ownerSlot = pieceSlot(pieceId);
    if (ownerSlot !== slot) {
      return throwOutfitSlotError(
        activeOutfitSlot,
        `piece ${JSON.stringify(pieceId)} belongs to ${JSON.stringify(ownerSlot)}, not ${JSON.stringify(slot)}`,
        pieceId,
      );
    }

    equippedPieceIds[slot] = pieceId;
  }

  return equippedPieceIds;
}

function copyValidatedOutfitSnapshot(
  activeOutfitSlot: OutfitSaveSlotNumber,
  storedSnapshot: unknown,
): OutfitSelection {
  const snapshot = requireSnapshotRecord(activeOutfitSlot, storedSnapshot);
  return {
    gender: requireSnapshotGender(activeOutfitSlot, snapshot.gender),
    equippedPieceIds: requireSnapshotEquippedPieces(
      activeOutfitSlot,
      snapshot.equippedPieceIds,
    ),
  };
}
