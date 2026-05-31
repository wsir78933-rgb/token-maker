import { describe, expect, it } from 'vitest';
import {
  buildPinterestShareUrl,
  buildRedditShareUrl,
  buildXShareUrl,
} from './platforms';

const params = {
  shareUrl: 'https://www.tokenmaker.one/share/abc123def4',
  imageUrl: 'https://r2.tokenmaker.one/shares/abc123def4.png',
  text: 'Check out this VTT token I made with Token Maker.',
  title: 'Check out this VTT token I made with Token Maker',
};

describe('share platform URLs', () => {
  it('builds an X intent URL', () => {
    const url = new URL(buildXShareUrl(params));

    expect(url.origin + url.pathname).toBe('https://x.com/intent/tweet');
    expect(url.searchParams.get('text')).toBe(params.text);
    expect(url.searchParams.get('url')).toBe(params.shareUrl);
  });

  it('builds a Pinterest save URL with media', () => {
    const url = new URL(buildPinterestShareUrl(params));

    expect(url.origin + url.pathname).toBe('https://www.pinterest.com/pin/create/button/');
    expect(url.searchParams.get('url')).toBe(params.shareUrl);
    expect(url.searchParams.get('media')).toBe(params.imageUrl);
    expect(url.searchParams.get('description')).toBe(params.text);
  });

  it('builds a Reddit submit URL', () => {
    const url = new URL(buildRedditShareUrl(params));

    expect(url.origin + url.pathname).toBe('https://www.reddit.com/submit');
    expect(url.searchParams.get('url')).toBe(params.shareUrl);
    expect(url.searchParams.get('title')).toBe(params.title);
  });
});
