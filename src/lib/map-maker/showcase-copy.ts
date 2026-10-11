import type { SiteLocale } from '@/lib/site-locale';

const MAP_MAKER_SHOWCASE_IMAGE_ROOT = '/map-maker/examples';
const MAP_MAKER_SHOWCASE_IMAGE_WIDTHS = [640, 1024, 1536] as const;
const MAP_MAKER_SHOWCASE_IMAGE_SIZES =
  '(min-width: 936px) 376px, (min-width: 768px) calc(50vw - 92px), calc(100vw - 104px)';

function getMapMakerShowcaseImageSources(mapSlug: string) {
  const imageName = `${mapSlug}.webp`;

  return {
    src: `${MAP_MAKER_SHOWCASE_IMAGE_ROOT}/${imageName}`,
    carouselSrc: `${MAP_MAKER_SHOWCASE_IMAGE_ROOT}/640/${imageName}`,
    carouselSrcSet: MAP_MAKER_SHOWCASE_IMAGE_WIDTHS.map(
      (width) => `${MAP_MAKER_SHOWCASE_IMAGE_ROOT}/${width}/${imageName} ${width}w`,
    ).join(', '),
    carouselSizes: MAP_MAKER_SHOWCASE_IMAGE_SIZES,
  };
}

export type MapMakerShowcaseCopy = {
  readonly title: string;
  readonly description: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly openImageLabel: string;
  readonly closeImageLabel: string;
  readonly groups: readonly {
    readonly id: 'regional-adventures' | 'coastal-voyages' | 'fantasy-worlds';
    readonly title: string;
    readonly description: string;
    readonly imagePosition: 'left' | 'right';
    readonly cases: readonly {
      readonly name: string;
      readonly designation: string;
      readonly quote: string;
      readonly src: string;
      readonly carouselSrc: string;
      readonly carouselSrcSet: string;
      readonly carouselSizes: string;
      readonly alt: string;
    }[];
  }[];
};

