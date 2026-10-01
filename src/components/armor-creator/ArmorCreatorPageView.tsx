import { ArrowRight } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import {
  ARMOR_CREATOR_EDITOR_ID,
  ArmorCreatorPageHeading,
} from '@/components/armor-creator/ArmorCreatorPageHeading';
import { ArmorCreatorWorkbench } from '@/components/armor-creator/ArmorCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { getArmorCreatorCopy, type ArmorCreatorCopy } from '@/lib/armor-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

const ARMOR_CREATOR_PATH = '/armor-creator';

function ArmorCreatorHowToUse({ copy }: { copy: ArmorCreatorCopy }) {
  return (
    <section
      aria-labelledby="armor-creator-how-to-use-heading"
      className="mx-auto max-w-5xl border-t border-white/10 px-5 py-12 text-stone-100 sm:py-16 lg:px-8"
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
          className={buttonVariants({ size: 'lg', className: 'rounded-full px-8' })}
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
        className="mx-auto w-full scroll-mt-8 px-5 py-8 lg:px-6 lg:py-4"
      >
        <ArmorCreatorWorkbench locale={locale} />
      </div>
      {locale === 'zh' && (
        <>
          <section
            aria-labelledby="armor-creator-what-is-heading"
            className="mx-auto max-w-5xl border-t border-white/10 px-5 py-12 text-stone-100 sm:py-16 lg:px-8"
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
        </>
      )}
    </>
  );
}

export function ArmorCreatorPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome locale={locale} currentPath={ARMOR_CREATOR_PATH} tone="hub">
      <ArmorCreatorPageGap locale={locale} />
    </InnerPageChrome>
  );
}
