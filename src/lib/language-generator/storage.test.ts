import { describe, expect, it } from 'vitest';

import type { LanguageRules } from './types';
import {
  LANGUAGE_RULE_SLOT_COUNT,
  LANGUAGE_RULE_STORAGE_KEY,
  loadRuleSlot,
  readRuleSlots,
  saveRuleSlot,
  type LanguageRuleStorage,
} from './storage';

function createMemoryStorage(): LanguageRuleStorage {
  const storedValues = new Map<string, string>();
  return {
    getItem: (key) => storedValues.get(key) ?? null,
    setItem: (key, value) => {
      storedValues.set(key, value);
    },
  };
}

function createLanguageRules(seed = 'a'): LanguageRules {
  const characters = Array.from({ length: 26 }, (_, index) => ({
    source: String.fromCharCode(97 + index),
    target: `${seed}${index.toString(36).slice(-1)}`,
  }));
  const combinations = Array.from({ length: 26 }, (_, index) => ({
    source: `A${index.toString(36).toUpperCase()}X`,
    target: `B${index.toString(36).toUpperCase()}Y`,
  }));

  return { characters, combinations };
}

function countStoredRuleFields(rules: LanguageRules): number {
  return [...rules.characters, ...rules.combinations].reduce(
    (fieldCount, rulePair) => fieldCount + Object.keys(rulePair).length,
    0,
  );
}

function createStorageWithReadFailure(failure: unknown): LanguageRuleStorage {
  return {
    getItem: () => {
      throw failure;
    },
    setItem: () => undefined,
  };
}

function createStorageWithWriteFailure(failure: unknown): LanguageRuleStorage {
  return {
    getItem: () => null,
    setItem: () => {
      throw failure;
    },
  };
}

