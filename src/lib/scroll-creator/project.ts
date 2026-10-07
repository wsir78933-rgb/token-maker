import {
  SCROLL_DEFAULT_HEIGHT,
  SCROLL_DEFAULT_WIDTH,
  SCROLL_MAX_CUSTOM_FONTS,
  SCROLL_MAX_IMAGES,
  SCROLL_MAX_PROJECT_JSON_BYTES,
  SCROLL_MAX_TEXT_LENGTH,
  SCROLL_MAX_HEIGHT,
  SCROLL_MAX_WIDTH,
  SCROLL_MIN_HEIGHT,
  SCROLL_MIN_WIDTH,
  type ScrollImage,
  type ScrollProject,
  type ScrollTextAlign,
  type ScrollTextStyle,
} from './types';
import { SCROLL_FONT_OPTIONS, SCROLL_PAPERS } from './catalog';
import { requireScrollImageGeometry } from './geometry';

type ScrollRecord = Record<string, unknown>;

const SCROLL_PROJECT_KEYS = [
  'version',
  'paperId',
  'width',
  'height',
  'text',
  'textStyle',
  'images',
  'customFonts',
] as const;

const SCROLL_TEXT_STYLE_KEYS = [
  'fontFamily',
  'fontSize',
  'color',
  'bold',
  'italic',
  'align',
] as const;

const SCROLL_IMAGE_KEYS = ['id', 'url', 'x', 'y', 'width', 'height'] as const;

const SCROLL_CUSTOM_FONT_KEYS = ['family', 'stylesheetUrl'] as const;

const SCROLL_COLOR_PATTERN = /^#[\da-f]{6}$/i;
const SCROLL_IMAGE_ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;
const SCROLL_BUILT_IN_FONT_FAMILY_KEYS = new Set(
  SCROLL_FONT_OPTIONS.map((fontOption) => normalizeScrollFontFamilyKey(fontOption.family)),
);

export function createDefaultScrollProject(): ScrollProject {
  return {
    version: 1,
    paperId: 'paper01',
    width: SCROLL_DEFAULT_WIDTH,
    height: SCROLL_DEFAULT_HEIGHT,
    text: '',
    textStyle: {
      fontFamily: 'Trebuchet MS',
      fontSize: 20,
      color: '#24180e',
      bold: false,
      italic: false,
      align: 'left',
    },
    images: [],
    customFonts: [],
  };
}

export function requireScrollProject(value: unknown): ScrollProject {
  const projectRecord = requireScrollRecord(value, 'project');
  requireExactScrollKeys(projectRecord, SCROLL_PROJECT_KEYS, 'project');

  if (projectRecord.version !== 1) {
    throw new TypeError(
      'project.version must be 1; received ' + describeScrollValue(projectRecord.version),
    );
  }

  const paperId = requireScrollPaperId(projectRecord.paperId, 'project.paperId');
  const width = requireScrollDimension(projectRecord.width, 'project.width', SCROLL_MIN_WIDTH, SCROLL_MAX_WIDTH);
  const height = requireScrollDimension(
    projectRecord.height,
    'project.height',
    SCROLL_MIN_HEIGHT,
    SCROLL_MAX_HEIGHT,
  );

  if (typeof projectRecord.text !== 'string') {
    throw new TypeError(
      'project.text must be a string; received ' + describeScrollValue(projectRecord.text),
    );
  }
  if (projectRecord.text.length > SCROLL_MAX_TEXT_LENGTH) {
    throw new RangeError(
      'project.text must contain at most ' +
        SCROLL_MAX_TEXT_LENGTH +
        ' UTF-16 code units; received ' +
        projectRecord.text.length,
    );
  }

  const customFonts = requireScrollCustomFonts(projectRecord.customFonts, 'project.customFonts');
  const allowedFontFamilies = new Set([
    ...SCROLL_FONT_OPTIONS.map((fontOption) => fontOption.family),
    ...customFonts.map((font) => font.family),
  ]);
  const textStyle = requireScrollTextStyle(
    projectRecord.textStyle,
    'project.textStyle',
    allowedFontFamilies,
  );
  const images = requireScrollImages(projectRecord.images, 'project.images');

  return {
    version: 1,
    paperId,
    width,
    height,
    text: projectRecord.text,
    textStyle,
    images,
    customFonts,
  };
}

