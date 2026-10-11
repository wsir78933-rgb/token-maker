import { isSiteLocale, type SiteLocale } from '@/lib/site-locale';

export type NoticeBoardCreatorFeatureIcon =
  | 'papers'
  | 'edit'
  | 'settings'
  | 'type'
  | 'google-fonts'
  | 'project';

export type NoticeBoardCreatorFeatureCopy = {
  icon: NoticeBoardCreatorFeatureIcon;
  title: string;
  description: string;
};

export type NoticeBoardCreatorHowToUseStepCopy = {
  title: string;
  description: string;
};

export type NoticeBoardCreatorComparisonCellCopy = {
  status: 'supported' | 'unsupported' | 'limited';
  label: string;
  source?: NoticeBoardCreatorComparisonSource;
};

export type NoticeBoardCreatorComparisonSource = {
  href: string;
  label: string;
  checkedOn: string;
};

export type NoticeBoardCreatorComparisonRowCopy = {
  dimension: string;
  noticeBoardCreator: NoticeBoardCreatorComparisonCellCopy;
  rollForFantasy: NoticeBoardCreatorComparisonCellCopy;
  helpWanted: NoticeBoardCreatorComparisonCellCopy;
};

export type NoticeBoardCreatorFaqItemCopy = {
  question: string;
  answer: string;
};

export type NoticeBoardCreatorLandingCopy = {
  navigationName: string;
  pageTitle: string;
  pageDescription: string;
  heading: string;
  headingEmphasis: string;
  description: string;
  heroAction: string;
  whatIsTitle: string;
  whatIsDescription: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: readonly [
    NoticeBoardCreatorFeatureCopy,
    NoticeBoardCreatorFeatureCopy,
    NoticeBoardCreatorFeatureCopy,
    NoticeBoardCreatorFeatureCopy,
    NoticeBoardCreatorFeatureCopy,
    NoticeBoardCreatorFeatureCopy,
  ];
  howToUseEyebrow: string;
  howToUseTitle: string;
  howToUseSteps: readonly [
    NoticeBoardCreatorHowToUseStepCopy,
    NoticeBoardCreatorHowToUseStepCopy,
    NoticeBoardCreatorHowToUseStepCopy,
  ];
  comparisonTitle: string;
  comparisonDescription: string;
  comparisonTableLabel: string;
  comparisonDimensionHeading: string;
  comparisonSourceCheckedLabel: string;
  noticeBoardCreatorHeading: string;
  rollForFantasyHeading: string;
  helpWantedHeading: string;
  comparisonRows: readonly NoticeBoardCreatorComparisonRowCopy[];
  callToActionTitle: string;
  callToActionDescription: string;
  callToActionLabel: string;
  faqEyebrow: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: readonly NoticeBoardCreatorFaqItemCopy[];
};

const englishRollForFantasyNoticeBoardSource: NoticeBoardCreatorComparisonSource = {
  href: 'https://rollforfantasy.com/tools/notice-board-creator.php',
  label: 'RollForFantasy official instructions',
  checkedOn: '2026-10-11',
};

const englishHelpWantedSource: NoticeBoardCreatorComparisonSource = {
  href: 'https://www.fairway3games.com/projects/help-wanted/',
  label: 'Help Wanted! official project page',
  checkedOn: '2026-10-11',
};

const chineseRollForFantasyNoticeBoardSource: NoticeBoardCreatorComparisonSource = {
  href: 'https://rollforfantasy.com/tools/notice-board-creator.php',
  label: 'RollForFantasy 官方说明',
  checkedOn: '2026-10-11',
};

const chineseHelpWantedSource: NoticeBoardCreatorComparisonSource = {
  href: 'https://www.fairway3games.com/projects/help-wanted/',
  label: 'Help Wanted! 官方项目页',
  checkedOn: '2026-10-11',
};

