import Link from 'next/link';
import { ArrowRight, CheckCheck, CircleAlert, Clock3, NotebookText } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import { getTemplatePages } from '@/lib/site-content';
import { formatPageDate } from '@/lib/site-formatting';
import {
  buildBreadcrumbStructuredData,
  buildGuideFaqStructuredData,
  buildGuidePageStructuredData,
  getGuideDetailModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    eyebrow: 'Blog article',
    updated: 'Updated',
    summary: 'Why this post matters',
    audience: 'Best for',
    checklist: 'What to confirm before you export',
    steps: 'Working steps',
    principles: 'Decision rules',
    pitfalls: 'Where people usually go wrong',
    faq: 'Article FAQ',
    relatedTemplates: 'Template pages to open next',
    launchEditor: 'Open the editor with this post in mind',
    browseTemplates: 'Browse template pages',
    readTemplate: 'Open template page',
    guides: 'Blog',
    editor: 'Editor',
  },
  zh: {
    eyebrow: '博客文章',
    updated: '更新于',
    summary: '这篇文章为什么重要',
    audience: '适合谁看',
    checklist: '导出前要确认的事',
    steps: '执行步骤',
    principles: '判断规则',
    pitfalls: '最常出错的地方',
    faq: '文章 FAQ',
    relatedTemplates: '下一步该打开的模板页',
    launchEditor: '带着这篇文章进入编辑器',
    browseTemplates: '浏览模板页',
    readTemplate: '打开模板页',
    guides: '博客',
    editor: '编辑器',
  },
} as const;

export function GuideDetailPageView({ locale, slug }: { locale: SiteLocale; slug: string }) {
  const page = getGuideDetailModel(locale, slug);

  if (!page) {
    notFound();
  }

  const copy = copyByLocale[locale];
  const relatedTemplates = getTemplatePages(locale).filter((template) => page.relatedTemplateSlugs.includes(template.slug));
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.guides, href: getLocalizedPath(locale, '/blog') },
    { label: page.title },
  ];

  return (
    <>
      <StructuredData id={`guide-${locale}-${page.slug}-jsonld`} data={buildGuidePageStructuredData(locale, page)} />
      <StructuredData id={`guide-${locale}-${page.slug}-faq-jsonld`} data={buildGuideFaqStructuredData(page)} />
      <StructuredData
        id={`guide-${locale}-${page.slug}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.guides, path: '/blog' },
          { name: page.title, path: `/blog/${page.slug}` },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath={`/blog/${page.slug}`} tone="guide">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-[#8fb7ff]">{copy.eyebrow}</p>
                <h1 className="font-display max-w-5xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
                  {page.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">{page.description}</p>

                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-stone-300">
                  <span className="rounded-full border border-[#8fb7ff]/30 bg-[#8fb7ff]/12 px-3 py-1.5 text-[#d4e5ff]">
                    {copy.updated} {formatPageDate(locale, page.updatedAt)}
                  </span>
                  <span className="rounded-full border border-white/12 px-3 py-1.5">{page.readTime}</span>
                  <span className="rounded-full border border-white/12 px-3 py-1.5">{page.outcome}</span>
                </div>
              </div>

              <aside className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(143,183,255,0.14),rgba(255,255,255,0.02))] p-7">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-400">{copy.audience}</p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                  {page.audience.map((item) => (
                    <li key={item} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={page.ctaQuery}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/40 bg-[#d7b46a]/12 px-5 py-2.5 text-sm font-medium text-[#f5ddb0] transition hover:border-[#f2cb7a] hover:bg-[#d7b46a]/20"
                  >
                    {copy.launchEditor}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={getLocalizedPath(locale, '/templates')}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-stone-300 transition hover:border-white/25 hover:text-stone-100"
                  >
                    {copy.browseTemplates}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-18">
          <aside className="space-y-5 lg:sticky lg:top-30 lg:self-start">
            <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-[#8fb7ff]">
                <CheckCheck className="h-4 w-4" />
                {copy.checklist}
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                {page.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-black/25 p-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-stone-500">
                <Clock3 className="h-4 w-4" />
                {page.readTime}
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">{page.outcome}</p>
            </article>
          </aside>

          <div className="space-y-14">
            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{copy.summary}</p>
              <p className="mt-5 text-lg leading-9 text-stone-200">{page.summary}</p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <NotebookText className="h-5 w-5 text-[#8fb7ff]" />
                <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.steps}</h2>
              </div>
              <div className="space-y-5">
                {page.steps.map((step, index) => (
                  <article
                    key={step.title}
                    className="grid gap-5 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:grid-cols-[84px_minmax(0,1fr)]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#8fb7ff]/35 bg-[#8fb7ff]/10 font-display text-3xl text-[#d4e5ff]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-medium text-stone-50">{step.title}</h3>
                      <p className="mt-4 text-sm leading-8 text-stone-300">{step.description}</p>
                      {step.checklist?.length ? (
                        <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                          {step.checklist.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.principles}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {page.sections.map((section) => (
                  <article key={section.title} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                    <h3 className="text-2xl font-medium text-stone-50">{section.title}</h3>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-stone-300">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.bullets?.length ? (
                      <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <CircleAlert className="h-5 w-5 text-[#d7b46a]" />
                <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.pitfalls}</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {page.pitfalls.map((item) => (
                  <article key={item} className="rounded-[30px] border border-[#d7b46a]/20 bg-[#140f05]/55 p-6">
                    <p className="text-sm leading-7 text-stone-200">{item}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.faq}</h2>
              <div className="space-y-4">
                {page.faq.map((item) => (
                  <details key={item.question} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                    <summary className="cursor-pointer list-none text-lg font-medium text-stone-50">{item.question}</summary>
                    <p className="mt-4 text-sm leading-7 text-stone-300">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            {relatedTemplates.length > 0 ? (
              <section className="space-y-6">
                <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.relatedTemplates}</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  {relatedTemplates.map((template) => (
                    <Link
                      key={template.slug}
                      href={getLocalizedPath(locale, `/templates/${template.slug}`)}
                      prefetch={false}
                      className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(215,180,106,0.12),rgba(255,255,255,0.02))] p-6 transition hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(215,180,106,0.16),rgba(255,255,255,0.03))]"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{template.intent}</p>
                      <h3 className="mt-3 text-2xl font-medium text-stone-50">{template.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-stone-300">{template.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm text-[#f1d492]">
                        {copy.readTemplate}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </InnerPageChrome>
    </>
  );
}
