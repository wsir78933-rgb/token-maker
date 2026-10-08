import type { CircularTestimonial } from '@/components/armor-creator/circular-testimonials';
import type { SiteLocale } from '@/lib/site-locale';

export type TownCreatorCaseStudyGroupCopy = {
  readonly id: string;
  readonly title: string;
  readonly imagePosition: 'left' | 'right';
  readonly carouselLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly examples: readonly CircularTestimonial[];
};

export type TownCreatorCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly groups: readonly TownCreatorCaseStudyGroupCopy[];
};

const townCreatorCaseImagePaths = {
  docksideTradingTown: '/town-creator/cases/01-dockside-trading-town.png',
  woodlandHamlet: '/town-creator/cases/02-woodland-hamlet.png',
  wetlandVillage: '/town-creator/cases/03-wetland-village.png',
  marketAndTavernQuarter: '/town-creator/cases/04-market-and-tavern-quarter.png',
  desertCaravanStop: '/town-creator/cases/05-desert-caravan-stop.png',
  gatehouseGarrison: '/town-creator/cases/06-gatehouse-garrison.png',
  riverCrossingTown: '/town-creator/cases/07-river-crossing-town.png',
  abandonedVillage: '/town-creator/cases/08-abandoned-village.png',
  snowfieldCheckpoint: '/town-creator/cases/09-snowfield-checkpoint.png',
  farmingSettlement: '/town-creator/cases/10-farming-settlement.png',
  townOfManyQuarters: '/town-creator/cases/11-town-of-many-quarters.png',
  woodlandRuins: '/town-creator/cases/12-woodland-ruins.png',
} as const;

