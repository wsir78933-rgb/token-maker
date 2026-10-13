import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { ToolRecommendationSection } from '@/components/site/ToolRecommendationSection';
import { CastleCreatorCallToAction } from '@/components/castle-creator/CastleCreatorCallToAction';
import { CastleCreatorExamples } from '@/components/castle-creator/CastleCreatorExamples';
import { CastleCreatorFaq } from '@/components/castle-creator/CastleCreatorFaq';
import { CastleCreatorFeatureGrid } from '@/components/castle-creator/CastleCreatorFeatureGrid';
import { CastleCreatorHowItWorks } from '@/components/castle-creator/CastleCreatorHowItWorks';
import { CastleCreatorPageHeading } from '@/components/castle-creator/CastleCreatorPageHeading';
import { CastleCreatorToolComparison } from '@/components/castle-creator/CastleCreatorToolComparison';
import { CastleCreatorWhatIs } from '@/components/castle-creator/CastleCreatorWhatIs';
import { CastleCreatorWorkbench } from '@/components/castle-creator/CastleCreatorWorkbench';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import { CASTLE_CREATOR_EDITOR_ID, CASTLE_CREATOR_PATH } from '@/lib/castle-creator/constants';
import { getCastleCreatorExamples } from '@/lib/castle-creator/examples';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export function CastleCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getCastleCreatorCopy(locale);
  const examplesCopy = getCastleCreatorExamples(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, CASTLE_CREATOR_PATH);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: copy.heading,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: absoluteUrl(localizedPath),
        description: copy.pageDescription,
      },
      {
        '@type': 'FAQPage',
        mainEntity: copy.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <StructuredData id={`castle-creator-${locale}-jsonld`} data={structuredData} />
      <StructuredData
        id={`castle-creator-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationName, path: CASTLE_CREATOR_PATH },
        ])}
      />
      <InnerPageChrome
        locale={locale}
        currentPath={CASTLE_CREATOR_PATH}
        tone="hub"
        className="castle-creator-page [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer"
      >
        <CastleCreatorPageHeading locale={locale} />
        <div
          id={CASTLE_CREATOR_EDITOR_ID}
          data-testid="castle-creator-workspace"
          className="mx-auto w-full max-w-[92rem] scroll-mt-20 px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8"
        >
          <CastleCreatorWorkbench locale={locale} />
        </div>
        <CastleCreatorWhatIs copy={copy.about} />
        <CastleCreatorExamples copy={examplesCopy} />
        <CastleCreatorFeatureGrid copy={copy.features} />
        <CastleCreatorHowItWorks copy={copy.howItWorks} />
        <CastleCreatorToolComparison copy={copy.comparison} />
        <CastleCreatorCallToAction copy={copy.callToAction} />
        <CastleCreatorFaq copy={copy.faq} />
        <ToolRecommendationSection locale={locale} currentPath="/castle-creator" />
      </InnerPageChrome>
    </>
  );
}
