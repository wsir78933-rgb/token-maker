// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import {
  parsePeriodicTableHtml,
  periodicTableDownloadBlob,
  serializePeriodicTableHtml,
} from './html';
import type { PeriodicTableCell, PeriodicTableDocument, PeriodicTableStyle } from './types';

const baseStyle: PeriodicTableStyle = {
  backgroundColor: 'transparent',
  textColor: '#202020',
  borderColor: '#747474',
  borderVisible: true,
  backgroundImageUrl: '',
};

function createCell(id: string, index: number, overrides: Partial<PeriodicTableCell> = {}): PeriodicTableCell {
  return {
    id,
    text: {
      topLeft: `top-${index}`,
      topRight: `mass-${index}`,
      symbol: `S${index}`,
      name: `Name ${index}`,
      bottomLeft: `bottom-${index}`,
      bottomRight: `note-${index}`,
    },
    style: { ...baseStyle },
    selected: false,
    ...overrides,
  };
}

function createDocument(): PeriodicTableDocument {
  return {
    version: 1,
    rows: 2,
    columns: 2,
    cells: [
      createCell('cell-1', 1, {
        text: {
          topLeft: '1\nline 2',
          topRight: '1.01',
          symbol: 'H',
          name: 'Hydrogen',
          bottomLeft: 'group 1',
          bottomRight: 'period 1',
        },
        style: {
          backgroundColor: '#ffcc00',
          textColor: '#112233',
          borderColor: '#445566',
          borderVisible: false,
          backgroundImageUrl: 'https://example.com/background.png',
        },
        selected: true,
      }),
      createCell('cell-2', 2),
      createCell('cell-3', 3),
      createCell('cell-4', 4, {
        style: {
          ...baseStyle,
          backgroundImageUrl: 'data:image/png;base64,AAAA',
        },
      }),
    ],
  };
}

function legacyCell(label: string): string {
  return `<td><div class="elTop"><div class="elHlf">${label}</div><div class="elHlfSc">1.00</div></div><div class="elMain">X</div><div class="elName">${label} name</div><div class="elBot"><div class="elHlf">left</div><div class="elHlfSc">right</div></div></td>`;
}

function createLegacyHtml(): string {
  const rows = Array.from({ length: 7 }, (_, rowIndex) => `<tr id="elDat${rowIndex + 1}">${Array.from({ length: 18 }, (_, columnIndex) => legacyCell(`r${rowIndex + 1}c${columnIndex + 1}`)).join('')}</tr>`);
  rows.push(`<tr id="elDat8">${Array.from({ length: 17 }, (_, columnIndex) => legacyCell(`r8c${columnIndex + 1}`)).join('')}</tr>`);
  rows.push(`<tr id="elDat9">${Array.from({ length: 17 }, (_, columnIndex) => legacyCell(`r9c${columnIndex + 1}`)).join('')}</tr>`);
  return `<div id="saveLocaled"><table id="tableCont">${rows.join('')}</table></div>`;
}

