import type { Metadata } from 'next';
import { ContentPageShell } from '@/components/site/ContentPageShell';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getCollectionPageCopy, getFaqItems, getSiteConfig } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'en';
const copy = getCollectionPageCopy(locale).faq;
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: {
    canonical: '/faq',
    languages: getLanguageAlternates('/faq'),
  },
};

export default function FaqPage() {
  const faqItems = getFaqItems(locale);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: absoluteUrl('/faq'),
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };

  return (
    <>
      <StructuredData id="faq-jsonld" data={structuredData} />
      <ContentPageShell
        locale="en"
        currentPath="/faq"
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <summary className="cursor-pointer list-none text-lg font-medium text-stone-50">{item.question}</summary>
              <p className="mt-4 text-sm leading-7 text-stone-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </ContentPageShell>
    </>
  );
}
