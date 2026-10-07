import { describe, expect, it } from 'vitest';

import { TAROT_CARDS } from './cards';
import { getTarotCardMeaning, TAROT_CARD_MEANINGS } from './meanings';

const meaningConcepts = (text: string): string[] =>
  text
    .split(/[;；]/)
    .map((concept) => concept.trim())
    .filter(Boolean);

describe('tarot card meanings', () => {
  it('maps exactly the 78 public cards and supplies four bilingual text fields each', () => {
    const cardIds = TAROT_CARDS.map((card) => card.id).sort();
    const meaningIds = Object.keys(TAROT_CARD_MEANINGS).sort();

    expect(cardIds).toHaveLength(78);
    expect(meaningIds).toEqual(cardIds);

    let textFieldCount = 0;

    for (const card of TAROT_CARDS) {
      const meaning = getTarotCardMeaning(card.id);

      for (const orientation of [meaning.upright, meaning.reversed]) {
        for (const locale of ['en', 'zh'] as const) {
          const text = orientation[locale];
          const concepts = meaningConcepts(text);

          expect(text, `${card.id}:${locale}`).not.toBe('');
          expect(concepts, `${card.id}:${locale}`).toHaveLength(4);
          expect(concepts.every((concept) => concept.length > 0), `${card.id}:${locale}`).toBe(true);
          textFieldCount += 1;
        }
      }
    }

    expect(textFieldCount).toBe(312);
  });

  it('keeps major, court, and numbered card meanings distinct', () => {
    expect(TAROT_CARD_MEANINGS['major-00-fool'].upright.en).not.toBe(
      TAROT_CARD_MEANINGS['major-01-magician'].upright.en,
    );
    expect(TAROT_CARD_MEANINGS['cups-page'].upright.en).not.toBe(
      TAROT_CARD_MEANINGS['cups-king'].upright.en,
    );
    expect(TAROT_CARD_MEANINGS['cups-02'].upright.en).not.toBe(
      TAROT_CARD_MEANINGS['cups-03'].upright.en,
    );
    expect(TAROT_CARD_MEANINGS['cups-02'].upright.zh).not.toBe(
      TAROT_CARD_MEANINGS['wands-02'].upright.zh,
    );
  });

  it('returns the mapped meaning and fails fast with an unknown id value', () => {
    expect(getTarotCardMeaning('major-00-fool')).toBe(TAROT_CARD_MEANINGS['major-00-fool']);
    expect(() => getTarotCardMeaning('not-a-tarot-card')).toThrowError(
      'Unknown tarot card meaning id: "not-a-tarot-card".',
    );
  });
});
