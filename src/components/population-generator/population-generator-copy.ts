import type { PopulationAgricultureKey, PopulationStatKey } from './population-result-edits';
import type { PopulationEraName, PopulationSizeName } from './population-preset-list';

export interface PopulationGeneratorCopy {
  preparing: string;
  settingsTitle: string;
  eraLegend: string;
  sizeLegend: string;
  eras: Record<PopulationEraName, string>;
  sizes: Record<PopulationSizeName, string>;
  rangeLabel: string;
  regenerate: string;
  medievalNote: string;
  replaceNote: string;
  overviewLead: string;
  editHint: string;
  agricultureShow: string;
  agricultureHide: string;
  agricultureTitle: string;
  agricultureHint: string;
  saveLoad: string;
  fileMenu: string;
  fileMenuMobile: string;
  exportTxt: string;
  importFile: string;
  printFull: string;
  professionLead: string;
  professionTitle: (total: number) => string;
  professionSearchLabel: string;
  hideZeroCounts: string;
  visibleCount: (visible: number, total: number) => string;
  professionNameHeader: string;
  professionCountHeader: string;
  professionNameField: (index: number) => string;
  professionCountField: (index: number) => string;
  professionEmpty: string;
  professionNote: string;
  helpTitle: string;
  helpSummary: string;
  helpIntro: string;
  helpRegenerate: string;
  helpAreas: string;
  helpEdits: string;
  helpAgriculture: string;
  helpProfessions: string;
  helpSlots: string;
  helpRange: (eraLabel: string, detail: string) => string;
  helpRulesTitle: string;
  helpRangesTitle: string;
  helpNumbersTitle: string;
  helpSavingTitle: string;
  helpSizeColumn: string;
  helpRangeColumn: string;
  helpUnavailable: string;
  integerError: string;
  decimalError: string;
  numberBlocked: string;
  slotsTitle: string;
  slotsDescription: string;
  close: string;
  slotName: (slotNumber: number) => string;
  slotSaved: (settlementName: string) => string;
  slotEmpty: string;
  save: string;
  load: string;
  loadUnavailable: string;
  slotsBrowser: string;
  slotsBackup: string;
  slotSavedStatus: (slotNumber: number) => string;
  storageUnavailable: (detail: string) => string;
  storageQuota: string;
  confirmReplaceTitle: string;
  confirmEdited: string;
  confirmGenerateBody: string;
  keepResult: string;
  continueGenerate: string;
  confirmLoadBody: string;
  continueLoad: string;
  confirmImportBody: string;
  continueImport: string;
  confirmSlotTitle: (slotNumber: number) => string;
  confirmSlotDetail: (slotNumber: number) => string;
  confirmSlotBody: (slotNumber: number) => string;
  keepSlot: string;
  continueSave: string;
  fileChoosing: string;
  fileReading: string;
  importSuccess: string;
  importInvalid: (detail: string) => string;
  importNotUtf8: string;
  nameLabelField: string;
  nameValueField: string;
  statLabelField: Record<PopulationStatKey, string>;
  statValueField: Record<PopulationStatKey, string>;
  agricultureLabelField: Record<PopulationAgricultureKey, string>;
  agricultureValueField: Record<PopulationAgricultureKey, string>;
}

