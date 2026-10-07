// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FamilyTreeWorkbench } from '@/components/family-tree/FamilyTreeWorkbench';
import { FAMILY_TREE_SAVE_STORAGE_KEY } from '@/lib/family-tree/saves';
import { parseFamilyTreeDocument } from '@/lib/family-tree/document';
import { downloadFamilyTreeBlob, renderFamilyTreePng } from '@/lib/family-tree/export';

vi.mock('@/lib/family-tree/export', () => ({ downloadFamilyTreeBlob: vi.fn(), renderFamilyTreePng: vi.fn().mockResolvedValue(new Blob(['png'], { type: 'image/png' })) }));

const decodePreviewImage = vi.fn<() => Promise<void>>();

beforeEach(() => {
  window.localStorage.removeItem(FAMILY_TREE_SAVE_STORAGE_KEY);
  vi.mocked(renderFamilyTreePng).mockReset().mockResolvedValue(new Blob(['png'], { type: 'image/png' }));
  decodePreviewImage.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal('Image', vi.fn(function () { return { src: '', decode: decodePreviewImage }; }));
});
afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); });

function addNamedPerson(name: string) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } });
  fireEvent.change(screen.getByLabelText('Age'), { target: { value: 'unknown / 120+' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add person' }));
}

describe('family tree workbench', () => {
  it('updates a selected person immediately and repeats the current draft without autosaving', () => {
    render(<FamilyTreeWorkbench locale="en" />);
    addNamedPerson('Aster');
    fireEvent.click(screen.getByRole('button', { name: 'Aster' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Aster Vale' } });
    expect(screen.getByRole('button', { name: 'Aster Vale' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Random avatar' }));
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Aster Vale');
    expect((screen.getByLabelText('Age') as HTMLInputElement).value).toBe('unknown / 120+');
    fireEvent.click(screen.getByRole('button', { name: 'Add person' }));
    expect(screen.getAllByRole('button', { name: 'Aster Vale' })).toHaveLength(2);
    expect(window.localStorage.getItem(FAMILY_TREE_SAVE_STORAGE_KEY)).toBeNull();
  });

  it('saves and restores the fifth slot, including text and positions, and downloads a reloadable file', () => {
    render(<FamilyTreeWorkbench locale="en" />);
    addNamedPerson('Aster');
    fireEvent.click(screen.getByRole('button', { name: 'Save and load' }));
    const fifth = document.querySelector('[data-family-tree-save-slot="5"]')! as HTMLElement;
    fireEvent.click(within(fifth).getByRole('button', { name: 'Save' }));
    expect(within(fifth).getByText('Saved')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aster' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Changed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save and load' }));
    fireEvent.click(within(document.querySelector('[data-family-tree-save-slot="5"]')! as HTMLElement).getByRole('button', { name: 'Load' }));
    expect(screen.getByRole('button', { name: 'Aster' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Save family tree file' }));
    expect(downloadFamilyTreeBlob).toHaveBeenCalledWith(expect.any(Blob), 'familyTree.txt');
    const stored = JSON.parse(window.localStorage.getItem(FAMILY_TREE_SAVE_STORAGE_KEY)!);
    expect(parseFamilyTreeDocument(JSON.stringify(stored[4])).scene.generations[1][0].age).toBe('unknown / 120+');
  });

  it('clears an earlier image if regenerating the changed canvas fails', async () => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:family-tree-test'), revokeObjectURL: vi.fn() });
    render(<FamilyTreeWorkbench locale="en" />);
    addNamedPerson('Aster');
    fireEvent.click(screen.getByRole('button', { name: 'Generate image' }));
    await screen.findByRole('img', { name: 'Family tree image preview' });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aster' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Changed Aster' } });
    vi.mocked(renderFamilyTreePng).mockRejectedValueOnce(new Error('head999.png failed'));
    fireEvent.click(screen.getByRole('button', { name: 'Generate image' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('head999.png'));
    expect(screen.queryByRole('img', { name: 'Family tree image preview' })).toBeNull();
    expect((screen.getByRole('button', { name: 'Save image' }) as HTMLButtonElement).disabled).toBe(true);
    expect(downloadFamilyTreeBlob).not.toHaveBeenCalled();
  });

  it('keeps the previous preview until the selected background PNG has been rendered and decoded', async () => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValueOnce('blob:transparent').mockReturnValueOnce('blob:white').mockReturnValueOnce('blob:transparent-again'),
      revokeObjectURL: vi.fn(),
    });
    const transparentPng = new Blob(['transparent'], { type: 'image/png' });
    const whitePng = new Blob(['white'], { type: 'image/png' });
    const nextTransparentPng = new Blob(['transparent-again'], { type: 'image/png' });
    let finishWhitePreview!: (blob: Blob) => void;
    let finishWhiteDecoding!: () => void;
    decodePreviewImage
      .mockResolvedValueOnce(undefined)
      .mockImplementationOnce(() => new Promise<void>((resolve) => { finishWhiteDecoding = resolve; }));
    vi.mocked(renderFamilyTreePng)
      .mockResolvedValueOnce(transparentPng)
      .mockImplementationOnce(() => new Promise<Blob>((resolve) => { finishWhitePreview = resolve; }))
      .mockResolvedValueOnce(nextTransparentPng);
    render(<FamilyTreeWorkbench locale="en" />);
    addNamedPerson('Aster');
    fireEvent.click(screen.getByRole('button', { name: 'Generate image' }));
    await screen.findByRole('img', { name: 'Family tree image preview' });
    const whiteBackgroundButton = screen.getByRole('button', { name: 'White background' }) as HTMLButtonElement;
    const transparentBackgroundButton = screen.getByRole('button', { name: 'Transparent background' }) as HTMLButtonElement;
    expect(transparentBackgroundButton.getAttribute('aria-pressed')).toBe('true');
    expect(whiteBackgroundButton.getAttribute('aria-pressed')).toBe('false');
    expect(vi.mocked(renderFamilyTreePng).mock.calls[0][2]).toBe(false);
    fireEvent.click(transparentBackgroundButton);
    expect(renderFamilyTreePng).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Save image' }));
    expect(downloadFamilyTreeBlob).toHaveBeenLastCalledWith(transparentPng, 'familyTree.png');

    fireEvent.click(whiteBackgroundButton);
    expect(whiteBackgroundButton.getAttribute('aria-pressed')).toBe('true');
    expect(transparentBackgroundButton.getAttribute('aria-pressed')).toBe('false');
    expect(whiteBackgroundButton.disabled).toBe(true);
    expect(transparentBackgroundButton.disabled).toBe(true);
    const originalPreview = screen.getByRole('img', { name: 'Family tree image preview' });
    expect(originalPreview.getAttribute('src')).toBe('blob:transparent');
    expect(originalPreview.parentElement?.getAttribute('data-preview-background')).toBe('transparent');
    expect((screen.getByRole('button', { name: 'Save image' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Save image' }));
    expect(downloadFamilyTreeBlob).toHaveBeenCalledTimes(1);
    expect(vi.mocked(renderFamilyTreePng).mock.calls[1][2]).toBe(true);
    await act(async () => { finishWhitePreview(whitePng); });
    expect(decodePreviewImage).toHaveBeenCalledTimes(2);
    expect(originalPreview.getAttribute('src')).toBe('blob:transparent');
    expect(whiteBackgroundButton.disabled).toBe(true);
    expect(URL.revokeObjectURL).not.toHaveBeenCalledWith('blob:transparent');
    fireEvent.click(screen.getByRole('button', { name: 'Save image' }));
    expect(downloadFamilyTreeBlob).toHaveBeenCalledTimes(1);
    await act(async () => { finishWhiteDecoding(); });
    expect(screen.getByRole('img', { name: 'Family tree image preview' })).toBe(originalPreview);
    expect(screen.getByRole('img', { name: 'Family tree image preview' }).getAttribute('src')).toBe('blob:white');
    expect(originalPreview.parentElement?.getAttribute('data-preview-background')).toBe('white');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:transparent');
    fireEvent.click(screen.getByRole('button', { name: 'Save image' }));
    expect(downloadFamilyTreeBlob).toHaveBeenLastCalledWith(whitePng, 'familyTree.png');

    fireEvent.click(transparentBackgroundButton);
    await waitFor(() => expect(screen.getByRole('img', { name: 'Family tree image preview' }).getAttribute('src')).toBe('blob:transparent-again'));
    expect(transparentBackgroundButton.getAttribute('aria-pressed')).toBe('true');
    expect(whiteBackgroundButton.getAttribute('aria-pressed')).toBe('false');
    expect(vi.mocked(renderFamilyTreePng).mock.calls[2][2]).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Save image' }));
    expect(downloadFamilyTreeBlob).toHaveBeenLastCalledWith(nextTransparentPng, 'familyTree.png');
  });

  it('discards the previous PNG when a background change fails and retries the chosen background', async () => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:background-retry'), revokeObjectURL: vi.fn() });
    render(<FamilyTreeWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate image' }));
    await screen.findByRole('img', { name: 'Family tree image preview' });
    vi.mocked(renderFamilyTreePng).mockRejectedValueOnce(new Error('head999.png failed'));
    fireEvent.click(screen.getByRole('button', { name: 'White background' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('head999.png'));
    expect(screen.getByRole('button', { name: 'White background' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.queryByRole('img', { name: 'Family tree image preview' })).toBeNull();
    expect((screen.getByRole('button', { name: 'Save image' }) as HTMLButtonElement).disabled).toBe(true);
    expect(downloadFamilyTreeBlob).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate image' }));
    await screen.findByRole('img', { name: 'Family tree image preview' });
    expect(vi.mocked(renderFamilyTreePng).mock.calls[2][2]).toBe(true);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('closes only from the connections backdrop and preserves connection edits', () => {
    render(<FamilyTreeWorkbench locale="en" />);
    addNamedPerson('Aster');
    fireEvent.click(screen.getByRole('button', { name: 'Aster' }));
    const connectionsButton = screen.getAllByRole('button', { name: 'Edit connections' })[0];
    connectionsButton.focus();
    fireEvent.click(connectionsButton);

    const connectionDialog = screen.getByRole('dialog', { name: 'Connection editor' });
    const connectionsBackdrop = connectionDialog.parentElement as HTMLElement;
    fireEvent(connectionDialog, new MouseEvent('pointerdown', { bubbles: true, button: 0 }));
    expect(screen.getByRole('dialog', { name: 'Connection editor' })).toBe(connectionDialog);

    fireEvent(
      connectionsBackdrop,
      new MouseEvent('pointerdown', { bubbles: true, button: 2 }),
    );
    expect(screen.getByRole('dialog', { name: 'Connection editor' })).toBe(connectionDialog);

    fireEvent.click(screen.getAllByRole('button', { name: 'Dashed' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Add connection: Generation 1–2' }));
    expect(screen.getByRole('button', { name: 'Generation 1–2 · 1' })).toBeTruthy();

    const backdropPointerDown = new MouseEvent('pointerdown', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });
    fireEvent(connectionsBackdrop, backdropPointerDown);
    expect(backdropPointerDown.defaultPrevented).toBe(true);
    expect(screen.queryByRole('dialog', { name: 'Connection editor' })).toBeNull();
    expect(document.activeElement).toBe(connectionsButton);

    fireEvent.click(connectionsButton);
    expect(screen.getAllByRole('button', { name: 'Dashed' })[0].getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Generation 1–2 · 1' })).toBeTruthy();
  });

  it('keeps save/load and image dialogs open when their backdrop receives a pointerdown', async () => {
    render(<FamilyTreeWorkbench locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Save and load' }));
    const documentDialog = screen.getByRole('dialog', { name: 'Save and load' });
    fireEvent(
      documentDialog.parentElement as HTMLElement,
      new MouseEvent('pointerdown', { bubbles: true, button: 0 }),
    );
    expect(screen.getByRole('dialog', { name: 'Save and load' })).toBe(documentDialog);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:image-preview'), revokeObjectURL: vi.fn() });
    fireEvent.click(screen.getByRole('button', { name: 'Generate image' }));
    await screen.findByRole('img', { name: 'Family tree image preview' });
    const imageDialog = screen.getByRole('dialog', { name: 'Family tree image preview' });
    fireEvent(
      imageDialog.parentElement as HTMLElement,
      new MouseEvent('pointerdown', { bubbles: true, button: 0 }),
    );
    expect(screen.getByRole('dialog', { name: 'Family tree image preview' })).toBe(imageDialog);
  });

  it('revokes a failed decoded PNG and never offers it or the previous background for download', async () => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValueOnce('blob:transparent').mockReturnValueOnce('blob:failed-white').mockReturnValueOnce('blob:white-retry'),
      revokeObjectURL: vi.fn(),
    });
    render(<FamilyTreeWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate image' }));
    await screen.findByRole('img', { name: 'Family tree image preview' });
    decodePreviewImage.mockRejectedValueOnce(new Error('PNG decoding failed'));
    fireEvent.click(screen.getByRole('button', { name: 'White background' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('blob:failed-white'));
    expect(screen.getByRole('alert').textContent).toContain('PNG decoding failed');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:failed-white');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:transparent');
    expect(screen.queryByRole('img', { name: 'Family tree image preview' })).toBeNull();
    expect((screen.getByRole('button', { name: 'Save image' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Save image' }));
    expect(downloadFamilyTreeBlob).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate image' }));
    await waitFor(() => expect(screen.getByRole('img', { name: 'Family tree image preview' }).getAttribute('src')).toBe('blob:white-retry'));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(vi.mocked(renderFamilyTreePng).mock.calls[2][2]).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Save image' }));
    expect(downloadFamilyTreeBlob).toHaveBeenCalledTimes(1);
  });
});
