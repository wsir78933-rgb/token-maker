'use client';

import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react';

import { LanguageGeneratorReferences } from './LanguageGeneratorReferences';
import { LanguageGeneratorRuleEditor } from './LanguageGeneratorRuleEditor';
import { LanguageGeneratorSaveSlotsDialog } from './LanguageGeneratorSaveSlotsDialog';
import { LanguageGeneratorTextConversion } from './LanguageGeneratorTextConversion';
import { LanguageGeneratorVocabulary } from './LanguageGeneratorVocabulary';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import {
  LANGUAGE_PRESET_COUNT,
  generatePreset,
} from '@/lib/language-generator/presets';
import {
  REFERENCE_LANGUAGES,
  type ReferenceLanguage,
} from '@/lib/language-generator/references';
import {
  LANGUAGE_RULE_SLOT_COUNT,
  loadRuleSlot,
  readRuleSlots,
  saveRuleSlot,
} from '@/lib/language-generator/storage';
import { createDefaultRules, translateText } from '@/lib/language-generator/transform';
import type {
  LanguageRulePair,
  LanguageRules,
  VocabularyItem,
} from '@/lib/language-generator/types';
import { VOCABULARY_ENTRIES } from '@/lib/language-generator/vocabulary';
import type { SiteLocale } from '@/lib/site-locale';

type LanguageGeneratorTab = 'vocabulary' | 'text' | 'rules' | 'references';
type LanguageRuleGroup = 'characters' | 'combinations';
type LanguageRuleField = 'source' | 'target';

const LANGUAGE_GENERATOR_TABS: readonly LanguageGeneratorTab[] = [
  'vocabulary',
  'text',
  'rules',
  'references',
];

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message.length > 0 ? error.message : `${error.name} with an empty message`;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error === undefined) {
    return 'undefined';
  }

  if (error === null) {
    return 'null';
  }

  try {
    const serializedError = JSON.stringify(error);
    return typeof serializedError === 'string'
      ? serializedError
      : Object.prototype.toString.call(error);
  } catch (serializationError: unknown) {
    if (serializationError instanceof Error && serializationError.message.length > 0) {
      return `${Object.prototype.toString.call(error)} (serialization failed: ${serializationError.message})`;
    }

    throw serializationError;
  }
}

function cloneRules(rules: LanguageRules): LanguageRules {
  return {
    characters: rules.characters.map((pair) => ({ ...pair })),
    combinations: rules.combinations.map((pair) => ({ ...pair })),
  };
}

function cloneVocabularyEntries(): VocabularyItem[] {
  return VOCABULARY_ENTRIES.map((entry) => ({ ...entry }));
}

function normalizeVocabularyWords(words: VocabularyItem[]): VocabularyItem[] {
  return words.map((word) => ({ ...word, source: word.source.toLowerCase() }));
}

function findFirstReferenceLanguage(group: ReferenceLanguage['group']): ReferenceLanguage {
  const referenceLanguage = REFERENCE_LANGUAGES.find((language) => language.group === group);
  if (referenceLanguage === undefined) {
    throw new Error(`Reference catalog has no language in group ${JSON.stringify(group)}.`);
  }

  return referenceLanguage;
}

function requirePresetId(presetId: number): number {
  if (Number.isInteger(presetId) && presetId >= 1 && presetId <= LANGUAGE_PRESET_COUNT) {
    return presetId;
  }

  throw new Error(
    `Language generator preset must be an integer from 1 to ${LANGUAGE_PRESET_COUNT}. Received ${JSON.stringify(presetId)}.`,
  );
}

function getBrowserStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new Error('Language generator local storage is unavailable outside a browser. Received window undefined.');
  }

  return window.localStorage;
}

function createInitialGeneratedState(): {
  words: VocabularyItem[];
  results: string[];
  alphabet: LanguageRulePair[];
  presetId: number;
} {
  const presetId = 1;
  const words = cloneVocabularyEntries();
  const generatedPreset = generatePreset(presetId, words);

  return {
    words,
    results: generatedPreset.results,
    alphabet: generatedPreset.alphabet,
    presetId,
  };
}

function tabLabel(
  copy: ReturnType<typeof getLanguageGeneratorCopy>,
  tab: LanguageGeneratorTab,
): string {
  if (tab === 'vocabulary') return copy.vocabularyTab;
  if (tab === 'text') return copy.textTab;
  if (tab === 'rules') return copy.rulesTab;
  return copy.referenceTab;
}

function nextTabIndex(currentIndex: number, key: string): number | null {
  if (key === 'ArrowRight') return (currentIndex + 1) % LANGUAGE_GENERATOR_TABS.length;
  if (key === 'ArrowLeft') {
    return (currentIndex - 1 + LANGUAGE_GENERATOR_TABS.length) % LANGUAGE_GENERATOR_TABS.length;
  }
  if (key === 'Home') return 0;
  if (key === 'End') return LANGUAGE_GENERATOR_TABS.length - 1;
  return null;
}

