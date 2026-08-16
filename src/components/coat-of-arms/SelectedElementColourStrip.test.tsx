// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject } from '@/lib/coat-of-arms/types';
import { SelectedElementColourStrip } from './SelectedElementColourStrip';

function createSupportedSelectionProject(): { project: CoatProject; shieldId: string } {
  const project = createDefaultProject('en');
  const shield = project.layers.find((layer) => layer.type === 'shield');
  if (!shield || shield.type !== 'shield') throw new Error('Expected a default shield layer');

  return {
    project: {
      ...project,
      layers: project.layers.map((layer) => layer.id === shield.id ? {
        ...shield,
        field: {
          ...shield.field,
          division: 'per-pale',
          colors: ['#1855A5', '#B11F24'],
          outline: { visible: true, color: '#b11f24', width: 1.5 },
        },
      } : layer),
    },
    shieldId: shield.id,
  };
}

function renderStrip(locale: 'en' | 'zh', project: CoatProject, selectedLayerIds: string[]) {
  useCoatProjectStore.getState().replaceProject(project);
  useCoatProjectStore.getState().setSelectedLayerIds(selectedLayerIds);
  return render(<SelectedElementColourStrip locale={locale} />);
}

function createProjectWithImageLayer(): { project: CoatProject; layerId: string } {
  const projectWithUpload = applyProjectCommand(createDefaultProject('en'), {
    type: 'register-local-upload',
    upload: { id: 'selected-element-colour-upload', mimeType: 'image/svg+xml', encoding: 'base64', data: 'PHN2Zz48L3N2Zz4=' },
  });
  const project = applyProjectCommand(projectWithUpload, {
    type: 'add-image-layer', uploadId: 'selected-element-colour-upload',
  });
  const imageLayer = project.layers.at(-1);
  if (!imageLayer || imageLayer.type !== 'image') throw new Error('Expected a validated image layer');
  return { project, layerId: imageLayer.id };
}

function createProjectWithRasterOrdinaryLayer(): { project: CoatProject; layerId: string } {
  const project = applyProjectCommand(createDefaultProject('en'), {
    type: 'add-layer', assetId: 'material-ordinary-chevron',
  });
  const rasterOrdinaryLayer = project.layers.at(-1);
  if (!rasterOrdinaryLayer || rasterOrdinaryLayer.type !== 'ordinary') {
    throw new Error('Expected a validated raster-backed ordinary layer');
  }
  return { project, layerId: rasterOrdinaryLayer.id };
}

