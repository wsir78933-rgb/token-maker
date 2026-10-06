import {
  ArrowRight,
  Copy,
  Dices,
  History,
  Layers3,
  SlidersHorizontal,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { DiceRollerCaseStudies } from '@/components/dice/DiceRollerCaseStudies';
import type { DiceRollerPageCopy } from '@/lib/site-content';

const DICE_ROLLER_FEATURE_ICONS: Record<
  DiceRollerPageCopy['featureOverview']['features'][number]['icon'],
  LucideIcon
> = {
  dice: Dices,
  pool: Layers3,
  modifier: SlidersHorizontal,
  animation: Sparkles,
  copy: Copy,
  history: History,
};

function DiceRollerWhatIs({ copy }: { copy: DiceRollerPageCopy }) {
  return (
    <section
      aria-labelledby="dice-roller-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="dice-roller-what-is-heading"
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

function DiceRollerFeatureGrid({ copy }: { copy: DiceRollerPageCopy }) {
  return (
    <section
      aria-labelledby="dice-roller-feature-grid-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="dice-roller-feature-grid-heading"
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
          const Icon = DICE_ROLLER_FEATURE_ICONS[feature.icon];

          return (
            <li key={feature.icon} className="min-w-0">
              <article
                className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045] motion-reduce:transition-none"
              >
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

function DiceRollerToolComparison({
  copy,
}: {
  copy: DiceRollerPageCopy['toolComparison'];
}) {
  return (
    <section
      aria-labelledby="dice-roller-tool-comparison-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="dice-roller-tool-comparison-title"
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
                {copy.diceRollerHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.physicalDiceHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.roll20Heading}
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
                  {row.diceRoller}
                </td>
                <td className="px-4 py-4 align-top text-stone-300">{row.physicalDice}</td>
                <td className="px-4 py-4 align-top text-stone-300">
                  {row.roll20}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DiceRollerHowToUse({ copy }: { copy: DiceRollerPageCopy }) {
  return (
    <section
      aria-labelledby="dice-roller-how-to-use-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.howToUseEyebrow}
        </span>
        <h2
          id="dice-roller-how-to-use-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.howToUseTitle}
        </h2>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block" />
        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {copy.howToUseSteps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col items-center gap-4 text-center">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background">
                <span className="text-xs font-semibold tabular-nums text-stone-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold tracking-tight text-stone-50">{step.title}</h3>
                <p className="text-sm leading-relaxed text-stone-300">{step.description}</p>
              </div>
              {index < copy.howToUseSteps.length - 1 ? (
                <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 md:hidden" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DiceRollerContentSections({ copy }: { copy: DiceRollerPageCopy }) {
  return (
    <>
      <DiceRollerWhatIs copy={copy} />
      <DiceRollerFeatureGrid copy={copy} />
      <DiceRollerCaseStudies copy={copy.caseStudies} />
      <DiceRollerToolComparison copy={copy.toolComparison} />
      <DiceRollerHowToUse copy={copy} />
    </>
  );
}
