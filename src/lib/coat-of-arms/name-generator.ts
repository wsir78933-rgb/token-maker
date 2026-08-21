import type { CoatLocale } from './types';

export interface CoatIdentity {
  projectName: string;
  motto: string;
}

export type IdentityRandomValueSource = () => number;

export const nameGeneratorTypes = [
  'city', 'cult', 'demon', 'dragon', 'dwarf', 'elven', 'fantasy-kingdom',
  'gods', 'knight', 'orc', 'pirate-ship', 'realm', 'roman-province', 'tavern',
] as const;

export type NameGeneratorType = (typeof nameGeneratorTypes)[number];
export type NameGeneratorLanguage = 'en' | 'de';
export type NameRandomValueSource = () => number;

interface NameWordBank {
  first: readonly string[];
  second: readonly string[];
}

const englishHouseNames = ['Alder', 'Beacon', 'Cedar', 'Dawn', 'Falcon', 'Harbor'] as const;
const englishMottos = ['Courage in service', 'Steady through change', 'Honor lights the way', 'Rooted and rising', 'Guard the common good', 'Truth before triumph'] as const;
const chineseProjectNames = ['青松纹章', '远山纹章', '星河纹章', '海岚纹章', '赤枫纹章', '晨光纹章'] as const;
const chineseMottos = ['勇毅守信', '心正行远', '守望相助', '厚德致远', '明志笃行', '不息向前'] as const;

const nameWordBanks: Record<NameGeneratorType, Record<NameGeneratorLanguage, NameWordBank>> = {
  city: {
    en: { first: ['Alder', 'Silver', 'Raven', 'Cedar'], second: ['Harbor', 'Vale', 'Bridge', 'Heights'] },
    de: { first: ['Eichen', 'Silber', 'Raben', 'Tannen'], second: ['Hafen', 'Tal', 'Bruecke', 'Hoehen'] },
  },
  cult: {
    en: { first: ['Veiled', 'Crimson', 'Silent', 'Hidden'], second: ['Circle', 'Covenant', 'Order', 'Choir'] },
    de: { first: ['Verhüllter', 'Purpur', 'Stiller', 'Verborgener'], second: ['Kreis', 'Bund', 'Orden', 'Chor'] },
  },
  demon: {
    en: { first: ['Ash', 'Blood', 'Ember', 'Night'], second: ['Maw', 'Warden', 'Crown', 'Whisper'] },
    de: { first: ['Asche', 'Blut', 'Glut', 'Nacht'], second: ['Rachen', 'Wächter', 'Krone', 'Flüstern'] },
  },
  dragon: {
    en: { first: ['Ember', 'Storm', 'Iron', 'Moon'], second: ['Drake', 'Wyrm', 'Scale', 'Flight'] },
    de: { first: ['Glut', 'Sturm', 'Eisen', 'Mond'], second: ['Drache', 'Wyrm', 'Schuppe', 'Flug'] },
  },
  dwarf: {
    en: { first: ['Granite', 'Hammer', 'Deep', 'Copper'], second: ['Hold', 'Forge', 'Delve', 'Anvil'] },
    de: { first: ['Granit', 'Hammer', 'Tief', 'Kupfer'], second: ['Burg', 'Schmiede', 'Stollen', 'Amboss'] },
  },
  elven: {
    en: { first: ['Elarin', 'Sylvan', 'Moonlit', 'Silverleaf'], second: ['Grove', 'Starfall', 'Whisper', 'Dawn'] },
    de: { first: ['Elarin', 'Sylvan', 'Mond', 'Silberblatt'], second: ['Hain', 'Sternfall', 'Flüstern', 'Morgen'] },
  },
  'fantasy-kingdom': {
    en: { first: ['Aurora', 'Ever', 'High', 'Golden'], second: ['Crown', 'Kingdom', 'Throne', 'March'] },
    de: { first: ['Aurora', 'Ewig', 'Hoch', 'Goldene'], second: ['Krone', 'Königreich', 'Thron', 'Mark'] },
  },
  gods: {
    en: { first: ['Thunder', 'Sun', 'Tide', 'Dawn'], second: ['Pantheon', 'Blessing', 'Temple', 'Oath'] },
    de: { first: ['Donner', 'Sonne', 'Gezeiten', 'Morgen'], second: ['Pantheon', 'Segen', 'Tempel', 'Eid'] },
  },
  knight: {
    en: { first: ['Valiant', 'Iron', 'Bright', 'Lion'], second: ['Lance', 'Shield', 'Banner', 'Guard'] },
    de: { first: ['Tapfer', 'Eisen', 'Heller', 'Löwe'], second: ['Lanze', 'Schild', 'Banner', 'Wacht'] },
  },
  orc: {
    en: { first: ['Grim', 'Ragged', 'Red', 'War'], second: ['Fang', 'Crusher', 'Tribe', 'Claw'] },
    de: { first: ['Grimm', 'Zerfetzt', 'Rot', 'Kriegs'], second: ['Zahn', 'Brecher', 'Stamm', 'Klaue'] },
  },
  'pirate-ship': {
    en: { first: ['Black', 'Salt', 'Rogue', 'Storm'], second: ['Gull', 'Reef', 'Sloop', 'Corsair'] },
    de: { first: ['Schwarz', 'Salz', 'Räuber', 'Sturm'], second: ['Möwe', 'Riff', 'Schaluppe', 'Korsar'] },
  },
  realm: {
    en: { first: ['Western', 'Free', 'Frost', 'Sunset'], second: ['Reach', 'Realm', 'Expanse', 'Frontier'] },
    de: { first: ['Westliche', 'Freie', 'Frost', 'Sonnen'], second: ['Weite', 'Reich', 'Land', 'Grenze'] },
  },
  'roman-province': {
    en: { first: ['Aurelia', 'Valeria', 'Lunaria', 'Septima'], second: ['Provincia', 'March', 'Colonia', 'Legion'] },
    de: { first: ['Aurelia', 'Valeria', 'Lunaria', 'Septima'], second: ['Provinz', 'Mark', 'Kolonie', 'Legion'] },
  },
  tavern: {
    en: { first: ['Golden', 'Laughing', 'Wandering', 'Copper'], second: ['Stag', 'Hearth', 'Tankard', 'Boar'] },
    de: { first: ['Goldener', 'Lachender', 'Wandernder', 'Kupferner'], second: ['Hirsch', 'Herd', 'Krug', 'Eber'] },
  },
};

