import { describe, expect, it } from 'vitest';

import {
  getArmyFormationCreatorCopy,
  getArmyFormationCreatorHero,
  type ArmyFormationCreatorCopy,
} from '@/lib/army-formation/copy';

const STRING_FIELD_NAMES = [
  'productName',
  'navigationName',
  'pageTitle',
  'pageDescription',
  'heroTitleLead',
  'heroTitleEmphasis',
  'heroSubtitle',
  'heroAction',
  'helmets',
  'weapons',
  'animals',
  'vehiclesAndSiege',
  'nato',
  'color',
  'addToPalette',
  'deleteSelectedColor',
  'palette',
  'changeSelectedPieces',
  'deleteSelected',
  'angle',
  'rotateSelected',
  'changeBattlefield',
  'clearBattlefield',
  'height',
  'changeHeight',
  'changeBackgroundColor',
  'backgroundImage',
  'setBackgroundImage',
  'previousRecordPrompt',
  'restorePreviousRecord',
  'startBlank',
  'exportFile',
  'exportImage',
  'chooseFile',
  'battlefield',
  'emptySlot',
  'switchToPreviousBattle',
  'switchToNextBattle',
  'previousNatoIconPage',
  'nextNatoIconPage',
] as const satisfies readonly (keyof ArmyFormationCreatorCopy)[];

const englishStringFields = {
  productName: 'Army formation creator',
  navigationName: 'Army Formation Creator',
  pageTitle: 'Army formation creator',
  pageDescription: 'Place battlefield pieces in the browser and download an image.',
  heroTitleLead: 'Place battlefield pieces in your browser',
  heroTitleEmphasis: 'Army formation creator',
  heroSubtitle: 'Arrange the formation on the battlefield, then download an image.',
  heroAction: 'Try for Free',
  helmets: 'Helmets',
  weapons: 'Weapons',
  animals: 'Animals',
  vehiclesAndSiege: 'Vehicles and siege',
  nato: 'NATO',
  color: 'Color',
  addToPalette: 'Add to palette',
  deleteSelectedColor: 'Delete selected color',
  palette: 'Palette',
  changeSelectedPieces: 'Change selected pieces',
  deleteSelected: 'Delete selected',
  angle: 'Angle',
  rotateSelected: 'Rotate selected',
  changeBattlefield: 'Change battlefield',
  clearBattlefield: 'Clear battlefield',
  height: 'Height',
  changeHeight: 'Change height',
  changeBackgroundColor: 'Change background color',
  backgroundImage: 'Background image',
  setBackgroundImage: 'Set background image',
  previousRecordPrompt: 'A previous record was found. Restore it?',
  restorePreviousRecord: 'Restore',
  startBlank: 'Start blank',
  exportFile: 'Export file',
  exportImage: 'Export image',
  chooseFile: 'Choose file',
  battlefield: 'Battlefield',
  emptySlot: 'Empty slot',
  switchToPreviousBattle: 'Switch to previous battle',
  switchToNextBattle: 'Switch to next battle',
  previousNatoIconPage: 'Previous page',
  nextNatoIconPage: 'Next page',
} as const satisfies Record<(typeof STRING_FIELD_NAMES)[number], string>;

