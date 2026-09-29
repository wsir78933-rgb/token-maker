const ARMOR_CREATOR_LOCALES = ['en', 'zh'] as const;

type ArmorCreatorLocale = (typeof ARMOR_CREATOR_LOCALES)[number];

export type ArmorCreatorCopy = {
  genderMale: string;
  genderFemale: string;
  materialPlate: string;
  materialLeather: string;
  materialCloth: string;
  slotHelm: string;
  slotChest: string;
  slotFeet: string;
  slotShoulderLeft: string;
  slotLegs: string;
  slotGloves: string;
  slotShoulderRight: string;
  slotCloak: string;
  slotCrown: string;
  slotWing: string;
  cloakFront: string;
  cloakBack: string;
  chestCurve: string;
  shoulderSymmetry: string;
  clearEquipment: string;
  saveSlot: (slotNumber: number) => string;
  loadSlot: (slotNumber: number) => string;
  outfitSlot: (slotNumber: number) => string;
  downloadImage: string;
  preview: string;
  replaceSaveConfirm: (slotNumber: number) => string;
  pageTitle: string;
  pageDescription: string;
  heroTitleLead: string;
  heroTitleEmphasis: string;
  heroTitleTail: string;
  heroAction: string;
};

export type ArmorCreatorHeroTitle = {
  lead: string;
  lineGap: string;
  emphasis: string;
  tail: string;
  gap: string;
  description: string;
  action: string;
};

const englishArmorCreatorCopy: ArmorCreatorCopy = {
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
  saveSlot(slotNumber: number) {
    return formatArmorSaveSlotLabel('Save', slotNumber);
  },
  loadSlot(slotNumber: number) {
    return formatArmorSaveSlotLabel('Load', slotNumber);
  },
  outfitSlot(slotNumber: number) {
    return formatArmorSaveSlotLabel('Outfit', slotNumber);
  },
  downloadImage: 'Download image',
  preview: 'Preview',
  replaceSaveConfirm(slotNumber: number) {
    return formatArmorReplaceSaveConfirm('Replace save', '?', slotNumber);
  },
  pageTitle: 'Armor creator',
  pageDescription: 'Mix and match armor in the browser and download an image.',
  heroTitleLead: "Build your character's",
  heroTitleEmphasis: 'armor',
  heroTitleTail: 'look',
  heroAction: 'Try for Free',
};

const chineseArmorCreatorCopy: ArmorCreatorCopy = {
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
  saveSlot(slotNumber: number) {
    return formatArmorSaveSlotLabel('保存', slotNumber);
  },
  loadSlot(slotNumber: number) {
    return formatArmorSaveSlotLabel('读取', slotNumber);
  },
  outfitSlot(slotNumber: number) {
    return formatArmorSaveSlotLabel('套装', slotNumber);
  },
  downloadImage: '下载图片',
  preview: '预览',
  replaceSaveConfirm(slotNumber: number) {
    return formatArmorReplaceSaveConfirm('替换保存', '？', slotNumber);
  },
  pageTitle: '护甲制作',
  pageDescription: '在浏览器里搭配护甲并下载图片。',
  heroTitleLead: '在浏览器里搭配你的',
  heroTitleEmphasis: '护甲',
  heroTitleTail: '造型',
  heroAction: 'Try for Free',
};

function isArmorCreatorLocale(locale: string): locale is ArmorCreatorLocale {
  return ARMOR_CREATOR_LOCALES.some((supportedLocale) => supportedLocale === locale);
}

function requireArmorCreatorLocale(locale: string): ArmorCreatorLocale {
  if (isArmorCreatorLocale(locale)) {
    return locale;
  }

  throw new Error(`Unknown armor creator locale: ${JSON.stringify(locale)}.`);
}

function readArmorCreatorCopy(locale: ArmorCreatorLocale): ArmorCreatorCopy {
  if (locale === 'en') {
    return englishArmorCreatorCopy;
  }

  if (locale === 'zh') {
    return chineseArmorCreatorCopy;
  }

  throw new Error(`Unknown armor creator locale: ${JSON.stringify(locale)}.`);
}

function assertArmorSaveSlotNumber(slotNumber: number): void {
  if (!Number.isInteger(slotNumber) || slotNumber < 1 || slotNumber > 4) {
    throw new Error(
      `Armor creator save slot must be an integer from 1 to 4. Received slot number: ${slotNumber}.`,
    );
  }
}

function formatArmorSaveSlotLabel(prefix: string, slotNumber: number): string {
  assertArmorSaveSlotNumber(slotNumber);
  return `${prefix} ${slotNumber}`;
}

function formatArmorReplaceSaveConfirm(
  sentencePrefix: string,
  questionMark: string,
  slotNumber: number,
): string {
  assertArmorSaveSlotNumber(slotNumber);
  return `${sentencePrefix} ${slotNumber}${questionMark}`;
}

function requireArmorHeroTitlePart(value: string, fieldName: string, locale: ArmorCreatorLocale): string {
  if (value.trim().length === 0) {
    throw new Error(
      `Armor creator ${fieldName} is empty for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function armorHeroWordGap(locale: ArmorCreatorLocale): string {
  if (locale === 'en') {
    return ' ';
  }

  if (locale === 'zh') {
    return '';
  }

  throw new Error(`Armor creator hero title has no word gap for locale ${JSON.stringify(locale)}.`);
}

export function getArmorCreatorCopy(locale: string): ArmorCreatorCopy {
  return readArmorCreatorCopy(requireArmorCreatorLocale(locale));
}

export function getArmorCreatorHeroTitle(locale: string): ArmorCreatorHeroTitle {
  const supportedLocale = requireArmorCreatorLocale(locale);
  const copy = readArmorCreatorCopy(supportedLocale);

  const wordGap = armorHeroWordGap(supportedLocale);

  return {
    lead: requireArmorHeroTitlePart(copy.heroTitleLead, 'heroTitleLead', supportedLocale),
    lineGap: wordGap,
    emphasis: requireArmorHeroTitlePart(copy.heroTitleEmphasis, 'heroTitleEmphasis', supportedLocale),
    tail: requireArmorHeroTitlePart(copy.heroTitleTail, 'heroTitleTail', supportedLocale),
    gap: wordGap,
    description: requireArmorHeroTitlePart(copy.pageDescription, 'pageDescription', supportedLocale),
    action: requireArmorHeroTitlePart(copy.heroAction, 'heroAction', supportedLocale),
  };
}
