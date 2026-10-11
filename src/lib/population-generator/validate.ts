import { describePopulationValue } from './describe-population-value';
import { requirePopulationEra, requirePopulationPreset, requirePopulationSize } from './presets';
import type { PopulationAgriculture, PopulationProfession, PopulationResult, PopulationStat } from './types';

const POPULATION_PROFESSION_COUNT = 170;

const RESULT_KEYS = [
  'version',
  'era',
  'size',
  'nameLabel',
  'name',
  'population',
  'households',
  'areaKm2',
  'areaMi2',
  'agriculture',
  'professions',
] as const;

const STAT_KEYS = ['label', 'value'] as const;

const AGRICULTURE_KEYS = ['farmers', 'farmland', 'livestock', 'fowl', 'cattleAndPigs', 'otherLivestock'] as const;

const PROFESSION_KEYS = ['id', 'name', 'count'] as const;

function requireRecord(fieldPath: string, value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Population ${fieldPath} must be an object. Received ${describePopulationValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function requireExactKeys(fieldPath: string, record: Record<string, unknown>, expectedKeys: readonly string[]): void {
  for (const key of Object.keys(record)) {
    if (!expectedKeys.includes(key)) {
      throw new Error(
        `Population ${fieldPath} has unknown field ${JSON.stringify(key)}. Received ${describePopulationValue(record)}.`,
      );
    }
  }

  for (const key of expectedKeys) {
    if (!Object.hasOwn(record, key)) {
      throw new Error(
        `Population ${fieldPath} is missing ${JSON.stringify(key)}. Received ${describePopulationValue(record)}.`,
      );
    }
  }
}

function requireString(fieldPath: string, value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error(`Population ${fieldPath} must be a string. Received ${describePopulationValue(value)}.`);
  }

  return value;
}

function requireNonNegativeInteger(fieldPath: string, value: unknown): number {
  if (typeof value !== 'number' || Object.is(value, -0) || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Population ${fieldPath} must be a non-negative integer. Received ${describePopulationValue(value)}.`);
  }

  return value;
}

function requireNonNegativeFinite(fieldPath: string, value: unknown): number {
  if (typeof value !== 'number' || Object.is(value, -0) || !Number.isFinite(value) || value < 0) {
    throw new Error(
      `Population ${fieldPath} must be a non-negative finite number. Received ${describePopulationValue(value)}.`,
    );
  }

  return value;
}

function requireStat(fieldPath: string, value: unknown, valueKind: 'integer' | 'area'): PopulationStat {
  const record = requireRecord(fieldPath, value);
  requireExactKeys(fieldPath, record, STAT_KEYS);
  return {
    label: requireString(`${fieldPath}.label`, record.label),
    value:
      valueKind === 'integer'
        ? requireNonNegativeInteger(`${fieldPath}.value`, record.value)
        : requireNonNegativeFinite(`${fieldPath}.value`, record.value),
  };
}

function requireAgriculture(value: unknown): PopulationAgriculture {
  const record = requireRecord('agriculture', value);
  requireExactKeys('agriculture', record, AGRICULTURE_KEYS);
  return {
    farmers: requireStat('agriculture.farmers', record.farmers, 'integer'),
    farmland: requireStat('agriculture.farmland', record.farmland, 'integer'),
    livestock: requireStat('agriculture.livestock', record.livestock, 'integer'),
    fowl: requireStat('agriculture.fowl', record.fowl, 'integer'),
    cattleAndPigs: requireStat('agriculture.cattleAndPigs', record.cattleAndPigs, 'integer'),
    otherLivestock: requireStat('agriculture.otherLivestock', record.otherLivestock, 'integer'),
  };
}

function requireProfession(index: number, value: unknown, seenIds: Set<string>): PopulationProfession {
  const fieldPath = `professions[${index}]`;
  const record = requireRecord(fieldPath, value);
  requireExactKeys(fieldPath, record, PROFESSION_KEYS);
  const id = requireString(`${fieldPath}.id`, record.id);

  if (id.length === 0) {
    throw new Error(`Population ${fieldPath}.id must be a non-empty string. Received "".`);
  }

  if (seenIds.has(id)) {
    throw new Error(`Population professions contain duplicate id ${JSON.stringify(id)}.`);
  }

  seenIds.add(id);
  return {
    id,
    name: requireString(`${fieldPath}.name`, record.name),
    count: requireNonNegativeInteger(`${fieldPath}.count`, record.count),
  };
}

function requireProfessions(value: unknown): PopulationProfession[] {
  if (!Array.isArray(value)) {
    throw new Error(`Population professions must be an array. Received ${describePopulationValue(value)}.`);
  }

  if (value.length !== POPULATION_PROFESSION_COUNT) {
    throw new Error(
      `Population professions must contain ${POPULATION_PROFESSION_COUNT} entries. Received ${value.length}.`,
    );
  }

  const seenIds = new Set<string>();
  return value.map((entry, index) => requireProfession(index, entry, seenIds));
}

export function validatePopulationResult(value: unknown): PopulationResult {
  const record = requireRecord('result', value);
  requireExactKeys('result', record, RESULT_KEYS);

  if (record.version !== 1) {
    throw new Error(`Population result version must be 1. Received ${describePopulationValue(record.version)}.`);
  }

  const era = requirePopulationEra(record.era);
  const size = requirePopulationSize(record.size);
  requirePopulationPreset(era, size);

  return {
    version: 1,
    era,
    size,
    nameLabel: requireString('nameLabel', record.nameLabel),
    name: requireString('name', record.name),
    population: requireStat('population', record.population, 'integer'),
    households: requireStat('households', record.households, 'integer'),
    areaKm2: requireStat('areaKm2', record.areaKm2, 'area'),
    areaMi2: requireStat('areaMi2', record.areaMi2, 'area'),
    agriculture: requireAgriculture(record.agriculture),
    professions: requireProfessions(record.professions),
  };
}
