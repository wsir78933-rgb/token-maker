import { describe, expect, it } from 'vitest';
import { listHeraldicSwatches, requireHeraldicSwatchGroup } from './heraldic-swatches';

describe('heraldic swatches', () => {
  it('keeps every swatch hex unique across groups', () => {
    const hexes = listHeraldicSwatches().map((swatch) => swatch.hex.toUpperCase());
    expect(new Set(hexes).size).toBe(hexes.length);
  });

  it('rejects an unknown group id with the offending value', () => {
    expect(() => requireHeraldicSwatchGroup('not-a-group')).toThrow('not-a-group');
  });
});
