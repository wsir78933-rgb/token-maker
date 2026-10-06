import type { SiteLocale } from '@/lib/site-locale';

export type LanguageGeneratorCopy = {
  readonly navigationTitle: string;
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly heroAction: string;
  readonly workspaceLabel: string;
  readonly vocabularyTab: string;
  readonly textTab: string;
  readonly rulesTab: string;
  readonly referenceTab: string;
  readonly storageButton: string;
  readonly vocabularyTitle: string;
  readonly vocabularyDescription: string;
  readonly randomPresetLabel: string;
  readonly randomizeButton: string;
  readonly alphabetLabel: string;
  readonly expandAlphabetButton: string;
  readonly collapseAlphabetButton: string;
  readonly allCategoriesLabel: string;
  readonly sourceHeading: string;
  readonly resultHeading: string;
  readonly applyRulesButton: string;
  readonly copyButton: string;
  readonly copiedLabel: string;
  readonly textTitle: string;
  readonly textDescription: string;
  readonly inputLabel: string;
  readonly inputPlaceholder: string;
  readonly outputLabel: string;
  readonly emptyOutput: string;
  readonly translateButton: string;
  readonly clearButton: string;
  readonly characterRulesTitle: string;
  readonly combinationRulesTitle: string;
  readonly sourceRuleHeading: string;
  readonly targetRuleHeading: string;
  readonly characterRulesHint: string;
  readonly combinationRulesHint: string;
  readonly combinationsEnabledLabel: string;
  readonly ruleOrderHint: string;
  readonly resetRulesButton: string;
  readonly saveRulesButton: string;
  readonly rulesAppliedMessage: string;
  readonly resetRulesMessage: string;
  readonly referenceTitle: string;
  readonly referenceDescription: string;
  readonly standardReferencesLabel: string;
  readonly communityReferencesLabel: string;
  readonly referenceLanguageLabel: string;
  readonly referenceRomanizationHint: string;
  readonly referenceUnavailable: string;
  readonly storageTitle: string;
  readonly storageDescription: string;
  readonly saveButton: string;
  readonly loadButton: string;
  readonly closeButton: string;
  readonly emptySlotLabel: string;
  readonly storedSlotLabel: string;
  readonly loadHint: string;
  readonly localStorageHint: string;
  readonly storageErrorLabel: string;
  readonly saveSuccessMessage: string;
  readonly loadSuccessMessage: string;
  readonly copyErrorLabel: string;
  readonly translationHint: string;
  readonly replaceSlotTitle: string;
  readonly replaceSlotDescription: string;
  readonly replaceSlotButton: string;
  readonly cancelButton: string;
};

