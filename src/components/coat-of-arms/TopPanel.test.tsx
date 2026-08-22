// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TopPanel } from './TopPanel';

describe('TopPanel', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(cleanup);

  it('filters and adds a local WebP crown', () => {
    render(<TopPanel locale="en" selectedCategory="crown" />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search top ornaments' }), { target: { value: 'papal' } });
    const crownCard = screen.getByRole('button', { name: 'Add top ornament: Papal Crown' });
    expect(crownCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/crowns/papal-crown.webp');
    fireEvent.click(crownCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'material-crown-papal-crown',
    });
  });

  it('uses a tree-controlled category without duplicate filters', () => {
    render(<TopPanel locale="en" selectedCategory="mantle" />);

    expect(screen.queryByLabelText('Top category')).toBeNull();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search top ornaments' }), { target: { value: 'astrakhan' } });
    expect(screen.getByRole('button', { name: 'Add top ornament: Astrakhan Mantle' }).querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/mantles/astrakhan-mantle.webp');
  });

  it('adds an other WebP ornament', () => {
    render(<TopPanel locale="en" selectedCategory="other" />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search top ornaments' }), { target: { value: 'bascinet' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Bascinet Helm' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'material-other-bascinet-helm',
    });
  });
});

