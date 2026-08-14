import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from './index';

const DND_LANGUAGES_SLUG = 'dnd-languages';
const COVER_PATH = '/blog/covers/en/dnd-languages-guide.webp';

describe('dnd languages blog post', () => {
  test('publishes the 2024-first bilingual language-selection guide', () => {
    const englishPost = getBlogPost('en', DND_LANGUAGES_SLUG);
    const chinesePost = getBlogPost('zh', DND_LANGUAGES_SLUG);

    expect(englishPost?.updatedAt).toBe('2026-08-14');
    expect(englishPost?.bodyHtml).toContain('Common plus two choices from the Standard Languages table');
    expect(englishPost?.bodyHtml).toContain('2014 and 2024 language choices are not the same process');
    expect(englishPost?.bodyHtml).toContain('Pick your two languages with four questions');
    expect(englishPost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.faqItems).toHaveLength(4);

    expect(chinesePost?.updatedAt).toBe('2026-08-14');
    expect(chinesePost?.bodyHtml).toContain('先记住 2024 版的结论');
    expect(chinesePost?.bodyHtml).toContain('2014 和 2024 的语言选择流程并不一样');
    expect(chinesePost?.bodyHtml).toContain('用四个问题选出你的两门语言');
    expect(chinesePost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.faqItems).toHaveLength(4);
  });

  test('exposes bilingual routes, metadata, schema, asset, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_LANGUAGES_SLUG)).toBe('/blog/dnd-languages');
    expect(getBlogPostPath('zh', DND_LANGUAGES_SLUG)).toBe('/zh/blog/dnd-languages');
    expect(createBlogPostMetadata('en', DND_LANGUAGES_SLUG)).toMatchObject({
      title: 'D&D Languages: One for Your Past, One for the Campaign',
      description:
        'Use four 2024 D&D questions to separate standard from rare languages, match the campaign, and turn your character’s past into a usable hook.',
      alternates: { canonical: '/blog/dnd-languages' },
    });
    expect(createBlogPostMetadata('zh', DND_LANGUAGES_SLUG)).toMatchObject({
      title: 'DND 语言：一门写角色过去，一门留给战役',
      description:
        '用四个问题分清 2024 的标准与异域语言：一门从角色过去出发，一门对准战役地点、人物或线索。',
      alternates: { canonical: '/zh/blog/dnd-languages' },
    });
    expect(buildBlogPostStructuredData('en', DND_LANGUAGES_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-14',
      dateModified: '2026-08-14',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-languages',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-languages-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_LANGUAGES_SLUG)).toMatchObject({
      '@type': 'Article',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-languages',
    });
    expect(buildBlogPostFaqStructuredData('en', DND_LANGUAGES_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: 'How many languages does a 2024 D&D character know?' }),
      ]),
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_LANGUAGES_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: '2024 版 DND 角色一开始会几门语言？' }),
      ]),
    });
    expect(existsSync('public/blog/covers/en/dnd-languages-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-languages');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-languages');
  });
});
