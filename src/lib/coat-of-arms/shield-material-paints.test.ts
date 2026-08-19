import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { extractSvgPaintColours } from './svg-paint-colours';
import {
  getShieldMaterialPaintColours,
  getShieldMaterialSvgMarkup,
  isShieldMaterialAssetId,
} from './shield-material-paints';

describe('shield material paints', () => {
  it('returns authored heater-002 paints and markup from the catalogued file', () => {
    const svgFromDisk = readFileSync('public/coat-assets/materials/shields/heater/heater-002.svg', 'utf8');

    expect(isShieldMaterialAssetId('heater-002')).toBe(true);
    expect(getShieldMaterialPaintColours('heater-002')).toEqual(['#B4282E', '#E1B432', '#111111']);
    expect(getShieldMaterialSvgMarkup('heater-002')).toBe(svgFromDisk);
    expect(extractSvgPaintColours(getShieldMaterialSvgMarkup('heater-002'))).toEqual(
      getShieldMaterialPaintColours('heater-002'),
    );
  });

  it('catalogues every bundled shield material', () => {
    expect(isShieldMaterialAssetId('heater-001')).toBe(true);
    expect(isShieldMaterialAssetId('shield-111')).toBe(true);
    expect(isShieldMaterialAssetId('lozenge-012')).toBe(true);
    expect(isShieldMaterialAssetId('heater-shield')).toBe(false);
  });

  it('rejects an unknown or empty asset id with the offending value', () => {
    expect(() => getShieldMaterialPaintColours('heater-999')).toThrow('heater-999');
    expect(() => getShieldMaterialSvgMarkup('not-a-shield')).toThrow('not-a-shield');
    expect(() => isShieldMaterialAssetId('')).toThrow('""');
    expect(() => getShieldMaterialPaintColours(12 as never)).toThrow('12');
  });
});
