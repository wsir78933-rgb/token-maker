import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getLanguageGeneratorPageCopy } from '@/lib/language-generator/page-copy';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { getToolDirectoryItems } from '@/lib/tool-directory';
import type { SiteLocale } from '@/lib/site-locale';

const expectedToolIds = [
  'token-maker',
  'dice-roller',
  'coat-of-arms-maker',
  'armor-creator',
  'outfit-creator',
  'weapon-creator',
  'army-formation-creator',
  'emblem-creator',
  'language-generator',
  'calendar-creator',
  'family-tree-creator',
  'constellation-map-creator',
  'solar-system-creator',
  'periodic-table-creator',
  'tarot-cards',
  'scroll-creator',
  'town-creator',
  'castle-creator',
  'map-maker',
  'notice-board-creator',
  'population-generator',
];

const expectedToolPaths = [
  '/#editor-workspace',
  '/dice-roller-dnd',
  '/coat-of-arms-maker',
  '/armor-creator',
  '/outfit-creator',
  '/weapon-creator',
  '/army-formation-creator',
  '/emblem-creator',
  '/language-generator',
  '/calendar-creator',
  '/family-tree-creator',
  '/constellation-map-creator',
  '/solar-system-creator',
  '/periodic-table-creator',
  '/tarot-cards',
  '/scroll-creator',
  '/town-creator',
  '/castle-creator',
  '/map-maker',
  '/notice-board-creator',
  '/population-generator',
];

describe('tool directory catalog', () => {
  it.each([
    { locale: 'en' as const, localizedHomeHref: '/#editor-workspace' },
    { locale: 'zh' as const, localizedHomeHref: '/zh#editor-workspace' },
  ])('returns the approved 21 tools in order for $locale', ({ locale, localizedHomeHref }) => {
    const toolItems = getToolDirectoryItems(locale);

    expect(toolItems).toHaveLength(21);
    expect(toolItems.map((toolItem) => toolItem.id)).toEqual(expectedToolIds);
    expect(toolItems.map((toolItem) => toolItem.href)).toEqual(
      expectedToolPaths.map((path) => {
        if (path === '/#editor-workspace') {
          return locale === 'en' ? path : '/zh#editor-workspace';
        }

        return locale === 'en' ? path : `/zh${path}`;
      }),
    );
    expect(toolItems[0]?.href).toBe(localizedHomeHref);
    expect(toolItems[1]?.href).toBe(locale === 'en' ? '/dice-roller-dnd' : '/zh/dice-roller-dnd');
    expect(toolItems[2]?.href).toBe(locale === 'en' ? '/coat-of-arms-maker' : '/zh/coat-of-arms-maker');
    expect(toolItems.at(-1)?.href).toBe(locale === 'en' ? '/population-generator' : '/zh/population-generator');

    for (const toolItem of toolItems) {
      expect(toolItem.name.trim(), `${locale} name for ${toolItem.id}`).not.toBe('');
      expect(toolItem.description.trim(), `${locale} description for ${toolItem.id}`).not.toBe('');

      if (toolItem.preview.type === 'image') {
        const publicImagePath = resolve(process.cwd(), 'public', toolItem.preview.src.slice(1));

        expect(existsSync(publicImagePath), `${toolItem.id} preview at ${toolItem.preview.src}`).toBe(true);
        expect(toolItem.preview.alt.trim(), `${locale} alt for ${toolItem.id}`).not.toBe('');
      }
    }
  });

  it.each(['en', 'zh'] as const)('uses the canonical tarot draw-tool name and purpose for %s', (locale) => {
    const tarotTool = getToolDirectoryItems(locale).find((toolItem) => toolItem.id === 'tarot-cards');
    const expectedDescription = locale === 'en'
      ? 'Draw a single card or one of 15 spreads for story and tabletop-game inspiration.'
      : '抽取单张塔罗牌或使用 15 种牌阵，为故事创作和桌游冒险寻找灵感。';

    expect(tarotTool?.name).toBe(getTarotCopy(locale).navigationTitle);
    expect(tarotTool?.description).toBe(expectedDescription);
    expect(tarotTool?.href).toBe(locale === 'en' ? '/tarot-cards' : '/zh/tarot-cards');
    expect(tarotTool?.preview).toMatchObject({
      type: 'image',
      src: '/tarot-cards/major-00-fool.webp',
    });
  });

  it.each(['en', 'zh'] as const)('uses a real localized language-generator case for %s', (locale) => {
    const languageCopy = getLanguageGeneratorPageCopy(locale);
    const campaignInscription = languageCopy.caseStudies.cases.find(
      (caseStudy) => caseStudy.id === 'campaign-inscription',
    );
    const example = campaignInscription?.examples[0];
    const languageTool = getToolDirectoryItems(locale).find(
      (toolItem) => toolItem.id === 'language-generator',
    );

    expect(example).toBeDefined();
    expect(languageTool?.preview).toEqual({
      type: 'text',
      sourceLabel: languageCopy.caseStudies.sourceLabel,
      source: example?.source,
      resultLabel: languageCopy.caseStudies.resultLabel,
      result: example?.result,
    });
  });

  it('fails with the invalid locale value instead of returning incomplete copy', () => {
    expect(() => getToolDirectoryItems('fr' as SiteLocale)).toThrow(
      'Unknown tool directory locale. Received "fr".',
    );
  });
});
