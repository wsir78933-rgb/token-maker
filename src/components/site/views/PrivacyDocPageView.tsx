import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBreadcrumbStructuredData,
  buildCollectionStructuredData,
  getPrivacyDocModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    privacy: 'Privacy',
    defaultRule: 'At a glance',
    openEditor: 'Return to the editor',
    promises: 'Key points',
    commitments: 'Current boundaries',
    sectionEyebrow: 'How data handling works',
    heroBadges: ['Local downloads', 'Public share links', 'Ad disclosures', 'Contact messages'],
  },
  zh: {
    editor: '编辑器',
    privacy: '隐私',
    defaultRule: '一眼看懂',
    openEditor: '回到编辑器',
    promises: '核心说明',
    commitments: '当前边界',
    sectionEyebrow: '数据处理方式',
    heroBadges: ['本地下载', '公开分享链接', '广告披露', '联系消息'],
  },
} as const;

export function PrivacyDocPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getPrivacyDocModel(locale);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.privacy },
  ];

  return (
    <>
      <StructuredData
        id={`privacy-doc-${locale}-collection-jsonld`}
        data={buildCollectionStructuredData(
          locale,
          '/privacy',
          model.title,
          model.description,
          model.updatedAt
        )}
      />
      <StructuredData
        id={`privacy-doc-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.privacy, path: '/privacy' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/privacy" tone="doc">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-18">
            <PageBreadcrumbs items={breadcrumbs} />
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_340px]">
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
                <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.defaultRule}</p>
                <p className="mt-4 text-lg leading-8 text-stone-100">{model.intro}</p>
                <Link
                  href={`${getLocalizedPath(locale, '/')}#editor-workspace`}
                  prefetch={false}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#f1d492] transition hover:text-[#f7dfab]"
                >
                  {copy.openEditor}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{copy.sectionEyebrow}</p>
            </div>

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

          <aside className="space-y-5 lg:sticky lg:top-30 lg:self-start">
            <article className="rounded-[30px] border border-white/10 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{copy.promises}</p>
              <div className="mt-5 space-y-3">
                {model.principles.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4"
                  >
                    <h2 className="text-base font-medium text-stone-50">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-stone-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-medium text-stone-50">{copy.commitments}</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                {model.commitments.map((item) => (
                  <li key={item} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </aside>
        </div>
      </InnerPageChrome>
    </>
  );
}
