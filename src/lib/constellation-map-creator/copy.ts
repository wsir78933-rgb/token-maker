import type { SiteLocale } from '@/lib/site-locale';

import type { ConstellationWorkspaceCopy } from './copy-types';

export type ConstellationFeatureIcon =
  | 'assets'
  | 'placement'
  | 'appearance'
  | 'saves'
  | 'export'
  | 'mobile';

export type ConstellationFeatureCopy = {
  readonly icon: ConstellationFeatureIcon;
  readonly title: string;
  readonly description: string;
};

export type ConstellationHowItWorksStepCopy = {
  readonly title: string;
  readonly description: string;
};

export type ConstellationFaqItemCopy = {
  readonly question: string;
  readonly answer: string;
};

export type ConstellationPageContentCopy = {
  readonly whatIs: {
    readonly title: string;
    readonly description: string;
  };
  readonly features: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly ConstellationFeatureCopy[];
  };
  readonly howItWorks: {
    readonly eyebrow: string;
    readonly title: string;
    readonly steps: readonly ConstellationHowItWorksStepCopy[];
  };
  readonly toolComparison: {
    readonly title: string;
    readonly description: string;
    readonly tableLabel: string;
    readonly dimensionHeading: string;
    readonly constellationMapCreatorHeading: string;
    readonly photoshopHeading: string;
    readonly illustratorHeading: string;
    readonly rows: readonly {
      readonly dimension: string;
      readonly constellationMapCreator: string;
      readonly photoshop: string;
      readonly illustrator: string;
    }[];
  };
  readonly cta: {
    readonly title: string;
    readonly description: string;
    readonly action: string;
  };
  readonly faq: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly ConstellationFaqItemCopy[];
  };
};

export type ConstellationMapCopy = {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly heading: string;
  readonly navigationTitle: string;
  readonly heroAction: string;
  readonly workspace: ConstellationWorkspaceCopy;
  readonly pageContent: ConstellationPageContentCopy;
};

const englishWorkspaceCopy: ConstellationWorkspaceCopy = {
  workspaceTitle: 'Constellation map workspace',
  assetsTitle: 'Assets',
  settingsTitle: 'Settings',
  filesTitle: 'Saved projects',
  exportTitle: 'Export',
  canvasLabel: 'Constellation map canvas',
  objectLabel: 'Object {number}',
  resizeLabel: 'Resize object {number}',
  rotateLabel: 'Rotate object {number}',
  assetCount: '{count} in this category',
  addStar: 'Add star',
  deleteSelected: 'Delete selected',
  dragging: 'Allow dragging',
  resizing: 'Allow resizing',
  selectedCount: 'Selected: {count}',
  canvasHint: 'Select an object to edit it. Click the selected object again to deselect it. Drag the round handle to rotate the selected object.',
  width: 'Width',
  height: 'Height',
  applySize: 'Apply size',
  backgroundColor: 'Background color',
  applyColor: 'Apply color',
  transparentBase: 'Transparent base color',
  transparentHint: 'Transparent base color does not remove the background image.',
  backgroundImage: 'Background image',
  backgroundUrl: 'Image URL',
  applyImage: 'Apply image',
  removeImage: 'Remove image',
  sizeMismatch: 'Image is {imageWidth} × {imageHeight}; map is {width} × {height}.',
  clearObjects: 'Clear objects',
  clearHint: 'Clears objects but keeps the background and map size.',
  browserSaves: 'Browser saves',
  browserHint: 'Five slots. Saving replaces only the selected slot; loading replaces the current map. Both keep the current drag and resize switches.',
  slotLabel: 'Slot {number}',
  emptySlot: 'Empty',
  occupiedSlot: 'Saved',
  save: 'Save',
  load: 'Load',
  savedSlot: 'Saved to slot {number}.',
  loadedSlot: 'Loaded slot {number}.',
  overwriteHint: 'Saving replaces the selected slot. Loading replaces the current map.',
  projectTitle: 'Project file',
  projectHint: 'Save a complete project with the background, dimensions, and objects.',
  generateProject: 'Prepare project file',
  downloadProject: 'Download project',
  chooseProject: 'Choose project file',
  loadProject: 'Load project',
  noFile: 'No project file selected.',
  generatedProject: 'Project file is ready to download.',
  loadedProject: 'Project file loaded.',
  generateImage: 'Preview image',
  downloadImage: 'Save image',
  actualSize: 'Actual map size: {width} × {height}',
  exportHint: 'The image excludes selection outlines and uses the current background settings.',
  exportReady: 'Export preview is ready.',
  close: 'Close',
  backToEditor: 'Back to editor',
  help: 'Help',
  helpTitle: 'How to use',
  busy: 'Working…',
  errorLabel: 'Error',
  addedObject: 'Added object.',
  deletedObject: 'Deleted selected object.',
  clearedObjects: 'Cleared objects. Background and map size were kept.',
  settingsApplied: 'Settings applied.',
  categoryLabels: {
    image: 'Images',
    plain: 'Stars',
    line: 'Lines',
  },
  helpSteps: [
    'Choose the image, star-point, or line version of a constellation. The three versions in each group use the same star positions, so you can pick the visual treatment you need and add it more than once.',
    'Click an object to select it; click the selected object again to deselect it. A selected object is raised to the front.',
    'Use the drag and resize switches to move objects and resize them while preserving their original ratio. Drag the round handle to rotate a selected object; that handle stays available when the switches are off. Add a star for a single star point.',
    'Delete the selected object or clear all objects. Clearing keeps the background and map dimensions.',
    'Transparent base color changes the base color only; remove the background image separately when you need a clear sky.',
    'Browser slots and project files save a complete map. Loading replaces the current map, while the current drag and resize switches stay as they are.',
    'Remote background images must allow browser access through CORS. A background image is drawn at its native size from the top-left: a larger image is clipped and a smaller image leaves the base color visible. Preview and PNG export use the same result.',
  ],
};

