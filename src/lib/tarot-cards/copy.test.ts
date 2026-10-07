import { describe, expect, it } from 'vitest';

import { getTarotCopy } from './copy';
import type { SiteLocale } from '@/lib/site-locale';

function collectCopyStrings(value: object, prefix = ''): Record<string, string> {
  const strings: Record<string, string> = {};

  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === 'string') {
      strings[path] = entry;
    } else {
      Object.assign(strings, collectCopyStrings(entry, path));
    }
  }

  return strings;
}

describe('getTarotCopy', () => {
  it('provides matching nonempty EN/ZH fields and the required reading controls', () => {
    const english = getTarotCopy('en');
    const chinese = getTarotCopy('zh');
    const englishStrings = collectCopyStrings(english);
    const chineseStrings = collectCopyStrings(chinese);

    expect(Object.keys(chineseStrings)).toEqual(Object.keys(englishStrings));
    expect(Object.keys(english)).toEqual([
      'navigationTitle',
      'pageTitle',
      'pageDescription',
      'heroAction',
      'metadataTitle',
      'metadataDescription',
      'actions',
      'labels',
      'messages',
      'help',
    ]);
    expect(Object.keys(english.actions)).toEqual([
      'single',
      'spread',
      'dealSingle',
      'dealSpread',
      'redeal',
      'shuffle',
      'revealAll',
      'changeSpread',
      'help',
      'close',
    ]);
    expect(Object.keys(english.labels)).toEqual([
      'remaining',
      'revealed',
      'chooseSpread',
      'preview',
      'cardName',
      'position',
      'positionMeaning',
      'uprightMeaning',
      'reversedMeaning',
      'upright',
      'reversed',
      'horizontal',
      'unrevealed',
      'selectedCard',
      'details',
    ]);
    expect(Object.keys(english.messages)).toEqual([
      'emptyTitle',
      'emptyDescription',
      'selectCardHint',
      'previewHint',
      'shuffled',
      'insufficientTitle',
      'insufficientDescription',
      'exhaustedTitle',
      'exhaustedDescription',
    ]);
    expect(Object.keys(english.help)).toEqual(['title', 'sections']);
    expect(Object.keys(english.help.sections[0])).toEqual(['title', 'body']);
    for (const copy of [english, chinese]) {
      expect(Object.values(collectCopyStrings(copy)).every((value) => value.trim().length > 0)).toBe(true);
      expect(copy.help.sections).toHaveLength(5);
    }

    expect(english.navigationTitle).toBe('Tarot Cards');
    expect(chinese.navigationTitle).toBe('塔罗牌工具');
    expect(english.pageTitle).toBe('Fantasy Tarot Cards – Free Online Card Draw Tool');
    expect(english.pageDescription).toBe(
      'Draw custom fantasy tarot cards to inspire stories and RPG campaigns. Use 15 spreads to spark ideas for characters, worlds, encounters, and plot twists.',
    );
    expect(english.heroAction).toBe('Draw Tarot Cards');
    expect(chinese.pageTitle).toBe('幻想塔罗牌 – 免费在线随机抽牌工具');
    expect(chinese.pageDescription).toBe(
      '随机抽取幻想主题塔罗牌，搭配 15 种牌阵，为角色背景、世界设定、冒险遭遇和剧情转折寻找灵感。',
    );
    expect(chinese.heroAction).toBe('开始抽牌');
    for (const copy of [english, chinese]) {
      expect(copy.metadataTitle).toBe(copy.pageTitle);
      expect(copy.metadataDescription).toBe(copy.pageDescription);
    }
    expect(english.actions.revealAll).toBe('Reveal all');
    expect(chinese.actions.revealAll).toBe('全部翻开');
  });

  it('documents the shared deck, reveal flow, and deck-cycle controls in both locales', () => {
    const englishHelp = getTarotCopy('en').help.sections.map((section) => `${section.title} ${section.body}`).join(' ');
    const chineseHelp = getTarotCopy('zh').help.sections.map((section) => `${section.title} ${section.body}`).join(' ');

    expect(englishHelp).toContain('78-card deck');
    expect(englishHelp).toContain('without replacement');
    expect(englishHelp).toContain('starts face down');
    expect(englishHelp).toContain('click a card to flip it');
    expect(englishHelp).toContain('does not draw new cards');
    expect(englishHelp).toContain('Reveal all flips the cards already on the table');
    expect(englishHelp).toContain('Deal again consumes fresh cards');
    expect(englishHelp).toContain('Shuffle starts a new 78-card cycle');
    expect(englishHelp).toContain('shuffle first');

    expect(chineseHelp).toContain('78 张牌');
    expect(chineseHelp).toContain('不会重复抽到');
    expect(chineseHelp).toContain('先以牌背显示');
    expect(chineseHelp).toContain('点击牌面即可翻开');
    expect(chineseHelp).toContain('不会抽取新牌');
    expect(chineseHelp).toContain('重新发牌');
    expect(chineseHelp).toContain('新的 78 张牌周期');
    expect(chineseHelp).toContain('请先洗牌');
  });

  it('rejects an unsupported runtime locale with its actual value', () => {
    expect(() => getTarotCopy('fr' as SiteLocale)).toThrowError(
      'Unknown tarot locale. Received "fr".',
    );
  });
});
