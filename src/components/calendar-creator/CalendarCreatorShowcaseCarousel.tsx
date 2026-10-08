'use client';

import Image from 'next/image';
import { useRef, useState, type RefObject } from 'react';

import {
  CircularTestimonials,
  type CircularTestimonial,
  type CircularTestimonialsColors,
} from '@/components/armor-creator/circular-testimonials';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CalendarCreatorShowcaseGroup } from '@/lib/calendar-creator/showcase-copy';

import styles from './CalendarCreatorShowcase.module.css';

const CALENDAR_CREATOR_SHOWCASE_IMAGE_ASPECT_RATIO = 1.67;

const CALENDAR_CREATOR_SHOWCASE_COLORS: CircularTestimonialsColors = {
  name: 'var(--site-ink-strong)',
  designation: 'var(--site-accent-strong)',
  testimony: 'var(--site-ink)',
  imageBackground: 'var(--site-panel-deep)',
  arrowBackground: 'var(--site-accent-strong)',
  arrowForeground: 'var(--primary-foreground)',
  arrowHoverBackground: 'var(--site-ink-strong)',
};

export type CalendarCreatorShowcaseCarouselProps = {
  group: CalendarCreatorShowcaseGroup;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  openImageLabel: string;
  closeImageLabel: string;
};

function CalendarCreatorShowcaseImageDialog({
  testimonial,
  triggerRef,
  open,
  closeImageLabel,
  onOpenChange,
  onOpenChangeComplete,
}: {
  testimonial: CircularTestimonial | null;
  triggerRef: RefObject<HTMLButtonElement | null>;
  open: boolean;
  closeImageLabel: string;
  onOpenChange: (open: boolean) => void;
  onOpenChangeComplete: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      {testimonial !== null ? (
        <DialogContent
          className={styles.lightboxDialog}
          finalFocus={triggerRef}
        >
          <DialogTitle className={styles.lightboxTitle}>{testimonial.name}</DialogTitle>
          <DialogDescription className="sr-only">{testimonial.alt ?? testimonial.name}</DialogDescription>
          <DialogClose aria-label={closeImageLabel} />
          <div className={styles.lightboxFrame}>
            <Image
              src={testimonial.src}
              alt={testimonial.alt ?? testimonial.name}
              fill
              sizes="(max-width: 640px) calc(100vw - 2rem), min(72rem, calc(100vw - 3rem))"
              unoptimized
              className={styles.lightboxImage}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export function CalendarCreatorShowcaseCarousel({
  group,
  ariaLabel,
  previousLabel,
  nextLabel,
  openImageLabel,
  closeImageLabel,
}: CalendarCreatorShowcaseCarouselProps) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<CircularTestimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function handleImageClick(testimonial: CircularTestimonial, trigger: HTMLButtonElement): void {
    if (!(trigger instanceof HTMLButtonElement)) {
      throw new Error(
        `Calendar creator showcase image trigger must be an HTMLButtonElement. Received ${Object.prototype.toString.call(trigger)}.`,
      );
    }

    triggerRef.current = trigger;
    setSelectedTestimonial(testimonial);
    setDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean): void {
    setDialogOpen(open);
  }

  function handleDialogOpenChangeComplete(open: boolean): void {
    if (!open) {
      setSelectedTestimonial(null);
    }
  }

  return (
    <>
      <CircularTestimonials
        testimonials={group.examples}
        ariaLabel={ariaLabel}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        autoplay={false}
        colors={CALENDAR_CREATOR_SHOWCASE_COLORS}
        imagePosition={group.imagePosition}
        imageAspectRatio={CALENDAR_CREATOR_SHOWCASE_IMAGE_ASPECT_RATIO}
        imageTextSpacing="relaxed"
        clipImageStack={false}
        onImageClick={handleImageClick}
        openImageLabel={openImageLabel}
      />
      <CalendarCreatorShowcaseImageDialog
        testimonial={selectedTestimonial}
        triggerRef={triggerRef}
        open={dialogOpen}
        closeImageLabel={closeImageLabel}
        onOpenChange={handleDialogOpenChange}
        onOpenChangeComplete={handleDialogOpenChangeComplete}
      />
    </>
  );
}
