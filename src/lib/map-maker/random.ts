import { getMapMakerAssets } from './catalog';
import { requireMapMakerProject } from './validation';
import type { MapMakerAsset, MapMakerBaseTile, MapMakerConnections, MapMakerProject } from './types';

const SEA_EDGE_SIGNATURE = '0';
const RANDOM_SEARCH_LIMIT = 100_000;

type RandomSource = () => number;

function requireRandomValue(randomSource: RandomSource): number {
  const receivedValue: unknown = randomSource();
  if (typeof receivedValue !== 'number' || !Number.isFinite(receivedValue) || receivedValue < 0 || receivedValue >= 1) {
    throw new Error(`Map Maker random source must return a finite number from 0 (inclusive) to 1 (exclusive). Received ${String(receivedValue)}.`);
  }
  return receivedValue;
}

function shuffleMapMakerAssets(assets: readonly MapMakerAsset[], randomSource: RandomSource): MapMakerAsset[] {
  const shuffledAssets = [...assets];
  for (let index = shuffledAssets.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(requireRandomValue(randomSource) * (index + 1));
    const currentAsset = shuffledAssets[index];
    const targetAsset = shuffledAssets[randomIndex];
    if (currentAsset === undefined || targetAsset === undefined) {
      throw new Error(`Map Maker random shuffle encountered an invalid index. Received index=${index}, target=${randomIndex}.`);
    }
    shuffledAssets[index] = targetAsset;
    shuffledAssets[randomIndex] = currentAsset;
  }
  return shuffledAssets;
}

function requireCoastlineTiles(): MapMakerAsset[] {
  const allAssets = getMapMakerAssets();
  const coastlines = allAssets.filter((asset) => asset.category === 'coastline' && asset.connections !== undefined);
  if (coastlines.length === 0) {
    throw new Error('Map Maker random generation requires coastline assets with edge metadata. Received 0 assets.');
  }
  const seenIds = new Set<string>();
  for (const asset of coastlines) {
    if (seenIds.has(asset.id)) {
      throw new Error(`Map Maker random coastline asset ids must be unique. Received duplicate ${JSON.stringify(asset.id)}.`);
    }
    seenIds.add(asset.id);
  }
  return coastlines;
}

function tileConnections(asset: MapMakerAsset): MapMakerConnections {
  const connections = asset.connections;
  if (connections === undefined) {
    throw new Error(`Map Maker coastline asset ${JSON.stringify(asset.id)} is missing edge metadata. Received undefined.`);
  }
  return connections;
}

function fitsMapMakerBoundary(
  connections: MapMakerConnections,
  column: number,
  row: number,
  columns: number,
  rows: number,
): boolean {
  const [north, east, south, west] = connections;
  return (
    (row !== 0 || north === SEA_EDGE_SIGNATURE) &&
    (column !== columns - 1 || east === SEA_EDGE_SIGNATURE) &&
    (row !== rows - 1 || south === SEA_EDGE_SIGNATURE) &&
    (column !== 0 || west === SEA_EDGE_SIGNATURE)
  );
}

function matchesPlacedNeighbors(
  candidateConnections: MapMakerConnections,
  column: number,
  row: number,
  columns: number,
  placedTiles: readonly (MapMakerAsset | null)[],
): boolean {
  if (row > 0) {
    const northTile = placedTiles[(row - 1) * columns + column];
    if (northTile === undefined || northTile === null) return false;
    if (candidateConnections[0] !== tileConnections(northTile)[2]) return false;
  }
  if (column > 0) {
    const westTile = placedTiles[row * columns + column - 1];
    if (westTile === undefined || westTile === null) return false;
    if (candidateConnections[3] !== tileConnections(westTile)[1]) return false;
  }
  return true;
}

function findCompatibleCandidates(
  assets: readonly MapMakerAsset[],
  column: number,
  row: number,
  project: MapMakerProject,
  placedTiles: readonly (MapMakerAsset | null)[],
): MapMakerAsset[] {
  return assets.filter((asset) => {
    const connections = tileConnections(asset);
    return (
      fitsMapMakerBoundary(connections, column, row, project.columns, project.rows) &&
      matchesPlacedNeighbors(connections, column, row, project.columns, placedTiles)
    );
  });
}

function searchCompatibleMap(
  assets: readonly MapMakerAsset[],
  project: MapMakerProject,
  randomSource: RandomSource,
): Array<MapMakerAsset | null> {
  const placedTiles: Array<MapMakerAsset | null> = Array.from({ length: project.columns * project.rows }, () => null);
  let visitedCandidates = 0;

  function placeNextCell(cellIndex: number): boolean {
    if (cellIndex === placedTiles.length) return true;
    const column = cellIndex % project.columns;
    const row = Math.floor(cellIndex / project.columns);
    const candidates = shuffleMapMakerAssets(
      findCompatibleCandidates(assets, column, row, project, placedTiles),
      randomSource,
    );

    for (const candidate of candidates) {
      visitedCandidates += 1;
      if (visitedCandidates > RANDOM_SEARCH_LIMIT) return false;
      placedTiles[cellIndex] = candidate;
      if (placeNextCell(cellIndex + 1)) return true;
      placedTiles[cellIndex] = null;
    }
    return false;
  }

  if (!placeNextCell(0)) {
    throw new Error(
      `Map Maker random generation could not tile a ${project.columns} × ${project.rows} map with matching coastline edges. Received ${visitedCandidates} candidate checks.`,
    );
  }
  return placedTiles;
}

function buildRandomBaseTiles(
  assets: readonly MapMakerAsset[],
  project: MapMakerProject,
  randomSource: RandomSource,
): MapMakerBaseTile[] {
  const selectedAssets = searchCompatibleMap(assets, project, randomSource);
  return selectedAssets.map((asset, cellIndex) => {
    if (asset === null) {
      throw new Error(`Map Maker random generation left a base cell empty. Received index ${cellIndex}.`);
    }
    return {
      column: cellIndex % project.columns,
      row: Math.floor(cellIndex / project.columns),
      source: { kind: 'asset', assetId: asset.id },
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
    };
  });
}

export function randomizeMapMakerBase(
  project: MapMakerProject,
  randomSource: RandomSource = Math.random,
): MapMakerProject {
  const validProject = requireMapMakerProject(project);
  if (typeof randomSource !== 'function') {
    throw new Error(`Map Maker random source must be a function. Received ${Object.prototype.toString.call(randomSource)}.`);
  }
  const coastlineAssets = requireCoastlineTiles();
  const baseTiles = buildRandomBaseTiles(coastlineAssets, validProject, randomSource);
  return requireMapMakerProject({ ...validProject, baseTiles });
}
