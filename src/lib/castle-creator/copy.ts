import { getI18nDictionary } from '@/lib/i18n/dictionary';

import {
  CASTLE_CREATOR_CATEGORY_COUNTS,
  CASTLE_CREATOR_DOOR_COUNT,
  CASTLE_CREATOR_TOTAL_ASSET_COUNT,
} from './constants';
import type {
  CastleBuildingColor,
  CastleCategory,
  CastleLayerId,
  CastleRoofColor,
  CastleSaveSlotNumber,
} from './types';

const CASTLE_CREATOR_LOCALES = ['en', 'zh'] as const;
type CastleCreatorLocale = (typeof CASTLE_CREATOR_LOCALES)[number];

export type CastleCreatorAboutCopy = {
  readonly title: string;
  readonly paragraphs: readonly string[];
};

export type CastleCreatorFeatureCopy = {
  readonly icon: 'parts' | 'palette' | 'editing' | 'layers' | 'canvas' | 'export';
  readonly title: string;
  readonly description: string;
};

export type CastleCreatorFeaturesCopy = {
  readonly title: string;
  readonly description: string;
  readonly items: readonly CastleCreatorFeatureCopy[];
};

export type CastleCreatorHowItWorksStepCopy = {
  readonly title: string;
  readonly description: string;
};

export type CastleCreatorHowItWorksCopy = {
  readonly title: string;
  readonly description: string;
  readonly steps: readonly CastleCreatorHowItWorksStepCopy[];
};

export type CastleCreatorComparisonRowCopy = {
  readonly label: string;
  readonly castleCreator: string;
  readonly drawingTools: string;
  readonly modelingTools: string;
};

export type CastleCreatorComparisonCopy = {
  readonly title: string;
  readonly description: string;
  readonly castleCreatorLabel: string;
  readonly drawingToolsLabel: string;
  readonly modelingToolsLabel: string;
  readonly dimensionLabel: string;
  readonly rows: readonly CastleCreatorComparisonRowCopy[];
};

export type CastleCreatorCallToActionCopy = {
  readonly title: string;
  readonly description: string;
  readonly action: string;
};

export type CastleCreatorFaqItemCopy = {
  readonly question: string;
  readonly answer: string;
};

export type CastleCreatorMetadataCopy = {
  readonly title: string;
  readonly description: string;
};

export type CastleCreatorResizeHandle = 'start' | 'center' | 'end';

export type CastleCreatorToolbarCopy = {
  readonly editorHeading: string;
  readonly unsavedStatus: string;
  readonly savedStatus: (slotNumber: CastleSaveSlotNumber) => string;
  readonly browserSaveLabel: string;
  readonly projectFileLabel: string;
  readonly imageDownloadLabel: string;
  readonly helpLabel: string;
  readonly quickSaveLabel: string;
  readonly quickSaveActiveLabel: (slotNumber: CastleSaveSlotNumber) => string;
  readonly saveSuccessMessage: (slotNumber: CastleSaveSlotNumber) => string;
};

export type CastleCreatorLibraryCopy = {
  readonly heading: string;
  readonly totalCountLabel: (totalAssetCount: number) => string;
  readonly categoryLabels: Readonly<Record<CastleCategory, string>>;
  readonly categoryCountLabel: (category: CastleCategory) => string;
  readonly categoryPanelHeading: string;
  readonly categoryPanelCloseLabel: string;
  readonly categoryPanelReturnLabel: string;
  readonly categorySelectLabel: string;
  readonly paletteToggleLabel: string;
  readonly categoryPanelSummary: (categoryCount: number, totalAssetCount: number) => string;
  readonly paletteHeading: (category: CastleCategory) => string;
  readonly paletteColorLabel: (category: CastleCategory, color: CastleBuildingColor | CastleRoofColor) => string;
  readonly gatePaletteNote: string;
  readonly paletteNote: string;
  readonly assetImageAlt: (category: CastleCategory, assetNumber: number) => string;
  readonly imageLoadError: (imagePath: string) => string;
  readonly addAsset: string;
  readonly addAssetLabel: string;
  readonly repeatAssetLabel: string;
  readonly emptyHint: string;
  readonly mobileScrollNote: string;
  readonly selectedOptionLabel: string;
};

export type CastleCreatorEditorCopy = {
  readonly workspaceLabel: string;
  readonly canvasLabel: string;
  readonly emptyCanvasHint: string;
  readonly canvasHint: string;
  readonly snapLabel: string;
  readonly snapEnabledLabel: string;
  readonly snapDisabledLabel: string;
  readonly resizeLabel: string;
  readonly resizeEnabledLabel: string;
  readonly resizeDisabledLabel: string;
  readonly aspectRatioHint: string;
  readonly selectedPieceLabel: string;
  readonly resizeHandleLabels: Readonly<Record<CastleCreatorResizeHandle, string>>;
  readonly resizeKeyboardHint: string;
  readonly interactionError: string;
  readonly mobileTabLabels: {
    readonly library: string;
    readonly editor: string;
    readonly settings: string;
  };
  readonly activeLayerLabel: (layerId: CastleLayerId) => string;
  readonly layerLabels: Readonly<Record<CastleLayerId, string>>;
  readonly pieceHeading: string;
  readonly selectedPieceHeading: string;
  readonly copyLabel: string;
  readonly deleteLabel: string;
  readonly bringToFrontLabel: string;
  readonly selectionDisabledStatus: string;
  readonly selectionStatus: string;
  readonly copyNote: string;
  readonly resizeHint: string;
  readonly sizeLabel: string;
  readonly sizeScaleHint: string;
  readonly deleteSuccessMessage: string;
};

