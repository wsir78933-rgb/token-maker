import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  listWeaponPieceIds,
  WEAPON_CATEGORIES,
} from '@/lib/weapon-creator/catalog';
import { WEAPON_EXPORT_SCALE } from '@/lib/weapon-creator/constants';
import { weaponPieceImagePath } from '@/lib/weapon-creator/icons';

type HighResolutionSource = {
  publicPath: string;
  sourceUrl: string;
  sha256: string;
  width: number;
  height: number;
};

type HighResolutionOutput = {
  publicPath: string;
  sha256: string;
  width: number;
  height: number;
};

type HighResolutionManifestAsset = {
  id: string;
  source: HighResolutionSource;
  output: HighResolutionOutput;
  scale: number;
};

type HighResolutionManifest = {
  version: number;
  scale: number;
  sourceManifestPath: string;
  assets: HighResolutionManifestAsset[];
};

type PngMetadata = {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
};

const HIGH_RESOLUTION_ASSET_DIRECTORY = join(process.cwd(), 'public/weapon-creator/high-resolution');
const HIGH_RESOLUTION_MANIFEST_PATH = join(
  HIGH_RESOLUTION_ASSET_DIRECTORY,
  'high-resolution-manifest.json',
);
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const RGBA_COLOR_TYPE = 6;
const EIGHT_BIT_DEPTH = 8;

function readHighResolutionManifest(): HighResolutionManifest {
  return JSON.parse(readFileSync(HIGH_RESOLUTION_MANIFEST_PATH, 'utf8')) as HighResolutionManifest;
}

function readPngMetadata(bytes: Buffer, assetId: string): PngMetadata {
  if (bytes.length < 29 || !bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`Asset ${JSON.stringify(assetId)} is not a valid PNG with an IHDR header.`);
  }
  if (bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error(`Asset ${JSON.stringify(assetId)} has an invalid PNG IHDR chunk.`);
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bitDepth: bytes[24],
    colorType: bytes[25],
  };
}

function expectedWeaponPieceIds(): string[] {
  return WEAPON_CATEGORIES.flatMap((category) => listWeaponPieceIds(category));
}

function expectedOutputFileNames(manifest: HighResolutionManifest): string[] {
  return manifest.assets.map((asset) => `${asset.id}-${WEAPON_EXPORT_SCALE}x.png`).sort();
}

describe('weapon high-resolution assets', () => {
  it('contains every catalog piece with matching output path, 4x RGBA dimensions, and SHA256', () => {
    const manifest = readHighResolutionManifest();
    const expectedPieceIdList = expectedWeaponPieceIds().sort();
    const manifestPieceIdList = manifest.assets.map((asset) => asset.id).sort();

    expect(manifest.version).toBe(1);
    expect(manifest.scale).toBe(WEAPON_EXPORT_SCALE);
    expect(manifest.sourceManifestPath).toBe('/weapon-creator/asset-manifest.json');
    expect(manifest.assets).toHaveLength(expectedPieceIdList.length);
    expect(new Set(manifestPieceIdList).size).toBe(manifestPieceIdList.length);
    expect(manifestPieceIdList).toEqual(expectedPieceIdList);

    for (const asset of manifest.assets) {
      const outputBytes = readFileSync(
        join(HIGH_RESOLUTION_ASSET_DIRECTORY, `${asset.id}-${WEAPON_EXPORT_SCALE}x.png`),
      );
      const pngMetadata = readPngMetadata(outputBytes, asset.id);
      const outputChecksum = createHash('sha256').update(outputBytes).digest('hex');

      expect(asset.output.publicPath).toBe(weaponPieceImagePath(asset.id));
      expect(asset.source.publicPath).toBe(`/weapon-creator/rollforfantasy/${asset.id}.png`);
      expect(asset.source.sourceUrl).toBe(`https://rollforfantasy.com/images/weapons/${asset.id}.png`);
      expect(asset.source.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(asset.output.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(asset.scale).toBe(WEAPON_EXPORT_SCALE);
      expect(asset.output.width).toBe(asset.source.width * WEAPON_EXPORT_SCALE);
      expect(asset.output.height).toBe(asset.source.height * WEAPON_EXPORT_SCALE);
      expect(pngMetadata).toEqual({
        width: asset.output.width,
        height: asset.output.height,
        bitDepth: EIGHT_BIT_DEPTH,
        colorType: RGBA_COLOR_TYPE,
      });
      expect(outputChecksum).toBe(asset.output.sha256);
    }
  });

  it('has no unmanifested or missing high-resolution PNG files', () => {
    const manifest = readHighResolutionManifest();
    const diskFileNames = readdirSync(HIGH_RESOLUTION_ASSET_DIRECTORY)
      .filter((fileName) => fileName.endsWith('.png'))
      .sort();

    expect(diskFileNames).toEqual(expectedOutputFileNames(manifest));
  });
});