export function parseScrollProjectJson(contents: string): ScrollProject {
  if (typeof contents !== 'string') {
    throw new TypeError(
      'Scroll project JSON must be a string; received ' + describeScrollValue(contents),
    );
  }
  requireScrollJsonByteLength(contents);

  let parsedProject: unknown;
  try {
    parsedProject = JSON.parse(contents);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(
        'Invalid scroll project JSON with ' + contents.length + ' UTF-16 code units: ' + error.message,
      );
    }
    throw error;
  }

  return requireScrollProject(parsedProject);
}

export function serializeScrollProject(project: ScrollProject): string {
  const validatedProject = requireScrollProject(project);
  const serializedProject = JSON.stringify(validatedProject);
  if (typeof serializedProject !== 'string') {
    throw new TypeError(
      'Scroll project could not be serialized; received ' + describeScrollValue(validatedProject),
    );
  }
  requireScrollJsonByteLength(serializedProject);
  return serializedProject;
}

function requireScrollTextStyle(
  value: unknown,
  path: string,
  allowedFontFamilies: ReadonlySet<string>,
): ScrollTextStyle {
  const styleRecord = requireScrollRecord(value, path);
  requireExactScrollKeys(styleRecord, SCROLL_TEXT_STYLE_KEYS, path);

  if (typeof styleRecord.fontFamily !== 'string' || styleRecord.fontFamily.trim().length === 0) {
    throw new TypeError(
      path +
        '.fontFamily must be a non-empty string; received ' +
        describeScrollValue(styleRecord.fontFamily),
    );
  }
  if (styleRecord.fontFamily !== styleRecord.fontFamily.trim()) {
    throw new TypeError(
      path +
        '.fontFamily must not have leading or trailing whitespace; received ' +
        describeScrollValue(styleRecord.fontFamily),
    );
  }
  if (styleRecord.fontFamily.length > 200) {
    throw new RangeError(
      path + '.fontFamily must contain at most 200 characters; received ' + styleRecord.fontFamily.length,
    );
  }
  if (!allowedFontFamilies.has(styleRecord.fontFamily)) {
    throw new TypeError(
      path +
        '.fontFamily must match a built-in or saved custom font family; received ' +
        describeScrollValue(styleRecord.fontFamily),
    );
  }
  requireFiniteNumberInRange(styleRecord.fontSize, path + '.fontSize', 8, 96);
  if (typeof styleRecord.color !== 'string' || !SCROLL_COLOR_PATTERN.test(styleRecord.color)) {
    throw new TypeError(
      path +
        '.color must be a six-digit hexadecimal color; received ' +
        describeScrollValue(styleRecord.color),
    );
  }
  requireBoolean(styleRecord.bold, path + '.bold');
  requireBoolean(styleRecord.italic, path + '.italic');
  requireScrollTextAlign(styleRecord.align, path + '.align');

  return {
    fontFamily: styleRecord.fontFamily,
    fontSize: styleRecord.fontSize,
    color: styleRecord.color,
    bold: styleRecord.bold,
    italic: styleRecord.italic,
    align: styleRecord.align,
  };
}

