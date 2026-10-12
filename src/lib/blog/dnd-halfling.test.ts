// @vitest-environment jsdom

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  DND_HALFLING_CHARACTER_CARD_FIELDS_IMAGE_PATH,
  DND_HALFLING_COVER_PATH,
  DND_HALFLING_CROP_DECISION_IMAGE_PATH,
  DND_HALFLING_TOKEN_CROP_COMPARISON_IMAGE_PATH,
  DND_HALFLING_TRAIT_TRIGGER_MATRIX_IMAGE_PATH,
  DND_HALFLING_VERSION_BRANCH_IMAGE_PATH,
  DND_HALFLING_VERSION_LOCK_IMAGE_PATH,
} from '@/lib/blog-posts/shared';
import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPageCount,
  getBlogPost,
  getBlogPostPath,
  getBlogPostsForPage,
} from './index';

const SLUG = 'dnd-halfling';
const UPDATED_AT = '2026-09-20';
const ENGLISH_TITLE = 'D&D Halfling: The Source Label Comes Before the Character Card';
const ENGLISH_DESCRIPTION =
  'Learn how the 2014/legacy race and 2024 Basic Rules species differ, then copy the matching traits and creation fields and preserve one readable character cue.';
const CHINESE_TITLE = 'DND 半身人：25 英尺还是 30 英尺？先锁 2014/2024 规则再填卡';
const CHINESE_DESCRIPTION =
  '按 DM 允许的来源分开填写 2014 种族或 2024 物种的体型、速度、属性值来源与特性，再核对身份标签和角色棋子在地图缩放下的可读性；年份或旧书许可未确认时，先问 DM。';

const EN_INLINE_PATHS = [
  DND_HALFLING_VERSION_LOCK_IMAGE_PATH,
  DND_HALFLING_CROP_DECISION_IMAGE_PATH,
] as const;
const ZH_INLINE_PATHS = [
  DND_HALFLING_VERSION_BRANCH_IMAGE_PATH,
  DND_HALFLING_CHARACTER_CARD_FIELDS_IMAGE_PATH,
  DND_HALFLING_TRAIT_TRIGGER_MATRIX_IMAGE_PATH,
  DND_HALFLING_TOKEN_CROP_COMPARISON_IMAGE_PATH,
] as const;
const EN_INLINE_ALTS = [
  'A curly-haired Halfling adventurer in a moss-green cloak reading a weathered travel book by candlelight in a fantasy tavern, with a shield and dice on the table',
  'A curly-haired Halfling scout crouching at a sunlit forest edge with a short sword and leaf-patterned shield clearly visible',
] as const;
const ZH_INLINE_ALTS = [
  '雨后村庄石路上的半身人冒险者，手持短剑、背着橡叶纹盾牌，远处是山村与薄雾',
  '月夜营火旁的半身人冒险者用羽毛笔记录冒险准备，盾牌与短剑放在身边',
  '雨中石桥战斗里的半身人冒险者举盾保护队友，手持短剑迎向远处的巨大敌人剪影',
  '月夜森林营地中的半身人冒险者近景肖像，卷发、苔绿色斗篷、短剑和橡叶纹盾牌清晰可见',
] as const;
const EN_INLINE_CAPTIONS = [
  'A character scene for the source check: settle the table’s 2014/legacy or 2024 source before copying Halfling values.',
  'Keep the face and one readable prop visible when checking the character at map scale. The shape is a design choice, not a rule for Small creatures.',
] as const;
const ZH_INLINE_CAPTIONS = [
  '先确认规则来源，再把同一角色的身份线索带进角色卡和冒险场景。',
  '把角色字段写清后，再保留一个能在画面里看见的身份线索；这张是场景插画，不是官方角色卡版式。',
  '用角色场景记住特性触发时的行动，但仍以对应版本的规则文字为准。',
  '先让脸部和一件身份道具在画面中保持可读，再按地图缩放选择裁切形状；这张是角色原画，不是角色棋子边框。',
] as const;

function getBodyRoot(bodyHtml: string) {
  return new DOMParser().parseFromString(bodyHtml, 'text/html').body;
}

