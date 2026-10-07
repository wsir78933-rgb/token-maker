'use client';

import { useCallback, useRef, useState } from 'react';
import {
  CircularTestimonials,
  type CircularTestimonial,
} from '@/components/armor-creator/circular-testimonials';
import type { ConstellationShowcaseCopy } from '@/lib/constellation-map-creator/showcase-copy';
import { ConstellationShowcaseImageDialog } from './ConstellationShowcaseImageDialog';

const CONSTELLATION_SHOWCASE_GROUP_COUNT = 3;
const CONSTELLATION_SHOWCASE_CASE_COUNT = 4;
const CONSTELLATION_SHOWCASE_IMAGE_POSITIONS = ['left', 'right', 'left'] as const;

type ConstellationShowcaseImagePosition = (typeof CONSTELLATION_SHOWCASE_IMAGE_POSITIONS)[number];
type ConstellationShowcaseGroupCopy = ConstellationShowcaseCopy['groups'][number];

function describeConstellationShowcaseValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  return Object.prototype.toString.call(value);
}

function requireConstellationShowcaseText(value: unknown, field: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(
    `Constellation showcase ${field} must be a non-empty string. Received ${describeConstellationShowcaseValue(value)}.`,
  );
}

function requireConstellationShowcaseObject(value: unknown, field: string): Record<string, unknown> {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  throw new Error(
    `Constellation showcase ${field} must be an object. Received ${describeConstellationShowcaseValue(value)}.`,
  );
}

function assertConstellationShowcaseShape(copy: unknown): asserts copy is ConstellationShowcaseCopy {
  const copyRecord = requireConstellationShowcaseObject(copy, 'copy');
  requireConstellationShowcaseText(copyRecord.title, 'title');
  requireConstellationShowcaseText(copyRecord.description, 'description');
  requireConstellationShowcaseText(copyRecord.previousLabel, 'previousLabel');
  requireConstellationShowcaseText(copyRecord.nextLabel, 'nextLabel');
  requireConstellationShowcaseText(copyRecord.imageActionLabel, 'imageActionLabel');
  requireConstellationShowcaseText(copyRecord.closeImageLabel, 'closeImageLabel');

  if (!Array.isArray(copyRecord.groups)) {
    throw new Error(
      `Constellation showcase groups must be an array. Received ${describeConstellationShowcaseValue(copyRecord.groups)}.`,
    );
  }

  if (copyRecord.groups.length !== CONSTELLATION_SHOWCASE_GROUP_COUNT) {
    throw new Error(
      `Constellation showcase must contain exactly ${CONSTELLATION_SHOWCASE_GROUP_COUNT} groups. Received length ${copyRecord.groups.length}.`,
    );
  }

  copyRecord.groups.forEach((caseGroupValue, groupIndex) => {
    const caseGroup = requireConstellationShowcaseObject(caseGroupValue, `groups[${groupIndex}]`);
    const caseGroupId = requireConstellationShowcaseText(caseGroup.id, `groups[${groupIndex}].id`);
    requireConstellationShowcaseText(caseGroup.title, `groups[${groupIndex}].title`);

    if (!Array.isArray(caseGroup.cases)) {
      throw new Error(
        `Constellation showcase group ${JSON.stringify(caseGroupId)} cases must be an array. Received ${describeConstellationShowcaseValue(caseGroup.cases)}.`,
      );
    }

    if (caseGroup.cases.length !== CONSTELLATION_SHOWCASE_CASE_COUNT) {
      throw new Error(
        `Constellation showcase group ${JSON.stringify(caseGroupId)} must contain exactly ${CONSTELLATION_SHOWCASE_CASE_COUNT} cases. Received length ${caseGroup.cases.length}.`,
      );
    }

    caseGroup.cases.forEach((showcaseCaseValue, caseIndex) => {
      const showcaseCase = requireConstellationShowcaseObject(
        showcaseCaseValue,
        `groups[${groupIndex}].cases[${caseIndex}]`,
      );
      const casePrefix = `groups[${groupIndex}].cases[${caseIndex}]`;
      requireConstellationShowcaseText(showcaseCase.title, `${casePrefix}.title`);
      requireConstellationShowcaseText(showcaseCase.audience, `${casePrefix}.audience`);
      requireConstellationShowcaseText(showcaseCase.description, `${casePrefix}.description`);
      requireConstellationShowcaseText(showcaseCase.imageSrc, `${casePrefix}.imageSrc`);
      requireConstellationShowcaseText(showcaseCase.imageAlt, `${casePrefix}.imageAlt`);
    });
  });
}

