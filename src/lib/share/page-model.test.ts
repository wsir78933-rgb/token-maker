import { afterEach, describe, expect, it } from 'vitest';
import { SHARE_SOCIAL_IMAGE_HEIGHT, SHARE_SOCIAL_IMAGE_WIDTH } from './constants';
import { createSharePageMetadata } from './page-model';

describe('share page metadata', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses the configured R2 public base URL for OG and X card images', () => {
    process.env = {
      ...originalEnv,
      R2_PUBLIC_BASE_URL: 'https://cdn.example.test/',
    };

    const metadata = createSharePageMetadata('en', 'abc123def4');
    const openGraph = metadata.openGraph as { images: Array<{ url: string }> };
    const twitter = metadata.twitter as { images: string[] };

    expect(openGraph.images[0].url).toBe('https://cdn.example.test/shares/abc123def4.png');
    expect(twitter.images[0]).toBe('https://cdn.example.test/shares/abc123def4.png');
  });

  it('declares the actual social share image dimensions in OG metadata', () => {
    const metadata = createSharePageMetadata('en', 'abc123def4');
    const openGraph = metadata.openGraph as {
      images: Array<{ height: number; width: number }>;
    };

    expect(openGraph.images[0].width).toBe(SHARE_SOCIAL_IMAGE_WIDTH);
    expect(openGraph.images[0].height).toBe(SHARE_SOCIAL_IMAGE_HEIGHT);
  });
});
