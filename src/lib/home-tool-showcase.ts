import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export type HomeToolShowcaseSurface = 'light' | 'dark';

export type HomeToolShowcaseItem = {
  readonly id: string;
  readonly title: string;
  readonly toolName: string;
  readonly description: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly displayAspectRatio?: number;
  readonly href: string;
  readonly surface: HomeToolShowcaseSurface;
};

export type HomeToolShowcase = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly toolLinkLabel: string;
  readonly previousCasesLabel: string;
  readonly nextCasesLabel: string;
  readonly viewAllLabel: string;
  readonly previewImageLabel: string;
  readonly closePreviewLabel: string;
  readonly allToolsHref: string;
  readonly items: readonly HomeToolShowcaseItem[];
};

type HomeToolShowcaseSectionCopy = Omit<HomeToolShowcase, 'items' | 'allToolsHref'>;

type HomeToolShowcaseCaseCopy = {
  readonly title: string;
  readonly toolName: string;
  readonly description: string;
  readonly imageAlt: string;
};

type HomeToolShowcaseCase = {
  readonly id: string;
  readonly imageSrc: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly displayAspectRatio?: number;
  readonly surface: HomeToolShowcaseSurface;
  readonly copy: Record<SiteLocale, HomeToolShowcaseCaseCopy>;
};

const HOME_TOOL_SHOWCASE_SECTION_COPY: Record<SiteLocale, HomeToolShowcaseSectionCopy> = {
  en: {
    eyebrow: 'Free tools',
    title: 'Explore more creative tools',
    description:
      'Add detail to your world with coats of arms, armor, weapons, emblems, and castles. Choose a tool and start creating.',
    toolLinkLabel: 'Open tool',
    previousCasesLabel: 'Show previous examples',
    nextCasesLabel: 'Show more examples',
    viewAllLabel: 'View all tools',
    previewImageLabel: 'Preview image',
    closePreviewLabel: 'Close image preview',
  },
  zh: {
    eyebrow: '免费工具',
    title: '探索更多创作工具',
    description: '用纹章、护甲、武器、徽标与城堡，为你的世界添上更多细节。选择工具，开始创作。',
    toolLinkLabel: '打开工具',
    previousCasesLabel: '查看前面的案例',
    nextCasesLabel: '查看更多案例',
    viewAllLabel: '查看全部工具',
    previewImageLabel: '预览图片',
    closePreviewLabel: '关闭图片预览',
  },
};

