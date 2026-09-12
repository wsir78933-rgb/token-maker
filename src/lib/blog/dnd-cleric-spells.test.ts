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

const DND_CLERIC_SPELLS_SLUG = 'dnd-cleric-spells';
const COVER_PATH = '/blog/covers/en/dnd-cleric-spells-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/dnd-cleric-spells/cleric-spell-jobs.webp',
  '/blog/inline/dnd-cleric-spells/cleric-concentration-clash.webp',
  '/blog/inline/dnd-cleric-spells/cleric-token-crop.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/dnd-cleric-spells/cleric-prepare-zh.webp',
  '/blog/inline/dnd-cleric-spells/cleric-focus-zh.webp',
  '/blog/inline/dnd-cleric-spells/cleric-token-zh.webp',
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

describe('dnd cleric spells blog post', () => {
  test('publishes a bilingual spell-prep guide without overwriting bless', () => {
    const englishPost = getBlogPost('en', DND_CLERIC_SPELLS_SLUG);
    const chinesePost = getBlogPost('zh', DND_CLERIC_SPELLS_SLUG);
    const blessPost = getBlogPost('en', 'dnd-bless');

    expect(englishPost?.title).toBe(
      'DnD Cleric Spells: The 2024 Official Four Has No Healing Word',
    );
    expect(englishPost?.seoTitle).toBe(
      'DnD Cleric Spells: The 2024 Official Four Has No Healing Word',
    );
    expect(englishPost?.metaDescription).toBe(
      'The 2024 recommended dnd cleric spells skip Healing Word. Swap Shield of Faith for the Bonus Action pickup unless another character already has that rescue.',
    );
    expect(englishPost?.updatedAt).toBe('2026-09-12');
    expect(englishPost?.publishedAt).toBe('2026-09-12');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Spell Guide');
    expect(englishPost?.bodyHtml).toContain('How Many Level 1+ Cleric Spells');
    expect(englishPost?.bodyHtml).toContain('FAQ');
    for (const inlinePath of EN_INLINE_PATHS) {
      expect(englishPost?.bodyHtml).toContain(inlinePath);
    }
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('decoding="async"');
    expect(englishPost?.bodyHtml).not.toContain('fetchpriority=');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('lite-video');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.faqItems).toHaveLength(5);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('dnd 牧师法术：2024 灵体武器要专注，不能叠祝福术');
    expect(chinesePost?.seoTitle).toBe(
      'dnd 牧师法术（Cleric）：2024 灵体武器要专注，不能叠祝福术',
    );
    expect(chinesePost?.updatedAt).toBe('2026-09-12');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('法术指南');
    expect(chinesePost?.bodyHtml).toContain('先写出明天能准备几个');
    expect(chinesePost?.bodyHtml).toContain('常见问题');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems).toHaveLength(5);
    expectVisibleFaqItems(chinesePost?.bodyHtml ?? '', chinesePost?.faqItems ?? []);
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(blessPost?.slug).toBe('dnd-bless');
    expect(blessPost?.bodyHtml).not.toContain('dnd-cleric-spells');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_CLERIC_SPELLS_SLUG);
    const chinesePost = getBlogPost('zh', DND_CLERIC_SPELLS_SLUG);

    expect(getBlogPostPath('en', DND_CLERIC_SPELLS_SLUG)).toBe('/blog/dnd-cleric-spells');
    expect(getBlogPostPath('zh', DND_CLERIC_SPELLS_SLUG)).toBe('/zh/blog/dnd-cleric-spells');
    expect(createBlogPostMetadata('en', DND_CLERIC_SPELLS_SLUG)).toMatchObject({
      title: 'DnD Cleric Spells: The 2024 Official Four Has No Healing Word',
      description:
        'The 2024 recommended dnd cleric spells skip Healing Word. Swap Shield of Faith for the Bonus Action pickup unless another character already has that rescue.',
      alternates: {
        canonical: '/blog/dnd-cleric-spells',
        languages: {
          'x-default': '/blog/dnd-cleric-spells',
          'en-US': '/blog/dnd-cleric-spells',
          'zh-CN': '/zh/blog/dnd-cleric-spells',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_CLERIC_SPELLS_SLUG)).toMatchObject({
      title: 'dnd 牧师法术（Cleric）：2024 灵体武器要专注，不能叠祝福术',
      description:
        '2024 的 dnd 牧师法术里，灵体武器要专注，不能再和祝福术或灵体卫士叠开。写进名单可以，同一场全开不行。',
      alternates: {
        canonical: '/zh/blog/dnd-cleric-spells',
        languages: {
          'x-default': '/blog/dnd-cleric-spells',
          'en-US': '/blog/dnd-cleric-spells',
          'zh-CN': '/zh/blog/dnd-cleric-spells',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_CLERIC_SPELLS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-12',
      dateModified: '2026-09-12',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-cleric-spells',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-cleric-spells-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_CLERIC_SPELLS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-12',
      dateModified: '2026-09-12',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-cleric-spells',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-cleric-spells-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', DND_CLERIC_SPELLS_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    const chineseFaqSchema = buildBlogPostFaqStructuredData('zh', DND_CLERIC_SPELLS_SLUG);
    expect(chineseFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      chineseFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(chinesePost?.faqItems);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-cleric-spells',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-cleric-spells',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-cleric-spells',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-cleric-spells')).toMatchObject({
      lastModified: new Date('2026-09-12'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-cleric-spells')).toMatchObject({
      lastModified: new Date('2026-09-12'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    for (const inlinePath of [...EN_INLINE_PATHS, ...ZH_INLINE_PATHS]) {
      expect(existsSync(`public${inlinePath}`)).toBe(true);
    }

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-cleric-spells');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-cleric-spells');
  });
});
