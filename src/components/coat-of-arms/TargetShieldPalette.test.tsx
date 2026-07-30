// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TargetShieldPalette } from './TargetShieldPalette';

describe('TargetShieldPalette', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
  });

  it('uses document-unique SVG clip paths when more than one palette is mounted', () => {
    render(<><TargetShieldPalette locale="en" /><TargetShieldPalette locale="en" /></>);

    const clipPathIds = [...document.querySelectorAll('clipPath')].map((clipPath) => clipPath.id);
    expect(new Set(clipPathIds).size).toBe(clipPathIds.length);
  });

  it('restores a complete shield card selection with one undo', () => {
    render(<TargetShieldPalette locale="en" />);
    const shieldBeforeSelection = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');

    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Barrel heater shield' }));
    useCoatProjectStore.getState().undo();

    const shieldAfterUndo = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    expect(shieldAfterUndo).toEqual(shieldBeforeSelection);
  });

  it('shows a visible command error when the shield is locked', () => {
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected project shield layer');
    useCoatProjectStore.getState().dispatch({ type: 'set-layer-lock', layerId: shield.id, locked: true });
    render(<TargetShieldPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Barrel heater shield' }));

    expect(screen.getByRole('alert').textContent).toMatch(/locked/i);
  });

  it('uses localized shield-card labels in Chinese', () => {
    render(<TargetShieldPalette locale="zh" />);

    expect(screen.getByRole('button', { name: '选择盾形：桶形熨斗盾' })).toBeTruthy();
  });

  it('uses a natural English shield-card name instead of the internal slug', () => {
    render(<TargetShieldPalette locale="en" />);

    expect(screen.getByRole('button', { name: 'Select shield: Barrel heater shield' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Select shield: heater-shield-2' })).toBeNull();
  });

  it('finds a semantic kite shield by English and Chinese name, then applies its preserved outline and field', () => {
    render(<TargetShieldPalette activeCategory="shield" locale="en" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search shields' });
    fireEvent.change(searchbox, { target: { value: 'norman' } });
    expect(screen.getByRole('button', { name: 'Select shield: Norman kite shield' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '诺曼' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Norman kite shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'heraldic-shield-1',
      field: {
        division: 'solid',
        colors: ['#F7C900'],
        pattern: 'solid',
      },
    });
  });

  it('finds a semantic heater shield by English and Chinese name, then applies its preserved outline and field', () => {
    render(<TargetShieldPalette locale="en" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search shields' });
    fireEvent.change(searchbox, { target: { value: 'barrel' } });
    expect(screen.getByRole('button', { name: 'Select shield: Barrel heater shield' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '桶' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Barrel heater shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'heater-shield-2',
      field: {
        division: 'per-pale',
        colors: ['#C7202B', '#F7C900'],
        pattern: 'solid',
      },
    });
  });

  it('finds a semantic French shield by English and Chinese name, then applies its preserved outline and field', () => {
    render(<TargetShieldPalette activeCategory="french" locale="en" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search shields' });
    fireEvent.change(searchbox, { target: { value: 'bourbon' } });
    expect(screen.getByRole('button', { name: 'Select shield: Bourbon French shield' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '波旁' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Bourbon French shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'french-shield-1',
      field: {
        division: 'solid',
        colors: ['#F7C900'],
        pattern: 'solid',
      },
    });
  });

  it('finds a semantic Banner shield by English and Chinese name, then applies its preserved outline and field', () => {
    render(<TargetShieldPalette activeCategory="banner" locale="en" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search shields' });
    fireEvent.change(searchbox, { target: { value: 'pennon' } });
    expect(screen.getByRole('button', { name: 'Select shield: Pennon banner shield' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '三角旗' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Pennon banner shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'banner-shield-1',
      field: {
        division: 'solid',
        colors: ['#F7C900'],
        pattern: 'solid',
      },
    });
  });

  it('finds a semantic Round shield by English and Chinese name, then applies its preserved outline and field', () => {
    render(<TargetShieldPalette activeCategory="round" locale="en" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search shields' });
    fireEvent.change(searchbox, { target: { value: 'medallion' } });
    expect(screen.getByRole('button', { name: 'Select shield: Medallion round shield' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '勋章' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Medallion round shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'round-shield-1',
      field: {
        division: 'solid',
        colors: ['#F7C900'],
        pattern: 'solid',
      },
    });
  });

  it('finds a semantic Lozenge shield by English and Chinese name, then applies its preserved outline and field', () => {
    render(<TargetShieldPalette activeCategory="lozenge" locale="en" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search shields' });
    fireEvent.change(searchbox, { target: { value: 'diamond' } });
    expect(screen.getByRole('button', { name: 'Select shield: Diamond lozenge shield' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '钻形' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Diamond lozenge shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'lozenge-shield-1',
      field: {
        division: 'solid',
        colors: ['#F7C900'],
        pattern: 'solid',
      },
    });
  });

  it('uses the compact tree-controlled shield gallery without duplicate category chips', () => {
    render(<TargetShieldPalette locale="en" />);

    expect(screen.queryByRole('group', { name: 'Shield categories' })).toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery--compact')).not.toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery__grid--compact')).not.toBeNull();
  });

  it('selects the pointed local shield from the reference gallery', () => {
    render(<TargetShieldPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Pointed heraldic shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'pointed-heraldic-shield',
    });
  });

  it('applies the selected gallery card field together with its shield outline', () => {
    render(<TargetShieldPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Select shield: Barrel heater shield' }));

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'heater-shield-2',
      field: {
        division: 'per-pale',
        colors: ['#C7202B', '#F7C900'],
        pattern: 'solid',
      },
    });
  });

  it('clears a shield-card selection when undo restores an outline outside the gallery', () => {
    render(<TargetShieldPalette locale="en" />);
    const selectedCard = screen.getByRole('button', { name: 'Select shield: Scalloped Broad heater shield' });

    fireEvent.click(selectedCard);
    expect(selectedCard.getAttribute('aria-pressed')).toBe('true');

    act(() => useCoatProjectStore.getState().undo());

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield')).toMatchObject({
      assetId: 'heater-shield',
    });
    expect(selectedCard.getAttribute('aria-pressed')).toBe('false');
  });
});