function requireScrollImages(value: unknown, path: string): ScrollImage[] {
  if (!Array.isArray(value)) {
    throw new TypeError(path + ' must be an array; received ' + describeScrollValue(value));
  }
  if (value.length > SCROLL_MAX_IMAGES) {
    throw new RangeError(
      path + ' must contain at most ' + SCROLL_MAX_IMAGES + ' images; received ' + value.length,
    );
  }

  const imageIds = new Set<string>();
  return value.map((imageValue, index) => {
    const imagePath = path + '[' + index + ']';
    const imageRecord = requireScrollRecord(imageValue, imagePath);
    requireExactScrollKeys(imageRecord, SCROLL_IMAGE_KEYS, imagePath);
    requireScrollImageId(imageRecord.id, imagePath + '.id');
    if (imageIds.has(imageRecord.id)) {
      throw new TypeError(
        imagePath + '.id duplicates an earlier image id; received ' + describeScrollValue(imageRecord.id),
      );
    }
    imageIds.add(imageRecord.id);
    const imageUrl = requireScrollImageUrl(imageRecord.url, imagePath + '.url');
    const imageGeometry = requireScrollImageGeometry(
      {
        x: imageRecord.x,
        y: imageRecord.y,
        width: imageRecord.width,
        height: imageRecord.height,
      },
      imagePath,
    );

    return {
      id: imageRecord.id,
      url: imageUrl,
      ...imageGeometry,
    };
  });
}

function requireScrollCustomFonts(value: unknown, path: string) {
  if (!Array.isArray(value)) {
    throw new TypeError(path + ' must be an array; received ' + describeScrollValue(value));
  }
  if (value.length > SCROLL_MAX_CUSTOM_FONTS) {
    throw new RangeError(
      path +
        ' must contain at most ' +
        SCROLL_MAX_CUSTOM_FONTS +
        ' custom fonts; received ' +
        value.length,
    );
  }

  const customFontFamilyKeys = new Set<string>();
  return value.map((fontValue, index) => {
    const fontPath = path + '[' + index + ']';
    const fontRecord = requireScrollRecord(fontValue, fontPath);
    requireExactScrollKeys(fontRecord, SCROLL_CUSTOM_FONT_KEYS, fontPath);
    const family = requireScrollFontFamily(fontRecord.family, fontPath + '.family');
    const familyKey = normalizeScrollFontFamilyKey(family);
    if (SCROLL_BUILT_IN_FONT_FAMILY_KEYS.has(familyKey)) {
      throw new TypeError(
        fontPath +
          '.family must not duplicate a built-in font family; received ' +
          describeScrollValue(family),
      );
    }
    if (customFontFamilyKeys.has(familyKey)) {
      throw new TypeError(
        fontPath +
          '.family duplicates an earlier custom font family; received ' +
          describeScrollValue(family),
      );
    }
    customFontFamilyKeys.add(familyKey);
    const stylesheetUrl = requireScrollFontStylesheetUrl(
      fontRecord.stylesheetUrl,
      fontPath + '.stylesheetUrl',
    );
    return { family, stylesheetUrl };
  });
}

function requireScrollFontFamily(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(
      path + ' must be a non-empty string; received ' + describeScrollValue(value),
    );
  }
  if (value !== value.trim()) {
    throw new TypeError(
      path + ' must not have leading or trailing whitespace; received ' + describeScrollValue(value),
    );
  }
  if (value.length > 200) {
    throw new RangeError(path + ' must contain at most 200 characters; received ' + value.length);
  }
  return value;
}

function requireScrollDimension(value: unknown, path: string, minimum: number, maximum: number): number {
  requireFiniteNumberInRange(value, path, minimum, maximum);
  return value;
}

function requireScrollPaperId(value: unknown, path: string): string {
  if (typeof value !== 'string' || !SCROLL_PAPERS.some((paper) => paper.id === value)) {
    throw new TypeError(
      path +
        ' must be one of ' +
        SCROLL_PAPERS.map((paper) => paper.id).join(', ') +
        '; received ' +
        describeScrollValue(value),
    );
  }
  return value;
}