/** Generates a unique list from a type-specific bilingual word bank. */
export function generateCoatNames(
  type: NameGeneratorType,
  language: NameGeneratorLanguage,
  count = 8,
  randomValue: NameRandomValueSource = Math.random,
): string[] {
  assertNameGeneratorType(type);
  assertNameGeneratorLanguage(language);
  assertGeneratedNameCount(count);
  assertNameRandomValueSource(randomValue);
  const random = randomValue();
  assertNameRandomValue(random);
  const wordBank = nameWordBanks[type][language];
  const combinations = wordBank.first.flatMap((first) => wordBank.second.map((second) => `${first} ${second}`));
  if (count > combinations.length) {
    throw new Error(`Invalid generated name count: ${count}; maximum is ${combinations.length}`);
  }
  const startIndex = Math.floor(random * combinations.length);
  return Array.from({ length: count }, (_, offset) => combinations[(startIndex + offset) % combinations.length]!);
}

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

function assertNameGeneratorType(type: unknown): asserts type is NameGeneratorType {
  if (!nameGeneratorTypes.includes(type as NameGeneratorType)) {
    throw new Error(`Invalid name generator type: ${String(type)}`);
  }
}

function assertNameGeneratorLanguage(language: unknown): asserts language is NameGeneratorLanguage {
  if (language !== 'en' && language !== 'de') {
    throw new Error(`Invalid name generator language: ${String(language)}`);
  }
}

function assertGeneratedNameCount(count: unknown): asserts count is number {
  if (typeof count !== 'number' || !Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid generated name count: ${String(count)}`);
  }
}

function assertNameRandomValueSource(randomValue: unknown): asserts randomValue is NameRandomValueSource {
  if (typeof randomValue !== 'function') {
    throw new Error(`Invalid name random value source: ${String(randomValue)}`);
  }
}

function assertNameRandomValue(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error(`Invalid random value for name generator: ${String(value)}`);
  }
}
