import { ArrowRight, Check, X } from 'lucide-react';

import { NoticeBoardCreatorCaseStudies } from '@/components/notice-board-creator/NoticeBoardCreatorCaseStudies';
import { NoticeBoardCreatorFaq } from '@/components/notice-board-creator/NoticeBoardCreatorFaq';
import { ToolRecommendationSection } from '@/components/site/ToolRecommendationSection';
import { NoticeBoardCreatorFeatureGrid } from '@/components/notice-board-creator/NoticeBoardCreatorFeatureGrid';
import { NoticeBoardCreatorPageHeading } from '@/components/notice-board-creator/NoticeBoardCreatorPageHeading';
import { NoticeBoardCreatorWhatIs } from '@/components/notice-board-creator/NoticeBoardCreatorWhatIs';
import { NoticeBoardCreatorWorkbench } from '@/components/notice-board-creator/NoticeBoardCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { Button } from '@/components/ui/button';
import { NOTICE_BOARD_CREATOR_EDITOR_ID } from '@/lib/notice-board-creator/constants';
import {
  getNoticeBoardCreatorLandingCopy,
  type NoticeBoardCreatorComparisonCellCopy,
  type NoticeBoardCreatorLandingCopy,
} from '@/lib/notice-board-creator/landing-copy';
import type { SiteLocale } from '@/lib/site-locale';

const NOTICE_BOARD_CREATOR_PATH = '/notice-board-creator';

