'use client';

import { ArrowRight } from 'lucide-react';

import { EMBLEM_CREATOR_EDITOR_ID } from '@/components/emblem-creator/EmblemCreatorPageHeading';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';

const EMBLEM_CREATOR_CALL_TO_ACTION_HEADING_ID = 'emblem-creator-call-to-action-heading';

export function EmblemCreatorCallToAction({
  copy,
}: {
  copy: EmblemCreatorCopy['callToAction'];
}) {
  return (
    <section
      aria-labelledby={EMBLEM_CREATOR_CALL_TO_ACTION_HEADING_ID}
      className="mx-auto flex max-w-5xl flex-col items-center gap-3 py-20 text-center sm:py-24 lg:py-28"
    >
      <h2
        id={EMBLEM_CREATOR_CALL_TO_ACTION_HEADING_ID}
        className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
      >
        {copy.title}
      </h2>
      <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {copy.description}
      </p>
      <a
        data-slot="button"
        href={`#${EMBLEM_CREATOR_EDITOR_ID}`}
        className={cn(
          buttonVariants({ size: 'lg' }),
          'mt-2 min-h-11 rounded-full px-8 has-data-[icon=inline-end]:pr-8',
        )}
      >
        {copy.label}
        <ArrowRight aria-hidden="true" data-icon="inline-end" />
      </a>
    </section>
  );
}
