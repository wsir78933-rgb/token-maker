export const WEAPON_CATEGORIES = [
  'hilts',
  'pommels',
  'crossguards',
  'blade',
  'handle',
  'axe',
  'mace',
  'hammer',
  'bow',
  'bowhandle',
  'bowtip',
  'stafftop',
  'staffbtm',
  'staff',
  'scythe',
  'polearm',
  'spear',
] as const;

export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number];

export const WEAPON_PREVIEW_WIDTH = 800;
export const WEAPON_PREVIEW_HEIGHT = 635;

export type WeaponLayerBox = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}>;

/**
 * The source page's stacking order, from the lowest z-index to the highest.
 * bowtip and staff share z-index 23; the source DOM places staff after bowtip.
 */
export const WEAPON_LAYER_ORDER = [
  'blade',
  'axe',
  'handle',
  'hilts',
  'mace',
  'hammer',
  'pommels',
  'crossguards',
  'bow',
  'bowhandle',
  'bowtip',
  'staff',
  'stafftop',
  'staffbtm',
  'spear',
  'scythe',
  'polearm',
] as const satisfies readonly WeaponCategory[];

const WEAPON_PIECE_PREFIX: Record<WeaponCategory, string> = {
  hilts: 'grip',
  pommels: 'pommel',
  crossguards: 'crossguard',
  blade: 'blade',
  handle: 'stick',
  axe: 'axe',
  mace: 'mace',
  hammer: 'hammer',
  bow: 'bow',
  bowhandle: 'bowhandle',
  bowtip: 'bowtip',
  stafftop: 'stafftop',
  staffbtm: 'staffbtm',
  staff: 'staff',
  scythe: 'scythe',
  polearm: 'polearm',
  spear: 'spear',
};

const WEAPON_PIECE_COUNT: Record<WeaponCategory, number> = {
  hilts: 30,
  pommels: 60,
  crossguards: 30,
  blade: 30,
  handle: 30,
  axe: 30,
  mace: 30,
  hammer: 30,
  bow: 30,
  bowhandle: 30,
  bowtip: 30,
  stafftop: 30,
  staffbtm: 30,
  staff: 30,
  scythe: 30,
  polearm: 30,
  spear: 30,
};

const WEAPON_LAYER_BOXES: Record<WeaponCategory, WeaponLayerBox> = {
  hilts: { x: 355, y: 477, width: 87, height: 118, zIndex: 12 },
  pommels: { x: 365, y: 569, width: 68, height: 65, zIndex: 19 },
  crossguards: { x: 314, y: 431, width: 170, height: 80, zIndex: 20 },
  blade: { x: 313, y: 22, width: 201, height: 470, zIndex: 9 },
  handle: { x: 356, y: 25, width: 84, height: 468, zIndex: 11 },
  axe: { x: 292, y: 25, width: 213, height: 205, zIndex: 10 },
  mace: { x: 294, y: 0, width: 240, height: 140, zIndex: 17 },
  hammer: { x: 294, y: 0, width: 240, height: 140, zIndex: 18 },
  bow: { x: 180, y: 0, width: 400, height: 620, zIndex: 21 },
  bowhandle: { x: 440, y: 228, width: 70, height: 170, zIndex: 22 },
  bowtip: { x: 180, y: 0, width: 400, height: 620, zIndex: 23 },
  stafftop: { x: 314, y: 40, width: 130, height: 130, zIndex: 24 },
  staffbtm: { x: 341, y: 440, width: 80, height: 150, zIndex: 25 },
  staff: { x: 180, y: 40, width: 400, height: 620, zIndex: 23 },
  scythe: { x: 266, y: 8, width: 310, height: 212, zIndex: 27 },
  polearm: { x: 332, y: 0, width: 105, height: 166, zIndex: 28 },
  spear: { x: 362, y: 8, width: 46, height: 102, zIndex: 26 },
};

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
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined
      ? Object.prototype.toString.call(value)
      : serializedValue;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${error.message}).`;
    }

    throw error;
  }
}

function isWeaponCategory(value: unknown): value is WeaponCategory {
  return typeof value === 'string' && WEAPON_CATEGORIES.some((category) => category === value);
}

export function requireWeaponCategory(value: unknown): WeaponCategory {
  if (isWeaponCategory(value)) {
    return value;
  }

  throw new Error(`Invalid weapon category. Received ${describeReceivedValue(value)}.`);
}

function buildWeaponPieceIds(category: WeaponCategory): string[] {
  const prefix = WEAPON_PIECE_PREFIX[category];
  const pieceCount = WEAPON_PIECE_COUNT[category];
  const pieceIds: string[] = [];

  for (let index = 1; index <= pieceCount; index += 1) {
    pieceIds.push(`${prefix}${index}`);
  }

  return pieceIds;
}

export function listWeaponPieceIds(category: unknown): string[] {
  const validCategory = requireWeaponCategory(category);
  return buildWeaponPieceIds(validCategory);
}

export function requireWeaponPieceId(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid weapon piece id. Received ${describeReceivedValue(value)}.`);
  }

  for (const category of WEAPON_CATEGORIES) {
    if (listWeaponPieceIds(category).some((pieceId) => pieceId === value)) {
      return value;
    }
  }

  throw new Error(`Invalid weapon piece id. Received ${JSON.stringify(value)}.`);
}

export function pieceCategory(pieceId: unknown): WeaponCategory {
  const validPieceId = requireWeaponPieceId(pieceId);

  for (const category of WEAPON_CATEGORIES) {
    if (listWeaponPieceIds(category).some((candidate) => candidate === validPieceId)) {
      return category;
    }
  }

  throw new Error(`Weapon piece id ${JSON.stringify(validPieceId)} has no category.`);
}

export function getWeaponLayerBox(category: unknown): WeaponLayerBox {
  const validCategory = requireWeaponCategory(category);
  return WEAPON_LAYER_BOXES[validCategory];
}
