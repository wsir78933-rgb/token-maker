import type { Metadata } from 'next';

import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { LOCALES, getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import {
  DND_CLASSES_COVER_PATH,
  DND_CLASSES_RANKED_COVER_PATH,
  DND_ARMOR_COVER_PATH,
  DND_CONSTITUTION_COVER_PATH,
  DND_DRUID_SPELLS_COVER_PATH,
  DND_DHAMPIR_COVER_PATH,
  DND_GRUNG_COVER_PATH,
  DND_COUNTERSPELL_COVER_PATH,
} from '@/lib/blog-posts/shared';
import { dndClassesArticleHtml, dndClassesArticleHtmlZh } from '@/lib/blog-posts/dnd-classes-explained';
import { dndClassesRankedArticleHtml, dndClassesRankedArticleHtmlZh } from '@/lib/blog-posts/dnd-classes-ranked';
import { dndArmorArticleHtml, dndArmorArticleHtmlZh } from '@/lib/blog-posts/dnd-armor-guide';
import { dndConstitutionArticleHtml, dndConstitutionArticleHtmlZh } from '@/lib/blog-posts/dnd-constitution-guide';
import { dndDruidSpellsArticleHtml, dndDruidSpellsArticleHtmlZh } from '@/lib/blog-posts/dnd-druid-spells';
import { dndDhampirArticleHtml, dndDhampirArticleHtmlZh } from '@/lib/blog-posts/dnd-dhampir';
import { dndGrungArticleHtml, dndGrungArticleHtmlZh } from '@/lib/blog-posts/dnd-grung';
import { dndCounterspellArticleHtml, dndCounterspellArticleHtmlZh } from '@/lib/blog-posts/dnd-counterspell';

export const BLOG_POSTS_PER_PAGE = 9;

// Blog routes are ready for indexing and should be included in sitemap output.
export const BLOG_PLACEHOLDER_MODE = false;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  readTime: string;
  coverLabel: string;
  coverImage?: string;
  coverAlt?: string;
  bodyHtml?: string;
  headings?: BlogPostHeading[];
  relatedSlugs?: string[];
  faqItems?: BlogPostFaqItem[];
  seoTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface BlogPostFaqItem {
  question: string;
  answer: string;
}

export interface BlogPostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

type PlaceholderCopy = {
  featuredTitle: string;
  featuredExcerpt: string;
  coverLabel: string;
  detailTitle: string;
  detailBody: string;
  ctaTitle: string;
  ctaBody: string;
};

function decodeHeadingText(value: string) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function createHeadingSlug(text: string) {
  const normalized = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'section';
}

function addHeadingAnchors(post: BlogPost): BlogPost {
  if (!post.bodyHtml) {
    return post;
  }

  const headingCounts = new Map<string, number>();
  const headings: BlogPostHeading[] = [];
  const bodyHtml = post.bodyHtml.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelValue, attrs, innerHtml) => {
    const text = decodeHeadingText(innerHtml);

    if (!text) {
      return match;
    }

    const level = Number(levelValue) as BlogPostHeading['level'];
    const existingId = attrs.match(/\sid=(['"])(.*?)\1/i)?.[2];
    const baseId = existingId ?? createHeadingSlug(text);
    const nextCount = (headingCounts.get(baseId) ?? 0) + 1;
    const uniqueId = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

    headingCounts.set(baseId, nextCount);
    headings.push({ id: uniqueId, text, level });

    if (existingId) {
      return `<h${level}${attrs.replace(/\sid=(['"])(.*?)\1/i, ` id="${uniqueId}"`)}>${innerHtml}</h${level}>`;
    }

    return `<h${level}${attrs} id="${uniqueId}">${innerHtml}</h${level}>`;
  });

  return {
    ...post,
    bodyHtml,
    headings,
  };
}

function isPublishedBlogPost(post: BlogPost) {
  return !post.placeholder && Boolean(post.bodyHtml);
}

const DND_CLASSES_UPDATED_AT = '2026-03-29';
const DND_CLASSES_RANKED_UPDATED_AT = '2026-03-29';
const BLOG_TOKEN_GUIDE_UPDATED_AT = '2026-03-27';
const BLOG_SMALL_PARTY_GUIDE_UPDATED_AT = '2026-03-25';
const DND_ARMOR_UPDATED_AT = '2026-04-06';
const DND_CONSTITUTION_UPDATED_AT = '2026-04-07';
const DND_DRUID_SPELLS_UPDATED_AT = '2026-04-09';
const DND_DHAMPIR_UPDATED_AT = '2026-04-17';
const DND_GRUNG_UPDATED_AT = '2026-04-20';
const DND_COUNTERSPELL_UPDATED_AT = '2026-04-25';

const placeholderCopyByLocale: Record<SiteLocale, PlaceholderCopy> = {
  en: {
    featuredTitle: 'Featured Article Placeholder',
    featuredExcerpt:
      'Replace this summary with the lead article you want to feature at the top of the list.',
    coverLabel: 'Cover',
    detailTitle: 'Content Placeholder',
    detailBody:
      'This article has not been written yet. Replace the placeholder post data with your real title, summary, and body source later.',
    ctaTitle: 'Want to make your own tabletop portrait?',
    ctaBody:
      'Upload an image and turn it into a token for Roll20, Foundry, or any other virtual tabletop.',
  },
  zh: {
    featuredTitle: '重点文章占位标题',
    featuredExcerpt: '这里先留给你后续要放在首屏的重点文章摘要。',
    coverLabel: '封面',
    detailTitle: '内容占位区',
    detailBody:
      '这篇文章还没有开始写。后续你只需要把占位数据替换成真实标题、摘要和正文来源就可以了。',
    ctaTitle: '如果你也想做自己的桌面头像',
    ctaBody: '这里可以直接把角色图处理成适合 Roll20、Foundry 或其他虚拟桌面的 Token。',
  },
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
  title: 'DND Armor Guide: Every Armor Type, AC Values, and Best Picks by Class',
  seoTitle: 'DND Armor Guide: All Armor Types, AC Values & Class Picks in D&D 5e',
  metaDescription:
    'Complete DND armor guide with every armor type, AC values, and class recommendations. Compare light, medium, and heavy armor in D&D 5e and learn which option is best for your build.',
  excerpt:
    'A complete reference for every DND armor type in 5e. Compare AC values, stealth penalties, and class fit so you always pick the right armor for your character.',
  updatedAt: DND_ARMOR_UPDATED_AT,
  readTime: '13 min read',
  coverLabel: 'DND Armor',
  coverImage: DND_ARMOR_COVER_PATH,
  coverAlt: 'A hooded rogue in dark leather armor standing in a moonlit medieval city, representing DND armor choices',
  bodyHtml: dndArmorArticleHtml,
  relatedSlugs: ['dnd-classes-explained', 'dnd-classes-ranked'],
};

const dndArmorArticleZh: BlogPost = {
  slug: 'dnd-armor-guide',
  title: 'DND 护甲指南：所有护甲类型、AC 数值与职业推荐',
  seoTitle: 'DND 护甲指南：D&D 5e 全部护甲类型、AC 计算与最佳选择',
  metaDescription:
    '最完整的 DND 护甲参考指南，涵盖轻甲、中甲和重甲的 AC 数值、隐匿影响和适用职业，帮你为角色选出最合适的护甲。',
  excerpt:
    '一份覆盖 D&D 5e 所有护甲类型的完整参考。对比 AC 数值、隐匿代价和职业适配，让你每次都能选对护甲。',
  updatedAt: DND_ARMOR_UPDATED_AT,
  readTime: '13 分钟阅读',
  coverLabel: 'DND 护甲',
  coverImage: DND_ARMOR_COVER_PATH,
  coverAlt: '一名穿着深色皮甲的兔帽潜行者站在月光下的中世纪城市中，代表 DND 护甲选择',
  bodyHtml: dndArmorArticleHtmlZh,
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
  title: 'D&D Druid Spells Guide: Best Cantrips and Circle Magic Explained',
  excerpt: 'A highly structured tier list of the absolute best DND druid spells from levels 0s to 3 based on years of tabletop play. Avoid spell traps and maximize your impact.',
  updatedAt: DND_DRUID_SPELLS_UPDATED_AT,
  readTime: '6 min read',
  coverLabel: 'Spells',
  coverImage: DND_DRUID_SPELLS_COVER_PATH,
  bodyHtml: dndDruidSpellsArticleHtml,
};

const dndDruidSpellsArticleZh: BlogPost = {
  slug: 'dnd-druid-spells',
  title: 'DND 德鲁伊法术 (Druid Spells) 终极指南：实测最好用的法术避坑排名',
  seoTitle: 'DND 德鲁伊法术 (Druid Spells) 终极红黑榜：新手最好用的法术推荐',
  metaDescription: 'DND 德鲁伊法术不知道怎么选？这份基于实战跑团经验整理的 0-3 环法术红黑榜，带你避开坑爹法术，一眼挑出最强神技（内附视频解读）。',
  excerpt: '不知道怎么选 DND 德鲁伊法术？这份基于两年实战带团经验整理的 0-3 环法术红黑榜，带你完美避开法术表里的“假神技”。',
  updatedAt: DND_DRUID_SPELLS_UPDATED_AT,
  readTime: '6 分钟阅读',
  coverLabel: '百科',
  coverImage: DND_DRUID_SPELLS_COVER_PATH,
  coverAlt: 'A cute doodle illustration of a DND druid casting a spell',
  bodyHtml: dndDruidSpellsArticleHtmlZh,
};



const dndDhampirArticle: BlogPost = {
  slug: 'dnd-dhampir',
  title: 'DND Dhampir Guide: Traits, Vampiric Bite, Best Classes, and Roleplay Tips',
  seoTitle: 'DND Dhampir Guide: Traits, Bite, and Best Builds in 5e',
  metaDescription:
    'Learn what a DND dhampir is, how Vampiric Bite works, which classes fit best, and how to roleplay the lineage without annoying your table. Includes a quick reference table and video embed.',
  excerpt:
    'A practical DND dhampir guide with quick trait summaries, bite strategy, best classes, roleplay tips, and FAQ answers for 5e players.',
  updatedAt: DND_DHAMPIR_UPDATED_AT,
  readTime: '9 min read',
  coverLabel: 'Lineage Guide',
  coverImage: DND_DHAMPIR_COVER_PATH,
  coverAlt: 'DND dhampir doodle cover showing a cartoon half-vampire adventurer under a moonlit castle',
  bodyHtml: dndDhampirArticleHtml,
  relatedSlugs: ['dnd-classes-explained', 'dnd-constitution-guide'],
};

const dndDhampirArticleZh: BlogPost = {
  slug: 'dnd-dhampir',
  title: 'DND Dhampir 指南：种族特性、咬击机制、最佳职业与跑团演法',
  seoTitle: 'DND Dhampir 指南：特性、咬击与最佳构筑',
  metaDescription:
    '这篇 DND Dhampir 百科页会直接告诉你 Dhampir 强不强、Vampiric Bite 怎么用、哪些职业最适合，以及怎样把这个谱系演得有张力又不烦人。',
  excerpt:
    '围绕 dnd dhampir 关键词整理的一篇实战百科页，先给速查表，再讲咬击、职业搭配、角色扮演和 FAQ。',
  updatedAt: DND_DHAMPIR_UPDATED_AT,
  readTime: '9 分钟阅读',
  coverLabel: '种族百科',
  coverImage: DND_DHAMPIR_COVER_PATH,
  coverAlt: 'DND dhampir 简笔插画封面，月光下的半吸血鬼卡通冒险者',
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
    'A practical DND grung guide with quick reference answers, trait breakdowns, DM approval tips, best classes, roleplay notes, FAQ answers, and a video embed.',
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
    '围绕 dnd grung 关键词整理的一篇实战百科页，先给速查结论，再讲规则要点、职业搭配、DM 关注点、FAQ 和视频补充。',
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
    'A practical dnd counterspell encyclopedia guide covering 2014 and 2024 rules, timing, spell slot outcomes, common rulings, DM policy, FAQ, and a video embed.',
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
    '围绕 dnd counterspell 关键词整理的实战百科页，先给速查表，再讲 2014/2024 规则差异、常见裁定、DM 建议、FAQ 和视频嵌入。',
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

const postsByLocale: Record<SiteLocale, BlogPost[]> = {
  en: [dndClassesArticle, dndCounterspellArticle, dndDhampirArticle, dndGrungArticle, dndClassesRankedArticle, dndArmorArticle, dndTokenGuideArticle, dndSmallPartyGuideArticle, dndConstitutionArticle, dndDruidSpellsArticle].map(
    addHeadingAnchors,
  ),
  zh: [dndClassesArticleZh, dndCounterspellArticleZh, dndDhampirArticleZh, dndGrungArticleZh, dndClassesRankedArticleZh, dndArmorArticleZh, dndTokenGuideArticleZh, dndSmallPartyGuideArticleZh, dndConstitutionArticleZh, dndDruidSpellsArticleZh].map(
    addHeadingAnchors,
  ),
};

export function getBlogPosts(locale: SiteLocale) {
  return postsByLocale[locale].filter(isPublishedBlogPost);
}

export function getFeaturedBlogPost(locale: SiteLocale) {
  return getBlogPosts(locale).find((post) => post.featured) ?? getBlogPosts(locale)[0];
}

export function getBlogPost(locale: SiteLocale, slug: string) {
  return getBlogPosts(locale).find((post) => post.slug === slug);
}

function getBlogPostLanguageAlternates(slug: string) {
  const path = `/blog/${slug}`;
  const availableLocales = LOCALES.filter((locale) => Boolean(getBlogPost(locale, slug)));

  if (availableLocales.length === 0) {
    return getLanguageAlternates(path);
  }

  const alternates: Record<string, string> = {
    'x-default': getLocalizedPath(availableLocales.includes('en') ? 'en' : availableLocales[0], path),
  };

  for (const locale of availableLocales) {
    alternates[locale === 'zh' ? 'zh-CN' : 'en-US'] = getLocalizedPath(locale, path);
  }

  return alternates;
}

export function getRelatedBlogPosts(locale: SiteLocale, slug: string, limit = 3) {
  const currentPost = getBlogPost(locale, slug);

  if (!currentPost) {
    return [];
  }

  const candidatePosts = getBlogPosts(locale).filter((post) => post.slug !== slug);
  const explicitMatches = (currentPost.relatedSlugs ?? [])
    .map((relatedSlug) => candidatePosts.find((post) => post.slug === relatedSlug))
    .filter((post): post is BlogPost => Boolean(post));
  const fallbackMatches = candidatePosts
    .filter((post) => !explicitMatches.some((matchedPost) => matchedPost.slug === post.slug))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  return [...explicitMatches, ...fallbackMatches].slice(0, limit);
}

export function getBlogPageCount(locale: SiteLocale) {
  const regularPosts = getBlogPosts(locale).filter((post) => !post.featured);
  return Math.max(1, Math.ceil(regularPosts.length / BLOG_POSTS_PER_PAGE));
}

export function getBlogPostsForPage(locale: SiteLocale, page: number) {
  const regularPosts = getBlogPosts(locale).filter((post) => !post.featured);
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * BLOG_POSTS_PER_PAGE;
  return regularPosts.slice(startIndex, startIndex + BLOG_POSTS_PER_PAGE);
}

export function getBlogPagePath(locale: SiteLocale, page: number) {
  const normalizedPage = Math.max(1, page);
  return getLocalizedPath(locale, normalizedPage === 1 ? '/blog' : `/blog/page/${normalizedPage}`);
}

export function getBlogPostPath(locale: SiteLocale, slug: string) {
  return getLocalizedPath(locale, `/blog/${slug}`);
}

export function formatBlogUpdatedAt(locale: SiteLocale, isoDate: string) {
  const formatter =
    locale === 'zh'
      ? new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      : new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

  return formatter.format(new Date(isoDate));
}

export function createBlogHubMetadata(locale: SiteLocale, page = 1): Metadata {
  const siteConfig = getSiteConfig(locale);
  const path = page === 1 ? '/blog' : `/blog/page/${page}`;
  const localizedPath = getLocalizedPath(locale, path);
  const title =
    locale === 'zh'
      ? page === 1
        ? 'Token Maker 文章列表'
        : `Token Maker 文章列表 - 第 ${page} 页`
      : page === 1
        ? 'Token Maker Articles'
        : `Token Maker Articles - Page ${page}`;
  const description =
    locale === 'zh'
      ? '阅读 Token Maker 的桌面头像与 DND 相关文章，查看职业选择、角色头像处理和虚拟桌面使用建议。'
      : 'Read Token Maker articles about DND classes, tabletop portraits, and practical virtual tabletop workflows.';

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(localizedPath),
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    robots: BLOG_PLACEHOLDER_MODE
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function createBlogPostMetadata(locale: SiteLocale, slug: string): Metadata {
  const siteConfig = getSiteConfig(locale);
  const post = getBlogPost(locale, slug);

  if (!post) {
    return {
      title: locale === 'zh' ? '文章不存在' : 'Article not found',
    };
  }

  const path = `/blog/${slug}`;
  const localizedPath = getLocalizedPath(locale, path);
  const metadataTitle = post.seoTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const absoluteCoverImage = post.coverImage ? absoluteUrl(post.coverImage) : undefined;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: metadataTitle,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getBlogPostLanguageAlternates(slug),
    },
    openGraph: {
      title: `${metadataTitle} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(localizedPath),
      siteName: siteConfig.name,
      type: 'article',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      publishedTime: post.updatedAt,
      modifiedTime: post.updatedAt,
      images: absoluteCoverImage
        ? [
            {
              url: absoluteCoverImage,
              alt: post.coverAlt ?? post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: absoluteCoverImage ? 'summary_large_image' : 'summary',
      title: `${metadataTitle} | ${siteConfig.name}`,
      description,
      images: absoluteCoverImage ? [absoluteCoverImage] : undefined,
    },
    robots: BLOG_PLACEHOLDER_MODE
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function buildBlogHubStructuredData(locale: SiteLocale, page = 1) {
  const siteConfig = getSiteConfig(locale);
  const path = page === 1 ? '/blog' : `/blog/page/${page}`;
  const title = locale === 'zh' ? 'Token Maker 文章列表' : 'Token Maker Articles';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: absoluteUrl(getLocalizedPath(locale, path)),
    description:
      locale === 'zh'
        ? 'Token Maker 博客文章列表，聚焦 DND 职业选择、头像处理和虚拟桌面实践。'
        : 'Token Maker blog archive covering DND classes, portrait prep, and practical VTT workflow advice.',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
  };
}

export function buildBlogPostStructuredData(locale: SiteLocale, slug: string) {
  const post = getBlogPost(locale, slug);

  if (!post) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    dateModified: post.updatedAt,
    datePublished: post.updatedAt,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    url: absoluteUrl(getBlogPostPath(locale, slug)),
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : undefined,
  };
}

export function buildBlogPostFaqStructuredData(locale: SiteLocale, slug: string) {
  const post = getBlogPost(locale, slug);

  if (!post?.faqItems?.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    mainEntity: post.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getBlogPlaceholderCopy(locale: SiteLocale) {
  return placeholderCopyByLocale[locale];
}
