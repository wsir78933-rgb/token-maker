// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GoogleAdSense } from './GoogleAdSense';

describe('GoogleAdSense', () => {
  it('loads the supplied AdSense client script with the request nonce', () => {
    render(<GoogleAdSense nonce="request-nonce" />);

    const script = document.querySelector('#google-adsense');

    expect(script?.getAttribute('src')).toBe(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1560537840529504'
    );
    expect(script?.getAttribute('crossorigin')).toBe('anonymous');
    expect(script?.getAttribute('nonce')).toBe('request-nonce');
    expect(script?.hasAttribute('async')).toBe(true);
    expect(script?.getAttribute('data-nscript')).toBeNull();
  });

  it('uses a native script that suppresses the browser nonce-hiding hydration mismatch', () => {
    const adSenseScript = GoogleAdSense({ nonce: 'request-nonce' });

    expect(adSenseScript.type).toBe('script');
    expect(adSenseScript.props.suppressHydrationWarning).toBe(true);
  });

  it('rejects an empty nonce instead of emitting a CSP-blocked loader', () => {
    expect(() => render(<GoogleAdSense nonce="" />)).toThrow(
      'GoogleAdSense requires a non-empty CSP nonce; received value: '
    );
  });
});
