import type { SiteLocale } from '@/lib/site-locale';

import type { PeriodicTableCopy } from './copy-types';

const englishPeriodicTableCopy: PeriodicTableCopy = {
  navigationTitle: 'Periodic Table Creator',
  pageTitle: 'Periodic Table Creator | Build Fantasy and Real Element Tables',
  pageDescription:
    'Create a custom periodic table for fantasy worldbuilding, writing, games, or classroom projects. Edit cell text, layout, colors, borders, and images in your browser, then save or download an offline HTML table.',
  eyebrow: 'WORLD-BUILDING TOOL',
  title: 'Periodic Table Creator – Free Online Table Maker',
  description:
    'Use our Periodic Table Creator for D&D, fantasy, and sci-fi worldbuilding. Organize magical elements, minerals, resources, materials, and factions.',
  heroAction: 'Start Creating',
  fields: {
    topLeft: 'Top left',
    topRight: 'Top right',
    symbol: 'Symbol',
    name: 'Name',
    bottomLeft: 'Bottom left',
    bottomRight: 'Bottom right',
  },
  workspaceLabel: 'Periodic table workspace',
  newTable: 'New',
  random: 'Random',
  slots: 'Saved slots',
  importFile: 'Import',
  download: 'Download table',
  help: 'Help',
  more: 'More',
  content: 'Content',
  appearance: 'Appearance',
  multiSelect: 'Multi-select',
  selectAll: 'Select all',
  clearSelection: 'Clear selection',
  selectedCount: 'Selected: {count}',
  tableSize: 'Table size: {rows} × {columns}',
  selectionHint: 'Select a cell to edit its text and styles. Use multi-select to style several cells at once.',
  mobileScrollHint: 'Swipe sideways to see the full table.',
  emptyCell: 'Empty cell',
  scope: 'Apply to',
  selectedScope: 'Selected cells',
  allScope: 'All cells',
  noSelection: 'Select at least one cell first.',
  backgroundColor: 'Background color',
  transparentBackground: 'Clear background',
  textColor: 'Text color',
  borderColor: 'Border color',
  borderState: 'Border',
  borderShown: 'Shown',
  borderHidden: 'Hidden',
  borderMixed: 'Mixed',
  invertBorders: 'Invert borders',
  showBorders: 'Show borders',
  hideBorders: 'Hide borders',
  imageUrl: 'Background image URL',
  applyImage: 'Apply image',
  removeImage: 'Remove image',
  editorEmpty: 'Choose a cell to edit.',
  editorMultiple: 'Multiple cells selected. Use appearance controls to style them together.',
  resetSelected: 'Reset selected',
  rows: 'Rows',
  columns: 'Columns',
  createBlank: 'Blank table',
  realTemplate: 'Real periodic table',
  randomDefault: 'Random new table',
  randomCurrent: 'Randomize current table',
  randomHint:
    'A new random table replaces the current layout. Randomizing the current table keeps its size, styles, images, and bottom fields.',
  dimensionHint: 'Each dimension must be between 1 and 50.',
  newDescription: 'Create a blank table with the row and column count you choose.',
  save: 'Save',
  load: 'Load',
  emptySlot: 'Empty slot',
  slot: 'Slot {slot}',
  savedAt: 'Saved {date}',
  storageHint: 'Five manual slots are stored only in this browser. There is no automatic saving.',
  fileHint:
    'Import a previously downloaded periodic table to restore its layout, text, and styles and continue editing. Supports TXT / HTML files up to 5 MiB.',
  fileInputLabel: 'Choose a TXT or HTML table file',
  importButton: 'Import file',
  confirmReplaceTitle: 'Replace the current table?',
  confirmReplaceDescription:
    'Loading this table will replace your current edits. Save your work first if you want to keep it.',
  replace: 'Replace table',
  saveFirst: 'Download first',
  confirmResetTitle: 'Reset selected cells?',
  confirmResetDescription:
    'This clears the selected cells’ text and text styles while keeping their background, image, and border color.',
  confirmOverwriteTitle: 'Replace this saved slot?',
  confirmOverwriteDescription: 'This slot already has a table. Saving will replace it.',
  cancel: 'Cancel',
  close: 'Close',
  done: 'Done',
  statusSaved: 'Saved table to slot {slot}.',
  statusLoaded: 'Loaded table from slot {slot}.',
  statusImported: 'Imported table from the selected file.',
  statusDownloaded: 'Downloaded the table as an editable TXT file.',
  errorPrefix: 'Error:',
  helpIntro:
    'Edit text directly in the table, then use the side controls to style selected cells or the whole table.',
  helpSections: [
    {
      title: 'Edit six text fields',
      body:
        'Each cell has top-left, top-right, symbol, name, bottom-left, and bottom-right fields. On desktop, click text to edit it; on mobile, tap text to open the focused editor sheet. Press Enter for a line break.',
    },
    {
      title: 'Select and style cells',
      body:
        'Normal mode edits text with one click. Multi-select mode lets you select several cells without opening an editor. Appearance controls apply to selected cells or all cells, including colors, borders, transparent backgrounds, and background image URLs.',
    },
    {
      title: 'Use layouts and randomization',
      body:
        'Start with a blank table, a factual periodic table template, or a new fantasy layout. Randomize the current table to keep its size and styles while changing the four primary text fields; its bottom two fields stay in place.',
    },
    {
      title: 'Keep transparent gaps',
      body:
        'Hidden borders leave the cell position in the grid, so periodic-table spacing remains intact. Reset only affects selected text and text styles, while background, image, and border color are kept.',
    },
    {
      title: 'Save five local slots',
      body:
        'Save and load five manual slots in this browser. Slots include the layout, text, styles, images, and selection. There is no automatic save, and replacing an existing slot asks first.',
    },
    {
      title: 'Back up as TXT or HTML',
      body:
        'Download a UTF-8 TXT file containing editable table HTML. Rename a copy to .html to open it offline and edit its text. Import accepts compatible TXT or HTML files up to 5 MiB and does not execute arbitrary scripts.',
    },
    {
      title: 'Use external image URLs',
      body:
        'Enter an HTTP or HTTPS image URL for a selected cell or the whole table. The remote server must allow the browser to load the image; remove the URL when you no longer need it.',
    },
    {
      title: 'Take a system screenshot',
      body:
        'For a visual snapshot, use your operating system shortcut: Mac Shift-Command-4 or Windows Windows-Shift-S. The tool does not include a built-in PNG download.',
    },
  ],
};

