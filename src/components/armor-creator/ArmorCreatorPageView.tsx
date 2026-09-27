import { ArmorCreatorWorkbench } from '@/components/armor-creator/ArmorCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { getArmorCreatorCopy } from '@/lib/armor-creator/copy';
import { getNavLabels } from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const ARMOR_CREATOR_PATH = '/armor-creator';

export function ArmorCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getArmorCreatorCopy(locale);
  const navLabels = getNavLabels(locale);

  return (
    <InnerPageChrome locale={locale} currentPath={ARMOR_CREATOR_PATH} tone="hub">
      <div className="mx-auto max-w-[82rem] px-5 py-8 lg:px-8 lg:py-10">
        <PageBreadcrumbs
          locale={locale}
          items={[
            { label: navLabels.editor, href: getLocalizedPath(locale, '/') },
            { label: navLabels.armor },
          ]}
        />
        <h1 className="mt-6 font-display text-3xl text-stone-50 sm:text-4xl">{copy.pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone-300">{copy.pageDescription}</p>
        <div className="mt-8">
          <ArmorCreatorWorkbench locale={locale} />
        </div>
      </div>
    </InnerPageChrome>
  );
}
