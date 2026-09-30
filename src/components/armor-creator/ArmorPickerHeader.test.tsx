// @vitest-environment jsdom

import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArmorPickerActions, ArmorPickerHeader } from '@/components/armor-creator/ArmorPickerHeader';
import type { ArmorGender } from '@/lib/armor-creator/catalog';
import { getArmorCreatorCopy, type ArmorCreatorCopy } from '@/lib/armor-creator/copy';

const SELECTED_CLASS =
  'border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)]';
const IDLE_CLASS = 'border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-[var(--site-ink)]';
const DISABLED_CLASS = 'disabled:cursor-not-allowed disabled:opacity-40';

function armorPickerHeaderElement(container: HTMLElement): HTMLElement {
  const header = container.firstElementChild;
  if (!(header instanceof HTMLElement)) {
    throw new Error(`Armor picker header expected an element. Received ${String(header)}.`);
  }

  return header;
}

function armorPickerHeaderRows(header: HTMLElement): [HTMLElement, HTMLElement] {
  const firstRow = header.children[0];
  const secondRow = header.children[1];
  if (!(firstRow instanceof HTMLElement) || !(secondRow instanceof HTMLElement) || header.children.length !== 2) {
    throw new Error(`Armor picker header expected 2 rows. Received ${header.children.length}.`);
  }

  return [firstRow, secondRow];
}

function buttonLabels(row: HTMLElement): string[] {
  return within(row)
    .getAllByRole('button')
    .map((button) => {
      const label = button.textContent;
      if (label === null || label.length === 0) {
        throw new Error(`Armor picker button is missing its label. Received ${String(label)}.`);
      }

      return label;
    });
}