const chineseWorkspaceCopy: ConstellationWorkspaceCopy = {
  workspaceTitle: '星座地图工作区',
  assetsTitle: '素材',
  settingsTitle: '设置',
  filesTitle: '存档项目',
  exportTitle: '导出',
  canvasLabel: '星座地图画布',
  objectLabel: '对象 {number}',
  resizeLabel: '调整对象 {number} 的大小',
  rotateLabel: '旋转对象 {number}',
  assetCount: '当前分类 {count} 项',
  addStar: '添加星星',
  deleteSelected: '删除选中对象',
  dragging: '允许拖动',
  resizing: '允许调整大小',
  selectedCount: '已选择：{count}',
  canvasHint: '选择对象即可编辑；再次点击已选对象可以取消选择。拖动圆形把手可以旋转选中的对象。',
  width: '宽度',
  height: '高度',
  applySize: '应用尺寸',
  backgroundColor: '背景颜色',
  applyColor: '应用颜色',
  transparentBase: '透明底色',
  transparentHint: '透明底色不会移除背景图片。',
  backgroundImage: '背景图片',
  backgroundUrl: '图片 URL',
  applyImage: '应用图片',
  removeImage: '移除图片',
  sizeMismatch: '图片为 {imageWidth} × {imageHeight}；地图为 {width} × {height}。',
  clearObjects: '清空对象',
  clearHint: '清空对象，但保留背景和地图尺寸。',
  browserSaves: '浏览器存档',
  browserHint: '提供 5 个槽位。保存只替换当前槽位；加载会替换当前地图。两种操作都会保留当前拖动、缩放开关状态。',
  slotLabel: '槽位 {number}',
  emptySlot: '空',
  occupiedSlot: '已保存',
  save: '保存',
  load: '加载',
  savedSlot: '已保存到槽位 {number}。',
  loadedSlot: '已加载槽位 {number}。',
  overwriteHint: '保存会替换当前槽位；加载会替换当前地图。',
  projectTitle: '项目文件',
  projectHint: '保存包含背景、尺寸和对象的完整项目。',
  generateProject: '准备项目文件',
  downloadProject: '下载项目文件',
  chooseProject: '选择项目文件',
  loadProject: '加载项目文件',
  noFile: '尚未选择项目文件。',
  generatedProject: '项目文件已准备好下载。',
  loadedProject: '项目文件已加载。',
  generateImage: '预览图片',
  downloadImage: '保存图片',
  actualSize: '地图实际尺寸：{width} × {height}',
  exportHint: '导出图片不包含选中边框，并使用当前背景设置。',
  exportReady: '导出预览已准备好。',
  close: '关闭',
  backToEditor: '返回编辑器',
  help: '帮助',
  helpTitle: '使用方法',
  busy: '处理中…',
  errorLabel: '错误',
  addedObject: '已添加对象。',
  deletedObject: '已删除选中对象。',
  clearedObjects: '已清空对象，背景和地图尺寸已保留。',
  settingsApplied: '设置已应用。',
  categoryLabels: {
    image: '图形',
    plain: '星点',
    line: '连线',
  },
  helpSteps: [
    '选择同一星座的图形、星点或连线版本；同组的三个版本使用相同星点位置，只是呈现方式不同，需要重复时可以多次添加同一素材。',
    '点击对象可以选中；再次点击已选对象可以取消选择。选中的对象会置于最前。',
    '打开拖动和调整大小开关即可移动对象或按原比例调整大小。拖动圆形把手可以旋转选中对象，关闭这两个开关后仍可旋转。需要单独星点时添加星星。',
    '删除选中对象或清空全部对象。清空操作会保留背景和地图尺寸。',
    '透明底色只会改变底色；需要清除天空图片时，请单独移除背景图片。',
    '浏览器槽位和项目文件都会保存完整地图。加载会替换当前地图，但当前拖动、缩放开关状态会保持不变。',
    '远程背景图片必须允许浏览器通过 CORS 访问。背景图片会从左上角按原始尺寸绘制：图片更大时会被裁切，图片更小时会露出底色；编辑预览和 PNG 导出结果保持一致。',
  ],
};

