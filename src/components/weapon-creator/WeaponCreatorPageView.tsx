import { ArrowRight } from 'lucide-react';

import { WeaponCreatorCaseStudies } from '@/components/weapon-creator/WeaponCreatorCaseStudies';
import { WeaponCreatorFaq } from '@/components/weapon-creator/WeaponCreatorFaq';
import { WeaponCreatorFeatureGrid } from '@/components/weapon-creator/WeaponCreatorFeatureGrid';
import { WeaponCreatorPageHeading } from '@/components/weapon-creator/WeaponCreatorPageHeading';
import { WeaponCreatorWorkbench } from '@/components/weapon-creator/WeaponCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { Button } from '@/components/ui/button';
import { WEAPON_CREATOR_EDITOR_ID } from '@/lib/weapon-creator/constants';
import {
  getWeaponCreatorCopy,
  type WeaponCreatorCopy,
  type WeaponCreatorToolComparisonCopy,
} from '@/lib/weapon-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

const WEAPON_CREATOR_PATH = '/weapon-creator';

function WeaponCreatorToolComparison({
  copy,
}: {
  copy: WeaponCreatorToolComparisonCopy;
}) {
  return (
    <section
      aria-labelledby="weapon-creator-tool-comparison-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="weapon-creator-tool-comparison-title"
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
                {copy.weaponCreatorHeading}
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
                  {row.weaponCreator}
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

function WeaponCreatorHowToUse({ copy }: { copy: WeaponCreatorCopy }) {
  return (
    <section
      aria-labelledby="weapon-creator-how-to-use-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.howToUseEyebrow}
        </span>
        <h2
          id="weapon-creator-how-to-use-heading"
          className="font-display font-semibold tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.howToUseTitle}
        </h2>
      </div>

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        <div aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-white/15 md:block" />
        {copy.howToUseSteps.map((step, index) => (
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
            {index < copy.howToUseSteps.length - 1 ? (
              <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 md:hidden" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function WeaponCreatorCallToAction({ copy }: { copy: WeaponCreatorCopy }) {
  return (
    <section
      id="weapon-creator-call-to-action"
      aria-labelledby="weapon-creator-call-to-action-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="weapon-creator-call-to-action-title"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.howToUseCallToActionTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.howToUseCallToActionDescription}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 rounded-full px-8"
          nativeButton={false}
          render={<a href={`#${WEAPON_CREATOR_EDITOR_ID}`} />}
        >
          {copy.howToUseAction}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function WeaponCreatorContent({ locale }: { locale: SiteLocale }) {
  const copy = getWeaponCreatorCopy(locale);

  return (
    <>
      <WeaponCreatorPageHeading locale={locale} />
      <div
        id={WEAPON_CREATOR_EDITOR_ID}
        className="mx-auto w-full scroll-mt-20 px-4 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-6"
      >
        <WeaponCreatorWorkbench locale={locale} />
      </div>
      <section
        aria-labelledby="weapon-creator-what-is-heading"
        className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
      >
        <h2
          id="weapon-creator-what-is-heading"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.whatIsTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.whatIsDescription}
        </p>
      </section>
      <WeaponCreatorCaseStudies copy={copy.caseStudies} />
      <WeaponCreatorFeatureGrid featureOverview={copy.featureOverview} />
      <WeaponCreatorToolComparison copy={copy.toolComparison} />
      <WeaponCreatorHowToUse copy={copy} />
      <WeaponCreatorCallToAction copy={copy} />
      <WeaponCreatorFaq
        eyebrow={copy.faqEyebrow}
        title={copy.faqTitle}
        description={copy.faqDescription}
        items={copy.faqItems}
      />
    </>
  );
}

export function WeaponCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome
      locale={locale}
      currentPath={WEAPON_CREATOR_PATH}
      tone="hub"
      className="weapon-creator-page [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer"
    >
      <WeaponCreatorContent locale={locale} />
    </InnerPageChrome>
  );
}
