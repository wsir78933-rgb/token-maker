import { describe, expect, it } from 'vitest';

import { getFamilyTreeCopy, type FamilyTreeCopy } from './copy';
import type { SiteLocale } from '@/lib/site-locale';

const EXPECTED_TOP_LEVEL_KEYS = [
  'navigationName',
  'pageTitle',
  'pageDescription',
  'heading',
  'heroAction',
  'workspaceLabel',
  'personEditor',
  'familyCanvas',
  'canvasHint',
  'newPerson',
  'selectedPerson',
  'name',
  'age',
  'description',
  'namePlaceholder',
  'agePlaceholder',
  'descriptionPlaceholder',
  'randomAvatar',
  'avatarHelp',
  'noHair',
  'resetWrinkles',
  'scarsHint',
  'wrinklesHint',
  'placement',
  'addPerson',
  'deletePerson',
  'connectionEditor',
  'endpointHint',
  'addConnection',
  'clearConnections',
  'resizeEnabled',
  'resizeDisabled',
  'dragConnectionHint',
  'saveLoad',
  'localFile',
  'saveFile',
  'chooseFile',
  'loadFile',
  'noFile',
  'loadReplacesHint',
  'save',
  'load',
  'emptySlot',
  'savedSlot',
  'generateImage',
  'imagePreview',
  'regenerateImage',
  'saveImage',
  'imageHelp',
  'transparentBackground',
  'whiteBackground',
  'done',
  'close',
  'editPerson',
  'editConnections',
  'storageAndExport',
  'loading',
  'unnamedPerson',
  'errorStorage',
  'errorFile',
  'errorImage',
  'personAdded',
  'slotSaved',
  'slotLoaded',
  'fileLoaded',
  'categoryNames',
  'colorNames',
  'directions',
  'endpointStyles',
  'generations',
  'connectionGaps',
  'saveSlots',
  'partGroupNames',
] as const satisfies readonly (keyof FamilyTreeCopy)[];

const EXPECTED_CATEGORY_KEYS = [
  'faces',
  'hair',
  'ears',
  'eyes',
  'eyebrows',
  'noses',
  'mouths',
  'extras',
] as const;

const EXPECTED_COLOR_KEYS = [
  'skinColor',
  'hairColor',
  'eyeColor',
  'eyebrowColor',
  'moustacheColor',
] as const;

const EXPECTED_DIRECTION_KEYS = ['top', 'bottom', 'left', 'right'] as const;
const EXPECTED_ENDPOINT_STYLE_KEYS = ['none', 'solid', 'dashed'] as const;
const EXPECTED_GENERATION_KEYS = ['generation1', 'generation2', 'generation3', 'generation4'] as const;
const EXPECTED_CONNECTION_GAP_KEYS = [
  'generation1To2',
  'generation2To3',
  'generation3To4',
] as const;
const EXPECTED_SAVE_SLOT_KEYS = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'] as const;
const EXPECTED_PART_GROUP_KEYS = [
  'faces',
  'beards',
  'hair',
  'ears',
  'eyes',
  'eyebrows',
  'noses',
  'moustaches',
  'mouths',
  'faceWrinkles',
  'eyeWrinkles',
  'scars',
] as const;

