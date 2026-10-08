import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  CALENDAR_ICONS,
  DISASTER_ICON_IDS,
  getCalendarIcon,
  getCalendarIconLabel,
  getCalendarMoonIconId,
  isCalendarIconId,
} from './icons';

const EXPECTED_DISASTER_ICON_IDS = [15, 61, 62, 63, 65, 67, 68, 69];

function readCalendarPngDimensions(filePath: string): { width: number; height: number } {
  const pngBytes = readFileSync(filePath);
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!pngBytes.subarray(0, pngSignature.length).equals(pngSignature)) {
    throw new Error(`Calendar asset ${JSON.stringify(filePath)} is not a PNG file.`);
  }

  if (pngBytes.length < 26 || pngBytes.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error(`Calendar asset ${JSON.stringify(filePath)} has no PNG IHDR chunk.`);
  }

  return {
    width: pngBytes.readUInt32BE(16),
    height: pngBytes.readUInt32BE(20),
  };
}

function localCalendarAssetPath(sourcePath: string): string {
  if (!sourcePath.startsWith('/calendar-creator/rollforfantasy/')) {
    throw new Error(`Calendar icon path ${JSON.stringify(sourcePath)} is outside the local asset root.`);
  }

  return path.join(process.cwd(), 'public', sourcePath.slice(1));
}

function readCalendarAssetManifest(): {
  assetCount: number;
  assets: Array<{
    id: number;
    sourceUrl: string;
    localPath: string;
    width: number;
    height: number;
    colorType: string;
    byteLength: number;
    sha256: string;
  }>;
} {
  const manifestPath = path.join(process.cwd(), 'public', 'calendar-creator', 'asset-manifest.json');
  const manifestValue: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (
    manifestValue === null ||
    typeof manifestValue !== 'object' ||
    !('assetCount' in manifestValue) ||
    !('assets' in manifestValue) ||
    typeof manifestValue.assetCount !== 'number' ||
    !Array.isArray(manifestValue.assets)
  ) {
    throw new Error(`Calendar asset manifest has an invalid shape. Received ${JSON.stringify(manifestValue)}.`);
  }

  return manifestValue as {
    assetCount: number;
    assets: Array<{
      id: number;
      sourceUrl: string;
      localPath: string;
      width: number;
      height: number;
      colorType: string;
      byteLength: number;
      sha256: string;
    }>;
  };
}

describe('calendar icon catalog', () => {
  it('publishes the 57 ordinary and 18 moon source icons', () => {
    expect(CALENDAR_ICONS).toHaveLength(75);
    expect(CALENDAR_ICONS.filter((icon) => icon.category === 'ordinary')).toHaveLength(57);
    expect(CALENDAR_ICONS.filter((icon) => icon.category === 'moon')).toHaveLength(18);
    expect(new Set(CALENDAR_ICONS.map((icon) => icon.id)).size).toBe(75);
    expect(CALENDAR_ICONS.every((icon) => icon.labelEn.length > 0 && icon.labelZh.length > 0)).toBe(true);
  });

  it('uses local PNG paths and verifies every source file is 25 by 25 RGBA PNG', () => {
    for (const icon of CALENDAR_ICONS) {
      const filePath = localCalendarAssetPath(icon.src);
      const dimensions = readCalendarPngDimensions(filePath);
      const pngBytes = readFileSync(filePath);

      expect(dimensions).toEqual({ width: 25, height: 25 });
      expect(pngBytes[25]).toBe(6);
      expect(pngBytes.includes(Buffer.from('IEND'))).toBe(true);
    }
  });

  it('matches every local file to the recorded source URL and SHA-256 digest', () => {
    const manifest = readCalendarAssetManifest();
    expect(manifest.assetCount).toBe(75);
    expect(manifest.assets).toHaveLength(75);

    const manifestEntryByIconId = new Map(manifest.assets.map((assetEntry) => [assetEntry.id, assetEntry]));
    for (const icon of CALENDAR_ICONS) {
      const iconId = icon.id;
      const manifestEntry = manifestEntryByIconId.get(iconId);
      if (!manifestEntry) {
        throw new Error(`Calendar asset manifest is missing icon ID ${String(iconId)}.`);
      }

      const localFilePath = localCalendarAssetPath(icon.src);
      const pngBytes = readFileSync(localFilePath);
      expect(manifestEntry.localPath).toBe(icon.src);
      expect(manifestEntry.byteLength).toBe(pngBytes.length);
      expect(manifestEntry.width).toBe(25);
      expect(manifestEntry.height).toBe(25);
      expect(manifestEntry.colorType).toBe('RGBA');
      expect(manifestEntry.sha256).toBe(createHash('sha256').update(pngBytes).digest('hex'));
      expect(manifestEntry.sourceUrl).toMatch(/^https:\/\/rollforfantasy\.com\/images\/timelineIcons\/.+[.]png$/);
    }
  });

  it('keeps the source disaster pool and moon phase mappings', () => {
    expect([...DISASTER_ICON_IDS]).toEqual(EXPECTED_DISASTER_ICON_IDS);
    expect(getCalendarMoonIconId('white', 'full')).toBe(48);
    expect(getCalendarMoonIconId('white', 'new')).toBe(49);
    expect(getCalendarMoonIconId('white', 'firstQuarter')).toBe(51);
    expect(getCalendarMoonIconId('white', 'lastQuarter')).toBe(50);
    expect(getCalendarMoonIconId('blue', 'full')).toBe(70);
    expect(getCalendarMoonIconId('blue', 'new')).toBe(71);
    expect(getCalendarMoonIconId('blue', 'firstQuarter')).toBe(73);
    expect(getCalendarMoonIconId('blue', 'lastQuarter')).toBe(72);
    expect(getCalendarMoonIconId('red', 'full')).toBe(76);
    expect(getCalendarMoonIconId('red', 'new')).toBe(77);
    expect(getCalendarMoonIconId('red', 'firstQuarter')).toBe(79);
    expect(getCalendarMoonIconId('red', 'lastQuarter')).toBe(78);
  });

  it('returns bilingual labels and rejects unsupported IDs, locales, colors, and phases', () => {
    expect(getCalendarIcon(1).src).toBe('/calendar-creator/rollforfantasy/icon1.png');
    expect(getCalendarIconLabel(48, 'en')).toBe('full moon');
    expect(getCalendarIconLabel(48, 'zh')).toBe('白色满月');
    expect(isCalendarIconId(81)).toBe(true);
    expect(isCalendarIconId(54)).toBe(false);
    expect(isCalendarIconId('48')).toBe(false);
    expect(() => getCalendarIcon(54 as never)).toThrowError('54');
    expect(() => getCalendarIconLabel(48, 'fr' as never)).toThrowError('fr');
    expect(() => getCalendarMoonIconId('purple' as never, 'full')).toThrowError('purple');
    expect(() => getCalendarMoonIconId('white', 'waxing' as never)).toThrowError('waxing');
    expect(() => getCalendarMoonIconId('toString' as never, 'full')).toThrowError('color');
    expect(() => getCalendarMoonIconId('__proto__' as never, 'full')).toThrowError('color');
    expect(() => getCalendarMoonIconId('white', 'toString' as never)).toThrowError('phase');
    expect(() => getCalendarMoonIconId('white', '__proto__' as never)).toThrowError('phase');
  });
});
