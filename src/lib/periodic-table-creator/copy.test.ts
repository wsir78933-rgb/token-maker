import { describe, expect, it } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';

import { getPeriodicTableCopy } from './copy';
import type { PeriodicTableCopy } from './copy-types';

const EXPECTED_PERIODIC_TABLE_COPY_KEYS = [
  'navigationTitle',
  'pageTitle',
  'pageDescription',
  'eyebrow',
  'title',
  'description',
  'heroAction',
  'fields',
  'workspaceLabel',
  'newTable',
  'random',
  'slots',
  'importFile',
  'download',
  'help',
  'more',
  'content',
  'appearance',
  'multiSelect',
  'selectAll',
  'clearSelection',
  'selectedCount',
  'tableSize',
  'selectionHint',
  'mobileScrollHint',
  'emptyCell',
  'scope',
  'selectedScope',
  'allScope',
  'noSelection',
  'backgroundColor',
  'transparentBackground',
  'textColor',
  'borderColor',
  'borderState',
  'borderShown',
  'borderHidden',
  'borderMixed',
  'invertBorders',
  'showBorders',
  'hideBorders',
  'imageUrl',
  'applyImage',
  'removeImage',
  'editorEmpty',
  'editorMultiple',
  'resetSelected',
  'rows',
  'columns',
  'createBlank',
  'realTemplate',
  'randomDefault',
  'randomCurrent',
  'randomHint',
  'dimensionHint',
  'newDescription',
  'save',
  'load',
  'emptySlot',
  'slot',
  'savedAt',
  'storageHint',
  'fileHint',
  'fileInputLabel',
  'importButton',
  'confirmReplaceTitle',
  'confirmReplaceDescription',
  'replace',
  'saveFirst',
  'confirmResetTitle',
  'confirmResetDescription',
  'confirmOverwriteTitle',
  'confirmOverwriteDescription',
  'cancel',
  'close',
  'done',
  'statusSaved',
  'statusLoaded',
  'statusImported',
  'statusDownloaded',
  'errorPrefix',
  'helpIntro',
  'helpSections',
] as const;

function assertCopyTextIsComplete(copy: PeriodicTableCopy): void {
  expect(copy.navigationTitle.trim()).not.toBe('');
  expect(copy.pageTitle.trim()).not.toBe('');
  expect(copy.pageDescription.trim()).not.toBe('');
  expect(copy.eyebrow.trim()).not.toBe('');
  expect(copy.title.trim()).not.toBe('');
  expect(copy.description.trim()).not.toBe('');
  expect(copy.heroAction.trim()).not.toBe('');

  for (const fieldLabel of Object.values(copy.fields)) {
    expect(fieldLabel.trim()).not.toBe('');
  }

  for (const [key, value] of Object.entries(copy)) {
    if (key === 'fields' || key === 'helpSections') {
      continue;
    }

    expect(typeof value).toBe('string');
    expect((value as string).trim()).not.toBe('');
  }

  expect(copy.helpSections.length).toBeGreaterThanOrEqual(8);
  for (const section of copy.helpSections) {
    expect(section.title.trim()).not.toBe('');
    expect(section.body.trim()).not.toBe('');
  }
}

describe('periodic table creator copy', () => {
  it('provides the complete EN/ZH copy contract in the same key order', () => {
    const englishCopy = getPeriodicTableCopy('en');
    const chineseCopy = getPeriodicTableCopy('zh');

    expect(Object.keys(englishCopy)).toEqual(EXPECTED_PERIODIC_TABLE_COPY_KEYS);
    expect(Object.keys(chineseCopy)).toEqual(EXPECTED_PERIODIC_TABLE_COPY_KEYS);
    expect(Object.keys(chineseCopy.fields)).toEqual(Object.keys(englishCopy.fields));
    expect(englishCopy.helpSections).toHaveLength(chineseCopy.helpSections.length);
    assertCopyTextIsComplete(englishCopy);
    assertCopyTextIsComplete(chineseCopy);
  });

  it('uses direct tool names and explains local TXT/HTML backups in both locales', () => {
    const englishCopy = getPeriodicTableCopy('en');
    const chineseCopy = getPeriodicTableCopy('zh');

    expect(englishCopy.navigationTitle).toBe('Periodic Table Creator');
    expect(englishCopy.title).toBe('Periodic Table Creator – Free Online Table Maker');
    expect(englishCopy.description).toBe(
      'Use our Periodic Table Creator for D&D, fantasy, and sci-fi worldbuilding. Organize magical elements, minerals, resources, materials, and factions.',
    );
    expect(englishCopy.heroAction).toBe('Start Creating');
    expect(chineseCopy.navigationTitle).toBe('元素周期表制作器');
    expect(chineseCopy.title).toBe('元素周期表制作器｜免费在线制作元素表');
    expect(chineseCopy.description).toBe(
      '为 TRPG/D&D、奇幻与科幻世界观制作自定义元素周期表，将魔法元素、矿物、资源、科技材料和阵营整理成分类体系，用于跑团、小说创作和游戏设定。',
    );
    expect(chineseCopy.heroAction).toBe('开始制作');
    expect(englishCopy.fileHint).toMatch(/TXT|HTML/);
    expect(chineseCopy.fileHint).toMatch(/TXT|HTML/);
    expect(englishCopy.storageHint).toMatch(/five|browser|automatic/i);
    expect(chineseCopy.storageHint).toMatch(/五|浏览器|自动/);
    expect(englishCopy.helpSections.some((section) => /Shift-Command-4/.test(section.body))).toBe(true);
    expect(chineseCopy.helpSections.some((section) => /Shift-Command-4/.test(section.body))).toBe(true);
  });

  it('rejects an unsupported locale with its actual value', () => {
    expect(() => getPeriodicTableCopy('fr' as SiteLocale)).toThrow(/"fr"/);
  });
});
