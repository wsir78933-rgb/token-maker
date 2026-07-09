import { describe, expect, it } from 'vitest';
import manifest from '@/app/manifest';
import { createLocaleLayoutMetadata } from '@/lib/site-metadata';

describe('site layout metadata', () => {
  it('includes the Yandex site verification token', () => {
    const metadata = createLocaleLayoutMetadata('en');

    expect(metadata.verification).toEqual({
      yandex: 'f252fddaf29fc1be',
    });
  });

  it('uses neutral bilingual copy for the locale-less PWA manifest description', () => {
    const pwaManifest = manifest();

    expect(pwaManifest.description).toContain('Free browser VTT token maker');
    expect(pwaManifest.description).toContain('免费浏览器 VTT Token 制作器');
  });
});
