import type { Metadata } from 'next';
import {
  absoluteUrl,
  getCollectionPageCopy,
  getFaqItems,
  getGuidePage,
  getGuidePages,
  getPrivacySections,
  getSiteConfig,
  getSiteUrl,
  getTemplatePage,
  getTemplatePages,
  type FaqItem,
  type GuidePageData,
  type TemplatePageData,
} from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export interface TemplateExampleOutput {
  title: string;
  description: string;
}

export interface TemplateComparison {
  slug: string;
  reason: string;
}

export interface TemplateDetailModel extends TemplatePageData {
  updatedAt: string;
  decisionLens: string;
  useCases: string[];
  avoidWhen: string[];
  commonMistakes: string[];
  exampleOutputs: TemplateExampleOutput[];
  compareWith: TemplateComparison[];
  signatureSetup: {
    label: string;
    items: string[];
  };
}

export interface GuideStep {
  title: string;
  description: string;
  checklist?: string[];
}

export interface GuideDetailModel extends GuidePageData {
  updatedAt: string;
  readTime: string;
  audience: string[];
  checklist: string[];
  pitfalls: string[];
  faq: FaqItem[];
  steps: GuideStep[];
}

export interface HubStat {
  label: string;
  value: string;
  description: string;
}

export interface TemplateHubCategory {
  id: string;
  title: string;
  description: string;
  narrative: string;
  slugs: string[];
}

export interface TemplateHubDecisionGuide {
  id: string;
  title: string;
  description: string;
  slugs: string[];
}

export interface TemplateHubAlternativeRoute {
  slug: string;
  reason: string;
}

export interface TemplateHubEntryPoint {
  id: string;
  title: string;
  description: string;
  primarySlug: string;
  primaryReason: string;
  alternatives: TemplateHubAlternativeRoute[];
  caution: string;
}

export interface GuideHubTrack {
  id: string;
  title: string;
  description: string;
  outcome: string;
  slugs: string[];
}

export interface TemplatesHubModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  stats: HubStat[];
  decisionGuidesTitle: string;
  decisionGuidesIntro: string;
  decisionGuides: TemplateHubDecisionGuide[];
  entryPointsTitle: string;
  entryPointsIntro: string;
  entryPoints: TemplateHubEntryPoint[];
  categories: TemplateHubCategory[];
  comparisonTitle: string;
  comparisonDescription: string;
}

export interface GuidesHubModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  stats: HubStat[];
  tracks: GuideHubTrack[];
  timelineTitle: string;
  timeline: Array<{ title: string; description: string }>;
}

export interface FaqDocGroup {
  id: string;
  title: string;
  description: string;
  itemIndexes: number[];
}

export interface FaqDocModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  groups: FaqDocGroup[];
  signals: Array<{ title: string; description: string }>;
}

export interface PrivacyDocModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  principles: Array<{ title: string; description: string }>;
  commitments: string[];
}

type TemplateEnhancement = Omit<TemplateDetailModel, keyof TemplatePageData>;
type GuideEnhancement = Omit<GuideDetailModel, keyof GuidePageData>;

