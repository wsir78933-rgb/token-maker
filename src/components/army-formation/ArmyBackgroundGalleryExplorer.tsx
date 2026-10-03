'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, Download, ExternalLink, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  armyBackgroundGalleryMaps,
  type ArmyBackgroundGalleryCategory,
  type ArmyBackgroundGalleryMap,
} from '@/lib/army-background-gallery-data';
import type { SiteLocale } from '@/lib/site-locale';

const MAPS_PER_PAGE = 12;

type GalleryCategoryFilter = ArmyBackgroundGalleryCategory | 'all';
type GallerySourceFilter = 'all' | 'dyson' | 'texttotabletop';
type GalleryMapSource = Exclude<GallerySourceFilter, 'all'>;
type GallerySortOrder = 'title-ascending' | 'title-descending';

const categoryIds: GalleryCategoryFilter[] = [
  'all',
  'outdoors',
  'settlements',
  'buildings',
  'dungeons',
  'fortifications',
  'temples',
  'regional',
  'other',
];

const categoryCounts = armyBackgroundGalleryMaps.reduce(
  (counts, map) => {
    counts[map.category] += 1;
    return counts;
  },
  {
    outdoors: 0,
    settlements: 0,
    buildings: 0,
    dungeons: 0,
    fortifications: 0,
    temples: 0,
    regional: 0,
    other: 0,
  },
);

const galleryCopy = {
  zh: {
    searchLabel: '搜索地图名称或描述',
    searchPlaceholder: '搜索地图名称或关键词',
    sourceLabel: '素材来源',
    sourceAll: '全部来源',
    sortLabel: '排序方式',
    sortAscending: '标题：A 到 Z',
    sortDescending: '标题：Z 到 A',
    results: '张地图',
    preview: '预览地图',
    downloadPreview: '下载预览图',
    viewSource: '查看来源',
    previous: '上一页',
    next: '下一页',
    page: '第',
    pageOf: '页，共',
    pages: '页',
    emptyTitle: '没有找到符合条件的地图',
    emptyBody: '试试其他关键词，或清除分类和来源筛选。',
    clearFilters: '清除筛选',
    closePreview: '关闭地图预览',
    mapSource: '素材来源',
    originalDimensions: '原图尺寸',
    categoryLabels: {
      all: '全部',
      outdoors: '户外',
      settlements: '城镇 / 街道',
      buildings: '建筑 / 室内',
      dungeons: '地牢 / 洞穴',
      fortifications: '要塞 / 防御',
      temples: '神殿 / 遗迹',
      regional: '区域 / 战略地图',
      other: '其他',
    } satisfies Record<GalleryCategoryFilter, string>,
    sources: {
      dyson: 'Dyson Logos',
      texttotabletop: 'TextToTabletop',
    } satisfies Record<GalleryMapSource, string>,
    countLabel: '张',
  },
  en: {
    searchLabel: 'Search map titles or descriptions',
    searchPlaceholder: 'Search maps or keywords',
    sourceLabel: 'Source',
    sourceAll: 'All sources',
    sortLabel: 'Sort by',
    sortAscending: 'Title: A to Z',
    sortDescending: 'Title: Z to A',
    results: 'maps',
    preview: 'Preview map',
    downloadPreview: 'Download preview',
    viewSource: 'View source',
    previous: 'Previous page',
    next: 'Next page',
    page: 'Page',
    pageOf: 'of',
    pages: 'pages',
    emptyTitle: 'No maps match those filters',
    emptyBody: 'Try another search or clear the category and source filters.',
    clearFilters: 'Clear filters',
    closePreview: 'Close map preview',
    mapSource: 'Source',
    originalDimensions: 'Original size',
    categoryLabels: {
      all: 'All maps',
      outdoors: 'Outdoors',
      settlements: 'Towns / streets',
      buildings: 'Buildings / interiors',
      dungeons: 'Dungeons / caves',
      fortifications: 'Fortifications',
      temples: 'Temples / ruins',
      regional: 'Regional / strategic',
      other: 'Other',
    } satisfies Record<GalleryCategoryFilter, string>,
    sources: {
      dyson: 'Dyson Logos',
      texttotabletop: 'TextToTabletop',
    } satisfies Record<GalleryMapSource, string>,
    countLabel: '',
  },
} as const;

function getPageNumbers(currentPage: number, pageCount: number): number[] {
  const firstPage = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const lastPage = Math.min(pageCount, firstPage + 4);

  return Array.from(
    { length: lastPage - firstPage + 1 },
    (_, pageOffset) => firstPage + pageOffset,
  );
}

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function matchesGalleryFilters(
  map: ArmyBackgroundGalleryMap,
  searchText: string,
  categoryFilter: GalleryCategoryFilter,
  sourceFilter: GallerySourceFilter,
): boolean {
  const searchableText = normalizeSearchText(
    `${map.title} ${map.description} ${map.sourceName}`,
  );

  return (
    (categoryFilter === 'all' || map.category === categoryFilter) &&
    (sourceFilter === 'all' || map.source === sourceFilter) &&
    (!searchText || searchableText.includes(searchText))
  );
}

