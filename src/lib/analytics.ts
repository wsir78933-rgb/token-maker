'use client';

type GtagEventParams = Record<string, string | number | boolean | null | undefined>;

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_ANALYTICS_ENABLED = IS_PRODUCTION && Boolean(GA_MEASUREMENT_ID);

declare global {
  interface Window {
    __tokenMakerGtagConfigured?: boolean;
  }
}

function ensureGtag() {
  if (typeof window === 'undefined' || !IS_ANALYTICS_ENABLED || !GA_MEASUREMENT_ID) {
    return false;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    };
  }

  if (!window.__tokenMakerGtagConfigured) {
    window.__tokenMakerGtagConfigured = true;
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }

  return true;
}

function trackGtagEvent(eventName: string, params: GtagEventParams) {
  if (!ensureGtag() || typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', eventName, params);
  return true;
}

function getPageParams(): GtagEventParams {
  if (typeof window === 'undefined') return {};

  return {
    page_location: window.location.href,
    page_title: document.title,
  };
}

function trackSessionEventOnce(eventName: string, params: GtagEventParams) {
  if (typeof window === 'undefined') return;

  const storageKey = `token-maker:analytics:${eventName}`;

  try {
    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }
  } catch {
    // Ignore storage failures; analytics should never block the UI.
  }

  const didTrack = trackGtagEvent(eventName, params);
  if (!didTrack) return;

  try {
    window.sessionStorage.setItem(storageKey, '1');
  } catch {
    // Ignore storage failures.
  }
}

export function trackStartEditor(source: string) {
  trackSessionEventOnce('start_editor', {
    source,
    ...getPageParams(),
  });
}

export function trackUploadImage(fileCount = 1, uploadMode = 'single') {
  trackGtagEvent('upload_image', {
    file_count: fileCount,
    upload_mode: uploadMode,
    ...getPageParams(),
  });
}

export function trackApplyBorder(frameName: string) {
  trackGtagEvent('apply_border', {
    frame_name: frameName,
    ...getPageParams(),
  });
}

export function trackDownloadPng(frameName: string, fileCount = 1, outputFormat = 'png') {
  trackGtagEvent('download_png', {
    frame_name: frameName,
    file_count: fileCount,
    output_format: outputFormat,
    ...getPageParams(),
  });
}

export function trackShareDialogOpen(exportSize: number) {
  trackGtagEvent('share_dialog_open', {
    export_size: exportSize,
    ...getPageParams(),
  });
}

export function trackShareDialogSuppressed(exportSize: number) {
  trackGtagEvent('share_dialog_suppressed_24h', {
    export_size: exportSize,
    ...getPageParams(),
  });
}

export function trackShareUploadStart(sizeBytes: number, exportSize: number) {
  trackGtagEvent('share_upload_start', {
    size_bytes: sizeBytes,
    export_size: exportSize,
    ...getPageParams(),
  });
}

export function trackShareUploadSuccess(sizeBytes: number, exportSize: number) {
  trackGtagEvent('share_upload_success', {
    size_bytes: sizeBytes,
    export_size: exportSize,
    ...getPageParams(),
  });
}

export function trackShareUploadFail(error: string, sizeBytes: number, exportSize: number) {
  trackGtagEvent('share_upload_fail', {
    error,
    size_bytes: sizeBytes,
    export_size: exportSize,
    ...getPageParams(),
  });
}

export function trackShareCopyLink() {
  trackGtagEvent('share_copy_link', {});
}

export function trackShareSocial(platform: string) {
  trackGtagEvent('share_social', {
    platform,
  });
}

export function trackShareRedownload(exportSize: number) {
  trackGtagEvent('share_redownload', {
    export_size: exportSize,
    ...getPageParams(),
  });
}

export function trackShareSuppress24h() {
  trackGtagEvent('share_suppress_24h', {
    ...getPageParams(),
  });
}

export function trackSharePageCtaClick() {
  trackGtagEvent('share_page_cta_click', {});
}

export function trackUseBatchMode(source: string, fileCount?: number) {
  trackGtagEvent('use_batch_mode', {
    source,
    file_count: fileCount,
    ...getPageParams(),
  });
}

export function trackBlogToEditorClick(targetHref: string) {
  trackGtagEvent('blog_to_editor_click', {
    target_href: targetHref,
    ...getPageParams(),
  });
}

export function trackDiceRoll(diceExpression: string, diceCount: number, total: number) {
  trackGtagEvent('dice_roll', {
    dice_expression: diceExpression,
    dice_count: diceCount,
    roll_total: total,
    ...getPageParams(),
  });
}