const templateEnhancementsByLocale: Record<SiteLocale, Record<string, TemplateEnhancement>> = {
  en: {
    'circle-token-maker': {
      updatedAt: '2026-03-09',
      decisionLens: 'Choose the circular setup when identity needs to resolve in a split second and the portrait itself does most of the work.',
      useCases: [
        'Hero portraits that need instant face recognition on cluttered battle maps.',
        'Named NPC tokens where mood and facial expression matter more than gear silhouette.',
        'Boss markers that should feel premium without swallowing too much map space.',
      ],
      avoidWhen: [
        'The image needs to preserve wide props, shoulder armor, or banners.',
        'The table layout is strongly square-grid and visual alignment matters more than portrait focus.',
        'You want to keep background storytelling instead of isolating the face.',
      ],
      commonMistakes: [
        'Cropping too low, which clips helmets and makes the token feel crowded.',
        'Using an ornate frame on already noisy art, reducing readability at play scale.',
        'Leaving the background too bright, which weakens face contrast after export.',
      ],
      exampleOutputs: [
        {
          title: 'Player character portrait ring',
          description: 'A tight face crop with a restrained metallic frame for repeated campaign use.',
        },
        {
          title: 'Named tavern NPC set',
          description: 'Warm portraits with minimal tint shifts so every token still belongs to the same world.',
        },
        {
          title: 'Boss encounter portrait',
          description: 'Heavier border, darker backdrop, and a slightly larger export for scene intros.',
        },
      ],
      compareWith: [
        {
          slug: 'square-token-maker',
          reason: 'Move there when the portrait needs more shoulder room or grid alignment.',
        },
        {
          slug: 'transparent-token-maker',
          reason: 'Use that route when clean edges and map blending matter more than a framed look.',
        },
      ],
      signatureSetup: {
        label: 'Baseline setup',
        items: ['Mask: circle', 'Border family: classic or thin ring', 'Export: 512 for play, 1024 for archives'],
      },
    },
    'square-token-maker': {
      updatedAt: '2026-03-08',
      decisionLens: 'Use the square page when edge detail carries meaning and the token has to cooperate with rigid map grids.',
      useCases: [
        'Sci-fi and modern portraits with visible uniforms, helmets, or weapons.',
        'Map labels, UI-aligned portraits, and handout style counters.',
        'Faction markers where the shape should feel structured instead of ornamental.',
      ],
      avoidWhen: [
        'The token is only about facial recognition and should disappear into a battle map quickly.',
        'You want soft round silhouettes that read as classic fantasy avatars.',
        'The artwork already contains a strong square border and additional framing would overbuild it.',
      ],
      commonMistakes: [
        'Using square crops without enough headroom, which makes hats and shoulders feel cramped.',
        'Adding thick borders that fight the existing grid instead of reinforcing it.',
        'Treating square tokens like posters and keeping too much empty background.',
      ],
      exampleOutputs: [
        {
          title: 'Grid-native NPC portrait',
          description: 'A square crop with light framing that sits neatly beside map UI elements.',
        },
        {
          title: 'Room marker token',
          description: 'Text-supported square tile for points of interest, patrol markers, or quest locations.',
        },
        {
          title: 'Modern operator portrait',
          description: 'More shoulder detail and gear silhouette than a circular crop can comfortably hold.',
        },
      ],
      compareWith: [
        {
          slug: 'circle-token-maker',
          reason: 'Switch back when you need stronger face-first recognition at combat scale.',
        },
        {
          slug: 'hex-token-maker',
          reason: 'Choose hex when the board itself is tactical or region-based rather than square-grid.',
        },
      ],
      signatureSetup: {
        label: 'Grid-friendly setup',
        items: ['Mask: square', 'Border family: thin ring or none', 'Export: 512 for maps, 1024 for detailed UI packs'],
      },
    },
    'hex-token-maker': {
      updatedAt: '2026-03-07',
      decisionLens: 'Pick the hex route when the token behaves more like a tactical counter or area marker than a portrait chip.',
      useCases: [
        'Hex crawls, strategy overlays, and wargame-adjacent tables.',
        'Ownership markers, scouting tokens, and unit counters.',
        'Campaign maps where silhouette and faction language matter more than facial expression.',
      ],
      avoidWhen: [
        'You are building a portrait-first social cast with lots of faces.',
        'The source art only works as a centered headshot.',
        'The board is visually busy and extra polygon edges would create noise.',
      ],
      commonMistakes: [
        'Centering on the face even when the subject is really a mount, banner, or unit shape.',
        'Using a border that is too dense, which muddies the six-edge silhouette.',
        'Keeping saturated backgrounds that make large token groups hard to scan.',
      ],
      exampleOutputs: [
        {
          title: 'Regional control marker',
          description: 'Muted colors and bold silhouette for large map overlays.',
        },
        {
          title: 'Mounted unit counter',
          description: 'Silhouette-led crop that still reads when zoomed out.',
        },
        {
          title: 'Faction scouting token',
          description: 'Hex counter designed to coexist with many sibling markers in one scene.',
        },
      ],
      compareWith: [
        {
          slug: 'square-token-maker',
          reason: 'Use square when the map is rigidly grid-first and needs rectangular alignment.',
        },
        {
          slug: 'monster-token-maker',
          reason: 'Use monster framing when the token is about creature drama rather than tactical categorization.',
        },
      ],
      signatureSetup: {
        label: 'Counter setup',
        items: ['Mask: hexagon', 'Border family: wood or thin ring', 'Export: 512 for active boards, 1024 for printable sets'],
      },
    },
    'monster-token-maker': {
      updatedAt: '2026-03-10',
      decisionLens: 'This page is for encounter readability first: drama, threat, and fast distinction between hostile groups.',
      useCases: [
        'Bestiary building for recurring creature libraries.',
        'Boss and elite enemy portraits that need immediate threat signaling.',
        'Dense combat scenes where monsters must separate from textured maps.',
      ],
      avoidWhen: [
        'The token is for friendly social NPCs or player party portraits.',
        'The map already contains loud color accents and heavy borders would overcompete.',
        'You are building minimalist transparent assets for storefront packs.',
      ],
      commonMistakes: [
        'Cropping monsters too loosely and losing facial or silhouette impact.',
        'Mixing too many frame families within one encounter pack.',
        'Using backgrounds that are as bright as the border, which flattens the token.',
      ],
      exampleOutputs: [
        {
          title: 'Undead encounter set',
          description: 'Cold border language, dark backdrop, and consistent scale across a whole encounter pack.',
        },
        {
          title: 'Boss portrait token',
          description: 'Heavy frame and aggressive close crop for a scene-opening reveal.',
        },
        {
          title: 'Reusable fiend library',
          description: 'A coherent creature family meant for long-term GM reuse.',
        },
      ],
      compareWith: [
        {
          slug: 'circle-token-maker',
          reason: 'Use the classic circle when the token is still portrait-led rather than threat-led.',
        },
        {
          slug: 'transparent-token-maker',
          reason: 'Move there if map blending matters more than dramatic border language.',
        },
      ],
      signatureSetup: {
        label: 'Encounter setup',
        items: ['Mask: circle or hexagon', 'Border family: bone, fire, or spiked metal', 'Export: 512 for encounter prep, 1024 for library reuse'],
      },
    },
    'transparent-token-maker': {
      updatedAt: '2026-03-12',
      decisionLens: 'Use the transparent route when the token should sit cleanly on the map instead of announcing its frame.',
      useCases: [
        'Premium PNG libraries intended for many different VTT backgrounds.',
        'Lighting-heavy scenes where token edges must stay crisp.',
        'Minimalist portrait sets that rely on clean silhouettes over ornament.',
      ],
      avoidWhen: [
        'You need strong border language to encode role or faction.',
        'The art requires a decorative frame to feel finished.',
        'The scene calls for deliberately dramatic encounter tokens.',
      ],
      commonMistakes: [
        'Leaving overlay opacity too high, which creates muddy edges on bright maps.',
        'Using heavy drop shadows even though the target VTT already handles depth.',
        'Exporting too small and expecting clean transparency on zoomed-in scenes.',
      ],
      exampleOutputs: [
        {
          title: 'Marketplace-ready transparent PNG',
          description: 'Neutral silhouette treatment with enough resolution for reuse across many scenes.',
        },
        {
          title: 'Fog-friendly player portraits',
          description: 'Tokens that stay clean against both shadow-heavy dungeons and pale overworld maps.',
        },
        {
          title: 'Minimal campaign roster',
          description: 'A restrained set where identity comes from the art, not the frame.',
        },
      ],
      compareWith: [
        {
          slug: 'circle-token-maker',
          reason: 'Go there when you need stronger portrait framing and classic tabletop language.',
        },
        {
          slug: 'monster-token-maker',
          reason: 'Use the monster route when clarity depends on forceful hostile framing.',
        },
      ],
      signatureSetup: {
        label: 'Clean-edge setup',
        items: ['Mask: circle or square', 'Border family: none or thin ring', 'Export: 1024 when edge quality matters'],
      },
    },
  },
  zh: {
    'circle-token-maker': {
      updatedAt: '2026-03-09',
      decisionLens: '当页面目标是“缩小后仍然一眼认出是谁”，圆形 token 依然是最稳的默认方案。',
      useCases: [
        '角色头像、命名 NPC、首领头像这类以脸部识别为主的场景。',
        '战斗地图元素很多，但你仍希望角色在缩小后保持清晰辨识。',
        '需要一套经典奇幻桌面视觉语言，而不是战棋式标记语言。',
      ],
      avoidWhen: [
        '原图重点在肩甲、武器、旗帜等边缘细节，而不是脸部。',
        '地图和 UI 都是强方格体系，需要更整齐的边缘对齐。',
        '你想保留更多背景叙事，而不是把注意力强行收在头像中央。',
      ],
      commonMistakes: [
        '构图太低，导致头盔、头发或耳朵被裁掉。',
        '原图已经很杂，却还叠加过重边框，让缩小时更糊。',
        '背景亮度和脸差不多，缩小后主体立不起来。',
      ],
      exampleOutputs: [
        {
          title: '玩家角色头像环',
          description: '适合长期战役复用的紧凑脸部裁切，边框存在感克制。',
        },
        {
          title: '命名 NPC 套装',
          description: '统一暖色和边框家族，让城镇角色看起来属于同一个世界。',
        },
        {
          title: '首领遭遇头像',
          description: '更重一点的边框和更暗的背景，用来支撑开场压迫感。',
        },
      ],
      compareWith: [
        {
          slug: 'square-token-maker',
          reason: '如果你需要更多肩部空间和网格对齐，切到方形页更合适。',
        },
        {
          slug: 'transparent-token-maker',
          reason: '如果你更在意透明边缘和地图融合，而不是传统边框语言，就去透明页。',
        },
      ],
      signatureSetup: {
        label: '基准配置',
        items: ['遮罩：圆形', '边框：经典或细环', '导出：实战 512，归档 1024'],
      },
    },
    'square-token-maker': {
      updatedAt: '2026-03-08',
      decisionLens: '当边缘细节本身有信息价值，而且 token 需要更贴近网格地图时，方形页比圆形更合理。',
      useCases: [
        '现代、科幻或制服类头像，需要看见肩部和装备。',
        '地图标记、房间标签、阵营牌这种更偏 UI 的 token。',
        '想让 token 的轮廓和方格地图天然对齐的场景。',
      ],
      avoidWhen: [
        '你只想让玩家一眼认脸，不需要额外保留边缘信息。',
        '想要更传统的奇幻头像语言，而不是偏卡片或标记的感觉。',
        '原图本身已经有很重的外框，再叠边框会显得太满。',
      ],
      commonMistakes: [
        '头顶留白不足，帽子、肩甲和武器边缘被挤掉。',
        '为了“更像 token”加太厚边框，反而破坏网格整洁感。',
        '把方形 token 当海报来做，背景留太多，主体反而缩小。',
      ],
      exampleOutputs: [
        {
          title: '网格型 NPC 头像',
          description: '轻边框、强对齐，适合和地图 UI 一起出现。',
        },
        {
          title: '房间或阵营标记',
          description: '需要文字或编号时，方形结构更稳定。',
        },
        {
          title: '现代行动队头像',
          description: '保留更多装备轮廓，比圆形更适合制服和器材信息。',
        },
      ],
      compareWith: [
        {
          slug: 'circle-token-maker',
          reason: '如果核心还是脸部识别，就回到圆形页。',
        },
        {
          slug: 'hex-token-maker',
          reason: '如果地图本身偏战棋或区域控制，不是方格导向，就看六边形页。',
        },
      ],
      signatureSetup: {
        label: '网格配置',
        items: ['遮罩：方形', '边框：细环或无边框', '导出：地图 512，细节包 1024'],
      },
    },
    'hex-token-maker': {
      updatedAt: '2026-03-07',
      decisionLens: '六边形页不是给头像美观度准备的，而是给战术感、区域感和计数器逻辑准备的。',
      useCases: [
        'Hex crawl、战棋覆盖层、区域推进地图。',
        '阵营占领标记、侦查单位、移动计数器。',
        '强调轮廓和分类，而不是强调脸部表情的素材。',
      ],
      avoidWhen: [
        '你真正需要的是角色头像识别，不是战术标记。',
        '原图只能靠脸部居中来成立。',
        '地图本身已经非常嘈杂，再加多边形边缘会更乱。',
      ],
      commonMistakes: [
        '明明是单位计数器，却仍然把焦点锁死在脸上。',
        '边框太复杂，导致六条边看不清。',
        '背景饱和度太高，大量同屏时很难扫视。',
      ],
      exampleOutputs: [
        {
          title: '区域控制标记',
          description: '低饱和背景和清晰轮廓，适合大地图覆盖层。',
        },
        {
          title: '骑乘单位计数器',
          description: '主体轮廓优先，而不是纯人脸头像。',
        },
        {
          title: '阵营侦查标记',
          description: '适合和大量同类地图标记一起出现。',
        },
      ],
      compareWith: [
        {
          slug: 'square-token-maker',
          reason: '如果场景核心是方格地图和 UI 对齐，就改看方形页。',
        },
        {
          slug: 'monster-token-maker',
          reason: '如果你想强调怪物威压而不是战术分类，就看怪物页。',
        },
      ],
      signatureSetup: {
        label: '计数器配置',
        items: ['遮罩：六边形', '边框：木质或细环', '导出：棋盘 512，打印 1024'],
      },
    },
    'monster-token-maker': {
      updatedAt: '2026-03-10',
      decisionLens: '怪物页的目标不是“好看头像”，而是“敌对单位一眼能从地图里跳出来”。',
      useCases: [
        'GM 怪物库、遭遇包和首领头像。',
        '需要高对比、强边框、统一威胁语言的敌对单位。',
        '地图纹理复杂，怪物必须从背景里被拉出来的战斗场景。',
      ],
      avoidWhen: [
        '玩家角色或友方 NPC，需要更柔和的身份表达。',
        '地图已经有很重的高亮色，边框再加码会太吵。',
        '你真正想做的是极简透明资源包，而不是遭遇战 token。',
      ],
      commonMistakes: [
        '怪物裁切不够近，缩小后没有压迫感。',
        '同一套遭遇包用了太多完全不同的边框家族。',
        '背景和边框一样亮，整张 token 变得发灰。',
      ],
      exampleOutputs: [
        {
          title: '亡灵遭遇包',
          description: '统一冷调边框、暗背景和尺度，用于整组复数敌人。',
        },
        {
          title: '首领压迫头像',
          description: '更强的近景和更重边框，用于关键战斗开场。',
        },
        {
          title: '长期复用怪物库',
          description: '同一怪物谱系共享边框和配色，更像一套系统化资源。',
        },
      ],
      compareWith: [
        {
          slug: 'circle-token-maker',
          reason: '如果还是传统头像识别优先，就回到圆形页。',
        },
        {
          slug: 'transparent-token-maker',
          reason: '如果你更在意地图融合和透明边缘，而不是敌对威压感，就看透明页。',
        },
      ],
      signatureSetup: {
        label: '遭遇配置',
        items: ['遮罩：圆形或六边形', '边框：骨质、火焰或尖刺金属', '导出：遭遇战 512，素材库 1024'],
      },
    },
    'transparent-token-maker': {
      updatedAt: '2026-03-12',
      decisionLens: '透明页适合那些不想让边框主导风格，而想让 token 更自然贴在地图上的场景。',
      useCases: [
        '通用 PNG 素材库，打算跨多个 VTT 或地图风格复用。',
        '光照、雾效、复杂地形比较多的地图。',
        '极简 token 套装，主角是立绘本身，不是边框。',
      ],
      avoidWhen: [
        '你需要靠边框明确区分阵营、角色类型或遭遇等级。',
        '原图本身很松，需要装饰边框来把视觉收住。',
        '你要做的是戏剧化怪物 token，而不是低噪声素材。',
      ],
      commonMistakes: [
        '叠加层透明度太高，透明边缘一到浅色地图就发灰。',
        '桌面工具本身已经有景深效果，却又额外加重阴影。',
        '导出太小，还期待高缩放时边缘足够干净。',
      ],
      exampleOutputs: [
        {
          title: '商用透明 PNG',
          description: '干净边缘、低边框存在感，便于跨场景复用。',
        },
        {
          title: '适配雾效的玩家头像',
          description: '在黑暗地城和浅色地图上都能保持利落边缘。',
        },
        {
          title: '极简战役 roster',
          description: '身份更多来自立绘本身，而不是装饰元素。',
        },
      ],
      compareWith: [
        {
          slug: 'circle-token-maker',
          reason: '如果你需要更明确的传统头像边框语言，就回到圆形页。',
        },
        {
          slug: 'monster-token-maker',
          reason: '如果你需要敌对单位强冲击力，就看怪物页。',
        },
      ],
      signatureSetup: {
        label: '净边配置',
        items: ['遮罩：圆形或方形', '边框：无边框或细环', '导出：追求边缘质量时优先 1024'],
      },
    },
  },
};