const HOME_TOOL_SHOWCASE_CASES: readonly HomeToolShowcaseCase[] = [
  {
    id: 'coat-of-arms-maker',
    imageSrc: '/coat-assets/showcase/azure-wings.webp',
    imageWidth: 1024,
    imageHeight: 1024,
    surface: 'light',
    copy: {
      en: {
        title: 'House of Azure Wings',
        toolName: 'Coat of Arms Maker',
        description:
          'This house guards the mountain routes and treats every safe arrival as a point of honor.',
        imageAlt: 'Blue shield with a gold border and a brown-and-gold griffin spreading its wings.',
      },
      zh: {
        title: '苍翼家族',
        toolName: '纹章制作器',
        description: '这个家族守护高地航路，把每一次平安抵达都视为荣誉。',
        imageAlt: '深蓝色盾牌配金色边框，中央是一只展开双翼的棕金色狮鹫。',
      },
    },
  },
  {
    id: 'armor-creator',
    imageSrc: '/armor-creator/examples/gate-guard.png',
    imageWidth: 600,
    imageHeight: 500,
    surface: 'dark',
    copy: {
      en: {
        title: 'Gate Guard',
        toolName: 'Armor Creator',
        description:
          'A heavy breastplate, closed helm, and layered pauldrons create a sturdy silhouette for a city gate guard.',
        imageAlt:
          'White line-art gate guard in a closed helm, with a spiked pauldron on one shoulder and segmented plates on the torso, arms, and legs.',
      },
      zh: {
        title: '城门重甲卫士',
        toolName: '护甲制作器',
        description: '厚重胸甲、封闭式头盔与层叠护肩，构成稳固的城防轮廓。',
        imageAlt: '白色线稿城门卫士，戴封闭式头盔，一侧肩甲带尖刺，躯干、手臂和腿部分为分段板甲。',
      },
    },
  },
  {
    id: 'weapon-creator',
    imageSrc: '/home-tool-showcase/weapon-white.png',
    imageWidth: 3200,
    imageHeight: 2540,
    surface: 'light',
    copy: {
      en: {
        title: 'Warden Greatblade',
        toolName: 'Weapon Creator',
        description:
          'A broad blade, guarded hilt, and long grip create a sturdy two-handed silhouette for a frontier warden.',
        imageAlt:
          'Dark line-art fantasy greatblade on a pure white background, assembled from a blade, crossguard, grip, and pommel.',
      },
      zh: {
        title: '边境守卫大剑',
        toolName: '武器制作器',
        description: '宽刃、护手和长握柄组合出稳重的双手武器轮廓，适合作为边境守卫的视觉参考。',
        imageAlt: '纯白背景上的深色线稿奇幻大剑，由剑刃、护手、握柄和柄首组成。',
      },
    },
  },
  {
    id: 'emblem-creator',
    imageSrc: '/emblem-creator/examples/01-adventurers-guild.png',
    imageWidth: 1024,
    imageHeight: 1024,
    surface: 'dark',
    copy: {
      en: {
        title: "Adventurers' Guild",
        toolName: 'Emblem Creator',
        description:
          "In Emblem Maker, combine the shield, crossed weapons, star, and branch detail to give an adventurers' guild a compact mark.",
        imageAlt:
          'White shield emblem with crossed black weapons, a small star above them, and a branch decoration along the lower edge.',
      },
      zh: {
        title: '冒险者公会',
        toolName: '徽标制作工具',
        description:
          '在徽章制作器中组合盾形底、交叉武器、小星形图标与枝叶细节，为冒险者公会做出紧凑的组织标识。',
        imageAlt: '白色盾形徽标中央有交叉的黑色武器、上方有小星形图标，底部带枝叶装饰。',
      },
    },
  },
  {
    id: 'castle-creator',
    imageSrc: '/home-tool-showcase/castle-white.png',
    imageWidth: 1600,
    imageHeight: 1200,
    surface: 'light',
    copy: {
      en: {
        title: 'Adventurer Outpost',
        toolName: 'Castle Creator',
        description:
          'A compact square keep inside a low enclosed wall, suited to an adventuring party headquarters, supply stop, or frontier foothold.',
        imageAlt: 'A compact square keep inside a low enclosed wall.',
      },
      zh: {
        title: '冒险者据点',
        toolName: '城堡拼搭',
        description: '以一座紧凑方形主堡和低矮围墙组成小型冒险者据点，适合作为队伍驻地、补给站或边境落脚点。',
        imageAlt: '紧凑方形主堡被低矮围墙围合的城堡立面。',
      },
    },
  },
  {
    id: 'notice-board-creator',
    imageSrc: '/home-tool-showcase/notice-tavern-jobs.webp',
    imageWidth: 1696,
    imageHeight: 1200,
    displayAspectRatio: 1696 / 1200,
    surface: 'light',
    copy: {
      en: {
        title: 'First Job at the Village Tavern',
        toolName: 'Notice Board Creator',
        description:
          'A midnight cellar knock, ferry-watch soup run, and harvest supper turn a tavern notice board into opening-session hooks.',
        imageAlt:
          'Four English notices for a midnight cellar knock, ferry-watch soup, a harvest fiddler, and a tavern gathering.',
      },
      zh: {
        title: '小镇酒馆初次委托',
        toolName: '奇幻任务公告板制作器',
        description: '午夜地下室敲门、渡口送汤和丰收晚宴等告示，为酒馆开场提供了多个故事线索。',
        imageAlt: '四则英文酒馆告示：午夜地下室敲门、渡口送汤、丰收宴乐师招募和炉边聚餐。',
      },
    },
  },
  {
    id: 'army-formation-creator',
    imageSrc: '/home-tool-showcase/army-river-bridge.png',
    imageWidth: 780,
    imageHeight: 624,
    displayAspectRatio: 1696 / 1200,
    surface: 'light',
    copy: {
      en: {
        title: 'Underground River Bridge Ambush',
        toolName: 'Army Formation Planner',
        description:
          'A squad holds the narrow bridge over an underground river so companions can withdraw along the waterway.',
        imageAlt:
          'Top-down tactical grid map of a narrow bridge over an underground river, with colored troop markers around the crossing.',
      },
      zh: {
        title: '地下河窄桥阻击',
        toolName: '军队阵型规划器',
        description: '小队守在地下河的窄桥上阻击来敌，为同伴沿水道撤离留出通路。',
        imageAlt: '俯视战术网格地图中，彩色部队标记分布在地下河窄桥周围。',
      },
    },
  },
  {
    id: 'map-maker',
    imageSrc: '/home-tool-showcase/two-continents.png',
    imageWidth: 2240,
    imageHeight: 1260,
    displayAspectRatio: 1696 / 1200,
    surface: 'light',
    copy: {
      en: {
        title: 'Two-Continent World',
        toolName: 'Fantasy World Map Maker',
        description:
          'Two separated continents and a few offshore islands establish the broad geography of a new world.',
        imageAlt: 'Two separated continents with a few offshore islands and sparse terrain landmarks.',
      },
      zh: {
        title: '双大陆世界',
        toolName: '奇幻世界地图制作器',
        description: '两块彼此分离的大陆与少量离岛，勾勒出一个新世界的宏观地理。',
        imageAlt: '两块彼此分离的大陆与少量近海岛屿，分布着稀疏地形地标。',
      },
    },
  },
  {
    id: 'constellation-map-creator',
    imageSrc: '/home-tool-showcase/northbound-stars.webp',
    imageWidth: 1600,
    imageHeight: 1000,
    displayAspectRatio: 1696 / 1200,
    surface: 'dark',
    copy: {
      en: {
        title: 'Northbound Homecoming',
        toolName: 'Constellation Map Creator',
        description:
          'A deep-blue star map arranges several connected constellations as visual motifs for a fantasy sky.',
        imageAlt: 'Deep-blue star map with several connected geometric constellation patterns.',
      },
      zh: {
        title: '北境归航',
        toolName: '星座地图创建器',
        description: '深蓝色星空中排列着多组相连的星座图案，可作为幻想星图的视觉参考。',
        imageAlt: '深蓝色星图上分布着多组由连线连接的几何星座图案。',
      },
    },
  },
  {
    id: 'family-tree-creator',
    imageSrc: '/home-tool-showcase/royal-succession.png',
    imageWidth: 1024,
    imageHeight: 676,
    displayAspectRatio: 1696 / 1200,
    surface: 'dark',
    copy: {
      en: {
        title: 'Royal Succession',
        toolName: 'Family Tree Creator',
        description:
          'Four generations of royal portraits branch into family lines with clear succession links.',
        imageAlt:
          'Four-generation royal family tree with portrait cards connected by orange lines.',
      },
      zh: {
        title: '王室继承',
        toolName: '人物家谱制作器',
        description: '四代王室人物肖像分出不同家族支系，并以清晰连线呈现继承关系。',
        imageAlt: '四代王室人物家谱，人物肖像卡片由橙色连线连接。',
      },
    },
  },
];

