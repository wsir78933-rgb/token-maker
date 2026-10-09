import { MAP_MAKER_DEFAULT_SEA_ASSET_ID } from './catalog';
import {
  requireMapMakerBaseTilePatch,
  requireMapMakerColumns,
  requireMapMakerEntityIds,
  requireMapMakerElementPatch,
  requireMapMakerGridCells,
  requireMapMakerImageSource,
  requireMapMakerLabelPatch,
  requireMapMakerLayer,
  requireMapMakerProject,
  requireMapMakerRows,
  requireMapMakerSettingsPatch,
} from './validation';
import {
  MAP_MAKER_DEFAULT_COLUMNS,
  MAP_MAKER_DEFAULT_ROWS,
  MAP_MAKER_TILE_SIZE,
} from './types';
import type {
  MapMakerBaseTile,
  MapMakerBaseTilePatch,
  MapMakerElement,
  MapMakerElementLayer,
  MapMakerElementPatch,
  MapMakerGridCell,
  MapMakerImageSource,
  MapMakerLabel,
  MapMakerLabelPatch,
  MapMakerProject,
  MapMakerProjectSettings,
  MapMakerProjectSettingsPatch,
} from './types';

const SEA_SOURCE: MapMakerImageSource = { kind: 'asset', assetId: MAP_MAKER_DEFAULT_SEA_ASSET_ID };

function createSeaTile(column: number, row: number): MapMakerBaseTile {
  return {
    column,
    row,
    source: { ...SEA_SOURCE },
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  };
}

function createSeaTiles(columns: number, rows: number): MapMakerBaseTile[] {
  return Array.from({ length: columns * rows }, (_, cellIndex) =>
    createSeaTile(cellIndex % columns, Math.floor(cellIndex / columns)),
  );
}

function requireSelectedCells(project: MapMakerProject, receivedCells: unknown): MapMakerGridCell[] {
  const cells = requireMapMakerGridCells(receivedCells, project.columns, project.rows);
  if (cells.length === 0) {
    throw new Error('Map Maker base tile operation requires at least one selected cell. Received [].');
  }
  return cells;
}

function requireSelectedEntityIds(receivedIds: unknown, entityName: string): string[] {
  const ids = requireMapMakerEntityIds(receivedIds, entityName);
  if (ids.length === 0) {
    throw new Error(`Map Maker ${entityName} operation requires at least one selected id. Received [].`);
  }
  return ids;
}

function requireAllIdsExist(
  requestedIds: readonly string[],
  existingIds: ReadonlySet<string>,
  entityName: string,
): void {
  const missingIds = requestedIds.filter((id) => !existingIds.has(id));
  if (missingIds.length > 0) {
    throw new Error(`Map Maker ${entityName} ids were not found. Received ${JSON.stringify(missingIds)}.`);
  }
}

function fitMapMakerLabelsToSize(
  labels: readonly MapMakerLabel[],
  columns: number,
  rows: number,
): MapMakerLabel[] {
  const mapWidth = columns * MAP_MAKER_TILE_SIZE;
  const mapHeight = rows * MAP_MAKER_TILE_SIZE;
  return labels.map((label) => {
    const width = Math.min(label.width, mapWidth);
    const height = Math.min(label.height, mapHeight);
    return {
      ...label,
      width,
      height,
      x: Math.min(label.x, mapWidth - width),
      y: Math.min(label.y, mapHeight - height),
    };
  });
}

export function createDefaultMapMakerProject(): MapMakerProject {
  return {
    columns: MAP_MAKER_DEFAULT_COLUMNS,
    rows: MAP_MAKER_DEFAULT_ROWS,
    baseTiles: createSeaTiles(MAP_MAKER_DEFAULT_COLUMNS, MAP_MAKER_DEFAULT_ROWS),
    elements: [],
    labels: [],
    settings: {
      elementsVisible: true,
      labelsVisible: true,
      squareGridVisible: true,
      hexGridVisible: false,
      hexSizePercent: 5,
      snapToGrid: false,
      elementResizingEnabled: true,
      labelResizingEnabled: true,
      labelBordersEnabled: true,
    },
  };
}

export function replaceMapMakerBaseTiles(
  project: MapMakerProject,
  cells: readonly MapMakerGridCell[],
  source: MapMakerImageSource,
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const selectedCells = requireSelectedCells(currentProject, cells);
  const validSource = requireMapMakerImageSource(source);
  const selectedKeys = new Set(selectedCells.map((cell) => `${cell.column}:${cell.row}`));
  const baseTiles = currentProject.baseTiles.map((tile) => {
    if (!selectedKeys.has(`${tile.column}:${tile.row}`)) return tile;
    return {
      ...tile,
      source: { ...validSource },
      rotation: 0 as const,
      flipHorizontal: false,
      flipVertical: false,
    };
  });
  return requireMapMakerProject({ ...currentProject, baseTiles });
}

export function transformMapMakerBaseTiles(
  project: MapMakerProject,
  cells: readonly MapMakerGridCell[],
  patch: MapMakerBaseTilePatch,
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const selectedCells = requireSelectedCells(currentProject, cells);
  const validPatch = requireMapMakerBaseTilePatch(patch);
  const selectedKeys = new Set(selectedCells.map((cell) => `${cell.column}:${cell.row}`));
  const baseTiles = currentProject.baseTiles.map((tile) =>
    selectedKeys.has(`${tile.column}:${tile.row}`) ? { ...tile, ...validPatch } : tile,
  );
  return requireMapMakerProject({ ...currentProject, baseTiles });
}

