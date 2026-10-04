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
  'angleInputError',
  'resetSelectedRotation',
  'changeBattlefield',
  'clearBattlefield',
  'height',
  'heightInputError',
  'heightRangeError',
  'resetHeight',
  'changeBackgroundColor',
  'resetBackgroundColor',
  'backgroundImage',
  'setBackgroundImage',
  'resetBackgroundImageView',
  'backgroundImageInteractionHint',
  'previousRecordPrompt',
  'restorePreviousRecord',
  'startBlank',
  'exportFile',
  'exportPng',
  'chooseFile',
  'battlefield',
  'emptySlot',
  'switchToPreviousBattle',
  'switchToNextBattle',
  'previousNatoIconPage',
  'nextNatoIconPage',
  'dismissError',
] as const satisfies readonly (keyof ArmyFormationCreatorCopy)[];

const englishStringFields = {
  productName: 'Army formation creator',
  navigationName: 'Army Formation Creator',
  pageTitle: 'Army formation creator: Free Online D&D & RPG Tool',
  pageDescription:
    'Help GMs plan D&D and tabletop RPG battles online for free. Arrange forces, creatures, and siege pieces, then export a formation image to share with players.',
  heroTitleLead: 'Plan D&D and tabletop RPG battles online',
  heroTitleEmphasis: 'Army formation creator',
  heroSubtitle:
    'Arrange forces, creatures, and siege pieces, then export an image for your players or worldbuilding notes.',
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
  deleteSelected: 'Delete selected (Delete / Backspace)',
  angle: 'Angle',
  angleInputError: 'Enter a valid number for the angle: {received}.',
  resetSelectedRotation: 'Reset rotation',
  changeBattlefield: 'Change battlefield',
  clearBattlefield: 'Clear battlefield',
  height: 'Height',
  heightInputError: 'Enter a valid number for the height: {received}.',
  heightRangeError: 'Height must be between 200 and 2000: {received}.',
  resetHeight: 'Reset height',
  changeBackgroundColor: 'Change background color',
  resetBackgroundColor: 'Reset background color',
  backgroundImage: 'Background image',
  setBackgroundImage: 'Set background image',
  resetBackgroundImageView: 'Fit the entire battlefield',
  backgroundImageInteractionHint:
    'Drag an empty area to pan the entire battlefield. Use the scroll wheel to zoom the entire battlefield. Drag a game piece to move only that piece. The view is kept for this page session only; it is not saved and resets on refresh or import.',
  previousRecordPrompt: 'A previous record was found. Restore it?',
  restorePreviousRecord: 'Restore',
  startBlank: 'Start blank',
  exportFile: 'Export file',
  exportPng: 'Export PNG',
  chooseFile: 'Choose file',
  battlefield: 'Battlefield',
  emptySlot: 'Empty slot',
  switchToPreviousBattle: 'Switch to previous battle',
  switchToNextBattle: 'Switch to next battle',
  previousNatoIconPage: 'Previous page',
  nextNatoIconPage: 'Next page',
  dismissError: 'Dismiss error',
} as const satisfies Record<(typeof STRING_FIELD_NAMES)[number], string>;

const chineseStringFields = {
  productName: '军阵',
  navigationName: '军队阵型制作器',
  pageTitle: '军队阵型制作器｜免费在线制作 D&D/RPG 战场',
  pageDescription:
    '帮助 GM 免费在线规划 D&D 与桌面 RPG 战场，摆放各方军队、生物和攻城器械，并导出阵型图片与玩家分享。',
  heroTitleLead: '在线规划 D&D 与桌面 RPG 战场',
  heroTitleEmphasis: '军队阵型制作器',
  heroSubtitle: '免费摆放军队、生物和攻城器械，导出阵型图片，分享给玩家或留作奇幻设定资料。',
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
  deleteSelected: '删除所选（Delete / Backspace）',
  angle: '角度',
  angleInputError: '角度必须是有效数字：{received}。',
  resetSelectedRotation: '重置旋转',
  changeBattlefield: '改战场',
  clearBattlefield: '清空战场',
  height: '高度',
  heightInputError: '高度必须是有效数字：{received}。',
  heightRangeError: '高度必须在 200–2000 之间：{received}。',
  resetHeight: '重置高度',
  changeBackgroundColor: '改变底色',
  resetBackgroundColor: '重置底色',
  backgroundImage: '背景图',
  setBackgroundImage: '设置背景图',
  resetBackgroundImageView: '适配整个战场',
  backgroundImageInteractionHint:
    '拖动空白处可平移整个战场，滚动滚轮可缩放整个战场；拖动兵棋只会移动该兵棋。视角仅在本次页面会话内保留，不会保存，刷新页面或导入后会重置。',
  previousRecordPrompt: '发现上次的记录。要回到上次的记录吗？',
  restorePreviousRecord: '回到上次',
  startBlank: '从空白开始',
  exportFile: '导出文件',
  exportPng: '导出 PNG',
  chooseFile: '选择文件',
  battlefield: '战场',
  emptySlot: '空位',
  switchToPreviousBattle: '切换到上一场',
  switchToNextBattle: '切换到下一场',
  previousNatoIconPage: '上一页',
  nextNatoIconPage: '下一页',
  dismissError: '关闭提示',
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
  it('英文导航名保持 Army Formation Creator，并提供新版 SEO 标题和描述', () => {
    const copy = getArmyFormationCreatorCopy('en');

    expect(copy.productName).toBe('Army formation creator');
    expect(copy.navigationName).toBe('Army Formation Creator');
    expect(copy.pageTitle).toBe('Army formation creator: Free Online D&D & RPG Tool');
    expectStringFields(copy, englishStringFields);
    expect(copy.previousRecordPrompt).toBe('A previous record was found. Restore it?');
    expect(copy.restorePreviousRecord).toBe('Restore');
    expect(copy.startBlank).toBe('Start blank');
  });

  it('保留中文军阵产品名并直译导航名', () => {
    const copy = getArmyFormationCreatorCopy('zh');

    expect(copy.productName).toBe('军阵');
    expect(copy.navigationName).toBe('军队阵型制作器');
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
  it('英文 hero 点明 D&D 与桌面 RPG 场景，并带上说明和按钮', () => {
    expect(getArmyFormationCreatorHero('en')).toEqual({
      lead: 'Plan D&D and tabletop RPG battles online',
      emphasis: 'Army formation creator',
      subtitle:
        'Arrange forces, creatures, and siege pieces, then export an image for your players or worldbuilding notes.',
      action: 'Try for Free',
    });
  });

  it('中文 hero 点明桌面 RPG 场景并使用军队阵型制作器关键词', () => {
    expect(getArmyFormationCreatorHero('zh')).toEqual({
      lead: '在线规划 D&D 与桌面 RPG 战场',
      emphasis: '军队阵型制作器',
      subtitle: '免费摆放军队、生物和攻城器械，导出阵型图片，分享给玩家或留作奇幻设定资料。',
      action: '免费试用',
    });
  });

  it('未知 locale 抛错，并且错误信息包含收到的 locale', () => {
    expect(() => getArmyFormationCreatorHero('fr')).toThrowError(
      /^Unknown army formation creator locale: "fr"$/,
    );
  });
});