const chineseStringFields = {
  productName: '军阵',
  navigationName: '军阵',
  pageTitle: '军阵',
  pageDescription: '在浏览器里摆放战场棋子并下载图片。',
  heroTitleLead: '在浏览器里摆放战场棋子',
  heroTitleEmphasis: '军阵制作器',
  heroSubtitle: '在战场上把阵型摆好，然后下载图片。',
  heroAction: '免费试用',
  helmets: '头盔',
  weapons: '武器',
  animals: '动物',
  vehiclesAndSiege: '载具攻城',
  nato: '北约',
  color: '上色',
  addToPalette: '加入调色盘',
  deleteSelectedColor: '删除所选颜色',
  palette: '调色盘',
  changeSelectedPieces: '改选中的棋子',
  deleteSelected: '删除所选',
  angle: '角度',
  rotateSelected: '旋转所选',
  changeBattlefield: '改战场',
  clearBattlefield: '清空战场',
  height: '高度',
  changeHeight: '改变高度',
  changeBackgroundColor: '改变底色',
  backgroundImage: '背景图',
  setBackgroundImage: '设置背景图',
  previousRecordPrompt: '发现上次的记录。要回到上次的记录吗？',
  restorePreviousRecord: '回到上次',
  startBlank: '从空白开始',
  exportFile: '导出文件',
  exportImage: '导出图片',
  chooseFile: '选择文件',
  battlefield: '战场',
  emptySlot: '空位',
  switchToPreviousBattle: '切换到上一场',
  switchToNextBattle: '切换到下一场',
  previousNatoIconPage: '上一页',
  nextNatoIconPage: '下一页',
} as const satisfies Record<(typeof STRING_FIELD_NAMES)[number], string>;

function expectStringFields(
  copy: ArmyFormationCreatorCopy,
  expectedFields: Record<(typeof STRING_FIELD_NAMES)[number], string>,
) {
  for (const fieldName of STRING_FIELD_NAMES) {
    const label = copy[fieldName];
    const expectedLabel = expectedFields[fieldName];

    expect(label, fieldName).toBe(expectedLabel);
    expect(label.trim(), fieldName).not.toBe('');
  }
}

describe('getArmyFormationCreatorCopy', () => {
  it('英文导航名是 Army Formation Creator，产品名和页面标题保持原样', () => {
    const copy = getArmyFormationCreatorCopy('en');

    expect(copy.productName).toBe('Army formation creator');
    expect(copy.navigationName).toBe('Army Formation Creator');
    expect(copy.pageTitle).toBe('Army formation creator');
    expectStringFields(copy, englishStringFields);
    expect(copy.previousRecordPrompt).toBe('A previous record was found. Restore it?');
    expect(copy.restorePreviousRecord).toBe('Restore');
    expect(copy.startBlank).toBe('Start blank');
  });

  it('中文产品名和导航名是军阵', () => {
    const copy = getArmyFormationCreatorCopy('zh');

    expect(copy.productName).toBe('军阵');
    expect(copy.navigationName).toBe('军阵');
    expectStringFields(copy, chineseStringFields);
    expect(copy.previousRecordPrompt).toBe('发现上次的记录。要回到上次的记录吗？');
    expect(copy.restorePreviousRecord).toBe('回到上次');
    expect(copy.startBlank).toBe('从空白开始');
  });

  it('locale 为 fr 时抛错，并且错误信息包含收到的 locale', () => {
    expect(() => getArmyFormationCreatorCopy('fr')).toThrowError(
      /^Unknown army formation creator locale: "fr"$/,
    );
  });

  it('空 locale 抛错，并且错误信息包含收到的空字符串', () => {
    expect(() => getArmyFormationCreatorCopy('')).toThrowError(
      /^Unknown army formation creator locale: ""$/,
    );
  });
});

describe('getArmyFormationCreatorHero', () => {
  it('英文 hero 用关键词做大标题，并带上说明和按钮', () => {
    expect(getArmyFormationCreatorHero('en')).toEqual({
      lead: 'Place battlefield pieces in your browser',
      emphasis: 'Army formation creator',
      subtitle: 'Arrange the formation on the battlefield, then download an image.',
      action: 'Try for Free',
    });
  });

  it('中文 hero 的强调词是军阵制作器', () => {
    expect(getArmyFormationCreatorHero('zh')).toEqual({
      lead: '在浏览器里摆放战场棋子',
      emphasis: '军阵制作器',
      subtitle: '在战场上把阵型摆好，然后下载图片。',
      action: '免费试用',
    });
  });

  it('未知 locale 抛错，并且错误信息包含收到的 locale', () => {
    expect(() => getArmyFormationCreatorHero('fr')).toThrowError(
      /^Unknown army formation creator locale: "fr"$/,
    );
  });
});
