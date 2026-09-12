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

const MIND_FLAYER_DND_SLUG = 'mind-flayer-dnd';
const COVER_PATH = '/blog/covers/en/mind-flayer-dnd-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/mind-flayer-dnd/mind-flayer-book-lock.webp',
  '/blog/inline/mind-flayer-dnd/mind-flayer-action-loop.webp',
  '/blog/inline/mind-flayer-dnd/mind-flayer-token-crop.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/mind-flayer-dnd/mind-flayer-name-collision-zh.webp',
  '/blog/inline/mind-flayer-dnd/mind-flayer-stun-lock-zh.webp',
  '/blog/inline/mind-flayer-dnd/mind-flayer-token-tentacles-zh.webp',
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

describe('mind flayer dnd blog post', () => {
  test('publishes a bilingual aberration guide without overwriting the flumph sibling', () => {
    const englishPost = getBlogPost('en', MIND_FLAYER_DND_SLUG);
    const chinesePost = getBlogPost('zh', MIND_FLAYER_DND_SLUG);
    const flumphPost = getBlogPost('en', 'dnd-flumph');

    expect(englishPost?.title).toBe("Mind Flayer DnD: CR 7 Matches, The Stun Clock Doesn't");
    expect(englishPost?.seoTitle).toBe("Mind Flayer DnD: CR 7 Matches, The Stun Clock Doesn't");
    expect(englishPost?.metaDescription).toBe(
      "Both books print CR 7. 2014 Mind Blast stuns 1 minute; 2024 stuns until the flayer's next turn ends. Lock one year and copy that book's three actions.",
    );
    expect(englishPost?.updatedAt).toBe('2026-09-12');
    expect(englishPost?.publishedAt).toBe('2026-09-12');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Aberration Guide');
    expect(englishPost?.bodyHtml).toContain('Lock the Monster Manual year first');
    expect(englishPost?.bodyHtml).toContain('FAQ about mind flayer dnd');
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

    expect(chinesePost?.title).toBe('dnd mind flayer：夺心魔别把 1 分钟震慑拼上不要求失能的采脑');
    expect(chinesePost?.seoTitle).toBe(
      'dnd mind flayer（夺心魔）：别把 1 分钟震慑拼上不要求失能的采脑',
    );
    expect(chinesePost?.updatedAt).toBe('2026-09-12');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('异怪指南');
    expect(chinesePost?.bodyHtml).toContain('先锁 2014 还是 2024');
    expect(chinesePost?.bodyHtml).not.toContain('常见问题');
    expect(chinesePost?.bodyHtml).not.toContain('FAQ about mind flayer dnd');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    expect(flumphPost?.slug).toBe('dnd-flumph');
    expect(flumphPost?.bodyHtml).not.toContain('mind-flayer-dnd');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', MIND_FLAYER_DND_SLUG);
    const chinesePost = getBlogPost('zh', MIND_FLAYER_DND_SLUG);

    expect(getBlogPostPath('en', MIND_FLAYER_DND_SLUG)).toBe('/blog/mind-flayer-dnd');
    expect(getBlogPostPath('zh', MIND_FLAYER_DND_SLUG)).toBe('/zh/blog/mind-flayer-dnd');
    expect(createBlogPostMetadata('en', MIND_FLAYER_DND_SLUG)).toMatchObject({
      title: "Mind Flayer DnD: CR 7 Matches, The Stun Clock Doesn't",
      description:
        "Both books print CR 7. 2014 Mind Blast stuns 1 minute; 2024 stuns until the flayer's next turn ends. Lock one year and copy that book's three actions.",
      alternates: {
        canonical: '/blog/mind-flayer-dnd',
        languages: {
          'x-default': '/blog/mind-flayer-dnd',
          'en-US': '/blog/mind-flayer-dnd',
          'zh-CN': '/zh/blog/mind-flayer-dnd',
        },
      },
    });
    expect(createBlogPostMetadata('zh', MIND_FLAYER_DND_SLUG)).toMatchObject({
      title: 'dnd mind flayer（夺心魔）：别把 1 分钟震慑拼上不要求失能的采脑',
      description:
        '中文桌把 dnd mind flayer 叫夺心魔，也叫灵吸怪；不是怪奇物语巨兽、最终幻想 14 或克苏鲁头。卡边写 2014 或 2024，不要把 1 分钟震慑拼上不要求失能的采脑。',
      alternates: {
        canonical: '/zh/blog/mind-flayer-dnd',
        languages: {
          'x-default': '/blog/mind-flayer-dnd',
          'en-US': '/blog/mind-flayer-dnd',
          'zh-CN': '/zh/blog/mind-flayer-dnd',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', MIND_FLAYER_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-12',
      dateModified: '2026-09-12',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/mind-flayer-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/mind-flayer-dnd-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', MIND_FLAYER_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-12',
      dateModified: '2026-09-12',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/mind-flayer-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/mind-flayer-dnd-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', MIND_FLAYER_DND_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    expect(buildBlogPostFaqStructuredData('zh', MIND_FLAYER_DND_SLUG)).toBeNull();
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/mind-flayer-dnd',
      'en-US': 'https://www.tokenmaker.one/blog/mind-flayer-dnd',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/mind-flayer-dnd',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/mind-flayer-dnd')).toMatchObject({
      lastModified: new Date('2026-09-12'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/mind-flayer-dnd')).toMatchObject({
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
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/mind-flayer-dnd');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/mind-flayer-dnd');
  });
});