function assertHomeToolShowcaseLocale(locale: SiteLocale): void {
  if (!Object.hasOwn(HOME_TOOL_SHOWCASE_SECTION_COPY, locale)) {
    throw new Error(`Unsupported home tool showcase locale: ${JSON.stringify(locale)}`);
  }
}

function buildHomeToolShowcaseItem(
  locale: SiteLocale,
  showcaseCase: HomeToolShowcaseCase,
): HomeToolShowcaseItem {
  const caseCopy = showcaseCase.copy[locale];

  return {
    id: showcaseCase.id,
    title: caseCopy.title,
    toolName: caseCopy.toolName,
    description: caseCopy.description,
    imageSrc: showcaseCase.imageSrc,
    imageAlt: caseCopy.imageAlt,
    imageWidth: showcaseCase.imageWidth,
    imageHeight: showcaseCase.imageHeight,
    displayAspectRatio: showcaseCase.displayAspectRatio,
    href: getLocalizedPath(locale, `/${showcaseCase.id}`),
    surface: showcaseCase.surface,
  };
}

function listHomeToolShowcaseItems(locale: SiteLocale): readonly HomeToolShowcaseItem[] {
  return HOME_TOOL_SHOWCASE_CASES.map((showcaseCase) => buildHomeToolShowcaseItem(locale, showcaseCase));
}

export function getHomeToolShowcase(locale: SiteLocale): HomeToolShowcase {
  assertHomeToolShowcaseLocale(locale);
  const sectionCopy = HOME_TOOL_SHOWCASE_SECTION_COPY[locale];

  return {
    eyebrow: sectionCopy.eyebrow,
    title: sectionCopy.title,
    description: sectionCopy.description,
    toolLinkLabel: sectionCopy.toolLinkLabel,
    previousCasesLabel: sectionCopy.previousCasesLabel,
    nextCasesLabel: sectionCopy.nextCasesLabel,
    viewAllLabel: sectionCopy.viewAllLabel,
    previewImageLabel: sectionCopy.previewImageLabel,
    closePreviewLabel: sectionCopy.closePreviewLabel,
    allToolsHref: getLocalizedPath(locale, '/tools'),
    items: listHomeToolShowcaseItems(locale),
  };
}
