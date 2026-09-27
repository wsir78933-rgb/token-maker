import { describe, expect, it } from 'vitest';

import { listArmyNatoIconsPart3, type ArmyFormationIcon } from '@/lib/army-formation/icons/nato-3';

const NATO_PART3_FIRST_SERIAL = 97;
const NATO_PART3_LAST_SERIAL = 144;

function expectedNatoPart3Ids(): string[] {
  const ids: string[] = [];
  for (let serial = NATO_PART3_FIRST_SERIAL; serial <= NATO_PART3_LAST_SERIAL; serial += 1) {
    ids.push(`nato-${String(serial).padStart(3, '0')}`);
  }
  return ids;
}

function assertLocalCurrentColorSvg(icon: ArmyFormationIcon): void {
  expect(icon.svgMarkup.startsWith('<svg viewBox="0 0 50 30">')).toBe(true);
  expect(icon.svgMarkup.endsWith('</svg>')).toBe(true);
  expect(icon.svgMarkup).toContain('viewBox="0 0 50 30"');
  expect(icon.svgMarkup).toContain('currentColor');
  expect(icon.svgMarkup).not.toContain('http');
  expect(icon.svgMarkup).not.toContain('<image');
}

describe('listArmyNatoIconsPart3', () => {
  it('returns 48 unique icons from nato-097 through nato-144', () => {
    const icons = listArmyNatoIconsPart3();
    const ids = icons.map((icon) => icon.id);

    expect(icons).toHaveLength(48);
    expect(ids).toEqual(expectedNatoPart3Ids());
    expect(new Set(ids).size).toBe(48);
    expect(ids[0]).toBe('nato-097');
    expect(ids[47]).toBe('nato-144');
  });

  it('draws each icon as its own local currentColor svg', () => {
    const icons = listArmyNatoIconsPart3();
    const markup = icons.map((icon) => icon.svgMarkup);

    expect(new Set(markup).size).toBe(48);
    for (const icon of icons) {
      expect(Object.keys(icon).sort()).toEqual(['id', 'svgMarkup']);
      assertLocalCurrentColorSvg(icon);
    }
  });
});
