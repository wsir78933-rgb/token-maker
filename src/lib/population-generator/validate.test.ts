import { describe, expect, it } from 'vitest';

import { generatePopulation } from './generate';
import { validatePopulationResult } from './validate';
import type { PopulationResult } from './types';

function generatedResult(): PopulationResult {
  return generatePopulation({ era: 'medieval', size: 'town', locale: 'en', random: () => 0 });
}

describe('validatePopulationResult', () => {
  it('accepts edited labels, names, and zero counts without recalculating', () => {
    const result = generatedResult();
    const farmersBefore = result.agriculture.farmers.value;
    result.population.value = 1;
    result.population.label = '自定义人口';
    result.name = '手工镇';
    result.professions[0].name = '改名职业';
    result.professions[0].count = 0;
    result.areaKm2.value = 1.25;

    const validated = validatePopulationResult(result);
    expect(validated.population).toEqual({ label: '自定义人口', value: 1 });
    expect(validated.name).toBe('手工镇');
    expect(validated.professions[0]).toMatchObject({ name: '改名职业', count: 0 });
    expect(validated.agriculture.farmers.value).toBe(farmersBefore);
    expect(validated.areaKm2.value).toBe(1.25);
  });

  it('reports the bad value for invalid numbers and shapes', () => {
    const result = generatedResult();
    expect(() => validatePopulationResult({ ...result, population: { label: 'Population', value: -12 } })).toThrow(/-12/);
    expect(() => validatePopulationResult({ ...result, population: { label: 'Population', value: -12 } })).toThrow(/non-negative integer/);
    expect(() => validatePopulationResult({ ...result, households: { label: 'Households', value: 1.5 } })).toThrow(/1\.5/);
    expect(() => validatePopulationResult({ ...result, areaKm2: { label: 'Area (km²)', value: Number.NaN } })).toThrow(/NaN/);
    expect(() => validatePopulationResult({ ...result, areaMi2: { label: 'Area (mi²)', value: Number.POSITIVE_INFINITY } })).toThrow(/Infinity/);
    expect(() => validatePopulationResult({ ...result, areaKm2: { label: 'Area (km²)', value: -0.1 } })).toThrow(/-0\.1/);
    expect(() => validatePopulationResult({ ...result, version: 2 })).toThrow(/version/);
    expect(() => validatePopulationResult({ ...result, size: 'metropolis' })).toThrow(/"metropolis"/);
    expect(() => validatePopulationResult({ ...result, professions: result.professions.slice(0, 169) })).toThrow(/169/);

    const duplicateProfessions = result.professions.map((entry) => ({ ...entry }));
    duplicateProfessions[1] = { ...duplicateProfessions[1], id: duplicateProfessions[0].id };
    expect(() => validatePopulationResult({ ...result, professions: duplicateProfessions })).toThrow(/duplicate id/);

    const blankId = result.professions.map((entry) => ({ ...entry }));
    blankId[0] = { ...blankId[0], id: '' };
    expect(() => validatePopulationResult({ ...result, professions: blankId })).toThrow(/""/);
    expect(() => validatePopulationResult(null)).toThrow(/null/);
  });
});
