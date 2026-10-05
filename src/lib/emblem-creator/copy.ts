import type { EmblemAssetCategory, EmblemLayerId, EmblemLocale } from './types';

export interface EmblemCreatorCopy {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly heading: string;
  readonly description: string;
  readonly heroAction: string;
  readonly whatIs: {
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly features: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly howItWorks: {
    readonly eyebrow: string;
    readonly title: string;
    readonly label: string;
    readonly steps: readonly {
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly callToAction: {
    readonly title: string;
    readonly description: string;
    readonly label: string;
  };
  readonly toolComparison: {
    readonly title: string;
    readonly description: string;
    readonly dimensionHeading: string;
    readonly emblemCreatorHeading: string;
    readonly photoshopHeading: string;
    readonly illustratorHeading: string;
    readonly tableLabel: string;
    readonly rows: readonly {
      readonly dimension: string;
      readonly emblemCreator: string;
      readonly photoshop: string;
      readonly illustrator: string;
    }[];
  };
  readonly faq: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly question: string;
      readonly answer: string;
    }[];
  };
  readonly editorTitle: string;
  readonly canvasLabel: string;
  readonly noSelection: string;
  readonly selectedLabel: string;
  readonly loadingLabel: string;
  readonly errorTitle: string;
  readonly toolbar: {
    readonly openProject: string;
    readonly saveProject: string;
    readonly exportPng: string;
    readonly exporting: string;
  };
  readonly panels: { readonly assets: string; readonly properties: string; readonly layers: string };
  readonly assets: {
    readonly categories: Readonly<Record<EmblemAssetCategory, string>>;
    readonly imageUrl: string;
    readonly addImage: string;
    readonly addingImage: string;
    readonly chooseAsset: string;
  };
  readonly properties: {
    readonly emptySelection: string;
    readonly x: string;
    readonly y: string;
    readonly width: string;
    readonly height: string;
    readonly rotation: string;
    readonly applyRotation: string;
    readonly mirror: string;
    readonly deleteSelected: string;
    readonly showEditBounds: string;
    readonly invalidNumber: string;
    readonly positiveSize: string;
    readonly coordinateRange: string;
  };
  readonly layers: {
    readonly names: Readonly<Record<EmblemLayerId, string>>;
    readonly clearActiveLayer: string;
    readonly showLayer: string;
    readonly hideLayer: string;
    readonly emptyLayer: string;
  };
  readonly errors: {
    readonly invalidImageUrl: string;
    readonly loadImageFailed: string;
    readonly invalidProject: string;
    readonly exportFailed: string;
    readonly operationFailed: string;
    readonly bodyLayersFull: string;
  };
}

const englishCopy: EmblemCreatorCopy = {
  pageTitle: 'Free Online Emblem Maker for D&D and RPG Fantasy Worlds',
  pageDescription:
    'For D&D and RPG players, GMs, and fantasy creators who want characters, factions, and ranks to have symbols that fit their worlds.',
  heading: 'Emblem Creator',
  description: 'Build and edit your emblem.',
  heroAction: 'Start Creating',
  whatIs: {
    title: 'What is the Emblem Creator?',
    paragraphs: [
      'Emblem Creator is an online tool that helps you quickly make black-and-white emblems, logos, icons, and rank insignia. Use it to design a badge for your adventuring party, create a symbol for a faction, guild, or legion, or give characters and organizations in your fantasy world a mark of their own.',
      'Whether you are a tabletop RPG or D&D player or GM, a fantasy worldbuilder, a fiction writer, or an indie game developer, Emblem Creator helps bring distinctive visual marks to your world and makes each faction and organization easier to recognize and remember.',
    ],
  },
  features: {
    title: 'Emblem-making features',
    description:
      'Start with catalog assets or a web image, then adjust, layer, export, and save your emblem project.',
    items: [
      {
        title: 'Browse assets by category',
        description:
          'Choose catalog assets from Subject, Details, or Icons, then add them to the canvas.',
      },
      {
        title: 'Adjust each element',
        description:
          'Select an element on the canvas to move it, scale it proportionally, rotate it, mirror it horizontally, or delete it.',
      },
      {
        title: 'Compose visible layers',
        description:
          'Use the layer panel to show or hide subject, detail, and icon layers, and clear the active layer when needed.',
      },
      {
        title: 'Add a custom image by URL',
        description:
          'Enter a full HTTP or HTTPS image URL to load an image into a chosen category. The external image server must allow cross-origin loading; otherwise adding the image or exporting a PNG may fail.',
      },
      {
        title: 'Export a 1024 × 1024 PNG',
        description: 'Export the visible layers as a PNG file named emblem.png.',
      },
      {
        title: 'Save and reopen a JSON project',
        description:
          'Save an emblem-project.json file, then open it later to continue editing. The image URLs saved in the project must still load.',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'How to use Emblem Creator',
    label: 'Emblem Creator steps',
    steps: [
      {
        title: 'Choose an asset',
        description:
          'Pick Subject, Details, or Icons, then choose a catalog asset to add to the canvas.',
      },
      {
        title: 'Adjust the element',
        description:
          'Select the element and move it, scale it proportionally, rotate it, mirror it, or delete it.',
      },
      {
        title: 'Compose the layers',
        description:
          'Use the layer panel to show or hide layers and clear the active layer as you refine the emblem.',
      },
      {
        title: 'Export or save',
        description:
          'Use Export PNG for a 1024 × 1024 image, or Save project to download JSON and open it again later.',
      },
    ],
  },
  callToAction: {
    title: 'Start making your emblem',
    description:
      'Build an emblem in the editor, then export a PNG or save the project when you are ready.',
    label: 'Start Creating',
  },
  toolComparison: {
    title: 'Start your emblem with ready-made assets',
    description: 'Assets, layers, and the canvas are ready. Compose and export your emblem in your browser.',
    dimensionHeading: 'Feature',
    emblemCreatorHeading: 'Emblem Creator',
    photoshopHeading: 'Photoshop (desktop)',
    illustratorHeading: 'Illustrator (desktop)',
    tableLabel: 'Emblem Creator tool comparison',
    rows: [
      {
        dimension: 'Purpose',
        emblemCreator: 'Focused on creating emblems by combining assets.',
        photoshop: 'General image editing and compositing.',
        illustrator: 'General vector drawing and design.',
      },
      {
        dimension: 'Getting started',
        emblemCreator: 'Open your browser and start creating.',
        photoshop: 'Edit in the desktop application.',
        illustrator: 'Edit in the desktop application.',
      },
      {
        dimension: 'Asset preparation',
        emblemCreator: 'Built-in Subject, Details, and Icons assets, ready to select.',
        photoshop: 'Prepare assets yourself.',
        illustrator: 'Prepare assets yourself.',
      },
      {
        dimension: 'Layer setup',
        emblemCreator: 'Preset emblem layers: add assets and start composing.',
        photoshop: 'Set up layers yourself.',
        illustrator: 'Set up layers yourself.',
      },
      {
        dimension: 'Export',
        emblemCreator: 'The size is already set: export a 1024 × 1024 PNG directly.',
        photoshop: 'You need to adjust the output size yourself.',
        illustrator: 'You need to adjust the output size yourself.',
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Emblem Creator FAQ',
    description: 'Quick answers for building, saving, and exporting an emblem.',
    items: [
      {
        question: 'What can I use Emblem Creator for?',
        answer:
          'Combine catalog assets and images on the 1024 × 1024 canvas to make a black-and-white emblem, logo, icon, or rank insignia.',
      },
      {
        question: 'How do I build an emblem?',
        answer:
          'Choose Subject, Details, or Icons, then select assets to add them to the canvas. Use the canvas and Properties panel to move, resize, rotate, mirror, or delete the selected element, and use the layer controls when needed.',
      },
      {
        question: 'Can I add my own image?',
        answer:
          'Yes. Enter a full HTTP or HTTPS image URL in Custom image URL, choose a category, and select Add image. The editor loads the image from that URL before adding it. The external image server must allow cross-origin loading; otherwise adding the image or exporting a PNG may fail.',
      },
      {
        question: 'How do I export a PNG?',
        answer:
          'Select Export PNG in the toolbar. The editor renders the visible layers to a 1024 × 1024 PNG and downloads it as emblem.png.',
      },
      {
        question: 'How do I save and continue editing later?',
        answer:
          'Select Save project to download emblem-project.json. Later, choose Open project and select that JSON file to continue editing; the image URLs in the project must still load.',
      },
    ],
  },
  editorTitle: 'Emblem editor',
  canvasLabel: 'Emblem canvas',
  noSelection: 'No element selected',
  selectedLabel: 'Selected element',
  loadingLabel: 'Loading images…',
  errorTitle: 'Unable to complete the action',
  toolbar: {
    openProject: 'Open project', saveProject: 'Save project', exportPng: 'Export PNG', exporting: 'Exporting…',
  },
  panels: { assets: 'Assets', properties: 'Properties', layers: 'Layers' },
  assets: {
    categories: { body: 'Subject', detail: 'Details', crest: 'Icons' },
    imageUrl: 'Custom image URL', addImage: 'Add image', addingImage: 'Adding image…', chooseAsset: 'Choose an asset',
  },
  properties: {
    emptySelection: 'Select an element to edit its properties.',
    x: 'X', y: 'Y', width: 'Width', height: 'Height', rotation: 'Rotation',
    applyRotation: 'Apply rotation', mirror: 'Mirror horizontally', deleteSelected: 'Delete selected',
    showEditBounds: 'Show edit bounds', invalidNumber: 'Enter a finite number', positiveSize: 'Size must be greater than zero',
    coordinateRange: 'Coordinate must be between 0 and',
  },
  layers: {
    names: { crests: 'Icons', details: 'Details', body1: 'Subject layer 1', body2: 'Subject layer 2', body3: 'Subject layer 3', body4: 'Subject layer 4' },
    clearActiveLayer: 'Clear current layer', showLayer: 'Show layer', hideLayer: 'Hide layer',
    emptyLayer: 'Layer is empty',
  },
  errors: {
    invalidImageUrl: 'Invalid image URL', loadImageFailed: 'Failed to load image', invalidProject: 'Invalid project',
    exportFailed: 'Failed to export PNG', operationFailed: 'Operation failed',
    bodyLayersFull: 'All 4/4 subject layers are occupied. Clear a subject layer before adding another.',
  },
};

const chineseCopy: EmblemCreatorCopy = {
  pageTitle: '免费在线奇幻世界徽章制作器 | D&D 与 RPG 徽记',
  pageDescription: '面向 D&D / RPG 桌游玩家、GM 与奇幻创作者，让角色、阵营与等级身份拥有符合世界观的视觉标识。',
  heading: '徽标制作工具',
  description: '制作并编辑你的徽标。',
  heroAction: '开始制作',
  whatIs: {
    title: '什么是徽章制作器？',
    paragraphs: [
      '徽章制作器是一款在线工具，帮助你快速制作黑白徽章、标志、图标和等级徽记。你可以用它为冒险团设计徽章，为阵营、公会或军团创建标识，也可以为奇幻世界中的角色与组织打造专属符号。',
      '无论你是 RPG / D&D 桌游玩家或 GM，还是奇幻世界观创作者、小说作者或独立游戏开发者，都可以用徽章制作器为自己的世界增添鲜明的视觉标记，让每个阵营和组织都更容易辨认与记住。',
    ],
  },
  features: {
    title: '用于徽章制作的功能',
    description: '从目录素材或网页图片开始，调整元素、组合图层，并导出或保存你的工程。',
    items: [
      {
        title: '按分类选择素材',
        description: '从“主体”“细节”或“图标”分类中选择素材并添加到画布。',
      },
      {
        title: '调整元素',
        description: '选中画布中的元素后，可移动、按比例缩放、旋转、水平镜像或删除它。',
      },
      {
        title: '组合可见图层',
        description: '在图层面板中控制主体、细节和图标图层的显示，并按需清空当前图层。',
      },
      {
        title: '通过 URL 添加自定义图片',
        description:
          '输入完整的 HTTP 或 HTTPS 图片地址，将图片加载到所选分类；外部图片服务器需要允许跨域加载，否则添加图片或导出 PNG 可能失败。',
      },
      {
        title: '导出 1024 × 1024 PNG',
        description: '将当前可见图层导出为名为 emblem.png 的 PNG 文件。',
      },
      {
        title: '保存并重新打开 JSON 工程',
        description: '下载 emblem-project.json，之后重新打开它继续编辑；工程中的图片 URL 仍需能够加载。',
      },
    ],
  },
  howItWorks: {
    eyebrow: '操作流程',
    title: '如何使用徽章制作器？',
    label: '徽章制作器操作步骤',
    steps: [
      {
        title: '选择素材',
        description: '选择“主体”“细节”或“图标”分类，再选取素材添加到画布。',
      },
      {
        title: '调整元素',
        description: '选中元素后移动、按比例缩放、旋转、水平镜像或删除它。',
      },
      {
        title: '组合图层',
        description: '在图层面板中切换图层显示，按需清空当前图层，逐步组合徽章。',
      },
      {
        title: '导出与保存',
        description: '点击“导出 PNG”生成 1024 × 1024 图片，或点击“保存工程”下载 JSON，之后重新打开继续编辑。',
      },
    ],
  },
  callToAction: {
    title: '现在开始制作你的徽章',
    description: '在编辑器中组合素材、调整图层，准备好后导出 PNG 或保存工程。',
    label: '开始制作',
  },
  toolComparison: {
    title: '制作徽章，选素材就能开始',
    description: '素材、图层和画布已备好，在浏览器中组合并导出徽章。',
    dimensionHeading: '对比维度',
    emblemCreatorHeading: '徽章制作器',
    photoshopHeading: 'Photoshop（桌面版）',
    illustratorHeading: 'Illustrator（桌面版）',
    tableLabel: '徽章制作器与 Photoshop、Illustrator 对比',
    rows: [
      {
        dimension: '制作定位',
        emblemCreator: '专注通过素材组合制作徽章。',
        photoshop: '通用图片编辑与合成。',
        illustrator: '通用矢量绘制与设计。',
      },
      {
        dimension: '使用方式',
        emblemCreator: '打开浏览器即可开始制作。',
        photoshop: '在桌面软件中编辑。',
        illustrator: '在桌面软件中编辑。',
      },
      {
        dimension: '素材准备',
        emblemCreator: '内置主体、细节和图标素材，点选即用。',
        photoshop: '自行准备素材。',
        illustrator: '自行准备素材。',
      },
      {
        dimension: '图层准备',
        emblemCreator: '预置徽章图层，添加素材即可组合。',
        photoshop: '自行准备图层。',
        illustrator: '自行准备图层。',
      },
      {
        dimension: '成品导出',
        emblemCreator: '尺寸已设好，直接导出 1024 × 1024 PNG。',
        photoshop: '需要自己调整尺寸。',
        illustrator: '需要自己调整尺寸。',
      },
    ],
  },
  faq: {
    eyebrow: '常见问题',
    title: '徽章制作常见问题',
    description: '快速了解徽章制作、图片添加、PNG 导出和工程继续编辑。',
    items: [
      {
        question: '徽章制作器可以用来做什么？',
        answer: '你可以在 1024 × 1024 画布上组合素材和图片，制作黑白徽章、标志、图标或等级徽记。',
      },
      {
        question: '如何制作一个徽章？',
        answer:
          '先在“主体”“细节”或“图标”分类中选择素材并添加到画布，再用画布和“属性”面板移动、调整大小、旋转、水平镜像或删除选中元素；需要时可用图层控件切换显示。',
      },
      {
        question: '可以添加自己的图片吗？',
        answer:
          '可以。在“自定义图片 URL”中输入完整的 HTTP 或 HTTPS 图片地址，选择分类后点击“添加图片”。图片会先从该地址加载，再添加到编辑器。外部图片服务器需要允许跨域加载，否则添加图片或导出 PNG 可能失败。',
      },
      {
        question: '如何导出 PNG？',
        answer: '在工具栏点击“导出 PNG”。编辑器会把当前可见图层渲染为 1024 × 1024 的 PNG，并下载为 emblem.png。',
      },
      {
        question: '如何保存并继续编辑？',
        answer:
          '点击“保存工程”下载 emblem-project.json。之后点击“打开工程”并选择这个 JSON 文件即可继续编辑；工程中的图片 URL 仍需能够加载。',
      },
    ],
  },
  editorTitle: '徽标编辑器',
  canvasLabel: '徽标画布',
  noSelection: '未选中元素',
  selectedLabel: '当前选中元素',
  loadingLabel: '正在加载图片…',
  errorTitle: '无法完成操作',
  toolbar: {
    openProject: '打开工程', saveProject: '保存工程', exportPng: '导出 PNG', exporting: '正在导出…',
  },
  panels: { assets: '素材', properties: '属性', layers: '图层' },
  assets: {
    categories: { body: '主体', detail: '细节', crest: '图标' },
    imageUrl: '自定义图片 URL', addImage: '添加图片', addingImage: '正在添加图片…', chooseAsset: '选择素材',
  },
  properties: {
    emptySelection: '选择一个元素以编辑属性。',
    x: 'X 坐标', y: 'Y 坐标', width: '宽度', height: '高度', rotation: '角度',
    applyRotation: '应用旋转', mirror: '水平镜像', deleteSelected: '删除选中',
    showEditBounds: '显示编辑边界', invalidNumber: '请输入有限数值', positiveSize: '尺寸必须大于零',
    coordinateRange: '坐标必须介于 0 与以下数值之间',
  },
  layers: {
    names: { crests: '图标层', details: '细节层', body1: '主体层 1', body2: '主体层 2', body3: '主体层 3', body4: '主体层 4' },
    clearActiveLayer: '清空当前层', showLayer: '显示图层', hideLayer: '隐藏图层',
    emptyLayer: '图层为空',
  },
  errors: {
    invalidImageUrl: '图片 URL 无效', loadImageFailed: '图片加载失败', invalidProject: '工程无效',
    exportFailed: 'PNG 导出失败', operationFailed: '操作失败',
    bodyLayersFull: '主体图层已满（4/4）。请先清空一个主体层后再添加。',
  },
};

export function getEmblemCreatorCopy(locale: EmblemLocale): EmblemCreatorCopy {
  if (locale === 'en') return englishCopy;
  if (locale === 'zh') return chineseCopy;
  throw new Error(`Unknown emblem creator locale: ${JSON.stringify(locale)}.`);
}
