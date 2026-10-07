import {
  DEFAULT_PERIODIC_TABLE_STYLE,
  MAX_PERIODIC_TABLE_DIMENSION,
  MAX_PERIODIC_TABLE_FILE_BYTES,
  PERIODIC_TABLE_FIELDS,
  type PeriodicTableCell,
  type PeriodicTableDocument,
  type PeriodicTableField,
  type PeriodicTableStyle,
  type PeriodicTableText,
} from './types';
import { validateTableDocument } from './table';

const PERIODIC_TABLE_MIME_TYPE = 'text/html;charset=utf-8';
const RASTER_DATA_URL_PATTERN =
  /^data:image\/(?:apng|avif|bmp|gif|jpeg|jpg|png|webp);(?:base64,[a-z0-9+/]+={0,2}|[^,]+,.*)$/iu;
const LEGACY_DEFAULT_PERIODIC_TABLE_STYLE: Readonly<PeriodicTableStyle> = {
  backgroundColor: 'transparent',
  textColor: '#ff9900',
  borderColor: '#ff9900',
  borderVisible: true,
  backgroundImageUrl: '',
};
const ALLOWED_TEXT_TAG_NAMES = new Set(['BR', 'DIV', 'EM', 'I', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'U']);
const ALLOWED_STYLE_PROPERTIES_BY_TAG = {
  TD: new Set([
    'background-color',
    'background-image',
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-style',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-width',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'color',
  ]),
  DIV: new Set(['color']),
  TBODY: new Set(['font-size']),
} as const;
const ALLOWED_ATTRIBUTE_NAMES_BY_TAG = {
  HTML: new Set(['lang', 'dir']),
  HEAD: new Set([]),
  META: new Set(['charset', 'name', 'content']),
  TITLE: new Set([]),
  STYLE: new Set([]),
  BODY: new Set(['id', 'class']),
  MAIN: new Set(['id', 'class']),
  SECTION: new Set(['id', 'class']),
  TABLE: new Set(['id', 'class', 'data-periodic-table']),
  TBODY: new Set(['style']),
  TR: new Set(['id', 'class', 'data-periodic-row']),
  TD: new Set([
    'id',
    'class',
    'data-cell-id',
    'data-selected',
    'data-background-color',
    'data-text-color',
    'data-border-color',
    'data-border-visible',
    'data-background-image-url',
    'style',
    'colspan',
    'rowspan',
  ]),
  DIV: new Set(['id', 'class', 'contenteditable', 'data-periodic-field', 'style']),
  BR: new Set([]),
  SPAN: new Set(['class']),
  EM: new Set(['class']),
  I: new Set(['class']),
  SMALL: new Set(['class']),
  STRONG: new Set(['class']),
  SUB: new Set(['class']),
  SUP: new Set(['class']),
  U: new Set(['class']),
} as const;
const DANGEROUS_TAG_NAMES = new Set([
  'APPLET',
  'AUDIO',
  'BASE',
  'EMBED',
  'FORM',
  'IFRAME',
  'IMG',
  'LINK',
  'OBJECT',
  'SCRIPT',
  'SVG',
  'VIDEO',
]);

export const PERIODIC_TABLE_HTML_FILE_NAME = 'periodicTable.txt';

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value instanceof Error) return `${value.name}: ${value.message || '(empty message)'}`;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? Object.prototype.toString.call(value) : serialized;
  } catch (serializationFailure: unknown) {
    if (serializationFailure instanceof Error) {
      return `${Object.prototype.toString.call(value)} (serialization failed: ${serializationFailure.message})`;
    }

    throw serializationFailure;
  }
}

function getUtf8ByteLength(contents: string): number {
  if (typeof TextEncoder !== 'function') {
    throw new Error('Periodic table file parsing requires TextEncoder. Received undefined.');
  }

  return new TextEncoder().encode(contents).byteLength;
}

function requirePeriodicTableFileContents(contents: unknown, operation: 'parse' | 'serialize'): string {
  if (typeof contents !== 'string') {
    throw new TypeError(
      `Periodic table HTML ${operation} input must be a string. Received ${describeReceivedValue(contents)}.`,
    );
  }

  const byteLength = getUtf8ByteLength(contents);
  if (byteLength > MAX_PERIODIC_TABLE_FILE_BYTES) {
    throw new RangeError(
      `Periodic table HTML ${operation} is ${byteLength} UTF-8 bytes; the maximum is ${MAX_PERIODIC_TABLE_FILE_BYTES} bytes.`,
    );
  }

  return contents;
}

