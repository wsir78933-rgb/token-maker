'use client';

import type { ChangeEvent } from 'react';

import type { LanguageGeneratorCopy } from '@/lib/language-generator/copy';

export type LanguageGeneratorTextConversionProps = {
  copy: LanguageGeneratorCopy;
  text: string;
  result: string;
  onTextChange: (text: string) => void;
  onTranslate: () => void;
  onClear: () => void;
  onCopy: () => void;
  copied: boolean;
};

function handleTextChange(
  event: ChangeEvent<HTMLTextAreaElement>,
  onTextChange: (text: string) => void,
): void {
  onTextChange(event.target.value);
}

export function LanguageGeneratorTextConversion({
  copy,
  text,
  result,
  onTextChange,
  onTranslate,
  onClear,
  onCopy,
  copied,
}: LanguageGeneratorTextConversionProps) {
  return (
    <section
      aria-labelledby="language-generator-text-title"
      data-testid="language-generator-text-conversion"
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] shadow-[var(--site-card-shadow)]"
    >
      <div className="border-b border-[var(--site-border-soft)] px-4 py-5 sm:px-6">
        <h2
          id="language-generator-text-title"
          className="font-display text-2xl font-semibold tracking-tight text-stone-50"
        >
          {copy.textTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
          {copy.textDescription}
        </p>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-2 lg:gap-6">
        <div className="min-w-0">
          <label
            htmlFor="language-generator-text-input"
            className="flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--site-accent-strong)]"
          >
            {copy.inputLabel}
          </label>
          <textarea
            id="language-generator-text-input"
            value={text}
            onChange={(event) => handleTextChange(event, onTextChange)}
            placeholder={copy.inputPlaceholder}
            rows={12}
            className="mt-3 block h-[23rem] min-h-64 w-full min-w-0 resize-y rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-panel)] p-4 text-sm leading-7 text-stone-100 outline-none transition placeholder:text-stone-500 focus-visible:border-[var(--site-accent-strong)] focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/30"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onTranslate}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--site-accent-strong)] px-4 text-sm font-semibold text-[#17130c] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
            >
              {copy.translateButton}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-4 text-sm font-semibold text-stone-100 transition hover:border-[var(--site-accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
            >
              {copy.clearButton}
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-stone-400">{copy.translationHint}</p>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--site-accent-strong)]">
              {copy.outputLabel}
            </h3>
            <button
              type="button"
              onClick={onCopy}
              disabled={result.length === 0}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-3 text-xs font-semibold text-stone-100 transition hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
            >
              {copied ? copy.copiedLabel : copy.copyButton}
            </button>
          </div>
          <output
            aria-label={copy.outputLabel}
            aria-live="polite"
            className="mt-3 block min-h-[23rem] whitespace-pre-wrap break-words rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-4 text-sm leading-7 text-stone-100"
          >
            {result.length > 0 ? result : <span className="text-stone-500">{copy.emptyOutput}</span>}
          </output>
        </div>
      </div>
    </section>
  );
}

export default LanguageGeneratorTextConversion;
