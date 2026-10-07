import { ArrowRight, Images, Maximize2, Printer, Save, ScrollText, Type, type LucideIcon } from 'lucide-react';

import { ScrollCreatorFaq } from '@/components/scroll-creator/ScrollCreatorFaq';
import { Button } from '@/components/ui/button';
import { SCROLL_CREATOR_EDITOR_ID } from '@/lib/scroll-creator/constants';
import {
  getScrollCreatorPageContent,
  type ScrollCreatorFeatureIcon,
  type ScrollCreatorPageContentCopy,
} from '@/lib/scroll-creator/page-content';
import type { ScrollLocale } from '@/lib/scroll-creator/types';

const SCROLL_CREATOR_FEATURE_ICONS: Record<ScrollCreatorFeatureIcon, LucideIcon> = {
  paper: ScrollText,
  dimensions: Maximize2,
  text: Type,
  images: Images,
  save: Save,
  print: Printer,
};

type ScrollCreatorWhatIsCopy = ScrollCreatorPageContentCopy['whatIs'];
type ScrollCreatorFeaturesCopy = ScrollCreatorPageContentCopy['features'];
type ScrollCreatorComparisonCopy = ScrollCreatorPageContentCopy['comparison'];
type ScrollCreatorHowItWorksCopy = ScrollCreatorPageContentCopy['howItWorks'];
type ScrollCreatorCallToActionCopy = ScrollCreatorPageContentCopy['cta'];

function getScrollCreatorFeatureIcon(iconName: ScrollCreatorFeatureIcon): LucideIcon {
  const FeatureIcon = SCROLL_CREATOR_FEATURE_ICONS[iconName];

  if (FeatureIcon === undefined) {
    throw new Error(`Unknown scroll creator feature icon. Received icon "${String(iconName)}".`);
  }

  return FeatureIcon;
}

function ScrollCreatorWhatIsSection({ copy }: { copy: ScrollCreatorWhatIsCopy }) {
  return (
    <section
      aria-labelledby="scroll-creator-what-is-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <h2
        id="scroll-creator-what-is-heading"
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

function ScrollCreatorFeaturesSection({ copy }: { copy: ScrollCreatorFeaturesCopy }) {
  return (
    <section
      aria-labelledby="scroll-creator-features-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="scroll-creator-features-heading"
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
          const FeatureIcon = getScrollCreatorFeatureIcon(feature.icon);

          return (
            <li key={feature.icon} className="min-w-0">
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.045]">
                <div
                  aria-hidden="true"
                  className="mb-5 flex size-11 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/[0.08] text-amber-200"
                >
                  <FeatureIcon className="size-5" />
                </div>
                <h3 className="font-semibold leading-snug tracking-tight text-stone-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">{feature.description}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ScrollCreatorComparisonSection({ copy }: { copy: ScrollCreatorComparisonCopy }) {
  return (
    <section
      aria-labelledby="scroll-creator-comparison-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="scroll-creator-comparison-heading"
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
                {copy.scrollCreatorHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.wordHeading}
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-stone-200">
                {copy.photoshopHeading}
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
                  {row.scrollCreator}
                </td>
                <td className="px-4 py-4 align-top text-stone-300">{row.word}</td>
                <td className="px-4 py-4 align-top text-stone-300">{row.photoshop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScrollCreatorHowItWorksSection({ copy }: { copy: ScrollCreatorHowItWorksCopy }) {
  return (
    <section
      aria-labelledby="scroll-creator-how-it-works-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.eyebrow}
        </span>
        <h2
          id="scroll-creator-how-it-works-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
      </div>

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

function ScrollCreatorCallToActionSection({ copy }: { copy: ScrollCreatorCallToActionCopy }) {
  return (
    <section
      id="scroll-creator-call-to-action"
      aria-labelledby="scroll-creator-call-to-action-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="scroll-creator-call-to-action-heading"
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
          render={<a href={`#${SCROLL_CREATOR_EDITOR_ID}`} role="link" />}
        >
          {copy.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function ScrollCreatorContentSections({ locale }: { locale: ScrollLocale }) {
  const pageContent = getScrollCreatorPageContent(locale);

  return (
    <div className="scroll-creator-content-sections print:hidden">
      <ScrollCreatorWhatIsSection copy={pageContent.whatIs} />
      <ScrollCreatorFeaturesSection copy={pageContent.features} />
      <ScrollCreatorComparisonSection copy={pageContent.comparison} />
      <ScrollCreatorHowItWorksSection copy={pageContent.howItWorks} />
      <ScrollCreatorCallToActionSection copy={pageContent.cta} />
      <ScrollCreatorFaq {...pageContent.faq} />
    </div>
  );
}
