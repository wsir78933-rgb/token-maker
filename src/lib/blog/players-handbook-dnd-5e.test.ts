import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from './index';

const PLAYERS_HANDBOOK_DND_5E_SLUG = 'players-handbook-dnd-5e';
const COVER_PATH = '/blog/covers/en/players-handbook-dnd-5e-guide.webp';
const VIDEO_PLACEHOLDER_PATH =
  '/blog/inline/players-handbook-dnd-5e/players-handbook-video-placeholder.webp';

describe("D&D Player's Handbook blog post", () => {
  test('publishes a current bilingual 5e and 5.5e decision guide', () => {
    const englishPost = getBlogPost('en', PLAYERS_HANDBOOK_DND_5E_SLUG);
    const chinesePost = getBlogPost('zh', PLAYERS_HANDBOOK_DND_5E_SLUG);

    expect(englishPost?.title).toBe(
      "D&D Player's Handbook: Choose 5e (2014) or 5.5e (2024)",
    );
    expect(englishPost?.updatedAt).toBe('2026-08-19');
    expect(englishPost?.bodyHtml).toContain(
      'Pick the handbook that matches the campaign',
    );
    expect(englishPost?.bodyHtml).toContain('Read these sections before your first session');
    expect(englishPost?.bodyHtml).toContain('Use the official free rules before buying');
    expect(englishPost?.bodyHtml).toContain('data-video-id="WPBnLlqV0Z0"');
    expect(englishPost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.bodyHtml).not.toMatch(/search intent|this article|this guide will/i);
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.faqItems).toHaveLength(5);

    expect(chinesePost?.title).toBe('DND《玩家手册》怎么选：5e 与 5.5e 版本指南');
    expect(chinesePost?.updatedAt).toBe('2026-08-19');
    expect(chinesePost?.bodyHtml).toContain('按战役实际使用的版本选手册');
    expect(chinesePost?.bodyHtml).toContain('首场游戏前只读这些部分');
    expect(chinesePost?.bodyHtml).toContain('购买前先用官方免费规则');
    expect(chinesePost?.bodyHtml).toContain('data-video-id="WPBnLlqV0Z0"');
    expect(chinesePost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.bodyHtml).not.toContain('players handbook dnd 5e');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.faqItems).toHaveLength(5);

    for (const post of [englishPost, chinesePost]) {
      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('exposes localized metadata, schemas, routes, discovery, and WebP assets', () => {
    expect(getBlogPostPath('en', PLAYERS_HANDBOOK_DND_5E_SLUG)).toBe(
      '/blog/players-handbook-dnd-5e',
    );
    expect(getBlogPostPath('zh', PLAYERS_HANDBOOK_DND_5E_SLUG)).toBe(
      '/zh/blog/players-handbook-dnd-5e',
    );
    expect(createBlogPostMetadata('en', PLAYERS_HANDBOOK_DND_5E_SLUG)).toMatchObject({
      title: "D&D 5e Player's Handbook: 2014 or 2024, Which One?",
      description:
        "Compare the 2014 5e and 2024 5.5e books, confirm your campaign's ruleset, find the legal free rules, and read the right sections before play.",
      alternates: { canonical: '/blog/players-handbook-dnd-5e' },
    });
    expect(createBlogPostMetadata('zh', PLAYERS_HANDBOOK_DND_5E_SLUG)).toMatchObject({
      title: 'DND《玩家手册》指南：5e 与 5.5e 版本怎么选',
      description:
        '分清 2014 年 5e 与 2024 年 5.5e《玩家手册》，按当前战役选择规则，了解首场游戏前该读哪些章节，以及哪里能合法查看免费规则。',
      alternates: { canonical: '/zh/blog/players-handbook-dnd-5e' },
    });
    expect(buildBlogPostStructuredData('en', PLAYERS_HANDBOOK_DND_5E_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-19',
      dateModified: '2026-08-19',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/players-handbook-dnd-5e',
      image: ['https://www.tokenmaker.one/blog/covers/en/players-handbook-dnd-5e-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', PLAYERS_HANDBOOK_DND_5E_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-19',
      dateModified: '2026-08-19',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/players-handbook-dnd-5e',
      image: ['https://www.tokenmaker.one/blog/covers/en/players-handbook-dnd-5e-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', PLAYERS_HANDBOOK_DND_5E_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: 'Is the 2014 Player\'s Handbook still valid?' }),
      ]),
    });
    expect(buildBlogPostFaqStructuredData('zh', PLAYERS_HANDBOOK_DND_5E_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: '2014 版《玩家手册》现在还能用吗？' }),
      ]),
    });
    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${VIDEO_PLACEHOLDER_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain('https://www.tokenmaker.one/blog/players-handbook-dnd-5e');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/players-handbook-dnd-5e');
    expect(llmsText).toContain('DND《玩家手册》怎么选：5e 与 5.5e 版本指南');
  });
});
