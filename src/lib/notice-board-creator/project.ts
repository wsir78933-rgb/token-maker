import {
  isNoticePaperId,
  NOTICE_BOARD_DEFAULT_WIDTH,
  NOTICE_BOARD_FONTS,
  NOTICE_BOARD_MAX_WIDTH,
  NOTICE_BOARD_MIN_WIDTH,
  NOTICE_MIN_WIDTH,
} from './catalog';
import { getBoardHeight, getNoticeHeight } from './geometry';
import { NoticeBoardFontError, requireNoticeBoardFont } from './fonts';
import {
  NoticeBoardValidationError,
  type BoardNotice,
  type NoticeBoardFont,
  type NoticeBoardProject,
  type NoticePaperId,
  type NoticeTextStyle,
} from './types';

export { NoticeBoardValidationError } from './types';

export const NOTICE_BOARD_MAX_NOTICES = 100;
export const NOTICE_BOARD_MAX_CUSTOM_FONTS = 24;
export const NOTICE_BOARD_MAX_NOTICE_TEXT_LENGTH = 50_000;
export const NOTICE_BOARD_MAX_PROJECT_FILE_BYTES = 1_048_576;

const NOTICE_ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;
const NOTICE_COLOR_PATTERN = /^#[\da-f]{6}$/i;
const NOTICE_PROJECT_KEYS = ['version', 'boardWidth', 'notices', 'customFonts'] as const;
const NOTICE_KEYS = ['id', 'paperId', 'text', 'x', 'y', 'width', 'style'] as const;
const NOTICE_TEXT_STYLE_KEYS = [
  'fontFamily',
  'fontSize',
  'lineHeight',
  'color',
  'textAlign',
  'fontStyle',
] as const;

export function createEmptyNoticeBoardProject(): NoticeBoardProject {
  return {
    version: 1,
    boardWidth: NOTICE_BOARD_DEFAULT_WIDTH,
    notices: [],
    customFonts: [],
  };
}

export function createBoardNotice(
  paperId: NoticePaperId,
  id: string,
  boardWidth: number,
): BoardNotice {
  requireNoticePaperId(paperId, 'paperId');
  requireNoticeId(id, 'notice id');
  requireBoardWidth(boardWidth, 'board width');

  return {
    id,
    paperId,
    text: '',
    x: 0,
    y: 0,
    width: Math.min(200, boardWidth),
    style: {
      fontFamily: NOTICE_BOARD_FONTS[0].family,
      fontSize: 20,
      lineHeight: 20,
      color: '#1d0f03',
      textAlign: 'left',
      fontStyle: 'normal',
    },
  };
}

export function requireNoticeBoardProject(projectValue: unknown): NoticeBoardProject {
  const projectRecord = requireNoticeBoardRecord(projectValue, 'project');
  requireExactNoticeBoardKeys(projectRecord, NOTICE_PROJECT_KEYS, 'project');

  if (projectRecord.version !== 1) {
    throw new NoticeBoardValidationError(
      'project.version must be 1; received ' + describeNoticeBoardValue(projectRecord.version),
    );
  }

  const boardWidth = requireBoardWidth(projectRecord.boardWidth, 'project.boardWidth');
  const customFonts = requireNoticeBoardFonts(projectRecord.customFonts, 'project.customFonts');
  const allowedFontFamilies = new Set([
    ...NOTICE_BOARD_FONTS.map((fontOption) => fontOption.family),
    ...customFonts.map((font) => font.family),
  ]);
  const notices = requireBoardNotices(
    projectRecord.notices,
    'project.notices',
    boardWidth,
    allowedFontFamilies,
  );

  return {
    version: 1,
    boardWidth,
    notices,
    customFonts,
  };
}

export function serializeNoticeBoardFile(project: NoticeBoardProject): string {
  const validatedProject = requireNoticeBoardProject(project);
  const serializedProject = JSON.stringify(validatedProject);
  if (typeof serializedProject !== 'string') {
    throw new NoticeBoardValidationError(
      'project could not be serialized; received ' + describeNoticeBoardValue(validatedProject),
    );
  }
  requireNoticeBoardFileSize(serializedProject);
  return serializedProject;
}

