import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { TAROT_CARD_BACK_SRC, TAROT_CARDS, getTarotCard } from './cards';

const PUBLIC_TAROT_CARDS_DIRECTORY = fileURLToPath(
  new URL('../../../public/tarot-cards/', import.meta.url),
);

const MAJOR_NAMES = [
  ['The Fool', '愚者'],
  ['The Magician', '魔术师'],
  ['The High Priestess', '女祭司'],
  ['The Empress', '皇后'],
  ['The Emperor', '皇帝'],
  ['The Hierophant', '教皇'],
  ['The Lovers', '恋人'],
  ['The Chariot', '战车'],
  ['Strength', '力量'],
  ['The Hermit', '隐者'],
  ['Wheel of Fortune', '命运之轮'],
  ['Justice', '正义'],
  ['The Hanged Man', '倒吊人'],
  ['Death', '死神'],
  ['Temperance', '节制'],
  ['The Devil', '恶魔'],
  ['The Tower', '高塔'],
  ['The Star', '星星'],
  ['The Moon', '月亮'],
  ['The Sun', '太阳'],
  ['Judgement', '审判'],
  ['The World', '世界'],
] as const;

const MAJOR_STEMS = [
  'fool',
  'magician',
  'high-priestess',
  'empress',
  'emperor',
  'hierophant',
  'lovers',
  'chariot',
  'strength',
  'hermit',
  'wheel-of-fortune',
  'justice',
  'hanged-man',
  'death',
  'temperance',
  'devil',
  'tower',
  'star',
  'moon',
  'sun',
  'judgement',
  'world',
] as const;

const NUMBER_NAMES = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
] as const;

const CHINESE_NUMBERS = ['', '王牌', '二', '三', '四', '五', '六', '七', '八', '九', '十'] as const;

const SUITS = [
  ['cups', 'Cups', '圣杯'],
  ['pentacles', 'Pentacles', '星币'],
  ['swords', 'Swords', '宝剑'],
  ['wands', 'Wands', '权杖'],
] as const;

const COURT_RANKS = [
  ['page', 'Page', '侍从'],
  ['knight', 'Knight', '骑士'],
  ['queen', 'Queen', '王后'],
  ['king', 'King', '国王'],
] as const;

describe('tarot card catalog', () => {
  it('contains the 78 cards with complete bilingual metadata', () => {
    expect(TAROT_CARDS).toHaveLength(78);
    expect(new Set(TAROT_CARDS.map((card) => card.id)).size).toBe(78);
    expect(TAROT_CARD_BACK_SRC).toBe('/tarot-cards/card-back.webp');

    const majorCards = TAROT_CARDS.filter((card) => card.arcana === 'major');
    expect(majorCards).toHaveLength(22);
    majorCards.forEach((card, index) => {
      const [nameEn, nameZh] = MAJOR_NAMES[index];

      expect(card).toMatchObject({
        id: `major-${String(index).padStart(2, '0')}-${MAJOR_STEMS[index]}`,
        arcana: 'major',
        suit: null,
        rank: index,
        name: { en: nameEn, zh: nameZh },
        imageSrc: `/tarot-cards/${card.id}.webp`,
      });
      expect(card.name.en).not.toBe('');
      expect(card.name.zh).not.toBe('');
    });

    for (const [suit, suitNameEn, suitNameZh] of SUITS) {
      const suitCards = TAROT_CARDS.filter((card) => card.suit === suit);
      expect(suitCards).toHaveLength(14);

      for (let number = 1; number <= 10; number += 1) {
        const card = getTarotCard(`${suit}-${String(number).padStart(2, '0')}`);
        expect(card).toMatchObject({
          arcana: 'minor',
          suit,
          rank: number,
          name: {
            en: `${NUMBER_NAMES[number - 1]} of ${suitNameEn}`,
            zh: `${suitNameZh}${CHINESE_NUMBERS[number]}`,
          },
          imageSrc: `/tarot-cards/${card.id}.webp`,
        });
      }

      for (const [rank, rankNameEn, rankNameZh] of COURT_RANKS) {
        const card = getTarotCard(`${suit}-${rank}`);
        expect(card).toMatchObject({
          arcana: 'minor',
          suit,
          rank,
          name: {
            en: `${rankNameEn} of ${suitNameEn}`,
            zh: `${suitNameZh}${rankNameZh}`,
          },
          imageSrc: `/tarot-cards/${card.id}.webp`,
        });
      }
    }
  });

  it('has exactly one WebP asset for each card plus the card back', () => {
    const assetNames = readdirSync(PUBLIC_TAROT_CARDS_DIRECTORY)
      .filter((name) => name.endsWith('.webp'))
      .sort();
    const expectedNames = [...TAROT_CARDS.map((card) => `${card.id}.webp`), 'card-back.webp'].sort();

    expect(assetNames).toEqual(expectedNames);
    for (const assetName of assetNames) {
      const assetPath = `${PUBLIC_TAROT_CARDS_DIRECTORY}/${assetName}`;
      expect(statSync(assetPath).size).toBeGreaterThan(0);
      const header = readFileSync(assetPath).subarray(0, 12).toString('ascii');
      expect(header.slice(0, 4)).toBe('RIFF');
      expect(header.slice(8, 12)).toBe('WEBP');
    }
  });

  it('returns a known card and fails fast for an unknown id', () => {
    expect(getTarotCard('major-00-fool')).toBe(TAROT_CARDS[0]);
    expect(() => getTarotCard('not-a-tarot-card')).toThrowError(
      'Unknown tarot card id: "not-a-tarot-card".',
    );
  });
});