export type CastleCreatorSettingsCopy = {
  readonly panelHeading: string;
  readonly expandLabel: string;
  readonly collapseLabel: string;
  readonly panelHint: string;
  readonly layersHeading: string;
  readonly layerVisibilityLabel: string;
  readonly clearLayerLabel: string;
  readonly canvasHeading: string;
  readonly backgroundImageUrlLabel: string;
  readonly backgroundImageApplyLabel: string;
  readonly backgroundColorHeading: string;
  readonly backgroundColorLabel: string;
  readonly canvasWidthLabel: string;
  readonly canvasHeightLabel: string;
  readonly applyCanvasSizeLabel: string;
  readonly defaultCanvasSizeLabel: string;
  readonly clearAllLabel: string;
  readonly clearAllConfirmLabel: string;
  readonly clearAllConfirmDescription: string;
  readonly canvasCoordinatesHint: string;
  readonly scrollHint: string;
};

export type CastleCreatorSavesCopy = {
  readonly dialogTitle: string;
  readonly closeLabel: string;
  readonly localHeading: string;
  readonly slotLabel: (slotNumber: CastleSaveSlotNumber) => string;
  readonly savedSlotStatus: (slotNumber: CastleSaveSlotNumber) => string;
  readonly occupiedSlotStatus: string;
  readonly emptySlotStatus: string;
  readonly currentSlotLabel: string;
  readonly pieceCountLabel: (pieceCount: number) => string;
  readonly saveLabel: string;
  readonly loadLabel: string;
  readonly loadDisabledLabel: string;
  readonly storageNote: string;
  readonly overwriteTitle: string;
  readonly overwriteDescription: (slotNumber: CastleSaveSlotNumber) => string;
  readonly overwriteCancelLabel: string;
  readonly overwriteConfirmLabel: string;
  readonly saveLoadError: string;
};

export type CastleCreatorProjectFilesCopy = {
  readonly heading: string;
  readonly description: string;
  readonly newProjectLabel: string;
  readonly exportLabel: string;
  readonly importLabel: string;
  readonly importInputLabel: string;
  readonly invalidFileError: string;
  readonly importError: string;
};

export type CastleCreatorPngCopy = {
  readonly dialogTitle: string;
  readonly heading: string;
  readonly closeLabel: string;
  readonly previewLabel: string;
  readonly formatLabel: string;
  readonly visibleLayersOnlyLabel: string;
  readonly returnLabel: string;
  readonly downloadLabel: string;
  readonly loadingLabel: string;
  readonly exportError: string;
};

export type CastleCreatorFaqCopy = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly items: readonly CastleCreatorFaqItemCopy[];
};

export type CastleCreatorCopy = {
  readonly metadata: CastleCreatorMetadataCopy;
  readonly navigationName: string;
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly heading: string;
  readonly description: string;
  readonly heroAction: string;
  readonly about: CastleCreatorAboutCopy;
  readonly features: CastleCreatorFeaturesCopy;
  readonly howItWorks: CastleCreatorHowItWorksCopy;
  readonly comparison: CastleCreatorComparisonCopy;
  readonly callToAction: CastleCreatorCallToActionCopy;
  readonly toolbar: CastleCreatorToolbarCopy;
  readonly library: CastleCreatorLibraryCopy;
  readonly editor: CastleCreatorEditorCopy;
  readonly settings: CastleCreatorSettingsCopy;
  readonly saves: CastleCreatorSavesCopy;
  readonly projectFiles: CastleCreatorProjectFilesCopy;
  readonly png: CastleCreatorPngCopy;
  readonly faq: CastleCreatorFaqCopy;
};

const ENGLISH_CATEGORY_LABELS: Readonly<Record<CastleCategory, string>> = {
  walls: 'Walls',
  battlements: 'Battlements',
  towerRoofs: 'Tower roofs',
  buildings: 'Buildings',
  buildingRoofs: 'Building roofs',
  gates: 'Gates and doors',
};

const CHINESE_CATEGORY_LABELS: Readonly<Record<CastleCategory, string>> = {
  walls: '城墙',
  battlements: '城垛',
  towerRoofs: '塔顶',
  buildings: '建筑',
  buildingRoofs: '建筑屋顶',
  gates: '城门和门件',
};

const ENGLISH_LAYER_LABELS: Readonly<Record<CastleLayerId, string>> = {
  lower: 'Lower layer',
  middle: 'Middle layer',
  upper: 'Upper layer',
};

const CHINESE_LAYER_LABELS: Readonly<Record<CastleLayerId, string>> = {
  lower: '下层',
  middle: '中层',
  upper: '上层',
};

const ENGLISH_RESIZE_HANDLE_LABELS: Readonly<Record<CastleCreatorResizeHandle, string>> = {
  start: 'Resize selected piece from the right-edge midpoint',
  center: 'Resize selected piece from the bottom-edge midpoint',
  end: 'Resize selected piece with the outer resize point',
};

const CHINESE_RESIZE_HANDLE_LABELS: Readonly<Record<CastleCreatorResizeHandle, string>> = {
  start: '从右侧中点调整选中组件大小',
  center: '从底部中点调整选中组件大小',
  end: '用外侧缩放点调整选中组件大小',
};

function formatEnglishCategoryCount(category: CastleCategory): string {
  const categoryCount = CASTLE_CREATOR_CATEGORY_COUNTS[category];
  if (category === 'gates') {
    return `${categoryCount} gates + ${CASTLE_CREATOR_DOOR_COUNT} door pieces`;
  }
  return `${categoryCount} pieces`;
}