export function parseNoticeBoardFile(contents: string): NoticeBoardProject {
  if (typeof contents !== 'string') {
    throw new NoticeBoardValidationError(
      'notice board file must be a string; received ' + describeNoticeBoardValue(contents),
    );
  }
  requireNoticeBoardFileSize(contents);

  let parsedProject: unknown;
  try {
    parsedProject = JSON.parse(contents);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new NoticeBoardValidationError(
        'notice board file is not valid JSON; received ' +
          describeNoticeBoardValue(contents) +
          ' at ' +
          contents.length +
          ' UTF-16 code units: ' +
          error.message,
      );
    }
    throw error;
  }

  return requireNoticeBoardProject(parsedProject);
}

function requireBoardNotices(
  noticesValue: unknown,
  path: string,
  boardWidth: number,
  allowedFontFamilies: ReadonlySet<string>,
): BoardNotice[] {
  if (!Array.isArray(noticesValue)) {
    throw new NoticeBoardValidationError(
      path + ' must be an array; received ' + describeNoticeBoardValue(noticesValue),
    );
  }
  if (noticesValue.length > NOTICE_BOARD_MAX_NOTICES) {
    throw new NoticeBoardValidationError(
      path +
        ' must contain at most ' +
        NOTICE_BOARD_MAX_NOTICES +
        ' notices; received ' +
        noticesValue.length,
    );
  }

  const noticeIds = new Set<string>();
  return noticesValue.map((noticeValue, index) => {
    const noticePath = path + '[' + index + ']';
    const noticeRecord = requireNoticeBoardRecord(noticeValue, noticePath);
    requireExactNoticeBoardKeys(noticeRecord, NOTICE_KEYS, noticePath);
    const noticeId = requireNoticeId(noticeRecord.id, noticePath + '.id');
    if (noticeIds.has(noticeId)) {
      throw new NoticeBoardValidationError(
        noticePath + '.id duplicates an earlier notice id; received ' +
          describeNoticeBoardValue(noticeRecord.id),
      );
    }
    noticeIds.add(noticeId);

    const paperId = requireNoticePaperId(noticeRecord.paperId, noticePath + '.paperId');
    if (typeof noticeRecord.text !== 'string') {
      throw new NoticeBoardValidationError(
        noticePath + '.text must be a string; received ' + describeNoticeBoardValue(noticeRecord.text),
      );
    }
    if (noticeRecord.text.length > NOTICE_BOARD_MAX_NOTICE_TEXT_LENGTH) {
      throw new NoticeBoardValidationError(
        noticePath +
          '.text must contain at most ' +
          NOTICE_BOARD_MAX_NOTICE_TEXT_LENGTH +
          ' UTF-16 code units; received ' +
          noticeRecord.text.length,
      );
    }

    const x = requireFiniteNumber(noticeRecord.x, noticePath + '.x');
    const y = requireFiniteNumber(noticeRecord.y, noticePath + '.y');
    const width = requireNumberInRange(
      noticeRecord.width,
      noticePath + '.width',
      NOTICE_MIN_WIDTH,
      boardWidth,
    );
    const style = requireNoticeTextStyle(
      noticeRecord.style,
      noticePath + '.style',
      allowedFontFamilies,
    );
    const height = getNoticeHeight(width);
    const boardHeight = getBoardHeight(boardWidth);

    if (x < 0 || x + width > boardWidth) {
      throw new NoticeBoardValidationError(
        noticePath + '.x and .width must keep the notice inside board width ' + boardWidth +
          '; received x=' + x + ', width=' + width,
      );
    }
    if (y < 0 || y + height > boardHeight) {
      throw new NoticeBoardValidationError(
        noticePath + '.y and derived height must keep the notice inside board height ' + boardHeight +
          '; received y=' + y + ', height=' + height,
      );
    }

    return {
      id: noticeId,
      paperId,
      text: noticeRecord.text,
      x,
      y,
      width,
      style,
    };
  });
}

