import { describe, expect, it } from 'vitest';

import {
  ARMY_FORMATION_ICON_TOTAL_COUNT,
  listArmyFormationIconCatalog,
  listArmyFormationIconCategories,
  listArmyFormationIconsInCategory,
  requireArmyFormationCatalogIcon,
} from '@/lib/army-formation/icon-catalog';

describe('listArmyFormationIconCatalog', () => {
  it('目录一共 292 个图标，五个分类是 39、23、60、26、144', () => {
    const catalog = listArmyFormationIconCatalog();
    const helmets = listArmyFormationIconsInCategory('helmet');
    const weapons = listArmyFormationIconsInCategory('weapon');
    const animals = listArmyFormationIconsInCategory('animal');
    const vehicles = listArmyFormationIconsInCategory('vehicle');
    const nato = listArmyFormationIconsInCategory('nato');

    expect(ARMY_FORMATION_ICON_TOTAL_COUNT).toBe(292);
    expect(catalog).toHaveLength(292);
    expect(listArmyFormationIconCategories()).toEqual([
      'helmet',
      'weapon',
      'animal',
      'vehicle',
      'nato',
    ]);
    expect(helmets).toHaveLength(39);
    expect(weapons).toHaveLength(23);
    expect(animals).toHaveLength(60);
    expect(vehicles).toHaveLength(26);
    expect(nato).toHaveLength(144);
    expect(helmets[0]?.id).toBe('helmet-01');
    expect(weapons[0]?.id).toBe('weapon-01');
    expect(animals[0]?.id).toBe('animal-01');
    expect(animals[30]?.id).toBe('animal-31');
    expect(animals[59]?.id).toBe('animal-60');
    expect(vehicles[0]?.id).toBe('vehicle-01');
    expect(nato[0]?.id).toBe('nato-001');
    expect(nato[48]?.id).toBe('nato-049');
    expect(nato[96]?.id).toBe('nato-097');
    expect(nato[143]?.id).toBe('nato-144');
    expect(catalog[0]?.svgMarkup).toContain('<svg');
    expect(requireArmyFormationCatalogIcon('helmet-01')).toBe(helmets[0]);
  });

  it('未知分类会抛出并带上原值', () => {
    expect(() => listArmyFormationIconsInCategory('siege')).toThrow(
      'Unknown army formation icon category: "siege"',
    );
  });

  it('未知图标会抛出并带上原值', () => {
    expect(() => requireArmyFormationCatalogIcon('missing-icon')).toThrow(
      'Army formation icon id "missing-icon" was not found.',
    );
    expect(() => requireArmyFormationCatalogIcon('')).toThrow(
      'Icon id must be a non-empty string, received ""',
    );
  });
});
