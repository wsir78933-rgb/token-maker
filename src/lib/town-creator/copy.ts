import type { TownCreatorCaseStudiesCopy } from '@/lib/town-creator/case-studies';
import { getTownCreatorCaseStudiesCopy } from '@/lib/town-creator/case-studies';
import type { SiteLocale } from '@/lib/site-locale';

export const TOWN_CREATOR_EDITOR_ID = 'town-creator-editor';

export type TownCreatorCopy = Readonly<{
  navTitle: string;
  pageTitle: string;
  pageDescription: string;
  heading: string;
  description: string;
  heroEmphasis: string;
  heroAction: string;
  whatIs: Readonly<{
    title: string;
    description: string;
  }>;
  caseStudies: TownCreatorCaseStudiesCopy;
  featureOverview: Readonly<{
    title: string;
    subtitle: string;
    features: readonly Readonly<{
      title: string;
      description: string;
    }>[];
  }>;
  howItWorks: Readonly<{
    title: string;
    description: string;
    steps: readonly Readonly<{
      title: string;
      description: string;
    }>[];
  }>;
  toolComparison: Readonly<{
    title: string;
    description: string;
    columns: Readonly<{
      aspect: string;
      town: string;
      handDrawn: string;
      imageEditor: string;
    }>;
    rows: readonly Readonly<{
      aspect: string;
      town: string;
      handDrawn: string;
      imageEditor: string;
    }>[];
  }>;
  cta: Readonly<{
    title: string;
    description: string;
    action: string;
  }>;
  faq: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{
      question: string;
      answer: string;
    }>[];
  }>;
}>;