function formatChineseCategoryCount(category: CastleCategory): string {
  const categoryCount = CASTLE_CREATOR_CATEGORY_COUNTS[category];
  if (category === 'gates') {
    return `${categoryCount} 个城门 + ${CASTLE_CREATOR_DOOR_COUNT} 个门件`;
  }
  return `${categoryCount} 个零件`;
}

const englishCastleCreatorCopy: CastleCreatorCopy = {
  metadata: {
    title: 'Free Castle Creator – Build Fantasy Castles Online',
    description:
      'Build a fantasy castle from walls, towers, roofs, battlements, buildings, and gates. Save projects in your browser and download a PNG for your RPG, novel, or game world.',
  },
  navigationName: 'Castle Creator',
  pageTitle: 'Free Castle Creator – Build Fantasy Castles Online',
  pageDescription:
    'Build a fantasy castle from walls, towers, roofs, battlements, buildings, and gates. Save projects in your browser and download a PNG for your RPG, novel, or game world.',
  heading: 'Free Castle Creator Design Fantasy Castles Online',
  description:
    'Castle Creator is a free online castle design tool. Combine walls, towers, roofs and gates, choose colours, and adjust part sizes and positions. Save your design and download a PNG.',
  heroAction: 'Try for Free',
  about: {
    title: 'What is Castle Creator?',
    paragraphs: [
      'Castle Creator is a free online tool for manually designing fantasy castles from reusable walls, battlements, roofs, buildings, gates, and door pieces.',
      'Castle Creator is made for D&D campaigns, novel settings, game worldbuilding, and anyone who wants a quick way to arrange castle parts on a canvas.',
    ],
  },
  features: {
    title: 'Build your castle your way',
    description: 'Use modular parts and simple canvas controls in Castle Creator to shape a castle scene without starting from a blank page.',
    items: [
      {
        icon: 'parts',
        title: '366 castle parts',
        description: 'Castle Creator includes six categories of reusable castle parts, including gates and door pieces.',
      },
      {
        icon: 'palette',
        title: 'Choose your colours',
        description: 'In Castle Creator, choose one of four colours for walls, battlements, tower roofs, buildings, and gates, or one of five colours for building roofs. The selected palette applies to new parts; door pieces keep their original colours.',
      },
      {
        icon: 'editing',
        title: 'Edit every piece',
        description: 'Drag parts to move them, duplicate, delete, bring them to the front, or resize them proportionally.',
      },
      {
        icon: 'layers',
        title: 'Arrange three layers',
        description: 'Place parts on the lower, middle, or upper layer and control each layer’s visibility.',
      },
      {
        icon: 'canvas',
        title: 'Set the canvas',
        description: 'Choose a background colour or an HTTP/HTTPS image URL, then use an automatic or custom canvas size.',
      },
      {
        icon: 'export',
        title: 'Save and export',
        description: 'Save five browser slots, export an editable project file, or download a PNG of visible layers with Castle Creator.',
      },
    ],
  },
  howItWorks: {
    title: 'How it works',
    description: 'Choose parts, arrange the layers, refine the canvas, and save or export your castle with Castle Creator.',
    steps: [
      {
        title: 'Choose a category',
        description: 'Open Walls, Battlements, Tower roofs, Buildings, Building roofs, or Gates and doors, then click a part to add it.',
      },
      {
        title: 'Arrange the pieces',
        description: 'Drag parts on the canvas. Each new part is added to the active layer.',
      },
      {
        title: 'Refine the layout',
        description: 'Choose a palette for new parts, switch layers, resize pieces, and set the background or canvas size as needed.',
      },
      {
        title: 'Save or export',
        description: 'Save to one of five browser slots, export an editable JSON project file, or download a PNG of visible layers with Castle Creator.',
      },
    ],
  },
  comparison: {
    title: 'Castle Creator: No Drawing or 3D Modelling Required',
    description: 'Start with 366 ready-made parts in Castle Creator, drag them into a composition, and export your castle image. Compare the typical workflows for creating a castle exterior below.',
    castleCreatorLabel: 'Castle Creator',
    drawingToolsLabel: 'General drawing tools',
    modelingToolsLabel: '3D modelling tools',
    dimensionLabel: 'Operations needed to make a castle exterior image',
    rows: [
      {
        label: 'Asset preparation',
        castleCreator: 'Castle Creator starts with 366 ready-made castle parts across six categories, skipping the search and drawing of castle elements.',
        drawingTools: 'Find or draw castle elements, then import or place them in the drawing.',
        modelingTools: 'Create or import 3D castle models, then assemble the required objects.',
      },
      {
        label: 'Getting started',
        castleCreator: 'Choose parts and drag them into a composition; no need to draw from scratch or build a 3D model.',
        drawingTools: 'Typically involves drawing and editing skills to create or arrange castle elements.',
        modelingTools: 'Typically involves modelling and scene setup to create or import objects.',
      },
      {
        label: 'Layout adjustments',
        castleCreator: 'Move and resize parts, switch layers, and adjust the castle composition directly.',
        drawingTools: 'Edit individual shapes or images and organize their layer order.',
        modelingTools: 'Adjust models, camera, materials, and lighting to change the final view.',
      },
      {
        label: 'Using your design',
        castleCreator: 'Export a PNG for an RPG session, novel, or game setting, and save the project to edit later.',
        drawingTools: 'Save the drawing project and export an image in the formats supported by the tool.',
        modelingTools: 'Set the camera and render the scene, then export the resulting image.',
      },
    ],
  },
  callToAction: {
    title: 'Ready to build with Castle Creator?',
    description: 'Open Castle Creator, choose a category, place your first part, and start arranging your castle on the canvas.',
    action: 'Open the castle creator',
  },
  toolbar: {
    editorHeading: 'Castle editor',
    unsavedStatus: 'Not saved',
    savedStatus: (slotNumber) => `Slot ${slotNumber} · Saved`,
    browserSaveLabel: 'Browser saves',
    projectFileLabel: 'Project files',
    imageDownloadLabel: 'Download image',
    helpLabel: 'Help',
    quickSaveLabel: 'Save',
    quickSaveActiveLabel: (slotNumber) => `Save to slot ${slotNumber}`,
    saveSuccessMessage: (slotNumber) => `Saved to slot ${slotNumber}`,
  },
  library: {
    heading: 'Parts library',
    totalCountLabel: (totalAssetCount) => `${totalAssetCount} parts`,
    categoryLabels: ENGLISH_CATEGORY_LABELS,
    categoryCountLabel: formatEnglishCategoryCount,
    categoryPanelHeading: 'Categories and colours',
    categoryPanelCloseLabel: 'Back',
    categoryPanelReturnLabel: 'Back to parts',
    categorySelectLabel: 'Category',
    paletteToggleLabel: 'Colours',
    categoryPanelSummary: (categoryCount, totalAssetCount) =>
      `${categoryCount} categories · ${totalAssetCount} parts`,
    paletteHeading: (category) =>
      `${category === 'gates' ? 'Gates' : ENGLISH_CATEGORY_LABELS[category]} · ${category === 'buildingRoofs' ? 5 : 4} colours`,
    paletteColorLabel: (category, color) =>
      `${category === 'gates' ? 'Gates' : ENGLISH_CATEGORY_LABELS[category]} · Colour ${color}`,
    gatePaletteNote: 'Door pieces keep their original colours.',
    paletteNote: 'Colours apply to new parts.',
    assetImageAlt: (category, assetNumber) =>
      `${ENGLISH_CATEGORY_LABELS[category]} part ${assetNumber}`,
    imageLoadError: (imagePath) => `Image failed to load: ${imagePath}`,
    addAsset: 'Add part',
    addAssetLabel: 'Add part',
    repeatAssetLabel: 'Add another copy',
    emptyHint: 'Click a part to start building.',
    mobileScrollNote: '366 parts · scroll inside the parts panel.',
    selectedOptionLabel: 'Selected',
  },
  editor: {
    workspaceLabel: 'Castle workspace',
    canvasLabel: 'Castle preview',
    emptyCanvasHint: 'Click a part to start building.',
    canvasHint: 'Drag parts to move them. Use the outer resize point or the Size slider to resize.',
    snapLabel: 'Snap to grid',
    snapEnabledLabel: 'On · 5 px',
    snapDisabledLabel: 'Off · 5 px',
    resizeLabel: 'Allow resizing',
    resizeEnabledLabel: 'On',
    resizeDisabledLabel: 'Off',
    aspectRatioHint: 'Keep the default aspect ratio.',
    selectedPieceLabel: 'Selected castle piece',
    resizeHandleLabels: ENGLISH_RESIZE_HANDLE_LABELS,
    resizeKeyboardHint: 'Use left and right arrow keys to resize.',
    interactionError: 'Canvas interaction error',
    mobileTabLabels: {
      library: 'Parts',
      editor: 'Edit',
      settings: 'Layers / settings',
    },
    activeLayerLabel: (layerId) => `Active layer: ${ENGLISH_LAYER_LABELS[layerId]}`,
    layerLabels: ENGLISH_LAYER_LABELS,
    pieceHeading: 'Part editing',
    selectedPieceHeading: 'Part editing · Selected',
    copyLabel: 'Copy',
    deleteLabel: 'Delete',
    bringToFrontLabel: 'Bring to front',
    selectionDisabledStatus: 'Select a part to enable these actions.',
    selectionStatus: 'Selection and stacking order are independent.',
    copyNote: 'Copy: active layer · same position and size.',
    resizeHint: 'Drag the outer resize point or use the Size slider. Proportions stay the same.',
    sizeLabel: 'Size',
    sizeScaleHint: '100% = original size · proportions stay the same.',
    deleteSuccessMessage: 'Part deleted.',
  },
  settings: {
    panelHeading: 'Layers and canvas settings',
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
    panelHint: 'Background, size, and clear controls are in the expanded settings.',
    layersHeading: 'Layers · 3',
    layerVisibilityLabel: 'Show layer',
    clearLayerLabel: 'Clear active layer',
    canvasHeading: 'Canvas settings',
    backgroundImageUrlLabel: 'Background image URL',
    backgroundImageApplyLabel: 'Apply',
    backgroundColorHeading: 'Background colour',
    backgroundColorLabel: 'Choose background colour',
    canvasWidthLabel: 'Width px',
    canvasHeightLabel: 'Height px',
    applyCanvasSizeLabel: 'Apply canvas size',
    defaultCanvasSizeLabel: 'Width 0: automatic · Height 0: 635 px',
    clearAllLabel: 'Clear all',
    clearAllConfirmLabel: 'Clear all · confirmation required',
    clearAllConfirmDescription: 'Clear every part from the castle?',
    canvasCoordinatesHint: 'Canvas coordinates stay stable when the browser resizes.',
    scrollHint: 'Scroll this settings panel while keeping the canvas visible.',
  },
  saves: {
    dialogTitle: 'Browser saves and project files',
    closeLabel: 'Close',
    localHeading: 'Browser saves on this device',
    slotLabel: (slotNumber) => `Slot ${slotNumber}`,
    savedSlotStatus: (slotNumber) => `Saved to slot ${slotNumber}`,
    occupiedSlotStatus: 'Project saved',
    emptySlotStatus: 'Empty slot',
    currentSlotLabel: 'Current',
    pieceCountLabel: (pieceCount) => `${pieceCount} pieces`,
    saveLabel: 'Save',
    loadLabel: 'Load',
    loadDisabledLabel: 'Load · unavailable',
    storageNote: 'Browser saves stay on this device. Export a project file for backup or transfer.',
    overwriteTitle: 'Overwrite saved project?',
    overwriteDescription: (slotNumber) =>
      `Slot ${slotNumber} already contains a project. Saving will replace it.`,
    overwriteCancelLabel: 'Cancel',
    overwriteConfirmLabel: 'Confirm overwrite',
    saveLoadError: 'Could not save or load this project.',
  },
  projectFiles: {
    heading: 'Project files · local backup and transfer',
    description: 'Export a project file to keep a backup or move an editable castle to another device.',
    newProjectLabel: 'New project',
    exportLabel: 'Export project file',
    importLabel: 'Choose a project file and import',
    importInputLabel: 'Project file',
    invalidFileError: 'The selected file is not a valid castle project.',
    importError: 'Could not import the project file.',
  },
  png: {
    dialogTitle: 'Castle image export',
    heading: 'Download castle image',
    closeLabel: 'Close',
    previewLabel: 'Export preview',
    formatLabel: 'PNG · exported at canvas size',
    visibleLayersOnlyLabel: 'Visible layers only · selection handles excluded',
    returnLabel: 'Back to editor',
    downloadLabel: 'Download PNG',
    loadingLabel: 'Preparing PNG preview…',
    exportError: 'Could not export the castle as a PNG.',
  },
  faq: {
    eyebrow: 'USAGE HELP',
    title: 'Castle Creator FAQ',
    description: 'Answers to common questions about using Castle Creator for building, colours, layers, saving, and exports.',
    items: [
      {
        question: 'What is Castle Creator?',
        answer: 'Castle Creator is a free online tool for manually combining castle parts on a canvas to design a fantasy castle.',
      },
      {
        question: 'How do I create a castle with Castle Creator?',
        answer: 'Choose a category, click a part to add it to the active layer, then drag and arrange the pieces on the canvas.',
      },
      {
        question: 'How many parts are included?',
        answer: 'The library contains 366 parts across six categories: 94 walls, 70 battlements, 24 tower roofs, 67 buildings, 84 building roofs, and 18 gates plus 9 door pieces.',
      },
      {
        question: 'How do colours work?',
        answer: 'Walls, battlements, tower roofs, buildings, and gates use four building colours. Building roofs use five roof colours. The selected palette applies to new parts, while door pieces keep their original colours.',
      },
      {
        question: 'Can I move and resize parts in Castle Creator?',
        answer: 'Yes. Drag a part to move it, then use the outer resize point or Size control to resize it while keeping its proportions. Optional 5 px snapping and keyboard controls are also available.',
      },
      {
        question: 'How do layers work?',
        answer: 'The editor has lower, middle, and upper layers. New parts use the active layer, and each layer can be shown or hidden independently.',
      },
      {
        question: 'Where are browser saves stored?',
        answer: 'Browser saves stay in local storage on this device, with five save slots. They are not cloud saves.',
      },
      {
        question: 'Can I move a Castle Creator project to another device?',
        answer: 'Yes. Export the editable JSON project file, then import it on another device. Project files are limited to 2 MiB.',
      },
      {
        question: 'What does PNG export include?',
        answer: 'The PNG uses the current canvas size and includes visible layers only. Selection outlines and resize handles are left out.',
      },
      {
        question: 'Can I change the canvas and background?',
        answer: 'Yes. Set a background colour or an HTTP/HTTPS background image URL, and choose automatic or custom canvas dimensions. Each canvas dimension can be up to 8192 px.',
      },
    ],
  },
};