const englishShowcaseCopy: MapMakerShowcaseCopy = {
  title: 'Fantasy map examples',
  description: 'Explore twelve maps made with Map Maker, from local adventure regions to wider fantasy settings.',
  previousLabel: 'Previous map example',
  nextLabel: 'Next map example',
  openImageLabel: 'Open full-size map',
  closeImageLabel: 'Close image preview',
  groups: [
    {
      id: 'regional-adventures',
      title: 'Regional adventures',
      description: 'Starting frontiers, mountain crossings, ancient sites, and desert routes for focused adventures.',
      imagePosition: 'left',
      cases: [
        {
          name: 'Greenvale Frontier',
          designation: 'Campaign starting region',
          quote:
            'A winding river crosses woodland and fields near Greenvale Village and an old watchtower. Use this frontier to frame a campaign’s first journey and nearby ruins.',
          ...getMapMakerShowcaseImageSources('01-greenvale-frontier'),
          alt: 'Irregular mainland coast with a winding river, woodland and fields, a village, and an old tower ruin.',
        },
        {
          name: 'Crownpeak Pass',
          designation: 'Mountain border crossing',
          quote:
            'A broad mountain wall divides the region, leaving a guarded pass between its ridges. Use the crossing to plan a border journey, patrol, or approach to the keeps.',
          ...getMapMakerShowcaseImageSources('03-crownpeak-pass'),
          alt: 'Broad mountain ranges divide the land around an open pass watched by a tower and castle.',
        },
        {
          name: 'Ancient Temple',
          designation: 'Inland exploration site',
          quote:
            'An inland sanctuary brings together mountain slopes, old forest, a village, and scattered ruins. Use the temple, cave, and ruined landmarks to shape an exploration session.',
          ...getMapMakerShowcaseImageSources('05-ancient-temple'),
          alt: 'Inland fantasy terrain with a mountain band, forest, temple, tower, cave, and scattered ruins.',
        },
        {
          name: 'Desert Oasis',
          designation: 'Desert expedition region',
          quote:
            'A rare oasis sits among dry highlands, mesas, ravines, and cactus clusters. Use the pyramid and limited water source to frame a resource-focused journey.',
          ...getMapMakerShowcaseImageSources('06-desert-oasis'),
          alt: 'Dryland region with an oasis, pyramid, mesas, cliff formations, ravines, and cactus clusters.',
        },
      ],
    },
    {
      id: 'coastal-voyages',
      title: 'Coasts and voyages',
      description: 'Natural bays, island routes, wreck-strewn shores, and narrow passages for seafaring adventures.',
      imagePosition: 'right',
      cases: [
        {
          name: 'Twin-Fort Bay',
          designation: 'Coastal stronghold',
          quote:
            'A natural bay opens between two opposing castle headlands, with a small boat in its sheltered water. Use the two forts to set up a coastal approach or a tense meeting across the inlet.',
          ...getMapMakerShowcaseImageSources('04-twin-fort-bay'),
          alt: 'Natural south-opening bay between two castle headlands, with shore settlements and a small boat.',
        },
        {
          name: 'Corsair Isles',
          designation: 'Island-hopping sea route',
          quote:
            'Four unequal islands run diagonally across open water, marked by ridges, groves, a port, and a lighthouse. Use the gaps between islands to plan stops and hazards along a sea route.',
          ...getMapMakerShowcaseImageSources('07-corsair-isles'),
          alt: 'Diagonal chain of four unequal islands with mountain ridges, groves, a port, lighthouse, and ships.',
        },
        {
          name: 'Wreckers’ Coast',
          designation: 'Coastal search and rescue',
          quote:
            'A forested mainland rises above cliffs and near-shore wrecks, with a lighthouse and ruined tower overlooking the coast. Use its landmarks to frame a rescue, investigation, or salvage search.',
          ...getMapMakerShowcaseImageSources('08-wreckers-coast'),
          alt: 'Forested mainland coast with foothills and cliffs, a lighthouse, ruined tower, wrecks, and a rescue ship.',
        },
        {
          name: 'Leviathan Strait',
          designation: 'Dangerous sea crossing',
          quote:
            'Two continental shores narrow around a channel dotted with islets. Use the ships, wreckage, and sea creature to frame a dangerous crossing through the strait.',
          ...getMapMakerShowcaseImageSources('09-leviathan-strait'),
          alt: 'Two continental edges narrow around a strait dotted with islets, ships, wreckage, and a sea creature.',
        },
      ],
    },
    {
      id: 'fantasy-worlds',
      title: 'Fantasy world settings',
      description: 'A sacred island, an island kingdom, an inner sea, and a broad two-continent world overview.',
      imagePosition: 'left',
      cases: [
        {
          name: 'World Tree Sanctuary',
          designation: 'Sacred island setting',
          quote:
            'A forested island gathers around an ancient World Tree, with groves and giant mushrooms across its slopes. Use the clear space around the tree to anchor a nature-focused sanctuary or hidden refuge.',
          ...getMapMakerShowcaseImageSources('02-world-tree-sanctuary'),
          alt: 'Forested island with a central ancient tree, woodland clusters, and giant mushrooms.',
        },
        {
          name: 'Silverbay Kingdom',
          designation: 'Island realm overview',
          quote:
            'An irregular island frames a central mountain spine, with settlements and a lighthouse around its coast. Use the ridge and shoreline to present the kingdom’s geography at a glance.',
          ...getMapMakerShowcaseImageSources('10-silverbay-kingdom'),
          alt: 'Irregular island around a central mountain spine, with coastal settlements, a castle, and a lighthouse.',
        },
        {
          name: 'Sea of Crowns',
          designation: 'Contested inner-sea setting',
          quote:
            'A horseshoe-shaped coast encloses an inner sea and leaves a southern passage to open water. Use the rival settlements and keeps to frame a setting shaped by contested shores.',
          ...getMapMakerShowcaseImageSources('11-sea-of-crowns'),
          alt: 'Open horseshoe-shaped coast around an inner sea, with settlements and forts along the shore.',
        },
        {
          name: 'Two-Continent World',
          designation: 'Large-scale world overview',
          quote:
            'Two separated continents and a few offshore islands establish the broad geography of a new world. Use this sparse overview to introduce a setting before focusing on its regions.',
          ...getMapMakerShowcaseImageSources('12-two-continents'),
          alt: 'Two separated continents with a few offshore islands and sparse terrain landmarks.',
        },
      ],
    },
  ],
};

