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

export interface GuideSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuidePageData {
  slug: string;
  title: string;
  description: string;
  summary: string;
  outcome: string;
  ctaQuery: string;
  sections: GuideSection[];
  relatedTemplateSlugs: string[];
}

export const siteConfig = {
  name: 'Token Maker',
  shortName: 'Token Maker',
  title: 'Token Maker for DnD, Roll20, and Foundry VTT',
  description:
    'Token Maker helps you build polished tabletop tokens in your browser. Upload character art, crop it, add borders, masks, text, and export transparent PNGs for DnD, Roll20, and Foundry VTT.',
  keywords: [
    'token maker',
    'vtt token maker',
    'dnd token maker',
    'roll20 token maker',
    'foundry vtt token maker',
    'circle token maker',
    'hex token maker',
    'monster token maker',
  ],
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
    description: 'Portrait images can stay in the browser while you crop, frame, and export tokens in Token Maker.',
  },
  {
    label: 'Export',
    value: 'Up to 2048',
    description: 'Generate PNG output sized for VTT libraries, monster packs, and printable counters.',
  },
  {
    label: 'Masks',
    value: 'Circle to d12',
    description: 'Switch between circular, square, and polygon masks without rebuilding the whole token.',
  },
  {
    label: 'Workflow',
    value: 'One screen',
    description: 'Upload, position, style, and download from a single tabletop-focused workspace.',
  },
];

export const homeFeatures: HomeFeature[] = [
  {
    title: 'Build tokens in Token Maker without leaving the browser',
    description:
      'The workspace is designed for quick portrait framing, not a long image-editing session. Drop art in, recenter it, and export fast.',
  },
  {
    title: 'Mix borders and masks independently',
    description:
      'Use a circular portrait inside a heavy frame, move to a square crop for handouts, or build hex counters for strategy overlays.',
  },
  {
    title: 'Make output ready for real VTT tables',
    description:
      'The Token Maker editor is aimed at DnD, Roll20, Foundry VTT, and similar tabletops where clean transparent PNGs matter more than filters.',
  },
  {
    title: 'Keep repeatable style presets nearby',
    description:
      'Preset groups make it easier to keep monster sets, NPC portraits, and faction markers visually consistent across a campaign.',
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
    question: 'What is this token maker used for?',
    answer:
      'Token Maker is a browser tool for turning character art, monster portraits, and NPC avatars into tabletop tokens with masks, borders, text, and PNG export.',
  },
  {
    question: 'Does Token Maker upload my images to a server?',
    answer:
      'The default workflow is local-first. Images can stay in the browser while you crop and export, which is useful for private campaign art or paid commissions.',
  },
  {
    question: 'Which virtual tabletops does it fit?',
    answer:
      'The export format is aimed at popular VTT setups such as Roll20, Foundry VTT, Owlbear Rodeo, and similar tools that accept PNG tokens.',
  },
  {
    question: 'Can I make square and hex tokens, not only circular ones?',
    answer:
      'Yes. The editor already supports circle, square, hexagon, octagon, decagon, and dodecagon style masks so you can match the board you are building for.',
  },
  {
    question: 'Can I add my own border or mask artwork?',
    answer:
      'Yes. Custom border and mask uploads are supported so you can align the token look with a homebrew setting, paid art pack, or campaign identity.',
  },
  {
    question: 'What export size should I use for VTT tokens?',
    answer:
      '512 works well for most tables. Move to 1024 or 2048 when you need sharper marketplace assets, premium handouts, or future-proof library files.',
  },
];

