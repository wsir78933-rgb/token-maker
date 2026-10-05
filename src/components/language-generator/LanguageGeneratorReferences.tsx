'use client';

import type { LanguageGeneratorCopy } from '@/lib/language-generator/copy';
import {
  getReferenceLanguage,
  REFERENCE_LANGUAGES,
  type ReferenceLanguage,
} from '@/lib/language-generator/references';

export type LanguageReferenceGroup = 'real' | 'user';

export type LanguageGeneratorReferencesProps = {
  copy: LanguageGeneratorCopy;
  group: LanguageReferenceGroup;
  selectedLanguageId: string;
  onGroupChange: (group: LanguageReferenceGroup) => void;
  onLanguageChange: (languageId: string) => void;
};

const REFERENCE_GROUPS: readonly LanguageReferenceGroup[] = ['real', 'user'];

function referenceGroupLabel(copy: LanguageGeneratorCopy, group: LanguageReferenceGroup): string {
  if (group === 'real') return copy.standardReferencesLabel;
  return copy.communityReferencesLabel;
}

function readSelectedReferenceLanguage(selectedLanguageId: string): ReferenceLanguage {
  const selectedLanguage = getReferenceLanguage(selectedLanguageId);

  if (!selectedLanguage) {
    throw new Error(
      `Unknown reference language. Received selectedLanguageId ${JSON.stringify(selectedLanguageId)}.`,
    );
  }

  return selectedLanguage;
}

/** A controlled reference browser for the fixed 67-entry vocabulary. */
export function LanguageGeneratorReferences({
  copy,
  group,
  selectedLanguageId,
  onGroupChange,
  onLanguageChange,
}: LanguageGeneratorReferencesProps) {
  const selectedLanguage = readSelectedReferenceLanguage(selectedLanguageId);
  const visibleLanguages = REFERENCE_LANGUAGES.filter((language) => language.group === group);

  if (visibleLanguages.length === 0) {
    throw new Error(`Reference language group has no languages. Received group ${JSON.stringify(group)}.`);
  }

  const headingId = 'language-generator-reference-heading';
  const languageListId = `language-generator-reference-languages-${group}`;
  const tableLabelId = 'language-generator-reference-table-heading';

  return (
    <section
      aria-labelledby={headingId}
      data-testid="language-generator-references"
      className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 text-stone-100 shadow-[0_28px_90px_-58px_rgba(0,0,0,0.82)] sm:p-6"
    >
      <header className="min-w-0">
        <h2 id={headingId} className="font-display text-xl font-semibold tracking-tight text-stone-50 sm:text-2xl">
          {copy.referenceTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
          {copy.referenceDescription}
        </p>
        <div className="mt-3 rounded-xl border border-[#d7b46a]/20 bg-[#d7b46a]/[0.06] px-3 py-3 text-sm text-stone-300">
          <p className="leading-6 text-stone-200">{copy.referenceRomanizationHint}</p>
        </div>
      </header>

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-[minmax(13rem,16rem)_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <nav
            aria-label={copy.referenceLanguageLabel}
            className="grid grid-cols-2 gap-2"
          >
            {REFERENCE_GROUPS.map((referenceGroup) => {
              const isSelectedGroup = group === referenceGroup;
              const groupLanguages = REFERENCE_LANGUAGES.filter(
                (language) => language.group === referenceGroup,
              );

              return (
                <button
                  key={referenceGroup}
                  aria-pressed={isSelectedGroup}
                  className="min-h-11 min-w-0 rounded-lg border border-white/10 px-2 py-2 text-left text-xs font-medium leading-5 text-stone-300 transition hover:border-white/25 hover:bg-white/[0.05] aria-pressed:border-[#d7b46a]/45 aria-pressed:bg-[#d7b46a]/10 aria-pressed:text-[#f1d492] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d492] sm:px-3 sm:text-sm"
                  data-reference-group={referenceGroup}
                  type="button"
                  onClick={() => onGroupChange(referenceGroup)}
                >
                  <span className="block truncate">{referenceGroupLabel(copy, referenceGroup)}</span>
                  <span className="mt-0.5 block text-[11px] text-stone-500">{groupLanguages.length}</span>
                </button>
              );
            })}
          </nav>

          <div
            aria-label={referenceGroupLabel(copy, group)}
            className="mt-3 max-h-[28rem] min-w-0 space-y-1 overflow-y-auto overscroll-y-contain pr-1"
            data-testid="language-generator-reference-language-list"
            id={languageListId}
            role="region"
          >
            <p className="px-2 pb-1 text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
              {copy.referenceLanguageLabel}
            </p>
            {visibleLanguages.map((language) => {
              const isSelectedLanguage = selectedLanguage.id === language.id;

              return (
                <button
                  key={language.id}
                  aria-pressed={isSelectedLanguage}
                  className="flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-2 text-left text-sm text-stone-300 transition hover:border-white/15 hover:bg-white/[0.05] aria-pressed:border-[#d7b46a]/40 aria-pressed:bg-[#d7b46a]/10 aria-pressed:text-[#f1d492] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d492]"
                  data-reference-language={language.id}
                  type="button"
                  onClick={() => onLanguageChange(language.id)}
                >
                  <span className="min-w-0 truncate">{language.name}</span>
                  {isSelectedLanguage ? <span aria-hidden="true" className="shrink-0 text-[#f1d492]">●</span> : null}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-3 sm:p-4">
          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
                {copy.referenceLanguageLabel}
              </p>
              <h3 id={tableLabelId} className="mt-1 truncate font-display text-lg font-semibold text-stone-50">
                {selectedLanguage.name}
              </h3>
            </div>
          </div>

          <div className="mt-3 max-h-[38rem] max-w-full min-w-0 overflow-auto overscroll-y-contain rounded-lg border border-white/10">
            <table
              aria-labelledby={tableLabelId}
              className="w-full min-w-[34rem] border-collapse text-left text-sm"
              data-testid="language-generator-reference-table"
            >
              <thead className="sticky top-0 z-10 bg-[#18130e] text-xs uppercase tracking-[0.12em] text-stone-400">
                <tr>
                  <th className="w-1/2 border-b border-white/10 px-3 py-3 font-medium" scope="col">
                    {copy.sourceHeading}
                  </th>
                  <th className="w-1/2 border-b border-white/10 px-3 py-3 font-medium" scope="col">
                    {copy.resultHeading}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {selectedLanguage.entries.map((entry, entryIndex) => {
                  if (typeof entry.source !== 'string') {
                    throw new Error(
                      `Reference source must be a string at entry ${entryIndex}. Received ${JSON.stringify(entry.source)}.`,
                    );
                  }

                  if (typeof entry.translation !== 'string') {
                    throw new Error(
                      `Reference translation must be a string at entry ${entryIndex}. Received ${JSON.stringify(entry.translation)}.`,
                    );
                  }

                  const hasRomanizedValue = entry.translation.trim().length > 0;

                  return (
                    <tr key={`${selectedLanguage.id}-${entryIndex}`} data-testid="language-reference-entry-row">
                      <td className="whitespace-nowrap px-3 py-2.5 align-top text-stone-300">{entry.source}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 align-top text-stone-100">
                        {hasRomanizedValue ? entry.translation : <span className="text-stone-500">{copy.referenceUnavailable}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
