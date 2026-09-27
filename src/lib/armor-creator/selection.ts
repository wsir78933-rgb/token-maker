import {
  listArmorPieceIds,
  pieceGender,
  pieceIndex,
  pieceMaterial,
  pieceSlot,
  requireArmorPieceId,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';

export type ArmorSelection = {
  gender: ArmorGender;
  material: ArmorMaterial;
  shoulderSymmetry: boolean;
  chestCurve: boolean;
  equippedPieceIds: Partial<Record<ArmorSlot, string>>;
};

type ShoulderSlot = 'shoulderLeft' | 'shoulderRight';

export function createInitialArmorSelection(): ArmorSelection {
  return {
    gender: 'male',
    material: 'plate',
    shoulderSymmetry: false,
    chestCurve: true,
    equippedPieceIds: {},
  };
}

function rejectUnknownGenderOrMaterial(gender: ArmorGender, material: ArmorMaterial): void {
  listArmorPieceIds({ slot: 'helm', gender, material });
}

function cloneEquippedPieceIds(
  equippedPieceIds: Partial<Record<ArmorSlot, string>>,
): Partial<Record<ArmorSlot, string>> {
  return { ...equippedPieceIds };
}

export function selectArmorMaterial(
  selection: ArmorSelection,
  material: ArmorMaterial,
): ArmorSelection {
  rejectUnknownGenderOrMaterial(selection.gender, material);

  return {
    ...selection,
    material,
    equippedPieceIds: cloneEquippedPieceIds(selection.equippedPieceIds),
  };
}

function cannotRewritePieceMessage(pieceId: string, nextGender: ArmorGender): string {
  return `Cannot rewrite armor piece ${JSON.stringify(pieceId)} to gender ${JSON.stringify(nextGender)}.`;
}

function requirePieceIdAtIndex(
  slot: ArmorSlot,
  gender: ArmorGender,
  material: ArmorMaterial,
  index: number,
  failureMessage: string,
): string {
  const pieceIds = listArmorPieceIds({ slot, gender, material });
  const listedPieceId = pieceIds[index - 1];

  if (listedPieceId === undefined) {
    throw new Error(failureMessage);
  }

  return requireArmorPieceId(listedPieceId);
}

function rewritePieceIdForGender(pieceId: string, nextGender: ArmorGender): string {
  if (pieceGender(pieceId) === null) {
    return pieceId;
  }

  const material = pieceMaterial(pieceId);
  const failureMessage = cannotRewritePieceMessage(pieceId, nextGender);

  if (material === null) {
    throw new Error(failureMessage);
  }

  return requirePieceIdAtIndex(
    pieceSlot(pieceId),
    nextGender,
    material,
    pieceIndex(pieceId),
    failureMessage,
  );
}

function rewriteEquippedPieceIdsForGender(
  equippedPieceIds: Partial<Record<ArmorSlot, string>>,
  nextGender: ArmorGender,
): Partial<Record<ArmorSlot, string>> {
  const rewrittenPieceIds: Partial<Record<ArmorSlot, string>> = {};

  for (const pieceId of Object.values(equippedPieceIds)) {
    if (pieceId === undefined) {
      continue;
    }

    const nextPieceId = rewritePieceIdForGender(pieceId, nextGender);
    rewrittenPieceIds[pieceSlot(nextPieceId)] = nextPieceId;
  }

  return rewrittenPieceIds;
}

export function selectArmorGender(
  selection: ArmorSelection,
  gender: ArmorGender,
): ArmorSelection {
  rejectUnknownGenderOrMaterial(gender, selection.material);
  const equippedPieceIds = rewriteEquippedPieceIdsForGender(selection.equippedPieceIds, gender);

  return {
    ...selection,
    gender,
    equippedPieceIds,
  };
}

function cannotPlaceShoulderPieceMessage(pieceId: string, slot: ShoulderSlot, index: number): string {
  return `Cannot place armor piece ${JSON.stringify(pieceId)} on slot ${JSON.stringify(slot)} at index ${index}.`;
}

function placeShoulderPieceAtIndex(pieceId: string, slot: ShoulderSlot, index: number): string {
  const gender = pieceGender(pieceId);
  const material = pieceMaterial(pieceId);
  const failureMessage = cannotPlaceShoulderPieceMessage(pieceId, slot, index);

  if (gender === null || material === null) {
    throw new Error(failureMessage);
  }

  return requirePieceIdAtIndex(slot, gender, material, index, failureMessage);
}

function mirrorShoulderPiece(pieceId: string, slot: ShoulderSlot): string {
  return placeShoulderPieceAtIndex(pieceId, slot, pieceIndex(pieceId));
}

function matchShouldersForSymmetry(
  equippedPieceIds: Partial<Record<ArmorSlot, string>>,
): Partial<Record<ArmorSlot, string>> {
  const leftPieceId = equippedPieceIds.shoulderLeft;
  const rightPieceId = equippedPieceIds.shoulderRight;

  if (leftPieceId === undefined && rightPieceId === undefined) {
    return equippedPieceIds;
  }

  if (leftPieceId !== undefined && rightPieceId === undefined) {
    return {
      ...equippedPieceIds,
      shoulderRight: mirrorShoulderPiece(leftPieceId, 'shoulderRight'),
    };
  }

  if (leftPieceId === undefined && rightPieceId !== undefined) {
    return {
      ...equippedPieceIds,
      shoulderLeft: mirrorShoulderPiece(rightPieceId, 'shoulderLeft'),
    };
  }

  if (leftPieceId === undefined || rightPieceId === undefined) {
    throw new Error(
      `Shoulder pieces disappeared while enabling symmetry. Received left ${JSON.stringify(leftPieceId)} and right ${JSON.stringify(rightPieceId)}.`,
    );
  }

  const rightIndex = pieceIndex(rightPieceId);

  if (pieceIndex(leftPieceId) === rightIndex) {
    return equippedPieceIds;
  }

  return {
    ...equippedPieceIds,
    shoulderLeft: placeShoulderPieceAtIndex(leftPieceId, 'shoulderLeft', rightIndex),
  };
}

export function setShoulderSymmetry(selection: ArmorSelection, enabled: boolean): ArmorSelection {
  const equippedPieceIds = enabled
    ? matchShouldersForSymmetry(selection.equippedPieceIds)
    : selection.equippedPieceIds;

  return {
    ...selection,
    shoulderSymmetry: enabled,
    equippedPieceIds: cloneEquippedPieceIds(equippedPieceIds),
  };
}

export function setChestCurve(selection: ArmorSelection, chestCurve: boolean): ArmorSelection {
  return {
    ...selection,
    chestCurve,
    equippedPieceIds: cloneEquippedPieceIds(selection.equippedPieceIds),
  };
}

export function chestCurveControlEnabled(selection: ArmorSelection): boolean {
  return selection.gender === 'female' && selection.material === 'plate';
}

function removeEquippedSlot(
  equippedPieceIds: Partial<Record<ArmorSlot, string>>,
  slot: ArmorSlot,
): Partial<Record<ArmorSlot, string>> {
  const nextEquippedPieceIds = { ...equippedPieceIds };
  delete nextEquippedPieceIds[slot];
  return nextEquippedPieceIds;
}

function removeConflictingHeadSlot(
  equippedPieceIds: Partial<Record<ArmorSlot, string>>,
  slot: ArmorSlot,
): Partial<Record<ArmorSlot, string>> {
  if (slot === 'helm') {
    return removeEquippedSlot(equippedPieceIds, 'crown');
  }

  if (slot === 'crown') {
    return removeEquippedSlot(equippedPieceIds, 'helm');
  }

  return equippedPieceIds;
}

function isShoulderSlot(slot: ArmorSlot): slot is ShoulderSlot {
  return slot === 'shoulderLeft' || slot === 'shoulderRight';
}

function oppositeShoulderSlot(slot: ShoulderSlot): ShoulderSlot {
  if (slot === 'shoulderLeft') {
    return 'shoulderRight';
  }

  return 'shoulderLeft';
}

function unequipArmorPiece(selection: ArmorSelection, pieceId: string): Partial<Record<ArmorSlot, string>> {
  const slot = pieceSlot(pieceId);
  const withoutPiece = removeEquippedSlot(selection.equippedPieceIds, slot);

  if (!selection.shoulderSymmetry || !isShoulderSlot(slot)) {
    return withoutPiece;
  }

  return removeEquippedSlot(withoutPiece, oppositeShoulderSlot(slot));
}

function equipArmorPiece(selection: ArmorSelection, pieceId: string): Partial<Record<ArmorSlot, string>> {
  const slot = pieceSlot(pieceId);
  const withPiece = removeConflictingHeadSlot(
    { ...selection.equippedPieceIds, [slot]: pieceId },
    slot,
  );

  if (!selection.shoulderSymmetry || !isShoulderSlot(slot)) {
    return withPiece;
  }

  const oppositeSlot = oppositeShoulderSlot(slot);
  return {
    ...withPiece,
    [oppositeSlot]: mirrorShoulderPiece(pieceId, oppositeSlot),
  };
}

export function toggleArmorPiece(selection: ArmorSelection, pieceId: string): ArmorSelection {
  const armorPieceId = requireArmorPieceId(pieceId);
  const slot = pieceSlot(armorPieceId);
  const equippedPieceIds = selection.equippedPieceIds[slot] === armorPieceId
    ? unequipArmorPiece(selection, armorPieceId)
    : equipArmorPiece(selection, armorPieceId);

  return {
    ...selection,
    equippedPieceIds,
  };
}

export function clearArmorEquipment(selection: ArmorSelection): ArmorSelection {
  return {
    ...selection,
    equippedPieceIds: {},
  };
}

export function isArmorPieceEquipped(selection: ArmorSelection, pieceId: string): boolean {
  const armorPieceId = requireArmorPieceId(pieceId);
  return selection.equippedPieceIds[pieceSlot(armorPieceId)] === armorPieceId;
}
