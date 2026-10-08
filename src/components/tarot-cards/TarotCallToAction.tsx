'use client';

import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import { TAROT_WORKSPACE_ID } from '@/lib/tarot-cards/constants';
import type { TarotPageContent } from '@/lib/tarot-cards/page-content';

type TarotCallToActionMouseEvent = MouseEvent<HTMLButtonElement | HTMLAnchorElement>;

function shouldPreserveTarotAnchorNavigation(event: TarotCallToActionMouseEvent): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function requireTarotWorkspaceTarget(): HTMLElement {
  const workspace = document.getElementById(TAROT_WORKSPACE_ID);

  if (workspace === null) {
    throw new Error(
      `Tarot workspace target is missing. id=${JSON.stringify(TAROT_WORKSPACE_ID)}. Received null.`,
    );
  }

  return workspace;
}

function getTarotWorkspaceScrollBehavior(): ScrollBehavior {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  }

  return 'smooth';
}

function scrollToTarotWorkspace(event: TarotCallToActionMouseEvent): void {
  if (shouldPreserveTarotAnchorNavigation(event)) {
    return;
  }

  const workspace = requireTarotWorkspaceTarget();
  event.preventDefault();
  workspace.scrollIntoView({ behavior: getTarotWorkspaceScrollBehavior(), block: 'start' });
}

export function TarotCallToAction({
  copy,
}: {
  copy: TarotPageContent['callToAction'];
}) {
  return (
    <section
      id="tarot-cards-call-to-action"
      aria-labelledby="tarot-cards-call-to-action-title"
      className="mx-auto max-w-5xl px-5 py-20 text-stone-100 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          id="tarot-cards-call-to-action-title"
          className="font-display text-2xl font-semibold leading-tight text-stone-50 text-balance sm:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 text-pretty sm:text-base">
          {copy.description}
        </p>
        <Button
          size="lg"
          className="mt-2 h-11 cursor-pointer rounded-full px-8 motion-reduce:transition-none"
          nativeButton={false}
          render={<a href={`#${TAROT_WORKSPACE_ID}`} />}
          onClick={scrollToTarotWorkspace}
        >
          {copy.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}
