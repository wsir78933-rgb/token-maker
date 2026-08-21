import { getCoatAsset } from './assets';
import { assertCoatProject } from './commands';
import { getShieldMaterialSvgMarkup, isShieldMaterialAssetId } from './shield-material-paints';
import { applySvgPaintReplacements } from './svg-paint-colours';
import { textFontStacks } from './types';
import type {
  CanvasTransform,
  BackgroundGradient,
  CoatField,
  CoatLayer,
  CoatProject,
  FieldOrnament,
  FieldPattern,
  ShieldLayer,
  TextLayer,
} from './types';
import { buildHeraldicLinePoints } from './field-division-line';
import { buildFieldInteriorMarkup } from './field';
import { getFieldRegionPath } from './field-regions';
import { renderExtendedFieldPattern } from './field-pattern';

const SCENE_VIEW_BOX = '0 0 100 110';
const TEXT_FONT_SIZE_SCENE_SCALE = 7;

export interface CoatSceneSvgOptions {
  width: number;
  height: number;
}

/**
 * Renders a validated coat project as a standalone SVG without browser APIs.
 * Layer order is preserved exactly; locked layers remain renderable because a
 * lock controls editing, not visibility.
 */
export function renderCoatSceneSvg(
  project: CoatProject,
  options: CoatSceneSvgOptions,
): string {
  assertCoatProject(project);
  assertSceneOptions(options);

  const textPaths: string[] = [];
  const layerMarkup = renderLayerSegments(project, textPaths);
  const definitions = textPaths.length === 0 ? '' : `<defs>${textPaths.join('')}</defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="${SCENE_VIEW_BOX}" role="img" aria-label="${escapeXml(project.name)}" preserveAspectRatio="xMidYMid meet">${definitions}${layerMarkup}</svg>`;
}

function renderLayerSegments(project: CoatProject, textPaths: string[]): string {
  const segments: string[] = [];
  let layerIndex = 0;
  while (layerIndex < project.layers.length) {
    const layer = project.layers[layerIndex]!;
    if (layer.groupId === null) {
      if (layer.visible) segments.push(renderLayer(layer, project, layerIndex, textPaths));
      layerIndex += 1;
      continue;
    }

    const groupId = layer.groupId;
    const group = project.groups.find((candidate) => candidate.id === groupId);
    if (!group) throw new Error(`Missing coat group metadata: ${groupId}`);
    const memberMarkup: string[] = [];
    do {
      const member = project.layers[layerIndex]!;
      if (member.visible) memberMarkup.push(renderLayer(member, project, layerIndex, textPaths));
      layerIndex += 1;
    } while (layerIndex < project.layers.length && project.layers[layerIndex]!.groupId === groupId);
    if (memberMarkup.length > 0) {
      segments.push(`<g data-group-id="${escapeXml(group.id)}" opacity="${group.opacity}">${memberMarkup.join('')}</g>`);
    }
  }
  return segments.join('');
}

function renderLayer(
  layer: CoatLayer,
  project: CoatProject,
  layerIndex: number,
  textPaths: string[],
): string {
  const layerStart = `<g data-layer-id="${escapeXml(layer.id)}">`;
  const layerEnd = '</g>';

  switch (layer.type) {
    case 'background':
      return `${layerStart}${renderBackgroundLayer(layer.assetId, layer.motif, layer.opacity, layer.fill, layer.gradient, layerIndex)}${layerEnd}`;
    case 'shield':
      return `${layerStart}${renderShieldLayer(layer, project, layerIndex)}${layerEnd}`;
    case 'ordinary':
    case 'charge':
    case 'top':
      return `${layerStart}${renderGeometryLayer(layer, project, layerIndex)}${layerEnd}`;
    case 'draw':
      return `${layerStart}${renderTransformedLayer(`<path d="${layer.path}" fill="none" stroke="${layer.color}" stroke-width="${layer.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`, layer.transform, layerIndex, layer.opacity ?? 1)}${layerEnd}`;
    case 'image':
      return `${layerStart}${renderImageLayer(project, layer.uploadId, layer.mimeType, layer.opacity, layer.transform, layerIndex)}${layerEnd}`;
    case 'text':
      return `${layerStart}${renderTextLayer(layer, layerIndex, textPaths)}${layerEnd}`;
  }
}

function renderBackgroundLayer(
  assetId: string,
  motif: FieldPattern,
  opacity: number,
  fillOverride: string | undefined,
  gradient: BackgroundGradient | undefined,
  layerIndex: number,
): string {
  const background = getCoatAsset(assetId);
  if (background.kind !== 'background') {
    throw new Error(`Invalid background layer asset: ${assetId}`);
  }
  const fill = fillOverride ?? background.fill;
  const gradientId = `coat-background-gradient-${layerIndex}`;
  const backgroundFill = gradient ? `url(#${gradientId})` : fill;
  const motifMarkup = renderBackgroundMotif(motif, fill);
  const gradientMarkup = gradient
    ? `<defs><linearGradient id="${gradientId}" gradientTransform="rotate(${gradient.angle} 0.5 0.5)"><stop offset="0%" stop-color="${gradient.startColor}"/><stop offset="100%" stop-color="${gradient.endColor}"/></linearGradient></defs>`
    : '';
  return `<g opacity="${opacity}">${gradientMarkup}<rect width="100" height="110" fill="${backgroundFill}"/>${motifMarkup}</g>`;
}

