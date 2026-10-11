import type { SiteLocale } from '@/lib/site-locale';
import type { MapMakerAsset, MapMakerAssetCategory } from '@/lib/map-maker';

type MapMakerSemanticAssetCategory = Exclude<MapMakerAssetCategory, 'coastline'>;
type MapMakerAssetNameTranslations = Readonly<
  Record<MapMakerSemanticAssetCategory, Readonly<Record<string, string>>>
>;

export type MapMakerWorkspaceCopy = {
  readonly title: string;
  readonly actions: {
    readonly help: string;
    readonly randomGenerate: string;
    readonly mapSize: string;
    readonly resetAndClear: string;
    readonly saveAndLoad: string;
    readonly exportImage: string;
  };
  readonly mapDimensions: {
    readonly width: string;
    readonly height: string;
    readonly gridUnit: string;
  };
  readonly materials: {
    readonly title: string;
    readonly tilesTab: string;
    readonly elementsTab: string;
    readonly tileShapes: {
      readonly convex: string;
      readonly concave: string;
      readonly side: string;
    };
    readonly tileDirections: {
      readonly upperLeft: string;
      readonly upperRight: string;
      readonly lowerLeft: string;
      readonly lowerRight: string;
      readonly top: string;
      readonly right: string;
      readonly bottom: string;
      readonly left: string;
    };
    readonly land: string;
    readonly water: string;
    readonly elementCategories: readonly {
      readonly id: Exclude<MapMakerAssetCategory, 'coastline'>;
      readonly label: string;
      readonly count: number;
    }[];
    readonly assetNames: MapMakerAssetNameTranslations;
    readonly placementMode: {
      readonly title: string;
      readonly replaceBase: string;
      readonly freePlace: string;
      readonly targetLayer: string;
    };
    readonly showMoreAssets: string;
    readonly usageHint: string;
  };
  readonly canvas: {
    readonly mapPreviewAlt: string;
    readonly selectedBaseTiles: string;
    readonly selectedElements: string;
    readonly selectedLabels: string;
    readonly addLabel: string;
    readonly multiSelect: string;
    readonly clearSelection: string;
    readonly editLabel: string;
    readonly finishLabelEdit: string;
    readonly rotate90: string;
    readonly rotate180: string;
    readonly rotate270: string;
    readonly mirror: string;
    readonly restore: string;
    readonly transformSelection: string;
    readonly baseTileHint: string;
    readonly elementDragHint: string;
    readonly labelEditHint: string;
  };
  readonly layers: {
    readonly title: string;
    readonly collapsePanel: string;
    readonly expandPanel: string;
    readonly editHint: string;
    readonly baseMap: string;
    readonly elementLayerOne: string;
    readonly elementLayerTwo: string;
    readonly labels: string;
    readonly editingSuffix: string;
    readonly visibilityTitle: string;
    readonly showElements: string;
    readonly showLabels: string;
    readonly selectedObject: string;
    readonly emptySelection: string;
    readonly selectedBaseTileCount: string;
    readonly selectedElementCount: string;
    readonly selectedLabelCount: string;
    readonly deselectHint: string;
    readonly clearLayerOne: string;
    readonly clearLayerTwo: string;
  };
  readonly properties: {
    readonly title: string;
    readonly customImageUrl: string;
    readonly imageUrlPlaceholder: string;
    readonly applyCustomImage: string;
    readonly customImageTargetHint: string;
    readonly restoreWater: string;
    readonly allowResize: string;
    readonly preventResize: string;
    readonly deleteSelectedElement: string;
    readonly labelText: string;
    readonly labelTextPlaceholder: string;
    readonly labelBorder: string;
    readonly deleteSelectedLabel: string;
    readonly multiLabelSelection: string;
    readonly bulkDeleteLabels: string;
    readonly clearAllLabels: string;
    readonly mobileOpenProperties: string;
  };
  readonly view: {
    readonly title: string;
    readonly squareGrid: string;
    readonly hexGrid: string;
    readonly hexSize: string;
    readonly hexRange: string;
    readonly elementSnap: string;
  };
  readonly save: {
    readonly title: string;
    readonly browserSlotsTitle: string;
    readonly slotNumber: string;
    readonly slotSaved: string;
    readonly slotEmpty: string;
    readonly saveToSlot: string;
    readonly loadFromSlot: string;
    readonly loadWarning: string;
    readonly projectFileTitle: string;
    readonly projectFileDescription: string;
    readonly downloadProjectFile: string;
    readonly chooseProjectFile: string;
    readonly loadProjectFile: string;
    readonly noProjectFileSelected: string;
    readonly selectedProjectFile: string;
  };
  readonly export: {
    readonly title: string;
    readonly previewAlt: string;
    readonly contentScope: string;
    readonly excludedContent: string;
    readonly downloadImage: string;
    readonly autoPreviewNotice: string;
  };
  readonly size: {
    readonly title: string;
    readonly width: string;
    readonly height: string;
    readonly gridUnit: string;
    readonly minimumWidth: number;
    readonly maximumWidth: number;
    readonly minimumHeight: number;
    readonly maximumHeight: number;
    readonly resizeWarning: string;
    readonly resetAndClearTitle: string;
    readonly resetMap: string;
    readonly clearLayerOne: string;
    readonly clearLayerTwo: string;
    readonly clearAllLabels: string;
    readonly resetSummary: string;
    readonly cancel: string;
    readonly applySize: string;
  };
  readonly help: {
    readonly title: string;
    readonly steps: readonly {
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly common: {
    readonly errorLabel: string;
    readonly close: string;
    readonly cancel: string;
    readonly apply: string;
    readonly back: string;
    readonly more: string;
    readonly enabled: string;
    readonly disabled: string;
  };
  readonly status: {
    readonly mapGenerated: string;
    readonly mapReset: string;
    readonly elementsCleared: string;
    readonly labelAdded: string;
    readonly imageApplied: string;
    readonly projectFileDownloaded: string;
    readonly projectFileLoaded: string;
    readonly saveSlotSaved: string;
    readonly saveSlotLoaded: string;
    readonly imageDownloaded: string;
  };
};

export type MapMakerCopy = {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly navigationTitle: string;
  readonly heading: string;
  readonly heroAction: string;
  readonly workspace: MapMakerWorkspaceCopy;
};

const englishAssetNames: MapMakerAssetNameTranslations = {
  geography: {
    Cave: 'Cave',
    Caves: 'Caves',
    Cliff: 'Cliff',
    Field: 'Field',
    Forest: 'Forest',
    Hills: 'Hills',
    Land: 'Land',
    Mesa: 'Mesa',
    Mountain: 'Mountain',
    Mountains: 'Mountains',
    Ravine: 'Ravine',
  },
  structures: {
    Birdthing: 'Birdthing',
    Cacti: 'Cacti',
    Cactus: 'Cactus',
    Castle: 'Castle',
    'Castle Ruin': 'Castle Ruin',
    Cross: 'Cross',
    Dragon: 'Dragon',
    Elemental: 'Elemental',
    Flag: 'Flag',
    Gargoyle: 'Gargoyle',
    Gate: 'Gate',
    Golem: 'Golem',
    Hellhound: 'Hellhound',
    House: 'House',
    Houses: 'Houses',
    Lighthouse: 'Lighthouse',
    Phoenix: 'Phoenix',
    'Pillar ': 'Pillar',
    'Pillar Ruin': 'Pillar Ruin',
    Pyramid: 'Pyramid',
    Sign: 'Sign',
    Spider: 'Spider',
    Temple: 'Temple',
    'Temple Ruin': 'Temple Ruin',
    Tower: 'Tower',
    'Tower Ruin': 'Tower Ruin',
    Tree: 'Tree',
    Trees: 'Trees',
    Unicorn: 'Unicorn',
    Village: 'Village',
    Wendigo: 'Wendigo',
    'World Tree': 'World Tree',
  },
  water: {
    Boat: 'Boat',
    Compass: 'Compass',
    Crab: 'Crab',
    Cross: 'Cross',
    Eel: 'Eel',
    Fish: 'Fish',
    Island: 'Island',
    Jellyfish: 'Jellyfish',
    Lake: 'Lake',
    Mermaid: 'Mermaid',
    Monster: 'Monster',
    Octopus: 'Octopus',
    River: 'River',
    Sailfish: 'Sailfish',
    Serpent: 'Serpent',
    Shark: 'Shark',
    Ship: 'Ship',
    Skull: 'Skull',
    Water: 'Water',
    Whirpool: 'Whirpool',
    Wreck: 'Wreck',
  },
};

const chineseAssetNames: MapMakerAssetNameTranslations = {
  geography: {
    Cave: '洞穴',
    Caves: '洞穴群',
    Cliff: '峭壁',
    Field: '原野',
    Forest: '森林',
    Hills: '丘陵',
    Land: '陆地',
    Mesa: '桌状山',
    Mountain: '山',
    Mountains: '山脉',
    Ravine: '峡谷',
  },
  structures: {
    Birdthing: '鸟形生物',
    Cacti: '仙人掌群',
    Cactus: '仙人掌',
    Castle: '城堡',
    'Castle Ruin': '城堡遗迹',
    Cross: '十字架',
    Dragon: '龙',
    Elemental: '元素生物',
    Flag: '旗帜',
    Gargoyle: '石像鬼',
    Gate: '城门',
    Golem: '魔像',
    Hellhound: '地狱犬',
    House: '房屋',
    Houses: '房屋群',
    Lighthouse: '灯塔',
    Phoenix: '凤凰',
    'Pillar ': '石柱',
    'Pillar Ruin': '石柱遗迹',
    Pyramid: '金字塔',
    Sign: '路牌',
    Spider: '蜘蛛',
    Temple: '神殿',
    'Temple Ruin': '神殿遗迹',
    Tower: '塔楼',
    'Tower Ruin': '塔楼遗迹',
    Tree: '树',
    Trees: '树木群',
    Unicorn: '独角兽',
    Village: '村庄',
    Wendigo: '温迪戈',
    'World Tree': '世界树',
  },
  water: {
    Boat: '小船',
    Compass: '罗盘',
    Crab: '螃蟹',
    Cross: '十字标记',
    Eel: '鳗鱼',
    Fish: '鱼',
    Island: '岛屿',
    Jellyfish: '水母',
    Lake: '湖泊',
    Mermaid: '人鱼',
    Monster: '海怪',
    Octopus: '章鱼',
    River: '河流',
    Sailfish: '旗鱼',
    Serpent: '海蛇',
    Shark: '鲨鱼',
    Ship: '帆船',
    Skull: '骷髅',
    Water: '水域',
    Whirpool: '漩涡',
    Wreck: '沉船',
  },
};

const englishCopy: MapMakerCopy = {
  pageTitle: 'Map Maker – Free Online Fantasy Map Creator',
  pageDescription:
    'Use this free online map maker to create fantasy and D&D maps. Arrange coastlines, mountains and forests, add place names, save projects and download map images.',
  navigationTitle: 'Fantasy World Map Maker',
  heading: 'Map Maker',
  heroAction: 'Start building your map',
  workspace: {
    title: 'Map workspace',
    actions: {
      help: 'How to use',
      randomGenerate: 'Generate random map',
      mapSize: 'Map size',
      resetAndClear: 'Reset / Clear',
      saveAndLoad: 'Save and Load',
      exportImage: 'Export image',
    },
    mapDimensions: { width: 'Width', height: 'Height', gridUnit: 'tiles' },
    materials: {
      title: 'Asset library',
      tilesTab: 'Tiles',
      elementsTab: 'Elements',
      tileShapes: { convex: 'Convex corner', concave: 'Concave corner', side: 'Coast side' },
      tileDirections: {
        upperLeft: 'Upper left',
        upperRight: 'Upper right',
        lowerLeft: 'Lower left',
        lowerRight: 'Lower right',
        top: 'Top',
        right: 'Right',
        bottom: 'Bottom',
        left: 'Left',
      },
      land: 'Land',
      water: 'Water',
      elementCategories: [
        { id: 'geography', label: 'Natural features', count: 97 },
        { id: 'structures', label: 'Buildings and plants', count: 94 },
        { id: 'water', label: 'Water and ships', count: 70 },
      ],
      assetNames: englishAssetNames,
      placementMode: {
        title: 'Placement mode',
        replaceBase: 'Replace base tile',
        freePlace: 'Place freely',
        targetLayer: 'Target element layer',
      },
      showMoreAssets: 'Scroll to see more assets',
      usageHint: 'Select a base tile before replacing it, or choose an element to place on the active layer.',
    },
    canvas: {
      mapPreviewAlt: 'Fantasy map canvas',
      selectedBaseTiles: 'Selected base tiles',
      selectedElements: 'Selected elements',
      selectedLabels: 'Selected labels',
      addLabel: 'Add label',
      multiSelect: 'Multi-select',
      clearSelection: 'Clear selection',
      editLabel: 'Edit label on map',
      finishLabelEdit: 'Finish label editing',
      rotate90: 'Rotate 90°',
      rotate180: 'Rotate 180°',
      rotate270: 'Rotate 270°',
      mirror: 'Mirror',
      restore: 'Restore',
      transformSelection: 'Apply transform to all selected items',
      baseTileHint: 'Select map tiles, then choose a tile to replace them.',
      elementDragHint: 'Drag a selected element to move it.',
      labelEditHint: 'Edit a label on the map or adjust it in the properties panel.',
    },
    layers: {
      title: 'Edit target and visibility',
      collapsePanel: 'Collapse sidebar',
      expandPanel: 'Expand sidebar',
      editHint: 'Choose an edit target without hiding other content.',
      baseMap: 'Base map',
      elementLayerOne: 'Element layer 1',
      elementLayerTwo: 'Element layer 2',
      labels: 'Labels',
      editingSuffix: 'Editing',
      visibilityTitle: 'Map visibility',
      showElements: 'Show elements',
      showLabels: 'Show labels',
      selectedObject: 'Selected item',
      emptySelection: 'Nothing selected',
      selectedBaseTileCount: 'Selected map tiles',
      selectedElementCount: 'Selected elements',
      selectedLabelCount: 'Selected labels',
      deselectHint: 'Select again to clear the selection.',
      clearLayerOne: 'Clear layer 1',
      clearLayerTwo: 'Clear layer 2',
    },
    properties: {
      title: 'Properties',
      customImageUrl: 'Custom image URL',
      imageUrlPlaceholder: 'https://…',
      applyCustomImage: 'Apply custom image',
      customImageTargetHint: 'Applies to the selected map tiles or one selected free element.',
      restoreWater: 'Restore selected tiles to water',
      allowResize: 'Allow resizing',
      preventResize: 'Prevent resizing',
      deleteSelectedElement: 'Delete selected element',
      labelText: 'Label text',
      labelTextPlaceholder: 'Enter a place name',
      labelBorder: 'Label border',
      deleteSelectedLabel: 'Delete selected labels',
      multiLabelSelection: 'Multiple labels selected',
      bulkDeleteLabels: 'Delete selected labels',
      clearAllLabels: 'Clear all labels',
      mobileOpenProperties: 'Open properties',
    },
    view: {
      title: 'Grid and snapping',
      squareGrid: 'Square grid',
      hexGrid: 'Hex grid',
      hexSize: 'Hex size',
      hexRange: 'Range 1–15 · step 0.1 · unit %',
      elementSnap: 'Snap elements',
    },
    save: {
      title: 'Save and Load',
      browserSlotsTitle: 'Saved in this browser · 8 slots',
      slotNumber: 'Slot',
      slotSaved: 'Saved',
      slotEmpty: 'Empty slot',
      saveToSlot: 'Save',
      loadFromSlot: 'Load',
      loadWarning: 'Check the map size before loading. Loading replaces the current map.',
      projectFileTitle: 'Map project file',
      projectFileDescription: 'Use a project file to back up or move your map.',
      downloadProjectFile: 'Download project file',
      chooseProjectFile: 'Choose project file',
      loadProjectFile: 'Load file',
      noProjectFileSelected: 'No file selected',
      selectedProjectFile: 'Selected file',
    },
    export: {
      title: 'Export map image',
      previewAlt: 'Map image preview',
      contentScope: 'Image includes the base map and visible, freely placed elements.',
      excludedContent: 'Text labels and grid overlays are not included in the image.',
      downloadImage: 'Download image',
      autoPreviewNotice: 'The preview opens automatically. Download creates the latest map image.',
    },
    size: {
      title: 'Map size and clear options',
      width: 'Width',
      height: 'Height',
      gridUnit: 'tiles',
      minimumWidth: 6,
      maximumWidth: 35,
      minimumHeight: 2,
      maximumHeight: 35,
      resizeWarning: 'Changing the size rebuilds the base map, clears both element layers, and fits labels to the new bounds. Save a copy first.',
      resetAndClearTitle: 'Reset or clear content',
      resetMap: 'Reset map',
      clearLayerOne: 'Clear element layer 1',
      clearLayerTwo: 'Clear element layer 2',
      clearAllLabels: 'Clear all labels',
      resetSummary: 'Resetting the map restores the base tiles and clears both element layers and labels.',
      cancel: 'Cancel',
      applySize: 'Apply size',
    },
    help: {
      title: 'How to use the map maker',
      steps: [
        { title: 'Shape the coastline', description: 'Place coast tiles, then select and replace individual tiles or a group.' },
        { title: 'Add map features', description: 'Choose a natural, building, plant, water, or ship asset and place it on an element layer.' },
        { title: 'Name places', description: 'Add labels on the map, edit their text, and move them into place.' },
        { title: 'Save or export', description: 'Use a browser slot or project file to keep editing. An image includes the base map and currently visible, freely placed elements; text labels and grid overlays are excluded.' },
      ],
    },
    common: {
      errorLabel: 'Error',
      close: 'Close',
      cancel: 'Cancel',
      apply: 'Apply',
      back: 'Back',
      more: 'More',
      enabled: 'On',
      disabled: 'Off',
    },
    status: {
      mapGenerated: 'A new map is ready.',
      mapReset: 'The map and its layers were reset.',
      elementsCleared: 'The selected element layer was cleared.',
      labelAdded: 'A label was added to the map.',
      imageApplied: 'The image was applied to the selected items.',
      projectFileDownloaded: 'The project file was downloaded.',
      projectFileLoaded: 'The project file was loaded.',
      saveSlotSaved: 'The map was saved to this browser slot.',
      saveSlotLoaded: 'The map was loaded from this browser slot.',
      imageDownloaded: 'The map image was downloaded.',
    },
  },
};

const chineseCopy: MapMakerCopy = {
  pageTitle: '地图制作器｜免费在线制作奇幻与冒险地图',
  pageDescription: '免费在线地图制作器，适合制作奇幻世界、D&D 和桌面角色扮演游戏地图。拼接海岸与陆地，添加山脉、森林和地点名称，保存工程并下载地图图片。',
  navigationTitle: '奇幻世界地图制作器',
  heading: '地图制作器',
  heroAction: '开始绘制地图',
  workspace: {
    title: '地图工作区',
    actions: {
      help: '使用说明',
      randomGenerate: '随机生成',
      mapSize: '地图尺寸',
      resetAndClear: '重置 / 清空',
      saveAndLoad: '保存与载入',
      exportImage: '导出图片',
    },
    mapDimensions: { width: '宽度', height: '高度', gridUnit: '格' },
    materials: {
      title: '素材库',
      tilesTab: '拼块',
      elementsTab: '元素',
      tileShapes: { convex: '外凸角', concave: '内凹角', side: '侧边' },
      tileDirections: {
        upperLeft: '左上',
        upperRight: '右上',
        lowerLeft: '左下',
        lowerRight: '右下',
        top: '上',
        right: '右',
        bottom: '下',
        left: '左',
      },
      land: '陆地',
      water: '水面',
      elementCategories: [
        { id: 'geography', label: '自然地理', count: 97 },
        { id: 'structures', label: '建筑与植被', count: 94 },
        { id: 'water', label: '水域与航海', count: 70 },
      ],
      assetNames: chineseAssetNames,
      placementMode: {
        title: '放置方式',
        replaceBase: '替换底图',
        freePlace: '自由放置',
        targetLayer: '自由放置目标图层',
      },
      showMoreAssets: '继续滚动浏览全部素材',
      usageHint: '选中底图格子后可替换；选择元素后会放置到当前元素层。',
    },
    canvas: {
      mapPreviewAlt: '奇幻世界地图画布',
      selectedBaseTiles: '已选底图格子',
      selectedElements: '已选元素',
      selectedLabels: '已选文字标签',
      addLabel: '添加文字',
      multiSelect: '多选模式',
      clearSelection: '取消选择',
      editLabel: '在地图上编辑文字',
      finishLabelEdit: '完成文字编辑',
      rotate90: '旋转 90°',
      rotate180: '旋转 180°',
      rotate270: '旋转 270°',
      mirror: '镜像',
      restore: '复原',
      transformSelection: '变换应用到所有选中对象',
      baseTileHint: '先多选地图格子，再选择拼块进行替换。',
      elementDragHint: '拖动选中的元素即可调整位置。',
      labelEditHint: '可直接编辑地图上的文字，并在属性面板中调整。',
    },
    layers: {
      title: '编辑对象与显隐',
      collapsePanel: '收起侧栏',
      expandPanel: '展开侧栏',
      editHint: '切换编辑目标时无需隐藏其他内容。',
      baseMap: '底图',
      elementLayerOne: '元素层 1',
      elementLayerTwo: '元素层 2',
      labels: '文字',
      editingSuffix: '正在编辑',
      visibilityTitle: '地图显示',
      showElements: '显示元素',
      showLabels: '显示文字',
      selectedObject: '选中对象',
      emptySelection: '未选中对象',
      selectedBaseTileCount: '已选底图格子',
      selectedElementCount: '已选元素',
      selectedLabelCount: '已选文字',
      deselectHint: '再次点击可取消选中。',
      clearLayerOne: '清空层 1',
      clearLayerTwo: '清空层 2',
    },
    properties: {
      title: '属性',
      customImageUrl: '自定义图片链接',
      imageUrlPlaceholder: 'https://…',
      applyCustomImage: '应用自定义图片',
      customImageTargetHint: '可应用到所选地图格，或一个已选中的自由元素。',
      restoreWater: '选中格子恢复水面',
      allowResize: '允许缩放',
      preventResize: '禁止缩放',
      deleteSelectedElement: '删除选中元素',
      labelText: '文字内容',
      labelTextPlaceholder: '输入地点名称',
      labelBorder: '文字边框',
      deleteSelectedLabel: '删除选中文字',
      multiLabelSelection: '已多选文字',
      bulkDeleteLabels: '批量删除选中文字',
      clearAllLabels: '清空全部文字',
      mobileOpenProperties: '打开属性',
    },
    view: {
      title: '网格与吸附',
      squareGrid: '方格线',
      hexGrid: '六边形',
      hexSize: '六边形大小',
      hexRange: '范围 1–15 · 步长 0.1 · 单位 %',
      elementSnap: '元素吸附',
    },
    save: {
      title: '保存与载入',
      browserSlotsTitle: '保存在此浏览器 · 8 个位置',
      slotNumber: '位置',
      slotSaved: '已保存',
      slotEmpty: '空位置',
      saveToSlot: '保存',
      loadFromSlot: '载入',
      loadWarning: '载入前先核对地图尺寸；载入会替换当前内容。',
      projectFileTitle: '地图工程文件',
      projectFileDescription: '使用工程文件备份地图或转移到其他设备。',
      downloadProjectFile: '下载工程文件',
      chooseProjectFile: '选择工程文件',
      loadProjectFile: '载入文件',
      noProjectFileSelected: '未选择文件',
      selectedProjectFile: '已选文件',
    },
    export: {
      title: '导出地图图片',
      previewAlt: '地图图片预览',
      contentScope: '图片包含底图与当前显示的自由放置元素。',
      excludedContent: '图片不包含文字标签与网格覆盖层。',
      downloadImage: '下载图片',
      autoPreviewNotice: '打开后自动预览；下载时生成最新地图图片。',
    },
    size: {
      title: '地图尺寸与清空选项',
      width: '宽度',
      height: '高度',
      gridUnit: '格',
      minimumWidth: 6,
      maximumWidth: 35,
      minimumHeight: 2,
      maximumHeight: 35,
      resizeWarning: '更改尺寸会重建底图、清空两个元素层，并将文字调整到新地图范围内。请先保存副本。',
      resetAndClearTitle: '重置或清空内容',
      resetMap: '重置地图',
      clearLayerOne: '清空元素层 1',
      clearLayerTwo: '清空元素层 2',
      clearAllLabels: '清空全部文字',
      resetSummary: '重置地图会恢复底图拼块，并清空两个元素层和文字。',
      cancel: '取消',
      applySize: '应用尺寸',
    },
    help: {
      title: '地图制作说明',
      steps: [
        { title: '拼出海岸线', description: '放置海岸拼块，再选择单个格子或多个格子进行替换。' },
        { title: '添加地图元素', description: '选择自然地理、建筑、植被、水域或航海素材，放到元素层。' },
        { title: '标注地点', description: '在地图上添加文字，编辑内容并拖动到合适位置。' },
        { title: '保存或导出', description: '使用浏览器存档或工程文件继续编辑；图片包含底图和当前显示的自由放置元素，不包含文字标签与网格覆盖层。' },
      ],
    },
    common: {
      errorLabel: '错误',
      close: '关闭',
      cancel: '取消',
      apply: '应用',
      back: '返回',
      more: '更多',
      enabled: '开',
      disabled: '关',
    },
    status: {
      mapGenerated: '已生成新地图。',
      mapReset: '地图和图层已重置。',
      elementsCleared: '元素层已清空。',
      labelAdded: '已在地图上添加文字。',
      imageApplied: '已将图片应用到所选内容。',
      projectFileDownloaded: '已下载工程文件。',
      projectFileLoaded: '已载入工程文件。',
      saveSlotSaved: '地图已保存到此浏览器位置。',
      saveSlotLoaded: '已从此浏览器位置载入地图。',
      imageDownloaded: '已下载地图图片。',
    },
  },
};

export function getMapMakerCopy(locale: SiteLocale): MapMakerCopy {
  if (locale === 'en') {
    return englishCopy;
  }

  if (locale === 'zh') {
    return chineseCopy;
  }

  throw new Error(`Unknown map maker locale: ${JSON.stringify(locale)}.`);
}

export function getMapMakerAssetDisplayName(copy: MapMakerWorkspaceCopy, asset: MapMakerAsset): string {
  if (asset.category === 'coastline') {
    return asset.id;
  }

  const categoryNames = copy.materials.assetNames[asset.category];
  if (categoryNames === undefined) {
    throw new Error(
      `Unknown map maker asset category ${JSON.stringify(asset.category)} for asset ${JSON.stringify(asset.id)}.`,
    );
  }

  const displayName = categoryNames[asset.name];
  if (displayName === undefined) {
    throw new Error(
      `Unknown map maker asset name ${JSON.stringify(asset.name)} in category ${JSON.stringify(asset.category)} for asset ${JSON.stringify(asset.id)}.`,
    );
  }

  return displayName;
}
