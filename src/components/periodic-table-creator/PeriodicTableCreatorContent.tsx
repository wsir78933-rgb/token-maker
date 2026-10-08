import { ArrowRight } from 'lucide-react';

import { PeriodicTableCreatorFaq } from '@/components/periodic-table-creator/PeriodicTableCreatorFaq';
import { PeriodicTableCreatorCaseStudies } from '@/components/periodic-table-creator/PeriodicTableCreatorCaseStudies';
import { PeriodicTableCreatorFeatureGrid } from '@/components/periodic-table-creator/PeriodicTableCreatorFeatureGrid';
import {
  getPeriodicTablePageContentCopy,
  type PeriodicTablePageContentCopy,
} from '@/lib/periodic-table-creator/page-content-copy';
import type { SiteLocale } from '@/lib/site-locale';
import { Button } from '@/components/ui/button';

type PeriodicTableWhatIsCopy = PeriodicTablePageContentCopy['whatIs'];
type PeriodicTableComparisonCopy = PeriodicTablePageContentCopy['comparison'];
type PeriodicTableHowItWorksCopy = PeriodicTablePageContentCopy['howItWorks'];
type PeriodicTableCallToActionCopy = PeriodicTablePageContentCopy['cta'];

function requirePeriodicTableWorkspaceId(workspaceId: unknown): string {
  if (typeof workspaceId !== 'string' || workspaceId.trim().length === 0) {
    throw new Error(
      `Periodic table content workspaceId must be a non-empty string. Received ${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspaceId;
}

function PeriodicTableCreatorWhatIs({ copy }: { copy: PeriodicTableWhatIsCopy }) {
  return (
    <section
      aria-labelledby="periodic-table-creator-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="periodic-table-creator-what-is-heading"
        className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
      >
        {copy.title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {copy.description}
      </p>
    </section>
  );
}

function PeriodicTableCreatorComparison({ copy }: { copy: PeriodicTableComparisonCopy }) {
  return (
    <section
      aria-labelledby="periodic-table-creator-comparison-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="periodic-table-creator-comparison-title"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-7 text-stone-400 lg:hidden">{copy.scrollHint}</p>

      <div
        aria-label={copy.tableLabel}
        className="mt-8 w-full overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[48rem] table-fixed border-collapse text-left text-sm sm:text-base">
          <caption className="sr-only">{copy.tableLabel}</caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[32%]" />
            <col className="w-[25%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/15">
              <th scope="col" className="px-4 py-4 font-medium text-stone-400">
                {copy.headings.dimension}
              </th>
              <th
                scope="col"
                className="border-x border-white/10 bg-white/[0.04] px-4 py-4 font-semibold text-[var(--site-accent-strong)]"
              >
                {copy.headings.periodicTable}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.headings.spreadsheet}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.headings.drawing}
              </th>
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.dimension} className="border-b border-white/10 last:border-b-0">
                <th scope="row" className="px-4 py-4 align-top font-medium text-stone-100">
                  {row.dimension}
                </th>
                <td className="border-x border-white/10 bg-white/[0.04] px-4 py-4 align-top font-medium text-stone-100">
                  {row.periodicTable}
                </td>
                <td className="px-4 py-4 align-top text-stone-300">{row.spreadsheet}</td>
                <td className="px-4 py-4 align-top text-stone-300">{row.drawing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PeriodicTableCreatorHowItWorks({ copy }: { copy: PeriodicTableHowItWorksCopy }) {
  return (
    <section
      aria-labelledby="periodic-table-creator-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.eyebrow}
        </span>
        <h2
          id="periodic-table-creator-how-it-works-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block" />
        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {copy.steps.map((step, index) => (
            <li key={`${step.title}-${index}`} className="relative flex flex-col items-center gap-4 text-center">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background">
                <span className="text-xs font-semibold tabular-nums text-stone-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold tracking-tight text-stone-50">{step.title}</h3>
                <p className="text-sm leading-relaxed text-stone-300">{step.description}</p>
              </div>
              {index < copy.steps.length - 1 ? (
                <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 md:hidden" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PeriodicTableCreatorCallToAction({
  copy,
  workspaceId,
}: {
  copy: PeriodicTableCallToActionCopy;
  workspaceId: string;
}) {
  return (
    <section
      id="periodic-table-creator-call-to-action"
      aria-labelledby="periodic-table-creator-call-to-action-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="periodic-table-creator-call-to-action-title"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 rounded-full px-8"
          nativeButton={false}
          render={<a href={`#${workspaceId}`} />}
        >
          {copy.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function PeriodicTableCreatorContent({
  locale,
  workspaceId,
}: {
  locale: SiteLocale;
  workspaceId: string;
}) {
  const copy = getPeriodicTablePageContentCopy(locale);
  const validatedWorkspaceId = requirePeriodicTableWorkspaceId(workspaceId);

  return (
    <>
      <PeriodicTableCreatorWhatIs copy={copy.whatIs} />
      <PeriodicTableCreatorCaseStudies locale={locale} />
      <PeriodicTableCreatorFeatureGrid copy={copy.features} />
      <PeriodicTableCreatorHowItWorks copy={copy.howItWorks} />
      <PeriodicTableCreatorComparison copy={copy.comparison} />
      <PeriodicTableCreatorCallToAction copy={copy.cta} workspaceId={validatedWorkspaceId} />
      <PeriodicTableCreatorFaq copy={copy.faq} />
    </>
  );
}
