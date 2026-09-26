import type { Metadata } from 'next';

import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

import type { BlogCategorySlug, BlogPost } from './types';

export type { BlogCategorySlug };

export const BLOG_CATEGORY_SLUGS = [
  'characters',
  'monsters',
  'spells',
  'rules-and-prep',
] as const satisfies readonly BlogCategorySlug[];

export const UNCATEGORIZED_BLOG_POST_SLUG = 'greenhouse-stardew';

export type BlogCategoryCopy = {
  slug: BlogCategorySlug;
  label: string;
  description: string;
};

const BLOG_CATEGORY_PATH_PREFIX = '/blog/category';

const BLOG_CATEGORY_COPY_BY_LOCALE: Record<SiteLocale, Record<BlogCategorySlug, { label: string; description: string }>> =
  {
    en: {
      characters: {
        label: 'Characters',
        description:
          'Class, species, lineage, names, and character-creation guides for building a D&D player character.',
      },
      monsters: {
        label: 'Monsters',
        description:
          'Creature identities, encounter setup, and DM-facing monster guides for the table and the map.',
      },
      spells: {
        label: 'Spells',
        description: 'Spell rules, prepared lists, and school-of-magic guides for D&D casters.',
      },
      'rules-and-prep': {
        label: 'Rules & Game Prep',
        description:
          'Core rules, equipment, conditions, campaign products, and session-prep references.',
      },
    },
    zh: {
      characters: {
        label: '角色',
        description: '职业、物种、血统、名字和创角指南，用来完成一张可上场的 D&D 角色卡。',
      },
      monsters: {
        label: '怪物',
        description: '生物身份、遭遇安排，以及面向地下城主的怪物与地图指南。',
      },
      spells: {
        label: '法术',
        description: '法术规则、准备列表和学派分类，供 D&D 施法者查阅。',
      },
      'rules-and-prep': {
        label: '规则与游戏准备',
        description: '核心规则、装备、状态、现成战役和开团准备资料。',
      },
    },
  };

const BLOG_HUB_BREADCRUMB_LABEL_BY_LOCALE: Record<SiteLocale, string> = {
  en: 'Blog',
  zh: '博客',
};

const HOME_BREADCRUMB_LABEL_BY_LOCALE: Record<SiteLocale, string> = {
  en: 'Home',
  zh: '首页',
};

const BLOG_POST_CATEGORY_BY_SLUG: Record<string, BlogCategorySlug> = {
  'best-dnd-classes-for-small-parties': 'characters',
  'dnd-classes-explained': 'characters',
  'dnd-classes-ranked': 'characters',
  'dnd-classes-comparison': 'characters',
  'dnd-fighter': 'characters',
  'dnd-paladin': 'characters',
  'dnd-artificer': 'characters',
  'dnd-5e-armorer': 'characters',
  'dnd-ranger': 'characters',
  'dnd-druid': 'characters',
  'dnd-races': 'characters',
  'dnd-halfling': 'characters',
  'dnd-dragonborn': 'characters',
  'dnd-kenku': 'characters',
  'dnd-dhampir': 'characters',
  'dnd-grung': 'characters',
  'dwelf-dnd': 'characters',
  'dnd-dwarf-names': 'characters',
  'dnd-gnome-names': 'characters',
  'dnd-backgrounds': 'characters',
  'dnd-languages': 'characters',
  'dnd-alignment-chart': 'characters',
  'dnd-stats': 'characters',
  'dnd-kobold': 'monsters',
  'dnd-beholder': 'monsters',
  'mind-flayer-dnd': 'monsters',
  'dnd-ghost': 'monsters',
  'dnd-giants': 'monsters',
  'dnd-demons': 'monsters',
  'dnd-flumph': 'monsters',
  'spectator-dnd': 'monsters',
  'dnd-death-knight': 'monsters',
  'mephistopheles-dnd': 'monsters',
  'dnd-druid-spells': 'spells',
  'dnd-counterspell': 'spells',
  'dnd-mage-armor': 'spells',
  'dnd-hunters-mark': 'spells',
  'dnd-necromancer-spells': 'spells',
  'dnd-bard-spells': 'spells',
  'dnd-ranger-spells': 'spells',
  'dnd-thunderclap': 'spells',
  'dnd-find-familiar': 'spells',
  'dnd-silvery-barbs': 'spells',
  'dnd-bless': 'spells',
  'firebolt-dnd-5e': 'spells',
  'dnd-hex': 'spells',
  'paladin-2024-spells-dnd': 'spells',
  'dnd-cleric-spells': 'spells',
  'dnd-shatter-5e': 'spells',
  'dnd-wizard-spells': 'spells',
  'dnd-schools-of-magic': 'spells',
  'dnd-warlock-spells': 'spells',
  'dnd-character-sheet': 'rules-and-prep',
  'dnd-armor-guide': 'rules-and-prep',
  'dnd-constitution-guide': 'rules-and-prep',
  'dnd-mace': 'rules-and-prep',
  'dnd-sword-sheaths': 'rules-and-prep',
  'dnd-glaive': 'rules-and-prep',
  'dnd-shortsword': 'rules-and-prep',
  'rapier-dnd': 'rules-and-prep',
  'dnd-dagger': 'rules-and-prep',
  'dnd-maul': 'rules-and-prep',
  'dnd-quarterstaff': 'rules-and-prep',
  'players-handbook-dnd-5e': 'rules-and-prep',
  'dnd-skills': 'rules-and-prep',
  'dnd-conditions': 'rules-and-prep',
  'dnd-meaning': 'rules-and-prep',
  'dnd-campaigns': 'rules-and-prep',
};

function formatIllegalValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined';
  }

  return JSON.stringify(value);
}

function requireBlogLocale(locale: SiteLocale): SiteLocale {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(`Unknown blog locale: ${formatIllegalValue(locale)}.`);
  }

  return locale;
}

export function isBlogCategorySlug(value: string): value is BlogCategorySlug {
  return (BLOG_CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function requireBlogCategorySlug(value: unknown): BlogCategorySlug {
  if (typeof value !== 'string' || !isBlogCategorySlug(value)) {
    throw new Error(`Unknown blog category slug: ${formatIllegalValue(value)}.`);
  }

  return value;
}

function getBlogCategoryPathSegment(categorySlug: string): string {
  return `${BLOG_CATEGORY_PATH_PREFIX}/${requireBlogCategorySlug(categorySlug)}`;
}

export function getBlogCategories(locale: SiteLocale): BlogCategoryCopy[] {
  const resolvedLocale = requireBlogLocale(locale);
  return BLOG_CATEGORY_SLUGS.map((slug) => getBlogCategory(resolvedLocale, slug));
}

export function getBlogCategory(locale: SiteLocale, categorySlug: string): BlogCategoryCopy {
  const resolvedLocale = requireBlogLocale(locale);
  const slug = requireBlogCategorySlug(categorySlug);
  const copy = BLOG_CATEGORY_COPY_BY_LOCALE[resolvedLocale][slug];
  return {
    slug,
    label: copy.label,
    description: copy.description,
  };
}

export function getBlogCategoryPath(locale: SiteLocale, categorySlug: string): string {
  const resolvedLocale = requireBlogLocale(locale);
  return getLocalizedPath(resolvedLocale, getBlogCategoryPathSegment(categorySlug));
}

export function assignBlogPostCategory(post: BlogPost): BlogPost {
  if (post.slug === UNCATEGORIZED_BLOG_POST_SLUG) {
    if (post.category !== undefined) {
      throw new Error(
        `Blog post slug=${formatIllegalValue(post.slug)} must remain uncategorized, received category=${formatIllegalValue(post.category)}.`,
      );
    }

    return post;
  }

  const mappedCategory = BLOG_POST_CATEGORY_BY_SLUG[post.slug];
  if (mappedCategory === undefined) {
    throw new Error(`Blog post slug=${formatIllegalValue(post.slug)} is missing a required category.`);
  }

  if (post.category !== undefined && post.category !== mappedCategory) {
    throw new Error(
      `Blog post slug=${formatIllegalValue(post.slug)} has conflicting category=${formatIllegalValue(post.category)}, mapped=${formatIllegalValue(mappedCategory)}.`,
    );
  }

  if (post.category === mappedCategory) {
    return post;
  }

  return { ...post, category: mappedCategory };
}

export function createBlogCategoryMetadata(locale: SiteLocale, categorySlug: string): Metadata {
  const category = getBlogCategory(locale, categorySlug);
  const siteConfig = getSiteConfig(locale);
  const path = getBlogCategoryPathSegment(category.slug);
  const localizedPath = getBlogCategoryPath(locale, category.slug);
  const socialImage = getSeoImageUrl(locale, 'home');

  return {
    metadataBase: new URL(getSiteUrl()),
    title: category.label,
    description: category.description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title: `${category.label} | ${siteConfig.name}`,
      description: category.description,
      url: absoluteUrl(localizedPath),
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [{ url: socialImage, alt: category.label }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.label} | ${siteConfig.name}`,
      description: category.description,
      images: [socialImage],
    },
  };
}

export function buildBlogCategoryCollectionStructuredData(locale: SiteLocale, categorySlug: string) {
  const category = getBlogCategory(locale, categorySlug);
  const siteConfig = getSiteConfig(locale);
  const localizedPath = getBlogCategoryPath(locale, category.slug);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.label,
    url: absoluteUrl(localizedPath),
    description: category.description,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
  };
}

export function buildBlogCategoryBreadcrumbStructuredData(locale: SiteLocale, categorySlug: string) {
  const resolvedLocale = requireBlogLocale(locale);
  const category = getBlogCategory(resolvedLocale, categorySlug);
  const localizedPath = getBlogCategoryPath(resolvedLocale, category.slug);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: HOME_BREADCRUMB_LABEL_BY_LOCALE[resolvedLocale],
        item: absoluteUrl(getLocalizedPath(resolvedLocale, '/')),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: BLOG_HUB_BREADCRUMB_LABEL_BY_LOCALE[resolvedLocale],
        item: absoluteUrl(getLocalizedPath(resolvedLocale, '/blog')),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.label,
        item: absoluteUrl(localizedPath),
      },
    ],
  };
}
