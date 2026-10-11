import type {
  PopulationProfession,
  PopulationResult,
} from '@/lib/population-generator';

import { describeReceivedValue } from './population-boundary';
import { isPopulationEraName, isPopulationSizeName } from './population-preset-list';

export const POPULATION_STAT_KEYS = ['population', 'households', 'areaKm2', 'areaMi2'] as const;
export const POPULATION_AGRICULTURE_KEYS = [
  'farmers',
  'farmland',
  'livestock',
  'fowl',
  'cattleAndPigs',
  'otherLivestock',
] as const;
export const POPULATION_PROFESSION_COUNT = 170;

export type PopulationStatKey = (typeof POPULATION_STAT_KEYS)[number];
export type PopulationAgricultureKey = (typeof POPULATION_AGRICULTURE_KEYS)[number];

export type PopulationTextField =
  | { kind: 'name-label' }
  | { kind: 'name' }
  | { kind: 'stat-label'; stat: PopulationStatKey }
  | { kind: 'agriculture-label'; item: PopulationAgricultureKey }
  | { kind: 'profession-name'; professionId: string };

export type PopulationNumberField =
  | { kind: 'stat-value'; stat: PopulationStatKey }
  | { kind: 'agriculture-value'; item: PopulationAgricultureKey }
  | { kind: 'profession-count'; professionId: string };