function NoticeBoardCreatorHowToUse({
  pageCopy,
}: {
  pageCopy: NoticeBoardCreatorLandingCopy;
}) {
  return (
    <section
      id="notice-board-creator-how-to-use"
      aria-labelledby="notice-board-creator-how-to-use-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {pageCopy.howToUseEyebrow}
        </span>
        <h2
          id="notice-board-creator-how-to-use-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {pageCopy.howToUseTitle}
        </h2>
      </header>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block"
        />
        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {pageCopy.howToUseSteps.map((stepCopy, index) => (
            <li key={stepCopy.title} className="relative flex flex-col items-center gap-4 text-center">
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background text-xs font-semibold tabular-nums text-stone-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold tracking-tight text-stone-50">{stepCopy.title}</h3>
                <p className="text-sm leading-relaxed text-stone-300">{stepCopy.description}</p>
              </div>
              {index < pageCopy.howToUseSteps.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="mt-2 size-4 text-stone-400/40 md:hidden"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function NoticeBoardCreatorComparisonCell({
  cellCopy,
  sourceCheckedLabel,
  isHighlighted = false,
}: {
  cellCopy: NoticeBoardCreatorComparisonCellCopy;
  sourceCheckedLabel: string;
  isHighlighted?: boolean;
}) {
  const standardCellClassName =
    'break-words px-1.5 py-3 text-center align-middle text-xs leading-4 text-[var(--site-ink)] sm:px-5 sm:py-5 sm:text-base sm:leading-6';
  const cellClassName = isHighlighted
    ? `${standardCellClassName} border-x border-[var(--site-border-soft)] bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)]`
    : standardCellClassName;
  const comparisonSourceLink = cellCopy.source ? (
    <a
      href={cellCopy.source.href}
      target="_blank"
      rel="noreferrer"
      className="mt-2 block text-xs font-normal leading-4 text-[var(--site-ink-soft)] underline underline-offset-2 hover:text-[var(--site-ink)]"
    >
      {cellCopy.source.label} · {sourceCheckedLabel} {cellCopy.source.checkedOn}
    </a>
  ) : null;

  if (cellCopy.status === 'limited') {
    return (
      <td data-comparison-status={cellCopy.status} className={cellClassName}>
        <span>{cellCopy.label}</span>
        {comparisonSourceLink}
      </td>
    );
  }

  const statusIcon =
    cellCopy.status === 'supported' ? (
      <Check aria-hidden="true" className="mx-auto size-5 text-[var(--site-accent-strong)] sm:size-6" />
    ) : (
      <X aria-hidden="true" className="mx-auto size-5 text-[var(--site-ink-soft)] sm:size-6" />
    );

  return (
    <td data-comparison-status={cellCopy.status} className={cellClassName}>
      {statusIcon}
      <span className="mt-1 block text-xs leading-4">{cellCopy.label}</span>
      {comparisonSourceLink}
    </td>
  );
}

function NoticeBoardCreatorComparison({
  pageCopy,
}: {
  pageCopy: NoticeBoardCreatorLandingCopy;
}) {
  return (
    <section
      id="notice-board-creator-comparison"
      aria-labelledby="notice-board-creator-comparison-heading"
      className="mx-auto max-w-7xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="flex flex-col items-center gap-3 text-center">
        <h2
          id="notice-board-creator-comparison-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {pageCopy.comparisonTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {pageCopy.comparisonDescription}
        </p>
      </header>

      <div
        aria-label={pageCopy.comparisonTableLabel}
        className="mt-8 w-full overflow-x-auto rounded-2xl border border-[var(--site-border-soft)] bg-[var(--site-panel)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--site-accent-strong)]"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
          <caption className="sr-only">{pageCopy.comparisonTitle}</caption>
          <colgroup>
            <col className="w-[40%] sm:w-[28%]" />
            <col className="w-[20%] sm:w-[24%]" />
            <col className="w-[20%] sm:w-[24%]" />
            <col className="w-[20%] sm:w-[24%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--site-border-soft)]">
              <th
                scope="col"
                className="break-words px-1.5 py-3 text-left text-[10px] font-semibold uppercase leading-4 tracking-normal text-[var(--site-ink-soft)] sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.16em]"
              >
                {pageCopy.comparisonDimensionHeading}
              </th>
              <th
                scope="col"
                className="break-words border-x border-[var(--site-border-soft)] bg-[var(--site-accent-bg)] px-1.5 py-3 text-center text-[10px] font-semibold uppercase leading-4 tracking-normal text-[var(--site-accent-strong)] sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.16em]"
              >
                {pageCopy.noticeBoardCreatorHeading}
              </th>
              <th
                scope="col"
                className="break-words px-1.5 py-3 text-center text-[10px] font-semibold uppercase leading-4 tracking-normal text-[var(--site-ink-soft)] sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.16em]"
              >
                {pageCopy.rollForFantasyHeading === 'RollForFantasy' ? (
                  <>RollFor<wbr />Fantasy</>
                ) : (
                  pageCopy.rollForFantasyHeading
                )}
              </th>
              <th
                scope="col"
                className="break-words px-1.5 py-3 text-center text-[10px] font-semibold uppercase leading-4 tracking-normal text-[var(--site-ink-soft)] sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.16em]"
              >
                {pageCopy.helpWantedHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageCopy.comparisonRows.map((rowCopy) => (
              <tr key={rowCopy.dimension} className="border-b border-[var(--site-border-soft)] last:border-b-0">
                <th
                  scope="row"
                  className="break-words px-1.5 py-3 text-left align-middle text-xs font-medium leading-4 text-[var(--site-ink-strong)] sm:px-5 sm:py-5 sm:text-base sm:leading-6"
                >
                  {rowCopy.dimension}
                </th>
                <NoticeBoardCreatorComparisonCell
                  cellCopy={rowCopy.noticeBoardCreator}
                  sourceCheckedLabel={pageCopy.comparisonSourceCheckedLabel}
                  isHighlighted
                />
                <NoticeBoardCreatorComparisonCell
                  cellCopy={rowCopy.rollForFantasy}
                  sourceCheckedLabel={pageCopy.comparisonSourceCheckedLabel}
                />
                <NoticeBoardCreatorComparisonCell
                  cellCopy={rowCopy.helpWanted}
                  sourceCheckedLabel={pageCopy.comparisonSourceCheckedLabel}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NoticeBoardCreatorCallToAction({
  pageCopy,
}: {
  pageCopy: NoticeBoardCreatorLandingCopy;
}) {
  return (
    <section
      id="notice-board-creator-call-to-action"
      aria-labelledby="notice-board-creator-call-to-action-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="notice-board-creator-call-to-action-heading"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {pageCopy.callToActionTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {pageCopy.callToActionDescription}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 min-w-[44px] rounded-full px-8"
          nativeButton={false}
          render={<a href={`#${NOTICE_BOARD_CREATOR_EDITOR_ID}`} role="link" />}
        >
          {pageCopy.callToActionLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function NoticeBoardCreatorPageContent({ locale }: { locale: SiteLocale }) {
  const pageCopy = getNoticeBoardCreatorLandingCopy(locale);

  return (
    <>
      <NoticeBoardCreatorPageHeading locale={locale} pageCopy={pageCopy} />
      <div
        id={NOTICE_BOARD_CREATOR_EDITOR_ID}
        className="mx-auto w-full scroll-mt-20 px-4 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-6"
      >
        <NoticeBoardCreatorWorkbench locale={locale} />
      </div>
      <NoticeBoardCreatorWhatIs pageCopy={pageCopy} />
      <NoticeBoardCreatorCaseStudies locale={locale} />
      <NoticeBoardCreatorFeatureGrid pageCopy={pageCopy} />
      <NoticeBoardCreatorHowToUse pageCopy={pageCopy} />
      <NoticeBoardCreatorComparison pageCopy={pageCopy} />
      <NoticeBoardCreatorCallToAction pageCopy={pageCopy} />
      <NoticeBoardCreatorFaq pageCopy={pageCopy} />
      <ToolRecommendationSection locale={locale} currentPath="/notice-board-creator" />
    </>
  );
}

export function NoticeBoardCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome
      locale={locale}
      currentPath={NOTICE_BOARD_CREATOR_PATH}
      tone="hub"
      className="notice-board-creator-page [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer"
    >
      <NoticeBoardCreatorPageContent locale={locale} />
    </InnerPageChrome>
  );
}
