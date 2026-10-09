export const MAP_MAKER_DEFAULT_COLUMNS = 12;
export const MAP_MAKER_DEFAULT_ROWS = 6;
export const MAP_MAKER_TILE_SIZE = 70;
export const MAP_MAKER_MIN_COLUMNS = 6;
export const MAP_MAKER_MAX_COLUMNS = 35;
export const MAP_MAKER_MIN_ROWS = 2;
export const MAP_MAKER_MAX_ROWS = 35;
export const MAP_MAKER_MAX_PROJECT_BYTES = 1_048_576;
export const MAP_MAKER_SAVE_SLOT_COUNT = 8;
export const MAP_MAKER_HEX_SIZE_MIN_PERCENT = 1;
export const MAP_MAKER_HEX_SIZE_MAX_PERCENT = 15;
export const MAP_MAKER_HEX_SIZE_STEP_PERCENT = 0.1;

export type MapMakerAssetCategory = 'coastline' | 'geography' | 'structures' | 'water';
export type MapMakerAssetUsage = 'tile' | 'element' | 'preview';

export type MapMakerCoastlineGroup =
  | 'convex-upper-left'
  | 'convex-upper-right'
  | 'convex-lower-left'
  | 'convex-lower-right'
  | 'concave-upper-left'
  | 'concave-upper-right'
  | 'concave-lower-left'
  | 'concave-lower-right'
  | 'side-top'
  | 'side-right'
  | 'side-bottom'
  | 'side-left';

export type MapMakerEdgeSignature = '0' | '1' | '2' | '3' | '-1' | '-2' | '-3' | '4';

export type MapMakerConnections = readonly [
  north: MapMakerEdgeSignature,
  east: MapMakerEdgeSignature,
  south: MapMakerEdgeSignature,
  west: MapMakerEdgeSignature,
];

export type MapMakerAsset = {
  id: string;
  name: string;
  category: MapMakerAssetCategory;
  src: string;
  tileSrc?: string;
  previewSrc?: string;
  width: number;
  height: number;
  coastlineGroup?: MapMakerCoastlineGroup;
  connections?: MapMakerConnections;
};

export type MapMakerImageSource =
  | { kind: 'asset'; assetId: string }
  | { kind: 'url'; url: string };

export type MapMakerRotation = 0 | 90 | 180 | 270;
export type MapMakerElementLayer = 1 | 2;

export type MapMakerGridCell = {
  column: number;
  row: number;
};

export type MapMakerBaseTile = MapMakerGridCell & {
  source: MapMakerImageSource;
  rotation: MapMakerRotation;
  flipHorizontal: boolean;
  flipVertical: boolean;
};

export type MapMakerElement = {
  id: string;
  source: MapMakerImageSource;
  layer: MapMakerElementLayer;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: MapMakerRotation;
  flipHorizontal: boolean;
  flipVertical: boolean;
};

export type MapMakerLabel = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
};

export type MapMakerProjectSettings = {
  elementsVisible: boolean;
  labelsVisible: boolean;
  squareGridVisible: boolean;
  hexGridVisible: boolean;
  hexSizePercent: number;
  snapToGrid: boolean;
  elementResizingEnabled: boolean;
  labelResizingEnabled: boolean;
  labelBordersEnabled: boolean;
};

export type MapMakerProject = {
  columns: number;
  rows: number;
  baseTiles: MapMakerBaseTile[];
  elements: MapMakerElement[];
  labels: MapMakerLabel[];
  settings: MapMakerProjectSettings;
};

export type MapMakerSavedProject = {
  project: MapMakerProject;
  savedAt: string;
};

export type MapMakerSaveSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type MapMakerSaveSlots = Array<MapMakerSavedProject | null>;

export type MapMakerElementPatch = Partial<Omit<MapMakerElement, 'id'>>;
export type MapMakerLabelPatch = Partial<Omit<MapMakerLabel, 'id'>>;
export type MapMakerBaseTilePatch = Partial<Pick<MapMakerBaseTile, 'source' | 'rotation' | 'flipHorizontal' | 'flipVertical'>>;
export type MapMakerProjectSettingsPatch = Partial<MapMakerProjectSettings>;
