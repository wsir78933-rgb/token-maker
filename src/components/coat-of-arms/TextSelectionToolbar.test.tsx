// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TextSelectionToolbar } from './TextSelectionToolbar';

function createSelectedTextProject() {
  const project = applyProjectCommand(createDefaultProject('en'), {
    type: 'add-text-layer', text: 'EDIT ME', color: '#B11F24', fontSize: 40,
    alignment: 'center', path: { mode: 'none' },
  });
  const textLayer = project.layers.at(-1);
  if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
  useCoatProjectStore.getState().replaceProject(project);
  useCoatProjectStore.getState().setSelectedLayerIds([textLayer.id]);
  return textLayer.id;
}

describe('TextSelectionToolbar', () => {
  beforeEach(() => {
    let nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `toolbar-generated-id-${nextId++}` });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders competitor-order controls for one selected text layer', () => {
    createSelectedTextProject();
    render(<TextSelectionToolbar locale="en" />);

    expect(screen.getByRole('combobox', { name: 'Font' })).toBeDefined();
    expect(screen.getByRole('combobox', { name: 'Font' }).tagName).toBe('SELECT');
    expect(screen.getByRole('spinbutton', { name: 'Font size' })).toHaveProperty('value', '40');
    expect(screen.getByLabelText('Text colour picker')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Underline' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Left' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Center' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Right' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Styles' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Lock' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Hide' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Duplicate' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDefined();
  });

  it('uses a native font select and keeps the colour input outside interactive buttons', () => {
    const textLayerId = createSelectedTextProject();
    render(<TextSelectionToolbar locale="en" />);

    const fontSelect = screen.getByRole('combobox', { name: 'Font' }) as HTMLSelectElement;
    fireEvent.change(fontSelect, { target: { value: 'blackletter' } });
    expect(useCoatProjectStore.getState().project.layers.find((layer) => layer.id === textLayerId)).toMatchObject({ fontFamily: 'blackletter' });
    const colourInput = screen.getByLabelText('Text colour picker');
    expect(colourInput.closest('button')).toBeNull();
  });

  it('applies typography, alignment, and stroke edits live through public commands', () => {
    const textLayerId = createSelectedTextProject();
    render(<TextSelectionToolbar locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    fireEvent.click(screen.getByRole('button', { name: 'Underline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Left' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Font size' }), { target: { value: '56' } });
    fireEvent.click(screen.getByRole('button', { name: 'Styles' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Stroke width' }), { target: { value: '1.5' } });

    const editedText = useCoatProjectStore.getState().project.layers.find((layer) => layer.id === textLayerId);
    expect(editedText).toMatchObject({
      type: 'text', fontWeight: 'bold', fontStyle: 'italic', underline: true, alignment: 'left', fontSize: 56, strokeWidth: 1.5,
    });
  });
});
