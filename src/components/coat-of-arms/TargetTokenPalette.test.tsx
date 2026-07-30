// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TargetTokenPalette } from './TargetTokenPalette';

describe('TargetTokenPalette', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('zh'));
  });

  afterEach(() => {
    cleanup();
  });

  it('uses localized asset action labels for the token gallery', () => {
    render(<TargetTokenPalette locale="zh" />);

    expect(screen.getByLabelText('添加纹章令牌：展翅鹰')).toBeTruthy();
  });

  it('filters the local token catalogue by category and search before adding an emblem', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<TargetTokenPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Symbols' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tokens' }), { target: { value: 'sun emblem' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Sun emblem — A token' }));

    expect(screen.getByRole('button', { name: 'Symbols' }).getAttribute('aria-pressed')).toBe('true');
    expect(useCoatProjectStore.getState().project.layers.some((layer) => (
      layer.type === 'charge' && layer.assetId === 'symbol-charge-1' && layer.rasterVariantId === 'a'
    ))).toBe(true);
  });

  it('adds the exact selected WebP symbol variant', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<TargetTokenPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Symbols' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tokens' }), { target: { value: 'sun emblem' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Sun emblem — B token' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'symbol-charge-1',
      rasterVariantId: 'b',
    });
  });
});
