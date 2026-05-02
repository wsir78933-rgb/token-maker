import { describe, expect, it } from 'vitest';

import {
  formatMixedDiceRequest,
  parseMixedDiceExpression,
  rollMixedDice,
} from '@/lib/dice/roller';

function createSequenceRandom(values: number[]) {
  let index = 0;

  return () => {
    const value = values[index] ?? values[values.length - 1] ?? 0;
    index += 1;
    return value;
  };
}

describe('parseMixedDiceExpression', () => {
  it('能把常见混合骰表达式规范化为骰子池', () => {
    expect(parseMixedDiceExpression(' 2 d 6 + d20 - 3 + 1d6 ')).toEqual({
      groups: [
        { sides: 6, count: 3 },
        { sides: 20, count: 1 },
      ],
      modifier: -3,
    });
  });

  it('会拒绝超范围和不支持的表达式', () => {
    expect(parseMixedDiceExpression('16d6')).toBeNull();
    expect(parseMixedDiceExpression('2d3')).toBeNull();
    expect(parseMixedDiceExpression('2d6-1d4')).toBeNull();
    expect(parseMixedDiceExpression('bad-input')).toBeNull();
  });
});

describe('rollMixedDice', () => {
  it('能按骰子池和 modifier 计算总数并保留分组', () => {
    const result = rollMixedDice(
      {
        groups: [
          { sides: 6, count: 2 },
          { sides: 20, count: 1 },
        ],
        modifier: 3,
      },
      createSequenceRandom([0, 0.99, 0.49]),
    );

    expect(result).toMatchObject({
      modifier: 3,
      total: 20,
      groups: [
        { sides: 6, count: 2, rolls: [1, 6], subtotal: 7 },
        { sides: 20, count: 1, rolls: [10], subtotal: 10 },
      ],
      allRolls: [
        { sides: 6, value: 1, groupIndex: 0, rollIndex: 0 },
        { sides: 6, value: 6, groupIndex: 0, rollIndex: 1 },
        { sides: 20, value: 10, groupIndex: 1, rollIndex: 0 },
      ],
    });
  });
});

describe('formatMixedDiceRequest', () => {
  it('能输出面向 UI 和 URL 的表达式', () => {
    expect(
      formatMixedDiceRequest({
        groups: [
          { sides: 4, count: 1 },
          { sides: 8, count: 2 },
        ],
        modifier: -1,
      }),
    ).toBe('1d4 + 2d8 - 1');
  });
});
