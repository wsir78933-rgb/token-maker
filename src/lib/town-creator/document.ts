import {
  getTownAsset,
  getTownAssetVariant,
} from './catalog';
import type {
  TownDocument,
  TownLayer,
  TownLayerId,
  TownMaterial,
  TownObject,
  TownObjectPatch,
} from './types';

export const TOWN_DOCUMENT_VERSION = 1 as const;
export const TOWN_DEFAULT_CANVAS_WIDTH = 1200;
export const TOWN_DEFAULT_CANVAS_HEIGHT = 800;
export const TOWN_MIN_CANVAS_SIZE = 64;
export const TOWN_MAX_CANVAS_SIZE = 4096;
export const TOWN_DEFAULT_BACKGROUND_COLOR = '#e5ddc4';

const TOWN_LAYER_IDS: readonly TownLayerId[] = ['lower', 'middle', 'upper'];
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const IMAGE_DATA_URL_PATTERN = /^data:image\/[a-z0-9.+-]+(?:[;,]|$)/i;
const TOWN_DOCUMENT_KEYS = [
  'activeLayer',
  'backgroundColor',
  'backgroundImageUrl',
  'height',
  'layers',
  'version',
  'width',
] as const;
const TOWN_LAYER_KEYS = ['id', 'objects', 'visible'] as const;
const TOWN_OBJECT_KEYS = [
  'assetId',
  'height',
  'id',
  'material',
  'rotationDegrees',
  'width',
  'x',
  'y',
] as const;
const TOWN_OBJECT_PATCH_KEYS = ['height', 'rotationDegrees', 'width', 'x', 'y'] as const;
const TOWN_BACKGROUND_KEYS = ['color', 'imageUrl'] as const;

type TownLayerTuple = readonly [TownLayer, TownLayer, TownLayer];

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? String(value) : serialized;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `${Object.prototype.toString.call(value)} (${error.message})`;
    }

    throw error;
  }
}