const englishCopy: TownCreatorCopy = {
  navTitle: 'Town Creator',
  pageTitle: 'Fantasy Town Generator | Create Town Maps Online',
  pageDescription:
    'Create fantasy town maps for D&D, tabletop RPGs, and worldbuilding. Design bustling towns, frontier villages, and mysterious places for your next adventure.',
  heading: 'Fantasy Town Generator Create Town Maps Online',
  description:
    'Create fantasy town maps for D&D, tabletop RPGs, and worldbuilding. Design bustling towns, frontier villages, and mysterious places for your next adventure.',
  heroEmphasis: 'Fantasy Town Generator',
  heroAction: 'Start creating',
  whatIs: {
    title: 'What is Fantasy Town Generator?',
    description:
      'Fantasy Town Generator is a browser-based map layout tool for D&D GMs, TTRPG campaign preparation, novel writers, game developers, and worldbuilders. Place buildings, defenses, props, roads, terrain, prefab houses, and nature assets to shape a town layout for your setting.',
  },
  caseStudies: getTownCreatorCaseStudiesCopy('en'),
  featureOverview: {
    title: 'Build the town layout you need',
    subtitle:
      'Start with a blank canvas in Fantasy Town Generator, choose the assets that fit your setting, and keep the map easy to revise as your idea grows.',
    features: [
      {
        title: '192 assets across 7 categories',
        description:
          'Browse 192 base assets and 486 appearances in Fantasy Town Generator across buildings, defenses, props, roads, terrain, prefabs, and nature.',
      },
      {
        title: '4 material options',
        description:
          'In Fantasy Town Generator, choose wood, stone, clay, or sandstone when the selected new asset supports the material. Existing objects keep their current material, and fixed assets keep their neutral appearance.',
      },
      {
        title: 'Three editable layers',
        description:
          'Use lower, middle, and upper layers in Fantasy Town Generator to separate parts of the town while you build and review the map.',
      },
      {
        title: 'Direct object editing',
        description:
          'With Fantasy Town Generator, drag objects, edit their position and size, rotate them, copy them to another layer, or remove them with Delete or Backspace.',
      },
      {
        title: 'Save and transfer projects',
        description:
          'Fantasy Town Generator offers five browser-local save slots, plus TXT project download and import so you can continue editing elsewhere.',
      },
      {
        title: 'Export a clean PNG',
        description:
          'Fantasy Town Generator exports a PNG at the project width and height, including visible layers, rotations, repeated assets, and the background without selection handles or editor controls.',
      },
    ],
  },
  howItWorks: {
    title: 'How to use Fantasy Town Generator',
    description:
      'Build the layout in a few focused passes, from choosing the first asset to exporting a map you can use in your next adventure.',
    steps: [
      {
        title: 'Choose an asset',
        description:
          'In Fantasy Town Generator, search the library, choose a category and material, then click an asset to add it to the active layer.',
      },
      {
        title: 'Arrange and edit the map',
        description:
          'With Fantasy Town Generator, drag objects into place, resize and rotate them, copy them to another layer, or remove them with Delete or Backspace. You can also set the canvas size, background color, or background image.',
      },
      {
        title: 'Save or export the result',
        description:
          'When your layout is ready in Fantasy Town Generator, save to a browser-local slot, download a project file for later editing, or export the finished town as a PNG.',
      },
    ],
  },
  toolComparison: {
    title: 'Fantasy Town Generator compared with other map-making methods',
    description:
      'Choose the workflow that matches the way you develop a setting. This tool focuses on quickly arranging reusable town assets while other methods leave more of the drawing and asset preparation to you.',
    columns: {
      aspect: 'Comparison',
      town: 'Fantasy Town Generator',
      handDrawn: 'Hand-drawn map',
      imageEditor: 'General image editor',
    },
    rows: [
      {
        aspect: 'Starting point',
        town: 'Begin with a blank canvas and built-in town assets.',
        handDrawn: 'Begin with a sketch or a blank sheet.',
        imageEditor: 'Begin with a blank canvas and assets you prepare or import.',
      },
      {
        aspect: 'Asset assembly',
        town: 'Search 7 categories and place the assets you need.',
        handDrawn: 'Draw or collect each element by hand.',
        imageEditor: 'Prepare, import, and arrange the assets you need.',
      },
      {
        aspect: 'Layout editing',
        town: 'Move, resize, rotate, copy, and delete map objects across three layers.',
        handDrawn: 'Redraw or annotate areas as the layout changes.',
        imageEditor: 'Edit according to the objects and layer controls in the chosen editor.',
      },
      {
        aspect: 'Iteration',
        town: 'Adjust selected objects without redrawing the whole town.',
        handDrawn: 'Revise the drawing or make a new version by hand.',
        imageEditor: 'Revise the prepared assets and layers as the design changes.',
      },
      {
        aspect: 'Output',
        town: 'Export a clean PNG using the project dimensions.',
        handDrawn: 'Scan or photograph the finished map.',
        imageEditor: 'Export according to the available formats and settings.',
      },
    ],
  },
  cta: {
    title: 'Start building your fantasy town',
    description:
      'Use Fantasy Town Generator to choose a category, place your first asset, and shape a town layout for your next campaign or worldbuilding session.',
    action: 'Start creating',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Fantasy Town Generator FAQ',
    description:
      'Find answers about town assets, layers, editing, project files, and PNG export.',
    items: [
      {
        question: 'Who is Fantasy Town Generator for?',
        answer:
          'Fantasy Town Generator is designed for D&D GMs, TTRPG campaign preparation, novel writers, game developers, and worldbuilders.',
      },
      {
        question: 'What can I build with it?',
        answer:
          'Fantasy Town Generator lets you arrange buildings, defenses, props, roads, terrain, prefab houses, and nature assets into a fantasy town layout.',
      },
      {
        question: 'How many assets are included?',
        answer:
          'Fantasy Town Generator includes a library with 192 base assets and 486 appearances across the available categories.',
      },
      {
        question: 'Can I change the material of an asset?',
        answer:
          'Supported new assets can use wood, stone, clay, or sandstone. Existing objects keep their current material, and fixed assets keep their neutral appearance.',
      },
      {
        question: 'How do layers work?',
        answer:
          'The editor provides lower, middle, and upper layers. You can switch the editing layer and show or hide complete layers.',
      },
      {
        question: 'Can I resize, rotate, copy, and delete objects?',
        answer:
          'Yes. Drag objects, edit their position and size, rotate them, copy them to another layer, or delete the selected object with Delete or Backspace.',
      },
      {
        question: 'Can I save a town and continue later?',
        answer:
          'Use five browser-local save slots, or download and import a TXT project file.',
      },
      {
        question: 'What does the PNG export include?',
        answer:
          'PNG export uses the project dimensions, visible layers, rotations, repeated assets, and background. Selection handles and editor controls are excluded.',
      },
    ],
  },
};

