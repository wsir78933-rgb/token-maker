import { describe, expect, it } from 'vitest';

import {
  describeDiceRoll,
  parseDiceExpression,
  rollDiceExpression,
} from '@/lib/dice/roller';

function createSequenceRandom(values: number[]) {
  let index = 0;

  return () => {
    const value = values[index] ?? values[values.length - 1] ?? 0;
    index += 1;
    return value;
  };
}

describe('parseDiceExpression', () => {
  it('能把常见 DnD 表达式规范化', () => {
    expect(parseDiceExpression(' 4 d 6 dl 1 + 2 ')).toEqual({
      raw: '4 d 6 dl 1 + 2',
      count: 4,
      sides: 6,
      modifier: 2,
      dropMode: 'lowest',
      dropCount: 1,
      normalized: '4d6dl1+2',
    });
  });

  it('会为省略数量的表达式补成 1 颗骰子', () => {
    expect(parseDiceExpression('d20')).toMatchObject({
      count: 1,
      sides: 20,
      normalized: '1d20',
    });
  });

  it('会拒绝超范围和不合法的表达式', () => {
    expect(parseDiceExpression('13d6')).toBeNull();
    expect(parseDiceExpression('4d6dl4')).toBeNull();
    expect(parseDiceExpression('2d3')).toBeNull();
  });
});

describe('rollDiceExpression', () => {
  it('能按 drop lowest 和 modifier 计算结果', () => {
    const result = rollDiceExpression('4d6dl1+2', createSequenceRandom([0.99, 0.2, 0.49, 0.01]));

    expect(result).toMatchObject({
      normalizedExpression: '4d6dl1+2',
      rolls: [6, 2, 3, 1],
      keptIndexes: [0, 1, 2],
      droppedIndexes: [3],
      keptRolls: [6, 2, 3],
      droppedRolls: [1],
      subtotal: 11,
      total: 13,
      dropMode: 'lowest',
      dropCount: 1,
    });
  });

  it('能按 drop highest 计算结果并保留原始顺序索引', () => {
    const result = rollDiceExpression('4d6dh1-1', createSequenceRandom([0.99, 0.2, 0.49, 0.01]));

    expect(result).toMatchObject({
      rolls: [6, 2, 3, 1],
      keptIndexes: [1, 2, 3],
      droppedIndexes: [0],
      keptRolls: [2, 3, 1],
      droppedRolls: [6],
      subtotal: 6,
      total: 5,
      dropMode: 'highest',
      dropCount: 1,
    });
  });

  it('能输出面向 UI 的自然语言描述', () => {
    const result = rollDiceExpression('4d6dl1+2', createSequenceRandom([0.8, 0.6, 0.4, 0.2]));

    expect(result).not.toBeNull();
    expect(describeDiceRoll(result!)).toBe('4d6 drop lowest 1 + 2');
  });
});
