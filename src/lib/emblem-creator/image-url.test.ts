import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadEmblemImage } from './image-loading';
import { requireEmblemImageUrl } from './image-url';

const AMBIGUOUS_ABSOLUTE_URLS = [
  'https:example.com/x',
  'https:/example.com/x',
  'http:example.com/x',
  'http:/example.com/x',
  'https:///example.com/x',
  'http:///example.com/x',
  'https://\\example.com/x',
  'https:\\example.com/x',
];

describe('requireEmblemImageUrl', () => {
  it.each([
    'https://example.com/emblems/crest.svg',
    'http://127.0.0.1:3000/uploads/emblem.png',
    'HTTPS://EXAMPLE.COM:443/emblems/../crest.svg?name=%7e#preview',
    '/emblem-creator/original/crest.svg',
    '/images/custom-emblem.png?size=2#preview',
    '/emblems/../crest.svg?name=%7e#preview',
  ])('accepts an allowed URL: %s', (url) => {
    expect(requireEmblemImageUrl(url)).toBe(url);
  });

  it.each(AMBIGUOUS_ABSOLUTE_URLS)('rejects an absolute URL without explicit authority: %s', (url) => {
    expect(() => requireEmblemImageUrl(url)).toThrow(TypeError);
    expect(() => requireEmblemImageUrl(url)).toThrow(JSON.stringify(url));
  });

  it.each([
    '',
    ' https://example.com/crest.svg',
    'https://example.com/crest.svg ',
    'https://',
    '//example.com/crest.svg',
    '/\\example.com/crest.svg',
    'ftp://example.com/crest.svg',
    'data:image/svg+xml,<svg/>',
    'javascript:alert(1)',
    'relative/crest.svg',
  ])('rejects an unsupported or invalid URL: %s', (url) => {
    expect(() => requireEmblemImageUrl(url)).toThrow(JSON.stringify(url));
  });

  it('rejects non-string runtime values with the actual value', () => {
    expect(() => requireEmblemImageUrl(null as unknown as string)).toThrow('received null');
  });
});

describe('image URL validation before loading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(AMBIGUOUS_ABSOLUTE_URLS)('rejects %s before creating an image or timer', async (url) => {
    const createImage = vi.fn(function () {
      throw new Error('Image created before URL boundary rejection');
    });
    vi.stubGlobal('Image', createImage);

    const loading = loadEmblemImage(url);
    await expect(loading).rejects.toThrow(TypeError);
    await expect(loading).rejects.toThrow(JSON.stringify(url));
    expect(createImage).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([
    'https://example.com/x',
    'http://example.com/x',
    'HTTPS://EXAMPLE.COM:443/emblems/../crest.svg?name=%7e#preview',
    '/images/custom-emblem.png?size=2#preview',
  ])('loads an allowed URL with its original value: %s', async (url) => {
    const image = {
      crossOrigin: null as string | null,
      naturalWidth: 160,
      naturalHeight: 80,
      onload: null as (() => void) | null,
      onerror: null,
      src: '',
    };
    const createImage = vi.fn(function () { return image; });
    vi.stubGlobal('Image', createImage);

    const loading = loadEmblemImage(url);
    expect(createImage).toHaveBeenCalledOnce();
    expect(image.src).toBe(url);
    expect(image.crossOrigin).toBe('anonymous');
    expect(image.onload).toBeTypeOf('function');
    image.onload!();

    await expect(loading).resolves.toBe(image);
    expect(vi.getTimerCount()).toBe(0);
  });
});
