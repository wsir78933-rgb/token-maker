export type SupportedDieSides = 4 | 6 | 8 | 10 | 12 | 20 | 100;

const SUPPORTED_DIE_SIDES = [4, 6, 8, 10, 12, 20, 100] as const;
const MAX_TOTAL_DICE = 15;

export interface DiceGroup {
  sides: SupportedDieSides;
  count: number;
}

export interface MixedDiceRollRequest {
  groups: DiceGroup[];
  modifier: number;
}

export interface DiceGroupRollResult {
  sides: SupportedDieSides;
  count: number;
  rolls: number[];
  subtotal: number;
}

export interface RolledDie {
  sides: SupportedDieSides;
  value: number;
  groupIndex: number;
  rollIndex: number;
}

export interface MixedDiceRollResult {
  request: MixedDiceRollRequest;
  groups: DiceGroupRollResult[];
  modifier: number;
  total: number;
  allRolls: RolledDie[];
}

function isSupportedDieSides(value: number): value is SupportedDieSides {
  return SUPPORTED_DIE_SIDES.includes(value as SupportedDieSides);
}

export function parseMixedDiceExpression(expression: string): MixedDiceRollRequest | null {
  const compactExpression = expression.toLowerCase().replace(/\s+/g, '');
  if (!compactExpression) return null;

  const tokens = compactExpression.match(/[+-]?[^+-]+/g);
  if (!tokens) return null;

  const groupCounts = new Map<SupportedDieSides, number>();
  let modifier = 0;
  let totalDice = 0;

  for (const token of tokens) {
    const sign = token.startsWith('-') ? -1 : 1;
    const value = token.replace(/^[+-]/, '');
    if (!value) return null;

    const dieMatch = value.match(/^(\d*)d(\d+)$/);
    if (dieMatch) {
      if (sign < 0) return null;

      const count = dieMatch[1] ? Number(dieMatch[1]) : 1;
      const sides = Number(dieMatch[2]);

      if (
        !Number.isInteger(count) ||
        count <= 0 ||
        !isSupportedDieSides(sides)
      ) {
        return null;
      }

      totalDice += count;
      if (totalDice > MAX_TOTAL_DICE) return null;

      groupCounts.set(sides, (groupCounts.get(sides) ?? 0) + count);
      continue;
    }

    if (!/^\d+$/.test(value)) return null;
    modifier += sign * Number(value);
  }

  const groups = [...groupCounts.entries()]
    .map(([sides, count]) => ({ sides, count }))
    .sort((left, right) => left.sides - right.sides);

  if (groups.length === 0 && modifier === 0) return null;

  return { groups, modifier };
}

function randomRoll(sides: SupportedDieSides, random: () => number) {
  return Math.floor(random() * sides) + 1;
}

export function rollMixedDice(
  request: MixedDiceRollRequest,
  random: () => number = Math.random
): MixedDiceRollResult {
  const groups: DiceGroupRollResult[] = [];
  const allRolls: RolledDie[] = [];
  let total = request.modifier;

  request.groups.forEach((group, groupIndex) => {
    if (group.count <= 0) return;

    const rolls: number[] = [];
    let subtotal = 0;

    for (let i = 0; i < group.count; i++) {
      const value = randomRoll(group.sides, random);
      rolls.push(value);
      subtotal += value;
      allRolls.push({
        sides: group.sides,
        value,
        groupIndex,
        rollIndex: i,
      });
    }

    groups.push({
      sides: group.sides,
      count: group.count,
      rolls,
      subtotal,
    });

    total += subtotal;
  });

  return {
    request,
    groups,
    modifier: request.modifier,
    total,
    allRolls,
  };
}

export function formatMixedDiceRequest(request: MixedDiceRollRequest): string {
  if (request.groups.length === 0) {
    return request.modifier === 0 ? '0' : request.modifier.toString();
  }

  const parts = request.groups.map((g) => `${g.count}d${g.sides}`);
  const base = parts.join(' + ');
  if (request.modifier === 0) return base;
  return request.modifier > 0 ? `${base} + ${request.modifier}` : `${base} - ${Math.abs(request.modifier)}`;
}
