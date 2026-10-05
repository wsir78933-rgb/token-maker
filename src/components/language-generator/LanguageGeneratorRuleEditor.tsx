'use client';

import { useId } from 'react';

import type { LanguageGeneratorCopy } from '@/lib/language-generator/copy';
import type { LanguageRules, LanguageRulePair } from '@/lib/language-generator/types';

type LanguageRuleKind = 'characters' | 'combinations';
type LanguageRuleField = 'source' | 'target';

export interface LanguageGeneratorRuleEditorProps {
  copy: LanguageGeneratorCopy;
  rules: LanguageRules;
  combinationsEnabled: boolean;
  onRuleChange: (
    kind: LanguageRuleKind,
    index: number,
    field: LanguageRuleField,
    value: string,
  ) => void;
  onCombinationsEnabledChange: (enabled: boolean) => void;
  onApplyRules: () => void;
  onResetRules: () => void;
  onSaveRules: () => void;
}

const LANGUAGE_RULE_PAIR_COUNT = 26;
const LANGUAGE_RULE_MAX_LENGTH: Readonly<Record<LanguageRuleKind, number>> = {
  characters: 3,
  combinations: 4,
};

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    return typeof serializedValue === 'string'
      ? serializedValue
      : Object.prototype.toString.call(value);
  } catch (serializationFailure: unknown) {
    if (serializationFailure instanceof Error && serializationFailure.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (serialization failed: ${serializationFailure.message})`;
    }

    throw serializationFailure;
  }
}

function requireLanguageRulePair(
  value: unknown,
  kind: LanguageRuleKind,
  index: number,
): LanguageRulePair {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(
      `Language ${kind} rule at index ${index} must be an object. Received ${describeReceivedValue(value)}.`,
    );
  }

  const rulePair = value as Partial<LanguageRulePair>;
  const maxLength = LANGUAGE_RULE_MAX_LENGTH[kind];

  for (const field of ['source', 'target'] as const) {
    const fieldValue = rulePair[field];
    if (typeof fieldValue !== 'string') {
      throw new Error(
        `Language ${kind} rule at index ${index} ${field} must be a string. Received ${describeReceivedValue(fieldValue)}.`,
      );
    }

    if (fieldValue.length > maxLength) {
      throw new Error(
        `Language ${kind} rule at index ${index} ${field} must contain at most ${maxLength} characters. Received ${describeReceivedValue(fieldValue)}.`,
      );
    }
  }

  return rulePair as LanguageRulePair;
}

function requireLanguageRules(value: unknown): asserts value is LanguageRules {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(
      `Language rules must be an object with characters and combinations arrays. Received ${describeReceivedValue(value)}.`,
    );
  }

  const ruleGroups = value as Partial<LanguageRules>;
  for (const kind of ['characters', 'combinations'] as const) {
    const rulePairs = ruleGroups[kind];
    if (!Array.isArray(rulePairs)) {
      throw new Error(
        `Language ${kind} rules must be an array. Received ${describeReceivedValue(rulePairs)}.`,
      );
    }

    if (rulePairs.length !== LANGUAGE_RULE_PAIR_COUNT) {
      throw new Error(
        `Language ${kind} rules must contain ${LANGUAGE_RULE_PAIR_COUNT} pairs. Received ${rulePairs.length}.`,
      );
    }

    for (let index = 0; index < rulePairs.length; index += 1) {
      requireLanguageRulePair(rulePairs[index], kind, index);
    }
  }
}

function LanguageRuleTable({
  copy,
  kind,
  rulePairs,
  onRuleChange,
}: {
  copy: LanguageGeneratorCopy;
  kind: LanguageRuleKind;
  rulePairs: LanguageRulePair[];
  onRuleChange: LanguageGeneratorRuleEditorProps['onRuleChange'];
}) {
  const tableId = useId();
  const maxLength = LANGUAGE_RULE_MAX_LENGTH[kind];
  const title = kind === 'characters' ? copy.characterRulesTitle : copy.combinationRulesTitle;
  const hint = kind === 'characters' ? copy.characterRulesHint : copy.combinationRulesHint;

  return (
    <section
      aria-labelledby={`${tableId}-title`}
      className="min-w-0 overflow-hidden rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel)]"
      data-language-rule-kind={kind}
    >
      <div className="border-b border-[var(--site-border-soft)] p-4 sm:p-5">
        <h3 id={`${tableId}-title`} className="text-base font-semibold text-stone-50 sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">{hint}</p>
      </div>

      <div className="min-w-0 overflow-hidden p-2 sm:p-3">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="border-b border-[var(--site-border-soft)]">
              <th scope="col" className="w-1/2 px-2 py-2 text-xs font-medium text-stone-400 sm:px-3">
                {copy.sourceRuleHeading}
              </th>
              <th scope="col" className="w-1/2 px-2 py-2 text-xs font-medium text-stone-400 sm:px-3">
                {copy.targetRuleHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {rulePairs.map((rulePair, index) => {
              const sourceLabel = `${copy.sourceRuleHeading} · ${title} · ${index + 1}`;
              const targetLabel = `${copy.targetRuleHeading} · ${title} · ${index + 1}`;

              return (
                <tr
                  key={`${kind}-${index}`}
                  className="border-b border-[var(--site-border-soft)] last:border-b-0"
                  data-language-rule-index={index}
                >
                  <td className="px-1 py-1.5 sm:px-2">
                    <input
                      aria-label={sourceLabel}
                      autoComplete="off"
                      className="h-11 w-full min-w-0 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
                      data-language-rule-field="source"
                      maxLength={maxLength}
                      spellCheck={false}
                      type="text"
                      value={rulePair.source}
                      onChange={(event) => {
                        onRuleChange(kind, index, 'source', event.target.value);
                      }}
                    />
                  </td>
                  <td className="px-1 py-1.5 sm:px-2">
                    <input
                      aria-label={targetLabel}
                      autoComplete="off"
                      className="h-11 w-full min-w-0 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
                      data-language-rule-field="target"
                      maxLength={maxLength}
                      spellCheck={false}
                      type="text"
                      value={rulePair.target}
                      onChange={(event) => {
                        onRuleChange(kind, index, 'target', event.target.value);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function LanguageGeneratorRuleEditor({
  copy,
  rules,
  combinationsEnabled,
  onRuleChange,
  onCombinationsEnabledChange,
  onApplyRules,
  onResetRules,
  onSaveRules,
}: LanguageGeneratorRuleEditorProps) {
  requireLanguageRules(rules);

  const headingId = useId();
  const orderHintId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="min-w-0 overflow-hidden rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-4 text-[var(--site-ink)] shadow-sm sm:p-6"
    >
      <header>
        <h2 id={headingId} className="text-xl font-semibold text-stone-50 sm:text-2xl">
          {copy.rulesTab}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">{copy.ruleOrderHint}</p>
      </header>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <LanguageRuleTable
          copy={copy}
          kind="characters"
          rulePairs={rules.characters}
          onRuleChange={onRuleChange}
        />
        <LanguageRuleTable
          copy={copy}
          kind="combinations"
          rulePairs={rules.combinations}
          onRuleChange={onRuleChange}
        />
      </div>

      <div className="mt-6 rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 sm:p-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-stone-100">
          <input
            aria-describedby={orderHintId}
            className="size-5 shrink-0 accent-[var(--site-accent-strong)]"
            type="checkbox"
            checked={combinationsEnabled}
            onChange={(event) => onCombinationsEnabledChange(event.target.checked)}
          />
          <span>{copy.combinationsEnabledLabel}</span>
        </label>
        <p id={orderHintId} className="mt-2 pl-8 text-sm leading-6 text-stone-300">
          {copy.ruleOrderHint}
        </p>
      </div>

      <footer className="mt-6 flex flex-wrap justify-end gap-2 border-t border-[var(--site-border-soft)] pt-4">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-4 text-sm font-medium text-stone-200 transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/60"
          onClick={onResetRules}
        >
          {copy.resetRulesButton}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-accent-bg)] px-4 text-sm font-medium text-[var(--site-accent-strong)] transition-colors hover:bg-[var(--site-accent-bg)]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/60"
          onClick={onSaveRules}
        >
          {copy.saveRulesButton}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--site-accent-strong)] px-5 text-sm font-semibold text-stone-950 transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/60"
          onClick={onApplyRules}
        >
          {copy.applyRulesButton}
        </button>
      </footer>
    </section>
  );
}