export function useLanguageGenerator(locale: SiteLocale) {
  const copy = useMemo(() => getLanguageGeneratorCopy(locale), [locale]);
  const [activeTab, setActiveTab] = useState<LanguageGeneratorTab>('vocabulary');
  const [rules, setRules] = useState<LanguageRules>(() => createDefaultRules());
  const [combinationsEnabled, setCombinationsEnabled] = useState(true);
  const [generatedState, setGeneratedState] = useState(createInitialGeneratedState);
  const [text, setText] = useState('');
  const [textResult, setTextResult] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(VOCABULARY_ENTRIES[0].category);
  const [referenceGroup, setReferenceGroup] = useState<ReferenceLanguage['group']>('real');
  const [selectedReferenceLanguageId, setSelectedReferenceLanguageId] = useState(
    () => findFirstReferenceLanguage('real').id,
  );
  const [vocabularyCopiedValue, setVocabularyCopiedValue] = useState<string | null>(null);
  const [textCopiedValue, setTextCopiedValue] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [storageOpen, setStorageOpen] = useState(false);
  const [storageSlots, setStorageSlots] = useState<Array<LanguageRules | null>>(() =>
    Array.from({ length: LANGUAGE_RULE_SLOT_COUNT }, () => null),
  );
  const [storageError, setStorageError] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<string | null>(null);

  const applyRulesToContent = useCallback(() => {
    const normalizedWords = normalizeVocabularyWords(generatedState.words);
    const translatedWords = normalizedWords.map((word) =>
      translateText(word.source, rules, combinationsEnabled),
    );
    const translatedText = translateText(text, rules, combinationsEnabled);

    setGeneratedState((currentState) => ({
      ...currentState,
      words: normalizedWords,
      results: translatedWords,
    }));
    setTextResult(translatedText);
    setVocabularyCopiedValue(null);
    setTextCopiedValue(null);
    setActionError(null);
  }, [combinationsEnabled, generatedState.words, rules, text]);

  const generatePresetForId = useCallback(
    (receivedPresetId: number) => {
      const presetId = requirePresetId(receivedPresetId);
      const normalizedWords = normalizeVocabularyWords(generatedState.words);
      const generatedPreset = generatePreset(presetId, normalizedWords);

      setGeneratedState({
        words: normalizedWords,
        results: generatedPreset.results,
        alphabet: generatedPreset.alphabet,
        presetId,
      });
      setVocabularyCopiedValue(null);
      setActionError(null);
    },
    [generatedState.words],
  );

  const handleRandomize = useCallback(() => {
    const randomPresetId = Math.floor(Math.random() * LANGUAGE_PRESET_COUNT) + 1;
    generatePresetForId(randomPresetId);
  }, [generatePresetForId]);

  const handleRuleChange = useCallback(
    (
      group: LanguageRuleGroup,
      index: number,
      field: LanguageRuleField,
      value: string,
    ) => {
      setRules((currentRules) => ({
        ...currentRules,
        [group]: currentRules[group].map((pair, pairIndex) =>
          pairIndex === index ? { ...pair, [field]: value } : pair,
        ),
      }));
      setVocabularyCopiedValue(null);
      setTextCopiedValue(null);
    },
    [],
  );

  const handleReferenceGroupChange = useCallback((group: ReferenceLanguage['group']) => {
    const firstLanguageInGroup = findFirstReferenceLanguage(group);
    setReferenceGroup(group);
    setSelectedReferenceLanguageId(firstLanguageInGroup.id);
  }, []);

  const readStorage = useCallback((): void => {
    const browserStorage = getBrowserStorage();
    setStorageSlots(readRuleSlots(browserStorage));
  }, []);

  const handleOpenStorage = useCallback(() => {
    setStorageError(null);
    setStorageStatus(null);
    setStorageOpen(true);

    try {
      readStorage();
    } catch (error: unknown) {
      setStorageError(
        `${copy.storageErrorLabel} ${describeError(error)}`,
      );
    }
  }, [copy.storageErrorLabel, readStorage]);

  const handleSaveSlot = useCallback(
    (slotNumber: number) => {
      try {
        const browserStorage = getBrowserStorage();
        saveRuleSlot(browserStorage, slotNumber, rules);
        setStorageSlots(readRuleSlots(browserStorage));
        setStorageError(null);
        setStorageStatus(copy.saveSuccessMessage);
      } catch (error: unknown) {
        setStorageError(`${copy.storageErrorLabel} ${describeError(error)}`);
        setStorageStatus(null);
      }
    },
    [copy.saveSuccessMessage, copy.storageErrorLabel, rules],
  );

  const handleLoadSlot = useCallback(
    (slotNumber: number) => {
      try {
        const browserStorage = getBrowserStorage();
        const loadedRules = loadRuleSlot(browserStorage, slotNumber);
        if (loadedRules === null) {
          throw new Error(`Language generator save slot ${slotNumber} is empty. Received null.`);
        }

        setRules(cloneRules(loadedRules));
        setStorageError(null);
        setStorageStatus(copy.loadSuccessMessage);
        setVocabularyCopiedValue(null);
        setTextCopiedValue(null);
      } catch (error: unknown) {
        setStorageError(`${copy.storageErrorLabel} ${describeError(error)}`);
        setStorageStatus(null);
      }
    },
    [copy.loadSuccessMessage, copy.storageErrorLabel],
  );

  const handleCopy = useCallback(
    async (value: string, setCopiedValue: (copiedValue: string) => void) => {
      setActionError(null);
      if (value.length === 0) {
        setActionError(`${copy.copyErrorLabel} Received an empty result.`);
        return;
      }

      try {
        if (typeof navigator === 'undefined' || navigator.clipboard === undefined) {
          throw new Error('Clipboard API is unavailable. Received navigator.clipboard undefined.');
        }

        await navigator.clipboard.writeText(value);
        setCopiedValue(value);
      } catch (error: unknown) {
        setActionError(`${copy.copyErrorLabel} ${describeError(error)}`);
      }
    },
    [copy.copyErrorLabel],
  );

  const handleWordChange = useCallback((index: number, source: string) => {
    setGeneratedState((currentState) => ({
      ...currentState,
      words: currentState.words.map((word, wordIndex) =>
        wordIndex === index ? { ...word, source } : word,
      ),
    }));
    setVocabularyCopiedValue(null);
    setActionError(null);
  }, []);

  const handleResetRules = useCallback(() => {
    setRules(createDefaultRules());
    setVocabularyCopiedValue(null);
    setTextCopiedValue(null);
    setActionError(null);
  }, []);

  const handleSetText = useCallback((nextText: string) => {
    setText(nextText);
    setTextCopiedValue(null);
    setActionError(null);
  }, []);

  const handleClearText = useCallback(() => {
    setText('');
    setTextResult('');
    setTextCopiedValue(null);
    setActionError(null);
  }, []);

  const handleCopyVocabulary = useCallback(() => {
    void handleCopy(generatedState.results.join('\n'), setVocabularyCopiedValue);
  }, [generatedState.results, handleCopy]);

  const handleCopyText = useCallback(() => {
    void handleCopy(textResult, setTextCopiedValue);
  }, [handleCopy, textResult]);

  return {
    copy,
    activeTab,
    setActiveTab,
    rules,
    combinationsEnabled,
    generatedState,
    text,
    textResult,
    selectedCategory,
    setSelectedCategory,
    referenceGroup,
    selectedReferenceLanguageId,
    storageOpen,
    storageSlots,
    storageError,
    storageStatus,
    actionError,
    vocabularyCopied: generatedState.results.length > 0 && vocabularyCopiedValue === generatedState.results.join('\n'),
    textCopied: textResult.length > 0 && textCopiedValue === textResult,
    applyRulesToContent,
    generatePresetForId,
    handleRandomize,
    handleRuleChange,
    handleWordChange,
    handleResetRules,
    setCombinationsEnabled,
    handleReferenceGroupChange,
    setSelectedReferenceLanguageId,
    handleOpenStorage,
    setStorageOpen,
    handleSaveSlot,
    handleLoadSlot,
    handleCopy,
    handleCopyVocabulary,
    handleCopyText,
    handleSetText,
    handleClearText,
  };
}

