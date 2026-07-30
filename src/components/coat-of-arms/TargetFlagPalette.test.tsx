// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TargetFlagPalette } from './TargetFlagPalette';
import { getCoatWorkbenchCopy } from './workbench-copy';

describe('TargetFlagPalette', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
  });

  it('applies the local Nordic cross preset to the project shield field', () => {
    render(<TargetFlagPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Nordic cross flag preset' }));

    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected project shield layer');
    expect(shield.field).toEqual({
      division: 'solid',
      colors: ['#005293'],
      pattern: 'solid',
      ornaments: [{
        id: 'flag-nordic-cross',
        kind: 'cross',
        color: '#F7C900',
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        crossHorizontalThickness: 14,
        crossVerticalThickness: 14,
        crossCenterX: 35,
        crossCenterY: 55,
      }],
    });
  });

  it('shows a visible command error when the shield is locked', () => {
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield) throw new Error('Expected project shield layer');
    useCoatProjectStore.getState().dispatch({ type: 'set-layer-lock', layerId: shield.id, locked: true });
    render(<TargetFlagPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Nordic cross flag preset' }));

    expect(screen.getByRole('alert').textContent).toMatch(/locked/i);
  });

  it('uses the centralized Chinese Nordic-cross name for its visible and aria label', () => {
    const copy = getCoatWorkbenchCopy('zh').palettes.flag;
    render(<TargetFlagPalette locale="zh" />);

    expect(copy.presetName('nordic-cross')).toBe('北欧十字旗');
    expect(screen.getByRole('button', { name: '使用北欧十字旗预设' })).toBeTruthy();
    expect(() => copy.presetName('invalid-flag')).toThrow('Unknown flag preset: invalid-flag');
  });

  it('filters the local flag library by category and search term before applying a preset', () => {
    render(<TargetFlagPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Cross flags' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search flags' }), { target: { value: 'nordic' } });
    fireEvent.click(screen.getByRole('button', { name: 'Use Nordic cross flag preset' }));

    expect(screen.getByRole('button', { name: 'Cross flags' }).getAttribute('aria-pressed')).toBe('true');
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected project shield layer');
    expect(shield.field?.ornaments?.[0]?.id).toBe('flag-nordic-cross');
  });
});
