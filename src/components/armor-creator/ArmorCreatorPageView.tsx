import { ArrowRight } from 'lucide-react';

import {
  ARMOR_CREATOR_EDITOR_ID,
  ArmorCreatorPageHeading,
} from '@/components/armor-creator/ArmorCreatorPageHeading';
import { ArmorCreatorFeatures } from '@/components/armor-creator/ArmorCreatorFeatures';
import { Faq1 } from '@/components/armor-creator/Faq1';
import { ArmorCreatorWorkbench } from '@/components/armor-creator/ArmorCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { getArmorCreatorCopy, type ArmorCreatorCopy } from '@/lib/armor-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

const ARMOR_CREATOR_PATH = '/armor-creator';

function ArmorCreatorHowToUse({ copy }: { copy: ArmorCreatorCopy }) {
  return (
    <section
      aria-labelledby="armor-creator-how-to-use-heading"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
          {copy.howToUseEyebrow}
        </span>
        <h2
          id="armor-creator-how-to-use-heading"
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
            {index < copy.howToUseSteps.length - 1 && (
              <ArrowRight aria-hidden="true" className="mt-2 size-4 text-stone-400/40 md:hidden" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <a
          className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent bg-clip-padding bg-primary px-8 text-sm font-medium text-primary-foreground whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-primary/80"
          href={`#${ARMOR_CREATOR_EDITOR_ID}`}
        >
          {copy.howToUseAction}
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>
      </div>
    </section>
  );
}

function ArmorCreatorPageGap({ locale }: { locale: SiteLocale }) {
  const copy = getArmorCreatorCopy(locale);

  return (
    <>
      <ArmorCreatorPageHeading locale={locale} />
      <div
        id={ARMOR_CREATOR_EDITOR_ID}
        className="mx-auto w-full scroll-mt-8 px-5 py-12 lg:px-6 lg:py-10"
      >
        <ArmorCreatorWorkbench locale={locale} />
      </div>
      <ArmorCreatorFeatures locale={locale} />
      {locale === 'zh' && (
        <>
          <section
            aria-labelledby="armor-creator-what-is-heading"
            className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
          >
            <h2
              id="armor-creator-what-is-heading"
              className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
            >
              {copy.whatIsTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
              {copy.whatIsDescription}
            </p>
          </section>
          <ArmorCreatorHowToUse copy={copy} />
          <Faq1
            eyebrow={copy.faqEyebrow}
            title={copy.faqTitle}
            description={copy.faqDescription}
            items={copy.faqItems}
          />
        </>
      )}
    </>
  );
}

export function ArmorCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome
      locale={locale}
      currentPath={ARMOR_CREATOR_PATH}
      tone="hub"
      className="armor-creator-page [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer"
    >
      <ArmorCreatorPageGap locale={locale} />
    </InnerPageChrome>
  );
}
