import { ArrowRight, ArrowUp, Download, Layers, Pencil, Shapes, Shield, type LucideIcon, Type } from 'lucide-react';

import { CoatMakerFaqAccordion } from '@/components/coat-of-arms/CoatMakerFaqAccordion';
import { CoatMakerShowcase } from '@/components/coat-of-arms/CoatMakerShowcase';
import {
  getCoatMakerSeoCopy,
  type CoatMakerFeatureIcon,
} from '@/components/coat-of-arms/coat-maker-seo-copy';
import type { SiteLocale } from '@/lib/site-locale';

type CoatMakerSeoCopy = ReturnType<typeof getCoatMakerSeoCopy>;

const COAT_MAKER_FEATURE_ICONS: Record<CoatMakerFeatureIcon, LucideIcon> = {
  shield: Shield,
  symbols: Shapes,
  text: Type,
  layers: Layers,
  drawing: Pencil,
  export: Download,
};

function renderWhatIsSection(copy: CoatMakerSeoCopy) {
  return (
    <section
      id="coat-maker-what-is"
      aria-labelledby="coat-maker-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="coat-maker-what-is-heading"
        className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
      >
        {copy.whatIsTitle}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {copy.whatIsDescription}
      </p>
    </section>
  );
}

function renderFeatureGrid(copy: CoatMakerSeoCopy) {
  return (
    <section
      id="coat-maker-features"
      aria-labelledby="coat-maker-features-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="coat-maker-features-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.featureOverview.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.featureOverview.subtitle}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.featureOverview.features.map((feature) => {
          const FeatureIcon = COAT_MAKER_FEATURE_ICONS[feature.icon];

          if (FeatureIcon === undefined) {
            throw new Error(`Missing Coat Maker feature icon for key: ${JSON.stringify(feature.icon)}`);
          }

          return (
            <li key={feature.icon} className="min-w-0">
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045] motion-reduce:transition-none">
                <div
                  aria-hidden="true"
                  className="mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-amber-200"
                >
                  <FeatureIcon className="size-5" />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50 text-balance">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300 text-pretty">
                  {feature.description}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function renderHowItWorksSection(copy: CoatMakerSeoCopy) {
  return (
    <section
      id="coat-maker-how-it-works"
      aria-labelledby="coat-maker-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.howItWorksEyebrow}
        </span>
        <h2
          id="coat-maker-how-it-works-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.howItWorksHeading}
        </h2>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block" />
        <ol className="relative m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
          {copy.howItWorksSteps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col items-center gap-4 text-center">
              <div
                aria-hidden="true"
                className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background"
              >
                <span className="text-xs font-semibold tabular-nums text-stone-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold tracking-tight text-stone-50">{step.title}</h3>
                <p className="text-sm leading-relaxed text-stone-300">{step.description}</p>
              </div>
              {index < copy.howItWorksSteps.length - 1 ? (
                <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 md:hidden" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function renderComparisonTable(copy: CoatMakerSeoCopy) {
  return (
    <table className="w-full min-w-[48rem] table-fixed border-collapse text-left text-sm sm:text-base">
      <caption className="sr-only">{copy.comparisonHeading}</caption>
      <colgroup>
        <col className="w-[18%]" />
        <col className="w-[32%]" />
        <col className="w-[25%]" />
        <col className="w-[25%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-white/15">
          <th scope="col" className="px-4 py-4 font-medium text-stone-400">
            {copy.comparisonDimensionHeading}
          </th>
          {copy.comparisonColumns.map((comparisonColumn, columnIndex) => (
            <th
              key={comparisonColumn}
              scope="col"
              className={
                columnIndex === 0
                  ? 'border-x border-white/10 bg-white/[0.04] px-4 py-4 font-semibold text-[var(--site-accent-strong)]'
                  : 'px-4 py-4 font-medium text-stone-200'
              }
            >
              {comparisonColumn}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {copy.comparisonRows.map((comparisonRow) => (
          <tr key={comparisonRow.rowLabel} className="border-b border-white/10 last:border-b-0">
            <th scope="row" className="px-4 py-4 align-top font-medium text-stone-100">
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
                  className={
                    cellIndex === 0
                      ? 'border-x border-white/10 bg-white/[0.04] px-4 py-4 align-top font-medium text-stone-100'
                      : 'px-4 py-4 align-top text-stone-300'
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
  );
}

function renderComparisonSection(copy: CoatMakerSeoCopy) {
  return (
    <section
      id="coat-maker-comparison"
      aria-labelledby="coat-maker-comparison-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="coat-maker-comparison-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.comparisonHeading}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.comparisonLead}
        </p>
      </div>

      <div
        id="coat-maker-comparison-scroll"
        aria-label={copy.comparisonTableLabel}
        className="mt-8 w-full overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300"
        role="region"
        tabIndex={0}
      >
        {renderComparisonTable(copy)}
      </div>
    </section>
  );
}

function renderFaqSection(copy: CoatMakerSeoCopy, locale: SiteLocale) {
  return (
    <section
      id="coat-maker-faq"
      aria-labelledby="coat-maker-faq-heading"
      aria-describedby="coat-maker-faq-description"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{copy.faqEyebrow}</span>
        <h2
          id="coat-maker-faq-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.faqHeading}
        </h2>
        <p id="coat-maker-faq-description" className="max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.faqDescription}
        </p>
      </header>

      <CoatMakerFaqAccordion locale={locale} faqItems={copy.faqItems} />
    </section>
  );
}

export function CoatMakerSeoContent({ locale }: { locale: SiteLocale }) {
  const copy = getCoatMakerSeoCopy(locale);

  return (
    <section
      data-testid="coat-maker-seo-content"
      className="coat-maker-seo-content border-t border-white/10 bg-[#100d08] text-stone-100"
    >
      {renderWhatIsSection(copy)}
      <CoatMakerShowcase locale={locale} />
      {renderFeatureGrid(copy)}
      {renderHowItWorksSection(copy)}
      {renderComparisonSection(copy)}

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
        <section className="rounded-3xl border border-[#d7b46a]/25 bg-[#d7b46a]/[0.07] p-6 sm:p-8">
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
      </div>

      {renderFaqSection(copy, locale)}
    </section>
  );
}
