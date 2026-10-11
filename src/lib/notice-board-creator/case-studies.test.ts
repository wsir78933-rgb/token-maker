// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

import { cleanup, render } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CircularTestimonialsProps } from '@/components/armor-creator/circular-testimonials';
import { NoticeBoardCreatorCaseStudies } from '@/components/notice-board-creator/NoticeBoardCreatorCaseStudies';
import {
  getNoticeBoardCreatorCaseStudiesCopy,
  type NoticeBoardCreatorCaseStudyGroup,
} from '@/lib/notice-board-creator/case-studies';
import type { SiteLocale } from '@/lib/site-locale';

const NOTICE_BOARD_IMAGE_ASPECT_RATIO = 1696 / 1200;
const EXPECTED_CASE_GROUP_LAYOUTS = [
  { id: 'everyday', imagePosition: 'left' },
  { id: 'expedition', imagePosition: 'right' },
  { id: 'mystery', imagePosition: 'left' },
] as const;

vi.mock('@/components/armor-creator/circular-testimonials', async () => {
  const { createElement } = await import('react');
  return {
    CircularTestimonials: (props: CircularTestimonialsProps) =>
      createElement(
        'section',
        {
          'aria-label': props.ariaLabel,
          'data-autoplay': String(props.autoplay),
          'data-circular-testimonials': 'true',
          'data-clip-image-stack': String(props.clipImageStack),
          'data-image-aspect-ratio': String(props.imageAspectRatio),
          'data-image-position': props.imagePosition,
          'data-image-shape': props.imageShape,
          'data-show-image-frame': String(props.showImageFrame),
        },
        ...props.testimonials.map((testimonial) =>
          createElement('img', {
            key: testimonial.src,
            src: testimonial.src,
            alt: testimonial.alt,
          }),
        ),
      ),
  };
});

function getCaseImageBytes(sourceUrl: string): Buffer {
  const requiredPrefix = '/notice-board-creator/cases/';
  if (!sourceUrl.startsWith(requiredPrefix)) {
    throw new Error(`Unexpected notice board case image path. Received ${JSON.stringify(sourceUrl)}.`);
  }

  const publicDirectory = resolve(process.cwd(), 'public');
  const imageFilePath = resolve(publicDirectory, sourceUrl.slice(1));
  const caseImageDirectory = resolve(publicDirectory, 'notice-board-creator/cases');
  if (!imageFilePath.startsWith(`${caseImageDirectory}${sep}`)) {
    throw new Error(`Notice board case image path escaped its asset directory. Received ${JSON.stringify(sourceUrl)}.`);
  }

  return readFileSync(imageFilePath);
}

function requireCaseGroup(copyGroups: readonly NoticeBoardCreatorCaseStudyGroup[], groupIndex: number): NoticeBoardCreatorCaseStudyGroup {
  const caseGroup = copyGroups[groupIndex];
  if (caseGroup === undefined) {
    throw new Error(`Missing notice board case group at index ${groupIndex}.`);
  }
  return caseGroup;
}

