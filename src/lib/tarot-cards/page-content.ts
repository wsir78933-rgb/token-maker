import type { SiteLocale } from '@/lib/site-locale';

export type TarotFeatureIcon = 'cards' | 'spreads' | 'flip' | 'meanings' | 'deck' | 'inspiration';

export type TarotFaqItemCopy = {
  readonly question: string;
  readonly answer: string;
};

export type TarotPageContent = {
  readonly whatIs: {
    readonly title: string;
    readonly description: string;
  };
  readonly features: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly icon: TarotFeatureIcon;
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly howItWorks: {
    readonly eyebrow: string;
    readonly title: string;
    readonly steps: readonly {
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly comparison: {
    readonly title: string;
    readonly description: string;
    readonly tableLabel: string;
    readonly dimensionHeading: string;
    readonly toolHeading: string;
    readonly physicalHeading: string;
    readonly randomTableHeading: string;
    readonly rows: readonly {
      readonly dimension: string;
      readonly tool: string;
      readonly physical: string;
      readonly randomTable: string;
    }[];
  };
  readonly callToAction: {
    readonly title: string;
    readonly description: string;
    readonly action: string;
  };
  readonly faq: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly TarotFaqItemCopy[];
  };
};

const englishTarotPageContent: TarotPageContent = {
  whatIs: {
    title: 'What is this fantasy tarot card tool?',
    description:
      "Fantasy tarot cards turn a random draw into a creative prompt. Choose a single card or one of 15 spreads to explore a character's motive, a world's hidden pressure, an encounter, or the next plot turn. Use the images, positions, and upright or reversed prompts as starting points for your own story.",
  },
  features: {
    title: 'Find ideas for characters, worlds, and plot twists',
    description: 'Draw fantasy tarot cards, explore spreads, and reveal prompts for your next story or RPG session.',
    items: [
      {
        icon: 'cards',
        title: 'A 78-card fantasy deck',
        description: 'Explore 22 major cards and four suits of minor cards in a fantasy deck; the tarot cards have bilingual names and illustrated faces.',
      },
      {
        icon: 'spreads',
        title: '15 spread previews',
        description: 'Preview each layout, its positions, and its prompts before you deal from a deck of tarot cards.',
      },
      {
        icon: 'flip',
        title: 'Reveal one card at a time',
        description: 'Tarot cards arrive face down. Click a card to reveal its face and open its details, keeping the reveal at your own pace.',
      },
      {
        icon: 'meanings',
        title: 'Upright and reversed prompts',
        description: 'Use bilingual upright and reversed meaning prompts on the tarot cards to give a scene, character, or conflict a new angle.',
      },
      {
        icon: 'deck',
        title: 'One shared deck, no repeats this cycle',
        description: 'Single draws and spreads use one deck of tarot cards. Dealt cards stay out of the draw pile until you shuffle.',
      },
      {
        icon: 'inspiration',
        title: 'Built for story sparks',
        description: 'Connect a card image, a spread position, and a prompt from the tarot cards to shape character backgrounds, world details, encounters, and plot turns.',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'How to use fantasy tarot cards',
    steps: [
      {
        title: 'Choose your draw',
        description: 'Start with a single card for one prompt, or preview a spread of tarot cards and choose the layout that fits your scene.',
      },
      {
        title: 'Deal, then reveal',
        description: 'Deal from the shared deck of tarot cards. Cards begin face down; click to flip them and view each name, position, and prompt.',
      },
      {
        title: 'Build your setting',
        description: 'Connect the image and meaning prompt from the tarot cards to a character, world detail, conflict, or plot turn. Shuffle when you want a new card cycle.',
      },
    ],
  },
  comparison: {
    title: 'Fantasy Tarot Cards vs. physical cards vs. random tables',
    description:
      'Compare Fantasy Tarot Cards with physical cards or a random idea table. Each method can spark a story; this tool keeps the deck, layout, and prompts together.',
    tableLabel: 'Creative prompt method comparison',
    dimensionHeading: 'Creative step',
    toolHeading: 'Fantasy Tarot Cards',
    physicalHeading: 'Physical cards',
    randomTableHeading: 'Random inspiration table',
    rows: [
      {
        dimension: 'Prepare materials',
        tool: 'Use the built-in deck of 78 fantasy tarot cards.',
        physical: 'Arrange a deck yourself.',
        randomTable: 'Choose or make a table yourself.',
      },
      {
        dimension: 'Choose a layout',
        tool: 'Preview 15 spreads for arranging the tarot cards with defined positions.',
        physical: 'Layout depends on the deck and your setup.',
        randomTable: 'Layout depends on the table.',
      },
      {
        dimension: 'Reveal the result',
        tool: 'Deal the tarot cards face down, then click to reveal each one.',
        physical: 'Reveal cards by hand.',
        randomTable: 'Reveal results according to the table.',
      },
      {
        dimension: 'Read the prompt',
        tool: 'Use images of the tarot cards, positions, and upright or reversed prompts.',
        physical: 'Meaning depends on the deck or guide.',
        randomTable: 'Prompt depends on the table.',
      },
      {
        dimension: 'Handle repeats',
        tool: 'Dealt tarot cards leave the shared deck until you shuffle.',
        physical: 'Keep drawn cards outside the deck until you reshuffle.',
        randomTable: 'Repeats depend on the table and draw rules; record results when needed.',
      },
    ],
  },
  callToAction: {
    title: 'Find your next story idea',
    description: 'Draw fantasy tarot cards or choose a spread for your next character, world, or plot turn.',
    action: 'Start a creative draw',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions about Tarot Cards',
    description: 'Find the quick answers before you begin your next creative draw.',
    items: [
      {
        question: 'Who is this fantasy tarot card tool for?',
        answer: 'It is made for fantasy creators, RPG players, game masters, worldbuilding creators, and anyone who wants to use tarot cards as a visual prompt for a character, setting, encounter, or plot turn.',
      },
      {
        question: 'Is it free, and do I need an account?',
        answer: 'The current Tarot Cards tool is free to use, and you can start drawing tarot cards without signing in.',
      },
      {
        question: 'How many cards and spreads are included?',
        answer: 'The deck has 78 tarot cards: 22 major cards and 56 minor cards across four suits. You can choose from 15 spreads with different positions and layouts.',
      },
      {
        question: 'Why do the cards start face down?',
        answer: 'Each deal starts face down. Reveal tarot cards at your own pace by clicking them to see the image, direction, position, and prompt.',
      },
      {
        question: 'Can the same card appear twice before I shuffle?',
        answer: 'No. Single draws and spreads share one deck of tarot cards, and a dealt card leaves the current cycle until you shuffle. Shuffling starts a fresh 78-card cycle while keeping the current reading visible.',
      },
      {
        question: 'How should I use upright and reversed prompts?',
        answer: 'Treat tarot cards as flexible creative prompts. Let the image and direction suggest a motive, tension, relationship, world detail, or plot possibility instead of locking your story to one answer.',
      },
      {
        question: 'What happens when there are not enough cards?',
        answer: 'The deal does not consume a partial spread. Shuffle the tarot cards to begin a new cycle, or choose a smaller spread if the current deck does not have enough cards.',
      },
      {
        question: 'How can I use it for an RPG session?',
        answer: 'Use a single draw from the tarot cards for a quick hook, or match spread positions to a character motive, faction pressure, encounter complication, or campaign direction. Turn the prompts into details you can use at the table.',
      },
    ],
  },
};

const chineseTarotPageContent: TarotPageContent = {
  whatIs: {
    title: '什么是幻想塔罗牌工具？',
    description:
      '幻想塔罗牌把随机抽牌变成创作提示。你可以抽一张牌，或选择 15 种牌阵之一，探索角色动机、世界中的隐性压力、冒险遭遇或下一次剧情转折。把牌面、位置和正逆位提示当作故事的起点，继续写出属于自己的设定。',
  },
  features: {
    title: '为角色、世界和剧情寻找灵感',
    description: '随机抽牌、预览牌阵、逐张翻开，为角色背景、世界设定和冒险遭遇寻找线索。',
    items: [
      {
        icon: 'cards',
        title: '78 张幻想卡牌',
        description: '包含 22 张大阿尔卡那和四个花色的小阿尔卡那；这些塔罗牌都有双语名称与牌面图像。',
      },
      {
        icon: 'spreads',
        title: '15 种牌阵预览',
        description: '发牌前先查看塔罗牌的布局、位置和对应提示，再选择适合当前场景的牌阵。',
      },
      {
        icon: 'flip',
        title: '逐张揭示牌面',
        description: '这些塔罗牌会先以牌背出现，点击后翻开并打开详情；发牌与翻牌流程保留了逐步揭示的神秘感。',
      },
      {
        icon: 'meanings',
        title: '正逆位创作提示',
        description: '查看塔罗牌的双语正位与逆位牌义提示，为场景、角色或冲突找到新的切入角度。',
      },
      {
        icon: 'deck',
        title: '共用牌堆，本轮不重复',
        description: '单牌和牌阵共用一副塔罗牌。已经发出的牌会留在抽牌堆外，直到洗牌。',
      },
      {
        icon: 'inspiration',
        title: '为创作点燃灵感',
        description: '把塔罗牌的牌面图像、牌阵位置和牌义提示连在一起，塑造角色背景、世界细节、冒险遭遇和剧情转折。',
      },
    ],
  },
  howItWorks: {
    eyebrow: '使用方式',
    title: '如何使用幻想塔罗牌工具？',
    steps: [
      {
        title: '选择抽牌方式',
        description: '单牌适合获得一个直接提示；也可以先预览由塔罗牌组成的牌阵，选择适合当前场景的布局。',
      },
      {
        title: '发牌后逐张翻开',
        description: '从由塔罗牌组成的共用牌堆发牌。牌会先以牌背显示，点击后即可查看牌名、位置和牌义提示。',
      },
      {
        title: '构建你的设定',
        description: '把塔罗牌的牌面和牌义提示连接到角色、世界细节、冲突或剧情转折；想开始新的抽牌周期时再洗牌。',
      },
    ],
  },
  comparison: {
    title: '幻想塔罗牌 vs. 实体卡牌 vs. 随机灵感表',
    description:
      '将幻想塔罗牌与实体卡牌、随机灵感表放在一起比较。三种方式都可以激发故事，本工具把牌组、牌阵和提示集中在同一处。',
    tableLabel: '创作提示方式比较',
    dimensionHeading: '创作环节',
    toolHeading: '幻想塔罗牌',
    physicalHeading: '实体卡牌',
    randomTableHeading: '随机灵感表',
    rows: [
      {
        dimension: '准备素材',
        tool: '直接使用内置的 78 张幻想塔罗牌。',
        physical: '需要自行准备牌组。',
        randomTable: '需要自行选择或制作灵感表。',
      },
      {
        dimension: '选择布局',
        tool: '预览 15 种带有明确位置的塔罗牌阵。',
        physical: '取决于牌组和你的摆牌方式。',
        randomTable: '取决于灵感表的结构。',
      },
      {
        dimension: '揭示结果',
        tool: '这些塔罗牌会以牌背发出，再点击逐张翻开。',
        physical: '用手翻开实体卡牌。',
        randomTable: '按照灵感表揭示结果。',
      },
      {
        dimension: '阅读提示',
        tool: '结合塔罗牌的牌面图像、位置和正逆位提示。',
        physical: '取决于牌组或配套指南。',
        randomTable: '取决于灵感表中的提示。',
      },
      {
        dimension: '处理重复',
        tool: '已发出的塔罗牌会离开共用牌堆，直到洗牌。',
        physical: '把已抽出的牌留在牌堆外，洗牌时再放回。',
        randomTable: '是否重复取决于表格和抽取规则，需要时自行记录。',
      },
    ],
  },
  callToAction: {
    title: '开始一次创作抽牌',
    description: '为下一个角色、世界设定或剧情转折抽一张幻想塔罗牌，或选择一套牌阵，让塔罗牌提示继续展开。',
    action: '开始创作抽牌',
  },
  faq: {
    eyebrow: '常见问题',
    title: '关于幻想塔罗牌工具',
    description: '开始下一次创作抽牌前，先查看这些简短答案。',
    items: [
      {
        question: '这款幻想塔罗牌工具适合谁？',
        answer: '它适合奇幻创作者、RPG 玩家、游戏主持人、世界观创作者，以及想用塔罗牌为角色、设定、遭遇或剧情转折寻找视觉提示的人。',
      },
      {
        question: '工具免费吗？需要注册账号吗？',
        answer: '当前幻想塔罗牌工具可以免费使用，打开页面后即可用塔罗牌开始抽牌，不需要登录账号。',
      },
      {
        question: '有多少张牌和多少种牌阵？',
        answer: '牌组共有 78 张塔罗牌，包括 22 张大阿尔卡那和四个花色的 56 张小阿尔卡那；同时提供 15 种不同位置与布局的牌阵。',
      },
      {
        question: '为什么牌会先以牌背显示？',
        answer: '每次发牌先显示塔罗牌的牌背，你可以按自己的节奏逐张翻开，查看牌面、方向、位置和提示。',
      },
      {
        question: '洗牌前会抽到同一张牌吗？',
        answer: '不会。单牌和牌阵共用一副塔罗牌，已经发出的牌会在当前周期中移除；洗牌会开启新的 78 张牌周期，同时保留当前阅读。',
      },
      {
        question: '正位和逆位提示应该怎么用于创作？',
        answer: '把塔罗牌当作灵活的创作提示。让这些塔罗牌的牌面与方向帮助你思考动机、张力、关系、世界细节或剧情可能性，不必把故事锁定为唯一答案。',
      },
      {
        question: '剩余牌数不够时会怎样？',
        answer: '工具不会只发出部分牌。可以洗牌开始新的塔罗牌周期，或者在当前牌组不足时选择更小的牌阵。',
      },
      {
        question: '如何把它用于 RPG？',
        answer: '用一张塔罗牌快速生成一个冒险钩子，也可以把牌阵里的塔罗牌位置对应到角色动机、阵营压力、遭遇变数或战役方向，再把提示扩写成适合桌游的细节。',
      },
    ],
  },
};

const tarotPageContentByLocale: Record<SiteLocale, TarotPageContent> = {
  en: englishTarotPageContent,
  zh: chineseTarotPageContent,
};

function isTarotLocale(locale: unknown): locale is SiteLocale {
  return locale === 'en' || locale === 'zh';
}

function describeTarotLocale(locale: unknown): string {
  if (typeof locale === 'string') {
    return JSON.stringify(locale);
  }

  const serializedLocale = JSON.stringify(locale);
  return typeof serializedLocale === 'string' ? serializedLocale : String(locale);
}

function requireTarotLocale(locale: SiteLocale): SiteLocale {
  if (isTarotLocale(locale)) {
    return locale;
  }

  throw new Error(`Unknown tarot page locale. Received ${describeTarotLocale(locale)}.`);
}

export function getTarotPageContent(locale: SiteLocale): TarotPageContent {
  return tarotPageContentByLocale[requireTarotLocale(locale)];
}
