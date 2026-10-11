import { describe, expect, it } from 'vitest';

import { getPopulationPresets } from './presets';

describe('population presets', () => {
  it('lists 4 medieval sizes and 5 sizes for modern and future', () => {
    expect(getPopulationPresets('medieval').map((preset) => preset.size)).toEqual([
      'village',
      'town',
      'city',
      'large-city',
    ]);
    expect(getPopulationPresets('modern').map((preset) => preset.size)).toEqual([
      'village',
      'town',
      'city',
      'large-city',
      'metropolis',
    ]);
    expect(getPopulationPresets('future').map((preset) => preset.size)).toEqual([
      'village',
      'town',
      'city',
      'large-city',
      'metropolis',
    ]);
  });

  it('uses the published inclusive population ranges', () => {
    expect(getPopulationPresets('medieval')).toEqual([
      { era: 'medieval', size: 'village', min: 0, max: 1_000 },
      { era: 'medieval', size: 'town', min: 1_000, max: 10_000 },
      { era: 'medieval', size: 'city', min: 10_000, max: 20_000 },
      { era: 'medieval', size: 'large-city', min: 20_000, max: 270_000 },
    ]);
    expect(getPopulationPresets('modern')).toEqual([
      { era: 'modern', size: 'village', min: 0, max: 5_000 },
      { era: 'modern', size: 'town', min: 5_000, max: 20_000 },
      { era: 'modern', size: 'city', min: 20_000, max: 200_000 },
      { era: 'modern', size: 'large-city', min: 200_000, max: 1_100_000 },
      { era: 'modern', size: 'metropolis', min: 1_000_000, max: 9_000_000 },
    ]);
    expect(getPopulationPresets('future')).toEqual(getPopulationPresets('modern').map((preset) => ({
      ...preset,
      era: 'future',
    })));
  });

  it('rejects an unknown era with the received value', () => {
    expect(() => getPopulationPresets('space' as 'medieval')).toThrow(/"space"/);
  });
});
