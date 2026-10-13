import { getLanguageGeneratorPageCopy } from '@/lib/language-generator/page-copy';
import { generatePopulation, getPopulationPresets } from '@/lib/population-generator';
import { getLocalizedPath, isSiteLocale, type SiteLocale } from '@/lib/site-locale';

export type ToolDirectoryImagePreview = {
  type: 'image';
  src: string;
  alt: string;
  fit: 'cover' | 'contain';
  surface: 'light' | 'dark';
};

export type ToolDirectoryTextPreview = {
  type: 'text';
  sourceLabel: string;
  source: string;
  resultLabel: string;
  result: string;
};

export type ToolDirectoryPreview = ToolDirectoryImagePreview | ToolDirectoryTextPreview;

export type ToolDirectoryItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  preview: ToolDirectoryPreview;
};

type ToolDirectoryToolId =
  | 'token-maker'
  | 'dice-roller'
  | 'coat-of-arms-maker'
  | 'armor-creator'
  | 'outfit-creator'
  | 'weapon-creator'
  | 'army-formation-creator'
  | 'emblem-creator'
  | 'language-generator'
  | 'calendar-creator'
  | 'family-tree-creator'
  | 'constellation-map-creator'
  | 'solar-system-creator'
  | 'periodic-table-creator'
  | 'tarot-cards'
  | 'scroll-creator'
  | 'town-creator'
  | 'castle-creator'
  | 'map-maker'
  | 'notice-board-creator'
  | 'population-generator';

type ToolDirectoryImageDefinition = Omit<ToolDirectoryImagePreview, 'type' | 'alt'> & {
  type: 'image';
  altByLocale: Record<SiteLocale, string>;
};

type ToolDirectoryPreviewDefinition =
  | ToolDirectoryImageDefinition
  | { type: 'language-example' }
  | { type: 'population-example' };

type ToolDirectoryDefinition = {
  id: ToolDirectoryToolId;
  path: string;
  preview: ToolDirectoryPreviewDefinition;
};

type ToolDirectoryLocalizedCopy = {
  name: string;
  description: string;
};

