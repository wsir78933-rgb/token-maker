import { getI18nDictionary } from '@/lib/i18n/dictionary';
import type { OutfitCategory } from '@/lib/outfit-creator/catalog';

const OUTFIT_CREATOR_LOCALES = ['en', 'zh'] as const;

type OutfitCreatorLocale = (typeof OUTFIT_CREATOR_LOCALES)[number];

export type OutfitCreatorFeatureIcon =
  | 'character'
  | 'categories'
  | 'layers'
  | 'slots'
  | 'preview'
  | 'export';

export type OutfitCreatorFeatureCopy = {
  icon: OutfitCreatorFeatureIcon;
  title: string;
  description: string;
};

export type OutfitCreatorFeatureOverviewCopy = {
  title: string;
  subtitle: string;
  features: readonly [
    OutfitCreatorFeatureCopy,
    OutfitCreatorFeatureCopy,
    OutfitCreatorFeatureCopy,
    OutfitCreatorFeatureCopy,
    OutfitCreatorFeatureCopy,
    OutfitCreatorFeatureCopy,
  ];
};

export type OutfitCreatorHowToUseStepCopy = {
  title: string;
  description: string;
};

export type OutfitCreatorFaqItemCopy = {
  question: string;
  answer: string;
};

export type OutfitCreatorToolComparisonCopy = {
  title: string;
  description: string;
  tableLabel: string;
  dimensionHeading: string;
  outfitCreatorHeading: string;
  photoshopHeading: string;
  illustratorHeading: string;
  rows: readonly {
    dimension: string;
    outfitCreator: string;
    photoshop: string;
    illustrator: string;
  }[];
};

export type OutfitCreatorCopy = {
  navigationName: string;
  pageTitle: string;
  pageDescription: string;
  heading: string;
  description: string;
  heroAction: string;
  genderMale: string;
  genderFemale: string;
  categoryLabels: Readonly<Record<OutfitCategory, string>>;
  categoryPickerLabel: string;
  preview: string;
  saveSlot: (slotNumber: number) => string;
  loadSlot: (slotNumber: number) => string;
  outfitSlot: (slotNumber: number) => string;
  clearEquipment: string;
  downloadImage: string;
  imageLoadError: (imagePath: string) => string;
  previewLoadError: string;
  previewTransitionError: string;
  saveLoadError: string;
  replaceSaveConfirm: (slotNumber: number) => string;
  whatIsTitle: string;
  whatIsDescription: string;
  featureOverview: OutfitCreatorFeatureOverviewCopy;
  howToUseEyebrow: string;
  howToUseTitle: string;
  howToUseSteps: readonly [
    OutfitCreatorHowToUseStepCopy,
    OutfitCreatorHowToUseStepCopy,
    OutfitCreatorHowToUseStepCopy,
  ];
  howToUseAction: string;
  toolComparison: OutfitCreatorToolComparisonCopy;
  faqEyebrow: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: readonly [
    OutfitCreatorFaqItemCopy,
    OutfitCreatorFaqItemCopy,
    OutfitCreatorFaqItemCopy,
    OutfitCreatorFaqItemCopy,
    OutfitCreatorFaqItemCopy,
  ];
};

