import {
  ARMOR_CREATOR_EDITOR_ID,
  ArmorCreatorPageHeading,
} from '@/components/armor-creator/ArmorCreatorPageHeading';
import { ArmorCreatorWorkbench } from '@/components/armor-creator/ArmorCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { getArmorCreatorCopy } from '@/lib/armor-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

const ARMOR_CREATOR_PATH = '/armor-creator';

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
