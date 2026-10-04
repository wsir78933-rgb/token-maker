import { describe, expect, it } from 'vitest';

import { getOutfitCreatorCategoryLabel, getOutfitCreatorCopy } from '@/lib/outfit-creator/copy';

describe('getOutfitCreatorCopy', () => {
  it('provides the required English page and editor copy', () => {
    const copy = getOutfitCreatorCopy('en');

    expect(copy.navigationName).toBe('Outfit Creator');
    expect(copy.pageTitle).toContain('Outfit Creator');
    expect(copy.heading).toContain('Outfit Creator');
    expect(copy.description).not.toHaveLength(0);
    expect(copy.heroAction).not.toHaveLength(0);
    expect(copy.categoryLabels.jackets).toBe('Jackets');
    expect(copy.categoryLabels.shirts2).toBe('Shirts 2');
    expect(copy.featureOverview.features).toHaveLength(6);
    expect(copy.howToUseSteps).toHaveLength(3);
    expect(copy.faqItems).toHaveLength(5);
  });

  it('keeps the Chinese labels and behavior copy parallel to English', () => {
    const copy = getOutfitCreatorCopy('zh');

    expect(copy.navigationName).toBe('服装搭配工具');
    expect(copy.genderMale).toBe('男');
    expect(copy.genderFemale).toBe('女');
    expect(Object.keys(copy.categoryLabels)).toHaveLength(9);
    expect(copy.categoryLabels.jackets).toBe('夹克');
    expect(copy.categoryLabels.shirts2).toBe('衬衫 2');
    expect(copy.featureOverview.features).toHaveLength(6);
    expect(copy.howToUseSteps).toHaveLength(3);
    expect(copy.faqItems).toHaveLength(5);
  });

  it('rejects unsupported locales and invalid save slot labels', () => {
    expect(() => getOutfitCreatorCopy('fr')).toThrow(/Unknown outfit creator locale/);
    expect(() => getOutfitCreatorCopy('en').outfitSlot(0)).toThrow(/Received 0/);
    expect(() => getOutfitCreatorCopy('en').outfitSlot(5)).toThrow(/Received 5/);
  });

  it('looks up a localized category label through the public copy API', () => {
    expect(getOutfitCreatorCategoryLabel('en', 'gloves')).toBe('Gloves');
    expect(getOutfitCreatorCategoryLabel('zh', 'gloves')).toBe('手套');
  });
});
