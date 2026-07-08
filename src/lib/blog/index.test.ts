import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from '@/lib/blog-content';

const RAPIER_DND_SLUG = 'rapier-dnd';

describe('rapier dnd blog post', () => {
  test('publishes the rapier dnd article in English and Chinese', () => {
    const englishPost = getBlogPost('en', RAPIER_DND_SLUG);
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);

    expect(englishPost?.title).toContain('Rapier DnD');
    expect(englishPost?.bodyHtml).toContain('rapier dnd');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-rapier-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(5);

    expect(chinesePost?.title).toContain('DND 细剑');
    expect(chinesePost?.bodyHtml).toContain('细剑（Rapier）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-rapier-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(5);
  });

  test('keeps high-risk rapier rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', RAPIER_DND_SLUG);
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);

    expect(englishPost?.bodyHtml).toContain('A rapier is <strong>not</strong> a Light weapon');
    expect(englishPost?.bodyHtml).toContain('you use the same ability for both rolls on that attack');
    expect(englishPost?.bodyHtml).toContain('Vex matters only for a character who has a feature that lets them use that weapon mastery');
    expect(englishPost?.bodyHtml).toContain('Vex does not give Advantage to the attack that triggered it');
    expect(englishPost?.bodyHtml).toContain('rapier + dagger does not automatically give you a bonus attack');
    expect(englishPost?.bodyHtml).toContain('The Rogue still needs the normal Sneak Attack conditions');

    expect(chinesePost?.bodyHtml).toContain('细剑<strong>不是</strong>轻型（Light）武器');
    expect(chinesePost?.bodyHtml).toContain('同一次攻击里必须用同一个属性');
    expect(chinesePost?.bodyHtml).toContain('Vex 只有在角色本身拥有使用该武器掌握的特性或选项时才生效');
    expect(chinesePost?.bodyHtml).toContain('Vex 不会让触发它的同一次攻击获得优势');
    expect(chinesePost?.bodyHtml).toContain('细剑 + 匕首不会因为基础双武器规则自动给你一次附赠动作攻击');
    expect(chinesePost?.bodyHtml).toContain('游荡者（Rogue）仍然必须满足当前规则版本下正常的 Sneak Attack 条件');
  });

  test('keeps the Chinese rapier article Chinese-first', () => {
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);
    const chineseBodyHtml = chinesePost?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('1d8 穿刺');
    expect(chineseBodyHtml).toContain('灵巧（Finesse）');
    expect(chineseBodyHtml).toContain('游荡者（Rogue）决斗者');
    expect(chineseBodyHtml).toContain('DND 细剑常见问题');
    expect(chineseBodyHtml).toContain('力量或敏捷');
    expect(chineseBodyHtml).toContain('DND 细剑（Rapier）视频');

    expect(chineseBodyHtml).not.toContain('1d8 Piercing');
    expect(chineseBodyHtml).not.toContain('<td>Finesse</td>');
    expect(chineseBodyHtml).not.toContain('<h3>Rogue 决斗者</h3>');
    expect(chineseBodyHtml).not.toContain('Rapier DnD 常见问题');
    expect(chineseBodyHtml).not.toContain('Rapier DnD 配套视频');
    expect(chineseBodyHtml).not.toContain('配套视频');
    expect(chineseBodyHtml).not.toContain('Strength or Dexterity');
    expect(chineseBodyHtml).not.toContain('不过 Rogue 仍然');
    expect(chineseBodyHtml).not.toContain('决斗者、Rogue 或 NPC Token');
  });

  test('uses localized paths for the rapier dnd article', () => {
    expect(getBlogPostPath('en', RAPIER_DND_SLUG)).toBe('/blog/rapier-dnd');
    expect(getBlogPostPath('zh', RAPIER_DND_SLUG)).toBe('/zh/blog/rapier-dnd');
  });

  test('builds bilingual metadata alternates for the rapier dnd article', () => {
    const metadata = createBlogPostMetadata('en', RAPIER_DND_SLUG);

    expect(metadata.title).toBe('Rapier DnD Guide: 5e Stats, Vex, Best Users, and VTT Tips');
    expect(metadata.alternates?.canonical).toBe('/blog/rapier-dnd');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/rapier-dnd',
      'en-US': '/blog/rapier-dnd',
      'zh-CN': '/zh/blog/rapier-dnd',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-rapier-guide.webp',
        alt: 'rapier dnd guide cover showing a duelist token, rapier, dice, character sheet notes, and VTT token frames on a dungeon tabletop',
      },
    ]);
  });

  test('builds article and FAQ structured data for the rapier dnd article', () => {
    const chinesePost = getBlogPost('zh', RAPIER_DND_SLUG);

    expect(buildBlogPostStructuredData('en', RAPIER_DND_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Rapier DnD Guide: 5e Stats, Vex, Best Users, and VTT Tips',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/rapier-dnd',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-rapier-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', RAPIER_DND_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('DND 细剑（Rapier）指南封面图');
    expect(chinesePost?.coverAlt).not.toContain('rapier dnd 指南封面图');
    expect(chinesePost?.faqItems?.[1]?.question).toBe('游荡者（Rogue）可以用细剑偷袭（Sneak Attack）吗？');
    expect(chinesePost?.faqItems?.[1]?.answer).toContain('游荡者（Rogue）仍然必须满足正常 Sneak Attack 条件');
    expect(chinesePost?.faqItems?.[1]?.answer).not.toContain('但 Rogue 仍然');
  });

  test('lists the rapier dnd article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/rapier-dnd');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/rapier-dnd');
  });
});
