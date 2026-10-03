// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { listEmblemCatalogAssets } from '@/lib/emblem-creator/catalog';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import type { EmblemAssetCategory, EmblemLayerId, EmblemLocale } from '@/lib/emblem-creator/types';

import { EmblemAssetPanel, type EmblemAssetPanelProps } from './EmblemAssetPanel';

afterEach(cleanup);

function renderAssets(overrides: Partial<EmblemAssetPanelProps> = {}) {
  const props: EmblemAssetPanelProps = {
    locale: 'en', copy: getEmblemCreatorCopy('en'), activeCategory: 'body', activeLayerId: 'body4',
    onCategoryChange: vi.fn(), onAddCatalogAsset: vi.fn(), onAddImageUrl: vi.fn(async () => undefined),
    ...overrides,
  };
  return { props, ...render(<EmblemAssetPanel {...props} />) };
}

describe('EmblemAssetPanel', () => {
  it.each(['en', 'zh'] as const)('lists real catalog thumbnails and localized categories in %s', (locale: EmblemLocale) => {
    const copy = getEmblemCreatorCopy(locale);
    const { props } = renderAssets({ locale, copy });
    for (const category of ['body', 'detail', 'crest'] as const) {
      const categoryButton = screen.getByRole('button', { name: copy.assets.categories[category] });
      expect(categoryButton.getAttribute('aria-pressed')).toBe(String(category === 'body'));
      fireEvent.click(categoryButton);
      expect(props.onCategoryChange).toHaveBeenLastCalledWith(category);
    }
    const assets = listEmblemCatalogAssets('body');
    expect(screen.getAllByRole('listitem')).toHaveLength(assets.length);
    for (const asset of assets) {
      const button = screen.getByRole('button', { name: `${copy.assets.chooseAsset}: ${asset.name[locale]}` });
      expect(button.querySelector('img')?.getAttribute('src')).toBe(asset.publicPath);
    }
  });

  it.each([
    ['body', 'body2', 'body2'], ['body', 'crests', 'body4'], ['detail', 'body1', 'details'], ['crest', 'body3', 'crests'],
  ] as const)('routes catalog and URL %s additions from %s to %s', async (activeCategory: EmblemAssetCategory, activeLayerId: EmblemLayerId, targetLayerId: EmblemLayerId) => {
    const { props } = renderAssets({ activeCategory, activeLayerId });
    const asset = listEmblemCatalogAssets(activeCategory)[0];
    fireEvent.click(screen.getByRole('button', { name: `${props.copy.assets.chooseAsset}: ${asset.name.en}` }));
    expect(props.onAddCatalogAsset).toHaveBeenCalledExactlyOnceWith(asset, targetLayerId);
    fireEvent.change(screen.getByLabelText(props.copy.assets.imageUrl), { target: { value: '/emblem-test.png' } });
    fireEvent.click(screen.getByRole('button', { name: props.copy.assets.addImage }));
    await waitFor(() => expect(props.onAddImageUrl).toHaveBeenCalledExactlyOnceWith('/emblem-test.png', targetLayerId));
    await waitFor(() => expect((screen.getByLabelText(props.copy.assets.imageUrl) as HTMLInputElement).value).toBe(''));
  });

  it.each(['', '   ', 'javascript:alert(1)', 'ftp://example.com/a.png'])('rejects invalid URL %j without invoking the add callback', async (url) => {
    const { props } = renderAssets({ locale: 'zh', copy: getEmblemCreatorCopy('zh') });
    fireEvent.change(screen.getByLabelText(props.copy.assets.imageUrl), { target: { value: url } });
    fireEvent.click(screen.getByRole('button', { name: props.copy.assets.addImage }));
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', expect.stringContaining(JSON.stringify(url)));
    expect(screen.getByRole('alert').textContent).toContain(props.copy.errors.invalidImageUrl);
    expect(props.onAddImageUrl).not.toHaveBeenCalled();
  });

  it('disables duplicate URL submissions while awaiting the real async callback contract', async () => {
    let completeAddition!: () => void;
    const pendingAddition = new Promise<void>((resolve) => { completeAddition = resolve; });
    const onAddImageUrl = vi.fn(() => pendingAddition);
    const { props } = renderAssets({ onAddImageUrl });
    fireEvent.change(screen.getByLabelText(props.copy.assets.imageUrl), { target: { value: 'https://example.com/picture.png' } });
    fireEvent.click(screen.getByRole('button', { name: props.copy.assets.addImage }));
    const button = screen.getByRole('button', { name: props.copy.assets.addingImage }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.submit(button.closest('form')!);
    expect(onAddImageUrl).toHaveBeenCalledTimes(1);
    await act(async () => { completeAddition(); await pendingAddition; });
    expect((screen.getByRole('button', { name: props.copy.assets.addImage }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('keeps a rejected URL and reports the URL and unknown rejection value', async () => {
    const { props } = renderAssets({ onAddImageUrl: vi.fn(async () => { throw 'decode rejected: not an image'; }) });
    const url = 'https://example.com/broken.png';
    fireEvent.change(screen.getByLabelText(props.copy.assets.imageUrl), { target: { value: url } });
    fireEvent.click(screen.getByRole('button', { name: props.copy.assets.addImage }));
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain(url);
    expect(alert.textContent).toContain('decode rejected: not an image');
    expect((screen.getByLabelText(props.copy.assets.imageUrl) as HTMLInputElement).value).toBe(url);
  });
});
