import Link from 'next/link';
import { ArrowRight, Route, Waypoints } from 'lucide-react';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBreadcrumbStructuredData,
  buildCollectionStructuredData,
  getAllGuideDetailModels,
  getGuidesHubModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    guides: 'Blog',
    readGuide: 'Read article',
    tryEditor: 'Try in editor',
  },
  zh: {
    editor: '编辑器',
    guides: '博客',
    readGuide: '阅读全文',
    tryEditor: '在编辑器里试试',
  },
} as const;

export function GuidesHubPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getGuidesHubModel(locale);
  const guides = getAllGuideDetailModels(locale);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.guides },
  ];

  return (
    <>
      <StructuredData
        id={`guides-hub-${locale}-jsonld`}
        data={buildCollectionStructuredData(locale, '/blog', model.title, model.description)}
      />
      <StructuredData
        id={`guides-hub-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.guides, path: '/blog' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/blog" tone="hub">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-[#8fb7ff]">{model.eyebrow}</p>
                <h1 className="font-display max-w-5xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
                  {model.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">{model.description}</p>
                <p className="max-w-4xl text-sm leading-8 text-stone-400">{model.intro}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {model.stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{stat.label}</p>
                    <p className="mt-3 font-display text-3xl text-stone-50">{stat.value}</p>
                    <p className="mt-3 text-sm leading-7 text-stone-300">{stat.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-6 py-14 lg:px-8 lg:py-18">
          <section className="space-y-6">
            {model.tracks.map((track) => {
              const items = guides.filter((guide) => track.slugs.includes(guide.slug));

              return (
                <div key={track.id} className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                  <aside className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(143,183,255,0.14),rgba(255,255,255,0.02))] p-7">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7ff]">{track.title}</p>
                    <p className="mt-5 text-sm leading-8 text-stone-300">{track.description}</p>
                    <p className="mt-5 text-sm leading-8 text-stone-400">{track.outcome}</p>
                  </aside>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {items.map((guide) => (
                      <article
                        key={guide.slug}
                        className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_90px_-50px_rgba(0,0,0,0.85)]"
                      >
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                          <span>{guide.readTime}</span>
                          <span className="rounded-full border border-white/10 px-2.5 py-1">{guide.outcome}</span>
                        </div>
                        <h2 className="mt-4 text-2xl font-medium text-stone-50">{guide.title}</h2>
                        <p className="mt-4 text-sm leading-7 text-stone-300">{guide.summary}</p>
                        <ul className="mt-5 space-y-2 text-sm leading-7 text-stone-200">
                          {guide.checklist.slice(0, 2).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            href={getLocalizedPath(locale, `/blog/${guide.slug}`)}
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-sm text-[#f1d492]"
                          >
                            {copy.readGuide}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href={guide.ctaQuery}
                            prefetch={false}
                            className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-stone-100"
                          >
                            {copy.tryEditor}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(215,180,106,0.12),rgba(255,255,255,0.02))] p-7">
            <div className="flex items-center gap-3">
              <Waypoints className="h-5 w-5 text-[#d7b46a]" />
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{model.timelineTitle}</h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {model.timeline.map((item, index) => (
                <article key={item.title} className="rounded-[30px] border border-white/10 bg-black/20 p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
                    <Route className="h-4 w-4" />
                    0{index + 1}
                  </div>
                  <h3 className="mt-4 text-xl font-medium text-stone-50">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </InnerPageChrome>
    </>
  );
}
