import { requireEmblemImageUrl } from './image-url';
import {
  EMBLEM_CANVAS,
  EMBLEM_DEFAULT_LAYER_VISIBILITY,
  EMBLEM_LAYER_ORDER,
  MAX_EMBLEM_PROJECT_FILE_BYTES,
  type EmblemAssetCategory,
  type EmblemBodyLayerId,
  type EmblemElement,
  type EmblemElementSource,
  type EmblemElementTransform,
  type EmblemLayerId,
  type EmblemProject,
  type EmblemProjectCommand,
} from './types';

type EmblemRecord = Record<string, unknown>;

const EMBLEM_BODY_LAYER_IDS: readonly EmblemBodyLayerId[] = Object.freeze([
  'body4',
  'body3',
  'body2',
  'body1',
]);

const EMBLEM_TRANSFORM_KEYS = ['x', 'y', 'scale', 'rotation', 'mirrorX'] as const;

export function createDefaultEmblemProject(): EmblemProject {
  return {
    schemaVersion: 1,
    canvas: { width: EMBLEM_CANVAS.width, height: EMBLEM_CANVAS.height },
    layers: {
      crests: { visible: EMBLEM_DEFAULT_LAYER_VISIBILITY.crests, elements: [] },
      details: { visible: EMBLEM_DEFAULT_LAYER_VISIBILITY.details, elements: [] },
      body1: { visible: EMBLEM_DEFAULT_LAYER_VISIBILITY.body1, elements: [] },
      body2: { visible: EMBLEM_DEFAULT_LAYER_VISIBILITY.body2, elements: [] },
      body3: { visible: EMBLEM_DEFAULT_LAYER_VISIBILITY.body3, elements: [] },
      body4: { visible: EMBLEM_DEFAULT_LAYER_VISIBILITY.body4, elements: [] },
    },
  };
}

export function createEmblemElement(source: EmblemElementSource, id: string): EmblemElement {
  requireEmblemId(id, 'element id');
  assertEmblemElementSource(source, 'element source');

  const scale = 256 / Math.max(source.naturalWidth, source.naturalHeight);
  if (!Number.isFinite(scale) || scale <= 0) {
    throw new RangeError(
      'Cannot create emblem element with source dimensions ' +
        source.naturalWidth +
        ' by ' +
        source.naturalHeight +
        '; computed scale is ' +
        describeEmblemValue(scale),
    );
  }

  return {
    id,
    source: { ...source },
    transform: {
      x: EMBLEM_CANVAS.width / 2,
      y: EMBLEM_CANVAS.height / 2,
      scale,
      rotation: 0,
      mirrorX: false,
    },
  };
}

export function assertEmblemProject(value: unknown): asserts value is EmblemProject {
  const projectRecord = requireEmblemRecord(value, 'project');
  requireExactEmblemKeys(projectRecord, ['schemaVersion', 'canvas', 'layers'], 'project');

  if (projectRecord.schemaVersion !== 1) {
    throw new TypeError('project.schemaVersion must be 1; received ' + describeEmblemValue(projectRecord.schemaVersion));
  }

  assertEmblemCanvas(projectRecord.canvas);
  assertEmblemLayers(projectRecord.layers);
}

export function applyEmblemProjectCommand(
  project: EmblemProject,
  command: EmblemProjectCommand,
): EmblemProject {
  assertEmblemProject(project);
  const validatedCommand = validateEmblemProjectCommand(command);

  switch (validatedCommand.type) {
    case 'add-element':
      return addEmblemElement(project, validatedCommand.layerId, validatedCommand.element);
    case 'set-element-transform':
      return setEmblemElementTransform(
        project,
        validatedCommand.elementId,
        validatedCommand.transform,
      );
    case 'remove-element':
      return removeEmblemElement(project, validatedCommand.elementId);
    case 'clear-layer':
      return clearEmblemLayer(project, validatedCommand.layerId);
    case 'set-layer-visibility':
      return setEmblemLayerVisibility(
        project,
        validatedCommand.layerId,
        validatedCommand.visible,
      );
  }
}

