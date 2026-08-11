import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPageCount,
  getBlogPost,
  getBlogPostPath,
  getBlogPosts,
  getBlogPostsForPage,
} from '@/lib/blog-content';

const DND_BLESS_SLUG = 'dnd-bless';
const DND_THUNDERCLAP_SLUG = 'dnd-thunderclap';
const DND_FIND_FAMILIAR_SLUG = 'dnd-find-familiar';
const DND_HEX_SLUG = 'dnd-hex';
const DND_GLAIVE_SLUG = 'dnd-glaive';
const PALADIN_2024_SPELLS_DND_SLUG = 'paladin-2024-spells-dnd';
const DND_SILVERY_BARBS_SLUG = 'dnd-silvery-barbs';
const DND_SHORTSWORD_SLUG = 'dnd-shortsword';
const RAPIER_DND_SLUG = 'rapier-dnd';
const DND_SWORD_SHEATHS_SLUG = 'dnd-sword-sheaths';
const DND_5E_ARMORER_SLUG = 'dnd-5e-armorer';
const DND_DEATH_KNIGHT_SLUG = 'dnd-death-knight';
const DND_FLUMPH_SLUG = 'dnd-flumph';
const DWELF_DND_SLUG = 'dwelf-dnd';
const DND_DAGGER_SLUG = 'dnd-dagger';
const FIREBOLT_DND_5E_SLUG = 'firebolt-dnd-5e';
const SPECTATOR_DND_SLUG = 'spectator-dnd';
const DND_QUARTERSTAFF_SLUG = 'dnd-quarterstaff';
const DND_MAUL_SLUG = 'dnd-maul';
const DND_GNOME_NAMES_SLUG = 'dnd-gnome-names';
const DND_SHATTER_5E_SLUG = 'dnd-shatter-5e';
const DND_RACES_SLUG = 'dnd-races';
const FIRST_BLOG_PAGE_SLUGS = [
  DND_RACES_SLUG,
  DND_SHATTER_5E_SLUG,
  DND_GNOME_NAMES_SLUG,
  DND_MAUL_SLUG,
  DND_QUARTERSTAFF_SLUG,
  SPECTATOR_DND_SLUG,
  FIREBOLT_DND_5E_SLUG,
  DND_DAGGER_SLUG,
  DWELF_DND_SLUG,
  DND_FLUMPH_SLUG,
];

describe('published blog body voice', () => {
  test('does not use author-facing search-intent or content-planning narration', () => {
    const thirdPersonSearchIntentPatterns = [
      /\b(?:If you searched for|Most searches for)\b/i,
      /\bIf you are searching for\b/i,
      /\bis a deceptively practical search\b/i,
      /\bThis is the quick .* most players are looking for\b/i,
      /\bbecause that is how most players search for\b/i,
      /\bKeep the (?:written )?article open\b/i,
      /\bA useful .* guide should answer\b/i,
      /\bThe problem is that most class rankings\b/i,
      /\bOne weakness of many ranking articles\b/i,
      /\bThis comparison is where many lore pages\b/i,
      /\bYou probably want either\b/i,
      /\bmany quick guides admit\b/i,
      /(?:搜|搜索)\s*<strong>[\s\S]*?<\/strong>\s*的人(?:，|,)\s*通常/,
      /(?:英文里)?(?:玩家|很多人|大多数玩家)\s*(?:常搜|搜索|实际搜索)/,
      /这个搜索词看起来/,
      /如果你(?:搜索|在查|在搜)\s*<strong>[\s\S]*?<\/strong>(?:\s*或[^，。]*?)?(?:，|,)\s*(?:你\s*)?(?:通常不是|大概率(?:不是|是)|真正需要的是|最容易踩坑的地方不是)/,
      /<th>如果你搜的是/,
    ];
    const authorFacingContentPlanningPhrases = [
      'This ranking is aimed at general D&amp;D play',
      'Before jumping into the full ranking, it helps to explain the logic.',
      'If you look at almost any serious',
      'What This Ranking Gets Right About D&amp;D Classes',
      'A good ranking should do more than name the strongest classes.',
      'That makes this ranking more useful than a pure theorycraft tier list',
      '很多关于 <strong>DND 职业</strong> 的文章只会告诉你机制差异',
      '大多数职业榜单不是太复杂',
      '所以这里采用一套更实用的判断标准。',
      '这份排序面向的是一般 D&amp;D 战役体验',
      '在进入完整排名之前，先把判断逻辑讲清楚会更有帮助。',
      '很多排名文章的问题在于',
      '一份好的职业排名，不应该只告诉你谁伤害高',
      '这也是职业排名最容易误导人的地方',
      '这也是为什么这份排名比纯理论榜单更有用',
      '这里先把速查结论摆在前面，再展开讲机制和构筑。',
      '后面的内容再分别解决三个问题：',
      '很多构筑文章会把这条讲得很玄',
      '这里先把这些问题讲清楚，再拆规则。',
      '前面先放速查表，方便你快速判断能不能带上桌。',
      '先给你死灵法术速查表，再讲 Animate Dead',
      '可用名字放前面，后面再讲怎么改成适合自己战役的版本。',
      '指南先回答一个实际问题',
      '这里先解决桌面问题：',
    ];

    for (const locale of ['en', 'zh'] as const) {
      for (const post of getBlogPosts(locale)) {
        for (const pattern of thirdPersonSearchIntentPatterns) {
          expect(post.bodyHtml).not.toMatch(pattern);
        }
        for (const phrase of authorFacingContentPlanningPhrases) {
          expect(post.bodyHtml).not.toContain(phrase);
        }
      }
    }
  });
});

describe('dnd races blog post', () => {
  test('publishes a bilingual 2024-first species guide with 2014 boundaries', () => {
    const englishPost = getBlogPost('en', DND_RACES_SLUG);
    const chinesePost = getBlogPost('zh', DND_RACES_SLUG);

    expect(englishPost?.updatedAt).toBe('2026-08-10');
    expect(englishPost?.bodyHtml).toContain('2024 Player\'s Handbook');
    expect(englishPost?.bodyHtml).toContain('Aasimar');
    expect(englishPost?.bodyHtml).toContain('Half-Elf');
    expect(englishPost?.bodyHtml).toContain('Half-Orc');
    expect(englishPost?.bodyHtml).toContain('data-video-id="opYeED0W8Z8"');
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).not.toContain('role="button" tabindex="0"');
    expect(englishPost?.bodyHtml?.match(/<button/g) ?? []).toHaveLength(1);
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-races-guide.webp');
    expect(englishPost?.faqItems).toHaveLength(5);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.updatedAt).toBe('2026-08-10');
    expect(chinesePost?.bodyHtml).toContain('2024 版《玩家手册》');
    expect(chinesePost?.bodyHtml).toContain('Aasimar');
    expect(chinesePost?.bodyHtml).toContain('Half-Elf');
    expect(chinesePost?.bodyHtml).toContain('Half-Orc');
    expect(chinesePost?.bodyHtml).toContain('data-video-id="opYeED0W8Z8"');
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.bodyHtml).not.toContain('role="button" tabindex="0"');
    expect(chinesePost?.bodyHtml?.match(/<button/g) ?? []).toHaveLength(1);
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-races-guide.webp');
    expect(chinesePost?.faqItems).toHaveLength(5);
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);
  });

  test('builds dnd races metadata, schema, asset, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_RACES_SLUG)).toBe('/blog/dnd-races');
    expect(getBlogPostPath('zh', DND_RACES_SLUG)).toBe('/zh/blog/dnd-races');
    expect(createBlogPostMetadata('en', DND_RACES_SLUG).alternates?.canonical).toBe(
      '/blog/dnd-races',
    );
    expect(createBlogPostMetadata('zh', DND_RACES_SLUG).alternates?.canonical).toBe(
      '/zh/blog/dnd-races',
    );
    expect(buildBlogPostStructuredData('en', DND_RACES_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-10',
      dateModified: '2026-08-10',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-races',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-races-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_RACES_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-10',
      dateModified: '2026-08-10',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-races',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-races-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_RACES_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({
          name: "How many races are in the 2024 Player's Handbook?",
        }),
      ]),
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_RACES_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({
          name: '2024 版《玩家手册》有多少个种族？',
        }),
      ]),
    });
    expect(existsSync('public/blog/covers/en/dnd-races-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-races');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-races');
  });
});

describe('dnd shatter 5e blog post', () => {
  test('publishes a bilingual blast-placement guide at the top of the blog', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);
    expect(getBlogPostsForPage('en', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);

    const englishPost = getBlogPost('en', DND_SHATTER_5E_SLUG);
    const chinesePost = getBlogPost('zh', DND_SHATTER_5E_SLUG);

    expect(englishPost?.title).toBe(
      'Shatter DnD 5e: Place the Blast, Resolve the Save, Break Objects',
    );
    expect(englishPost?.updatedAt).toBe('2026-08-08');
    expect(englishPost?.bodyHtml).toContain('Place the center before anyone rolls');
    expect(englishPost?.bodyHtml).toContain('Resolve one Shatter cast in five steps');
    expect(englishPost?.bodyHtml).toContain('a Construct has Disadvantage on the save');
    expect(englishPost?.bodyHtml).toContain('made of inorganic material');
    expect(englishPost?.bodyHtml).toContain('Total Cover can block part of an area');
    expect(englishPost?.bodyHtml).toContain('the origin appears on the near side');
    expect(englishPost?.bodyHtml).toContain('Allies do not receive automatic protection');
    expect(englishPost?.bodyHtml).toContain('deafness does not remove the damage');
    expect(englishPost?.bodyHtml).toContain('The core 2024 spell lists Bard, Sorcerer, and Wizard');
    expect(englishPost?.bodyHtml).toContain('The 2014 Basic Rules also put Shatter on the Warlock list');
    expect(englishPost?.bodyHtml).toContain(
      'A nonmagical object that is not worn or carried also takes the damage',
    );
    expect(englishPost?.bodyHtml).toContain('Roll the damage pool once for the cast');
    expect(englishPost?.bodyHtml).toContain('Round halved damage down');
    expect(englishPost?.bodyHtml).toContain('data-video-id="GfjIe2xD1j0"');
    expect(englishPost?.bodyHtml).toContain(
      'src="/blog/inline/dnd-shatter-5e/shatter-video-placeholder.webp"',
    );
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).toContain(
      'src="/blog/inline/dnd-shatter-5e/shatter-blast-radius.webp"',
    );
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('decoding="async"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).not.toContain('<table');
    expect(englishPost?.faqItems).toHaveLength(5);
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-shatter-5e-guide.webp');
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('Shatter DnD 5e：确定爆点、结算豁免与破坏物体');
    expect(chinesePost?.updatedAt).toBe('2026-08-08');
    expect(chinesePost?.bodyHtml).toContain('先确定爆点，再掷任何骰子');
    expect(chinesePost?.bodyHtml).toContain('按五个步骤结算一次 Shatter');
    expect(chinesePost?.bodyHtml).toContain('构装体（Construct）的豁免具有劣势');
    expect(chinesePost?.bodyHtml).toContain('由石头、水晶或金属等无机材料构成');
    expect(chinesePost?.bodyHtml).toContain('完全掩护（Total Cover）能挡住区域的一部分');
    expect(chinesePost?.bodyHtml).toContain('源点会出现在障碍物靠近你的一侧');
    expect(chinesePost?.bodyHtml).toContain('盟友不会自动获得保护');
    expect(chinesePost?.bodyHtml).toContain('耳聋不会免除伤害');
    expect(chinesePost?.bodyHtml).toContain('2024 核心法术表列出吟游诗人、术士和法师');
    expect(chinesePost?.bodyHtml).toContain('2014 基础规则还把 Shatter 放在邪术师法术表里');
    expect(chinesePost?.bodyHtml).toContain('没有被穿戴或携带的非魔法物体也会受到伤害');
    expect(chinesePost?.bodyHtml).toContain('整次施法只掷一组伤害');
    expect(chinesePost?.bodyHtml).toContain('减半伤害向下取整');
    expect(chinesePost?.bodyHtml).toContain('data-video-id="GfjIe2xD1j0"');
    expect(chinesePost?.bodyHtml).toContain(
      'src="/blog/inline/dnd-shatter-5e/shatter-video-placeholder.webp"',
    );
    expect(chinesePost?.bodyHtml).toContain('fetchpriority="low"');
    expect(chinesePost?.bodyHtml).toContain(
      'src="/blog/inline/dnd-shatter-5e/shatter-blast-radius.webp"',
    );
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).toContain('decoding="async"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.bodyHtml).not.toContain('<table');
    expect(chinesePost?.faqItems).toHaveLength(5);
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-shatter-5e-guide.webp');
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }
  });

  test('builds Shatter metadata, schema, assets, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_SHATTER_5E_SLUG)).toBe('/blog/dnd-shatter-5e');
    expect(getBlogPostPath('zh', DND_SHATTER_5E_SLUG)).toBe('/zh/blog/dnd-shatter-5e');
    expect(createBlogPostMetadata('en', DND_SHATTER_5E_SLUG).alternates?.canonical).toBe(
      '/blog/dnd-shatter-5e',
    );
    expect(createBlogPostMetadata('zh', DND_SHATTER_5E_SLUG).alternates?.canonical).toBe(
      '/zh/blog/dnd-shatter-5e',
    );
    expect(buildBlogPostStructuredData('en', DND_SHATTER_5E_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-08',
      dateModified: '2026-08-08',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-shatter-5e',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-shatter-5e-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_SHATTER_5E_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-08',
      dateModified: '2026-08-08',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-shatter-5e',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-shatter-5e-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_SHATTER_5E_SLUG)).toMatchObject({
      '@type': 'FAQPage',
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_SHATTER_5E_SLUG)).toMatchObject({
      '@type': 'FAQPage',
    });
    expect(existsSync('public/blog/covers/en/dnd-shatter-5e-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-shatter-5e/shatter-blast-radius.webp')).toBe(true);
    expect(
      existsSync('public/blog/inline/dnd-shatter-5e/shatter-video-placeholder.webp'),
    ).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-shatter-5e');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-shatter-5e');
  });
});

