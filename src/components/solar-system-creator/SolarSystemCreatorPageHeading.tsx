'use client';

import { useRef } from 'react';

import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

import styles from './SolarSystemCreatorPageHeading.module.css';

export interface SolarSystemCreatorPageHeadingProps {
  locale: SiteLocale;
  copy: SolarSystemCopy;
  workspaceId: string;
}

function requireHeroButton(button: HTMLButtonElement | null, workspaceId: string): HTMLButtonElement {
  if (button === null) {
    throw new Error(
      `Solar system creator hero button is missing. workspaceId=${JSON.stringify(workspaceId)}; Received null.`,
    );
  }

  return button;
}

function requireWorkspace(workspaceId: string): HTMLElement {
  const workspace = document.getElementById(workspaceId);
  if (workspace === null) {
    throw new Error(
      `Solar system creator workspace is missing. workspaceId=${JSON.stringify(workspaceId)}; Received null.`,
    );
  }

  return workspace;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function startHeroButtonBounce(button: HTMLButtonElement, reducedMotion: boolean): void {
  if (reducedMotion) return;

  button.classList.add(styles.bouncing);
  window.setTimeout(() => button.classList.remove(styles.bouncing), 300);
}

function scrollToWorkspace(workspace: HTMLElement, reducedMotion: boolean): void {
  workspace.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

function getHeroTitleParts(
  pageTitle: string,
  emphasis: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasisStart = pageTitle.indexOf(emphasis);
  if (emphasisStart < 0) {
    throw new Error(
      `Solar system creator hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(pageTitle)}.`,
    );
  }

  return {
    lead: pageTitle.slice(0, emphasisStart),
    emphasis,
    tail: pageTitle.slice(emphasisStart + emphasis.length).replace(/^ – /, ' '),
  };
}

function SolarSystemCreatorHeroUnderline() {
  return (
    <svg
      className={styles.underline}
      viewBox="0 0 170 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 9C32.8203 5.34032 108.769 -0.881146 166 3.51047"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

export function SolarSystemCreatorPageHeading({
  locale,
  copy,
  workspaceId,
}: SolarSystemCreatorPageHeadingProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const heroTitleParts = getHeroTitleParts(copy.pageTitle, copy.heading, locale);
  const headingId = `${workspaceId}-heading`;

  function handleHeroAction(): void {
    const reducedMotion = prefersReducedMotion();
    const button = requireHeroButton(buttonRef.current, workspaceId);
    const workspace = requireWorkspace(workspaceId);

    startHeroButtonBounce(button, reducedMotion);
    scrollToWorkspace(workspace, reducedMotion);
  }

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby={headingId}
      data-solar-print-hidden="true"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id={headingId}
          className={`${styles.fade} mb-6 text-balance text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {heroTitleParts.lead}
          <span className="relative mb-8 inline-block sm:mb-12">
            <span
              className={`font-display ${locale === 'zh' ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap' : 'text-5xl'} font-normal italic tracking-normal sm:text-6xl md:text-7xl`}
            >
              {heroTitleParts.emphasis}
            </span>
            <SolarSystemCreatorHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>

        <p
          className={`${styles.fade} ${styles.delayedOne} mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.pageDescription}
        </p>
        <button
          ref={buttonRef}
          type="button"
          className={`${styles.fade} ${styles.delayedTwo} ${styles.button} inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
          onClick={handleHeroAction}
        >
          {copy.heroAction}
        </button>
      </div>
    </section>
  );
}
