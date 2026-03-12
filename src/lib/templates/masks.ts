// ============================================================
// 遮罩模板 — 用多边形边数定义裁切形状
// ============================================================
import type { MaskTemplate } from '@/types/editor';

export const MASK_TEMPLATES: MaskTemplate[] = [
  { id: 'circle', name: 'mask.circle', sides: 0 },
  { id: 'square', name: 'mask.square', sides: 4 },
  { id: 'hexagon', name: 'mask.hexagon', sides: 6 },
  { id: 'octagon', name: 'mask.octagon', sides: 8 },
  { id: 'decagon', name: 'mask.decagon', sides: 10 },
  { id: 'dodecagon', name: 'mask.dodecagon', sides: 12 },
];

export function getMaskById(id: string): MaskTemplate | undefined {
  return MASK_TEMPLATES.find((m) => m.id === id);
}
