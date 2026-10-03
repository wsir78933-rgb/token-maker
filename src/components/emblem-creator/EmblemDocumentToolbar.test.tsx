// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EmblemDocumentToolbar } from '@/components/emblem-creator/EmblemDocumentToolbar';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('EmblemDocumentToolbar', () => {
  it.each(['en', 'zh'] as const)('opens only a selected file and resets its input in %s', async (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const open = vi.fn().mockResolvedValue(undefined);
    render(<EmblemDocumentToolbar copy={copy} disabled={false} isExporting={false}
      onOpenProject={open} onSaveProject={vi.fn()} onExportPng={vi.fn()} />);
    const input = screen.getByLabelText(copy.toolbar.openProject) as HTMLInputElement;
    const chooseFile = vi.spyOn(input, 'click');
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.openProject }));
    expect(chooseFile).toHaveBeenCalledOnce();
    fireEvent.change(input, { target: { files: [] } });
    expect(open).not.toHaveBeenCalled();
    const file = new File(['{}'], 'emblem-project.json', { type: 'application/json' });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(open).toHaveBeenCalledWith(file));
    expect(input.value).toBe('');
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(open).toHaveBeenCalledTimes(2));
  });

  it('routes save/export actions and disables all file actions during export', () => {
    const copy = getEmblemCreatorCopy('en');
    const save = vi.fn();
    const exportPng = vi.fn().mockResolvedValue(undefined);
    const props = { copy, onOpenProject: vi.fn(), onSaveProject: save, onExportPng: exportPng };
    const view = render(<EmblemDocumentToolbar {...props} disabled={false} isExporting={false} />);
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.saveProject }));
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.exportPng }));
    expect(save).toHaveBeenCalledOnce();
    expect(exportPng).toHaveBeenCalledOnce();
    view.rerender(<EmblemDocumentToolbar {...props} disabled isExporting />);
    for (const button of screen.getAllByRole('button')) expect((button as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText(copy.toolbar.openProject) as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByRole('button', { name: copy.toolbar.exporting })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.saveProject }));
    expect(save).toHaveBeenCalledOnce();
  });
});
