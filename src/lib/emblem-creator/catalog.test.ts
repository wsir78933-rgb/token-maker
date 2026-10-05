import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ROLLFORFANTASY_ASSETS } from './rollforfantasy-assets';
import { getEmblemCatalogAsset, listEmblemCatalogAssets } from './catalog';
import { LEGACY_EMBLEM_CATALOG_ASSETS } from './legacy-catalog';
import type { EmblemAssetCategory } from './types';

const EXPECTED_ASSET_GROUPS = [
  { sourceType: 'emblems', count: 40, category: 'body', englishLabel: 'Main body', chineseLabel: '主体' },
  { sourceType: 'detail', count: 40, category: 'detail', englishLabel: 'Detail', chineseLabel: '细节' },
  { sourceType: 'animal', count: 30, category: 'crest', englishLabel: 'Animal', chineseLabel: '动物' },
  { sourceType: 'weapon', count: 27, category: 'crest', englishLabel: 'Weapon', chineseLabel: '武器' },
  { sourceType: 'icon', count: 40, category: 'crest', englishLabel: 'Icon', chineseLabel: '图标' },
  { sourceType: 'misc', count: 38, category: 'crest', englishLabel: 'Misc', chineseLabel: '其他' },
] as const satisfies readonly {
  sourceType: string;
  count: number;
  category: EmblemAssetCategory;
  englishLabel: string;
  chineseLabel: string;
}[];

