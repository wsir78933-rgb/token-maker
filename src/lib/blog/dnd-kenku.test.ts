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

const DND_KENKU_SLUG = 'dnd-kenku';
const COVER_PATH = '/blog/covers/en/dnd-kenku-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/dnd-kenku/kenku-book-lock.webp',
  '/blog/inline/dnd-kenku/kenku-vs-aarakocra.webp',
  '/blog/inline/dnd-kenku/kenku-token-crop.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/dnd-kenku/kenku-speech-lock-zh.webp',
  '/blog/inline/dnd-kenku/kenku-name-collision-zh.webp',
  '/blog/inline/dnd-kenku/kenku-token-beak-zh.webp',
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

describe('dnd kenku blog post', () => {
  test('publishes a bilingual race guide without overwriting the races sibling', () => {
    const englishPost = getBlogPost('en', DND_KENKU_SLUG);
    const chinesePost = getBlogPost('zh', DND_KENKU_SLUG);
    const racesPost = getBlogPost('en', 'dnd-races');

    expect(englishPost?.title).toBe("DnD Kenku: Speech Depends on Volo's or MotM");
    expect(englishPost?.seoTitle).toBe("DnD Kenku: Speech Depends on Volo's or MotM");
    expect(englishPost?.metaDescription).toBe(
      "Ask the DM which Kenku page is legal. Copy that speech and Mimicry line from print, not a Volo's-MotM mix. Crop a wingless raven-person. Not in the 2024 PHB.",
    );
    expect(englishPost?.updatedAt).toBe('2026-09-12');
    expect(englishPost?.publishedAt).toBe('2026-09-12');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Race Guide');
    expect(englishPost?.bodyHtml).toContain('Lock the Kenku book first');
    expect(englishPost?.bodyHtml).toContain('FAQ about dnd kenku');
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

    expect(chinesePost?.title).toBe('dnd kenku：瓦罗只能拟声，灰机缺页不等于魔邓肯不能开口');
    expect(chinesePost?.seoTitle).toBe(
      'dnd kenku（天狗）：瓦罗只能拟声，灰机缺页不等于魔邓肯不能开口',
    );
    expect(chinesePost?.updatedAt).toBe('2026-09-12');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('种族百科');
    expect(chinesePost?.bodyHtml).toContain('先锁书，再写这桌能不能开口');
    expect(chinesePost?.bodyHtml).not.toContain('常见问题');
    expect(chinesePost?.bodyHtml).not.toContain('FAQ about dnd kenku');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    expect(racesPost?.slug).toBe('dnd-races');
    expect(racesPost?.bodyHtml).not.toContain('dnd-kenku');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_KENKU_SLUG);
    const chinesePost = getBlogPost('zh', DND_KENKU_SLUG);

    expect(getBlogPostPath('en', DND_KENKU_SLUG)).toBe('/blog/dnd-kenku');
    expect(getBlogPostPath('zh', DND_KENKU_SLUG)).toBe('/zh/blog/dnd-kenku');
    expect(createBlogPostMetadata('en', DND_KENKU_SLUG)).toMatchObject({
      title: "DnD Kenku: Speech Depends on Volo's or MotM",
      description:
        "Ask the DM which Kenku page is legal. Copy that speech and Mimicry line from print, not a Volo's-MotM mix. Crop a wingless raven-person. Not in the 2024 PHB.",
      alternates: {
        canonical: '/blog/dnd-kenku',
        languages: {
          'x-default': '/blog/dnd-kenku',
          'en-US': '/blog/dnd-kenku',
          'zh-CN': '/zh/blog/dnd-kenku',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_KENKU_SLUG)).toMatchObject({
      title: 'dnd kenku（天狗）：瓦罗只能拟声，灰机缺页不等于魔邓肯不能开口',
      description:
        '中文桌把 dnd kenku 叫天狗 Kenku，不是日本妖怪或开拓者 Tengu。瓦罗语言条只能用拟声说话；灰机魔邓肯页没有语言条，缺页不是规则，开口跟锁的书走。拟声别让全桌猜谜，Token 留下喙和无翼肩线。',
      alternates: {
        canonical: '/zh/blog/dnd-kenku',
        languages: {
          'x-default': '/blog/dnd-kenku',
          'en-US': '/blog/dnd-kenku',
          'zh-CN': '/zh/blog/dnd-kenku',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_KENKU_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-12',
      dateModified: '2026-09-12',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-kenku',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-kenku-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_KENKU_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-12',
      dateModified: '2026-09-12',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-kenku',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-kenku-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', DND_KENKU_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    expect(buildBlogPostFaqStructuredData('zh', DND_KENKU_SLUG)).toBeNull();
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-kenku',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-kenku',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-kenku',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-kenku')).toMatchObject({
      lastModified: new Date('2026-09-12'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-kenku')).toMatchObject({
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
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-kenku');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-kenku');
  });
});