export const templatePages: TemplatePageData[] = [
  {
    slug: 'circle-token-maker',
    title: 'Circle Token Maker',
    description:
      'Create round tabletop tokens for DnD, Roll20, and Foundry VTT with browser-based cropping, border controls, and PNG export.',
    summary:
      'Circular tokens remain the default for many fantasy portraits because they frame a face quickly and read cleanly on cluttered battle maps. This template page is for character portraits, NPC heads, and boss icons where a centered crop matters more than edge detail.',
    intent: 'Best for character portraits, NPC heads, and classic VTT avatar circles.',
    bestFor: [
      'DnD character portraits',
      'NPC tokens with readable faces',
      'Boss portraits that need a clean silhouette',
    ],
    settings: [
      'Mask: circle',
      'Borders: metal, bone, gold, wood, or thin ring',
      'Export size: 512 for play, 1024 for archive sets',
    ],
    tips: [
      'Frame the eyes slightly above center so helmets and hair are not clipped.',
      'Use the border tint sparingly when your portrait already contains strong color contrast.',
      'Keep the background darker than the face so tokens stay readable at small sizes.',
    ],
    query: '/?mask=circle&preset=classic#editor-workspace',
  },
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
  {
    slug: 'hex-token-maker',
    title: 'Hex Token Maker',
    description:
      'Create hex-shaped counters for strategy overlays, war game maps, region markers, and hex-based VTT encounters.',
    summary:
      'Hex tokens are helpful when the play surface itself is hex-based or when you want a more tactical board-game silhouette. They also work well for scouting markers, region ownership icons, and overworld movement counters.',
    intent: 'Best for hex maps, strategy overlays, and board-game style counters.',
    bestFor: [
      'Hex crawls and regional movement maps',
      'Unit counters and terrain markers',
      'Faction and ownership indicators',
    ],
    settings: [
      'Mask: hexagon',
      'Borders: wood, ice, or thin ring depending on campaign tone',
      'Export size: 512 for table use, 1024 for print sheets',
    ],
    tips: [
      'Center on the strongest silhouette instead of the face when the token represents a unit or mount.',
      'Keep border density moderate so the six edges remain easy to read.',
      'Use muted background colors for map markers that need to coexist in large groups.',
    ],
    query: '/?mask=hexagon&border=wood#editor-workspace',
  },
  {
    slug: 'monster-token-maker',
    title: 'Monster Token Maker',
    description:
      'Turn creature art into readable monster tokens with aggressive frames, dark backdrops, and export sizes ready for encounter prep.',
    summary:
      'Monster tokens usually need stronger contrast than player portraits because they appear in groups, at smaller scale, and against noisy combat maps. This page focuses on high-readability setups for beasts, undead, fiends, and boss creatures.',
    intent: 'Best for encounter prep, creature libraries, and reusable bestiary sets.',
    bestFor: [
      'Encounter packs for GMs',
      'Undead, fiend, and beast portrait sets',
      'Readable tokens for dense battle maps',
    ],
    settings: [
      'Mask: circle or hexagon depending on campaign style',
      'Borders: bone, fire, barbarian metal, or silver spikes',
      'Export size: 512 for encounter speed, 1024 for library building',
    ],
    tips: [
      'Push the subject closer than you would for a player character so the creature stays visible at table zoom.',
      'Use darker backgrounds and brighter borders to separate monsters from map textures.',
      'Group encounter art by border family so the whole bestiary feels coherent.',
    ],
    query: '/?mask=circle&preset=monster#editor-workspace',
  },
  {
    slug: 'transparent-token-maker',
    title: 'Transparent Token Maker',
    description:
      'Export tokens with clean transparency for VTTs that layer portraits over dynamic maps, fog, and lighting effects.',
    summary:
      'Transparent token output matters when you want the art and frame to sit cleanly on top of map assets. This page is aimed at portrait crops where you do not want a boxed background or heavy color fill competing with the board below.',
    intent: 'Best for transparent PNG libraries and minimalist token sets.',
    bestFor: [
      'Minimalist portrait tokens',
      'Premium marketplace asset packs',
      'Tables that rely on lighting and fog layers',
    ],
    settings: [
      'Mask: circle or square',
      'Borders: none, thin ring, or a light decorative frame',
      'Export size: 1024 when you need cleaner transparency edges',
    ],
    tips: [
      'Keep overlay opacity low so the outer edge remains crisp on bright maps.',
      'Avoid heavy drop shadows if your VTT already renders lighting cues.',
      'Check the token on both dark and parchment maps before exporting a full set.',
    ],
    query: '/?mask=circle&border=none#editor-workspace',
  },
];

