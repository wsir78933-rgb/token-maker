/** 中文语言包 */
const zh = {
  // 头部
  appName: 'Token Maker',
  appSubtitle: 'TRPG Token 制作工具',
  workspaceLabel: '编辑工作区',
  localMode: '本地优先',

  // 控制面板
  controlPanel: '控制面板',
  imageSettings: '图片设置',
  imageScale: '缩放',
  resetPosition: '重置位置',
  clearWorkspace: '清空工作区',

  // 文字
  textSettings: '文字设置',
  addText: '添加文字',
  fontSize: '字号',
  delete: '删除',
  selectTextHint: '点击画布上的文本以在此处编辑',

  // 样式
  styleSettings: '样式设置',
  borderTint: '边框颜色',
  backgroundColor: '背景颜色',
  textColor: '文字颜色',
  overlayTint: '叠加层颜色',
  borderOpacity: '边框不透明度',
  overlayOpacity: '叠加层不透明度',

  // 预设
  presets: '风格预设',
  warrior: '战士',
  mage: '法师',
  rogue: '盗贼',
  cleric: '牧师',
  ranger: '游侠',
  undead: '亡灵',
  monster: '怪物',
  classic: '经典',

  // 模板面板
  templatePanel: '模板库',
  borderTemplates: '边框模板',
  maskTemplates: '遮罩形状',
  uploadCustomBorder: '上传自定义边框',
  uploadCustomMask: '上传自定义遮罩',

  // 边框名称
  'border.none': '无边框',
  'border.metalbarbarian': '野蛮金属',
  'border.wood': '原木',
  'border.rocks': '岩石',
  'border.blueenergy': '蓝色能量',
  'border.silverspikes': '白银尖刺',
  'border.revgold': '真金',
  'border.fire': '烈焰',
  'border.ice': '寒霜',
  'border.steampunk': '蒸汽朋克',
  'border.bones': '骸骨',
  'border.thin-ring': '细环',

  // 遮罩名称
  'mask.circle': '圆形',
  'mask.square': '方形',
  'mask.hexagon': '六边形',
  'mask.octagon': '八边形',
  'mask.decagon': '十边形',
  'mask.dodecagon': '十二边形',

  // 画布
  dropHint: '拖拽图片到这里开始',
  orClickToUpload: '或点击选择图片',
  supportedFormats: '支持 JPG、PNG、WEBP',
  showcaseQuickStartEyebrow: '先选一个方向',
  showcaseQuickStartTitle: '上传前先定下你想要的气质',
  showcaseQuickStartHint: '只套用风格',
  showcaseEyebrow: '精选案例',
  showcaseTitle: '看一眼完成度，再决定要不要继续做',
  showcaseDescription:
    '这组作品不是模板目录，而是成品质感参考。每个案例都能把编辑器拉回一个相近的风格起点，方便你立刻开始。',
  showcaseFeaturedLabel: '主推效果',
  showcasePresetLabel: '风格起点',
  showcaseApplyShort: '套用',
  showcaseApplyPreset: '以这个风格开始',
  showcaseApplied: '已套用',

  // 导出
  exportSection: '导出',
  exportSize: '导出尺寸',
  download: '下载 PNG',
  downloadAll: '批量下载 ZIP',

  // 通用
  undo: '撤销',
  redo: '重做',
  reset: '恢复默认',
  upload: '上传图片',
} as const;

export type I18nKey = keyof typeof zh;
export default zh;
