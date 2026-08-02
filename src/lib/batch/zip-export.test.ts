// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { BatchItem } from './types';

const zipExportMockState = vi.hoisted(() => ({
  savedFiles: [] as Array<{ blob: Blob; fileName: string }>,
  zipFileNames: [] as string[],
}));

vi.mock('file-saver', () => ({
  saveAs: (blob: Blob, fileName: string) => {
    zipExportMockState.savedFiles.push({ blob, fileName });
  },
}));

vi.mock('@/lib/analytics', () => ({
  trackDownloadPng: vi.fn(),
}));

vi.mock('jszip', () => ({
  default: class MockJSZip {
    file(fileName: string) {
      zipExportMockState.zipFileNames.push(fileName);
    }

    async generateAsync() {
      return new Blob(['zip']);
    }
  },
}));

import { downloadBatchZip } from './zip-export';

function createDoneBatchItem(fileName: string): BatchItem {
  return {
    id: fileName,
    file: new File(['source'], fileName, { type: 'image/png' }),
    fileName,
    previewUrl: `blob:${fileName}`,
    imageElement: new Image(),
    renderedUrl: `blob:rendered-${fileName}`,
    blob: new Blob(['rendered'], { type: 'image/png' }),
    draft: null,
    status: 'done',
  };
}

describe('downloadBatchZip', () => {
  afterEach(() => {
    zipExportMockState.savedFiles = [];
    zipExportMockState.zipFileNames = [];
    vi.restoreAllMocks();
  });

  it('uses localized Chinese names for token files and the ZIP file', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);

    await downloadBatchZip(
      [createDoneBatchItem('hero.png'), createDoneBatchItem('hero.jpg')],
      {
        tokenFileSuffix: '令牌',
        zipFileBaseName: '批量令牌',
      }
    );

    expect(zipExportMockState.zipFileNames).toEqual(['hero_令牌.png', 'hero_令牌_1.png']);
    expect(zipExportMockState.savedFiles.at(-1)?.fileName).toBe('批量令牌_1700000000000.zip');
  });
});
