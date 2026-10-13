import { describe, expect, it } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';
import { getToolDirectoryItems, getToolDirectoryLinks } from '@/lib/tool-directory';
import { getToolRecommendationSet } from '@/lib/tool-recommendations';

const diceRollerFollowingIds = [
  'coat-of-arms-maker',
  'armor-creator',
  'outfit-creator',
  'weapon-creator',
] as const;

const populationGeneratorFollowingIds = [
  'token-maker',
  'dice-roller',
  'coat-of-arms-maker',
  'armor-creator',
] as const;

function recommendedToolIds(locale: SiteLocale, currentPath: string) {
  return getToolRecommendationSet(locale, currentPath).recommendedTools.map((tool) => tool.id);
}

describe('getToolRecommendationSet', () => {
  it('returns the same four tools after the dice roller for English and Chinese paths', () => {
    expect(recommendedToolIds('en', '/dice-roller-dnd')).toEqual([...diceRollerFollowingIds]);
    expect(recommendedToolIds('zh', '/zh/dice-roller-dnd')).toEqual([...diceRollerFollowingIds]);
    expect(recommendedToolIds('en', '/dice-roller-dnd')[0]).toBe('coat-of-arms-maker');
  });

  it('ignores a query string and hash before matching the directory path', () => {
    expect(recommendedToolIds('en', '/dice-roller-dnd?campaign=1#result')).toEqual([
      ...diceRollerFollowingIds,
    ]);
    expect(recommendedToolIds('zh', '/zh/dice-roller-dnd?campaign=1#result')).toEqual([
      ...diceRollerFollowingIds,
    ]);
  });

  it('wraps from the population generator to the start of the directory', () => {
    expect(recommendedToolIds('en', '/population-generator')).toEqual([
      ...populationGeneratorFollowingIds,
    ]);
    expect(recommendedToolIds('en', '/population-generator')).toContain('token-maker');
    expect(recommendedToolIds('zh', '/zh/population-generator')).toEqual([
      ...populationGeneratorFollowingIds,
    ]);
  });

  it('omits the current tool from the recommendations', () => {
    expect(recommendedToolIds('en', '/dice-roller-dnd')).not.toContain('dice-roller');
    expect(recommendedToolIds('zh', '/zh/dice-roller-dnd')).not.toContain('dice-roller');
    expect(recommendedToolIds('en', '/population-generator')).not.toContain('population-generator');
    expect(recommendedToolIds('zh', '/zh/population-generator')).not.toContain('population-generator');
  });

  it.each(['en', 'zh'] as const)('returns four directory items for %s', (locale) => {
    const currentPath = locale === 'en' ? '/dice-roller-dnd' : '/zh/dice-roller-dnd';
    const recommendation = getToolRecommendationSet(locale, currentPath);
    const directoryItems = getToolDirectoryItems(locale);

    expect(recommendation.recommendedTools).toHaveLength(4);
    expect(recommendation.recommendedTools).toEqual(
      diceRollerFollowingIds.map((id) => directoryItems.find((directoryItem) => directoryItem.id === id)),
    );
  });

  it.each(['/', '/zh'])('rejects homepage path %s', (currentPath) => {
    expect(() => getToolRecommendationSet('en', currentPath)).toThrow(Error);
    expect(() => getToolRecommendationSet('en', currentPath)).toThrow(JSON.stringify(currentPath));
  });

  it('rejects an unknown tool path and reports the normalized path', () => {
    expect(() => getToolRecommendationSet('en', '/not-a-tool')).toThrow(Error);
    expect(() => getToolRecommendationSet('en', '/not-a-tool')).toThrow(JSON.stringify('/not-a-tool'));
    expect(() => getToolRecommendationSet('zh', '/zh/not-a-tool')).toThrow(JSON.stringify('/not-a-tool'));
  });

  it('uses the directory name for the current locale', () => {
    const englishLink = getToolDirectoryLinks('en').find((directoryLink) => directoryLink.path === '/dice-roller-dnd');
    const chineseLink = getToolDirectoryLinks('zh').find((directoryLink) => directoryLink.path === '/dice-roller-dnd');

    expect(englishLink?.name).toBe('D&D Dice Roller');
    expect(chineseLink?.name).toBe('D&D 骰子掷骰器');
    expect(getToolRecommendationSet('en', '/dice-roller-dnd').currentToolName).toBe(englishLink?.name);
    expect(getToolRecommendationSet('zh', '/zh/dice-roller-dnd').currentToolName).toBe(chineseLink?.name);
  });
});
