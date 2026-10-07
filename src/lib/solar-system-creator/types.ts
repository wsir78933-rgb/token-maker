export const SOLAR_CANVAS_WIDTH = 800;
export const SOLAR_CANVAS_HEIGHT = 400;
export const SOLAR_STAR_WIDTH = 175;
export const SOLAR_STAR_HEIGHT = 400;
export const SOLAR_DEFAULT_PLANET_WIDTH = 40;
export const SOLAR_DEFAULT_PLANET_HEIGHT = 40;
export const SOLAR_ASSET_COUNT_PER_CATEGORY = 40;
export const SOLAR_RANDOM_MIN_PLANETS = 4;
export const SOLAR_RANDOM_MAX_PLANETS = 10;
export const SOLAR_FIXED_MAX_PLANETS = 10;

export type SolarSystemLocale = 'en' | 'zh';

export type SolarAssetCategory =
  | 'star'
  | 'type-1'
  | 'type-2'
  | 'type-3'
  | 'type-4'
  | 'type-5';

export type SolarAsset = {
  id: string;
  category: SolarAssetCategory;
  index: number;
  src: string;
};

export type SolarStarRange = 'normal' | 'include-blue' | 'only-blue';

export type SolarPlanetField =
  | 'environment'
  | 'atmosphere'
  | 'surfaceMap'
  | 'dayHours'
  | 'gravity'
  | 'orbitYears'
  | 'moons'
  | 'axialTilt';

export type SolarPlanetFields = Record<SolarPlanetField, string>;

export type SolarPlanetTransform = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type RandomSolarPlanet = SolarPlanetTransform & {
  id: string;
  assetId: string;
  fields: SolarPlanetFields;
};

export type RandomSolarSystem = {
  starAssetId: string;
  planets: readonly RandomSolarPlanet[];
  selectedPlanetId: string | null;
};

export type SolarRandomOptions = {
  starRange: SolarStarRange;
  requestedPlanetCount: number | null;
};

export type ManualSolarPlanet = SolarPlanetTransform & {
  id: string;
  assetId: string;
  description: string;
};

export type ManualSolarSystem = {
  starAssetId: string | null;
  planets: readonly ManualSolarPlanet[];
  selectedPlanetId: string | null;
  draggingEnabled: boolean;
  resizingEnabled: boolean;
};

export type SolarSaveSnapshot = {
  starAssetId: string | null;
  planets: ManualSolarPlanet[];
};
