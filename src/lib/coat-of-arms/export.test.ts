import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProject } from './assets';
import {
  type CoatExportQuality,
  exportCoatBatch,
  exportCoatJpeg,
  exportCoatPdf,
  exportCoatPng,
  formatCoatExportDimensionsLabel,
  getCoatExportDimensions,
  getCoatExportQualityForSize,
  getCoatExportSizeForQuality,
  printCoatScene,
  projectForCoatExport,
} from './export';

const { jsPdfInstances, jszipModuleLoadState } = vi.hoisted(() => ({
  jsPdfInstances: [] as Array<{ addImage: ReturnType<typeof vi.fn>; options: unknown }>,
  jszipModuleLoadState: { count: 0 },
}));

vi.mock('jszip', async (importOriginal) => {
  jszipModuleLoadState.count += 1;
  return importOriginal();
});

vi.mock('jspdf', () => ({
  jsPDF: class {
    addImage = vi.fn();

    options: unknown;

    constructor(options: unknown) {
      this.options = options;
      jsPdfInstances.push(this);
    }

    output() {
      return new Blob(['pdf'], { type: 'application/pdf' });
    }
  },
}));

afterEach(() => {
  vi.unstubAllGlobals();
  jsPdfInstances.length = 0;
});

describe('coat export quality and dimensions', () => {
  it.each([
    ['low', 256],
    ['medium', 512],
    ['high', 1024],
    ['ultra', 2048],
  ] as const)('maps quality %s to size %s and back', (quality, size) => {
    expect(getCoatExportSizeForQuality(quality)).toBe(size);
    expect(getCoatExportQualityForSize(size)).toBe(quality);
  });

  it('rejects an unknown export quality with the received value', () => {
    expect(() => getCoatExportSizeForQuality('huge' as CoatExportQuality)).toThrow('huge');
  });

  it('rejects an unknown export size with the received value', () => {
    expect(() => getCoatExportQualityForSize(1080)).toThrow('1080');
  });

  it('formats the 3:5 default project at 512 from the canvas aspect ratio', () => {
    const project = createDefaultProject('en');

    expect(formatCoatExportDimensionsLabel(getCoatExportDimensions(project, 512))).toBe('512 × 307 px');
  });

  it('maps Instagram 1080×1920 at 1024 to 576×1024', () => {
    const instagramProject = { ...createDefaultProject('en'), canvas: { width: 1080, height: 1920 } };

    expect(getCoatExportDimensions(instagramProject, 1024)).toEqual({ width: 576, height: 1024 });
  });

  it('rejects an unsupported dimension size with the received value', () => {
    expect(() => getCoatExportDimensions(createDefaultProject('en'), 123)).toThrow('123');
  });
});

describe('projectForCoatExport', () => {
  it('returns the same project when options are omitted or the background stays opaque', () => {
    const project = createDefaultProject('en');

    expect(projectForCoatExport(project)).toBe(project);
    expect(projectForCoatExport(project, {})).toBe(project);
    expect(projectForCoatExport(project, { transparentBackground: false })).toBe(project);
  });

  it('hides background layers without mutating the input project', () => {
    const project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!background) throw new Error('Expected default background layer');

    const exported = projectForCoatExport(project, { transparentBackground: true });
    const exportedBackground = exported.layers.find((layer) => layer.type === 'background');
    if (!exportedBackground) throw new Error('Expected exported background layer');

    expect(exported).not.toBe(project);
    expect(background.visible).toBe(true);
    expect(exportedBackground.visible).toBe(false);
    expect(exportedBackground).not.toBe(background);
    expect(exported.layers[1]).toBe(project.layers[1]);
  });

  it.each([null, [], 'nope', 1])('rejects non-object options including the received value: %s', (invalidOptions) => {
    expect(() => projectForCoatExport(createDefaultProject('en'), invalidOptions as never)).toThrow(JSON.stringify(invalidOptions));
  });

  it.each(['yes', 1, null])('rejects a non-boolean transparentBackground including the received value: %s', (invalidFlag) => {
    expect(() => projectForCoatExport(createDefaultProject('en'), { transparentBackground: invalidFlag as never })).toThrow(JSON.stringify(invalidFlag));
  });
});

