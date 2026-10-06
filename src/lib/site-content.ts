import type { SiteLocale } from '@/lib/site-locale';

export interface HomeSignal {
  label: string;
  value: string;
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
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  intent: string;
  heroBadges: string[];
  bestFor: string[];
  settings: string[];
  tips: string[];
  structuredDataFeatures: string[];
  workflowTitle: string;
  workflowDescription: string;
  workflowSteps: StaticPageSection[];
  platformTitle: string;
  platformDescription: string;
  platforms: StaticPageSection[];
  video: {
    videoId: string;
    title: string;
    description: string;
    thumbnailAlt: string;
  };
  faqTitle: string;
  faqItems: FaqItem[];
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
  query: string;
}

export const siteConfig = {
  name: 'Token Maker',
  shortName: 'Token Maker',
  title: 'DnD Token Maker | Free VTT Token Maker for Roll20 & Foundry VTT',
  description:
    'Create DnD and VTT tokens online for Roll20, Foundry VTT, and Owlbear. Upload character art, add circular or square masks, token borders, text, and export transparent PNG tokens.',
} as const;

export const siteManifestCopy: SiteManifestCopy = {
  description:
    'Free browser VTT token maker for DnD, Roll20, and Foundry VTT. 免费浏览器 VTT Token 制作器，适合 DnD、Roll20 与 Foundry VTT。',
};

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
    question: 'What is a DnD token maker?',
    answer:
      'A DnD token maker turns character art, monster portraits, and NPC avatars into clean VTT tokens with cropping, masks, borders, labels, and PNG export.',
  },
  {
    question: 'Can I make Roll20 and Foundry VTT tokens here?',
    answer:
      'Yes. The exported PNG tokens are designed for Roll20, Foundry VTT, Owlbear Rodeo, and similar virtual tabletop workflows that accept image tokens.',
  },
  {
    question: 'Can I export transparent PNG tokens?',
    answer:
      'Yes. Token Maker exports transparent PNG tokens, so the finished token can sit cleanly on battle maps, character sheets, and token libraries.',
  },
  {
    question: 'Can I make circular, square, and token border styles?',
    answer:
      'Yes. The editor supports circular tokens, square tokens, polygon masks, built-in token borders, tint controls, and custom border artwork.',
  },
  {
    question: 'Do my uploaded images leave the browser?',
    answer:
      'The normal editing workflow is local-first. Portrait images can stay in the browser while you crop, frame, and export tokens.',
  },
];

export const templatePages: TemplatePageData[] = [
  {
    slug: 'square-token-maker',
    metadataTitle: 'Square Token Maker | Make Square VTT Tokens for Roll20 & Foundry',
    metadataDescription:
      'Create square VTT tokens from character art with a 1:1 crop, borders, transparent PNG export, and settings for Roll20, Foundry VTT, and Owlbear.',
    eyebrow: 'Square token maker',
    title: 'Square Token Maker for VTT Maps, NPC Portraits, and Grid Tokens',
    description:
      'Turn character art, monster portraits, and NPC images into square VTT tokens that read cleanly on grid maps and handouts.',
    summary:
      'People searching for a square token maker usually want a practical 1:1 export, not a long design essay. This page focuses on the decisions that matter before export: when a square token beats a circle, how much shoulder and prop detail to keep, which border style stays readable, and what PNG size works for Roll20, Foundry VTT, Owlbear, and similar tabletop workflows.',
    intent: 'Best for grid-aligned markers, sci-fi portraits, prop-heavy NPC art, and handout style tokens.',
    heroBadges: ['1:1 square crop', 'Transparent PNG', 'Roll20 and Foundry ready'],
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
    structuredDataFeatures: [
      'Square token crop',
      'Token border selection',
      'Transparent PNG export',
      'Roll20 and Foundry VTT workflow support',
    ],
    workflowTitle: 'How to make a square token',
    workflowDescription:
      'The goal is a clean square image that survives small map zoom levels. Start with the subject, then tune the crop, border, and export size.',
    workflowSteps: [
      {
        title: 'Upload portrait or monster art',
        body:
          'Use artwork where the subject is already readable from the waist, shoulders, or head. Square tokens reward a little extra context, so do not crop as tightly as you would for a circular portrait token.',
      },
      {
        title: 'Set a 1:1 square crop',
        body:
          'Keep the face near the visual center, then leave enough edge room for hats, horns, weapons, and faction symbols. A square crop can carry more scene detail, but the subject should still win at tabletop scale.',
      },
      {
        title: 'Choose a border and export PNG',
        body:
          'Use a thin ring, metal frame, or no border for a card-like look. Export 512 for most live VTT sessions, 1024 for archive quality, and 2048 only when the token is part of a premium pack or long-term asset library.',
      },
    ],
    platformTitle: 'Square token settings by VTT workflow',
    platformDescription:
      'A square token can work across common VTT platforms, but the best export depends on how the token appears on the map.',
    platforms: [
      {
        title: 'Roll20 square tokens',
        body:
          'Use a transparent PNG when the square frame should sit above the map. Keep the subject centered and avoid tiny labels unless the token is used as a marker rather than a creature portrait.',
      },
      {
        title: 'Foundry VTT tokens',
        body:
          'Square tokens work well for NPC portraits, vehicles, faction markers, and map objects. Export at 512 or 1024, then tune in Foundry only if the scene uses unusually close zoom levels.',
      },
      {
        title: 'Owlbear and lightweight tabletops',
        body:
          'For fast prep, use a simpler border and keep file size moderate. Square PNG tokens are especially useful when you want handout-style markers or room labels to align with grid cells.',
      },
    ],
    video: {
      videoId: 'hjE_N0wTHOc',
      title: 'How do I Make Tokens for My Online Dungeons and Dragons Game?',
      description:
        'A practical companion video for users who want to understand the broader online D&D token workflow before exporting square VTT tokens.',
      thumbnailAlt: 'YouTube video cover for making tokens for an online Dungeons and Dragons game',
    },
    faqTitle: 'Square token maker FAQ',
    faqItems: [
      {
        question: 'When should I use a square token instead of a circular token?',
        answer:
          'Use a square token when the artwork needs more shoulder, weapon, banner, vehicle, or room-detail context. Circular tokens are better for tight character portraits; square tokens are better for grid markers and prop-heavy art.',
      },
      {
        question: 'What size should a square VTT token be?',
        answer:
          'Use 512 for most live table sessions. Use 1024 when you want cleaner archived edges or close zoom. Reserve 2048 for premium packs, print-adjacent output, or long-term libraries.',
      },
      {
        question: 'Should square tokens have transparent backgrounds?',
        answer:
          'Usually yes. A transparent PNG keeps the token flexible across Roll20, Foundry VTT, Owlbear, maps, handouts, and character sheets.',
      },
      {
        question: 'Can I add borders to square tokens?',
        answer:
          'Yes. Thin borders, metal frames, and flat card-style edges all work. Avoid heavy borders when the original art already has strong edge detail.',
      },
    ],
    ctaTitle: 'Make a square token from your own art',
    ctaBody:
      'Open the editor with a square mask preset, adjust the crop, choose a border, and export a transparent PNG for your table.',
    ctaLabel: 'Open square token maker',
    query: '/?mask=square&border=plain-square-thin#editor-workspace',
  },
];

export const templatePageMap = new Map(templatePages.map((page) => [page.slug, page]));

