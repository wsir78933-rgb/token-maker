export type ArmyFormationCaseTestimonial = {
  name: string;
  designation: string;
  quote: string;
  src: string;
};

export type ArmyFormationCaseTestimonialCarousels = {
  cases01To06: readonly ArmyFormationCaseTestimonial[];
  cases07To12: readonly ArmyFormationCaseTestimonial[];
};

const ARMY_FORMATION_CASE_COUNT = 12;
const ARMY_FORMATION_CASE_CAROUSEL_LENGTH = 6;
const ARMY_FORMATION_CASE_PUBLIC_DIRECTORY = '/army-formation-cases';

const ARMY_FORMATION_CASE_FILE_NAMES = [
  '01-地下河窄桥阻击-掩护同伴撤离.png',
  '02-地牢走廊遭遇战-前卫卡位掩护队友.png',
  '03-森林溪谷伏击-队伍穿越水道.png',
  '04-沙漠峡谷桥头争夺-小队压制通道.png',
  '05-雪山隘口突围-小队护送同伴撤离.png',
  '06-集市广场冲突-分队控制四方出口.png',
  '07-沉船海岸洞穴搜救-入口与残骸双线推进.png',
  '08-法师塔仪式防守-封锁召唤阵入口.png',
  '09-墓园夜袭-守住地穴并防侧翼.png',
  '10-熔岩桥攻坚-小队轮替通过火线.png',
  '11-酒馆突发冲突-前锋护住人群与出口.png',
  '12-村庄城门防守-援军守住城内街口.png',
] as const;

type ArmyFormationCaseText = {
  name: string;
  designation: string;
  sceneDescription: string;
};

const CHINESE_ARMY_FORMATION_CASE_TEXTS: readonly ArmyFormationCaseText[] = [
  {
    name: '地下河窄桥阻击',
    designation: '掩护同伴撤离',
    sceneDescription: '小队守在地下河的窄桥上阻击来敌，为同伴沿水道撤离留出通路。',
  },
  {
    name: '地牢走廊遭遇战',
    designation: '前卫卡位',
    sceneDescription: '遭遇发生在地牢走廊，前卫卡住通道，掩护身后的队友。',
  },
  {
    name: '森林溪谷伏击',
    designation: '穿越水道',
    sceneDescription: '队伍在森林溪谷穿越水道时进入伏击地带，需要在渡水时维持阵型。',
  },
  {
    name: '沙漠峡谷桥头争夺',
    designation: '压制通道',
    sceneDescription: '小队在沙漠峡谷争夺桥头，压制对岸通往峡谷深处的通道。',
  },
  {
    name: '雪山隘口突围',
    designation: '护送同伴撤离',
    sceneDescription: '小队从雪山隘口向外突围，护送同伴离开被封住的山口。',
  },
  {
    name: '集市广场冲突',
    designation: '控制四方出口',
    sceneDescription: '冲突发生在集市广场，分队分别看住四个方向的出口。',
  },
  {
    name: '沉船海岸洞穴搜救',
    designation: '入口与残骸双线推进',
    sceneDescription: '搜救沿沉船海岸的洞穴展开，一路守住入口，另一路沿残骸推进。',
  },
  {
    name: '法师塔仪式防守',
    designation: '封锁召唤阵入口',
    sceneDescription: '防守布置在法师塔的仪式现场，目标是封住召唤阵的入口。',
  },
  {
    name: '墓园夜袭',
    designation: '守住地穴并防侧翼',
    sceneDescription: '夜袭发生在墓园，守方同时守住地穴入口并防住侧翼。',
  },
  {
    name: '熔岩桥攻坚',
    designation: '轮替通过火线',
    sceneDescription: '攻坚沿熔岩桥展开，小队轮流通过暴露在火线中的桥面。',
  },
  {
    name: '酒馆突发冲突',
    designation: '护住人群与出口',
    sceneDescription: '冲突突然发生在酒馆内，前锋挡住通路，护住人群和出口。',
  },
  {
    name: '村庄城门防守',
    designation: '守住城内街口',
    sceneDescription: '防守集中在村庄城门，援军进入后守住城内的街口。',
  },
];

