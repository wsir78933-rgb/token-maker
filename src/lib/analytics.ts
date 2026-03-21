'use client';

type GtagEventParams = Record<string, string | number | boolean | null | undefined>;

function trackGtagEvent(eventName: string, params: GtagEventParams) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, params);
}

export function trackUploadImage() {
  trackGtagEvent('upload_image', {
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackSelectFrame(frameName: string) {
  trackGtagEvent('select_frame', {
    frame_name: frameName,
    page_location: window.location.href,
  });
}

export function trackDownloadToken(frameName: string) {
  trackGtagEvent('download_token', {
    frame_name: frameName,
    output_format: 'png',
    page_location: window.location.href,
  });
}