export interface NavLabels {
  editor: string;
  diceRoller: string;
  coatMaker: string;
  armor: string;
  coatMakerBackToEditor: string;
  templates: string;
  blog: string;
  contact: string;
  faq: string;
  privacy: string;
  switchLocale: string;
  navigation: string;
  openNavigation: string;
  closeNavigation: string;
  navigationMenuDescription: string;
  blogCategoryMenu: string;
}

export interface ShellCopy {
  backToSite: string;
  browseTemplates: string;
  whyThisPageExists: string;
  whyPageBullets: string[];
}

export interface SiteUiCopy {
  breadcrumbAriaLabel: string;
  videoFallbackTitle: string;
  youtubeFallbackLabel: string;
  ogFooterKicker: string;
  ogFooterMeta: string;
}

export interface SiteManifestCopy {
  description: string;
}

export interface HomeCopy {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroHighlights: string[];
  structuredDataFeatures: string[];
  heroPrimaryCta: string;
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

export interface ChangelogEntry {
  date: string;
  title: string;
  body: string;
  affectedLinks: Array<{ label: string; path: string }>;
}

export interface DiceRollerPreset {
  label: string;
  description: string;
}

export interface DiceRollerCaseStudyCopy {
  id: string;
  name: string;
  quote: string;
  expression: string;
  src: string;
  alt: string;
  exampleTotal: number;
  rolledValues: number[];
}

export interface DiceRollerCaseStudyGroupCopy {
  id: string;
  title: string;
  carouselLabel: string;
  previousLabel: string;
  nextLabel: string;
  imagePosition: 'left' | 'right';
  examples: DiceRollerCaseStudyCopy[];
}

export interface DiceRollerCaseStudiesCopy {
  title: string;
  description: string;
  exampleTotalLabel: string;
  rollValuesLabel: string;
  caseLabel: string;
  groups: DiceRollerCaseStudyGroupCopy[];
}

export interface DiceRollerPageCopy {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  whatIsTitle: string;
  whatIsDescription: string;
  featureOverview: {
    title: string;
    subtitle: string;
    features: Array<{
      icon: 'dice' | 'pool' | 'modifier' | 'animation' | 'copy' | 'history';
      title: string;
      description: string;
    }>;
  };
  howToUseEyebrow: string;
  howToUseTitle: string;
  howToUseSteps: Array<{ title: string; description: string }>;
  callToActionTitle: string;
  callToActionDescription: string;
  callToActionLabel: string;
  toolComparison: {
    title: string;
    description: string;
    tableLabel: string;
    dimensionHeading: string;
    diceRollerHeading: string;
    physicalDiceHeading: string;
    roll20Heading: string;
    rows: Array<{
      dimension: string;
      diceRoller: string;
      physicalDice: string;
      roll20: string;
    }>;
  };
  caseStudies: DiceRollerCaseStudiesCopy;
  faqEyebrow: string;
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
}

export const siteConfigZh = {
  name: 'Token Maker',
  shortName: 'Token Maker',
  title: 'DnD Token Maker | Roll20 与 Foundry VTT 透明 PNG Token 制作器',
  description:
    '在线制作 DnD 和 VTT Token，适合 Roll20、Foundry VTT 与 Owlbear。上传角色立绘，添加圆形或方形遮罩、Token 边框和文字，导出透明 PNG。',
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
    question: '什么是 DnD Token Maker？',
    answer: 'DnD Token Maker 是把角色立绘、怪物头像和 NPC 图片快速做成 VTT Token 的在线工具，支持裁切、遮罩、边框、文字和 PNG 导出。',
  },
  {
    question: '可以制作 Roll20 和 Foundry VTT 的 Token 吗？',
    answer: '可以。导出的 PNG Token 面向 Roll20、Foundry VTT、Owlbear Rodeo 这类虚拟桌面和地图工具，适合直接放进战斗地图或素材库。',
  },
  {
    question: '能导出透明 PNG Token 吗？',
    answer: '可以。Token Maker 会导出透明 PNG，方便头像边缘干净地叠在地图、角色卡或 VTT 素材库里。',
  },
  {
    question: '能做圆形、方形和带边框的 Token 吗？',
    answer: '可以。编辑器支持圆形 Token、方形 Token、多边形遮罩、内置 Token 边框、颜色调整和自定义边框素材。',
  },
  {
    question: '上传的图片会离开浏览器吗？',
    answer: '默认编辑流程是本地优先。正常裁切、加框和导出时，角色图片可以一直留在浏览器里。',
  },
];

export const templatePagesZh: TemplatePageData[] = [
  {
    slug: 'square-token-maker',
    metadataTitle: '方形 Token 制作器 | Roll20 与 Foundry VTT 方形头像工具',
    metadataDescription:
      '用角色图制作方形 VTT Token，支持 1:1 裁切、边框、透明 PNG 导出，并适配 Roll20、Foundry VTT 与 Owlbear。',
    eyebrow: '方形 Token 制作器',
    title: '方形 Token 制作器，适合 VTT 网格地图与 NPC 头像',
    description: '把角色立绘、怪物头像和 NPC 图片做成适合网格地图、手札标记和更完整构图的方形 VTT Token。',
    summary:
      '搜索 square token maker 的用户通常不是想读一篇泛泛介绍，而是想直接做一个 1:1 方形 Token。这个页面优先回答实际制作问题：什么时候方形比圆形更合适，头像应该保留多少肩部和道具细节，边框要不要加，透明 PNG 应该导出多大，以及如何放进 Roll20、Foundry VTT、Owlbear 这类桌面流程。',
    intent: '适合网格地图标记、科幻头像、带道具的 NPC 立绘和手札风格 Token。',
    heroBadges: ['1:1 方形裁切', '透明 PNG', '适合 Roll20 与 Foundry'],
    bestFor: ['方格地图', '需要保留帽子、肩甲或武器的头像', '阵营标记与房间标签'],
    settings: ['遮罩：方形', '边框：细环、金属或无边框', '导出：512 或 1024 视地图缩放而定'],
    tips: [
      '头顶留白要比圆形 token 更多，否则高帽和旗帜很容易被吃掉。',
      '如果原图自带装饰边缘，方形 token 反而更适合薄边框。',
      '只有在需要代号、军衔或房间编号时再加文字，避免画面过满。',
    ],
    structuredDataFeatures: [
      '方形 Token 裁切',
      'Token 边框选择',
      '透明 PNG 导出',
      '支持 Roll20 与 Foundry VTT 工作流',
    ],
    workflowTitle: '如何制作方形 Token',
    workflowDescription:
      '目标不是把图片塞进正方形，而是导出一个在小尺寸地图上仍然清楚的 1:1 Token。先处理主体，再处理边框和导出尺寸。',
    workflowSteps: [
      {
        title: '上传角色图或怪物图',
        body:
          '优先选择主体已经清楚的头像、半身像或怪物图。方形 Token 可以保留更多背景和道具信息，所以不要像圆形头像那样裁得过紧。',
      },
      {
        title: '设置 1:1 方形裁切',
        body:
          '让脸部或主体位于视觉中心，同时给帽子、角、武器、旗帜和阵营符号留出边缘空间。方形 Token 可以承载更多细节，但地图缩小时主体仍然要最先被看见。',
      },
      {
        title: '选择边框并导出 PNG',
        body:
          '可使用细边框、金属边框，也可以做成无边框卡片风格。大多数实战桌面先导出 512，想要更干净的归档边缘用 1024，资源包或长期素材库再考虑 2048。',
      },
    ],
    platformTitle: '不同 VTT 里怎么使用方形 Token',
    platformDescription:
      '方形 Token 可以进入常见 VTT 平台，但导出策略要看它在地图上承担什么角色。',
    platforms: [
      {
        title: 'Roll20 方形 Token',
        body:
          '如果希望方形边框浮在地图上，优先导出透明 PNG。角色头像要居中，小字标签尽量少用，除非这个 Token 本来就是地图标记或房间编号。',
      },
      {
        title: 'Foundry VTT Token',
        body:
          '方形 Token 很适合 NPC 头像、载具、阵营标记和地图物件。一般导出 512 或 1024 即可，只有场景经常近距离缩放时再提高尺寸。',
      },
      {
        title: 'Owlbear 与轻量桌面流程',
        body:
          '快速备战时建议用更简单的边框，并控制文件大小。方形 PNG 尤其适合手札风格标记、房间标签，以及需要和网格对齐的视觉元素。',
      },
    ],
    video: {
      videoId: 'hjE_N0wTHOc',
      title: 'How do I Make Tokens for My Online Dungeons and Dragons Game?',
      description:
        '这段视频适合作为补充参考，帮助用户理解线上 D&D Token 的整体制作思路，再回到页面里制作方形 VTT Token。',
      thumbnailAlt: 'YouTube 视频封面，主题是为线上 Dungeons and Dragons 游戏制作 Token',
    },
    faqTitle: '方形 Token 制作器常见问题',
    faqItems: [
      {
        question: '什么时候应该用方形 Token，而不是圆形 Token？',
        answer:
          '当原图需要保留肩甲、武器、旗帜、载具、房间或阵营信息时，用方形 Token 更合适。圆形 Token 更适合紧凑角色头像，方形 Token 更适合网格标记和细节更多的图片。',
      },
      {
        question: '方形 VTT Token 应该导出多大？',
        answer:
          '大多数实时桌面先用 512 就够。想保留更干净的边缘或近距离缩放时用 1024。2048 更适合资源包、长期素材库或高质量归档。',
      },
      {
        question: '方形 Token 需要透明背景吗？',
        answer:
          '通常建议导出透明 PNG。这样放进 Roll20、Foundry VTT、Owlbear、地图、手札和角色卡时更灵活。',
      },
      {
        question: '方形 Token 可以加边框吗？',
        answer:
          '可以。细边框、金属边框和卡片式边缘都适合方形 Token。如果原图边缘已经很复杂，边框应该轻一点，避免抢主体。',
      },
    ],
    ctaTitle: '用自己的角色图制作方形 Token',
    ctaBody: '打开预设为方形遮罩的编辑器，调整裁切、选择边框，然后为你的桌面导出透明 PNG。',
    ctaLabel: '打开方形 Token 制作器',
    query: '/?mask=square&border=plain-square-thin#editor-workspace',
  },
];