function getConstellationShowcaseImagePosition(groupIndex: number): ConstellationShowcaseImagePosition {
  const imagePosition = CONSTELLATION_SHOWCASE_IMAGE_POSITIONS[groupIndex];
  if (imagePosition === undefined) {
    throw new Error(
      `Constellation showcase group index is outside the supported layout range. Received ${groupIndex}.`,
    );
  }

  return imagePosition;
}

function createConstellationShowcaseTestimonials(
  caseGroup: ConstellationShowcaseGroupCopy,
): CircularTestimonial[] {
  return caseGroup.cases.map((showcaseCase) => ({
    name: showcaseCase.title,
    designation: showcaseCase.audience,
    quote: showcaseCase.description,
    src: showcaseCase.imageSrc,
    alt: showcaseCase.imageAlt,
  }));
}

function ConstellationShowcaseGroup({
  caseGroup,
  groupIndex,
  previousLabel,
  nextLabel,
  imageActionLabel,
  closeImageLabel,
}: {
  caseGroup: ConstellationShowcaseGroupCopy;
  groupIndex: number;
  previousLabel: string;
  nextLabel: string;
  imageActionLabel: string;
  closeImageLabel: string;
}) {
  const [viewedImage, setViewedImage] = useState<CircularTestimonial | null>(null);
  const imageTriggerRef = useRef<HTMLButtonElement | null>(null);
  const imagePosition = getConstellationShowcaseImagePosition(groupIndex);
  const mobileImageFirstOverride =
    imagePosition === 'right'
      ? "[&_[data-part='layout']]:!flex-col md:[&_[data-part='layout']]:!flex-row-reverse"
      : undefined;
  const handleImageClick = useCallback(
    (testimonial: CircularTestimonial, triggerElement: HTMLButtonElement): void => {
      imageTriggerRef.current = triggerElement;
      setViewedImage(testimonial);
    },
    [],
  );

  function handleImageDialogOpenChange(open: boolean): void {
    if (!open) {
      setViewedImage(null);
    }
  }

  return (
    <article
      aria-label={caseGroup.title}
      className="flex flex-col gap-4"
      data-constellation-showcase-group={caseGroup.id}
      data-image-position={imagePosition}
    >
      <h3 className="text-center font-display text-xl font-semibold tracking-tight text-stone-50 sm:text-2xl">
        {caseGroup.title}
      </h3>
      <div className={mobileImageFirstOverride}>
        <CircularTestimonials
          testimonials={createConstellationShowcaseTestimonials(caseGroup)}
          ariaLabel={caseGroup.title}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          colors={{ imageBackground: 'var(--site-panel-deep)' }}
          imagePosition={imagePosition}
          imageShape="landscape"
          clipImageStack={false}
          onImageClick={handleImageClick}
          imageActionLabel={imageActionLabel}
        />
      </div>
      <ConstellationShowcaseImageDialog
        testimonial={viewedImage}
        open={viewedImage !== null}
        closeLabel={closeImageLabel}
        finalFocus={imageTriggerRef}
        onOpenChange={handleImageDialogOpenChange}
      />
    </article>
  );
}

export function ConstellationMapCreatorShowcase({
  copy,
}: {
  copy: ConstellationShowcaseCopy;
}) {
  assertConstellationShowcaseShape(copy);

  return (
    <section
      id="constellation-map-creator-showcase"
      aria-labelledby="constellation-map-creator-showcase-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
      data-testid="constellation-map-creator-showcase"
    >
      <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          id="constellation-map-creator-showcase-title"
          className="font-display font-semibold leading-tight tracking-tight text-stone-50 text-balance"
          style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          {copy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
        {copy.groups.map((caseGroup, groupIndex) => (
          <ConstellationShowcaseGroup
            key={caseGroup.id}
            caseGroup={caseGroup}
            groupIndex={groupIndex}
            previousLabel={copy.previousLabel}
            nextLabel={copy.nextLabel}
            imageActionLabel={copy.imageActionLabel}
            closeImageLabel={copy.closeImageLabel}
          />
        ))}
      </div>
    </section>
  );
}
