import { describe, expect, it } from 'vitest';

import { getHomeShowcase } from '@/lib/home-showcase';
import { BORDER_TEMPLATES } from '@/lib/templates/borders';
import { MASK_TEMPLATES } from '@/lib/templates/masks';
import type { SiteLocale } from '@/lib/site-locale';
import { getPresetHref } from './home-showcase-shared';

const locales: SiteLocale[] = ['en', 'zh'];

type ExpectedShowcaseSelection = {
  borderId: string;
  maskId: string;
  borderTint?: string;
};

const expectedShowcaseBorders: Record<string, ExpectedShowcaseSelection> = {
  'radiant-paladin': { borderId: 'revgold', maskId: 'circle' },
  'moon-archmage': { borderId: 'revgold', maskId: 'circle' },
  'grave-necromancer': { borderId: 'silverspikes', maskId: 'circle' },
  'inferno-drake': { borderId: 'fire', maskId: 'circle' },
  'dusk-rogue': { borderId: 'plain-thin-ring', maskId: 'circle', borderTint: '#8F0F0F' },
  'void-sorceress': { borderId: 'steampunk', maskId: 'circle' },
  'frost-ranger': { borderId: 'ice', maskId: 'circle' },
  'scale-brute': { borderId: 'silverspikes', maskId: 'circle' },
} as const;

describe('home showcase editor links', () => {
  it('includes exact showcase border, mask, and tint values in preset hrefs', () => {
    expect(
      getPresetHref('en', 'rogue', {
        borderId: 'plain-thin-ring',
        maskId: 'circle',
        borderTint: '#8F0F0F',
      })
    ).toBe('/?preset=rogue&mask=circle&border=plain-thin-ring&borderTint=%238F0F0F#editor-workspace');

    expect(
      getPresetHref('zh', 'cleric', {
        borderId: 'revgold',
        maskId: 'circle',
      })
    ).toBe('/zh?preset=cleric&mask=circle&border=revgold#editor-workspace');
  });

  it('binds every showcase card to the border visible in its finished preview image', () => {
    const borderIds = new Set(BORDER_TEMPLATES.map((border) => border.id));
    const maskIds = new Set(MASK_TEMPLATES.map((mask) => mask.id));

    for (const locale of locales) {
      const showcaseItems = [
        ...getHomeShowcase(locale).quickStart,
        ...getHomeShowcase(locale).gallery,
      ];

      for (const item of showcaseItems) {
        const expectedSelection =
          expectedShowcaseBorders[item.id];

        expect(expectedSelection, `Missing expected selection for ${item.id}`).toBeDefined();
        if (item.borderId === undefined) {
          throw new Error(`Missing borderId for showcase item ${item.id}`);
        }
        if (item.maskId === undefined) {
          throw new Error(`Missing maskId for showcase item ${item.id}`);
        }

        expect(item.borderId).toBe(expectedSelection.borderId);
        expect(item.maskId).toBe(expectedSelection.maskId);
        expect(item.borderTint).toBe(expectedSelection.borderTint);
        expect(borderIds.has(item.borderId)).toBe(true);
        expect(maskIds.has(item.maskId)).toBe(true);
      }
    }
  });
});