const guideEnhancementsByLocale: Record<SiteLocale, Record<string, GuideEnhancement>> = {
  en: {
    'how-to-make-vtt-tokens': {
      updatedAt: '2026-03-11',
      readTime: '6 min read',
      audience: ['Players building recurring character tokens', 'GMs assembling encounter packs', 'Artists packaging VTT-ready portraits'],
      checklist: [
        'Start with art that survives reduction.',
        'Pick the crop based on table readability, not full-size aesthetics.',
        'Export a play-size version before you bother with archive size.',
      ],
      pitfalls: [
        'Treating every portrait like a beauty shot instead of a game asset.',
        'Decorating before confirming that the subject reads clearly at map scale.',
        'Exporting oversized files before you know the token family works.',
      ],
      faq: [
        {
          question: 'Should every VTT token use the same border family?',
          answer: 'Usually yes. One or two frame families per campaign is enough to keep the table readable without making the roster look random.',
        },
        {
          question: 'When should I keep the background visible?',
          answer: 'Only when the background is part of the token identity. Most of the time, map readability wins over scenic context.',
        },
      ],
      steps: [
        {
          title: 'Choose art that survives reduction',
          description: 'Look at the image as a small game asset, not as a full illustration. Strong face lighting and simple silhouette matter more than scenic ambition.',
          checklist: ['Test the portrait at small size before styling it.', 'Remove background clutter if it competes with the subject.'],
        },
        {
          title: 'Pick the shape after you know the table context',
          description: 'Circle is not automatically correct. Square preserves gear, and hex works when the board itself feels tactical.',
          checklist: ['Circle for face-first portraits.', 'Square for grid alignment.', 'Hex for counters and regional logic.'],
        },
        {
          title: 'Export one fast version and one keeper version',
          description: 'Start with 512 for table use. Once the design language works, keep a sharper 1024 archive export for reuse.',
        },
      ],
    },
    'how-to-make-foundry-vtt-tokens': {
      updatedAt: '2026-03-12',
      readTime: '7 min read',
      audience: ['Foundry GMs curating long campaigns', 'Worldbuilders maintaining token consistency', 'Users leaning on lighting-heavy scenes'],
      checklist: [
        'Define one visual rule set before building actor portraits.',
        'Check transparency on both bright and dark scenes.',
        'Separate roles by frame language, not by random ornament.',
      ],
      pitfalls: [
        'Using a different border family for every actor.',
        'Ignoring scene lighting and only reviewing on a neutral background.',
        'Treating Foundry tokens like social avatars instead of scene assets.',
      ],
      faq: [
        {
          question: 'Is 1024 overkill for Foundry?',
          answer: 'Not always. If the campaign zooms in often or you plan to reuse the portraits across scenes, 1024 is a reasonable long-term default.',
        },
        {
          question: 'Should allies and monsters share the same frame?',
          answer: 'Usually no. Role separation is one of the fastest readability wins in Foundry combat scenes.',
        },
      ],
      steps: [
        {
          title: 'Set the campaign language first',
          description: 'Choose your mask family, frame density, and export baseline before making dozens of tokens. Foundry benefits from consistency more than novelty.',
          checklist: ['Limit yourself to one or two border families.', 'Keep export size stable across actor groups.'],
        },
        {
          title: 'Preview transparency against real scenes',
          description: 'Lighting, fog, and map contrast change how token edges feel. Test on cave scenes, bright interiors, and mixed-color environments.',
          checklist: ['Review dark scene edges.', 'Review bright tavern or parchment scenes.', 'Lower overlay opacity if the edge blooms.'],
        },
        {
          title: 'Encode role with frame logic',
          description: 'Players, allies, elites, and monsters should read as different classes of object before the user even checks the nameplate.',
        },
      ],
    },
    'how-to-make-roll20-tokens': {
      updatedAt: '2026-03-10',
      readTime: '5 min read',
      audience: ['Roll20 tables with busy battlemaps', 'GMs managing large combat rosters', 'Users prioritizing speed over ornament'],
      checklist: [
        'Crop tighter than the artwork initially feels comfortable with.',
        'Use border contrast to separate roles at a glance.',
        'Keep file sizes disciplined so asset folders stay workable.',
      ],
      pitfalls: [
        'Leaving too much empty background inside the token.',
        'Relying on tiny decorative details that disappear during live combat.',
        'Exporting oversized files for throwaway encounter tokens.',
      ],
      faq: [
        {
          question: 'Do Roll20 tokens need heavy frames to be readable?',
          answer: 'No. They need good crop discipline and contrast more than heavy decoration.',
        },
        {
          question: 'What should I optimize first for Roll20?',
          answer: 'Optimize for live play readability. Once that works, you can worry about cleaner archives or marketplace-ready exports.',
        },
      ],
      steps: [
        {
          title: 'Crop with combat density in mind',
          description: 'Assume the token will appear beside many others. Favor face or creature-head readability over scenic completeness.',
        },
        {
          title: 'Use restrained but distinct borders',
          description: 'Border language should help identify role quickly, not become the main subject of the token.',
          checklist: ['Heroes: brighter metal or gold.', 'Hostiles: darker metal or bone.', 'NPCs: lower-noise wood or thin ring.'],
        },
        {
          title: 'Only archive what deserves archiving',
          description: 'Most live Roll20 assets are fine at 512. Save 1024 or larger exports for portraits you will actually reuse.',
        },
      ],
    },
    'token-size-and-resolution': {
      updatedAt: '2026-03-08',
      readTime: '4 min read',
      audience: ['Users deciding between speed and archive quality', 'Artists building reusable packs', 'GMs balancing sharpness against file weight'],
      checklist: [
        'Use 512 as the baseline until a real need appears.',
        'Promote to 1024 when reuse, transparency, or zoom quality matter.',
        'Reserve 2048 for premium or print-adjacent output.',
      ],
      pitfalls: [
        'Assuming bigger export automatically means better token design.',
        'Building every encounter asset at archive size.',
        'Ignoring how the final table actually views the token.',
      ],
      faq: [
        {
          question: 'Should players and monsters share the same export size?',
          answer: 'Usually yes within one campaign. Consistent resolution is easier to manage unless a token has a special use case.',
        },
        {
          question: 'When is 2048 justified?',
          answer: 'When the file has a long shelf life: premium packs, polished archives, or assets intended for multiple downstream uses.',
        },
      ],
      steps: [
        {
          title: 'Start with the live table',
          description: 'If the asset is primarily for active play, 512 is usually enough. Begin there before inventing future needs.',
        },
        {
          title: 'Upgrade resolution for reuse, not ego',
          description: '1024 pays off when you need cleaner transparency, reuse across many campaigns, or a more premium library.',
        },
        {
          title: 'Treat 2048 like a special production tier',
          description: 'Only keep giant exports for assets that truly need longevity, resale polish, or print-adjacent flexibility.',
        },
      ],
    },
  },
  zh: {
    'how-to-make-vtt-tokens': {
      updatedAt: '2026-03-11',
      readTime: '阅读约 6 分钟',
      audience: ['需要长期复用角色 token 的玩家', '要批量准备遭遇包的 GM', '打算输出 VTT 资源包的画师'],
      checklist: [
        '先确认原图缩小后仍然能认出来。',
        '根据桌面场景决定裁切形状，而不是只看大图效果。',
        '先导出能直接上桌的版本，再考虑归档版。',
      ],
      pitfalls: [
        '把每张图都当成插画展示图，而不是游戏资产。',
        '还没确认可读性，就先堆边框和装饰。',
        '一开始就导大图，结果整套风格还没跑顺。',
      ],
      faq: [
        {
          question: '整套 VTT token 要不要统一边框家族？',
          answer: '通常要。一个战役里控制在一到两套边框家族，识别效率会明显高于每张都换风格。',
        },
        {
          question: '什么时候应该保留背景？',
          answer: '只有当背景本身就是身份信息的一部分时才值得保留。大多数情况下，地图可读性优先。',
        },
      ],
      steps: [
        {
          title: '先挑“缩小后还成立”的图',
          description: '把原图当成小尺寸游戏资产看，而不是完整插画。稳定光线和清晰轮廓比场景野心更重要。',
          checklist: ['先看小图是否还认得出来。', '如果背景抢戏，就先减掉背景干扰。'],
        },
        {
          title: '在知道桌面场景之后再选形状',
          description: '圆形不是自动正确。方形更适合保留装备，六边形更适合战术和区域感。',
          checklist: ['圆形适合脸部识别。', '方形适合网格与装备。', '六边形适合计数器与区域逻辑。'],
        },
        {
          title: '导出一版实战稿，再留一版长期稿',
          description: '先用 512 上桌。确认整套设计语言成立后，再留一份更干净的 1024 做长期复用。',
        },
      ],
    },
    'how-to-make-foundry-vtt-tokens': {
      updatedAt: '2026-03-12',
      readTime: '阅读约 7 分钟',
      audience: ['长期经营 Foundry 战役的 GM', '需要保持视觉一致性的世界构建者', '依赖灯光与地形层次的用户'],
      checklist: [
        '先定一套视觉规则，再批量做 Actor 头像。',
        '在亮图和暗图里都检查透明边缘。',
        '用边框语言区分角色类型，而不是随意堆装饰。',
      ],
      pitfalls: [
        '每个 Actor 都用完全不同的边框。',
        '只在中性背景看 token，不进真实场景测试。',
        '把 Foundry token 当社交头像做，而不是场景资产。',
      ],
      faq: [
        {
          question: 'Foundry 用 1024 会不会太大？',
          answer: '不一定。如果战役常常放大场景，或者你打算长期复用这些头像，1024 是合理的长期默认值。',
        },
        {
          question: '友军和怪物要不要共用同一套边框？',
          answer: '通常不要。角色分类越清楚，Foundry 战斗场景越容易扫视。',
        },
      ],
      steps: [
        {
          title: '先定战役的视觉规则',
          description: '在做几十张 token 之前，先确定遮罩、边框密度和导出尺寸。Foundry 更吃一致性，不吃“每张都不同”。',
          checklist: ['边框家族控制在一到两套内。', '导出尺寸在同一角色类别内保持一致。'],
        },
        {
          title: '把透明边缘放进真实场景测试',
          description: '灯光、雾效、地图明暗会直接改变边缘感受。一定要在地城、酒馆、低对比和高对比地图里都看一遍。',
          checklist: ['检查暗场景边缘。', '检查亮场景边缘。', '如果边缘发灰，就继续压低叠加层透明度。'],
        },
        {
          title: '用边框区分战斗角色',
          description: '玩家、友军、精英怪和普通怪应该先从形象上被看成不同类别，再由名字补充识别。',
        },
      ],
    },
    'how-to-make-roll20-tokens': {
      updatedAt: '2026-03-10',
      readTime: '阅读约 5 分钟',
      audience: ['Roll20 拥挤战斗地图用户', '需要管理大量敌人的 GM', '优先追求实战效率的玩家'],
      checklist: [
        '裁切距离要比直觉更近。',
        '用边框对比区分角色类型。',
        '控制文件尺寸，不要让素材库失控。',
      ],
      pitfalls: [
        'token 内部空背景太多，主体太小。',
        '迷信微小装饰细节，但战斗时根本看不见。',
        '一堆一次性遭遇 token 也导超大尺寸。',
      ],
      faq: [
        {
          question: 'Roll20 token 一定要重边框才清楚吗？',
          answer: '不一定。真正重要的是构图克制和对比度，而不是边框越重越好。',
        },
        {
          question: 'Roll20 里最先该优化什么？',
          answer: '先优化实战可读性。打得顺手之后，再考虑更高分辨率归档或商用资源级输出。',
        },
      ],
      steps: [
        {
          title: '按拥挤战斗图来裁切',
          description: '默认它会和很多其他 token 一起出现，所以优先保证脸或怪物头在缩小时依然清楚。',
        },
        {
          title: '边框要克制，但角色要分得开',
          description: '边框存在的意义是帮助角色分类，不是抢占视觉中心。',
          checklist: ['英雄：亮金属或金色。', '敌对单位：深金属或骨质。', 'NPC：木质或细环。'],
        },
        {
          title: '只给值得长期保留的素材留高分辨率',
          description: '大多数 Roll20 实战素材 512 已经够用。只有会反复复用的角色，才需要再存更高规格。',
        },
      ],
    },
    'token-size-and-resolution': {
      updatedAt: '2026-03-08',
      readTime: '阅读约 4 分钟',
      audience: ['在速度和归档质量之间做选择的用户', '想做长期资源包的画师', '需要平衡清晰度和体积的 GM'],
      checklist: [
        '没有明确需求前，先把 512 当默认值。',
        '需要复用、透明边缘或高缩放时，再上 1024。',
        '2048 只留给高质量和长期场景。',
      ],
      pitfalls: [
        '以为分辨率越大，token 设计就一定越好。',
        '把每个遭遇战素材都按归档规格导出。',
        '只盯着参数，不看桌面里实际怎么看这些 token。',
      ],
      faq: [
        {
          question: '玩家和怪物要不要统一导出尺寸？',
          answer: '通常要。在一个战役里保持一致更好管理，除非某些特殊素材有明确例外。',
        },
        {
          question: '什么时候 2048 才真的有意义？',
          answer: '当素材有长生命周期，例如商用资源包、精细归档或未来要给多个场景复用时，2048 才值得保留。',
        },
      ],
      steps: [
        {
          title: '先从“当前桌面怎么用”出发',
          description: '如果主要用途是日常上桌，512 通常就够。先满足当前工作流，再讨论未来可能性。',
        },
        {
          title: '升级到 1024 的理由应该是“复用”',
          description: '1024 的价值在于透明边缘更干净、跨战役复用更从容，而不是单纯的参数满足感。',
        },
        {
          title: '把 2048 视为单独的制作层级',
          description: '只有真正需要长期保存、商用打磨或接近打印用途的素材，才值得保留这么大的版本。',
        },
      ],
    },
  },
};