const englishCopy: PopulationGeneratorCopy = {
  preparing: 'Preparing a settlement…',
  settingsTitle: 'Generator settings',
  eraLegend: 'Era',
  sizeLegend: 'Size · click to generate',
  eras: { medieval: 'Medieval', modern: 'Modern', future: 'Future' },
  sizes: {
    village: 'Village',
    town: 'Town',
    city: 'City',
    'large-city': 'Large city',
    metropolis: 'Metropolis',
  },
  rangeLabel: 'Population range of the current result',
  regenerate: 'Generate again',
  medievalNote: 'Medieval does not offer a metropolis.',
  replaceNote: 'Manual edits are confirmed before they are replaced.',
  overviewLead: 'Settlement overview',
  editHint: 'Click a field to edit it',
  agricultureShow: 'Agriculture',
  agricultureHide: 'Agriculture',
  agricultureTitle: 'Agriculture and livestock',
  agricultureHint: 'Field labels and values can each be edited.',
  saveLoad: 'Save / load',
  fileMenu: 'File / print',
  fileMenuMobile: 'More',
  exportTxt: 'Export TXT',
  importFile: 'Import file',
  printFull: 'Print full result',
  professionLead: 'Professions',
  professionTitle: (total) => `Professions · ${total}`,
  professionSearchLabel: 'Search profession names',
  hideZeroCounts: 'Hide zero counts',
  visibleCount: (visible, total) => `Showing ${visible} / ${total}`,
  professionNameHeader: 'Profession',
  professionCountHeader: 'Count',
  professionNameField: (index) => `Profession name ${index}`,
  professionCountField: (index) => `Count ${index}`,
  professionEmpty: 'No professions match this search.',
  professionNote:
    'Each row has one count. Read it as how many people do the job or how many institutions there are. These counts do not add up to the population.',
  helpTitle: 'How to use these numbers',
  helpSummary: 'Names, labels, and counts can be edited separately.',
  helpIntro:
    'On the first visit, the population generator picks one of the 14 presets at random and generates a settlement. Changing the era only changes which sizes are available. Click a size to generate it. Medieval has 4 sizes. Modern and future each have 5.',
  helpRegenerate:
    'Generate again in the population generator uses the era and size of the current result. If you edited anything, generate, load, and import ask before replacing it. Cancel keeps the current text and numbers and puts the era and size buttons back on that result.',
  helpAreas:
    'The population generator shows generated area in square kilometers and square miles, each to 3 decimal places. At generation, square miles = square kilometers × 0.386102. Editing one area does not change the other.',
  helpEdits:
    'You can edit the settlement name, every field label, every profession name, and every count on its own in the population generator. Each profession row has one count, which you can read as people or institutions. Changing the population does not recalculate the other values.',
  helpAgriculture:
    'Agriculture in the population generator starts collapsed. Save, TXT export, and full print still include all six agriculture fields. Search and hide-zero only change which rows are shown.',
  helpProfessions:
    'Each profession row in the population generator has one count. For your world, that count can mean how many people do the job or how many institutions there are. Those counts do not have to add up to the population. Farmers in the agriculture section are the people farming in this settlement. On a phone, the profession list scrolls inside a height-limited area, with search, the zero filter, and column labels at the top; all 170 rows remain accessible. On a desktop, the profession list scrolls inside its own area.',
  helpSlots:
    'The population generator keeps five browser slots that store the full result on this device. An empty slot cannot be loaded. Saving over a used slot asks first. Close the file menu without choosing an action and the result stays as it is.',
  helpRange: (eraLabel, detail) => `${eraLabel}: ${detail}.`,
  helpRulesTitle: 'Generation rules',
  helpRangesTitle: 'Population ranges',
  helpNumbersTitle: 'Understanding the numbers',
  helpSavingTitle: 'Saving your results',
  helpSizeColumn: 'Size',
  helpRangeColumn: 'Range',
  helpUnavailable: 'Not offered',
  integerError: 'Enter a non-negative integer',
  decimalError: 'Enter a non-negative number',
  numberBlocked: 'Fix the highlighted numbers before saving, exporting, or printing.',
  slotsTitle: 'Save and load',
  slotsDescription: 'Save the full result, including manual edits.',
  close: 'Close',
  slotName: (slotNumber) => `Slot ${slotNumber}`,
  slotSaved: (settlementName) => `Saved · ${settlementName}`,
  slotEmpty: 'Empty slot',
  save: 'Save',
  load: 'Load',
  loadUnavailable: 'Load unavailable',
  slotsBrowser: 'Saves stay in this browser.',
  slotsBackup: 'Download population.txt as a backup. It stores the population, agriculture, and occupation details as HTML and can be imported again. JSON archives exported earlier by this tool can still be read.',
  slotSavedStatus: (slotNumber) => `Saved slot ${slotNumber}.`,
  storageUnavailable: (detail) => `Browser storage is unavailable: ${detail}`,
  storageQuota: 'This browser has no room left, so the slot was not saved.',
  confirmReplaceTitle: 'Replace the current result?',
  confirmEdited: 'You have manual edits.',
  confirmGenerateBody: 'Continuing will replace the current result.',
  keepResult: 'Keep current result',
  continueGenerate: 'Continue generating',
  confirmLoadBody: 'Continuing will replace the current result with the saved slot.',
  continueLoad: 'Continue loading',
  confirmImportBody: 'Continuing will replace the current result with the imported file.',
  continueImport: 'Continue importing',
  confirmSlotTitle: (slotNumber) => `Replace slot ${slotNumber}?`,
  confirmSlotDetail: (slotNumber) => `Slot ${slotNumber} already has a save.`,
  confirmSlotBody: (slotNumber) => `Continuing will overwrite slot ${slotNumber}.`,
  keepSlot: 'Keep saved slot',
  continueSave: 'Continue saving',
  fileChoosing: 'Choosing a file…',
  fileReading: 'Reading…',
  importSuccess: 'Import succeeded',
  importInvalid: (detail) => `Import failed: ${detail}`,
  importNotUtf8: 'Import failed: the file is not valid UTF-8.',
  nameLabelField: 'Settlement name label',
  nameValueField: 'Settlement name',
  statLabelField: {
    population: 'Population label',
    households: 'Households label',
    areaKm2: 'Square kilometer label',
    areaMi2: 'Square mile label',
  },
  statValueField: {
    population: 'Population',
    households: 'Households',
    areaKm2: 'Square kilometers',
    areaMi2: 'Square miles',
  },
  agricultureLabelField: {
    farmers: 'Farmers label',
    farmland: 'Farmland label',
    livestock: 'Livestock label',
    fowl: 'Fowl label',
    cattleAndPigs: 'Cattle and pigs label',
    otherLivestock: 'Other livestock label',
  },
  agricultureValueField: {
    farmers: 'Farmers',
    farmland: 'Farmland acres',
    livestock: 'Livestock',
    fowl: 'Fowl',
    cattleAndPigs: 'Cattle and pigs',
    otherLivestock: 'Other livestock',
  },
};

