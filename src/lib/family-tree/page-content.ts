import type { SiteLocale } from '@/lib/site-locale';

export type FamilyTreePageFeatureIcon =
  | 'portrait'
  | 'profile'
  | 'generations'
  | 'connections'
  | 'save'
  | 'export';

export type FamilyTreeToolComparisonCopy = {
  readonly title: string;
  readonly description: string;
  readonly tableLabel: string;
  readonly dimensionHeading: string;
  readonly familyTreeMakerHeading: string;
  readonly canvaHeading: string;
  readonly drawioHeading: string;
  readonly rows: readonly {
    readonly dimension: string;
    readonly familyTreeMaker: string;
    readonly canva: string;
    readonly drawio: string;
  }[];
};

export type FamilyTreePageContent = {
  readonly whatIs: {
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly features: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly icon: FamilyTreePageFeatureIcon;
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly toolComparison: FamilyTreeToolComparisonCopy;
  readonly howItWorks: {
    readonly title: string;
    readonly description: string;
    readonly steps: readonly {
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly callToAction: {
    readonly title: string;
    readonly description: string;
    readonly action: string;
  };
  readonly faq: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly question: string;
      readonly answer: string;
    }[];
  };
};

const englishFamilyTreePageContent: FamilyTreePageContent = {
  whatIs: {
    title: 'What is a Fantasy Family Tree Maker?',
    paragraphs: [
      'Fantasy Family Tree Maker helps you map the families and character relationships behind a novel, a worldbuilding project, or a D&D / TRPG campaign.',
      'The Fantasy Family Tree Maker canvas shows each person’s portrait and name, while age and description stay with the person’s notes. Arrange four generations and place the relationship connections yourself so important branches stay easy to follow.',
      'It is made for novelists, worldbuilders, game masters, and players who need a clear reference while planning stories, settings, or campaigns.',
    ],
  },
  features: {
    title: 'Everything you need to map your characters',
    description: 'Use Fantasy Family Tree Maker to create a readable family tree while keeping the character details and layout choices in your hands.',
    items: [
      {
        icon: 'portrait',
        title: 'Customize or randomize portraits',
        description: 'Fantasy Family Tree Maker lets you choose from eight avatar categories, color palettes, wrinkles, and scars, or randomize a starting portrait.',
      },
      {
        icon: 'profile',
        title: 'Keep character details together',
        description: 'Add a name, age, and description to each person so the family tree carries the notes you need.',
      },
      {
        icon: 'generations',
        title: 'Arrange four generations',
        description: 'Place people in one of four generations and drag them horizontally within their current generation.',
      },
      {
        icon: 'connections',
        title: 'Draw and adjust connections',
        description: 'Set each endpoint to none, solid, or dashed, then move and resize the generation connections by hand.',
      },
      {
        icon: 'save',
        title: 'Save five browser slots or a TXT file',
        description: 'Fantasy Family Tree Maker provides five manual browser save slots for quick recovery, or lets you save and load a TXT file when you want a portable copy.',
      },
      {
        icon: 'export',
        title: 'Export a PNG',
        description: 'Fantasy Family Tree Maker can generate a PNG with a transparent background by default, or let you choose a white background before saving the image.',
      },
    ],
  },
  toolComparison: {
    title: 'Fantasy Family Tree Maker vs Canva vs draw.io',
    description:
      'Fantasy Family Tree Maker combines portrait parts, character details, and a ready-made generation canvas, so you can organize family relationships for novels, fantasy worlds, and D&D campaigns without starting from a blank canvas.',
    tableLabel: 'Family tree tools comparison',
    dimensionHeading: 'Comparison',
    familyTreeMakerHeading: 'Fantasy Family Tree Maker',
    canvaHeading: 'Canva',
    drawioHeading: 'draw.io',
    rows: [
      {
        dimension: 'Character portraits',
        familyTreeMaker: 'Built-in portrait parts and colors; click to combine them or randomize a portrait for direct use in the family tree.',
        canva: 'Prepare it yourself',
        drawio: 'Prepare it yourself',
      },
      {
        dimension: 'Getting started',
        familyTreeMaker: 'Use the ready-made four-generation canvas and choose a generation to add a person.',
        canva: 'Design it yourself',
        drawio: 'Design it yourself',
      },
      {
        dimension: 'Character details',
        familyTreeMaker: 'Names, ages, and descriptions stay with each person; click a person to edit them together.',
        canva: 'Prepare it yourself',
        drawio: 'Prepare it yourself',
      },
      {
        dimension: 'Relationship drawing',
        familyTreeMaker: 'Use solid or dashed endpoints and between-generation connections that you can drag and resize.',
        canva: 'Use shapes, arrows, and connectors to design relationships.',
        drawio: 'Connect person nodes, set line styles, and arrange a tree layout.',
      },
      {
        dimension: 'Save and resume',
        familyTreeMaker: 'Save each family tree in one of five browser slots, or save a TXT file and load it later to continue editing.',
        canva: 'Automatically save designs and continue editing when you return.',
        drawio: 'Save as an editable .drawio file and reopen it later.',
      },
    ],
  },
  howItWorks: {
    title: 'How to make a family tree',
    description: 'Start with the people that matter to your story, then build outward one generation at a time.',
    steps: [
      {
        title: 'Prepare a person',
        description: 'In Fantasy Family Tree Maker, choose or randomize a portrait, then enter the person’s name, age, and description.',
      },
      {
        title: 'Choose a generation and arrange people',
        description: 'Select one of four generations in Fantasy Family Tree Maker, add the person there, and drag people horizontally within that generation.',
      },
      {
        title: 'Set endpoints and connect generations',
        description: 'In Fantasy Family Tree Maker, select a person to set its endpoint styles. Then add a between-generation connection and move or resize that connection to fit the layout.',
      },
      {
        title: 'Save or export your work',
        description: 'Fantasy Family Tree Maker lets you save to a browser slot or a TXT file, or generate a PNG for sharing.',
      },
    ],
  },
  callToAction: {
    title: 'Build the family behind your story',
    description: 'Open Fantasy Family Tree Maker to place your characters, connect generations, and keep the tree ready for your next chapter or session.',
    action: 'Create a Family Tree for Free',
  },
  faq: {
    title: 'Family Tree Maker FAQ',
    description: 'Answers about editing, saving, exporting, and using Fantasy Family Tree Maker on smaller screens.',
    items: [
      {
        question: 'Is the Family Tree Maker free, and do I need an account?',
        answer: 'Yes. Fantasy Family Tree Maker is free to use without registering. It does not require an account to edit a tree or use the local save and export controls.',
      },
      {
        question: 'How many generations can I create?',
        answer: 'Fantasy Family Tree Maker is currently limited to four generations. Each person belongs to one of those four rows, and people can be moved horizontally within their own generation.',
      },
      {
        question: 'What do solid, dashed, and empty endpoints mean?',
        answer: 'They are visual endpoint styles that you choose for your layout. The tool does not infer or assign a relationship meaning to them.',
      },
      {
        question: 'Can I edit people and connections after creating them?',
        answer: 'Yes. You can edit a person’s portrait and details, change endpoint styles, and move or resize generation connections. People can be dragged within the same generation, but they cannot be dragged across generations.',
      },
      {
        question: 'How do I save and restore an editable tree?',
        answer: 'To continue editing in Fantasy Family Tree Maker, use Save on one of the five browser slots, then use Load to restore it, or save a TXT file and choose it before loading. A PNG is an image export and cannot restore the editable tree.',
      },
      {
        question: 'What happens if I clear browser data or switch browsers?',
        answer: 'Browser slots belong to the current browser’s site data. Clearing that data or switching browsers or devices will not carry those slots over. There is no automatic save, so save a slot or download the TXT file when you want to keep your work.',
      },
      {
        question: 'Is the PNG transparent?',
        answer: 'Yes. PNG generation uses a transparent background by default, and you can choose a white background before saving. Keep the TXT file if you need to continue editing.',
      },
      {
        question: 'Can I use it on a phone?',
        answer: 'Yes. Fantasy Family Tree Maker works on phones through the mobile action bar, which provides access to person editing, connection editing, and save/export controls. The same four-generation and manual connection limits still apply.',
      },
    ],
  },
};

const chineseFamilyTreePageContent: FamilyTreePageContent = {
  whatIs: {
    title: '什么是奇幻人物家谱制作器？',
    paragraphs: [
      '奇幻人物家谱制作器用来梳理小说、世界观项目或 D&D / TRPG 战役中的家族与人物关系。',
      '奇幻人物家谱制作器的画布会显示每个人物的头像和姓名，年龄与描述作为人物资料备注保留；你可以按四代布局人物并手动安排关系连线，让重要分支更容易查看。',
      '它适合小说作者、世界观创作者、GM 和玩家，在规划故事、设定或战役时作为清晰的关系参考。',
    ],
  },
  features: {
    title: '梳理角色关系所需的功能',
    description: '使用奇幻人物家谱制作器，创建清晰易读的人物家谱，同时由你决定人物信息和布局方式。',
    items: [
      {
        icon: 'portrait',
        title: '自定义或随机生成头像',
        description: '在奇幻人物家谱制作器中，从八类头像部件、颜色调色板、皱纹和疤痕中选择，也可以随机生成一套初始头像。',
      },
      {
        icon: 'profile',
        title: '集中编辑人物信息',
        description: '为每个人物填写姓名、年龄和描述，让家谱同时保留你需要的角色备注。',
      },
      {
        icon: 'generations',
        title: '排列四代人物',
        description: '把人物放入四代中的一代，并在当前代内横向拖动调整位置。',
      },
      {
        icon: 'connections',
        title: '手动绘制并调整连线',
        description: '将每个端点设为无、实线或虚线，再手动移动和调整层间连线的长度。',
      },
      {
        icon: 'save',
        title: '保存五个浏览器槽位或 TXT 文件',
        description: '奇幻人物家谱制作器提供五个手动浏览器存档槽快速恢复，也可以保存和载入 TXT 文件，保留一份可带走的副本。',
      },
      {
        icon: 'export',
        title: '导出 PNG 图片',
        description: '奇幻人物家谱制作器可以生成 PNG，默认使用透明背景；需要时先选择白色背景，再保存图片。',
      },
    ],
  },
  toolComparison: {
    title: 'Fantasy Family Tree Maker vs Canva vs draw.io',
    description: '奇幻人物家谱制作器将头像部件、人物资料和现成的世代画布组合起来；你不用从空白画布开始，也能为小说、奇幻世界和 D&D 战役整理家族关系。',
    tableLabel: '人物家谱工具对比',
    dimensionHeading: '对比维度',
    familyTreeMakerHeading: '人物家谱制作器',
    canvaHeading: 'Canva',
    drawioHeading: 'draw.io',
    rows: [
      {
        dimension: '角色头像',
        familyTreeMaker: '内置头像部件与配色，点选组合或随机生成，直接用于家谱',
        canva: '需要自行准备',
        drawio: '需要自行准备',
      },
      {
        dimension: '开始制作',
        familyTreeMaker: '现成的四代画布，选择世代即可添加人物',
        canva: '需要自行设计',
        drawio: '需要自行设计',
      },
      {
        dimension: '人物资料',
        familyTreeMaker: '姓名、年龄和描述随人物保存，点击人物即可集中编辑',
        canva: '需要自行准备',
        drawio: '需要自行准备',
      },
      {
        dimension: '关系绘制',
        familyTreeMaker: '提供实线、虚线端点和层间连线，可拖动并调整长度',
        canva: '使用形状、箭头和连接线设计关系',
        drawio: '连接人物节点，设置连线样式和树形布局',
      },
      {
        dimension: '保存续编',
        familyTreeMaker: '五个浏览器槽位分别保存家谱，也可保存 TXT 文件，之后载入继续修改',
        canva: '自动保存设计，返回后继续编辑',
        drawio: '保存为可编辑的 .drawio 文件，之后重新打开',
      },
    ],
  },
  howItWorks: {
    title: '制作人物家谱的步骤',
    description: '从故事中最重要的人物开始，再按世代逐步扩展关系。',
    steps: [
      {
        title: '准备人物',
        description: '在奇幻人物家谱制作器中，选择或随机生成头像，然后填写人物的姓名、年龄和描述。',
      },
      {
        title: '选择世代并排列人物',
        description: '在奇幻人物家谱制作器中，先选择四代中的一代，再把人物添加到该代，并在本代内横向拖动排列。',
      },
      {
        title: '设置端点并连接世代',
        description: '在奇幻人物家谱制作器中，选中人物后设置人物的端点样式，再添加层间连线，并移动或调整连线长度以适应布局。',
      },
      {
        title: '保存或导出成果',
        description: '奇幻人物家谱制作器支持将成果保存到浏览器槽位或 TXT 文件，也可以生成 PNG 图片用于分享。',
      },
    ],
  },
  callToAction: {
    title: '从角色关系开始构建你的故事',
    description: '打开奇幻人物家谱制作器，安排人物、连接不同世代，把家谱留给下一章或下一次战役继续使用。',
    action: '免费制作家谱',
  },
  faq: {
    title: '人物家谱制作器常见问题',
    description: '了解奇幻人物家谱制作器的人物编辑、保存、导出以及在小屏幕上的使用方式。',
    items: [
      {
        question: '这个工具免费吗，需要注册账号吗？',
        answer: '可以免费使用奇幻人物家谱制作器，无需注册。编辑家谱以及使用本地存档和导出功能都不需要账号。',
      },
      {
        question: '最多可以创建几代人物？',
        answer: '奇幻人物家谱制作器当前固定为四代。每个人物属于其中一代，只能在本代内横向拖动，不能跨代移动。',
      },
      {
        question: '实线、虚线和无端点分别代表什么？',
        answer: '在奇幻人物家谱制作器中，实线、虚线和无端点都是由你选择的视觉样式，工具不会自动推断或赋予某种亲属关系含义。',
      },
      {
        question: '创建后还能编辑人物和连线吗？',
        answer: '可以。你可以编辑人物头像和信息，修改端点样式，也可以移动或调整层间连线。人物只能在同一代内拖动，不能跨代拖动。',
      },
      {
        question: '怎样保存并恢复可编辑的家谱？',
        answer: '要在奇幻人物家谱制作器中继续编辑，可以保存到五个浏览器存档槽，再用载入恢复；也可以保存 TXT 文件，选择文件后再载入。PNG 只是图片导出，不能恢复可编辑家谱。',
      },
      {
        question: '清理浏览器数据或更换浏览器后会怎样？',
        answer: '奇幻人物家谱制作器的浏览器槽位属于当前浏览器的站点数据。清理数据、更换浏览器或设备都不会自动带走这些槽位。工具没有自动存档，需要主动保存槽位或下载 TXT 文件。',
      },
      {
        question: 'PNG 是透明背景吗？',
        answer: '是。PNG 默认使用透明背景，也可以在保存前选择白色背景。要继续编辑，请保留 TXT 文件。',
      },
      {
        question: '手机上可以使用吗？',
        answer: '奇幻人物家谱制作器可以在手机上使用，底部操作栏提供人物编辑、连接编辑和保存 / 导出入口；四代限制和手动连线方式保持不变。',
      },
    ],
  },
};

export function getFamilyTreePageContent(locale: SiteLocale): FamilyTreePageContent {
  if (locale === 'en') {
    return englishFamilyTreePageContent;
  }

  if (locale === 'zh') {
    return chineseFamilyTreePageContent;
  }

  throw new Error(`Unknown family tree page content locale: ${JSON.stringify(locale)}.`);
}
