import Link from 'next/link';
import { ArrowRight, Compass, Crosshair, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { EditorLaunchButton } from '@/components/site/EditorLaunchButton';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import { getPublishedBlogPosts } from '@/lib/blog-content';
import { formatPageDate } from '@/lib/site-formatting';
import {
  buildBreadcrumbStructuredData,
  buildTemplatePageStructuredData,
  getTemplateDetailModel,
  type TemplateDetailModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    eyebrow: 'Template detail',
    updated: 'Updated',
    decisionLens: 'Decision lens',
    signatureSetup: 'Signature setup',
    bestFor: 'Best for',
    avoidWhen: 'Avoid this route when',
    settings: 'Recommended settings',
    tips: 'Execution notes',
    examples: 'Example outcomes',
    mistakes: 'Common mistakes',
    compare: 'Compare with nearby formats',
    relatedGuides: 'Blog posts that support this format',
    allTemplates: 'Browse all template pages',
    openSetup: 'Open this setup in the editor',
    readGuide: 'Read article',
    exploreFormat: 'Explore format',
    quickStart: 'Quick start',
    thisPageIsFor: 'This page is for',
    summaryLabel: 'Format summary',
    templates: 'Templates',
    editor: 'Editor',
  },
  zh: {
    eyebrow: '模板详情',
    updated: '更新于',
    decisionLens: '判断逻辑',
    signatureSetup: '标志性配置',
    bestFor: '适合场景',
    avoidWhen: '不适合场景',
    settings: '推荐参数',
    tips: '执行提示',
    examples: '输出结果示例',
    mistakes: '常见错误',
    compare: '相邻格式对比',
    relatedGuides: '和这个模板配套的博客文章',
    allTemplates: '查看全部模板页',
    openSetup: '带着这个配置进入编辑器',
    readGuide: '读文章',
    exploreFormat: '查看格式',
    quickStart: '快速启动',
    thisPageIsFor: '这一页主要服务',
    summaryLabel: '格式概览',
    templates: '模板页',
    editor: '编辑器',
  },
} as const;

function getRelatedTemplate(locale: SiteLocale, slug: string): TemplateDetailModel | undefined {
  return getTemplateDetailModel(locale, slug);
}

