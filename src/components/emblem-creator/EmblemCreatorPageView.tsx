import { EmblemCreatorWorkbench } from '@/components/emblem-creator/EmblemCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import type { EmblemLocale } from '@/lib/emblem-creator/types';

export function EmblemCreatorPageView({ locale }: { locale: EmblemLocale }) {
  const copy = getEmblemCreatorCopy(locale);

  return (
    <InnerPageChrome locale={locale} currentPath="/emblem-creator" tone="hub" className="emblem-creator-page">
      <div className="mx-auto w-full max-w-[92rem] px-3 pt-6 pb-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl">
          {copy.heading}
        </h1>
        <EmblemCreatorWorkbench locale={locale} copy={copy} />
      </div>
    </InnerPageChrome>
  );
}