function collectStrings(value: unknown, path = 'copy'): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Expected ${path} to be a plain copy object or string.`);
  }

  return Object.entries(value).flatMap(([key, child]) => collectStrings(child, `${path}.${key}`));
}

function expectFixedKeys(value: object, expectedKeys: readonly string[], path: string): void {
  expect(Object.keys(value), path).toEqual(expectedKeys);
}

function expectCompleteCopy(copy: FamilyTreeCopy): void {
  expectFixedKeys(copy, EXPECTED_TOP_LEVEL_KEYS, 'top-level copy keys');
  expectFixedKeys(copy.categoryNames, EXPECTED_CATEGORY_KEYS, 'category names');
  expectFixedKeys(copy.colorNames, EXPECTED_COLOR_KEYS, 'color names');
  expectFixedKeys(copy.directions, EXPECTED_DIRECTION_KEYS, 'directions');
  expectFixedKeys(copy.endpointStyles, EXPECTED_ENDPOINT_STYLE_KEYS, 'endpoint styles');
  expectFixedKeys(copy.generations, EXPECTED_GENERATION_KEYS, 'generations');
  expectFixedKeys(copy.connectionGaps, EXPECTED_CONNECTION_GAP_KEYS, 'connection gaps');
  expectFixedKeys(copy.saveSlots, EXPECTED_SAVE_SLOT_KEYS, 'save slots');
  expectFixedKeys(copy.partGroupNames, EXPECTED_PART_GROUP_KEYS, 'part group names');
  expect(collectStrings(copy).every((value) => value.trim().length > 0)).toBe(true);
}

describe('family tree copy', () => {
  it('provides the same complete fixed EN/ZH contract', () => {
    const english = getFamilyTreeCopy('en');
    const chinese = getFamilyTreeCopy('zh');

    expectCompleteCopy(english);
    expectCompleteCopy(chinese);
    expect(Object.keys(chinese)).toEqual(Object.keys(english));
    expect(Object.keys(chinese.categoryNames)).toEqual(Object.keys(english.categoryNames));
    expect(Object.keys(chinese.partGroupNames)).toEqual(Object.keys(english.partGroupNames));
  });

  it('uses localized product and workspace names', () => {
    expect(getFamilyTreeCopy('en').navigationName).toBe('Family Tree Creator');
    expect(getFamilyTreeCopy('zh').navigationName).toBe('人物家谱制作器');
    expect(getFamilyTreeCopy('en').workspaceLabel).toBe('Family tree workspace');
    expect(getFamilyTreeCopy('zh').workspaceLabel).toBe('人物家谱工作区');
  });

  it('uses the approved bilingual hero and metadata copy', () => {
    const english = getFamilyTreeCopy('en');
    const chinese = getFamilyTreeCopy('zh');

    expect(english.pageTitle).toBe('Fantasy Family Tree Maker – Create Family Trees for Free');
    expect(english.heading).toBe('Fantasy Family Tree Maker – Create Family Trees for Free');
    expect(english.heroAction).toBe('Create a Family Tree for Free');
    expect(english.pageDescription).toBe(
      'Create fantasy family trees for novels, worldbuilding, and D&D campaigns. Customize character portraits, add character details, and connect generations.',
    );
    expect(english.pageTitle).toHaveLength(56);
    expect(english.pageDescription).toHaveLength(152);

    expect(chinese.pageTitle).toBe('奇幻人物家谱制作器｜免费制作小说与 D&D 角色家谱');
    expect(chinese.heading).toBe('奇幻人物家谱制作器｜免费制作小说与 D&D 角色家谱');
    expect(chinese.heroAction).toBe('免费制作家谱');
    expect(chinese.pageDescription).toBe(
      '为小说、奇幻世界观和 D&D 战役制作人物家谱。自定义角色头像、编辑人物信息、连接不同世代，梳理角色之间的家族关系。',
    );
    expect(chinese.pageTitle).toHaveLength(26);
    expect(chinese.pageDescription).toHaveLength(58);
  });

  it('describes transparent export and the optional white background', () => {
    const english = getFamilyTreeCopy('en');
    const chinese = getFamilyTreeCopy('zh');

    expect(english.transparentBackground).toBe('Transparent background');
    expect(chinese.transparentBackground).toBe('透明背景');
    expect(english.whiteBackground).toBe('White background');
    expect(chinese.whiteBackground).toBe('白色背景');
    expect(english.imageHelp).toContain('transparent by default');
    expect(english.imageHelp).toContain('white background');
    expect(chinese.imageHelp).toContain('透明背景');
    expect(chinese.imageHelp).toContain('白色背景');
  });

  it('keeps the competitor feature vocabulary in the copy contract', () => {
    const english = getFamilyTreeCopy('en');
    const chinese = getFamilyTreeCopy('zh');

    expect(english.categoryNames).toEqual({
      faces: 'Faces',
      hair: 'Hair',
      ears: 'Ears',
      eyes: 'Eyes',
      eyebrows: 'Eyebrows',
      noses: 'Noses',
      mouths: 'Mouths',
      extras: 'Extras',
    });
    expect(chinese.colorNames).toEqual({
      skinColor: '肤色',
      hairColor: '发色',
      eyeColor: '眼睛颜色',
      eyebrowColor: '眉色',
      moustacheColor: '小胡子颜色',
    });
    expect(english.generations).toEqual({
      generation1: 'Generation 1',
      generation2: 'Generation 2',
      generation3: 'Generation 3',
      generation4: 'Generation 4',
    });
    expect(chinese.saveSlots).toEqual({
      slot1: '槽位 1',
      slot2: '槽位 2',
      slot3: '槽位 3',
      slot4: '槽位 4',
      slot5: '槽位 5',
    });
  });

  it('rejects an unsupported locale with the received value', () => {
    expect(() => getFamilyTreeCopy('fr' as SiteLocale)).toThrowError(
      /^Unknown family tree locale: "fr"\.$/,
    );
  });
});
