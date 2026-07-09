import { describe, expect, it } from 'vitest';

import en from './en';
import zh from './zh';

describe('share dialog disclosure copy', () => {
  it('uses concise localized public share page copy', () => {
    expect(zh.shareUploadDisclosure).toBe('复制链接或分享到社媒即可生成公开分享页。');
    expect(en.shareUploadDisclosure).toBe('Copy a link or share on social media to create a public share page.');
  });
});
