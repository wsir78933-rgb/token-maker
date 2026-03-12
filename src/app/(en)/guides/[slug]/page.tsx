import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ContentPageShell } from '@/components/site/ContentPageShell';
import { StructuredData } from '@/components/site/StructuredData';
import {
  absoluteUrl,
  getGuidePage,
  getGuidePages,
  getSiteConfig,
  getTemplatePages,
} from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'en';
const siteConfig = getSiteConfig(locale);
const detailCopy = {
  eyebrow: 'Workflow guide',
  summary: 'Guide summary',
  relatedTemplates: 'Related template pages',
  browseTemplates: 'Browse templates',
  openWithGuide: 'Open the editor with this guide in mind',
  openTemplate: 'Open template page',
};

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuidePages(locale).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuidePage(locale, slug);

  if (!page) {
    return {
      title: 'Guide not found',
    };
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/guides/${page.slug}`,
      languages: getLanguageAlternates(`/guides/${page.slug}`),
    },
    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      url: absoluteUrl(`/guides/${page.slug}`),
      type: 'article',
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const page = getGuidePage(locale, slug);

  if (!page) {
    notFound();
  }

  const relatedTemplates = getTemplatePages(locale).filter((template) =>
    page.relatedTemplateSlugs.includes(template.slug),
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    url: absoluteUrl(`/guides/${page.slug}`),
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };

  return (
    <>
      <StructuredData id={`guide-${page.slug}-jsonld`} data={structuredData} />
      <ContentPageShell
        locale="en"
        currentPath={`/guides/${page.slug}`}
        eyebrow={detailCopy.eyebrow}
        title={page.title}
        description={page.description}
        ctaHref={page.ctaQuery}
        ctaLabel={detailCopy.openWithGuide}
      >
        <div className="space-y-10">
          <section className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-display text-3xl text-stone-50">{detailCopy.summary}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">{page.summary}</p>
          </section>

          <section className="space-y-4">
            {page.sections.map((section) => (
              <article key={section.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-2xl font-medium text-stone-50">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-stone-300">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </section>

          {relatedTemplates.length > 0 ? (
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-3xl text-stone-50">{detailCopy.relatedTemplates}</h2>
                <Link
                  href={getLocalizedPath(locale, '/templates')}
                  className="text-sm text-stone-400 transition hover:text-stone-100"
                >
                  {detailCopy.browseTemplates}
                </Link>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {relatedTemplates.map((template) => (
                  <Link
                    key={template.slug}
                    href={getLocalizedPath(locale, `/templates/${template.slug}`)}
                    className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/15 hover:bg-white/[0.045]"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{template.intent}</p>
                    <h3 className="mt-3 text-xl font-medium text-stone-50">{template.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-300">{template.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-[#f1d492]">
                      {detailCopy.openTemplate}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </ContentPageShell>
    </>
  );
}
