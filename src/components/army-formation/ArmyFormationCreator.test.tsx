// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

function requireHeading(name: string): HTMLElement {
  const heading = [...document.querySelectorAll('h2')].find((node) => node.textContent === name);
  if (!(heading instanceof HTMLElement)) {
    throw new Error(`Army formation heading is missing. Received ${JSON.stringify(name)}.`);
  }

  return heading;
}

function controlGroup(title: string): HTMLElement {
  const group = requireHeading(title).parentElement;
  if (!(group instanceof HTMLElement) || group.tagName !== 'SECTION') {
    const received = group === null ? 'null' : group.tagName;
    throw new Error(
      `Army formation control group is missing. Received ${received} for ${JSON.stringify(title)}.`,
    );
  }

  return group;
}

function expectButtonFollowsHeading(buttonName: string, headingName: string): HTMLElement {
  const button = screen.getByRole('button', { name: buttonName });
  const heading = requireHeading(headingName);
  const buttonFollowsHeading = heading.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING;
  expect(buttonFollowsHeading).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  return button;
}

function storeArmyFormationHelmet(pieceId: string) {
  const armyDocument = addArmyFormationPiece(
    createEmptyArmyFormationDocument(),
    'helmet-01',
    pieceId,
    780,
  );
  localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, serializeArmyFormationDocument(armyDocument));
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
    expect(screen.queryByRole('button', { name: 'Save battlefield 1' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Save in this browser' })).toBeNull();
    expect(screen.queryByRole('navigation', { name: 'Editor' })).toBeNull();
  });

  it('页面上没有保存战场，也没有保存在这个浏览器', () => {
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByText('保存在这个浏览器')).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 1' })).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 2' })).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 3' })).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 4' })).toBeNull();
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
    expect(screen.getByRole('heading', { name: '战场', exact: true })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /战场 \d/ })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(pieceButtons()).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(pieceButtons()).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(pieceButtons()).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(pieceButtons()).toHaveLength(1);
    expect(screen.getByRole('heading', { name: '战场', exact: true })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '切换到上一场' }));
    expect(pieceButtons()).toHaveLength(0);
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
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('piece-from-file');

    chooseArmyFormationFile(new File(['not-json-at-all'], 'broken.txt', { type: 'text/plain' }));

    expect((await screen.findByRole('alert')).textContent).toContain('not-json-at-all');
  });

  it('不点保存按钮，摆上 helmet-01 后记录里就有这枚棋子', () => {
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));

    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');
  });

  it('有上次记录时先询问，回到上次后棋子出现且记录还在', () => {
    storeArmyFormationHelmet('piece-from-record');
    render(<ArmyFormationCreator locale="zh" />);

    expect(pieceButtons()).toHaveLength(0);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('发现上次的记录。要回到上次的记录吗？')).toBeTruthy();
    expect(screen.getByRole('button', { name: '回到上次' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '从空白开始' })).toBeTruthy();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');

    fireEvent.click(screen.getByRole('button', { name: '回到上次' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(pieceButtons()).toHaveLength(1);
    expect(pieceButtons()[0]?.getAttribute('aria-label')).toBe('piece-from-record');
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');
  });

  it('从空白开始会立刻删掉旧记录，再次打开不再询问', () => {
    storeArmyFormationHelmet('piece-from-record');
    const first = render(<ArmyFormationCreator locale="zh" />);

    expect(pieceButtons()).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: '从空白开始' }));

    expect(pieceButtons()).toHaveLength(0);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();

    first.unmount();
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByText('发现上次的记录。要回到上次的记录吗？')).toBeNull();
    expect(screen.queryByRole('button', { name: '回到上次' })).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(pieceButtons()).toHaveLength(0);
  });

  it('空白记录不是可恢复记录，读到后会删掉钥匙', () => {
    localStorage.setItem(
      ARMY_FORMATION_DOCUMENT_STORAGE_KEY,
      serializeArmyFormationDocument(createEmptyArmyFormationDocument()),
    );
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(pieceButtons()).toHaveLength(0);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();
  });

  it('英文询问显示上次记录的三句文案', () => {
    storeArmyFormationHelmet('piece-from-record');
    render(<ArmyFormationCreator locale="en" />);

    expect(pieceButtons()).toHaveLength(0);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('A previous record was found. Restore it?')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Restore' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start blank' })).toBeTruthy();
  });

  it('坏的浏览器存档会抛到页面上并带上原字符串', () => {
    const raw = 'broken-army-formation-save';
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, raw);

    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.getByRole('alert').textContent).toContain(raw);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('发现上次的记录。要回到上次的记录吗？')).toBeNull();
    expect(pieceButtons()).toHaveLength(0);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(raw);
  });

  it('导出图片直接下载，页面上不留下图片预览', async () => {
    const createObjectURL = vi.fn(() => 'blob:army-formation');
    const revokeObjectURL = vi.fn();
    vi.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURL);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURL);
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '导出图片' }));

    await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(1));
    const blob = createObjectURL.mock.calls[0]?.[0];
    expect(blob).toBeInstanceOf(Blob);
    expect(document.querySelector('svg[aria-label="Army formation creator"]')).toBeNull();
    expect(screen.queryByRole('img', { name: 'Army formation creator' })).toBeNull();
  });

  it('导出文件、导出图片、选择文件在战场标题后面，并且不在改战场那一组里', () => {
    render(<ArmyFormationCreator locale="zh" />);
    for (const label of ['导出文件', '导出图片', '选择文件']) {
      const button = expectButtonFollowsHeading(label, '战场');
      expect(controlGroup('改战场').contains(button)).toBe(false);
    }

    cleanup();
    render(<ArmyFormationCreator locale="en" />);
    for (const label of ['Export file', 'Export image', 'Choose file']) {
      const button = expectButtonFollowsHeading(label, 'Battlefield');
      expect(controlGroup('Change battlefield').contains(button)).toBe(false);
    }
  });
});
