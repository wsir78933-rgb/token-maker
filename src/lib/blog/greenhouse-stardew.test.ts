// @vitest-environment jsdom

import { createHash } from 'node:crypto';
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

const SLUG = 'greenhouse-stardew';
const UPDATED_AT = '2026-09-19';
const ENGLISH_TITLE = 'How to Get the Greenhouse in Stardew Valley';
const ENGLISH_DESCRIPTION =
  'Get the Stardew Valley Greenhouse: finish all Pantry bundles, or buy Joja membership for 5,000g, return next in-game day for the form, buy the 35,000g project, sleep, and check the farm.';
const CHINESE_TITLE = '星露谷物语温室怎么解锁：社区中心与 Joja 路线';
const CHINESE_DESCRIPTION =
  '说明星露谷物语温室的两条解锁路线，分别讲清茶水间普通收集包、Joja 会员与温室项目的条件，以及完成后如何检查温室是否已经可用。';
const INLINE_PATHS = [
  '/blog/inline/greenhouse-stardew/greenhouse-route-choice-anime.webp',
  '/blog/inline/greenhouse-stardew/greenhouse-before-after-anime.webp',
] as const;
const INLINE_HASHES = [
  '015591aa83fc1c0e1d4d0bd3f142f2711e301452e39621619a4a64214ce33f06',
  '85f3521316eb18b41d5405a9cc6f09867909f7fe4ea981cb9cf893ec7b5eff16',
] as const;
const ENGLISH_CAPTIONS = [
  'Illustration: a reader-facing view of the Community Center and Joja route choice; this is an illustration, not a gameplay screenshot or in-game UI.',
  'Illustration: a before-and-after view of a damaged and restored greenhouse; this is an illustration, not a gameplay screenshot or in-game evidence.',
] as const;
const CHINESE_CAPTIONS = [
  '示意插画，非游戏截图：农场小路通向社区中心与 Joja 建筑，用于表现路线选择主题，不代表游戏内画面、界面或实测结果。',
  '示意插画，非游戏截图：画面并列表现破损温室与修复后温室的状态变化，不代表游戏内证据、界面或实测结果。',
] as const;
const EXPECTED_HREFS = [
  'https://stardewvalleywiki.com/Greenhouse',
  'https://stardewvalleywiki.com/Bundles',
  'https://stardewvalleywiki.com/Community_Center',
  'https://stardewvalleywiki.com/Joja_Community_Development_Form',
  'https://www.gamespot.com/articles/stardew-valley-how-to-unlock-the-greenhouse/1100-6524916/',
  'https://www.ign.com/wikis/stardew-valley/How_To_Get_the_Greenhouse_and_Grow_Crops',
  'https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%B8%A9%E5%AE%A4&variant=zh-cn',
  'https://zh.stardewvalleywiki.com/%E6%94%B6%E9%9B%86%E5%8C%85',
  'https://zh.stardewvalleywiki.com/%E9%87%8D%E6%96%B0%E6%B7%B7%E5%90%88%E7%9A%84%E6%94%B6%E9%9B%86%E5%8C%85',
  'https://zh.stardewvalleywiki.com/Joja%E7%A4%BE%E5%8C%BA%E5%8F%91%E5%B1%95%E7%94%B3%E8%AF%B7%E4%B9%A6',
  'https://zh.stardewvalleywiki.com/%E7%A4%BE%E5%8C%BA%E4%B8%AD%E5%BF%83',
] as const;

function getSitemapEntry(url: string) {
  const entry = sitemap().find((candidate) => candidate.url === url);

  if (!entry) {
    throw new Error('Expected sitemap entry for ' + url + '.');
  }

  return entry;
}

function getBodyRoot(bodyHtml: string) {
  return new DOMParser().parseFromString(bodyHtml, 'text/html').body;
}

function getFileSha256(path: string) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

