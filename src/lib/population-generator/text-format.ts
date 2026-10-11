import { listPopulationProfessionDefinitions } from './catalog';
import { describePopulationValue } from './describe-population-value';
import { validatePopulationResult } from './validate';
import type { PopulationProfession, PopulationResult } from './types';

export const POPULATION_TEXT_FORMAT = 'tokenmaker-population-generator';
export const POPULATION_TEXT_FORMAT_VERSION = 1;

const TEXT_DOCUMENT_KEYS = ['format', 'formatVersion', 'result'] as const;
const CANONICAL_JSON_NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
const CITY_GEN_ATTRIBUTES = [
  'id',
  'data-format-version',
  'data-era',
  'data-size',
  'data-name-label',
  'data-population-label',
  'data-households-label',
  'data-area-km2-label',
  'data-area-mi2-label',
  'data-farmers-label',
  'data-farmland-label',
  'data-livestock-label',
  'data-fowl-label',
  'data-cattle-and-pigs-label',
  'data-other-livestock-label',
] as const;
const REQUIRED_METADATA_ATTRIBUTES = ['data-format-version', 'data-era', 'data-size'] as const;

function requireTextRecord(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Population text must be a JSON object. Received ${describePopulationValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function snippet(text: string): string {
  return JSON.stringify(text.slice(0, 180));
}

function competitorHtmlError(text: string): Error {
  return new Error(
    `Cannot determine era or size from competitor HTML population text (${text.length} characters). Received ${snippet(text)}.`,
  );
}

function looksLikeHtml(text: string): boolean {
  const sample = text.slice(0, 2_000).toLowerCase();
  return sample.includes('<div') || sample.includes('<html') || sample.includes('<script') || sample.includes('data:text/html');
}

function parseJsonText(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error: unknown) {
    if (looksLikeHtml(text)) {
      throw competitorHtmlError(text);
    }

    const reason = error instanceof Error ? error.message : describePopulationValue(error);
    throw new Error(`Population text is not valid JSON (${text.length} characters). Received ${snippet(text)}. ${reason}.`);
  }
}

function requireCatalogProfessionIds(result: PopulationResult): void {
  const allowedIds = new Set(listPopulationProfessionDefinitions(result.era).map((definition) => definition.id));
  for (const [index, profession] of result.professions.entries()) {
    if (!allowedIds.has(profession.id)) {
      throw new Error(
        `Population professions[${index}].id must belong to the ${result.era} catalog. Received ${JSON.stringify(profession.id)}.`,
      );
    }
  }
}

function acceptPopulationResult(value: unknown): PopulationResult {
  const validated = validatePopulationResult(value);
  requireCatalogProfessionIds(validated);
  return validated;
}

function escapeHtmlText(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeHtmlAttribute(value: string): string {
  return escapeHtmlText(value).replaceAll('"', '&quot;');
}

function formatPopulationNumber(value: number): string {
  const formatted = JSON.stringify(value);
  if (typeof formatted !== 'string' || formatted === 'null') {
    throw new Error(`Population number cannot be serialized. Received ${describePopulationValue(value)}.`);
  }

  return formatted;
}

function htmlAttribute(name: string, value: string): string {
  return ` ${name}="${escapeHtmlAttribute(value)}"`;
}

function writeProfessionRow(profession: PopulationProfession): string {
  return `<div class="prof" data-id="${escapeHtmlAttribute(profession.id)}">${escapeHtmlText(profession.name)}: <div>${formatPopulationNumber(profession.count)}</div></div>`;
}

function writePopulationHtml(result: PopulationResult): string {
  const professionRows = result.professions.map((profession) => writeProfessionRow(profession)).join('');
  const stats = `<div id="stats"><div>Name: ${escapeHtmlText(result.name)}<br />Size: ${formatPopulationNumber(result.areaKm2.value)} km² / ${formatPopulationNumber(result.areaMi2.value)} mi²<br />Population: ${formatPopulationNumber(result.population.value)}<br />- Households: ${formatPopulationNumber(result.households.value)}</div></div>`;
  const farmers = `<div id="farmers">Farmers: ${formatPopulationNumber(result.agriculture.farmers.value)}</div>`;
  const livestock = `<div id="livestock">Livestock: ${formatPopulationNumber(result.agriculture.livestock.value)} animals <br />- Fowl animals: ${formatPopulationNumber(result.agriculture.fowl.value)}<br />- Cattle &amp; Pigs: ${formatPopulationNumber(result.agriculture.cattleAndPigs.value)}<br />- Other: ${formatPopulationNumber(result.agriculture.otherLivestock.value)}</div>`;
  const farmland = `<div id="farmland">Farmland with crops: ${formatPopulationNumber(result.agriculture.farmland.value)} acres</div>`;
  const attributes = [
    htmlAttribute('id', 'cityGen'),
    htmlAttribute('data-format-version', String(POPULATION_TEXT_FORMAT_VERSION)),
    htmlAttribute('data-era', result.era),
    htmlAttribute('data-size', result.size),
    htmlAttribute('data-name-label', result.nameLabel),
    htmlAttribute('data-population-label', result.population.label),
    htmlAttribute('data-households-label', result.households.label),
    htmlAttribute('data-area-km2-label', result.areaKm2.label),
    htmlAttribute('data-area-mi2-label', result.areaMi2.label),
    htmlAttribute('data-farmers-label', result.agriculture.farmers.label),
    htmlAttribute('data-farmland-label', result.agriculture.farmland.label),
    htmlAttribute('data-livestock-label', result.agriculture.livestock.label),
    htmlAttribute('data-fowl-label', result.agriculture.fowl.label),
    htmlAttribute('data-cattle-and-pigs-label', result.agriculture.cattleAndPigs.label),
    htmlAttribute('data-other-livestock-label', result.agriculture.otherLivestock.label),
  ].join('');

  return `<div${attributes}>${stats}${farmers}${livestock}${farmland}<br /><div id="population">${professionRows}</div></div>`;
}

function readCanonicalNumber(fieldPath: string, token: string): number {
  if (!CANONICAL_JSON_NUMBER.test(token)) {
    throw new Error(`Population ${fieldPath} must be a canonical JSON number. Received ${JSON.stringify(token)}.`);
  }

  const value: unknown = JSON.parse(token);
  if (typeof value !== 'number' || JSON.stringify(value) !== token) {
    throw new Error(`Population ${fieldPath} must be a canonical JSON number. Received ${JSON.stringify(token)}.`);
  }

  return value;
}

function readPrefixedToken(line: string, prefix: string, fieldPath: string): number {
  if (!line.startsWith(prefix)) {
    throw new Error(`Population ${fieldPath} must start with ${JSON.stringify(prefix)}. Received ${JSON.stringify(line)}.`);
  }

  return readCanonicalNumber(fieldPath, line.slice(prefix.length));
}

function readSuffixedToken(line: string, prefix: string, suffix: string, fieldPath: string): number {
  if (!line.startsWith(prefix) || !line.endsWith(suffix) || line.length < prefix.length + suffix.length) {
    throw new Error(`Population ${fieldPath} line is invalid. Received ${JSON.stringify(line)}.`);
  }

  return readCanonicalNumber(fieldPath, line.slice(prefix.length, line.length - suffix.length));
}

function readSizeLine(line: string): { areaKm2: number; areaMi2: number } {
  const prefix = 'Size: ';
  const separator = ' km² / ';
  const suffix = ' mi²';
  if (!line.startsWith(prefix) || !line.endsWith(suffix)) {
    throw new Error(`Population area line is invalid. Received ${JSON.stringify(line)}.`);
  }

  const middle = line.slice(prefix.length, line.length - suffix.length);
  const separatorAt = middle.indexOf(separator);
  if (separatorAt === -1) {
    throw new Error(`Population area line is invalid. Received ${JSON.stringify(line)}.`);
  }

  return {
    areaKm2: readCanonicalNumber('areaKm2.value', middle.slice(0, separatorAt)),
    areaMi2: readCanonicalNumber('areaMi2.value', middle.slice(separatorAt + separator.length)),
  };
}

function readNameLine(line: string): string {
  const prefix = 'Name: ';
  if (!line.startsWith(prefix)) {
    throw new Error(`Population name line must start with ${JSON.stringify(prefix)}. Received ${JSON.stringify(line)}.`);
  }

  return line.slice(prefix.length);
}

function tagName(element: Element): string {
  return element.tagName.toLowerCase();
}

function parseInertHtmlDocument(htmlText: string): Document {
  if (typeof DOMParser !== 'function') {
    throw new Error('Population text HTML parsing requires DOMParser. Received undefined.');
  }

  // Detached document only. The file is never assigned to the page document.
  return new DOMParser().parseFromString(htmlText, 'text/html');
}

function contentNodes(element: Element): Node[] {
  const nodes: Node[] = [];
  for (const node of element.childNodes) {
    if (node.nodeType === Node.COMMENT_NODE) {
      continue;
    }

    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
      nodes.push(node);
      continue;
    }

    throw new Error(`Population text <${tagName(element)}> has unexpected node type ${node.nodeType}.`);
  }

  return nodes;
}

function requireTextValue(node: Node | undefined, fieldPath: string): string {
  if (!node || node.nodeType !== Node.TEXT_NODE) {
    const received = !node
      ? 'nothing'
      : node.nodeType === Node.ELEMENT_NODE
        ? `<${tagName(node as Element)}>`
        : `node type ${node.nodeType}`;
    throw new Error(`Population text ${fieldPath} must be text. Received ${received}.`);
  }

  return node.nodeValue ?? '';
}

function requireNoAttributes(element: Element, fieldPath: string): void {
  if (element.attributes.length === 0) {
    return;
  }

  const names: string[] = [];
  for (const attribute of element.attributes) {
    names.push(attribute.name);
  }

  throw new Error(`Population text ${fieldPath} must not have attributes. Received ${JSON.stringify(names)}.`);
}

function requireBreakElement(node: Node | undefined, fieldPath: string): void {
  if (!node || node.nodeType !== Node.ELEMENT_NODE || tagName(node as Element) !== 'br') {
    const received = !node
      ? 'nothing'
      : node.nodeType === Node.TEXT_NODE
        ? JSON.stringify(node.nodeValue)
        : node.nodeType === Node.ELEMENT_NODE
          ? `<${tagName(node as Element)}>`
          : `node type ${node.nodeType}`;
    throw new Error(`Population text ${fieldPath} must be <br>. Received ${received}.`);
  }

  const lineBreak = node as Element;
  requireNoAttributes(lineBreak, fieldPath);
  if (lineBreak.childNodes.length > 0) {
    throw new Error(`Population text ${fieldPath} must be an empty <br>.`);
  }
}

function rejectUnknownAttributes(element: Element, allowedNames: readonly string[]): void {
  const allowed = new Set<string>(allowedNames);
  for (const attribute of element.attributes) {
    if (!allowed.has(attribute.name)) {
      throw new Error(
        `Population text <${tagName(element)}> has unknown attribute ${JSON.stringify(attribute.name)}. Received ${describePopulationValue(attribute.value)}.`,
      );
    }
  }
}

function requireAttribute(element: Element, name: string): string {
  const value = element.getAttribute(name);
  if (value === null) {
    throw new Error(`Population text <${tagName(element)}> is missing ${JSON.stringify(name)}.`);
  }

  return value;
}

function requireElementId(element: Element, id: string): void {
  rejectUnknownAttributes(element, ['id']);
  const received = requireAttribute(element, 'id');
  if (received !== id) {
    throw new Error(`Population text <${tagName(element)}> id must be ${JSON.stringify(id)}. Received ${JSON.stringify(received)}.`);
  }
}

function elementChildren(element: Element): Element[] {
  const children: Element[] = [];
  for (const node of contentNodes(element)) {
    if (node.nodeType === Node.TEXT_NODE) {
      if ((node.nodeValue ?? '').trim().length > 0) {
        throw new Error(`Population text <${tagName(element)}> has unexpected text ${JSON.stringify(node.nodeValue)}.`);
      }

      continue;
    }

    children.push(node as Element);
  }

  return children;
}

function requireChildElements(element: Element, expectedTags: readonly string[]): Element[] {
  const children = elementChildren(element);
  if (children.length !== expectedTags.length) {
    throw new Error(
      `Population text <${tagName(element)}> must contain ${expectedTags.length} child elements. Received ${children.length}: ${children.map((child) => tagName(child)).join(', ')}.`,
    );
  }

  for (const [index, expectedTag] of expectedTags.entries()) {
    const received = children[index] ? tagName(children[index]) : undefined;
    if (received !== expectedTag) {
      throw new Error(
        `Population text <${tagName(element)}> child ${index} must be ${expectedTag}. Received ${JSON.stringify(received)}.`,
      );
    }
  }

  return children;
}

function readStats(statsBody: Element): { name: string; areaKm2: number; areaMi2: number; population: number; households: number } {
  requireNoAttributes(statsBody, '#stats body');
  const nodes = contentNodes(statsBody);
  if (nodes.length !== 7) {
    throw new Error(`Population text #stats must contain 7 nodes. Received ${nodes.length}.`);
  }

  const [nameNode, firstBreak, sizeNode, secondBreak, populationNode, thirdBreak, householdNode] = nodes;
  requireBreakElement(firstBreak, '#stats break 1');
  requireBreakElement(secondBreak, '#stats break 2');
  requireBreakElement(thirdBreak, '#stats break 3');
  const size = readSizeLine(requireTextValue(sizeNode, '#stats size'));
  return {
    name: readNameLine(requireTextValue(nameNode, '#stats name')),
    areaKm2: size.areaKm2,
    areaMi2: size.areaMi2,
    population: readPrefixedToken(requireTextValue(populationNode, '#stats population'), 'Population: ', 'population.value'),
    households: readPrefixedToken(requireTextValue(householdNode, '#stats households'), '- Households: ', 'households.value'),
  };
}

function readSingleText(element: Element, fieldPath: string): string {
  const nodes = contentNodes(element);
  if (nodes.length !== 1 || nodes[0]?.nodeType !== Node.TEXT_NODE) {
    throw new Error(`Population text ${fieldPath} must contain one text node. Received ${nodes.length} children.`);
  }

  return nodes[0].nodeValue ?? '';
}

function readLivestock(livestock: Element): { livestock: number; fowl: number; cattleAndPigs: number; otherLivestock: number } {
  const nodes = contentNodes(livestock);
  if (nodes.length !== 7) {
    throw new Error(`Population text #livestock must contain 7 nodes. Received ${nodes.length}.`);
  }

  const [totalNode, firstBreak, fowlNode, secondBreak, cattleNode, thirdBreak, otherNode] = nodes;
  requireBreakElement(firstBreak, '#livestock break 1');
  requireBreakElement(secondBreak, '#livestock break 2');
  requireBreakElement(thirdBreak, '#livestock break 3');
  return {
    livestock: readSuffixedToken(
      requireTextValue(totalNode, '#livestock total'),
      'Livestock: ',
      ' animals ',
      'agriculture.livestock.value',
    ),
    fowl: readPrefixedToken(requireTextValue(fowlNode, '#livestock fowl'), '- Fowl animals: ', 'agriculture.fowl.value'),
    cattleAndPigs: readPrefixedToken(
      requireTextValue(cattleNode, '#livestock cattle'),
      '- Cattle & Pigs: ',
      'agriculture.cattleAndPigs.value',
    ),
    otherLivestock: readPrefixedToken(requireTextValue(otherNode, '#livestock other'), '- Other: ', 'agriculture.otherLivestock.value'),
  };
}

function readProfession(index: number, element: Element): PopulationProfession {
  const fieldPath = `professions[${index}]`;
  if (tagName(element) !== 'div') {
    throw new Error(`Population text ${fieldPath} must be a div. Received ${JSON.stringify(tagName(element))}.`);
  }

  rejectUnknownAttributes(element, ['class', 'data-id']);
  const className = requireAttribute(element, 'class');
  if (className !== 'prof') {
    throw new Error(`Population text ${fieldPath} class must be "prof". Received ${JSON.stringify(className)}.`);
  }

  const id = requireAttribute(element, 'data-id');
  const nodes = contentNodes(element);
  if (nodes.length !== 2) {
    throw new Error(`Population text ${fieldPath} must contain a name and a count. Received ${nodes.length} children.`);
  }

  const nameText = requireTextValue(nodes[0], fieldPath);
  const suffix = ': ';
  if (!nameText.endsWith(suffix)) {
    throw new Error(`Population text ${fieldPath} name must end with ${JSON.stringify(suffix)}. Received ${JSON.stringify(nameText)}.`);
  }

  const countNode = nodes[1];
  if (!countNode || countNode.nodeType !== Node.ELEMENT_NODE || tagName(countNode as Element) !== 'div') {
    throw new Error(`Population text ${fieldPath} count must be a div.`);
  }

  const countElement = countNode as Element;
  requireNoAttributes(countElement, `${fieldPath} count`);
  return {
    id,
    name: nameText.slice(0, -suffix.length),
    count: readCanonicalNumber(`${fieldPath}.count`, readSingleText(countElement, `${fieldPath} count`)),
  };
}

function readProfessions(population: Element): PopulationProfession[] {
  return elementChildren(population).map((child, index) => readProfession(index, child));
}

function readCityGen(cityGen: Element): unknown {
  if (tagName(cityGen) !== 'div') {
    throw new Error(`Population text #cityGen must be a div. Received ${JSON.stringify(tagName(cityGen))}.`);
  }

  rejectUnknownAttributes(cityGen, CITY_GEN_ATTRIBUTES);
  if (requireAttribute(cityGen, 'id') !== 'cityGen') {
    throw new Error(`Population text #cityGen id must be "cityGen". Received ${JSON.stringify(cityGen.getAttribute('id'))}.`);
  }

  const formatVersion = requireAttribute(cityGen, 'data-format-version');
  if (formatVersion !== String(POPULATION_TEXT_FORMAT_VERSION)) {
    throw new Error(
      `Population text formatVersion must be ${POPULATION_TEXT_FORMAT_VERSION}. Received ${describePopulationValue(formatVersion)}.`,
    );
  }

  const [stats, farmers, livestock, farmland, lineBreak, population] = requireChildElements(cityGen, [
    'div',
    'div',
    'div',
    'div',
    'br',
    'div',
  ]);
  requireElementId(stats, 'stats');
  requireElementId(farmers, 'farmers');
  requireElementId(livestock, 'livestock');
  requireElementId(farmland, 'farmland');
  requireNoAttributes(lineBreak, '#cityGen br');
  if (lineBreak.childNodes.length > 0) {
    throw new Error('Population text #cityGen br must be empty.');
  }

  requireElementId(population, 'population');
  const [statsBody] = requireChildElements(stats, ['div']);
  const statsValues = readStats(statsBody);
  const livestockValues = readLivestock(livestock);
  return {
    version: 1,
    era: requireAttribute(cityGen, 'data-era'),
    size: requireAttribute(cityGen, 'data-size'),
    nameLabel: requireAttribute(cityGen, 'data-name-label'),
    name: statsValues.name,
    population: {
      label: requireAttribute(cityGen, 'data-population-label'),
      value: statsValues.population,
    },
    households: {
      label: requireAttribute(cityGen, 'data-households-label'),
      value: statsValues.households,
    },
    areaKm2: {
      label: requireAttribute(cityGen, 'data-area-km2-label'),
      value: statsValues.areaKm2,
    },
    areaMi2: {
      label: requireAttribute(cityGen, 'data-area-mi2-label'),
      value: statsValues.areaMi2,
    },
    agriculture: {
      farmers: {
        label: requireAttribute(cityGen, 'data-farmers-label'),
        value: readPrefixedToken(readSingleText(farmers, '#farmers'), 'Farmers: ', 'agriculture.farmers.value'),
      },
      farmland: {
        label: requireAttribute(cityGen, 'data-farmland-label'),
        value: readSuffixedToken(
          readSingleText(farmland, '#farmland'),
          'Farmland with crops: ',
          ' acres',
          'agriculture.farmland.value',
        ),
      },
      livestock: {
        label: requireAttribute(cityGen, 'data-livestock-label'),
        value: livestockValues.livestock,
      },
      fowl: {
        label: requireAttribute(cityGen, 'data-fowl-label'),
        value: livestockValues.fowl,
      },
      cattleAndPigs: {
        label: requireAttribute(cityGen, 'data-cattle-and-pigs-label'),
        value: livestockValues.cattleAndPigs,
      },
      otherLivestock: {
        label: requireAttribute(cityGen, 'data-other-livestock-label'),
        value: livestockValues.otherLivestock,
      },
    },
    professions: readProfessions(population),
  };
}

function hasRequiredMetadata(element: Element): boolean {
  return REQUIRED_METADATA_ATTRIBUTES.every((name) => element.hasAttribute(name));
}

function assertNoHeadContent(head: HTMLHeadElement | null): void {
  if (!head) {
    throw new Error('Population text HTML document is missing head. Received null.');
  }

  for (const node of head.childNodes) {
    if (node.nodeType === Node.COMMENT_NODE) {
      continue;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if ((node.nodeValue ?? '').trim().length > 0) {
        throw new Error(`Population text has unexpected text ${JSON.stringify(node.nodeValue)}.`);
      }

      continue;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      throw new Error(`Population text has unexpected element ${JSON.stringify(tagName(node as Element))}.`);
    }

    throw new Error(`Population text head has unexpected node type ${node.nodeType}.`);
  }
}

function assertAncestorChain(container: Element, cityGen: Element): void {
  for (const node of container.childNodes) {
    if (node.nodeType === Node.COMMENT_NODE) {
      continue;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if ((node.nodeValue ?? '').trim().length > 0) {
        throw new Error(`Population text has unexpected text ${JSON.stringify(node.nodeValue)}.`);
      }

      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      throw new Error(`Population text <${tagName(container)}> has unexpected node type ${node.nodeType}.`);
    }

    const element = node as Element;
    if (element === cityGen) {
      continue;
    }

    if (element.contains(cityGen)) {
      assertAncestorChain(element, cityGen);
      continue;
    }

    throw new Error(`Population text has unexpected element ${JSON.stringify(tagName(element))}.`);
  }
}

function assertBodyWrapsCityGen(body: HTMLElement | null, cityGen: Element): void {
  if (!body) {
    throw new Error('Population text HTML document is missing body. Received null.');
  }

  if (!body.contains(cityGen)) {
    throw new Error('Population text #cityGen is outside the document body.');
  }

  assertAncestorChain(body, cityGen);
}

function parseHtmlPopulationText(htmlText: string, originalText: string): PopulationResult {
  const parsedDocument = parseInertHtmlDocument(htmlText);
  const cityGenElements = Array.from(parsedDocument.querySelectorAll('#cityGen'));
  const cityGen = cityGenElements[0];
  if (cityGenElements.length !== 1 || !cityGen || !hasRequiredMetadata(cityGen)) {
    throw competitorHtmlError(originalText);
  }

  assertNoHeadContent(parsedDocument.head);
  assertBodyWrapsCityGen(parsedDocument.body, cityGen);
  return acceptPopulationResult(readCityGen(cityGen));
}

function parseJsonPopulationText(text: string): PopulationResult {
  const parsed = requireTextRecord(parseJsonText(text));
  for (const key of Object.keys(parsed)) {
    if (!TEXT_DOCUMENT_KEYS.includes(key as (typeof TEXT_DOCUMENT_KEYS)[number])) {
      throw new Error(`Population text has unknown field ${JSON.stringify(key)}. Received ${describePopulationValue(parsed)}.`);
    }
  }

  if (parsed.format !== POPULATION_TEXT_FORMAT) {
    throw new Error(
      `Population text format must be ${JSON.stringify(POPULATION_TEXT_FORMAT)}. Received ${describePopulationValue(parsed.format)}.`,
    );
  }

  if (parsed.formatVersion !== POPULATION_TEXT_FORMAT_VERSION) {
    throw new Error(
      `Population text formatVersion must be ${POPULATION_TEXT_FORMAT_VERSION}. Received ${describePopulationValue(parsed.formatVersion)}.`,
    );
  }

  if (!Object.hasOwn(parsed, 'result')) {
    throw new Error(`Population text is missing "result". Received ${describePopulationValue(parsed)}.`);
  }

  return acceptPopulationResult(parsed.result);
}

export function serializePopulationResult(result: PopulationResult): string {
  const validated = validatePopulationResult(result);
  requireCatalogProfessionIds(validated);
  return `${writePopulationHtml(validated)}\n`;
}

export function parsePopulationResult(text: string): PopulationResult {
  if (typeof text !== 'string') {
    throw new Error(`Population text must be a string. Received ${describePopulationValue(text)}.`);
  }

  const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  if (withoutBom.trimStart().startsWith('<')) {
    return parseHtmlPopulationText(withoutBom, text);
  }

  return parseJsonPopulationText(withoutBom);
}

export function decodePopulationUtf8(bytes: Uint8Array): string {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error(`Population text bytes must be a Uint8Array. Received ${describePopulationValue(bytes)}.`);
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : describePopulationValue(error);
    throw new Error(`Population text is not valid UTF-8 (${bytes.byteLength} bytes). ${reason}.`);
  }
}
