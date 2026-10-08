import type {
  ConstellationAsset,
  ConstellationAssetCategory,
} from './types';
import { CONSTELLATION_THEME_NAMES } from './theme-names';

export const CONSTELLATION_ASSET_CATEGORIES = ['image', 'plain', 'line'] as const satisfies readonly ConstellationAssetCategory[];
export const CONSTELLATION_ASSET_COUNT_PER_CATEGORY = 61;
export const CONSTELLATION_ASSET_TOTAL_COUNT =
  CONSTELLATION_ASSET_CATEGORIES.length * CONSTELLATION_ASSET_COUNT_PER_CATEGORY;
export const CONSTELLATION_STAR_ASSET_ID = 'star';
export const CONSTELLATION_STAR_ASSET_SRC = '/constellation-map-creator/assets/star.svg';
export const CONSTELLATION_ASSET_WIDTH = 98;
export const CONSTELLATION_ASSET_HEIGHT = 93;
export const CONSTELLATION_STAR_WIDTH = 20;
export const CONSTELLATION_STAR_HEIGHT = 20;

const CONSTELLATION_ASSET_DIRECTORY = '/constellation-map-creator/assets';

const CONSTELLATION_ASSET_FILE_PREFIX: Readonly<Record<ConstellationAssetCategory, string>> = {
  image: 'image',
  plain: 'plain',
  line: 'line',
};

function isConstellationAssetCategory(
  receivedCategory: unknown,
): receivedCategory is ConstellationAssetCategory {
  return (
    typeof receivedCategory === 'string' &&
    (CONSTELLATION_ASSET_CATEGORIES as readonly string[]).includes(receivedCategory)
  );
}

function requireConstellationAssetCategory(
  receivedCategory: unknown,
): ConstellationAssetCategory {
  if (!isConstellationAssetCategory(receivedCategory)) {
    throw new Error(
      `Constellation asset category must be image, plain, or line. Received ${String(receivedCategory)}.`,
    );
  }

  return receivedCategory;
}

function buildConstellationAsset(
  category: ConstellationAssetCategory,
  index: number,
): ConstellationAsset {
  const filePrefix = CONSTELLATION_ASSET_FILE_PREFIX[category];
  const paddedIndex = String(index).padStart(2, '0');
  const themeName = CONSTELLATION_THEME_NAMES.find((candidate) => candidate.index === index);

  if (themeName === undefined) {
    throw new Error(`Constellation theme name is missing for index ${String(index)}.`);
  }

  return {
    id: `${category}-${index}`,
    category,
    index,
    src: `${CONSTELLATION_ASSET_DIRECTORY}/${category}/${filePrefix}-${paddedIndex}.svg`,
    nameEn: themeName.nameEn,
    nameZh: themeName.nameZh,
    width: CONSTELLATION_ASSET_WIDTH,
    height: CONSTELLATION_ASSET_HEIGHT,
  };
}

const CONSTELLATION_ASSETS: readonly ConstellationAsset[] = CONSTELLATION_ASSET_CATEGORIES.flatMap(
  (category) =>
    Array.from({ length: CONSTELLATION_ASSET_COUNT_PER_CATEGORY }, (_, offset) =>
      buildConstellationAsset(category, offset + 1),
    ),
);

const CONSTELLATION_ASSETS_BY_ID = new Map(
  CONSTELLATION_ASSETS.map((asset) => [asset.id, asset]),
);

export function getConstellationAssets(
  category: ConstellationAssetCategory,
): ConstellationAsset[] {
  const validCategory = requireConstellationAssetCategory(category);
  return CONSTELLATION_ASSETS.filter((asset) => asset.category === validCategory).map((asset) => ({
    ...asset,
  }));
}

export function getConstellationAsset(assetId: string): ConstellationAsset {
  if (typeof assetId !== 'string' || assetId.length === 0) {
    throw new Error(
      `Constellation asset id must be a non-empty string. Received ${String(assetId)}.`,
    );
  }

  if (assetId === CONSTELLATION_STAR_ASSET_ID) {
    throw new Error(
      `Constellation asset id must refer to an image, plain, or line asset, not ${JSON.stringify(assetId)}.`,
    );
  }

  const asset = CONSTELLATION_ASSETS_BY_ID.get(assetId);
  if (asset === undefined) {
    throw new Error(`Unknown constellation asset id: ${JSON.stringify(assetId)}.`);
  }

  return { ...asset };
}

export function isConstellationAssetId(assetId: unknown): assetId is string {
  return typeof assetId === 'string' && CONSTELLATION_ASSETS_BY_ID.has(assetId);
}
