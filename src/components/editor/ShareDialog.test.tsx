// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useShareDialogStore } from '@/lib/store/share-dialog-store';
import { SHARE_SOCIAL_IMAGE_WIDTH } from '@/lib/share/constants';
import { ShareDialog } from './ShareDialog';

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

const mocks = vi.hoisted(() => ({
  uploadTokenForShare: vi.fn(() => new Promise(() => undefined)),
  saveAs: vi.fn(),
  clipboardWriteText: vi.fn(),
  windowOpen: vi.fn(),
}));

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
        shareUploadDisclosure:
          'Copying a link or sharing to social media uploads a generated PNG to R2 and creates a public share link. Download stays local.',
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
  uploadTokenForShare: mocks.uploadTokenForShare,
}));

vi.mock('file-saver', () => ({
  saveAs: mocks.saveAs,
}));

function openDialog() {
  const blob = new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });
  const previewBlob = new Blob([new Uint8Array([137, 80, 78, 71, 2])], {
    type: 'image/png',
  });
  const shareBlob = new Blob([new Uint8Array([137, 80, 78, 71, 1])], {
    type: 'image/png',
  });

  useShareDialogStore.getState().openShareDialog({
    blob,
    previewBlob,
    shareBlob,
    shareImageWidth: SHARE_SOCIAL_IMAGE_WIDTH,
    fileName: 'token.png',
    exportSize: 1024,
    locale: 'en',
  });

  return { blob, previewBlob, shareBlob };
}

describe('ShareDialog', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:token-preview'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mocks.clipboardWriteText },
    });
    vi.stubGlobal('open', mocks.windowOpen);
    mocks.uploadTokenForShare.mockClear();
    mocks.saveAs.mockClear();
    mocks.clipboardWriteText.mockClear();
    mocks.windowOpen.mockClear();
    useShareDialogStore.setState({ isOpen: false, payload: null });
  });

  afterEach(() => {
    cleanup();
    useShareDialogStore.setState({ isOpen: false, payload: null });
    vi.unstubAllGlobals();
    if (originalCreateObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: originalCreateObjectURL,
      });
    } else {
      delete (URL as Partial<typeof URL>).createObjectURL;
    }
    if (originalRevokeObjectURL) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        configurable: true,
        value: originalRevokeObjectURL,
      });
    } else {
      delete (URL as Partial<typeof URL>).revokeObjectURL;
    }
  });

  it('uses the final dark drawer design and does not upload until the user chooses a share action', async () => {
    const { blob, previewBlob } = openDialog();
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

    expect(
      screen.getByText(
        'Copying a link or sharing to social media uploads a generated PNG to R2 and creates a public share link. Download stays local.'
      )
    ).toBeDefined();
    expect(copyButton.disabled).toBe(false);
    expect(xButton.disabled).toBe(false);
    expect(pinterestButton.disabled).toBe(false);
    expect(redditButton.disabled).toBe(false);
    expect(downloadButton.disabled).toBe(false);
    expect(downloadButton.getAttribute('data-highlighted')).toBe('true');
    expect(URL.createObjectURL).toHaveBeenCalledWith(previewBlob);
    expect(mocks.uploadTokenForShare).not.toHaveBeenCalled();

    fireEvent.click(downloadButton);

    expect(mocks.saveAs).toHaveBeenCalledWith(blob, 'token.png');
    expect(mocks.uploadTokenForShare).not.toHaveBeenCalled();
  });

  it('uploads to R2 when the user copies the share link', async () => {
    const { shareBlob } = openDialog();
    mocks.uploadTokenForShare.mockResolvedValue({
      id: 'abc123def4',
      shareUrl: 'https://www.tokenmaker.one/share/abc123def4',
      imageUrl: 'https://r2.tokenmaker.one/shares/abc123def4.png',
    });

    render(<ShareDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));

    await waitFor(() =>
      expect(mocks.uploadTokenForShare).toHaveBeenCalledWith({
        blob: shareBlob,
        width: SHARE_SOCIAL_IMAGE_WIDTH,
        locale: 'en',
      })
    );
    await waitFor(() =>
      expect(mocks.clipboardWriteText).toHaveBeenCalledWith(
        'https://www.tokenmaker.one/share/abc123def4'
      )
    );
  });

  it('uploads to R2 when the user shares to a social platform', async () => {
    const { shareBlob } = openDialog();
    mocks.uploadTokenForShare.mockResolvedValue({
      id: 'abc123def4',
      shareUrl: 'https://www.tokenmaker.one/share/abc123def4',
      imageUrl: 'https://r2.tokenmaker.one/shares/abc123def4.png',
    });

    render(<ShareDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'Pinterest' }));

    await waitFor(() =>
      expect(mocks.uploadTokenForShare).toHaveBeenCalledWith({
        blob: shareBlob,
        width: SHARE_SOCIAL_IMAGE_WIDTH,
        locale: 'en',
      })
    );
    await waitFor(() =>
      expect(mocks.windowOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://www.pinterest.com/pin/create/button/'),
        '_blank',
        'noopener,noreferrer'
      )
    );
  });
});
