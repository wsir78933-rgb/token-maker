import { describe, expect, it } from 'vitest';
import { applySvgPaintReplacements, extractSvgPaintColours } from './svg-paint-colours';

const heater002Svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">',
  '<rect fill="#B4282E" stroke="none"/>',
  '<rect fill="#E1B432" stroke="#111111"/>',
  '<path fill="none" stroke="#111111"/>',
  '</svg>',
].join('');

describe('extractSvgPaintColours', () => {
  it('returns unique fill and stroke hex colours in document order and keeps the first casing', () => {
    expect(extractSvgPaintColours(heater002Svg)).toEqual(['#B4282E', '#E1B432', '#111111']);
    expect(extractSvgPaintColours('<rect fill="#b4282e" stroke="#B4282E"/>')).toEqual(['#b4282e']);
  });

  it('skips none and ignores non-hex paints', () => {
    expect(extractSvgPaintColours('<g fill="none" stroke="url(#clip)"><rect fill="#1855A5"/></g>')).toEqual([
      '#1855A5',
    ]);
  });

  it('rejects a non-string SVG document with the offending value', () => {
    expect(() => extractSvgPaintColours(12 as never)).toThrow('12');
    expect(() => extractSvgPaintColours(undefined as never)).toThrow('undefined');
  });
});

describe('applySvgPaintReplacements', () => {
  it('replaces fill and stroke hex colours case-insensitively', () => {
    const replaced = applySvgPaintReplacements(heater002Svg, {
      '#b4282e': '#004E89',
      '#111111': '#ABCDEF',
    });

    expect(replaced).toContain('fill="#004E89"');
    expect(replaced).toContain('stroke="#ABCDEF"');
    expect(replaced).not.toContain('#B4282E');
    expect(replaced).not.toContain('#111111');
    expect(replaced).toContain('fill="#E1B432"');
  });

  it('rejects an unknown replacement key with the key in the error', () => {
    expect(() => applySvgPaintReplacements(heater002Svg, { '#FFFFFF': '#004E89' })).toThrow('#FFFFFF');
  });

  it('rejects an invalid replacement hex with the offending value', () => {
    expect(() => applySvgPaintReplacements(heater002Svg, { '#B4282E': '#xyz' })).toThrow('#xyz');
    expect(() => applySvgPaintReplacements(heater002Svg, { '#B4282E': '#FFF' })).toThrow('#FFF');
  });
});
