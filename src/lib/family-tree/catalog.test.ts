import { describe, expect, it } from 'vitest';

import {
  FAMILY_TREE_AVATAR_CATEGORIES,
  FAMILY_TREE_COLOR_PALETTES,
  getFamilyTreeCategoryChoices,
} from '@/lib/family-tree/catalog';

describe('family tree avatar catalog', () => {
  it('keeps the eight source categories and all source choice groups', () => {
    expect(FAMILY_TREE_AVATAR_CATEGORIES).toEqual([
      'faces',
      'hair',
      'ears',
      'eyes',
      'eyebrows',
      'noses',
      'mouths',
      'extras',
    ]);

    expect(getFamilyTreeCategoryChoices('faces')).toHaveLength(57);
    expect(getFamilyTreeCategoryChoices('hair')).toHaveLength(41);
    expect(getFamilyTreeCategoryChoices('ears')).toHaveLength(5);
    expect(getFamilyTreeCategoryChoices('eyes')).toHaveLength(40);
    expect(getFamilyTreeCategoryChoices('eyebrows')).toHaveLength(80);
    expect(getFamilyTreeCategoryChoices('noses')).toHaveLength(58);
    expect(getFamilyTreeCategoryChoices('mouths')).toHaveLength(80);
    expect(getFamilyTreeCategoryChoices('extras')).toHaveLength(52);

    expect(getFamilyTreeCategoryChoices('faces').filter((choice) => choice.group === 'beards')).toHaveLength(17);
    expect(getFamilyTreeCategoryChoices('noses').filter((choice) => choice.group === 'moustaches')).toHaveLength(28);
    expect(getFamilyTreeCategoryChoices('extras').filter((choice) => choice.group === 'scars')).toHaveLength(30);
  });

  it('keeps the source palette sizes and representative values', () => {
    expect(FAMILY_TREE_COLOR_PALETTES.skinColor).toHaveLength(24);
    expect(FAMILY_TREE_COLOR_PALETTES.hairColor).toHaveLength(16);
    expect(FAMILY_TREE_COLOR_PALETTES.eyeColor).toHaveLength(10);
    expect(FAMILY_TREE_COLOR_PALETTES.eyebrowColor).toHaveLength(16);
    expect(FAMILY_TREE_COLOR_PALETTES.moustacheColor).toHaveLength(16);
    expect(FAMILY_TREE_COLOR_PALETTES.skinColor[0]).toBe('#FBC6AF');
    expect(FAMILY_TREE_COLOR_PALETTES.skinColor[23]).toBe('#406D23');
    expect(FAMILY_TREE_COLOR_PALETTES.eyeColor[0]).toBe('#658AC7');
    expect(FAMILY_TREE_COLOR_PALETTES.moustacheColor[15]).toBe('#CF4BEF');
  });
});
