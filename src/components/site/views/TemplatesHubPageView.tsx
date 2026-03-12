import Link from 'next/link';
import { ArrowRight, Layers3, MoveRight } from 'lucide-react';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBreadcrumbStructuredData,
  buildCollectionStructuredData,
  getAllTemplateDetailModels,
  getTemplatesHubModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    templates: 'Templates',
    openPage: 'Open page',
    launchPreset: 'Launch preset',
    matrixUse: 'Primary use',
    matrixStrength: 'Best at',
    matrixAvoid: 'Avoid when',
  },
  zh: {
    editor: '编辑器',
    templates: '模板页',
    openPage: '打开页面',
    launchPreset: '直接打开预设',
    matrixUse: '主要用途',
    matrixStrength: '最擅长',
    matrixAvoid: '不适合',
  },
} as const;

export function TemplatesHubPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getTemplatesHubModel(locale);
  const templates = getAllTemplateDetailModels(locale);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.templates },
  ];

  return (
    <>
      <StructuredData
        id={`templates-hub-${locale}-jsonld`}
        data={buildCollectionStructuredData(locale, '/templates', model.title, model.description)}
      />
      <StructuredData
        id={`templates-hub-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.templates, path: '/templates' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/templates" tone="hub">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-[#d7b46a]">{model.eyebrow}</p>
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
          {model.categories.map((category) => {
            const items = templates.filter((template) => category.slugs.includes(template.slug));

            return (
              <section key={category.id} className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(215,180,106,0.14),rgba(255,255,255,0.02))] p-7">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#d7b46a]">{category.title}</p>
                  <p className="mt-5 text-sm leading-8 text-stone-300">{category.description}</p>
                  <p className="mt-5 text-sm leading-8 text-stone-400">{category.narrative}</p>
                </aside>

                <div className="grid gap-4 lg:grid-cols-2">
                  {items.map((template) => (
                    <article
                      key={template.slug}
                      className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_90px_-50px_rgba(0,0,0,0.85)]"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{template.intent}</p>
                      <h2 className="mt-3 text-2xl font-medium text-stone-50">{template.title}</h2>
                      <p className="mt-4 text-sm leading-7 text-stone-300">{template.decisionLens}</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{copy.matrixStrength}</p>
                          <ul className="mt-3 space-y-2 text-sm leading-7 text-stone-200">
                            {template.bestFor.slice(0, 2).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{copy.matrixAvoid}</p>
                          <ul className="mt-3 space-y-2 text-sm leading-7 text-stone-200">
                            {template.avoidWhen.slice(0, 2).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={getLocalizedPath(locale, `/templates/${template.slug}`)}
                          className="inline-flex items-center gap-2 text-sm text-[#f1d492]"
                        >
                          {copy.openPage}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          href={template.query}
                          className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-stone-100"
                        >
                          {copy.launchPreset}
                          <MoveRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(127,167,214,0.12),rgba(255,255,255,0.02))] p-7">
            <div className="flex items-center gap-3">
              <Layers3 className="h-5 w-5 text-[#8fb7ff]" />
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{model.comparisonTitle}</h2>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-8 text-stone-300">{model.comparisonDescription}</p>
            <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
              <div className="grid grid-cols-[minmax(180px,1.1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(220px,1.2fr)] border-b border-white/10 bg-black/20 px-5 py-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                <span>{copy.templates}</span>
                <span>{copy.matrixUse}</span>
                <span>{copy.matrixStrength}</span>
                <span>{copy.matrixAvoid}</span>
              </div>
              {templates.map((template) => (
                <div
                  key={template.slug}
                  className="grid grid-cols-[minmax(180px,1.1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(220px,1.2fr)] border-b border-white/8 px-5 py-4 text-sm last:border-b-0"
                >
                  <div className="pr-4">
                    <p className="font-medium text-stone-100">{template.title}</p>
                    <p className="mt-2 text-stone-400">{template.intent}</p>
                  </div>
                  <p className="pr-4 text-stone-300">{template.useCases[0]}</p>
                  <p className="pr-4 text-stone-300">{template.bestFor[0]}</p>
                  <p className="text-stone-300">{template.avoidWhen[0]}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </InnerPageChrome>
    </>
  );
}