describe('dnd gnome names blog post', () => {
  test('publishes a bilingual gnome naming workshop with a lazy video', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);
    expect(getBlogPostsForPage('en', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);

    const englishPost = getBlogPost('en', DND_GNOME_NAMES_SLUG);
    const chinesePost = getBlogPost('zh', DND_GNOME_NAMES_SLUG);

    expect(englishPost?.title).toBe('DND Gnome Names: First Names, Clans, Nicknames, and Character Hooks');
    expect(englishPost?.updatedAt).toBe('2026-08-06');
    expect(englishPost?.bodyHtml).toContain('Start with the name your table will actually say');
    expect(englishPost?.bodyHtml).toContain('Build a three-part gnome name');
    expect(englishPost?.bodyHtml).toContain('Turn one name into a playable character');
    expect(englishPost?.bodyHtml).toContain('Keep a whole gnome cast easy to hear');
    expect(englishPost?.bodyHtml).toContain('data-video-id="HRX8c3IihL0"');
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.faqItems).toHaveLength(5);
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-gnome-names-guide.webp');
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('DND 侏儒名字：名字、氏族名、昵称与角色钩子');
    expect(chinesePost?.updatedAt).toBe('2026-08-06');
    expect(chinesePost?.bodyHtml).toContain('先选桌上真正会喊的名字');
    expect(chinesePost?.bodyHtml).toContain('组合一个三段式侏儒名字');
    expect(chinesePost?.bodyHtml).toContain('把一个名字变成能直接上桌的角色');
    expect(chinesePost?.bodyHtml).toContain('让整组侏儒名字听起来不混');
    expect(chinesePost?.bodyHtml).toContain('data-video-id="HRX8c3IihL0"');
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toHaveLength(5);
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-gnome-names-guide.webp');
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }
  });

  test('builds gnome names metadata, schema, assets, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_GNOME_NAMES_SLUG)).toBe('/blog/dnd-gnome-names');
    expect(getBlogPostPath('zh', DND_GNOME_NAMES_SLUG)).toBe('/zh/blog/dnd-gnome-names');
    expect(createBlogPostMetadata('en', DND_GNOME_NAMES_SLUG).alternates?.canonical).toBe(
      '/blog/dnd-gnome-names',
    );
    expect(createBlogPostMetadata('zh', DND_GNOME_NAMES_SLUG).alternates?.canonical).toBe(
      '/zh/blog/dnd-gnome-names',
    );
    expect(buildBlogPostStructuredData('en', DND_GNOME_NAMES_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-06',
      dateModified: '2026-08-06',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-gnome-names',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-gnome-names-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_GNOME_NAMES_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-06',
      dateModified: '2026-08-06',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-gnome-names',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-gnome-names-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_GNOME_NAMES_SLUG)).toMatchObject({
      '@type': 'FAQPage',
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_GNOME_NAMES_SLUG)).toMatchObject({
      '@type': 'FAQPage',
    });
    expect(existsSync('public/blog/covers/en/dnd-gnome-names-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-gnome-names/gnome-race-video-placeholder.webp')).toBe(
      true,
    );

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-gnome-names');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-gnome-names');
  });
});

describe('dnd maul blog post', () => {
  test('publishes a bilingual maul turn guide at the top of the blog', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);
    expect(getBlogPostsForPage('en', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);

    const englishPost = getBlogPost('en', DND_MAUL_SLUG);
    const chinesePost = getBlogPost('zh', DND_MAUL_SLUG);

    expect(englishPost?.title).toBe('DND Maul 5e: Heavy, Topple, and a Clean Turn Plan');
    expect(englishPost?.updatedAt).toBe('2026-08-05');
    expect(englishPost?.bodyHtml).toContain('Pass three gates before you equip a maul');
    expect(englishPost?.bodyHtml).toContain('Resolve one maul hit in one clean sequence');
    expect(englishPost?.bodyHtml).toContain('Write a five-line maul turn card');
    expect(englishPost?.bodyHtml).toContain('Watch Topple inside the 2024 Weapon Mastery system');
    expect(englishPost?.bodyHtml).toContain('data-video-id="z1W7G1MMPBI"');
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).not.toContain('<table');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.faqItems).toBeUndefined();
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-maul-guide.webp');

    expect(chinesePost?.title).toBe('DND 巨锤（Maul）5e：Heavy、Topple 与清楚回合流程');
    expect(chinesePost?.updatedAt).toBe('2026-08-05');
    expect(chinesePost?.bodyHtml).toContain('装备巨锤前先过三道门槛');
    expect(chinesePost?.bodyHtml).toContain('按固定顺序结算一次巨锤命中');
    expect(chinesePost?.bodyHtml).toContain('写一张五行巨锤回合卡');
    expect(chinesePost?.bodyHtml).toContain('在 2024 Weapon Mastery 体系里看 Topple');
    expect(chinesePost?.bodyHtml).toContain('data-video-id="z1W7G1MMPBI"');
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<table');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toBeUndefined();
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-maul-guide.webp');
  });

  test('builds maul metadata, article schema, assets, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_MAUL_SLUG)).toBe('/blog/dnd-maul');
    expect(getBlogPostPath('zh', DND_MAUL_SLUG)).toBe('/zh/blog/dnd-maul');
    expect(createBlogPostMetadata('en', DND_MAUL_SLUG).alternates?.canonical).toBe('/blog/dnd-maul');
    expect(createBlogPostMetadata('zh', DND_MAUL_SLUG).alternates?.canonical).toBe('/zh/blog/dnd-maul');
    expect(buildBlogPostStructuredData('en', DND_MAUL_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-05',
      dateModified: '2026-08-05',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-maul',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-maul-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_MAUL_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-05',
      dateModified: '2026-08-05',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-maul',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-maul-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_MAUL_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_MAUL_SLUG)).toBeNull();
    expect(existsSync('public/blog/covers/en/dnd-maul-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-maul');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-maul');
  });
});

describe('dnd quarterstaff blog post', () => {
  test('publishes a bilingual hand-choice guide at the top of the blog', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 4)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 4),
    );
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 4)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 4),
    );

    const englishPost = getBlogPost('en', DND_QUARTERSTAFF_SLUG);
    const chinesePost = getBlogPost('zh', DND_QUARTERSTAFF_SLUG);

    expect(englishPost?.title).toBe('DND Quarterstaff 5e: Hand Choices, Topple, and Builds');
    expect(englishPost?.updatedAt).toBe('2026-08-03');
    expect(englishPost?.bodyHtml).toContain('Decide what the other hand is doing');
    expect(englishPost?.bodyHtml).toContain('Let Topple set the party order');
    expect(englishPost?.bodyHtml).toContain('Run three different quarterstaff turns');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.faqItems).toBeUndefined();
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-quarterstaff-guide.webp');

    expect(chinesePost?.title).toBe('DND 长棍（Quarterstaff）5e：持握选择、Topple 与构筑');
    expect(chinesePost?.updatedAt).toBe('2026-08-03');
    expect(chinesePost?.bodyHtml).toContain('先决定另一只手要做什么');
    expect(chinesePost?.bodyHtml).toContain('让 Topple 决定队伍出手顺序');
    expect(chinesePost?.bodyHtml).toContain('跑三种不同的长棍回合');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toBeUndefined();
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-quarterstaff-guide.webp');
  });

  test('builds quarterstaff metadata, article schema, assets, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_QUARTERSTAFF_SLUG)).toBe('/blog/dnd-quarterstaff');
    expect(getBlogPostPath('zh', DND_QUARTERSTAFF_SLUG)).toBe('/zh/blog/dnd-quarterstaff');
    expect(createBlogPostMetadata('en', DND_QUARTERSTAFF_SLUG).alternates?.canonical).toBe('/blog/dnd-quarterstaff');
    expect(createBlogPostMetadata('zh', DND_QUARTERSTAFF_SLUG).alternates?.canonical).toBe('/zh/blog/dnd-quarterstaff');
    expect(buildBlogPostStructuredData('en', DND_QUARTERSTAFF_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-03',
      dateModified: '2026-08-03',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-quarterstaff',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-quarterstaff-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_QUARTERSTAFF_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-03',
      dateModified: '2026-08-03',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-quarterstaff',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-quarterstaff-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_QUARTERSTAFF_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_QUARTERSTAFF_SLUG)).toBeNull();
    expect(existsSync('public/blog/covers/en/dnd-quarterstaff-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-quarterstaff');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-quarterstaff');
  });
});

describe('spectator dnd blog post', () => {
  test('publishes a bilingual spectator guardian guide at the top of the blog', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );

    const englishPost = getBlogPost('en', SPECTATOR_DND_SLUG);
    const chinesePost = getBlogPost('zh', SPECTATOR_DND_SLUG);

    expect(englishPost?.title).toBe('Spectator DnD: Guardian Rules, Eye Rays, and VTT Tokens');
    expect(englishPost?.updatedAt).toBe('2026-08-02');
    expect(englishPost?.bodyHtml).toContain('Choose the rules version before the first ray');
    expect(englishPost?.bodyHtml).toContain('Make Spell Reflection visible before it hurts someone');
    expect(englishPost?.bodyHtml).toContain('Hand the DM a five-line spectator note');
    expect(englishPost?.bodyHtml).toContain('2014');
    expect(englishPost?.bodyHtml).toContain('2024');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.faqItems).toBeUndefined();
    expect(englishPost?.coverImage).toBe('/blog/covers/en/spectator-dnd-guide.webp');

    expect(chinesePost?.title).toBe('Spectator DND：守卫命令、Eye Rays 与 VTT Token');
    expect(chinesePost?.updatedAt).toBe('2026-08-02');
    expect(chinesePost?.bodyHtml).toContain('第一道眼线前，先选规则版本');
    expect(chinesePost?.bodyHtml).toContain('让 Spell Reflection 在伤人前先被看见');
    expect(chinesePost?.bodyHtml).toContain('交给 DM 一张五行 spectator 说明');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toBeUndefined();
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/spectator-dnd-guide.webp');
  });

  test('builds spectator metadata, article schema, assets, and llms discovery', () => {
    expect(getBlogPostPath('en', SPECTATOR_DND_SLUG)).toBe('/blog/spectator-dnd');
    expect(getBlogPostPath('zh', SPECTATOR_DND_SLUG)).toBe('/zh/blog/spectator-dnd');
    expect(createBlogPostMetadata('en', SPECTATOR_DND_SLUG).alternates?.canonical).toBe('/blog/spectator-dnd');
    expect(createBlogPostMetadata('zh', SPECTATOR_DND_SLUG).alternates?.canonical).toBe('/zh/blog/spectator-dnd');
    expect(buildBlogPostStructuredData('en', SPECTATOR_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-02',
      dateModified: '2026-08-02',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/spectator-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/spectator-dnd-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', SPECTATOR_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-02',
      dateModified: '2026-08-02',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/spectator-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/spectator-dnd-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', SPECTATOR_DND_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', SPECTATOR_DND_SLUG)).toBeNull();
    expect(existsSync('public/blog/covers/en/spectator-dnd-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/spectator-dnd');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/spectator-dnd');
  });
});