export function serializeEmblemProject(project: EmblemProject): string {
  assertEmblemProject(project);

  const serializedProject = JSON.stringify(project);
  if (typeof serializedProject !== 'string') {
    throw new TypeError('Emblem project could not be serialized; received ' + describeEmblemValue(project));
  }

  requireEmblemProjectSize(serializedProject);
  return serializedProject;
}

export function parseEmblemProjectJson(contents: string): EmblemProject {
  if (typeof contents !== 'string') {
    throw new TypeError('Emblem project JSON must be a string; received ' + describeEmblemValue(contents));
  }

  requireEmblemProjectSize(contents);

  let parsedProject: unknown;
  try {
    parsedProject = JSON.parse(contents);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(
        'Invalid emblem project JSON with ' +
          contents.length +
          ' UTF-16 code units: ' +
          error.message,
      );
    }
    throw error;
  }

  assertEmblemProject(parsedProject);
  return parsedProject;
}

export function getEmblemTargetLayer(
  category: EmblemAssetCategory,
  project: EmblemProject,
): EmblemLayerId {
  assertEmblemAssetCategory(category);
  assertEmblemProject(project);

  switch (category) {
    case 'body': {
      const targetLayerId = EMBLEM_BODY_LAYER_IDS.find((layerId) => project.layers[layerId].elements.length === 0);
      if (targetLayerId) return targetLayerId;

      const occupiedLayerIds = EMBLEM_BODY_LAYER_IDS.filter((layerId) => project.layers[layerId].elements.length > 0);
      throw new RangeError(
        'No empty body layer is available; ' + occupiedLayerIds.length + '/4 occupied (' +
          occupiedLayerIds.join(', ') + ').',
      );
    }
    case 'detail':
      return 'details';
    case 'crest':
      return 'crests';
  }
}

function assertEmblemCanvas(value: unknown): void {
  const canvasRecord = requireEmblemRecord(value, 'project.canvas');
  requireExactEmblemKeys(canvasRecord, ['width', 'height'], 'project.canvas');
  requireExactEmblemDimension(canvasRecord.width, EMBLEM_CANVAS.width, 'project.canvas.width');
  requireExactEmblemDimension(canvasRecord.height, EMBLEM_CANVAS.height, 'project.canvas.height');
}

function assertEmblemLayers(value: unknown): void {
  const layersRecord = requireEmblemRecord(value, 'project.layers');
  requireExactEmblemKeys(layersRecord, EMBLEM_LAYER_ORDER, 'project.layers');

  const elementLocations = new Map<string, string>();
  for (const layerId of EMBLEM_LAYER_ORDER) {
    const layerPath = 'project.layers.' + layerId;
    const layerRecord = requireEmblemRecord(layersRecord[layerId], layerPath);
    requireExactEmblemKeys(layerRecord, ['visible', 'elements'], layerPath);
    requireBoolean(layerRecord.visible, layerPath + '.visible');

    if (!Array.isArray(layerRecord.elements)) {
      throw new TypeError(
        layerPath +
          '.elements must be an array; received ' +
          describeEmblemValue(layerRecord.elements),
      );
    }

    for (let index = 0; index < layerRecord.elements.length; index += 1) {
      const elementPath = layerPath + '.elements[' + index + ']';
      const element = layerRecord.elements[index];
      assertEmblemElement(element, elementPath);

      const previousLocation = elementLocations.get(element.id);
      if (previousLocation !== undefined) {
        throw new TypeError(
          'Duplicate emblem element id ' +
            JSON.stringify(element.id) +
            ' at ' +
            elementPath +
            '; first used at ' +
            previousLocation,
        );
      }
      elementLocations.set(element.id, elementPath);
    }

    if (isEmblemBodyLayer(layerId) && layerRecord.elements.length > 1) {
      const elementIds = layerRecord.elements.map((elementValue) => {
        const elementRecord = requireEmblemRecord(elementValue, layerPath + '.elements[]');
        return elementRecord.id;
      });
      throw new TypeError(
        layerPath +
          ' may contain at most one body element; received ' +
          layerRecord.elements.length +
          ' elements with ids ' +
          describeEmblemValue(elementIds),
      );
    }
  }
}

