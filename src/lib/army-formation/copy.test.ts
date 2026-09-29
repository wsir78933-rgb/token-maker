import { describe, expect, it } from 'vitest';

import {
  getArmyFormationCreatorCopy,
  type ArmyFormationCreatorCopy,
} from '@/lib/army-formation/copy';

const STRING_FIELD_NAMES = [
  'productName',
  'navigationName',
  'pageTitle',
  'pageDescription',
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
  'saveInThisBrowser',
  'saveBattlefield',
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
  navigationName: 'Army formation creator',
  pageTitle: 'Army formation creator',
  pageDescription: 'Place battlefield pieces in the browser and download an image.',
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
  saveInThisBrowser: 'Save in this browser',
  saveBattlefield: 'Save battlefield',
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
  saveInThisBrowser: '保存在这个浏览器',
  saveBattlefield: '保存战场',
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
  it('英文产品名、导航名和页面标题正好是 Army formation creator', () => {
    const copy = getArmyFormationCreatorCopy('en');

    expect(copy.productName).toBe('Army formation creator');
    expect(copy.navigationName).toBe('Army formation creator');
    expect(copy.pageTitle).toBe('Army formation creator');
    expectStringFields(copy, englishStringFields);
    expect(copy.saveBattlefield).toBe('Save battlefield');
    expect(copy.saveBattlefield).not.toMatch(/\d/);
  });

  it('中文产品名和导航名是军阵', () => {
    const copy = getArmyFormationCreatorCopy('zh');

    expect(copy.productName).toBe('军阵');
    expect(copy.navigationName).toBe('军阵');
    expectStringFields(copy, chineseStringFields);
    expect(copy.saveBattlefield).toBe('保存战场');
    expect(copy.saveBattlefield).not.toMatch(/\d/);
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
