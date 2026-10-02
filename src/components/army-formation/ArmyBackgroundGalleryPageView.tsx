import Link from 'next/link';

import { ArmyBackgroundGalleryExplorer } from '@/components/army-formation/ArmyBackgroundGalleryExplorer';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { armyBackgroundGalleryMaps } from '@/lib/army-background-gallery-data';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const currentPath = '/army-formation-creator/backgrounds';

const pageCopy = {
  zh: {
    breadcrumbTool: '军阵编辑器',
    breadcrumbGallery: '背景素材库',
    eyebrow: '战场地图收藏',
    title: '军阵背景素材库',
    description: '浏览、搜索并预览收集到的战场地图，按地形和来源快速找到适合军阵的背景。',
    backToTool: '返回军阵编辑器',
    collection: '张地图',
    dysonAttribution: 'Dyson Logos 地图允许商业用途，使用时需标注 “Maps by Dyson Logos”。',
    sourceLinks: '每张地图都提供原始来源页面；TextToTabletop 地图链接至其公开图库条目。',
  },
  en: {
    breadcrumbTool: 'Army Formation Creator',
    breadcrumbGallery: 'Background library',
    eyebrow: 'Battle map collection',
    title: 'Battle Map Background Library',
    description: 'Browse, search, and preview collected battle maps. Filter by terrain and source to find a fitting backdrop for your formation.',
    backToTool: 'Return to Army Formation Creator',
    collection: 'maps',
    dysonAttribution: 'Dyson Logos maps allow commercial use with attribution: “Maps by Dyson Logos.”',
    sourceLinks: 'Each map links to its original source page. TextToTabletop maps link to their public gallery entries.',
  },
} as const;

const dysonMapCount = armyBackgroundGalleryMaps.filter((map) => map.source === 'dyson').length;
const textToTabletopMapCount = armyBackgroundGalleryMaps.filter(
  (map) => map.source === 'texttotabletop',
).length;

export function ArmyBackgroundGalleryPageView({
  locale,
}: {
  locale: SiteLocale;
}) {
  const copy = pageCopy[locale];
  const numberFormatter = new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US');

  return (
    <InnerPageChrome locale={locale} currentPath={currentPath} tone="hub">
      <div className="mx-auto max-w-[82rem] px-5 py-8 lg:px-8 lg:py-10">
        <PageBreadcrumbs
          locale={locale}
          items={[
            {
              label: copy.breadcrumbTool,
              href: getLocalizedPath(locale, '/army-formation-creator'),
            },
            { label: copy.breadcrumbGallery },
          ]}
        />

        <header className="mt-8 border-b border-white/10 pb-7 sm:mt-10 sm:pb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b46a]">
            {copy.eyebrow}
          </p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl text-stone-50 sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-400 sm:text-lg sm:leading-8">
                {copy.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/10 px-3.5 py-2 text-sm text-[#f1d492]">
                {numberFormatter.format(armyBackgroundGalleryMaps.length)} {copy.collection}
              </span>
              <Link
                href={getLocalizedPath(locale, '/army-formation-creator')}
                className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-white/12 px-4 py-2 text-sm text-stone-300 transition hover:border-white/25 hover:text-white"
              >
                {copy.backToTool}
              </Link>
            </div>
          </div>
        </header>

        <section aria-label={locale === 'zh' ? '背景地图图库' : 'Background map gallery'}>
          <ArmyBackgroundGalleryExplorer locale={locale} />
        </section>

        <aside className="mt-10 rounded-[22px] border border-white/8 bg-black/20 px-5 py-5 text-sm leading-6 text-stone-400 sm:px-6">
          <p className="font-medium text-stone-200">
            {locale === 'zh' ? '素材来源与署名' : 'Sources and attribution'}
          </p>
          <p className="mt-2">
            <a
              href="https://dysonlogos.blog/about/copyright/"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-[#e6c879] underline decoration-white/20 underline-offset-4 hover:text-[#f5dda0]"
            >
              {copy.dysonAttribution}
            </a>{' '}
            {locale === 'zh' ? '当前图库收录' : 'This gallery includes'}{' '}
            {numberFormatter.format(dysonMapCount)} {locale === 'zh' ? '张 Dyson Logos 地图和' : 'Dyson Logos maps and'}{' '}
            {numberFormatter.format(textToTabletopMapCount)} {locale === 'zh' ? '张 TextToTabletop 地图。' : 'TextToTabletop maps.'}
          </p>
          <p className="mt-1.5">
            <a
              href="https://www.texttotabletop.com/gallery"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-[#e6c879] underline decoration-white/20 underline-offset-4 hover:text-[#f5dda0]"
            >
              {copy.sourceLinks}
            </a>
          </p>
        </aside>
      </div>
    </InnerPageChrome>
  );
}
