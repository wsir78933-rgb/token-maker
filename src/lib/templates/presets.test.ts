import { describe, expect, it } from 'vitest';

import { STYLE_PRESETS } from './presets';

describe('STYLE_PRESETS', () => {
  it('does not expose the classic editor preset', () => {
    expect(STYLE_PRESETS.map((preset) => preset.id)).not.toContain('classic');
    expect(STYLE_PRESETS.map((preset) => preset.name)).not.toContain('classic');
  });

  it('uses generated border assets as defaults for presets that have asset packs', () => {
    const expectedBorderIds = {
      warrior: 'warrior-border-01',
      mage: 'mage-border-01',
      rogue: 'rogue-border-01',
      cleric: 'cleric-border-01',
      undead: 'undead-border-01',
      monster: 'monster-border-01',
    };

    for (const [presetId, borderId] of Object.entries(expectedBorderIds)) {
      expect(STYLE_PRESETS.find((preset) => preset.id === presetId)?.borderId).toBe(borderId);
    }
  });
});
