import type { SiteLocale } from '@/lib/site-locale';

export type TarotCopy = {
  readonly navigationTitle: string;
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly heroAction: string;
  readonly metadataTitle: string;
  readonly metadataDescription: string;
  readonly actions: {
    readonly single: string;
    readonly spread: string;
    readonly dealSingle: string;
    readonly dealSpread: string;
    readonly redeal: string;
    readonly shuffle: string;
    readonly revealAll: string;
    readonly changeSpread: string;
    readonly help: string;
    readonly close: string;
  };
  readonly labels: {
    readonly remaining: string;
    readonly revealed: string;
    readonly chooseSpread: string;
    readonly preview: string;
    readonly cardName: string;
    readonly position: string;
    readonly positionMeaning: string;
    readonly uprightMeaning: string;
    readonly reversedMeaning: string;
    readonly upright: string;
    readonly reversed: string;
    readonly horizontal: string;
    readonly unrevealed: string;
    readonly selectedCard: string;
    readonly details: string;
  };
  readonly messages: {
    readonly emptyTitle: string;
    readonly emptyDescription: string;
    readonly selectCardHint: string;
    readonly previewHint: string;
    readonly shuffled: string;
    readonly insufficientTitle: string;
    readonly insufficientDescription: string;
    readonly exhaustedTitle: string;
    readonly exhaustedDescription: string;
  };
  readonly help: {
    readonly title: string;
    readonly sections: readonly {
      readonly title: string;
      readonly body: string;
    }[];
  };
};

const englishTarotCopy: TarotCopy = {
  navigationTitle: 'Tarot Cards',
  pageTitle: 'Fantasy Tarot Cards – Free Online Card Draw Tool',
  pageDescription:
    'Draw custom fantasy tarot cards to inspire stories and RPG campaigns. Use 15 spreads to spark ideas for characters, worlds, encounters, and plot twists.',
  heroAction: 'Draw Tarot Cards',
  metadataTitle: 'Fantasy Tarot Cards – Free Online Card Draw Tool',
  metadataDescription:
    'Draw custom fantasy tarot cards to inspire stories and RPG campaigns. Use 15 spreads to spark ideas for characters, worlds, encounters, and plot twists.',
  actions: {
    single: 'Single card',
    spread: 'Spread',
    dealSingle: 'Draw a card',
    dealSpread: 'Deal spread',
    redeal: 'Deal again',
    shuffle: 'Shuffle deck',
    revealAll: 'Reveal all',
    changeSpread: 'Change spread',
    help: 'How it works',
    close: 'Close',
  },
  labels: {
    remaining: 'Remaining',
    revealed: 'Revealed',
    chooseSpread: 'Choose a spread',
    preview: 'Preview',
    cardName: 'Card',
    position: 'Position',
    positionMeaning: 'Position meaning',
    uprightMeaning: 'Upright meaning',
    reversedMeaning: 'Reversed meaning',
    upright: 'Upright',
    reversed: 'Reversed',
    horizontal: 'Horizontal',
    unrevealed: 'Unrevealed',
    selectedCard: 'Selected card',
    details: 'Details',
  },
  messages: {
    emptyTitle: 'Choose a reading',
    emptyDescription: 'Choose a single card or a spread to begin.',
    selectCardHint: 'Select a card to view its details.',
    previewHint: 'Preview the spread positions, then deal when you are ready.',
    shuffled: 'The 78-card deck has been shuffled. Your current reading stays on the table.',
    insufficientTitle: 'Not enough cards',
    insufficientDescription:
      'This deal needs more cards than remain. Shuffle the deck first, or choose a smaller spread.',
    exhaustedTitle: 'The deck is empty',
    exhaustedDescription: 'All 78 cards have been dealt in this cycle. Shuffle to start a new cycle.',
  },
  help: {
    title: 'How to use Tarot Cards',
    sections: [
      {
        title: 'Choose a reading',
        body: 'Choose Single card for a direct draw or Spread to work with a layout.',
      },
      {
        title: 'Preview before dealing',
        body: 'Choose a spread to preview its positions and meanings. Deal only when the layout is ready.',
      },
      {
        title: 'Share one deck',
        body: 'Single-card draws and spreads use the same 78-card deck. Dealt cards are removed without replacement until you shuffle.',
      },
      {
        title: 'Reveal and read',
        body: 'A single draw starts face down; click the card to flip it. Spread cards also start hidden; click a card to flip it and view its name, position, and meaning details. Upright and reversed meanings are prompts for reflection and story ideas.',
      },
      {
        title: 'Manage the cycle',
        body: 'Reveal all flips the cards already on the table and does not draw new cards. Deal again consumes fresh cards from the current cycle. Shuffle starts a new 78-card cycle while keeping the current reading visible. If a deal needs more cards than remain, shuffle first.',
      },
    ],
  },
};

