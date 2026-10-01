const ARMY_FORMATION_CREATOR_LOCALES = ['en', 'zh'] as const;

type ArmyFormationCreatorLocale = (typeof ARMY_FORMATION_CREATOR_LOCALES)[number];

export type ArmyFormationCreatorCopy = {
  productName: string;
  navigationName: string;
  pageTitle: string;
  pageDescription: string;
  heroTitleLead: string;
  heroTitleEmphasis: string;
  heroSubtitle: string;
  heroAction: string;
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
  previousRecordPrompt: string;
  restorePreviousRecord: string;
  startBlank: string;
  exportFile: string;
  exportImage: string;
  chooseFile: string;
  battlefield: string;
  emptySlot: string;
  switchToPreviousBattle: string;
  switchToNextBattle: string;
  previousNatoIconPage: string;
  nextNatoIconPage: string;
};

const englishArmyFormationCreatorCopy: ArmyFormationCreatorCopy = {
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
};

const chineseArmyFormationCreatorCopy: ArmyFormationCreatorCopy = {
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

function requireArmyFormationHeroTitlePart(
  value: string,
  fieldName: string,
  locale: ArmyFormationCreatorLocale,
): string {
  if (value.trim().length === 0) {
    throw new Error(
      `Army formation creator ${fieldName} is empty for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

export type ArmyFormationCreatorHero = {
  lead: string;
  emphasis: string;
  subtitle: string;
  action: string;
};

export function getArmyFormationCreatorCopy(locale: string): ArmyFormationCreatorCopy {
  return readArmyFormationCreatorCopy(requireArmyFormationCreatorLocale(locale));
}

export function getArmyFormationCreatorHero(locale: string): ArmyFormationCreatorHero {
  const supportedLocale = requireArmyFormationCreatorLocale(locale);
  const copy = readArmyFormationCreatorCopy(supportedLocale);

  return {
    lead: requireArmyFormationHeroTitlePart(copy.heroTitleLead, 'heroTitleLead', supportedLocale),
    emphasis: requireArmyFormationHeroTitlePart(copy.heroTitleEmphasis, 'heroTitleEmphasis', supportedLocale),
    subtitle: requireArmyFormationHeroTitlePart(copy.heroSubtitle, 'heroSubtitle', supportedLocale),
    action: requireArmyFormationHeroTitlePart(copy.heroAction, 'heroAction', supportedLocale),
  };
}
