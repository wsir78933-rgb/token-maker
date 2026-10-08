'use client';

import { useRef } from 'react';

import type { SiteLocale } from '@/lib/site-locale';

export type ConstellationMapCreatorHeadingProps = {
  locale: SiteLocale;
  title: string;
  description: string;
  actionLabel: string;
  workspaceId: string;
};

function requireWorkspaceId(workspaceId: string): string {
  if (workspaceId.trim().length === 0) {
    throw new Error(
      `Constellation map hero workspaceId must be a non-empty string. Received ${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspaceId;
}

function requireHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Constellation map hero button is missing. Received null.');
  }

  return button;
}

function requireWorkspace(workspaceId: string): HTMLElement {
  const workspace = document.getElementById(requireWorkspaceId(workspaceId));
  if (workspace === null) {
    throw new Error(
      `Constellation map hero workspace is missing. id=${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspace;
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollToWorkspace(workspace: HTMLElement, reducedMotion: boolean): void {
  workspace.scrollIntoView({
    behavior: reducedMotion ? 'instant' : 'smooth',
    block: 'start',
  });
}

export function ConstellationMapCreatorHeading({
  locale,
  title,
  description,
  actionLabel,
  workspaceId,
}: ConstellationMapCreatorHeadingProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const validatedWorkspaceId = requireWorkspaceId(workspaceId);

  function handleHeroAction(): void {
    const button = requireHeroButton(buttonRef.current);
    const workspace = requireWorkspace(validatedWorkspaceId);
    const reducedMotion = prefersReducedMotion();

    button.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1)' },
      ],
      { duration: 300, easing: 'cubic-bezier(0.36, 0, 0.66, -0.56)' },
    );
    scrollToWorkspace(workspace, reducedMotion);
  }

  return (
    <section
      className="flex min-h-[68vh] items-center justify-center px-4 pt-32 pb-20 text-center text-foreground md:min-h-[78vh] md:pt-40 md:pb-28"
      aria-labelledby="constellation-map-creator-heading"
      data-locale={locale}
      data-testid="constellation-map-creator-page-heading"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[#d7b46a]">
          {locale === 'zh' ? '世界观创作工具' : 'WORLD-BUILDING TOOL'}
        </p>
        <h1
          id="constellation-map-creator-heading"
          className="font-display text-balance text-4xl font-semibold leading-tight tracking-tight text-stone-50 sm:text-5xl md:text-6xl"
        >
          {title}
        </h1>
        <p
          id="constellation-map-creator-hero-description"
          className="mt-6 max-w-3xl text-base leading-7 text-stone-300 sm:text-lg"
        >
          {description}
        </p>
        <button
          ref={buttonRef}
          type="button"
          className="mt-9 inline-flex cursor-pointer items-center justify-center rounded-lg bg-foreground px-8 py-5 text-base font-medium text-background transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-200"
          onClick={handleHeroAction}
        >
          {actionLabel}
        </button>
      </div>
    </section>
  );
}
