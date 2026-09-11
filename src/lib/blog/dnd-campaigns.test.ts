import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPageCount,
  getBlogPost,
  getBlogPostPath,
  getBlogPostsForPage,
} from './index';

const DND_CAMPAIGNS_SLUG = 'dnd-campaigns';

describe('dnd campaigns blog post', () => {
  test('publishes the bilingual official-product chooser without cover or FAQ', () => {
    const englishPost = getBlogPost('en', DND_CAMPAIGNS_SLUG);
    const chinesePost = getBlogPost('zh', DND_CAMPAIGNS_SLUG);

    expect(englishPost).toBeDefined();
    expect(englishPost?.slug).toBe(DND_CAMPAIGNS_SLUG);
    expect(englishPost?.updatedAt).toBe('2026-09-11');
    expect(englishPost?.bodyHtml).toContain('This page is a decision guide. It is not a ranking.');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBeUndefined();
    expect(englishPost?.faqItems).toBeUndefined();

    expect(chinesePost).toBeDefined();
    expect(chinesePost?.slug).toBe(DND_CAMPAIGNS_SLUG);
    expect(chinesePost?.updatedAt).toBe('2026-09-11');
    expect(chinesePost?.bodyHtml).toContain('本稿是对照选型，不是排行。');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBeUndefined();
    expect(chinesePost?.faqItems).toBeUndefined();
  });

  test('exposes bilingual routes, metadata, schema, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_CAMPAIGNS_SLUG)).toBe('/blog/dnd-campaigns');
    expect(getBlogPostPath('zh', DND_CAMPAIGNS_SLUG)).toBe('/zh/blog/dnd-campaigns');
    expect(createBlogPostMetadata('en', DND_CAMPAIGNS_SLUG)).toMatchObject({
      title: 'DnD Campaigns: Match Official Products to Your Table',
      description:
        'Shortlist official D&D campaigns with five questions: who is DMing, horror, level band, 2014 book vs 2024 Greyhawk, and same party vs drop-in. Not a ranking.',
      alternates: { canonical: '/blog/dnd-campaigns' },
    });
    expect(createBlogPostMetadata('zh', DND_CAMPAIGNS_SLUG)).toMatchObject({
      title: 'DND模组怎么选：按气氛、等级带和规则年版挑官方现成书',
      description:
        '对照官方现成冒险和组织赛，不是排行。先看地下城主熟不熟、气氛、2014 还是 2024、等级跨度，以及能不能接受恐怖；官方页没写完成小时就不编。凡达林三本怎么分、哥特丛林城市巨人各对哪本，以及已跑矿坑或只要单场时先别买。',
      alternates: { canonical: '/zh/blog/dnd-campaigns' },
    });
    expect(buildBlogPostStructuredData('en', DND_CAMPAIGNS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-11',
      dateModified: '2026-09-11',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-campaigns',
    });
    expect(buildBlogPostStructuredData('zh', DND_CAMPAIGNS_SLUG)).toMatchObject({
      '@type': 'Article',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-campaigns',
    });
    expect(buildBlogPostFaqStructuredData('en', DND_CAMPAIGNS_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_CAMPAIGNS_SLUG)).toBeNull();

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-campaigns');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-campaigns');

    expect(getBlogPageCount('en')).toBe(6);
    expect(getBlogPageCount('zh')).toBe(6);
    expect(getBlogPostsForPage('en', 6)).toHaveLength(5);
    expect(getBlogPostsForPage('zh', 6)).toHaveLength(5);
    expect(getBlogPostsForPage('en', 1)[0]?.slug).toBe('dnd-dragonborn');
    expect(getBlogPostsForPage('zh', 1)[0]?.slug).toBe('dnd-dragonborn');
  });
});
