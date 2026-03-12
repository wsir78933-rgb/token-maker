import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ContentPageShell } from '@/components/site/ContentPageShell';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getCollectionPageCopy, getSiteConfig, getTemplatePages } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'en';
const copy = getCollectionPageCopy(locale).templates;
const siteConfig = getSiteConfig(locale);
const templatePages = getTemplatePages(locale);

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: {
    canonical: '/templates',
    languages: getLanguageAlternates('/templates'),
  },
};

export default function TemplatesIndexPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Token Maker templates',
    url: absoluteUrl('/templates'),
    description: metadata.description,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl('/'),
    },
  };

  return (
    <>
      <StructuredData id="templates-collection-jsonld" data={structuredData} />
      <ContentPageShell
        locale="en"
        currentPath="/templates"
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        ctaHref="/#editor-workspace"
        ctaLabel={copy.ctaLabel}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {templatePages.map((page) => (
            <article
              key={page.slug}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)]"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{page.intent}</p>
              <h2 className="mt-4 text-2xl font-medium text-stone-50">{page.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">{page.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={getLocalizedPath(locale, `/templates/${page.slug}`)}
                  className="inline-flex items-center gap-2 text-sm text-[#f1d492]"
                >
                  Read page
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={page.query} className="text-sm text-stone-400 transition hover:text-stone-100">
                  Open matching setup
                </Link>
              </div>
            </article>
          ))}
        </div>
      </ContentPageShell>
    </>
  );
}