const chinesePeriodicTableCopy: PeriodicTableCopy = {
  navigationTitle: '元素周期表制作器',
  pageTitle: '元素周期表制作器｜创建幻想与真实元素表',
  pageDescription:
    '为幻想世界观、写作、游戏或课堂项目创建自定义元素周期表。在浏览器中编辑文字、布局、颜色、边框和图片，并保存或下载为可离线编辑的 HTML 表格。',
  eyebrow: '世界观创作工具',
  title: '元素周期表制作器｜免费在线制作元素表',
  description:
    '为 TRPG/D&D、奇幻与科幻世界观制作自定义元素周期表，将魔法元素、矿物、资源、科技材料和阵营整理成分类体系，用于跑团、小说创作和游戏设定。',
  heroAction: '开始制作',
  fields: {
    topLeft: '左上',
    topRight: '右上',
    symbol: '主符号',
    name: '名称',
    bottomLeft: '左下',
    bottomRight: '右下',
  },
  workspaceLabel: '元素周期表工作区',
  newTable: '新建',
  random: '随机生成',
  slots: '本地存档',
  importFile: '导入',
  download: '下载表格',
  help: '帮助',
  more: '更多',
  content: '内容',
  appearance: '外观',
  multiSelect: '多选模式',
  selectAll: '全选',
  clearSelection: '清除选择',
  selectedCount: '已选择：{count}',
  tableSize: '表格尺寸：{rows} × {columns}',
  selectionHint: '选择单元格即可编辑文字和样式。打开多选模式可同时设置多个单元格。',
  mobileScrollHint: '左右滑动查看完整表格。',
  emptyCell: '空单元格',
  scope: '应用范围',
  selectedScope: '所选单元格',
  allScope: '全部单元格',
  noSelection: '请先选择至少一个单元格。',
  backgroundColor: '背景颜色',
  transparentBackground: '清除背景',
  textColor: '文字颜色',
  borderColor: '边框颜色',
  borderState: '边框',
  borderShown: '显示',
  borderHidden: '隐藏',
  borderMixed: '混合',
  invertBorders: '反转边框',
  showBorders: '显示边框',
  hideBorders: '隐藏边框',
  imageUrl: '背景图片 URL',
  applyImage: '应用图片',
  removeImage: '移除图片',
  editorEmpty: '请选择一个单元格进行编辑。',
  editorMultiple: '已选择多个单元格。使用外观控件统一设置它们。',
  resetSelected: '重置所选',
  rows: '行数',
  columns: '列数',
  createBlank: '空白表格',
  realTemplate: '真实元素周期表',
  randomDefault: '随机新表格',
  randomCurrent: '随机化当前表格',
  randomHint: '随机新表格会替换当前布局；随机化当前表格会保留尺寸、样式、图片和底部字段。',
  dimensionHint: '每个尺寸必须在 1 到 50 之间。',
  newDescription: '按指定的行数和列数创建空白表格。',
  save: '保存',
  load: '加载',
  emptySlot: '空槽位',
  slot: '槽位 {slot}',
  savedAt: '保存于 {date}',
  storageHint: '五个手动槽位只保存在当前浏览器中，不会自动保存。',
  fileHint: '导入之前下载的元素周期表文件，恢复布局、文字与样式并继续编辑。支持 TXT / HTML，最大 5 MiB。',
  fileInputLabel: '选择 TXT 或 HTML 表格文件',
  importButton: '导入文件',
  confirmReplaceTitle: '替换当前表格？',
  confirmReplaceDescription: '加载这个表格会替换当前编辑内容。如果要保留当前内容，请先保存。',
  replace: '替换表格',
  saveFirst: '先下载备份',
  confirmResetTitle: '重置所选单元格？',
  confirmResetDescription: '这会清除所选单元格的文字和文字样式，但保留背景、图片和边框颜色。',
  confirmOverwriteTitle: '替换这个存档槽位？',
  confirmOverwriteDescription: '这个槽位已有表格，保存会替换原内容。',
  cancel: '取消',
  close: '关闭',
  done: '完成',
  statusSaved: '已保存到槽位 {slot}。',
  statusLoaded: '已从槽位 {slot} 加载。',
  statusImported: '已导入所选文件中的表格。',
  statusDownloaded: '已下载可编辑 TXT 表格文件。',
  errorPrefix: '错误：',
  helpIntro: '直接编辑表格中的文字，再用侧边控件设置所选单元格或整张表格的样式。',
  helpSections: [
    {
      title: '编辑六个文字栏位',
      body: '每个单元格包含左上、右上、主符号、名称、左下和右下六个栏位。桌面端单击文字即可编辑；手机点击文字会打开并聚焦编辑面板。按 Enter 可换行。',
    },
    {
      title: '选择并设置单元格样式',
      body: '普通模式下单击文字会进入编辑；多选模式下点击单元格可连续选择而不会打开编辑器。外观控件可应用到所选单元格或全部单元格，包括颜色、边框、透明背景和背景图片 URL。',
    },
    {
      title: '使用布局和随机生成',
      body: '可以从空白表格、真实元素周期表模板或新的幻想布局开始。随机化当前表格会保留尺寸和样式，只替换四个主要文字栏位，底部两个栏位会保留。',
    },
    {
      title: '保留透明间隔',
      body: '隐藏边框后，单元格仍保留在网格中的位置，因此周期表间隔不会塌缩。重置只影响所选单元格的文字和文字样式，背景、图片和边框颜色会保留。',
    },
    {
      title: '保存五个本地槽位',
      body: '在当前浏览器中手动保存和加载五个槽位。槽位会包含布局、文字、样式、图片和选择状态；不会自动保存，覆盖已有槽位前会先询问。',
    },
    {
      title: '使用 TXT 或 HTML 备份',
      body: '下载的是 UTF-8 TXT 文件，里面包含可编辑的表格 HTML。将副本改名为 .html 后可以离线打开并编辑文字。导入支持不超过 5 MiB 的兼容 TXT 或 HTML，不会执行任意脚本。',
    },
    {
      title: '使用外部图片 URL',
      body: '为所选单元格或整张表格输入 HTTP 或 HTTPS 图片 URL。远程服务器必须允许浏览器加载图片；不再需要时可以移除 URL。',
    },
    {
      title: '使用系统截图',
      body: '需要视觉快照时，请使用系统快捷键：Mac 按 Shift-Command-4，Windows 按 Windows-Shift-S。工具本身不提供 PNG 下载。',
    },
  ],
};

export function getPeriodicTableCopy(locale: SiteLocale): PeriodicTableCopy {
  if (locale === 'en') {
    return englishPeriodicTableCopy;
  }

  if (locale === 'zh') {
    return chinesePeriodicTableCopy;
  }

  throw new Error(`Unknown periodic table locale. Received ${JSON.stringify(locale)}.`);
}
