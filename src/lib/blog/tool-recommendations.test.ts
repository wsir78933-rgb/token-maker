import { describe, expect, it } from 'vitest';

import { getBlogPosts } from '@/lib/blog';
import { getToolDirectoryLinks } from '@/lib/tool-directory';
import type { SiteLocale } from '@/lib/site-locale';
import { getBlogToolRecommendations } from './tool-recommendations';

describe('getBlogToolRecommendations', () => {
  it('covers every published post in both locales with four unique directory tools', () => {
    const englishSlugs = getBlogPosts('en').map((post) => post.slug);
    const chineseSlugs = getBlogPosts('zh').map((post) => post.slug);
    const validToolIds = new Set(getToolDirectoryLinks('en').map((tool) => tool.id));

    expect(chineseSlugs).toEqual(englishSlugs);

    for (const slug of englishSlugs) {
      const english = getBlogToolRecommendations('en', slug);
      const chinese = getBlogToolRecommendations('zh', slug);

      expect(english.description.trim(), `${slug} English description`).not.toBe('');
      expect(chinese.description.trim(), `${slug} Chinese description`).not.toBe('');
      expect(english.description, `${slug} localized descriptions`).not.toBe(chinese.description);
      expect(english.toolIds, `${slug} localized tool order`).toEqual(chinese.toolIds);

      for (const [locale, recommendation] of [
        ['en', english],
        ['zh', chinese],
      ] as const) {
        expect(recommendation.toolIds, `${slug} ${locale} tool count`).toHaveLength(4);
        expect(new Set(recommendation.toolIds).size, `${slug} ${locale} unique tools`).toBe(4);
        for (const toolId of recommendation.toolIds) {
          expect(validToolIds.has(toolId), `${slug} ${locale} tool ${toolId}`).toBe(true);
        }
      }
    }
  });

  it('keeps the approved class-explainer copy and tool order', () => {
    expect(getBlogToolRecommendations('en', 'dnd-classes-explained')).toEqual({
      description:
        'Bring your character to the table with a token, a coat of arms, dice, and a custom weapon.',
      toolIds: ['token-maker', 'coat-of-arms-maker', 'dice-roller', 'weapon-creator'],
    });
    expect(getBlogToolRecommendations('zh', 'dnd-classes-explained')).toEqual({
      description: '选好职业后，制作角色 Token、设计纹章和武器，再为下一场游戏准备好骰子。',
      toolIds: ['token-maker', 'coat-of-arms-maker', 'dice-roller', 'weapon-creator'],
    });
  });

  it('uses article-specific tools for ancestry, monsters, spells, equipment, and campaign prep', () => {
    expect(getBlogToolRecommendations('en', 'dnd-dwarf-names').toolIds).toEqual([
      'family-tree-creator',
      'token-maker',
      'coat-of-arms-maker',
      'language-generator',
    ]);
    expect(getBlogToolRecommendations('en', 'dnd-beholder').toolIds).toEqual([
      'token-maker',
      'dice-roller',
      'army-formation-creator',
      'map-maker',
    ]);
    expect(getBlogToolRecommendations('en', 'dnd-wizard-spells').toolIds).toEqual([
      'dice-roller',
      'scroll-creator',
      'token-maker',
      'army-formation-creator',
    ]);
    expect(getBlogToolRecommendations('en', 'dnd-armor-guide').toolIds).toEqual([
      'armor-creator',
      'outfit-creator',
      'token-maker',
      'weapon-creator',
    ]);
    expect(getBlogToolRecommendations('en', 'dnd-campaigns').toolIds).toEqual([
      'map-maker',
      'town-creator',
      'notice-board-creator',
      'population-generator',
    ]);
  });

  it('uses the formation planner for tactical spell scenes and the map maker for wider regions', () => {
    const tacticalSpellSlugs = ['dnd-shatter-5e', 'firebolt-dnd-5e', 'dnd-thunderclap'] as const;

    for (const slug of tacticalSpellSlugs) {
      for (const locale of ['en', 'zh'] as const) {
        const recommendation = getBlogToolRecommendations(locale, slug);
        expect(recommendation.toolIds, `${slug} ${locale}`).toContain('army-formation-creator');
        expect(recommendation.toolIds, `${slug} ${locale}`).not.toContain('map-maker');
        expect(recommendation.description, `${slug} ${locale}`).toContain(
          locale === 'en' ? 'units and terrain' : '单位与地形',
        );
      }
    }

    const regionalEncounterSlugs = [
      'dnd-kobold',
      'dnd-beholder',
      'mind-flayer-dnd',
      'spectator-dnd',
      'dnd-ghost',
      'dnd-demons',
      'dnd-necromancer-spells',
      'dnd-giants',
    ] as const;

    for (const slug of regionalEncounterSlugs) {
      for (const locale of ['en', 'zh'] as const) {
        const recommendation = getBlogToolRecommendations(locale, slug);
        expect(recommendation.toolIds, `${slug} ${locale}`).toContain('army-formation-creator');
        expect(recommendation.toolIds, `${slug} ${locale}`).toContain('map-maker');
        expect(recommendation.description, `${slug} ${locale}`).toContain(
          locale === 'en' ? 'world map' : '世界地图',
        );
        expect(recommendation.description, `${slug} ${locale}`).toContain(
          locale === 'en' ? 'units and terrain' : '单位与地形',
        );
      }
    }
  });

  it('describes the language generator as a tool for original fictional phrases', () => {
    const english = getBlogToolRecommendations('en', 'dnd-languages');
    const chinese = getBlogToolRecommendations('zh', 'dnd-languages');

    expect(english.toolIds).toContain('language-generator');
    expect(english.description).toContain('original fictional phrases');
    expect(chinese.toolIds).toContain('language-generator');
    expect(chinese.description).toContain('原创虚构短语');
  });

  it('reports an unknown locale and slug with the received value', () => {
    expect(() => getBlogToolRecommendations('fr' as SiteLocale, 'dnd-classes-explained'))
      .toThrow('Unknown blog tool recommendation locale: "fr".');
    expect(() => getBlogToolRecommendations('en', 'not-a-published-blog'))
      .toThrow('Unknown blog tool recommendation slug: "not-a-published-blog".');
  });

});
