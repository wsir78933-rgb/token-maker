import { describe, expect, it } from 'vitest';

import type { LanguageRulePair, LanguageRules } from './types';
import { createDefaultRules, translateText } from './transform';

function createDisabledRulePair(): LanguageRulePair {
  return { source: '', target: '' };
}

function buildDisabledRules(): LanguageRules {
  return {
    characters: Array.from({ length: 26 }, createDisabledRulePair),
    combinations: Array.from({ length: 26 }, createDisabledRulePair),
  };
}

describe('language generator transform', () => {
  it('creates the 26 character and 26 combination defaults from the original tool', () => {
    const firstRules = createDefaultRules();
    const secondRules = createDefaultRules();

    expect(firstRules.characters.map((rulePair) => rulePair.source)).toEqual(
      [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
    );
    expect(firstRules.combinations.map((rulePair) => rulePair.source)).toEqual([
      'AN',
      'ED',
      'EE',
      'EN',
      'ER',
      'ES',
      'FF',
      'HE',
      'ING',
      'IN',
      'LL',
      'ND',
      'NE',
      'NT',
      'ON',
      'OO',
      'OR',
      'RE',
      'SE',
      'SS',
      'ST',
      'TE',
      'TH',
      'TR',
      'TO',
      'VE',
    ]);
    expect(firstRules.characters.every((rulePair) => rulePair.target === '')).toBe(true);
    expect(firstRules.combinations.every((rulePair) => rulePair.target === '')).toBe(true);
    expect(secondRules).not.toBe(firstRules);
    expect(secondRules.characters).not.toBe(firstRules.characters);
    expect(secondRules.characters[0]).not.toBe(firstRules.characters[0]);
  });

  it('runs combination rules before character rules and protects converted fragments', () => {
    const rules = buildDisabledRules();
    rules.combinations[0] = { source: 'ab', target: '.' };
    rules.characters[0] = { source: '.', target: 'X' };

    expect(translateText('AB', rules, true)).toBe('.');
    expect(translateText('AB', rules, false)).toBe('ab');
  });

  it('applies overlapping rules in their declared order', () => {
    const firstRuleWins = buildDisabledRules();
    firstRuleWins.combinations[0] = { source: 'ab', target: 'X' };
    firstRuleWins.combinations[1] = { source: 'aba', target: 'Y' };

    const longerRuleWins = buildDisabledRules();
    longerRuleWins.combinations[0] = { source: 'aba', target: 'Y' };
    longerRuleWins.combinations[1] = { source: 'ab', target: 'X' };

    expect(translateText('aba', firstRuleWins, true)).toBe('xa');
    expect(translateText('aba', longerRuleWins, true)).toBe('y');
  });

  it('uses the first matching duplicate source and does not cascade punctuation targets', () => {
    const rules = buildDisabledRules();
    rules.characters[0] = { source: 'a', target: 'X' };
    rules.characters[1] = { source: 'a', target: 'Y' };
    rules.characters[2] = { source: '.', target: 'Z' };

    expect(translateText('a.a', rules, false)).toBe('xzx');
  });

  it('matches literal punctuation and bracket source values', () => {
    const rules = buildDisabledRules();
    rules.characters[0] = { source: '.', target: 'D' };
    rules.characters[1] = { source: '[', target: 'L' };

    expect(translateText('.[.', rules, false)).toBe('dld');
  });

  it('deletes matching content when a target is empty', () => {
    const rules = buildDisabledRules();
    rules.characters[0] = { source: 'a', target: '' };

    expect(translateText('aBa', rules, false)).toBe('b');
  });

  it('treats an empty source as a disabled rule without inserting its target', () => {
    const rules = buildDisabledRules();
    rules.characters[0] = { source: '', target: 'X' };
    rules.characters[1] = { source: 'a', target: 'Y' };

    expect(translateText('A', rules, false)).toBe('y');
  });

  it('supports multi-character sources, lowercase output, mixed text, and line breaks', () => {
    const rules = buildDisabledRules();
    rules.combinations[0] = { source: 'AB', target: 'XY' };

    expect(translateText('中文 AB\nZ', rules, true)).toBe('中文 xy\nz');
  });

  it('preserves unmatched characters while normalizing input and targets to lowercase', () => {
    const rules = buildDisabledRules();
    rules.characters[0] = { source: 'th', target: 'Ŧ' };

    expect(translateText('Th Q', rules, false)).toBe('ŧ q');
  });

  it('rejects invalid text, rule groups, rule fields, lengths, and the toggle value', () => {
    const rules = buildDisabledRules();

    expect(() => translateText(42 as never, rules, false)).toThrow(
      'Language text must be a string. Received 42.',
    );
    expect(() =>
      translateText('x', { characters: [], combinations: rules.combinations }, false),
    ).toThrow('rules.characters must contain exactly 26 pairs. Received 0.');
    const sparseCharacters = Array.from({ length: 26 }, createDisabledRulePair);
    delete sparseCharacters[4];
    expect(() =>
      translateText(
        'x',
        { characters: sparseCharacters, combinations: rules.combinations },
        false,
      ),
    ).toThrow(
      'rules.characters[4] must be an object with source and target strings. Received undefined.',
    );
    expect(() =>
      translateText(
        'x',
        {
          characters: [{ source: 7, target: '' }, ...rules.characters.slice(1)],
          combinations: rules.combinations,
        } as never,
        false,
      ),
    ).toThrow('rules.characters[0].source must be a string. Received 7.');

    const characterSourceTooLong = buildDisabledRules();
    characterSourceTooLong.characters[0] = { source: 'abcd', target: '' };
    expect(() => translateText('x', characterSourceTooLong, false)).toThrow(
      'rules.characters[0].source must contain at most 3 characters. Received "abcd".',
    );

    const combinationTargetTooLong = buildDisabledRules();
    combinationTargetTooLong.combinations[0] = { source: 'ab', target: 'abcde' };
    expect(() => translateText('x', combinationTargetTooLong, true)).toThrow(
      'rules.combinations[0].target must contain at most 4 characters. Received "abcde".',
    );

    expect(() => translateText('x', rules, 'yes' as never)).toThrow(
      'Language combinationsEnabled must be a boolean. Received "yes".',
    );
  });
});