function normalizeLineBreaks(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtmlAttribute(value: string): string {
  return escapeHtmlText(value);
}

function validateImageUrl(value: string, fieldPath: string): string {
  const normalized = value.trim();
  if (normalized === '') return '';
  if (RASTER_DATA_URL_PATTERN.test(normalized)) {
    return normalized;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalized);
  } catch (parseFailure: unknown) {
    throw new Error(
      `Periodic table ${fieldPath} must be an http, https, or image data URL. Received ${JSON.stringify(value)}.`,
      { cause: parseFailure },
    );
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(
      `Periodic table ${fieldPath} must be an http, https, or image data URL. Received ${JSON.stringify(value)}.`,
    );
  }

  return normalized;
}

function parseCssColor(value: string, fieldPath: string): string {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'transparent') return 'transparent';

  if (/^#[0-9a-f]{3,4}$|^#[0-9a-f]{6}$|^#[0-9a-f]{8}$/iu.test(normalized)) return value.trim();

  const rgbMatch = normalized.match(/^rgba?\(\s*([^)]*)\s*\)$/iu);
  if (rgbMatch === null) {
    throw new Error(`Periodic table ${fieldPath} must be a hex or RGB color. Received ${JSON.stringify(value)}.`);
  }

  const channelTokens = rgbMatch[1].includes(',')
    ? rgbMatch[1].split(',').map((channelToken) => channelToken.trim())
    : rgbMatch[1].split(/\s+\/\s+|\s+/u).map((channelToken) => channelToken.trim());
  const expectedChannelCount = normalized.startsWith('rgba') ? 4 : 3;
  if (channelTokens.length !== expectedChannelCount) {
    throw new Error(`Periodic table ${fieldPath} has an invalid RGB channel count. Received ${JSON.stringify(value)}.`);
  }
  const validRgbChannel = (channelToken: string) => {
    if (/^\d+(?:\.\d+)?%$/u.test(channelToken)) return Number(channelToken.slice(0, -1)) <= 100;
    return /^\d+(?:\.\d+)?$/u.test(channelToken) && Number(channelToken) <= 255;
  };
  if (!channelTokens.slice(0, 3).every(validRgbChannel)) {
    throw new Error(`Periodic table ${fieldPath} has an invalid RGB channel. Received ${JSON.stringify(value)}.`);
  }
  if (expectedChannelCount === 4) {
    const alphaToken = channelTokens[3];
    const validAlpha = /^\d+(?:\.\d+)?%$/u.test(alphaToken)
      ? Number(alphaToken.slice(0, -1)) <= 100
      : /^(?:\d+(?:\.\d+)?|\.\d+)$/u.test(alphaToken) && Number(alphaToken) <= 1;
    if (!validAlpha) {
      throw new Error(`Periodic table ${fieldPath} has an invalid alpha channel. Received ${JSON.stringify(value)}.`);
    }
  }

  return value.trim();
}

type CssColorChannels = readonly [number, number, number, number];

function parseCssColorChannels(value: string, fieldPath: string): CssColorChannels {
  const validatedColor = parseCssColor(value, fieldPath).toLowerCase();
  if (validatedColor === 'transparent') return [0, 0, 0, 0];

  if (validatedColor.startsWith('#')) {
    const hexadecimalDigits = validatedColor.slice(1);
    const expandedDigits = hexadecimalDigits.length <= 4
      ? hexadecimalDigits.split('').map((digit) => `${digit}${digit}`).join('')
      : hexadecimalDigits;
    const red = Number.parseInt(expandedDigits.slice(0, 2), 16);
    const green = Number.parseInt(expandedDigits.slice(2, 4), 16);
    const blue = Number.parseInt(expandedDigits.slice(4, 6), 16);
    const alpha = expandedDigits.length === 8
      ? Number.parseInt(expandedDigits.slice(6, 8), 16) / 255
      : 1;
    return [red, green, blue, alpha];
  }

  const rgbMatch = validatedColor.match(/^rgba?\(\s*([^)]*)\s*\)$/iu);
  if (rgbMatch === null) {
    throw new Error(`Periodic table ${fieldPath} must be a hex or RGB color. Received ${JSON.stringify(value)}.`);
  }
  const channelTokens = rgbMatch[1].includes(',')
    ? rgbMatch[1].split(',').map((channelToken) => channelToken.trim())
    : rgbMatch[1].split(/\s+\/\s+|\s+/u).map((channelToken) => channelToken.trim());
  const toRgbChannel = (channelToken: string): number => channelToken.endsWith('%')
    ? (Number(channelToken.slice(0, -1)) * 255) / 100
    : Number(channelToken);
  const toAlphaChannel = (channelToken: string): number => channelToken.endsWith('%')
    ? Number(channelToken.slice(0, -1)) / 100
    : Number(channelToken);
  return [
    toRgbChannel(channelTokens[0]),
    toRgbChannel(channelTokens[1]),
    toRgbChannel(channelTokens[2]),
    channelTokens.length === 4 ? toAlphaChannel(channelTokens[3]) : 1,
  ];
}

