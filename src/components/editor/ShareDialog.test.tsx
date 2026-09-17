// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, act } from '@testing-library/react';

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
  trackShareCopyLink: vi.fn(),
  trackShareRedownload: vi.fn(),
  trackShareSocial: vi.fn(),
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
        shareDownloading: 'Downloading...',
        shareDownloadStarted: 'Download started. Check Files or Downloads.',
        shareDownloadFailed: 'Download failed',
        shareUploadDisclosure: 'Copy a link or share on social media to create a public share page.',
        shareSuppressFor24Hours: 'Do not show again for 24 hours',
        shareImageAlt: 'Generated VTT token preview',
      };

      return labels[key] ?? key;
    },
  }),
}));

vi.mock('@/lib/analytics', () => ({
  trackShareCopyLink: mocks.trackShareCopyLink,
  trackShareRedownload: mocks.trackShareRedownload,
  trackShareSocial: mocks.trackShareSocial,
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
    mocks.trackShareCopyLink.mockClear();
    mocks.trackShareRedownload.mockClear();
    mocks.trackShareSocial.mockClear();
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
      screen.getByText('Copy a link or share on social media to create a public share page.')
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
    expect(mocks.trackShareRedownload).toHaveBeenCalledWith(1024);
    expect(screen.getByRole('status').textContent).toBe(
      'Download started. Check Files or Downloads.'
    );
  });

  it('enters downloading immediately, blocks a second click, and keeps download local', () => {
    const { blob } = openDialog();
    render(<ShareDialog />);

    const downloadButton = screen.getByRole('button', { name: 'Download' }) as HTMLButtonElement;
    mocks.saveAs.mockImplementation(() => {
      const downloadingButton = screen.getByRole('button', { name: 'Downloading...' }) as HTMLButtonElement;
      expect(downloadingButton.disabled).toBe(true);
      expect(downloadingButton.getAttribute('aria-busy')).toBe('true');
      fireEvent.click(downloadingButton);
    });

    fireEvent.click(downloadButton);

    expect(mocks.saveAs).toHaveBeenCalledTimes(1);
    expect(mocks.saveAs).toHaveBeenCalledWith(blob, 'token.png');
    expect(mocks.uploadTokenForShare).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe(
      'Download started. Check Files or Downloads.'
    );
  });

  it('shows the thrown saveAs error and allows a retry', () => {
    const { blob } = openDialog();
    mocks.saveAs.mockImplementationOnce(() => {
      throw new Error('saveAs rejected token.png');
    });

    render(<ShareDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(mocks.trackShareRedownload).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe(
      'Download failed: saveAs rejected token.png'
    );

    const retryButton = screen.getByRole('button', { name: 'Download' }) as HTMLButtonElement;
    expect(retryButton.disabled).toBe(false);

    fireEvent.click(retryButton);

    expect(mocks.saveAs).toHaveBeenCalledTimes(2);
    expect(mocks.saveAs).toHaveBeenLastCalledWith(blob, 'token.png');
    expect(screen.getByRole('status').textContent).toBe(
      'Download started. Check Files or Downloads.'
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('does not carry download status onto a new payload after close and reopen', async () => {
    openDialog();
    render(<ShareDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(screen.getByRole('status').textContent).toBe(
      'Download started. Check Files or Downloads.'
    );

    act(() => {
      useShareDialogStore.setState({ isOpen: false, payload: null });
    });
    act(() => {
      openDialog();
    });

    await waitFor(() => {
      expect(screen.queryByRole('status')).toBeNull();
    });
    expect(screen.queryByRole('alert')).toBeNull();
    expect((screen.getByRole('button', { name: 'Download' }) as HTMLButtonElement).disabled).toBe(
      false
    );
  });

  it('does not keep download status after the dialog unmounts and opens a new payload', () => {
    openDialog();
    const { unmount } = render(<ShareDialog />);

    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(screen.getByRole('status')).toBeTruthy();

    unmount();
    useShareDialogStore.setState({ isOpen: false, payload: null });
    openDialog();
    render(<ShareDialog />);

    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect((screen.getByRole('button', { name: 'Download' }) as HTMLButtonElement).disabled).toBe(
      false
    );
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
    expect(mocks.trackShareCopyLink).toHaveBeenCalledWith();
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
    expect(mocks.trackShareSocial).toHaveBeenCalledWith('pinterest');
  });
});
