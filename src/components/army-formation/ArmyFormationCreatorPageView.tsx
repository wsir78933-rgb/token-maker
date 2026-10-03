import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ArmyFormationCreatorFaq } from '@/components/army-formation/ArmyFormationCreatorFaq';
import { ArmyFormationCreatorFeaturesGrid } from '@/components/army-formation/ArmyFormationCreatorFeaturesGrid';
import {
  ARMY_FORMATION_CREATOR_EDITOR_ID,
  ArmyFormationCreatorPageHeading,
} from '@/components/army-formation/ArmyFormationCreatorPageHeading';
import { ArmyFormationCreator } from '@/components/army-formation/ArmyFormationCreator';
import { CircularTestimonials } from '@/components/army-formation/CircularTestimonials';
import {
  listChineseArmyFormationCaseTestimonials,
  listEnglishArmyFormationCaseTestimonials,
  type ArmyFormationCaseTestimonialCarousels,
} from '@/components/army-formation/army-formation-case-testimonials';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import {
  getArmyFormationCreatorCaseCarouselCopy,
  getArmyFormationCreatorPageCopy,
  type ArmyFormationCreatorToolComparisonCopy,
} from '@/lib/army-formation/page-copy';
import type { SiteLocale } from '@/lib/site-locale';

const ARMY_FORMATION_CREATOR_PATH = '/army-formation-creator';

function listArmyFormationCaseTestimonialsForLocale(
  locale: SiteLocale,
): ArmyFormationCaseTestimonialCarousels {
  switch (locale) {
    case 'zh':
      return listChineseArmyFormationCaseTestimonials();
    case 'en':
      return listEnglishArmyFormationCaseTestimonials();
    default: {
      const unexpectedLocale: never = locale;
      throw new Error(
        `Army formation case testimonials have no list for locale ${JSON.stringify(unexpectedLocale)}.`,
      );
    }
  }
}

function ArmyFormationCreatorCaseCarousels({ locale }: { locale: SiteLocale }) {
  const caseTestimonials = listArmyFormationCaseTestimonialsForLocale(locale);
  const carouselCopy = getArmyFormationCreatorCaseCarouselCopy(locale);

  return (
    <div className="mt-40 flex w-full min-w-0 flex-col gap-8 sm:mt-48 lg:mt-56">
      <CircularTestimonials
        testimonials={caseTestimonials.cases01To06}
        ariaLabel={carouselCopy.cases01To06Label}
        previousLabel={carouselCopy.previousExampleLabel}
        nextLabel={carouselCopy.nextExampleLabel}
        imageOnLeft={false}
      />
      <CircularTestimonials
        testimonials={caseTestimonials.cases07To12}
        ariaLabel={carouselCopy.cases07To12Label}
        previousLabel={carouselCopy.previousExampleLabel}
        nextLabel={carouselCopy.nextExampleLabel}
        imageOnLeft={true}
      />
    </div>
  );
}

function ArmyFormationCreatorToolComparison({
  copy,
}: {
  copy: ArmyFormationCreatorToolComparisonCopy;
}) {
  return (
    <section
      aria-labelledby="army-formation-tool-comparison-title"
      className="border-t border-white/10 py-20 sm:py-24 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="army-formation-tool-comparison-title"
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
                {copy.armyFormationCreatorHeading}
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
                <td className="border-x border-white/10 bg-white/[0.04] px-4 py-4 align-top text-stone-100">
                  {row.armyFormationCreator}
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

function ArmyFormationCreatorPageContent({ locale }: { locale: SiteLocale }) {
  const copy = getArmyFormationCreatorPageCopy(locale);

  return (
    <div className="mx-auto max-w-5xl border-t border-white/10 pt-20 pb-12 text-stone-100 sm:pt-24 sm:pb-16 lg:pt-28">
      <section>
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          {copy.overviewTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.overviewDescription}
        </p>
      </section>

      <ArmyFormationCreatorCaseCarousels locale={locale} />

      <ArmyFormationCreatorFeaturesGrid copy={copy} />

      <section className="mt-24 pb-20 sm:mt-28 sm:pb-24 lg:mt-32 lg:pb-28">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
            {copy.stepsEyebrow}
          </span>
          <h2
            className="font-display font-semibold tracking-tight text-stone-50 text-balance"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
          >
            {copy.stepsTitle}
          </h2>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block"
          />
          <ol aria-label={copy.stepsLabel} className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {copy.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-white/15 bg-background">
                  <span className="text-xs font-semibold tabular-nums text-stone-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="font-semibold tracking-tight text-stone-50">{step.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-stone-300 text-pretty">
                    {step.description}
                  </p>
                </div>
                {index < copy.steps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-2 size-4 text-stone-500 md:hidden"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex flex-col items-center gap-3 py-20 text-center sm:py-24 lg:py-28">
        <h2 className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl">
          {copy.callToActionTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.callToActionDescription}
        </p>
        <Button
          size="lg"
          className="mt-2 rounded-full px-8"
          nativeButton={false}
          render={<a href="#army-formation-creator-editor" />}
        >
          {copy.callToActionLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </section>

      <ArmyFormationCreatorToolComparison copy={copy.toolComparison} />

      <ArmyFormationCreatorFaq
        eyebrow={copy.faqEyebrow}
        title={copy.faqTitle}
        description={copy.faqDescription}
        items={copy.faq}
      />
    </div>
  );
}

function ArmyFormationCreatorPageFrame({ locale }: { locale: SiteLocale }) {
  return (
    <div className="px-5 lg:px-8">
      <ArmyFormationCreatorPageHeading locale={locale} />
      <div id={ARMY_FORMATION_CREATOR_EDITOR_ID} className="pb-12 lg:pb-10">
        <ArmyFormationCreator locale={locale} />
      </div>
      <ArmyFormationCreatorPageContent locale={locale} />
    </div>
  );
}

export function ArmyFormationCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome locale={locale} currentPath={ARMY_FORMATION_CREATOR_PATH} tone="hub">
      <ArmyFormationCreatorPageFrame locale={locale} />
    </InnerPageChrome>
  );
}
