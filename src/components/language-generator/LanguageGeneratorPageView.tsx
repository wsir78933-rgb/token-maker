import { LanguageGeneratorWorkbench } from '@/components/language-generator/LanguageGeneratorWorkbench';
import { LanguageGeneratorFaq } from '@/components/language-generator/LanguageGeneratorFaq';
import { LanguageGeneratorFeatureGrid } from '@/components/language-generator/LanguageGeneratorFeatureGrid';
import { LanguageGeneratorHowItWorks } from '@/components/language-generator/LanguageGeneratorHowItWorks';
import { LanguageGeneratorCallToAction } from '@/components/language-generator/LanguageGeneratorCallToAction';
import { LanguageGeneratorPageHeading } from '@/components/language-generator/LanguageGeneratorPageHeading';
import { LanguageGeneratorToolComparison } from '@/components/language-generator/LanguageGeneratorToolComparison';
import { LanguageGeneratorWhatIs } from '@/components/language-generator/LanguageGeneratorWhatIs';
import { LanguageGeneratorCaseStudies } from '@/components/language-generator/LanguageGeneratorCaseStudies';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { getLanguageGeneratorPageCopy } from '@/lib/language-generator/page-copy';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

import styles from './LanguageGeneratorPageView.module.css';

const LANGUAGE_GENERATOR_PATH = '/language-generator';

export function LanguageGeneratorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getLanguageGeneratorCopy(locale);
  const pageCopy = getLanguageGeneratorPageCopy(locale);
  const workspaceId = 'language-generator-workspace';
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
        <LanguageGeneratorPageHeading locale={locale} workspaceId={workspaceId} />
        <div
          id={workspaceId}
          data-testid="language-generator-workspace"
          className="mx-auto w-full max-w-[92rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <LanguageGeneratorWorkbench locale={locale} />
        </div>
        <LanguageGeneratorWhatIs copy={pageCopy.whatIs} />
        <LanguageGeneratorCaseStudies copy={pageCopy.caseStudies} />
        <LanguageGeneratorFeatureGrid featureOverview={pageCopy.featureOverview} />
        <LanguageGeneratorHowItWorks copy={pageCopy.howItWorks} />
        <LanguageGeneratorToolComparison copy={pageCopy.toolComparison} />
        <LanguageGeneratorCallToAction copy={pageCopy.callToAction} />
        <LanguageGeneratorFaq copy={pageCopy.faq} />
      </InnerPageChrome>
    </>
  );
}
