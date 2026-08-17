// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HOME_WORK_GALLERY_IMAGES } from '@/lib/home-work-gallery';
import { HomeWorkGallerySection } from './HomeWorkGallerySection';

const galleryLocales = [
  {
    locale: 'en' as const,
    eyebrow: 'Token gallery',
    title: 'Find a Token You Want to Drop Into Your Campaign',
    description:
      'Explore 54 ready-made results across heroes, monsters, borders, and visual styles. When one fits your campaign, download it directly and bring it to the table.',
    loadMoreLabel: 'View More',
    downloadLabel: 'Download work',
    artworkLabel: 'Fantasy token artwork',
    countSeparator: 'of',
  },
  {
    locale: 'zh' as const,
    eyebrow: '作品展示',
    title: '找到一枚让你想立刻带进战役的 Token',
    description:
      '从 54 个英雄、怪物、边框和视觉风格各异的成品中寻找灵感。遇到适合自己战役的作品，可以直接下载并带到跑团桌上。',
    loadMoreLabel: '查看更多',
    downloadLabel: '下载作品',
    artworkLabel: '奇幻 Token 作品',
    countSeparator: '/',
  },
] as const;

const initialWorkGalleryPaths = [
  '/work-gallery/-CHRu5fo-1.png',
  '/work-gallery/-H4obUacwq.png',
  '/work-gallery/-J-dX21qv_.png',
  '/work-gallery/-S78ERrRn-.png',
  '/work-gallery/-YtfWbsZBu.png',
  '/work-gallery/-kMpbrlqs2.png',
  '/work-gallery/-oR8l_VTsQ.png',
  '/work-gallery/04I6TlEWQP.png',
  '/work-gallery/0HCPcqWx2d.png',
  '/work-gallery/0Mu4b0sBAY.png',
  '/work-gallery/0NM7e8o0aJ.png',
  '/work-gallery/0_IaTVSOa0.png',
];

const nextOptimizedWorkGallerySources = [
  '/_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F0k-6UsJzfB.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F0yJc-ZgsHP.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F1AWcSOmW1a.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F1irw8Z5hC1.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F22t2gS4KtX.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F2943TclzYk.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F2dUk1xDhem.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F3_5ByLuSkp.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F3uLXUQNVJv.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F4f8zZkiHbB.png&w=3840&q=75',
  '/_next/image?url=%2Fwork-gallery%2F6A4e-G8MAO.png&w=3840&q=75',
];

