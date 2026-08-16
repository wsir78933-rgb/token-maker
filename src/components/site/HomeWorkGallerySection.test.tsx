// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HOME_WORK_GALLERY_IMAGES } from '@/lib/home-work-gallery';
import { HomeWorkGallerySection } from './HomeWorkGallerySection';

const galleryLocales = [
  {
    locale: 'en' as const,
    eyebrow: 'Token gallery',
    title: 'See What Your Next Token Could Become',
    description:
      'Explore 54 finished designs and find inspiration across different characters, frames, and moods. Download any work you want to keep.',
    loadMoreLabel: 'View More',
    downloadLabel: 'Download work',
    artworkLabel: 'Fantasy token artwork',
    countSeparator: 'of',
  },
  {
    locale: 'zh' as const,
    eyebrow: '作品展示',
    title: '看看你的下一枚 Token，可以是什么样子',
    description: '浏览 54 个完成作品，从不同角色、边框和氛围中找到灵感。喜欢的作品也可以直接下载。',
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

afterEach(() => {
  cleanup();
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
    ({ locale, loadMoreLabel, downloadLabel, artworkLabel, countSeparator }) => {
      const countStatusFocusSpy = vi.spyOn(HTMLParagraphElement.prototype, 'focus');
      render(<HomeWorkGallerySection locale={locale} />);

      const galleryGrid = screen.getByRole('list');
      const loadMoreButton = screen.getByRole('button', { name: loadMoreLabel });

      expect(loadMoreButton.getAttribute('aria-controls')).toBe('home-work-gallery-grid');

      for (const visibleCount of [24, 36, 48]) {
        fireEvent.click(loadMoreButton);
        expect(within(galleryGrid).getAllByRole('listitem')).toHaveLength(visibleCount);
        expect(screen.getByText(`${visibleCount} ${countSeparator} 54`).getAttribute('aria-live')).toBe('polite');
      }

      loadMoreButton.focus();
      expect(document.activeElement).toBe(loadMoreButton);
      fireEvent.click(loadMoreButton);

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
