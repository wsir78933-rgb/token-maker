import { describe, expect, it } from 'vitest';

import { listArmyVehicleIcons } from '@/lib/army-formation/icons/vehicles';

const EXPECTED_VEHICLE_IDS = Array.from({ length: 26 }, (_, index) => {
  return `vehicle-${String(index + 1).padStart(2, '0')}`;
});

describe('listArmyVehicleIcons', () => {
  it('返回 26 个不重复的载具图标，编号从 vehicle-01 到 vehicle-26', () => {
    const icons = listArmyVehicleIcons();
    const ids = icons.map((icon) => icon.id);

    expect(icons).toHaveLength(26);
    expect(ids).toEqual(EXPECTED_VEHICLE_IDS);
    expect(new Set(ids).size).toBe(26);
    expect(new Set(icons.map((icon) => icon.svgMarkup)).size).toBe(26);
  });

  it('每个图标都是 50×30 的 currentColor 矢量，并且不含外链', () => {
    const icons = listArmyVehicleIcons();

    for (const icon of icons) {
      expect(icon.svgMarkup.startsWith('<svg ')).toBe(true);
      expect(icon.svgMarkup.endsWith('</svg>')).toBe(true);
      expect(icon.svgMarkup).toContain('viewBox="0 0 50 30"');
      expect(icon.svgMarkup).toContain('currentColor');
      expect(icon.svgMarkup.toLowerCase()).not.toContain('http');
      expect(icon.svgMarkup.toLowerCase()).not.toContain('<image');
    }
  });
});