const englishConstellationMapCopy: ConstellationMapCopy = {
  pageTitle: 'Constellation Map Creator | Build Fantasy Star Maps',
  pageDescription:
    'Create a constellation map for fantasy worlds, D&D campaigns, novels, and games. Add star patterns and single stars, set a sky background, save projects, and export PNG images.',
  heading: 'Constellation Map Creator',
  navigationTitle: 'Constellation Map Creator',
  heroAction: 'Start creating',
  workspace: englishWorkspaceCopy,
  pageContent: {
    whatIs: {
      title: 'What is the Constellation Map Creator?',
      description:
        'Constellation Map Creator is an online tool for designing fictional night skies and constellation maps. It offers 61 constellation themes in image, star-point, and line styles. You can add constellations and individual stars, drag and resize them, adjust the background and map dimensions, save projects, and export PNG images. Use your maps for stargazing clues and player handouts in D&D/TRPG campaigns, illustrations of constellation legends in novels, sky design references for games, and calendar or navigation concepts in fantasy worlds. It is designed for D&D/TRPG game masters, novelists, game developers, and worldbuilders.',
    },
    features: {
      title: 'Build a sky map in one workspace',
      description:
        'Keep the frequent actions close to the canvas so you can add, arrange, save, and export without losing sight of the map. The Constellation Map Creator keeps this workspace focused on visual sky building.',
      items: [
        {
          icon: 'assets',
          title: '183 constellation assets',
          description: 'Browse 61 original constellation groups in image, star-point, and line styles, then add any style more than once. The Constellation Map Creator keeps all three treatments available for quick comparison.',
        },
        {
          icon: 'placement',
          title: 'Simple placement controls',
          description: 'Inside the Constellation Map Creator, add a constellation or a star, select objects, bring the selected object to the front, drag, resize proportionally, and delete.',
        },
        {
          icon: 'appearance',
          title: 'Sky appearance settings',
          description: 'Set the base color, use a transparent base, apply or remove a background image, and see image-to-map size warnings. The Constellation Map Creator keeps these sky controls close to the map.',
        },
        {
          icon: 'saves',
          title: 'Complete local saves',
          description: 'Keep five browser slots or download a project file from the Constellation Map Creator that includes the background, dimensions, and objects.',
        },
        {
          icon: 'export',
          title: 'Clean PNG export',
          description: 'Preview and save the map at its actual dimensions without carrying the editing selection outline into the image. The Constellation Map Creator keeps the preview aligned with that clean output.',
        },
        {
          icon: 'mobile',
          title: 'Focused mobile workflow',
          description: 'Use the canvas first, collapse the material panel after adding an asset, and keep save and export actions close at hand.',
        },
      ],
    },
    howItWorks: {
      eyebrow: 'How it works',
      title: 'Create a fictional sky in three steps',
      steps: [
        {
          title: 'Choose a pattern',
          description: 'The Constellation Map Creator lets you compare an image, star-point, or line style, or add a single star for a small point of light.',
        },
        {
          title: 'Arrange the map',
          description: 'In the Constellation Map Creator, select objects, move and resize them with the editor switches, then set the background and map dimensions.',
        },
        {
          title: 'Save or export',
          description: 'Save the complete map in a browser slot or project file, then use the Constellation Map Creator to preview and download a PNG at the actual map size.',
        },
      ],
    },
    toolComparison: {
      title: 'Start from ready-made constellations and make your fantasy sky',
      description:
        'Built-in patterns for 61 constellation groups, each with image, star-point, and line styles, 183 assets in total. Choose a constellation, then arrange your fantasy sky by dragging and scaling.',
      tableLabel: 'Constellation Map Creator, Photoshop, and Illustrator',
      dimensionHeading: 'Comparison',
      constellationMapCreatorHeading: 'Constellation Map Creator',
      photoshopHeading: 'Photoshop',
      illustratorHeading: 'Illustrator',
      rows: [
        {
          dimension: 'Constellation asset preparation',
          constellationMapCreator: '61 built-in constellation groups and 183 assets, ready to choose and use.',
          photoshop: 'Prepare constellation assets yourself.',
          illustrator: 'Prepare constellation assets yourself.',
        },
        {
          dimension: 'Dedicated star-map operations',
          constellationMapCreator:
            'In the same star-map workspace, choose constellations, drag them into place, and scale them in proportion.',
          photoshop: 'Use general image and layer editing tools.',
          illustrator: 'Use general shape, path, and vector editing tools.',
        },
      ],
    },
    cta: {
      title: 'Ready to map your fictional sky?',
      description: 'Open the workspace and start placing a constellation with the Constellation Map Creator for your next worldbuilding session.',
      action: 'Open the creator',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Constellation Map Creator FAQ',
      description: 'The Constellation Map Creator FAQ answers questions about asset styles, object editing, backgrounds, saves, project files, and PNG export.',
      items: [
        {
          question: 'Can I use the same constellation more than once?',
          answer: 'Yes. The Constellation Map Creator lets you add the same image, star-point, or line style repeatedly, then select, move, resize, and layer each copy independently.',
        },
        {
          question: 'What happens when I clear the map?',
          answer: 'Clear removes constellation and star objects while keeping the background settings and map dimensions.',
        },
        {
          question: 'Does transparent base color remove the background image?',
          answer: 'No. Transparent base color changes the base color only. Remove the background image separately when you need a clear sky.',
        },
        {
          question: 'What do browser saves and project files include?',
          answer: 'Both save the complete map from the Constellation Map Creator, including the background, map dimensions, and objects. Loading replaces the current map while the current drag and resize switches stay as they are.',
        },
        {
          question: 'Why can a background image export differently?',
          answer: 'The Constellation Map Creator uses a remote image only when it allows browser access through CORS. The image is drawn at its native size from the top-left, so a larger image is clipped and a smaller image leaves the base color visible. The warning, preview, and PNG export use that same result.',
        },
      ],
    },
  },
};

