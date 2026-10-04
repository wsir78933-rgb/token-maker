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