describe('language rule storage', () => {
  it('uses one key, eight slots, and returns eight empty slots by default', () => {
    const storage = createMemoryStorage();

    expect(LANGUAGE_RULE_STORAGE_KEY).toBe('tokenmaker.language-generator.rules');
    expect(LANGUAGE_RULE_SLOT_COUNT).toBe(8);
    expect(readRuleSlots(storage)).toEqual(Array.from({ length: 8 }, () => null));
    expect(storage.getItem(LANGUAGE_RULE_STORAGE_KEY)).toBeNull();
  });

  it('round trips each slot independently and clones returned rules', () => {
    const storage = createMemoryStorage();
    const firstRules = createLanguageRules('a');
    const lastRules = createLanguageRules('z');

    saveRuleSlot(storage, 1, firstRules);
    saveRuleSlot(storage, 8, lastRules);

    expect(loadRuleSlot(storage, 1)).toEqual(firstRules);
    expect(loadRuleSlot(storage, 8)).toEqual(lastRules);
    expect(loadRuleSlot(storage, 4)).toBeNull();

    const loadedFirstRules = loadRuleSlot(storage, 1);
    if (loadedFirstRules === null) {
      throw new Error('Expected language rules in slot 1 during clone assertion.');
    }
    loadedFirstRules.characters[0].target = 'mutated';
    expect(loadRuleSlot(storage, 1)).toEqual(firstRules);

    firstRules.combinations[0].target = 'changed-after-save';
    expect(loadRuleSlot(storage, 1)?.combinations[0].target).toBe('B0Y');
  });

  it('stores exactly 104 source and target fields without unrelated state', () => {
    const storage = createMemoryStorage();
    const rules = createLanguageRules();

    saveRuleSlot(storage, 3, rules);

    const storedSlots = JSON.parse(storage.getItem(LANGUAGE_RULE_STORAGE_KEY) ?? 'null') as Array<unknown>;
    expect(storedSlots).toHaveLength(LANGUAGE_RULE_SLOT_COUNT);
    expect(storedSlots.filter((slot) => slot !== null)).toHaveLength(1);
    expect(countStoredRuleFields(storedSlots[2] as LanguageRules)).toBe(104);
    expect(storedSlots[2]).toEqual({ characters: rules.characters, combinations: rules.combinations });
    expect(JSON.stringify(storedSlots)).not.toMatch(/checkbox|freeText|vocabulary|random|result|timestamp|version/i);
  });

  it('rejects invalid slot numbers before reading or writing storage', () => {
    const storage = createMemoryStorage();
    const invalidSlotNumbers = [0, 9, 1.5, Number.NaN, '1', null];

    for (const invalidSlotNumber of invalidSlotNumbers) {
      expect(() => readRuleSlots(storage)).not.toThrow();
      expect(() => loadRuleSlot(storage, invalidSlotNumber as number)).toThrow(
        String(invalidSlotNumber),
      );
      expect(() => saveRuleSlot(storage, invalidSlotNumber as number, createLanguageRules())).toThrow(
        String(invalidSlotNumber),
      );
    }
  });

  it('rejects malformed JSON and malformed rule structures instead of returning empty slots', () => {
    const storage = createMemoryStorage();
    const malformedJsonCases = [
      '{broken',
      'null',
      JSON.stringify([]),
      JSON.stringify(Array.from({ length: 7 }, () => null)),
      JSON.stringify([{}, ...Array.from({ length: 7 }, () => null)]),
      JSON.stringify([
        {
          characters: Array.from({ length: 25 }, () => ({ source: 'a', target: 'b' })),
          combinations: Array.from({ length: 26 }, () => ({ source: 'ab', target: 'cd' })),
        },
        ...Array.from({ length: 7 }, () => null),
      ]),
      JSON.stringify([
        {
          characters: [
            { source: 'a', target: 'toolong' },
            ...Array.from({ length: 25 }, () => ({ source: 'a', target: 'b' })),
          ],
          combinations: Array.from({ length: 26 }, () => ({ source: 'ab', target: 'cd' })),
        },
        ...Array.from({ length: 7 }, () => null),
      ]),
      JSON.stringify([
        {
          characters: Array.from({ length: 26 }, () => ({ source: 'a', target: 'b' })),
          combinations: [
            { source: 'abcde', target: 'abcd' },
            ...Array.from({ length: 25 }, () => ({ source: 'ab', target: 'cd' })),
          ],
        },
        ...Array.from({ length: 7 }, () => null),
      ]),
    ];

    for (const malformedJson of malformedJsonCases) {
      storage.setItem(LANGUAGE_RULE_STORAGE_KEY, malformedJson);
      expect(() => readRuleSlots(storage)).toThrow();
    }
  });

  it('rejects extra fields and invalid rule values before writing', () => {
    const storage = createMemoryStorage();
    const rulesWithExtraField = createLanguageRules() as LanguageRules & { checkbox: boolean };
    rulesWithExtraField.checkbox = true;
    expect(() => saveRuleSlot(storage, 1, rulesWithExtraField)).toThrow(
      /only characters and combinations/,
    );

    const rulesWithLongCombination = createLanguageRules();
    rulesWithLongCombination.combinations[0].source = 'ABCDE';
    expect(() => saveRuleSlot(storage, 1, rulesWithLongCombination)).toThrow(/at most 4/);
    expect(storage.getItem(LANGUAGE_RULE_STORAGE_KEY)).toBeNull();
  });

  it('rejects sparse rule arrays instead of skipping missing pairs', () => {
    const storage = createMemoryStorage();
    const sparseRules = createLanguageRules();
    const sparseCharacters = new Array(26) as LanguageRules['characters'];
    sparseCharacters[1] = sparseRules.characters[1];
    sparseRules.characters = sparseCharacters;

    expect(() => saveRuleSlot(storage, 1, sparseRules)).toThrow(
      'Language rule characters[1] must be an object with source and target strings. Received undefined.',
    );
    expect(storage.getItem(LANGUAGE_RULE_STORAGE_KEY)).toBeNull();
  });

  it('includes the storage key, slot, and original cause for storage failures', () => {
    const readFailure = new Error('browser storage unavailable');
    expect(() => loadRuleSlot(createStorageWithReadFailure(readFailure), 6)).toThrow(
      /getItem.*tokenmaker\.language-generator\.rules.*slot 6.*browser storage unavailable/,
    );
    try {
      loadRuleSlot(createStorageWithReadFailure(readFailure), 6);
    } catch (error: unknown) {
      expect(error).toMatchObject({ cause: readFailure });
    }

    const writeFailure = new Error('quota exceeded');
    expect(() => saveRuleSlot(createStorageWithWriteFailure(writeFailure), 2, createLanguageRules())).toThrow(
      /setItem.*tokenmaker\.language-generator\.rules.*slot 2.*quota exceeded/,
    );
    try {
      saveRuleSlot(createStorageWithWriteFailure(writeFailure), 2, createLanguageRules());
    } catch (error: unknown) {
      expect(error).toMatchObject({ cause: writeFailure });
    }
  });

  it('rejects unavailable storage at the boundary with its received value', () => {
    expect(() => readRuleSlots(null as unknown as LanguageRuleStorage)).toThrow(/Received null/);
    expect(() => readRuleSlots({ getItem: 'nope' } as unknown as LanguageRuleStorage)).toThrow(
      /getItem must be a function.*"nope"/,
    );
  });
});
