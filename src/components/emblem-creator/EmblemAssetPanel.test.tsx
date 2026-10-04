// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEmblemCatalogAsset, listEmblemCatalogAssets } from '@/lib/emblem-creator/catalog';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { applyEmblemProjectCommand, createDefaultEmblemProject, createEmblemElement } from '@/lib/emblem-creator/project';
import type { EmblemAssetCategory, EmblemLayerId, EmblemLocale, EmblemProject } from '@/lib/emblem-creator/types';

import { EmblemAssetPanel, type EmblemAssetPanelProps } from './EmblemAssetPanel';

afterEach(cleanup);

const rollforfantasyAssetGroups: readonly {
  category: EmblemAssetCategory;
  fileType: string;
  count: number;
  englishName: string;
  chineseName: string;
}[] = [
  { category: 'body', fileType: 'emblems', count: 40, englishName: 'Main body', chineseName: '主体' },
  { category: 'detail', fileType: 'detail', count: 40, englishName: 'Detail', chineseName: '细节' },
  { category: 'crest', fileType: 'animal', count: 30, englishName: 'Animal', chineseName: '动物' },
  { category: 'crest', fileType: 'weapon', count: 27, englishName: 'Weapon', chineseName: '武器' },
  { category: 'crest', fileType: 'icon', count: 40, englishName: 'Icon', chineseName: '图标' },
  { category: 'crest', fileType: 'misc', count: 38, englishName: 'Misc', chineseName: '其他' },
];

function renderAssets(overrides: Partial<EmblemAssetPanelProps> = {}) {
  const props: EmblemAssetPanelProps = {
    locale: 'en', copy: getEmblemCreatorCopy('en'), project: createDefaultEmblemProject(), activeCategory: 'body',
    onCategoryChange: vi.fn(), onAddCatalogAsset: vi.fn(), onAddImageUrl: vi.fn(async () => undefined),
    ...overrides,
  };
  return { props, ...render(<EmblemAssetPanel {...props} />) };
}

function projectWithOccupiedBodyLayers(count: number): EmblemProject {
  let project = createDefaultEmblemProject();
  const bodyLayerIds = ['body4', 'body3', 'body2', 'body1'] as const;
  for (const [index, layerId] of bodyLayerIds.slice(0, count).entries()) {
    project = applyEmblemProjectCommand(project, {
      type: 'add-element', layerId,
      element: createEmblemElement({ kind: 'url', url: `/occupied-${index}.png`, naturalWidth: 100, naturalHeight: 100 }, `occupied-${index}`),
    });
  }
  return project;
}