const templatesHubModels: Record<SiteLocale, TemplatesHubModel> = {
  en: {
    updatedAt: '2026-03-12',
    eyebrow: 'Template hub',
    title: 'Choose the token format before you choose the border',
    description: 'This hub splits token pages by real use case: face-first portraits, grid-aligned markers, tactical counters, encounter monsters, and transparent asset packs.',
    intro:
      'Treat this directory like a decision board, not a flat list. Every page below is written to answer a different token-format question, so visitors can self-select the right shape and styling logic before they ever open the editor.',
    stats: [
      {
        label: 'Formats',
        value: '5 page models',
        description: 'Each template page now targets a distinct tabletop job instead of repeating the same shell.',
      },
      {
        label: 'Decisions',
        value: 'Shape first',
        description: 'The hub emphasizes board context, readability, and archive strategy before ornament.',
      },
      {
        label: 'Path',
        value: 'Compare -> choose -> launch',
        description: 'Visitors can contrast formats here, then jump into the editor with an appropriate preset.',
      },
    ],
    decisionGuidesTitle: 'Three fast filters before you click anything',
    decisionGuidesIntro:
      'The fastest way to reduce junk pages is to stop treating every format like a separate essay. Start with the user problem: what must survive reduction, how should the token behave on the board, and how visible should the frame be.',
    decisionGuides: [
      {
        id: 'survives-reduction',
        title: 'What information cannot be lost when the token gets small?',
        description:
          'If face recognition is the whole job, begin with the circular route. If shoulders, gear, and straight edges carry meaning, the square route should take priority.',
        slugs: ['circle-token-maker', 'square-token-maker'],
      },
      {
        id: 'board-behavior',
        title: 'Is this a portrait, or is it really a map object?',
        description:
          'Portrait-led tokens usually stay in circle or transparent workflows. If the object behaves more like a counter, region marker, or tactical unit, move to hex.',
        slugs: ['transparent-token-maker', 'hex-token-maker'],
      },
      {
        id: 'frame-presence',
        title: 'Do you want stronger presence, or less visual noise?',
        description:
          'Use monster framing when threat and enemy separation matter. Use transparent output when clean edges and board blending matter more than border drama.',
        slugs: ['monster-token-maker', 'transparent-token-maker'],
      },
    ],
    entryPointsTitle: 'Start from the job, not from the jargon',
    entryPointsIntro:
      'These five pages should not behave like equal SEO clones. Each lane below names one primary starting point, then shows the nearby fallback routes instead of pretending every format deserves the same answer.',
    entryPoints: [
      {
        id: 'portrait-cast',
        title: 'I need player or NPC portraits',
        description: 'Face recognition is the main job. The token should identify a person quickly, not explain the whole costume.',
        primarySlug: 'circle-token-maker',
        primaryReason:
          'Circle stays the default entry because it is the most reliable shape for readable faces on crowded battle maps.',
        alternatives: [
          {
            slug: 'transparent-token-maker',
            reason: 'Switch when you want the portrait to sit more lightly on the map and decorative framing becomes noise.',
          },
          {
            slug: 'square-token-maker',
            reason: 'Switch when shoulder room, weapons, or UI alignment matter more than the classic portrait ring.',
          },
        ],
        caution: 'Do not stay in the portrait lane if the image only works because of side detail, equipment, or map alignment.',
      },
      {
        id: 'grid-markers',
        title: 'I need grid-aligned map markers',
        description: 'The token has to cooperate with square maps, labels, or structured UI blocks instead of floating like a portrait badge.',
        primarySlug: 'square-token-maker',
        primaryReason:
          'Square is the cleanest starting point when edge detail and grid alignment both carry information value.',
        alternatives: [
          {
            slug: 'hex-token-maker',
            reason: 'Use this if the board is really about tactical counters or area logic rather than strict square-grid alignment.',
          },
          {
            slug: 'circle-token-maker',
            reason: 'Fallback here only when the supposed marker is still mostly a face-recognition token.',
          },
        ],
        caution: 'Do not use square as a default just because it feels more “complete”. It usually adds noise when the real task is fast portrait recognition.',
      },
      {
        id: 'tactical-counters',
        title: 'I need tactical counters or region markers',
        description: 'This is about unit language, ownership, and board scanning speed, not about making a portrait look premium.',
        primarySlug: 'hex-token-maker',
        primaryReason:
          'Hex works best when the token behaves like a counter, a scouting marker, or a map object with tactical meaning.',
        alternatives: [
          {
            slug: 'square-token-maker',
            reason: 'Choose this when the board is still square-grid native and rectangular alignment matters more than counter language.',
          },
          {
            slug: 'monster-token-maker',
            reason: 'Choose this when the unit must feel hostile and dramatic rather than merely classified.',
          },
        ],
        caution: 'Do not force tactical shapes onto art that only reads as a face. The format will fight the source image.',
      },
      {
        id: 'encounter-pack',
        title: 'I need monster encounter tokens',
        description: 'The goal is threat separation, group readability, and hostile visual language across a whole encounter pack.',
        primarySlug: 'monster-token-maker',
        primaryReason:
          'Monster is not another shape choice. It is the dedicated high-contrast route for hostile units that must jump off noisy maps.',
        alternatives: [
          {
            slug: 'circle-token-maker',
            reason: 'Fallback here if the “monster” is really just a named portrait token and not an encounter-pressure piece.',
          },
          {
            slug: 'transparent-token-maker',
            reason: 'Fallback here if clean map blending matters more than aggressive border language.',
          },
        ],
        caution: 'Do not send friendly NPCs or player characters into the monster lane just to make them feel dramatic.',
      },
      {
        id: 'clean-assets',
        title: 'I need clean transparent PNG assets',
        description: 'The export should stay reusable across many VTT scenes, lighting setups, and background colors.',
        primarySlug: 'transparent-token-maker',
        primaryReason:
          'Transparent is the best first choice when edge quality, low border presence, and cross-map reuse matter more than decorative identity.',
        alternatives: [
          {
            slug: 'circle-token-maker',
            reason: 'Use this when you still need a classic portrait frame to help recognition.',
          },
          {
            slug: 'square-token-maker',
            reason: 'Use this when the asset has to align to grid-native layouts instead of blending softly into the map.',
          },
        ],
        caution: 'Do not pick the transparent lane if your workflow depends on border language to encode allegiance, role, or threat level.',
      },
    ],
    categories: [
      {
        id: 'portrait-first',
        title: 'Portrait-first formats',
        description: 'Built for players, NPCs, and named characters where face recognition carries the experience.',
        narrative: 'These pages prioritize identity and emotional readability before map logic.',
        slugs: ['circle-token-maker', 'transparent-token-maker'],
      },
      {
        id: 'board-native',
        title: 'Board-native markers',
        description: 'Structured formats that cooperate with grids, tactical overlays, and region maps.',
        narrative: 'Pick these when the token behaves more like a counter, room marker, or interface object.',
        slugs: ['square-token-maker', 'hex-token-maker'],
      },
      {
        id: 'encounter-pressure',
        title: 'Encounter pressure',
        description: 'Hostile units that need strong silhouette, threat, and quick separation from the map.',
        narrative: 'This lane is for GMs building readable monster libraries rather than elegant portrait galleries.',
        slugs: ['monster-token-maker'],
      },
    ],
    comparisonTitle: 'What changes when the format changes',
    comparisonDescription: 'The point is not cosmetic variation. Shape choice changes crop discipline, border density, export size, and how the token behaves in live play.',
  },
  zh: {
    updatedAt: '2026-03-12',
    eyebrow: '模板中枢',
    title: '先决定 token 类型，再决定边框风格',
    description: '这个页面不再只是模板列表，而是按真实桌面用途拆开：头像型、方格型、战术计数器型、怪物型、透明资源型。',
    intro:
      '把这里当作决策板，而不是卡片墙。每个模板页都回答不同的问题，让用户先判断自己需要哪一种 token 逻辑，再进入编辑器。',
    stats: [
      {
        label: '格式',
        value: '5 种页面模型',
        description: '每个模板页都面向不同桌面任务，不再只是在同一壳层里换文案。',
      },
      {
        label: '判断顺序',
        value: '先形状后装饰',
        description: '先想地图环境、识别方式和归档策略，再想边框是否华丽。',
      },
      {
        label: '路径',
        value: '对比 -> 选择 -> 打开',
        description: '用户先在这里比较，再带着正确预设进入编辑器。',
      },
    ],
    decisionGuidesTitle: '先回答 3 个问题，再决定点哪页',
    decisionGuidesIntro:
      '想摆脱垃圾模板页，先别把每个格式都写成一篇差不多的散文。用户真正要判断的是三件事：缩小后什么信息不能丢、token 在地图上扮演什么角色、边框到底该强还是该弱。',
    decisionGuides: [
      {
        id: 'survives-reduction',
        title: '缩小后最不能丢掉的是什么？',
        description:
          '如果最不能丢的是脸部识别，先从圆形开始。如果最不能丢的是肩部、武器、装备和直边结构，就优先看方形。',
        slugs: ['circle-token-maker', 'square-token-maker'],
      },
      {
        id: 'board-behavior',
        title: '它是头像，还是地图元素？',
        description:
          '如果本质上还是角色头像，就留在圆形或透明背景。如果它更像计数器、区域标记或战术单位，就转去六边形。',
        slugs: ['transparent-token-maker', 'hex-token-maker'],
      },
      {
        id: 'frame-presence',
        title: '你需要更强存在感，还是更低噪声？',
        description:
          '如果重点是敌对威压和快速分组识别，就看怪物页。如果重点是干净边缘和地图融合，就看透明背景页。',
        slugs: ['monster-token-maker', 'transparent-token-maker'],
      },
    ],
    entryPointsTitle: '按任务进入，不按术语进入',
    entryPointsIntro:
      '下面不是五个平级名词，而是五条明确入口。每条入口只给一个首选模板，其他模板降级为替代方案，避免用户在一堆长得差不多的页面里反复横跳。',
    entryPoints: [
      {
        id: 'portrait-cast',
        title: '我要做角色 / NPC 头像',
        description: '核心任务是缩小后仍能快速认脸，而不是解释完整服装或背景叙事。',
        primarySlug: 'circle-token-maker',
        primaryReason: '圆形依然是最稳的默认入口，因为它最稳定地服务“缩小后认出是谁”这件事。',
        alternatives: [
          {
            slug: 'transparent-token-maker',
            reason: '如果你已经不需要传统边框语言，而更在意透明边缘和地图融合，就切到透明背景。',
          },
          {
            slug: 'square-token-maker',
            reason: '如果人物价值主要在肩部、武器、装备或 UI 对齐，而不是纯脸部识别，就切到方形。',
          },
        ],
        caution: '如果图的价值主要来自边缘细节、装备信息或网格对齐，就不要硬留在头像入口里。',
      },
      {
        id: 'grid-markers',
        title: '我要做方格地图标记',
        description: 'token 需要和方格地图、房间标签或结构化 UI 一起工作，而不是像头像徽章那样浮在地图上。',
        primarySlug: 'square-token-maker',
        primaryReason: '方形是首选，因为它同时解决边缘信息保留和网格对齐两件事。',
        alternatives: [
          {
            slug: 'hex-token-maker',
            reason: '如果地图逻辑更偏战棋、区域控制或计数器语言，而不是标准方格对齐，就改看六边形。',
          },
          {
            slug: 'circle-token-maker',
            reason: '如果这个所谓标记本质上还是头像识别，只是偶尔落在网格里，就回到圆形。',
          },
        ],
        caution: '不要因为方形看起来“更完整”就默认选它。只要核心任务还是快速认脸，方形往往是在加噪声。',
      },
      {
        id: 'tactical-counters',
        title: '我要做战棋 / 区域控制计数器',
        description: '重点是单位语言、阵营归属和地图扫视效率，不是把头像做得更漂亮。',
        primarySlug: 'hex-token-maker',
        primaryReason: '六边形最适合扮演计数器、侦查标记和区域推进单位这类战术对象。',
        alternatives: [
          {
            slug: 'square-token-maker',
            reason: '如果底层地图仍然是标准方格，而且你更在意矩形对齐而不是战棋感，就改看方形。',
          },
          {
            slug: 'monster-token-maker',
            reason: '如果这个单位的重点不是被分类，而是必须看起来敌意强、压迫感高，就改看怪物。',
          },
        ],
        caution: '不要把只能靠脸成立的素材强行塞进战术形状里，格式会直接和原图打架。',
      },
      {
        id: 'encounter-pack',
        title: '我要做怪物遭遇包',
        description: '目标是敌对识别、成组可读性和统一威压语言，而不是单张头像的精致度。',
        primarySlug: 'monster-token-maker',
        primaryReason: '怪物页不是另一种形状，而是一条专门给敌对单位准备的高对比工作流。',
        alternatives: [
          {
            slug: 'circle-token-maker',
            reason: '如果所谓怪物其实更像一张命名头像，而不是遭遇战里的敌对单位，就回到圆形。',
          },
          {
            slug: 'transparent-token-maker',
            reason: '如果你的重点是地图融合而不是敌意边框语言，就改看透明背景。',
          },
        ],
        caution: '不要为了“更有戏剧感”就把玩家角色或友方 NPC 送进怪物入口。',
      },
      {
        id: 'clean-assets',
        title: '我要做干净的透明 PNG 素材',
        description: '导出结果要能跨多个 VTT、地图底色和灯光场景复用，不想被重边框绑死。',
        primarySlug: 'transparent-token-maker',
        primaryReason: '透明背景是首选，因为它优先解决边缘质量、低噪声和跨地图复用。',
        alternatives: [
          {
            slug: 'circle-token-maker',
            reason: '如果你仍然需要传统头像边框来增强识别，再回到圆形。',
          },
          {
            slug: 'square-token-maker',
            reason: '如果这个素材最终还是要对齐方格地图或结构化 UI，就改看方形。',
          },
        ],
        caution: '如果你的工作流需要靠边框编码阵营、职业或威胁等级，透明入口会削弱信息表达。',
      },
    ],
    categories: [
      {
        id: 'portrait-first',
        title: '头像优先型',
        description: '适合玩家、NPC、命名角色，重点是脸部识别和情绪表达。',
        narrative: '这一组优先解决“谁是谁”，而不是“地图结构如何对齐”。',
        slugs: ['circle-token-maker', 'transparent-token-maker'],
      },
      {
        id: 'board-native',
        title: '棋盘 / 地图原生型',
        description: '更适合方格地图、战术覆盖层和区域控制标记。',
        narrative: '当 token 更像计数器、房间牌或地图元素时，就应该优先考虑这组。',
        slugs: ['square-token-maker', 'hex-token-maker'],
      },
      {
        id: 'encounter-pressure',
        title: '遭遇压迫型',
        description: '适合怪物库和敌对单位，重点是威胁感、对比度和群组可读性。',
        narrative: '这条路径服务的是 GM 遭遇准备，不是精致头像画廊。',
        slugs: ['monster-token-maker'],
      },
    ],
    comparisonTitle: '一旦换了格式，哪些决策会跟着变',
    comparisonDescription: '这不是“换个外观”这么简单。形状会直接影响裁切方式、边框密度、导出尺寸和实战可读性。',
  },
};

