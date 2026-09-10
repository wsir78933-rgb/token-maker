// @vitest-environment jsdom

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from './index';

const DND_BACKGROUNDS_SLUG = 'dnd-backgrounds';
const COVER_PATH = '/blog/covers/en/dnd-backgrounds-guide.webp';
const ENGLISH_PAGE_H1 = 'Confirm the Rules Year Before You Copy a D&D 5e Background';
const ENGLISH_SEO_TITLE = 'DnD 5e Backgrounds: Confirm the Year, Then Copy Fields';
const ENGLISH_META_DESCRIPTION =
  "Confirm 2014 or 2024, then copy that year's skills, feature or Origin feat, and equipment. Convert older backgrounds without stacking bonuses. Token Maker is optional after the sheet.";
const CHINESE_PAGE_H1 = 'DND 5E 背景：先分清你在找什么，再按年份抄进角色卡';
const CHINESE_SEO_TITLE = 'DND 5E 背景怎么选：先问年份，再按那一年抄进角色卡';
const CHINESE_META_DESCRIPTION =
  '先分清规则栏、身世和壁纸，再问清桌上是 2014 还是 2024，按那年抄技能、特性或起源专长。旧书进新桌不要两套加值叠在一起。出身选定后，Token Maker 只做可选地图标记。';
const ENGLISH_PUBLIC_REFERENCE_URLS = [
  'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background',
  'https://www.dndbeyond.com/sources/dnd/br-2024/character-origins',
  'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character',
  'https://www.dndbeyond.com/sources/dnd/br-2024/feats',
  'https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024',
  'https://www.dndbeyond.com/backgrounds',
  'https://www.tokenmaker.one/',
  'https://www.tokenmaker.one/templates/square-token-maker',
] as const;
const CHINESE_PUBLIC_REFERENCE_URLS = [
  'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background',
  'https://www.dndbeyond.com/sources/dnd/br-2024/character-origins',
  'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character',
  'https://www.dndbeyond.com/sources/dnd/br-2024/feats',
  'https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024',
  'https://www.dndbeyond.com/backgrounds',
  'https://www.tokenmaker.one/zh',
  'https://www.tokenmaker.one/zh/faq',
  'https://www.tokenmaker.one/zh/templates/square-token-maker',
] as const;

function getVisibleBodyRoot(bodyHtml: string) {
  const body = new DOMParser().parseFromString(bodyHtml, 'text/html').body;

  body
    .querySelectorAll(
      'script, style, template, noscript, [hidden], [aria-hidden="true"], .sr-only',
    )
    .forEach((element) => element.remove());

  return body;
}

function getVisibleEnglishWordCount(bodyHtml: string) {
  return (
    getVisibleBodyRoot(bodyHtml).textContent?.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []
  ).length;
}

function getVisibleChineseCharacterCount(bodyHtml: string) {
  return (
    getVisibleBodyRoot(bodyHtml).textContent?.match(/[\u4e00-\u9fff\uff0c\u3002]/gu) ?? []
  ).length;
}

