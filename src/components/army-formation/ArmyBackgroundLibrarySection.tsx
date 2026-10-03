import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import {
  ArmyBackgroundShuffleGrid,
  type ArmyBackgroundPreview,
} from '@/components/army-formation/ArmyBackgroundShuffleGrid';
import { armyBackgroundGalleryMaps } from '@/lib/army-background-gallery-data';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const featuredMapIds = [
  'dyson-263', 'dyson-359', 'dyson-001', 'dyson-600',
  'dyson-625', 'dyson-018', 'dyson-303', 'dyson-037',
  'dyson-043', 'dyson-508', 'dyson-603', 'dyson-653',
  'dyson-514', 'dyson-110', 'dyson-656', 'dyson-251',
] as const;

const sectionCopy = {
  zh: {
    collection: '张背景地图，已经为你备好',
    title: '为军阵挑选背景地图',
    description: '从森林、城镇到地牢与遗迹，找到适合这次遭遇战的场景。进入素材库筛选、预览和下载，再将选好的背景上传到军阵编辑器。',
    browseLibrary: '浏览背景素材库',
    previewLabel: '素材库中的 16 张背景地图预览',
  },
  en: {
    collection: 'background maps are already available',
    title: 'Find your next battlefield',
    description: 'Set the scene with forests, towns, dungeons, and ruins. Browse the library to filter, preview, and download a map, then upload your chosen background to the formation editor.',
    browseLibrary: 'Browse background library',
    previewLabel: 'Preview of 16 background maps from the library',
  },
} as const;

function listFeaturedBackgroundPreviews(): ArmyBackgroundPreview[] {
  return featuredMapIds.map((mapId) => {
    const backgroundMap = armyBackgroundGalleryMaps.find((map) => map.id === mapId);

    if (!backgroundMap) {
      throw new Error(`Army background library featured map is missing, received id: ${JSON.stringify(mapId)}.`);
    }

    return { id: backgroundMap.id, previewSrc: backgroundMap.previewSrc };
  });
}

export function ArmyBackgroundLibrarySection({ locale }: { locale: SiteLocale }) {
  const copy = sectionCopy[locale];
  const numberFormatter = new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US');

  return (
    <section
      id="army-background-library"
      aria-labelledby="army-background-library-title"
      className="mt-24 grid w-full grid-cols-1 items-center gap-8 py-12 sm:mt-28 md:grid-cols-2 lg:mt-32"
    >
      <div>
        <p className="mb-4 text-xs font-medium text-[var(--site-accent-strong)] md:text-sm">
          {numberFormatter.format(armyBackgroundGalleryMaps.length)} {copy.collection}
        </p>
        <h2
          id="army-background-library-title"
          className="font-display text-4xl font-semibold leading-tight tracking-tight text-stone-50 text-balance md:text-5xl lg:text-6xl"
        >
          {copy.title}
        </h2>
        <p className="my-4 text-base leading-7 text-stone-300 text-pretty md:my-6 md:text-lg md:leading-8">
          {copy.description}
        </p>
        <Link
          href={getLocalizedPath(locale, '/army-formation-creator/backgrounds')}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-[#d7b46a] px-5 py-3 text-sm font-medium text-[#15130d] transition hover:bg-[#e6c879] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--site-accent-strong)]"
        >
          {copy.browseLibrary}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <ArmyBackgroundShuffleGrid previews={listFeaturedBackgroundPreviews()} label={copy.previewLabel} />
    </section>
  );
}
