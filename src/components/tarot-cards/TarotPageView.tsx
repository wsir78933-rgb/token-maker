import { TarotWorkbench } from '@/components/tarot-cards/TarotWorkbench';
import { TarotContentSections } from '@/components/tarot-cards/TarotContentSections';
import { TarotPageHeading } from '@/components/tarot-cards/TarotPageHeading';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { TAROT_WORKSPACE_ID } from '@/lib/tarot-cards/constants';
import type { SiteLocale } from '@/lib/site-locale';

const TAROT_CARDS_PATH = '/tarot-cards';

export type TarotPageViewProps = {
  locale: SiteLocale;
};

export function TarotPageView({ locale }: TarotPageViewProps) {
  return (
    <InnerPageChrome
      locale={locale}
      currentPath={TAROT_CARDS_PATH}
      tone="hub"
      className="tarot-cards-page"
    >
      <TarotPageHeading locale={locale} />
      <div className="mx-auto w-full max-w-[92rem] px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-10">
        <div id={TAROT_WORKSPACE_ID} data-testid="tarot-cards-workspace" className="mt-8 scroll-mt-24 lg:mt-10">
          <TarotWorkbench locale={locale} />
        </div>
      </div>
      <TarotContentSections locale={locale} />
    </InnerPageChrome>
  );
}
