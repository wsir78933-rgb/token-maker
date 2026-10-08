import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorCopy = {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly title: string;
  readonly description: string;
  readonly navigationTitle: string;
  readonly createTitle: string;
  readonly createDescription: string;
  readonly create: string;
  readonly update: string;
  readonly close: string;
  readonly returnToSettings: string;
  readonly resumeCalendar: string;
  readonly editSettingsTitle: string;
  readonly editSettingsDescription: string;
  readonly regenerateCalendar: string;
  readonly regenerateTitle: string;
  readonly regenerateDescription: string;
  readonly regenerateConfirm: string;
  readonly cancel: string;
  readonly save: string;
  readonly archives: string;
  readonly print: string;
  readonly continued: string;
  readonly help: string;
  readonly previousYear: string;
  readonly nextYear: string;
  readonly year: string;
  readonly monthCount: string;
  readonly uniformDays: string;
  readonly fillAllMonths: string;
  readonly monthName: string;
  readonly monthDays: string;
  readonly weekdayCount: string;
  readonly weekdayName: string;
  readonly startWeekday: string;
  readonly basicTab: string;
  readonly weekTab: string;
  readonly moonsTab: string;
  readonly disastersTab: string;
  readonly monthDetails: string;
  readonly weekDetails: string;
  readonly optionalSettings: string;
  readonly whiteMoon: string;
  readonly blueMoon: string;
  readonly redMoon: string;
  readonly cycleDays: string;
  readonly cycleOff: string;
  readonly disasterChance: string;
  readonly disasterOff: string;
  readonly disasterPool: string;
  readonly monthFallback: string;
  readonly weekdayFallback: string;
  readonly day: string;
  readonly daysUnit: string;
  readonly monthJump: string;
  readonly previousMonth: string;
  readonly nextMonth: string;
  readonly editDayHint: string;
  readonly multiSelect: string;
  readonly finishSelection: string;
  readonly selectedDates: string;
  readonly clearSelection: string;
  readonly dayNotes: string;
  readonly manualIcon: string;
  readonly ordinaryIcons: string;
  readonly moonIcons: string;
  readonly clearManual: string;
  readonly undoMarker: string;
  readonly automaticLayers: string;
  readonly slot: string;
  readonly emptySlot: string;
  readonly currentSlot: string;
  readonly open: string;
  readonly loaded: string;
  readonly saveHere: string;
  readonly saveAsHere: string;
  readonly updateCurrent: string;
  readonly localNotice: string;
  readonly completeSaveNotice: string;
  readonly unsaved: string;
  readonly saved: string;
  readonly unsavedTitle: string;
  readonly unsavedDescription: string;
  readonly discardContinue: string;
  readonly saveContinue: string;
  readonly overwriteTitle: string;
  readonly overwriteDescription: string;
  readonly confirmOverwrite: string;
  readonly saveTarget: string;
  readonly sourceSlotExcluded: string;
  readonly saveFailed: string;
  readonly loadFailed: string;
  readonly genericError: string;
  readonly noDates: string;
  readonly invalidValue: string;
  readonly rules: string;
  readonly yearEnterHint: string;
  readonly noSelection: string;
  readonly undoUnavailable: string;
  readonly notePlaceholder: string;
  readonly advancedOffHint: string;
  readonly defaultSummary: string;
  readonly uniformDraftHint: string;
  readonly rulesRebuildHint: string;
  readonly batchApplied: string;
  readonly saveLocationCleared: string;
};

