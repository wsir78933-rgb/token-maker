// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import sharp from 'sharp';

import { MapMakerShowcase } from '@/components/map-maker/MapMakerShowcase';
import { getMapMakerPageCopy } from '@/lib/map-maker/page-copy';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

const EXPECTED_GROUP_IDS = [
  'regional-adventures',
  'coastal-voyages',
  'fantasy-worlds',
] as const;

const EXPECTED_IMAGE_POSITIONS = ['left', 'right', 'left'] as const;

const EXPECTED_IMAGE_SOURCES = [
  '/map-maker/examples/01-greenvale-frontier.webp',
  '/map-maker/examples/03-crownpeak-pass.webp',
  '/map-maker/examples/05-ancient-temple.webp',
  '/map-maker/examples/06-desert-oasis.webp',
  '/map-maker/examples/04-twin-fort-bay.webp',
  '/map-maker/examples/07-corsair-isles.webp',
  '/map-maker/examples/08-wreckers-coast.webp',
  '/map-maker/examples/09-leviathan-strait.webp',
  '/map-maker/examples/02-world-tree-sanctuary.webp',
  '/map-maker/examples/10-silverbay-kingdom.webp',
  '/map-maker/examples/11-sea-of-crowns.webp',
  '/map-maker/examples/12-two-continents.webp',
] as const;

