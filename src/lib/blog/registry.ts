import type { SiteLocale } from '@/lib/site-locale';
import {
  DND_CLASSES_COVER_PATH,
  DND_CLASSES_RANKED_COVER_PATH,
  DND_ARMOR_COVER_PATH,
  DND_CONSTITUTION_COVER_PATH,
  DND_DRUID_SPELLS_COVER_PATH,
  DND_DHAMPIR_COVER_PATH,
  DND_GRUNG_COVER_PATH,
  DND_COUNTERSPELL_COVER_PATH,
  DND_GIANTS_COVER_PATH,
  DND_MAGE_ARMOR_COVER_PATH,
  DND_NECROMANCER_SPELLS_COVER_PATH,
  DND_HUNTERS_MARK_COVER_PATH,
  DND_MEPHISTOPHELES_COVER_PATH,
  DND_BARD_SPELLS_COVER_PATH,
  DND_DEMONS_COVER_PATH,
  DND_DAGGER_COVER_PATH,
  DND_GHOST_COVER_PATH,
  DND_DWARF_NAMES_COVER_PATH,
  DND_GLAIVE_COVER_PATH,
  PALADIN_2024_SPELLS_DND_COVER_PATH,
  DND_HEX_COVER_PATH,
  DND_FIND_FAMILIAR_COVER_PATH,
  DND_THUNDERCLAP_COVER_PATH,
  DND_MACE_COVER_PATH,
  DND_BLESS_COVER_PATH,
  DND_RAPIER_COVER_PATH,
  DND_RANGER_SPELLS_COVER_PATH,
  DND_SHORTSWORD_COVER_PATH,
  DND_SILVERY_BARBS_COVER_PATH,
  DND_SWORD_SHEATHS_COVER_PATH,
  DND_5E_ARMORER_COVER_PATH,
  DND_DEATH_KNIGHT_COVER_PATH,
  DND_FLUMPH_COVER_PATH,
  DND_DWELF_COVER_PATH,
  FIREBOLT_DND_5E_COVER_PATH,
  SPECTATOR_DND_COVER_PATH,
  DND_QUARTERSTAFF_COVER_PATH,
  DND_MAUL_COVER_PATH,
  DND_GNOME_NAMES_COVER_PATH,
  DND_SHATTER_5E_COVER_PATH,
  DND_RACES_COVER_PATH,
  DND_ALIGNMENT_CHART_COVER_PATH,
  DND_ARTIFICER_COVER_PATH,
  DND_MEANING_COVER_PATH,
  DND_LANGUAGES_COVER_PATH,
  DND_STATS_COVER_PATH,
  DND_PALADIN_COVER_PATH,
  DND_FIGHTER_COVER_PATH,
  PLAYERS_HANDBOOK_DND_5E_COVER_PATH,
  DND_CHARACTER_SHEET_COVER_PATH,
  DND_CLASSES_COMPARISON_COVER_PATH,
} from '@/lib/blog-posts/shared';
import { dndClassesArticleHtml, dndClassesArticleHtmlZh } from '@/lib/blog-posts/dnd-classes-explained';
import { dndClassesRankedArticleHtml, dndClassesRankedArticleHtmlZh } from '@/lib/blog-posts/dnd-classes-ranked';
import { dndArmorArticleHtml, dndArmorArticleHtmlZh } from '@/lib/blog-posts/dnd-armor-guide';
import { dndConstitutionArticleHtml, dndConstitutionArticleHtmlZh } from '@/lib/blog-posts/dnd-constitution-guide';
import { dndDruidSpellsArticleHtml, dndDruidSpellsArticleHtmlZh } from '@/lib/blog-posts/dnd-druid-spells';
import { dndDhampirArticleHtml, dndDhampirArticleHtmlZh } from '@/lib/blog-posts/dnd-dhampir';
import { dndGrungArticleHtml, dndGrungArticleHtmlZh } from '@/lib/blog-posts/dnd-grung';
import { dndCounterspellArticleHtml, dndCounterspellArticleHtmlZh } from '@/lib/blog-posts/dnd-counterspell';
import { dndGiantsArticleHtml, dndGiantsArticleHtmlZh } from '@/lib/blog-posts/dnd-giants';
import { dndMageArmorArticleHtml, dndMageArmorArticleHtmlZh } from '@/lib/blog-posts/dnd-mage-armor';
import { dndNecromancerSpellsArticleHtml, dndNecromancerSpellsArticleHtmlZh } from '@/lib/blog-posts/dnd-necromancer-spells';
import { dndHuntersMarkArticleHtml, dndHuntersMarkArticleHtmlZh } from '@/lib/blog-posts/dnd-hunters-mark';
import { dndMephistophelesArticleHtml, dndMephistophelesArticleHtmlZh } from '@/lib/blog-posts/dnd-mephistopheles';
import { dndBardSpellsArticleHtml, dndBardSpellsArticleHtmlZh } from '@/lib/blog-posts/dnd-bard-spells';
import { dndDemonsArticleHtml, dndDemonsArticleHtmlZh } from '@/lib/blog-posts/dnd-demons';
import { dndDaggerArticleHtml, dndDaggerArticleHtmlZh } from '@/lib/blog-posts/dnd-dagger';
import { dndGhostArticleHtml, dndGhostArticleHtmlZh } from '@/lib/blog-posts/dnd-ghost';
import { dndDwarfNamesArticleHtml, dndDwarfNamesArticleHtmlZh } from '@/lib/blog-posts/dnd-dwarf-names';
import { dndGlaiveArticleHtml, dndGlaiveArticleHtmlZh } from '@/lib/blog-posts/dnd-glaive';
import { dndHexArticleHtml, dndHexArticleHtmlZh } from '@/lib/blog-posts/dnd-hex';
import {
  dndFindFamiliarArticleHtml,
  dndFindFamiliarArticleHtmlZh,
} from '@/lib/blog-posts/dnd-find-familiar';
import {
  dndThunderclapArticleHtml,
  dndThunderclapArticleHtmlZh,
} from '@/lib/blog-posts/dnd-thunderclap';
import {
  paladin2024SpellsDndArticleHtml,
  paladin2024SpellsDndArticleHtmlZh,
} from '@/lib/blog-posts/paladin-2024-spells-dnd';
import { dndMaceArticleHtml, dndMaceArticleHtmlZh } from '@/lib/blog-posts/dnd-mace';
import { dndRangerSpellsArticleHtml, dndRangerSpellsArticleHtmlZh } from '@/lib/blog-posts/dnd-ranger-spells';
import { dndBlessArticleHtml, dndBlessArticleHtmlZh } from '@/lib/blog-posts/dnd-bless';
import { rapierDndArticleHtml, rapierDndArticleHtmlZh } from '@/lib/blog-posts/rapier-dnd';
import { dndShortswordArticleHtml, dndShortswordArticleHtmlZh } from '@/lib/blog-posts/dnd-shortsword';
import {
  dndSilveryBarbsArticleHtml,
  dndSilveryBarbsArticleHtmlZh,
} from '@/lib/blog-posts/dnd-silvery-barbs';
import {
  dndSwordSheathsArticleHtml,
  dndSwordSheathsArticleHtmlZh,
} from '@/lib/blog-posts/dnd-sword-sheaths';
import {
  dnd5eArmorerArticleHtml,
  dnd5eArmorerArticleHtmlZh,
} from '@/lib/blog-posts/dnd-5e-armorer';
import {
  dndDeathKnightArticleHtml,
  dndDeathKnightArticleHtmlZh,
} from '@/lib/blog-posts/dnd-death-knight';
import { dndFlumphArticleHtml, dndFlumphArticleHtmlZh } from '@/lib/blog-posts/dnd-flumph';
import { dwelfDndArticleHtml, dwelfDndArticleHtmlZh } from '@/lib/blog-posts/dwelf-dnd';
import {
  fireboltDnd5eArticleHtml,
  fireboltDnd5eArticleHtmlZh,
} from '@/lib/blog-posts/firebolt-dnd-5e';
import { spectatorDndArticleHtml, spectatorDndArticleHtmlZh } from '@/lib/blog-posts/spectator-dnd';
import {
  dndQuarterstaffArticleHtml,
  dndQuarterstaffArticleHtmlZh,
} from '@/lib/blog-posts/dnd-quarterstaff';
import { dndMaulArticleHtml, dndMaulArticleHtmlZh } from '@/lib/blog-posts/dnd-maul';
import {
  dndGnomeNamesArticleHtml,
  dndGnomeNamesArticleHtmlZh,
} from '@/lib/blog-posts/dnd-gnome-names';
import {
  dndShatter5eArticleHtml,
  dndShatter5eArticleHtmlZh,
} from '@/lib/blog-posts/dnd-shatter-5e';
import {
  dndRacesArticleHtml,
  dndRacesArticleHtmlZh,
} from '@/lib/blog-posts/dnd-races';
import {
  dndAlignmentChartArticleHtml,
  dndAlignmentChartArticleHtmlZh,
} from '@/lib/blog-posts/dnd-alignment-chart';
import { dndMeaningArticleHtml, dndMeaningArticleHtmlZh } from '@/lib/blog-posts/dnd-meaning';
import { dndLanguagesArticleHtml, dndLanguagesArticleHtmlZh } from '@/lib/blog-posts/dnd-languages';
import { dndStatsArticleHtml, dndStatsArticleHtmlZh } from '@/lib/blog-posts/dnd-stats';
import { dndArtificerArticleHtml, dndArtificerArticleHtmlZh } from '@/lib/blog-posts/dnd-artificer';
import { dndPaladinArticleHtml, dndPaladinArticleHtmlZh } from '@/lib/blog-posts/dnd-paladin';
import { dndFighterArticleHtml, dndFighterArticleHtmlZh } from '@/lib/blog-posts/dnd-fighter';
import {
  playersHandbookDnd5eArticleHtml,
  playersHandbookDnd5eArticleHtmlZh,
} from '@/lib/blog-posts/players-handbook-dnd-5e';
import {
  dndCharacterSheetArticleHtml,
  dndCharacterSheetArticleHtmlZh,
} from '@/lib/blog-posts/dnd-character-sheet';
import {
  dndClassesComparisonArticleHtml,
  dndClassesComparisonArticleHtmlZh,
} from '@/lib/blog-posts/dnd-classes-comparison';
import type { BlogPost, PlaceholderCopy } from './types';
import { addHeadingAnchors } from './html-utils';

export const blogHubCopyByLocale = {
  en: {
    title: 'DnD Token Maker Guides, VTT Tools, and Tabletop Resources',
    description:
      'Read DnD Token Maker guides, VTT tool advice, tabletop resources, class explainers, and portrait workflow notes for Roll20 and Foundry VTT.',
  },
  zh: {
    title: 'DnD Token Maker 指南、VTT 工具与桌面跑团资源',
    description:
      '阅读 DnD Token Maker 指南、VTT 工具建议、桌面跑团资源、职业说明，以及适合 Roll20 与 Foundry VTT 的头像处理流程。',
  },
} as const;

const DND_CLASSES_UPDATED_AT = '2026-03-29';
const DND_CLASSES_RANKED_UPDATED_AT = '2026-03-29';
const BLOG_TOKEN_GUIDE_UPDATED_AT = '2026-03-27';
const BLOG_SMALL_PARTY_GUIDE_UPDATED_AT = '2026-03-25';
const DND_ARMOR_PUBLISHED_AT = '2026-04-06';
const DND_ARMOR_UPDATED_AT = '2026-05-07';
const DND_CONSTITUTION_UPDATED_AT = '2026-04-07';
const DND_DRUID_SPELLS_UPDATED_AT = '2026-05-04';
const DND_DHAMPIR_UPDATED_AT = '2026-04-17';
const DND_GRUNG_UPDATED_AT = '2026-04-20';
const DND_COUNTERSPELL_UPDATED_AT = '2026-04-25';
const DND_GIANTS_UPDATED_AT = '2026-04-28';
const DND_MAGE_ARMOR_UPDATED_AT = '2026-04-29';
const DND_NECROMANCER_SPELLS_UPDATED_AT = '2026-05-02';
const DND_HUNTERS_MARK_UPDATED_AT = '2026-05-02';
const DND_MEPHISTOPHELES_UPDATED_AT = '2026-05-05';
const DND_BARD_SPELLS_UPDATED_AT = '2026-05-06';
const DND_DEMONS_UPDATED_AT = '2026-05-07';
const DND_DAGGER_PUBLISHED_AT = '2026-05-09';
const DND_DAGGER_UPDATED_AT = '2026-07-28';
const DND_GHOST_UPDATED_AT = '2026-05-10';
const DND_DWARF_NAMES_UPDATED_AT = '2026-05-11';
const DND_GLAIVE_UPDATED_AT = '2026-07-14';
const PALADIN_2024_SPELLS_DND_UPDATED_AT = '2026-07-14';
const DND_HEX_UPDATED_AT = '2026-07-15';
const DND_FIND_FAMILIAR_UPDATED_AT = '2026-07-16';
const DND_THUNDERCLAP_UPDATED_AT = '2026-07-17';
const DND_SWORD_SHEATHS_UPDATED_AT = '2026-07-19';
const DND_5E_ARMORER_UPDATED_AT = '2026-07-20';
const DND_DEATH_KNIGHT_UPDATED_AT = '2026-07-22';
const DND_MACE_UPDATED_AT = '2026-05-12';
const DND_RANGER_SPELLS_UPDATED_AT = '2026-07-07';
const DND_RAPIER_UPDATED_AT = '2026-07-08';
const DND_BLESS_UPDATED_AT = '2026-07-09';
const DND_SHORTSWORD_UPDATED_AT = '2026-07-10';
const DND_SILVERY_BARBS_UPDATED_AT = '2026-07-11';
const DND_FLUMPH_UPDATED_AT = '2026-07-26';
const DWELF_DND_UPDATED_AT = '2026-07-27';
const FIREBOLT_DND_5E_UPDATED_AT = '2026-07-29';
const SPECTATOR_DND_UPDATED_AT = '2026-08-02';
const DND_QUARTERSTAFF_UPDATED_AT = '2026-08-03';
const DND_MAUL_UPDATED_AT = '2026-08-05';
const DND_GNOME_NAMES_UPDATED_AT = '2026-08-06';
const DND_SHATTER_5E_UPDATED_AT = '2026-08-08';
const DND_RACES_UPDATED_AT = '2026-08-10';
const DND_ALIGNMENT_CHART_UPDATED_AT = '2026-08-11';
const DND_MEANING_UPDATED_AT = '2026-08-12';
const DND_LANGUAGES_UPDATED_AT = '2026-08-14';
const DND_STATS_UPDATED_AT = '2026-08-15';
const DND_ARTIFICER_UPDATED_AT = '2026-08-17';
const DND_PALADIN_UPDATED_AT = '2026-08-18';
const PLAYERS_HANDBOOK_DND_5E_UPDATED_AT = '2026-08-19';
const DND_FIGHTER_UPDATED_AT = '2026-08-23';
const DND_CHARACTER_SHEET_UPDATED_AT = '2026-08-24';
const DND_CLASSES_COMPARISON_UPDATED_AT = '2026-08-25';

export const placeholderCopyByLocale: Record<SiteLocale, PlaceholderCopy> = {
  en: {
    featuredTitle: 'Featured Article Coming Soon',
    featuredExcerpt:
      'A new tabletop guide is being prepared for this spot.',
    coverLabel: 'Cover',
    detailTitle: 'Article coming soon',
    detailBody:
      'This guide is not ready yet. Check back later for the full article.',
    ctaTitle: 'Want to make your own tabletop portrait?',
    ctaBody:
      'Upload an image and turn it into a token for Roll20, Foundry, or any other virtual tabletop.',
  },
  zh: {
    featuredTitle: '新文章准备中',
    featuredExcerpt: '这篇桌面指南还在准备，后续会放在这里。',
    coverLabel: '封面',
    detailTitle: '文章准备中',
    detailBody:
      '这篇指南还没准备好，后续会补上完整正文。',
    ctaTitle: '如果你也想做自己的桌面头像',
    ctaBody: '这里可以直接把角色图处理成适合 Roll20、Foundry 或其他虚拟桌面的 Token。',
  },
};


