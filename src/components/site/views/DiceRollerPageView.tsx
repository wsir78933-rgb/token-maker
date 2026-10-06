import { ArrowRight } from 'lucide-react';

import { DiceRollerTool } from '@/components/dice/DiceRollerTool';
import { DiceRollerContentSections } from '@/components/dice/DiceRollerContentSections';
import { DiceRollerFaq } from '@/components/dice/DiceRollerFaq';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import { Button } from '@/components/ui/button';
import {
  absoluteUrl,
  getDiceRollerPageCopy,
  getNavLabels,
  type DiceRollerPageCopy,
} from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

function DiceRollerCallToAction({ copy }: { copy: DiceRollerPageCopy }) {
  return (
    <section
      id="dice-roller-call-to-action"
      aria-labelledby="dice-roller-call-to-action-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 text-center sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3">
        <h2
          id="dice-roller-call-to-action-title"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.callToActionTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.callToActionDescription}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 rounded-full px-8"
          nativeButton={false}
          render={<a href="#dice-roller-tool" />}
        >
          {copy.callToActionLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function DiceRollerPageView({ locale }: { locale: SiteLocale }) {
  const copy = getDiceRollerPageCopy(locale);
  const navLabels = getNavLabels(locale);
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
    ],
  };

  return (
    <>
      <StructuredData id={`dice-roller-dnd-${locale}-jsonld`} data={structuredData} />
      <StructuredData
        id={`dice-roller-dnd-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: navLabels.diceRoller, path },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={path}
        tone="hub"
        className="[&_button:enabled:not([aria-disabled=true])]:cursor-pointer [&_a[href]:not([aria-disabled=true])]:cursor-pointer"
      >
        <div className="mx-auto max-w-[82rem] px-5 py-8 lg:px-8 lg:py-10">
          <PageBreadcrumbs
            locale={locale}
            items={[
              { label: navLabels.editor, href: getLocalizedPath(locale, '/') },
              { label: navLabels.diceRoller },
            ]}
          />
          <div id="dice-roller-tool" className="scroll-mt-24">
            <DiceRollerTool locale={locale} />
          </div>
        </div>
        <DiceRollerContentSections copy={copy} />
        <DiceRollerCallToAction copy={copy} />
        <DiceRollerFaq
          eyebrow={copy.faqEyebrow}
          title={copy.faqTitle}
          description={copy.faqDescription}
          items={copy.faqItems}
        />
      </InnerPageChrome>
    </>
  );
}
