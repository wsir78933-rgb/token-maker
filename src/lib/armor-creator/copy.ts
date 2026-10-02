import { getI18nDictionary } from '@/lib/i18n/dictionary';
import type { SiteLocale } from '@/lib/site-locale';

const ARMOR_CREATOR_LOCALES = ['en', 'zh'] as const;

type ArmorCreatorLocale = (typeof ARMOR_CREATOR_LOCALES)[number];

type ArmorCreatorHowToUseStepCopy = {
  title: string;
  description: string;
};

type ArmorCreatorFaqItemCopy = {
  question: string;
  answer: string;
};

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
  howToUseEyebrow: string;
  howToUseTitle: string;
  howToUseSteps: readonly [
    ArmorCreatorHowToUseStepCopy,
    ArmorCreatorHowToUseStepCopy,
    ArmorCreatorHowToUseStepCopy,
  ];
  howToUseAction: string;
  faqEyebrow: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: readonly [
    ArmorCreatorFaqItemCopy,
    ArmorCreatorFaqItemCopy,
    ArmorCreatorFaqItemCopy,
    ArmorCreatorFaqItemCopy,
    ArmorCreatorFaqItemCopy,
  ];
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

export type ArmorCreatorComparisonRowCopy = {
  criterion: string;
  armorCreator: string;
  photoshop: string;
  firefly: string;
};

export type ArmorCreatorComparisonCopy = {
  title: string;
  tableLabel: string;
  dimensionHeading: string;
  armorCreatorHeading: string;
  photoshopHeading: string;
  fireflyHeading: string;
  rows: readonly ArmorCreatorComparisonRowCopy[];
};

const ARMOR_CREATOR_COMPARISON_COPY: Readonly<Partial<Record<SiteLocale, ArmorCreatorComparisonCopy>>> = {
  en: {
    title: 'Armor Creator vs. Photoshop vs. Adobe Firefly',
    tableLabel: 'Armor creation tools comparison',
    dimensionHeading: 'Comparison',
    armorCreatorHeading: 'Armor Creator',
    photoshopHeading: 'Adobe Photoshop',
    fireflyHeading: 'Adobe Firefly',
    rows: [
      {
        criterion: 'Creation process',
        armorCreator: 'Choose armor pieces and combine them directly',
        photoshop: 'Requires complex tools',
        firefly: 'Generate images with prompts or edit images with AI',
      },
      {
        criterion: 'Armor assets',
        armorCreator: '1,400+ built-in armor PNG assets',
        photoshop: 'Provide your own assets',
        firefly: 'Generate assets with prompts',
      },
      {
        criterion: 'Detail adjustments',
        armorCreator: 'Adjust shoulder symmetry and chest curves, and combine pieces by slot',
        photoshop: 'Fine-tune with layers and masks through manual editing',
        firefly: 'Edit details with prompts, brush selections, or region selections',
      },
      {
        criterion: 'Outfit management',
        armorCreator: 'Four built-in outfit slots',
        photoshop: 'Manage versions with PSDs, layers, or file copies',
        firefly: 'Continue editing generated images; adjust looks with prompts and local edits',
      },
      {
        criterion: 'Export',
        armorCreator: 'Download as PNG',
        photoshop: 'Choose export formats and settings yourself',
        firefly: 'Download generated images',
      },
    ],
  },
  zh: {
    title: 'Armor Creator vs. Photoshop vs. Adobe Firefly',
    tableLabel: '护甲造型工具对比表格',
    dimensionHeading: '对比项目',
    armorCreatorHeading: 'Armor Creator',
    photoshopHeading: 'Adobe Photoshop',
    fireflyHeading: 'Adobe Firefly',
    rows: [
      {
        criterion: '制作方式',
        armorCreator: '选择护甲部件，直接组合造型',
        photoshop: '需要复杂工具',
        firefly: '输入提示词生成图像，也可对图片进行 AI 编辑',
      },
      {
        criterion: '护甲素材',
        armorCreator: '内置 1,400+ 张护甲 PNG 素材',
        photoshop: '自行准备',
        firefly: '用提示词生成',
      },
      {
        criterion: '细节调整',
        armorCreator: '支持左右肩对称和胸甲曲线调整，可按部位组合',
        photoshop: '可用图层和蒙版精细修改，需手动操作',
        firefly: '可通过提示词、画笔标注或区域选择修改局部',
      },
      {
        criterion: '搭配管理',
        armorCreator: '内置 4 个套装槽',
        photoshop: '通过 PSD、图层或文件副本管理不同版本',
        firefly: '基于生成图像继续编辑，搭配需通过提示词和局部编辑调整',
      },
      {
        criterion: '成品导出',
        armorCreator: '下载 PNG',
        photoshop: '自行设置图像导出格式和参数',
        firefly: '下载生成图像',
      },
    ],
  },
};

