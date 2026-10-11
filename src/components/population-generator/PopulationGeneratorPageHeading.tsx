'use client';

import { useRef } from 'react';

import {
  getPopulationPageCopy,
  POPULATION_GENERATOR_WORKSPACE_ID,
} from '@/lib/population-generator/page-copy';
import type { SiteLocale } from '@/lib/site-locale';

const POPULATION_HERO_FADE_CLASS = 'population-generator-hero-fade';
const POPULATION_HERO_UNDERLINE_CLASS = 'population-generator-hero-underline';
const POPULATION_HERO_BUTTON_CLASS = 'population-generator-hero-button';
const POPULATION_HERO_BOUNCE_CLASS = 'is-bouncing';
const POPULATION_HERO_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const POPULATION_HERO_BOUNCE_MS = 300;

function requirePopulationGeneratorWorkspaceId(workspaceId: string): string {
  if (workspaceId.trim() === '') {
    throw new Error(
      `Population generator workspace id is missing. Received ${JSON.stringify(workspaceId)}.`,
    );
  }

  return workspaceId;
}

function requirePopulationHeroTitle(title: string, locale: SiteLocale): string {
  if (title.trim() === '') {
    throw new Error(
      `Population generator hero title is missing for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return title;
}

function populationHeroEmphasis(locale: SiteLocale): string {
  if (locale === 'en') {
    return 'Population Generator';
  }

  if (locale === 'zh') {
    return '人口生成器';
  }

  const unexpectedLocale: never = locale;
  throw new Error(
    `Population generator hero has no emphasis for locale ${JSON.stringify(unexpectedLocale)}.`,
  );
}

function populationHeroActionLabel(locale: SiteLocale): string {
  if (locale === 'en') {
    return 'Try for Free';
  }

  if (locale === 'zh') {
    return '免费试用';
  }

  const unexpectedLocale: never = locale;
  throw new Error(
    `Population generator hero action is missing for locale ${JSON.stringify(unexpectedLocale)}.`,
  );
}

function splitPopulationHeroTitle(
  title: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = populationHeroEmphasis(locale);
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Population generator hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function prefersReducedPopulationHeroMotion(): boolean {
  if (typeof window.matchMedia !== 'function') {
    throw new Error(
      `Population generator hero cannot read motion preference. window.matchMedia is ${typeof window.matchMedia}.`,
    );
  }

  return window.matchMedia(POPULATION_HERO_REDUCED_MOTION_QUERY).matches;
}

function requirePopulationHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Population generator hero button is missing. Received null.');
  }

  return button;
}

function requirePopulationWorkspaceElement(workspaceId: string): HTMLElement {
  const workspace = document.getElementById(workspaceId);

  if (workspace === null) {
    throw new Error(
      `Population generator workspace is missing. id=${JSON.stringify(workspaceId)}. Received null.`,
    );
  }

  return workspace;
}

function startPopulationHeroButtonBounce(button: HTMLButtonElement, reduceMotion: boolean): void {
  if (reduceMotion) {
    return;
  }

  button.classList.add(POPULATION_HERO_BOUNCE_CLASS);
  window.setTimeout(() => {
    button.classList.remove(POPULATION_HERO_BOUNCE_CLASS);
  }, POPULATION_HERO_BOUNCE_MS);
}

function scrollToPopulationWorkspace(workspace: HTMLElement, reduceMotion: boolean): void {
  workspace.scrollIntoView({
    behavior: reduceMotion ? 'instant' : 'smooth',
    block: 'start',
  });
}

function PopulationHeroStyles() {
  return (
    <style>{`
      .${POPULATION_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes population-generator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${POPULATION_HERO_FADE_CLASS} {
        animation: population-generator-hero-fade-in-up 0.6s ease-out both;
      }

      .${POPULATION_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${POPULATION_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${POPULATION_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes population-generator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${POPULATION_HERO_BUTTON_CLASS}.${POPULATION_HERO_BOUNCE_CLASS} {
        animation: population-generator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${POPULATION_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${POPULATION_HERO_FADE_CLASS},
        .${POPULATION_HERO_BUTTON_CLASS}.${POPULATION_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function PopulationHeroUnderline() {
  return (
    <svg
      className={POPULATION_HERO_UNDERLINE_CLASS}
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

function PopulationHeroButton({
  label,
  workspaceId,
}: {
  label: string;
  workspaceId: string;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const button = requirePopulationHeroButton(buttonRef.current);
    const workspace = requirePopulationWorkspaceElement(workspaceId);
    const reduceMotion = prefersReducedPopulationHeroMotion();

    startPopulationHeroButtonBounce(button, reduceMotion);
    scrollToPopulationWorkspace(workspace, reduceMotion);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${POPULATION_HERO_BUTTON_CLASS} ${POPULATION_HERO_FADE_CLASS} is-delayed-2 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function PopulationGeneratorPageHeading({ locale }: { locale: SiteLocale }) {
  const workspaceId = requirePopulationGeneratorWorkspaceId(POPULATION_GENERATOR_WORKSPACE_ID);
  const copy = getPopulationPageCopy(locale);
  const heroTitleParts = splitPopulationHeroTitle(requirePopulationHeroTitle(copy.title, locale), locale);

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="population-generator-heading"
    >
      <PopulationHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="population-generator-heading"
          className={`${POPULATION_HERO_FADE_CLASS} mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {heroTitleParts.lead}
          <span className="relative inline-block mb-8 sm:mb-12">
            <span
              className={`font-display ${locale === 'zh' ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap' : 'text-5xl'} font-normal italic tracking-normal sm:text-6xl md:text-7xl`}
            >
              {heroTitleParts.emphasis}
            </span>
            <PopulationHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>
        <p
          id="population-generator-hero-description"
          className={`${POPULATION_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.description}
        </p>
        <PopulationHeroButton label={populationHeroActionLabel(locale)} workspaceId={workspaceId} />
      </div>
    </section>
  );
}
