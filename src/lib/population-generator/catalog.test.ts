import { describe, expect, it } from 'vitest';

import { listPopulationProfessionDefinitions } from './catalog';
import type { PopulationEra } from './types';

const ERAS: PopulationEra[] = ['medieval', 'modern', 'future'];

function definition(era: PopulationEra, englishName: string) {
  const match = listPopulationProfessionDefinitions(era).find((entry) => entry.englishName === englishName);
  if (!match) {
    throw new Error(`Missing ${era} profession ${englishName}.`);
  }

  return match;
}

describe('population profession catalogs', () => {
  it('keeps 170 distinct professions in each era', () => {
    for (const era of ERAS) {
      const definitions = listPopulationProfessionDefinitions(era);
      expect(definitions).toHaveLength(170);
      expect(new Set(definitions.map((entry) => entry.englishName)).size).toBe(170);
      expect(new Set(definitions.map((entry) => entry.id)).size).toBe(170);
    }
  });

  it('gives every profession a Chinese name and era-specific ratios', () => {
    for (const era of ERAS) {
      for (const entry of listPopulationProfessionDefinitions(era)) {
        expect(entry.chineseName).toMatch(/\p{Script=Han}/u);
        expect(entry.peoplePerOne).toBeGreaterThan(0);
        expect(entry.appearanceWeight).toBeGreaterThanOrEqual(0);
      }
    }

    expect(definition('medieval', 'Administrators')).toMatchObject({
      id: 'medieval:administrators',
      chineseName: '行政官',
      peoplePerOne: 3000,
      appearanceWeight: 2,
    });
    expect(definition('medieval', 'Advisors')).toMatchObject({ peoplePerOne: 2400, appearanceWeight: 4 });
    expect(definition('modern', 'Advisors')).toMatchObject({ peoplePerOne: 1000, appearanceWeight: 2 });
    expect(definition('future', 'Advisors')).toMatchObject({ peoplePerOne: 2500, appearanceWeight: 2 });
    expect(definition('medieval', 'Pursemakers').appearanceWeight).toBe(22);
    expect(definition('modern', 'Academics')).toMatchObject({ peoplePerOne: 240, appearanceWeight: 0 });
    expect(definition('future', 'A.I. Developers')).toMatchObject({
      chineseName: '人工智能开发者',
      peoplePerOne: 2500,
      appearanceWeight: 2,
    });
    expect(listPopulationProfessionDefinitions('future').at(-1)?.englishName).toBe('Wellness Workers');
    expect(listPopulationProfessionDefinitions('medieval').at(-1)?.englishName).toBe('Zookeepers');
  });

  it('does not reuse one profession table for every era', () => {
    const englishNames = ERAS.map((era) => listPopulationProfessionDefinitions(era).map((entry) => entry.englishName));
    const ratios = ERAS.map((era) => listPopulationProfessionDefinitions(era).map((entry) => entry.peoplePerOne));
    expect(englishNames[0]).not.toEqual(englishNames[1]);
    expect(englishNames[1]).not.toEqual(englishNames[2]);
    expect(englishNames[0]).not.toEqual(englishNames[2]);
    expect(ratios[0]).not.toEqual(ratios[1]);
    expect(ratios[1]).not.toEqual(ratios[2]);
  });
});
