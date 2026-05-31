import { describe, expect, it } from 'vitest';
import {
  SHARE_SOCIAL_IMAGE_HEIGHT,
  SHARE_SOCIAL_IMAGE_WIDTH,
} from './constants';
import { getShareSocialImageLayout } from './social-image';

describe('share social image layout', () => {
  it('centers a square token inside a 1200x630 social card without filling the whole card', () => {
    const layout = getShareSocialImageLayout(1024, 1024);

    expect(layout.canvasWidth).toBe(SHARE_SOCIAL_IMAGE_WIDTH);
    expect(layout.canvasHeight).toBe(SHARE_SOCIAL_IMAGE_HEIGHT);
    expect(layout.drawWidth).toBeLessThanOrEqual(560);
    expect(layout.drawHeight).toBeLessThanOrEqual(560);
    expect(layout.x).toBeCloseTo((SHARE_SOCIAL_IMAGE_WIDTH - layout.drawWidth) / 2);
    expect(layout.y).toBeGreaterThanOrEqual(36);
  });

  it('keeps wide source images inside the social card safe area', () => {
    const layout = getShareSocialImageLayout(1600, 900);

    expect(layout.x).toBeGreaterThanOrEqual(80);
    expect(layout.y).toBeGreaterThanOrEqual(36);
    expect(layout.x + layout.drawWidth).toBeLessThanOrEqual(SHARE_SOCIAL_IMAGE_WIDTH - 80);
    expect(layout.y + layout.drawHeight).toBeLessThanOrEqual(SHARE_SOCIAL_IMAGE_HEIGHT - 36);
  });
});
