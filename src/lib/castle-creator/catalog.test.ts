import { describe, expect, it } from 'vitest';

import {
  CASTLE_CATEGORIES,
  castleAssetImagePath,
  getCastleAsset,
  listCastleAssets,
} from './catalog';
import {
  CASTLE_CREATOR_CATEGORY_COUNTS,
  CASTLE_CREATOR_DOOR_COUNT,
  CASTLE_CREATOR_TOTAL_ASSET_COUNT,
} from './constants';
import type { CastleAsset, CastleCategory, CastlePalette } from './types';

const EXPECTED_CATEGORIES: readonly CastleCategory[] = [
  'walls',
  'battlements',
  'towerRoofs',
  'buildings',
  'buildingRoofs',
  'gates',
];

const DEFAULT_PALETTE: CastlePalette = { building: 1, roof: 1 };

function expectDimensions(
  assets: readonly CastleAsset[],
  expectedRanges: readonly (readonly [number, number, number, number])[],
): void {
  for (const asset of assets) {
    const range = expectedRanges.find(
      ([firstNumber, lastNumber]) => asset.number >= firstNumber && asset.number <= lastNumber,
    );
    expect(range, asset.id).toBeDefined();
    if (!range) {
      continue;
    }

    expect([asset.width, asset.height], asset.id).toEqual([range[2], range[3]]);
  }
}

