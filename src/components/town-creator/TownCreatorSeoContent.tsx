import { ArrowRight } from 'lucide-react';

import { TownCreatorCaseStudies } from '@/components/town-creator/TownCreatorCaseStudies';
import type { TownCreatorCopy } from '@/lib/town-creator/copy';
import { TOWN_CREATOR_EDITOR_ID } from '@/lib/town-creator/copy';

const FEATURE_MARKS = ['01', '02', '03', '04', '05', '06'] as const;
const EXPECTED_FEATURE_COUNT = FEATURE_MARKS.length;
const EXPECTED_STEP_COUNT = 3;

function assertTownCreatorSeoContentShape(copy: TownCreatorCopy): void {
  if (copy.featureOverview.features.length !== EXPECTED_FEATURE_COUNT) {
    throw new Error(
      `Town creator feature overview must contain exactly ${EXPECTED_FEATURE_COUNT} features. Received length ${copy.featureOverview.features.length}.`,
    );
  }

  if (copy.howItWorks.steps.length !== EXPECTED_STEP_COUNT) {
    throw new Error(
      `Town creator how-it-works section must contain exactly ${EXPECTED_STEP_COUNT} steps. Received length ${copy.howItWorks.steps.length}.`,
    );
  }

  if (copy.toolComparison.rows.length === 0) {
    throw new Error(
      `Town creator tool comparison must contain at least one row. Received length ${copy.toolComparison.rows.length}.`,
    );
  }
}

function TownCreatorSectionHeading({
  headingId,
  title,
  description,
}: {
  readonly headingId: string;
  readonly title: string;
  readonly description: string;
}) {
  return (
    <header className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center sm:mb-12">
      <h2
        id={headingId}
        className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
        style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
      >
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {description}
      </p>
    </header>
  );
}

function TownCreatorWhatIs({ copy }: { readonly copy: TownCreatorCopy['whatIs'] }) {
  return (
    <section
      id="town-creator-what-is"
      aria-labelledby="town-creator-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="town-creator-what-is-heading"
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

function TownCreatorFeatureOverview({
  copy,
}: {
  readonly copy: TownCreatorCopy['featureOverview'];
}) {
  return (
    <section
      id="town-creator-features"
      aria-labelledby="town-creator-features-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <TownCreatorSectionHeading
        headingId="town-creator-features-heading"
        title={copy.title}
        description={copy.subtitle}
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.features.map((feature, index) => (
          <li key={feature.title} className="min-w-0">
            <article className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045]">
              <div
                aria-hidden="true"
                className="mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-sm font-semibold tabular-nums text-amber-200"
              >
                {FEATURE_MARKS[index]}
              </div>
              <h3 className="font-semibold leading-snug tracking-tight text-stone-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">
                {feature.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TownCreatorHowItWorks({
  copy,
}: {
  readonly copy: TownCreatorCopy['howItWorks'];
}) {
  return (
    <section
      id="town-creator-how-it-works"
      aria-labelledby="town-creator-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <TownCreatorSectionHeading
        headingId="town-creator-how-it-works-heading"
        title={copy.title}
        description={copy.description}
      />
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block" />
        {copy.steps.map((step, index) => (
          <div key={step.title} className="relative flex flex-col items-center gap-4 text-center">
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
          </div>
        ))}
      </div>
    </section>
  );
}

function TownCreatorToolComparison({
  copy,
}: {
  readonly copy: TownCreatorCopy['toolComparison'];
}) {
  return (
    <section
      id="town-creator-comparison"
      aria-labelledby="town-creator-comparison-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <TownCreatorSectionHeading
        headingId="town-creator-comparison-heading"
        title={copy.title}
        description={copy.description}
      />
      <div
        aria-label={copy.title}
        className="mt-8 w-full overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[48rem] table-fixed border-collapse text-left text-sm sm:text-base">
          <caption className="sr-only">{copy.title}</caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[28%]" />
            <col className="w-[27%]" />
            <col className="w-[27%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/15">
              <th scope="col" className="px-4 py-4 font-medium text-stone-400">
                {copy.columns.aspect}
              </th>
              <th scope="col" className="border-x border-white/10 bg-white/[0.04] px-4 py-4 font-semibold text-[var(--site-accent-strong)]">
                {copy.columns.town}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.columns.handDrawn}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.columns.imageEditor}
              </th>
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.aspect} className="border-b border-white/10 last:border-b-0">
                <th scope="row" className="px-4 py-4 align-top font-medium text-stone-100">
                  {row.aspect}
                </th>
                <td className="border-x border-white/10 bg-white/[0.04] px-4 py-4 align-top font-medium text-stone-100">
                  {row.town}
                </td>
                <td className="px-4 py-4 align-top text-stone-300">{row.handDrawn}</td>
                <td className="px-4 py-4 align-top text-stone-300">{row.imageEditor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TownCreatorCallToAction({ copy }: { readonly copy: TownCreatorCopy['cta'] }) {
  return (
    <section
      id="town-creator-cta"
      aria-labelledby="town-creator-cta-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="town-creator-cta-heading"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
        <a
          className="mt-2 inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
          href={`#${TOWN_CREATOR_EDITOR_ID}`}
        >
          {copy.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>
      </div>
    </section>
  );
}

export function TownCreatorSeoContent({ copy }: { readonly copy: TownCreatorCopy }) {
  assertTownCreatorSeoContentShape(copy);

  return (
    <>
      <TownCreatorWhatIs copy={copy.whatIs} />
      <TownCreatorCaseStudies copy={copy.caseStudies} />
      <TownCreatorFeatureOverview copy={copy.featureOverview} />
      <TownCreatorHowItWorks copy={copy.howItWorks} />
      <TownCreatorToolComparison copy={copy.toolComparison} />
      <TownCreatorCallToAction copy={copy.cta} />
    </>
  );
}