const chineseCopy: PopulationGeneratorCopy = {
  preparing: '正在准备聚落…',
  settingsTitle: '生成设置',
  eraLegend: '时代',
  sizeLegend: '规模 · 点选生成',
  eras: { medieval: '中世纪', modern: '现代', future: '未来' },
  sizes: {
    village: '村庄',
    town: '城镇',
    city: '城市',
    'large-city': '大城市',
    metropolis: '大都市',
  },
  rangeLabel: '当前结果人口范围',
  regenerate: '再次生成',
  medievalNote: '中世纪不提供大都市。',
  replaceNote: '有手工修改时先确认替换。',
  overviewLead: '聚落概况',
  editHint: '点击字段编辑',
  agricultureShow: '农业明细',
  agricultureHide: '农业明细',
  agricultureTitle: '农业与牲畜',
  agricultureHint: '字段标签与数值均可编辑。',
  saveLoad: '保存 / 读取',
  fileMenu: '文件 / 打印',
  fileMenuMobile: '更多',
  exportTxt: '导出 TXT',
  importFile: '导入文件',
  printFull: '打印完整结果',
  professionLead: '职业分布',
  professionTitle: (total) => `职业分布 · 共 ${total} 条`,
  professionSearchLabel: '搜索职业名称',
  hideZeroCounts: '隐藏零数量',
  visibleCount: (visible, total) => `显示 ${visible} / ${total}`,
  professionNameHeader: '职业名称',
  professionCountHeader: '数量',
  professionNameField: (index) => `职业名称 ${index}`,
  professionCountField: (index) => `数量 ${index}`,
  professionEmpty: '没有符合条件的职业。',
  professionNote: '每行只有一个数量，可按世界设定理解为从业人数或机构数。这些数量加起来不必等于总人口。',
  helpTitle: '使用说明与数字解释',
  helpSummary: '字段与职业名称、数量可编辑。',
  helpIntro:
    '首次进入时，人口生成器会从 14 个预设里随机选一个并生成。选择时代只切换可用规模。点击规模才生成。中世纪有 4 种规模，现代和未来各有 5 种。',
  helpRegenerate:
    '人口生成器的再次生成沿用当前结果的时代和规模。生成、读取和导入遇到手工修改时会先询问。取消会保留当前内容，并把时代和规模按钮恢复到当前结果。',
  helpAreas:
    '人口生成器会同时以平方公里和平方英里显示生成的面积，各显示 3 位小数。生成时平方英里 = 平方公里 × 0.386102。之后单独修改其中一项，另一项不会跟着变。',
  helpEdits:
    '在人口生成器里，聚落名称、所有字段标签、职业名称和数量都可以单独修改。每个职业只有一个数量，可理解为从业人数或机构数。修改人口不会重算其他数值。',
  helpAgriculture:
    '人口生成器里的农业默认折叠。保存、导出 TXT 和完整打印仍包含全部 6 项。搜索和隐藏零数量只改变列表显示。',
  helpProfessions:
    '人口生成器里每个职业只有一行、一个数量。按你的世界设定，这个数量可以理解为从业人数或机构数，加总后不必等于总人口。农业里的农民人数是这个聚落本地的务农人数。手机上，职业列表在限高区域内滚动，搜索、零数量筛选和列标题保持在列表顶部，170 条职业仍可全部访问。桌面列表在区域内滚动。',
  helpSlots:
    '人口生成器在这个浏览器里有 5 个槽位，保存完整结果。空槽位不能读取。覆盖已有槽位前会先确认。关掉文件菜单而不选择操作，结果保持不变。',
  helpRange: (eraLabel, detail) => `${eraLabel}：${detail}。`,
  helpRulesTitle: '生成规则',
  helpRangesTitle: '人口范围',
  helpNumbersTitle: '数字解释',
  helpSavingTitle: '保存说明',
  helpSizeColumn: '规模',
  helpRangeColumn: '范围',
  helpUnavailable: '不提供',
  integerError: '请输入非负整数',
  decimalError: '请输入非负数字',
  numberBlocked: '请先修正标出的数字，再保存、导出或打印。',
  slotsTitle: '保存与读取',
  slotsDescription: '保存全部结果与手工编辑。',
  close: '关闭',
  slotName: (slotNumber) => `槽位 ${slotNumber}`,
  slotSaved: (settlementName) => `已保存 · ${settlementName}`,
  slotEmpty: '空槽位',
  save: '保存',
  load: '读取',
  loadUnavailable: '读取·禁用',
  slotsBrowser: '存档保存在此浏览器。',
  slotsBackup: '下载 population.txt 作为备份。文件保存人口统计、农业与职业明细的 HTML，可重新导入继续编辑，也支持读取本工具以前导出的 JSON 存档。',
  slotSavedStatus: (slotNumber) => `已保存槽位 ${slotNumber}。`,
  storageUnavailable: (detail) => `无法使用浏览器存储：${detail}`,
  storageQuota: '浏览器存储空间不足，这次没有保存。',
  confirmReplaceTitle: '替换当前结果？',
  confirmEdited: '当前有手工修改。',
  confirmGenerateBody: '继续生成将覆盖当前结果。',
  keepResult: '保留当前结果',
  continueGenerate: '继续生成',
  confirmLoadBody: '继续读取将覆盖当前结果。',
  continueLoad: '继续读取',
  confirmImportBody: '继续导入将覆盖当前结果。',
  continueImport: '继续导入',
  confirmSlotTitle: (slotNumber) => `覆盖槽位 ${slotNumber}？`,
  confirmSlotDetail: (slotNumber) => `槽位 ${slotNumber} 已有存档。`,
  confirmSlotBody: (slotNumber) => `继续保存将覆盖槽位 ${slotNumber}。`,
  keepSlot: '保留槽位',
  continueSave: '继续保存',
  fileChoosing: '选择文件…',
  fileReading: '读取中…',
  importSuccess: '导入成功',
  importInvalid: (detail) => `导入失败：${detail}`,
  importNotUtf8: '导入失败：文件不是有效的 UTF-8。',
  nameLabelField: '聚落名称的标签',
  nameValueField: '聚落名称',
  statLabelField: {
    population: '总人口的标签',
    households: '住户的标签',
    areaKm2: '平方公里的标签',
    areaMi2: '平方英里的标签',
  },
  statValueField: {
    population: '总人口',
    households: '住户',
    areaKm2: '平方公里',
    areaMi2: '平方英里',
  },
  agricultureLabelField: {
    farmers: '农民人数的标签',
    farmland: '种植农田的标签',
    livestock: '牲畜总数的标签',
    fowl: '禽类的标签',
    cattleAndPigs: '牛与猪的标签',
    otherLivestock: '其他牲畜的标签',
  },
  agricultureValueField: {
    farmers: '农民人数',
    farmland: '耕地英亩',
    livestock: '牲畜总数',
    fowl: '禽类',
    cattleAndPigs: '牛与猪',
    otherLivestock: '其他牲畜',
  },
};

export function getPopulationGeneratorCopy(locale: 'en' | 'zh'): PopulationGeneratorCopy {
  if (locale === 'zh') {
    return chineseCopy;
  }

  if (locale === 'en') {
    return englishCopy;
  }

  throw new Error(`Population generator locale must be "en" or "zh". Received ${JSON.stringify(locale)}.`);
}