const englishTownCreatorCaseStudies: TownCreatorCaseStudiesCopy = {
  title: 'Town Map Ideas for Your Next Adventure',
  description:
    'Explore 12 town maps made and exported with Fantasy Town Generator, grouped into everyday settlements, trade routes, and exploration sites. Use these layouts as starting points for a D&D session, a tabletop RPG location, or a story setting.',
  groups: [
    {
      id: 'everyday-settlements',
      title: 'Everyday Settlements',
      imagePosition: 'left',
      carouselLabel: 'Everyday settlement town map examples',
      previousLabel: 'Previous everyday settlement example',
      nextLabel: 'Next everyday settlement example',
      examples: [
        {
          name: 'Woodland Hamlet',
          designation: 'Woodland hamlet map',
          quote:
            'Short dirt paths link the homes in this woodland map made with Fantasy Town Generator, while fields and orchard space frame a quiet starting village or an overgrown forest edge.',
          src: townCreatorCaseImagePaths.woodlandHamlet,
          alt: 'Top-down map of a woodland hamlet with scattered homes, dirt paths, fields, orchard trees, and forest greenery.',
        },
        {
          name: 'Farming Settlement',
          designation: 'Farming settlement map',
          quote:
            'Large crop plots surround a cross-shaped farm road in this Fantasy Town Generator example, with barns, sheds, a well, and an orchard forming a working settlement.',
          src: townCreatorCaseImagePaths.farmingSettlement,
          alt: 'Top-down map of a farming settlement with large crop fields, farm buildings, crossing dirt roads, a well, and an orchard.',
        },
        {
          name: 'Market and Tavern Quarter',
          designation: 'Market district map',
          quote:
            'A paved central quarter in this Fantasy Town Generator map groups a tavern, market stalls, small buildings, and wells, while long dirt roads leave space for arrivals and encounters.',
          src: townCreatorCaseImagePaths.marketAndTavernQuarter,
          alt: 'Top-down map of a market and tavern quarter with a paved central block, buildings, market stalls, wells, and long dirt roads.',
        },
        {
          name: 'Town of Many Quarters',
          designation: 'Multi-quarter town map',
          quote:
            'Several road-linked quarters divide homes, civic buildings, market space, and cultivated plots, giving a larger town room for faction routes and scene changes.',
          src: townCreatorCaseImagePaths.townOfManyQuarters,
          alt: 'Top-down map of a large town divided into road-linked residential, civic, market, and cultivated quarters.',
        },
      ],
    },
    {
      id: 'trade-and-frontiers',
      title: 'Trade and Frontiers',
      imagePosition: 'right',
      carouselLabel: 'Trade and frontier town map examples',
      previousLabel: 'Previous trade and frontier example',
      nextLabel: 'Next trade and frontier example',
      examples: [
        {
          name: 'Dockside Trading Town',
          designation: 'Waterfront trading town map',
          quote:
            'Four long docks reach into the water from rows of homes and shops along a grassy waterfront. This map made with Fantasy Town Generator suits cargo arrivals, waterfront chases, and harbor encounters.',
          src: townCreatorCaseImagePaths.docksideTradingTown,
          alt: 'Top-down map of a grassy waterfront town with rows of buildings, four long wooden docks, roads, trees, and open water.',
        },
        {
          name: 'River-Crossing Town',
          designation: 'River trade town map',
          quote:
            'A central stone bridge joins two built-up banks across the river in this Fantasy Town Generator map, with fields and an orchard at the lower edge for crossings, trade, and pursuit scenes.',
          src: townCreatorCaseImagePaths.riverCrossingTown,
          alt: 'Top-down map of a town on both sides of a central river with a stone bridge, roads, fields, and an orchard.',
        },
        {
          name: 'Desert Caravan Stop',
          designation: 'Desert caravan stop map',
          quote:
            'A sandstone-paved core and straight roads organize caravan buildings, stalls, tents, and wells in this map made with Fantasy Town Generator for a long overland stop.',
          src: townCreatorCaseImagePaths.desertCaravanStop,
          alt: 'Top-down map of a desert caravan stop with a sandstone-paved core, straight roads, buildings, stalls, tents, wells, and rocks.',
        },
        {
          name: 'Gatehouse Garrison',
          designation: 'Fortified checkpoint map',
          quote:
            'A rectangular stone garrison wall with corner towers encloses a compact inner yard, roads, gates, and military buildings for checkpoint or siege scenes.',
          src: townCreatorCaseImagePaths.gatehouseGarrison,
          alt: 'Top-down map of a rectangular stone garrison with corner towers, perimeter walls, gates, roads, and inner military buildings.',
        },
      ],
    },
    {
      id: 'exploration-and-ruins',
      title: 'Exploration and Ruins',
      imagePosition: 'left',
      carouselLabel: 'Exploration and ruins town map examples',
      previousLabel: 'Previous exploration and ruins example',
      nextLabel: 'Next exploration and ruins example',
      examples: [
        {
          name: 'Wetland Village',
          designation: 'Wetland village map',
          quote:
            'Water pockets occupy the northwest and southeast edges of this muddy village map made with Fantasy Town Generator. Sand paths meet at homes and a small bridge, marking routes for marsh travel.',
          src: townCreatorCaseImagePaths.wetlandVillage,
          alt: 'Top-down map of a muddy wetland village with water pockets at opposite edges, sand paths, homes, reeds, and a small bridge.',
        },
        {
          name: 'Abandoned Village',
          designation: 'Abandoned village map',
          quote:
            'Curving dirt lanes run through a sparse settlement of abandoned houses, scattered rocks, dead trees, and fields in this exploration map made with Fantasy Town Generator, leaving open sightlines for investigation.',
          src: townCreatorCaseImagePaths.abandonedVillage,
          alt: 'Top-down map of an abandoned village with dirt lanes, empty buildings, fields, rocks, and dead trees.',
        },
        {
          name: 'Snowfield Checkpoint',
          designation: 'Snowfield checkpoint map',
          quote:
            'Snow and ice border a straight central checkpoint road in this map made with Fantasy Town Generator. Two broad cleared yards, small structures, gates, and scattered rocks suit a remote crossing.',
          src: townCreatorCaseImagePaths.snowfieldCheckpoint,
          alt: 'Top-down map of a snowy checkpoint with a straight central road, two cleared yards, small structures, gates, and scattered rocks.',
        },
        {
          name: 'Woodland Ruins',
          designation: 'Woodland ruins map',
          quote:
            'A complete temple anchors a woodland clearing beside a small waterway, with a ring of stone paths around it, scattered ruins and gravestones beyond, and a diagonal approach road for exploration.',
          src: townCreatorCaseImagePaths.woodlandRuins,
          alt: 'Top-down map of woodland ruins with a complete temple, a ring of stone paths, scattered outer ruins and gravestones, a nearby waterway, and a diagonal approach road.',
        },
      ],
    },
  ],
};

