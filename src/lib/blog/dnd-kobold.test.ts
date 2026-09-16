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

const DND_KOBOLD_SLUG = 'dnd-kobold';
const COVER_PATH = '/blog/covers/en/dnd-kobold-guide.webp';
const ZH_COVER_PATH = '/blog/covers/en/dnd-kobold-zh-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/dnd-kobold/kobold-lock-2014-2024.webp',
  '/blog/inline/dnd-kobold/kobold-pack-tactics-grid.webp',
  '/blog/inline/dnd-kobold/kobold-snout-crop.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/dnd-kobold/kobold-identify-zh.webp',
  '/blog/inline/dnd-kobold/kobold-lock-zh.webp',
  '/blog/inline/dnd-kobold/kobold-axes-zh.webp',
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

describe('dnd kobold blog post', () => {
  test('publishes a bilingual monster guide without overwriting sibling slugs', () => {
    const englishPost = getBlogPost('en', DND_KOBOLD_SLUG);
    const chinesePost = getBlogPost('zh', DND_KOBOLD_SLUG);
    const kenkuPost = getBlogPost('en', 'dnd-kenku');
    const racesPost = getBlogPost('en', 'dnd-races');
    const dragonbornPost = getBlogPost('en', 'dnd-dragonborn');

    expect(englishPost?.title).toBe('Matching CR 1/8 Does Not Make One DnD Kobold');
    expect(englishPost?.seoTitle).toBe('Matching CR 1/8 Does Not Make One DnD Kobold');
    expect(englishPost?.metaDescription).toBe(
      "Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only.",
    );
    expect(englishPost?.updatedAt).toBe('2026-09-16');
    expect(englishPost?.publishedAt).toBe('2026-09-16');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Monster Guide');
    expect(englishPost?.bodyHtml).toContain('Lock 2014 Kobold or 2024 Kobold Warrior');
    expect(englishPost?.bodyHtml).toContain('FAQ about dnd kobold');
    for (const inlinePath of EN_INLINE_PATHS) {
      expect(englishPost?.bodyHtml).toContain(inlinePath);
    }
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('decoding="async"');
    expect(englishPost?.bodyHtml).not.toContain('fetchpriority=');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('lite-video');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).not.toContain('role="button" tabindex="0"');
    expect(englishPost?.faqItems).toHaveLength(4);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);
    expect(englishPost?.headings?.map((heading) => heading.text)).toEqual(
      expect.arrayContaining([
        '2014 — Small Humanoid, Lawful Evil',
        '2024 — Small Dragon, Neutral, renamed Warrior',
        'Failure branches — recrop',
      ]),
    );
    expect(englishPost?.headings?.some((heading) => heading.text.includes('&mdash;'))).toBe(false);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(faqItem.answer).not.toMatch(/<[a-z][^>]*>/i);
    }

    expect(chinesePost?.title).toBe('DND 狗头人不能同时抄瓦罗和魔邓肯');
    expect(chinesePost?.seoTitle).toBe('DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯');
    expect(chinesePost?.updatedAt).toBe('2026-09-16');
    expect(chinesePost?.coverImage).toBe(ZH_COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('种族百科');
    expect(chinesePost?.bodyHtml).toContain('要写卡就先锁：瓦罗还是魔邓肯');
    expect(chinesePost?.bodyHtml).not.toContain('常见问题');
    expect(chinesePost?.bodyHtml).not.toContain('FAQ about dnd kobold');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    expect(kenkuPost?.slug).toBe('dnd-kenku');
    expect(racesPost?.slug).toBe('dnd-races');
    expect(dragonbornPost?.slug).toBe('dnd-dragonborn');
    expect(racesPost?.bodyHtml).not.toContain('dnd-kobold');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_KOBOLD_SLUG);
    const chinesePost = getBlogPost('zh', DND_KOBOLD_SLUG);

    expect(getBlogPostPath('en', DND_KOBOLD_SLUG)).toBe('/blog/dnd-kobold');
    expect(getBlogPostPath('zh', DND_KOBOLD_SLUG)).toBe('/zh/blog/dnd-kobold');
    expect(createBlogPostMetadata('en', DND_KOBOLD_SLUG)).toMatchObject({
      title: 'Matching CR 1/8 Does Not Make One DnD Kobold',
      description:
        "Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only.",
      alternates: {
        canonical: '/blog/dnd-kobold',
        languages: {
          'x-default': '/blog/dnd-kobold',
          'en-US': '/blog/dnd-kobold',
          'zh-CN': '/zh/blog/dnd-kobold',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_KOBOLD_SLUG)).toMatchObject({
      title: 'DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯',
      description:
        'DND 狗头人（Kobold）是带鳞、小角的小龙类人。写卡只锁瓦罗或魔邓肯其中一页；摇尾乞怜不要叠龙吼。',
      alternates: {
        canonical: '/zh/blog/dnd-kobold',
        languages: {
          'x-default': '/blog/dnd-kobold',
          'en-US': '/blog/dnd-kobold',
          'zh-CN': '/zh/blog/dnd-kobold',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_KOBOLD_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-16',
      dateModified: '2026-09-16',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-kobold',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-kobold-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_KOBOLD_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-16',
      dateModified: '2026-09-16',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-kobold',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-kobold-zh-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', DND_KOBOLD_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    expect(buildBlogPostFaqStructuredData('zh', DND_KOBOLD_SLUG)).toBeNull();
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-kobold',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-kobold',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-kobold',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-kobold')).toMatchObject({
      lastModified: new Date('2026-09-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-kobold')).toMatchObject({
      lastModified: new Date('2026-09-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${ZH_COVER_PATH}`)).toBe(true);
    for (const inlinePath of [...EN_INLINE_PATHS, ...ZH_INLINE_PATHS]) {
      expect(existsSync(`public${inlinePath}`)).toBe(true);
    }

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-kobold');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-kobold');
  });
});
