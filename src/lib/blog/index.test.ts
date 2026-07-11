import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
} from '@/lib/blog-content';

const DND_BLESS_SLUG = 'dnd-bless';
const DND_SHORTSWORD_SLUG = 'dnd-shortsword';
const RAPIER_DND_SLUG = 'rapier-dnd';

describe('dnd shortsword blog post', () => {
  test('publishes the dnd shortsword article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_SHORTSWORD_SLUG);
    const chinesePost = getBlogPost('zh', DND_SHORTSWORD_SLUG);

    expect(englishPost?.title).toContain('DnD Shortsword');
    expect(englishPost?.bodyHtml).toContain('dnd shortsword');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-shortsword-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(6);

    expect(chinesePost?.title).toContain('DND 短剑（Shortsword）');
    expect(chinesePost?.bodyHtml).toContain('短剑（Shortsword）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-shortsword-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(6);
  });

  test('keeps high-risk shortsword rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_SHORTSWORD_SLUG);
    const chinesePost = getBlogPost('zh', DND_SHORTSWORD_SLUG);

    expect(englishPost?.bodyHtml).toContain(
      'A shortsword is a martial melee weapon that deals 1d6 piercing damage, costs 10 gp, weighs 2 lb, and has the Finesse and Light properties.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Vex matters only for a character who has a feature that lets them use that weapon mastery.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'Vex does not give Advantage to the attack that triggered it.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'A shortsword qualifies for Sneak Attack because it has Finesse, but the Rogue still needs the normal Sneak Attack conditions.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'The extra Light attack does not add your ability modifier to its damage unless that modifier is negative.',
    );
    expect(englishPost?.bodyHtml).toContain(
      'In 2014, taking the Attack action and attacking with a Light melee weapon in one hand lets you spend a Bonus Action',
    );
    expect(englishPost?.bodyHtml).toContain('The shortsword has Vex, not Nick.');

    expect(chinesePost?.bodyHtml).toContain(
      '短剑是一把军用近战武器，造成 1d6 穿刺伤害，价格 10 GP，重量 2 磅，并有灵巧（Finesse）和轻型（Light）属性。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      'Vex 只有在角色拥有能使用该武器掌握的特性或选项时才生效。',
    );
    expect(chinesePost?.bodyHtml).toContain('Vex 不会让触发它的同一次攻击获得优势。');
    expect(chinesePost?.bodyHtml).toContain(
      '短剑因为有灵巧属性而符合偷袭的武器要求，但游荡者（Rogue）仍然必须满足正常的 Sneak Attack 条件。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '轻型武器的额外攻击通常不把属性调整值加到伤害上，除非该调整值为负数。',
    );
    expect(chinesePost?.bodyHtml).toContain(
      '2014 规则里，你采取攻击动作，并用一手持有的轻型近战武器攻击后，可以用附赠动作',
    );
    expect(chinesePost?.bodyHtml).toContain('短剑的武器掌握是 Vex，不是 Nick。');
  });

  test('keeps visible shortsword FAQ answers aligned with structured data', () => {
    for (const locale of ['en', 'zh'] as const) {
      const post = getBlogPost(locale, DND_SHORTSWORD_SLUG);

      for (const faqItem of post?.faqItems ?? []) {
        expect(post?.bodyHtml).toContain(faqItem.question);
        expect(post?.bodyHtml).toContain(`<p>${faqItem.answer}</p>`);
      }
    }
  });

  test('keeps the Chinese shortsword article Chinese-first', () => {
    const chineseBodyHtml = getBlogPost('zh', DND_SHORTSWORD_SLUG)?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('短剑（Shortsword）');
    expect(chineseBodyHtml).toContain('灵巧（Finesse）');
    expect(chineseBodyHtml).toContain('轻型（Light）');
    expect(chineseBodyHtml).toContain('武器掌握（Weapon Mastery）');
    expect(chineseBodyHtml).toContain('偷袭（Sneak Attack）');
    expect(chineseBodyHtml).toContain('DND 短剑常见问题');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Shortsword DnD FAQ');
    expect(chineseBodyHtml).not.toContain('<h2 id="best-users">Best users');
  });

  test('uses localized paths for the dnd shortsword article', () => {
    expect(getBlogPostPath('en', DND_SHORTSWORD_SLUG)).toBe('/blog/dnd-shortsword');
    expect(getBlogPostPath('zh', DND_SHORTSWORD_SLUG)).toBe('/zh/blog/dnd-shortsword');
  });

  test('builds bilingual metadata alternates for the dnd shortsword article', () => {
    const metadata = createBlogPostMetadata('en', DND_SHORTSWORD_SLUG);

    expect(metadata.title).toBe('Shortsword DnD Guide: 2014 vs 2024 Rules and Vex');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-shortsword');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-shortsword',
      'en-US': '/blog/dnd-shortsword',
      'zh-CN': '/zh/blog/dnd-shortsword',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-shortsword-guide.webp',
        alt: 'dnd shortsword guide cover showing a rogue token with a shortsword, dice, character sheet notes, and VTT token frames on a dungeon tabletop',
      },
    ]);
  });

  test('builds article and FAQ structured data for the dnd shortsword article', () => {
    expect(buildBlogPostStructuredData('en', DND_SHORTSWORD_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Shortsword DnD Guide: 2014 vs 2024 Rules and Vex',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-shortsword',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-shortsword-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_SHORTSWORD_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });
  });

  test('uses an existing WebP cover for the dnd shortsword article', () => {
    expect(existsSync('public/blog/covers/en/dnd-shortsword-guide.webp')).toBe(true);
    expect(existsSync('public/blog/inline/dnd-shortsword/dnd-shortsword-video-placeholder.webp')).toBe(true);
  });

  test('keeps the shortsword video as a lazy lite YouTube embed', () => {
    const englishBodyHtml = getBlogPost('en', DND_SHORTSWORD_SLUG)?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="-nu-JmZ4joo"');
    expect(englishBodyHtml).toContain(
      'src="/blog/inline/dnd-shortsword/dnd-shortsword-video-placeholder.webp"',
    );
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).not.toContain('<iframe');
  });

  test('lists the dnd shortsword article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-shortsword');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-shortsword');
  });
});

