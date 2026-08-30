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
const INLINE_PATH = '/blog/inline/dnd-backgrounds/dnd-backgrounds-selection-flow.webp';
const VIDEO_PLACEHOLDER_PATH =
  '/blog/inline/dnd-backgrounds/dnd-backgrounds-video-placeholder.webp';
const VIDEO_ID = 'vyg5jJrZ42s';

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

describe('dnd backgrounds blog post', () => {
  test('publishes a bilingual origin guide without overwriting sibling creation pages', () => {
    const englishPost = getBlogPost('en', DND_BACKGROUNDS_SLUG);
    const chinesePost = getBlogPost('zh', DND_BACKGROUNDS_SLUG);
    const characterSheetPost = getBlogPost('en', 'dnd-character-sheet');
    const racesPost = getBlogPost('en', 'dnd-races');

    expect(englishPost?.title).toBe('DnD Backgrounds: Which Origin Fits the Year You Play?');
    expect(englishPost?.seoTitle).toBe('DnD Backgrounds: Check 2014 or 2024 Before You Pick');
    expect(englishPost?.metaDescription).toBe(
      'Start with the table year. Then pick a 2014 feature or a 2024 Origin feat, scores, and skills so the background matches the character sheet.',
    );
    expect(englishPost?.updatedAt).toBe('2026-08-26');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.bodyHtml).toContain('Start with the rulebook year');
    expect(englishPost?.bodyHtml).toContain('The sixteen 2024 Player');
    expect(englishPost?.bodyHtml).toContain(INLINE_PATH);
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).toContain(`data-video-id="${VIDEO_ID}"`);
    expect(englishPost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(englishPost?.bodyHtml).toContain('class="inline-embed inline-embed--video lite-video"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(getVisibleEnglishWordCount(englishPost?.bodyHtml ?? '')).toBeGreaterThanOrEqual(2_000);
    expect(getVisibleEnglishWordCount(englishPost?.bodyHtml ?? '')).toBeLessThanOrEqual(2_100);
    expect(englishPost?.faqItems).toHaveLength(6);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('DND 5E 背景怎么选：先定规则版本，再把过去写进冒险');
    expect(chinesePost?.seoTitle).toBe(
      'DND 5E 背景不是职业附属：先分清 2014 与 2024，再补齐技能、专长和能推动冒险的完整过去',
    );
    expect(chinesePost?.title).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.seoTitle).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.excerpt).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.metaDescription).not.toMatch(/dnd backgrounds/i);
    expect(chinesePost?.updatedAt).toBe('2026-08-26');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.bodyHtml).toContain('先分清：你玩的是 2014 还是 2024 规则');
    expect(chinesePost?.bodyHtml).toContain('常见问题');
    expect(chinesePost?.bodyHtml).toContain(INLINE_PATH);
    expect(chinesePost?.bodyHtml).toContain(`data-video-id="${VIDEO_ID}"`);
    expect(chinesePost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(getVisibleChineseCharacterCount(chinesePost?.bodyHtml ?? '')).toBeGreaterThanOrEqual(
      2_000,
    );
    expect(getVisibleChineseCharacterCount(chinesePost?.bodyHtml ?? '')).toBeLessThanOrEqual(2_100);
    expect(chinesePost?.faqItems).toHaveLength(5);
    expectVisibleFaqItems(chinesePost?.bodyHtml ?? '', chinesePost?.faqItems ?? []);
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(characterSheetPost?.slug).toBe('dnd-character-sheet');
    expect(racesPost?.slug).toBe('dnd-races');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_BACKGROUNDS_SLUG);
    const chinesePost = getBlogPost('zh', DND_BACKGROUNDS_SLUG);

    expect(getBlogPostPath('en', DND_BACKGROUNDS_SLUG)).toBe('/blog/dnd-backgrounds');
    expect(getBlogPostPath('zh', DND_BACKGROUNDS_SLUG)).toBe('/zh/blog/dnd-backgrounds');
    expect(createBlogPostMetadata('en', DND_BACKGROUNDS_SLUG)).toMatchObject({
      title: 'DnD Backgrounds: Check 2014 or 2024 Before You Pick',
      description:
        'Start with the table year. Then pick a 2014 feature or a 2024 Origin feat, scores, and skills so the background matches the character sheet.',
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
      title:
        'DND 5E 背景不是职业附属：先分清 2014 与 2024，再补齐技能、专长和能推动冒险的完整过去',
      description:
        '先确认你的团使用 2014 还是 2024 规则，再按技能缺口、起源专长与角色动机选择 DND 5E 背景。本文给出对照表、五步筛选法、自定义边界和可直接套用的故事问题，帮助你完成既符合规则、又会在战役里持续发挥作用的角色过去，并用两种示例说明怎样与 DM 快速确认。',
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
      dateModified: '2026-08-26',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-backgrounds',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-backgrounds-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_BACKGROUNDS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-26',
      dateModified: '2026-08-26',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-backgrounds',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-backgrounds-guide.webp'],
    });
    for (const [locale, post] of [
      ['en', englishPost],
      ['zh', chinesePost],
    ] as const) {
      const faqSchema = buildBlogPostFaqStructuredData(locale, DND_BACKGROUNDS_SLUG);

      expect(faqSchema).toMatchObject({ '@type': 'FAQPage' });
      expect(
        faqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
          question: name,
          answer: acceptedAnswer.text,
        })),
      ).toEqual(post?.faqItems);
    }

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-backgrounds',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-backgrounds',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-backgrounds',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-backgrounds')).toMatchObject({
      lastModified: new Date('2026-08-26'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-backgrounds')).toMatchObject({
      lastModified: new Date('2026-08-26'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${INLINE_PATH}`)).toBe(true);
    expect(existsSync(`public${VIDEO_PLACEHOLDER_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-backgrounds');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-backgrounds');
  });
});
