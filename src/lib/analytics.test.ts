// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

interface AnalyticsWindow extends Window {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
  __tokenMakerGtagConfigured?: boolean;
}

async function loadProductionAnalytics() {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');

  const analyticsWindow = window as AnalyticsWindow;
  const gtag = vi.fn();
  analyticsWindow.dataLayer = [];
  analyticsWindow.gtag = gtag;
  analyticsWindow.__tokenMakerGtagConfigured = false;

  return {
    gtag,
    ...(await import('./analytics')),
  };
}

function expectShareEventWithoutCapabilityOrPageLocation(
  gtag: ReturnType<typeof vi.fn>,
  eventName: string,
  expectedParams: Record<string, string> = {}
) {
  expect(gtag).toHaveBeenLastCalledWith('event', eventName, expectedParams);
  const [, , eventParams] = gtag.mock.lastCall ?? [];

  expect(eventParams).not.toHaveProperty('id');
  expect(eventParams).not.toHaveProperty('page_location');
}

describe('share analytics events', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    const analyticsWindow = window as AnalyticsWindow;
    delete analyticsWindow.gtag;
    delete analyticsWindow.__tokenMakerGtagConfigured;
  });

  it('emits share_copy_link without a share capability ID or complete page URL', async () => {
    const { gtag, trackShareCopyLink } = await loadProductionAnalytics();

    trackShareCopyLink();

    expectShareEventWithoutCapabilityOrPageLocation(gtag, 'share_copy_link');
  });

  it('emits share_social with the platform but no capability ID or complete page URL', async () => {
    const { gtag, trackShareSocial } = await loadProductionAnalytics();

    (trackShareSocial as (platform: string, legacyId?: string) => void)('pinterest', 'abc123def4');

    expectShareEventWithoutCapabilityOrPageLocation(gtag, 'share_social', {
      platform: 'pinterest',
    });
  });

  it('emits share_page_cta_click without a share capability ID or complete page URL', async () => {
    const { gtag, trackSharePageCtaClick } = await loadProductionAnalytics();

    (trackSharePageCtaClick as (legacyId?: string) => void)('abc123def4');

    expectShareEventWithoutCapabilityOrPageLocation(gtag, 'share_page_cta_click');
  });
});