const englishCalendarCreatorCopy: CalendarCreatorCopy = {
  pageTitle: 'Free Fantasy Calendar Generator | Create Your World’s Calendar',
  pageDescription:
    'Create a time system for your fantasy world. Customize months, weekdays and moon cycles, mark important dates, and add notes.',
  title: 'Fantasy Calendar Generator',
  description:
    'Design a custom calendar for your fantasy world, science-fiction setting, novel, or D&D campaign. Set month lengths, weekday names, moon cycles, events, notes, and printable year views.',
  navigationTitle: 'Fantasy Calendar Generator',
  createTitle: 'Start a calendar',
  createDescription:
    'Use practical defaults, then adjust individual month lengths and advanced rules when you need them.',
  create: 'Create calendar',
  update: 'Update calendar',
  close: 'Close',
  returnToSettings: 'Back to settings',
  resumeCalendar: 'Back to calendar',
  editSettingsTitle: 'Adjust calendar settings',
  editSettingsDescription:
    'Your current calendar is kept while you edit settings. It changes only after you confirm regeneration.',
  regenerateCalendar: 'Regenerate calendar',
  regenerateTitle: 'Regenerate this calendar?',
  regenerateDescription:
    'The year will be rebuilt with the new settings. Current notes and manual icons will be cleared, and moon phases and disasters will be generated again. Saved archives will be kept.',
  regenerateConfirm: 'Confirm regeneration',
  cancel: 'Cancel',
  save: 'Save',
  archives: 'Archives',
  print: 'Print',
  continued: 'continued',
  help: 'Help',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  year: 'Year',
  monthCount: 'Number of months',
  uniformDays: 'Days per month',
  fillAllMonths: 'Fill all months',
  monthName: 'Month name',
  monthDays: 'Days in month',
  weekdayCount: 'Days per week',
  weekdayName: 'Weekday name',
  startWeekday: 'First weekday',
  basicTab: 'Basic',
  weekTab: 'Weekdays',
  moonsTab: 'Moons',
  disastersTab: 'Disasters',
  monthDetails: 'Month details',
  weekDetails: 'Weekday details',
  optionalSettings: 'Optional settings',
  whiteMoon: 'White moon',
  blueMoon: 'Blue moon',
  redMoon: 'Red moon',
  cycleDays: 'Cycle length in days',
  cycleOff: 'Blank or 0 turns this moon off.',
  disasterChance: 'Daily disaster chance (%)',
  disasterOff: 'Blank or 0 turns disasters off.',
  disasterPool: 'Random disaster icon pool',
  monthFallback: 'Month {number}',
  weekdayFallback: 'Day {number}',
  day: 'Day',
  daysUnit: 'days',
  monthJump: 'Month',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  editDayHint: 'Click the date to edit its note. Use the checkbox for multi-select.',
  multiSelect: 'Select dates',
  finishSelection: 'Finish selection',
  selectedDates: 'Selected dates',
  clearSelection: 'Clear selection',
  dayNotes: 'Day notes',
  manualIcon: 'Manual icon',
  ordinaryIcons: 'Ordinary icons',
  moonIcons: 'Moon icons',
  clearManual: 'Clear manual icon',
  undoMarker: 'Undo marker',
  automaticLayers: 'Automatic layers',
  slot: 'Slot',
  emptySlot: 'Empty slot',
  currentSlot: 'Current slot',
  open: 'Open',
  loaded: 'Loaded',
  saveHere: 'Save here',
  saveAsHere: 'Save as here',
  updateCurrent: 'Update current',
  localNotice: 'Saved only in this browser',
  completeSaveNotice:
    'Saves include calendar rules, year, automatic layers, manual icons, and notes.',
  unsaved: 'Unsaved changes',
  saved: 'Saved',
  unsavedTitle: 'Unsaved changes',
  unsavedDescription:
    'You have unsaved calendar changes. Choose whether to discard them, save them, or cancel.',
  discardContinue: 'Discard and continue',
  saveContinue: 'Save and continue',
  overwriteTitle: 'Overwrite this slot?',
  overwriteDescription:
    'This slot already contains a calendar. Saving here replaces its full contents.',
  confirmOverwrite: 'Overwrite slot',
  saveTarget: 'Choose a save slot',
  sourceSlotExcluded: "The calendar's current slot cannot be used as the save-and-continue target.",
  saveFailed: 'The calendar could not be saved. Your current edits and the previous saved copy were preserved.',
  loadFailed: 'The calendar could not be loaded because the saved data is invalid.',
  genericError: 'Something went wrong. Received {value}.',
  noDates: 'This month has no dates.',
  invalidValue: 'Enter a valid value.',
  rules: 'Calendar rules',
  yearEnterHint: 'Enter a year and press Enter to update it. Previous year and Next year change it directly.',
  noSelection: 'No dates selected.',
  undoUnavailable: 'There is no manual icon change to undo.',
  notePlaceholder: 'Write a note for this day',
  advancedOffHint: 'Optional rules stay off until you open them.',
  defaultSummary: '4 months · 3 weekdays · 120 days',
  uniformDraftHint: 'Set one day count, then fill every month. Each month can still be changed.',
  rulesRebuildHint:
    'Applying new rules rebuilds the year; notes, manual icons, moon counters, and disasters follow the documented calendar rules.',
  batchApplied: 'Icon applied to selected dates.',
  saveLocationCleared: 'New year or rebuilt calendar needs a new save location.',
};

