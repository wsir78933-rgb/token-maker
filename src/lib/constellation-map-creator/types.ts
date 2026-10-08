export type ConstellationAssetCategory = 'image' | 'plain' | 'line';

export type ConstellationAsset = {
  id: string;
  category: ConstellationAssetCategory;
  index: number;
  src: string;
  nameEn: string;
  nameZh: string;
  width: number;
  height: number;
};

export type ConstellationObject = {
  id: string;
  kind: 'constellation' | 'star';
  assetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};

export type ConstellationBackground = {
  color: string;
  transparent: boolean;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
};

export type ConstellationProject = {
  width: number;
  height: number;
  background: ConstellationBackground;
  objects: ConstellationObject[];
};

export type ConstellationTransform = Pick<ConstellationObject, 'x' | 'y' | 'width' | 'height' | 'rotation'>;
export type ConstellationSaveSlot = 1 | 2 | 3 | 4 | 5;
export type ConstellationSavedProject = { project: ConstellationProject; savedAt: string };
export type ConstellationSaveSlots = (ConstellationSavedProject | null)[];

export const CONSTELLATION_MAX_DIMENSION = 4096;
export const CONSTELLATION_MAX_PIXELS = 16_777_216;
export const CONSTELLATION_MAX_FILE_BYTES = 1_048_576;
export const CONSTELLATION_SAVE_KEY = 'tokenmaker.constellation-map-creator.saves';
