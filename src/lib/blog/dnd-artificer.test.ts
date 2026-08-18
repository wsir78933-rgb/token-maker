import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from './index';

const DND_ARTIFICER_SLUG = 'dnd-artificer';
const COVER_PATH = '/blog/covers/en/dnd-artificer-guide.webp';

describe('dnd artificer blog post', () => {
  test('publishes a current bilingual guide that separates the 2024 and 2014 rules', () => {
    const englishPost = getBlogPost('en', DND_ARTIFICER_SLUG);
    const chinesePost = getBlogPost('zh', DND_ARTIFICER_SLUG);

    expect(englishPost?.title).toBe('Which DND Artificer Fits Your Party Job?');
    expect(englishPost?.updatedAt).toBe('2026-08-17');
    expect(englishPost?.bodyHtml).toContain('Confirm the Artificer rules at your table');
    expect(englishPost?.bodyHtml).toContain('Pick a job before you pick a subclass');
    expect(englishPost?.bodyHtml).toContain('Reanimator');
    expect(englishPost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/efota');
    expect(englishPost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/rthw');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.faqItems).toHaveLength(5);

    expect(chinesePost?.title).toBe('哪个 DND Artificer 最适合你的队伍职责？');
    expect(chinesePost?.updatedAt).toBe('2026-08-17');
    expect(chinesePost?.bodyHtml).toContain('先确认你这桌使用哪套 Artificer 规则');
    expect(chinesePost?.bodyHtml).toContain('先选队伍职责，再选子职业');
    expect(chinesePost?.bodyHtml).toContain('Reanimator');
    expect(chinesePost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/efota');
    expect(chinesePost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/rthw');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.faqItems).toHaveLength(5);
  });

  test('exposes bilingual metadata, schema, cover, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_ARTIFICER_SLUG)).toBe('/blog/dnd-artificer');
    expect(getBlogPostPath('zh', DND_ARTIFICER_SLUG)).toBe('/zh/blog/dnd-artificer');
    expect(createBlogPostMetadata('en', DND_ARTIFICER_SLUG)).toMatchObject({
      title: 'Which DND Artificer Fits Your Party Job?',
      description:
        'Choose an Artificer from the job your party needs: support, front line, ranged firepower, companion play, maps, or horror science.',
      alternates: { canonical: '/blog/dnd-artificer' },
    });
    expect(createBlogPostMetadata('zh', DND_ARTIFICER_SLUG)).toMatchObject({
      title: '哪个 DND Artificer 最适合你的队伍职责？',
      description:
        '按队伍实际需要选择 Artificer：支援、前线、远程火力、构装伙伴、地图探索或惊悚工坊。',
      alternates: { canonical: '/zh/blog/dnd-artificer' },
    });
    expect(buildBlogPostStructuredData('en', DND_ARTIFICER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-17',
      dateModified: '2026-08-17',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-artificer',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-artificer-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_ARTIFICER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-17',
      dateModified: '2026-08-17',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-artificer',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-artificer-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_ARTIFICER_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: 'Where is the current Artificer published?' }),
      ]),
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_ARTIFICER_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: '当前 Artificer 收录在哪里？' }),
      ]),
    });
    expect(existsSync('public/blog/covers/en/dnd-artificer-guide.webp')).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-artificer');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-artificer');
  });
});
