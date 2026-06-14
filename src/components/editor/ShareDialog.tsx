'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { saveAs } from 'file-saver';
import {
  Check,
  Download,
  Link,
  Loader2,
  RotateCw,
  X as CloseIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useI18n, type I18nKey } from '@/lib/i18n';
import {
  trackShareCopyLink,
  trackShareRedownload,
  trackShareSocial,
  trackShareSuppress24h,
  trackShareUploadFail,
  trackShareUploadStart,
  trackShareUploadSuccess,
} from '@/lib/analytics';
import { useShareDialogStore, type ShareDialogPayload } from '@/lib/store/share-dialog-store';
import { ShareUploadRequestError, uploadTokenForShare, type ShareUploadResponse } from '@/lib/share/client-upload';
import { buildSharePlatformUrl } from '@/lib/share/platforms';
import { suppressShareDialogFor24Hours } from '@/lib/share/local-frequency';
import type { SharePlatform } from '@/lib/share/constants';

type ShareStatus = 'idle' | 'uploading' | 'ready' | 'failed';

interface ShareRequestState {
  payload: ShareDialogPayload;
  status: ShareStatus;
  shareData: ShareUploadResponse | null;
  copied: boolean;
  errorCode: string | null;
}

const platformLabels: Array<{ platform: SharePlatform; key: I18nKey }> = [
  { platform: 'x', key: 'shareOnX' },
  { platform: 'pinterest', key: 'shareOnPinterest' },
  { platform: 'reddit', key: 'shareOnReddit' },
];

function getShareErrorCode(error: unknown) {
  if (error instanceof ShareUploadRequestError) {
    return error.code;
  }

  return 'unknown_error';
}

function ShareCircleButton({
  label,
  disabled,
  highlighted,
  loading,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  highlighted?: boolean;
  loading?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-highlighted={highlighted ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
      aria-label={label}
      title={label}
      className="group flex min-w-0 flex-1 flex-col items-center gap-2 text-[11px] leading-tight text-stone-400 transition disabled:pointer-events-none sm:text-sm"
    >
      <span
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full border bg-[#161a1c]/95 text-stone-200 shadow-[0_18px_44px_-30px_rgba(0,0,0,1)] transition sm:h-[72px] sm:w-[72px]',
          highlighted
            ? 'border-[#f0c86a] text-[#f4cf7a] shadow-[0_0_0_1px_rgba(240,200,106,0.18),0_22px_52px_-30px_rgba(240,200,106,0.95)]'
            : 'border-white/15 group-hover:border-[#d7b46a]/70 group-hover:text-[#f3d487]',
          disabled && !highlighted ? 'text-stone-500' : ''
        )}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="absolute -inset-0.5 rounded-full border-2 border-transparent border-r-[#f0c86a]/70 border-t-[#f0c86a] animate-spin"
          />
        ) : null}
        <span className="relative z-10 flex items-center justify-center">{children}</span>
      </span>
      <span className="max-w-full truncate">{label}</span>
    </button>
  );
}

function XIcon() {
  return <span className="text-3xl font-light leading-none sm:text-[34px]">X</span>;
}

function PinterestIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="h-8 w-8 sm:h-9 sm:w-9"
      fill="currentColor"
    >
      <path d="M16.1 3.2C8.9 3.2 4 8 4 14.3c0 4.6 2.6 7.3 5.5 7.3 1.1 0 1.7-.6 1.9-1.5l.5-2.1c.2-.7.1-1-.4-1.6-.7-.9-1.1-2-1.1-3.5 0-3.8 2.8-7.4 7.3-7.4 4 0 6.4 2.5 6.4 6.1 0 4.5-2.2 7.7-5.1 7.7-1.6 0-2.7-1.3-2.3-2.9.4-1.9 1.3-3.9 1.3-5.3 0-1.2-.7-2.3-2-2.3-1.6 0-2.9 1.7-2.9 4 0 1.5.5 2.5.5 2.5l-2 8.3c-.6 2.4-.3 5.2-.1 6.9.1.5.7.6 1 .2.8-1.1 2.2-3.1 2.8-5.5l.8-3.1c.8 1.5 2.4 2.7 4.4 2.7 5.8 0 9.8-5.3 9.8-12.1C29.9 7.3 24.8 3.2 16.1 3.2Z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="h-8 w-8 sm:h-9 sm:w-9"
      fill="currentColor"
    >
      <path d="M29 14.4c0-1.8-1.4-3.2-3.2-3.2-.9 0-1.7.4-2.3 1-1.8-1.2-4.1-1.9-6.7-2.1l1.1-5 3.5.8c.1 1.2 1.1 2.1 2.4 2.1 1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4c-.9 0-1.7.5-2.1 1.2L17.4 3.5c-.4-.1-.8.2-.9.6l-1.3 6c-2.7.1-5.1.9-6.9 2.1-.6-.6-1.4-1-2.3-1-1.8 0-3.2 1.4-3.2 3.2 0 1.3.8 2.4 1.9 2.9-.1.4-.2.9-.2 1.3 0 4.8 5.1 8.7 11.4 8.7s11.4-3.9 11.4-8.7c0-.4-.1-.9-.2-1.3 1.1-.5 1.9-1.6 1.9-2.9ZM10.4 17.2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2Zm10.2 6.3c-1.3.9-2.8 1.3-4.6 1.3s-3.4-.4-4.6-1.3c-.3-.2-.4-.7-.2-1 .2-.3.7-.4 1-.2 1 .7 2.3 1.1 3.8 1.1s2.8-.4 3.8-1.1c.3-.2.8-.1 1 .2.2.4.1.8-.2 1Zm-.9-4.3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
    </svg>
  );
}

