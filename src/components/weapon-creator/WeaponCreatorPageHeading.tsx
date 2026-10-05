'use client';

import { useRef } from 'react';

import { getWeaponCreatorCopy } from '@/lib/weapon-creator/copy';
import { WEAPON_CREATOR_EDITOR_ID } from '@/lib/weapon-creator/constants';
import type { SiteLocale } from '@/lib/site-locale';

const WEAPON_HERO_FADE_CLASS = 'weapon-creator-hero-fade';
const WEAPON_HERO_UNDERLINE_CLASS = 'weapon-creator-hero-underline';
const WEAPON_HERO_BUTTON_CLASS = 'weapon-creator-hero-button';
const WEAPON_HERO_BOUNCE_CLASS = 'is-bouncing';

function requireWeaponCreatorHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Weapon creator hero button is missing. Received null.');
  }

  return button;
}

function requireWeaponCreatorEditor(): HTMLElement {
  const editor = document.getElementById(WEAPON_CREATOR_EDITOR_ID);
  if (editor === null) {
    throw new Error(
      `Weapon creator editor is missing. id=${JSON.stringify(WEAPON_CREATOR_EDITOR_ID)}.`,
    );
  }

  return editor;
}

function startWeaponCreatorHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(WEAPON_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(WEAPON_HERO_BOUNCE_CLASS), 300);
}

function scrollToWeaponCreatorEditor(editor: HTMLElement): void {
  editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function WeaponCreatorHeroStyles() {
  return (
    <style>{`
      .${WEAPON_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes weapon-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${WEAPON_HERO_FADE_CLASS} {
        animation: weapon-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .${WEAPON_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${WEAPON_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${WEAPON_HERO_BUTTON_CLASS} { transition: none; }

      @keyframes weapon-creator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${WEAPON_HERO_BUTTON_CLASS}.${WEAPON_HERO_BOUNCE_CLASS} {
        animation: weapon-creator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${WEAPON_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${WEAPON_HERO_FADE_CLASS},
        .${WEAPON_HERO_BUTTON_CLASS}.${WEAPON_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function WeaponCreatorHeroUnderline() {
  return (
    <svg
      className={WEAPON_HERO_UNDERLINE_CLASS}
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

function getWeaponCreatorHeroTitleParts(
  title: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = locale === 'en' ? 'Weapon Creator' : '奇幻武器拼装工具';
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Weapon creator hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function WeaponCreatorHeroButton({ label }: { label: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const button = requireWeaponCreatorHeroButton(buttonRef.current);
    const editor = requireWeaponCreatorEditor();

    startWeaponCreatorHeroButtonBounce(button);
    scrollToWeaponCreatorEditor(editor);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${WEAPON_HERO_BUTTON_CLASS} ${WEAPON_HERO_FADE_CLASS} is-delayed-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function WeaponCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const copy = getWeaponCreatorCopy(locale);
  const heroTitleParts = getWeaponCreatorHeroTitleParts(copy.heading, locale);

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="weapon-creator-heading"
    >
      <WeaponCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="weapon-creator-heading"
          className={`${WEAPON_HERO_FADE_CLASS} mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {heroTitleParts.lead}
          <span className={`relative inline-block ${locale === 'zh' ? 'mb-8 sm:mb-12' : ''}`}>
            <span
              className={`font-display ${locale === 'zh' ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap' : 'text-5xl'} font-normal italic tracking-normal sm:text-6xl md:text-7xl`}
            >
              {heroTitleParts.emphasis}
            </span>
            <WeaponCreatorHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>

        <p
          id="weapon-creator-hero-description"
          className={`${WEAPON_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.description}
        </p>
        <WeaponCreatorHeroButton label={copy.heroAction} />
      </div>
    </section>
  );
}
