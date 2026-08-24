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

const DND_CHARACTER_SHEET_SLUG = 'dnd-character-sheet';
const COVER_PATH = '/blog/covers/en/dnd-character-sheet-guide.webp';
const INLINE_IMAGE_PATH =
  '/blog/inline/dnd-character-sheet/dnd-character-sheet-2014-vs-2024-forms.webp';
const VIDEO_PLACEHOLDER_PATH =
  '/blog/inline/dnd-character-sheet/dnd-character-sheet-video-placeholder.webp';

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

function decodeHtmlEntities(value: string) {
  return new DOMParser().parseFromString(value, 'text/html').documentElement.textContent ?? value;
}

function expectVisibleFaqItems(
  bodyHtml: string,
  faqItems: ReadonlyArray<{ question: string; answer: string }>,
) {
  const visibleText = getVisibleBodyRoot(bodyHtml).textContent ?? '';

  for (const { question, answer } of faqItems) {
    expect(visibleText).toContain(decodeHtmlEntities(question));
    expect(visibleText).toContain(decodeHtmlEntities(answer));
  }
}

function getSitemapEntry(url: string) {
  const entry = sitemap().find((candidate) => candidate.url === url);

  if (!entry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return entry;
}

describe('dnd character sheet blog post', () => {
  test('publishes a 2024-first bilingual character-sheet fill-order guide', () => {
    const englishPost = getBlogPost('en', DND_CHARACTER_SHEET_SLUG);
    const chinesePost = getBlogPost('zh', DND_CHARACTER_SHEET_SLUG);

    expect(englishPost?.title).toBe(
      'Fill a DnD Character Sheet in Creation Order, Not Top Down',
    );
    expect(englishPost?.updatedAt).toBe('2026-08-24');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.bodyHtml).toContain('Pick the official sheet that matches the table');
    expect(englishPost?.bodyHtml).toContain('Fill the sheet in 2024 creation order, not top to bottom');
    expect(englishPost?.bodyHtml).toContain('Work through a level 1 Human Acolyte Cleric');
    expect(englishPost?.bodyHtml).toContain(INLINE_IMAGE_PATH);
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).toContain('data-video-id="IVAJrYOOtwI"');
    expect(englishPost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(getVisibleEnglishWordCount(englishPost?.bodyHtml ?? '')).toBeGreaterThanOrEqual(2_000);
    expect(englishPost?.faqItems).toHaveLength(8);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('DND 角色卡：按创角顺序填写，不要从上往下填');
    expect(chinesePost?.seoTitle).toBe('DND 角色卡：按创角顺序填写，不要从上往下填');
    expect(chinesePost?.title).not.toMatch(/character sheet/i);
    expect(chinesePost?.seoTitle).not.toMatch(/character sheet/i);
    expect(chinesePost?.metaDescription).not.toMatch(/character sheet/i);
    expect(chinesePost?.excerpt).not.toMatch(/character sheet/i);
    expect(chinesePost?.updatedAt).toBe('2026-08-24');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.bodyHtml).toContain('先选对和桌面年份匹配的官方角色卡');
    expect(chinesePost?.bodyHtml).toContain('按 2024 创角顺序填，不要从上往下填');
    expect(chinesePost?.bodyHtml).toContain('用 1 级人类侍僧牧师走一遍');
    expect(chinesePost?.bodyHtml).toContain(INLINE_IMAGE_PATH);
    expect(chinesePost?.bodyHtml).toContain('data-video-id="IVAJrYOOtwI"');
    expect(chinesePost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toHaveLength(8);
    expectVisibleFaqItems(chinesePost?.bodyHtml ?? '', chinesePost?.faqItems ?? []);
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_CHARACTER_SHEET_SLUG);
    const chinesePost = getBlogPost('zh', DND_CHARACTER_SHEET_SLUG);

    expect(getBlogPostPath('en', DND_CHARACTER_SHEET_SLUG)).toBe('/blog/dnd-character-sheet');
    expect(getBlogPostPath('zh', DND_CHARACTER_SHEET_SLUG)).toBe('/zh/blog/dnd-character-sheet');
    expect(createBlogPostMetadata('en', DND_CHARACTER_SHEET_SLUG)).toMatchObject({
      title: 'Fill a DnD Character Sheet in Creation Order, Not Top Down',
      description:
        'Start with class, origin, and ability scores, then complete combat and spell boxes so session one is not a scavenger hunt across empty fields.',
      alternates: {
        canonical: '/blog/dnd-character-sheet',
        languages: {
          'x-default': '/blog/dnd-character-sheet',
          'en-US': '/blog/dnd-character-sheet',
          'zh-CN': '/zh/blog/dnd-character-sheet',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_CHARACTER_SHEET_SLUG)).toMatchObject({
      title: 'DND 角色卡：按创角顺序填写，不要从上往下填',
      description:
        '先填职业、出身和属性值，再把护甲等级、生命值、先攻、攻击加值和法术栏算完。第一次开团就不用在空格子里到处找数字；2014 可填表和 2024 打印表要按桌面年份选对。',
      alternates: {
        canonical: '/zh/blog/dnd-character-sheet',
        languages: {
          'x-default': '/blog/dnd-character-sheet',
          'en-US': '/blog/dnd-character-sheet',
          'zh-CN': '/zh/blog/dnd-character-sheet',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_CHARACTER_SHEET_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-24',
      dateModified: '2026-08-24',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-character-sheet',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-character-sheet-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_CHARACTER_SHEET_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-24',
      dateModified: '2026-08-24',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-character-sheet',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-character-sheet-guide.webp'],
    });
    for (const [locale, post] of [
      ['en', englishPost],
      ['zh', chinesePost],
    ] as const) {
      const faqSchema = buildBlogPostFaqStructuredData(locale, DND_CHARACTER_SHEET_SLUG);

      expect(faqSchema).toMatchObject({ '@type': 'FAQPage' });
      expect(
        faqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
          question: name,
          answer: acceptedAnswer.text,
        })),
      ).toEqual(post?.faqItems);
    }

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-character-sheet',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-character-sheet',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-character-sheet',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-character-sheet')).toMatchObject({
      lastModified: new Date('2026-08-24'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(
      getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-character-sheet'),
    ).toMatchObject({
      lastModified: new Date('2026-08-24'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${INLINE_IMAGE_PATH}`)).toBe(true);
    expect(existsSync(`public${VIDEO_PLACEHOLDER_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-character-sheet');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-character-sheet');
  });
});
