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
  whatIsTitle: string;
  whatIsDescription: string;
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
  pageTitle: 'Free Armor Creator for RPG Characters, NPCs & Fantasy Worlds',
  pageDescription:
    'This free Armor Creator offers armor inspiration for RPG/TTRPG characters, campaign NPCs, and fantasy settings. Mix armor pieces and preview character looks.',
  heroTitleLead: 'Free',
  heroTitleEmphasis: 'Armor Creator',
  heroTitleTail: 'for RPG Characters, NPCs & Fantasy Worlds',
  heroAction: 'Try for Free',
  whatIsTitle: 'What is the Armor Creator?',
  whatIsDescription:
    'The Armor Creator is an online visual tool for RPG/TTRPG players and GMs, as well as creators developing fantasy characters and worlds. Mix plate, leather, and cloth armor pieces to preview character looks and find visual inspiration for characters, NPCs, and campaign settings.',
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
  pageTitle: '免费护甲搭配工具：为 RPG 角色、NPC 与奇幻世界提供灵感',
  pageDescription:
    '这是一款免费护甲搭配工具，为 RPG/TTRPG 角色、战役 NPC 和奇幻世界设定提供护甲造型灵感。你可以组合不同护甲部件、预览角色造型。',
  heroTitleLead: '免费',
  heroTitleEmphasis: '护甲搭配工具',
  heroTitleTail: '：为 RPG 角色、NPC 与奇幻世界提供灵感',
  heroAction: 'Try for Free',
  whatIsTitle: '什么是护甲搭配工具？',
  whatIsDescription:
    '护甲搭配工具是一款面向 RPG/TTRPG 玩家与 GM，以及奇幻角色和世界观创作者的在线视觉工具。你可以组合板甲、皮甲与布甲等部件，预览不同护甲造型，为角色设定、NPC 塑造和战役世界观创作获取灵感。',
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
