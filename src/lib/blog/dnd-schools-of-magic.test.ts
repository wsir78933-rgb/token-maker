// @vitest-environment jsdom

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  DND_SCHOOLS_OF_MAGIC_CHINESE_COVER_ALT,
  DND_SCHOOLS_OF_MAGIC_CHINESE_DESCRIPTION,
  DND_SCHOOLS_OF_MAGIC_CHINESE_H1,
  DND_SCHOOLS_OF_MAGIC_CHINESE_SEO_TITLE,
  DND_SCHOOLS_OF_MAGIC_ENGLISH_COVER_ALT,
  DND_SCHOOLS_OF_MAGIC_ENGLISH_DESCRIPTION,
  DND_SCHOOLS_OF_MAGIC_ENGLISH_H1,
  DND_SCHOOLS_OF_MAGIC_ENGLISH_SEO_TITLE,
  DND_SCHOOLS_OF_MAGIC_LOCKED_EN_BODY_HASH,
  DND_SCHOOLS_OF_MAGIC_LOCKED_ZH_BODY_HASH,
  DND_SCHOOLS_OF_MAGIC_PUBLIC_SOURCE_URLS,
  DND_SCHOOLS_OF_MAGIC_RELATED_SLUGS,
  DND_SCHOOLS_OF_MAGIC_SLUG,
  DND_SCHOOLS_OF_MAGIC_UPDATED_AT,
  dndSchoolsOfMagicArticleHtml,
  dndSchoolsOfMagicArticleHtmlZh,
} from '@/lib/blog-posts/dnd-schools-of-magic';
import {
  DND_SCHOOLS_OF_MAGIC_COVER_PATH,
  DND_SCHOOLS_OF_MAGIC_ZH_COVER_PATH,
  DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_IMAGE_PATH,
  DND_SCHOOLS_OF_MAGIC_CASTERS_ZH_IMAGE_PATH,
} from '@/lib/blog-posts/shared';
import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPageCount,
  getBlogPost,
  getBlogPostPath,
  getBlogPostsForPage,
  getFeaturedBlogPost,
} from './index';

const LOCKED_EN_BODY_PATH =
  '/Users/wusir/Desktop/工作/dnd-schools-of-magic-blog-content-package/locked-body-en-f2.md';

const ENGLISH_FIGURE_ONE_CAPTION =
  'Eight spell-school categories, each paired with one checked 2024 example.';
const ENGLISH_FIGURE_TWO_CAPTION =
  'A school label, a class spell list, and a Wizard subclass answer different questions.';
const ENGLISH_FIGURE_THREE_CAPTION =
  'Version labels can change a spell’s school and the conditions for reading a school with Detect Magic.';
const CHINESE_FIGURE_ONE_CAPTION =
  '插画呈现奇幻施法场景；列表对照八个法术学派及已核验的 2024 年法术示例。';
const CHINESE_FIGURE_TWO_CAPTION =
  '法术分类、职业法术列表和法师子职不是同一层规则信息。';
const CHINESE_FIGURE_THREE_CAPTION =
  '同名法术的学派标签与查验条件必须按规则版本核对。';

