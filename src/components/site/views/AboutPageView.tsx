import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBreadcrumbStructuredData,
  buildCollectionStructuredData,
  getAboutDocModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    about: 'About',
    principles: 'Operating principles',
    sections: 'What this means',
    contact: 'Send feedback',
    contactNote: 'Use the contact page for export bugs, missing styles, and platform fit issues.',
    heroBadges: ['Browser-based editor', 'Local-first default workflow', 'VTT-focused output'],
  },
  zh: {
    editor: '编辑器',
    about: '关于',
    principles: '维护原则',
    sections: '这意味着什么',
    contact: '发送反馈',
    contactNote: '导出 bug、缺少样式和平台适配问题，都可以通过联系页反馈。',
    heroBadges: ['浏览器编辑器', '默认本地优先工作流', '面向 VTT 导出'],
  },
} as const;

function formatEvidenceLinkLabel(locale: SiteLocale, label: string) {
  return locale === 'zh' ? `查看${label}` : `${label} evidence`;
}

export function AboutPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getAboutDocModel(locale);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.about },
  ];

  return (
    <>
      <StructuredData
        id={`about-${locale}-webpage-jsonld`}
        data={buildCollectionStructuredData(locale, '/about', model.title, model.description, model.updatedAt)}
      />
      <StructuredData
        id={`about-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.about, path: '/about' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/about" tone="doc">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-18">
            <PageBreadcrumbs items={breadcrumbs} locale={locale} />
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_320px]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{model.eyebrow}</p>
                <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl">
                  {model.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300">{model.description}</p>
                <p className="max-w-3xl text-sm leading-8 text-stone-400">{model.intro}</p>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-stone-300">
                  {copy.heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <aside className="rounded-[34px] border border-[#d7b46a]/18 bg-[linear-gradient(180deg,rgba(215,180,106,0.12),rgba(255,255,255,0.03))] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.principles}</p>
                <div className="mt-5 space-y-3">
                  {model.principles.map((principle) => (
                    <div
                      key={principle.title}
                      className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4"
                    >
                      <h2 className="text-base font-medium text-stone-50">{principle.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-stone-300">{principle.description}</p>
                      {principle.evidenceLink ? (
                        <Link
                          href={getLocalizedPath(locale, principle.evidenceLink.path)}
                          prefetch={false}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#f1d492] transition hover:text-[#f7dfab]"
                        >
                          {formatEvidenceLinkLabel(locale, principle.evidenceLink.label)}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-16">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{copy.sections}</p>
            {model.sections.map((section, index) => (
              <article
                key={section.title}
                className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6"
              >
                <div className="grid gap-5 md:grid-cols-[84px_minmax(0,1fr)] md:items-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/10 font-display text-2xl text-[#f1d492]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium text-stone-50">{section.title}</h2>
                    <p className="mt-4 text-sm leading-8 text-stone-300">{section.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-30 lg:self-start">
            <article className="rounded-[30px] border border-white/10 bg-black/25 p-5">
              <h2 className="text-lg font-medium text-stone-50">{copy.contact}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">{copy.contactNote}</p>
              <Link
                href={getLocalizedPath(locale, '/contact')}
                prefetch={false}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#f1d492] transition hover:text-[#f7dfab]"
              >
                {copy.contact}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </aside>
        </div>
      </InnerPageChrome>
    </>
  );
}
