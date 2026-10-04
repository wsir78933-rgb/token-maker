// @vitest-environment jsdom

import { act, cleanup, createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EmblemCreatorWorkbench } from '@/components/emblem-creator/EmblemCreatorWorkbench';
import { getEmblemCatalogAsset } from '@/lib/emblem-creator/catalog';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { loadEmblemImage } from '@/lib/emblem-creator/image-loading';
import { exportEmblemProjectPng } from '@/lib/emblem-creator/png-export';
import { applyEmblemProjectCommand, createDefaultEmblemProject, createEmblemElement, parseEmblemProjectJson, serializeEmblemProject } from '@/lib/emblem-creator/project';
import { EMBLEM_LAYER_ORDER, MAX_EMBLEM_PROJECT_FILE_BYTES, type EmblemAssetCategory, type EmblemLayerId, type EmblemLocale, type EmblemProject } from '@/lib/emblem-creator/types';

vi.mock('@/lib/emblem-creator/image-loading', () => ({ loadEmblemImage: vi.fn() }));
vi.mock('@/lib/emblem-creator/png-export', () => ({ exportEmblemProjectPng: vi.fn() }));

const createObjectUrl = vi.fn();
const revokeObjectUrl = vi.fn();
let downloadedNames: string[];

const targetLayerByCatalogCategory: Readonly<Record<EmblemAssetCategory, EmblemLayerId>> = {
  body: 'body4',
  detail: 'details',
  crest: 'crests',
};

function loadedImage(width = 640, height = 320): HTMLImageElement {
  const image = new Image();
  Object.defineProperties(image, { naturalWidth: { value: width }, naturalHeight: { value: height } });
  return image;
}

function projectFile(contents: string, name = 'emblem-project.json'): File {
  const file = new File([contents], name, { type: 'application/json' });
  // jsdom's File lacks Blob.text(); the file's size/content remain real.
  Object.defineProperty(file, 'text', { value: vi.fn().mockResolvedValue(contents) });
  return file;
}

function openFile(file: File, locale: EmblemLocale = 'en') {
  fireEvent.change(screen.getByLabelText(getEmblemCreatorCopy(locale).toolbar.openProject), { target: { files: [file] } });
}

function clickAsset(assetId: string, locale: EmblemLocale = 'en') {
  const copy = getEmblemCreatorCopy(locale);
  fireEvent.click(screen.getByRole('button', { name: `${copy.assets.chooseAsset}: ${getEmblemCatalogAsset(assetId).name[locale]}` }));
}

function chooseCategory(category: EmblemAssetCategory, locale: EmblemLocale = 'en') {
  const copy = getEmblemCreatorCopy(locale);
  const assets = screen.getByRole('region', { name: copy.panels.assets });
  fireEvent.click(within(assets).getByRole('button', { name: copy.assets.categories[category] }));
}

function canvas(locale: EmblemLocale = 'en'): SVGSVGElement {
  return screen.getByRole('group', { name: getEmblemCreatorCopy(locale).canvasLabel }) as unknown as SVGSVGElement;
}

function canvasElementIds(locale: EmblemLocale = 'en'): string[] {
  return [...canvas(locale).querySelectorAll('[data-element-id]')].map((element) => element.getAttribute('data-element-id')!);
}

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

async function savedProject(locale: EmblemLocale = 'en'): Promise<EmblemProject> {
  fireEvent.click(screen.getByRole('button', { name: getEmblemCreatorCopy(locale).toolbar.saveProject }));
  const blob = createObjectUrl.mock.calls.at(-1)?.[0] as Blob | undefined;
  if (!blob) throw new Error('Save did not create a file Blob.');
  return parseEmblemProjectJson(await readBlob(blob));
}

