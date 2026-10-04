import { EmblemCreatorWorkbench } from '@/components/emblem-creator/EmblemCreatorWorkbench';
import {
  EMBLEM_CREATOR_EDITOR_ID,
  EmblemCreatorPageHeading,
} from '@/components/emblem-creator/EmblemCreatorPageHeading';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import type { EmblemLocale } from '@/lib/emblem-creator/types';

export function EmblemCreatorPageView({ locale }: { locale: EmblemLocale }) {
  const copy = getEmblemCreatorCopy(locale);

  return (
    <InnerPageChrome locale={locale} currentPath="/emblem-creator" tone="hub" className="emblem-creator-page">
      <div className="mx-auto w-full max-w-[92rem] px-3 pt-6 pb-10 sm:px-6 lg:px-8">
        <EmblemCreatorPageHeading
          locale={locale}
          copy={{
            pageTitle: copy.pageTitle,
            pageDescription: copy.pageDescription,
            heroAction: copy.heroAction,
          }}
        />
        <div id={EMBLEM_CREATOR_EDITOR_ID} className="pb-10">
          <EmblemCreatorWorkbench locale={locale} copy={copy} />
        </div>
      </div>
    </InnerPageChrome>
  );
}
