// ============================================================
// 边框模板 — 数据驱动，新增边框只需追加一条配置
// ============================================================
import type { BorderTemplate } from '@/types/editor';

export const BORDER_TEMPLATES: BorderTemplate[] = [
  {
    id: 'none',
    name: 'border.none',
    type: 'none',
  },
  {
    id: 'metalbarbarian',
    name: 'border.metalbarbarian', // 需要在 i18n 配置对应名字，或默认展示
    type: 'image',
    imageUrl: '/borders/metalbarbarian352.webp',
  },
  {
    id: 'wood',
    name: 'border.wood',
    type: 'image',
    imageUrl: '/borders/wood295.webp',
  },
  {
    id: 'rocks',
    name: 'border.rocks',
    type: 'image',
    imageUrl: '/borders/rocks.webp',
  },
  {
    id: 'blueenergy',
    name: 'border.blueenergy',
    type: 'image',
    imageUrl: '/borders/blueenergy366.webp',
  },
  {
    id: 'silverspikes',
    name: 'border.silverspikes',
    type: 'image',
    imageUrl: '/borders/silverspikes24n.webp',
  },
  {
    id: 'revgold',
    name: 'border.revgold',
    type: 'image',
    imageUrl: '/borders/10revgold.webp',
  },
  {
    id: 'fire',
    name: 'border.fire',
    type: 'image',
    imageUrl: '/borders/fire833.webp',
  },
  {
    id: 'ice',
    name: 'border.ice',
    type: 'image',
    imageUrl: '/borders/ice853.webp',
  },
  {
    id: 'steampunk',
    name: 'border.steampunk',
    type: 'image',
    imageUrl: '/borders/steampunk837.webp',
  },
  {
    id: 'bones',
    name: 'border.bones',
    type: 'image',
    imageUrl: '/borders/bones998.webp',
  },
  // 保留一个程序的细环备用
  {
    id: 'thin-ring',
    name: 'border.thin-ring',
    type: 'ring',
    innerRadius: 0.94,
    outerRadius: 1.0,
    strokeWidth: 0.04,
  },
];

export function getBorderById(id: string): BorderTemplate | undefined {
  return BORDER_TEMPLATES.find((b) => b.id === id);
}
