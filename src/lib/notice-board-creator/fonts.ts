import type { NoticeBoardFont } from './types';

const GOOGLE_FONTS_HOST = 'fonts.googleapis.com';
const FONT_FAMILY_PATTERN = /^[\p{L}\p{N} ._&+-]{1,128}$/u;
const NOTICE_BOARD_FONT_KEYS = ['family', 'stylesheetUrl'] as const;

export class NoticeBoardFontError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoticeBoardFontError';
  }
}

export function parseGoogleFontInputs(
  linkCode: string,
  familyDeclaration: string,
): NoticeBoardFont {
  const stylesheetInput = requireNonEmptyString(linkCode, 'Google Fonts link code');
  const familyInput = requireNonEmptyString(familyDeclaration, 'font-family declaration');
  const stylesheetUrl = extractStylesheetUrl(stylesheetInput);
  const parsedStylesheetUrl = requireGoogleFontsUrl(stylesheetUrl, 'Google Fonts stylesheet URL');
  const family = extractFontFamily(familyInput);
  requireStylesheetIncludesFamily(parsedStylesheetUrl, family);

  return {
    family,
    stylesheetUrl: parsedStylesheetUrl.href,
  };
}

export function requireNoticeBoardFont(
  fontValue: unknown,
  path = 'font',
): NoticeBoardFont {
  if (fontValue === null || typeof fontValue !== 'object' || Array.isArray(fontValue)) {
    throw new NoticeBoardFontError(
      path + ' must be an object; received ' + describeFontValue(fontValue),
    );
  }
  const prototype = Object.getPrototypeOf(fontValue);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new NoticeBoardFontError(
      path + ' must be a plain object; received ' + describeFontValue(fontValue),
    );
  }

  const fontRecord = fontValue as Record<string, unknown>;
  requireExactFontKeys(fontRecord, path);
  const family = requireFontFamily(fontRecord.family, path + '.family');
  const stylesheetValue = requireNonEmptyString(
    fontRecord.stylesheetUrl,
    path + '.stylesheetUrl',
  );
  const stylesheetUrl = requireGoogleFontsUrl(
    stylesheetValue,
    path + '.stylesheetUrl',
  );
  requireStylesheetIncludesFamily(stylesheetUrl, family);

  return {
    family,
    stylesheetUrl: stylesheetUrl.href,
  };
}

export function loadNoticeBoardFont(
  fontValue: NoticeBoardFont,
  documentValue: Document,
): HTMLLinkElement {
  const font = requireNoticeBoardFont(fontValue);
  if (documentValue === null || typeof documentValue !== 'object') {
    throw new NoticeBoardFontError(
      'document must be a DOM Document; received ' + describeFontValue(documentValue),
    );
  }

  const documentHead = documentValue.head;
  if (documentHead === null) {
    throw new NoticeBoardFontError('document.head must exist before loading a custom font');
  }

  const matchingStylesheet = Array.from(documentHead.getElementsByTagName('link')).find(
    (stylesheetLink) =>
      stylesheetLink.rel === 'stylesheet' && stylesheetLink.href === font.stylesheetUrl,
  );
  if (matchingStylesheet !== undefined) {
    return matchingStylesheet;
  }

  const stylesheetLink = documentValue.createElement('link');
  stylesheetLink.rel = 'stylesheet';
  stylesheetLink.href = font.stylesheetUrl;
  stylesheetLink.dataset.noticeBoardFont = 'true';
  documentHead.append(stylesheetLink);
  return stylesheetLink;
}

function extractStylesheetUrl(linkCode: string): string {
  const linkInput = linkCode.trim();
  if (linkInput.startsWith('<')) {
    const linkTagMatch = linkInput.match(
      /^<link\b[^>]*\bhref\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*\/?>$/i,
    );
    if (linkTagMatch === null) {
      throw new NoticeBoardFontError(
        'Google Fonts link code must be one link tag with an href; received ' +
          describeFontValue(linkCode),
      );
    }
    return linkTagMatch[1] ?? linkTagMatch[2] ?? linkTagMatch[3];
  }
  return linkInput;
}

