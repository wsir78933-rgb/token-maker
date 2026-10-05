import { describe, expect, it } from 'vitest';

import { weaponPieceImagePath } from '@/lib/weapon-creator/icons';

describe('weapon icons', () => {
  it('returns the accepted 4x local path for each validated source piece', () => {
    expect(weaponPieceImagePath('grip1')).toBe('/weapon-creator/high-resolution/grip1-4x.png');
    expect(weaponPieceImagePath('pommel60')).toBe('/weapon-creator/high-resolution/pommel60-4x.png');
  });

  it('rejects unknown ids instead of producing a silent broken path', () => {
    expect(() => weaponPieceImagePath('missing1')).toThrowError('"missing1"');
  });
});
