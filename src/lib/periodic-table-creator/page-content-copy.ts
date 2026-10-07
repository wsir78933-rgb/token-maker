import type { SiteLocale } from '@/lib/site-locale';

export type PeriodicTableFeatureIcon =
  | 'layout'
  | 'fields'
  | 'templates'
  | 'styles'
  | 'slots'
  | 'files';

export type PeriodicTableFeature = {
  icon: PeriodicTableFeatureIcon;
  title: string;
  description: string;
};

export type PeriodicTableFaqItem = {
  question: string;
  answer: string;
};

export type PeriodicTableComparisonRow = {
  dimension: string;
  periodicTable: string;
  spreadsheet: string;
  drawing: string;
};

export type PeriodicTablePageContentCopy = {
  whatIs: {
    title: string;
    description: string;
  };
  features: {
    title: string;
    description: string;
    items: readonly PeriodicTableFeature[];
  };
  comparison: {
    title: string;
    description: string;
    tableLabel: string;
    scrollHint: string;
    headings: {
      dimension: string;
      periodicTable: string;
      spreadsheet: string;
      drawing: string;
    };
    rows: readonly PeriodicTableComparisonRow[];
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    steps: readonly {
      title: string;
      description: string;
    }[];
  };
  cta: {
    title: string;
    description: string;
    action: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly PeriodicTableFaqItem[];
  };
};

