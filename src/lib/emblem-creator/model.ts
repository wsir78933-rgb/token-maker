import { createInitialCoatProject } from '@/lib/coat-of-arms/assets';
import { assertCoatProject } from '@/lib/coat-of-arms/commands';
import { renderCoatSceneSvg } from '@/lib/coat-of-arms/scene-svg';
import type { CoatLayer, CoatProject, CoatLocale, CanvasTransform } from '@/lib/coat-of-arms/types';

export const EMBLEM_LAYER_SLOTS = ['crest', 'details', 'body-1', 'body-2', 'body-3', 'body-4'] as const;
export type EmblemLayerSlot = (typeof EMBLEM_LAYER_SLOTS)[number];
export type EmblemImageMimeType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

export interface EmblemImageLayer {
  id: string;
  name: string;
  mimeType: EmblemImageMimeType;
  dataUrl: string;
  byteLength: number;
  width: number;
  height: number;
  visible: boolean;
  transform: CanvasTransform;
}

export interface EmblemCreatorDocument {
  version: 1;
  project: CoatProject;
  slotByLayerId: Record<string, EmblemLayerSlot>;
  images: EmblemImageLayer[];
  borderedLayerIds: string[];
}

const SLOT_RENDER_ORDER: Record<EmblemLayerSlot, number> = {
  'body-1': 0,
  'body-2': 1,
  'body-3': 2,
  'body-4': 3,
  details: 4,
  crest: 5,
};

const MAX_IMAGE_BYTES = 8_388_608;
const MAX_TOTAL_IMAGE_BYTES = 16_777_216;
const MAX_IMAGE_COUNT = 8;
const VALID_IMAGE_MIME_TYPES: readonly EmblemImageMimeType[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

export function createBlankEmblemDocument(locale: CoatLocale): EmblemCreatorDocument {
  const source = createInitialCoatProject();
  const background = source.layers.find((layer) => layer.type === 'background');
  if (!background || background.type !== 'background') {
    throw new Error('Emblem Creator initial project is missing its background layer.');
  }

  const project: CoatProject = {
    ...source,
    id: 'emblem-creator-document-v1',
    locale,
    name: locale === 'zh' ? '未命名徽章' : 'Untitled emblem',
    canvas: { width: 1000, height: 1100 },
    uploads: [],
    groups: [],
    layers: [{ ...background, visible: false }],
  };
  assertCoatProject(project);
  assertEmblemProjectLayers(project);

  return {
    version: 1,
    project,
    slotByLayerId: {},
    images: [],
    borderedLayerIds: [],
  };
}

export function orderEmblemProjectLayers(
  project: CoatProject,
  slotByLayerId: Record<string, EmblemLayerSlot>,
): CoatProject {
  const originalOrder = new Map(project.layers.map((layer, index) => [layer.id, index]));
  const layers = [...project.layers].sort((leftLayer, rightLayer) => {
    const leftRank = layerRenderRank(leftLayer, slotByLayerId);
    const rightRank = layerRenderRank(rightLayer, slotByLayerId);
    return leftRank - rightRank || originalOrder.get(leftLayer.id)! - originalOrder.get(rightLayer.id)!;
  });
  const orderedProject = { ...project, layers };
  assertCoatProject(orderedProject);
  return orderedProject;
}

export function renderEmblemCreatorSvg(
  document: EmblemCreatorDocument,
  options: { width: number; height: number; selectedLayerId?: string },
): string {
  assertEmblemCreatorDocument(document);
  let svg = renderCoatSceneSvg(document.project, { width: options.width, height: options.height });
  const imageMarkup = document.images
    .filter((layer) => layer.visible)
    .map(renderImageLayer)
    .join('');
  svg = svg.replace('</svg>', `${imageMarkup}</svg>`);

  return svg.replace(/<g data-layer-id="([^"]+)"[^>]*>/g, (openingTag, layerId: string) => {
    const filterParts: string[] = [];
    if (document.borderedLayerIds.includes(layerId)) {
      filterParts.push(
        'drop-shadow(1px 0 #18222f)',
        'drop-shadow(-1px 0 #18222f)',
        'drop-shadow(0 1px #18222f)',
        'drop-shadow(0 -1px #18222f)',
      );
    }
    if (options.selectedLayerId === layerId) {
      filterParts.push('drop-shadow(0 0 3px #ef9e42)');
    }
    if (filterParts.length === 0) return openingTag;
    return openingTag.replace('>', ` style="filter:${filterParts.join(' ')}">`);
  });
}

