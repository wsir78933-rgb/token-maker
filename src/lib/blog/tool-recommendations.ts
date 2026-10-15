import { getToolDirectoryLinks, type ToolDirectoryLink } from '@/lib/tool-directory';
import { isSiteLocale, type SiteLocale } from '@/lib/site-locale';

type ToolRecommendationId = ToolDirectoryLink['id'];
type ToolRecommendationTuple = readonly [
  ToolRecommendationId,
  ToolRecommendationId,
  ToolRecommendationId,
  ToolRecommendationId,
];

type BlogToolRecommendationConfig = {
  toolIds: ToolRecommendationTuple;
  descriptionByLocale: Record<SiteLocale, string>;
};

export type BlogToolRecommendations = {
  description: string;
  toolIds: ToolRecommendationTuple;
};

const BLOG_TOOL_RECOMMENDATIONS = {
  'dnd-halfling': {
    toolIds: ['token-maker', 'family-tree-creator', 'coat-of-arms-maker', 'language-generator'],
    descriptionByLocale: {
      en: 'Give your halfling a readable VTT portrait, a family line, and a few original details for the table.',
      zh: '为半身人制作清晰的桌面头像，梳理家族关系，再补上属于这桌的原创细节。',
    },
  },
  'dnd-kobold': {
    toolIds: ['token-maker', 'dice-roller', 'army-formation-creator', 'map-maker'],
    descriptionByLocale: {
      en: 'Make a distinct kobold token, arrange units and terrain for the encounter, and sketch its wider region on a world map.',
      zh: '制作容易辨认的狗头人 Token，用阵型工具安排战斗单位与地形，再用世界地图描绘所在区域。',
    },
  },
  'dnd-skills': {
    toolIds: ['dice-roller', 'token-maker', 'scroll-creator', 'notice-board-creator'],
    descriptionByLocale: {
      en: 'Keep your chosen skill reference near the table with dice and printable campaign props.',
      zh: '把选定的技能速查内容放在桌边，并准备掷骰工具和可打印的跑团素材。',
    },
  },
  'dnd-conditions': {
    toolIds: ['token-maker', 'scroll-creator', 'dice-roller', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Make readable creature tokens and a session reference while laying out a combat encounter.',
      zh: '制作清楚的生物 Token 与桌边参考素材，并提前规划战斗场景。',
    },
  },
  'dnd-beholder': {
    toolIds: ['token-maker', 'dice-roller', 'army-formation-creator', 'map-maker'],
    descriptionByLocale: {
      en: 'Keep the beholder recognizable on a VTT, arrange encounter units and terrain, and sketch the wider region on a world map.',
      zh: '让眼魔在 VTT 上容易辨认，安排遭遇中的单位与地形，再用世界地图描绘周边区域。',
    },
  },
  'mind-flayer-dnd': {
    toolIds: ['token-maker', 'army-formation-creator', 'map-maker', 'dice-roller'],
    descriptionByLocale: {
      en: 'Frame the mind flayer clearly on a VTT, arrange encounter units and terrain, and sketch its wider region on a world map.',
      zh: '为夺心魔制作清晰的 VTT 头像，用阵型工具安排遭遇单位与地形，再用世界地图描绘所在区域。',
    },
  },
  'dnd-cleric-spells': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Keep your chosen cleric spells organized for play with dice, a character token, and a spell-scroll prop.',
      zh: '把选好的牧师法术整理成桌边素材，并备好掷骰工具与角色 Token。',
    },
  },
  'dnd-kenku': {
    toolIds: ['token-maker', 'language-generator', 'family-tree-creator', 'coat-of-arms-maker'],
    descriptionByLocale: {
      en: 'Shape a recognizable kenku portrait and add original family or fictional-language details.',
      zh: '制作容易辨认的天狗头像，再补充原创家族设定或虚构语言细节。',
    },
  },
  'dnd-dragonborn': {
    toolIds: ['token-maker', 'family-tree-creator', 'coat-of-arms-maker', 'language-generator'],
    descriptionByLocale: {
      en: 'Bring a dragonborn concept to the table with a token, clan lineage, emblem, and original phrase.',
      zh: '用角色 Token、氏族关系、家族徽记和原创短句呈现龙裔设定。',
    },
  },
  'dnd-druid': {
    toolIds: ['token-maker', 'dice-roller', 'map-maker', 'scroll-creator'],
    descriptionByLocale: {
      en: 'Prepare a druid character portrait, first-spell notes, and a map of the wilderness region.',
      zh: '准备德鲁伊角色头像与初期法术笔记，并绘制荒野区域地图。',
    },
  },
  'dnd-backgrounds': {
    toolIds: ['family-tree-creator', 'token-maker', 'coat-of-arms-maker', 'language-generator'],
    descriptionByLocale: {
      en: 'Turn a selected background into family ties, a character portrait, and original setting details.',
      zh: '把选定的背景延伸成家族关系、角色头像和原创世界设定。',
    },
  },
  'dnd-classes-comparison': {
    toolIds: ['token-maker', 'weapon-creator', 'armor-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'After comparing party roles, sketch a character look and the gear that fits the class you choose.',
      zh: '对照队伍职责选定职业后，再构思角色外观和适合的装备。',
    },
  },
  'dnd-character-sheet': {
    toolIds: ['token-maker', 'armor-creator', 'weapon-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'Give the finished level-one character a VTT portrait and illustrated gear for the first session.',
      zh: '为完成的 1 级角色制作 VTT 头像，并画出首场游戏要用的装备。',
    },
  },
  'dnd-fighter': {
    toolIds: ['weapon-creator', 'armor-creator', 'token-maker', 'dice-roller'],
    descriptionByLocale: {
      en: 'Build a clear fighter look around the weapon, armor, and combat role chosen for level one.',
      zh: '围绕 1 级战士选定的武器、护甲和战斗职责，制作清楚的角色形象。',
    },
  },
  'players-handbook-dnd-5e': {
    toolIds: ['token-maker', 'scroll-creator', 'calendar-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'Once your table settles on a rules year, prepare a character portrait and simple first-session materials.',
      zh: '确定桌上采用的规则年份后，为首场游戏准备角色头像和基础素材。',
    },
  },
  'dnd-paladin': {
    toolIds: ['token-maker', 'armor-creator', 'weapon-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'Make the paladin’s protective role visible with a character token and illustrated armor and weapon.',
      zh: '用角色 Token、护甲与武器插画，呈现圣武士保护队友的职责。',
    },
  },
  'dnd-artificer': {
    toolIds: ['token-maker', 'armor-creator', 'weapon-creator', 'outfit-creator'],
    descriptionByLocale: {
      en: 'Turn the artificer role you choose into a distinct portrait, outfit, armor, and signature gear.',
      zh: '把选定的奇械师职责呈现为鲜明头像、服装、护甲和标志性装备。',
    },
  },
  'dnd-stats': {
    toolIds: ['dice-roller', 'token-maker', 'armor-creator', 'outfit-creator'],
    descriptionByLocale: {
      en: 'Roll dice when your table uses a rolled score method, then give the finished character a clear look.',
      zh: '如果桌上采用掷骰生成属性，就用骰子工具投掷，再为完成的角色设计形象。',
    },
  },
  'dnd-languages': {
    toolIds: ['language-generator', 'family-tree-creator', 'token-maker', 'map-maker'],
    descriptionByLocale: {
      en: 'Use custom spelling rules to create original fictional phrases, then connect them with a character’s family and campaign setting.',
      zh: '用自定义拼写规则创作原创虚构短语，再把它们融入角色家族与战役设定。',
    },
  },
  'dnd-meaning': {
    toolIds: ['dice-roller', 'token-maker', 'map-maker', 'scroll-creator'],
    descriptionByLocale: {
      en: 'Get a feel for a first game by preparing a character token, a campaign-region map, and a roll of the dice.',
      zh: '通过角色 Token、战役区域地图和一次掷骰，直观准备你的第一场游戏。',
    },
  },
  'dnd-alignment-chart': {
    toolIds: ['tarot-cards', 'family-tree-creator', 'token-maker', 'emblem-creator'],
    descriptionByLocale: {
      en: 'Use story prompts to explore a character choice, then shape the character’s identity and faction ties.',
      zh: '用故事灵感推演角色抉择，再整理人物身份与阵营关系。',
    },
  },
  'dnd-races': {
    toolIds: ['token-maker', 'coat-of-arms-maker', 'family-tree-creator', 'language-generator'],
    descriptionByLocale: {
      en: 'Turn a species concept into a readable portrait, family background, and original cultural details.',
      zh: '把物种角色概念延伸为清晰头像、家族背景和原创文化细节。',
    },
  },
  'dnd-shatter-5e': {
    toolIds: ['dice-roller', 'army-formation-creator', 'token-maker', 'scroll-creator'],
    descriptionByLocale: {
      en: 'Arrange units and terrain for the Shatter encounter, then keep character tokens and spell notes ready.',
      zh: '用阵型工具安排粉碎术遭遇中的单位与地形，并备好角色 Token 和法术笔记。',
    },
  },
  'dnd-gnome-names': {
    toolIds: ['family-tree-creator', 'token-maker', 'coat-of-arms-maker', 'language-generator'],
    descriptionByLocale: {
      en: 'After choosing a name from the source your table allows, add family ties and original character details.',
      zh: '按桌上认可的来源选好名字后，再补充家族关系和原创角色细节。',
    },
  },
  'dnd-maul': {
    toolIds: ['weapon-creator', 'armor-creator', 'token-maker', 'dice-roller'],
    descriptionByLocale: {
      en: 'Design a maul-wielding character’s look and keep the weapon and combat setup visible on the table.',
      zh: '设计挥舞巨锤的角色形象，并让武器与战斗准备在桌面上清晰可见。',
    },
  },
  'dnd-quarterstaff': {
    toolIds: ['weapon-creator', 'outfit-creator', 'token-maker', 'dice-roller'],
    descriptionByLocale: {
      en: 'Illustrate a quarterstaff build and give its character a distinct portrait and outfit.',
      zh: '为长棍构筑设计武器插画，再为角色搭配醒目的头像与服装。',
    },
  },
  'spectator-dnd': {
    toolIds: ['token-maker', 'map-maker', 'army-formation-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'Set a spectator apart on the VTT, arrange encounter units and terrain, and sketch the guarded region on a world map.',
      zh: '让观察者眼魔在 VTT 上容易辨认，安排遭遇单位与地形，再用世界地图描绘它守护的区域。',
    },
  },
  'firebolt-dnd-5e': {
    toolIds: ['dice-roller', 'army-formation-creator', 'token-maker', 'scroll-creator'],
    descriptionByLocale: {
      en: 'Arrange units and terrain for the Fire Bolt encounter, then prepare a character token and spell notes.',
      zh: '用阵型工具安排 Fire Bolt 遭遇中的单位与地形，再准备角色 Token 和法术笔记。',
    },
  },
  'dnd-dagger': {
    toolIds: ['weapon-creator', 'outfit-creator', 'token-maker', 'armor-creator'],
    descriptionByLocale: {
      en: 'Give a dagger user a distinct character portrait and illustrated weapon, outfit, and armor.',
      zh: '为使用匕首的角色制作鲜明头像，并设计武器、服装与护甲。',
    },
  },
  'dwelf-dnd': {
    toolIds: ['token-maker', 'family-tree-creator', 'coat-of-arms-maker', 'language-generator'],
    descriptionByLocale: {
      en: 'Show a dwarf-elf character’s chosen heritage through a portrait, family ties, and original cultural cues.',
      zh: '通过头像、家族关系和原创文化线索，呈现矮人精灵角色选定的身世。',
    },
  },
  'dnd-flumph': {
    toolIds: ['token-maker', 'notice-board-creator', 'map-maker', 'dice-roller'],
    descriptionByLocale: {
      en: 'Make the flumph readable as an ally and prepare a clue board and a place for it on the campaign-region map.',
      zh: '让弗洛姆作为盟友清楚可辨，并在战役区域地图上标出它出现的地点、准备相关线索板。',
    },
  },
  'dnd-death-knight': {
    toolIds: ['token-maker', 'army-formation-creator', 'weapon-creator', 'armor-creator'],
    descriptionByLocale: {
      en: 'Separate the death knight from its followers with distinct tokens, then plan the group’s positions and gear.',
      zh: '用不同 Token 区分死亡骑士与随从，再规划队伍站位和装备外观。',
    },
  },
  'dnd-5e-armorer': {
    toolIds: ['armor-creator', 'outfit-creator', 'token-maker', 'weapon-creator'],
    descriptionByLocale: {
      en: 'Give the chosen armorer model a clear visual identity with matching armor, clothing, and gear.',
      zh: '为选定的装甲模型搭配护甲、服装和装备，塑造清楚的角色形象。',
    },
  },
  'dnd-sword-sheaths': {
    toolIds: ['weapon-creator', 'outfit-creator', 'token-maker', 'coat-of-arms-maker'],
    descriptionByLocale: {
      en: 'Pair a sword and scabbard concept with a character outfit, token, and personal emblem.',
      zh: '把剑与剑鞘设想和角色服装、头像及个人徽记搭配起来。',
    },
  },
  'dnd-thunderclap': {
    toolIds: ['dice-roller', 'army-formation-creator', 'token-maker', 'scroll-creator'],
    descriptionByLocale: {
      en: 'Arrange units and terrain for a Thunderclap encounter, then prepare character tokens and concise spell notes.',
      zh: '用阵型工具安排雷鸣拍击遭遇中的单位与地形，再准备角色 Token 和简明法术笔记。',
    },
  },
  'dnd-find-familiar': {
    toolIds: ['token-maker', 'dice-roller', 'map-maker', 'scroll-creator'],
    descriptionByLocale: {
      en: 'Give a familiar a recognizable VTT portrait and prepare a scouting route on a campaign-region map.',
      zh: '为魔宠制作易辨认的 VTT 头像，并在战役区域地图上准备侦察路线。',
    },
  },
  'dnd-hex': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Keep Hex notes and character markers ready while arranging the combat scene around its chosen target.',
      zh: '准备巫术印记笔记和角色标记，并围绕选定目标安排战斗场景。',
    },
  },
  'paladin-2024-spells-dnd': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Arrange your chosen paladin spell notes alongside character markers and a simple encounter layout.',
      zh: '把选定的圣武士法术笔记与角色标记、简易遭遇布局一起准备好。',
    },
  },
  'dnd-glaive': {
    toolIds: ['weapon-creator', 'armor-creator', 'outfit-creator', 'token-maker'],
    descriptionByLocale: {
      en: 'Build a distinct polearm user around an illustrated glaive, armor, outfit, and VTT portrait.',
      zh: '围绕长柄刀插画、护甲、服装和 VTT 头像，设计鲜明的长柄武器使用者。',
    },
  },
  'dnd-silvery-barbs': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'tarot-cards'],
    descriptionByLocale: {
      en: 'Keep a reaction reference and character markers ready, with card prompts for the spell’s story moments.',
      zh: '准备反应动作参考和角色标记，也可用牌面灵感构思法术带来的故事时刻。',
    },
  },
  'dnd-shortsword': {
    toolIds: ['weapon-creator', 'outfit-creator', 'token-maker', 'armor-creator'],
    descriptionByLocale: {
      en: 'Illustrate a shortsword user’s weapon and outfit, then make the character easy to spot on a VTT.',
      zh: '设计短剑使用者的武器与服装，再制作方便在 VTT 上辨认的头像。',
    },
  },
  'dnd-bless': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Prepare a Bless reference and character markers, then lay out the allies in a combat scene.',
      zh: '准备祝福术参考和角色标记，再安排战斗场景中的队友位置。',
    },
  },
  'rapier-dnd': {
    toolIds: ['weapon-creator', 'outfit-creator', 'token-maker', 'coat-of-arms-maker'],
    descriptionByLocale: {
      en: 'Pair a custom rapier with a fitting character look, portrait, and personal emblem.',
      zh: '为细剑搭配合适的角色造型、头像和个人徽记。',
    },
  },
  'dnd-ranger-spells': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'map-maker'],
    descriptionByLocale: {
      en: 'Keep a ranger’s spell choices beside a character token and a map of the next wilderness region.',
      zh: '把游侠法术选择、角色 Token 和下一段荒野区域地图一起准备好。',
    },
  },
  'dnd-mace': {
    toolIds: ['weapon-creator', 'armor-creator', 'outfit-creator', 'token-maker'],
    descriptionByLocale: {
      en: 'Design a mace and the armor, outfit, and character portrait that make its wielder recognizable.',
      zh: '设计钉头锤，并搭配能让使用者容易辨认的护甲、服装和角色头像。',
    },
  },
  'dnd-dwarf-names': {
    toolIds: ['family-tree-creator', 'token-maker', 'coat-of-arms-maker', 'language-generator'],
    descriptionByLocale: {
      en: 'After selecting a dwarf name from your chosen source, map the clan and build original family details.',
      zh: '按选定来源挑好矮人名字后，梳理氏族关系并补充原创家族细节。',
    },
  },
  'dnd-ghost': {
    toolIds: ['token-maker', 'map-maker', 'army-formation-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'Mark a haunted region on a world map, arrange encounter units and terrain, and keep the ghost token readable on the VTT.',
      zh: '在世界地图上标出闹鬼区域，安排遭遇单位与地形，并制作清楚可辨的幽灵 VTT 头像。',
    },
  },
  'dnd-demons': {
    toolIds: ['token-maker', 'map-maker', 'army-formation-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'Prepare distinct creature tokens, arrange battlefield units and terrain, and sketch the region on a world map.',
      zh: '准备容易区分的怪物 Token，安排战场单位与地形，再用世界地图描绘所在区域。',
    },
  },
  'dnd-bard-spells': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'tarot-cards'],
    descriptionByLocale: {
      en: 'Prepare spell notes and a bard token, then use card prompts to spark social or performance scenes.',
      zh: '准备法术笔记和吟游诗人头像，再用牌面灵感构思社交或表演场景。',
    },
  },
  'mephistopheles-dnd': {
    toolIds: ['notice-board-creator', 'token-maker', 'map-maker', 'tarot-cards'],
    descriptionByLocale: {
      en: 'Turn a pact hook into a notice and recognizable NPC portrait, then mark the meeting region on a world map.',
      zh: '把契约钩子整理成告示并制作醒目的 NPC 头像，再用世界地图标出会面区域。',
    },
  },
  'dnd-classes-explained': {
    toolIds: ['token-maker', 'coat-of-arms-maker', 'dice-roller', 'weapon-creator'],
    descriptionByLocale: {
      en: 'Bring your character to the table with a token, a coat of arms, dice, and a custom weapon.',
      zh: '选好职业后，制作角色 Token、设计纹章和武器，再为下一场游戏准备好骰子。',
    },
  },
  'dnd-hunters-mark': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Prepare Hunter’s Mark notes and a character token, then arrange units and terrain for the encounter.',
      zh: '准备猎人印记笔记与角色 Token，再用阵型工具安排遭遇中的单位与地形。',
    },
  },
  'dnd-necromancer-spells': {
    toolIds: ['token-maker', 'dice-roller', 'army-formation-creator', 'map-maker'],
    descriptionByLocale: {
      en: 'Give the necromancer and minions distinct tokens, arrange their encounter units and terrain, and sketch the wider region on a world map.',
      zh: '为死灵法师和随从制作不同 Token，安排遭遇单位与地形，再用世界地图描绘周边区域。',
    },
  },
  'dnd-mage-armor': {
    toolIds: ['dice-roller', 'scroll-creator', 'armor-creator', 'token-maker'],
    descriptionByLocale: {
      en: 'Keep your Mage Armor notes with a character portrait and an armor concept for the chosen caster.',
      zh: '把法师护甲笔记与施法者头像、选定的护甲造型一起整理好。',
    },
  },
  'dnd-giants': {
    toolIds: ['token-maker', 'map-maker', 'army-formation-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'Show giant scale clearly on the VTT, arrange battlefield units and terrain, and sketch the giants’ wider region on a world map.',
      zh: '在 VTT 上清楚呈现巨人体型，安排战场单位与地形，再用世界地图描绘巨人所在区域。',
    },
  },
  'dnd-counterspell': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Keep a Counterspell reference close and prepare the character markers and positions for the scene.',
      zh: '把反制法术参考放在手边，并准备场景中的角色标记与站位。',
    },
  },
  'dnd-dhampir': {
    toolIds: ['token-maker', 'family-tree-creator', 'coat-of-arms-maker', 'language-generator'],
    descriptionByLocale: {
      en: 'Shape a dhampir’s portrait and family ties, then add original details that support the roleplay concept.',
      zh: '设计半吸血裔头像与家族关系，再补充贴合角色扮演构想的原创细节。',
    },
  },
  'dnd-grung': {
    toolIds: ['token-maker', 'map-maker', 'family-tree-creator', 'coat-of-arms-maker'],
    descriptionByLocale: {
      en: 'Give a grung character a vivid portrait, a home region, and a few original community details.',
      zh: '为格鲁恩角色制作鲜明头像、家园区域和原创族群设定。',
    },
  },
  'dnd-classes-ranked': {
    toolIds: ['token-maker', 'weapon-creator', 'armor-creator', 'dice-roller'],
    descriptionByLocale: {
      en: 'After finding a class that fits your playstyle, sketch its look and the gear for a first character.',
      zh: '找到符合游玩风格的职业后，再构思首个角色的外观与装备。',
    },
  },
  'dnd-armor-guide': {
    toolIds: ['armor-creator', 'outfit-creator', 'token-maker', 'weapon-creator'],
    descriptionByLocale: {
      en: 'Explore a character’s armor and outfit visually, then pair the finished look with a weapon and token.',
      zh: '用视觉素材构思角色的护甲与服装，再搭配武器和头像。',
    },
  },
  'dnd-constitution-guide': {
    toolIds: ['dice-roller', 'armor-creator', 'token-maker', 'scroll-creator'],
    descriptionByLocale: {
      en: 'Keep concentration notes handy and prepare the character portrait and gear for the build you choose.',
      zh: '把专注判定笔记放在手边，并为选定的构筑准备角色头像与装备。',
    },
  },
  'dnd-druid-spells': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'map-maker'],
    descriptionByLocale: {
      en: 'Organize your selected druid spell notes and prepare a character token and wilderness-region map.',
      zh: '整理选定的德鲁伊法术笔记，并准备角色 Token 与荒野区域地图。',
    },
  },
  'dnd-ranger': {
    toolIds: ['token-maker', 'weapon-creator', 'outfit-creator', 'map-maker'],
    descriptionByLocale: {
      en: 'Bring a ranger build to the VTT with a distinct token, fitting gear, and a map for the first route.',
      zh: '用鲜明的 Token、合适的装备和首段旅程地图，把游侠构筑带上 VTT。',
    },
  },
  'dnd-campaigns': {
    toolIds: ['map-maker', 'town-creator', 'notice-board-creator', 'population-generator'],
    descriptionByLocale: {
      en: 'Once you choose a campaign, sketch its region, build a town, and prepare local notices and residents.',
      zh: '选定战役后，绘制区域地图、制作城镇，并准备当地告示与居民设定。',
    },
  },
  'dnd-wizard-spells': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'army-formation-creator'],
    descriptionByLocale: {
      en: 'Keep your selected spellbook notes separate and prepare the wizard portrait and encounter layout.',
      zh: '分开整理选定的法术书笔记，并准备法师头像与遭遇场景布局。',
    },
  },
  'dnd-schools-of-magic': {
    toolIds: ['scroll-creator', 'periodic-table-creator', 'token-maker', 'tarot-cards'],
    descriptionByLocale: {
      en: 'Make an in-world spell reference and original magical materials to support your school-themed notes.',
      zh: '制作世界内的法术参考和原创魔法材料，为学派主题笔记增添素材。',
    },
  },
  'dnd-warlock-spells': {
    toolIds: ['dice-roller', 'scroll-creator', 'token-maker', 'emblem-creator'],
    descriptionByLocale: {
      en: 'Keep your chosen pact spell notes together with a warlock portrait and an original pact emblem.',
      zh: '把选定的契术法术笔记与契术师头像、原创契约徽章一起准备好。',
    },
  },
} as const satisfies Record<string, BlogToolRecommendationConfig>;