function renderBackgroundMotif(motif: FieldPattern, backgroundColor: string): string {
  const accentColor = contrastColor(backgroundColor);
  const extendedPattern = renderExtendedFieldPattern(motif, accentColor);
  if (extendedPattern !== undefined) return `<g opacity="0.22">${extendedPattern}</g>`;
  switch (motif) {
    case 'solid':
      return '';
    case 'stripes':
      return `<path d="M-30 0 L50 110 M0 0 L80 110 M30 0 L110 110" stroke="${accentColor}" stroke-width="6" opacity="0.25"/>`;
    case 'dots':
      return `<g fill="${accentColor}" opacity="0.18"><circle cx="15" cy="15" r="3"/><circle cx="50" cy="34" r="3"/><circle cx="85" cy="15" r="3"/><circle cx="15" cy="72" r="3"/><circle cx="85" cy="72" r="3"/></g>`;
    case 'checks':
      return `<path d="M0 27.5H100M0 55H100M0 82.5H100M25 0V110M50 0V110M75 0V110" stroke="${accentColor}" stroke-width="2" opacity="0.2"/>`;
    case 'lozengy':
      return `<path d="M0 27.5 L25 0 L50 27.5 L75 0 L100 27.5 M0 82.5 L25 55 L50 82.5 L75 55 L100 82.5 M0 27.5 L25 55 L50 27.5 L75 55 L100 27.5 M0 82.5 L25 110 L50 82.5 L75 110 L100 82.5" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.25"/>`;
    case 'crosses':
      return `<g stroke="${accentColor}" stroke-width="4" opacity="0.2"><path d="M25 8V32M13 20H37M75 8V32M63 20H87M25 58V82M13 70H37M75 58V82M63 70H87"/></g>`;
    case 'waves':
      return `<path d="M0 20 Q12.5 8 25 20 T50 20 T75 20 T100 20 M0 55 Q12.5 43 25 55 T50 55 T75 55 T100 55 M0 90 Q12.5 78 25 90 T50 90 T75 90 T100 90" fill="none" stroke="${accentColor}" stroke-width="5" opacity="0.25"/>`;
    case 'masoned':
      return `<path d="M0 22H100M0 44H100M0 66H100M0 88H100M20 0V22M60 0V22M40 22V44M80 22V44M20 44V66M60 44V66M40 66V88M80 66V88M20 88V110M60 88V110" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.22"/>`;
    case 'honeycomb':
      return `<g fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.22"><polygon points="18,5 30,12 30,26 18,33 6,26 6,12"/><polygon points="42,5 54,12 54,26 42,33 30,26 30,12"/><polygon points="66,5 78,12 78,26 66,33 54,26 54,12"/><polygon points="30,33 42,40 42,54 30,61 18,54 18,40"/><polygon points="54,33 66,40 66,54 54,61 42,54 42,40"/></g>`;
    case 'fretty':
      return `<path d="M-20 0L80 110M10 0L110 110M-20 110L80 0M10 110L110 0" fill="none" stroke="${accentColor}" stroke-width="4" opacity="0.22"/>`;
    case 'scales':
      return `<g fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.22"><circle cx="15" cy="18" r="11"/><circle cx="38" cy="18" r="11"/><circle cx="61" cy="18" r="11"/><circle cx="84" cy="18" r="11"/><circle cx="26" cy="38" r="11"/><circle cx="49" cy="38" r="11"/><circle cx="72" cy="38" r="11"/></g>`;
    default:
      throw new Error(`Unsupported background motif: ${motif}`);
  }
}

function renderShieldLayer(layer: ShieldLayer, project: CoatProject, layerIndex: number): string {
  const shield = getCoatAsset(layer.assetId);
  if (shield.kind !== 'shield') {
    throw new Error(`Invalid shield layer asset: ${layer.assetId}`);
  }
  if (layer.customMaskUploadId && !layer.customOutlinePath) return renderCustomShieldLayer(layer, project, layerIndex);
  if (isShieldMaterialAssetId(layer.assetId)) {
    return renderTransformedLayer(renderShieldMaterialSvg(layer, layerIndex), layer.transform, layerIndex);
  }
  if (shield.staticImageSrc) {
    return renderTransformedLayer(`<image data-bundled-shield-material="true" href="${escapeXml(shield.staticImageSrc)}" x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet"/>`, layer.transform, layerIndex);
  }
  const shieldPath = layer.customOutlinePath ?? shield.svgPath;
  const clipPathId = `coat-shield-clip-${layerIndex}`;
  const outline = layer.field.outline ?? { visible: true, color: '#1E293B', width: 1.5 };
  const outlineMarkup = outline.visible ? `<path d="${shieldPath}" fill="none" stroke="${outline.color}" stroke-width="${outline.width}"/>` : '';
  const customOutlineAttribute = layer.customOutlinePath ? ' data-custom-shield-outline="true"' : '';
  return renderTransformedLayer(`<g${customOutlineAttribute}><defs><clipPath id="${clipPathId}"><path d="${shieldPath}"/></clipPath></defs><g clip-path="url(#${clipPathId})">${renderField(layer.field, clipPathId)}</g>${outlineMarkup}</g>`, layer.transform, layerIndex);
}

function renderShieldMaterialSvg(layer: ShieldLayer, layerIndex: number): string {
  const authoredMarkup = getShieldMaterialSvgMarkup(layer.assetId);
  if (authoredMarkup.trim().length === 0) {
    throw new Error(`Shield material has no SVG markup: ${layer.assetId}`);
  }
  const recolouredMarkup = applySvgPaintReplacements(authoredMarkup, layer.colorReplacements ?? {});
  const documentMarkup = stripXmlDeclaration(recolouredMarkup).trim();
  if (!/^<svg\b/i.test(documentMarkup)) {
    throw new Error(`Shield material has no SVG markup: ${layer.assetId}`);
  }
  return placeNestedShieldMaterialSvg(namespaceSvgFragmentIds(documentMarkup, layerIndex));
}