export function parseEmblemCreatorDocument(value: unknown, locale: CoatLocale): EmblemCreatorDocument {
  if (!isRecord(value)) throw new Error('Project file must contain a JSON object.');
  assertExactKeys(value, ['version', 'project', 'slotByLayerId', 'images', 'borderedLayerIds'], 'Emblem Creator document');
  if (value.version !== 1) throw new Error(`Unsupported Emblem Creator project version: ${String(value.version)}.`);

  assertCoatProject(value.project);
  assertEmblemProjectLayers(value.project);
  if (value.project.uploads.length > 0) {
    throw new Error('This Emblem Creator project contains uploads from another editor and cannot be loaded here.');
  }
  if (!isRecord(value.slotByLayerId)) throw new Error('Project layer slots must be an object.');
  if (!Array.isArray(value.images)) throw new Error('Project images must be an array.');
  if (!Array.isArray(value.borderedLayerIds)) throw new Error('Project border settings must be an array.');

  const vectorLayers = value.project.layers.filter((layer): layer is CoatLayer => layer.type !== 'background');
  const layerIds = new Set(vectorLayers.map((layer) => layer.id));
  const slotByLayerId: Record<string, EmblemLayerSlot> = {};
  for (const [layerId, slot] of Object.entries(value.slotByLayerId)) {
    if (!layerIds.has(layerId)) throw new Error(`Project slot refers to an unknown layer: ${layerId}.`);
    if (!isEmblemLayerSlot(slot)) throw new Error(`Invalid Emblem Creator layer slot: ${String(slot)}.`);
    slotByLayerId[layerId] = slot;
  }
  for (const layer of vectorLayers) {
    if (!slotByLayerId[layer.id]) throw new Error(`Project layer is missing its Emblem Creator slot: ${layer.id}.`);
  }

  const images = value.images.map((image, index) => parseImageLayer(image, index));
  if (images.length > MAX_IMAGE_COUNT) {
    throw new Error(`Project image count exceeds the limit of ${MAX_IMAGE_COUNT}.`);
  }
  const totalImageBytes = images.reduce((total, image) => total + image.byteLength, 0);
  if (totalImageBytes > MAX_TOTAL_IMAGE_BYTES) {
    throw new Error(`Project images exceed the total size limit of ${MAX_TOTAL_IMAGE_BYTES} bytes.`);
  }

  const allLayerIds = new Set([...layerIds, ...images.map((image) => image.id)]);
  const borderedLayerIds: string[] = [];
  for (const layerId of value.borderedLayerIds) {
    if (typeof layerId !== 'string' || !allLayerIds.has(layerId)) {
      throw new Error(`Project border refers to an unknown layer: ${String(layerId)}.`);
    }
    if (borderedLayerIds.includes(layerId)) throw new Error(`Duplicate project border layer id: ${layerId}.`);
    borderedLayerIds.push(layerId);
  }

  const project = orderEmblemProjectLayers({ ...value.project, locale }, slotByLayerId);
  const parsed: EmblemCreatorDocument = {
    version: 1,
    project,
    slotByLayerId,
    images,
    borderedLayerIds,
  };
  assertEmblemCreatorDocument(parsed);
  return parsed;
}

