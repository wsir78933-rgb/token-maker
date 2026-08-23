// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject } from '@/lib/coat-of-arms/types';
import { useCoatKeyboardShortcuts } from './useCoatKeyboardShortcuts';

let idNumber = 0;

function createKeyboardProject(): CoatProject {
  const project = createDefaultProject('en');
  const stableProject: CoatProject = {
    ...project,
    layers: project.layers.map((layer, index) => ({ ...layer, id: index === 0 ? 'background-1' : 'shield-1' })),
  };
  const withFirstCharge = applyProjectCommand(stableProject, { type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
  const withSecondCharge = applyProjectCommand(withFirstCharge, { type: 'add-layer', assetId: 'material-symbol-shooting-star' });
  return {
    ...withSecondCharge,
    layers: withSecondCharge.layers.map((layer, index) => {
      if (index === 2 && layer.type === 'charge') {
        return { ...layer, id: 'charge-1', transform: { ...layer.transform, scale: 1 } };
      }
      if (index === 3 && layer.type === 'charge') {
        return { ...layer, id: 'charge-2', transform: { ...layer.transform, scale: 1 } };
      }
      return layer;
    }),
  };
}

function ShortcutHarness({ selectedLayerIds }: { selectedLayerIds: string[] }) {
  const { selection } = useCoatKeyboardShortcuts({ initialSelection: selectedLayerIds });
  return <><div data-testid="selection">{selection.join(',')}</div><input aria-label="Project name" /></>;
}

function TransformShortcutHarness({ selectedLayerIds }: { selectedLayerIds: string[] }) {
  const { adjustSelectedTransform } = useCoatKeyboardShortcuts({ initialSelection: selectedLayerIds });
  return <>
    <button type="button" onClick={() => adjustSelectedTransform({ scale: 0.1 })}>Scale selected layers</button>
    <button type="button" onClick={() => adjustSelectedTransform({ rotation: 15 })}>Rotate selected layers</button>
  </>;
}

function DialogShortcutHarness() {
  useCoatKeyboardShortcuts({ initialSelection: ['charge-1'] });
  return <section role="dialog" aria-label="Example dialog"><button type="button">Delete saved project</button></section>;
}

function EditorOverlayShortcutHarness() {
  useCoatKeyboardShortcuts({ initialSelection: ['charge-1'] });
  return <section aria-label="Local export options" data-coat-editor-overlay><button type="button">Close export menu</button></section>;
}

function renderShortcuts(selectedLayerIds: string[] = ['charge-1'], project: CoatProject = createKeyboardProject()) {
  useCoatProjectStore.getState().replaceProject(project);
  return render(<ShortcutHarness selectedLayerIds={selectedLayerIds} />);
}

describe('useCoatKeyboardShortcuts', () => {
  beforeEach(() => {
    idNumber = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `shortcut-id-${idNumber++}` });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('does not delete a selected layer while a text input owns focus', () => {
    renderShortcuts();
    const input = screen.getByRole('textbox', { name: 'Project name' });
    input.focus();
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.id)).toContain('charge-1');
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('does not execute canvas shortcuts from inside an open dialog', () => {
    useCoatProjectStore.getState().replaceProject(createKeyboardProject());
    render(<DialogShortcutHarness />);

    fireEvent.keyDown(screen.getByRole('button', { name: 'Delete saved project' }), { key: 'Delete' });

    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.id)).toContain('charge-1');
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('does not execute canvas shortcuts from an editor overlay', () => {
    useCoatProjectStore.getState().replaceProject(createKeyboardProject());
    render(<EditorOverlayShortcutHarness />);
    const closeExportMenu = screen.getByRole('button', { name: 'Close export menu' });
    const chargeBeforeShortcut = useCoatProjectStore.getState().project.layers.find((layer) => layer.id === 'charge-1');

    fireEvent.keyDown(closeExportMenu, { key: 'ArrowRight' });
    fireEvent.keyDown(closeExportMenu, { key: 'Delete' });
    fireEvent.keyDown(closeExportMenu, { key: 'z', ctrlKey: true });

    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === 'charge-1')).toEqual(chargeBeforeShortcut);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('removes an unlocked selection with one history command and ignores a locked selection', () => {
    renderShortcuts();
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.id)).not.toContain('charge-1');
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);

    const locked = applyProjectCommand(createKeyboardProject(), {
      type: 'set-layer-lock', layerId: 'charge-1', locked: true,
    });
    useCoatProjectStore.getState().replaceProject(locked);
    cleanup();
    render(<ShortcutHarness selectedLayerIds={['charge-1']} />);
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.id)).toContain('charge-1');
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('removes the sole shield with keyboard deletion', () => {
    renderShortcuts(['shield-1']);

    fireEvent.keyDown(window, { key: 'Delete' });

    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.id)).not.toContain('shield-1');
    expect(screen.getByTestId('selection').textContent).toBe('');
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('keeps the sole background selected when keyboard deletion is attempted', () => {
    renderShortcuts(['background-1']);

    fireEvent.keyDown(window, { key: 'Backspace' });

    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.id)).toContain('background-1');
    expect(screen.getByTestId('selection').textContent).toBe('background-1');
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('moves every selected unlocked layer with arrow keys and uses the Shift step', () => {
    renderShortcuts(['charge-1', 'charge-2']);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowDown', shiftKey: true });

    const selected = useCoatProjectStore.getState().project.layers.filter((layer) => layer.id.startsWith('charge-'));
    expect(selected).toMatchObject([
      { id: 'charge-1', transform: { x: 1, y: 10 } },
      { id: 'charge-2', transform: { x: 1, y: 10 } },
    ]);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
  });

  it('scales and rotates every selected layer while retaining independent scale axes', () => {
    const withIndependentAxes = applyProjectCommand(createKeyboardProject(), {
      type: 'update-layer',
      layerId: 'charge-1',
      patch: { transform: { x: 0, y: 0, scale: 1, scaleX: 2, scaleY: 0.5, rotation: 0 } },
    });
    useCoatProjectStore.getState().replaceProject(withIndependentAxes);
    render(<TransformShortcutHarness selectedLayerIds={['charge-1', 'charge-2']} />);
    useCoatProjectStore.getState().setSelectedLayerIds(['charge-1', 'charge-2']);

    fireEvent.click(screen.getByRole('button', { name: 'Scale selected layers' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rotate selected layers' }));

    expect(useCoatProjectStore.getState().project.layers.filter((layer) => layer.id.startsWith('charge-'))).toMatchObject([
      { id: 'charge-1', transform: { scale: 1.1, scaleX: 2.2, scaleY: 0.55, rotation: 15 } },
      { id: 'charge-2', transform: { scale: 1.1, rotation: 15 } },
    ]);
  });

  it('copies and pastes every selected layer through the validated duplicate command', () => {
    renderShortcuts(['background-1', 'shield-1', 'charge-1']);
    fireEvent.keyDown(window, { key: 'c', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'v', ctrlKey: true });

    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.type)).toEqual([
      'background', 'shield', 'charge', 'charge', 'background', 'shield', 'charge',
    ]);
    const pastedSelection = screen.getByTestId('selection').textContent?.split(',') ?? [];
    expect(pastedSelection).toHaveLength(3);
    expect(pastedSelection).not.toEqual(['background-1', 'shield-1', 'charge-1']);
  });

  it('does not dispatch or throw when paste has no valid copied layers', () => {
    renderShortcuts(['charge-1']);

    fireEvent.keyDown(window, { key: 'v', ctrlKey: true });

    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.id)).toHaveLength(4);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('groups, ungroups, undoes, and redoes a multi-selection through store commands', () => {
    renderShortcuts(['charge-1', 'charge-2']);
    fireEvent.keyDown(window, { key: 'g', ctrlKey: true });
    const groupId = useCoatProjectStore.getState().project.layers.find((layer) => layer.id === 'charge-1')?.groupId;
    expect(groupId).toMatch(/^shortcut-id-/);
    fireEvent.keyDown(window, { key: 'g', ctrlKey: true, shiftKey: true });
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === 'charge-1')?.groupId).toBeNull();
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === 'charge-1')?.groupId).toBe(groupId);
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true, shiftKey: true });
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === 'charge-1')?.groupId).toBeNull();
  });
});