const chineseCastleCreatorCopy: CastleCreatorCopy = {
  metadata: {
    title: '免费城堡设计工具｜在线创建奇幻城堡',
    description:
      '使用城墙、塔顶、城垛、建筑、屋顶和城门拼搭奇幻城堡。将工程保存在浏览器中，并下载 PNG 用于跑团、小说或游戏世界观。',
  },
  navigationName: '城堡拼搭',
  pageTitle: '免费城堡设计工具｜在线创建奇幻城堡',
  pageDescription:
    '使用城墙、塔顶、城垛、建筑、屋顶和城门拼搭奇幻城堡。将工程保存在浏览器中，并下载 PNG 用于跑团、小说或游戏世界观。',
  heading: '免费在线城堡设计工具 制作奇幻城堡',
  description:
    '一款免费的在线城堡设计工具，可组合城墙、塔楼、屋顶和城门，设计城堡外观。支持选择配色、调整零件大小和位置，保存设计并下载 PNG 图片。',
  heroAction: '免费试用',
  about: {
    title: '什么是城堡设计工具？',
    paragraphs: [
      '城堡设计工具是一款免费的在线城堡拼搭工具，可以手动组合城墙、城垛、塔顶、建筑、建筑屋顶、城门和门件，在画布上设计奇幻城堡。',
      '这个城堡设计工具适合 D&D 跑团、小说设定、游戏世界观，以及想快速安排城堡素材的奇幻创作者。',
    ],
  },
  features: {
    title: '按你的想法拼搭城堡',
    description: '城堡设计工具提供模块化素材和直观的画布操作，方便组合城堡外观。',
    items: [
      {
        icon: 'parts',
        title: '366 个城堡零件',
        description: '城堡设计工具提供 6 类可重复使用的城堡素材，包括城门和门件。',
      },
      {
        icon: 'palette',
        title: '选择配色',
        description: '城墙、城垛、塔顶、建筑和城门可选 4 种建筑配色，建筑屋顶可选 5 种屋顶配色；在城堡设计工具中，选中的配色应用于新添加素材，门件保持原色。',
      },
      {
        icon: 'editing',
        title: '编辑每个零件',
        description: '拖动零件移动，复制、删除、置顶，或按比例调整大小，这些操作都能在这个城堡设计工具里完成。',
      },
      {
        icon: 'layers',
        title: '安排 3 个图层',
        description: '在下层、中层和上层之间安排零件，并单独控制每个图层的可见性。',
      },
      {
        icon: 'canvas',
        title: '设置画布',
        description: '选择背景颜色或 HTTP/HTTPS 图片 URL，并使用自适应或自定义画布尺寸。',
      },
      {
        icon: 'export',
        title: '保存并导出',
        description: '城堡设计工具支持保存 5 个本机浏览器存档、导出可编辑工程文件和下载可见图层的 PNG。',
      },
    ],
  },
  howItWorks: {
    title: '如何使用',
    description: '选择素材、安排图层、调整画布，然后在城堡设计工具中保存或导出城堡。',
    steps: [
      {
        title: '选择素材分类',
        description: '打开城墙、城垛、塔顶、建筑、建筑屋顶或城门和门件分类，在城堡设计工具中点击素材添加。',
      },
      {
        title: '安排零件',
        description: '在画布上拖动零件移动；每个新零件都会添加到当前活动图层。',
      },
      {
        title: '调整布局',
        description: '为新素材选择配色、切换图层、调整零件大小，并使用城堡设计工具按需设置背景或画布尺寸。',
      },
      {
        title: '保存或导出',
        description: '城堡设计工具支持保存到 5 个浏览器存档之一、导出可编辑 JSON 工程文件和下载可见图层的 PNG。',
      },
    ],
  },
  comparison: {
    title: '城堡设计工具：无需从零绘制或建模',
    description: '从 366 个现成零件开始，在城堡设计工具中拖动拼搭并导出城堡图片。下面对比三种工具制作城堡外观图的常见流程。',
    castleCreatorLabel: '城堡设计工具',
    drawingToolsLabel: '通用绘图工具',
    modelingToolsLabel: '3D 建模工具',
    dimensionLabel: '制作城堡外观图所需操作',
    rows: [
      {
        label: '素材准备',
        castleCreator: '城堡设计工具内置 6 类共 366 个城堡零件，省去寻找和绘制城堡素材的准备。',
        drawingTools: '寻找或绘制城堡元素，再将它们导入或放入画面。',
        modelingTools: '制作或导入城堡模型，再组合所需对象。',
      },
      {
        label: '创作门槛',
        castleCreator: '选择零件并拖动拼搭，无需从零绘制或建立 3D 模型。',
        drawingTools: '通常需熟悉绘图和编辑操作，创建或安排城堡元素。',
        modelingTools: '通常需熟悉建模和场景操作，创建或导入对象。',
      },
      {
        label: '布局调整',
        castleCreator: '移动、缩放、切换图层，直接调整城堡组合。',
        drawingTools: '逐项编辑图形或图像，并整理图层顺序。',
        modelingTools: '调整模型、镜头、材质和灯光，改变最终视图。',
      },
      {
        label: '成果使用',
        castleCreator: '导出 PNG 用于跑团、小说和游戏设定，保存工程以后继续编辑。',
        drawingTools: '保存绘图工程，并按工具支持的格式导出图像。',
        modelingTools: '设置镜头并渲染场景，再导出最终图像。',
      },
    ],
  },
  callToAction: {
    title: '开始使用城堡设计工具',
    description: '打开城堡设计工具，选择一个素材分类，放入第一个零件，然后在画布上开始拼搭城堡。',
    action: '开始设计城堡',
  },
  toolbar: {
    editorHeading: '城堡编辑器',
    unsavedStatus: '尚未保存',
    savedStatus: (slotNumber) => `存档 ${slotNumber} · 已保存`,
    browserSaveLabel: '浏览器存档',
    projectFileLabel: '工程文件',
    imageDownloadLabel: '下载图片',
    helpLabel: '帮助',
    quickSaveLabel: '保存',
    quickSaveActiveLabel: (slotNumber) => `保存到存档 ${slotNumber}`,
    saveSuccessMessage: (slotNumber) => `已保存到存档 ${slotNumber}`,
  },
  library: {
    heading: '素材库',
    totalCountLabel: (totalAssetCount) => `${totalAssetCount} 个零件`,
    categoryLabels: CHINESE_CATEGORY_LABELS,
    categoryCountLabel: formatChineseCategoryCount,
    categoryPanelHeading: '分类与配色',
    categoryPanelCloseLabel: '返回',
    categoryPanelReturnLabel: '返回素材',
    categorySelectLabel: '分类',
    paletteToggleLabel: '配色',
    categoryPanelSummary: (categoryCount, totalAssetCount) =>
      `${categoryCount} 类 · ${totalAssetCount} 个零件`,
    paletteHeading: (category) =>
      `${category === 'gates' ? '城门' : CHINESE_CATEGORY_LABELS[category]}配色 · ${category === 'buildingRoofs' ? 5 : 4} 色`,
    paletteColorLabel: (category, color) =>
      `${category === 'gates' ? '城门' : CHINESE_CATEGORY_LABELS[category]}配色 ${color}`,
    gatePaletteNote: '门件保持原色。',
    paletteNote: '配色应用于新添加零件。',
    assetImageAlt: (category, assetNumber) =>
      `${CHINESE_CATEGORY_LABELS[category]}零件 ${assetNumber}`,
    imageLoadError: (imagePath) => `图片加载失败：${imagePath}`,
    addAsset: '添加零件',
    addAssetLabel: '添加零件',
    repeatAssetLabel: '再次添加',
    emptyHint: '点击素材开始拼搭。',
    mobileScrollNote: '366 个零件 · 素材面板内滚动。',
    selectedOptionLabel: '已选择',
  },
  editor: {
    workspaceLabel: '城堡工作区',
    canvasLabel: '城堡预览',
    emptyCanvasHint: '点击素材开始拼搭。',
    canvasHint: '拖动零件移动；用外侧缩放点或「大小」滑杆调整大小。',
    snapLabel: '吸附到网格',
    snapEnabledLabel: '开 · 5 px',
    snapDisabledLabel: '关 · 5 px',
    resizeLabel: '允许缩放',
    resizeEnabledLabel: '开',
    resizeDisabledLabel: '关',
    aspectRatioHint: '默认保持比例。',
    selectedPieceLabel: '已选城堡组件',
    resizeHandleLabels: CHINESE_RESIZE_HANDLE_LABELS,
    resizeKeyboardHint: '使用左右方向键调整大小。',
    interactionError: '画布操作错误',
    mobileTabLabels: {
      library: '素材',
      editor: '编辑',
      settings: '图层/设置',
    },
    activeLayerLabel: (layerId) => `当前图层：${CHINESE_LAYER_LABELS[layerId]}`,
    layerLabels: CHINESE_LAYER_LABELS,
    pieceHeading: '零件编辑',
    selectedPieceHeading: '零件编辑 · 已选中',
    copyLabel: '复制',
    deleteLabel: '删除',
    bringToFrontLabel: '置顶',
    selectionDisabledStatus: '选中零件后启用这些操作。',
    selectionStatus: '选择与叠放顺序相互独立。',
    copyNote: '复制：当前图层 · 原位原尺寸。',
    resizeHint: '拖动外侧缩放点或使用「大小」滑杆，始终保持比例。',
    sizeLabel: '大小',
    sizeScaleHint: '100% = 原始大小 · 保持比例。',
    deleteSuccessMessage: '零件已删除。',
  },
  settings: {
    panelHeading: '图层与画布设置',
    expandLabel: '展开',
    collapseLabel: '收起',
    panelHint: '背景、尺寸和清空操作位于展开的设置区。',
    layersHeading: '图层 · 3 层',
    layerVisibilityLabel: '显示图层',
    clearLayerLabel: '清空当前图层',
    canvasHeading: '画布设置',
    backgroundImageUrlLabel: '背景图片 URL',
    backgroundImageApplyLabel: '应用',
    backgroundColorHeading: '背景颜色',
    backgroundColorLabel: '选择背景颜色',
    canvasWidthLabel: '宽度 px',
    canvasHeightLabel: '高度 px',
    applyCanvasSizeLabel: '应用画布尺寸',
    defaultCanvasSizeLabel: '宽 0：自适应 · 高 0：635 px',
    clearAllLabel: '清空全部',
    clearAllConfirmLabel: '清空全部 · 需要确认',
    clearAllConfirmDescription: '要清空城堡中的全部零件吗？',
    canvasCoordinatesHint: '浏览器尺寸变化时，画布坐标保持稳定。',
    scrollHint: '设置面板内滚动，同时保留画布可见。',
  },
  saves: {
    dialogTitle: '浏览器存档与工程文件',
    closeLabel: '关闭',
    localHeading: '本机浏览器存档',
    slotLabel: (slotNumber) => `存档 ${slotNumber}`,
    savedSlotStatus: (slotNumber) => `已保存到存档 ${slotNumber}`,
    occupiedSlotStatus: '已有工程',
    emptySlotStatus: '空存档',
    currentSlotLabel: '当前',
    pieceCountLabel: (pieceCount) => `${pieceCount} 个零件`,
    saveLabel: '保存',
    loadLabel: '加载',
    loadDisabledLabel: '加载 · 不可用',
    storageNote: '浏览器存档保存在本机。导出工程文件可用于备份或迁移。',
    overwriteTitle: '覆盖已有存档？',
    overwriteDescription: (slotNumber) =>
      `存档 ${slotNumber} 已有工程，保存将替换其中内容。`,
    overwriteCancelLabel: '取消',
    overwriteConfirmLabel: '确认覆盖保存',
    saveLoadError: '保存或加载工程失败。',
  },
  projectFiles: {
    heading: '工程文件 · 本地备份与迁移',
    description: '导出工程文件进行备份，或将可编辑的城堡带到另一台设备继续使用。',
    newProjectLabel: '新建工程',
    exportLabel: '导出工程文件',
    importLabel: '选择工程文件并导入',
    importInputLabel: '工程文件',
    invalidFileError: '所选文件不是有效的城堡工程。',
    importError: '导入工程文件失败。',
  },
  png: {
    dialogTitle: '城堡图片导出',
    heading: '下载城堡图片',
    closeLabel: '关闭',
    previewLabel: '导出预览',
    formatLabel: 'PNG · 按画布尺寸导出',
    visibleLayersOnlyLabel: '仅导出可见图层 · 不含选中框',
    returnLabel: '返回编辑',
    downloadLabel: '下载 PNG',
    loadingLabel: '正在准备 PNG 预览……',
    exportError: '导出城堡 PNG 失败。',
  },
  faq: {
    eyebrow: '使用帮助',
    title: '城堡拼搭 FAQ',
    description: '了解拼搭、配色、图层、存档和导出时如何使用城堡设计工具。',
    items: [
      {
        question: '什么是城堡设计工具？',
        answer: '城堡设计工具是一款免费的在线工具，可以手动组合城堡零件，在画布上设计奇幻城堡。',
      },
      {
        question: '如何使用城堡设计工具创建一座城堡？',
        answer: '选择素材分类，点击素材将它添加到当前活动图层，然后在画布上拖动和安排零件。',
      },
      {
        question: '工具中有多少素材？',
        answer: '素材库包含 366 个零件，分为 6 类：94 个城墙、70 个城垛、24 个塔顶、67 个建筑、84 个建筑屋顶，以及 18 个城门和 9 个门件。',
      },
      {
        question: '配色分别作用于哪些素材？',
        answer: '城墙、城垛、塔顶、建筑和城门使用 4 种建筑配色；建筑屋顶使用 5 种屋顶配色。选中的配色只应用于新添加的素材，门件保持原色。',
      },
      {
        question: '可以在城堡设计工具中移动和调整素材大小吗？',
        answer: '可以。拖动零件即可移动，使用外侧缩放点或「大小」控件调整，并保持原始比例。还可以开启 5 px 吸附或使用键盘控制。',
      },
      {
        question: '图层如何工作？',
        answer: '编辑器有下层、中层和上层 3 个图层。新零件使用当前活动图层，每个图层都可以单独显示或隐藏。',
      },
      {
        question: '浏览器存档保存在哪里？',
        answer: '浏览器存档保存在当前设备的本地存储中，共有 5 个存档位，不是云端存档。',
      },
      {
        question: '如何把城堡设计工具中的工程迁移到另一台设备？',
        answer: '导出可编辑的 JSON 工程文件，再在另一台设备导入。工程文件大小上限为 2 MiB。',
      },
      {
        question: 'PNG 导出包含哪些内容？',
        answer: 'PNG 按当前画布尺寸导出，仅包含可见图层，不会包含选中框和缩放手柄。',
      },
      {
        question: '可以修改画布和背景吗？',
        answer: '可以设置背景颜色或 HTTP/HTTPS 背景图片 URL，也可以选择自适应或自定义画布尺寸。画布每边最大为 8192 px。',
      },
    ],
  },
};

