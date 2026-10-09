import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  MAP_MAKER_ASSET_CATEGORIES,
  MAP_MAKER_ASSET_ID_ALIASES,
  MAP_MAKER_COASTLINE_GROUPS,
  MAP_MAKER_DEFAULT_SEA_ASSET_ID,
  getMapMakerAsset,
  getMapMakerAssetSrc,
  getMapMakerAssets,
} from './catalog';
import type { MapMakerAsset, MapMakerAssetCategory } from './types';

const EXPECTED_CATEGORY_COUNTS: Readonly<Record<MapMakerAssetCategory, number>> = {
  coastline: 1082,
  geography: 97,
  structures: 94,
  water: 70,
};
const EXPECTED_PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const EXPECTED_EDGE_SIGNATURES = new Set(['-3', '-2', '-1', '0', '1', '2', '3', '4']);

function getAssetFiles(assets: readonly MapMakerAsset[]): Set<string> {
  const paths = new Set<string>();
  for (const asset of assets) {
    paths.add(asset.src);
    if (asset.tileSrc) paths.add(asset.tileSrc);
    if (asset.previewSrc) paths.add(asset.previewSrc);
  }
  return paths;
}

function readLocalPng(publicPath: string): Buffer {
  if (!publicPath.startsWith('/map-maker/assets/')) {
    throw new Error(`Map-maker asset path must stay under /map-maker/assets/: ${JSON.stringify(publicPath)}`);
  }
  const absolutePath = resolve(process.cwd(), 'public', publicPath.slice(1));
  const imageBytes = readFileSync(absolutePath);
  if (!imageBytes.subarray(0, 8).equals(EXPECTED_PNG_SIGNATURE)) {
    throw new Error(`Map-maker asset is not a PNG: ${absolutePath}`);
  }
  if (imageBytes.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error(`Map-maker PNG has no IHDR chunk: ${absolutePath}`);
  }
  if (imageBytes.readUInt32BE(16) === 0 || imageBytes.readUInt32BE(20) === 0) {
    throw new Error(`Map-maker PNG has invalid dimensions: ${absolutePath}`);
  }
  return imageBytes;
}

describe('map-maker asset catalog', () => {
  it('preserves all coastline groups and icon categories with stable IDs', () => {
    const assets = getMapMakerAssets();
    expect(MAP_MAKER_ASSET_CATEGORIES).toEqual(['coastline', 'geography', 'structures', 'water']);
    expect(assets).toHaveLength(1343);
    expect(new Set(assets.map((asset) => asset.id)).size).toBe(assets.length);

    for (const category of MAP_MAKER_ASSET_CATEGORIES) {
      expect(assets.filter((asset) => asset.category === category)).toHaveLength(
        EXPECTED_CATEGORY_COUNTS[category],
      );
    }

    expect(MAP_MAKER_COASTLINE_GROUPS).toHaveLength(12);
    for (const group of MAP_MAKER_COASTLINE_GROUPS) {
      expect(
        assets.filter((asset) => asset.category === 'coastline' && asset.coastlineGroup === group),
      ).toHaveLength(90);
    }
    expect(
      assets
        .filter((asset) => asset.category === 'coastline' && asset.coastlineGroup === undefined)
        .map((asset) => asset.id)
        .sort(),
    ).toEqual(['l0', 's0']);

    for (const asset of assets.filter((candidate) => candidate.category === 'coastline')) {
      expect(asset.connections, `Missing coast edge metadata for ${asset.id}`).toHaveLength(4);
      expect(asset.connections?.every((edge) => EXPECTED_EDGE_SIGNATURES.has(edge))).toBe(true);
    }
  });

  it('resolves real image variants and the water soft-404 alias explicitly', () => {
    expect(MAP_MAKER_DEFAULT_SEA_ASSET_ID).toBe('s0');
    expect(MAP_MAKER_ASSET_ID_ALIASES.as0).toBe('s0');
    expect(getMapMakerAsset('as0')).toBe(getMapMakerAsset('s0'));
    expect(getMapMakerAssetSrc('as0', 'tile')).toBe('/map-maker/assets/s0.png');
    expect(getMapMakerAssetSrc('am1', 'element')).toBe('/map-maker/assets/am1.png');
    expect(getMapMakerAssetSrc('am1', 'tile')).toBe('/map-maker/assets/m1.png');
    expect(getMapMakerAssetSrc('am1', 'preview')).toBe('/map-maker/assets/m1.png');
    expect(getMapMakerAsset('geography-land')).toMatchObject({
      category: 'geography',
      name: 'Land',
      src: '/map-maker/assets/l0.png',
    });
    expect(getMapMakerAsset('water-fill')).toMatchObject({
      category: 'water',
      name: 'Water',
      src: '/map-maker/assets/s0.png',
    });

    expect(getMapMakerAsset('br220').connections).toEqual(['2', '0', '0', '-2']);
    expect(getMapMakerAsset('br230').connections).toEqual(['2', '0', '0', '-1']);
    expect(getMapMakerAsset('b317').connections).toEqual(['4', '-3', '0', '-2']);
    expect(() => getMapMakerAsset('missing-map-piece')).toThrow('Unknown map-maker asset id: "missing-map-piece"');
  });

  it('keeps every referenced local image a valid PNG with catalog-matching natural dimensions', () => {
    const assets = getMapMakerAssets();
    const imagePaths = getAssetFiles(assets);
    expect(imagePaths.size).toBe(1600);

    for (const asset of assets) {
      const imageBytes = readLocalPng(asset.src);
      expect(imageBytes.readUInt32BE(16), `Incorrect width for ${asset.id}`).toBe(asset.width);
      expect(imageBytes.readUInt32BE(20), `Incorrect height for ${asset.id}`).toBe(asset.height);
    }
    for (const publicPath of imagePaths) {
      readLocalPng(publicPath);
    }
  });
});