describe('coat export helpers', () => {
  it('exports a non-empty PNG blob with image/png type', async () => {
    installCanvasBrowser();

    const png = await exportCoatPng(createDefaultProject('en'), 1024);

    expect(png.type).toBe('image/png');
    expect(png.size).toBeGreaterThan(0);
  });

  it('exports a non-empty JPEG blob at the requested canvas quality', async () => {
    const toBlob = vi.fn((callback: BlobCallback, type?: string) => {
      callback(new Blob(['jpeg'], { type }));
    });
    installCanvasBrowser({ toBlob });

    const jpeg = await exportCoatJpeg(createDefaultProject('en'), 1024, 0.73);

    expect(jpeg.type).toBe('image/jpeg');
    expect(jpeg.size).toBeGreaterThan(0);
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.73);
  });

  it.each([-0.01, 1.01, Number.NaN, Number.POSITIVE_INFINITY, '0.73', null])(
    'rejects JPEG quality outside the finite 0 to 1 range: %s',
    async (invalidQuality) => {
      installCanvasBrowser();

      await expect(exportCoatJpeg(createDefaultProject('en'), 512, invalidQuality as number)).rejects.toThrow(String(invalidQuality));
    },
  );

  it('rejects an unsupported export size with the received value', async () => {
    await expect(exportCoatPng(createDefaultProject('en'), 123)).rejects.toThrow('123');
  });

  it('fails visibly when the browser cannot provide a canvas context', async () => {
    vi.stubGlobal('document', { createElement: () => ({ getContext: () => null }) });
    vi.stubGlobal('Image', FakeImage);
    vi.stubGlobal('URL', { createObjectURL: () => 'blob:coat', revokeObjectURL: () => undefined });

    await expect(exportCoatPng(createDefaultProject('en'), 512)).rejects.toThrow('canvas');
  });

  it('revokes SVG object URLs after successful and failed image decoding', async () => {
    const revokeObjectURL = vi.fn();
    installCanvasBrowser({ revokeObjectURL });
    await exportCoatPng(createDefaultProject('en'), 512);

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:coat');

    vi.stubGlobal('Image', FailingImage);
    await expect(exportCoatPng(createDefaultProject('en'), 512)).rejects.toThrow('decoding SVG');
    expect(revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it('exports a non-empty PDF through the controlled jsPDF adapter', async () => {
    installCanvasBrowser();

    const pdf = await exportCoatPdf(createDefaultProject('en'), 512);

    expect(pdf.type).toBe('application/pdf');
    expect(pdf.size).toBeGreaterThan(0);
    expect(jsPdfInstances[0]?.addImage).toHaveBeenCalledWith(
      'data:image/png;base64,cG5n', 'PNG', 0, 0, 512, 307,
    );
  });

  it('scales raster, PDF, and print output from the project canvas aspect ratio', async () => {
    const createdCanvases: Array<{ width: number; height: number }> = [];
    installCanvasBrowser({ onCanvasCreated: (canvas) => createdCanvases.push(canvas) });
    const instagramProject = { ...createDefaultProject('en'), canvas: { width: 1080, height: 1920 } };
    const popup = createPopup();
    vi.stubGlobal('window', { open: () => popup });

    await exportCoatPng(instagramProject, 1024);
    await exportCoatJpeg(instagramProject, 1024, 0.73);
    await exportCoatPdf(instagramProject, 1024);
    printCoatScene(instagramProject, 1024);

    expect(createdCanvases.map(({ width, height }) => ({ width, height }))).toEqual([
      { width: 576, height: 1024 },
      { width: 576, height: 1024 },
      { width: 576, height: 1024 },
    ]);
    expect(jsPdfInstances[0]?.options).toEqual({ orientation: 'portrait', unit: 'px', format: [576, 1024] });
    expect(jsPdfInstances[0]?.addImage).toHaveBeenCalledWith(
      'data:image/png;base64,cG5n', 'PNG', 0, 0, 576, 1024,
    );
    expect(popup.document.write).toHaveBeenCalledWith(expect.stringContaining('width="576" height="1024"'));
  });

  it('exports same-name projects into a ZIP with distinct PNG entries', async () => {
    installCanvasBrowser();
    const first = { ...createDefaultProject('en'), name: 'Same Arms' };
    const second = { ...createDefaultProject('en'), name: 'Same Arms' };

    expect(jszipModuleLoadState.count).toBe(0);
    const zipBlob = await exportCoatBatch([first, second], 512);
    expect(jszipModuleLoadState.count).toBe(1);
    const { default: JSZip } = await import('jszip');
    const zip = await JSZip.loadAsync(await zipBlob.arrayBuffer());

    expect(zipBlob.size).toBeGreaterThan(0);
    expect(Object.keys(zip.files).sort()).toEqual(['Same Arms-2.png', 'Same Arms.png']);
  });

  it('rejects an empty batch before creating a ZIP', async () => {
    await expect(exportCoatBatch([], 512)).rejects.toThrow('projects');
  });

  it('fails visibly when a print popup is blocked', () => {
    vi.stubGlobal('window', { open: () => null });

    expect(() => printCoatScene(createDefaultProject('en'), 512)).toThrow('popup');
  });

  it('closes an already-open popup when scene validation fails', () => {
    const popup = createPopup();
    vi.stubGlobal('window', { open: () => popup });
    const invalidProject = {
      ...createDefaultProject('en'),
      canvas: { width: Number.NaN, height: 1200 },
    };

    expect(() => printCoatScene(invalidProject, 512)).toThrow('NaN');
    expect(popup.close).toHaveBeenCalledTimes(1);
  });

  it('writes, loads, prints, and closes a successful popup lifecycle', () => {
    const popup = createPopup();
    const openPopup = vi.fn(() => popup);
    vi.stubGlobal('window', { open: openPopup });

    printCoatScene(createDefaultProject('en'), 512);

    expect(openPopup).toHaveBeenCalledWith('', '_blank');
    expect(popup.document.open).toHaveBeenCalledTimes(1);
    expect(popup.document.write).toHaveBeenCalledTimes(1);
    expect(popup.document.close).toHaveBeenCalledTimes(1);
    popup.loadHandler?.();
    expect(popup.focus).toHaveBeenCalledTimes(1);
    expect(popup.print).toHaveBeenCalledTimes(1);
    expect(popup.close).toHaveBeenCalledTimes(1);
  });

  it('exposes a PDF exporter that rejects unsupported dimensions before browser work', async () => {
    await expect(exportCoatPdf(createDefaultProject('en'), 123)).rejects.toThrow('123');
  });

  it('prints a scene whose default background layer is omitted when transparentBackground is true', () => {
    const project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!background || !shield) throw new Error('Expected default background and shield layers');
    const popup = createPopup();
    vi.stubGlobal('window', { open: () => popup });

    printCoatScene(project, 512, { transparentBackground: true });

    const writtenHtml = String(popup.document.write.mock.calls[0]?.[0]);
    expect(background.visible).toBe(true);
    expect(writtenHtml).not.toContain(`data-layer-id="${background.id}"`);
    expect(writtenHtml).not.toContain('#F5E6A1');
    expect(writtenHtml).toContain(`data-layer-id="${shield.id}"`);
  });

  it('renders PNG and PDF from a project whose default background is hidden when transparentBackground is true', async () => {
    const project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!background || !shield) throw new Error('Expected default background and shield layers');
    const svgBlobs: Blob[] = [];
    installCanvasBrowser({
      onObjectUrlBlob: (blob) => {
        svgBlobs.push(blob);
      },
    });

    await exportCoatPng(project, 512, { transparentBackground: true });
    await exportCoatPdf(project, 512, { transparentBackground: true });

    expect(svgBlobs).toHaveLength(2);
    expect(background.visible).toBe(true);
    for (const svgBlob of svgBlobs) {
      const svg = await svgBlob.text();
      expect(svg).not.toContain(`data-layer-id="${background.id}"`);
      expect(svg).not.toContain('#F5E6A1');
      expect(svg).toContain(`data-layer-id="${shield.id}"`);
    }
  });

  it('prints a background-only project that has no shield', () => {
    const project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!background) throw new Error('Expected background layer');
    const withoutShield = {
      ...project,
      layers: project.layers.filter((layer) => layer.type !== 'shield'),
    };
    const popup = createPopup();
    vi.stubGlobal('window', { open: () => popup });

    printCoatScene(withoutShield, 512);

    const writtenHtml = String(popup.document.write.mock.calls[0]?.[0]);
    expect(writtenHtml).toContain(`data-layer-id="${background.id}"`);
    expect(writtenHtml).toContain('#F5E6A1');
    expect(writtenHtml).not.toContain('coat-shield-clip');
  });

  it('exports PNG from a background-only project that has no shield', async () => {
    const project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!background) throw new Error('Expected background layer');
    const withoutShield = {
      ...project,
      layers: project.layers.filter((layer) => layer.type !== 'shield'),
    };
    const svgBlobs: Blob[] = [];
    installCanvasBrowser({
      onObjectUrlBlob: (blob) => {
        svgBlobs.push(blob);
      },
    });

    const png = await exportCoatPng(withoutShield, 512);

    expect(png).toBeInstanceOf(Blob);
    expect(svgBlobs).toHaveLength(1);
    const svg = await svgBlobs[0]!.text();
    expect(svg).toContain(`data-layer-id="${background.id}"`);
    expect(svg).toContain('#F5E6A1');
    expect(svg).not.toContain('coat-shield-clip');
  });

  it('rejects JPEG transparent background with true and the quality number before canvas work', async () => {
    await expect(exportCoatJpeg(createDefaultProject('en'), 512, 0.73, { transparentBackground: true }))
      .rejects.toThrow(/true[\s\S]*0\.73|0\.73[\s\S]*true/);
  });

  it.each([null, [], 'nope'])('rejects invalid export options including the received value: %s', async (invalidOptions) => {
    await expect(exportCoatPng(createDefaultProject('en'), 512, invalidOptions as never))
      .rejects.toThrow(JSON.stringify(invalidOptions));
    await expect(exportCoatJpeg(createDefaultProject('en'), 512, 0.73, invalidOptions as never))
      .rejects.toThrow(JSON.stringify(invalidOptions));
    await expect(exportCoatPdf(createDefaultProject('en'), 512, invalidOptions as never))
      .rejects.toThrow(JSON.stringify(invalidOptions));
    expect(() => printCoatScene(createDefaultProject('en'), 512, invalidOptions as never))
      .toThrow(JSON.stringify(invalidOptions));
  });
});

