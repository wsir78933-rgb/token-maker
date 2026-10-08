import {
  requireScrollFontStylesheetUrl,
} from './project';
import type { ScrollCustomFont } from './types';

const GOOGLE_FONT_LINK_TAG_PATTERN = /^<link\b([\s\S]*?)\s*\/?>(?:\s*)$/i;
const FONT_LOAD_TIMEOUT_MS = 15_000;
const ALLOWED_LINK_ATTRIBUTES = new Set(['href', 'rel']);

/**
 * Normalizes the Google Fonts input used by the editor into a safe stylesheet
 * URL and a plain family name. No supplied markup is inserted into the DOM.
 */
export function requireScrollFont(source: string, family: string): ScrollCustomFont {
  requireTextValue(source, 'Google Fonts source');
  requireTextValue(family, 'Custom font family');

  const stylesheetUrl = extractStylesheetUrl(source);
  const normalizedFamily = parseFontFamilyName(family);
  return { family: normalizedFamily, stylesheetUrl };
}

/**
 * Loads a validated Google Fonts stylesheet through a DOM-created link and
 * waits for the browser font set when that API is available.
 */
export async function loadScrollFont(font: ScrollCustomFont): Promise<void> {
  const validatedFont = requireScrollFontRecord(font);
  if (typeof document === 'undefined') {
    throw new Error(
      `Cannot load custom font ${JSON.stringify(validatedFont.family)}: browser document is unavailable.`,
    );
  }
  if (!document.head || typeof document.createElement !== 'function') {
    throw new Error(
      `Cannot load custom font ${JSON.stringify(validatedFont.family)}: document head is unavailable.`,
    );
  }

  let stylesheetLink: HTMLLinkElement;
  try {
    stylesheetLink = document.createElement('link');
    stylesheetLink.rel = 'stylesheet';
    stylesheetLink.href = validatedFont.stylesheetUrl;
  } catch (error: unknown) {
    if (!(error instanceof Error)) throw error;
    throw new Error(
      `Cannot prepare custom font stylesheet ${JSON.stringify(validatedFont.stylesheetUrl)} for ${JSON.stringify(validatedFont.family)}. Received ${describeFontValue(error)}.`,
      { cause: error },
    );
  }

  await new Promise<void>((resolve, reject) => {
    let finished = false;
    const timeout = setTimeout(() => {
      finishFontLoad(true);
      reject(
        new Error(
          `Custom font ${JSON.stringify(validatedFont.family)} from ${JSON.stringify(validatedFont.stylesheetUrl)} did not load within ${FONT_LOAD_TIMEOUT_MS} ms.`,
        ),
      );
    }, FONT_LOAD_TIMEOUT_MS);

    function finishFontLoad(removeStylesheet: boolean): void {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      stylesheetLink.onload = null;
      stylesheetLink.onerror = null;
      if (removeStylesheet) removeStylesheetLink(stylesheetLink);
    }

    stylesheetLink.onload = () => {
      void waitForBrowserFontSet(validatedFont)
        .then(() => {
          finishFontLoad(false);
          resolve();
        })
        .catch((error: unknown) => {
          finishFontLoad(true);
          if (!(error instanceof Error)) {
            reject(error);
            return;
          }
          reject(
            new Error(
              `Custom font ${JSON.stringify(validatedFont.family)} loaded its stylesheet but the browser font set failed. Received ${describeFontValue(error)}.`,
              { cause: error },
            ),
          );
        });
    };
    stylesheetLink.onerror = (event) => {
      finishFontLoad(true);
      reject(
        new Error(
          `Cannot load custom font ${JSON.stringify(validatedFont.family)} from ${JSON.stringify(validatedFont.stylesheetUrl)}: ${describeFontLoadEvent(event)}.`,
        ),
      );
    };

    try {
      document.head.append(stylesheetLink);
    } catch (error: unknown) {
      finishFontLoad(true);
      if (!(error instanceof Error)) {
        reject(error);
        return;
      }
      reject(
        new Error(
          `Cannot append custom font stylesheet ${JSON.stringify(validatedFont.stylesheetUrl)} for ${JSON.stringify(validatedFont.family)}. Received ${describeFontValue(error)}.`,
          { cause: error },
        ),
      );
    }
  });
}