export type LanguageGeneratorWorkbenchProps = {
  locale: SiteLocale;
};

export function LanguageGeneratorWorkbench({ locale }: LanguageGeneratorWorkbenchProps) {
  const state = useLanguageGenerator(locale);
  const {
    copy,
    activeTab,
    setActiveTab,
    rules,
    combinationsEnabled,
    generatedState,
    text,
    textResult,
    selectedCategory,
    setSelectedCategory,
    referenceGroup,
    selectedReferenceLanguageId,
    storageOpen,
    storageSlots,
    storageError,
    storageStatus,
    actionError,
    vocabularyCopied,
    textCopied,
    applyRulesToContent,
    generatePresetForId,
    handleRandomize,
    handleRuleChange,
    handleWordChange,
    handleResetRules,
    setCombinationsEnabled,
    handleReferenceGroupChange,
    setSelectedReferenceLanguageId,
    handleOpenStorage,
    setStorageOpen,
    handleSaveSlot,
    handleLoadSlot,
    handleCopyVocabulary,
    handleCopyText,
    handleSetText,
    handleClearText,
  } = state;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = LANGUAGE_GENERATOR_TABS.indexOf(activeTab);
    const nextIndex = nextTabIndex(currentIndex, event.key);
    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = LANGUAGE_GENERATOR_TABS[nextIndex];
    setActiveTab(nextTab);
    document.getElementById(`language-generator-tab-${nextTab}`)?.focus();
  };

  return (
    <section
      lang={locale}
      aria-label={copy.workspaceLabel}
      data-testid="language-generator-workbench"
      className="min-w-0 overflow-hidden rounded-3xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] shadow-[var(--site-card-shadow)]"
    >
      <div className="border-b border-[var(--site-border-soft)] px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--site-accent-strong)]">
              {copy.workspaceLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-300">{copy.translationHint}</p>
          </div>
          <button
            type="button"
            onClick={handleOpenStorage}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-4 text-sm font-semibold text-stone-100 transition hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
          >
            {copy.storageButton}
          </button>
        </div>

        <div
          aria-label={copy.workspaceLabel}
          className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4"
          role="tablist"
        >
          {LANGUAGE_GENERATOR_TABS.map((tab) => {
            const selected = activeTab === tab;
            return (
              <button
                key={tab}
                id={`language-generator-tab-${tab}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`language-generator-panel-${tab}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                onKeyDown={handleTabKeyDown}
                className={`inline-flex min-h-11 min-w-0 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)] ${selected ? 'bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)]' : 'text-stone-300 hover:bg-white/[0.05] hover:text-stone-50'}`}
              >
                <span className="truncate">{tabLabel(copy, tab)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {actionError !== null ? (
        <p
          role="alert"
          className="mx-4 mt-4 break-words rounded-lg border border-red-300/30 bg-red-950/30 p-3 text-sm leading-6 text-red-100 sm:mx-6"
        >
          {actionError}
        </p>
      ) : null}

      <div className="min-w-0 p-4 sm:p-6">
        <div
          id="language-generator-panel-vocabulary"
          role="tabpanel"
          aria-labelledby="language-generator-tab-vocabulary"
          tabIndex={0}
          hidden={activeTab !== 'vocabulary'}
        >
          <LanguageGeneratorVocabulary
            copy={copy}
            locale={locale}
            words={generatedState.words}
            results={generatedState.results}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onWordChange={handleWordChange}
            presetId={generatedState.presetId}
            onPresetChange={generatePresetForId}
            onRandomize={handleRandomize}
            onApplyRules={applyRulesToContent}
            onCopy={handleCopyVocabulary}
            copied={vocabularyCopied}
            alphabet={generatedState.alphabet}
          />
        </div>

        <div
          id="language-generator-panel-text"
          role="tabpanel"
          aria-labelledby="language-generator-tab-text"
          tabIndex={0}
          hidden={activeTab !== 'text'}
        >
          <LanguageGeneratorTextConversion
            copy={copy}
            text={text}
            result={textResult}
            onTextChange={handleSetText}
            onTranslate={applyRulesToContent}
            onClear={handleClearText}
            onCopy={handleCopyText}
            copied={textCopied}
          />
        </div>

        <div
          id="language-generator-panel-rules"
          role="tabpanel"
          aria-labelledby="language-generator-tab-rules"
          tabIndex={0}
          hidden={activeTab !== 'rules'}
        >
          <LanguageGeneratorRuleEditor
            copy={copy}
            rules={rules}
            combinationsEnabled={combinationsEnabled}
            onRuleChange={handleRuleChange}
            onCombinationsEnabledChange={setCombinationsEnabled}
            onApplyRules={applyRulesToContent}
            onResetRules={handleResetRules}
            onSaveRules={handleOpenStorage}
          />
        </div>

        <div
          id="language-generator-panel-references"
          role="tabpanel"
          aria-labelledby="language-generator-tab-references"
          tabIndex={0}
          hidden={activeTab !== 'references'}
        >
          <LanguageGeneratorReferences
            copy={copy}
            group={referenceGroup}
            selectedLanguageId={selectedReferenceLanguageId}
            onGroupChange={handleReferenceGroupChange}
            onLanguageChange={setSelectedReferenceLanguageId}
          />
        </div>
      </div>

      <LanguageGeneratorSaveSlotsDialog
        copy={copy}
        open={storageOpen}
        onOpenChange={setStorageOpen}
        slots={storageSlots}
        onSave={handleSaveSlot}
        onLoad={handleLoadSlot}
        errorMessage={storageError}
        statusMessage={storageStatus}
      />
    </section>
  );
}

export default LanguageGeneratorWorkbench;
