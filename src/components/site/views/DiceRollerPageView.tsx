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
          
          <div className="mt-16 sm:mt-24 border-t border-white/10 pt-16 sm:pt-20 w-full">
            <h2 className="font-display text-3xl sm:text-4xl text-stone-50 text-center mb-12 sm:mb-16">
              {copy.statsGuide.headline}
            </h2>
            
            <div className="space-y-8 sm:space-y-12">
              {/* Top Hero Article (Centered) */}
              <article className="mx-auto max-w-5xl rounded-[32px] border border-[#d7b46a]/20 bg-[linear-gradient(180deg,rgba(215,180,106,0.06),rgba(215,180,106,0.01))] p-8 sm:p-10 lg:p-14 text-center">
                <h3 className="font-display text-2xl sm:text-3xl text-[#f1d492]">
                  {copy.statsGuide.methodTitle}
                </h3>
                <div className="mt-8 space-y-5 text-left md:text-center max-w-3xl mx-auto">
                  {copy.statsGuide.methodBody.map((paragraph, i) => (
                    <p key={i} className="text-[1.05rem] leading-[1.85] text-stone-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>

              {/* Bottom 3-Column Grid for Supporting Content */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                <article className="rounded-[28px] border border-white/8 bg-black/40 p-6 sm:p-8 flex flex-col">
                  <h3 className="font-display text-xl text-stone-100 mb-5">{copy.statsGuide.connectTitle}</h3>
                  <div className="space-y-4 flex-1">
                    {copy.statsGuide.connectBody.map((paragraph, i) => (
                      <p key={i} className="text-[0.95rem] leading-[1.75] text-stone-400">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
                <article className="rounded-[28px] border border-white/8 bg-black/40 p-6 sm:p-8 flex flex-col">
                  <h3 className="font-display text-xl text-stone-100 mb-5">{copy.statsGuide.extraTitle}</h3>
                  <div className="space-y-4 flex-1">
                    {copy.statsGuide.extraBody.map((paragraph, i) => (
                      <p key={i} className="text-[0.95rem] leading-[1.75] text-stone-400">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
                <article className="rounded-[28px] border border-white/8 bg-black/40 p-6 sm:p-8 flex flex-col sm:col-span-2 lg:col-span-1">
                  <h3 className="font-display text-xl text-stone-100 mb-5">{copy.statsGuide.alternativesTitle}</h3>
                  <div className="space-y-4 flex-1">
                    {copy.statsGuide.alternativesBody.map((paragraph, i) => (
                      <p key={i} className="text-[0.95rem] leading-[1.75] text-stone-400">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>

        </div>
      </InnerPageChrome>
    </>
  );
}
