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

const DND_SKILLS_SLUG = 'dnd-skills';
const COVER_PATH = '/blog/covers/en/dnd-skills-guide.webp';
const EN_INLINE_PATHS = [
  '/blog/inline/dnd-skills/skills-ability-map.webp',
  '/blog/inline/dnd-skills/skills-check-not-save.webp',
  '/blog/inline/dnd-skills/skills-hide-help-year.webp',
] as const;
const ZH_INLINE_PATHS = [
  '/blog/inline/dnd-skills/skills-ability-map-zh.webp',
  '/blog/inline/dnd-skills/skills-name-traps-zh.webp',
  '/blog/inline/dnd-skills/skills-check-bonus-zh.webp',
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

describe('dnd skills blog post', () => {
  test('publishes a bilingual skills guide without overwriting sibling articles', () => {
    const englishPost = getBlogPost('en', DND_SKILLS_SLUG);
    const chinesePost = getBlogPost('zh', DND_SKILLS_SLUG);
    const conditionsPost = getBlogPost('en', 'dnd-conditions');
    const mindFlayerPost = getBlogPost('en', 'mind-flayer-dnd');
    const playersHandbookPost = getBlogPost('en', 'players-handbook-dnd-5e');

    expect(englishPost?.title).toBe('DnD Skills: Eighteen Names, Constitution Has No Skill');
    expect(englishPost?.seoTitle).toBe('DnD Skills: Eighteen Names, Constitution Has No Skill');
    expect(englishPost?.metaDescription).toBe(
      "Copy tonight's eighteen dnd skills from 2014 or 2024. Constitution has no skill. Add d20 + the ability modifier + proficiency bonus if you are proficient.",
    );
    expect(englishPost?.excerpt).toBe(
      "Copy tonight's eighteen dnd skills from 2014 or 2024. Constitution has no skill; add d20 + the ability modifier + proficiency bonus if proficient.",
    );
    expect(englishPost?.updatedAt).toBe('2026-09-13');
    expect(englishPost?.publishedAt).toBe('2026-09-13');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverLabel).toBe('Skills Guide');
    expect(englishPost?.readTime).toBe('12 min read');
    expect(englishPost?.bodyHtml).toContain('Lock 2014 or 2024 before you copy a skill line');
    expect(englishPost?.bodyHtml).toContain('Constitution has no skill');
    expect(englishPost?.bodyHtml).toContain('FAQ about dnd skills');
    expect(englishPost?.bodyHtml).not.toContain('used here');
    expect(englishPost?.bodyHtml).not.toContain('对照短机械');
    expect(englishPost?.bodyHtml).not.toContain('${SKILLS_');
    expect(englishPost?.bodyHtml).not.toContain('${EN_');
    expect(englishPost?.bodyHtml).not.toContain('${DND_');
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
      'dnd 5e 技能：体操对回特技，生存对回求生，观察对回察觉',
    );
    expect(chinesePost?.seoTitle).toBe(
      'dnd 5e 技能（dnd skills）：体操对回特技，生存对回求生，观察对回察觉',
    );
    expect(chinesePost?.metaDescription).toBe(
      '开团前先认这张表：dnd 5e 技能是绑在属性上的 18 项，不是法术表。体质没有技能。体操对回特技，生存对回求生，观察或「感知技能」对回察觉，都不是第 19 项。没熟练仍能掷；有熟练只加一次熟练加值；专精是加倍，不是新技能。',
    );
    expect(chinesePost?.excerpt).toBe(
      '今晚这张 dnd 5e 技能是绑在属性上的 18 项，不是法术表。体质没有技能，表里没有体质行。体操对回特技，生存对回求生，观察或技能名「感知」对回察觉。没熟练仍做该技能相关检定，只是不加熟练加值。专精是已经熟练的那一行加倍，0 的两倍还是 0。2014 和 2024 这 18 个英文名没有增删。',
    );
    expect(chinesePost?.updatedAt).toBe('2026-09-13');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverLabel).toBe('技能指南');
    expect(chinesePost?.readTime).toBe('10 分钟阅读');
    expect(chinesePost?.bodyHtml).toContain('体操对回特技');
    expect(chinesePost?.bodyHtml).toContain('体质没有技能');
    expect(chinesePost?.bodyHtml).not.toContain('used here');
    expect(chinesePost?.bodyHtml).not.toContain('对照短机械');
    expect(chinesePost?.bodyHtml).not.toContain('${SKILLS_');
    expect(chinesePost?.bodyHtml).not.toContain('${ZH_');
    expect(chinesePost?.bodyHtml).not.toContain('${HUIJI_');
    expect(chinesePost?.bodyHtml).not.toContain('常见问题');
    expect(chinesePost?.bodyHtml).not.toContain('FAQ about dnd skills');
    for (const inlinePath of ZH_INLINE_PATHS) {
      expect(chinesePost?.bodyHtml).toContain(inlinePath);
    }
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('lite-video');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    expect(conditionsPost?.slug).toBe('dnd-conditions');
    expect(mindFlayerPost?.slug).toBe('mind-flayer-dnd');
    expect(playersHandbookPost?.slug).toBe('players-handbook-dnd-5e');
  });

  test('exposes locked metadata, schemas, sitemap routes, WebP assets, and llms discovery', () => {
    const englishPost = getBlogPost('en', DND_SKILLS_SLUG);
    const chinesePost = getBlogPost('zh', DND_SKILLS_SLUG);

    expect(getBlogPostPath('en', DND_SKILLS_SLUG)).toBe('/blog/dnd-skills');
    expect(getBlogPostPath('zh', DND_SKILLS_SLUG)).toBe('/zh/blog/dnd-skills');
    expect(createBlogPostMetadata('en', DND_SKILLS_SLUG)).toMatchObject({
      title: 'DnD Skills: Eighteen Names, Constitution Has No Skill',
      description:
        "Copy tonight's eighteen dnd skills from 2014 or 2024. Constitution has no skill. Add d20 + the ability modifier + proficiency bonus if you are proficient.",
      alternates: {
        canonical: '/blog/dnd-skills',
        languages: {
          'x-default': '/blog/dnd-skills',
          'en-US': '/blog/dnd-skills',
          'zh-CN': '/zh/blog/dnd-skills',
        },
      },
    });
    expect(createBlogPostMetadata('zh', DND_SKILLS_SLUG)).toMatchObject({
      title: 'dnd 5e 技能（dnd skills）：体操对回特技，生存对回求生，观察对回察觉',
      description:
        '开团前先认这张表：dnd 5e 技能是绑在属性上的 18 项，不是法术表。体质没有技能。体操对回特技，生存对回求生，观察或「感知技能」对回察觉，都不是第 19 项。没熟练仍能掷；有熟练只加一次熟练加值；专精是加倍，不是新技能。',
      alternates: {
        canonical: '/zh/blog/dnd-skills',
        languages: {
          'x-default': '/blog/dnd-skills',
          'en-US': '/blog/dnd-skills',
          'zh-CN': '/zh/blog/dnd-skills',
        },
      },
    });

    expect(buildBlogPostStructuredData('en', DND_SKILLS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-13',
      dateModified: '2026-09-13',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-skills',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-skills-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_SKILLS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-13',
      dateModified: '2026-09-13',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-skills',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-skills-guide.webp'],
    });

    const englishFaqSchema = buildBlogPostFaqStructuredData('en', DND_SKILLS_SLUG);
    expect(englishFaqSchema).toMatchObject({ '@type': 'FAQPage' });
    expect(
      englishFaqSchema?.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(englishPost?.faqItems);
    expect(buildBlogPostFaqStructuredData('zh', DND_SKILLS_SLUG)).toBeNull();
    expect(chinesePost?.faqItems ?? []).toHaveLength(0);

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-skills',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-skills',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-skills',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-skills')).toMatchObject({
      lastModified: new Date('2026-09-13'),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-skills')).toMatchObject({
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
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-skills');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-skills');
    expect(llmsText).toContain('DnD Skills: Eighteen Names, Constitution Has No Skill');
    expect(llmsText).toContain(
      "Copy tonight's eighteen dnd skills from 2014 or 2024. Constitution has no skill; add d20 + the ability modifier + proficiency bonus if proficient.",
    );
    expect(llmsText).toContain('dnd 5e 技能：体操对回特技，生存对回求生，观察对回察觉');
    expect(llmsText).toContain(
      '今晚这张 dnd 5e 技能是绑在属性上的 18 项，不是法术表。体质没有技能，表里没有体质行。体操对回特技，生存对回求生，观察或技能名「感知」对回察觉。没熟练仍做该技能相关检定，只是不加熟练加值。专精是已经熟练的那一行加倍，0 的两倍还是 0。2014 和 2024 这 18 个英文名没有增删。',
    );
  });
});
