import Link from 'next/link';

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
    principles: 'Operating principles',
    commitments: 'What this page commits to',
    nextEyebrow: 'Keep moving',
    nextTitle: 'Do something useful after reading',
    nextDescription: 'Privacy pages should clarify trust, then get out of the way. These are the three best paths back into the product.',
    openLink: 'Open page',
    nextLinks: [
      {
        href: '/',
        label: 'Open the editor',
        description: 'Return to the local-first editor and keep working without leaving the browser flow.',
      },
      {
        href: '/templates',
        label: 'Browse templates',
        description: 'Choose the token format that matches your table before you export another batch.',
      },
      {
        href: '/blog',
        label: 'Read practical guides',
        description: 'Go deeper on Roll20, Foundry VTT, and export decisions once the privacy basics are clear.',
      },
    ],
  },
  zh: {
    editor: '编辑器',
    privacy: '隐私',
    principles: '运行原则',
    commitments: '这页明确承诺什么',
    nextEyebrow: '继续浏览',
    nextTitle: '看完之后，继续做点有用的事',
    nextDescription: '隐私页应该先把信任边界讲清楚，然后尽快把你带回产品本身。这三个入口最直接。',
    openLink: '打开页面',
    nextLinks: [
      {
        href: '/',
        label: '回到编辑器',
        description: '继续使用本地优先的浏览器编辑器，不用离开当前工作流。',
      },
      {
        href: '/templates',
        label: '浏览模板页',
        description: '按桌面场景选择更合适的 token 格式，再决定下一批素材怎么做。',
      },
      {
        href: '/blog',
        label: '继续看实战文章',
        description: '在隐私边界清楚以后，再去看 Roll20、Foundry VTT 和导出策略的具体建议。',
      },
    ],
  },
} as const;

export function PrivacyDocPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getPrivacyDocModel(locale);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.privacy },
  ];
  const nextLinks = copy.nextLinks.map((link) => ({
    ...link,
    href: getLocalizedPath(locale, link.href),
  }));

  return (
    <>
      <StructuredData
        id={`privacy-doc-${locale}-collection-jsonld`}
        data={buildCollectionStructuredData(locale, '/privacy', model.title, model.description)}
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
            <div className="mt-8 space-y-5">
              <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{model.eyebrow}</p>
              <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl">{model.title}</h1>
              <p className="max-w-3xl text-base leading-8 text-stone-300">{model.description}</p>
              <p className="max-w-3xl text-sm leading-8 text-stone-400">{model.intro}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-12 px-6 py-14 lg:px-8 lg:py-16">
          <section className="space-y-6">
            <h2 className="font-display text-3xl text-stone-50">{copy.principles}</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {model.principles.map((item) => (
                <article key={item.title} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-xl font-medium text-stone-50">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              {model.sections.map((section) => (
                <article key={section.title} className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
                  <h2 className="text-2xl font-medium text-stone-50">{section.title}</h2>
                  <p className="mt-4 text-sm leading-8 text-stone-300">{section.body}</p>
                </article>
              ))}
            </div>

            <aside className="rounded-[32px] border border-white/10 bg-black/25 p-6 lg:sticky lg:top-30 lg:self-start">
              <h2 className="text-lg font-medium text-stone-50">{copy.commitments}</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                {model.commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </section>

          <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{copy.nextEyebrow}</p>
              <h2 className="font-display text-3xl text-stone-50">{copy.nextTitle}</h2>
              <p className="text-sm leading-8 text-stone-300">{copy.nextDescription}</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {nextLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-[28px] border border-white/10 bg-black/25 p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <h3 className="text-lg font-medium text-stone-50 transition group-hover:text-white">{link.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{link.description}</p>
                  <span className="mt-6 inline-flex text-xs uppercase tracking-[0.28em] text-stone-400 transition group-hover:text-stone-200">
                    {copy.openLink}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </InnerPageChrome>
    </>
  );
}