const ENGLISH_ARMY_FORMATION_CASE_TEXTS: readonly ArmyFormationCaseText[] = [
  {
    name: 'Underground River Bridge Ambush',
    designation: 'Covering a withdrawal',
    sceneDescription:
      'A squad holds the narrow bridge over an underground river so companions can withdraw along the waterway.',
  },
  {
    name: 'Dungeon Corridor Encounter',
    designation: 'Vanguard blocking the passage',
    sceneDescription: 'The encounter starts in a dungeon corridor, where the vanguard blocks the passage and covers the teammates behind.',
  },
  {
    name: 'Forest Ravine Ambush',
    designation: 'Crossing a waterway',
    sceneDescription: 'A party crosses a stream in a forest ravine and has to keep formation while moving through the ambush.',
  },
  {
    name: 'Desert Canyon Bridgehead',
    designation: 'Suppressing the passage',
    sceneDescription: 'A squad contests the bridgehead in a desert canyon and suppresses the passage on the far side.',
  },
  {
    name: 'Snow Pass Breakout',
    designation: 'Escorting companions out',
    sceneDescription: 'A squad breaks out through a snowbound mountain pass and escorts companions away from the blocked defile.',
  },
  {
    name: 'Market Square Clash',
    designation: 'Controlling four exits',
    sceneDescription: 'A clash breaks out in a market square, and the detachment covers the exits on all four sides.',
  },
  {
    name: 'Shipwreck Coast Cave Rescue',
    designation: 'Advancing on two lines',
    sceneDescription:
      'The rescue moves through a cave on a shipwreck coast, with one line at the entrance and another along the wreckage.',
  },
  {
    name: 'Mage Tower Ritual Defense',
    designation: 'Sealing the summoning entrance',
    sceneDescription: 'The defense is set inside a mage tower ritual, with the aim of sealing the entrance to the summoning circle.',
  },
  {
    name: 'Graveyard Night Raid',
    designation: 'Holding the crypt and flank',
    sceneDescription: 'A night raid reaches a graveyard, and the defenders hold the crypt entrance while covering the flank.',
  },
  {
    name: 'Lava Bridge Assault',
    designation: 'Rotating through the fire lane',
    sceneDescription: 'The assault follows a lava bridge, and the squad rotates across the span that sits in the line of fire.',
  },
  {
    name: 'Tavern Outbreak',
    designation: 'Protecting the crowd and exit',
    sceneDescription: 'A fight breaks out inside a tavern, and the vanguard blocks the way to protect the crowd and the exit.',
  },
  {
    name: 'Village Gate Defense',
    designation: 'Holding the inner streets',
    sceneDescription: 'The defense is set at a village gate, and reinforcements hold the street mouths inside the walls.',
  },
];

function armyFormationCasePrefix(caseNumber: number): string {
  if (!Number.isInteger(caseNumber) || caseNumber < 1 || caseNumber > ARMY_FORMATION_CASE_COUNT) {
    throw new Error(
      `Army formation case number must be an integer from 1 to ${ARMY_FORMATION_CASE_COUNT}. Received ${JSON.stringify(caseNumber)}.`,
    );
  }

  return String(caseNumber).padStart(2, '0');
}

