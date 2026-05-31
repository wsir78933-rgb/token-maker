// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

import { useShareDialogStore } from '@/lib/store/share-dialog-store';
import { ShareDialog } from './ShareDialog';

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({
    locale: 'en',
    t: (key: string) => {
      const labels: Record<string, string> = {
        shareTitle: 'Your Token is Ready',
        sharePreparing: 'Preparing share link...',
        shareReady: 'Share link ready',
        shareFailed: 'Could not create share link',
        shareRetry: 'Retry',
        shareCopyLink: 'Copy link',
        shareCopied: 'Copied',
        shareOnX: 'X',
        shareOnPinterest: 'Pinterest',
        shareOnReddit: 'Reddit',
        shareDownload: 'Download',
        shareSuppressFor24Hours: 'Do not show again for 24 hours',
        shareImageAlt: 'Generated VTT token preview',
      };

      return labels[key] ?? key;
    },
  }),
}));

vi.mock('@/lib/analytics', () => ({
  trackShareCopyLink: vi.fn(),
  trackShareRedownload: vi.fn(),
  trackShareSocial: vi.fn(),
  trackShareSuppress24h: vi.fn(),
  trackShareUploadFail: vi.fn(),
  trackShareUploadStart: vi.fn(),
  trackShareUploadSuccess: vi.fn(),
}));

vi.mock('@/lib/share/client-upload', () => ({
  ShareUploadRequestError: class ShareUploadRequestError extends Error {
    constructor(public readonly code: string) {
      super(code);
    }
  },
  uploadTokenForShare: vi.fn(() => new Promise(() => undefined)),
}));

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

function openDialog() {
  useShareDialogStore.getState().openShareDialog({
    blob: new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' }),
    fileName: 'token.png',
    exportSize: 1024,
    locale: 'en',
  });
}

describe('ShareDialog', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:token-preview'),
      revokeObjectURL: vi.fn(),
    });
    useShareDialogStore.setState({ isOpen: false, payload: null });
  });

  afterEach(() => {
    cleanup();
    useShareDialogStore.setState({ isOpen: false, payload: null });
    vi.unstubAllGlobals();
  });

  it('uses the final dark drawer design and keeps Download available while share link is preparing', async () => {
    openDialog();
    render(<ShareDialog />);

    expect(screen.getByTestId('share-dialog-panel').getAttribute('data-visual-design')).toBe(
      'token-maker-download-share'
    );
    expect(screen.getByTestId('share-dialog-drawer-handle')).toBeTruthy();

    const copyButton = screen.getByRole('button', { name: 'Copy link' }) as HTMLButtonElement;
    const xButton = screen.getByRole('button', { name: 'X' }) as HTMLButtonElement;
    const pinterestButton = screen.getByRole('button', { name: 'Pinterest' }) as HTMLButtonElement;
    const redditButton = screen.getByRole('button', { name: 'Reddit' }) as HTMLButtonElement;
    const downloadButton = screen.getByRole('button', { name: 'Download' }) as HTMLButtonElement;

    await waitFor(() => expect(copyButton.getAttribute('data-loading')).toBe('true'));

    expect(copyButton.disabled).toBe(true);
    expect(xButton.disabled).toBe(true);
    expect(pinterestButton.disabled).toBe(true);
    expect(redditButton.disabled).toBe(true);
    expect(downloadButton.disabled).toBe(false);
    expect(downloadButton.getAttribute('data-highlighted')).toBe('true');
  });
});
