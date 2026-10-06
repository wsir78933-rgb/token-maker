import type { SiteLocale } from '@/lib/site-locale';

export type LanguageGeneratorFeatureIcon =
  | 'vocabulary'
  | 'rules'
  | 'text'
  | 'references'
  | 'saves'
  | 'copy';

export type LanguageGeneratorWhatIsCopy = {
  readonly title: string;
  readonly description: string;
};

export type LanguageGeneratorFeatureOverviewCopy = {
  readonly title: string;
  readonly subtitle: string;
  readonly features: readonly {
    readonly icon: LanguageGeneratorFeatureIcon;
    readonly title: string;
    readonly description: string;
  }[];
};

export type LanguageGeneratorHowItWorksCopy = {
  readonly eyebrow: string;
  readonly title: string;
  readonly steps: readonly {
    readonly title: string;
    readonly description: string;
  }[];
};

export type LanguageGeneratorCallToActionCopy = {
  readonly title: string;
  readonly description: string;
  readonly action: string;
};

export type LanguageGeneratorToolComparisonCopy = {
  readonly title: string;
  readonly description: string;
  readonly tableLabel: string;
  readonly dimensionHeading: string;
  readonly languageGeneratorHeading: string;
  readonly manualConlangingHeading: string;
  readonly vulgarlangHeading: string;
  readonly rows: readonly {
    readonly dimension: string;
    readonly languageGenerator: string;
    readonly manualConlanging: string;
    readonly vulgarlang: string;
  }[];
};

export type LanguageGeneratorCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly sourceLabel: string;
  readonly resultLabel: string;
  readonly presetLabel: string;
  readonly usageLabel: string;
  readonly notice: string;
  readonly cases: readonly {
    readonly id: string;
    readonly title: string;
    readonly presetId: number;
    readonly examples: readonly {
      readonly source: string;
      readonly result: string;
    }[];
    readonly usage: string;
  }[];
};

export type LanguageGeneratorFaqCopy = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly items: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
};

export type LanguageGeneratorPageCopy = {
  readonly whatIs: LanguageGeneratorWhatIsCopy;
  readonly featureOverview: LanguageGeneratorFeatureOverviewCopy;
  readonly howItWorks: LanguageGeneratorHowItWorksCopy;
  readonly callToAction: LanguageGeneratorCallToActionCopy;
  readonly toolComparison: LanguageGeneratorToolComparisonCopy;
  readonly caseStudies: LanguageGeneratorCaseStudiesCopy;
  readonly faq: LanguageGeneratorFaqCopy;
};

