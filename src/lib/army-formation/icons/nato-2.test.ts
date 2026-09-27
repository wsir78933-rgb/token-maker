import { describe, expect, it } from 'vitest';

import { listArmyNatoIconsPart2 } from '@/lib/army-formation/icons/nato-2';

function expectedNatoPartTwoIds(): string[] {
  const ids: string[] = [];
  for (let iconNumber = 49; iconNumber <= 96; iconNumber += 1) {
    ids.push(`nato-${String(iconNumber).padStart(3, '0')}`);
  }

  return ids;
}

describe('listArmyNatoIconsPart2', () => {
  it('返回 48 个不重复的编号，从 nato-049 到 nato-096', () => {
    const icons = listArmyNatoIconsPart2();
    const ids = icons.map((icon) => icon.id);
    const expectedIds = expectedNatoPartTwoIds();

    expect(icons).toHaveLength(48);
    expect(expectedIds).toHaveLength(48);
    expect(ids).toEqual(expectedIds);
    expect(ids[0]).toBe('nato-049');
    expect(ids[47]).toBe('nato-096');
    expect(new Set(ids).size).toBe(48);
  });

  it('每个图形都是 50×30 的 currentColor SVG，且没有外链', () => {
    const icons = listArmyNatoIconsPart2();
    const markupValues = icons.map((icon) => icon.svgMarkup);

    expect(new Set(markupValues).size).toBe(48);

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