export const navLabelsByLocale: Record<SiteLocale, NavLabels> = {
  en: {
    editor: 'Token Maker',
    diceRoller: 'Dice Roller',
    coatMaker: 'Coat of Arms Maker',
    armor: 'Armor Creator',
    coatMakerBackToEditor: 'Back to the editor',
    templates: 'Templates',
    blog: 'Blog',
    contact: 'Contact',
    faq: 'FAQ',
    privacy: 'Privacy',
    switchLocale: '中文',
    navigation: 'Primary',
    openNavigation: 'Open navigation',
    closeNavigation: 'Close navigation',
    navigationMenuDescription: 'Primary navigation links',
    blogCategoryMenu: 'Blog categories',
  },
  zh: {
    editor: '令牌制作器',
    diceRoller: '骰子',
    coatMaker: '纹章制作器',
    armor: '护甲制作器',
    coatMakerBackToEditor: '返回首页编辑器',
    templates: '模板页',
    blog: '博客',
    contact: '联系',
    faq: '常见问题',
    privacy: '隐私',
    switchLocale: 'English',
    navigation: '主导航',
    openNavigation: '打开导航',
    closeNavigation: '关闭导航',
    navigationMenuDescription: '主要导航链接',
    blogCategoryMenu: '博客分类',
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

export const siteUiCopyByLocale: Record<SiteLocale, SiteUiCopy> = {
  en: {
    breadcrumbAriaLabel: 'Breadcrumb',
    videoFallbackTitle: 'Video',
    youtubeFallbackLabel: 'Open on YouTube',
    ogFooterKicker: 'Browser token workshop',
    ogFooterMeta: 'DnD • Roll20 • Foundry VTT',
  },
  zh: {
    breadcrumbAriaLabel: '面包屑',
    videoFallbackTitle: '视频',
    youtubeFallbackLabel: '在 YouTube 打开',
    ogFooterKicker: '浏览器 Token 工作台',
    ogFooterMeta: 'DnD • Roll20 • Foundry VTT',
  },
};

export const homeCopyByLocale: Record<SiteLocale, HomeCopy> = {
  en: {
    heroEyebrow: 'VTT token maker',
    heroTitle: 'Free DnD Token Maker for Roll20 and Foundry VTT',
    heroDescription:
      'Create circular, square, and transparent PNG VTT tokens from character art. Add token borders, masks, and text, then export locally for DnD, Roll20, Foundry VTT, and Owlbear.',
    heroHighlights: [
      'Circular, square, and polygon token maker',
      'Transparent PNG export up to 2048',
      'Token borders for DnD, Roll20, Foundry VTT, and Owlbear',
    ],
    structuredDataFeatures: [
      'Browser-based VTT token maker',
      'Circle, square, and polygon masks',
      'Border and tint controls',
      'Text overlays and transparent PNG export',
      'Local-first tabletop image workflow',
    ],
    heroPrimaryCta: 'Start making tokens',
  },
  zh: {
    heroEyebrow: 'VTT Token 制作器',
    heroTitle: '免费 DnD Token Maker，适合 Roll20 和 Foundry VTT',
    heroDescription:
      '把角色立绘做成圆形、方形或多边形 VTT Token，添加 Token 边框、遮罩和文字，然后为 DnD、Roll20、Foundry VTT 与 Owlbear 导出透明 PNG。',
    heroHighlights: [
      '圆形、方形和多边形 Token',
      '透明 PNG 导出最高 2048',
      '适合 DnD、Roll20、Foundry VTT 和 Owlbear',
    ],
    structuredDataFeatures: [
      '浏览器 VTT Token 制作器',
      '圆形、方形和多边形遮罩',
      '边框与配色控制',
      '文字叠加与透明 PNG Token 导出',
      '本地优先图片流程',
    ],
    heroPrimaryCta: '开始制作 Token',
  },
};

export const collectionPageCopyByLocale: Record<
  SiteLocale,
  {
    templates: CollectionPageCopy;
    faq: CollectionPageCopy;
    privacy: CollectionPageCopy;
    about: CollectionPageCopy;
    changelog: CollectionPageCopy;
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
      title: 'Privacy facts for Token Maker',
      description:
        'Learn how local downloads, public share links, R2 storage, analytics, Google advertising cookies, and contact messages work today.',
    },
    about: {
      eyebrow: 'About',
      title: 'About Token Maker',
      description: 'Learn what Token Maker does, who it is for, and how the default browser workflow handles tabletop art.',
    },
    changelog: {
      eyebrow: 'Changelog',
      title: 'Token Maker Changelog',
      description: 'Follow recent product updates, support pages, and tabletop workflow improvements for Token Maker.',
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
      title: 'Token Maker 隐私事实说明',
      description: '说明本地下载、公开分享链接、R2 存储、统计、Google 广告 Cookie 和联系消息当前如何工作。',
    },
    about: {
      eyebrow: '关于',
      title: '关于 Token Maker',
      description: '了解 Token Maker 做什么、适合谁，以及默认浏览器工作流如何处理桌面素材。',
    },
    changelog: {
      eyebrow: '更新记录',
      title: 'Token Maker 更新记录',
      description: '查看 Token Maker 最近的产品更新、支持页面和桌面工作流改进。',
    },
  },
};

