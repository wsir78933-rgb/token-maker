// @vitest-environment jsdom

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getPeriodicTableCaseAsset,
  loadPeriodicTableCaseDocument,
  PERIODIC_TABLE_CASE_ASSETS,
} from './case-studies';
import { parsePeriodicTableHtml, serializePeriodicTableHtml } from './html';
import { validateTableDocument } from './table';
import { PERIODIC_TABLE_FIELDS } from './types';

const expectedCaseIds = [
  'elemental-schools',
  'arcane-crystals',
  'forbidden-elements',
  'forge-metals',
  'enchantment-gems',
  'organic-materials',
  'forest-herbarium',
  'creature-components',
  'alchemical-reagents',
  'stellar-minerals',
  'energy-media',
  'engineering-alloys',
] as const;
const publicCaseRoot = path.resolve(process.cwd(), 'public/periodic-table-creator/cases');

function getPublicTemplatePath(caseId: string): string {
  return path.join(publicCaseRoot, `${caseId}.txt`);
}

function getPublicImagePath(caseId: string): string {
  return path.join(publicCaseRoot, `${caseId}.webp`);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('periodic table case studies', () => {
  it('publishes 12 unique public assets with stable URLs and dimensions', async () => {
    const publishedFileNames = await readdir(publicCaseRoot);
    const caseIds = PERIODIC_TABLE_CASE_ASSETS.map((asset) => asset.id);
    const expectedFileNames = expectedCaseIds.flatMap((caseId) => [`${caseId}.txt`, `${caseId}.webp`]);

    expect(PERIODIC_TABLE_CASE_ASSETS).toHaveLength(12);
    expect(caseIds).toEqual(expectedCaseIds);
    expect(new Set(caseIds).size).toBe(expectedCaseIds.length);
    expect([...publishedFileNames].sort()).toEqual([...expectedFileNames].sort());

    for (const asset of PERIODIC_TABLE_CASE_ASSETS) {
      const expectedImageSrc = `/periodic-table-creator/cases/${asset.id}.webp`;
      const expectedTemplateSrc = `/periodic-table-creator/cases/${asset.id}.txt`;
      const previewMetadata = await sharp(await readFile(getPublicImagePath(asset.id))).metadata();

      expect(asset.imageSrc).toBe(expectedImageSrc);
      expect(asset.templateSrc).toBe(expectedTemplateSrc);
      expect(previewMetadata.format).toBe('webp');
      expect(previewMetadata.width).toBe(1600);
      expect(previewMetadata.height).toBe(1000);
    }
  });

  it('parses complete 4x6 templates and preserves all 12 on serialization', async () => {
    for (const asset of PERIODIC_TABLE_CASE_ASSETS) {
      const templateContents = await readFile(getPublicTemplatePath(asset.id), 'utf8');
      const parsedDocument = validateTableDocument(parsePeriodicTableHtml(templateContents));
      const serializedTemplate = serializePeriodicTableHtml(parsedDocument);
      const roundTrippedDocument = validateTableDocument(parsePeriodicTableHtml(serializedTemplate));
      const symbols = parsedDocument.cells.map((cell) => cell.text.symbol);
      const names = parsedDocument.cells.map((cell) => cell.text.name);

      expect(parsedDocument.rows).toBe(4);
      expect(parsedDocument.columns).toBe(6);
      expect(parsedDocument.cells).toHaveLength(24);
      expect(new Set(symbols).size).toBe(24);
      expect(new Set(names).size).toBe(24);
      for (const cell of parsedDocument.cells) {
        for (const field of PERIODIC_TABLE_FIELDS) {
          expect(cell.text[field].length).toBeGreaterThan(0);
        }
      }
      expect(roundTrippedDocument).toEqual(parsedDocument);
    }
  });

  it('loads a selected template through its public URL and parser', async () => {
    const templateContents = await readFile(getPublicTemplatePath('elemental-schools'), 'utf8');
    const fetchMock = vi.fn(async () => new Response(templateContents, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadPeriodicTableCaseDocument('elemental-schools')).resolves.toMatchObject({
      version: 1,
      rows: 4,
      columns: 6,
      cells: expect.any(Array),
    });
    expect(fetchMock).toHaveBeenCalledWith('/periodic-table-creator/cases/elemental-schools.txt');
  });

  it('fails fast with the unknown case id value and HTTP details', async () => {
    expect(() => getPeriodicTableCaseAsset('missing-case')).toThrow('missing-case');

    const fetchMock = vi.fn(async () => new Response('unavailable', {
      status: 503,
      statusText: 'Service Unavailable',
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadPeriodicTableCaseDocument('elemental-schools')).rejects.toThrow(
      'elemental-schools',
    );
    await expect(loadPeriodicTableCaseDocument('elemental-schools')).rejects.toThrow(
      '/periodic-table-creator/cases/elemental-schools.txt',
    );
    await expect(loadPeriodicTableCaseDocument('elemental-schools')).rejects.toThrow(
      'HTTP 503 Service Unavailable',
    );
  });
});