const englishOutfitCreatorCopy: Omit<OutfitCreatorCopy, 'heading' | 'description'> = {
  navigationName: 'Outfit Creator',
  pageTitle: 'Outfit Creator – Free Online Tool for RPG, Fantasy & Sci-Fi Characters',
  pageDescription:
    'Outfit Creator lets you quickly mix and match clothing and accessories online for free to create character looks for RPG and D&D campaigns, fantasy and sci-fi stories, worldbuilding, and indie games.',
  heroAction: 'Try for Free',
  genderMale: 'Male',
  genderFemale: 'Female',
  categoryLabels: {
    jackets: 'Jackets',
    shirts: 'Shirts',
    shirts2: 'Shirts 2',
    pants: 'Pants',
    skirts: 'Skirts',
    shoes: 'Shoes',
    scarves: 'Scarves',
    belts: 'Belts',
    gloves: 'Gloves',
  },
  categoryPickerLabel: 'Outfit categories',
  preview: 'Preview',
  saveSlot(slotNumber: number) {
    return formatOutfitSlotLabel('Save', slotNumber);
  },
  loadSlot(slotNumber: number) {
    return formatOutfitSlotLabel('Load', slotNumber);
  },
  outfitSlot(slotNumber: number) {
    return formatOutfitSlotLabel('Outfit', slotNumber);
  },
  clearEquipment: 'Clear',
  downloadImage: 'Download image',
  imageLoadError(imagePath: string) {
    return `Outfit image failed to load. Received ${JSON.stringify(imagePath)}.`;
  },
  previewLoadError: 'The outfit preview could not be rendered.',
  previewTransitionError:
    'The previous outfit could not be captured for the transition animation.',
  saveLoadError: 'The selected outfit slot could not be loaded.',
  replaceSaveConfirm(slotNumber: number) {
    return formatOutfitSlotLabel('Replace save', slotNumber, '?');
  },
  whatIsTitle: 'What is the Outfit Creator?',
  whatIsDescription:
    'The Outfit Creator is an online visual tool for RPG and TTRPG players, GMs, and fantasy creators. Choose a character, combine clothing and accessories by category, and review the complete silhouette while you build. Save alternate looks in four outfit slots and download the finished preview as a PNG.',
  featureOverview: {
    title: 'Build a Complete Character Look',
    subtitle:
      'Choose a figure, add clothing one category at a time, and keep alternate combinations ready for your campaign notes or character references.',
    features: [
      {
        icon: 'character',
        title: 'Choose Your Character',
        description:
          'Start with a male or female figure. Your selected character stays visible while you browse each clothing category.',
      },
      {
        icon: 'categories',
        title: 'Browse Outfit Categories',
        description:
          'Explore jackets, shirts, pants, skirts, shoes, scarves, belts, and gloves from a focused category picker.',
      },
      {
        icon: 'layers',
        title: 'Layer Clothing Pieces',
        description:
          'Combine one piece from each category and click a selected piece again when you want to remove it.',
      },
      {
        icon: 'slots',
        title: 'Keep Four Outfit Slots',
        description:
          'Use four local outfit slots to keep alternate looks available while you compare character ideas.',
      },
      {
        icon: 'preview',
        title: 'Preview the Full Look',
        description:
          'See the body, clothing layers, and accessories together in the editor preview as you make each choice.',
      },
      {
        icon: 'export',
        title: 'Download as PNG',
        description:
          'Download the current assembled outfit as a PNG for a campaign handout, character sheet, or visual reference.',
      },
    ],
  },
  howToUseEyebrow: 'How it works',
  howToUseTitle: 'How to use the Outfit Creator',
  howToUseSteps: [
    {
      title: 'Choose a character',
      description: 'Select a male or female figure to set the base for your outfit preview.',
    },
    {
      title: 'Mix clothing and accessories',
      description:
        'Open each category, choose pieces, and click a selected piece again to remove it from the look.',
    },
    {
      title: 'Save and download your look',
      description:
        'Keep alternate combinations in four outfit slots, then download the finished preview as a PNG.',
    },
  ],
  howToUseAction: 'Start creating',
  toolComparison: {
    title: 'Outfit Creator vs Photoshop vs Illustrator',
    description:
      'Skip drawing clothing from scratch or arranging layers by hand. Choose pieces to build a look, switch outfits, and download your image.',
    tableLabel: 'Outfit creation tools comparison',
    dimensionHeading: 'Comparison',
    outfitCreatorHeading: 'Outfit Creator',
    photoshopHeading: 'Photoshop',
    illustratorHeading: 'Illustrator',
    rows: [
      {
        dimension: 'Clothing assets',
        outfitCreator: 'Built-in clothing and accessories save you the work of finding or drawing assets',
        photoshop: 'Prepare or draw clothing assets yourself, then combine them',
        illustrator: 'Draw vector clothing or import assets yourself',
      },
      {
        dimension: 'Outfit editing',
        outfitCreator: 'Click to change pieces, with automatic layering and a live preview',
        photoshop: 'Flexible editing, with layers, positioning, and sizing to manage yourself',
        illustrator: 'Precise vector editing, with objects, shapes, and layouts to manage yourself',
      },
      {
        dimension: 'Multiple outfits',
        outfitCreator: 'Four outfit slots let you switch with one click and quickly compare looks',
        photoshop: 'Create and switch between versions using layer comps',
        illustrator: 'Organize different looks across multiple artboards',
      },
      {
        dimension: 'Save and resume',
        outfitCreator: 'Looks stay saved in your current browser, ready for you to return and adjust',
        photoshop: 'Save a PSD file to keep layers for further editing',
        illustrator: 'Save an AI file to keep objects for further editing',
      },
      {
        dimension: 'Image export',
        outfitCreator: 'Download a PNG directly for character sheets, campaign notes, or reference material',
        photoshop: 'PNG, JPG, and other formats with configurable export settings',
        illustrator: 'SVG, PDF, and other formats with configurable export settings',
      },
    ],
  },
  faqEyebrow: 'FAQ',
  faqTitle: 'Outfit Creator FAQ',
  faqDescription:
    'Learn how the clothing categories, outfit slots, preview, and PNG download work.',
  faqItems: [
    {
      question: 'Who is the Outfit Creator for?',
      answer:
        'It is designed for RPG and TTRPG players and GMs, along with creators developing fantasy characters and worlds.',
    },
    {
      question: 'Is the Outfit Creator free to use?',
      answer: 'Yes. You can build, save, and download outfit looks in the browser for free.',
    },
    {
      question: 'Which outfit categories are available?',
      answer:
        'You can choose jackets, shirts, a second shirt layer, pants, skirts, shoes, scarves, belts, and gloves.',
    },
    {
      question: 'Can I switch between male and female figures?',
      answer:
        'Yes. Switching figures keeps the selected clothing numbers when a matching piece is available for the other figure.',
    },
    {
      question: 'Can I save and export an outfit?',
      answer:
        'Yes. Use the four outfit slots to keep alternate looks, then download the current preview as a PNG image.',
    },
  ],
};

