import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ContentPageShell } from '@/components/site/ContentPageShell';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getCollectionPageCopy, getGuidePages, getSiteConfig } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'zh';
const copy = getCollectionPageCopy(locale).guides;
const siteConfig = getSiteConfig(locale);
const guidePages = getGuidePages(locale);

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: {
    canonical: '/zh/guides',
    languages: getLanguageAlternates('/guides'),
  },
};

export default function ChineseGuidesIndexPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    url: absoluteUrl('/zh/guides'),
    description: copy.description,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl('/zh'),
    },
    inLanguage: 'zh-CN',
  };

  return (
    <>
      <StructuredData id="guides-collection-zh-jsonld" data={structuredData} />
      <ContentPageShell
        locale="zh"
        currentPath="/guides"
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {guidePages.map((page) => (
            <article
              key={page.slug}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)]"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{page.outcome}</p>
              <h2 className="mt-4 text-2xl font-medium text-stone-50">{page.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">{page.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={getLocalizedPath(locale, `/guides/${page.slug}`)} className="inline-flex items-center gap-2 text-sm text-[#f1d492]">
                  查看指南
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={page.ctaQuery} className="text-sm text-stone-400 transition hover:text-stone-100">
                  在编辑器里试用
                </Link>
              </div>
            </article>
          ))}
        </div>
      </ContentPageShell>
    </>
  );
}