function assertEmblemElement(value: unknown, path: string): asserts value is EmblemElement {
  const elementRecord = requireEmblemRecord(value, path);
  requireExactEmblemKeys(elementRecord, ['id', 'source', 'transform'], path);
  requireEmblemId(elementRecord.id, path + '.id');
  assertEmblemElementSource(elementRecord.source, path + '.source');
  assertEmblemElementTransform(elementRecord.transform, path + '.transform');
}

function assertEmblemElementSource(
  value: unknown,
  path: string,
): asserts value is EmblemElementSource {
  const sourceRecord = requireEmblemRecord(value, path);
  const sourceKind = sourceRecord.kind;

  if (sourceKind === 'catalog') {
    requireExactEmblemKeys(
      sourceRecord,
      ['kind', 'assetId', 'url', 'naturalWidth', 'naturalHeight'],
      path,
    );
    requireEmblemId(sourceRecord.assetId, path + '.assetId');
  } else if (sourceKind === 'url') {
    requireExactEmblemKeys(
      sourceRecord,
      ['kind', 'url', 'naturalWidth', 'naturalHeight'],
      path,
    );
  } else {
    throw new TypeError(
      path +
        '.kind must be catalog or url; received ' +
        describeEmblemValue(sourceKind),
    );
  }

  requireEmblemImageUrlAtPath(sourceRecord.url, path + '.url');
  requirePositiveFiniteNumber(sourceRecord.naturalWidth, path + '.naturalWidth');
  requirePositiveFiniteNumber(sourceRecord.naturalHeight, path + '.naturalHeight');
}

function assertEmblemElementTransform(value: unknown, path: string): void {
  const transformRecord = requireEmblemRecord(value, path);
  requireExactEmblemKeys(transformRecord, EMBLEM_TRANSFORM_KEYS, path);
  requireCanvasCoordinate(transformRecord.x, path + '.x', EMBLEM_CANVAS.width);
  requireCanvasCoordinate(transformRecord.y, path + '.y', EMBLEM_CANVAS.height);
  requirePositiveFiniteNumber(transformRecord.scale, path + '.scale');
  requireFiniteNumber(transformRecord.rotation, path + '.rotation');
  requireBoolean(transformRecord.mirrorX, path + '.mirrorX');
}

function validateEmblemProjectCommand(value: unknown): EmblemProjectCommand {
  const commandRecord = requireEmblemRecord(value, 'command');

  switch (commandRecord.type) {
    case 'add-element':
      requireExactEmblemKeys(commandRecord, ['type', 'layerId', 'element'], 'command');
      assertEmblemLayerId(commandRecord.layerId, 'command.layerId');
      assertEmblemElement(commandRecord.element, 'command.element');
      return commandRecord as EmblemProjectCommand;
    case 'set-element-transform':
      requireExactEmblemKeys(
        commandRecord,
        ['type', 'elementId', 'transform'],
        'command',
      );
      requireEmblemId(commandRecord.elementId, 'command.elementId');
      assertEmblemElementTransform(commandRecord.transform, 'command.transform');
      return commandRecord as EmblemProjectCommand;
    case 'remove-element':
      requireExactEmblemKeys(commandRecord, ['type', 'elementId'], 'command');
      requireEmblemId(commandRecord.elementId, 'command.elementId');
      return commandRecord as EmblemProjectCommand;
    case 'clear-layer':
      requireExactEmblemKeys(commandRecord, ['type', 'layerId'], 'command');
      assertEmblemLayerId(commandRecord.layerId, 'command.layerId');
      return commandRecord as EmblemProjectCommand;
    case 'set-layer-visibility':
      requireExactEmblemKeys(
        commandRecord,
        ['type', 'layerId', 'visible'],
        'command',
      );
      assertEmblemLayerId(commandRecord.layerId, 'command.layerId');
      requireBoolean(commandRecord.visible, 'command.visible');
      return commandRecord as EmblemProjectCommand;
    default:
      throw new TypeError(
        'Unknown emblem project command type: ' + describeEmblemValue(commandRecord.type),
      );
  }
}

