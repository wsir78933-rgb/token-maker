'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { requireCspNonce } from '@/lib/security/require-csp-nonce';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_ANALYTICS_ENABLED = IS_PRODUCTION && Boolean(GA_MEASUREMENT_ID);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  nonce: string;
}

export function GoogleAnalytics({ nonce }: GoogleAnalyticsProps) {
  const requestNonce = requireCspNonce('GoogleAnalytics', nonce);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitialPage = useRef(false);
  const search = searchParams.toString();

  useEffect(() => {
    if (!IS_ANALYTICS_ENABLED || !GA_MEASUREMENT_ID || !pathname) {
      return;
    }

    if (!hasTrackedInitialPage.current) {
      hasTrackedInitialPage.current = true;
      return;
    }

    if (typeof window.gtag !== 'function') {
      return;
    }

    const url = search ? `${pathname}?${search}` : pathname;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, search]);

  if (!IS_ANALYTICS_ENABLED || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        nonce={requestNonce}
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" nonce={requestNonce} strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          if (!window.__tokenMakerGtagConfigured) {
            window.__tokenMakerGtagConfigured = true;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          }
        `}
      </Script>
    </>
  );
}
