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
  DND_MEPHISTOPHELES_COVER_PATH,
  DND_BARD_SPELLS_COVER_PATH,
  DND_DEMONS_COVER_PATH,
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

export const BLOG_POSTS_PER_PAGE = 9;

// Blog routes are ready for indexing and should be included in sitemap output.
export const BLOG_PLACEHOLDER_MODE = false;

const blogHubCopyByLocale = {
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

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  publishedAt?: string;
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

const postsByLocale: Record<SiteLocale, BlogPost[]> = {
  en: [dndDemonsArticle, dndBardSpellsArticle, dndMephistophelesArticle, dndClassesArticle, dndHuntersMarkArticle, dndNecromancerSpellsArticle, dndMageArmorArticle, dndGiantsArticle, dndCounterspellArticle, dndDhampirArticle, dndGrungArticle, dndClassesRankedArticle, dndArmorArticle, dndTokenGuideArticle, dndSmallPartyGuideArticle, dndConstitutionArticle, dndDruidSpellsArticle].map(
    addHeadingAnchors,
  ),
  zh: [dndDemonsArticleZh, dndBardSpellsArticleZh, dndMephistophelesArticleZh, dndClassesArticleZh, dndHuntersMarkArticleZh, dndNecromancerSpellsArticleZh, dndMageArmorArticleZh, dndGiantsArticleZh, dndCounterspellArticleZh, dndDhampirArticleZh, dndGrungArticleZh, dndClassesRankedArticleZh, dndArmorArticleZh, dndTokenGuideArticleZh, dndSmallPartyGuideArticleZh, dndConstitutionArticleZh, dndDruidSpellsArticleZh].map(
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

export function getBlogHubTitle(locale: SiteLocale, page = 1) {
  const title = blogHubCopyByLocale[locale].title;

  if (page <= 1) {
    return title;
  }

  return locale === 'zh' ? `${title} - 第 ${page} 页` : `${title} - Page ${page}`;
}

export function getBlogHubDescription(locale: SiteLocale) {
  return blogHubCopyByLocale[locale].description;
}

export function createBlogHubMetadata(locale: SiteLocale, page = 1): Metadata {
  const siteConfig = getSiteConfig(locale);
  const path = page === 1 ? '/blog' : `/blog/page/${page}`;
  const localizedPath = getLocalizedPath(locale, path);
  const title = getBlogHubTitle(locale, page);
  const description = getBlogHubDescription(locale);

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
  const publishedTime = post.publishedAt ?? post.updatedAt;

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
      publishedTime,
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
  const title = getBlogHubTitle(locale, page);
  const description = getBlogHubDescription(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: absoluteUrl(getLocalizedPath(locale, path)),
    description,
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
    datePublished: post.publishedAt ?? post.updatedAt,
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
