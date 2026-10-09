export const CASTLE_CATEGORIES = [
  'walls',
  'battlements',
  'towerRoofs',
  'buildings',
  'buildingRoofs',
  'gates',
] as const;

export type CastleCategory = (typeof CASTLE_CATEGORIES)[number];

export const CASTLE_LAYER_IDS = ['lower', 'middle', 'upper'] as const;

export type CastleLayerId = (typeof CASTLE_LAYER_IDS)[number];

export const CASTLE_BUILDING_COLORS = [1, 2, 3, 4] as const;

export type CastleBuildingColor = (typeof CASTLE_BUILDING_COLORS)[number];

export const CASTLE_ROOF_COLORS = [1, 2, 3, 4, 5] as const;

export type CastleRoofColor = (typeof CASTLE_ROOF_COLORS)[number];

export interface CastlePalette {
  building: CastleBuildingColor;
  roof: CastleRoofColor;
}

export interface CastleCanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImageUrl: string | null;
}

export interface CastleAsset {
  id: string;
  category: CastleCategory;
  number: number;
  width: number;
  height: number;
}

export interface CastlePoint {
  x: number;
  y: number;
}

export interface CastleSize {
  width: number;
  height: number;
}

export interface CastlePiece extends CastlePoint, CastleSize {
  id: string;
  assetId: string;
  layerId: CastleLayerId;
  buildingColor: CastleBuildingColor;
  roofColor: CastleRoofColor;
}

export interface CastleProject {
  version: 1;
  pieces: CastlePiece[];
  activeLayer: CastleLayerId;
  visibleLayers: Record<CastleLayerId, boolean>;
  canvas: CastleCanvasSettings;
  palette: CastlePalette;
  snapEnabled: boolean;
  resizeEnabled: boolean;
}

export type CastleSaveSlotNumber = 1 | 2 | 3 | 4 | 5;