const englishNoticeBoardCreatorLandingCopy: NoticeBoardCreatorLandingCopy = {
  navigationName: 'Notice Board Creator',
  pageTitle: 'Fantasy Notice Board Creator | Free Quest Board Tool',
  pageDescription:
    'Build a fantasy quest notice board in your browser. Choose paper, edit notices, add fonts, save local projects, and print a board for your RPG or worldbuilding notes.',
  heading: 'Create a Fantasy Quest Board',
  headingEmphasis: 'Fantasy Quest Board',
  description:
    'Give your next adventure a place on the wall. Arrange quest notices, style the text, and keep a project file ready for your campaign.',
  heroAction: 'Start creating',
  whatIsTitle: 'What is a fantasy notice board creator?',
  whatIsDescription:
    'A fantasy notice board creator is an online tool for making quest boards for tabletop role-playing games. Choose from 12 paper styles, write notices, format text, arrange and resize each notice, and save, reopen, or print your board. Use it to present tavern commissions, guild requests, bounty notices, and other information players encounter during an adventure. It is designed for game masters (GM/DMs), tabletop RPG players, and fantasy worldbuilders.',
  featuresTitle: 'Make the board fit your campaign',
  featuresSubtitle:
    'In Notice Board Creator, keep common choices close at hand and open settings only when you need more control.',
  features: [
    {
      icon: 'papers',
      title: 'Choose from 12 paper styles',
      description:
        'Choose from 12 parchment and paper designs in Notice Board Creator, then add notices as you build the board.',
    },
    {
      icon: 'edit',
      title: 'Select a notice to edit it',
      description:
        'Click a notice in Notice Board Creator to open its text editor. Select several notices to apply text formatting in a batch.',
    },
    {
      icon: 'settings',
      title: 'Keep layout controls together',
      description:
        'Set the board width in Settings and independently turn notice dragging and proportional resizing on or off in Notice Board Creator.',
    },
    {
      icon: 'type',
      title: 'Style text with six controls',
      description:
        'Notice Board Creator provides six text controls: size, color, line height, alignment, font family, and text style. Eight built-in typefaces are ready to use.',
    },
    {
      icon: 'google-fonts',
      title: 'Add a Google Font when needed',
      description:
        'For an added typeface, Notice Board Creator accepts a Google Fonts stylesheet link and CSS family name, which are saved with the project.',
    },
    {
      icon: 'project',
      title: 'Save, reopen, and print',
      description:
        'Notice Board Creator keeps four saves in this browser or downloads a TXT project with the board width and custom font details. Print from the browser or take a screenshot manually.',
    },
  ],
  howToUseEyebrow: 'How it works',
  howToUseTitle: 'How to make a quest notice board',
  howToUseSteps: [
    {
      title: 'Pick a paper',
      description:
        'In Notice Board Creator, add a notice to the board and choose one of the 12 paper styles for its message.',
    },
    {
      title: 'Write and arrange',
      description:
        'Select a notice in Notice Board Creator to edit its text. Drag from its border or resize from a corner when those settings are enabled.',
    },
    {
      title: 'Save or print',
      description:
        'Save a browser slot or download a TXT project from Notice Board Creator to reopen later. Use your browser’s print command or capture a screenshot manually.',
    },
  ],
  comparisonTitle: 'Notice Board Creator vs. RollForFantasy vs. Help Wanted!',
  comparisonDescription:
    'Open each official link to check text/resize requirements, documented movement, font setup, and job replacement. These are vendor-page notes, not hands-on tests; checked 2026-10-11.',
  comparisonTableLabel: 'Three-way fantasy notice board tool comparison',
  comparisonDimensionHeading: 'Feature',
  comparisonSourceCheckedLabel: 'Checked',
  noticeBoardCreatorHeading: 'Notice Board Creator',
  rollForFantasyHeading: 'RollForFantasy',
  helpWantedHeading: 'Help Wanted!',
  comparisonRows: [
    {
      dimension: 'Edit or replace notice text',
      noticeBoardCreator: { status: 'supported', label: 'Edit text with resize enabled' },
      rollForFantasy: {
        status: 'limited',
        label: 'Toggle resize off before adding text',
        source: englishRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: 'Generate a board and replace one notice',
        source: englishHelpWantedSource,
      },
    },
    {
      dimension: 'Move and resize notices',
      noticeBoardCreator: { status: 'supported', label: 'Drag or use keyboard controls' },
      rollForFantasy: {
        status: 'supported',
        label: 'Official instructions describe dragging and resizing',
        source: englishRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: 'Manual move and resize controls are not described on this project page.',
        source: englishHelpWantedSource,
      },
    },
    {
      dimension: 'Add a custom font',
      noticeBoardCreator: { status: 'supported', label: 'Add Google Fonts to a project' },
      rollForFantasy: {
        status: 'supported',
        label: 'Add a Google Fonts link and family',
        source: englishRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: 'Custom font controls are not described on this page',
        source: englishHelpWantedSource,
      },
    },
    {
      dimension: 'Public product page language',
      noticeBoardCreator: { status: 'supported', label: 'English and Chinese pages' },
      rollForFantasy: {
        status: 'limited',
        label: 'Official tool instructions are in English',
        source: englishRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: 'Official project page is in English',
        source: englishHelpWantedSource,
      },
    },
  ],
  callToActionTitle: 'Put your next quest on the board',
  callToActionDescription:
    'Use Notice Board Creator to choose a paper, add a message, and shape a notice board for your table or fantasy setting.',
  callToActionLabel: 'Open the board creator',
  faqEyebrow: 'FAQ',
  faqTitle: 'Notice Board Creator FAQ',
  faqDescription:
    'Notice Board Creator lets you customize notices, save projects in your browser, and print or reopen a fantasy notice board.',
  faqItems: [
    {
      question: 'Who is this notice board tool for?',
      answer:
        'Notice Board Creator is made for tabletop RPG Game Masters and Dungeon Masters, players, and fantasy worldbuilders who want a notice board for their campaign.',
    },
    {
      question: 'Where are my browser saves stored?',
      answer:
        'The four quick-save slots are stored in the current browser on your device. They are not cloud saves. Download Notice Board Creator’s JSON-based TXT project when you want to move or reopen it in this tool; it cannot import RollForFantasy’s older HTML-based noticeBoard.txt file.',
    },
    {
      question: 'Can I change how notices look and move?',
      answer:
        'Yes. In Notice Board Creator, edit a selected notice and its text, then use Settings to set board width and independently enable moving and proportional resizing.',
    },
    {
      question: 'Can I use a font that is not built in?',
      answer:
        'Notice Board Creator includes eight typefaces. For an additional Google Font, enter its stylesheet link and CSS family name in the advanced font settings.',
    },
    {
      question: 'Can I export an image directly?',
      answer:
        'Notice Board Creator has no one-click PNG export. Use the browser print command or take a screenshot manually. The TXT project preserves the board setup so you can reopen and continue editing.',
    },
  ],
};

