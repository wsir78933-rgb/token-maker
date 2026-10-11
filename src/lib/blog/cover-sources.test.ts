import { describe, expect, it } from 'vitest';

import { getBlogCoverImageSources } from './cover-sources';

describe('getBlogCoverImageSources', () => {
  it('returns direct WebP candidates up to the source width', () => {
    expect(getBlogCoverImageSources('/blog/covers/en/dnd-meaning-guide.webp')).toEqual({
      src: '/blog/covers/responsive/en/dnd-meaning-guide-1280w.webp',
      srcSet: [
        '/blog/covers/responsive/en/dnd-meaning-guide-640w.webp 640w',
        '/blog/covers/responsive/en/dnd-meaning-guide-960w.webp 960w',
        '/blog/covers/responsive/en/dnd-meaning-guide-1280w.webp 1280w',
        '/blog/covers/responsive/en/dnd-meaning-guide-1920w.webp 1920w',
        '/blog/covers/en/dnd-meaning-guide.webp 2770w',
      ].join(', '),
      width: 2770,
      height: 1504,
    });
  });

  it('uses the original source width when it is below the next variant size', () => {
    const sources = getBlogCoverImageSources('/blog/covers/en/dnd-kenku-guide.webp');

    expect(sources.src).toBe('/blog/covers/en/dnd-kenku-guide.webp');
    expect(sources.srcSet).toContain('/blog/covers/en/dnd-kenku-guide.webp 1280w');
    expect(sources.srcSet).not.toContain('1920w');
  });

  it('supports the registered Warlock cover source stored under the inline directory', () => {
    expect(getBlogCoverImageSources('/blog/inline/dnd-warlock-spells/eldritch-blast.webp')).toEqual({
      src: '/blog/covers/responsive/inline/dnd-warlock-spells/eldritch-blast-1280w.webp',
      srcSet: [
        '/blog/covers/responsive/inline/dnd-warlock-spells/eldritch-blast-640w.webp 640w',
        '/blog/covers/responsive/inline/dnd-warlock-spells/eldritch-blast-960w.webp 960w',
        '/blog/covers/responsive/inline/dnd-warlock-spells/eldritch-blast-1280w.webp 1280w',
        '/blog/inline/dnd-warlock-spells/eldritch-blast.webp 1536w',
      ].join(', '),
      width: 1536,
      height: 1024,
    });
  });

  it('rejects unsupported paths with the received value', () => {
    expect(() => getBlogCoverImageSources('/blog/images/dnd-meaning.webp')).toThrow(
      'Blog cover source must be a .webp file under /blog/covers/ or equal /blog/inline/dnd-warlock-spells/eldritch-blast.webp; received "/blog/images/dnd-meaning.webp".',
    );
  });

  it('rejects missing dimensions with the received value', () => {
    expect(() => getBlogCoverImageSources('/blog/covers/en/missing.webp')).toThrow(
      'Missing blog cover dimensions for image: /blog/covers/en/missing.webp',
    );
  });
});
