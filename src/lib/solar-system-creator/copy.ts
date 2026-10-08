import type { SiteLocale } from '@/lib/site-locale';

import type {
  SolarAssetCategory,
  SolarPlanetField,
  SolarStarRange,
} from './types';

export type SolarSystemFeatureIcon = 'assets' | 'random' | 'details' | 'manual' | 'saves' | 'export';

export type SolarSystemFeatureCopy = {
  readonly icon: SolarSystemFeatureIcon;
  readonly title: string;
  readonly description: string;
};

export type SolarSystemHowItWorksStepCopy = {
  readonly title: string;
  readonly description: string;
};

export type SolarSystemFaqItemCopy = {
  readonly question: string;
  readonly answer: string;
};

export type SolarSystemToolComparisonRowCopy = {
  readonly dimension: string;
  readonly solarSystemCreator: string;
  readonly photoshop: string;
  readonly illustrator: string;
};

export type SolarSystemToolComparisonCopy = {
  readonly title: string;
  readonly description: string;
  readonly tableLabel: string;
  readonly dimensionHeading: string;
  readonly solarSystemCreatorHeading: string;
  readonly photoshopHeading: string;
  readonly illustratorHeading: string;
  readonly rows: readonly SolarSystemToolComparisonRowCopy[];
};

export type SolarSystemPageContentCopy = {
  readonly whatIsTitle: string;
  readonly whatIsDescription: string;
  readonly featureOverviewTitle: string;
  readonly featureOverviewDescription: string;
  readonly featureItems: readonly SolarSystemFeatureCopy[];
  readonly toolComparison: SolarSystemToolComparisonCopy;
  readonly howItWorksEyebrow: string;
  readonly howItWorksTitle: string;
  readonly howItWorksSteps: readonly SolarSystemHowItWorksStepCopy[];
  readonly ctaTitle: string;
  readonly ctaDescription: string;
  readonly ctaAction: string;
  readonly faqEyebrow: string;
  readonly faqTitle: string;
  readonly faqDescription: string;
  readonly faqItems: readonly SolarSystemFaqItemCopy[];
};

export type SolarSystemCopy = {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly heading: string;
  readonly navigationTitle: string;
  readonly heroAction: string;
  readonly pageContent: SolarSystemPageContentCopy;
  readonly randomMode: string;
  readonly manualMode: string;
  readonly helpTitle: string;
  readonly helpSteps: readonly string[];
  readonly settingsTitle: string;
  readonly assetsTitle: string;
  readonly detailsTitle: string;
  readonly filesTitle: string;
  readonly exportTitle: string;
  readonly canvasLabel: string;
  readonly planetLabel: string;
  readonly resizePlanetLabel: string;
  readonly starRangeLabels: Readonly<Record<SolarStarRange, string>>;
  readonly categoryLabels: Readonly<Record<SolarAssetCategory, string>>;
  readonly fieldLabels: Readonly<Record<SolarPlanetField, string>>;
  readonly units: Readonly<Record<SolarPlanetField, string>>;
  readonly countLabel: string;
  readonly countHint: string;
  readonly regenerate: string;
  readonly selectPlanetHint: string;
  readonly dragging: string;
  readonly resizing: string;
  readonly clearAll: string;
  readonly description: string;
  readonly deleteSelected: string;
  readonly saveTitle: string;
  readonly localSaveHint: string;
  readonly slotLabel: string;
  readonly save: string;
  readonly load: string;
  readonly emptySlot: string;
  readonly overwriteHint: string;
  readonly imageGenerate: string;
  readonly imageTitle: string;
  readonly imageSaveHint: string;
  readonly imageExcludesDescription: string;
  readonly randomImageExcludesDetails: string;
  readonly print: string;
  readonly printIncludesDescriptions: string;
  readonly randomPrintIncludesDetails: string;
  readonly close: string;
  readonly saved: string;
  readonly loaded: string;
  readonly generatingStatus: string;
  readonly errorLabel: string;
};

