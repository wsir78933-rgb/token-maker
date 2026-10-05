// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';

import { LanguageGeneratorWorkbench } from './LanguageGeneratorWorkbench';

function renderWorkbench(locale: 'en' | 'zh' = 'en') {
  const copy = getLanguageGeneratorCopy(locale);
  render(<LanguageGeneratorWorkbench locale={locale} />);
  return copy;
}

function openStorage(copy: ReturnType<typeof getLanguageGeneratorCopy>): HTMLElement {
  fireEvent.click(screen.getByRole('button', { name: copy.storageButton }));
  const dialog = screen.getByRole('dialog');
  if (!(dialog instanceof HTMLElement)) {
    throw new Error('Expected the language generator storage dialog to be an HTMLElement.');
  }

  return dialog;
}

function closeStorage(copy: ReturnType<typeof getLanguageGeneratorCopy>): void {
  fireEvent.click(screen.getByRole('button', { name: copy.closeButton }));
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('LanguageGeneratorWorkbench', () => {
  it.each(['en', 'zh'] as const)('renders the four workbench tabs in %s', (locale) => {
    const copy = renderWorkbench(locale);

    expect(screen.getByRole('tab', { name: copy.vocabularyTab })).toBeTruthy();
    expect(screen.getByRole('tab', { name: copy.textTab })).toBeTruthy();
    expect(screen.getByRole('tab', { name: copy.rulesTab })).toBeTruthy();
    expect(screen.getByRole('tab', { name: copy.referenceTab })).toBeTruthy();

    const selectedTab = screen.getByRole('tab', { name: copy.vocabularyTab });
    fireEvent.keyDown(selectedTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: copy.textTab }).getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(screen.getByRole('tab', { name: copy.textTab }), { key: 'End' });
    expect(screen.getByRole('tab', { name: copy.referenceTab }).getAttribute('aria-selected')).toBe('true');
  });

  it('keeps custom text while switching between tabs', () => {
    const copy = renderWorkbench();

    fireEvent.click(screen.getByRole('tab', { name: copy.textTab }));
    const input = screen.getByRole('textbox', { name: copy.inputLabel });
    fireEvent.change(input, { target: { value: 'hello from a campaign' } });

    fireEvent.click(screen.getByRole('tab', { name: copy.rulesTab }));
    fireEvent.click(screen.getByRole('tab', { name: copy.textTab }));

    expect((screen.getByRole('textbox', { name: copy.inputLabel }) as HTMLTextAreaElement).value).toBe(
      'hello from a campaign',
    );
  });

  it('generates the selected preset immediately and randomizes to a synchronized preset', () => {
    const copy = renderWorkbench();
    const preset = screen.getByRole('combobox', { name: copy.randomPresetLabel });

    fireEvent.change(preset, { target: { value: '7' } });
    expect((preset as HTMLSelectElement).value).toBe('7');

    vi.spyOn(Math, 'random').mockReturnValue(0.96);
    fireEvent.click(screen.getByRole('button', { name: copy.randomizeButton }));
    expect((preset as HTMLSelectElement).value).toBe('25');
  });

  it('keeps custom rules and converted text isolated from random preset generation', () => {
    const copy = renderWorkbench();

    fireEvent.click(screen.getByRole('tab', { name: copy.rulesTab }));
    const characterRules = screen.getByRole('region', { name: copy.characterRulesTitle });
    const ruleInputs = within(characterRules).getAllByRole('textbox');
    fireEvent.change(ruleInputs[1], { target: { value: 'z' } });

    fireEvent.click(screen.getByRole('tab', { name: copy.textTab }));
    fireEvent.change(screen.getByRole('textbox', { name: copy.inputLabel }), {
      target: { value: 'hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.translateButton }));
    const convertedBeforeRandom = screen.getByRole('status', { name: copy.outputLabel }).textContent;

    fireEvent.click(screen.getByRole('tab', { name: copy.vocabularyTab }));
    fireEvent.click(screen.getByRole('button', { name: copy.randomizeButton }));

    fireEvent.click(screen.getByRole('tab', { name: copy.rulesTab }));
    expect(
      (within(screen.getByRole('region', { name: copy.characterRulesTitle })).getAllByRole('textbox')[1] as HTMLInputElement)
        .value,
    ).toBe('z');
    fireEvent.click(screen.getByRole('tab', { name: copy.textTab }));
    expect(screen.getByRole('status', { name: copy.outputLabel }).textContent).toBe(convertedBeforeRandom);
  });

  it('updates vocabulary and free text together when converting', () => {
    const copy = renderWorkbench();

    fireEvent.click(screen.getByRole('tab', { name: copy.rulesTab }));
    const characterRules = screen.getByRole('region', { name: copy.characterRulesTitle });
    const ruleInputs = within(characterRules).getAllByRole('textbox');
    fireEvent.change(ruleInputs[0], { target: { value: 'h' } });
    fireEvent.change(ruleInputs[1], { target: { value: 'z' } });
    for (let ruleIndex = 1; ruleIndex < 26; ruleIndex += 1) {
      fireEvent.change(ruleInputs[ruleIndex * 2], { target: { value: '' } });
    }
    fireEvent.click(screen.getByRole('checkbox', { name: copy.combinationsEnabledLabel }));

    fireEvent.click(screen.getByRole('tab', { name: copy.textTab }));
    fireEvent.change(screen.getByRole('textbox', { name: copy.inputLabel }), {
      target: { value: 'hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.translateButton }));
    expect(screen.getByRole('status', { name: copy.outputLabel }).textContent).toContain('zello');

    fireEvent.click(screen.getByRole('tab', { name: copy.vocabularyTab }));
    const vocabularyPanel = screen.getByRole('tabpanel', { name: copy.vocabularyTab });
    expect((within(vocabularyPanel).getByDisplayValue('hello') as HTMLInputElement).value).toBe('hello');
    expect(within(vocabularyPanel).getByLabelText(`${copy.resultHeading}: hello`).textContent).toContain('zello');
  });

  it('saves all eight slots and loads rules without applying them to content', () => {
    const copy = renderWorkbench();
    const dialog = openStorage(copy);

    for (let slotNumber = 1; slotNumber <= 8; slotNumber += 1) {
      const slot = dialog.querySelector(`[data-language-save-slot="${slotNumber}"]`);
      if (!(slot instanceof HTMLElement)) {
        throw new Error(`Missing language generator slot ${slotNumber}.`);
      }

      fireEvent.click(within(slot).getByRole('button', { name: copy.saveButton }));
    }

    expect(dialog.querySelectorAll('[data-language-save-slot]')).toHaveLength(8);
    expect(
      within(dialog)
        .getAllByRole('button', { name: copy.loadButton })
        .every((button) => !(button as HTMLButtonElement).disabled),
    ).toBe(true);
    closeStorage(copy);

    fireEvent.click(screen.getByRole('tab', { name: copy.rulesTab }));
    const characterRules = screen.getByRole('region', { name: copy.characterRulesTitle });
    const ruleInputs = within(characterRules).getAllByRole('textbox');
    fireEvent.change(ruleInputs[1], { target: { value: 'z' } });

    fireEvent.click(screen.getByRole('tab', { name: copy.textTab }));
    fireEvent.change(screen.getByRole('textbox', { name: copy.inputLabel }), {
      target: { value: 'hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.translateButton }));
    const convertedBeforeLoad = screen.getByRole('status', { name: copy.outputLabel }).textContent;

    const reopenedDialog = openStorage(copy);
    const firstSlot = reopenedDialog.querySelector('[data-language-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) {
      throw new Error('Missing saved language generator slot 1.');
    }

    fireEvent.click(within(firstSlot).getByRole('button', { name: copy.loadButton }));
    expect(within(reopenedDialog).getByRole('status').textContent).toContain(copy.loadSuccessMessage);
    closeStorage(copy);
    fireEvent.click(screen.getByRole('tab', { name: copy.textTab }));
    expect(screen.getByRole('status', { name: copy.outputLabel }).textContent).toBe(convertedBeforeLoad);
  });

  it('shows storage failures and clipboard failures to the user', async () => {
    const storageReadFailure = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    const copy = renderWorkbench();
    openStorage(copy);
    expect(screen.getByRole('alert').textContent).toContain('storage blocked');
    storageReadFailure.mockRestore();

    closeStorage(copy);
    const clipboardWrite = vi.fn().mockRejectedValue(new Error('clipboard denied'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: clipboardWrite },
    });

    fireEvent.click(screen.getByRole('button', { name: copy.copyButton }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('clipboard denied'));
    expect(clipboardWrite).toHaveBeenCalled();
  });
});
