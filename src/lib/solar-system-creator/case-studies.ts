import type { SiteLocale } from '@/lib/site-locale';

export type SolarSystemCaseStudyGroupCopy = {
  readonly id: string;
  readonly imagePosition: 'left' | 'right';
  readonly carouselLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly examples: readonly {
    readonly name: string;
    readonly designation: string;
    readonly quote: string;
    readonly src: string;
  }[];
};

export type SolarSystemCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly groups: readonly SolarSystemCaseStudyGroupCopy[];
};

const englishSolarSystemCaseStudies: SolarSystemCaseStudiesCopy = {
  title: 'Solar System Creator Examples',
  description:
    'Twelve fictional Solar System Creator examples show how a solar system can support a novel setting, a TRPG session, or worldbuilding notes.',
  groups: [
    {
      id: 'fiction',
      imagePosition: 'left',
      carouselLabel: 'Fiction examples',
      previousLabel: 'Previous fiction example',
      nextLabel: 'Next fiction example',
      examples: [
        {
          name: 'New Home System',
          designation: 'Science-fiction novel authors',
          quote:
            'A left-anchored star and orderly medium and small planets leave room for a new-colony story to grow.',
          src: '/solar-system-creator/examples/new-home-system.png',
        },
        {
          name: 'Ocean Civilization System',
          designation: 'Science-fiction novel authors',
          quote:
            'Blue-leaning and larger planet assets create a visual contrast for water-resource, ocean-civilization, or atmosphere-focused settings.',
          src: '/solar-system-creator/examples/ocean-civilization-system.png',
        },
        {
          name: 'Desert Trade System',
          designation: 'Science-fiction novel authors',
          quote:
            'Sparse, widely spaced planets turn distance and open black space into a prompt for scarce resources and important routes.',
          src: '/solar-system-creator/examples/desert-trade-system.png',
        },
        {
          name: 'Imperial Core System',
          designation: 'Science-fiction novel authors',
          quote:
            'Six orderly, staggered planets create a concentrated composition for political centers and layered societies.',
          src: '/solar-system-creator/examples/imperial-core-system.png',
        },
      ],
    },
    {
      id: 'trpg',
      imagePosition: 'right',
      carouselLabel: 'TRPG examples',
      previousLabel: 'Previous TRPG example',
      nextLabel: 'Next TRPG example',
      examples: [
        {
          name: 'Frozen Frontier System',
          designation: 'TRPG players and DMs/GMs',
          quote:
            'Cool or pale assets, wide spacing, and one outer planet suggest a remote frontier under environmental pressure.',
          src: '/solar-system-creator/examples/frozen-frontier-system.png',
        },
        {
          name: 'Lost Ruins System',
          designation: 'TRPG players and DMs/GMs',
          quote:
            'An asymmetric layout with one isolated planet gives an investigation or lost-civilization plot a clear focus.',
          src: '/solar-system-creator/examples/lost-ruins-system.png',
        },
        {
          name: 'Resource Conflict System',
          designation: 'TRPG players and DMs/GMs',
          quote:
            'Planets of varied colors and sizes with a small moon suggest resource differences and competing interests.',
          src: '/solar-system-creator/examples/resource-conflict-system.png',
        },
        {
          name: 'Uncharted Exploration System',
          designation: 'TRPG players and DMs/GMs',
          quote:
            'Mixed categories, irregular non-overlapping spacing, and open black space support unknown-region exploration.',
          src: '/solar-system-creator/examples/uncharted-exploration-system.png',
        },
      ],
    },
    {
      id: 'concept',
      imagePosition: 'left',
      carouselLabel: 'Worldbuilding examples',
      previousLabel: 'Previous worldbuilding example',
      nextLabel: 'Next worldbuilding example',
      examples: [
        {
          name: 'Lava Danger System',
          designation: 'Worldbuilders and game concept designers',
          quote:
            'A large warm or high-contrast planet and distant companions create a danger-focused visual reference.',
          src: '/solar-system-creator/examples/lava-danger-system.png',
        },
        {
          name: 'Giant Planet and Moons',
          designation: 'Worldbuilders and game concept designers',
          quote:
            'One large striped giant planet with three smaller moons creates a clear outer-system anchor.',
          src: '/solar-system-creator/examples/giant-planet-moons.png',
        },
        {
          name: 'Compact Multi-Planet System',
          designation: 'Worldbuilders and game concept designers',
          quote:
            'Eight small, staggered planets create a dense but readable composition for comparing categories and spatial relationships.',
          src: '/solar-system-creator/examples/compact-multi-planet-system.png',
        },
        {
          name: 'Mythic Star Order',
          designation: 'Fantasy novel authors and TRPG worldbuilders',
          quote:
            'Planets increasing in size from lower left to upper right create a stepped order for prophecy, dynasty, or ceremony themes.',
          src: '/solar-system-creator/examples/mythic-star-order.png',
        },
      ],
    },
  ],
};