const toolDirectoryDefinitions: readonly ToolDirectoryDefinition[] = [
  {
    id: 'token-maker',
    path: '/',
    preview: {
      type: 'image',
      src: '/showcase/radiant-paladin-circle.webp',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'Finished fantasy character token featuring a radiant paladin',
        zh: '已完成的奇幻角色头像作品：光辉圣武士',
      },
    },
  },
  {
    id: 'dice-roller',
    path: '/dice-roller-dnd',
    preview: {
      type: 'image',
      src: '/images/dice-cases/greatsword.webp',
      fit: 'cover',
      surface: 'dark',
      altByLocale: {
        en: 'Two D&D dice showing the result of a greatsword attack roll',
        zh: '显示巨剑攻击掷骰结果的两枚 D&D 骰子',
      },
    },
  },
  {
    id: 'coat-of-arms-maker',
    path: '/coat-of-arms-maker',
    preview: {
      type: 'image',
      src: '/coat-of-arms-maker/hero/tool-made/ivory/crimson-lion.webp',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'Completed coat of arms with a crimson lion on an ivory shield',
        zh: '象牙白盾面上饰有绯红雄狮的完成版纹章',
      },
    },
  },
  {
    id: 'armor-creator',
    path: '/armor-creator',
    preview: {
      type: 'image',
      src: '/armor-creator/examples/temple-guardian.png',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'Armor Creator example showing a temple guardian outfit',
        zh: '护甲制作器案例：神殿守卫装束',
      },
    },
  },
  {
    id: 'outfit-creator',
    path: '/outfit-creator',
    preview: {
      type: 'image',
      src: '/outfit-creator/cases/01-woodland-ranger.png',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'Outfit Creator example showing a woodland ranger',
        zh: '服装设计器案例：林地游侠',
      },
    },
  },
  {
    id: 'weapon-creator',
    path: '/weapon-creator',
    preview: {
      type: 'image',
      src: '/weapon-creator/cases/01-warden-greatblade.png',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'Fantasy greatblade created with the Weapon Creator',
        zh: '武器制作器创作的奇幻巨剑',
      },
    },
  },
  {
    id: 'army-formation-creator',
    path: '/army-formation-creator',
    preview: {
      type: 'image',
      src: '/army-formation-cases/01-地下河窄桥阻击-掩护同伴撤离.png',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'Battle map planning a narrow-bridge ambush and party retreat',
        zh: '窄桥阻击并掩护队伍撤离的战斗地图规划',
      },
    },
  },
  {
    id: 'emblem-creator',
    path: '/emblem-creator',
    preview: {
      type: 'image',
      src: '/emblem-creator/examples/01-adventurers-guild.png',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'Finished insignia for an adventurers guild',
        zh: '冒险者公会的完成版徽章',
      },
    },
  },
  {
    id: 'language-generator',
    path: '/language-generator',
    preview: { type: 'language-example' },
  },
  {
    id: 'calendar-creator',
    path: '/calendar-creator',
    preview: {
      type: 'image',
      src: '/calendar-creator/examples/calendar-01.webp',
      fit: 'cover',
      surface: 'light',
      altByLocale: {
        en: 'Finished fantasy calendar created with the calendar tool',
        zh: '日历工具创作的奇幻日历成品',
      },
    },
  },
  {
    id: 'family-tree-creator',
    path: '/family-tree-creator',
    preview: {
      type: 'image',
      src: '/family-tree/cases/01-royal-succession.png',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'Royal family tree showing lines of succession',
        zh: '展示王位继承关系的王室家谱',
      },
    },
  },
  {
    id: 'constellation-map-creator',
    path: '/constellation-map-creator',
    preview: {
      type: 'image',
      src: '/constellation-map-creator/showcase/forest-night-sky.webp',
      fit: 'cover',
      surface: 'dark',
      altByLocale: {
        en: 'Fantasy constellation map set against a forest night sky',
        zh: '以森林夜空为背景的奇幻星座地图',
      },
    },
  },
  {
    id: 'solar-system-creator',
    path: '/solar-system-creator',
    preview: {
      type: 'image',
      src: '/solar-system-creator/examples/compact-multi-planet-system.png',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'A compact star system with several planets and their orbits',
        zh: '包含多颗行星与轨道的紧凑恒星系统',
      },
    },
  },
  {
    id: 'periodic-table-creator',
    path: '/periodic-table-creator',
    preview: {
      type: 'image',
      src: '/periodic-table-creator/cases/elemental-schools.webp',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'Fantasy periodic table organized into elemental schools',
        zh: '按元素学派整理的奇幻周期表',
      },
    },
  },
  {
    id: 'tarot-cards',
    path: '/tarot-cards',
    preview: {
      type: 'image',
      src: '/tarot-cards/major-00-fool.webp',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'The Fool card from a completed fantasy tarot deck',
        zh: '奇幻塔罗牌组中的愚者牌成品',
      },
    },
  },
  {
    id: 'scroll-creator',
    path: '/scroll-creator',
    preview: {
      type: 'image',
      src: '/scroll-creator/examples/01-task-commission.png',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'Completed parchment quest commission scroll',
        zh: '已完成的羊皮纸任务委托卷轴',
      },
    },
  },
  {
    id: 'town-creator',
    path: '/town-creator',
    preview: {
      type: 'image',
      src: '/town-creator/cases/01-dockside-trading-town.png',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'A completed fantasy trading town map beside the docks',
        zh: '码头旁已完成的奇幻贸易城镇地图',
      },
    },
  },
  {
    id: 'castle-creator',
    path: '/castle-creator',
    preview: {
      type: 'image',
      src: '/castle-creator/examples/royal-main-keep.webp',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'A large layered keep with four symmetrical guard towers',
        zh: '中央多层主堡与四座对称守塔组成的王室主堡',
      },
    },
  },
  {
    id: 'map-maker',
    path: '/map-maker',
    preview: {
      type: 'image',
      src: '/map-maker/examples/01-greenvale-frontier.webp',
      fit: 'contain',
      surface: 'light',
      altByLocale: {
        en: 'Fantasy frontier map with a winding river, forests, fields, a village, and an old tower ruin',
        zh: '奇幻边境地图上有蜿蜒河流、林地、田野、村庄与旧塔遗迹',
      },
    },
  },
  {
    id: 'notice-board-creator',
    path: '/notice-board-creator',
    preview: {
      type: 'image',
      src: '/notice-board-creator/cases/01-tavern-jobs.webp',
      fit: 'contain',
      surface: 'dark',
      altByLocale: {
        en: 'Four English tavern notices for a midnight cellar knock, ferry-watch soup, a harvest fiddler, and a gathering',
        zh: '四则英文酒馆告示：午夜地下室敲门、渡口送汤、丰收宴乐师招募和炉边聚餐',
      },
    },
  },
  {
    id: 'population-generator',
    path: '/population-generator',
    preview: { type: 'population-example' },
  },
];