describe('dnd bless blog post', () => {
  test('publishes the dnd bless article in English and Chinese', () => {
    const englishPost = getBlogPost('en', DND_BLESS_SLUG);
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);

    expect(englishPost?.title).toContain('Bless DnD');
    expect(englishPost?.bodyHtml).toContain('dnd bless');
    expect(englishPost?.coverImage).toBe('/blog/covers/en/dnd-bless-guide.webp');
    expect(englishPost?.faqItems?.length).toBeGreaterThanOrEqual(6);

    expect(chinesePost?.title).toContain('祝福术（DND Bless）');
    expect(chinesePost?.bodyHtml).toContain('祝福术（Bless）');
    expect(chinesePost?.coverImage).toBe('/blog/covers/en/dnd-bless-guide.webp');
    expect(chinesePost?.faqItems?.length).toBeGreaterThanOrEqual(6);
  });

  test('keeps high-risk Bless rules accurate in both locales', () => {
    const englishPost = getBlogPost('en', DND_BLESS_SLUG);
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);

    expect(englishPost?.bodyHtml).toContain('add 1d4 to attack rolls and saving throws');
    expect(englishPost?.bodyHtml).toContain('Bless does not add 1d4 to damage rolls');
    expect(englishPost?.bodyHtml).toContain('Bless does not add to ability checks');
    expect(englishPost?.bodyHtml).toContain('The Cleric should not need a pile of disposable holy symbols');
    expect(englishPost?.bodyHtml).toContain('Bless does not stack with another Bless on the same target');
    expect(englishPost?.bodyHtml).toContain('It is not once per turn');

    expect(chinesePost?.bodyHtml).toContain('攻击检定（attack roll）和豁免（saving throw）');
    expect(chinesePost?.bodyHtml).toContain('祝福术不会把 1d4 加到伤害上');
    expect(chinesePost?.bodyHtml).toContain('祝福术不加属性检定');
    expect(chinesePost?.bodyHtml).toContain('不应该因为每次施放祝福术就损失一个');
    expect(chinesePost?.bodyHtml).toContain('祝福术不和另一个祝福术叠加');
    expect(chinesePost?.bodyHtml).toContain('不是每回合一次');
  });

  test('keeps the Chinese Bless article Chinese-first', () => {
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);
    const chineseBodyHtml = chinesePost?.bodyHtml ?? '';

    expect(chineseBodyHtml).toContain('祝福术');
    expect(chineseBodyHtml).toContain('专注（Concentration）');
    expect(chineseBodyHtml).toContain('攻击检定');
    expect(chineseBodyHtml).toContain('豁免');
    expect(chineseBodyHtml).toContain('祝福术（DND Bless）常见问题');
    expect(chineseBodyHtml).toContain('祝福术（DND Bless）配套视频');

    expect(chineseBodyHtml).not.toContain('<h2 id="quick-answer">Quick answer');
    expect(chineseBodyHtml).not.toContain('Bless DnD FAQ');
    expect(chineseBodyHtml).not.toContain('Does Bless add to damage?');
  });

  test('uses localized paths for the dnd bless article', () => {
    expect(getBlogPostPath('en', DND_BLESS_SLUG)).toBe('/blog/dnd-bless');
    expect(getBlogPostPath('zh', DND_BLESS_SLUG)).toBe('/zh/blog/dnd-bless');
  });

  test('builds bilingual metadata alternates for the dnd bless article', () => {
    const metadata = createBlogPostMetadata('en', DND_BLESS_SLUG);

    expect(metadata.title).toBe('Bless DnD Guide: 2014 vs 2024 Rules and Best Uses');
    expect(metadata.alternates?.canonical).toBe('/blog/dnd-bless');
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/blog/dnd-bless',
      'en-US': '/blog/dnd-bless',
      'zh-CN': '/zh/blog/dnd-bless',
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://www.tokenmaker.one/blog/covers/en/dnd-bless-guide.webp',
        alt: 'dnd bless guide cover showing golden Bless magic over three ally tokens, a d4, a holy symbol, and VTT token frames on a tabletop battle map',
      },
    ]);
  });

  test('builds article and FAQ structured data for the dnd bless article', () => {
    const chinesePost = getBlogPost('zh', DND_BLESS_SLUG);

    expect(buildBlogPostStructuredData('en', DND_BLESS_SLUG)).toMatchObject({
      '@type': 'Article',
      headline: 'Bless DnD Guide: 2014 vs 2024 Rules and Best Uses',
      inLanguage: 'en-US',
      url: 'https://www.tokenmaker.one/blog/dnd-bless',
      image: ['https://www.tokenmaker.one/blog/covers/en/dnd-bless-guide.webp'],
    });

    expect(buildBlogPostFaqStructuredData('zh', DND_BLESS_SLUG)).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'zh-CN',
    });

    expect(chinesePost?.coverAlt).toContain('祝福术（DND Bless）指南封面图');
    expect(chinesePost?.faqItems?.[3]?.question).toBe('2024 版祝福术会消耗 Holy Symbol 吗？');
    expect(chinesePost?.faqItems?.[3]?.answer).toContain('不会');
  });

  test('keeps the Bless video as a lazy lite YouTube embed', () => {
    const englishPost = getBlogPost('en', DND_BLESS_SLUG);
    const englishBodyHtml = englishPost?.bodyHtml ?? '';

    expect(englishBodyHtml).toContain('data-video-id="IPOddAMdy5k"');
    expect(englishBodyHtml).toContain('src="/blog/inline/dnd-bless/dnd-bless-video-placeholder.webp"');
    expect(englishBodyHtml).toContain('loading="lazy"');
    expect(englishBodyHtml).not.toContain('<iframe');
  });

  test('lists the dnd bless article in llms.txt for both locales', () => {
    const llmsText = readFileSync('public/llms.txt', 'utf8');

    expect(llmsText).toContain('https://www.tokenmaker.one/blog/dnd-bless');
    expect(llmsText).toContain('https://www.tokenmaker.one/zh/blog/dnd-bless');
  });
});

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
