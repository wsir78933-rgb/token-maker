import { describe, expect, it } from 'vitest';

import { VOCABULARY_CATEGORIES, VOCABULARY_ENTRIES } from './vocabulary';

const EXPECTED_CATEGORY_COUNTS = [11, 7, 10, 11, 8, 7, 7, 6];
const EXPECTED_SOURCE_WORDS = [
  'yes / no',
  'hello',
  'welcome',
  'goodbye',
  'good morning',
  'good evening',
  'good night',
  'excuse me',
  'please',
  'thank you',
  'no problem',
  'how',
  'which',
  'what',
  'where',
  'who',
  'why',
  'when',
  'i am',
  'you are',
  'he/she is',
  'they are',
  'you are',
  'we are',
  'sell',
  'buy',
  'trade',
  'steal',
  'work',
  'have',
  'give',
  'say',
  'get',
  'make',
  'help',
  'know',
  'take',
  'see',
  'hear',
  'father',
  'mother',
  'brother',
  'sister',
  'son',
  'daughter',
  'friend',
  'enemy',
  'courage',
  'fear',
  'hate',
  'anger',
  'happy',
  'pride',
  'shame',
  'love',
  'young',
  'old',
  'large',
  'small',
  'beauty',
  'ugly',
  'good',
  'bad',
  'clever',
  'stupid',
  'strong',
  'weak',
];

describe('language vocabulary catalog', () => {
  it('keeps eight localized groups and all 67 source entries in tt order', () => {
    expect(VOCABULARY_CATEGORIES).toHaveLength(8);
    expect(
      VOCABULARY_CATEGORIES.every(
        (category) => category.labels.en.trim().length > 0 && category.labels.zh.trim().length > 0,
      ),
    ).toBe(true);
    expect(VOCABULARY_ENTRIES).toHaveLength(67);
    expect(VOCABULARY_ENTRIES.map((entry) => entry.id)).toEqual(
      Array.from({ length: 67 }, (_, index) => `tt${index + 1}`),
    );
    expect(VOCABULARY_ENTRIES.map((entry) => entry.source)).toEqual(EXPECTED_SOURCE_WORDS);
  });

  it('assigns source groups to the required 11/7/10/11/8/7/7/6 counts', () => {
    const counts = VOCABULARY_CATEGORIES.map(
      (category) => VOCABULARY_ENTRIES.filter((entry) => entry.category === category.id).length,
    );

    expect(counts).toEqual(EXPECTED_CATEGORY_COUNTS);
    expect(
      VOCABULARY_ENTRIES.every((entry) =>
        VOCABULARY_CATEGORIES.some((category) => category.id === entry.category),
      ),
    ).toBe(true);
  });
});
