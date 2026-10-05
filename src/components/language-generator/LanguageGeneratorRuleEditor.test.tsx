// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LanguageGeneratorRuleEditor } from '@/components/language-generator/LanguageGeneratorRuleEditor';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import type { LanguageRules } from '@/lib/language-generator/types';

function createLanguageRules(): LanguageRules {
  return {
    characters: Array.from({ length: 26 }, (_, index) => ({
      source: String.fromCharCode(65 + index),
      target: '',
    })),
    combinations: Array.from({ length: 26 }, (_, index) => ({
      source: `C${String(index + 1).padStart(2, '0')}`,
      target: '',
    })),
  };
}

function renderRuleEditor(locale: 'en' | 'zh' = 'en') {
  const copy = getLanguageGeneratorCopy(locale);
  const handlers = {
    onRuleChange: vi.fn(),
    onCombinationsEnabledChange: vi.fn(),
    onApplyRules: vi.fn(),
    onResetRules: vi.fn(),
    onSaveRules: vi.fn(),
  };

  render(
    <LanguageGeneratorRuleEditor
      copy={copy}
      rules={createLanguageRules()}
      combinationsEnabled={false}
      {...handlers}
    />,
  );

  return { copy, handlers };
}

afterEach(() => {
  cleanup();
});

describe('LanguageGeneratorRuleEditor', () => {
  it.each(['en', 'zh'] as const)('renders both 26-row rule tables with bounded inputs in %s', (locale) => {
    const { copy } = renderRuleEditor(locale);
    const characterTable = screen.getByRole('region', { name: copy.characterRulesTitle });
    const combinationTable = screen.getByRole('region', { name: copy.combinationRulesTitle });

    expect(within(characterTable).getAllByRole('textbox')).toHaveLength(52);
    expect(within(combinationTable).getAllByRole('textbox')).toHaveLength(52);
    expect(within(characterTable).getAllByRole('textbox').every((input) => input.getAttribute('maxlength') === '3')).toBe(true);
    expect(within(combinationTable).getAllByRole('textbox').every((input) => input.getAttribute('maxlength') === '4')).toBe(true);
    expect(
      (screen.getByRole('checkbox', { name: copy.combinationsEnabledLabel }) as HTMLInputElement).checked,
    ).toBe(false);
  });

  it('reports the edited field with its rule group, row, and field name', () => {
    const { copy, handlers } = renderRuleEditor();
    const combinationTable = screen.getByRole('region', { name: copy.combinationRulesTitle });
    const targetInput = within(combinationTable).getByRole('textbox', {
      name: `${copy.targetRuleHeading} · ${copy.combinationRulesTitle} · 2`,
    });

    fireEvent.change(targetInput, { target: { value: 'sh' } });

    expect(handlers.onRuleChange).toHaveBeenCalledWith('combinations', 1, 'target', 'sh');
  });

  it('reports the combination toggle and the three footer actions', () => {
    const { copy, handlers } = renderRuleEditor();

    fireEvent.click(screen.getByRole('checkbox', { name: copy.combinationsEnabledLabel }));
    fireEvent.click(screen.getByRole('button', { name: copy.resetRulesButton }));
    fireEvent.click(screen.getByRole('button', { name: copy.saveRulesButton }));
    fireEvent.click(screen.getByRole('button', { name: copy.applyRulesButton }));

    expect(handlers.onCombinationsEnabledChange).toHaveBeenCalledWith(true);
    expect(handlers.onResetRules).toHaveBeenCalledTimes(1);
    expect(handlers.onSaveRules).toHaveBeenCalledTimes(1);
    expect(handlers.onApplyRules).toHaveBeenCalledTimes(1);
  });

  it('fails fast when a rule group does not contain exactly 26 pairs', () => {
    const copy = getLanguageGeneratorCopy('en');
    const validRules = createLanguageRules();
    const invalidRules: LanguageRules = {
      ...validRules,
      characters: validRules.characters.slice(0, 25),
    };

    expect(() =>
      render(
        <LanguageGeneratorRuleEditor
          copy={copy}
          rules={invalidRules}
          combinationsEnabled={false}
          onRuleChange={vi.fn()}
          onCombinationsEnabledChange={vi.fn()}
          onApplyRules={vi.fn()}
          onResetRules={vi.fn()}
          onSaveRules={vi.fn()}
        />,
      ),
    ).toThrow('Language characters rules must contain 26 pairs. Received 25.');
  });

  it('fails fast on a sparse rule group with the missing index and value', () => {
    const copy = getLanguageGeneratorCopy('en');
    const validRules = createLanguageRules();
    const sparseCharacters = validRules.characters.slice();
    delete sparseCharacters[7];
    const sparseRules: LanguageRules = {
      ...validRules,
      characters: sparseCharacters,
    };

    expect(() =>
      render(
        <LanguageGeneratorRuleEditor
          copy={copy}
          rules={sparseRules}
          combinationsEnabled={false}
          onRuleChange={vi.fn()}
          onCombinationsEnabledChange={vi.fn()}
          onApplyRules={vi.fn()}
          onResetRules={vi.fn()}
          onSaveRules={vi.fn()}
        />,
      ),
    ).toThrow('Language characters rule at index 7 must be an object. Received undefined.');
  });
});
