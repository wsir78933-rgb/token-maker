// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ARMOR_PREVIEW_HEIGHT, ARMOR_PREVIEW_WIDTH } from '@/lib/armor-creator/catalog';
import { writeArmorSaveSlot } from '@/lib/armor-creator/saves';
import { type ArmorSelection } from '@/lib/armor-creator/selection';
import { ArmorCreatorWorkbench } from '@/components/armor-creator/ArmorCreatorWorkbench';

describe('ArmorCreatorWorkbench', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('初始能看到预览和男性', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    expect(screen.getByRole('heading', { name: '预览' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '男' })).toBeTruthy();
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.width).toBe(ARMOR_PREVIEW_WIDTH);
    expect(canvas?.height).toBe(ARMOR_PREVIEW_HEIGHT);
  });

  it('点第一件头盔后该按钮为选中', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const firstHelm = screen.getByRole('button', { name: '头盔 1' });
    expect(firstHelm.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(firstHelm);

    expect(screen.getByRole('button', { name: '头盔 1' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('男性时胸甲曲线是 disabled', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const chestCurve = screen.getByRole('button', { name: '胸甲曲线' }) as HTMLButtonElement;
    expect(chestCurve.disabled).toBe(true);
  });

  it('空的读取 2 是 disabled', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const loadTwo = screen.getByRole('button', { name: '读取 2' }) as HTMLButtonElement;
    expect(loadTwo.disabled).toBe(true);
  });

  it('读取时装备不是对象，提示里带上原值', () => {
    const snapshot = {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: ['nope'],
    } as unknown as ArmorSelection;

    writeArmorSaveSlot(localStorage, 1, {
      snapshot,
      thumbnailDataUrl: 'data:image/png;base64,AAAA',
    });

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '读取 1' }));

    expect(screen.getByRole('alert').textContent).toBe(
      'Armor save slot 1 equipped pieces must be an object. Received ["nope"].',
    );
  });
});