function addProjectUrl(project: EmblemProject, id: string, url: string, layerId: EmblemLayerId): EmblemProject {
  return applyEmblemProjectCommand(project, { type: 'add-element', layerId,
    element: createEmblemElement({ kind: 'url', url, naturalWidth: 640, naturalHeight: 320 }, id),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  downloadedNames = [];
  vi.mocked(loadEmblemImage).mockResolvedValue(loadedImage());
  vi.mocked(exportEmblemProjectPng).mockResolvedValue(new Blob(['png'], { type: 'image/png' }));
  createObjectUrl.mockReturnValue('blob:emblem-test');
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = createObjectUrl;
    static revokeObjectURL = revokeObjectUrl;
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    downloadedNames.push(this.download);
  });
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('EmblemCreatorWorkbench with real project, panels and canvas', () => {
  it.each(['en', 'zh'] as const)('starts empty and switches mobile panels with canvas above them in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    render(<EmblemCreatorWorkbench locale={locale} copy={copy} />);
    expect(screen.getByText(copy.noSelection)).toBeTruthy();
    expect(screen.getByText(copy.properties.emptySelection)).toBeTruthy();
    expect((screen.getByLabelText(copy.properties.showEditBounds) as HTMLInputElement).checked).toBe(true);
    expect(within(screen.getByRole('region', { name: copy.panels.layers })).queryAllByRole('listitem')).toHaveLength(0);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual(Object.values(copy.panels));
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    const properties = document.getElementById(tabs[1].getAttribute('aria-controls')!);
    const assets = document.getElementById(tabs[0].getAttribute('aria-controls')!);
    expect(properties?.classList.contains('hidden')).toBe(false);
    expect(assets?.classList.contains('hidden')).toBe(true);
    expect(canvas(locale).compareDocumentPosition(tabs[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[2]);
    expect(within(screen.getByRole('region', { name: copy.panels.layers })).queryAllByRole('listitem')).toHaveLength(0);
    expect(canvasElementIds(locale)).toEqual([]);
  });

  it.each(['Delete', 'Backspace'] as const)('deletes only the selected element with %s in the editor', (key) => {
    const copy = getEmblemCreatorCopy('en');
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    chooseCategory('detail');
    clickAsset('rff-detail-1');
    const beforeDeletion = canvasElementIds();
    const selectedElement = canvas().querySelector('[aria-pressed="true"]');
    if (!selectedElement) throw new Error('Expected a selected canvas element before keyboard deletion.');
    const selectedElementId = selectedElement.getAttribute('data-element-id');
    if (!selectedElementId) throw new Error('Expected the selected canvas element to expose its ID.');

    const keydown = createEvent.keyDown(selectedElement, { key });
    fireEvent(selectedElement, keydown);

    expect(keydown.defaultPrevented).toBe(true);
    expect(canvasElementIds()).toEqual(beforeDeletion.filter((elementId) => elementId !== selectedElementId));
    expect(screen.getByText(copy.noSelection)).toBeTruthy();
  });

  it('does not delete from editing targets, composing input, modified keys, or an empty selection', () => {
    const copy = getEmblemCreatorCopy('en');
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    const emptyCanvas = canvas();
    const emptyDeletion = createEvent.keyDown(emptyCanvas, { key: 'Delete' });
    fireEvent(emptyCanvas, emptyDeletion);
    expect(emptyDeletion.defaultPrevented).toBe(false);

    clickAsset('rff-emblems-1');
    const originalIds = canvasElementIds();
    const editor = screen.getByRole('region', { name: copy.editorTitle });
    const textArea = document.createElement('textarea');
    const select = document.createElement('select');
    const contentEditable = document.createElement('div');
    contentEditable.setAttribute('contenteditable', 'true');
    editor.append(textArea, select, contentEditable);

    const editingTargets: Element[] = [screen.getByLabelText(copy.properties.x), textArea, select, contentEditable];
    for (const target of editingTargets) fireEvent.keyDown(target, { key: 'Delete' });
    const selectedElement = canvas().querySelector('[aria-pressed="true"]')!;
    fireEvent.keyDown(selectedElement, { key: 'Delete', ctrlKey: true });
    fireEvent.keyDown(selectedElement, { key: 'Backspace', metaKey: true });
    fireEvent.keyDown(selectedElement, { key: 'Delete', altKey: true });
    fireEvent.keyDown(selectedElement, { key: 'Backspace', shiftKey: true });
    fireEvent.keyDown(selectedElement, { key: 'Delete', isComposing: true });

    expect(canvasElementIds()).toEqual(originalIds);
  });

  it('does not delete while the editor is busy with an export', async () => {
    const copy = getEmblemCreatorCopy('en');
    let finishExport!: (blob: Blob) => void;
    vi.mocked(exportEmblemProjectPng).mockReturnValueOnce(new Promise((resolve) => { finishExport = resolve; }));
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    const originalIds = canvasElementIds();
    const selectedElement = canvas().querySelector('[aria-pressed="true"]')!;
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.exportPng }));
    expect(screen.getByRole('button', { name: copy.toolbar.exporting })).toBeTruthy();

    fireEvent.keyDown(selectedElement, { key: 'Delete' });
    expect(canvasElementIds()).toEqual(originalIds);

    await act(async () => { finishExport(new Blob(['png'], { type: 'image/png' })); });
  });

  it.each(['en', 'zh'] as const)('hides cleared empty layers and restores their row when a real asset is added in %s', async (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    render(<EmblemCreatorWorkbench locale={locale} copy={copy} />);
    const layerPanel = screen.getByRole('region', { name: copy.panels.layers });
    const layerNames = () => within(layerPanel).getAllByRole('listitem')
      .map((row) => within(row).getAllByRole('button')[0].textContent);

    expect(within(layerPanel).queryAllByRole('listitem')).toHaveLength(0);
    clickAsset('rff-emblems-1', locale);
    chooseCategory('detail', locale);
    clickAsset('rff-detail-1', locale);
    expect(layerNames()).toEqual([copy.layers.names.details, copy.layers.names.body4]);

    const body4Name = copy.layers.names.body4;
    fireEvent.click(within(layerPanel).getByRole('button', { name: `${copy.layers.hideLayer}: ${body4Name}` }));
    expect(within(layerPanel).getByRole('button', { name: `${copy.layers.showLayer}: ${body4Name}` })).toBeTruthy();
    expect(layerNames()).toContain(body4Name);
    fireEvent.click(within(layerPanel).getByRole('button', { name: `${copy.layers.showLayer}: ${body4Name}` }));
    expect(within(layerPanel).getByRole('button', { name: `${copy.layers.hideLayer}: ${body4Name}` })).toBeTruthy();
    fireEvent.click(within(layerPanel).getByRole('button', { name: `${copy.layers.hideLayer}: ${body4Name}` }));

    const beforeClear = await savedProject(locale);
    expect(beforeClear.schemaVersion).toBe(1);
    expect(Object.keys(beforeClear.layers)).toEqual(EMBLEM_LAYER_ORDER);
    fireEvent.click(within(layerPanel).getByRole('button', { name: copy.layers.names.details }));
    fireEvent.click(within(layerPanel).getByRole('button', { name: copy.layers.clearActiveLayer }));

    const afterClear = await savedProject(locale);
    expect(afterClear.schemaVersion).toBe(1);
    expect(Object.keys(afterClear.layers)).toEqual(EMBLEM_LAYER_ORDER);
    expect(afterClear.layers.details.elements).toEqual([]);
    expect(afterClear.layers.details.visible).toBe(beforeClear.layers.details.visible);
    expect(layerNames()).toEqual([body4Name]);
    expect(within(layerPanel).getByRole('button', { name: `${copy.layers.showLayer}: ${body4Name}` })).toBeTruthy();
    for (const layerId of EMBLEM_LAYER_ORDER) {
      if (layerId !== 'details') expect(afterClear.layers[layerId]).toEqual(beforeClear.layers[layerId]);
    }

    chooseCategory('detail', locale);
    clickAsset('rff-detail-1', locale);
    expect(layerNames()).toEqual([copy.layers.names.details, body4Name]);
    const afterReAdd = await savedProject(locale);
    expect(Object.keys(afterReAdd.layers)).toEqual(EMBLEM_LAYER_ORDER);
    expect(afterReAdd.layers.details.elements).toHaveLength(1);
    expect(afterReAdd.layers.body4).toEqual(afterClear.layers.body4);
  });

  it.each(['en', 'zh'] as const)('auto-assigns all four body slots, rejects a fifth, and reuses a cleared slot in %s', async (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    render(<EmblemCreatorWorkbench locale={locale} copy={copy} />);
    const layerPanel = screen.getByRole('region', { name: copy.panels.layers });
    const layerNames = () => within(layerPanel).getAllByRole('listitem')
      .map((row) => within(row).getAllByRole('button')[0].textContent);

    expect(within(layerPanel).queryAllByRole('listitem')).toHaveLength(0);
    clickAsset('rff-emblems-1', locale);
    const body4Name = copy.layers.names.body4;
    fireEvent.click(within(layerPanel).getByRole('button', { name: body4Name }));
    fireEvent.click(within(layerPanel).getByRole('button', { name: `${copy.layers.hideLayer}: ${body4Name}` }));
    clickAsset('rff-emblems-2', locale);
    expect(layerNames()).toContain(body4Name);
    expect(within(layerPanel).getByRole('button', { name: `${copy.layers.showLayer}: ${body4Name}` })).toBeTruthy();
    fireEvent.click(within(layerPanel).getByRole('button', { name: `${copy.layers.showLayer}: ${body4Name}` }));

    chooseCategory('body', locale);
    const sameSourceUrl = getEmblemCatalogAsset('rff-emblems-1').publicPath;
    fireEvent.change(screen.getByLabelText(copy.assets.imageUrl), { target: { value: sameSourceUrl } });
    fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));
    await waitFor(() => expect((screen.getByLabelText(copy.assets.imageUrl) as HTMLInputElement).value).toBe(''));
    fireEvent.click(within(layerPanel).getByRole('button', { name: body4Name }));
    clickAsset('rff-emblems-3', locale);
    const fourBodies = await savedProject(locale);
    expect(fourBodies.schemaVersion).toBe(1);
    expect(Object.keys(fourBodies.layers)).toEqual(EMBLEM_LAYER_ORDER);
    expect(fourBodies.layers.body4.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-1' });
    expect(fourBodies.layers.body3.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-2' });
    expect(fourBodies.layers.body2.elements[0]?.source).toMatchObject({ kind: 'url', url: sameSourceUrl });
    expect(fourBodies.layers.body1.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-3' });
    expect(layerNames()).toEqual((['body1', 'body2', 'body3', 'body4'] as const)
      .map((layerId) => copy.layers.names[layerId]));

    const originalCanvasIds = canvasElementIds(locale);
    clickAsset('rff-emblems-4', locale);
    expect(screen.getAllByRole('alert').map((alert) => alert.textContent).join('\n')).toContain(copy.errors.bodyLayersFull);
    expect(screen.getAllByRole('alert').map((alert) => alert.textContent).join('\n')).toContain('4/4');
    expect(canvasElementIds(locale)).toEqual(originalCanvasIds);
    expect(await savedProject(locale)).toEqual(fourBodies);

    const body3Name = copy.layers.names.body3;
    fireEvent.click(within(layerPanel).getByRole('button', { name: body3Name }));
    fireEvent.click(within(layerPanel).getByRole('button', { name: copy.layers.clearActiveLayer }));
    expect(layerNames()).not.toContain(body3Name);
    const afterClear = await savedProject(locale);
    expect(afterClear.layers.body3.elements).toEqual([]);
    expect(afterClear.layers.body3.visible).toBe(fourBodies.layers.body3.visible);
    for (const layerId of EMBLEM_LAYER_ORDER) {
      if (layerId !== 'body3') expect(afterClear.layers[layerId]).toEqual(fourBodies.layers[layerId]);
    }

    clickAsset('rff-emblems-4', locale);
    expect(layerNames()).toContain(body3Name);
    chooseCategory('detail', locale);
    clickAsset('rff-detail-1', locale);
    clickAsset('rff-detail-1', locale);
    chooseCategory('crest', locale);
    clickAsset('rff-animal-1', locale);
    clickAsset('rff-animal-1', locale);
    const project = await savedProject(locale);
    expect(project.layers.body4).toEqual(afterClear.layers.body4);
    expect(project.layers.body3.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-4' });
    expect(project.layers.body2).toEqual(afterClear.layers.body2);
    expect(project.layers.body1).toEqual(afterClear.layers.body1);
    expect(project.layers.details.elements).toHaveLength(2);
    expect(project.layers.crests.elements).toHaveLength(2);
    expect(Object.keys(project)).toEqual(['schemaVersion', 'canvas', 'layers']);
    expect(downloadedNames).toEqual([
      'emblem-project.json',
      'emblem-project.json',
      'emblem-project.json',
      'emblem-project.json',
    ]);
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:emblem-test');
    expect(document.querySelector('a[download]')).toBeNull();
  });

  it('connects canvas movement, properties, bounds, deletion and current-layer clearing', async () => {
    const copy = getEmblemCreatorCopy('en');
    const bodyAsset = getEmblemCatalogAsset('rff-emblems-1');
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    const bodyId = canvasElementIds()[0];
    fireEvent.keyDown(canvas().querySelector('[data-element-id]')!, { key: 'ArrowRight' });
    expect((screen.getByLabelText(copy.properties.x) as HTMLInputElement).value).toBe('513');
    const x = screen.getByLabelText(copy.properties.x);
    fireEvent.change(x, { target: { value: '300' } }); fireEvent.blur(x);
    const width = screen.getByLabelText(copy.properties.width);
    fireEvent.change(width, { target: { value: '128' } }); fireEvent.blur(width);
    expect((screen.getByLabelText(copy.properties.height) as HTMLInputElement).value)
      .toBe(String(128 * bodyAsset.height / bodyAsset.width));
    fireEvent.change(screen.getByLabelText(copy.properties.rotation), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: copy.properties.applyRotation }));
    fireEvent.click(screen.getByRole('button', { name: copy.properties.mirror }));
    const editBounds = screen.getByLabelText(copy.properties.showEditBounds);
    fireEvent.click(editBounds);
    expect(canvas().querySelector('[data-edit-bounds]')).toBeNull();
    fireEvent.click(editBounds);
    expect(canvas().querySelector('[data-edit-bounds]')).toBeTruthy();
    const project = await savedProject();
    expect(project.layers.body4.elements[0].transform)
      .toEqual({ x: 300, y: 512, scale: 128 / bodyAsset.width, rotation: 30, mirrorX: true });
    chooseCategory('detail');
    clickAsset('rff-detail-1');
    const layerPanel = screen.getByRole('region', { name: copy.panels.layers });
    expect(within(layerPanel).getByRole('button', { name: copy.layers.names.details })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: copy.properties.deleteSelected }));
    expect(canvasElementIds()).toEqual([bodyId]);
    expect(within(layerPanel).queryByRole('button', { name: copy.layers.names.details })).toBeNull();
    expect(screen.getByText(copy.noSelection)).toBeTruthy();
    clickAsset('rff-detail-1');
    fireEvent.click(screen.getByRole('button', { name: copy.layers.clearActiveLayer }));
    expect(canvasElementIds()).toEqual([bodyId]);
    expect((await savedProject()).layers.details.visible).toBe(true);
    const body = canvas().querySelector('[data-element-id]')!;
    fireEvent.keyDown(body, { key: 'Enter' });
    const badX = screen.getByLabelText(copy.properties.x);
    fireEvent.change(badX, { target: { value: '-5' } }); fireEvent.blur(badX);
    expect(screen.getByRole('alert').textContent).toContain('-5');
    expect((await savedProject()).layers.body4.elements[0].transform.x).toBe(300);
  });

  it('adds a URL only after image loading, copying natural dimensions and fitting its aspect ratio', async () => {
    const copy = getEmblemCreatorCopy('en');
    let finishLoad!: (image: HTMLImageElement) => void;
    vi.mocked(loadEmblemImage).mockReturnValueOnce(new Promise((resolve) => { finishLoad = resolve; }));
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    const originalIds = canvasElementIds();
    fireEvent.change(screen.getByLabelText(copy.assets.imageUrl), { target: { value: 'https://example.com/wide.png' } });
    fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));
    expect(loadEmblemImage).toHaveBeenCalledWith('https://example.com/wide.png');
    expect(canvasElementIds()).toEqual(originalIds);
    expect((screen.getByRole('button', { name: copy.toolbar.saveProject }) as HTMLButtonElement).disabled).toBe(true);
    await act(async () => { finishLoad(loadedImage(900, 450)); });
    const project = await savedProject();
    const element = project.layers.body3.elements[0];
    expect(element.source).toEqual({ kind: 'url', url: 'https://example.com/wide.png', naturalWidth: 900, naturalHeight: 450 });
    expect(element.transform.scale).toBe(256 / 900);
    expect(canvasElementIds()).toEqual([...originalIds, element.id]);
    expect((screen.getByLabelText(copy.assets.imageUrl) as HTMLInputElement).value).toBe('');
  });

  it.each(['another body asset is added', 'the original target is cleared'] as const)(
    're-resolves a pending URL target after %s without overwriting a body element', async (changeDuringLoad) => {
      const copy = getEmblemCreatorCopy('en');
      let finishLoad!: (image: HTMLImageElement) => void;
      vi.mocked(loadEmblemImage).mockReturnValueOnce(new Promise((resolve) => { finishLoad = resolve; }));
      render(<EmblemCreatorWorkbench locale="en" copy={copy} />);

      const layerPanel = screen.getByRole('region', { name: copy.panels.layers });
      if (changeDuringLoad === 'the original target is cleared') clickAsset('rff-emblems-1');
      const url = 'https://example.com/pending-subject.png';
      fireEvent.change(screen.getByLabelText(copy.assets.imageUrl), { target: { value: url } });
      fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));

      if (changeDuringLoad === 'another body asset is added') {
        clickAsset('rff-emblems-1');
      } else {
        fireEvent.click(within(layerPanel).getByRole('button', { name: copy.layers.names.body4 }));
        fireEvent.click(within(layerPanel).getByRole('button', { name: copy.layers.clearActiveLayer }));
        expect(within(layerPanel).queryByRole('button', { name: copy.layers.names.body4 })).toBeNull();
      }

      await act(async () => { finishLoad(loadedImage(900, 450)); });
      const project = await savedProject();
      if (changeDuringLoad === 'another body asset is added') {
        expect(project.layers.body4.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-1' });
        expect(project.layers.body3.elements[0]?.source).toMatchObject({ kind: 'url', url });
        expect(canvasElementIds()).toHaveLength(2);
      } else {
        expect(project.layers.body4.elements[0]?.source).toMatchObject({ kind: 'url', url });
        expect(project.layers.body3.elements).toEqual([]);
        expect(canvasElementIds()).toHaveLength(1);
      }
    },
  );

  it('rejects a pending URL when all four body slots fill before commit and preserves their contents', async () => {
    const copy = getEmblemCreatorCopy('zh');
    let finishLoad!: (image: HTMLImageElement) => void;
    vi.mocked(loadEmblemImage).mockReturnValueOnce(new Promise((resolve) => { finishLoad = resolve; }));
    render(<EmblemCreatorWorkbench locale="zh" copy={copy} />);
    clickAsset('rff-emblems-1', 'zh');
    clickAsset('rff-emblems-2', 'zh');
    clickAsset('rff-emblems-3', 'zh');
    const url = 'https://example.com/fifth-subject.png';
    fireEvent.change(screen.getByLabelText(copy.assets.imageUrl), { target: { value: url } });
    fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));
    clickAsset('rff-emblems-4', 'zh');
    const canvasIdsBeforeCompletion = canvasElementIds('zh');

    await act(async () => { finishLoad(loadedImage()); });
    expect(screen.getAllByRole('alert').map((alert) => alert.textContent).join('\n')).toContain(copy.errors.bodyLayersFull);
    expect(screen.getAllByRole('alert').map((alert) => alert.textContent).join('\n')).toContain('4/4');
    expect((screen.getByLabelText(copy.assets.imageUrl) as HTMLInputElement).value).toBe(url);
    expect(canvasElementIds('zh')).toEqual(canvasIdsBeforeCompletion);
    const fullProject = await savedProject('zh');
    expect(fullProject.layers.body4.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-1' });
    expect(fullProject.layers.body3.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-2' });
    expect(fullProject.layers.body2.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-3' });
    expect(fullProject.layers.body1.elements[0]?.source).toMatchObject({ kind: 'catalog', assetId: 'rff-emblems-4' });
  });

  it('rejects invalid URLs before loading and preserves the scene and URL input after image failure', async () => {
    const copy = getEmblemCreatorCopy('en');
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    const originalIds = canvasElementIds();
    const input = screen.getByLabelText(copy.assets.imageUrl);
    fireEvent.change(input, { target: { value: 'javascript:bad' } });
    fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));
    expect(loadEmblemImage).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('javascript:bad');
    vi.mocked(loadEmblemImage).mockRejectedValueOnce(new Error('404 image response'));
    fireEvent.change(input, { target: { value: 'https://example.com/missing.png' } });
    fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));
    await waitFor(() => expect(screen.getAllByRole('alert').map((alert) => alert.textContent).join()).toContain('404 image response'));
    expect(canvasElementIds()).toEqual(originalIds);
    expect((input as HTMLInputElement).value).toBe('https://example.com/missing.png');
    expect(screen.getAllByRole('alert').map((alert) => alert.textContent).join()).toContain('https://example.com/missing.png');
  });

  it.each(['en', 'zh'] as const)('selects, saves, and restores a non-square local PNG in %s', async (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const asset = getEmblemCatalogAsset('rff-detail-1');
    const targetLayerId = targetLayerByCatalogCategory[asset.category];
    render(<EmblemCreatorWorkbench locale={locale} copy={copy} />);
    chooseCategory(asset.category, locale);
    clickAsset(asset.id, locale);

    const saved = await savedProject(locale);
    const element = saved.layers[targetLayerId].elements[0];
    if (!element) throw new Error('The selected RollForFantasy asset was not saved to ' + targetLayerId + '.');
    expect(asset.id.startsWith('rff-')).toBe(true);
    expect(asset.width).toBe(263);
    expect(asset.height).toBe(38);
    expect(asset.publicPath).toMatch(/^\/emblem-creator\/rollforfantasy\/[A-Za-z]+[0-9]+\.png$/);
    expect(asset.width).not.toBe(asset.height);
    expect(element.source).toEqual({
      kind: 'catalog',
      assetId: asset.id,
      url: asset.publicPath,
      naturalWidth: asset.width,
      naturalHeight: asset.height,
    });
    expect(element.transform.scale).toBe(256 / Math.max(asset.width, asset.height));

    const layerPanel = screen.getByRole('region', { name: copy.panels.layers });
    fireEvent.click(within(layerPanel).getByRole('button', { name: copy.layers.names[targetLayerId] }));
    fireEvent.click(within(layerPanel).getByRole('button', { name: copy.layers.clearActiveLayer }));
    expect(canvasElementIds(locale)).toEqual([]);
    vi.mocked(loadEmblemImage).mockClear();
    openFile(projectFile(JSON.stringify(saved), 'rollforfantasy-project.json'), locale);
    await waitFor(() => expect(loadEmblemImage).toHaveBeenCalledExactlyOnceWith(asset.publicPath));
    expect(canvasElementIds(locale)).toEqual([element.id]);
    expect(await savedProject(locale)).toEqual(saved);
  });

  it('opens an existing schema 1 Circle project with its original SVG path and 100 by 100 dimensions', async () => {
    const copy = getEmblemCreatorCopy('en');
    const legacyProject = applyEmblemProjectCommand(createDefaultEmblemProject(), {
      type: 'add-element',
      layerId: 'body4',
      element: createEmblemElement({
        kind: 'catalog',
        assetId: 'body-circle',
        url: '/emblem-creator/original/body-circle.svg',
        naturalWidth: 100,
        naturalHeight: 100,
      }, 'legacy-circle'),
    });
    vi.mocked(loadEmblemImage).mockResolvedValueOnce(loadedImage(100, 100));
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    openFile(projectFile(JSON.stringify(legacyProject), 'legacy-emblem-project.json'));
    await waitFor(() => expect(canvasElementIds()).toEqual(['legacy-circle']));
    expect(loadEmblemImage).toHaveBeenCalledExactlyOnceWith('/emblem-creator/original/body-circle.svg');
    expect(await savedProject()).toEqual(legacyProject);
  });

  it('round-trips actual saved JSON and commits an import only after all visible and hidden images preload', async () => {
    const copy = getEmblemCreatorCopy('en');
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    const saved = await savedProject();
    fireEvent.click(screen.getByRole('button', { name: copy.layers.clearActiveLayer }));
    openFile(projectFile(serializeEmblemProject(saved)));
    await waitFor(() => expect(canvasElementIds()).toEqual(saved.layers.body4.elements.map((element) => element.id)));
    expect(await savedProject()).toEqual(saved);
    const originalIds = canvasElementIds();
    let incoming = addProjectUrl(createDefaultEmblemProject(), 'new-visible', 'https://example.com/one.png', 'body4');
    incoming = addProjectUrl(incoming, 'new-hidden', 'https://example.com/two.png', 'body1');
    incoming = addProjectUrl(incoming, 'duplicate-url', 'https://example.com/one.png', 'details');
    let finishSecond!: (image: HTMLImageElement) => void;
    vi.mocked(loadEmblemImage).mockClear();
    vi.mocked(loadEmblemImage).mockImplementation((url) => url.endsWith('two.png')
      ? new Promise((resolve) => { finishSecond = resolve; }) : Promise.resolve(loadedImage()));
    openFile(projectFile(serializeEmblemProject(incoming)));
    await waitFor(() => expect(loadEmblemImage).toHaveBeenCalledTimes(2));
    expect(loadEmblemImage).toHaveBeenCalledWith('https://example.com/two.png');
    expect(canvasElementIds()).toEqual(originalIds);
    await act(async () => { finishSecond(loadedImage()); });
    expect(canvasElementIds()).toEqual(['new-visible', 'duplicate-url']);
    expect(screen.getByText(copy.noSelection)).toBeTruthy();
    expect(await savedProject()).toEqual(incoming);
  });

  it.each(['oversized', 'malformed', 'unknown asset', 'mismatched catalog URL', 'mismatched catalog dimensions'] as const)(
    'retains the current scene and rejects %s before loading images', async (failure) => {
      const copy = getEmblemCreatorCopy('en');
      render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
      clickAsset('rff-emblems-1');
      const originalIds = canvasElementIds();
      const before = await savedProject();
      const asset = getEmblemCatalogAsset('rff-emblems-2');
      const source = { kind: 'catalog' as const, assetId: failure === 'unknown asset' ? 'missing-body' : asset.id,
        url: failure === 'mismatched catalog URL' ? '/wrong.png' : asset.publicPath,
        naturalWidth: failure === 'mismatched catalog dimensions' ? asset.width + 1 : asset.width, naturalHeight: asset.height };
      const incoming = applyEmblemProjectCommand(createDefaultEmblemProject(), {
        type: 'add-element', layerId: 'body4', element: createEmblemElement(source, 'incoming'),
      });
      const file = projectFile(failure === 'malformed' ? '{broken' : serializeEmblemProject(incoming), `${failure}.json`);
      if (failure === 'oversized') Object.defineProperty(file, 'size', { value: MAX_EMBLEM_PROJECT_FILE_BYTES + 1 });
      openFile(file);
      await waitFor(() => expect(screen.getByRole('alert').textContent).toContain(copy.errors.invalidProject));
      expect(screen.getByRole('alert').textContent).toContain(file.name);
      expect(loadEmblemImage).not.toHaveBeenCalled();
      if (failure === 'oversized') expect(file.text).not.toHaveBeenCalled();
      if (failure === 'unknown asset') expect(screen.getByRole('alert').textContent).toContain('missing-body');
      if (failure === 'mismatched catalog URL') expect(screen.getByRole('alert').textContent).toContain('/wrong.png');
      if (failure === 'mismatched catalog dimensions') expect(screen.getByRole('alert').textContent).toContain(String(asset.width + 1));
      expect(canvasElementIds()).toEqual(originalIds);
      expect(await savedProject()).toEqual(before);
    },
  );

  it('preserves scene/selection after a hidden image import failure and after cancelling the picker', async () => {
    const copy = getEmblemCreatorCopy('en');
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    const before = await savedProject();
    const incoming = addProjectUrl(createDefaultEmblemProject(), 'missing-hidden', 'https://example.com/offline.png', 'body1');
    vi.mocked(loadEmblemImage).mockRejectedValueOnce(new Error('offline decode failure'));
    openFile(projectFile(serializeEmblemProject(incoming)));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('offline decode failure'));
    expect(screen.getByRole('alert').textContent).toContain('https://example.com/offline.png');
    expect(canvasElementIds()).toEqual(before.layers.body4.elements.map((element) => element.id));
    expect(screen.getByRole('button', { name: copy.properties.deleteSelected })).toBeTruthy();
    fireEvent.change(screen.getByLabelText(copy.toolbar.openProject), { target: { files: [] } });
    expect(await savedProject()).toEqual(before);
    expect(loadEmblemImage).toHaveBeenCalledOnce();
  });

  it('awaits PNG export before download and releases its object URL', async () => {
    const copy = getEmblemCreatorCopy('en');
    let finishExport!: (blob: Blob) => void;
    vi.mocked(exportEmblemProjectPng).mockReturnValueOnce(new Promise((resolve) => { finishExport = resolve; }));
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    clickAsset('rff-emblems-1');
    fireEvent.click(screen.getByLabelText(copy.properties.showEditBounds));
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.exportPng }));
    expect(downloadedNames).toEqual([]);
    expect((screen.getByRole('button', { name: copy.toolbar.exporting }) as HTMLButtonElement).disabled).toBe(true);
    const blob = new Blob(['png'], { type: 'image/png' });
    await act(async () => { finishExport(blob); });
    expect(createObjectUrl).toHaveBeenCalledWith(blob);
    expect(downloadedNames).toEqual(['emblem.png']);
    expect(revokeObjectUrl).toHaveBeenCalledOnce();
    expect(document.querySelector('a[download]')).toBeNull();
    expect(Object.keys(vi.mocked(exportEmblemProjectPng).mock.calls[0][0])).toEqual(['schemaVersion', 'canvas', 'layers']);
  });

  it.each(['en', 'zh'] as const)('shows unknown export failures with localized context in %s', async (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    vi.mocked(exportEmblemProjectPng).mockRejectedValueOnce('unexpected canvas failure: 73');
    render(<EmblemCreatorWorkbench locale={locale} copy={copy} />);
    clickAsset('rff-emblems-1', locale);
    const before = canvasElementIds(locale);
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.exportPng }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('unexpected canvas failure: 73'));
    expect(screen.getByRole('alert').textContent).toContain(copy.errorTitle);
    expect(screen.getByRole('alert').textContent).toContain(copy.errors.exportFailed);
    expect(canvasElementIds(locale)).toEqual(before);
    expect(createObjectUrl).not.toHaveBeenCalled();
    expect((screen.getByRole('button', { name: copy.toolbar.exportPng }) as HTMLButtonElement).disabled).toBe(false);
  });

  it.each([
    ['export', 'en'], ['export', 'zh'], ['import', 'en'], ['import', 'zh'], ['add URL', 'en'], ['add URL', 'zh'],
  ] as const)('preserves structured unknown %s failure details and the current project in %s', async (operation, locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const rejection = { reason: 'unexpected encoder failure', code: 73 };
    const imageUrl = 'https://example.com/unknown-failure.png';
    render(<EmblemCreatorWorkbench locale={locale} copy={copy} />);
    clickAsset('rff-emblems-1', locale);
    const before = await savedProject(locale);
    const originalIds = canvasElementIds(locale);
    createObjectUrl.mockClear();
    downloadedNames = [];

    let failurePrefix: string;
    if (operation === 'export') {
      failurePrefix = copy.errors.exportFailed;
      vi.mocked(exportEmblemProjectPng).mockRejectedValueOnce(rejection);
      fireEvent.click(screen.getByRole('button', { name: copy.toolbar.exportPng }));
    } else if (operation === 'import') {
      failurePrefix = copy.errors.invalidProject;
      vi.mocked(loadEmblemImage).mockRejectedValueOnce(rejection);
      const incoming = addProjectUrl(createDefaultEmblemProject(), 'incoming', imageUrl, 'body4');
      openFile(projectFile(serializeEmblemProject(incoming), 'unknown-failure.json'), locale);
    } else {
      failurePrefix = copy.errors.loadImageFailed;
      vi.mocked(loadEmblemImage).mockRejectedValueOnce(rejection);
      fireEvent.change(screen.getByLabelText(copy.assets.imageUrl), { target: { value: imageUrl } });
      fireEvent.click(screen.getByRole('button', { name: copy.assets.addImage }));
    }

    await waitFor(() => {
      const message = screen.getAllByRole('alert')[0].textContent;
      expect(message).toContain(copy.errorTitle);
      expect(message).toContain(failurePrefix);
      expect(message).toContain('"reason": "unexpected encoder failure"');
      expect(message).toContain('"code": 73');
      expect(message).not.toContain('[object Object]');
    });
    const message = screen.getAllByRole('alert')[0].textContent;
    if (operation !== 'export') expect(message).toContain(imageUrl);
    if (operation === 'import') expect(message).toContain('unknown-failure.json');
    if (operation === 'add URL') expect((screen.getByLabelText(copy.assets.imageUrl) as HTMLInputElement).value).toBe(imageUrl);
    expect(canvasElementIds(locale)).toEqual(originalIds);
    expect(screen.getByRole('button', { name: copy.properties.deleteSelected })).toBeTruthy();
    expect((screen.getByRole('button', { name: copy.toolbar.saveProject }) as HTMLButtonElement).disabled).toBe(false);
    expect(createObjectUrl).not.toHaveBeenCalled();
    expect(downloadedNames).toEqual([]);
    expect(await savedProject(locale)).toEqual(before);
    expect(rejection).toEqual({ reason: 'unexpected encoder failure', code: 73 });
  });

  it('shows structured rejection fields without invoking getters or serializing a circular reference', async () => {
    const copy = getEmblemCreatorCopy('en');
    const rejection = { reason: 'unexpected encoder failure', code: BigInt(73) };
    const readDetail = vi.fn(() => { throw new Error('detail getter must not run'); });
    Object.defineProperties(rejection, {
      self: { value: rejection, enumerable: true },
      detail: { get: readDetail, enumerable: true },
    });
    vi.mocked(exportEmblemProjectPng).mockRejectedValueOnce(rejection);
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.exportPng }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('"reason": "unexpected encoder failure"'));
    expect(screen.getByRole('alert').textContent).toContain('"code": 73');
    expect(screen.getByRole('alert').textContent).toContain('"self": [object]');
    expect(screen.getByRole('alert').textContent).toContain('"detail": [accessor]');
    expect(readDetail).not.toHaveBeenCalled();
    expect(createObjectUrl).not.toHaveBeenCalled();
    expect(downloadedNames).toEqual([]);
  });

  it.each(['en', 'zh'] as const)('preserves an Error name and message at the export display boundary in %s', async (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    vi.mocked(exportEmblemProjectPng).mockRejectedValueOnce(new TypeError('unexpected encoder failure: 73'));
    render(<EmblemCreatorWorkbench locale={locale} copy={copy} />);
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.exportPng }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain(`${copy.errors.exportFailed}: TypeError: unexpected encoder failure: 73`));
    expect(createObjectUrl).not.toHaveBeenCalled();
  });

  it('cleans up a failed file download and reports the actual failure', async () => {
    const copy = getEmblemCreatorCopy('en');
    vi.mocked(HTMLAnchorElement.prototype.click).mockImplementationOnce(() => { throw new Error('download blocked: 42'); });
    render(<EmblemCreatorWorkbench locale="en" copy={copy} />);
    fireEvent.click(screen.getByRole('button', { name: copy.toolbar.saveProject }));
    expect(screen.getByRole('alert').textContent).toContain('download blocked: 42');
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:emblem-test');
    expect(document.querySelector('a[download]')).toBeNull();
  });
});