describe('dnd dagger blog post', () => {
  test('keeps the bilingual dagger guide near the newest monster and spell guides', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 4)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 4),
    );
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 4)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 4),
    );

    const englishPost = getBlogPost('en', DND_DAGGER_SLUG);
    const chinesePost = getBlogPost('zh', DND_DAGGER_SLUG);

    expect(englishPost?.title).toBe('DND Dagger 5e: Stats, Rules, and Best Uses');
    expect(englishPost?.updatedAt).toBe('2026-07-28');
    expect(englishPost?.bodyHtml).toContain('Treat a dagger as a flexible backup tool');
    expect(englishPost?.bodyHtml).toContain('Judge a dagger build by the routes it opens');
    expect(englishPost?.bodyHtml).toContain('For a typical Rogue, use a rapier or shortsword');
    expect(englishPost?.bodyHtml).toContain('Place the dagger near the face, shoulder, or leading hand');
    expect(englishPost?.bodyHtml).not.toMatch(/My short table opinion|When I test|My preference|When I make/);
    expect(englishPost?.bodyHtml).toContain('src="/blog/inline/dnd-dagger/dagger-loadout-table-v2.webp"');
    expect(englishPost?.bodyHtml).toContain('src="/blog/inline/dnd-dagger/dagger-throwing-range-v2.webp"');
    expect(englishPost?.bodyHtml).toContain('src="/blog/inline/dnd-dagger/dagger-video-placeholder-v2.webp"');
    expect(englishPost?.bodyHtml).toContain('data-video-id="RCnwjLK_ZuQ"');
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-dagger-guide-v2.webp');
    expect(englishPost?.faqItems?.length).toBe(5);

    expect(chinesePost?.title).toBe('dnd dagger 指南：5e 数据、用法、Nick 与 FAQ');
    expect(chinesePost?.updatedAt).toBe('2026-07-28');
    expect(chinesePost?.bodyHtml).toContain('把 dagger 当成灵活备用工具');
    expect(chinesePost?.bodyHtml).toContain('判断 dagger 构筑时，不要只问');
    expect(chinesePost?.bodyHtml).toContain('典型 Rogue 可以在正常战斗里用 rapier 或 shortsword');
    expect(chinesePost?.bodyHtml).toContain('把刀放在脸、肩膀或主手附近');
    expect(chinesePost?.bodyHtml).not.toMatch(/我的短结论|我实际看|我的习惯|我做/);
    expect(chinesePost?.bodyHtml).toContain('src="/blog/inline/dnd-dagger/dagger-loadout-table-v2.webp"');
    expect(chinesePost?.bodyHtml).toContain('src="/blog/inline/dnd-dagger/dagger-throwing-range-v2.webp"');
    expect(chinesePost?.bodyHtml).toContain('src="/blog/inline/dnd-dagger/dagger-video-placeholder-v2.webp"');
    expect(chinesePost?.bodyHtml).toContain('data-video-id="RCnwjLK_ZuQ"');
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).toContain('fetchpriority="low"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-dagger-guide-v2.webp');
    expect(chinesePost?.faqItems?.length).toBe(5);
  });

  test('builds dagger metadata, structured data, assets, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_DAGGER_SLUG)).toBe('/blog/dnd-dagger');
    expect(getBlogPostPath('zh', DND_DAGGER_SLUG)).toBe('/zh/blog/dnd-dagger');
    expect(createBlogPostMetadata('en', DND_DAGGER_SLUG).alternates?.canonical).toBe('/blog/dnd-dagger');
    expect(createBlogPostMetadata('zh', DND_DAGGER_SLUG).alternates?.canonical).toBe('/zh/blog/dnd-dagger');
    expect(buildBlogPostStructuredData('en', DND_DAGGER_SLUG)).toMatchObject({
      '@type': 'Article',
      dateModified: '2026-07-28',
      datePublished: '2026-05-09',
      url: 'https://www.tokenmaker.one/blog/dnd-dagger',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-dagger-guide-v2.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_DAGGER_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'en-US',
    });
    expect(existsSync('public/blog/covers/en/dnd-dagger-guide-v2.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-dagger/dagger-loadout-table-v2.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-dagger/dagger-throwing-range-v2.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-dagger/dagger-video-placeholder-v2.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-dagger');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-dagger');
  });
});

