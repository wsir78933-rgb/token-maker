import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { trackDownloadPng } from '@/lib/analytics';
import type { BatchItem } from './types';

function getUniqueTokenFileName(fileName: string, usedNames: Set<string>) {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  let finalName = `${baseName}_token.png`;
  let counter = 1;

  while (usedNames.has(finalName)) {
    finalName = `${baseName}_token_${counter++}.png`;
  }

  usedNames.add(finalName);
  return finalName;
}

export async function downloadBatchZip(items: BatchItem[]) {
  const doneItems = items.filter((item) => item.status === 'done' && item.blob);
  if (doneItems.length === 0) return;

  const zip = new JSZip();
  const usedNames = new Set<string>();

  doneItems.forEach((item) => {
    zip.file(getUniqueTokenFileName(item.fileName, usedNames), item.blob!);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `tokens_batch_${Date.now()}.zip`);
  trackDownloadPng('batch', doneItems.length, 'zip');
}
