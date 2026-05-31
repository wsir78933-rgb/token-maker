// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditorStore } from '@/lib/store/editor-store';
import { useShareDialogStore } from '@/lib/store/share-dialog-store';
import { downloadCurrentTokenWithSharePrompt } from './export-token';

const mocks = vi.hoisted(() => ({
  exportTokenAsPNG: vi.fn(),
  saveAs: vi.fn(),
  shouldShowShareDialog: vi.fn(),
  trackDownloadPng: vi.fn(),
  trackShareDialogOpen: vi.fn(),
  trackShareDialogSuppressed: vi.fn(),
}));

vi.mock('@/lib/renderer/pipeline', () => ({
  exportTokenAsPNG: mocks.exportTokenAsPNG,
}));

vi.mock('file-saver', () => ({
  saveAs: mocks.saveAs,
}));

vi.mock('@/lib/share/local-frequency', () => ({
  shouldShowShareDialog: mocks.shouldShowShareDialog,
}));

vi.mock('@/lib/analytics', () => ({
  trackDownloadPng: mocks.trackDownloadPng,
  trackShareDialogOpen: mocks.trackShareDialogOpen,
  trackShareDialogSuppressed: mocks.trackShareDialogSuppressed,
}));

const t = (key: string) => key;
const fileName = 'token_1780185600000.png';

describe('downloadCurrentTokenWithSharePrompt', () => {
  const blob = new Blob(['png'], { type: 'image/png' });

  beforeEach(() => {
    vi.setSystemTime(new Date('2026-05-31T00:00:00.000Z'));
    mocks.exportTokenAsPNG.mockResolvedValue(blob);
    mocks.shouldShowShareDialog.mockReturnValue(true);
    useEditorStore.getState().resetAll();
    useShareDialogStore.setState({ isOpen: false, payload: null });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    useEditorStore.getState().resetAll();
    useShareDialogStore.setState({ isOpen: false, payload: null });
  });

  it('opens the share dialog without downloading when the dialog should be shown', async () => {
    await downloadCurrentTokenWithSharePrompt(t, 'en');

    expect(mocks.saveAs).not.toHaveBeenCalled();
    expect(mocks.trackDownloadPng).not.toHaveBeenCalled();
    expect(mocks.trackShareDialogOpen).toHaveBeenCalledWith(256);

    const state = useShareDialogStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.payload).toMatchObject({
      blob,
      exportSize: 256,
      fileName,
      locale: 'en',
    });
  });

  it('downloads directly when the share dialog is suppressed', async () => {
    mocks.shouldShowShareDialog.mockReturnValue(false);

    await downloadCurrentTokenWithSharePrompt(t, 'en');

    expect(mocks.saveAs).toHaveBeenCalledWith(blob, fileName);
    expect(mocks.trackDownloadPng).toHaveBeenCalledTimes(1);
    expect(mocks.trackShareDialogSuppressed).toHaveBeenCalledWith(256);
    expect(useShareDialogStore.getState().isOpen).toBe(false);
  });
});