const englishSolarSystemCopy: SolarSystemCopy = {
  pageTitle: 'Free Solar System Creator – Build Your Own Planetary System',
  pageDescription:
    'Design your own planetary system with our solar system creator. Choose from 240 star and planet assets, generate a random system, or arrange planets your way.',
  heading: 'Solar System Creator',
  navigationTitle: 'Solar System Creator',
  heroAction: 'Try Solar System Creator',
  pageContent: {
    whatIsTitle: 'What is Solar System Creator?',
    whatIsDescription:
      'Solar System Creator is a free online visual design tool that lets you build your own planetary system in the browser. It offers 240 star and planet assets and supports random generation and manual editing: random mode lets you set a star range and planet count and edit eight generated planet details; manual mode lets you choose assets, drag planets, resize them, and add descriptions, then save and load your work in five browser-local slots. Both modes support PNG image generation and printing, making it easy to organize creative references. Use Solar System Creator for planet settings in science-fiction novels, TRPG campaign material, game worldbuilding, and visual reference; it is suited to science-fiction and fantasy novel authors, TRPG players and DMs/GMs, worldbuilders, and anyone who wants to quickly visualize a planetary concept.',
    featureOverviewTitle: 'Build a system your way',
    featureOverviewDescription:
      'Use Solar System Creator to choose from 240 star and planet assets, generate a solar system or arrange planets yourself, and create a visual reference for your story or world.',
    featureItems: [
      {
        icon: 'assets',
        title: '240 star and planet assets',
        description: 'Solar System Creator provides 40 star assets and five planet types with 40 assets each to choose from.',
      },
      {
        icon: 'random',
        title: 'Random system generation',
        description:
          'In the random mode of Solar System Creator, set a star range—normal, include blue, or only blue—and choose 1–10 planets, or leave the count empty or set it to 0 for a random 4–10.',
      },
      {
        icon: 'details',
        title: 'Eight editable planet fields',
        description:
          'Solar System Creator lets you edit eight generated fields: environment, atmosphere, surface map, day length, gravity, orbit period, moons, and axial tilt.',
      },
      {
        icon: 'manual',
        title: 'Manual planet arrangement',
        description:
          'With the manual mode in Solar System Creator, choose a star for the system or add planets from five planet categories, then toggle dragging or resizing, edit descriptions, and delete or clear planets.',
      },
      {
        icon: 'saves',
        title: 'Five browser-local save slots',
        description:
          'With Solar System Creator’s manual mode, save and load your work in five slots stored locally in your browser on this device.',
      },
      {
        icon: 'export',
        title: 'Image and print exports',
        description:
          'Solar System Creator PNG images do not include planet details or descriptions. Random print includes all eight fields, while manual print includes planet descriptions.',
      },
    ],
    toolComparison: {
      title: 'Solar System Creator vs. Photoshop vs. Illustrator',
      description:
        'Solar System Creator brings ready-to-use assets, random planet details, and manual placement into one browser tool for quick concept work. Photoshop and Illustrator provide broader image and vector editing capabilities.',
      tableLabel: 'Common ways to build planetary concept references',
      dimensionHeading: 'Dimension',
      solarSystemCreatorHeading: 'Solar System Creator',
      photoshopHeading: 'Photoshop',
      illustratorHeading: 'Illustrator',
      rows: [
        {
          dimension: 'Asset preparation',
          solarSystemCreator: 'Choose from 240 ready-to-use star and planet assets.',
          photoshop: 'Prepare your own assets.',
          illustrator: 'Prepare your own assets.',
        },
        {
          dimension: 'Creation method',
          solarSystemCreator: 'Simple and convenient.',
          photoshop: 'Requires complex operations.',
          illustrator: 'Requires complex operations.',
        },
        {
          dimension: 'Planet details',
          solarSystemCreator: 'Generate and edit eight planet details.',
          photoshop: 'Add labels with text layers.',
          illustrator: 'Add labels with text objects.',
        },
        {
          dimension: 'Save and continue',
          solarSystemCreator: 'Provides five browser save slots.',
          photoshop: 'Requires manual saving.',
          illustrator: 'Requires manual saving.',
        },
        {
          dimension: 'Output',
          solarSystemCreator: 'Generate PNG images and print.',
          photoshop: 'Save as PNG or JPEG.',
          illustrator: 'Save as SVG or PDF.',
        },
      ],
    },
    howItWorksEyebrow: 'How it works',
    howItWorksTitle: 'How to use Solar System Creator',
    howItWorksSteps: [
      {
        title: 'Choose a mode',
        description:
          'Use Solar System Creator’s random mode to generate planet details, or choose manual mode for direct control of assets and placement.',
      },
      {
        title: 'Generate or arrange planets',
        description:
          'In Solar System Creator, set the random star range and count, or choose assets manually and use the drag and resize controls.',
      },
      {
        title: 'Review and use your system',
        description:
          'Use Solar System Creator to review and edit random planet fields or manual descriptions. Both modes can generate images and print; manual mode can also save your work in browser-local slots.',
      },
    ],
    ctaTitle: 'Ready to build your system?',
    ctaDescription: 'Open Solar System Creator to start generating or arranging a planetary system for your world.',
    ctaAction: 'Start creating',
    faqEyebrow: 'FAQ',
    faqTitle: 'Solar System Creator FAQ',
    faqDescription: 'Find answers about how Solar System Creator handles random and manual modes, browser-local saves, and image and print output.',
    faqItems: [
      {
        question: 'Who is this creator for, and is it free?',
        answer:
          'Solar System Creator is free to use and is designed for science-fiction and fantasy novel authors, TRPG players and DMs/GMs, worldbuilders, and anyone who needs visual references for planetary settings.',
      },
      {
        question: 'What can I control in random mode?',
        answer:
          'The random mode in Solar System Creator lets you choose normal stars, include blue stars, or only blue stars. Set 1–10 planets, or leave the count empty or enter 0 for a random 4–10; then edit eight generated fields for each planet.',
      },
      {
        question: 'How does manual mode work?',
        answer:
          'In the manual mode of Solar System Creator, choose a star for the system and add planets from the five planet categories. You can toggle dragging and resizing, edit a description, delete a selected planet, or clear all planets.',
      },
      {
        question: 'Where are manual saves stored?',
        answer:
          'Solar System Creator’s manual mode provides five save slots in the current browser on the current device. The slots are browser-local and are not cloud storage.',
      },
      {
        question: 'What do image and print exports include?',
        answer:
          'Solar System Creator PNG images do not include planet details or descriptions. Random print includes all eight planet fields, while manual print includes the descriptions you wrote.',
      },
    ],
  },
  randomMode: 'Random mode',
  manualMode: 'Manual mode',
  helpTitle: 'How to use',
  helpSteps: [
    'In random mode, choose a star range and the number of planets, then generate planet facts.',
    'In manual mode, pick a star or planet asset from the six asset categories and place it on the canvas.',
    'Select a planet to edit its generated facts or manual description.',
    'Random mode can generate an image or print all eight details for every planet; manual mode can save a snapshot in one of five browser-local slots, generate an image, or print.',
  ],
  settingsTitle: 'Random settings',
  assetsTitle: 'Assets',
  detailsTitle: 'Planet details',
  filesTitle: 'Local saves',
  exportTitle: 'Export',
  canvasLabel: 'Solar system canvas',
  planetLabel: 'Planet {number}',
  resizePlanetLabel: 'Resize planet {number}',
  starRangeLabels: {
    normal: 'Normal stars',
    'include-blue': 'Include blue stars',
    'only-blue': 'Only blue stars',
  },
  categoryLabels: {
    star: 'Stars',
    'type-1': 'Type 1',
    'type-2': 'Type 2',
    'type-3': 'Type 3',
    'type-4': 'Type 4',
    'type-5': 'Type 5',
  },
  fieldLabels: {
    environment: 'Environment',
    atmosphere: 'Atmosphere',
    surfaceMap: 'Surface map',
    dayHours: 'Day length',
    gravity: 'Gravity',
    orbitYears: 'Orbit period',
    moons: 'Moons',
    axialTilt: 'Axial tilt',
  },
  units: {
    environment: '',
    atmosphere: '',
    surfaceMap: '',
    dayHours: 'hours',
    gravity: '× Earth',
    orbitYears: 'Earth years',
    moons: 'count',
    axialTilt: 'degrees',
  },
  countLabel: 'Planet count',
  countHint: 'Enter 0 or leave empty for a random count from 4–10. Enter 1–10 to use a fixed count.',
  regenerate: 'Regenerate system',
  selectPlanetHint: 'Select a planet on the canvas to view and edit its details.',
  dragging: 'Allow dragging',
  resizing: 'Allow resizing',
  clearAll: 'Clear all planets',
  description: 'Description',
  deleteSelected: 'Delete selected planet',
  saveTitle: 'Browser-local saves',
  localSaveHint: 'Saved snapshots stay in this browser on this device.',
  slotLabel: 'Slot {number}',
  save: 'Save',
  load: 'Load',
  emptySlot: 'Empty slot',
  overwriteHint: 'Saving replaces the existing snapshot in this slot.',
  imageGenerate: 'Generate image',
  imageTitle: 'Image export',
  imageSaveHint: 'Right-click the image to save it; on mobile, press and hold to save.',
  imageExcludesDescription: 'The image export excludes planet descriptions.',
  randomImageExcludesDetails: 'The image does not include planet details.',
  print: 'Print',
  printIncludesDescriptions: 'The print layout includes planet descriptions.',
  randomPrintIncludesDetails: 'Print includes all eight details for every planet.',
  close: 'Close',
  saved: 'Saved.',
  loaded: 'Loaded.',
  generatingStatus: 'Generating…',
  errorLabel: 'Error',
};

