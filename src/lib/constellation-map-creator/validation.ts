import {
  CONSTELLATION_STAR_ASSET_ID,
  getConstellationAsset,
} from './catalog';
import {
  CONSTELLATION_MAX_DIMENSION,
  CONSTELLATION_MAX_FILE_BYTES,
  CONSTELLATION_MAX_PIXELS,
} from './types';
import type {
  ConstellationBackground,
  ConstellationObject,
  ConstellationProject,
  ConstellationTransform,
} from './types';

export function describeConstellationValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  if (
    typeof receivedValue === 'number' ||
    typeof receivedValue === 'boolean' ||
    typeof receivedValue === 'bigint'
  ) {
    return String(receivedValue);
  }

  try {
    const serializedValue = JSON.stringify(receivedValue);
    return serializedValue === undefined
      ? Object.prototype.toString.call(receivedValue)
      : serializedValue;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      return `${Object.prototype.toString.call(receivedValue)} (JSON.stringify failed: ${error.message})`;
    }

    throw error;
  }
}

export function isConstellationRecord(
  receivedValue: unknown,
): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

export function requireConstellationObjectId(
  receivedObjectId: unknown,
  fieldName = 'Constellation object id',
): string {
  if (
    typeof receivedObjectId !== 'string' ||
    receivedObjectId.length === 0 ||
    receivedObjectId.trim() !== receivedObjectId
  ) {
    throw new Error(
      `${fieldName} must be a non-empty string without surrounding whitespace. Received ${describeConstellationValue(receivedObjectId)}.`,
    );
  }

  return receivedObjectId;
}

export function requireConstellationFiniteNumber(
  receivedNumber: unknown,
  fieldName: string,
): number {
  if (typeof receivedNumber !== 'number' || !Number.isFinite(receivedNumber)) {
    throw new Error(
      `${fieldName} must be a finite number. Received ${describeConstellationValue(receivedNumber)}.`,
    );
  }

  return receivedNumber;
}

export function requireConstellationBoolean(
  receivedBoolean: unknown,
  fieldName: string,
): boolean {
  if (typeof receivedBoolean !== 'boolean') {
    throw new Error(
      `${fieldName} must be a boolean. Received ${describeConstellationValue(receivedBoolean)}.`,
    );
  }

  return receivedBoolean;
}

export function requireConstellationCanvasDimension(
  receivedDimension: unknown,
  fieldName: string,
): number {
  const dimension = requireConstellationFiniteNumber(receivedDimension, fieldName);
  if (!Number.isInteger(dimension) || dimension < 1 || dimension > CONSTELLATION_MAX_DIMENSION) {
    throw new Error(
      `${fieldName} must be an integer from 1 to ${CONSTELLATION_MAX_DIMENSION}. Received ${describeConstellationValue(receivedDimension)}.`,
    );
  }

  return dimension;
}

export function requireConstellationCanvasSize(
  receivedWidth: unknown,
  receivedHeight: unknown,
): { width: number; height: number } {
  const width = requireConstellationCanvasDimension(receivedWidth, 'Constellation canvas width');
  const height = requireConstellationCanvasDimension(receivedHeight, 'Constellation canvas height');
  if (width * height > CONSTELLATION_MAX_PIXELS) {
    throw new Error(
      `Constellation canvas area must be at most ${CONSTELLATION_MAX_PIXELS} pixels. Received width=${width}, height=${height}, area=${width * height}.`,
    );
  }

  return { width, height };
}

export function requireConstellationObjectDimension(
  receivedDimension: unknown,
  fieldName: string,
): number {
  const dimension = requireConstellationFiniteNumber(receivedDimension, fieldName);
  if (dimension <= 0 || dimension > CONSTELLATION_MAX_DIMENSION) {
    throw new Error(
      `${fieldName} must be greater than 0 and at most ${CONSTELLATION_MAX_DIMENSION}. Received ${describeConstellationValue(receivedDimension)}.`,
    );
  }

  return dimension;
}

export function requireConstellationColor(receivedColor: unknown): string {
  if (
    typeof receivedColor !== 'string' ||
    !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(receivedColor)
  ) {
    throw new Error(
      `Constellation background color must be a 3- or 6-digit hexadecimal color. Received ${describeConstellationValue(receivedColor)}.`,
    );
  }

  return receivedColor;
}

