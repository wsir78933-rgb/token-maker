import { describe, expect, it } from 'vitest';

import {
  listArmyNatoIconsPart1,
  type ArmyFormationIcon,
} from '@/lib/army-formation/icons/nato-1';

const ARMY_NATO_PART1_IDS = Array.from({ length: 48 }, (_, index) => {
  return `nato-${String(index + 1).padStart(3, '0')}`;
});

describe('listArmyNatoIconsPart1', () => {
  it('returns 48 unique ids from nato-001 through nato-048', () => {
    const icons = listArmyNatoIconsPart1();

    expect(icons).toHaveLength(48);
    expect(icons.map((icon) => icon.id)).toEqual(ARMY_NATO_PART1_IDS);
    expect(new Set(icons.map((icon) => icon.id)).size).toBe(48);
  });

  it('draws each icon as a local 50 by 30 svg in currentColor', () => {
    const icons = listArmyNatoIconsPart1();

    expect(icons.map((icon) => armyNatoSvgCheck(icon))).toEqual(
      ARMY_NATO_PART1_IDS.map((id) => ({
        id,
        viewBox: true,
        currentColor: true,
        http: false,
        image: false,
      })),
    );
    expect(new Set(icons.map((icon) => icon.svgMarkup)).size).toBe(48);
  });
});

function armyNatoSvgCheck(icon: ArmyFormationIcon) {
  const markup = icon.svgMarkup.toLowerCase();

  return {
    id: icon.id,
    viewBox: icon.svgMarkup.includes('viewBox="0 0 50 30"'),
    currentColor: icon.svgMarkup.includes('currentColor'),
    http: markup.includes('http'),
    image: markup.includes('<image'),
  };
}
