import { describe, expect, it } from 'vitest';

import { generatePopulation } from './generate';
import { readPopulationSlots, savePopulationSlot } from './slots';
import type { PopulationResult } from './types';

type MemoryStorage = Pick<Storage, 'getItem' | 'setItem'> & { values: Map<string, string> };

function createMemoryStorage(initialValue?: string): MemoryStorage {
  const values = new Map<string, string>();
  if (initialValue !== undefined) {
    values.set('tokenmaker.population-generator.slots.v1', initialValue);
  }

  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

function generatedResult(name: string): PopulationResult {
  const result = generatePopulation({ era: 'modern', size: 'village', locale: 'zh', random: () => 0 });
  result.name = name;
  result.population.value = 0;
  result.professions[3].count = 0;
  result.professions[3].name = `${name}职业`;
  return result;
}

describe('population slots', () => {
  it('stores five slots and round-trips every edited field', () => {
    const storage = createMemoryStorage();
    expect(readPopulationSlots(storage)).toEqual([null, null, null, null, null]);

    const first = generatedResult('第一镇');
    const last = generatedResult('第五镇');
    savePopulationSlot(storage, 0, first);
    savePopulationSlot(storage, 4, last);

    const slots = readPopulationSlots(storage);
    expect(slots).toHaveLength(5);
    expect(slots[0]).toEqual(first);
    expect(slots[1]).toBeNull();
    expect(slots[2]).toBeNull();
    expect(slots[3]).toBeNull();
    expect(slots[4]).toEqual(last);

    const replacement = generatedResult('覆盖镇');
    savePopulationSlot(storage, 0, replacement);
    const afterOverwrite = readPopulationSlots(storage);
    expect(afterOverwrite[0]).toEqual(replacement);
    expect(afterOverwrite[4]).toEqual(last);
  });

  it('rejects a bad slot index or corrupt storage without writing', () => {
    const storage = createMemoryStorage('{"format":"nope"}');
    const result = generatedResult('保留镇');
    expect(() => savePopulationSlot(storage, 5, result)).toThrow(/5/);
    expect(() => savePopulationSlot(storage, -1, result)).toThrow(/-1/);
    expect(() => savePopulationSlot(storage, 1.5, result)).toThrow(/1\.5/);
    expect(storage.values.get('tokenmaker.population-generator.slots.v1')).toBe('{"format":"nope"}');

    const corrupt = createMemoryStorage('{');
    expect(() => savePopulationSlot(corrupt, 0, result)).toThrow(/not valid JSON/);
    expect(corrupt.values.get('tokenmaker.population-generator.slots.v1')).toBe('{');
    expect(() => readPopulationSlots(corrupt)).toThrow(/not valid JSON/);
  });
});
