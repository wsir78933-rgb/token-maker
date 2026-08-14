// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { listTargetShieldPaletteAssets, TargetShieldPalette } from './TargetShieldPalette';

describe('TargetShieldPalette', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
  });

  it('applies a bundled shield material when its card is selected', async () => {
    const shieldLayerId = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')?.id;
    if (!shieldLayerId) throw new Error('Expected default project shield layer');

    render(<TargetShieldPalette activeCategory="shield" locale="en" />);

    await screen.findByRole('button', { name: 'Select shield: Shield material 001' });
    screen.getByRole('button', { name: 'Select shield: Shield material 001' }).click();

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === shieldLayerId)).toMatchObject({
      type: 'shield',
      assetId: 'shield-001',
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('localizes bundled shield material cards in Chinese', async () => {
    render(<TargetShieldPalette activeCategory="shield" locale="zh" />);

    expect(await screen.findByRole('button', { name: '选择盾形：盾牌素材 001' })).toBeDefined();
  });

  it('keeps the compact tree-controlled gallery without duplicate category controls', () => {
    render(<TargetShieldPalette locale="en" />);

    expect(screen.queryByRole('group', { name: 'Shield categories' })).toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery--compact')).not.toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery__grid--compact')).not.toBeNull();
  });

  it('exposes six base outlines and 234 bundled shield materials', () => {
    expect(listTargetShieldPaletteAssets()).toHaveLength(240);
    expect(listTargetShieldPaletteAssets().some((asset) => asset.id === 'shield-001')).toBe(true);
  });
});
