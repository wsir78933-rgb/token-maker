import { describe, expect, it } from 'vitest';

import { STYLE_PRESETS } from './presets';

describe('STYLE_PRESETS', () => {
  it('does not expose the classic editor preset', () => {
    expect(STYLE_PRESETS.map((preset) => preset.id)).not.toContain('classic');
    expect(STYLE_PRESETS.map((preset) => preset.name)).not.toContain('classic');
  });
});
