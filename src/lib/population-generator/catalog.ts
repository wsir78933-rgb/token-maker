import { describePopulationValue } from './describe-population-value';
import { POPULATION_PROFESSION_DEFINITIONS, type PopulationProfessionDefinition } from './profession-definitions';
import { requirePopulationEra } from './presets';
import type { PopulationEra } from './types';

const POPULATION_PROFESSION_COUNT = 170;
const POPULATION_ERAS = ['medieval', 'modern', 'future'] as const satisfies readonly PopulationEra[];

function assertProfessionDefinition(era: PopulationEra, index: number, definition: PopulationProfessionDefinition): void {
  const fieldPath = `${era} professions[${index}]`;
  const slug = definition.id.startsWith(`${era}:`) ? definition.id.slice(era.length + 1) : '';
  if (slug.length === 0 || slug.includes(':')) {
    throw new Error(
      `Population ${fieldPath} id must start with ${JSON.stringify(`${era}:`)} and include a slug. Received ${JSON.stringify(definition.id)}.`,
    );
  }

  if (definition.englishName.length === 0) {
    throw new Error(`Population ${fieldPath} englishName must be a non-empty string. Received "".`);
  }

  if (definition.chineseName.length === 0) {
    throw new Error(`Population ${fieldPath} chineseName must be a non-empty string. Received "".`);
  }

  if (!Number.isSafeInteger(definition.peoplePerOne) || definition.peoplePerOne <= 0) {
    throw new Error(
      `Population ${fieldPath} peoplePerOne must be a positive integer. Received ${describePopulationValue(definition.peoplePerOne)}.`,
    );
  }

  if (!Number.isSafeInteger(definition.appearanceWeight) || definition.appearanceWeight < 0) {
    throw new Error(
      `Population ${fieldPath} appearanceWeight must be a non-negative integer. Received ${describePopulationValue(definition.appearanceWeight)}.`,
    );
  }
}

function assertCatalog(era: PopulationEra, definitions: readonly PopulationProfessionDefinition[]): void {
  if (definitions.length !== POPULATION_PROFESSION_COUNT) {
    throw new Error(
      `Population ${era} catalog must contain ${POPULATION_PROFESSION_COUNT} professions. Received ${definitions.length}.`,
    );
  }

  const seenIds = new Set<string>();
  const seenEnglishNames = new Set<string>();
  definitions.forEach((definition, index) => {
    assertProfessionDefinition(era, index, definition);
    if (seenIds.has(definition.id)) {
      throw new Error(`Population ${era} catalog contains duplicate id ${JSON.stringify(definition.id)}.`);
    }

    if (seenEnglishNames.has(definition.englishName)) {
      throw new Error(
        `Population ${era} catalog contains duplicate English name ${JSON.stringify(definition.englishName)}.`,
      );
    }

    seenIds.add(definition.id);
    seenEnglishNames.add(definition.englishName);
  });
}

for (const era of POPULATION_ERAS) {
  assertCatalog(era, POPULATION_PROFESSION_DEFINITIONS[era]);
}

export function listPopulationProfessionDefinitions(era: PopulationEra): readonly PopulationProfessionDefinition[] {
  const populationEra = requirePopulationEra(era);
  return POPULATION_PROFESSION_DEFINITIONS[populationEra];
}