function requireScrollFontRecord(value: unknown): ScrollCustomFont {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(
      `Custom font must be an object with family and stylesheetUrl. Received ${describeFontValue(value)}.`,
    );
  }
  const record = value as Record<string, unknown>;
  const recordKeys = Object.keys(record).sort();
  if (recordKeys.length !== 2 || recordKeys[0] !== 'family' || recordKeys[1] !== 'stylesheetUrl') {
    throw new TypeError(
      `Custom font must contain only family and stylesheetUrl. Received ${describeFontValue(value)}.`,
    );
  }
  if (typeof record.stylesheetUrl !== 'string' || typeof record.family !== 'string') {
    throw new TypeError(
      `Custom font family and stylesheetUrl must be strings. Received ${describeFontValue(value)}.`,
    );
  }
  return requireScrollFont(record.stylesheetUrl, record.family);
}

function extractStylesheetUrl(source: string): string {
  const trimmedSource = source.trim();
  if (trimmedSource.startsWith('<') || trimmedSource.includes('>')) {
    const linkTagMatch = trimmedSource.match(GOOGLE_FONT_LINK_TAG_PATTERN);
    if (!linkTagMatch) {
      throw new TypeError(
        `Google Fonts source must be a stylesheet URL or a link tag. Received ${JSON.stringify(source)}.`,
      );
    }
    const attributes = parseLinkTagAttributes(linkTagMatch[1]);
    if (attributes.rel?.toLowerCase() !== 'stylesheet' || !attributes.href) {
      throw new TypeError(
        `Google Fonts link tag must contain rel="stylesheet" and an href. Received ${JSON.stringify(source)}.`,
      );
    }
    return requireScrollFontStylesheetUrl(attributes.href, 'Google Fonts link href');
  }

  if (trimmedSource !== source) {
    throw new TypeError(
      `Google Fonts source must not have surrounding whitespace. Received ${JSON.stringify(source)}.`,
    );
  }
  if (trimmedSource.length === 0) {
    throw new TypeError(`Google Fonts source must be non-empty. Received ${JSON.stringify(source)}.`);
  }
  return requireScrollFontStylesheetUrl(trimmedSource, 'Google Fonts source');
}

function parseLinkTagAttributes(attributeText: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  let cursor = 0;
  while (cursor < attributeText.length) {
    while (/\s/.test(attributeText[cursor] ?? '')) cursor += 1;
    if (cursor >= attributeText.length) break;

    const nameMatch = attributeText.slice(cursor).match(/^[A-Za-z][A-Za-z0-9:-]*/);
    if (!nameMatch) {
      throw new TypeError(
        `Google Fonts link tag contains an invalid attribute near ${JSON.stringify(attributeText.slice(cursor))}.`,
      );
    }
    const attributeName = nameMatch[0].toLowerCase();
    cursor += nameMatch[0].length;
    while (/\s/.test(attributeText[cursor] ?? '')) cursor += 1;
    if (attributeText[cursor] !== '=') {
      throw new TypeError(
        `Google Fonts link attribute ${JSON.stringify(attributeName)} must have a quoted value. Received ${JSON.stringify(attributeText)}.`,
      );
    }
    cursor += 1;
    while (/\s/.test(attributeText[cursor] ?? '')) cursor += 1;
    const quote = attributeText[cursor];
    if (quote !== '"' && quote !== "'") {
      throw new TypeError(
        `Google Fonts link attribute ${JSON.stringify(attributeName)} must use a quoted value. Received ${JSON.stringify(attributeText)}.`,
      );
    }
    cursor += 1;
    const closingQuote = attributeText.indexOf(quote, cursor);
    if (closingQuote < 0) {
      throw new TypeError(
        `Google Fonts link attribute ${JSON.stringify(attributeName)} has no closing quote. Received ${JSON.stringify(attributeText)}.`,
      );
    }
    const attributeValue = attributeText.slice(cursor, closingQuote);
    if (attributeValue.includes('<') || attributeValue.includes('>')) {
      throw new TypeError(
        `Google Fonts link attribute ${JSON.stringify(attributeName)} contains markup. Received ${JSON.stringify(attributeValue)}.`,
      );
    }
    if (!ALLOWED_LINK_ATTRIBUTES.has(attributeName)) {
      throw new TypeError(
        `Google Fonts link attribute ${JSON.stringify(attributeName)} is not allowed. Received ${JSON.stringify(attributeValue)}.`,
      );
    }
    if (Object.hasOwn(attributes, attributeName)) {
      throw new TypeError(
        `Google Fonts link attribute ${JSON.stringify(attributeName)} is duplicated. Received ${JSON.stringify(attributeText)}.`,
      );
    }
    attributes[attributeName] = attributeValue;
    cursor = closingQuote + 1;
  }
  return attributes;
}