function areCssColorsEquivalent(firstColor: string, secondColor: string, fieldPath: string): boolean {
  const firstChannels = parseCssColorChannels(firstColor, fieldPath);
  const secondChannels = parseCssColorChannels(secondColor, fieldPath);
  return firstChannels.every((channel, channelIndex) => Math.abs(channel - secondChannels[channelIndex]) < 0.000001);
}

function selectColorValue(
  inlineColor: string,
  storedColor: string | null,
  fallbackColor: string,
  fieldPath: string,
): string {
  if (inlineColor === '') {
    return storedColor === null ? fallbackColor : parseCssColor(storedColor, fieldPath);
  }

  const parsedInlineColor = parseCssColor(inlineColor, fieldPath);
  if (storedColor !== null && areCssColorsEquivalent(parsedInlineColor, storedColor, fieldPath)) {
    return parseCssColor(storedColor, fieldPath);
  }
  return parsedInlineColor;
}

function readCssProperty(element: HTMLElement, propertyName: string): string {
  return element.style.getPropertyValue(propertyName).trim();
}

function requireAllowedStyleProperties(element: Element): void {
  const tagName = element.tagName.toUpperCase();
  if (!('style' in element)) return;
  const styleElement = element as HTMLElement;
  const propertyNames = ALLOWED_STYLE_PROPERTIES_BY_TAG[tagName as keyof typeof ALLOWED_STYLE_PROPERTIES_BY_TAG];
  if (propertyNames === undefined) {
    if (styleElement.getAttribute('style') !== null) {
      throw new Error(`Periodic table ${tagName} style attribute is not allowed.`);
    }
    return;
  }

  for (let propertyIndex = 0; propertyIndex < styleElement.style.length; propertyIndex += 1) {
    const propertyName = styleElement.style.item(propertyIndex);
    if (!propertyNames.has(propertyName)) {
      throw new Error(`Periodic table ${tagName} style property ${JSON.stringify(propertyName)} is not allowed.`);
    }
  }
}

function requireAllowedAttributes(element: Element): void {
  const tagName = element.tagName.toUpperCase();
  const allowedNames: ReadonlySet<string> | undefined =
    ALLOWED_ATTRIBUTE_NAMES_BY_TAG[tagName as keyof typeof ALLOWED_ATTRIBUTE_NAMES_BY_TAG];
  if (allowedNames === undefined) {
    throw new Error(`Periodic table HTML tag ${JSON.stringify(tagName)} is not allowed.`);
  }

  for (const attribute of Array.from(element.attributes)) {
    const attributeName = attribute.name.toLowerCase();
    if (attributeName.startsWith('on')) {
      throw new Error(`Periodic table HTML event attribute ${JSON.stringify(attribute.name)} is not allowed.`);
    }
    if (!allowedNames.has(attributeName)) {
      throw new Error(`Periodic table HTML attribute ${JSON.stringify(attribute.name)} is not allowed on ${tagName}.`);
    }
  }

  requireAllowedStyleProperties(element);
}

