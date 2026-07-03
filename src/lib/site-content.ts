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
    heroTitle: 'Free DnD Token Maker for Roll20 and Foundry VTT',
    heroDescription:
      'Create circular, square, and transparent PNG VTT tokens from character art. Add token borders, masks, and text, then export locally for DnD, Roll20, Foundry VTT, and Owlbear.',
    heroHighlights: [
      'Circular, square, and polygon token maker',
      'Transparent PNG export up to 2048',
      'Token borders for DnD, Roll20, Foundry VTT, and Owlbear',
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
        'Microsoft Clarity is included on the live site outside development. Google Analytics runs only in production when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.',
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
        'Microsoft Clarity 会在非开发环境的站点加载。只有在生产环境且配置 NEXT_PUBLIC_GA_MEASUREMENT_ID 时，Google Analytics 才会启用。',
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
