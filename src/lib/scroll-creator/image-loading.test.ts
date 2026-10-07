// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  SCROLL_IMAGE_LOAD_TIMEOUT_MS,
  loadScrollImage,
  requireScrollImageUrl,
} from './image-loading';

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
  vi.stubGlobal(
    'Image',
    vi.fn(function createImageElement() {
      const image = document.createElement('img');
      createdImages.push(image);
      return image;
    }),
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('scroll creator image URL validation', () => {
  it('accepts secure remote images, localhost HTTP test images, and external SVG resources', () => {
    expect(requireScrollImageUrl('https://cdn.example.test/sigil.png')).toBe(
      'https://cdn.example.test/sigil.png',
    );
    expect(requireScrollImageUrl('http://localhost:40001/sigil.png')).toBe(
      'http://localhost:40001/sigil.png',
    );
    expect(requireScrollImageUrl('https://cdn.example.test/sigil.svg')).toBe(
      'https://cdn.example.test/sigil.svg',
    );
  });

  it('rejects unsafe protocols and inline SVG/data URLs before constructing an image', () => {
    const invalidUrls = [
      'javascript:alert(1)',
      'file:///tmp/sigil.png',
      'data:image/svg+xml,<svg></svg>',
      'data:image/png;base64,abc',
      'http://images.example.test/sigil.png',
      'http://127.0.0.2/sigil.png',
    ];

    for (const invalidUrl of invalidUrls) {
      expect(() => requireScrollImageUrl(invalidUrl)).toThrow(invalidUrl);
    }
    expect(createdImages).toHaveLength(0);
  });
});

describe('loadScrollImage', () => {
  it('resolves intrinsic dimensions after the native image load event', async () => {
    const loading = loadScrollImage('https://cdn.example.test/sigil.png');
    const image = createdImages[0];
    expect(image.getAttribute('src')).toBe('https://cdn.example.test/sigil.png');
    setNaturalDimensions(image, 160, 80);
    image.dispatchEvent(new Event('load'));

    await expect(loading).resolves.toEqual({ width: 160, height: 80 });
    expect(image.onload).toBeNull();
    expect(image.onerror).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reports browser image errors with the requested URL and browser reason', async () => {
    const loading = loadScrollImage('https://cdn.example.test/unavailable.png');
    const rejection = expect(loading).rejects.toThrow('unavailable.png');
    createdImages[0].dispatchEvent(
      new ErrorEvent('error', { message: 'Image decoder rejected this resource' }),
    );

    await rejection;
    await expect(loading).rejects.toThrow('Image decoder rejected this resource');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reports unusable natural dimensions instead of returning zero geometry', async () => {
    const loading = loadScrollImage('https://cdn.example.test/empty.png');
    const rejection = expect(loading).rejects.toThrow('0 × 80');
    setNaturalDimensions(createdImages[0], 0, 80);
    createdImages[0].dispatchEvent(new Event('load'));

    await rejection;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects a slow request after the bounded timeout and ignores later events', async () => {
    const loading = loadScrollImage('https://cdn.example.test/slow.png');
    const rejection = expect(loading).rejects.toThrow(
      `${SCROLL_IMAGE_LOAD_TIMEOUT_MS} ms`,
    );
    await vi.advanceTimersByTimeAsync(SCROLL_IMAGE_LOAD_TIMEOUT_MS);
    await rejection;

    const image = createdImages[0];
    setNaturalDimensions(image, 80, 40);
    image.dispatchEvent(new Event('load'));
    expect(image.onload).toBeNull();
    expect(image.onerror).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reports synchronous image request failures with the URL and cause', async () => {
    const requestFailure = new Error('native image setter failed');
    vi.spyOn(HTMLImageElement.prototype, 'src', 'set').mockImplementation(() => {
      throw requestFailure;
    });

    await expect(loadScrollImage('https://cdn.example.test/unexpected.png')).rejects.toThrow(
      /unexpected\.png.*native image setter failed/,
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects an invalid URL before creating an image or timer', async () => {
    await expect(loadScrollImage('javascript:alert(1)')).rejects.toThrow('javascript:alert(1)');
    expect(createdImages).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