function sortGalleryMaps(
  maps: ArmyBackgroundGalleryMap[],
  sortOrder: GallerySortOrder,
): ArmyBackgroundGalleryMap[] {
  return [...maps].sort((firstMap, secondMap) => {
    const titleComparison = firstMap.title.localeCompare(secondMap.title);
    return sortOrder === 'title-ascending' ? titleComparison : -titleComparison;
  });
}

export function ArmyBackgroundGalleryExplorer({
  locale,
}: {
  locale: SiteLocale;
}) {
  const copy = galleryCopy[locale];
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GalleryCategoryFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<GallerySourceFilter>('all');
  const [sortOrder, setSortOrder] = useState<GallerySortOrder>('title-ascending');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewMap, setPreviewMap] = useState<ArmyBackgroundGalleryMap | null>(null);

  const matchingMaps = useMemo(
    () =>
      sortGalleryMaps(
        armyBackgroundGalleryMaps.filter((map) =>
          matchesGalleryFilters(map, searchText, categoryFilter, sourceFilter),
        ),
        sortOrder,
      ),
    [categoryFilter, searchText, sortOrder, sourceFilter],
  );

  const pageCount = Math.ceil(matchingMaps.length / MAPS_PER_PAGE);
  const visibleMaps = matchingMaps.slice(
    (currentPage - 1) * MAPS_PER_PAGE,
    currentPage * MAPS_PER_PAGE,
  );

  useEffect(() => {
    if (!previewMap) return;

    const previousBodyOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewMap(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [previewMap]);

  function clearFilters() {
    setSearchText('');
    setCategoryFilter('all');
    setSourceFilter('all');
    setCurrentPage(1);
  }

  return (
    <>
      <div className="mt-8 space-y-5">
        <label className="relative block">
          <span className="sr-only">{copy.searchLabel}</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500"
          />
          <input
            type="search"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.currentTarget.value);
              setCurrentPage(1);
            }}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchLabel}
            className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-4 text-base text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-[#d7b46a]/60 focus:ring-2 focus:ring-[#d7b46a]/15"
          />
        </label>

        <div className="flex flex-wrap gap-2.5" aria-label={copy.searchLabel}>
          {categoryIds.map((categoryId) => {
            const categoryCount =
              categoryId === 'all'
                ? armyBackgroundGalleryMaps.length
                : categoryCounts[categoryId];
            const isSelected = categoryFilter === categoryId;

            return (
              <button
                key={categoryId}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setCategoryFilter(categoryId);
                  setCurrentPage(1);
                }}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
                  isSelected
                    ? 'border-[#d7b46a]/50 bg-[#d7b46a]/15 text-[#f1d492]'
                    : 'border-white/10 bg-white/[0.025] text-stone-400 hover:border-white/20 hover:text-stone-100'
                }`}
              >
                <span>{copy.categoryLabels[categoryId]}</span>
                <span className="text-xs opacity-65">{categoryCount}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <p aria-live="polite" className="text-sm text-stone-400">
            <span className="font-semibold text-stone-100">{matchingMaps.length}</span>{' '}
            {copy.results}
          </p>

          <div className="flex flex-wrap gap-3">
            <label className="flex min-w-40 flex-col gap-1.5 text-xs text-stone-500">
              {copy.sourceLabel}
              <select
                value={sourceFilter}
                onChange={(event) => {
                  setSourceFilter(event.currentTarget.value as GallerySourceFilter);
                  setCurrentPage(1);
                }}
                className="h-10 cursor-pointer rounded-xl border border-white/10 bg-[#151513] px-3 text-sm text-stone-200 outline-none focus:border-[#d7b46a]/50"
              >
                <option value="all">{copy.sourceAll}</option>
                <option value="dyson">{copy.sources.dyson}</option>
                <option value="texttotabletop">{copy.sources.texttotabletop}</option>
              </select>
            </label>

            <label className="flex min-w-40 flex-col gap-1.5 text-xs text-stone-500">
              {copy.sortLabel}
              <select
                value={sortOrder}
                onChange={(event) => {
                  setSortOrder(event.currentTarget.value as GallerySortOrder);
                  setCurrentPage(1);
                }}
                className="h-10 cursor-pointer rounded-xl border border-white/10 bg-[#151513] px-3 text-sm text-stone-200 outline-none focus:border-[#d7b46a]/50"
              >
                <option value="title-ascending">{copy.sortAscending}</option>
                <option value="title-descending">{copy.sortDescending}</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {visibleMaps.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleMaps.map((map) => (
            <article
              key={map.id}
              className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] transition duration-300 hover:border-[#d7b46a]/30 hover:bg-white/[0.04]"
            >
              <button
                type="button"
                onClick={() => setPreviewMap(map)}
                aria-label={`${copy.preview}: ${map.title}`}
                className="relative block h-56 w-full cursor-pointer overflow-hidden bg-[#111210] p-4 text-left"
              >
                <Image
                  src={map.previewSrc}
                  alt={map.title}
                  width={800}
                  height={800}
                  unoptimized
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.025]"
                />
                <span className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs text-stone-200 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                  {copy.preview}
                </span>
              </button>

              <div className="flex min-h-32 flex-col p-4">
                <h2 className="line-clamp-2 text-base font-semibold leading-6 text-stone-100">
                  {map.title}
                </h2>
                <p className="mt-1 text-xs text-stone-500">{map.sourceName}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
                  <a
                    href={map.previewSrc}
                    download={`${map.id}.webp`}
                    aria-label={`${copy.downloadPreview}: ${map.title}`}
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-xs text-[#e6c879] transition hover:text-[#f5dda0]"
                  >
                    <Download aria-hidden="true" className="h-3.5 w-3.5" />
                    {copy.downloadPreview}
                  </a>
                  <a
                    href={map.sourcePage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-xs text-[#e6c879] transition hover:text-[#f5dda0]"
                  >
                    {copy.viewSource}
                    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 px-6 py-14 text-center">
          <h2 className="font-display text-2xl text-stone-100">{copy.emptyTitle}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-400">
            {copy.emptyBody}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 cursor-pointer rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/10 px-4 py-2 text-sm text-[#f1d492] transition hover:bg-[#d7b46a]/20"
          >
            {copy.clearFilters}
          </button>
        </div>
      )}

      {pageCount > 1 ? (
        <nav
          aria-label={locale === 'zh' ? '图库分页' : 'Gallery pagination'}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 text-sm text-stone-300 transition enabled:hover:border-white/25 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.previous}</span>
          </button>

          {getPageNumbers(currentPage, pageCount).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-label={`${copy.page} ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              onClick={() => setCurrentPage(pageNumber)}
              className={`h-10 min-w-10 cursor-pointer rounded-full border px-3 text-sm transition ${
                pageNumber === currentPage
                  ? 'border-[#d7b46a]/50 bg-[#d7b46a]/15 text-[#f1d492]'
                  : 'border-white/10 text-stone-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <span className="mx-1 text-xs text-stone-500">
            {copy.page} {currentPage} {copy.pageOf} {pageCount} {copy.pages}
          </span>

          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 text-sm text-stone-300 transition enabled:hover:border-white/25 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="hidden sm:inline">{copy.next}</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </nav>
      ) : null}

      {previewMap ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="army-background-preview-title"
          onClick={() => setPreviewMap(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-5xl rounded-[28px] border border-white/12 bg-[#171816] p-4 shadow-2xl sm:p-6"
          >
            <button
              type="button"
              onClick={() => setPreviewMap(null)}
              aria-label={copy.closePreview}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/70 text-stone-200 transition hover:bg-white/10"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>

            <div className="flex min-h-[45vh] items-center justify-center rounded-[20px] bg-[#0d0e0d] p-3 sm:min-h-[58vh] sm:p-6">
              <Image
                src={previewMap.previewSrc}
                alt={previewMap.title}
                width={800}
                height={800}
                unoptimized
                className="max-h-[58vh] w-full object-contain sm:max-h-[68vh]"
              />
            </div>

            <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h2
                  id="army-background-preview-title"
                  className="pr-12 font-display text-2xl text-stone-100 sm:text-3xl"
                >
                  {previewMap.title}
                </h2>
                <p className="mt-2 text-sm text-stone-400">
                  {copy.mapSource}: {previewMap.sourceName}
                  {previewMap.originalDimensions
                    ? ` · ${copy.originalDimensions}: ${previewMap.originalDimensions}px`
                    : ''}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <a
                  href={previewMap.previewSrc}
                  download={`${previewMap.id}.webp`}
                  aria-label={`${copy.downloadPreview}: ${previewMap.title}`}
                  className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/10 px-4 py-2.5 text-sm text-[#f1d492] transition hover:bg-[#d7b46a]/20"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  {copy.downloadPreview}
                </a>
                <a
                  href={previewMap.sourcePage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/10 px-4 py-2.5 text-sm text-[#f1d492] transition hover:bg-[#d7b46a]/20"
                >
                  {copy.viewSource}
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
