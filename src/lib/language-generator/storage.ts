import type { LanguageRulePair, LanguageRules } from './types';

export const LANGUAGE_RULE_STORAGE_KEY = 'tokenmaker.language-generator.rules';
export const LANGUAGE_RULE_SLOT_COUNT = 8;

const LANGUAGE_RULE_PAIR_COUNT = 26;
const CHARACTER_RULE_FIELD_LIMIT = 3;
const COMBINATION_RULE_FIELD_LIMIT = 4;
const RULE_PAIR_FIELD_NAMES = ['source', 'target'] as const;
const RULE_GROUP_NAMES = ['characters', 'combinations'] as const;

export type LanguageRuleStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

type RuleGroupName = 'characters' | 'combinations';

function stringifyFailureReason(error: unknown): string {
  if (error instanceof Error) {
    return error.message.length > 0 ? error.message : `${error.name} with empty message`;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error === undefined) {
    return 'undefined';
  }

  if (error === null) {
    return 'null';
  }

  if (typeof error === 'number' || typeof error === 'boolean' || typeof error === 'bigint') {
    return String(error);
  }

  return Object.prototype.toString.call(error);
}

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    if (typeof serialized === 'string') {
      return serialized;
    }

    return Object.prototype.toString.call(value);
  } catch (error: unknown) {
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${stringifyFailureReason(error)}).`;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireRuleStorage(storage: unknown): LanguageRuleStorage {
  if (!isRecord(storage)) {
    throw new Error(
      `Language rule storage must be an object. Received ${describeReceivedValue(storage)}.`,
    );
  }

  if (typeof storage.getItem !== 'function') {
    throw new Error(
      `Language rule storage getItem must be a function. Received ${describeReceivedValue(storage.getItem)}.`,
    );
  }

  if (typeof storage.setItem !== 'function') {
    throw new Error(
      `Language rule storage setItem must be a function. Received ${describeReceivedValue(storage.setItem)}.`,
    );
  }

  return storage as LanguageRuleStorage;
}

function requireRuleSlotNumber(slotNumber: unknown): number {
  if (
    typeof slotNumber === 'number' &&
    Number.isInteger(slotNumber) &&
    slotNumber >= 1 &&
    slotNumber <= LANGUAGE_RULE_SLOT_COUNT
  ) {
    return slotNumber;
  }

  throw new Error(
    `Language rule slot must be an integer from 1 to ${LANGUAGE_RULE_SLOT_COUNT}. Received ${describeReceivedValue(slotNumber)}.`,
  );
}

function createEmptyRuleSlots(): Array<LanguageRules | null> {
  return Array.from({ length: LANGUAGE_RULE_SLOT_COUNT }, () => null);
}

function formatStorageContext(slotNumber: number | undefined): string {
  return slotNumber === undefined
    ? 'while reading all language rule slots'
    : `while accessing language rule slot ${slotNumber}`;
}

function throwStorageFailure(
  operation: 'getItem' | 'setItem',
  slotNumber: number | undefined,
  receivedValue: unknown,
): never {
  const detail = stringifyFailureReason(receivedValue);
  throw new Error(
    `Language rule storage ${operation} failed for key ${JSON.stringify(LANGUAGE_RULE_STORAGE_KEY)} ${formatStorageContext(slotNumber)}. Received ${JSON.stringify(detail)}.`,
    { cause: receivedValue },
  );
}

function readStoredJson(
  storage: LanguageRuleStorage,
  slotNumber: number | undefined,
): unknown {
  let rawRules: string | null;
  try {
    rawRules = storage.getItem(LANGUAGE_RULE_STORAGE_KEY);
  } catch (error: unknown) {
    return throwStorageFailure('getItem', slotNumber, error);
  }

  if (rawRules === null) {
    return undefined;
  }

  if (typeof rawRules !== 'string') {
    throw new Error(
      `Language rule storage getItem returned an invalid value for key ${JSON.stringify(LANGUAGE_RULE_STORAGE_KEY)} ${formatStorageContext(slotNumber)}. Received ${describeReceivedValue(rawRules)}.`,
    );
  }

  try {
    return JSON.parse(rawRules) as unknown;
  } catch (error: unknown) {
    throw new Error(
      `Language rule storage key ${JSON.stringify(LANGUAGE_RULE_STORAGE_KEY)} contains invalid JSON ${formatStorageContext(slotNumber)}. Received ${JSON.stringify(rawRules.slice(0, 120))}.`,
      { cause: error },
    );
  }
}

function requireRuleSlotsArray(parsedRules: unknown): unknown[] {
  if (!Array.isArray(parsedRules) || parsedRules.length !== LANGUAGE_RULE_SLOT_COUNT) {
    throw new Error(
      `Language rule storage key ${JSON.stringify(LANGUAGE_RULE_STORAGE_KEY)} must contain an array of ${LANGUAGE_RULE_SLOT_COUNT} slots. Received ${describeReceivedValue(parsedRules)}.`,
    );
  }

  return parsedRules;
}

function requireExactRulePairFields(
  receivedPair: Record<string, unknown>,
  groupName: RuleGroupName,
  pairIndex: number,
): void {
  const receivedFieldNames = Object.keys(receivedPair).sort();
  const expectedFieldNames = [...RULE_PAIR_FIELD_NAMES].sort();
  if (
    receivedFieldNames.length !== expectedFieldNames.length ||
    receivedFieldNames.some((fieldName, index) => fieldName !== expectedFieldNames[index])
  ) {
    throw new Error(
      `Language rule ${groupName}[${pairIndex + 1}] must contain only source and target fields. Received ${describeReceivedValue(receivedPair)}.`,
    );
  }
}

function requireExactRuleGroupFields(receivedRules: Record<string, unknown>): void {
  const receivedFieldNames = Object.keys(receivedRules).sort();
  const expectedFieldNames = [...RULE_GROUP_NAMES].sort();
  if (
    receivedFieldNames.length !== expectedFieldNames.length ||
    receivedFieldNames.some((fieldName, index) => fieldName !== expectedFieldNames[index])
  ) {
    throw new Error(
      `Language rules must contain only characters and combinations fields. Received ${describeReceivedValue(receivedRules)}.`,
    );
  }
}

function requireRulePair(
  receivedPair: unknown,
  groupName: RuleGroupName,
  pairIndex: number,
  fieldLimit: number,
): LanguageRulePair {
  if (!isRecord(receivedPair)) {
    throw new Error(
      `Language rule ${groupName}[${pairIndex + 1}] must be an object with source and target strings. Received ${describeReceivedValue(receivedPair)}.`,
    );
  }

  requireExactRulePairFields(receivedPair, groupName, pairIndex);

  for (const fieldName of RULE_PAIR_FIELD_NAMES) {
    const fieldValue = receivedPair[fieldName];
    if (typeof fieldValue !== 'string') {
      throw new Error(
        `Language rule ${groupName}[${pairIndex + 1}].${fieldName} must be a string. Received ${describeReceivedValue(fieldValue)}.`,
      );
    }

    if (fieldValue.length > fieldLimit) {
      throw new Error(
        `Language rule ${groupName}[${pairIndex + 1}].${fieldName} must be at most ${fieldLimit} characters. Received ${JSON.stringify(fieldValue)}.`,
      );
    }
  }

  return {
    source: receivedPair.source as string,
    target: receivedPair.target as string,
  };
}

function requireRuleGroup(
  receivedGroup: unknown,
  groupName: RuleGroupName,
  fieldLimit: number,
): LanguageRulePair[] {
  if (!Array.isArray(receivedGroup) || receivedGroup.length !== LANGUAGE_RULE_PAIR_COUNT) {
    throw new Error(
      `Language rule ${groupName} must contain exactly ${LANGUAGE_RULE_PAIR_COUNT} pairs. Received ${describeReceivedValue(receivedGroup)}.`,
    );
  }

  const validatedPairs: LanguageRulePair[] = [];
  for (let pairIndex = 0; pairIndex < LANGUAGE_RULE_PAIR_COUNT; pairIndex += 1) {
    validatedPairs.push(
      requireRulePair(receivedGroup[pairIndex], groupName, pairIndex, fieldLimit),
    );
  }

  return validatedPairs;
}

function requireLanguageRules(receivedRules: unknown, slotNumber: number | undefined): LanguageRules {
  if (!isRecord(receivedRules)) {
    const slotContext = slotNumber === undefined ? '' : ` in slot ${slotNumber}`;
    throw new Error(
      `Language rules${slotContext} must be an object with characters and combinations arrays. Received ${describeReceivedValue(receivedRules)}.`,
    );
  }

  requireExactRuleGroupFields(receivedRules);

  const characters = requireRuleGroup(
    receivedRules.characters,
    'characters',
    CHARACTER_RULE_FIELD_LIMIT,
  );
  const combinations = requireRuleGroup(
    receivedRules.combinations,
    'combinations',
    COMBINATION_RULE_FIELD_LIMIT,
  );

  return { characters, combinations };
}

function readRuleSlotsFromStorage(
  storage: LanguageRuleStorage,
  requestedSlotNumber: number | undefined,
): Array<LanguageRules | null> {
  const parsedRules = readStoredJson(storage, requestedSlotNumber);
  if (parsedRules === undefined) {
    return createEmptyRuleSlots();
  }

  return requireRuleSlotsArray(parsedRules).map((receivedRules, slotIndex) =>
    receivedRules === null
      ? null
      : requireLanguageRules(receivedRules, slotIndex + 1),
  );
}

export function readRuleSlots(storage: LanguageRuleStorage): Array<LanguageRules | null> {
  const validatedStorage = requireRuleStorage(storage);
  return readRuleSlotsFromStorage(validatedStorage, undefined);
}

export function saveRuleSlot(
  storage: LanguageRuleStorage,
  slotNumber: number,
  rules: LanguageRules,
): void {
  const validatedSlotNumber = requireRuleSlotNumber(slotNumber);
  const validatedRules = requireLanguageRules(rules, validatedSlotNumber);
  const validatedStorage = requireRuleStorage(storage);
  const ruleSlots = readRuleSlotsFromStorage(validatedStorage, validatedSlotNumber);
  ruleSlots[validatedSlotNumber - 1] = validatedRules;

  const serializedRuleSlots = JSON.stringify(ruleSlots);
  try {
    validatedStorage.setItem(LANGUAGE_RULE_STORAGE_KEY, serializedRuleSlots);
  } catch (error: unknown) {
    return throwStorageFailure('setItem', validatedSlotNumber, error);
  }
}

export function loadRuleSlot(
  storage: LanguageRuleStorage,
  slotNumber: number,
): LanguageRules | null {
  const validatedSlotNumber = requireRuleSlotNumber(slotNumber);
  const validatedStorage = requireRuleStorage(storage);
  return readRuleSlotsFromStorage(validatedStorage, validatedSlotNumber)[validatedSlotNumber - 1];
}