function requireNoticeTextStyle(
  styleValue: unknown,
  path: string,
  allowedFontFamilies: ReadonlySet<string>,
): NoticeTextStyle {
  const styleRecord = requireNoticeBoardRecord(styleValue, path);
  requireExactNoticeBoardKeys(styleRecord, NOTICE_TEXT_STYLE_KEYS, path);

  if (typeof styleRecord.fontFamily !== 'string' || styleRecord.fontFamily.trim().length === 0) {
    throw new NoticeBoardValidationError(
      path + '.fontFamily must be a non-empty string; received ' +
        describeNoticeBoardValue(styleRecord.fontFamily),
    );
  }
  if (
    styleRecord.fontFamily !== styleRecord.fontFamily.trim() ||
    styleRecord.fontFamily.length > 200 ||
    !allowedFontFamilies.has(styleRecord.fontFamily)
  ) {
    throw new NoticeBoardValidationError(
      path + '.fontFamily must match a built-in or project custom font; received ' +
        describeNoticeBoardValue(styleRecord.fontFamily),
    );
  }

  const fontSize = requireNumberInRange(styleRecord.fontSize, path + '.fontSize', 8, 96);
  const lineHeight = requireNumberInRange(styleRecord.lineHeight, path + '.lineHeight', 8, 192);
  if (typeof styleRecord.color !== 'string' || !NOTICE_COLOR_PATTERN.test(styleRecord.color)) {
    throw new NoticeBoardValidationError(
      path + '.color must be a six-digit hexadecimal color; received ' +
        describeNoticeBoardValue(styleRecord.color),
    );
  }

  const textAlign = requireTextAlign(styleRecord.textAlign, path + '.textAlign');
  const fontStyle = requireFontStyle(styleRecord.fontStyle, path + '.fontStyle');

  return {
    fontFamily: styleRecord.fontFamily,
    fontSize,
    lineHeight,
    color: styleRecord.color,
    textAlign,
    fontStyle,
  };
}

function requireNoticeBoardFonts(fontsValue: unknown, path: string): NoticeBoardFont[] {
  if (!Array.isArray(fontsValue)) {
    throw new NoticeBoardValidationError(
      path + ' must be an array; received ' + describeNoticeBoardValue(fontsValue),
    );
  }
  if (fontsValue.length > NOTICE_BOARD_MAX_CUSTOM_FONTS) {
    throw new NoticeBoardValidationError(
      path +
        ' must contain at most ' +
        NOTICE_BOARD_MAX_CUSTOM_FONTS +
        ' fonts; received ' +
        fontsValue.length,
    );
  }

  const fontFamilies = new Set<string>();
  return fontsValue.map((fontValue, index) => {
    const fontPath = path + '[' + index + ']';
    let font: NoticeBoardFont;
    try {
      font = requireNoticeBoardFont(fontValue, fontPath);
    } catch (error) {
      if (error instanceof NoticeBoardFontError) {
        throw new NoticeBoardValidationError(error.message);
      }
      throw error;
    }

    const familyKey = font.family.toLowerCase();
    if (fontFamilies.has(familyKey)) {
      throw new NoticeBoardValidationError(
        fontPath + '.family duplicates an earlier custom font; received ' +
          describeNoticeBoardValue(font.family),
      );
    }
    fontFamilies.add(familyKey);
    return font;
  });
}

function requireNoticePaperId(value: unknown, path: string): NoticePaperId {
  if (!isNoticePaperId(value)) {
    throw new NoticeBoardValidationError(
      path + ' must be one of paper-01 through paper-12; received ' +
        describeNoticeBoardValue(value),
    );
  }
  return value;
}

function requireNoticeId(value: unknown, path: string): string {
  if (typeof value !== 'string' || !NOTICE_ID_PATTERN.test(value)) {
    throw new NoticeBoardValidationError(
      path + ' must match ' + NOTICE_ID_PATTERN + '; received ' + describeNoticeBoardValue(value),
    );
  }
  return value;
}

function requireBoardWidth(value: unknown, path: string): number {
  return requireIntegerInRange(value, path, NOTICE_BOARD_MIN_WIDTH, NOTICE_BOARD_MAX_WIDTH);
}

function requireIntegerInRange(value: unknown, path: string, minimum: number, maximum: number): number {
  const numberValue = requireFiniteNumber(value, path);
  if (
    !Number.isInteger(numberValue) ||
    numberValue < minimum ||
    numberValue > maximum
  ) {
    throw new NoticeBoardValidationError(
      path + ' must be an integer from ' + minimum + ' to ' + maximum +
        '; received ' + describeNoticeBoardValue(value),
    );
  }
  return numberValue;
}

