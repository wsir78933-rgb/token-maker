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

const DND_DRAGONBORN_SLUG = 'dnd-dragonborn';
const COVER_PATH = '/blog/covers/en/dnd-dragonborn-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/dnd-dragonborn/dragonborn-ancestry-scales.webp',
  '/blog/inline/dnd-dragonborn/dragonborn-breath-shape.webp',
  '/blog/inline/dnd-dragonborn/dragonborn-name-clan-tags.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/dnd-dragonborn/dragonborn-two-source-lines.webp',
  '/blog/inline/dnd-dragonborn/dragonborn-clan-and-callname.webp',
] as const;
const VIDEO_PLACEHOLDER_PATH = '/blog/inline/dnd-dragonborn/dragonborn-video-placeholder.webp';
const VIDEO_ID = 'EVwBW5GbGwQ';

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

describe('dnd dragonborn blog post', () => {
  test('publishes a bilingual race guide without overwriting the races sibling', () => {
    const englishPost = getBlogPost('en', DND_DRAGONBORN_SLUG);
    const chinesePost = getBlogPost('zh', DND_DRAGONBORN_SLUG);
    const racesPost = getBlogPost('en', 'dnd-races');

    expect(englishPost?.title).toBe(
      'DnD Dragonborn: Lock the Rulebook, Copy Breath and Names, Crop a Token',
    );
    expect(englishPost?.seoTitle).toBe(
      'DnD Dragonborn: Lock 2014 or 2024, Then Copy Traits',
    );
    expect(englishPost?.metaDescription).toBe(
      'Copy 2014 or 2024 dnd dragonborn traits. Pick one ancestry color, take a clan-first name from the 2014 lists, and crop a token so scales and horns still read.',
    );
    expect(englishPost?.updatedAt).toBe('2026-09-10');
    expect(englishPost?.publishedAt).toBe('2026-09-10');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Race Guide');
    expect(englishPost?.bodyHtml).toContain('Lock the rulebook first');
    expect(englishPost?.bodyHtml).toContain('A short table-energy clip, not a rules source');
    for (const inlinePath of EN_INLINE_PATHS) {
      expect(englishPost?.bodyHtml).toContain(inlinePath);
    }
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).toContain(`data-video-id="${VIDEO_ID}"`);
    expect(englishPost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(englishPost?.bodyHtml).toContain('class="inline-embed inline-embed--video lite-video"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).not.toContain('role="button" tabindex="0"');
    expect(englishPost?.faqItems).toHaveLength(5);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe(
      'dnd dragonborn：龙裔建卡先锁版本，再抄吐息、名字和 Token',
    );
    expect(chinesePost?.seoTitle).toBe(
      'dnd dragonborn（龙裔）：先问 DM 抄 2014 还是 2024',
    );
    expect(chinesePost?.updatedAt).toBe('2026-09-10');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('种族百科');
    expect(chinesePost?.bodyHtml).toContain('先问 DM：这桌的龙裔抄哪一页');
    expect(chinesePost?.bodyHtml).not.toContain('常见问题');
    expect(chinesePost?.bodyHtml).not.toContain('FAQ about dnd dragonborn');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain(`data-video-id="${VIDEO_ID}"`);
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    expect(racesPost?.slug).toBe('dnd-races');
    expect(racesPost?.bodyHtml).not.toContain('dnd-dragonborn');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_DRAGONBORN_SLUG);
    const chinesePost = getBlogPost('zh', DND_DRAGONBORN_SLUG);

    expect(getBlogPostPath('en', DND_DRAGONBORN_SLUG)).toBe('/blog/dnd-dragonborn');
    expect(getBlogPostPath('zh', DND_DRAGONBORN_SLUG)).toBe('/zh/blog/dnd-dragonborn');
    expect(createBlogPostMetadata('en', DND_DRAGONBORN_SLUG)).toMatchObject({
      title: 'DnD Dragonborn: Lock 2014 or 2024, Then Copy Traits',
      description:
        'Copy 2014 or 2024 dnd dragonborn traits. Pick one ancestry color, take a clan-first name from the 2014 lists, and crop a token so scales and horns still read.',
      alternates: {
        canonical: '/blog/dnd-dragonborn',
        languages: {
          'x-default': '/blog/dnd-dragonborn',
          'en-US': '/blog/dnd-dragonborn',
          'zh-CN': '/zh/blog/dnd-dragonborn',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_DRAGONBORN_SLUG)).toMatchObject({
      title: 'dnd dragonborn（龙裔）：先问 DM 抄 2014 还是 2024',
      description:
        '中文桌把 dnd dragonborn 叫龙裔，不是《上古卷轴》主角。先问 DM 抄 2014 还是 2024，再按那一页写吐息、鳞色和名字；Token 裁切时留下角和口鼻。',
      alternates: {
        canonical: '/zh/blog/dnd-dragonborn',
        languages: {
          'x-default': '/blog/dnd-dragonborn',
          'en-US': '/blog/dnd-dragonborn',
          'zh-CN': '/zh/blog/dnd-dragonborn',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_DRAGONBORN_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-10',
      dateModified: '2026-09-10',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-dragonborn',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-dragonborn-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_DRAGONBORN_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-10',
      dateModified: '2026-09-10',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-dragonborn',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-dragonborn-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', DND_DRAGONBORN_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    expect(buildBlogPostFaqStructuredData('zh', DND_DRAGONBORN_SLUG)).toBeNull();
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-dragonborn',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-dragonborn',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-dragonborn',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-dragonborn')).toMatchObject({
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-dragonborn')).toMatchObject({
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    for (const inlinePath of [...EN_INLINE_PATHS, ...ZH_INLINE_PATHS, VIDEO_PLACEHOLDER_PATH]) {
      expect(existsSync(`public${inlinePath}`)).toBe(true);
    }

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-dragonborn');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-dragonborn');
  });
});