const guidesHubModels: Record<SiteLocale, GuidesHubModel> = {
  en: {
    updatedAt: '2026-03-12',
    eyebrow: 'Blog',
    title: 'Token Maker blog for workflow, platform, and export decisions',
    description: 'These posts are written as reading-first assets: workflow explanations, platform-specific rules, and resolution tradeoffs that deserve full article structure.',
    intro:
      'The editor handles execution. The blog handles judgment. Each post below exists to answer a different decision problem, so visitors can move from general workflow to platform specifics without landing on a stack of lookalike pages.',
    stats: [
      {
        label: 'Tracks',
        value: '3 learning lanes',
        description: 'General VTT workflow, platform-specific tuning, and export strategy are separated instead of mixed together.',
      },
      {
        label: 'Reading mode',
        value: 'Checklist-led',
        description: 'Every guide now exposes steps, pitfalls, and review questions rather than a generic summary block.',
      },
      {
        label: 'Outcome',
        value: 'Fewer wrong exports',
        description: 'The pages are framed to reduce crop, border, and resolution mistakes before the user enters the editor.',
      },
    ],
    tracks: [
      {
        id: 'foundation',
        title: 'Workflow foundation',
        description: 'Use these when you are still deciding how to build readable tokens at all.',
        outcome: 'Understand crop, shape, and export logic before optimizing for a platform.',
        slugs: ['how-to-make-vtt-tokens'],
      },
      {
        id: 'platforms',
        title: 'Platform tuning',
        description: 'Specific advice for the two environments most likely to punish sloppy token preparation.',
        outcome: 'Adjust border language and transparency based on how the target VTT actually renders scenes.',
        slugs: ['how-to-make-foundry-vtt-tokens', 'how-to-make-roll20-tokens'],
      },
      {
        id: 'export-strategy',
        title: 'Export strategy',
        description: 'File size and resolution rules for deciding what should stay lightweight and what deserves archive treatment.',
        outcome: 'Avoid oversizing everything while still preserving high-value assets.',
        slugs: ['token-size-and-resolution'],
      },
    ],
    timelineTitle: 'Recommended reading order',
    timeline: [
      {
        title: 'Start with the generic VTT workflow',
        description: 'It sets the shared vocabulary: crop discipline, shape choice, and first-pass export habits.',
      },
      {
        title: 'Branch to Foundry or Roll20 only if your table needs it',
        description: 'Platform-specific advice is most useful once you already know how your token family should look.',
      },
      {
        title: 'Finish with export sizing',
        description: 'Resolution guidance matters more after you know which assets deserve long-term retention.',
      },
    ],
  },
  zh: {
    updatedAt: '2026-03-12',
    eyebrow: '博客',
    title: '把编辑器不该隐藏的判断逻辑写进真正可持续发布的博客',
    description: '这些页面不再是模板式说明块，而是阅读优先的文章页：讲流程、讲平台差异、讲分辨率取舍。',
    intro:
      '编辑器负责执行，博客负责判断。每篇文章都对应一类决策问题，让用户从通用工作流一路走到平台细节，而不是落进一堆长得一样的页面里。',
    stats: [
      {
        label: '路径',
        value: '3 条学习线',
        description: '通用流程、平台适配、导出策略被明确拆开，不再混成一页里的几个卡片。',
      },
      {
        label: '阅读方式',
        value: '清单驱动',
        description: '每篇指南都突出步骤、误区和复查点，而不是统一摘要块。',
      },
      {
        label: '目标',
        value: '减少错误导出',
        description: '用户能在进入编辑器之前先避免裁切、边框和分辨率上的常见错误。',
      },
    ],
    tracks: [
      {
        id: 'foundation',
        title: '工作流基础',
        description: '当你还没想清楚怎样才算“可读 token”时，先看这一组。',
        outcome: '先建立裁切、形状和导出逻辑，再谈平台适配。',
        slugs: ['how-to-make-vtt-tokens'],
      },
      {
        id: 'platforms',
        title: '平台适配',
        description: '针对最容易暴露 token 问题的两个平台，给出具体调整建议。',
        outcome: '根据目标 VTT 的场景渲染方式，调整边框语言和透明处理。',
        slugs: ['how-to-make-foundry-vtt-tokens', 'how-to-make-roll20-tokens'],
      },
      {
        id: 'export-strategy',
        title: '导出策略',
        description: '处理文件尺寸和分辨率，决定哪些素材该轻、哪些值得长期保留。',
        outcome: '避免什么都导超大，同时保住真正高价值素材的寿命。',
        slugs: ['token-size-and-resolution'],
      },
    ],
    timelineTitle: '推荐阅读顺序',
    timeline: [
      {
        title: '先看通用 VTT 工作流',
        description: '先建立裁切纪律、形状判断和第一轮导出的共同语言。',
      },
      {
        title: '如果目标平台明确，再分支看 Foundry 或 Roll20',
        description: '平台建议要建立在你已经知道整套 token 应该长什么样的前提上。',
      },
      {
        title: '最后再看导出尺寸',
        description: '只有当你已经确认哪些素材值得长期保留时，分辨率策略才真正有意义。',
      },
    ],
  },
};

