import {
  ArrowRight,
  Download,
  Eye,
  LayoutGrid,
  Move,
  Save,
  Shuffle,
  type LucideIcon,
} from 'lucide-react';

import { SolarSystemCreatorFaq } from '@/components/solar-system-creator/SolarSystemCreatorFaq';
import { SolarSystemCreatorCaseStudies } from '@/components/solar-system-creator/SolarSystemCreatorCaseStudies';
import { SolarSystemCreatorToolComparison } from '@/components/solar-system-creator/SolarSystemCreatorToolComparison';
import { Button } from '@/components/ui/button';
import type { SolarSystemCaseStudiesCopy } from '@/lib/solar-system-creator/case-studies';
import type {
  SolarSystemFeatureIcon,
  SolarSystemPageContentCopy,
} from '@/lib/solar-system-creator/copy';

const SOLAR_FEATURE_ICONS: Record<SolarSystemFeatureIcon, LucideIcon> = {
  assets: LayoutGrid,
  random: Shuffle,
  details: Eye,
  manual: Move,
  saves: Save,
  export: Download,
};

const SOLAR_FEATURE_COUNT = 6;
const SOLAR_HOW_IT_WORKS_STEP_COUNT = 3;

export interface SolarSystemCreatorPageContentProps {
  pageContent: SolarSystemPageContentCopy;
  caseStudies: SolarSystemCaseStudiesCopy;
  editorId: string;
}

function requireEditorId(editorId: string): string {
  if (editorId.length === 0) {
    throw new Error(`Solar system creator editorId must be non-empty. Received ${JSON.stringify(editorId)}.`);
  }

  return editorId;
}

function requireFeatureIcon(icon: SolarSystemFeatureIcon): LucideIcon {
  const FeatureIcon = SOLAR_FEATURE_ICONS[icon];
  if (FeatureIcon === undefined) {
    throw new Error(`Solar system creator feature icon is unsupported. Received ${JSON.stringify(icon)}.`);
  }

  return FeatureIcon;
}

function validatePageContentShape(pageContent: SolarSystemPageContentCopy): void {
  if (pageContent.featureItems.length !== SOLAR_FEATURE_COUNT) {
    throw new Error(
      `Solar system creator featureItems must contain ${SOLAR_FEATURE_COUNT} items. Received ${pageContent.featureItems.length}.`,
    );
  }

  if (pageContent.howItWorksSteps.length !== SOLAR_HOW_IT_WORKS_STEP_COUNT) {
    throw new Error(
      `Solar system creator howItWorksSteps must contain ${SOLAR_HOW_IT_WORKS_STEP_COUNT} items. Received ${pageContent.howItWorksSteps.length}.`,
    );
  }
}

function SolarSystemCreatorWhatIs({ pageContent }: { pageContent: SolarSystemPageContentCopy }) {
  return (
    <section
      aria-labelledby="solar-system-creator-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="solar-system-creator-what-is-heading"
        className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
      >
        {pageContent.whatIsTitle}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {pageContent.whatIsDescription}
      </p>
    </section>
  );
}

function SolarSystemCreatorFeatureGrid({ pageContent }: { pageContent: SolarSystemPageContentCopy }) {
  return (
    <section
      aria-labelledby="solar-system-creator-feature-grid-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="solar-system-creator-feature-grid-heading"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {pageContent.featureOverviewTitle}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {pageContent.featureOverviewDescription}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageContent.featureItems.map((feature) => {
          const FeatureIcon = requireFeatureIcon(feature.icon);

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

function SolarSystemCreatorHowItWorks({ pageContent }: { pageContent: SolarSystemPageContentCopy }) {
  return (
    <section
      aria-labelledby="solar-system-creator-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {pageContent.howItWorksEyebrow}
        </span>
        <h2
          id="solar-system-creator-how-it-works-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance leading-[1.5]"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {pageContent.howItWorksTitle}
        </h2>
      </div>

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block" />
        {pageContent.howItWorksSteps.map((step, index) => (
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
            {index < pageContent.howItWorksSteps.length - 1 ? (
              <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 md:hidden" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function SolarSystemCreatorCallToAction({
  pageContent,
  editorId,
}: {
  pageContent: SolarSystemPageContentCopy;
  editorId: string;
}) {
  return (
    <section
      id="solar-system-creator-call-to-action"
      aria-labelledby="solar-system-creator-call-to-action-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="solar-system-creator-call-to-action-title"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {pageContent.ctaTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {pageContent.ctaDescription}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 cursor-pointer rounded-full px-8"
          nativeButton={false}
          render={<a href={`#${requireEditorId(editorId)}`} />}
        >
          {pageContent.ctaAction}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function SolarSystemCreatorPageContent({
  pageContent,
  caseStudies,
  editorId,
}: SolarSystemCreatorPageContentProps) {
  validatePageContentShape(pageContent);

  return (
    <div data-solar-page-content="true" data-solar-print-hidden="true">
      <SolarSystemCreatorWhatIs pageContent={pageContent} />
      <SolarSystemCreatorCaseStudies copy={caseStudies} />
      <SolarSystemCreatorFeatureGrid pageContent={pageContent} />
      <SolarSystemCreatorToolComparison copy={pageContent.toolComparison} />
      <SolarSystemCreatorHowItWorks pageContent={pageContent} />
      <SolarSystemCreatorCallToAction pageContent={pageContent} editorId={editorId} />
      <SolarSystemCreatorFaq
        eyebrow={pageContent.faqEyebrow}
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqItems}
      />
    </div>
  );
}
