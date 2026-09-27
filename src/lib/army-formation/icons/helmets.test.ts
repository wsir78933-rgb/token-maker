import { describe, expect, it } from 'vitest';

import { listArmyHelmetIcons } from '@/lib/army-formation/icons/helmets';

const EXPECTED_HELMET_IDS = Array.from({ length: 39 }, (_, offset) => {
  const helmetIndex = offset + 1;
  return `helmet-${String(helmetIndex).padStart(2, '0')}`;
});

describe('listArmyHelmetIcons', () => {
  it('returns 39 unique ids from helmet-01 through helmet-39', () => {
    const icons = listArmyHelmetIcons();
    const ids = icons.map((icon) => icon.id);

    expect(icons).toHaveLength(39);
    expect(ids).toEqual(EXPECTED_HELMET_IDS);
    expect(new Set(ids).size).toBe(39);
    expect(ids[0]).toBe('helmet-01');
    expect(ids[38]).toBe('helmet-39');
  });

  it('draws each helmet as a distinct 50 by 30 currentColor svg without http', () => {
    const icons = listArmyHelmetIcons();
    const markupSet = new Set(icons.map((icon) => icon.svgMarkup));

    expect(markupSet.size).toBe(39);

    for (const icon of icons) {
      expect(icon.svgMarkup.startsWith('<svg viewBox="0 0 50 30">')).toBe(true);
      expect(icon.svgMarkup.endsWith('</svg>')).toBe(true);
      expect(icon.svgMarkup).toContain('viewBox="0 0 50 30"');
      expect(icon.svgMarkup).toContain('currentColor');
      expect(icon.svgMarkup).not.toContain('http');
      expect(icon.svgMarkup).not.toContain('<image');
    }
  });
});