describe('EmblemAssetPanel', () => {
  it.each(['en', 'zh'] as const)('lists all 215 RollForFantasy PNG assets in contract order and locale %s', (locale: EmblemLocale) => {
    const copy = getEmblemCreatorCopy(locale);
    const categories = ['body', 'detail', 'crest'] as const;
    for (const category of categories) {
      const { props, unmount } = renderAssets({ locale, copy, activeCategory: category });
      const categoryButton = screen.getByRole('button', { name: copy.assets.categories[category] });
      expect(categoryButton.getAttribute('aria-pressed')).toBe('true');
      for (const selectableCategory of categories) {
        fireEvent.click(screen.getByRole('button', { name: copy.assets.categories[selectableCategory] }));
        expect(props.onCategoryChange).toHaveBeenLastCalledWith(selectableCategory);
      }

      const assets = listEmblemCatalogAssets(category);
      const expectedGroups = rollforfantasyAssetGroups.filter((group) => group.category === category);
      const expectedIds = expectedGroups.flatMap((group) =>
        Array.from({ length: group.count }, (_, index) => 'rff-' + group.fileType + '-' + (index + 1)));
      expect(assets.map((asset) => asset.id)).toEqual(expectedIds);
      expect(screen.getAllByRole('listitem')).toHaveLength(expectedIds.length);

      for (const group of expectedGroups) {
        const groupAssets = assets.filter((asset) => asset.id.startsWith('rff-' + group.fileType + '-'));
        expect(groupAssets).toHaveLength(group.count);
        for (const [index, asset] of groupAssets.entries()) {
          const number = index + 1;
          expect(asset).toMatchObject({
            id: 'rff-' + group.fileType + '-' + number,
            category,
            publicPath: '/emblem-creator/rollforfantasy/' + group.fileType + number + '.png',
            name: { en: group.englishName + ' ' + number, zh: group.chineseName + ' ' + number },
          });
          expect(asset.width).toBeGreaterThan(0);
          expect(asset.height).toBeGreaterThan(0);
        }
      }

      for (const asset of assets) {
        const button = screen.getByRole('button', { name: copy.assets.chooseAsset + ': ' + asset.name[locale] });
        expect(button.querySelector('img')?.getAttribute('src')).toBe(asset.publicPath);
      }
      unmount();
    }
  });

  it.each(['en', 'zh'] as const)('adds the localized first local PNG selection in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const asset = getEmblemCatalogAsset('rff-emblems-1');
    const { props } = renderAssets({ locale, copy, activeCategory: 'body' });
    fireEvent.click(screen.getByRole('button', { name: copy.assets.chooseAsset + ': ' + asset.name[locale] }));
    expect(asset).toMatchObject({
      id: 'rff-emblems-1',
      category: 'body',
      publicPath: '/emblem-creator/rollforfantasy/emblems1.png',
      name: { en: 'Main body 1', zh: '主体 1' },
    });
    expect(props.onAddCatalogAsset).toHaveBeenCalledExactlyOnceWith(asset, 'body4');
  });

  it.each([
    ['body', 'body4'], ['detail', 'details'], ['crest', 'crests'],
  ] as const)('routes catalog and URL %s additions to %s', async (activeCategory: EmblemAssetCategory, targetLayerId: EmblemLayerId) => {
    const { props } = renderAssets({ activeCategory });
    const asset = listEmblemCatalogAssets(activeCategory)[0];
    fireEvent.click(screen.getByRole('button', { name: `${props.copy.assets.chooseAsset}: ${asset.name.en}` }));
    expect(props.onAddCatalogAsset).toHaveBeenCalledExactlyOnceWith(asset, targetLayerId);
    fireEvent.change(screen.getByLabelText(props.copy.assets.imageUrl), { target: { value: '/emblem-test.png' } });
    fireEvent.click(screen.getByRole('button', { name: props.copy.assets.addImage }));
    await waitFor(() => expect(props.onAddImageUrl).toHaveBeenCalledExactlyOnceWith('/emblem-test.png', activeCategory, targetLayerId));
    await waitFor(() => expect((screen.getByLabelText(props.copy.assets.imageUrl) as HTMLInputElement).value).toBe(''));
  });

  it('automatically skips a hidden occupied body layer when another body slot is empty', () => {
    let project = projectWithOccupiedBodyLayers(1);
    project = { ...project, layers: { ...project.layers, body4: { ...project.layers.body4, visible: false } } };
    const { props } = renderAssets({ project, activeCategory: 'body' });
    const asset = getEmblemCatalogAsset('rff-emblems-1');
    fireEvent.click(screen.getByRole('button', { name: `${props.copy.assets.chooseAsset}: ${asset.name.en}` }));
    expect(props.onAddCatalogAsset).toHaveBeenCalledExactlyOnceWith(asset, 'body3');
  });

  it.each(['en', 'zh'] as const)('shows a localized 4/4 error instead of adding to an occupied layer in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const { props } = renderAssets({ locale, copy, project: projectWithOccupiedBodyLayers(4), activeCategory: 'body' });
    const asset = getEmblemCatalogAsset('rff-emblems-1');
    fireEvent.click(screen.getByRole('button', { name: `${copy.assets.chooseAsset}: ${asset.name[locale]}` }));
    expect(screen.getByRole('alert').textContent).toContain(copy.errors.bodyLayersFull);
    expect(screen.getByRole('alert').textContent).toContain('4/4');
    expect(props.onAddCatalogAsset).not.toHaveBeenCalled();

    const imageUrl = '/emblem-test.png';
    fireEvent.change(screen.getByLabelText(copy.assets.imageUrl), { target: { value: imageUrl } });
    fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));
    expect(screen.getByRole('alert').textContent).toContain(copy.errors.bodyLayersFull);
    expect(screen.getByRole('alert').textContent).toContain('4/4');
    expect(props.onAddImageUrl).not.toHaveBeenCalled();
    expect((screen.getByLabelText(copy.assets.imageUrl) as HTMLInputElement).value).toBe(imageUrl);
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
