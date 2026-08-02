import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EDITOR_FONT_IDS } from '@/types/editor-font';
import {
  DEFAULT_EDITOR_FONT_ID,
  EDITOR_FONT_DEFINITIONS,
  getEditorFontCanvasShorthand,
  getEditorFontDefinition,
  getEditorFontLabel,
  resolveEditorFontId,
  resolveEditorFontWeight,
} from './catalog';

describe('editor font catalog', () => {
  it('keeps the supported editor font IDs closed and defaults invalid stored values', () => {
    expect(EDITOR_FONT_IDS).toEqual([
      'system-sans',
      'noto-sans-sc',
      'noto-serif-sc',
      'lxgw-wenkai',
      'ma-shan-zheng',
      'zcool-xiaowei',
      'zcool-kuaile',
      'zcool-qingke-huangyou',
      'zhi-mang-xing',
      'long-cang',
      'liu-jian-mao-cao',
    ]);
    expect(DEFAULT_EDITOR_FONT_ID).toBe('system-sans');
    expect(new Set(EDITOR_FONT_DEFINITIONS.map(({ id }) => id)).size).toBe(11);
    expect(resolveEditorFontId(undefined)).toBe('system-sans');
    expect(resolveEditorFontId('unknown-font')).toBe('system-sans');
  });

  it('provides the selected family in canvas shorthand and constrains unsupported weights', () => {
    expect(getEditorFontCanvasShorthand('noto-serif-sc', 700, 48)).toContain(
      '700 48px "Noto Serif SC"',
    );
    expect(resolveEditorFontWeight('ma-shan-zheng', 700)).toBe(400);
  });

  it('keeps Noto variable-font weights continuous within their supported range', () => {
    expect(resolveEditorFontWeight('noto-sans-sc', 350)).toBe(350);
    expect(resolveEditorFontWeight('noto-serif-sc', 350)).toBe(350);
    expect(resolveEditorFontWeight('noto-sans-sc', 99)).toBe(100);
    expect(resolveEditorFontWeight('noto-serif-sc', 901)).toBe(900);
    expect(resolveEditorFontWeight('zcool-kuaile', 350)).toBe(400);
  });

  it('returns the approved labels for each locale', () => {
    expect(getEditorFontLabel('system-sans', 'zh')).toBe('默认字体（系统无衬线）');
    expect(getEditorFontLabel('system-sans', 'en')).toBe('Default (System Sans)');
    expect(getEditorFontLabel('ma-shan-zheng', 'zh')).toBe(
      '马善政毛笔楷书（Ma Shan Zheng）',
    );
    expect(getEditorFontLabel('ma-shan-zheng', 'en')).toBe('Ma Shan Zheng');
  });

  it('ships a non-empty local binary and license for every non-default font', () => {
    for (const fontDefinition of EDITOR_FONT_DEFINITIONS) {
      if (fontDefinition.id === DEFAULT_EDITOR_FONT_ID) {
        expect(fontDefinition.filePath).toBeUndefined();
        expect(fontDefinition.licensePath).toBeUndefined();
        continue;
      }

      expect(statSync(resolve(process.cwd(), 'public', fontDefinition.filePath!.slice(1))).size).toBeGreaterThan(0);
      expect(statSync(resolve(process.cwd(), 'public', fontDefinition.licensePath!.slice(1))).size).toBeGreaterThan(0);
      expect(getEditorFontDefinition(fontDefinition.id)).toBe(fontDefinition);
    }
  });

  it('declares a local font-face that matches every non-default catalog entry', () => {
    const editorFontsCss = readFileSync(
      resolve(process.cwd(), 'src/app/editor-fonts.css'),
      'utf8',
    );
    const fontFaceRules = editorFontsCss.match(/@font-face\s*\{[^}]*\}/g) ?? [];

    expect(fontFaceRules).toHaveLength(10);

    for (const fontDefinition of EDITOR_FONT_DEFINITIONS) {
      if (fontDefinition.id === DEFAULT_EDITOR_FONT_ID) {
        continue;
      }

      const fontFaceRule = fontFaceRules.find((rule) =>
        rule.includes(`font-family: "${fontDefinition.family}";`),
      );

      expect(fontFaceRule, fontDefinition.id).toBeDefined();

      if (!fontFaceRule) {
        throw new Error(`Missing font-face rule for editor font: ${fontDefinition.id}`);
      }

      const cssFontPath = fontDefinition.filePath!
        .replace('[', '%5B')
        .replace(']', '%5D');
      const expectedWeight =
        fontDefinition.id === 'noto-sans-sc' || fontDefinition.id === 'noto-serif-sc'
          ? '100 900'
          : '400';

      expect(fontFaceRule).toContain(`url("${cssFontPath}")`);
      expect(fontFaceRule).toContain(`font-weight: ${expectedWeight};`);
      expect(fontFaceRule).toContain('font-display: swap;');
    }
  });
});
