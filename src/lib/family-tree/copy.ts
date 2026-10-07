import type { SiteLocale } from '@/lib/site-locale';

export interface FamilyTreeCategoryNames {
  readonly faces: string;
  readonly hair: string;
  readonly ears: string;
  readonly eyes: string;
  readonly eyebrows: string;
  readonly noses: string;
  readonly mouths: string;
  readonly extras: string;
}

export interface FamilyTreeColorNames {
  readonly skinColor: string;
  readonly hairColor: string;
  readonly eyeColor: string;
  readonly eyebrowColor: string;
  readonly moustacheColor: string;
}

export interface FamilyTreeDirectionNames {
  readonly top: string;
  readonly bottom: string;
  readonly left: string;
  readonly right: string;
}

export interface FamilyTreeEndpointStyleNames {
  readonly none: string;
  readonly solid: string;
  readonly dashed: string;
}

export interface FamilyTreeGenerationNames {
  readonly generation1: string;
  readonly generation2: string;
  readonly generation3: string;
  readonly generation4: string;
}

export interface FamilyTreeConnectionGapNames {
  readonly generation1To2: string;
  readonly generation2To3: string;
  readonly generation3To4: string;
}

export interface FamilyTreeSaveSlotNames {
  readonly slot1: string;
  readonly slot2: string;
  readonly slot3: string;
  readonly slot4: string;
  readonly slot5: string;
}

export interface FamilyTreePartGroupNames {
  readonly faces: string;
  readonly beards: string;
  readonly hair: string;
  readonly ears: string;
  readonly eyes: string;
  readonly eyebrows: string;
  readonly noses: string;
  readonly moustaches: string;
  readonly mouths: string;
  readonly faceWrinkles: string;
  readonly eyeWrinkles: string;
  readonly scars: string;
}

export interface FamilyTreeCopy {
  readonly navigationName: string;
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly heading: string;
  readonly heroAction: string;
  readonly workspaceLabel: string;
  readonly personEditor: string;
  readonly familyCanvas: string;
  readonly canvasHint: string;
  readonly newPerson: string;
  readonly selectedPerson: string;
  readonly name: string;
  readonly age: string;
  readonly description: string;
  readonly namePlaceholder: string;
  readonly agePlaceholder: string;
  readonly descriptionPlaceholder: string;
  readonly randomAvatar: string;
  readonly avatarHelp: string;
  readonly noHair: string;
  readonly resetWrinkles: string;
  readonly scarsHint: string;
  readonly wrinklesHint: string;
  readonly placement: string;
  readonly addPerson: string;
  readonly deletePerson: string;
  readonly connectionEditor: string;
  readonly endpointHint: string;
  readonly addConnection: string;
  readonly clearConnections: string;
  readonly resizeEnabled: string;
  readonly resizeDisabled: string;
  readonly dragConnectionHint: string;
  readonly saveLoad: string;
  readonly localFile: string;
  readonly saveFile: string;
  readonly chooseFile: string;
  readonly loadFile: string;
  readonly noFile: string;
  readonly loadReplacesHint: string;
  readonly save: string;
  readonly load: string;
  readonly emptySlot: string;
  readonly savedSlot: string;
  readonly generateImage: string;
  readonly imagePreview: string;
  readonly regenerateImage: string;
  readonly saveImage: string;
  readonly imageHelp: string;
  readonly transparentBackground: string;
  readonly whiteBackground: string;
  readonly done: string;
  readonly close: string;
  readonly editPerson: string;
  readonly editConnections: string;
  readonly storageAndExport: string;
  readonly loading: string;
  readonly unnamedPerson: string;
  readonly errorStorage: string;
  readonly errorFile: string;
  readonly errorImage: string;
  readonly personAdded: string;
  readonly slotSaved: string;
  readonly slotLoaded: string;
  readonly fileLoaded: string;
  readonly categoryNames: FamilyTreeCategoryNames;
  readonly colorNames: FamilyTreeColorNames;
  readonly directions: FamilyTreeDirectionNames;
  readonly endpointStyles: FamilyTreeEndpointStyleNames;
  readonly generations: FamilyTreeGenerationNames;
  readonly connectionGaps: FamilyTreeConnectionGapNames;
  readonly saveSlots: FamilyTreeSaveSlotNames;
  readonly partGroupNames: FamilyTreePartGroupNames;
}

