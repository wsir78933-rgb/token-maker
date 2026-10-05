// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LanguageGeneratorReferences } from '@/components/language-generator/LanguageGeneratorReferences';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { getReferenceLanguage, REFERENCE_LANGUAGES } from '@/lib/language-generator/references';

afterEach(() => {
  cleanup();
});

describe('LanguageGeneratorReferences', () => {
  it.each(['en', 'zh'] as const)('renders the selected fixed reference language as 67 rows in %s', (locale) => {
    const copy = getLanguageGeneratorCopy(locale);
    const realLanguage = REFERENCE_LANGUAGES.find((language) => language.group === 'real');
    if (!realLanguage) throw new Error('Reference test data must include a real language.');

    render(
      <LanguageGeneratorReferences
        copy={copy}
        group="real"
        selectedLanguageId={realLanguage.id}
        onGroupChange={vi.fn()}
        onLanguageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: copy.referenceTitle })).toBeTruthy();
    expect(screen.getByRole('heading', { name: realLanguage.name })).toBeTruthy();
    expect(screen.getAllByTestId('language-reference-entry-row')).toHaveLength(67);
    expect(screen.getByText(copy.referenceRomanizationHint)).toBeTruthy();
    expect(screen.queryByText('Roll for Fantasy')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('reports category and language selection through controlled callbacks', () => {
    const copy = getLanguageGeneratorCopy('en');
    const onGroupChange = vi.fn();
    const onLanguageChange = vi.fn();
    const userLanguages = REFERENCE_LANGUAGES.filter((language) => language.group === 'user');
    if (userLanguages.length !== 10) throw new Error(`Expected 10 user reference languages, received ${userLanguages.length}.`);

    const { rerender } = render(
      <LanguageGeneratorReferences
        copy={copy}
        group="real"
        selectedLanguageId="afrikaans"
        onGroupChange={onGroupChange}
        onLanguageChange={onLanguageChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: new RegExp(copy.communityReferencesLabel) }));
    expect(onGroupChange).toHaveBeenCalledWith('user');

    rerender(
      <LanguageGeneratorReferences
        copy={copy}
        group="user"
        selectedLanguageId={userLanguages[0].id}
        onGroupChange={onGroupChange}
        onLanguageChange={onLanguageChange}
      />,
    );

    const languageButton = screen.getByRole('button', { name: userLanguages[0].name });
    fireEvent.click(languageButton);
    expect(onLanguageChange).toHaveBeenCalledWith(userLanguages[0].id);
  });

  it('shows the unavailable copy for missing reference values without inventing a translation', () => {
    const copy = getLanguageGeneratorCopy('en');
    const dothraki = getReferenceLanguage('dothraki');
    if (!dothraki) throw new Error('Reference test data must include Dothraki.');
    const missingEntry = dothraki.entries.find((entry) => entry.translation === '');
    if (!missingEntry) throw new Error('Dothraki test data must include a missing reference value.');

    render(
      <LanguageGeneratorReferences
        copy={copy}
        group="real"
        selectedLanguageId={dothraki.id}
        onGroupChange={vi.fn()}
        onLanguageChange={vi.fn()}
      />,
    );

    const missingEntryIndex = dothraki.entries.indexOf(missingEntry);
    const missingRow = screen.getAllByTestId('language-reference-entry-row')[missingEntryIndex];
    if (!missingRow) throw new Error(`Could not find the missing reference row for ${missingEntry.source}.`);

    expect(within(missingRow).getByText(copy.referenceUnavailable)).toBeTruthy();
    expect(within(missingRow).getAllByRole('cell')[1].textContent).toBe(copy.referenceUnavailable);
  });

  it('keeps both category filters keyboard reachable with pressed and region semantics', () => {
    const copy = getLanguageGeneratorCopy('en');
    const realLanguage = REFERENCE_LANGUAGES.find((language) => language.group === 'real');
    if (!realLanguage) throw new Error('Reference test data must include a real language.');

    render(
      <LanguageGeneratorReferences
        copy={copy}
        group="real"
        selectedLanguageId={realLanguage.id}
        onGroupChange={vi.fn()}
        onLanguageChange={vi.fn()}
      />,
    );

    const groupButtons = [
      screen.getByRole('button', { name: new RegExp(copy.standardReferencesLabel) }),
      screen.getByRole('button', { name: new RegExp(copy.communityReferencesLabel) }),
    ];

    expect(groupButtons.map((button) => button.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
    expect(groupButtons.every((button) => button.getAttribute('tabindex') !== '-1')).toBe(true);
    expect(screen.getByRole('region', { name: copy.standardReferencesLabel })).toBeTruthy();

    groupButtons[1].focus();
    expect(document.activeElement).toBe(groupButtons[1]);
  });
});
