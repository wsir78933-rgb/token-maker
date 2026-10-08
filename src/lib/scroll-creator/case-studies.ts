import type { CircularTestimonial } from '@/components/armor-creator/circular-testimonials';

import type { ScrollLocale } from './types';

export type ScrollCreatorCaseStudyGroupCopy = {
  readonly id: string;
  readonly carouselLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly imagePosition: 'left' | 'right';
  readonly examples: readonly CircularTestimonial[];
};

export type ScrollCreatorCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly viewImageLabel: string;
  readonly closeImageLabel: string;
  readonly groups: readonly ScrollCreatorCaseStudyGroupCopy[];
};

const SCROLL_CREATOR_CASE_IMAGE_PATHS = [
  '/scroll-creator/examples/01-task-commission.png',
  '/scroll-creator/examples/02-wanted-poster.png',
  '/scroll-creator/examples/03-villager-plea.png',
  '/scroll-creator/examples/04-feast-invitation.png',
  '/scroll-creator/examples/05-intercepted-order.png',
  '/scroll-creator/examples/06-ancient-prophecy.png',
  '/scroll-creator/examples/07-letter-home.png',
  '/scroll-creator/examples/08-captains-log.png',
  '/scroll-creator/examples/09-magic-contract.png',
  '/scroll-creator/examples/10-royal-pass.png',
  '/scroll-creator/examples/11-research-notes.png',
  '/scroll-creator/examples/12-last-will.png',
] as const;

