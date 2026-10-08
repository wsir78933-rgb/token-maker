import { getTownAsset, getTownAssetVariant } from './catalog';
import { validateTownDocument } from './document';
import type {
  TownAsset,
  TownAssetVariant,
  TownDocument,
  TownLayer,
  TownLayerId,
  TownObject,
} from './types';

const TOWN_LAYER_ORDER: readonly TownLayerId[] = ['lower', 'middle', 'upper'];

export type TownAssetSources = Readonly<Record<string, string>>;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getVariantHref(variant: TownAssetVariant, assetSources: TownAssetSources): string {
  return assetSources[variant.svg] ?? variant.svg;
}

function getBackgroundHref(document: TownDocument, assetSources: TownAssetSources): string | null {
  if (!document.backgroundImageUrl) {
    return null;
  }

  return assetSources[document.backgroundImageUrl] ?? document.backgroundImageUrl;
}

function formatNumber(value: number): string {
  return String(value);
}

function getRotationTransform(object: TownObject): string {
  const centerX = object.x + object.width / 2;
  const centerY = object.y + object.height / 2;
  if (object.rotationDegrees === 0) {
    return '';
  }

  return ` transform="rotate(${formatNumber(object.rotationDegrees)} ${formatNumber(centerX)} ${formatNumber(centerY)})"`;
}

function renderImage(
  object: TownObject,
  asset: TownAsset,
  variant: TownAssetVariant,
  assetSources: TownAssetSources,
): string {
  const preserveAspectRatio = asset.resizeMode === 'regular' || asset.resizeMode === 'connector'
    ? 'xMidYMid meet'
    : 'none';
  const href = escapeXml(getVariantHref(variant, assetSources));
  return `<image data-town-asset-id="${escapeXml(asset.id)}" href="${href}" x="${formatNumber(object.x)}" y="${formatNumber(object.y)}" width="${formatNumber(object.width)}" height="${formatNumber(object.height)}" preserveAspectRatio="${preserveAspectRatio}"/>`;
}

function renderPatternObject(
  object: TownObject,
  asset: TownAsset,
  variant: TownAssetVariant,
  assetSources: TownAssetSources,
  patternIndex: number,
): string {
  const patternId = `town-pattern-${patternIndex}`;
  const href = escapeXml(getVariantHref(variant, assetSources));
  const patternWidth = formatNumber(asset.width);
  const patternHeight = formatNumber(asset.height);
  const pattern = `<defs><pattern id="${patternId}" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" x="0" y="0" width="${patternWidth}" height="${patternHeight}" patternTransform="translate(${formatNumber(object.x)} ${formatNumber(object.y)})"><image href="${href}" x="0" y="0" width="${patternWidth}" height="${patternHeight}" preserveAspectRatio="none"/></pattern></defs>`;
  const rectangle = `<rect data-town-asset-id="${escapeXml(asset.id)}" x="${formatNumber(object.x)}" y="${formatNumber(object.y)}" width="${formatNumber(object.width)}" height="${formatNumber(object.height)}" fill="url(#${patternId})"/>`;
  return pattern + rectangle;
}

function renderTownObject(
  object: TownObject,
  layerId: TownLayerId,
  assetSources: TownAssetSources,
  patternIndex: number,
): string {
  const asset = getTownAsset(object.assetId);
  const variant = getTownAssetVariant(object.assetId, object.material);
  const content = asset.resizeMode === 'line' || asset.resizeMode === 'tile'
    ? renderPatternObject(object, asset, variant, assetSources, patternIndex)
    : renderImage(object, asset, variant, assetSources);
  return `<g data-town-object-id="${escapeXml(object.id)}" data-town-layer-id="${layerId}" data-town-resize-mode="${asset.resizeMode}"${getRotationTransform(object)}>${content}</g>`;
}

function renderTownLayer(
  layer: TownLayer,
  assetSources: TownAssetSources,
  patternIndexStart: number,
): { markup: string; nextPatternIndex: number } {
  let patternIndex = patternIndexStart;
  const objectMarkup = layer.objects
    .map((object) => {
      const markup = renderTownObject(object, layer.id, assetSources, patternIndex);
      patternIndex += 1;
      return markup;
    })
    .join('');

  return {
    markup: `<g data-town-layer-id="${layer.id}" data-town-layer-visible="true">${objectMarkup}</g>`,
    nextPatternIndex: patternIndex,
  };
}

export function buildTownSceneMarkup(
  document: TownDocument,
  assetSources: TownAssetSources = {},
): string {
  const validatedDocument = validateTownDocument(document);
  const layerById = new Map(validatedDocument.layers.map((layer) => [layer.id, layer]));
  let patternIndex = 0;
  const layersMarkup = TOWN_LAYER_ORDER
    .map((layerId) => layerById.get(layerId))
    .filter((layer): layer is TownLayer => Boolean(layer && layer.visible))
    .map((layer) => {
      const result = renderTownLayer(layer, assetSources, patternIndex);
      patternIndex = result.nextPatternIndex;
      return result.markup;
    })
    .join('');
  const backgroundImageHref = getBackgroundHref(validatedDocument, assetSources);
  const backgroundImage = backgroundImageHref
    ? `<image data-town-background-image="true" href="${escapeXml(backgroundImageHref)}" x="0" y="0" width="${formatNumber(validatedDocument.width)}" height="${formatNumber(validatedDocument.height)}" preserveAspectRatio="none"/>`
    : '';
  const background = `<rect data-town-background="true" x="0" y="0" width="${formatNumber(validatedDocument.width)}" height="${formatNumber(validatedDocument.height)}" fill="${escapeXml(validatedDocument.backgroundColor)}"/>`;
  return background + backgroundImage + layersMarkup;
}

export function buildTownSvg(
  document: TownDocument,
  assetSources: TownAssetSources = {},
): string {
  const sceneMarkup = buildTownSceneMarkup(document, assetSources);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${formatNumber(document.width)}" height="${formatNumber(document.height)}" viewBox="0 0 ${formatNumber(document.width)} ${formatNumber(document.height)}" role="img" data-town-svg="true">${sceneMarkup}</svg>`;
}
