import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import {
  SOLAR_ASSET_CATEGORIES,
  SOLAR_ASSET_TOTAL_COUNT,
  getSolarAsset,
  listSolarAssets,
} from './catalog';
import type { SolarAsset, SolarAssetCategory } from './types';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ASSET_DIRECTORY = resolve(process.cwd(), 'public/solar-system-creator/rollforfantasy');
const SOURCE_MANIFEST_PATH = resolve(ASSET_DIRECTORY, 'source-manifest.json');

type SourceManifestAsset = {
  category: SolarAssetCategory;
  index: number;
  filename: string;
  sourceUrl: string;
  sha256: string;
  width: number;
  height: number;
  byteLength: number;
};

type SourceManifest = {
  sourcePage: string;
  assetDirectory: string;
  assets: SourceManifestAsset[];
};

function readSourceManifest(): SourceManifest {
  return JSON.parse(readFileSync(SOURCE_MANIFEST_PATH, 'utf8')) as SourceManifest;
}

function allSolarAssets(): SolarAsset[] {
  return SOLAR_ASSET_CATEGORIES.flatMap((category) => [...listSolarAssets(category)]);
}

describe('solar system asset catalog', () => {
  it('lists all six source categories and their 240 assets in order', () => {
    expect(SOLAR_ASSET_CATEGORIES).toEqual([
      'star',
      'type-1',
      'type-2',
      'type-3',
      'type-4',
      'type-5',
    ]);

    const assets = allSolarAssets();
    expect(SOLAR_ASSET_TOTAL_COUNT).toBe(240);
    expect(assets).toHaveLength(SOLAR_ASSET_TOTAL_COUNT);
    expect(new Set(assets.map((asset) => asset.id)).size).toBe(SOLAR_ASSET_TOTAL_COUNT);
    expect(new Set(assets.map((asset) => asset.src)).size).toBe(SOLAR_ASSET_TOTAL_COUNT);

    for (const [categoryIndex, category] of SOLAR_ASSET_CATEGORIES.entries()) {
      const categoryAssets = listSolarAssets(category);
      expect(categoryAssets).toHaveLength(40);
      expect(categoryAssets.map((asset) => asset.category)).toEqual(
        Array.from({ length: 40 }, () => category),
      );
      expect(categoryAssets.map((asset) => asset.index)).toEqual(
        Array.from({ length: 40 }, (_, index) => index + 1),
      );
      expect(categoryAssets[0]?.id).toBe(`${category}-1`);
      expect(categoryAssets.at(-1)?.id).toBe(`${category}-40`);
      expect(assets[categoryIndex * 40]?.id).toBe(`${category}-1`);
    }
  });

  it('keeps the source manifest, local filenames, PNG bytes, hashes, and decodable dimensions aligned', async () => {
    const sourceManifest = readSourceManifest();
    const assets = allSolarAssets();
    const sourceManifestByFilename = new Map(
      sourceManifest.assets.map((asset) => [asset.filename, asset]),
    );

    expect(sourceManifest.sourcePage).toBe(
      'https://rollforfantasy.com/tools/solar-system-creator.php',
    );
    expect(sourceManifest.assetDirectory).toBe('/solar-system-creator/rollforfantasy');
    expect(sourceManifest.assets).toHaveLength(SOLAR_ASSET_TOTAL_COUNT);
    expect(sourceManifest.assets.map((asset) => asset.category)).toEqual(
      assets.map((asset) => asset.category),
    );
    expect(sourceManifest.assets.map((asset) => asset.index)).toEqual(
      assets.map((asset) => asset.index),
    );

    const assetDirectory = realpathSync(ASSET_DIRECTORY);
    const expectedFilenames = assets.map((asset) => asset.src.slice(asset.src.lastIndexOf('/') + 1));
    const actualFilenames = readdirSync(assetDirectory)
      .filter((filename) => filename.endsWith('.png'))
      .sort();
    expect(actualFilenames).toEqual([...expectedFilenames].sort());

    for (const asset of assets) {
      const filename = asset.src.slice(asset.src.lastIndexOf('/') + 1);
      const sourceManifestAsset = sourceManifestByFilename.get(filename);
      expect(sourceManifestAsset, asset.id).toBeDefined();
      if (sourceManifestAsset === undefined) {
        throw new Error(`Missing source manifest record for ${asset.id} (${filename}).`);
      }

      expect(sourceManifestAsset.category, asset.id).toBe(asset.category);
      expect(sourceManifestAsset.index, asset.id).toBe(asset.index);
      expect(sourceManifestAsset.sourceUrl, asset.id).toMatch(
        /^https:\/\/rollforfantasy\.com\/images\/planets\/.+\.png$/,
      );

      const filePath = resolve(ASSET_DIRECTORY, filename);
      const realFilePath = realpathSync(filePath);
      expect(realFilePath.startsWith(`${assetDirectory}${sep}`), asset.id).toBe(true);
      expect(statSync(realFilePath).isFile(), asset.id).toBe(true);

      const bytes = readFileSync(realFilePath);
      expect(bytes.subarray(0, PNG_SIGNATURE.length), asset.id).toEqual(PNG_SIGNATURE);
      expect(bytes.toString('ascii', 12, 16), asset.id).toBe('IHDR');
      expect(bytes.readUInt32BE(16), asset.id).toBeGreaterThan(0);
      expect(bytes.readUInt32BE(20), asset.id).toBeGreaterThan(0);
      expect(createHash('sha256').update(bytes).digest('hex'), asset.id).toBe(
        sourceManifestAsset.sha256,
      );

      const metadata = await sharp(bytes).metadata();
      expect(metadata.format, asset.id).toBe('png');
      expect(metadata.width, asset.id).toBe(sourceManifestAsset.width);
      expect(metadata.height, asset.id).toBe(sourceManifestAsset.height);
      await sharp(bytes).raw().toBuffer();
    }
  });

  it('retrieves every canonical id and rejects unknown ids and categories', () => {
    for (const asset of allSolarAssets()) {
      expect(getSolarAsset(asset.id)).toEqual(asset);
    }

    for (const invalidId of ['star-0', 'type-6-1', '', '__proto__']) {
      expect(() => getSolarAsset(invalidId)).toThrow(`Unknown solar asset id: ${invalidId}`);
    }

    for (const invalidCategory of ['stars', '', null, undefined]) {
      expect(() => listSolarAssets(invalidCategory as SolarAssetCategory)).toThrow(
        `Invalid solar asset category: ${String(invalidCategory)}`,
      );
    }
  });
});