const workGalleryImageSizes = '(min-width: 1024px) 16.666vw, (min-width: 768px) 33.333vw, 50vw';
const firstNextWorkGallerySrcSet =
  '/_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=384&q=75 384w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=640&q=75 640w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=750&q=75 750w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=828&q=75 828w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=1080&q=75 1080w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=1200&q=75 1200w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=1920&q=75 1920w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=2048&q=75 2048w, /_next/image?url=%2Fwork-gallery%2F0bmBL-1G0X.png&w=3840&q=75 3840w';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('HomeWorkGallerySection', () => {
  it.each(galleryLocales)(
    'renders the initial gallery and localized content for $locale',
    ({ locale, eyebrow, title, description, downloadLabel, artworkLabel, countSeparator }) => {
      render(<HomeWorkGallerySection locale={locale} />);

      const gallerySection = screen.getByTestId('home-work-gallery');
      const galleryGrid = within(gallerySection).getByRole('list');
      const downloadLinks = within(gallerySection).getAllByRole('link', {
        name: new RegExp(`^${downloadLabel}: ${artworkLabel}`),
      });

      expect(within(gallerySection).getByText(eyebrow)).toBeTruthy();
      const galleryTitle = within(gallerySection).getByRole('heading', { name: title });
      const galleryDescription = within(gallerySection).getByText(description);

      expect(galleryTitle.className).toContain('text-balance');
      expect(galleryDescription.className).toContain('text-pretty');
      expect(galleryGrid.id).toBe('home-work-gallery-grid');
      expect(galleryGrid.className).toContain('grid-cols-2');
      expect(galleryGrid.className).toContain('md:grid-cols-3');
      expect(galleryGrid.className).toContain('lg:grid-cols-6');
      expect(within(galleryGrid).getAllByRole('listitem')).toHaveLength(12);
      expect(within(galleryGrid).getAllByRole('img')).toHaveLength(12);
      expect(downloadLinks).toHaveLength(12);
      expect(downloadLinks.map((downloadLink) => downloadLink.getAttribute('href'))).toEqual(initialWorkGalleryPaths);
      expect(downloadLinks.every((downloadLink) => downloadLink.hasAttribute('download'))).toBe(true);
      expect(within(gallerySection).getByText(`12 ${countSeparator} 54`).getAttribute('aria-live')).toBe('polite');
    },
  );

  it.each(galleryLocales)(
    'reveals each remaining gallery batch and removes the control at the $locale boundary',
    async ({ locale, loadMoreLabel, downloadLabel, artworkLabel, countSeparator }) => {
      vi.useFakeTimers();
      const countStatusFocusSpy = vi.spyOn(HTMLParagraphElement.prototype, 'focus');
      render(<HomeWorkGallerySection locale={locale} />);

      const galleryGrid = screen.getByRole('list');
      const loadMoreButton = screen.getByRole('button', { name: loadMoreLabel });

      expect(loadMoreButton.getAttribute('aria-controls')).toBe('home-work-gallery-grid');

      for (const visibleCount of [24, 36, 48]) {
        fireEvent.click(loadMoreButton);
        await act(async () => {
          await vi.advanceTimersByTimeAsync(1000);
        });
        expect(within(galleryGrid).getAllByRole('listitem')).toHaveLength(visibleCount);
        expect(screen.getByText(`${visibleCount} ${countSeparator} 54`).getAttribute('aria-live')).toBe('polite');
      }

      loadMoreButton.focus();
      expect(document.activeElement).toBe(loadMoreButton);
      fireEvent.click(loadMoreButton);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      const completeCountStatus = screen.getByText(`54 ${countSeparator} 54`);
      const completeDownloadLinks = within(galleryGrid).getAllByRole('link', {
        name: new RegExp(`^${downloadLabel}: ${artworkLabel}`),
      });

      expect(within(galleryGrid).getAllByRole('listitem')).toHaveLength(54);
      expect(completeDownloadLinks).toHaveLength(54);
      expect(completeDownloadLinks.map((downloadLink) => downloadLink.getAttribute('href'))).toEqual(
        HOME_WORK_GALLERY_IMAGES.map((work) => work.src),
      );
      expect(completeDownloadLinks.every((downloadLink) => downloadLink.hasAttribute('download'))).toBe(true);
      expect(completeCountStatus.getAttribute('aria-live')).toBe('polite');
      expect(screen.queryByRole('button', { name: loadMoreLabel })).toBeNull();
      expect(document.activeElement).toBe(completeCountStatus);
      expect(countStatusFocusSpy).toHaveBeenCalledWith({ preventScroll: true });
    },
  );

  it.each(galleryLocales)(
    'preloads the next localized gallery batch while delaying its reveal for $locale',
    async ({ locale, loadMoreLabel }) => {
      vi.useFakeTimers();
      const preloadedImageRecords: Array<{ sizes: string; srcset: string; src: string }> = [];
      const preloadImageAssignmentProperties: string[] = [];

      class TestPreloadedImage {
        private readonly preloadImageRecord = { sizes: '', srcset: '', src: '' };

        constructor() {
          preloadedImageRecords.push(this.preloadImageRecord);
        }

        set sizes(imageSizes: string) {
          preloadImageAssignmentProperties.push('sizes');
          this.preloadImageRecord.sizes = imageSizes;
        }

        set srcset(imageSrcSet: string) {
          preloadImageAssignmentProperties.push('srcset');
          this.preloadImageRecord.srcset = imageSrcSet;
        }

        set src(imageSource: string) {
          preloadImageAssignmentProperties.push('src');
          this.preloadImageRecord.src = imageSource;
        }
      }

      vi.stubGlobal('Image', TestPreloadedImage);
      render(<HomeWorkGallerySection locale={locale} />);

      const galleryGrid = screen.getByRole('list');
      const loadMoreButton = screen.getByRole('button', { name: loadMoreLabel });

      fireEvent.click(loadMoreButton);

      expect(loadMoreButton.hasAttribute('disabled')).toBe(true);
      expect(loadMoreButton.getAttribute('aria-busy')).toBe('true');
      expect(loadMoreButton.getAttribute('aria-label')).toBe(loadMoreLabel);
      expect(loadMoreButton.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
      expect(loadMoreButton.style.width).toBe('2.75rem');
      expect(loadMoreButton.style.height).toBe('2.75rem');
      expect(within(galleryGrid).getAllByRole('listitem')).toHaveLength(12);
      expect(preloadedImageRecords.map((preloadedImageRecord) => preloadedImageRecord.src)).toEqual(
        nextOptimizedWorkGallerySources,
      );
      expect(preloadedImageRecords[0]).toEqual({
        sizes: workGalleryImageSizes,
        srcset: firstNextWorkGallerySrcSet,
        src: nextOptimizedWorkGallerySources[0],
      });
      expect(preloadImageAssignmentProperties).toEqual(
        Array.from({ length: 12 }, () => ['sizes', 'srcset', 'src']).flat(),
      );

      const preloadImageRecordsBeforeDuplicateClick = preloadedImageRecords.map((preloadedImageRecord) => ({
        ...preloadedImageRecord,
      }));
      const pendingTimerCountBeforeDuplicateClick = vi.getTimerCount();

      fireEvent.click(loadMoreButton);
      expect(preloadedImageRecords).toEqual(preloadImageRecordsBeforeDuplicateClick);
      expect(vi.getTimerCount()).toBe(pendingTimerCountBeforeDuplicateClick);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(999);
      });

      expect(within(galleryGrid).getAllByRole('listitem')).toHaveLength(12);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });

      expect(within(galleryGrid).getAllByRole('listitem')).toHaveLength(24);
      expect(loadMoreButton.hasAttribute('disabled')).toBe(false);
      expect(loadMoreButton.getAttribute('aria-busy')).toBe('false');
      expect(loadMoreButton.textContent).toBe(loadMoreLabel);
      expect(loadMoreButton.style.width).toBe('');
      expect(loadMoreButton.style.height).toBe('');
      expect(loadMoreButton.style.padding).toBe('');
    },
  );

  it('cancels a pending gallery reveal when unmounted', () => {
    vi.useFakeTimers();
    const { unmount } = render(<HomeWorkGallerySection locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'View More' }));
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(galleryLocales)(
    'uses square display cards and ordinal download labels for $locale',
    ({ locale, downloadLabel, artworkLabel }) => {
      render(<HomeWorkGallerySection locale={locale} />);

      const gallerySection = screen.getByTestId('home-work-gallery');
      const galleryCards = within(gallerySection).getAllByRole('listitem');
      const galleryImages = within(gallerySection).getAllByRole('img');
      const firstDownloadLink = within(gallerySection).getByRole('link', {
        name: `${downloadLabel}: ${artworkLabel} 1`,
      });

      expect(galleryCards.every((galleryCard) => galleryCard.className.includes('aspect-square'))).toBe(true);
      expect(galleryCards.every((galleryCard) => !galleryCard.className.includes('aspect-[1200/630]'))).toBe(true);
      expect(galleryImages.map((galleryImage) => galleryImage.getAttribute('alt'))).toEqual([
        `${artworkLabel} 1`,
        `${artworkLabel} 2`,
        `${artworkLabel} 3`,
        `${artworkLabel} 4`,
        `${artworkLabel} 5`,
        `${artworkLabel} 6`,
        `${artworkLabel} 7`,
        `${artworkLabel} 8`,
        `${artworkLabel} 9`,
        `${artworkLabel} 10`,
        `${artworkLabel} 11`,
        `${artworkLabel} 12`,
      ]);
      expect(galleryImages.every((galleryImage) => galleryImage.getAttribute('width') === '1200')).toBe(true);
      expect(galleryImages.every((galleryImage) => galleryImage.getAttribute('height') === '630')).toBe(true);
      expect(
        galleryImages.every(
          (galleryImage) =>
            galleryImage.getAttribute('sizes') ===
            '(min-width: 1024px) 16.666vw, (min-width: 768px) 33.333vw, 50vw',
        ),
      ).toBe(true);
      expect(galleryImages.every((galleryImage) => galleryImage.className.includes('object-cover'))).toBe(true);
      expect(galleryImages.every((galleryImage) => galleryImage.className.includes('object-center'))).toBe(true);
      expect(firstDownloadLink.getAttribute('href')).toBe('/work-gallery/-CHRu5fo-1.png');
      expect(firstDownloadLink.hasAttribute('download')).toBe(true);
      expect(firstDownloadLink.className).toContain('size-10');
      expect(firstDownloadLink.className).toContain('opacity-100');
      expect(firstDownloadLink.className).toContain('lg:opacity-0');
      expect(firstDownloadLink.className).toContain('lg:group-hover:opacity-100');
      expect(firstDownloadLink.className).toContain('lg:group-focus-within:opacity-100');
      expect(firstDownloadLink.className).toContain('transition-opacity');
      expect(firstDownloadLink.className).toContain('duration-200');
      expect(firstDownloadLink.className).toContain('focus-visible:outline-2');
      expect(within(gallerySection).queryByRole('link', { name: /-CHRu5fo-1/ })).toBeNull();
    },
  );
});
