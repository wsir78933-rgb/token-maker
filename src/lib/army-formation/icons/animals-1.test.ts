import { describe, expect, it } from 'vitest';
import { listArmyAnimalIconsPart1, type ArmyFormationIcon } from './animals-1';

const EXPECTED_ANIMAL_ICON_IDS = Array.from(
  { length: 30 },
  (_, index) => `animal-${String(index + 1).padStart(2, '0')}`,
);

describe('listArmyAnimalIconsPart1', () => {
  it('returns animal-01 through animal-30 once each', () => {
    const icons: readonly ArmyFormationIcon[] = listArmyAnimalIconsPart1();
    const ids = icons.map((icon) => icon.id);

    expect(icons).toHaveLength(30);
    expect(ids).toEqual(EXPECTED_ANIMAL_ICON_IDS);
    expect(new Set(ids).size).toBe(30);
  });

  it('draws each animal as a local currentColor svg', () => {
    const icons = listArmyAnimalIconsPart1();

    expect(new Set(icons.map((icon) => icon.svgMarkup)).size).toBe(30);

    for (const icon of icons) {
      expect(icon.svgMarkup.startsWith('<svg')).toBe(true);
      expect(icon.svgMarkup.endsWith('</svg>')).toBe(true);
      expect(icon.svgMarkup).toContain('viewBox="0 0 50 30"');
      expect(icon.svgMarkup).toContain('currentColor');
      expect(icon.svgMarkup).not.toContain('http');
      expect(icon.svgMarkup).not.toContain('<image');
    }
  });
});
