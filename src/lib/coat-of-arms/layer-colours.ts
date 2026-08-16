import { getCoatAsset } from './assets';
import { resolveFieldRegions } from './field-regions';
import type { CoatField, CoatLayer, OrdinaryLayer, ShieldLayer } from './types';

const defaultShieldOutline = { visible: true, color: '#1E293B', width: 1.5 } as const;

export function getEditableLayerColours(layer: CoatLayer): string[] {
  switch (layer.type) {
    case 'shield':
      return isEditableShieldLayer(layer) ? getShieldColours(layer.field) : [];
    case 'ordinary':
    case 'charge':
    case 'top':
      return isEditableVectorLayer(layer) ? getVectorLayerColours(layer) : [];
    case 'draw':
    case 'text':
      return [layer.color];
    case 'background':
    case 'image':
      return [];
  }
}

export function replaceEditableLayerColour(
  layer: CoatLayer,
  fromColor: string,
  toColor: string,
): CoatLayer {
  assertLayerColour(fromColor, 'source', layer.id);
  assertLayerColour(toColor, 'replacement', layer.id);
  if (layer.locked) throw new Error(`Coat layer is locked: ${layer.id}`);

  const editableColours = getEditableLayerColours(layer);
  if (editableColours.length === 0) {
    throw new Error(`Layer does not support editable colour replacement: ${layer.id}`);
  }
  if (!editableColours.some((color) => hasSameColour(color, fromColor))) {
    throw new Error(`Editable layer colour source not found: ${fromColor} on layer ${layer.id}`);
  }

  switch (layer.type) {
    case 'shield':
      return replaceShieldColour(layer, fromColor, toColor);
    case 'ordinary':
    case 'charge':
    case 'top':
      return replaceVectorLayerColour(layer, fromColor, toColor);
    case 'draw':
    case 'text':
      return { ...layer, color: toColor };
    case 'background':
    case 'image':
      throw new Error(`Layer does not support editable colour replacement: ${layer.id}`);
  }
}

function getShieldColours(field: CoatField): string[] {
  const renderedColours = field.regions === undefined
    ? getRenderedLegacyFieldColours(field)
    : resolveFieldRegions(field).flatMap((region) => getRenderedRegionColours(region.style.colors, region.style.pattern));
  for (const ornament of field.ornaments ?? []) {
    renderedColours.push(...(ornament.colors ?? [ornament.color]));
  }
  const outline = field.outline ?? defaultShieldOutline;
  if (outline.visible) renderedColours.push(outline.color);
  return getOrderedUniqueColours(renderedColours);
}

function getVectorLayerColours(layer: OrdinaryLayer | Extract<CoatLayer, { type: 'charge' | 'top' }>): string[] {
  const asset = getCoatAsset(layer.assetId);
  if (!('svgParts' in asset) || !asset.svgParts) return [layer.color];
  return getOrderedUniqueColours(asset.svgParts.map((part, index) => (
    layer.colorReplacements?.[part.sourceColor] ?? (index === 0 ? layer.color : part.sourceColor)
  )));
}

function isEditableShieldLayer(layer: ShieldLayer): boolean {
  const asset = getCoatAsset(layer.assetId);
  if (asset.kind !== 'shield') return false;
  return !asset.staticImageSrc || (layer.customMaskUploadId !== undefined && layer.customOutlinePath === undefined);
}

function isEditableVectorLayer(layer: OrdinaryLayer | Extract<CoatLayer, { type: 'charge' | 'top' }>): boolean {
  const asset = getCoatAsset(layer.assetId);
  if (asset.kind !== layer.type || !('svgPath' in asset) || typeof asset.svgPath !== 'string') return false;
  return !('rasterVariants' in asset && asset.rasterVariants !== undefined);
}

function getOrderedUniqueColours(colours: string[]): string[] {
  const seenColours = new Set<string>();
  return colours.filter((color) => {
    const canonicalColour = color.toUpperCase();
    if (seenColours.has(canonicalColour)) return false;
    seenColours.add(canonicalColour);
    return true;
  });
}

