// ============================================================
// 边框模板 — 数据驱动，新增边框只需追加一条配置
// ============================================================
import type { BorderLibraryMode, BorderTemplate } from '@/types/editor';

const TFF_BORDER_PACK: Array<{
  id: string;
  name: string;
  linkedMaskId?: string;
}> = [
  { id: 'tff-weathered-copper-ring', name: 'border.tff-weathered-copper-ring', linkedMaskId: 'circle' },
  { id: 'tff-gilded-ring', name: 'border.tff-gilded-ring', linkedMaskId: 'circle' },
  { id: 'tff-arcane-lightning-ring', name: 'border.tff-arcane-lightning-ring', linkedMaskId: 'circle' },
  { id: 'tff-gunmetal-ring', name: 'border.tff-gunmetal-ring', linkedMaskId: 'circle' },
  { id: 'tff-hex-ring', name: 'border.tff-hex-ring', linkedMaskId: 'hexagon' },
  { id: 'tff-solid-white-ring', name: 'border.tff-solid-white-ring', linkedMaskId: 'circle' },
  { id: 'tff-crescent-ring', name: 'border.tff-crescent-ring', linkedMaskId: 'circle' },
  { id: 'tff-orbit-ring', name: 'border.tff-orbit-ring', linkedMaskId: 'circle' },
  { id: 'tff-filigree-ring', name: 'border.tff-filigree-ring', linkedMaskId: 'circle' },
  { id: 'tff-braided-vine-ring', name: 'border.tff-braided-vine-ring', linkedMaskId: 'circle' },
  { id: 'tff-clover-square', name: 'border.tff-clover-square', linkedMaskId: 'square' },
  { id: 'tff-greek-key-ring', name: 'border.tff-greek-key-ring', linkedMaskId: 'circle' },
  { id: 'tff-compass-ring', name: 'border.tff-compass-ring', linkedMaskId: 'circle' },
  { id: 'tff-sun-spike-ring', name: 'border.tff-sun-spike-ring', linkedMaskId: 'circle' },
  { id: 'tff-rope-ring', name: 'border.tff-rope-ring', linkedMaskId: 'circle' },
  { id: 'tff-triangle-mosaic-ring', name: 'border.tff-triangle-mosaic-ring', linkedMaskId: 'circle' },
  { id: 'tff-layered-star-ring', name: 'border.tff-layered-star-ring', linkedMaskId: 'circle' },
  { id: 'tff-triangle-dash-ring', name: 'border.tff-triangle-dash-ring', linkedMaskId: 'circle' },
  { id: 'tff-star-polygon-ring', name: 'border.tff-star-polygon-ring', linkedMaskId: 'circle' },
  { id: 'tff-dotted-ring', name: 'border.tff-dotted-ring', linkedMaskId: 'circle' },
  { id: 'tff-sunburst-shield-ring', name: 'border.tff-sunburst-shield-ring', linkedMaskId: 'square' },
  { id: 'tff-laurel-ring', name: 'border.tff-laurel-ring', linkedMaskId: 'circle' },
  { id: 'tff-square-link-ring', name: 'border.tff-square-link-ring', linkedMaskId: 'circle' },
  { id: 'tff-diamond-square-ring', name: 'border.tff-diamond-square-ring', linkedMaskId: 'square' },
  { id: 'tff-silver-ring', name: 'border.tff-silver-ring', linkedMaskId: 'circle' },
  { id: 'tff-ouroboros-ring', name: 'border.tff-ouroboros-ring', linkedMaskId: 'circle' },
  { id: 'tff-stone-ring', name: 'border.tff-stone-ring', linkedMaskId: 'circle' },
  { id: 'tff-rough-ring', name: 'border.tff-rough-ring', linkedMaskId: 'circle' },
  { id: 'tff-distressed-ring', name: 'border.tff-distressed-ring', linkedMaskId: 'circle' },
];

const TFF_3D_RINGS = new Set([
  'tff-weathered-copper-ring',
  'tff-gilded-ring',
  'tff-arcane-lightning-ring',
  'tff-gunmetal-ring',
  'tff-ouroboros-ring',
  'tff-stone-ring',
  'tff-distressed-ring',
]);

const TFF_BORDER_TEMPLATES: BorderTemplate[] = TFF_BORDER_PACK.map((border) => ({
  id: border.id,
  name: border.name,
  type: 'image',
  linkedMaskId: border.linkedMaskId,
  imageUrl: `/borders/tff/${border.id}.webp`,
  thumbSrc: `/borders/tff/${border.id}.webp`,
  maskUrl: `/masks/tff/${border.id}.webp`,
  tintMode: TFF_3D_RINGS.has(border.id) ? 'screen' : 'solid',
}));

