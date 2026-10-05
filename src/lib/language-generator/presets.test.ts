import { describe, expect, it } from 'vitest';

import { VOCABULARY_ENTRIES } from './vocabulary';
import { DISPLAY_ALPHABET_SOURCES, LANGUAGE_PRESET_COUNT, generatePreset } from './presets';

const EXPECTED_HELLO_RESULTS: Record<number, string> = {
  1: 'akkou',
  2: 'lorra',
  3: 'higgou',
  4: 'hokka',
  5: 'hosso',
  6: 'seyllo',
  7: 'harru',
  8: 'sella',
  9: 'haellea',
  10: 'yiggi',
  11: 'missi',
  12: 'rolli',
  13: 'relxa',
  14: 'uyqon',
  15: 'rarru',
  16: 'rhourra',
  17: 'orra',
  18: 'eillo',
  19: 'axaczi',
  20: "e'assa",
  21: 'ghourru',
  22: 'horora',
  23: 'hulli',
  24: 'sharpu',
  25: 'irru',
};

describe('language generator presets', () => {
  it('exposes all 25 source cases with 67 results and 23 display mappings each', () => {
    expect(LANGUAGE_PRESET_COUNT).toBe(25);
    expect(DISPLAY_ALPHABET_SOURCES).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
    ]);

    for (let presetId = 1; presetId <= LANGUAGE_PRESET_COUNT; presetId += 1) {
      const generated = generatePreset(presetId, VOCABULARY_ENTRIES);
      expect(generated.results).toHaveLength(67);
      expect(generated.alphabet).toHaveLength(23);
      expect(generated.alphabet.map((pair) => pair.source)).toEqual(DISPLAY_ALPHABET_SOURCES);
      expect(generated.results.every((result) => result === result.toLowerCase())).toBe(true);
      expect(generated.results[1], `preset ${presetId} hello output`).toBe(
        EXPECTED_HELLO_RESULTS[presetId],
      );
    }
  });

  it('corrects preset 14 to the 23-source alphabet without the extra blank node', () => {
    const preset14 = generatePreset(14, VOCABULARY_ENTRIES);

    expect(preset14.alphabet[22]).toEqual({ source: 'Y', target: 'O' });
    expect(preset14.alphabet).toHaveLength(23);
  });

  it('does not mutate caller-owned vocabulary entries or the read-only input array', () => {
    const words = VOCABULARY_ENTRIES.map((entry) => Object.freeze({ ...entry }));
    const sourceSnapshot = words.map((entry) => ({ ...entry }));
    const generated = generatePreset(1, words);

    expect(words).toEqual(sourceSnapshot);
    expect(generated.results).not.toBe(words);
  });

  it('lowercases source values like the original page before applying a preset chain', () => {
    const generated = generatePreset(1, [
      { id: 'custom', category: 'test', source: 'HELLO' },
    ]);

    expect(generated.results).toEqual(['akkou']);
  });

  it('rejects invalid preset ids and malformed vocabulary inputs with received values', () => {
    for (const presetId of [0, 26, 1.5, Number.NaN, '1' as unknown]) {
      expect(() => generatePreset(presetId as number, VOCABULARY_ENTRIES)).toThrow(
        String(presetId),
      );
    }

    expect(() => generatePreset(1, null as unknown as readonly never[])).toThrow(/Received null/);
    expect(() =>
      generatePreset(1, [
        { id: 'broken', category: 'test', source: 7 } as unknown as never,
      ]),
    ).toThrow(/Received 7/);

    const sparseWords = new Array(1) as Array<never>;
    expect(() => generatePreset(1, sparseWords)).toThrow(/index 0.*Received undefined/);
  });
});
