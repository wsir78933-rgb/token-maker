import { describe, expect, it } from 'vitest';

import { listArmyWeaponIcons, type ArmyFormationIcon } from '@/lib/army-formation/icons/weapons';

describe('listArmyWeaponIcons', () => {
  it('返回 23 个不重复的武器图标，svg 使用本地 currentColor', () => {
    const weaponIcons = listArmyWeaponIcons();
    const ids = weaponIcons.map((weaponIcon) => weaponIcon.id);
    const expectedIds = Array.from({ length: 23 }, (_, index) => {
      return `weapon-${String(index + 1).padStart(2, '0')}`;
    });

    expect(weaponIcons).toHaveLength(23);
    expect(ids).toEqual(expectedIds);
    expect(new Set(ids).size).toBe(23);
    expect(ids[0]).toBe('weapon-01');
    expect(ids[22]).toBe('weapon-23');
    expect(Object.isFrozen(weaponIcons)).toBe(true);
    expect(listArmyWeaponIcons()).toEqual(weaponIcons);

    for (const weaponIcon of weaponIcons) {
      assertWeaponIconShape(weaponIcon);
    }

    expect(new Set(weaponIcons.map((weaponIcon) => weaponIcon.svgMarkup)).size).toBe(23);
  });
});

function assertWeaponIconShape(weaponIcon: ArmyFormationIcon): void {
  expect(weaponIcon.svgMarkup).toContain('viewBox="0 0 50 30"');
  expect(weaponIcon.svgMarkup).toContain('currentColor');
  expect(weaponIcon.svgMarkup).not.toContain('http');
  expect(weaponIcon.svgMarkup.toLowerCase()).not.toContain('<image');
  expect(weaponIcon.svgMarkup.startsWith('<svg')).toBe(true);
  expect(weaponIcon.svgMarkup.endsWith('</svg>')).toBe(true);
}
