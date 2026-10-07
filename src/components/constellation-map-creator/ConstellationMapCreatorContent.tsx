import {
  ArrowRight,
  Download,
  FileText,
  ImagePlus,
  LayoutGrid,
  Move,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

import { Faq1 } from '@/components/armor-creator/Faq1';
import type {
  ConstellationFeatureIcon,
  ConstellationPageContentCopy,
} from '@/lib/constellation-map-creator/copy';
import type { ConstellationShowcaseCopy } from '@/lib/constellation-map-creator/showcase-copy';

import { ConstellationMapCreatorShowcase } from './ConstellationMapCreatorShowcase';

const FEATURE_ICONS: Record<ConstellationFeatureIcon, LucideIcon> = {
  assets: LayoutGrid,
  placement: Move,
  appearance: ImagePlus,
  saves: FileText,
  export: Download,
  mobile: Smartphone,
};

function requireWorkspaceId(workspaceId: string): string {
  if (workspaceId.trim().length === 0) {
    throw new Error(
      `Constellation map content workspaceId must be a non-empty string. Received ${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspaceId;
}

function ConstellationWhatIs({ copy }: { copy: ConstellationPageContentCopy['whatIs'] }) {
  return (
    <section
      aria-labelledby="constellation-map-creator-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="constellation-map-creator-what-is-heading"
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

function ConstellationFeatureGrid({ copy }: { copy: ConstellationPageContentCopy['features'] }) {
  return (
    <section
      aria-labelledby="constellation-map-creator-feature-grid-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="constellation-map-creator-feature-grid-heading"
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
          const FeatureIcon = FEATURE_ICONS[feature.icon];
          if (FeatureIcon === undefined) {
            throw new Error(
              `Constellation map feature icon is unsupported. Received ${JSON.stringify(feature.icon)}.`,
            );
          }

          return (
            <li key={feature.icon} className="min-w-0">
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045]">
                <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-amber-200" aria-hidden="true">
                  <FeatureIcon className="size-5" />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">{feature.description}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ConstellationHowItWorks({ copy }: { copy: ConstellationPageContentCopy['howItWorks'] }) {
  return (
    <section
      aria-labelledby="constellation-map-creator-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">{copy.eyebrow}</span>
        <h2
          id="constellation-map-creator-how-it-works-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance leading-[1.5]"
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

function ConstellationToolComparison({
  copy,
}: {
  copy: ConstellationPageContentCopy['toolComparison'];
}) {
  return (
    <section
      aria-labelledby="constellation-map-creator-tool-comparison-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="constellation-map-creator-tool-comparison-title"
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
                {copy.constellationMapCreatorHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.photoshopHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.illustratorHeading}
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
                  {row.constellationMapCreator}
                </td>
                <td className="px-4 py-4 align-top text-stone-300">{row.photoshop}</td>
                <td className="px-4 py-4 align-top text-stone-300">{row.illustrator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ConstellationCallToAction({
  copy,
  workspaceId,
}: {
  copy: ConstellationPageContentCopy['cta'];
  workspaceId: string;
}) {
  return (
    <section
      id="constellation-map-creator-call-to-action"
      aria-labelledby="constellation-map-creator-call-to-action-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="constellation-map-creator-call-to-action-title"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">{copy.description}</p>
        <a
          href={`#${requireWorkspaceId(workspaceId)}`}
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-200"
        >
          {copy.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>
      </div>
    </section>
  );
}

export function ConstellationMapCreatorContent({
  pageContent,
  showcaseCopy,
  workspaceId,
}: {
  pageContent: ConstellationPageContentCopy;
  showcaseCopy: ConstellationShowcaseCopy;
  workspaceId: string;
}) {
  const validatedWorkspaceId = requireWorkspaceId(workspaceId);

  return (
    <div data-constellation-page-content="true">
      <ConstellationWhatIs copy={pageContent.whatIs} />
      <ConstellationMapCreatorShowcase copy={showcaseCopy} />
      <ConstellationFeatureGrid copy={pageContent.features} />
      <ConstellationHowItWorks copy={pageContent.howItWorks} />
      <ConstellationToolComparison copy={pageContent.toolComparison} />
      <ConstellationCallToAction copy={pageContent.cta} workspaceId={validatedWorkspaceId} />
      <Faq1
        eyebrow={pageContent.faq.eyebrow}
        title={pageContent.faq.title}
        description={pageContent.faq.description}
        items={pageContent.faq.items}
      />
    </div>
  );
}