export function assertEmblemCreatorDocument(document: EmblemCreatorDocument): void {
  if (document.version !== 1) throw new Error(`Invalid Emblem Creator document version: ${String(document.version)}.`);
  assertCoatProject(document.project);
  assertEmblemProjectLayers(document.project);
  if (document.project.uploads.length > 0) throw new Error('Emblem Creator documents cannot use Coat Maker uploads.');
  if (!Array.isArray(document.images) || document.images.length > MAX_IMAGE_COUNT) {
    throw new Error(`Invalid Emblem Creator image count: ${String(document.images?.length)}.`);
  }
  if (!isRecord(document.slotByLayerId)) throw new Error('Invalid Emblem Creator layer slots.');
  if (!Array.isArray(document.borderedLayerIds)) throw new Error('Invalid Emblem Creator border settings.');

  const projectLayerIds = new Set(document.project.layers.map((layer) => layer.id));
  const vectorLayerIds = new Set(
    document.project.layers.filter((layer) => layer.type !== 'background').map((layer) => layer.id),
  );
  for (const layerId of vectorLayerIds) {
    if (!isEmblemLayerSlot(document.slotByLayerId[layerId])) {
      throw new Error(`Invalid or missing Emblem Creator slot for layer ${layerId}.`);
    }
  }
  for (const layerId of Object.keys(document.slotByLayerId)) {
    if (!vectorLayerIds.has(layerId)) throw new Error(`Emblem Creator slot has no matching layer: ${layerId}.`);
  }

  const imageIds = new Set<string>();
  let totalImageBytes = 0;
  for (const [index, image] of document.images.entries()) {
    assertImageLayer(image, index);
    if (projectLayerIds.has(image.id) || imageIds.has(image.id)) {
      throw new Error(`Duplicate Emblem Creator layer id: ${image.id}.`);
    }
    imageIds.add(image.id);
    totalImageBytes += image.byteLength;
  }
  if (totalImageBytes > MAX_TOTAL_IMAGE_BYTES) {
    throw new Error(`Emblem Creator images exceed the total size limit of ${MAX_TOTAL_IMAGE_BYTES} bytes.`);
  }

  const allLayerIds = new Set([...vectorLayerIds, ...imageIds]);
  const borderIds = new Set<string>();
  for (const layerId of document.borderedLayerIds) {
    if (typeof layerId !== 'string' || !allLayerIds.has(layerId)) {
      throw new Error(`Invalid Emblem Creator border layer id: ${String(layerId)}.`);
    }
    if (borderIds.has(layerId)) throw new Error(`Duplicate Emblem Creator border layer id: ${layerId}.`);
    borderIds.add(layerId);
  }
}

function renderImageLayer(layer: EmblemImageLayer): string {
  const longestEdge = Math.max(layer.width, layer.height);
  const displayWidth = (layer.width / longestEdge) * 60;
  const displayHeight = (layer.height / longestEdge) * 60;
  const horizontalScale = (layer.transform.scaleX ?? layer.transform.scale) * (layer.transform.flipHorizontal ? -1 : 1);
  const verticalScale = (layer.transform.scaleY ?? layer.transform.scale) * (layer.transform.flipVertical ? -1 : 1);
  const transform = [
    `translate(${layer.transform.x} ${layer.transform.y})`,
    `rotate(${layer.transform.rotation} 50 55)`,
    `translate(50 55)`,
    `scale(${horizontalScale} ${verticalScale})`,
    'translate(-50 -55)',
  ].join(' ');
  const image = `<image x="${50 - displayWidth / 2}" y="${55 - displayHeight / 2}" width="${displayWidth}" height="${displayHeight}" preserveAspectRatio="xMidYMid meet" href="${escapeXml(layer.dataUrl)}"/>`;
  return `<g data-layer-id="${escapeXml(layer.id)}" transform="${transform}">${image}</g>`;
}

function parseImageLayer(value: unknown, index: number): EmblemImageLayer {
  if (!isRecord(value)) throw new Error(`Project image ${index + 1} must be an object.`);
  assertExactKeys(value, ['id', 'name', 'mimeType', 'dataUrl', 'byteLength', 'width', 'height', 'visible', 'transform'], `project image ${index + 1}`);
  const image = value as unknown as EmblemImageLayer;
  assertImageLayer(image, index);
  return image;
}

function assertImageLayer(value: unknown, index: number): asserts value is EmblemImageLayer {
  if (!isRecord(value)) throw new Error(`Invalid Emblem Creator image ${index + 1}.`);
  if (typeof value.id !== 'string' || value.id.trim() === '') throw new Error(`Invalid Emblem Creator image id at index ${index}.`);
  if (typeof value.name !== 'string' || value.name.trim() === '') throw new Error(`Invalid Emblem Creator image name at index ${index}.`);
  if (!VALID_IMAGE_MIME_TYPES.includes(value.mimeType as EmblemImageMimeType)) {
    throw new Error(`Unsupported Emblem Creator image MIME type: ${String(value.mimeType)}.`);
  }
  const prefix = `data:${value.mimeType};base64,`;
  if (typeof value.dataUrl !== 'string' || !value.dataUrl.startsWith(prefix)) {
    throw new Error(`Invalid Emblem Creator image data URL at index ${index}.`);
  }
  const base64 = value.dataUrl.slice(prefix.length);
  if (!base64 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
    throw new Error(`Invalid Emblem Creator image base64 data at index ${index}.`);
  }
  if (!Number.isInteger(value.byteLength) || (value.byteLength as number) <= 0 || (value.byteLength as number) > MAX_IMAGE_BYTES) {
    throw new Error(`Invalid Emblem Creator image size at index ${index}: ${String(value.byteLength)}.`);
  }
  if (base64ByteLength(base64) !== value.byteLength) {
    throw new Error(`Emblem Creator image size does not match its data at index ${index}.`);
  }
  if (!Number.isInteger(value.width) || (value.width as number) <= 0 || (value.width as number) > 32768) {
    throw new Error(`Invalid Emblem Creator image width at index ${index}: ${String(value.width)}.`);
  }
  if (!Number.isInteger(value.height) || (value.height as number) <= 0 || (value.height as number) > 32768) {
    throw new Error(`Invalid Emblem Creator image height at index ${index}: ${String(value.height)}.`);
  }
  if (typeof value.visible !== 'boolean') throw new Error(`Invalid Emblem Creator image visibility at index ${index}.`);
  assertImageTransform(value.transform, index);
}