function getPlatformIcon(platform: SharePlatform) {
  if (platform === 'x') return <XIcon />;
  if (platform === 'pinterest') return <PinterestIcon />;
  return <RedditIcon />;
}

export function ShareDialog() {
  const { t } = useI18n();
  const isOpen = useShareDialogStore((state) => state.isOpen);
  const payload = useShareDialogStore((state) => state.payload);
  const closeShareDialog = useShareDialogStore((state) => state.closeShareDialog);
  const currentPayload = payload;
  const [shareRequestState, setShareRequestState] = useState<ShareRequestState | null>(null);
  const uploadPromiseRef = useRef<{
    payload: ShareDialogPayload;
    promise: Promise<ShareUploadResponse | null>;
  } | null>(null);
  const activeShareRequestState =
    shareRequestState?.payload === currentPayload ? shareRequestState : null;
  const status = activeShareRequestState?.status ?? 'idle';
  const shareData = activeShareRequestState?.shareData ?? null;
  const copied = activeShareRequestState?.copied ?? false;
  const errorCode = activeShareRequestState?.errorCode ?? null;
  const isShareBusy = status === 'uploading';

  const previewUrl = useMemo(() => {
    if (!isOpen || !currentPayload) return null;
    return URL.createObjectURL(currentPayload.previewBlob);
  }, [currentPayload, isOpen]);

  const statusLabel = useMemo(() => {
    if (status === 'ready') return t('shareReady');
    if (status === 'failed') return t('shareFailed');
    if (status === 'uploading') return t('sharePreparing');
    return '';
  }, [status, t]);

  useEffect(() => {
    if (!previewUrl) return;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!copied) return;
    const copiedPayload = currentPayload;
    const timeout = window.setTimeout(() => {
      setShareRequestState((previousState) =>
        previousState?.payload === copiedPayload
          ? { ...previousState, copied: false }
          : previousState
      );
    }, 1500);
    return () => window.clearTimeout(timeout);
  }, [copied, currentPayload]);

  const requestShareData = useCallback(async () => {
    if (!currentPayload) return null;
    if (shareData) return shareData;
    if (uploadPromiseRef.current?.payload === currentPayload) {
      return uploadPromiseRef.current.promise;
    }

    setShareRequestState({
      payload: currentPayload,
      status: 'uploading',
      shareData: null,
      copied: false,
      errorCode: null,
    });
    trackShareUploadStart(currentPayload.shareBlob.size, currentPayload.exportSize);

    const uploadPromise = uploadTokenForShare({
      blob: currentPayload.shareBlob,
      width: currentPayload.shareImageWidth,
      locale: currentPayload.locale,
    })
      .then((result) => {
        setShareRequestState({
          payload: currentPayload,
          status: 'ready',
          shareData: result,
          copied: false,
          errorCode: null,
        });
        trackShareUploadSuccess(currentPayload.shareBlob.size, currentPayload.exportSize);
        return result;
      })
      .catch((error) => {
        const code = getShareErrorCode(error);
        setShareRequestState({
          payload: currentPayload,
          status: 'failed',
          shareData: null,
          copied: false,
          errorCode: code,
        });
        trackShareUploadFail(code, currentPayload.shareBlob.size, currentPayload.exportSize);
        return null;
      })
      .finally(() => {
        if (uploadPromiseRef.current?.payload === currentPayload) {
          uploadPromiseRef.current = null;
        }
      });

    uploadPromiseRef.current = {
      payload: currentPayload,
      promise: uploadPromise,
    };
    return uploadPromise;
  }, [currentPayload, shareData]);

  const handleRetry = () => {
    void requestShareData();
  };

  const handleCopy = async () => {
    if (!currentPayload) return;
    const currentShareData = await requestShareData();
    if (!currentShareData) return;

    try {
      await navigator.clipboard.writeText(currentShareData.shareUrl);
      setShareRequestState((previousState) =>
        previousState?.payload === currentPayload
          ? { ...previousState, copied: true }
          : previousState
      );
      trackShareCopyLink(currentShareData.id);
    } catch {
      setShareRequestState((previousState) =>
        previousState?.payload === currentPayload
          ? { ...previousState, copied: false }
          : previousState
      );
    }
  };

  const handlePlatformShare = async (platform: SharePlatform) => {
    const currentShareData = await requestShareData();
    if (!currentShareData) return;

    const url = buildSharePlatformUrl(platform, {
      shareUrl: currentShareData.shareUrl,
      imageUrl: currentShareData.imageUrl,
      text: t('shareText'),
      title: t('sharePostTitle'),
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    trackShareSocial(platform, currentShareData.id);
  };

  const handleDownload = () => {
    if (!currentPayload) return;
    saveAs(currentPayload.blob, currentPayload.fileName);
    trackShareRedownload(currentPayload.exportSize);
  };

  const handleSuppressChange = (checked: boolean) => {
    if (!checked) return;
    suppressShareDialogFor24Hours();
    trackShareSuppress24h();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? closeShareDialog() : undefined)}>
      <DialogContent
        data-testid="share-dialog-panel"
        data-visual-design="token-maker-download-share"
        className="max-h-[92svh] max-w-full rounded-t-[28px] border-[#8b713d]/55 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_38%),linear-gradient(135deg,rgba(31,34,35,0.98)_0%,rgba(18,21,22,0.98)_58%,rgba(12,14,15,0.98)_100%)] text-stone-100 shadow-[0_30px_120px_-45px_rgba(0,0,0,1)] sm:max-h-[calc(100svh-3rem)] sm:max-w-[720px] sm:rounded-[22px]"
      >
        <div
          data-testid="share-dialog-drawer-handle"
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-white/20 sm:hidden"
        />

        <div className="relative px-7 pt-7 sm:px-12 sm:pt-8">
          <DialogTitle className="font-serif text-[1.75rem] font-semibold leading-tight text-stone-100 sm:text-[2.55rem]">
            {t('shareTitle')}
          </DialogTitle>
          <DialogDescription className="sr-only">{statusLabel || t('shareTitle')}</DialogDescription>
          <DialogClose className="right-6 top-6 border-none bg-transparent text-stone-300 hover:bg-transparent hover:text-white sm:right-9 sm:top-9">
            <CloseIcon className="h-8 w-8 stroke-[1.6]" />
          </DialogClose>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-6 sm:px-12 sm:pb-7 sm:pt-6">
          <div className="mx-auto flex w-[min(68vw,300px)] max-w-[300px] items-center justify-center rounded-[20px] border border-white/14 bg-[#0c1011] p-2 shadow-inner sm:w-full sm:max-w-[320px]">
            <div className="w-full rounded-[16px] bg-[linear-gradient(45deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.07)_75%),linear-gradient(45deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.07)_75%)] bg-[length:32px_32px] bg-[position:0_0,16px_16px]">
            {previewUrl ? (
              // Object URLs are local previews and cannot be optimized by next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={t('shareImageAlt')}
                  className="aspect-square w-full rounded-[16px] object-contain"
              />
            ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-[16px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#f0c86a]" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex min-h-7 items-center justify-center gap-3 text-sm font-medium text-stone-300 sm:mt-5">
            {status === 'uploading' ? <Loader2 className="h-5 w-5 animate-spin text-[#f0c86a]" /> : null}
            {status === 'ready' ? <Check className="h-5 w-5 text-[#f0c86a]" /> : null}
            {status === 'failed' ? (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/45 px-4 py-2 text-sm text-[#f0c86a] transition hover:border-[#f0c86a] hover:bg-[#f0c86a]/10"
              >
                <RotateCw className="h-4 w-4" />
                {t('shareRetry')}
              </button>
            ) : statusLabel ? (
              <span>{statusLabel}</span>
            ) : null}
            {status === 'failed' && errorCode ? (
              <span className="text-xs text-stone-500">({errorCode})</span>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2 sm:mt-6 sm:gap-4">
            <ShareCircleButton
              label={copied ? t('shareCopied') : t('shareCopyLink')}
              disabled={!currentPayload || isShareBusy}
              loading={isShareBusy}
              onClick={handleCopy}
            >
              {copied ? <Check className="h-7 w-7" /> : <Link className="h-7 w-7" />}
            </ShareCircleButton>

            {platformLabels.map(({ platform, key }) => (
              <ShareCircleButton
                key={platform}
                label={t(key)}
                disabled={!currentPayload || isShareBusy}
                loading={isShareBusy}
                onClick={() => handlePlatformShare(platform)}
              >
                {getPlatformIcon(platform)}
              </ShareCircleButton>
            ))}

            <ShareCircleButton label={t('shareDownload')} highlighted onClick={handleDownload}>
              <Download className="h-8 w-8 stroke-[1.8]" />
            </ShareCircleButton>
          </div>

          <div className="mt-5 h-px w-full bg-white/10 sm:mt-6" />

          <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 text-sm text-stone-400 sm:text-base">
            <input
              type="checkbox"
              className="h-5 w-5 rounded-md border border-white/20 bg-transparent accent-[#d7b46a]"
              onChange={(event) => handleSuppressChange(event.target.checked)}
            />
            <span>{t('shareSuppressFor24Hours')}</span>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