const PRESET_BORDER_COUNTS = {
  warrior: 28,
  mage: 30,
  rogue: 30,
  cleric: 30,
  ranger: 29,
  undead: 29,
  monster: 31,
} as const;
const PRESET_BORDER_ASSET_VERSION = 'alpha-20260531';
const OMITTED_PRESET_BORDER_NUMBERS: Partial<Record<keyof typeof PRESET_BORDER_COUNTS, readonly string[]>> = {
  rogue: ['06', '09'],
};

function padPresetBorderIndex(index: number) {
  return String(index).padStart(2, '0');
}

function getVersionedPresetBorderUrl(presetId: keyof typeof PRESET_BORDER_COUNTS, borderNumber: string) {
  return `/borders/${presetId}/${presetId}-${borderNumber}.webp?v=${PRESET_BORDER_ASSET_VERSION}`;
}

function getVersionedPresetBorderThumbUrl(presetId: keyof typeof PRESET_BORDER_COUNTS, borderNumber: string) {
  return `/borders/thumbs/${presetId}/${presetId}-${borderNumber}.webp?v=${PRESET_BORDER_ASSET_VERSION}`;
}

function createPresetBorderTemplates(presetId: keyof typeof PRESET_BORDER_COUNTS): BorderTemplate[] {
  const omittedBorderNumbers = new Set(OMITTED_PRESET_BORDER_NUMBERS[presetId] ?? []);

  return Array.from({ length: PRESET_BORDER_COUNTS[presetId] }, (_, index) => {
    const borderNumber = padPresetBorderIndex(index + 1);

    const presetBorder: BorderTemplate = {
      id: `${presetId}-border-${borderNumber}`,
      name: `border.${presetId}.${borderNumber}`,
      type: 'image',
      presetId,
      linkedMaskId: 'circle',
      imageUrl: getVersionedPresetBorderUrl(presetId, borderNumber),
      thumbSrc: getVersionedPresetBorderThumbUrl(presetId, borderNumber),
      depthStrength: 0.35,
    };

    return presetBorder;
  }).filter((border) => {
    const borderNumber = border.id.slice(-2);
    return !omittedBorderNumbers.has(borderNumber);
  });
}

const PRESET_BORDER_TEMPLATES: BorderTemplate[] = [
  ...createPresetBorderTemplates('warrior'),
  ...createPresetBorderTemplates('mage'),
  ...createPresetBorderTemplates('rogue'),
  ...createPresetBorderTemplates('cleric'),
  ...createPresetBorderTemplates('ranger'),
  ...createPresetBorderTemplates('undead'),
  ...createPresetBorderTemplates('monster'),
];

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
    thumbSrc: '/borders/thumbs/metalbarbarian352.webp',
  },
  {
    id: 'wood',
    name: 'border.wood',
    type: 'image',
    imageUrl: '/borders/wood295.webp',
    thumbSrc: '/borders/thumbs/wood295.webp',
  },
  {
    id: 'rocks',
    name: 'border.rocks',
    type: 'image',
    imageUrl: '/borders/rocks.webp',
    thumbSrc: '/borders/thumbs/rocks.webp',
  },
  {
    id: 'blueenergy',
    name: 'border.blueenergy',
    type: 'image',
    imageUrl: '/borders/blueenergy366.webp',
    thumbSrc: '/borders/thumbs/blueenergy366.webp',
  },
  {
    id: 'silverspikes',
    name: 'border.silverspikes',
    type: 'image',
    imageUrl: '/borders/silverspikes24n.webp',
    thumbSrc: '/borders/thumbs/silverspikes24n.webp',
  },
  {
    id: 'revgold',
    name: 'border.revgold',
    type: 'image',
    imageUrl: '/borders/10revgold.webp',
    thumbSrc: '/borders/thumbs/10revgold.webp',
  },
  {
    id: 'fire',
    name: 'border.fire',
    type: 'image',
    imageUrl: '/borders/fire833.webp',
    thumbSrc: '/borders/thumbs/fire833.webp',
    depthStrength: 0.35,
  },
  {
    id: 'ice',
    name: 'border.ice',
    type: 'image',
    imageUrl: '/borders/ice853.webp',
    thumbSrc: '/borders/thumbs/ice853.webp',
  },
  {
    id: 'steampunk',
    name: 'border.steampunk',
    type: 'image',
    imageUrl: '/borders/steampunk837.webp',
    thumbSrc: '/borders/thumbs/steampunk837.webp',
  },
  {
    id: 'bones',
    name: 'border.bones',
    type: 'image',
    imageUrl: '/borders/bones998.webp',
    thumbSrc: '/borders/thumbs/bones998.webp',
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
  {
    id: 'plain-thin-ring',
    name: 'border.plain-thin-ring',
    type: 'flat-ring',
    linkedMaskId: 'circle',
    innerRadius: 0.946,
    outerRadius: 1.0,
  },
  {
    id: 'plain-thick-ring',
    name: 'border.plain-thick-ring',
    type: 'flat-ring',
    linkedMaskId: 'circle',
    innerRadius: 0.89,
    outerRadius: 1.0,
  },
  {
    id: 'plain-super-thin-ring',
    name: 'border.plain-super-thin-ring',
    type: 'flat-ring',
    linkedMaskId: 'circle',
    innerRadius: 0.972,
    outerRadius: 1.0,
  },
  {
    id: 'plain-double-ring',
    name: 'border.plain-double-ring',
    type: 'flat-double-ring',
    linkedMaskId: 'circle',
    innerRadius: 0.89,
    strokeWidth: 0.03,
  },
  {
    id: 'plain-square-thin',
    name: 'border.plain-square-thin',
    type: 'flat-polygon',
    linkedMaskId: 'square',
    sides: 4,
    strokeWidth: 0.05,
  },
  {
    id: 'plain-square-thick',
    name: 'border.plain-square-thick',
    type: 'flat-polygon',
    linkedMaskId: 'square',
    sides: 4,
    strokeWidth: 0.095,
  },
  {
    id: 'plain-hexagon',
    name: 'border.plain-hexagon',
    type: 'flat-polygon',
    linkedMaskId: 'hexagon',
    sides: 6,
    strokeWidth: 0.06,
  },
  {
    id: 'plain-octagon',
    name: 'border.plain-octagon',
    type: 'flat-polygon',
    linkedMaskId: 'octagon',
    sides: 8,
    strokeWidth: 0.06,
  },
  {
    id: 'plain-decagon',
    name: 'border.plain-decagon',
    type: 'flat-polygon',
    linkedMaskId: 'decagon',
    sides: 10,
    strokeWidth: 0.055,
  },
  {
    id: 'plain-dodecagon',
    name: 'border.plain-dodecagon',
    type: 'flat-polygon',
    linkedMaskId: 'dodecagon',
    sides: 12,
    strokeWidth: 0.055,
  },
  ...TFF_BORDER_TEMPLATES,
  ...PRESET_BORDER_TEMPLATES,
];

