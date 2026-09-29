import {
  ARMOR_GENDERS,
  ARMOR_MATERIALS,
  pieceSlot,
  requireArmorPieceId,
  requireArmorSlot,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';
import {
  requireArmorSaveSlotNumber,
  type ArmorSaveSlotNumber,
} from '@/lib/armor-creator/saves';
import {
  createInitialArmorSelection,
  type ArmorSelection,
} from '@/lib/armor-creator/selection';

type OutfitSnapshotRecord = Record<string, unknown>;
type OutfitBooleanFieldName = 'shoulderSymmetry' | 'chestCurve';

export function selectionForOutfitSlot(
  slotNumber: number,
  storedSnapshot: ArmorSelection | null,
): { activeOutfitSlot: ArmorSaveSlotNumber; selection: ArmorSelection } {
  const activeOutfitSlot = requireArmorSaveSlotNumber(slotNumber);

  return {
    activeOutfitSlot,
    selection: selectionFromStoredSnapshot(activeOutfitSlot, storedSnapshot),
  };
}

export function activeOutfitSlotForAutosave(
  activeOutfitSlot: number | null,
): ArmorSaveSlotNumber | null {
  if (activeOutfitSlot === null) {
    return null;
  }

  return requireArmorSaveSlotNumber(activeOutfitSlot);
}

function selectionFromStoredSnapshot(
  activeOutfitSlot: ArmorSaveSlotNumber,
  storedSnapshot: ArmorSelection | null,
): ArmorSelection {
  if (storedSnapshot === null) {
    return createInitialArmorSelection();
  }

  return copyValidatedOutfitSnapshot(activeOutfitSlot, storedSnapshot);
}

function copyValidatedOutfitSnapshot(
  activeOutfitSlot: ArmorSaveSlotNumber,
  storedSnapshot: unknown,
): ArmorSelection {
  const snapshotRecord = requireOutfitSnapshotRecord(activeOutfitSlot, storedSnapshot);
  const gender = requireOutfitSnapshotGender(activeOutfitSlot, snapshotRecord.gender);
  const material = requireOutfitSnapshotMaterial(activeOutfitSlot, snapshotRecord.material);
  const shoulderSymmetry = requireOutfitSnapshotBoolean(
    activeOutfitSlot,
    'shoulderSymmetry',
    snapshotRecord.shoulderSymmetry,
  );
  const chestCurve = requireOutfitSnapshotBoolean(
    activeOutfitSlot,
    'chestCurve',
    snapshotRecord.chestCurve,
  );
  const equippedPieceIds = copyEquippedPieceIds(
    activeOutfitSlot,
    requireOutfitEquippedPieceIdsObject(activeOutfitSlot, snapshotRecord.equippedPieceIds),
  );

  return {
    gender,
    material,
    shoulderSymmetry,
    chestCurve,
    equippedPieceIds,
  };
}

function requireOutfitSnapshotRecord(
  activeOutfitSlot: ArmorSaveSlotNumber,
  storedSnapshot: unknown,
): OutfitSnapshotRecord {
  if (isNonArrayObject(storedSnapshot)) {
    return storedSnapshot;
  }

  throwOutfitSlotError(
    activeOutfitSlot,
    'snapshot must be a non-array object',
    storedSnapshot,
  );
}

function requireOutfitSnapshotGender(
  activeOutfitSlot: ArmorSaveSlotNumber,
  gender: unknown,
): ArmorGender {
  if (isOutfitGender(gender)) {
    return gender;
  }

  throwOutfitSlotError(activeOutfitSlot, 'gender must be male or female', gender);
}

function requireOutfitSnapshotMaterial(
  activeOutfitSlot: ArmorSaveSlotNumber,
  material: unknown,
): ArmorMaterial {
  if (isOutfitMaterial(material)) {
    return material;
  }

  throwOutfitSlotError(
    activeOutfitSlot,
    'material must be plate, leather, or cloth',
    material,
  );
}

function requireOutfitSnapshotBoolean(
  activeOutfitSlot: ArmorSaveSlotNumber,
  fieldName: OutfitBooleanFieldName,
  fieldValue: unknown,
): boolean {
  if (typeof fieldValue === 'boolean') {
    return fieldValue;
  }

  throwOutfitSlotError(
    activeOutfitSlot,
    `${fieldName} must be a boolean`,
    fieldValue,
  );
}

function requireOutfitEquippedPieceIdsObject(
  activeOutfitSlot: ArmorSaveSlotNumber,
  equippedPieceIds: unknown,
): OutfitSnapshotRecord {
  if (isNonArrayObject(equippedPieceIds)) {
    return equippedPieceIds;
  }

  throwOutfitSlotError(
    activeOutfitSlot,
    'equippedPieceIds must be a non-array object',
    equippedPieceIds,
  );
}

function copyEquippedPieceIds(
  activeOutfitSlot: ArmorSaveSlotNumber,
  equippedPieceIds: OutfitSnapshotRecord,
): Partial<Record<ArmorSlot, string>> {
  const copiedPieceIds: Partial<Record<ArmorSlot, string>> = {};

  for (const equippedSlotKey of Object.keys(equippedPieceIds)) {
    const equippedSlot = readCatalogArmorSlot(activeOutfitSlot, equippedSlotKey);
    const pieceId = readCatalogArmorPieceId(activeOutfitSlot, equippedPieceIds[equippedSlotKey]);
    rejectMismatchedEquippedPiece(activeOutfitSlot, equippedSlot, pieceId);
    copiedPieceIds[equippedSlot] = pieceId;
  }

  return copiedPieceIds;
}

function readCatalogArmorSlot(
  activeOutfitSlot: ArmorSaveSlotNumber,
  equippedSlotKey: string,
): ArmorSlot {
  return callCatalogForOutfitSlot(activeOutfitSlot, equippedSlotKey, () =>
    requireArmorSlot(equippedSlotKey),
  );
}

function readCatalogArmorPieceId(
  activeOutfitSlot: ArmorSaveSlotNumber,
  receivedPieceId: unknown,
): string {
  return callCatalogForOutfitSlot(activeOutfitSlot, receivedPieceId, () =>
    requireArmorPieceId(receivedPieceId),
  );
}

function readCatalogPieceSlot(activeOutfitSlot: ArmorSaveSlotNumber, pieceId: string): ArmorSlot {
  return callCatalogForOutfitSlot(activeOutfitSlot, pieceId, () => pieceSlot(pieceId));
}

function callCatalogForOutfitSlot<CatalogResult>(
  activeOutfitSlot: ArmorSaveSlotNumber,
  receivedValue: unknown,
  readCatalogResult: () => CatalogResult,
): CatalogResult {
  try {
    return readCatalogResult();
  } catch (error: unknown) {
    rethrowCatalogErrorWithOutfitSlot(activeOutfitSlot, receivedValue, error);
  }
}

function rethrowCatalogErrorWithOutfitSlot(
  activeOutfitSlot: ArmorSaveSlotNumber,
  receivedValue: unknown,
  error: unknown,
): never {
  if (!(error instanceof Error)) {
    throw error;
  }

  if (error.message.includes(`Armor outfit slot ${activeOutfitSlot}`)) {
    throw error;
  }

  if (!isCatalogArmorPieceError(error)) {
    throw error;
  }

  throw new Error(outfitCatalogErrorMessage(activeOutfitSlot, receivedValue, error));
}

function outfitCatalogErrorMessage(
  activeOutfitSlot: ArmorSaveSlotNumber,
  receivedValue: unknown,
  catalogError: Error,
): string {
  const receivedText = describeReceivedOutfitValue(receivedValue);
  if (catalogError.message.includes(receivedText)) {
    return `Armor outfit slot ${activeOutfitSlot} equipped piece is invalid: ${catalogError.message}`;
  }

  return `Armor outfit slot ${activeOutfitSlot} equipped piece is invalid: ${catalogError.message} Received ${receivedText}.`;
}

function isCatalogArmorPieceError(error: Error): boolean {
  return (
    error.message.startsWith('Invalid armor slot.') ||
    error.message.startsWith('Invalid armor piece id.') ||
    error.message.startsWith('Armor piece id ')
  );
}

function rejectMismatchedEquippedPiece(
  activeOutfitSlot: ArmorSaveSlotNumber,
  equippedSlot: ArmorSlot,
  pieceId: string,
): void {
  const ownerSlot = readCatalogPieceSlot(activeOutfitSlot, pieceId);
  if (ownerSlot === equippedSlot) {
    return;
  }

  throw new Error(
    `Armor outfit slot ${activeOutfitSlot} equipped piece ${describeReceivedOutfitValue(pieceId)} belongs to slot ${describeReceivedOutfitValue(ownerSlot)}, not ${describeReceivedOutfitValue(equippedSlot)}. Received ${describeReceivedOutfitValue(pieceId)}.`,
  );
}

function isNonArrayObject(value: unknown): value is OutfitSnapshotRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isOutfitGender(value: unknown): value is ArmorGender {
  return typeof value === 'string' && ARMOR_GENDERS.some((gender) => gender === value);
}

function isOutfitMaterial(value: unknown): value is ArmorMaterial {
  return typeof value === 'string' && ARMOR_MATERIALS.some((material) => material === value);
}

function throwOutfitSlotError(
  activeOutfitSlot: ArmorSaveSlotNumber,
  requirement: string,
  receivedValue: unknown,
): never {
  throw new Error(
    `Armor outfit slot ${activeOutfitSlot} ${requirement}. Received ${describeReceivedOutfitValue(receivedValue)}.`,
  );
}

function describeReceivedOutfitValue(value: unknown): string {
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

  return describeJsonOutfitValue(value);
}

function describeJsonOutfitValue(value: unknown): string {
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    const returned = json === undefined ? 'undefined' : String(json);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: returned ${returned}).`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const reason = error.message.length > 0 ? error.message : `${error.name} with empty message`;
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason}).`;
    }

    throw error;
  }
}
