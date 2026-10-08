import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorPageItem = {
  readonly title: string;
  readonly description: string;
};

export type CalendarCreatorFaqItem = {
  readonly question: string;
  readonly answer: string;
};

export type CalendarCreatorComparisonRow = {
  readonly label: string;
  readonly tokenMaker: string;
  readonly rollForFantasy: string;
  readonly spreadsheet: string;
};

export type CalendarCreatorPageCopy = {
  readonly whatIs: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly audiences: readonly CalendarCreatorPageItem[];
  };
  readonly features: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly CalendarCreatorPageItem[];
  };
  readonly howItWorks: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly steps: readonly CalendarCreatorPageItem[];
  };
  readonly comparison: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly tableLabel: string;
    readonly criterionLabel: string;
    readonly tokenMakerLabel: string;
    readonly rollForFantasyLabel: string;
    readonly spreadsheetLabel: string;
    readonly rows: readonly CalendarCreatorComparisonRow[];
  };
  readonly cta: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly buttonLabel: string;
  };
  readonly faq: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly CalendarCreatorFaqItem[];
  };
};

const englishCalendarCreatorPageCopy: CalendarCreatorPageCopy = {
  whatIs: {
    eyebrow: 'A Fantasy Calendar Generator for your setting',
    title: 'What is a Fantasy Calendar Generator?',
    paragraphs: [
      'A Fantasy Calendar Generator defines how a fictional year moves: how many months it has, how long each month lasts, which weekdays repeat, and where the year begins.',
      'Use this Fantasy Calendar Generator as a working reference for sessions, scenes, and setting notes. Mark dates with notes and icons, add optional moons or disasters, keep browser-local versions, and print a full year when you need it beside you.',
    ],
    audiences: [
      {
        title: 'Game Masters',
        description: 'Track session dates, omens, disasters, and recurring weekdays for a campaign world.',
      },
      {
        title: 'Fiction authors',
        description: 'Keep invented month names, scene dates, and chronology together while drafting.',
      },
      {
        title: 'World designers',
        description: 'Turn a setting’s time rules into a reference that can be edited and printed.',
      },
    ],
  },
  features: {
    eyebrow: 'What you can set',
    title: 'Fantasy Calendar Generator features',
    description: 'The Fantasy Calendar Generator keeps calendar rules and day-level details in one working view.',
    items: [
      {
        title: 'Shape months and weekdays',
        description: 'Use the Fantasy Calendar Generator to choose the year, month count, days in each month, weekday names, and the first weekday.',
      },
      {
        title: 'Add layered moons',
        description: 'The Fantasy Calendar Generator can show up to three optional moon cycles and their phase icons on the relevant dates.',
      },
      {
        title: 'Mark hazards and events',
        description: 'In the Fantasy Calendar Generator, set a daily disaster chance, use the built-in icon set, and add your own day notes.',
      },
      {
        title: 'Edit dates in place',
        description: 'Open the Fantasy Calendar Generator date editor to write a note or change its manual icon; select several dates to apply one icon at once.',
      },
      {
        title: 'Keep four local versions',
        description: 'Save complete calendar rules, years, automatic layers, manual icons, and notes in four browser-local slots.',
      },
      {
        title: 'Print a complete year',
        description: 'Use the print view for months, weekday headings, automatic layers, manual icons, and notes; native PNG export is not provided.',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'How to use the Fantasy Calendar Generator',
    description: 'Create a structure first, then add the details that make the calendar useful in play or drafting.',
    steps: [
      {
        title: 'Set and generate the calendar',
        description: 'In the Fantasy Calendar Generator, set the year, month lengths, weekdays, and starting weekday. Add moons or disasters if needed, then create the calendar.',
      },
      {
        title: 'Edit and mark dates',
        description: 'Use the Fantasy Calendar Generator to add notes, choose manual icons, apply one icon to selected dates, and undo the latest manual icon change.',
      },
      {
        title: 'Save and print',
        description: 'Save the calendar in one of four local browser slots and print the full year.',
      },
    ],
  },
  comparison: {
    eyebrow: 'Choose a workflow',
    title: 'Fantasy Calendar Generator vs Roll for Fantasy vs Spreadsheets',
    description: 'The Fantasy Calendar Generator starts quickly from defaults, lets you adjust rules, mark dates in batches, and undo the latest icon change, so creating and editing a fictional calendar takes fewer steps.',
    tableLabel: 'Calendar workflow comparison',
    criterionLabel: 'Workflow',
    tokenMakerLabel: 'Token Maker',
    rollForFantasyLabel: 'Roll for Fantasy',
    spreadsheetLabel: 'Spreadsheet',
    rows: [
      {
        label: 'Quick start',
        tokenMaker: 'Ready to create with defaults',
        rollForFantasy: 'Month lengths need manual entry',
        spreadsheet: 'Calendar layout needs setup',
      },
      {
        label: 'Adjust rules',
        tokenMaker: 'Confirm rebuilding, with a save option',
        rollForFantasy: 'Rebuilding clears notes and icons',
        spreadsheet: 'Maintain calendar formulas yourself',
      },
      {
        label: 'Fix and recover',
        tokenMaker: 'Undo the latest manual icon change',
        rollForFantasy: 'Fixing icons needs manual re-selection',
        spreadsheet: 'Undo for spreadsheet edits',
      },
      {
        label: 'Unsaved reminders',
        tokenMaker: 'Prompt on year changes or loads if unsaved',
        rollForFantasy: 'Changing years clears notes and icons',
        spreadsheet: 'Save protection depends on the app',
      },
      {
        label: 'Continue saving',
        tokenMaker: 'Update the current archive directly',
        rollForFantasy: 'Four separately saved local slots',
        spreadsheet: 'Archiving depends on the app',
      },
      {
        label: 'Batch marking',
        tokenMaker: 'Batch marking on phones too',
        rollForFantasy: 'Batch replacement of date icons',
        spreadsheet: 'Set up marker styles yourself',
      },
    ],
  },
  cta: {
    eyebrow: 'Ready to set the dates?',
    title: 'Build a calendar with the Fantasy Calendar Generator',
    description: 'Start with a simple year, then add the rules, marks, and notes that make your fictional time usable.',
    buttonLabel: 'Open the Fantasy Calendar Generator',
  },
  faq: {
    eyebrow: 'Common questions',
    title: 'Fantasy Calendar Generator FAQ',
    description: 'A few practical answers before you start building a fictional year.',
    items: [
      {
        question: 'Is the Fantasy Calendar Generator free to use?',
        answer: 'The tool is free to use: create, edit, save locally, and print calendars without an account or sign-in.',
      },
      {
        question: 'Can different months have different lengths?',
        answer: 'Yes. Fill all months with one value first, then edit any month to a different non-negative whole number. A month set to 0 stays in the calendar but has no dates.',
      },
      {
        question: 'What happens when I regenerate a calendar?',
        answer: 'The current year is rebuilt with the new settings. Current notes and manual icons are cleared, moon phases and disasters are generated again, and saved archives are kept.',
      },
      {
        question: 'Where are calendar saves stored?',
        answer: 'There are four save slots in the current browser. The calendar is not synced to a cloud account.',
      },
      {
        question: 'What does the print view include?',
        answer: 'It includes the year, every month, weekday headings, automatic moon and disaster icons, manual icons, and day notes. The tool provides print output rather than native PNG export.',
      },
      {
        question: 'Can I undo a date icon change?',
        answer: 'The tool can undo the latest manual icon change. It does not provide a full edit history.',
      },
      {
        question: 'Can one calendar use more than one moon?',
        answer: 'Yes. You can enable separate white, blue, and red moon cycles, each with its own cycle length and automatic icons.',
      },
      {
        question: 'How are disaster icons added?',
        answer: 'Set a daily percentage. When the calendar is generated, the tool uses that chance to add a disaster icon to dates.',
      },
      {
        question: 'Does it calculate automatic leap years?',
        answer: 'No. Set the year and each month’s day count yourself; automatic leap-year rules are not part of this creator.',
      },
      {
        question: 'Can I mark several dates at once on a phone?',
        answer: 'Yes. Tap Select dates, choose several dates, then tap Finish selection to open their editor and apply an icon.',
      },
      {
        question: 'What happens if I leave month or weekday names blank?',
        answer: 'The interface displays a default name such as Month 1 or Day 1 when a name is blank.',
      },
      {
        question: 'Can I keep the current calendar while changing its rules?',
        answer: 'Yes. Return to settings to edit the draft while the current calendar stays in place. It changes only after you confirm regeneration.',
      },
    ],
  },
};

const chineseCalendarCreatorPageCopy: CalendarCreatorPageCopy = {
  whatIs: {
    eyebrow: '奇幻历法生成器，适合你的设定',
    title: '什么是奇幻历法生成器？',
    paragraphs: [
      '奇幻历法生成器定义虚构的一年如何运行：一年有多少个月、每月有多少天、哪些星期循环，以及新年从哪个星期开始。',
      '使用这个奇幻历法生成器，把规则作为战役、场景和设定笔记的工作参考。你可以给日期添加笔记和图标，加入可选月相或灾害，在浏览器中保存版本，并在需要时打印整年视图。',
    ],
    audiences: [
      {
        title: '游戏主持人',
        description: '用奇幻历法生成器记录战役世界中的游戏日期、预兆、灾害和循环星期。',
      },
      {
        title: '小说作者',
        description: '用奇幻历法生成器把自定义月份名称、场景日期和时间线放在一起维护。',
      },
      {
        title: '世界观设计者',
        description: '用奇幻历法生成器把世界的时间规则整理成可编辑、可打印的参考资料。',
      },
    ],
  },
  features: {
    eyebrow: '可以设置什么',
    title: '奇幻历法生成器的主要功能',
    description: '奇幻历法生成器在同一个工作视图中维护历法规则和每天的细节。',
    items: [
      {
        title: '塑造月份和星期',
        description: '使用奇幻历法生成器设置年份、月份数量、每月天数、星期名称和年初星期。',
      },
      {
        title: '添加多层月相',
        description: '使用奇幻历法生成器开启最多三组可选月亮周期，让对应日期自动显示月相图标。',
      },
      {
        title: '标记灾害与事件',
        description: '使用奇幻历法生成器设置每日灾害概率，使用内置图标，并为日期添加自己的笔记。',
      },
      {
        title: '直接编辑日期',
        description: '使用奇幻历法生成器打开日期即可填写笔记或更换手动图标，也可以一次为多个日期应用同一图标。',
      },
      {
        title: '保存四份本地版本',
        description: '使用奇幻历法生成器把历法规则、年份、自动图层、手动图标和笔记完整保存到四个浏览器本地槽位。',
      },
      {
        title: '打印完整年份',
        description: '使用奇幻历法生成器的打印视图保留月份、星期标题、自动图层、手动图标和笔记；工具不提供原生 PNG 导出。',
      },
    ],
  },
  howItWorks: {
    eyebrow: '使用方式',
    title: '如何使用奇幻历法生成器？',
    description: '先用奇幻历法生成器建立结构，再加入适合游戏或写作的细节。',
    steps: [
      {
        title: '设置并生成历法',
        description: '在奇幻历法生成器中设置年份、每月天数、星期和年初星期，按需开启月相或灾害，再生成历法。',
      },
      {
        title: '编辑和标记日期',
        description: '在奇幻历法生成器中添加笔记、选择手动图标、批量应用图标，并撤销最近一次手动图标修改。',
      },
      {
        title: '保存并打印',
        description: '在奇幻历法生成器中将历法保存到四个本地浏览器槽位之一，并打印整年视图。',
      },
    ],
  },
  comparison: {
    eyebrow: '选择适合你的工作方式',
    title: '奇幻历法生成器 vs Roll for Fantasy vs 电子表格',
    description: '奇幻历法生成器从默认设置快速开始，随时返回调整规则、批量标记日期，并撤销最近一次图标修改，让虚构历法的创建和编辑更省步骤。',
    tableLabel: '历法工作流程对比',
    criterionLabel: '工作内容',
    tokenMakerLabel: 'Token Maker',
    rollForFantasyLabel: 'Roll for Fantasy',
    spreadsheetLabel: '电子表格',
    rows: [
      {
        label: '快速开始',
        tokenMaker: '默认值直接创建',
        rollForFantasy: '需逐月填写',
        spreadsheet: '需自行排表',
      },
      {
        label: '调整规则',
        tokenMaker: '重建前确认，可先保存',
        rollForFantasy: '重建会清除笔记和图标',
        spreadsheet: '历法公式需自行维护',
      },
      {
        label: '改错恢复',
        tokenMaker: '撤销最近手动图标修改',
        rollForFantasy: '改错需手动重选图标',
        spreadsheet: '可撤销表格编辑',
      },
      {
        label: '未保存提醒',
        tokenMaker: '未保存时，换年或读取前提醒',
        rollForFantasy: '换年会清除笔记和图标',
        spreadsheet: '保存保护依应用而定',
      },
      {
        label: '连续保存',
        tokenMaker: '直接更新当前存档',
        rollForFantasy: '四份本地存档独立保存',
        spreadsheet: '存档方式依应用而定',
      },
      {
        label: '批量标记',
        tokenMaker: '手机也能批量标记',
        rollForFantasy: '可批量替换日期图标',
        spreadsheet: '标记样式需自行设置',
      },
    ],
  },
  cta: {
    eyebrow: '准备好设置日期了吗？',
    title: '使用奇幻历法生成器创建你的世界历法',
    description: '从简单的一年开始，再加入让虚构时间真正可用的规则、标记和笔记。',
    buttonLabel: '打开奇幻历法生成器',
  },
  faq: {
    eyebrow: '常见问题',
    title: '奇幻历法生成器常见问题',
    description: '开始创建虚构年份前，先了解几个实际问题。',
    items: [
      {
        question: '奇幻历法生成器免费吗？',
        answer: '工具可以免费创建、编辑、在本地保存和打印历法，无需账号或登录。',
      },
      {
        question: '不同月份可以使用不同天数吗？',
        answer: '可以。先为全部月份填入一个值，再把任意月份改成其他非负整数。设为 0 的月份会保留在历法中，但没有日期。',
      },
      {
        question: '重新生成历法时会发生什么？',
        answer: '系统会按新设置重建整年，清除当前笔记和手动图标，重新生成月相和灾害；已保存的存档会保留。',
      },
      {
        question: '历法存档保存在哪里？',
        answer: '当前浏览器提供四个存档槽位。历法不会同步到云端账号。',
      },
      {
        question: '打印视图包含哪些内容？',
        answer: '打印视图包含年份、所有月份、星期标题、自动月相和灾害图标、手动图标以及日期笔记。工具提供打印输出，不提供原生 PNG 导出。',
      },
      {
        question: '可以撤销日期图标修改吗？',
        answer: '工具可以撤销最近一次手动图标修改，但不提供完整的编辑历史。',
      },
      {
        question: '一个历法可以使用多个月亮吗？',
        answer: '可以。你可以分别启用白、蓝、红三组月亮周期，每组都有自己的周期长度和自动图标。',
      },
      {
        question: '灾害图标如何添加？',
        answer: '设置每日百分比后，生成历法时工具会按这个概率为日期添加灾害图标。',
      },
      {
        question: '会自动计算闰年吗？',
        answer: '不会。请自行设置年份和每月天数；这个生成器不包含自动闰年规则。',
      },
      {
        question: '手机上可以一次标记多个日期吗？',
        answer: '可以。点击“选择日期”，勾选多个日期，再点击“完成选择”打开编辑面板，选择图标即可批量应用。',
      },
      {
        question: '月份或星期名称留空会怎样？',
        answer: '名称留空时，界面会显示“月份 1”或“星期 1”这样的默认名称。',
      },
      {
        question: '修改规则时可以保留当前历法吗？',
        answer: '可以。返回设置后编辑参数，当前历法会保持不变；只有确认重新生成后才会更新。',
      },
    ],
  },
};

export function getCalendarCreatorPageCopy(locale: SiteLocale): CalendarCreatorPageCopy {
  if (locale === 'en') {
    return englishCalendarCreatorPageCopy;
  }

  if (locale === 'zh') {
    return chineseCalendarCreatorPageCopy;
  }

  throw new Error(`Unknown calendar creator page copy locale. Received ${JSON.stringify(locale)}.`);
}
