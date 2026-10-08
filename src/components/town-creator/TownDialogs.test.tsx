// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTownDocument } from '@/lib/town-creator/document';
import { serializeTownDocument } from '@/lib/town-creator/storage';

import { TownExportDialog } from './TownExportDialog';
import { TownHelpDialog } from './TownHelpDialog';
import { TownSaveDialog } from './TownSaveDialog';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const buildTownPngMock = vi.hoisted(() => vi.fn());

vi.mock('@/lib/town-creator/export-image', () => ({
  buildTownPng: buildTownPngMock,
}));

function installObjectUrlApi(): { revoked: string[] } {
  const revoked: string[] = [];
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: vi.fn(() => 'blob:town-dialog'),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: vi.fn((value: string) => revoked.push(value)),
  });
  return { revoked };
}

describe('TownSaveDialog', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('shows five slots, disables empty loads, requires overwrite confirmation, and reports a real save', async () => {
    const document = createTownDocument();
    render(<TownSaveDialog locale="zh" document={document} onClose={vi.fn()} onLoadDocument={vi.fn()} />);

    expect(screen.getByRole('button', { name: '关闭' }).textContent).toContain('关闭');
    await waitFor(() => expect(screen.getAllByRole('button', { name: /加载/ })).toHaveLength(5));
    expect(screen.getAllByRole('button', { name: /加载/ }).every((button) => (button as HTMLButtonElement).disabled)).toBe(true);

    const saveButtons = screen.getAllByRole('button', { name: /保存/ });
    fireEvent.click(saveButtons[0]!);
    expect((await screen.findByRole('status')).textContent).toContain('已保存');
    expect((screen.getAllByRole('button', { name: /加载/ })[0] as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(saveButtons[0]!);
    expect((await screen.findByRole('alertdialog')).textContent).toContain('替换');
    fireEvent.click(screen.getByRole('button', { name: /确认替换/ }));
    expect((await screen.findByRole('status')).textContent).toContain('已保存');
  });

  it('imports a valid UTF-8 project through the public parser and leaves the callback untouched on invalid input', async () => {
    const document = createTownDocument();
    const onLoadDocument = vi.fn();
    render(<TownSaveDialog locale="en" document={document} onClose={vi.fn()} onLoadDocument={onLoadDocument} />);
    const input = screen.getByLabelText('Choose a town project text file');

    fireEvent.change(input, {
      target: { files: [new File([serializeTownDocument(document)], 'town-project.txt', { type: 'text/plain' })] },
    });
    await waitFor(() => expect(onLoadDocument).toHaveBeenCalledWith(document));

    fireEvent.change(input, {
      target: { files: [new File(['{"version":2}'], 'legacy.txt', { type: 'text/plain' })] },
    });
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('could not be accepted'));
    expect(onLoadDocument).toHaveBeenCalledTimes(1);
  });
});

describe('TownExportDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows output dimensions, preview, retry, PNG download, and editor return actions', async () => {
    const objectUrlApi = installObjectUrlApi();
    const pngBlob = new Blob(['png'], { type: 'image/png' });
    buildTownPngMock.mockResolvedValue(pngBlob);
    const onClose = vi.fn();
    render(<TownExportDialog locale="zh" document={createTownDocument()} onClose={onClose} />);

    expect(await screen.findByAltText(/导出城镇 PNG/)).toBeTruthy();
    expect(screen.getByRole('button', { name: '关闭' }).textContent).toContain('关闭');
    expect(screen.getByText(/1200 × 800/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /重新生成/ }));
    await waitFor(() => expect(buildTownPngMock).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByRole('button', { name: /下载 PNG/ }));
    fireEvent.click(screen.getByRole('button', { name: /回到编辑器/ }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(objectUrlApi.revoked.length).toBeGreaterThan(0);
  });

  it('clears a previous preview when a retry fails', async () => {
    installObjectUrlApi();
    buildTownPngMock.mockResolvedValueOnce(new Blob(['png'], { type: 'image/png' }));
    buildTownPngMock.mockRejectedValueOnce(new Error('background URL failed'));
    render(<TownExportDialog locale="en" document={createTownDocument()} onClose={vi.fn()} />);

    expect(await screen.findByAltText(/Export town PNG/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Regenerate preview/ }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('background URL failed'));
    expect(screen.queryByAltText(/Export town PNG/)).toBeNull();
  });
});

describe('TownHelpDialog', () => {
  it('documents editing, layers, five slots, text files, PNG export, and stable coordinates', () => {
    const onClose = vi.fn();
    render(<TownHelpDialog locale="zh" onClose={onClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toContain('拖动与缩放');
    expect(dialog.textContent).toContain('对象重叠时，点击选中最上方的可见对象。');
    expect(dialog.textContent).toContain('点击可见对象会自动把编辑图层切换到该对象所在图层。');
    expect(dialog.textContent).toContain('Delete 或 Backspace 删除选中对象，正在输入时不会触发。');
    expect(dialog.textContent).toContain('5 个浏览器本地存档位');
    expect(dialog.textContent).toContain('坐标保持稳定');
    expect(screen.getByRole('button', { name: '关闭' }).textContent).toContain('关闭');
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('documents the same overlap, layer-switch, and delete-shortcut hints in English', () => {
    render(<TownHelpDialog locale="en" onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toContain('Move and scale');
    expect(dialog.textContent).toContain('When objects overlap, the click selects the topmost visible object.');
    expect(dialog.textContent).toContain('Clicking a visible object switches the editing layer to the layer that contains it.');
    expect(dialog.textContent).toContain('Delete or Backspace removes the selected object, and does not run while typing.');
    expect(dialog.textContent).toContain('Layers and background');
  });
});