const englishPeriodicTablePageContentCopy: PeriodicTablePageContentCopy = {
  whatIs: {
    title: 'What is the Periodic Table Creator?',
    description:
      'Periodic Table Creator is a free browser tool for GMs, fiction writers, worldbuilders, and indie game developers. The browser workspace starts with a blank, real, or random table so you can organize magical elements, minerals, resources, materials, or factions into a readable system. Edit six text fields in each cell, style selected cells or the whole table, keep five manual browser slots, and download a TXT/HTML backup for offline editing.',
  },
  features: {
    title: 'Periodic Table Creator features',
    description:
      'Use Periodic Table Creator to shape a classification table for a TRPG/D&D campaign, a fantasy or science-fiction setting, a novel, or an indie game in one focused browser workspace.',
    items: [
      {
        icon: 'layout',
        title: 'Choose a starting layout',
        description:
          'Create a blank table with the dimensions you need, or use the New panel in Periodic Table Creator for the factual real template. Use the separate Random panel when you want a fresh fantasy layout.',
      },
      {
        icon: 'fields',
        title: 'Give each cell six text fields',
        description:
          'Edit top-left, top-right, symbol, name, bottom-left, and bottom-right text independently. Each field in a Periodic Table Creator cell accepts multiline text so it can hold a label, abbreviation, note, or value for your setting.',
      },
      {
        icon: 'templates',
        title: 'Build real or fictional systems',
        description:
          'Use the real periodic table as a factual starting point, or use random fantasy entries to organize magical elements, minerals, resources, technology materials, and factions in Periodic Table Creator.',
      },
      {
        icon: 'styles',
        title: 'Style selected cells or all cells',
        description:
          'Apply background, text, and border colors to the selected cells or the full table. Periodic Table Creator also lets you clear the background to transparent, show, hide, or invert borders, add an external image URL, or reset selected text while preserving its background, image, and border color.',
      },
      {
        icon: 'slots',
        title: 'Keep five manual browser slots',
        description:
          'Save and load five complete table versions in the current browser. A Periodic Table Creator slot keeps the layout, text, styles, images, and selection state; saving is manual and there is no automatic save.',
      },
      {
        icon: 'files',
        title: 'Download a TXT/HTML backup',
        description:
          'Download UTF-8 editable table HTML from Periodic Table Creator in a TXT file, rename a copy to .html for offline text editing, and import a compatible TXT or HTML file up to 5 MiB when you return to the tool.',
      },
    ],
  },
  comparison: {
    title: 'Build element tables with less setup',
    description:
      'Compare the ready-made layouts, six-field cells, and fantasy randomization in Periodic Table Creator with the steps required to build an element table from a blank workbook or canvas.',
    tableLabel: 'Periodic Table Creator workflow comparison',
    scrollHint: 'Swipe sideways on a narrow screen to see the full comparison.',
    headings: {
      dimension: 'Dimension',
      periodicTable: 'Periodic Table Creator',
      spreadsheet: 'Spreadsheet',
      drawing: 'Drawing software',
    },
    rows: [
      {
        dimension: 'Layout start',
        periodicTable: 'Ready-made layouts let you start editing in Periodic Table Creator: choose a blank table, real template, or random fantasy table.',
        spreadsheet: 'From a blank workbook, set up rows, columns, spacing, and structure.',
        drawing: 'From a blank canvas, draw the grid and place the first cell shapes.',
      },
      {
        dimension: 'Information layout',
        periodicTable: 'Six fields in Periodic Table Creator are already arranged in every cell: enter symbols, names, and notes directly.',
        spreadsheet: 'Define columns and cell conventions as you build the workbook.',
        drawing: 'Place text boxes and align labels as you build the composition.',
      },
      {
        dimension: 'Fantasy inspiration',
        periodicTable: 'Built-in inspiration comes with Periodic Table Creator: generate names and symbols; keep the layout and styles while randomizing the current table’s visible-border cells.',
        spreadsheet: 'Design it yourself',
        drawing: 'Design it yourself',
      },
      {
        dimension: 'Consistent styling',
        periodicTable: 'Change a group at once in Periodic Table Creator: select a group or the whole table to batch-adjust colors and borders.',
        spreadsheet: 'Select cells or ranges and use the formatting controls.',
        drawing: 'Select objects and set fills, strokes, and text styles.',
      },
      {
        dimension: 'Setting versions',
        periodicTable: 'Five versions in Periodic Table Creator stay in one place: save manually to browser-local slots for different setting versions.',
        spreadsheet: 'Save workbook versions in its supported file workflow.',
        drawing: 'Save project versions in its supported document workflow.',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'Create a worldbuilding table in three steps',
    steps: [
      {
        title: 'Choose a starting layout',
        description:
          'Start in Periodic Table Creator with a blank table, the real periodic table template, or a new random fantasy layout for your campaign or setting.',
      },
      {
        title: 'Edit six fields and batch style',
        description:
          'In Periodic Table Creator, click or tap a cell to edit its six text fields, then use selected-cell or all-cell appearance controls for colors, borders, and images.',
      },
      {
        title: 'Save manually or download',
        description:
          'Use Periodic Table Creator to keep a version in one of five browser-local slots, or download a TXT/HTML backup that you can reopen and continue editing later.',
      },
    ],
  },
  cta: {
    title: 'Build your own element system',
    description:
      'Start with a real structure or a blank grid, then let Periodic Table Creator turn the cells into a clear reference for your campaign, novel, or game setting.',
    action: 'Start creating',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Periodic Table Creator FAQ',
    description:
      'Quick answers about layouts, six-field cells, random tables, local saves, TXT/HTML backups, and mobile editing in Periodic Table Creator.',
    items: [
      {
        question: 'Who is the Periodic Table Creator for?',
        answer:
          'The Periodic Table Creator is for TRPG/D&D GMs and players, fiction writers, worldbuilders, and indie game developers who want to organize magical elements, minerals, resources, materials, or factions into a visual table.',
      },
      {
        question: 'Is the Periodic Table Creator free?',
        answer:
          'Yes. The tool runs in the browser and is available for free without requiring an account to create, edit, save, or download a table.',
      },
      {
        question: 'Can I use a real template and a fantasy template?',
        answer:
          'Yes. The New panel includes a factual real periodic table template and a blank table where you choose the dimensions and enter everything yourself. The separate Random panel creates a fresh fantasy layout.',
      },
      {
        question: 'What layouts and cell content can I create?',
        answer:
          'A blank table can use 1 to 50 rows and 1 to 50 columns. Each cell then has six independent fields: top-left, top-right, symbol, name, bottom-left, and bottom-right. They accept multiline text, so you can combine an abbreviation, category, name, description, or setting-specific value.',
      },
      {
        question: 'What is the difference between a random new table and randomizing the current table?',
        answer:
          'A random new table replaces the current layout with a new fantasy table. Randomizing the current table updates only cells with visible borders, keeps the current row and column count, styles, images, and bottom two text fields, and replaces its four primary text fields.',
      },
      {
        question: 'How do the five local save slots work?',
        answer:
          'The five slots are manual saves in the current browser. They keep the layout, text, styles, images, and selection state; nothing is saved automatically. When the current table has edits, loading asks before replacing them, and saving to an occupied slot asks before replacing that saved version.',
      },
      {
        question: 'Can I import and export a table as TXT or HTML?',
        answer:
          'Yes. Download a UTF-8 TXT file containing editable table HTML, rename a copy to .html for offline editing, and import compatible TXT or HTML files up to 5 MiB. The tool does not provide a built-in PNG download.',
      },
      {
        question: 'How does the tool work on a phone?',
        answer:
          'The table scrolls horizontally on a narrow screen, while text and appearance controls open in a bottom editing panel. Tap a cell’s text to focus the matching field, and use More for mobile actions such as downloading the table.',
      },
    ],
  },
};

const chinesePeriodicTablePageContentCopy: PeriodicTablePageContentCopy = {
  whatIs: {
    title: '什么是元素周期表制作器？',
    description:
      '元素周期表制作器是一款免费的浏览器工具，适合 TRPG/D&D 的 GM 与玩家、小说作者、世界观创作者和独立游戏开发者。浏览器工作区可以从空白、真实或随机表格开始，把魔法元素、矿物、资源、科技材料或阵营整理成清晰体系；编辑每个单元格的六个文字栏位，为所选单元格或整张表格设置样式，保存五个浏览器本地手动槽位，并下载 TXT/HTML 备份以便离线编辑。',
  },
  features: {
    title: '元素周期表制作器的功能',
    description:
      '在一个专注的浏览器工作区中，使用元素周期表制作器为 TRPG/D&D 战役、奇幻或科幻设定、小说和独立游戏塑造自己的分类表。',
    items: [
      {
        icon: 'layout',
        title: '选择起始布局',
        description:
          '按需要创建空白表格，或在元素周期表制作器的新建面板中选择真实元素周期表模板。需要全新的随机幻想布局时，使用单独的「随机生成」面板。',
      },
      {
        icon: 'fields',
        title: '每个单元格包含六个文字栏位',
        description:
          '分别编辑元素周期表制作器中的左上、右上、主符号、名称、左下和右下文字。每个栏位都支持换行，可以放置标签、缩写、备注或设定中的数值。',
      },
      {
        icon: 'templates',
        title: '创建真实或虚构的分类体系',
        description:
          '以真实元素周期表作为事实起点，也可以用元素周期表制作器的随机幻想条目整理世界中的魔法元素、矿物、资源、科技材料和阵营。',
      },
      {
        icon: 'styles',
        title: '批量设置所选或全部单元格',
        description:
          '为所选单元格或整张表格设置背景色、文字色和边框色。元素周期表制作器还可以将背景清除为透明，显示、隐藏或反转边框，也可以添加外部图片 URL；重置所选时会保留背景、图片和边框颜色。',
      },
      {
        icon: 'slots',
        title: '保留五个浏览器本地手动槽位',
        description:
          '在当前浏览器中保存和加载五个完整表格版本。元素周期表制作器会在每个槽位中保存布局、文字、样式、图片和选择状态；保存需要手动操作，不会自动保存。',
      },
      {
        icon: 'files',
        title: '下载 TXT/HTML 备份',
        description:
          '从元素周期表制作器下载包含可编辑表格 HTML 的 UTF-8 TXT 文件，将副本改名为 .html 后可离线编辑文字；之后可以重新导入不超过 5 MiB 的兼容 TXT 或 HTML 文件。',
      },
    ],
  },
  comparison: {
    title: '做元素表，省下这些步骤',
    description: '对比元素周期表制作器提供的现成布局、六栏单元格和幻想随机生成，以及从空白工作簿或画布手工搭建元素表所需的步骤。',
    tableLabel: '元素周期表制作器工作流对比',
    scrollHint: '窄屏上可以左右滑动查看完整对比表。',
    headings: {
      dimension: '对比维度',
      periodicTable: '元素周期表制作器',
      spreadsheet: '普通表格',
      drawing: '绘图软件',
    },
    rows: [
      {
        dimension: '起步排版',
        periodicTable: '现成布局由元素周期表制作器提供，直接编辑：选空白表、真实模板或随机幻想表。',
        spreadsheet: '从空白工作簿设置行列、间距和第一版结构。',
        drawing: '从空白画布绘制网格并摆放第一批单元格。',
      },
      {
        dimension: '信息排版',
        periodicTable: '六个栏位在元素周期表制作器中已经排好，直接填写符号、名称和备注。',
        spreadsheet: '边制作边定义列结构和单元格填写方式。',
        drawing: '手动放置文字框并对齐标签。',
      },
      {
        dimension: '幻想灵感',
        periodicTable: '元素周期表制作器自带幻想灵感：生成名称与符号；也能保留布局和样式，随机化当前表格中显示边框的单元格。',
        spreadsheet: '自行设计',
        drawing: '自行设计',
      },
      {
        dimension: '统一外观',
        periodicTable: '选中一组或全表后，元素周期表制作器可以整组一起改，批量调整配色和边框。',
        spreadsheet: '选择单元格或范围，使用格式控件。',
        drawing: '选择对象，设置填充、描边和文字样式。',
      },
      {
        dimension: '设定版本',
        periodicTable: '元素周期表制作器支持五个设定版本：手动保存到浏览器本地槽位，需要时加载切换。',
        spreadsheet: '按其文件流程保存工作簿版本。',
        drawing: '按其文档流程保存工程版本。',
      },
    ],
  },
  howItWorks: {
    eyebrow: '操作流程',
    title: '三步创建世界观元素表',
    steps: [
      {
        title: '选择起始布局',
        description: '用元素周期表制作器从空白表格、真实元素周期表模板或全新的随机幻想布局开始，为战役或设定搭建基础。',
      },
      {
        title: '编辑六个栏位并批量设置外观',
        description: '在元素周期表制作器中点击或轻触单元格编辑六个文字栏位，再用所选或全部单元格的外观控件设置颜色、边框和图片。',
      },
      {
        title: '手动存档或下载',
        description: '通过元素周期表制作器将版本保存在五个浏览器本地槽位之一，或下载 TXT/HTML 备份，之后重新打开并继续编辑。',
      },
    ],
  },
  cta: {
    title: '创建你的元素分类体系',
    description: '从真实结构或空白网格开始，让元素周期表制作器把单元格变成战役、小说或游戏设定中清晰易查的参考表。',
    action: '开始制作',
  },
  faq: {
    eyebrow: '常见问题',
    title: '元素周期表制作器常见问题',
    description: '快速了解布局、六栏单元格、随机表格、本地存档、TXT/HTML 备份和手机编辑，以及如何使用元素周期表制作器。',
    items: [
      {
        question: '元素周期表制作器适合谁？',
        answer:
          '元素周期表制作器适合 TRPG/D&D 的 GM 与玩家、小说作者、世界观创作者和独立游戏开发者，用来把魔法元素、矿物、资源、材料或阵营整理成可视化表格。',
      },
      {
        question: '元素周期表制作器免费吗？',
        answer: '是的。元素周期表制作器在浏览器中运行，创建、编辑、保存和下载表格都免费，也不需要注册账号。',
      },
      {
        question: '可以使用真实模板和幻想模板吗？',
        answer:
          '可以。元素周期表制作器提供真实元素周期表模板和空白表格，你可以自行指定尺寸并填写全部内容；单独的「随机生成」面板会创建全新的幻想布局。',
      },
      {
        question: '可以创建什么布局并填写哪些单元格内容？',
        answer:
          '在元素周期表制作器中，空白表格的行数和列数都可以设置为 1 到 50。每个单元格有六个独立栏位：左上、右上、主符号、名称、左下和右下。它们支持换行，可以组合填写缩写、类别、名称、描述或设定中的数值。',
      },
      {
        question: '随机新表格和随机化当前表格有什么区别？',
        answer:
          '在元素周期表制作器中，随机新表格会用新的幻想表格替换当前布局；随机化当前表格只会更新边框可见的单元格，保留当前行列数、样式、图片和底部两个文字栏位，并替换四个主要文字栏位。',
      },
      {
        question: '五个本地存档槽位如何工作？',
        answer:
          '元素周期表制作器的五个槽位是保存在当前浏览器中的手动存档，会保留布局、文字、样式、图片和选择状态；不会自动保存。如果当前表格已有编辑，加载会在替换这些编辑前询问；保存到已有槽位时也会在替换原存档前询问。',
      },
      {
        question: '可以用 TXT 或 HTML 导入和导出表格吗？',
        answer:
          '可以。下载的是包含可编辑表格 HTML 的 UTF-8 TXT 文件，将副本改名为 .html 后可离线编辑，也可以导入不超过 5 MiB 的兼容 TXT 或 HTML 文件。工具不提供内置 PNG 下载。',
      },
      {
        question: '手机上如何使用这个工具？',
        answer:
          '窄屏上表格可以横向滚动，文字和外观控件会在底部编辑面板中打开。点击单元格文字即可聚焦对应栏位，使用“更多”可以进行下载等手机操作。',
      },
    ],
  },
};

export function getPeriodicTablePageContentCopy(locale: SiteLocale): PeriodicTablePageContentCopy {
  if (locale === 'en') {
    return englishPeriodicTablePageContentCopy;
  }

  if (locale === 'zh') {
    return chinesePeriodicTablePageContentCopy;
  }

  throw new Error(`Unknown periodic table page content locale. Received ${JSON.stringify(locale)}.`);
}
