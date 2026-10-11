import type { SiteLocale } from '@/lib/site-locale';

export type NoticeBoardEditorCopy = {
  toolTitle: string;
  papersTitle: string;
  papersTab: string;
  editTab: string;
  setupTab: string;
  mobileNavigation: string;
  paperHint: string;
  addPaperLabel: (paperNumber: number) => string;
  paperCardLabel: (paperNumber: number) => string;
  canvasTitle: string;
  boardBackground: string;
  boardDimensions: (width: number, height: number) => string;
  canvasEmpty: string;
  selectNoticeHint: string;
  selectedNoticeCount: (count: number) => string;
  selectedNoticeLabel: (noticeNumber: number) => string;
  dragNoticeHandle: (noticeNumber: number) => string;
  resizeNoticeRight: (noticeNumber: number) => string;
  resizeNoticeBottom: (noticeNumber: number) => string;
  resizeNoticeCorner: (noticeNumber: number) => string;
  multiSelect: string;
  finishMultiSelect: string;
  applyFormatting: string;
  applyToSelectedNotices: string;
  selectionInstruction: string;
  selectionInstructionMobile: string;
  settings: string;
  saveOpen: string;
  help: string;
  editPanel: string;
  boardSettingsTitle: string;
  boardWidth: string;
  boardWidthInvalid: (value: string) => string;
  apply: string;
  dragEnabled: string;
  resizeEnabled: string;
  settingsHint: string;
  filesTitle: string;
  saveSlots: string;
  slotLabel: (slotNumber: number) => string;
  savedSlot: string;
  emptySlot: string;
  emptySlotError: (slotNumber: number) => string;
  storageUnavailable: string;
  retry: string;
  saveSlot: (slotNumber: number) => string;
  loadSlot: (slotNumber: number) => string;
  saveTxt: string;
  loadTxt: string;
  loadTxtFile: string;
  fileTooLarge: (fileName: string, fileSize: number, maximumBytes: number) => string;
  browserPrint: string;
  screenshotGuide: string;
  saveOpenHint: string;
  loadingSlots: string;
  fontFamily: string;
  fontStyle: string;
  fontSize: string;
  fontSizeInvalid: (value: string) => string;
  lineHeight: string;
  lineHeightInvalid: (value: string) => string;
  textColor: string;
  textAlignment: string;
  noticeText: string;
  noNoticeSelected: string;
  batchFormattingOnly: string;
  applyFormattingHint: string;
  addGoogleFont: string;
  addFont: string;
  fontLinkCode: string;
  fontFamilyDeclaration: string;
  addFontToList: string;
  addedFonts: string;
  noCustomFonts: string;
  customFontHint: string;
  normal: string;
  italic: string;
  bold: string;
  boldItalic: string;
  left: string;
  center: string;
  right: string;
  close: string;
  closePanel: string;
  browseGoogleFonts: string;
  quickStartTitle: string;
  quickStartSteps: string;
  savingOutputTitle: string;
  savingOutputDescription: string;
  helpTitle: string;
  helpDescription: string;
  screenshotInstructions: string;
  printInstructions: string;
  errorTitle: string;
  successTitle: string;
  savedSuccessfully: string;
  loadedSuccessfully: string;
  txtDownloaded: string;
  txtLoaded: string;
  fontAddedSuccessfully: string;
  fontLoadFailure: (stylesheetUrl: string) => string;
  fontLimitReached: (fontFamily: string, currentCount: number, limit: number) => string;
  noticeLimitReached: (limit: number) => string;
  unknownFailure: string;
};