function assertImageTransform(value: unknown, index: number): asserts value is CanvasTransform {
  if (!isRecord(value)) throw new Error(`Invalid Emblem Creator image transform at index ${index}.`);
  const allowedKeys = ['x', 'y', 'scale', 'scaleX', 'scaleY', 'rotation', 'flipHorizontal', 'flipVertical'];
  assertExactKeys(value, allowedKeys, `Emblem Creator image transform ${index + 1}`);
  for (const key of ['x', 'y', 'scale', 'rotation']) {
    if (typeof value[key] !== 'number' || !Number.isFinite(value[key])) {
      throw new Error(`Invalid Emblem Creator image transform ${key}: ${String(value[key])}.`);
    }
  }
  if ((value.x as number) < -100 || (value.x as number) > 100 || (value.y as number) < -110 || (value.y as number) > 110) {
    throw new Error(`Emblem Creator image position is outside the canvas: ${value.x}, ${value.y}.`);
  }
  if ((value.scale as number) <= 0 || (value.scale as number) > 5) {
    throw new Error(`Invalid Emblem Creator image scale: ${String(value.scale)}.`);
  }
  if ((value.rotation as number) < -360 || (value.rotation as number) > 360) {
    throw new Error(`Invalid Emblem Creator image rotation: ${String(value.rotation)}.`);
  }
  for (const key of ['scaleX', 'scaleY']) {
    if (key in value && (typeof value[key] !== 'number' || !Number.isFinite(value[key]) || (value[key] as number) <= 0 || (value[key] as number) > 5)) {
      throw new Error(`Invalid Emblem Creator image ${key}: ${String(value[key])}.`);
    }
  }
  for (const key of ['flipHorizontal', 'flipVertical']) {
    if (key in value && typeof value[key] !== 'boolean') {
      throw new Error(`Invalid Emblem Creator image ${key}: ${String(value[key])}.`);
    }
  }
}

function layerRenderRank(layer: CoatLayer, slotByLayerId: Record<string, EmblemLayerSlot>): number {
  if (layer.type === 'background') return -1;
  const slot = slotByLayerId[layer.id];
  if (!slot) throw new Error(`Missing Emblem Creator slot for layer ${layer.id}.`);
  return SLOT_RENDER_ORDER[slot];
}

function assertEmblemProjectLayers(project: CoatProject): void {
  const backgroundLayers = project.layers.filter((layer) => layer.type === 'background');
  if (backgroundLayers.length !== 1 || backgroundLayers[0]?.visible !== false) {
    throw new Error('Emblem Creator projects require one hidden transparent background layer.');
  }
  if (project.groups.length > 0) throw new Error('Emblem Creator projects cannot contain grouped layers.');
  for (const layer of project.layers) {
    if (layer.type === 'background' || layer.type === 'shield' || layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top') {
      continue;
    }
    throw new Error(`Unsupported Emblem Creator layer type: ${layer.type}.`);
  }
}

function isEmblemLayerSlot(value: unknown): value is EmblemLayerSlot {
  return typeof value === 'string' && EMBLEM_LAYER_SLOTS.includes(value as EmblemLayerSlot);
}

function base64ByteLength(base64: string): number {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return character;
    }
  });
}

function assertExactKeys(record: Record<string, unknown>, allowedKeys: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowedKeys.includes(key)) throw new Error(`Invalid ${label} property: ${key}.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