const dndClassesComparisonArticle: BlogPost = {
  slug: 'dnd-classes-comparison',
  title: 'DND Classes Compared: All 13 by Party Job and First Combat Turn',
  seoTitle: 'DND Classes Compared: 13 Choices, First Combat Turn',
  metaDescription:
    'Compare all 13 DND classes by party job and first combat turn. Separate the 12 PHB classes from Artificer without a power ranking.',
  excerpt:
    'There are 12 classes in the 2024 Player\'s Handbook, or 13 with official Artificer. Compare them by party job and the first combat turn at level 1.',
  publishedAt: DND_CLASSES_COMPARISON_UPDATED_AT,
  updatedAt: DND_CLASSES_COMPARISON_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'Class Comparison',
  coverImage: DND_CLASSES_COMPARISON_COVER_PATH,
  coverAlt:
    'Five adventurers at a ruined chapel doorway on the first combat turn: a rogue at the wall, a fighter blocking a goblin, a cleric kneeling to heal, a wizard casting from a book, and an Artificer with a copper gauntlet standing apart, with circular VTT tokens and a blank character sheet on the table.',
  bodyHtml: dndClassesComparisonArticleHtml,
  faqItems: [
    {
      question: 'What are the 13 DND classes?',
      answer:
        'They are Artificer, Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, and Wizard. The 2024 Player\'s Handbook contains 12 of them. Artificer is the official thirteenth class and comes from Eberron material.',
    },
    {
      question: 'What are the 12 basic Dungeons &amp; Dragons classes?',
      answer:
        'The handbook roster is Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, and Wizard. Those class names are the same in the 2014 and 2024 Player\'s Handbooks, although many features changed between versions.',
    },
    {
      question: 'What are all the official DND classes?',
      answer:
        'The official fifth-edition core set contains those 13 classes. A DM may also allow playtest material such as Psion or third-party options such as Blood Hunter, but neither belongs to the official 13.',
    },
    {
      question: 'What are some cool DND classes?',
      answer:
        'Start with the fantasy you want to play on the first turn. Warlock brings the pact, Paladin the oath, and Bard the inspiration die. Monk fights unarmed. Druid gets the promise of Wild Shape, though that feature begins at level 2 in the 2024 rules. The coolest choice is the turn you are eager to take, not whichever name sits highest on someone else\'s tier list.',
    },
    {
      question: 'Do I need one of each DND class in the party?',
      answer:
        'No. A party needs its practical jobs covered, not one copy of every class. Several characters can share a job; the risk is leaving a job empty.',
    },
    {
      question: 'Which DND classes are easiest for a first character?',
      answer:
        'The official 2024 overview labels Fighter and Rogue Low complexity. Barbarian, Cleric, Paladin, Ranger, and Wizard are Average. Those are good places to start if you want fewer decisions on each turn. Fighter is the simplest class to lock in when you have no stronger preference.',
    },
    {
      question: 'When do I pick a subclass?',
      answer:
        'A 2024 character who starts at level 1 usually chooses a subclass upon reaching level 3, unless the class text on the sheet says otherwise. If the campaign begins at level 3 or above, the Free Basic Rules tell you to record the subclass during creation.',
    },
    {
      question: 'Is Artificer one of the DND classes in the 2024 Player\'s Handbook?',
      answer:
        'No. Artificer is an official class available on D&amp;D Beyond, but it is not one of the 12 classes in the 2024 Player\'s Handbook. Ask the DM whether <em>Eberron: Forge of the Artificer</em> is allowed in the campaign.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-classes-ranked', 'dnd-character-sheet', 'dnd-fighter'],
};

const dndClassesComparisonArticleZh: BlogPost = {
  slug: 'dnd-classes-comparison',
  title: 'DND职业有哪些：用队伍职责和第1回合对照全部13个官方职业',
  seoTitle: 'DND职业有哪些：5e官方13个职业对照第1回合动作，先分清2024手册12个与奇械师再写你的角色卡',
  metaDescription:
    '先回答DND职业有哪些：2024《玩家手册》12个，加上奇械师共13个官方职业。再按前排、恢复、技能、奥术四项职责和第1回合动作对照，写下职业名。这页不做强度排名，不把奇械师写进2024手册，写完职业再去做能看清的VTT Token，并在开团前写上你的角色卡。',
  excerpt:
    '先回答 DND职业有哪些：2024《玩家手册》12 个，加上奇械师共 13 个官方职业。按队伍职责和第 1 回合对照后写下职业名。',
  publishedAt: DND_CLASSES_COMPARISON_UPDATED_AT,
  updatedAt: DND_CLASSES_COMPARISON_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: '职业对照',
  coverImage: DND_CLASSES_COMPARISON_COVER_PATH,
  coverAlt:
    '五名冒险者在破败礼拜堂门口打第一回合：贴墙的游荡者、门口持盾挡住地精的战士、跪地治疗的牧师、翻书施法的法师，以及戴护目镜、铜臂甲、单独站开的奇械师；前景桌上是空白角色卡和圆形 VTT 代币。',
  bodyHtml: dndClassesComparisonArticleHtmlZh,
  faqItems: [
    {
      question: 'DND职业有哪些？',
      answer:
        '官方第五版共有 13 个核心职业：奇械师、野蛮人、吟游诗人、牧师、德鲁伊、战士、武僧、圣武士、游侠、游荡者、术士、契术师和法师。其中 12 个收入 2024《玩家手册》，奇械师是来自艾伯伦书目的官方第 13 个职业。',
    },
    {
      question: '12 个基础职业是哪些？',
      answer:
        '手册里的 12 个 <strong>DND 职业</strong> 是野蛮人、吟游诗人、牧师、德鲁伊、战士、武僧、圣武士、游侠、游荡者、术士、契术师和法师。2014 与 2024 的职业名单相同，但名单内的 1 级特性有不少变化。',
    },
    {
      question: '官方 DND 职业全部有哪些？',
      answer:
        '官方核心就是上面的 13 个。试玩中的灵能者和第三方血猎手可以在 DM 允许时加入游戏，但它们不属于官方 13 个职业。',
    },
    {
      question: '新手第一张卡写哪个？',
      answer:
        '2024 总览把战士和游荡者列为低复杂度，野蛮人、牧师、圣武士、游侠、法师列为中。想让第一张卡少一些回合决策，可以先从这些职业里选；如果没有特别偏好，战士最容易直接开玩。',
    },
    {
      question: '队伍必须每种职业都有吗？',
      answer:
        '不必。队伍需要的是四项职责都有人照看，不是每个职业各来一个。两名角色可以承担同一职责，真正麻烦的是整项职责没人管。',
    },
    {
      question: '子职业什么时候选？',
      answer:
        '按 2024 规则从 1 级开卡时，多数职业到 3 级才选择子职业，除非具体职业条目另有说明。如果战役直接从 3 级或更高开始，免费基础规则要求在创建角色时就写下子职业。',
    },
    {
      question: '奇械师算 2024《玩家手册》里的职业吗？',
      answer:
        '不算。奇械师是官方职业，也能在 D&amp;D Beyond 上创建，但它不在 2024《玩家手册》的 12 个职业之中。开卡前问清 DM 是否允许《Eberron: Forge of the Artificer》。',
    },
    {
      question: '术士和契术师谁是谁？',
      answer:
        'Sorcerer 是术士，力量来自天生魔法；Warlock 是契术师，力量来自契约。遇到把 Warlock 译成术士的中文资料时，先看英文名，再往角色卡上写。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-classes-ranked', 'dnd-character-sheet', 'dnd-fighter'],
};

const dndCharacterSheetArticle: BlogPost = {
  slug: 'dnd-character-sheet',
  title: 'Fill a DnD Character Sheet in Creation Order, Not Top Down',
  seoTitle: 'Fill a DnD Character Sheet in Creation Order, Not Top Down',
  metaDescription:
    'Start with class, origin, and ability scores, then complete combat and spell boxes so session one is not a scavenger hunt across empty fields.',
  excerpt:
    'Fill a 2024 character sheet in creation order: class, origin, scores, then AC, HP, attacks, and spells, with one finished level 1 Cleric as the example.',
  publishedAt: DND_CHARACTER_SHEET_UPDATED_AT,
  updatedAt: DND_CHARACTER_SHEET_UPDATED_AT,
  readTime: '14 min read',
  coverLabel: 'Character Sheet Guide',
  coverImage: DND_CHARACTER_SHEET_COVER_PATH,
  coverAlt:
    'A blank D&D character sheet beside a pencil, a twenty-sided die, and a circular portrait token',
  bodyHtml: dndCharacterSheetArticleHtml,
  faqItems: [
    {
      question: 'What is a D&amp;D character sheet?',
      answer:
        'A D&amp;D character sheet is the form that records one player character: name, class, origin, ability scores, modifiers, skills, combat numbers, features, equipment, and spells. The 2024 rules treat paper, a digital builder, or plain notes as a character sheet as long as the details are there during play.',
    },
    {
      question: 'Is there an official character sheet for Dungeons &amp; Dragons?',
      answer:
        'Yes. Wizards of the Coast and D&amp;D Beyond publish official PDFs. The 2014 sheet is a fillable three-page PDF. The 2024 sheet is a two-page print PDF. D&amp;D Beyond also hosts premade printable packets and a digital character builder.',
    },
    {
      question: 'How do you fill out a D&amp;D character sheet?',
      answer:
        'Use the creation order in the approved handbook. For 2024: choose a class, determine background and species, generate and assign ability scores, choose an alignment, then fill AC, HP, attacks, and spells from those choices. Do not start at the name field.',
    },
    {
      question: 'What is the difference between the 2014 and 2024 character sheets?',
      answer:
        'The 2024 sheet is two pages, leads with ability modifiers, groups skills with their abilities, replaces Race with Species, replaces Inspiration with Heroic Inspiration, and adds space for Weapon Mastery. The 2014 sheet is three pages and still uses the older labels.',
    },
    {
      question: 'What is the best D&amp;D character sheet?',
      answer:
        "The best sheet is the official form that matches the table's rules year, filled in so combat numbers are already totaled. After that, pick paper, a fillable 2014 PDF, a print 2024 PDF, or a digital VTT sheet based on how the group plays, not on a universal ranking.",
    },
    {
      question: 'Can I use a 2014 sheet in a 2024 game?',
      answer:
        'Yes, if you relabel Race as Species, track Heroic Inspiration, and write Weapon Mastery and Origin feats into leftover space. A first-time player should use the 2024 form instead of translating boxes mid-session.',
    },
    {
      question: 'Where do I download a fillable D&amp;D character sheet PDF?',
      answer:
        'The official 2014 sheet is fillable. Download it from Wizards of the Coast. The official 2024 sheet is a print PDF on D&amp;D Beyond. Fan-made fillable 2024 files exist; they are not official Wizards forms.',
    },
    {
      question: 'Do I need a digital character sheet for Roll20 or Foundry?',
      answer:
        'No. A paper sheet plus a map token is enough. Many online tables prefer the VTT\'s built-in sheet because it rolls attacks from the same window. Export a Token Maker PNG either way so the figure on the grid matches the person on the sheet.',
    },
  ],
  relatedSlugs: ['dnd-stats', 'players-handbook-dnd-5e', 'dnd-classes-explained', 'dnd-races'],
};

const dndCharacterSheetArticleZh: BlogPost = {
  slug: 'dnd-character-sheet',
  title: 'DND 角色卡：按创角顺序填写，不要从上往下填',
  seoTitle: 'DND 角色卡：按创角顺序填写，不要从上往下填',
  metaDescription:
    '先填职业、出身和属性值，再把护甲等级、生命值、先攻、攻击加值和法术栏算完。第一次开团就不用在空格子里到处找数字；2014 可填表和 2024 打印表要按桌面年份选对。',
  excerpt:
    '按 2024 创角顺序填角色卡：先职业、出身和属性，再算护甲等级、生命值、攻击和法术，并用一名 1 级人类侍僧牧师走完第一页。',
  publishedAt: DND_CHARACTER_SHEET_UPDATED_AT,
  updatedAt: DND_CHARACTER_SHEET_UPDATED_AT,
  readTime: '14 分钟阅读',
  coverLabel: '角色卡指南',
  coverImage: DND_CHARACTER_SHEET_COVER_PATH,
  coverAlt: '一张空白的龙与地下城角色卡，旁边放着铅笔、二十面骰和圆形肖像 Token',
  bodyHtml: dndCharacterSheetArticleHtmlZh,
  faqItems: [
    {
      question: '什么是 D&amp;D 角色卡？',
      answer:
        'D&amp;D 角色卡记录一名玩家角色：名字、职业、出身、属性值、调整值、技能、战斗数字、特性、装备和法术。2024 规则里，纸卡、电子构筑器或普通笔记都可以当角色卡，只要开局时这些细节在。',
    },
    {
      question: '龙与地下城有官方角色卡吗？',
      answer:
        '有。威世智和 D&amp;D Beyond 发布官方 PDF。2014 角色卡是三页可填 PDF。2024 角色卡是两页打印 PDF。D&amp;D Beyond 还有预制打印包和电子角色构筑器。',
    },
    {
      question: 'D&amp;D 角色卡怎么填？',
      answer:
        '按获准手册里的创角顺序。2024：先选职业，再定背景和物种，生成并分配属性值，选阵营，然后用这些选择填写护甲等级、生命值、攻击和法术。不要从名字栏开始。',
    },
    {
      question: '2014 和 2024 角色卡有什么区别？',
      answer:
        '2024 角色卡是两页，调整值放在显眼位置，技能跟对应属性放在一起，种族改成物种，激励改成英勇激励，并留了武器精通。2014 角色卡是三页，仍用旧标签。',
    },
    {
      question: '最好的 D&amp;D 角色卡是哪一种？',
      answer:
        '最好的是和桌子规则年份匹配的官方表格，并且战斗数字已经算完。然后按团怎么玩，在纸卡、2014 可填 PDF、2024 打印 PDF 或 VTT 电子卡之间选，而不是找一个通用第一名。',
    },
    {
      question: '2024 规则能用 2014 角色卡吗？',
      answer:
        '能，只要把种族改标成物种，追踪英勇激励，并把武器精通和出身专长写进空白处。第一次填卡的人应直接用 2024 表格，不要在开局过程中现场翻译格子。',
    },
    {
      question: '去哪里下载可填的 D&amp;D 角色卡 PDF？',
      answer:
        '官方 2014 角色卡可填，从威世智下载。官方 2024 角色卡是 D&amp;D Beyond 上的打印 PDF。民间有可填的 2024 文件，它们不是威世智官方表格。',
    },
    {
      question: '在 Roll20 或 Foundry 必须用电子角色卡吗？',
      answer:
        '不必。纸卡加地图 Token 就够。很多线上桌子更喜欢 VTT 自带角色卡，因为攻击可以从同一个窗口掷。无论用哪种卡，都导出一份 Token Maker 的 PNG，让格子上的人跟卡上的人是同一个。',
    },
  ],
  relatedSlugs: ['dnd-stats', 'players-handbook-dnd-5e', 'dnd-classes-explained', 'dnd-races'],
};

const dndFighterArticle: BlogPost = {
  slug: 'dnd-fighter',
  title: 'DnD Fighter Guide: Build a Level 1 Fighter and Plan Every Turn',
  seoTitle: 'DnD Fighter Guide: Strength or Dexterity? Choose First',
  metaDescription:
    'Compare Strength and Dexterity Fighter paths, pick armor and weapons that fit, and finish a focused 2024 character without splitting your best score.',
  excerpt:
    'Finish a level 1 Fighter with a clear ability, armor, weapon, Fighting Style, and Weapon Mastery plan, then take a clean first combat turn.',
  publishedAt: DND_FIGHTER_UPDATED_AT,
  updatedAt: DND_FIGHTER_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Fighter Guide',
  coverImage: DND_FIGHTER_COVER_PATH,
  coverAlt:
    'DnD Fighter guide cover showing an armored frontline warrior token, shield, sword, dice, and VTT grid markers on a tabletop map',
  bodyHtml: dndFighterArticleHtml,
  faqItems: [
    {
      question: 'Is Fighter a good class for a DnD beginner?',
      answer:
        "Yes. The Fighter's basic turn can stay direct: move, choose a target, and attack. Champion keeps later choices lighter, while Battle Master, Eldritch Knight, and Psi Warrior let a player add more tactical or magical complexity.",
    },
    {
      question: 'Should a Fighter use Strength or Dexterity?',
      answer:
        'Use Strength for heavy melee weapons, heavy armor, and Athletics. Use Dexterity for bows, Finesse weapons, Initiative, Dexterity skills, and light armor. Raise the ability that powers the attacks you plan to make most often.',
    },
    {
      question: 'What is the best Fighting Style for a Fighter?',
      answer:
        'There is no universal best choice. Archery supports ranged accuracy, Defense works with any armored setup, Dueling supports a one-handed weapon, and Protection supports an adjacent ally. Match the style to a job the character performs every round.',
    },
    {
      question: 'How many attacks does a Fighter get?',
      answer:
        'A Fighter normally makes one attack with the Attack action at levels 1-4, two at levels 5-10, three at levels 11-19, and four at level 20. Action Surge can provide another action, but it is a limited resource.',
    },
    {
      question: 'Can a DnD Fighter cast spells?',
      answer:
        'An Eldritch Knight can cast spells through its subclass features. Other Fighters can gain limited magic from feats or multiclassing. Under the 2024 rules, the extra action from Action Surge cannot be the Magic action.',
    },
    {
      question: 'What changed for Fighter in the 2024 rules?',
      answer:
        'The largest changes include Weapon Mastery, more uses for Second Wind, Tactical Mind, Tactical Shift, a stronger Indomitable, and Studied Attacks. Action Surge also gained a restriction that prevents its extra action from being the Magic action.',
    },
  ],
  relatedSlugs: ['dnd-stats', 'dnd-armor-guide', 'dnd-glaive', 'dnd-classes-explained'],
};

const dndFighterArticleZh: BlogPost = {
  slug: 'dnd-fighter',
  title: 'DND 战士指南：从 1 级建卡到每回合行动计划',
  seoTitle: 'DND 战士指南：力量还是敏捷？先把路线选对',
  metaDescription:
    '对比力量与敏捷战士的玩法，选择合适的护甲和武器，完成一套目标明确、不浪费主要属性的 2024 版角色配置。',
  excerpt:
    '按力量或敏捷路线完成 1 级战士的护甲、武器、战斗风格和武器精通配置，再用清楚的回合计划安排走位、攻击与第二风。',
  publishedAt: DND_FIGHTER_UPDATED_AT,
  updatedAt: DND_FIGHTER_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '战士指南',
  coverImage: DND_FIGHTER_COVER_PATH,
  coverAlt: 'DND 战士指南封面图：一名持盾持剑的前排战士 Token，周围有骰子与 VTT 网格标记',
  bodyHtml: dndFighterArticleHtmlZh,
  faqItems: [
    {
      question: 'DND 战士适合新手吗？',
      answer:
        '适合。战士的基础回合可以很直接：移动、选择目标、攻击。冠军让后续选择更轻量，战斗大师、奥法骑士和灵能战士则让玩家加入更多战术或魔法复杂度。',
    },
    {
      question: '战士该用力量还是敏捷？',
      answer:
        '重型近战武器、重甲和运动适合力量；弓、灵巧武器、先攻、敏捷技能和轻甲适合敏捷。提高你最常使用的攻击所依赖的属性。',
    },
    {
      question: '战士最好的战斗风格是什么？',
      answer:
        '没有放之四海皆准的最佳选择。箭术帮助远程命中，防御适合任何穿甲配置，决斗适合单手武器，保护则帮助相邻队友。让战斗风格匹配角色每回合都会履行的职责。',
    },
    {
      question: '战士能攻击几次？',
      answer:
        '战士在 1 至 4 级使用攻击动作时通常攻击一次，5 至 10 级两次，11 至 19 级三次，20 级四次。动作如潮可以提供另一个动作，但它是有限资源。',
    },
    {
      question: 'DND 战士能施法吗？',
      answer:
        '奥法骑士通过子职业能力施法。其他战士可以通过专长或多职业获得有限魔法。2024 规则下，动作如潮提供的额外动作不能执行魔法动作。',
    },
    {
      question: '2024 规则里的战士改了什么？',
      answer:
        '最大的变化包括武器精通、第二风的更多用途、战术思维、战术转移、更强的不屈和研习攻击。动作如潮也新增限制，额外动作不能执行魔法动作。',
    },
  ],
  relatedSlugs: ['dnd-stats', 'dnd-armor-guide', 'dnd-glaive', 'dnd-classes-explained'],
};

const dndClassesArticle: BlogPost = {
  slug: 'dnd-classes-explained',
  title: 'DND Classes Explained: How to Choose the Right Class in Dungeons & Dragons',
  seoTitle: 'DND Classes Explained: Best Beginner-Friendly Classes in Dungeons & Dragons',
  metaDescription:
    'Discover all DND classes explained in simple terms. Learn the differences between Dungeons & Dragons classes, which class is best for beginners, and how to choose the right one for your playstyle.',
  excerpt:
    'Discover all DND classes explained in simple terms, compare beginner-friendly options, and learn how to pick the right class for your playstyle.',
  updatedAt: DND_CLASSES_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'DND Classes',
  coverImage: DND_CLASSES_COVER_PATH,
  coverAlt: 'A Dungeons & Dragons party with different class archetypes exploring a dungeon',
  bodyHtml: dndClassesArticleHtml,
  relatedSlugs: ['dnd-classes-ranked', 'dnd-armor-guide'],
  featured: true,
};

const dndClassesArticleZh: BlogPost = {
  slug: 'dnd-classes-explained',
  title: 'DND 职业详解：如何在《龙与地下城》中选到适合你的职业',
  seoTitle: 'DND 职业详解：最适合新手的 Dungeons & Dragons 职业选择',
  metaDescription:
    '用简单直白的方式了解 DND 职业差异，看看哪些《龙与地下城》职业更适合新手，以及应该怎样根据自己的玩法偏好做选择。',
  excerpt:
    '从新手视角理解 DND 职业差异，快速判断哪些职业更容易上手，哪些职业更符合你的战斗风格与角色幻想。',
  updatedAt: DND_CLASSES_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: 'DND 职业',
  coverImage: DND_CLASSES_COVER_PATH,
  coverAlt: '一支由不同职业构成的龙与地下城冒险小队正在地城中探索',
  bodyHtml: dndClassesArticleHtmlZh,
  relatedSlugs: ['dnd-classes-ranked', 'dnd-armor-guide'],
  featured: true,
};

const dndArmorArticle: BlogPost = {
  slug: 'dnd-armor-guide',
  title: 'DND Armor 5e Guide: AC Table and Best Picks by Class',
  seoTitle: 'DND Armor 5e Guide: AC Table & Best Picks by Class',
  metaDescription:
    'Compare every DND 5e armor option in one AC table. See light, medium, heavy armor, shields, stealth penalties, Str requirements, and best picks by class.',
  excerpt:
    'Compare every DND 5e armor option in one AC table, then choose the best light, medium, heavy armor, shield, or Mage Armor setup for your class.',
  publishedAt: DND_ARMOR_PUBLISHED_AT,
  updatedAt: DND_ARMOR_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'DND Armor',
  coverImage: DND_ARMOR_COVER_PATH,
  coverAlt: 'A fantasy armory with leather, chain mail, shields, and polished plate armor arranged for DND armor choices',
  bodyHtml: dndArmorArticleHtml,
  faqItems: [
    {
      question: 'What is the best armor in DND 5e?',
      answer:
        'Plate armor is the best standard DND 5e armor by raw AC value. Combined with a shield, it gives AC 20 before magic items or spells.',
    },
    {
      question: 'Can you wear DND armor without proficiency?',
      answer:
        'Yes, but wearing armor without proficiency gives major penalties to Strength and Dexterity checks, saving throws, attacks, and spellcasting, so it is rarely worth doing.',
    },
    {
      question: 'Does Dexterity affect heavy armor AC?',
      answer:
        'No. Heavy armor uses a flat AC number. Dexterity does not increase or decrease your AC while wearing heavy armor.',
    },
    {
      question: 'What is the difference between light and medium armor in DND?',
      answer:
        'Light armor lets you add your full Dexterity modifier to AC. Medium armor has higher base AC but caps the Dexterity bonus at +2.',
    },
    {
      question: 'Does a shield count as armor in DND?',
      answer:
        'A shield appears in the armor table and requires shield proficiency, but it is usually treated as wielded gear rather than worn armor for features that say while not wearing armor.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-classes-ranked'],
};

const dndArmorArticleZh: BlogPost = {
  slug: 'dnd-armor-guide',
  title: 'DND 5e 护甲指南：AC 表格与各职业最佳选择',
  seoTitle: 'DND 5e 护甲指南：AC 表格、计算与职业推荐',
  metaDescription:
    '用一张 AC 表格对比所有 DND 5e 护甲：轻甲、中甲、重甲、盾牌、隐匿劣势、力量需求，以及各职业最佳护甲推荐。',
  excerpt:
    '用一张表对比所有 DND 5e 护甲的 AC、价格、重量、隐匿和力量需求，再按职业选择轻甲、中甲、重甲或法师护甲。',
  publishedAt: DND_ARMOR_PUBLISHED_AT,
  updatedAt: DND_ARMOR_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: 'DND 护甲',
  coverImage: DND_ARMOR_COVER_PATH,
  coverAlt: '奇幻军械库中陈列着皮甲、锁子甲、盾牌和板甲，用来展示 DND 护甲选择',
  bodyHtml: dndArmorArticleHtmlZh,
  faqItems: [
    {
      question: 'DND 5e 中最好的护甲是什么？',
      answer:
        '只看标准护甲的基础 AC，全身板甲是 DND 5e 中最好的护甲。配合盾牌可以达到 AC 20，还没有计算魔法物品或法术。',
    },
    {
      question: '没有熟练度可以穿 DND 护甲吗？',
      answer:
        '可以穿，但没有熟练度会让你在相关检定、豁免、攻击和施法上受到严重惩罚，实战中通常不值得。',
    },
    {
      question: '敏捷会影响重甲 AC 吗？',
      answer:
        '不会。DND 重甲使用固定 AC 数值，敏捷修正值不会增加或降低重甲提供的 AC。',
    },
    {
      question: 'DND 轻甲和中甲有什么区别？',
      answer:
        '轻甲允许加上完整敏捷修正值；中甲基础 AC 更高，但敏捷加值通常封顶为 +2。',
    },
    {
      question: '盾牌算护甲吗？',
      answer:
        '盾牌出现在护甲表中并需要盾牌熟练度，但对许多写着未穿戴护甲的能力来说，盾牌通常被当作手持装备，而不是穿在身上的护甲。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-classes-ranked'],
};

const dndClassesRankedArticle: BlogPost = {
  slug: 'dnd-classes-ranked',
  title: 'DnD Classes Ranked: The Best D&D Classes for Beginners, Power, and Fun',
  seoTitle: 'DnD Classes Ranked: Best D&D Classes for Beginners, Power, and Fun',
  metaDescription:
    'Looking for a simple DnD classes ranked guide? Here is an easy-to-read ranking of all 12 D&D classes based on power, versatility, beginner-friendliness, and overall fun.',
  excerpt:
    'An easy-to-read ranking of all 12 D&D classes, focused on power, versatility, beginner-friendliness, and how satisfying each class feels in real campaigns.',
  updatedAt: DND_CLASSES_RANKED_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Tier List',
  coverImage: DND_CLASSES_RANKED_COVER_PATH,
  coverAlt: 'A Dungeons & Dragons adventuring party with a paladin, mage, and rogue framed as a tier-list article cover',
  bodyHtml: dndClassesRankedArticleHtml,
  relatedSlugs: ['dnd-classes-explained', 'dnd-armor-guide'],
};

const dndClassesRankedArticleZh: BlogPost = {
  slug: 'dnd-classes-ranked',
  title: 'DND 职业排名：最适合新手、强度和乐趣都在线的 D&D 职业',
  seoTitle: 'DND 职业排名：最适合新手、强度和乐趣兼顾的 D&D 职业推荐',
  metaDescription:
    '想看一份简单直接的 DND 职业排名？这篇文章会从强度、泛用性、上手难度和实际乐趣出发，对全部 12 个 D&D 职业做清晰排序。',
  excerpt:
    '从强度、泛用性、新手友好度和实际游玩乐趣出发，快速看懂 12 个 D&D 职业谁更值得选，谁更适合你的第一张卡。',
  updatedAt: DND_CLASSES_RANKED_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '职业排名',
  coverImage: DND_CLASSES_RANKED_COVER_PATH,
  coverAlt: '一支由圣武士、施法者和潜行者组成的龙与地下城小队，被用作职业排名文章封面',
  bodyHtml: dndClassesRankedArticleHtmlZh,
  relatedSlugs: ['dnd-classes-explained', 'dnd-armor-guide'],
};

const dndTokenGuideArticle: BlogPost = {
  slug: 'how-to-build-a-dnd-character-token',
  title: 'How to Turn a DND Character Portrait into a Clean Virtual Tabletop Token',
  seoTitle: 'How to Make a Clean DND Character Token for Roll20 or Foundry',
  metaDescription:
    'Learn how to crop a DND character portrait into a clean virtual tabletop token with better framing, readable silhouettes, and export settings that work in Roll20 and Foundry.',
  excerpt:
    'A practical walkthrough for cropping character portraits, keeping silhouettes readable, and exporting a token that still looks sharp on crowded virtual tabletops.',
  updatedAt: BLOG_TOKEN_GUIDE_UPDATED_AT,
  readTime: '6 min read',
  coverLabel: 'Token Guide',
  placeholder: true,
};

const dndTokenGuideArticleZh: BlogPost = {
  slug: 'how-to-build-a-dnd-character-token',
  title: '如何把 DND 角色立绘做成干净好用的虚拟桌面 Token',
  seoTitle: '如何为 Roll20 或 Foundry 制作清晰的 DND 角色 Token',
  metaDescription:
    '了解如何把 DND 角色立绘裁成适合 Roll20 和 Foundry 的虚拟桌面 Token，包括取景、主体辨识度和导出设置。',
  excerpt:
    '从裁切构图、主体辨识度到导出细节，这篇文章会带你把角色立绘处理成在虚拟桌面里也足够清晰的 Token。',
  updatedAt: BLOG_TOKEN_GUIDE_UPDATED_AT,
  readTime: '6 分钟阅读',
  coverLabel: 'Token 指南',
  placeholder: true,
};

const dndSmallPartyGuideArticle: BlogPost = {
  slug: 'best-dnd-classes-for-small-parties',
  title: 'Best DND Classes for Small Parties and One-Shot Groups',
  seoTitle: 'Best DND Classes for Small Parties, One-Shots, and Short Campaigns',
  metaDescription:
    'Compare the best DND classes for small parties, one-shot groups, and short campaigns so you can cover missing roles without overcomplicating your first session.',
  excerpt:
    'If your table only has a few players, class choice matters more. This guide will compare which options cover the most gaps in small-party D&D.',
  updatedAt: BLOG_SMALL_PARTY_GUIDE_UPDATED_AT,
  readTime: '5 min read',
  coverLabel: 'Small Party',
  placeholder: true,
};

const dndSmallPartyGuideArticleZh: BlogPost = {
  slug: 'best-dnd-classes-for-small-parties',
  title: '小队人数不多时，哪些 DND 职业更适合开团',
  seoTitle: '小队和短团环境下更适合的 DND 职业选择',
  metaDescription:
    '如果你的桌面人数不多，职业选择会更影响体验。这篇文章会比较小队、短团和单次团里更容易补位的 DND 职业。',
  excerpt:
    '当队伍人数偏少时，职业不只是风格问题，还关系到补位效率。这篇文章会帮你快速判断哪些 DND 职业更稳。',
  updatedAt: BLOG_SMALL_PARTY_GUIDE_UPDATED_AT,
  readTime: '5 分钟阅读',
  coverLabel: '小队开团',
  placeholder: true,
};



const dndConstitutionArticle: BlogPost = {
  slug: 'dnd-constitution-guide',
  title: 'D&D Constitution Guide',
  seoTitle: 'D&D Constitution Guide: HP, Saves, and Concentration',
  metaDescription:
    'Learn how D&D Constitution affects hit points, saving throws, concentration checks, and survivability. Includes score tables, class tips, FAQ, and a dice roller link.',
  excerpt: 'Learn exactly how constitution impacts your hit points, concentration saves, and what races benefit the most in D&D 5e.',
  updatedAt: DND_CONSTITUTION_UPDATED_AT,
  readTime: '6 min read',
  coverLabel: 'Mechanics',
  coverImage: DND_CONSTITUTION_COVER_PATH,
  coverAlt: 'DND constitution guide cover showing a dwarf guardian raising a rune shield into toxic energy inside a stone chamber',
  bodyHtml: dndConstitutionArticleHtml,
};

const dndConstitutionArticleZh: BlogPost = {
  slug: 'dnd-constitution-guide',
  title: 'D&D Constitution 指南：生命值与专注判定的核心机制',
  seoTitle: 'D&D Constitution 指南：生命值与法术专注判定的核心机制',
  metaDescription: '在 D&D 中，Constitution 决定了你的角色能活多久。本文提供 dnd constitution 的实战数据、法术专注机制解析与种族选择推荐，并内置工具辅助检定。',
  excerpt: '本文提供 dnd constitution 的实战数据、专注机制解析与种族推荐，帮你避开致命车卡误区。',
  updatedAt: DND_CONSTITUTION_UPDATED_AT,
  readTime: '6 分钟阅读',
  coverLabel: '跑团机制',
  coverImage: DND_CONSTITUTION_COVER_PATH,
  coverAlt: 'dnd constitution 封面图，一名矮人守卫在符文石室里举盾抵挡毒性能量',
  bodyHtml: dndConstitutionArticleHtmlZh,
};



const dndDruidSpellsArticle: BlogPost = {
  slug: 'dnd-druid-spells',
  title: 'D&D Druid Spells Guide: Best Cantrips, Prepared Lists, and Circle Magic',
  seoTitle: 'DND Druid Spells Guide: Best 5e Spells, Cantrips, and Prepared Lists',
  metaDescription:
    'Complete DND druid spells guide for 5e with best cantrips, 1st-3rd level spell picks, concentration advice, prepared spell examples, Circle notes, traps, and FAQ.',
  excerpt:
    'A complete DND druid spells guide with best cantrips, 1st-3rd level picks, prepared spell examples, concentration traps, Circle notes, and FAQ.',
  updatedAt: DND_DRUID_SPELLS_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'Spells',
  coverImage: DND_DRUID_SPELLS_COVER_PATH,
  coverAlt: 'DND druid spells cover showing a druid channeling moonlit nature magic in an ancient forest clearing',
  bodyHtml: dndDruidSpellsArticleHtml,
  faqItems: [
    {
      question: 'What are the best DND druid spells for beginners?',
      answer:
        'The best beginner DND druid spells are Guidance, Thorn Whip, Goodberry, Entangle, Healing Word, Pass without Trace, Spike Growth, Plant Growth, Sleet Storm, and Dispel Magic because they cover utility, emergency healing, stealth, control, and anti-magic.',
    },
    {
      question: 'Can a Druid cast spells while in Wild Shape?',
      answer:
        'Normally, a Druid cannot cast new spells while in Wild Shape in 2014-style 5e play, but can maintain concentration on a spell cast before transforming. High-level features and different rules versions can change the details.',
    },
    {
      question: 'How many spells can a Druid prepare in DND 5e?',
      answer:
        'In common 2014 5e rules, a Druid prepares a number of spells equal to Druid level plus Wisdom modifier after a long rest. Cantrips are separate, and 2024 or homebrew rules may use different preparation progression.',
    },
    {
      question: 'Is Goodberry overpowered?',
      answer:
        'Goodberry is very efficient because one 1st-level slot creates predictable healing and food. It can feel overpowered if a table allows stockpiling before every long rest, so some DMs set a clear policy.',
    },
    {
      question: 'Is Conjure Animals still worth preparing?',
      answer:
        'Conjure Animals can be very strong in 2014 5e, but it can also slow the table down. Prepare it only after the DM confirms the active summoning rules, who chooses the beasts, and how fast their turns should run.',
    },
    {
      question: 'Should a Druid prepare healing or damage spells?',
      answer:
        'A Druid should usually prepare at least one emergency healing spell, often Healing Word, but should not build the whole list around healing. Control, stealth, and terrain spells often prevent more damage than direct healing restores.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-constitution-guide', 'dnd-counterspell'],
};

const dndDruidSpellsArticleZh: BlogPost = {
  slug: 'dnd-druid-spells',
  title: 'DND 德鲁伊法术 (Druid Spells) 指南：最佳戏法、准备列表与避坑',
  seoTitle: 'DND 德鲁伊法术指南：5e 最佳法术、戏法和每日准备列表',
  metaDescription:
    '完整 DND 德鲁伊法术指南，覆盖 5e 最佳戏法、1-3 环法术推荐、专注选择、每日准备列表、结社差异、陷阱法术和 FAQ。',
  excerpt:
    '完整 DND 德鲁伊法术指南：最佳戏法、1-3 环法术推荐、每日准备模板、专注陷阱、结社差异和 FAQ。',
  updatedAt: DND_DRUID_SPELLS_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: '百科',
  coverImage: DND_DRUID_SPELLS_COVER_PATH,
  coverAlt: 'DND 德鲁伊法术指南封面图，一名德鲁伊在古老森林空地中引导月光自然魔法',
  bodyHtml: dndDruidSpellsArticleHtmlZh,
  faqItems: [
    {
      question: '新手最好用的 DND 德鲁伊法术有哪些？',
      answer:
        '新手最值得优先看的 DND 德鲁伊法术是神导术、荆棘之鞭、神莓术、纠缠术、治愈真言、无踪步、荆棘丛生、植物滋长、雪雨暴和解除魔法，因为它们覆盖工具、救急治疗、潜行、控场和反魔法。',
    },
    {
      question: '德鲁伊可以在野兽形态下施法吗？',
      answer:
        '在常见 2014 风格 5e 规则下，德鲁伊通常不能在野兽形态里施放新的法术，但可以维持变形前已经施放的专注法术。高等级特性和不同规则版本可能改变细节。',
    },
    {
      question: 'DND 5e 德鲁伊能准备多少法术？',
      answer:
        '在常见 2014 版 5e 规则下，德鲁伊长休后可准备的法术数量等于德鲁伊等级加感知修正值，戏法另算。2024 规则或自定义规则可能使用不同准备进度。',
    },
    {
      question: '神莓术是否太强？',
      answer:
        '神莓术很强，因为 1 环法术位能换稳定治疗和食物。它在允许长休前囤神莓的桌上会显得过强，所以有些 DM 会提前定规则。',
    },
    {
      question: '召唤动物还值得准备吗？',
      answer:
        '在 2014 版 5e 中，召唤动物可以非常强，但也容易拖慢桌面节奏。只有当 DM 说清使用哪套召唤规则、谁选择野兽、召唤物回合必须多快跑完时，才适合作为核心法术。',
    },
    {
      question: '德鲁伊应该准备治疗法术还是伤害法术？',
      answer:
        '德鲁伊通常至少要准备一个救急治疗法术，常见选择是治愈真言，但不要把整张表都围绕治疗搭建。控场、潜行和地形法术经常能阻止比治疗更多的伤害。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-constitution-guide', 'dnd-counterspell'],
};



const dndDhampirArticle: BlogPost = {
  slug: 'dnd-dhampir',
  title: 'DND Dhampir Guide: Traits, Vampiric Bite, Best Classes, and Roleplay Tips',
  seoTitle: 'DND Dhampir Guide: Traits, Bite, and Best Builds in 5e',
  metaDescription:
    'Learn what a DND dhampir is, how Vampiric Bite works, which classes fit best, and how to roleplay the lineage without annoying your table.',
  excerpt:
    'A practical DND dhampir guide with quick trait summaries, bite strategy, best classes, roleplay tips, and FAQ answers for 5e players.',
  updatedAt: DND_DHAMPIR_UPDATED_AT,
  readTime: '9 min read',
  coverLabel: 'Lineage Guide',
  coverImage: DND_DHAMPIR_COVER_PATH,
  coverAlt: 'DND dhampir guide cover showing a moonlit half-vampire adventurer on a gothic castle terrace',
  bodyHtml: dndDhampirArticleHtml,
  relatedSlugs: ['dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndDhampirArticleZh: BlogPost = {
  slug: 'dnd-dhampir',
  title: 'DND Dhampir 指南：种族特性、咬击机制、最佳职业与跑团演法',
  seoTitle: 'DND Dhampir 指南：特性、咬击与最佳构筑',
  metaDescription:
    '想玩 DND Dhampir？这篇指南会讲清 Dhampir 强不强、Vampiric Bite 怎么用、哪些职业最适合，以及怎样把这个谱系演得有张力又不烦人。',
  excerpt:
    '想玩 DND Dhampir 但怕只剩吸血鬼噱头？这里先给速查结论，再讲咬击机制、职业搭配、角色演法和常见问题。',
  updatedAt: DND_DHAMPIR_UPDATED_AT,
  readTime: '9 分钟阅读',
  coverLabel: '种族百科',
  coverImage: DND_DHAMPIR_COVER_PATH,
  coverAlt: 'DND dhampir 指南封面图，月光下的半吸血鬼冒险者站在哥特城堡露台上',
  bodyHtml: dndDhampirArticleHtmlZh,
  relatedSlugs: ['dnd-classes-explained', 'dnd-constitution-guide'],
};


const dndGrungArticle: BlogPost = {
  slug: 'dnd-grung',
  title: 'DND Grung Guide: Traits, Best Classes, Poison Rules, and DM Tips',
  seoTitle: 'DND Grung Guide: Traits, Builds, Poison Rules, and DM Tips',
  metaDescription:
    'Learn what a DND grung is, how poison and water dependency work, which classes fit best, and what to ask your DM before playing one.',
  excerpt:
    'A practical DND grung guide with quick reference answers, trait breakdowns, DM approval tips, best classes, roleplay notes, and FAQ answers.',
  updatedAt: DND_GRUNG_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Race Guide',
  coverImage: DND_GRUNG_COVER_PATH,
  coverAlt: 'DND grung VTT token guide cover showing a poisonous frogfolk scout crouched on jungle ruins with a glowing green dart',
  bodyHtml: dndGrungArticleHtml,
  relatedSlugs: ['dnd-classes-explained', 'dnd-constitution-guide'],
};


const dndGrungArticleZh: BlogPost = {
  slug: 'dnd-grung',
  title: 'DND Grung 指南：特性、最佳职业、毒素规则与 DM 建议',
  seoTitle: 'DND Grung 指南：特性、构筑、毒素规则与 DM 建议',
  metaDescription:
    '想知道 dnd grung 到底值不值得玩？这篇指南会讲清 Grung 的官方出处、毒素和 Water Dependency 怎么算、哪些职业最适合，以及 DM 最在意什么。',
  excerpt:
    '想玩 DND Grung 前，先看清毒素、水依赖和 DM 顾虑怎么处理，再决定职业搭配与跑团演法。',
  updatedAt: DND_GRUNG_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '种族百科',
  coverImage: DND_GRUNG_COVER_PATH,
  coverAlt: 'DND grung VTT Token 指南封面图，一只带毒飞镖的蛙人侦察兵蹲伏在昏暗丛林遗迹上',
  bodyHtml: dndGrungArticleHtmlZh,
  relatedSlugs: ['dnd-classes-explained', 'dnd-constitution-guide'],
};



const dndCounterspellArticle: BlogPost = {
  slug: 'dnd-counterspell',
  title: 'DND Counterspell Guide: 2014/2024 Rules, Timing, and FAQ',
  seoTitle: 'DND Counterspell Guide: 2014/2024 Rules & FAQ',
  metaDescription:
    'Learn how dnd counterspell works in 2014 5e and the 2024 rules, when to cast it, how Counterspell chains work, and which table rulings prevent arguments.',
  excerpt:
    'A practical dnd counterspell encyclopedia guide covering 2014 and 2024 rules, timing, spell slot outcomes, common rulings, DM policy, and FAQ.',
  updatedAt: DND_COUNTERSPELL_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_COUNTERSPELL_COVER_PATH,
  coverAlt: 'DND counterspell guide cover showing two spellcasters clashing as a blue abjuration ward interrupts gold spell energy in a ruined stone chamber',
  bodyHtml: dndCounterspellArticleHtml,
  faqItems: [
    {
      question: 'What level is DND Counterspell?',
      answer:
        'DND Counterspell is a 3rd-level Abjuration spell. Sorcerers, Warlocks, and Wizards are the core classes that normally get access to it.',
    },
    {
      question: 'Can DND Counterspell stop any spell?',
      answer:
        'No. DND Counterspell only works when its trigger, range, and perception requirements are met. It cannot stop a spell that has already resolved or a magical effect that is not actually a spell being cast.',
    },
    {
      question: 'Does Counterspell waste the enemy spell slot?',
      answer:
        'It depends on the rules version. In 2014 5e, a successfully countered spell normally wastes the target spell slot. In the 2024 rules, the interrupted spell has no effect, but a spell slot used for it is not expended.',
    },
    {
      question: 'Can you Counterspell if you do not know the spell name?',
      answer:
        'Yes, if your table only requires seeing the casting trigger. Some DMs announce the exact spell before reactions and some only describe the casting, so the table should choose one policy before combat.',
    },
    {
      question: 'Is DND Counterspell overpowered?',
      answer:
        'Counterspell is powerful, but the table procedure matters more than the spell alone. The 2014 version can feel oppressive if every enemy caster has it, while the 2024 version is softer because it gives the target a save and preserves spell slots.',
    },
  ],
  relatedSlugs: ['dnd-druid-spells', 'dnd-constitution-guide', 'dnd-classes-explained'],
};

const dndCounterspellArticleZh: BlogPost = {
  slug: 'dnd-counterspell',
  title: 'dnd counterspell 指南：2014/2024 规则、时机与 FAQ',
  seoTitle: 'dnd counterspell 指南：2014/2024 规则与 FAQ',
  metaDescription:
    '这篇 dnd counterspell 百科指南会讲清 2014 版与 2024 版 Counterspell 差异、什么时候值得反制、反制链怎么裁定，以及 FAQ。',
  excerpt:
    'Counterspell 最怕桌上临时吵规则。这篇先给速查表，再讲 2014/2024 差异、反制时机、常见裁定和 DM 建议。',
  updatedAt: DND_COUNTERSPELL_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '法术百科',
  coverImage: DND_COUNTERSPELL_COVER_PATH,
  coverAlt: 'dnd counterspell 指南封面图，废弃石室中两名施法者对抗，蓝色防护结界正在打断金色法术能量',
  bodyHtml: dndCounterspellArticleHtmlZh,
  faqItems: [
    {
      question: 'DND Counterspell 是几环法术？',
      answer:
        'DND Counterspell 是 3 环 Abjuration 法术。Sorcerer、Warlock 和 Wizard 是通常能获得它的核心职业。',
    },
    {
      question: 'DND Counterspell 能反制所有法术吗？',
      answer:
        '不能。DND Counterspell 必须满足触发、距离和感知条件。已经生效的法术，或者并非正在施放的法术效果，都不是它的正常目标。',
    },
    {
      question: 'Counterspell 会浪费敌人的法术位吗？',
      answer:
        '取决于规则版本。2014 版 5e 中，被成功反制的法术通常会浪费目标法术位；2024 版中，法术无效，但如果该法术使用了法术位，该法术位不会被消耗。',
    },
    {
      question: '不知道对方具体法术名，也能 Counterspell 吗？',
      answer:
        '可以，只要你们桌只要求看见施法触发。有些 DM 会在反应前报法术名，有些只描述施法动作，所以最好在战斗前统一规则。',
    },
    {
      question: 'DND Counterspell 超模吗？',
      answer:
        'Counterspell 很强，但真正影响体验的是桌面流程。2014 版如果给太多敌方法师使用，会很压迫；2024 版因为给目标豁免且保留法术位，压力会小很多。',
    },
  ],
  relatedSlugs: ['dnd-druid-spells', 'dnd-constitution-guide', 'dnd-classes-explained'],
};

const dndGiantsArticle: BlogPost = {
  slug: 'dnd-giants',
  title: 'DND Giants Guide: Types, Lore, Encounter Tips, and VTT Tokens',
  seoTitle: 'DND Giants Guide: Types, Lore, Encounters & Tokens',
  metaDescription:
    'Learn the main DND giants, how each giant type plays at the table, how to design better giant encounters, and how to make readable VTT tokens.',
  excerpt:
    'A practical dnd giants encyclopedia guide with a quick type table, lore notes, encounter design advice, VTT token tips, and FAQ answers.',
  updatedAt: DND_GIANTS_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Monster Guide',
  coverImage: DND_GIANTS_COVER_PATH,
  coverAlt:
    'DND giants guide cover showing frost, fire, hill, cloud, and storm giants looming over tiny adventurers in a mountain pass',
  bodyHtml: dndGiantsArticleHtml,
  faqItems: [
    {
      question: 'What are the main DND giants?',
      answer:
        'The main DND giants most players recognize are hill giants, stone giants, frost giants, fire giants, cloud giants, and storm giants.',
    },
    {
      question: 'Are DND giants humanoids?',
      answer:
        'In 5e, many classic DND giants use the giant creature type rather than ordinary humanoid. Always check the exact stat block your table is using.',
    },
    {
      question: 'Which DND giant is best for a first giant encounter?',
      answer:
        'A hill giant is usually the easiest first choice because its threat is clear and its tactics are simple. A stone giant is better if you want a more tactical terrain fight.',
    },
    {
      question: 'How do you make DND giants feel bigger in combat?',
      answer:
        'Use scale cues, vertical terrain, thrown objects, destructible cover, and objectives beyond damage. A giant should change the room, not just occupy more squares.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-counterspell', 'dnd-constitution-guide'],
};

const dndGiantsArticleZh: BlogPost = {
  slug: 'dnd-giants',
  title: 'DND Giants 指南：巨人类型、设定、遭遇设计与 VTT Token',
  seoTitle: 'DND Giants 指南：类型、设定、遭遇与 Token',
  metaDescription:
    '想了解 dnd giants 有哪些类型、每种巨人怎么跑、如何设计更有压迫感的巨人遭遇，以及怎样制作清晰的 VTT Token？这篇直接给你速查和实战建议。',
  excerpt:
    '想把 DND 巨人跑得有压迫感而不是单纯磨血？这里整理巨人类型、设定用法、遭遇设计和 VTT Token 建议。',
  updatedAt: DND_GIANTS_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '怪物百科',
  coverImage: DND_GIANTS_COVER_PATH,
  coverAlt:
    'DND giants 指南封面图，霜巨人、火巨人、丘陵巨人、云巨人和风暴巨人在山道中俯视小型冒险者',
  bodyHtml: dndGiantsArticleHtmlZh,
  faqItems: [
    {
      question: 'DND giants 主要有哪些？',
      answer:
        '最常见的 DND giants 包括 hill giant、stone giant、frost giant、fire giant、cloud giant 和 storm giant。',
    },
    {
      question: 'DND giants 算 humanoid 吗？',
      answer:
        '在 5e 中，许多经典 DND giants 使用的是 giant 类型，而不是普通 humanoid。具体仍要看你桌使用的 stat block。',
    },
    {
      question: '第一次巨人遭遇用哪种 DND giant 最好？',
      answer:
        'Hill giant 通常最适合作为第一次巨人遭遇，因为威胁清晰、跑法简单。如果你想要更强的地形战术感，stone giant 更合适。',
    },
    {
      question: '怎样让 DND giants 在战斗里更有巨大感？',
      answer:
        '使用尺度参照、立体地形、投掷物、可破坏掩体和非伤害目标。巨人应该改变房间，而不是只占更多格子。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-counterspell', 'dnd-constitution-guide'],
};

const dndMageArmorArticle: BlogPost = {
  slug: 'dnd-mage-armor',
  title: 'DND Mage Armor Guide: AC Rules, Best Uses, and Common Rulings',
  seoTitle: 'DND Mage Armor Guide: AC, Rules, Best Uses',
  metaDescription:
    'Learn how dnd mage armor works, how to calculate AC, what it stacks with, who should use it, and the overlooked touch-target trick many players miss.',
  excerpt:
    'A practical dnd mage armor guide covering AC math, 2014/2024 rules, stacking rulings, best users, VTT token tips, and FAQ.',
  updatedAt: DND_MAGE_ARMOR_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_MAGE_ARMOR_COVER_PATH,
  coverAlt:
    'DND mage armor guide cover showing a robed spellcaster protected by glowing blue spectral armor inside a stone dungeon study',
  bodyHtml: dndMageArmorArticleHtml,
  faqItems: [
    {
      question: 'Is Mage Armor concentration?',
      answer:
        'No. Mage Armor is not concentration, so you can maintain another concentration spell while Mage Armor stays active for its 8-hour duration.',
    },
    {
      question: 'Can you cast Mage Armor on someone else?',
      answer:
        'Yes. Mage Armor has a range of Touch and targets a willing creature who is not wearing armor, so it can be cast on another eligible creature.',
    },
    {
      question: 'Does Mage Armor stack with Unarmored Defense?',
      answer:
        'No. Mage Armor and Unarmored Defense are different base AC calculations. You choose which calculation to use; you do not combine them.',
    },
    {
      question: 'Does Mage Armor work with a shield?',
      answer:
        'Under the 2014 Sage Advice ruling, yes. Mage Armor works with a shield because the shield is wielded rather than worn armor. For strict 2024 tables, confirm the shield ruling with your DM before relying on it.',
    },
    {
      question: 'Is Mage Armor worth it at higher levels?',
      answer:
        'It depends on your build. Mage Armor remains useful for unarmored high-Dex casters, but it becomes easier to replace with armor proficiency, magic items, subclass features, or better positioning.',
    },
  ],
  relatedSlugs: ['dnd-armor-guide', 'dnd-counterspell', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndMageArmorArticleZh: BlogPost = {
  slug: 'dnd-mage-armor',
  title: 'dnd mage armor 指南：AC 规则、最佳用法与常见裁定',
  seoTitle: 'dnd mage armor 指南：AC 规则、叠加与最佳用法',
  metaDescription:
    '这篇 dnd mage armor 指南会讲清 AC 怎么算、能和什么叠加、谁最适合使用，以及很多玩家会忽略的 Touch 目标技巧。',
  excerpt:
    '一篇实用 dnd mage armor 法术百科，覆盖 AC 计算、2014/2024 规则、叠加裁定、适用角色、VTT Token 建议和 FAQ。',
  updatedAt: DND_MAGE_ARMOR_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '法术百科',
  coverImage: DND_MAGE_ARMOR_COVER_PATH,
  coverAlt:
    'dnd mage armor 指南封面图，石质地城书房里一名长袍施法者被蓝色幽灵护甲保护',
  bodyHtml: dndMageArmorArticleHtmlZh,
  faqItems: [
    {
      question: 'Mage Armor 需要 Concentration 吗？',
      answer:
        '不需要。Mage Armor 不是 Concentration 法术，所以它持续期间，你仍然可以维持另一个专注法术。',
    },
    {
      question: 'Mage Armor 能给别人施放吗？',
      answer:
        '可以。Mage Armor 的距离是 Touch，目标是一个自愿且未穿护甲的生物，所以可以给符合条件的其他生物施放。',
    },
    {
      question: 'Mage Armor 能和 Unarmored Defense 叠加吗？',
      answer:
        '不能。Mage Armor 和 Unarmored Defense 是两套不同的基础 AC 计算方式。你选择其中一种使用，不能把公式加在一起。',
    },
    {
      question: 'Mage Armor 可以和 shield 一起用吗？',
      answer:
        '按 2014 Sage Advice 裁定，可以。Mage Armor 可以和 shield 一起用，因为 shield 是被 wield，而不是 worn armor。严格 2024 桌最好先问 DM。',
    },
    {
      question: '高等级还值得用 Mage Armor 吗？',
      answer:
        '看构筑。对高 Dex 无甲施法者仍然有价值，但高等级后更容易被护甲熟练、魔法物品、子职业特性或更好的站位替代。',
    },
  ],
  relatedSlugs: ['dnd-armor-guide', 'dnd-counterspell', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndHuntersMarkArticle: BlogPost = {
  slug: 'dnd-hunters-mark',
  title: "dnd hunter's mark Guide: 2024/2014 Rules, Damage, and VTT Tips",
  seoTitle: "dnd hunter's mark Guide: 2024 Rules, Damage & FAQ",
  metaDescription:
    "Learn dnd hunter's mark fast: 2024 and 2014 rules, concentration, damage, bonus action timing, table rulings, VTT token tracking, and FAQ.",
  excerpt:
    "A practical dnd hunter's mark spell guide covering 2024/2014 rules, damage triggers, concentration tradeoffs, common rulings, VTT token tracking, and FAQ.",
  updatedAt: DND_HUNTERS_MARK_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_HUNTERS_MARK_COVER_PATH,
  coverAlt:
    "dnd hunter's mark guide cover showing a hooded Ranger aiming at a monster marked by a glowing quarry sigil on a moonlit battle map",
  bodyHtml: dndHuntersMarkArticleHtml,
  faqItems: [
    {
      question: "Is Hunter's Mark concentration?",
      answer:
        "Yes. Hunter's Mark requires concentration for up to 1 hour, unless a specific feature changes how concentration works for that spell.",
    },
    {
      question: "Does Hunter's Mark trigger on every hit?",
      answer:
        "Hunter's Mark works on every hit that matches the trigger. In 2014, that means weapon attacks. In 2024, it means hits with attack rolls.",
    },
    {
      question: "Can you move Hunter's Mark after the target drops to 0 HP?",
      answer:
        'Yes. If the marked target drops to 0 HP before the spell ends, you can spend a Bonus Action to move the mark to a new visible creature within range.',
    },
    {
      question: "Does Hunter's Mark reveal the target?",
      answer:
        "No. Hunter's Mark gives Advantage on checks to find the marked creature, but it does not automatically reveal an invisible or hidden target.",
    },
    {
      question: "Is upcasting Hunter's Mark worth it?",
      answer:
        "Usually only when the extended duration matters across multiple scenes. Upcasting Hunter's Mark extends concentration duration; it does not increase the 1d6 damage die.",
    },
  ],
  relatedSlugs: ['dnd-constitution-guide', 'dnd-classes-explained', 'dnd-mage-armor', 'dnd-counterspell'],
};

const dndHuntersMarkArticleZh: BlogPost = {
  slug: 'dnd-hunters-mark',
  title: "dnd hunter's mark 指南：2024/2014 规则、伤害与 VTT Token",
  seoTitle: "dnd hunter's mark 指南：2024/2014 规则与 FAQ",
  metaDescription:
    "这篇 dnd hunter's mark 指南快速讲清 2024/2014 规则差异、伤害、专注、附赠动作、常见裁定与 VTT Token 标记建议。",
  excerpt:
    "一篇实用 dnd hunter's mark 法术百科，覆盖 2024/2014 规则、伤害触发、专注取舍、常见裁定、VTT Token 标记和 FAQ。",
  updatedAt: DND_HUNTERS_MARK_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '法术百科',
  coverImage: DND_HUNTERS_MARK_COVER_PATH,
  coverAlt:
    "dnd hunter's mark 指南封面图，月夜战斗地图上一名 Ranger 瞄准带有发光 quarry 标记的怪物",
  bodyHtml: dndHuntersMarkArticleHtmlZh,
  faqItems: [
    {
      question: "Hunter's Mark 需要 Concentration 吗？",
      answer:
        "需要。Hunter's Mark 是专注法术，最多持续 1 小时，除非某个明确特性改变它的专注规则。",
    },
    {
      question: "Hunter's Mark 每次命中都能加伤害吗？",
      answer:
        "它会在每次符合触发条件的命中上加伤害。2014 版是 weapon attack；2024 版是 attack roll 命中。",
    },
    {
      question: "目标降到 0 HP 后能转移 Hunter's Mark 吗？",
      answer:
        '可以。被标记目标在法术结束前降到 0 HP 后，你可以花 Bonus Action，把标记转移到距离内另一个你能看见的生物。',
    },
    {
      question: "Hunter's Mark 会暴露目标位置吗？",
      answer:
        "不会。Hunter's Mark 只让你寻找目标的检定有 Advantage，不会自动让隐形或隐藏目标显形。",
    },
    {
      question: "Hunter's Mark 升环值得吗？",
      answer:
        "通常只有你真的需要跨多个场景维持时才值得。Hunter's Mark 升环延长专注时长，但不会提高 1d6 伤害。",
    },
  ],
  relatedSlugs: ['dnd-constitution-guide', 'dnd-classes-explained', 'dnd-mage-armor', 'dnd-counterspell'],
};

const dndNecromancerSpellsArticle: BlogPost = {
  slug: 'dnd-necromancer-spells',
  title: 'dnd necromancer spells: Best 5e Spell List, Animate Dead, and Minion Tips',
  seoTitle: 'dnd necromancer spells: Best 5e Spell List',
  metaDescription:
    'Full dnd necromancer spells guide with a level-by-level necromancy spell list, Animate Dead rules, skeleton vs zombie tips, FAQ, and video.',
  excerpt:
    'A practical dnd necromancer spells guide with a level-by-level spell list, Animate Dead rules, skeleton vs zombie advice, Necromancer Wizard loadouts, FAQ, and video.',
  updatedAt: DND_NECROMANCER_SPELLS_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_NECROMANCER_SPELLS_COVER_PATH,
  coverAlt:
    'dnd necromancer spells guide cover showing a necromancer commanding skeleton archers and a zombie beside Animate Dead notes and spell cards',
  bodyHtml: dndNecromancerSpellsArticleHtml,
  faqItems: [
    {
      question: 'What is the best dnd necromancer spell?',
      answer:
        'The best dnd necromancer spell is Animate Dead if you want the classic undead-minion playstyle. For non-minion value, Blindness/Deafness and Speak with Dead are often cleaner at the table.',
    },
    {
      question: 'What level can a necromancer cast Animate Dead?',
      answer:
        'A necromancer can usually cast Animate Dead at character level 5 if they are a full caster such as a Wizard or Cleric with access to 3rd-level spells. Exact access still depends on your class, subclass, and source rules.',
    },
    {
      question: 'How many undead can Animate Dead control?',
      answer:
        'At 3rd level, Animate Dead creates one skeleton or zombie, or reasserts control over up to four undead you previously animated. Each slot level above 3 adds two more undead to the animate or reassert-control limit.',
    },
    {
      question: 'Can a Wizard be a necromancer in DND 5e?',
      answer:
        'Yes. A Wizard can play the necromancer role, and the School of Necromancy subclass is the most obvious route in 2014-style 5e games. Clerics can also use several key necromancy spells.',
    },
    {
      question: 'Does Animate Dead require concentration?',
      answer:
        'No. Animate Dead does not require concentration. The important limit is the 24-hour control duration, which you maintain by recasting the spell before control expires.',
    },
    {
      question: 'Are skeletons better than zombies in DND?',
      answer:
        'Skeletons are usually better for ranged damage and clean turns. Zombies are better as blockers or horror props because they are tougher but slower and less accurate.',
    },
    {
      question: 'Is necromancy evil in DND?',
      answer:
        'Not automatically by rules, but many DND worlds treat undead creation as taboo or evil. Ask your DM before making Animate Dead a public-facing part of your character.',
    },
  ],
  relatedSlugs: ['dnd-counterspell', 'dnd-mage-armor', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndNecromancerSpellsArticleZh: BlogPost = {
  slug: 'dnd-necromancer-spells',
  title: 'dnd necromancer spells 指南：死灵法术清单、Animate Dead 与亡灵小队',
  seoTitle: 'dnd necromancer spells 指南：死灵法术清单',
  metaDescription:
    '这篇 dnd necromancer spells 指南整理按环级死灵法术清单、Animate Dead 规则、Skeleton vs Zombie 和 FAQ。',
  excerpt:
    '一篇实用 dnd necromancer spells 法术百科，覆盖按环级法术清单、Animate Dead 规则、骷髅与僵尸选择、FAQ 和视频。',
  updatedAt: DND_NECROMANCER_SPELLS_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: '法术百科',
  coverImage: DND_NECROMANCER_SPELLS_COVER_PATH,
  coverAlt:
    'dnd necromancer spells 指南封面图，死灵法师在 Animate Dead 笔记和法术卡旁指挥 skeleton 弓手与 zombie',
  bodyHtml: dndNecromancerSpellsArticleHtmlZh,
  faqItems: [
    {
      question: '最好的 dnd necromancer spell 是哪个？',
      answer:
        '最经典也最核心的是 Animate Dead，尤其当你想玩亡灵小队路线时。如果不想管理小兵，Blindness/Deafness 和 Speak with Dead 往往更干净。',
    },
    {
      question: 'Necromancer 几级可以施放 Animate Dead？',
      answer:
        '通常来说，如果你是 Wizard 或 Cleric 这类能获得 3 环法术的 full caster，角色 5 级就可以施放 Animate Dead。具体仍要看你的职业、子职业和你们桌允许的规则来源。',
    },
    {
      question: 'Animate Dead 可以控制多少个 undead？',
      answer:
        '3 环施放时，Animate Dead 可以创造 1 个 skeleton 或 zombie，或者重新控制最多 4 个你之前用此法术创造的 undead。3 环以上每升 1 环，创造或重新控制的上限再增加 2 个。',
    },
    {
      question: 'Wizard 可以在 DND 5e 里玩 necromancer 吗？',
      answer:
        '可以。Wizard 是最常见的 necromancer 路线，2014 风格 5e 里 School of Necromancy 子职业尤其直观。Cleric 也能使用不少关键 necromancy spells。',
    },
    {
      question: 'Animate Dead 需要 Concentration 吗？',
      answer:
        '不需要。Animate Dead 不吃 Concentration。真正要管理的是 24 小时控制时限，你需要在控制结束前重施法来维持命令权。',
    },
    {
      question: 'Skeleton 比 Zombie 更好吗？',
      answer:
        '多数情况下，skeleton 更适合远程输出和快速结算；zombie 更适合堵门、吃伤害和营造恐怖感，因为它更慢、命中也更差。',
    },
    {
      question: 'DND 里的 necromancy 一定是邪恶的吗？',
      answer:
        '规则上不一定自动邪恶，但很多 DND 世界会把创造亡灵视为禁忌或邪恶行为。想公开使用 Animate Dead 前，先和 DM 对齐世界观。',
    },
  ],
  relatedSlugs: ['dnd-counterspell', 'dnd-mage-armor', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndMephistophelesArticle: BlogPost = {
  slug: 'mephistopheles-dnd',
  title: "mephistopheles dnd: Cania's Archdevil, Pact Traps, and DM Hooks",
  seoTitle: 'mephistopheles dnd: Cania, Pacts & DM Hooks',
  metaDescription:
    'Learn mephistopheles dnd fast: who the archdevil is, how Cania and hellfire shape his lore, how to use him as a patron or villain, and when not to run him as a stat block.',
  excerpt:
    'A practical mephistopheles dnd encyclopedia guide covering Cania lore, archdevil identity, Warlock and tiefling hooks, DM encounter use, FAQ, and a companion lore video.',
  updatedAt: DND_MEPHISTOPHELES_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Archdevil Guide',
  coverImage: DND_MEPHISTOPHELES_COVER_PATH,
  coverAlt:
    'mephistopheles dnd guide cover showing an icy infernal contract tabletop with dice, frost, hellfire, and a sealed bargain',
  bodyHtml: dndMephistophelesArticleHtml,
  faqItems: [
    {
      question: 'Who is Mephistopheles in DND?',
      answer:
        'Mephistopheles is an archdevil connected to Cania, the Nine Hells, arcane ambition, and hellfire. Use him as a patron or endgame threat, not as a casual monster encounter.',
    },
    {
      question: 'Is Mephistopheles a god in D&D?',
      answer:
        'Mephistopheles is usually treated as an archdevil rather than a normal god. For campaign purposes, that still makes him powerful enough to shape plots through contracts, cults, and infernal magic.',
    },
    {
      question: 'Can a Warlock have Mephistopheles as a patron?',
      answer:
        'Yes. A Fiend Warlock can use Mephistopheles as patron flavor if the DM agrees. Intermediaries and written obligations keep the pact playable.',
    },
    {
      question: 'What layer of Hell is Mephistopheles tied to?',
      answer:
        'Mephistopheles is tied to Cania, commonly presented as the icy eighth layer of the Nine Hells.',
    },
    {
      question: 'Is Mephistopheles good for a beginner campaign?',
      answer:
        'Not as the main villain. For beginners, use one agent, one simple bargain, and one visible consequence before expanding into infernal politics.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-counterspell', 'dnd-mage-armor', 'dnd-necromancer-spells'],
};

const dndMephistophelesArticleZh: BlogPost = {
  slug: 'mephistopheles-dnd',
  title: 'mephistopheles dnd：Cania 冰狱大魔鬼、契约陷阱与跑团钩子',
  seoTitle: 'mephistopheles dnd：Cania、契约陷阱与跑团钩子',
  metaDescription:
    '这篇 mephistopheles dnd 百科指南快速讲清 Mephistopheles 是谁、Cania 和 hellfire 设定、Warlock/Tiefling 关联、DM 怎么用以及 FAQ。',
  excerpt:
    '一篇实用 mephistopheles dnd 设定百科，覆盖 Cania、archdevil 身份、Warlock 和 Tiefling 钩子、DM 用法',
  updatedAt: DND_MEPHISTOPHELES_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '魔鬼百科',
  coverImage: DND_MEPHISTOPHELES_COVER_PATH,
  coverAlt:
    'mephistopheles dnd 指南封面图，展示冰狱契约桌面、骰子、寒霜、地狱火和封蜡交易',
  bodyHtml: dndMephistophelesArticleHtmlZh,
  faqItems: [
    {
      question: 'DND 里的 Mephistopheles 是谁？',
      answer:
        'Mephistopheles 是和 Cania、九层地狱、奥术野心与 hellfire 相关的 archdevil，更适合当 patron 或终局威胁，不适合当随手遭遇怪。',
    },
    {
      question: 'Mephistopheles 是 D&D 里的神吗？',
      answer:
        '通常更准确地说，他是 archdevil，而不是普通意义上的 god。但在战役里，他仍然足够强，可以通过契约、邪教和地狱魔法影响剧情。',
    },
    {
      question: 'Warlock 可以把 Mephistopheles 当 patron 吗？',
      answer:
        '可以，只要 DM 同意。建议用 Fiend Warlock 的方向，并通过代理人、印记和明确债务来表现。',
    },
    {
      question: 'Mephistopheles 和哪一层地狱有关？',
      answer:
        'Mephistopheles 通常和 Cania 绑定，也就是九层地狱中冰冷的第八层。',
    },
    {
      question: '新手团适合用 Mephistopheles 当主反派吗？',
      answer:
        '不太适合直接当主反派。新手团可以先用一个代理人、一个简单契约和一个可见后果。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-counterspell', 'dnd-mage-armor', 'dnd-necromancer-spells'],
};

const dndBardSpellsArticle: BlogPost = {
  slug: 'dnd-bard-spells',
  title: 'dnd bard spells: Best Picks for Support, Control, and Social Play',
  seoTitle: 'dnd bard spells: Best Picks by Role',
  metaDescription:
    'Pick dnd bard spells faster: best cantrips, early control, healing, social magic, 2nd/3rd-level picks, concentration tips, FAQ, and Bard table strategy.',
  excerpt:
    'A practical dnd bard spells guide covering cantrips, control, healing, social magic, party gaps, concentration, Bardic Inspiration, and VTT prep.',
  updatedAt: DND_BARD_SPELLS_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_BARD_SPELLS_COVER_PATH,
  coverAlt:
    'dnd bard spells guide cover showing a lute, colorful spell cards, dice, sheet music, and arcane sound magic on a tabletop',
  bodyHtml: dndBardSpellsArticleHtml,
  faqItems: [
    {
      question: 'What is the best Bard spell in DND?',
      answer:
        'For many tables, Healing Word and Hypnotic Pattern are the best Bard spells because one rescues allies efficiently and the other can remove multiple enemies from the fight.',
    },
    {
      question: 'Should Bards take damage spells?',
      answer:
        'Bards can take damage spells, but most Bard lists are stronger when they focus on control, support, and emergency utility instead of trying to out-blast dedicated damage casters.',
    },
    {
      question: 'Is Healing Word better than Cure Wounds for Bards?',
      answer:
        'Usually yes. Healing Word works at range and uses a Bonus Action, so it is better for picking up a fallen ally without giving up your whole turn.',
    },
    {
      question: 'Do Bard spells use Charisma?',
      answer:
        'Yes. Bard spellcasting uses Charisma, so your spell save DC and spell attack bonus depend on Charisma plus proficiency.',
    },
    {
      question: 'Which Bard spells are best for roleplay?',
      answer:
        'Suggestion, Disguise Self, Enhance Ability, Detect Thoughts, and Zone of Truth are strong roleplay picks when your campaign has negotiations, deception, investigations, or courts.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-druid-spells', 'dnd-counterspell', 'dnd-constitution-guide'],
};

const dndBardSpellsArticleZh: BlogPost = {
  slug: 'dnd-bard-spells',
  title: 'dnd bard spells：支援、控场、社交与救场法术推荐',
  seoTitle: 'dnd bard spells：Bard 法术推荐',
  metaDescription:
    '这篇 dnd bard spells 指南快速整理 Bard 戏法、1-3 环法术、控场、治疗、社交工具、concentration 取舍和常见问题。',
  excerpt:
    '一篇实用 dnd bard spells 法术百科，覆盖 Bard 戏法、控场、治疗、社交工具、concentration 取舍和跑团准备。',
  updatedAt: DND_BARD_SPELLS_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '法术百科',
  coverImage: DND_BARD_SPELLS_COVER_PATH,
  coverAlt:
    'dnd bard spells 指南封面图，桌面上摆放鲁特琴、彩色法术卡、骰子、乐谱和奥术音乐光效',
  bodyHtml: dndBardSpellsArticleHtmlZh,
  faqItems: [
    {
      question: 'DND 里最好的 Bard spell 是哪个？',
      answer:
        '很多桌上，Healing Word 和 Hypnotic Pattern 是最强 Bard 法术之一：前者高效救人，后者可能让多个敌人暂时离开战斗。',
    },
    {
      question: 'Bard 需要拿伤害法术吗？',
      answer:
        '可以拿，但多数 Bard 法术表更适合专注控场、支援和救场工具，而不是试图和专职输出施法者比爆发。',
    },
    {
      question: 'Healing Word 比 Cure Wounds 更适合 Bard 吗？',
      answer:
        '通常是。Healing Word 有距离，而且是 Bonus Action，更适合在不牺牲整回合的情况下拉起倒地队友。',
    },
    {
      question: 'Bard 法术使用 Charisma 吗？',
      answer:
        '是。Bard 使用 Charisma 施法，所以法术豁免 DC 和法术攻击加值都依赖 Charisma 和熟练加值。',
    },
    {
      question: '哪些 Bard 法术最适合 roleplay？',
      answer:
        'Suggestion、Disguise Self、Enhance Ability、Detect Thoughts 和 Zone of Truth 很适合谈判、欺骗、调查和宫廷剧情。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-druid-spells', 'dnd-counterspell', 'dnd-constitution-guide'],
};

const dndGhostArticle: BlogPost = {
  slug: 'dnd-ghost',
  title: 'dnd ghost 5e: Stats, Possession, and Haunting Tips',
  seoTitle: 'dnd ghost 5e: Stats and Possession',
  metaDescription:
    'Use this dnd ghost guide to get fast stats, possession rulings, haunting encounter prep, VTT token tips, FAQ, and the companion dice ghost video.',
  excerpt:
    'A practical dnd ghost encyclopedia page with fast stat notes, possession advice, haunted-location encounter prep, VTT token tips, FAQ, and video.',
  publishedAt: DND_GHOST_UPDATED_AT,
  updatedAt: DND_GHOST_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Monster Guide',
  coverImage: DND_GHOST_COVER_PATH,
  coverAlt:
    'dnd ghost guide cover showing a spectral undead spirit rising from a VTT token frame over a haunted tabletop map',
  bodyHtml: dndGhostArticleHtml,
  faqItems: [
    {
      question: 'Is a dnd ghost undead?',
      answer:
        'Yes, a dnd ghost is undead. That creature type matters for spells, features, and table rulings that interact with undead creatures.',
    },
    {
      question: 'Can a dnd ghost move through walls?',
      answer:
        'Yes, a dnd ghost is known for moving through objects and barriers, depending on the exact stat block being used. Build the map so wall movement matters.',
    },
    {
      question: 'Can a dnd ghost possess a player character?',
      answer:
        'Yes, the classic dnd ghost can possess a humanoid after a failed save. Decide before play how the party can respond and how the affected player stays involved.',
    },
    {
      question: 'What level party can fight a dnd ghost?',
      answer:
        'A dnd ghost works best as a serious low-to-mid-level threat, but magic weapons, saving throws, turn undead, map layout, and possession rulings can change the difficulty.',
    },
    {
      question: 'How do I make a ghost scary without unfairly killing players?',
      answer:
        'Use clues, possession pressure, movement, and consequences before raw damage. Give warning signs and response options so fear comes from choices.',
    },
  ],
  relatedSlugs: ['dnd-necromancer-spells', 'dnd-demons', 'dnd-counterspell', 'dnd-dagger'],
};

const dndDwarfNamesArticle: BlogPost = {
  slug: 'dnd-dwarf-names',
  title: 'dnd dwarf names: 100+ Names, Clans, and Nicknames',
  seoTitle: 'dnd dwarf names: 100+ Dwarf Names',
  metaDescription:
    'Need a dwarf name that sounds ready for D&D? Grab 100+ dnd dwarf names, clan surnames, funny picks, and VTT token tips in one fast list.',
  excerpt:
    'Browse 100+ dwarf first names, clan surnames, and nicknames, then choose one that fits the character identity, family background, and tabletop presentation.',
  publishedAt: DND_DWARF_NAMES_UPDATED_AT,
  updatedAt: DND_DWARF_NAMES_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Name Guide',
  coverImage: DND_DWARF_NAMES_COVER_PATH,
  coverAlt:
    'dnd dwarf names guide cover showing a dwarf carving clan names beside dice and VTT token frames in a forge-lit stone hall',
  bodyHtml: dndDwarfNamesArticleHtml,
  faqItems: [
    {
      question: 'What are good dnd dwarf names?',
      answer:
        'Good dnd dwarf names are short, sturdy, and tied to clan identity. Korgan Emberhand, Brakka Stonevow, Durik Ironthane, Hilda Coppervein, and Sigrun Goldmender are strong examples.',
    },
    {
      question: 'How do I make a dwarf clan name?',
      answer:
        'Make a dwarf clan name by combining material, craft, place, or oath language, such as Stonevow, Forgewarden, Goldmender, Deepdelver, or Shieldbrand.',
    },
    {
      question: 'Should dwarf names be Norse?',
      answer:
        'Dwarf names do not have to be Norse, but Norse-inspired sounds can help when the campaign setting supports that tone.',
    },
    {
      question: 'Can I use funny dwarf names in a serious campaign?',
      answer:
        'Yes, but the joke should sit on top of a believable person. A funny name still needs a skill, fear, debt, or secret if players are expected to remember it.',
    },
    {
      question: 'What is the best length for a dwarf token label?',
      answer:
        'The best dwarf token label is usually one short name under 12-14 characters. Put the full clan name and title in the sheet or GM notes.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-dagger', 'dnd-armor-guide', 'dnd-dhampir'],
};

const dndMaceArticle: BlogPost = {
  slug: 'dnd-mace',
  title: 'dnd mace 5e: 1d6 Stats, Sap, and Best Uses',
  seoTitle: 'dnd mace 5e: 1d6 Stats and Sap',
  metaDescription:
    'Need dnd mace stats now? See 1d6 bludgeoning, 5 gp, 4 lb, simple weapon rules, 2024 Sap, best users, comparisons, and VTT token tips.',
  excerpt:
    'A dnd mace is a 1d6 simple melee weapon. This guide shows when to pick it, when to skip it, how Sap works, and how to show it clearly on a VTT token.',
  publishedAt: DND_MACE_UPDATED_AT,
  updatedAt: DND_MACE_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Equipment Guide',
  coverImage: DND_MACE_COVER_PATH,
  coverAlt:
    'dnd mace guide cover showing a spiked mace, dice, character sheet notes, and VTT token frames on a dungeon tabletop',
  bodyHtml: dndMaceArticleHtml,
  faqItems: [
    {
      question: 'How much damage does a dnd mace do?',
      answer:
        'A dnd mace deals 1d6 bludgeoning damage. For normal melee attacks, add the relevant ability modifier according to your table rules, usually Strength.',
    },
    {
      question: 'Is a dnd mace a simple weapon?',
      answer:
        'Yes, a dnd mace is a simple melee weapon. That broad access is why Clerics and many NPCs can use it without martial weapon proficiency.',
    },
    {
      question: 'Can a Rogue use Sneak Attack with a mace?',
      answer:
        'No, a normal mace does not qualify for Sneak Attack because it lacks Finesse and is not a ranged weapon.',
    },
    {
      question: 'Is a mace better than a warhammer in DnD?',
      answer:
        'A mace is easier to access, but a warhammer is usually stronger for characters with martial weapon proficiency because it has a bigger damage die and Versatile use.',
    },
    {
      question: 'Does a dnd mace have Sap?',
      answer:
        'In the 2024 equipment table, the mace has Sap as its weapon mastery entry. Your character still needs a feature or option that lets them use that mastery.',
    },
  ],
  relatedSlugs: ['dnd-dagger', 'dnd-armor-guide', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndRangerSpellsArticle: BlogPost = {
  slug: 'dnd-ranger-spells',
  title: "DND Ranger Spells Guide: Best Picks, Prepared Lists, and Hunter's Mark Choices",
  seoTitle: 'DND Ranger Spells Guide: Best Picks and Prepared Lists',
  metaDescription:
    "Pick dnd ranger spells faster with best spell choices by role, 2014 vs 2024 rules, Hunter's Mark tradeoffs, prepared lists, VTT token tips, and FAQ.",
  excerpt:
    "A practical dnd ranger spells guide covering best picks by role, 2014/2024 spellcasting differences, concentration choices, prepared examples, VTT token prep, and Hunter's Mark tradeoffs.",
  publishedAt: DND_RANGER_SPELLS_UPDATED_AT,
  updatedAt: DND_RANGER_SPELLS_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_RANGER_SPELLS_COVER_PATH,
  coverAlt:
    'dnd ranger spells guide cover showing a hooded Ranger with spell cards, a marked quarry token, dice, and forest magic on a VTT battle map',
  bodyHtml: dndRangerSpellsArticleHtml,
  faqItems: [
    {
      question: 'What are the best dnd ranger spells?',
      answer:
        "The best dnd ranger spells for most tables are Hunter's Mark, Goodberry, Pass without Trace, Spike Growth, Ensnaring Strike, Entangle, Cure Wounds, Summon Beast, Freedom of Movement, and Swift Quiver.",
    },
    {
      question: 'Do Rangers prepare spells in DND?',
      answer:
        'It depends on the rules version. The 2014 Ranger knows a limited number of spells, while the 2024 Ranger prepares Ranger spells from the class list.',
    },
    {
      question: "Is Hunter's Mark always the best Ranger spell?",
      answer:
        "No. Hunter's Mark is strong against durable targets, but Pass without Trace, Spike Growth, Entangle, Silence, or a summon can be better when the encounter rewards stealth, terrain control, or board presence.",
    },
    {
      question: 'What Ranger spell should I take first?',
      answer:
        "For many tables, start with Hunter's Mark or Goodberry, then add a control or exploration spell such as Entangle, Fog Cloud, Longstrider, or Speak with Animals.",
    },
    {
      question: 'What is the best 2nd-level Ranger spell?',
      answer:
        'Pass without Trace is often the strongest 2nd-level Ranger spell for party stealth, while Spike Growth is one of the best combat control picks.',
    },
  ],
  relatedSlugs: ['dnd-hunters-mark', 'dnd-druid-spells', 'dnd-constitution-guide', 'dnd-classes-explained'],
};

const dndSwordSheathsArticle: BlogPost = {
  slug: 'dnd-sword-sheaths',
  title: 'DnD Sword Sheaths: Rules, Scabbard Ideas, and VTT Visuals',
  seoTitle: 'DnD Sword Sheaths: Rules, Scabbard Ideas, and VTT Visuals',
  metaDescription:
    'A practical dnd sword sheaths guide covering 2024 draw and stow rules, scabbard story ideas, DM-safe homebrew prompts, and VTT token visuals.',
  excerpt:
    'Use dnd sword sheaths for more than a weapon holder: check the current draw-and-stow rule, build character story, and make the scabbard read on a VTT token.',
  publishedAt: DND_SWORD_SHEATHS_UPDATED_AT,
  updatedAt: DND_SWORD_SHEATHS_UPDATED_AT,
  readTime: '9 min read',
  coverLabel: 'Character Gear',
  coverImage: DND_SWORD_SHEATHS_COVER_PATH,
  coverAlt:
    'dnd sword sheaths guide cover showing a leather scabbard, a partially drawn sword, a VTT token, and a d20 on a tabletop map',
  bodyHtml: dndSwordSheathsArticleHtml,
  faqItems: [
    {
      question: 'Can you draw a sword from a sheath as part of an attack in 2024 DnD?',
      answer:
        'Yes. When you make an attack as part of the Attack action, the current rules let you equip one weapon before or after that attack. Drawing it from a sheath counts as equipping it.',
    },
    {
      question: 'Can you sheathe a sword as part of an attack in 2024 DnD?',
      answer:
        'Yes. The current rules list sheathing, stowing, and dropping a weapon as ways to unequip it before or after an attack in the Attack action.',
    },
    {
      question: 'Does a back scabbard make drawing a sword faster in DnD?',
      answer:
        'No official combat bonus comes from a mundane back scabbard. Treat it as character art unless your DM gives that setup a specific ruling or item effect.',
    },
    {
      question: 'Is a scabbard different from a sheath in DnD?',
      answer:
        'At most DnD tables, both words communicate the same practical idea: a cover or holder for a bladed weapon. Use the term your group finds clearest, then describe the object in a way that fits the character.',
    },
    {
      question: 'Can a magic scabbard make any sword magical?',
      answer:
        'Only if the item\'s text or your DM says it can. The four examples above are homebrew story prompts, not official magic-item effects.',
    },
    {
      question: 'How should a sword sheath appear on a VTT token?',
      answer:
        'Show one clear identifier, such as a pommel, diagonal strap, colored throat, or metal chape. Keep the face readable and avoid treating a visual detail as a rules bonus unless the table has agreed on one.',
    },
  ],
  relatedSlugs: ['rapier-dnd', 'dnd-dagger', 'dnd-shortsword', 'dnd-classes-explained'],
};

const dndSwordSheathsArticleZh: BlogPost = {
  slug: 'dnd-sword-sheaths',
  title: 'DND 剑鞘指南：收剑规则、角色设定与 VTT 视觉',
  seoTitle: 'DND 剑鞘指南：收剑规则、角色设定与 VTT 视觉',
  metaDescription:
    '一篇实用的 DND 剑鞘指南，讲清 2024 抽剑与收剑规则、剑鞘角色设定、DM 可选自制灵感和 VTT Token 视觉处理。',
  excerpt:
    'DND 剑鞘不只是武器收纳物：这篇用当前抽收剑规则、角色背景细节和 VTT Token 轮廓，帮你把它变成桌边能用的信息。',
  publishedAt: DND_SWORD_SHEATHS_UPDATED_AT,
  updatedAt: DND_SWORD_SHEATHS_UPDATED_AT,
  readTime: '9 分钟阅读',
  coverLabel: '角色装备',
  coverImage: DND_SWORD_SHEATHS_COVER_PATH,
  coverAlt:
    'DND 剑鞘指南封面图，桌面地图上有皮革剑鞘、局部出鞘的长剑、VTT Token 和 d20 骰子',
  bodyHtml: dndSwordSheathsArticleHtmlZh,
  faqItems: [
    {
      question: '2024 DnD 里能在攻击时从剑鞘抽剑吗？',
      answer:
        '可以。你在攻击动作里进行一次攻击时，当前规则允许你在该次攻击前或后装备一件武器；从剑鞘抽出它属于装备。',
    },
    {
      question: '2024 DnD 里能在攻击时把剑插回鞘吗？',
      answer:
        '可以。当前规则把插回剑鞘、收起和丢下武器都列为解除装备，它们可以发生在攻击动作中的一次攻击前或后。',
    },
    {
      question: '背鞘会让 DnD 角色抽剑更快吗？',
      answer:
        '不会。普通背鞘没有官方战斗加值。除非 DM 对该设定或物品效果作出明确裁定，否则把它当作角色美术即可。',
    },
    {
      question: 'DnD 里的 scabbard 和 sheath 有区别吗？',
      answer:
        '在多数 DnD 桌上，这两个词传达的实用意思相同，都是刃器的外套或收纳物。选全桌听得懂的说法，再按角色去描述它即可。',
    },
    {
      question: '魔法剑鞘能让任何剑都变成魔法武器吗？',
      answer:
        '只有物品文本或 DM 明确说可以时才行。上面四个例子都是自制剧情提示，不是官方魔法物品效果。',
    },
    {
      question: '剑鞘应该怎样出现在 VTT Token 上？',
      answer:
        '保留一个清晰识别点就够了，例如剑柄、斜背带、彩色鞘口或金属鞘尾。让脸仍然看得清楚，也不要把视觉细节当成规则加值，除非全桌已经约定。',
    },
  ],
  relatedSlugs: ['rapier-dnd', 'dnd-dagger', 'dnd-shortsword', 'dnd-classes-explained'],
};

const dnd5eArmorerArticle: BlogPost = {
  slug: 'dnd-5e-armorer',
  title: 'DnD 5e Armorer: Build Roles, Armor Models, and VTT Tokens',
  seoTitle: 'DnD 5e Armorer: Build Roles, Armor Models, and VTT Tokens',
  metaDescription:
    'Choose a DnD 5e Armorer role for your party, use Guardian or Infiltrator under 2014 rules, check the 2025 Dreadnaught branch, and make the suit clear on a VTT token.',
  excerpt:
    'Choose Guardian, Infiltrator, or the 2025 Dreadnaught branch by the job your party needs, then give that role a clear first round and VTT token state.',
  publishedAt: DND_5E_ARMORER_UPDATED_AT,
  updatedAt: DND_5E_ARMORER_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Artificer Build',
  coverImage: DND_5E_ARMORER_COVER_PATH,
  coverAlt:
    'dnd 5e armorer guide cover showing an Armorer Artificer in rune-lit plate armor with a Guardian gauntlet, a Lightning Launcher, and three readable VTT armor-model cues on a battle map',
  bodyHtml: dnd5eArmorerArticleHtml,
  relatedSlugs: ['dnd-armor-guide', 'dnd-classes-explained', 'dnd-mage-armor', 'dnd-sword-sheaths'],
};

const dnd5eArmorerArticleZh: BlogPost = {
  slug: 'dnd-5e-armorer',
  title: 'DND 5e 装甲师：构筑定位、装甲模型与 VTT Token',
  seoTitle: 'DND 5e 装甲师：构筑定位、装甲模型与 VTT Token',
  metaDescription:
    '从队伍缺口选择 DND 5e 装甲师：2014 Guardian 或 Infiltrator，2025 Dreadnaught 分支，以及能在 VTT 上看清职责的 Token 方案。',
  excerpt:
    '按队伍需要选择 Guardian、Infiltrator，或 2025 的 Dreadnaught 分支，再把它变成清楚的首回合职责和 VTT Token 状态。',
  publishedAt: DND_5E_ARMORER_UPDATED_AT,
  updatedAt: DND_5E_ARMORER_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '魔械师构筑',
  coverImage: DND_5E_ARMORER_COVER_PATH,
  coverAlt:
    'DND 5e 装甲师指南封面图：符文板甲中的装甲师、Guardian 拳套、Lightning Launcher，以及战斗地图上三种可识别的 VTT 装甲模型提示',
  bodyHtml: dnd5eArmorerArticleHtmlZh,
  relatedSlugs: ['dnd-armor-guide', 'dnd-classes-explained', 'dnd-mage-armor', 'dnd-sword-sheaths'],
};

const dndDeathKnightArticle: BlogPost = {
  slug: 'dnd-death-knight',
  title: 'DnD Death Knight: Run a 2025 Undead Commander Encounter',
  seoTitle: 'DnD Death Knight: Run a 2025 Undead Commander Encounter',
  metaDescription:
    'Run a 2025 DnD Death Knight with an objective, cover, undead jobs, legendary pressure, a Death Knight Aspirant lead-in, and a clear 2014 comparison.',
  excerpt:
    'Build a 2025 Death Knight encounter around an objective, separate undead jobs, answers to Hellfire Orb pressure, and a VTT commander token.',
  publishedAt: DND_DEATH_KNIGHT_UPDATED_AT,
  updatedAt: DND_DEATH_KNIGHT_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Monster Encounter',
  coverImage: DND_DEATH_KNIGHT_COVER_PATH,
  coverAlt:
    'dnd death knight guide cover showing an undead commander in black plate with skeletal troops on a ruined moonlit battle map',
  bodyHtml: dndDeathKnightArticleHtml,
  relatedSlugs: ['dnd-ghost', 'dnd-necromancer-spells', 'dnd-armor-guide', 'dnd-sword-sheaths'],
};

const dndDeathKnightArticleZh: BlogPost = {
  slug: 'dnd-death-knight',
  title: 'DND 死亡骑士：运行 2025 亡灵指挥官遭遇',
  seoTitle: 'DND 死亡骑士：运行 2025 亡灵指挥官遭遇',
  metaDescription:
    '用目标、掩体、亡灵职责、传奇压力、Death Knight Aspirant 前置遭遇和清楚的 2014 对照，运行 2025 DND 死亡骑士。',
  excerpt:
    '把 2025 死亡骑士放进有目标、有分工亡灵和可回应压力的遭遇，再做一张一眼能认出的 VTT 指挥官 Token。',
  publishedAt: DND_DEATH_KNIGHT_UPDATED_AT,
  updatedAt: DND_DEATH_KNIGHT_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '怪物遭遇',
  coverImage: DND_DEATH_KNIGHT_COVER_PATH,
  coverAlt:
    'DND 死亡骑士指南封面图：黑色板甲中的亡灵指挥官、骷髅部属，以及月光下的废墟战斗地图',
  bodyHtml: dndDeathKnightArticleHtmlZh,
  relatedSlugs: ['dnd-ghost', 'dnd-necromancer-spells', 'dnd-armor-guide', 'dnd-sword-sheaths'],
};

const dwelfDndArticle: BlogPost = {
  slug: 'dwelf-dnd',
  title: 'Dwelf DnD: Build a Dwarf-Elf Character With One Rules Chassis',
  seoTitle: 'Dwelf DnD: Build a Dwarf-Elf Character With One Rules Chassis',
  metaDescription:
    'Build a dwelf DnD character with one legal 2024 Dwarf or Elf rules chassis, a playable family conflict, and a clear VTT token portrait.',
  excerpt:
    'Choose one official rules chassis for your dwarf-elf character, then make the mixed heritage matter through family promises, table choices, and token details.',
  publishedAt: DWELF_DND_UPDATED_AT,
  updatedAt: DWELF_DND_UPDATED_AT,
  readTime: '9 min read',
  coverLabel: 'Character Concept',
  coverImage: DND_DWELF_COVER_PATH,
  coverAlt:
    'dwelf dnd guide cover showing a dwarf-elf adventurer with pointed ears, a braided beard, a woodland staff, and a VTT portrait token beside a forge',
  bodyHtml: dwelfDndArticleHtml,
  relatedSlugs: ['dnd-dwarf-names', 'dnd-classes-explained', 'dnd-dhampir', 'dnd-armor-guide'],
};

const dwelfDndArticleZh: BlogPost = {
  slug: 'dwelf-dnd',
  title: 'Dwelf DND：用一套规则做出矮人精灵混血角色',
  seoTitle: 'Dwelf DND：用一套规则做出矮人精灵混血角色',
  metaDescription:
    '用一套合法的 2024 Dwarf 或 Elf 规则底盘，做出有家族承诺、桌边选择和清楚 VTT Token 的 Dwelf DND 角色。',
  excerpt:
    '先给矮人精灵混血角色选一个官方规则底盘，再用家族承诺、场景选择和 Token 细节让混血身份真正上桌。',
  publishedAt: DWELF_DND_UPDATED_AT,
  updatedAt: DWELF_DND_UPDATED_AT,
  readTime: '9 分钟阅读',
  coverLabel: '角色设定',
  coverImage: DND_DWELF_COVER_PATH,
  coverAlt:
    'Dwelf DND 指南封面图：尖耳、编胡子的矮人精灵混血冒险者，手持林地木杖，旁边有熔炉和 VTT 头像 Token',
  bodyHtml: dwelfDndArticleHtmlZh,
  relatedSlugs: ['dnd-dwarf-names', 'dnd-classes-explained', 'dnd-dhampir', 'dnd-armor-guide'],
};

const dndFlumphArticle: BlogPost = {
  slug: 'dnd-flumph',
  title: 'DnD Flumph Guide: Ally Clues, Telepathy, and VTT Tokens',
  seoTitle: 'DnD Flumph Guide: Ally Clues, Telepathy, and VTT Tokens',
  metaDescription:
    'Use a dnd flumph as a warning scout, frightened witness, or telepathic clue-giver, then make it readable on a VTT token before the party walks into the real threat.',
  excerpt:
    'Turn a dnd flumph into a useful ally clue: catch hostile telepathy, point the party at the real danger, and keep the creature readable on a VTT map.',
  publishedAt: DND_FLUMPH_UPDATED_AT,
  updatedAt: DND_FLUMPH_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Aberration Guide',
  coverImage: DND_FLUMPH_COVER_PATH,
  coverAlt:
    'dnd flumph guide cover showing a benevolent floating flumph above an Underdark map table with telepathic ripples and a distant psionic threat',
  bodyHtml: dndFlumphArticleHtml,
  faqItems: [
    {
      question: 'What is a flumph in DnD?',
      answer:
        'A flumph is a small aberration usually used as a floating telepathic creature from the Underdark. At the table, it is most useful as a warning sign, witness, or guide rather than a straight damage dealer.',
    },
    {
      question: 'Are flumphs friendly?',
      answer:
        'They are often played as benevolent or at least non-hostile, but friendly does not mean fearless. A flumph that wants help should still behave like a creature that knows something dangerous is nearby.',
    },
    {
      question: 'Why does Advanced Telepathy matter so much?',
      answer:
        'Because it changes what the party can learn before combat starts. A flumph can react to telepathic traffic the players cannot hear, which makes it a clean early-warning creature in psionic scenes.',
    },
    {
      question: 'Can a flumph carry a whole encounter by itself?',
      answer:
        'Usually no. The flumph should sharpen the players\' next decision, then hand the spotlight back to the real threat, the room, or the rescue target.',
    },
    {
      question: 'How should a flumph look on a VTT token?',
      answer:
        'Keep the silhouette simple: bright rim light, readable eye stalks, and a clear state ring for ally or warning. If the token only looks good at full illustration size, it is too soft for the map.',
    },
    {
      question: 'What happens if a flumph gets knocked prone?',
      answer:
        'The current 2024 flumph rules include a prone deficiency that can leave the creature incapacitated at the worst moment. Use that as a reason for the party to shield the clue, not as a reason to turn the creature into a joke.',
    },
  ],
  relatedSlugs: ['dnd-find-familiar', 'dnd-ghost', 'dnd-necromancer-spells', 'dnd-death-knight'],
};

const dndFlumphArticleZh: BlogPost = {
  slug: 'dnd-flumph',
  title: 'DND Flumph 指南：盟友线索、心灵感应与 VTT Token',
  seoTitle: 'DND Flumph 指南：盟友线索、心灵感应与 VTT Token',
  metaDescription:
    '把 DND Flumph 用成预警侦察、受惊见证者或心灵线索，再用清楚的 VTT Token 让全桌在进错房前读懂它的警告。',
  excerpt:
    '把 DND Flumph 变成真正有用的盟友线索：先截住敌对心灵交流，再把真正的危险指给队伍看，并在 VTT 地图上保持可读。',
  publishedAt: DND_FLUMPH_UPDATED_AT,
  updatedAt: DND_FLUMPH_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '异怪指南',
  coverImage: DND_FLUMPH_COVER_PATH,
  coverAlt:
    'DND Flumph 指南封面图，善意 flumph 漂浮在幽暗地域地图桌上方，周围有心灵波纹和远处的灵能威胁',
  bodyHtml: dndFlumphArticleHtmlZh,
  faqItems: [
    {
      question: 'DnD 里的 flumph 到底是什么？',
      answer:
        'Flumph 是一种小型异怪，常被用成幽暗地域里的漂浮心灵生物。真正上桌时，它最适合承担预警、见证者或向导职责，而不是纯伤害怪。',
    },
    {
      question: 'Flumph 一般友善吗？',
      answer:
        '它们经常会被处理成善意或至少非敌对，但“友善”不代表“勇敢”。一只需要帮助的 flumph 仍然应该像真正知道危险在哪的生物一样行动。',
    },
    {
      question: '为什么 Advanced Telepathy 这么重要？',
      answer:
        '因为它决定了队伍能不能在开打前读到危险。Flumph 能感知玩家听不见的心灵交流，所以特别适合放在灵能场景里做第一道预警。',
    },
    {
      question: 'Flumph 能单独撑起一整场遭遇吗？',
      answer:
        '通常不行。它应该把玩家的下一步选择磨尖，然后把聚光灯交还给真正的威胁、房间里的秘密，或等待营救的人。',
    },
    {
      question: 'Flumph 的 VTT Token 应该怎么做？',
      answer:
        '把轮廓做清楚就够了：亮边、可读的眼柄，以及盟友或预警状态环。若 Token 只有在大图尺寸下才好看，那它放上地图就太虚了。',
    },
    {
      question: 'Flumph 被击倒后会怎样？',
      answer:
        '当前 2024 flumph 规则里有 prone deficiency，可能会让它在关键回合直接带着 incapacitated 状态失去作用。把这条当成“队伍得保护这条线索”的理由，而不是拿来搞笑。',
    },
  ],
  relatedSlugs: ['dnd-find-familiar', 'dnd-ghost', 'dnd-necromancer-spells', 'dnd-death-knight'],
};

const dndThunderclapArticle: BlogPost = {
  slug: 'dnd-thunderclap',
  title: 'Thunderclap DnD Guide: 2014/2024 Rules, Range, and VTT Tips',
  seoTitle: 'Thunderclap DnD Guide: 2014/2024 Rules, Range, and VTT Tips',
  metaDescription:
    'A practical dnd thunderclap guide covering 2014/2024 rules, 5-foot Emanation range, 100-foot sound, ally risk, scaling, FAQ, and VTT token tips.',
  excerpt:
    'A practical dnd thunderclap guide for the 5-foot burst, 100-foot sound line, ally risk, 2014/2024 wording, FAQ, and VTT token setup.',
  publishedAt: DND_THUNDERCLAP_UPDATED_AT,
  updatedAt: DND_THUNDERCLAP_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_THUNDERCLAP_COVER_PATH,
  coverAlt:
    'dnd thunderclap guide cover showing a storm caster token releasing a blue thunder burst into adjacent enemy tokens on a VTT battle map',
  bodyHtml: dndThunderclapArticleHtml,
  faqItems: [
    {
      question: 'Is Thunderclap good in DnD?',
      answer:
        'Thunderclap is good when several enemies are already next to you and the table can tolerate the 100-foot noise. It is weak when allies are in the burst, when you need silence, or when you can safely use a ranged cantrip instead.',
    },
    {
      question: 'Does Thunderclap hit the caster?',
      answer:
        'Normally no. In 2024, the Emanation origin is excluded unless the caster chooses to include it. The 2014 wording also says each creature other than you.',
    },
    {
      question: 'Does Thunderclap hit allies?',
      answer:
        'Yes. Thunderclap can hit allies, familiars, summons, mounts, and NPCs caught in the 5-foot area, so mark the burst before rolling.',
    },
    {
      question: 'Is Thunderclap a 100-foot damage spell?',
      answer:
        'No. The 100-foot line describes how far away the sound can be heard. The damage area is still the small burst around the caster.',
    },
    {
      question: 'What saving throw does Thunderclap use?',
      answer:
        'Thunderclap uses a Constitution saving throw. On a failed save, the creature takes Thunder damage; on a successful save, it takes no damage.',
    },
    {
      question: 'How does Thunderclap scale?',
      answer:
        'Thunderclap deals 1d6 Thunder damage at first, then 2d6 at level 5, 3d6 at level 11, and 4d6 at level 17.',
    },
    {
      question: 'Does Thunderclap need concentration?',
      answer: 'No. Thunderclap has an Instantaneous duration and does not require concentration.',
    },
    {
      question: 'Which classes get Thunderclap?',
      answer:
        "The common spell lists for Thunderclap include Bard, Druid, Sorcerer, Warlock, and Wizard, with Artificer appearing in widely used 5e references. Always use the list your table's rules source provides.",
    },
    {
      question: 'How should I show Thunderclap on a VTT?',
      answer:
        'Use a 5-foot burst marker around the caster token, check every creature inside the marker, call out allies before the roll, then roll Constitution saves.',
    },
  ],
  relatedSlugs: ['dnd-find-familiar', 'dnd-bless', 'dnd-counterspell', 'dnd-classes-explained'],
};

const dndFindFamiliarArticle: BlogPost = {
  slug: 'dnd-find-familiar',
  title: 'Find Familiar 5e / 2024 Guide: Rules, Best Uses, and VTT Tokens',
  seoTitle: 'Find Familiar 5e / 2024 Guide: Rules, Uses, and VTT Tokens',
  metaDescription:
    'Learn dnd find familiar rules, 2014 vs 2024 changes, best familiar forms, Help action, touch spells, scouting, FAQ, and VTT token setup.',
  excerpt:
    'A practical dnd find familiar guide covering 2014/2024 rules, familiar forms, Help action, touch spells, scouting, FAQ, and VTT token setup.',
  publishedAt: DND_FIND_FAMILIAR_UPDATED_AT,
  updatedAt: DND_FIND_FAMILIAR_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_FIND_FAMILIAR_COVER_PATH,
  coverAlt:
    'dnd find familiar guide cover showing a Wizard token, familiar token, spellbook, d20 dice, and VTT scouting markers on a tabletop battle map',
  bodyHtml: dndFindFamiliarArticleHtml,
  faqItems: [
    {
      question: 'Is Find Familiar a Wizard spell?',
      answer:
        'Yes. Find Familiar is normally a Wizard spell. Other characters can get it through specific features, feats, subclasses, magic items, or table options.',
    },
    {
      question: 'Can a familiar attack in DnD?',
      answer:
        'No. A normal familiar from Find Familiar cannot attack, but it can take other actions as normal. Separate class features can change this for some characters.',
    },
    {
      question: 'Can a familiar use the Help action?',
      answer:
        'Yes, a familiar can take actions other than Attack, and Help is one of the normal actions. The table still needs a believable target, position, and timing.',
    },
    {
      question: 'How far can a familiar be from you?',
      answer:
        'The important range is 100 feet for telepathy, sight sharing, and touch-spell delivery. A familiar can physically move farther, but you lose those linked benefits outside that range.',
    },
    {
      question: 'Does Find Familiar require concentration?',
      answer:
        'No after the familiar appears. Find Familiar has an instantaneous duration, but the 2024 long-casting rule still requires concentration during the casting.',
    },
    {
      question: 'What happens when a familiar drops to 0 HP?',
      answer:
        'It disappears and leaves behind what it was wearing or carrying. To get it back after that, cast Find Familiar again.',
    },
    {
      question: 'Can you have more than one familiar?',
      answer:
        'No. Find Familiar allows one familiar at a time. Recasting the spell while you already have one changes or replaces the existing familiar according to the spell text.',
    },
    {
      question: 'What is the best familiar form?',
      answer:
        'For many tables, a flying scout such as an owl is the easiest all-purpose pick. The best form changes when the scene needs climbing, underwater movement, social stealth, or a specific sense.',
    },
    {
      question: 'Should my familiar have its own VTT token?',
      answer:
        'Yes, if it is active on the map. A separate token prevents arguments about range, Help position, touch delivery, and whether enemies can see or target it.',
    },
  ],
  relatedSlugs: ['dnd-mage-armor', 'dnd-counterspell', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndThunderclapArticleZh: BlogPost = {
  slug: 'dnd-thunderclap',
  title: 'DND 雷鸣拍击（Thunderclap）指南：2014/2024 规则、范围与 VTT 标记',
  seoTitle: 'DND 雷鸣拍击（Thunderclap）指南：2014/2024 规则、范围与 VTT 标记',
  metaDescription:
    '一篇适合桌边核对的 DND 雷鸣拍击（Thunderclap）指南，讲清 2014/2024 规则、5 英尺散发、100 英尺声音、盟友风险、伤害成长、FAQ 和 VTT Token 标记。',
  excerpt:
    '一篇实用 DND 雷鸣拍击（Thunderclap）指南，说明 5 英尺散发、100 英尺声音、盟友风险、2014/2024 差异、FAQ 和 VTT Token 标记。',
  publishedAt: DND_THUNDERCLAP_UPDATED_AT,
  updatedAt: DND_THUNDERCLAP_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '法术指南',
  coverImage: DND_THUNDERCLAP_COVER_PATH,
  coverAlt:
    'DND 雷鸣拍击（Thunderclap）指南封面图，VTT 战斗地图上的风暴施法者（storm caster）Token 向邻近敌人 Token 释放蓝色雷鸣爆发',
  bodyHtml: dndThunderclapArticleHtmlZh,
  faqItems: [
    {
      question: '雷鸣拍击（Thunderclap）好用吗？',
      answer:
        '当多个敌人已经贴近你，并且 100 英尺声音不会破坏潜入时，雷鸣拍击（Thunderclap）好用。若盟友也在范围里，或者你需要安静，它就不是好选择。',
    },
    {
      question: '雷鸣拍击会打到施法者吗？',
      answer:
        '通常不会。2024 散发（Emanation）源点默认被排除，除非施法者选择包含源点；2014 文本也写的是除你之外的生物。',
    },
    {
      question: '雷鸣拍击会打到盟友吗？',
      answer:
        '会。雷鸣拍击会影响区域内的盟友、魔宠、召唤物、坐骑和 NPC，所以在 VTT 上先画出 5 英尺散发再掷骰更清楚。',
    },
    {
      question: '雷鸣拍击是 100 英尺伤害法术吗？',
      answer:
        '不是。100 英尺描述的是声音能传到多远。真正造成伤害的是施法者周围的短距离爆发。',
    },
    {
      question: '雷鸣拍击使用什么豁免？',
      answer:
        '雷鸣拍击使用体质豁免（Constitution saving throw）。豁免失败时受到雷鸣伤害（Thunder damage），豁免成功时不受伤害。',
    },
    {
      question: '雷鸣拍击如何随等级成长？',
      answer: '雷鸣拍击起始造成 1d6 雷鸣伤害，5 级 2d6、11 级 3d6、17 级 4d6。',
    },
    {
      question: '雷鸣拍击需要专注吗？',
      answer: '不需要。雷鸣拍击持续时间是瞬时（Instantaneous），不需要专注。',
    },
    {
      question: '哪些职业能获得雷鸣拍击？',
      answer:
        '常见法术列表里，吟游诗人（Bard）、德鲁伊（Druid）、术士（Sorcerer）、契术师（Warlock）和法师（Wizard）可以取得 Thunderclap，魔械师（Artificer）也出现在常用 5e 参考资料中。最终以你桌面采用的规则来源为准。',
    },
    {
      question: 'VTT 上应该怎样显示雷鸣拍击？',
      answer:
        '在施法者 Token 周围放一个 5 英尺爆发标记，确认标记内每个生物，掷骰前先点名可能被误伤的盟友，再进行体质豁免。',
    },
  ],
  relatedSlugs: ['dnd-find-familiar', 'dnd-bless', 'dnd-counterspell', 'dnd-classes-explained'],
};

const dndFindFamiliarArticleZh: BlogPost = {
  slug: 'dnd-find-familiar',
  title: 'DND 找寻魔宠（Find Familiar）指南：规则、用法与 VTT Token',
  seoTitle: 'DND 找寻魔宠（Find Familiar）指南：规则、用法与 VTT Token',
  metaDescription:
    '快速看懂 DND 找寻魔宠（Find Familiar）：2014/2024 差异、魔宠形态、协助（Help）动作、接触法术、侦察、FAQ 和 VTT Token 设置。',
  excerpt:
    '一篇实用 DND 找寻魔宠（Find Familiar）指南，讲清 2014/2024 规则差异、魔宠形态、协助（Help）、接触法术、侦察、FAQ 和 VTT Token 设置。',
  publishedAt: DND_FIND_FAMILIAR_UPDATED_AT,
  updatedAt: DND_FIND_FAMILIAR_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '法术指南',
  coverImage: DND_FIND_FAMILIAR_COVER_PATH,
  coverAlt:
    'DND 找寻魔宠（Find Familiar）指南封面图，桌面战斗地图上有法师（Wizard）Token、魔宠 Token、法术书、d20 骰子和 VTT 侦察标记',
  bodyHtml: dndFindFamiliarArticleHtmlZh,
  faqItems: [
    {
      question: '找寻魔宠（Find Familiar）是法师（Wizard）法术吗？',
      answer:
        '通常是。找寻魔宠（Find Familiar）在常规列表里主要属于法师（Wizard）。其他角色可能通过特性、专长、子职业、魔法物品或桌面选项取得。',
    },
    {
      question: '魔宠能攻击吗？',
      answer:
        '不能。普通找寻魔宠（Find Familiar）魔宠不能攻击，但可以执行其他普通动作。某些职业特性可能改变这一点。',
    },
    {
      question: '魔宠能使用协助（Help）动作吗？',
      answer:
        '可以。魔宠不能攻击，但可以采取其他动作，协助（Help）属于常见动作。桌面仍然需要合理的位置、目标和时机。',
    },
    {
      question: '魔宠能离你多远？',
      answer:
        '先记住 100 英尺。心灵感应、借用感官和接触法术传递都围绕这个距离。魔宠可以物理上走得更远，但超出后你会失去这些连接收益。',
    },
    {
      question: '找寻魔宠（Find Familiar）需要专注吗？',
      answer: '魔宠出现后不需要。找寻魔宠的持续时间是瞬时，但 2024 长时间施法规则仍要求你在施法期间保持专注。',
    },
    {
      question: '魔宠降到 0 HP 会怎样？',
      answer:
        '它会消失，并把穿戴或携带的东西留在原地。之后想让它回来，需要再次施放 Find Familiar。',
    },
    {
      question: '可以同时有多个魔宠吗？',
      answer:
        '不可以。同一时间只能有一个魔宠。已有魔宠时再次施放，会按法术文本改变或替换当前魔宠。',
    },
    {
      question: '最好的魔宠形态是什么？',
      answer:
        '很多桌面里，飞行侦察型魔宠最通用，比如猫头鹰（owl）。但如果场景需要攀爬、水下移动、城市隐蔽或特殊感官，最佳形态会变。',
    },
    {
      question: '魔宠需要自己的 VTT Token 吗？',
      answer:
        '只要它在地图上活动，就应该有。独立 Token 能减少距离、协助（Help）、接触传递和敌人能否看见它的争论。',
    },
  ],
  relatedSlugs: ['dnd-mage-armor', 'dnd-counterspell', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndGlaiveArticle: BlogPost = {
  slug: 'dnd-glaive',
  title: 'Glaive DnD Guide: 5e Stats, Reach, Graze, and VTT Tips',
  seoTitle: 'Glaive DnD Guide: 5e Stats, Reach, Graze, and VTT Tips',
  metaDescription:
    'Check the DnD glaive stats, 2014 vs 2024 rules, Reach, Graze, best users, glaive vs halberd notes, FAQ, and VTT token tips for Roll20 and Foundry.',
  excerpt:
    'A practical dnd glaive weapon guide covering 5e stats, 2014/2024 rules, Reach, Graze, polearm comparisons, best users, FAQ, and VTT token tips.',
  publishedAt: DND_GLAIVE_UPDATED_AT,
  updatedAt: DND_GLAIVE_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Weapon Guide',
  coverImage: DND_GLAIVE_COVER_PATH,
  coverAlt:
    'dnd glaive guide cover showing a polearm fighter token, a glaive, dice, reach markers, and VTT token frames on a tabletop battle map',
  bodyHtml: dndGlaiveArticleHtml,
  faqItems: [
    {
      question: 'How much damage does a glaive do in DnD?',
      answer: 'A glaive deals 1d10 slashing damage.',
    },
    {
      question: 'Is a glaive a martial weapon?',
      answer:
        'Yes. A glaive is a martial melee weapon, so your character needs martial weapon proficiency or another feature that grants proficiency with it.',
    },
    {
      question: 'Does a glaive have Graze in 2024 DnD?',
      answer:
        'Yes. In 2024 rules, the glaive has Graze as its weapon mastery property. The character still needs weapon mastery access to use it.',
    },
    {
      question: 'Does a glaive have Reach?',
      answer:
        'Yes. Reach adds 5 feet to your reach for attacks with the glaive and for opportunity attacks with it.',
    },
    {
      question: 'Is a glaive better than a halberd?',
      answer:
        'In 2014 rules, the glaive and halberd have the same core stats. In 2024 rules, the glaive has Graze while the halberd has Cleave, so the better choice depends on whether you want miss damage or extra-target pressure.',
    },
    {
      question: 'Can you use a shield with a glaive?',
      answer:
        'No for normal attacks. The glaive has the Two-Handed property, so it requires two hands when you attack with it.',
    },
    {
      question: 'Is a glaive good for a Rogue?',
      answer:
        'Usually no. A glaive is not a finesse or ranged weapon, so it does not fit normal Sneak Attack weapon requirements.',
    },
  ],
  relatedSlugs: ['dnd-mace', 'rapier-dnd', 'dnd-shortsword', 'dnd-armor-guide'],
};

const dndGlaiveArticleZh: BlogPost = {
  slug: 'dnd-glaive',
  title: 'DND 长柄刀（Glaive）指南：5e 数据、触及（Reach）、擦伤（Graze）与 VTT Token 建议',
  seoTitle: 'DND 长柄刀（Glaive）指南：5e 数据、触及（Reach）、擦伤（Graze）与 VTT 建议',
  metaDescription:
    '快速核对 DND 长柄刀（Glaive）：1d10 挥砍、重型（Heavy）、触及（Reach）、双手（Two-Handed）、2024 擦伤（Graze）、FAQ 和 VTT Token 建议。',
  excerpt:
    '一篇实用 DND 长柄刀（Glaive）指南，讲清 5e 数据、2014/2024 差异、触及（Reach）、擦伤（Graze）、武器对比、FAQ 和 VTT Token 建议。',
  publishedAt: DND_GLAIVE_UPDATED_AT,
  updatedAt: DND_GLAIVE_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '武器指南',
  coverImage: DND_GLAIVE_COVER_PATH,
  coverAlt:
    'DND 长柄刀（Glaive）指南封面图，桌面战斗地图上有长柄武器战士 Token、长柄刀、骰子、触及范围标记和 VTT Token 边框',
  bodyHtml: dndGlaiveArticleHtmlZh,
  faqItems: [
    {
      question: 'DND 长柄刀造成多少伤害？',
      answer: '长柄刀造成 1d10 挥砍伤害。',
    },
    {
      question: '长柄刀是军用武器吗？',
      answer:
        '是。长柄刀是军用近战武器，角色需要军用武器熟练，或通过其他特性获得对应熟练。',
    },
    {
      question: '2024 DnD 里长柄刀有 Graze 吗？',
      answer:
        '有。2024 规则里，长柄刀的武器掌握是擦伤（Graze），但角色仍然需要能使用该武器掌握的特性或选项。',
    },
    {
      question: '长柄刀有 Reach 吗？',
      answer:
        '有。触及（Reach）让你用长柄刀攻击时的触及距离增加 5 英尺，也影响你用它进行借机攻击时的触及距离。',
    },
    {
      question: '长柄刀比戟更好吗？',
      answer:
        '2014 规则里两者核心数据相同。2024 规则里，长柄刀是 Graze，戟是 Cleave，选择取决于你更想要未命中擦伤，还是第二目标压力。',
    },
    {
      question: '长柄刀可以配盾吗？',
      answer:
        '正常攻击时不行。长柄刀有双手（Two-Handed）属性，攻击时需要两只手。',
    },
    {
      question: '游荡者（Rogue）适合用长柄刀吗？',
      answer:
        '通常不适合。长柄刀不是灵巧武器，也不是远程武器，所以不符合普通偷袭（Sneak Attack）武器要求。',
    },
  ],
  relatedSlugs: ['dnd-mace', 'rapier-dnd', 'dnd-shortsword', 'dnd-armor-guide'],
};

const dndSilveryBarbsArticle: BlogPost = {
  slug: 'dnd-silvery-barbs',
  title: 'Silvery Barbs DnD Guide: 2014 vs 2024 Rules, Source, and VTT Tips',
  seoTitle: 'Silvery Barbs DnD Guide: 2014 vs 2024 Rules and VTT Tips',
  metaDescription:
    'Check dnd silvery barbs rules, Strixhaven source, 2014 vs 2024 table handling, Legendary Resistance, advantage timing, FAQ, and VTT token tips.',
  excerpt:
    'A practical dnd silvery barbs guide covering Strixhaven source access, 2014/2024 table handling, Legendary Resistance, reroll timing, DM approval, FAQ, and VTT token markers.',
  publishedAt: DND_SILVERY_BARBS_UPDATED_AT,
  updatedAt: DND_SILVERY_BARBS_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_SILVERY_BARBS_COVER_PATH,
  coverAlt:
    'dnd silvery barbs guide cover showing silver reaction magic between VTT tokens, d20 dice, spell notes, and an advantage marker on a tabletop battle map',
  bodyHtml: dndSilveryBarbsArticleHtml,
  faqItems: [
    {
      question: 'Is Silvery Barbs official DnD content?',
      answer:
        'Yes. Silvery Barbs is official DnD content from Strixhaven: A Curriculum of Chaos, but it is setting-expanded content, so the DM decides whether it is available.',
    },
    {
      question: 'Is Silvery Barbs in the 2024 Free Rules?',
      answer:
        'No. Silvery Barbs is not printed in the 2024 Free Rules spell list. Use it only if your DM allows Strixhaven or expanded source content.',
    },
    {
      question: "Is Silvery Barbs in the 2014 Player's Handbook?",
      answer:
        "No. Silvery Barbs was introduced in Strixhaven: A Curriculum of Chaos, not the 2014 Player's Handbook.",
    },
    {
      question: 'Does Silvery Barbs require concentration?',
      answer:
        'No. Silvery Barbs does not require concentration, so it can be used while the caster is maintaining another concentration spell.',
    },
    {
      question: 'Can Silvery Barbs cancel a critical hit?',
      answer:
        'It can force the creature to reroll the successful attack roll and use the lower result. If the lower result is no longer a critical hit or no longer hits, the outcome changes.',
    },
    {
      question: 'Does Silvery Barbs work on Legendary Resistance?',
      answer:
        'No. Silvery Barbs cannot negate Legendary Resistance because Legendary Resistance turns a failed save into a success after the roll has already failed.',
    },
    {
      question: 'Is Silvery Barbs the same as disadvantage?',
      answer:
        'No. It is a reroll effect, not the Disadvantage condition. That difference matters for rules that care about advantage or disadvantage.',
    },
    {
      question: 'Should DMs ban Silvery Barbs?',
      answer:
        'Not automatically. DMs should decide before play whether Strixhaven content fits the campaign and whether this reaction makes the table more fun or more frustrating.',
    },
  ],
  relatedSlugs: ['dnd-counterspell', 'dnd-bard-spells', 'dnd-ranger-spells', 'dnd-bless'],
};

const dndShortswordArticle: BlogPost = {
  slug: 'dnd-shortsword',
  title: 'DnD Shortsword Guide: 2014 vs 2024 Stats, Vex, Nick, and Sneak Attack',
  seoTitle: 'Shortsword DnD Guide: 2014 vs 2024 Rules and Vex',
  metaDescription:
    'Check DnD shortsword stats for 2014 and 2024, then learn Finesse, Light, Vex, Nick pairings, Sneak Attack, weapon comparisons, and attack timing.',
  excerpt:
    'A table-ready dnd shortsword guide covering 1d6 Finesse and Light stats, 2014/2024 Vex rules, Sneak Attack, dual-wielding choices, and VTT token tracking.',
  publishedAt: DND_SHORTSWORD_UPDATED_AT,
  updatedAt: DND_SHORTSWORD_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'Equipment Guide',
  coverImage: DND_SHORTSWORD_COVER_PATH,
  coverAlt:
    'dnd shortsword guide cover showing a rogue token with a shortsword, dice, character sheet notes, and VTT token frames on a dungeon tabletop',
  bodyHtml: dndShortswordArticleHtml,
  faqItems: [
    {
      question: 'Is a shortsword a simple or martial weapon?',
      answer:
        'A shortsword is a martial melee weapon in both 2014 and 2024. A character still needs the right proficiency to add their Proficiency Bonus to attack rolls with it.',
    },
    {
      question: 'Can you use Dexterity with a shortsword?',
      answer:
        'Yes. Finesse lets you choose Dexterity or Strength for the attack, and you use the same ability for the damage roll on that attack.',
    },
    {
      question: 'Can a shortsword trigger Sneak Attack?',
      answer:
        'Yes. A shortsword qualifies for Sneak Attack because it has Finesse, but the Rogue still needs the normal Sneak Attack conditions.',
    },
    {
      question: 'Does a shortsword have Nick in 2024?',
      answer:
        'No. The shortsword has Vex, not Nick. Daggers and scimitars are the common Nick partners in a 2024 Light-weapon setup.',
    },
    {
      question: 'Does Vex give Advantage on the same shortsword attack that hits?',
      answer:
        'No. Vex does not give Advantage to the attack that triggered it. It waits for the next attack against the same target before the end of your next turn.',
    },
    {
      question: 'Can you dual-wield a shortsword and rapier under the basic rules?',
      answer:
        'Not through the normal Light extra-attack rule. The rapier is not Light, so the pair does not qualify unless another rule changes the requirements.',
    },
    {
      question: 'Is a shortsword better than a rapier?',
      answer:
        'It depends on the turn. A rapier is better for one stronger Finesse hit. A shortsword is better when Light weapon sequencing, Vex timing, or a dagger/scimitar follow-up matters.',
    },
  ],
  relatedSlugs: ['rapier-dnd', 'dnd-dagger', 'dnd-mace', 'dnd-classes-explained'],
};

const dndBlessArticle: BlogPost = {
  slug: 'dnd-bless',
  title: 'Bless DnD Guide: 2014 vs 2024 Rules, Best Targets, and VTT Tips',
  seoTitle: 'Bless DnD Guide: 2014 vs 2024 Rules and Best Uses',
  metaDescription:
    'Learn dnd bless rules fast: 2014 vs 2024 components, who to target, what the d4 applies to, common mistakes, FAQ, dice roller, and VTT token tips.',
  excerpt:
    'A practical dnd bless guide covering 2014/2024 spell rules, the 2024 holy symbol component, target priority, common mistakes, FAQ, dice roller use, and VTT token markers.',
  publishedAt: DND_BLESS_UPDATED_AT,
  updatedAt: DND_BLESS_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_BLESS_COVER_PATH,
  coverAlt:
    'dnd bless guide cover showing golden Bless magic over three ally tokens, a d4, a holy symbol, and VTT token frames on a tabletop battle map',
  bodyHtml: dndBlessArticleHtml,
  faqItems: [
    {
      question: 'Does Bless add to damage in DnD?',
      answer:
        'No. Bless adds 1d4 to attack rolls and saving throws. It does not add to damage rolls, Armor Class, initiative, or ability checks.',
    },
    {
      question: 'Does Bless work on every attack roll?',
      answer:
        'Yes. While the spell lasts and concentration holds, a blessed target can add 1d4 whenever that target makes an attack roll or saving throw.',
    },
    {
      question: 'What changed for Bless in DnD 2024?',
      answer:
        'The visible 2024 change is the material component: Bless uses a holy symbol worth 5+ GP instead of a sprinkling of holy water.',
    },
    {
      question: 'Is the 2024 holy symbol consumed by Bless?',
      answer:
        'No. Bless does not say it consumes the holy symbol, so the component is not consumed by the spell.',
    },
    {
      question: 'Does Bless stack with another Bless?',
      answer:
        'No. Multiple castings of the same spell do not give the same target multiple Bless d4s.',
    },
    {
      question: 'Who should receive Bless first?',
      answer:
        'Prioritize characters who make repeated attack rolls, characters likely to face dangerous saving throws, and allies who are already maintaining concentration.',
    },
  ],
  relatedSlugs: ['dnd-ranger-spells', 'dnd-bard-spells', 'dnd-counterspell', 'dnd-constitution-guide'],
};

const rapierDndArticle: BlogPost = {
  slug: 'rapier-dnd',
  title: 'Rapier DnD Guide: Stats, 2014 vs 2024 Rules, Best Users, and VTT Token Tips',
  seoTitle: 'Rapier DnD Guide: 5e Stats, Vex, Best Users, and VTT Tips',
  metaDescription:
    'Check rapier DnD stats, 2014 vs 2024 rules, Finesse, Vex, Sneak Attack fit, dual-wielding limits, FAQ, and VTT token tips.',
  excerpt:
    'A table-ready rapier DnD guide for 1d8 Finesse stats, 2014/2024 Vex rules, Sneak Attack, dual-wielding mistakes, and VTT token tips.',
  publishedAt: DND_RAPIER_UPDATED_AT,
  updatedAt: DND_RAPIER_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Equipment Guide',
  coverImage: DND_RAPIER_COVER_PATH,
  coverAlt:
    'rapier dnd guide cover showing a duelist token, rapier, dice, character sheet notes, and VTT token frames on a dungeon tabletop',
  bodyHtml: rapierDndArticleHtml,
  faqItems: [
    {
      question: 'Is a rapier a Finesse weapon in DnD?',
      answer:
        'The rapier has Finesse, so you can use Strength or Dexterity for attack and damage rolls as long as the same ability is used for both rolls on that attack.',
    },
    {
      question: 'Can a Rogue Sneak Attack with a rapier?',
      answer:
        'A rapier qualifies for Sneak Attack because it is a Finesse weapon, but the Rogue still needs the normal Sneak Attack conditions.',
    },
    {
      question: 'Is a rapier a Light weapon?',
      answer:
        'No. A rapier has Finesse, but it does not have Light. Basic two-weapon fighting does not treat it like a shortsword, scimitar, or dagger.',
    },
    {
      question: 'Does rapier have Vex in DnD 2024?',
      answer:
        'The 2024 rapier has the Vex weapon mastery property, but a character still needs a feature or option that lets them use that mastery.',
    },
    {
      question: 'Does Vex give Advantage on the same rapier attack?',
      answer:
        'Vex applies after you hit and deal damage, setting up Advantage on your next attack roll against that creature before the end of your next turn.',
    },
    {
      question: 'Does rapier + dagger automatically give a bonus attack?',
      answer:
        'No. Under the basic two-weapon rules, both weapons need the required Light setup. The dagger is Light, but the rapier is not.',
    },
  ],
  relatedSlugs: ['dnd-dagger', 'dnd-mace', 'dnd-classes-explained', 'dnd-armor-guide'],
};

const dndGhostArticleZh: BlogPost = {
  slug: 'dnd-ghost',
  title: 'dnd ghost 指南：幽灵机制、附身跑法与遭遇设计',
  seoTitle: 'dnd ghost 指南：幽灵机制与附身跑法',
  metaDescription:
    'dnd ghost 不只是会附身的幽灵。这篇讲清核心规则、Possession 裁定、鬼屋线索、遭遇节奏和 Token 制作。',
  excerpt:
    'dnd ghost 不适合当普通怪物硬打。先看它为什么危险，再用穿墙、恐惧、附身和未完成执念，把幽灵遭遇跑得有线索、有压迫感。',
  publishedAt: DND_GHOST_UPDATED_AT,
  updatedAt: DND_GHOST_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '怪物百科',
  coverImage: DND_GHOST_COVER_PATH,
  coverAlt:
    'dnd ghost 指南封面图，幽灵从 VTT Token 圆框里升起，背景是闹鬼桌面地图',
  bodyHtml: dndGhostArticleHtmlZh,
  faqItems: [
    {
      question: 'dnd ghost 是 undead 吗？',
      answer:
        '是，dnd ghost 是 undead。这会影响所有关心生物类型的法术、特性和桌面裁定。',
    },
    {
      question: 'dnd ghost 可以穿墙吗？',
      answer:
        '可以，dnd ghost 的标志之一就是能穿过物体和障碍，具体按你使用的规则数据执行。地图要让穿墙移动真的有意义。',
    },
    {
      question: 'dnd ghost 可以附身玩家角色吗？',
      answer:
        '可以，经典 dnd ghost 可以在类人生物豁免失败后进行 Possession。使用前要决定队伍如何应对，以及被影响玩家如何继续参与。',
    },
    {
      question: '几级队伍适合打 dnd ghost？',
      answer:
        'dnd ghost 通常适合作为低到中等级队伍的认真威胁，但魔法武器、豁免、Turn Undead、地图和附身裁定都会改变难度。',
    },
    {
      question: '怎样让 ghost 可怕但不显得强行？',
      answer:
        '先用线索、附身压力、移动和后果制造恐惧，再考虑伤害。给玩家预警和反应选项，恐惧才来自选择。',
    },
  ],
  relatedSlugs: ['dnd-necromancer-spells', 'dnd-demons', 'dnd-counterspell', 'dnd-dagger'],
};

const spectatorDndArticle: BlogPost = {
  slug: 'spectator-dnd',
  title: 'Spectator DnD: Guardian Rules, Eye Rays, and VTT Tokens',
  seoTitle: 'Spectator DnD Guide: Guardian Rules, Eye Rays, and VTT Tokens',
  metaDescription:
    'Run a Spectator in DnD with clean 2014/2024 rule boundaries, guardian orders, eye-ray pressure, Spell Reflection, and readable VTT tokens.',
  excerpt:
    'Turn a spectator into a clear guardian encounter: define what it protects, choose 2014 or 2024 rules, shape the room, and crop the VTT token.',
  publishedAt: SPECTATOR_DND_UPDATED_AT,
  updatedAt: SPECTATOR_DND_UPDATED_AT,
  readTime: '9 min read',
  coverLabel: 'Monster Tactics',
  coverImage: SPECTATOR_DND_COVER_PATH,
  coverAlt:
    'Spectator DnD guide cover showing a four-eyestalk floating guardian over a locked treasure vault on a VTT battle-map grid',
  bodyHtml: spectatorDndArticleHtml,
  relatedSlugs: ['dnd-flumph', 'dnd-counterspell', 'dnd-death-knight', 'dnd-dagger'],
};

const playersHandbookDnd5eArticle: BlogPost = {
  slug: 'players-handbook-dnd-5e',
  title: "D&D Player's Handbook: Choose 5e (2014) or 5.5e (2024)",
  seoTitle: "D&D 5e Player's Handbook: 2014 or 2024, Which One?",
  metaDescription:
    "Compare the 2014 5e and 2024 5.5e books, confirm your campaign's ruleset, find the legal free rules, and read the right sections before play.",
  excerpt:
    'Choose the handbook that matches your campaign, keep 2014 5e and 2024 5.5e rules separate, use legal free rules, and read only what session one needs.',
  publishedAt: PLAYERS_HANDBOOK_DND_5E_UPDATED_AT,
  updatedAt: PLAYERS_HANDBOOK_DND_5E_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'Rules Guide',
  coverImage: PLAYERS_HANDBOOK_DND_5E_COVER_PATH,
  coverAlt:
    "Two generic fantasy rulebooks labeled 5e 2014 and 5.5e 2024 beside dice and a character sheet, illustrating a Player's Handbook version choice",
  bodyHtml: playersHandbookDnd5eArticleHtml,
  faqItems: [
    {
      question: "Is the 2014 Player's Handbook still valid?",
      answer:
        'Yes. D&D Beyond labels the 2014 book as legacy 5e content and continues to support it. It remains the correct rulebook for a campaign that uses the 2014 rules. A table can move to 5.5e, but the newer handbook does not retroactively change an existing campaign.',
    },
    {
      question: "Is the 2024 Player's Handbook D&D 5e or 5.5e?",
      answer:
        'D&D Beyond currently labels the 2024 revised rules as 5.5e and the 2014 rules as 5e. The 2024 book still belongs to the fifth-edition rules family and is designed to work with older fifth-edition material under its compatibility guidance.',
    },
    {
      question: 'Can 2014 and 2024 characters play in the same campaign?',
      answer:
        'They can when the DM permits it and the table follows the compatibility guidance. Each character should use one base ruleset, and every older option should have an approved source. Compatibility is not permission to combine the strongest wording from both versions.',
    },
    {
      question: "Does every player need a Player's Handbook?",
      answer:
        'No rule requires every person to own a separate copy. Every player does need reliable access to the rules and character options used at the table. Official free rules can cover a complete starting character, while a shared or personal handbook gives the group more options and faster reference.',
    },
    {
      question: "Can I download the D&D 5e Player's Handbook PDF for free?",
      answer:
        "Wizards of the Coast does not offer the complete paid Player's Handbook as a free PDF. Use the official 2014 Basic Rules or 2024 Free Rules for legal free access. Avoid unexplained full-book downloads, which can be unauthorized, outdated, or missing errata.",
    },
  ],
  relatedSlugs: ['dnd-stats', 'dnd-classes-explained', 'dnd-races', 'dnd-paladin'],
};

const playersHandbookDnd5eArticleZh: BlogPost = {
  slug: 'players-handbook-dnd-5e',
  title: 'DND《玩家手册》怎么选：5e 与 5.5e 版本指南',
  seoTitle: 'DND《玩家手册》指南：5e 与 5.5e 版本怎么选',
  metaDescription:
    '分清 2014 年 5e 与 2024 年 5.5e《玩家手册》，按当前战役选择规则，了解首场游戏前该读哪些章节，以及哪里能合法查看免费规则。',
  excerpt:
    '按战役版本选择《玩家手册》，分清 2014 年 5e 与 2024 年 5.5e 的建卡边界，使用官方免费规则并完成首场游戏准备。',
  publishedAt: PLAYERS_HANDBOOK_DND_5E_UPDATED_AT,
  updatedAt: PLAYERS_HANDBOOK_DND_5E_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: '规则手册',
  coverImage: PLAYERS_HANDBOOK_DND_5E_COVER_PATH,
  coverAlt: '两本分别标注 5e 2014 和 5.5e 2024 的奇幻规则书放在骰子与角色卡旁，用于说明《玩家手册》版本选择',
  bodyHtml: playersHandbookDnd5eArticleHtmlZh,
  faqItems: [
    {
      question: '2014 版《玩家手册》现在还能用吗？',
      answer:
        '能。D&D Beyond 把 2014 版标为旧版 5e 内容，并继续提供支持。使用 2014 规则的战役仍应以它为准；除非整桌同意迁移，2024 版不会自动改写正在进行的战役。',
    },
    {
      question: '2024 版《玩家手册》属于 5e 还是 5.5e？',
      answer:
        'D&D Beyond 目前把 2024 修订规则标为 5.5e，把 2014 规则标为 5e。2024 版仍属于第五版规则体系，并通过兼容规则使用较早的第五版内容。',
    },
    {
      question: '2014 版和 2024 版角色能在同一场战役里玩吗？',
      answer:
        '可以，但必须得到 DM 许可并遵守兼容说明。每个角色应以一套基础规则为准，每个旧选项都要有获准来源。兼容不等于能把两个版本里最有利的措辞拼到一起。',
    },
    {
      question: '每位玩家都要有一本《玩家手册》吗？',
      answer:
        '规则没有要求每人单独拥有一本。每位玩家都需要稳定查到本桌使用的规则和角色选项。官方免费规则足以完成一个起始角色，共用或个人手册则能提供更多选项并提高查询效率。',
    },
    {
      question: '能免费下载完整的 DND 5e《玩家手册》PDF 吗？',
      answer:
        'Wizards of the Coast 没有把完整付费《玩家手册》作为免费 PDF 提供。需要合法免费内容时，使用官方 2014 基础规则或 2024 免费规则。来路不明的整书下载可能未经授权、已经过时或缺少勘误。',
    },
  ],
  relatedSlugs: ['dnd-stats', 'dnd-classes-explained', 'dnd-races', 'dnd-paladin'],
};

const dndPaladinArticle: BlogPost = {
  slug: 'dnd-paladin',
  title: 'DnD Paladin Turn Plan: When to Heal, Smite, or Protect',
  seoTitle: 'DnD Paladin Turn Plan: When to Heal, Smite, or Protect',
  metaDescription:
    'Use a simple combat decision tree for attacks, Lay on Hands, Divine Smite, concentration, and positioning without wasting your action economy.',
  excerpt:
    'Use a simple combat decision tree for attacks, Lay on Hands, Divine Smite, concentration, and positioning without wasting your action economy.',
  publishedAt: DND_PALADIN_UPDATED_AT,
  updatedAt: DND_PALADIN_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Paladin Guide',
  coverImage: DND_PALADIN_COVER_PATH,
  coverAlt:
    'Weathered DnD Paladin in worn plate armor holding a helmet beside a narrow window in a dark stone chamber',
  bodyHtml: dndPaladinArticleHtml,
  faqItems: [
    {
      question: 'Does a DnD Paladin need a god?',
      answer:
        'A fifth-edition Paladin is defined by an oath. The character can worship a god, serve a church, or frame the oath without a deity. Agree with the DM on how divine power and oaths work in the campaign setting.',
    },
    {
      question: 'What are the best stats for a Paladin?',
      answer:
        "Strength and Charisma are the current class's primary abilities. Constitution is the usual next priority for a front-line character. A Dexterity build needs an approved weapon, armor, and multiclass plan rather than copying the standard heavy-armor setup.",
    },
    {
      question: 'Which Paladin oath is best?',
      answer:
        'There is no universal best oath. Devotion is a clear protector, Glory rewards mobile heroic play, Ancients adds durability and control, and Vengeance focuses pressure on priority targets. Pick the oath whose job and promise will matter in your campaign.',
    },
    {
      question: 'How often can a 2024 Paladin use Divine Smite?',
      answer:
        "Divine Smite is an always-prepared Bonus Action spell used immediately after a melee weapon or Unarmed Strike hit. Paladin's Smite grants one casting without a spell slot per Long Rest; additional castings require available spell slots and follow the 2024 spellcasting rules.",
    },
    {
      question: 'Is Paladin beginner friendly?',
      answer:
        'Paladin is beginner friendly when you use a default attack-and-position turn and treat healing, Smite, and oath tools as deliberate branches. It becomes harder when every round starts with a search through the full spell list.',
    },
  ],
  relatedSlugs: ['paladin-2024-spells-dnd', 'dnd-stats', 'dnd-armor-guide', 'dnd-classes-explained'],
};

const dndPaladinArticleZh: BlogPost = {
  slug: 'dnd-paladin',
  title: '龙与地下城圣武士回合计划：何时治疗、惩击或保护队友？',
  seoTitle: '龙与地下城圣武士回合计划：何时治疗、惩击或保护队友？',
  metaDescription:
    '用简单的战斗决策流程安排攻击、圣疗、神圣惩击、维持专注与站位，在治疗、爆发和保护队友之间做出清楚选择，避免浪费行动资源。',
  excerpt:
    '用简单的战斗决策流程安排攻击、圣疗、神圣惩击、维持专注与站位，在治疗、爆发和保护队友之间做出清楚选择，避免浪费行动资源。',
  publishedAt: DND_PALADIN_UPDATED_AT,
  updatedAt: DND_PALADIN_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: 'Paladin 指南',
  coverImage: DND_PALADIN_COVER_PATH,
  coverAlt: '一名身穿磨损板甲的 DND Paladin 在昏暗石室窗边手按胸甲，臂弯抱着头盔',
  bodyHtml: dndPaladinArticleHtmlZh,
  faqItems: [
    {
      question: 'DND Paladin 圣武士必须信仰神明吗？',
      answer:
        '第五版 Paladin 的力量核心是誓言。角色可以信仰神明、服务教会，也可以不依附特定神祇来解释誓言。开团前与 DM 商定战役世界里的神圣力量和誓言怎样运作。',
    },
    {
      question: 'Paladin 最适合优先提高哪些属性？',
      answer:
        'Strength 与 Charisma 是当前职业列出的主要属性，前线角色通常再优先考虑 Constitution。Dexterity 构筑需要获准使用的武器、护甲与多职业计划，不能直接照搬标准重甲配置。',
    },
    {
      question: '哪个 Paladin 誓言最好？',
      answer:
        '没有适合所有队伍的最佳誓言。Devotion 是清楚的保护者，Glory 奖励机动的英雄式行动，Ancients 增加耐久与控制，Vengeance 集中压迫高优先级目标。选择会在本场战役中真正影响职责与承诺的誓言。',
    },
    {
      question: '2024 Paladin 多久能使用一次 Divine Smite？',
      answer:
        "Divine Smite 是近战武器或徒手打击命中后立刻使用的常备 Bonus Action 法术。Paladin's Smite 每次 Long Rest 提供一次不消耗法术位的施放；之后的施放需要可用法术位，并遵守 2024 施法规则。",
    },
    {
      question: 'Paladin 适合新手吗？',
      answer:
        '先准备一套默认攻击与站位回合，再把治疗、Smite 和誓言能力当成明确分支时，Paladin 很适合新手。如果每一轮都从完整法术表开始搜索，操作难度会迅速上升。',
    },
  ],
  relatedSlugs: ['paladin-2024-spells-dnd', 'dnd-stats', 'dnd-armor-guide', 'dnd-classes-explained'],
};

const dndArtificerArticle: BlogPost = {
  slug: 'dnd-artificer',
  title: 'Which DND Artificer Fits Your Party Job?',
  seoTitle: 'Which DND Artificer Fits Your Party Job?',
  metaDescription:
    'Choose an Artificer from the job your party needs: support, front line, ranged firepower, companion play, maps, or horror science.',
  excerpt:
    'Choose a current Artificer source, pick the party job you want to cover, compare all six subclasses, and make the character readable on a VTT map.',
  publishedAt: DND_ARTIFICER_UPDATED_AT,
  updatedAt: DND_ARTIFICER_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Artificer Guide',
  coverImage: DND_ARTIFICER_COVER_PATH,
  coverAlt:
    'A fantasy DND Artificer at a workshop bench with brass tools, a glowing blueprint, and a small construct companion',
  bodyHtml: dndArtificerArticleHtml,
  faqItems: [
    {
      question: 'Where is the current Artificer published?',
      answer:
        "The revised Artificer is published in the 2025 book Eberron: Forge of the Artificer and is compatible with the 2024 rules. It is not in the 2024 Player's Handbook.",
    },
    {
      question: 'What ability score matters most for an Artificer?',
      answer:
        "Intelligence is the Artificer's spellcasting ability in the revised class. After that, choose scores that support the job, armor, movement, and survival needs of the character you are actually building.",
    },
    {
      question: 'Which Artificer subclass is best?',
      answer:
        'There is no universal best choice. Pick the subclass whose job fills a real gap in your party and fits the kind of turns you enjoy taking.',
    },
    {
      question: 'Is Cartographer an official Artificer subclass?',
      answer:
        'Yes. Cartographer appears with the revised Artificer in Eberron: Forge of the Artificer.',
    },
    {
      question: 'Can I use a 2014 Artificer in a 2024 campaign?',
      answer:
        'Ask the DM. Older Artificer material is common, but a table using the revised class should decide exactly which source and compatibility rules apply before character creation.',
    },
  ],
  relatedSlugs: ['dnd-5e-armorer', 'dnd-stats', 'dnd-classes-explained'],
};

const dndArtificerArticleZh: BlogPost = {
  slug: 'dnd-artificer',
  title: '哪个 DND Artificer 最适合你的队伍职责？',
  seoTitle: '哪个 DND Artificer 最适合你的队伍职责？',
  metaDescription:
    '按队伍实际需要选择 Artificer：支援、前线、远程火力、构装伙伴、地图探索或惊悚工坊。',
  excerpt:
    '先确定当前 Artificer 来源，再按队伍职责选择六个子职业之一，完成能在 VTT 地图上清楚辨认的角色构筑。',
  publishedAt: DND_ARTIFICER_UPDATED_AT,
  updatedAt: DND_ARTIFICER_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: 'Artificer 指南',
  coverImage: DND_ARTIFICER_COVER_PATH,
  coverAlt: '一名 DND Artificer 坐在工坊工作台前，身边有黄铜工具、发光蓝图和小型构装伙伴',
  bodyHtml: dndArtificerArticleHtmlZh,
  faqItems: [
    {
      question: '当前 Artificer 收录在哪里？',
      answer:
        '修订后的 Artificer 收录在 2025 年出版的 Eberron: Forge of the Artificer，并兼容 2024 规则；它不在 2024 年的 Player\'s Handbook 本体中。',
    },
    {
      question: 'Artificer 最重要的属性是什么？',
      answer:
        '修订版 Artificer 用智力施法。之后再根据角色实际承担的职责、护甲、移动方式和生存需求决定其他属性。',
    },
    {
      question: '哪个 Artificer 子职业最好？',
      answer:
        '没有适合所有队伍的最佳子职业。选能补上真实队伍缺口、也符合你想反复进行的回合类型的那个。',
    },
    {
      question: 'Cartographer 是官方 Artificer 子职业吗？',
      answer:
        '是。Cartographer 与修订后的 Artificer 一起收录在 Eberron: Forge of the Artificer。',
    },
    {
      question: '2024 战役还能用 2014 版 Artificer 吗？',
      answer:
        '先问 DM。旧版 Artificer 很常见，但使用修订版的桌子应该在建卡前明确具体来源和兼容方式。',
    },
  ],
  relatedSlugs: ['dnd-5e-armorer', 'dnd-stats', 'dnd-classes-explained'],
};

const dndStatsArticle: BlogPost = {
  slug: 'dnd-stats',
  title: 'All Six DnD Stats Explained for Your First Character',
  seoTitle: 'All Six DnD Stats Explained for Your First Character',
  metaDescription:
    'Learn what all six DnD stats control, convert scores to modifiers, compare standard array, point cost, and 4d6, then assign them by class.',
  excerpt:
    'Read all six DnD stats, calculate modifiers, choose a generation method, and assign a workable level 1 array without mixing 2014 and 2024 rules.',
  publishedAt: DND_STATS_UPDATED_AT,
  updatedAt: DND_STATS_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Ability Scores',
  coverImage: DND_STATS_COVER_PATH,
  coverAlt:
    'A blank twenty-sided die surrounded by six fantasy objects representing the DnD ability scores on a candlelit table',
  bodyHtml: dndStatsArticleHtml,
  faqItems: [
    {
      question: 'What are the six stats in DnD?',
      answer:
        'The six DnD stats are Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. The rules also call them abilities or ability scores.',
    },
    {
      question: 'How do I calculate a DnD ability modifier?',
      answer:
        'Subtract 10 from the ability score, divide by 2, and round down. A score of 15 gives +2, while a score of 8 gives −1.',
    },
    {
      question: 'What is the DnD standard array?',
      answer:
        'The 2024 standard array is 15, 14, 13, 12, 10, and 8. Assign each number to a different ability, then apply the increases allowed by the character-creation rules you are using.',
    },
    {
      question: 'What is the best stat in DnD?',
      answer:
        "There is no universal best stat. The class's primary ability usually receives the highest score, while Constitution, Dexterity, and any secondary class ability compete for the remaining high numbers.",
    },
    {
      question: 'Is 4d6 drop lowest the default way to roll stats?',
      answer:
        'It is the random-generation method in the 2024 Free Basic Rules, but it is not the only character-creation method. Standard array and 27-point cost are also listed, and the DM can require one method for the campaign.',
    },
  ],
  relatedSlugs: ['dnd-constitution-guide', 'dnd-races', 'dnd-classes-explained'],
};

const dndStatsArticleZh: BlogPost = {
  slug: 'dnd-stats',
  title: '新手 DND 六项属性详解：完成你的第一个角色',
  seoTitle: '新手 DND 六项属性详解：完成你的第一个角色',
  metaDescription:
    '读懂力量、敏捷、体质、智力、感知与魅力，计算属性调整值，对比标准数组、27 点购点和 4d6 去最低，再按职业分配六项能力值。',
  excerpt:
    '读懂六项 DND 属性，换算调整值，选择生成方法，再按职业分配一组能用的 1 级属性，同时分清 2014 与 2024 规则。',
  publishedAt: DND_STATS_UPDATED_AT,
  updatedAt: DND_STATS_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '能力值指南',
  coverImage: DND_STATS_COVER_PATH,
  coverAlt: '烛光桌面上，一颗空白二十面骰被六件代表 DND 能力值的奇幻物品围绕',
  bodyHtml: dndStatsArticleHtmlZh,
  faqItems: [
    {
      question: 'DND 的六项属性是什么？',
      answer:
        'DND 的六项属性是力量、敏捷、体质、智力、感知和魅力。规则中也会把它们称为能力或能力值。',
    },
    {
      question: 'DND 属性调整值怎样计算？',
      answer: '属性值减 10，再除以 2 并向下取整。属性值 15 对应 +2，属性值 8 对应 −1。',
    },
    {
      question: 'DND 标准数组是什么？',
      answer:
        '2024 标准数组是 15、14、13、12、10、8。把六个数分别放入六项属性，再加入当前角色创建规则允许的属性提升。',
    },
    {
      question: 'DND 最好的属性是哪一项？',
      answer:
        '没有适合所有角色的最佳属性。职业主属性通常拿最高值，体质、敏捷与职业需要的第二属性再竞争其他高值。',
    },
    {
      question: '4d6 去最低是 DND 默认的属性生成方法吗？',
      answer:
        '它是 2024 免费基础规则中的随机生成方法，但不是唯一方法。规则还列出标准数组和 27 点购点，DM 可以要求整场战役统一采用其中一种。',
    },
  ],
  relatedSlugs: ['dnd-constitution-guide', 'dnd-races', 'dnd-classes-explained'],
};

const dndLanguagesArticle: BlogPost = {
  slug: 'dnd-languages',
  title: 'D&D Languages: One for Your Past, One for the Campaign',
  seoTitle: 'D&D Languages: One for Your Past, One for the Campaign',
  metaDescription:
    'Use four 2024 D&D questions to separate standard from rare languages, match the campaign, and turn your character’s past into a usable hook.',
  excerpt:
    'Choose two D&D languages for a 2024 character with a campaign-first checklist, clear 2014 boundaries, and VTT-ready character cues.',
  publishedAt: DND_LANGUAGES_UPDATED_AT,
  updatedAt: DND_LANGUAGES_UPDATED_AT,
  readTime: '9 min read',
  coverLabel: 'Character Guide',
  coverImage: DND_LANGUAGES_COVER_PATH,
  coverAlt:
    'An adventurer studies a multilingual route map with runic notes and a small party token nearby',
  bodyHtml: dndLanguagesArticleHtml,
  faqItems: [
    {
      question: 'How many languages does a 2024 D&D character know?',
      answer:
        'The 2024 Basic Rules says a character knows at least three: Common plus two languages rolled or chosen from the Standard Languages table. A class or another feature can add languages.',
    },
    {
      question: 'Can a 2024 character choose a rare language at level 1?',
      answer:
        'The basic character-creation step gives two choices from the Standard Languages table. Rare languages are separate, and some features grant them. Ask the DM before treating a rare language as a substitute for a standard starting choice.',
    },
    {
      question: 'Do D&D languages include reading and writing?',
      answer:
        'In the 2024 Basic Rules, knowing a language means your character can communicate in it, read it, and write it. Older books and campaign rules can frame language grants differently.',
    },
    {
      question: 'What are the best D&D languages to choose?',
      answer:
        'There is no best pair without a campaign. Take one language tied to your character’s past and one tied to likely places, people, or problems in the adventure.',
    },
  ],
  relatedSlugs: ['dnd-races', 'dnd-meaning', 'dnd-classes-explained'],
};

const dndLanguagesArticleZh: BlogPost = {
  slug: 'dnd-languages',
  title: 'DND 语言：一门写角色过去，一门留给战役',
  seoTitle: 'DND 语言：一门写角色过去，一门留给战役',
  metaDescription:
    '用四个问题分清 2024 的标准与异域语言：一门从角色过去出发，一门对准战役地点、人物或线索。',
  excerpt:
    '从角色过去和战役地点出发，选出两门真正有机会在桌上派上用场的 DND 语言，并分清 2014 与 2024 的规则流程。',
  publishedAt: DND_LANGUAGES_UPDATED_AT,
  updatedAt: DND_LANGUAGES_UPDATED_AT,
  readTime: '9 分钟阅读',
  coverLabel: '角色指南',
  coverImage: DND_LANGUAGES_COVER_PATH,
  coverAlt: '一名冒险者查看带有多种文字注记的路线地图，旁边放着小型队伍 Token',
  bodyHtml: dndLanguagesArticleHtmlZh,
  faqItems: [
    {
      question: '2024 版 DND 角色一开始会几门语言？',
      answer:
        '2024 基础规则写的是至少三门：Common 加上从标准语言表中掷出或选出的两门。职业或其他特性还可能再给语言。',
    },
    {
      question: '2024 角色一级能直接选异域语言吗？',
      answer:
        '基础角色创建步骤给的是两门标准语言。异域语言单独列出，有些特性会授予它们。想把异域语言当成标准起始选择的替代项，先问 DM。',
    },
    {
      question: 'DND 语言包含读和写吗？',
      answer:
        '2024 基础规则里，懂一门语言代表能交流、能读、能写。旧书和战役规则对语言来源的写法可能不同，按桌上实际版本处理。',
    },
    {
      question: 'DND 语言到底选哪两门最好？',
      answer:
        '脱离战役不存在最好的一对。先选一门来自角色过去的语言，再选一门和冒险地点、人物或问题有关的语言。',
    },
  ],
  relatedSlugs: ['dnd-races', 'dnd-meaning', 'dnd-classes-explained'],
};

const dndMeaningArticle: BlogPost = {
  slug: 'dnd-meaning',
  title: 'DnD meaning: what Dungeons & Dragons means in a game',
  seoTitle: 'DnD Meaning: What Dungeons & Dragons Means and How to Play',
  metaDescription:
    'DND usually means Do Not Disturb in texts. In gaming, D&D means Dungeons & Dragons. Learn the roles, dice, characters, and first-game steps.',
  excerpt:
    'DND can mean Do Not Disturb or Dungeons & Dragons. Learn what a D&D game actually looks like, from the DM and dice to your first character.',
  publishedAt: DND_MEANING_UPDATED_AT,
  updatedAt: DND_MEANING_UPDATED_AT,
  readTime: '8 min read',
  coverLabel: 'Beginner Guide',
  coverImage: DND_MEANING_COVER_PATH,
  coverAlt:
    'DnD meaning guide cover showing a Dungeon Master, four player character tokens, dice, a character sheet, and a tabletop map',
  bodyHtml: dndMeaningArticleHtml,
  faqItems: [
    {
      question: 'What does DND mean in a text message?',
      answer:
        'In a text message, DND usually means “Do Not Disturb.” It refers to a phone or messaging status that silences notifications. The surrounding conversation tells you whether someone instead means the tabletop game.',
    },
    {
      question: 'What does DnD mean in gaming?',
      answer:
        'In gaming, DnD usually names a tabletop role-playing game where players make characters and make choices in a shared fantasy adventure led by a Dungeon Master.',
    },
    {
      question: 'Is DnD hard for beginners?',
      answer:
        'DnD has rules, but a first session does not require mastering them all. Start with a character sheet, describe what your character tries to do, and ask the Dungeon Master to explain a rule when it matters.',
    },
    {
      question: 'Do you need miniatures or tokens to play?',
      answer:
        'No. Many groups play entirely through spoken description. Maps, miniatures, and VTT tokens are optional tools for scenes where position or visual identity helps.',
    },
    {
      question: 'What is the difference between a session and a campaign?',
      answer:
        'A session is one time the group plays. A campaign is a longer connected story made from multiple sessions, usually with the same characters and world.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-races', 'dnd-alignment-chart'],
};

const dndMeaningArticleZh: BlogPost = {
  slug: 'dnd-meaning',
  title: 'DND 是什么意思：游戏语境里的《龙与地下城》',
  seoTitle: 'DND 是什么意思：《龙与地下城》到底怎么玩',
  metaDescription:
    'DND 在消息里常指免打扰；在跑团语境里则是《龙与地下城》。用几分钟了解 DM、角色、骰子和第一次开团会发生什么。',
  excerpt:
    'DND 既可能指免打扰，也可能指《龙与地下城》。快速理解 DM、骰子、角色，以及第一次开团会发生什么。',
  publishedAt: DND_MEANING_UPDATED_AT,
  updatedAt: DND_MEANING_UPDATED_AT,
  readTime: '8 分钟阅读',
  coverLabel: '新手入门',
  coverImage: DND_MEANING_COVER_PATH,
  coverAlt: 'DND 是什么意思指南封面图：地下城主、四个玩家角色 Token、骰子、角色卡和桌面地图',
  bodyHtml: dndMeaningArticleHtmlZh,
  faqItems: [
    {
      question: '消息里的 DND 是什么意思？',
      answer:
        '消息里的 DND 通常是“免打扰”（Do Not Disturb），指手机或聊天软件静音通知的状态。具体对话如果在聊跑团，它也可能指这款桌面角色扮演游戏。',
    },
    {
      question: '游戏里的 DND 是什么意思？',
      answer:
        '游戏里的 DND 通常指桌面角色扮演游戏。玩家创建角色，在 DM 带领的共享奇幻冒险里做选择。',
    },
    {
      question: 'DND 对新手很难吗？',
      answer:
        'DND 有规则，但第一次游戏不需要把所有规则背下来。拿着角色卡，说出角色想做什么，规则出现时请 DM 解释即可。',
    },
    {
      question: '玩 DND 一定要模型或 Token 吗？',
      answer:
        '不一定。很多队伍完全靠口头描述游玩。地图、模型和 VTT Token 都是位置或视觉身份更重要时才会使用的可选工具。',
    },
    {
      question: 'DND 里的 Session 和 Campaign 有什么区别？',
      answer:
        'Session 是一次实际游戏。Campaign 是由多次 Session 组成的连续故事，通常跟随同一批角色和同一个世界。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-races', 'dnd-alignment-chart'],
};

const dndAlignmentChartArticle: BlogPost = {
  slug: 'dnd-alignment-chart',
  title: 'DnD Alignment Chart: Choose a Roleplay Compass That Can Change',
  seoTitle: "DnD Alignment Chart: Find Your Character's Moral Compass",
  metaDescription:
    'Use the DnD alignment chart to separate law from morality, compare all nine alignments, test one hard choice, and roleplay without stereotypes.',
  excerpt:
    'Read the nine alignments, judge order and morality separately, then pressure-test the result with one decision your character cannot dodge.',
  publishedAt: DND_ALIGNMENT_CHART_UPDATED_AT,
  updatedAt: DND_ALIGNMENT_CHART_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Alignment Chart',
  coverImage: DND_ALIGNMENT_CHART_COVER_PATH,
  coverAlt:
    'Nine original fantasy character portraits arranged as a DnD alignment chart from lawful good to chaotic evil',
  bodyHtml: dndAlignmentChartArticleHtml,
  relatedSlugs: ['dnd-races', 'dnd-classes-explained', 'dwelf-dnd', 'dnd-gnome-names'],
};

const dndAlignmentChartArticleZh: BlogPost = {
  slug: 'dnd-alignment-chart',
  title: 'DND 阵营九宫格：选择一个会随行动改变的角色坐标',
  seoTitle: 'DND 阵营九宫格：找到角色的道德与秩序坐标',
  metaDescription:
    '用 DND 阵营九宫格分开判断秩序与道德，对照九种阵营，再用一次艰难选择检验结果，把标签变成能持续扮演的行动。',
  excerpt:
    '读懂九种阵营，分别判断秩序与道德，再用角色无法回避的一次决定检验结果。',
  publishedAt: DND_ALIGNMENT_CHART_UPDATED_AT,
  updatedAt: DND_ALIGNMENT_CHART_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '阵营九宫格',
  coverImage: DND_ALIGNMENT_CHART_COVER_PATH,
  coverAlt: '九名原创奇幻角色按 DND 阵营九宫格排列，从守序善良延伸到混乱邪恶',
  bodyHtml: dndAlignmentChartArticleHtmlZh,
  relatedSlugs: ['dnd-races', 'dnd-classes-explained', 'dwelf-dnd', 'dnd-gnome-names'],
};

const dndRacesArticle: BlogPost = {
  slug: 'dnd-races',
  title: 'DnD Races: Which Species Fits Your Character?',
  seoTitle: 'DnD Races Explained: Which Species Fits Your Character?',
  metaDescription:
    'Compare DnD species traits, separate current and legacy rules, and turn your character concept into a choice that works at the table.',
  excerpt:
    'Compare all ten 2024 species, separate the 2014 race rules, and choose a character concept with four practical questions.',
  publishedAt: DND_RACES_UPDATED_AT,
  updatedAt: DND_RACES_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Character Species',
  coverImage: DND_RACES_COVER_PATH,
  coverAlt:
    'A party of DnD adventurers from different 2024 species gathered around a glowing tabletop map',
  bodyHtml: dndRacesArticleHtml,
  faqItems: [
    {
      question: "How many races are in the 2024 Player's Handbook?",
      answer:
        "The 2024 Player's Handbook presents ten core species: Aasimar, Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, and Tiefling.",
    },
    {
      question: 'Why does DnD now say species instead of race?',
      answer:
        'The 2024 core rulebooks use species for the game trait that older books called race. Both terms still appear in guides and table talk, so check the publication date and rules version whenever a guide says race.',
    },
    {
      question: 'What happened to Half-Elf and Half-Orc?',
      answer:
        'Half-Elf and Half-Orc appear in the 2014 core rules but are not separate species in the 2024 core list. A table can still permit older character options under its compatibility rules, so ask which sources are allowed.',
    },
    {
      question: 'What is the best DnD species for a beginner?',
      answer:
        'The best beginner choice is one whose traits you understand and whose character idea you want to play. Human, Dwarf, Halfling, and Orc can all support straightforward concepts, but no one species is required for a first character.',
    },
    {
      question: 'Do 2024 species give ability score increases?',
      answer:
        'No. In the 2024 character-creation rules, ability score increases come from the background rather than the species. This is one reason old race-and-class optimization advice needs a version check.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-gnome-names', 'dnd-dhampir', 'dwelf-dnd'],
};

const dndRacesArticleZh: BlogPost = {
  slug: 'dnd-races',
  title: 'DND 种族怎么选：哪个 Species 适合你的角色？',
  seoTitle: 'DND 种族指南：哪个 Species 适合你的角色？',
  metaDescription:
    '对比 DND Species 的特性、角色概念和实战用途，分清现行与旧版规则，选出既符合角色故事又适合跑团的种族。',
  excerpt:
    '对比十个 2024 Species，分清 2014 种族规则，再用四个实际问题确定角色概念和 Token 视觉。',
  publishedAt: DND_RACES_UPDATED_AT,
  updatedAt: DND_RACES_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '角色 Species',
  coverImage: DND_RACES_COVER_PATH,
  coverAlt: '多名来自不同 2024 Species 的 DND 冒险者围在发光桌面地图旁',
  bodyHtml: dndRacesArticleHtmlZh,
  faqItems: [
    {
      question: '2024 版《玩家手册》有多少个种族？',
      answer:
        '2024 版《玩家手册》收录十个核心 Species：Aasimar、Dragonborn、Dwarf、Elf、Gnome、Goliath、Halfling、Human、Orc 和 Tiefling。',
    },
    {
      question: 'DND 为什么改用 Species，而不再写 Race？',
      answer:
        '2024 核心规则用 Species 表示旧版书籍中称为 Race 的角色特性。两种说法仍会同时出现，所以看到“种族攻略”时要先检查出版时间与规则版本。',
    },
    {
      question: 'Half-Elf 和 Half-Orc 去哪里了？',
      answer:
        'Half-Elf 与 Half-Orc 出现在 2014 核心规则里，但不是 2024 核心名单中的独立 Species。跑团仍可按兼容规则允许旧角色选项，具体要问 DM 开放哪些来源。',
    },
    {
      question: '哪个 DND Species 最适合新手？',
      answer:
        '最适合新手的是你能理解其特性、也真的想扮演的选项。Human、Dwarf、Halfling 和 Orc 都能支持直接明了的角色概念，但第一个角色并不被迫选择其中任何一个。',
    },
    {
      question: '2024 Species 会提供属性值加成吗？',
      answer:
        '不会。2024 建角规则把属性值加成交给背景，而不是 Species。因此，旧版种族与职业优化建议必须先做版本检查。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-gnome-names', 'dnd-dhampir', 'dwelf-dnd'],
};

const dndShatter5eArticle: BlogPost = {
  slug: 'dnd-shatter-5e',
  title: 'Shatter DnD 5e: Place the Blast, Resolve the Save, Break Objects',
  seoTitle: 'Shatter DnD 5e: Damage, Area, Objects, and 2024 Rules',
  metaDescription:
    'Place Shatter correctly in DnD 5e, resolve its 3d8 Thunder damage and Constitution saves, compare 2014 and 2024 rules, and handle objects and cover.',
  excerpt:
    'Choose the blast center, mark the 10-foot Sphere, apply the correct disadvantage rule, and resolve creatures, objects, cover, and VTT markers cleanly.',
  publishedAt: DND_SHATTER_5E_UPDATED_AT,
  updatedAt: DND_SHATTER_5E_UPDATED_AT,
  readTime: '11 min read',
  coverLabel: 'Spell Tactics',
  coverImage: DND_SHATTER_5E_COVER_PATH,
  coverAlt:
    'Shatter DnD 5e guide cover showing a spellcaster placing a thunder blast over constructs and unattended objects on a dungeon battle-map grid',
  bodyHtml: dndShatter5eArticleHtml,
  faqItems: [
    {
      question: 'What does Shatter do in DnD 5e?',
      answer:
        'Shatter creates a 10-foot-radius Sphere at a point within 60 feet. Creatures in the area make Constitution saves, taking 3d8 Thunder damage on a failure or half on a success. Eligible unattended nonmagical objects take the damage too.',
    },
    {
      question: 'Does Shatter hurt allies?',
      answer:
        'Yes. Shatter affects each creature in the Sphere, including allies and potentially the caster. Place the origin and check every occupied space before rolling saves.',
    },
    {
      question: 'Can Shatter break a door or wall?',
      answer:
        "Shatter can damage a nonmagical door or other unattended object in its area. A wall section works only if the DM treats it as a destructible object; its Hit Points and the consequences of breaking one section remain the DM's call.",
    },
    {
      question: 'Does Shatter work through walls?',
      answer:
        'Total Cover can block a Shatter area. Under the 2024 area rules, a location is excluded when every straight line from the origin to that location is blocked, and an unseen origin beyond an obstruction appears on the near side.',
    },
    {
      question: 'Who has Disadvantage on the Shatter save?',
      answer:
        "The 2024 spell gives a Construct Disadvantage on the save. The 2014 spell instead applies disadvantage to a creature made of inorganic material such as stone, crystal, or metal. Use the wording for your table's rules version.",
    },
  ],
  relatedSlugs: ['dnd-thunderclap', 'firebolt-dnd-5e', 'dnd-counterspell', 'dnd-bless'],
};

const dndShatter5eArticleZh: BlogPost = {
  slug: 'dnd-shatter-5e',
  title: 'Shatter DnD 5e：确定爆点、结算豁免与破坏物体',
  seoTitle: 'Shatter DnD 5e 指南：伤害、范围、物体与 2024 规则',
  metaDescription:
    '在 DnD 5e 中正确放置 Shatter，结算 3d8 雷鸣伤害与体质豁免，对照 2014/2024 规则，并处理物体、掩护和 VTT 标记。',
  excerpt:
    '选择爆炸中心，标出 10 英尺球形区域，应用正确的豁免劣势，再清楚结算生物、物体、掩护和 VTT 标记。',
  publishedAt: DND_SHATTER_5E_UPDATED_AT,
  updatedAt: DND_SHATTER_5E_UPDATED_AT,
  readTime: '11 分钟阅读',
  coverLabel: '法术战术',
  coverImage: DND_SHATTER_5E_COVER_PATH,
  coverAlt: 'Shatter DnD 5e 指南封面：施法者在地城战斗网格上把雷鸣爆炸放在构装体和无人携带物体之间',
  bodyHtml: dndShatter5eArticleHtmlZh,
  faqItems: [
    {
      question: 'Shatter 在 DnD 5e 里有什么效果？',
      answer:
        'Shatter 在 60 英尺内一点创造 10 英尺半径球形区域。区域内生物进行体质豁免，失败承受 3d8 雷鸣伤害，成功承受一半；符合条件、无人携带的非魔法物体也会受伤。',
    },
    {
      question: 'Shatter 会伤害盟友吗？',
      answer:
        '会。Shatter 影响球形区域内每个生物，包括盟友，也可能包括施法者。放好源点后逐格检查，再掷豁免。',
    },
    {
      question: 'Shatter 能打破门或墙吗？',
      answer:
        'Shatter 能伤害区域内的非魔法门或其他无人携带物体。只有当 DM 把某段墙视为可破坏物体时，墙体才按物体结算；该段生命值和破坏后果仍由 DM 决定。',
    },
    {
      question: 'Shatter 能穿过墙吗？',
      answer:
        '完全掩护能挡住 Shatter 区域。按 2024 区域规则，若从源点到某位置的所有直线都被阻挡，该位置不受影响；障碍物后的不可见源点会出现在障碍物靠近施法者的一侧。',
    },
    {
      question: '谁进行 Shatter 豁免时有劣势？',
      answer:
        '2024 法术让构装体（Construct）的豁免具有劣势。2014 法术则让由石头、水晶或金属等无机材料构成的生物进行该豁免时具有劣势。使用当前桌面的规则版本。',
    },
  ],
  relatedSlugs: ['dnd-thunderclap', 'firebolt-dnd-5e', 'dnd-counterspell', 'dnd-bless'],
};

const dndGnomeNamesArticle: BlogPost = {
  slug: 'dnd-gnome-names',
  title: 'DND Gnome Names: First Names, Clans, Nicknames, and Character Hooks',
  seoTitle: 'DND Gnome Names: 132 First Names, Clans, and Nicknames',
  metaDescription:
    'Choose from 132 DND gnome first names, clan names, and nicknames, then turn one full name into a character hook and readable VTT token.',
  excerpt:
    'Mix 132 first names, clan names, and nicknames, then give the result a playable hook, distinct table sound, and readable VTT identity.',
  publishedAt: DND_GNOME_NAMES_UPDATED_AT,
  updatedAt: DND_GNOME_NAMES_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Character Names',
  coverImage: DND_GNOME_NAMES_COVER_PATH,
  coverAlt:
    'Three DND gnome adventurers choosing names and character identities around a lantern-lit fantasy workshop table',
  bodyHtml: dndGnomeNamesArticleHtml,
  faqItems: [
    {
      question: 'What are good DND gnome names?',
      answer:
        'Good DND gnome names are easy to say and carry one memorable detail. Fenna Gearbloom "Blue-Fingers," Rook Underlamp "Cave-Lantern," and Hobbik Wrongmap "Shortcut" each give the table a short name plus a story prompt.',
    },
    {
      question: 'Why do DND gnomes have so many names?',
      answer:
        'The 2014 gnome description says relatives and clan elders may each give a gnome a name, while nicknames accumulate from other people. Around outsiders, a gnome often reduces the collection to a personal name, clan name, and nickname.',
    },
    {
      question: 'Do gnome names need to sound funny?',
      answer:
        'No. A playful sound fits many gnome characters, but the person still has to work in serious scenes. Put the humor in a nickname or family story instead of turning every syllable into a punchline.',
    },
    {
      question: 'What is a good gnome clan name?',
      answer:
        'A useful clan name points to craft, home, reputation, or an old event. Gearbloom, Fernburrow, Underlamp, and Wrongmap all create a place or family expectation the DM can bring into play.',
    },
    {
      question: 'How long should a gnome name be on a VTT?',
      answer:
        'Use one short personal name or nickname during play. Keep the full personal, clan, and nickname form on the sheet or handout so the map stays readable.',
    },
  ],
  relatedSlugs: ['dnd-dwarf-names', 'dwelf-dnd', 'dnd-classes-explained', 'dnd-ranger-spells'],
};

const dndGnomeNamesArticleZh: BlogPost = {
  slug: 'dnd-gnome-names',
  title: 'DND 侏儒名字：名字、氏族名、昵称与角色钩子',
  seoTitle: 'DND 侏儒名字：132 个名字、氏族名与昵称',
  metaDescription:
    '从 132 个 DND 侏儒个人名、氏族名和昵称中组合角色，再补上剧情钩子、清楚桌上称呼与可读 VTT Token。',
  excerpt:
    '自由组合 132 个个人名、氏族名和昵称，再让完整名字带出角色钩子、清楚声音与可读 VTT 身份。',
  publishedAt: DND_GNOME_NAMES_UPDATED_AT,
  updatedAt: DND_GNOME_NAMES_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '角色命名',
  coverImage: DND_GNOME_NAMES_COVER_PATH,
  coverAlt: '三名 DND 侏儒冒险者围在灯光照亮的奇幻工坊桌边挑选名字与角色身份',
  bodyHtml: dndGnomeNamesArticleHtmlZh,
  faqItems: [
    {
      question: '哪些 DND 侏儒名字好用？',
      answer:
        '好用的 DND 侏儒名字要读得顺，还要带一个记忆点。Fenna Gearbloom "Blue-Fingers"、Rook Underlamp "Cave-Lantern" 和 Hobbik Wrongmap "Shortcut" 都给了桌上短称呼和一个故事入口。',
    },
    {
      question: '为什么 DND 侏儒会有很多名字？',
      answer:
        '2014 版侏儒说明写到，亲属和氏族长辈都可能为侏儒取名，其他人还会不断送上昵称。面对外人时，侏儒常把这组名字缩成个人名、氏族名和昵称。',
    },
    {
      question: '侏儒名字必须听起来搞笑吗？',
      answer:
        '不必。轻快声音适合很多侏儒，但角色仍要能撑住严肃场景。把幽默放进昵称或家族旧事，比让每个音节都像笑话更耐用。',
    },
    {
      question: '什么样的侏儒氏族名比较好？',
      answer:
        '好用的氏族名会指向手艺、家乡、名声或旧事故。Gearbloom、Fernburrow、Underlamp 和 Wrongmap 都能直接变成 DM 可调用的地点或家族期待。',
    },
    {
      question: 'VTT 上的侏儒名字应该多长？',
      answer:
        '跑团时使用一个短个人名或昵称。个人名、氏族名和昵称组成的完整形式留在角色卡或 handout 上，地图会更清楚。',
    },
  ],
  relatedSlugs: ['dnd-dwarf-names', 'dwelf-dnd', 'dnd-classes-explained', 'dnd-ranger-spells'],
};

const dndMaulArticle: BlogPost = {
  slug: 'dnd-maul',
  title: 'DND Maul 5e: Heavy, Topple, and a Clean Turn Plan',
  seoTitle: 'DND Maul 5e Guide: Heavy, Topple, and Best Uses',
  metaDescription:
    'Use a DND maul with the right proficiency, Strength 13 Heavy check, Topple timing, weapon alternatives, turn card, and readable VTT token.',
  excerpt:
    'Check Martial proficiency, Strength 13, and two hands, then resolve Topple cleanly and hand the Prone result to the next useful action.',
  publishedAt: DND_MAUL_UPDATED_AT,
  updatedAt: DND_MAUL_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Weapon Tactics',
  coverImage: DND_MAUL_COVER_PATH,
  coverAlt:
    'DND maul guide cover showing an adventurer swinging a broad two-handed hammer at an armored foe on a dungeon battle-map grid',
  bodyHtml: dndMaulArticleHtml,
  relatedSlugs: ['dnd-quarterstaff', 'dnd-glaive', 'dnd-mace', 'dnd-armor-guide'],
};

const dndMaulArticleZh: BlogPost = {
  slug: 'dnd-maul',
  title: 'DND 巨锤（Maul）5e：Heavy、Topple 与清楚回合流程',
  seoTitle: 'DND 巨锤指南：Heavy、Topple 与最佳用法',
  metaDescription:
    '检查军用武器熟练、力量 13 Heavy 门槛和双手要求，再用正确 Topple 顺序、武器选择、回合卡与 VTT Token 使用 DND 巨锤。',
  excerpt:
    '先检查军用武器熟练、力量 13 和双手要求，再清楚结算 Topple，把 Prone 结果交给下一个真正有用的动作。',
  publishedAt: DND_MAUL_UPDATED_AT,
  updatedAt: DND_MAUL_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '武器战术',
  coverImage: DND_MAUL_COVER_PATH,
  coverAlt:
    'DND 巨锤指南封面图：冒险者在地城战斗地图网格上用双手宽头巨锤砸向披甲敌人',
  bodyHtml: dndMaulArticleHtmlZh,
  relatedSlugs: ['dnd-quarterstaff', 'dnd-glaive', 'dnd-mace', 'dnd-armor-guide'],
};

const dndQuarterstaffArticle: BlogPost = {
  slug: 'dnd-quarterstaff',
  title: 'DND Quarterstaff 5e: Hand Choices, Topple, and Builds',
  seoTitle: 'DND Quarterstaff 5e Guide: Stats, Topple, Monk, and Shillelagh',
  metaDescription:
    'Use a DND quarterstaff with the right hand setup, attack ability, Topple timing, Monk rules, Shillelagh, Polearm Master, and VTT token cues.',
  excerpt:
    'Choose one hand or two, set the correct attack ability, time Topple for the party, and run Monk, Shillelagh, or Polearm Master turns cleanly.',
  publishedAt: DND_QUARTERSTAFF_UPDATED_AT,
  updatedAt: DND_QUARTERSTAFF_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Weapon Tactics',
  coverImage: DND_QUARTERSTAFF_COVER_PATH,
  coverAlt:
    'DND quarterstaff guide cover showing an adventurer using a wooden staff to topple an armored foe on a dungeon battle-map grid',
  bodyHtml: dndQuarterstaffArticleHtml,
  relatedSlugs: ['dnd-glaive', 'dnd-mace', 'dnd-dagger', 'dnd-armor-guide'],
};

const dndQuarterstaffArticleZh: BlogPost = {
  slug: 'dnd-quarterstaff',
  title: 'DND 长棍（Quarterstaff）5e：持握选择、Topple 与构筑',
  seoTitle: 'DND 长棍指南：数据、Topple、Monk 与 Shillelagh',
  metaDescription:
    '用正确持握、攻击属性、Topple 顺序、Monk 规则、Shillelagh、Polearm Master 和 VTT 视觉来使用 DND 长棍。',
  excerpt:
    '决定单手或双手，写对攻击属性，为队伍安排 Topple，并清楚运行 Monk、Shillelagh 或 Polearm Master 回合。',
  publishedAt: DND_QUARTERSTAFF_UPDATED_AT,
  updatedAt: DND_QUARTERSTAFF_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '武器战术',
  coverImage: DND_QUARTERSTAFF_COVER_PATH,
  coverAlt:
    'DND 长棍指南封面图：冒险者在地城战斗地图网格上用木制长棍击倒一名披甲敌人',
  bodyHtml: dndQuarterstaffArticleHtmlZh,
  relatedSlugs: ['dnd-glaive', 'dnd-mace', 'dnd-dagger', 'dnd-armor-guide'],
};

const spectatorDndArticleZh: BlogPost = {
  slug: 'spectator-dnd',
  title: 'Spectator DND：守卫命令、Eye Rays 与 VTT Token',
  seoTitle: 'Spectator DND 指南：守卫规则、Eye Rays 与 VTT Token',
  metaDescription:
    '用清楚的 2014/2024 规则边界、守卫命令、眼线压力、Spell Reflection 和可读 VTT Token 运行 Spectator DND 遭遇。',
  excerpt:
    '把 spectator 做成清楚的守卫遭遇：先定义它保护什么，再选择规则版本、设计房间，并裁出可读 VTT Token。',
  publishedAt: SPECTATOR_DND_UPDATED_AT,
  updatedAt: SPECTATOR_DND_UPDATED_AT,
  readTime: '9 分钟阅读',
  coverLabel: '怪物战术',
  coverImage: SPECTATOR_DND_COVER_PATH,
  coverAlt:
    'Spectator DND 指南封面图：四根眼柄的漂浮守卫悬在 VTT 战斗地图网格上的上锁宝库前',
  bodyHtml: spectatorDndArticleHtmlZh,
  relatedSlugs: ['dnd-flumph', 'dnd-counterspell', 'dnd-death-knight', 'dnd-dagger'],
};

const fireboltDnd5eArticle: BlogPost = {
  slug: 'firebolt-dnd-5e',
  title: 'Fire Bolt DnD 5e: Attack Rules, Burning Objects, and VTT Tactics',
  seoTitle: 'Firebolt DnD 5e: Attack Rules, Burning Objects, and VTT Tactics',
  metaDescription:
    'Use Fire Bolt in DnD 5e with clear target choices, 120-foot positioning, object-ignition limits, and readable VTT spellcaster tokens.',
  excerpt:
    'Choose the right Fire Bolt target, resolve the ranged spell attack cleanly, then decide whether damage or ignition changes the map.',
  publishedAt: FIREBOLT_DND_5E_UPDATED_AT,
  updatedAt: FIREBOLT_DND_5E_UPDATED_AT,
  readTime: '8 min read',
  coverLabel: 'Spell Tactics',
  coverImage: FIREBOLT_DND_5E_COVER_PATH,
  coverAlt:
    'Fire Bolt DnD 5e guide cover showing a spellcaster firing an orange bolt across a dungeon battle-map grid at an unattended wooden barricade',
  bodyHtml: fireboltDnd5eArticleHtml,
  relatedSlugs: ['dnd-thunderclap', 'dnd-counterspell', 'dnd-mage-armor', 'dnd-dagger'],
};

const fireboltDnd5eArticleZh: BlogPost = {
  slug: 'firebolt-dnd-5e',
  title: 'Fire Bolt DND 5e：攻击判定、点燃物体与 VTT 战术',
  seoTitle: 'Firebolt DND 5e：攻击判定、点燃物体与 VTT 战术',
  metaDescription:
    '用清楚的目标选择、120 尺站位、物体点燃边界和可读 VTT Token，处理 Fire Bolt DND 5e 的每一次施法。',
  excerpt:
    '先选对 Fire Bolt 目标，再结算远程法术攻击，然后判断伤害或点火会怎样改变地图。',
  publishedAt: FIREBOLT_DND_5E_UPDATED_AT,
  updatedAt: FIREBOLT_DND_5E_UPDATED_AT,
  readTime: '8 分钟阅读',
  coverLabel: '法术战术',
  coverImage: FIREBOLT_DND_5E_COVER_PATH,
  coverAlt:
    'Fire Bolt DND 5e 指南封面图：施法者在地城战斗地图网格上把橙色火焰射向无人持握的木制路障',
  bodyHtml: fireboltDnd5eArticleHtmlZh,
  relatedSlugs: ['dnd-thunderclap', 'dnd-counterspell', 'dnd-mage-armor', 'dnd-dagger'],
};

const dndDaggerArticle: BlogPost = {
  slug: 'dnd-dagger',
  title: 'DND Dagger 5e: Stats, Rules, and Best Uses',
  seoTitle: 'DND Dagger 5e Guide: Stats, Rules, and Best Uses',
  metaDescription:
    'Learn dnd dagger stats fast: 1d4 piercing, finesse, light, thrown range, Rogue uses, 2014 vs 2024 Nick rules, VTT token tips, FAQ, and video.',
  excerpt:
    'A practical dnd dagger encyclopedia page with the 1d4 stat block, thrown range, Rogue advice, 2014/2024 Nick notes, VTT token tips, FAQ, and video.',
  publishedAt: DND_DAGGER_PUBLISHED_AT,
  updatedAt: DND_DAGGER_UPDATED_AT,
  readTime: '10 min read',
  coverLabel: 'Equipment Guide',
  coverImage: DND_DAGGER_COVER_PATH,
  coverAlt:
    'dnd dagger guide cover showing a fantasy dagger, dice, character sheet notes, and VTT token frames on a dark tabletop',
  bodyHtml: dndDaggerArticleHtml,
  faqItems: [
    {
      question: 'Is a dnd dagger a simple weapon?',
      answer:
        'Yes, a dnd dagger is a simple melee weapon. That broad access is one reason it appears on many character sheets as a backup weapon.',
    },
    {
      question: 'Can a Rogue use Sneak Attack with a dagger?',
      answer:
        'Yes, a Rogue can use Sneak Attack with a dagger when the normal Sneak Attack conditions are met because the dagger has the Finesse property.',
    },
    {
      question: 'Can you throw a dnd dagger with Dexterity?',
      answer:
        'Yes, a thrown dagger can use Dexterity because the weapon has Finesse. Its normal range is 20 feet and its long range is 60 feet.',
    },
    {
      question: 'Is a dagger better than a shortsword?',
      answer:
        'A dagger is usually worse for raw damage but better for flexibility. It is cheap, throwable, easy to hide, and useful as a backup tool.',
    },
    {
      question: 'Does the 2024 Nick mastery make daggers strong?',
      answer:
        'Nick makes daggers more action-efficient for characters with the right weapon mastery access, but it does not change the dagger damage die from 1d4.',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-armor-guide', 'dnd-hunters-mark', 'dnd-counterspell'],
};

const dndDaggerArticleZh: BlogPost = {
  slug: 'dnd-dagger',
  title: 'dnd dagger 指南：5e 数据、用法、Nick 与 FAQ',
  seoTitle: 'dnd dagger 指南：5e 数据、用法与 FAQ',
  metaDescription:
    '快速看懂 dnd dagger：1d4 piercing、Finesse、Light、Thrown 距离、Rogue 用法、2014/2024 Nick 差异、VTT Token 建议和 FAQ。',
  excerpt:
    '一篇实用 dnd dagger 装备百科，覆盖 1d4 数据、投掷距离、Rogue 用法、2014/2024 Nick、VTT Token 建议、FAQ 和视频。',
  publishedAt: DND_DAGGER_PUBLISHED_AT,
  updatedAt: DND_DAGGER_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '装备百科',
  coverImage: DND_DAGGER_COVER_PATH,
  coverAlt:
    'dnd dagger 指南封面图，黑色桌面上有奇幻 dagger、骰子、角色卡笔记和 VTT token 边框',
  bodyHtml: dndDaggerArticleHtmlZh,
  faqItems: [
    {
      question: 'dnd dagger 是 simple weapon 吗？',
      answer:
        '是，dnd dagger 是 simple melee weapon。很多职业都能把它当备用武器使用。',
    },
    {
      question: 'Rogue 可以用 dagger 触发 Sneak Attack 吗？',
      answer:
        '可以。只要满足正常 Sneak Attack 条件，Rogue 可以用 dagger 打 Sneak Attack，因为 dagger 有 Finesse 属性。',
    },
    {
      question: '投掷 dnd dagger 可以用 Dexterity 吗？',
      answer:
        '可以。Dagger 有 Finesse，因此投掷时也可以使用 Dexterity。正常距离是 20 尺，长距离是 60 尺。',
    },
    {
      question: 'Dagger 比 shortsword 更好吗？',
      answer:
        '只看伤害通常不是，但看灵活性可能是。Dagger 更便宜、可投、好藏，也更适合作备用工具。',
    },
    {
      question: '2024 Nick mastery 会让 dagger 变强吗？',
      answer:
        'Nick 会让有对应 weapon mastery 的角色动作经济更顺，但不会把 dagger 的伤害骰从 1d4 变大。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-armor-guide', 'dnd-hunters-mark', 'dnd-counterspell'],
};

const dndDemonsArticle: BlogPost = {
  slug: 'dnd-demons',
  title: 'dnd demons: Types, Devils Difference, and DM Encounter Guide',
  seoTitle: 'dnd demons: Types, Devils Difference, and DM Uses',
  metaDescription:
    'Use this dnd demons guide to pick demon types faster, understand demons vs devils, build better Abyss encounters, and make readable VTT tokens.',
  excerpt:
    'A practical dnd demons encyclopedia with a quick demon list, demons vs devils table, DM encounter advice, VTT token tips, FAQ, and companion video.',
  updatedAt: DND_DEMONS_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Monster Guide',
  coverImage: DND_DEMONS_COVER_PATH,
  coverAlt:
    'dnd demons guide cover showing an Abyssal portal, demon silhouettes, dice, encounter notes, and VTT token frames',
  bodyHtml: dndDemonsArticleHtml,
  faqItems: [
    {
      question: 'What are DND demons?',
      answer:
        'DND demons are chaotic evil fiends associated with the Abyss, usually used for destructive, corrupting, and unstable threats in Dungeons & Dragons campaigns.',
    },
    {
      question: 'Are demons and devils the same in DND?',
      answer:
        'No. Demons are chaotic evil Abyssal fiends, while devils are lawful evil infernal fiends. Use demons for chaos and corruption; use devils for contracts, hierarchy, and punishment.',
    },
    {
      question: 'What is the best first DND demon for a new DM?',
      answer:
        'A quasit or small group of dretches is usually the easiest first demon choice because they show Abyssal weirdness without forcing a beginner table into a high-level boss fight.',
    },
    {
      question: 'What is the strongest common DND demon?',
      answer:
        'The balor is one of the most iconic high-end common demons in DND. It works best as a major set-piece threat, not as a casual random encounter.',
    },
    {
      question: 'How do I make demons feel scary without killing the party?',
      answer:
        'Use environmental consequences, visible corruption, escape pressure, and clear warning signs before raw damage. The party should feel the Abyss spreading, not just see bigger attack numbers.',
    },
  ],
  relatedSlugs: ['mephistopheles-dnd', 'dnd-necromancer-spells', 'dnd-counterspell', 'dnd-classes-explained'],
};

const dndDemonsArticleZh: BlogPost = {
  slug: 'dnd-demons',
  title: 'dnd demons：恶魔类型、Devils 区别与 DM 遭遇设计',
  seoTitle: 'dnd demons：恶魔类型、Devils 区别与 DM 用法',
  metaDescription:
    '这篇 dnd demons 百科指南快速整理常用恶魔类型、demons 和 devils 的区别、DM 遭遇设计、VTT token 制作和 FAQ。',
  excerpt:
    '一篇实用 dnd demons 百科：快速看懂恶魔类型、demons vs devils、DM 跑法、VTT token 建议、FAQ 和配套视频。',
  updatedAt: DND_DEMONS_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '怪物百科',
  coverImage: DND_DEMONS_COVER_PATH,
  coverAlt:
    'dnd demons 指南封面图，展示 Abyss 传送门、恶魔剪影、骰子、遭遇笔记和 VTT token 边框',
  bodyHtml: dndDemonsArticleHtmlZh,
  faqItems: [
    {
      question: 'DND demons 是什么？',
      answer:
        'DND demons 是和 Abyss 相关的混乱邪恶 fiends，通常用于表现破坏、污染、失控和高压战斗。',
    },
    {
      question: 'DND demons 和 devils 一样吗？',
      answer:
        '不一样。Demons 是混乱邪恶的 Abyss fiends；devils 是守序邪恶的 infernal fiends。前者适合混乱污染，后者适合契约、等级和惩罚。',
    },
    {
      question: '新手 DM 最适合先用哪只 DND demon？',
      answer:
        'Quasit 或一小群 dretches 通常最适合作为第一只 demon。它们能展示 Abyss 的怪异感，又不会把新手桌直接推向高等级 Boss 战。',
    },
    {
      question: 'DND 里最经典的高阶 demon 是谁？',
      answer:
        'Balor 是最经典的高阶 demon 之一。它适合作为重大 set-piece 威胁，而不是随手塞进随机遭遇。',
    },
    {
      question: '怎样让 demons 可怕但不团灭玩家？',
      answer:
        '用环境后果、可见污染、撤离压力和清晰预警替代单纯堆伤害。玩家应该感到 Abyss 正在扩散，而不是只看到更高攻击数字。',
    },
  ],
  relatedSlugs: ['mephistopheles-dnd', 'dnd-necromancer-spells', 'dnd-counterspell', 'dnd-classes-explained'],
};

const dndDwarfNamesArticleZh: BlogPost = {
  slug: 'dnd-dwarf-names',
  title: 'dnd dwarf names：100+ 个能直接上桌的矮人名字',
  seoTitle: 'dnd dwarf names：100+ 个矮人名字',
  metaDescription:
    '今晚就能用：100+ 个 dnd dwarf names、氏族姓、搞笑名字、命名方法、VTT Token 标签建议、FAQ 和视频。',
  excerpt:
    '整理 100+ 个矮人名字、氏族姓和绰号，并说明怎样挑出适合角色身份、家族背景和桌面展示的名字。',
  publishedAt: DND_DWARF_NAMES_UPDATED_AT,
  updatedAt: DND_DWARF_NAMES_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '取名指南',
  coverImage: DND_DWARF_NAMES_COVER_PATH,
  coverAlt:
    'dnd dwarf names 指南封面图，矮人在锻炉光线下雕刻氏族名字，旁边摆着骰子和 VTT Token 圆框',
  bodyHtml: dndDwarfNamesArticleHtmlZh,
  faqItems: [
    {
      question: '有哪些好用的 dnd dwarf names？',
      answer:
        '好用的 dnd dwarf names 通常短、厚重，并且带有氏族身份。Korgan Emberhand、Brakka Stonevow、Durik Ironthane、Hilda Coppervein 和 Sigrun Goldmender 都能马上给玩家一个画面。',
    },
    {
      question: '矮人氏族姓怎么起？',
      answer:
        '矮人氏族姓可以用材料、工艺、地点或誓言组合，例如 Stonevow、Forgewarden、Goldmender、Deepdelver 或 Shieldbrand。',
    },
    {
      question: 'dnd dwarf names 一定要像北欧名字吗？',
      answer:
        '不一定，但北欧感的音节可以帮助营造矮人语感。把它当调味，不要让所有矮人都变成同一种声音。',
    },
    {
      question: '严肃战役可以用搞笑矮人名字吗？',
      answer:
        '可以，但笑点下面要有一个可信的人。搞笑名字也需要技能、恐惧、债务或秘密，否则只会变成一次性笑话。',
    },
    {
      question: '矮人 Token 标签多长合适？',
      answer:
        '矮人 Token 标签最好是 12-14 个字符以内的短名。完整氏族姓和头衔放在角色卡、日志或 GM 笔记里更合适。',
    },
  ],
  relatedSlugs: ['dnd-classes-explained', 'dnd-dagger', 'dnd-armor-guide', 'dnd-dhampir'],
};

const dndMaceArticleZh: BlogPost = {
  slug: 'dnd-mace',
  title: 'dnd mace 指南：1d6 数据、Sap 与最佳用法',
  seoTitle: 'dnd mace 指南：1d6 数据与 Sap',
  metaDescription:
    '快速看懂 dnd mace：1d6 bludgeoning、5 gp、4 lb、simple weapon、2024 Sap、适合谁用、武器对比和 VTT Token 建议。',
  excerpt:
    'dnd mace 是 1d6 simple melee weapon。这篇讲清什么时候该选、什么时候该跳过、Sap 怎么用，以及 VTT Token 上怎么表现。',
  publishedAt: DND_MACE_UPDATED_AT,
  updatedAt: DND_MACE_UPDATED_AT,
  readTime: '10 分钟阅读',
  coverLabel: '装备指南',
  coverImage: DND_MACE_COVER_PATH,
  coverAlt:
    'dnd mace 指南封面图，地下城桌面上有带刺 mace、骰子、角色卡笔记和 VTT Token 圆框',
  bodyHtml: dndMaceArticleHtmlZh,
  faqItems: [
    {
      question: 'dnd mace 造成多少伤害？',
      answer:
        'dnd mace 造成 1d6 bludgeoning 伤害。普通近战攻击通常再加对应属性调整值，一般是 Strength。',
    },
    {
      question: 'dnd mace 是 simple weapon 吗？',
      answer:
        '是，dnd mace 是 simple melee weapon。这也是 Cleric 和很多 NPC 不需要 martial weapon 熟练就能使用它的原因。',
    },
    {
      question: 'Rogue 可以用 mace 打 Sneak Attack 吗？',
      answer:
        '不可以，普通 mace 没有 Finesse，也不是 ranged weapon，所以不能触发 Sneak Attack。',
    },
    {
      question: 'Mace 比 warhammer 更好吗？',
      answer:
        'Mace 更容易拿到，但有 martial weapon 熟练时，warhammer 通常更强，因为它伤害更高，还可以 Versatile 双手使用。',
    },
    {
      question: 'dnd mace 有 Sap 吗？',
      answer:
        '在 2024 装备表里，mace 的 weapon mastery 条目是 Sap。但角色仍然需要有能使用该 mastery 的特性或选项。',
    },
  ],
  relatedSlugs: ['dnd-dagger', 'dnd-armor-guide', 'dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndHexArticle: BlogPost = {
  slug: 'dnd-hex',
  title: 'Hex DnD Guide: 2014/2024 Rules, Damage, and VTT Tips',
  seoTitle: 'Hex DnD Guide: 2014/2024 Rules, Damage, and VTT Tips',
  metaDescription:
    'A practical dnd hex guide covering 2014/2024 rules, 1d6 Necrotic damage, Eldritch Blast, ability-check disadvantage, concentration, FAQ, and VTT token markers.',
  excerpt:
    'A practical dnd hex spell guide covering 2014/2024 rules, 1d6 Necrotic damage, Eldritch Blast, ability-check disadvantage, concentration, FAQ, and VTT token tips.',
  publishedAt: DND_HEX_UPDATED_AT,
  updatedAt: DND_HEX_UPDATED_AT,
  readTime: '12 min read',
  coverLabel: 'Spell Guide',
  coverImage: DND_HEX_COVER_PATH,
  coverAlt:
    'dnd hex guide cover showing a Warlock token, a violet curse sigil, d20 dice, and VTT condition markers on a dark tabletop battle map',
  bodyHtml: dndHexArticleHtml,
  faqItems: [
    {
      question: 'Is Hex a Warlock-only spell?',
      answer:
        'Hex is a Warlock spell in the normal spell list, and 2024 Warlock rules recommend Hex as an early prepared spell. Other characters can sometimes get it through feats, subclasses, or table options.',
    },
    {
      question: 'Does Hex trigger on every Eldritch Blast beam?',
      answer:
        'Yes, if each beam hits the cursed target. Eldritch Blast makes separate attack rolls as it scales, so each hit can add the 1d6 Necrotic damage.',
    },
    {
      question: 'Does Hex give disadvantage on saving throws?',
      answer:
        'No. Hex only affects ability checks for the chosen ability. It does not affect saving throws or attack rolls.',
    },
    {
      question: 'Does Hex help break enemy concentration?',
      answer:
        'No. Concentration checks after damage are Constitution saving throws, and Hex does not penalize saving throws.',
    },
    {
      question: 'Can you move Hex to another target?',
      answer:
        'Yes, but only after the cursed target drops to 0 HP before Hex ends. Moving the curse uses a Bonus Action on a later turn.',
    },
    {
      question: 'Is Hex still good in 2024 DnD?',
      answer:
        'Hex is still good when you make repeated attack rolls into a durable target. It is weaker when concentration, Bonus Action pressure, or stronger control spells matter more.',
    },
    {
      question: 'Does upcasting Hex increase the damage?',
      answer: 'No. Upcasting Hex extends the duration. It does not increase the 1d6 damage die.',
    },
    {
      question: 'Does Remove Curse end Hex?',
      answer:
        'In 2014 text, yes: Remove Curse cast on the target ends Hex early. The public 2024 Hex text no longer includes that spell-specific sentence, but current Remove Curse still broadly ends curses affecting a creature or object. Confirm the 2024 interaction with your DM before treating it as automatic at every table.',
    },
  ],
  relatedSlugs: ['dnd-hunters-mark', 'dnd-ranger-spells', 'dnd-constitution-guide', 'dnd-counterspell'],
};

const dndHexArticleZh: BlogPost = {
  slug: 'dnd-hex',
  title: 'DND 巫术印记（Hex）指南：2014/2024 规则、伤害与 VTT 标记',
  seoTitle: 'DND 巫术印记（Hex）指南：2014/2024 规则、伤害与 VTT 标记',
  metaDescription:
    '一篇适合桌边核对的 DND 巫术印记（Hex）指南，讲清 2014/2024 规则、1d6 黯蚀伤害、魔能爆（Eldritch Blast）、属性检定劣势、专注、常见问题和 VTT 标记。',
  excerpt:
    '一篇实用 DND 巫术印记（Hex）法术指南，覆盖 2014/2024 规则、1d6 黯蚀伤害、魔能爆（Eldritch Blast）、属性检定劣势、专注、常见问题和 VTT 标记。',
  publishedAt: DND_HEX_UPDATED_AT,
  updatedAt: DND_HEX_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '法术指南',
  coverImage: DND_HEX_COVER_PATH,
  coverAlt:
    'DND 巫术印记（Hex）指南封面图，深色桌面战斗地图上有契术师（Warlock）Token、紫色诅咒符文、d20 骰子和 VTT 状态标记',
  bodyHtml: dndHexArticleHtmlZh,
  faqItems: [
    {
      question: '巫术印记（Hex）是契术师（Warlock）专属法术吗？',
      answer:
        '巫术印记（Hex）是常规法术列表里的契术师（Warlock）法术，2024 Warlock 规则也把它列为早期推荐法术。其他角色有时可以通过专长、子职业或桌面选项取得它。',
    },
    {
      question: '巫术印记（Hex）会在每束魔能爆（Eldritch Blast）上触发吗？',
      answer:
        '会，只要每束光线都命中被诅咒目标。魔能爆（Eldritch Blast）随等级成长时会做多次独立攻击检定，所以每次命中都能加 1d6 黯蚀伤害。',
    },
    {
      question: '巫术印记（Hex）会让豁免具有劣势吗？',
      answer: '不会。Hex 只影响属性检定，具体是被选属性的属性检定；它不影响豁免，也不影响攻击检定。',
    },
    {
      question: '巫术印记（Hex）能帮助打断敌人专注吗？',
      answer: '不能。受伤后的专注检定是 Constitution 豁免，而 Hex 不会惩罚豁免。',
    },
    {
      question: '巫术印记（Hex）能转移到另一个目标吗？',
      answer:
        '可以，但必须先等被诅咒目标在 Hex 结束前降到 0 HP。转移诅咒要在之后的回合花附赠动作。',
    },
    {
      question: '2024 DnD 里 Hex 还好吗？',
      answer:
        '当你会对一个耐打目标反复做攻击检定时，Hex 仍然好用。若专注、附赠动作或更强控场法术更重要，它就会变弱。',
    },
    {
      question: '巫术印记（Hex）升环会提高伤害吗？',
      answer: '不会。Hex 升环只延长持续时间，不提高 1d6 伤害骰。',
    },
    {
      question: '解除诅咒（Remove Curse）能结束巫术印记（Hex）吗？',
      answer:
        '2014 文本里可以：对目标施放解除诅咒（Remove Curse）会提前结束 Hex。公开 2024 Hex 法术文本已经没有这条专门句子，但当前解除诅咒仍会结束影响生物或物体的诅咒，所以 2024 桌面请先按 DM 对版本互动的裁定处理。',
    },
  ],
  relatedSlugs: ['dnd-hunters-mark', 'dnd-ranger-spells', 'dnd-constitution-guide', 'dnd-counterspell'],
};

const paladin2024SpellsDndArticle: BlogPost = {
  slug: 'paladin-2024-spells-dnd',
  title: 'Paladin 2024 Spells DnD Guide: Best Picks, Smites, and Prepared Lists',
  seoTitle: 'Paladin 2024 Spells DnD Guide: Best Picks, Smites, and VTT Tips',
  metaDescription:
    'Choose the best Paladin 2024 spells in DnD. Compare Divine Smite, Bless, Find Steed, Shining Smite, prepared lists, concentration, and VTT token tips.',
  excerpt:
    'A practical paladin 2024 spells dnd guide covering prepared lists, Divine Smite, Bless, Find Steed, Shining Smite, concentration, VTT token markers, and FAQ.',
  publishedAt: PALADIN_2024_SPELLS_DND_UPDATED_AT,
  updatedAt: PALADIN_2024_SPELLS_DND_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'Spell Guide',
  coverImage: PALADIN_2024_SPELLS_DND_COVER_PATH,
  coverAlt:
    'paladin 2024 spells dnd guide cover showing a radiant Paladin token, holy symbol, spell cards, aura marker, smite glow, d20 dice, and VTT token frames',
  bodyHtml: paladin2024SpellsDndArticleHtml,
  faqItems: [
    {
      question: 'What are the best Paladin 2024 spells in DnD?',
      answer:
        'The best all-purpose Paladin 2024 spells are Bless, Divine Favor, Divine Smite, Shield of Faith, Find Steed, Aid, Lesser Restoration, Shining Smite, Aura of Vitality, Dispel Magic, Revivify, Death Ward, Banishment, Circle of Power, and Banishing Smite.',
    },
    {
      question: 'Do 2024 Paladins prepare spells?',
      answer:
        'Yes. 2024 Paladins prepare level 1+ Paladin spells from the Paladin list. They start with two prepared level 1 spells and can replace one prepared Paladin spell after a Long Rest.',
    },
    {
      question: 'Is Divine Smite a spell in 2024 DnD?',
      answer:
        'Yes. Divine Smite is a level 1 Paladin spell in the 2024 rules. At Paladin level 2, you always have it prepared and can cast it once without spending a spell slot per Long Rest.',
    },
    {
      question: 'Should a Paladin use every spell slot on Divine Smite?',
      answer:
        'No. Divine Smite is strong, but Bless, Divine Favor, Find Steed, Aura of Vitality, Dispel Magic, Revivify, and Circle of Power can matter more than one burst of damage.',
    },
    {
      question: 'Which 2024 Paladin spells need concentration?',
      answer:
        'Common concentration Paladin spells include Bless, Shield of Faith, Heroism, Protection from Evil and Good, Shining Smite, Aura of Vitality, Aura of Life, Aura of Purity, Banishment, Banishing Smite, Circle of Power, and Summon Celestial.',
    },
    {
      question: 'Does Find Steed count as a good Paladin spell?',
      answer:
        'Yes. Find Steed is one of the most identity-defining Paladin spells because it changes movement, travel, and table presence. In VTT games, it works best when the steed has its own readable token.',
    },
    {
      question: 'What should a new Paladin prepare at level 1?',
      answer:
        'A simple level 1 start is Bless plus Cure Wounds. If another character already covers healing or Bless, use Divine Favor, Shield of Faith, Heroism, or Searing Smite instead.',
    },
  ],
  relatedSlugs: ['dnd-bless', 'dnd-ranger-spells', 'dnd-bard-spells', 'dnd-constitution-guide'],
};

const paladin2024SpellsDndArticleZh: BlogPost = {
  slug: 'paladin-2024-spells-dnd',
  title: '圣武士（Paladin）2024 法术指南：最佳法术、Smite 与 VTT 建议',
  seoTitle: '圣武士（Paladin）2024 法术指南：最佳法术、Smite 与 VTT 建议',
  metaDescription:
    '整理 DnD 2024 Paladin 法术选择：Divine Smite、Bless、Find Steed、Shining Smite、准备法术、专注与 VTT Token 标记。',
  excerpt:
    '一篇实用 Paladin 2024 法术指南，整理准备法术、Divine Smite、Bless、Find Steed、Shining Smite、专注、VTT Token 标记和常见问题。',
  publishedAt: PALADIN_2024_SPELLS_DND_UPDATED_AT,
  updatedAt: PALADIN_2024_SPELLS_DND_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: '法术指南',
  coverImage: PALADIN_2024_SPELLS_DND_COVER_PATH,
  coverAlt:
    'Paladin 2024 Spells DnD 指南封面图，radiant Paladin Token、Holy Symbol、法术卡、aura 标记、smite 光效、d20 骰子和 VTT Token 边框',
  bodyHtml: paladin2024SpellsDndArticleHtmlZh,
  faqItems: [
    {
      question: 'DnD 里最好的 Paladin 2024 法术有哪些？',
      answer:
        '泛用性最高的 Paladin 2024 法术包括 Bless、Divine Favor、Divine Smite、Shield of Faith、Find Steed、Aid、Lesser Restoration、Shining Smite、Aura of Vitality、Dispel Magic、Revivify、Death Ward、Banishment、Circle of Power 和 Banishing Smite。',
    },
    {
      question: '2024 Paladin 是准备法术吗？',
      answer:
        '是。2024 Paladin 从 Paladin 法术表里准备 1 环及以上法术。1 级开始准备两个 1 环法术，长休后可以替换一个已准备的 Paladin 法术。',
    },
    {
      question: 'Divine Smite 在 2024 DnD 里是法术吗？',
      answer:
        '是。Divine Smite 在 2024 规则里是 1 环 Paladin 法术。Paladin 2 级后始终准备它，并且每次长休可以不消耗法术位施放一次。',
    },
    {
      question: 'Paladin 应该把所有法术位都用在 Divine Smite 上吗？',
      answer:
        '不应该。Divine Smite 很强，但 Bless、Divine Favor、Find Steed、Aura of Vitality、Dispel Magic、Revivify 和 Circle of Power 经常比一次爆发伤害更重要。',
    },
    {
      question: '哪些 2024 Paladin 法术需要专注？',
      answer:
        '常见需要专注的 Paladin 法术包括 Bless、Shield of Faith、Heroism、Protection from Evil and Good、Shining Smite、Aura of Vitality、Aura of Life、Aura of Purity、Banishment、Banishing Smite、Circle of Power 和 Summon Celestial。',
    },
    {
      question: 'Find Steed 是好用的 Paladin 法术吗？',
      answer:
        '是。Find Steed 很能体现 Paladin 的角色身份，因为它会改变移动、旅行和桌面存在感。线上跑团时，坐骑最好有自己的清晰 Token。',
    },
    {
      question: '新手 Paladin 1 级应该准备什么？',
      answer:
        '简单稳妥的 1 级准备是 Bless 加 Cure Wounds。如果队友已经覆盖治疗或 Bless，可以改用 Divine Favor、Shield of Faith、Heroism 或 Searing Smite。',
    },
  ],
  relatedSlugs: ['dnd-bless', 'dnd-ranger-spells', 'dnd-bard-spells', 'dnd-constitution-guide'],
};

const dndRangerSpellsArticleZh: BlogPost = {
  slug: 'dnd-ranger-spells',
  title: 'DND 游侠法术指南：最佳选择、准备清单与猎人印记取舍',
  seoTitle: 'DND 游侠法术指南：最佳选择与准备清单',
  metaDescription:
    '这篇 DND 游侠法术指南保留 dnd ranger spells 搜索意图，整理按职责选法术、2014/2024 规则差异、猎人印记（Hunter\'s Mark）取舍、准备清单、虚拟桌面素材建议和常见问题。',
  excerpt:
    '一篇实用 DND 游侠法术指南，覆盖按职责选法术、2014/2024 施法差异、专注选择、准备示例、虚拟桌面素材准备和猎人印记取舍。',
  publishedAt: DND_RANGER_SPELLS_UPDATED_AT,
  updatedAt: DND_RANGER_SPELLS_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '法术指南',
  coverImage: DND_RANGER_SPELLS_COVER_PATH,
  coverAlt:
    'DND 游侠法术指南封面图，兜帽游侠旁边摆着法术卡、被标记猎物素材、骰子和森林虚拟桌面战斗地图',
  bodyHtml: dndRangerSpellsArticleHtmlZh,
  faqItems: [
    {
      question: '最好的 DND 游侠法术是哪些？',
      answer:
        '多数桌上最实用的 DND 游侠法术包括猎人印记、神莓术、无踪潜行、荆棘丛生、诱捕打击、纠缠术、疗伤术、召唤野兽、行动自如和迅捷箭袋。',
    },
    {
      question: 'DND 里游侠是准备法术吗？',
      answer:
        '取决于规则版本。2014 版游侠知道有限数量的法术；2024 版游侠从游侠职业法术列表中准备法术。',
    },
    {
      question: '猎人印记永远是最好的游侠法术吗？',
      answer:
        '不是。猎人印记适合高血量目标，但如果遭遇更看重潜行、地形控制或战场单位，无踪潜行、荆棘丛生、纠缠术、沉默术或召唤法术可能更强。',
    },
    {
      question: '游侠第一个法术应该拿什么？',
      answer:
        '很多桌可以从猎人印记或神莓术开始，再补一个控制或探索法术，例如纠缠术、云雾术、大步奔行或动物交谈。',
    },
    {
      question: '最好的 2 环游侠法术是什么？',
      answer:
        '无踪潜行通常是最强的 2 环游侠潜行法术；荆棘丛生则是非常强的战斗控制选择。',
    },
  ],
  relatedSlugs: ['dnd-hunters-mark', 'dnd-druid-spells', 'dnd-constitution-guide', 'dnd-classes-explained'],
};

const dndSilveryBarbsArticleZh: BlogPost = {
  slug: 'dnd-silvery-barbs',
  title: '银光倒刺（Silvery Barbs）DND 指南：2014/2024 规则、来源与 VTT 标记',
  seoTitle: '银光倒刺（Silvery Barbs）DND 指南：2014/2024 规则',
  metaDescription:
    '快速看懂银光倒刺（Silvery Barbs）：斯翠海文来源、2014/2024 规则差异、传奇抗力、优势时机、DM 许可、FAQ 与 VTT Token 标记。',
  excerpt:
    '一篇适合桌边核对的银光倒刺（Silvery Barbs）DND 指南，讲清斯翠海文来源、2014/2024 桌面处理、传奇抗力、重掷时机、DM 许可和 VTT Token 标记。',
  publishedAt: DND_SILVERY_BARBS_UPDATED_AT,
  updatedAt: DND_SILVERY_BARBS_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: '法术指南',
  coverImage: DND_SILVERY_BARBS_COVER_PATH,
  coverAlt:
    '银光倒刺（Silvery Barbs）指南封面图，桌面战斗地图上有银色反应法术、VTT Token、d20 骰子和优势标记',
  bodyHtml: dndSilveryBarbsArticleHtmlZh,
  faqItems: [
    {
      question: '银光倒刺是官方 DND 内容吗？',
      answer:
        '是。银光倒刺是《斯翠海文：混沌课程》中的官方 DND 内容，但它属于扩展设定内容，是否可用由 DM 决定。',
    },
    {
      question: '银光倒刺在 2024 免费规则里吗？',
      answer:
        '没有。银光倒刺没有收录在 2024 免费规则的法术列表里；只有在 DM 允许斯翠海文或扩展来源时才使用。',
    },
    {
      question: '银光倒刺在 2014 版玩家手册里吗？',
      answer:
        '没有。银光倒刺出自《斯翠海文：混沌课程》，不是 2014 版《玩家手册》的法术。',
    },
    {
      question: '银光倒刺需要专注吗？',
      answer:
        '不需要。银光倒刺不需要专注，所以施法者可以在维持另一个专注法术时使用它。',
    },
    {
      question: '银光倒刺能取消重击吗？',
      answer:
        '它可以迫使触发生物重掷那次成功的攻击检定，并使用较低结果。如果较低结果不再是重击，甚至不再命中，结果就会改变。',
    },
    {
      question: '银光倒刺能影响传奇抗力吗？',
      answer:
        '不能。银光倒刺不能取消传奇抗力，因为传奇抗力是在豁免已经失败后把失败变成成功。',
    },
    {
      question: '银光倒刺等同于劣势吗？',
      answer:
        '不等同。它是重掷效果，不是劣势（Disadvantage）状态；涉及优势或劣势的规则互动时，这个差别很重要。',
    },
    {
      question: 'DM 应该禁用银光倒刺吗？',
      answer:
        '不需要自动禁用。DM 应该在开跑前决定斯翠海文内容是否适合战役，以及这个反应会让桌子更好玩还是更烦。',
    },
  ],
  relatedSlugs: ['dnd-counterspell', 'dnd-bard-spells', 'dnd-ranger-spells', 'dnd-bless'],
};

const dndShortswordArticleZh: BlogPost = {
  slug: 'dnd-shortsword',
  title: 'DND 短剑（Shortsword）指南：2014/2024 规则、Vex、Nick 与偷袭',
  seoTitle: 'DND 短剑指南：2014/2024 规则、Vex 与 Nick',
  metaDescription:
    '对比 DND 短剑 2014 与 2024 数据，说清灵巧、轻型、Vex/Nick 顺序、游荡者偷袭、武器选择与 VTT 标记。',
  excerpt:
    '一篇适合桌边核对的 DND 短剑指南，讲清 1d6 灵巧与轻型数据、2014/2024 Vex、偷袭条件、双持选择和 VTT Token 标记。',
  publishedAt: DND_SHORTSWORD_UPDATED_AT,
  updatedAt: DND_SHORTSWORD_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: '装备百科',
  coverImage: DND_SHORTSWORD_COVER_PATH,
  coverAlt:
    'DND 短剑（Shortsword）指南封面图，地城桌面上有游荡者 Token、短剑、骰子、角色卡笔记和 VTT Token 边框',
  bodyHtml: dndShortswordArticleHtmlZh,
  faqItems: [
    {
      question: '短剑是简易武器还是军用武器？',
      answer:
        '短剑在 2014 和 2024 规则里都是军用近战武器。角色仍然需要相应熟练，才能把熟练加值加到攻击掷骰上。',
    },
    {
      question: '短剑可以用敏捷攻击吗？',
      answer:
        '可以。灵巧（Finesse）允许你选择力量或敏捷，并把同一个属性同时用于这次攻击的攻击掷骰和伤害掷骰。',
    },
    {
      question: '短剑能触发偷袭吗？',
      answer:
        '可以。短剑因为有灵巧属性而符合偷袭的武器要求，但游荡者（Rogue）仍然必须满足正常的 Sneak Attack 条件。',
    },
    {
      question: '2024 短剑有 Nick 吗？',
      answer:
        '没有。短剑的武器掌握是 Vex，不是 Nick。匕首和弯刀才是常见的 Nick 搭配。',
    },
    {
      question: 'Vex 会让刚才命中的短剑攻击获得优势吗？',
      answer:
        '不会。Vex 不会让触发它的同一次攻击获得优势。它帮助的是你在时限内对同一目标做出的下一次攻击。',
    },
    {
      question: '短剑和细剑可以走普通双持顺序吗？',
      answer:
        '通常不行。短剑是轻型（Light），细剑不是，所以这组武器不满足基础的轻型额外攻击要求，除非其他规则明确改变条件。',
    },
    {
      question: '短剑一定比细剑好吗？',
      answer:
        '不一定。细剑适合单武器灵巧近战，短剑更适合需要轻型顺序、Vex 或匕首/弯刀后续攻击的回合。',
    },
  ],
  relatedSlugs: ['rapier-dnd', 'dnd-dagger', 'dnd-mace', 'dnd-classes-explained'],
};

const dndBlessArticleZh: BlogPost = {
  slug: 'dnd-bless',
  title: '祝福术（DND Bless）指南：2014/2024 规则、最佳目标与 VTT Token 建议',
  seoTitle: '祝福术（DND Bless）指南：2014/2024 规则与最佳用法',
  metaDescription:
    '快速看懂祝福术（DND Bless）：2014/2024 组件差异、该给谁、d4 加在哪些掷骰、常见误区、FAQ、骰子和 VTT Token 标记建议。',
  excerpt:
    '一篇实用祝福术（DND Bless）指南，讲清 2014/2024 法术规则、2024 Holy Symbol 组件、目标优先级、常见误区、FAQ、骰子和 VTT Token 标记。',
  publishedAt: DND_BLESS_UPDATED_AT,
  updatedAt: DND_BLESS_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '法术指南',
  coverImage: DND_BLESS_COVER_PATH,
  coverAlt:
    '祝福术（DND Bless）指南封面图，金色祝福魔法覆盖三个盟友 Token、d4、Holy Symbol 和 VTT 战斗地图',
  bodyHtml: dndBlessArticleHtmlZh,
  faqItems: [
    {
      question: '祝福术会加伤害吗？',
      answer:
        '不会。祝福术只把 1d4 加到攻击检定和豁免上，不加伤害、AC、先攻或属性检定。',
    },
    {
      question: '祝福术每次攻击检定都能用吗？',
      answer:
        '可以。只要法术还在持续、施法者仍在专注，受祝福术影响的目标每次进行攻击检定或豁免时都可以加 1d4。',
    },
    {
      question: '2024 版 Bless 改了什么？',
      answer:
        '最明显的 2024 变化是材料组件：祝福术从一点 holy water 改成价值 5+ GP 的 Holy Symbol。',
    },
    {
      question: '2024 版祝福术会消耗 Holy Symbol 吗？',
      answer:
        '不会。祝福术没有写会消耗 Holy Symbol，所以这个材料组件不会因为施放祝福术被消耗。',
    },
    {
      question: '两个祝福术可以叠加吗？',
      answer:
        '不能。同一个法术的多次施放不会让同一个目标拿到多个 Bless d4。',
    },
    {
      question: '祝福术应该先给谁？',
      answer:
        '优先给会反复做攻击检定的角色、即将吃危险豁免的角色，以及已经在保持专注的盟友。',
    },
  ],
  relatedSlugs: ['dnd-ranger-spells', 'dnd-bard-spells', 'dnd-counterspell', 'dnd-constitution-guide'],
};

const rapierDndArticleZh: BlogPost = {
  slug: 'rapier-dnd',
  title: 'DND 细剑（Rapier）指南：5e 数据、Vex、最佳使用者与 VTT Token 建议',
  seoTitle: 'DND 细剑指南：5e 数据、Vex、最佳使用者与 VTT 建议',
  metaDescription:
    '核对 DND 细剑数据、1d8 穿刺、灵巧、2014/2024 规则、Vex、偷袭适配、双持误区、FAQ 和 VTT Token 建议。',
  excerpt:
    '一篇适合桌边核对的 DND 细剑指南，讲清 1d8 灵巧数据、2014/2024 Vex、偷袭条件、双持误区和 VTT Token 建议。',
  publishedAt: DND_RAPIER_UPDATED_AT,
  updatedAt: DND_RAPIER_UPDATED_AT,
  readTime: '12 分钟阅读',
  coverLabel: '装备百科',
  coverImage: DND_RAPIER_COVER_PATH,
  coverAlt:
    'DND 细剑（Rapier）指南封面图，地城桌面上有决斗者 Token、细剑、骰子、角色卡笔记和 VTT Token 边框',
  bodyHtml: rapierDndArticleHtmlZh,
  faqItems: [
    {
      question: '细剑是 DnD 里的灵巧（Finesse）武器吗？',
      answer:
        '细剑有灵巧（Finesse）属性。你可以用力量或敏捷进行攻击和伤害掷骰，但同一次攻击必须两者都用同一个属性。',
    },
    {
      question: '游荡者（Rogue）可以用细剑偷袭（Sneak Attack）吗？',
      answer:
        '细剑因为有灵巧（Finesse）而符合偷袭武器要求，但游荡者（Rogue）仍然必须满足正常 Sneak Attack 条件。',
    },
    {
      question: '细剑是轻型（Light）武器吗？',
      answer:
        '不是。细剑有灵巧（Finesse），但没有轻型（Light）。基础双武器战斗不会把它当成短剑、弯刀或匕首处理。',
    },
    {
      question: '2024 DnD 里细剑有 Vex 吗？',
      answer:
        '2024 规则中的细剑有 Vex 武器掌握属性，但角色仍然需要能使用该武器掌握的特性或选项。',
    },
    {
      question: 'Vex 会让触发它的同一次细剑攻击获得优势吗？',
      answer:
        'Vex 在你命中并造成伤害后生效，让你在下回合结束前对同一生物的下一次攻击检定获得优势。',
    },
    {
      question: '细剑 + 匕首会自动给副手攻击吗？',
      answer:
        '不会。基础双武器规则需要满足对应的轻型武器条件。匕首是轻型，但细剑不是。',
    },
  ],
  relatedSlugs: ['dnd-dagger', 'dnd-mace', 'dnd-classes-explained', 'dnd-armor-guide'],
};

export const postsByLocale: Record<SiteLocale, BlogPost[]> = {
  en: [dndClassesComparisonArticle, dndCharacterSheetArticle, dndFighterArticle, playersHandbookDnd5eArticle, dndPaladinArticle, dndArtificerArticle, dndStatsArticle, dndLanguagesArticle, dndMeaningArticle, dndAlignmentChartArticle, dndRacesArticle, dndShatter5eArticle, dndGnomeNamesArticle, dndMaulArticle, dndQuarterstaffArticle, spectatorDndArticle, fireboltDnd5eArticle, dndDaggerArticle, dwelfDndArticle, dndFlumphArticle, dndDeathKnightArticle, dnd5eArmorerArticle, dndSwordSheathsArticle, dndThunderclapArticle, dndFindFamiliarArticle, dndHexArticle, paladin2024SpellsDndArticle, dndGlaiveArticle, dndSilveryBarbsArticle, dndShortswordArticle, dndBlessArticle, rapierDndArticle, dndRangerSpellsArticle, dndMaceArticle, dndDwarfNamesArticle, dndGhostArticle, dndDemonsArticle, dndBardSpellsArticle, dndMephistophelesArticle, dndClassesArticle, dndHuntersMarkArticle, dndNecromancerSpellsArticle, dndMageArmorArticle, dndGiantsArticle, dndCounterspellArticle, dndDhampirArticle, dndGrungArticle, dndClassesRankedArticle, dndArmorArticle, dndTokenGuideArticle, dndSmallPartyGuideArticle, dndConstitutionArticle, dndDruidSpellsArticle].map(
    addHeadingAnchors,
  ),
  zh: [dndClassesComparisonArticleZh, dndCharacterSheetArticleZh, dndFighterArticleZh, playersHandbookDnd5eArticleZh, dndPaladinArticleZh, dndArtificerArticleZh, dndStatsArticleZh, dndLanguagesArticleZh, dndMeaningArticleZh, dndAlignmentChartArticleZh, dndRacesArticleZh, dndShatter5eArticleZh, dndGnomeNamesArticleZh, dndMaulArticleZh, dndQuarterstaffArticleZh, spectatorDndArticleZh, fireboltDnd5eArticleZh, dndDaggerArticleZh, dwelfDndArticleZh, dndFlumphArticleZh, dndDeathKnightArticleZh, dnd5eArmorerArticleZh, dndSwordSheathsArticleZh, dndThunderclapArticleZh, dndFindFamiliarArticleZh, dndHexArticleZh, paladin2024SpellsDndArticleZh, dndGlaiveArticleZh, dndSilveryBarbsArticleZh, dndShortswordArticleZh, dndBlessArticleZh, rapierDndArticleZh, dndRangerSpellsArticleZh, dndMaceArticleZh, dndDwarfNamesArticleZh, dndGhostArticleZh, dndDemonsArticleZh, dndBardSpellsArticleZh, dndMephistophelesArticleZh, dndClassesArticleZh, dndHuntersMarkArticleZh, dndNecromancerSpellsArticleZh, dndMageArmorArticleZh, dndGiantsArticleZh, dndCounterspellArticleZh, dndDhampirArticleZh, dndGrungArticleZh, dndClassesRankedArticleZh, dndArmorArticleZh, dndTokenGuideArticleZh, dndSmallPartyGuideArticleZh, dndConstitutionArticleZh, dndDruidSpellsArticleZh].map(
    addHeadingAnchors,
  ),
};
