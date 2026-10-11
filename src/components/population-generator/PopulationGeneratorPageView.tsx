import { PopulationGeneratorContent } from '@/components/population-generator/PopulationGeneratorContent';
import { PopulationGeneratorPageHeading } from '@/components/population-generator/PopulationGeneratorPageHeading';
import { PopulationGeneratorWorkbench } from '@/components/population-generator/PopulationGeneratorWorkbench';
import styles from '@/components/population-generator/PopulationGeneratorWorkbench.module.css';
import {
  getPopulationPageCopy,
  POPULATION_GENERATOR_PATH,
  POPULATION_GENERATOR_WORKSPACE_ID,
} from '@/lib/population-generator/page-copy';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export function PopulationGeneratorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getPopulationPageCopy(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, POPULATION_GENERATOR_PATH);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.title,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: absoluteUrl(localizedPath),
    description: copy.pageDescription,
  };

  return (
    <>
      <StructuredData id={`population-generator-${locale}-jsonld`} data={structuredData} />
      <StructuredData
        id={`population-generator-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path: POPULATION_GENERATOR_PATH },
        ])}
      />
      <InnerPageChrome locale={locale} currentPath={POPULATION_GENERATOR_PATH} tone="hub">
        <div className={styles.screenOnlyCopy}>
          <PopulationGeneratorPageHeading locale={locale} />
        </div>
        <section
          id={POPULATION_GENERATOR_WORKSPACE_ID}
          aria-labelledby="population-generator-workspace-title"
          className="mx-auto w-full max-w-[92rem] scroll-mt-20 px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
        >
          <h2 id="population-generator-workspace-title" className="sr-only">
            {copy.workspaceLabel}
          </h2>
          <PopulationGeneratorWorkbench locale={locale} />
        </section>
        <div className={styles.screenOnlyCopy}>
          <PopulationGeneratorContent copy={copy} locale={locale} />
        </div>
      </InnerPageChrome>
    </>
  );
}
