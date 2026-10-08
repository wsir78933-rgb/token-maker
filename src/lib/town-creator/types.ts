export type TownLayerId = 'lower' | 'middle' | 'upper';
export type TownMaterial = 'wood' | 'stone' | 'clay' | 'sandstone' | 'neutral';
export type TownCategoryId = 'buildings' | 'defenses' | 'props' | 'roads' | 'terrain' | 'prefabs' | 'nature';
export type TownResizeMode = 'regular' | 'line' | 'tile' | 'connector';
export type TownAssetVariant = {
  material: TownMaterial;
  svg: string;
  png: string;
  thumbnail: string;
};
export type TownAsset = {
  id: string;
  category: TownCategoryId;
  name: { en: string; zh: string };
  materials: readonly TownMaterial[];
  width: number;
  height: number;
  resizeMode: TownResizeMode;
  variants: readonly TownAssetVariant[];
};
export type TownObject = {
  id: string;
  assetId: string;
  material: TownMaterial;
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDegrees: number;
};
export type TownLayer = {
  id: TownLayerId;
  visible: boolean;
  objects: readonly TownObject[];
};
export type TownDocument = {
  version: 1;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImageUrl: string;
  activeLayer: TownLayerId;
  layers: readonly TownLayer[];
};
export type TownObjectPatch = Partial<Pick<TownObject, 'x' | 'y' | 'width' | 'height' | 'rotationDegrees'>>;
