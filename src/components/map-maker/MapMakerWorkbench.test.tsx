// @vitest-environment jsdom

import { cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getMapMakerCopy } from '@/lib/map-maker/copy';

import { MapMakerWorkbench } from './MapMakerWorkbench';

afterEach(cleanup);

describe('MapMakerWorkbench', () => {
  it('adds a label ready for inline editing and safely finishes from the toolbar', () => {
    const copy = getMapMakerCopy('en').workspace;
    render(<MapMakerWorkbench copy={copy} />);

    fireEvent.click(screen.getByRole('button', { name: copy.canvas.addLabel }));
    const labelEditor = screen.getByTestId(/map-maker-label-editor-/);
    const finishButton = screen.getByRole('button', { name: copy.canvas.finishLabelEdit });
    fireEvent.change(labelEditor, { target: { value: 'Mist Sea\nThe Shrouded Coast' } });

    const pointerDown = createEvent.pointerDown(finishButton, { button: 0, pointerId: 1, isPrimary: true });
    fireEvent(finishButton, pointerDown);
    fireEvent.blur(labelEditor, { relatedTarget: finishButton });
    expect(pointerDown.defaultPrevented).toBe(true);
    expect(screen.getByTestId(/map-maker-label-editor-/)).toBeTruthy();

    fireEvent.click(finishButton);
    expect(screen.queryByTestId(/map-maker-label-editor-/)).toBeNull();
    expect(screen.getByRole('button', { name: copy.canvas.editLabel })).toBeTruthy();
  });

  it('keeps the selected asset category and placement mode when a mobile material sheet closes', () => {
    const copy = getMapMakerCopy('zh').workspace;
    render(<MapMakerWorkbench copy={copy} />);

    fireEvent.click(screen.getByRole('button', { name: copy.materials.title }));
    const assetTabs = screen.getAllByRole('tab', { name: copy.materials.elementsTab });
    fireEvent.click(assetTabs[assetTabs.length - 1]!);
    const structuresCategory = screen.getByTestId('map-maker-category-structures');
    fireEvent.click(structuresCategory);
    const freePlaceLabel = screen.getAllByText(copy.materials.placementMode.freePlace).at(-1);
    if (freePlaceLabel === undefined) throw new Error('Expected the free placement option.');
    const freePlaceInput = freePlaceLabel.closest('label')?.querySelector('input');
    if (!(freePlaceInput instanceof HTMLInputElement)) throw new Error('Expected the free placement radio input.');
    expect(freePlaceInput.checked).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: copy.common.close }));
    fireEvent.click(screen.getByRole('button', { name: copy.materials.title }));

    const reopenedStructuresCategory = screen.getByTestId('map-maker-category-structures');
    expect(reopenedStructuresCategory.getAttribute('aria-pressed')).toBe('true');
    const reopenedFreePlaceLabel = screen.getAllByText(copy.materials.placementMode.freePlace).at(-1);
    const reopenedFreePlaceInput = reopenedFreePlaceLabel?.closest('label')?.querySelector('input');
    expect(reopenedFreePlaceInput?.checked).toBe(true);
  });

  it('gives each mounted layer and properties panel its own heading ID', () => {
    const copy = getMapMakerCopy('en').workspace;
    render(<MapMakerWorkbench copy={copy} />);

    const sectionsForHeading = (headingText: string) => Array.from(document.querySelectorAll('section[aria-labelledby]'))
      .filter((section) => section.querySelector('h3')?.textContent === headingText);
    const panels = [
      { title: copy.layers.title, sections: sectionsForHeading(copy.layers.title) },
      { title: copy.properties.title, sections: sectionsForHeading(copy.properties.title) },
    ];

    for (const panel of panels) {
      expect(panel.sections).toHaveLength(2);
      const headingIds = panel.sections.map((section) => section.getAttribute('aria-labelledby'));
      expect(new Set(headingIds).size).toBe(2);
      for (const [index, section] of panel.sections.entries()) {
        const headingId = headingIds[index];
        expect(section.querySelector('h3')?.id).toBe(headingId);
        expect(Array.from(document.querySelectorAll('[id]')).filter((element) => element.id === headingId)).toHaveLength(1);
      }
    }
  });
});
