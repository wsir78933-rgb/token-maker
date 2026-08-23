// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TextMottoPanel } from './TextMottoPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

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
      {
        type: 'text',
        text: 'Double-click to edit',
        color: '#111111',
        fontSize: 40,
        fontFamily: 'cardinal',
        alignment: 'center',
        path: { mode: 'none' },
        boxWidth: 57,
        transform: { x: 0, y: -47, scale: 1, rotation: 0 },
      },
      {
        type: 'text',
        text: 'Curved Text',
        color: '#111111',
        fontSize: 50,
        fontFamily: 'cardinal',
        alignment: 'center',
        path: {
          mode: 'curve',
          startX: 28,
          startY: 38,
          controlX: 50,
          controlY: 8,
          endX: 72,
          endY: 38,
        },
      },
      {
        type: 'text',
        text: 'Ring Text',
        color: '#111111',
        fontSize: 50,
        fontFamily: 'cardinal',
        alignment: 'center',
        path: {
          mode: 'ring',
          radius: 18,
          facing: 'in',
          layout: 'arc',
          spacing: 'natural',
          startAngle: 0,
        },
      },
    ]);
    const createdLayers = useCoatProjectStore.getState().project.layers.slice(-3);
    expect(createdLayers[1] && 'boxWidth' in createdLayers[1]).toBe(false);
    expect(createdLayers[2] && 'boxWidth' in createdLayers[2]).toBe(false);
    const newestLayer = useCoatProjectStore.getState().project.layers.at(-1);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([newestLayer?.id]);
  });

  it('keeps a distinct default object text on each creation card', () => {
    const englishCards = getCoatWorkbenchCopy('en').panels.textFeature.cards;
    const chineseCards = getCoatWorkbenchCopy('zh').panels.textFeature.cards;
    expect(englishCards.text.defaultText).toBe('Double-click to edit');
    expect(englishCards.curved.defaultText).toBe('Curved Text');
    expect(englishCards.ring.defaultText).toBe('Ring Text');
    expect(chineseCards.text.defaultText).toBe('双击编辑');
    expect(chineseCards.curved.defaultText).toBe('弧形文字');
    expect(chineseCards.ring.defaultText).toBe('环形文字');
    expect(new Set([englishCards.text.defaultText, englishCards.curved.defaultText, englishCards.ring.defaultText]).size).toBe(3);
  });
});
