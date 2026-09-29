import { describe, expect, it } from 'vitest';

import {
  getArmorCreatorCopy,
  getArmorCreatorHeroTitle,
  type ArmorCreatorCopy,
} from '@/lib/armor-creator/copy';

const STRING_FIELD_NAMES = [
  'genderMale',
  'genderFemale',
  'materialPlate',
  'materialLeather',
  'materialCloth',
  'slotHelm',
  'slotChest',
  'slotFeet',
  'slotShoulderLeft',
  'slotLegs',
  'slotGloves',
  'slotShoulderRight',
  'slotCloak',
  'slotCrown',
  'slotWing',
  'cloakFront',
  'cloakBack',
  'chestCurve',
  'shoulderSymmetry',
  'clearEquipment',
  'downloadImage',
  'preview',
  'pageTitle',
  'pageDescription',
  'heroTitleLead',
  'heroTitleEmphasis',
  'heroTitleTail',
  'heroAction',
] as const satisfies readonly (keyof ArmorCreatorCopy)[];

const SAVE_SLOT_NUMBERS = [1, 2, 3, 4] as const;

const englishStringFields = {
  genderMale: 'Male',
  genderFemale: 'Female',
  materialPlate: 'Plate',
  materialLeather: 'Leather',
  materialCloth: 'Cloth',
  slotHelm: 'Helm',
  slotChest: 'Chest',
  slotFeet: 'Feet',
  slotShoulderLeft: 'Left shoulder',
  slotLegs: 'Legs',
  slotGloves: 'Gloves',
  slotShoulderRight: 'Right shoulder',
  slotCloak: 'Cloak',
  slotCrown: 'Crown',
  slotWing: 'Wings',
  cloakFront: 'Front',
  cloakBack: 'Back',
  chestCurve: 'Chest curve',
  shoulderSymmetry: 'Symmetric shoulders',
  clearEquipment: 'Clear',
  downloadImage: 'Download image',
  preview: 'Preview',
  pageTitle: 'Armor creator',
  pageDescription: 'Mix and match armor in the browser and download an image.',
  heroTitleLead: "Build your character's",
  heroTitleEmphasis: 'armor',
  heroTitleTail: 'look',
  heroAction: 'Try for Free',
} as const satisfies Record<(typeof STRING_FIELD_NAMES)[number], string>;

const chineseStringFields = {
  genderMale: '男',
  genderFemale: '女',
  materialPlate: '板甲',
  materialLeather: '皮甲',
  materialCloth: '布甲',
  slotHelm: '头盔',
  slotChest: '胸甲',
  slotFeet: '脚',
  slotShoulderLeft: '左肩',
  slotLegs: '腿',
  slotGloves: '手套',
  slotShoulderRight: '右肩',
  slotCloak: '斗篷',
  slotCrown: '王冠',
  slotWing: '翅膀',
  cloakFront: '正面',
  cloakBack: '背面',
  chestCurve: '胸甲曲线',
  shoulderSymmetry: '左右肩对称',
  clearEquipment: '清空',
  downloadImage: '下载图片',
  preview: '预览',
  pageTitle: '护甲制作',
  pageDescription: '在浏览器里搭配护甲并下载图片。',
  heroTitleLead: '在浏览器里搭配你的',
  heroTitleEmphasis: '护甲',
  heroTitleTail: '造型',
  heroAction: 'Try for Free',
} as const satisfies Record<(typeof STRING_FIELD_NAMES)[number], string>;

function expectNonEmptyStringFields(
  copy: ArmorCreatorCopy,
  expectedFields: Record<(typeof STRING_FIELD_NAMES)[number], string>,
) {
  for (const fieldName of STRING_FIELD_NAMES) {
    const label = copy[fieldName];
    const expectedLabel = expectedFields[fieldName];

    expect(label, fieldName).toBe(expectedLabel);
    expect(label.trim(), fieldName).not.toBe('');
  }
}

function expectSaveSlotLabels(
  copy: ArmorCreatorCopy,
  savePrefix: string,
  loadPrefix: string,
  replacePrefix: string,
  questionMark: string,
) {
  for (const slotNumber of SAVE_SLOT_NUMBERS) {
    const saveLabel = copy.saveSlot(slotNumber);
    const loadLabel = copy.loadSlot(slotNumber);
    const replaceConfirmation = copy.replaceSaveConfirm(slotNumber);

    expect(saveLabel).toBe(`${savePrefix} ${slotNumber}`);
    expect(loadLabel).toBe(`${loadPrefix} ${slotNumber}`);
    expect(replaceConfirmation).toBe(`${replacePrefix} ${slotNumber}${questionMark}`);
    expect(saveLabel.trim()).not.toBe('');
    expect(loadLabel.trim()).not.toBe('');
    expect(replaceConfirmation.trim()).not.toBe('');
    expect(replaceConfirmation).toContain(String(slotNumber));
  }
}

describe('getArmorCreatorCopy', () => {
  it('英文短标签都不是空字符串', () => {
    const copy = getArmorCreatorCopy('en');

    expectNonEmptyStringFields(copy, englishStringFields);
    expectSaveSlotLabels(copy, 'Save', 'Load', 'Replace save', '?');
  });

  it('中文短标签都不是空字符串', () => {
    const copy = getArmorCreatorCopy('zh');

    expectNonEmptyStringFields(copy, chineseStringFields);
    expectSaveSlotLabels(copy, '保存', '读取', '替换保存', '？');
  });

  it('locale 为 fr 时抛错，并且错误信息包含 fr', () => {
    expect(() => getArmorCreatorCopy('fr')).toThrowError(/^Unknown armor creator locale: "fr"\.$/);
    expect(() => getArmorCreatorHeroTitle('fr')).toThrowError(/^Unknown armor creator locale: "fr"\.$/);
  });

  it('页面标题把关键词单独拿出来，英文词之间留空格，中文不留', () => {
    expect(getArmorCreatorHeroTitle('en')).toEqual({
      lead: "Build your character's",
      lineGap: ' ',
      emphasis: 'armor',
      tail: 'look',
      gap: ' ',
      description: 'Mix and match armor in the browser and download an image.',
      action: 'Try for Free',
    });
    expect(getArmorCreatorHeroTitle('zh')).toEqual({
      lead: '在浏览器里搭配你的',
      lineGap: '',
      emphasis: '护甲',
      tail: '造型',
      gap: '',
      description: '在浏览器里搭配护甲并下载图片。',
      action: 'Try for Free',
    });
  });

  it('保存槽位超出 1 到 4 时抛错，并且错误信息包含收到的槽位号', () => {
    const copy = getArmorCreatorCopy('en');

    expect(() => copy.saveSlot(5)).toThrowError(/Received slot number: 5/);
    expect(() => copy.loadSlot(0)).toThrowError(/Received slot number: 0/);
    expect(() => copy.replaceSaveConfirm(1.5)).toThrowError(/Received slot number: 1\.5/);
  });
});