const englishLanguageGeneratorCopy: LanguageGeneratorCopy = {
  navigationTitle: 'Language Generator',
  pageTitle: 'Free Fantasy Language Generator – Create Fictional Languages',
  pageDescription:
    'Free fantasy language generator for novels, worldbuilding, D&D, TRPG, and indie games. Generate words and phrases with custom spelling rules. No account needed.',
  eyebrow: 'FANTASY WORLDBUILDING TOOL',
  title: 'Free Fantasy Language Generator',
  description:
    'Create a fictional language for your novel, fantasy world, D&D or TRPG campaign, or indie game for free. Generate words and phrases, customize spelling rules, and get started without an account.',
  heroAction: 'Try for Free',
  workspaceLabel: 'Language workspace',
  vocabularyTab: 'Vocabulary',
  textTab: 'Text converter',
  rulesTab: 'Spelling rules',
  referenceTab: 'Language references',
  storageButton: 'Saved rules',
  vocabularyTitle: 'Vocabulary list',
  vocabularyDescription:
    'Generate or edit 67 words and phrases, then apply your spelling rules to see the results.',
  randomPresetLabel: 'Random language preset',
  randomizeButton: 'Randomize language',
  alphabetLabel: 'Display alphabet',
  expandAlphabetButton: 'Expand alphabet',
  collapseAlphabetButton: 'Collapse alphabet',
  allCategoriesLabel: 'All categories',
  sourceHeading: 'Source',
  resultHeading: 'Result',
  applyRulesButton: 'Apply rules',
  copyButton: 'Copy result',
  copiedLabel: 'Copied',
  textTitle: 'Convert custom text',
  textDescription:
    'Apply your spelling rules to a phrase or paragraph. This tool changes spelling patterns; it does not translate meaning.',
  inputLabel: 'Input text',
  inputPlaceholder: 'Type a phrase or paragraph to convert',
  outputLabel: 'Converted text',
  emptyOutput: 'Your converted text will appear here.',
  translateButton: 'Convert text',
  clearButton: 'Clear',
  characterRulesTitle: 'Single-character rules',
  combinationRulesTitle: 'Combination rules',
  sourceRuleHeading: 'Source',
  targetRuleHeading: 'Target',
  characterRulesHint:
    'Replace each source value with its target value. Both source and target values can contain up to 3 characters. Leave a source blank to disable that row; leave a target blank to delete matching content. Source values are matched literally, not as regular expressions.',
  combinationRulesHint:
    'Replace matching combinations before single-character rules. Each source and target combination can contain up to 4 characters. Order matters, and converted pieces are not processed again.',
  combinationsEnabledLabel: 'Enable combination rules',
  ruleOrderHint: 'Combination rules run first, followed by single-character rules.',
  resetRulesButton: 'Reset rules',
  saveRulesButton: 'Save rules',
  rulesAppliedMessage: 'Spelling rules applied.',
  resetRulesMessage: 'Rules reset to the default preset.',
  referenceTitle: 'Language references',
  referenceDescription:
    'Choose a fixed reference vocabulary to view romanized spellings. These references do not translate arbitrary sentences.',
  standardReferencesLabel: 'Standard references',
  communityReferencesLabel: 'Community references',
  referenceLanguageLabel: 'Reference language',
  referenceRomanizationHint:
    'These are fixed romanization references. Some entries may be unavailable, and the original word list may need correction; they are not verified semantic translations.',
  referenceUnavailable: 'No reference entry is available.',
  storageTitle: 'Saved rules',
  storageDescription:
    'Save and load 104 rule fields in one of eight local slots. Vocabulary, free text, and the combination-rule toggle are not stored. Loading does not convert text automatically.',
  saveButton: 'Save',
  loadButton: 'Load',
  closeButton: 'Close',
  emptySlotLabel: 'Empty slot',
  storedSlotLabel: 'Stored rules',
  loadHint: 'Loading restores the rule fields. Apply them when you are ready.',
  localStorageHint: 'Rules are stored only in this browser.',
  storageErrorLabel: 'Could not access local storage.',
  saveSuccessMessage: 'Rules saved.',
  loadSuccessMessage: 'Rules loaded.',
  copyErrorLabel: 'Could not copy the result.',
  translationHint:
    'Rules target Latin spelling. Unmatched characters, including Chinese characters, are preserved; this tool does not translate meaning.',
  replaceSlotTitle: 'Replace saved rules?',
  replaceSlotDescription: 'This slot already contains rules. Saving will replace its 104 rule fields.',
  replaceSlotButton: 'Replace slot',
  cancelButton: 'Cancel',
};