const CATALOG_CATEGORIES = ['body', 'detail', 'crest'] as const;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('emblem catalog', () => {
  it('lists the 215 RollForFantasy assets in natural source order', () => {
    expect(ROLLFORFANTASY_ASSETS).toHaveLength(215);

    const expectedPaths = EXPECTED_ASSET_GROUPS.flatMap(({ sourceType, count }) =>
      Array.from(
        { length: count },
        (_, index) => `/emblem-creator/rollforfantasy/${sourceType}${index + 1}.png`,
      ),
    );
    expect(ROLLFORFANTASY_ASSETS.map((asset) => asset.publicPath)).toEqual(expectedPaths);

    expect(listEmblemCatalogAssets('body')).toEqual(
      ROLLFORFANTASY_ASSETS.filter((asset) => asset.category === 'body'),
    );
    expect(listEmblemCatalogAssets('detail')).toEqual(
      ROLLFORFANTASY_ASSETS.filter((asset) => asset.category === 'detail'),
    );
    expect(listEmblemCatalogAssets('crest')).toEqual(
      ROLLFORFANTASY_ASSETS.filter((asset) => asset.category === 'crest'),
    );
    expect(listEmblemCatalogAssets('body')).toHaveLength(40);
    expect(listEmblemCatalogAssets('detail')).toHaveLength(40);
    expect(listEmblemCatalogAssets('crest')).toHaveLength(135);
  });

  it('keeps ids and paths unique and assigns the source names and categories', () => {
    expect(new Set(ROLLFORFANTASY_ASSETS.map((asset) => asset.id)).size).toBe(215);
    expect(new Set(ROLLFORFANTASY_ASSETS.map((asset) => asset.publicPath)).size).toBe(215);

    for (const asset of ROLLFORFANTASY_ASSETS) {
      const filename = asset.publicPath.slice(asset.publicPath.lastIndexOf('/') + 1);
      const match = filename.match(/^(emblems|detail|animal|weapon|icon|misc)(\d+)\.png$/);
      expect(match, asset.id).not.toBeNull();
      if (!match) {
        throw new Error(`Unexpected RollForFantasy asset filename: ${filename}`);
      }

      const [, sourceType, number] = match;
      const group = EXPECTED_ASSET_GROUPS.find((candidate) => candidate.sourceType === sourceType);
      expect(group, filename).toBeDefined();
      if (!group) {
        throw new Error(`Unknown RollForFantasy asset type in filename: ${filename}`);
      }

      expect(asset.id, filename).toBe(`rff-${sourceType}-${number}`);
      expect(asset.publicPath, asset.id).toBe(`/emblem-creator/rollforfantasy/${filename}`);
      expect(asset.category, asset.id).toBe(group.category);
      expect(asset.name.en, asset.id).toBe(`${group.englishLabel} ${number}`);
      expect(asset.name.zh, asset.id).toBe(`${group.chineseLabel} ${number}`);
      expect(asset.name.en.trim(), asset.id).not.toBe('');
      expect(asset.name.zh.trim(), asset.id).not.toBe('');
    }
  });

  it('references all local RollForFantasy PNGs with valid signatures and proportional IHDR dimensions', () => {
    const assetDirectory = realpathSync(
      resolve(process.cwd(), 'public/emblem-creator/rollforfantasy'),
    );
    const expectedFiles = ROLLFORFANTASY_ASSETS.map((asset) =>
      asset.publicPath.slice(asset.publicPath.lastIndexOf('/') + 1),
    ).sort();
    const actualFiles = readdirSync(assetDirectory)
      .filter((filename) => filename.endsWith('.png'))
      .sort();
    expect(actualFiles).toEqual(expectedFiles);

    for (const asset of ROLLFORFANTASY_ASSETS) {
      expect(asset.publicPath, asset.id).toMatch(
        /^\/emblem-creator\/rollforfantasy\/(emblems|detail|animal|weapon|icon|misc)\d+\.png$/,
      );
      const filePath = resolve(process.cwd(), 'public', asset.publicPath.slice(1));
      const realFilePath = realpathSync(filePath);
      expect(realFilePath.startsWith(`${assetDirectory}${sep}`), asset.id).toBe(true);
      expect(statSync(realFilePath).isFile(), asset.id).toBe(true);

      const pngBytes = readFileSync(realFilePath);
      expect(pngBytes.subarray(0, PNG_SIGNATURE.length), asset.id).toEqual(PNG_SIGNATURE);
      expect(pngBytes.toString('ascii', 12, 16), asset.id).toBe('IHDR');
      const actualWidth = pngBytes.readUInt32BE(16);
      const actualHeight = pngBytes.readUInt32BE(20);
      // Catalog dimensions are the logical viewport kept for legacy project layouts;
      // high-resolution PNGs may increase actual pixels while preserving their ratio.
      expect(actualWidth, asset.id).toBeGreaterThanOrEqual(asset.width);
      expect(actualHeight, asset.id).toBeGreaterThanOrEqual(asset.height);
      expect(actualWidth * asset.height, asset.id).toBe(actualHeight * asset.width);
      expect(asset.width, asset.id).toBeGreaterThan(0);
      expect(asset.height, asset.id).toBeGreaterThan(0);
    }
  });

  it('keeps all 20 legacy assets readable without listing them as new options', () => {
    expect(LEGACY_EMBLEM_CATALOG_ASSETS).toHaveLength(20);
    const listedAssets = CATALOG_CATEGORIES.flatMap(listEmblemCatalogAssets);
    const listedIds = listedAssets.map((asset) => asset.id);

    for (const asset of LEGACY_EMBLEM_CATALOG_ASSETS) {
      expect(getEmblemCatalogAsset(asset.id)).toEqual(asset);
      expect(listedIds).not.toContain(asset.id);
      expect(asset.publicPath, asset.id).toMatch(/^\/emblem-creator\/original\/[a-z0-9-]+\.svg$/);
      expect(asset.width, asset.id).toBe(100);
      expect(asset.height, asset.id).toBe(100);
    }
  });

  it('retrieves each listed RollForFantasy asset by its exact id', () => {
    for (const asset of ROLLFORFANTASY_ASSETS) {
      expect(getEmblemCatalogAsset(asset.id)).toEqual(asset);
    }
  });

  it.each(['missing-emblem', '', '__proto__', 'toString', 'constructor'])(
    'rejects the unknown id "%s" and includes it in the error',
    (assetId) => {
      expect(() => getEmblemCatalogAsset(assetId)).toThrow(
        `Unknown emblem catalog asset id: ${assetId}`,
      );
    },
  );

  it.each(['details', 'crests', 'BODY', '', null, undefined])(
    'rejects the invalid runtime category %s and includes it in the error',
    (category) => {
      expect(() => listEmblemCatalogAssets(category as EmblemAssetCategory)).toThrow(
        `Invalid emblem asset category: ${String(category)}`,
      );
    },
  );
});