const faqDocModels: Record<SiteLocale, FaqDocModel> = {
  en: {
    updatedAt: '2026-03-17',
    eyebrow: 'FAQ',
    title: 'Five common questions about Token Maker',
    description: 'Find quick answers about workflow fit, image handling, styles, and export size.',
    intro:
      'Use this page when you want the short version first. Each section answers a practical question, then points you to the editor, templates, or a guide if you need more detail.',
    groups: [
      {
        id: 'fit',
        title: 'Start here',
        description: 'Confirm what the editor is for and whether the tabletop workflow matches your use case.',
        itemIndexes: [0, 2],
      },
      {
        id: 'control',
        title: 'Control and style',
        description: 'Know what stays local and how far you can push masks, borders, and campaign-specific styling.',
        itemIndexes: [1, 3],
      },
      {
        id: 'export',
        title: 'Export call',
        description: 'Pick a first-pass resolution without overbuilding every token.',
        itemIndexes: [4],
      },
    ],
    signals: [
      {
        title: 'What the tool is good at',
        description: 'Understand whether Token Maker matches the tabletop workflow you already use.',
      },
      {
        title: 'How local editing works',
        description: 'See what stays in the browser during the default crop-and-export flow.',
      },
      {
        title: 'What to export first',
        description: 'Pick a sensible PNG size without overbuilding every token from the start.',
      },
    ],
  },
  zh: {
    updatedAt: '2026-03-17',
    eyebrow: '常见问题',
    title: '关于 Token Maker 的五个常见问题',
    description: '集中回答工作流适配、图片处理、样式选择和导出尺寸这些高频问题。',
    intro:
      '想先看简洁版答案，就从这里开始。每一组问题都只回答实际使用中最常见的判断点，需要更深入时再继续去编辑器、模板页或博客。',
    groups: [
      {
        id: 'fit',
        title: '先确认适不适合',
        description: '先判断这个编辑器主要解决什么问题，以及你的桌面工作流是否匹配。',
        itemIndexes: [0, 2],
      },
      {
        id: 'control',
        title: '控制边界与样式空间',
        description: '弄清默认本地处理边界，以及形状、边框和遮罩能扩展到什么程度。',
        itemIndexes: [1, 3],
      },
      {
        id: 'export',
        title: '导出怎么拍板',
        description: '先选出一个够用的分辨率，不要一开始就把每张 token 都做得过重。',
        itemIndexes: [4],
      },
    ],
    signals: [
      {
        title: '这个工具适合做什么',
        description: '先判断 Token Maker 是否匹配你现在的桌面工作流。',
      },
      {
        title: '默认图片怎么处理',
        description: '了解正常裁切和导出流程里，图片会不会离开浏览器。',
      },
      {
        title: '先导出多大合适',
        description: '先选一个够用的 PNG 尺寸，不必一开始就把每张 token 都做得很重。',
      },
    ],
  },
};