function requireNumberInRange(value: unknown, path: string, minimum: number, maximum: number): number {
  const numberValue = requireFiniteNumber(value, path);
  if (numberValue < minimum || numberValue > maximum) {
    throw new NoticeBoardValidationError(
      path + ' must be between ' + minimum + ' and ' + maximum +
        '; received ' + describeNoticeBoardValue(value),
    );
  }
  return numberValue;
}

function requireFiniteNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new NoticeBoardValidationError(
      path + ' must be a finite number; received ' + describeNoticeBoardValue(value),
    );
  }
  return value;
}

function requireTextAlign(value: unknown, path: string): NoticeTextStyle['textAlign'] {
  if (value !== 'left' && value !== 'center' && value !== 'right') {
    throw new NoticeBoardValidationError(
      path + ' must be left, center, or right; received ' + describeNoticeBoardValue(value),
    );
  }
  return value;
}

function requireFontStyle(value: unknown, path: string): NoticeTextStyle['fontStyle'] {
  if (
    value !== 'normal' &&
    value !== 'italic' &&
    value !== 'bold' &&
    value !== 'bold-italic'
  ) {
    throw new NoticeBoardValidationError(
      path + ' must be normal, italic, bold, or bold-italic; received ' +
        describeNoticeBoardValue(value),
    );
  }
  return value;
}

function requireNoticeBoardRecord(value: unknown, path: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new NoticeBoardValidationError(
      path + ' must be an object; received ' + describeNoticeBoardValue(value),
    );
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new NoticeBoardValidationError(
      path + ' must be a plain object; received ' + describeNoticeBoardValue(value),
    );
  }
  return value as Record<string, unknown>;
}

function requireExactNoticeBoardKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
  path: string,
): void {
  const actualKeys = Reflect.ownKeys(value);
  const missingKeys = expectedKeys.filter((key) => !Object.prototype.hasOwnProperty.call(value, key));
  const extraKeys = actualKeys
    .filter((key) => typeof key !== 'string' || !expectedKeys.includes(key))
    .map((key) => (typeof key === 'symbol' ? key.toString() : key));

  if (missingKeys.length > 0 || extraKeys.length > 0) {
    throw new NoticeBoardValidationError(
      path + ' must contain exactly keys ' + expectedKeys.join(', ') +
        '; missing ' + missingKeys.join(', ') + '; extra ' + extraKeys.join(', '),
    );
  }
}

function requireNoticeBoardFileSize(contents: string): void {
  const byteLength = new TextEncoder().encode(contents).byteLength;
  if (byteLength > NOTICE_BOARD_MAX_PROJECT_FILE_BYTES) {
    throw new NoticeBoardValidationError(
      'notice board file must be at most ' +
        NOTICE_BOARD_MAX_PROJECT_FILE_BYTES +
        ' UTF-8 bytes; received ' +
        byteLength,
    );
  }
}

function describeNoticeBoardValue(value: unknown): string {
  if (typeof value === 'string') {
    const stringExcerpt = value.length <= 240 ? value : value.slice(0, 237) + '...';
    const serializedExcerpt = JSON.stringify(stringExcerpt);
    if (value.length <= 240) return serializedExcerpt;
    return serializedExcerpt + ' (truncated from ' + value.length + ' UTF-16 code units)';
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value === 'object') {
    const seenValues = new WeakSet<object>();
    const serializedValue = JSON.stringify(value, (_propertyName, nestedValue: unknown) => {
      if (typeof nestedValue === 'bigint') return nestedValue.toString() + 'n';
      if (nestedValue !== null && typeof nestedValue === 'object') {
        if (seenValues.has(nestedValue)) return '[Circular]';
        seenValues.add(nestedValue);
      }
      return nestedValue;
    });
    if (serializedValue === undefined) return Object.prototype.toString.call(value);
    if (serializedValue.length <= 240) return serializedValue;
    return serializedValue.slice(0, 237) + '...';
  }

  return Object.prototype.toString.call(value);
}
