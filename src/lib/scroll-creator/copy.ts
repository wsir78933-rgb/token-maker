import type { ScrollLocale } from './types';

export interface ScrollCreatorCopy {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly heroTitle: string;
  readonly heroDescription: string;
  readonly heroAction: string;
  readonly toolTitle: string;
  readonly toolDescription: string;
  readonly navTitle: string;
  readonly save: string;
  readonly load: string;
  readonly print: string;
  readonly help: string;
  readonly paperTab: string;
  readonly textTab: string;
  readonly imagesTab: string;
  readonly closePanel: string;
  readonly paperTitle: string;
  readonly paperHint: string;
  readonly paperChoice: string;
  readonly paperResize: string;
  readonly paperWidth: string;
  readonly paperHeight: string;
  readonly paperSizeReset: string;
  readonly textTitle: string;
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly textColor: string;
  readonly bold: string;
  readonly italic: string;
  readonly alignLeft: string;
  readonly alignCenter: string;
  readonly alignRight: string;
  readonly advancedFonts: string;
  readonly fontSource: string;
  readonly fontSourcePlaceholder: string;
  readonly fontName: string;
  readonly fontNamePlaceholder: string;
  readonly addFont: string;
  readonly fontLoading: string;
  readonly fontHint: string;
  readonly googleFontsLink: string;
  readonly imageTitle: string;
  readonly imageUrl: string;
  readonly imageUrlPlaceholder: string;
  readonly addImage: string;
  readonly imageLoading: string;
  readonly showImages: string;
  readonly dragImages: string;
  readonly resizeImages: string;
  readonly deleteSelected: string;
  readonly selectedImages: string;
  readonly imageHint: string;
  readonly previewTitle: string;
  readonly previewHint: string;
  readonly textOverflowWarning: string;
  readonly printOverflowBlocked: string;
  readonly textPlaceholder: string;
  readonly saveTitle: string;
  readonly loadTitle: string;
  readonly slotLabel: string;
  readonly emptySlot: string;
  readonly saveHere: string;
  readonly loadHere: string;
  readonly savedAt: string;
  readonly localSaveHint: string;
  readonly closeDialog: string;
  readonly helpTitle: string;
  readonly helpText: string;
  readonly printHint: string;
  readonly errorTitle: string;
  readonly saveSuccess: string;
  readonly loadSuccess: string;
  readonly fontSuccess: string;
  readonly imageSuccess: string;
  readonly operationFailed: string;
  readonly resizePaperEast: string;
  readonly resizePaperSouth: string;
  readonly resizePaperCorner: string;
  readonly resizeImage: string;
  readonly imageLabel: string;
}

const englishCopy: ScrollCreatorCopy = {
  pageTitle: 'Free Online Fantasy Scroll Creator for D&D and RPG Letters',
  pageDescription:
    'Create a parchment scroll or fantasy letter for D&D, TTRPG sessions, fantasy novels, and worldbuilding.',
  heroTitle: 'Parchment Scroll Creator – Free Fantasy Letter Maker',
  heroDescription:
    'Use our free online parchment scroll creator to make printable quest notices, character letters, and ancient prophecies for D&D, RPGs, and fantasy stories.',
  heroAction: 'Create a Scroll',
  toolTitle: 'Scroll Creator',
  toolDescription: 'Design a parchment message with paper, text, fonts, and images in your browser.',
  navTitle: 'Scroll Creator',
  save: 'Save',
  load: 'Load',
  print: 'Print',
  help: 'Help',
  paperTab: 'Paper',
  textTab: 'Text',
  imagesTab: 'Images',
  closePanel: 'Close panel',
  paperTitle: 'Paper',
  paperHint: 'Choose a parchment style, then adjust its width and height.',
  paperChoice: 'Choose a paper',
  paperResize: 'Resize paper',
  paperWidth: 'Width (px)',
  paperHeight: 'Height (px)',
  paperSizeReset: 'Reset size',
  textTitle: 'Text',
  fontFamily: 'Font family',
  fontSize: 'Font size',
  textColor: 'Text color',
  bold: 'Bold',
  italic: 'Italic',
  alignLeft: 'Align left',
  alignCenter: 'Align center',
  alignRight: 'Align right',
  advancedFonts: 'Add a Google Font',
  fontSource: 'Google Fonts stylesheet',
  fontSourcePlaceholder: 'Paste a Google Fonts CSS URL or link tag',
  fontName: 'Font family name',
  fontNamePlaceholder: 'For example, Cinzel',
  addFont: 'Add font',
  fontLoading: 'Loading font…',
  fontHint: 'Use a stylesheet from fonts.googleapis.com, then choose the font above.',
  googleFontsLink: 'Open Google Fonts',
  imageTitle: 'Images',
  imageUrl: 'Image URL',
  imageUrlPlaceholder: 'https://example.com/image.png',
  addImage: 'Add image',
  imageLoading: 'Loading image…',
  showImages: 'Show images',
  dragImages: 'Move images',
  resizeImages: 'Resize images',
  deleteSelected: 'Delete selected',
  selectedImages: 'Selected images',
  imageHint: 'Add images by URL, then select, move, or resize them on the paper.',
  previewTitle: 'Scroll preview',
  previewHint: 'Click the paper to type. Select an image to move or resize it.',
  textOverflowWarning:
    'Text exceeds the paper. Increase the paper height or reduce the font size. All text is preserved and can be scrolled within the text area.',
  printOverflowBlocked:
    'Text still exceeds the paper. Increase the paper height or reduce the font size before printing.',
  textPlaceholder: 'Write your message here…',
  saveTitle: 'Save locally',
  loadTitle: 'Load a saved scroll',
  slotLabel: 'Slot',
  emptySlot: 'Empty slot',
  saveHere: 'Save here',
  loadHere: 'Load',
  savedAt: 'Saved',
  localSaveHint:
    'Your four save slots stay in this browser on this device. Private browsing windows lose them when the session ends.',
  closeDialog: 'Close dialog',
  helpTitle: 'How to use Scroll Creator',
  helpText:
    'Choose a paper, type directly on the preview, and use the Text and Images panels to style your message. Save a slot to keep the project in this browser, or use Print to create a physical copy.',
  printHint: 'Print uses the paper preview and hides the editor controls.',
  errorTitle: 'Unable to complete the action',
  saveSuccess: 'Scroll saved.',
  loadSuccess: 'Scroll loaded.',
  fontSuccess: 'Font added.',
  imageSuccess: 'Image added.',
  operationFailed: 'Something went wrong. Check the value and try again.',
  resizePaperEast: 'Resize paper horizontally',
  resizePaperSouth: 'Resize paper vertically',
  resizePaperCorner: 'Resize paper in both directions',
  resizeImage: 'Resize image',
  imageLabel: 'Added image',
};

