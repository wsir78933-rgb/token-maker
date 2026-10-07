import {
  SOLAR_ASSET_COUNT_PER_CATEGORY,
  type SolarAsset,
  type SolarAssetCategory,
} from './types';

export const SOLAR_ASSET_CATEGORIES = [
  'star',
  'type-1',
  'type-2',
  'type-3',
  'type-4',
  'type-5',
] as const satisfies readonly SolarAssetCategory[];

export const SOLAR_ASSET_TOTAL_COUNT = 240;

const SOLAR_ASSET_PUBLIC_DIRECTORY = '/solar-system-creator/rollforfantasy';

function buildRollForFantasyFilenames(prefix: string, padIndexToTwoDigits = false): readonly string[] {
  return Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, offset) => {
    const index = offset + 1;
    const indexText = padIndexToTwoDigits ? String(index).padStart(2, '0') : String(index);
    return `${prefix}${indexText}.png`;
  });
}

const SOLAR_ASSET_FILENAMES: Readonly<Record<SolarAssetCategory, readonly string[]>> = {
  star: buildRollForFantasyFilenames('sun'),
  'type-1': buildRollForFantasyFilenames('earthPlanet', true),
  'type-2': buildRollForFantasyFilenames('gasPlanet'),
  'type-3': buildRollForFantasyFilenames('moonPlanet'),
  'type-4': buildRollForFantasyFilenames('terplanet'),
  'type-5': buildRollForFantasyFilenames('layerPlanet'),
};

function buildSolarAsset(category: SolarAssetCategory, index: number): SolarAsset {
  const filename = SOLAR_ASSET_FILENAMES[category][index - 1];
  if (filename === undefined) {
    throw new Error(`Missing RollForFantasy filename for ${category}-${index}.`);
  }

  return {
    id: `${category}-${index}`,
    category,
    index,
    src: `${SOLAR_ASSET_PUBLIC_DIRECTORY}/${filename}`,
  };
}

const SOLAR_ASSETS: readonly SolarAsset[] = SOLAR_ASSET_CATEGORIES.flatMap((category) =>
  Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, offset) =>
    buildSolarAsset(category, offset + 1),
  ),
);

const SOLAR_ASSETS_BY_ID = new Map(SOLAR_ASSETS.map((asset) => [asset.id, asset]));

function isSolarAssetCategory(value: unknown): value is SolarAssetCategory {
  return (
    typeof value === 'string' &&
    (SOLAR_ASSET_CATEGORIES as readonly string[]).includes(value)
  );
}

export function listSolarAssets(category: SolarAssetCategory): readonly SolarAsset[] {
  if (!isSolarAssetCategory(category)) {
    throw new Error(`Invalid solar asset category: ${String(category)}`);
  }

  return SOLAR_ASSETS.filter((asset) => asset.category === category);
}

export function getSolarAsset(id: string): SolarAsset {
  const asset = SOLAR_ASSETS_BY_ID.get(id);
  if (asset === undefined) {
    throw new Error(`Unknown solar asset id: ${String(id)}`);
  }

  return asset;
}
