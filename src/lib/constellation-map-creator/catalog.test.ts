import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  CONSTELLATION_ASSET_CATEGORIES,
  CONSTELLATION_ASSET_COUNT_PER_CATEGORY,
  CONSTELLATION_ASSET_TOTAL_COUNT,
  getConstellationAsset,
  getConstellationAssets,
} from './catalog';
import { CONSTELLATION_THEME_NAMES } from './theme-names';
import type { ConstellationAsset, ConstellationAssetCategory } from './types';

type ManifestAsset = {
  id: string;
  category: ConstellationAssetCategory;
  index: number;
  filename: string;
  publicPath: string;
  sha256: string;
  width: number;
  height: number;
  byteLength: number;
};

type AssetManifest = {
  version: number;
  source: { type: string; description: string };
  assetDirectory: string;
  star: {
    id: string;
    filename: string;
    publicPath: string;
    sha256: string;
    width: number;
    height: number;
    byteLength: number;
  };
  assets: ManifestAsset[];
};

const ASSET_ROOT = resolve(process.cwd(), 'public/constellation-map-creator');

function readConstellationSvg(asset: ConstellationAsset): string {
  return readFileSync(resolve(process.cwd(), 'public', asset.src.slice(1)), 'utf8');
}

function extractSvgGroup(svgMarkup: string, groupId: string, assetId: string): string {
  const groupPattern = new RegExp(`<g\\b[^>]*\\bid=["']${groupId}["'][^>]*>([\\s\\S]*?)</g>`);
  const groupMatch = svgMarkup.match(groupPattern);

  if (groupMatch?.[1] === undefined) {
    throw new Error(`Constellation asset ${JSON.stringify(assetId)} is missing SVG group ${JSON.stringify(groupId)}.`);
  }

  return groupMatch[1];
}

function extractSvgAttribute(attributeMarkup: string, attributeName: string, assetId: string): string {
  const attributePattern = new RegExp(`\\b${attributeName}=["']([^"']+)["']`);
  const attributeMatch = attributeMarkup.match(attributePattern);

  if (attributeMatch?.[1] === undefined) {
    throw new Error(
      `Constellation asset ${JSON.stringify(assetId)} has a star circle without ${JSON.stringify(attributeName)}.`,
    );
  }

  return attributeMatch[1];
}

function extractStarCircleCoordinates(starsGroupMarkup: string, assetId: string): string[] {
  const circleMatches = [...starsGroupMarkup.matchAll(/<circle\b([^>]*?)\/?>(?:<\/circle>)?/g)];

  if (circleMatches.length === 0) {
    throw new Error(`Constellation asset ${JSON.stringify(assetId)} has no circles in its stars group.`);
  }

  return circleMatches.map((circleMatch) => {
    const circleAttributes = circleMatch[1];
    if (circleAttributes === undefined) {
      throw new Error(`Constellation asset ${JSON.stringify(assetId)} has an unreadable star circle.`);
    }

    const centerX = extractSvgAttribute(circleAttributes, 'cx', assetId);
    const centerY = extractSvgAttribute(circleAttributes, 'cy', assetId);
    const radius = extractSvgAttribute(circleAttributes, 'r', assetId);
    return `${centerX}|${centerY}|${radius}`;
  });
}

function readManifest(): AssetManifest {
  return JSON.parse(
    readFileSync(resolve(ASSET_ROOT, 'asset-manifest.json'), 'utf8'),
  ) as AssetManifest;
}