const chineseOutfitCreatorCopy: Omit<OutfitCreatorCopy, 'heading' | 'description'> = {
  navigationName: '服装搭配工具',
  pageTitle: '角色服装搭配工具｜免费在线搭配 RPG、奇幻与科幻角色造型',
  pageDescription:
    '服装搭配工具可以帮助你免费在线组合服装与配饰，快速搭配角色造型，适用于 RPG/D&D 跑团、奇幻与科幻小说、世界观设定、角色设计和独立游戏创作。',
  heroAction: '免费试用',
  genderMale: '男',
  genderFemale: '女',
  categoryLabels: {
    jackets: '夹克',
    shirts: '衬衫',
    shirts2: '衬衫 2',
    pants: '裤子',
    skirts: '裙子',
    shoes: '鞋子',
    scarves: '围巾',
    belts: '腰带',
    gloves: '手套',
  },
  categoryPickerLabel: '服装分类',
  preview: '预览',
  saveSlot(slotNumber: number) {
    return formatOutfitSlotLabel('保存', slotNumber);
  },
  loadSlot(slotNumber: number) {
    return formatOutfitSlotLabel('读取', slotNumber);
  },
  outfitSlot(slotNumber: number) {
    return formatOutfitSlotLabel('套装', slotNumber);
  },
  clearEquipment: '清空',
  downloadImage: '下载图片',
  imageLoadError(imagePath: string) {
    return `服装图片加载失败。收到的路径：${JSON.stringify(imagePath)}。`;
  },
  previewLoadError: '服装预览无法渲染。',
  previewTransitionError: '无法捕获上一套造型以播放切换动画。',
  saveLoadError: '无法读取所选套装槽位。',
  replaceSaveConfirm(slotNumber: number) {
    return formatOutfitSlotLabel('替换保存', slotNumber, '？');
  },
  whatIsTitle: '什么是服装搭配工具？',
  whatIsDescription:
    '服装搭配工具是一款面向 RPG/TTRPG 玩家与 GM，以及奇幻角色和世界观创作者的在线视觉工具。选择角色后，你可以按分类组合服装与配饰，并在搭配过程中查看完整轮廓。你还可以用四个套装槽位保存不同造型，完成后将预览下载为 PNG 图片。',
  featureOverview: {
    title: '组合完整角色造型',
    subtitle:
      '先选择角色，再按分类添加服装，并保留不同组合，方便整理战役笔记或角色视觉参考。',
    features: [
      {
        icon: 'character',
        title: '选择角色',
        description: '先选择男性或女性角色；浏览各类服装时，所选角色会持续显示在预览中。',
      },
      {
        icon: 'categories',
        title: '浏览服装分类',
        description: '通过分类选择器浏览夹克、衬衫、裤子、裙子、鞋子、围巾、腰带和手套。',
      },
      {
        icon: 'layers',
        title: '叠加服装部件',
        description: '每个分类选择一个部件；再次点击已选部件即可将它从造型中移除。',
      },
      {
        icon: 'slots',
        title: '保留四个套装槽位',
        description: '使用四个本地套装槽位保存不同造型，比较角色设计时可以随时切换。',
      },
      {
        icon: 'preview',
        title: '预览完整造型',
        description: '每次选择后都能在编辑器预览中查看角色、服装层和配饰的组合效果。',
      },
      {
        icon: 'export',
        title: '下载 PNG 图片',
        description: '将当前组合好的服装造型下载为 PNG，用于战役资料、角色卡或视觉参考。',
      },
    ],
  },
  howToUseEyebrow: '使用方式',
  howToUseTitle: '如何使用服装搭配工具？',
  howToUseSteps: [
    {
      title: '选择角色',
      description: '选择男性或女性角色，为服装预览设定基础人物。',
    },
    {
      title: '组合服装与配饰',
      description: '打开各个分类选择部件，再次点击已选部件即可将其从造型中移除。',
    },
    {
      title: '保存并下载造型',
      description: '将不同组合保存在四个套装槽位中，完成后把当前预览下载为 PNG 图片。',
    },
  ],
  howToUseAction: '开始搭配',
  toolComparison: {
    title: '服装搭配工具 vs Photoshop vs Illustrator',
    description:
      '无需从零绘制服装或手动排布图层，选择部件即可组合造型、切换搭配并下载图片。',
    tableLabel: '服装搭配工具对比',
    dimensionHeading: '对比维度',
    outfitCreatorHeading: '服装搭配工具',
    photoshopHeading: 'Photoshop',
    illustratorHeading: 'Illustrator',
    rows: [
      {
        dimension: '服装素材',
        outfitCreator: '内置服装与配饰，省去寻找和绘制素材的步骤',
        photoshop: '自行准备或绘制服装素材，再进行组合',
        illustrator: '自行绘制矢量服装或导入素材',
      },
      {
        dimension: '搭配操作',
        outfitCreator: '点击即可换装，部件自动组合，实时查看效果',
        photoshop: '编辑自由度高，需自行处理图层、位置与尺寸',
        illustrator: '矢量控制精细，需自行处理对象、形状与布局',
      },
      {
        dimension: '多套造型',
        outfitCreator: '4 个套装槽位，一键切换，快速比较不同搭配',
        photoshop: '通过图层复合建立和切换不同版本',
        illustrator: '通过多个画板整理不同造型',
      },
      {
        dimension: '保存续编',
        outfitCreator: '搭配保存在当前浏览器，方便回来继续调整',
        photoshop: '保存 PSD 文件，保留图层后继续编辑',
        illustrator: '保存 AI 文件，保留对象后继续编辑',
      },
      {
        dimension: '图片导出',
        outfitCreator: '直接下载 PNG，方便放入角色卡、战役笔记或设定资料',
        photoshop: '支持 PNG、JPG 等格式，按需设置导出',
        illustrator: '支持 SVG、PDF 等格式，按需设置导出',
      },
    ],
  },
  faqEyebrow: '常见问题',
  faqTitle: '服装搭配工具常见问题',
  faqDescription: '了解服装分类、套装槽位、预览和 PNG 下载的使用方式。',
  faqItems: [
    {
      question: '服装搭配工具适合哪些人使用？',
      answer: '适合 RPG/TTRPG 玩家与 GM，也适合创作奇幻角色和世界观的创作者。',
    },
    {
      question: '服装搭配工具可以免费使用吗？',
      answer: '可以。你可以在浏览器中免费搭配、保存和下载服装造型。',
    },
    {
      question: '目前有哪些服装分类？',
      answer: '可以选择夹克、衬衫、第二层衬衫、裤子、裙子、鞋子、围巾、腰带和手套。',
    },
    {
      question: '可以切换男性和女性角色吗？',
      answer: '可以。切换角色时，如果另一角色有对应部件，会保留当前服装的编号。',
    },
    {
      question: '可以保存并导出服装造型吗？',
      answer: '可以使用四个套装槽位保存不同造型，并将当前预览下载为 PNG 图片。',
    },
  ],
};

