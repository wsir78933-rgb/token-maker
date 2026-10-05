import type { LanguageRulePair, LanguageRules } from './types';

const LANGUAGE_RULE_PAIR_COUNT = 26;
const CHARACTER_RULE_MAX_LENGTH = 3;
const COMBINATION_RULE_MAX_LENGTH = 4;

const DEFAULT_CHARACTER_SOURCES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_COMBINATION_SOURCES = [
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
] as const;

type TranslationFragment = {
  text: string;
  converted: boolean;
};

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') {
    return JSON.stringify(receivedValue);
  }

  if (receivedValue === undefined) {
    return 'undefined';
  }

  if (receivedValue === null) {
    return 'null';
  }

  if (
    typeof receivedValue === 'number' ||
    typeof receivedValue === 'boolean' ||
    typeof receivedValue === 'bigint' ||
    typeof receivedValue === 'symbol'
  ) {
    return String(receivedValue);
  }

  return Object.prototype.toString.call(receivedValue);
}

function isRecord(receivedValue: unknown): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

function requireText(receivedText: unknown): string {
  if (typeof receivedText !== 'string') {
    throw new Error(
      `Language text must be a string. Received ${describeReceivedValue(receivedText)}.`,
    );
  }

  return receivedText;
}

function requireCombinationsEnabled(receivedEnabled: unknown): boolean {
  if (typeof receivedEnabled !== 'boolean') {
    throw new Error(
      `Language combinationsEnabled must be a boolean. Received ${describeReceivedValue(receivedEnabled)}.`,
    );
  }

  return receivedEnabled;
}

function requireRulePair(
  receivedPair: unknown,
  groupName: 'characters' | 'combinations',
  pairIndex: number,
  maximumLength: number,
): LanguageRulePair {
  const pairPath = `rules.${groupName}[${pairIndex}]`;
  if (!isRecord(receivedPair)) {
    throw new Error(
      `${pairPath} must be an object with source and target strings. Received ${describeReceivedValue(receivedPair)}.`,
    );
  }

  const source = receivedPair.source;
  if (typeof source !== 'string') {
    throw new Error(
      `${pairPath}.source must be a string. Received ${describeReceivedValue(source)}.`,
    );
  }

  if (source.length > maximumLength) {
    throw new Error(
      `${pairPath}.source must contain at most ${maximumLength} characters. Received ${JSON.stringify(source)}.`,
    );
  }

  const target = receivedPair.target;
  if (typeof target !== 'string') {
    throw new Error(
      `${pairPath}.target must be a string. Received ${describeReceivedValue(target)}.`,
    );
  }

  if (target.length > maximumLength) {
    throw new Error(
      `${pairPath}.target must contain at most ${maximumLength} characters. Received ${JSON.stringify(target)}.`,
    );
  }

  return { source, target };
}

function requireRuleGroup(
  receivedGroup: unknown,
  groupName: 'characters' | 'combinations',
  maximumLength: number,
): LanguageRulePair[] {
  const groupPath = `rules.${groupName}`;
  if (!Array.isArray(receivedGroup)) {
    throw new Error(
      `${groupPath} must be an array of ${LANGUAGE_RULE_PAIR_COUNT} pairs. Received ${describeReceivedValue(receivedGroup)}.`,
    );
  }

  if (receivedGroup.length !== LANGUAGE_RULE_PAIR_COUNT) {
    throw new Error(
      `${groupPath} must contain exactly ${LANGUAGE_RULE_PAIR_COUNT} pairs. Received ${receivedGroup.length}.`,
    );
  }

  return Array.from({ length: receivedGroup.length }, (_, pairIndex) =>
    requireRulePair(receivedGroup[pairIndex], groupName, pairIndex, maximumLength),
  );
}

function requireLanguageRules(receivedRules: unknown): LanguageRules {
  if (!isRecord(receivedRules)) {
    throw new Error(
      `Language rules must be an object with characters and combinations arrays. Received ${describeReceivedValue(receivedRules)}.`,
    );
  }

  return {
    characters: requireRuleGroup(
      receivedRules.characters,
      'characters',
      CHARACTER_RULE_MAX_LENGTH,
    ),
    combinations: requireRuleGroup(
      receivedRules.combinations,
      'combinations',
      COMBINATION_RULE_MAX_LENGTH,
    ),
  };
}

function normalizeRulePair(rulePair: LanguageRulePair): LanguageRulePair {
  return {
    source: rulePair.source.toLowerCase(),
    target: rulePair.target.toLowerCase(),
  };
}

function splitUnconvertedFragment(
  fragment: TranslationFragment,
  normalizedSource: string,
  normalizedTarget: string,
): TranslationFragment[] {
  if (normalizedSource.length === 0 || fragment.converted) {
    return [fragment];
  }

  const splitFragments: TranslationFragment[] = [];
  let searchStart = 0;

  while (searchStart < fragment.text.length) {
    const matchIndex = fragment.text.indexOf(normalizedSource, searchStart);
    if (matchIndex < 0) {
      break;
    }

    if (matchIndex > searchStart) {
      splitFragments.push({
        text: fragment.text.slice(searchStart, matchIndex),
        converted: false,
      });
    }

    splitFragments.push({ text: normalizedTarget, converted: true });
    searchStart = matchIndex + normalizedSource.length;
  }

  if (splitFragments.length === 0) {
    return [fragment];
  }

  if (searchStart < fragment.text.length) {
    splitFragments.push({
      text: fragment.text.slice(searchStart),
      converted: false,
    });
  }

  return splitFragments;
}

function applyRuleToFragments(
  fragments: TranslationFragment[],
  rulePair: LanguageRulePair,
): TranslationFragment[] {
  const normalizedRulePair = normalizeRulePair(rulePair);
  if (normalizedRulePair.source.length === 0) {
    return fragments;
  }

  const nextFragments: TranslationFragment[] = [];
  for (const fragment of fragments) {
    nextFragments.push(
      ...splitUnconvertedFragment(
        fragment,
        normalizedRulePair.source,
        normalizedRulePair.target,
      ),
    );
  }

  return nextFragments;
}

function applyRuleGroup(
  fragments: TranslationFragment[],
  rulePairs: LanguageRulePair[],
): TranslationFragment[] {
  let currentFragments = fragments;
  for (const rulePair of rulePairs) {
    currentFragments = applyRuleToFragments(currentFragments, rulePair);
  }

  return currentFragments;
}

export function createDefaultRules(): LanguageRules {
  return {
    characters: [...DEFAULT_CHARACTER_SOURCES].map((source) => ({
      source,
      target: '',
    })),
    combinations: DEFAULT_COMBINATION_SOURCES.map((source) => ({
      source,
      target: '',
    })),
  };
}

export function translateText(
  text: string,
  rules: LanguageRules,
  combinationsEnabled: boolean,
): string {
  const normalizedText = requireText(text).toLowerCase();
  const validatedRules = requireLanguageRules(rules);
  const shouldApplyCombinations = requireCombinationsEnabled(combinationsEnabled);
  let translatedFragments: TranslationFragment[] = [
    { text: normalizedText, converted: false },
  ];

  if (shouldApplyCombinations) {
    translatedFragments = applyRuleGroup(
      translatedFragments,
      validatedRules.combinations,
    );
  }

  translatedFragments = applyRuleGroup(
    translatedFragments,
    validatedRules.characters,
  );

  return translatedFragments.map((fragment) => fragment.text).join('').toLowerCase();
}