const privacyDocModels: Record<SiteLocale, PrivacyDocModel> = {
  en: {
    updatedAt: '2026-03-17',
    eyebrow: 'Privacy',
    title: 'How Token Maker handles images by default',
    description: 'Learn how the default local-first workflow handles image editing, PNG export, and any future remote features.',
    intro:
      'In the normal browser workflow, portrait images do not need to be uploaded just to crop or export a token.',
    principles: [
      {
        title: 'Default editing stays local',
        description: 'If a portrait can stay in the browser for the normal workflow, the product should say so clearly and behave that way.',
      },
      {
        title: 'Remote features need upfront disclosure',
        description: 'If uploads, share links, or hosted storage are added later, the provider, retention window, and deletion behavior should be explained before launch.',
      },
      {
        title: 'Operational details belong here',
        description: 'Analytics, error tracking, and abuse controls should stay on this page so the editor can stay focused on making tokens.',
      },
    ],
    commitments: [
      'Image-handling expectations change.',
      'Remote upload or hosted storage is introduced.',
      'Analytics or other operational tooling changes.',
    ],
  },
  zh: {
    updatedAt: '2026-03-17',
    eyebrow: '隐私',
    title: 'Token Maker 默认如何处理图片',
    description: '这里说明默认本地优先工作流如何处理图片、PNG 导出，以及未来如果加入远程能力会怎样披露。',
    intro:
      '在正常的浏览器工作流里，裁切和导出 token 不需要先把角色图上传到远程存储。',
    principles: [
      {
        title: '默认编辑流程留在本地浏览器',
        description: '如果日常工作流可以让图片一直停留在浏览器里，就应该直接说清楚，并让实现和说明保持一致。',
      },
      {
        title: '新增远程能力会先说明',
        description: '如果以后加入上传、分享链接或托管存储，会在正式启用前说明服务商、保留时间和删除方式。',
      },
      {
        title: '运维相关信息集中写在这里',
        description: '统计、错误追踪和限流这类说明会留在这页，不会混进制作 token 的主界面里。',
      },
    ],
    commitments: [
      '图片处理方式发生变化时。',
      '加入远程上传或托管存储时。',
      '统计或其他运维方案调整时。',
    ],
  },
};

