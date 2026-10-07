import type { CircularTestimonial } from '@/components/armor-creator/circular-testimonials';
import type { SiteLocale } from '@/lib/site-locale';

export type CoatMakerShowcaseGroupId = 'characters' | 'guilds' | 'regions';

export interface CoatMakerShowcaseGroup {
  readonly id: CoatMakerShowcaseGroupId;
  readonly title: string;
  readonly description: string;
  readonly examples: readonly CircularTestimonial[];
}

export interface CoatMakerShowcaseCopy {
  readonly heading: string;
  readonly description: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly groups: readonly CoatMakerShowcaseGroup[];
}

const coatMakerShowcaseImageSources = {
  azureWings: '/coat-assets/showcase/azure-wings.webp',
  ashwingExiles: '/coat-assets/showcase/ashwing-exiles.webp',
  moonshadowHunters: '/coat-assets/showcase/moonshadow-hunters.webp',
  rosewayMerchantHouse: '/coat-assets/showcase/roseway-merchant-house.webp',
  astralAcademy: '/coat-assets/showcase/astral-academy.webp',
  threeLanternExpedition: '/coat-assets/showcase/three-lantern-expedition.webp',
  greyforgeGuild: '/coat-assets/showcase/greyforge-guild.webp',
  laurelReadingSociety: '/coat-assets/showcase/laurel-reading-society.webp',
  tidegateFreeCity: '/coat-assets/showcase/tidegate-free-city.webp',
  northwatchFrontier: '/coat-assets/showcase/northwatch-frontier.webp',
  whisperwoodDomain: '/coat-assets/showcase/whisperwood-domain.webp',
  dragonspineMarch: '/coat-assets/showcase/dragonspine-march.webp',
} as const;

const englishCoatMakerShowcaseCopy: CoatMakerShowcaseCopy = {
  heading: 'Coat of arms examples',
  description:
    'Explore twelve coat of arms concepts for characters, guilds, and places in a fantasy world. Each example pairs a shield shape, field colors, and a clear emblem with a practical role in its story.',
  previousLabel: 'Previous coat of arms example',
  nextLabel: 'Next coat of arms example',
  groups: [
    {
      id: 'characters',
      title: 'Characters and families',
      description:
        'Use a personal or family mark to identify a character, household, or traveling party.',
      examples: [
        {
          name: 'House of Azure Wings',
          designation: 'Highland route family crest',
          quote:
            'This house guards the mountain routes and treats every safe arrival as a point of honor.',
          src: coatMakerShowcaseImageSources.azureWings,
          alt: 'Blue shield with a gold border and a brown-and-gold griffin spreading its wings.',
        },
        {
          name: 'Ashwing Exiles',
          designation: 'Exiled party emblem',
          quote:
            'After their old city burned, the exiles travel together while searching for scattered kin.',
          src: coatMakerShowcaseImageSources.ashwingExiles,
          alt: 'Burgundy shield with a gold border, a red-and-gold phoenix rising above flames, and dark diagonal field accents.',
        },
        {
          name: 'Moonshadow Hunters',
          designation: 'Wilderness tracker mark',
          quote:
            'These hunters follow wild beasts when the moon is at its weakest, turning a night watch into a clear mark of purpose.',
          src: coatMakerShowcaseImageSources.moonshadowHunters,
          alt: 'Dark navy and pale gray split shield with a brown-and-gold wolf, a sun-and-moon symbol, and a silver edge.',
        },
        {
          name: 'Roseway Merchant House',
          designation: 'Merchant house seal',
          quote:
            'A family seal closes each cargo chest and lets trusted companions recognize the caravan on the road.',
          src: coatMakerShowcaseImageSources.rosewayMerchantHouse,
          alt: 'Burgundy diamond shield with a pale gold border, a red-and-white rose with green leaves, and a seal above it.',
        },
      ],
    },
    {
      id: 'guilds',
      title: 'Guilds and societies',
      description:
        'Give an academy, expedition, guild, or reading society a shared badge for banners, tools, and event materials.',
      examples: [
        {
          name: 'Astral Chart Arcane Academy',
          designation: 'Arcane academy badge',
          quote:
            "Apprentices map the night sky from observation records, carrying the academy's mark on their study tools.",
          src: coatMakerShowcaseImageSources.astralAcademy,
          alt: 'Purple shield with a gold border and a large gold astrolabe with star details at the center.',
        },
        {
          name: 'Three Lantern Expedition',
          designation: 'Expedition banner',
          quote:
            'Three lanterns stand for direction, companions, and the road home on every expedition.',
          src: coatMakerShowcaseImageSources.threeLanternExpedition,
          alt: 'Blue and ivory split banner shield with three gray lanterns lit by orange flames.',
        },
        {
          name: "Greyforge Artificers' Guild",
          designation: "Artificers' guild mark",
          quote:
            'At the foot of an old volcano, the guild repairs devices whose craft was nearly lost.',
          src: coatMakerShowcaseImageSources.greyforgeGuild,
          alt: 'Beige brick-patterned shield with a crenellated top, a black forge brazier, and red-and-yellow flames.',
        },
        {
          name: 'Laurel Reading Society',
          designation: 'Reading society badge',
          quote:
            "Members exchange sailing logs in a harbor library, carrying the society's quiet mark between tables.",
          src: coatMakerShowcaseImageSources.laurelReadingSociety,
          alt: 'Cream and green divided shield with an open red-trimmed book and a green laurel branch.',
        },
      ],
    },
    {
      id: 'regions',
      title: 'Regions and places',
      description:
        'Map a free city, frontier, woodland domain, or mountain march with a landmark that works on maps and seals.',
      examples: [
        {
          name: 'Tidegate Free City',
          designation: 'Free-port landmark',
          quote:
            'A free port sits where two tidal routes meet, and its mark belongs on maps and gate seals.',
          src: coatMakerShowcaseImageSources.tidegateFreeCity,
          alt: 'Teal and light gray round shield with a brown sailing ship beneath a pale sail.',
        },
        {
          name: 'Northwatch Frontier',
          designation: 'Frontier garrison marker',
          quote:
            'Beacon towers hold the pass between the frozen frontier and the inland roads.',
          src: coatMakerShowcaseImageSources.northwatchFrontier,
          alt: 'Pale blue brick-patterned shield with a central stone castle and dark blue edging.',
        },
        {
          name: 'Whisperwood Domain',
          designation: 'Woodland route marker',
          quote:
            "Settlements follow marked root roads through the woods, where the domain's sign doubles as a route marker.",
          src: coatMakerShowcaseImageSources.whisperwoodDomain,
          alt: 'Dark green shield with lighter green round field marks and a tan stag with large antlers.',
        },
        {
          name: 'Dragonspine March',
          designation: 'Mountain border map mark',
          quote:
            'Mines and watch posts trace the ridge line, giving the border county a clear mark on adventure maps.',
          src: coatMakerShowcaseImageSources.dragonspineMarch,
          alt: 'Charcoal shield with broad cream diagonal bands and a red dragon with golden wings.',
        },
      ],
    },
  ],
};