function requireGoogleFontsUrl(value: string, path: string): URL {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NoticeBoardFontError(
        path + ' must be an absolute Google Fonts HTTPS URL; received ' +
          describeFontValue(value),
      );
    }
    throw error;
  }

  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.hostname !== GOOGLE_FONTS_HOST ||
    (parsedUrl.pathname !== '/css' && parsedUrl.pathname !== '/css2') ||
    parsedUrl.username.length > 0 ||
    parsedUrl.password.length > 0 ||
    parsedUrl.port.length > 0 ||
    parsedUrl.hash.length > 0 ||
    parsedUrl.searchParams.getAll('family').length === 0
  ) {
    throw new NoticeBoardFontError(
      path +
        ' must use https://fonts.googleapis.com/css or /css2 with a family query; received ' +
        describeFontValue(value),
    );
  }

  return parsedUrl;
}

function extractFontFamily(familyDeclaration: string): string {
  const trimmedDeclaration = familyDeclaration.trim();
  const declarationMatch = trimmedDeclaration.match(/^font-family\s*:\s*(.+)$/i);
  const familyList = (declarationMatch?.[1] ?? trimmedDeclaration).trim();
  const withoutTrailingSemicolon = familyList.endsWith(';')
    ? familyList.slice(0, -1).trim()
    : familyList;
  const firstFamilyMatch = withoutTrailingSemicolon.match(
    /^(?:"([^"\r\n]+)"|'([^'\r\n]+)'|([^,;]+?))(?:\s*,.*)?$/,
  );
  if (firstFamilyMatch === null) {
    throw new NoticeBoardFontError(
      'font-family declaration must begin with one font family; received ' +
        describeFontValue(familyDeclaration),
    );
  }

  const family = (firstFamilyMatch[1] ?? firstFamilyMatch[2] ?? firstFamilyMatch[3]).trim();
  return requireFontFamily(family, 'font-family declaration');
}

function requireFontFamily(value: unknown, path: string): string {
  if (
    typeof value !== 'string' ||
    value !== value.trim() ||
    !FONT_FAMILY_PATTERN.test(value)
  ) {
    throw new NoticeBoardFontError(
      path + ' must be a 1–128 character font family name; received ' +
        describeFontValue(value),
    );
  }
  return value;
}

function requireStylesheetIncludesFamily(stylesheetUrl: URL, family: string): void {
  const stylesheetFamilies = stylesheetUrl.searchParams
    .getAll('family')
    .flatMap((familyParameter) => familyParameter.split('|'))
    .map((familyParameter) => familyParameter.split(':', 1)[0].trim().toLowerCase());

  if (!stylesheetFamilies.includes(family.toLowerCase())) {
    throw new NoticeBoardFontError(
      'font-family ' +
        describeFontValue(family) +
        ' must be named in Google Fonts URL family query; received ' +
        describeFontValue(stylesheetFamilies),
    );
  }
}

function requireNonEmptyString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new NoticeBoardFontError(
      path + ' must be a non-empty string; received ' + describeFontValue(value),
    );
  }
  return value.trim();
}

function requireExactFontKeys(fontRecord: Record<string, unknown>, path: string): void {
  const receivedKeys = Reflect.ownKeys(fontRecord);
  const unexpectedKeys = receivedKeys.filter(
    (key) => typeof key !== 'string' || !NOTICE_BOARD_FONT_KEYS.includes(key as 'family' | 'stylesheetUrl'),
  );
  const missingKeys = NOTICE_BOARD_FONT_KEYS.filter(
    (key) => !Object.prototype.hasOwnProperty.call(fontRecord, key),
  );

  if (unexpectedKeys.length > 0 || missingKeys.length > 0) {
    throw new NoticeBoardFontError(
      path +
        ' must contain exactly family and stylesheetUrl; missing ' +
        missingKeys.join(', ') +
        '; extra ' +
        unexpectedKeys.map((key) => String(key)).join(', '),
    );
  }
}

function describeFontValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
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
