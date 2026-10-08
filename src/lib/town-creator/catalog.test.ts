import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  TOWN_ASSETS,
  TOWN_CATEGORIES,
  TOWN_MATERIALS,
  getTownAsset,
  getTownAssetVariant,
} from './catalog';

type ManifestVariant = {
  material: string;
  svg: string;
  png: string;
  thumbnail: string;
  sha256Svg: string;
  sha256Png: string;
  sha256Thumbnail: string;
};

type ManifestAsset = {
  id: string;
  variants: ManifestVariant[];
};

type TownManifest = {
  assets: ManifestAsset[];
};

function readTownManifest(): TownManifest {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), 'public/town-creator/manifest.json'), 'utf8'),
  ) as TownManifest;
}

function hashFile(relativePath: string): string {
  return createHash('sha256')
    .update(readFileSync(resolve(process.cwd(), 'public/town-creator', relativePath)))
    .digest('hex');
}

function listAssetFiles(): string[] {
  const assetFiles: string[] = [];
  for (const directory of ['svg', 'png', 'thumbs']) {
    const root = resolve(process.cwd(), 'public/town-creator', directory);
    for (const category of readdirSync(root)) {
      const categoryPath = resolve(root, category);
      if (!statSync(categoryPath).isDirectory()) {
        continue;
      }
      for (const filename of readdirSync(categoryPath)) {
        if (filename.endsWith('.svg') || filename.endsWith('.png')) {
          assetFiles.push(`${directory}/${category}/${filename}`);
        }
      }
    }
  }
  return assetFiles.sort();
}

describe('town catalog', () => {
  it('exposes the complete bilingual categories, materials, and variant counts', () => {
    expect(TOWN_ASSETS).toHaveLength(192);
    expect(TOWN_CATEGORIES.map((category) => category.id)).toEqual([
      'buildings',
      'defenses',
      'props',
      'roads',
      'terrain',
      'prefabs',
      'nature',
    ]);
    expect(TOWN_CATEGORIES.reduce((total, category) => total + category.base, 0)).toBe(192);
    expect(TOWN_ASSETS.reduce((total, asset) => total + asset.variants.length, 0)).toBe(486);
    expect(TOWN_MATERIALS.map((material) => material.id)).toEqual([
      'wood',
      'stone',
      'clay',
      'sandstone',
    ]);
    for (const material of TOWN_MATERIALS) {
      expect(material.name.en.trim()).not.toBe('');
      expect(material.name.zh.trim()).not.toBe('');
    }
  });

  it('references every manifest file with its published path and recorded hash', () => {
    const manifest = readTownManifest();
    const manifestAssets = new Map(manifest.assets.map((asset) => [asset.id, asset]));
    const expectedFiles: string[] = [];

    for (const asset of TOWN_ASSETS) {
      const manifestAsset = manifestAssets.get(asset.id);
      expect(manifestAsset, asset.id).toBeDefined();
      if (manifestAsset === undefined) {
        throw new Error(`Missing manifest asset ${asset.id}.`);
      }

      expect(asset.variants).toHaveLength(manifestAsset.variants.length);
      for (const variant of manifestAsset.variants) {
        expectedFiles.push(variant.svg, variant.png, variant.thumbnail);
        const catalogVariant = getTownAssetVariant(asset.id, variant.material as never);
        expect(catalogVariant.svg, `${asset.id}:${variant.material}`).toBe(
          `/town-creator/${variant.svg}`,
        );
        expect(catalogVariant.png, `${asset.id}:${variant.material}`).toBe(
          `/town-creator/${variant.png}`,
        );
        expect(catalogVariant.thumbnail, `${asset.id}:${variant.material}`).toBe(
          `/town-creator/${variant.thumbnail}`,
        );
        expect(hashFile(variant.svg), `${asset.id}:${variant.material}:svg`).toBe(variant.sha256Svg);
        expect(hashFile(variant.png), `${asset.id}:${variant.material}:png`).toBe(variant.sha256Png);
        expect(hashFile(variant.thumbnail), `${asset.id}:${variant.material}:thumbnail`).toBe(
          variant.sha256Thumbnail,
        );
      }
    }

    expect(listAssetFiles()).toEqual(expectedFiles.sort());
  });

  it('retrieves fixed neutral assets and rejects unsupported or unknown variants', () => {
    const fixedAsset = TOWN_ASSETS.find((asset) => asset.materials.length === 0);
    const materialAsset = TOWN_ASSETS.find((asset) => asset.materials.length > 0);
    expect(fixedAsset).toBeDefined();
    expect(materialAsset).toBeDefined();
    if (fixedAsset === undefined || materialAsset === undefined) {
      throw new Error('Expected both fixed and material-aware town assets.');
    }

    expect(getTownAsset(fixedAsset.id)).toEqual(fixedAsset);
    expect(getTownAssetVariant(fixedAsset.id, 'neutral').material).toBe('neutral');
    expect(() => getTownAssetVariant(fixedAsset.id, 'wood')).toThrow('does not support material');
    expect(() => getTownAssetVariant(materialAsset.id, 'neutral')).toThrow('does not support material');
    expect(() => getTownAssetVariant(materialAsset.id, 'glass' as never)).toThrow('Invalid town material');
    expect(() => getTownAsset('missing-town-asset')).toThrow('missing-town-asset');
  });
});