function installCanvasBrowser(options: {
  onCanvasCreated?: (canvas: { width: number; height: number }) => void;
  onObjectUrlBlob?: (blob: Blob) => void;
  revokeObjectURL?: ReturnType<typeof vi.fn>;
  toBlob?: (callback: BlobCallback, type?: string, quality?: number) => void;
} = {}): void {
  const drawImage = vi.fn();
  vi.stubGlobal('document', {
    createElement: (tagName: string) => {
      if (tagName !== 'canvas') throw new Error(`Unexpected element: ${tagName}`);
      const canvas = {
        width: 0,
        height: 0,
        getContext: () => ({ drawImage }),
        toBlob: options.toBlob ?? ((callback: BlobCallback, type?: string) => callback(new Blob(['png'], { type: type ?? 'image/png' }))),
        toDataURL: () => 'data:image/png;base64,cG5n',
      };
      options.onCanvasCreated?.(canvas);
      return canvas;
    },
  });
  vi.stubGlobal('Image', FakeImage);
  vi.stubGlobal('URL', {
    createObjectURL: (blob: Blob) => {
      options.onObjectUrlBlob?.(blob);
      return 'blob:coat';
    },
    revokeObjectURL: options.revokeObjectURL ?? (() => undefined),
  });
}

class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 100;
  height = 110;

  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

class FailingImage extends FakeImage {
  set src(_value: string) {
    queueMicrotask(() => this.onerror?.());
  }
}

function createPopup() {
  const popup = {
    document: { open: vi.fn(), write: vi.fn(), close: vi.fn() },
    focus: vi.fn(),
    print: vi.fn(),
    close: vi.fn(),
    loadHandler: undefined as (() => void) | undefined,
    addEventListener: vi.fn((eventName: string, listener: () => void) => {
      if (eventName === 'load') popup.loadHandler = listener;
    }),
  };
  return popup;
}