const OUTFIT_CREATOR_COPY: Record<OutfitCreatorLocale, OutfitCreatorCopy> = {
  en: {
    ...englishOutfitCreatorCopy,
    heading: englishOutfitCreatorCopy.pageTitle,
    description: englishOutfitCreatorCopy.pageDescription,
  },
  zh: {
    ...chineseOutfitCreatorCopy,
    heading: chineseOutfitCreatorCopy.pageTitle,
    description: chineseOutfitCreatorCopy.pageDescription,
  },
};

function isOutfitCreatorLocale(locale: string): locale is OutfitCreatorLocale {
  return OUTFIT_CREATOR_LOCALES.some((supportedLocale) => supportedLocale === locale);
}

function requireOutfitCreatorLocale(locale: string): OutfitCreatorLocale {
  if (isOutfitCreatorLocale(locale)) {
    return locale;
  }

  throw new Error(`Unknown outfit creator locale. Received ${JSON.stringify(locale)}.`);
}

function requireOutfitSlotNumber(slotNumber: number): void {
  if (!Number.isInteger(slotNumber) || slotNumber < 1 || slotNumber > 4) {
    throw new Error(
      `Outfit creator save slot must be an integer from 1 to 4. Received ${slotNumber}.`,
    );
  }
}

function formatOutfitSlotLabel(prefix: string, slotNumber: number, suffix = ''): string {
  requireOutfitSlotNumber(slotNumber);
  return `${prefix} ${slotNumber}${suffix}`;
}

export function getOutfitCreatorCopy(locale: string): OutfitCreatorCopy {
  return getI18nDictionary(
    requireOutfitCreatorLocale(locale),
    OUTFIT_CREATOR_COPY,
    'outfit creator',
  );
}

export function getOutfitCreatorCategoryLabel(
  locale: string,
  category: OutfitCategory,
): string {
  const copy = getOutfitCreatorCopy(locale);
  const label = copy.categoryLabels[category];

  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error(
      `Outfit creator category label is missing for ${JSON.stringify(category)} in locale ${JSON.stringify(locale)}.`,
    );
  }

  return label;
}
