import { existsSync, readFileSync } from 'node:fs';
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
const COVER_PATH = '/blog/covers/en/dnd-campaigns.webp';
const ENGLISH_COVER_ALT =
  'A new Dungeon Master at a wooden table comparing three different adventure books, respectively featuring a snowy mountain, a mine lantern, and a broken obelisk';
const CHINESE_COVER_ALT = '一位新地下城主在木桌前比较三本不同的冒险书，分别带有雪山、矿洞灯和断裂方尖碑';

describe('dnd campaigns blog post', () => {
  test('publishes the bilingual official-product chooser with cover and without FAQ', () => {
    const englishPost = getBlogPost('en', DND_CAMPAIGNS_SLUG);
    const chinesePost = getBlogPost('zh', DND_CAMPAIGNS_SLUG);

    expect(englishPost).toBeDefined();
    expect(englishPost?.slug).toBe(DND_CAMPAIGNS_SLUG);
    expect(englishPost?.title).toBe('New DM? Compare DnD Campaigns by Player Count, Level, and Rules');
    expect(englishPost?.publishedAt).toBe('2026-09-11');
    expect(englishPost?.updatedAt).toBe('2026-09-24');
    expect(englishPost?.bodyHtml).toContain('Choose a candidate when those facts fit your table; keep any requirement the page doesn\'t establish open for verification.');
    expect(englishPost?.bodyHtml).not.toContain('data-video-id=');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.coverAlt).toBe(ENGLISH_COVER_ALT);
    expect(englishPost?.faqItems).toBeUndefined();

    expect(chinesePost).toBeDefined();
    expect(chinesePost?.slug).toBe(DND_CAMPAIGNS_SLUG);
    expect(chinesePost?.title).toBe('DND入门模组：第一次带朋友，从哪部开始？');
    expect(chinesePost?.publishedAt).toBe('2026-09-11');
    expect(chinesePost?.updatedAt).toBe('2026-09-24');
    expect(chinesePost?.bodyHtml).toContain('没有明确偏好时，优先考察适用对象和玩家人数都对得上的候选；已有可用资料或明确等级目标时，再让这些条件决定取舍。');
    expect(chinesePost?.bodyHtml).not.toContain('data-video-id=');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.coverAlt).toBe(CHINESE_COVER_ALT);
    expect(chinesePost?.faqItems).toBeUndefined();
  });

  test('exposes bilingual routes, metadata, schema, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_CAMPAIGNS_SLUG)).toBe('/blog/dnd-campaigns');
    expect(getBlogPostPath('zh', DND_CAMPAIGNS_SLUG)).toBe('/zh/blog/dnd-campaigns');
    expect(createBlogPostMetadata('en', DND_CAMPAIGNS_SLUG)).toMatchObject({
      title: 'New DM? Compare DnD Campaigns by Player Count, Level, and Rules',
      description:
        'Choose a first published adventure by checking official beginner wording, player counts, starting levels, and rules labels, with missing facts left to confirm.',
      alternates: { canonical: '/blog/dnd-campaigns' },
    });
    expect(createBlogPostMetadata('zh', DND_CAMPAIGNS_SLUG)).toMatchObject({
      title: 'DND入门模组：第一次带朋友，从哪部开始？',
      description:
        '比较《冰塔峰之龙》《失落矿坑》和《破碎方尖碑》，按新 DM 适用说明、可用资料和目标等级选定第一部冒险；人数或资料条件尚未确认时，明确下一步该核对什么。',
      alternates: { canonical: '/zh/blog/dnd-campaigns' },
    });
    expect(buildBlogPostStructuredData('en', DND_CAMPAIGNS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-11',
      dateModified: '2026-09-24',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-campaigns',
    });
    expect(buildBlogPostStructuredData('zh', DND_CAMPAIGNS_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-11',
      dateModified: '2026-09-24',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-campaigns',
    });
    expect(buildBlogPostFaqStructuredData('en', DND_CAMPAIGNS_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_CAMPAIGNS_SLUG)).toBeNull();

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-campaigns');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-campaigns');

    expect(getBlogPageCount('en')).toBe(7);
    expect(getBlogPageCount('zh')).toBe(7);
    expect(getBlogPostsForPage('en', 6)).toHaveLength(10);
    expect(getBlogPostsForPage('zh', 6)).toHaveLength(10);
    expect(getBlogPostsForPage('en', 7)).toHaveLength(6);
    expect(getBlogPostsForPage('zh', 7)).toHaveLength(6);
    expect(getBlogPostsForPage('en', 1)[0]?.slug).toBe('dnd-halfling');
    expect(getBlogPostsForPage('zh', 1)[0]?.slug).toBe('dnd-halfling');
    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
  });
});