const chineseLanguageGeneratorCopy: LanguageGeneratorCopy = {
  navigationTitle: '语言生成器',
  pageTitle: '免费奇幻语言生成器｜为小说、跑团和游戏创建虚构语言',
  pageDescription:
    '免费为小说、世界观、TRPG/D&D 跑团和独立游戏创建虚构语言。生成词汇与短语，自定义拼写规则，无需注册。',
  eyebrow: '奇幻世界观工具',
  title: '免费奇幻语言生成器',
  description:
    '免费为小说、世界观设定、TRPG/D&D 战役和独立游戏创建虚构语言。生成词汇与短语，自定义拼写规则，无需注册即可开始。',
  heroAction: '免费试用',
  workspaceLabel: '语言工作区',
  vocabularyTab: '词汇生成',
  textTab: '文本转换',
  rulesTab: '拼写规则',
  referenceTab: '语言参考',
  storageButton: '规则存档',
  vocabularyTitle: '词汇列表',
  vocabularyDescription: '生成或编辑 67 个单词和短语，然后应用拼写规则查看转换结果。',
  randomPresetLabel: '随机语言预设',
  randomizeButton: '随机生成语言',
  alphabetLabel: '显示字母表',
  expandAlphabetButton: '展开字母表',
  collapseAlphabetButton: '收起字母表',
  allCategoriesLabel: '全部类别',
  sourceHeading: '原词',
  resultHeading: '结果',
  applyRulesButton: '应用规则',
  copyButton: '复制结果',
  copiedLabel: '已复制',
  textTitle: '转换自定义文本',
  textDescription:
    '将拼写规则应用到短语或段落。此工具只改变拼写模式，不翻译文本含义。',
  inputLabel: '输入文本',
  inputPlaceholder: '输入要转换的短语或段落',
  outputLabel: '转换后的文本',
  emptyOutput: '转换后的文本会显示在这里。',
  translateButton: '转换文本',
  clearButton: '清空',
  characterRulesTitle: '单字符规则',
  combinationRulesTitle: '字符组合规则',
  sourceRuleHeading: '原字符',
  targetRuleHeading: '目标字符',
  characterRulesHint:
    '编辑原值和目标值的替换关系；两列的每个值都最多可填写 3 个字符。来源留空会停用该行规则，目标留空会删除匹配内容。来源按字面量匹配，不按正则表达式处理。',
  combinationRulesHint:
    '字符组合会在单字符规则之前替换；两列的每个组合值最多可填写 4 个字符。顺序会影响结果，已转换的片段不会再次处理。',
  combinationsEnabledLabel: '启用字符组合规则',
  ruleOrderHint: '先运行字符组合规则，再运行单字符规则。',
  resetRulesButton: '重置规则',
  saveRulesButton: '保存规则',
  rulesAppliedMessage: '拼写规则已应用。',
  resetRulesMessage: '规则已重置为默认预设。',
  referenceTitle: '语言参考',
  referenceDescription:
    '选择固定的参考词表查看罗马化拼写。这些参考内容不翻译任意句子。',
  standardReferencesLabel: '标准参考语言',
  communityReferencesLabel: '社区参考语言',
  referenceLanguageLabel: '参考语言',
  referenceRomanizationHint:
    '此处显示固定的罗马转写参考；部分条目可能未收录，原始参考词表也可能需要校正，不代表已验证准确的语义翻译。',
  referenceUnavailable: '暂无可用的参考词条。',
  storageTitle: '规则存档',
  storageDescription:
    '将 104 个规则字段保存到 8 个本地槽位之一。词汇、自由文本和字符组合开关不会保存。加载后不会自动转换文本。',
  saveButton: '保存',
  loadButton: '加载',
  closeButton: '关闭',
  emptySlotLabel: '空槽位',
  storedSlotLabel: '已有规则',
  loadHint: '加载会恢复规则字段，准备好后请手动应用规则。',
  localStorageHint: '规则存档只保存在当前浏览器中。',
  storageErrorLabel: '无法访问本地存储。',
  saveSuccessMessage: '规则已保存。',
  loadSuccessMessage: '规则已加载。',
  copyErrorLabel: '无法复制结果。',
  translationHint: '规则针对拉丁拼写；未匹配的字符（包括中文字符）会保留，此工具不翻译文本含义。',
  replaceSlotTitle: '替换已有规则？',
  replaceSlotDescription: '此槽位已经包含规则，保存操作会替换其中的 104 个规则字段。',
  replaceSlotButton: '替换槽位',
  cancelButton: '取消',
};

export function getLanguageGeneratorCopy(locale: SiteLocale): LanguageGeneratorCopy {
  if (locale === 'en') {
    return englishLanguageGeneratorCopy;
  }

  if (locale === 'zh') {
    return chineseLanguageGeneratorCopy;
  }

  throw new Error(`Unknown language generator locale. Received ${JSON.stringify(locale)}.`);
}