const englishLanguageGeneratorPageCopy: LanguageGeneratorPageCopy = {
  whatIs: {
    title: 'What is the Fantasy Language Generator?',
    description:
      'Fantasy Language Generator is a free online tool that does not require an account, built for quickly creating fictional vocabulary and phrases for fantasy or science-fiction worlds. With this tool, choose a language preset, edit vocabulary, set letter and character-combination replacement rules, then apply those rules to your own text, copy the results, or save the rules for next time. Its generated spellings can provide creative material for novel dialogue, worldbuilding vocabulary, the language of peoples in a TRPG/D&D campaign, and indie game text. It is suited to novelists, worldbuilders, TRPG/D&D players and game masters, and indie game developers; use the Fantasy Language Generator to establish a spelling style while you design the word meanings and grammar.',
  },
  featureOverview: {
    title: 'Fantasy Language Generator features for worldbuilding',
    subtitle:
      'Use the Fantasy Language Generator to shape vocabulary, rules, and reference spellings in one workspace for fantasy and science-fiction projects.',
    features: [
      {
        icon: 'vocabulary',
        title: 'Start with 67 editable entries',
        description:
          'Choose one of 25 presets in the Fantasy Language Generator to generate spellings for 67 words and phrases, then edit the source entries before applying rules.',
      },
      {
        icon: 'rules',
        title: 'Customize spelling rules',
        description:
          'In the Fantasy Language Generator, set letter and character-combination replacements. Combination rules can run first so recurring letter groups change in the order you choose.',
      },
      {
        icon: 'text',
        title: 'Convert custom text',
        description:
          'Use the Fantasy Language Generator to apply your spelling rules to a phrase or paragraph, keep unmatched characters, and prepare the converted text for copying.',
      },
      {
        icon: 'references',
        title: 'Browse fixed language references',
        description:
          'Use the Fantasy Language Generator to view romanized spellings from 46 fixed reference vocabularies for inspiration or comparison. They do not translate arbitrary sentences.',
      },
      {
        icon: 'saves',
        title: 'Keep rules in your browser',
        description:
          'The Fantasy Language Generator can save up to eight sets of rules in the current browser. Vocabulary, custom text, and the combination-rule toggle stay outside the saved rule set.',
      },
      {
        icon: 'copy',
        title: 'Copy results for your project',
        description:
          'Copy the generated vocabulary list or converted text when you are ready to use it in worldbuilding notes, scripts, or game material.',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'How to use the Fantasy Language Generator in three steps',
    steps: [
      {
        title: 'Generate and edit vocabulary',
        description:
          'In the Fantasy Language Generator, choose one of 25 language presets to generate results for 67 words and phrases, then edit the source entries to fit your setting.',
      },
      {
        title: 'Set your spelling rules',
        description:
          'The Fantasy Language Generator lets you adjust single-character and combination replacements. If combination rules are enabled, they run before the single-character rules.',
      },
      {
        title: 'Apply, copy, or save',
        description:
          'Apply the current rules to the vocabulary or your own text, copy the result, and save the rule set in one of eight browser-local slots when you want to reuse it.',
      },
    ],
  },
  callToAction: {
    title: 'Create with the Fantasy Language Generator',
    description: 'Start with the Fantasy Language Generator: generate vocabulary, set spelling rules, and copy the results for your world.',
    action: 'Start creating',
  },
  toolComparison: {
    title: 'Fantasy Language Generator vs Manual Conlanging vs Vulgarlang',
    description:
      'Compare the Fantasy Language Generator with manual language design and a more complete conlanging system to choose the right approach for your project.',
    tableLabel: 'Fantasy language generator, manual conlanging, and Vulgarlang comparison',
    dimensionHeading: 'Dimension',
    languageGeneratorHeading: 'Free Fantasy Language Generator',
    manualConlangingHeading: 'Manual Conlanging',
    vulgarlangHeading: 'Vulgarlang',
    rows: [
      {
        dimension: 'Getting started',
        languageGenerator: 'Free, with no registration',
        manualConlanging: 'Build your own vocabulary and rules notes',
        vulgarlang: 'Demo and paid versions available',
      },
      {
        dimension: 'Vocabulary starting point',
        languageGenerator: '25 presets and 67 editable words and phrases',
        manualConlanging: 'Create and record vocabulary one entry at a time',
        vulgarlang: 'Generate vocabulary and language settings in one click',
      },
      {
        dimension: 'Custom rules',
        languageGenerator: 'Edit letter and character-combination replacement rules',
        manualConlanging: 'Create, maintain, and apply rules yourself',
        vulgarlang: 'Set phonology, spelling, and grammar rules',
      },
      {
        dimension: 'Grammar design',
        languageGenerator: 'Focused on vocabulary and spelling; authors add grammar themselves',
        manualConlanging: 'Authors design syntax and inflection',
        vulgarlang: 'Provides grammar and inflection settings',
      },
      {
        dimension: 'Saving and reuse',
        languageGenerator: 'Save 8 spelling-rule sets in the current browser',
        manualConlanging: 'Save your own dictionary and rules files',
        vulgarlang: 'Paid versions support saving languages',
      },
      {
        dimension: 'Best fit',
        languageGenerator: 'Quickly prepare fictional vocabulary for novels, campaigns, and games',
        manualConlanging: 'Shape language and cultural details with precision',
        vulgarlang: 'Build a more systematic constructed language',
      },
    ],
  },
  caseStudies: {
    title: 'Fantasy Language Generator examples for your project',
    description:
      'See how the Fantasy Language Generator\'s preset spellings can support novel dialogue, inscriptions, and names for tabletop campaigns and games.',
    sourceLabel: 'English source word / sentence',
    resultLabel: 'Generated spelling',
    presetLabel: 'Language preset',
    usageLabel: 'Use case',
    notice: 'These results come from fixed vocabulary presets; you set the meanings and grammar.',
    cases: [
      {
        id: 'novel-greetings',
        title: 'Novel greetings',
        presetId: 1,
        examples: [
          { source: 'hello', result: 'akkou' },
          { source: 'welcome', result: 'bakgouhma' },
        ],
        usage:
          'Use greetings from the Fantasy Language Generator for character meetings, welcoming visitors, and vocabulary notes about a fictional people in your novel.',
      },
      {
        id: 'campaign-inscription',
        title: 'Campaign inscription',
        presetId: 2,
        examples: [
          { source: 'the gate opens at dawn', result: 'klo sako avort ak bavr' },
        ],
        usage:
          'Use the Fantasy Language Generator to style the English short phrase as a TRPG/D&D ruin inscription; show the spelling to players while the GM reveals its meaning through the story.',
      },
      {
        id: 'game-names',
        title: 'Game names',
        presetId: 3,
        examples: [
          { source: 'silver lake', result: 'tigsir gaqi' },
          { source: 'black tower', result: 'dgakq touxir' },
          { source: 'moonstone', result: 'choustousi' },
        ],
        usage: 'Names for game locations and items: use the spellings for map locations and named objects.',
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'FAQ about the Fantasy Language Generator',
    description:
      'Quick answers about using the Fantasy Language Generator, presets, spelling rules, text conversion, references, and local rule storage.',
    items: [
      {
        question: 'Who is the Fantasy Language Generator for?',
        answer:
          'The Fantasy Language Generator is for D&D and TTRPG players and game masters, as well as fantasy or science-fiction writers and game creators who want a consistent spelling system for a fictional setting.',
      },
      {
        question: 'Is the Fantasy Language Generator free, and do I need to sign in?',
        answer:
          'The Fantasy Language Generator is free to use and does not require an account. Rule saves are kept in the current browser, so they are not automatically shared with another browser or device.',
      },
      {
        question: 'Does the tool translate the meaning of a sentence?',
        answer:
          'No. It changes spelling patterns according to your rules. Unmatched characters are preserved, and the tool does not provide semantic translation.',
      },
      {
        question: 'How do random presets and custom rules work together?',
        answer:
          'A preset generates vocabulary results and a display alphabet for the 67 entries. Choosing another preset changes those generated results without replacing your custom rule table; applying rules uses the current rule table.',
      },
      {
        question: 'Are the language references full translations?',
        answer:
          'No. They are fixed reference vocabularies with romanized spellings. Some entries may be unavailable, and the references are not a way to translate arbitrary sentences or verify their meaning.',
      },
      {
        question: 'What can I save in the local rule slots?',
        answer:
          'You can keep up to eight sets of rules in the current browser. Each saved set stores the source and target values for the rules. Vocabulary, custom text, and the combination-rule toggle are not saved, and loading rules does not convert text automatically.',
      },
    ],
  },
};

const chineseLanguageGeneratorPageCopy: LanguageGeneratorPageCopy = {
  whatIs: {
    title: '什么是奇幻语言生成器？',
    description:
      '奇幻语言生成器是一款免费、无需注册的在线虚构语言创作工具，用于快速构思奇幻或科幻世界中的词汇与短语。使用这个工具，你可以选择语言预设、编辑词汇、设置字母和字符组合的替换规则，再将规则应用到自己的文本，复制结果或保存规则供下次使用。它生成的拼写可以作为小说对白、世界观词汇、TRPG/D&D 战役中的族群用语，以及独立游戏文本的创作素材。它适合小说作者、世界观设定者、TRPG/D&D 玩家与 GM、独立游戏开发者；你可以用奇幻语言生成器建立拼写风格，词义与语法仍由你设计。',
  },
  featureOverview: {
    title: '奇幻语言生成器的世界观功能',
    subtitle: '使用奇幻语言生成器整理词汇、拼写规则和参考拼写，服务于奇幻与科幻创作。',
    features: [
      {
        icon: 'vocabulary',
        title: '编辑 67 个词汇和短语',
        description:
          '在奇幻语言生成器中选择 25 个预设之一，为 67 个单词和短语生成拼写；你可以先编辑原词，再应用拼写规则。',
      },
      {
        icon: 'rules',
        title: '自定义拼写规则',
        description:
          '在奇幻语言生成器中设置字母与字符组合的替换关系；字符组合规则可以先运行，按你设定的顺序改变常见字母组合。',
      },
      {
        icon: 'text',
        title: '转换自定义文本',
        description:
          '使用奇幻语言生成器将拼写规则应用到短语或段落，保留未匹配的字符，并准备复制转换后的文本。',
      },
      {
        icon: 'references',
        title: '查看固定语言参考',
        description:
          '使用奇幻语言生成器查看 46 组固定参考词汇中的罗马化拼写，用于灵感或对照；这些内容不翻译任意句子。',
      },
      {
        icon: 'saves',
        title: '在浏览器中保存规则',
        description:
          '奇幻语言生成器可以将最多 8 套规则保存在当前浏览器中。词汇、自定义文本和字符组合开关不会写入规则存档。',
      },
      {
        icon: 'copy',
        title: '复制结果用于创作',
        description:
          '复制生成的词汇列表或转换后的文本，方便放回世界观笔记、剧本或游戏资料中继续使用。',
      },
    ],
  },
  howItWorks: {
    eyebrow: '操作流程',
    title: '如何使用奇幻语言生成器创建拼写系统？',
    steps: [
      {
        title: '生成并编辑词汇',
        description:
          '在奇幻语言生成器中，从 25 个语言预设中选择一个，生成 67 个单词和短语的结果，再编辑词汇表中的原词以适应你的世界观。',
      },
      {
        title: '设置拼写规则',
        description:
          '奇幻语言生成器允许你调整单字符替换和字符组合替换；启用字符组合规则后，它们会先于单字符规则运行。',
      },
      {
        title: '应用、复制或保存',
        description:
          '将当前规则应用到词汇或自定义文本，复制转换结果；需要复用时，把规则保存到当前浏览器的 8 个本地槽位之一。',
      },
    ],
  },
  callToAction: {
    title: '使用奇幻语言生成器开始创作',
    description: '从奇幻语言生成器开始：生成词汇、设置拼写规则，并复制结果，为你的世界观继续创作。',
    action: '开始创建',
  },
  toolComparison: {
    title: '奇幻语言生成器 vs 手工构语 vs Vulgarlang',
    description: '对比奇幻语言生成器、手工构语和更完整的构语体系，根据创作需求选择合适的方式。',
    tableLabel: '奇幻语言生成器、手工构语与 Vulgarlang 对比表',
    dimensionHeading: '对比维度',
    languageGeneratorHeading: '免费奇幻语言生成器',
    manualConlangingHeading: '手工构语',
    vulgarlangHeading: 'Vulgarlang',
    rows: [
      {
        dimension: '开始使用',
        languageGenerator: '免费，无需注册',
        manualConlanging: '自己建立词表和规则笔记',
        vulgarlang: '提供演示版及付费版本',
      },
      {
        dimension: '词汇起步',
        languageGenerator: '25 个预设，67 个可编辑词汇与短语',
        manualConlanging: '逐个创作并记录词汇',
        vulgarlang: '一键生成词汇及语言设定',
      },
      {
        dimension: '自定义规则',
        languageGenerator: '编辑字母和字符组合的替换规则',
        manualConlanging: '自行制定、维护和应用规则',
        vulgarlang: '设置音系、拼写和语法规则',
      },
      {
        dimension: '语法设计',
        languageGenerator: '专注词汇与拼写，语法由作者补充',
        manualConlanging: '由作者设计句法与词形变化',
        vulgarlang: '提供语法与词形设置',
      },
      {
        dimension: '保存复用',
        languageGenerator: '当前浏览器保存 8 套拼写规则',
        manualConlanging: '保存自己的词典和规则文件',
        vulgarlang: '付费版本支持保存语言',
      },
      {
        dimension: '适合需求',
        languageGenerator: '快速准备小说、跑团和游戏中的虚构词汇',
        manualConlanging: '精细塑造语言与文化特色',
        vulgarlang: '构建更系统的人工语言',
      },
    ],
  },
  caseStudies: {
    title: '奇幻语言生成器创作示例',
    description: '看看奇幻语言生成器生成的词汇与短句如何用于小说对白、跑团铭文和游戏命名。',
    sourceLabel: '英文原词 / 原句',
    resultLabel: '生成拼写',
    presetLabel: '语言预设',
    usageLabel: '使用场景',
    notice: '结果来自固定词汇预设，词义与语法由你设定。',
    cases: [
      {
        id: 'novel-greetings',
        title: '小说族群问候',
        presetId: 1,
        examples: [
          { source: 'hello', result: 'akkou' },
          { source: 'welcome', result: 'bakgouhma' },
        ],
        usage: '使用奇幻语言生成器生成的问候语，用于小说中角色见面、迎接访客和整理族群词汇笔记。',
      },
      {
        id: 'campaign-inscription',
        title: 'TRPG/D&D 遗迹铭文',
        presetId: 2,
        examples: [
          { source: 'the gate opens at dawn', result: 'klo sako avort ak bavr' },
        ],
        usage: '用奇幻语言生成器处理英文短句，作为遗迹铭文展示；“城门在黎明开启”的含义由 GM 根据剧情向玩家揭示。',
      },
      {
        id: 'game-names',
        title: '游戏地点与道具命名',
        presetId: 3,
        examples: [
          { source: 'silver lake', result: 'tigsir gaqi' },
          { source: 'black tower', result: 'dgakq touxir' },
          { source: 'moonstone', result: 'choustousi' },
        ],
        usage: '用于地图地点名和道具名。',
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: '关于奇幻语言生成器的常见问题',
    description: '快速了解使用奇幻语言生成器时的语言预设、拼写规则、文本转换、语言参考和本地规则存档。',
    items: [
      {
        question: '奇幻语言生成器适合谁？',
        answer:
          '奇幻语言生成器适合 D&D 和 TTRPG 玩家、GM，以及奇幻或科幻小说作者、游戏创作者，用来为虚构世界建立一套前后一致的拼写系统。',
      },
      {
        question: '奇幻语言生成器免费吗？需要登录吗？',
        answer:
          '奇幻语言生成器免费，无需账户即可使用。规则存档保存在当前浏览器中，不会自动同步到其他浏览器或设备。',
      },
      {
        question: '它会翻译句子的含义吗？',
        answer:
          '不会。工具只会按照你的规则改变拼写模式；未匹配的字符会保留，也不提供语义翻译。',
      },
      {
        question: '随机预设和自定义规则是什么关系？',
        answer:
          '预设会为 67 个词汇条目生成结果和显示字母表。切换预设会更新这些生成结果，但不会替换你编辑的规则表；点击应用规则时，使用的是当前规则表。',
      },
      {
        question: '语言参考是完整翻译吗？',
        answer:
          '不是。语言参考是带有罗马化拼写的固定参考词表，部分条目可能未收录；它们不能翻译任意句子，也不代表已验证的语义结果。',
      },
      {
        question: '本地规则槽位可以保存什么？',
        answer:
          '最多可以在当前浏览器中保存 8 套规则，每套保存规则的原值和目标值。词汇、自定义文本和字符组合开关不会保存，加载规则后也不会自动转换文本。',
      },
    ],
  },
};

export function getLanguageGeneratorPageCopy(locale: SiteLocale): LanguageGeneratorPageCopy {
  if (locale === 'en') {
    return englishLanguageGeneratorPageCopy;
  }

  if (locale === 'zh') {
    return chineseLanguageGeneratorPageCopy;
  }

  throw new Error(
    `Unknown language generator page locale. Received ${JSON.stringify(locale)}.`,
  );
}