const chineseCopy: ScrollCreatorCopy = {
  pageTitle: '免费在线奇幻羊皮纸卷轴制作器：D&D 与跑团信件',
  pageDescription: '为 D&D、TRPG 跑团、奇幻小说和世界观设定制作羊皮纸卷轴或奇幻信件。',
  heroTitle: '羊皮纸卷轴制作器｜免费在线奇幻信件制作工具',
  heroDescription:
    '使用免费的在线羊皮纸卷轴制作器，为 D&D、TRPG 跑团和奇幻故事设计信件。将任务委托、角色书信和古老预言制作成可打印的跑团道具。',
  heroAction: '开始制作卷轴',
  toolTitle: '卷轴制作器',
  toolDescription: '在浏览器中选择纸张、文字、字体和图片，设计一张羊皮纸留言。',
  navTitle: '卷轴制作器',
  save: '保存',
  load: '加载',
  print: '打印',
  help: '帮助',
  paperTab: '纸张',
  textTab: '文字',
  imagesTab: '图片',
  closePanel: '关闭面板',
  paperTitle: '纸张',
  paperHint: '选择一种羊皮纸样式，然后调整宽度和高度。',
  paperChoice: '选择纸张',
  paperResize: '调整纸张尺寸',
  paperWidth: '宽度（px）',
  paperHeight: '高度（px）',
  paperSizeReset: '重置大小',
  textTitle: '文字',
  fontFamily: '字体',
  fontSize: '字号',
  textColor: '文字颜色',
  bold: '粗体',
  italic: '斜体',
  alignLeft: '左对齐',
  alignCenter: '居中对齐',
  alignRight: '右对齐',
  advancedFonts: '添加 Google 字体',
  fontSource: 'Google Fonts 样式表',
  fontSourcePlaceholder: '粘贴 Google Fonts CSS 地址或 link 标签',
  fontName: '字体名称',
  fontNamePlaceholder: '例如：Cinzel',
  addFont: '添加字体',
  fontLoading: '正在加载字体…',
  fontHint: '使用 fonts.googleapis.com 的样式表，然后在上方选择字体。',
  googleFontsLink: '打开 Google Fonts',
  imageTitle: '图片',
  imageUrl: '图片地址',
  imageUrlPlaceholder: 'https://example.com/image.png',
  addImage: '添加图片',
  imageLoading: '正在加载图片…',
  showImages: '显示图片',
  dragImages: '移动图片',
  resizeImages: '调整图片大小',
  deleteSelected: '删除选中图片',
  selectedImages: '已选图片',
  imageHint: '通过地址添加图片，然后在纸张上选择、移动或调整图片。',
  previewTitle: '卷轴预览',
  previewHint: '点击纸张直接输入文字。选择图片后可移动或调整大小。',
  textOverflowWarning: '正文超出纸张。请增加纸张高度或减小字号；全文已保留，可在正文区域内滚动编辑。',
  printOverflowBlocked: '正文仍超出纸张，请先增加纸张高度或减小字号后再打印。',
  textPlaceholder: '在这里写下你的留言…',
  saveTitle: '本地保存',
  loadTitle: '加载已保存卷轴',
  slotLabel: '槽位',
  emptySlot: '空槽位',
  saveHere: '保存到这里',
  loadHere: '加载',
  savedAt: '保存时间',
  localSaveHint: '四个保存槽位保存在此设备的当前浏览器中。无痕窗口关闭后会丢失这些存档。',
  closeDialog: '关闭对话框',
  helpTitle: '卷轴制作器使用方法',
  helpText:
    '先选择纸张，再直接在预览中输入文字，并使用文字和图片面板调整样式。保存槽位可将项目保存在当前浏览器中，使用打印可以制作纸质副本。',
  printHint: '打印时会使用纸张预览，并隐藏编辑器控件。',
  errorTitle: '操作未完成',
  saveSuccess: '卷轴已保存。',
  loadSuccess: '卷轴已加载。',
  fontSuccess: '字体已添加。',
  imageSuccess: '图片已添加。',
  operationFailed: '操作失败，请检查输入值后重试。',
  resizePaperEast: '水平调整纸张大小',
  resizePaperSouth: '垂直调整纸张大小',
  resizePaperCorner: '同时调整纸张宽高',
  resizeImage: '调整图片大小',
  imageLabel: '已添加图片',
};

export function getScrollCreatorCopy(locale: ScrollLocale): ScrollCreatorCopy {
  if (locale === 'en') {
    return englishCopy;
  }

  if (locale === 'zh') {
    return chineseCopy;
  }

  throw new Error(`Unknown scroll creator locale. Received ${JSON.stringify(locale)}.`);
}