function readPlainObject(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object, received ${describeReceivedValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function requireExactKeys(
  record: Record<string, unknown>,
  expectedKeys: readonly string[],
  label: string,
): void {
  const actualKeys = Object.keys(record).sort();
  const requiredKeys = [...expectedKeys].sort();
  if (
    actualKeys.length !== requiredKeys.length ||
    actualKeys.some((key, index) => key !== requiredKeys[index])
  ) {
    throw new Error(
      `${label} must contain exactly ${requiredKeys.join(', ')}, received ${describeReceivedValue(record)}.`,
    );
  }
}

function readNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string, received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function readFiniteNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number, received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function readPositiveNumber(value: unknown, label: string): number {
  const numberValue = readFiniteNumber(value, label);
  if (numberValue <= 0) {
    throw new Error(`${label} must be greater than 0, received ${describeReceivedValue(value)}.`);
  }

  return numberValue;
}

function readCanvasSize(value: unknown, label: string): number {
  const numberValue = readFiniteNumber(value, label);
  if (numberValue < TOWN_MIN_CANVAS_SIZE || numberValue > TOWN_MAX_CANVAS_SIZE) {
    throw new Error(
      `${label} must be from ${TOWN_MIN_CANVAS_SIZE} to ${TOWN_MAX_CANVAS_SIZE}, received ${describeReceivedValue(value)}.`,
    );
  }

  return numberValue;
}

function readHexColor(value: unknown, label: string): string {
  if (typeof value !== 'string' || !HEX_COLOR_PATTERN.test(value)) {
    throw new Error(`${label} must be a 6-digit hex color, received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function readBackgroundImageUrl(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error(
      `Town background image URL must be a string, received ${describeReceivedValue(value)}.`,
    );
  }

  if (value.length === 0 || IMAGE_DATA_URL_PATTERN.test(value)) {
    if (value.length === 0 || value.includes(',')) {
      return value;
    }
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      throw new Error(
        `Town background image URL must be empty, http(s), or data:image, received ${describeReceivedValue(value)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  if ((parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') && parsedUrl.hostname.length > 0) {
    return value;
  }

  throw new Error(
    `Town background image URL must be empty, http(s), or data:image, received ${describeReceivedValue(value)}.`,
  );
}

function readTownLayerId(value: unknown, label: string): TownLayerId {
  if (TOWN_LAYER_IDS.some((layerId) => layerId === value)) {
    return value as TownLayerId;
  }

  throw new Error(`${label} must be lower, middle, or upper, received ${describeReceivedValue(value)}.`);
}

function readTownMaterial(value: unknown, assetId: string): TownMaterial {
  if (value !== 'wood' && value !== 'stone' && value !== 'clay' && value !== 'sandstone' && value !== 'neutral') {
    throw new Error(`Town object material for ${JSON.stringify(assetId)} is invalid, received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function cloneTownObject(object: TownObject): TownObject {
  return { ...object };
}

function cloneTownLayer(layer: TownLayer): TownLayer {
  return {
    id: layer.id,
    visible: layer.visible,
    objects: layer.objects.map(cloneTownObject),
  };
}

function cloneTownDocument(document: TownDocument): TownDocument {
  const clonedLayers = document.layers.map(cloneTownLayer);
  return {
    version: TOWN_DOCUMENT_VERSION,
    width: document.width,
    height: document.height,
    backgroundColor: document.backgroundColor,
    backgroundImageUrl: document.backgroundImageUrl,
    activeLayer: document.activeLayer,
    layers: requireTownLayerTuple(clonedLayers),
  };
}

function requireTownLayerTuple(layers: readonly TownLayer[]): TownLayerTuple {
  const byId = new Map(layers.map((layer) => [layer.id, layer]));
  const lower = byId.get('lower');
  const middle = byId.get('middle');
  const upper = byId.get('upper');
  if (lower === undefined || middle === undefined || upper === undefined) {
    throw new Error('Town document layers must contain lower, middle, and upper exactly once.');
  }

  return [lower, middle, upper];
}

function readTownObject(
  value: unknown,
  layerId: TownLayerId,
  objectIndex: number,
  objectIds: Set<string>,
): TownObject {
  const label = `Town layer ${JSON.stringify(layerId)} object ${objectIndex + 1}`;
  const object = readPlainObject(value, label);
  requireExactKeys(object, TOWN_OBJECT_KEYS, label);
  const id = readNonEmptyString(object.id, `${label} id`);
  if (objectIds.has(id)) {
    throw new Error(`Town document contains duplicate object id ${JSON.stringify(id)}.`);
  }
  objectIds.add(id);

  const assetId = readNonEmptyString(object.assetId, `${label} assetId`);
  getTownAsset(assetId);
  const material = readTownMaterial(object.material, assetId);
  getTownAssetVariant(assetId, material);

  return {
    id,
    assetId,
    material,
    x: readFiniteNumber(object.x, `${label} x`),
    y: readFiniteNumber(object.y, `${label} y`),
    width: readPositiveNumber(object.width, `${label} width`),
    height: readPositiveNumber(object.height, `${label} height`),
    rotationDegrees: readFiniteNumber(object.rotationDegrees, `${label} rotationDegrees`),
  };
}

function readTownLayer(value: unknown, layerIndex: number, objectIds: Set<string>): TownLayer {
  const label = `Town layer ${layerIndex + 1}`;
  const layer = readPlainObject(value, label);
  requireExactKeys(layer, TOWN_LAYER_KEYS, label);
  const id = readTownLayerId(layer.id, `${label} id`);
  if (typeof layer.visible !== 'boolean') {
    throw new Error(`${label} visible must be a boolean, received ${describeReceivedValue(layer.visible)}.`);
  }
  if (!Array.isArray(layer.objects)) {
    throw new Error(`${label} objects must be an array, received ${describeReceivedValue(layer.objects)}.`);
  }

  return {
    id,
    visible: layer.visible,
    objects: layer.objects.map((object, objectIndex) =>
      readTownObject(object, id, objectIndex, objectIds),
    ),
  };
}

function readTownDocument(value: unknown): TownDocument {
  const document = readPlainObject(value, 'Town document');
  requireExactKeys(document, TOWN_DOCUMENT_KEYS, 'Town document');
  if (document.version !== TOWN_DOCUMENT_VERSION) {
    throw new Error(
      `Town document version must be ${TOWN_DOCUMENT_VERSION}, received ${describeReceivedValue(document.version)}.`,
    );
  }

  const activeLayer = readTownLayerId(document.activeLayer, 'Town document activeLayer');
  if (!Array.isArray(document.layers) || document.layers.length !== TOWN_LAYER_IDS.length) {
    throw new Error(
      `Town document layers must contain exactly ${TOWN_LAYER_IDS.length} layers, received ${describeReceivedValue(document.layers)}.`,
    );
  }

  const objectIds = new Set<string>();
  const layers = document.layers.map((layer, layerIndex) =>
    readTownLayer(layer, layerIndex, objectIds),
  );
  const layerIds = new Set(layers.map((layer) => layer.id));
  if (layerIds.size !== TOWN_LAYER_IDS.length) {
    throw new Error('Town document layers must contain lower, middle, and upper exactly once.');
  }

  return {
    version: TOWN_DOCUMENT_VERSION,
    width: readCanvasSize(document.width, 'Town document width'),
    height: readCanvasSize(document.height, 'Town document height'),
    backgroundColor: readHexColor(document.backgroundColor, 'Town document backgroundColor'),
    backgroundImageUrl: readBackgroundImageUrl(document.backgroundImageUrl),
    activeLayer,
    layers: requireTownLayerTuple(layers),
  };
}

function findTownLayerIndex(document: TownDocument, layerId: TownLayerId): number {
  const layerIndex = document.layers.findIndex((layer) => layer.id === layerId);
  if (layerIndex < 0) {
    throw new Error(`Town document does not contain layer ${JSON.stringify(layerId)}.`);
  }

  return layerIndex;
}

function findTownObjectLocation(document: TownDocument, objectId: string): {
  layerIndex: number;
  objectIndex: number;
} {
  for (let layerIndex = 0; layerIndex < document.layers.length; layerIndex += 1) {
    const objectIndex = document.layers[layerIndex]?.objects.findIndex((object) => object.id === objectId) ?? -1;
    if (objectIndex >= 0) {
      return { layerIndex, objectIndex };
    }
  }

  throw new Error(`Unknown town object id ${JSON.stringify(objectId)}.`);
}

function readTownObjectId(value: unknown): string {
  return readNonEmptyString(value, 'Town object id');
}

function readTownObjectPatch(value: unknown): TownObjectPatch {
  const patch = readPlainObject(value, 'Town object patch');
  const allowedKeys = new Set<string>(TOWN_OBJECT_PATCH_KEYS);
  for (const key of Object.keys(patch)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Town object patch contains unsupported key ${JSON.stringify(key)}.`);
    }
  }

  const validatedPatch: TownObjectPatch = {};
  if ('x' in patch) validatedPatch.x = readFiniteNumber(patch.x, 'Town object patch x');
  if ('y' in patch) validatedPatch.y = readFiniteNumber(patch.y, 'Town object patch y');
  if ('width' in patch) validatedPatch.width = readPositiveNumber(patch.width, 'Town object patch width');
  if ('height' in patch) validatedPatch.height = readPositiveNumber(patch.height, 'Town object patch height');
  if ('rotationDegrees' in patch) {
    validatedPatch.rotationDegrees = readFiniteNumber(
      patch.rotationDegrees,
      'Town object patch rotationDegrees',
    );
  }
  return validatedPatch;
}

function replaceTownLayer(
  document: TownDocument,
  layerIndex: number,
  nextLayer: TownLayer,
): TownDocument {
  const layers = document.layers.map((layer, index) =>
    index === layerIndex ? nextLayer : cloneTownLayer(layer),
  );
  return { ...document, layers: requireTownLayerTuple(layers) };
}

export function createTownDocument(): TownDocument {
  return {
    version: TOWN_DOCUMENT_VERSION,
    width: TOWN_DEFAULT_CANVAS_WIDTH,
    height: TOWN_DEFAULT_CANVAS_HEIGHT,
    backgroundColor: TOWN_DEFAULT_BACKGROUND_COLOR,
    backgroundImageUrl: '',
    activeLayer: 'lower',
    layers: [
      { id: 'lower', visible: true, objects: [] },
      { id: 'middle', visible: true, objects: [] },
      { id: 'upper', visible: true, objects: [] },
    ],
  };
}

export function validateTownDocument(value: unknown): TownDocument {
  return readTownDocument(value);
}

export function getTownObject(document: TownDocument, objectId: string): TownObject {
  const validatedDocument = validateTownDocument(document);
  const validatedObjectId = readTownObjectId(objectId);
  const location = findTownObjectLocation(validatedDocument, validatedObjectId);
  const object = validatedDocument.layers[location.layerIndex]?.objects[location.objectIndex];
  if (object === undefined) {
    throw new Error(`Town object ${JSON.stringify(validatedObjectId)} disappeared during lookup.`);
  }

  return cloneTownObject(object);
}

export function addTownObject(
  document: TownDocument,
  assetId: string,
  material: TownMaterial,
  objectId: string,
  point?: { x: number; y: number },
): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedAssetId = readNonEmptyString(assetId, 'Town asset id');
  const asset = getTownAsset(validatedAssetId);
  const validatedMaterial = readTownMaterial(material, validatedAssetId);
  getTownAssetVariant(validatedAssetId, validatedMaterial);
  const validatedObjectId = readTownObjectId(objectId);

  if (validatedDocument.layers.some((layer) => layer.objects.some((object) => object.id === validatedObjectId))) {
    throw new Error(`Town document contains duplicate object id ${JSON.stringify(validatedObjectId)}.`);
  }

  const position = point === undefined
    ? {
        x: (validatedDocument.width - asset.width) / 2,
        y: (validatedDocument.height - asset.height) / 2,
      }
    : (() => {
        const value = readPlainObject(point, 'Town object point');
        requireExactKeys(value, ['x', 'y'], 'Town object point');
        return {
          x: readFiniteNumber(value.x, 'Town object point x'),
          y: readFiniteNumber(value.y, 'Town object point y'),
        };
      })();

  const object: TownObject = {
    id: validatedObjectId,
    assetId: validatedAssetId,
    material: validatedMaterial,
    x: position.x,
    y: position.y,
    width: asset.width,
    height: asset.height,
    rotationDegrees: 0,
  };
  const layerIndex = findTownLayerIndex(validatedDocument, validatedDocument.activeLayer);
  const layer = validatedDocument.layers[layerIndex];
  if (layer === undefined) {
    throw new Error(`Town active layer ${JSON.stringify(validatedDocument.activeLayer)} is unavailable.`);
  }

  return replaceTownLayer(validatedDocument, layerIndex, {
    ...layer,
    objects: [...layer.objects.map(cloneTownObject), object],
  });
}

export function updateTownObject(
  document: TownDocument,
  objectId: string,
  patch: TownObjectPatch,
): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedObjectId = readTownObjectId(objectId);
  const validatedPatch = readTownObjectPatch(patch);
  const location = findTownObjectLocation(validatedDocument, validatedObjectId);
  const layer = validatedDocument.layers[location.layerIndex];
  const object = layer?.objects[location.objectIndex];
  if (layer === undefined || object === undefined) {
    throw new Error(`Town object ${JSON.stringify(validatedObjectId)} disappeared during update.`);
  }

  const nextObject: TownObject = { ...object, ...validatedPatch };
  return replaceTownLayer(validatedDocument, location.layerIndex, {
    ...layer,
    objects: layer.objects.map((candidate, index) =>
      index === location.objectIndex ? nextObject : cloneTownObject(candidate),
    ),
  });
}

export function selectTownObject(document: TownDocument, objectId: string): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedObjectId = readTownObjectId(objectId);
  const location = findTownObjectLocation(validatedDocument, validatedObjectId);
  const layer = validatedDocument.layers[location.layerIndex];
  if (layer === undefined) {
    throw new Error(`Town object ${JSON.stringify(validatedObjectId)} has no containing layer.`);
  }

  const object = layer.objects[location.objectIndex];
  if (object === undefined) {
    throw new Error(`Town object ${JSON.stringify(validatedObjectId)} disappeared during selection.`);
  }

  return replaceTownLayer(validatedDocument, location.layerIndex, {
    ...layer,
    objects: [
      ...layer.objects.filter((candidate) => candidate.id !== validatedObjectId).map(cloneTownObject),
      cloneTownObject(object),
    ],
  });
}

export function copyTownObject(
  document: TownDocument,
  objectId: string,
  targetLayer: TownLayerId,
  newObjectId: string,
): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedObjectId = readTownObjectId(objectId);
  const validatedTargetLayer = readTownLayerId(targetLayer, 'Town target layer');
  const validatedNewObjectId = readTownObjectId(newObjectId);
  const location = findTownObjectLocation(validatedDocument, validatedObjectId);
  if (validatedDocument.layers.some((layer) => layer.objects.some((object) => object.id === validatedNewObjectId))) {
    throw new Error(`Town document contains duplicate object id ${JSON.stringify(validatedNewObjectId)}.`);
  }

  const sourceLayer = validatedDocument.layers[location.layerIndex];
  const sourceObject = sourceLayer?.objects[location.objectIndex];
  if (sourceObject === undefined) {
    throw new Error(`Town object ${JSON.stringify(validatedObjectId)} disappeared during copy.`);
  }

  const targetLayerIndex = findTownLayerIndex(validatedDocument, validatedTargetLayer);
  const destinationLayer = validatedDocument.layers[targetLayerIndex];
  if (destinationLayer === undefined) {
    throw new Error(`Town target layer ${JSON.stringify(validatedTargetLayer)} is unavailable.`);
  }

  return replaceTownLayer(validatedDocument, targetLayerIndex, {
    ...destinationLayer,
    objects: [
      ...destinationLayer.objects.map(cloneTownObject),
      { ...cloneTownObject(sourceObject), id: validatedNewObjectId },
    ],
  });
}

export function deleteTownObject(document: TownDocument, objectId: string): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedObjectId = readTownObjectId(objectId);
  const location = findTownObjectLocation(validatedDocument, validatedObjectId);
  const layer = validatedDocument.layers[location.layerIndex];
  if (layer === undefined) {
    throw new Error(`Town object ${JSON.stringify(validatedObjectId)} has no containing layer.`);
  }

  return replaceTownLayer(validatedDocument, location.layerIndex, {
    ...layer,
    objects: layer.objects
      .filter((object) => object.id !== validatedObjectId)
      .map(cloneTownObject),
  });
}

