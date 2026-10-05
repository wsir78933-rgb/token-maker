import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import {
  listArmyFormationIconCategories,
  listArmyFormationIconsInCategory,
  type ArmyFormationIconCategoryId,
} from './icon-catalog';
import {
  getArmyFormationIconSpriteUrl,
  getArmyFormationIconThumbnailSvgMarkup,
} from './icon-thumbnails';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const spriteDirectory = resolve(repositoryRoot, 'public/army-formation-icons/sprites');
const sourceAssetRoot = '/army-formation-icons/roll-for-fantasy';
const iconCellWidth = 50;
const iconCellHeight = 30;
const rgbaChannelCount = 4;

function readCatalogAssetPath(iconId: string, svgMarkup: string): string {
  const assetMatch = svgMarkup.match(/<image\b[^>]*\bhref="([^"]+)"/);
  const assetUrl = assetMatch?.[1];
  if (assetUrl === undefined || !assetUrl.startsWith(`${sourceAssetRoot}/`)) {
    throw new Error(`Army formation icon ${JSON.stringify(iconId)} has an invalid source asset URL.`);
  }

  return resolve(repositoryRoot, 'public', assetUrl.slice(1));
}

async function readRawRgba(filePath: string) {
  const decodedImage = await sharp(await readFile(filePath))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (
    decodedImage.info.width !== iconCellWidth ||
    decodedImage.info.height !== iconCellHeight ||
    decodedImage.info.channels !== rgbaChannelCount
  ) {
    throw new Error(
      `Army formation test image must decode as ${iconCellWidth}x${iconCellHeight} RGBA. Received ${decodedImage.info.width}x${decodedImage.info.height} channels=${decodedImage.info.channels} for ${filePath}.`,
    );
  }

  return decodedImage.data;
}

describe('army formation icon thumbnails', () => {
  it('returns one normalized content-hashed sprite URL per category', async () => {
    const categoryIds = listArmyFormationIconCategories();
    const spriteUrls = categoryIds.map((categoryId) => getArmyFormationIconSpriteUrl(categoryId));
    const spriteNames = spriteUrls.map((spriteUrl) => spriteUrl.split('/').pop());

    expect(new Set(spriteUrls).size).toBe(categoryIds.length);
    expect(spriteUrls.every((spriteUrl) => /^\/army-formation-icons\/sprites\/(?:helmet|weapon|animal|vehicle|nato)-[0-9a-f]{16}\.png$/.test(spriteUrl))).toBe(true);
    expect(spriteUrls.some((spriteUrl) => spriteUrl.includes('//'))).toBe(false);

    const outputNames = (await readdir(spriteDirectory)).filter((name) => name.endsWith('.png')).sort();
    expect(outputNames).toEqual([...spriteNames].sort());

    for (const [index, spriteUrl] of spriteUrls.entries()) {
      const spriteBytes = await readFile(resolve(repositoryRoot, 'public', spriteUrl.slice(1)));
      const contentHash = createHash('sha256').update(spriteBytes).digest('hex').slice(0, 16);
      expect(spriteUrl).toContain(`-${contentHash}.png`);
      expect(categoryIds[index]).toBeDefined();
    }
  });

  it('builds a fixed 50 by 30 clipped view at each catalog position', () => {
    const categoryIds = listArmyFormationIconCategories();
    for (const categoryId of categoryIds) {
      const categoryIcons = listArmyFormationIconsInCategory(categoryId);
      const firstIcon = categoryIcons[0];
      const lastIcon = categoryIcons[categoryIcons.length - 1];
      if (firstIcon === undefined || lastIcon === undefined) {
        throw new Error(`Army formation category ${JSON.stringify(categoryId)} unexpectedly has no icons.`);
      }

      const firstMarkup = getArmyFormationIconThumbnailSvgMarkup(firstIcon.id);
      const lastMarkup = getArmyFormationIconThumbnailSvgMarkup(lastIcon.id);
      const spriteUrl = getArmyFormationIconSpriteUrl(categoryId);
      const spriteHeight = categoryIcons.length * iconCellHeight;

      expect(firstMarkup).toContain(`href="${spriteUrl}"`);
      expect(firstMarkup).toContain('width="50" height="30" viewBox="0 0 50 30" overflow="hidden"');
      expect(firstMarkup).toContain(`width="50" height="${spriteHeight}" preserveAspectRatio="none"`);
      expect(firstMarkup).toContain('x="0" y="-0"');
      expect(lastMarkup).toContain(`x="0" y="-${(categoryIcons.length - 1) * iconCellHeight}"`);
      expect(lastMarkup).toContain(`href="${spriteUrl}"`);
    }
  });

  it('fails fast with the received category and icon values', () => {
    expect(() => getArmyFormationIconSpriteUrl('missing' as ArmyFormationIconCategoryId)).toThrow(
      'Unknown army formation icon category: "missing"',
    );
    expect(() => getArmyFormationIconThumbnailSvgMarkup('missing-icon')).toThrow(
      'Army formation icon id "missing-icon" was not found.',
    );
    expect(() => getArmyFormationIconThumbnailSvgMarkup('')).toThrow(
      'Icon id must be a non-empty string, received "".',
    );
    expect(() => getArmyFormationIconThumbnailSvgMarkup(null as unknown as string)).toThrow(
      'Icon id must be a non-empty string, received null.',
    );
  });

  it('keeps every sprite cell byte-identical to its catalog source PNG', async () => {
    for (const categoryId of listArmyFormationIconCategories()) {
      const categoryIcons = listArmyFormationIconsInCategory(categoryId);
      const spriteUrl = getArmyFormationIconSpriteUrl(categoryId);
      const spritePath = resolve(repositoryRoot, 'public', spriteUrl.slice(1));
      const decodedSprite = await sharp(await readFile(spritePath))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      expect(decodedSprite.info.width).toBe(iconCellWidth);
      expect(decodedSprite.info.height).toBe(categoryIcons.length * iconCellHeight);
      expect(decodedSprite.info.channels).toBe(rgbaChannelCount);

      for (const [iconIndex, icon] of categoryIcons.entries()) {
        const sourceRgba = await readRawRgba(readCatalogAssetPath(icon.id, icon.svgMarkup));
        const cellStart = iconIndex * iconCellWidth * iconCellHeight * rgbaChannelCount;
        const cellEnd = cellStart + sourceRgba.length;
        expect(decodedSprite.data.subarray(cellStart, cellEnd)).toEqual(sourceRgba);
      }
    }
  }, 15000);
});
