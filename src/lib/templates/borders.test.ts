import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  BORDER_TEMPLATES,
  getBorderById,
  getPresetBorderTemplates,
  getVisibleBorderTemplates,
} from './borders';

function hasWebpAlpha(filePath: string): boolean {
  const data = readFileSync(filePath);
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP') {
    return false;
  }

  let offset = 12;
  while (offset + 8 <= data.length) {
    const chunkType = data.toString('ascii', offset, offset + 4);
    const chunkSize = data.readUInt32LE(offset + 4);
    const chunkDataOffset = offset + 8;

    if (chunkType === 'ALPH') return true;
    if (chunkType === 'VP8X' && (data[chunkDataOffset] & 0b00010000) !== 0) return true;

    offset = chunkDataOffset + chunkSize + (chunkSize % 2);
  }

  return false;
}

describe('border templates', () => {
  it('keeps the fire border depth effect weaker than the default image border depth', () => {
    expect(getBorderById('fire')?.depthStrength).toBeLessThan(1);
  });

  it('lists generated assets as preset border templates', () => {
    const expectedPresetCounts = {
      warrior: 28,
      mage: 30,
      rogue: 30,
      cleric: 30,
      ranger: 29,
      monster: 31,
      undead: 29,
    } as const;

    for (const [presetId, count] of Object.entries(expectedPresetCounts)) {
      const borders = getPresetBorderTemplates(presetId);

      expect(borders).toHaveLength(count);
      expect(borders[0]).toMatchObject({
        id: `${presetId}-border-01`,
        name: `border.${presetId}.01`,
        type: 'image',
        imageUrl: expect.stringMatching(
          new RegExp(`^/borders/${presetId}/${presetId}-01\\.webp\\?v=`)
        ),
        thumbSrc: expect.stringMatching(
          new RegExp(`^/borders/thumbs/${presetId}/${presetId}-01\\.webp\\?v=`)
        ),
        linkedMaskId: 'circle',
      });
    }
  });

  it('returns no preset border templates for presets without generated border assets', () => {
    expect(getPresetBorderTemplates('other')).toEqual([]);
  });

  it('keeps the previous generic wood border available in the other category', () => {
    const otherBorders = getVisibleBorderTemplates({
      activePresetId: 'other',
      selectedBorderId: 'ranger-border-01',
      borderLibraryMode: 'default',
    });

    expect(otherBorders.map((border) => border.id)).toContain('wood');
  });

  it('keeps generated preset border assets transparent', () => {
    const presetImageBorders = BORDER_TEMPLATES.filter(
      (border) => border.presetId && border.type === 'image' && border.imageUrl
    );
    const opaqueAssets = presetImageBorders
      .map((border) =>
        path.join(process.cwd(), 'public', border.imageUrl!.replace(/^\//, '').replace(/\?.*$/, ''))
      )
      .filter((filePath) => !existsSync(filePath) || !hasWebpAlpha(filePath));

    expect(opaqueAssets).toEqual([]);
  });

  it('uses separate lightweight thumbnails for generated preset border assets', () => {
    const presetImageBorders = BORDER_TEMPLATES.filter(
      (border) => border.presetId && border.type === 'image' && border.imageUrl && border.thumbSrc
    );
    const invalidThumbnailAssets = presetImageBorders
      .map((border) => {
        const imagePath = path.join(
          process.cwd(),
          'public',
          border.imageUrl!.replace(/^\//, '').replace(/\?.*$/, '')
        );
        const thumbPath = path.join(
          process.cwd(),
          'public',
          border.thumbSrc!.replace(/^\//, '').replace(/\?.*$/, '')
        );

        return { border, imagePath, thumbPath };
      })
      .filter(({ border, imagePath, thumbPath }) => {
        return (
          border.thumbSrc === border.imageUrl ||
          !border.thumbSrc?.startsWith(`/borders/thumbs/${border.presetId}/`) ||
          !existsSync(thumbPath) ||
          !hasWebpAlpha(thumbPath) ||
          readFileSync(thumbPath).byteLength >= readFileSync(imagePath).byteLength
        );
      })
      .map(({ border }) => border.id);

    expect(invalidThumbnailAssets).toEqual([]);
  });
});