export function setTownActiveLayer(document: TownDocument, layerId: TownLayerId): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedLayerId = readTownLayerId(layerId, 'Town active layer');
  findTownLayerIndex(validatedDocument, validatedLayerId);
  return { ...cloneTownDocument(validatedDocument), activeLayer: validatedLayerId };
}

export function setTownLayerVisibility(
  document: TownDocument,
  layerId: TownLayerId,
  visible: boolean,
): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedLayerId = readTownLayerId(layerId, 'Town layer');
  if (typeof visible !== 'boolean') {
    throw new Error(`Town layer visibility must be a boolean, received ${describeReceivedValue(visible)}.`);
  }
  const layerIndex = findTownLayerIndex(validatedDocument, validatedLayerId);
  const layer = validatedDocument.layers[layerIndex];
  if (layer === undefined) {
    throw new Error(`Town layer ${JSON.stringify(validatedLayerId)} is unavailable.`);
  }

  return replaceTownLayer(validatedDocument, layerIndex, { ...layer, visible });
}

export function clearTownLayer(document: TownDocument, layerId: TownLayerId): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedLayerId = readTownLayerId(layerId, 'Town layer');
  const layerIndex = findTownLayerIndex(validatedDocument, validatedLayerId);
  const layer = validatedDocument.layers[layerIndex];
  if (layer === undefined) {
    throw new Error(`Town layer ${JSON.stringify(validatedLayerId)} is unavailable.`);
  }

  return replaceTownLayer(validatedDocument, layerIndex, { ...layer, objects: [] });
}

export function clearTownObjects(document: TownDocument): TownDocument {
  const validatedDocument = validateTownDocument(document);
  return {
    ...validatedDocument,
    layers: requireTownLayerTuple(validatedDocument.layers.map((layer) => ({ ...layer, objects: [] }))),
  };
}

export function resizeTownCanvas(document: TownDocument, width: number, height: number): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const validatedWidth = readCanvasSize(width, 'Town canvas width');
  const validatedHeight = readCanvasSize(height, 'Town canvas height');
  return { ...cloneTownDocument(validatedDocument), width: validatedWidth, height: validatedHeight };
}

export function setTownBackground(
  document: TownDocument,
  background: { color: string; imageUrl: string },
): TownDocument {
  const validatedDocument = validateTownDocument(document);
  const receivedBackground = readPlainObject(background, 'Town background');
  requireExactKeys(receivedBackground, TOWN_BACKGROUND_KEYS, 'Town background');
  const color = readHexColor(receivedBackground.color, 'Town background color');
  const imageUrl = readBackgroundImageUrl(receivedBackground.imageUrl);
  return {
    ...cloneTownDocument(validatedDocument),
    backgroundColor: color,
    backgroundImageUrl: imageUrl,
  };
}
