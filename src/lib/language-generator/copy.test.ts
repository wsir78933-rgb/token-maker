import { describe, expect, it } from 'vitest';

import { getLanguageGeneratorCopy } from './copy';
import type { LanguageGeneratorCopy } from './copy';
import type { SiteLocale } from '@/lib/site-locale';

const EXPECTED_LANGUAGE_GENERATOR_COPY_KEYS = [
  'navigationTitle',
  'pageTitle',
  'pageDescription',
  'eyebrow',
  'title',
  'description',
  'workspaceLabel',
  'vocabularyTab',
  'textTab',
  'rulesTab',
  'referenceTab',
  'storageButton',
  'vocabularyTitle',
  'vocabularyDescription',
  'randomPresetLabel',
  'randomizeButton',
  'alphabetLabel',
  'expandAlphabetButton',
  'collapseAlphabetButton',
  'allCategoriesLabel',
  'sourceHeading',
  'resultHeading',
  'applyRulesButton',
  'copyButton',
  'copiedLabel',
  'textTitle',
  'textDescription',
  'inputLabel',
  'inputPlaceholder',
  'outputLabel',
  'emptyOutput',
  'translateButton',
  'clearButton',
  'characterRulesTitle',
  'combinationRulesTitle',
  'sourceRuleHeading',
  'targetRuleHeading',
  'characterRulesHint',
  'combinationRulesHint',
  'combinationsEnabledLabel',
  'ruleOrderHint',
  'resetRulesButton',
  'saveRulesButton',
  'rulesAppliedMessage',
  'resetRulesMessage',
  'referenceTitle',
  'referenceDescription',
  'standardReferencesLabel',
  'communityReferencesLabel',
  'referenceLanguageLabel',
  'referenceRomanizationHint',
  'referenceUnavailable',
  'storageTitle',
  'storageDescription',
  'saveButton',
  'loadButton',
  'closeButton',
  'emptySlotLabel',
  'storedSlotLabel',
  'loadHint',
  'localStorageHint',
  'storageErrorLabel',
  'saveSuccessMessage',
  'loadSuccessMessage',
  'copyErrorLabel',
  'translationHint',
  'replaceSlotTitle',
  'replaceSlotDescription',
  'replaceSlotButton',
  'cancelButton',
] as const;

function readCopyStrings(copy: LanguageGeneratorCopy): string[] {
  return Object.values(copy);
}

describe('language generator copy', () => {
  it('provides the complete flat EN/ZH copy contract', () => {
    const englishCopy = getLanguageGeneratorCopy('en');
    const chineseCopy = getLanguageGeneratorCopy('zh');

    expect(Object.keys(englishCopy)).toEqual(EXPECTED_LANGUAGE_GENERATOR_COPY_KEYS);
    expect(Object.keys(chineseCopy)).toEqual(EXPECTED_LANGUAGE_GENERATOR_COPY_KEYS);
    expect(Object.keys(chineseCopy)).toEqual(Object.keys(englishCopy));
    expect(readCopyStrings(englishCopy).every((value) => value.trim().length > 0)).toBe(true);
    expect(readCopyStrings(chineseCopy).every((value) => value.trim().length > 0)).toBe(true);
  });

  it('uses the requested page and navigation names in both locales', () => {
    const englishCopy = getLanguageGeneratorCopy('en');
    const chineseCopy = getLanguageGeneratorCopy('zh');

    expect(englishCopy.navigationTitle).toBe('Language Generator');
    expect(englishCopy.title).toBe('Fictional Language Generator');
    expect(chineseCopy.navigationTitle).toBe('语言生成器');
    expect(chineseCopy.title).toBe('虚构语言生成器');
    expect(chineseCopy.title).not.toBe(englishCopy.title);
  });

  it('explains spelling conversion and the exact local storage boundary', () => {
    const englishCopy = getLanguageGeneratorCopy('en');
    const chineseCopy = getLanguageGeneratorCopy('zh');

    expect(englishCopy.localStorageHint).toBe('Rules are stored only in this browser.');
    expect(chineseCopy.localStorageHint).toBe('规则存档只保存在当前浏览器中。');

    for (const copy of [englishCopy, chineseCopy]) {
      expect(copy.translationHint).toMatch(/not translate|不翻译/);
      expect(copy.translationHint).toMatch(/unmatched|未匹配/i);
      expect(copy.translationHint).toMatch(/Chinese|中文/);
      expect(copy.textDescription).toMatch(/spelling|拼写/);
      expect(copy.characterRulesHint).toMatch(/3/);
      expect(copy.characterRulesHint).toMatch(/blank|空/);
      expect(copy.characterRulesHint).toMatch(/disable|停用/);
      expect(copy.characterRulesHint).toMatch(/delete|删除/);
      expect(copy.characterRulesHint).toMatch(/literal|字面量/);
      expect(copy.characterRulesHint).toMatch(/regular expression|正则表达式/);
      expect(copy.combinationRulesHint).toMatch(/4/);
      expect(copy.referenceRomanizationHint).toMatch(/fixed romanization|固定.*罗马/);
      expect(copy.referenceRomanizationHint).toMatch(/unavailable|未收录/);
      expect(copy.storageDescription).toMatch(/104/);
      expect(copy.storageDescription).toMatch(/8|eight|八/);
      expect(copy.storageDescription).toMatch(/not stored|不会保存/);
      expect(copy.storageDescription).toMatch(/automatically|自动/);
    }
  });

  it('rejects an unsupported runtime locale with its actual value', () => {
    expect(() => getLanguageGeneratorCopy('fr' as SiteLocale)).toThrow(/"fr"/);
  });
});
