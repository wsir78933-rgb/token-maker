import type { SiteLocale } from '@/lib/site-locale';

import { listPopulationProfessionDefinitions } from './catalog';
import { describePopulationValue } from './describe-population-value';
import { listAllPopulationPresets, requirePopulationEra, requirePopulationPreset, requirePopulationSize } from './presets';
import { createSettlementName } from './settlement-names';
import type {
  PopulationEra,
  PopulationGenerationRequest,
  PopulationPreset,
  PopulationProfession,
  PopulationRandomRequest,
  PopulationResult,
  PopulationStat,
} from './types';

const SQUARE_MILES_PER_SQUARE_KILOMETER = 0.386102;

type RandomUnitSource = () => number;

type SettlementFactors = {
  farmerDivisor: number;
  farmlandAcresPerPerson: number;
  householdDivisor: number;
  peoplePerSquareKilometer: number;
  livestockPerPerson: number;
};

type SettlementLabels = {
  name: string;
  population: string;
  households: string;
  areaKm2: string;
  areaMi2: string;
  farmers: string;
  farmland: string;
  livestock: string;
  fowl: string;
  cattleAndPigs: string;
  otherLivestock: string;
};

const SETTLEMENT_LABELS: Record<SiteLocale, SettlementLabels> = {
  en: {
    name: 'Settlement name',
    population: 'Population',
    households: 'Households',
    areaKm2: 'Area (km²)',
    areaMi2: 'Area (mi²)',
    farmers: 'Farmers',
    farmland: 'Farmland (acres)',
    livestock: 'Livestock',
    fowl: 'Fowl',
    cattleAndPigs: 'Cattle and pigs',
    otherLivestock: 'Other livestock',
  },
  zh: {
    name: '聚落名称',
    population: '总人口',
    households: '住户',
    areaKm2: '面积（km²）',
    areaMi2: '面积（mi²）',
    farmers: '农民人数',
    farmland: '种植农田（英亩）',
    livestock: '牲畜总数',
    fowl: '禽类',
    cattleAndPigs: '牛与猪',
    otherLivestock: '其他牲畜',
  },
};

function requireRandomSource(random: unknown): RandomUnitSource {
  if (random === undefined) {
    return Math.random;
  }

  if (typeof random !== 'function') {
    throw new Error(`Population random must be a function. Received ${describePopulationValue(random)}.`);
  }

  return () => {
    const unit = random();
    if (typeof unit !== 'number' || !Number.isFinite(unit) || unit < 0 || unit >= 1) {
      throw new Error(
        `Population random() must return a finite number in [0, 1). Received ${describePopulationValue(unit)}.`,
      );
    }

    return unit;
  };
}

function requirePopulationLocale(value: unknown): SiteLocale {
  if (value === 'en' || value === 'zh') {
    return value;
  }

  throw new Error(`Population locale must be "en" or "zh". Received ${describePopulationValue(value)}.`);
}

function requireGenerationRequest(value: unknown): PopulationGenerationRequest {
  if (value === null || typeof value !== 'object') {
    throw new Error(`Population generation request must be an object. Received ${describePopulationValue(value)}.`);
  }

  return value as PopulationGenerationRequest;
}

function readRandomUnit(random: RandomUnitSource): number {
  return random();
}

function randomIntegerInclusive(minimum: number, maximum: number, random: RandomUnitSource): number {
  const span = maximum - minimum + 1;
  return minimum + Math.floor(readRandomUnit(random) * span);
}

function roundToThousandths(value: number): number {
  return Number(value.toFixed(3));
}

function drawBaseFactors(random: RandomUnitSource): SettlementFactors {
  return {
    farmerDivisor: readRandomUnit(random) * 2 + 1,
    farmlandAcresPerPerson: (readRandomUnit(random) * 7 + 8) / 10,
    householdDivisor: readRandomUnit(random) * 3 + 4,
    peoplePerSquareKilometer: readRandomUnit(random) * 10_000 + 35_000,
    livestockPerPerson: (readRandomUnit(random) * 10 + 15) / 10,
  };
}

function requirePositiveFactor(factorName: string, value: number): number {
  if (!Number.isFinite(value) || !(value > 0)) {
    throw new Error(`Population ${factorName} must be a finite number greater than 0. Received ${value}.`);
  }

  return value;
}

