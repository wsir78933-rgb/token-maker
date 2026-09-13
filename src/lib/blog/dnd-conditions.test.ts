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

const DND_CONDITIONS_SLUG = 'dnd-conditions';
const COVER_PATH = '/blog/covers/en/dnd-conditions-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/dnd-conditions/conditions-year-lock.webp',
  '/blog/inline/dnd-conditions/conditions-grapple-restrain.webp',
  '/blog/inline/dnd-conditions/conditions-exhaustion-stack.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/dnd-conditions/conditions-year-lock-zh.webp',
  '/blog/inline/dnd-conditions/conditions-grapple-restrain-zh.webp',
  '/blog/inline/dnd-conditions/conditions-exhaustion-stack-zh.webp',
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

describe('dnd conditions blog post', () => {
  test('publishes a bilingual conditions guide without overwriting sibling articles', () => {
    const englishPost = getBlogPost('en', DND_CONDITIONS_SLUG);
    const chinesePost = getBlogPost('zh', DND_CONDITIONS_SLUG);
    const mindFlayerPost = getBlogPost('en', 'mind-flayer-dnd');
    const playersHandbookPost = getBlogPost('en', 'players-handbook-dnd-5e');
    const maulPost = getBlogPost('en', 'dnd-maul');

    expect(englishPost?.title).toBe('DnD Conditions: Same Fifteen Names, Lock 2014 or 2024');
    expect(englishPost?.seoTitle).toBe('DnD Conditions: Same Fifteen Names, Lock 2014 or 2024');
    expect(englishPost?.metaDescription).toBe(
      "Copy tonight's fifteen dnd conditions from 2014 or 2024. Grappled is not Restrained, Stunned is not Paralyzed, and Exhaustion already at 2 then +1 is 3.",
    );
    expect(englishPost?.excerpt).toBe(
      "Copy tonight's fifteen dnd conditions from 2014 or 2024. Grappled is not Restrained; Stunned is not Paralyzed; Exhaustion 2 then +1 is 3.",
    );
    expect(englishPost?.updatedAt).toBe('2026-09-13');
    expect(englishPost?.publishedAt).toBe('2026-09-13');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Conditions Guide');
    expect(englishPost?.bodyHtml).toContain('Lock 2014 or 2024 before the first save');
    expect(englishPost?.bodyHtml).toContain('Matching names are not matching math');
    expect(englishPost?.bodyHtml).toContain('FAQ about dnd conditions');
    expect(englishPost?.bodyHtml).not.toContain('used here');
    expect(englishPost?.bodyHtml).not.toContain('Supports:');
    expect(englishPost?.bodyHtml).not.toContain('对照短机械');
    expect(englishPost?.bodyHtml).not.toContain('${CONDITIONS_');
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

    expect(chinesePost?.title).toBe(
      'dnd 5e 状态：力竭已经 2 级再 +1，升到 3 不是只执行新得到的那 1 级',
    );
    expect(chinesePost?.seoTitle).toBe(
      'dnd 5e 状态（dnd conditions）：力竭已经 2 级再 +1，升到 3 不是只执行新得到的那 1 级',
    );
    expect(chinesePost?.metaDescription).toBe(
      '今晚这张 dnd 5e 状态是附录里那 15 个。卡边写「2014《玩家手册》状态」或「2024 术语表状态」。力竭已经 2 级再获得 1 级升到 3，不是只执行新得到的那 1 级：2014 同时承受 1+2+3，2024 是 D20 检定 −6、速度 −15 尺。受擒不是束缚，震慑不是麻痹。',
    );
    expect(chinesePost?.excerpt).toBe(
      '今晚这张 dnd 5e 状态，中文叫状态，英文括注 Conditions。卡边写 2014《玩家手册》状态或 2024 术语表状态。附录仍是 15 个名字。受擒两边速度 0，敏捷豁免劣势只在束缚。震慑两版都没有 5 尺重击。力竭已经 2 级再获得 1 级升到 3，不是只执行新得到的那 1 级：2014 同时承受 1+2+3，2024 是 D20 检定 −6、速度 −15 尺。',
    );
    expect(chinesePost?.updatedAt).toBe('2026-09-13');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('状态指南');
    expect(chinesePost?.bodyHtml).toContain('力竭已经 2 级再获得 1 级');
    expect(chinesePost?.bodyHtml).not.toContain('used here');
    expect(chinesePost?.bodyHtml).not.toContain('Supports:');
    expect(chinesePost?.bodyHtml).not.toContain('对照短机械');
    expect(chinesePost?.bodyHtml).not.toContain('${CONDITIONS_');
    expect(chinesePost?.bodyHtml).not.toContain('常见问题');
    expect(chinesePost?.bodyHtml).not.toContain('FAQ about dnd conditions');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    expect(mindFlayerPost?.slug).toBe('mind-flayer-dnd');
    expect(playersHandbookPost?.slug).toBe('players-handbook-dnd-5e');
    expect(maulPost?.slug).toBe('dnd-maul');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_CONDITIONS_SLUG);
    const chinesePost = getBlogPost('zh', DND_CONDITIONS_SLUG);

    expect(getBlogPostPath('en', DND_CONDITIONS_SLUG)).toBe('/blog/dnd-conditions');
    expect(getBlogPostPath('zh', DND_CONDITIONS_SLUG)).toBe('/zh/blog/dnd-conditions');
    expect(createBlogPostMetadata('en', DND_CONDITIONS_SLUG)).toMatchObject({
      title: 'DnD Conditions: Same Fifteen Names, Lock 2014 or 2024',
      description:
        "Copy tonight's fifteen dnd conditions from 2014 or 2024. Grappled is not Restrained, Stunned is not Paralyzed, and Exhaustion already at 2 then +1 is 3.",
      alternates: {
        canonical: '/blog/dnd-conditions',
        languages: {
          'x-default': '/blog/dnd-conditions',
          'en-US': '/blog/dnd-conditions',
          'zh-CN': '/zh/blog/dnd-conditions',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_CONDITIONS_SLUG)).toMatchObject({
      title: 'dnd 5e 状态（dnd conditions）：力竭已经 2 级再 +1，升到 3 不是只执行新得到的那 1 级',
      description:
        '今晚这张 dnd 5e 状态是附录里那 15 个。卡边写「2014《玩家手册》状态」或「2024 术语表状态」。力竭已经 2 级再获得 1 级升到 3，不是只执行新得到的那 1 级：2014 同时承受 1+2+3，2024 是 D20 检定 −6、速度 −15 尺。受擒不是束缚，震慑不是麻痹。',
      alternates: {
        canonical: '/zh/blog/dnd-conditions',
        languages: {
          'x-default': '/blog/dnd-conditions',
          'en-US': '/blog/dnd-conditions',
          'zh-CN': '/zh/blog/dnd-conditions',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_CONDITIONS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-13',
      dateModified: '2026-09-13',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-conditions',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-conditions-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_CONDITIONS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-13',
      dateModified: '2026-09-13',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-conditions',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-conditions-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', DND_CONDITIONS_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    expect(buildBlogPostFaqStructuredData('zh', DND_CONDITIONS_SLUG)).toBeNull();
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-conditions',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-conditions',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-conditions',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-conditions')).toMatchObject({
      lastModified: new Date('2026-09-13'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-conditions')).toMatchObject({
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
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-conditions');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-conditions');
    expect(llmsText).toContain('DnD Conditions: Same Fifteen Names, Lock 2014 or 2024');
    expect(llmsText).toContain(
      "Copy tonight's fifteen dnd conditions from 2014 or 2024. Grappled is not Restrained; Stunned is not Paralyzed; Exhaustion 2 then +1 is 3.",
    );
    expect(llmsText).toContain(
      'dnd 5e 状态：力竭已经 2 级再 +1，升到 3 不是只执行新得到的那 1 级',
    );
    expect(llmsText).toContain(
      '今晚这张 dnd 5e 状态，中文叫状态，英文括注 Conditions。卡边写 2014《玩家手册》状态或 2024 术语表状态。附录仍是 15 个名字。受擒两边速度 0，敏捷豁免劣势只在束缚。震慑两版都没有 5 尺重击。力竭已经 2 级再获得 1 级升到 3，不是只执行新得到的那 1 级：2014 同时承受 1+2+3，2024 是 D20 检定 −6、速度 −15 尺。',
    );
  });
});
