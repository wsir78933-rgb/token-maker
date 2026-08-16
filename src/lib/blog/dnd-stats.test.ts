import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from './index';

const DND_STATS_SLUG = 'dnd-stats';
const COVER_PATH = '/blog/covers/en/dnd-stats-guide.webp';

describe('dnd stats blog post', () => {
  test('publishes the 2024-first bilingual ability-score assignment guide', () => {
    const englishPost = getBlogPost('en', DND_STATS_SLUG);
    const chinesePost = getBlogPost('zh', DND_STATS_SLUG);

    expect(englishPost?.title).toBe('All Six DnD Stats Explained for Your First Character');
    expect(englishPost?.updatedAt).toBe('2026-08-15');
    expect(englishPost?.bodyHtml).toContain('Start with the score, but use the modifier');
    expect(englishPost?.bodyHtml).toContain('Work through a level 1 Wizard example');
    expect(englishPost?.bodyHtml).toContain('Keep 2014 and 2024 ability increases separate');
    expect(englishPost?.bodyHtml).toContain(
      'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character',
    );
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.faqItems).toHaveLength(5);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe('新手 DND 六项属性详解：完成你的第一个角色');
    expect(chinesePost?.updatedAt).toBe('2026-08-15');
    expect(chinesePost?.bodyHtml).toContain('先看属性值，实际掷骰用调整值');
    expect(chinesePost?.bodyHtml).toContain('跟着一个 1 级法师算完全部属性');
    expect(chinesePost?.bodyHtml).toContain('不要混用 2014 与 2024 的属性加值');
    expect(chinesePost?.bodyHtml).toContain(
      'https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character',
    );
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.faqItems).toHaveLength(5);
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }
  });

  test('exposes bilingual metadata, schemas, cover, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_STATS_SLUG)).toBe('/blog/dnd-stats');
    expect(getBlogPostPath('zh', DND_STATS_SLUG)).toBe('/zh/blog/dnd-stats');
    expect(createBlogPostMetadata('en', DND_STATS_SLUG)).toMatchObject({
      title: 'All Six DnD Stats Explained for Your First Character',
      description:
        'Learn what all six DnD stats control, convert scores to modifiers, compare standard array, point cost, and 4d6, then assign them by class.',
      alternates: { canonical: '/blog/dnd-stats' },
    });
    expect(createBlogPostMetadata('zh', DND_STATS_SLUG)).toMatchObject({
      title: '新手 DND 六项属性详解：完成你的第一个角色',
      description:
        '读懂力量、敏捷、体质、智力、感知与魅力，计算属性调整值，对比标准数组、27 点购点和 4d6 去最低，再按职业分配六项能力值。',
      alternates: { canonical: '/zh/blog/dnd-stats' },
    });
    expect(buildBlogPostStructuredData('en', DND_STATS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-15',
      dateModified: '2026-08-15',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-stats',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-stats-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_STATS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-15',
      dateModified: '2026-08-15',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-stats',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-stats-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_STATS_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: 'What are the six stats in DnD?' }),
      ]),
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_STATS_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: 'DND 的六项属性是什么？' }),
      ]),
    });
    expect(existsSync('public/blog/covers/en/dnd-stats-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-stats');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-stats');
  });
});