export function getArmorCreatorComparisonCopy(locale: SiteLocale): ArmorCreatorComparisonCopy {
  return getI18nDictionary(locale, ARMOR_CREATOR_COMPARISON_COPY, 'armor creator comparison');
}

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
  howToUseEyebrow: 'How it works',
  howToUseTitle: 'How to use the Armor Creator',
  howToUseSteps: [
    {
      title: 'Choose a character and armor type',
      description: 'Pick a character and choose plate, leather, or cloth armor to browse matching pieces.',
    },
    {
      title: 'Mix and match armor pieces',
      description:
        'Select a helm, chest piece, legs, gloves, shoulders, cloak, crown, or wings, and preview the look as you build.',
    },
    {
      title: 'Refine and download your look',
      description:
        'Adjust shoulder symmetry or chest curves, switch between four outfit slots, and download your finished image.',
    },
  ],
  howToUseAction: 'Start creating',
  faqEyebrow: 'FAQ',
  faqTitle: 'Armor Creator FAQ',
  faqDescription:
    'Learn which armor types and pieces are available, and how to save or export your look.',
  faqItems: [
    {
      question: 'Who is the Armor Creator for?',
      answer:
        'It is for RPG/TTRPG players and GMs, as well as creators developing fantasy characters and worlds.',
    },
    {
      question: 'Is the Armor Creator free to use?',
      answer: 'Yes. The Armor Creator is free to use.',
    },
    {
      question: 'Which armor types can I choose?',
      answer: 'Choose plate, leather, or cloth armor.',
    },
    {
      question: 'Which armor pieces are available?',
      answer:
        'Available parts include a helm, chest armor, feet, left and right shoulders, legs, gloves, a cloak, a crown, and wings.',
    },
    {
      question: 'Can I save and export an outfit?',
      answer:
        'You can save and reload outfits using four outfit slots, then download the current look as a PNG.',
    },
  ],
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
  howToUseEyebrow: '操作步骤',
  howToUseTitle: '如何使用护甲搭配工具？',
  howToUseSteps: [
    {
      title: '选择角色和护甲类型',
      description: '选择男性或女性角色，再选板甲、皮甲或布甲，浏览对应的护甲部件。',
    },
    {
      title: '组合护甲部件',
      description: '挑选头盔、胸甲、腿部、手套、肩甲、斗篷、王冠或翅膀，并在预览中查看造型。',
    },
    {
      title: '微调并下载造型',
      description:
        '按需启用左右肩对称或胸甲曲线，切换套装 1–4 保存不同搭配，完成后下载图片。',
    },
  ],
  howToUseAction: '开始搭配',
  faqEyebrow: '常见问题',
  faqTitle: '护甲搭配工具常见问题',
  faqDescription: '了解可选的护甲类型与部件，以及如何保存或导出造型。',
  faqItems: [
    {
      question: '护甲搭配工具适合哪些人使用？',
      answer: '适合 RPG/TTRPG 玩家与 GM，也适合创作奇幻角色和世界观的创作者。',
    },
    {
      question: '护甲搭配工具可以免费使用吗？',
      answer: '可以，护甲搭配工具可免费使用。',
    },
    {
      question: '可以选择哪些护甲类型？',
      answer: '可以选择板甲、皮甲或布甲。',
    },
    {
      question: '现有哪些护甲部件？',
      answer: '现有部件包括头盔、胸甲、脚部、左肩、腿部、手套、右肩、斗篷、王冠和翅膀。',
    },
    {
      question: '可以保存并导出搭配吗？',
      answer: '可以使用四个套装槽位保存和读取搭配，并将当前造型下载为 PNG 图片。',
    },
  ],
};

const ARMOR_CREATOR_COPY: Record<ArmorCreatorLocale, ArmorCreatorCopy> = {
  en: englishArmorCreatorCopy,
  zh: chineseArmorCreatorCopy,
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
  return getI18nDictionary(locale, ARMOR_CREATOR_COPY, 'armor creator');
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
