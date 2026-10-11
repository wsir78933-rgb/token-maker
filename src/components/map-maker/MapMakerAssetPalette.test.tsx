// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getMapMakerAssets, type MapMakerAsset, type MapMakerCoastlineGroup } from '@/lib/map-maker';
import { getMapMakerAssetDisplayName, getMapMakerCopy } from '@/lib/map-maker/copy';

import { MapMakerAssetPalette } from './MapMakerAssetPalette';

function requireCoastlineAsset(group: MapMakerCoastlineGroup): MapMakerAsset {
  const asset = getMapMakerAssets().find((candidate) => candidate.category === 'coastline' && candidate.coastlineGroup === group);
  if (asset === undefined) {
    throw new Error(`Expected a catalog asset for coastline group ${JSON.stringify(group)}.`);
  }
  return asset;
}

function getAssetButtonName(copy: ReturnType<typeof getMapMakerCopy>['workspace'], asset: MapMakerAsset): string {
  return `${copy.materials.tilesTab}: ${getMapMakerAssetDisplayName(copy, asset)}`;
}

afterEach(cleanup);

describe('MapMakerAssetPalette coastline select', () => {
  it.each(['en', 'zh'] as const)('selects a coastline group by keyboard and restores focus in %s', async (locale) => {
    const copy = getMapMakerCopy(locale).workspace;
    const initialGroup = 'convex-upper-left';
    const selectedGroup = 'side-left';
    const initialGroupLabel = `${copy.materials.tileShapes.convex} · ${copy.materials.tileDirections.upperLeft}`;
    const selectedGroupLabel = `${copy.materials.tileShapes.side} · ${copy.materials.tileDirections.left}`;
    const coastlineSelectId = `map-maker-test-coastline-select-${locale}`;
    const coastlineSelectLabel = [
      copy.materials.tileShapes.convex,
      copy.materials.tileShapes.concave,
      copy.materials.tileShapes.side,
    ].join(' / ');
    const initialAsset = requireCoastlineAsset(initialGroup);
    const selectedAsset = requireCoastlineAsset(selectedGroup);

    render(
      <MapMakerAssetPalette
        coastlineSelectId={coastlineSelectId}
        copy={copy}
        editTarget="base"
        targetLayer={1}
        onEditTargetChange={vi.fn()}
        onTargetLayerChange={vi.fn()}
        onReplaceSelectedTiles={vi.fn()}
        onPlaceElement={vi.fn()}
        onImageLoadError={vi.fn()}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: coastlineSelectLabel });
    expect(trigger.id).toBe(coastlineSelectId);
    expect(Array.from(document.querySelectorAll('[id]')).filter((element) => element.id === coastlineSelectId)).toEqual([trigger]);
    const referencedLabelId = trigger.getAttribute('aria-labelledby');
    if (referencedLabelId === null) {
      throw new Error(`Expected coastline select ${JSON.stringify(coastlineSelectId)} to reference its localized label.`);
    }
    const referencedLabel = document.getElementById(referencedLabelId);
    if (referencedLabel === null) {
      throw new Error(`Expected coastline select label id ${JSON.stringify(referencedLabelId)} to exist.`);
    }
    expect(referencedLabel.textContent).toBe(coastlineSelectLabel);
    expect(Array.from(document.querySelectorAll('[id]')).filter((element) => element.id === referencedLabelId)).toEqual([referencedLabel]);
    expect(trigger.textContent).toContain(initialGroupLabel);
    expect(screen.getByRole('button', { name: getAssetButtonName(copy, initialAsset) })).toBeTruthy();
    expect(screen.queryByRole('option')).toBeNull();

    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getAllByRole('option')).toHaveLength(12);
    const initialOption = screen.getByRole('option', { name: initialGroupLabel });
    expect(initialOption.getAttribute('aria-selected')).toBe('true');
    await waitFor(() => expect(document.activeElement).toBe(initialOption));
    const selectedOption = screen.getByRole('option', { name: selectedGroupLabel });

    for (let optionStep = 0; optionStep < 11; optionStep += 1) {
      const focusedOption = document.activeElement;
      if (!(focusedOption instanceof HTMLElement)) {
        throw new Error(`Expected a focused coastline option at keyboard step ${String(optionStep)}.`);
      }
      fireEvent.keyDown(focusedOption, { key: 'ArrowDown' });
    }
    await waitFor(() => expect(document.activeElement).toBe(selectedOption));
    fireEvent.keyDown(selectedOption, { key: 'Enter' });

    await waitFor(() => expect(trigger.textContent).toContain(selectedGroupLabel));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(screen.getByRole('button', { name: getAssetButtonName(copy, selectedAsset) })).toBeTruthy();
    expect(screen.queryByRole('button', { name: getAssetButtonName(copy, initialAsset) })).toBeNull();

    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(selectedOption));
    const focusedElement = document.activeElement;
    if (!(focusedElement instanceof HTMLElement)) {
      throw new Error('Expected the open coastline select to have a focused element before Escape.');
    }
    fireEvent.keyDown(focusedElement, { key: 'Escape' });

    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(trigger.textContent).toContain(selectedGroupLabel);
    expect(screen.getByRole('button', { name: getAssetButtonName(copy, selectedAsset) })).toBeTruthy();
  });
});
