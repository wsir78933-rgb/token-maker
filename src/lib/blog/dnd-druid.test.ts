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

const DND_DRUID_SLUG = 'dnd-druid';
const COVER_PATH = '/blog/covers/en/dnd-druid-guide.webp';
const INLINE_PATH = '/blog/inline/dnd-druid/druid-turn-plan.webp';
const VIDEO_PLACEHOLDER_PATH = '/blog/inline/dnd-druid/dnd-druid-video-placeholder.webp';
const VIDEO_ID = 'WMo_gCRMSfA';

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

describe('dnd druid blog post', () => {
  test('publishes a bilingual class guide without overwriting the spells sibling or backgrounds', () => {
    const englishPost = getBlogPost('en', DND_DRUID_SLUG);
    const chinesePost = getBlogPost('zh', DND_DRUID_SLUG);
    const spellsPost = getBlogPost('en', 'dnd-druid-spells');
    const backgroundsPost = getBlogPost('en', 'dnd-backgrounds');

    expect(englishPost?.title).toBe(
      'DnD Druid: Build a Level 1 Caster, Then Unlock Wild Shape at Level 2',
    );
    expect(englishPost?.seoTitle).toBe('DnD Druid: Level 1 Is Spells; Wild Shape Starts at 2');
    expect(englishPost?.metaDescription).toBe(
      'Confirm the table year, finish a level 1 Druid sheet around Wisdom and prepared spells, and keep Wild Shape off the first combat round.',
    );
    expect(englishPost?.updatedAt).toBe('2026-08-28');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.bodyHtml).toContain('Decide whether Druid fits this table');
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
      expect(decodeHtmlEntities(englishPost?.bodyHtml ?? '')).toContain(faqItem.answer);
    }

    expect(chinesePost?.title).toBe('DND 德鲁伊指南：先定职责，再准备法术与荒野变形');
    expect(chinesePost?.seoTitle).toBe(
      'DND 德鲁伊完整指南：1级建卡、感知、准备法术、荒野变形、新手回合计划与2014/2024规则差异',
    );
    expect(chinesePost?.updatedAt).toBe('2026-08-28');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.bodyHtml).toContain('先看 2024 DND 德鲁伊的骨架');
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

    expect(spellsPost?.slug).toBe('dnd-druid-spells');
    expect(backgroundsPost?.slug).toBe('dnd-backgrounds');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_DRUID_SLUG);
    const chinesePost = getBlogPost('zh', DND_DRUID_SLUG);

    expect(getBlogPostPath('en', DND_DRUID_SLUG)).toBe('/blog/dnd-druid');
    expect(getBlogPostPath('zh', DND_DRUID_SLUG)).toBe('/zh/blog/dnd-druid');
    expect(createBlogPostMetadata('en', DND_DRUID_SLUG)).toMatchObject({
      title: 'DnD Druid: Level 1 Is Spells; Wild Shape Starts at 2',
      description:
        'Confirm the table year, finish a level 1 Druid sheet around Wisdom and prepared spells, and keep Wild Shape off the first combat round.',
      alternates: {
        canonical: '/blog/dnd-druid',
        languages: {
          'x-default': '/blog/dnd-druid',
          'en-US': '/blog/dnd-druid',
          'zh-CN': '/zh/blog/dnd-druid',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_DRUID_SLUG)).toMatchObject({
      title: 'DND 德鲁伊完整指南：1级建卡、感知、准备法术、荒野变形、新手回合计划与2014/2024规则差异',
      description:
        '面向第一次接触 DND 德鲁伊的中文职业指南，按规则版本、队伍职责、感知与体质、Primal Order、准备法术和荒野变形完成 1 级建卡，并用短表对照 2014 与 2024 的动作、恢复、形态和生命值规则，再给出开战前专注、第一回合与常见错误的可执行清单。',
      alternates: {
        canonical: '/zh/blog/dnd-druid',
        languages: {
          'x-default': '/blog/dnd-druid',
          'en-US': '/blog/dnd-druid',
          'zh-CN': '/zh/blog/dnd-druid',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_DRUID_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-28',
      dateModified: '2026-08-28',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-druid',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-druid-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_DRUID_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-28',
      dateModified: '2026-08-28',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-druid',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-druid-guide.webp'],
    });
    for (const [locale, post] of [
      ['en', englishPost],
      ['zh', chinesePost],
    ] as const) {
      const faqSchema = buildBlogPostFaqStructuredData(locale, DND_DRUID_SLUG);

      expect(faqSchema).toMatchObject({ '@type': 'FAQPage' });
      expect(
        faqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
          question: name,
          answer: acceptedAnswer.text,
        })),
      ).toEqual(post?.faqItems);
    }

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-druid',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-druid',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-druid',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-druid')).toMatchObject({
      lastModified: new Date('2026-08-28'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-druid')).toMatchObject({
      lastModified: new Date('2026-08-28'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${INLINE_PATH}`)).toBe(true);
    expect(existsSync(`public${VIDEO_PLACEHOLDER_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-druid');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-druid');
  });
});