export const aboutSectionsByLocale: Record<SiteLocale, StaticPageSection[]> = {
  en: [
    {
      title: 'A token tool, not a graphics suite',
      body:
        'Token Maker is for the narrow job that comes up before a session: turn character art, monster portraits, or NPC images into map-ready VTT tokens without opening a full image editor.',
    },
    {
      title: 'Private campaign art needs a plain answer',
      body:
        'The normal crop, frame, and PNG export path is designed so portrait art can stay in the browser. If a feature sends an image to remote storage, it should say that before the user chooses it.',
    },
    {
      title: 'Small fixes beat vague promises',
      body:
        'The useful requests are usually concrete: a transparent edge looks wrong, a Roll20 import needs resizing, or a border style is missing. Those reports belong on the contact page so they can become specific fixes.',
    },
  ],
  zh: [
    {
      title: '这是 Token 工具，不是通用修图软件',
      body:
        'Token Maker 只处理开团前经常出现的那个窄任务：把角色图、怪物头像或 NPC 图片快速做成能放进地图的 VTT Token，而不是代替完整修图软件。',
    },
    {
      title: '私有战役素材需要说清楚',
      body:
        '正常裁切、加框和 PNG 导出流程按本地优先设计，让角色图可以留在浏览器里。如果某个功能会把图片发到远程存储，它应该在用户选择之前说清楚。',
    },
    {
      title: '具体修复比空泛承诺更有用',
      body:
        '真正有用的反馈通常很具体：透明边缘不对、导入 Roll20 后还要改尺寸、缺某种边框样式。这类问题可以通过联系页反馈，再变成明确的小修复。',
    },
  ],
};

export const changelogEntriesByLocale: Record<SiteLocale, ChangelogEntry[]> = {
  en: [
    {
      date: '2026-06-24',
      title: 'Added trust pages',
      body:
        'Added About and Changelog pages so users can understand the project, maintenance model, and recent visible site updates.',
      affectedLinks: [
        { label: 'About', path: '/about' },
        { label: 'Changelog', path: '/changelog' },
      ],
    },
    {
      date: '2026-05-06',
      title: 'Expanded tabletop support pages',
      body:
        'Updated the homepage and square token workflow so users can compare token formats, export sizes, and VTT fit before opening the editor.',
      affectedLinks: [
        { label: 'Home', path: '/' },
        { label: 'Square token maker', path: '/templates/square-token-maker' },
      ],
    },
    {
      date: '2026-05-02',
      title: 'Opened the contact path',
      body:
        'Added a focused contact page for bug reports, export issues, missing styles, and practical workflow feedback.',
      affectedLinks: [{ label: 'Contact', path: '/contact' }],
    },
    {
      date: '2026-03-30',
      title: 'Added the DnD dice roller page',
      body:
        'Published a separate dice roller utility so token editing and dice rolling stay split into clear, single-purpose tools.',
      affectedLinks: [{ label: 'Dice Roller', path: '/dice-roller-dnd' }],
    },
    {
      date: '2026-03-17',
      title: 'Published FAQ and privacy notes',
      body:
        'Added support pages that explain common export questions and the default local-first image handling model.',
      affectedLinks: [
        { label: 'FAQ', path: '/faq' },
        { label: 'Privacy', path: '/privacy' },
      ],
    },
  ],
  zh: [
    {
      date: '2026-06-24',
      title: '新增信任信息页面',
      body:
        '新增关于页和更新记录页，让用户更容易了解项目用途、维护方式和近期可见站点更新。',
      affectedLinks: [
        { label: '关于', path: '/about' },
        { label: '更新记录', path: '/changelog' },
      ],
    },
    {
      date: '2026-05-06',
      title: '扩展桌面工作流说明',
      body:
        '更新首页和方形 Token 工作流说明，帮助用户在进入编辑器前判断格式、导出尺寸和 VTT 适配方式。',
      affectedLinks: [
        { label: '首页', path: '/' },
        { label: '方形 Token 制作器', path: '/templates/square-token-maker' },
      ],
    },
    {
      date: '2026-05-02',
      title: '开放联系入口',
      body:
        '新增联系页，用于反馈 bug、导出问题、缺少的样式，以及实际桌面工作流里的适配建议。',
      affectedLinks: [{ label: '联系', path: '/contact' }],
    },
    {
      date: '2026-03-30',
      title: '新增 DnD 骰子工具页',
      body:
        '发布独立 dice roller 页面，让 Token 编辑和掷骰工具保持清晰分工。',
      affectedLinks: [{ label: '骰子工具', path: '/dice-roller-dnd' }],
    },
    {
      date: '2026-03-17',
      title: '发布 FAQ 与隐私说明',
      body:
        '新增支持页面，说明常见导出问题和默认本地优先的图片处理方式。',
      affectedLinks: [
        { label: '常见问题', path: '/faq' },
        { label: '隐私', path: '/privacy' },
      ],
    },
  ],
};

