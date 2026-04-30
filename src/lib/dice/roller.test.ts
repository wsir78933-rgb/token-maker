import { describe, expect, it } from 'vitest';

import { formatMixedDiceRequest, rollMixedDice } from '@/lib/dice/roller';

describe('formatMixedDiceRequest', () => {
  it('formats grouped expressions with positive modifier', () => {
    expect(
      formatMixedDiceRequest({
        groups: [
          { sides: 6, count: 2 },
          { sides: 20, count: 1 },
        ],
        modifier: 3,
      }),
    ).toBe('2d6 + 1d20 + 3');
  });

  it('formats zero-group modifier-only requests', () => {
    expect(formatMixedDiceRequest({ groups: [], modifier: 0 })).toBe('0');
    expect(formatMixedDiceRequest({ groups: [], modifier: -2 })).toBe('-2');
  });
});

describe('rollMixedDice', () => {
  it('rolls each group and computes totals deterministically with injected random', () => {
    const values = [0.99, 0.49, 0.0];
    let index = 0;
    const fakeRandom = () => values[index++] ?? 0;

    const result = rollMixedDice(
      {
        groups: [
          { sides: 6, count: 2 },
          { sides: 20, count: 1 },
        ],
        modifier: 2,
      },
      fakeRandom,
    );

    expect(result.groups[0]?.rolls).toEqual([6, 3]);
    expect(result.groups[1]?.rolls).toEqual([1]);
    expect(result.total).toBe(12);
    expect(result.allRolls).toHaveLength(3);
  });
});
