// @vitest-environment jsdom

import { existsSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from './index';

const DND_WIZARD_SPELLS_SLUG = 'dnd-wizard-spells';
const COVER_PATH = '/blog/covers/en/dnd-wizard-spells-guide.webp';
const CHARACTER_STUDY_IMAGE_PATH = '/blog/inline/dnd-wizard-spells/wizard-character-study.webp';
const CHARACTER_FOCUS_IMAGE_PATH = '/blog/inline/dnd-wizard-spells/wizard-character-focus.webp';
const CHARACTER_READY_IMAGE_PATH = '/blog/inline/dnd-wizard-spells/wizard-character-ready.webp';
const SHARED_CHARACTER_INLINE_PATHS = [
  CHARACTER_STUDY_IMAGE_PATH,
  CHARACTER_FOCUS_IMAGE_PATH,
  CHARACTER_READY_IMAGE_PATH,
] as const;
const LEGACY_RULE_DIAGRAM_PATHS = [
  '/blog/inline/dnd-wizard-spells/wizard-spell-prep-map.webp',
  '/blog/inline/dnd-wizard-spells/wizard-concentration-board.webp',
  '/blog/inline/dnd-wizard-spells/wizard-example-card.webp',
  '/blog/inline/dnd-wizard-spells/wizard-concentration-scene-card-zh.webp',
  '/blog/inline/dnd-wizard-spells/wizard-example-card-zh.webp',
] as const;
const ENGLISH_TITLE = 'DnD Wizard Spells: Prepare From the Spellbook, Not the Catalog';
const ENGLISH_DESCRIPTION =
  'dnd wizard spells on a legal sheet are prepared names from your spellbook, not a mixed catalog. Write 2014 or 2024 first, count spellbook / prepared / slots, skip rituals when the year allows, and keep one concentration job. 2014 uses Intelligence plus Wizard level; 2024 uses the Prepared Spells column (four at level 1, six at level 3).';
const CHINESE_TITLE = 'DND 法师法术：书里有 6 个，不等于今天准备 6 个';
const CHINESE_SEO_TITLE = 'DND 法师法术（Wizard）：书里有 6 个，不等于今天准备 6 个';
const CHINESE_DESCRIPTION =
  '开团前先写 2014 或 2024，再把法术书、准备法术和法术位分成三栏；按场景写出可回算的 1–3 级低环清单。';

function getSitemapEntry(url: string) {
  const entry = sitemap().find((candidate) => candidate.url === url);

  if (!entry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return entry;
}

function expectRelatedSlugsResolve(
  locale: 'en' | 'zh',
  relatedSlugs: readonly string[] | undefined,
) {
  if (!relatedSlugs || relatedSlugs.length === 0) {
    throw new Error(`Expected relatedSlugs for locale=${locale}.`);
  }

  for (const relatedSlug of relatedSlugs) {
    const relatedPost = getBlogPost(locale, relatedSlug);
    if (!relatedPost) {
      throw new Error(
        `relatedSlugs includes unresolvable slug for locale=${locale}: ${relatedSlug}`,
      );
    }
  }
}

describe('dnd wizard spells blog post', () => {
  test('publishes a bilingual spellbook-prep guide without FAQPage or sibling overwrite', () => {
    const englishPost = getBlogPost('en', DND_WIZARD_SPELLS_SLUG);
    const chinesePost = getBlogPost('zh', DND_WIZARD_SPELLS_SLUG);
    const clericPost = getBlogPost('en', 'dnd-cleric-spells');
    const koboldPost = getBlogPost('en', 'dnd-kobold');

    expect(englishPost?.title).toBe(ENGLISH_TITLE);
    expect(englishPost?.seoTitle).toBe(ENGLISH_TITLE);
    expect(englishPost?.metaDescription).toBe(ENGLISH_DESCRIPTION);
    expect(englishPost?.excerpt).toBe(ENGLISH_DESCRIPTION);
    expect(englishPost?.updatedAt).toBe('2026-09-16');
    expect(englishPost?.publishedAt).toBe('2026-09-16');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Spell Guide');
    expect(englishPost?.coverAlt).toBe(
      'Single original adult wizard character in deep blue robes against a simple dark background with one hand raised',
    );
    expect(englishPost?.coverAlt).not.toContain('two unused first-level slot ticks');
    expect(englishPost?.bodyHtml).toContain('Write 2014 or 2024 on the card before any Wizard name');
    expect(englishPost?.bodyHtml).toContain(COVER_PATH);
    for (const inlinePath of SHARED_CHARACTER_INLINE_PATHS) {
      expect(englishPost?.bodyHtml).toContain(inlinePath);
    }
    for (const legacyPath of LEGACY_RULE_DIAGRAM_PATHS) {
      expect(englishPost?.bodyHtml).not.toContain(legacyPath);
    }
    expect(englishPost?.bodyHtml).toContain(
      'alt="Single adult wizard in deep blue robes against a simple dark background, studying with a contemplative gaze and hands held at chest height"',
    );
    expect(englishPost?.bodyHtml).toContain(
      'alt="Single adult wizard in deep blue robes against a simple dark background, focused with one hand raised at the chest"',
    );
    expect(englishPost?.bodyHtml).toContain(
      'alt="Single adult wizard in deep blue robes against a simple dark background, standing ready with arms relaxed at his sides"',
    );
    expect(englishPost?.bodyHtml).not.toContain(
      'Diagram of three labeled piles—Spellbook, Prepared, and Slots',
    );
    expect(englishPost?.bodyHtml).not.toContain('One concentration ring around a single opener');
    expect(englishPost?.bodyHtml).not.toContain('Filled 2024 Wizard 3 morning card matching the example table');
    expect(englishPost?.bodyHtml).not.toContain('__WIZARD_');
    expect(englishPost?.bodyHtml).not.toContain('fetchpriority=');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('lite-video');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).not.toMatch(/FAQ|FAQPage|常见问题/i);
    expect(englishPost?.faqItems).toEqual([]);
    expect(englishPost?.headings?.map((heading) => heading.text)).toEqual(
      expect.arrayContaining([
        'Write 2014 or 2024 on the card before any Wizard name',
        'Count three things: spellbook, prepared, slots',
        'Check the card',
      ]),
    );
    expectRelatedSlugsResolve('en', englishPost?.relatedSlugs);

    expect(chinesePost?.title).toBe(CHINESE_TITLE);
    expect(chinesePost?.seoTitle).toBe(CHINESE_SEO_TITLE);
    expect(chinesePost?.metaDescription).toBe(CHINESE_DESCRIPTION);
    expect(chinesePost?.excerpt).toBe(CHINESE_DESCRIPTION);
    expect(chinesePost?.updatedAt).toBe('2026-09-16');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('法术指南');
    expect(chinesePost?.coverAlt).toBe(
      '单一成年 DND 法师人物，深蓝法袍，深色简洁背景，抬手准备施法',
    );
    expect(chinesePost?.bodyHtml).toContain('先在卡顶写 2014 或 2024');
    expect(chinesePost?.bodyHtml).toContain(COVER_PATH);
    for (const inlinePath of SHARED_CHARACTER_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    for (const legacyPath of LEGACY_RULE_DIAGRAM_PATHS) {
      expect(chinesePost?.bodyHtml).not.toContain(legacyPath);
    }
    expect(chinesePost?.bodyHtml).toContain(
      'alt="单一成年法师人物，深蓝法袍，简洁深色背景，沉思凝视、双手置于胸前"',
    );
    expect(chinesePost?.bodyHtml).toContain(
      'alt="单一成年法师人物，深蓝法袍，简洁深色背景，专注抬手于胸前"',
    );
    expect(chinesePost?.bodyHtml).toContain(
      'alt="单一成年法师人物，深蓝法袍，简洁深色背景，双臂自然垂下、面向镜头准备就绪"',
    );
    expect(chinesePost?.bodyHtml).not.toContain('分成三栏的规则纸卡图');
    expect(chinesePost?.bodyHtml).not.toContain('四格场景卡');
    expect(chinesePost?.bodyHtml).not.toContain('低等级示例卡');
    expect(chinesePost?.bodyHtml).not.toContain('__WIZARD_');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.bodyHtml).not.toMatch(/FAQ|FAQPage|常见问题/);
    expect(chinesePost?.faqItems).toEqual([]);
    expectRelatedSlugsResolve('zh', chinesePost?.relatedSlugs);

    expect(clericPost?.slug).toBe('dnd-cleric-spells');
    expect(koboldPost?.slug).toBe('dnd-kobold');
    expect(clericPost?.bodyHtml).not.toContain('dnd-wizard-spells');
  });

  test('exposes locked metadata, schemas, sitemap routes, and WebP assets', () => {
    const englishPost = getBlogPost('en', DND_WIZARD_SPELLS_SLUG);
    const chinesePost = getBlogPost('zh', DND_WIZARD_SPELLS_SLUG);

    expect(getBlogPostPath('en', DND_WIZARD_SPELLS_SLUG)).toBe('/blog/dnd-wizard-spells');
    expect(getBlogPostPath('zh', DND_WIZARD_SPELLS_SLUG)).toBe('/zh/blog/dnd-wizard-spells');
    expect(createBlogPostMetadata('en', DND_WIZARD_SPELLS_SLUG)).toMatchObject({
      title: ENGLISH_TITLE,
      description: ENGLISH_DESCRIPTION,
      alternates: {
        canonical: '/blog/dnd-wizard-spells',
        languages: {
          'x-default': '/blog/dnd-wizard-spells',
          'en-US': '/blog/dnd-wizard-spells',
          'zh-CN': '/zh/blog/dnd-wizard-spells',
        },
      },
      openGraph: {
        title: `${ENGLISH_TITLE} | Token Maker`,
        description: ENGLISH_DESCRIPTION,
      },
    });
    expect(createBlogPostMetadata('zh', DND_WIZARD_SPELLS_SLUG)).toMatchObject({
      title: CHINESE_SEO_TITLE,
      description: CHINESE_DESCRIPTION,
      alternates: {
        canonical: '/zh/blog/dnd-wizard-spells',
        languages: {
          'x-default': '/blog/dnd-wizard-spells',
          'en-US': '/blog/dnd-wizard-spells',
          'zh-CN': '/zh/blog/dnd-wizard-spells',
        },
      },
      openGraph: {
        title: `${CHINESE_SEO_TITLE} | Token Maker`,
        description: CHINESE_DESCRIPTION,
      },
    });

    expect(buildBlogPostStructuredData('en', DND_WIZARD_SPELLS_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: ENGLISH_TITLE,
      datePublished: '2026-09-16',
      dateModified: '2026-09-16',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-wizard-spells',
      image: [`https://www.tokenmaker.one${COVER_PATH}`],
    });
    expect(buildBlogPostStructuredData('zh', DND_WIZARD_SPELLS_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: CHINESE_SEO_TITLE,
      datePublished: '2026-09-16',
      dateModified: '2026-09-16',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-wizard-spells',
      image: [`https://www.tokenmaker.one${COVER_PATH}`],
    });

    expect(buildBlogPostFaqStructuredData('en', DND_WIZARD_SPELLS_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_WIZARD_SPELLS_SLUG)).toBeNull();
    expect(englishPost?.faqItems ?? []).toHaveLength(0);
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-wizard-spells',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-wizard-spells',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-wizard-spells',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-wizard-spells')).toMatchObject({
      lastModified: new Date('2026-09-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-wizard-spells')).toMatchObject({
      lastModified: new Date('2026-09-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    for (const inlinePath of SHARED_CHARACTER_INLINE_PATHS) {
      expect(existsSync(`public${inlinePath}`)).toBe(true);
    }
  });
});