function requireSafeHtmlDocument(parsedDocument: Document): void {
  for (const element of Array.from(parsedDocument.querySelectorAll('*'))) {
    const tagName = element.tagName.toUpperCase();
    if (DANGEROUS_TAG_NAMES.has(tagName)) {
      throw new Error(`Periodic table HTML tag ${JSON.stringify(tagName)} is not allowed.`);
    }
    requireAllowedAttributes(element);
  }

  for (const styleElement of Array.from(parsedDocument.querySelectorAll('style'))) {
    const styleText = styleElement.textContent ?? '';
    if (/@import|url\s*\(|expression\s*\(/iu.test(styleText)) {
      throw new Error('Periodic table HTML style contains an unsafe URL or expression.');
    }
  }
}

function isBlockTextNode(node: Node | undefined): boolean {
  return node?.nodeType === 1 && (node as Element).tagName.toUpperCase() === 'DIV';
}

function readNodeText(node: Node, fieldPath: string): string {
  if (node.nodeType === 3) return node.nodeValue ?? '';
  if (node.nodeType !== 1) return '';

  const element = node as Element;
  const tagName = element.tagName.toUpperCase();
  if (tagName === 'BR') return '\n';
  if (!ALLOWED_TEXT_TAG_NAMES.has(tagName)) {
    throw new Error(`Periodic table ${fieldPath} contains unsupported text tag ${JSON.stringify(tagName)}.`);
  }

  const childNodes = Array.from(element.childNodes);
  let text = '';
  for (let childIndex = 0; childIndex < childNodes.length; childIndex += 1) {
    const child = childNodes[childIndex];
    const childText = readNodeText(child, fieldPath);
    const previousChild = childNodes[childIndex - 1];
    const hasBlockBoundary = isBlockTextNode(child) || isBlockTextNode(previousChild);
    const needsBlockBoundaryLineBreak = text !== ''
      && childText !== ''
      && hasBlockBoundary
      && !text.endsWith('\n')
      && !childText.startsWith('\n');
    if (needsBlockBoundaryLineBreak) {
      text += '\n';
    }
    text += childText;
  }

  return text;
}

function readFieldText(fieldElement: HTMLElement, fieldPath: string): string {
  return normalizeLineBreaks(readNodeText(fieldElement, fieldPath));
}

function requireSingleFieldElement(cellElement: HTMLElement, field: PeriodicTableField): HTMLElement {
  const explicitFields = Array.from(cellElement.querySelectorAll(`[data-periodic-field="${field}"]`));
  if (explicitFields.length > 1) {
    throw new Error(`Periodic table cell ${field} has ${explicitFields.length} ${field} fields; expected 1.`);
  }
  if (explicitFields.length === 1) {
    const fieldElement = explicitFields[0];
    if (!(fieldElement instanceof HTMLElement)) {
      throw new Error(`Periodic table ${field} field is not an HTML element.`);
    }
    return fieldElement;
  }

  const legacySelectorByField: Record<PeriodicTableField, string> = {
    topLeft: '.elTop .elHlf',
    topRight: '.elTop .elHlfSc',
    symbol: '.elMain',
    name: '.elName',
    bottomLeft: '.elBot .elHlf',
    bottomRight: '.elBot .elHlfSc',
  };
  const legacyFields = Array.from(cellElement.querySelectorAll(legacySelectorByField[field]));
  if (legacyFields.length !== 1 || !(legacyFields[0] instanceof HTMLElement)) {
    throw new Error(`Periodic table cell is missing exactly one ${field} field. Received ${legacyFields.length}.`);
  }

  return legacyFields[0];
}

function readCellText(cellElement: HTMLElement, cellPath: string): PeriodicTableText {
  const text = {} as PeriodicTableText;
  for (const field of PERIODIC_TABLE_FIELDS) {
    const fieldElement = requireSingleFieldElement(cellElement, field);
    text[field] = readFieldText(fieldElement, `${cellPath}.${field}`);
  }
  return text;
}

function parseBorderVisible(cellElement: HTMLElement, cellPath: string): boolean {
  const borderWidth = readCssProperty(cellElement, 'border-width');
  if (borderWidth !== '') {
    const numericWidth = Number.parseFloat(borderWidth);
    if (!Number.isFinite(numericWidth) || numericWidth < 0) {
      throw new Error(`Periodic table ${cellPath}.border-width is invalid. Received ${JSON.stringify(borderWidth)}.`);
    }
    return numericWidth > 0;
  }

  const borderStyle = readCssProperty(cellElement, 'border-style').toLowerCase();
  if (borderStyle === 'none' || borderStyle === 'hidden') return false;

  const border = readCssProperty(cellElement, 'border').toLowerCase();
  if (border === 'none' || /^0(?:px)?(?:\s|$)/u.test(border)) return false;
  if (border !== '') return true;

  return LEGACY_DEFAULT_PERIODIC_TABLE_STYLE.borderVisible;
}

function decodeCssEscapedUrl(value: string, fieldPath: string): string {
  let decodedValue = '';
  for (let characterIndex = 0; characterIndex < value.length; characterIndex += 1) {
    const character = value[characterIndex];
    if (character !== '\\') {
      decodedValue += character;
      continue;
    }

    const escapedCharacter = value[characterIndex + 1];
    if (escapedCharacter === undefined) {
      throw new Error(`Periodic table ${fieldPath} contains an incomplete CSS escape. Received ${JSON.stringify(value)}.`);
    }
    const hexadecimalMatch = value.slice(characterIndex + 1).match(/^[0-9a-f]{1,6}(?:\s)?/iu);
    if (hexadecimalMatch !== null) {
      const hexadecimalCode = hexadecimalMatch[0].trim();
      const decodedCodePoint = Number.parseInt(hexadecimalCode, 16);
      if (!Number.isFinite(decodedCodePoint) || decodedCodePoint === 0 || decodedCodePoint > 0x10ffff) {
        throw new Error(`Periodic table ${fieldPath} contains an invalid CSS escape. Received ${JSON.stringify(value)}.`);
      }
      decodedValue += String.fromCodePoint(decodedCodePoint);
      characterIndex += hexadecimalMatch[0].length;
      continue;
    }

    decodedValue += escapedCharacter;
    characterIndex += 1;
  }
  return decodedValue;
}

function parseBackgroundImageUrl(cellElement: HTMLElement, cellPath: string): string {
  const backgroundImage = readCssProperty(cellElement, 'background-image');
  if (backgroundImage === '' || backgroundImage.toLowerCase() === 'none') return '';

  const normalizedBackgroundImage = backgroundImage.trim();
  if (!/^url\(/iu.test(normalizedBackgroundImage) || !normalizedBackgroundImage.endsWith(')')) {
    throw new Error(`Periodic table ${cellPath}.background-image must contain one URL. Received ${JSON.stringify(backgroundImage)}.`);
  }
  const innerUrl = normalizedBackgroundImage.slice(4, -1).trim();
  let urlValue: string;
  if (innerUrl.startsWith('"') || innerUrl.startsWith("'")) {
    const quoteCharacter = innerUrl[0];
    if (!innerUrl.endsWith(quoteCharacter)) {
      throw new Error(`Periodic table ${cellPath}.background-image must contain one quoted URL. Received ${JSON.stringify(backgroundImage)}.`);
    }
    const quotedUrl = innerUrl.slice(1, -1);
    urlValue = decodeCssEscapedUrl(quotedUrl, `${cellPath}.backgroundImageUrl`);
  } else {
    urlValue = decodeCssEscapedUrl(innerUrl, `${cellPath}.backgroundImageUrl`);
  }

  return validateImageUrl(urlValue.trim(), `${cellPath}.backgroundImageUrl`);
}

function hasInlineBorderVisibilityDeclaration(cellElement: HTMLElement): boolean {
  const borderPropertyNames = [
    'border',
    'border-width',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-style',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
  ];
  return borderPropertyNames.some((propertyName) => readCssProperty(cellElement, propertyName) !== '');
}

function readCellStyle(cellElement: HTMLElement, cellPath: string): PeriodicTableStyle {
  const textElements = PERIODIC_TABLE_FIELDS.map((field) => requireSingleFieldElement(cellElement, field));
  const inlineCellBackground = readCssProperty(cellElement, 'background-color');
  const inlineCellText = readCssProperty(cellElement, 'color');
  const inlineBorderColor = readCssProperty(cellElement, 'border-color');
  const inlineTextColors = textElements
    .map((fieldElement) => readCssProperty(fieldElement, 'color'))
    .filter((color) => color !== '');

  const storedBackgroundColor = cellElement.getAttribute('data-background-color');
  const storedTextColor = cellElement.getAttribute('data-text-color');
  const storedBorderColor = cellElement.getAttribute('data-border-color');
  const storedBorderVisible = cellElement.getAttribute('data-border-visible');
  const storedBackgroundImageUrl = cellElement.getAttribute('data-background-image-url');
  const backgroundColor = selectColorValue(
    inlineCellBackground,
    storedBackgroundColor,
    LEGACY_DEFAULT_PERIODIC_TABLE_STYLE.backgroundColor,
    `${cellPath}.backgroundColor`,
  );
  const inlineTextColorSource = inlineCellText !== '' ? inlineCellText : inlineTextColors[0];
  const textColor = selectColorValue(
    inlineTextColorSource ?? '',
    storedTextColor,
    LEGACY_DEFAULT_PERIODIC_TABLE_STYLE.textColor,
    `${cellPath}.textColor`,
  );
  for (const inlineTextColor of inlineTextColors) {
    if (!areCssColorsEquivalent(inlineTextColor, textColor, `${cellPath}.textColor`)) {
      throw new Error(`Periodic table ${cellPath}.textColor differs between fields. Received ${JSON.stringify(inlineTextColors)}.`);
    }
  }

  const borderColor = selectColorValue(
    inlineBorderColor,
    storedBorderColor,
    LEGACY_DEFAULT_PERIODIC_TABLE_STYLE.borderColor,
    `${cellPath}.borderColor`,
  );
  let borderVisible: boolean;
  if (hasInlineBorderVisibilityDeclaration(cellElement)) {
    borderVisible = parseBorderVisible(cellElement, cellPath);
  } else if (storedBorderVisible === null) {
    borderVisible = LEGACY_DEFAULT_PERIODIC_TABLE_STYLE.borderVisible;
  } else if (storedBorderVisible === 'true') {
    borderVisible = true;
  } else if (storedBorderVisible === 'false') {
    borderVisible = false;
  } else {
    throw new Error(`Periodic table ${cellPath}.data-border-visible must be true or false. Received ${JSON.stringify(storedBorderVisible)}.`);
  }
  const inlineBackgroundImage = readCssProperty(cellElement, 'background-image');
  const backgroundImageUrl = inlineBackgroundImage !== ''
    ? parseBackgroundImageUrl(cellElement, cellPath)
    : storedBackgroundImageUrl === null
    ? ''
    : validateImageUrl(storedBackgroundImageUrl, `${cellPath}.backgroundImageUrl`);

  return {
    backgroundColor,
    textColor,
    borderColor,
    borderVisible,
    backgroundImageUrl,
  };
}

function createMissingCell(rowNumber: number, columnNumber: number): PeriodicTableCell {
  return {
    id: `periodic-cell-r${rowNumber}-c${columnNumber}`,
    text: {
      topLeft: '',
      topRight: '',
      symbol: '',
      name: '',
      bottomLeft: '',
      bottomRight: '',
    },
    style: {
      ...DEFAULT_PERIODIC_TABLE_STYLE,
      borderVisible: false,
    },
    selected: false,
  };
}

function readCell(cellElement: Element, rowNumber: number, columnNumber: number): PeriodicTableCell {
  if (!(cellElement instanceof HTMLElement)) {
    throw new Error(`Periodic table cell r${rowNumber}c${columnNumber} is not an HTML element.`);
  }

  const suppliedId = cellElement.getAttribute('data-cell-id');
  const id = suppliedId === null || suppliedId.trim() === ''
    ? `periodic-cell-r${rowNumber}-c${columnNumber}`
    : suppliedId;
  const cellPath = `cell r${rowNumber}c${columnNumber} (${JSON.stringify(id)})`;
  const dataSelected = cellElement.getAttribute('data-selected');
  if (dataSelected !== null && dataSelected !== 'true' && dataSelected !== 'false') {
    throw new Error(`Periodic table ${cellPath}.data-selected must be true or false. Received ${JSON.stringify(dataSelected)}.`);
  }

  return {
    id,
    text: readCellText(cellElement, cellPath),
    style: readCellStyle(cellElement, cellPath),
    selected: dataSelected === 'true' || cellElement.classList.contains('selected'),
  };
}

function readTableRows(tableElement: Element): Element[][] {
  const rowElements = Array.from(tableElement.querySelectorAll(':scope > tbody > tr, :scope > tr'));
  if (rowElements.length === 0) {
    throw new Error('Periodic table HTML must contain at least one table row. Received 0 rows.');
  }
  if (rowElements.length > MAX_PERIODIC_TABLE_DIMENSION) {
    throw new RangeError(`Periodic table row count exceeds ${MAX_PERIODIC_TABLE_DIMENSION}. Received ${rowElements.length}.`);
  }

  return rowElements.map((rowElement, rowIndex) => {
    const childElements = Array.from(rowElement.children);
    const cellElements = childElements.filter((child) => child.tagName.toUpperCase() === 'TD');
    if (cellElements.length !== childElements.length) {
      throw new Error(`Periodic table row ${rowIndex + 1} must contain only td cells. Received ${childElements.map((child) => child.tagName).join(', ')}.`);
    }
    if (cellElements.length === 0) {
      throw new Error(`Periodic table row ${rowIndex + 1} must contain at least one td cell. Received 0 cells.`);
    }
    if (cellElements.some((cell) => cell.hasAttribute('colspan') || cell.hasAttribute('rowspan'))) {
      throw new Error(`Periodic table row ${rowIndex + 1} does not support colspan or rowspan cells.`);
    }
    return cellElements;
  });
}

function findPeriodicTableElement(parsedDocument: Document): Element {
  const tableElements = Array.from(parsedDocument.querySelectorAll('table'));
  if (tableElements.length !== 1) {
    throw new Error(`Periodic table HTML must contain exactly one table. Received ${tableElements.length}.`);
  }

  const tableElement = tableElements[0];
  if (tableElement === undefined) {
    throw new Error('Periodic table HTML table lookup returned undefined.');
  }
  return tableElement;
}

function readPeriodicTableDocument(parsedDocument: Document): PeriodicTableDocument {
  const tableElement = findPeriodicTableElement(parsedDocument);
  const tableRows = readTableRows(tableElement);
  const columns = Math.max(...tableRows.map((row) => row.length));
  if (columns > MAX_PERIODIC_TABLE_DIMENSION) {
    throw new RangeError(`Periodic table column count exceeds ${MAX_PERIODIC_TABLE_DIMENSION}. Received ${columns}.`);
  }
  if (tableRows.length * columns > MAX_PERIODIC_TABLE_DIMENSION * MAX_PERIODIC_TABLE_DIMENSION) {
    throw new RangeError(`Periodic table cell count exceeds ${MAX_PERIODIC_TABLE_DIMENSION * MAX_PERIODIC_TABLE_DIMENSION}. Received ${tableRows.length * columns}.`);
  }

  const cells: PeriodicTableCell[] = [];
  const seenCellIds = new Set<string>();
  tableRows.forEach((row, rowIndex) => {
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      const cell = row[columnIndex] === undefined
        ? createMissingCell(rowIndex + 1, columnIndex + 1)
        : readCell(row[columnIndex], rowIndex + 1, columnIndex + 1);
      if (seenCellIds.has(cell.id)) {
        throw new Error(`Periodic table cell id ${JSON.stringify(cell.id)} is duplicated.`);
      }
      seenCellIds.add(cell.id);
      cells.push(cell);
    }
  });

  const document: PeriodicTableDocument = {
    version: 1,
    rows: tableRows.length,
    columns,
    cells,
  };
  validateTableDocument(document);
  return document;
}

function serializeMultilineText(value: string): string {
  return escapeHtmlText(normalizeLineBreaks(value)).replace(/\n/g, '<br>');
}

function serializeField(field: PeriodicTableField, value: string, className: string): string {
  return `<div class="${className}" data-periodic-field="${field}" contenteditable="true">${serializeMultilineText(value)}</div>`;
}

function escapeCssString(value: string): string {
  let escapedValue = '';
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      throw new Error(`Periodic table CSS URL contains an invalid character. Received ${JSON.stringify(value)}.`);
    }
    if (codePoint <= 0x1f || codePoint === 0x7f) {
      escapedValue += `\\${codePoint.toString(16)} `;
    } else if (character === '\\') {
      escapedValue += '\\\\';
    } else if (character === '"') {
      escapedValue += '\\"';
    } else {
      escapedValue += character;
    }
  }
  return escapedValue;
}