const chineseCalendarCreatorCopy: CalendarCreatorCopy = {
  pageTitle: '免费奇幻历法生成器 | 在线创建你的世界历法',
  pageDescription: '为你的奇幻世界建立独特的时间体系。自定义月份、星期和月亮周期，标记重要日期、记录故事事件。',
  title: '奇幻历法生成器',
  description:
    '为你的奇幻世界、科幻设定、小说或 D&D 战役设计自定义历法。设置月份长度、星期名称、月亮周期、事件、笔记和可打印的整年视图。',
  navigationTitle: '奇幻历法生成器',
  createTitle: '创建历法',
  createDescription: '先使用实用默认值创建，再按需要调整每月天数和高级规则。',
  create: '创建历法',
  update: '更新历法',
  close: '关闭',
  returnToSettings: '返回设置',
  resumeCalendar: '返回历法',
  editSettingsTitle: '修改历法设置',
  editSettingsDescription: '调整参数时当前历法会保留，确认重新生成后才会更新。',
  regenerateCalendar: '重新生成历法',
  regenerateTitle: '重新生成历法？',
  regenerateDescription: '将按新设置重建整年，清除当前笔记和手动图标，并重新生成月相和灾害。已保存的存档不会被删除。',
  regenerateConfirm: '确认重新生成',
  cancel: '取消',
  save: '保存',
  archives: '存档',
  print: '打印',
  continued: '续',
  help: '帮助',
  previousYear: '上一年',
  nextYear: '下一年',
  year: '年份',
  monthCount: '月份数量',
  uniformDays: '每月天数',
  fillAllMonths: '填入全部月份',
  monthName: '月份名称',
  monthDays: '本月天数',
  weekdayCount: '每周天数',
  weekdayName: '星期名称',
  startWeekday: '年初星期',
  basicTab: '基础',
  weekTab: '星期',
  moonsTab: '月亮',
  disastersTab: '灾害',
  monthDetails: '月份详情',
  weekDetails: '星期详情',
  optionalSettings: '可选设置',
  whiteMoon: '白月亮',
  blueMoon: '蓝月亮',
  redMoon: '红月亮',
  cycleDays: '周期长度 / 天',
  cycleOff: '留空或 0：关闭这颗月亮。',
  disasterChance: '每日灾害概率 (%)',
  disasterOff: '留空或 0：关闭灾害。',
  disasterPool: '随机灾害图标池',
  monthFallback: '月份 {number}',
  weekdayFallback: '星期 {number}',
  day: '日期',
  daysUnit: '天',
  monthJump: '月份',
  previousMonth: '上一月',
  nextMonth: '下一月',
  editDayHint: '点击日期正文编辑笔记；勾选方框可批量选择。',
  multiSelect: '选择日期',
  finishSelection: '完成选择',
  selectedDates: '已选日期',
  clearSelection: '清空选择',
  dayNotes: '日期笔记',
  manualIcon: '手动图标',
  ordinaryIcons: '普通图标',
  moonIcons: '月相图标',
  clearManual: '清空手动图标',
  undoMarker: '撤销标记',
  automaticLayers: '自动图层',
  slot: '槽位',
  emptySlot: '空槽位',
  currentSlot: '当前槽位',
  open: '打开',
  loaded: '已读取',
  saveHere: '保存到此',
  saveAsHere: '另存到此',
  updateCurrent: '更新当前',
  localNotice: '只保存在当前浏览器',
  completeSaveNotice: '存档包含历法规则、年份、自动图层、手动图标和笔记。',
  unsaved: '有未保存内容',
  saved: '已保存',
  unsavedTitle: '有未保存内容',
  unsavedDescription: '当前历法有未保存修改。请选择放弃修改、先保存，或取消操作。',
  discardContinue: '放弃并继续',
  saveContinue: '保存并继续',
  overwriteTitle: '覆盖这个槽位？',
  overwriteDescription: '这个槽位已有历法；保存到这里会替换其中的全部内容。',
  confirmOverwrite: '确认覆盖',
  saveTarget: '选择存档槽位',
  sourceSlotExcluded: '当前历法所在槽位不能作为“保存并继续”的目标。',
  saveFailed: '历法保存失败；当前编辑内容和原有存档均已保留。',
  loadFailed: '历法加载失败，因为存档数据无效。',
  genericError: '操作失败。收到的值：{value}。',
  noDates: '这个月份没有日期。',
  invalidValue: '请输入有效值。',
  rules: '历法规则',
  yearEnterHint: '输入年份后按 Enter 更新；上一年和下一年按钮会直接切换。',
  noSelection: '尚未选择日期。',
  undoUnavailable: '没有可撤销的手动图标操作。',
  notePlaceholder: '填写当天笔记',
  advancedOffHint: '高级规则保持关闭，直到你主动展开。',
  defaultSummary: '4 个月 · 每周 3 天 · 120 天',
  uniformDraftHint: '先设置统一天数，再填入全部月份；之后仍可逐月修改。',
  rulesRebuildHint: '应用新规则会重建这一年；笔记、手动图标、月亮计数和灾害按历法规则处理。',
  batchApplied: '图标已应用到所选日期。',
  saveLocationCleared: '新年份或重建历法后，需要重新选择存档位置。',
};

export function getCalendarCreatorCopy(locale: SiteLocale): CalendarCreatorCopy {
  if (locale === 'en') {
    return englishCalendarCreatorCopy;
  }

  if (locale === 'zh') {
    return chineseCalendarCreatorCopy;
  }

  throw new Error(`Unknown calendar creator locale. Received ${JSON.stringify(locale)}.`);
}
