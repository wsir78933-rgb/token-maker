// @vitest-environment jsdom

import { act } from '@testing-library/react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { StructuredData } from './StructuredData';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'DnD campaigns',
  inLanguage: 'en-US',
};

function ArticleDocument({ heading = 'DnD campaigns', showSchema = true } = {}) {
  return (
    <html>
      <head />
      <body>
        {showSchema ? <StructuredData id="article-jsonld" data={articleSchema} /> : null}
        <main><h1>{heading}</h1></main>
      </body>
    </html>
  );
}

function readSchemas() {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map((script) => ({ id: script.id, schema: JSON.parse(script.textContent ?? '') }));
}

describe('StructuredData document lifecycle', () => {
  let root: Root | undefined;

  afterEach(async () => {
    await act(async () => root?.unmount());
    root = undefined;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('keeps the complete schema in SSR HTML and hydrates it once', async () => {
    document.documentElement.innerHTML = renderToString(<ArticleDocument />);
    const expected = [{ id: 'article-jsonld', schema: articleSchema }];
    expect(readSchemas()).toEqual(expected);

    const onRecoverableError = vi.fn();
    await act(async () => {
      root = hydrateRoot(document, <ArticleDocument />, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(readSchemas()).toEqual(expected);
  });

  it('keeps parsed schemas intact when a value contains a script terminator', () => {
    const scriptPayloadSchema = {
      ...articleSchema,
      description: '</script><script id="unexpected-schema">window.__unexpectedSchema = true</script>',
    };

    document.documentElement.innerHTML = renderToString(
      <html>
        <head />
        <body>
          <StructuredData id="article-jsonld" data={articleSchema} />
          <StructuredData id="article-script-payload-jsonld" data={scriptPayloadSchema} />
        </body>
      </html>,
    );

    const scripts = Array.from(document.querySelectorAll('script'));
    expect(scripts).toHaveLength(2);
    expect(scripts.map((script) => script.type)).toEqual([
      'application/ld+json',
      'application/ld+json',
    ]);
    expect(scripts.map((script) => script.id)).toEqual([
      'article-jsonld',
      'article-script-payload-jsonld',
    ]);
    expect(JSON.parse(scripts[0].textContent ?? '')).toEqual(articleSchema);
    expect(JSON.parse(scripts[1].textContent ?? '')).toEqual(scriptPayloadSchema);
  });

  it('keeps one schema when a document hydration mismatch triggers client recovery', async () => {
    document.documentElement.innerHTML = renderToString(<ArticleDocument />);
    expect(readSchemas()).toHaveLength(1);

    const onRecoverableError = vi.fn();
    await act(async () => {
      root = hydrateRoot(document, <ArticleDocument heading="Updated campaign guide" />, {
        onRecoverableError,
      });
    });

    expect(onRecoverableError).toHaveBeenCalledOnce();
    expect(onRecoverableError.mock.calls[0][0].message).toContain('Hydration failed');
    expect(document.querySelector('h1')?.textContent).toBe('Updated campaign guide');
    expect(readSchemas()).toEqual([{ id: 'article-jsonld', schema: articleSchema }]);
  });

  it('removes the previous route schema on navigation after hydration recovery', async () => {
    document.documentElement.innerHTML = renderToString(<ArticleDocument />);
    const onRecoverableError = vi.fn();
    await act(async () => {
      root = hydrateRoot(document, <ArticleDocument heading="Updated campaign guide" />, {
        onRecoverableError,
      });
    });

    expect(onRecoverableError).toHaveBeenCalledOnce();
    await act(async () => {
      root?.render(<ArticleDocument heading="Next route" showSchema={false} />);
    });

    expect(document.querySelector('h1')?.textContent).toBe('Next route');
    expect(readSchemas()).toEqual([]);
  });
});