const englishCaseStudies: ScrollCreatorCaseStudiesCopy = {
  title: 'Parchment scroll examples',
  description:
    'Explore 12 original parchment documents for D&D and TTRPG game masters and players, fantasy authors, and worldbuilders—from quest handouts and character letters to contracts, research notes, and inheritance records.',
  viewImageLabel: 'View full example',
  closeImageLabel: 'Close full example',
  groups: [
    {
      id: 'adventures',
      carouselLabel: 'GM adventure handout examples',
      previousLabel: 'Previous adventure handout',
      nextLabel: 'Next adventure handout',
      imagePosition: 'left',
      examples: [
        {
          name: 'Greyford Road Commission',
          designation: 'GM handout · adventure hook',
          quote:
            'Prepare a commission in Parchment Scroll Creator for the party: missing wagons, a sealed medicine chest, and the force blocking the road. The market-day deadline and extra payment make the opening objective easy to hand to players.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[0],
          alt: 'A brown parchment letter titled A Commission for the Greyford Road, requesting the recovery of missing wagons and a sealed medicine chest.',
        },
        {
          name: 'The Ash Fox',
          designation: 'GM handout · pursuit notice',
          quote:
            'Use Parchment Scroll Creator to put a named fugitive, identifying clues, reward terms, and a marsh warning in one handout. It gives a pursuit scene a target without deciding how the party will approach it.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[1],
          alt: 'A centered brown parchment wanted notice for Edra Morn, called the Ash Fox, with a silver knife and scarred bay mare as identifying clues.',
        },
        {
          name: 'Willowmere Plea',
          designation: 'GM handout · village crisis',
          quote:
            'A Willowmere plea made in Parchment Scroll Creator can use the black river, iron-tasting wells, vanished villagers, and a bell inside the locked millhouse to open a local mystery. The plea also gives the party a deadline and a practical offer of food and shelter.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[2],
          alt: 'A brown parchment plea from Willowmere describing a black river, missing villagers, and a bell ringing inside a locked millhouse.',
        },
        {
          name: 'Moonlit Feast Invitation',
          designation: 'GM handout · social encounter',
          quote:
            'Lay out this invitation in Parchment Scroll Creator for a masked gathering where swords are refused and every guest brings a secret to trade. The carriage, private audience, and final-bell timing give a social scene a clear invitation and arrival cue.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[3],
          alt: 'A centered parchment invitation to a moonlit feast at Blackthorn Hall, with masks welcome, swords forbidden, and a secret requested from each guest.',
        },
      ],
    },
    {
      id: 'stories',
      carouselLabel: 'Character letters and story clue examples',
      previousLabel: 'Previous story document',
      nextLabel: 'Next story document',
      imagePosition: 'right',
      examples: [
        {
          name: 'Black Salt Order',
          designation: 'GM handout · intercepted clue',
          quote:
            'This intercepted order, laid out in Parchment Scroll Creator, lets players piece together a covert shipment, false patrol lights, and a plan to bring down the bell tower. Its instruction to burn the order makes the handout itself part of the discovered evidence.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[4],
          alt: "A dark-text parchment order addressed to Warden Kest, directing a black-salt shipment and a deception at Bellhaven's south culvert.",
        },
        {
          name: 'The Star Beneath the Stone',
          designation: 'GM / fantasy author · prophecy',
          quote:
            'Set this prophecy in Parchment Scroll Creator with the uphill river, buried star, borrowed name, crowned hand, and three answering bells as layered story clues. The final instruction ties the prophecy to a specific moment without explaining the choice for the reader.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[5],
          alt: 'A centered italic parchment prophecy about a buried star, a sealed road, three bells, and a moon with no face.',
        },
        {
          name: 'A Letter Home',
          designation: 'Player / fantasy author · character letter',
          quote:
            'Write an adventurer’s letter in Parchment Scroll Creator, connecting a family debt, a crest found on a smuggler’s crate, and a blue ribbon tied to a mother’s trust. It turns personal history into a reason to follow the trail east.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[6],
          alt: 'An italic brown parchment letter to Elian that mentions a family debt, a smuggler’s crate, and a blue ribbon.',
        },
        {
          name: 'Captain’s Log',
          designation: 'GM / player / fantasy author · investigation log',
          quote:
            'Lay out a captain’s log in Parchment Scroll Creator with a compass that pulls east, a warm silver shoe, a lighthouse seal, and a second light from an abandoned tower. The record leaves physical clues that can redirect a crew or an investigating party.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[7],
          alt: 'A brown parchment captain’s log recording a compass anomaly, a warm silver shoe, a lighthouse seal, and an answering light.',
        },
      ],
    },
    {
      id: 'worldbuilding',
      carouselLabel: 'Worldbuilding document examples',
      previousLabel: 'Previous worldbuilding document',
      nextLabel: 'Next worldbuilding document',
      imagePosition: 'left',
      examples: [
        {
          name: 'Pact of the Ember Veil',
          designation: 'GM / player / fantasy author · magical contract',
          quote:
            'Draft the pact in Parchment Scroll Creator, recording the passage exchanged for a stolen moonstone, the gatekeeper’s silence, and the ember mark that follows a broken clause. Named parties and an heir-bound debt make the pact a concrete source of pressure.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[8],
          alt: 'A brown parchment magical contract for passage through the Glass Marsh and delivery of a moonstone, signed by Serin Ash and Veyra of the Seventh Bell.',
        },
        {
          name: 'Royal Pass of the Eastern March',
          designation: 'GM / worldbuilder · authority document',
          quote:
            'Use Parchment Scroll Creator to show how the crown grants travel across roads, ferries, and gates while reserving military spaces and sealed cargo. The thirty-day term and fresh-horse privilege add everyday detail to the region’s administration.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[9],
          alt: 'A centered brown parchment royal pass granting travel across the Eastern March, with a thirty-day term and listed restrictions.',
        },
        {
          name: 'Field Notes on the Glass Marsh Lantern',
          designation: 'GM / worldbuilder · research notes',
          quote:
            'Build the research notes in Parchment Scroll Creator around a blue flame’s response to running water and iron. The submerged channel and drowned shrine risk give exploration a finding and a consequence.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[10],
          alt: 'A brown parchment research record about a blue flame above the Glass Marsh, including observations and a drowned-shrine risk.',
        },
        {
          name: 'Last Will of Orin Vale',
          designation: 'GM / fantasy author · inheritance document',
          quote:
            'Prepare a will in Parchment Scroll Creator that assigns a house, a silver astrolabe, and a red-bound grimoire under different conditions, then names witnesses. The inheritance rules can introduce a family dispute or a new obligation for the story.',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[11],
          alt: 'A brown parchment last will assigning a house, a silver astrolabe, and a red-bound grimoire, with witnesses named.',
        },
      ],
    },
  ],
};

