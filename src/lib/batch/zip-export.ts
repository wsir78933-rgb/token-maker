import { saveAs } from 'file-saver';
import { trackDownloadPng } from '@/lib/analytics';
import type { BatchItem } from './types';

export interface BatchZipExportCopy {
  tokenFileSuffix: string;
  zipFileBaseName: string;
}

function getRequiredCopyValue(value: string, fieldName: keyof BatchZipExportCopy) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new Error(`Batch ZIP copy "${fieldName}" must not be empty. Received: "${value}"`);
  }

  return trimmedValue;
}

export function getUniqueTokenFileName(
  fileName: string,
  usedNames: Set<string>,
  tokenFileSuffix: string
) {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  let finalName = `${baseName}_${tokenFileSuffix}.png`;
  let counter = 1;

  while (usedNames.has(finalName)) {
    finalName = `${baseName}_${tokenFileSuffix}_${counter++}.png`;
  }

  usedNames.add(finalName);
  return finalName;
}

export function createBatchZipFileName(zipFileBaseName: string, timestamp: number) {
  return `${zipFileBaseName}_${timestamp}.zip`;
}

export async function downloadBatchZip(items: BatchItem[], copy: BatchZipExportCopy) {
  const tokenFileSuffix = getRequiredCopyValue(copy.tokenFileSuffix, 'tokenFileSuffix');
  const zipFileBaseName = getRequiredCopyValue(copy.zipFileBaseName, 'zipFileBaseName');
  const doneItems = items.filter((item) => item.status === 'done' && item.blob);
  if (doneItems.length === 0) return;

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const usedNames = new Set<string>();

  doneItems.forEach((item) => {
    zip.file(getUniqueTokenFileName(item.fileName, usedNames, tokenFileSuffix), item.blob!);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, createBatchZipFileName(zipFileBaseName, Date.now()));
  trackDownloadPng('batch', doneItems.length, 'zip');
}