export function TemplateDetailPageView({ locale, slug }: { locale: SiteLocale; slug: string }) {
  const page = getTemplateDetailModel(locale, slug);

  if (!page) {
    notFound();
  }

  const copy = copyByLocale[locale];
  const relatedGuides = getPublishedBlogPosts(locale).filter((post) =>
    post.relatedTemplateSlugs.includes(page.slug),
  );
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.templates, href: getLocalizedPath(locale, '/templates') },
    { label: page.title },
  ];

  return (
    <>
      <StructuredData id={`template-${locale}-${page.slug}-jsonld`} data={buildTemplatePageStructuredData(locale, page)} />
      <StructuredData
        id={`template-${locale}-${page.slug}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.templates, path: '/templates' },
          { name: page.title, path: `/templates/${page.slug}` },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath={`/templates/${page.slug}`} tone="template">
        <section className="relative border-b border-white/10">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:px-8 lg:py-20">
            <div className="space-y-8">
              <PageBreadcrumbs items={breadcrumbs} />

              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.34em] text-[#d7b46a]">{copy.eyebrow}</p>
                <h1 className="font-display max-w-5xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
                  {page.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">{page.description}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-stone-300">
                <span className="rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/12 px-3 py-1.5 text-[#f1d492]">
                  {copy.updated} {formatPageDate(locale, page.updatedAt)}
                </span>
                <span className="rounded-full border border-white/12 px-3 py-1.5">{page.intent}</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.75fr)]">
                <article className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_30px_120px_-50px_rgba(0,0,0,0.92)]">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#d7b46a]">
                    <Compass className="h-4 w-4" />
                    {copy.decisionLens}
                  </div>
                  <p className="mt-5 text-base leading-8 text-stone-200">{page.decisionLens}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorLaunchButton
                      href={page.query}
                      className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/40 bg-[#d7b46a]/12 px-5 py-2.5 text-sm font-medium text-[#f5ddb0] transition hover:border-[#f2cb7a] hover:bg-[#d7b46a]/20"
                    >
                      {copy.openSetup}
                      <ArrowRight className="h-4 w-4" />
                    </EditorLaunchButton>
                    <Link
                      href={getLocalizedPath(locale, '/templates')}
                      prefetch={false}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-stone-300 transition hover:border-white/25 hover:text-stone-100"
                    >
                      {copy.allTemplates}
                    </Link>
                  </div>
                </article>

                <article className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(215,180,106,0.12),rgba(255,255,255,0.03))] p-7">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-400">{copy.signatureSetup}</p>
                  <h2 className="mt-4 font-display text-3xl text-stone-50">{page.signatureSetup.label}</h2>
                  <ul className="mt-6 space-y-3 text-sm leading-7 text-stone-200">
                    {page.signatureSetup.items.map((item) => (
                      <li key={item} className="border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <aside className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d7b46a]">{copy.thisPageIsFor}</p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                {page.useCases.map((item) => (
                  <li key={item} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-[24px] border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{copy.quickStart}</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                  {page.settings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-6 py-14 lg:px-8 lg:py-18">
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <article className="rounded-[34px] border border-white/10 bg-white/[0.035] p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{copy.summaryLabel}</p>
              <p className="mt-5 text-lg leading-9 text-stone-200">{page.summary}</p>
              <div className="mt-8 rounded-[26px] border border-white/8 bg-black/20 p-5">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#d7b46a]">
                  <Crosshair className="h-4 w-4" />
                  {copy.bestFor}
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {page.bestFor.map((item) => (
                    <li key={item} className="rounded-[22px] border border-white/8 px-4 py-3 text-sm leading-7 text-stone-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="rounded-[34px] border border-[#7fa7d6]/20 bg-[linear-gradient(180deg,rgba(127,167,214,0.12),rgba(255,255,255,0.03))] p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-400">{copy.avoidWhen}</p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-200">
                {page.avoidWhen.map((item) => (
                  <li key={item} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#d7b46a]" />
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.examples}</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {page.exampleOutputs.map((example) => (
                <article
                  key={example.title}
                  className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-6"
                >
                  <h3 className="text-xl font-medium text-stone-50">{example.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{example.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{copy.settings}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                {page.settings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{copy.tips}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                {page.tips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="space-y-6">
            <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.mistakes}</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {page.commonMistakes.map((item, index) => (
                <article key={item} className="rounded-[30px] border border-[#d7b46a]/20 bg-[#140f05]/55 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">0{index + 1}</p>
                  <p className="mt-4 text-sm leading-7 text-stone-200">{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.compare}</h2>
              <Link
                href={getLocalizedPath(locale, '/templates')}
                prefetch={false}
                className="text-sm text-stone-400 transition hover:text-stone-100"
              >
                {copy.allTemplates}
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {page.compareWith.map((comparison) => {
                const target = getRelatedTemplate(locale, comparison.slug);

                if (!target) {
                  return null;
                }

                return (
                  <Link
                    key={target.slug}
                    href={getLocalizedPath(locale, `/templates/${target.slug}`)}
                    prefetch={false}
                    className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.045]"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{target.intent}</p>
                    <h3 className="mt-3 text-2xl font-medium text-stone-50">{target.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-stone-300">{comparison.reason}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm text-[#f1d492]">
                      {copy.exploreFormat}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {relatedGuides.length > 0 ? (
            <section className="space-y-6">
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.relatedGuides}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={getLocalizedPath(locale, `/blog/${guide.slug}`)}
                    prefetch={false}
                    className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(127,167,214,0.12),rgba(255,255,255,0.02))] p-6 transition hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(127,167,214,0.16),rgba(255,255,255,0.03))]"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{guide.category}</p>
                    <h3 className="mt-3 text-2xl font-medium text-stone-50">{guide.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-stone-300">{guide.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm text-[#f1d492]">
                      {copy.readGuide}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </InnerPageChrome>
    </>
  );
}
