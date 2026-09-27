import { describe, expect, it } from 'vitest';

import {
  listArmyAnimalIconsPart2,
  type ArmyFormationIcon,
} from '@/lib/army-formation/icons/animals-2';

const expectedAnimalIconIds = Array.from({ length: 30 }, (_, index) => `animal-${31 + index}`);

function assertLocalCurrentColorSvg(icon: ArmyFormationIcon): void {
  expect(icon.svgMarkup.startsWith('<svg viewBox="0 0 50 30">')).toBe(true);
  expect(icon.svgMarkup.endsWith('</svg>')).toBe(true);
  expect(icon.svgMarkup).toContain('viewBox="0 0 50 30"');
  expect(icon.svgMarkup).toContain('currentColor');
  expect(icon.svgMarkup).not.toContain('http');
  expect(icon.svgMarkup).not.toContain('<image');
}

describe('listArmyAnimalIconsPart2', () => {
  it('returns thirty unique icons from animal-31 through animal-60', () => {
    const icons = listArmyAnimalIconsPart2();

    expect(icons).toHaveLength(30);
    expect(icons.map((icon) => icon.id)).toEqual(expectedAnimalIconIds);
    expect(new Set(icons.map((icon) => icon.id)).size).toBe(30);
    expect(icons[0]?.id).toBe('animal-31');
    expect(icons[29]?.id).toBe('animal-60');
    expect(new Set(icons.map((icon) => icon.svgMarkup)).size).toBe(30);
  });

  it('draws every animal as a local currentColor svg', () => {
    const icons = listArmyAnimalIconsPart2();

    for (const icon of icons) {
      assertLocalCurrentColorSvg(icon);
    }
  });
});
