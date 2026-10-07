'use client';

import { useRef } from 'react';

import type { SiteLocale } from '@/lib/site-locale';

import styles from './PeriodicTableCreatorPageHeading.module.css';

export type PeriodicTableCreatorPageHeadingProps = {
  locale: SiteLocale;
  title: string;
  description: string;
  actionLabel: string;
  workspaceId: string;
};

function getHeroTitleParts(
  title: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = locale === 'en' ? 'Periodic Table Creator' : '元素周期表制作器';
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Periodic table hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function requireHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Periodic table hero button is missing. Received null.');
  }

  return button;
}

function requireWorkspace(workspaceId: string): HTMLElement {
  if (workspaceId.trim().length === 0) {
    throw new Error(`Periodic table hero workspaceId must be non-empty. Received ${JSON.stringify(workspaceId)}.`);
  }

  const workspace = document.getElementById(workspaceId);
  if (workspace === null) {
    throw new Error(
      `Periodic table hero workspace is missing. id=${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspace;
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function animateHeroButton(button: HTMLButtonElement, reducedMotion: boolean): void {
  if (reducedMotion) return;

  button.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(0.95)' },
      { transform: 'scale(1)' },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    },
  );
}

function scrollToWorkspace(workspace: HTMLElement, reducedMotion: boolean): void {
  workspace.scrollIntoView({
    behavior: reducedMotion ? 'instant' : 'smooth',
    block: 'start',
  });
}

function PeriodicTableHeroUnderline() {
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

function PeriodicTableHeroButton({ label, workspaceId }: { label: string; workspaceId: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  function handleClick(): void {
    const button = requireHeroButton(buttonRef.current);
    const workspace = requireWorkspace(workspaceId);
    const reducedMotion = prefersReducedMotion();

    animateHeroButton(button, reducedMotion);
    scrollToWorkspace(workspace, reducedMotion);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.button} ${styles.fade} ${styles.delayedButton}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function PeriodicTableCreatorPageHeading({
  locale,
  title,
  description,
  actionLabel,
  workspaceId,
}: PeriodicTableCreatorPageHeadingProps) {
  const heroTitleParts = getHeroTitleParts(title, locale);

  return (
    <section
      className={styles.hero}
      aria-labelledby="periodic-table-creator-heading"
    >
      <div className={styles.content}>
        <h1 id="periodic-table-creator-heading" className={`${styles.title} ${styles.fade}`}>
          {heroTitleParts.lead}
          <span className={styles.emphasisWrap}>
            <span className={locale === 'zh' ? `${styles.emphasis} ${styles.zhEmphasis}` : styles.emphasis}>
              {heroTitleParts.emphasis}
            </span>
            <PeriodicTableHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>
        <p
          id="periodic-table-hero-description"
          className={`${styles.description} ${styles.fade} ${styles.delayedDescription}`}
        >
          {description}
        </p>
        <PeriodicTableHeroButton label={actionLabel} workspaceId={workspaceId} />
      </div>
    </section>
  );
}