const CASTLE_CREATOR_COPY: Readonly<Record<CastleCreatorLocale, CastleCreatorCopy>> = {
  en: englishCastleCreatorCopy,
  zh: chineseCastleCreatorCopy,
};

function requireCastleCreatorLocale(locale: string): CastleCreatorLocale {
  if (CASTLE_CREATOR_LOCALES.includes(locale as CastleCreatorLocale)) {
    return locale as CastleCreatorLocale;
  }

  throw new Error(`Unknown castle creator locale. Received ${JSON.stringify(locale)}.`);
}

function requireCastleSaveSlotNumber(slotNumber: number): CastleSaveSlotNumber {
  if (!Number.isInteger(slotNumber) || slotNumber < 1 || slotNumber > 5) {
    throw new Error(
      `Castle creator save slot must be an integer from 1 to 5. Received ${slotNumber}.`,
    );
  }

  return slotNumber as CastleSaveSlotNumber;
}

export function getCastleCreatorCopy(locale: string): CastleCreatorCopy {
  return getI18nDictionary(
    requireCastleCreatorLocale(locale),
    CASTLE_CREATOR_COPY,
    'castle creator',
  );
}

export function getCastleCreatorCategoryLabel(
  locale: string,
  category: CastleCategory,
): string {
  const copy = getCastleCreatorCopy(locale);
  const categoryLabel = copy.library.categoryLabels[category];

  if (typeof categoryLabel !== 'string' || categoryLabel.trim().length === 0) {
    throw new Error(
      `Castle creator category label is missing for ${JSON.stringify(category)} in locale ${JSON.stringify(locale)}.`,
    );
  }

  return categoryLabel;
}

export function getCastleCreatorLayerLabel(locale: string, layerId: CastleLayerId): string {
  const copy = getCastleCreatorCopy(locale);
  const layerLabel = copy.editor.layerLabels[layerId];

  if (typeof layerLabel !== 'string' || layerLabel.trim().length === 0) {
    throw new Error(
      `Castle creator layer label is missing for ${JSON.stringify(layerId)} in locale ${JSON.stringify(locale)}.`,
    );
  }

  return layerLabel;
}

export function getCastleCreatorSaveSlotLabel(locale: string, slotNumber: number): string {
  return getCastleCreatorCopy(locale).saves.slotLabel(requireCastleSaveSlotNumber(slotNumber));
}

export function getCastleCreatorTotalAssetCountLabel(locale: string): string {
  return getCastleCreatorCopy(locale).library.totalCountLabel(CASTLE_CREATOR_TOTAL_ASSET_COUNT);
}
