import { describe, expect, it } from 'vitest';

import {
  getCastleCreatorCategoryLabel,
  getCastleCreatorCopy,
  getCastleCreatorLayerLabel,
  getCastleCreatorSaveSlotLabel,
  getCastleCreatorTotalAssetCountLabel,
} from '@/lib/castle-creator/copy';
import {
  CASTLE_CREATOR_CATEGORY_COUNTS,
  CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT,
  CASTLE_CREATOR_DEFAULT_CANVAS_WIDTH,
  CASTLE_CREATOR_DOOR_COUNT,
  CASTLE_CREATOR_SAVE_SLOT_NUMBERS,
  CASTLE_CREATOR_TOTAL_ASSET_COUNT,
} from '@/lib/castle-creator/constants';
import { CASTLE_CATEGORIES, CASTLE_LAYER_IDS } from '@/lib/castle-creator/types';

describe('getCastleCreatorCopy', () => {
  it('provides complete English and Chinese editor copy', () => {
    const englishCopy = getCastleCreatorCopy('en');
    const chineseCopy = getCastleCreatorCopy('zh');

    expect(englishCopy.navigationName).toBe('Castle Creator');
    expect(chineseCopy.navigationName).toBe('城堡拼搭');
    expect(englishCopy.heading).toContain('Castle');
    expect(chineseCopy.heading).toContain('城堡');
    expect(englishCopy.library.totalCountLabel(CASTLE_CREATOR_TOTAL_ASSET_COUNT)).toBe('366 parts');
    expect(chineseCopy.library.totalCountLabel(CASTLE_CREATOR_TOTAL_ASSET_COUNT)).toBe('366 个零件');
    expect(Object.keys(englishCopy.library.categoryLabels)).toEqual([...CASTLE_CATEGORIES]);
    expect(Object.keys(chineseCopy.library.categoryLabels)).toEqual([...CASTLE_CATEGORIES]);
    expect(Object.keys(englishCopy.editor.layerLabels)).toEqual([...CASTLE_LAYER_IDS]);
    expect(Object.keys(chineseCopy.editor.layerLabels)).toEqual([...CASTLE_LAYER_IDS]);
    expect(englishCopy.howItWorks.steps).toHaveLength(4);
    expect(chineseCopy.howItWorks.steps).toHaveLength(4);
    expect(englishCopy.faq.items).toHaveLength(10);
    expect(chineseCopy.faq.items).toHaveLength(10);
    expect(Object.values(englishCopy.editor.mobileTabLabels)).not.toContain('');
    expect(Object.values(chineseCopy.editor.mobileTabLabels)).not.toContain('');
    expect(englishCopy.library.mobileScrollNote).not.toHaveLength(0);
    expect(chineseCopy.settings.scrollHint).not.toHaveLength(0);
    expect(englishCopy.editor.resizeHandleLabels).toEqual({
      start: 'Resize selected piece from the right-edge midpoint',
      center: 'Resize selected piece from the bottom-edge midpoint',
      end: 'Resize selected piece with the outer resize point',
    });
    expect(chineseCopy.editor.resizeHandleLabels).toEqual({
      start: '从右侧中点调整选中组件大小',
      center: '从底部中点调整选中组件大小',
      end: '用外侧缩放点调整选中组件大小',
    });
  });

  it('keeps category totals and dynamic labels aligned with the wireframe contract', () => {
    const englishCopy = getCastleCreatorCopy('en');
    const chineseCopy = getCastleCreatorCopy('zh');

    expect(CASTLE_CREATOR_CATEGORY_COUNTS).toEqual({
      walls: 94,
      battlements: 70,
      towerRoofs: 24,
      buildings: 67,
      buildingRoofs: 84,
      gates: 18,
    });
    expect(CASTLE_CREATOR_DOOR_COUNT).toBe(9);
    expect(CASTLE_CREATOR_TOTAL_ASSET_COUNT).toBe(366);
    expect(englishCopy.library.categoryCountLabel('gates')).toBe('18 gates + 9 door pieces');
    expect(chineseCopy.library.categoryCountLabel('gates')).toBe('18 个城门 + 9 个门件');
    expect(englishCopy.library.categoryCountLabel('walls')).toBe('94 pieces');
    expect(chineseCopy.library.categoryCountLabel('walls')).toBe('94 个零件');
  });

  it('exposes stable defaults and every save slot', () => {
    expect(CASTLE_CREATOR_DEFAULT_CANVAS_WIDTH).toBe(0);
    expect(CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT).toBe(635);
    expect(CASTLE_CREATOR_SAVE_SLOT_NUMBERS).toEqual([1, 2, 3, 4, 5]);

    for (const slotNumber of CASTLE_CREATOR_SAVE_SLOT_NUMBERS) {
      expect(getCastleCreatorSaveSlotLabel('en', slotNumber)).toBe(`Slot ${slotNumber}`);
      expect(getCastleCreatorSaveSlotLabel('zh', slotNumber)).toBe(`存档 ${slotNumber}`);
    }
  });

  it('rejects unsupported locale and invalid save slot values', () => {
    expect(() => getCastleCreatorCopy('fr')).toThrow(
      'Unknown castle creator locale. Received "fr".',
    );
    expect(() => getCastleCreatorSaveSlotLabel('en', 0)).toThrow(
      'Castle creator save slot must be an integer from 1 to 5. Received 0.',
    );
    expect(() => getCastleCreatorSaveSlotLabel('en', 6)).toThrow(
      'Castle creator save slot must be an integer from 1 to 5. Received 6.',
    );
  });

  it('provides validated labels through the public label getters', () => {
    expect(getCastleCreatorCategoryLabel('en', 'towerRoofs')).toBe('Tower roofs');
    expect(getCastleCreatorCategoryLabel('zh', 'towerRoofs')).toBe('塔顶');
    expect(getCastleCreatorLayerLabel('en', 'lower')).toBe('Lower layer');
    expect(getCastleCreatorLayerLabel('zh', 'lower')).toBe('下层');
    expect(getCastleCreatorTotalAssetCountLabel('en')).toBe('366 parts');
    expect(getCastleCreatorTotalAssetCountLabel('zh')).toBe('366 个零件');
  });
});
