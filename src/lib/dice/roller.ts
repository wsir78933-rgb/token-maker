export type SupportedDieSides = 4 | 6 | 8 | 10 | 12 | 20 | 100;

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

