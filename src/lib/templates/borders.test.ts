import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { BORDER_TEMPLATES, getBorderById, getPresetBorderTemplates } from './borders';

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

  it('lists warrior and mage generated assets as preset border templates', () => {
    const warriorBorders = getPresetBorderTemplates('warrior');
    const mageBorders = getPresetBorderTemplates('mage');

    expect(warriorBorders).toHaveLength(28);
    expect(mageBorders).toHaveLength(30);
    expect(warriorBorders[0]).toMatchObject({
      id: 'warrior-border-01',
      name: 'border.warrior.01',
      type: 'image',
      imageUrl: expect.stringMatching(/^\/borders\/warrior\/warrior-01\.webp\?v=/),
      thumbSrc: expect.stringMatching(/^\/borders\/warrior\/warrior-01\.webp\?v=/),
      linkedMaskId: 'circle',
    });
    expect(mageBorders[0]).toMatchObject({
      id: 'mage-border-01',
      name: 'border.mage.01',
      type: 'image',
      imageUrl: expect.stringMatching(/^\/borders\/mage\/mage-01\.webp\?v=/),
      thumbSrc: expect.stringMatching(/^\/borders\/mage\/mage-01\.webp\?v=/),
      linkedMaskId: 'circle',
    });
  });

  it('returns no preset border templates for presets without generated border assets', () => {
    expect(getPresetBorderTemplates('rogue')).toEqual([]);
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
});