function addEmblemElement(
  project: EmblemProject,
  layerId: EmblemLayerId,
  element: EmblemElement,
): EmblemProject {
  const currentLayer = project.layers[layerId];
  const nextElements = isEmblemBodyLayer(layerId)
    ? [copyEmblemElement(element)]
    : [...currentLayer.elements, copyEmblemElement(element)];
  const nextProject: EmblemProject = {
    ...project,
    layers: {
      ...project.layers,
      [layerId]: { ...currentLayer, elements: nextElements },
    },
  };
  assertEmblemProject(nextProject);
  return nextProject;
}

function setEmblemElementTransform(
  project: EmblemProject,
  elementId: string,
  transform: EmblemElementTransform,
): EmblemProject {
  const matchingLayerId = findEmblemElementLayer(project, elementId, 'update transform for');
  const matchingLayer = project.layers[matchingLayerId];
  const nextElements = matchingLayer.elements.map((element) =>
    element.id === elementId
      ? { ...element, transform: copyEmblemElementTransform(transform) }
      : element,
  );

  return {
    ...project,
    layers: {
      ...project.layers,
      [matchingLayerId]: { ...matchingLayer, elements: nextElements },
    },
  };
}

function removeEmblemElement(project: EmblemProject, elementId: string): EmblemProject {
  const matchingLayerId = findEmblemElementLayer(project, elementId, 'remove');
  const matchingLayer = project.layers[matchingLayerId];
  const nextElements = matchingLayer.elements.filter((element) => element.id !== elementId);

  return {
    ...project,
    layers: {
      ...project.layers,
      [matchingLayerId]: { ...matchingLayer, elements: nextElements },
    },
  };
}

function clearEmblemLayer(project: EmblemProject, layerId: EmblemLayerId): EmblemProject {
  return {
    ...project,
    layers: {
      ...project.layers,
      [layerId]: { ...project.layers[layerId], elements: [] },
    },
  };
}

function setEmblemLayerVisibility(
  project: EmblemProject,
  layerId: EmblemLayerId,
  visible: boolean,
): EmblemProject {
  return {
    ...project,
    layers: {
      ...project.layers,
      [layerId]: { ...project.layers[layerId], visible },
    },
  };
}

function findEmblemElementLayer(
  project: EmblemProject,
  elementId: string,
  operation: string,
): EmblemLayerId {
  for (const layerId of EMBLEM_LAYER_ORDER) {
    if (project.layers[layerId].elements.some((element) => element.id === elementId)) {
      return layerId;
    }
  }

  throw new RangeError(
    'Cannot ' +
      operation +
      ' emblem element id ' +
      JSON.stringify(elementId) +
      ': no element with that id exists',
  );
}

function copyEmblemElement(element: EmblemElement): EmblemElement {
  return {
    id: element.id,
    source: { ...element.source },
    transform: copyEmblemElementTransform(element.transform),
  };
}

function copyEmblemElementTransform(
  transform: EmblemElementTransform,
): EmblemElementTransform {
  return {
    x: transform.x,
    y: transform.y,
    scale: transform.scale,
    rotation: transform.rotation,
    mirrorX: transform.mirrorX,
  };
}

function requireEmblemImageUrlAtPath(value: unknown, path: string): void {
  try {
    requireEmblemImageUrl(value as string);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TypeError(path + ': ' + error.message);
    }
    throw error;
  }
}

