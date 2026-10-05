'use client';

import { useId, useState, type ChangeEvent } from 'react';

import type { LanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { VOCABULARY_CATEGORIES } from '@/lib/language-generator/vocabulary';
import type { LanguageRulePair, VocabularyItem } from '@/lib/language-generator/types';
import type { SiteLocale } from '@/lib/site-locale';

const RANDOM_PRESET_MIN = 1;
const RANDOM_PRESET_MAX = 25;

export type LanguageGeneratorVocabularyProps = {
  copy: LanguageGeneratorCopy;
  locale: SiteLocale;
  words: VocabularyItem[];
  results: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onWordChange: (index: number, source: string) => void;
  presetId: number;
  onPresetChange: (presetId: number) => void;
  onRandomize: () => void;
  onApplyRules: () => void;
  onCopy: () => void;
  copied: boolean;
  alphabet: LanguageRulePair[];
};

type IndexedVocabularyItem = {
  entry: VocabularyItem;
  originalIndex: number;
};

function requirePresetId(presetId: number): number {
  if (
    Number.isInteger(presetId) &&
    presetId >= RANDOM_PRESET_MIN &&
    presetId <= RANDOM_PRESET_MAX
  ) {
    return presetId;
  }

  throw new Error(
    `Language generator preset must be an integer from ${RANDOM_PRESET_MIN} to ${RANDOM_PRESET_MAX}. Received ${JSON.stringify(presetId)}.`,
  );
}

function requireCategoryLabel(
  categoryId: string,
  locale: SiteLocale,
  labels: Partial<Record<SiteLocale, string>>,
): string {
  const label = labels[locale];
  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error(
      `Vocabulary category ${JSON.stringify(categoryId)} has no non-empty label for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(label)}.`,
    );
  }

  return label;
}

function requireVocabularyResults(
  words: VocabularyItem[],
  results: string[],
): void {
  if (results.length < words.length) {
    throw new Error(
      `Language generator vocabulary results must contain at least ${words.length} entries for ${words.length} vocabulary items. Received ${results.length}.`,
    );
  }

  for (const [index, result] of results.entries()) {
    if (typeof result !== 'string') {
      throw new Error(
        `Language generator vocabulary result at index ${index} must be a string. Received ${JSON.stringify(result)}.`,
      );
    }
  }
}

function filterVocabularyEntries(
  words: VocabularyItem[],
  selectedCategory: string,
): IndexedVocabularyItem[] {
  return words.reduce<IndexedVocabularyItem[]>((visibleEntries, entry, originalIndex) => {
    if (selectedCategory === 'all' || entry.category === selectedCategory) {
      visibleEntries.push({ entry, originalIndex });
    }

    return visibleEntries;
  }, []);
}

function handlePresetChange(
  event: ChangeEvent<HTMLSelectElement>,
  onPresetChange: (presetId: number) => void,
): void {
  const presetId = Number(event.target.value);
  onPresetChange(requirePresetId(presetId));
}

