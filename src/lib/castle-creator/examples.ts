import type { SiteLocale } from '@/lib/site-locale';

export type CastleCreatorExampleItem = {
  readonly name: string;
  readonly designation: string;
  readonly quote: string;
  readonly src: string;
  readonly alt: string;
};

export type CastleCreatorExampleGroup = {
  readonly id: string;
  readonly title: string;
  readonly imagePosition: 'left' | 'right';
  readonly items: readonly CastleCreatorExampleItem[];
};

export type CastleCreatorExamplesCopy = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly groups: readonly CastleCreatorExampleGroup[];
};

const ENGLISH_CASTLE_CREATOR_EXAMPLES: CastleCreatorExamplesCopy = {
  eyebrow: 'Castle examples',
  title: 'See What You Can Build',
  description: 'Explore twelve castle compositions for campaigns, stories, and fantasy worldbuilding.',
  previousLabel: 'Previous castle example',
  nextLabel: 'Next castle example',
  groups: [
    {
      id: 'defense-adventure',
      title: 'Defense & Adventure',
      imagePosition: 'left',
      items: [
        {
          name: 'Adventurer Outpost',
          designation: 'Party base / supply stop',
          quote: 'A compact square keep inside a low enclosed wall, suited to an adventuring party headquarters, supply stop, or frontier foothold.',
          src: '/castle-creator/examples/adventurer-outpost.webp',
          alt: 'A compact square keep inside a low enclosed wall.',
        },
        {
          name: 'Border Watch Bastion',
          designation: 'Border patrol / road guard',
          quote: 'A prominent high watchtower joined to a low horizontal defense line and a small gatehouse for patrols, warning, and road control.',
          src: '/castle-creator/examples/border-watch-bastion.webp',
          alt: 'A prominent high watchtower joined to a low horizontal defense line and a small gatehouse.',
        },
        {
          name: 'Twin Tower Gate Pass',
          designation: 'Mountain pass / city gate',
          quote: 'Two stout high towers flank a large central gatehouse, forming a clear gate-pass silhouette for a mountain route, road, or main city entrance.',
          src: '/castle-creator/examples/twin-tower-gate-pass.webp',
          alt: 'Two stout high towers flank a large central gatehouse.',
        },
        {
          name: 'Knight Order Fortress',
          designation: 'Knight order outpost / frontier defense',
          quote: 'A low, heavy fortress with continuous walls, a strong central keep, and two guard towers for a knight order outpost or frontier defense.',
          src: '/castle-creator/examples/knight-order-fortress.webp',
          alt: 'A low, heavy fortress with continuous walls, a strong central keep, and two guard towers.',
        },
      ],
    },
    {
      id: 'royal-stories',
      title: 'Royal Stories',
      imagePosition: 'right',
      items: [
        {
          name: 'Royal Main Keep',
          designation: 'Capital centerpiece / noble domain',
          quote: 'A royal centerpiece built around a large layered keep and four symmetrical guard towers for a capital city or noble domain landmark.',
          src: '/castle-creator/examples/royal-main-keep.webp',
          alt: 'A large layered keep with four symmetrical guard towers.',
        },
        {
          name: 'Fairy Tale Castle',
          designation: 'Princess castle / magical kingdom',
          quote: 'A light-stone kingdom of slender towers and dense blue roofs, shaped for a princess castle or magical fairy-tale realm.',
          src: '/castle-creator/examples/fairy-tale-castle.webp',
          alt: 'A light-stone castle with slender towers and dense blue roofs.',
        },
        {
          name: 'Gothic Black Castle',
          designation: 'Horror lair / cursed lord',
          quote: 'A lair for villains, vampires, and cursed lords in a horror campaign or novel.',
          src: '/castle-creator/examples/gothic-black-castle.webp',
          alt: 'A tall offset black keep with narrow pointed towers and low walls.',
        },
        {
          name: 'Noble Manor',
          designation: 'City intrigue / faction meeting',
          quote: 'A setting for city intrigue, family politics, heists, or faction meetings.',
          src: '/castle-creator/examples/noble-manor.webp',
          alt: 'A central entrance hall between two low side buildings with broad roofs.',
        },
      ],
    },
    {
      id: 'magic-ruins',
      title: 'Magic & Ruins',
      imagePosition: 'left',
      items: [
        {
          name: 'Mage High Tower',
          designation: 'Mage residence / distant landmark',
          quote: 'A distant landmark and residence for a mage, sorcerer, or occult scholar.',
          src: '/castle-creator/examples/mage-high-tower.webp',
          alt: 'A tall green pointed tower between two low annexes.',
        },
        {
          name: 'Arcane Academy',
          designation: 'Mage college / guild stronghold',
          quote: 'An arcane academy of interconnected halls, scholarly towers, and continuous stone walls for mage colleges, guilds, and fantasy campus scenes.',
          src: '/castle-creator/examples/arcane-academy.webp',
          alt: 'An arcane academy with connected halls, scholarly towers, and continuous stone walls.',
        },
        {
          name: 'Monastery Fortress',
          designation: 'Religious order / ancient sanctuary',
          quote: 'A monastery fortress with a central hall, two low wings, and a single bell tower for religious orders, paladins, and ancient sanctuaries.',
          src: '/castle-creator/examples/monastery-fortress.webp',
          alt: 'A monastery fortress with a central hall, low wings, and a single bell tower.',
        },
        {
          name: 'Lost Castle',
          designation: 'Ruins exploration / mystery adventure',
          quote: 'A lost castle formed by one tall remnant tower, broken wall runs, and an open abandoned yard for ruins, exploration, and mystery adventures.',
          src: '/castle-creator/examples/lost-castle.webp',
          alt: 'A lost castle with a tall remnant tower, broken walls, and an open abandoned yard.',
        },
      ],
    },
  ],
};