function replaceShieldColour(layer: ShieldLayer, fromColor: string, toColor: string): ShieldLayer {
  const replaceColour = (color: string) => (hasSameColour(color, fromColor) ? toColor : color);
  const resolvedRegions = layer.field.regions === undefined ? undefined : resolveFieldRegions(layer.field);
  let nextRegions = layer.field.regions;
  for (const region of resolvedRegions ?? []) {
    if (!getRenderedRegionColours(region.style.colors, region.style.pattern).some((color) => hasSameColour(color, fromColor))) {
      continue;
    }
    const existingRegionStyle = layer.field.regions?.[region.id];
    const regionStyleToUpdate = existingRegionStyle ?? region.style;
    nextRegions = {
      ...nextRegions,
      [region.id]: {
        ...regionStyleToUpdate,
        colors: replaceRenderedColours(
          regionStyleToUpdate.colors,
          getRegionColourSlotCount(regionStyleToUpdate.pattern),
          replaceColour,
        ),
      },
    };
  }
  const currentOutline = layer.field.outline ?? defaultShieldOutline;
  const nextOutline = currentOutline.visible && hasSameColour(currentOutline.color, fromColor)
    ? { ...currentOutline, color: toColor }
    : layer.field.outline;
  return {
    ...layer,
    field: {
      ...layer.field,
      ...(layer.field.regions === undefined ? {
        colors: replaceRenderedColours(layer.field.colors, getLegacyFieldColourSlotCount(layer.field), replaceColour),
      } : {}),
      ...(nextRegions ? { regions: nextRegions } : {}),
      ...(layer.field.ornaments ? {
        ornaments: layer.field.ornaments.map((ornament) => ({
          ...ornament,
          ...(ornament.colors
            ? { colors: ornament.colors.map(replaceColour) }
            : { color: replaceColour(ornament.color) }),
        })),
      } : {}),
      ...(nextOutline ? { outline: nextOutline } : {}),
    },
  };
}

function getRenderedLegacyFieldColours(field: CoatField): string[] {
  return field.colors.slice(0, getLegacyFieldColourSlotCount(field));
}

function getLegacyFieldColourSlotCount(field: CoatField): number {
  return field.division !== 'solid' || field.pattern !== 'solid' ? 2 : 1;
}

function getRenderedRegionColours(colors: string[], pattern: CoatField['pattern']): string[] {
  return colors.slice(0, getRegionColourSlotCount(pattern));
}

function getRegionColourSlotCount(pattern: CoatField['pattern']): number {
  return pattern === 'solid' ? 1 : 2;
}

function replaceRenderedColours(
  colors: string[],
  renderedColourSlotCount: number,
  replaceColour: (color: string) => string,
): string[] {
  return colors.map((color, index) => (index < renderedColourSlotCount ? replaceColour(color) : color));
}

function replaceVectorLayerColour(
  layer: OrdinaryLayer | Extract<CoatLayer, { type: 'charge' | 'top' }>,
  fromColor: string,
  toColor: string,
): OrdinaryLayer | Extract<CoatLayer, { type: 'charge' | 'top' }> {
  const asset = getCoatAsset(layer.assetId);
  if (!('svgParts' in asset) || !asset.svgParts) {
    return { ...layer, color: toColor };
  }

  let nextLayerColor = layer.color;
  const nextColorReplacements = { ...layer.colorReplacements };
  assertNoSharedFirstSourceConflict(layer, asset.svgParts, fromColor);
  for (const [index, part] of asset.svgParts.entries()) {
    const effectiveColour = layer.colorReplacements?.[part.sourceColor] ?? (index === 0 ? layer.color : part.sourceColor);
    if (!hasSameColour(effectiveColour, fromColor)) continue;
    if (part.sourceColor in nextColorReplacements) nextColorReplacements[part.sourceColor] = toColor;
    else if (index === 0) nextLayerColor = toColor;
    else nextColorReplacements[part.sourceColor] = toColor;
  }
  return {
    ...layer,
    color: nextLayerColor,
    ...(Object.keys(nextColorReplacements).length > 0 ? { colorReplacements: nextColorReplacements } : {}),
  };
}

function assertNoSharedFirstSourceConflict(
  layer: OrdinaryLayer | Extract<CoatLayer, { type: 'charge' | 'top' }>,
  svgParts: readonly { sourceColor: string }[],
  fromColor: string,
): void {
  const firstPart = svgParts[0];
  if (!firstPart || firstPart.sourceColor in (layer.colorReplacements ?? {})) return;
  if (hasSameColour(layer.color, fromColor)) return;
  const hasMatchingLaterPart = svgParts.slice(1).some((part) => (
    part.sourceColor === firstPart.sourceColor && hasSameColour(part.sourceColor, fromColor)
  ));
  if (hasMatchingLaterPart) {
    throw new Error(`Cannot replace multipart layer colour without changing first part: layer ${layer.id}, from ${fromColor}, source ${firstPart.sourceColor}`);
  }
}

function hasSameColour(leftColor: string, rightColor: string): boolean {
  return leftColor.toUpperCase() === rightColor.toUpperCase();
}

function assertLayerColour(value: unknown, label: string, layerId: string): asserts value is string {
  if (typeof value !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
    throw new Error(`Invalid ${label} colour for layer ${layerId}: ${String(value)}`);
  }
}