describe('notice board creator case studies', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps three four-image groups aligned across locales with real, uniquely mapped WebP assets', () => {
    const englishCopy = getNoticeBoardCreatorCaseStudiesCopy('en');
    const chineseCopy = getNoticeBoardCreatorCaseStudiesCopy('zh');

    expect(englishCopy.groups).toHaveLength(3);
    expect(chineseCopy.groups).toHaveLength(3);
    expect(
      englishCopy.groups.map(({ id, imagePosition }) => ({ id, imagePosition })),
    ).toEqual(EXPECTED_CASE_GROUP_LAYOUTS);
    expect(
      chineseCopy.groups.map(({ id, imagePosition }) => ({ id, imagePosition })),
    ).toEqual(EXPECTED_CASE_GROUP_LAYOUTS);
    expect(chineseCopy.groups.map(({ id, imagePosition }) => ({ id, imagePosition }))).toEqual(
      englishCopy.groups.map(({ id, imagePosition }) => ({ id, imagePosition })),
    );

    const englishImagePaths: string[] = [];
    const chineseImagePaths: string[] = [];
    for (const [groupIndex, englishGroup] of englishCopy.groups.entries()) {
      const chineseGroup = requireCaseGroup(chineseCopy.groups, groupIndex);
      expect(englishGroup.items).toHaveLength(4);
      expect(chineseGroup.items).toHaveLength(4);
      expect(englishGroup.ariaLabel.trim()).not.toHaveLength(0);
      expect(chineseGroup.ariaLabel.trim()).not.toHaveLength(0);
      expect(chineseGroup.items.map((item) => item.src)).toEqual(
        englishGroup.items.map((item) => item.src),
      );

      for (const item of englishGroup.items) {
        expect(item.name.trim()).not.toHaveLength(0);
        expect(item.designation.trim()).not.toHaveLength(0);
        expect(item.quote.trim()).not.toHaveLength(0);
        expect(item.alt.trim()).not.toHaveLength(0);
        englishImagePaths.push(item.src);
      }
      for (const item of chineseGroup.items) {
        expect(item.name.trim()).not.toHaveLength(0);
        expect(item.designation.trim()).not.toHaveLength(0);
        expect(item.quote.trim()).not.toHaveLength(0);
        expect(item.alt.trim()).not.toHaveLength(0);
        chineseImagePaths.push(item.src);
      }
    }

    expect(new Set(englishImagePaths)).toHaveProperty('size', 12);
    expect(new Set(chineseImagePaths)).toHaveProperty('size', 12);
    expect(chineseImagePaths).toEqual(englishImagePaths);

    for (const sourceUrl of englishImagePaths) {
      const imageBytes = getCaseImageBytes(sourceUrl);
      expect(imageBytes.subarray(0, 4).toString('ascii')).toBe('RIFF');
      expect(imageBytes.subarray(8, 12).toString('ascii')).toBe('WEBP');
    }

  });

  it('passes complete board proportions, source images, alternating positions, and disabled autoplay to CircularTestimonials', () => {
    const englishCopy = getNoticeBoardCreatorCaseStudiesCopy('en');
    const { container } = render(createElement(NoticeBoardCreatorCaseStudies, { locale: 'en' }));
    const caseStudiesSection = container.querySelector<HTMLElement>('#notice-board-creator-case-studies');
    if (caseStudiesSection === null) {
      throw new Error('Missing notice board case studies section for locale "en".');
    }

    expect(caseStudiesSection.querySelectorAll('article')).toHaveLength(0);
    const carouselRegions = Array.from(
      caseStudiesSection.querySelectorAll<HTMLElement>('[data-circular-testimonials="true"]'),
    );
    expect(carouselRegions).toHaveLength(3);
    expect(carouselRegions.map((carouselRegion) => carouselRegion.getAttribute('aria-label'))).toEqual(
      englishCopy.groups.map((caseGroup) => caseGroup.ariaLabel),
    );

    for (const [groupIndex, carouselRegion] of carouselRegions.entries()) {
      const caseGroup = requireCaseGroup(englishCopy.groups, groupIndex);
      const caseImages = Array.from(carouselRegion.querySelectorAll<HTMLImageElement>('img'));

      expect(caseImages.map((caseImage) => caseImage.getAttribute('src'))).toEqual(
        caseGroup.items.map((item) => item.src),
      );
      expect(caseImages).toHaveLength(4);
      expect(carouselRegion.getAttribute('data-image-aspect-ratio')).toBe(
        String(NOTICE_BOARD_IMAGE_ASPECT_RATIO),
      );
      expect(carouselRegion.getAttribute('data-image-position')).toBe(caseGroup.imagePosition);
      expect(carouselRegion.getAttribute('data-image-shape')).toBe('landscape');
      expect(carouselRegion.getAttribute('data-clip-image-stack')).toBe('false');
      expect(carouselRegion.getAttribute('data-autoplay')).toBe('false');
      expect(carouselRegion.getAttribute('data-show-image-frame')).toBe('false');
      expect(carouselRegion.getAttribute('aria-label')).toBe(caseGroup.ariaLabel);
    }
  });

  it('rejects an unsupported locale with the received value', () => {
    expect(() => getNoticeBoardCreatorCaseStudiesCopy('fr' as SiteLocale)).toThrow(
      'Unknown notice board creator case studies locale. Received "fr".',
    );
  });
});
