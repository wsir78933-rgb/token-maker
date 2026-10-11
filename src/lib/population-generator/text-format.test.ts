// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { listPopulationProfessionDefinitions } from './catalog';
import { generatePopulation } from './generate';
import {
  POPULATION_TEXT_FORMAT,
  POPULATION_TEXT_FORMAT_VERSION,
  decodePopulationUtf8,
  parsePopulationResult,
  serializePopulationResult,
} from './text-format';
import type { PopulationEra, PopulationResult } from './types';
import type { SiteLocale } from '@/lib/site-locale';

const EXECUTION_MARKER = '__populationTextFormatExecuted';
const QINGXI_TOWN_UTF8 = [0xe9, 0x9d, 0x92, 0xe6, 0xba, 0xaa, 0xe9, 0x95, 0x87];

function generatedResult(era: PopulationEra, locale: SiteLocale): PopulationResult {
  return generatePopulation({ era, size: 'city', locale, random: () => 0 });
}

function professionIds(text: string): string[] {
  return [...text.matchAll(/data-id="([^"]*)"/gu)].map((match) => match[1] ?? '');
}

describe('population text', () => {
  it.each([
    ['medieval', 'en'],
    ['medieval', 'zh'],
    ['modern', 'en'],
    ['modern', 'zh'],
    ['future', 'en'],
    ['future', 'zh'],
  ] as const)('round-trips %s %s HTML with 170 professions and 6 agriculture fields', (era, locale) => {
    const result = generatedResult(era, locale);
    const text = serializePopulationResult(result);
    const again = serializePopulationResult(result);

    expect(again).toBe(text);
    expect(text.startsWith('<div id="cityGen" data-format-version="1" ')).toBe(true);
    expect(text).toContain(`data-era="${era}"`);
    expect(text).toContain('data-size="city"');
    expect(text).toContain('id="stats"');
    expect(text).toContain('id="farmers"');
    expect(text).toContain('id="livestock"');
    expect(text).toContain('id="farmland"');
    expect(text).toContain('id="population"');
    expect(text).toContain('Name: ');
    expect(text).toContain(' km² / ');
    expect(text).toContain(' mi²');
    expect(text).toContain('Population: ');
    expect(text).toContain('- Households: ');
    expect(text).toContain('Farmers: ');
    expect(text).toContain('Livestock: ');
    expect(text).toContain('- Fowl animals: ');
    expect(text).toContain('- Cattle &amp; Pigs: ');
    expect(text).toContain('- Other: ');
    expect(text).toContain('Farmland with crops: ');
    expect(text).toContain(' acres');
    expect(text).toContain('data-name-label="');
    expect(text).toContain('data-population-label="');
    expect(text).toContain('data-households-label="');
    expect(text).toContain('data-area-km2-label="');
    expect(text).toContain('data-area-mi2-label="');
    expect(text).toContain('data-farmers-label="');
    expect(text).toContain('data-farmland-label="');
    expect(text).toContain('data-livestock-label="');
    expect(text).toContain('data-fowl-label="');
    expect(text).toContain('data-cattle-and-pigs-label="');
    expect(text).toContain('data-other-livestock-label="');
    expect(text).not.toContain('<html');
    expect(text).not.toContain('<!DOCTYPE');
    expect(text).not.toContain('saveLocaled');
    expect(text.match(/class="prof"/gu)).toHaveLength(170);
    expect(professionIds(text)).toEqual(result.professions.map((profession) => profession.id));
    expect(parsePopulationResult(text)).toEqual(result);
    expect(serializePopulationResult(parsePopulationResult(text))).toBe(text);
    expect(text).toContain(result.professions[0]?.name ?? '');
    expect(result.professions).toHaveLength(170);
  });

  it('keeps edited labels, names, zeros, quotes, markup, and unicode', () => {
    const result = generatedResult('future', 'zh');
    result.nameLabel = '自定义"名称" & <tag>';
    result.name = '<script>alert(1)</script>青溪\u2028A & B';
    result.population.label = '人口标签';
    result.population.value = 0;
    result.households.label = '住户标签';
    result.households.value = 4;
    result.areaKm2.label = '平方公里';
    result.areaKm2.value = 1.25;
    result.areaMi2.label = '平方英里';
    result.areaMi2.value = 0.5;
    result.agriculture.farmers.label = '农民标签';
    result.agriculture.farmers.value = 0;
    result.agriculture.farmland.label = '农田标签';
    result.agriculture.farmland.value = 0;
    result.agriculture.livestock.label = '牲畜标签';
    result.agriculture.livestock.value = 0;
    result.agriculture.fowl.label = '家禽标签';
    result.agriculture.fowl.value = 0;
    result.agriculture.cattleAndPigs.label = '牛猪标签';
    result.agriculture.cattleAndPigs.value = 0;
    result.agriculture.otherLivestock.label = '其他牲畜';
    result.agriculture.otherLivestock.value = 0;
    result.professions[0].name = '</div><script>alert(1)</script> "引号" & 改过的职业';
    result.professions[0].count = 0;
    result.professions[169].count = 8;

    const text = serializePopulationResult(result);
    expect(text).not.toContain('<script>');
    expect(text).toContain('&lt;script&gt;alert(1)&lt;/script&gt;青溪');
    expect(text).toContain('&lt;/div&gt;&lt;script&gt;');
    expect(text).toContain('data-name-label="自定义&quot;名称&quot; &amp; &lt;tag&gt;"');
    expect(text).toContain('Population: 0');
    expect(text).toContain('Farmers: 0');
    expect(text).toContain('Livestock: 0 animals ');
    expect(text).toContain('- Fowl animals: 0');
    expect(text).toContain('- Cattle &amp; Pigs: 0');
    expect(text).toContain('- Other: 0');
    expect(text).toContain('Farmland with crops: 0 acres');
    expect(text).toContain('Size: 1.25 km² / 0.5 mi²');
    expect(text).toContain(': <div>0</div>');
    expect(text).toContain(': <div>8</div>');
    expect(text.endsWith('\n')).toBe(true);
    expect(text.endsWith('\n\n')).toBe(false);
    expect(parsePopulationResult(text)).toEqual(result);
    expect(parsePopulationResult(`\uFEFF${text}`)).toEqual(result);
    expect(parsePopulationResult(`\n\n${text}`)).toEqual(result);
    expect(serializePopulationResult(result)).toBe(text);
    expect(text.match(/<script[\s>]/u)).toBeNull();
  });

  it('reads a self-contained version-1 JSON document and round-trips it as HTML', () => {
    const result = generatedResult('modern', 'zh');
    const jsonText = JSON.stringify({
      format: POPULATION_TEXT_FORMAT,
      formatVersion: POPULATION_TEXT_FORMAT_VERSION,
      result,
    });
    expect(jsonText.startsWith('{"format":"tokenmaker-population-generator","formatVersion":1,"result":')).toBe(true);
    expect(jsonText).not.toContain('<div id="cityGen"');

    const parsed = parsePopulationResult(jsonText);
    expect(parsed).toEqual(result);
    expect(parsePopulationResult(`\uFEFF${jsonText}`)).toEqual(result);
    expect(parsed.professions).toHaveLength(170);

    const html = serializePopulationResult(parsed);
    expect(html.startsWith('<div id="cityGen"')).toBe(true);
    expect(parsePopulationResult(html)).toEqual(parsed);
    expect(serializePopulationResult(parsed)).toBe(html);
    expect(parsePopulationResult(`<div id="saveLocaled">${html.trimEnd()}</div>\n`)).toEqual(parsed);
  });

  it('rejects competitor HTML, bad JSON, and a non-string', () => {
    const html =
      '<div id="saveLocaled"><div id="cityGen"><div id="stats" contenteditable="true">Name: Test<br />Population: 1200</div></div></div>';
    expect(() => parsePopulationResult(html)).toThrow(/Cannot determine era or size/);
    expect(() => parsePopulationResult(html)).toThrow(/saveLocaled/);
    expect(() => parsePopulationResult('not json')).toThrow(/not valid JSON/);
    expect(() => parsePopulationResult('{"format":"other"}')).toThrow(/tokenmaker-population-generator/);
    expect(() => parsePopulationResult(123 as unknown as string)).toThrow(/^Population text must be a string/);
  });

  it('rejects HTML that is missing era or size metadata', () => {
    const text = serializePopulationResult(generatedResult('modern', 'en')).replace(/ data-era="modern"/u, '');
    expect(() => parsePopulationResult(text)).toThrow(/^Cannot determine era or size/);
    expect(() => parsePopulationResult('<div id="cityGen" data-format-version="1" data-size="city"></div>')).toThrow(
      /^Cannot determine era or size/,
    );
  });

  it('rejects the wrong HTML format version and a missing label', () => {
    const text = serializePopulationResult(generatedResult('modern', 'zh'));
    expect(() => parsePopulationResult(text.replace('data-format-version="1"', 'data-format-version="2"'))).toThrow(
      /Population text formatVersion must be 1\. Received "2"/,
    );
    expect(() => parsePopulationResult(text.replace(/ data-name-label="[^"]*"/u, ''))).toThrow(/data-name-label/);
  });

  it('rejects duplicate, foreign, empty, and missing profession ids', () => {
    const result = generatedResult('modern', 'en');
    const text = serializePopulationResult(result);
    const ids = professionIds(text);
    const medievalId = listPopulationProfessionDefinitions('medieval')[0]?.id;
    expect(medievalId).toBeTruthy();
    expect(() => parsePopulationResult(text.replace(`data-id="${ids[1]}"`, `data-id="${ids[0]}"`))).toThrow(
      /duplicate id/,
    );
    expect(() => parsePopulationResult(text.replace(`data-id="${ids[0]}"`, `data-id="${medievalId}"`))).toThrow(
      /must belong to the modern catalog/,
    );
    expect(() => parsePopulationResult(text.replace(`data-id="${ids[0]}"`, 'data-id="modern:not-a-profession"'))).toThrow(
      /must belong to the modern catalog/,
    );
    expect(() => parsePopulationResult(text.replace(`data-id="${ids[0]}"`, 'data-id=""'))).toThrow(
      /professions\[0\]\.id must be a non-empty string/,
    );
    expect(() => parsePopulationResult(text.replace(` data-id="${ids[0]}"`, ''))).toThrow(/missing "data-id"/);
  });

  it('rejects a missing profession row and abnormal numbers', () => {
    const text = serializePopulationResult(generatedResult('future', 'en'));
    const withoutOneRow = text.replace(/<div class="prof" data-id="[^"]*">[^<]*<div>[^<]*<\/div><\/div>/u, '');
    expect(() => parsePopulationResult(withoutOneRow)).toThrow(/Population professions must contain 170 entries\. Received 169/);
    expect(() => parsePopulationResult(text.replace(/Population: [^<]+/u, 'Population: -1'))).toThrow(
      /population\.value must be a non-negative integer/,
    );
    expect(() => parsePopulationResult(text.replace(/Population: [^<]+/u, 'Population: 1.5'))).toThrow(
      /population\.value must be a non-negative integer/,
    );
    expect(() => parsePopulationResult(text.replace(/Population: [^<]+/u, 'Population: 1,290'))).toThrow(
      /canonical JSON number/,
    );
    expect(() => parsePopulationResult(text.replace(/Population: [^<]+/u, 'Population: abc'))).toThrow(
      /canonical JSON number/,
    );
  });

  it('does not execute scripts or event attributes', () => {
    let executed = false;
    const bodyBefore = document.body.innerHTML;
    Object.defineProperty(globalThis, EXECUTION_MARKER, {
      configurable: true,
      value: () => {
        executed = true;
      },
    });

    try {
      const raw = `<div id="cityGen" data-format-version="1" data-era="modern" data-size="city" onclick="globalThis.${EXECUTION_MARKER}()"><img src="x" onerror="globalThis.${EXECUTION_MARKER}()"><script>globalThis.${EXECUTION_MARKER}()</script></div>`;
      expect(raw).toContain('<script>');
      const detached = new DOMParser().parseFromString(raw, 'text/html');
      expect(detached.querySelector('script')?.textContent).toContain(EXECUTION_MARKER);
      expect(detached.getElementById('cityGen')?.getAttribute('onclick')).toContain(EXECUTION_MARKER);
      expect(() => parsePopulationResult(raw)).toThrow(/^Population /);

      const besideScript = `${serializePopulationResult(generatedResult('modern', 'en')).trimEnd()}<script>globalThis.${EXECUTION_MARKER}()</script>`;
      expect(() => parsePopulationResult(besideScript)).toThrow(/unexpected element "script"/);
      expect(executed).toBe(false);
      expect(document.body.innerHTML).toBe(bodyBefore);
      expect(document.querySelector('script')).toBeNull();
    } finally {
      Reflect.deleteProperty(globalThis, EXECUTION_MARKER);
    }
  });

  it('decodes UTF-8 and reports invalid bytes', () => {
    expect(decodePopulationUtf8(Uint8Array.from(QINGXI_TOWN_UTF8))).toBe('青溪镇');
    expect(() => decodePopulationUtf8(Uint8Array.from([0xff, 0xfe]))).toThrow(/not valid UTF-8/);
    expect(() => decodePopulationUtf8(Uint8Array.from([0xff, 0xfe]))).toThrow(/2 bytes/);
  });
});
