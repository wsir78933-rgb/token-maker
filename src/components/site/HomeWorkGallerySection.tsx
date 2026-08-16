'use client';

import Image, { getImageProps } from 'next/image';
import { Download, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  HOME_WORK_GALLERY_BATCH_SIZE,
  HOME_WORK_GALLERY_IMAGES,
  HOME_WORK_GALLERY_INITIAL_COUNT,
  getHomeWorkGalleryCopy,
} from '@/lib/home-work-gallery';
import type { HomeWorkGalleryImage } from '@/lib/home-work-gallery';
import type { SiteLocale } from '@/lib/site-locale';

const galleryImageSizes = '(min-width: 1024px) 16.666vw, (min-width: 768px) 33.333vw, 50vw';
const HOME_WORK_GALLERY_PRELOAD_DELAY_MS = 1000;

function preloadGalleryImages(galleryImages: readonly HomeWorkGalleryImage[]) {
  for (const galleryImage of galleryImages) {
    const { props: responsiveImageProps } = getImageProps({
      src: galleryImage.src,
      alt: '',
      width: galleryImage.width,
      height: galleryImage.height,
      sizes: galleryImageSizes,
    });

    if (responsiveImageProps.sizes === undefined || responsiveImageProps.srcSet === undefined) {
      throw new Error(`Missing responsive preload props for gallery image: ${galleryImage.src}`);
    }

    const preloadedImage = new window.Image();
    preloadedImage.sizes = responsiveImageProps.sizes;
    preloadedImage.srcset = responsiveImageProps.srcSet;
    preloadedImage.src = responsiveImageProps.src;
  }
}

function waitForGalleryPreloadDelay(galleryPreloadDelayTimerRef: { current: number | null }) {
  return new Promise<void>((resolve) => {
    galleryPreloadDelayTimerRef.current = window.setTimeout(() => {
      galleryPreloadDelayTimerRef.current = null;
      resolve();
    }, HOME_WORK_GALLERY_PRELOAD_DELAY_MS);
  });
}

export function HomeWorkGallerySection({ locale }: { locale: SiteLocale }) {
  const [visibleWorkCount, setVisibleWorkCount] = useState(HOME_WORK_GALLERY_INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const countStatusRef = useRef<HTMLParagraphElement>(null);
  const galleryPreloadDelayTimerRef = useRef<number | null>(null);
  const copy = getHomeWorkGalleryCopy(locale);
  const visibleWorks = HOME_WORK_GALLERY_IMAGES.slice(0, visibleWorkCount);
  const totalWorkCount = HOME_WORK_GALLERY_IMAGES.length;

  useEffect(() => {
    const galleryPreloadDelayTimer = galleryPreloadDelayTimerRef;

    return () => {
      if (galleryPreloadDelayTimer.current !== null) {
        window.clearTimeout(galleryPreloadDelayTimer.current);
      }
    };
  }, []);

  async function showMoreWorks() {
    if (isLoadingMore) {
      return;
    }

    const nextVisibleWorkCount = Math.min(
      visibleWorkCount + HOME_WORK_GALLERY_BATCH_SIZE,
      totalWorkCount,
    );

    setIsLoadingMore(true);
    preloadGalleryImages(HOME_WORK_GALLERY_IMAGES.slice(visibleWorkCount, nextVisibleWorkCount));
    await waitForGalleryPreloadDelay(galleryPreloadDelayTimerRef);

    if (nextVisibleWorkCount === totalWorkCount) {
      countStatusRef.current?.focus({ preventScroll: true });
    }

    setVisibleWorkCount(nextVisibleWorkCount);
    setIsLoadingMore(false);
  }

  return (
    <section data-testid="home-work-gallery" className="border-y border-white/8 bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d7b46a]">{copy.eyebrow}</p>
            <h2 className="mt-4 text-balance font-display text-3xl text-stone-50 sm:text-4xl lg:text-5xl">{copy.title}</h2>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-stone-300 sm:text-base">{copy.description}</p>
          </div>
          <p
            ref={countStatusRef}
            aria-live="polite"
            tabIndex={-1}
            className="text-xs uppercase tracking-[0.24em] text-stone-400"
          >
            {visibleWorkCount} {copy.countSeparator} {totalWorkCount}
          </p>
        </div>

        <ul id="home-work-gallery-grid" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {visibleWorks.map((work, workIndex) => {
            const workLabel = `${copy.artworkLabel} ${workIndex + 1}`;

            return (
              <li key={work.id} className="group relative aspect-square overflow-hidden border border-white/10 bg-black/35">
                <Image
                  src={work.src}
                  alt={workLabel}
                  width={work.width}
                  height={work.height}
                  sizes={galleryImageSizes}
                  className="h-full w-full object-cover object-center"
                />
                <a
                  href={work.src}
                  download
                  aria-label={`${copy.downloadLabel}: ${workLabel}`}
                  className="absolute bottom-2 right-2 inline-flex size-10 items-center justify-center border border-white/20 bg-black/75 text-[#f1d492] opacity-100 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d492] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                </a>
              </li>
            );
          })}
        </ul>

        {visibleWorkCount < totalWorkCount ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="site-cta-primary"
              aria-controls="home-work-gallery-grid"
              aria-label={copy.loadMoreLabel}
              aria-busy={isLoadingMore}
              disabled={isLoadingMore}
              onClick={showMoreWorks}
              style={isLoadingMore ? { width: '2.75rem', height: '2.75rem', padding: 0 } : undefined}
            >
              {isLoadingMore ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" /> : copy.loadMoreLabel}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
