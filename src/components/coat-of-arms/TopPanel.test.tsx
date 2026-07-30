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

  afterEach(() => {
    cleanup();
  });

  it('finds a semantic crown by English and Chinese name, then adds its preserved catalog asset id', () => {
    render(<TopPanel locale="en" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search top ornaments' });
    fireEvent.change(searchbox, { target: { value: 'imperial' } });
    expect(screen.getByRole('button', { name: 'Add top ornament: Imperial crown' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '帝' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Imperial crown' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'crown-exterior-1',
    });
  });

  it('keeps its standalone category selector functional outside the tool tree', () => {
    render(<TopPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Top category'), { target: { value: 'mantle' } });

    expect(screen.getByRole('button', { name: 'Add top ornament: Regal mantle' })).toBeDefined();
  });

  it('uses a tree-controlled top category without rendering duplicate panel filters', () => {
    render(<TopPanel locale="en" selectedCategory="mantle" />);

    expect(screen.queryByLabelText('Top category')).toBeNull();
    expect(screen.queryByRole('group', { name: 'Top ornament categories' })).toBeNull();
    const searchbox = screen.getByRole('searchbox', { name: 'Search top ornaments' });
    fireEvent.change(searchbox, { target: { value: 'regal' } });
    expect(screen.getByRole('button', { name: 'Add top ornament: Regal mantle' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '王' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Regal mantle' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'mantle-exterior-1',
    });
  });

  it('finds a semantic supporter by English and Chinese name, then adds its preserved catalog asset id', () => {
    render(<TopPanel locale="en" selectedCategory="supporter" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search top ornaments' });
    fireEvent.change(searchbox, { target: { value: 'stag' } });
    expect(screen.getByRole('button', { name: 'Add top ornament: Stag supporters' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '鹿' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Stag supporters' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'supporter-exterior-1',
    });
  });

  it('finds a semantic exterior by English and Chinese name, then adds its preserved catalog asset id', () => {
    render(<TopPanel locale="en" selectedCategory="other" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search top ornaments' });
    fireEvent.change(searchbox, { target: { value: 'tournament' } });
    expect(screen.getByRole('button', { name: 'Add top ornament: Tournament helm — A' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '盔' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Tournament helm — A' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'other-exterior-1',
      rasterVariantId: 'a',
    });
  });

  it('adds the exact selected WebP other-ornament variant', () => {
    render(<TopPanel locale="en" selectedCategory="other" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search top ornaments' });
    fireEvent.change(searchbox, { target: { value: 'tournament' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Tournament helm — B' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'other-exterior-1',
      rasterVariantId: 'b',
    });
  });

  it('renders original and catalog top ornaments in one searchable thumbnail library', () => {
    render(<TopPanel locale="en" selectedCategory="crown" />);

    expect(screen.getAllByRole('list', { name: 'Top ornament library' })).toHaveLength(1);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search top ornaments' }), { target: { value: 'royal' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add top ornament: Royal crown' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'top',
      assetId: 'royal-crown',
    });
  });
});