describe('castle catalog', () => {
  it('lists all six categories and 366 unique local asset ids', () => {
    expect(CASTLE_CATEGORIES).toEqual(EXPECTED_CATEGORIES);

    const listedAssets = CASTLE_CATEGORIES.flatMap((category) => listCastleAssets(category));
    expect(listedAssets).toHaveLength(CASTLE_CREATOR_TOTAL_ASSET_COUNT);
    expect(new Set(listedAssets.map((asset) => asset.id)).size).toBe(listedAssets.length);

    expect(listCastleAssets('walls')).toHaveLength(CASTLE_CREATOR_CATEGORY_COUNTS.walls);
    expect(listCastleAssets('battlements')).toHaveLength(CASTLE_CREATOR_CATEGORY_COUNTS.battlements);
    expect(listCastleAssets('towerRoofs')).toHaveLength(CASTLE_CREATOR_CATEGORY_COUNTS.towerRoofs);
    expect(listCastleAssets('buildings')).toHaveLength(CASTLE_CREATOR_CATEGORY_COUNTS.buildings);
    expect(listCastleAssets('buildingRoofs')).toHaveLength(CASTLE_CREATOR_CATEGORY_COUNTS.buildingRoofs);
    expect(listCastleAssets('gates')).toHaveLength(
      CASTLE_CREATOR_CATEGORY_COUNTS.gates + CASTLE_CREATOR_DOOR_COUNT,
    );
  });

  it('keeps the frozen ids and human-readable gate numbering', () => {
    expect(listCastleAssets('walls')[0]).toMatchObject({ id: 'walls-1', number: 1 });
    expect(listCastleAssets('walls').at(-1)).toMatchObject({ id: 'walls-94', number: 94 });
    expect(listCastleAssets('gates')[0]).toMatchObject({ id: 'gates-1', number: 1 });
    expect(listCastleAssets('gates')[17]).toMatchObject({ id: 'gates-18', number: 18 });
    expect(listCastleAssets('gates')[18]).toMatchObject({ id: 'doors-1', number: 19 });
    expect(listCastleAssets('gates').at(-1)).toMatchObject({ id: 'doors-9', number: 27 });

    for (const asset of CASTLE_CATEGORIES.flatMap((category) => listCastleAssets(category))) {
      expect(getCastleAsset(asset.id)).toBe(asset);
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
    }
  });

  it('keeps the verified native dimensions for every category', () => {
    expectDimensions(listCastleAssets('walls'), [
      [1, 3, 25, 48], [4, 6, 25, 62], [7, 16, 47, 48],
      [17, 26, 47, 62], [27, 60, 90, 48], [61, 94, 90, 62],
    ]);
    expectDimensions(listCastleAssets('battlements'), [
      [1, 25, 89, 21], [26, 50, 46, 21], [51, 70, 25, 21],
    ]);
    expectDimensions(listCastleAssets('towerRoofs'), [[1, 24, 34, 47]]);
    expectDimensions(listCastleAssets('buildings'), [
      [1, 18, 63, 48], [19, 20, 78, 48], [21, 37, 63, 27],
      [38, 49, 35, 48], [50, 67, 63, 48],
    ]);
    expectDimensions(listCastleAssets('buildingRoofs'), [
      [1, 11, 64, 35], [12, 22, 80, 40], [23, 33, 94, 35],
      [34, 44, 94, 41], [45, 54, 52, 41], [55, 64, 53, 35],
      [65, 74, 65, 35], [75, 84, 65, 42],
    ]);
    expectDimensions(listCastleAssets('gates').slice(0, 18), [
      [1, 3, 46, 48], [4, 6, 46, 62], [7, 9, 89, 48], [10, 18, 89, 62],
    ]);
    expectDimensions(listCastleAssets('gates').slice(18), [
      [19, 19, 34, 38], [20, 20, 30, 43], [21, 21, 34, 42],
      [22, 22, 34, 48], [23, 23, 32, 54], [24, 24, 34, 53],
      [25, 25, 56, 48], [26, 27, 56, 53],
    ]);
  });

  it('resolves only local palette-aware paths without requiring image files', () => {
    expect(castleAssetImagePath('walls-1', { building: 1, roof: 1 }))
      .toBe('/castle-creator/walls-1-building-1.webp');
    expect(castleAssetImagePath('walls-1', { building: 4, roof: 5 }))
      .toBe('/castle-creator/walls-1-building-4.webp');
    expect(castleAssetImagePath('buildingRoofs-1', { building: 1, roof: 5 }))
      .toBe('/castle-creator/buildingRoofs-1-roof-5.webp');
    expect(castleAssetImagePath('doors-1', { building: 4, roof: 5 }))
      .toBe('/castle-creator/doors-1.webp');

    for (const asset of CASTLE_CATEGORIES.flatMap((category) => listCastleAssets(category))) {
      const imagePath = castleAssetImagePath(asset.id, DEFAULT_PALETTE);
      expect(imagePath).toMatch(/^\/castle-creator\/[a-zA-Z0-9-]+\.webp$/);
      expect(imagePath).not.toMatch(/https?:\/\//);
    }
  });

  it('rejects invalid categories, asset ids, and palettes with their received values', () => {
    expect(() => listCastleAssets('tower-roofs' as CastleCategory)).toThrow(
      'Invalid Castle category. Received "tower-roofs".',
    );
    expect(() => listCastleAssets(null as unknown as CastleCategory)).toThrow(
      'Invalid Castle category. Received null.',
    );
    expect(() => getCastleAsset('walls-0')).toThrow(
      'Unknown Castle asset id: "walls-0".',
    );
    expect(() => getCastleAsset('__proto__')).toThrow(
      'Unknown Castle asset id: "__proto__".',
    );
    expect(() => getCastleAsset(7 as unknown as string)).toThrow(
      'Invalid Castle asset id. Received 7.',
    );
    expect(() => castleAssetImagePath('walls-1', null as unknown as CastlePalette)).toThrow(
      'Invalid Castle palette. Received null.',
    );
    expect(() => castleAssetImagePath('walls-1', { building: 0, roof: 1 } as unknown as CastlePalette)).toThrow(
      'Invalid Castle building palette color. Received 0.',
    );
    expect(() => castleAssetImagePath('walls-1', { building: 5, roof: 1 } as unknown as CastlePalette)).toThrow(
      'Invalid Castle building palette color. Received 5.',
    );
    expect(() => castleAssetImagePath('walls-1', { building: 1, roof: 6 } as unknown as CastlePalette)).toThrow(
      'Invalid Castle roof palette color. Received 6.',
    );
    expect(() => castleAssetImagePath('walls-1', { building: 1, roof: 1, extra: true } as unknown as CastlePalette)).toThrow(
      'Invalid Castle palette keys.',
    );
  });
});
