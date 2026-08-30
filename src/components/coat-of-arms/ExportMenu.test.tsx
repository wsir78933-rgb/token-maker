// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import * as exportModule from '@/lib/coat-of-arms/export';
import { ExportMenu } from './ExportMenu';

const mocks = vi.hoisted(() => {
  class CoatExportUploadError extends Error {
    constructor(public readonly code: string) {
      super(code);
      this.name = 'CoatExportUploadError';
    }
  }
  return {
    CoatExportUploadError,
    uploadCoatExportToCloud: vi.fn(async () => undefined),
  };
});

vi.mock('@/lib/coat-of-arms/cloud-export/client-upload', () => ({
  CoatExportUploadError: mocks.CoatExportUploadError,
  uploadCoatExportToCloud: mocks.uploadCoatExportToCloud,
}));

vi.mock('@/lib/coat-of-arms/export', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/coat-of-arms/export')>();
  return {
    ...actual,
    exportCoatPng: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
    exportCoatJpeg: vi.fn(async () => new Blob(['jpg'], { type: 'image/jpeg' })),
    exportCoatPdf: vi.fn(async () => new Blob(['pdf'], { type: 'application/pdf' })),
    printCoatScene: vi.fn(),
  };
});

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

describe('ExportMenu', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mocks.uploadCoatExportToCloud.mockReset();
    mocks.uploadCoatExportToCloud.mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.unstubAllGlobals();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: originalRevokeObjectURL,
    });
  });

  it('closes the export menu when the user clicks outside it', () => {
    render(<><button type="button">Outside export menu</button><ExportMenu locale="en" project={createDefaultProject('en')} /></>);

    const exportTrigger = screen.getByRole('button', { name: 'Export' });
    fireEvent.click(exportTrigger);
    expect(screen.getByRole('region', { name: 'Local export options' })).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Outside export menu' }));

    expect(screen.queryByRole('region', { name: 'Local export options' })).toBeNull();
    expect(document.activeElement).toBe(exportTrigger);
  });

  it('keeps the export menu open when the user clicks inside it', () => {
    render(<><button type="button">Outside export menu</button><ExportMenu locale="en" project={createDefaultProject('en')} /></>);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByLabelText('File type'));

    expect(screen.getByRole('region', { name: 'Local export options' })).not.toBeNull();
  });

  it('updates the live dimensions label when the quality slider changes', () => {
    render(<ExportMenu locale="en" project={createDefaultProject('en')} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(screen.getByText('1024 × 614 px')).toBeDefined();

    fireEvent.change(screen.getByLabelText('Quality'), { target: { value: '0' } });

    expect(screen.getByText('256 × 154 px')).toBeDefined();
  });

  it('shows Download PNG as the default primary action', () => {
    render(<ExportMenu locale="en" project={createDefaultProject('en')} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.getByRole('button', { name: 'Download PNG' })).toBeDefined();
  });

  it('keeps caller-owned controls and section IDs unique when two menus are open', () => {
    const project = createDefaultProject('en');
    render(<>
      <ExportMenu locale="en" menuId="desktop-export-options" project={project} />
      <ExportMenu locale="en" menuId="mobile-export-options" project={project} />
    </>);
    const triggers = screen.getAllByRole('button', { name: 'Export' });

    expect(triggers.map((trigger) => trigger.getAttribute('aria-controls'))).toEqual([
      'desktop-export-options',
      'mobile-export-options',
    ]);
    act(() => {
      triggers[0]?.click();
      triggers[1]?.click();
    });

    const menus = screen.getAllByRole('region', { name: 'Local export options' });
    expect(menus.map((menu) => menu.id)).toEqual(['desktop-export-options', 'mobile-export-options']);
    expect(document.querySelectorAll('#desktop-export-options')).toHaveLength(1);
    expect(document.querySelectorAll('#mobile-export-options')).toHaveLength(1);
  });

  it('fails fast when a caller provides a blank menu ID', () => {
    expect(() => render(
      <ExportMenu locale="en" menuId="  " project={createDefaultProject('en')} />,
    )).toThrow('Export menu ID must be non-empty; received "  "');
  });

  it('downloads locally before uploading and shows cloudExportSaved without a URL', async () => {
    const downloadClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    let downloadedBeforeUpload = false;
    mocks.uploadCoatExportToCloud.mockImplementation(async () => {
      downloadedBeforeUpload = downloadClicks.mock.calls.length > 0;
    });
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:coat-export'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
    const project = createDefaultProject('en');
    render(<ExportMenu locale="en" project={project} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));

    const status = await screen.findByText('PNG exported locally. Export saved.');
    expect(downloadedBeforeUpload).toBe(true);
    expect(mocks.uploadCoatExportToCloud).toHaveBeenCalledTimes(1);
    expect(mocks.uploadCoatExportToCloud).toHaveBeenCalledWith({
      file: expect.any(Blob),
      fileType: 'png',
      width: 1024,
      height: 614,
      locale: 'en',
    });
    expect(status.textContent).toContain('Export saved.');
    expect(status.textContent).not.toMatch(/https?:\/\//);
    expect(status.textContent).not.toContain('blob:');
    expect(status.textContent).not.toContain('imageUrl');
    expect(status.textContent).not.toContain('shareUrl');
    downloadClicks.mockRestore();
  });

  it('keeps the local download and shows cloudExportFailed when upload fails', async () => {
    const downloadClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    mocks.uploadCoatExportToCloud.mockRejectedValueOnce(new mocks.CoatExportUploadError('storage_not_configured'));
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:coat-export'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
    render(<ExportMenu locale="en" project={createDefaultProject('en')} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Cloud save failed: storage_not_configured');
    expect(downloadClicks).toHaveBeenCalled();
    expect(screen.getByText('PNG exported locally.').textContent).toBe('PNG exported locally.');
    expect(screen.queryByText(/https?:\/\//)).toBeNull();
    downloadClicks.mockRestore();
  });

  it('uploads JPEG and PDF downloads with matching fileType and does not upload Share or Print', async () => {
    const downloadClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const share = vi.fn(async () => undefined);
    class TestFile extends Blob {
      readonly name: string;
      constructor(parts: BlobPart[], name: string, options?: FilePropertyBag) {
        super(parts, options);
        this.name = name;
      }
    }
    vi.stubGlobal('File', TestFile);
    vi.stubGlobal('navigator', { canShare: () => true, share });
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:coat-export'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
    const project = createDefaultProject('en');
    render(<ExportMenu locale="en" project={project} />);
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    fireEvent.change(screen.getByLabelText('File type'), { target: { value: 'jpeg' } });
    fireEvent.click(screen.getByRole('button', { name: 'Download JPG' }));
    await waitFor(() => expect(mocks.uploadCoatExportToCloud).toHaveBeenCalledTimes(1));
    expect(mocks.uploadCoatExportToCloud).toHaveBeenLastCalledWith(expect.objectContaining({
      fileType: 'jpeg',
      width: 1024,
      height: 614,
      locale: 'en',
    }));

    fireEvent.change(screen.getByLabelText('File type'), { target: { value: 'pdf' } });
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));
    await waitFor(() => expect(mocks.uploadCoatExportToCloud).toHaveBeenCalledTimes(2));
    expect(mocks.uploadCoatExportToCloud).toHaveBeenLastCalledWith(expect.objectContaining({
      fileType: 'pdf',
      locale: 'en',
    }));

    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    expect((await screen.findByText('Native share sheet opened.')).textContent).toBe('Native share sheet opened.');
    fireEvent.click(screen.getByRole('button', { name: 'Print' }));
    await waitFor(() => expect(exportModule.printCoatScene).toHaveBeenCalledTimes(1));

    expect(mocks.uploadCoatExportToCloud).toHaveBeenCalledTimes(2);
    expect(downloadClicks).toHaveBeenCalledTimes(2);
    expect(share).toHaveBeenCalledTimes(1);
    downloadClicks.mockRestore();
  });
});