const englishFamilyTreeCopy: FamilyTreeCopy = {
  navigationName: 'Family Tree Creator',
  pageTitle: 'Fantasy Family Tree Maker – Create Family Trees for Free',
  pageDescription:
    'Create fantasy family trees for novels, worldbuilding, and D&D campaigns. Customize character portraits, add character details, and connect generations.',
  heading: 'Fantasy Family Tree Maker – Create Family Trees for Free',
  heroAction: 'Create a Family Tree for Free',
  workspaceLabel: 'Family tree workspace',
  personEditor: 'Person editor',
  familyCanvas: 'Family tree canvas',
  canvasHint: 'Click a person to edit; drag people horizontally within the same generation.',
  newPerson: 'New person',
  selectedPerson: 'Selected person',
  name: 'Name',
  age: 'Age',
  description: 'Description',
  namePlaceholder: 'Character name',
  agePlaceholder: 'Age or life span',
  descriptionPlaceholder: 'Role, history, or notes',
  randomAvatar: 'Random avatar',
  avatarHelp: 'Choose a part to apply it to the current person.',
  noHair: 'No hair',
  resetWrinkles: 'Reset face and eye wrinkles',
  scarsHint: 'Scars can be selected and stacked independently.',
  wrinklesHint: 'Face and eye wrinkles can be combined.',
  placement: 'Place in',
  addPerson: 'Add person',
  deletePerson: 'Delete person',
  connectionEditor: 'Connection editor',
  endpointHint: 'Set each endpoint to none, solid, or dashed.',
  addConnection: 'Add connection',
  clearConnections: 'Clear all generation connections',
  resizeEnabled: 'Resize enabled',
  resizeDisabled: 'Resize disabled',
  dragConnectionHint: 'Drag a connection or its handles to move and resize it.',
  saveLoad: 'Save and load',
  localFile: 'Local file',
  saveFile: 'Save family tree file',
  chooseFile: 'Choose file',
  loadFile: 'Load file',
  noFile: 'No file selected',
  loadReplacesHint: 'Loading replaces the current canvas and restores people, positions, and connections.',
  save: 'Save',
  load: 'Load',
  emptySlot: 'Empty slot',
  savedSlot: 'Saved',
  generateImage: 'Generate image',
  imagePreview: 'Family tree image preview',
  regenerateImage: 'Regenerate image',
  saveImage: 'Save image',
  imageHelp:
    'Generate a complete preview with avatars, names, and generation connections. The background is transparent by default; choose a white background when needed.',
  transparentBackground: 'Transparent background',
  whiteBackground: 'White background',
  done: 'Done',
  close: 'Close',
  editPerson: 'Edit person',
  editConnections: 'Edit connections',
  storageAndExport: 'Save and export',
  loading: 'Loading',
  unnamedPerson: 'Unnamed person',
  errorStorage: 'The browser save could not be read or written.',
  errorFile: 'The selected family tree file could not be loaded.',
  errorImage: 'The family tree image could not be generated or saved.',
  personAdded: 'Person added.',
  slotSaved: 'Slot saved.',
  slotLoaded: 'Slot loaded.',
  fileLoaded: 'Family tree file loaded.',
  categoryNames: {
    faces: 'Faces',
    hair: 'Hair',
    ears: 'Ears',
    eyes: 'Eyes',
    eyebrows: 'Eyebrows',
    noses: 'Noses',
    mouths: 'Mouths',
    extras: 'Extras',
  },
  colorNames: {
    skinColor: 'Skin color',
    hairColor: 'Hair color',
    eyeColor: 'Eye color',
    eyebrowColor: 'Eyebrow color',
    moustacheColor: 'Moustache color',
  },
  directions: {
    top: 'Top',
    bottom: 'Bottom',
    left: 'Left',
    right: 'Right',
  },
  endpointStyles: {
    none: 'None',
    solid: 'Solid',
    dashed: 'Dashed',
  },
  generations: {
    generation1: 'Generation 1',
    generation2: 'Generation 2',
    generation3: 'Generation 3',
    generation4: 'Generation 4',
  },
  connectionGaps: {
    generation1To2: 'Generation 1–2',
    generation2To3: 'Generation 2–3',
    generation3To4: 'Generation 3–4',
  },
  saveSlots: {
    slot1: 'Slot 1',
    slot2: 'Slot 2',
    slot3: 'Slot 3',
    slot4: 'Slot 4',
    slot5: 'Slot 5',
  },
  partGroupNames: {
    faces: 'Faces',
    beards: 'Beards',
    hair: 'Hair',
    ears: 'Ears',
    eyes: 'Eyes',
    eyebrows: 'Eyebrows',
    noses: 'Noses',
    moustaches: 'Moustaches',
    mouths: 'Mouths',
    faceWrinkles: 'Face wrinkles',
    eyeWrinkles: 'Eye wrinkles',
    scars: 'Scars',
  },
};

