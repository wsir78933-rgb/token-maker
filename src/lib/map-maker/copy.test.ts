import { describe, expect, test } from 'vitest';

import { getMapMakerAssetDisplayName, getMapMakerCopy } from '@/lib/map-maker/copy';
import { getMapMakerAssets } from '@/lib/map-maker/catalog';
import type { SiteLocale } from '@/lib/site-locale';

function copyShape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(copyShape);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, copyShape(child)]),
    );
  }

  if (typeof value === 'string') {
    return 'string';
  }

  return typeof value;
}

function requireNonEmptyCopy(value: unknown, path = 'copy'): void {
  if (Array.isArray(value)) {
    value.forEach((child, index) => requireNonEmptyCopy(child, `${path}[${index}]`));
    return;
  }

  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      requireNonEmptyCopy(child, `${path}.${key}`);
    }
    return;
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    throw new Error(`Map maker copy ${path} must not be empty. Received ${JSON.stringify(value)}.`);
  }
}

describe('map maker workspace copy', () => {
  test('keeps the English and Chinese workbench copy complete and structurally aligned', () => {
    const englishCopy = getMapMakerCopy('en');
    const chineseCopy = getMapMakerCopy('zh');

    expect(copyShape(englishCopy)).toEqual(copyShape(chineseCopy));
    requireNonEmptyCopy(englishCopy);
    requireNonEmptyCopy(chineseCopy);
    expect(englishCopy.pageTitle).not.toBe(chineseCopy.pageTitle);
    expect(englishCopy.workspace.materials.elementCategories.map(({ count }) => count)).toEqual([
      97,
      94,
      70,
    ]);
    expect(englishCopy.workspace.export.contentScope).toContain('base map');
    expect(englishCopy.workspace.export.contentScope).toContain('visible');
    expect(englishCopy.workspace.export.excludedContent).toContain('Text labels');
    expect(englishCopy.workspace.export.excludedContent).toContain('grid overlays');
    expect(englishCopy.workspace.canvas.multiSelect).toBe('Multi-select');
    expect(englishCopy.workspace.canvas.clearSelection).toBe('Clear selection');
    expect(englishCopy.workspace.canvas.editLabel).toBe('Edit label on map');
    expect(englishCopy.workspace.canvas.finishLabelEdit).toBe('Finish label editing');
    expect(englishCopy.workspace.properties.applyCustomImage).toBe('Apply custom image');
    expect(englishCopy.workspace.properties.customImageTargetHint).toContain('one selected free element');
    expect(englishCopy.workspace.status.imageApplied).toContain('selected items');
    expect(englishCopy.workspace.size.resizeWarning).toContain('clears both element layers');
    expect(englishCopy.workspace.size.resizeWarning).toContain('fits labels');
    expect(chineseCopy.workspace.export.contentScope).toContain('底图');
    expect(chineseCopy.workspace.export.contentScope).toContain('当前显示');
    expect(chineseCopy.workspace.export.excludedContent).toContain('文字标签');
    expect(chineseCopy.workspace.export.excludedContent).toContain('网格覆盖层');
    expect(chineseCopy.workspace.canvas.multiSelect).toBe('多选模式');
    expect(chineseCopy.workspace.canvas.clearSelection).toBe('取消选择');
    expect(chineseCopy.workspace.canvas.editLabel).toBe('在地图上编辑文字');
    expect(chineseCopy.workspace.canvas.finishLabelEdit).toBe('完成文字编辑');
    expect(chineseCopy.workspace.properties.applyCustomImage).toBe('应用自定义图片');
    expect(chineseCopy.workspace.properties.customImageTargetHint).toContain('一个已选中的自由元素');
    expect(chineseCopy.workspace.status.imageApplied).toContain('所选内容');
    expect(chineseCopy.workspace.size.resizeWarning).toContain('清空两个元素层');
    expect(chineseCopy.workspace.size.resizeWarning).toContain('调整到新地图范围内');
    expect(englishCopy.workspace.save.browserSlotsTitle).toContain('8 slots');
    expect(chineseCopy.workspace.save.browserSlotsTitle).toContain('8 个位置');
  });

  test('fails with the unexpected locale value', () => {
    expect(() => getMapMakerCopy('fr' as SiteLocale)).toThrow(
      'Unknown map maker locale: "fr".',
    );
  });

  test('localizes every non-coastline catalog name and leaves coastline IDs unchanged', () => {
    const englishCopy = getMapMakerCopy('en');
    const chineseCopy = getMapMakerCopy('zh');
    const categories = ['geography', 'structures', 'water'] as const;
    const catalogAssets = getMapMakerAssets();

    for (const category of categories) {
      const catalogNames = [...new Set(
        catalogAssets
          .filter((asset) => asset.category === category)
          .map((asset) => asset.name),
      )].sort();

      expect(Object.keys(englishCopy.workspace.materials.assetNames[category]).sort()).toEqual(catalogNames);
      expect(Object.keys(chineseCopy.workspace.materials.assetNames[category]).sort()).toEqual(catalogNames);
    }

    const nonCoastAssets = catalogAssets.filter((asset) => asset.category !== 'coastline');
    expect(nonCoastAssets).toHaveLength(261);
    for (const asset of nonCoastAssets) {
      expect(getMapMakerAssetDisplayName(englishCopy.workspace, asset)).not.toBe(asset.id);
      expect(getMapMakerAssetDisplayName(chineseCopy.workspace, asset)).not.toBe(asset.name);
    }

    const coastAsset = catalogAssets.find((asset) => asset.category === 'coastline');
    if (coastAsset === undefined) {
      throw new Error('Map Maker coastline catalog is empty.');
    }
    expect(getMapMakerAssetDisplayName(englishCopy.workspace, coastAsset)).toBe(coastAsset.id);
    expect(getMapMakerAssetDisplayName(chineseCopy.workspace, coastAsset)).toBe(coastAsset.id);
  });

  test('fails with the category, id, and name of an unmapped asset', () => {
    const unknownAsset = {
      id: 'test-asset-unknown',
      name: 'Unknown landmark',
      category: 'geography',
      src: '/map-maker/assets/test-asset-unknown.png',
      width: 1,
      height: 1,
    } as const;

    expect(() => getMapMakerAssetDisplayName(getMapMakerCopy('zh').workspace, unknownAsset)).toThrow(
      'Unknown map maker asset name "Unknown landmark" in category "geography" for asset "test-asset-unknown".',
    );
  });
});
