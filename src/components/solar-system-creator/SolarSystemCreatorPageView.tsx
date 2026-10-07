import { SolarSystemCreatorPageHeading } from '@/components/solar-system-creator/SolarSystemCreatorPageHeading';
import { SolarSystemCreatorPageContent } from '@/components/solar-system-creator/SolarSystemCreatorPageContent';
import { SolarSystemCreatorWorkbench } from '@/components/solar-system-creator/SolarSystemCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { getSolarSystemCaseStudiesCopy } from '@/lib/solar-system-creator/case-studies';
import { getSolarSystemCopy } from '@/lib/solar-system-creator/copy';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const SOLAR_SYSTEM_CREATOR_PATH = '/solar-system-creator';
const SOLAR_SYSTEM_CREATOR_EDITOR_ID = 'solar-system-creator-workspace';

export function SolarSystemCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getSolarSystemCopy(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, SOLAR_SYSTEM_CREATOR_PATH);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.pageTitle,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: absoluteUrl(localizedPath),
    description: copy.pageDescription,
  };

  return (
    <>
      <StructuredData
        id={`solar-system-creator-${locale}-jsonld`}
        data={structuredData}
      />
      <StructuredData
        id={`solar-system-creator-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path: SOLAR_SYSTEM_CREATOR_PATH },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={SOLAR_SYSTEM_CREATOR_PATH}
        tone="hub"
        className="solar-system-creator-page"
      >
        <SolarSystemCreatorPageHeading
          locale={locale}
          copy={copy}
          workspaceId={SOLAR_SYSTEM_CREATOR_EDITOR_ID}
        />
        <div className="mx-auto w-full max-w-[92rem] px-3 pt-6 pb-10 sm:px-6 lg:px-8">
          <div
            id={SOLAR_SYSTEM_CREATOR_EDITOR_ID}
            className="scroll-mt-20"
            data-testid="solar-system-creator-workspace"
          >
            <SolarSystemCreatorWorkbench locale={locale} copy={copy} />
          </div>
        </div>
        <SolarSystemCreatorPageContent
          pageContent={copy.pageContent}
          caseStudies={getSolarSystemCaseStudiesCopy(locale)}
          editorId={SOLAR_SYSTEM_CREATOR_EDITOR_ID}
        />
      </InnerPageChrome>
    </>
  );
}
