import { ConstellationMapCreatorContent } from '@/components/constellation-map-creator/ConstellationMapCreatorContent';
import { ConstellationMapCreatorHeading } from '@/components/constellation-map-creator/ConstellationMapCreatorHeading';
import { ConstellationMapCreatorWorkbench } from '@/components/constellation-map-creator/ConstellationMapCreatorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { getConstellationMapCopy } from '@/lib/constellation-map-creator/copy';
import { getConstellationShowcaseCopy } from '@/lib/constellation-map-creator/showcase-copy';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import styles from './ConstellationMapCreatorPage.module.css';

const CONSTELLATION_MAP_CREATOR_PATH = '/constellation-map-creator';
const CONSTELLATION_MAP_CREATOR_WORKSPACE_ID = 'constellation-map-creator-workspace';

export function ConstellationMapCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getConstellationMapCopy(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, CONSTELLATION_MAP_CREATOR_PATH);
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
        id={`constellation-map-creator-${locale}-jsonld`}
        data={structuredData}
      />
      <StructuredData
        id={`constellation-map-creator-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path: CONSTELLATION_MAP_CREATOR_PATH },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={CONSTELLATION_MAP_CREATOR_PATH}
        tone="hub"
        className={`constellation-map-creator-page ${styles.page}`}
      >
        <ConstellationMapCreatorHeading
          locale={locale}
          title={copy.heading}
          description={copy.pageDescription}
          actionLabel={copy.heroAction}
          workspaceId={CONSTELLATION_MAP_CREATOR_WORKSPACE_ID}
        />
        <section
          id={CONSTELLATION_MAP_CREATOR_WORKSPACE_ID}
          aria-labelledby="constellation-map-creator-workspace-title"
          className="mx-auto w-full max-w-[92rem] scroll-mt-20 px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16"
          data-testid="constellation-map-creator-workspace"
        >
          <h2 id="constellation-map-creator-workspace-title" className="sr-only">
            {copy.workspace.workspaceTitle}
          </h2>
          <ConstellationMapCreatorWorkbench locale={locale} />
        </section>
        <ConstellationMapCreatorContent
          pageContent={copy.pageContent}
          showcaseCopy={getConstellationShowcaseCopy(locale)}
          workspaceId={CONSTELLATION_MAP_CREATOR_WORKSPACE_ID}
        />
      </InnerPageChrome>
    </>
  );
}
