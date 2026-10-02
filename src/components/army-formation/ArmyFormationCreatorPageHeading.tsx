"use client";

import { useRef } from 'react';

import { getArmyFormationCreatorHero } from '@/lib/army-formation/copy';
import type { SiteLocale } from '@/lib/site-locale';

export const ARMY_FORMATION_CREATOR_EDITOR_ID = 'army-formation-creator-editor';

const ARMY_FORMATION_HERO_FADE_CLASS = 'army-formation-hero-fade';
const ARMY_FORMATION_HERO_UNDERLINE_CLASS = 'army-formation-hero-underline';
const ARMY_FORMATION_HERO_BUTTON_CLASS = 'army-formation-hero-button';
const ARMY_FORMATION_HERO_BOUNCE_CLASS = 'is-bouncing';

function ArmyFormationHeroStyles() {
  return (
    <style>{`
      .${ARMY_FORMATION_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes army-formation-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${ARMY_FORMATION_HERO_FADE_CLASS} {
        animation: army-formation-hero-fade-in-up 0.6s ease-out both;
      }

      .${ARMY_FORMATION_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${ARMY_FORMATION_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${ARMY_FORMATION_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes army-formation-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${ARMY_FORMATION_HERO_BUTTON_CLASS}.${ARMY_FORMATION_HERO_BOUNCE_CLASS} {
        animation: army-formation-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${ARMY_FORMATION_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${ARMY_FORMATION_HERO_FADE_CLASS},
        .${ARMY_FORMATION_HERO_BUTTON_CLASS}.${ARMY_FORMATION_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function ArmyFormationHeroUnderline() {
  return (
    <svg
      className={ARMY_FORMATION_HERO_UNDERLINE_CLASS}
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

function ArmyFormationHeroButton({ label }: { label: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const button = buttonRef.current;
    if (button === null) {
      throw new Error('Army formation creator hero button is missing. Received null.');
    }

    button.classList.add(ARMY_FORMATION_HERO_BOUNCE_CLASS);
    window.setTimeout(() => button.classList.remove(ARMY_FORMATION_HERO_BOUNCE_CLASS), 300);

    const editor = document.getElementById(ARMY_FORMATION_CREATOR_EDITOR_ID);
    if (editor === null) {
      throw new Error(
        `Army formation creator editor is missing. id=${JSON.stringify(ARMY_FORMATION_CREATOR_EDITOR_ID)}.`,
      );
    }

    editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${ARMY_FORMATION_HERO_BUTTON_CLASS} ${ARMY_FORMATION_HERO_FADE_CLASS} is-delayed-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function ArmyFormationCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const hero = getArmyFormationCreatorHero(locale);

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 md:pt-40 md:pb-32 text-center text-foreground">
      <ArmyFormationHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="army-formation-creator-heading"
          className={`${ARMY_FORMATION_HERO_FADE_CLASS} mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {hero.lead}{' '}
          <br />
          <span className="relative inline-block">
            <span className="text-5xl font-normal sm:text-6xl md:text-7xl">{hero.emphasis}</span>
            <ArmyFormationHeroUnderline />
          </span>
        </h1>
        <p
          className={`${ARMY_FORMATION_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {hero.subtitle}
        </p>
        <ArmyFormationHeroButton label={hero.action} />
      </div>
    </section>
  );
}
