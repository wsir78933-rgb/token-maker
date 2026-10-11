import { describeReceivedValue } from './population-boundary';

export const POPULATION_ERAS = ['medieval', 'modern', 'future'] as const;
export const POPULATION_SIZES = ['village', 'town', 'city', 'large-city', 'metropolis'] as const;

export type PopulationEraName = (typeof POPULATION_ERAS)[number];
export type PopulationSizeName = (typeof POPULATION_SIZES)[number];

export interface PopulationPresetRange {
  era: PopulationEraName;
  size: PopulationSizeName;
  min: number;
  max: number;
}

export function isPopulationEraName(value: unknown): value is PopulationEraName {
  return value === 'medieval' || value === 'modern' || value === 'future';
}

export function isPopulationSizeName(value: unknown): value is PopulationSizeName {
  return (
    value === 'village' ||
    value === 'town' ||
    value === 'city' ||
    value === 'large-city' ||
    value === 'metropolis'
  );
}

export function orderPopulationPresets<Preset extends PopulationPresetRange>(
  era: PopulationEraName,
  presets: readonly Preset[],
): Preset[] {
  if (!isPopulationEraName(era)) {
    throw new Error(`Population era must be medieval, modern, or future. Received ${describeReceivedValue(era)}.`);
  }

  if (!Array.isArray(presets)) {
    throw new Error(
      `Population presets for ${era} must be an array. Received ${describeReceivedValue(presets)}.`,
    );
  }

  const presetsBySize = new Map<PopulationSizeName, Preset>();
  for (const preset of presets) {
    if (preset === null || typeof preset !== 'object') {
      throw new Error(
        `Population preset for ${era} must be an object. Received ${describeReceivedValue(preset)}.`,
      );
    }

    if (!isPopulationSizeName(preset.size) || preset.era !== era) {
      throw new Error(
        `Population preset does not belong to ${era}. Received ${describeReceivedValue(preset)}.`,
      );
    }

    if (presetsBySize.has(preset.size)) {
      throw new Error(`Duplicate population preset ${era}/${preset.size}.`);
    }

    if (!Number.isFinite(preset.min) || !Number.isFinite(preset.max) || preset.min < 0 || preset.max < preset.min) {
      throw new Error(
        `Population preset ${era}/${preset.size} has an invalid range. Received min=${String(preset.min)} max=${String(preset.max)}.`,
      );
    }

    presetsBySize.set(preset.size, preset);
  }

  if (presetsBySize.size === 0) {
    throw new Error(`Population era ${era} returned no presets.`);
  }

  return POPULATION_SIZES.flatMap((size) => {
    const preset = presetsBySize.get(size);
    return preset === undefined ? [] : [preset];
  });
}

export function requirePopulationPreset<Preset extends PopulationPresetRange>(
  era: PopulationEraName,
  size: PopulationSizeName,
  presets: readonly Preset[],
): Preset {
  if (!isPopulationSizeName(size)) {
    throw new Error(`Population size is not recognized. Received ${describeReceivedValue(size)}.`);
  }

  const orderedPresets = orderPopulationPresets(era, presets);
  const match = orderedPresets.find((preset) => preset.size === size);
  if (match === undefined) {
    const available = orderedPresets.map((preset) => preset.size).join(', ');
    throw new Error(`No population preset for ${era}/${size}. Available: ${available}.`);
  }

  return match;
}

export function formatPopulationRange(min: number, max: number, locale: 'en' | 'zh'): string {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(`Population range locale must be "en" or "zh". Received ${describeReceivedValue(locale)}.`);
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error(`Population range must be finite. Received min=${String(min)} max=${String(max)}.`);
  }

  const numberLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
  return `${min.toLocaleString(numberLocale)}–${max.toLocaleString(numberLocale)}`;
}
