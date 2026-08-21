import { describe, expect, it } from 'vitest';
import {
  DEFAULT_HERALDIC_PALETTE_ID,
  listHeraldicPaletteSwatches,
  listHeraldicPalettes,
  requireHeraldicPalette,
  requireHeraldicPaletteId,
  resolveDefaultHeraldicPaletteId,
} from './heraldic-palettes';

describe('heraldic palettes', () => {
  it('keeps palette ids unique and every swatch hex valid', () => {
    const palettes = listHeraldicPalettes();
    const ids = palettes.map((palette) => palette.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const palette of palettes) {
      for (const swatch of listHeraldicPaletteSwatches(palette)) {
        expect(swatch.hex).toMatch(/^#[0-9A-F]{6}$/);
        expect(swatch.tincture.length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps Vampire Castle and Seven Seas in the competitor palette list', () => {
    expect(requireHeraldicPalette('vampire-castle').name).toBe('Vampire Castle');
    expect(requireHeraldicPalette('seven-seas').name).toBe('Seven Seas');
    expect(requireHeraldicPalette('coa-maker-default').canAdd).toBe(false);
    expect(requireHeraldicPalette('plain-white').canAdd).toBe(false);
  });

  it('rejects an unknown palette id with the offending value', () => {
    expect(() => requireHeraldicPaletteId('not-a-palette')).toThrow('not-a-palette');
    expect(() => requireHeraldicPalette('not-a-palette')).toThrow('not-a-palette');
    expect(() => requireHeraldicPaletteId(Symbol('not-a-palette'))).toThrow('Symbol(not-a-palette)');
  });

  it('keeps public palette data immutable', () => {
    const palettes = listHeraldicPalettes();
    expect(Object.isFrozen(palettes)).toBe(true);
    expect(Object.isFrozen(palettes[0])).toBe(true);
    expect(Object.isFrozen(palettes[0]?.groups)).toBe(true);
    expect(Object.isFrozen(palettes[0]?.groups[0]?.swatches)).toBe(true);
    expect(Object.isFrozen(palettes[0]?.groups[0]?.swatches[0])).toBe(true);
  });

  it('uses CoaMaker Default when no stored palette id is set', () => {
    expect(resolveDefaultHeraldicPaletteId(undefined)).toBe(DEFAULT_HERALDIC_PALETTE_ID);
    expect(resolveDefaultHeraldicPaletteId('vampire-castle')).toBe('vampire-castle');
  });
});