const chineseTarotCopy: TarotCopy = {
  navigationTitle: '塔罗牌工具',
  pageTitle: '幻想塔罗牌 – 免费在线随机抽牌工具',
  pageDescription:
    '随机抽取幻想主题塔罗牌，搭配 15 种牌阵，为角色背景、世界设定、冒险遭遇和剧情转折寻找灵感。',
  heroAction: '开始抽牌',
  metadataTitle: '幻想塔罗牌 – 免费在线随机抽牌工具',
  metadataDescription:
    '随机抽取幻想主题塔罗牌，搭配 15 种牌阵，为角色背景、世界设定、冒险遭遇和剧情转折寻找灵感。',
  actions: {
    single: '单牌',
    spread: '牌阵',
    dealSingle: '抽一张',
    dealSpread: '发牌阵',
    redeal: '重新发牌',
    shuffle: '洗牌',
    revealAll: '全部翻开',
    changeSpread: '更换牌阵',
    help: '使用说明',
    close: '关闭',
  },
  labels: {
    remaining: '剩余牌数',
    revealed: '已翻开',
    chooseSpread: '选择牌阵',
    preview: '预览',
    cardName: '牌名',
    position: '位置',
    positionMeaning: '位置含义',
    uprightMeaning: '正位牌义',
    reversedMeaning: '逆位牌义',
    upright: '正位',
    reversed: '逆位',
    horizontal: '横向',
    unrevealed: '未翻开',
    selectedCard: '当前牌',
    details: '详情',
  },
  messages: {
    emptyTitle: '选择阅读方式',
    emptyDescription: '选择单牌或牌阵开始。',
    selectCardHint: '选择一张牌查看详情。',
    previewHint: '先预览牌阵位置，准备好后再发牌。',
    shuffled: '78 张牌已重新洗牌，当前阅读仍保留在桌面上。',
    insufficientTitle: '剩余牌数不足',
    insufficientDescription: '本次发牌所需牌数超过剩余牌数。请先洗牌，或选择更小的牌阵。',
    exhaustedTitle: '牌组已用尽',
    exhaustedDescription: '本轮 78 张牌都已发出。请洗牌开始新一轮。',
  },
  help: {
    title: '塔罗牌工具使用说明',
    sections: [
      {
        title: '选择阅读方式',
        body: '选择单牌可直接抽一张牌，选择牌阵可使用一个布局。',
      },
      {
        title: '发牌前先预览',
        body: '选择牌阵即可预览各个位置及其含义；确认布局后再发牌。',
      },
      {
        title: '共用一副牌',
        body: '单牌和牌阵共用一副 78 张牌。发出的牌会从牌堆中移除，同一轮洗牌前不会重复抽到。',
      },
      {
        title: '翻牌并阅读',
        body: '单牌会先以牌背显示，点击牌面即可翻开。牌阵中的牌也会初始隐藏；点击牌面即可翻开，并查看牌名、位置和牌义详情。正位与逆位的传统牌义可作为反思和故事灵感提示。',
      },
      {
        title: '管理牌组循环',
        body: '“全部翻开”只会翻开桌面上已有的牌，不会抽取新牌。“重新发牌”会从本轮牌组消耗新的牌。“洗牌”会开启新的 78 张牌周期，同时保留当前阅读在桌面上。如果剩余牌数不足以完成牌阵，请先洗牌。',
      },
    ],
  },
};

const tarotCopyByLocale: Record<SiteLocale, TarotCopy> = {
  en: englishTarotCopy,
  zh: chineseTarotCopy,
};

function isTarotLocale(locale: string): locale is SiteLocale {
  return locale === 'en' || locale === 'zh';
}

function requireTarotLocale(locale: SiteLocale): SiteLocale {
  if (isTarotLocale(locale)) {
    return locale;
  }

  throw new Error(`Unknown tarot locale. Received ${JSON.stringify(locale)}.`);
}

export function getTarotCopy(locale: SiteLocale): TarotCopy {
  return tarotCopyByLocale[requireTarotLocale(locale)];
}