const chineseCopy: TownCreatorCopy = {
  navTitle: '城镇创建器',
  pageTitle: '奇幻城镇生成器｜在线创建城镇地图',
  pageDescription:
    '使用奇幻城镇生成器，为 D&D、TRPG 和世界观创作搭建城镇地图。自由组合建筑、道路、城墙与地形，打造繁华城镇、边境小镇或充满秘密的冒险据点。',
  heading: '奇幻城镇生成器在线创建城镇地图',
  description:
    '使用奇幻城镇生成器，为 D&D、TRPG 和世界观创作搭建城镇地图。自由组合建筑、道路、城墙与地形，打造繁华城镇、边境小镇或充满秘密的冒险据点。',
  heroEmphasis: '奇幻城镇生成器',
  heroAction: '开始创建',
  whatIs: {
    title: '什么是奇幻城镇生成器？',
    description:
      '奇幻城镇生成器是一款面向 D&D 主持人、TRPG 战役准备、小说作者、游戏开发者和世界观创作者的在线城镇地图工具。你可以放置建筑、城防、配件、道路、地面、预制屋和自然素材，为自己的设定整理城镇布局。',
  },
  caseStudies: getTownCreatorCaseStudiesCopy('zh'),
  featureOverview: {
    title: '搭建你需要的城镇布局',
    subtitle:
      '在奇幻城镇生成器中从空白画布开始，选择适合设定的素材，并随着想法变化持续调整地图。',
    features: [
      {
        title: '192 种素材，覆盖 7 类分类',
        description:
          '在奇幻城镇生成器中浏览 192 种基础素材和 486 种外观，分类包括建筑、城防、配件、道路、地面、预制屋和自然。',
      },
      {
        title: '4 种素材材质',
        description:
          '在奇幻城镇生成器里，对于支持材质的新素材，可以选择木材、石材、陶土或砂岩；现有对象保留原材质，固定素材保持中性外观。',
      },
      {
        title: '三个可编辑图层',
        description:
          '借助奇幻城镇生成器，使用下层、中层和上层分开整理城镇地图中的不同内容，方便搭建和检查。',
      },
      {
        title: '直接编辑地图对象',
        description:
          '使用奇幻城镇生成器可以拖动对象、编辑位置和尺寸、旋转对象、复制到其他图层，也可以使用 Delete 或 Backspace 删除。',
      },
      {
        title: '保存和转移项目',
        description:
          '奇幻城镇生成器提供 5 个浏览器本地存档位，也支持下载或导入 TXT 城镇项目，方便以后继续编辑。',
      },
      {
        title: '导出干净 PNG',
        description:
          '使用奇幻城镇生成器按照项目宽高导出可见图层、旋转、重复素材和背景，不包含选中框或编辑器控件。',
      },
    ],
  },
  howItWorks: {
    title: '如何使用奇幻城镇生成器？',
    description:
      '从选择第一个素材开始，分几个清晰步骤搭建布局，最后导出可用于下一场冒险的地图。',
    steps: [
      {
        title: '选择素材',
        description:
          '在奇幻城镇生成器中搜索素材库，选择分类和材质，然后点击素材将它添加到当前图层。',
      },
      {
        title: '排列并编辑地图',
        description:
          '使用奇幻城镇生成器拖动对象进行布局，调整尺寸和旋转，也可以复制到其他图层，或使用 Delete／Backspace 删除。还可以设置画布尺寸、背景颜色或背景图片。',
      },
      {
        title: '保存或导出结果',
        description:
          '在奇幻城镇生成器中完成布局后，保存到浏览器本地存档位，下载项目文件以便之后继续编辑，或将完成的城镇导出为 PNG。',
      },
    ],
  },
  toolComparison: {
    title: '奇幻城镇生成器与其他制图方式对比',
    description:
      '选择符合自己创作习惯的工作方式。这个工具专注于快速排列可复用的城镇素材，其他方式则会把更多绘制和素材准备工作交给创作者。',
    columns: {
      aspect: '对比维度',
      town: '奇幻城镇生成器',
      handDrawn: '手绘地图',
      imageEditor: '通用图像编辑器',
    },
    rows: [
      {
        aspect: '起点',
        town: '从空白画布和内置城镇素材开始。',
        handDrawn: '从草图或空白纸张开始。',
        imageEditor: '从空白画布以及自行准备或导入的素材开始。',
      },
      {
        aspect: '素材组合',
        town: '搜索 7 类素材，放置需要的内容。',
        handDrawn: '手动绘制或收集每个元素。',
        imageEditor: '自行准备、导入并排列所需素材。',
      },
      {
        aspect: '布局编辑',
        town: '在三个图层中移动、缩放、旋转、复制和删除地图对象。',
        handDrawn: '随着布局变化重新绘制或标注区域。',
        imageEditor: '根据所选编辑器提供的对象和图层控制进行调整。',
      },
      {
        aspect: '反复调整',
        town: '调整选中对象，无需重新绘制整张城镇地图。',
        handDrawn: '修改手绘版本，或手动绘制新版本。',
        imageEditor: '随着设计变化修改已经准备好的素材和图层。',
      },
      {
        aspect: '输出',
        town: '按照项目尺寸导出干净 PNG。',
        handDrawn: '扫描或拍摄完成后的地图。',
        imageEditor: '按照工具提供的格式和设置导出。',
      },
    ],
  },
  cta: {
    title: '开始搭建你的奇幻城镇',
    description:
      '使用奇幻城镇生成器选择一个分类，放置第一个素材，为下一场战役或世界观创作整理城镇布局。',
    action: '开始创建',
  },
  faq: {
    eyebrow: '常见问题',
    title: '奇幻城镇生成器常见问题',
    description:
      '了解城镇素材、图层、对象编辑、项目文件和 PNG 导出的使用方式。',
    items: [
      {
        question: '奇幻城镇生成器适合哪些人？',
        answer:
          '奇幻城镇生成器适合 D&D 主持人、TRPG 战役准备、小说作者、游戏开发者和世界观创作者。',
      },
      {
        question: '可以用它创建什么？',
        answer:
          '使用奇幻城镇生成器可以组合建筑、城防、配件、道路、地面、预制屋和自然素材，整理幻想城镇布局。',
      },
      {
        question: '工具中有多少素材？',
        answer: '奇幻城镇生成器的素材库包含 192 种基础素材，以及 486 种可用外观。',
      },
      {
        question: '可以更换素材材质吗？',
        answer:
          '支持材质的新素材可以选择木材、石材、陶土或砂岩；现有对象保留原材质，固定素材保持中性外观。',
      },
      {
        question: '图层如何使用？',
        answer:
          '编辑器提供下层、中层和上层，可以切换编辑图层，也可以整体显示或隐藏图层。',
      },
      {
        question: '可以调整、旋转、复制和删除对象吗？',
        answer:
          '可以拖动对象、编辑位置和尺寸、旋转对象、复制到其他图层，也可以使用 Delete 或 Backspace 删除选中对象。',
      },
      {
        question: '可以保存城镇并以后继续编辑吗？',
        answer:
          '可以使用 5 个浏览器本地存档位，也可以下载和导入 TXT 项目文件。',
      },
      {
        question: 'PNG 导出会包含哪些内容？',
        answer:
          'PNG 会使用项目尺寸、可见图层、旋转、重复素材和背景，不包含选中框或编辑器控件。',
      },
    ],
  },
};

const copyByLocale: Readonly<Record<SiteLocale, TownCreatorCopy>> = {
  en: englishCopy,
  zh: chineseCopy,
};

export function getTownCreatorCopy(locale: string): TownCreatorCopy {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(`Unknown town creator locale: ${JSON.stringify(locale)}.`);
  }

  return copyByLocale[locale];
}
