import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { PeriodicTableCreatorContent } from '@/components/periodic-table-creator/PeriodicTableCreatorContent';
import { PeriodicTableCreatorCaseLoadProvider } from '@/components/periodic-table-creator/PeriodicTableCreatorCaseLoadProvider';
import { PeriodicTableCreatorPageHeading } from '@/components/periodic-table-creator/PeriodicTableCreatorPageHeading';
import { PeriodicTableCreatorWorkbench } from '@/components/periodic-table-creator/PeriodicTableCreatorWorkbench';
import { getPeriodicTableCopy } from '@/lib/periodic-table-creator/copy';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

import styles from './PeriodicTableCreatorPageView.module.css';

const PERIODIC_TABLE_CREATOR_PATH = '/periodic-table-creator';
const PERIODIC_TABLE_CREATOR_WORKSPACE_ID = 'periodic-table-creator-workspace';

export function PeriodicTableCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getPeriodicTableCopy(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, PERIODIC_TABLE_CREATOR_PATH);
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
      <StructuredData
        id={`periodic-table-creator-${locale}-jsonld`}
        data={structuredData}
      />
      <StructuredData
        id={`periodic-table-creator-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path: PERIODIC_TABLE_CREATOR_PATH },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={PERIODIC_TABLE_CREATOR_PATH}
        tone="hub"
        className={styles.pageShell}
      >
        <PeriodicTableCreatorPageHeading
          locale={locale}
          title={copy.title}
          description={copy.description}
          actionLabel={copy.heroAction}
          workspaceId={PERIODIC_TABLE_CREATOR_WORKSPACE_ID}
        />
        <PeriodicTableCreatorCaseLoadProvider workspaceId={PERIODIC_TABLE_CREATOR_WORKSPACE_ID}>
          <section
            id={PERIODIC_TABLE_CREATOR_WORKSPACE_ID}
            aria-labelledby="periodic-table-creator-workspace-title"
            className="mx-auto w-full max-w-[92rem] scroll-mt-20 px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16"
          >
            <h2 id="periodic-table-creator-workspace-title" className="sr-only">
              {copy.workspaceLabel}
            </h2>
            <PeriodicTableCreatorWorkbench locale={locale} />
          </section>
          <PeriodicTableCreatorContent
            locale={locale}
            workspaceId={PERIODIC_TABLE_CREATOR_WORKSPACE_ID}
          />
        </PeriodicTableCreatorCaseLoadProvider>
      </InnerPageChrome>
    </>
  );
}