const EDITOR_COPY: Record<SiteLocale, NoticeBoardEditorCopy> = {
  en: {
    toolTitle: 'Fantasy Notice Board Creator',
    papersTitle: 'Notice papers · 12',
    papersTab: 'Papers',
    editTab: 'Edit',
    setupTab: 'Setup',
    mobileNavigation: 'Notice board panels',
    paperHint: 'Click to add. Reuse any paper.',
    addPaperLabel: (paperNumber) => `Add paper ${String(paperNumber).padStart(2, '0')}`,
    paperCardLabel: (paperNumber) => `Paper ${String(paperNumber).padStart(2, '0')}`,
    canvasTitle: 'Notice board',
    boardBackground: 'Notice board background',
    boardDimensions: (width, height) => `${width} × ${height} px`,
    canvasEmpty: 'Choose a paper to start editing.',
    selectNoticeHint: 'Select a notice to edit its text and style.',
    selectedNoticeCount: (count) => `${count} ${count === 1 ? 'notice' : 'notices'} selected`,
    selectedNoticeLabel: (noticeNumber) => `Notice ${noticeNumber}`,
    dragNoticeHandle: (noticeNumber) => `Move notice ${noticeNumber}`,
    resizeNoticeRight: (noticeNumber) => `Resize notice ${noticeNumber} from the right edge`,
    resizeNoticeBottom: (noticeNumber) => `Resize notice ${noticeNumber} from the bottom edge`,
    resizeNoticeCorner: (noticeNumber) => `Resize notice ${noticeNumber} from the bottom-right corner`,
    multiSelect: 'Multi',
    finishMultiSelect: 'Done',
    applyFormatting: 'Apply formatting',
    applyToSelectedNotices: 'Apply to selected notices',
    selectionInstruction: 'Single-click to select · double-click to edit text in the right panel · drag or use arrow keys to move · + / − to resize · Delete / Backspace removes selected notices (when editing text, these keys delete text instead)',
    selectionInstructionMobile: 'Select a notice to edit',
    settings: 'Board settings',
    saveOpen: 'Save/Open',
    help: 'Help',
    editPanel: 'Text properties',
    boardSettingsTitle: 'Board settings',
    boardWidth: 'Board width px',
    boardWidthInvalid: (value) => `Board width ${JSON.stringify(value)} is invalid. Allowed range:`,
    apply: 'Apply',
    dragEnabled: 'Drag notices',
    resizeEnabled: 'Resize notices',
    settingsHint: 'The board height follows its fixed ratio. These switches only control moving and resizing; text editing stays available.',
    filesTitle: 'Save, open and output',
    saveSlots: 'Browser saves · 4 slots',
    slotLabel: (slotNumber) => `Slot ${slotNumber}`,
    savedSlot: 'Saved',
    emptySlot: 'Empty slot',
    emptySlotError: (slotNumber) => `Slot ${slotNumber} is empty.`,
    storageUnavailable: 'Browser storage is unavailable. TXT and print actions remain available.',
    retry: 'Retry',
    saveSlot: (slotNumber) => `Save slot ${slotNumber}`,
    loadSlot: (slotNumber) => `Load slot ${slotNumber}`,
    saveTxt: 'Save TXT',
    loadTxt: 'Load TXT',
    loadTxtFile: 'Load TXT file',
    fileTooLarge: (fileName, fileSize, maximumBytes) => `File ${JSON.stringify(fileName)} is ${fileSize} bytes; the maximum is ${maximumBytes} bytes.`,
    browserPrint: 'Print board',
    screenshotGuide: 'Screenshot guide',
    saveOpenHint: 'Loading replaces the current board. TXT files can be opened here to continue editing.',
    loadingSlots: 'Loading browser saves…',
    fontFamily: 'Font family',
    fontStyle: 'Font style',
    fontSize: 'Font size px',
    fontSizeInvalid: (value) => `Font size ${JSON.stringify(value)} must be from 8 to 96 px.`,
    lineHeight: 'Line height px',
    lineHeightInvalid: (value) => `Line height ${JSON.stringify(value)} must be from 8 to 192 px.`,
    textColor: 'Text color',
    textAlignment: 'Text alignment',
    noticeText: 'Notice text',
    noNoticeSelected: 'Select a notice to edit its text and style.',
    batchFormattingOnly: 'Multi-select applies formatting to selected notices. Delete / Backspace removes all selected notices; while editing notice text, those keys delete text instead.',
    applyFormattingHint: 'Applies to all selected notices.',
    addGoogleFont: 'Add a Google font',
    addFont: 'Add font',
    fontLinkCode: 'Google Fonts link code',
    fontFamilyDeclaration: 'Font-family declaration',
    addFontToList: 'Add to font list',
    addedFonts: 'Added fonts',
    noCustomFonts: 'No custom Google fonts have been added.',
    customFontHint: 'Paste the Google Fonts link and its font-family declaration. Then choose the font in the text inspector.',
    normal: 'Normal',
    italic: 'Italic',
    bold: 'Bold',
    boldItalic: 'Bold italic',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    close: 'Close',
    closePanel: 'Close panel',
    browseGoogleFonts: 'Browse Google Fonts',
    quickStartTitle: 'Quick start',
    quickStartSteps: 'Add paper → click to edit → drag its border → Save/Open',
    savingOutputTitle: 'Saving and output',
    savingOutputDescription: 'Save/Open groups browser slots, TXT, screenshot help and print',
    helpTitle: 'Using the notice board',
    helpDescription: 'Add a paper, select it to edit, then arrange notices on the board.',
    screenshotInstructions: 'Use your browser or operating system screenshot command to capture the board. There is no image download button.',
    printInstructions: 'Print includes the board only. Use your browser print dialog to choose a paper size or save a PDF.',
    errorTitle: 'Could not complete this action.',
    successTitle: 'Done',
    savedSuccessfully: 'Saved to this browser.',
    loadedSuccessfully: 'Loaded the saved board.',
    txtDownloaded: 'Downloaded an editable TXT file.',
    txtLoaded: 'Loaded the TXT board.',
    fontAddedSuccessfully: 'Added the font to the list.',
    fontLoadFailure: (stylesheetUrl) => `The Google font could not be loaded: ${stylesheetUrl}`,
    fontLimitReached: (fontFamily, currentCount, limit) => `Cannot add ${JSON.stringify(fontFamily)}: the project already has ${currentCount} custom fonts and the limit is ${limit}.`,
    noticeLimitReached: (limit) => `This board can contain up to ${limit} notices.`,
    unknownFailure: 'An unexpected error occurred.',
  },
  zh: {
    toolTitle: '奇幻任务公告板制作工具',
    papersTitle: '公告纸张 · 12',
    papersTab: '纸张',
    editTab: '编辑',
    setupTab: '设置',
    mobileNavigation: '公告板面板',
    paperHint: '点击添加，纸张可重复使用。',
    addPaperLabel: (paperNumber) => `添加纸张 ${String(paperNumber).padStart(2, '0')}`,
    paperCardLabel: (paperNumber) => `纸张 ${String(paperNumber).padStart(2, '0')}`,
    canvasTitle: '公告板',
    boardBackground: '公告板背景',
    boardDimensions: (width, height) => `${width} × ${height} px`,
    canvasEmpty: '选择一种纸张，开始编辑。',
    selectNoticeHint: '选择公告即可编辑文字和格式。',
    selectedNoticeCount: (count) => `已选 ${count} 张公告`,
    selectedNoticeLabel: (noticeNumber) => `公告 ${noticeNumber}`,
    dragNoticeHandle: (noticeNumber) => `移动公告 ${noticeNumber}`,
    resizeNoticeRight: (noticeNumber) => `从右侧缩放公告 ${noticeNumber}`,
    resizeNoticeBottom: (noticeNumber) => `从底部缩放公告 ${noticeNumber}`,
    resizeNoticeCorner: (noticeNumber) => `从右下角缩放公告 ${noticeNumber}`,
    multiSelect: '多选',
    finishMultiSelect: '结束多选',
    applyFormatting: '应用格式',
    applyToSelectedNotices: '应用到所选公告',
    selectionInstruction: '单击选择公告 · 双击在右侧面板编辑公告文字 · 拖动或方向键移动 · + / − 缩放 · Delete / Backspace 删除所选公告（编辑文字时仅删除文字）',
    selectionInstructionMobile: '点击公告即可编辑',
    settings: '公告板设置',
    saveOpen: '保存/打开',
    help: '帮助',
    editPanel: '文字属性',
    boardSettingsTitle: '公告板设置',
    boardWidth: '公告板宽度 px',
    boardWidthInvalid: (value) => `公告板宽度 ${JSON.stringify(value)} 无效。允许范围：`,
    apply: '应用',
    dragEnabled: '拖动公告',
    resizeEnabled: '缩放公告',
    settingsHint: '公告板高度按固定比例变化。这两个开关只控制移动与缩放，不影响文字编辑。',
    filesTitle: '保存、打开与输出',
    saveSlots: '浏览器存档 · 4 个槽位',
    slotLabel: (slotNumber) => `槽位 ${slotNumber}`,
    savedSlot: '有存档',
    emptySlot: '空槽',
    emptySlotError: (slotNumber) => `槽位 ${slotNumber} 为空。`,
    storageUnavailable: '浏览器存档暂不可用，仍可使用 TXT 和打印功能。',
    retry: '重试',
    saveSlot: (slotNumber) => `保存槽位 ${slotNumber}`,
    loadSlot: (slotNumber) => `读取槽位 ${slotNumber}`,
    saveTxt: '保存 TXT',
    loadTxt: '载入 TXT',
    loadTxtFile: '载入 TXT 文件',
    fileTooLarge: (fileName, fileSize, maximumBytes) => `文件 ${JSON.stringify(fileName)} 大小为 ${fileSize} 字节，超过上限 ${maximumBytes} 字节。`,
    browserPrint: '浏览器打印',
    screenshotGuide: '截图说明',
    saveOpenHint: '读取会替换当前公告板。TXT 文件可以重新载入并继续编辑。',
    loadingSlots: '正在读取浏览器存档…',
    fontFamily: '字体家族',
    fontStyle: '字体样式',
    fontSize: '字号 px',
    fontSizeInvalid: (value) => `字号 ${JSON.stringify(value)} 无效，范围为 8–96 px。`,
    lineHeight: '行高 px',
    lineHeightInvalid: (value) => `行高 ${JSON.stringify(value)} 无效，范围为 8–192 px。`,
    textColor: '文字颜色',
    textAlignment: '文字对齐',
    noticeText: '公告文字',
    noNoticeSelected: '选择公告即可编辑文字和格式。',
    batchFormattingOnly: '多选可将格式应用到所选公告。Delete / Backspace 会删除所有选中公告；编辑公告文字时，这两个键仅删除文字。',
    applyFormattingHint: '格式作用于所有选中公告。',
    addGoogleFont: '添加 Google 字体',
    addFont: '加字体',
    fontLinkCode: 'Google 字体链接代码',
    fontFamilyDeclaration: '字体家族声明',
    addFontToList: '加入字体列表',
    addedFonts: '已添加字体',
    noCustomFonts: '尚未添加自定义 Google 字体。',
    customFontHint: '粘贴 Google 字体链接和 font-family 声明，再从文字属性中选择新字体。',
    normal: '常规',
    italic: '斜体',
    bold: '粗体',
    boldItalic: '粗斜体',
    left: '左对齐',
    center: '居中',
    right: '右对齐',
    close: '关闭',
    closePanel: '关闭面板',
    browseGoogleFonts: '浏览 Google Fonts',
    quickStartTitle: '快速上手',
    quickStartSteps: '添加纸张 → 点击公告编辑 → 拖动边框摆放 → 保存/打开',
    savingOutputTitle: '保存与输出',
    savingOutputDescription: '保存/打开统一管理浏览器存档、TXT、截图说明与打印',
    helpTitle: '公告板使用说明',
    helpDescription: '添加纸张后选择公告即可编辑，再调整公告在板面上的位置。',
    screenshotInstructions: '使用浏览器或操作系统的截图功能保存板面。工具不提供图片下载按钮。',
    printInstructions: '打印内容只有公告板。可在浏览器打印窗口中选择纸张尺寸或保存为 PDF。',
    errorTitle: '操作未完成。',
    successTitle: '已完成',
    savedSuccessfully: '已保存到当前浏览器。',
    loadedSuccessfully: '已读取公告板存档。',
    txtDownloaded: '已下载可编辑 TXT 文件。',
    txtLoaded: '已载入 TXT 公告板。',
    fontAddedSuccessfully: '字体已加入列表。',
    fontLoadFailure: (stylesheetUrl) => `Google 字体加载失败：${stylesheetUrl}`,
    fontLimitReached: (fontFamily, currentCount, limit) => `无法添加 ${JSON.stringify(fontFamily)}：项目已有 ${currentCount} 个自定义字体，上限为 ${limit} 个。`,
    noticeLimitReached: (limit) => `公告板最多可放置 ${limit} 张公告。`,
    unknownFailure: '发生了无法识别的错误。',
  },
};

export function getNoticeBoardEditorCopy(locale: SiteLocale): NoticeBoardEditorCopy {
  if (locale === 'en' || locale === 'zh') return EDITOR_COPY[locale];
  throw new TypeError(`Notice board editor locale must be "en" or "zh". Received ${JSON.stringify(locale)}.`);
}