describe('periodic table HTML transfer', () => {
  it('round trips six multiline fields, selection, styles, and image URLs', () => {
    const document = createDocument();
    const serialized = serializePeriodicTableHtml(document);
    const parsed = parsePeriodicTableHtml(serialized);

    expect(parsed).toEqual(document);
    expect(serialized).toContain('contenteditable="true"');
    expect(serialized).not.toContain('<script');
  });

  it('keeps inline style edits ahead of stale transfer attributes', () => {
    const serialized = serializePeriodicTableHtml(createDocument());
    const edited = serialized
      .replace('background-color:#ffcc00', 'background-color:#00ff00')
      .replace('color:#112233', 'color:#abcdef')
      .replace('border-color:#445566', 'border-color:#101010')
      .replace('border-width:0px', 'border-width:2px')
      .replace('background-image:url(&quot;https://example.com/background.png&quot;)', 'background-image:url(&quot;https://example.com/edited.png&quot;)');

    const parsed = parsePeriodicTableHtml(edited);

    expect(parsed.cells[0]?.style).toMatchObject({
      backgroundColor: 'rgb(0, 255, 0)',
      textColor: 'rgb(171, 205, 239)',
      borderColor: 'rgb(16, 16, 16)',
      borderVisible: true,
      backgroundImageUrl: 'https://example.com/edited.png',
    });
  });

  it('round trips http image URLs containing CSS string characters', () => {
    const imageUrl = 'https://example.com/a"b\'c\\d.png';
    const document = createDocument();
    document.cells[0]!.style.backgroundImageUrl = imageUrl;

    const parsed = parsePeriodicTableHtml(serializePeriodicTableHtml(document));

    expect(parsed.cells[0]?.style.backgroundImageUrl).toBe(imageUrl);
  });

  it('produces an HTML Blob with the competitor TXT filename contract', async () => {
    const blob = periodicTableDownloadBlob(createDocument());

    expect(blob.type).toBe('text/html;charset=utf-8');
    expect(await blob.text()).toContain('<table id="tableCont"');
  });

  it('imports the competitor field classes and pads the final 17-column rows', () => {
    const parsed = parsePeriodicTableHtml(createLegacyHtml());

    expect(parsed.rows).toBe(9);
    expect(parsed.columns).toBe(18);
    expect(parsed.cells).toHaveLength(162);
    expect(parsed.cells[0]?.text).toEqual({
      topLeft: 'r1c1',
      topRight: '1.00',
      symbol: 'X',
      name: 'r1c1 name',
      bottomLeft: 'left',
      bottomRight: 'right',
    });
    expect(parsed.cells[143]?.text.name).toBe('');
    expect(parsed.cells[143]?.style.backgroundColor).toBe('transparent');
    expect(parsed.cells[143]?.style.borderVisible).toBe(false);
  });

  it('accepts the competitor default preset inline tbody and cell styles', () => {
    const contents = `<table id="tableCont"><tbody style="font-size: 85%"><tr id="elDat1"><td style="border-width: 1px; background-color: rgb(80, 121, 231); border-color: rgb(19, 19, 179);"><div class="elTop" style="color: rgb(19, 19, 179);"><div contenteditable="true" class="elHlf" style="color: rgb(19, 19, 179);">1</div><div contenteditable="true" class="elHlfSc" style="color: rgb(19, 19, 179);">1.008</div></div><div contenteditable="true" class="elMain" style="color: rgb(19, 19, 179);">H</div><div contenteditable="true" class="elName" style="color: rgb(19, 19, 179);">Hydrogen</div><div class="elBot" style="color: rgb(19, 19, 179);"><div contenteditable="true" class="elHlf" style="color: rgb(19, 19, 179);"></div><div contenteditable="true" class="elHlfSc" style="color: rgb(19, 19, 179);"></div></div></td><td style="border-width: 0px; background-color: transparent; border-color: rgb(19, 19, 179);"><div class="elTop" style="color: rgb(19, 19, 179);"><div contenteditable="true" class="elHlf" style="color: rgb(19, 19, 179);"></div><div contenteditable="true" class="elHlfSc" style="color: rgb(19, 19, 179);"></div></div><div contenteditable="true" class="elMain" style="color: rgb(19, 19, 179);"></div><div contenteditable="true" class="elName" style="color: rgb(19, 19, 179);"></div><div class="elBot" style="color: rgb(19, 19, 179);"><div contenteditable="true" class="elHlf" style="color: rgb(19, 19, 179);"></div><div contenteditable="true" class="elHlfSc" style="color: rgb(19, 19, 179);"></div></div></td></tr></tbody></table>`;

    const parsed = parsePeriodicTableHtml(contents);

    expect(parsed.cells[0]?.text.symbol).toBe('H');
    expect(parsed.cells[0]?.style).toMatchObject({
      backgroundColor: 'rgb(80, 121, 231)',
      textColor: 'rgb(19, 19, 179)',
      borderColor: 'rgb(19, 19, 179)',
      borderVisible: true,
    });
    expect(parsed.cells[1]?.style.borderVisible).toBe(false);
  });

  it('preserves line breaks represented by br and nested div elements', () => {
    const contents = `<table id="tableCont"><tr><td><div class="elTop"><div class="elHlf">first<br>second</div><div class="elHlfSc"><div>third</div><div>fourth</div></div></div><div class="elMain">S</div><div class="elName">Name</div><div class="elBot"><div class="elHlf"></div><div class="elHlfSc"></div></div></td></tr></table>`;

    const parsed = parsePeriodicTableHtml(contents);

    expect(parsed.cells[0]?.text.topLeft).toBe('first\nsecond');
    expect(parsed.cells[0]?.text.topRight).toBe('third\nfourth');
  });

  it('preserves contenteditable block breaks from the offline edited DOM shape', () => {
    const serialized = serializePeriodicTableHtml(createDocument());
    const offlineEditedMarkup = serialized.replace('>Hydrogen</div>', '>Offline<div>Edited</div></div>');

    const parsed = parsePeriodicTableHtml(offlineEditedMarkup);

    expect(parsed.cells[0]?.text.name).toBe('Offline\nEdited');
  });

  it.each([
    ['script tag', '<script>alert(1)</script>'],
    ['event attribute', '<td onclick="alert(1)">'],
    ['unsafe image URL', '<td style="background-image:url(\"javascript:alert(1)\")">'],
    ['unsupported nested tag', '<img src="https://example.com/x.png">'],
  ])('rejects %s instead of accepting executable HTML', (_caseName, maliciousMarkup) => {
    const safeCell = legacyCell('safe');
    const contents = `<table id="tableCont"><tr>${maliciousMarkup.includes('<td') ? maliciousMarkup + safeCell.slice(safeCell.indexOf('</td>') + 5) : maliciousMarkup}<div class="elTop"><div class="elHlf">safe</div><div class="elHlfSc"></div></div><div class="elMain">S</div><div class="elName">Name</div><div class="elBot"><div class="elHlf"></div><div class="elHlfSc"></div></div></td></tr></table>`;

    expect(() => parsePeriodicTableHtml(contents)).toThrow();
  });

  it('rejects duplicate ids and non-rectangular cell spans', () => {
    const serialized = serializePeriodicTableHtml(createDocument());
    const duplicateIds = serialized.replace('data-cell-id="cell-2"', 'data-cell-id="cell-1"');
    expect(() => parsePeriodicTableHtml(duplicateIds)).toThrow('duplicated');

    const rowSpan = serialized.replace('<td data-cell-id="cell-1"', '<td rowspan="2" data-cell-id="cell-1"');
    expect(() => parsePeriodicTableHtml(rowSpan)).toThrow('rowspan');
  });

  it('rejects HTML over the 5 MiB boundary before DOM parsing', () => {
    const oversized = `<table>${'x'.repeat(5 * 1024 * 1024)}</table>`;

    expect(() => parsePeriodicTableHtml(oversized)).toThrow('5242880');
  });
});