const chineseNoticeBoardCreatorLandingCopy: NoticeBoardCreatorLandingCopy = {
  navigationName: '奇幻任务公告板',
  pageTitle: '奇幻任务公告板制作器｜免费在线制作 RPG 任务板',
  pageDescription:
    '在浏览器中制作奇幻任务公告板：选择纸张、编辑公告、添加字体、保存本地项目，并为跑团或世界观资料打印公告板。',
  heading: '制作一块奇幻任务公告板',
  headingEmphasis: '奇幻任务公告板',
  description:
    '把下一场冒险贴上墙。排布任务公告、调整文字样式，并为跑团准备可继续编辑的项目文件。',
  heroAction: '开始制作',
  whatIsTitle: '什么是奇幻任务公告板制作器？',
  whatIsDescription:
    '奇幻任务公告板制作器是一款用于制作桌面角色扮演游戏（TTRPG）任务公告板的在线工具。你可以选择 12 种纸张样式，编辑公告内容，调整文字格式，拖动和缩放公告，并保存项目、重新打开续编或通过浏览器打印。它可用于展示酒馆委托、公会任务、悬赏通告等冒险信息。适合游戏主持人（GM/DM）、跑团玩家和奇幻世界观创作者使用。',
  featuresTitle: '按战役需要布置公告板',
  featuresSubtitle: '使用奇幻任务公告板制作器时，常用选择触手可及，需要更多控制时再打开设置。',
  features: [
    {
      icon: 'papers',
      title: '选择 12 种纸张样式',
      description: '在奇幻任务公告板制作器中，从 12 种羊皮纸与纸张设计中选择公告样式，并按需要添加公告。',
    },
    {
      icon: 'edit',
      title: '选中公告即可编辑',
      description: '选中奇幻任务公告板制作器中的公告即可打开文字编辑器；选中多条公告，可一次应用文字格式。',
    },
    {
      icon: 'settings',
      title: '布局控制集中在设置中',
      description: '在奇幻任务公告板制作器的设置中调整公告板宽度，并分别开启或关闭公告拖动和等比缩放。',
    },
    {
      icon: 'type',
      title: '用六项控制调整文字',
      description: '奇幻任务公告板制作器提供字号、颜色、行高、对齐、字体和文字样式六项控制，并内置 8 种字体。',
    },
    {
      icon: 'google-fonts',
      title: '按需添加 Google 字体',
      description: '高级字体设置可为奇幻任务公告板制作器添加 Google Fonts 样式表链接与 CSS 字体族名称，并随项目保存。',
    },
    {
      icon: 'project',
      title: '保存、续编与打印',
      description: '奇幻任务公告板制作器可在当前浏览器保存 4 个槽位，也可下载包含公告板宽度与自定义字体信息的 TXT 项目。打印请使用浏览器，截图需手动完成。',
    },
  ],
  howToUseEyebrow: '使用方式',
  howToUseTitle: '如何制作奇幻任务公告板',
  howToUseSteps: [
    {
      title: '选择纸张',
      description: '在奇幻任务公告板制作器中添加一条公告，并从 12 种纸张样式中选择适合它的设计。',
    },
    {
      title: '填写并排布公告',
      description: '选中奇幻任务公告板制作器中的公告即可编辑文字。启用对应设置后，可从边框拖动公告或从角点缩放。',
    },
    {
      title: '保存或打印',
      description: '把项目保存到奇幻任务公告板制作器的浏览器槽位，或下载 TXT 项目以便稍后打开。打印请使用浏览器命令，截图需要手动完成。',
    },
  ],
  comparisonTitle: '奇幻任务公告板 vs. RollForFantasy vs. Help Wanted!',
  comparisonDescription:
    '可打开官方链接核对文字与缩放要求、移动方式、字体设置和任务替换说明。以下为官方页面记载，并非实际交互测试；核验日期：2026-10-11。',
  comparisonTableLabel: '三款奇幻任务公告板工具对比',
  comparisonDimensionHeading: '对比功能',
  comparisonSourceCheckedLabel: '核验日期',
  noticeBoardCreatorHeading: '奇幻任务公告板',
  rollForFantasyHeading: 'RollForFantasy',
  helpWantedHeading: 'Help Wanted!',
  comparisonRows: [
    {
      dimension: '编辑或替换公告文字',
      noticeBoardCreator: { status: 'supported', label: '缩放开启时仍可编辑文字' },
      rollForFantasy: {
        status: 'limited',
        label: '添加文字前需关闭缩放',
        source: chineseRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: '生成公告板并单独替换一条任务',
        source: chineseHelpWantedSource,
      },
    },
    {
      dimension: '移动与缩放公告',
      noticeBoardCreator: { status: 'supported', label: '拖动或使用键盘控件' },
      rollForFantasy: {
        status: 'supported',
        label: '官方说明记录了拖动与缩放',
        source: chineseRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: '项目页未介绍手动移动或缩放控件。',
        source: chineseHelpWantedSource,
      },
    },
    {
      dimension: '添加自定义字体',
      noticeBoardCreator: { status: 'supported', label: '可将 Google Fonts 加入项目' },
      rollForFantasy: {
        status: 'supported',
        label: '添加 Google Fonts 链接和字体族名称',
        source: chineseRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: '官方页面未介绍自定义字体控件',
        source: chineseHelpWantedSource,
      },
    },
    {
      dimension: '公开产品页语言',
      noticeBoardCreator: { status: 'supported', label: '提供中英文页面' },
      rollForFantasy: {
        status: 'limited',
        label: '官方工具说明为英文',
        source: chineseRollForFantasyNoticeBoardSource,
      },
      helpWanted: {
        status: 'limited',
        label: '官方项目页为英文',
        source: chineseHelpWantedSource,
      },
    },
  ],
  callToActionTitle: '把下一场冒险贴上公告板',
  callToActionDescription: '使用奇幻任务公告板制作器选择纸张、添加任务，并为跑团或奇幻世界观布置公告板。',
  callToActionLabel: '打开公告板制作器',
  faqEyebrow: '常见问题',
  faqTitle: '奇幻任务公告板常见问题',
  faqDescription: '奇幻任务公告板制作器支持自定义公告、浏览器保存项目，并可打印或重新打开公告板。',
  faqItems: [
    {
      question: '这款公告板工具适合谁？',
      answer: '奇幻任务公告板制作器适合桌面 RPG 的 GM/DM、跑团玩家，以及希望为战役制作任务公告的奇幻世界观创作者。',
    },
    {
      question: '浏览器保存存在哪里？',
      answer: '4 个快速保存槽位储存在你当前设备的浏览器中，不会保存到云端。使用奇幻任务公告板制作器下载本站的 JSON TXT 项目，可转移或重新打开；它不能载入 RollForFantasy 旧版以 HTML 内容保存的 noticeBoard.txt 文件。',
    },
    {
      question: '可以更改公告样式和位置吗？',
      answer: '可以。在奇幻任务公告板制作器中选中公告后编辑文字，再到设置中调整公告板宽度，并独立控制公告拖动和等比缩放。',
    },
    {
      question: '可以使用内置字体之外的字体吗？',
      answer: '奇幻任务公告板制作器内置 8 种字体。高级字体设置支持输入 Google Fonts 样式表链接和 CSS 字体族名称。',
    },
    {
      question: '可以直接导出图片吗？',
      answer: '奇幻任务公告板制作器目前没有一键 PNG 导出。请使用浏览器打印，或手动截图。TXT 项目会保留公告板设置，方便重新打开和继续编辑。',
    },
  ],
};

const noticeBoardCreatorLandingCopies: Record<SiteLocale, NoticeBoardCreatorLandingCopy> = {
  en: englishNoticeBoardCreatorLandingCopy,
  zh: chineseNoticeBoardCreatorLandingCopy,
};

export function getNoticeBoardCreatorLandingCopy(locale: string): NoticeBoardCreatorLandingCopy {
  if (!isSiteLocale(locale)) {
    throw new Error(`Unknown notice board creator locale. Received ${JSON.stringify(locale)}.`);
  }

  return noticeBoardCreatorLandingCopies[locale];
}
