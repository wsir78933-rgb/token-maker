// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';

import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { VOCABULARY_CATEGORIES } from '@/lib/language-generator/vocabulary';
import type { LanguageRulePair, VocabularyItem } from '@/lib/language-generator/types';
import type { SiteLocale } from '@/lib/site-locale';

import { LanguageGeneratorVocabulary } from './LanguageGeneratorVocabulary';

const copy = getLanguageGeneratorCopy('en');
const firstCategory = VOCABULARY_CATEGORIES[0];
const secondCategory = VOCABULARY_CATEGORIES[1];

const words: VocabularyItem[] = [
  { id: 'first-entry', category: firstCategory.id, source: 'hello' },
  { id: 'second-entry', category: secondCategory.id, source: 'home' },
];

const alphabet: LanguageRulePair[] = [
  { source: 'a', target: 'á' },
  { source: 'b', target: 'b' },
];

function renderVocabulary(overrides: Partial<ComponentProps<typeof LanguageGeneratorVocabulary>> = {}) {
  const callbacks = {
    onCategoryChange: vi.fn(),
    onWordChange: vi.fn(),
    onPresetChange: vi.fn(),
    onRandomize: vi.fn(),
    onApplyRules: vi.fn(),
    onCopy: vi.fn(),
  };
  const props: ComponentProps<typeof LanguageGeneratorVocabulary> = {
    copy,
    locale: 'en' as SiteLocale,
    words,
    results: ['hallo', 'homa'],
    selectedCategory: 'all',
    presetId: 1,
    alphabet,
    copied: false,
    ...callbacks,
    ...overrides,
  };

  return { ...render(<LanguageGeneratorVocabulary {...props} />), callbacks };
}

describe('LanguageGeneratorVocabulary', () => {
  afterEach(() => {
    cleanup();
  });

  it('filters categories while preserving the original word index for edits', () => {
    const { callbacks } = renderVocabulary({ selectedCategory: 'daily-life' });

    expect(screen.getByDisplayValue('home')).toBeTruthy();
    expect(screen.queryByDisplayValue('hello')).toBeNull();

    fireEvent.change(screen.getByDisplayValue('home'), { target: { value: 'hearth' } });

    expect(callbacks.onWordChange).toHaveBeenCalledWith(1, 'hearth');
  });

  it('returns category and preset choices through their public callbacks', () => {
    const { callbacks } = renderVocabulary();

    fireEvent.click(screen.getByRole('button', { name: firstCategory.labels.en }));
    fireEvent.change(screen.getByRole('combobox', { name: copy.randomPresetLabel }), {
      target: { value: '7' },
    });

    expect(callbacks.onCategoryChange).toHaveBeenCalledWith(firstCategory.id);
    expect(callbacks.onPresetChange).toHaveBeenCalledWith(7);
  });

  it('exposes randomize, apply-rules, and copy actions', () => {
    const { callbacks } = renderVocabulary();

    fireEvent.click(screen.getByRole('button', { name: copy.randomizeButton }));
    fireEvent.click(screen.getByRole('button', { name: copy.applyRulesButton }));
    fireEvent.click(screen.getByRole('button', { name: copy.copyButton }));

    expect(callbacks.onRandomize).toHaveBeenCalledOnce();
    expect(callbacks.onApplyRules).toHaveBeenCalledOnce();
    expect(callbacks.onCopy).toHaveBeenCalledOnce();
  });

  it.each(['en', 'zh'] as const)('toggles the alphabet mappings with localized controls in %s', (locale) => {
    const localizedCopy = getLanguageGeneratorCopy(locale);
    const mappingPairs: LanguageRulePair[] = [
      { source: 'C', target: 'G' },
      { source: 'D', target: '' },
    ];
    renderVocabulary({ copy: localizedCopy, locale, alphabet: mappingPairs });

    const toggleButton = screen.getByRole('button', {
      name: localizedCopy.collapseAlphabetButton,
    });
    const mappingId = toggleButton.getAttribute('aria-controls');
    if (mappingId === null) {
      throw new Error('Alphabet toggle did not expose an aria-controls value.');
    }

    const mappingList = document.getElementById(mappingId);
    if (!(mappingList instanceof HTMLElement)) {
      throw new Error(`Alphabet mapping container ${JSON.stringify(mappingId)} was not found.`);
    }

    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(mappingList.hidden).toBe(false);
    expect(screen.getByText('C → G')).toBeTruthy();
    expect(screen.getByText('D →')).toBeTruthy();

    fireEvent.click(toggleButton);

    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
    expect(toggleButton.textContent).toBe(localizedCopy.expandAlphabetButton);
    expect(mappingList.hidden).toBe(true);

    fireEvent.click(toggleButton);

    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(toggleButton.textContent).toBe(localizedCopy.collapseAlphabetButton);
    expect(mappingList.hidden).toBe(false);
    expect(mappingList.textContent).toContain('C → G');
    expect(mappingList.textContent).toContain('D →');
  });
});
