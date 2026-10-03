// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadEmblemImage } from '@/lib/emblem-creator/image-loading';

let createdImages: HTMLImageElement[];

function setNaturalDimensions(image: HTMLImageElement, width: number, height: number): void {
  Object.defineProperties(image, {
    naturalWidth: { configurable: true, value: width },
    naturalHeight: { configurable: true, value: height },
  });
}

beforeEach(() => {
  createdImages = [];
  vi.useFakeTimers();
  vi.stubGlobal('Image', vi.fn(function () {
    const image = document.createElement('img');
    createdImages.push(image);
    return image;
  }));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('loadEmblemImage', () => {
  it('sets anonymous CORS before requesting a URL, then resolves the loaded native image', async () => {
    const corsAtRequest: (string | null)[] = [];
    const nativeSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
    vi.spyOn(HTMLImageElement.prototype, 'src', 'set').mockImplementation(function (this: HTMLImageElement, url) {
      corsAtRequest.push(this.crossOrigin);
      nativeSrc.set!.call(this, url);
    });

    const loading = loadEmblemImage('https://images.example.test/emblem.png');
    const image = createdImages[0];
    expect(corsAtRequest).toEqual(['anonymous']);
    expect(image.getAttribute('src')).toBe('https://images.example.test/emblem.png');
    setNaturalDimensions(image, 160, 80);
    image.dispatchEvent(new Event('load'));

    await expect(loading).resolves.toBe(image);
    expect(image.onload).toBeNull();
    expect(image.onerror).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects an asynchronous image error with the requested URL and available browser reason', async () => {
    const loading = loadEmblemImage('/emblem-creator/broken.svg');
    const rejection = expect(loading).rejects.toThrow('/emblem-creator/broken.svg');
    createdImages[0].dispatchEvent(new ErrorEvent('error', { message: 'Image decoder rejected this resource' }));

    await rejection;
    await expect(loading).rejects.toThrow('Image decoder rejected this resource');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reports a generic browser error without inventing an HTTP or decoding result', async () => {
    const loading = loadEmblemImage('https://images.example.test/unavailable.png');
    const rejection = expect(loading).rejects.toThrow('https://images.example.test/unavailable.png');
    createdImages[0].dispatchEvent(new Event('error'));

    await rejection;
    await expect(loading).rejects.toThrow('without further details');
  });

  it('rejects a request after 15 seconds and ignores a later load event', async () => {
    const loading = loadEmblemImage('/slow.png');
    const rejection = expect(loading).rejects.toThrow('"/slow.png" did not load within 15000 ms');
    await vi.advanceTimersByTimeAsync(15_000);
    await rejection;

    const image = createdImages[0];
    setNaturalDimensions(image, 80, 40);
    image.dispatchEvent(new Event('load'));
    expect(image.onload).toBeNull();
    expect(image.onerror).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects unusable natural dimensions with the actual URL and dimensions', async () => {
    const loading = loadEmblemImage('/empty.svg');
    const rejection = expect(loading).rejects.toThrow('"/empty.svg" loaded with invalid natural dimensions 0 × 80');
    setNaturalDimensions(createdImages[0], 0, 80);
    createdImages[0].dispatchEvent(new Event('load'));
    await rejection;
  });

  it('rejects an invalid URL before creating an image or timer', async () => {
    await expect(loadEmblemImage('javascript:alert(1)')).rejects.toThrow('javascript:alert(1)');
    expect(createdImages).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('preserves an unknown exception from requesting the image and clears the timeout', async () => {
    const requestFailure = { reason: 'unexpected native setter failure' };
    vi.spyOn(HTMLImageElement.prototype, 'src', 'set').mockImplementation(() => {
      throw requestFailure;
    });

    await expect(loadEmblemImage('/unexpected.png')).rejects.toBe(requestFailure);
    expect(createdImages[0].onload).toBeNull();
    expect(createdImages[0].onerror).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});
