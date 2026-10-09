import {
  CASTLE_BUILDING_COLORS,
  CASTLE_CATEGORIES,
  CASTLE_LAYER_IDS,
  CASTLE_ROOF_COLORS,
  type CastleCategory,
  type CastleLayerId,
} from './types';

export const CASTLE_CREATOR_PATH = '/castle-creator';
export const CASTLE_CREATOR_WORKSPACE_ID = 'castle-creator-workspace';
export const CASTLE_CREATOR_EDITOR_ID = CASTLE_CREATOR_WORKSPACE_ID;

export const CASTLE_CREATOR_DEFAULT_CANVAS_WIDTH = 0;
export const CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT = 635;
export const CASTLE_CREATOR_DEFAULT_BACKGROUND_COLOR = '#ffffff';
export const CASTLE_CREATOR_DEFAULT_LAYER: CastleLayerId = 'lower';
export const CASTLE_CREATOR_DEFAULT_SNAP_ENABLED = false;
export const CASTLE_CREATOR_DEFAULT_RESIZE_ENABLED = true;

export const CASTLE_CREATOR_SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5] as const;
export const CASTLE_CREATOR_SAVE_SLOT_COUNT = CASTLE_CREATOR_SAVE_SLOT_NUMBERS.length;

export const CASTLE_CREATOR_CATEGORY_COUNTS: Readonly<Record<CastleCategory, number>> = {
  walls: 94,
  battlements: 70,
  towerRoofs: 24,
  buildings: 67,
  buildingRoofs: 84,
  gates: 18,
};
export const CASTLE_CREATOR_DOOR_COUNT = 9;
export const CASTLE_CREATOR_TOTAL_ASSET_COUNT = Object.values(
  CASTLE_CREATOR_CATEGORY_COUNTS,
).reduce((assetCount, categoryCount) => assetCount + categoryCount, CASTLE_CREATOR_DOOR_COUNT);

export const CASTLE_CREATOR_CATEGORY_IDS = CASTLE_CATEGORIES;
export const CASTLE_CREATOR_LAYER_IDS = CASTLE_LAYER_IDS;
export const CASTLE_CREATOR_BUILDING_COLORS = CASTLE_BUILDING_COLORS;
export const CASTLE_CREATOR_ROOF_COLORS = CASTLE_ROOF_COLORS;

export const CASTLE_CREATOR_FILE_ACCEPT = '.json,application/json';
export const CASTLE_CREATOR_EXPORT_FORMAT = 'png';
