import { describe, expect, it } from 'vitest';

import { getSolarSystemCaseStudiesCopy } from './case-studies';

const GROUP_IDS = ['fiction', 'trpg', 'concept'] as const;
const IMAGE_POSITIONS = ['left', 'right', 'left'] as const;

describe('solar system case studies copy', () => {
  it.each(['en', 'zh'] as const)('provides three localized groups of four examples in %s', (locale) => {
    const copy = getSolarSystemCaseStudiesCopy(locale);

    expect(copy.title).toBeTruthy();
    expect(copy.description).toBeTruthy();
    expect(copy.groups).toHaveLength(3);
    expect(copy.groups.map((group) => group.id)).toEqual(GROUP_IDS);
    expect(copy.groups.map((group) => group.imagePosition)).toEqual(IMAGE_POSITIONS);

    for (const group of copy.groups) {
      expect(group.carouselLabel).toBeTruthy();
      expect(group.previousLabel).toBeTruthy();
      expect(group.nextLabel).toBeTruthy();
      expect(group.examples).toHaveLength(4);

      for (const example of group.examples) {
        expect(example.name).toBeTruthy();
        expect(example.designation).toBeTruthy();
        expect(example.quote).toBeTruthy();
        expect(example.src).toMatch(/^\/solar-system-creator\/examples\/.+\.png$/);
      }
    }

    const serializedCopy = JSON.stringify(copy);
    expect(JSON.parse(serializedCopy)).toEqual(copy);
  });

  it('keeps the twelve PNG paths aligned while localizing the source copy', () => {
    const english = getSolarSystemCaseStudiesCopy('en');
    const chinese = getSolarSystemCaseStudiesCopy('zh');
    const englishExamples = english.groups.flatMap((group) => group.examples);
    const chineseExamples = chinese.groups.flatMap((group) => group.examples);

    expect(englishExamples).toHaveLength(12);
    expect(new Set(englishExamples.map((example) => example.src)).size).toBe(12);
    expect(chineseExamples.map((example) => example.src)).toEqual(
      englishExamples.map((example) => example.src),
    );
    expect(chineseExamples.map((example) => example.name)).not.toEqual(
      englishExamples.map((example) => example.name),
    );
    expect(chineseExamples.map((example) => example.quote)).not.toEqual(
      englishExamples.map((example) => example.quote),
    );
  });

  it('rejects a runtime locale outside the SiteLocale union', () => {
    expect(() => getSolarSystemCaseStudiesCopy('fr' as never)).toThrow(
      'must be en or zh. Received fr',
    );
  });
});