describe('firebolt dnd 5e blog post', () => {
  test('publishes a bilingual Fire Bolt tactical guide near the top of the blog', () => {
    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 4)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 4),
    );
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 4)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 4),
    );

    const englishPost = getBlogPost('en', FIREBOLT_DND_5E_SLUG);
    const chinesePost = getBlogPost('zh', FIREBOLT_DND_5E_SLUG);

    expect(englishPost?.title).toContain('Fire Bolt');
    expect(englishPost?.bodyHtml).toContain('Read the target before you roll');
    expect(englishPost?.bodyHtml).toContain('Treat the fire as a map problem');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.faqItems).toBeUndefined();
    expect(englishPost?.coverImage).toBe('/blog/covers/en/firebolt-dnd-5e-guide.webp');

    expect(chinesePost?.title).toContain('Fire Bolt');
    expect(chinesePost?.bodyHtml).toContain('掷骰前，先看你要打的目标');
    expect(chinesePost?.bodyHtml).toContain('把火焰当成地图问题处理');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toBeUndefined();
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/firebolt-dnd-5e-guide.webp');
  });

  test('builds Fire Bolt metadata, assets, and llms discovery without FAQ schema', () => {
    expect(getBlogPostPath('en', FIREBOLT_DND_5E_SLUG)).toBe('/blog/firebolt-dnd-5e');
    expect(getBlogPostPath('zh', FIREBOLT_DND_5E_SLUG)).toBe('/zh/blog/firebolt-dnd-5e');
    expect(createBlogPostMetadata('en', FIREBOLT_DND_5E_SLUG).alternates?.canonical).toBe('/blog/firebolt-dnd-5e');
    expect(createBlogPostMetadata('zh', FIREBOLT_DND_5E_SLUG).alternates?.canonical).toBe('/zh/blog/firebolt-dnd-5e');
    expect(buildBlogPostStructuredData('en', FIREBOLT_DND_5E_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-07-29',
      dateModified: '2026-07-29',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/firebolt-dnd-5e',
      image: ['https://www.tokenmaker.one/blog/covers/en/firebolt-dnd-5e-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', FIREBOLT_DND_5E_SLUG)).toBeNull();
    expect(buildBlogPostStructuredData('zh', FIREBOLT_DND_5E_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-07-29',
      dateModified: '2026-07-29',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/firebolt-dnd-5e',
      image: ['https://www.tokenmaker.one/blog/covers/en/firebolt-dnd-5e-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('zh', FIREBOLT_DND_5E_SLUG)).toBeNull();
    expect(existsSync('public/blog/covers/en/firebolt-dnd-5e-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/firebolt-dnd-5e');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/firebolt-dnd-5e');
  });
});

describe('dwelf dnd blog post', () => {
  test('publishes a bilingual dwarf-elf character guide near the top of the blog', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );
    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );

    const englishPost = getBlogPost('en', DWELF_DND_SLUG);
    const chinesePost = getBlogPost('zh', DWELF_DND_SLUG);

    expect(englishPost?.title).toContain('Dwelf DnD');
    expect(englishPost?.bodyHtml).toContain('Choose one rules chassis and keep its limits');
    expect(englishPost?.bodyHtml).toContain('Hand your DM a four-line dwelf note');
    expect(englishPost?.bodyHtml).toContain('one skill from Insight, Perception, or Survival');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.faqItems).toBeUndefined();
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dwelf-dnd-guide.webp');

    expect(chinesePost?.title).toContain('Dwelf DND');
    expect(chinesePost?.bodyHtml).toContain('先选一个规则底盘，再守住它的边界');
    expect(chinesePost?.bodyHtml).toContain('交给 DM 一张四行 dwelf 说明');
    expect(chinesePost?.bodyHtml).toContain('从 Insight、Perception、Survival 中选一项技能');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toBeUndefined();
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dwelf-dnd-guide.webp');
  });

  test('builds localized metadata, sitemap discovery, and reader-facing copy for the dwelf guide', () => {
    expect(getBlogPostPath('en', DWELF_DND_SLUG)).toBe('/blog/dwelf-dnd');
    expect(getBlogPostPath('zh', DWELF_DND_SLUG)).toBe('/zh/blog/dwelf-dnd');
    expect(createBlogPostMetadata('en', DWELF_DND_SLUG).alternates?.canonical).toBe('/blog/dwelf-dnd');
    expect(createBlogPostMetadata('zh', DWELF_DND_SLUG).alternates?.canonical).toBe('/zh/blog/dwelf-dnd');
    expect(buildBlogPostStructuredData('en', DWELF_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      url: 'https://www.tokenmaker.one/blog/dwelf-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/dwelf-dnd-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DWELF_DND_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DWELF_DND_SLUG)).toBeNull();
    expect(existsSync('public/blog/covers/en/dwelf-dnd-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dwelf-dnd');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dwelf-dnd');

    for (const bodyHtml of [englishPostBody(), chinesePostBody()]) {
      expect(bodyHtml).not.toMatch(/search intent|keyword strategy|this article will|本文将|搜索这个词的人/iu);
    }
  });
});

function englishPostBody() {
  return getBlogPost('en', DWELF_DND_SLUG)?.bodyHtml;
}

function chinesePostBody() {
  return getBlogPost('zh', DWELF_DND_SLUG)?.bodyHtml;
}

describe('dnd flumph blog post', () => {
  test('publishes a bilingual flumph guide ahead of the recent July articles', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);

    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug)).toEqual(FIRST_BLOG_PAGE_SLUGS);

    const englishPost = getBlogPost('en', DND_FLUMPH_SLUG);
    const chinesePost = getBlogPost('zh', DND_FLUMPH_SLUG);

    expect(englishPost?.title).toContain('Flumph');
    expect(englishPost?.bodyHtml).toContain('Advanced Telepathy');
    expect(englishPost?.bodyHtml).toContain('Let the flumph solve a problem the party cannot hear');
    expect(englishPost?.bodyHtml).toContain("Choose the flumph's job before initiative starts");
    expect(englishPost?.bodyHtml).toContain('Make the flumph readable on a VTT token');
    expect(englishPost?.bodyHtml).toContain('src="/blog/inline/dnd-flumph/flumph-vtt-clue-board.webp"');
    expect(englishPost?.bodyHtml).toContain('width="1536"');
    expect(englishPost?.bodyHtml).toContain('height="1024"');
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('decoding="async"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-flumph-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(5);

    expect(chinesePost?.title).toContain('Flumph');
    expect(chinesePost?.bodyHtml).toContain('Advanced Telepathy');
    expect(chinesePost?.bodyHtml).toContain('先让 flumph 解决队伍听不见的问题');
    expect(chinesePost?.bodyHtml).toContain('先决定 flumph 在这场戏里做什么');
    expect(chinesePost?.bodyHtml).toContain('让 flumph 在 VTT Token 上一眼可认');
    expect(chinesePost?.bodyHtml).toContain('src="/blog/inline/dnd-flumph/flumph-vtt-clue-board.webp"');
    expect(chinesePost?.bodyHtml).toContain('width="1536"');
    expect(chinesePost?.bodyHtml).toContain('height="1024"');
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).toContain('decoding="async"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-flumph-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(5);
  });

  test('builds localized metadata and article schema for the flumph guide', () => {
    expect(getBlogPostPath('en', DND_FLUMPH_SLUG)).toBe('/blog/dnd-flumph');
    expect(getBlogPostPath('zh', DND_FLUMPH_SLUG)).toBe('/zh/blog/dnd-flumph');

    const englishMetadata = createBlogPostMetadata('en', DND_FLUMPH_SLUG);
    const chineseMetadata = createBlogPostMetadata('zh', DND_FLUMPH_SLUG);

    expect(englishMetadata.title).toBe('DnD Flumph Guide: Ally Clues, Telepathy, and VTT Tokens');
    expect(englishMetadata.alternates?.canonical).toBe('/blog/dnd-flumph');
    expect(englishMetadata.alternates?.languages).toMatchObject({
      'x-default': '/blog/dnd-flumph',
      'en-US': '/blog/dnd-flumph',
      'zh-CN': '/zh/blog/dnd-flumph',
    });
    expect(chineseMetadata.title).toBe('DND Flumph 指南：盟友线索、心灵感应与 VTT Token');
    expect(chineseMetadata.alternates?.canonical).toBe('/zh/blog/dnd-flumph');
    expect(chineseMetadata.alternates?.languages).toMatchObject({
      'x-default': '/blog/dnd-flumph',
      'en-US': '/blog/dnd-flumph',
      'zh-CN': '/zh/blog/dnd-flumph',
    });
    expect(chineseMetadata.description).toContain('Flumph');

    expect(buildBlogPostStructuredData('en', DND_FLUMPH_SLUG)).toMatchObject({
      '@type': 'Article',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-flumph',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-flumph-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_FLUMPH_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });
  });

  test('uses a WebP cover and lists both localized flumph URLs in llms.txt', () => {
    expect(existsSync('public/blog/covers/en/dnd-flumph-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-flumph');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-flumph');
  });
});

describe('dnd 5e armorer blog post', () => {
  test('publishes a bilingual 2014-first guide with a separate 2025 branch', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );

    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );

    const englishPost = getBlogPost('en', DND_5E_ARMORER_SLUG);
    const chinesePost = getBlogPost('zh', DND_5E_ARMORER_SLUG);

    expect(englishPost?.title).toContain('DnD 5e Armorer');
    expect(englishPost?.bodyHtml).toContain("2014 Tasha's Cauldron of Everything");
    expect(englishPost?.bodyHtml).toContain('Dreadnaught');
    expect(englishPost?.bodyHtml).toContain('Pick the party job before you choose the suit');
    expect(englishPost?.bodyHtml).not.toContain('Quick answer');
    expect(englishPost?.bodyHtml).not.toContain('<table');
    expect(englishPost?.bodyHtml).not.toContain('companion video');
    expect(englishPost?.faqItems).toBeUndefined();
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-5e-armorer-guide.webp');

    expect(chinesePost?.title).toContain('DND 5e 装甲师');
    expect(chinesePost?.bodyHtml).toContain('2014《塔莎的万事坩埚》');
    expect(chinesePost?.bodyHtml).toContain('Dreadnaught');
    expect(chinesePost?.bodyHtml).toContain('先看队伍缺什么，再选装甲模型');
    expect(chinesePost?.bodyHtml).not.toContain('快速结论');
    expect(chinesePost?.bodyHtml).not.toContain('<table');
    expect(chinesePost?.bodyHtml).not.toContain('配套视频');
    expect(chinesePost?.faqItems).toBeUndefined();
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-5e-armorer-guide.webp');
  });

  test('builds localized metadata and an article schema for the Armorer guide', () => {
    expect(getBlogPostPath('en', DND_5E_ARMORER_SLUG)).toBe('/blog/dnd-5e-armorer');
    expect(getBlogPostPath('zh', DND_5E_ARMORER_SLUG)).toBe('/zh/blog/dnd-5e-armorer');

    const englishMetadata = createBlogPostMetadata('en', DND_5E_ARMORER_SLUG);
    const chineseMetadata = createBlogPostMetadata('zh', DND_5E_ARMORER_SLUG);

    expect(englishMetadata.title).toBe('DnD 5e Armorer: Build Roles, Armor Models, and VTT Tokens');
    expect(englishMetadata.alternates?.canonical).toBe('/blog/dnd-5e-armorer');
    expect(chineseMetadata.title).toBe('DND 5e 装甲师：构筑定位、装甲模型与 VTT Token');
    expect(chineseMetadata.description).toContain('装甲师');

    expect(buildBlogPostStructuredData('en', DND_5E_ARMORER_SLUG)).toMatchObject({
      '@type': 'Article',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-5e-armorer',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-5e-armorer-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_5E_ARMORER_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_5E_ARMORER_SLUG)).toBeNull();
  });

  test('uses a WebP cover and lists both localized Armorer URLs in llms.txt', () => {
    expect(existsSync('public/blog/covers/en/dnd-5e-armorer-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-5e-armorer');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-5e-armorer');
  });
});

describe('dnd death knight blog post', () => {
  test('uses the 2025 encounter workflow with a separate 2014 comparison in both locales', () => {
    const englishPost = getBlogPost('en', DND_DEATH_KNIGHT_SLUG);
    const chinesePost = getBlogPost('zh', DND_DEATH_KNIGHT_SLUG);

    expect(englishPost?.title).toContain('Death Knight');
    expect(englishPost?.bodyHtml).toContain('2025 Monster Manual');
    expect(englishPost?.bodyHtml).toContain('Build the battlefield before initiative');
    expect(englishPost?.bodyHtml).toContain('Choose a scenario by the party\'s job');
    expect(englishPost?.bodyHtml).toContain('The outer-gate warning');
    expect(englishPost?.bodyHtml).toContain('The reliquary hold');
    expect(englishPost?.bodyHtml).toContain('The last march');
    expect(englishPost?.bodyHtml).toContain('For rules checks, use the 2025 Monster Manual stat block');
    expect(englishPost?.bodyHtml).toContain('What changes at a 2014 table');
    expect(englishPost?.bodyHtml).toContain('roll20.net/compendium/dnd5e/Monsters%3ADeath%20Knight');
    expect(englishPost?.bodyHtml).not.toContain('Use Marshal Undead');
    expect(englishPost?.bodyHtml).not.toContain('Quick answer');
    expect(englishPost?.bodyHtml).not.toContain('<table');
    expect(englishPost?.bodyHtml).not.toContain('companion video');
    expect(englishPost?.faqItems).toBeUndefined();
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-death-knight-guide.webp');

    expect(chinesePost?.title).toContain('死亡骑士');
    expect(chinesePost?.bodyHtml).toContain('2025《怪物图鉴》');
    expect(chinesePost?.bodyHtml).toContain('先布置战场，再掷先攻');
    expect(chinesePost?.bodyHtml).toContain('按队伍面对的任务选遭遇');
    expect(chinesePost?.bodyHtml).toContain('外门警报');
    expect(chinesePost?.bodyHtml).toContain('圣物库固守');
    expect(chinesePost?.bodyHtml).toContain('最后的行军');
    expect(chinesePost?.bodyHtml).toContain('规则核对时，以本桌持有的 2025《怪物图鉴》数据块为准');
    expect(chinesePost?.bodyHtml).toContain('2014 桌上哪些地方不同');
    expect(chinesePost?.bodyHtml).toContain('Death%20Knight%20Aspirant');
    expect(chinesePost?.bodyHtml).not.toContain('再使用 Marshal Undead');
    expect(chinesePost?.bodyHtml).not.toContain('快速结论');
    expect(chinesePost?.bodyHtml).not.toContain('<table');
    expect(chinesePost?.bodyHtml).not.toContain('配套视频');
    expect(chinesePost?.faqItems).toBeUndefined();
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-death-knight-guide.webp');
  });

  test('builds localized metadata and article schema for the Death Knight guide', () => {
    expect(getBlogPostPath('en', DND_DEATH_KNIGHT_SLUG)).toBe('/blog/dnd-death-knight');
    expect(getBlogPostPath('zh', DND_DEATH_KNIGHT_SLUG)).toBe('/zh/blog/dnd-death-knight');

    const englishMetadata = createBlogPostMetadata('en', DND_DEATH_KNIGHT_SLUG);
    const chineseMetadata = createBlogPostMetadata('zh', DND_DEATH_KNIGHT_SLUG);

    expect(englishMetadata.title).toBe('DnD Death Knight: Run a 2025 Undead Commander Encounter');
    expect(englishMetadata.alternates?.canonical).toBe('/blog/dnd-death-knight');
    expect(chineseMetadata.title).toBe('DND 死亡骑士：运行 2025 亡灵指挥官遭遇');
    expect(chineseMetadata.description).toContain('死亡骑士');

    expect(buildBlogPostStructuredData('en', DND_DEATH_KNIGHT_SLUG)).toMatchObject({
      '@type': 'Article',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-death-knight',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-death-knight-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_DEATH_KNIGHT_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_DEATH_KNIGHT_SLUG)).toBeNull();
  });

  test('uses a WebP cover and lists both localized Death Knight URLs in llms.txt', () => {
    expect(existsSync('public/blog/covers/en/dnd-death-knight-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-death-knight');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-death-knight');
  });
});

describe('dnd sword sheaths blog post', () => {
  test('keeps rules, story prompts, and VTT visuals distinct in both locales', () => {
    const englishPost = getBlogPost('en', DND_SWORD_SHEATHS_SLUG);
    const chinesePost = getBlogPost('zh', DND_SWORD_SHEATHS_SLUG);

    expect(englishPost?.title).toContain('DnD Sword Sheaths');
    expect(englishPost?.bodyHtml).toContain('dnd sword sheaths');
    expect(englishPost?.bodyHtml).toContain(
      'each attack made as part of the Attack action lets you equip or unequip one weapon before or after that attack',
    );
    expect(englishPost?.bodyHtml).toContain('These are homebrew prompts, not official magic-item rules.');
    expect(englishPost?.bodyHtml).not.toContain('2014 vs 2024');
    expect(englishPost?.bodyHtml).not.toContain('Quick answer');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-sword-sheaths-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(6);

    expect(chinesePost?.title).toContain('DND 剑鞘');
    expect(chinesePost?.bodyHtml).toContain('剑鞘（scabbard）');
    expect(chinesePost?.bodyHtml).toContain('攻击动作（Attack action）中的每次攻击前后');
    expect(chinesePost?.bodyHtml).toContain('以下都是自制内容提示，不是官方魔法物品规则。');
    expect(chinesePost?.bodyHtml).not.toContain('2014/2024 对比');
    expect(chinesePost?.bodyHtml).not.toContain('快速结论');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-sword-sheaths-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(6);
  });

  test('keeps visible sword-sheath FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_SWORD_SHEATHS_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('builds localized metadata and structured data for the sword-sheath article', () => {
    expect(getBlogPostPath('en', DND_SWORD_SHEATHS_SLUG)).toBe('/blog/dnd-sword-sheaths');
    expect(getBlogPostPath('zh', DND_SWORD_SHEATHS_SLUG)).toBe('/zh/blog/dnd-sword-sheaths');

    const englishMetadata = createBlogPostMetadata('en', DND_SWORD_SHEATHS_SLUG);
    const chineseMetadata = createBlogPostMetadata('zh', DND_SWORD_SHEATHS_SLUG);

    expect(englishMetadata.title).toBe('DnD Sword Sheaths: Rules, Scabbard Ideas, and VTT Visuals');
    expect(englishMetadata.alternates?.canonical).toBe('/blog/dnd-sword-sheaths');
    expect(englishMetadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-sword-sheaths-guide.webp',
        alt: 'dnd sword sheaths guide cover showing a leather scabbard, a partially drawn sword, a VTT token, and a d20 on a tabletop map',
      },
    ]);
    expect(chineseMetadata.title).toBe('DND 剑鞘指南：收剑规则、角色设定与 VTT 视觉');
    expect(chineseMetadata.description).toContain('剑鞘');

    expect(buildBlogPostStructuredData('en', DND_SWORD_SHEATHS_SLUG)).toMatchObject({
      '@type': 'Article',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-sword-sheaths',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-sword-sheaths-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_SWORD_SHEATHS_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });
  });

  test('uses a WebP cover and lists both localized article URLs in llms.txt', () => {
    expect(existsSync('public/blog/covers/en/dnd-sword-sheaths-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-sword-sheaths');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-sword-sheaths');
  });
});

describe('dnd thunderclap blog post', () => {
  test('keeps thunderclap near the top after the newer sword-sheath article is published', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );

    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );
  });

  test('publishes the dnd thunderclap article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_THUNDERCLAP_SLUG);
    const chinesePost = getBlogPost('zh', DND_THUNDERCLAP_SLUG);

    expect(englishPost?.title).toContain('Thunderclap DnD');
    expect(englishPost?.bodyHtml).toContain('dnd thunderclap');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-thunderclap-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(8);

    expect(chinesePost?.title).toContain('DND 雷鸣拍击（Thunderclap）');
    expect(chinesePost?.bodyHtml).toContain('雷鸣拍击（Thunderclap）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-thunderclap-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(8);
  });

  test('keeps high-risk Thunderclap rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_THUNDERCLAP_SLUG);
    const chinesePost = getBlogPost('zh', DND_THUNDERCLAP_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      'Thunderclap is an Evocation cantrip with an Action casting time, a Somatic component, and an Instantaneous duration.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2024, each creature in a 5-foot Emanation originating from you must succeed on a Constitution saving throw or take 1d6 Thunder damage.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'The 100-foot line is audible distance, not damage distance.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Thunderclap normally does not damage the caster in 2024 unless the caster chooses to include the Emanation origin; it can still hit allies, familiars, summons, mounts, and NPCs caught in the area.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'The damage increases to 2d6 at level 5, 3d6 at level 11, and 4d6 at level 17.',
    );

    expect(chinesePost?.bodyHtml).toContain(
      '雷鸣拍击（Thunderclap）是塑能（Evocation）戏法，施放时间是动作（Action），只需要姿势成分（Somatic），持续时间是瞬时（Instantaneous）。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2024 文本里，每个处在以你为源点的 5 英尺散发（Emanation）内的生物，都必须进行一次体质豁免（Constitution saving throw）。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '100 英尺描述的是声音能被听见的距离，不是伤害范围。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2024 规则下，雷鸣拍击通常不会伤害施法者，除非施法者选择把散发（Emanation）源点包含进去；但它仍会影响区域内的盟友、魔宠、召唤物、坐骑和 NPC。',
    );
    expect(chinesePost?.bodyHtml).toContain('5 级 2d6、11 级 3d6、17 级 4d6');
  });

  test('keeps visible thunderclap FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_THUNDERCLAP_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese thunderclap article Chinese-first', () => {
    const chineseBodyHtml = getBlogPost('zh', DND_THUNDERCLAP_SLUG)?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('雷鸣拍击（Thunderclap）');
    expect(chineseBodyHtml).toContain('散发（Emanation）');
    expect(chineseBodyHtml).toContain('体质豁免（Constitution saving throw）');
    expect(chineseBodyHtml).toContain('雷鸣伤害（Thunder damage）');
    expect(chineseBodyHtml).toContain('姿势成分（Somatic）');
    expect(chineseBodyHtml).toContain('雷鸣拍击（Thunderclap）常见问题');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Thunderclap DnD FAQ');
    expect(chineseBodyHtml).not.toContain('Does Thunderclap hit allies?');
  });

  test('uses localized paths and metadata for the dnd thunderclap article', () => {
    expect(getBlogPostPath('en', DND_THUNDERCLAP_SLUG)).toBe('/blog/dnd-thunderclap');
    expect(getBlogPostPath('zh', DND_THUNDERCLAP_SLUG)).toBe('/zh/blog/dnd-thunderclap');

    const metadata = createBlogPostMetadata('en', DND_THUNDERCLAP_SLUG);

    expect(metadata.title).toBe('Thunderclap DnD Guide: 2014/2024 Rules, Range, and VTT Tips');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-thunderclap');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-thunderclap',
      'en-US': '/blog/dnd-thunderclap',
      'zh-CN': '/zh/blog/dnd-thunderclap',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-thunderclap-guide.webp',
        alt: 'dnd thunderclap guide cover showing a storm caster token releasing a blue thunder burst into adjacent enemy tokens on a VTT battle map',
      },
    ]);

    const chineseMetadata = createBlogPostMetadata('zh', DND_THUNDERCLAP_SLUG);

    expect(chineseMetadata.title).toBe('DND 雷鸣拍击（Thunderclap）指南：2014/2024 规则、范围与 VTT 标记');
    expect(chineseMetadata.description).toContain('5 英尺散发');
    expect(chineseMetadata.description).toContain('100 英尺声音');
    expect(chineseMetadata.description).toContain('盟友风险');
    expect(chineseMetadata.description).toContain('VTT Token');
    expect(chineseMetadata.alternates?.canonical).toBe('/zh/blog/dnd-thunderclap');
    expect(chineseMetadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-thunderclap',
      'en-US': '/blog/dnd-thunderclap',
      'zh-CN': '/zh/blog/dnd-thunderclap',
    });
  });

  test('builds article and FAQ structured data for the dnd thunderclap article', () => {
    const chinesePost = getBlogPost('zh', DND_THUNDERCLAP_SLUG);

    expect(buildBlogPostStructuredData('en', DND_THUNDERCLAP_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Thunderclap DnD Guide: 2014/2024 Rules, Range, and VTT Tips',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-thunderclap',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-thunderclap-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_THUNDERCLAP_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('DND 雷鸣拍击（Thunderclap）指南封面图');
    expect(chinesePost?.faqItems?.[0]?.question).toBe('雷鸣拍击（Thunderclap）好用吗？');
    expect(chinesePost?.faqItems?.[1]?.question).toBe('雷鸣拍击会打到施法者吗？');
    expect(chinesePost?.faqItems?.[2]?.answer).toContain('会影响区域内的盟友');
  });

  test('uses WebP assets for the dnd thunderclap article', () => {
    expect(existsSync('public/blog/covers/en/dnd-thunderclap-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-thunderclap/thunderclap-vtt-radius.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-thunderclap/thunderclap-video-placeholder.webp')).toBe(true);
  });

  test('keeps the thunderclap video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', DND_THUNDERCLAP_SLUG)?.bodyHtml ?? '';
    const chineseBodyHtml = getBlogPost('zh', DND_THUNDERCLAP_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="2pDcp2JS3ac"');
    expect(englishBodyHtml).toContain('src="/blog/inline/dnd-thunderclap/thunderclap-video-placeholder.webp"');
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).toContain('decoding="async"');
    expect(englishBodyHtml).toContain('fetchpriority="low"');
    expect(englishBodyHtml).toContain('width="480"');
    expect(englishBodyHtml).toContain('height="360"');
    expect(englishBodyHtml).not.toContain('<iframe');
    expect(chineseBodyHtml).toContain('data-video-id="2pDcp2JS3ac"');
    expect(chineseBodyHtml).toContain('fetchpriority="low"');
    expect(chineseBodyHtml).not.toContain('<iframe');
  });

  test('keeps the thunderclap inline article image lazy and dimensioned', () => {
    const englishBodyHtml = getBlogPost('en', DND_THUNDERCLAP_SLUG)?.bodyHtml ?? '';
    const chineseBodyHtml = getBlogPost('zh', DND_THUNDERCLAP_SLUG)?.bodyHtml ?? '';

    for (const bodyHtml of [englishBodyHtml, chineseBodyHtml]) {
      expect(bodyHtml).toContain('src="/blog/inline/dnd-thunderclap/thunderclap-vtt-radius.webp"');
      expect(bodyHtml).toContain('width="1400"');
      expect(bodyHtml).toContain('height="933"');
      expect(bodyHtml).toContain('loading="lazy"');
      expect(bodyHtml).toContain('decoding="async"');
    }
  });

  test('lists the dnd thunderclap article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-thunderclap');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-thunderclap');
  });
});