export const guidePages: GuidePageData[] = [
  {
    slug: 'how-to-make-vtt-tokens',
    title: 'How to Make VTT Tokens',
    description:
      'A practical workflow for turning art into clean virtual tabletop tokens without opening a full graphics suite.',
    summary:
      'If you need a repeatable way to build player, monster, and NPC tokens, this guide walks through the essentials: choosing art, framing it for map scale, selecting the right mask, and exporting for table use.',
    outcome: 'A repeatable browser workflow for fast VTT token production.',
    ctaQuery: '/?preset=classic#editor-workspace',
    relatedTemplateSlugs: ['circle-token-maker', 'monster-token-maker', 'transparent-token-maker'],
    sections: [
      {
        title: 'Start from readable source art',
        paragraphs: [
          'A token only has a few hundred pixels to communicate identity. Pick source art with a clear silhouette, strong face lighting, and limited background clutter.',
          'You do not need a perfect illustration. You need an image that still reads when the portrait is reduced and surrounded by map assets.',
        ],
        bullets: [
          'Crop around the subject before adding decoration.',
          'Prefer a centered face or silhouette over a wide scenic composition.',
          'Use art that still works at a glance from table zoom.',
        ],
      },
      {
        title: 'Match the mask to the table',
        paragraphs: [
          'Circular masks are the default for portrait-first fantasy play, but they are not always the best option. Square tokens preserve props, while hex tokens align better with strategy overlays and regional maps.',
          'The right choice depends on how the table reads the token, not on what looks fanciest at full size.',
        ],
      },
      {
        title: 'Export for speed first, then archive quality',
        paragraphs: [
          'Use 512 for active table prep and 1024 for anything you want to keep in a long-term token library. Larger exports help when you expect to reuse the same portrait in multiple campaigns or storefront bundles.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-make-foundry-vtt-tokens',
    title: 'How to Make Foundry VTT Tokens',
    description:
      'Prepare tokens for Foundry VTT with sharp transparency, consistent border language, and practical export sizes.',
    summary:
      'Foundry VTT gives you enough presentation control that cleaner tokens stand out quickly. The goal is not just a good portrait, but a consistent token language across players, NPCs, and monster packs.',
    outcome: 'A Foundry-friendly token set with consistent framing and transparent PNG output.',
    ctaQuery: '/?preset=warrior#editor-workspace',
    relatedTemplateSlugs: ['circle-token-maker', 'hex-token-maker', 'transparent-token-maker'],
    sections: [
      {
        title: 'Build for consistency across actors',
        paragraphs: [
          'Foundry campaigns often accumulate dozens of tokens over time. Consistency in mask choice, frame density, and export size makes scene building faster and actor sheets feel more deliberate.',
          'Use one or two border families for a campaign rather than picking a totally different frame for every token.',
        ],
      },
      {
        title: 'Keep transparency clean',
        paragraphs: [
          'Foundry scenes can include dynamic lighting, shadows, and detailed terrain. Transparent PNG edges help tokens sit naturally on those layers without carrying a visible background box.',
        ],
        bullets: [
          'Use low overlay opacity.',
          'Check borders on both dark caves and bright tavern maps.',
          'Export at 1024 if you plan to zoom in often.',
        ],
      },
      {
        title: 'Separate role by frame language',
        paragraphs: [
          'Player characters, allies, and monsters are easier to parse when each group uses its own border family or accent color. That makes combat scenes easier to scan without relying on nameplates alone.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-make-roll20-tokens',
    title: 'How to Make Roll20 Tokens',
    description:
      'Make Roll20-ready PNG tokens with clear faces, efficient file sizes, and reliable readability on busy battlemaps.',
    summary:
      'Roll20 tokens benefit from clarity more than from elaborate ornament. This guide focuses on center-weighted portraits, contrast, and export choices that stay readable in fast encounters.',
    outcome: 'Readable Roll20 tokens that stay clear during live play.',
    ctaQuery: '/?preset=rogue#editor-workspace',
    relatedTemplateSlugs: ['circle-token-maker', 'square-token-maker', 'monster-token-maker'],
    sections: [
      {
        title: 'Crop tighter than you expect',
        paragraphs: [
          'Roll20 maps can get visually crowded. A tighter crop keeps the face or creature head readable, especially when several tokens are packed into the same combat zone.',
        ],
      },
      {
        title: 'Use borders to separate roles',
        paragraphs: [
          'A restrained but distinct frame helps players identify allies, elites, or encounter roles without needing to zoom or hover constantly.',
        ],
        bullets: [
          'Gold or light metal for heroes',
          'Bone or dark metal for undead and hostile creatures',
          'Wood or thin ring for low-noise NPC portraits',
        ],
      },
      {
        title: 'Keep file management simple',
        paragraphs: [
          'Use 512 for normal play and reserve larger exports for source libraries. A disciplined export routine keeps your asset folders manageable and reduces repeated token cleanup later.',
        ],
      },
    ],
  },
  {
    slug: 'token-size-and-resolution',
    title: 'Token Size and Resolution Guide',
    description:
      'Choose the right export size for tabletop tokens, from fast 512 PNGs to cleaner archive-ready 2048 exports.',
    summary:
      'A token does not need the largest possible resolution to work well. The right export size depends on whether you are building for live play, long-term storage, marketplace packs, or print support.',
    outcome: 'A simple sizing rule set for live games, archives, and premium exports.',
    ctaQuery: '/?preset=classic#editor-workspace',
    relatedTemplateSlugs: ['transparent-token-maker', 'circle-token-maker', 'square-token-maker'],
    sections: [
      {
        title: 'Use 512 for most live tables',
        paragraphs: [
          '512 is a strong default because it balances visual clarity with practical file sizes. For most player portraits and monster tokens, it is enough.',
        ],
      },
      {
        title: 'Move to 1024 for long-term libraries',
        paragraphs: [
          'If you want sharper edges, better transparency, or more freedom to reuse assets later, 1024 gives you useful headroom without becoming excessive.',
        ],
      },
      {
        title: 'Reserve 2048 for special cases',
        paragraphs: [
          '2048 makes sense when you are packaging tokens for resale, producing premium handouts, or building a future-proof archive. It is rarely necessary for every combat token.',
        ],
        bullets: [
          '512 for active play',
          '1024 for archives and polished campaign sets',
          '2048 for premium or print-adjacent output',
        ],
      },
    ],
  },
];

export const templatePageMap = new Map(templatePages.map((page) => [page.slug, page]));
export const guidePageMap = new Map(guidePages.map((page) => [page.slug, page]));

export interface NavLabels {
  editor: string;
  templates: string;
  guides: string;
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
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  featuresTitle: string;
  templatesEyebrow: string;
  templatesTitle: string;
  seeAllTemplatePages: string;
  guidesTitle: string;
  workflowTitle: string;
  faqTitle: string;
  localFirstEyebrow: string;
  localFirstTitle: string;
  localFirstDescription: string;
  quickLinks: Array<{ href: string; label: string; description: string }>;
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

export const siteConfigZh = {
  name: 'Token Maker',
  shortName: 'Token Maker',
  title: 'Token Maker 在线制章工具',
  description:
    '用 Token Maker 在浏览器里制作 TRPG 与 VTT 角色 token。上传立绘、裁切头像、添加边框与文字，并导出透明 PNG。',
  keywords: [
    'token maker',
    'TRPG token 制作',
    'VTT token 工具',
    'DND token 生成器',
    '圆形 token 制作',
    '六边形 token 制作',
  ],
} as const;

export const homeSignalsZh: HomeSignal[] = [
  {
    label: '处理方式',
    value: '本地优先',
    description: '角色立绘可以直接留在浏览器里裁切、加框和导出，不必先走远程上传。',
  },
  {
    label: '导出',
    value: '最高 2048',
    description: '既能满足日常 VTT 使用，也能留出更高分辨率做长期素材库。',
  },
  {
    label: '形状',
    value: '圆形到十二边',
    description: '圆形、方形和多边形裁切可以快速切换，不必重新做整套 token。',
  },
  {
    label: '工作流',
    value: '单屏完成',
    description: '上传、定位、配色、导出都在同一个工作区完成，适合 GM 快速备战。',
  },
];

export const homeFeaturesZh: HomeFeature[] = [
  {
    title: '直接在浏览器里做 token',
    description: '这个工作区是为头像裁切设计的，不是一个笨重的修图台。丢进立绘，调整构图，然后直接导出。',
  },
  {
    title: '边框和遮罩可以独立组合',
    description: '你可以给同一张头像切成圆形、方形或六边形，并换不同风格边框来适配不同战役。',
  },
  {
    title: '输出面向真实桌面流程',
    description: '目标不是花哨滤镜，而是让 DnD、Roll20、Foundry VTT 等实际桌面环境里更清晰、更好识别。',
  },
  {
    title: '保留可重复使用的风格预设',
    description: '怪物、NPC、阵营单位可以共用一套视觉语言，避免一场战役里的 token 风格完全散掉。',
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
    question: '这个 token maker 主要用来做什么？',
    answer: '它是一个浏览器工具，用来把角色立绘、怪物头像和 NPC 头像快速做成带边框、遮罩、文字和 PNG 导出的桌面 token。',
  },
  {
    question: '图片会上传到服务器吗？',
    answer: '默认流程是本地优先。你在裁切和导出时，图片可以一直停留在浏览器里，这对私有战役素材和商业委托稿都更合适。',
  },
  {
    question: '适合哪些虚拟桌面？',
    answer: '导出结果主要面向 Roll20、Foundry VTT、Owlbear Rodeo 等接受 PNG token 的桌面环境。',
  },
  {
    question: '除了圆形，还能做方形和六边形吗？',
    answer: '可以。当前已经支持圆形、方形、六边形、八边形、十边形和十二边形等裁切形状。',
  },
  {
    question: '能上传自定义边框和遮罩吗？',
    answer: '可以。你可以上传自己的边框和遮罩素材，让 token 更贴合自制战役、美术包或世界观设定。',
  },
  {
    question: 'VTT token 一般导出多大合适？',
    answer: '大多数桌面场景下 512 就够用；如果你想保留更清晰边缘、做长期素材库或商品化资源，可以升到 1024 或 2048。',
  },
];

export const templatePagesZh: TemplatePageData[] = [
  {
    slug: 'circle-token-maker',
    title: '圆形 Token 制作器',
    description: '把角色头像做成适合 DnD、Roll20 和 Foundry VTT 的圆形 token，支持裁切、边框和 PNG 导出。',
    summary: '圆形 token 依然是很多奇幻桌面的默认形态，因为它能快速聚焦到脸部，也最适合拥挤战斗地图中的角色识别。',
    intent: '适合角色头像、NPC 头像和传统圆形 VTT token。',
    bestFor: ['DnD 角色头像', '需要清晰脸部识别的 NPC', '首领或重要单位的经典头像型 token'],
    settings: ['遮罩：圆形', '边框：金属、骨质、木质或细环', '导出：日常 512，长期素材库 1024'],
    tips: [
      '让眼睛略高于中心点，能减少头发和头盔被裁掉的问题。',
      '如果原图对比已经很强，边框染色不要下手太重。',
      '背景最好比脸部更暗，这样缩小后仍然容易识别。',
    ],
    query: '/zh?mask=circle&preset=classic#editor-workspace',
  },
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
  {
    slug: 'hex-token-maker',
    title: '六边形 Token 制作器',
    description: '为六角地图、战棋覆盖层和区域控制标记制作六边形 token。',
    summary: '六边形 token 在六角地图、区域推进和战棋单位标记中很有用，也更接近桌游式的战术视觉语言。',
    intent: '适合六角地图、战术覆盖层和桌游风格计数标记。',
    bestFor: ['Hex crawl 地图', '单位计数器和地形标记', '阵营与区域控制标识'],
    settings: ['遮罩：六边形', '边框：木质、寒霜或细环', '导出：桌面使用 512，打印或归档 1024'],
    tips: [
      '如果 token 代表单位而不是角色头像，优先居中主体轮廓而不是脸部。',
      '边框不要太重，否则六边形边缘会变得不清晰。',
      '大量地图标记同时出现时，背景颜色尽量压低饱和度。',
    ],
    query: '/zh?mask=hexagon&border=wood#editor-workspace',
  },
  {
    slug: 'monster-token-maker',
    title: '怪物 Token 制作器',
    description: '把怪物立绘做成高识别度 token，适合遭遇战准备、怪物库整理和长期复用。',
    summary: '怪物 token 往往需要比玩家头像更强的对比度，因为它们通常成群出现，而且战斗地图本身就很杂乱。',
    intent: '适合遭遇战准备、怪物库整理和长期复用的生物 token。',
    bestFor: ['GM 遭遇包', '亡灵、恶魔、野兽等怪物头像集', '需要高识别度的战斗地图 token'],
    settings: ['遮罩：圆形或六边形', '边框：骨质、火焰、野蛮金属或白银尖刺', '导出：战斗用 512，素材库 1024'],
    tips: [
      '怪物构图通常要比玩家角色更近一些，避免缩小时细节丢失。',
      '用更暗背景和更亮边框，能把怪物从地图纹理里拉出来。',
      '按怪物类型统一边框家族，会让整套 bestiary 更有秩序。',
    ],
    query: '/zh?mask=circle&preset=monster#editor-workspace',
  },
  {
    slug: 'transparent-token-maker',
    title: '透明背景 Token 制作器',
    description: '导出边缘干净的透明 PNG token，适合叠在复杂地图、雾效和光照层之上。',
    summary: '当你不想让 token 带一个明显背景盒子时，透明输出就很关键，尤其适合强调角色头像本身的地图场景。',
    intent: '适合透明 PNG 素材库和极简风格 token。',
    bestFor: ['极简头像 token', '更干净的商用资源包', '依赖雾效和灯光层的地图'],
    settings: ['遮罩：圆形或方形', '边框：无边框、细环或轻装饰边框', '导出：需要更细边缘时优先 1024'],
    tips: [
      '叠加层透明度尽量低一些，透明边缘会更干净。',
      '如果桌面工具已经有灯光效果，就不要再加太重的阴影。',
      '最好在深色和浅色地图上都看一遍，再决定整套导出参数。',
    ],
    query: '/zh?mask=circle&border=none#editor-workspace',
  },
];

export const guidePagesZh: GuidePageData[] = [
  {
    slug: 'how-to-make-vtt-tokens',
    title: '如何制作 VTT Token',
    description: '一套适合虚拟桌面使用的 token 制作流程，从挑图、裁切到导出都尽量轻量。',
    summary: '如果你想稳定地做出玩家、怪物和 NPC token，这篇指南会把关键步骤拆开：选图、构图、选遮罩、定导出尺寸。',
    outcome: '建立一套适合 VTT 的浏览器制章工作流。',
    ctaQuery: '/zh?preset=classic#editor-workspace',
    relatedTemplateSlugs: ['circle-token-maker', 'monster-token-maker', 'transparent-token-maker'],
    sections: [
      {
        title: '先选“缩小后仍然清晰”的原图',
        paragraphs: [
          'Token 的可用尺寸其实很小，所以最重要的不是大图本身，而是缩小后还能否一眼认出角色。',
          '你不一定需要完美插画，但一定要有清晰轮廓、稳定光线和不要太乱的背景。',
        ],
        bullets: ['先围绕主体裁切，不要急着加装饰。', '头像和主体轮廓的优先级要高于场景背景。', '在地图缩放视角下也要能认出是谁。'],
      },
      {
        title: '根据桌面场景决定遮罩',
        paragraphs: [
          '圆形适合传统头像类 token，方形更利于保留边缘细节，六边形更适合战棋和区域控制场景。',
          '不要只看全尺寸好不好看，而是看在地图上是否更容易识别。',
        ],
      },
      {
        title: '先保证效率，再决定归档尺寸',
        paragraphs: ['512 很适合日常战斗使用；如果你想做长期素材库、做商用资源或想保留更清晰边缘，再导出 1024。'],
      },
    ],
  },
  {
    slug: 'how-to-make-foundry-vtt-tokens',
    title: '如何制作 Foundry VTT Token',
    description: '为 Foundry VTT 准备清晰透明、风格统一的 token，避免地图里出现一套一套完全不一致的头像。',
    summary: 'Foundry VTT 的呈现能力更强，所以 token 风格是否统一会很明显。这篇指南更关注整套资产的一致性，而不是单个头像的花哨程度。',
    outcome: '得到一套更适合 Foundry VTT 的统一 token 资产。',
    ctaQuery: '/zh?preset=warrior#editor-workspace',
    relatedTemplateSlugs: ['circle-token-maker', 'hex-token-maker', 'transparent-token-maker'],
    sections: [
      {
        title: '先定规则，再批量制作',
        paragraphs: [
          'Foundry 的战役通常会累积大量 token。如果你一开始就统一遮罩、边框厚度和导出尺寸，后面整理 Actor 和 Scene 会轻松很多。',
          '同一场战役里尽量只用一到两套边框家族，不要每个 token 都完全换一种视觉语言。',
        ],
      },
      {
        title: '透明边缘要比滤镜更重要',
        paragraphs: ['Foundry 里常常会叠加灯光、阴影和复杂地形，所以透明 PNG 的边缘是否干净，比额外滤镜更影响最终观感。'],
        bullets: ['叠加层透明度压低。', '在黑暗洞穴和明亮酒馆地图都试一下。', '如果常用高缩放，优先 1024 导出。'],
      },
      {
        title: '用边框区分角色类型',
        paragraphs: ['玩家、友军、精英怪和普通怪用不同边框家族或强调色，会让战斗场景更容易扫视，不必全靠名字识别。'],
      },
    ],
  },
  {
    slug: 'how-to-make-roll20-tokens',
    title: '如何制作 Roll20 Token',
    description: '为 Roll20 准备更清晰、更轻量的 PNG token，重点是识别效率和战斗中的可读性。',
    summary: 'Roll20 的地图经常很拥挤，所以最重要的是人脸或怪物头部在缩小状态下能否立刻识别，而不是装饰是否复杂。',
    outcome: '做出在 Roll20 对战中依然清晰的 token。',
    ctaQuery: '/zh?preset=rogue#editor-workspace',
    relatedTemplateSlugs: ['circle-token-maker', 'square-token-maker', 'monster-token-maker'],
    sections: [
      {
        title: '构图要比你想象中更近',
        paragraphs: ['Roll20 地图里单位通常比较密，所以头像裁切要更贴近主体，否则一缩小就什么都看不清。'],
      },
      {
        title: '边框用来区分角色，而不是堆装饰',
        paragraphs: ['克制但明确的边框，比复杂装饰更有用，它能帮助玩家快速识别友军、精英怪和不同阵营。'],
        bullets: ['金色或浅金属适合英雄角色', '骨质或深色金属适合亡灵与敌对单位', '木质和细环更适合低噪声 NPC 头像'],
      },
      {
        title: '导出策略要简单',
        paragraphs: ['大多数情况下 512 已经足够，只有当你打算长期积累素材库时，再额外留一套更高分辨率版本。'],
      },
    ],
  },
  {
    slug: 'token-size-and-resolution',
    title: 'Token 尺寸与分辨率指南',
    description: '在 512、1024、2048 之间怎么选，取决于你是在现场战斗用、做长期素材库，还是做高质量资源包。',
    summary: 'Token 不一定越大越好。真正合适的导出尺寸，取决于你的使用场景：即时游戏、长期归档、商用资源或打印需求。',
    outcome: '明确不同场景下的 token 导出尺寸策略。',
    ctaQuery: '/zh?preset=classic#editor-workspace',
    relatedTemplateSlugs: ['transparent-token-maker', 'circle-token-maker', 'square-token-maker'],
    sections: [
      {
        title: '大多数桌面场景先用 512',
        paragraphs: ['512 是很稳妥的默认值，清晰度和文件体积之间比较平衡，绝大多数玩家角色和怪物头像都够用。'],
      },
      {
        title: '长期素材库优先 1024',
        paragraphs: ['如果你想保留更干净的透明边缘、以后继续复用，1024 会比 512 更从容，但又不至于太重。'],
      },
      {
        title: '2048 只留给特殊场景',
        paragraphs: ['2048 更适合商用资源包、精品手札或你想做未来长期归档时使用，不需要每一个怪物 token 都导这么大。'],
        bullets: ['512 适合实战', '1024 适合归档和较精细战役素材', '2048 适合高质量展示与商用资源'],
      },
    ],
  },
];

export const navLabelsByLocale: Record<SiteLocale, NavLabels> = {
  en: {
    editor: 'Editor',
    templates: 'Templates',
    guides: 'Blog',
    faq: 'FAQ',
    privacy: 'Privacy',
    switchLocale: '中文',
  },
  zh: {
    editor: '编辑器',
    templates: '模板页',
    guides: '博客',
    faq: '常见问题',
    privacy: '隐私',
    switchLocale: 'English',
  },
};

export const shellCopyByLocale: Record<SiteLocale, ShellCopy> = {
  en: {
    backToSite: 'Back to',
    browseTemplates: 'Browse templates',
    whyThisPageExists: 'Why this page exists',
    whyPageBullets: [
      'These inner pages explain when a specific format, workflow, or policy detail matters.',
      'Each page should answer a different tabletop decision instead of repeating the editor.',
      'The editor remains the primary surface, while the supporting content helps users choose faster.',
    ],
  },
  zh: {
    backToSite: '返回',
    browseTemplates: '浏览模板页',
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
    heroEyebrow: 'Browser token workshop',
    heroTitle: siteConfig.title,
    heroDescription:
      'Token Maker lets you upload character art, crop it in the browser, add masks, borders, text, and export clean PNG tokens without opening a heavy graphics suite. The editor stays front and center, with format guides, FAQs, and practical references close by when you need them.',
    heroPrimaryCta: 'Jump into the editor',
    heroSecondaryCta: 'Browse template pages',
    featuresTitle: 'What Token Maker helps you do',
    templatesEyebrow: 'Template directory',
    templatesTitle: 'Token Maker template pages for distinct token formats',
    seeAllTemplatePages: 'See all template pages',
    guidesTitle: 'Token Maker blog posts for real table prep',
    workflowTitle: 'How the workflow stays lightweight',
    faqTitle: 'Token Maker FAQ',
    localFirstEyebrow: 'Local processing first',
    localFirstTitle: 'Work on your token in Token Maker first',
    localFirstDescription:
      'Drop in character art, crop it, add masks and borders, and export a clean PNG without sending the image elsewhere first. When you need more direction, move into the template pages, blog posts, or the FAQ.',
    quickLinks: [
      { href: '/templates', label: 'Token Maker templates', description: 'Jump into the right setup for circle, square, hex, monster, or transparent tokens.' },
      { href: '/blog', label: 'Token Maker blog', description: 'Read practical guides for VTT prep, Foundry VTT, Roll20, and export decisions.' },
      { href: '/faq', label: 'Token Maker FAQ', description: 'Find answers about exports, privacy, formats, and tabletop compatibility.' },
    ],
  },
  zh: {
    heroEyebrow: '浏览器制章工作台',
    heroTitle: 'Token Maker 在线制章工具',
    heroDescription:
      'Token Maker 让你把角色立绘直接拖进浏览器，裁切头像、添加边框、遮罩和文字，然后导出透明 PNG。Token Maker 首页继续把编辑器放在最前面，同时把模板页、FAQ 和实用参考信息放在随手可达的位置。',
    heroPrimaryCta: '直接进入编辑器',
    heroSecondaryCta: '浏览模板页',
    featuresTitle: '这个工具能帮你完成什么',
    templatesEyebrow: '模板目录',
    templatesTitle: '针对不同 token 格式的模板页',
    seeAllTemplatePages: '查看全部模板页',
    guidesTitle: '面向真实备战流程的博客文章',
    workflowTitle: '为什么这个工作流够轻',
    faqTitle: 'Token Maker 常见问题',
    localFirstEyebrow: '默认本地处理',
    localFirstTitle: '先在浏览器里把 Token 做出来',
    localFirstDescription:
      '把角色图拖进来后，你可以直接裁切、加边框、套遮罩并导出透明 PNG，不必先把图片传到别处。需要更多方向时，再继续查看模板页、博客或常见问题。',
    quickLinks: [
      { href: '/templates', label: '模板页', description: '按圆形、方形、六边形、怪物或透明背景快速找到合适入口。' },
      { href: '/blog', label: '博客', description: '查看 VTT 流程、Foundry、Roll20 和导出尺寸怎么选。' },
      { href: '/faq', label: '常见问题', description: '集中回答导出、隐私、格式兼容和使用方式。' },
    ],
  },
};

export const collectionPageCopyByLocale: Record<
  SiteLocale,
  {
    templates: CollectionPageCopy;
    guides: CollectionPageCopy;
    faq: CollectionPageCopy;
    privacy: CollectionPageCopy;
  }
> = {
  en: {
    templates: {
      eyebrow: 'Template collection',
      title: 'Token maker templates for specific play styles',
      description: 'Explore template pages for circle, square, hex, monster, and transparent token workflows, then open the matching editor setup.',
      ctaLabel: 'Open the editor',
    },
    guides: {
      eyebrow: 'Blog',
      title: 'Token Maker blog for token creation',
      description: 'Read blog posts about crop decisions, platform-specific tuning, and export sizing before you jump back into the editor.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common questions about Token Maker',
      description: 'Find quick answers about formats, export sizes, privacy expectations, and tabletop compatibility.',
    },
    privacy: {
      eyebrow: 'Privacy',
      title: 'A local-first privacy posture for token creation',
      description: 'Understand how the local-first workflow handles images, exports, and any future remote storage features.',
    },
  },
  zh: {
    templates: {
      eyebrow: '模板集合',
      title: '针对不同桌面场景的 Token 模板页',
      description: '这里整理了圆形、方形、六边形、怪物和透明背景等不同 token 工作流，并能直接打开对应预设。',
      ctaLabel: '打开编辑器',
    },
    guides: {
      eyebrow: '博客',
      title: 'Token Maker 博客文章',
      description: '这里集中解释裁切判断、平台适配和导出尺寸，适合先读懂流程再回到编辑器动手。',
    },
    faq: {
      eyebrow: '常见问题',
      title: '关于 Token Maker 的常见问题',
      description: '把格式、导出、隐私和桌面兼容性问题单独放在这里，首页就可以更聚焦于工具本身。',
    },
    privacy: {
      eyebrow: '隐私',
      title: '面向本地优先工作流的隐私说明',
      description: '说明本地优先流程如何处理图片、导出，以及未来如果接入远程能力时会怎样披露。',
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

export function getGuidePages(locale: SiteLocale) {
  return locale === 'zh' ? guidePagesZh : guidePages;
}

export function getTemplatePage(locale: SiteLocale, slug: string) {
  return getTemplatePages(locale).find((page) => page.slug === slug);
}

export function getGuidePage(locale: SiteLocale, slug: string) {
  return getGuidePages(locale).find((page) => page.slug === slug);
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