const CHINESE_CASTLE_CREATOR_EXAMPLES: CastleCreatorExamplesCopy = {
  eyebrow: '城堡案例',
  title: '看看你可以搭建什么',
  description: '浏览 12 个适合战役、小说和奇幻世界观的城堡立面案例。',
  previousLabel: '上一个城堡案例',
  nextLabel: '下一个城堡案例',
  groups: [
    {
      id: 'defense-adventure',
      title: '防御与冒险',
      imagePosition: 'left',
      items: [
        {
          name: '冒险者据点',
          designation: '队伍驻地 / 补给站',
          quote: '以一座紧凑方形主堡和低矮围墙组成小型冒险者据点，适合作为队伍驻地、补给站或边境落脚点。',
          src: '/castle-creator/examples/adventurer-outpost.webp',
          alt: '紧凑方形主堡被低矮围墙围合的城堡立面。',
        },
        {
          name: '边境瞭望堡',
          designation: '边境巡逻 / 商路守卫',
          quote: '以一座显著高塔连接横向矮防线和小型门楼，适合边境巡逻、预警和商路守卫。',
          src: '/castle-creator/examples/border-watch-bastion.webp',
          alt: '显著高塔连接横向矮防线和小型门楼的城堡立面。',
        },
        {
          name: '双塔关隘',
          designation: '山口关隘 / 城防入口',
          quote: '以两座厚实高塔夹住中央大型门楼，形成明确的双塔关隘轮廓，适合山口、要道或城防主入口。',
          src: '/castle-creator/examples/twin-tower-gate-pass.webp',
          alt: '两座厚实高塔夹住中央大型门楼的双塔关隘立面。',
        },
        {
          name: '骑士团要塞',
          designation: '骑士团驻地 / 边境防线',
          quote: '以连续城墙、厚重主楼和两座守塔组成低重心军堡，适合骑士团驻地与边境防线。',
          src: '/castle-creator/examples/knight-order-fortress.webp',
          alt: '连续城墙、厚重主楼和两座守塔组成的低重心军堡。',
        },
      ],
    },
    {
      id: 'royal-stories',
      title: '王室故事',
      imagePosition: 'right',
      items: [
        {
          name: '王室主堡',
          designation: '王都核心 / 贵族领地',
          quote: '以中央多层主堡和四座对称守塔构成王权风格主城，适合作为王都核心或贵族领地地标。',
          src: '/castle-creator/examples/royal-main-keep.webp',
          alt: '中央多层主堡与四座对称守塔组成的王室主堡。',
        },
        {
          name: '童话王城',
          designation: '公主城堡 / 魔法王国',
          quote: '以浅色石墙、细尖塔和密集蓝色屋顶塑造高耸童话轮廓，适合公主城堡与魔法王国设定。',
          src: '/castle-creator/examples/fairy-tale-castle.webp',
          alt: '浅色石墙、细尖塔和密集蓝色屋顶组成的童话王城。',
        },
        {
          name: '哥特黑堡',
          designation: '恐怖巢穴 / 诅咒领主',
          quote: '恐怖战役或小说中反派、吸血鬼和诅咒领主的巢穴。',
          src: '/castle-creator/examples/gothic-black-castle.webp',
          alt: '偏置高瘦黑堡、窄尖塔和低矮城墙组成的哥特城堡立面。',
        },
        {
          name: '贵族庄园',
          designation: '城市阴谋 / 派系会面',
          quote: '城市阴谋、家族政治、盗窃任务或派系会面的场所。',
          src: '/castle-creator/examples/noble-manor.webp',
          alt: '中央门厅连接两座低矮侧楼的贵族庄园立面。',
        },
      ],
    },
    {
      id: 'magic-ruins',
      title: '魔法遗迹',
      imagePosition: 'left',
      items: [
        {
          name: '法师高塔',
          designation: '法师居所 / 远距离地标',
          quote: '小说或游戏中的法师、术士或神秘学者的个人居所和远距离地标。',
          src: '/castle-creator/examples/mage-high-tower.webp',
          alt: '绿色尖顶高塔与两座低矮附楼组成的法师高塔。',
        },
        {
          name: '秘法学院',
          designation: '魔法学院 / 公会据点',
          quote: '由十余栋互连建筑、学术塔楼和连续石墙组成的魔法学院，适合学院派法师、公会与奇幻校园场景。',
          src: '/castle-creator/examples/arcane-academy.webp',
          alt: '互连建筑、学术塔楼和连续石墙组成的秘法学院立面。',
        },
        {
          name: '修道院堡',
          designation: '宗教组织 / 古老避难所',
          quote: '中央礼堂、两侧低长翼楼和一座钟楼组成的修道院堡，适合宗教组织、圣骑士团与古老避难所。',
          src: '/castle-creator/examples/monastery-fortress.webp',
          alt: '中央礼堂、低长翼楼和单座钟楼组成的修道院堡。',
        },
        {
          name: '失落古堡',
          designation: '遗迹探索 / 悬疑冒险',
          quote: '一座高残留塔、断续城墙和空置庭地组成的失落古堡，适合废弃领地、遗迹探索与悬疑冒险。',
          src: '/castle-creator/examples/lost-castle.webp',
          alt: '高残留塔、断续城墙和空置庭地组成的失落古堡。',
        },
      ],
    },
  ],
};

export function getCastleCreatorExamples(locale: SiteLocale): CastleCreatorExamplesCopy {
  if (locale === 'en') {
    return ENGLISH_CASTLE_CREATOR_EXAMPLES;
  }

  if (locale === 'zh') {
    return CHINESE_CASTLE_CREATOR_EXAMPLES;
  }

  throw new Error(`Unsupported castle creator examples locale: ${JSON.stringify(locale)}`);
}
