'use client';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CASTLE_CREATOR_EDITOR_ID } from '@/lib/castle-creator/constants';
import type { CastleCreatorCallToActionCopy } from '@/lib/castle-creator/copy';

function requireCastleCreatorEditor(): HTMLElement {
  const editor = document.getElementById(CASTLE_CREATOR_EDITOR_ID);

  if (editor === null) {
    throw new Error(
      `Castle creator editor is missing. id=${JSON.stringify(CASTLE_CREATOR_EDITOR_ID)}.`,
    );
  }

  return editor;
}

function scrollToCastleCreatorEditor(editor: HTMLElement): void {
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  editor.scrollIntoView({
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
    block: 'start',
  });
}

function handleCastleCreatorCallToActionClick(): void {
  scrollToCastleCreatorEditor(requireCastleCreatorEditor());
}

export function CastleCreatorCallToAction({ copy }: { copy: CastleCreatorCallToActionCopy }) {
  return (
    <section
      aria-labelledby="castle-creator-call-to-action-title"
      className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-20 text-center text-stone-100 sm:py-24 lg:px-8 lg:py-28"
      data-testid="castle-creator-call-to-action"
    >
      <h2
        id="castle-creator-call-to-action-title"
        className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
      >
        {copy.title}
      </h2>
      <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
        {copy.description}
      </p>
      <Button
        type="button"
        size="lg"
        className="mt-2 min-h-11 rounded-full px-8"
        onClick={handleCastleCreatorCallToActionClick}
      >
        {copy.action}
        <ArrowRight aria-hidden="true" data-icon="inline-end" />
      </Button>
    </section>
  );
}
