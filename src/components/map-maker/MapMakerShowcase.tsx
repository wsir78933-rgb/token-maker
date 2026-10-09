'use client';

import { useRef, useState } from 'react';

import {
  CircularTestimonials,
  type CircularTestimonial,
  type CircularTestimonialsColors,
} from '@/components/map-maker/circular-testimonials';
import type { MapMakerShowcaseCopy } from '@/lib/map-maker/showcase-copy';

import { MapMakerImagePreview } from './MapMakerImagePreview';
import styles from './MapMakerShowcase.module.css';

const MAP_MAKER_SHOWCASE_HEADING_ID = 'map-maker-showcase-heading';
const MAP_MAKER_SHOWCASE_GROUP_COUNT = 3;
const MAP_MAKER_SHOWCASE_CASES_PER_GROUP = 4;

const MAP_MAKER_SHOWCASE_TEXT_COLORS: CircularTestimonialsColors = {
  name: 'var(--color-stone-50)',
  designation: 'var(--color-stone-400)',
  testimony: 'var(--color-stone-300)',
};

type MapMakerShowcaseGroupCopy = MapMakerShowcaseCopy['groups'][number];

function assertMapMakerShowcaseCopy(copy: MapMakerShowcaseCopy): void {
  if (copy.groups.length !== MAP_MAKER_SHOWCASE_GROUP_COUNT) {
    throw new Error(
      `Map maker showcase must contain ${MAP_MAKER_SHOWCASE_GROUP_COUNT} groups. Received ${copy.groups.length}.`,
    );
  }

  const groupIds = new Set<string>();

  for (const group of copy.groups) {
    if (groupIds.has(group.id)) {
      throw new Error(`Map maker showcase group id must be unique. Received ${JSON.stringify(group.id)}.`);
    }
    groupIds.add(group.id);

    if (group.cases.length !== MAP_MAKER_SHOWCASE_CASES_PER_GROUP) {
      throw new Error(
        `Map maker showcase group ${JSON.stringify(group.id)} must contain ${MAP_MAKER_SHOWCASE_CASES_PER_GROUP} cases. Received ${group.cases.length}.`,
      );
    }
  }
}

function MapMakerShowcaseGroup({
  group,
  copy,
  onOpenMapPreview,
}: {
  group: MapMakerShowcaseGroupCopy;
  copy: MapMakerShowcaseCopy;
  onOpenMapPreview: (mapImage: CircularTestimonial, imageTrigger: HTMLButtonElement) => void;
}) {
  const groupHeadingId = `map-maker-showcase-${group.id}-heading`;

  function handleMapMakerShowcaseImageClick(
    mapImage: CircularTestimonial,
    imageTrigger: HTMLButtonElement,
  ): void {
    imageTrigger.focus();
    onOpenMapPreview(mapImage, imageTrigger);
  }

  return (
    <article
      aria-labelledby={groupHeadingId}
      className={styles.group}
      data-testid={`map-maker-showcase-group-${group.id}`}
    >
      <header className={styles.groupHeader}>
        <h3 id={groupHeadingId} className={`${styles.groupTitle} font-display`}>
          {group.title}
        </h3>
        <p className={styles.groupDescription}>{group.description}</p>
      </header>
      <div className={styles.carousel}>
        <CircularTestimonials
          testimonials={group.cases}
          ariaLabel={`${copy.title}: ${group.title}`}
          previousLabel={copy.previousLabel}
          nextLabel={copy.nextLabel}
          autoplay={false}
          colors={MAP_MAKER_SHOWCASE_TEXT_COLORS}
          imagePosition={group.imagePosition}
          imageAspectRatio={16 / 9}
          onImageClick={handleMapMakerShowcaseImageClick}
          imageActionLabel={copy.openImageLabel}
        />
      </div>
    </article>
  );
}

export function MapMakerShowcase({ copy }: { copy: MapMakerShowcaseCopy }) {
  assertMapMakerShowcaseCopy(copy);

  const [selectedMapPreview, setSelectedMapPreview] = useState<CircularTestimonial | null>(null);
  const [mapPreviewDialogIsOpen, setMapPreviewDialogIsOpen] = useState(false);
  const mapPreviewTriggerRef = useRef<HTMLButtonElement | null>(null);

  function openMapPreview(mapImage: CircularTestimonial, imageTrigger: HTMLButtonElement): void {
    mapPreviewTriggerRef.current = imageTrigger;
    setSelectedMapPreview(mapImage);
    setMapPreviewDialogIsOpen(true);
  }

  function handleMapPreviewDialogOpenChange(open: boolean): void {
    setMapPreviewDialogIsOpen(open);
  }

  function handleMapPreviewDialogOpenChangeComplete(open: boolean): void {
    if (!open) {
      setSelectedMapPreview(null);
    }
  }

  return (
    <>
      <section
        aria-labelledby={MAP_MAKER_SHOWCASE_HEADING_ID}
        className={styles.showcase}
        data-testid="map-maker-showcase"
      >
        <header className={styles.showcaseHeader}>
          <h2 id={MAP_MAKER_SHOWCASE_HEADING_ID} className={`${styles.showcaseTitle} font-display`}>
            {copy.title}
          </h2>
          <p className={styles.showcaseDescription}>{copy.description}</p>
        </header>
        <div className={styles.groupList}>
          {copy.groups.map((group) => (
            <MapMakerShowcaseGroup
              key={group.id}
              group={group}
              copy={copy}
              onOpenMapPreview={openMapPreview}
            />
          ))}
        </div>
      </section>
      <MapMakerImagePreview
        mapImage={selectedMapPreview}
        open={mapPreviewDialogIsOpen}
        closeImageLabel={copy.closeImageLabel}
        triggerRef={mapPreviewTriggerRef}
        onOpenChange={handleMapPreviewDialogOpenChange}
        onOpenChangeComplete={handleMapPreviewDialogOpenChangeComplete}
      />
    </>
  );
}