const chineseCaseStudies: ScrollCreatorCaseStudiesCopy = {
  title: '羊皮纸卷轴案例',
  description:
    '下面 12 个原创文书案例面向 D&D 和 TRPG 的 GM、玩家、奇幻小说作者与世界观创作者，覆盖任务道具、角色书信、契约、研究手记和继承文书等场景。',
  viewImageLabel: '查看完整案例',
  closeImageLabel: '关闭完整案例',
  groups: [
    {
      id: 'adventures',
      carouselLabel: 'GM 冒险道具案例轮播',
      previousLabel: '上一个冒险道具案例',
      nextLabel: '下一个冒险道具案例',
      imagePosition: 'left',
      examples: [
        {
          name: '任务委托',
          designation: 'GM / 跑团主持人 · 冒险开场',
          quote:
            '用羊皮纸卷轴制作器制作这份任务委托，把失踪的补给车、封存药箱、道路阻断者和集市日期限，变成跑团开场的清晰目标。额外赏金还能把找回药箱和查出危险来源连成一条线。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[0],
          alt: '棕色羊皮纸任务委托，正文要求找回失踪车队、封存药箱和活着的证人。',
        },
        {
          name: '灰狐悬赏通缉',
          designation: 'GM / 跑团主持人 · 追捕告示',
          quote:
            '把通缉对象、银刀上的三颗黑齿、伤痕累累的栗色母马和悬赏条件放进羊皮纸卷轴制作器，再集中呈现在同一张告示里。它既能交代追捕目标，也把是否进入沼泽、如何追捕的选择留给玩家。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[1],
          alt: '居中的棕色羊皮纸悬赏告示，介绍被称为灰狐的 Edra Morn、银刀线索和伤痕栗色母马。',
        },
        {
          name: 'Willowmere 求救信',
          designation: 'GM / 跑团主持人 · 村庄危机',
          quote:
            '在羊皮纸卷轴制作器中排版这封求救信，让黑色河水、带铁味的井水、失踪村民和锁住磨坊里传来的童铃，共同组成 Willowmere 的求救线索。第三次日落前的期限，让玩家马上面对救援还是调查的选择。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[2],
          alt: '棕色羊皮纸求救信，写着 Willowmere 的黑色河水、失踪村民和锁住磨坊里的童铃。',
        },
        {
          name: '月下宴会邀请函',
          designation: 'GM / 跑团主持人 · 社交剧情',
          quote:
            '在羊皮纸卷轴制作器里排版这封邀请，让面具可戴、长剑不许入场，每位来客还要带来一个值得交换的秘密。马车、晚宴和最后一声钟后的私人会面，为社交调查准备了明确入口。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[3],
          alt: '居中的棕色羊皮纸宴会邀请函，说明面具可戴、长剑禁入，并要求每位客人带来一个秘密。',
        },
      ],
    },
    {
      id: 'stories',
      carouselLabel: '角色书信与剧情线索案例轮播',
      previousLabel: '上一个故事文书案例',
      nextLabel: '下一个故事文书案例',
      imagePosition: 'right',
      examples: [
        {
          name: '黑盐密令',
          designation: 'GM / 跑团主持人 · 截获线索',
          quote:
            '把黑盐、伪装成巡逻的灯火和倒下的钟楼写入羊皮纸卷轴制作器，构成一条可以被玩家逐步拼出的阴谋线索。阅后焚毁的要求，也让这张密令成为需要保护的证据。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[4],
          alt: '棕色羊皮纸密令，指示 Warden Kest 搬运黑盐，用灯火让同伙误认为是巡逻，并让钟楼倒塌。',
        },
        {
          name: '石下之星预言',
          designation: 'GM / 奇幻作者 · 预言伏笔',
          quote:
            '用羊皮纸卷轴制作器排版这份预言，把河水倒流、埋藏的星辰、借来的名字和三声回应的钟，串成一组可逐步揭开的线索。它保留选择的悬念，同时给作者一个明确的触发时刻。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[5],
          alt: '居中斜体羊皮纸预言，提到河水倒流、石下星辰、封闭道路和三声钟响。',
        },
        {
          name: '冒险者家书',
          designation: '玩家 / 奇幻作者 · 角色书信',
          quote:
            '使用羊皮纸卷轴制作器制作这封角色家书，把家族债务、走私者木箱上的家徽，以及象征母亲信任的蓝丝带连成一条个人线索。它适合补上角色动机，也能留下继续东行的理由。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[6],
          alt: '斜体棕色羊皮纸家书，写给 Elian，提到家族债务、走私者木箱和蓝丝带。',
        },
        {
          name: '航海日志',
          designation: 'GM / 玩家 / 奇幻作者 · 调查日志',
          quote:
            '把航海记录放进羊皮纸卷轴制作器，写下指南针偏向东方、温热的银鞋、Greyford 灯塔印记和废弃高塔的回应灯。日志既能记录船上异象，也能把调查方向交给玩家。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[7],
          alt: '棕色羊皮纸航海日志，记录偏转的指南针、温热的银鞋、Greyford 灯塔印记和废弃高塔的灯光。',
        },
      ],
    },
    {
      id: 'worldbuilding',
      carouselLabel: '世界观文书案例轮播',
      previousLabel: '上一个世界观文书案例',
      nextLabel: '下一个世界观文书案例',
      imagePosition: 'left',
      examples: [
        {
          name: '余烬帷幕契约',
          designation: 'GM / 玩家 / 奇幻作者 · 魔法契约',
          quote:
            '在羊皮纸卷轴制作器中制作这份契约，写明穿越 Glass Marsh 与交付月长石的交换条件、北门开启者的沉默，以及违约后燃烧的烙印。双方签名和继承人的债务，让魔法交易拥有具体的代价。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[8],
          alt: '棕色羊皮纸魔法契约，约定穿越 Glass Marsh、交付月长石，并由 Serin Ash 与 Veyra of the Seventh Bell 签署。',
        },
        {
          name: '东境王室通行令',
          designation: 'GM / 世界观创作者 · 权限文书',
          quote:
            '用羊皮纸卷轴制作器呈现王室如何授予道路、渡口和关卡权限，同时保留军营、封存货物等限制。三十日期限和沿途换马的待遇，为领地制度补上可使用的细节。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[9],
          alt: '居中的棕色羊皮纸王室通行令，授予东境道路、渡口和关卡通行权，并列出期限与限制。',
        },
        {
          name: '玻璃沼泽研究手记',
          designation: 'GM / 世界观创作者 · 研究手记',
          quote:
            '通过羊皮纸卷轴制作器整理月升时的蓝焰记录、水流、铁器倒影和沼泽芦苇变化，把研究写成可继续追查的线索。沉没水道和溺亡神殿的风险，也为探索留下明确后果。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[10],
          alt: '棕色羊皮纸研究手记，记录 Glass Marsh 蓝焰对流水和铁器倒影的反应，并写出溺亡神殿的风险。',
        },
        {
          name: '遗嘱与继承文书',
          designation: 'GM / 奇幻作者 · 继承文书',
          quote:
            '在羊皮纸卷轴制作器中排版这份遗嘱，把房屋、银色星盘和红皮魔法书分配给不同继承人，再写清条件与见证人。继承规则可以自然引出家族冲突、承诺或新的故事责任。',
          src: SCROLL_CREATOR_CASE_IMAGE_PATHS[11],
          alt: '棕色羊皮纸遗嘱，分配 Orin Vale 的房屋、银色星盘和红皮魔法书，并列出见证人。',
        },
      ],
    },
  ],
};

export function getScrollCreatorCaseStudies(locale: ScrollLocale): ScrollCreatorCaseStudiesCopy {
  if (locale === 'en') return englishCaseStudies;
  if (locale === 'zh') return chineseCaseStudies;

  throw new Error(`Unknown scroll creator case studies locale: ${JSON.stringify(locale)}.`);
}
