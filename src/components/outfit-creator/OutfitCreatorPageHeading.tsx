'use client';

import { useRef } from 'react';

import type { SiteLocale } from '@/lib/site-locale';
import { getOutfitCreatorCopy } from '@/lib/outfit-creator/copy';

export const OUTFIT_CREATOR_EDITOR_ID = 'outfit-creator-editor';

const OUTFIT_HERO_FADE_CLASS = 'outfit-creator-hero-fade';
const OUTFIT_HERO_UNDERLINE_CLASS = 'outfit-creator-hero-underline';
const OUTFIT_HERO_BUTTON_CLASS = 'outfit-creator-hero-button';
const OUTFIT_HERO_BOUNCE_CLASS = 'is-bouncing';

function requireOutfitCreatorHeroButton(button: HTMLButtonElement | null): HTMLButtonElement {
  if (button === null) {
    throw new Error('Outfit creator hero button is missing. Received null.');
  }

  return button;
}

function requireOutfitCreatorEditor(): HTMLElement {
  const editor = document.getElementById(OUTFIT_CREATOR_EDITOR_ID);
  if (editor === null) {
    throw new Error(
      `Outfit creator editor is missing. id=${JSON.stringify(OUTFIT_CREATOR_EDITOR_ID)}.`,
    );
  }

  return editor;
}

function startOutfitCreatorHeroButtonBounce(button: HTMLButtonElement): void {
  button.classList.add(OUTFIT_HERO_BOUNCE_CLASS);
  window.setTimeout(() => button.classList.remove(OUTFIT_HERO_BOUNCE_CLASS), 300);
}

function scrollToOutfitCreatorEditor(editor: HTMLElement): void {
  editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function OutfitCreatorHeroStyles() {
  return (
    <style>{`
      .${OUTFIT_HERO_UNDERLINE_CLASS} {
        position: absolute;
        left: 0;
        width: 100%;
        top: 100%;
        margin-top: -5px;
        pointer-events: none;
      }

      @keyframes outfit-creator-hero-fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .${OUTFIT_HERO_FADE_CLASS} {
        animation: outfit-creator-hero-fade-in-up 0.6s ease-out both;
      }

      .${OUTFIT_HERO_FADE_CLASS}.is-delayed-1 { animation-delay: 0.2s; }
      .${OUTFIT_HERO_FADE_CLASS}.is-delayed-2 { animation-delay: 0.4s; }

      .${OUTFIT_HERO_BUTTON_CLASS} {
        transition: none;
      }

      @keyframes outfit-creator-hero-button-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      .${OUTFIT_HERO_BUTTON_CLASS}.${OUTFIT_HERO_BOUNCE_CLASS} {
        animation: outfit-creator-hero-button-bounce 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
      }

      .${OUTFIT_HERO_BUTTON_CLASS}:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .${OUTFIT_HERO_FADE_CLASS},
        .${OUTFIT_HERO_BUTTON_CLASS}.${OUTFIT_HERO_BOUNCE_CLASS} {
          animation: none;
        }
      }
    `}</style>
  );
}

function OutfitCreatorHeroUnderline() {
  return (
    <svg
      className={OUTFIT_HERO_UNDERLINE_CLASS}
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

function getOutfitCreatorHeroTitleParts(
  title: string,
  locale: SiteLocale,
): { readonly lead: string; readonly emphasis: string; readonly tail: string } {
  const emphasis = locale === 'en' ? 'Outfit Creator' : '角色服装搭配工具';
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Outfit creator hero title is missing emphasis ${JSON.stringify(emphasis)} for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(title)}.`,
    );
  }

  return {
    lead: title.slice(0, emphasisStart),
    emphasis,
    tail: title.slice(emphasisStart + emphasis.length),
  };
}

function OutfitCreatorHeroButton({ label }: { label: string }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const button = requireOutfitCreatorHeroButton(buttonRef.current);
    const editor = requireOutfitCreatorEditor();

    startOutfitCreatorHeroButtonBounce(button);
    scrollToOutfitCreatorEditor(editor);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${OUTFIT_HERO_BUTTON_CLASS} ${OUTFIT_HERO_FADE_CLASS} is-delayed-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-8 py-6 text-base font-medium text-background`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export function OutfitCreatorPageHeading({ locale }: { locale: SiteLocale }) {
  const copy = getOutfitCreatorCopy(locale);
  const heroTitleParts = getOutfitCreatorHeroTitleParts(copy.heading, locale);

  return (
    <section
      className="flex min-h-screen items-center justify-center px-4 pt-32 pb-24 text-center text-foreground md:pt-40 md:pb-32"
      aria-labelledby="outfit-creator-heading"
    >
      <OutfitCreatorHeroStyles />
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1
          id="outfit-creator-heading"
          className={`${OUTFIT_HERO_FADE_CLASS} mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl`}
        >
          {heroTitleParts.lead}
          <span className={`relative inline-block ${locale === 'zh' ? 'mb-8 sm:mb-12' : ''}`}>
            <span
              className={`font-display ${locale === 'zh' ? 'text-[clamp(1.75rem,10vw,3rem)] whitespace-nowrap' : 'text-5xl'} font-normal italic tracking-normal sm:text-6xl md:text-7xl`}
            >
              {heroTitleParts.emphasis}
            </span>
            <OutfitCreatorHeroUnderline />
          </span>
          {heroTitleParts.tail}
        </h1>

        <p
          id="outfit-creator-hero-description"
          className={`${OUTFIT_HERO_FADE_CLASS} is-delayed-1 mx-auto mb-9 max-w-2xl text-base leading-snug text-muted-foreground sm:text-lg`}
        >
          {copy.description}
        </p>
        <OutfitCreatorHeroButton label={copy.heroAction} />
      </div>
    </section>
  );
}
