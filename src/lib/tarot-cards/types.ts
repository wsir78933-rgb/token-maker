import type { SiteLocale } from '@/lib/site-locale';

export type TarotLocale = SiteLocale;

export type TarotLocalizedText = Record<TarotLocale, string>;

export type TarotSuit = 'cups' | 'pentacles' | 'swords' | 'wands';

export type TarotCourtRank = 'page' | 'knight' | 'queen' | 'king';

export type TarotCard = {
  readonly id: string;
  readonly arcana: 'major' | 'minor';
  readonly suit: TarotSuit | null;
  readonly rank: number | TarotCourtRank;
  readonly name: TarotLocalizedText;
  readonly imageSrc: string;
};

export type TarotCardMeaning = {
  readonly upright: TarotLocalizedText;
  readonly reversed: TarotLocalizedText;
};

export type TarotSpreadId =
  | 'celtic-cross'
  | 'cross-and-triangle'
  | 'tetraktys'
  | 'planetary'
  | 'astrological'
  | 'relationship'
  | 'star-guide'
  | 'birthday'
  | 'mandala'
  | 'dream-exploration'
  | 'tree-of-life'
  | 'past-life'
  | 'true-love'
  | 'never-too-late'
  | 'annual';

export type TarotSpreadPosition = {
  readonly number: number;
  readonly label: TarotLocalizedText;
  readonly description: TarotLocalizedText;
  readonly x: number;
  readonly y: number;
  readonly fixedRotationDeg?: 90;
};

export type TarotSpread = {
  readonly id: TarotSpreadId;
  readonly name: TarotLocalizedText;
  readonly description: TarotLocalizedText;
  readonly positions: readonly TarotSpreadPosition[];
};

export type TarotDealtCard = {
  readonly cardId: string;
  readonly position: number;
  readonly reversed: boolean;
  readonly revealed: boolean;
};

export type TarotReading = {
  readonly mode: 'single' | 'spread';
  readonly spreadId: TarotSpreadId | null;
  readonly cards: readonly TarotDealtCard[];
  readonly selectedPosition: number | null;
};

export type TarotReadingMode = TarotReading['mode'];

export type TarotState = {
  readonly remainingCardIds: readonly string[];
  readonly reading: TarotReading | null;
};

export type TarotDealResult =
  | {
      readonly ok: true;
      readonly state: TarotState;
    }
  | {
      readonly ok: false;
      readonly state: TarotState;
      readonly reason: 'insufficient-cards' | 'deck-exhausted';
      readonly required: number;
      readonly available: number;
    };
