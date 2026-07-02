import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBreadcrumbStructuredData,
  buildCollectionStructuredData,
  getChangelogDocModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    changelog: 'Changelog',
    latest: 'Latest update',
    updates: 'Public updates',
    about: 'About the project',
    aboutNote: 'Read the About page for the project scope, default workflow, and maintenance model.',
    heroBadges: ['Public changes', 'Support pages', 'Workflow updates'],
  },
  zh: {
    editor: '编辑器',
    changelog: '更新记录',
    latest: '最近更新',
    updates: '公开更新',
    about: '关于项目',
    aboutNote: '在关于页可以查看项目边界、默认工作流和维护方式。',
    heroBadges: ['公开变化', '支持页面', '工作流更新'],
  },
} as const;

function ChangelogAffectedLinks({
  locale,
  links,
}: {
  locale: SiteLocale;
  links: Array<{ label: string; path: string }>;
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={`${link.path}-${link.label}`}
          href={getLocalizedPath(locale, link.path)}
          prefetch={false}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[#f1d492] transition hover:border-[#d7b46a]/45 hover:text-[#f7dfab]"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function ChangelogPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getChangelogDocModel(locale);
  const [latestEntry, ...olderEntries] = model.entries;
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.changelog },
  ];

  return (
    <>
      <StructuredData
        id={`changelog-${locale}-webpage-jsonld`}
        data={buildCollectionStructuredData(
          locale,
          '/changelog',
          model.title,
          model.description,
          model.updatedAt
        )}
      />
      <StructuredData
        id={`changelog-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.changelog, path: '/changelog' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/changelog" tone="doc">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-18">
            <PageBreadcrumbs items={breadcrumbs} />
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

              {latestEntry ? (
                <aside className="rounded-[34px] border border-[#d7b46a]/18 bg-[linear-gradient(180deg,rgba(215,180,106,0.12),rgba(255,255,255,0.03))] p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.latest}</p>
                  <time className="mt-5 block text-sm text-stone-400" dateTime={latestEntry.date}>
                    {latestEntry.date}
                  </time>
                  <h2 className="mt-3 text-xl font-medium text-stone-50">{latestEntry.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{latestEntry.body}</p>
                  <ChangelogAffectedLinks locale={locale} links={latestEntry.affectedLinks} />
                </aside>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-16">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{copy.updates}</p>
            {olderEntries.map((entry) => (
              <article
                key={`${entry.date}-${entry.title}`}
                className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6"
              >
                <time className="text-xs uppercase tracking-[0.28em] text-stone-500" dateTime={entry.date}>
                  {entry.date}
                </time>
                <h2 className="mt-4 text-2xl font-medium text-stone-50">{entry.title}</h2>
                <p className="mt-4 text-sm leading-8 text-stone-300">{entry.body}</p>
                <ChangelogAffectedLinks locale={locale} links={entry.affectedLinks} />
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-30 lg:self-start">
            <article className="rounded-[30px] border border-white/10 bg-black/25 p-5">
              <h2 className="text-lg font-medium text-stone-50">{copy.about}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">{copy.aboutNote}</p>
              <Link
                href={getLocalizedPath(locale, '/about')}
                prefetch={false}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#f1d492] transition hover:text-[#f7dfab]"
              >
                {copy.about}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </aside>
        </div>
      </InnerPageChrome>
    </>
  );
}
