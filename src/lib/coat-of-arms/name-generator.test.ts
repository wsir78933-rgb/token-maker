import { describe, expect, it } from 'vitest';
import { generateCoatNames, nameGeneratorTypes } from './name-generator';

describe('coat name generator', () => {
  it('provides a distinct list for every competitor generator type', () => {
    for (const type of nameGeneratorTypes) {
      const names = generateCoatNames(type, 'en', 8, () => 0.1);
      expect(names).toHaveLength(8);
      expect(new Set(names).size).toBe(names.length);
      expect(names.every((name) => name.length > 0)).toBe(true);
    }
  });

  it('uses German word banks independently of the page locale', () => {
    expect(generateCoatNames('city', 'en', 2, () => 0)).not.toEqual(generateCoatNames('city', 'de', 2, () => 0));
  });

  it('rejects invalid type, language, count, and random values with specific errors', () => {
    expect(() => generateCoatNames('unknown' as never, 'en')).toThrow('Invalid name generator type: unknown');
    expect(() => generateCoatNames('city', 'fr' as never)).toThrow('Invalid name generator language: fr');
    expect(() => generateCoatNames('city', 'en', 0)).toThrow('Invalid generated name count: 0');
    expect(() => generateCoatNames('city', 'en', 2, () => 1)).toThrow('Invalid random value for name generator: 1');
  });
});
