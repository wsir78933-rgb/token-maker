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

const DND_CLASSES_COMPARISON_SLUG = 'dnd-classes-comparison';
const COVER_PATH = '/blog/covers/en/dnd-classes-comparison-cover.webp';
const TOKEN_ROW_PATH = '/blog/inline/dnd-classes-comparison/class-token-row.webp';
const VIDEO_PLACEHOLDER_PATH =
  '/blog/inline/dnd-classes-comparison/dnd-classes-cleric-video-placeholder.webp';
const VIDEO_ID = 'y84OYRwzZU8';

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

describe('dnd classes comparison blog post', () => {
  test('publishes a bilingual 12-vs-13 class comparison without overwriting sibling class pages', () => {
    const englishPost = getBlogPost('en', DND_CLASSES_COMPARISON_SLUG);
    const chinesePost = getBlogPost('zh', DND_CLASSES_COMPARISON_SLUG);
    const explainedPost = getBlogPost('en', 'dnd-classes-explained');
    const rankedPost = getBlogPost('en', 'dnd-classes-ranked');
    const smallPartyPlaceholder = getBlogPost('en', 'best-dnd-classes-for-small-parties');

    expect(englishPost?.title).toBe(
      'DND Classes Compared: All 13 by Party Job and First Combat Turn',
    );
    expect(englishPost?.seoTitle).toBe('DND Classes Compared: 13 Choices, First Combat Turn');
    expect(englishPost?.metaDescription).toBe(
      'Compare all 13 DND classes by party job and first combat turn. Separate the 12 PHB classes from Artificer without a power ranking.',
    );
    expect(englishPost?.updatedAt).toBe('2026-08-25');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverImage).not.toBe('/blog/covers/en/dnd-classes-explained-redesign.webp');
    expect(englishPost?.bodyHtml).toContain('How many DND classes are there?');
    expect(englishPost?.bodyHtml).toContain('Think in party jobs');
    expect(englishPost?.bodyHtml).toContain('All 13 DND classes at a glance');
    expect(englishPost?.bodyHtml).toContain(TOKEN_ROW_PATH);
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).toContain(`data-video-id="${VIDEO_ID}"`);
    expect(englishPost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(englishPost?.bodyHtml).toContain('class="inline-embed inline-embed--video lite-video"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).toContain(
      '[confirm: not on 2024 overview table; treat as Average to High]',
    );
    expect(getVisibleEnglishWordCount(englishPost?.bodyHtml ?? '')).toBeGreaterThanOrEqual(2_400);
    expect(englishPost?.faqItems).toHaveLength(8);
    expectVisibleFaqItems(englishPost?.bodyHtml ?? '', englishPost?.faqItems ?? []);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('DND职业有哪些：用队伍职责和第1回合对照全部13个官方职业');
    expect(chinesePost?.seoTitle).toBe(
      'DND职业有哪些：5e官方13个职业对照第1回合动作，先分清2024手册12个与奇械师再写你的角色卡',
    );
    expect(chinesePost?.title).not.toMatch(/dnd classes compared/i);
    expect(chinesePost?.seoTitle).not.toMatch(/dnd classes compared/i);
    expect(chinesePost?.metaDescription).toContain('DND职业有哪些');
    expect(chinesePost?.excerpt).toContain('DND职业有哪些');
    expect(chinesePost?.updatedAt).toBe('2026-08-25');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.bodyHtml).toContain('DND职业有哪些：手册是 12 个，官方一共 13 个');
    expect(chinesePost?.bodyHtml).toContain('先看队伍缺什么');
    expect(chinesePost?.bodyHtml).toContain(TOKEN_ROW_PATH);
    expect(chinesePost?.bodyHtml).toContain(`data-video-id="${VIDEO_ID}"`);
    expect(chinesePost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.bodyHtml).toContain('[confirm: 官方总览无此行，按工具箱记为中到高]');
    expect(chinesePost?.bodyHtml).toContain('[confirm: 总览无此行]');
    expect(chinesePost?.faqItems).toHaveLength(8);
    expectVisibleFaqItems(chinesePost?.bodyHtml ?? '', chinesePost?.faqItems ?? []);
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(explainedPost?.slug).toBe('dnd-classes-explained');
    expect(explainedPost?.coverImage).toBe('/blog/covers/en/dnd-classes-explained-redesign.webp');
    expect(rankedPost?.slug).toBe('dnd-classes-ranked');
    expect(smallPartyPlaceholder).toBeUndefined();
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_CLASSES_COMPARISON_SLUG);
    const chinesePost = getBlogPost('zh', DND_CLASSES_COMPARISON_SLUG);

    expect(getBlogPostPath('en', DND_CLASSES_COMPARISON_SLUG)).toBe('/blog/dnd-classes-comparison');
    expect(getBlogPostPath('zh', DND_CLASSES_COMPARISON_SLUG)).toBe(
      '/zh/blog/dnd-classes-comparison',
    );
    expect(createBlogPostMetadata('en', DND_CLASSES_COMPARISON_SLUG)).toMatchObject({
      title: 'DND Classes Compared: 13 Choices, First Combat Turn',
      description:
        'Compare all 13 DND classes by party job and first combat turn. Separate the 12 PHB classes from Artificer without a power ranking.',
      alternates: {
        canonical: '/blog/dnd-classes-comparison',
        languages: {
          'x-default': '/blog/dnd-classes-comparison',
          'en-US': '/blog/dnd-classes-comparison',
          'zh-CN': '/zh/blog/dnd-classes-comparison',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_CLASSES_COMPARISON_SLUG)).toMatchObject({
      title: 'DND职业有哪些：5e官方13个职业对照第1回合动作，先分清2024手册12个与奇械师再写你的角色卡',
      description:
        '先回答DND职业有哪些：2024《玩家手册》12个，加上奇械师共13个官方职业。再按前排、恢复、技能、奥术四项职责和第1回合动作对照，写下职业名。这页不做强度排名，不把奇械师写进2024手册，写完职业再去做能看清的VTT Token，并在开团前写上你的角色卡。',
      alternates: {
        canonical: '/zh/blog/dnd-classes-comparison',
        languages: {
          'x-default': '/blog/dnd-classes-comparison',
          'en-US': '/blog/dnd-classes-comparison',
          'zh-CN': '/zh/blog/dnd-classes-comparison',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_CLASSES_COMPARISON_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-25',
      dateModified: '2026-08-25',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-classes-comparison',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-classes-comparison-cover.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_CLASSES_COMPARISON_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-25',
      dateModified: '2026-08-25',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-classes-comparison',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-classes-comparison-cover.webp'],
    });
    for (const [locale, post] of [
      ['en', englishPost],
      ['zh', chinesePost],
    ] as const) {
      const faqSchema = buildBlogPostFaqStructuredData(locale, DND_CLASSES_COMPARISON_SLUG);

      expect(faqSchema).toMatchObject({ '@type': 'FAQPage' });
      expect(
        faqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
          question: name,
          answer: acceptedAnswer.text,
        })),
      ).toEqual(post?.faqItems);
    }

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-classes-comparison',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-classes-comparison',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-classes-comparison',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-classes-comparison')).toMatchObject({
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(
      getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-classes-comparison'),
    ).toMatchObject({
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${TOKEN_ROW_PATH}`)).toBe(true);
    expect(existsSync(`public${VIDEO_PLACEHOLDER_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-classes-comparison');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-classes-comparison');
  });
});
