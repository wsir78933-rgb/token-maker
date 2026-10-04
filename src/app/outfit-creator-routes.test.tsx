import { describe, expect, it } from 'vitest';

import { metadata as englishMetadata } from '@/app/(en)/outfit-creator/page';
import { metadata as chineseMetadata } from '@/app/(zh)/zh/outfit-creator/page';
import { OutfitCreatorPageView } from '@/components/outfit-creator/OutfitCreatorPageView';

describe('Outfit Creator routes', () => {
  it('exposes English metadata with the canonical route and language alternates', () => {
    expect(englishMetadata.alternates).toEqual({
      canonical: '/outfit-creator',
      languages: {
        'x-default': '/outfit-creator',
        'en-US': '/outfit-creator',
        'zh-CN': '/zh/outfit-creator',
      },
    });
    expect(englishMetadata.title).toEqual({
      absolute: expect.stringContaining('Outfit Creator'),
    });
  });

  it('exposes Chinese metadata with the localized canonical route', () => {
    expect(chineseMetadata.alternates).toEqual({
      canonical: '/zh/outfit-creator',
      languages: {
        'x-default': '/outfit-creator',
        'en-US': '/outfit-creator',
        'zh-CN': '/zh/outfit-creator',
      },
    });
    expect(chineseMetadata.title).toEqual({
      absolute: expect.stringContaining('服装搭配工具'),
    });
  });

  it('exports one page view for both supported locales', () => {
    expect(OutfitCreatorPageView).toBeTypeOf('function');
  });
});