const toolDirectoryCopyByLocale: Record<SiteLocale, Record<ToolDirectoryToolId, ToolDirectoryLocalizedCopy>> = {
  en: {
    'token-maker': {
      name: 'Token Maker',
      description: 'Create and customize fantasy character tokens for your tabletop games.',
    },
    'dice-roller': {
      name: 'D&D Dice Roller',
      description: 'Roll D&D dice and see the result for an attack, check, or saving throw.',
    },
    'coat-of-arms-maker': {
      name: 'Coat of Arms Maker',
      description: 'Draw a fantasy shield or guild badge, then export your finished design.',
    },
    'armor-creator': {
      name: 'Armor Creator',
      description: 'Build and customize a fantasy armor illustration for a character.',
    },
    'outfit-creator': {
      name: 'Outfit Creator',
      description: 'Design a character outfit by combining fantasy clothing and gear.',
    },
    'weapon-creator': {
      name: 'Weapon Creator',
      description: 'Create illustrated fantasy weapons for your characters and campaigns.',
    },
    'army-formation-creator': {
      name: 'Army Formation Planner',
      description: 'Arrange units and terrain to plan a tactical tabletop encounter.',
    },
    'emblem-creator': {
      name: 'Emblem Creator',
      description: 'Create a custom insignia for a guild, faction, or adventuring party.',
    },
    'language-generator': {
      name: 'Fantasy Language Generator',
      description: 'Transform phrases with custom spelling rules for a fictional language.',
    },
    'calendar-creator': {
      name: 'Fantasy Calendar Generator',
      description: 'Build a reusable calendar for the dates and seasons in your world.',
    },
    'family-tree-creator': {
      name: 'Fantasy Family Tree Creator',
      description: 'Map family relationships and lineages for your fictional world.',
    },
    'constellation-map-creator': {
      name: 'Constellation Map Creator',
      description: 'Design a fantasy star map by placing stars and connecting constellations.',
    },
    'solar-system-creator': {
      name: 'Solar System Creator',
      description: 'Build a planetary system by arranging planets and their orbits.',
    },
    'periodic-table-creator': {
      name: 'Fantasy Periodic Table Creator',
      description: 'Organize fictional materials into a custom periodic table.',
    },
    'tarot-cards': {
      name: 'Tarot Cards',
      description: 'Draw a single card or one of 15 spreads for story and tabletop-game inspiration.',
    },
    'scroll-creator': {
      name: 'Fantasy Scroll Creator',
      description: 'Design in-world scrolls and documents for a fantasy adventure.',
    },
    'town-creator': {
      name: 'Fantasy Town Creator',
      description: 'Arrange buildings and scenery to create a town map for your world.',
    },
    'castle-creator': {
      name: 'Castle Creator',
      description: 'Arrange modular castle parts on a canvas to create and export a fantasy castle.',
    },
    'map-maker': {
      name: 'Fantasy World Map Maker',
      description: 'Shape coastlines, place landmarks, and label locations on an editable fantasy map.',
    },
    'notice-board-creator': {
      name: 'Fantasy Notice Board Creator',
      description: 'Arrange quest notices on parchment boards, style their text, and save or print campaign boards.',
    },
    'population-generator': {
      name: 'Population Generator',
      description: 'Generate a settlement’s population, households, farmland, livestock, and occupations from era and size presets.',
    },
  },
  zh: {
    'token-maker': {
      name: 'Token Maker 头像制作器',
      description: '为桌游角色创建并定制奇幻头像 Token。',
    },
    'dice-roller': {
      name: 'D&D 骰子掷骰器',
      description: '掷出 D&D 骰子，查看攻击、属性检定或豁免的结果。',
    },
    'coat-of-arms-maker': {
      name: '纹章制作器',
      description: '绘制奇幻盾徽或公会徽章，并导出完成的设计。',
    },
    'armor-creator': {
      name: '护甲制作器',
      description: '为角色制作并定制奇幻护甲插画。',
    },
    'outfit-creator': {
      name: '服装搭配工具',
      description: '组合奇幻服饰与装备，为角色设计一套造型。',
    },
    'weapon-creator': {
      name: '武器制作器',
      description: '为角色和冒险故事创作奇幻武器插画。',
    },
    'army-formation-creator': {
      name: '军队阵型规划器',
      description: '摆放单位与地形，规划桌游战斗中的战术阵型。',
    },
    'emblem-creator': {
      name: '势力徽章制作器',
      description: '为公会、阵营或冒险小队制作专属徽章。',
    },
    'language-generator': {
      name: '奇幻语言生成器',
      description: '使用自定义拼写规则，将短句转写成虚构语言风格。',
    },
    'calendar-creator': {
      name: '奇幻日历生成器',
      description: '为你的世界设定日期与季节，并制作可复用的日历。',
    },
    'family-tree-creator': {
      name: '奇幻家谱制作器',
      description: '梳理虚构世界中的亲属关系与家族世系。',
    },
    'constellation-map-creator': {
      name: '星座地图制作器',
      description: '摆放星点并连接星座，设计一幅奇幻星图。',
    },
    'solar-system-creator': {
      name: '恒星系统制作器',
      description: '安排行星与运行轨道，构建虚构的行星系统。',
    },
    'periodic-table-creator': {
      name: '奇幻周期表制作器',
      description: '把虚构材料分类整理成专属周期表。',
    },
    'tarot-cards': {
      name: '塔罗牌工具',
      description: '抽取单张塔罗牌或使用 15 种牌阵，为故事创作和桌游冒险寻找灵感。',
    },
    'scroll-creator': {
      name: '奇幻卷轴制作器',
      description: '为奇幻冒险设计世界内的卷轴与文书。',
    },
    'town-creator': {
      name: '奇幻城镇制作器',
      description: '摆放建筑与场景，为你的世界制作城镇地图。',
    },
    'castle-creator': {
      name: '城堡制作器',
      description: '在画布上组合模块化城堡素材，创作并导出奇幻城堡。',
    },
    'map-maker': {
      name: '奇幻世界地图制作器',
      description: '塑造海岸线、摆放地标并标注地点，制作可编辑的奇幻地图。',
    },
    'notice-board-creator': {
      name: '奇幻任务公告板制作器',
      description: '在羊皮纸公告板上排布任务告示、调整文字样式，并保存或打印跑团公告板。',
    },
    'population-generator': {
      name: '人口生成器',
      description: '根据时代与规模预设生成聚落人口、住户、农田、牲畜和职业分布。',
    },
  },
};