function requireScrollImageId(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || !SCROLL_IMAGE_ID_PATTERN.test(value)) {
    throw new TypeError(
      path +
        ' must match ' +
        SCROLL_IMAGE_ID_PATTERN +
        '; received ' +
        describeScrollValue(value),
    );
  }
}

export function requireScrollImageUrl(value: unknown, path = 'image URL'): string {
  if (typeof value !== 'string') {
    throw new TypeError(path + ' must be a URL string; received ' + describeScrollValue(value));
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TypeError(path + ' must be an HTTPS URL or localhost HTTP URL; received ' + describeScrollValue(value));
    }
    throw error;
  }

  const isSecureRemote = parsedUrl.protocol === 'https:';
  const isLocalHttp =
    parsedUrl.protocol === 'http:' &&
    (parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname === '127.0.0.1' ||
      parsedUrl.hostname === '[::1]' ||
      parsedUrl.hostname === '::1');
  if (!isSecureRemote && !isLocalHttp) {
    throw new TypeError(
      path +
        ' must be an HTTPS URL or localhost HTTP URL; received ' +
        describeScrollValue(value),
    );
  }
  return value;
}

export function requireScrollFontStylesheetUrl(value: unknown, path = 'font stylesheet URL'): string {
  if (typeof value !== 'string') {
    throw new TypeError(path + ' must be a Google Fonts HTTPS URL; received ' + describeScrollValue(value));
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TypeError(path + ' must be a Google Fonts HTTPS URL; received ' + describeScrollValue(value));
    }
    throw error;
  }
  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.hostname !== 'fonts.googleapis.com' ||
    !/^\/(?:css|css2)(?:\/|$)/.test(parsedUrl.pathname)
  ) {
    throw new TypeError(
      path +
        ' must use https://fonts.googleapis.com/css or /css2; received ' +
      describeScrollValue(value),
    );
  }
  return value;
}

function requireScrollTextAlign(value: unknown, path: string): asserts value is ScrollTextAlign {
  if (value !== 'left' && value !== 'center' && value !== 'right') {
    throw new TypeError(
      path + ' must be left, center, or right; received ' + describeScrollValue(value),
    );
  }
}

function requireFiniteNumberInRange(value: unknown, path: string, minimum: number, maximum: number): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(path + ' must be a finite number; received ' + describeScrollValue(value));
  }
  if (value < minimum || value > maximum) {
    throw new RangeError(
      path + ' must be between ' + minimum + ' and ' + maximum + '; received ' + value,
    );
  }
}

function requireBoolean(value: unknown, path: string): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new TypeError(path + ' must be a boolean; received ' + describeScrollValue(value));
  }
}

function requireScrollRecord(value: unknown, path: string): ScrollRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(path + ' must be an object; received ' + describeScrollValue(value));
  }
  return value as ScrollRecord;
}

function requireExactScrollKeys(
  record: ScrollRecord,
  expectedKeys: readonly string[],
  path: string,
): void {
  const receivedKeys = Object.keys(record).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  if (
    receivedKeys.length !== sortedExpectedKeys.length ||
    receivedKeys.some((key, index) => key !== sortedExpectedKeys[index])
  ) {
    throw new TypeError(
      path +
        ' must contain exactly keys ' +
        sortedExpectedKeys.join(', ') +
        '; received ' +
        receivedKeys.join(', '),
    );
  }
}

function requireScrollJsonByteLength(contents: string): void {
  const byteLength = new TextEncoder().encode(contents).byteLength;
  if (byteLength > SCROLL_MAX_PROJECT_JSON_BYTES) {
    throw new RangeError(
      'Scroll project JSON must be at most ' +
        SCROLL_MAX_PROJECT_JSON_BYTES +
        ' UTF-8 bytes; received ' +
        byteLength,
    );
  }
}

function describeScrollValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array(length=' + value.length + ')';
  return Object.prototype.toString.call(value);
}

function normalizeScrollFontFamilyKey(family: string): string {
  return family.toLowerCase();
}