const staticPageLastModifiedByLocale: Record<
  SiteLocale,
  Record<'templates' | 'guides' | 'faq' | 'privacy', string>
> = {
  en: {
    templates: templatesHubModels.en.updatedAt,
    guides: guidesHubModels.en.updatedAt,
    faq: faqDocModels.en.updatedAt,
    privacy: privacyDocModels.en.updatedAt,
  },
  zh: {
    templates: templatesHubModels.zh.updatedAt,
    guides: guidesHubModels.zh.updatedAt,
    faq: faqDocModels.zh.updatedAt,
    privacy: privacyDocModels.zh.updatedAt,
  },
};

export function getTemplateDetailModel(locale: SiteLocale, slug: string): TemplateDetailModel | undefined {
  const page = getTemplatePage(locale, slug);
  const enhancement = templateEnhancementsByLocale[locale][slug];

  if (!page || !enhancement) {
    return undefined;
  }

  return {
    ...page,
    ...enhancement,
  };
}

export function getGuideDetailModel(locale: SiteLocale, slug: string): GuideDetailModel | undefined {
  const page = getGuidePage(locale, slug);
  const enhancement = guideEnhancementsByLocale[locale][slug];

  if (!page || !enhancement) {
    return undefined;
  }

  return {
    ...page,
    ...enhancement,
  };
}

export function getTemplatesHubModel(locale: SiteLocale) {
  return templatesHubModels[locale];
}

export function getGuidesHubModel(locale: SiteLocale) {
  return guidesHubModels[locale];
}

export function getFaqDocModel(locale: SiteLocale): FaqDocModel & { items: FaqItem[] } {
  return {
    ...faqDocModels[locale],
    items: getFaqItems(locale),
  };
}

export function getPrivacyDocModel(locale: SiteLocale): PrivacyDocModel & {
  sections: ReturnType<typeof getPrivacySections>;
} {
  return {
    ...privacyDocModels[locale],
    sections: getPrivacySections(locale),
  };
}

export function getStaticPageLastModified(
  locale: SiteLocale,
  page: 'templates' | 'guides' | 'faq' | 'privacy',
) {
  return staticPageLastModifiedByLocale[locale][page];
}

export function createTemplateDetailMetadata(locale: SiteLocale, slug: string): Metadata {
  const page = getTemplateDetailModel(locale, slug);

  if (!page) {
    return {
      title: locale === 'zh' ? '模板不存在' : 'Template not found',
    };
  }

  const siteConfig = getSiteConfig(locale);
  const path = getLocalizedPath(locale, `/templates/${page.slug}`);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path,
      languages: getLanguageAlternates(`/templates/${page.slug}`),
    },
    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      url: absoluteUrl(path),
      type: 'website',
      images: [
        {
          url: getSeoImageUrl(locale, 'template-detail', page.slug),
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      images: [getSeoImageUrl(locale, 'template-detail', page.slug)],
    },
  };
}

export function createGuideDetailMetadata(locale: SiteLocale, slug: string): Metadata {
  const page = getGuideDetailModel(locale, slug);

  if (!page) {
    return {
      title: locale === 'zh' ? '指南不存在' : 'Guide not found',
    };
  }

  const siteConfig = getSiteConfig(locale);
  const path = getLocalizedPath(locale, `/blog/${page.slug}`);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path,
      languages: getLanguageAlternates(`/blog/${page.slug}`),
    },
    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      url: absoluteUrl(path),
      type: 'article',
      modifiedTime: page.updatedAt,
      images: [
        {
          url: getSeoImageUrl(locale, 'guide-detail', page.slug),
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      images: [getSeoImageUrl(locale, 'guide-detail', page.slug)],
    },
  };
}

export function createCollectionMetadata(locale: SiteLocale, page: 'templates' | 'guides' | 'faq' | 'privacy'): Metadata {
  const copy = getCollectionPageCopy(locale)[page];
  const path = getLocalizedPath(locale, page === 'templates' ? '/templates' : page === 'guides' ? '/blog' : page === 'faq' ? '/faq' : '/privacy');
  const siteConfig = getSiteConfig(locale);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: path,
      languages: getLanguageAlternates(page === 'templates' ? '/templates' : page === 'guides' ? '/blog' : page === 'faq' ? '/faq' : '/privacy'),
    },
    openGraph: {
      title: `${copy.title} | ${siteConfig.name}`,
      description: copy.description,
      url: absoluteUrl(path),
      type: 'website',
      images: [
        {
          url: getSeoImageUrl(locale, page),
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${copy.title} | ${siteConfig.name}`,
      description: copy.description,
      images: [getSeoImageUrl(locale, page)],
    },
  };
}

export function buildBreadcrumbStructuredData(
  locale: SiteLocale,
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(getLocalizedPath(locale, item.path)),
    })),
  };
}

export function buildTemplatePageStructuredData(locale: SiteLocale, page: TemplateDetailModel) {
  const siteConfig = getSiteConfig(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: absoluteUrl(getLocalizedPath(locale, `/templates/${page.slug}`)),
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
    dateModified: page.updatedAt,
  };
}

export function buildGuidePageStructuredData(locale: SiteLocale, page: GuideDetailModel) {
  const siteConfig = getSiteConfig(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    url: absoluteUrl(getLocalizedPath(locale, `/blog/${page.slug}`)),
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    dateModified: page.updatedAt,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}

export function buildGuideFaqStructuredData(page: GuideDetailModel) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildCollectionStructuredData(
  locale: SiteLocale,
  path: '/templates' | '/blog' | '/faq' | '/privacy',
  name: string,
  description: string,
) {
  const siteConfig = getSiteConfig(locale);

  return {
    '@context': 'https://schema.org',
    '@type': path === '/faq' ? 'FAQPage' : path === '/privacy' ? 'WebPage' : 'CollectionPage',
    name,
    url: absoluteUrl(getLocalizedPath(locale, path)),
    description,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
  };
}

export function getAllTemplateDetailModels(locale: SiteLocale) {
  return getTemplatePages(locale)
    .map((page) => getTemplateDetailModel(locale, page.slug))
    .filter((page): page is TemplateDetailModel => Boolean(page));
}

export function getAllGuideDetailModels(locale: SiteLocale) {
  return getGuidePages(locale)
    .map((page) => getGuideDetailModel(locale, page.slug))
    .filter((page): page is GuideDetailModel => Boolean(page));
}