function factorsAfterPopulation(preset: PopulationPreset, base: SettlementFactors, random: RandomUnitSource): SettlementFactors {
  if (preset.era === 'medieval' && preset.size === 'village') {
    return {
      ...base,
      peoplePerSquareKilometer: readRandomUnit(random) * 1_000 + 1_500,
    };
  }

  if (preset.era === 'medieval' && preset.size === 'town') {
    return {
      ...base,
      farmerDivisor: base.farmerDivisor + 6,
      householdDivisor: base.householdDivisor - 1,
      peoplePerSquareKilometer: readRandomUnit(random) * 3_000 + 12_000,
      livestockPerPerson: base.livestockPerPerson * 0.7,
    };
  }

  if (preset.era === 'medieval' && preset.size === 'city') {
    return {
      ...base,
      farmerDivisor: base.farmerDivisor + 11,
      farmlandAcresPerPerson: base.farmlandAcresPerPerson / 2,
      householdDivisor: base.householdDivisor - 2,
      peoplePerSquareKilometer: base.peoplePerSquareKilometer * 0.8,
      livestockPerPerson: base.livestockPerPerson / 10,
    };
  }

  if (preset.era === 'medieval' && preset.size === 'large-city') {
    return {
      ...base,
      farmerDivisor: readRandomUnit(random) * 40 + 90,
      farmlandAcresPerPerson: (readRandomUnit(random) * 7 + 8) / 100,
      householdDivisor: base.householdDivisor - 3,
      livestockPerPerson: (readRandomUnit(random) * 5 + 25) / 1_000,
    };
  }

  if ((preset.era === 'modern' || preset.era === 'future') && preset.size === 'village') {
    return {
      ...base,
      farmerDivisor: base.farmerDivisor + 6,
      householdDivisor: base.householdDivisor - 1,
      peoplePerSquareKilometer: readRandomUnit(random) * 1_000 + 500,
      livestockPerPerson: base.livestockPerPerson * 2,
    };
  }

  if ((preset.era === 'modern' || preset.era === 'future') && preset.size === 'town') {
    return {
      ...base,
      farmerDivisor: base.farmerDivisor + 11,
      farmlandAcresPerPerson: base.farmlandAcresPerPerson / 2,
      householdDivisor: base.householdDivisor - 2,
      peoplePerSquareKilometer: readRandomUnit(random) * 2_000 + 1_000,
      livestockPerPerson: base.livestockPerPerson / 2,
    };
  }

  if ((preset.era === 'modern' || preset.era === 'future') && preset.size === 'city') {
    return {
      ...base,
      farmerDivisor: readRandomUnit(random) * 40 + 90,
      farmlandAcresPerPerson: (readRandomUnit(random) * 7 + 8) / 1_000,
      householdDivisor: base.householdDivisor - 3,
      peoplePerSquareKilometer: readRandomUnit(random) * 4_000 + 2_000,
      livestockPerPerson: (readRandomUnit(random) * 5 + 25) / 1_000,
    };
  }

  if ((preset.era === 'modern' || preset.era === 'future') && preset.size === 'large-city') {
    return {
      ...base,
      farmerDivisor: readRandomUnit(random) * 40 + 190,
      farmlandAcresPerPerson: (readRandomUnit(random) * 7 + 8) / 5_000,
      householdDivisor: base.householdDivisor - 3,
      livestockPerPerson: (readRandomUnit(random) * 5 + 25) / 5_000,
      peoplePerSquareKilometer: readRandomUnit(random) * 8_000 + 3_000,
    };
  }

  if ((preset.era === 'modern' || preset.era === 'future') && preset.size === 'metropolis') {
    const householdDivisor = base.householdDivisor - 4;
    return {
      ...base,
      farmerDivisor: readRandomUnit(random) * 40 + 900,
      farmlandAcresPerPerson: (readRandomUnit(random) * 7 + 8) / 10_000,
      householdDivisor: householdDivisor < 1 ? householdDivisor + 1 : householdDivisor,
      livestockPerPerson: (readRandomUnit(random) * 5 + 25) / 10_000,
      peoplePerSquareKilometer: readRandomUnit(random) * 20_000 + 1_000,
    };
  }

  throw new Error(
    `Population size ${JSON.stringify(preset.size)} is not available for era ${JSON.stringify(preset.era)}. Received ${JSON.stringify(preset.size)}.`,
  );
}

function checkedFactors(factors: SettlementFactors): SettlementFactors {
  return {
    farmerDivisor: requirePositiveFactor('farmer divisor', factors.farmerDivisor),
    farmlandAcresPerPerson: requirePositiveFactor('farmland acres per person', factors.farmlandAcresPerPerson),
    householdDivisor: requirePositiveFactor('household divisor', factors.householdDivisor),
    peoplePerSquareKilometer: requirePositiveFactor('people per square kilometer', factors.peoplePerSquareKilometer),
    livestockPerPerson: requirePositiveFactor('livestock per person', factors.livestockPerPerson),
  };
}

function labeledStat(label: string, value: number): PopulationStat {
  return { label, value };
}