function getSitemapEntry(url: string) {
  const entry = sitemap().find((candidate) => candidate.url === url);

  if (!entry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return entry;
}

function expectWebpAsset(path: string) {
  const bytes = readFileSync(`public${path}`);

  expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF');
  expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP');
}

function expectInlineFigures(
  bodyHtml: string,
  expectedPaths: readonly string[],
  expectedAlts: readonly string[],
  expectedCaptions: readonly string[],
) {
  const bodyRoot = getBodyRoot(bodyHtml);
  const images = Array.from(bodyRoot.querySelectorAll('figure img'));
  const captions = Array.from(bodyRoot.querySelectorAll('figure figcaption')).map(
    (caption) => caption.textContent,
  );

  expect(images.map((image) => image.getAttribute('src'))).toEqual(expectedPaths);
  expect(images.map((image) => image.getAttribute('alt'))).toEqual(expectedAlts);
  expect(captions).toEqual(expectedCaptions);
  expect(images.every((image) => image.getAttribute('width') === '1536')).toBe(true);
  expect(images.every((image) => image.getAttribute('height') === '1024')).toBe(true);
  expect(images.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
  expect(images.every((image) => image.getAttribute('decoding') === 'async')).toBe(true);
  expect(bodyRoot.querySelector('h1')).toBeNull();
}

describe('dnd halfling blog post', () => {
  test('binds locked bilingual body content, references, and real inline WebP assets', () => {
    const englishPost = getBlogPost('en', SLUG);
    const chinesePost = getBlogPost('zh', SLUG);

    expect(englishPost).toMatchObject({
      slug: SLUG,
      title: ENGLISH_TITLE,
      seoTitle: ENGLISH_TITLE,
      metaDescription: ENGLISH_DESCRIPTION,
      excerpt: ENGLISH_DESCRIPTION,
      publishedAt: UPDATED_AT,
      updatedAt: UPDATED_AT,
      readTime: '12 min read',
      coverLabel: 'Race Guide',
      coverImage: DND_HALFLING_COVER_PATH,
      faqItems: [],
    });
    expect(chinesePost).toMatchObject({
      slug: SLUG,
      title: CHINESE_TITLE,
      seoTitle: CHINESE_TITLE,
      metaDescription: CHINESE_DESCRIPTION,
      excerpt: CHINESE_DESCRIPTION,
      publishedAt: UPDATED_AT,
      updatedAt: UPDATED_AT,
      readTime: '12 分钟阅读',
      coverLabel: '种族指南',
      coverImage: DND_HALFLING_COVER_PATH,
      faqItems: [],
    });

    const englishBody = englishPost?.bodyHtml ?? '';
    const chineseBody = chinesePost?.bodyHtml ?? '';
    expect(englishBody).toContain('A D&amp;D Halfling entry is safe to copy only after you tie it to the rules year');
    expect(chineseBody).toContain('如果你已经决定玩半身人，先让 DM（地下城主）确认使用 2014 还是 2024 规则');
    expect(englishBody).toContain('https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling');
    expect(chineseBody).toContain('https://tokenmaker.one/zh/blog/dnd-races');
    expect(chineseBody).toContain('https://tokenmaker.one/zh/blog/dnd-character-sheet');
    expectInlineFigures(englishBody, EN_INLINE_PATHS, EN_INLINE_ALTS, EN_INLINE_CAPTIONS);
    expectInlineFigures(chineseBody, ZH_INLINE_PATHS, ZH_INLINE_ALTS, ZH_INLINE_CAPTIONS);

    for (const bodyHtml of [englishBody, chineseBody]) {
      expect(bodyHtml).not.toContain('<h1');
      expect(bodyHtml).not.toContain('__HALFLING_');
      expect(bodyHtml).not.toContain('/tmp/');
      expect(bodyHtml).not.toMatch(/PublicBlogHandoff|bodyHash|dispatch|worker/i);
      expect(bodyHtml).not.toContain('<iframe');
      expect(bodyHtml).not.toContain('data-video-id=');
      expect(bodyHtml).not.toContain('lite-video');
    }

    const englishHrefs = Array.from(getBodyRoot(englishBody).querySelectorAll('a')).map((anchor) =>
      anchor.getAttribute('href'),
    );
    const chineseHrefs = Array.from(getBodyRoot(chineseBody).querySelectorAll('a')).map((anchor) =>
      anchor.getAttribute('href'),
    );
    for (const expectedHref of [
      'https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling',
      'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling',
      'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks',
      'https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game#D20Tests',
      'https://www.tokenmaker.one/',
      '/blog/dnd-races',
    ]) {
      expect(englishHrefs).toContain(expectedHref);
    }
    for (const expectedHref of [
      'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races#Halfling',
      'https://www.dndbeyond.com/sources/dnd/br-2024/character-origins#Halfling',
      'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#BackgroundsandSpeciesfromOlderBooks',
      'https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game#D20Tests',
      'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
      'https://www.tokenmaker.one/',
      'https://tokenmaker.one/zh/blog/dnd-races',
      'https://tokenmaker.one/zh/blog/dnd-character-sheet',
    ]) {
      expect(chineseHrefs).toContain(expectedHref);
    }
    expect(englishHrefs.every((href) => href === null || !/[^\x00-\x7f]/.test(href))).toBe(true);
    expect(chineseHrefs.every((href) => href === null || !/[^\x00-\x7f]/.test(href))).toBe(true);
  });

  test('exposes bilingual routes, metadata, Article and FAQ schema behavior', () => {
    expect(getBlogPostPath('en', SLUG)).toBe('/blog/dnd-halfling');
    expect(getBlogPostPath('zh', SLUG)).toBe('/zh/blog/dnd-halfling');

    const expectedLanguages = {
      'x-default': '/blog/dnd-halfling',
      'en-US': '/blog/dnd-halfling',
      'zh-CN': '/zh/blog/dnd-halfling',
    };
    expect(createBlogPostMetadata('en', SLUG)).toMatchObject({
      title: ENGLISH_TITLE,
      description: ENGLISH_DESCRIPTION,
      alternates: {
        canonical: '/blog/dnd-halfling',
        languages: expectedLanguages,
      },
      openGraph: {
        title: `${ENGLISH_TITLE} | Token Maker`,
        description: ENGLISH_DESCRIPTION,
        type: 'article',
        images: [{ url: `https://www.tokenmaker.one${DND_HALFLING_COVER_PATH}` }],
      },
      twitter: {
        card: 'summary_large_image',
        images: [`https://www.tokenmaker.one${DND_HALFLING_COVER_PATH}`],
      },
    });
    expect(createBlogPostMetadata('zh', SLUG)).toMatchObject({
      title: CHINESE_TITLE,
      description: CHINESE_DESCRIPTION,
      alternates: {
        canonical: '/zh/blog/dnd-halfling',
        languages: expectedLanguages,
      },
      openGraph: {
        title: `${CHINESE_TITLE} | Token Maker`,
        description: CHINESE_DESCRIPTION,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
      },
    });

    expect(buildBlogPostStructuredData('en', SLUG)).toMatchObject({
      '@type': 'Article',
      headline: ENGLISH_TITLE,
      description: ENGLISH_DESCRIPTION,
      datePublished: UPDATED_AT,
      dateModified: UPDATED_AT,
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-halfling',
      image: [`https://www.tokenmaker.one${DND_HALFLING_COVER_PATH}`],
    });
    expect(buildBlogPostStructuredData('zh', SLUG)).toMatchObject({
      '@type': 'Article',
      headline: CHINESE_TITLE,
      description: CHINESE_DESCRIPTION,
      datePublished: UPDATED_AT,
      dateModified: UPDATED_AT,
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-halfling',
      image: [`https://www.tokenmaker.one${DND_HALFLING_COVER_PATH}`],
    });
    expect(buildBlogPostFaqStructuredData('en', SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', SLUG)).toBeNull();
  });

  test('integrates sitemap, pagination, public assets, and llms discovery', () => {
    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-halfling',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-halfling',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-halfling',
    };
    for (const url of [
      'https://www.tokenmaker.one/blog/dnd-halfling',
      'https://www.tokenmaker.one/zh/blog/dnd-halfling',
    ]) {
      expect(getSitemapEntry(url)).toMatchObject({
        lastModified: new Date(UPDATED_AT),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: expectedAlternates },
      });
    }

    for (const locale of ['en', 'zh'] as const) {
      expect(getBlogPageCount(locale)).toBe(7);
      expect([1, 2, 3, 4, 5, 6, 7].map((page) => getBlogPostsForPage(locale, page).length)).toEqual(
        [10, 10, 10, 10, 10, 10, 6],
      );
      expect(getBlogPostsForPage(locale, 1)[0]?.slug).toBe(SLUG);
    }

    const assetPaths = [DND_HALFLING_COVER_PATH, ...EN_INLINE_PATHS, ...ZH_INLINE_PATHS];
    for (const assetPath of new Set(assetPaths)) {
      expect(existsSync(`public${assetPath}`)).toBe(true);
      expectWebpAsset(assetPath);
    }

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-halfling');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-halfling');
  });
});