function getLanguageGeneratorTextPreview(locale: SiteLocale): ToolDirectoryTextPreview {
  const languagePageCopy = getLanguageGeneratorPageCopy(locale);
  const campaignInscription = languagePageCopy.caseStudies.cases.find(
    (caseStudy) => caseStudy.id === 'campaign-inscription',
  );

  if (!campaignInscription) {
    throw new Error(
      `Language Generator example "campaign-inscription" was not found for locale "${locale}".`,
    );
  }

  const example = campaignInscription.examples[0];

  if (!example) {
    throw new Error(
      `Language Generator example "campaign-inscription" has no output examples for locale "${locale}".`,
    );
  }

  return {
    type: 'text',
    sourceLabel: languagePageCopy.caseStudies.sourceLabel,
    source: example.source,
    resultLabel: languagePageCopy.caseStudies.resultLabel,
    result: example.result,
  };
}

function getPopulationGeneratorTextPreview(locale: SiteLocale): ToolDirectoryTextPreview {
  const medievalVillagePreset = getPopulationPresets('medieval').find(
    (preset) => preset.size === 'village',
  );

  if (!medievalVillagePreset) {
    throw new Error('Population Generator example preset "medieval village" was not found.');
  }

  const generatedSettlement = generatePopulation({
    era: medievalVillagePreset.era,
    size: medievalVillagePreset.size,
    locale,
    random: () => 0.5,
  });
  const populationRange = `${medievalVillagePreset.min.toLocaleString(locale)}–${medievalVillagePreset.max.toLocaleString(locale)}`;
  const generatedPopulation = generatedSettlement.population.value.toLocaleString(locale);
  const generatedHouseholds = generatedSettlement.households.value.toLocaleString(locale);

  return {
    type: 'text',
    sourceLabel: locale === 'zh' ? '中世纪村庄' : 'Medieval village',
    source: locale === 'zh'
      ? `${populationRange} 人`
      : `${populationRange} residents`,
    resultLabel: locale === 'zh' ? '人口 / 住户' : 'People / households',
    result: `${generatedPopulation} / ${generatedHouseholds}`,
  };
}

