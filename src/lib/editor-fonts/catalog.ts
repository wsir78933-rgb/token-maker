import {
  EDITOR_FONT_IDS,
  type EditorFontDefinition,
  type EditorFontId,
  type EditorFontLocale,
} from '@/types/editor-font';

export { EDITOR_FONT_IDS } from '@/types/editor-font';
export type {
  EditorFontDefinition,
  EditorFontId,
  EditorFontLocale,
} from '@/types/editor-font';

export const DEFAULT_EDITOR_FONT_ID: EditorFontId = 'system-sans';

const VARIABLE_FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const REGULAR_FONT_WEIGHTS = [400];

export const EDITOR_FONT_DEFINITIONS: readonly EditorFontDefinition[] = [
  {
    id: 'system-sans',
    family: 'System Sans',
    cssStack:
      'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    labels: {
      zh: '默认字体（系统无衬线）',
      en: 'Default (System Sans)',
    },
    supportedWeights: VARIABLE_FONT_WEIGHTS,
  },
  {
    id: 'noto-sans-sc',
    family: 'Noto Sans SC',
    cssStack: '"Noto Sans SC", sans-serif',
    labels: {
      zh: '思源黑体（Noto Sans SC）',
      en: 'Noto Sans SC',
    },
    filePath: '/fonts/editor/noto-sans-sc/NotoSansSC[wght].ttf',
    licensePath: '/fonts/editor/noto-sans-sc/OFL.txt',
    supportedWeights: VARIABLE_FONT_WEIGHTS,
  },
  {
    id: 'noto-serif-sc',
    family: 'Noto Serif SC',
    cssStack: '"Noto Serif SC", serif',
    labels: {
      zh: '思源宋体（Noto Serif SC）',
      en: 'Noto Serif SC',
    },
    filePath: '/fonts/editor/noto-serif-sc/NotoSerifSC[wght].ttf',
    licensePath: '/fonts/editor/noto-serif-sc/OFL.txt',
    supportedWeights: VARIABLE_FONT_WEIGHTS,
  },
  {
    id: 'lxgw-wenkai',
    family: 'LXGW WenKai',
    cssStack: '"LXGW WenKai", "Noto Serif SC", serif',
    labels: {
      zh: '霞鹜文楷（LXGW WenKai）',
      en: 'LXGW WenKai',
    },
    filePath: '/fonts/editor/lxgw-wenkai/LXGWWenKai-Regular.ttf',
    licensePath: '/fonts/editor/lxgw-wenkai/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
  {
    id: 'ma-shan-zheng',
    family: 'Ma Shan Zheng',
    cssStack: '"Ma Shan Zheng", "Noto Serif SC", serif',
    labels: {
      zh: '马善政毛笔楷书（Ma Shan Zheng）',
      en: 'Ma Shan Zheng',
    },
    filePath: '/fonts/editor/ma-shan-zheng/MaShanZheng-Regular.ttf',
    licensePath: '/fonts/editor/ma-shan-zheng/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
  {
    id: 'zcool-xiaowei',
    family: 'ZCOOL XiaoWei',
    cssStack: '"ZCOOL XiaoWei", "Noto Sans SC", sans-serif',
    labels: {
      zh: '站酷小薇 LOGO 体（ZCOOL XiaoWei）',
      en: 'ZCOOL XiaoWei',
    },
    filePath: '/fonts/editor/zcool-xiaowei/ZCOOLXiaoWei-Regular.ttf',
    licensePath: '/fonts/editor/zcool-xiaowei/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
  {
    id: 'zcool-kuaile',
    family: 'ZCOOL KuaiLe',
    cssStack: '"ZCOOL KuaiLe", "Noto Sans SC", sans-serif',
    labels: {
      zh: '站酷快乐体（ZCOOL KuaiLe）',
      en: 'ZCOOL KuaiLe',
    },
    filePath: '/fonts/editor/zcool-kuaile/ZCOOLKuaiLe-Regular.ttf',
    licensePath: '/fonts/editor/zcool-kuaile/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
  {
    id: 'zcool-qingke-huangyou',
    family: 'ZCOOL QingKe HuangYou',
    cssStack: '"ZCOOL QingKe HuangYou", "Noto Sans SC", sans-serif',
    labels: {
      zh: '站酷庆科黄油体（ZCOOL QingKe HuangYou）',
      en: 'ZCOOL QingKe HuangYou',
    },
    filePath:
      '/fonts/editor/zcool-qingke-huangyou/ZCOOLQingKeHuangYou-Regular.ttf',
    licensePath: '/fonts/editor/zcool-qingke-huangyou/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
  {
    id: 'zhi-mang-xing',
    family: 'Zhi Mang Xing',
    cssStack: '"Zhi Mang Xing", "Noto Serif SC", serif',
    labels: {
      zh: '志莽行书（Zhi Mang Xing）',
      en: 'Zhi Mang Xing',
    },
    filePath: '/fonts/editor/zhi-mang-xing/ZhiMangXing-Regular.ttf',
    licensePath: '/fonts/editor/zhi-mang-xing/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
  {
    id: 'long-cang',
    family: 'Long Cang',
    cssStack: '"Long Cang", "Noto Serif SC", serif',
    labels: {
      zh: '龙藏体（Long Cang）',
      en: 'Long Cang',
    },
    filePath: '/fonts/editor/long-cang/LongCang-Regular.ttf',
    licensePath: '/fonts/editor/long-cang/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
  {
    id: 'liu-jian-mao-cao',
    family: 'Liu Jian Mao Cao',
    cssStack: '"Liu Jian Mao Cao", "Noto Serif SC", serif',
    labels: {
      zh: '刘建毛草（Liu Jian Mao Cao）',
      en: 'Liu Jian Mao Cao',
    },
    filePath: '/fonts/editor/liu-jian-mao-cao/LiuJianMaoCao-Regular.ttf',
    licensePath: '/fonts/editor/liu-jian-mao-cao/OFL.txt',
    supportedWeights: REGULAR_FONT_WEIGHTS,
  },
];

const editorFontDefinitionById = new Map<EditorFontId, EditorFontDefinition>(
  EDITOR_FONT_DEFINITIONS.map((fontDefinition) => [fontDefinition.id, fontDefinition]),
);

export function resolveEditorFontId(value: unknown): EditorFontId {
  if (typeof value === 'string' && EDITOR_FONT_IDS.includes(value as EditorFontId)) {
    return value as EditorFontId;
  }

  return DEFAULT_EDITOR_FONT_ID;
}

export function getEditorFontDefinition(fontId: EditorFontId): EditorFontDefinition {
  const fontDefinition = editorFontDefinitionById.get(fontId);

  if (!fontDefinition) {
    throw new Error(`Unsupported editor font ID: ${fontId}`);
  }

  return fontDefinition;
}

export function getEditorFontLabel(fontId: EditorFontId, locale: EditorFontLocale): string {
  return getEditorFontDefinition(fontId).labels[locale];
}

export function getEditorFontCssStack(fontId: EditorFontId): string {
  return getEditorFontDefinition(fontId).cssStack;
}

export function resolveEditorFontWeight(fontId: EditorFontId, requestedWeight: number): number {
  const supportedWeights = getEditorFontDefinition(fontId).supportedWeights;

  if (supportedWeights.length === 1) {
    return supportedWeights[0];
  }

  const minimumWeight = supportedWeights[0];
  const maximumWeight = supportedWeights[supportedWeights.length - 1];

  return Math.min(Math.max(requestedWeight, minimumWeight), maximumWeight);
}

export function getEditorFontCanvasShorthand(
  fontId: EditorFontId,
  requestedWeight: number,
  fontSize: number,
): string {
  return `${resolveEditorFontWeight(fontId, requestedWeight)} ${fontSize}px ${getEditorFontCssStack(fontId)}`;
}
