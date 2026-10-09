// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { CastleProject } from '@/lib/castle-creator/types';
import { CastleSettingsPanel } from './CastleSettingsPanel';

function createProject(overrides: Partial<CastleProject> = {}): CastleProject {
  return {
    version: 1,
    pieces: [],
    activeLayer: 'lower',
    visibleLayers: { lower: true, middle: true, upper: true },
    canvas: {
      width: 0,
      height: 0,
      backgroundColor: '#ffffff',
      backgroundImageUrl: null,
    },
    palette: { building: 1, roof: 1 },
    snapEnabled: false,
    resizeEnabled: true,
    ...overrides,
  };
}

describe('CastleSettingsPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps layers and canvas settings independently collapsed and expandable', () => {
    const copy = getCastleCreatorCopy('en');
    const onActiveLayerChange = vi.fn();
    const onLayerVisibilityChange = vi.fn();
    const onClearLayer = vi.fn();
    render(
      <CastleSettingsPanel
        locale="en"
        onActiveLayerChange={onActiveLayerChange}
        onCanvasSettingsChange={vi.fn()}
        onClearAll={vi.fn()}
        onClearLayer={onClearLayer}
        onLayerVisibilityChange={onLayerVisibilityChange}
        project={createProject()}
      />,
    );

    const settingsScrollSurface = screen.getByRole('region', { name: copy.settings.panelHeading });
    expect(settingsScrollSurface.getAttribute('data-castle-settings-scroll')).toBe('true');
    expect(settingsScrollSurface.className).toContain('h-[244px]');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.queryByLabelText(copy.settings.canvasWidthLabel)).toBeNull();

    const layersToggle = screen.getByRole('button', { name: copy.settings.layersHeading });
    const canvasToggle = screen.getByRole('button', { name: copy.settings.canvasHeading });
    fireEvent.click(layersToggle);

    expect(screen.getByRole('listbox', { name: copy.settings.layersHeading })).toBeDefined();
    expect(screen.queryByLabelText(copy.settings.canvasWidthLabel)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: copy.editor.activeLayerLabel('middle') }));
    fireEvent.click(screen.getByRole('checkbox', { name: `${copy.settings.layerVisibilityLabel}: ${copy.editor.layerLabels.middle}` }));
    fireEvent.click(screen.getByRole('button', { name: `${copy.settings.clearLayerLabel}: ${copy.editor.layerLabels.upper}` }));

    expect(onActiveLayerChange).toHaveBeenCalledWith('middle');
    expect(onLayerVisibilityChange).toHaveBeenCalledWith('middle', false);
    expect(onClearLayer).toHaveBeenCalledWith('upper');

    fireEvent.click(layersToggle);
    expect(screen.queryByRole('listbox')).toBeNull();
    fireEvent.click(canvasToggle);
    expect(screen.getByLabelText(copy.settings.canvasWidthLabel)).toBeDefined();
    expect(screen.queryByRole('listbox')).toBeNull();
    fireEvent.click(canvasToggle);
    expect(screen.queryByLabelText(copy.settings.canvasWidthLabel)).toBeNull();
  });

  it('applies background, URL, and zero-aware canvas settings through one public callback', () => {
    const onCanvasSettingsChange = vi.fn();
    const copy = getCastleCreatorCopy('zh');
    render(
      <CastleSettingsPanel
        locale="zh"
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={onCanvasSettingsChange}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={createProject()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.canvasHeading }));

    fireEvent.change(screen.getByLabelText(copy.settings.backgroundImageUrlLabel), {
      target: { value: '  https://example.test/castle.webp  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.settings.backgroundImageApplyLabel }));
    fireEvent.change(screen.getByLabelText(copy.settings.backgroundColorLabel), {
      target: { value: '#112233' },
    });
    fireEvent.change(screen.getByLabelText(copy.settings.canvasWidthLabel), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(copy.settings.canvasHeightLabel), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: copy.settings.applyCanvasSizeLabel }));

    expect(onCanvasSettingsChange).toHaveBeenNthCalledWith(1, expect.objectContaining({
      backgroundImageUrl: 'https://example.test/castle.webp',
    }));
    expect(onCanvasSettingsChange).toHaveBeenNthCalledWith(2, expect.objectContaining({
      backgroundColor: '#112233',
    }));
    expect(onCanvasSettingsChange).toHaveBeenNthCalledWith(3, expect.objectContaining({
      width: 0,
      height: 0,
    }));
  });

  it('shows known callback errors and rejects invalid dimensions with the received value', () => {
    const copy = getCastleCreatorCopy('en');
    const onCanvasSettingsChange = vi.fn(() => {
      throw new Error('canvas callback rejected this settings value');
    });
    render(
      <CastleSettingsPanel
        locale="en"
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={onCanvasSettingsChange}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={createProject()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.canvasHeading }));
    fireEvent.change(screen.getByLabelText(copy.settings.backgroundColorLabel), {
      target: { value: '#112233' },
    });
    expect(screen.getByRole('alert').textContent).toContain('canvas callback rejected this settings value');

    fireEvent.change(screen.getByLabelText(copy.settings.canvasWidthLabel), { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: copy.settings.applyCanvasSizeLabel }));
    expect(screen.getByRole('alert').textContent).toContain('Received "-1"');
  });

  it('synchronizes draft fields when a loaded project changes', async () => {
    const copy = getCastleCreatorCopy('en');
    const firstProject = createProject();
    const { rerender } = render(
      <CastleSettingsPanel
        locale="en"
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={vi.fn()}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={firstProject}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.canvasHeading }));

    const loadedProject = createProject({
      canvas: {
        width: 720,
        height: 635,
        backgroundColor: '#000000',
        backgroundImageUrl: 'https://example.test/loaded.webp',
      },
    });
    rerender(
      <CastleSettingsPanel
        locale="en"
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={vi.fn()}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={loadedProject}
      />,
    );

    await waitFor(() => {
      expect((screen.getByLabelText(copy.settings.backgroundImageUrlLabel) as HTMLInputElement).value)
        .toBe('https://example.test/loaded.webp');
      expect((screen.getByLabelText(copy.settings.canvasWidthLabel) as HTMLInputElement).value)
        .toBe('720');
      expect((screen.getByLabelText(copy.settings.canvasHeightLabel) as HTMLInputElement).value)
        .toBe('635');
    });
  });

  it('generates a distinct labelled background URL id for each mounted panel', () => {
    const copy = getCastleCreatorCopy('en');
    const project = createProject();
    render(
      <>
        <CastleSettingsPanel
          locale="en"
          onActiveLayerChange={vi.fn()}
          onCanvasSettingsChange={vi.fn()}
          onClearAll={vi.fn()}
          onClearLayer={vi.fn()}
          onLayerVisibilityChange={vi.fn()}
          project={project}
        />
        <CastleSettingsPanel
          locale="en"
          onActiveLayerChange={vi.fn()}
          onCanvasSettingsChange={vi.fn()}
          onClearAll={vi.fn()}
          onClearLayer={vi.fn()}
          onLayerVisibilityChange={vi.fn()}
          project={project}
        />
      </>,
    );

    screen.getAllByRole('button', { name: copy.settings.canvasHeading }).forEach((toggle) => {
      fireEvent.click(toggle);
    });
    const inputs = screen.getAllByLabelText(copy.settings.backgroundImageUrlLabel) as HTMLInputElement[];
    const inputIds = inputs.map((input) => input.id);
    expect(new Set(inputIds).size).toBe(2);
    expect(inputIds.every((inputId) => inputId.length > 0)).toBe(true);
    expect(inputs.every((input) => (
      [...document.querySelectorAll('label')].some((label) => label.htmlFor === input.id)
    ))).toBe(true);
  });
});