describe('dnd find familiar blog post', () => {
  test('keeps find familiar near the top after the newer Armorer article is published', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );

    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );
  });

  test('publishes the dnd find familiar article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_FIND_FAMILIAR_SLUG);
    const chinesePost = getBlogPost('zh', DND_FIND_FAMILIAR_SLUG);

    expect(englishPost?.title).toContain('Find Familiar');
    expect(englishPost?.bodyHtml).toContain('dnd find familiar');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-find-familiar-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(8);

    expect(chinesePost?.title).toContain('DND 找寻魔宠（Find Familiar）');
    expect(chinesePost?.bodyHtml).toContain('找寻魔宠（Find Familiar）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-find-familiar-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(8);
  });

  test('keeps high-risk Find Familiar rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_FIND_FAMILIAR_SLUG);
    const chinesePost = getBlogPost('zh', DND_FIND_FAMILIAR_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      'Find Familiar is a 1st-level Conjuration ritual spell that summons a familiar spirit in an animal-style form.',
    );
    expect(englishPost?.bodyHtml).toContain('Ritual casting adds 10 minutes to the casting time.');
    expect(englishPost?.bodyHtml).toContain(
      '2024 long-casting rule</a> means you also need concentration during the casting, even though the familiar does not require concentration after it appears.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2024, the sight-sharing text uses a Bonus Action and lasts until the start of your next turn.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2014, it uses an Action and includes the old own-senses penalty.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'When you cast a touch spell while the familiar is within 100 feet, the familiar can take its Reaction to deliver the touch.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'A familiar cannot attack unless a separate feature says otherwise.',
    );
    expect(englishPost?.bodyHtml).toContain(
      '2024 text uses a shorter named list plus another Beast that has Challenge Rating 0.',
    );

    expect(chinesePost?.bodyHtml).toContain(
      '找寻魔宠（Find Familiar）是 1 环咒法（Conjuration）仪式法术，会召唤一个以动物形态出现的魔宠灵体。',
    );
    expect(chinesePost?.bodyHtml).toContain('若按仪式施放，施法时间再增加 10 分钟。');
    expect(chinesePost?.bodyHtml).toContain('施法期间要保持专注，但魔宠出现后不需要专注维持。');
    expect(chinesePost?.bodyHtml).toContain(
      '2024 文本里，借用感官使用附赠动作（Bonus Action），持续到你下回合开始。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2014 文本里，它使用动作（Action），并包含旧版自身感官限制。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '当你施放接触法术且魔宠在 100 英尺内时，魔宠可以用反应（Reaction）传递接触。',
    );
    expect(chinesePost?.bodyHtml).toContain('魔法动作（Magic action）');
    expect(chinesePost?.bodyHtml).toContain('价值 10+ GP 的燃烧熏香');
  });

  test('keeps visible find familiar FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_FIND_FAMILIAR_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese find familiar article Chinese-first', () => {
    const chineseBodyHtml = getBlogPost('zh', DND_FIND_FAMILIAR_SLUG)?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('找寻魔宠（Find Familiar）');
    expect(chineseBodyHtml).toContain('咒法（Conjuration）');
    expect(chineseBodyHtml).toContain('附赠动作（Bonus Action）');
    expect(chineseBodyHtml).toContain('反应（Reaction）');
    expect(chineseBodyHtml).toContain('搜索（Search）');
    expect(chineseBodyHtml).toContain('协助（Help）');
    expect(chineseBodyHtml).toContain('法师（Wizard）');
    expect(chineseBodyHtml).toContain('天界（Celestial）');
    expect(chineseBodyHtml).toContain('DND 找寻魔宠（Find Familiar）常见问题');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Find Familiar FAQ');
    expect(chineseBodyHtml).not.toContain('Can a familiar attack in DnD?');
  });

  test('uses localized paths and metadata for the dnd find familiar article', () => {
    expect(getBlogPostPath('en', DND_FIND_FAMILIAR_SLUG)).toBe('/blog/dnd-find-familiar');
    expect(getBlogPostPath('zh', DND_FIND_FAMILIAR_SLUG)).toBe('/zh/blog/dnd-find-familiar');

    const metadata = createBlogPostMetadata('en', DND_FIND_FAMILIAR_SLUG);

    expect(metadata.title).toBe('Find Familiar 5e / 2024 Guide: Rules, Uses, and VTT Tokens');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-find-familiar');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-find-familiar',
      'en-US': '/blog/dnd-find-familiar',
      'zh-CN': '/zh/blog/dnd-find-familiar',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-find-familiar-guide.webp',
        alt: 'dnd find familiar guide cover showing a Wizard token, familiar token, spellbook, d20 dice, and VTT scouting markers on a tabletop battle map',
      },
    ]);

    const chineseMetadata = createBlogPostMetadata('zh', DND_FIND_FAMILIAR_SLUG);

    expect(chineseMetadata.title).toBe('DND 找寻魔宠（Find Familiar）指南：规则、用法与 VTT Token');
    expect(chineseMetadata.description).toContain('2014/2024 差异');
    expect(chineseMetadata.description).toContain('协助（Help）');
    expect(chineseMetadata.description).toContain('VTT Token');
    expect(chineseMetadata.alternates?.canonical).toBe('/zh/blog/dnd-find-familiar');
    expect(chineseMetadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-find-familiar',
      'en-US': '/blog/dnd-find-familiar',
      'zh-CN': '/zh/blog/dnd-find-familiar',
    });
  });

  test('builds article and FAQ structured data for the dnd find familiar article', () => {
    const chinesePost = getBlogPost('zh', DND_FIND_FAMILIAR_SLUG);

    expect(buildBlogPostStructuredData('en', DND_FIND_FAMILIAR_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Find Familiar 5e / 2024 Guide: Rules, Uses, and VTT Tokens',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-find-familiar',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-find-familiar-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_FIND_FAMILIAR_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('DND 找寻魔宠（Find Familiar）指南封面图');
    expect(chinesePost?.faqItems?.[0]?.question).toBe('找寻魔宠（Find Familiar）是法师（Wizard）法术吗？');
    expect(chinesePost?.faqItems?.[1]?.question).toBe('魔宠能攻击吗？');
    expect(chinesePost?.faqItems?.[2]?.answer).toContain('协助（Help）属于常见动作');
  });

  test('uses WebP assets for the dnd find familiar article', () => {
    expect(existsSync('public/blog/covers/en/dnd-find-familiar-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-find-familiar/familiar-token-setup.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-find-familiar/find-familiar-video-placeholder.webp')).toBe(true);
  });

  test('keeps the find familiar video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', DND_FIND_FAMILIAR_SLUG)?.bodyHtml ?? '';
    const chineseBodyHtml = getBlogPost('zh', DND_FIND_FAMILIAR_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="EOgSooXEBK0"');
    expect(englishBodyHtml).toContain('src="/blog/inline/dnd-find-familiar/find-familiar-video-placeholder.webp"');
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).toContain('decoding="async"');
    expect(englishBodyHtml).toContain('fetchpriority="low"');
    expect(englishBodyHtml).toContain('width="480"');
    expect(englishBodyHtml).toContain('height="360"');
    expect(englishBodyHtml).not.toContain('<iframe');
    expect(chineseBodyHtml).toContain('data-video-id="EOgSooXEBK0"');
    expect(chineseBodyHtml).toContain('fetchpriority="low"');
    expect(chineseBodyHtml).not.toContain('<iframe');
  });

  test('keeps the find familiar inline article image lazy and dimensioned', () => {
    const englishBodyHtml = getBlogPost('en', DND_FIND_FAMILIAR_SLUG)?.bodyHtml ?? '';
    const chineseBodyHtml = getBlogPost('zh', DND_FIND_FAMILIAR_SLUG)?.bodyHtml ?? '';

    for (const bodyHtml of [englishBodyHtml, chineseBodyHtml]) {
      expect(bodyHtml).toContain('src="/blog/inline/dnd-find-familiar/familiar-token-setup.webp"');
      expect(bodyHtml).toContain('width="1400"');
      expect(bodyHtml).toContain('height="933"');
      expect(bodyHtml).toContain('loading="lazy"');
      expect(bodyHtml).toContain('decoding="async"');
    }
  });

  test('lists the dnd find familiar article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-find-familiar');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-find-familiar');
  });
});