const chineseCoatMakerShowcaseCopy: CoatMakerShowcaseCopy = {
  heading: '纹章案例展示',
  description:
    '浏览十二个纹章案例，看看角色家族、公会社团和世界地图中的地点如何用盾形、底色与图形建立识别。',
  previousLabel: '上一个纹章案例',
  nextLabel: '下一个纹章案例',
  groups: [
    {
      id: 'characters',
      title: '角色与家族',
      description: '用个人或家族标记识别角色、家族与同行队伍。',
      examples: [
        {
          name: '苍翼家族',
          designation: '高地航路家族纹章',
          quote: '这个家族守护高地航路，把每一次平安抵达都视为荣誉。',
          src: coatMakerShowcaseImageSources.azureWings,
          alt: '深蓝色盾牌配金色边框，中央是一只展开双翼的棕金色狮鹫。',
        },
        {
          name: '烬羽流亡者',
          designation: '流亡队伍识别徽记',
          quote: '旧城焚毁后，流亡者结伴上路，寻找失散的亲族。',
          src: coatMakerShowcaseImageSources.ashwingExiles,
          alt: '酒红色盾牌配金色边框，中央是从火焰中升起的红金色凤凰，背景带深色斜向分区。',
        },
        {
          name: '月影猎手',
          designation: '荒野猎手任务徽记',
          quote: '猎手在月色最弱时追踪荒野异兽，让夜间巡猎拥有清晰的识别标记。',
          src: coatMakerShowcaseImageSources.moonshadowHunters,
          alt: '深午夜蓝与浅灰色分区盾牌中央有棕金色狼形兽，顶部是日月图案，边缘为银色。',
        },
        {
          name: '蔷薇商旅家族',
          designation: '商旅家族印记',
          quote: '家族印记封存每个货箱，也让旅途中值得信任的同伴认出商队。',
          src: coatMakerShowcaseImageSources.rosewayMerchantHouse,
          alt: '酒红色菱形盾牌配浅金色边框，中央是红白蔷薇与绿叶，上方有一枚印章。',
        },
      ],
    },
    {
      id: 'guilds',
      title: '公会与社团',
      description: '为学院、远征队、公会或读书社制作可用于旗帜、工具和活动物料的共同徽记。',
      examples: [
        {
          name: '星盘秘法学院',
          designation: '秘法学院徽章',
          quote: '学徒根据观测记录绘制夜空地图，把学院标记带在学习用品上。',
          src: coatMakerShowcaseImageSources.astralAcademy,
          alt: '紫色盾牌配金色边框，中央是带有星点细节的大型金色星盘。',
        },
        {
          name: '三灯远征队',
          designation: '远征队旗帜',
          quote: '三盏灯分别象征方向、同伴与返程，伴随每次远征出发。',
          src: coatMakerShowcaseImageSources.threeLanternExpedition,
          alt: '蓝色与象牙色分区的旗形盾牌上并列三盏灰色灯笼，灯内燃着橙色火焰。',
        },
        {
          name: '灰炉工匠会',
          designation: '工匠会标志',
          quote: '工匠在旧火山脚下修复几乎失传的器械工艺。',
          src: coatMakerShowcaseImageSources.greyforgeGuild,
          alt: '米色砖纹盾牌顶部带垛口，中央是黑色锻炉盆和红黄色火焰。',
        },
        {
          name: '月桂读书社',
          designation: '读书社徽章',
          quote: '成员在港口旧图书馆交换航海日志，让社团标记在书页之间流转。',
          src: coatMakerShowcaseImageSources.laurelReadingSociety,
          alt: '奶油色与绿色分区盾牌中央有一本红边展开的书，顶部是一枝绿色月桂。',
        },
      ],
    },
    {
      id: 'regions',
      title: '地区与地点',
      description: '为自由城、边塞、林地领地或山地边郡制作适合地图和印章的地标标记。',
      examples: [
        {
          name: '潮门自由城',
          designation: '自由港地标',
          quote: '自由城坐落在两条潮汐航道交汇处，纹章可用于地图地标和城门印章。',
          src: coatMakerShowcaseImageSources.tidegateFreeCity,
          alt: '青绿色与浅灰色分区的圆形盾牌中有一艘棕色帆船，船上扬起浅色船帆。',
        },
        {
          name: '北境边塞',
          designation: '边境驻军标记',
          quote: '烽火塔守住冻原通往内陆的山口，纹章用于边境地图和驻军标记。',
          src: coatMakerShowcaseImageSources.northwatchFrontier,
          alt: '浅蓝色砖纹盾牌中央是一座石砌城堡，边缘为深蓝色。',
        },
        {
          name: '森语领地',
          designation: '林地路线标记',
          quote: '聚落沿标记树根道路穿行林地，领地标记也承担路线指引。',
          src: coatMakerShowcaseImageSources.whisperwoodDomain,
          alt: '深绿色盾牌上分布浅绿色圆形底纹，中央是一只长着宽大鹿角的棕色雄鹿。',
        },
        {
          name: '龙脊边郡',
          designation: '山地边界地图标记',
          quote: '矿道和哨站连成山脊边线，让这个边郡在冒险地图上清晰可辨。',
          src: coatMakerShowcaseImageSources.dragonspineMarch,
          alt: '炭黑色盾牌带宽大的米色斜向条带，中央是一条展开金色翅膜的红龙。',
        },
      ],
    },
  ],
};

const coatMakerShowcaseCopyByLocale: Record<SiteLocale, CoatMakerShowcaseCopy> = {
  en: englishCoatMakerShowcaseCopy,
  zh: chineseCoatMakerShowcaseCopy,
};

function assertCoatMakerShowcaseLocale(locale: SiteLocale): void {
  if (!Object.hasOwn(coatMakerShowcaseCopyByLocale, locale)) {
    throw new Error(`Unsupported Coat Maker showcase locale: ${JSON.stringify(locale)}`);
  }
}

export function getCoatMakerShowcaseCopy(locale: SiteLocale): CoatMakerShowcaseCopy {
  assertCoatMakerShowcaseLocale(locale);
  return coatMakerShowcaseCopyByLocale[locale];
}