const DEFAULT_BORDER_ID_SET = new Set([
  'none',
  'metalbarbarian',
  'wood',
  'rocks',
  'blueenergy',
  'silverspikes',
  'revgold',
  'fire',
  'ice',
  'steampunk',
  'bones',
  'thin-ring',
]);

const COMPETITOR_BORDER_ID_SET = new Set([
  'none',
  'plain-thin-ring',
  'plain-thick-ring',
  'plain-super-thin-ring',
  'plain-double-ring',
  'plain-square-thin',
  'plain-square-thick',
  'plain-hexagon',
  'plain-octagon',
  'plain-decagon',
  'plain-dodecagon',
  ...TFF_BORDER_PACK.map((border) => border.id),
]);

export const DEFAULT_BORDER_TEMPLATES = BORDER_TEMPLATES.filter((border) =>
  DEFAULT_BORDER_ID_SET.has(border.id)
);

export const COMPETITOR_BORDER_TEMPLATES = BORDER_TEMPLATES.filter((border) =>
  COMPETITOR_BORDER_ID_SET.has(border.id)
);

export const ORIGINAL_BORDER_TEMPLATES = [
  ...new Map(
    [...DEFAULT_BORDER_TEMPLATES, ...COMPETITOR_BORDER_TEMPLATES].map((border) => [border.id, border])
  ).values(),
];

function hasPresetBorderTemplates(presetId: string | null | undefined) {
  return Boolean(presetId && presetId in PRESET_BORDER_COUNTS);
}

export function getBorderById(id: string): BorderTemplate | undefined {
  return BORDER_TEMPLATES.find((b) => b.id === id);
}

export function getPresetBorderTemplates(presetId: string | null | undefined): BorderTemplate[] {
  if (!presetId) return [];

  return PRESET_BORDER_TEMPLATES.filter((border) => border.presetId === presetId);
}

export function getPresetIdForBorder(borderId: string): string | null {
  return getBorderById(borderId)?.presetId ?? null;
}

export function getVisibleBorderTemplates({
  activePresetId,
  selectedBorderId,
  borderLibraryMode,
}: {
  activePresetId: string | null;
  selectedBorderId: string;
  borderLibraryMode: BorderLibraryMode;
}): BorderTemplate[] {
  const visiblePresetId = activePresetId ?? getPresetIdForBorder(selectedBorderId);

  if (hasPresetBorderTemplates(visiblePresetId)) {
    return getPresetBorderTemplates(visiblePresetId);
  }

  if (visiblePresetId === 'other' || borderLibraryMode === 'competitor') {
    return ORIGINAL_BORDER_TEMPLATES;
  }

  return DEFAULT_BORDER_TEMPLATES;
}

export function isCompetitorBorderId(id: string): boolean {
  return COMPETITOR_BORDER_ID_SET.has(id);
}