function splitLivestock(livestock: number, random: RandomUnitSource): { fowl: number; cattleAndPigs: number; otherLivestock: number } {
  const fowlRatio = (readRandomUnit(random) * 20 + 60) / 100;
  const cattleRatio = (readRandomUnit(random) * 15 + 25) / 100;

  if (livestock === 0) {
    return { fowl: 0, cattleAndPigs: 0, otherLivestock: 0 };
  }

  let fowl = Math.floor(livestock * fowlRatio);
  let cattleAndPigs = Math.floor(livestock * cattleRatio);

  while (fowl + cattleAndPigs >= livestock) {
    const reduction = Math.floor(livestock * (readRandomUnit(random) / 10));
    if (reduction <= 0) {
      if (cattleAndPigs > 0) {
        cattleAndPigs -= 1;
      } else if (fowl > 0) {
        fowl -= 1;
      } else {
        throw new Error(
          `Population livestock split cannot leave a remainder. Received livestock ${livestock}, fowl ${fowl}, cattle and pigs ${cattleAndPigs}.`,
        );
      }
    } else {
      cattleAndPigs = Math.max(0, cattleAndPigs - reduction);
    }
  }

  return {
    fowl,
    cattleAndPigs,
    otherLivestock: livestock - fowl - cattleAndPigs,
  };
}

function drawProfessionCount(population: number, peoplePerOne: number, appearanceWeight: number, random: RandomUnitSource): number {
  const appearanceUnit = readRandomUnit(random);
  const directionUnit = readRandomUnit(random);
  const magnitudeUnit = readRandomUnit(random);
  const baseCount = Math.floor(population / peoplePerOne);
  const maxSwing = Math.floor(baseCount / 5);
  const swing = Math.floor(magnitudeUnit * (maxSwing + 1));
  const count = directionUnit < 0.5 ? baseCount + swing : baseCount - swing;
  const appearanceScore = Math.floor(appearanceUnit * appearanceWeight + 8);

  if (count < 0 || appearanceScore > 9) {
    return 0;
  }

  return count;
}

function drawProfessions(era: PopulationEra, locale: SiteLocale, population: number, random: RandomUnitSource): PopulationProfession[] {
  return listPopulationProfessionDefinitions(era).map((definition) => ({
    id: definition.id,
    name: locale === 'zh' ? definition.chineseName : definition.englishName,
    count: drawProfessionCount(population, definition.peoplePerOne, definition.appearanceWeight, random),
  }));
}

function buildPopulationResult(preset: PopulationPreset, locale: SiteLocale, random: RandomUnitSource): PopulationResult {
  const baseFactors = drawBaseFactors(random);
  const population = randomIntegerInclusive(preset.min, preset.max, random);
  const factors = checkedFactors(factorsAfterPopulation(preset, baseFactors, random));
  const labels = SETTLEMENT_LABELS[locale];
  const name = createSettlementName(locale, readRandomUnit(random));
  const farmers = Math.floor(population / factors.farmerDivisor);
  const households = Math.floor(population / factors.householdDivisor);
  const areaKm2 = roundToThousandths(population / factors.peoplePerSquareKilometer);
  const areaMi2 = roundToThousandths(areaKm2 * SQUARE_MILES_PER_SQUARE_KILOMETER);
  const farmland = Math.floor(population * factors.farmlandAcresPerPerson);
  const livestock = Math.floor(population * factors.livestockPerPerson);
  const animals = splitLivestock(livestock, random);

  return {
    version: 1,
    era: preset.era,
    size: preset.size,
    nameLabel: labels.name,
    name,
    population: labeledStat(labels.population, population),
    households: labeledStat(labels.households, households),
    areaKm2: labeledStat(labels.areaKm2, areaKm2),
    areaMi2: labeledStat(labels.areaMi2, areaMi2),
    agriculture: {
      farmers: labeledStat(labels.farmers, farmers),
      farmland: labeledStat(labels.farmland, farmland),
      livestock: labeledStat(labels.livestock, livestock),
      fowl: labeledStat(labels.fowl, animals.fowl),
      cattleAndPigs: labeledStat(labels.cattleAndPigs, animals.cattleAndPigs),
      otherLivestock: labeledStat(labels.otherLivestock, animals.otherLivestock),
    },
    professions: drawProfessions(preset.era, locale, population, random),
  };
}

export function generatePopulation(request: PopulationGenerationRequest): PopulationResult {
  const generationRequest = requireGenerationRequest(request);
  const era = requirePopulationEra(generationRequest.era);
  const size = requirePopulationSize(generationRequest.size);
  const locale = requirePopulationLocale(generationRequest.locale);
  const preset = requirePopulationPreset(era, size);
  const random = requireRandomSource(generationRequest.random);
  return buildPopulationResult(preset, locale, random);
}

export function generateRandomPopulation(request: PopulationRandomRequest): PopulationResult {
  const generationRequest = requireGenerationRequest(request);
  const locale = requirePopulationLocale(generationRequest.locale);
  const random = requireRandomSource(generationRequest.random);
  const presets = listAllPopulationPresets();
  const presetIndex = Math.floor(readRandomUnit(random) * presets.length);
  const preset = presets[presetIndex];

  if (!preset) {
    throw new Error(`Population preset index ${presetIndex} is outside 0..${presets.length - 1}.`);
  }

  return buildPopulationResult(preset, locale, random);
}
