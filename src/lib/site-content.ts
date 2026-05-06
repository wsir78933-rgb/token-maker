import type { SiteLocale } from '@/lib/site-locale';

export interface HomeSignal {
  label: string;
  value: string;
  description: string;
}

export interface HomeFeature {
  title: string;
  description: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TemplatePageData {
  slug: string;
  title: string;
  description: string;
  summary: string;
  intent: string;
  bestFor: string[];
  settings: string[];
  tips: string[];
  query: string;
}

export const siteConfig = {
  name: 'Token Maker',
  shortName: 'Token Maker',
  title: 'Token Maker | Browser VTT Token Tool for DnD, Roll20, and Foundry VTT',
  description:
    'The best free VTT token maker for DnD, Roll20, and Foundry VTT. Upload character art, crop portraits, add masks, borders, and text, then export transparent PNG tokens in seconds.',
} as const;

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tokenmaker.one';
  return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
}

export function absoluteUrl(path = '/') {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export const homeSignals: HomeSignal[] = [
  {
    label: 'Processing',
    value: 'Local-first',
    description: 'Character art can stay in the browser while you crop, frame, and export VTT tokens in Token Maker.',
  },
  {
    label: 'Export',
    value: 'Up to 2048',
    description: 'Export transparent PNG tokens sized for live tables, archive libraries, and premium pack workflows.',
  },
  {
    label: 'Masks',
    value: 'Circle to d12',
    description: 'Switch between circle, square, and polygon token crops without rebuilding the whole layout.',
  },
  {
    label: 'Workflow',
    value: 'One screen',
    description: 'Upload, position, style, and export from one tabletop-focused workspace instead of a generic graphics app.',
  },
];

export const homeFeatures: HomeFeature[] = [
  {
    title: 'Build VTT tokens without opening Photoshop',
    description:
      'Upload art, frame the portrait, and export from one browser workspace built for token making, not layered design files.',
  },
  {
    title: 'Choose token masks and borders for each table',
    description:
      'Move between circle, square, and hex token layouts, then pair them with frames that fit heroes, monsters, or factions.',
  },
  {
    title: 'Export PNG tokens ready for DnD, Roll20, and Foundry VTT',
    description:
      'The editor stays focused on clean transparent output that reads well at game-table scale instead of chasing decorative filters.',
  },
  {
    title: 'Keep campaign token sets visually consistent',
    description:
      'Reuse presets so player characters, NPCs, monsters, and encounter packs share a coherent token language across the whole campaign.',
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    title: '1. Drop portrait art into the workspace',
    description:
      'Use local files, then frame the subject with wheel zoom and drag positioning until the face reads clearly at token scale.',
  },
  {
    title: '2. Pick the mask, frame, and accent colors',
    description:
      'Choose a circle, square, or polygon crop, then combine it with a border style that fits the role, faction, or encounter tier.',
  },
  {
    title: '3. Export PNGs for your table',
    description:
      'Download a clean PNG from Token Maker and move straight into Roll20, Foundry VTT, Owlbear, or any other map workflow that accepts image tokens.',
  },
];

export const faqItems: FaqItem[] = [
  {
    question: 'What is Token Maker actually for?',
    answer:
      'Token Maker is a browser editor for turning character art, monster portraits, and NPC avatars into tabletop tokens with cropping, masks, borders, text, and PNG export.',
  },
  {
    question: 'Do my images stay in the browser?',
    answer:
      'The default workflow is local-first. For the normal crop-and-export flow, portrait images can stay in the browser instead of being pushed to a remote upload step.',
  },
  {
    question: 'Which tabletops and workflows does it fit best?',
    answer:
      'The output is aimed at common PNG-based tabletop workflows such as Roll20, Foundry VTT, Owlbear Rodeo, and similar setups where a clean token image matters more than a layered design file.',
  },
  {
    question: 'Can I use shapes, custom borders, and masks that match my campaign?',
    answer:
      'Yes. The editor supports circular, square, and polygon crops, and you can also bring in custom border or mask artwork when the default styles are not enough.',
  },
  {
    question: 'What export size should I pick first?',
    answer:
      'Start with 512 for most tables. Move to 1024 when you want cleaner archive-quality edges, and reserve 2048 for premium packs, print-adjacent output, or long-term asset libraries.',
  },
];

export const templatePages: TemplatePageData[] = [
  {
    slug: 'square-token-maker',
    title: 'Square Token Maker',
    description:
      'Build square map tokens for grid-based tabletop play, handout markers, and UI-aligned NPC portraits.',
    summary:
      'Square tokens are useful when you want more edge detail, visible props, or stronger alignment with grid-first map software. This setup works well for battlemaps with dense props or modern / sci-fi encounters where portraits need room around the subject.',
    intent: 'Best for grid-aligned markers, sci-fi portraits, and handout style tokens.',
    bestFor: [
      'Square grid battlemaps',
      'Portraits with visible shoulders, hats, or weapons',
      'Faction markers and room labels',
    ],
    settings: [
      'Mask: square',
      'Borders: thin ring, metal, or none for a flat card look',
      'Export size: 512 or 1024 depending on map zoom',
    ],
    tips: [
      'Use extra headroom so helmets, banners, or shoulder armor are not cropped away.',
      'A square token works well with thin borders when the art already has a decorative frame.',
      'Use text only when the token needs a call sign, rank, or room code.',
    ],
    query: '/?mask=square&border=thin-ring#editor-workspace',
  },
];

export const templatePageMap = new Map(templatePages.map((page) => [page.slug, page]));

export interface NavLabels {
  editor: string;
  diceRoller: string;
  templates: string;
  blog: string;
  faq: string;
  privacy: string;
  switchLocale: string;
}

export interface ShellCopy {
  backToSite: string;
  browseTemplates: string;
  whyThisPageExists: string;
  whyPageBullets: string[];
}

export interface HomeCopy {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroHighlights: string[];
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  featuresTitle: string;
  featuresDescription: string;
  comparisonTitle: string;
  comparisonPoints: string[];
  audienceEyebrow: string;
  audienceTitle: string;
  audienceDescription: string;
  audiences: Array<{ title: string; description: string }>;
  templatesEyebrow: string;
  templatesTitle: string;
  seeAllTemplatePages: string;
  resourcesEyebrow: string;
  resourcesTitle: string;
  resourcesDescription: string;
  faqTitle: string;
  faqDescription: string;
}

export interface CollectionPageCopy {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
}

export interface StaticPageSection {
  title: string;
  body: string;
}

export interface DiceRollerPreset {
  label: string;
  description: string;
}

export interface DiceRollerPageCopy {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  heroBadges: string[];
  trayEyebrow: string;
  trayTitle: string;
  trayDescription: string;
  trayNotes: string[];
  presetsTitle: string;
  presetsDescription: string;
  presets: DiceRollerPreset[];
  guideTitle: string;
  guideDescription: string;
  guideSections: StaticPageSection[];
  faqTitle: string;
  faqDescription: string;
  faqItems: FaqItem[];
  structuredDataFeatures: string[];
  statsGuide: {
    headline: string;
    methodTitle: string;
    methodBody: string[];
    connectTitle: string;
    connectBody: string[];
    extraTitle: string;
    extraBody: string[];
    alternativesTitle: string;
    alternativesBody: string[];
  };
}

export const siteConfigZh = {
  name: 'Token Maker',
  shortName: 'Token Maker',
  title: 'Token Maker | VTT Token 制作器与 TRPG 角色 Token 在线工具',
  description:
    '全球最好用的免费 VTT Token 制作工具，适合 DnD、Roll20 和 Foundry VTT。上传角色立绘，裁切头像，添加边框、遮罩和文字，几秒内导出透明 PNG Token。',
} as const;

export const homeSignalsZh: HomeSignal[] = [
  {
    label: '处理方式',
    value: '本地优先',
    description: '角色立绘可以直接留在浏览器里裁切、加框并导出透明 PNG，不必先走远程上传。',
  },
  {
    label: '导出',
    value: '最高 2048',
    description: '既能满足日常桌面使用，也能留出更高分辨率做长期素材库或资源包。',
  },
  {
    label: '形状',
    value: '圆形到十二边',
    description: '圆形、方形和多边形裁切可以快速切换，不必重新做整套布局。',
  },
  {
    label: '工作流',
    value: '单屏完成',
    description: '上传、定位、配色、导出都在同一个工作区完成，比通用修图更适合 GM 快速备战。',
  },
];

export const homeFeaturesZh: HomeFeature[] = [
  {
    title: '在浏览器里完成 TRPG 角色 Token 制作',
    description: '这个工作区围绕头像裁切和透明 PNG 输出设计，不需要像在 Photoshop 里那样先搭画布、图层和导出动作。',
  },
  {
    title: '一个工作区里处理裁切、遮罩和边框',
    description: '你可以把同一张头像切成圆形、方形或六边形，再换不同边框去适配玩家角色、怪物或阵营单位。',
  },
  {
    title: '输出直接适配 DnD、Roll20 和 Foundry VTT',
    description: '重点不是做花哨滤镜，而是让透明 PNG Token 在真实桌面环境里更清晰、更容易识别。',
  },
  {
    title: '让一整场战役里的风格保持统一',
    description: '怪物、NPC、阵营单位可以共用一套边框和强调色，不用每做一张头像都从头重来。',
  },
];

export const workflowStepsZh: WorkflowStep[] = [
  {
    title: '1. 把立绘拖进工作区',
    description: '直接拖本地图片进来，用滚轮缩放和拖拽定位，把脸部或轮廓调整到适合 token 的视觉中心。',
  },
  {
    title: '2. 选择遮罩、边框和强调色',
    description: '根据战役风格决定用圆形、方形或多边形，再搭配适合职业、阵营或怪物类型的边框。',
  },
  {
    title: '3. 导出 PNG 到你的桌面工具',
    description: '导出后可以直接进入 Roll20、Foundry VTT、Owlbear Rodeo 或你自己的地图工作流。',
  },
];

export const faqItemsZh: FaqItem[] = [
  {
    question: 'Token Maker 到底适合拿来做什么？',
    answer: '它是一个浏览器编辑器，专门把角色立绘、怪物头像和 NPC 头像快速做成可裁切、可加边框和遮罩、并能导出 PNG 的桌面 token。',
  },
  {
    question: '图片默认会留在浏览器里吗？',
    answer: '默认流程是本地优先。正常的裁切和导出过程中，角色图可以一直停留在浏览器里，不需要先走远程上传这一步。',
  },
  {
    question: '它更适合哪些桌面和工作流？',
    answer: '导出结果主要面向 Roll20、Foundry VTT、Owlbear Rodeo 这类接受 PNG token 的工作流，也适合任何只需要干净透明图片输出的桌面环境。',
  },
  {
    question: '能不能用更贴合战役的形状、边框和遮罩？',
    answer: '可以。编辑器已经支持圆形、方形和多边形裁切，也支持自定义边框和遮罩素材，不够用时可以按你自己的世界观继续扩展。',
  },
  {
    question: '导出尺寸第一步应该怎么选？',
    answer: '大多数桌面场景先用 512 就够了。想保留更干净的归档边缘时升到 1024，只有做高质量资源包、打印相关输出或长期素材库时再考虑 2048。',
  },
];

export const templatePagesZh: TemplatePageData[] = [
  {
    slug: 'square-token-maker',
    title: '方形 Token 制作器',
    description: '制作适合网格地图、手札标记和更完整头像构图的方形 token。',
    summary: '方形 token 更适合保留肩部、武器和更多边缘细节，也更容易和网格型地图或现代题材 UI 风格融合。',
    intent: '适合网格地图标记、科幻头像和手札风格 token。',
    bestFor: ['方格地图', '需要保留帽子、肩甲或武器的头像', '阵营标记与房间标签'],
    settings: ['遮罩：方形', '边框：细环、金属或无边框', '导出：512 或 1024 视地图缩放而定'],
    tips: [
      '头顶留白要比圆形 token 更多，否则高帽和旗帜很容易被吃掉。',
      '如果原图自带装饰边缘，方形 token 反而更适合薄边框。',
      '只有在需要代号、军衔或房间编号时再加文字，避免画面过满。',
    ],
    query: '/zh?mask=square&border=thin-ring#editor-workspace',
  },
];

export const navLabelsByLocale: Record<SiteLocale, NavLabels> = {
  en: {
    editor: 'Editor',
    diceRoller: 'Dice Roller',
    templates: 'Templates',
    blog: 'Blog',
    faq: 'FAQ',
    privacy: 'Privacy',
    switchLocale: '中文',
  },
  zh: {
    editor: '编辑器',
    diceRoller: '骰子',
    templates: '模板页',
    blog: '博客',
    faq: '常见问题',
    privacy: '隐私',
    switchLocale: 'English',
  },
};

export const shellCopyByLocale: Record<SiteLocale, ShellCopy> = {
  en: {
    backToSite: 'Back to',
    browseTemplates: 'Dice Roller',
    whyThisPageExists: 'Why this page exists',
    whyPageBullets: [
      'These inner pages explain when a specific format, workflow, or policy detail matters.',
      'Each page should answer a different tabletop decision instead of repeating the editor.',
      'The editor remains the primary surface, while the supporting content helps users choose faster.',
    ],
  },
  zh: {
    backToSite: '返回',
    browseTemplates: '骰子工具',
    whyThisPageExists: '为什么要有这类页面',
    whyPageBullets: [
      '这些内页用来解释某种格式、流程或策略什么时候真正有用。',
      '每个页面都应该回答不同的桌面决策，而不是把编辑器再讲一遍。',
      '编辑器仍然是核心入口，补充内容只是帮助用户更快做判断。',
    ],
  },
};

export const homeCopyByLocale: Record<SiteLocale, HomeCopy> = {
  en: {
    heroEyebrow: 'VTT token maker',
    heroTitle: 'Token Maker for TRPG and VTT tokens',
    heroDescription:
      'The best free VTT token maker for DnD, Roll20, and Foundry VTT. Upload character art, crop the portrait, add masks, borders, and text, then export a transparent PNG token in seconds.',
    heroHighlights: [
      'Circle, square, and hex token formats',
      'Transparent PNG export up to 2048',
      'DnD, Roll20, Foundry VTT, and Owlbear',
    ],
    heroPrimaryCta: 'Start making tokens',
    heroSecondaryCta: 'See token templates',
    featuresTitle: 'Why this workflow is faster for real table prep',
    featuresDescription:
      'The workflow stays focused on the three steps that matter most for tabletop art: crop, style, and export.',
    comparisonTitle: 'Faster than rebuilding each token in Photoshop',
    comparisonPoints: [
      'No manual canvas setup, masking layers, or repeat export actions for every portrait.',
      'Frames, crops, and token shapes are already tuned for repeated tabletop work.',
      'You finish with a transparent PNG token instead of a generic project file.',
    ],
    audienceEyebrow: 'Best for',
    audienceTitle: 'Made for GMs, players, and token pack builders',
    audienceDescription:
      'If you need readable VTT tokens rather than full illustration editing, the workflow stays focused and quick.',
    audiences: [
      {
        title: 'GM prep',
        description: 'Turn monster art, NPC portraits, and encounter variants into readable tokens quickly.',
      },
      {
        title: 'Player portraits',
        description: 'Keep character tokens consistent across a campaign without redoing the whole layout.',
      },
      {
        title: 'Asset packs',
        description: 'Produce cleaner token sets for archives, premium packs, or long-term libraries.',
      },
    ],
    templatesEyebrow: 'Template directory',
    templatesTitle: 'Start from the token format that matches the table',
    seeAllTemplatePages: 'See all template pages',
    resourcesEyebrow: 'Need more detail?',
    resourcesTitle: 'Templates and FAQ cover the decisions that slow people down',
    resourcesDescription:
      'Use the template directory and FAQ when you need a second pass on export size, platform fit, or workflow choices.',
    faqTitle: 'Three questions people check before exporting',
    faqDescription: 'Open the full FAQ for privacy, export sizing, and tabletop compatibility.',
  },
  zh: {
    heroEyebrow: 'VTT Token 制作器',
    heroTitle: '在浏览器里完成 TRPG 角色 Token 制作',
    heroDescription:
      '全球最好用的免费 VTT Token 制作工具，适合 DnD、Roll20 和 Foundry VTT。上传角色立绘后，直接裁切头像、添加遮罩、边框和文字，几秒内导出透明 PNG。',
    heroHighlights: [
      '圆形、方形、六边形格式',
      '透明 PNG 导出最高 2048',
      '适合 DnD、Roll20、Foundry VTT',
    ],
    heroPrimaryCta: '开始制作 Token',
    heroSecondaryCta: '查看 Token 模板',
    featuresTitle: '为什么这个 Token 制作器更适合真实桌面流程',
    featuresDescription:
      '它把你最常重复的动作压缩成一条短流程: 裁切、加框、导出，不再让通用修图步骤拖慢节奏。',
    comparisonTitle: '比在 Photoshop 里一张张处理头像更快',
    comparisonPoints: [
      '不用每次重新建画布、画蒙版和重复导出动作。',
      '圆形、方形、六边形和常用边框已经围绕桌面头像制作准备好。',
      '最后拿到的是透明 PNG，可直接丢进 Roll20、Foundry VTT 等桌面工具。',
    ],
    audienceEyebrow: '适合谁',
    audienceTitle: '适合 GM、玩家和做资源包的人',
    audienceDescription:
      '如果你的目标是清晰、统一、能直接进桌面工具的角色头像或怪物素材，这套流程会比通用修图更省步骤。',
    audiences: [
      {
        title: 'GM 备战',
        description: '把怪物、NPC 和遭遇战变体快速做成可读性高的头像素材。',
      },
      {
        title: '玩家角色',
        description: '让角色头像在一整场战役里保持统一风格，而不是每次重新裁切。',
      },
      {
        title: '素材整理',
        description: '为长期素材库、商用资源包或战役归档输出更整齐的 PNG。',
      },
    ],
    templatesEyebrow: '模板目录',
    templatesTitle: '从最接近你桌面场景的格式开始',
    seeAllTemplatePages: '查看全部模板',
    resourcesEyebrow: '需要更细的判断时',
    resourcesTitle: '模板页和 FAQ 解决尺寸、平台和流程选择',
    resourcesDescription: '当你要决定导出尺寸、平台适配或批量风格时，优先回看模板页和 FAQ。',
    faqTitle: '上手前最常确认的 3 个问题',
    faqDescription: '隐私、尺寸和平台兼容还有更多说明，继续看完整 FAQ。',
  },
};

export const collectionPageCopyByLocale: Record<
  SiteLocale,
  {
    templates: CollectionPageCopy;
    faq: CollectionPageCopy;
    privacy: CollectionPageCopy;
  }
> = {
  en: {
    templates: {
      eyebrow: 'Template collection',
      title: 'Square token maker template',
      description: 'Open the square token maker workflow for grid-based tabletop maps, handout markers, and UI-aligned NPC portraits.',
      ctaLabel: 'Open the editor',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Support FAQ for Token Maker',
      description: 'Read five short answers about fit, exports, local processing, and practical token-making decisions.',
    },
    privacy: {
      eyebrow: 'Privacy',
      title: 'Local-first privacy for Token Maker',
      description: 'Learn how the default browser workflow handles images and what future remote features would need to explain.',
    },
  },
  zh: {
    templates: {
      eyebrow: '模板集合',
      title: '方形 Token 制作器模板页',
      description: '这里保留方形 token 工作流，适合网格地图、手札标记和更完整头像构图。',
      ctaLabel: '打开编辑器',
    },
    faq: {
      eyebrow: '常见问题',
      title: 'Token Maker 支持 FAQ',
      description: '用五个短答案说明适配、导出、本地处理和实际制作决策。',
    },
    privacy: {
      eyebrow: '隐私',
      title: 'Token Maker 的本地优先隐私说明',
      description: '说明默认浏览器工作流怎样处理图片，以及未来远程能力会如何披露。',
    },
  },
};

export const privacySectionsByLocale: Record<SiteLocale, StaticPageSection[]> = {
  en: [
    {
      title: 'Local-first image handling',
      body:
        'The main editor is designed so portrait images can stay in the browser while you crop, frame, and export them. That keeps the default experience simple and better suited for campaign art, client commissions, and private homebrew material.',
    },
    {
      title: 'Export behavior',
      body:
        'PNG export is generated from the editor state on the client side. If you are only using the local workflow, the normal download action does not require the site to store your portrait image on a server.',
    },
    {
      title: 'Optional remote upload model',
      body:
        'The product requirements already describe upload as an adapter layer. If you later enable remote storage, document the storage provider, retention policy, and share-link behavior before turning it on in production.',
    },
    {
      title: 'Analytics and operations',
      body:
        'If you add analytics, error tracking, or rate limiting in production, keep those disclosures in this page so the operational detail stays easy to find when users need it.',
    },
  ],
  zh: [
    {
      title: '本地优先的图片处理方式',
      body:
        '主编辑器默认按本地优先设计。你在裁切、加框和导出时，角色立绘可以一直停留在浏览器里，这对私有战役素材、委托稿和自制设定都更合适。',
    },
    {
      title: '导出行为',
      body:
        'PNG 导出是基于当前编辑器状态在客户端生成的。如果你只使用默认本地流程，普通下载动作不需要网站把你的原图存到服务器。',
    },
    {
      title: '可选的远程上传模式',
      body:
        '需求里已经把上传设计成适配层。如果你以后要接对象存储或分享链接，最好在正式启用前把存储位置、保留期限和分享方式说明清楚。',
    },
    {
      title: '分析与运维',
      body:
        '如果后面会上线统计、错误追踪或限流，这些内容应该持续更新在这里，让真正需要查看的人能快速找到运维细节。',
    },
  ],
};

export const diceRollerPageCopyByLocale: Record<SiteLocale, DiceRollerPageCopy> = {
  en: {
    metadataTitle:
      'dice roller dnd | Fast d20, d6, d8, d10, d12 and d100 roller online',
    metadataDescription:
      'Roll d20, d6, d8, d10, d12, and d100 online with an animated DnD dice tray, fast presets, roll breakdowns, local history, and practical FAQ notes.',
    eyebrow: 'dice roller dnd',
    title: 'dice roller dnd',
    description:
      'A DnD dice roller inside Token Maker with an animated tray, fast expression input, common tabletop presets, roll breakdowns, and a local roll log.',
    intro:
      'Roll d20, d12, d10, d8, d6, d4, and d100 directly in the tray, or type expressions such as 1d20+5, 2d6+3, and 4d6dl1.',
    heroBadges: ['Common DnD rolls', 'Animated dice tray', 'Local roll log and breakdown'],
    trayEyebrow: 'Interactive dice tray',
    trayTitle: 'Roll dice in a live tabletop tray',
    trayDescription:
      'Use the animated tray for quick rolls, then read the expression input, presets, result breakdown, and roll history without leaving the page.',
    trayNotes: [
      'The primary roll interaction stays above the fold, so a user can start with the tray immediately.',
      'FAQ and rules notes explain common dice expressions, roll breakdowns, and character stat generation.',
      'The animated tray stays tied to the tabletop workflow instead of acting like a separate visual showcase.',
    ],
    presetsTitle: 'Common DnD roll presets',
    presetsDescription:
      'These expressions cover the checks, attacks, damage rolls, and character stat rolls most tables need during play.',
    presets: [
      {
        label: '1d20 ability check',
        description: 'The baseline roll for ability checks, saves, attacks, and many quick rulings.',
      },
      {
        label: '1d20 + modifier',
        description: 'Attack rolls, saves, and skill checks need a modifier path that stays obvious, not hidden in secondary controls.',
      },
      {
        label: '2d6 + 3 damage',
        description: 'Damage expressions stay readable in both the tray result and the detailed roll breakdown.',
      },
      {
        label: '4d6 drop lowest',
        description: 'Use the classic 4d6 drop lowest method for ability scores and keep each result in the local log.',
      },
    ],
    guideTitle: 'What the Dice Tray Supports',
    guideDescription:
      'The dice roller is built for live DnD play, so it needs to make supported dice, common expressions, and mid-session behavior clear before the first roll.',
    guideSections: [
      {
        title: 'Supported dice language',
        body:
          'The roller supports d4, d6, d8, d10, d12, d20, and d100, plus familiar expressions such as 1d20+5 or 4d6dl1.',
      },
      {
        title: 'Why it has its own page',
        body:
          'Dice rolling and token editing are different tabletop jobs. Keeping the tray on its own page makes it faster to open during a session while the editor stays focused on portrait and token prep.',
      },
      {
        title: 'What the guide content covers',
        body:
          'The short notes and FAQ explain dice notation, common presets, character stat rolling, and how to use the tray without interrupting the table.',
      },
    ],
    faqTitle: 'Dice Roller DnD FAQ',
    faqDescription:
      'These answers clarify what the roller supports, how the 3D tray works in practice, and why dice rolling lives separately from token editing.',
    faqItems: [
      {
        question: 'What is the dice roller dnd page for on Token Maker?',
        answer:
          'It is a tabletop utility page for DnD-style dice rolling. It combines an interactive tray, expression input, quick presets, roll breakdown, local history, and FAQ notes.',
      },
      {
        question: 'Which dice should the page focus on first?',
        answer:
          'The first layer covers the standard DnD dice set: d4, d6, d8, d10, d12, d20, and d100, along with common expressions such as 1d20 plus a modifier or 4d6 drop lowest.',
      },
      {
        question: 'Why not merge this directly into the token editor?',
        answer:
          'The token editor and the dice roller solve different jobs. Keeping dice roller dnd on its own page makes the tray easier to open during play and keeps the main editor flow focused on token creation.',
      },
      {
        question: 'Does the 3D tray still include written rules help?',
        answer:
          'Yes. The 3D tray handles the interaction, while the surrounding text explains supported dice, common DnD expressions, stat rolling, and practical table use.',
      },
    ],
    structuredDataFeatures: [
      'Dedicated dice roller dnd tool inside Token Maker',
      'Animated physics-like dice tray with live roll animation',
      'DnD-focused dice language including d20 checks and 4d6 drop lowest',
      'Roll breakdown, local history, FAQ, and practical rules notes',
    ],
    statsGuide: {
      headline: 'How Many Dice to Roll for Stats DnD?',
      methodTitle: 'The Default Method: 4d6 Drop Lowest',
      methodBody: [
        'If you are reading the Player’s Handbook for Dungeons & Dragons 5th Edition, the standard and most widely accepted way to generate character ability scores is the "4d6 drop lowest" method.',
        'The process is simple: grab four 6-sided dice (4d6) and roll them all at once. Look at the numbers, find the die showing the lowest value, and remove it from the pool. Then, add the remaining three numbers together. This final sum is one of your ability scores. You need to repeat this exact process six times to generate a complete array of six numbers—one for Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma.',
        'Once you have your six numbers, you are completely free to assign them to your stats in whichever order best fits the class you are building. Want to be a wizard? Put your highest roll into Intelligence. Rolling a barbarian? Prioritize Strength.'
      ],
      connectTitle: 'Generating Stats Instantly',
      connectBody: [
        'Manually rolling 24 individual dice by hand can be tedious when you just want to get to Character Creation. You can bypass the busywork while still keeping the true randomness by using the interactive dice tray above.',
        'Simply click the "4d6 drop lowest" preset button. The tool automatically rolls four d6s, mathematically identifies and drops the lowest value, and logs the final summed result for you. Click it six times, and your character’s baseline stats are ready.'
      ],
      extraTitle: 'Why do we roll 4d6 instead of just 3d6?',
      extraBody: [
        'In the very early, hardcore days of tabletop gaming, players generated stats by simply rolling 3d6 strictly "down the line". This created a pure, unyielding bell curve where the average stat was always 10.5—representing an average, unremarkable commoner.',
        'Modern DnD 5e is designed around heroic fantasy. By rolling a fourth die and dropping the lowest result, the statistical average is pulled upward to roughly 12.24, and the chances of rolling extremely crippling low numbers (like a 3 or 4) are drastically reduced. This mathematical shift ensures that player characters begin the game feeling inherently more competent, durable, and ready for adventure.'
      ],
      alternativesTitle: 'Alternative Stat Generation Methods',
      alternativesBody: [
        'While rolling dice is iconic and fun, it inherently creates unbalanced parties—some players will roll like gods, while others roll terribly. If your Dungeon Master prefers a balanced table, they might ask you to skip the dice altogether.',
        'The primary alternatives are the "Standard Array" (where every player gets the exact same six numbers: 15, 14, 13, 12, 10, 8 to assign as they please) or "Point Buy" (where players spend a pool of 27 points to purchase their stats from a fixed escalating cost table, allowing for completely customized stat lines without the risk of a bad roll).'
      ],
    },
  },
  zh: {
    metadataTitle: 'dice roller dnd | 在线 d20、d6、d8、d10、d12 与 d100 掷骰页',
    metadataDescription:
      'dice roller dnd 独立页面接入 Token Maker，内含动态随机骰子托盘、表达式输入、常见 DnD 预设、结果分解、日志与 FAQ 内容。',
    eyebrow: 'dice roller dnd',
    title: 'dice roller dnd',
    description:
      '这是 Token Maker 的 DnD 掷骰工具页，包含动态骰子托盘、表达式输入、常见 DnD 预设、结果分解、日志和 FAQ。',
    intro:
      '你可以直接在骰盘里掷出 d20、d12、d10、d8、d6、d4 和 d100，也可以输入 1d20+5、2d6+3、4d6dl1 这类常见表达式。',
    heroBadges: ['DnD 常用骰式', '直观动态骰盘', '结果分解与本地日志'],
    trayEyebrow: '交互托盘区域',
    trayTitle: '直观骰子场景的主舞台',
    trayDescription:
      '这里已经接上动态动画骰子托盘。表达式输入、快捷预设、结果分解和日志紧跟在托盘下方，让这页成为可直接使用的掷骰工具，而不只是展示动画效果。',
    trayNotes: [
      '主交互留在首屏，用户进入页面就能直接开始掷骰。',
      'FAQ 和规则说明会解释常见骰式、结果分解和角色属性生成。',
      '把动态骰子托盘当成页面核心组件，与上下文强融合。',
    ],
    presetsTitle: '常用 DnD 掷骰预设',
    presetsDescription: '这些表达式覆盖跑团中最常见的检定、攻击、伤害和角色属性生成场景。',
    presets: [
      {
        label: '1d20 检定',
        description: '适合技能检定、豁免和多数需要 d20 的即时判定。',
      },
      {
        label: '1d20 + 修正值',
        description: '攻击、豁免和技能检定都可以直接把熟练、属性或临时加值加进去。',
      },
      {
        label: '2d6 + 3 伤害',
        description: '伤害表达式不仅要能掷，还要能在结果分解区读得清楚。',
      },
      {
        label: '4d6 去最低',
        description: '适合用 4d6 去最低的方式生成角色属性，并在日志里保留每次结果。',
      },
    ],
    guideTitle: '除了 3D 骰盘，这页还支持什么',
    guideDescription:
      '这不是一个抽象随机数按钮，而是面向 DnD 桌面的工具页，所以支持骰子、常见场景和使用方式都要讲清楚。',
    guideSections: [
      {
        title: '支持的骰子语言',
        body:
          '支持 d4、d6、d8、d10、d12、d20、d100，以及 1d20+5、4d6dl1 这类常见写法。',
      },
      {
        title: '为什么单独做页面而不是塞进编辑器',
        body:
          '骰子工具和 Token 编辑器解决的是两件不同的事。独立页面更适合跑团时快速打开，也不会打断主编辑器里的头像处理流程。',
      },
      {
        title: '说明内容的作用',
        body:
          'FAQ 和简短说明会讲清常见骰式、角色属性生成、结果分解和日志使用方式。',
      },
    ],
    faqTitle: 'dice roller dnd 页面 FAQ',
    faqDescription:
      '这些问题会讲清页面现在支持什么、3D 托盘怎么用，以及为什么骰子工具适合单独成页。',
    faqItems: [
      {
        question: 'Token Maker 里的 dice roller dnd 页面是做什么的？',
        answer:
          '它是一个面向 DnD 风格掷骰的独立工具页，内含互动式动画骰子托盘、表达式输入、常用预设、结果分解和 FAQ。',
      },
      {
        question: '这页第一步应该优先覆盖哪些骰子？',
        answer:
          '第一层先覆盖 DnD 最常见的标准骰组: d4、d6、d8、d10、d12、d20 和 d100，并支持 1d20 加修正值、4d6 去最低 这类常见表达。',
      },
      {
        question: '为什么不直接把骰子功能塞进主编辑器？',
        answer:
          '因为 token 编辑器和掷骰器是两种不同任务。把 dice roller dnd 做成独立页面，跑团时更容易快速打开，也不会打断主编辑器里的头像处理流程。',
      },
      {
        question: '除了 3D 骰盘，这页还有文字说明吗？',
        answer:
          '有。骰盘负责交互，旁边的说明和 FAQ 会补充常见骰式、角色属性生成、结果分解和本地日志怎么用。',
      },
    ],
    structuredDataFeatures: [
      'Token Maker 内的独立 dice roller dnd 工具页',
      'CSS 动画物理感骰盘与在线掷骰体验',
      '覆盖 d20 检定与 4d6 去最低等 DnD 场景',
      '结果分解、本地日志、FAQ 与规则说明一并保留',
    ],
    statsGuide: {
      headline: 'How many dice to roll for stats dnd (DnD 5e 属性掷骰指南)',
      methodTitle: '标准规则：4d6 去最低 (4d6 Drop Lowest)',
      methodBody: [
        '如果你翻开《龙与地下城》第五版（DnD 5e）的玩家手册，官方推荐且目前跑团中最普遍使用的属性生成方法，就是大名鼎鼎的“4d6 去最低”法则。',
        '具体操作极其简单：手里捏住 4 颗六面骰（4d6）同时掷出。挑出其中点数最小的一颗拿走，然后把剩下三颗的点数相加。这加起来的最终防数值，就是你的其中一项能力值（Ability Score）。你需要把这个“掷四去一”的流程完完整整地重复 6 次，从而获得总共 6 个数字。',
        '当你拿着这 6 个数字后，就可以根据你想要扮演的职业来自由分配它们：分别填进力量、敏捷、体质、智力、感知与魅力中。比如你想玩法师，就把最大的那个数字丢给智力；想玩野蛮人，自然要优先拉满力量。'
      ],
      connectTitle: '在这个工具里一键搞定',
      connectBody: [
        '如果你真的在桌面上捏塑料骰子，那为了建卡你得手工投 24 次，还要频繁做加减法，很多人嫌麻烦。你完全可以借助上方真正的物理模拟骰盘来省去这些繁琐工作，同时还能享受骰子滚动的快乐。',
        '只要在面板上点击预设的“4d6 去最低 (4d6 drop lowest)”，系统会立刻投出 4 颗 d6。更重要的是，它懂规则——算法会自动帮你把那颗最小的废点剔除，并在下方的日志区清楚地给你列出计算公式和最终数值。连点 6 次，你的初始人物卡属性就出炉了。'
      ],
      extraTitle: '冷知识：为什么要掷四留三，而不是直接掷 3 颗？',
      extraBody: [
        '在非常古老的古典桌面角色扮演时代（也就是所谓的 OSR 硬核时期），老前辈们真的是硬碰硬地直接掷 3d6，而且掷出什么就按顺位填什么。但这在概率学上会造就一条毫无情面的“铁血钟形曲线”——平均值永远死死卡在 10.5。这意味着你扮演出来的角色大概率只是一个平平无奇、随处可见的平民。',
        '但现代的 DnD 5e 主打的是“超凡英雄奇幻”。设计师引入了第四颗骰子并允许你丢掉最差的运气（哪怕掷出 1, 1, 1, 6 也能去掉一个 1）。这一规则上的微调，硬生生把属性的数学期望（平均值）拉高到了 12.24 左右。这一举动极大降低了玩家在一开局就遭遇“天崩开局（属性残废跑不动路）”的挫败感，保证了所有冒险者起步就有超出常人的潜力和英雄光环。'
      ],
      alternativesTitle: '除了掷骰子，还有别的办法吗？',
      alternativesBody: [
        '虽然“4d6”充满了随机的心跳刺激感，但这也意味着同桌的玩家之间会出现“极度不平衡”的惨象——欧皇全属性 16+ 叱咤风云，非酋最高属性可能才 12。如果你的 DM（地下城主）极其看重团队战斗的数值平衡，他们通常会禁止玩家掷属性。',
        '这时候的替代方案就是“标准阵列（Standard Array）”——让全桌所有人都拿完全一模一样的 6 个数字（15, 14, 13, 12, 10, 8）去自由分配；或是采用“购点法（Point Buy）”——拨给你一笔 27 点的预算本金，你自己对着价格表去自由选购属性高低。这些方法虽然少了惊心动魄的掷骰环节，但绝对公平。'
      ],
    },
  },
};

export function getSiteConfig(locale: SiteLocale) {
  return locale === 'zh' ? siteConfigZh : siteConfig;
}

export function getHomeSignals(locale: SiteLocale) {
  return locale === 'zh' ? homeSignalsZh : homeSignals;
}

export function getHomeFeatures(locale: SiteLocale) {
  return locale === 'zh' ? homeFeaturesZh : homeFeatures;
}

export function getWorkflowSteps(locale: SiteLocale) {
  return locale === 'zh' ? workflowStepsZh : workflowSteps;
}

export function getFaqItems(locale: SiteLocale) {
  return locale === 'zh' ? faqItemsZh : faqItems;
}

export function getTemplatePages(locale: SiteLocale) {
  return locale === 'zh' ? templatePagesZh : templatePages;
}

export function getTemplatePage(locale: SiteLocale, slug: string) {
  return getTemplatePages(locale).find((page) => page.slug === slug);
}

export function getNavLabels(locale: SiteLocale) {
  return navLabelsByLocale[locale];
}

export function getShellCopy(locale: SiteLocale) {
  return shellCopyByLocale[locale];
}

export function getHomeCopy(locale: SiteLocale) {
  return homeCopyByLocale[locale];
}

export function getCollectionPageCopy(locale: SiteLocale) {
  return collectionPageCopyByLocale[locale];
}

export function getPrivacySections(locale: SiteLocale) {
  return privacySectionsByLocale[locale];
}

export function getDiceRollerPageCopy(locale: SiteLocale) {
  return diceRollerPageCopyByLocale[locale];
}
