const ARMY_FORMATION_CREATOR_LOCALES = ['en', 'zh'] as const;

type ArmyFormationCreatorLocale = (typeof ARMY_FORMATION_CREATOR_LOCALES)[number];

export type ArmyFormationCreatorCopy = {
  productName: string;
  navigationName: string;
  pageTitle: string;
  pageDescription: string;
  helmets: string;
  weapons: string;
  animals: string;
  vehiclesAndSiege: string;
  nato: string;
  color: string;
  addToPalette: string;
  deleteSelectedColor: string;
  palette: string;
  changeSelectedPieces: string;
  deleteSelected: string;
  angle: string;
  rotateSelected: string;
  changeBattlefield: string;
  clearBattlefield: string;
  height: string;
  changeHeight: string;
  changeBackgroundColor: string;
  backgroundImage: string;
  setBackgroundImage: string;
  saveInThisBrowser: string;
  saveBattlefield: string;
  exportFile: string;
  exportImage: string;
  chooseFile: string;
  battlefield: string;
  emptySlot: string;
  switchToPreviousBattle: string;
  switchToNextBattle: string;
};

const englishArmyFormationCreatorCopy: ArmyFormationCreatorCopy = {
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
};

const chineseArmyFormationCreatorCopy: ArmyFormationCreatorCopy = {
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
};

function isArmyFormationCreatorLocale(locale: string): locale is ArmyFormationCreatorLocale {
  return ARMY_FORMATION_CREATOR_LOCALES.some((supportedLocale) => supportedLocale === locale);
}

function requireArmyFormationCreatorLocale(locale: string): ArmyFormationCreatorLocale {
  if (isArmyFormationCreatorLocale(locale)) {
    return locale;
  }

  throw new Error(`Unknown army formation creator locale: ${JSON.stringify(locale)}`);
}

function readArmyFormationCreatorCopy(locale: ArmyFormationCreatorLocale): ArmyFormationCreatorCopy {
  if (locale === 'en') {
    return englishArmyFormationCreatorCopy;
  }

  if (locale === 'zh') {
    return chineseArmyFormationCreatorCopy;
  }

  throw new Error(`Unknown army formation creator locale: ${JSON.stringify(locale)}`);
}

export function getArmyFormationCreatorCopy(locale: string): ArmyFormationCreatorCopy {
  return readArmyFormationCreatorCopy(requireArmyFormationCreatorLocale(locale));
}
