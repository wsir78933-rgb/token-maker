import {
  pieceGender,
  pieceIndex,
  pieceMaterial,
  pieceSlot,
  requireArmorGender,
  requireArmorPieceId,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';

const ARMOR_IMAGE_ROOT = '/armor-creator';

type ArmorPieceImageOptions = {
  flatChest: boolean;
  feetBack: boolean;
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

function isPlainArmorImageOptions(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function rejectUnknownArmorImageOption(optionName: string, value: unknown): void {
  if (optionName === 'flatChest' || optionName === 'feetBack') {
    return;
  }

  throw new Error(
    `Armor image option ${JSON.stringify(optionName)} is not allowed. Received ${describeReceivedValue(value)}.`,
  );
}

function readBooleanArmorImageOption(
  options: Record<string, unknown>,
  optionName: 'flatChest' | 'feetBack',
): boolean {
  if (!Object.prototype.hasOwnProperty.call(options, optionName)) {
    return false;
  }

  const value = options[optionName];
  if (value === undefined || value === false) {
    return false;
  }

  if (value === true) {
    return true;
  }

  throw new Error(`${optionName} must be a boolean. Received ${describeReceivedValue(value)}.`);
}

function readArmorPieceImageOptions(options: unknown): ArmorPieceImageOptions {
  if (options === undefined) {
    return { flatChest: false, feetBack: false };
  }

  if (!isPlainArmorImageOptions(options)) {
    throw new Error(
      `Armor image options must be an object. Received ${describeReceivedValue(options)}.`,
    );
  }

  for (const optionName of Object.keys(options)) {
    rejectUnknownArmorImageOption(optionName, options[optionName]);
  }

  return {
    flatChest: readBooleanArmorImageOption(options, 'flatChest'),
    feetBack: readBooleanArmorImageOption(options, 'feetBack'),
  };
}

function rejectCombinedArmorImageOptions(
  pieceId: string,
  flatChest: boolean,
  feetBack: boolean,
): void {
  if (flatChest && feetBack) {
    throw new Error(
      `Armor image options cannot combine flatChest and feetBack. Received ${JSON.stringify(pieceId)}.`,
    );
  }
}

function requireFlatChestPiece(pieceId: string): void {
  if (
    pieceGender(pieceId) === 'female' &&
    pieceMaterial(pieceId) === 'plate' &&
    pieceSlot(pieceId) === 'chest'
  ) {
    return;
  }

  throw new Error(`flatChest requires female plate chest. Received ${JSON.stringify(pieceId)}.`);
}

function requireFeetBackPiece(pieceId: string): void {
  if (pieceSlot(pieceId) === 'feet') {
    return;
  }

  throw new Error(`feetBack requires feet. Received ${JSON.stringify(pieceId)}.`);
}

function requireRequestedArmorImageVariant(
  pieceId: string,
  flatChest: boolean,
  feetBack: boolean,
): void {
  if (flatChest) {
    requireFlatChestPiece(pieceId);
  }

  if (feetBack) {
    requireFeetBackPiece(pieceId);
  }
}

function requireArmorImageIndex(index: number): number {
  if (!Number.isInteger(index) || index < 1 || index > 30) {
    throw new Error(`Armor image index ${String(index)} is outside 1..30.`);
  }

  return index;
}

function twoDigitArmorIndex(index: number): string {
  return String(requireArmorImageIndex(index)).padStart(2, '0');
}

function armorSlotFileStem(slot: ArmorSlot): string {
  if (slot === 'helm' || slot === 'chest' || slot === 'feet' || slot === 'legs') {
    return slot;
  }

  if (slot === 'gloves') {
    return 'hands';
  }

  if (slot === 'shoulderLeft' || slot === 'shoulderRight') {
    return 'shoulder';
  }

  if (slot === 'cloakFront') {
    return 'cape';
  }

  if (slot === 'cloakBack') {
    return 'bcape';
  }

  throw new Error(`Armor slot ${JSON.stringify(slot)} has no gendered image file stem.`);
}

function requireGenderedPieceGender(pieceId: string): ArmorGender {
  const gender = pieceGender(pieceId);
  if (gender === 'male' || gender === 'female') {
    return gender;
  }

  throw new Error(
    `Gendered armor piece ${JSON.stringify(pieceId)} is missing a gender. Received ${describeReceivedValue(gender)}.`,
  );
}

function requireGenderedPieceMaterial(pieceId: string): ArmorMaterial {
  const material = pieceMaterial(pieceId);
  if (material === 'plate' || material === 'leather' || material === 'cloth') {
    return material;
  }

  throw new Error(
    `Gendered armor piece ${JSON.stringify(pieceId)} is missing a material. Received ${describeReceivedValue(material)}.`,
  );
}

function genderedArmorFileName(
  pieceId: string,
  slot: ArmorSlot,
  material: ArmorMaterial,
  index: number,
  flatChest: boolean,
  feetBack: boolean,
): string {
  if (flatChest && feetBack) {
    throw new Error(
      `Armor image file cannot combine flatChest and feetBack. Received ${JSON.stringify(pieceId)}.`,
    );
  }

  if (flatChest) {
    return `bchest${twoDigitArmorIndex(index)}.png`;
  }

  if (feetBack && material === 'cloth') {
    return 'bfeet01.png';
  }

  if (feetBack) {
    return `bfeet${twoDigitArmorIndex(index)}.png`;
  }

  return `${armorSlotFileStem(slot)}${twoDigitArmorIndex(index)}.png`;
}

function requireArmorPngFileName(fileName: string): string {
  if (!/^[a-z0-9]+\.png$/.test(fileName)) {
    throw new Error(`Armor image file name ${JSON.stringify(fileName)} is not a local PNG name.`);
  }

  return fileName;
}

function genderedArmorDirectory(gender: ArmorGender, material: ArmorMaterial): string {
  if (material === 'plate') {
    return gender;
  }

  if (material === 'leather') {
    return `${gender}/leather`;
  }

  if (material === 'cloth') {
    return `${gender}/cloth`;
  }

  const unexpectedMaterial: never = material;
  throw new Error(`Unsupported armor material ${JSON.stringify(unexpectedMaterial)}.`);
}

function joinArmorImagePath(directory: string, fileName: string): string {
  const pngFileName = requireArmorPngFileName(fileName);
  if (directory.length === 0) {
    return `${ARMOR_IMAGE_ROOT}/${pngFileName}`;
  }

  return `${ARMOR_IMAGE_ROOT}/${directory}/${pngFileName}`;
}

function sharedArmorImagePath(slot: 'crown' | 'wing', index: number): string {
  const imageIndex = requireArmorImageIndex(index);
  return joinArmorImagePath('', `${slot}${String(imageIndex)}.png`);
}

function buildArmorBodyImagePath(gender: ArmorGender): string {
  return joinArmorImagePath(gender, 'body.png');
}

function buildArmorPieceImagePath(
  pieceId: string,
  flatChest: boolean,
  feetBack: boolean,
): string {
  const slot = pieceSlot(pieceId);
  if (slot === 'crown' || slot === 'wing') {
    return sharedArmorImagePath(slot, pieceIndex(pieceId));
  }

  const gender = requireGenderedPieceGender(pieceId);
  const material = requireGenderedPieceMaterial(pieceId);
  const fileName = genderedArmorFileName(
    pieceId,
    slot,
    material,
    pieceIndex(pieceId),
    flatChest,
    feetBack,
  );
  return joinArmorImagePath(genderedArmorDirectory(gender, material), fileName);
}

export function armorBodyImagePath(gender: ArmorGender): string {
  return buildArmorBodyImagePath(requireArmorGender(gender));
}

export function armorPieceImagePath(
  pieceId: string,
  options?: { flatChest?: boolean; feetBack?: boolean },
): string {
  const validPieceId = requireArmorPieceId(pieceId);
  const imageOptions = readArmorPieceImageOptions(options);
  rejectCombinedArmorImageOptions(validPieceId, imageOptions.flatChest, imageOptions.feetBack);
  requireRequestedArmorImageVariant(validPieceId, imageOptions.flatChest, imageOptions.feetBack);
  return buildArmorPieceImagePath(validPieceId, imageOptions.flatChest, imageOptions.feetBack);
}
