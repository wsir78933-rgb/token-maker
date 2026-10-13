import { MapMakerPageContent } from '@/components/map-maker/MapMakerPageContent';
import { MapMakerPageHeading } from '@/components/map-maker/MapMakerPageHeading';
import { MapMakerWorkbench } from '@/components/map-maker/MapMakerWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { MAP_MAKER_WORKSPACE_ID } from '@/lib/map-maker/constants';
import { getMapMakerCopy } from '@/lib/map-maker/copy';
import { getMapMakerPageCopy } from '@/lib/map-maker/page-copy';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import styles from './MapMakerPage.module.css';

const MAP_MAKER_PATH = '/map-maker';

export function MapMakerPageView({ locale }: { locale: SiteLocale }) {
  const copy = getMapMakerCopy(locale);
  const pageCopy = getMapMakerPageCopy(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, MAP_MAKER_PATH);
  const webApplicationStructuredData = {
    '@type': 'WebApplication',
    name: copy.pageTitle,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: absoluteUrl(localizedPath),
    description: copy.pageDescription,
  };
  const faqStructuredData = {
    '@type': 'FAQPage',
    mainEntity: pageCopy.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <StructuredData
        id={`map-maker-${locale}-jsonld`}
        data={{ '@context': 'https://schema.org', '@graph': [webApplicationStructuredData, faqStructuredData] }}
      />
      <StructuredData
        id={`map-maker-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path: MAP_MAKER_PATH },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={MAP_MAKER_PATH}
        tone="hub"
        className={`map-maker-page ${styles.page}`}
      >
        <MapMakerPageHeading copy={copy} locale={locale} />
        <section
          id={MAP_MAKER_WORKSPACE_ID}
          aria-labelledby="map-maker-workspace-title"
          className="mx-auto w-full max-w-[92rem] scroll-mt-20 px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16"
          data-testid="map-maker-workspace"
        >
          <h2 id="map-maker-workspace-title" className="sr-only">
            {copy.workspace.title}
          </h2>
          <MapMakerWorkbench copy={copy.workspace} />
        </section>
        <MapMakerPageContent copy={pageCopy} locale={locale} />
      </InnerPageChrome>
    </>
  );
}