export const privacySectionsByLocale: Record<SiteLocale, StaticPageSection[]> = {
  en: [
    {
      title: 'Default local editing',
      body:
        'The main editor is designed so portrait images can stay in the browser while you crop and frame them. Ordinary PNG downloads are generated locally in your browser.',
    },
    {
      title: 'Public share links',
      body:
        'Copying a share link or sharing to a social platform sends a generated PNG through /api/share. That share action uploads the PNG to R2 object storage and creates a public share link.',
    },
    {
      title: 'Public access boundary',
      body:
        'Anyone with a public share link can view the generated token image. Token Maker does not provide a self-service deletion or retention promise on this page.',
    },
    {
      title: 'Analytics and operations',
      body:
        'Microsoft Clarity is included on the live site outside development, including /coat-of-arms-maker and /zh/coat-of-arms-maker. Google Analytics runs only in production when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured, including those Coat Maker pages.',
    },
    {
      title: 'Google advertising cookies',
      body:
        'Token Maker may display Google AdSense or other Google advertising products. Google and third-party advertising vendors may use Google advertising cookies, web beacons, IP addresses, device identifiers, or similar technologies to serve, measure, and improve ads. Google and its partners may use advertising cookies to serve personalized ads based on visits to Token Maker and other sites. You can use Google Ads Settings to opt out of personalized ads from Google, and aboutads.info provides choices for some third-party advertising vendors.',
    },
    {
      title: 'Contact form and Resend',
      body:
        'The contact form sends your name, email address, message, and locale through Resend to the site inbox so I can reply. Token Maker may use connection details or hashed identifiers for rate limiting and abuse prevention. Do not send passwords, private keys, payment data, or private campaign art through the form. You can send a deletion request through the contact page for messages associated with your address.',
    },
  ],
  zh: [
    {
      title: '本地优先的图片处理方式',
      body:
        '主编辑器默认按本地优先设计。你在裁切和加框时，角色立绘可以留在浏览器里。普通 PNG 下载会在你的浏览器本地生成。',
    },
    {
      title: '公开分享链接',
      body:
        '复制分享链接或分享到社媒时，会通过 /api/share 发送生成后的 PNG。这个分享动作会把 PNG 上传到 R2 对象存储，并生成公开分享链接。',
    },
    {
      title: '公开访问边界',
      body:
        '拥有公开分享链接的人可以查看生成后的 Token 图片。这个页面没有提供自助删除入口，也没有提供保留承诺。',
    },
    {
      title: '分析与运维',
      body:
        'Microsoft Clarity 会在非开发环境的站点加载，包括 /coat-of-arms-maker 和 /zh/coat-of-arms-maker。只有在生产环境且配置 NEXT_PUBLIC_GA_MEASUREMENT_ID 时，Google Analytics 才会启用，这些 Coat Maker 页面也包括在内。',
    },
    {
      title: 'Google 广告 Cookie',
      body:
        'Token Maker 可能会展示 Google AdSense 或其他 Google 广告产品。Google 和第三方广告供应商可能会使用 Google 广告 Cookie、网络信标、IP 地址、设备标识符或类似技术来投放、衡量和改进广告。Google 及其合作伙伴可能会根据你访问 Token Maker 和其他网站的记录投放个性化广告。你可以通过 Google 广告设置关闭 Google 的个性化广告，也可以通过 aboutads.info 了解部分第三方广告供应商的退出选择。',
    },
    {
      title: '联系表单和 Resend',
      body:
        '联系表单会发送你的称呼、邮箱、消息内容和语言环境，并通过 Resend 发送到站点收件箱，方便我回复。Token Maker 可能会使用连接信息或哈希后的标识做限流和滥用防护。不要通过表单发送密码、私钥、付款信息或私密战役素材。你可以通过联系页面发送删除请求，要求删除与该邮箱相关的联系消息。',
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
    whatIsTitle: 'What is this DnD dice roller?',
    whatIsDescription:
      'This DnD Dice Roller is a browser tool for tabletop sessions: choose from seven standard dice, adjust their counts, build a mixed dice pool, and add a positive or negative modifier. After rolling, see each die value and the total, copy the result, and review up to 20 rolls from the current page session. It supports ability checks, attack rolls, and damage rolls for in-person games, online sessions, and preparation, and is designed for D&D players, Dungeon Masters, and newcomers to tabletop role-playing, who apply their own table rules.',
    featureOverview: {
      title: 'Everything you need for a quick roll',
      subtitle:
        'Build a dice pool, roll it, and keep each result easy to read during the game.',
      features: [
        {
          icon: 'dice',
          title: 'Seven standard dice',
          description:
            'The DnD Dice Roller offers seven standard options: d4, d6, d8, d10, d12, d20, and d100.',
        },
        {
          icon: 'pool',
          title: 'Mix a dice pool',
          description:
            'With the DnD Dice Roller, combine different die sizes and roll up to 15 dice in one throw.',
        },
        {
          icon: 'modifier',
          title: 'Add a modifier',
          description:
            'Use the DnD Dice Roller to add a positive or negative integer as a bonus or penalty to the total.',
        },
        {
          icon: 'animation',
          title: 'See the roll breakdown',
          description:
            'The DnD Dice Roller shows the roll animation, then lets you review every die value and the calculated total.',
        },
        {
          icon: 'copy',
          title: 'Copy the result',
          description:
            'Use the DnD Dice Roller to copy the latest roll together with its individual values when you need to share it.',
        },
        {
          icon: 'history',
          title: 'Review recent rolls',
          description:
            'The DnD Dice Roller keeps up to 20 recent rolls in the current page session so you can review the roll log.',
        },
      ],
    },
    howToUseEyebrow: 'How it works',
    howToUseTitle: 'Roll in three simple steps',
    howToUseSteps: [
      {
        title: 'Choose your dice',
        description:
          'Start the DnD Dice Roller by selecting one or more die sizes and adjusting the count for each kind of die.',
      },
      {
        title: 'Set the count and modifier',
        description:
          'In the DnD Dice Roller, build a pool of up to 15 dice, then add the positive or negative integer you need.',
      },
      {
        title: 'Roll, check, and copy',
        description:
          'Roll with the DnD Dice Roller to see the animation, every die value, and the total, then copy the latest result if needed.',
      },
    ],
    callToActionTitle: 'Start rolling your dice',
    callToActionDescription:
      'Open the DnD Dice Roller, choose your dice, set the counts and modifier, and see the resulting roll.',
    callToActionLabel: 'Start rolling',
    toolComparison: {
      title: 'Online DnD Dice Roller vs Physical Dice vs Roll20',
      description:
        'Open the DnD Dice Roller to combine common dice, set a modifier, and see the calculated result. Compare this roller with physical dice and Roll20 to find the option that best fits quick rolls, tabletop sessions, or online games.',
      tableLabel: 'DnD dice rolling method comparison',
      dimensionHeading: 'Comparison',
      diceRollerHeading: 'Online DnD Dice Roller',
      physicalDiceHeading: 'Physical Dice',
      roll20Heading: 'Roll20',
      rows: [
        {
          dimension: 'Getting started',
          diceRoller: 'Open the page, choose your dice and counts, and roll.',
          physicalDice: 'Prepare your dice and a rolling space; no software needed.',
          roll20: 'Enter the game, then use the dice panel or a chat command.',
        },
        {
          dimension: 'Everyday rolls',
          diceRoller:
            'Seven common dice, up to 15 combined dice, with the total and positive or negative modifier calculated automatically.',
          physicalDice: 'Use the dice you have, add them by hand, and calculate the modifier yourself.',
          roll20: 'Supports the dice panel and mixed dice expressions, with results calculated automatically.',
        },
        {
          dimension: 'Complex rules',
          diceRoller:
            'For rules such as drop lowest, read the breakdown and handle the selection manually.',
          physicalDice: 'Reroll, select, or remove dice by hand according to the rule.',
          roll20: 'Dice expressions can handle rules such as drop lowest, rerolls, and exploding dice.',
        },
        {
          dimension: 'Sharing with a group',
          diceRoller: 'Copy the result, then send it to the group yourself; there is no real-time room sync.',
          physicalDice: 'People at the table can see it directly; remote players need a spoken result or camera view.',
          roll20: 'Public rolls appear in game chat, and private rolls are also supported.',
        },
        {
          dimension: 'Record keeping',
          diceRoller:
            'The current page keeps the latest 20 rolls and clears them after refresh; copy results to save them elsewhere.',
          physicalDice: 'Use paper, photos, or another tool to record the results.',
          roll20: 'Game chat history can persist across sessions, making results easier to review.',
        },
      ],
    },
    caseStudies: {
      title: 'DnD dice rolls for everyday play',
      description:
        'Use the DnD Dice Roller to explore 12 practical examples across checks, combat damage, spells, and session preparation. Each group includes four cases you can browse with the arrows; the roller shows dice values and totals, while modifiers and rule choices remain examples for you to apply at your table.',
      exampleTotalLabel: 'Example total',
      rollValuesLabel: 'Rolled values',
      caseLabel: 'Example',
      groups: [
        {
          id: 'basic-checks',
          title: 'Checks, saves, and initiative',
          carouselLabel: 'Basic check examples',
          previousLabel: 'Previous basic check example',
          nextLabel: 'Next basic check example',
          imagePosition: 'right',
          examples: [
            {
              id: 'attack',
              name: 'Attack roll',
              quote:
                "For an attack against a goblin or another target, roll the d20 in the DnD Dice Roller, add the example modifier, and compare the total with the target's AC.",
              expression: '1d20 + 5',
              src: '/images/dice-cases/attack.webp',
              alt: 'DnD attack roll example using 1d20 plus 5',
              exampleTotal: 17,
              rolledValues: [12],
            },
            {
              id: 'stealth',
              name: 'Stealth check',
              quote:
                "To sneak past a guard, make a Stealth check with the DnD Dice Roller and compare the total with the DC set by the DM.",
              expression: '1d20 + 4',
              src: '/images/dice-cases/stealth.webp',
              alt: 'DnD Stealth check example using 1d20 plus 4',
              exampleTotal: 23,
              rolledValues: [19],
            },
            {
              id: 'dexterity-save',
              name: 'Dexterity saving throw',
              quote:
                "When you dodge a trap or spell, roll the Dexterity saving throw with the DnD Dice Roller and compare the total with the effect's DC.",
              expression: '1d20 + 2',
              src: '/images/dice-cases/dexterity-save.webp',
              alt: 'DnD Dexterity saving throw example using 1d20 plus 2',
              exampleTotal: 21,
              rolledValues: [19],
            },
            {
              id: 'initiative',
              name: 'Initiative roll',
              quote:
                'When combat starts, use the DnD Dice Roller to roll initiative and compare the totals to set the turn order.',
              expression: '1d20 + 2',
              src: '/images/dice-cases/initiative.webp',
              alt: 'DnD initiative roll example using 1d20 plus 2',
              exampleTotal: 4,
              rolledValues: [2],
            },
          ],
        },
        {
          id: 'combat-damage',
          title: 'Weapon and extra damage',
          carouselLabel: 'Combat damage examples',
          previousLabel: 'Previous combat damage example',
          nextLabel: 'Next combat damage example',
          imagePosition: 'left',
          examples: [
            {
              id: 'greatsword',
              name: 'Greatsword damage',
              quote:
                'After a greatsword hit, use the DnD Dice Roller to roll 2d6 and add the example modifier to get the damage total.',
              expression: '2d6 + 3',
              src: '/images/dice-cases/greatsword.webp',
              alt: 'DnD greatsword damage example using 2d6 plus 3',
              exampleTotal: 11,
              rolledValues: [4, 4],
            },
            {
              id: 'dagger-critical',
              name: 'Dagger critical',
              quote:
                'After a confirmed dagger critical, use the DnD Dice Roller to roll 2d4 for the doubled dagger dice; this example adds no separate damage die, then add the modifier.',
              expression: '2d4 + 3',
              src: '/images/dice-cases/dagger-critical.webp',
              alt: 'DnD dagger critical example using 2d4 plus 3',
              exampleTotal: 5,
              rolledValues: [1, 1],
            },
            {
              id: 'sneak-attack',
              name: "3rd-level Rogue Sneak Attack",
              quote:
                'On a normal, non-critical rapier hit by a 3rd-level Rogue, use the DnD Dice Roller to roll 1d8 and 2d6 together when the attack qualifies for Sneak Attack, then add the modifier.',
              expression: '1d8 + 2d6 + 3',
              src: '/images/dice-cases/sneak-attack.webp',
              alt: 'DnD 3rd-level Rogue Sneak Attack example using 1d8 plus 2d6 plus 3',
              exampleTotal: 13,
              rolledValues: [3, 6, 1],
            },
            {
              id: 'hunters-mark',
              name: "Hunter's Mark damage",
              quote:
                "After a longbow hits a target marked by Hunter's Mark, use the DnD Dice Roller to roll 1d8 and 1d6 together, then add the example modifier.",
              expression: '1d8 + 1d6 + 3',
              src: '/images/dice-cases/hunters-mark.webp',
              alt: "DnD Hunter's Mark damage example using 1d8 plus 1d6 plus 3",
              exampleTotal: 13,
              rolledValues: [2, 8],
            },
          ],
        },
        {
          id: 'spells-and-prep',
          title: 'Spells and session preparation',
          carouselLabel: 'Spell and preparation examples',
          previousLabel: 'Previous spell or preparation example',
          nextLabel: 'Next spell or preparation example',
          imagePosition: 'right',
          examples: [
            {
              id: 'blessed-attack',
              name: 'Blessed attack',
              quote:
                "When a Bless effect applies to an attack, use the DnD Dice Roller to roll the d20 with the extra d4 and modifier, then compare the total with the target's AC.",
              expression: '1d20 + 1d4 + 5',
              src: '/images/dice-cases/blessed-attack.webp',
              alt: 'DnD blessed attack example using 1d20 plus 1d4 plus 5',
              exampleTotal: 11,
              rolledValues: [1, 5],
            },
            {
              id: 'fireball',
              name: 'Fireball damage',
              quote:
                "For a 3rd-level Fireball, use the DnD Dice Roller to roll 8d6 for the damage; after the target's saving throw, apply full or half damage according to the result.",
              expression: '8d6',
              src: '/images/dice-cases/fireball.webp',
              alt: 'DnD Fireball damage example using 8d6',
              exampleTotal: 30,
              rolledValues: [2, 6, 4, 6, 4, 3, 2, 3],
            },
            {
              id: 'cure-wounds',
              name: '2024 first-level Cure Wounds',
              quote:
                'For a 2024 first-level Cure Wounds cast, use the DnD Dice Roller to roll 2d8 and add your spellcasting ability modifier to get the healing total.',
              expression: '2d8 + 3',
              src: '/images/dice-cases/cure-wounds.webp',
              alt: '2024 DnD first-level Cure Wounds example using 2d8 plus 3',
              exampleTotal: 15,
              rolledValues: [8, 4],
            },
            {
              id: 'random-table',
              name: 'Random table result',
              quote:
                'When your own random table calls for a d100, use the DnD Dice Roller to roll 1d100 and look up the result in that table.',
              expression: '1d100',
              src: '/images/dice-cases/random-table.webp',
              alt: 'DnD random table example using 1d100',
              exampleTotal: 48,
              rolledValues: [48],
            },
          ],
        },
      ],
    },
    faqEyebrow: 'FAQ',
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
      'Clear answers about supported dice, mixed pools, modifiers, roll history, and the latest result.',
    faqItems: [
      {
        question: 'Which dice does the roller support?',
        answer:
          'With the DnD Dice Roller, you can roll d4, d6, d8, d10, d12, d20, and d100. These seven die sizes cover the standard dice used in most DnD rolls.',
      },
      {
        question: 'Can I mix different dice and add a modifier?',
        answer:
          'Yes. In the DnD Dice Roller, select as many supported die sizes as you need, set each count, and add a positive or negative integer modifier before rolling.',
      },
      {
        question: 'How many dice can I roll at once?',
        answer:
          'A single roll can contain up to 15 dice in total. The limit applies across all selected die sizes in the mixed pool.',
      },
      {
        question: 'Are my roll results saved?',
        answer:
          'During a session, the DnD Dice Roller keeps up to 20 recent rolls. Refreshing the page starts a new session, and the log has its own clear button.',
      },
      {
        question: 'Can I copy the latest roll?',
        answer:
          'Yes. After a roll, use the Copy button below the dice tray to copy the latest result and the individual die values.',
      },
      {
        question: 'How do I roll 4d6 and drop the lowest die?',
        answer:
          'In the DnD Dice Roller, select four d6 dice, roll them, and identify the lowest value in the breakdown. Add the other three values yourself; this tool reports the full total and does not remove a die automatically.',
      },
    ],
    structuredDataFeatures: [
      'Dedicated dice roller dnd tool inside Token Maker',
      'Seven supported dice: d4, d6, d8, d10, d12, d20, and d100',
      'Mixed dice pools with up to 15 dice and positive or negative integer modifiers',
      'Animated rolls with per-die breakdowns and a calculated total',
      'Copyable latest result and up to 20 recent rolls in the current page session',
    ],
  },
  zh: {
    metadataTitle: 'dice roller dnd | 在线 d20、d6、d8、d10、d12 与 d100 掷骰页',
    metadataDescription:
      'dice roller dnd 独立页面接入 Token Maker，内含动态随机骰子托盘、表达式输入、常见 DnD 预设、结果分解、日志与 FAQ 内容。',
    eyebrow: 'dice roller dnd',
    title: 'dice roller dnd',
    description:
      '这是 Token Maker 的 DnD 掷骰工具页，包含动态骰子托盘、表达式输入、常见 DnD 预设、结果分解、日志和 FAQ。',
    whatIsTitle: '什么是 DnD 在线掷骰器？',
    whatIsDescription:
      'DND掷骰器是一个在浏览器中使用的跑团辅助工具，你可以从七种常用骰子中选择、调整数量、组合骰池并设置正负加值。投掷后可查看每颗骰子的点数与总和、复制结果，并查看当前页面会话中的投掷记录。它适用于线下跑团、线上团和备团中的检定、攻击与伤害投掷，面向 D&D 玩家、地下城主和刚接触跑团的新手，具体桌规由你自行应用。',
    featureOverview: {
      title: '一次掷骰所需的功能',
      subtitle: '用 DND掷骰器自由组建骰池，查看清晰结果，把重要数值留在眼前。',
      features: [
        {
          icon: 'dice',
          title: '七种常用骰子',
          description: 'DND掷骰器支持 d4、d6、d8、d10、d12、d20 和 d100 七种常用骰子。',
        },
        {
          icon: 'pool',
          title: '混合骰池',
          description: '使用 DND掷骰器组合不同面数的骰子，一次最多投掷 15 颗。',
        },
        {
          icon: 'modifier',
          title: '添加加值',
          description: '在 DND掷骰器中输入正数或负数，把奖励或惩罚计入总和。',
        },
        {
          icon: 'animation',
          title: '动画与投掷明细',
          description: 'DND掷骰器会播放投掷动画，随后逐颗显示结果和计算后的总和。',
        },
        {
          icon: 'copy',
          title: '复制结果',
          description: '使用 DND掷骰器复制最近一次投掷的结果及每颗骰子的点数，方便分享或记录。',
        },
        {
          icon: 'history',
          title: '查看最近记录',
          description: 'DND掷骰器会在当前页面会话中保留最近 20 次投掷，方便你回看日志，也可以随时清空。',
        },
      ],
    },
    howToUseEyebrow: '操作步骤',
    howToUseTitle: '三步完成一次投掷',
    howToUseSteps: [
      {
        title: '选择骰子',
        description: '打开 DND掷骰器，选择一种或多种骰子，并调整每类骰子的数量。',
      },
      {
        title: '设置数量与加值',
        description: '在 DND掷骰器中组合骰池，最多放入 15 颗骰子，再输入需要加入总和的正数或负数。',
      },
      {
        title: '投掷、查看并复制',
        description: '点击投掷后，DND掷骰器会显示动画、每颗骰子的点数和总和；需要时复制最新结果。',
      },
    ],
    callToActionTitle: '现在开始掷骰',
    callToActionDescription: '打开 DND掷骰器，选择骰子、调整数量与加值，查看你的投掷结果。',
    callToActionLabel: '开始掷骰',
    toolComparison: {
      title: 'DnD 在线掷骰器 vs 实体骰子 vs Roll20',
      description:
        '打开 DND掷骰器即可组合常用骰子、设置加值并查看计算结果。对比实体骰子与 Roll20，看看哪种方式更适合你的快速掷骰、桌面跑团或线上游戏需求。',
      tableLabel: 'DnD 掷骰方式对比',
      dimensionHeading: '对比维度',
      diceRollerHeading: 'DnD 在线掷骰器',
      physicalDiceHeading: '实体骰子',
      roll20Heading: 'Roll20',
      rows: [
        {
          dimension: '开始使用',
          diceRoller: '打开网页，选择骰子与数量即可投掷',
          physicalDice: '准备骰子和投掷空间，无需操作软件',
          roll20: '进入游戏后，使用掷骰面板或聊天命令。',
        },
        {
          dimension: '常规掷骰',
          diceRoller: '七种常用骰子，最多组合 15 颗，自动计算总和与正负加值',
          physicalDice: '使用手头骰子，手动求和并添加加值',
          roll20: '支持骰子面板和混合骰式，自动计算结果。',
        },
        {
          dimension: '复杂规则',
          diceRoller: '去最低等规则需要查看明细后手动处理',
          physicalDice: '按规则手动重掷、选取或剔除骰子',
          roll20: '可用骰式处理去最低、重掷、爆骰等规则。',
        },
        {
          dimension: '多人共享',
          diceRoller: '复制结果后自行发送给团员，没有实时房间同步',
          physicalDice: '同桌直接查看，远程需口述或摄像头展示',
          roll20: '公开投掷显示在游戏聊天中，也支持私密投掷。',
        },
        {
          dimension: '记录保存',
          diceRoller: '当前页面保留最近 20 次投掷，刷新后清空；可复制结果另存',
          physicalDice: '使用纸笔、照片或其他工具记录',
          roll20: '游戏聊天记录可跨会话保留，方便回查。',
        },
      ],
    },
    caseStudies: {
      title: 'DnD 掷骰的实际场景',
      description:
        '用 DND掷骰器查看检定、战斗伤害、法术和备团中的 12 个实际案例；内容分为 3 组，每组 4 个案例，可用左右箭头切换。工具提供骰子点数和总和，下面的加值只是示例，具体规则由你结合自己的桌规应用。',
      exampleTotalLabel: '示例总和',
      rollValuesLabel: '骰子点数',
      caseLabel: '案例',
      groups: [
        {
          id: 'basic-checks',
          title: '检定、豁免与先攻',
          carouselLabel: '基础检定案例',
          previousLabel: '上一个基础检定案例',
          nextLabel: '下一个基础检定案例',
          imagePosition: 'right',
          examples: [
            {
              id: 'attack',
              name: '攻击检定',
              quote:
                '面对地精等目标进行攻击时，用 DND掷骰器投掷 d20 并加上示例加值，再将总和与目标 AC 比较。',
              expression: '1d20 + 5',
              src: '/images/dice-cases/attack.webp',
              alt: '使用 1d20 加 5 的 DnD 攻击检定案例',
              exampleTotal: 17,
              rolledValues: [12],
            },
            {
              id: 'stealth',
              name: '隐匿检定',
              quote:
                '想悄悄绕过守卫时，使用 DND掷骰器进行隐匿投掷，再把总和与 DM 设定的 DC 比较。',
              expression: '1d20 + 4',
              src: '/images/dice-cases/stealth.webp',
              alt: '使用 1d20 加 4 的 DnD 隐匿检定案例',
              exampleTotal: 23,
              rolledValues: [19],
            },
            {
              id: 'dexterity-save',
              name: '敏捷豁免',
              quote:
                '需要躲开陷阱或法术时，使用 DND掷骰器投掷敏捷豁免，再将总和与效果的 DC 比较。',
              expression: '1d20 + 2',
              src: '/images/dice-cases/dexterity-save.webp',
              alt: '使用 1d20 加 2 的 DnD 敏捷豁免案例',
              exampleTotal: 21,
              rolledValues: [19],
            },
            {
              id: 'initiative',
              name: '先攻投掷',
              quote: '战斗开始前，使用 DND掷骰器投掷先攻，再把总和与其他参与者比较以排出行动顺序。',
              expression: '1d20 + 2',
              src: '/images/dice-cases/initiative.webp',
              alt: '使用 1d20 加 2 的 DnD 先攻投掷案例',
              exampleTotal: 4,
              rolledValues: [2],
            },
          ],
        },
        {
          id: 'combat-damage',
          title: '武器与额外伤害',
          carouselLabel: '战斗伤害案例',
          previousLabel: '上一个战斗伤害案例',
          nextLabel: '下一个战斗伤害案例',
          imagePosition: 'left',
          examples: [
            {
              id: 'greatsword',
              name: '巨剑伤害',
              quote:
                '巨剑命中后，使用 DND掷骰器投掷 2d6 并加上示例加值，得到伤害总和。',
              expression: '2d6 + 3',
              src: '/images/dice-cases/greatsword.webp',
              alt: '使用 2d6 加 3 的 DnD 巨剑伤害案例',
              exampleTotal: 11,
              rolledValues: [4, 4],
            },
            {
              id: 'dagger-critical',
              name: '匕首暴击',
              quote:
                '确认匕首暴击后，使用 DND掷骰器投掷翻倍后的 2d4；这个示例不再额外添加另一颗伤害骰，最后加上示例加值。',
              expression: '2d4 + 3',
              src: '/images/dice-cases/dagger-critical.webp',
              alt: '使用 2d4 加 3 的 DnD 匕首暴击案例',
              exampleTotal: 5,
              rolledValues: [1, 1],
            },
            {
              id: 'sneak-attack',
              name: '3 级盗贼刺剑偷袭',
              quote:
                '3 级盗贼用刺剑普通命中且满足偷袭条件时，使用 DND掷骰器把 1d8 和 2d6 一起投掷，再加上示例加值；这里不包含暴击翻倍。',
              expression: '1d8 + 2d6 + 3',
              src: '/images/dice-cases/sneak-attack.webp',
              alt: '使用 1d8 加 2d6 加 3 的 3 级盗贼刺剑偷袭案例',
              exampleTotal: 13,
              rolledValues: [3, 6, 1],
            },
            {
              id: 'hunters-mark',
              name: "Hunter's Mark 伤害",
              quote:
                '长弓命中已经被 Hunter\'s Mark 标记的目标时，使用 DND掷骰器把 1d8 和 1d6 一起投掷，再加上示例加值。',
              expression: '1d8 + 1d6 + 3',
              src: '/images/dice-cases/hunters-mark.webp',
              alt: "使用 1d8 加 1d6 加 3 的 Hunter's Mark 伤害案例",
              exampleTotal: 13,
              rolledValues: [2, 8],
            },
          ],
        },
        {
          id: 'spells-and-prep',
          title: '法术与备团',
          carouselLabel: '法术和备团案例',
          previousLabel: '上一个法术或备团案例',
          nextLabel: '下一个法术或备团案例',
          imagePosition: 'right',
          examples: [
            {
              id: 'blessed-attack',
              name: 'Bless 加成攻击',
              quote:
                'Bless 效果适用于攻击时，使用 DND掷骰器把 d20、额外 d4 和加值一起投掷，再将总和与目标 AC 比较。',
              expression: '1d20 + 1d4 + 5',
              src: '/images/dice-cases/blessed-attack.webp',
              alt: '使用 1d20 加 1d4 加 5 的 DnD Bless 加成攻击案例',
              exampleTotal: 11,
              rolledValues: [1, 5],
            },
            {
              id: 'fireball',
              name: '火球术伤害',
              quote:
                '施放 3 环火球术时，使用 DND掷骰器投掷 8d6；目标进行豁免后，按结果应用全额或半额伤害。',
              expression: '8d6',
              src: '/images/dice-cases/fireball.webp',
              alt: '使用 8d6 的 DnD 火球术伤害案例',
              exampleTotal: 30,
              rolledValues: [2, 6, 4, 6, 4, 3, 2, 3],
            },
            {
              id: 'cure-wounds',
              name: '2024 规则一环治疗术（Cure Wounds）',
              quote:
                '按 2024 规则施放一环 Cure Wounds 时，使用 DND掷骰器投掷 2d8 并加上你的施法属性加值，得到治疗总和。',
              expression: '2d8 + 3',
              src: '/images/dice-cases/cure-wounds.webp',
              alt: '使用 2d8 加 3 的 2024 规则一环 Cure Wounds 案例',
              exampleTotal: 15,
              rolledValues: [8, 4],
            },
            {
              id: 'random-table',
              name: '随机表结果',
              quote:
                '需要查询自己的随机表时，使用 DND掷骰器投掷 1d100，再用点数查找对应条目。',
              expression: '1d100',
              src: '/images/dice-cases/random-table.webp',
              alt: '使用 1d100 的 DnD 随机表结果案例',
              exampleTotal: 48,
              rolledValues: [48],
            },
          ],
        },
      ],
    },
    faqEyebrow: '常见问题',
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
    faqTitle: 'dice roller dnd 常见问题',
    faqDescription:
      '了解 DND掷骰器支持的骰子、混合骰池、加值、掷骰日志和最新结果的使用方式。',
    faqItems: [
      {
        question: '这个掷骰器支持哪些骰子？',
        answer:
          '使用 DND掷骰器可以投掷 d4、d6、d8、d10、d12、d20 和 d100，共七种常见 DnD 骰子。',
      },
      {
        question: '可以混合不同骰子并添加加值吗？',
        answer:
          '可以。在 DND掷骰器中选择需要的骰子类型，分别设置数量，再输入正数或负数加值后投掷即可。',
      },
      {
        question: '一次最多可以投掷多少颗骰子？',
        answer:
          '一次最多投掷 15 颗骰子，限制针对骰池中的所有骰子总数。',
      },
      {
        question: '掷骰结果会保存吗？',
        answer:
          'DND掷骰器的日志会在当前页面会话中保留最近 20 次投掷。刷新页面会开始新的会话，日志也有单独的清空按钮。',
      },
      {
        question: '可以复制最近一次投掷结果吗？',
        answer:
          '可以。投掷完成后，点击骰子托盘下方的“复制”按钮，即可复制最近一次结果和每颗骰子的点数。',
      },
      {
        question: '如何投掷 4d6 并去掉最低点？',
        answer:
          '在 DND掷骰器中先选择 4 颗 d6 并投掷，再在明细中找出最低点，手动把其他三颗相加。工具会报告全部骰子的总和，不会自动去掉某颗骰子。',
      },
    ],
    structuredDataFeatures: [
      'Token Maker 内的独立 dice roller dnd 工具页',
      '支持 d4、d6、d8、d10、d12、d20 和 d100 七种骰子',
      '支持最多 15 颗混合骰池与正负整数加值',
      '提供动画投掷、逐颗明细和计算后的总和',
      '支持复制最近结果，并在当前页面会话保留最近 20 次投掷',
    ],
  },
};

export function getSiteConfig(locale: SiteLocale) {
  return locale === 'zh' ? siteConfigZh : siteConfig;
}

export function getSiteManifestCopy() {
  return siteManifestCopy;
}

export function getSiteUiCopy(locale: SiteLocale) {
  return siteUiCopyByLocale[locale];
}

export function getHomeSignals(locale: SiteLocale) {
  return locale === 'zh' ? homeSignalsZh : homeSignals;
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

export function getAboutSections(locale: SiteLocale) {
  return aboutSectionsByLocale[locale];
}

export function getChangelogEntries(locale: SiteLocale) {
  return changelogEntriesByLocale[locale];
}

export function getDiceRollerPageCopy(locale: SiteLocale) {
  return diceRollerPageCopyByLocale[locale];
}
