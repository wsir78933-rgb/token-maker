import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getEmblemCatalogAsset, listEmblemCatalogAssets } from './catalog';
import type { EmblemAssetCategory } from './types';

const CATALOG_CATEGORIES = ['body', 'detail', 'crest'] as const;

describe('emblem catalog', () => {
  it.each([
    ['body', 6],
    ['detail', 6],
    ['crest', 8],
  ] as const)('lists the original %s assets with at least %i entries', (category, minimum) => {
    const assets = listEmblemCatalogAssets(category);

    expect(assets.length).toBeGreaterThanOrEqual(minimum);
    for (const asset of assets) {
      expect(asset.category, asset.id).toBe(category);
      expect(asset.id, asset.id).toMatch(new RegExp(`^${category}-[a-z0-9-]+$`));
      expect(asset.publicPath, asset.id).toBe(`/emblem-creator/original/${asset.id}.svg`);
    }
  });

  it('keeps ids and paths unique, dimensions positive, and both locale names nonempty', () => {
    const assets = CATALOG_CATEGORIES.flatMap(listEmblemCatalogAssets);

    expect(new Set(assets.map((asset) => asset.id)).size).toBe(assets.length);
    expect(new Set(assets.map((asset) => asset.publicPath)).size).toBe(assets.length);
    for (const asset of assets) {
      expect(Number.isFinite(asset.width), asset.id).toBe(true);
      expect(Number.isFinite(asset.height), asset.id).toBe(true);
      expect(asset.width, asset.id).toBeGreaterThan(0);
      expect(asset.height, asset.id).toBeGreaterThan(0);
      expect(asset.name.en.trim().length, asset.id).toBeGreaterThan(0);
      expect(asset.name.zh.trim().length, asset.id).toBeGreaterThan(0);
      expect(asset.name.en, asset.id).toMatch(/[A-Za-z]/);
      expect(asset.name.zh, asset.id).toMatch(/\p{Script=Han}/u);
    }
  });

  it('references real files only in the original directory with matching SVG dimensions', () => {
    const originalDirectory = realpathSync(resolve(process.cwd(), 'public/emblem-creator/original'));
    const assets = CATALOG_CATEGORIES.flatMap(listEmblemCatalogAssets);
    const originalFiles = readdirSync(originalDirectory).filter((filename) => filename.endsWith('.svg'));

    expect(assets.map((asset) => `${asset.id}.svg`).sort()).toEqual(originalFiles.sort());
    for (const asset of assets) {
      expect(asset.publicPath, asset.id).toMatch(/^\/emblem-creator\/original\/[a-z0-9-]+\.svg$/);
      const filePath = resolve(process.cwd(), 'public', asset.publicPath.slice(1));
      expect(realpathSync(filePath).startsWith(`${originalDirectory}${sep}`), asset.id).toBe(true);
      expect(statSync(filePath).isFile(), asset.id).toBe(true);

      const svg = readFileSync(filePath, 'utf8');
      const width = svg.match(/<svg\b[^>]*\bwidth="([^"]+)"/);
      const height = svg.match(/<svg\b[^>]*\bheight="([^"]+)"/);
      expect(width, asset.id).not.toBeNull();
      expect(height, asset.id).not.toBeNull();
      expect(Number(width?.[1]), asset.id).toBe(asset.width);
      expect(Number(height?.[1]), asset.id).toBe(asset.height);
    }
  });

  it('retrieves each listed asset by its exact id', () => {
    for (const category of CATALOG_CATEGORIES) {
      for (const asset of listEmblemCatalogAssets(category)) {
        expect(getEmblemCatalogAsset(asset.id)).toEqual(asset);
      }
    }
  });

  it.each(['missing-emblem', '', '__proto__', 'toString', 'constructor'])(
    'rejects the unknown id "%s" and includes it in the error',
    (assetId) => {
      expect(() => getEmblemCatalogAsset(assetId)).toThrow(`Unknown emblem catalog asset id: ${assetId}`);
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
