import { describe, expect, it } from 'vitest';

import {
  getReferenceLanguage,
  REFERENCE_LANGUAGES,
  REFERENCE_SOURCE_NOTE,
  REFERENCE_SOURCE_URL,
  SOURCE_SCRIPT_URL,
} from './references';

const EXPECTED_REAL_LANGUAGE_IDS = [
  'afrikaans',
  'bulgarian',
  'corpus',
  'croatian',
  'czech',
  'danish',
  'dothraki',
  'dovahzul',
  'dutch',
  'english',
  'filipino',
  'finnish',
  'french',
  'german',
  'greek',
  'hebrew',
  'hungarian',
  'icelandic',
  'indonesian',
  'irish',
  'italian',
  'japanese',
  'klingon',
  'korean',
  'latin',
  'lojban',
  'mandalorian',
  'nahuatl',
  'norwegian',
  'polish',
  'portuguese',
  'russian',
  'serbian',
  'sindarin',
  'spanish',
  'swedish',
] as const;

const EXPECTED_USER_LANGUAGE_IDS = [
  'ajbriom',
  'andakuri',
  'aslevalonian',
  'calarien',
  'chilunian',
  'lehrhres',
  'tajhaena',
  'tuatha',
  'viaxvolus',
  'wolven',
] as const;

const EXPECTED_ENGLISH_SOURCE_ORDER = [
  'yes/no',
  'how',
  'i am',
  'work',
  'hello',
  'which',
  'you are',
  'have',
  'welcome',
  'what',
  'he/she is',
  'give',
  'goodbye',
  'where',
  'they are',
  'say',
  'good morning',
  'who',
  'you are',
  'get',
  'good evening',
  'why',
  'we are',
  'make',
  'good night',
  'when',
  'help',
  'excuse me',
  'sell',
  'know',
  'please',
  'buy',
  'take',
  'thank you',
  'trade',
  'see',
  'no problem',
  'steal',
  'hear',
  'father',
  'courage',
  'love',
  'good',
  'mother',
  'fear',
  'young',
  'bad',
  'brother',
  'hate',
  'old',
  'clever',
  'sister',
  'anger',
  'large',
  'stupid',
  'son',
  'happy',
  'small',
  'strong',
  'daughter',
  'pride',
  'beauty',
  'weak',
  'friend',
  'shame',
  'ugly',
  'enemy',
] as const;

const EXPECTED_TRANSLATION_COUNTS: Record<string, number> = {
  afrikaans: 67,
  bulgarian: 67,
  corpus: 67,
  croatian: 67,
  czech: 67,
  danish: 67,
  dothraki: 47,
  dovahzul: 38,
  dutch: 67,
  english: 67,
  filipino: 67,
  finnish: 67,
  french: 67,
  german: 67,
  greek: 67,
  hebrew: 67,
  hungarian: 67,
  icelandic: 67,
  indonesian: 67,
  irish: 66,
  italian: 67,
  japanese: 67,
  klingon: 67,
  korean: 67,
  latin: 66,
  lojban: 67,
  mandalorian: 64,
  nahuatl: 64,
  norwegian: 67,
  polish: 67,
  portuguese: 67,
  russian: 67,
  serbian: 67,
  sindarin: 51,
  spanish: 67,
  swedish: 67,
  ajbriom: 67,
  andakuri: 67,
  aslevalonian: 67,
  calarien: 64,
  chilunian: 67,
  lehrhres: 67,
  tajhaena: 67,
  tuatha: 67,
  viaxvolus: 65,
  wolven: 67,
};

const EXPECTED_EMPTY_TRANSLATION_SOURCES: Record<string, string[]> = {
  dothraki: [
    'work',
    'hello',
    'which',
    'welcome',
    'goodbye',
    'good morning',
    'who',
    'good evening',
    'make',
    'good night',
    'when',
    'excuse me',
    'sell',
    'please',
    'buy',
    'thank you',
    'no problem',
    'clever',
    'weak',
    'ugly',
  ],
  dovahzul: [
    'how',
    'work',
    'hello',
    'which',
    'welcome',
    'what',
    'goodbye',
    'good morning',
    'you are',
    'good evening',
    'why',
    'good night',
    'help',
    'excuse me',
    'sell',
    'please',
    'buy',
    'take',
    'thank you',
    'trade',
    'no problem',
    'love',
    'hate',
    'clever',
    'large',
    'stupid',
    'happy',
    'small',
    'ugly',
  ],
  irish: ['yes/no'],
  latin: ['yes/no'],
  mandalorian: ['trade', 'pride', 'shame'],
  nahuatl: ['goodbye', 'no problem', 'clever'],
  sindarin: [
    'work',
    'you are',
    'he/she is',
    'they are',
    'you are',
    'get',
    'we are',
    'excuse me',
    'sell',
    'please',
    'buy',
    'steal',
    'stupid',
    'weak',
    'shame',
    'enemy',
  ],
  calarien: ['steal', 'old', 'ugly'],
  viaxvolus: ['sell', 'buy'],
};

function countTranslationEntries(languageId: string): number {
  return getReferenceLanguage(languageId).entries.filter((entry) => entry.translation !== '').length;
}

function listEmptyTranslationSources(languageId: string): string[] {
  return getReferenceLanguage(languageId)
    .entries.filter((entry) => entry.translation === '')
    .map((entry) => entry.source);
}

describe('language reference catalog', () => {
  it('exposes the captured source metadata and the 36/10 language groups', () => {
    expect(REFERENCE_SOURCE_URL).toBe('https://rollforfantasy.com/tools/language-generator.php');
    expect(SOURCE_SCRIPT_URL).toBe('https://rollforfantasy.com/scripts/langGen.js?fgr');
    expect(REFERENCE_SOURCE_NOTE).toMatch(/not independently verified semantic translations/);
    expect(REFERENCE_LANGUAGES.filter((language) => language.group === 'real').map((language) => language.id)).toEqual(
      EXPECTED_REAL_LANGUAGE_IDS,
    );
    expect(REFERENCE_LANGUAGES.filter((language) => language.group === 'user').map((language) => language.id)).toEqual(
      EXPECTED_USER_LANGUAGE_IDS,
    );
  });

  it('keeps 67 ordered entries for every language', () => {
    expect(REFERENCE_LANGUAGES).toHaveLength(46);
    expect(REFERENCE_LANGUAGES.every((language) => Array.isArray(language.entries))).toBe(true);
    expect(REFERENCE_LANGUAGES.every((language) => language.entries.length === 67)).toBe(true);
    expect(getReferenceLanguage('english').entries.map((entry) => entry.source)).toEqual(
      EXPECTED_ENGLISH_SOURCE_ORDER,
    );
    expect(REFERENCE_LANGUAGES.every((language) => language.entries.every((entry) => entry.source.length > 0))).toBe(
      true,
    );
  });

  it('preserves verified empty translations instead of filling them', () => {
    for (const [languageId, expectedSources] of Object.entries(EXPECTED_EMPTY_TRANSLATION_SOURCES)) {
      expect(listEmptyTranslationSources(languageId)).toEqual(expectedSources);
    }

    for (const [languageId, expectedCount] of Object.entries(EXPECTED_TRANSLATION_COUNTS)) {
      expect(countTranslationEntries(languageId)).toBe(expectedCount);
    }
  });

  it('fails fast with the received value for an unknown language id', () => {
    expect(() => getReferenceLanguage('missing-language')).toThrow(/"missing-language"/);
  });
});
