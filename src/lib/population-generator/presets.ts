import { describePopulationValue } from './describe-population-value';
import type { PopulationEra, PopulationPreset, PopulationSize } from './types';

const POPULATION_PRESETS = [
  { era: 'medieval', size: 'village', min: 0, max: 1_000 },
  { era: 'medieval', size: 'town', min: 1_000, max: 10_000 },
  { era: 'medieval', size: 'city', min: 10_000, max: 20_000 },
  { era: 'medieval', size: 'large-city', min: 20_000, max: 270_000 },
  { era: 'modern', size: 'village', min: 0, max: 5_000 },
  { era: 'modern', size: 'town', min: 5_000, max: 20_000 },
  { era: 'modern', size: 'city', min: 20_000, max: 200_000 },
  { era: 'modern', size: 'large-city', min: 200_000, max: 1_100_000 },
  { era: 'modern', size: 'metropolis', min: 1_000_000, max: 9_000_000 },
  { era: 'future', size: 'village', min: 0, max: 5_000 },
  { era: 'future', size: 'town', min: 5_000, max: 20_000 },
  { era: 'future', size: 'city', min: 20_000, max: 200_000 },
  { era: 'future', size: 'large-city', min: 200_000, max: 1_100_000 },
  { era: 'future', size: 'metropolis', min: 1_000_000, max: 9_000_000 },
] as const satisfies readonly PopulationPreset[];

export function listAllPopulationPresets(): readonly PopulationPreset[] {
  return POPULATION_PRESETS;
}

export function requirePopulationEra(value: unknown): PopulationEra {
  if (value === 'medieval' || value === 'modern' || value === 'future') {
    return value;
  }

  throw new Error(
    `Population era must be "medieval", "modern", or "future". Received ${describePopulationValue(value)}.`,
  );
}

export function requirePopulationSize(value: unknown): PopulationSize {
  if (
    value === 'village' ||
    value === 'town' ||
    value === 'city' ||
    value === 'large-city' ||
    value === 'metropolis'
  ) {
    return value;
  }

  throw new Error(
    `Population size must be "village", "town", "city", "large-city", or "metropolis". Received ${describePopulationValue(value)}.`,
  );
}

export function getPopulationPresets(era: PopulationEra): PopulationPreset[] {
  const populationEra = requirePopulationEra(era);
  return POPULATION_PRESETS.filter((preset) => preset.era === populationEra).map((preset) => ({
    era: preset.era,
    size: preset.size,
    min: preset.min,
    max: preset.max,
  }));
}

export function requirePopulationPreset(era: PopulationEra, size: PopulationSize): PopulationPreset {
  const populationEra = requirePopulationEra(era);
  const populationSize = requirePopulationSize(size);
  const preset = getPopulationPresets(populationEra).find((entry) => entry.size === populationSize);

  if (!preset) {
    throw new Error(
      `Population size ${JSON.stringify(populationSize)} is not available for era ${JSON.stringify(populationEra)}. Received ${JSON.stringify(populationSize)}.`,
    );
  }

  return preset;
}