function getSitemapEntry(url: string) {
  const entry = sitemap().find((candidate) => candidate.url === url);

  if (!entry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return entry;
}

function expectEmptyFaq(post: ReturnType<typeof getBlogPost>, locale: 'en' | 'zh') {
  expect(post?.faqItems === undefined || post.faqItems.length === 0).toBe(true);
  expect(buildBlogPostFaqStructuredData(locale, DND_BACKGROUNDS_SLUG)).toBeNull();
}

describe('dnd backgrounds blog post', () => {
  test('publishes locked bilingual origin copy on the existing slug', () => {
    const englishPost = getBlogPost('en', DND_BACKGROUNDS_SLUG);
    const chinesePost = getBlogPost('zh', DND_BACKGROUNDS_SLUG);
    const characterSheetPost = getBlogPost('en', 'dnd-character-sheet');
    const racesPost = getBlogPost('en', 'dnd-races');

    expect(englishPost?.title).toBe(ENGLISH_PAGE_H1);
    expect(englishPost?.seoTitle).toBe(ENGLISH_SEO_TITLE);
    expect(englishPost?.metaDescription).toBe(ENGLISH_META_DESCRIPTION);
    expect(englishPost?.publishedAt).toBe('2026-08-26');
    expect(englishPost?.updatedAt).toBe('2026-09-10');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.bodyHtml).not.toMatch(/<h1\b/i);
    expect(englishPost?.bodyHtml).toContain('Match the background entry to your table');
    expect(englishPost?.bodyHtml).toContain(
      'Choose a D&amp;D background by first asking your Dungeon Master',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Under the 2014 background rules, receiving the same proficiency from two sources lets you choose another of the same kind: a skill replaces a skill, and a tool replaces a tool.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Standard Sage offers Constitution, Intelligence, and Wisdom.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'When using a species from an older book, ignore its ability-score increases and use the background increases.',
    );
    expect(englishPost?.bodyHtml).toContain(
      "The 2024 Player's Handbook contains sixteen backgrounds, as identified in the official overview.",
    );
    expect(englishPost?.bodyHtml).toContain(
      'In the empty editor, Add Text and Download PNG are disabled.',
    );
    expect(englishPost?.bodyHtml).not.toContain('Start with the rulebook year');
    expect(englishPost?.bodyHtml).not.toContain("The sixteen 2024 Player's Handbook backgrounds");
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).not.toContain('/blog/inline/dnd-backgrounds/');
    for (const publicReferenceUrl of ENGLISH_PUBLIC_REFERENCE_URLS) {
      expect(englishPost?.bodyHtml).toContain(`href="${publicReferenceUrl}"`);
    }
    expect(getVisibleEnglishWordCount(englishPost?.bodyHtml ?? '')).toBeGreaterThanOrEqual(2_000);
    expectEmptyFaq(englishPost, 'en');

    expect(chinesePost?.title).toBe(CHINESE_PAGE_H1);
    expect(chinesePost?.seoTitle).toBe(CHINESE_SEO_TITLE);
    expect(chinesePost?.metaDescription).toBe(CHINESE_META_DESCRIPTION);
    expect(chinesePost?.title).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.seoTitle).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.excerpt).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.metaDescription).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.publishedAt).toBe('2026-08-26');
    expect(chinesePost?.updatedAt).toBe('2026-09-10');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.bodyHtml).not.toMatch(/<h1\b/i);
    expect(chinesePost?.bodyHtml).toContain('先切开三种「背景」：规则栏、身世故事、壁纸');
    expect(chinesePost?.bodyHtml).toContain(
      '发生了什么变化？为什么你不再过背景所描述的那种生活？',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '每个背景给两项技能熟练；多数还给出一种或多种工具熟练',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '一项 +2、另一项 +1，或三项各 +1；任何一项不能因此超过 20',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '来源为 Player’s Handbook 且带 Feat: 的条目也能对上这十六个名字',
    );
    expect(chinesePost?.bodyHtml).toContain('支持 10MB 内 JPG、PNG、WEBP');
    expect(chinesePost?.bodyHtml).not.toContain('五步筛选法');
    expect(chinesePost?.bodyHtml).not.toContain('最强背景');
    expect(chinesePost?.bodyHtml).not.toMatch(/<h2\b[^>]*>常见问题/);
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.bodyHtml).not.toContain('/blog/inline/dnd-backgrounds/');
    for (const publicReferenceUrl of CHINESE_PUBLIC_REFERENCE_URLS) {
      expect(chinesePost?.bodyHtml).toContain(`href="${publicReferenceUrl}"`);
    }
    expect(getVisibleChineseCharacterCount(chinesePost?.bodyHtml ?? '')).toBeGreaterThanOrEqual(
      2_000,
    );
    expectEmptyFaq(chinesePost, 'zh');

    expect(characterSheetPost?.slug).toBe('dnd-character-sheet');
    expect(racesPost?.slug).toBe('dnd-races');
  });

  test('exposes locked metadata, schemas, sitemap routes, cover, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_BACKGROUNDS_SLUG)).toBe('/blog/dnd-backgrounds');
    expect(getBlogPostPath('zh', DND_BACKGROUNDS_SLUG)).toBe('/zh/blog/dnd-backgrounds');
    expect(createBlogPostMetadata('en', DND_BACKGROUNDS_SLUG)).toMatchObject({
      title: ENGLISH_SEO_TITLE,
      description: ENGLISH_META_DESCRIPTION,
      alternates: {
        canonical: '/blog/dnd-backgrounds',
        languages: {
          'x-default': '/blog/dnd-backgrounds',
          'en-US': '/blog/dnd-backgrounds',
          'zh-CN': '/zh/blog/dnd-backgrounds',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_BACKGROUNDS_SLUG)).toMatchObject({
      title: CHINESE_SEO_TITLE,
      description: CHINESE_META_DESCRIPTION,
      alternates: {
        canonical: '/zh/blog/dnd-backgrounds',
        languages: {
          'x-default': '/blog/dnd-backgrounds',
          'en-US': '/blog/dnd-backgrounds',
          'zh-CN': '/zh/blog/dnd-backgrounds',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_BACKGROUNDS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-26',
      dateModified: '2026-09-10',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-backgrounds',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-backgrounds-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_BACKGROUNDS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-26',
      dateModified: '2026-09-10',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-backgrounds',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-backgrounds-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_BACKGROUNDS_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_BACKGROUNDS_SLUG)).toBeNull();

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-backgrounds',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-backgrounds',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-backgrounds',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-backgrounds')).toMatchObject({
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-backgrounds')).toMatchObject({
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-backgrounds');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-backgrounds');
  });
});
