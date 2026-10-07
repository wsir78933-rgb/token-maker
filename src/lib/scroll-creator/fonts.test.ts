// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadScrollFont, requireScrollFont } from './fonts';

type FontSetStub = {
  ready: Promise<unknown>;
  load: ReturnType<typeof vi.fn>;
};

let fontSetStub: FontSetStub | undefined;

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.head.querySelectorAll('link').forEach((stylesheetLink) => stylesheetLink.remove());
  if (fontSetStub) {
    Reflect.deleteProperty(document, 'fonts');
    fontSetStub = undefined;
  }
});

function installFontSetStub(loadResult: unknown): FontSetStub {
  fontSetStub = {
    ready: Promise.resolve(),
    load: vi.fn().mockResolvedValue(loadResult),
  };
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: fontSetStub,
  });
  return fontSetStub;
}

describe('scroll creator custom fonts', () => {
  it('normalizes a Google Fonts URL and a CSS font-family declaration', () => {
    expect(
      requireScrollFont(
        'https://fonts.googleapis.com/css2?family=UnifrakturCook',
        'font-family: "UnifrakturCook", serif;',
      ),
    ).toEqual({
      family: 'UnifrakturCook',
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=UnifrakturCook',
    });
  });

  it('extracts only a stylesheet URL from a full link tag without injecting markup', () => {
    const font = requireScrollFont(
      '<link href="https://fonts.googleapis.com/css?family=MedievalSharp" rel="stylesheet">',
      'MedievalSharp',
    );

    expect(font).toEqual({
      family: 'MedievalSharp',
      stylesheetUrl: 'https://fonts.googleapis.com/css?family=MedievalSharp',
    });
    expect(document.head.innerHTML).not.toContain('MedievalSharp');
  });

  it('rejects unsafe font sources, malformed link attributes, and markup families', () => {
    const invalidSources = [
      'http://fonts.googleapis.com/css?family=Roboto',
      'https://evil.example.test/css?family=Roboto',
      'javascript:alert(1)',
      '<script src="https://fonts.googleapis.com/css?family=Roboto"></script>',
      '<link href="https://fonts.googleapis.com/css?family=Roboto" rel="preload">',
      '<link href=https://fonts.googleapis.com/css?family=Roboto rel="stylesheet">',
      '<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" onload="alert(1)">',
    ];

    for (const invalidSource of invalidSources) {
      expect(() => requireScrollFont(invalidSource, 'Roboto')).toThrow();
    }
    expect(() => requireScrollFont('https://fonts.googleapis.com/css?family=Roboto', '')).toThrow(
      'Received ""',
    );
    expect(() =>
      requireScrollFont('https://fonts.googleapis.com/css?family=Roboto', '<img src=x>'),
    ).toThrow('without markup');
  });

  it('loads a stylesheet through a DOM link and verifies the requested family', async () => {
    const fonts = installFontSetStub([{ status: 'loaded' }]);
    const loading = loadScrollFont({
      family: 'UnifrakturCook',
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=UnifrakturCook',
    });
    const stylesheetLink = document.head.querySelector('link');
    if (!(stylesheetLink instanceof HTMLLinkElement)) {
      throw new Error('Expected loadScrollFont to append a link element.');
    }
    expect(stylesheetLink.rel).toBe('stylesheet');
    expect(stylesheetLink.href).toBe(
      'https://fonts.googleapis.com/css2?family=UnifrakturCook',
    );
    stylesheetLink.dispatchEvent(new Event('load'));

    await expect(loading).resolves.toBeUndefined();
    expect(fonts.load).toHaveBeenCalledWith('1em "UnifrakturCook"');
    expect(document.head.contains(stylesheetLink)).toBe(true);
  });

  it('rejects an empty browser font result and removes the failed stylesheet', async () => {
    installFontSetStub([]);
    const loading = loadScrollFont({
      family: 'MissingFont',
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=MissingFont',
    });
    const stylesheetLink = document.head.querySelector('link');
    if (!(stylesheetLink instanceof HTMLLinkElement)) {
      throw new Error('Expected loadScrollFont to append a link element.');
    }
    stylesheetLink.dispatchEvent(new Event('load'));

    await expect(loading).rejects.toThrow(/no faces.*MissingFont/);
    expect(document.head.contains(stylesheetLink)).toBe(false);
  });

  it('reports stylesheet errors with the URL and family and removes the link', async () => {
    installFontSetStub([{ status: 'loaded' }]);
    const loading = loadScrollFont({
      family: 'BrokenFont',
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=BrokenFont',
    });
    const stylesheetLink = document.head.querySelector('link');
    if (!(stylesheetLink instanceof HTMLLinkElement)) {
      throw new Error('Expected loadScrollFont to append a link element.');
    }
    stylesheetLink.dispatchEvent(new Event('error'));

    await expect(loading).rejects.toThrow(/BrokenFont.*fonts\.googleapis\.com/);
    expect(document.head.contains(stylesheetLink)).toBe(false);
  });

  it('times out while waiting for a stylesheet or browser font set', async () => {
    vi.useFakeTimers();
    const fonts = installFontSetStub([{ status: 'loaded' }]);
    fonts.ready = new Promise(() => undefined);
    const loading = loadScrollFont({
      family: 'SlowFont',
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=SlowFont',
    });
    const stylesheetLink = document.head.querySelector('link');
    if (!(stylesheetLink instanceof HTMLLinkElement)) {
      throw new Error('Expected loadScrollFont to append a link element.');
    }
    stylesheetLink.dispatchEvent(new Event('load'));
    const rejection = expect(loading).rejects.toThrow(/SlowFont.*15000 ms/);
    await vi.advanceTimersByTimeAsync(15_000);

    await rejection;
    expect(document.head.contains(stylesheetLink)).toBe(false);
  });

  it('rejects before touching the DOM when the font record has invalid fields', async () => {
    await expect(loadScrollFont(null as never)).rejects.toThrow(/must be an object/);
    await expect(
      loadScrollFont({
        family: 'Roboto',
        stylesheetUrl: 'https://evil.example.test/font.css',
      }),
    ).rejects.toThrow('evil.example.test');
  });
});