describe('constellation asset catalog', () => {
  it('exposes 61 original assets in each of the three categories', () => {
    expect(CONSTELLATION_ASSET_CATEGORIES).toEqual(['image', 'plain', 'line']);
    expect(CONSTELLATION_ASSET_TOTAL_COUNT).toBe(183);

    const assets = CONSTELLATION_ASSET_CATEGORIES.flatMap((category) =>
      getConstellationAssets(category),
    );
    expect(assets).toHaveLength(CONSTELLATION_ASSET_TOTAL_COUNT);
    expect(new Set(assets.map((asset) => asset.id)).size).toBe(183);
    expect(new Set(assets.map((asset) => asset.src)).size).toBe(183);

    for (const category of CONSTELLATION_ASSET_CATEGORIES) {
      const categoryAssets = getConstellationAssets(category);
      expect(categoryAssets).toHaveLength(CONSTELLATION_ASSET_COUNT_PER_CATEGORY);
      expect(categoryAssets[0]?.id).toBe(`${category}-1`);
      expect(categoryAssets.at(-1)?.id).toBe(`${category}-61`);
    }
  });

  it('keeps all local SVG files and independent manifest hashes aligned', () => {
    const manifest = readManifest();
    expect(manifest.version).toBe(1);
    expect(manifest.source.type).toBe('original');
    expect(manifest.assets).toHaveLength(183);
    expect(new Set(manifest.assets.map((asset) => asset.sha256)).size).toBe(183);

    const assetFiles = CONSTELLATION_ASSET_CATEGORIES.flatMap((category) =>
      readdirSync(resolve(ASSET_ROOT, 'assets', category)).sort(),
    );
    expect(assetFiles).toHaveLength(183);
    for (const manifestAsset of manifest.assets) {
      const filePath = resolve(ASSET_ROOT, manifestAsset.filename);
      const bytes = readFileSync(filePath);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(manifestAsset.sha256);
      expect(bytes.toString('utf8')).not.toMatch(/<script|<image\b|(?:href|xlink:href)="(?:https?:|\/\/)/i);
      expect(bytes.toString('utf8')).toMatch(/^<svg\b[\s\S]*<\/svg>\n$/);
    }

    const starBytes = readFileSync(resolve(ASSET_ROOT, manifest.star.filename));
    expect(createHash('sha256').update(starBytes).digest('hex')).toBe(manifest.star.sha256);
    expect(starBytes.toString('utf8')).not.toMatch(/<script|<image\b|(?:href|xlink:href)="(?:https?:|\/\/)/i);
  });

  it('keeps semantic theme names and matching star positions across the three variants', () => {
    expect(CONSTELLATION_THEME_NAMES).toHaveLength(CONSTELLATION_ASSET_COUNT_PER_CATEGORY);
    expect(CONSTELLATION_THEME_NAMES.map((themeName) => themeName.index)).toEqual(
      Array.from({ length: CONSTELLATION_ASSET_COUNT_PER_CATEGORY }, (_, offset) => offset + 1),
    );
    expect(new Set(CONSTELLATION_THEME_NAMES.map((themeName) => themeName.nameEn)).size).toBe(
      CONSTELLATION_ASSET_COUNT_PER_CATEGORY,
    );
    expect(new Set(CONSTELLATION_THEME_NAMES.map((themeName) => themeName.nameZh)).size).toBe(
      CONSTELLATION_ASSET_COUNT_PER_CATEGORY,
    );

    for (const themeName of CONSTELLATION_THEME_NAMES) {
      expect(themeName.nameEn.trim()).toBe(themeName.nameEn);
      expect(themeName.nameZh.trim()).toBe(themeName.nameZh);
      expect(themeName.nameEn).not.toMatch(/^Constellation\s+\d+$/i);
      expect(themeName.nameZh).not.toMatch(/^星座\s*\d+$/);
      expect(themeName.group.trim()).not.toBe('');
    }

    for (let index = 1; index <= CONSTELLATION_ASSET_COUNT_PER_CATEGORY; index += 1) {
      const imageAsset = getConstellationAsset(`image-${String(index)}`);
      const plainAsset = getConstellationAsset(`plain-${String(index)}`);
      const lineAsset = getConstellationAsset(`line-${String(index)}`);
      const imageSvg = readConstellationSvg(imageAsset);
      const plainSvg = readConstellationSvg(plainAsset);
      const lineSvg = readConstellationSvg(lineAsset);
      const imageStars = extractSvgGroup(imageSvg, 'stars', imageAsset.id);
      const plainStars = extractSvgGroup(plainSvg, 'stars', plainAsset.id);
      const lineStars = extractSvgGroup(lineSvg, 'stars', lineAsset.id);

      expect(extractStarCircleCoordinates(imageStars, imageAsset.id)).toEqual(
        extractStarCircleCoordinates(plainStars, plainAsset.id),
      );
      expect(extractStarCircleCoordinates(imageStars, imageAsset.id)).toEqual(
        extractStarCircleCoordinates(lineStars, lineAsset.id),
      );
      expect(imageSvg).toMatch(/<g\b[^>]*\bid=["']illustration["']/);
      expect(imageSvg).not.toMatch(/<g\b[^>]*\bid=["']connections["']/);
      expect(plainSvg).not.toMatch(/<g\b[^>]*\bid=["']illustration["']/);
      expect(plainSvg).not.toMatch(/<g\b[^>]*\bid=["']connections["']/);
      expect(lineSvg).not.toMatch(/<g\b[^>]*\bid=["']illustration["']/);
      expect(lineSvg).toMatch(/<g\b[^>]*\bid=["']connections["']/);
    }
  });

  it('rejects stars and unknown constellation asset ids', () => {
    expect(() => getConstellationAsset('star')).toThrow('image, plain, or line asset');
    expect(() => getConstellationAsset('plain-62')).toThrow('Unknown constellation asset id');
    expect(() => getConstellationAssets('stars' as ConstellationAssetCategory)).toThrow(
      'must be image, plain, or line',
    );
  });
});