const chineseSolarSystemCopy: SolarSystemCopy = {
  pageTitle: '免费太阳系创建器 – 打造你的行星系统',
  pageDescription:
    '使用太阳系创建器打造专属的行星系统。从 240 款恒星与行星素材中自由选择，随机生成太阳系，或按你的构想手动摆放行星。',
  heading: '太阳系创建器',
  navigationTitle: '太阳系创建器',
  heroAction: '试用太阳系创建器',
  pageContent: {
    whatIsTitle: '什么是太阳系创建器？',
    whatIsDescription:
      '太阳系创建器是一款免费的在线视觉设计工具，让你在浏览器中构建自己的行星系统。它提供 240 款恒星与行星素材，支持随机生成和手动编辑：随机模式可以设置恒星范围与行星数量，并编辑生成的 8 项行星资料；手动模式可以选择素材、拖动行星、调整大小和填写描述，还能通过 5 个浏览器本地槽位保存与加载作品。两种模式都支持生成 PNG 图片和打印，方便整理创作资料。太阳系创建器可用于科幻小说中的星球设定、TRPG 战役资料、游戏世界观中的行星概念，以及创作时的视觉参考，适合科幻与奇幻小说作者、TRPG 玩家和 DM/GM、世界观创作者，以及希望快速呈现行星构想的人。',
    featureOverviewTitle: '按你的方式构建系统',
    featureOverviewDescription:
      '使用太阳系创建器，从 240 款恒星与行星素材中随机生成一个太阳系或亲手摆放行星，为你的故事和世界观建立视觉参考。',
    featureItems: [
      {
        icon: 'assets',
        title: '240 款恒星与行星素材',
        description: '太阳系创建器提供 40 款恒星素材，以及 5 类各 40 款的行星素材。',
      },
      {
        icon: 'random',
        title: '随机生成太阳系',
        description: '在太阳系创建器的随机模式中，恒星范围可选普通、包含蓝色或仅蓝色；行星数量可固定为 1–10，留空或输入 0 时随机生成 4–10 颗。',
      },
      {
        icon: 'details',
        title: '8 项可编辑行星资料',
        description: '太阳系创建器支持编辑随机行星的环境、大气、表面地图、昼长、重力、公转周期、卫星和轴向倾角。',
      },
      {
        icon: 'manual',
        title: '手动摆放行星',
        description:
          '使用太阳系创建器的手动模式，选择恒星设置系统，或从 5 类行星素材添加行星；可开关拖动和调整大小，编辑描述，删除选中行星或清空全部行星。',
      },
      {
        icon: 'saves',
        title: '5 个浏览器本地存档槽位',
        description: '太阳系创建器的手动模式提供 5 个存档槽位，用于在当前设备的当前浏览器中保存与加载作品。',
      },
      {
        icon: 'export',
        title: '图片与打印导出',
        description: '太阳系创建器的两种模式均可生成 PNG 图片，图片不包含行星资料或描述；随机打印包含全部 8 项资料，手动打印包含行星描述。',
      },
    ],
    toolComparison: {
      title: '太阳系创建器与 Photoshop、Illustrator 对比',
      description:
        '太阳系创建器把现成素材、随机行星资料和手动摆放集中在一个浏览器工具中，方便快速制作概念参考；Photoshop 和 Illustrator 提供更广泛的图像与矢量编辑能力。',
      tableLabel: '制作行星概念参考的常见方式',
      dimensionHeading: '对比维度',
      solarSystemCreatorHeading: '太阳系创建器',
      photoshopHeading: 'Photoshop',
      illustratorHeading: 'Illustrator',
      rows: [
        {
          dimension: '素材准备',
          solarSystemCreator: '直接选择 240 款现成的恒星与行星素材。',
          photoshop: '自行准备',
          illustrator: '自行准备',
        },
        {
          dimension: '创建方式',
          solarSystemCreator: '简单方便',
          photoshop: '需要复杂操作',
          illustrator: '需要复杂操作',
        },
        {
          dimension: '行星资料',
          solarSystemCreator: '生成并编辑 8 项行星资料。',
          photoshop: '使用文本图层添加标注。',
          illustrator: '使用文本对象添加标注。',
        },
        {
          dimension: '保存和继续',
          solarSystemCreator: '提供 5 个浏览器槽位',
          photoshop: '需要自行保存',
          illustrator: '需要自行保存',
        },
        {
          dimension: '输出',
          solarSystemCreator: '生成 PNG 图片和打印内容。',
          photoshop: '另存为 PNG 或 JPEG。',
          illustrator: '保存为 SVG 或 PDF。',
        },
      ],
    },
    howItWorksEyebrow: '使用方法',
    howItWorksTitle: '如何使用太阳系创建器？',
    howItWorksSteps: [
      {
        title: '选择模式',
        description: '太阳系创建器提供随机模式生成行星资料，也提供手动模式让你直接控制素材和摆放位置。',
      },
      {
        title: '生成或摆放行星',
        description: '使用太阳系创建器时，可设置随机恒星范围和数量，或手动选择素材并使用拖动和调整大小控件。',
      },
      {
        title: '查看并使用你的系统',
        description: '使用太阳系创建器检查并编辑随机模式的行星资料或手动模式的描述。两种模式都能生成图片和打印，手动模式还可保存本地存档。',
      },
    ],
    ctaTitle: '准备好构建你的系统了吗？',
    ctaDescription: '打开太阳系创建器，开始为你的世界随机生成或手动摆放行星系统。',
    ctaAction: '开始制作',
    faqEyebrow: '常见问题',
    faqTitle: '太阳系创建器常见问题',
    faqDescription: '了解太阳系创建器的随机与手动模式、本地存档，以及图片和打印的使用方式。',
    faqItems: [
      {
        question: '这个创建器适合谁？免费吗？',
        answer: '太阳系创建器免费使用，适合科幻与奇幻小说作者、TRPG 玩家与 DM/GM、世界观创作者，以及需要行星视觉设定参考的人。',
      },
      {
        question: '随机模式可以控制什么？',
        answer: '太阳系创建器的随机模式可以选择普通恒星、包含蓝色恒星或仅蓝色恒星；固定 1–10 颗行星，或留空、输入 0 随机生成 4–10 颗，然后编辑每颗行星的 8 项资料。',
      },
      {
        question: '手动模式如何使用？',
        answer: '在太阳系创建器的手动模式中，选择恒星设置系统，并从 5 类行星素材添加行星。你可以开关拖动和调整大小、编辑描述、删除选中的行星或清空全部行星。',
      },
      {
        question: '手动模式的作品保存在哪里？',
        answer: '太阳系创建器的手动模式在当前设备的当前浏览器中提供 5 个存档槽位。槽位只保存在浏览器本地，不是云端存储。',
      },
      {
        question: '图片和打印导出包含什么？',
        answer: '太阳系创建器的 PNG 图片不包含行星资料或描述；随机打印包含全部 8 项行星资料，手动打印包含你填写的描述。',
      },
    ],
  },
  randomMode: '随机模式',
  manualMode: '手动模式',
  helpTitle: '使用方法',
  helpSteps: [
    '在随机模式中选择恒星范围和行星数量，然后生成行星信息。',
    '在手动模式中从六个素材分类选择恒星或行星，并将素材放到画布上。',
    '在画布上选择行星，编辑生成信息或手动描述。',
    '随机模式可以生成不含行星资料的图片，或打印包含全部行星 8 项资料的版本；手动模式可以把快照保存到五个浏览器本地槽位，也可以生成图片或打印。',
  ],
  settingsTitle: '随机设置',
  assetsTitle: '素材',
  detailsTitle: '行星详情',
  filesTitle: '本地存档',
  exportTitle: '导出',
  canvasLabel: '太阳系画布',
  planetLabel: '行星 {number}',
  resizePlanetLabel: '调整行星 {number} 的大小',
  starRangeLabels: {
    normal: '普通恒星',
    'include-blue': '包含蓝色恒星',
    'only-blue': '仅蓝色恒星',
  },
  categoryLabels: {
    star: '恒星',
    'type-1': '类型1',
    'type-2': '类型2',
    'type-3': '类型3',
    'type-4': '类型4',
    'type-5': '类型5',
  },
  fieldLabels: {
    environment: '环境',
    atmosphere: '大气',
    surfaceMap: '表面地图',
    dayHours: '昼长',
    gravity: '重力',
    orbitYears: '公转周期',
    moons: '卫星',
    axialTilt: '轴向倾角',
  },
  units: {
    environment: '',
    atmosphere: '',
    surfaceMap: '',
    dayHours: '小时',
    gravity: '×地球',
    orbitYears: '地球年',
    moons: '颗',
    axialTilt: '度',
  },
  countLabel: '行星数量',
  countHint: '输入 0 或留空时随机生成 4–10 颗行星。输入 1–10 可固定数量。',
  regenerate: '重新生成系统',
  selectPlanetHint: '在画布上选择行星即可查看和编辑详情。',
  dragging: '允许拖动',
  resizing: '允许调整大小',
  clearAll: '清除所有行星',
  description: '描述',
  deleteSelected: '删除选中的行星',
  saveTitle: '浏览器本地保存',
  localSaveHint: '保存的快照只保留在本设备的当前浏览器中。',
  slotLabel: '槽位 {number}',
  save: '保存',
  load: '加载',
  emptySlot: '空槽位',
  overwriteHint: '保存会替换该槽位中已有的快照。',
  imageGenerate: '生成图片',
  imageTitle: '图片导出',
  imageSaveHint: '右键点击图片保存；手机上请长按图片保存。',
  imageExcludesDescription: '图片导出不包含行星描述。',
  randomImageExcludesDetails: '图像不包含行星资料。',
  print: '打印',
  printIncludesDescriptions: '打印版式包含行星描述。',
  randomPrintIncludesDetails: '打印包含全部行星的8项资料。',
  close: '关闭',
  saved: '已保存。',
  loaded: '已加载。',
  generatingStatus: '生成中…',
  errorLabel: '错误',
};

export function getSolarSystemCopy(locale: SiteLocale): SolarSystemCopy {
  if (locale === 'en') return englishSolarSystemCopy;
  if (locale === 'zh') return chineseSolarSystemCopy;
  throw new Error(`Solar system copy locale must be en or zh. Received ${String(locale)}.`);
}