const chineseFamilyTreeCopy: FamilyTreeCopy = {
  navigationName: '人物家谱制作器',
  pageTitle: '奇幻人物家谱制作器｜免费制作小说与 D&D 角色家谱',
  pageDescription: '为小说、奇幻世界观和 D&D 战役制作人物家谱。自定义角色头像、编辑人物信息、连接不同世代，梳理角色之间的家族关系。',
  heading: '奇幻人物家谱制作器｜免费制作小说与 D&D 角色家谱',
  heroAction: '免费制作家谱',
  workspaceLabel: '人物家谱工作区',
  personEditor: '人物编辑',
  familyCanvas: '家谱画布',
  canvasHint: '点击人物进行编辑；只能在同一代内横向拖动。',
  newPerson: '新人物',
  selectedPerson: '选中人物',
  name: '姓名',
  age: '年龄',
  description: '人物描述',
  namePlaceholder: '人物名称',
  agePlaceholder: '年龄或寿命',
  descriptionPlaceholder: '身份、经历或备注',
  randomAvatar: '随机头像',
  avatarHelp: '点击部件即可应用到当前人物。',
  noHair: '无头发',
  resetWrinkles: '重置面部和眼部皱纹',
  scarsHint: '疤痕可以独立选择并叠加。',
  wrinklesHint: '面部皱纹和眼部皱纹可以组合。',
  placement: '放到',
  addPerson: '添加人物',
  deletePerson: '删除人物',
  connectionEditor: '连接编辑',
  endpointHint: '每个端点都可以设置为无、实线或虚线。',
  addConnection: '添加层间连线',
  clearConnections: '清空全部层间连线',
  resizeEnabled: '调整大小：开',
  resizeDisabled: '调整大小：关',
  dragConnectionHint: '拖动连线或两端手柄即可移动和调整长度。',
  saveLoad: '保存 / 载入',
  localFile: '本地文件',
  saveFile: '保存家谱文件',
  chooseFile: '选择文件',
  loadFile: '载入文件',
  noFile: '未选择文件',
  loadReplacesHint: '载入会替换当前画布，并恢复人物、位置和连线。',
  save: '保存',
  load: '载入',
  emptySlot: '空槽',
  savedSlot: '已保存',
  generateImage: '生成图片',
  imagePreview: '家谱图片预览',
  regenerateImage: '重新生成',
  saveImage: '保存图片',
  imageHelp: '生成包含头像、姓名和代际连线的完整预览。默认使用透明背景；需要时可选择白色背景。',
  transparentBackground: '透明背景',
  whiteBackground: '白色背景',
  done: '完成',
  close: '关闭',
  editPerson: '人物编辑',
  editConnections: '连接编辑',
  storageAndExport: '保存 / 导出',
  loading: '载入中',
  unnamedPerson: '未命名人物',
  errorStorage: '浏览器存档读取或写入失败。',
  errorFile: '无法载入所选家谱文件。',
  errorImage: '家谱图片生成或保存失败。',
  personAdded: '人物已添加。',
  slotSaved: '槽位已保存。',
  slotLoaded: '槽位已载入。',
  fileLoaded: '家谱文件已载入。',
  categoryNames: {
    faces: '脸型',
    hair: '头发',
    ears: '耳朵',
    eyes: '眼睛',
    eyebrows: '眉毛',
    noses: '鼻子',
    mouths: '嘴巴',
    extras: '附加',
  },
  colorNames: {
    skinColor: '肤色',
    hairColor: '发色',
    eyeColor: '眼睛颜色',
    eyebrowColor: '眉色',
    moustacheColor: '小胡子颜色',
  },
  directions: {
    top: '上',
    bottom: '下',
    left: '左',
    right: '右',
  },
  endpointStyles: {
    none: '无',
    solid: '实线',
    dashed: '虚线',
  },
  generations: {
    generation1: '第 1 代',
    generation2: '第 2 代',
    generation3: '第 3 代',
    generation4: '第 4 代',
  },
  connectionGaps: {
    generation1To2: '第 1–2 代',
    generation2To3: '第 2–3 代',
    generation3To4: '第 3–4 代',
  },
  saveSlots: {
    slot1: '槽位 1',
    slot2: '槽位 2',
    slot3: '槽位 3',
    slot4: '槽位 4',
    slot5: '槽位 5',
  },
  partGroupNames: {
    faces: '脸型',
    beards: '胡须',
    hair: '头发',
    ears: '耳朵',
    eyes: '眼睛',
    eyebrows: '眉毛',
    noses: '鼻子',
    moustaches: '小胡子',
    mouths: '嘴巴',
    faceWrinkles: '面部皱纹',
    eyeWrinkles: '眼部皱纹',
    scars: '疤痕',
  },
};

export function getFamilyTreeCopy(locale: SiteLocale): FamilyTreeCopy {
  if (locale === 'en') {
    return englishFamilyTreeCopy;
  }

  if (locale === 'zh') {
    return chineseFamilyTreeCopy;
  }

  throw new Error(`Unknown family tree locale: ${JSON.stringify(locale)}.`);
}
