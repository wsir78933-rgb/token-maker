import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { TownCreatorEditorSection } from '@/components/town-creator/TownCreatorEditorSection';
import { TownCreatorFaq } from '@/components/town-creator/TownCreatorFaq';
import { TownCreatorPageHeading } from '@/components/town-creator/TownCreatorPageHeading';
import { TownCreatorSeoContent } from '@/components/town-creator/TownCreatorSeoContent';
import { TownCreatorWorkbench } from '@/components/town-creator/TownCreatorWorkbench';
import { getTownCreatorCopy } from '@/lib/town-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

const TOWN_CREATOR_PATH = '/town-creator';

export function TownCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getTownCreatorCopy(locale);

  return (
    <InnerPageChrome
      locale={locale}
      currentPath={TOWN_CREATOR_PATH}
      tone="hub"
      className="town-creator-page [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer"
    >
      <TownCreatorPageHeading
        locale={locale}
        heading={copy.heading}
        description={copy.description}
        emphasis={copy.heroEmphasis}
        action={copy.heroAction}
      />
      <TownCreatorEditorSection>
        <TownCreatorWorkbench locale={locale} />
      </TownCreatorEditorSection>
      <TownCreatorSeoContent copy={copy} />
      <TownCreatorFaq faq={copy.faq} />
    </InnerPageChrome>
  );
}
