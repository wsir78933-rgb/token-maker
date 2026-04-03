import { DiceRollerTool } from '@/components/dice/DiceRollerTool';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import {
  absoluteUrl,
  getDiceRollerPageCopy,
  getSiteConfig,
} from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export function DiceRollerPageView({ locale }: { locale: SiteLocale }) {
  const copy = getDiceRollerPageCopy(locale);
  const siteConfig = getSiteConfig(locale);
  const path = '/dice-roller-dnd';
  const localizedPath = getLocalizedPath(locale, path);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: copy.title,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: absoluteUrl(localizedPath),
        description: copy.metadataDescription,
        featureList: copy.structuredDataFeatures,
      },
      {
        '@type': 'FAQPage',
        mainEntity: copy.faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: siteConfig.name, item: absoluteUrl(getLocalizedPath(locale, '/')) },
          { '@type': 'ListItem', position: 2, name: copy.title, item: absoluteUrl(localizedPath) },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData id={`dice-roller-dnd-${locale}-jsonld`} data={structuredData} />

      <InnerPageChrome locale={locale} currentPath={path} tone="hub" showSupportStrip={false}>
        <div className="mx-auto max-w-[82rem] px-5 py-8 lg:px-8 lg:py-10">
          <DiceRollerTool locale={locale} />
        </div>
      </InnerPageChrome>
    </>
  );
}
