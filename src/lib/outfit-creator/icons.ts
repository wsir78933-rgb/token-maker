import {
  pieceSlot,
  requireOutfitGender,
  requireOutfitPieceId,
  requireOutfitSlot,
  type OutfitGender,
  type OutfitSlot,
} from '@/lib/outfit-creator/catalog';

const OUTFIT_IMAGE_ROOT = '/outfit-creator';
const OUTFIT_CLOTHING_DIRECTORIES = {
  male: 'nmale',
  female: 'nfemale',
} as const;

const OUTFIT_BACK_SLOTS = ['jacket', 'shirt', 'skirt', 'shoes'] as const;
type OutfitBackSlot = (typeof OUTFIT_BACK_SLOTS)[number];

function isOutfitBackSlot(slot: OutfitSlot): slot is OutfitBackSlot {
  return OUTFIT_BACK_SLOTS.some((backSlot) => backSlot === slot);
}

function joinOutfitImagePath(directory: string, fileName: string): string {
  if (!/^[a-z]+\d+\.png$/.test(fileName)) {
    throw new Error(`Outfit image file name ${JSON.stringify(fileName)} is not a local PNG name.`);
  }

  return `${OUTFIT_IMAGE_ROOT}/${directory}/${fileName}`;
}

function outfitClothingDirectory(gender: OutfitGender): string {
  return OUTFIT_CLOTHING_DIRECTORIES[gender];
}

export function outfitBodyImagePath(gender: OutfitGender): string {
  const validGender = requireOutfitGender(gender);
  return `/armor-creator/${validGender}/body.png`;
}

export function outfitPieceImagePath(gender: OutfitGender, pieceId: string): string {
  const validGender = requireOutfitGender(gender);
  const validPieceId = requireOutfitPieceId(pieceId);
  return joinOutfitImagePath(outfitClothingDirectory(validGender), `${validPieceId}.png`);
}

export function backOutfitPieceImagePath(
  gender: OutfitGender,
  slot: OutfitSlot,
  pieceId: string,
): string | null {
  const validGender = requireOutfitGender(gender);
  const validSlot = requireOutfitSlot(slot);
  const validPieceId = requireOutfitPieceId(pieceId);
  const ownerSlot = pieceSlot(validPieceId);

  if (ownerSlot !== validSlot) {
    throw new Error(
      `Outfit piece ${JSON.stringify(validPieceId)} is requested for ${JSON.stringify(validSlot)} but belongs to ${JSON.stringify(ownerSlot)}.`,
    );
  }

  if (!isOutfitBackSlot(validSlot)) {
    return null;
  }

  return joinOutfitImagePath(
    outfitClothingDirectory(validGender),
    `b${validPieceId}.png`,
  );
}