function requireEmblemProjectSize(contents: string): void {
  const byteLength = new TextEncoder().encode(contents).byteLength;
  if (byteLength > MAX_EMBLEM_PROJECT_FILE_BYTES) {
    throw new RangeError(
      'Emblem project JSON is ' +
        byteLength +
        ' UTF-8 bytes; the maximum is ' +
        MAX_EMBLEM_PROJECT_FILE_BYTES +
        ' bytes',
    );
  }
}

function requireEmblemRecord(value: unknown, path: string): EmblemRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(path + ' must be an object; received ' + describeEmblemValue(value));
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError(path + ' must be a plain object; received ' + describeEmblemValue(value));
  }

  return value as EmblemRecord;
}

function requireExactEmblemKeys(
  value: EmblemRecord,
  expectedKeys: readonly string[],
  path: string,
): void {
  const actualKeys = Reflect.ownKeys(value);
  const missingKeys = expectedKeys.filter((key) => !Object.prototype.hasOwnProperty.call(value, key));
  const extraKeys = actualKeys
    .filter((key) => typeof key !== 'string' || !expectedKeys.includes(key))
    .map((key) => (typeof key === 'symbol' ? key.toString() : key));

  if (missingKeys.length > 0 || extraKeys.length > 0) {
    throw new TypeError(
      path +
        ' must contain exactly keys ' +
        describeEmblemValue(expectedKeys) +
        '; missing ' +
        describeEmblemValue(missingKeys) +
        ', extra ' +
        describeEmblemValue(extraKeys),
    );
  }
}

function requireEmblemId(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(path + ' must be a non-empty string; received ' + describeEmblemValue(value));
  }
}

function assertEmblemLayerId(value: unknown, path: string): asserts value is EmblemLayerId {
  if (
    typeof value !== 'string' ||
    !EMBLEM_LAYER_ORDER.includes(value as EmblemLayerId)
  ) {
    throw new TypeError(
      path +
        ' must be one of ' +
        describeEmblemValue(EMBLEM_LAYER_ORDER) +
        '; received ' +
        describeEmblemValue(value),
    );
  }
}

function assertEmblemAssetCategory(value: unknown): asserts value is EmblemAssetCategory {
  if (value !== 'body' && value !== 'detail' && value !== 'crest') {
    throw new TypeError(
      'asset category must be body, detail, or crest; received ' +
        describeEmblemValue(value),
    );
  }
}

function requireExactEmblemDimension(value: unknown, expected: number, path: string): void {
  if (value !== expected) {
    throw new TypeError(
      path + ' must be ' + expected + '; received ' + describeEmblemValue(value),
    );
  }
}

function requireCanvasCoordinate(value: unknown, path: string, maximum: number): void {
  requireFiniteNumber(value, path);
  if ((value as number) < 0 || (value as number) > maximum) {
    throw new RangeError(
      path +
        ' must be between 0 and ' +
        maximum +
        '; received ' +
        describeEmblemValue(value),
    );
  }
}

function requirePositiveFiniteNumber(value: unknown, path: string): void {
  requireFiniteNumber(value, path);
  if ((value as number) <= 0) {
    throw new RangeError(path + ' must be greater than 0; received ' + describeEmblemValue(value));
  }
}

function requireFiniteNumber(value: unknown, path: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(path + ' must be a finite number; received ' + describeEmblemValue(value));
  }
}

function requireBoolean(value: unknown, path: string): void {
  if (typeof value !== 'boolean') {
    throw new TypeError(path + ' must be a boolean; received ' + describeEmblemValue(value));
  }
}

function isEmblemBodyLayer(layerId: EmblemLayerId): layerId is EmblemBodyLayerId {
  return EMBLEM_BODY_LAYER_IDS.includes(layerId as EmblemBodyLayerId);
}

function describeEmblemValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' && !Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (typeof value === 'bigint') {
    return value.toString() + 'n';
  }

  try {
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? String(value) : serializedValue;
  } catch (error) {
    if (error instanceof TypeError) {
      return '[unserializable value: ' + error.message + ']';
    }
    throw error;
  }
}
