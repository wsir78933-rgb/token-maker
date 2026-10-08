import { describe, expect, it } from 'vitest';

import { getConstellationMapCopy } from './copy';

const EXPECTED_WORKSPACE_KEYS = [
  'workspaceTitle',
  'assetsTitle',
  'settingsTitle',
  'filesTitle',
  'exportTitle',
  'canvasLabel',
  'objectLabel',
  'resizeLabel',
  'rotateLabel',
  'assetCount',
  'addStar',
  'deleteSelected',
  'dragging',
  'resizing',
  'selectedCount',
  'canvasHint',
  'width',
  'height',
  'applySize',
  'backgroundColor',
  'applyColor',
  'transparentBase',
  'transparentHint',
  'backgroundImage',
  'backgroundUrl',
  'applyImage',
  'removeImage',
  'sizeMismatch',
  'clearObjects',
  'clearHint',
  'browserSaves',
  'browserHint',
  'slotLabel',
  'emptySlot',
  'occupiedSlot',
  'save',
  'load',
  'savedSlot',
  'loadedSlot',
  'overwriteHint',
  'projectTitle',
  'projectHint',
  'generateProject',
  'downloadProject',
  'chooseProject',
  'loadProject',
  'noFile',
  'generatedProject',
  'loadedProject',
  'generateImage',
  'downloadImage',
  'actualSize',
  'exportHint',
  'exportReady',
  'close',
  'backToEditor',
  'help',
  'helpTitle',
  'busy',
  'errorLabel',
  'addedObject',
  'deletedObject',
  'clearedObjects',
  'settingsApplied',
  'categoryLabels',
  'helpSteps',
].sort();

