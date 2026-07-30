import type { CoatLocale } from './types';

export interface CoatIdentity {
  projectName: string;
  motto: string;
}

export type IdentityRandomValueSource = () => number;

const englishHouseNames = ['Alder', 'Beacon', 'Cedar', 'Dawn', 'Falcon', 'Harbor'] as const;
const englishMottos = ['Courage in service', 'Steady through change', 'Honor lights the way', 'Rooted and rising', 'Guard the common good', 'Truth before triumph'] as const;
const chineseProjectNames = ['青松纹章', '远山纹章', '星河纹章', '海岚纹章', '赤枫纹章', '晨光纹章'] as const;
const chineseMottos = ['勇毅守信', '心正行远', '守望相助', '厚德致远', '明志笃行', '不息向前'] as const;

/** Produces a local, original project identity. A caller can inject randomness for reproducible tests. */
export function createCoatIdentity(
  locale: CoatLocale,
  randomValue: IdentityRandomValueSource = Math.random,
): CoatIdentity {
  assertLocale(locale);
  assertRandomValueSource(randomValue);
  if (locale === 'zh') {
    return {
      projectName: pick(chineseProjectNames, randomValue, 'Chinese project name'),
      motto: pick(chineseMottos, randomValue, 'Chinese motto'),
    };
  }
  return {
    projectName: `House ${pick(englishHouseNames, randomValue, 'English house name')}`,
    motto: pick(englishMottos, randomValue, 'English motto'),
  };
}

function pick<const Value>(choices: readonly Value[], randomValue: IdentityRandomValueSource, label: string): Value {
  const value = randomValue();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error(`Invalid random value for ${label}: ${String(value)}`);
  }
  const choice = choices[Math.floor(value * choices.length)];
  if (choice === undefined) throw new Error(`No local ${label} choices are available`);
  return choice;
}

function assertLocale(locale: unknown): asserts locale is CoatLocale {
  if (locale !== 'en' && locale !== 'zh') throw new Error(`Invalid coat locale: ${String(locale)}`);
}

function assertRandomValueSource(randomValue: unknown): asserts randomValue is IdentityRandomValueSource {
  if (typeof randomValue !== 'function') throw new Error(`Invalid random value source: ${String(randomValue)}`);
}