describe('dnd hex blog post', () => {
  test('keeps hex near the top after the newer Armorer article is published', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );

    expect(getBlogPostsForPage('zh', 1).map((post) => post.slug).slice(0, 5)).toEqual(
      FIRST_BLOG_PAGE_SLUGS.slice(0, 5),
    );
  });

  test('publishes the dnd hex article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_HEX_SLUG);
    const chinesePost = getBlogPost('zh', DND_HEX_SLUG);

    expect(englishPost?.title).toContain('Hex DnD');
    expect(englishPost?.bodyHtml).toContain('dnd hex');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-hex-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(7);

    expect(chinesePost?.title).toContain('DND 巫术印记（Hex）');
    expect(chinesePost?.bodyHtml).toContain('巫术印记（Hex）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-hex-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(7);
  });

  test('keeps high-risk Hex rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_HEX_SLUG);
    const chinesePost = getBlogPost('zh', DND_HEX_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      'Hex is a 1st-level Enchantment Warlock spell with a Bonus Action casting time, 90-foot range, verbal, somatic, and material components, and concentration up to 1 hour.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'The 2024 wording adds 1d6 Necrotic damage whenever you hit the cursed target with an attack roll.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'The disadvantage rider affects ability checks only, not saving throws and not attack rolls.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'If the cursed target drops to 0 Hit Points before Hex ends, you can use a Bonus Action on a later turn to curse a new creature.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2024, a level 2 slot can extend Hex to 4 hours, level 3-4 slots to 8 hours, and level 5+ slots to 24 hours.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2014, Remove Curse cast on the target ends Hex early; the 2024 public Hex text no longer carries that spell-specific line, while current Remove Curse still broadly ends curses affecting a creature or object.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Eldritch Blast can add the Hex die once per beam that hits because each beam uses its own attack roll.',
    );

    expect(chinesePost?.bodyHtml).toContain(
      '巫术印记（Hex）是 1 环惑控（Enchantment）契术师（Warlock）法术，施放时间是附赠动作（Bonus Action），距离 90 英尺，需要语言、姿势和材料成分，并且需要专注（Concentration），最长 1 小时。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2024 文本写法是：当你用攻击检定（attack roll）命中被诅咒目标时，额外造成 1d6 黯蚀伤害（Necrotic damage）。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      'Hex 的劣势只影响属性检定（ability checks），不影响豁免（saving throws），也不影响攻击检定（attack rolls）。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '如果被诅咒目标在 Hex 结束前降到 0 HP，你可以在之后的回合花附赠动作，把诅咒转移到另一个生物身上。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2024 规则里，2 环法术位能把巫术印记（Hex）延长到 4 小时，3-4 环延长到 8 小时，5 环或更高延长到 24 小时。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '但当前解除诅咒仍能结束影响生物或物体的诅咒，所以 2024 桌面最好先由 DM 统一裁定。',
    );
  });

  test('keeps visible hex FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_HEX_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese hex article Chinese-first', () => {
    const chineseBodyHtml = getBlogPost('zh', DND_HEX_SLUG)?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('巫术印记（Hex）');
    expect(chineseBodyHtml).toContain('专注（Concentration）');
    expect(chineseBodyHtml).toContain('附赠动作（Bonus Action）');
    expect(chineseBodyHtml).toContain('属性检定（ability checks）');
    expect(chineseBodyHtml).toContain('黯蚀伤害（Necrotic damage）');
    expect(chineseBodyHtml).toContain('DND 巫术印记（Hex）常见问题');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Hex DnD FAQ');
    expect(chineseBodyHtml).not.toContain('What does Hex do?');
  });

  test('uses localized paths and metadata for the dnd hex article', () => {
    expect(getBlogPostPath('en', DND_HEX_SLUG)).toBe('/blog/dnd-hex');
    expect(getBlogPostPath('zh', DND_HEX_SLUG)).toBe('/zh/blog/dnd-hex');

    const metadata = createBlogPostMetadata('en', DND_HEX_SLUG);

    expect(metadata.title).toBe('Hex DnD Guide: 2014/2024 Rules, Damage, and VTT Tips');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-hex');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-hex',
      'en-US': '/blog/dnd-hex',
      'zh-CN': '/zh/blog/dnd-hex',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-hex-guide.webp',
        alt: 'dnd hex guide cover showing a Warlock token, a violet curse sigil, d20 dice, and VTT condition markers on a dark tabletop battle map',
      },
    ]);

    const chineseMetadata = createBlogPostMetadata('zh', DND_HEX_SLUG);

    expect(chineseMetadata.title).toBe('DND 巫术印记（Hex）指南：2014/2024 规则、伤害与 VTT 标记');
    expect(chineseMetadata.description).toContain('1d6 黯蚀伤害');
    expect(chineseMetadata.description).toContain('常见问题');
    expect(chineseMetadata.description).toContain('专注');
    expect(chineseMetadata.description).toContain('属性检定劣势');
    expect(chineseMetadata.alternates?.canonical).toBe('/zh/blog/dnd-hex');
    expect(chineseMetadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-hex',
      'en-US': '/blog/dnd-hex',
      'zh-CN': '/zh/blog/dnd-hex',
    });
  });

  test('builds article and FAQ structured data for the dnd hex article', () => {
    const chinesePost = getBlogPost('zh', DND_HEX_SLUG);

    expect(buildBlogPostStructuredData('en', DND_HEX_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Hex DnD Guide: 2014/2024 Rules, Damage, and VTT Tips',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-hex',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-hex-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_HEX_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('DND 巫术印记（Hex）指南封面图');
    expect(chinesePost?.faqItems?.[0]?.question).toBe('巫术印记（Hex）是契术师（Warlock）专属法术吗？');
    expect(chinesePost?.faqItems?.[1]?.question).toContain('魔能爆（Eldritch Blast）');
    expect(chinesePost?.faqItems?.[2]?.answer).toContain('只影响属性检定');
    expect(chinesePost?.faqItems?.[7]?.question).toBe('解除诅咒（Remove Curse）能结束巫术印记（Hex）吗？');
  });

  test('uses WebP assets for the dnd hex article', () => {
    expect(existsSync('public/blog/covers/en/dnd-hex-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-hex/hex-vtt-markers.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-hex/hex-video-placeholder.webp')).toBe(true);
  });

  test('keeps the hex video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', DND_HEX_SLUG)?.bodyHtml ?? '';
    const chineseBodyHtml = getBlogPost('zh', DND_HEX_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="JwINRY1eD7M"');
    expect(englishBodyHtml).toContain('src="/blog/inline/dnd-hex/hex-video-placeholder.webp"');
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).toContain('decoding="async"');
    expect(englishBodyHtml).toContain('fetchpriority="low"');
    expect(englishBodyHtml).toContain('width="480"');
    expect(englishBodyHtml).toContain('height="360"');
    expect(englishBodyHtml).not.toContain('<iframe');
    expect(chineseBodyHtml).toContain('data-video-id="JwINRY1eD7M"');
    expect(chineseBodyHtml).toContain('fetchpriority="low"');
    expect(chineseBodyHtml).not.toContain('<iframe');
  });

  test('keeps the dnd hex inline article image lazy and dimensioned', () => {
    const englishBodyHtml = getBlogPost('en', DND_HEX_SLUG)?.bodyHtml ?? '';
    const chineseBodyHtml = getBlogPost('zh', DND_HEX_SLUG)?.bodyHtml ?? '';

    for (const bodyHtml of [englishBodyHtml, chineseBodyHtml]) {
      expect(bodyHtml).toContain('src="/blog/inline/dnd-hex/hex-vtt-markers.webp"');
      expect(bodyHtml).toContain('width="1400"');
      expect(bodyHtml).toContain('height="933"');
      expect(bodyHtml).toContain('loading="lazy"');
      expect(bodyHtml).toContain('decoding="async"');
    }
  });

  test('lists the dnd hex article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-hex');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-hex');
  });
});

describe('paladin 2024 spells dnd blog post', () => {
  test('moves the second blog page boundary after publishing dnd races without changing page count', () => {
    expect(getBlogPageCount('en')).toBe(4);
    expect(getBlogPageCount('zh')).toBe(4);

    expect(getBlogPostsForPage('en', 2).map((post) => post.slug).slice(0, 2)).toEqual([
      DND_DEATH_KNIGHT_SLUG,
      DND_5E_ARMORER_SLUG,
    ]);

    expect(getBlogPostsForPage('zh', 2).map((post) => post.slug).slice(0, 2)).toEqual([
      DND_DEATH_KNIGHT_SLUG,
      DND_5E_ARMORER_SLUG,
    ]);
  });

  test('publishes the paladin 2024 spells article in English and Chinese', () => {
    const englishPost = getBlogPost('en', PALADIN_2024_SPELLS_DND_SLUG);
    const chinesePost = getBlogPost('zh', PALADIN_2024_SPELLS_DND_SLUG);

    expect(englishPost?.title).toContain('Paladin 2024 Spells DnD');
    expect(englishPost?.bodyHtml).toContain('paladin 2024 spells dnd');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/paladin-2024-spells-dnd-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(7);

    expect(chinesePost?.title).toContain('圣武士（Paladin）2024 法术指南');
    expect(chinesePost?.bodyHtml).toContain('Paladin 2024 法术');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/paladin-2024-spells-dnd-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(7);
  });

  test('keeps high-risk 2024 Paladin spell rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', PALADIN_2024_SPELLS_DND_SLUG);
    const chinesePost = getBlogPost('zh', PALADIN_2024_SPELLS_DND_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      'Under the 2024 rules, Paladins get Spellcasting at level 1.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'After a Long Rest, you can replace one prepared Paladin spell with another Paladin spell you can cast.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Charisma is your spellcasting ability, and you can use a Holy Symbol as your spellcasting focus.',
    );
    expect(englishPost?.bodyHtml).toContain(
      "At level 2, Paladin's Smite means you always have Divine Smite prepared.",
    );
    expect(englishPost?.bodyHtml).toContain(
      'The 2024 casting rules also limit your turn to one spell slot spent to cast a spell.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Find Steed and Shining Smite are 2nd-level Paladin spells in the 2024 list.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Aura of Vitality and Blinding Smite are 3rd-level Paladin spells.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Banishing Smite, Circle of Power, and Summon Celestial appear on the 5th-level Paladin list.',
    );

    expect(chinesePost?.bodyHtml).toContain(
      '2024 规则下，Paladin 从 1 级开始获得施法（Spellcasting）。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '完成长休（Long Rest）后，你可以把 1 个已准备的 Paladin 法术替换成另一个你能施放的 Paladin 法术。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      'Charisma 是你的施法关键属性，Holy Symbol 可以作为 Paladin 法术的施法法器。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2 级的 Paladin&apos;s Smite 让你始终准备 Divine Smite。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2024 施法规则还限制你在一个回合里只能花费一个法术位来施放法术。',
    );
  });

  test('keeps visible paladin FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, PALADIN_2024_SPELLS_DND_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese paladin 2024 spells article Chinese-first', () => {
    const chinesePost = getBlogPost('zh', PALADIN_2024_SPELLS_DND_SLUG);
    const chineseBodyHtml = chinesePost?.bodyHtml ?? '';

    expect(chinesePost?.title).toContain('圣武士（Paladin）2024 法术指南');
    expect(chineseBodyHtml).toContain('Paladin 2024 法术（paladin 2024 spells dnd）');
    expect(chineseBodyHtml).toContain('Paladin 2024 法术常见问题');
    expect(chineseBodyHtml).toContain('Paladin 法术配套视频');
    expect(chineseBodyHtml).toContain('附赠动作 smite（Bonus Action smite）');
    expect(chineseBodyHtml).toContain('魔法动作（Magic action）');
    expect(chineseBodyHtml).toContain('光耀 smite 光效');
    expect(chineseBodyHtml).toContain('<td><strong>Magic Weapon</strong></td>');

    expect(chineseBodyHtml).not.toContain('<h2>Paladin 2024 Spells DnD 常见问题</h2>');
    expect(chineseBodyHtml).not.toContain('Paladin 法术 companion video');
    expect(chineseBodyHtml).not.toContain('radiant smite 光效');
  });

  test('uses localized paths and metadata for the paladin 2024 spells article', () => {
    expect(getBlogPostPath('en', PALADIN_2024_SPELLS_DND_SLUG)).toBe('/blog/paladin-2024-spells-dnd');
    expect(getBlogPostPath('zh', PALADIN_2024_SPELLS_DND_SLUG)).toBe('/zh/blog/paladin-2024-spells-dnd');

    const metadata = createBlogPostMetadata('en', PALADIN_2024_SPELLS_DND_SLUG);

    expect(metadata.title).toBe('Paladin 2024 Spells DnD Guide: Best Picks, Smites, and VTT Tips');
    expect(metadata.alternates?.canonical).toBe('/blog/paladin-2024-spells-dnd');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/paladin-2024-spells-dnd',
      'en-US': '/blog/paladin-2024-spells-dnd',
      'zh-CN': '/zh/blog/paladin-2024-spells-dnd',
    });

    const chineseMetadata = createBlogPostMetadata('zh', PALADIN_2024_SPELLS_DND_SLUG);

    expect(chineseMetadata.description).toContain('Divine Smite');
    expect(chineseMetadata.description).toContain('Find Steed');
    expect(chineseMetadata.description).toContain('准备法术');
  });

  test('builds article and FAQ structured data for the paladin 2024 spells article', () => {
    expect(buildBlogPostStructuredData('en', PALADIN_2024_SPELLS_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Paladin 2024 Spells DnD Guide: Best Picks, Smites, and VTT Tips',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/paladin-2024-spells-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/paladin-2024-spells-dnd-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', PALADIN_2024_SPELLS_DND_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });
  });

  test('uses WebP assets for the paladin 2024 spells article', () => {
    expect(existsSync('public/blog/covers/en/paladin-2024-spells-dnd-guide.webp')).toBe(true);
    expect(
      existsSync('public/blog/inline/paladin-2024-spells-dnd/paladin-spell-prep-table.webp'),
    ).toBe(true);
    expect(
      existsSync('public/blog/inline/paladin-2024-spells-dnd/paladin-spells-video-placeholder.webp'),
    ).toBe(true);
  });

  test('keeps the paladin video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', PALADIN_2024_SPELLS_DND_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="_vx-oqXOabw"');
    expect(englishBodyHtml).toContain(
      'src="/blog/inline/paladin-2024-spells-dnd/paladin-spells-video-placeholder.webp"',
    );
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).not.toContain('<iframe');
  });

  test('lists the paladin 2024 spells article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/paladin-2024-spells-dnd');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/paladin-2024-spells-dnd');
  });
});