const chineseSolarSystemCaseStudies: SolarSystemCaseStudiesCopy = {
  title: '太阳系创建器案例展示',
  description: '12 个虚构案例展示太阳系创建器如何用于小说设定、TRPG 资料和世界观记录。',
  groups: [
    {
      id: 'fiction',
      imagePosition: 'left',
      carouselLabel: '小说案例',
      previousLabel: '上一个小说案例',
      nextLabel: '下一个小说案例',
      examples: [
        {
          name: '新家园星系',
          designation: '科幻小说作者',
          quote: '单恒星固定在左侧，右侧错落安排中小型行星，适合记录新殖民地或故事开篇。',
          src: '/solar-system-creator/examples/new-home-system.png',
        },
        {
          name: '海洋文明星系',
          designation: '科幻小说作者',
          quote: '偏蓝与较大行星素材形成视觉对照，适合记录水资源、海洋文明或大气差异设定。',
          src: '/solar-system-creator/examples/ocean-civilization-system.png',
        },
        {
          name: '沙漠商路星系',
          designation: '科幻小说作者',
          quote: '稀疏分布的行星拉开距离，让黑色空间提示资源稀缺与重要航线。',
          src: '/solar-system-creator/examples/desert-trade-system.png',
        },
        {
          name: '帝国核心星系',
          designation: '科幻小说作者',
          quote: '六颗错落而有秩序的行星形成集中构图，适合记录政治核心与层级社会。',
          src: '/solar-system-creator/examples/imperial-core-system.png',
        },
      ],
    },
    {
      id: 'trpg',
      imagePosition: 'right',
      carouselLabel: 'TRPG 案例',
      previousLabel: '上一个 TRPG 案例',
      nextLabel: '下一个 TRPG 案例',
      examples: [
        {
          name: '冰封边境星系',
          designation: 'TRPG 玩家和 DM/GM',
          quote: '偏冷或浅色素材、较大的间距和外侧孤立行星，适合表现边境探索与环境压力。',
          src: '/solar-system-creator/examples/frozen-frontier-system.png',
        },
        {
          name: '失落遗迹星系',
          designation: 'TRPG 玩家和 DM/GM',
          quote: '不对称布局突出一颗孤立行星，为失落文明调查或任务地点留下叙事焦点。',
          src: '/solar-system-creator/examples/lost-ruins-system.png',
        },
        {
          name: '资源争夺星系',
          designation: 'TRPG 玩家和 DM/GM',
          quote: '不同色彩与大小的行星配一颗小卫星，适合组织围绕资源差异展开的冲突剧本。',
          src: '/solar-system-creator/examples/resource-conflict-system.png',
        },
        {
          name: '未知探索星系',
          designation: 'TRPG 玩家和 DM/GM',
          quote: '多种类别、不规则且不重叠的间距与黑色空间，适合开场探索未知区域。',
          src: '/solar-system-creator/examples/uncharted-exploration-system.png',
        },
      ],
    },
    {
      id: 'concept',
      imagePosition: 'left',
      carouselLabel: '世界观案例',
      previousLabel: '上一个世界观案例',
      nextLabel: '下一个世界观案例',
      examples: [
        {
          name: '熔岩险境星系',
          designation: '世界观创作者和游戏概念设计师',
          quote: '放大的暖色或高对比主行星配合远处天体，适合制作高危险主题的视觉参考。',
          src: '/solar-system-creator/examples/lava-danger-system.png',
        },
        {
          name: '巨行星与卫星群',
          designation: '世界观创作者和游戏概念设计师',
          quote: '一颗大型条纹巨行星与 3 个较小卫星，形成清晰的外层系统视觉锚点。',
          src: '/solar-system-creator/examples/giant-planet-moons.png',
        },
        {
          name: '紧凑多行星系统',
          designation: '世界观创作者和游戏概念设计师',
          quote: '8 颗错开的行星形成密集但清晰的构图，方便比较类别与空间关系。',
          src: '/solar-system-creator/examples/compact-multi-planet-system.png',
        },
        {
          name: '神话星序',
          designation: '奇幻小说作者和 TRPG 世界观创作者',
          quote: '行星从左下向右上逐渐增大，形成阶梯星序，适合记录预言、王朝或祭典主题。',
          src: '/solar-system-creator/examples/mythic-star-order.png',
        },
      ],
    },
  ],
};

export function getSolarSystemCaseStudiesCopy(locale: SiteLocale): SolarSystemCaseStudiesCopy {
  if (locale === 'en') return englishSolarSystemCaseStudies;
  if (locale === 'zh') return chineseSolarSystemCaseStudies;
  throw new Error(`Solar system case studies locale must be en or zh. Received ${String(locale)}.`);
}