describe('getConstellationMapCopy', () => {
  it('keeps the complete workspace contract in both locales', () => {
    const english = getConstellationMapCopy('en');
    const chinese = getConstellationMapCopy('zh');

    expect(Object.keys(english.workspace).sort()).toEqual(EXPECTED_WORKSPACE_KEYS);
    expect(Object.keys(chinese.workspace).sort()).toEqual(EXPECTED_WORKSPACE_KEYS);
    expect(english.workspace.categoryLabels).toEqual({
      image: 'Images',
      plain: 'Stars',
      line: 'Lines',
    });
    expect(chinese.workspace.categoryLabels).toEqual({
      image: '图形',
      plain: '星点',
      line: '连线',
    });
    expect(english.workspace.assetCount).toBe('{count} in this category');
    expect(chinese.workspace.assetCount).toBe('当前分类 {count} 项');
    expect(english.workspace.helpSteps.length).toBeGreaterThanOrEqual(7);
    expect(chinese.workspace.helpSteps.length).toBe(english.workspace.helpSteps.length);
  });

  it('provides localized page metadata and content', () => {
    const english = getConstellationMapCopy('en');
    const chinese = getConstellationMapCopy('zh');

    expect(english.heading).toBe('Constellation Map Creator');
    expect(chinese.heading).toBe('星座地图创建器');
    expect(english.navigationTitle).toBe(english.heading);
    expect(chinese.navigationTitle).toBe(chinese.heading);
    expect(english.pageContent.features.items).toHaveLength(6);
    expect(chinese.pageContent.features.items).toHaveLength(6);
    expect(english.pageContent.howItWorks.steps).toHaveLength(3);
    expect(chinese.pageContent.howItWorks.steps).toHaveLength(3);
    expect(english.pageContent.faq.items).toHaveLength(5);
    expect(chinese.pageContent.faq.items).toHaveLength(5);
  });

  it('keeps required placeholders and map behavior guidance', () => {
    const workspaceCopy = getConstellationMapCopy('en').workspace;
    const requiredPlaceholders = [
      '{number}',
      '{count}',
      '{width}',
      '{height}',
      '{imageWidth}',
      '{imageHeight}',
    ];
    const workspaceText = Object.values(workspaceCopy)
      .filter((value): value is string => typeof value === 'string')
      .join('\n');

    for (const placeholder of requiredPlaceholders) {
      expect(workspaceText).toContain(placeholder);
    }

    expect(workspaceCopy.helpSteps.join('\n')).toContain('deselect');
    expect(workspaceCopy.helpSteps.join('\n')).toContain('front');
    expect(workspaceCopy.helpSteps.join('\n')).toContain('CORS');
    expect(workspaceCopy.helpSteps.join('\n')).toContain('PNG');
    expect(workspaceCopy.helpSteps[0]).toContain('same star positions');
    expect(getConstellationMapCopy('zh').workspace.helpSteps[0]).toContain('相同星点位置');
  });

  it('keeps the same two-row tool comparison in both locales', () => {
    const englishComparison = getConstellationMapCopy('en').pageContent.toolComparison;
    const chineseComparison = getConstellationMapCopy('zh').pageContent.toolComparison;
    const comparisonFields = [
      'constellationMapCreatorHeading',
      'description',
      'dimensionHeading',
      'illustratorHeading',
      'photoshopHeading',
      'rows',
      'tableLabel',
      'title',
    ];
    const rowFields = ['constellationMapCreator', 'dimension', 'illustrator', 'photoshop'];
    const englishDimensions = ['Constellation asset preparation', 'Dedicated star-map operations'];
    const chineseDimensions = ['星座素材准备', '专用星图操作'];

    expect(Object.keys(englishComparison).sort()).toEqual(comparisonFields);
    expect(Object.keys(chineseComparison).sort()).toEqual(comparisonFields);
    expect(englishComparison.dimensionHeading).toBe('Comparison');
    expect(chineseComparison.dimensionHeading).toBe('比较维度');
    expect(englishComparison.constellationMapCreatorHeading).toBe('Constellation Map Creator');
    expect(chineseComparison.constellationMapCreatorHeading).toBe('星座地图创建器');
    expect(englishComparison.photoshopHeading).toBe('Photoshop');
    expect(chineseComparison.photoshopHeading).toBe('Photoshop');
    expect(englishComparison.illustratorHeading).toBe('Illustrator');
    expect(chineseComparison.illustratorHeading).toBe('Illustrator');
    expect(englishComparison.rows).toHaveLength(2);
    expect(chineseComparison.rows).toHaveLength(2);

    for (const [index, englishRow] of englishComparison.rows.entries()) {
      const chineseRow = chineseComparison.rows[index];
      if (chineseRow === undefined) {
        throw new Error(`Chinese tool comparison row ${String(index)} is missing.`);
      }

      expect(Object.keys(englishRow).sort()).toEqual(rowFields);
      expect(Object.keys(chineseRow).sort()).toEqual(rowFields);
      expect(englishRow.dimension).toBe(englishDimensions[index]);
      expect(chineseRow.dimension).toBe(chineseDimensions[index]);

      for (const fieldName of rowFields) {
        const englishValue = englishRow[fieldName as keyof typeof englishRow];
        const chineseValue = chineseRow[fieldName as keyof typeof chineseRow];
        expect(englishValue.trim().length).toBeGreaterThan(0);
        expect(chineseValue.trim().length).toBeGreaterThan(0);
      }
    }

    expect(englishComparison.rows[0]?.constellationMapCreator).toContain('183');
    expect(englishComparison.rows[0]?.constellationMapCreator).toContain('61');
    expect(chineseComparison.rows[0]?.constellationMapCreator).toContain('183');
    expect(chineseComparison.rows[0]?.constellationMapCreator).toContain('61');
    expect(englishComparison.description).toContain('183');
    expect(englishComparison.description).toContain('61');
    expect(chineseComparison.description).toContain('183');
    expect(chineseComparison.description).toContain('61');
  });

  it('fails fast for an unsupported locale', () => {
    expect(() => getConstellationMapCopy('fr' as never)).toThrow(
      'Constellation map copy locale must be en or zh. Received fr.',
    );
  });
});
