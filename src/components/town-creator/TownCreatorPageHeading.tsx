'use client';

import type { SiteLocale } from '@/lib/site-locale';
import { TOWN_CREATOR_EDITOR_ID } from '@/lib/town-creator/copy';

import styles from './TownCreatorPageHeading.module.css';

type TownCreatorPageHeadingProps = Readonly<{
  locale: SiteLocale;
  heading: string;
  description: string;
  emphasis: string;
  action: string;
}>;

type TownHeroTitleParts = Readonly<{
  lead: string;
  emphasis: string;
  tail: string;
}>;

function requireTownHeroText(value: string, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Town creator hero ${label} must be a non-empty string. Received ${JSON.stringify(value)}.`);
  }

  return value;
}

function requireTownHeroLocale(locale: SiteLocale): SiteLocale {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(`Town creator hero locale must be "en" or "zh". Received ${JSON.stringify(locale)}.`);
  }

  return locale;
}

function splitTownHeroTitle(heading: string, emphasis: string): TownHeroTitleParts {
  const headingText = requireTownHeroText(heading, 'heading');
  const emphasisText = requireTownHeroText(emphasis, 'emphasis');
  const emphasisStart = headingText.indexOf(emphasisText);

  if (emphasisStart < 0) {
    throw new Error(
      `Town creator hero heading is missing emphasis ${JSON.stringify(emphasisText)}. Received ${JSON.stringify(headingText)}.`,
    );
  }

  if (headingText.indexOf(emphasisText, emphasisStart + emphasisText.length) >= 0) {
    throw new Error(
      `Town creator hero heading contains repeated emphasis ${JSON.stringify(emphasisText)}. Received ${JSON.stringify(headingText)}.`,
    );
  }

  return {
    lead: headingText.slice(0, emphasisStart),
    emphasis: emphasisText,
    tail: headingText.slice(emphasisStart + emphasisText.length),
  };
}

function requireTownCreatorEditor(): HTMLElement {
  const editor = document.getElementById(TOWN_CREATOR_EDITOR_ID);
  if (editor === null) {
    throw new Error(
      `Town creator editor is missing. id=${JSON.stringify(TOWN_CREATOR_EDITOR_ID)}.`,
    );
  }

  return editor;
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

function scrollToTownCreatorEditor(): void {
  const editor = requireTownCreatorEditor();
  editor.scrollIntoView({
    behavior: prefersReducedMotion() ? 'instant' : 'smooth',
    block: 'start',
  });
}

function TownCreatorHeroUnderline() {
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

export function TownCreatorPageHeading({
  locale,
  heading,
  description,
  emphasis,
  action,
}: TownCreatorPageHeadingProps) {
  const resolvedLocale = requireTownHeroLocale(locale);
  const titleParts = splitTownHeroTitle(heading, emphasis);
  const descriptionText = requireTownHeroText(description, 'description');
  const actionText = requireTownHeroText(action, 'action');

  return (
    <section
      className={`${styles.hero} ${resolvedLocale === 'zh' ? styles.zh : ''}`}
      aria-labelledby="town-creator-heading"
    >
      <div className={styles.inner}>
        <h1 id="town-creator-heading" className={`${styles.fade} ${styles.heading}`}>
          {titleParts.lead}
          <span className={styles.emphasis}>
            {titleParts.emphasis}
            <TownCreatorHeroUnderline />
          </span>
          {titleParts.tail}
        </h1>
        <p className={`${styles.fade} ${styles.delayedDescription} ${styles.description}`}>
          {descriptionText}
        </p>
        <button
          type="button"
          className={`${styles.fade} ${styles.delayedAction} ${styles.action}`}
          onClick={scrollToTownCreatorEditor}
        >
          {actionText}
        </button>
      </div>
    </section>
  );
}
