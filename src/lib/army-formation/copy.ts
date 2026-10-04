import { getI18nDictionary } from '@/lib/i18n/dictionary';

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
  angleInputError: string;
  resetSelectedRotation: string;
  rotatePiece: string;
  rotationHint: string;
  changeBattlefield: string;
  clearBattlefield: string;
  height: string;
  heightInputError: string;
  heightRangeError: string;
  resetHeight: string;
  changeBackgroundColor: string;
  resetBackgroundColor: string;
  backgroundImage: string;
  setBackgroundImage: string;
  uploadBackgroundImage: string;
  removeBackgroundImage: string;
  resetBackgroundImageView: string;
  backgroundImageInteractionHint: string;
  backgroundImageFormats: string;
  backgroundImageFormatError: string;
  backgroundImageSizeError: string;
  backgroundImageEmptyError: string;
  backgroundImageDecodeError: string;
  backgroundImageCompressError: string;
  dismissError: string;
  previousRecordPrompt: string;
  restorePreviousRecord: string;
  startBlank: string;
  exportFile: string;
  exportPng: string;
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
  deleteSelected: 'Delete selected (Delete / Backspace)',
  angle: 'Angle',
  angleInputError: 'Enter a valid number for the angle: {received}.',
  resetSelectedRotation: 'Reset rotation',
  rotatePiece: 'Rotate piece',
  rotationHint: 'Drag the ↻ handle above a selected piece to rotate it.',
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
  uploadBackgroundImage: 'Upload image',
  removeBackgroundImage: 'Remove image',
  resetBackgroundImageView: 'Fit the entire battlefield',
  backgroundImageInteractionHint:
    'Drag an empty area to pan the entire battlefield. Use the scroll wheel to zoom the entire battlefield. Drag a game piece to move only that piece. The view is kept for this page session only; it is not saved and resets on refresh or import.',
  backgroundImageFormats: 'PNG, JPG, JPEG or WebP · up to 20 MB',
  backgroundImageFormatError: 'Unsupported image type: {received}. Choose PNG, JPG, JPEG or WebP.',
  backgroundImageSizeError: 'Image exceeds the 20 MB limit: {received}.',
  backgroundImageEmptyError: 'The selected image is empty: {received}.',
  backgroundImageDecodeError: 'Could not read image file: {received}.',
  backgroundImageCompressError: 'Could not compress the image: {received}.',
  dismissError: 'Dismiss error',
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
  deleteSelected: '删除所选（Delete / Backspace）',
  angle: '角度',
  angleInputError: '角度必须是有效数字：{received}。',
  resetSelectedRotation: '重置旋转',
  rotatePiece: '旋转棋子',
  rotationHint: '拖动选中棋子上方的 ↻ 手柄即可旋转。',
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
  uploadBackgroundImage: '上传图片',
  removeBackgroundImage: '移除图片',
  resetBackgroundImageView: '适配整个战场',
  backgroundImageInteractionHint:
    '拖动空白处可平移整个战场，滚动滚轮可缩放整个战场；拖动兵棋只会移动该兵棋。视角仅在本次页面会话内保留，不会保存，刷新页面或导入后会重置。',
  backgroundImageFormats: '支持 PNG、JPG、JPEG、WebP，单张不超过 20 MB',
  backgroundImageFormatError: '不支持图片类型：{received}。请选择 PNG、JPG、JPEG 或 WebP。',
  backgroundImageSizeError: '图片超过 20 MB 限制：{received}。',
  backgroundImageEmptyError: '所选图片为空：{received}。',
  backgroundImageDecodeError: '无法读取图片文件：{received}。',
  backgroundImageCompressError: '无法压缩图片：{received}。',
  dismissError: '关闭提示',
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
};

const ARMY_FORMATION_CREATOR_COPY: Record<ArmyFormationCreatorLocale, ArmyFormationCreatorCopy> = {
  en: englishArmyFormationCreatorCopy,
  zh: chineseArmyFormationCreatorCopy,
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
  return getI18nDictionary(locale, ARMY_FORMATION_CREATOR_COPY, 'army formation creator');
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
