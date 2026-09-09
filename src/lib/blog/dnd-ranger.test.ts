import { existsSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
  getBlogPostsForPage,
} from './index';

const DND_RANGER_SLUG = 'dnd-ranger';
const COVER_PATH = '/blog/covers/en/dnd-ranger-guide.webp';
const INLINE_PATH = '/blog/inline/dnd-ranger/ranger-decision-plan.webp';
const VIDEO_PLACEHOLDER_PATH = '/blog/inline/dnd-ranger/dnd-ranger-video-placeholder.webp';
const VIDEO_ID = 'P_qzyTFSrTE';

describe('dnd ranger blog post', () => {
  test('publishes the independently written bilingual edition and party-role guide', () => {
    const englishPost = getBlogPost('en', DND_RANGER_SLUG);
    const chinesePost = getBlogPost('zh', DND_RANGER_SLUG);

    expect(englishPost?.title).toBe('DND Ranger Guide for 2014 and 2024 Rules');
    expect(englishPost?.seoTitle).toBe('DND Ranger Guide: Choose Your Edition and Party Role');
    expect(englishPost?.updatedAt).toBe('2026-09-09');
    expect(englishPost?.bodyHtml).toContain('What a Ranger does in a party');
    expect(englishPost?.bodyHtml).toContain('Pick the rules version before you build');
    expect(englishPost?.bodyHtml).toContain('Choose a subclass from the source you are using');
    expect(englishPost?.bodyHtml).toContain('A first-session Ranger decision card');
    expect(englishPost?.bodyHtml).toContain(
      'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger',
    );
    expect(englishPost?.bodyHtml).toContain(INLINE_PATH);
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).toContain('fetchpriority="low"');
    expect(englishPost?.bodyHtml).toContain(`data-video-id="${VIDEO_ID}"`);
    expect(englishPost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(englishPost?.bodyHtml).toContain('class="inline-embed inline-embed--video lite-video"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.faqItems).toBeUndefined();

    expect(chinesePost?.title).toBe('DND 游侠指南：从版本选择到 1 级职责与首回合');
    expect(chinesePost?.seoTitle).toBe('DND 游侠指南：2024 与 2014 版本、建卡与首回合');
    expect(chinesePost?.updatedAt).toBe('2026-09-09');
    expect(chinesePost?.bodyHtml).toContain('先确认版本，再判断游侠要解决什么问题');
    expect(chinesePost?.bodyHtml).toContain('用五个决定完成 1 级 Ranger');
    expect(chinesePost?.bodyHtml).toContain('第一场游戏前的决策卡');
    expect(chinesePost?.bodyHtml).toContain(
      'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Ranger',
    );
    expect(chinesePost?.bodyHtml).toContain(INLINE_PATH);
    expect(chinesePost?.bodyHtml).toContain(`data-video-id="${VIDEO_ID}"`);
    expect(chinesePost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.faqItems).toBeUndefined();
  });

  test('projects bilingual routes, metadata, Article schema, sitemap, cover, and WebP assets', () => {
    expect(getBlogPostPath('en', DND_RANGER_SLUG)).toBe('/blog/dnd-ranger');
    expect(getBlogPostPath('zh', DND_RANGER_SLUG)).toBe('/zh/blog/dnd-ranger');
    expect(createBlogPostMetadata('en', DND_RANGER_SLUG)).toMatchObject({
      title: 'DND Ranger Guide: Choose Your Edition and Party Role',
      description:
        'Build a DND Ranger with a clear 2014 or 2024 path, level 1–5 decisions, party-role checks, source-labeled subclasses, and an optional VTT token workflow.',
      alternates: {
        canonical: '/blog/dnd-ranger',
        languages: {
          'x-default': '/blog/dnd-ranger',
          'en-US': '/blog/dnd-ranger',
          'zh-CN': '/zh/blog/dnd-ranger',
        },
      },
      openGraph: {
        images: [{ url: `https://www.tokenmaker.one${COVER_PATH}` }],
      },
      twitter: {
        card: 'summary_large_image',
        images: [`https://www.tokenmaker.one${COVER_PATH}`],
      },
    });
    expect(createBlogPostMetadata('zh', DND_RANGER_SLUG)).toMatchObject({
      title: 'DND 游侠指南：2024 与 2014 版本、建卡与首回合',
      description:
        '先区分 2014 与 2024 Ranger，再按队伍职责安排属性、技能、装备和首回合；附 1–5 级检查点与可选 VTT Token 制作流程。',
      alternates: {
        canonical: '/zh/blog/dnd-ranger',
        languages: {
          'x-default': '/blog/dnd-ranger',
          'en-US': '/blog/dnd-ranger',
          'zh-CN': '/zh/blog/dnd-ranger',
        },
      },
      openGraph: {
        images: [{ url: `https://www.tokenmaker.one${COVER_PATH}` }],
      },
      twitter: {
        card: 'summary_large_image',
        images: [`https://www.tokenmaker.one${COVER_PATH}`],
      },
    });

    expect(buildBlogPostStructuredData('en', DND_RANGER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-09',
      dateModified: '2026-09-09',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-ranger',
      image: [`https://www.tokenmaker.one${COVER_PATH}`],
    });
    expect(buildBlogPostStructuredData('zh', DND_RANGER_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-09-09',
      dateModified: '2026-09-09',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-ranger',
      image: [`https://www.tokenmaker.one${COVER_PATH}`],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_RANGER_SLUG)).toBeNull();
    expect(buildBlogPostFaqStructuredData('zh', DND_RANGER_SLUG)).toBeNull();

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/dnd-ranger',
      'en-US': 'https://www.tokenmaker.one/blog/dnd-ranger',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/dnd-ranger',
    };
    for (const route of [
      'https://www.tokenmaker.one/blog/dnd-ranger',
      'https://www.tokenmaker.one/zh/blog/dnd-ranger',
    ]) {
      expect(sitemap().find((entry) => entry.url === route)).toMatchObject({
        lastModified: new Date('2026-09-09'),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: expectedAlternates },
      });
    }

    expect(getBlogPostsForPage('en', 6).map((post) => post.slug)).toContain(DND_RANGER_SLUG);
    expect(getBlogPostsForPage('zh', 6).map((post) => post.slug)).toContain(DND_RANGER_SLUG);

    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${INLINE_PATH}`)).toBe(true);
    expect(existsSync(`public${VIDEO_PLACEHOLDER_PATH}`)).toBe(true);
  });
});
