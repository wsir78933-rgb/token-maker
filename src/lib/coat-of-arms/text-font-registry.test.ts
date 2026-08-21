import { describe, expect, it, vi } from 'vitest';
import { assertTextFontAvailable, getTextFontOption, listTextFontOptions, searchTextFontOptions } from './text-font-registry';

describe('text font registry', () => {
  it('exposes a meaningful local registry across font families', () => {
    const options = listTextFontOptions();
    expect(options.length).toBeGreaterThanOrEqual(20);
    expect(new Set(options.map((option) => option.category))).toEqual(new Set(['serif', 'sans', 'display', 'blackletter', 'monospace', 'cursive']));
  });

  it('searches labels and throws a specific error for unavailable fonts', () => {
    expect(searchTextFontOptions('cardinal').map((option) => option.id)).toContain('cardinal');
    expect(() => getTextFontOption('missing-font' as never)).toThrow('Font is unavailable: missing-font');
  });

  it('uses truthful generic fallback stacks without probing browser font availability', () => {
    expect(getTextFontOption('cardinal').stack).toBe('serif');
    const check = vi.fn(() => false);
    vi.stubGlobal('document', { fonts: { check } });
    try {
      expect(() => assertTextFontAvailable('cardinal')).not.toThrow();
      expect(check).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('keeps the public registry and nested entries immutable', () => {
    const options = listTextFontOptions();
    expect(Object.isFrozen(options)).toBe(true);
    expect(Object.isFrozen(options[0])).toBe(true);
    expect(Object.isFrozen(options[0]?.label)).toBe(true);
    expect(Object.isFrozen(options[0]?.searchTerms)).toBe(true);
  });
});
