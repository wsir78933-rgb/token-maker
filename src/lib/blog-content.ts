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
  DND_GIANTS_COVER_PATH,
  DND_MAGE_ARMOR_COVER_PATH,
  DND_NECROMANCER_SPELLS_COVER_PATH,
  DND_HUNTERS_MARK_COVER_PATH,
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

function isFaqHeadingText(text: string) {
  const normalized = text.toLowerCase();

  return normalized.includes('faq') || normalized.includes('常见问题');
}

function addHtmlClass(openingTag: string, className: string) {
  const classMatch = openingTag.match(/\sclass=(['"])(.*?)\1/i);

  if (!classMatch) {
    return openingTag.replace(/>$/, ` class="${className}">`);
  }

  const [fullMatch, quote, currentClasses] = classMatch;
  const classNames = currentClasses.split(/\s+/).filter(Boolean);

  if (classNames.includes(className)) {
    return openingTag;
  }

  return openingTag.replace(fullMatch, ` class=${quote}${className} ${currentClasses}${quote}`);
}

function addHtmlAttribute(openingTag: string, name: string, value: string) {
  const attrPattern = new RegExp(`\\s${name}=(['"]).*?\\1`, 'i');

  if (attrPattern.test(openingTag)) {
    return openingTag;
  }

  return openingTag.replace(/>$/, ` ${name}="${value}">`);
}

function enhanceExistingFaqCards(html: string) {
  return html.replace(
    /(<section\b(?=[^>]*\bid=["']faq["'])[^>]*>)([\s\S]*?)(<\/section>)/gi,
    (_match, openingTag: string, innerHtml: string, closingTag: string) => {
      const sectionTag = addHtmlClass(openingTag, 'blog-faq-section');
      const enhancedInnerHtml = innerHtml.replace(/<article\b[^>]*>/gi, (articleTag) =>
        addHtmlAttribute(addHtmlClass(articleTag, 'blog-faq-item'), 'tabindex', '0'),
      );

      return `${sectionTag}${enhancedInnerHtml}${closingTag}`;
    },
  );
}

function wrapFaqSegment(segmentHtml: string) {
  if (/<article\b/i.test(segmentHtml) || /\bblog-faq-list\b/i.test(segmentHtml)) {
    return segmentHtml;
  }

  const questionMatches = Array.from(segmentHtml.matchAll(/<h3\b[^>]*>[\s\S]*?<\/h3>/gi));

  if (questionMatches.length === 0) {
    return segmentHtml;
  }

  const firstQuestionIndex = questionMatches[0].index ?? 0;
  const leadInHtml = segmentHtml.slice(0, firstQuestionIndex);
  const faqItemsHtml = questionMatches
    .map((questionMatch, index) => {
      const questionHtml = questionMatch[0];
      const questionIndex = questionMatch.index ?? 0;
      const answerStartIndex = questionIndex + questionHtml.length;
      const nextQuestionIndex = questionMatches[index + 1]?.index ?? segmentHtml.length;
      const answerHtml = segmentHtml.slice(answerStartIndex, nextQuestionIndex).trim();

      return `<article class="blog-faq-item" tabindex="0">
${questionHtml}
<div class="blog-faq-answer">
${answerHtml}
</div>
</article>`;
    })
    .join('\n');

  return `${leadInHtml}<div class="blog-faq-list">
${faqItemsHtml}
</div>`;
}

function enhanceBlogFaqHtml(html: string) {
  const htmlWithFaqCards = enhanceExistingFaqCards(html);
  const h2Matches = Array.from(htmlWithFaqCards.matchAll(/<h2\b[^>]*>[\s\S]*?<\/h2>/gi));

  if (h2Matches.length === 0) {
    return htmlWithFaqCards;
  }

  let enhancedHtml = '';
  let cursor = 0;

  h2Matches.forEach((headingMatch, index) => {
    const headingStartIndex = headingMatch.index ?? 0;
    const headingHtml = headingMatch[0];
    const headingEndIndex = headingStartIndex + headingHtml.length;
    const nextHeadingIndex = h2Matches[index + 1]?.index ?? htmlWithFaqCards.length;
    const sectionHtml = htmlWithFaqCards.slice(headingEndIndex, nextHeadingIndex);
    const headingText = decodeHeadingText(headingHtml);

    enhancedHtml += htmlWithFaqCards.slice(cursor, headingEndIndex);
    enhancedHtml += isFaqHeadingText(headingText) ? wrapFaqSegment(sectionHtml) : sectionHtml;
    cursor = nextHeadingIndex;
  });

  return enhancedHtml + htmlWithFaqCards.slice(cursor);
}

function addHeadingAnchors(post: BlogPost): BlogPost {
  if (!post.bodyHtml) {
    return post;
  }

  const headingCounts = new Map<string, number>();
  const headings: BlogPostHeading[] = [];
  const bodyHtml = enhanceBlogFaqHtml(post.bodyHtml).replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelValue, attrs, innerHtml) => {
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
const DND_GIANTS_UPDATED_AT = '2026-04-28';
const DND_MAGE_ARMOR_UPDATED_AT = '2026-04-29';
const DND_NECROMANCER_SPELLS_UPDATED_AT = '2026-05-02';
const DND_HUNTERS_MARK_UPDATED_AT = '2026-05-02';

const placeholderCopyByLocale: Record<SiteLocale, PlaceholderCopy> = {
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
  coverAlt: 'A fantasy armory with leather, chain mail, shields, and polished plate armor arranged for DND armor choices',
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
  coverAlt: '奇幻军械库中陈列着皮甲、锁子甲、盾牌和板甲，用来展示 DND 护甲选择',
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
  coverAlt: 'DND druid spells cover showing a druid channeling moonlit nature magic in an ancient forest clearing',
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
  coverAlt: 'DND druid spells cover showing a druid channeling moonlit nature magic in an ancient forest clearing',
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
    'A practical dnd giants encyclopedia guide with a quick type table, lore notes, encounter design advice, VTT token tips, FAQ answers, and a YouTube video embed.',
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
    'A practical dnd mage armor guide covering AC math, 2014/2024 rules, stacking rulings, best users, VTT token tips, FAQ, and a lazy-loaded YouTube video embed.',
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
    '一篇实用 dnd mage armor 法术百科，覆盖 AC 计算、2014/2024 规则、叠加裁定、适用角色、VTT Token 建议、FAQ 和视频嵌入。',
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
    "A practical dnd hunter's mark spell guide covering 2024/2014 rules, damage triggers, concentration tradeoffs, common rulings, VTT token tracking, FAQ, and a lazy-loaded video embed.",
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
    "一篇实用 dnd hunter's mark 法术百科，覆盖 2024/2014 规则、伤害触发、专注取舍、常见裁定、VTT Token 标记、FAQ 和视频嵌入。",
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
    '这篇 dnd necromancer spells 指南整理按环级死灵法术清单、Animate Dead 规则、Skeleton vs Zombie、FAQ 和懒加载视频。',
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

const postsByLocale: Record<SiteLocale, BlogPost[]> = {
  en: [dndClassesArticle, dndHuntersMarkArticle, dndNecromancerSpellsArticle, dndMageArmorArticle, dndGiantsArticle, dndCounterspellArticle, dndDhampirArticle, dndGrungArticle, dndClassesRankedArticle, dndArmorArticle, dndTokenGuideArticle, dndSmallPartyGuideArticle, dndConstitutionArticle, dndDruidSpellsArticle].map(
    addHeadingAnchors,
  ),
  zh: [dndClassesArticleZh, dndHuntersMarkArticleZh, dndNecromancerSpellsArticleZh, dndMageArmorArticleZh, dndGiantsArticleZh, dndCounterspellArticleZh, dndDhampirArticleZh, dndGrungArticleZh, dndClassesRankedArticleZh, dndArmorArticleZh, dndTokenGuideArticleZh, dndSmallPartyGuideArticleZh, dndConstitutionArticleZh, dndDruidSpellsArticleZh].map(
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
