// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject, getCoatAsset } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import {
  clearLocalUploadBlobMemoryForTests,
  putLocalUploadBlob,
  requireLocalUploadDataUrl,
} from '@/lib/coat-of-arms/local-upload-blobs';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject, LocalUpload } from '@/lib/coat-of-arms/types';
import { LayerPanel } from './LayerPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

const pngMagicBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
const pngBase64 = btoa(String.fromCharCode(...pngMagicBytes));

describe('LayerPanel', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    clearLocalUploadBlobMemoryForTests();
  });

  it('uses the base64 data URL for a local image layer thumbnail', () => {
    const upload: LocalUpload = {
      id: 'base64-png',
      mimeType: 'image/png',
      encoding: 'base64',
      data: pngBase64,
    };
    renderLayerPanel(projectWithImageUpload(upload));

    expect(imageLayerThumbnail().getAttribute('src')).toBe(`data:image/png;base64,${pngBase64}`);
  });

  it('uses the cached indexed-db data URL for a local image layer thumbnail', async () => {
    const blob = new Blob([pngMagicBytes], { type: 'image/png' });
    await putLocalUploadBlob({
      uploadId: 'indexed-png',
      mimeType: 'image/png',
      fileName: 'crest.png',
      blob,
    });
    const upload: LocalUpload = {
      id: 'indexed-png',
      mimeType: 'image/png',
      encoding: 'indexed-db',
      byteLength: blob.size,
    };
    renderLayerPanel(projectWithImageUpload(upload));

    expect(imageLayerThumbnail().getAttribute('src')).toBe(requireLocalUploadDataUrl('indexed-png'));
  });

  it('fails fast with upload id and encoding when an indexed-db thumbnail href cannot be resolved', async () => {
    const blob = new Blob([pngMagicBytes], { type: 'image/png' });
    await putLocalUploadBlob({
      uploadId: 'indexed-png',
      mimeType: 'image/png',
      fileName: 'crest.png',
      blob,
    });
    const upload: LocalUpload = {
      id: 'indexed-png',
      mimeType: 'image/png',
      encoding: 'indexed-db',
      byteLength: blob.size,
    };
    await useCoatProjectStore.getState().replaceProject(projectWithImageUpload(upload));
    clearLocalUploadBlobMemoryForTests();

    expect(() => render(<LayerPanel locale="en" />)).toThrow(
      'Cannot resolve local upload href: indexed-png encoding=indexed-db; Unknown local upload data URL: indexed-png',
    );
  });

  it('deletes the sole shield from the layer row', () => {
    const { id: shieldId, name: shieldName } = requireDefaultNamedLayer('shield');
    render(<LayerPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: getCoatWorkbenchCopy('en').panels.deleteLayer(shieldName) }));

    expect(useCoatProjectStore.getState().project.layers.some((layer) => layer.id === shieldId)).toBe(false);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps the sole background and surfaces the engine rejection', () => {
    const { id: backgroundId, name: backgroundName } = requireDefaultNamedLayer('background');
    render(<LayerPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: getCoatWorkbenchCopy('en').panels.deleteLayer(backgroundName) }));

    expect(useCoatProjectStore.getState().project.layers.some((layer) => layer.id === backgroundId)).toBe(true);
    expect(screen.getByRole('alert').textContent).toBe(
      `Editor action failed: Cannot remove the sole base background layer: ${backgroundId}`,
    );
  });
});

function projectWithImageUpload(upload: LocalUpload): CoatProject {
  const withUpload = applyProjectCommand(createDefaultProject('en'), {
    type: 'register-local-upload',
    upload,
  });
  return applyProjectCommand(withUpload, { type: 'add-image-layer', uploadId: upload.id });
}

function renderLayerPanel(project: CoatProject) {
  useCoatProjectStore.getState().replaceProject(project);
  return render(<LayerPanel locale="en" />);
}

function requireDefaultNamedLayer(type: 'background' | 'shield'): { id: string; name: string } {
  const layer = useCoatProjectStore.getState().project.layers.find((candidate) => candidate.type === type);
  if (!layer || !('assetId' in layer)) throw new Error(`Expected a default ${type} layer with an asset id`);
  return { id: layer.id, name: getCoatAsset(layer.assetId).name.en };
}

function imageLayerThumbnail(): HTMLImageElement {
  const copy = getCoatWorkbenchCopy('en').panels;
  const imageLayerItem = screen.getByRole('listitem', { name: copy.localImage });
  const thumbnail = imageLayerItem.querySelector('img');
  if (!thumbnail) throw new Error(`Expected an image layer thumbnail img in ${copy.localImage}`);
  return thumbnail;
}
