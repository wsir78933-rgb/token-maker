import { LanguageGeneratorWorkbench } from '@/components/language-generator/LanguageGeneratorWorkbench';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

import styles from './LanguageGeneratorPageView.module.css';

const LANGUAGE_GENERATOR_PATH = '/language-generator';

export function LanguageGeneratorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getLanguageGeneratorCopy(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, LANGUAGE_GENERATOR_PATH);

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
        id={`language-generator-${locale}-jsonld`}
        data={structuredData}
      />
      <StructuredData
        id={`language-generator-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path: LANGUAGE_GENERATOR_PATH },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={LANGUAGE_GENERATOR_PATH}
        tone="hub"
        className={styles.pageShell}
      >
        <div className="mx-auto w-full max-w-[92rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <PageBreadcrumbs
            locale={locale}
            items={[
              { label: navLabels.editor, href: getLocalizedPath(locale, '/') },
              { label: copy.navigationTitle },
            ]}
          />

          <header
            data-testid="language-generator-page-heading"
            className="mx-auto mt-6 max-w-4xl text-center"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--site-accent-strong)]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-stone-50 text-balance sm:text-4xl lg:text-5xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
              {copy.description}
            </p>
          </header>

          <div
            id="language-generator-workspace"
            data-testid="language-generator-workspace"
            className="mt-8 lg:mt-10"
          >
            <LanguageGeneratorWorkbench locale={locale} />
          </div>
        </div>
      </InnerPageChrome>
    </>
  );
}
