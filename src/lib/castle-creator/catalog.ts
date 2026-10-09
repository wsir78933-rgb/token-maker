import {
  CASTLE_BUILDING_COLORS,
  CASTLE_CATEGORIES,
  CASTLE_ROOF_COLORS,
  type CastleAsset,
  type CastleCategory,
  type CastlePalette,
} from './types';
import {
  CASTLE_CREATOR_CATEGORY_COUNTS,
  CASTLE_CREATOR_DOOR_COUNT,
  CASTLE_CREATOR_TOTAL_ASSET_COUNT,
} from './constants';

export { CASTLE_CATEGORIES } from './types';
export type { CastleAsset, CastleCategory, CastlePalette } from './types';

type AssetSizeRange = readonly [firstNumber: number, lastNumber: number, width: number, height: number];

const CASTLE_ASSET_IMAGE_ROOT = '/castle-creator';

const WALL_SIZE_RANGES: readonly AssetSizeRange[] = [
  [1, 3, 25, 48],
  [4, 6, 25, 62],
  [7, 16, 47, 48],
  [17, 26, 47, 62],
  [27, 60, 90, 48],
  [61, 94, 90, 62],
];

const BATTLEMENT_SIZE_RANGES: readonly AssetSizeRange[] = [
  [1, 25, 89, 21],
  [26, 50, 46, 21],
  [51, 70, 25, 21],
];

const TOWER_ROOF_SIZE_RANGES: readonly AssetSizeRange[] = [[1, 24, 34, 47]];

const BUILDING_SIZE_RANGES: readonly AssetSizeRange[] = [
  [1, 18, 63, 48],
  [19, 20, 78, 48],
  [21, 37, 63, 27],
  [38, 49, 35, 48],
  [50, 67, 63, 48],
];

const BUILDING_ROOF_SIZE_RANGES: readonly AssetSizeRange[] = [
  [1, 11, 64, 35],
  [12, 22, 80, 40],
  [23, 33, 94, 35],
  [34, 44, 94, 41],
  [45, 54, 52, 41],
  [55, 64, 53, 35],
  [65, 74, 65, 35],
  [75, 84, 65, 42],
];

const GATE_SIZE_RANGES: readonly AssetSizeRange[] = [
  [1, 3, 46, 48],
  [4, 6, 46, 62],
  [7, 9, 89, 48],
  [10, 18, 89, 62],
];

