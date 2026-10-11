import { describe, expect, it } from 'vitest';

import { listPopulationProfessionDefinitions } from './catalog';
import { generatePopulation, generateRandomPopulation } from './generate';
import { getPopulationPresets } from './presets';
import type { PopulationEra, PopulationResult, PopulationSize } from './types';

const SQUARE_MILES_PER_SQUARE_KILOMETER = 0.386102;
const NEAR_ONE = 0.9999999;

function constantRandom(unit: number): () => number {
  return () => unit;
}

function presetsInDrawOrder() {
  return [
    ...getPopulationPresets('medieval'),
    ...getPopulationPresets('modern'),
    ...getPopulationPresets('future'),
  ];
}

function profession(result: PopulationResult, id: string) {
  const match = result.professions.find((entry) => entry.id === id);
  if (!match) {
    throw new Error(`Missing profession ${id}.`);
  }

  return match;
}

function expectThreeDecimalArea(value: number) {
  expect(value).toBeGreaterThanOrEqual(0);
  expect(Number.isFinite(value)).toBe(true);
  expect(value).toBe(Number(value.toFixed(3)));
}

function expectAnimalIdentity(result: PopulationResult) {
  const { livestock, fowl, cattleAndPigs, otherLivestock } = result.agriculture;
  expect(fowl.value + cattleAndPigs.value + otherLivestock.value).toBe(livestock.value);
  expect(fowl.value).toBeGreaterThanOrEqual(0);
  expect(cattleAndPigs.value).toBeGreaterThanOrEqual(0);
  expect(otherLivestock.value).toBeGreaterThanOrEqual(0);
  if (livestock.value > 0) {
    expect(fowl.value + cattleAndPigs.value).toBeLessThan(livestock.value);
  }
}

describe('generatePopulation', () => {
  it('draws each of the 14 presets inside its inclusive range', () => {
    for (const preset of presetsInDrawOrder()) {
      for (const unit of [0, NEAR_ONE]) {
        const result = generatePopulation({
          era: preset.era,
          size: preset.size,
          locale: 'en',
          random: constantRandom(unit),
        });
        const expectedPopulation = unit === 0 ? preset.min : preset.max;
        expect(result.era).toBe(preset.era);
        expect(result.size).toBe(preset.size);
        expect(result.version).toBe(1);
        expect(result.population.value).toBe(expectedPopulation);
        expect(Number.isInteger(result.population.value)).toBe(true);
        expect(result.professions).toHaveLength(170);
        expectThreeDecimalArea(result.areaKm2.value);
        expectThreeDecimalArea(result.areaMi2.value);
        expect(result.areaMi2.value).toBe(Number((result.areaKm2.value * SQUARE_MILES_PER_SQUARE_KILOMETER).toFixed(3)));
        expectAnimalIdentity(result);
        for (const stat of [result.households, result.agriculture.farmers, result.agriculture.farmland, result.agriculture.livestock]) {
          expect(Number.isInteger(stat.value)).toBe(true);
          expect(stat.value).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('keeps zero-count professions and varies counts from each era ratio', () => {
    const medieval = generatePopulation({
      era: 'medieval',
      size: 'town',
      locale: 'en',
      random: constantRandom(0),
    });
    expect(medieval.population.value).toBe(1_000);
    expect(medieval.name).toBe('Ashbarrow');
    expect(medieval.population.label).toBe('Population');
    expect(medieval.agriculture.farmers).toEqual({ label: 'Farmers', value: 142 });
    expect(medieval.households).toEqual({ label: 'Households', value: 333 });
    expect(medieval.agriculture.farmland).toEqual({ label: 'Farmland (acres)', value: 800 });
    expect(medieval.agriculture.livestock.value).toBe(1_049);
    expect(medieval.agriculture.fowl.value).toBe(629);
    expect(medieval.agriculture.cattleAndPigs.value).toBe(262);
    expect(medieval.agriculture.otherLivestock.value).toBe(158);
    expect(medieval.areaKm2.value).toBe(0.083);
    expect(medieval.areaMi2.value).toBe(0.032);
    expect(profession(medieval, 'medieval:zookeepers').count).toBe(0);
    expect(new Set(medieval.professions.map((entry) => entry.count)).size).toBeGreaterThan(1);

    for (const entry of listPopulationProfessionDefinitions('medieval')) {
      expect(profession(medieval, entry.id).count).toBe(Math.floor(1_000 / entry.peoplePerOne));
      expect(profession(medieval, entry.id).name).toBe(entry.englishName);
    }

    const swung = generatePopulation({
      era: 'medieval',
      size: 'town',
      locale: 'en',
      random: constantRandom(0.5),
    });
    expect(swung.population.value).toBe(5_500);
    expect(profession(swung, 'medieval:bakers')).toMatchObject({ name: 'Bakers', count: 22 });
    expect(profession(swung, 'medieval:pursemakers').count).toBe(0);
  });

  it('uses a different catalog and Chinese labels for the other eras', () => {
    const modern = generatePopulation({ era: 'modern', size: 'town', locale: 'zh', random: constantRandom(0) });
    const future = generatePopulation({ era: 'future', size: 'town', locale: 'zh', random: constantRandom(0) });
    expect(modern.population.value).toBe(5_000);
    expect(future.population.value).toBe(5_000);
    expect(modern.name).toBe('青溪镇');
    expect(modern.nameLabel).toBe('聚落名称');
    expect(modern.population.label).toBe('总人口');
    expect(modern.agriculture.farmers.label).toBe('农民人数');
    expect(modern.agriculture.cattleAndPigs.label).toBe('牛与猪');
    expect(profession(modern, 'modern:academics').name).toBe('学者');
    expect(profession(future, 'future:a-i-developers').name).toBe('人工智能开发者');
    expect(modern.professions.map((entry) => entry.name)).not.toEqual(future.professions.map((entry) => entry.name));
    expect(modern.professions.map((entry) => entry.count)).not.toEqual(future.professions.map((entry) => entry.count));
  });

  it('rejects a medieval metropolis and a random unit outside [0, 1)', () => {
    expect(() => generatePopulation({
      era: 'medieval',
      size: 'metropolis' as PopulationSize,
      locale: 'en',
      random: constantRandom(0),
    })).toThrow(/"metropolis"/);

    expect(() => generatePopulation({
      era: 'modern' as PopulationEra,
      size: 'town',
      locale: 'en',
      random: constantRandom(1),
    })).toThrow(/Received 1/);

    expect(() => generatePopulation({
      era: 'modern',
      size: 'town',
      locale: 'fr' as 'en',
    })).toThrow(/"fr"/);
  });
});

describe('generateRandomPopulation', () => {
  it('chooses one of the 14 presets before generating', () => {
    const first = generateRandomPopulation({ locale: 'en', random: constantRandom(0) });
    const last = generateRandomPopulation({ locale: 'zh', random: constantRandom(NEAR_ONE) });
    expect(first.era).toBe('medieval');
    expect(first.size).toBe('village');
    expect(first.population.value).toBe(0);
    expect(last.era).toBe('future');
    expect(last.size).toBe('metropolis');
    expect(last.population.value).toBe(9_000_000);
    expect(last.professions).toHaveLength(170);
  });
});