describe('dnd glaive blog post', () => {
  test('publishes the dnd glaive article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_GLAIVE_SLUG);
    const chinesePost = getBlogPost('zh', DND_GLAIVE_SLUG);

    expect(englishPost?.title).toContain('Glaive DnD');
    expect(englishPost?.bodyHtml).toContain('dnd glaive');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-glaive-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(6);

    expect(chinesePost?.title).toContain('DND 长柄刀（Glaive）');
    expect(chinesePost?.bodyHtml).toContain('长柄刀（Glaive）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-glaive-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(6);
  });

  test('keeps high-risk glaive rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_GLAIVE_SLUG);
    const chinesePost = getBlogPost('zh', DND_GLAIVE_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      'A glaive is a martial melee weapon that deals 1d10 slashing damage, costs 20 GP, weighs 6 lb, and has the Heavy, Reach, and Two-Handed properties.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2024 rules, the glaive has Graze as its weapon mastery property.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Graze matters only for a character who has a feature that lets them use that weapon mastery.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2014 rules, the glaive does not have a weapon mastery property.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Reach adds 5 feet to your reach for attacks with the glaive and for opportunity attacks with it.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'The glaive and halberd share the same core 2014 stat line, so the difference is mostly visual unless your table uses source-specific magic items or house rules.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'No for normal attacks. The glaive has the Two-Handed property, so it requires two hands when you attack with it.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Usually no. A glaive is not a finesse or ranged weapon, so it does not fit normal Sneak Attack weapon requirements.',
    );

    expect(chinesePost?.bodyHtml).toContain(
      '长柄刀（Glaive）是一把军用近战武器，造成 1d10 挥砍伤害，价格 20 GP，重量 6 磅，并有重型（Heavy）、触及（Reach）和双手（Two-Handed）属性。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2024 规则里，长柄刀（Glaive）的武器掌握（Weapon Mastery）是擦伤（Graze）。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '擦伤（Graze）只有在角色拥有能使用该武器掌握的特性或选项时才生效。',
    );
    expect(chinesePost?.bodyHtml).toContain('2014 规则里的长柄刀没有武器掌握属性。');
    expect(chinesePost?.bodyHtml).toContain(
      '触及（Reach）让你用长柄刀攻击时的触及距离增加 5 英尺，也影响你用它进行借机攻击时的触及距离。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '长柄刀和戟（Halberd）在 2014 核心数据上相同，所以差异主要是视觉和角色概念，除非你的桌子使用特定来源的魔法物品或房规。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '正常攻击时不行。长柄刀有双手（Two-Handed）属性，攻击时需要两只手。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '通常不适合。长柄刀不是灵巧武器，也不是远程武器，所以不符合普通偷袭（Sneak Attack）武器要求。',
    );
  });

  test('keeps visible glaive FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_GLAIVE_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese glaive article Chinese-first', () => {
    const chineseBodyHtml = getBlogPost('zh', DND_GLAIVE_SLUG)?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('长柄刀（Glaive）');
    expect(chineseBodyHtml).toContain('重型（Heavy）');
    expect(chineseBodyHtml).toContain('触及（Reach）');
    expect(chineseBodyHtml).toContain('双手（Two-Handed）');
    expect(chineseBodyHtml).toContain('擦伤（Graze）');
    expect(chineseBodyHtml).toContain('游荡者（Rogue）适合用长柄刀吗？');
    expect(chineseBodyHtml).toContain('DND 长柄刀常见问题');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Glaive DnD FAQ');
    expect(chineseBodyHtml).not.toContain('What is a glaive?');
  });

  test('uses localized paths for the dnd glaive article', () => {
    expect(getBlogPostPath('en', DND_GLAIVE_SLUG)).toBe('/blog/dnd-glaive');
    expect(getBlogPostPath('zh', DND_GLAIVE_SLUG)).toBe('/zh/blog/dnd-glaive');
  });

  test('builds bilingual metadata alternates for the dnd glaive article', () => {
    const metadata = createBlogPostMetadata('en', DND_GLAIVE_SLUG);

    expect(metadata.title).toBe('Glaive DnD Guide: 5e Stats, Reach, Graze, and VTT Tips');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-glaive');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-glaive',
      'en-US': '/blog/dnd-glaive',
      'zh-CN': '/zh/blog/dnd-glaive',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-glaive-guide.webp',
        alt: 'dnd glaive guide cover showing a polearm fighter token, a glaive, dice, reach markers, and VTT token frames on a tabletop battle map',
      },
    ]);

    const chineseMetadata = createBlogPostMetadata('zh', DND_GLAIVE_SLUG);

    expect(chineseMetadata.title).toBe(
      'DND 长柄刀（Glaive）指南：5e 数据、触及（Reach）、擦伤（Graze）与 VTT 建议',
    );
    expect(chineseMetadata.description).toContain('重型（Heavy）');
    expect(chineseMetadata.description).toContain('触及（Reach）');
    expect(chineseMetadata.description).toContain('双手（Two-Handed）');
    expect(chineseMetadata.description).toContain('擦伤（Graze）');
  });

  test('builds article and FAQ structured data for the dnd glaive article', () => {
    const chinesePost = getBlogPost('zh', DND_GLAIVE_SLUG);

    expect(buildBlogPostStructuredData('en', DND_GLAIVE_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Glaive DnD Guide: 5e Stats, Reach, Graze, and VTT Tips',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-glaive',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-glaive-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_GLAIVE_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('DND 长柄刀（Glaive）指南封面图');
    expect(chinesePost?.faqItems?.[2]?.question).toBe('2024 DnD 里长柄刀有 Graze 吗？');
    expect(chinesePost?.faqItems?.[2]?.answer).toContain('有');
    expect(chinesePost?.faqItems?.[6]?.question).toBe('游荡者（Rogue）适合用长柄刀吗？');
  });

  test('uses existing WebP assets for the dnd glaive article', () => {
    expect(existsSync('public/blog/covers/en/dnd-glaive-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-glaive/glaive-video-placeholder.webp')).toBe(true);
  });

  test('keeps the glaive video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', DND_GLAIVE_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="zAJmvbQXm1c"');
    expect(englishBodyHtml).toContain('src="/blog/inline/dnd-glaive/glaive-video-placeholder.webp"');
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).not.toContain('<iframe');
  });

  test('lists the dnd glaive article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-glaive');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-glaive');
  });
});

describe('dnd silvery barbs blog post', () => {
  test('publishes the dnd silvery barbs article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_SILVERY_BARBS_SLUG);
    const chinesePost = getBlogPost('zh', DND_SILVERY_BARBS_SLUG);

    expect(englishPost?.title).toContain('Silvery Barbs DnD');
    expect(englishPost?.bodyHtml).toContain('dnd silvery barbs');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-silvery-barbs-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(7);

    expect(chinesePost?.title).toContain('银光倒刺（Silvery Barbs）');
    expect(chinesePost?.bodyHtml).toContain('银光倒刺（Silvery Barbs）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-silvery-barbs-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(7);
  });

  test('keeps high-risk Silvery Barbs rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_SILVERY_BARBS_SLUG);
    const chinesePost = getBlogPost('zh', DND_SILVERY_BARBS_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      "Silvery Barbs was introduced in Strixhaven: A Curriculum of Chaos, not the 2014 Player's Handbook.",
    );
    expect(englishPost?.bodyHtml).toContain('It is not printed in the 2024 Free Rules spell list.');
    expect(englishPost?.bodyHtml).toContain('Ask the DM before building a character around it.');
    expect(englishPost?.bodyHtml).toContain('Silvery Barbs cannot negate Legendary Resistance.');
    expect(englishPost?.bodyHtml).toContain('Silvery Barbs does not require concentration.');
    expect(englishPost?.bodyHtml).toContain('It is a reroll effect, not the Disadvantage condition.');
    expect(englishPost?.bodyHtml).toContain(
      'The 2024 one-spell-slot-per-turn rule applies to the whole turn',
    );

    expect(chinesePost?.bodyHtml).toContain(
      '银光倒刺（Silvery Barbs）出自《斯翠海文：混沌课程》（Strixhaven: A Curriculum of Chaos），不是 2014 版《玩家手册》（Player’s Handbook）的法术。',
    );
    expect(chinesePost?.bodyHtml).toContain('它没有收录在 2024 免费规则（Free Rules）的法术列表里。');
    expect(chinesePost?.bodyHtml).toContain('围绕它建角色前，先问 DM。');
    expect(chinesePost?.bodyHtml).toContain('银光倒刺不能取消传奇抗力（Legendary Resistance）。');
    expect(chinesePost?.bodyHtml).toContain('银光倒刺不需要专注（Concentration）。');
    expect(chinesePost?.bodyHtml).toContain('它是重掷效果，不是劣势（Disadvantage）状态。');
    expect(chinesePost?.bodyHtml).toContain(
      '2024 版规则看整个回合：如果银光倒刺在该回合消耗了法术位，同一施法者本回合不能再用另一个法术位施放其他法术；反过来也一样。',
    );
  });

  test('keeps visible Silvery Barbs FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_SILVERY_BARBS_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese Silvery Barbs article Chinese-first', () => {
    const chineseBodyHtml = getBlogPost('zh', DND_SILVERY_BARBS_SLUG)?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('银光倒刺（Silvery Barbs）');
    expect(chineseBodyHtml).toContain('反应（Reaction）');
    expect(chineseBodyHtml).toContain('优势（Advantage）');
    expect(chineseBodyHtml).toContain('劣势（Disadvantage）');
    expect(chineseBodyHtml).toContain('传奇抗力（Legendary Resistance）');
    expect(chineseBodyHtml).toContain('DND 银光倒刺（Silvery Barbs）常见问题');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Silvery Barbs DnD FAQ');
    expect(chineseBodyHtml).not.toContain('What is Silvery Barbs?');
  });

  test('uses localized paths for the dnd silvery barbs article', () => {
    expect(getBlogPostPath('en', DND_SILVERY_BARBS_SLUG)).toBe('/blog/dnd-silvery-barbs');
    expect(getBlogPostPath('zh', DND_SILVERY_BARBS_SLUG)).toBe('/zh/blog/dnd-silvery-barbs');
  });

  test('builds bilingual metadata alternates for the dnd silvery barbs article', () => {
    const metadata = createBlogPostMetadata('en', DND_SILVERY_BARBS_SLUG);

    expect(metadata.title).toBe('Silvery Barbs DnD Guide: 2014 vs 2024 Rules and VTT Tips');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-silvery-barbs');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-silvery-barbs',
      'en-US': '/blog/dnd-silvery-barbs',
      'zh-CN': '/zh/blog/dnd-silvery-barbs',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-silvery-barbs-guide.webp',
        alt: 'dnd silvery barbs guide cover showing silver reaction magic between VTT tokens, d20 dice, spell notes, and an advantage marker on a tabletop battle map',
      },
    ]);
  });

  test('builds article and FAQ structured data for the dnd silvery barbs article', () => {
    const chinesePost = getBlogPost('zh', DND_SILVERY_BARBS_SLUG);

    expect(buildBlogPostStructuredData('en', DND_SILVERY_BARBS_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Silvery Barbs DnD Guide: 2014 vs 2024 Rules and VTT Tips',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-silvery-barbs',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-silvery-barbs-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_SILVERY_BARBS_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('银光倒刺（Silvery Barbs）指南封面图');
    expect(chinesePost?.faqItems?.[1]?.question).toBe('银光倒刺在 2024 免费规则里吗？');
    expect(chinesePost?.faqItems?.[1]?.answer).toContain('没有');
  });

  test('uses existing WebP assets for the dnd silvery barbs article', () => {
    expect(existsSync('public/blog/covers/en/dnd-silvery-barbs-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-silvery-barbs/dnd-silvery-barbs-video-placeholder.webp')).toBe(
      true,
    );
  });

  test('keeps the Silvery Barbs video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', DND_SILVERY_BARBS_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="Iywz0U5Zwl0"');
    expect(englishBodyHtml).toContain(
      'src="/blog/inline/dnd-silvery-barbs/dnd-silvery-barbs-video-placeholder.webp"',
    );
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).not.toContain('<iframe');
  });

  test('lists the dnd silvery barbs article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-silvery-barbs');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-silvery-barbs');
  });
});