const chineseTownCreatorCaseStudies: TownCreatorCaseStudiesCopy = {
  title: '用城镇案例构建下一场冒险',
  description:
    '下面 12 张由奇幻城镇生成器制作并导出的城镇地图，按日常聚落、商贸边境与探索遗迹分组。你可以把这些布局作为 D&D 场景、TRPG 地点或小说设定的参考起点。',
  groups: [
    {
      id: 'everyday-settlements',
      title: '聚落与生活',
      imagePosition: 'left',
      carouselLabel: '聚落与生活城镇地图案例',
      previousLabel: '上一个聚落与生活案例',
      nextLabel: '下一个聚落与生活案例',
      examples: [
        {
          name: '林缘村',
          designation: '林地村落地图',
          quote: '在这张用奇幻城镇生成器制作的林缘村地图上，短土路串起住屋，农田与果树分布在聚落两侧，适合作为安静的起始村或森林边缘地点。',
          src: townCreatorCaseImagePaths.woodlandHamlet,
          alt: '俯视林缘村地图：零散住屋、土路、农田、果树与林地绿植分布在画面中。',
        },
        {
          name: '农庄',
          designation: '农庄地图',
          quote: '农庄案例由奇幻城镇生成器制作：大片农田围绕十字形农路展开，谷仓、农舍、水井与果园组成一处正在运转的农庄。',
          src: townCreatorCaseImagePaths.farmingSettlement,
          alt: '俯视农庄地图：大片农田、农舍、交叉土路、水井与果园组成主要布局。',
        },
        {
          name: '市集旅店',
          designation: '市集街区地图',
          quote: '用奇幻城镇生成器搭建的市集街区，在铺装中央区域集中布置旅店、摊位、小型建筑与水井，外围长土路为来客和遭遇留下空间。',
          src: townCreatorCaseImagePaths.marketAndTavernQuarter,
          alt: '俯视市集旅店地图：铺装中央街区包含建筑、市集摊位和水井，外围有长土路。',
        },
        {
          name: '多区城镇',
          designation: '多街区城镇地图',
          quote: '多条道路连接住宅、公共建筑、市集空间与耕作地块，让较大的城镇可以承载不同势力路线和连续场景。',
          src: townCreatorCaseImagePaths.townOfManyQuarters,
          alt: '俯视多区城镇地图：道路连接住宅区、公共建筑、市集与耕作地块，形成多个街区。',
        },
      ],
    },
    {
      id: 'trade-and-frontiers',
      title: '商贸与边境',
      imagePosition: 'right',
      carouselLabel: '商贸与边境城镇地图案例',
      previousLabel: '上一个商贸与边境案例',
      nextLabel: '下一个商贸与边境案例',
      examples: [
        {
          name: '码头商贸城',
          designation: '水岸商贸城镇地图',
          quote: '码头商贸城由奇幻城镇生成器制作，成排住屋与商铺沿草地水岸展开，四条长码头伸入水面，可用于货物抵达、水岸追逐和港口遭遇。',
          src: townCreatorCaseImagePaths.docksideTradingTown,
          alt: '俯视水岸商贸城地图：草地上的成排建筑、四条伸入水面的木码头、道路、树木与水域清晰可见。',
        },
        {
          name: '河桥贸易镇',
          designation: '河流贸易城镇地图',
          quote: '河桥贸易镇案例使用奇幻城镇生成器搭建，中央石桥连接河流两岸街区，下方农田与果园适合安排过河、交易和追逐场景。',
          src: townCreatorCaseImagePaths.riverCrossingTown,
          alt: '俯视河桥贸易镇地图：中央河流分隔两岸街区，石桥连接道路，下方分布农田与果园。',
        },
        {
          name: '沙漠驿站',
          designation: '沙漠商旅驿站地图',
          quote: '砂岩铺装中心区与笔直道路围出商旅建筑、摊位、帐篷和水井，组成这张用奇幻城镇生成器制作的沙漠驿站地图。',
          src: townCreatorCaseImagePaths.desertCaravanStop,
          alt: '俯视沙漠驿站地图：砂岩铺装中心区、笔直道路、建筑、摊位、帐篷、水井与岩石分布在沙地上。',
        },
        {
          name: '城门卫戍',
          designation: '要塞关卡地图',
          quote: '矩形石墙与角楼围出紧凑的内院，墙门、道路和军用建筑适合设置边境检查或围城场景。',
          src: townCreatorCaseImagePaths.gatehouseGarrison,
          alt: '俯视城门卫戍地图：矩形石墙、角楼、墙门、道路与内部军用建筑围成一处关卡。',
        },
      ],
    },
    {
      id: 'exploration-and-ruins',
      title: '探索与遗迹',
      imagePosition: 'left',
      carouselLabel: '探索与遗迹城镇地图案例',
      previousLabel: '上一个探索与遗迹案例',
      nextLabel: '下一个探索与遗迹案例',
      examples: [
        {
          name: '湿地村',
          designation: '湿地村落地图',
          quote: '湿地村案例通过奇幻城镇生成器制作，泥地村落的西北与东南边缘各有水域，沙路汇向住屋和小桥，为沼泽旅行安排了清晰的通路。',
          src: townCreatorCaseImagePaths.wetlandVillage,
          alt: '俯视湿地村地图：泥地村落两侧有水域，沙路、住屋、芦苇与小桥组成主要路线。',
        },
        {
          name: '废弃村',
          designation: '废弃村落地图',
          quote: '这张用奇幻城镇生成器制作的废弃村地图中，弯曲土路穿过稀疏的废弃住屋、散落岩石、枯树与田地，开阔视线适合调查和搜索。',
          src: townCreatorCaseImagePaths.abandonedVillage,
          alt: '俯视废弃村地图：土路、空置建筑、田地、岩石与枯树分布在开阔地面上。',
        },
        {
          name: '雪原关口',
          designation: '雪原关卡地图',
          quote: '笔直的中央道路穿过冰雪，是这张用奇幻城镇生成器制作的雪原关口地图的主要通路；两侧有开阔场地、小型建筑、门道和散落岩石，适合偏远通行场景。',
          src: townCreatorCaseImagePaths.snowfieldCheckpoint,
          alt: '俯视雪原关口地图：中央直路穿过雪地，两侧有开阔场地、小型建筑、门道与散落岩石。',
        },
        {
          name: '林地遗迹',
          designation: '林地遗迹地图',
          quote: '完整神殿坐落在林间空地与小水道旁，周围环绕石路，外围散布废墟与墓碑，一条斜向入口道路通向探索区域。',
          src: townCreatorCaseImagePaths.woodlandRuins,
          alt: '俯视林地遗迹地图：完整神殿周围有环形石路，外围散布废墟与墓碑，旁边有水域和斜向入口道路。',
        },
      ],
    },
  ],
};

export function getTownCreatorCaseStudiesCopy(locale: SiteLocale): TownCreatorCaseStudiesCopy {
  if (locale === 'en') return englishTownCreatorCaseStudies;
  if (locale === 'zh') return chineseTownCreatorCaseStudies;

  throw new Error(`Unsupported town creator case studies locale: ${String(locale)}`);
}