const EXPECTED_CAROUSEL_SIZES =
  '(min-width: 936px) 376px, (min-width: 768px) calc(50vw - 92px), calc(100vw - 104px)';

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((media: string) => ({
      matches: false,
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function requireValidMapMakerWebp(sourcePath: string, expectedWidth: number): Promise<void> {
  if (!/^\/map-maker\/examples\/(?:(?:640|1024|1536)\/)?[^/]+\.webp$/.test(sourcePath)) {
    throw new Error(`Map maker showcase image path is invalid. Received ${JSON.stringify(sourcePath)}.`);
  }

  const imagePath = resolve(process.cwd(), 'public', sourcePath.slice(1));
  const metadata = await sharp(readFileSync(imagePath)).metadata();
  const expectedHeight = Math.round((expectedWidth * 9) / 16);

  if (metadata.format !== 'webp' || metadata.width !== expectedWidth || metadata.height !== expectedHeight) {
    throw new Error(
      `Map maker showcase image ${JSON.stringify(sourcePath)} must be ${expectedWidth}x${expectedHeight} WebP. Received format=${JSON.stringify(metadata.format)}, dimensions=${metadata.width}x${metadata.height}.`,
    );
  }
}

function requireMapMakerCarousel(groupElement: HTMLElement, groupId: string): HTMLElement {
  const carousel = groupElement.querySelector<HTMLElement>('[data-circular-testimonials="true"]');
  if (carousel === null) {
    throw new Error(`Map maker showcase group ${JSON.stringify(groupId)} has no carousel.`);
  }

  return carousel;
}

describe('MapMakerShowcase', () => {
  it('keeps the approved bilingual group and image order with twelve valid responsive WebP image sets', async () => {
    const localizedCopies = (['en', 'zh'] as const).map((locale) => ({
      locale,
      showcase: getMapMakerPageCopy(locale).showcase,
    }));

    const englishSources = localizedCopies[0]?.showcase.groups.flatMap((group) =>
      group.cases.map((mapCase) => mapCase.src),
    );
    const chineseSources = localizedCopies[1]?.showcase.groups.flatMap((group) =>
      group.cases.map((mapCase) => mapCase.src),
    );
    const imageSourceFields = (locale: 'en' | 'zh') =>
      localizedCopies.find((copy) => copy.locale === locale)?.showcase.groups.flatMap((group) =>
        group.cases.map(({ src, carouselSrc, carouselSrcSet, carouselSizes }) => ({
          src,
          carouselSrc,
          carouselSrcSet,
          carouselSizes,
        })),
      );
    if (englishSources === undefined || chineseSources === undefined) {
      throw new Error('Map maker showcase test expected English and Chinese copy.');
    }

    expect(englishSources).toEqual(EXPECTED_IMAGE_SOURCES);
    expect(chineseSources).toEqual(englishSources);
    expect(new Set(englishSources).size).toBe(12);
    expect(imageSourceFields('zh')).toEqual(imageSourceFields('en'));

    const englishCases = localizedCopies[0]?.showcase.groups.flatMap((group) => group.cases);
    if (englishCases === undefined) {
      throw new Error('Map maker showcase test expected English map cases.');
    }

    for (const mapCase of englishCases) {
      const imageName = mapCase.src.split('/').at(-1);
      if (imageName === undefined) {
        throw new Error(`Map maker showcase source has no filename: ${JSON.stringify(mapCase.src)}.`);
      }

      expect(mapCase.carouselSrc).toBe(`/map-maker/examples/640/${imageName}`);
      expect(mapCase.carouselSrcSet).toBe(
        [640, 1024, 1536]
          .map((width) => `/map-maker/examples/${width}/${imageName} ${width}w`)
          .join(', '),
      );
      expect(mapCase.carouselSizes).toBe(EXPECTED_CAROUSEL_SIZES);

      await requireValidMapMakerWebp(mapCase.src, 2240);
      await requireValidMapMakerWebp(mapCase.carouselSrc, 640);
      for (const width of [1024, 1536]) {
        await requireValidMapMakerWebp(`/map-maker/examples/${width}/${imageName}`, width);
      }
    }

    localizedCopies.forEach(({ locale, showcase }) => {
      expect(showcase.groups.map((group) => group.id)).toEqual(EXPECTED_GROUP_IDS);
      expect(showcase.groups.map((group) => group.imagePosition)).toEqual(EXPECTED_IMAGE_POSITIONS);
      expect(showcase.groups.map((group) => group.cases.length)).toEqual([4, 4, 4]);

      showcase.groups.flatMap((group) => group.cases).forEach((mapCase) => {
        if (mapCase.name.trim().length === 0 || mapCase.alt.trim().length === 0) {
          throw new Error(
            `Map maker showcase case must have a name and image description for ${JSON.stringify(locale)}. Received name=${JSON.stringify(mapCase.name)}, alt=${JSON.stringify(mapCase.alt)}.`,
          );
        }
      });
    });
  });

  it.each(['en', 'zh'] as const)(
    'renders three independent four-map carousels with the approved image order for %s',
    async (locale) => {
      const copy = getMapMakerPageCopy(locale).showcase;
      render(<MapMakerShowcase copy={copy} />);

      const showcaseSection = screen.getByTestId('map-maker-showcase');
      expect(showcaseSection.tagName).toBe('SECTION');
      expect(within(showcaseSection).getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();

      const groupElements = EXPECTED_GROUP_IDS.map((groupId) =>
        within(showcaseSection).getByTestId(`map-maker-showcase-group-${groupId}`),
      );
      expect(groupElements).toHaveLength(3);

      copy.groups.forEach((groupCopy, groupIndex) => {
        const groupElement = groupElements[groupIndex];
        if (groupElement === undefined) {
          throw new Error(`Map maker showcase group is missing at index ${groupIndex}.`);
        }

        expect(within(groupElement).getByRole('heading', { level: 3, name: groupCopy.title })).toBeTruthy();
        const carousel = requireMapMakerCarousel(groupElement, groupCopy.id);
        expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
        const renderedImages = Array.from(carousel.querySelectorAll<HTMLImageElement>('img'));
        expect(renderedImages.map((image) => image.getAttribute('src'))).toEqual(
          groupCopy.cases.map((mapCase) => mapCase.carouselSrc),
        );
        renderedImages.forEach((image, imageIndex) => {
          const mapCase = groupCopy.cases[imageIndex];
          if (mapCase === undefined) {
            throw new Error(`Map maker showcase rendered an unexpected image at index ${imageIndex}.`);
          }

          expect(image.getAttribute('srcset')).toBe(mapCase.carouselSrcSet);
          expect(image.getAttribute('sizes')).toBe(mapCase.carouselSizes);
          expect(image.getAttribute('loading')).toBeNull();
        });

        const firstCase = groupCopy.cases[0];
        if (firstCase === undefined) {
          throw new Error(`Map maker showcase group ${JSON.stringify(groupCopy.id)} has no first case.`);
        }

        expect(within(carousel).getByRole('heading', { level: 3, name: firstCase.name })).toBeTruthy();
      });

      const firstGroup = copy.groups[0];
      const secondGroup = copy.groups[1];
      const thirdGroup = copy.groups[2];
      if (firstGroup === undefined || secondGroup === undefined || thirdGroup === undefined) {
        throw new Error(`Map maker showcase requires three groups. Received ${copy.groups.length}.`);
      }

      const firstGroupElement = groupElements[0];
      const secondGroupElement = groupElements[1];
      const thirdGroupElement = groupElements[2];
      if (firstGroupElement === undefined || secondGroupElement === undefined || thirdGroupElement === undefined) {
        throw new Error(`Map maker showcase group elements are incomplete. Received ${groupElements.length}.`);
      }

      const firstCarousel = requireMapMakerCarousel(firstGroupElement, firstGroup.id);
      const secondCarousel = requireMapMakerCarousel(secondGroupElement, secondGroup.id);
      const thirdCarousel = requireMapMakerCarousel(thirdGroupElement, thirdGroup.id);
      const secondCase = firstGroup.cases[1];
      const firstSecondGroupCase = secondGroup.cases[0];
      const firstThirdGroupCase = thirdGroup.cases[0];
      if (secondCase === undefined || firstSecondGroupCase === undefined || firstThirdGroupCase === undefined) {
        throw new Error('Map maker showcase test expected a second first-group case and one case in each other group.');
      }

      fireEvent.click(within(firstCarousel).getByRole('button', { name: copy.nextLabel }));
      await waitFor(() => {
        expect(within(firstCarousel).getByRole('heading', { level: 3, name: secondCase.name })).toBeTruthy();
      });
      expect(within(secondCarousel).getByRole('heading', { level: 3, name: firstSecondGroupCase.name })).toBeTruthy();
      expect(within(thirdCarousel).getByRole('heading', { level: 3, name: firstThirdGroupCase.name })).toBeTruthy();
    },
  );

  it.each(['en', 'zh'] as const)('opens and closes the selected full-size map for %s', async (locale) => {
    const copy = getMapMakerPageCopy(locale).showcase;
    const firstGroup = copy.groups[0];
    const firstMapCase = firstGroup?.cases[0];
    if (firstGroup === undefined || firstMapCase === undefined) {
      throw new Error(`Map maker showcase test expected a first map for ${JSON.stringify(locale)}.`);
    }

    render(<MapMakerShowcase copy={copy} />);
    const firstGroupElement = screen.getByTestId(`map-maker-showcase-group-${firstGroup.id}`);
    const carousel = requireMapMakerCarousel(firstGroupElement, firstGroup.id);
    const mapImageTrigger = within(carousel).getByRole('button', {
      name: `${copy.openImageLabel}: ${firstMapCase.name}`,
    });

    fireEvent.click(mapImageTrigger);

    const imageDialog = await screen.findByRole('dialog', { name: firstMapCase.name });
    expect(within(imageDialog).getByRole('heading', { name: firstMapCase.name })).toBeTruthy();
    expect(within(imageDialog).getByRole('img', { name: firstMapCase.alt }).getAttribute('src')).toContain(
      firstMapCase.src,
    );

    fireEvent.click(within(imageDialog).getByRole('button', { name: copy.closeImageLabel }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: firstMapCase.name })).toBeNull();
      expect(document.activeElement).toBe(mapImageTrigger);
    });
  });

  it.each(['en', 'zh'] as const)(
    'keeps the image preview open when its image is clicked and closes on blank content for %s',
    async (locale) => {
      const copy = getMapMakerPageCopy(locale).showcase;
      const firstGroup = copy.groups[0];
      const firstMapCase = firstGroup?.cases[0];
      if (firstGroup === undefined || firstMapCase === undefined) {
        throw new Error(`Map maker showcase test expected a first map for ${JSON.stringify(locale)}.`);
      }

      render(<MapMakerShowcase copy={copy} />);
      const firstGroupElement = screen.getByTestId(`map-maker-showcase-group-${firstGroup.id}`);
      const carousel = requireMapMakerCarousel(firstGroupElement, firstGroup.id);
      const mapImageTrigger = within(carousel).getByRole('button', {
        name: `${copy.openImageLabel}: ${firstMapCase.name}`,
      });

      fireEvent.click(mapImageTrigger);

      const imageDialog = await screen.findByRole('dialog', { name: firstMapCase.name });
      const previewImage = within(imageDialog).getByRole('img', { name: firstMapCase.alt });
      fireEvent.click(previewImage);
      expect(screen.getByRole('dialog', { name: firstMapCase.name })).toBe(imageDialog);

      fireEvent.click(imageDialog);
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: firstMapCase.name })).toBeNull();
        expect(document.activeElement).toBe(mapImageTrigger);
      });
    },
  );
});
