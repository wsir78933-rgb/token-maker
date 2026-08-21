// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TextMottoPanel } from './TextMottoPanel';

describe('TextMottoPanel', () => {
  beforeEach(() => {
    let nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `text-panel-${nextId++}` });
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the three competitor text creation cards in order', () => {
    render(<TextMottoPanel locale="en" />);

    const panel = screen.getByRole('region', { name: 'Text & motto' });
    expect(within(panel).getByText('Click to add or drag onto the canvas. Edit text in the toolbar.')).toBeDefined();
    const cards = within(panel).getAllByRole('button');
    expect(cards.map((card) => card.getAttribute('aria-label'))).toEqual(['Text', 'Curved Text', 'Ring Text']);
    expect(cards.every((card) => card.getAttribute('draggable') === 'true')).toBe(true);
  });

  it('creates straight, curved, and ring text through the existing add-text command boundary', () => {
    render(<TextMottoPanel locale="en" />);
    const panel = screen.getByRole('region', { name: 'Text & motto' });

    fireEvent.click(within(panel).getByRole('button', { name: 'Text' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Curved Text' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Ring Text' }));

    expect(useCoatProjectStore.getState().project.layers.slice(-3)).toMatchObject([
      { type: 'text', path: { mode: 'none' } },
      { type: 'text', path: { mode: 'curve', curve: 'upper' } },
      { type: 'text', path: { mode: 'ring', curve: 'clockwise' } },
    ]);
    const newestLayer = useCoatProjectStore.getState().project.layers.at(-1);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([newestLayer?.id]);
  });
});