function getToolDirectoryPreview(
  definition: ToolDirectoryDefinition,
  locale: SiteLocale,
): ToolDirectoryPreview {
  if (definition.preview.type === 'language-example') {
    return getLanguageGeneratorTextPreview(locale);
  }

  if (definition.preview.type === 'population-example') {
    return getPopulationGeneratorTextPreview(locale);
  }

  return {
    type: 'image',
    src: definition.preview.src,
    alt: definition.preview.altByLocale[locale],
    fit: definition.preview.fit,
    surface: definition.preview.surface,
  };
}

export type ToolDirectoryLink = {
  id: ToolDirectoryToolId;
  name: string;
  path: string;
  href: string;
};

function assertToolDirectoryLocale(locale: SiteLocale) {
  if (typeof locale !== 'string' || !isSiteLocale(locale)) {
    throw new Error(`Unknown tool directory locale. Received ${JSON.stringify(locale)}.`);
  }
}

function readToolDirectoryCopy(locale: SiteLocale, toolId: ToolDirectoryToolId) {
  const localizedCopy = toolDirectoryCopyByLocale[locale][toolId];

  if (!localizedCopy) {
    throw new Error(`Tool directory copy for "${toolId}" was not found for locale "${locale}".`);
  }

  return localizedCopy;
}

function getToolDirectoryHref(locale: SiteLocale, path: string) {
  if (path === '/') {
    return `${getLocalizedPath(locale, '/')}#editor-workspace`;
  }

  return getLocalizedPath(locale, path);
}

export function getToolDirectoryLinks(locale: SiteLocale): ToolDirectoryLink[] {
  assertToolDirectoryLocale(locale);

  return toolDirectoryDefinitions.map((definition) => {
    const localizedCopy = readToolDirectoryCopy(locale, definition.id);

    return {
      id: definition.id,
      name: localizedCopy.name,
      path: definition.path,
      href: getToolDirectoryHref(locale, definition.path),
    };
  });
}

export function getToolDirectoryItems(locale: SiteLocale): ToolDirectoryItem[] {
  assertToolDirectoryLocale(locale);

  return toolDirectoryDefinitions.map((definition) => {
    const localizedCopy = readToolDirectoryCopy(locale, definition.id);

    return {
      id: definition.id,
      name: localizedCopy.name,
      description: localizedCopy.description,
      href: getToolDirectoryHref(locale, definition.path),
      preview: getToolDirectoryPreview(definition, locale),
    };
  });
}