const DOOR_SIZE_RANGES: readonly AssetSizeRange[] = [
  [1, 1, 34, 38],
  [2, 2, 30, 43],
  [3, 3, 34, 42],
  [4, 4, 34, 48],
  [5, 5, 32, 54],
  [6, 6, 34, 53],
  [7, 7, 56, 48],
  [8, 9, 56, 53],
];

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
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${error.message})`;
    }

    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireCastleCategory(value: unknown): CastleCategory {
  if (typeof value === 'string' && CASTLE_CATEGORIES.includes(value as CastleCategory)) {
    return value as CastleCategory;
  }

  throw new Error(`Invalid Castle category. Received ${describeReceivedValue(value)}.`);
}

function requirePaletteColor(
  value: unknown,
  allowedColors: readonly number[],
  colorName: 'building' | 'roof',
): number {
  if (typeof value === 'number' && Number.isInteger(value) && allowedColors.includes(value)) {
    return value;
  }

  throw new Error(
    `Invalid Castle ${colorName} palette color. Received ${describeReceivedValue(value)}.`,
  );
}

function requireCastlePalette(value: unknown): CastlePalette {
  if (!isRecord(value)) {
    throw new Error(`Invalid Castle palette. Received ${describeReceivedValue(value)}.`);
  }

  const paletteKeys = Object.keys(value).sort();
  if (paletteKeys.join(',') !== 'building,roof') {
    throw new Error(
      `Invalid Castle palette keys. Received ${describeReceivedValue(value)}.`,
    );
  }

  return {
    building: requirePaletteColor(value.building, CASTLE_BUILDING_COLORS, 'building') as CastlePalette['building'],
    roof: requirePaletteColor(value.roof, CASTLE_ROOF_COLORS, 'roof') as CastlePalette['roof'],
  };
}

function resolveAssetSize(
  category: CastleCategory,
  assetNumber: number,
  sizeRanges: readonly AssetSizeRange[],
): { width: number; height: number } {
  const matchingRange = sizeRanges.find(
    ([firstNumber, lastNumber]) => assetNumber >= firstNumber && assetNumber <= lastNumber,
  );

  if (!matchingRange) {
    throw new Error(
      `Castle ${category} asset number ${assetNumber} has no native size range.`,
    );
  }

  return { width: matchingRange[2], height: matchingRange[3] };
}

function buildIndexedAssets(
  category: CastleCategory,
  idPrefix: string,
  assetCount: number,
  sizeRanges: readonly AssetSizeRange[],
  numberOffset = 0,
): readonly CastleAsset[] {
  const assets = Array.from({ length: assetCount }, (_, index) => {
    const sourceNumber = index + 1;
    const number = sourceNumber + numberOffset;
    const size = resolveAssetSize(category, sourceNumber, sizeRanges);

    return Object.freeze({
      id: `${idPrefix}-${sourceNumber}`,
      category,
      number,
      width: size.width,
      height: size.height,
    });
  });

  return Object.freeze(assets);
}

const CASTLE_ASSETS_BY_CATEGORY: Readonly<Record<CastleCategory, readonly CastleAsset[]>> = {
  walls: buildIndexedAssets(
    'walls',
    'walls',
    CASTLE_CREATOR_CATEGORY_COUNTS.walls,
    WALL_SIZE_RANGES,
  ),
  battlements: buildIndexedAssets(
    'battlements',
    'battlements',
    CASTLE_CREATOR_CATEGORY_COUNTS.battlements,
    BATTLEMENT_SIZE_RANGES,
  ),
  towerRoofs: buildIndexedAssets(
    'towerRoofs',
    'towerRoofs',
    CASTLE_CREATOR_CATEGORY_COUNTS.towerRoofs,
    TOWER_ROOF_SIZE_RANGES,
  ),
  buildings: buildIndexedAssets(
    'buildings',
    'buildings',
    CASTLE_CREATOR_CATEGORY_COUNTS.buildings,
    BUILDING_SIZE_RANGES,
  ),
  buildingRoofs: buildIndexedAssets(
    'buildingRoofs',
    'buildingRoofs',
    CASTLE_CREATOR_CATEGORY_COUNTS.buildingRoofs,
    BUILDING_ROOF_SIZE_RANGES,
  ),
  gates: Object.freeze([
    ...buildIndexedAssets(
      'gates',
      'gates',
      CASTLE_CREATOR_CATEGORY_COUNTS.gates,
      GATE_SIZE_RANGES,
    ),
    ...buildIndexedAssets(
      'gates',
      'doors',
      CASTLE_CREATOR_DOOR_COUNT,
      DOOR_SIZE_RANGES,
      CASTLE_CREATOR_CATEGORY_COUNTS.gates,
    ),
  ]),
};

const ALL_CASTLE_ASSETS = Object.freeze(
  CASTLE_CATEGORIES.flatMap((category) => CASTLE_ASSETS_BY_CATEGORY[category]),
);

const CASTLE_ASSETS_BY_ID = new Map(
  ALL_CASTLE_ASSETS.map((asset) => [asset.id, asset] as const),
);

function assertCatalogShape(): void {
  if (ALL_CASTLE_ASSETS.length !== CASTLE_CREATOR_TOTAL_ASSET_COUNT) {
    throw new Error(
      `Castle catalog must contain ${CASTLE_CREATOR_TOTAL_ASSET_COUNT} assets. Received ${ALL_CASTLE_ASSETS.length}.`,
    );
  }

  if (CASTLE_ASSETS_BY_ID.size !== ALL_CASTLE_ASSETS.length) {
    throw new Error('Castle catalog contains duplicate asset ids.');
  }
}

assertCatalogShape();

export function listCastleAssets(category: CastleCategory): readonly CastleAsset[] {
  const validCategory = requireCastleCategory(category);
  return CASTLE_ASSETS_BY_CATEGORY[validCategory];
}

export function getCastleAsset(assetId: string): CastleAsset {
  if (typeof assetId !== 'string') {
    throw new Error(`Invalid Castle asset id. Received ${describeReceivedValue(assetId)}.`);
  }

  const asset = CASTLE_ASSETS_BY_ID.get(assetId);
  if (!asset) {
    throw new Error(`Unknown Castle asset id: ${describeReceivedValue(assetId)}.`);
  }

  return asset;
}

export function castleAssetImagePath(assetId: string, palette: CastlePalette): string {
  const asset = getCastleAsset(assetId);
  const validatedPalette = requireCastlePalette(palette);

  if (asset.id.startsWith('doors-')) {
    return `${CASTLE_ASSET_IMAGE_ROOT}/${asset.id}.webp`;
  }

  if (asset.category === 'buildingRoofs') {
    return `${CASTLE_ASSET_IMAGE_ROOT}/${asset.id}-roof-${validatedPalette.roof}.webp`;
  }

  return `${CASTLE_ASSET_IMAGE_ROOT}/${asset.id}-building-${validatedPalette.building}.webp`;
}
