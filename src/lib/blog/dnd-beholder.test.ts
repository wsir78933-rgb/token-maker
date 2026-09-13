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

const DND_BEHOLDER_SLUG = 'dnd-beholder';
const COVER_PATH = '/blog/covers/en/dnd-beholder-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/dnd-beholder/beholder-book-lock.webp',
  '/blog/inline/dnd-beholder/beholder-cone-rays.webp',
  '/blog/inline/dnd-beholder/beholder-token-crop.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/dnd-beholder/beholder-name-collision-zh.webp',
  '/blog/inline/dnd-beholder/beholder-cone-lock-zh.webp',
  '/blog/inline/dnd-beholder/beholder-token-stalks-zh.webp',
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

describe('dnd beholder blog post', () => {
  test('publishes a bilingual aberration guide without overwriting sibling articles', () => {
    const englishPost = getBlogPost('en', DND_BEHOLDER_SLUG);
    const chinesePost = getBlogPost('zh', DND_BEHOLDER_SLUG);
    const spectatorPost = getBlogPost('en', 'spectator-dnd');
    const mindFlayerPost = getBlogPost('en', 'mind-flayer-dnd');

    expect(englishPost?.title).toBe('DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action');
    expect(englishPost?.seoTitle).toBe('DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action');
    expect(englishPost?.metaDescription).toBe(
      "A dnd beholder's cone is a start-of-turn trait in 2014 and a Bonus Action in 2024. Copy that year's Eye Rays: three-ray action, or Multiattack three times.",
    );
    expect(englishPost?.updatedAt).toBe('2026-09-13');
    expect(englishPost?.publishedAt).toBe('2026-09-13');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Aberration Guide');
    expect(englishPost?.bodyHtml).toContain('Lock the Monster Manual year first');
    expect(englishPost?.bodyHtml).toContain('FAQ about dnd beholder');
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
    expect(englishPost?.faqItems).toHaveLength(5);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('眼魔：挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作');
    expect(chinesePost?.seoTitle).toBe(
      '眼魔（dnd beholder）：挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作',
    );
    expect(chinesePost?.updatedAt).toBe('2026-09-13');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('异怪指南');
    expect(
      chinesePost?.bodyHtml?.includes('先锁') || chinesePost?.bodyHtml?.includes('先把今晚这只'),
    ).toBe(true);
    expect(chinesePost?.bodyHtml).not.toContain('常见问题');
    expect(chinesePost?.bodyHtml).not.toContain('FAQ about dnd beholder');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    expect(spectatorPost?.slug).toBe('spectator-dnd');
    expect(mindFlayerPost?.slug).toBe('mind-flayer-dnd');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_BEHOLDER_SLUG);
    const chinesePost = getBlogPost('zh', DND_BEHOLDER_SLUG);

    expect(getBlogPostPath('en', DND_BEHOLDER_SLUG)).toBe('/blog/dnd-beholder');
    expect(getBlogPostPath('zh', DND_BEHOLDER_SLUG)).toBe('/zh/blog/dnd-beholder');
    expect(createBlogPostMetadata('en', DND_BEHOLDER_SLUG)).toMatchObject({
      title: 'DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action',
      description:
        "A dnd beholder's cone is a start-of-turn trait in 2014 and a Bonus Action in 2024. Copy that year's Eye Rays: three-ray action, or Multiattack three times.",
      alternates: {
        canonical: '/blog/dnd-beholder',
        languages: {
          'x-default': '/blog/dnd-beholder',
          'en-US': '/blog/dnd-beholder',
          'zh-CN': '/zh/blog/dnd-beholder',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_BEHOLDER_SLUG)).toMatchObject({
      title: '眼魔（dnd beholder）：挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作',
      description:
        '中文桌把 dnd beholder 叫眼魔，不是观察者眼魔。两版都是挑战等级 13；2014 反魔锥是特质，2024 才花附赠动作。射线和传奇跟锥抄同一本，Token 留下十根眼柄。',
      alternates: {
        canonical: '/zh/blog/dnd-beholder',
        languages: {
          'x-default': '/blog/dnd-beholder',
          'en-US': '/blog/dnd-beholder',
          'zh-CN': '/zh/blog/dnd-beholder',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_BEHOLDER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-13',
      dateModified: '2026-09-13',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-beholder',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-beholder-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_BEHOLDER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-13',
      dateModified: '2026-09-13',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-beholder',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-beholder-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', DND_BEHOLDER_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    expect(buildBlogPostFaqStructuredData('zh', DND_BEHOLDER_SLUG)).toBeNull();
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-beholder',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-beholder',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-beholder',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-beholder')).toMatchObject({
      lastModified: new Date('2026-09-13'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-beholder')).toMatchObject({
      lastModified: new Date('2026-09-13'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    for (const inlinePath of [...EN_INLINE_PATHS, ...ZH_INLINE_PATHS]) {
      expect(existsSync(`public${inlinePath}`)).toBe(true);
    }

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-beholder');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-beholder');
  });
});
