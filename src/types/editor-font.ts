export const EDITOR_FONT_IDS = [
  'system-sans',
  'noto-sans-sc',
  'noto-serif-sc',
  'lxgw-wenkai',
  'ma-shan-zheng',
  'zcool-xiaowei',
  'zcool-kuaile',
  'zcool-qingke-huangyou',
  'zhi-mang-xing',
  'long-cang',
  'liu-jian-mao-cao',
] as const;

export type EditorFontId = (typeof EDITOR_FONT_IDS)[number];

export type EditorFontLocale = 'zh' | 'en';

export interface EditorFontDefinition {
  id: EditorFontId;
  family: string;
  cssStack: string;
  labels: Record<EditorFontLocale, string>;
  filePath?: string;
  licensePath?: string;
  supportedWeights: readonly number[];
}