function serializeCell(cell: PeriodicTableCell): string {
  const style = cell.style;
  const safeBackgroundColor = parseCssColor(style.backgroundColor, `cell ${JSON.stringify(cell.id)} backgroundColor`);
  const safeTextColor = parseCssColor(style.textColor, `cell ${JSON.stringify(cell.id)} textColor`);
  const safeBorderColor = parseCssColor(style.borderColor, `cell ${JSON.stringify(cell.id)} borderColor`);
  const safeBackgroundImageUrl = validateImageUrl(style.backgroundImageUrl, `cell ${JSON.stringify(cell.id)} backgroundImageUrl`);
  const cssProperties = [
    `background-color:${safeBackgroundColor}`,
    `color:${safeTextColor}`,
    `border-color:${safeBorderColor}`,
    `border-style:solid`,
    `border-width:${style.borderVisible ? '1px' : '0px'}`,
  ];
  if (safeBackgroundImageUrl !== '') {
    cssProperties.push(`background-image:url("${escapeCssString(safeBackgroundImageUrl)}")`);
  }

  const selectedAttribute = cell.selected ? ' class="selected" data-selected="true"' : ' data-selected="false"';
  return `<td data-cell-id="${escapeHtmlAttribute(cell.id)}" data-background-color="${escapeHtmlAttribute(safeBackgroundColor)}" data-text-color="${escapeHtmlAttribute(safeTextColor)}" data-border-color="${escapeHtmlAttribute(safeBorderColor)}" data-border-visible="${style.borderVisible ? 'true' : 'false'}" data-background-image-url="${escapeHtmlAttribute(safeBackgroundImageUrl)}"${selectedAttribute} style="${escapeHtmlAttribute(cssProperties.join(';'))}"><div class="elTop">${serializeField('topLeft', cell.text.topLeft, 'elHlf')}${serializeField('topRight', cell.text.topRight, 'elHlfSc')}</div>${serializeField('symbol', cell.text.symbol, 'elMain')}${serializeField('name', cell.text.name, 'elName')}<div class="elBot">${serializeField('bottomLeft', cell.text.bottomLeft, 'elHlf')}${serializeField('bottomRight', cell.text.bottomRight, 'elHlfSc')}</div></td>`;
}