export function requireConstellationImageUrl(receivedUrl: unknown): string {
  if (
    typeof receivedUrl !== 'string' ||
    receivedUrl.length === 0 ||
    receivedUrl.trim() !== receivedUrl ||
    /[\\\s]/.test(receivedUrl)
  ) {
    throw new Error(
      `Constellation background image URL must be a non-empty URL without surrounding whitespace. Received ${describeConstellationValue(receivedUrl)}.`,
    );
  }

  if (receivedUrl.startsWith('//')) {
    throw new Error(
      `Constellation background image URL must not be protocol-relative. Received ${JSON.stringify(receivedUrl)}.`,
    );
  }

  const isSameOriginRootPath = receivedUrl.startsWith('/');
  const isAbsoluteHttpsUrl = /^https:\/\/[^/\\?#]/i.test(receivedUrl);
  if (!isSameOriginRootPath && !isAbsoluteHttpsUrl) {
    throw new Error(
      `Constellation background image URL must be a same-origin root path or an absolute https URL. Received ${JSON.stringify(receivedUrl)}.`,
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = isSameOriginRootPath
      ? new URL(receivedUrl, 'https://tokenmaker.one')
      : new URL(receivedUrl);
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      throw new Error(
        `Constellation background image URL is invalid. Received ${JSON.stringify(receivedUrl)}. Reason: ${error.message}.`,
        { cause: error },
      );
    }

    throw error;
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error(
      `Constellation background image URL must use https or a same-origin root path. Received ${JSON.stringify(receivedUrl)} with protocol ${JSON.stringify(parsedUrl.protocol)}.`,
    );
  }

  if (parsedUrl.username.length > 0 || parsedUrl.password.length > 0) {
    throw new Error(
      `Constellation background image URL must not contain credentials. Received ${JSON.stringify(receivedUrl)}.`,
    );
  }

  return receivedUrl;
}

function requireExactConstellationFields(
  receivedRecord: Record<string, unknown>,
  expectedFieldNames: readonly string[],
  valueLabel: string,
): void {
  const actualFieldNames = Object.keys(receivedRecord).sort();
  const sortedExpectedFieldNames = [...expectedFieldNames].sort();
  const fieldsMatch =
    actualFieldNames.length === sortedExpectedFieldNames.length &&
    actualFieldNames.every(
      (fieldName, fieldIndex) => fieldName === sortedExpectedFieldNames[fieldIndex],
    );

  if (!fieldsMatch) {
    throw new Error(
      `${valueLabel} must contain exactly ${sortedExpectedFieldNames.join(', ')}. Received ${describeConstellationValue(receivedRecord)}.`,
    );
  }
}

function requireExactConstellationFieldsAllowingRotation(
  receivedRecord: Record<string, unknown>,
  requiredFieldNames: readonly string[],
  valueLabel: string,
): void {
  const actualFieldNames = Object.keys(receivedRecord).sort();
  const sortedRequiredFieldNames = [...requiredFieldNames].sort();
  const unknownFieldNames = actualFieldNames.filter(
    (fieldName) => fieldName !== 'rotation' && !sortedRequiredFieldNames.includes(fieldName),
  );
  const missingFieldNames = sortedRequiredFieldNames.filter(
    (fieldName) => !actualFieldNames.includes(fieldName),
  );
  if (unknownFieldNames.length === 0 && missingFieldNames.length === 0) return;

  throw new Error(
    `${valueLabel} must contain exactly ${sortedRequiredFieldNames.join(', ')} and may include rotation. Missing ${describeConstellationValue(missingFieldNames)}. Unknown ${describeConstellationValue(unknownFieldNames)}. Received ${describeConstellationValue(receivedRecord)}.`,
  );
}

function normalizeConstellationRotationDegrees(degrees: number): number {
  const fullCircleDegrees = 360;
  const wrappedDegrees =
    ((degrees % fullCircleDegrees) + fullCircleDegrees) % fullCircleDegrees;
  return wrappedDegrees === 0 ? 0 : wrappedDegrees;
}

function requireConstellationRotationDegrees(
  receivedRotation: unknown,
  fieldName: string,
): number {
  const degrees = requireConstellationFiniteNumber(receivedRotation, fieldName);
  return normalizeConstellationRotationDegrees(degrees);
}

function readOptionalConstellationRotationDegrees(
  receivedRecord: Record<string, unknown>,
  fieldName: string,
): number | undefined {
  if (!Object.keys(receivedRecord).includes('rotation')) return undefined;
  if (receivedRecord.rotation === undefined) return undefined;
  return requireConstellationRotationDegrees(receivedRecord.rotation, fieldName);
}

function requireStoredConstellationObjectRotation(
  receivedRecord: Record<string, unknown>,
  objectLabel: string,
): number {
  const rotationDegrees = readOptionalConstellationRotationDegrees(
    receivedRecord,
    `${objectLabel}.rotation`,
  );
  if (rotationDegrees === undefined) return 0;
  return rotationDegrees;
}

function cloneConstellationObject(object: ConstellationObject): ConstellationObject {
  return { ...object };
}

function cloneConstellationBackground(
  background: ConstellationBackground,
): ConstellationBackground {
  return { ...background };
}

export function cloneConstellationProject(project: ConstellationProject): ConstellationProject {
  return {
    width: project.width,
    height: project.height,
    background: cloneConstellationBackground(project.background),
    objects: project.objects.map(cloneConstellationObject),
  };
}

export function requireConstellationTransform(
  receivedTransform: unknown,
  fieldName: string,
): ConstellationTransform {
  if (!isConstellationRecord(receivedTransform)) {
    throw new Error(
      `${fieldName} must be an object with x, y, width, and height, and may include rotation. Received ${describeConstellationValue(receivedTransform)}.`,
    );
  }

  requireExactConstellationFieldsAllowingRotation(
    receivedTransform,
    ['height', 'width', 'x', 'y'],
    fieldName,
  );
  const x = requireConstellationFiniteNumber(receivedTransform.x, `${fieldName}.x`);
  const y = requireConstellationFiniteNumber(receivedTransform.y, `${fieldName}.y`);
  const width = requireConstellationObjectDimension(receivedTransform.width, `${fieldName}.width`);
  const height = requireConstellationObjectDimension(receivedTransform.height, `${fieldName}.height`);

  if (x < 0 || y < 0) {
    throw new Error(
      `${fieldName}.x and ${fieldName}.y must be non-negative. Received x=${x}, y=${y}.`,
    );
  }

  const rotation = readOptionalConstellationRotationDegrees(
    receivedTransform,
    `${fieldName}.rotation`,
  );
  if (rotation === undefined) return { x, y, width, height };
  return { x, y, width, height, rotation };
}

function requireConstellationBackground(
  receivedBackground: unknown,
): ConstellationBackground {
  if (!isConstellationRecord(receivedBackground)) {
    throw new Error(
      `Constellation project background must be an object. Received ${describeConstellationValue(receivedBackground)}.`,
    );
  }

  requireExactConstellationFields(
    receivedBackground,
    ['color', 'imageHeight', 'imageUrl', 'imageWidth', 'transparent'],
    'Constellation project background',
  );
  const color = requireConstellationColor(receivedBackground.color);
  const transparent = requireConstellationBoolean(
    receivedBackground.transparent,
    'Constellation project background transparent',
  );
  const imageUrl = receivedBackground.imageUrl;

  if (imageUrl === null) {
    if (receivedBackground.imageWidth !== null || receivedBackground.imageHeight !== null) {
      throw new Error(
        `Constellation project background image dimensions must be null when imageUrl is null. Received imageWidth=${describeConstellationValue(receivedBackground.imageWidth)}, imageHeight=${describeConstellationValue(receivedBackground.imageHeight)}.`,
      );
    }

    return { color, transparent, imageUrl: null, imageWidth: null, imageHeight: null };
  }

  const validImageUrl = requireConstellationImageUrl(imageUrl);
  const imageDimensions = requireConstellationImageDimensions(
    receivedBackground.imageWidth,
    receivedBackground.imageHeight,
  );

  return {
    color,
    transparent,
    imageUrl: validImageUrl,
    imageWidth: imageDimensions.width,
    imageHeight: imageDimensions.height,
  };
}

function requireConstellationObject(
  receivedObject: unknown,
  objectIndex: number,
): ConstellationObject {
  const objectLabel = `Constellation project object ${objectIndex + 1}`;
  if (!isConstellationRecord(receivedObject)) {
    throw new Error(`${objectLabel} must be an object. Received ${describeConstellationValue(receivedObject)}.`);
  }

  requireExactConstellationFieldsAllowingRotation(
    receivedObject,
    ['assetId', 'height', 'id', 'kind', 'width', 'x', 'y'],
    objectLabel,
  );
  const id = requireConstellationObjectId(receivedObject.id, `${objectLabel} id`);
  const kind = receivedObject.kind;
  if (kind !== 'constellation' && kind !== 'star') {
    throw new Error(
      `${objectLabel} kind must be constellation or star. Received ${describeConstellationValue(kind)}.`,
    );
  }

  const assetId = receivedObject.assetId;
  if (typeof assetId !== 'string' || assetId.length === 0) {
    throw new Error(
      `${objectLabel} assetId must be a non-empty string. Received ${describeConstellationValue(assetId)}.`,
    );
  }

  if (kind === 'constellation') {
    getConstellationAsset(assetId);
  } else if (assetId !== CONSTELLATION_STAR_ASSET_ID) {
    throw new Error(
      `${objectLabel} star assetId must be ${JSON.stringify(CONSTELLATION_STAR_ASSET_ID)}. Received ${JSON.stringify(assetId)}.`,
    );
  }

  const transform = requireConstellationTransform(
    {
      x: receivedObject.x,
      y: receivedObject.y,
      width: receivedObject.width,
      height: receivedObject.height,
    },
    objectLabel,
  );
  const rotation = requireStoredConstellationObjectRotation(receivedObject, objectLabel);
  return {
    id,
    kind,
    assetId,
    x: transform.x,
    y: transform.y,
    width: transform.width,
    height: transform.height,
    rotation,
  };
}

export function requireConstellationProject(
  receivedProject: unknown,
): ConstellationProject {
  if (!isConstellationRecord(receivedProject)) {
    throw new Error(
      `Constellation project must be an object. Received ${describeConstellationValue(receivedProject)}.`,
    );
  }

  requireExactConstellationFields(
    receivedProject,
    ['background', 'height', 'objects', 'width'],
    'Constellation project',
  );
  const { width, height } = requireConstellationCanvasSize(
    receivedProject.width,
    receivedProject.height,
  );
  const background = requireConstellationBackground(receivedProject.background);
  if (!Array.isArray(receivedProject.objects)) {
    throw new Error(
      `Constellation project objects must be an array. Received ${describeConstellationValue(receivedProject.objects)}.`,
    );
  }

  const objectIds = new Set<string>();
  const objects = receivedProject.objects.map((receivedObject, objectIndex) => {
    const object = requireConstellationObject(receivedObject, objectIndex);
    if (objectIds.has(object.id)) {
      throw new Error(
        `Constellation project object ids must be unique. Received duplicate ${JSON.stringify(object.id)}.`,
      );
    }

    objectIds.add(object.id);
    return object;
  });

  return { width, height, background, objects };
}

export function assertConstellationProject(
  receivedProject: unknown,
): asserts receivedProject is ConstellationProject {
  requireConstellationProject(receivedProject);
}

export function requireConstellationFileText(receivedText: unknown): string {
  if (typeof receivedText !== 'string') {
    throw new Error(
      `Constellation project file text must be a string. Received ${describeConstellationValue(receivedText)}.`,
    );
  }

  const encodedText = new TextEncoder().encode(receivedText);
  if (encodedText.byteLength > CONSTELLATION_MAX_FILE_BYTES) {
    throw new Error(
      `Constellation project file must be at most ${CONSTELLATION_MAX_FILE_BYTES} bytes. Received ${encodedText.byteLength} bytes.`,
    );
  }

  return receivedText;
}

export function requireConstellationImageDimensions(
  receivedWidth: unknown,
  receivedHeight: unknown,
): { width: number; height: number } {
  const width = requireConstellationFiniteNumber(
    receivedWidth,
    'Constellation background image natural width',
  );
  const height = requireConstellationFiniteNumber(
    receivedHeight,
    'Constellation background image natural height',
  );
  const maxImageDimension = CONSTELLATION_MAX_DIMENSION * 16;
  if (!Number.isInteger(width) || width <= 0 || width > maxImageDimension) {
    throw new Error(
      `Constellation background image natural width must be a positive integer at most ${maxImageDimension}. Received ${describeConstellationValue(receivedWidth)}.`,
    );
  }
  if (!Number.isInteger(height) || height <= 0 || height > maxImageDimension) {
    throw new Error(
      `Constellation background image natural height must be a positive integer at most ${maxImageDimension}. Received ${describeConstellationValue(receivedHeight)}.`,
    );
  }
  return { width, height };
}
