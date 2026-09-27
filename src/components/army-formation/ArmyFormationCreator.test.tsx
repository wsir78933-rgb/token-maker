// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ArmyFormationCreator } from '@/components/army-formation/ArmyFormationCreator';
import { ARMY_FORMATION_DOCUMENT_STORAGE_KEY } from '@/lib/army-formation/browser-saves';
import {
  addArmyFormationPiece,
  createEmptyArmyFormationDocument,
  serializeArmyFormationDocument,
} from '@/lib/army-formation/document';

function pieceButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll('[data-army-piece]')].map((piece) => {
    if (!(piece instanceof HTMLButtonElement)) {
      throw new Error(`Army piece button is missing. Received ${piece.constructor.name}.`);
    }

    return piece;
  });
}

function piecePosition(piece: HTMLButtonElement): string {
  const x = piece.getAttribute('data-piece-x');
  const y = piece.getAttribute('data-piece-y');
  if (x === null || y === null) {
    throw new Error(`Army piece is missing a position. x=${String(x)} y=${String(y)}.`);
  }

  return `${x},${y}`;
}

function chooseArmyFormationFile(file: File) {
  const input = screen.getByLabelText('选择文件');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Army formation file input is missing. Received ${input.constructor.name}.`);
  }

  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  });
  fireEvent.change(input);
}

describe('ArmyFormationCreator', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('英文产品名是 Army formation creator', () => {
    render(<ArmyFormationCreator locale="en" />);

    expect(screen.getByRole('region', { name: 'Army formation creator' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Helmets' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save battlefield 1' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Editor' })).toBeNull();
  });

  it('点一个图标后战场出现棋子，再点一个不会叠在同一个位置', () => {
    render(<ArmyFormationCreator locale="zh" />);

    const helmet = screen.getByRole('button', { name: /^helmet-01$/ });
    fireEvent.click(helmet);
    expect(pieceButtons()).toHaveLength(1);
    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('0,0');

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));

    const pieces = pieceButtons();
    expect(pieces).toHaveLength(2);
    expect(pieces.map(piecePosition)).toEqual(['0,0', '50,0']);
  });

  it('不把线框说明和读取按钮做进页面', () => {
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByText('点一个图标，新棋子落到空位')).toBeNull();
    expect(screen.queryByText('换成头盔图标')).toBeNull();
    expect(screen.queryByRole('button', { name: '读取' })).toBeNull();
    expect(screen.queryByRole('button', { name: '读取文件' })).toBeNull();
    expect(screen.queryByRole('button', { name: '变成图片' })).toBeNull();
    expect(screen.getByText('空位')).toBeTruthy();
  });

  it('左右箭头在 4 场之间绕回，棋子留在自己的场', () => {
    render(<ArmyFormationCreator locale="zh" />);

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    expect(pieceButtons()).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(screen.getByRole('button', { name: '保存战场 2' })).toBeTruthy();
    expect(pieceButtons()).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(screen.getByRole('button', { name: '保存战场 3' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(screen.getByRole('button', { name: '保存战场 4' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(screen.getByRole('button', { name: '保存战场 1' })).toBeTruthy();
    expect(pieceButtons()).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: '切换到上一场' }));
    expect(screen.getByRole('button', { name: '保存战场 4' })).toBeTruthy();
  });

  it('点棋子选中再点取消，删除和旋转只动选中的，清空只清棋子', () => {
    render(<ArmyFormationCreator locale="zh" />);

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    const firstPiece = () => pieceButtons()[0] as HTMLButtonElement;
    const secondPiece = () => pieceButtons()[1] as HTMLButtonElement;

    fireEvent.click(firstPiece());
    expect(firstPiece().getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(firstPiece());
    expect(firstPiece().getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(firstPiece());
    fireEvent.change(screen.getByLabelText('角度'), { target: { value: '90' } });
    fireEvent.click(screen.getByRole('button', { name: '旋转所选' }));
    expect(firstPiece().getAttribute('data-rotation-degrees')).toBe('90');
    expect(secondPiece().getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.click(screen.getByRole('button', { name: '删除所选' }));
    expect(pieceButtons()).toHaveLength(1);
    expect(pieceButtons()[0]?.getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.change(screen.getByLabelText('高度'), { target: { value: '600' } });
    fireEvent.click(screen.getByRole('button', { name: '改变高度' }));
    fireEvent.click(screen.getByRole('button', { name: /^helmet-02$/ }));
    fireEvent.click(screen.getByRole('button', { name: '清空战场' }));

    expect(pieceButtons()).toHaveLength(0);
    expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('600');
  });

  it('拖动棋子后位置按格子移动', () => {
    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));

    const piece = pieceButtons()[0] as HTMLButtonElement;
    fireEvent.pointerDown(piece, { pointerId: 1, clientX: 0, clientY: 0, button: 0 });
    fireEvent.pointerMove(piece, { pointerId: 1, clientX: 40, clientY: 20, button: 0 });
    fireEvent.pointerUp(piece, { pointerId: 1, clientX: 40, clientY: 20, button: 0 });

    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('40,20');
  });

  it('选择文件后直接打开，坏文件会把原字符串显示出来', async () => {
    const loaded = addArmyFormationPiece(
      createEmptyArmyFormationDocument(),
      'helmet-01',
      'piece-from-file',
      780,
    );
    render(<ArmyFormationCreator locale="zh" />);

    chooseArmyFormationFile(
      new File([serializeArmyFormationDocument(loaded)], 'formation.txt', { type: 'text/plain' }),
    );

    expect(await screen.findByRole('button', { name: 'piece-from-file' })).toBeTruthy();
    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('0,0');

    chooseArmyFormationFile(new File(['not-json-at-all'], 'broken.txt', { type: 'text/plain' }));

    expect((await screen.findByRole('alert')).textContent).toContain('not-json-at-all');
  });

  it('保存在这个浏览器后，重新打开还能看到棋子', () => {
    const first = render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    fireEvent.click(screen.getByRole('button', { name: '保存战场 1' }));
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');

    first.unmount();
    render(<ArmyFormationCreator locale="zh" />);

    expect(pieceButtons()).toHaveLength(1);
    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('0,0');
  });

  it('坏的浏览器存档会抛到页面上并带上原字符串', () => {
    const raw = 'broken-army-formation-save';
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, raw);

    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.getByRole('alert').textContent).toContain(raw);
    expect(pieceButtons()).toHaveLength(0);
  });

  it('导出图片直接下载，页面上不留下图片预览', () => {
    const createObjectURL = vi.fn(() => 'blob:army-formation');
    const revokeObjectURL = vi.fn();
    vi.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURL);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURL);
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '导出图片' }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0]?.[0];
    expect(blob).toBeInstanceOf(Blob);
    expect(document.querySelector('svg[aria-label="Army formation creator"]')).toBeNull();
    expect(screen.queryByRole('img', { name: 'Army formation creator' })).toBeNull();
  });
});
