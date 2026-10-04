import { ArrowRight } from 'lucide-react';

import { OutfitCreatorFaq } from '@/components/outfit-creator/OutfitCreatorFaq';
import {
  OUTFIT_CREATOR_EDITOR_ID,
  OutfitCreatorPageHeading,
} from '@/components/outfit-creator/OutfitCreatorPageHeading';
import { OutfitCreatorFeatureGrid } from '@/components/outfit-creator/OutfitCreatorFeatureGrid';
import { OutfitCreatorWorkbench } from '@/components/outfit-creator/OutfitCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { getOutfitCreatorCopy, type OutfitCreatorCopy } from '@/lib/outfit-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

const OUTFIT_CREATOR_PATH = '/outfit-creator';

function OutfitCreatorHowToUse({ copy }: { copy: OutfitCreatorCopy }) {
  return (
    <section
      aria-labelledby="outfit-creator-how-to-use-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.howToUseEyebrow}
        </span>
        <h2
          id="outfit-creator-how-to-use-heading"
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

      <div className="mt-14 flex justify-center">
        <a
          className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent bg-clip-padding bg-primary px-8 text-sm font-medium text-primary-foreground whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-primary/80"
          href={`#${OUTFIT_CREATOR_EDITOR_ID}`}
        >
          {copy.howToUseAction}
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>
      </div>
    </section>
  );
}

function OutfitCreatorContent({ locale }: { locale: SiteLocale }) {
  const copy = getOutfitCreatorCopy(locale);

  return (
    <>
      <OutfitCreatorPageHeading locale={locale} />
      <div
        id={OUTFIT_CREATOR_EDITOR_ID}
        className="mx-auto w-full scroll-mt-20 px-4 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-6"
      >
        <OutfitCreatorWorkbench locale={locale} />
      </div>
      <section
        aria-labelledby="outfit-creator-what-is-heading"
        className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
      >
        <h2
          id="outfit-creator-what-is-heading"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.whatIsTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.whatIsDescription}
        </p>
      </section>
      <OutfitCreatorFeatureGrid featureOverview={copy.featureOverview} />
      <OutfitCreatorHowToUse copy={copy} />
      <OutfitCreatorFaq
        eyebrow={copy.faqEyebrow}
        title={copy.faqTitle}
        description={copy.faqDescription}
        items={copy.faqItems}
      />
    </>
  );
}

export function OutfitCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome
      locale={locale}
      currentPath={OUTFIT_CREATOR_PATH}
      tone="hub"
      className="outfit-creator-page [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer"
    >
      <OutfitCreatorContent locale={locale} />
    </InnerPageChrome>
  );
}
