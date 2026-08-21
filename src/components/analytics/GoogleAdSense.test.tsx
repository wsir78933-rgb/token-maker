// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GoogleAdSense } from './GoogleAdSense';

describe('GoogleAdSense', () => {
  it('loads the AdSense client script without requiring a request nonce', () => {
    render(<GoogleAdSense />);

    const script = document.querySelector('#google-adsense');

    expect(script?.getAttribute('src')).toBe(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1560537840529504'
    );
    expect(script?.getAttribute('crossorigin')).toBe('anonymous');
    expect(script?.getAttribute('nonce')).toBeNull();
    expect(script?.hasAttribute('async')).toBe(true);
    expect(script?.getAttribute('data-nscript')).toBeNull();
  });

  it('uses a native script that suppresses the browser nonce-hiding hydration mismatch', () => {
    const adSenseScript = GoogleAdSense();

    expect(adSenseScript.type).toBe('script');
    expect(adSenseScript.props.suppressHydrationWarning).toBe(true);
  });

});