describe('SelectedElementColourStrip', () => {
  beforeEach(() => {
    localStorage.clear();
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each([
    ['when nothing is selected', () => []],
    ['when multiple layers are selected', (project: CoatProject, shieldId: string) => [shieldId, project.layers[0]!.id]],
  ])('hides %s', (_description, selectedLayerIdsFor) => {
    const { project, shieldId } = createSupportedSelectionProject();
    renderStrip('en', project, selectedLayerIdsFor(project, shieldId));

    expect(screen.queryByRole('group', { name: 'Selected element colours' })).toBeNull();
  });

  it('hides a locked selected layer', () => {
    const { project, shieldId } = createSupportedSelectionProject();
    const lockedProject = {
      ...project,
      layers: project.layers.map((layer) => layer.id === shieldId ? { ...layer, locked: true } : layer),
    };
    renderStrip('en', lockedProject, [shieldId]);

    expect(screen.queryByRole('group', { name: 'Selected element colours' })).toBeNull();
  });

  it.each([
    ['background layer', () => {
      const project = createDefaultProject('en');
      return { project, layerId: project.layers[0]!.id };
    }],
    ['image upload layer', createProjectWithImageLayer],
    ['raster-backed ordinary layer', createProjectWithRasterOrdinaryLayer],
  ])('hides an unsupported selected %s', (_description, createUnsupportedSelection) => {
    const { project, layerId } = createUnsupportedSelection();
    renderStrip('en', project, [layerId]);

    expect(screen.queryByRole('group', { name: 'Selected element colours' })).toBeNull();
  });

  it('renders one native colour input for each deduplicated rendered colour', () => {
    const { project, shieldId } = createSupportedSelectionProject();
    renderStrip('en', project, [shieldId]);

    const colourGroup = screen.getByRole('group', { name: 'Selected element colours' });
    const colourInputs = [...colourGroup.querySelectorAll<HTMLInputElement>('input[type="color"]')];
    expect(colourInputs).toHaveLength(2);
    expect(colourInputs.map((input) => input.getAttribute('value'))).toEqual(['#1855A5', '#B11F24']);
  });

  it.each([
    ['en', 'Selected element colours', 'Change element colour: #1855A5'],
    ['zh', '选中元素颜色', '更改元素颜色：#1855A5'],
  ] as const)('uses localized accessible names for %s', (locale, groupLabel, inputLabel) => {
    const { project, shieldId } = createSupportedSelectionProject();
    renderStrip(locale, project, [shieldId]);

    expect(screen.getByRole('group', { name: groupLabel })).toBeDefined();
    expect(screen.getByLabelText(inputLabel).getAttribute('type')).toBe('color');
  });

  it('dispatches one selected-layer replacement command for an actual colour change', () => {
    const { project, shieldId } = createSupportedSelectionProject();
    const originalDispatch = useCoatProjectStore.getState().dispatch;
    const dispatch = vi.fn((command) => originalDispatch(command));
    useCoatProjectStore.setState({ dispatch });
    renderStrip('en', project, [shieldId]);

    fireEvent.change(screen.getByLabelText('Change element colour: #1855A5'), { target: { value: '#004E89' } });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'replace-layer-colour', layerId: shieldId, fromColor: '#1855A5', toColor: '#004e89',
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('does not dispatch when a colour change differs only by case', () => {
    const { project, shieldId } = createSupportedSelectionProject();
    const dispatch = vi.fn(useCoatProjectStore.getState().dispatch);
    useCoatProjectStore.setState({ dispatch });
    renderStrip('en', project, [shieldId]);

    fireEvent.change(screen.getByLabelText('Change element colour: #1855A5'), { target: { value: '#1855a5' } });

    expect(dispatch).not.toHaveBeenCalled();
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it.each([
    ['en', 'Editor action failed: Colour replacement rejected: #004e89'],
    ['zh', '编辑操作失败。请检查输入内容后重试。'],
  ] as const)('renders the existing localized command error instead of swallowing a dispatch failure in %s', (locale, expectedError) => {
    const { project, shieldId } = createSupportedSelectionProject();
    const dispatch = vi.fn(() => { throw new Error('Colour replacement rejected: #004e89'); });
    useCoatProjectStore.setState({ dispatch });
    renderStrip(locale, project, [shieldId]);

    fireEvent.change(screen.getByLabelText(locale === 'en' ? 'Change element colour: #1855A5' : '更改元素颜色：#1855A5'), { target: { value: '#004E89' } });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert').textContent).toBe(expectedError);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('clears a failed colour replacement error when selection changes to another colourable layer', () => {
    const { project, shieldId } = createSupportedSelectionProject();
    const projectWithText = applyProjectCommand(project, {
      type: 'add-text-layer', text: 'HONOUR', color: '#F5E6A1', fontSize: 24,
      alignment: 'center', path: { mode: 'none' },
    });
    const textLayer = projectWithText.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected a colourable text layer');
    const originalDispatch = useCoatProjectStore.getState().dispatch;
    useCoatProjectStore.setState({
      dispatch: vi.fn((command) => {
        if (command.type === 'replace-layer-colour' && command.layerId === shieldId) {
          throw new Error('Colour replacement rejected: #004e89');
        }
        originalDispatch(command);
      }),
    });
    renderStrip('en', projectWithText, [shieldId]);

    fireEvent.change(screen.getByLabelText('Change element colour: #1855A5'), { target: { value: '#004E89' } });
    expect(screen.getByRole('alert').textContent).toBe('Editor action failed: Colour replacement rejected: #004e89');

    act(() => useCoatProjectStore.getState().setSelectedLayerIds([textLayer.id]));

    expect(screen.queryByRole('alert')).toBeNull();
    expect((screen.getByLabelText('Change element colour: #F5E6A1') as HTMLInputElement).value).toBe('#f5e6a1');
  });
});