function buttonNamed(row: HTMLElement, name: string): HTMLButtonElement {
  const button = within(row).getByRole('button', { name });
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Expected a button named ${JSON.stringify(name)}. Received ${button.tagName}.`);
  }

  return button;
}

function renderArmorPickerHeader(copy: ArmorCreatorCopy) {
  const onGender = vi.fn();
  const onMaterial = vi.fn();
  const view = render(
    <ArmorPickerHeader copy={copy} gender="male" material="plate" onGender={onGender} onMaterial={onMaterial} />,
  );

  return {
    ...view,
    onGender,
    onMaterial,
  };
}

function renderArmorPickerActions(copy: ArmorCreatorCopy, chestCurveEnabled: boolean) {
  const onShoulderSymmetry = vi.fn();
  const onChestCurve = vi.fn();
  const onClear = vi.fn();
  const onDownload = vi.fn();
  const view = render(
    <ArmorPickerActions
      copy={copy}
      shoulderSymmetry
      chestCurve
      chestCurveEnabled={chestCurveEnabled}
      onShoulderSymmetry={onShoulderSymmetry}
      onChestCurve={onChestCurve}
      onClear={onClear}
      onDownload={onDownload}
    />,
  );

  return {
    ...view,
    onShoulderSymmetry,
    onChestCurve,
    onClear,
    onDownload,
  };
}

describe('ArmorPickerHeader', () => {
  afterEach(() => {
    cleanup();
  });

  it('stretches gender across one row and materials across the next', () => {
    const copy = getArmorCreatorCopy('zh');
    const { container } = renderArmorPickerHeader(copy);
    const header = armorPickerHeaderElement(container);
    const [choiceRow, materialRow] = armorPickerHeaderRows(header);

    expect(header.className).toBe('space-y-2');
    expect(choiceRow.className).toBe('grid grid-cols-2 gap-2');
    expect(materialRow.className).toBe('grid grid-cols-3 gap-2');
    expect(buttonLabels(choiceRow)).toEqual([copy.genderMale, copy.genderFemale]);
    expect(buttonLabels(materialRow)).toEqual([copy.materialPlate, copy.materialLeather, copy.materialCloth]);

    const maleButton = buttonNamed(choiceRow, copy.genderMale);
    const femaleButton = buttonNamed(choiceRow, copy.genderFemale);
    const plateButton = buttonNamed(materialRow, copy.materialPlate);

    expect(maleButton.getAttribute('aria-pressed')).toBe('true');
    expect(femaleButton.getAttribute('aria-pressed')).toBe('false');
    expect(plateButton.getAttribute('aria-pressed')).toBe('true');
    expect(maleButton.className).toContain('w-full');
    expect(femaleButton.className).toContain('w-full');
    expect(plateButton.className).toContain('w-full');
    expect(maleButton.className).toContain(SELECTED_CLASS);
    expect(plateButton.className).toContain(SELECTED_CLASS);
    expect(femaleButton.className).toContain(IDLE_CLASS);
    expect(maleButton.getAttribute('type')).toBe('button');
  });

  it('calls the gender and material callbacks', () => {
    const copy = getArmorCreatorCopy('zh');
    const { container, onGender, onMaterial } = renderArmorPickerHeader(copy);
    const [choiceRow, materialRow] = armorPickerHeaderRows(armorPickerHeaderElement(container));

    fireEvent.click(buttonNamed(choiceRow, copy.genderFemale));
    fireEvent.click(buttonNamed(choiceRow, copy.genderMale));
    fireEvent.click(buttonNamed(materialRow, copy.materialLeather));
    fireEvent.click(buttonNamed(materialRow, copy.materialCloth));
    fireEvent.click(buttonNamed(materialRow, copy.materialPlate));

    expect(onGender.mock.calls).toEqual([['female'], ['male']]);
    expect(onMaterial.mock.calls).toEqual([['leather'], ['cloth'], ['plate']]);
  });

  it('stretches the four preview actions across one row', () => {
    const copy = getArmorCreatorCopy('zh');
    const { container } = renderArmorPickerActions(copy, false);
    const actions = armorPickerHeaderElement(container);

    expect(actions.className).toBe('grid grid-cols-4 gap-2');
    expect(buttonLabels(actions)).toEqual([
      copy.shoulderSymmetry,
      copy.chestCurve,
      copy.clearEquipment,
      copy.downloadImage,
    ]);

    const shoulderButton = buttonNamed(actions, copy.shoulderSymmetry);
    const chestButton = buttonNamed(actions, copy.chestCurve);
    const clearButton = buttonNamed(actions, copy.clearEquipment);
    const downloadButton = buttonNamed(actions, copy.downloadImage);

    expect(shoulderButton.getAttribute('aria-pressed')).toBe('true');
    expect(chestButton.disabled).toBe(true);
    expect(chestButton.className).toContain(DISABLED_CLASS);
    expect(clearButton.className).toContain(IDLE_CLASS);
    expect(shoulderButton.className).toContain('w-full');
    expect(clearButton.className).toContain('w-full');
    expect(downloadButton.className).toContain('w-full');
    expect(downloadButton.getAttribute('type')).toBe('button');
  });

  it('calls the action callbacks', () => {
    const copy = getArmorCreatorCopy('zh');
    const { container, onShoulderSymmetry, onChestCurve, onClear, onDownload } = renderArmorPickerActions(
      copy,
      true,
    );
    const actions = armorPickerHeaderElement(container);
    const chestButton = buttonNamed(actions, copy.chestCurve);

    expect(chestButton.disabled).toBe(false);

    fireEvent.click(buttonNamed(actions, copy.shoulderSymmetry));
    fireEvent.click(chestButton);
    fireEvent.click(buttonNamed(actions, copy.clearEquipment));
    fireEvent.click(buttonNamed(actions, copy.downloadImage));

    expect(onShoulderSymmetry).toHaveBeenCalledTimes(1);
    expect(onChestCurve).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it('rejects a gender that is not male or female', () => {
    const copy = getArmorCreatorCopy('en');

    expect(() =>
      render(
        <ArmorPickerHeader
          copy={copy}
          gender={'child' as ArmorGender}
          material="plate"
          onGender={vi.fn()}
          onMaterial={vi.fn()}
        />,
      ),
    ).toThrow('Invalid armor gender. Received "child".');
  });
});
