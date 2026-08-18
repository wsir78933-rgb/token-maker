import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from './index';

const DND_PALADIN_SLUG = 'dnd-paladin';
const COVER_PATH = '/blog/covers/en/dnd-paladin-guide.webp';
const VIDEO_PLACEHOLDER_PATH =
  '/blog/inline/dnd-paladin/dnd-paladin-video-placeholder.webp';

describe('dnd paladin blog post', () => {
  test('publishes the 2024-first bilingual class and oath decision guide', () => {
    const englishPost = getBlogPost('en', DND_PALADIN_SLUG);
    const chinesePost = getBlogPost('zh', DND_PALADIN_SLUG);

    expect(englishPost?.title).toBe(
      'DnD Paladin Turn Plan: When to Heal, Smite, or Protect',
    );
    expect(englishPost?.excerpt).toBe(
      'Use a simple combat decision tree for attacks, Lay on Hands, Divine Smite, concentration, and positioning without wasting your action economy.',
    );
    expect(englishPost?.updatedAt).toBe('2026-08-18');
    expect(englishPost?.bodyHtml).toContain('Build levels 1–3 in five decisions');
    expect(englishPost?.bodyHtml).toContain('Choose an oath by the promise you can keep');
    expect(englishPost?.bodyHtml).toContain('Keep 2014 and 2024 Paladin rules separate');
    expect(englishPost?.bodyHtml).toContain('melee weapon or Unarmed Strike hit');
    expect(englishPost?.bodyHtml).toContain('one no-slot casting per Long Rest');
    expect(englishPost?.bodyHtml).toContain(
      "<td>Always-prepared spell cast as a Bonus Action immediately after a melee weapon or Unarmed Strike hit; Paladin's Smite grants one no-slot casting per Long Rest</td>",
    );
    expect(englishPost?.bodyHtml).toContain(
      'https://www.dndbeyond.com/posts/1749-2024-paladin-vs-2014-paladin-whats-new',
    );
    expect(englishPost?.bodyHtml).toContain('data-video-id="Ch5vWBPCrl0"');
    expect(englishPost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(englishPost?.bodyHtml).toContain('loading="lazy"');
    expect(englishPost?.bodyHtml).not.toContain('<iframe');
    expect(englishPost?.coverImage).toBe(COVER_PATH);
    expect(englishPost?.faqItems).toHaveLength(5);
    for (const faqItem of englishPost?.faqItems ?? []) {
      expect(englishPost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(englishPost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }

    expect(chinesePost?.title).toBe(
      '龙与地下城圣武士回合计划：何时治疗、惩击或保护队友？',
    );
    expect(chinesePost?.excerpt).toBe(
      '用简单的战斗决策流程安排攻击、圣疗、神圣惩击、维持专注与站位，在治疗、爆发和保护队友之间做出清楚选择，避免浪费行动资源。',
    );
    expect(chinesePost?.updatedAt).toBe('2026-08-18');
    expect(chinesePost?.bodyHtml).toContain('用五个决定完成 1–3 级角色');
    expect(chinesePost?.bodyHtml).toContain('按你能守住的承诺选择誓言');
    expect(chinesePost?.bodyHtml).toContain('分清 2014 与 2024 Paladin 规则');
    expect(chinesePost?.bodyHtml).toContain('近战武器或徒手打击命中后');
    expect(chinesePost?.bodyHtml).toContain('每次 Long Rest 提供一次不消耗法术位的施放');
    expect(chinesePost?.bodyHtml).toContain(
      "<td>近战武器或徒手打击命中后立刻以 Bonus Action 施放的常备法术；Paladin's Smite 每次 Long Rest 提供一次不消耗法术位的施放</td>",
    );
    expect(chinesePost?.bodyHtml).toContain(
      'https://www.dndbeyond.com/posts/1749-2024-paladin-vs-2014-paladin-whats-new',
    );
    expect(chinesePost?.bodyHtml).toContain('data-video-id="Ch5vWBPCrl0"');
    expect(chinesePost?.bodyHtml).toContain(`src="${VIDEO_PLACEHOLDER_PATH}"`);
    expect(chinesePost?.bodyHtml).toContain('loading="lazy"');
    expect(chinesePost?.bodyHtml).not.toContain('<iframe');
    expect(chinesePost?.coverImage).toBe(COVER_PATH);
    expect(chinesePost?.faqItems).toHaveLength(5);
    for (const faqItem of chinesePost?.faqItems ?? []) {
      expect(chinesePost?.bodyHtml).toContain(`>${faqItem.question}</h3>`);
      expect(chinesePost?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
    }
  });

  test('exposes the locked bilingual metadata, schemas, assets, and llms discovery', () => {
    expect(getBlogPostPath('en', DND_PALADIN_SLUG)).toBe('/blog/dnd-paladin');
    expect(getBlogPostPath('zh', DND_PALADIN_SLUG)).toBe('/zh/blog/dnd-paladin');
    expect(createBlogPostMetadata('en', DND_PALADIN_SLUG)).toMatchObject({
      title: 'DnD Paladin Turn Plan: When to Heal, Smite, or Protect',
      description:
        'Use a simple combat decision tree for attacks, Lay on Hands, Divine Smite, concentration, and positioning without wasting your action economy.',
      alternates: { canonical: '/blog/dnd-paladin' },
    });
    expect(createBlogPostMetadata('zh', DND_PALADIN_SLUG)).toMatchObject({
      title: '龙与地下城圣武士回合计划：何时治疗、惩击或保护队友？',
      description:
        '用简单的战斗决策流程安排攻击、圣疗、神圣惩击、维持专注与站位，在治疗、爆发和保护队友之间做出清楚选择，避免浪费行动资源。',
      alternates: { canonical: '/zh/blog/dnd-paladin' },
    });
    expect(buildBlogPostStructuredData('en', DND_PALADIN_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-18',
      dateModified: '2026-08-18',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-paladin',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-paladin-guide.webp'],
    });
    expect(buildBlogPostStructuredData('zh', DND_PALADIN_SLUG)).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-18',
      dateModified: '2026-08-18',
      inLanguage: 'zh-CN',
      url: 'https://www.tokenmaker.one/zh/blog/dnd-paladin',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-paladin-guide.webp'],
    });
    expect(buildBlogPostFaqStructuredData('en', DND_PALADIN_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: 'Does a DnD Paladin need a god?' }),
      ]),
    });
    expect(buildBlogPostFaqStructuredData('zh', DND_PALADIN_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ name: 'DND Paladin 圣武士必须信仰神明吗？' }),
      ]),
    });
    expect(existsSync(`public${COVER_PATH}`)).toBe(true);
    expect(existsSync(`public${VIDEO_PLACEHOLDER_PATH}`)).toBe(true);

    const llmsText = readFileSync('public/llms.txt', 'utf8');
    expect(llmsText).toContain(
      '- [DnD Paladin Turn Plan: When to Heal, Smite, or Protect](https://www.tokenmaker.one/blog/dnd-paladin): Use a simple combat decision tree for attacks, Lay on Hands, Divine Smite, concentration, and positioning without wasting your action economy.',
    );
    expect(llmsText).toContain(
      '- [龙与地下城圣武士回合计划：何时治疗、惩击或保护队友？](https://www.tokenmaker.one/zh/blog/dnd-paladin): 用简单的战斗决策流程安排攻击、圣疗、神圣惩击、维持专注与站位，在治疗、爆发和保护队友之间做出清楚选择，避免浪费行动资源。',
    );
  });

  test('describes the selected old-master artwork in both locales', () => {
    const englishPost = getBlogPost('en', DND_PALADIN_SLUG);
    const chinesePost = getBlogPost('zh', DND_PALADIN_SLUG);

    expect(englishPost?.coverAlt).toBe(
      'Weathered DnD Paladin in worn plate armor holding a helmet beside a narrow window in a dark stone chamber',
    );
    expect(chinesePost?.coverAlt).toBe(
      '一名身穿磨损板甲的 DND Paladin 在昏暗石室窗边手按胸甲，臂弯抱着头盔',
    );
    expect(englishPost?.bodyHtml).toContain(
      'alt="Weathered armored Paladin holding a battered shield in a shadowed stone hall"',
    );
    expect(chinesePost?.bodyHtml).toContain(
      'alt="一名身穿磨损板甲的 Paladin 在昏暗石厅里手持旧盾"',
    );
  });
});