export function getBlogToolRecommendations(
  locale: SiteLocale,
  slug: string,
): BlogToolRecommendations {
  if (!isSiteLocale(locale)) {
    throw new Error(`Unknown blog tool recommendation locale: ${JSON.stringify(locale)}.`);
  }

  if (
    typeof slug !== 'string' ||
    !Object.prototype.hasOwnProperty.call(BLOG_TOOL_RECOMMENDATIONS, slug)
  ) {
    throw new Error(`Unknown blog tool recommendation slug: ${JSON.stringify(slug)}.`);
  }

  const recommendation = BLOG_TOOL_RECOMMENDATIONS[slug as keyof typeof BLOG_TOOL_RECOMMENDATIONS];
  const { toolIds } = recommendation;
  if (!Array.isArray(toolIds) || toolIds.length !== 4) {
    throw new Error(
      `Invalid tool count for blog slug ${JSON.stringify(slug)}: expected 4, received ${Array.isArray(toolIds) ? toolIds.length : JSON.stringify(toolIds)}.`,
    );
  }

  const validToolIds = new Set<string>(getToolDirectoryLinks(locale).map((tool) => tool.id));
  const seenToolIds = new Set<string>();
  for (const toolId of toolIds) {
    if (typeof toolId !== 'string' || !validToolIds.has(toolId)) {
      throw new Error(
        `Invalid tool ID ${JSON.stringify(toolId)} configured for blog slug ${JSON.stringify(slug)}.`,
      );
    }

    if (seenToolIds.has(toolId)) {
      throw new Error(
        `Duplicate tool ID ${JSON.stringify(toolId)} configured for blog slug ${JSON.stringify(slug)}.`,
      );
    }

    seenToolIds.add(toolId);
  }

  const description = recommendation.descriptionByLocale[locale];
  if (typeof description !== 'string' || description.trim().length === 0) {
    throw new Error(
      `Missing blog tool recommendation description for locale ${JSON.stringify(locale)} and slug ${JSON.stringify(slug)}: ${JSON.stringify(description)}.`,
    );
  }

  return { description, toolIds };
}