export function LanguageGeneratorVocabulary({
  copy,
  locale,
  words,
  results,
  selectedCategory,
  onCategoryChange,
  onWordChange,
  presetId,
  onPresetChange,
  onRandomize,
  onApplyRules,
  onCopy,
  copied,
  alphabet,
}: LanguageGeneratorVocabularyProps) {
  requirePresetId(presetId);
  requireVocabularyResults(words, results);

  const alphabetSectionId = useId();
  const [alphabetExpanded, setAlphabetExpanded] = useState(true);
  const visibleEntries = filterVocabularyEntries(words, selectedCategory);
  const allCategoryLabel = copy.allCategoriesLabel;
  const alphabetVisibilityClassName = alphabetExpanded
    ? 'mt-3 flex min-w-0 flex-wrap gap-2'
    : 'hidden';

  return (
    <section
      lang={locale}
      aria-labelledby="language-generator-vocabulary-title"
      data-testid="language-generator-vocabulary"
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] shadow-[var(--site-card-shadow)]"
    >
      <div className="border-b border-[var(--site-border-soft)] px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2
              id="language-generator-vocabulary-title"
              className="font-display text-2xl font-semibold tracking-tight text-stone-50"
            >
              {copy.vocabularyTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
              {copy.vocabularyDescription}
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-stone-300">
              <span>{copy.randomPresetLabel}</span>
              <select
                aria-label={copy.randomPresetLabel}
                value={presetId}
                onChange={(event) => handlePresetChange(event, onPresetChange)}
                className="min-h-11 min-w-44 rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-3 text-sm text-stone-100 outline-none transition focus-visible:border-[var(--site-accent-strong)] focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/30"
              >
                {Array.from(
                  { length: RANDOM_PRESET_MAX - RANDOM_PRESET_MIN + 1 },
                  (_, presetOffset) => {
                    const optionId = RANDOM_PRESET_MIN + presetOffset;
                    return (
                      <option key={optionId} value={optionId}>
                        {copy.randomPresetLabel} {optionId}
                      </option>
                    );
                  },
                )}
              </select>
            </label>
            <button
              type="button"
              onClick={onRandomize}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--site-accent-strong)]/60 bg-[var(--site-accent-bg)] px-4 text-sm font-semibold text-stone-100 transition hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
            >
              {copy.randomizeButton}
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <aside className="min-w-0 lg:border-r lg:border-[var(--site-border-soft)] lg:pr-5">
          <nav
            aria-label={copy.vocabularyTitle}
            className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => onCategoryChange('all')}
              className={`min-h-11 shrink-0 rounded-md px-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)] lg:w-full ${selectedCategory === 'all' ? 'bg-[var(--site-accent-bg)] font-semibold text-stone-50' : 'text-stone-300 hover:bg-white/[0.05] hover:text-stone-50'}`}
            >
              {allCategoryLabel}
            </button>
            {VOCABULARY_CATEGORIES.map((category) => {
              const label = requireCategoryLabel(category.id, locale, category.labels);
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={selectedCategory === category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`min-h-11 shrink-0 rounded-md px-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)] lg:w-full ${selectedCategory === category.id ? 'bg-[var(--site-accent-bg)] font-semibold text-stone-50' : 'text-stone-300 hover:bg-white/[0.05] hover:text-stone-50'}`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-[var(--site-border-soft)] pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--site-accent-strong)]">
                  {copy.alphabetLabel}
                </h3>
                <button
                  type="button"
                  aria-controls={alphabetSectionId}
                  aria-expanded={alphabetExpanded}
                  onClick={() => setAlphabetExpanded((expanded) => !expanded)}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-3 text-xs font-semibold text-stone-100 transition hover:border-[var(--site-accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
                >
                  {alphabetExpanded ? copy.collapseAlphabetButton : copy.expandAlphabetButton}
                </button>
              </div>
              <div
                id={alphabetSectionId}
                aria-label={copy.alphabetLabel}
                hidden={!alphabetExpanded}
                className={alphabetVisibilityClassName}
              >
                {alphabet.map((pair, alphabetIndex) => (
                  <span
                    key={`${pair.source}-${alphabetIndex}`}
                    className="inline-flex min-h-8 min-w-8 items-center justify-center whitespace-nowrap rounded border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-2 text-xs font-semibold text-stone-200"
                    title={`${pair.source} → ${pair.target}`}
                  >
                    {pair.source} → {pair.target}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={onApplyRules}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--site-accent-strong)] px-4 text-sm font-semibold text-[#17130c] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
              >
                {copy.applyRulesButton}
              </button>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-4 text-sm font-semibold text-stone-100 transition hover:border-[var(--site-accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
              >
                {copied ? copy.copiedLabel : copy.copyButton}
              </button>
            </div>
          </div>

          <div className="mt-5 max-w-full overflow-x-auto rounded-lg border border-[var(--site-border-soft)]">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead className="bg-[var(--site-panel)] text-xs uppercase tracking-[0.12em] text-stone-400">
                <tr>
                  <th scope="col" className="w-1/2 px-4 py-3 font-semibold">
                    {copy.sourceHeading}
                  </th>
                  <th scope="col" className="w-1/2 px-4 py-3 font-semibold">
                    {copy.resultHeading}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--site-border-soft)]">
                {visibleEntries.map(({ entry, originalIndex }) => (
                  <tr key={entry.id} className="align-middle">
                    <td className="px-4 py-2.5">
                      <label className="sr-only" htmlFor={`language-generator-word-${entry.id}`}>
                        {copy.sourceHeading}: {entry.source}
                      </label>
                      <input
                        id={`language-generator-word-${entry.id}`}
                        type="text"
                        value={entry.source}
                        onChange={(event) => onWordChange(originalIndex, event.target.value)}
                        className="min-h-11 w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-[var(--site-accent-strong)] focus:bg-[var(--site-panel)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/25"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <output
                        aria-label={`${copy.resultHeading}: ${entry.source}`}
                        className="block min-h-11 whitespace-pre-wrap break-words rounded-md px-2 py-2.5 text-stone-300"
                      >
                        {results[originalIndex]}
                      </output>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LanguageGeneratorVocabulary;
