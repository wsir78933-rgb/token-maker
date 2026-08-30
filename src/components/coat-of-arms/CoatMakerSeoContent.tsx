import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

import { CoatMakerFaqAccordion } from '@/components/coat-of-arms/CoatMakerFaqAccordion';
import { getCoatMakerSeoCopy } from '@/components/coat-of-arms/coat-maker-seo-copy';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

type CoatMakerSeoCopy = ReturnType<typeof getCoatMakerSeoCopy>;

function renderUseCaseCards(useCases: CoatMakerSeoCopy['useCases'], locale: SiteLocale) {
  return useCases.map((useCase, useCaseIndex) => {
    if (useCase.imageSrc.trim().length === 0) {
      throw new Error(`Missing Coat Maker SEO field useCases[${useCaseIndex}].imageSrc for locale: ${locale}`);
    }

    if (useCase.imageAlt.trim().length === 0) {
      throw new Error(`Missing Coat Maker SEO field useCases[${useCaseIndex}].imageAlt for locale: ${locale}`);
    }

    return (
      <article
        key={useCase.title}
        className="rounded-2xl border border-white/10 bg-black/25 p-4 transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-[#d7b46a]/40 hover:bg-black/40 sm:p-5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <img
          src={useCase.imageSrc}
          alt={useCase.imageAlt}
          width={1254}
          height={1254}
          className="mb-4 aspect-square h-auto w-full rounded-xl object-cover ring-1 ring-white/10"
        />
        <h3 className="text-base font-semibold leading-6 text-stone-50 text-balance">{useCase.title}</h3>
        <p className="mt-2.5 text-sm leading-6 text-stone-300 text-pretty">{useCase.body}</p>
      </article>
    );
  });
}

function renderComparisonTable(copy: CoatMakerSeoCopy) {
  return (
    <div className="coat-maker-seo-comparison-frame mt-8">
      <table className="coat-maker-seo-comparison-table">
        <thead>
          <tr>
            <th className="coat-maker-seo-comparison-corner" />
            {copy.comparisonColumns.map((comparisonColumn, columnIndex) => (
              <th
                key={comparisonColumn}
                scope="col"
                className={
                  columnIndex === 0
                    ? 'coat-maker-seo-comparison-winner-heading'
                    : 'coat-maker-seo-comparison-competitor-heading'
                }
              >
                {comparisonColumn}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {copy.comparisonRows.map((comparisonRow) => (
            <tr key={comparisonRow.rowLabel}>
              <th scope="row" className="coat-maker-seo-comparison-row-label">
                {comparisonRow.rowLabel}
              </th>
              {comparisonRow.cellText.map((cellText, cellIndex) => {
                const comparisonColumnLabel = copy.comparisonColumns[cellIndex];

                if (comparisonColumnLabel === undefined) {
                  throw new Error(
                    `Missing Coat Maker SEO comparison column at cellIndex ${cellIndex} for row: ${comparisonRow.rowLabel}`,
                  );
                }

                return (
                  <td
                    key={`${comparisonRow.rowLabel}-${cellIndex}`}
                    data-label={comparisonColumnLabel}
                    className={
                      cellIndex === 0
                        ? 'coat-maker-seo-comparison-winner-cell'
                        : 'coat-maker-seo-comparison-competitor-cell'
                    }
                  >
                    {cellText}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CoatMakerSeoContent({ locale }: { locale: SiteLocale }) {
  const copy = getCoatMakerSeoCopy(locale);

  return (
    <section
      data-testid="coat-maker-seo-content"
      className="coat-maker-seo-content border-t border-white/10 bg-[#100d08] text-stone-100"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl leading-tight text-stone-50 text-balance sm:text-5xl">{copy.heading}</h1>
          <p className="mt-5 text-base leading-8 text-stone-300 text-pretty">{copy.introduction}</p>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
            {copy.useCasesHeading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 text-pretty">{copy.useCasesLead}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">{renderUseCaseCards(copy.useCases, locale)}</div>
        </section>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <section>
            <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
              {copy.stepsHeading}
            </h2>
            <ol aria-label={copy.stepsAriaLabel} className="coat-maker-seo-steps mt-6">
              {copy.steps.map((step) => (
                <li key={step.title}>
                  <h3 className="font-semibold leading-6 text-stone-50">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-300 text-pretty">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
              {copy.featuresHeading}
            </h2>
            <ul className="coat-maker-seo-capabilities mt-6">
              {copy.verifiedCapabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
            {copy.comparisonHeading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 text-pretty">{copy.comparisonLead}</p>
          {renderComparisonTable(copy)}
        </section>

        <section className="mt-16 rounded-3xl border border-[#d7b46a]/25 bg-[#d7b46a]/[0.07] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
                {copy.editorCtaHeading}
              </h2>
              <p className="mt-3 font-semibold text-[#f1d492]">{copy.editorCtaEmphasis}</p>
              <p className="mt-2 text-sm leading-7 text-stone-300 text-pretty">{copy.editorCtaDescription}</p>
            </div>
            <a
              href="#coat-editor-workspace"
              className="site-cta-primary min-h-11 shrink-0 justify-center focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none!"
            >
              {copy.editorCtaLabel}
              <ArrowUp aria-hidden="true" className="size-4" />
            </a>
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-12">
          <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
            {copy.faqHeading}
          </h2>
          <CoatMakerFaqAccordion locale={locale} faqItems={copy.faqItems} />
        </section>

        <nav aria-label={copy.relatedToolsHeading} className="mt-16 border-t border-white/10 pt-8">
          <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance">
            {copy.relatedToolsHeading}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {copy.contextualLinks.map((contextualLink) => (
              <Link
                key={contextualLink.href}
                href={getLocalizedPath(locale, contextualLink.href)}
                prefetch={false}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-stone-200 transition-[border-color,color,background-color] duration-200 hover:border-[#d7b46a]/45 hover:bg-[#d7b46a]/10 hover:text-[#f1d492] motion-reduce:transition-none"
              >
                {contextualLink.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