function sha256File(path: string): string {
  if (!existsSync(path)) {
    throw new Error(`Locked body file is missing: ${path}`);
  }

  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function getSitemapEntry(url: string) {
  const entry = sitemap().find((candidate) => candidate.url === url);

  if (!entry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return entry;
}

function expectRelatedSlugsResolve(
  locale: 'en' | 'zh',
  relatedSlugs: readonly string[] | undefined,
) {
  if (!relatedSlugs || relatedSlugs.length === 0) {
    throw new Error(`Expected relatedSlugs for locale=${locale}.`);
  }

  for (const relatedSlug of relatedSlugs) {
    const relatedPost = getBlogPost(locale, relatedSlug);
    if (!relatedPost) {
      throw new Error(
        `relatedSlugs includes unresolvable slug for locale=${locale}: ${relatedSlug}`,
      );
    }
  }
}

describe('dnd schools of magic blog post', () => {
  test('keeps the English source hash, locks the revised Chinese body, and publishes both locales', () => {
    expect(sha256File(LOCKED_EN_BODY_PATH)).toBe(DND_SCHOOLS_OF_MAGIC_LOCKED_EN_BODY_HASH);
    expect(createHash('sha256').update(dndSchoolsOfMagicArticleHtmlZh).digest('hex')).toBe(
      DND_SCHOOLS_OF_MAGIC_LOCKED_ZH_BODY_HASH,
    );

    const englishPost = getBlogPost('en', DND_SCHOOLS_OF_MAGIC_SLUG);
    const chinesePost = getBlogPost('zh', DND_SCHOOLS_OF_MAGIC_SLUG);
    const wizardPost = getBlogPost('en', 'dnd-wizard-spells');
    const necromancerPost = getBlogPost('en', 'dnd-necromancer-spells');

    if (!englishPost?.bodyHtml) {
      throw new Error('Expected published English dnd-schools-of-magic bodyHtml.');
    }
    if (!chinesePost?.bodyHtml) {
      throw new Error('Expected published Chinese dnd-schools-of-magic bodyHtml.');
    }

    const englishHtml = englishPost.bodyHtml;
    const chineseHtml = chinesePost.bodyHtml;

    expect(englishPost?.slug).toBe(DND_SCHOOLS_OF_MAGIC_SLUG);
    expect(englishPost?.title).toBe(DND_SCHOOLS_OF_MAGIC_ENGLISH_H1);
    expect(englishPost?.seoTitle).toBe(DND_SCHOOLS_OF_MAGIC_ENGLISH_SEO_TITLE);
    expect(englishPost?.seoTitle).not.toContain(' | Token Maker');
    expect(englishPost?.metaDescription).toBe(DND_SCHOOLS_OF_MAGIC_ENGLISH_DESCRIPTION);
    expect(englishPost?.excerpt).toBe(DND_SCHOOLS_OF_MAGIC_ENGLISH_DESCRIPTION);
    expect(englishPost?.publishedAt).toBe(DND_SCHOOLS_OF_MAGIC_UPDATED_AT);
    expect(englishPost?.updatedAt).toBe(DND_SCHOOLS_OF_MAGIC_UPDATED_AT);
    expect(englishPost?.coverImage).toBe(DND_SCHOOLS_OF_MAGIC_COVER_PATH);
    expect(englishPost?.coverAlt).toBe(DND_SCHOOLS_OF_MAGIC_ENGLISH_COVER_ALT);
    expect(englishPost?.featured).toBe(true);
    expect(englishPost?.faqItems).toEqual([]);
    expect(englishPost?.relatedSlugs).toEqual([...DND_SCHOOLS_OF_MAGIC_RELATED_SLUGS]);
    expectRelatedSlugsResolve('en', englishPost?.relatedSlugs);

    expect(englishHtml).toContain(
      'The phrase <code>dnd schools of magic</code> refers to eight spell categories in the 2024 revised core rules',
    );
    expect(englishHtml).toContain(ENGLISH_FIGURE_ONE_CAPTION);
    expect(englishHtml).toContain(ENGLISH_FIGURE_TWO_CAPTION);
    expect(englishHtml).toContain(ENGLISH_FIGURE_THREE_CAPTION);
    expect(englishHtml).toContain(DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_IMAGE_PATH);
    expect(englishHtml).not.toContain(DND_SCHOOLS_OF_MAGIC_CASTERS_ZH_IMAGE_PATH);
    expect((englishHtml.match(/<figure\b/g) ?? []).length).toBe(3);
    expect((englishHtml.match(/<img\b/g) ?? []).length).toBe(1);
    expect(englishHtml).not.toMatch(/<h1\b/i);
    expect(englishHtml).not.toContain('__SCHOOLS_');
    expect(englishHtml).not.toContain('tokenmaker');
    expect(englishHtml).not.toContain('href="/blog/');
    expect(englishHtml).not.toContain('FAQPage');
    expect(englishHtml).not.toMatch(/FAQ|常见问题/);
    expect(englishHtml).not.toContain('<iframe');
    expect(englishHtml).not.toContain('lite-video');
    expect(englishHtml).not.toContain('data-video-id=');
    for (const sourceUrl of DND_SCHOOLS_OF_MAGIC_PUBLIC_SOURCE_URLS) {
      expect(englishHtml).toContain(sourceUrl);
    }

    expect(chinesePost?.slug).toBe(DND_SCHOOLS_OF_MAGIC_SLUG);
    expect(chinesePost?.title).toBe(DND_SCHOOLS_OF_MAGIC_CHINESE_H1);
    expect(chinesePost?.seoTitle).toBe(DND_SCHOOLS_OF_MAGIC_CHINESE_SEO_TITLE);
    expect(chinesePost?.seoTitle).not.toContain(' | Token Maker');
    expect(chinesePost?.metaDescription).toBe(DND_SCHOOLS_OF_MAGIC_CHINESE_DESCRIPTION);
    expect(chinesePost?.excerpt).toBe(DND_SCHOOLS_OF_MAGIC_CHINESE_DESCRIPTION);
    expect(chinesePost?.coverImage).toBe(DND_SCHOOLS_OF_MAGIC_ZH_COVER_PATH);
    expect(chinesePost?.coverAlt).toBe(DND_SCHOOLS_OF_MAGIC_CHINESE_COVER_ALT);
    expect(chinesePost?.featured).toBe(true);
    expect(chinesePost?.faqItems).toEqual([]);
    expect(chinesePost?.relatedSlugs).toEqual([...DND_SCHOOLS_OF_MAGIC_RELATED_SLUGS]);
    expectRelatedSlugsResolve('zh', chinesePost?.relatedSlugs);
    expect(chineseHtml).toContain(
      '在 2024 修订版核心规则里，<code>法术学派</code> 是为法术划分的 <strong>八种类别</strong>',
    );
    expect(chineseHtml).toContain(CHINESE_FIGURE_ONE_CAPTION);
    expect(chineseHtml).toContain(CHINESE_FIGURE_TWO_CAPTION);
    expect(chineseHtml).toContain(CHINESE_FIGURE_THREE_CAPTION);
    expect(chineseHtml).toContain(DND_SCHOOLS_OF_MAGIC_CASTERS_ZH_IMAGE_PATH);
    expect(chineseHtml).not.toContain(DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_IMAGE_PATH);
    expect((chineseHtml.match(/<figure\b/g) ?? []).length).toBe(3);
    expect(chineseHtml).not.toMatch(/<h1\b/i);
    expect(chineseHtml).not.toContain('__SCHOOLS_');
    expect(chineseHtml).not.toContain('tokenmaker');
    expect(chineseHtml).not.toContain('href="/blog/');
    expect(chineseHtml).not.toMatch(/FAQ|FAQPage|常见问题/);
    for (const sourceUrl of DND_SCHOOLS_OF_MAGIC_PUBLIC_SOURCE_URLS) {
      expect(chineseHtml).toContain(sourceUrl);
    }

    expect(wizardPost?.slug).toBe('dnd-wizard-spells');
    expect(necromancerPost?.slug).toBe('dnd-necromancer-spells');
    expect(wizardPost?.bodyHtml).not.toContain('dnd-schools-of-magic');
  });

  test('uses an absolute Chinese metadata title and preserves branded English social titles', () => {
    expect(getBlogPostPath('en', DND_SCHOOLS_OF_MAGIC_SLUG)).toBe('/blog/dnd-schools-of-magic');
    expect(getBlogPostPath('zh', DND_SCHOOLS_OF_MAGIC_SLUG)).toBe(
      '/zh/blog/dnd-schools-of-magic',
    );
    expect(createBlogPostMetadata('en', DND_SCHOOLS_OF_MAGIC_SLUG)).toMatchObject({
      title: DND_SCHOOLS_OF_MAGIC_ENGLISH_SEO_TITLE,
      description: DND_SCHOOLS_OF_MAGIC_ENGLISH_DESCRIPTION,
      alternates: {
        canonical: '/blog/dnd-schools-of-magic',
        languages: {
          'x-default': '/blog/dnd-schools-of-magic',
          'en-US': '/blog/dnd-schools-of-magic',
          'zh-CN': '/zh/blog/dnd-schools-of-magic',
        },
      },
      openGraph: {
        title: `${DND_SCHOOLS_OF_MAGIC_ENGLISH_SEO_TITLE} | Token Maker`,
        description: DND_SCHOOLS_OF_MAGIC_ENGLISH_DESCRIPTION,
      },
      twitter: {
        title: `${DND_SCHOOLS_OF_MAGIC_ENGLISH_SEO_TITLE} | Token Maker`,
        description: DND_SCHOOLS_OF_MAGIC_ENGLISH_DESCRIPTION,
      },
    });
    expect(createBlogPostMetadata('zh', DND_SCHOOLS_OF_MAGIC_SLUG)).toMatchObject({
      title: { absolute: DND_SCHOOLS_OF_MAGIC_CHINESE_SEO_TITLE },
      description: DND_SCHOOLS_OF_MAGIC_CHINESE_DESCRIPTION,
      alternates: {
        canonical: '/zh/blog/dnd-schools-of-magic',
        languages: {
          'x-default': '/blog/dnd-schools-of-magic',
          'en-US': '/blog/dnd-schools-of-magic',
          'zh-CN': '/zh/blog/dnd-schools-of-magic',
        },
      },
      openGraph: {
        title: DND_SCHOOLS_OF_MAGIC_CHINESE_SEO_TITLE,
        description: DND_SCHOOLS_OF_MAGIC_CHINESE_DESCRIPTION,
      },
      twitter: {
        title: DND_SCHOOLS_OF_MAGIC_CHINESE_SEO_TITLE,
        description: DND_SCHOOLS_OF_MAGIC_CHINESE_DESCRIPTION,
      },
    });
  });

  test('exposes locked schemas, sitemap routes, assets, and regular pagination exclusion', () => {
    expect(buildBlogPostStructuredData('en', DND_SCHOOLS_OF_MAGIC_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: DND_SCHOOLS_OF_MAGIC_ENGLISH_SEO_TITLE,
      datePublished: DND_SCHOOLS_OF_MAGIC_UPDATED_AT,
      dateModified: DND_SCHOOLS_OF_MAGIC_UPDATED_AT,
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-schools-of-magic',
      image: [`https://www.tokenmaker.one${DND_SCHOOLS_OF_MAGIC_COVER_PATH}`],
    });
    expect(buildBlogPostStructuredData('zh', DND_SCHOOLS_OF_MAGIC_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: DND_SCHOOLS_OF_MAGIC_CHINESE_SEO_TITLE,
      datePublished: DND_SCHOOLS_OF_MAGIC_UPDATED_AT,
      dateModified: DND_SCHOOLS_OF_MAGIC_UPDATED_AT,
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-schools-of-magic',
      image: [`https://www.tokenmaker.one${DND_SCHOOLS_OF_MAGIC_ZH_COVER_PATH}`],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_SCHOOLS_OF_MAGIC_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_SCHOOLS_OF_MAGIC_SLUG)).toBeNull();

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-schools-of-magic',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-schools-of-magic',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-schools-of-magic',
    };
    expect(getSitemapEntry('https://www.tokenmaker.one/blog/dnd-schools-of-magic')).toMatchObject({
      lastModified: new Date(DND_SCHOOLS_OF_MAGIC_UPDATED_AT),
      changeFrequency: 'monthly',
      priority: 0.72,
      alternates: { languages: expectedAlternates },
    });
    expect(getSitemapEntry('https://www.tokenmaker.one/zh/blog/dnd-schools-of-magic')).toMatchObject({
      lastModified: new Date(DND_SCHOOLS_OF_MAGIC_UPDATED_AT),
      changeFrequency: 'monthly',
      priority: 0.72,
      alternates: { languages: expectedAlternates },
    });

    expect(existsSync(`public${DND_SCHOOLS_OF_MAGIC_COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${DND_SCHOOLS_OF_MAGIC_ZH_COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_IMAGE_PATH}`)).toBe(true);
    expect(existsSync(`public${DND_SCHOOLS_OF_MAGIC_CASTERS_ZH_IMAGE_PATH}`)).toBe(true);

    expect(getFeaturedBlogPost('en')?.slug).toBe('dnd-classes-explained');
    expect(getFeaturedBlogPost('zh')?.slug).toBe('dnd-classes-explained');
    expect(getBlogPageCount('en')).toBe(7);
    expect(getBlogPageCount('zh')).toBe(7);
    for (const locale of ['en', 'zh'] as const) {
      expect(getBlogPostsForPage(locale, 1)[0]?.slug).toBe('dnd-halfling');
      const regularPostSlugs = Array.from(
        { length: getBlogPageCount(locale) },
        (_, pageIndex) => getBlogPostsForPage(locale, pageIndex + 1),
      ).flatMap((posts) => posts.map((post) => post.slug));
      expect(regularPostSlugs).not.toContain(DND_SCHOOLS_OF_MAGIC_SLUG);
    }
  });

  test('keeps figure edition labels visible without adding them to the generated TOC', () => {
    const englishPost = getBlogPost('en', DND_SCHOOLS_OF_MAGIC_SLUG);
    const chinesePost = getBlogPost('zh', DND_SCHOOLS_OF_MAGIC_SLUG);

    if (!englishPost?.bodyHtml) {
      throw new Error('Expected published English dnd-schools-of-magic bodyHtml.');
    }
    if (!chinesePost?.bodyHtml) {
      throw new Error('Expected published Chinese dnd-schools-of-magic bodyHtml.');
    }

    expect(englishPost.bodyHtml).toContain('<p style="margin-top:0;"><strong>2014</strong></p>');
    expect(englishPost.bodyHtml).toContain(
      '<p style="margin-top:0;"><strong>2024 revised</strong></p>',
    );
    expect(englishPost.bodyHtml).toContain(
      'aria-label="Edition comparison: in 2014, Cure Wounds is Evocation and Detect Magic has the listed 30-foot, visible-target, action, concentration, duration, and barrier conditions; in 2024, Cure Wounds is Abjuration and Detect Magic has its separately listed 30-foot, visible-target, Magic action, spell-created-effect, concentration, duration, and barrier conditions."',
    );
    expect(englishPost.bodyHtml).toContain('aria-label="2014 rules"');
    expect(englishPost.bodyHtml).toContain('aria-label="2024 revised rules"');
    expect(englishPost.bodyHtml).toContain(ENGLISH_FIGURE_THREE_CAPTION);
    expect(englishPost.bodyHtml).not.toContain('<h3 style="margin-top:0;">2014</h3>');
    expect(englishPost.bodyHtml).not.toContain('<h3 style="margin-top:0;">2024 revised</h3>');

    expect(chinesePost.bodyHtml).toContain('<p style="margin-top:0;"><strong>2014</strong></p>');
    expect(chinesePost.bodyHtml).toContain(
      '<p style="margin-top:0;"><strong>2024 修订版</strong></p>',
    );
    expect(chinesePost.bodyHtml).toContain(
      'aria-label="版次对照：2014 年疗伤术属于塑能，侦测魔法具有下列 30 英尺、可见目标、动作、专注、持续时间和屏障条件；2024 修订版疗伤术属于防护，侦测魔法分别具有下列 30 英尺、可见目标、魔法动作、法术创建效果、专注、持续时间和屏障条件。"',
    );
    expect(chinesePost.bodyHtml).toContain('aria-label="2014 规则"');
    expect(chinesePost.bodyHtml).toContain('aria-label="2024 修订版规则"');
    expect(chinesePost.bodyHtml).toContain(CHINESE_FIGURE_THREE_CAPTION);
    expect(chinesePost.bodyHtml).not.toContain('<h3 style="margin-top:0;">2014</h3>');
    expect(chinesePost.bodyHtml).not.toContain('<h3 style="margin-top:0;">2024 修订版</h3>');

    expect(englishPost.headings?.map((heading) => heading.text)).toEqual([
      'What a school of magic tells you',
      'D&D schools of magic: the eight categories at a glance',
      'Abjuration: protection and reversal',
      'Conjuration: movement and transport',
      'Divination: obtaining information',
      'Enchantment: effects on minds',
      'Evocation: magical energy and forceful effects',
      'Illusion: misleading perception or the mind',
      'Necromancy: life and death',
      'Transmutation: changing creatures or objects',
      'School label, class spell list, and Wizard subclass are separate layers',
      'A school label answers “what category is this spell in?”',
      'A class spell list answers “where can this spell be available?”',
      'A Wizard subclass answers “what does this class feature provide?”',
      'Use the individual spell entry for similar-looking effects',
      'Version differences and table use: check the rules year first',
      'What Detect Magic can reveal, and what it cannot',
      'A reusable school-label check',
      'Sources',
    ]);
    expect(chinesePost.headings?.map((heading) => heading.text)).toEqual([
      '法术学派到底指什么？',
      '八个法术学派：分类与示例对照',
      '防护：先问它保护什么',
      '咒法：移动与传送是线索',
      '预言：它试图取得什么信息',
      '惑控：影响心智不等于结果相同',
      '塑能：魔法能量形成的效果',
      '幻术：误导感知或心智',
      '死灵：生命与死亡的分类',
      '变化：改变生物或物体',
      '分清三层信息：法术学派、职业法术列表、法师子职',
      '法术学派只回答“它属于哪一类”',
      '职业法术列表回答“它从哪里可用”',
      '法师子职回答“这个职业分支提供什么特性”',
      '用具体法术分辨相近的效果',
      '版次差异：先核对年份，再判断标签',
      '侦测魔法的查验条件不能合并',
      '一套可以重复使用的学派核对顺序',
      '来源',
    ]);
    expect(englishPost.headings?.some((heading) => heading.text === '2014')).toBe(false);
    expect(englishPost.headings?.some((heading) => heading.text === '2024 revised')).toBe(false);
    expect(chinesePost.headings?.some((heading) => heading.text === '2014')).toBe(false);
    expect(chinesePost.headings?.some((heading) => heading.text === '2024 修订版')).toBe(false);
  });

  test('keeps all Chinese article text and accessible labels free of Latin words', () => {
    const chinesePost = getBlogPost('zh', DND_SCHOOLS_OF_MAGIC_SLUG);
    if (!chinesePost?.bodyHtml) {
      throw new Error('Expected Chinese bodyHtml for the readable-text language contract.');
    }

    const article = document.createElement('article');
    article.innerHTML = chinesePost.bodyHtml;
    expect(article.textContent).not.toMatch(/[A-Za-z]/);
    for (const text of [
      chinesePost.title,
      chinesePost.seoTitle,
      chinesePost.metaDescription,
      chinesePost.excerpt,
      chinesePost.coverAlt,
      ...(chinesePost.headings ?? []).map((heading) => heading.text),
    ]) {
      expect(text).toEqual(expect.any(String));
      expect(text).not.toMatch(/[A-Za-z]/);
    }
    for (const element of article.querySelectorAll('[alt], [aria-label], [title]')) {
      for (const attribute of ['alt', 'aria-label', 'title']) {
        const readableLabel = element.getAttribute(attribute);
        if (readableLabel !== null) {
          expect(readableLabel).not.toBe('');
          expect(readableLabel).not.toMatch(/[A-Za-z]/);
        }
      }
    }
    expect(article.querySelectorAll('[lang="en"]').length).toBe(0);
    expect(article.querySelectorAll('figure').length).toBe(3);
    expect(article.querySelectorAll('img').length).toBe(1);
    expect(article.querySelector('img')?.getAttribute('src')).toBe(
      DND_SCHOOLS_OF_MAGIC_CASTERS_ZH_IMAGE_PATH,
    );
    expect(Array.from(article.querySelectorAll('table:first-of-type tbody tr'), (row) => [
      row.querySelector('td')?.textContent,
      row.querySelector('a')?.textContent,
    ])).toEqual([
      ['防护', '护盾术'],
      ['咒法', '迷踪步'],
      ['预言', '侦测魔法'],
      ['惑控', '魅惑人类'],
      ['塑能', '火球术'],
      ['幻术', '次级幻影'],
      ['死灵', '操纵死尸'],
      ['变化', '变形术'],
    ]);
    expect(article.querySelector('section[aria-label="2014 规则"]')?.textContent).toContain('塑能');
    expect(article.querySelector('section[aria-label="2024 修订版规则"]')?.textContent).toContain('防护');
    expect(article.querySelector('section[aria-label="2014 规则"]')?.textContent).toContain('3 英尺木材或泥土');
    expect(article.querySelector('section[aria-label="2024 修订版规则"]')?.textContent).toContain('1 英尺石头、泥土或木材');
  });

  test('preserves the English body and keeps each locale on its own image paths', () => {
    expect(createHash('sha256').update(dndSchoolsOfMagicArticleHtml).digest('hex')).toBe(
      '88f8ebcc0d612234bb6c993b8cf64aad58b3b339cedaac3b79e9790b2d28662b',
    );
    const englishPost = getBlogPost('en', DND_SCHOOLS_OF_MAGIC_SLUG);
    const chinesePost = getBlogPost('zh', DND_SCHOOLS_OF_MAGIC_SLUG);
    expect(englishPost?.coverImage).toBe(DND_SCHOOLS_OF_MAGIC_COVER_PATH);
    expect(chinesePost?.coverImage).toBe(DND_SCHOOLS_OF_MAGIC_ZH_COVER_PATH);
    expect(englishPost?.bodyHtml).toContain(DND_SCHOOLS_OF_MAGIC_EIGHT_SCHOOLS_IMAGE_PATH);
    expect(englishPost?.bodyHtml).not.toContain(DND_SCHOOLS_OF_MAGIC_CASTERS_ZH_IMAGE_PATH);
    expect(chinesePost?.bodyHtml).not.toContain('eight-schools-peer-grid');
    expect(createBlogPostMetadata('zh', DND_SCHOOLS_OF_MAGIC_SLUG)?.openGraph).toMatchObject({
      images: [{ url: `https://www.tokenmaker.one${DND_SCHOOLS_OF_MAGIC_ZH_COVER_PATH}` }],
    });
  });
});
