// @vitest-environment jsdom

import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { generatePopulation, serializePopulationResult } from '@/lib/population-generator';

import { PopulationGeneratorWorkbench } from './PopulationGeneratorWorkbench';

interface DeferredArrayBuffer {
  promise: Promise<ArrayBuffer>;
  resolve: (bytes: ArrayBuffer) => void;
}

function deferArrayBuffer(): DeferredArrayBuffer {
  let resolveBytes: ((bytes: ArrayBuffer) => void) | null = null;
  const promise = new Promise<ArrayBuffer>((resolve) => {
    resolveBytes = resolve;
  });

  return {
    promise,
    resolve: (bytes) => {
      if (resolveBytes === null) {
        throw new Error('Deferred population file bytes resolved before the reader was installed.');
      }

      resolveBytes(bytes);
    },
  };
}

function populationFileWithRead(read: () => Promise<ArrayBuffer>): File {
  return {
    arrayBuffer: () => read(),
  } as File;
}

function populationTextBytes(text: string): ArrayBuffer {
  const encoded = new TextEncoder().encode(text);
  return encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength);
}

function importedPopulationBytes(name: string): ArrayBuffer {
  const generated = generatePopulation({
    era: 'medieval',
    size: 'village',
    locale: 'en',
    random: () => 0.2,
  });
  const renamed = structuredClone(generated);
  renamed.name = name;
  return populationTextBytes(serializePopulationResult(renamed));
}

function stubMatchMedia(): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((media: string) => ({
      matches: media === '(prefers-reduced-motion: reduce)',
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function labelText(node: Element): string {
  return node.textContent?.trim() ?? '';
}

function controlByLabel(label: string): HTMLInputElement {
  const labelElement = [...document.querySelectorAll('label')].find((node) => labelText(node) === label);
  if (labelElement instanceof HTMLLabelElement) {
    const control = document.getElementById(labelElement.htmlFor);
    if (!(control instanceof HTMLInputElement)) {
      throw new Error(
        `Population control label ${JSON.stringify(label)} does not point at an input. htmlFor=${JSON.stringify(labelElement.htmlFor)}.`,
      );
    }

    return control;
  }

  const namedInput = [...document.querySelectorAll('input')].find((node) => node.getAttribute('aria-label') === label);
  if (namedInput instanceof HTMLInputElement) {
    return namedInput;
  }

  throw new Error(`Population control label ${JSON.stringify(label)} is missing.`);
}

function buttonByText(text: string): HTMLButtonElement {
  const button = [...document.querySelectorAll('button')].find((node) => labelText(node) === text);
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Population button ${JSON.stringify(text)} is missing.`);
  }

  return button;
}

describe('population import confirmation on the workbench', () => {
  it('keeps the edited settlement when the replace dialog is cancelled', async () => {
    stubMatchMedia();
    const deferred = deferArrayBuffer();
    render(<PopulationGeneratorWorkbench locale="en" />);

    expect(document.querySelectorAll('[data-population-profession-row]')).toHaveLength(170);
    const professionSection = document.querySelector('[aria-labelledby="population-profession-title"]');
    if (!(professionSection instanceof HTMLElement)) {
      throw new Error('Population profession section is missing.');
    }
    expect([...professionSection.querySelectorAll('span')].map(labelText)).toContain('Count');
    expect(controlByLabel('Count 1')).toBeTruthy();
    expect([...document.querySelectorAll('label')].some((node) => labelText(node) === 'Profession count 1')).toBe(false);

    const nameInput = controlByLabel('Settlement name');
    const keptName = 'Kept During Read';
    const populationInput = controlByLabel('Population');
    const populationBefore = populationInput.value;
    const fileInput = controlByLabel('Import file');

    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [populationFileWithRead(() => deferred.promise)],
    });
    fireEvent.change(fileInput);
    expect([...document.querySelectorAll('p')].some((node) => labelText(node) === 'Reading…')).toBe(true);

    fireEvent.change(nameInput, { target: { value: keptName } });
    expect(nameInput.value).toBe(keptName);

    await act(async () => {
      deferred.resolve(importedPopulationBytes('Imported Overwrite'));
      await deferred.promise;
    });

    const dialog = document.querySelector('[role="dialog"]');
    if (!(dialog instanceof HTMLElement)) {
      throw new Error('Population replace dialog did not open after the delayed import.');
    }
    expect(dialog.textContent).toContain('Replace the current result?');
    expect(nameInput.value).toBe(keptName);
    expect(populationInput.value).toBe(populationBefore);
    expect(document.querySelectorAll('[data-population-profession-row]')).toHaveLength(170);

    fireEvent.click(buttonByText('Keep current result'));

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(nameInput.value).toBe(keptName);
    expect(populationInput.value).toBe(populationBefore);
    expect(document.querySelector('[data-population-dirty]')?.getAttribute('data-population-dirty')).toBe('true');
  });

  it('shows one neutral count column in Chinese', () => {
    stubMatchMedia();
    render(<PopulationGeneratorWorkbench locale="zh" />);

    const professionSection = document.querySelector('[aria-labelledby="population-profession-title"]');
    if (!(professionSection instanceof HTMLElement)) {
      throw new Error('Population profession section is missing.');
    }

    expect(document.querySelectorAll('[data-population-profession-row]')).toHaveLength(170);
    expect([...professionSection.querySelectorAll('span')].map(labelText)).toContain('数量');
    expect(controlByLabel('数量 1')).toBeTruthy();
    expect([...document.querySelectorAll('label')].some((node) => labelText(node) === '人数 1')).toBe(false);
    expect([...document.querySelectorAll('span, p')].map(labelText)).toEqual(
      expect.arrayContaining([
        '隐藏零数量',
        '每行只有一个数量，可按世界设定理解为从业人数或机构数。这些数量加起来不必等于总人口。',
      ]),
    );
  });
});