describe('dnd shortsword blog post', () => {
  test('publishes the dnd shortsword article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_SHORTSWORD_SLUG);
    const chinesePost = getBlogPost('zh', DND_SHORTSWORD_SLUG);

    expect(englishPost?.title).toContain('DnD Shortsword');
    expect(englishPost?.bodyHtml).toContain('dnd shortsword');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-shortsword-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(6);

    expect(chinesePost?.title).toContain('DND 短剑（Shortsword）');
    expect(chinesePost?.bodyHtml).toContain('短剑（Shortsword）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-shortsword-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(6);
  });

  test('keeps high-risk shortsword rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_SHORTSWORD_SLUG);
    const chinesePost = getBlogPost('zh', DND_SHORTSWORD_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      'A shortsword is a martial melee weapon that deals 1d6 piercing damage, costs 10 gp, weighs 2 lb, and has the Finesse and Light properties.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Vex matters only for a character who has a feature that lets them use that weapon mastery.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Vex does not give Advantage to the attack that triggered it.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'A shortsword qualifies for Sneak Attack because it has Finesse, but the Rogue still needs the normal Sneak Attack conditions.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'The extra Light attack does not add your ability modifier to its damage unless that modifier is negative.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2014, taking the Attack action and attacking with a Light melee weapon in one hand lets you spend a Bonus Action',
    );
    expect(englishPost?.bodyHtml).toContain('The shortsword has Vex, not Nick.');

    expect(chinesePost?.bodyHtml).toContain(
      '短剑是一把军用近战武器，造成 1d6 穿刺伤害，价格 10 GP，重量 2 磅，并有灵巧（Finesse）和轻型（Light）属性。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      'Vex 只有在角色拥有能使用该武器掌握的特性或选项时才生效。',
    );
    expect(chinesePost?.bodyHtml).toContain('Vex 不会让触发它的同一次攻击获得优势。');
    expect(chinesePost?.bodyHtml).toContain(
      '短剑因为有灵巧属性而符合偷袭的武器要求，但游荡者（Rogue）仍然必须满足正常的 Sneak Attack 条件。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '轻型武器的额外攻击通常不把属性调整值加到伤害上，除非该调整值为负数。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2014 规则里，你采取攻击动作，并用一手持有的轻型近战武器攻击后，可以用附赠动作',
    );
    expect(chinesePost?.bodyHtml).toContain('短剑的武器掌握是 Vex，不是 Nick。');
  });

  test('keeps visible shortsword FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_SHORTSWORD_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese shortsword article Chinese-first', () => {
    const chineseBodyHtml = getBlogPost('zh', DND_SHORTSWORD_SLUG)?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('短剑（Shortsword）');
    expect(chineseBodyHtml).toContain('灵巧（Finesse）');
    expect(chineseBodyHtml).toContain('轻型（Light）');
    expect(chineseBodyHtml).toContain('武器掌握（Weapon Mastery）');
    expect(chineseBodyHtml).toContain('偷袭（Sneak Attack）');
    expect(chineseBodyHtml).toContain('DND 短剑常见问题');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Shortsword DnD FAQ');
    expect(chineseBodyHtml).not.toContain('<h2 id="best-users">Best users');
  });

  test('uses localized paths for the dnd shortsword article', () => {
    expect(getBlogPostPath('en', DND_SHORTSWORD_SLUG)).toBe('/blog/dnd-shortsword');
    expect(getBlogPostPath('zh', DND_SHORTSWORD_SLUG)).toBe('/zh/blog/dnd-shortsword');
  });

  test('builds bilingual metadata alternates for the dnd shortsword article', () => {
    const metadata = createBlogPostMetadata('en', DND_SHORTSWORD_SLUG);

    expect(metadata.title).toBe('Shortsword DnD Guide: 2014 vs 2024 Rules and Vex');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-shortsword');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-shortsword',
      'en-US': '/blog/dnd-shortsword',
      'zh-CN': '/zh/blog/dnd-shortsword',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-shortsword-guide.webp',
        alt: 'dnd shortsword guide cover showing a rogue token with a shortsword, dice, character sheet notes, and VTT token frames on a dungeon tabletop',
      },
    ]);
  });

  test('builds article and FAQ structured data for the dnd shortsword article', () => {
    expect(buildBlogPostStructuredData('en', DND_SHORTSWORD_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Shortsword DnD Guide: 2014 vs 2024 Rules and Vex',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-shortsword',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-shortsword-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_SHORTSWORD_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });
  });

  test('uses an existing WebP cover for the dnd shortsword article', () => {
    expect(existsSync('public/blog/covers/en/dnd-shortsword-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-shortsword/dnd-shortsword-video-placeholder.webp')).toBe(true);
  });

  test('keeps the shortsword video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', DND_SHORTSWORD_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="-nu-JmZ4joo"');
    expect(englishBodyHtml).toContain(
      'src="/blog/inline/dnd-shortsword/dnd-shortsword-video-placeholder.webp"',
    );
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).not.toContain('<iframe');
  });

  test('lists the dnd shortsword article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-shortsword');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-shortsword');
  });
});

describe('dnd bless blog post', () => {
  test('publishes the dnd bless article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_BLESS_SLUG);
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);

    expect(englishPost?.title).toContain('Bless DnD');
    expect(englishPost?.bodyHtml).toContain('dnd bless');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-bless-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(6);

    expect(chinesePost?.title).toContain('祝福术（DND Bless）');
    expect(chinesePost?.bodyHtml).toContain('祝福术（Bless）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-bless-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(6);
  });

  test('keeps high-risk Bless rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_BLESS_SLUG);
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);

    expect(englishPost?.bodyHtml).toContain('add 1d4 to attack rolls and saving throws');
    expect(englishPost?.bodyHtml).toContain('Bless does not add 1d4 to damage rolls');
    expect(englishPost?.bodyHtml).toContain('Bless does not add to ability checks');
    expect(englishPost?.bodyHtml).toContain('The Cleric should not need a pile of disposable holy symbols');
    expect(englishPost?.bodyHtml).toContain('Bless does not stack with another Bless on the same target');
    expect(englishPost?.bodyHtml).toContain('It is not once per turn');

    expect(chinesePost?.bodyHtml).toContain('攻击检定（attack roll）和豁免（saving throw）');
    expect(chinesePost?.bodyHtml).toContain('祝福术不会把 1d4 加到伤害上');
    expect(chinesePost?.bodyHtml).toContain('祝福术不加属性检定');
    expect(chinesePost?.bodyHtml).toContain('不应该因为每次施放祝福术就损失一个');
    expect(chinesePost?.bodyHtml).toContain('祝福术不和另一个祝福术叠加');
    expect(chinesePost?.bodyHtml).toContain('不是每回合一次');
  });

  test('keeps the Chinese Bless article Chinese-first', () => {
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);
    const chineseBodyHtml = chinesePost?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('祝福术');
    expect(chineseBodyHtml).toContain('专注（Concentration）');
    expect(chineseBodyHtml).toContain('攻击检定');
    expect(chineseBodyHtml).toContain('豁免');
    expect(chineseBodyHtml).toContain('祝福术（DND Bless）常见问题');
    expect(chineseBodyHtml).toContain('祝福术（DND Bless）配套视频');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Bless DnD FAQ');
    expect(chineseBodyHtml).not.toContain('Does Bless add to damage?');
  });

  test('uses localized paths for the dnd bless article', () => {
    expect(getBlogPostPath('en', DND_BLESS_SLUG)).toBe('/blog/dnd-bless');
    expect(getBlogPostPath('zh', DND_BLESS_SLUG)).toBe('/zh/blog/dnd-bless');
  });

  test('builds bilingual metadata alternates for the dnd bless article', () => {
    const metadata = createBlogPostMetadata('en', DND_BLESS_SLUG);

    expect(metadata.title).toBe('Bless DnD Guide: 2014 vs 2024 Rules and Best Uses');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-bless');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-bless',
      'en-US': '/blog/dnd-bless',
      'zh-CN': '/zh/blog/dnd-bless',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-bless-guide.webp',
        alt: 'dnd bless guide cover showing golden Bless magic over three ally tokens, a d4, a holy symbol, and VTT token frames on a tabletop battle map',
      },
    ]);
  });

  test('builds article and FAQ structured data for the dnd bless article', () => {
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);

    expect(buildBlogPostStructuredData('en', DND_BLESS_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Bless DnD Guide: 2014 vs 2024 Rules and Best Uses',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-bless',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-bless-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_BLESS_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('祝福术（DND Bless）指南封面图');
    expect(chinesePost?.faqItems?.[3]?.question).toBe('2024 版祝福术会消耗 Holy Symbol 吗？');
    expect(chinesePost?.faqItems?.[3]?.answer).toContain('不会');
  });

  test('keeps the Bless video as a lazy lite YouTube embed', () => {
    const englishPost = getBlogPost('en', DND_BLESS_SLUG);
    const englishBodyHtml = englishPost?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="IPOddAMdy5k"');
    expect(englishBodyHtml).toContain('src="/blog/inline/dnd-bless/dnd-bless-video-placeholder.webp"');
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).not.toContain('<iframe');
  });

  test('lists the dnd bless article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-bless');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-bless');
  });
});

describe('rapier dnd blog post', () => {
  test('publishes the rapier dnd article in English and Chinese', () => {
    const englishPost = getBlogPost('en', RAPIER_DND_SLUG);
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);

    expect(englishPost?.title).toContain('Rapier DnD');
    expect(englishPost?.bodyHtml).toContain('rapier dnd');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-rapier-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(5);

    expect(chinesePost?.title).toContain('DND 细剑');
    expect(chinesePost?.bodyHtml).toContain('细剑（Rapier）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-rapier-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(5);
  });

  test('keeps high-risk rapier rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', RAPIER_DND_SLUG);
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);

    expect(englishPost?.bodyHtml).toContain('A rapier is <strong>not</strong> a Light weapon');
    expect(englishPost?.bodyHtml).toContain('you use the same ability for both rolls on that attack');
    expect(englishPost?.bodyHtml).toContain('Vex matters only for a character who has a feature that lets them use that weapon mastery');
    expect(englishPost?.bodyHtml).toContain('Vex does not give Advantage to the attack that triggered it');
    expect(englishPost?.bodyHtml).toContain('rapier + dagger does not automatically give you a bonus attack');
    expect(englishPost?.bodyHtml).toContain('The Rogue still needs the normal Sneak Attack conditions');

    expect(chinesePost?.bodyHtml).toContain('细剑<strong>不是</strong>轻型（Light）武器');
    expect(chinesePost?.bodyHtml).toContain('同一次攻击里必须用同一个属性');
    expect(chinesePost?.bodyHtml).toContain('Vex 只有在角色本身拥有使用该武器掌握的特性或选项时才生效');
    expect(chinesePost?.bodyHtml).toContain('Vex 不会让触发它的同一次攻击获得优势');
    expect(chinesePost?.bodyHtml).toContain('细剑 + 匕首不会因为基础双武器规则自动给你一次附赠动作攻击');
    expect(chinesePost?.bodyHtml).toContain('游荡者（Rogue）仍然必须满足当前规则版本下正常的 Sneak Attack 条件');
  });

  test('keeps the Chinese rapier article Chinese-first', () => {
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);
    const chineseBodyHtml = chinesePost?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('1d8 穿刺');
    expect(chineseBodyHtml).toContain('灵巧（Finesse）');
    expect(chineseBodyHtml).toContain('游荡者（Rogue）决斗者');
    expect(chineseBodyHtml).toContain('DND 细剑常见问题');
    expect(chineseBodyHtml).toContain('力量或敏捷');
    expect(chineseBodyHtml).toContain('DND 细剑（Rapier）视频');

    expect(chineseBodyHtml).not.toContain('1d8 Piercing');
    expect(chineseBodyHtml).not.toContain('<td>Finesse</td>');
    expect(chineseBodyHtml).not.toContain('<h3>Rogue 决斗者</h3>');
    expect(chineseBodyHtml).not.toContain('Rapier DnD 常见问题');
    expect(chineseBodyHtml).not.toContain('Rapier DnD 配套视频');
    expect(chineseBodyHtml).not.toContain('配套视频');
    expect(chineseBodyHtml).not.toContain('Strength or Dexterity');
    expect(chineseBodyHtml).not.toContain('不过 Rogue 仍然');
    expect(chineseBodyHtml).not.toContain('决斗者、Rogue 或 NPC Token');
  });

  test('uses localized paths for the rapier dnd article', () => {
    expect(getBlogPostPath('en', RAPIER_DND_SLUG)).toBe('/blog/rapier-dnd');
    expect(getBlogPostPath('zh', RAPIER_DND_SLUG)).toBe('/zh/blog/rapier-dnd');
  });

  test('builds bilingual metadata alternates for the rapier dnd article', () => {
    const metadata = createBlogPostMetadata('en', RAPIER_DND_SLUG);

    expect(metadata.title).toBe('Rapier DnD Guide: 5e Stats, Vex, Best Users, and VTT Tips');
    expect(metadata.alternates?.canonical).toBe('/blog/rapier-dnd');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/rapier-dnd',
      'en-US': '/blog/rapier-dnd',
      'zh-CN': '/zh/blog/rapier-dnd',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-rapier-guide.webp',
        alt: 'rapier dnd guide cover showing a duelist token, rapier, dice, character sheet notes, and VTT token frames on a dungeon tabletop',
      },
    ]);
  });

  test('builds article and FAQ structured data for the rapier dnd article', () => {
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);

    expect(buildBlogPostStructuredData('en', RAPIER_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Rapier DnD Guide: 5e Stats, Vex, Best Users, and VTT Tips',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/rapier-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-rapier-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', RAPIER_DND_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('DND 细剑（Rapier）指南封面图');
    expect(chinesePost?.coverAlt).not.toContain('rapier dnd 指南封面图');
    expect(chinesePost?.faqItems?.[1]?.question).toBe('游荡者（Rogue）可以用细剑偷袭（Sneak Attack）吗？');
    expect(chinesePost?.faqItems?.[1]?.answer).toContain('游荡者（Rogue）仍然必须满足正常 Sneak Attack 条件');
    expect(chinesePost?.faqItems?.[1]?.answer).not.toContain('但 Rogue 仍然');
  });

  test('lists the rapier dnd article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/rapier-dnd');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/rapier-dnd');
  });
});
