// @vitest-environment jsdom

import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArmorPickerHeader } from '@/components/armor-creator/ArmorPickerHeader';
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

function renderArmorPickerHeader(copy: ArmorCreatorCopy, chestCurveEnabled: boolean) {
  const onGender = vi.fn();
  const onMaterial = vi.fn();
  const onShoulderSymmetry = vi.fn();
  const onChestCurve = vi.fn();
  const onClear = vi.fn();
  const onDownload = vi.fn();
  const view = render(
    <ArmorPickerHeader
      copy={copy}
      gender="male"
      material="plate"
      shoulderSymmetry
      chestCurve
      chestCurveEnabled={chestCurveEnabled}
      onGender={onGender}
      onMaterial={onMaterial}
      onShoulderSymmetry={onShoulderSymmetry}
      onChestCurve={onChestCurve}
      onClear={onClear}
      onDownload={onDownload}
    />,
  );

  return {
    ...view,
    onGender,
    onMaterial,
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

  it('renders both rows and marks male, plate, and a disabled chest curve', () => {
    const copy = getArmorCreatorCopy('zh');
    const { container } = renderArmorPickerHeader(copy, false);
    const header = armorPickerHeaderElement(container);
    const [choiceRow, materialRow] = armorPickerHeaderRows(header);

    expect(header.className).toBe('space-y-2');
    expect(choiceRow.className).toBe('flex flex-wrap items-center gap-2');
    expect(materialRow.className).toBe('flex flex-wrap items-center gap-2');
    expect(buttonLabels(choiceRow)).toEqual([
      copy.genderMale,
      copy.genderFemale,
      copy.shoulderSymmetry,
      copy.chestCurve,
    ]);
    expect(buttonLabels(materialRow)).toEqual([
      copy.materialPlate,
      copy.materialLeather,
      copy.materialCloth,
      copy.clearEquipment,
      copy.downloadImage,
    ]);

    const maleButton = buttonNamed(choiceRow, copy.genderMale);
    const femaleButton = buttonNamed(choiceRow, copy.genderFemale);
    const shoulderButton = buttonNamed(choiceRow, copy.shoulderSymmetry);
    const chestButton = buttonNamed(choiceRow, copy.chestCurve);
    const plateButton = buttonNamed(materialRow, copy.materialPlate);
    const leatherButton = buttonNamed(materialRow, copy.materialLeather);
    const clearButton = buttonNamed(materialRow, copy.clearEquipment);
    const downloadButton = buttonNamed(materialRow, copy.downloadImage);

    expect(maleButton.getAttribute('aria-pressed')).toBe('true');
    expect(femaleButton.getAttribute('aria-pressed')).toBe('false');
    expect(plateButton.getAttribute('aria-pressed')).toBe('true');
    expect(leatherButton.getAttribute('aria-pressed')).toBe('false');
    expect(shoulderButton.getAttribute('aria-pressed')).toBe('true');
    expect(chestButton.getAttribute('aria-pressed')).toBe('true');
    expect(chestButton.disabled).toBe(true);
    expect(clearButton.hasAttribute('aria-pressed')).toBe(false);
    expect(downloadButton.hasAttribute('aria-pressed')).toBe(false);
    expect(maleButton.className).toContain(SELECTED_CLASS);
    expect(plateButton.className).toContain(SELECTED_CLASS);
    expect(femaleButton.className).toContain(IDLE_CLASS);
    expect(clearButton.className).toContain(IDLE_CLASS);
    expect(downloadButton.className).toContain(IDLE_CLASS);
    expect(chestButton.className).toContain(DISABLED_CLASS);
    expect(maleButton.getAttribute('type')).toBe('button');
    expect(clearButton.getAttribute('type')).toBe('button');
    expect(downloadButton.getAttribute('type')).toBe('button');
  });

  it('calls the callback for the clicked control', () => {
    const copy = getArmorCreatorCopy('zh');
    const { container, onGender, onMaterial, onShoulderSymmetry, onChestCurve, onClear, onDownload } =
      renderArmorPickerHeader(copy, true);
    const [choiceRow, materialRow] = armorPickerHeaderRows(armorPickerHeaderElement(container));
    const chestButton = buttonNamed(choiceRow, copy.chestCurve);

    expect(chestButton.disabled).toBe(false);

    fireEvent.click(buttonNamed(choiceRow, copy.genderFemale));
    fireEvent.click(buttonNamed(choiceRow, copy.genderMale));
    fireEvent.click(buttonNamed(choiceRow, copy.shoulderSymmetry));
    fireEvent.click(chestButton);
    fireEvent.click(buttonNamed(materialRow, copy.materialLeather));
    fireEvent.click(buttonNamed(materialRow, copy.materialCloth));
    fireEvent.click(buttonNamed(materialRow, copy.materialPlate));
    fireEvent.click(buttonNamed(materialRow, copy.clearEquipment));
    fireEvent.click(buttonNamed(materialRow, copy.downloadImage));

    expect(onGender.mock.calls).toEqual([['female'], ['male']]);
    expect(onMaterial.mock.calls).toEqual([['leather'], ['cloth'], ['plate']]);
    expect(onShoulderSymmetry).toHaveBeenCalledTimes(1);
    expect(onShoulderSymmetry).toHaveBeenCalledWith();
    expect(onChestCurve).toHaveBeenCalledTimes(1);
    expect(onChestCurve).toHaveBeenCalledWith();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledWith();
    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledWith();
  });

  it('rejects a gender that is not male or female', () => {
    const copy = getArmorCreatorCopy('en');

    expect(() =>
      render(
        <ArmorPickerHeader
          copy={copy}
          gender={'child' as ArmorGender}
          material="plate"
          shoulderSymmetry={false}
          chestCurve={false}
          chestCurveEnabled={false}
          onGender={vi.fn()}
          onMaterial={vi.fn()}
          onShoulderSymmetry={vi.fn()}
          onChestCurve={vi.fn()}
          onClear={vi.fn()}
          onDownload={vi.fn()}
        />,
      ),
    ).toThrow('Invalid armor gender. Received "child".');
  });
});