function stripXmlDeclaration(svgText: string): string {
  return svgText.replace(/^\s*<\?xml\b[^?]*\?>\s*/i, '');
}

function namespaceSvgFragmentIds(svgMarkup: string, layerIndex: number): string {
  const discoveredIds: string[] = [];
  for (const match of svgMarkup.matchAll(/\bid="([^"]+)"/g)) {
    const originalId = match[1];
    if (originalId === undefined || originalId.trim().length === 0) {
      throw new Error(`Invalid SVG id in shield material: ${JSON.stringify(originalId)}`);
    }
    discoveredIds.push(originalId);
  }
  const uniqueIds = [...new Set(discoveredIds)].sort((leftId, rightId) => rightId.length - leftId.length);
  let namespacedMarkup = svgMarkup;
  for (const originalId of uniqueIds) {
    const namespacedId = `${originalId}-${layerIndex}`;
    namespacedMarkup = namespacedMarkup.replaceAll(`id="${originalId}"`, `id="${namespacedId}"`);
    namespacedMarkup = namespacedMarkup.replace(
      new RegExp(`url\\(#${escapeRegExp(originalId)}\\)`, 'g'),
      `url(#${namespacedId})`,
    );
  }
  return namespacedMarkup;
}

function placeNestedShieldMaterialSvg(svgMarkup: string): string {
  return svgMarkup.replace(/^<svg\b/i, '<svg data-bundled-shield-material="true" x="0" y="0" width="100" height="110"');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderCustomShieldLayer(layer: ShieldLayer, project: CoatProject, layerIndex: number): string {
  const maskUpload = project.uploads.find((upload) => upload.id === layer.customMaskUploadId);
  if (!maskUpload) throw new Error(`Invalid custom shield mask upload: ${layer.customMaskUploadId}`);
  const maskId = `coat-custom-shield-mask-${layerIndex}`;
  const outlineFilterId = `coat-custom-shield-outline-${layerIndex}`;
  const maskHref = `data:${maskUpload.mimeType};base64,${maskUpload.data}`;
  const outline = layer.field.outline ?? { visible: true, color: '#1E293B', width: 1.5 };
  const outlineFilterMarkup = outline.visible
    ? `<filter id="${outlineFilterId}" x="-10" y="-10" width="120" height="130" filterUnits="userSpaceOnUse"><feMorphology in="SourceAlpha" operator="dilate" radius="${outline.width}" result="coat-outline-expanded"/><feComposite in="coat-outline-expanded" in2="SourceAlpha" operator="out" result="coat-outline-shape"/><feFlood flood-color="${outline.color}" result="coat-outline-colour"/><feComposite in="coat-outline-colour" in2="coat-outline-shape" operator="in"/></filter>`
    : '';
  const outlineMarkup = outline.visible
    ? `<image data-custom-shield-outline="true" href="${maskHref}" x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet" filter="url(#${outlineFilterId})"/>`
    : '';
  const maskMarkup = `<defs><mask id="${maskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse"><image href="${maskHref}" x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet"/></mask>${outlineFilterMarkup}</defs>`;
  return renderTransformedLayer(`${maskMarkup}<g mask="url(#${maskId})">${renderField(layer.field, maskId)}</g>${outlineMarkup}`, layer.transform, layerIndex);
}

function renderField(field: CoatField, regionClipIdPrefix: string): string {
  return `${buildFieldInteriorMarkup(field, regionClipIdPrefix)}${renderFieldOrnaments(field.ornaments ?? [])}`;
}

function renderFieldOrnaments(ornaments: FieldOrnament[]): string {
  return ornaments.map((ornament) => `<g data-field-ornament-id="${escapeXml(ornament.id)}"${renderFieldOrnamentDataAttributes(ornament)} transform="translate(${ornament.x} ${ornament.y}) rotate(${ornament.rotation} 50 55) scale(${ornament.scale})">${renderFieldOrnamentShape(ornament)}</g>`).join('');
}

function renderFieldOrnamentDataAttributes(ornament: FieldOrnament): string {
  const attributes = [
    ornament.width === undefined ? '' : ` data-field-ornament-width="${ornament.width}"`,
    ornament.height === undefined ? '' : ` data-field-ornament-height="${ornament.height}"`,
    ornament.thickness === undefined ? '' : ` data-field-ornament-thickness="${ornament.thickness}"`,
    ornament.reversed === undefined ? '' : ` data-field-ornament-reversed="${ornament.reversed}"`,
    ornament.keepAspectRatio === undefined ? '' : ` data-field-ornament-keep-aspect-ratio="${ornament.keepAspectRatio}"`,
    ornament.overlap === undefined ? '' : ` data-field-ornament-overlap="${ornament.overlap}"`,
    ornament.bendSinister === undefined ? '' : ` data-field-ornament-bend-sinister="${ornament.bendSinister}"`,
    ornament.edge === undefined ? '' : ` data-field-ornament-edge-style="${ornament.edge.style}" data-field-ornament-edge-frequency="${ornament.edge.frequency}" data-field-ornament-edge-amplitude="${ornament.edge.amplitude}"`,
    ornament.crossHorizontalThickness === undefined ? '' : ` data-field-ornament-cross-horizontal-thickness="${ornament.crossHorizontalThickness}"`,
    ornament.crossVerticalThickness === undefined ? '' : ` data-field-ornament-cross-vertical-thickness="${ornament.crossVerticalThickness}"`,
    ornament.crossCenterX === undefined ? '' : ` data-field-ornament-cross-center-x="${ornament.crossCenterX}"`,
    ornament.crossCenterY === undefined ? '' : ` data-field-ornament-cross-center-y="${ornament.crossCenterY}"`,
    ornament.saltireCenterX === undefined ? '' : ` data-field-ornament-saltire-center-x="${ornament.saltireCenterX}"`,
    ornament.saltireCenterY === undefined ? '' : ` data-field-ornament-saltire-center-y="${ornament.saltireCenterY}"`,
    ornament.chevronPeakHeight === undefined ? '' : ` data-field-ornament-chevron-peak-height="${ornament.chevronPeakHeight}"`,
    ornament.chevronVerticalPosition === undefined ? '' : ` data-field-ornament-chevron-vertical-position="${ornament.chevronVerticalPosition}"`,
    ornament.pallForkX === undefined ? '' : ` data-field-ornament-pall-fork-x="${ornament.pallForkX}"`,
    ornament.pallForkY === undefined ? '' : ` data-field-ornament-pall-fork-y="${ornament.pallForkY}"`,
    ornament.mountainPeakCount === undefined ? '' : ` data-field-ornament-mountain-peak-count="${ornament.mountainPeakCount}"`,
    ornament.mountainSteepness === undefined ? '' : ` data-field-ornament-mountain-steepness="${ornament.mountainSteepness}"`,
  ];
  return attributes.join('');
}

function renderFieldOrnamentShape(ornament: FieldOrnament): string {
  const fill = ornament.colors ? `url(#${getFieldOrnamentGradientId(ornament.id)})` : ornament.color;
  const width = ornament.width ?? 100;
  const left = (100 - width) / 2;
  const right = left + width;
  const thickness = ornament.thickness ?? 14;
  const shape = (() => {
    switch (ornament.kind) {
    case 'bar': return `<rect x="${left}" y="${55 - thickness / 2}" width="${width}" height="${thickness}" fill="${fill}"/>`;
    case 'base': return renderHorizontalStructuredBand(left, right, 110 - (ornament.height ?? 28), ornament.height ?? 28, fill, ornament.edge, 'top');
    case 'bendlet': return renderBendlet(thickness, ornament.bendSinister ?? false, fill, ornament.edge);
    case 'chief': return renderHorizontalStructuredBand(left, right, 0, ornament.height ?? 25, fill, ornament.edge, 'bottom');
    case 'cross': return renderCross(ornament, fill);
    case 'fess': return renderHorizontalStructuredBand(left, right, 55 - thickness / 2, thickness, fill, ornament.edge, 'bottom');
    case 'mountain': return renderMountain(left, right, ornament.height ?? 68, ornament.overlap ?? 0, fill, ornament.mountainPeakCount, ornament.mountainSteepness);
    case 'pale': return renderVerticalStructuredBand(50 - thickness / 2, thickness, fill, ornament.edge);
    case 'pile': return ornament.reversed
      ? `<path d="M50 110L${right} 0H${left}Z" fill="${fill}"/>`
      : `<path d="M50 0L${right} 110H${left}Z" fill="${fill}"/>`;
    case 'escutcheon': return `<path d="M50 28L70 35V59C70 73 60 83 50 89C40 83 30 73 30 59V35Z" fill="${fill}"/>`;
    case 'bordure': return renderBordure(ornament.thickness ?? 8, fill);
    case 'canton': return `<rect x="0" y="0" width="${width}" height="${ornament.keepAspectRatio ? width : ornament.height ?? 35}" fill="${fill}"/>`;
    case 'chevron': return renderChevron(left, right, thickness, ornament.reversed ?? false, fill, ornament.chevronPeakHeight, ornament.chevronVerticalPosition);
    case 'pall': return renderPall(ornament.thickness ?? 22, ornament.reversed ?? false, fill, ornament.pallForkX, ornament.pallForkY);
    case 'saltire': return renderSaltire(ornament, fill);
      case 'fretty': return `<path d="M-20 0L80 110M10 0L110 110M-20 110L80 0M10 110L110 0" fill="none" stroke="${fill}" stroke-width="${ornament.thickness ?? 8}"/>`;
    }
  })();
  return `${renderFieldOrnamentGradient(ornament)}${shape}`;
}

function renderFieldOrnamentGradient(ornament: FieldOrnament): string {
  if (!ornament.colors || !ornament.colorAmplitudes) return '';
  const totalAmplitude = ornament.colorAmplitudes.reduce((total, amplitude) => total + amplitude, 0);
  let completedAmplitude = 0;
  const stops = ornament.colors.map((color, index) => {
    const offset = completedAmplitude / totalAmplitude * 100;
    completedAmplitude += ornament.colorAmplitudes![index]!;
    return `<stop offset="${offset}%" stop-color="${color}"/>`;
  }).join('');
  return `<defs><linearGradient id="${getFieldOrnamentGradientId(ornament.id)}" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient></defs>`;
}

function getFieldOrnamentGradientId(ornamentId: string): string {
  return `coat-field-ornament-gradient-${Array.from(ornamentId).map((character) => character.codePointAt(0)).join('-')}`;
}

function renderHorizontalStructuredBand(
  left: number,
  right: number,
  top: number,
  height: number,
  fill: string,
  edge: FieldOrnament['edge'],
  edgeSide: 'top' | 'bottom',
): string {
  if (!edge) return `<rect x="${left}" y="${top}" width="${right - left}" height="${height}" fill="${fill}"/>`;
  const edgeY = edgeSide === 'top' ? top : top + height;
  const edgePoints = buildHeraldicLinePoints({ x: left, y: edgeY }, { x: right, y: edgeY }, edge);
  const edgePath = edgePoints.map((point) => `${point.x} ${point.y}`).join(' L');
  return edgeSide === 'top'
    ? `<path d="M${left} ${top + height}H${right}L${edgePath}Z" fill="${fill}"/>`
    : `<path d="M${left} ${top}H${right}V${edgeY}L${edgePoints.slice(0, -1).reverse().map((point) => `${point.x} ${point.y}`).join(' L')}Z" fill="${fill}"/>`;
}

function renderBendlet(thickness: number, bendSinister: boolean, fill: string, edge: FieldOrnament['edge']): string {
  if (!edge) {
    return bendSinister
      ? `<path d="M${100 - thickness} 0H100V${thickness}L${thickness} 110H0V${110 - thickness}Z" fill="${fill}"/>`
      : `<path d="M0 0H${thickness}L100 ${110 - thickness}V110H${100 - thickness}L0 ${thickness}Z" fill="${fill}"/>`;
  }
  if (!bendSinister) {
    const edgePoints = buildHeraldicLinePoints({ x: thickness, y: 0 }, { x: 100, y: 110 - thickness }, edge);
    return `<path d="M0 0H${thickness}L${edgePoints.slice(1).map((point) => `${point.x} ${point.y}`).join(' L')}V110H${100 - thickness}L0 ${thickness}Z" fill="${fill}"/>`;
  }
  const edgePoints = buildHeraldicLinePoints({ x: 100 - thickness, y: 0 }, { x: 0, y: 110 - thickness }, edge);
  return `<path d="M${100 - thickness} 0H100V${thickness}L${thickness} 110H0V${110 - thickness}L${edgePoints.slice(0, -1).reverse().map((point) => `${point.x} ${point.y}`).join(' L')}Z" fill="${fill}"/>`;
}

function renderVerticalStructuredBand(left: number, thickness: number, fill: string, edge: FieldOrnament['edge']): string {
  if (!edge) return `<rect x="${left}" y="0" width="${thickness}" height="110" fill="${fill}"/>`;
  const right = left + thickness;
  const edgePoints = buildHeraldicLinePoints({ x: right, y: 0 }, { x: right, y: 110 }, edge);
  return `<path d="M${left} 0H${right}L${edgePoints.slice(1).map((point) => `${point.x} ${point.y}`).join(' L')}H${left}Z" fill="${fill}"/>`;
}

function renderCross(ornament: FieldOrnament, fill: string): string {
  if (ornament.crossHorizontalThickness === undefined && ornament.crossVerticalThickness === undefined && ornament.crossCenterX === undefined && ornament.crossCenterY === undefined) {
    return `<path d="M39 0H61V39H100V71H61V110H39V71H0V39H39Z" fill="${fill}"/>`;
  }
  const horizontalThickness = ornament.crossHorizontalThickness ?? 32;
  const verticalThickness = ornament.crossVerticalThickness ?? 22;
  const centreX = ornament.crossCenterX ?? 50;
  const centreY = ornament.crossCenterY ?? 55;
  const horizontalTop = centreY - horizontalThickness / 2;
  const horizontalBottom = centreY + horizontalThickness / 2;
  const verticalLeft = centreX - verticalThickness / 2;
  const verticalRight = centreX + verticalThickness / 2;
  return `<path d="M${verticalLeft} 0H${verticalRight}V${horizontalTop}H100V${horizontalBottom}H${verticalRight}V110H${verticalLeft}V${horizontalBottom}H0V${horizontalTop}H${verticalLeft}Z" fill="${fill}"/>`;
}

function renderSaltire(ornament: FieldOrnament, fill: string): string {
  const shape = ornament.thickness === undefined
    ? `<path d="M0 9L9 0L100 101V110H91L0 9ZM91 0H100V9L9 110H0V101Z" fill="${fill}"/>`
    : `<path d="M0 0L100 110M100 0L0 110" fill="none" stroke="${fill}" stroke-width="${ornament.thickness}"/>`;
  if (ornament.saltireCenterX === undefined && ornament.saltireCenterY === undefined) return shape;
  const translateX = (ornament.saltireCenterX ?? 50) - 50;
  const translateY = (ornament.saltireCenterY ?? 55) - 55;
  return `<g transform="translate(${translateX} ${translateY})">${shape}</g>`;
}

function renderMountain(left: number, right: number, height: number, overlap: number, fill: string, peakCount: number | undefined, steepness: number | undefined): string {
  if (peakCount === undefined && steepness === undefined) return renderLegacyMountain(left, right, height, overlap, fill);
  const resolvedPeakCount = peakCount ?? 2;
  const resolvedSteepness = steepness ?? 0.72;
  const span = right - left;
  const peakY = 110 - height * resolvedSteepness;
  const saddleY = 110 - height * resolvedSteepness * (0.48 + overlap / 500);
  const points = [`M${left} 110`];
  for (let index = 0; index < resolvedPeakCount; index += 1) {
    const peakX = left + span * (index + 0.5) / resolvedPeakCount;
    points.push(`L${peakX} ${peakY}`);
    if (index < resolvedPeakCount - 1) {
      const saddleX = left + span * (index + 1) / resolvedPeakCount;
      points.push(`L${saddleX} ${saddleY}`);
    }
  }
  points.push(`L${right} 110Z`);
  return `<path d="${points.join('')}" fill="${fill}"/>`;
}

function renderLegacyMountain(left: number, right: number, height: number, overlap: number, fill: string): string {
  const peakY = 110 - height;
  const firstPeakX = left + (right - left) * 0.28;
  const secondPeakX = right - (right - left) * 0.28;
  const saddleX = 50 + (overlap - 50) * 0.08;
  const saddleY = 110 - height * 0.38;
  return `<path d="M${left} 110L${firstPeakX} ${peakY + height * 0.34}L${saddleX} ${saddleY}L${secondPeakX} ${peakY}L${right} 110Z" fill="${fill}"/>`;
}

function renderBordure(thickness: number, fill: string): string {
  return `<path d="M0 0H100V110H0ZM${thickness} ${thickness}V${110 - thickness}H${100 - thickness}V${thickness}Z" fill="${fill}" fill-rule="evenodd"/>`;
}

function renderChevron(left: number, right: number, thickness: number, reversed: boolean, fill: string, peakHeight: number | undefined, verticalPosition: number | undefined): string {
  if (peakHeight === undefined && verticalPosition === undefined) {
    const chevron = `<path d="M${left} 34L${left + thickness} 20L50 55L${right - thickness} 20L${right} 34L50 83Z" fill="${fill}"/>`;
    return reversed ? `<g transform="rotate(180 50 55)">${chevron}</g>` : chevron;
  }
  const resolvedPeakHeight = peakHeight ?? 35;
  const resolvedVerticalPosition = verticalPosition ?? 55;
  const innerArmY = resolvedVerticalPosition - resolvedPeakHeight;
  const outerArmY = innerArmY + thickness;
  const lowerPointY = resolvedVerticalPosition + resolvedPeakHeight * 0.8;
  const chevron = `<path d="M${left} ${outerArmY}L${left + thickness} ${innerArmY}L50 ${resolvedVerticalPosition}L${right - thickness} ${innerArmY}L${right} ${outerArmY}L50 ${lowerPointY}Z" fill="${fill}"/>`;
  return reversed ? `<g transform="rotate(180 50 55)">${chevron}</g>` : chevron;
}

function renderPall(thickness: number, reversed: boolean, fill: string, forkX: number | undefined, forkY: number | undefined): string {
  const halfThickness = thickness / 2;
  const resolvedForkX = forkX ?? 50;
  const resolvedForkY = forkY ?? 39 + halfThickness;
  const left = resolvedForkX - halfThickness;
  const right = resolvedForkX + halfThickness;
  const armBottomY = resolvedForkY + 39;
  const innerTipY = resolvedForkY + 21;
  const pall = `<path d="M${left} 0H${right}V${resolvedForkY}L100 ${armBottomY}V110H${78 - halfThickness}L${resolvedForkX} ${innerTipY}L${22 + halfThickness} 110H0V${armBottomY}L${left} ${resolvedForkY}Z" fill="${fill}"/>`;
  return reversed ? `<g transform="rotate(180 50 55)">${pall}</g>` : pall;
}

function renderGeometryLayer(
  layer: Extract<CoatLayer, { type: 'ordinary' | 'charge' | 'top' }>,
  project: CoatProject,
  layerIndex: number,
): string {
  const asset = getCoatAsset(layer.assetId);
  if (asset.kind !== 'ordinary' && asset.kind !== 'charge' && asset.kind !== 'top') {
    throw new Error(`Invalid geometry layer asset: ${layer.assetId}`);
  }
  const geometryMarkup = hasStaticRasterSource(asset)
    ? renderStaticRasterAsset(asset)
    : isBundledRasterAsset(asset) && isBundledRasterLayer(layer)
      ? renderBundledRasterAsset(asset, layer)
      : renderVectorGeometryAsset(asset, layer);
  const transformedMarkup = renderTransformedLayer(geometryMarkup, layer.transform, layerIndex);
  if (layer.type !== 'charge' || !layer.transform.clipToField) return transformedMarkup;
  return renderChargeFieldPlacement(transformedMarkup, project, layer.transform, layerIndex);
}

function hasStaticRasterSource(
  asset: ReturnType<typeof getCoatAsset>,
): asset is Extract<ReturnType<typeof getCoatAsset>, { rasterSrc: string }> {
  return 'rasterSrc' in asset && typeof asset.rasterSrc === 'string';
}

function renderStaticRasterAsset(
  asset: Extract<ReturnType<typeof getCoatAsset>, { rasterSrc: string }>,
): string {
  return `<image data-bundled-raster="true" href="${escapeXml(asset.rasterSrc)}" x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet"/>`;
}

function renderVectorGeometryAsset(
  asset: ReturnType<typeof getCoatAsset>,
  layer: Extract<CoatLayer, { type: 'ordinary' | 'charge' | 'top' }>,
): string {
  if (!('svgPath' in asset) || typeof asset.svgPath !== 'string') {
    throw new Error(`Material asset has no SVG or WebP source: ${asset.id}`);
  }
  return asset.svgParts
    ? asset.svgParts.map((part, index) => `<path d="${part.svgPath}" fill="${layer.colorReplacements?.[part.sourceColor] ?? (index === 0 ? layer.color : part.sourceColor)}"/>`).join('')
    : `<path d="${asset.svgPath}" fill="${layer.color}"/>`;
}

function isBundledRasterAsset(
  asset: ReturnType<typeof getCoatAsset>,
): asset is Extract<ReturnType<typeof getCoatAsset>, { kind: 'charge' | 'top' }> {
  return (asset.kind === 'charge' || asset.kind === 'top')
    && asset.rasterVariants !== undefined;
}

function isBundledRasterLayer(
  layer: Extract<CoatLayer, { type: 'ordinary' | 'charge' | 'top' }>,
): layer is Extract<CoatLayer, { type: 'charge' | 'top' }> {
  return layer.type === 'charge' || layer.type === 'top';
}

function renderBundledRasterAsset(
  asset: Extract<ReturnType<typeof getCoatAsset>, { kind: 'charge' | 'top' }>,
  layer: Extract<CoatLayer, { type: 'charge' | 'top' }>,
): string {
  const rasterVariantId = layer.rasterVariantId ?? asset.rasterVariants![0].id;
  const rasterVariant = asset.rasterVariants!.find((variant) => variant.id === rasterVariantId);
  if (!rasterVariant) {
    throw new Error(`Invalid raster variant ${rasterVariantId} for asset: ${asset.id}`);
  }
  return `<image data-bundled-raster-variant="${rasterVariant.id}" href="${escapeXml(rasterVariant.src)}" x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet"/>`;
}

function renderChargeFieldPlacement(
  transformedMarkup: string,
  project: CoatProject,
  transform: CanvasTransform,
  layerIndex: number,
): string {
  const targetShieldLayerId = transform.fieldShieldLayerId;
  const shieldLayer = project.layers.find((layer) => layer.type === 'shield' && (targetShieldLayerId === undefined || layer.id === targetShieldLayerId));
  if (!shieldLayer || shieldLayer.type !== 'shield') {
    throw new Error(targetShieldLayerId
      ? `Cannot clip a charge to shield layer: ${targetShieldLayerId}`
      : 'Cannot clip a charge without a shield layer');
  }
  const placement = transform.fieldPlacement ?? 'overall';
  const fieldRegionId = transform.fieldRegionId;
  const regionId = `coat-field-region-${layerIndex}`;
  const regionShape = fieldRegionId ? `<path d="${getFieldRegionPath(fieldRegionId)}"/>` : getFieldPlacementShape(placement);
  const regionMarkup = `<clipPath id="${regionId}">${regionShape}</clipPath>`;
  const shieldTargetAttribute = targetShieldLayerId ? ` data-field-shield-layer-id="${escapeXml(targetShieldLayerId)}"` : '';
  const placementMarkup = `<g data-field-placement="${placement}"${fieldRegionId ? ` data-field-region="${fieldRegionId}"` : ''}${shieldTargetAttribute} clip-path="url(#${regionId})">${transformedMarkup}</g>`;
  if (shieldLayer.customMaskUploadId) {
    const customMaskUpload = project.uploads.find((upload) => upload.id === shieldLayer.customMaskUploadId);
    if (!customMaskUpload) throw new Error(`Invalid custom shield mask upload: ${shieldLayer.customMaskUploadId}`);
    const customMaskId = `coat-charge-shield-mask-${layerIndex}`;
    const customMaskMarkup = `<mask id="${customMaskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse"><image href="data:${customMaskUpload.mimeType};base64,${customMaskUpload.data}" x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet"/></mask>`;
    return `<defs>${customMaskMarkup}${regionMarkup}</defs><g mask="url(#${customMaskId})">${placementMarkup}</g>`;
  }
  const shield = getCoatAsset(shieldLayer.assetId);
  if (shield.kind !== 'shield') throw new Error(`Invalid shield field clip asset: ${shieldLayer.assetId}`);
  const shieldClipId = `coat-charge-shield-clip-${layerIndex}`;
  const shieldPath = shieldLayer.customOutlinePath ?? shield.svgPath;
  return `<defs><clipPath id="${shieldClipId}"><path d="${shieldPath}"/></clipPath>${regionMarkup}</defs><g clip-path="url(#${shieldClipId})">${placementMarkup}</g>`;
}

function getFieldPlacementShape(fieldPlacement: NonNullable<CanvasTransform['fieldPlacement']>): string {
  switch (fieldPlacement) {
    case 'overall': return '<rect x="0" y="0" width="100" height="110"/>';
    case 'dexter': return '<rect x="0" y="0" width="50" height="110"/>';
    case 'sinister': return '<rect x="50" y="0" width="50" height="110"/>';
    case 'chief': return '<rect x="0" y="0" width="100" height="36.667"/>';
    case 'base': return '<rect x="0" y="73.333" width="100" height="36.667"/>';
    case 'q1': return '<rect x="0" y="0" width="50" height="55"/>';
    case 'q2': return '<rect x="50" y="0" width="50" height="55"/>';
    case 'q3': return '<rect x="0" y="55" width="50" height="55"/>';
    case 'q4': return '<rect x="50" y="55" width="50" height="55"/>';
  }
}

function renderImageLayer(
  project: CoatProject,
  uploadId: string,
  mimeType: string,
  opacity: number,
  transform: CanvasTransform,
  layerIndex: number,
): string {
  const upload = project.uploads.find((candidate) => candidate.id === uploadId);
  if (!upload || upload.mimeType !== mimeType) {
    throw new Error(`Invalid local upload layer: ${uploadId}`);
  }
  const href = `data:${upload.mimeType};base64,${upload.data}`;
  return renderTransformedLayer(`<image href="${href}" x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet"/>`, transform, layerIndex, opacity);
}

function renderTextLayer(layer: TextLayer, layerIndex: number, textPaths: string[]): string {
  const textAnchor = layer.alignment === 'left' ? 'start' : layer.alignment === 'right' ? 'end' : 'middle';
  const x = layer.alignment === 'left' ? 8 : layer.alignment === 'right' ? 92 : 50;
  const safeText = escapeXml(layer.text);
  const typographyAttributes = `font-family="${escapeXml(textFontStacks[layer.fontFamily ?? 'serif'])}" font-style="${layer.fontStyle ?? 'normal'}" font-weight="${layer.fontWeight ?? 'normal'}" font-size="${layer.fontSize / TEXT_FONT_SIZE_SCENE_SCALE}"`;
  const decorationAttributes = layer.underline ? ' text-decoration="underline"' : '';
  const strokeAttributes = ` stroke="${escapeXml(layer.strokeColor ?? '#000000')}" stroke-width="${(layer.strokeWidth ?? 0) / TEXT_FONT_SIZE_SCENE_SCALE}" paint-order="stroke fill"`;
  if (layer.path.mode === 'none') {
    return renderTransformedLayer(`<text x="${x}" y="102" fill="${layer.color}"${decorationAttributes}${strokeAttributes} ${typographyAttributes} text-anchor="${textAnchor}">${safeText}</text>`, layer.transform, layerIndex);
  }

  const pathId = `coat-text-path-${layerIndex}`;
  textPaths.push(`<path id="${pathId}" d="${getTextPathData(layer)}" fill="none"/>`);
  const startOffset = layer.alignment === 'left' ? '0%' : layer.alignment === 'right' ? '100%' : '50%';
  return renderTransformedLayer(`<text fill="${layer.color}"${decorationAttributes}${strokeAttributes} ${typographyAttributes} text-anchor="${textAnchor}"><textPath href="#${pathId}" startOffset="${startOffset}">${safeText}</textPath></text>`, layer.transform, layerIndex);
}

function getTextPathData(layer: TextLayer): string {
  switch (layer.path.mode) {
    case 'motto':
      return layer.path.curve === 'upper' ? 'M14 91 Q50 65 86 91' : 'M14 19 Q50 45 86 19';
    case 'curve': {
      const startY = layer.path.curve === 'upper' ? 72 : 38;
      const controlX = layer.path.controlX ?? 50;
      const controlY = layer.path.controlY ?? (layer.path.curve === 'upper' ? 30 : 80);
      return `M10 ${formatSceneNumber(startY)} Q${formatSceneNumber(controlX)} ${formatSceneNumber(controlY)} 90 ${formatSceneNumber(startY)}`;
    }
    case 'ring':
      if (layer.path.radius === undefined) {
        return layer.path.curve === 'clockwise'
          ? 'M50 10 A40 40 0 1 1 49.99 10'
          : 'M50 10 A40 40 0 1 0 49.99 10';
      }
      return `M50 ${formatSceneNumber(50 - layer.path.radius)} A${formatSceneNumber(layer.path.radius)} ${formatSceneNumber(layer.path.radius)} 0 1 ${layer.path.curve === 'clockwise' ? 1 : 0} ${formatSceneNumber(49.99)} ${formatSceneNumber(50 - layer.path.radius)}`;
    case 'none':
      throw new Error('Text path data is not available for mode: none');
  }
}

function formatSceneNumber(value: number): string {
  return Number(value.toFixed(4)).toString();
}

function renderTransform(transform: CanvasTransform): string {
  const horizontalScale = (transform.scaleX ?? transform.scale) * (transform.flipHorizontal ? -1 : 1);
  const verticalScale = (transform.scaleY ?? transform.scale) * (transform.flipVertical ? -1 : 1);
  const hasIndependentAxes = transform.scaleX !== undefined || transform.scaleY !== undefined || transform.flipHorizontal || transform.flipVertical;
  const scale = hasIndependentAxes ? `${horizontalScale} ${verticalScale}` : String(transform.scale);
  return `translate(${transform.x} ${transform.y}) rotate(${transform.rotation} 50 55) translate(50 55) scale(${scale}) translate(-50 -55)`;
}

function renderTransformedLayer(content: string, transform: CanvasTransform, layerIndex: number, baseOpacity = 1): string {
  const cropId = transform.crop ? `coat-crop-${layerIndex}` : null;
  const cropMarkup = transform.crop && cropId
    ? `<defs><clipPath id="${cropId}"><rect x="${transform.crop.x}" y="${transform.crop.y}" width="${transform.crop.width}" height="${transform.crop.height}"/></clipPath></defs>`
    : '';
  const clippedContent = cropId ? `<g clip-path="url(#${cropId})">${content}</g>` : content;
  return `<g opacity="${baseOpacity * getTransformOpacity(transform)}" transform="${renderTransform(transform)}">${cropMarkup}${clippedContent}</g>`;
}

function getTransformOpacity(transform: CanvasTransform): number {
  return transform.opacity ?? 1;
}

function contrastColor(color: string): '#FFFFFF' | '#000000' {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  return red * 299 + green * 587 + blue * 114 > 150_000 ? '#000000' : '#FFFFFF';
}

function assertSceneOptions(options: unknown): asserts options is CoatSceneSvgOptions {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error(`Invalid scene SVG options: ${String(options)}`);
  }
  const candidate = options as Record<string, unknown>;
  if (Object.keys(candidate).length !== 2 || !('width' in candidate) || !('height' in candidate)) {
    throw new Error(`Invalid scene SVG options: ${JSON.stringify(options)}`);
  }
  assertPositiveFiniteNumber(candidate.width, 'scene SVG width');
  assertPositiveFiniteNumber(candidate.height, 'scene SVG height');
}

function assertPositiveFiniteNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
