// ============================================================
// Token Maker — Core Type Definitions
// ============================================================

/** 边框模板类型 */
export type BorderType =
  | 'none'
  | 'ring'
  | 'flat-ring'
  | 'flat-double-ring'
  | 'flat-polygon'
  | 'double-ring'
  | 'polygon'
  | 'spike'
  | 'abstract'
  | 'image';

/** 边框模板定义（数据驱动） */
export interface BorderTemplate {
  id: string;
  name: string;
  type: BorderType;
  /** 边框绑定的裁切形状；用于“边框即形状”的模式 */
  linkedMaskId?: string;
  /** 系统内置的边框专属遮罩图；用于竞品同款异形裁切 */
  maskUrl?: string;
  /** 多边形边数（polygon 类型时使用） */
  sides?: number;
  /** 内径比例 0-1（ring 类型时使用） */
  innerRadius?: number;
  /** 外径比例 0-1 */
  outerRadius?: number;
  /** 线宽比例 0-1 */
  strokeWidth?: number;
  /** 刺突数量（spike 类型时使用） */
  spikeCount?: number;
  /** 刺突深度比例 0-1（spike 类型时使用） */
  spikeDepth?: number;
  /** 自定义 SVG path（abstract 类型时使用） */
  svgPath?: string;
  /** 是否为用户上传的自定义边框 */
  isCustom?: boolean;
  /** 自定义边框图片 URL（用户上传时使用） */
  customImageUrl?: string;
  /** 系统内置的高清图片边框路径（type='image' 时使用） */
  imageUrl?: string;
  /** 系统内置的边框缩略图路径（边框选择面板使用） */
  thumbSrc?: string;
  /** 着色模式，solid (正片叠底)，metallic (基于HSL亮度提取)，screen (提亮高光) */
  tintMode?: 'solid' | 'metallic' | 'screen';
  /** 额外立体高光和阴影强度，1 为默认，0 为不追加立体效果 */
  depthStrength?: number;
  /** 这个边框归属的风格预设，用于按预设追加显示边框素材 */
  presetId?: string;
}

/** 遮罩模板定义 */
export interface MaskTemplate {
  id: string;
  name: string;
  /** 多边形边数，0 = 圆形，4 = 方形，6/8/10/12 = 多边形 */
  sides: number;
}

/** 文本框 */
export interface TextBox {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: 'left' | 'center' | 'right';
}

/** Overlay 预设 */
export interface OverlayPreset {
  id: string;
  name: string;
  opacity: number;
  color: string;
  /** 渐变类型 */
  gradient: 'radial' | 'linear' | 'none';
}

/** 风格预设 */
export interface StylePreset {
  id: string;
  name: string;
  icon: string;
  borderId: string;
  maskId: string;
  borderTint: string;
  borderOpacity: number;
  overlayTint: string;
  overlayOpacity: number;
}

export type BorderLibraryMode = 'default' | 'competitor';

/** 导出尺寸选项 */
export type ExportSize = 256 | 512 | 1024 | 2048;

/** 编辑器核心状态 */
export interface EditorState {
  // --- 图片 ---
  imageUrl: string | null;
  imageElement: HTMLImageElement | null;
  imageLoadRevision: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageScale: number;

  // --- 模板 ---
  selectedBorderId: string;
  selectedMaskId: string;
  customBorders: BorderTemplate[];
  borderLibraryMode: BorderLibraryMode;

  // --- 样式 ---
  borderTint: string;
  imageBorderTintEnabled: boolean;
  textColor: string;
  overlayTint: string;
  borderOpacity: number;
  overlayOpacity: number;

  // --- 文字 ---
  textBoxes: TextBox[];
  selectedTextId: string | null;
  isImageSelected: boolean;

  // --- 导出 ---
  exportSize: ExportSize;

  // --- 预设 ---
  activePresetId: string | null;

  // --- 渲染 ---
  renderRevision: number;
}

/** 编辑器 Actions */
export interface EditorActions {
  // 图片
  beginImageLoad: () => number;
  cancelImageLoad: () => void;
  setImage: (url: string, element: HTMLImageElement) => void;
  clearImage: () => void;
  setImageSelected: (selected: boolean) => void;
  setImageOffset: (x: number, y: number) => void;
  setImageScale: (scale: number) => void;
  resetPosition: () => void;

  // 模板
  setSelectedBorder: (id: string) => void;
  setSelectedMask: (id: string) => void;
  addCustomBorder: (template: BorderTemplate) => void;
  removeCustomBorder: (id: string) => void;
  setBorderLibraryMode: (mode: BorderLibraryMode) => void;

  // 样式
  setBorderTint: (color: string) => void;
  setTextColor: (color: string) => void;
  setOverlayTint: (color: string) => void;
  setBorderOpacity: (opacity: number) => void;
  setOverlayOpacity: (opacity: number) => void;

  // 文字
  addTextBox: (defaultContent: string) => void;
  removeTextBox: (id: string) => void;
  updateTextBox: (id: string, updates: Partial<TextBox>) => void;
  setSelectedText: (id: string | null) => void;

  // 导出
  setExportSize: (size: ExportSize) => void;

  // 预设
  applyPreset: (preset: StylePreset) => void;

  // 全局
  resetAll: () => void;
}

/** Store 类型 = 状态 + Actions */
export type EditorStore = EditorState & EditorActions;
