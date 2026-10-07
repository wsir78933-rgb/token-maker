import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Layers3,
  LayoutGrid,
  Lightbulb,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';

import { TarotCallToAction } from '@/components/tarot-cards/TarotCallToAction';
import { TarotCaseStudies } from '@/components/tarot-cards/TarotCaseStudies';
import { TarotFaq } from '@/components/tarot-cards/TarotFaq';
import { getTarotCaseStudies } from '@/lib/tarot-cards/case-studies';
import {
  getTarotPageContent,
  type TarotFeatureIcon,
  type TarotPageContent,
} from '@/lib/tarot-cards/page-content';
import type { SiteLocale } from '@/lib/site-locale';

const TAROT_FEATURE_ICONS: Record<TarotFeatureIcon, LucideIcon> = {
  cards: Layers3,
  spreads: LayoutGrid,
  flip: RefreshCw,
  meanings: BookOpen,
  deck: BookMarked,
  inspiration: Lightbulb,
};

function TarotWhatIs({ copy }: { copy: TarotPageContent['whatIs'] }) {
  return (
    <section
      aria-labelledby="tarot-cards-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="tarot-cards-what-is-heading"
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

function TarotFeatureGrid({ copy }: { copy: TarotPageContent['features'] }) {
  return (
    <section
      aria-labelledby="tarot-cards-features-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="tarot-cards-features-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.items.map((feature) => {
          const Icon = TAROT_FEATURE_ICONS[feature.icon];
          if (Icon === undefined) {
            throw new Error(`Unknown Tarot feature icon ${JSON.stringify(feature.icon)}.`);
          }

          return (
            <li key={feature.icon} className="min-w-0">
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045] motion-reduce:transition-none">
                <div
                  aria-hidden="true"
                  className="mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-amber-200"
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
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

function TarotHowItWorks({ copy }: { copy: TarotPageContent['howItWorks'] }) {
  if (copy.steps.length === 0) {
    throw new Error('Tarot how-it-works steps must not be empty. Received length 0.');
  }

  return (
    <section
      aria-labelledby="tarot-cards-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.eyebrow}
        </span>
        <h2
          id="tarot-cards-how-it-works-heading"
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
            <li
              key={`${step.title}-${index}`}
              className="relative flex flex-col items-center gap-4 text-center"
            >
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

function TarotToolComparison({ copy }: { copy: TarotPageContent['comparison'] }) {
  if (copy.rows.length === 0) {
    throw new Error('Tarot comparison rows must not be empty. Received length 0.');
  }

  return (
    <section
      aria-labelledby="tarot-cards-comparison-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="tarot-cards-comparison-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </div>

      <div
        aria-label={copy.tableLabel}
        className="mt-8 w-full overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[48rem] table-fixed border-collapse text-left text-sm sm:text-base">
          <caption className="sr-only">{copy.title}</caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[32%]" />
            <col className="w-[25%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/15">
              <th scope="col" className="px-4 py-4 font-medium text-stone-400">
                {copy.dimensionHeading}
              </th>
              <th
                scope="col"
                className="border-x border-white/10 bg-white/[0.04] px-4 py-4 font-semibold text-[var(--site-accent-strong)]"
              >
                {copy.toolHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.physicalHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.randomTableHeading}
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
                  {row.tool}
                </td>
                <td className="px-4 py-4 align-top text-stone-300">{row.physical}</td>
                <td className="px-4 py-4 align-top text-stone-300">{row.randomTable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function TarotContentSections({ locale }: { locale: SiteLocale }) {
  const copy = getTarotPageContent(locale);

  return (
    <>
      <TarotWhatIs copy={copy.whatIs} />
      <TarotCaseStudies copy={getTarotCaseStudies(locale)} />
      <TarotFeatureGrid copy={copy.features} />
      <TarotHowItWorks copy={copy.howItWorks} />
      <TarotToolComparison copy={copy.comparison} />
      <TarotCallToAction copy={copy.callToAction} />
      <TarotFaq copy={copy.faq} />
    </>
  );
}
