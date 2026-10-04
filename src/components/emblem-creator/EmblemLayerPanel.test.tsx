// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { applyEmblemProjectCommand, createDefaultEmblemProject, createEmblemElement } from '@/lib/emblem-creator/project';
import { EMBLEM_LAYER_ORDER, type EmblemLayerId, type EmblemLocale, type EmblemProject } from '@/lib/emblem-creator/types';

import { EmblemLayerPanel } from './EmblemLayerPanel';

afterEach(cleanup);

function createLayeredProject(): EmblemProject {
  let project = createDefaultEmblemProject();
  for (const layerId of EMBLEM_LAYER_ORDER) {
    project = applyEmblemProjectCommand(project, {
      type: 'add-element', layerId,
      element: createEmblemElement({ kind: 'url', url: '/layer.png', naturalWidth: 100, naturalHeight: 100 }, `${layerId}-element`),
    });
  }
  return project;
}

function LayerHarness({ locale }: { locale: EmblemLocale }) {
  const [project, setProject] = useState(createLayeredProject);
  const [activeLayerId, setActiveLayerId] = useState<EmblemLayerId>('body4');
  return <>
    <EmblemLayerPanel locale={locale} copy={getEmblemCreatorCopy(locale)} project={project}
      activeLayerId={activeLayerId} onActiveLayerChange={setActiveLayerId}
      onVisibilityChange={(layerId, visible) => setProject(applyEmblemProjectCommand(project, { type: 'set-layer-visibility', layerId, visible }))}
      onClearActiveLayer={() => setProject(applyEmblemProjectCommand(project, { type: 'clear-layer', layerId: activeLayerId }))} />
    <output aria-hidden="true" data-testid="project">{JSON.stringify(project)}</output>
  </>;
}

function currentProject(): EmblemProject {
  return JSON.parse(screen.getByTestId('project').textContent!);
}

describe('EmblemLayerPanel', () => {
  it('renders no layer rows when all six fixed layers are empty', () => {
    const copy = getEmblemCreatorCopy('en');
    render(<EmblemLayerPanel locale="en" copy={copy} project={createDefaultEmblemProject()} activeLayerId="body4"
      onActiveLayerChange={vi.fn()} onVisibilityChange={vi.fn()} onClearActiveLayer={vi.fn()} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it.each(['en', 'zh'] as const)('keeps six fixed rows and independently toggles every real layer in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    render(<LayerHarness locale={locale} />);
    const projectBefore = currentProject();
    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(6);
    expect(rows.map((row) => within(row).getAllByRole('button')[0].textContent)).toEqual(EMBLEM_LAYER_ORDER.map((id) => copy.layers.names[id]));
    for (const layerId of EMBLEM_LAYER_ORDER) {
      const name = copy.layers.names[layerId];
      const layerBefore = currentProject().layers[layerId];
      const action = layerBefore.visible ? copy.layers.hideLayer : copy.layers.showLayer;
      fireEvent.click(screen.getByRole('button', { name: `${action}: ${name}` }));
      const projectAfter = currentProject();
      expect(projectAfter.layers[layerId].visible).toBe(!layerBefore.visible);
      expect(projectAfter.layers[layerId].elements).toEqual(layerBefore.elements);
      expect(screen.getAllByRole('listitem').some((row) => within(row).getAllByRole('button')[0].textContent === name)).toBe(true);
      const reverseAction = layerBefore.visible ? copy.layers.showLayer : copy.layers.hideLayer;
      fireEvent.click(screen.getByRole('button', { name: `${reverseAction}: ${name}` }));
    }
    expect(currentProject()).toEqual(projectBefore);
    expect(screen.getByRole('button', { name: copy.layers.names.body4 }).getAttribute('aria-pressed')).toBe('true');
  });

  it.each(['crests', 'details', 'body1', 'body2', 'body3', 'body4'] as const)('selects and clears only active %s while preserving visibility and the other five layers', (layerId) => {
    const copy = getEmblemCreatorCopy('en');
    render(<LayerHarness locale="en" />);
    const projectBefore = currentProject();
    const activeButton = screen.getByRole('button', { name: copy.layers.names[layerId] });
    fireEvent.click(activeButton);
    expect(activeButton.getAttribute('aria-pressed')).toBe('true');
    expect(currentProject()).toEqual(projectBefore);
    fireEvent.click(screen.getByRole('button', { name: copy.layers.clearActiveLayer }));
    const projectAfter = currentProject();
    expect(projectAfter.layers[layerId].elements).toEqual([]);
    expect(projectAfter.layers[layerId].visible).toBe(projectBefore.layers[layerId].visible);
    expect(screen.getAllByRole('listitem').map((row) => within(row).getAllByRole('button')[0].textContent))
      .toEqual(EMBLEM_LAYER_ORDER.filter((id) => id !== layerId).map((id) => copy.layers.names[id]));
    expect(screen.getByRole('status').textContent).toBe(`${copy.layers.names[layerId]}: ${copy.layers.emptyLayer}`);
    for (const otherLayerId of EMBLEM_LAYER_ORDER) {
      if (otherLayerId !== layerId) expect(projectAfter.layers[otherLayerId]).toEqual(projectBefore.layers[otherLayerId]);
    }
    fireEvent.click(screen.getByRole('button', { name: copy.layers.clearActiveLayer }));
    expect(currentProject()).toEqual(projectAfter);
    expect(screen.getByRole('status').textContent).toContain(copy.layers.emptyLayer);
  });

  it('reports a rejected layer operation with its actual layer and failure', () => {
    const copy = getEmblemCreatorCopy('zh');
    render(<EmblemLayerPanel locale="zh" copy={copy} project={createLayeredProject()} activeLayerId="details"
      onActiveLayerChange={vi.fn()} onVisibilityChange={vi.fn()}
      onClearActiveLayer={() => { throw new Error('clear rejected at boundary'); }} />);
    fireEvent.click(screen.getByRole('button', { name: copy.layers.clearActiveLayer }));
    expect(screen.getByRole('alert').textContent).toContain(copy.layers.names.details);
    expect(screen.getByRole('alert').textContent).toContain('clear rejected at boundary');
  });
});
