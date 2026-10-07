import { parsePeriodicTableHtml } from './html';
import { validateTableDocument } from './table';
import type { PeriodicTableDocument } from './types';

export type PeriodicTableCaseAsset = {
  id: string;
  imageSrc: string;
  templateSrc: string;
};

export const PERIODIC_TABLE_CASE_ASSETS: readonly PeriodicTableCaseAsset[] = [
  {
    id: 'elemental-schools',
    imageSrc: '/periodic-table-creator/cases/elemental-schools.webp',
    templateSrc: '/periodic-table-creator/cases/elemental-schools.txt',
  },
  {
    id: 'arcane-crystals',
    imageSrc: '/periodic-table-creator/cases/arcane-crystals.webp',
    templateSrc: '/periodic-table-creator/cases/arcane-crystals.txt',
  },
  {
    id: 'forbidden-elements',
    imageSrc: '/periodic-table-creator/cases/forbidden-elements.webp',
    templateSrc: '/periodic-table-creator/cases/forbidden-elements.txt',
  },
  {
    id: 'forge-metals',
    imageSrc: '/periodic-table-creator/cases/forge-metals.webp',
    templateSrc: '/periodic-table-creator/cases/forge-metals.txt',
  },
  {
    id: 'enchantment-gems',
    imageSrc: '/periodic-table-creator/cases/enchantment-gems.webp',
    templateSrc: '/periodic-table-creator/cases/enchantment-gems.txt',
  },
  {
    id: 'organic-materials',
    imageSrc: '/periodic-table-creator/cases/organic-materials.webp',
    templateSrc: '/periodic-table-creator/cases/organic-materials.txt',
  },
  {
    id: 'forest-herbarium',
    imageSrc: '/periodic-table-creator/cases/forest-herbarium.webp',
    templateSrc: '/periodic-table-creator/cases/forest-herbarium.txt',
  },
  {
    id: 'creature-components',
    imageSrc: '/periodic-table-creator/cases/creature-components.webp',
    templateSrc: '/periodic-table-creator/cases/creature-components.txt',
  },
  {
    id: 'alchemical-reagents',
    imageSrc: '/periodic-table-creator/cases/alchemical-reagents.webp',
    templateSrc: '/periodic-table-creator/cases/alchemical-reagents.txt',
  },
  {
    id: 'stellar-minerals',
    imageSrc: '/periodic-table-creator/cases/stellar-minerals.webp',
    templateSrc: '/periodic-table-creator/cases/stellar-minerals.txt',
  },
  {
    id: 'energy-media',
    imageSrc: '/periodic-table-creator/cases/energy-media.webp',
    templateSrc: '/periodic-table-creator/cases/energy-media.txt',
  },
  {
    id: 'engineering-alloys',
    imageSrc: '/periodic-table-creator/cases/engineering-alloys.webp',
    templateSrc: '/periodic-table-creator/cases/engineering-alloys.txt',
  },
];

function describeReceivedCaseId(caseId: unknown): string {
  if (typeof caseId === 'string') return JSON.stringify(caseId);
  if (caseId === undefined) return 'undefined';
  if (caseId === null) return 'null';
  return Object.prototype.toString.call(caseId);
}

function requireCaseId(caseId: string): string {
  if (typeof caseId !== 'string' || caseId.length === 0) {
    throw new TypeError(
      `Periodic table case id must be a non-empty string. Received ${describeReceivedCaseId(caseId)}.`,
    );
  }

  return caseId;
}

export function getPeriodicTableCaseAsset(caseId: string): PeriodicTableCaseAsset {
  const validCaseId = requireCaseId(caseId);
  const matchedAsset = PERIODIC_TABLE_CASE_ASSETS.find((asset) => asset.id === validCaseId);

  if (matchedAsset === undefined) {
    throw new Error(`Unknown periodic table case id ${JSON.stringify(validCaseId)}.`);
  }

  return matchedAsset;
}

async function fetchPeriodicTableCaseTemplate(caseId: string, templateUrl: string): Promise<string> {
  const response = await fetch(templateUrl);
  if (!response.ok) {
    const statusText = response.statusText || '(empty status text)';
    throw new Error(
      `Failed to load periodic table case ${JSON.stringify(caseId)} template ${JSON.stringify(templateUrl)}: HTTP ${response.status} ${statusText}.`,
    );
  }

  return response.text();
}

export async function loadPeriodicTableCaseDocument(caseId: string): Promise<PeriodicTableDocument> {
  const asset = getPeriodicTableCaseAsset(caseId);
  const templateContents = await fetchPeriodicTableCaseTemplate(asset.id, asset.templateSrc);
  const parsedDocument = parsePeriodicTableHtml(templateContents);
  return validateTableDocument(parsedDocument);
}
