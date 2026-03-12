import Link from 'next/link';

import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBreadcrumbStructuredData,
  buildCollectionStructuredData,
  getFaqDocModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    faq: 'FAQ',
    nextEyebrow: 'Keep moving',
    nextTitle: 'Where to go next',
    nextDescription: 'Once the basics are clear, jump back into making tokens or move into format-specific reading.',
    openLink: 'Open page',
    nextLinks: [
      {
        href: '/',
        label: 'Open the editor',
        description: 'Go straight back to the browser editor and test the workflow on a real token.',
      },
      {
        href: '/templates',
        label: 'Browse templates',
        description: 'Pick a circle, square, hex, monster, or transparent setup before your next export.',
      },
      {
        href: '/blog',
        label: 'Read the blog',
        description: 'Compare Roll20, Foundry VTT, and export-size guides when the quick answer is not enough.',
      },
    ],
  },
  zh: {
    editor: '编辑器',
    faq: '常见问题',
    nextEyebrow: '继续浏览',
    nextTitle: '下一步去哪里',
    nextDescription: '问题先回答清楚，再把你带回编辑器、模板页和更具体的博客文章里。',
    openLink: '打开页面',
    nextLinks: [
      {
        href: '/',
        label: '回到编辑器',
        description: '直接回到浏览器编辑器，用真实角色图继续试一轮工作流。',
      },
      {
        href: '/templates',
        label: '浏览模板页',
        description: '从圆形、方形、六边形、怪物或透明背景方案里选一个更贴近当前用途的入口。',
      },
      {
        href: '/blog',
        label: '继续看博客',
        description: '当 FAQ 不够时，再去看 Roll20、Foundry VTT 和导出尺寸的实战文章。',
      },
    ],
  },
} as const;

export function FaqDocPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getFaqDocModel(locale);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.faq },
  ];
  const nextLinks = copy.nextLinks.map((link) => ({
    ...link,
    href: getLocalizedPath(locale, link.href),
  }));
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: model.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <StructuredData
        id={`faq-doc-${locale}-collection-jsonld`}
        data={buildCollectionStructuredData(locale, '/faq', model.title, model.description)}
      />
      <StructuredData id={`faq-doc-${locale}-faq-jsonld`} data={faqStructuredData} />
      <StructuredData
        id={`faq-doc-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.faq, path: '/faq' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/faq" tone="doc">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-18">
            <PageBreadcrumbs items={breadcrumbs} />
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{model.eyebrow}</p>
                <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl">{model.title}</h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300">{model.description}</p>
                <p className="max-w-3xl text-sm leading-8 text-stone-400">{model.intro}</p>
              </div>
              <div className="grid gap-4">
                {model.signals.map((signal) => (
                  <article key={signal.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="text-lg font-medium text-stone-50">{signal.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-stone-300">{signal.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8 lg:py-16">
          <aside className="space-y-3 lg:sticky lg:top-30 lg:self-start">
            {model.groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="block rounded-[24px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-300 transition hover:border-white/20 hover:text-stone-100"
              >
                {group.title}
              </a>
            ))}
          </aside>

          <div className="space-y-10">
            {model.groups.map((group) => (
              <section key={group.id} id={group.id} className="rounded-[34px] border border-white/10 bg-white/[0.03] p-7">
                <h2 className="font-display text-3xl text-stone-50">{group.title}</h2>
                <p className="mt-3 text-sm leading-8 text-stone-400">{group.description}</p>
                <div className="mt-6 space-y-4">
                  {group.itemIndexes.map((index) => {
                    const item = model.items[index];

                    if (!item) {
                      return null;
                    }

                    return (
                      <details key={item.question} className="rounded-[26px] border border-white/10 bg-black/20 p-5">
                        <summary className="cursor-pointer list-none text-lg font-medium text-stone-50">
                          {item.question}
                        </summary>
                        <p className="mt-4 text-sm leading-7 text-stone-300">{item.answer}</p>
                      </details>
                    );
                  })}
                </div>
              </section>
            ))}

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
        </div>
      </InnerPageChrome>
    </>
  );
}