const chineseConstellationMapCopy: ConstellationMapCopy = {
  pageTitle: '星座地图创建器｜创建幻想星空地图',
  pageDescription:
    '为奇幻世界观、D&D/TRPG 战役、小说和游戏创建星空与星座地图。添加星座图案和星星，设置天空背景，保存项目并导出 PNG 图片。',
  heading: '星座地图创建器',
  navigationTitle: '星座地图创建器',
  heroAction: '开始制作',
  workspace: chineseWorkspaceCopy,
  pageContent: {
    whatIs: {
      title: '什么是星座地图创建器？',
      description:
        '星座地图创建器是一款用于设计虚构星空与星座地图的在线工具。它提供 61 组星座素材，包含图形、星点和连线三种样式，支持添加星座和单颗星星、拖动与缩放、调整背景和地图尺寸、保存项目及导出 PNG 图片。制作的地图可用于 D&D/TRPG 战役的观星线索与玩家资料、小说的星座传说配图、游戏的天空设计参考，以及幻想世界的历法与导航设定。适合 D&D/TRPG 主持人、小说作者、游戏开发者和世界观创作者。',
    },
    features: {
      title: '在一个工作区中制作星空地图',
      description: '把常用操作放在画布附近，使用星座地图创建器添加、摆放、保存和导出时不需要离开当前地图。',
      items: [
        {
          icon: 'assets',
          title: '183 项星座素材',
          description: '浏览 61 组原创星座图案，每组提供图形、星点和连线三种样式；星座地图创建器会保留这三种呈现方式，方便比较并重复添加同一素材。',
        },
        {
          icon: 'placement',
          title: '简单的摆放控件',
          description: '使用星座地图创建器时，添加星座或星星，选择对象，将选中对象置前，拖动、按比例调整大小并删除。',
        },
        {
          icon: 'appearance',
          title: '天空外观设置',
          description: '设置底色、使用透明底色、应用或移除背景图片，并查看图片与地图尺寸提示；星座地图创建器把这些天空控件放在地图附近。',
        },
        {
          icon: 'saves',
          title: '完整本地存档',
          description: '使用 5 个浏览器槽位，或从星座地图创建器下载包含背景、尺寸和对象的完整项目文件。',
        },
        {
          icon: 'export',
          title: '干净的 PNG 导出',
          description: '按地图实际尺寸预览和保存图片，导出结果不会带上编辑时的选中边框；星座地图创建器会让预览与这份干净图片保持一致。',
        },
        {
          icon: 'mobile',
          title: '适合手机的工作流',
          description: '优先查看画布，添加素材后收起素材面板，并把保存和导出操作放在容易触达的位置。',
        },
      ],
    },
    howItWorks: {
      eyebrow: '使用方法',
      title: '三步制作虚构星空',
      steps: [
        {
          title: '选择图案',
          description: '星座地图创建器让你先比较图形、星点或连线样式，也可以添加单独的星星作为小光点。',
        },
        {
          title: '摆放地图',
          description: '在星座地图创建器中，选择对象，打开编辑开关移动并调整大小，再设置背景和地图尺寸。',
        },
        {
          title: '保存或导出',
          description: '把完整地图保存到浏览器槽位或项目文件，随后可通过星座地图创建器按实际地图尺寸预览并下载 PNG。',
        },
      ],
    },
    toolComparison: {
      title: '从现成星座开始，制作你的幻想天空',
      description:
        '内置 61 组星座图案，每组提供图形、星点和连线三种样式，共 183 项素材。选择星座，再通过拖动和缩放安排你的幻想天空。',
      tableLabel: '星座地图创建器、Photoshop 与 Illustrator',
      dimensionHeading: '比较维度',
      constellationMapCreatorHeading: '星座地图创建器',
      photoshopHeading: 'Photoshop',
      illustratorHeading: 'Illustrator',
      rows: [
        {
          dimension: '星座素材准备',
          constellationMapCreator: '内置 61 组星座、183 项素材，直接选择使用。',
          photoshop: '需自行准备星座素材。',
          illustrator: '需自行准备星座素材。',
        },
        {
          dimension: '专用星图操作',
          constellationMapCreator: '在同一星图工作区选择星座、拖动摆放和按比例缩放。',
          photoshop: '使用通用图片和图层编辑工具。',
          illustrator: '使用通用形状、路径和矢量编辑工具。',
        },
      ],
    },
    cta: {
      title: '准备好绘制你的虚构星空了吗？',
      description: '打开星座地图创建器，为下一次世界观创作摆放第一组星座。',
      action: '打开创建器',
    },
    faq: {
      eyebrow: '常见问题',
      title: '星座地图创建器常见问题',
      description: '星座地图创建器的常见问题涵盖素材样式、对象编辑、背景、存档、项目文件和 PNG 导出。',
      items: [
        {
          question: '同一个星座可以添加多次吗？',
          answer: '可以。星座地图创建器支持重复添加图形、星点或连线样式，每个副本都能单独选择、移动、调整大小和分层。',
        },
        {
          question: '清空地图会发生什么？',
          answer: '清空会移除星座和星星对象，但会保留背景设置和地图尺寸。',
        },
        {
          question: '透明底色会移除背景图片吗？',
          answer: '不会。透明底色只会改变底色；需要清除背景图片时，请单独移除背景图片。',
        },
        {
          question: '浏览器存档和项目文件包含什么？',
          answer: '在星座地图创建器中，两种方式都会保存完整地图，包括背景、地图尺寸和对象。加载会替换当前地图，但当前拖动、缩放开关状态会保持不变。',
        },
        {
          question: '为什么背景图片导出后可能不同？',
          answer: '星座地图创建器中的远程图片必须允许浏览器通过 CORS 访问。图片会从左上角按原始尺寸绘制，尺寸更大时会被裁切，尺寸更小时会露出底色；尺寸提示、导出预览和 PNG 结果保持一致。',
        },
      ],
    },
  },
};

export function getConstellationMapCopy(locale: SiteLocale): ConstellationMapCopy {
  if (locale === 'en') return englishConstellationMapCopy;
  if (locale === 'zh') return chineseConstellationMapCopy;

  throw new Error(`Constellation map copy locale must be en or zh. Received ${String(locale)}.`);
}