function serializePeriodicTableBody(document: PeriodicTableDocument): string {
  const rows: string[] = [];
  for (let rowIndex = 0; rowIndex < document.rows; rowIndex += 1) {
    const rowCells: string[] = [];
    for (let columnIndex = 0; columnIndex < document.columns; columnIndex += 1) {
      const cell = document.cells[rowIndex * document.columns + columnIndex];
      if (cell === undefined) {
        throw new Error(`Periodic table cell r${rowIndex + 1}c${columnIndex + 1} is missing during serialization.`);
      }
      rowCells.push(serializeCell(cell));
    }
    rows.push(`<tr data-periodic-row="${rowIndex + 1}">${rowCells.join('')}</tr>`);
  }

  return rows.join('');
}

function requireSerializedHtmlSize(contents: string): string {
  const validatedContents = requirePeriodicTableFileContents(contents, 'serialize');
  if (!validatedContents.includes('<table')) {
    throw new Error('Periodic table serialized HTML is missing its table element.');
  }
  return validatedContents;
}

export function serializePeriodicTableHtml(document: PeriodicTableDocument): string {
  validateTableDocument(document);
  const serialized = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Periodic Table</title><style>html,body{margin:0;padding:0}#tableCont{border:0;border-collapse:separate;width:100%}#tableCont td{background-size:cover;border-radius:5px;padding:0 5px;vertical-align:top}.elTop,.elMain,.elName,.elBot{float:left;width:100%}.elMain{font-size:250%;min-height:50px;text-align:center}.elName{font-size:90%;min-height:25px}.elHlf,.elHlfSc{float:left;font-size:75%;min-height:15px;width:50%}.elHlfSc{text-align:right}.selected{opacity:.5}</style></head><body><main id="periodic-table-export"><table id="tableCont" data-periodic-table="1"><tbody>${serializePeriodicTableBody(document)}</tbody></table></main></body></html>`;
  return requireSerializedHtmlSize(serialized);
}

export function parsePeriodicTableHtml(contents: string): PeriodicTableDocument {
  const validatedContents = requirePeriodicTableFileContents(contents, 'parse');
  if (typeof DOMParser !== 'function') {
    throw new Error('Periodic table HTML parsing requires DOMParser. Received undefined.');
  }

  const parsedDocument = new DOMParser().parseFromString(validatedContents, 'text/html');
  requireSafeHtmlDocument(parsedDocument);
  return readPeriodicTableDocument(parsedDocument);
}

export function periodicTableDownloadBlob(document: PeriodicTableDocument): Blob {
  const contents = serializePeriodicTableHtml(document);
  if (typeof Blob !== 'function') {
    throw new Error('Periodic table download requires Blob. Received undefined.');
  }
  return new Blob([contents], { type: PERIODIC_TABLE_MIME_TYPE });
}
