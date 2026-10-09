'use client';

import Image from 'next/image';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CircularTestimonial } from '@/components/map-maker/circular-testimonials';

export type MapMakerImagePreviewProps = {
  mapImage: CircularTestimonial | null;
  open: boolean;
  closeImageLabel: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: (open: boolean) => void;
  onOpenChangeComplete: (open: boolean) => void;
};

export function MapMakerImagePreview({
  mapImage,
  open,
  closeImageLabel,
  triggerRef,
  onOpenChange,
  onOpenChangeComplete,
}: MapMakerImagePreviewProps) {
  const mapImageAlt = mapImage?.alt ?? mapImage?.name ?? '';

  function handlePopupClick(event: ReactMouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      {mapImage === null ? null : (
        <DialogContent
          className="max-h-[92svh] max-w-[92vw] overflow-y-auto rounded-none border-0 bg-transparent p-0 shadow-none sm:max-h-[92vh] sm:rounded-none"
          finalFocus={triggerRef}
          onClick={handlePopupClick}
        >
          <DialogTitle className="mb-3 pr-14 text-sm font-medium text-stone-50 sm:text-base">
            {mapImage.name}
          </DialogTitle>
          <DialogDescription className="sr-only">{mapImageAlt}</DialogDescription>
          <DialogClose aria-label={closeImageLabel} />
          <Image
            src={mapImage.src}
            alt={mapImageAlt}
            width={2240}
            height={1260}
            sizes="92vw"
            unoptimized
            className="mx-auto block h-auto max-h-[85vh] max-w-full w-auto object-contain"
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