describe('greenhouse stardew blog post', () => {
  test('publishes the locked bilingual bodies and approved inline illustrations', () => {
    const englishPost = getBlogPost('en', SLUG);
    const chinesePost = getBlogPost('zh', SLUG);

    expect(englishPost).toMatchObject({
      slug: SLUG,
      title: ENGLISH_TITLE,
      seoTitle: ENGLISH_TITLE,
      metaDescription: ENGLISH_DESCRIPTION,
      excerpt: ENGLISH_DESCRIPTION,
      publishedAt: UPDATED_AT,
      updatedAt: UPDATED_AT,
      readTime: '11 min read',
      coverLabel: 'Guide',
      faqItems: [],
    });
    expect(chinesePost).toMatchObject({
      slug: SLUG,
      title: CHINESE_TITLE,
      seoTitle: CHINESE_TITLE,
      metaDescription: CHINESE_DESCRIPTION,
      excerpt: CHINESE_DESCRIPTION,
      publishedAt: UPDATED_AT,
      updatedAt: UPDATED_AT,
      readTime: '11 分钟阅读',
      coverLabel: '指南',
      faqItems: [],
    });
    expect(englishPost?.coverImage).toBeUndefined();
    expect(chinesePost?.coverImage).toBeUndefined();

    for (const [locale, post, captions] of [
      ['en', englishPost, ENGLISH_CAPTIONS],
      ['zh', chinesePost, CHINESE_CAPTIONS],
    ] as const) {
      const bodyHtml = post?.bodyHtml ?? '';
      const bodyRoot = getBodyRoot(bodyHtml);
      const images = Array.from(bodyRoot.querySelectorAll('figure img'));
      const hrefs = Array.from(bodyRoot.querySelectorAll('a')).map((anchor) =>
        anchor.getAttribute('href'),
      );

      expect(bodyRoot.querySelector('h1')).toBeNull();
      expect(images.map((image) => image.getAttribute('src'))).toEqual(INLINE_PATHS);
      expect(images.map((image) => image.getAttribute('alt'))).toEqual(
        locale === 'en'
          ? [
              'Anime-style illustration of a farmer choosing between a Community Center path and a Joja path toward a greenhouse; illustration, not a gameplay screenshot or game UI.',
              'Anime-style illustration showing a damaged greenhouse beside a restored greenhouse with a usable crop area; illustration, not a gameplay screenshot or game UI.',
            ]
          : [
              '动漫风格的农场分岔小路与社区中心和 Joja 建筑示意插画，示意插画，非游戏截图',
              '动漫风格的破损温室与修复后敞门温室并列示意插画，示意插画，非游戏截图',
            ],
      );
      expect(images.every((image) => image.getAttribute('width') === '1536')).toBe(true);
      expect(images.every((image) => image.getAttribute('height') === '1024')).toBe(true);
      expect(images.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
      expect(images.every((image) => image.getAttribute('decoding') === 'async')).toBe(true);
      expect(
        Array.from(bodyRoot.querySelectorAll('figcaption')).map((caption) => caption.textContent),
      ).toEqual(captions);

      for (const expectedHref of EXPECTED_HREFS) {
        if (
          (locale === 'en' && expectedHref.startsWith('https://zh.')) ||
          (locale === 'zh' && !expectedHref.startsWith('https://zh.'))
        ) {
          continue;
        }

        expect(hrefs).toContain(expectedHref);
      }

      expect(hrefs.some((href) => href !== null && /[^\x00-\x7f]/.test(href))).toBe(false);
      expect(bodyHtml).not.toContain('<h1');
      expect(bodyHtml).not.toContain('<iframe');
      expect(bodyHtml).not.toContain('data-video-id=');
      expect(bodyHtml).not.toContain('lite-video');
      expect(bodyHtml).not.toContain('/tmp/tokenmaker-greenhouse-v7');
      expect(bodyHtml).not.toContain('d55b2cfcbcdd35a52f4c3d506fdd4d746a275cccb808034d4c461dd889991e1d');
      expect(bodyHtml).not.toContain('756aba1ec987357e15d93be1459ce4aec715affbdf0abb2cf1337084f5e5f88b');
      expect(bodyHtml).not.toMatch(/PublicBlogHandoff|dispatch|bodyHash/i);
    }
  });

  test('exposes localized routes, metadata, schemas, sitemap entries, and discovery', () => {
    expect(getBlogPostPath('en', SLUG)).toBe('/blog/greenhouse-stardew');
    expect(getBlogPostPath('zh', SLUG)).toBe('/zh/blog/greenhouse-stardew');

    expect(createBlogPostMetadata('en', SLUG)).toMatchObject({
      title: ENGLISH_TITLE,
      description: ENGLISH_DESCRIPTION,
      alternates: {
        canonical: '/blog/greenhouse-stardew',
        languages: {
          'x-default': '/blog/greenhouse-stardew',
          'en-US': '/blog/greenhouse-stardew',
          'zh-CN': '/zh/blog/greenhouse-stardew',
        },
      },
      openGraph: {
        title: ENGLISH_TITLE + ' | Token Maker',
        description: ENGLISH_DESCRIPTION,
      },
      twitter: {
        card: 'summary_large_image',
      },
    });
    expect(createBlogPostMetadata('zh', SLUG)).toMatchObject({
      title: CHINESE_TITLE,
      description: CHINESE_DESCRIPTION,
      alternates: {
        canonical: '/zh/blog/greenhouse-stardew',
        languages: {
          'x-default': '/blog/greenhouse-stardew',
          'en-US': '/blog/greenhouse-stardew',
          'zh-CN': '/zh/blog/greenhouse-stardew',
        },
      },
      openGraph: {
        title: CHINESE_TITLE + ' | Token Maker',
        description: CHINESE_DESCRIPTION,
      },
      twitter: {
        card: 'summary_large_image',
      },
    });

    expect(buildBlogPostStructuredData('en', SLUG)).toMatchObject({
      '@type': 'Article',
      headline: ENGLISH_TITLE,
      description: ENGLISH_DESCRIPTION,
      datePublished: UPDATED_AT,
      dateModified: UPDATED_AT,
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/greenhouse-stardew',
    });
    expect(buildBlogPostStructuredData('zh', SLUG)).toMatchObject({
      '@type': 'Article',
      headline: CHINESE_TITLE,
      description: CHINESE_DESCRIPTION,
      datePublished: UPDATED_AT,
      dateModified: UPDATED_AT,
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/greenhouse-stardew',
    });
    expect(buildBlogPostStructuredData('en', SLUG)?.image).toBeUndefined();
    expect(buildBlogPostStructuredData('zh', SLUG)?.image).toBeUndefined();
    expect(buildBlogPostFaqStructuredData('en', SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', SLUG)).toBeNull();

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/greenhouse-stardew',
      'en-US': 'https://www.tokenmaker.one/blog/greenhouse-stardew',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/greenhouse-stardew',
    };
    expect(getSitemapEntry(expectedAlternates['en-US'])).toMatchObject({
      lastModified: new Date(UPDATED_AT),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry(expectedAlternates['zh-CN'])).toMatchObject({
      lastModified: new Date(UPDATED_AT),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    for (const [index, inlinePath] of INLINE_PATHS.entries()) {
      expect(existsSync('public' + inlinePath)).toBe(true);
      expect(getFileSha256('public' + inlinePath)).toBe(INLINE_HASHES[index]);
    }

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/greenhouse-stardew');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/greenhouse-stardew');
  });
});
