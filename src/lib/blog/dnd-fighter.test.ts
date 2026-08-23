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

const DND_FIGHTER_SLUG = 'dnd-fighter';
const COVER_PATH = '/blog/covers/en/dnd-fighter-guide.webp';
const INLINE_IMAGE_PATH = '/blog/inline/dnd-fighter/fighter-turn-plan.webp';

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

function expectVisibleFaqItems(
  bodyHtml: string,
  faqItems: ReadonlyArray<{ question: string; answer: string }>,
) {
  const visibleText = getVisibleBodyRoot(bodyHtml).textContent ?? '';

  for (const { question, answer } of faqItems) {
    expect(visibleText).toContain(question);
    expect(visibleText).toContain(answer);
  }
}

function getSitemapEntry(url: string) {
  const entry = sitemap().find((candidate) => candidate.url === url);

  if (!entry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return entry;
}

describe('dnd fighter blog post', () => {
  test('publishes a 2024-first bilingual level 1 and combat-turn guide', () => {
    const englishPost = getBlogPost('en', DND_FIGHTER_SLUG);
    const chinesePost = getBlogPost('zh', DND_FIGHTER_SLUG);

    expect(englishPost?.title).toBe(
      'DnD Fighter Guide: Build a Level 1 Fighter and Plan Every Turn',
    );
    expect(englishPost?.updatedAt).toBe('2026-08-23');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.bodyHtml).toContain('Choose Strength or Dexterity before choosing gear');
    expect(englishPost?.bodyHtml).toContain('Use a five-question Fighter turn plan');
    expect(englishPost?.bodyHtml).toContain('Keep 2014 and 2024 Fighter rules separate');
    expect(englishPost?.bodyHtml).toContain(INLINE_IMAGE_PATH);
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(getVisibleEnglishWordCount(englishPost?.bodyHtml ?? '')).toBeGreaterThanOrEqual(2_000);
    expect(englishPost?.faqItems).toHaveLength(6);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);

    expect(chinesePost?.title).toBe('DND 战士指南：从 1 级建卡到每回合行动计划');
    expect(chinesePost?.seoTitle).toBe('DND 战士指南：力量还是敏捷？先把路线选对');
    expect(chinesePost?.title).not.toContain('Fighter');
    expect(chinesePost?.metaDescription).not.toContain('Fighter');
    expect(chinesePost?.excerpt).not.toContain('Fighter');
    expect(chinesePost?.updatedAt).toBe('2026-08-23');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.bodyHtml).toContain('先选力量还是敏捷，再决定装备');
    expect(chinesePost?.bodyHtml).toContain('每回合先问自己五个问题');
    expect(chinesePost?.bodyHtml).toContain('不要混用 2014 与 2024 战士规则');
    expect(chinesePost?.bodyHtml).toContain(INLINE_IMAGE_PATH);
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toHaveLength(6);
    expectVisibleFaqItems(chinesePost?.bodyHtml ?? '', chinesePost?.faqItems ?? []);
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_FIGHTER_SLUG);
    const chinesePost = getBlogPost('zh', DND_FIGHTER_SLUG);

    expect(getBlogPostPath('en', DND_FIGHTER_SLUG)).toBe('/blog/dnd-fighter');
    expect(getBlogPostPath('zh', DND_FIGHTER_SLUG)).toBe('/zh/blog/dnd-fighter');
    expect(createBlogPostMetadata('en', DND_FIGHTER_SLUG)).toMatchObject({
      title: 'DnD Fighter Guide: Strength or Dexterity? Choose First',
      description:
        'Compare Strength and Dexterity Fighter paths, pick armor and weapons that fit, and finish a focused 2024 character without splitting your best score.',
      alternates: {
        canonical: '/blog/dnd-fighter',
        languages: {
          'x-default': '/blog/dnd-fighter',
          'en-US': '/blog/dnd-fighter',
          'zh-CN': '/zh/blog/dnd-fighter',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_FIGHTER_SLUG)).toMatchObject({
      title: 'DND 战士指南：力量还是敏捷？先把路线选对',
      description:
        '对比力量与敏捷战士的玩法，选择合适的护甲和武器，完成一套目标明确、不浪费主要属性的 2024 版角色配置。',
      alternates: {
        canonical: '/zh/blog/dnd-fighter',
        languages: {
          'x-default': '/blog/dnd-fighter',
          'en-US': '/blog/dnd-fighter',
          'zh-CN': '/zh/blog/dnd-fighter',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_FIGHTER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-23',
      dateModified: '2026-08-23',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-fighter',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-fighter-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_FIGHTER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-23',
      dateModified: '2026-08-23',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-fighter',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-fighter-guide.webp'],
    });
    for (const [locale, post] of [
      ['en', englishPost],
      ['zh', chinesePost],
    ] as const) {
      const faqSchema = buildBlogPostFaqStructuredData(locale, DND_FIGHTER_SLUG);

      expect(faqSchema).toMatchObject({ '@type': 'FAQPage' });
      expect(
        faqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
          question: name,
          answer: acceptedAnswer.text,
        })),
      ).toEqual(post?.faqItems);
    }

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-fighter',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-fighter',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-fighter',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-fighter')).toMatchObject({
      lastModified: new Date('2026-08-23'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-fighter')).toMatchObject({
      lastModified: new Date('2026-08-23'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${INLINE_IMAGE_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-fighter');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-fighter');
  });
});