export function resetMapMakerBaseTiles(
  project: MapMakerProject,
  cells: readonly MapMakerGridCell[],
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const selectedCells = requireSelectedCells(currentProject, cells);
  const selectedKeys = new Set(selectedCells.map((cell) => `${cell.column}:${cell.row}`));
  const baseTiles = currentProject.baseTiles.map((tile) =>
    selectedKeys.has(`${tile.column}:${tile.row}`) ? createSeaTile(tile.column, tile.row) : tile,
  );
  return requireMapMakerProject({ ...currentProject, baseTiles });
}

export function resetMapMakerBase(project: MapMakerProject): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  return requireMapMakerProject({
    ...currentProject,
    baseTiles: createSeaTiles(currentProject.columns, currentProject.rows),
  });
}

export function resetMapMakerProject(project: MapMakerProject): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  return requireMapMakerProject({
    ...currentProject,
    baseTiles: createSeaTiles(currentProject.columns, currentProject.rows),
    elements: [],
    labels: [],
  });
}

export function resizeMapMakerProject(
  project: MapMakerProject,
  columns: number,
  rows: number,
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const validColumns = requireMapMakerColumns(columns);
  const validRows = requireMapMakerRows(rows);
  return requireMapMakerProject({
    ...currentProject,
    columns: validColumns,
    rows: validRows,
    baseTiles: createSeaTiles(validColumns, validRows),
    elements: [],
    labels: fitMapMakerLabelsToSize(currentProject.labels, validColumns, validRows),
  });
}

export function addMapMakerElement(project: MapMakerProject, element: MapMakerElement): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  return requireMapMakerProject({ ...currentProject, elements: [...currentProject.elements, element] });
}

export function updateMapMakerElements(
  project: MapMakerProject,
  elementIds: readonly string[],
  patch: MapMakerElementPatch,
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const selectedIds = requireSelectedEntityIds(elementIds, 'element');
  const existingIds = new Set(currentProject.elements.map((element) => element.id));
  requireAllIdsExist(selectedIds, existingIds, 'element');
  const validPatch = requireMapMakerElementPatch(patch);
  const selectedIdsSet = new Set(selectedIds);
  const elements = currentProject.elements.map((element) =>
    selectedIdsSet.has(element.id)
      ? { ...element, ...validPatch, source: validPatch.source ? { ...validPatch.source } : { ...element.source } }
      : element,
  );
  return requireMapMakerProject({ ...currentProject, elements });
}

export function removeMapMakerElements(
  project: MapMakerProject,
  elementIds: readonly string[],
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const selectedIds = requireSelectedEntityIds(elementIds, 'element');
  const existingIds = new Set(currentProject.elements.map((element) => element.id));
  requireAllIdsExist(selectedIds, existingIds, 'element');
  const selectedIdsSet = new Set(selectedIds);
  return requireMapMakerProject({
    ...currentProject,
    elements: currentProject.elements.filter((element) => !selectedIdsSet.has(element.id)),
  });
}

export function clearMapMakerElementLayer(
  project: MapMakerProject,
  layer: MapMakerElementLayer,
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const validLayer = requireMapMakerLayer(layer);
  return requireMapMakerProject({
    ...currentProject,
    elements: currentProject.elements.filter((element) => element.layer !== validLayer),
  });
}

export function addMapMakerLabel(project: MapMakerProject, label: MapMakerLabel): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  return requireMapMakerProject({ ...currentProject, labels: [...currentProject.labels, label] });
}

export function updateMapMakerLabels(
  project: MapMakerProject,
  labelIds: readonly string[],
  patch: MapMakerLabelPatch,
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const selectedIds = requireSelectedEntityIds(labelIds, 'text label');
  const existingIds = new Set(currentProject.labels.map((label) => label.id));
  requireAllIdsExist(selectedIds, existingIds, 'text label');
  const validPatch = requireMapMakerLabelPatch(patch);
  const selectedIdsSet = new Set(selectedIds);
  const labels = currentProject.labels.map((label) =>
    selectedIdsSet.has(label.id) ? { ...label, ...validPatch } : label,
  );
  return requireMapMakerProject({ ...currentProject, labels });
}

export function removeMapMakerLabels(
  project: MapMakerProject,
  labelIds: readonly string[],
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const selectedIds = requireSelectedEntityIds(labelIds, 'text label');
  const existingIds = new Set(currentProject.labels.map((label) => label.id));
  requireAllIdsExist(selectedIds, existingIds, 'text label');
  const selectedIdsSet = new Set(selectedIds);
  return requireMapMakerProject({
    ...currentProject,
    labels: currentProject.labels.filter((label) => !selectedIdsSet.has(label.id)),
  });
}

export function clearMapMakerLabels(project: MapMakerProject): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  return requireMapMakerProject({ ...currentProject, labels: [] });
}

export function updateMapMakerSettings(
  project: MapMakerProject,
  patch: MapMakerProjectSettingsPatch,
): MapMakerProject {
  const currentProject = requireMapMakerProject(project);
  const validPatch = requireMapMakerSettingsPatch(patch);
  const settings: MapMakerProjectSettings = { ...currentProject.settings, ...validPatch };
  return requireMapMakerProject({ ...currentProject, settings });
}
