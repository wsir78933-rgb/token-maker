'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import { CircularTestimonials, type CircularTestimonial } from '@/components/armor-creator/circular-testimonials';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ScrollCreatorCaseStudyGroupCopy } from '@/lib/scroll-creator/case-studies';

export type ScrollCreatorCaseStudyGroupProps = {
  caseGroup: ScrollCreatorCaseStudyGroupCopy;
  viewImageLabel: string;
  closeImageLabel: string;
};

export function ScrollCreatorCaseStudyGroup({
  caseGroup,
  viewImageLabel,
  closeImageLabel,
}: ScrollCreatorCaseStudyGroupProps) {
  const [selectedExample, setSelectedExample] = useState<CircularTestimonial | null>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null);

  function handleImageClick(testimonial: CircularTestimonial, trigger: HTMLButtonElement): void {
    dialogTriggerRef.current = trigger;
    setSelectedExample(testimonial);
  }

  function handleDialogOpenChange(open: boolean): void {
    if (!open) setSelectedExample(null);
  }

  return (
    <article
      aria-label={caseGroup.carouselLabel}
      className="flex flex-col"
      data-image-position={caseGroup.imagePosition}
      data-scroll-case-group={caseGroup.id}
    >
      <CircularTestimonials
        testimonials={caseGroup.examples}
        ariaLabel={caseGroup.carouselLabel}
        previousLabel={caseGroup.previousLabel}
        nextLabel={caseGroup.nextLabel}
        imagePosition={caseGroup.imagePosition}
        clipImageStack={false}
        autoplay={false}
        colors={{ imageBackground: '#fff' }}
        imageActionLabel={viewImageLabel}
        onImageClick={handleImageClick}
      />

      <Dialog open={selectedExample !== null} onOpenChange={handleDialogOpenChange}>
        {selectedExample !== null ? (
          <DialogContent
            className="max-h-[94svh] max-w-[min(94vw,56rem)] gap-3 bg-white p-4 text-stone-950 sm:p-6"
            finalFocus={dialogTriggerRef}
          >
            <DialogTitle className="pr-12 text-stone-950">{selectedExample.name}</DialogTitle>
            <DialogDescription className="sr-only">
              {selectedExample.alt ?? selectedExample.name}
            </DialogDescription>
            <DialogClose aria-label={closeImageLabel} className="border-stone-300 bg-white text-stone-700" />
            <div className="flex min-h-0 justify-center overflow-auto rounded-xl bg-white">
              <Image
                src={selectedExample.src}
                alt={selectedExample.alt ?? selectedExample.name}
                width={900}
                height={1300}
                unoptimized
                className="h-auto max-h-[calc(94svh-7rem)] w-auto max-w-full object-contain"
                priority
              />
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </article>
  );
}