type PopulationLabeledValue = PopulationResult['population'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertLabeledValue(value: unknown, fieldName: string, integer: boolean): PopulationLabeledValue {
  if (!isRecord(value) || typeof value.label !== 'string' || typeof value.value !== 'number') {
    throw new Error(
      `Population field ${fieldName} must be { label: string, value: number }. Received ${describeReceivedValue(value)}.`,
    );
  }

  if (!Number.isFinite(value.value) || value.value < 0) {
    throw new Error(
      `Population field ${fieldName} must be a non-negative finite number. Received ${String(value.value)}.`,
    );
  }

  if (integer && !Number.isSafeInteger(value.value)) {
    throw new Error(
      `Population field ${fieldName} must be a non-negative integer. Received ${String(value.value)}.`,
    );
  }

  return { label: value.label, value: value.value };
}

function assertProfession(value: unknown, index: number): PopulationProfession {
  if (!isRecord(value) || typeof value.id !== 'string' || value.id.length === 0 || typeof value.name !== 'string') {
    throw new Error(
      `Population profession ${index + 1} must have a non-empty id and a string name. Received ${describeReceivedValue(value)}.`,
    );
  }

  if (typeof value.count !== 'number' || !Number.isSafeInteger(value.count) || value.count < 0) {
    throw new Error(
      `Population profession ${JSON.stringify(value.id)} count must be a non-negative integer. Received ${describeReceivedValue(value.count)}.`,
    );
  }

  return { id: value.id, name: value.name, count: value.count };
}

export function assertPopulationResultShape(value: PopulationResult): void {
  if (!isRecord(value)) {
    throw new Error(`Population result must be an object. Received ${describeReceivedValue(value)}.`);
  }

  if (value.version !== 1) {
    throw new Error(`Population result version must be 1. Received ${describeReceivedValue(value.version)}.`);
  }

  if (!isPopulationEraName(value.era) || !isPopulationSizeName(value.size)) {
    throw new Error(
      `Population result era/size is not recognized. Received era=${describeReceivedValue(value.era)} size=${describeReceivedValue(value.size)}.`,
    );
  }

  if (typeof value.nameLabel !== 'string' || typeof value.name !== 'string') {
    throw new Error(
      `Population result nameLabel and name must be strings. Received nameLabel=${describeReceivedValue(value.nameLabel)} name=${describeReceivedValue(value.name)}.`,
    );
  }

  for (const stat of POPULATION_STAT_KEYS) {
    assertLabeledValue(value[stat], stat, stat !== 'areaKm2' && stat !== 'areaMi2');
  }

  if (!isRecord(value.agriculture)) {
    throw new Error(
      `Population agriculture must be an object. Received ${describeReceivedValue(value.agriculture)}.`,
    );
  }

  for (const item of POPULATION_AGRICULTURE_KEYS) {
    assertLabeledValue(value.agriculture[item], `agriculture.${item}`, true);
  }

  if (!Array.isArray(value.professions)) {
    throw new Error(
      `Population professions must be an array. Received ${describeReceivedValue(value.professions)}.`,
    );
  }

  if (value.professions.length !== POPULATION_PROFESSION_COUNT) {
    throw new Error(
      `Population result must contain ${POPULATION_PROFESSION_COUNT} professions. Received ${value.professions.length}.`,
    );
  }

  const seenIds = new Set<string>();
  value.professions.forEach((profession, index) => {
    const checked = assertProfession(profession, index);
    if (seenIds.has(checked.id)) {
      throw new Error(`Duplicate population profession id ${JSON.stringify(checked.id)}.`);
    }
    seenIds.add(checked.id);
  });
}

export function populationFieldKey(field: PopulationTextField | PopulationNumberField): string {
  return JSON.stringify(field);
}

export function numberFieldFromKey(key: string): PopulationNumberField {
  let parsed: unknown;
  try {
    parsed = JSON.parse(key);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Population number field key is not valid JSON. Received ${JSON.stringify(key)}.`);
    }
    throw error;
  }

  if (!isRecord(parsed) || typeof parsed.kind !== 'string') {
    throw new Error(`Population number field key is not recognized. Received ${JSON.stringify(key)}.`);
  }

  if (parsed.kind === 'stat-value' && isStatKey(parsed.stat)) {
    return { kind: 'stat-value', stat: parsed.stat };
  }

  if (parsed.kind === 'agriculture-value' && isAgricultureKey(parsed.item)) {
    return { kind: 'agriculture-value', item: parsed.item };
  }

  if (parsed.kind === 'profession-count' && typeof parsed.professionId === 'string' && parsed.professionId.length > 0) {
    return { kind: 'profession-count', professionId: parsed.professionId };
  }

  throw new Error(`Population number field key is not recognized. Received ${JSON.stringify(key)}.`);
}

function isStatKey(value: unknown): value is PopulationStatKey {
  return POPULATION_STAT_KEYS.some((stat) => stat === value);
}

function isAgricultureKey(value: unknown): value is PopulationAgricultureKey {
  return POPULATION_AGRICULTURE_KEYS.some((item) => item === value);
}

function replaceProfession(
  result: PopulationResult,
  professionId: string,
  replace: (profession: PopulationProfession) => PopulationProfession,
): PopulationResult {
  let found = false;
  const professions = result.professions.map((profession) => {
    if (profession.id !== professionId) {
      return profession;
    }

    found = true;
    return replace(profession);
  });

  if (!found) {
    throw new Error(`Population profession id ${JSON.stringify(professionId)} was not found.`);
  }

  return { ...result, professions };
}

export function readPopulationText(result: PopulationResult, field: PopulationTextField): string {
  switch (field.kind) {
    case 'name-label':
      return result.nameLabel;
    case 'name':
      return result.name;
    case 'stat-label':
      return result[field.stat].label;
    case 'agriculture-label':
      return result.agriculture[field.item].label;
    case 'profession-name': {
      const profession = result.professions.find((entry) => entry.id === field.professionId);
      if (profession === undefined) {
        throw new Error(`Population profession id ${JSON.stringify(field.professionId)} was not found.`);
      }
      return profession.name;
    }
    default: {
      const unexpected: never = field;
      throw new Error(`Unknown population text field ${JSON.stringify(unexpected)}.`);
    }
  }
}

export function writePopulationText(
  result: PopulationResult,
  field: PopulationTextField,
  nextText: string,
): PopulationResult {
  if (typeof nextText !== 'string') {
    throw new Error(`Population text edit must be a string. Received ${describeReceivedValue(nextText)}.`);
  }

  switch (field.kind) {
    case 'name-label':
      return { ...result, nameLabel: nextText };
    case 'name':
      return { ...result, name: nextText };
    case 'stat-label':
      return { ...result, [field.stat]: { ...result[field.stat], label: nextText } };
    case 'agriculture-label':
      return {
        ...result,
        agriculture: {
          ...result.agriculture,
          [field.item]: { ...result.agriculture[field.item], label: nextText },
        },
      };
    case 'profession-name':
      return replaceProfession(result, field.professionId, (profession) => ({ ...profession, name: nextText }));
    default: {
      const unexpected: never = field;
      throw new Error(`Unknown population text field ${JSON.stringify(unexpected)}.`);
    }
  }
}

export function readPopulationNumber(result: PopulationResult, field: PopulationNumberField): number {
  switch (field.kind) {
    case 'stat-value':
      return result[field.stat].value;
    case 'agriculture-value':
      return result.agriculture[field.item].value;
    case 'profession-count': {
      const profession = result.professions.find((entry) => entry.id === field.professionId);
      if (profession === undefined) {
        throw new Error(`Population profession id ${JSON.stringify(field.professionId)} was not found.`);
      }
      return profession.count;
    }
    default: {
      const unexpected: never = field;
      throw new Error(`Unknown population number field ${JSON.stringify(unexpected)}.`);
    }
  }
}

export function writePopulationNumber(
  result: PopulationResult,
  field: PopulationNumberField,
  nextValue: number,
): PopulationResult {
  if (typeof nextValue !== 'number' || !Number.isFinite(nextValue) || nextValue < 0) {
    throw new Error(`Population number edit must be a non-negative finite number. Received ${String(nextValue)}.`);
  }

  switch (field.kind) {
    case 'stat-value':
      return { ...result, [field.stat]: { ...result[field.stat], value: nextValue } };
    case 'agriculture-value':
      return {
        ...result,
        agriculture: {
          ...result.agriculture,
          [field.item]: { ...result.agriculture[field.item], value: nextValue },
        },
      };
    case 'profession-count':
      if (!Number.isSafeInteger(nextValue)) {
        throw new Error(
          `Population profession count must be a non-negative integer. Received ${String(nextValue)}.`,
        );
      }
      return replaceProfession(result, field.professionId, (profession) => ({ ...profession, count: nextValue }));
    default: {
      const unexpected: never = field;
      throw new Error(`Unknown population number field ${JSON.stringify(unexpected)}.`);
    }
  }
}

export function populationNumberKind(field: PopulationNumberField): 'integer' | 'decimal' {
  if (field.kind === 'stat-value' && (field.stat === 'areaKm2' || field.stat === 'areaMi2')) {
    return 'decimal';
  }

  return 'integer';
}