function requireArmyFormationCaseText(fieldName: string, caseNumber: number, value: string): string {
  if (value.trim().length === 0) {
    throw new Error(
      `Army formation case ${armyFormationCasePrefix(caseNumber)} ${fieldName} must be a non-empty string. Received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function requireArmyFormationCaseFileName(fileName: string, caseNumber: number): string {
  const prefix = armyFormationCasePrefix(caseNumber);
  const hasSlash = fileName.includes('/') || fileName.includes('\\');

  if (hasSlash || !fileName.startsWith(`${prefix}-`) || !fileName.endsWith('.png')) {
    throw new Error(
      `Army formation case ${prefix} file name must match ${prefix}-*.png and contain no slash. Received ${JSON.stringify(fileName)}.`,
    );
  }

  return fileName;
}

function armyFormationCasePublicSrc(fileName: string, caseNumber: number): string {
  return `${ARMY_FORMATION_CASE_PUBLIC_DIRECTORY}/${requireArmyFormationCaseFileName(fileName, caseNumber)}`;
}

function armyFormationCaseQuote(
  caseNumber: number,
  sceneDescription: string,
  representativeLabel: string,
  quoteSeparator: string,
): string {
  const description = requireArmyFormationCaseText('sceneDescription', caseNumber, sceneDescription);
  const label = requireArmyFormationCaseText('representativeLabel', caseNumber, representativeLabel);

  if (description.startsWith(label)) {
    throw new Error(
      `Army formation case ${armyFormationCasePrefix(caseNumber)} sceneDescription must not repeat the representative label. Received ${JSON.stringify(description)}.`,
    );
  }

  return `${label}${quoteSeparator}${description}`;
}

function readArmyFormationCaseText(
  caseTexts: readonly ArmyFormationCaseText[],
  offset: number,
  caseNumber: number,
): ArmyFormationCaseText {
  const caseText = caseTexts[offset];

  if (caseText === undefined) {
    throw new Error(
      `Army formation case ${armyFormationCasePrefix(caseNumber)} text is missing at offset ${offset}. Received undefined.`,
    );
  }

  return caseText;
}

function buildArmyFormationCaseCarousel(
  fileNames: readonly string[],
  caseTexts: readonly ArmyFormationCaseText[],
  startCaseNumber: number,
  representativeLabel: string,
  quoteSeparator: string,
): readonly ArmyFormationCaseTestimonial[] {
  if (fileNames.length !== ARMY_FORMATION_CASE_CAROUSEL_LENGTH || caseTexts.length !== ARMY_FORMATION_CASE_CAROUSEL_LENGTH) {
    throw new Error(
      `Army formation case carousel starting at ${armyFormationCasePrefix(startCaseNumber)} must contain ${ARMY_FORMATION_CASE_CAROUSEL_LENGTH} file names and ${ARMY_FORMATION_CASE_CAROUSEL_LENGTH} texts. Received file names ${fileNames.length} and texts ${caseTexts.length}.`,
    );
  }

  const testimonials = fileNames.map((fileName, offset) => {
    const caseNumber = startCaseNumber + offset;
    const caseText = readArmyFormationCaseText(caseTexts, offset, caseNumber);

    return Object.freeze({
      name: requireArmyFormationCaseText('name', caseNumber, caseText.name),
      designation: requireArmyFormationCaseText('designation', caseNumber, caseText.designation),
      quote: armyFormationCaseQuote(caseNumber, caseText.sceneDescription, representativeLabel, quoteSeparator),
      src: armyFormationCasePublicSrc(fileName, caseNumber),
    });
  });

  const sources = testimonials.map((testimonial) => testimonial.src);
  if (new Set(sources).size !== sources.length) {
    throw new Error(
      `Army formation case carousel starting at ${armyFormationCasePrefix(startCaseNumber)} repeats a src. Received ${JSON.stringify(sources)}.`,
    );
  }

  return Object.freeze(testimonials);
}

function buildArmyFormationCaseTestimonialCarousels(
  caseTexts: readonly ArmyFormationCaseText[],
  representativeLabel: string,
  quoteSeparator: string,
): ArmyFormationCaseTestimonialCarousels {
  if (ARMY_FORMATION_CASE_FILE_NAMES.length !== ARMY_FORMATION_CASE_COUNT) {
    throw new Error(
      `Army formation case file names must contain ${ARMY_FORMATION_CASE_COUNT} entries. Received ${ARMY_FORMATION_CASE_FILE_NAMES.length}.`,
    );
  }

  if (caseTexts.length !== ARMY_FORMATION_CASE_COUNT) {
    throw new Error(
      `Army formation case texts must contain ${ARMY_FORMATION_CASE_COUNT} entries. Received ${caseTexts.length}.`,
    );
  }

  return Object.freeze({
    cases01To06: buildArmyFormationCaseCarousel(
      ARMY_FORMATION_CASE_FILE_NAMES.slice(0, ARMY_FORMATION_CASE_CAROUSEL_LENGTH),
      caseTexts.slice(0, ARMY_FORMATION_CASE_CAROUSEL_LENGTH),
      1,
      representativeLabel,
      quoteSeparator,
    ),
    cases07To12: buildArmyFormationCaseCarousel(
      ARMY_FORMATION_CASE_FILE_NAMES.slice(ARMY_FORMATION_CASE_CAROUSEL_LENGTH),
      caseTexts.slice(ARMY_FORMATION_CASE_CAROUSEL_LENGTH),
      ARMY_FORMATION_CASE_CAROUSEL_LENGTH + 1,
      representativeLabel,
      quoteSeparator,
    ),
  });
}

function listArmyFormationCaseSources(carousels: ArmyFormationCaseTestimonialCarousels): readonly string[] {
  return [...carousels.cases01To06, ...carousels.cases07To12].map((testimonial) => testimonial.src);
}

function assertSameArmyFormationCaseSources(
  chineseCarousels: ArmyFormationCaseTestimonialCarousels,
  englishCarousels: ArmyFormationCaseTestimonialCarousels,
): void {
  const chineseSources = listArmyFormationCaseSources(chineseCarousels);
  const englishSources = listArmyFormationCaseSources(englishCarousels);
  const sourcesMatch =
    chineseSources.length === englishSources.length &&
    chineseSources.every((src, index) => src === englishSources[index]);

  if (!sourcesMatch) {
    throw new Error(
      `Chinese and English army formation case src lists must match in order. Received Chinese ${JSON.stringify(chineseSources)} and English ${JSON.stringify(englishSources)}.`,
    );
  }
}

function buildPublishedArmyFormationCaseTestimonials(): {
  readonly chinese: ArmyFormationCaseTestimonialCarousels;
  readonly english: ArmyFormationCaseTestimonialCarousels;
} {
  const chinese = buildArmyFormationCaseTestimonialCarousels(CHINESE_ARMY_FORMATION_CASE_TEXTS, '代表性场景示例', '：');
  const english = buildArmyFormationCaseTestimonialCarousels(
    ENGLISH_ARMY_FORMATION_CASE_TEXTS,
    'Representative scenario example',
    ': ',
  );
  assertSameArmyFormationCaseSources(chinese, english);

  return Object.freeze({ chinese, english });
}

const PUBLISHED_ARMY_FORMATION_CASE_TESTIMONIALS = buildPublishedArmyFormationCaseTestimonials();

export function listChineseArmyFormationCaseTestimonials(): ArmyFormationCaseTestimonialCarousels {
  return PUBLISHED_ARMY_FORMATION_CASE_TESTIMONIALS.chinese;
}

export function listEnglishArmyFormationCaseTestimonials(): ArmyFormationCaseTestimonialCarousels {
  return PUBLISHED_ARMY_FORMATION_CASE_TESTIMONIALS.english;
}
