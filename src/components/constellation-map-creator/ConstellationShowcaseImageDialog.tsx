'use client';

import Image from 'next/image';
import type { RefObject } from 'react';

import type { CircularTestimonial } from '@/components/armor-creator/circular-testimonials';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

export type ConstellationShowcaseImageDialogProps = {
  testimonial: CircularTestimonial | null;
  open: boolean;
  closeLabel: string;
  finalFocus: RefObject<HTMLButtonElement | null>;
  onOpenChange(open: boolean): void;
};

export function ConstellationShowcaseImageDialog({
  testimonial,
  open,
  closeLabel,
  finalFocus,
  onOpenChange,
}: ConstellationShowcaseImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        finalFocus={finalFocus}
        className="max-h-[96svh] max-w-[min(96vw,1100px)] gap-3 overflow-hidden p-4 sm:max-h-[96svh] sm:p-6"
      >
        {testimonial !== null ? (
          <>
            <DialogTitle className="pr-12">{testimonial.name}</DialogTitle>
            <DialogDescription className="sr-only">{testimonial.quote}</DialogDescription>
            <div className="flex max-h-[calc(96svh-7rem)] min-h-0 w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--site-panel-deep)]">
              <Image
                src={testimonial.src}
                alt={testimonial.alt ?? testimonial.name}
                width={1600}
                height={1000}
                sizes="(max-width: 640px) 92vw, 1100px"
                unoptimized
                className="block h-auto max-h-[calc(96svh-7rem)] w-auto max-w-full object-contain"
              />
            </div>
            <DialogClose
              aria-label={closeLabel}
              className="h-11 w-11 min-h-11 min-w-11 cursor-pointer rounded-md"
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