function parseFontFamilyName(value: string): string {
  const trimmedValue = value.trim();
  if (trimmedValue.includes('<') || trimmedValue.includes('>')) {
    throw new TypeError(`Custom font family must be plain text without markup. Received ${JSON.stringify(value)}.`);
  }
  const cssDeclarationMatch = trimmedValue.match(/^font-family\s*:\s*([\s\S]*?)\s*;?$/i);
  const familyList = cssDeclarationMatch ? cssDeclarationMatch[1].trim() : trimmedValue;
  if (familyList.length === 0) {
    throw new TypeError(`Custom font family must be non-empty. Received ${JSON.stringify(value)}.`);
  }

  const firstFamily = readFirstCssFamilyName(familyList);
  const normalizedFamily = stripMatchingQuotes(firstFamily.trim());
  if (
    normalizedFamily.length === 0 ||
    normalizedFamily.length > 200 ||
    /[<>\u0000-\u001f{};]/.test(normalizedFamily)
  ) {
    throw new TypeError(
      `Custom font family contains unsupported characters or length. Received ${JSON.stringify(value)}.`,
    );
  }
  return normalizedFamily;
}

function readFirstCssFamilyName(familyList: string): string {
  let quote: '"' | "'" | null = null;
  for (let index = 0; index < familyList.length; index += 1) {
    const character = familyList[index];
    if (quote !== null) {
      if (character === quote && familyList[index - 1] !== '\\') quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === ',') return familyList.slice(0, index);
  }
  if (quote !== null) {
    throw new TypeError(`Custom font family contains an unclosed quote. Received ${JSON.stringify(familyList)}.`);
  }
  return familyList;
}

function stripMatchingQuotes(value: string): string {
  if (value.length >= 2) {
    const firstCharacter = value[0];
    const lastCharacter = value[value.length - 1];
    if ((firstCharacter === '"' || firstCharacter === "'") && lastCharacter === firstCharacter) {
      return value.slice(1, -1).trim();
    }
  }
  return value;
}

async function waitForBrowserFontSet(font: ScrollCustomFont): Promise<void> {
  const browserFontSet = document.fonts;
  if (!browserFontSet || typeof browserFontSet.load !== 'function') {
    throw new Error('document.fonts.load is unavailable');
  }

  await browserFontSet.ready;
  const cssFamily = font.family.replace(/["\\]/g, '\\$&');
  const loadedFaces = await browserFontSet.load(`1em "${cssFamily}"`);
  if (!Array.isArray(loadedFaces) || loadedFaces.length === 0) {
    throw new Error(`document.fonts.load returned no faces for ${JSON.stringify(font.family)}`);
  }
  const unloadedFace = loadedFaces.find(
    (fontFace) =>
      typeof fontFace === 'object' &&
      fontFace !== null &&
      'status' in fontFace &&
      fontFace.status !== 'loaded',
  );
  if (unloadedFace) {
    throw new Error(`document.fonts.load returned a face that is not loaded for ${JSON.stringify(font.family)}`);
  }
}

function removeStylesheetLink(stylesheetLink: HTMLLinkElement): void {
  if (typeof stylesheetLink.remove === 'function') stylesheetLink.remove();
  else stylesheetLink.parentNode?.removeChild(stylesheetLink);
}

function requireTextValue(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${label} must be a non-empty string. Received ${describeFontValue(value)}.`);
  }
}

function describeFontLoadEvent(event: Event | string): string {
  if (typeof event === 'string') return event;
  return event.type.length > 0
    ? `browser emitted ${JSON.stringify(event.type)} without further details`
    : 'browser emitted an unknown stylesheet error';
}

function describeFontValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value instanceof Error) return JSON.stringify(value.message || value.name);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return `array(length=${value.length})`;
  return Object.prototype.toString.call(value);
}