const chineseShowcaseCopy: MapMakerShowcaseCopy = {
  title: '奇幻地图案例',
  description: '浏览 12 张使用地图制作器制作的地图，从冒险区域到宏观奇幻世界设定。',
  previousLabel: '上一个地图案例',
  nextLabel: '下一个地图案例',
  openImageLabel: '打开地图大图',
  closeImageLabel: '关闭图片预览',
  groups: [
    {
      id: 'regional-adventures',
      title: '区域冒险',
      description: '从边境起点、山地关隘到古代遗迹与荒漠路线，展示适合展开冒险的区域地图。',
      imagePosition: 'left',
      cases: [
        {
          name: '绿谷边境',
          designation: '战役起始区域',
          quote:
            '蜿蜒河道穿过林地与田野，绿谷村和旧哨塔坐落在不远处。可用这片边境安排战役起点、沿河探索与近郊遗迹。',
          ...getMapMakerShowcaseImageSources('01-greenvale-frontier'),
          alt: '轮廓不规则的大陆海岸，内有蜿蜒河道、林地、田野、村庄与旧塔遗迹。',
        },
        {
          name: '群峰关隘',
          designation: '山地边境通道',
          quote:
            '连绵山脉横亘地图，在山脊之间留出由高塔与城堡把守的关口。可用这条通道规划边境旅程、巡逻路线或守堡攻防。',
          ...getMapMakerShowcaseImageSources('03-crownpeak-pass'),
          alt: '群山将陆地分隔，中央留出关口，由高塔与城堡把守。',
        },
        {
          name: '古庙遗迹',
          designation: '内陆探索地点',
          quote:
            '内陆圣地周围分布着山脉、古林、村落与散落遗迹。可围绕古庙、洞穴和废墟地标安排一场探索冒险。',
          ...getMapMakerShowcaseImageSources('05-ancient-temple'),
          alt: '内陆地图呈现山脉、古林、古庙、高塔、洞穴与散落遗迹。',
        },
        {
          name: '荒漠绿洲',
          designation: '荒漠远征区域',
          quote:
            '稀有绿洲坐落在干旱高地之间，四周可见台地、峡谷与仙人掌群落。可用金字塔和有限水源构成补给紧张的旅程。',
          ...getMapMakerShowcaseImageSources('06-desert-oasis'),
          alt: '干旱高地区域包含绿洲、金字塔、台地、悬崖、峡谷与仙人掌群落。',
        },
      ],
    },
    {
      id: 'coastal-voyages',
      title: '海岸与航海',
      description: '从天然海湾、群岛航线到沉船海岸与狭窄海峡，呈现航海冒险的地理环境。',
      imagePosition: 'right',
      cases: [
        {
          name: '双堡海湾',
          designation: '海岸要塞区域',
          quote:
            '天然海湾向南敞开，两座城堡隔着海湾相望，湾内停着一艘小船。可围绕双堡设计海岸登陆路线，或安排一场隔湾会面。',
          ...getMapMakerShowcaseImageSources('04-twin-fort-bay'),
          alt: '向南敞开的天然海湾，两侧岬角建有城堡，沿岸有聚落，水面停着小船。',
        },
        {
          name: '海盗群岛',
          designation: '跳岛航行路线',
          quote:
            '四座大小不一的岛屿沿斜线散布在开阔海面，各有山脊、林地、港口或灯塔。可利用岛屿间的海域规划停靠点与航行风险。',
          ...getMapMakerShowcaseImageSources('07-corsair-isles'),
          alt: '四座大小不一的岛屿斜向排列，岛上有山脊、林地、港口和灯塔，海面分布着船只。',
        },
        {
          name: '沉船海岸',
          designation: '沿岸搜救与调查',
          quote:
            '林地大陆延伸至悬崖海岸，近岸可见沉船，灯塔与废塔俯瞰海面。可围绕海岸地标安排搜救、调查或打捞任务。',
          ...getMapMakerShowcaseImageSources('08-wreckers-coast'),
          alt: '林地大陆延伸至山麓与悬崖海岸，沿岸有灯塔、废塔、沉船和救援船。',
        },
        {
          name: '海怪海峡',
          designation: '危险海上通道',
          quote:
            '两侧大陆向海面收窄，夹出一条散布岛礁的狭长水道。可用船只、沉船与海怪构成危险的穿越航程。',
          ...getMapMakerShowcaseImageSources('09-leviathan-strait'),
          alt: '两侧大陆向狭窄海峡收拢，水道中有岛礁、船只、沉船与海怪。',
        },
      ],
    },
    {
      id: 'fantasy-worlds',
      title: '奇幻世界设定',
      description: '从世界树秘境、岛屿王国到诸王内海与双大陆总览，呈现不同尺度的世界地理。',
      imagePosition: 'left',
      cases: [
        {
          name: '世界树秘境',
          designation: '圣树岛屿设定',
          quote:
            '森林环抱的海岛中央矗立着世界树，周围山坡分布着树丛与巨型菌菇。可用树根周围的开阔地安排自然圣地或隐秘庇护所。',
          ...getMapMakerShowcaseImageSources('02-world-tree-sanctuary'),
          alt: '森林岛中央有一棵古老巨树，林地群落与巨型菌菇散布在周围。',
        },
        {
          name: '银湾王国',
          designation: '岛屿王国总览',
          quote:
            '轮廓不规则的大岛环绕中央山脊，聚落与灯塔分布在沿岸。可借山脊和海岸线一览王国的整体地理。',
          ...getMapMakerShowcaseImageSources('10-silverbay-kingdom'),
          alt: '不规则岛屿环绕中央山脊，分布着沿岸聚落、城堡与灯塔。',
        },
        {
          name: '诸王内海',
          designation: '争夺中的内海世界',
          quote:
            '马蹄形海岸环抱内海，并在南侧留出通往外海的水道。可用沿岸聚落与堡垒构建争夺海岸控制权的世界设定。',
          ...getMapMakerShowcaseImageSources('11-sea-of-crowns'),
          alt: '开口朝南的马蹄形海岸环抱内海，沿岸分布聚落与堡垒。',
        },
        {
          name: '双大陆世界',
          designation: '宏观世界地图总览',
          quote:
            '两块彼此分离的大陆与少量离岛，勾勒出一个新世界的宏观地理。可先用这张疏朗总览介绍世界，再逐步展开各个区域。',
          ...getMapMakerShowcaseImageSources('12-two-continents'),
          alt: '两块彼此分离的大陆与少量近海岛屿，分布着稀疏地形地标。',
        },
      ],
    },
  ],
};

export function getMapMakerShowcaseCopy(locale: SiteLocale): MapMakerShowcaseCopy {
  if (locale === 'en') {
    return englishShowcaseCopy;
  }

  if (locale === 'zh') {
    return chineseShowcaseCopy;
  }

  throw new Error(`Unknown map maker showcase locale: ${JSON.stringify(locale)}.`);
}
