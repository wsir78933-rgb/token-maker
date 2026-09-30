import {
  ARMOR_CREATOR_EDITOR_ID,
  ArmorCreatorPageHeading,
} from '@/components/armor-creator/ArmorCreatorPageHeading';
import { ArmorCreatorWorkbench } from '@/components/armor-creator/ArmorCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import type { SiteLocale } from '@/lib/site-locale';

const ARMOR_CREATOR_PATH = '/armor-creator';

function ArmorCreatorPageGap({ locale }: { locale: SiteLocale }) {
  return (
    <>
      <ArmorCreatorPageHeading locale={locale} />
      <div
        id={ARMOR_CREATOR_EDITOR_ID}
        className="mx-auto w-full scroll-mt-8 px-5 py-8 lg:px-8 lg:py-10"
      >
        <ArmorCreatorWorkbench locale={locale} />
      </div>
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
