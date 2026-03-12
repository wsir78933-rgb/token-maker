import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ContentPageShell } from '@/components/site/ContentPageShell';
import { StructuredData } from '@/components/site/StructuredData';
import {
  absoluteUrl,
  getGuidePages,
  getSiteConfig,
  getTemplatePage,
  getTemplatePages,
} from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'zh';
const siteConfig = getSiteConfig(locale);
const detailCopy = {
  eyebrow: '模板页',
  summary: '为什么这种形式有效',
  bestFor: '适合什么场景',
  settings: '推荐设置',
  tips: '实用建议',
  relatedGuides: '相关指南',
  allGuides: '查看全部指南',
  openSetup: '用这个预设打开编辑器',
  readGuide: '查看指南',
};

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getTemplatePages(locale).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getTemplatePage(locale, slug);

  if (!page) {
    return {
      title: '模板不存在',
    };
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/zh/templates/${page.slug}`,
      languages: getLanguageAlternates(`/templates/${page.slug}`),
    },
    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      url: absoluteUrl(`/zh/templates/${page.slug}`),
      type: 'article',
    },
  };
}

export default async function ChineseTemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  const page = getTemplatePage(locale, slug);

  if (!page) {
    notFound();
  }

  const relatedGuides = getGuidePages(locale).filter((guide) => guide.relatedTemplateSlugs.includes(page.slug));

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: absoluteUrl(`/zh/templates/${page.slug}`),
    description: page.description,
    inLanguage: 'zh-CN',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl('/zh'),
    },
  };

  return (
    <>
      <StructuredData id={`template-zh-${page.slug}-jsonld`} data={structuredData} />
      <ContentPageShell
        locale="zh"
        currentPath={`/templates/${page.slug}`}
        eyebrow={detailCopy.eyebrow}
        title={page.title}
        description={page.description}
        ctaHref={page.query}
        ctaLabel={detailCopy.openSetup}
      >
        <div className="space-y-10">
          <section className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-display text-3xl text-stone-50">{detailCopy.summary}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">{page.summary}</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-medium text-stone-50">{detailCopy.bestFor}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {page.bestFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-medium text-stone-50">{detailCopy.settings}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {page.settings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-medium text-stone-50">{detailCopy.tips}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {page.tips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </section>

          {relatedGuides.length > 0 ? (
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-3xl text-stone-50">{detailCopy.relatedGuides}</h2>
                <Link
                  href={getLocalizedPath(locale, '/guides')}
                  className="text-sm text-stone-400 transition hover:text-stone-100"
                >
                  {detailCopy.allGuides}
                </Link>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={getLocalizedPath(locale, `/guides/${guide.slug}`)}
                    className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/15 hover:bg-white/[0.045]"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{guide.outcome}</p>
                    <h3 className="mt-3 text-xl font-medium text-stone-50">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-300">{guide.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-[#f1d492]">
                      {detailCopy.readGuide}
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
